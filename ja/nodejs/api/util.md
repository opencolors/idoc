---
title: Node.js ドキュメント - ユーティリティ
description: Node.jsの 'util' モジュールのドキュメントで、Node.jsアプリケーションのためのユーティリティ機能を提供します。デバッグ、オブジェクトの検査などが含まれます。
head:
  - - meta
    - name: og:title
      content: Node.js ドキュメント - ユーティリティ | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsの 'util' モジュールのドキュメントで、Node.jsアプリケーションのためのユーティリティ機能を提供します。デバッグ、オブジェクトの検査などが含まれます。
  - - meta
    - name: twitter:title
      content: Node.js ドキュメント - ユーティリティ | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsの 'util' モジュールのドキュメントで、Node.jsアプリケーションのためのユーティリティ機能を提供します。デバッグ、オブジェクトの検査などが含まれます。
---


# Util {#util}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [Stability: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

`node:util` モジュールは、Node.js 内部 API のニーズをサポートします。 多くのユーティリティは、アプリケーションおよびモジュールの開発者にとっても役立ちます。 アクセスするには:

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**追加:** v8.2.0

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `async` 関数
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) コールバック形式の関数

`async` 関数（または `Promise` を返す関数）を受け取り、error-first コールバック形式の関数を返します。つまり、最後の引数として `(err, value) => ...` コールバックを取ります。 コールバックでは、最初の引数は拒否の理由（または `Promise` が解決された場合は `null`）となり、2 番目の引数は解決された値となります。

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
出力:

```text [TEXT]
hello world
```
コールバックは非同期的に実行され、スタックトレースが制限されます。 コールバックが例外をスローすると、プロセスは [`'uncaughtException'` イベント](/ja/nodejs/api/process#event-uncaughtexception) を発生させ、処理されない場合は終了します。

`null` はコールバックの最初の引数として特別な意味を持つため、ラップされた関数が falsy 値を理由として `Promise` を拒否した場合、値は `reason` という名前のフィールドに元の値が格納された `Error` でラップされます。

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // Promise が `null` で拒否された場合、Error でラップされ、
  // 元の値は `reason` に格納されます。
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**Added in: v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `debuglog` 関数が作成されるアプリケーションの部分を特定する文字列。
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ロギング関数が最初に呼び出されたときに、より最適化されたロギング関数である関数引数と共に呼び出されるコールバック。
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) ロギング関数

