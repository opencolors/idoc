---
title: Node.js Assertモジュールのドキュメント
description: Node.jsのAssertモジュールは、インヴァリアントをテストするためのシンプルなアサーションテストのセットを提供します。このドキュメントでは、Node.jsにおけるassertモジュールの使用法、メソッド、および例について説明します。
head:
  - - meta
    - name: og:title
      content: Node.js Assertモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.jsのAssertモジュールは、インヴァリアントをテストするためのシンプルなアサーションテストのセットを提供します。このドキュメントでは、Node.jsにおけるassertモジュールの使用法、メソッド、および例について説明します。
  - - meta
    - name: twitter:title
      content: Node.js Assertモジュールのドキュメント | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.jsのAssertモジュールは、インヴァリアントをテストするためのシンプルなアサーションテストのセットを提供します。このドキュメントでは、Node.jsにおけるassertモジュールの使用法、メソッド、および例について説明します。
---


# Assert {#assert}

::: tip [Stable: 2 - 安定版]
[Stable: 2](/ja/nodejs/api/documentation#stability-index) [安定版: 2](/ja/nodejs/api/documentation#stability-index) - 安定版
:::

**ソースコード:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

`node:assert`モジュールは、不変性を検証するためのアサーション関数のセットを提供します。

## 厳密アサーションモード {#strict-assertion-mode}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v15.0.0 | `require('node:assert/strict')`として公開されました。 |
| v13.9.0, v12.16.2 | 「厳密モード」を「厳密アサーションモード」に、「レガシーモード」を「レガシーアサーションモード」に変更して、「厳密モード」のより一般的な意味との混同を避けるようにしました。 |
| v9.9.0 | 厳密アサーションモードにエラー差分を追加しました。 |
| v9.9.0 | アサートモジュールに厳密アサーションモードを追加しました。 |
| v9.9.0 | 追加: v9.9.0 |
:::

厳密アサーションモードでは、非厳密メソッドは対応する厳密メソッドのように動作します。 たとえば、[`assert.deepEqual()`](/ja/nodejs/api/assert#assertdeepequalactual-expected-message)は、[`assert.deepStrictEqual()`](/ja/nodejs/api/assert#assertdeepstrictequalactual-expected-message)のように動作します。

厳密アサーションモードでは、オブジェクトのエラーメッセージには差分が表示されます。 レガシーアサーションモードでは、オブジェクトのエラーメッセージにはオブジェクトが表示され、多くの場合切り捨てられます。

厳密アサーションモードを使用するには:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';
```

```js [CJS]
const assert = require('node:assert').strict;
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';
```

```js [CJS]
const assert = require('node:assert/strict');
```
:::

エラー差分の例:

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```

```js [CJS]
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```
:::

色を無効にするには、`NO_COLOR`または`NODE_DISABLE_COLORS`環境変数を使用します。 これにより、REPLの色も無効になります。 端末環境での色のサポートの詳細については、tty [`getColorDepth()`](/ja/nodejs/api/tty#writestreamgetcolordepthenv)ドキュメントを参照してください。


## レガシーアサーションモード {#legacy-assertion-mode}

レガシーアサーションモードでは、[`==`演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)を以下で使用します。

- [`assert.deepEqual()`](/ja/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/ja/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/ja/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/ja/nodejs/api/assert#assertnotequalactual-expected-message)

レガシーアサーションモードを使用するには:

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

レガシーアサーションモードは、特に[`assert.deepEqual()`](/ja/nodejs/api/assert#assertdeepequalactual-expected-message)を使用する場合に、予想外の結果になることがあります。

```js [CJS]
// 警告: これはレガシーアサーションモードでは AssertionError をスローしません!
assert.deepEqual(/a/gi, new Date());
```
## Class: assert.AssertionError {#class-assertassertionerror}

- 拡張: [\<errors.Error\>](/ja/nodejs/api/errors#class-error)

アサーションの失敗を示します。 `node:assert`モジュールによってスローされるすべてのエラーは、`AssertionError`クラスのインスタンスになります。

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**追加: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 提供されている場合、エラーメッセージはこの値に設定されます。
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) エラーインスタンスの`actual`プロパティ。
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) エラーインスタンスの`expected`プロパティ。
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エラーインスタンスの`operator`プロパティ。
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 提供されている場合、生成されたスタックトレースはこの関数の前のフレームを省略します。
  
 

アサーションの失敗を示す`Error`のサブクラス。

すべてのインスタンスには、組み込みの`Error`プロパティ(`message`と`name`)と以下が含まれます。

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [`assert.strictEqual()`](/ja/nodejs/api/assert#assertstrictequalactual-expected-message)などのメソッドの`actual`引数に設定されます。
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [`assert.strictEqual()`](/ja/nodejs/api/assert#assertstrictequalactual-expected-message)などのメソッドの`expected`値に設定されます。
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) メッセージが自動生成されたか(`true`)どうかを示します。
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) エラーがアサーションエラーであることを示すために、値は常に`ERR_ASSERTION`です。
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 渡された演算子の値に設定されます。



::: code-group
```js [ESM]
import assert from 'node:assert';

// 後でエラーメッセージを比較するために AssertionError を生成します:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// エラー出力を検証します:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```

```js [CJS]
const assert = require('node:assert');

// 後でエラーメッセージを比較するために AssertionError を生成します:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// エラー出力を検証します:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```
:::


## クラス: `assert.CallTracker` {#class-assertcalltracker}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v20.1.0 | `assert.CallTracker` クラスは非推奨となり、将来のバージョンで削除されます。 |
| v14.2.0, v12.19.0 | 追加: v14.2.0, v12.19.0 |
:::

::: danger [安定版: 0 - 非推奨]
[安定版: 0](/ja/nodejs/api/documentation#stability-index) [安定度: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨
:::

この機能は非推奨であり、将来のバージョンで削除されます。 [`mock`](/ja/nodejs/api/test#mocking) ヘルパー関数などの代替手段の使用をご検討ください。

### `new assert.CallTracker()` {#new-assertcalltracker}

**追加: v14.2.0, v12.19.0**

関数が特定の回数呼び出されたかどうかを追跡するために使用できる新しい [`CallTracker`](/ja/nodejs/api/assert#class-assertcalltracker) オブジェクトを作成します。検証を実行するには、`tracker.verify()` を呼び出す必要があります。 通常のパターンは、[`process.on('exit')`](/ja/nodejs/api/process#event-exit) ハンドラーで呼び出すことです。

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() は、tracker.verify() の前に正確に 1 回呼び出す必要があります。
const callsfunc = tracker.calls(func, 1);

callsfunc();

// tracker.verify() を呼び出し、すべての tracker.calls() 関数が正確な回数呼び出されたかどうかを検証します。
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() は、tracker.verify() の前に正確に 1 回呼び出す必要があります。
const callsfunc = tracker.calls(func, 1);

callsfunc();

// tracker.verify() を呼び出し、すべての tracker.calls() 関数が正確な回数呼び出されたかどうかを検証します。
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**追加: v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **デフォルト:** 何もしない関数。
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **デフォルト:** `1`。
- 戻り値: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `fn` をラップする関数。

ラッパー関数は、正確に `exact` 回呼び出されることが期待されます。 [`tracker.verify()`](/ja/nodejs/api/assert#trackerverify) が呼び出されたときに、関数が正確に `exact` 回呼び出されなかった場合、[`tracker.verify()`](/ja/nodejs/api/assert#trackerverify) はエラーをスローします。

::: code-group
```js [ESM]
import assert from 'node:assert';

// コールトラッカーを作成します。
const tracker = new assert.CallTracker();

function func() {}

// tracker.verify() の前に正確な回数呼び出す必要のある func() をラップする関数を返します。
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// コールトラッカーを作成します。
const tracker = new assert.CallTracker();

function func() {}

// tracker.verify() の前に正確な回数呼び出す必要のある func() をラップする関数を返します。
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**Added in: v18.8.0, v16.18.0**

-  `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
-  戻り値: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) トラッキングされた関数へのすべての呼び出しを含む配列。
-  オブジェクト [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) トラッキングされた関数に渡された引数
  
 



::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**Added in: v14.2.0, v12.19.0**

- 戻り値: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) [`tracker.calls()`](/ja/nodejs/api/assert#trackercallsfn-exact) によって返されるラッパー関数に関する情報を含むオブジェクトの配列。
- オブジェクト [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関数が呼び出された実際の回数。
    - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関数が呼び出されると期待された回数。
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ラップされている関数の名前。
    - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 関数のスタックトレース。
  
 

配列には、期待された回数だけ呼び出されなかった関数の、期待された呼び出し回数と実際の呼び出し回数に関する情報が含まれます。



::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```
:::


### `tracker.reset([fn])` {#trackerresetfn}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) リセットする追跡対象の関数。

コールトラッカーの呼び出しをリセットします。追跡対象の関数が引数として渡されると、その関数の呼び出しがリセットされます。引数が渡されない場合、すべての追跡対象の関数がリセットされます。

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker was called once
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```

```js [CJS]
const assert = require('node:assert');

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker was called once
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**Added in: v14.2.0, v12.19.0**

[`tracker.calls()`](/ja/nodejs/api/assert#trackercallsfn-exact) に渡された関数のリストを反復処理し、期待される回数だけ呼び出されていない関数に対してエラーをスローします。

::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Will throw an error since callsfunc() was only called once.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Will throw an error since callsfunc() was only called once.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Added in: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 真偽値としてチェックされる入力。
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.ok()`](/ja/nodejs/api/assert#assertokvalue-message) のエイリアス。

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}


::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v22.2.0, v20.15.0 | エラー原因と errors プロパティも比較されるようになりました。 |
| v18.0.0 | 正規表現の lastIndex プロパティも比較されるようになりました。 |
| v16.0.0, v14.18.0 | レガシーアサーションモードでは、ステータスが非推奨からレガシーに変更されました。 |
| v14.0.0 | NaN は、両側が NaN の場合、同一として扱われるようになりました。 |
| v12.0.0 | 型タグが適切に比較されるようになり、チェックがより直感的になるようにいくつかのマイナーな比較調整が行われました。 |
| v9.0.0 | `Error` の名前とメッセージが適切に比較されるようになりました。 |
| v8.0.0 | `Set` と `Map` のコンテンツも比較されます。 |
| v6.4.0, v4.7.1 | 型付き配列のスライスが正しく処理されるようになりました。 |
| v6.1.0, v4.5.0 | 循環参照を持つオブジェクトを、入力として使用できるようになりました。 |
| v5.10.1, v4.4.3 | `Uint8Array` 以外の型付き配列を正しく処理します。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**厳密アサーションモード**

[`assert.deepStrictEqual()`](/ja/nodejs/api/assert#assertdeepstrictequalactual-expected-message) のエイリアス。

**レガシーアサーションモード**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ja/nodejs/api/documentation#stability-index) [Stability: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに [`assert.deepStrictEqual()`](/ja/nodejs/api/assert#assertdeepstrictequalactual-expected-message) を使用してください。
:::

`actual` パラメーターと `expected` パラメーター間のディープな等価性をテストします。 代わりに [`assert.deepStrictEqual()`](/ja/nodejs/api/assert#assertdeepstrictequalactual-expected-message) を使用することを検討してください。 [`assert.deepEqual()`](/ja/nodejs/api/assert#assertdeepequalactual-expected-message) は、予期しない結果になる可能性があります。

*ディープな等価性* とは、子オブジェクトの列挙可能な "own" プロパティも、次のルールによって再帰的に評価されることを意味します。


### Comparison details {#comparison-details}

- プリミティブ値は[`==`演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)で比較されます。ただし、`NaN`は例外です。両方の辺が`NaN`の場合、同一として扱われます。
- オブジェクトの[型タグ](https://tc39.github.io/ecma262/#sec-object.prototype.tostring)は同じである必要があります。
- [列挙可能な"自身の"プロパティ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)のみが考慮されます。
- [`Error`](/ja/nodejs/api/errors#class-error)の名前、メッセージ、原因、およびエラーは、たとえこれらが列挙可能なプロパティでなくても、常に比較されます。
- [オブジェクトラッパー](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript)は、オブジェクトとしても、アンラップされた値としても比較されます。
- `Object`プロパティは順不同で比較されます。
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)キーと[`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)アイテムは順不同で比較されます。
- 再帰は、両方の辺が異なるか、両方の辺が循環参照に遭遇したときに停止します。
- 実装はオブジェクトの[`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots)をテストしません。
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)プロパティは比較されません。
- [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)と[`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)の比較は、それらの値に依存せず、インスタンスのみに依存します。
- [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)のlastIndex、flags、およびsourceは、たとえこれらが列挙可能なプロパティでなくても、常に比較されます。

次の例では、プリミティブが[`==`演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality)を使用して比較されるため、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror)はスローされません。

::: code-group
```js [ESM]
import assert from 'node:assert';
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```

```js [CJS]
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```
:::

"Deep"な等価性とは、子オブジェクトの列挙可能な"自身の"プロパティも評価されることを意味します。

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```
:::

値が等しくない場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror)がスローされ、`message`プロパティに`message`パラメータの値が設定されます。`message`パラメータがundefinedの場合、デフォルトのエラーメッセージが割り当てられます。`message`パラメータが[`Error`](/ja/nodejs/api/errors#class-error)のインスタンスである場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror)の代わりにそれがスローされます。


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v22.2.0, v20.15.0 | エラーの原因とerrorsプロパティも比較されるようになりました。 |
| v18.0.0 | 正規表現の lastIndex プロパティも比較されるようになりました。 |
| v9.0.0 | 列挙可能なシンボルプロパティが比較されるようになりました。 |
| v9.0.0 | `NaN` は [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero) 比較を使用して比較されるようになりました。 |
| v8.5.0 | `Error` の名前とメッセージが正しく比較されるようになりました。 |
| v8.0.0 | `Set` と `Map` のコンテンツも比較されるようになりました。 |
| v6.1.0 | 循環参照を持つオブジェクトを入力として使用できるようになりました。 |
| v6.4.0, v4.7.1 | Typed array のスライスが正しく処理されるようになりました。 |
| v5.10.1, v4.4.3 | 非 `Uint8Array` の typed array を正しく処理します。 |
| v1.2.0 | 追加: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`actual` パラメーターと `expected` パラメーターの間で厳密な等価性をテストします。「厳密な」等価性とは、子オブジェクトの列挙可能な「独自の」プロパティも、次のルールに従って再帰的に評価されることを意味します。

### 比較の詳細 {#comparison-details_1}

- プリミティブ値は [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使用して比較されます。
- オブジェクトの [型タグ](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) は同じである必要があります。
- オブジェクトの [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) は、[`===` 演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) を使用して比較されます。
- [列挙可能な「独自の」プロパティ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) のみが考慮されます。
- [`Error`](/ja/nodejs/api/errors#class-error) の名前、メッセージ、原因、エラーは、列挙可能なプロパティでない場合でも常に比較されます。`errors` も比較されます。
- 列挙可能な独自の [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) プロパティも比較されます。
- [オブジェクトラッパー](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) は、オブジェクトとアンラップされた値の両方として比較されます。
- `Object` のプロパティは順序なしで比較されます。
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) のキーと [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) のアイテムは順序なしで比較されます。
- 両側が異なる場合、または両側が循環参照に遭遇した場合に、再帰は停止します。
- [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) と [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) の比較は、それらの値に依存しません。詳細については、以下を参照してください。
- [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) の lastIndex、フラグ、およびソースは、列挙可能なプロパティでない場合でも常に比較されます。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// これは 1 !== '1' であるため失敗します。
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// 次のオブジェクトは独自のプロパティを持っていません
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// 異なる [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// 異なる型タグ:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// Object.is(NaN, NaN) が true であるため、OK です。

// 異なるアンラップされた数値:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// オブジェクトと文字列がアンラップされたときに同一であるため、OK です。

assert.deepStrictEqual(-0, -0);
// OK

// 異なるゼロ:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK、両方のオブジェクトで同じシンボルであるため。

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// エントリを比較することは不可能であるため、OK です

// weakMap3 が weakMap1 に含まれていないプロパティを持っているため、失敗します。
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```

```js [CJS]
const assert = require('node:assert/strict');

// これは 1 !== '1' であるため失敗します。
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// 次のオブジェクトは独自のプロパティを持っていません
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// 異なる [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// 異なる型タグ:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// Object.is(NaN, NaN) が true であるため、OK です。

// 異なるアンラップされた数値:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// オブジェクトと文字列がアンラップされたときに同一であるため、OK です。

assert.deepStrictEqual(-0, -0);
// OK

// 異なるゼロ:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK、両方のオブジェクトで同じシンボルであるため。

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// エントリを比較することは不可能であるため、OK です

// weakMap3 が weakMap1 に含まれていないプロパティを持っているため、失敗します。
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```
:::

値が等しくない場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティには `message` パラメーターの値が設定されます。 `message` パラメーターが undefined の場合、デフォルトのエラーメッセージが割り当てられます。 `message` パラメーターが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、`AssertionError` の代わりにそれがスローされます。


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.0.0 | This API is no longer experimental. |
| v13.6.0, v12.16.0 | Added in: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`string` 入力が正規表現に一致しないことを期待します。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```
:::

値が一致する場合、または `string` 引数が `string` 以外の型である場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティには `message` パラメーターの値が設定されます。`message` パラメーターが undefined の場合、デフォルトのエラーメッセージが割り当てられます。`message` パラメーターが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) の代わりにスローされます。

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**Added in: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`asyncFn` プロミスを待機するか、`asyncFn` が関数の場合は、関数をすぐに呼び出し、返されたプロミスが完了するのを待機します。その後、プロミスが拒否されないことを確認します。

`asyncFn` が関数であり、同期的にエラーをスローする場合、`assert.doesNotReject()` はそのエラーで拒否された `Promise` を返します。関数がプロミスを返さない場合、`assert.doesNotReject()` は [`ERR_INVALID_RETURN_VALUE`](/ja/nodejs/api/errors#err_invalid_return_value) エラーで拒否された `Promise` を返します。どちらの場合も、エラーハンドラーはスキップされます。

`assert.doesNotReject()` を使用しても、拒否をキャッチして再度拒否するメリットはほとんどないため、実際には役に立ちません。代わりに、拒否されるべきではない特定のコードパスの横にコメントを追加し、エラーメッセージをできるだけ表現力豊かにすることを検討してください。

指定された場合、`error` は [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)、[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)、または検証関数にできます。詳細については、[`assert.throws()`](/ja/nodejs/api/assert#assertthrowsfn-error-message) を参照してください。

完了を待機する非同期の性質に加えて、[`assert.doesNotThrow()`](/ja/nodejs/api/assert#assertdoesnotthrowfn-error-message) と同じように動作します。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.doesNotReject(
  async () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```
:::


## `assert.doesNotThrow(fn[, error][, message])` {#assertdoesnotthrowfn-error-message}

::: info [History]
| Version | Changes |
| --- | --- |
| v5.11.0, v4.4.5 | `message` パラメーターが尊重されるようになりました。 |
| v4.2.0 | `error` パラメーターがアロー関数を使用できるようになりました。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

関数 `fn` がエラーをスローしないことを表明します。

`assert.doesNotThrow()` を使用することは、エラーをキャッチして再度スローすることにメリットがないため、実際には役に立ちません。代わりに、スローすべきではない特定のコードパスの横にコメントを追加し、エラーメッセージをできるだけ表現力豊かにすることを検討してください。

`assert.doesNotThrow()` が呼び出されると、すぐに `fn` 関数が呼び出されます。

エラーがスローされ、それが `error` パラメーターで指定されたものと同じ型である場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされます。エラーの型が異なる場合、または `error` パラメーターが未定義の場合、エラーは呼び出し元に伝播されます。

指定された場合、`error` は [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)、[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)、または検証関数にすることができます。詳細については、[`assert.throws()`](/ja/nodejs/api/assert#assertthrowsfn-error-message) を参照してください。

たとえば、以下は、アサーションに一致するエラー型がないため、[`TypeError`](/ja/nodejs/api/errors#class-typeerror) をスローします。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```
:::

ただし、以下は 'Got unwanted exception...' というメッセージの [`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) を発生させます。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```
:::

[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` パラメーターに値が指定されている場合、`message` の値は [`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) メッセージに追加されます。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```
:::


## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v16.0.0, v14.18.0 | レガシーアサーションモードで、ステータスが非推奨からレガシーに変更されました。 |
| v14.0.0 | NaN は両辺が NaN の場合、同一として扱われるようになりました。 |
| v0.1.21 | 追加: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**厳密アサーションモード**

[`assert.strictEqual()`](/ja/nodejs/api/assert#assertstrictequalactual-expected-message) のエイリアス。

**レガシーアサーションモード**

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定度: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに [`assert.strictEqual()`](/ja/nodejs/api/assert#assertstrictequalactual-expected-message) を使用してください。
:::

[`==` 演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) を使用して、`actual` および `expected` パラメーター間の浅い、強制的な等価性をテストします。 `NaN` は特別に処理され、両辺が `NaN` の場合、同一として扱われます。

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```

```js [CJS]
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```
:::

値が等しくない場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティは `message` パラメーターの値に等しく設定されます。 `message` パラメーターが未定義の場合、デフォルトのエラーメッセージが割り当てられます。 `message` パラメーターが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、`AssertionError` の代わりにスローされます。


## `assert.fail([message])` {#assertfailmessage}

**Added in: v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **Default:** `'Failed'`

指定されたエラーメッセージまたはデフォルトのエラーメッセージで[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror)をスローします。`message`パラメータが[`Error`](/ja/nodejs/api/errors#class-error)のインスタンスである場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror)の代わりにスローされます。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```
:::

`assert.fail()` を3つ以上の引数で使用することは可能ですが、非推奨です。詳細については、下記をご覧ください。

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}

::: info [History]
| Version | Changes |
| --- | --- |
| v10.0.0 | 複数の引数を指定して `assert.fail()` を呼び出すことは非推奨となり、警告が発生します。 |
| v0.1.21 | Added in: v0.1.21 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ja/nodejs/api/documentation#stability-index) [Stability: 0](/ja/nodejs/api/documentation#stability-index) - 非推奨: `assert.fail([message])` または他のアサート関数を代わりに使用してください。
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Default:** `assert.fail`

`message` が falsy の場合、エラーメッセージは `actual` と `expected` の値を指定された `operator` で区切ったものとして設定されます。`actual` と `expected` の2つの引数だけが指定された場合、`operator` はデフォルトで `'!='` になります。`message` が3番目の引数として指定された場合、エラーメッセージとして使用され、他の引数はスローされたオブジェクトのプロパティとして保存されます。`stackStartFn` が指定された場合、その関数より上のすべてのスタックフレームがスタックトレースから削除されます（[`Error.captureStackTrace`](/ja/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)を参照）。引数が指定されていない場合、デフォルトのメッセージ `Failed` が使用されます。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```
:::

最後の3つのケースでは、`actual`、`expected`、および `operator` はエラーメッセージに影響を与えません。

例外のスタックトレースを切り詰めるための `stackStartFn` の使用例:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```

```js [CJS]
const assert = require('node:assert/strict');

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```
:::


## `assert.ifError(value)` {#assertiferrorvalue}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 元のエラーをスローする代わりに、完全なスタックトレースを含む[`AssertionError`][]にラップされるようになりました。 |
| v10.0.0 | `value` は `undefined` または `null` のみになりました。以前は、すべての falsy な値が `null` と同じように扱われ、スローされませんでした。 |
| v0.1.97 | 追加: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`value` が `undefined` または `null` でない場合、`value` をスローします。 これは、コールバックで `error` 引数をテストするときに役立ちます。 スタックトレースには、`ifError()` 自体の潜在的な新しいフレームを含む、`ifError()` に渡されたエラーからのすべてのフレームが含まれます。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```
:::


## `assert.match(string, regexp[, message])` {#assertmatchstring-regexp-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v16.0.0 | このAPIは実験的ではなくなりました。 |
| v13.6.0, v12.16.0 | Added in: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`string` 入力が正規表現に一致することを期待します。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```
:::

値が一致しない場合、または `string` 引数が `string` 以外の型である場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティには `message` パラメーターの値が設定されます。`message` パラメーターが未定義の場合、デフォルトのエラーメッセージが割り当てられます。`message` パラメーターが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) の代わりにそれがスローされます。

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v16.0.0, v14.18.0 | レガシーアサーションモードでは、ステータスが非推奨からレガシーに変更されました。 |
| v14.0.0 | NaN は、両側が NaN の場合、同一として扱われるようになりました。 |
| v9.0.0 | `Error` の名前とメッセージが適切に比較されるようになりました。 |
| v8.0.0 | `Set` および `Map` の内容も比較されます。 |
| v6.4.0, v4.7.1 | 型付き配列のスライスが正しく処理されるようになりました。 |
| v6.1.0, v4.5.0 | 循環参照を持つオブジェクトを、入力として使用できるようになりました。 |
| v5.10.1, v4.4.3 | 非 `Uint8Array` 型の配列を正しく処理します。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**厳密アサーションモード**

[`assert.notDeepStrictEqual()`](/ja/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message) のエイリアス。

**レガシーアサーションモード**

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに [`assert.notDeepStrictEqual()`](/ja/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message) を使用してください。
:::

あらゆる深い不等価性をテストします。[`assert.deepEqual()`](/ja/nodejs/api/assert#assertdeepequalactual-expected-message) の反対。

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```
:::

値が深く等しい場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティには `message` パラメーターの値が設定されます。`message` パラメーターが未定義の場合、デフォルトのエラーメッセージが割り当てられます。`message` パラメーターが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、`AssertionError` の代わりにそれがスローされます。


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v9.0.0 | `-0` と `+0` はもはや等しいとは見なされません。 |
| v9.0.0 | `NaN` は、[SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero) 比較を使用して比較されるようになりました。 |
| v9.0.0 | `Error` の名前とメッセージが正しく比較されるようになりました。 |
| v8.0.0 | `Set` と `Map` の内容も比較されます。 |
| v6.1.0 | 循環参照を持つオブジェクトを、入力として使用できるようになりました。 |
| v6.4.0, v4.7.1 | 型付き配列のスライスが正しく処理されるようになりました。 |
| v5.10.1, v4.4.3 | `Uint8Array` 以外の型付き配列を正しく処理します。 |
| v1.2.0 | 追加: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

厳密な不等価性の深いテストを行います。[`assert.deepStrictEqual()`](/ja/nodejs/api/assert#assertdeepstrictequalactual-expected-message) の反対です。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```
:::

値が深く厳密に等しい場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティには `message` パラメーターの値が設定されます。 `message` パラメーターが未定義の場合、デフォルトのエラーメッセージが割り当てられます。 `message` パラメーターが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) の代わりにスローされます。

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v16.0.0, v14.18.0 | レガシーアサーションモードで、ステータスが非推奨からレガシーに変更されました。 |
| v14.0.0 | NaN は、両側が NaN の場合に同一として扱われるようになりました。 |
| v0.1.21 | 追加: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**厳密アサーションモード**

[`assert.notStrictEqual()`](/ja/nodejs/api/assert#assertnotstrictequalactual-expected-message) のエイリアス。

**レガシーアサーションモード**

::: info [安定版: 3 - レガシー]
[安定版: 3](/ja/nodejs/api/documentation#stability-index) [安定性: 3](/ja/nodejs/api/documentation#stability-index) - レガシー: 代わりに [`assert.notStrictEqual()`](/ja/nodejs/api/assert#assertnotstrictequalactual-expected-message) を使用してください。
:::

[`!=` 演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality) を使用して、shallow かつ型強制的な不等価性をテストします。 `NaN` は特別に処理され、両側が `NaN` の場合に同一として扱われます。

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```

```js [CJS]
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```
:::

値が等しい場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティには `message` パラメーターの値が設定されます。 `message` パラメーターが未定義の場合、デフォルトのエラーメッセージが割り当てられます。 `message` パラメーターが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) の代わりにスローされます。


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 使用する比較を厳密等価性から `Object.is()` に変更しました。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) によって決定される、`actual` と `expected` パラメータ間の厳密な不等価性をテストします。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
:::

値が厳密に等しい場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティは `message` パラメータの値に設定されます。 `message` パラメータが undefined の場合、デフォルトのエラーメッセージが割り当てられます。 `message` パラメータが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、`AssertionError` の代わりにそれがスローされます。

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v10.0.0 | 引数なしの `assert.ok()` は、定義済みのエラーメッセージを使用するようになりました。 |
| v0.1.21 | Added in: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

`value` が真値かどうかをテストします。 これは `assert.equal(!!value, true, message)` と同等です。

`value` が真値でない場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティは `message` パラメータの値に設定されます。 `message` パラメータが `undefined` の場合、デフォルトのエラーメッセージが割り当てられます。 `message` パラメータが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、`AssertionError` の代わりにそれがスローされます。 引数がまったく渡されない場合、`message` は文字列 `'No value argument passed to `assert.ok()`'` に設定されます。

`repl` では、エラーメッセージがファイルでスローされるメッセージと異なることに注意してください。 詳細については、以下を参照してください。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
```

```js [CJS]
const assert = require('node:assert');

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
```
:::


## `assert.rejects(asyncFn[, error][, message])` {#assertrejectsasyncfn-error-message}

**Added in: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`asyncFn` プロミスを待ちます。または、`asyncFn` が関数の場合、関数をすぐに呼び出し、返されたプロミスが完了するのを待ちます。その後、プロミスが拒否されたことを確認します。

`asyncFn` が関数であり、同期的にエラーをスローする場合、`assert.rejects()` はそのエラーで拒否された `Promise` を返します。関数がプロミスを返さない場合、`assert.rejects()` は [`ERR_INVALID_RETURN_VALUE`](/ja/nodejs/api/errors#err_invalid_return_value) エラーで拒否された `Promise` を返します。どちらの場合も、エラーハンドラーはスキップされます。

完了を待つ非同期的な性質に加えて、[`assert.throws()`](/ja/nodejs/api/assert#assertthrowsfn-error-message) と同一に動作します。

指定された場合、`error` は、[`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)、[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)、検証関数、各プロパティがテストされるオブジェクト、または非列挙型の `message` プロパティと `name` プロパティを含む各プロパティがテストされるエラーのインスタンスにできます。

指定された場合、`message` は、`asyncFn` が拒否に失敗した場合に [`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) によって提供されるメッセージになります。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    {
      name: 'TypeError',
      message: 'Wrong value',
    },
  );
})();
```
:::



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  (err) => {
    assert.strictEqual(err.name, 'TypeError');
    assert.strictEqual(err.message, 'Wrong value');
    return true;
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();
```
:::



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```

```js [CJS]
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```
:::

`error` は文字列にできません。文字列が2番目の引数として指定された場合、`error` は省略されたと見なされ、文字列は代わりに `message` に使用されます。これにより、見落としやすい間違いにつながる可能性があります。文字列を2番目の引数として使用することを検討している場合は、[`assert.throws()`](/ja/nodejs/api/assert#assertthrowsfn-error-message) の例を注意深くお読みください。


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [履歴]
| バージョン | 変更 |
|---|---|
| v10.0.0 | 使用される比較が厳密等価性から `Object.is()` に変更されました。 |
| v0.1.21 | 追加: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) によって決定される `actual` パラメーターと `expected` パラメーターの間の厳密な等価性をテストします。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```

```js [CJS]
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```
:::

値が厳密に等しくない場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) がスローされ、`message` プロパティは `message` パラメーターの値と等しく設定されます。 `message` パラメーターが未定義の場合、デフォルトのエラーメッセージが割り当てられます。 `message` パラメーターが [`Error`](/ja/nodejs/api/errors#class-error) のインスタンスである場合、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) の代わりにスローされます。


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [沿革]
| バージョン | 変更点 |
| --- | --- |
| v10.2.0 | `error` パラメーターは、正規表現を含むオブジェクトにできるようになりました。 |
| v9.9.0 | `error` パラメーターは、オブジェクトにもできるようになりました。 |
| v4.2.0 | `error` パラメーターは、アロー関数にできるようになりました。 |
| v0.1.21 | 追加: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

関数 `fn` がエラーをスローすることを期待します。

指定された場合、`error` は [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)、[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)、バリデーション関数、各プロパティが厳密な深い等価性についてテストされるバリデーションオブジェクト、または非列挙型の `message` プロパティと `name` プロパティを含む各プロパティが厳密な深い等価性についてテストされるエラーのインスタンスにすることができます。オブジェクトを使用する場合、文字列プロパティに対して検証するときに、正規表現を使用することもできます。例については以下を参照してください。

指定された場合、`message` は、`fn` 呼び出しがスローに失敗した場合、またはエラー検証が失敗した場合に、`AssertionError` によって提供されるメッセージに追加されます。

カスタム検証オブジェクト/エラーインスタンス:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('Wrong value');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
    info: {
      nested: true,
      baz: 'text',
    },
    // 検証オブジェクトのプロパティのみがテストされます。
    // ネストされたオブジェクトを使用する場合は、すべてのプロパティが存在する必要があります。そうでない場合
    // 検証は失敗します。
  },
);

// 正規表現を使用してエラープロパティを検証する:
assert.throws(
  () => {
    throw err;
  },
  {
    // `name` および `message` プロパティは文字列であり、正規表現を使用します
    // それらに対する式は文字列と照合されます。 失敗した場合、
    // エラーがスローされます。
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // ネストされたプロパティに正規表現を使用することはできません!
      baz: 'text',
    },
    // `reg` プロパティには正規表現が含まれており、検証オブジェクトに同一の正規表現が含まれている場合にのみ、
    // は合格するでしょう。
    reg: /abc/i,
  },
);

// `message` および `name` プロパティが異なるため失敗します:
assert.throws(
  () => {
    const otherErr = new Error('Not found');
    // `err` から `otherErr` にすべての列挙可能なプロパティをコピーします。
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // エラーの `message` および `name` プロパティも、
  // バリデーションオブジェクトとしてエラー。
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('Wrong value');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
    info: {
      nested: true,
      baz: 'text',
    },
    // 検証オブジェクトのプロパティのみがテストされます。
    // ネストされたオブジェクトを使用する場合は、すべてのプロパティが存在する必要があります。そうでない場合
    // 検証は失敗します。
  },
);

// 正規表現を使用してエラープロパティを検証する:
assert.throws(
  () => {
    throw err;
  },
  {
    // `name` および `message` プロパティは文字列であり、正規表現を使用します
    // それらに対する式は文字列と照合されます。 失敗した場合、
    // エラーがスローされます。
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // ネストされたプロパティに正規表現を使用することはできません!
      baz: 'text',
    },
    // `reg` プロパティには正規表現が含まれており、検証オブジェクトに同一の正規表現が含まれている場合にのみ、
    // は合格するでしょう。
    reg: /abc/i,
  },
);

// `message` および `name` プロパティが異なるため失敗します:
assert.throws(
  () => {
    const otherErr = new Error('Not found');
    // `err` から `otherErr` にすべての列挙可能なプロパティをコピーします。
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // エラーの `message` および `name` プロパティも、
  // バリデーションオブジェクトとしてエラー。
  err,
);
```
:::

コンストラクターを使用して instanceof を検証します。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  Error,
);
```
:::

[`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) を使用してエラーメッセージを検証します。

正規表現を使用すると、エラーオブジェクトに対して `.toString` が実行されるため、エラー名も含まれます。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  /^Error: Wrong value$/,
);
```
:::

カスタムエラー検証:

関数は、すべての内部検証に合格したことを示すために `true` を返す必要があります。 それ以外の場合は、[`AssertionError`](/ja/nodejs/api/assert#class-assertassertionerror) で失敗します。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // `true` 以外のものを検証関数から返すことは避けてください。
    // そうでない場合は、検証のどの部分が失敗したかが不明です。代わりに、
    // 失敗した特定の検証についてエラーをスローし (この例で行われているように)、
    // 可能な限り役立つデバッグ情報をそのエラーに追加します。
    return true;
  },
  '予期しないエラー',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // `true` 以外のものを検証関数から返すことは避けてください。
    // そうでない場合は、検証のどの部分が失敗したかが不明です。代わりに、
    // 失敗した特定の検証についてエラーをスローし (この例で行われているように)、
    // 可能な限り役立つデバッグ情報をそのエラーに追加します。
    return true;
  },
  '予期しないエラー',
);
```
:::

`error` は文字列にすることはできません。 文字列が 2 番目の引数として指定された場合、`error` は省略されたと見なされ、代わりに文字列が `message` に使用されます。 これにより、見落としやすい間違いが発生する可能性があります。 スローされたエラーメッセージと同じメッセージを使用すると、`ERR_AMBIGUOUS_ARGUMENT` エラーが発生します。 文字列を 2 番目の引数として使用することを検討している場合は、以下の例を注意深くお読みください。

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// 2 番目の引数は文字列であり、入力関数は Error をスローしました。
// 最初の場合は、入力関数によってスローされたエラーメッセージと一致しないため、スローされません。
assert.throws(throwingFirst, 'Second');
// 次の例では、メッセージはエラーからのメッセージよりもメリットがなく、ユーザーが実際にエラーメッセージと照合することを意図しているかどうかが不明なため、Node.js は `ERR_AMBIGUOUS_ARGUMENT` エラーをスローします。
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// 文字列は、関数がスローしない場合にのみ (メッセージとして) 使用されます:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: 予期された例外が見つかりません: Second

// エラーメッセージと照合することを意図していた場合は、代わりにこれを実行します:
// エラーメッセージが一致するため、スローされません。
assert.throws(throwingSecond, /Second$/);

// エラーメッセージが一致しない場合は、AssertionError がスローされます。
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```

```js [CJS]
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// 2 番目の引数は文字列であり、入力関数は Error をスローしました。
// 最初の場合は、入力関数によってスローされたエラーメッセージと一致しないため、スローされません。
assert.throws(throwingFirst, 'Second');
// 次の例では、メッセージはエラーからのメッセージよりもメリットがなく、ユーザーが実際にエラーメッセージと照合することを意図しているかどうかが不明なため、Node.js は `ERR_AMBIGUOUS_ARGUMENT` エラーをスローします。
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// 文字列は、関数がスローしない場合にのみ (メッセージとして) 使用されます:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: 予期された例外が見つかりません: Second

// エラーメッセージと照合することを意図していた場合は、代わりにこれを実行します:
// エラーメッセージが一致するため、スローされません。
assert.throws(throwingSecond, /Second$/);

// エラーメッセージが一致しない場合は、AssertionError がスローされます。
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

混乱を招きやすく、エラーが発生しやすい表記のため、2 番目の引数として文字列を使用することは避けてください。


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**Added in: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).0 - 開発初期
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/ja/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) は、深い比較を通じて `actual` パラメータと `expected` パラメータの同等性をアサートし、`expected` パラメータのすべてのプロパティが、型強制を許可せずに、同等の値を持つ `actual` パラメータに存在することを確認します。[`assert.deepStrictEqual()`](/ja/nodejs/api/assert#assertdeepstrictequalactual-expected-message) との主な違いは、[`assert.partialDeepStrictEqual()`](/ja/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) は、`actual` パラメータのすべてのプロパティが `expected` パラメータに存在することを要求しないことです。このメソッドは常に [`assert.deepStrictEqual()`](/ja/nodejs/api/assert#assertdeepstrictequalactual-expected-message) と同じテストケースに合格する必要があり、そのスーパーセットとして動作します。

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual(new Set(['value1', 'value2']), new Set(['value1', 'value2']));
// OK

assert.partialDeepStrictEqual(new Map([['key1', 'value1']]), new Map([['key1', 'value1']]));
// OK

assert.partialDeepStrictEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]));
// OK

assert.partialDeepStrictEqual(/abc/, /abc/);
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual(new Date(0), new Date(0));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```

```js [CJS]
const assert = require('node:assert');

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```
:::