`util.debuglog()` メソッドは、`NODE_DEBUG` 環境変数の存在に基づいて、デバッグメッセージを条件付きで `stderr` に書き込む関数を作成するために使用されます。`section` 名がその環境変数の値の中に現れた場合、返される関数は [`console.error()`](/ja/nodejs/api/console#consoleerrordata-args) と同様に動作します。そうでない場合、返される関数は何もしません。

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('hello from foo [%d]', 123);
```
このプログラムが環境内で `NODE_DEBUG=foo` を指定して実行された場合、次のような出力が生成されます。

```bash [BASH]
FOO 3245: hello from foo [123]
```
ここで `3245` はプロセス ID です。その環境変数が設定された状態で実行されない場合、何も出力されません。

`section` はワイルドカードもサポートしています:

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('hi there, it\'s foo-bar [%d]', 2333);
```
環境内で `NODE_DEBUG=foo*` を指定して実行された場合、次のような出力が生成されます。

```bash [BASH]
FOO-BAR 3257: hi there, it's foo-bar [2333]
```
コンマ区切りの複数の `section` 名を `NODE_DEBUG` 環境変数で指定できます: `NODE_DEBUG=fs,net,tls`。

オプションの `callback` 引数は、初期化や不要なラッピングのない別の関数でロギング関数を置き換えるために使用できます。

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // セクションが有効になっているかどうかのテストを最適化する
  // ロギング関数に置き換えます
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**Added in: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`util.debuglog().enabled` ゲッターは、`NODE_DEBUG` 環境変数の存在に基づいて条件で使用できるテストを作成するために使用されます。`section` 名がその環境変数の値に含まれている場合、返される値は `true` になります。そうでない場合、返される値は `false` になります。

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```
このプログラムが `NODE_DEBUG=foo` を環境変数に設定して実行された場合、次のような出力が得られます。

```bash [BASH]
hello from foo [123]
```
## `util.debug(section)` {#utildebugsection}

**Added in: v14.9.0**

`util.debuglog` のエイリアス。`util.debuglog().enabled` のみを使用する場合に、ログ記録を意味しないようにするための可読性を高めます。

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.0.0 | 非推奨警告は、コードごとに一度だけ出力されます。 |
| v0.8.0 | Added in: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 非推奨となる関数。
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 非推奨の関数が呼び出されたときに表示する警告メッセージ。
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 非推奨コード。[非推奨 API のリスト](/ja/nodejs/api/deprecations#list-of-deprecated-apis)でコードのリストを確認してください。
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 警告を発生させるようにラップされた非推奨の関数。

`util.deprecate()` メソッドは、`fn` (関数またはクラス) を非推奨としてマークされるようにラップします。

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // 何か処理を行う。
}, 'obsoleteFunction() は非推奨です。代わりに newShinyFunction() を使用してください。');
```
呼び出されると、`util.deprecate()` は [`'warning'`](/ja/nodejs/api/process#event-warning) イベントを使用して `DeprecationWarning` を発生させる関数を返します。警告は、返された関数が最初に呼び出されたときに発生し、`stderr` に出力されます。警告が発生した後、ラップされた関数は警告を発生させることなく呼び出されます。

同じオプションの `code` が `util.deprecate()` の複数の呼び出しで指定された場合、警告はその `code` に対して一度だけ発生します。

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // コード DEP0001 で非推奨警告が発生します
fn2(); // 同じコードのため、非推奨警告は発生しません
```
`--no-deprecation` または `--no-warnings` コマンドラインフラグが使用されている場合、または最初の非推奨警告の *前* に `process.noDeprecation` プロパティが `true` に設定されている場合、`util.deprecate()` メソッドは何もしません。

`--trace-deprecation` または `--trace-warnings` コマンドラインフラグが設定されている場合、または `process.traceDeprecation` プロパティが `true` に設定されている場合、非推奨の関数が最初に呼び出されたときに、警告とスタックトレースが `stderr` に出力されます。

`--throw-deprecation` コマンドラインフラグが設定されているか、`process.throwDeprecation` プロパティが `true` に設定されている場合、非推奨の関数が呼び出されたときに例外がスローされます。

`--throw-deprecation` コマンドラインフラグと `process.throwDeprecation` プロパティは、`--trace-deprecation` と `process.traceDeprecation` よりも優先されます。


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v12.11.0 | `%c` 指定子は無視されるようになりました。 |
| v12.0.0 | `format` 引数は、実際に書式指定子が含まれている場合にのみ、そのように扱われるようになりました。 |
| v12.0.0 | `format` 引数が書式文字列でない場合、出力文字列の書式は最初の引数の型に依存しなくなりました。この変更により、最初の引数が文字列でない場合に出力されていた文字列から以前に存在していた引用符が削除されます。 |
| v11.4.0 | `%d`、`%f`、および `%i` 指定子は、Symbol を適切にサポートするようになりました。 |
| v11.4.0 | `%o` 指定子の `depth` のデフォルトの深さが再び 4 になりました。 |
| v11.0.0 | `%o` 指定子の `depth` オプションは、デフォルトの深さにフォールバックするようになりました。 |
| v10.12.0 | `%d` および `%i` 指定子は、BigInt をサポートするようになりました。 |
| v8.4.0 | `%o` および `%O` 指定子がサポートされるようになりました。 |
| v0.5.3 | 追加: v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `printf` のような書式文字列。

`util.format()` メソッドは、最初の引数を `printf` のような書式文字列として使用して、書式化された文字列を返します。この書式文字列には、0 個以上の書式指定子を含めることができます。各指定子は、対応する引数からの変換された値に置き換えられます。サポートされている指定子は次のとおりです。

- `%s`: `String` は、`BigInt`、`Object`、および `-0` を除くすべての値を変換するために使用されます。`BigInt` 値は `n` で表され、ユーザー定義の `toString` 関数を持たないオブジェクトは、`{ depth: 0, colors: false, compact: 3 }` オプションを指定して `util.inspect()` を使用して検査されます。
- `%d`: `Number` は、`BigInt` および `Symbol` を除くすべての値を変換するために使用されます。
- `%i`: `parseInt(value, 10)` は、`BigInt` および `Symbol` を除くすべての値に使用されます。
- `%f`: `parseFloat(value)` は、`Symbol` を除くすべての値に使用されます。
- `%j`: JSON。引数に循環参照が含まれている場合は、文字列 `'[Circular]'` に置き換えられます。
- `%o`: `Object`。一般的な JavaScript オブジェクトの書式設定を使用したオブジェクトの文字列表現。`{ showHidden: true, showProxy: true }` オプションを指定した `util.inspect()` と同様です。これにより、列挙不可能なプロパティとプロキシを含む完全なオブジェクトが表示されます。
- `%O`: `Object`。一般的な JavaScript オブジェクトの書式設定を使用したオブジェクトの文字列表現。オプションなしの `util.inspect()` と同様です。これにより、列挙不可能なプロパティとプロキシを含まない完全なオブジェクトが表示されます。
- `%c`: `CSS`。この指定子は無視され、渡された CSS はスキップされます。
- `%%`: 単一のパーセント記号 (`'%'`)。これは引数を消費しません。
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 書式化された文字列

指定子に対応する引数がない場合、それは置き換えられません。

```js [ESM]
util.format('%s:%s', 'foo');
// 戻り値: 'foo:%s'
```
書式文字列の一部ではない値は、その型が `string` でない場合、`util.inspect()` を使用して書式設定されます。

`util.format()` メソッドに渡される引数の数が指定子の数よりも多い場合、余分な引数はスペースで区切られて返される文字列に連結されます。

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// 戻り値: 'foo:bar baz'
```
最初の引数に有効な書式指定子が含まれていない場合、`util.format()` は、すべての引数をスペースで区切って連結した文字列を返します。

```js [ESM]
util.format(1, 2, 3);
// 戻り値: '1 2 3'
```
引数が 1 つだけ `util.format()` に渡される場合、書式設定なしでそのまま返されます。

```js [ESM]
util.format('%% %s');
// 戻り値: '%% %s'
```
`util.format()` は、デバッグツールとして意図された同期メソッドです。一部の入力値は、イベントループをブロックする可能性のある重大なパフォーマンスオーバーヘッドを持つ可能性があります。この関数は注意して使用し、ホットコードパスでは絶対に使用しないでください。


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**Added in: v10.0.0**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

この関数は [`util.format()`](/ja/nodejs/api/util#utilformatformat-args) と同一ですが、[`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) に渡されるオプションを指定する `inspectOptions` 引数を取る点が異なります。

```js [ESM]
util.formatWithOptions({ colors: true }, 'オブジェクト %O を参照', { foo: 42 });
// ターミナルに出力する際、`42` が数値として色付けされる 'オブジェクト { foo: 42 }' を返します。
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index)。1 - 活発な開発
:::


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.3.0 | API が `util.getCallSite` から `util.getCallSites()` にリネームされました。 |
| v22.9.0 | Added in: v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) コールサイトオブジェクトとしてキャプチャするフレームのオプションの数。**デフォルト:** `10`。許容範囲は 1 から 200 の間です。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) オプション
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ソースマップからスタックトレース内の元の場所を再構築します。 フラグ `--enable-source-maps` でデフォルトで有効になっています。
  
 
- 戻り値: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) コールサイトオブジェクトの配列
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) このコールサイトに関連付けられた関数の名前を返します。
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) このコールサイトの関数のスクリプトを含むリソースの名前を返します。
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関連付けられた関数呼び出しの行番号 (1 から始まる) を返します。
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関連付けられた関数呼び出しの行の 1 から始まる列オフセットを返します。
  
 

呼び出し元関数のスタックを含むコールサイトオブジェクトの配列を返します。

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.column}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// 別のスタックレイヤーをシミュレートする関数
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
オプション `sourceMap` を `true` に設定することで、元の場所を再構築できます。 ソースマップが利用できない場合、元の場所は現在の場所と同じになります。 `--enable-source-maps` フラグが有効になっている場合、たとえば `--experimental-transform-types` を使用している場合、`sourceMap` はデフォルトで true になります。

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// With sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Without sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**Added in: v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js API から発生した数値エラーコードに対する文字列名を返します。エラーコードとエラー名のマッピングはプラットフォームに依存します。一般的なエラーの名前については、[一般的なシステムエラー](/ja/nodejs/api/errors#common-system-errors)を参照してください。

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**Added in: v16.0.0, v14.17.0**

- 戻り値: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Node.js API から利用可能なすべてのシステムエラーコードの Map を返します。エラーコードとエラー名のマッピングはプラットフォームに依存します。一般的なエラーの名前については、[一般的なシステムエラー](/ja/nodejs/api/errors#common-system-errors)を参照してください。

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**Added in: v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js API から発生した数値エラーコードに対する文字列メッセージを返します。エラーコードと文字列メッセージのマッピングはプラットフォームに依存します。

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v5.0.0 | `constructor` パラメーターが ES6 クラスを参照できるようになりました。 |
| v0.3.0 | Added in: v0.3.0 |
:::

::: info [安定性: 3 - レガシー]
[安定性: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに ES2015 クラス構文と `extends` キーワードを使用してください。
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

`util.inherits()` の使用は推奨されません。言語レベルの継承サポートを得るには、ES6 の `class` および `extends` キーワードを使用してください。また、2 つのスタイルは[意味的に互換性がない](https://github.com/nodejs/node/issues/4179)ことにも注意してください。

プロトタイプメソッドを 1 つの [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) から別の constructor に継承します。`constructor` のプロトタイプは、`superConstructor` から作成された新しいオブジェクトに設定されます。

これは主に、`Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)` の上にいくつかの入力検証を追加します。追加の便宜として、`superConstructor` は `constructor.super_` プロパティからアクセスできます。

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
`class` と `extends` を使用した ES6 の例:

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [History]
| Version | Changes |
| --- | --- |
| v16.18.0 | `Set` および `Map` を検査する際の `maxArrayLength` のサポートを追加します。 |
| v17.3.0, v16.14.0 | `numericSeparator` オプションがサポートされるようになりました。 |
| v13.0.0 | 循環参照に参照へのマーカーが含まれるようになりました。 |
| v14.6.0, v12.19.0 | `object` が別の `vm.Context` からのものである場合、そのカスタム検査関数はコンテキスト固有の引数を受け取らなくなりました。 |
| v13.13.0, v12.17.0 | `maxStringLength` オプションがサポートされるようになりました。 |
| v13.5.0, v12.16.0 | `showHidden` が `true` の場合、ユーザー定義のプロトタイププロパティが検査されます。 |
| v12.0.0 | `compact` オプションのデフォルトが `3` に変更され、`breakLength` オプションのデフォルトが `80` に変更されました。 |
| v12.0.0 | 内部プロパティは、カスタム検査関数のコンテキスト引数に表示されなくなりました。 |
| v11.11.0 | `compact` オプションは、新しい出力モードの数値を受け入れます。 |
| v11.7.0 | ArrayBuffer はバイナリコンテンツも表示するようになりました。 |
| v11.5.0 | `getters` オプションがサポートされるようになりました。 |
| v11.4.0 | `depth` のデフォルトが `2` に戻りました。 |
| v11.0.0 | `depth` のデフォルトが `20` に変更されました。 |
| v11.0.0 | 検査出力は約 128 MiB に制限されるようになりました。 そのサイズを超えるデータは完全に検査されません。 |
| v10.12.0 | `sorted` オプションがサポートされるようになりました。 |
| v10.6.0 | リンクリストや同様のオブジェクトは、最大コールスタックサイズまで検査できるようになりました。 |
| v10.0.0 | `WeakMap` および `WeakSet` のエントリも検査できるようになりました。 |
| v9.9.0 | `compact` オプションがサポートされるようになりました。 |
| v6.6.0 | カスタム検査関数が `this` を返すことができるようになりました。 |
| v6.3.0 | `breakLength` オプションがサポートされるようになりました。 |
| v6.1.0 | `maxArrayLength` オプションがサポートされるようになりました。特に、長い配列はデフォルトで切り捨てられます。 |
| v6.1.0 | `showProxy` オプションがサポートされるようになりました。 |
| v0.3.0 | Added in: v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 任意の JavaScript プリミティブまたは `Object`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`object` の列挙不可能なシンボルとプロパティが、フォーマットされた結果に含まれます。 [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) と [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) のエントリも、ユーザー定義のプロトタイププロパティ（メソッドプロパティを除く）と同様に含まれます。 **デフォルト:** `false`。
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `object` のフォーマット中に再帰する回数を指定します。 これは、大きなオブジェクトを検査するのに役立ちます。 最大コールスタックサイズまで再帰するには、`Infinity` または `null` を渡します。 **デフォルト:** `2`。
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、出力は ANSI カラーコードでスタイルされます。 色はカスタマイズ可能です。 [Customizing `util.inspect` colors](/ja/nodejs/api/util#customizing-utilinspect-colors) を参照してください。 **デフォルト:** `false`。
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` の場合、`[util.inspect.custom](depth, opts, inspect)` 関数は呼び出されません。 **デフォルト:** `true`。
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`Proxy` 検査には [`target` および `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology) オブジェクトが含まれます。 **デフォルト:** `false`。
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フォーマット時に含める `Array`、[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)、[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)、[`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)、[`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)、および [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) 要素の最大数を指定します。 すべての要素を表示するには、`null` または `Infinity` に設定します。 要素を表示しないようにするには、`0` または負の値に設定します。 **デフォルト:** `100`。
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フォーマット時に含める文字の最大数を指定します。 すべての要素を表示するには、`null` または `Infinity` に設定します。 文字を表示しないようにするには、`0` または負の値に設定します。 **デフォルト:** `10000`。
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 入力値を複数行に分割する長さ。 入力を 1 行としてフォーマットするには、`Infinity` に設定します（`compact` を `true` または `1` 以上の数値に設定した場合と組み合わせます）。 **デフォルト:** `80`。
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) これを `false` に設定すると、各オブジェクトキーが新しい行に表示されます。 `breakLength` よりも長いテキストの改行で分割されます。 数値に設定すると、すべてのプロパティが `breakLength` に収まる限り、最も内側の `n` 個の要素が 1 行にまとめられます。 短い配列要素もグループ化されます。 詳細については、以下の例を参照してください。 **デフォルト:** `3`。
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `true` または関数の場合、オブジェクトのすべてのプロパティ、および `Set` および `Map` エントリは、結果の文字列でソートされます。 `true` に設定した場合、[デフォルトのソート](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)が使用されます。 関数に設定した場合、[比較関数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters)として使用されます。
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `true` に設定すると、getter が検査されます。 `'get'` に設定すると、対応する setter のない getter のみが検査されます。 `'set'` に設定すると、対応する setter を持つ getter のみが検査されます。 これにより、getter 関数によっては副作用が発生する可能性があります。 **デフォルト:** `false`。
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` に設定すると、すべての bigint および数値で、3 桁ごとにアンダースコアを使用して区切られます。 **デフォルト:** `false`。
  
 
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `object` の表現。

`util.inspect()` メソッドは、デバッグを目的とした `object` の文字列表現を返します。 `util.inspect` の出力はいつでも変更される可能性があり、プログラムで依存すべきではありません。 結果を変更する追加の `options` を渡すことができます。 `util.inspect()` は、コンストラクターの名前および/または `@@toStringTag` を使用して、検査された値の識別可能なタグを作成します。

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
循環参照は、参照インデックスを使用してアンカーを指します。

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
次の例では、`util` オブジェクトのすべてのプロパティを検査します。

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
次の例は、`compact` オプションの効果を強調しています。

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Setting `compact` to false or an integer creates more reader friendly output.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
// single line.
```
`showHidden` オプションを使用すると、[`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) および [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) エントリを検査できます。 `maxArrayLength` より多くのエントリがある場合、どのエントリが表示されるかの保証はありません。 これは、同じ [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) エントリを 2 回取得すると、異なる出力になる可能性があることを意味します。 さらに、残りの強い参照がないエントリは、いつでもガベージコレクションされる可能性があります。

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
`sorted` オプションを使用すると、オブジェクトのプロパティの挿入順序が `util.inspect()` の結果に影響を与えないようにすることができます。

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
`numericSeparator` オプションは、すべての数値に 3 桁ごとにアンダースコアを追加します。

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` は、デバッグを目的とした同期メソッドです。 その最大出力長は約 128 MiB です。 より長い出力になる入力は切り捨てられます。


### `util.inspect`の色をカスタマイズする {#customizing-utilinspect-colors}

`util.inspect`の色出力（有効な場合）は、`util.inspect.styles`および`util.inspect.colors`プロパティを介してグローバルにカスタマイズできます。

`util.inspect.styles`は、スタイル名を`util.inspect.colors`の色に関連付けるマップです。

デフォルトのスタイルと関連付けられた色は次のとおりです。

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (スタイルなし)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (例: `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

色のスタイルはANSI制御コードを使用しており、一部の端末ではサポートされていない場合があります。色のサポートを確認するには、[`tty.hasColors()`](/ja/nodejs/api/tty#writestreamhascolorscount-env)を使用してください。

定義済みの制御コードを以下に示します（「修飾子」、「前景色」、「背景色」としてグループ化されています）。

#### 修飾子 {#modifiers}

修飾子のサポートは端末によって異なります。サポートされていない場合は、ほとんど無視されます。

- `reset` - すべての（色の）修飾子をデフォルトにリセットします
- **bold** - テキストを太字にします
- *italic* - テキストを斜体にします
- underline - テキストに下線を引きます
- ~~strikethrough~~ - テキストの中央に水平線を追加します (エイリアス: `strikeThrough`, `crossedout`, `crossedOut`)
- `hidden` - テキストを出力しますが、見えなくします (エイリアス: conceal)
- dim - 色の強度を下げます (エイリアス: `faint`)
- overlined - テキストに上線を引きます
- blink - テキストを一定の間隔で表示および非表示にします
- inverse - 前景色と背景色を入れ替えます (エイリアス: `swapcolors`, `swapColors`)
- doubleunderline - テキストに二重線を引きます (エイリアス: `doubleUnderline`)
- framed - テキストの周りに枠を描画します

#### 前景色 {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (エイリアス: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### 背景色 {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (エイリアス: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### オブジェクトのカスタム検査関数 {#custom-inspection-functions-on-objects}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v17.3.0, v16.14.0 | 互換性を高めるために、inspect 引数が追加されました。 |
| v0.1.97 | 追加: v0.1.97 |
:::

オブジェクトは、独自の [`[util.inspect.custom](depth, opts, inspect)`](/ja/nodejs/api/util#utilinspectcustom) 関数を定義することもできます。`util.inspect()` は、オブジェクトを検査するときにこの関数を呼び出し、その結果を使用します。

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // "Box< " のサイズに合わせて 5 つのスペースをパディングします。
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// 返り値: "Box< true >"
```
カスタム `[util.inspect.custom](depth, opts, inspect)` 関数は通常、文字列を返しますが、`util.inspect()` によって適切にフォーマットされる任意の型の値を返す場合があります。

```js [ESM]
const util = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// 返り値: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v10.12.0 | これは共有シンボルとして定義されるようになりました。 |
| v6.6.0 | 追加: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) カスタム検査関数を宣言するために使用できます。

`util.inspect.custom` からアクセスできることに加えて、このシンボルは [グローバルに登録](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) されており、`Symbol.for('nodejs.util.inspect.custom')` として任意の環境でアクセスできます。

これを使用すると、コードを移植可能な方法で記述できるため、カスタム検査関数は Node.js 環境で使用され、ブラウザでは無視されます。 `util.inspect()` 関数自体は、さらなる移植性を可能にするために、カスタム検査関数の 3 番目の引数として渡されます。

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Password <xxxxxxxx> と出力されます。
```
詳細については、[オブジェクトのカスタム検査関数](/ja/nodejs/api/util#custom-inspection-functions-on-objects) を参照してください。


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**追加: v6.4.0**

`defaultOptions` の値を使うと、`util.inspect` が使用するデフォルトのオプションをカスタマイズできます。これは、暗黙的に `util.inspect` を呼び出す `console.log` や `util.format` のような関数に役立ちます。これは、1つまたは複数の有効な [`util.inspect()`](/ja/nodejs/api/util#utilinspectobject-options) オプションを含むオブジェクトに設定されるべきです。オプションのプロパティを直接設定することもサポートされています。

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // 切り捨てられた配列をログ出力
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // 完全な配列をログ出力
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**追加: v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`val1` と `val2` の間に厳密な深い等価性がある場合、`true` を返します。 そうでない場合は、`false` を返します。

厳密な深い等価性に関する詳細は、[`assert.deepStrictEqual()`](/ja/nodejs/api/assert#assertdeepstrictequalactual-expected-message) を参照してください。

## クラス: `util.MIMEType` {#class-utilmimetype}

**追加: v19.1.0, v18.13.0**

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

[MIMEType クラス](https://bmeck.github.io/node-proposal-mime-api/)の実装。

ブラウザの慣例に従い、`MIMEType` オブジェクトのすべてのプロパティは、オブジェクト自体のデータプロパティとしてではなく、クラスプロトタイプのゲッターとセッターとして実装されます。

MIME 文字列は、複数の意味のあるコンポーネントを含む構造化された文字列です。 パースされると、これらのコンポーネントのそれぞれに対するプロパティを含む `MIMEType` オブジェクトが返されます。

### コンストラクタ: `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) パースする入力 MIME

`input` をパースして、新しい `MIMEType` オブジェクトを作成します。



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

`input` が有効な MIME でない場合、`TypeError` がスローされます。 与えられた値は文字列に強制されることに注意してください。 例えば：



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

MIME の type 部分を取得および設定します。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

MIME の subtype 部分を取得および設定します。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

MIME の essence を取得します。 このプロパティは読み取り専用です。 MIME を変更するには、`mime.type` または `mime.subtype` を使用します。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/ja/nodejs/api/util#class-utilmimeparams)

MIME のパラメータを表す [`MIMEParams`](/ja/nodejs/api/util#class-utilmimeparams) オブジェクトを取得します。このプロパティは読み取り専用です。詳細は [`MIMEParams`](/ja/nodejs/api/util#class-utilmimeparams) のドキュメントを参照してください。

### `mime.toString()` {#mimetostring}

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`MIMEType` オブジェクトの `toString()` メソッドは、シリアライズされた MIME を返します。

標準準拠の必要性から、このメソッドでは MIME のシリアライズ処理をユーザーがカスタマイズすることはできません。

### `mime.toJSON()` {#mimetojson}

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[`mime.toString()`](/ja/nodejs/api/util#mimetostring) のエイリアスです。

このメソッドは、`MIMEType` オブジェクトが [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) でシリアライズされるときに自動的に呼び出されます。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## Class: `util.MIMEParams` {#class-utilmimeparams}

**Added in: v19.1.0, v18.13.0**

`MIMEParams` API は、`MIMEType` のパラメータに対する読み取りおよび書き込みアクセスを提供します。

### Constructor: `new MIMEParams()` {#constructor-new-mimeparams}

空のパラメータで新しい `MIMEParams` オブジェクトを作成します。

::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

名前が `name` であるすべての名前と値のペアを削除します。


### `mimeParams.entries()` {#mimeparamsentries}

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

パラメータ内の名前と値のペアそれぞれに対するイテレータを返します。イテレータの各項目は JavaScript の `Array` です。配列の最初の項目は `name` で、2 番目の項目は `value` です。

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 指定された `name` を持つ名前と値のペアが存在しない場合は、文字列または `null`。

名前が `name` である最初の名前と値のペアの値を返します。そのようなペアがない場合は、`null` が返されます。

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

名前が `name` である名前と値のペアが少なくとも 1 つ存在する場合は `true` を返します。

### `mimeParams.keys()` {#mimeparamskeys}

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

名前と値のペアそれぞれの名前に対するイテレータを返します。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`MIMEParams` オブジェクト内で、`name` に関連付けられた値を `value` に設定します。名前が `name` である既存の名前と値のペアがある場合は、そのようなペアの最初のものの値を `value` に設定します。

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

各名前と値のペアの値に対するイテレーターを返します。

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- 戻り値: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

[`mimeParams.entries()`](/ja/nodejs/api/util#mimeparamsentries) のエイリアス。



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v22.4.0, v20.16.0 | 入力 `config` で負のオプションを許可するサポートを追加。 |
| v20.0.0 | API は実験的ではなくなりました。 |
| v18.11.0, v16.19.0 | 入力 `config` でのデフォルト値のサポートを追加。 |
| v18.7.0, v16.17.0 | 入力 `config` および返されるプロパティで `tokens` を使用して詳細な解析情報を返すサポートを追加。 |
| v18.3.0, v16.17.0 | 追加: v18.3.0, v16.17.0 |
:::

-  `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) パースの引数を提供し、パーサーを設定するために使用されます。 `config` は次のプロパティをサポートします: 
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 引数文字列の配列。 **デフォルト:** `execPath` と `filename` が削除された `process.argv`。
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) パーサーに既知の引数を記述するために使用されます。 `options` のキーはオプションの長い名前であり、値は次のプロパティを受け入れる [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) です: 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 引数の型。`boolean` または `string` のいずれかである必要があります。
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このオプションを複数回指定できるかどうか。 `true` の場合、すべての値が配列に収集されます。 `false` の場合、オプションの値は後勝ちになります。 **デフォルト:** `false`。
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) オプションの単一文字のエイリアス。
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 引数で設定されていない場合のデフォルトのオプション値。 `type` プロパティと同じ型である必要があります。 `multiple` が `true` の場合、配列である必要があります。
  
 
    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 不明な引数が見つかった場合、または `options` で構成された `type` と一致しない引数が渡された場合に、エラーをスローする必要がありますか。 **デフォルト:** `true`。
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) このコマンドが位置引数を受け入れるかどうか。 **デフォルト:** `strict` が `true` の場合は `false`、それ以外の場合は `true`。
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、オプション名の先頭に `--no-` を付けることで、ブール値オプションを明示的に `false` に設定できます。 **デフォルト:** `false`。
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) パースされたトークンを返します。 これは、追加のチェックの追加から、さまざまな方法でトークンを再処理することまで、組み込みの動作を拡張するのに役立ちます。 **デフォルト:** `false`。
  
 
-  戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) パースされたコマンドライン引数: 
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) パースされたオプション名と、その [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) または [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 値のマッピング。
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 位置引数。
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [parseArgs トークン](/ja/nodejs/api/util#parseargs-tokens) セクションを参照してください。 `config` に `tokens: true` が含まれている場合にのみ返されます。
  
 

`process.argv` を直接操作するよりも、コマンドライン引数の解析のためのより高レベルな API を提供します。 予想される引数の仕様を受け取り、解析されたオプションと位置引数を含む構造化されたオブジェクトを返します。



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::


### `parseArgs` `tokens` {#parseargs-tokens}

設定で `tokens: true` を指定することで、カスタム動作を追加するための詳細な解析情報が利用できます。返されるトークンは、以下のプロパティを持ちます。

- すべてのトークン
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 'option'、'positional'、または 'option-terminator' のいずれか。
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) トークンを含む `args` 内の要素のインデックス。したがって、トークンのソース引数は `args[token.index]` です。
  
 
- option トークン
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) オプションの長い名前。
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `args` でのオプションの使用方法。`-f` や `--foo` のようなもの。
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `args` で指定されたオプションの値。boolean オプションの場合は undefined。
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) オプションの値が `--foo=bar` のようにインラインで指定されているかどうか。
  
 
- positional トークン
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `args` 内の位置引数の値（つまり、`args[index]`）。
  
 
- option-terminator トークン

返されるトークンは、入力 `args` で出現した順に並んでいます。`args` で複数回出現するオプションは、使用ごとにトークンを生成します。`-xy` のような短いオプションのグループは、各オプションに対してトークンに展開されます。したがって、`-xxx` は 3 つのトークンを生成します。

たとえば、`--no-color` のような否定オプションのサポートを追加するには（`allowNegative` がオプションの型が `boolean` の場合にサポートします）、返されたトークンを再処理して、否定オプションに格納された値を変更できます。

::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// オプショントークンを再処理し、返された値を上書きします。
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // --no-foo に対して foo:false を格納する
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // --foo と --no-foo の両方がある場合、最後のものが優先されるように値を再保存する。
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// オプショントークンを再処理し、返された値を上書きします。
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // --no-foo に対して foo:false を格納する
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // --foo と --no-foo の両方がある場合、最後のものが優先されるように値を再保存する。
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

否定オプションを示す使用例、およびオプションが複数の方法で使用されている場合、最後のものが優先される場合。

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).1 - 活発な開発
:::

**追加:** v21.7.0, v20.12.0

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`.env` ファイルの生のコンテンツ。

- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`.env` ファイルの例を以下に示します。

::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// 戻り値: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// 戻り値: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.8.0 | `Promise` を返す関数で `promisify` を呼び出すことは非推奨になりました。 |
| v8.0.0 | 追加: v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

一般的なエラーファーストのコールバック形式に従う関数、つまり最後の引数として `(err, value) => ...` コールバックを受け取る関数を受け取り、Promiseを返すバージョンを返します。

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // `stats` で何かを行う
}).catch((error) => {
  // エラーを処理する。
});
```
または、`async function` を使用して同等に記述することもできます。

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`このディレクトリは ${stats.uid} によって所有されています`);
}

callStat();
```
`original[util.promisify.custom]` プロパティが存在する場合、`promisify` はその値を返します。[カスタム promisified 関数](/ja/nodejs/api/util#custom-promisified-functions)を参照してください。

`promisify()` は、すべての場合において、`original` が最後の引数としてコールバックを取る関数であると想定します。`original` が関数でない場合、`promisify()` はエラーをスローします。`original` が関数であっても、最後の引数がエラーファーストのコールバックでない場合でも、エラーファーストのコールバックが最後の引数として渡されます。

クラスメソッドや `this` を使用する他のメソッドで `promisify()` を使用すると、特別な処理をしない限り、期待どおりに動作しない場合があります。

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: undefined のプロパティ 'a' を読み取れません
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### カスタムプロミス化関数 {#custom-promisified-functions}

`util.promisify.custom`シンボルを使用すると、[`util.promisify()`](/ja/nodejs/api/util#utilpromisifyoriginal)の戻り値をオーバーライドできます。

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// 'true'と出力されます
```
これは、元の関数が、エラーファーストのコールバックを最後の引数として取るという標準形式に従っていない場合に役立ちます。

たとえば、`(foo, onSuccessCallback, onErrorCallback)`を受け取る関数では次のようになります。

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
`promisify.custom`が定義されているものの、関数ではない場合、`promisify()`はエラーをスローします。

### `util.promisify.custom` {#utilpromisifycustom}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v13.12.0, v12.16.2 | これは共有シンボルとして定義されました。 |
| v8.0.0 | Added in: v8.0.0 |
:::

- 関数をカスタムプロミス化されたバリアントを宣言するために使用できる[\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)。[カスタムプロミス化関数](/ja/nodejs/api/util#custom-promisified-functions)を参照してください。

このシンボルは、`util.promisify.custom`を通じてアクセスできるだけでなく、[グローバルに登録](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)されており、`Symbol.for('nodejs.util.promisify.custom')`として任意の環境でアクセスできます。

たとえば、`(foo, onSuccessCallback, onErrorCallback)`を受け取る関数では次のようになります。

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**Added in: v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`str` から ANSI エスケープシーケンスを取り除いたものを返します。

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// "value" と表示
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [Stable: 2 - 安定]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定。
:::


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.5.0 | styleText が安定になりました。 |
| v22.8.0, v20.18.0 | isTTY および NO_COLORS、NODE_DISABLE_COLORS、FORCE_COLOR などの環境変数を尊重します。 |
| v21.7.0, v20.12.0 | Added in: v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) `util.inspect.colors` で定義されたテキスト形式またはテキスト形式の配列。
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) フォーマットされるテキスト。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) true の場合、`stream` が色を処理できるかどうかがチェックされます。 **デフォルト:** `true`。
    - `stream` [\<Stream\>](/ja/nodejs/api/stream#stream) 色付け可能かどうか検証されるストリーム。 **デフォルト:** `process.stdout`。
  
 

この関数は、端末に出力するために渡された `format` を考慮して、フォーマットされたテキストを返します。 これは、端末の機能に対応しており、`NO_COLORS`、`NODE_DISABLE_COLORS`、`FORCE_COLOR` 環境変数で設定された構成に従って動作します。

::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // process.stderr に TTY があるか検証
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process');

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // process.stderr に TTY があるか検証
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors` は `italic` や `underline` などのテキスト形式も提供しており、これらを組み合わせることもできます。

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
形式の配列を渡す場合、適用される形式の順序は左から右なので、次のスタイルは前のスタイルを上書きする可能性があります。

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
形式の完全なリストは、[modifiers](/ja/nodejs/api/util#modifiers) にあります。


## クラス: `util.TextDecoder` {#class-utiltextdecoder}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v11.0.0 | このクラスはグローバルオブジェクトで利用可能になりました。 |
| v8.3.0 | Added in: v8.3.0 |
:::

[WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) の `TextDecoder` API の実装。

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### WHATWG でサポートされているエンコーディング {#whatwg-supported-encodings}

[WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) に準拠して、`TextDecoder` API でサポートされているエンコーディングは、以下の表に概説されています。各エンコーディングに対して、1つ以上エイリアスを使用できます。

異なる Node.js のビルド構成では、異なるエンコーディングセットがサポートされています。（[国際化](/ja/nodejs/api/intl)を参照）

#### デフォルトでサポートされるエンコーディング（完全な ICU データ付き） {#encodings-supported-by-default-with-full-icu-data}

| エンコーディング | エイリアス |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |


#### `small-icu`オプションを指定してNode.jsをビルドした場合にサポートされるエンコーディング {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| エンコーディング | エイリアス |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### ICUが無効になっている場合にサポートされるエンコーディング {#encodings-supported-when-icu-is-disabled}

| エンコーディング | エイリアス |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
[WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) にリストされている `'iso-8859-16'` エンコーディングはサポートされていません。

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) この `TextDecoder` インスタンスがサポートする `encoding` を識別します。 **デフォルト:** `'utf-8'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) デコードの失敗が致命的である場合は `true`。 このオプションは、ICUが無効になっている場合はサポートされません（[Internationalization](/ja/nodejs/api/intl)を参照）。 **デフォルト:** `false`。
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` の場合、`TextDecoder` はデコードされた結果にバイトオーダーマークを含めます。 `false` の場合、バイトオーダーマークは出力から削除されます。 このオプションは、`encoding` が `'utf-8'`、`'utf-16be'`、または `'utf-16le'` の場合にのみ使用されます。 **デフォルト:** `false`。

新しい `TextDecoder` インスタンスを作成します。 `encoding` には、サポートされているエンコーディングまたはエイリアスのいずれかを指定できます。

`TextDecoder` クラスは、グローバルオブジェクトでも利用できます。

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) エンコードされたデータを含む `ArrayBuffer`、`DataView`、または `TypedArray` インスタンス。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 追加のデータチャンクが予想される場合は `true`。 **デフォルト:** `false`。

- 戻り値: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`input` をデコードして文字列を返します。 `options.stream` が `true` の場合、`input` の末尾にある不完全なバイトシーケンスは内部的にバッファリングされ、`textDecoder.decode()` の次の呼び出し後に発行されます。

`textDecoder.fatal` が `true` の場合、発生するデコードエラーにより `TypeError` がスローされます。


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextDecoder`インスタンスでサポートされているエンコーディング。

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

デコードエラーの結果、`TypeError`がスローされる場合、値は`true`になります。

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

デコード結果にバイトオーダーマークが含まれる場合、値は`true`になります。

## Class: `util.TextEncoder` {#class-utiltextencoder}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v11.0.0 | このクラスはグローバルオブジェクトで利用できるようになりました。 |
| v8.3.0 | 追加: v8.3.0 |
:::

[WHATWG Encoding Standard](https://encoding.spec.whatwg.org/)の`TextEncoder` APIの実装。 `TextEncoder`のすべてのインスタンスはUTF-8エンコーディングのみをサポートします。

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```

`TextEncoder` クラスはグローバルオブジェクトでも利用可能です。

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エンコードするテキスト。 **デフォルト:** 空の文字列。
- 戻り値: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

`input`文字列をUTF-8エンコードし、エンコードされたバイトを含む`Uint8Array`を返します。

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**追加: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エンコードするテキスト。
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) エンコード結果を保持する配列。
- 戻り値: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) srcの読み取られたUnicodeコード単位。
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) destの書き込まれたUTF-8バイト数。

`src`文字列をUTF-8エンコードして`dest` Uint8Arrayに格納し、読み取られたUnicodeコード単位と書き込まれたUTF-8バイト数を含むオブジェクトを返します。

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`TextEncoder`インスタンスでサポートされているエンコーディング。 常に `'utf-8'` に設定されています。

## `util.toUSVString(string)` {#utiltousvstringstring}

**追加: v16.8.0, v14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

サロゲートコードポイント（または同等の、ペアになっていないサロゲートコードユニット）をUnicodeの "置換文字" U+FFFDに置き換えた後の`string`を返します。

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**追加: v18.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

[\<AbortController\>](/ja/nodejs/api/globals#class-abortcontroller)インスタンスを作成して返します。このインスタンスの[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)は転送可能としてマークされており、`structuredClone()`または`postMessage()`で使用できます。

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**追加: v18.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)
- 戻り値: [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)

指定された[\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)を転送可能としてマークし、`structuredClone()`と`postMessage()`で使用できるようにします。

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**追加: v19.7.0, v18.16.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

- `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 中止可能な操作に関連付けられ、弱く保持されている非 null オブジェクト。 `resource` が `signal` のアボート前にガベージコレクションされる場合、Promise は保留状態のままになり、Node.js が追跡を停止できるようになります。 これは、長期実行またはキャンセル不可能な操作でのメモリリークを防ぐのに役立ちます。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

指定された`signal`でabortイベントをリッスンし、`signal`が中止されたときに解決されるPromiseを返します。 `resource`が提供されている場合、操作に関連付けられたオブジェクトを弱く参照するため、`resource`が`signal`の中止前にガベージコレクションされると、返されたPromiseは保留状態のままになります。 これにより、長期実行またはキャンセル不可能な操作でのメモリリークを防ぎます。

::: code-group
```js [CJS]
const { aborted } = require('node:util');

// 中止可能なシグナルを持つオブジェクト (カスタムリソースや操作など) を取得します。
const dependent = obtainSomethingAbortable();

// `dependent` をリソースとして渡し、シグナルが中止されたときに `dependent` がまだメモリにある場合にのみ Promise が解決されるように指示します。
aborted(dependent.signal, dependent).then(() => {

  // このコードは、`dependent` が中止されたときに実行されます。
  console.log('Dependent resource was aborted.');
});

// アボートをトリガーするイベントをシミュレートします。
dependent.on('event', () => {
  dependent.abort(); // これにより、`aborted` Promise が解決されます。
});
```

```js [ESM]
import { aborted } from 'node:util';

// 中止可能なシグナルを持つオブジェクト (カスタムリソースや操作など) を取得します。
const dependent = obtainSomethingAbortable();

// `dependent` をリソースとして渡し、シグナルが中止されたときに `dependent` がまだメモリにある場合にのみ Promise が解決されるように指示します。
aborted(dependent.signal, dependent).then(() => {

  // このコードは、`dependent` が中止されたときに実行されます。
  console.log('Dependent resource was aborted.');
});

// アボートをトリガーするイベントをシミュレートします。
dependent.on('event', () => {
  dependent.abort(); // これにより、`aborted` Promise が解決されます。
});
```
:::


## `util.types` {#utiltypes}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.3.0 | `require('util/types')` として公開されました。 |
| v10.0.0 | 追加: v10.0.0 |
:::

`util.types` は、さまざまな種類の組み込みオブジェクトの型チェックを提供します。 `instanceof` や `Object.prototype.toString.call(value)` とは異なり、これらのチェックは JavaScript からアクセス可能なオブジェクトのプロパティ (プロトタイプなど) を検査せず、通常は C++ を呼び出すオーバーヘッドがあります。

結果は一般的に、値が JavaScript で公開するプロパティや動作の種類について何の保証もしません。 これらは主に、JavaScript で型チェックを行うことを好むアドオン開発者にとって役立ちます。

API は、`require('node:util').types` または `require('node:util/types')` を介してアクセスできます。

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**追加: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) または [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) インスタンスの場合に `true` を返します。

[`util.types.isArrayBuffer()`](/ja/nodejs/api/util#utiltypesisarraybuffervalue) および [`util.types.isSharedArrayBuffer()`](/ja/nodejs/api/util#utiltypesissharedarraybuffervalue) も参照してください。

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // true を返します
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // true を返します
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**追加: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が型付き配列オブジェクトや [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) などの [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ビューの 1 つのインスタンスである場合に `true` を返します。 [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView) と同等です。

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が `arguments` オブジェクトの場合、`true` を返します。

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // true を返します
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) のインスタンスである場合、`true` を返します。 これは [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) インスタンスを*含みません*。 通常、両方をテストすることが望ましいです。その場合は [`util.types.isAnyArrayBuffer()`](/ja/nodejs/api/util#utiltypesisanyarraybuffervalue) を参照してください。

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // true を返します
util.types.isArrayBuffer(new SharedArrayBuffer());  // false を返します
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) である場合、`true` を返します。 これは JavaScript エンジンが見ているものを報告するだけです。特に、トランスパイルツールが使用された場合、戻り値は元のソースコードと一致しない場合があります。

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // false を返します
util.types.isAsyncFunction(async function foo() {});  // true を返します
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が `BigInt64Array` のインスタンスの場合に `true` を返します。

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // true を返します
util.types.isBigInt64Array(new BigUint64Array());  // false を返します
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**Added in: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が BigInt オブジェクトの場合、例えば `Object(BigInt(123))` によって作成された場合に `true` を返します。

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // true を返します
util.types.isBigIntObject(BigInt(123));   // false を返します
util.types.isBigIntObject(123);  // false を返します
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が `BigUint64Array` のインスタンスの場合に `true` を返します。

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // false を返します
util.types.isBigUint64Array(new BigUint64Array());  // true を返します
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が boolean オブジェクトの場合、例えば `new Boolean()` によって作成された場合に `true` を返します。

```js [ESM]
util.types.isBooleanObject(false);  // false を返します
util.types.isBooleanObject(true);   // false を返します
util.types.isBooleanObject(new Boolean(false)); // true を返します
util.types.isBooleanObject(new Boolean(true));  // true を返します
util.types.isBooleanObject(Boolean(false)); // false を返します
util.types.isBooleanObject(Boolean(true));  // false を返します
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**Added in: v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が `new Boolean()`、`new String()`、または `Object(Symbol())` で作成されたものなど、任意のボックス化されたプリミティブオブジェクトである場合は `true` を返します。

例:

```js [ESM]
util.types.isBoxedPrimitive(false); // false を返します
util.types.isBoxedPrimitive(new Boolean(false)); // true を返します
util.types.isBoxedPrimitive(Symbol('foo')); // false を返します
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // true を返します
util.types.isBoxedPrimitive(Object(BigInt(5))); // true を返します
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**Added in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が [\<CryptoKey\>](/ja/nodejs/api/webcrypto#class-cryptokey) の場合は `true` を、そうでない場合は `false` を返します。

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) インスタンスである場合は `true` を返します。

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // true を返します
util.types.isDataView(new Float64Array());  // false を返します
```
[`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView) も参照してください。

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) インスタンスである場合は `true` を返します。

```js [ESM]
util.types.isDate(new Date());  // true を返します
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値がネイティブの `External` 値である場合に `true` を返します。

ネイティブの `External` 値は、ネイティブコードからのアクセス用に生の C++ ポインタ (`void*`) を含み、他のプロパティを持たない特殊な型のオブジェクトです。このようなオブジェクトは、Node.js 内部またはネイティブアドオンによって作成されます。JavaScript では、これらは `null` プロトタイプを持つ [freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) されたオブジェクトです。

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // true を返します
util.types.isExternal(0); // false を返します
util.types.isExternal(new String('foo')); // false を返します
```
`napi_create_external` の詳細については、[`napi_create_external()`](/ja/nodejs/api/n-api#napi_create_external) を参照してください。

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) インスタンスである場合に `true` を返します。

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // false を返します
util.types.isFloat32Array(new Float32Array());  // true を返します
util.types.isFloat32Array(new Float64Array());  // false を返します
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの[`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)のインスタンスである場合に`true`を返します。

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // false を返します
util.types.isFloat64Array(new Uint8Array());  // false を返します
util.types.isFloat64Array(new Float64Array());  // true を返します
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値がジェネレーター関数である場合に`true`を返します。 これはJavaScriptエンジンが見ているものを報告するだけです。 特に、トランスパイルツールが使用された場合、戻り値は元のソースコードと一致しない場合があります。

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // false を返します
util.types.isGeneratorFunction(function* foo() {});  // true を返します
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

組み込みのジェネレーター関数から返された値がジェネレーターオブジェクトである場合に`true`を返します。 これはJavaScriptエンジンが見ているものを報告するだけです。 特に、トランスパイルツールが使用された場合、戻り値は元のソースコードと一致しない場合があります。

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // true を返します
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの[`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)のインスタンスである場合に`true`を返します。

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // false を返します
util.types.isInt8Array(new Int8Array());  // true を返します
util.types.isInt8Array(new Float64Array());  // false を返します
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) インスタンスの場合、`true` を返します。

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // false を返します
util.types.isInt16Array(new Int16Array());  // true を返します
util.types.isInt16Array(new Float64Array());  // false を返します
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array) インスタンスの場合、`true` を返します。

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // false を返します
util.types.isInt32Array(new Int32Array());  // true を返します
util.types.isInt32Array(new Float64Array());  // false を返します
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**Added in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が [\<KeyObject\>](/ja/nodejs/api/crypto#class-keyobject) の場合 `true` を返し、そうでない場合は `false` を返します。

### `util.types.isMap(value)` {#utiltypesismapvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) インスタンスの場合、`true` を返します。

```js [ESM]
util.types.isMap(new Map());  // true を返します
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) インスタンスに対して返されたイテレーターである場合は、`true` を返します。

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // true を返します
util.types.isMapIterator(map.values());  // true を返します
util.types.isMapIterator(map.entries());  // true を返します
util.types.isMapIterator(map[Symbol.iterator]());  // true を返します
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が [モジュール名前空間オブジェクト](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) のインスタンスである場合は、`true` を返します。

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // true を返します
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が [組み込みの `Error` 型](https://tc39.es/ecma262/#sec-error-objects) のコンストラクターによって返された場合は、`true` を返します。

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
ネイティブエラー型のサブクラスもネイティブエラーです。

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
値がネイティブエラークラスの `instanceof` であることは、その値に対して `isNativeError()` が `true` を返すことと同等ではありません。`isNativeError()` は異なる [レルム](https://tc39.es/ecma262/#realm) からのErrorに対して `true` を返しますが、`instanceof Error` はこれらのErrorに対して `false` を返します。

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
逆に、`isNativeError()` はネイティブエラーのコンストラクターによって返されなかったすべてのオブジェクトに対して `false` を返します。これには、ネイティブエラーの `instanceof` である値が含まれます。

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が数値オブジェクトの場合に `true` を返します。例えば、`new Number()` によって生成されたものです。

```js [ESM]
util.types.isNumberObject(0);  // false を返します
util.types.isNumberObject(new Number(0));   // true を返します
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) の場合に `true` を返します。

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // true を返します
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) インスタンスの場合に `true` を返します。

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // false を返します
util.types.isProxy(proxy);  // true を返します
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が正規表現オブジェクトの場合に `true` を返します。

```js [ESM]
util.types.isRegExp(/abc/);  // true を返します
util.types.isRegExp(new RegExp('abc'));  // true を返します
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) インスタンスの場合、`true` を返します。

```js [ESM]
util.types.isSet(new Set());  // Returns true
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) インスタンスに対して返されたイテレーターである場合、`true` を返します。

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // Returns true
util.types.isSetIterator(set.values());  // Returns true
util.types.isSetIterator(set.entries());  // Returns true
util.types.isSetIterator(set[Symbol.iterator]());  // Returns true
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) インスタンスの場合、`true` を返します。 これは [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) インスタンスを *含みません*。 通常、両方をテストすることが望ましいです。 それについては [`util.types.isAnyArrayBuffer()`](/ja/nodejs/api/util#utiltypesisanyarraybuffervalue) を参照してください。

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Returns false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Returns true
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が文字列オブジェクトの場合に `true` を返します。例えば、`new String()` で作成されたものです。

```js [ESM]
util.types.isStringObject('foo');  // falseを返します
util.types.isStringObject(new String('foo'));   // trueを返します
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値がシンボルオブジェクトの場合に `true` を返します。これは、`Symbol` プリミティブで `Object()` を呼び出すことによって作成されます。

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // falseを返します
util.types.isSymbolObject(Object(symbol));   // trueを返します
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) インスタンスである場合に `true` を返します。

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // falseを返します
util.types.isTypedArray(new Uint8Array());  // trueを返します
util.types.isTypedArray(new Float64Array());  // trueを返します
```
[`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView) も参照してください。

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

値が組み込みの [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) インスタンスである場合に `true` を返します。

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // falseを返します
util.types.isUint8Array(new Uint8Array());  // trueを返します
util.types.isUint8Array(new Float64Array());  // falseを返します
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が組み込みの [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) インスタンスである場合は `true` を返します。

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // false を返します
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // true を返します
util.types.isUint8ClampedArray(new Float64Array());  // false を返します
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が組み込みの [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array) インスタンスである場合は `true` を返します。

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // false を返します
util.types.isUint16Array(new Uint16Array());  // true を返します
util.types.isUint16Array(new Float64Array());  // false を返します
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が組み込みの [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) インスタンスである場合は `true` を返します。

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // false を返します
util.types.isUint32Array(new Uint32Array());  // true を返します
util.types.isUint32Array(new Float64Array());  // false を返します
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が組み込みの [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) インスタンスである場合は `true` を返します。

```js [ESM]
util.types.isWeakMap(new WeakMap());  // true を返します
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`value` が組み込みの [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) インスタンスの場合に `true` を返します。

```js [ESM]
util.types.isWeakSet(new WeakSet());  // true を返します
```
## 非推奨のAPI {#deprecated-apis}

以下のAPIは非推奨であり、使用すべきではありません。既存のアプリケーションやモジュールは、代替手段を見つけるために更新する必要があります。

### `util._extend(target, source)` {#util_extendtarget-source}

**Added in: v0.7.5**

**Deprecated since: v6.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated: 代わりに [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) を使用してください。
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`util._extend()` メソッドは、Node.jsの内部モジュールの外部で使用されることを意図したものではありませんでした。コミュニティは見つけてそれを使用しました。

これは非推奨であり、新しいコードで使用すべきではありません。JavaScriptには、[`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) を通じて非常に類似した組み込み機能が付属しています。

### `util.isArray(object)` {#utilisarrayobject}

**Added in: v0.6.0**

**Deprecated since: v4.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - Deprecated: 代わりに [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) を使用してください。
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- 戻り値: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

[`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) のエイリアスです。

与えられた `object` が `Array` である場合は `true` を返します。それ以外の場合は `false` を返します。

```js [ESM]
const util = require('node:util');

util.isArray([]);
// 戻り値: true
util.isArray(new Array());
// 戻り値: true
util.isArray({});
// 戻り値: false
```

