---
title: Node.js テストランナー
description: Node.js テストランナーモジュールは、Node.js アプリケーション内でテストを書くための組み込みソリューションを提供します。さまざまなテスト形式、コードカバレッジレポートをサポートし、一般的なテストフレームワークと統合します。
head:
  - - meta
    - name: og:title
      content: Node.js テストランナー | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js テストランナーモジュールは、Node.js アプリケーション内でテストを書くための組み込みソリューションを提供します。さまざまなテスト形式、コードカバレッジレポートをサポートし、一般的なテストフレームワークと統合します。
  - - meta
    - name: twitter:title
      content: Node.js テストランナー | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js テストランナーモジュールは、Node.js アプリケーション内でテストを書くための組み込みソリューションを提供します。さまざまなテスト形式、コードカバレッジレポートをサポートし、一般的なテストフレームワークと統合します。
---


# テストランナー {#test-runner}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0 | テストランナーが安定版になりました。 |
| v18.0.0, v16.17.0 | 追加: v18.0.0, v16.17.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定度: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

**ソースコード:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

`node:test` モジュールは、JavaScriptテストの作成を容易にします。 これにアクセスするには:

::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

このモジュールは `node:` スキームでのみ利用可能です。

`test` モジュールを通じて作成されたテストは、3つの方法のいずれかで処理される単一の関数で構成されます。

以下の例は、`test` モジュールを使用してテストを記述する方法を示しています。

```js [ESM]
test('同期的な合格テスト', (t) => {
  // このテストは例外をスローしないため合格します。
  assert.strictEqual(1, 1);
});

test('同期的な不合格テスト', (t) => {
  // このテストは例外をスローするため不合格になります。
  assert.strictEqual(1, 2);
});

test('非同期的な合格テスト', async (t) => {
  // このテストは、async関数によって返されたPromiseが確定され、拒否されないため合格します。
  assert.strictEqual(1, 1);
});

test('非同期的な不合格テスト', async (t) => {
  // このテストは、async関数によって返されたPromiseが拒否されるため不合格になります。
  assert.strictEqual(1, 2);
});

test('Promisesを使った不合格テスト', (t) => {
  // Promisesは直接使うこともできます。
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('これによりテストは不合格になります'));
    });
  });
});

test('コールバックを使った合格テスト', (t, done) => {
  // done()はコールバック関数です。 setImmediate()が実行されると、引数なしでdone()を呼び出します。
  setImmediate(done);
});

test('コールバックを使った不合格テスト', (t, done) => {
  // setImmediate()が実行されると、done()はErrorオブジェクトとともに呼び出され、テストは不合格になります。
  setImmediate(() => {
    done(new Error('コールバックの失敗'));
  });
});
```
いずれかのテストが失敗した場合、プロセスの終了コードは `1` に設定されます。


## サブテスト {#subtests}

テストコンテキストの `test()` メソッドを使用すると、サブテストを作成できます。これにより、テストを階層的に構成し、より大きなテスト内にネストされたテストを作成できます。このメソッドは、トップレベルの `test()` 関数と同一に動作します。次の例は、2つのサブテストを持つトップレベルのテストの作成を示しています。

```js [ESM]
test('トップレベルテスト', async (t) => {
  await t.test('サブテスト 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('サブテスト 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
この例では、`await` は両方のサブテストが完了したことを保証するために使用されます。これは、スイート内で作成されたテストとは異なり、テストはサブテストの完了を待たないため、必要です。親が終了したときにまだ未完了のサブテストはキャンセルされ、失敗として扱われます。サブテストの失敗は、親テストの失敗を引き起こします。

## テストのスキップ {#skipping-tests}

個々のテストは、テストに `skip` オプションを渡すか、次の例に示すようにテストコンテキストの `skip()` メソッドを呼び出すことでスキップできます。

```js [ESM]
// skip オプションが使用されていますが、メッセージは提供されていません。
test('skip オプション', { skip: true }, (t) => {
  // このコードは実行されません。
});

// skip オプションが使用されており、メッセージが提供されています。
test('メッセージ付きの skip オプション', { skip: 'これはスキップされます' }, (t) => {
  // このコードは実行されません。
});

test('skip() メソッド', (t) => {
  // テストに追加のロジックが含まれている場合は、ここでも必ず return してください。
  t.skip();
});

test('メッセージ付きの skip() メソッド', (t) => {
  // テストに追加のロジックが含まれている場合は、ここでも必ず return してください。
  t.skip('これはスキップされます');
});
```
## TODO テスト {#todo-tests}

個々のテストは、テストに `todo` オプションを渡すか、次の例に示すようにテストコンテキストの `todo()` メソッドを呼び出すことで、不安定または未完了としてマークできます。これらのテストは、保留中の実装または修正が必要なバグを表します。TODO テストは実行されますが、テストの失敗としては扱われず、したがってプロセスの終了コードに影響を与えません。テストが TODO とスキップの両方としてマークされている場合、TODO オプションは無視されます。

```js [ESM]
// todo オプションが使用されていますが、メッセージは提供されていません。
test('todo オプション', { todo: true }, (t) => {
  // このコードは実行されますが、失敗としては扱われません。
  throw new Error('これはテストを失敗させません');
});

// todo オプションが使用されており、メッセージが提供されています。
test('メッセージ付きの todo オプション', { todo: 'これは TODO テストです' }, (t) => {
  // このコードは実行されます。
});

test('todo() メソッド', (t) => {
  t.todo();
});

test('メッセージ付きの todo() メソッド', (t) => {
  t.todo('これは TODO テストであり、失敗としては扱われません');
  throw new Error('これはテストを失敗させません');
});
```

## `describe()` と `it()` のエイリアス {#describe-and-it-aliases}

スイートとテストは、`describe()` 関数と `it()` 関数を使って記述することもできます。[`describe()`](/ja/nodejs/api/test#describename-options-fn) は [`suite()`](/ja/nodejs/api/test#suitename-options-fn) のエイリアスであり、[`it()`](/ja/nodejs/api/test#itname-options-fn) は [`test()`](/ja/nodejs/api/test#testname-options-fn) のエイリアスです。

```js [ESM]
describe('A thing', () => {
  it('should work', () => {
    assert.strictEqual(1, 1);
  });

  it('should be ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('a nested thing', () => {
    it('should work', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` と `it()` は `node:test` モジュールからインポートされます。

::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## `only` テスト {#only-tests}

Node.js が [`--test-only`](/ja/nodejs/api/cli#--test-only) コマンドラインオプションで起動された場合、またはテストの分離が無効になっている場合、実行されるべきテストに `only` オプションを渡すことで、選択されたサブセットを除くすべてのテストをスキップすることができます。 `only` オプションが設定されたテストがある場合、すべてのサブテストも実行されます。 スイートに `only` オプションが設定されている場合、スイート内のすべてのテストが実行されます。ただし、`only` オプションが設定された子孫がある場合は、それらのテストのみが実行されます。

`test()`/`it()` 内で [サブテスト](/ja/nodejs/api/test#subtests) を使用する場合、選択されたテストのサブセットのみを実行するには、すべての祖先テストを `only` オプションでマークする必要があります。

テストコンテキストの `runOnly()` メソッドを使用して、サブテストレベルで同じ動作を実装できます。 実行されなかったテストは、テストランナーの出力から省略されます。

```js [ESM]
// Node.js が --test-only コマンドラインオプションで実行されていると仮定します。
// スイートの 'only' オプションが設定されているため、これらのテストは実行されます。
test('this test is run', { only: true }, async (t) => {
  // このテスト内では、すべてのサブテストがデフォルトで実行されます。
  await t.test('running subtest');

  // テストコンテキストを更新して、'only' オプション付きでサブテストを実行できます。
  t.runOnly(true);
  await t.test('this subtest is now skipped');
  await t.test('this subtest is run', { only: true });

  // コンテキストを切り替えて、すべてのテストを実行します。
  t.runOnly(false);
  await t.test('this subtest is now run');

  // これらのテストを明示的に実行しません。
  await t.test('skipped subtest 3', { only: false });
  await t.test('skipped subtest 4', { skip: true });
});

// 'only' オプションが設定されていないため、このテストはスキップされます。
test('this test is not run', () => {
  // このコードは実行されません。
  throw new Error('fail');
});

describe('a suite', () => {
  // 'only' オプションが設定されているため、このテストは実行されます。
  it('this test is run', { only: true }, () => {
    // このコードは実行されます。
  });

  it('this test is not run', () => {
    // このコードは実行されません。
    throw new Error('fail');
  });
});

describe.only('a suite', () => {
  // 'only' オプションが設定されているため、このテストは実行されます。
  it('this test is run', () => {
    // このコードは実行されます。
  });

  it('this test is run', () => {
    // このコードは実行されます。
  });
});
```

## テストを名前でフィルタリングする {#filtering-tests-by-name}

[`--test-name-pattern`](/ja/nodejs/api/cli#--test-name-pattern) コマンドラインオプションを使用すると、指定されたパターンに名前が一致するテストのみを実行できます。また、[`--test-skip-pattern`](/ja/nodejs/api/cli#--test-skip-pattern) オプションを使用すると、指定されたパターンに名前が一致するテストをスキップできます。テスト名のパターンは、JavaScript の正規表現として解釈されます。`--test-name-pattern` および `--test-skip-pattern` オプションは、ネストされたテストを実行するために複数回指定できます。実行される各テストに対して、`beforeEach()` などの対応するテストフックも実行されます。実行されないテストは、テストランナーの出力から省略されます。

次のテストファイルがあるとします。`--test-name-pattern="test [1-3]"` オプションを指定して Node.js を起動すると、テストランナーは `test 1`、`test 2`、`test 3` を実行します。`test 1` がテスト名パターンに一致しない場合、そのサブテストはパターンに一致しても実行されません。同じテストセットは、`--test-name-pattern` を複数回渡すことでも実行できます (例: `--test-name-pattern="test 1"`、`--test-name-pattern="test 2"` など)。

```js [ESM]
test('test 1', async (t) => {
  await t.test('test 2');
  await t.test('test 3');
});

test('Test 4', async (t) => {
  await t.test('Test 5');
  await t.test('test 6');
});
```
テスト名のパターンは、正規表現リテラルを使用して指定することもできます。これにより、正規表現フラグを使用できます。前の例では、`--test-name-pattern="/test [4-5]/i"` (または `--test-skip-pattern="/test [4-5]/i"`) を指定して Node.js を起動すると、パターンは大文字と小文字を区別しないため、`Test 4` と `Test 5` が一致します。

パターンを使用して単一のテストに一致させるには、それが一意であることを確認するために、スペースで区切られたすべての祖先のテスト名をプレフィックスとして付けることができます。たとえば、次のテストファイルがあるとします。

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
`--test-name-pattern="test 1 some test"` を指定して Node.js を起動すると、`test 1` の `some test` のみが一致します。

テスト名のパターンは、テストランナーが実行するファイルのセットを変更しません。

`--test-name-pattern` と `--test-skip-pattern` の両方が指定されている場合、テストを実行するには、**両方**の要件を満たす必要があります。


## 余分な非同期アクティビティ {#extraneous-asynchronous-activity}

テスト関数が実行を終えると、テストの順序を維持しながら、できるだけ早く結果が報告されます。ただし、テスト関数がテスト自体よりも長く続く非同期アクティビティを生成する可能性があります。テストランナーはこのタイプのアクティビティを処理しますが、それを考慮するためにテスト結果の報告を遅らせることはありません。

次の例では、テストは2つの未処理の `setImmediate()` 操作で完了します。最初の `setImmediate()` は、新しいサブテストを作成しようとします。親テストがすでに終了し、その結果を出力しているため、新しいサブテストはすぐに失敗としてマークされ、後で[\<TestsStream\>](/ja/nodejs/api/test#class-testsstream)に報告されます。

2番目の `setImmediate()` は、 `uncaughtException` イベントを作成します。完了したテストから発生した `uncaughtException` および `unhandledRejection` イベントは、 `test` モジュールによって失敗としてマークされ、[\<TestsStream\>](/ja/nodejs/api/test#class-testsstream)によって最上位で診断警告として報告されます。

```js [ESM]
test('非同期アクティビティを作成するテスト', (t) => {
  setImmediate(() => {
    t.test('遅れて作成されたサブテスト', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // テストはこの行の後に終了します。
});
```
## ウォッチモード {#watch-mode}

**追加:** v19.2.0, v18.13.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index) - 試験的
:::

Node.js テストランナーは、`--watch` フラグを渡すことで、ウォッチモードでの実行をサポートします。

```bash [BASH]
node --test --watch
```
ウォッチモードでは、テストランナーはテストファイルとその依存関係への変更を監視します。変更が検出されると、テストランナーは変更の影響を受けたテストを再実行します。テストランナーは、プロセスが終了するまで実行を継続します。

## コマンドラインからのテストの実行 {#running-tests-from-the-command-line}

Node.js テストランナーは、[`--test`](/ja/nodejs/api/cli#--test) フラグを渡すことによってコマンドラインから呼び出すことができます。

```bash [BASH]
node --test
```
デフォルトでは、Node.js は次のパターンに一致するすべてのファイルを実行します。

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

[`--experimental-strip-types`](/ja/nodejs/api/cli#--experimental-strip-types) が指定されている場合、次の追加パターンが一致します。

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

または、以下に示すように、1つまたは複数のグロブパターンを Node.js コマンドの最後の引数として指定できます。グロブパターンは、[`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7) の動作に従います。グロブパターンは、シェル拡張を防ぐためにコマンドラインで二重引用符で囲む必要があります。これにより、システム間の移植性が低下する可能性があります。

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
一致するファイルは、テストファイルとして実行されます。テストファイルの実行に関する詳細については、[テストランナー実行モデル](/ja/nodejs/api/test#test-runner-execution-model)のセクションを参照してください。


### テストランナーの実行モデル {#test-runner-execution-model}

プロセスレベルのテスト分離が有効になっている場合、一致する各テストファイルは個別の子プロセスで実行されます。同時に実行される子プロセスの最大数は、[`--test-concurrency`](/ja/nodejs/api/cli#--test-concurrency) フラグで制御されます。子プロセスが終了コード 0 で終了した場合、テストは合格と見なされます。それ以外の場合、テストは失敗と見なされます。テストファイルは Node.js で実行可能である必要がありますが、内部で `node:test` モジュールを使用する必要はありません。

各テストファイルは、通常のスクリプトであるかのように実行されます。つまり、テストファイル自体が `node:test` を使用してテストを定義する場合、それらのテストはすべて、[`test()`](/ja/nodejs/api/test#testname-options-fn) の `concurrency` オプションの値に関係なく、単一のアプリケーションスレッド内で実行されます。

プロセスレベルのテスト分離が無効になっている場合、一致する各テストファイルはテストランナープロセスにインポートされます。すべてのテストファイルがロードされると、トップレベルのテストが concurrency 1 で実行されます。テストファイルはすべて同じコンテキスト内で実行されるため、分離が有効になっている場合には不可能な方法でテストが相互作用する可能性があります。たとえば、テストがグローバル状態に依存している場合、その状態は別のファイルから発生したテストによって変更される可能性があります。

## コードカバレッジの収集 {#collecting-code-coverage}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index) - 実験的
:::

Node.js が [`--experimental-test-coverage`](/ja/nodejs/api/cli#--experimental-test-coverage) コマンドラインフラグで起動されると、コードカバレッジが収集され、すべてのテストが完了すると統計がレポートされます。[`NODE_V8_COVERAGE`](/ja/nodejs/api/cli#node_v8_coveragedir) 環境変数がコードカバレッジディレクトリを指定するために使用される場合、生成された V8 カバレッジファイルはそのディレクトリに書き込まれます。Node.js のコアモジュールと `node_modules/` ディレクトリ内のファイルは、デフォルトではカバレッジレポートに含まれません。ただし、[`--test-coverage-include`](/ja/nodejs/api/cli#--test-coverage-include) フラグを使用して明示的に含めることができます。デフォルトでは、一致するすべてのテストファイルはカバレッジレポートから除外されます。除外は、[`--test-coverage-exclude`](/ja/nodejs/api/cli#--test-coverage-exclude) フラグを使用してオーバーライドできます。カバレッジが有効になっている場合、カバレッジレポートは `'test:coverage'` イベントを介して [テストレポーター](/ja/nodejs/api/test#test-reporters) に送信されます。

次のコメント構文を使用して、一連の行でカバレッジを無効にすることができます。

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // このブランチ内のコードは決して実行されませんが、これらの行は
  // カバレッジの目的では無視されます。'disable' コメントに続くすべての行は、
  // 対応する 'enable' コメントが出現するまで無視されます。
  console.log('this is never executed');
}
/* node:coverage enable */
```
カバレッジは、指定された行数に対して無効にすることもできます。指定された行数が経過すると、カバレッジは自動的に再度有効になります。行数が明示的に指定されていない場合、1 行が無視されます。

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### Coverage reporters {#coverage-reporters}

tapおよびspecレポーターは、カバレッジ統計の要約を出力します。lcovレポーターもあり、詳細なカバレッジレポートとして使用できるlcovファイルを生成します。

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- このレポーターではテスト結果は報告されません。
- このレポーターは、他のレポーターと組み合わせて使用​​するのが理想的です。

## Mocking {#mocking}

`node:test`モジュールは、トップレベルの`mock`オブジェクトを介して、テスト中のモックをサポートしています。次の例では、2つの数値を加算する関数のスパイを作成します。次に、スパイを使用して、関数が期待どおりに呼び出されたことをアサートします。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('spies on a function', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('spies on a function', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```
:::

同じモック機能は、各テストの[`TestContext`](/ja/nodejs/api/test#class-testcontext)オブジェクトにも公開されています。次の例では、`TestContext`で公開されているAPIを使用して、オブジェクトメソッドのスパイを作成します。テストコンテキストを介したモックの利点は、テストの完了後にテストランナーがすべてのモック機能を自動的に復元することです。

```js [ESM]
test('spies on an object method', (t) => {
  const number = {
    value: 5,
    add(a) {
      return this.value + a;
    },
  };

  t.mock.method(number, 'add');
  assert.strictEqual(number.add.mock.callCount(), 0);
  assert.strictEqual(number.add(3), 8);
  assert.strictEqual(number.add.mock.callCount(), 1);

  const call = number.add.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 8);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### タイマー {#timers}

タイマーのモックは、ソフトウェアテストで一般的に使用されるテクニックで、`setInterval` や `setTimeout` などのタイマーの動作を、指定された時間間隔を実際に待つことなく、シミュレートおよび制御するために使用されます。

メソッドと機能の完全なリストについては、[`MockTimers`](/ja/nodejs/api/test#class-mocktimers) クラスを参照してください。

これにより、開発者は時間依存の機能に対して、より信頼性が高く予測可能なテストを作成できます。

以下の例は、`setTimeout` をモックする方法を示しています。`.enable({ apis: ['setTimeout'] });` を使用すると、[node:timers](/ja/nodejs/api/timers) および [node:timers/promises](/ja/nodejs/api/timers#timers-promises-api) モジュール、ならびに Node.js のグローバルコンテキストの `setTimeout` 関数がモックされます。

**注:** `import { setTimeout } from 'node:timers'` のような関数の分割代入は、現在のところこのAPIではサポートされていません。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('setTimeoutをモックして、実際に待つことなく同期的に実行されるようにする', () => {
  const fn = mock.fn();

  // オプションで、何をモックするかを選択します
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 時間を進めます
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // グローバルに追跡されたモックをリセットします。
  mock.timers.reset();

  // reset mockインスタンスを呼び出すと、timersインスタンスもリセットされます
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('setTimeoutをモックして、実際に待つことなく同期的に実行されるようにする', () => {
  const fn = mock.fn();

  // オプションで、何をモックするかを選択します
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 時間を進めます
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // グローバルに追跡されたモックをリセットします。
  mock.timers.reset();

  // reset mockインスタンスを呼び出すと、timersインスタンスもリセットされます
  mock.reset();
});
```
:::

同じモック機能は、各テストの [`TestContext`](/ja/nodejs/api/test#class-testcontext) オブジェクトの mock プロパティにも公開されています。テストコンテキストを介してモックすることの利点は、テストの完了時にテストランナーがすべてのモックされたタイマー機能を自動的に復元することです。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('setTimeoutをモックして、実際に待つことなく同期的に実行されるようにする', (context) => {
  const fn = context.mock.fn();

  // オプションで、何をモックするかを選択します
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 時間を進めます
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTimeoutをモックして、実際に待つことなく同期的に実行されるようにする', (context) => {
  const fn = context.mock.fn();

  // オプションで、何をモックするかを選択します
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // 時間を進めます
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

### 日付 {#dates}

モックタイマーAPIでは、`Date`オブジェクトのモックも可能です。これは、時間依存の機能をテストしたり、`Date.now()`などの内部カレンダー関数をシミュレートしたりするのに便利な機能です。

日付の実装も[`MockTimers`](/ja/nodejs/api/test#class-mocktimers)クラスの一部です。メソッドと機能の完全なリストについては、そちらを参照してください。

**注:** 日付とタイマーは、一緒にモックされる場合に依存関係があります。つまり、`Date`と`setTimeout`の両方をモックしている場合、時間を進めると、単一の内部クロックをシミュレートするため、モックされた日付も進みます。

以下の例は、`Date`オブジェクトをモックし、現在の`Date.now()`の値を取得する方法を示しています。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

初期エポックが設定されていない場合、初期日付はUnixエポックの0に基づいて設定されます。これは、1970年1月1日、00:00:00 UTCです。`.enable()`メソッドに`now`プロパティを渡すことで、初期日付を設定できます。この値は、モックされた`Date`オブジェクトの初期日付として使用されます。正の整数または別のDateオブジェクトのいずれかを指定できます。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

`.setTime()`メソッドを使用して、モックされた日付を手動で別の時間に移動できます。このメソッドは、正の整数のみを受け入れます。

**注:** このメソッドは、新しい時間から過去にあるモックされたタイマーを実行します。

以下の例では、モックされた日付の新しい時間を設定しています。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

過去に実行するように設定されているタイマーがある場合、`.tick()`メソッドが呼び出されたかのように実行されます。これは、すでに過去にある時間依存の機能をテストする場合に役立ちます。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

`.runAll()`を使用すると、現在キューにあるすべてのタイマーが実行されます。これにより、モックされた日付も、時間が経過したかのように、最後に実行されたタイマーの時間に進みます。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::


## スナップショットテスト {#snapshot-testing}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).0 - 開発初期
:::

スナップショットテストでは、任意の値を文字列値にシリアライズし、既知の良質な値のセットと比較できます。既知の良質な値はスナップショットと呼ばれ、スナップショットファイルに保存されます。スナップショットファイルはテストランナーによって管理されますが、デバッグを支援するために人間が読めるように設計されています。ベストプラクティスは、スナップショットファイルをテストファイルと一緒にソース管理にチェックインすることです。

スナップショットファイルは、Node.jsを[`--test-update-snapshots`](/ja/nodejs/api/cli#--test-update-snapshots)コマンドラインフラグを付けて起動することで生成されます。テストファイルごとに個別のスナップショットファイルが生成されます。デフォルトでは、スナップショットファイルはテストファイルと同じ名前で、拡張子`.snapshot`が付きます。この動作は、`snapshot.setResolveSnapshotPath()`関数を使用して構成できます。各スナップショットアサーションは、スナップショットファイルのエクスポートに対応します。

スナップショットテストの例を以下に示します。このテストを最初に実行すると、対応するスナップショットファイルが存在しないため、失敗します。

```js [ESM]
// test.js
suite('スナップショットテストのスイート', () => {
  test('スナップショットテスト', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
`--test-update-snapshots`を使用してテストファイルを実行して、スナップショットファイルを生成します。テストは合格し、`test.js.snapshot`という名前のファイルがテストファイルと同じディレクトリに作成されます。スナップショットファイルの内容を以下に示します。各スナップショットは、テストのフルネームと、同じテスト内のスナップショットを区別するためのカウンターによって識別されます。

```js [ESM]
exports[`スナップショットテストのスイート > スナップショットテスト 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`スナップショットテストのスイート > スナップショットテスト 2`] = `
5
`;
```
スナップショットファイルが作成されたら、`--test-update-snapshots`フラグなしでテストを再度実行します。テストは合格するはずです。


## テストレポーター {#test-reporters}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.9.0, v18.17.0 | レポーターは `node:test/reporters` で公開されるようになりました。 |
| v19.6.0, v18.15.0 | 追加: v19.6.0, v18.15.0 |
:::

`node:test` モジュールは、テストランナーが特定のリポーターを使用するように、[`--test-reporter`](/ja/nodejs/api/cli#--test-reporter) フラグの引き渡しをサポートします。

以下の組み込みリポーターがサポートされています。

-  `spec` `spec` リポーターは、テスト結果を人間が読める形式で出力します。これはデフォルトのリポーターです。
-  `tap` `tap` リポーターは、テスト結果を [TAP](https://testanything.org/) 形式で出力します。
-  `dot` `dot` リポーターは、テスト結果をコンパクトな形式で出力します。ここでは、合格した各テストは `.` で表され、失敗した各テストは `X` で表されます。
-  `junit` junit リポーターは、テスト結果を jUnit XML 形式で出力します。
-  `lcov` `lcov` リポーターは、[`--experimental-test-coverage`](/ja/nodejs/api/cli#--experimental-test-coverage) フラグとともに使用すると、テストカバレッジを出力します。

これらのリポーターの正確な出力は、Node.js のバージョン間で変更される可能性があり、プログラムで依存すべきではありません。テストランナーの出力へのプログラムによるアクセスが必要な場合は、[\<TestsStream\>](/ja/nodejs/api/test#class-testsstream) によって発行されるイベントを使用してください。

リポーターは `node:test/reporters` モジュールを介して利用できます。

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### カスタムレポーター {#custom-reporters}

[`--test-reporter`](/ja/nodejs/api/cli#--test-reporter) を使用して、カスタムレポーターへのパスを指定できます。カスタムレポーターは、[stream.compose](/ja/nodejs/api/stream#streamcomposestreams) で受け入れられる値をエクスポートするモジュールです。レポーターは、[\<TestsStream\>](/ja/nodejs/api/test#class-testsstream) によって発行されるイベントを変換する必要があります。

[\<stream.Transform\>](/ja/nodejs/api/stream#class-streamtransform) を使用したカスタムレポーターの例:

::: code-group
```js [ESM]
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

export default customReporter;
```

```js [CJS]
const { Transform } = require('node:stream');

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```
:::

ジェネレーター関数を使用したカスタムレポーターの例:

::: code-group
```js [ESM]
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
}
```

```js [CJS]
module.exports = async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```
:::

`--test-reporter` に指定する値は、JavaScript コードの `import()` で使用される文字列のようなもの、または [`--import`](/ja/nodejs/api/cli#--importmodule) に指定される値である必要があります。


### 複数のレポーター {#multiple-reporters}

[`--test-reporter`](/ja/nodejs/api/cli#--test-reporter) フラグは、テスト結果を複数の形式で報告するために、複数回指定できます。この場合、[`--test-reporter-destination`](/ja/nodejs/api/cli#--test-reporter-destination) を使用して、各レポーターの出力先を指定する必要があります。出力先は、`stdout`、`stderr`、またはファイルパスにできます。レポーターと出力先は、指定された順序に従ってペアになります。

次の例では、`spec` レポーターは `stdout` に出力し、`dot` レポーターは `file.txt` に出力します。

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```

単一のレポーターが指定された場合、出力先が明示的に指定されていない限り、デフォルトで `stdout` になります。

## `run([options])` {#runoptions}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v23.0.0 | `cwd` オプションが追加されました。 |
| v23.0.0 | カバレッジオプションが追加されました。 |
| v22.8.0 | `isolation` オプションが追加されました。 |
| v22.6.0 | `globPatterns` オプションが追加されました。 |
| v22.0.0, v20.14.0 | `forceExit` オプションが追加されました。 |
| v20.1.0, v18.17.0 | testNamePatterns オプションが追加されました。 |
| v18.9.0, v16.19.0 | 追加: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) テスト実行の構成オプション。以下のプロパティがサポートされています:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 数値が提供された場合、その数のテストプロセスが並行して実行され、各プロセスは1つのテストファイルに対応します。`true` の場合、`os.availableParallelism() - 1` 個のテストファイルが並行して実行されます。`false` の場合、一度に1つのテストファイルのみが実行されます。**デフォルト:** `false`。
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テストランナーが使用する現在の作業ディレクトリを指定します。[テストランナーの実行モデル](/ja/nodejs/api/test#test-runner-execution-model)に従ってファイルを解決するためのベースパスとして機能します。**デフォルト:** `process.cwd()`。
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 実行するファイルのリストを含む配列。**デフォルト:** [テストランナーの実行モデル](/ja/nodejs/api/test#test-runner-execution-model) から一致するファイル。
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) イベントループがアクティブなままであっても、既知のすべてのテストの実行が完了したら、テストランナーがプロセスを終了するように構成します。**デフォルト:** `false`。
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) テストファイルに一致する glob パターンのリストを含む配列。このオプションは `files` と一緒に使用できません。**デフォルト:** [テストランナーの実行モデル](/ja/nodejs/api/test#test-runner-execution-model) から一致するファイル。
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) テスト子プロセスのインスペクターポートを設定します。これは数値、または引数を取らずに数値を返す関数にすることができます。nullish 値が提供された場合、各プロセスは独自のポートを取得し、プライマリの `process.debugPort` からインクリメントされます。`isolation` オプションが子プロセスが生成されない `'none'` に設定されている場合、このオプションは無視されます。**デフォルト:** `undefined`。
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テストの分離の種類を構成します。 `'process'` に設定すると、各テストファイルは個別の子プロセスで実行されます。 `'none'` に設定すると、すべてのテストファイルは現在のプロセスで実行されます。**デフォルト:** `'process'`。
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) truthy の場合、テストコンテキストは `only` オプションが設定されているテストのみを実行します。
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `TestsStream` インスタンスを受け取り、テストが実行される前にリスナーを設定するために使用できる関数。**デフォルト:** `undefined`。
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) サブプロセスを生成するときに `node` 実行ファイルに渡す CLI フラグの配列。このオプションは `isolation` が `'none'` の場合は効果がありません。**デフォルト:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) サブプロセスを生成するときに各テストファイルに渡す CLI フラグの配列。このオプションは `isolation` が `'none'` の場合は効果がありません。**デフォルト:** `[]`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のテスト実行を中止できます。
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 提供されたパターンに名前が一致するテストのみを実行するために使用できる、文字列、正規表現、または正規表現の配列。テスト名パターンは、JavaScript の正規表現として解釈されます。実行される各テストについて、`beforeEach()` などの対応するテストフックも実行されます。**デフォルト:** `undefined`。
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 提供されたパターンに名前が一致するテストの実行を除外するために使用できる、文字列、正規表現、または正規表現の配列。テスト名パターンは、JavaScript の正規表現として解釈されます。実行される各テストについて、`beforeEach()` などの対応するテストフックも実行されます。**デフォルト:** `undefined`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストの実行が失敗するまでのミリ秒数。指定しない場合、サブテストはこの値を親から継承します。**デフォルト:** `Infinity`。
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ウォッチモードで実行するかどうか。**デフォルト:** `false`。
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 特定のシャードでテストを実行します。**デフォルト:** `undefined`。
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) は、実行するシャードのインデックスを指定する 1 から `\<total\>` までの正の整数です。このオプションは *必須* です。
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) は、テストファイルを分割するシャードの合計数を指定する正の整数です。このオプションは *必須* です。

    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) [コードカバレッジ](/ja/nodejs/api/test#collecting-code-coverage)の収集を有効にします。**デフォルト:** `false`。
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 絶対パスと相対パスの両方に一致する glob パターンを使用して、コードカバレッジから特定のファイルを除外します。このプロパティは、`coverage` が `true` に設定されている場合にのみ適用されます。`coverageExcludeGlobs` と `coverageIncludeGlobs` の両方が提供されている場合、ファイルはカバレッジレポートに含めるために **両方** の基準を満たす必要があります。**デフォルト:** `undefined`。
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 絶対パスと相対パスの両方に一致する glob パターンを使用して、コードカバレッジに特定のファイルを含めます。このプロパティは、`coverage` が `true` に設定されている場合にのみ適用されます。`coverageExcludeGlobs` と `coverageIncludeGlobs` の両方が提供されている場合、ファイルはカバレッジレポートに含めるために **両方** の基準を満たす必要があります。**デフォルト:** `undefined`。
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた行の最小パーセントが必要です。コードカバレッジが指定された閾値に達しない場合、プロセスはコード `1` で終了します。**デフォルト:** `0`。
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされたブランチの最小パーセントが必要です。コードカバレッジが指定された閾値に達しない場合、プロセスはコード `1` で終了します。**デフォルト:** `0`。
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた関数の最小パーセントが必要です。コードカバレッジが指定された閾値に達しない場合、プロセスはコード `1` で終了します。**デフォルト:** `0`。

- 戻り値: [\<TestsStream\>](/ja/nodejs/api/test#class-testsstream)

**注:** `shard` は、マシンまたはプロセス間でテスト実行を水平方向に並列化するために使用されます。これは、さまざまな環境での大規模な実行に最適です。ファイル変更時にテストを自動的に再実行することにより、迅速なコードイテレーションに合わせて調整された `watch` モードとは互換性がありません。

::: code-group
```js [ESM]
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```

```js [CJS]
const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const path = require('node:path');

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```
:::


## `suite([name][, options][, fn])` {#suitename-options-fn}

**追加: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) スイートの名前。テスト結果を報告する際に表示されます。**デフォルト:** `fn` の `name` プロパティ。`fn` に名前がない場合は、`'\<anonymous\>'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) スイートのオプション設定。`test([name][, options][, fn])` と同じオプションをサポートします。
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) ネストされたテストとスイートを宣言するスイート関数。この関数の最初の引数は、[`SuiteContext`](/ja/nodejs/api/test#class-suitecontext) オブジェクトです。**デフォルト:** 何もしない関数。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) `undefined` で即座に解決されます。

`suite()` 関数は `node:test` モジュールからインポートされます。

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**追加: v22.0.0, v20.13.0**

スイートをスキップするためのショートハンド。これは、[`suite([name], { skip: true }[, fn])`](/ja/nodejs/api/test#suitename-options-fn) と同じです。

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**追加: v22.0.0, v20.13.0**

スイートを `TODO` としてマークするためのショートハンド。これは、[`suite([name], { todo: true }[, fn])`](/ja/nodejs/api/test#suitename-options-fn) と同じです。

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**追加: v22.0.0, v20.13.0**

スイートを `only` としてマークするためのショートハンド。これは、[`suite([name], { only: true }[, fn])`](/ja/nodejs/api/test#suitename-options-fn) と同じです。

## `test([name][, options][, fn])` {#testname-options-fn}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.2.0, v18.17.0 | `skip`、`todo`、`only` のショートハンドを追加。 |
| v18.8.0, v16.18.0 | `signal` オプションを追加。 |
| v18.7.0, v16.17.0 | `timeout` オプションを追加。 |
| v18.0.0, v16.17.0 | 追加: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テストの名前。テスト結果を報告する際に表示されます。**デフォルト:** `fn` の `name` プロパティ。`fn` に名前がない場合は、`'\<anonymous\>'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) テストのオプション設定。次のプロパティがサポートされています。
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 数値が指定された場合、その数のテストがアプリケーションスレッド内で並行して実行されます。`true` の場合、スケジュールされたすべての非同期テストがスレッド内で並行して実行されます。`false` の場合、一度に 1 つのテストのみが実行されます。未指定の場合、サブテストはこの値を親から継承します。**デフォルト:** `false`。
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 真の値で、テストコンテキストが `only` テストを実行するように設定されている場合、このテストが実行されます。それ以外の場合、テストはスキップされます。**デフォルト:** `false`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のテストを中止できます。
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 真の値の場合、テストはスキップされます。文字列が指定された場合、その文字列はテストをスキップする理由としてテスト結果に表示されます。**デフォルト:** `false`。
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 真の値の場合、テストは `TODO` としてマークされます。文字列が指定された場合、その文字列はテストが `TODO` である理由としてテスト結果に表示されます。**デフォルト:** `false`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストが失敗するまでのミリ秒数。未指定の場合、サブテストはこの値を親から継承します。**デフォルト:** `Infinity`。
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストで実行されると予想されるアサーションとサブテストの数。テストで実行されるアサーションの数がプランで指定された数と一致しない場合、テストは失敗します。**デフォルト:** `undefined`。

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) テスト対象の関数。この関数の最初の引数は [`TestContext`](/ja/nodejs/api/test#class-testcontext) オブジェクトです。テストがコールバックを使用する場合、コールバック関数が 2 番目の引数として渡されます。**デフォルト:** 何もしない関数。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) テストが完了すると `undefined` で解決されます。または、テストがスイート内で実行される場合はすぐに解決されます。

`test()` 関数は、`test` モジュールからインポートされる値です。この関数の各呼び出しにより、[\<TestsStream\>](/ja/nodejs/api/test#class-testsstream) にテストが報告されます。

`fn` 引数に渡される `TestContext` オブジェクトを使用して、現在のテストに関連するアクションを実行できます。例としては、テストのスキップ、追加の診断情報の追加、サブテストの作成などがあります。

`test()` は、テストが完了すると解決される `Promise` を返します。 `test()` がスイート内で呼び出された場合、すぐに解決されます。最上位のテストでは、通常、戻り値は破棄できます。ただし、次の例に示すように、親テストが最初に終了してサブテストをキャンセルしないようにするために、サブテストからの戻り値を使用する必要があります。

```js [ESM]
test('トップレベルテスト', async (t) => {
  // 次のサブテストの setTimeout() は、次の行で 'await' が削除された場合、親テストよりも長く存続することになります。親テストが完了すると、未完了のサブテストはすべてキャンセルされます。
  await t.test('より長く実行されるサブテスト', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```

`timeout` オプションを使用すると、完了までに `timeout` ミリ秒を超えた場合にテストを失敗させることができます。ただし、実行中のテストがアプリケーションスレッドをブロックし、スケジュールされたキャンセルを妨げる可能性があるため、テストをキャンセルする信頼できるメカニズムではありません。


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

テストをスキップするための省略形であり、[`test([name], { skip: true }[, fn])`](/ja/nodejs/api/test#testname-options-fn) と同じです。

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

テストを `TODO` としてマークするための省略形であり、[`test([name], { todo: true }[, fn])`](/ja/nodejs/api/test#testname-options-fn) と同じです。

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

テストを `only` としてマークするための省略形であり、[`test([name], { only: true }[, fn])`](/ja/nodejs/api/test#testname-options-fn) と同じです。

## `describe([name][, options][, fn])` {#describename-options-fn}

[`suite()`](/ja/nodejs/api/test#suitename-options-fn) のエイリアス。

`describe()` 関数は `node:test` モジュールからインポートされます。

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

スイートをスキップするための省略形。 これは [`describe([name], { skip: true }[, fn])`](/ja/nodejs/api/test#describename-options-fn) と同じです。

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

スイートを `TODO` としてマークするための省略形。 これは [`describe([name], { todo: true }[, fn])`](/ja/nodejs/api/test#describename-options-fn) と同じです。

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**追加: v19.8.0, v18.15.0**

スイートを `only` としてマークするための省略形。 これは [`describe([name], { only: true }[, fn])`](/ja/nodejs/api/test#describename-options-fn) と同じです。

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v19.8.0, v18.16.0 | `it()` の呼び出しが `test()` の呼び出しと同等になりました。 |
| v18.6.0, v16.17.0 | 追加: v18.6.0, v16.17.0 |
:::

[`test()`](/ja/nodejs/api/test#testname-options-fn) のエイリアス。

`it()` 関数は `node:test` モジュールからインポートされます。

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

テストをスキップするための省略形であり、[`it([name], { skip: true }[, fn])`](/ja/nodejs/api/test#testname-options-fn) と同じです。

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

テストを `TODO` としてマークするための省略形であり、[`it([name], { todo: true }[, fn])`](/ja/nodejs/api/test#testname-options-fn) と同じです。

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**追加: v19.8.0, v18.15.0**

テストを `only` としてマークするための省略形であり、[`it([name], { only: true }[, fn])`](/ja/nodejs/api/test#testname-options-fn) と同じです。


## `before([fn][, options])` {#beforefn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) フック関数。フックがコールバックを使用する場合、コールバック関数は2番目の引数として渡されます。**Default:** 何もしない関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) フックの設定オプション。次のプロパティがサポートされています。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のフックを中止できます。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フックが失敗するまでのミリ秒数。未指定の場合、サブテストは親からこの値を継承します。**Default:** `Infinity`.
  
 

この関数は、スイートを実行する前に実行されるフックを作成します。

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) フック関数。フックがコールバックを使用する場合、コールバック関数は2番目の引数として渡されます。**Default:** 何もしない関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) フックの設定オプション。次のプロパティがサポートされています。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のフックを中止できます。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フックが失敗するまでのミリ秒数。未指定の場合、サブテストは親からこの値を継承します。**Default:** `Infinity`.
  
 

この関数は、スイートの実行後に実行されるフックを作成します。

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**Note:** `after` フックは、スイート内のテストが失敗した場合でも、実行されることが保証されています。


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) フック関数。フックがコールバックを使用する場合、コールバック関数は2番目の引数として渡されます。**Default:** 何もしない関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) フックの構成オプション。以下のプロパティがサポートされています。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のフックを中止できます。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フックが失敗するまでのミリ秒数。未指定の場合、サブテストはこの値を親から継承します。**Default:** `Infinity`.
  
 

この関数は、現在のスイートの各テストの前に実行されるフックを作成します。

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) フック関数。フックがコールバックを使用する場合、コールバック関数は2番目の引数として渡されます。**Default:** 何もしない関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) フックの構成オプション。以下のプロパティがサポートされています。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のフックを中止できます。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フックが失敗するまでのミリ秒数。未指定の場合、サブテストはこの値を親から継承します。**Default:** `Infinity`.
  
 

この関数は、現在のスイートの各テストの後に実行されるフックを作成します。`afterEach()`フックは、テストが失敗した場合でも実行されます。

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**追加:** v22.3.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index).0 - 開発初期
:::

現在のプロセスにおけるデフォルトのスナップショット設定を構成するために使用されるメソッドを持つオブジェクト。共通の設定コードを `--require` または `--import` でプリロードされたモジュールに配置することにより、同じ設定をすべてのファイルに適用できます。

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**追加:** v22.3.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index).0 - 開発初期
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) スナップショットテストのデフォルトのシリアライザーとして使用される同期関数の配列。

この関数は、テストランナーが使用するデフォルトのシリアル化メカニズムをカスタマイズするために使用されます。デフォルトでは、テストランナーは提供された値に対して `JSON.stringify(value, null, 2)` を呼び出すことによってシリアル化を実行します。 `JSON.stringify()` には、循環構造とサポートされるデータ型に関する制限があります。より堅牢なシリアル化メカニズムが必要な場合は、この関数を使用する必要があります。

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**追加:** v22.3.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定版: 1](/ja/nodejs/api/documentation#stability-index).0 - 開発初期
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) スナップショットファイルの場所を計算するために使用される関数。この関数は、テストファイルのパスを唯一の引数として受け取ります。テストがファイルに関連付けられていない場合 (たとえば、REPL の場合)、入力は未定義です。 `fn()` は、スナップショットスナップショットファイルの場所を指定する文字列を返す必要があります。

この関数は、スナップショットテストに使用されるスナップショットファイルの場所をカスタマイズするために使用されます。デフォルトでは、スナップショットファイル名は、エントリポイントファイル名と同じで、`.snapshot` ファイル拡張子が付いています。


## クラス: `MockFunctionContext` {#class-mockfunctioncontext}

**追加: v19.1.0, v18.13.0**

`MockFunctionContext` クラスは、[`MockTracker`](/ja/nodejs/api/test#class-mocktracker) API を介して作成されたモックの動作を検査または操作するために使用されます。

### `ctx.calls` {#ctxcalls}

**追加: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

モックへの呼び出しを追跡するために使用される内部配列のコピーを返すゲッター。配列内の各エントリは、次のプロパティを持つオブジェクトです。

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) モック関数に渡された引数の配列。
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) モック関数が例外をスローした場合、このプロパティにはスローされた値が含まれます。**デフォルト:** `undefined`。
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) モック関数によって返される値。
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) モック関数の呼び出し元を特定するために使用できるスタックを持つ `Error` オブジェクト。
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) モック関数がコンストラクターである場合、このフィールドには構築中のクラスが含まれます。それ以外の場合、これは `undefined` になります。
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) モック関数の `this` 値。

### `ctx.callCount()` {#ctxcallcount}

**追加: v19.1.0, v18.13.0**

- 戻り値: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) このモックが呼び出された回数。

この関数は、このモックが呼び出された回数を返します。この関数は、`ctx.calls.length` を確認するよりも効率的です。なぜなら `ctx.calls` は、内部呼び出し追跡配列のコピーを作成するゲッターであるためです。


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**Added in: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) モックの新しい実装として使用される関数。

この関数は、既存のモックの動作を変更するために使用されます。

次の例では、`t.mock.fn()`を使用してモック関数を作成し、そのモック関数を呼び出し、その後モックの実装を別の関数に変更します。

```js [ESM]
test('モックの動作を変更する', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementation(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 5);
});
```
### `ctx.mockImplementationOnce(implementation[, onCall])` {#ctxmockimplementationonceimplementation-oncall}

**Added in: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) `onCall`で指定された呼び出し回数に対して、モックの実装として使用される関数。
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `implementation`を使用する呼び出し回数。 指定された呼び出しがすでに発生している場合、例外がスローされます。 **デフォルト:** 次の呼び出しの回数。

この関数は、単一の呼び出しに対して既存のモックの動作を変更するために使用されます。 呼び出し`onCall`が発生すると、モックは`mockImplementationOnce()`が呼び出されなかった場合に使用していたであろう動作に戻ります。

次の例では、`t.mock.fn()`を使用してモック関数を作成し、そのモック関数を呼び出し、次の呼び出しに対してモックの実装を別の関数に変更し、その後以前の動作を再開します。

```js [ESM]
test('モックの動作を一度変更する', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementationOnce(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 4);
});
```

### `ctx.resetCalls()` {#ctxresetcalls}

**追加:** v19.3.0, v18.13.0

モック関数の呼び出し履歴をリセットします。

### `ctx.restore()` {#ctxrestore}

**追加:** v19.1.0, v18.13.0

モック関数の実装を元の動作にリセットします。この関数を呼び出した後でも、モックは引き続き使用できます。

## Class: `MockModuleContext` {#class-mockmodulecontext}

**追加:** v22.3.0, v20.18.0

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [安定度: 1](/ja/nodejs/api/documentation#stability-index).0 - 開発初期段階
:::

`MockModuleContext` クラスは、[`MockTracker`](/ja/nodejs/api/test#class-mocktracker) API を介して作成されたモジュールモックの動作を操作するために使用されます。

### `ctx.restore()` {#ctxrestore_1}

**追加:** v22.3.0, v20.18.0

モックモジュールの実装をリセットします。

## Class: `MockTracker` {#class-mocktracker}

**追加:** v19.1.0, v18.13.0

`MockTracker` クラスは、モック機能を管理するために使用されます。テストランナーモジュールは、`MockTracker` インスタンスであるトップレベルの `mock` エクスポートを提供します。各テストは、テストコンテキストの `mock` プロパティを介して、独自の `MockTracker` インスタンスも提供します。

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**追加:** v19.1.0, v18.13.0

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) モックを作成するためのオプションの関数。 **デフォルト:** no-op 関数。
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) `original` のモック実装として使用されるオプションの関数。これは、指定された回数の呼び出しに対してある動作を示し、その後 `original` の動作を復元するモックを作成するのに役立ちます。 **デフォルト:** `original` で指定された関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) モック関数のオプションの構成オプション。次のプロパティがサポートされています。
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) モックが `implementation` の動作を使用する回数。モック関数が `times` 回呼び出されると、`original` の動作が自動的に復元されます。この値は、ゼロより大きい整数でなければなりません。 **デフォルト:** `Infinity`。

- 戻り値: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) モックされた関数。モックされた関数には、[`MockFunctionContext`](/ja/nodejs/api/test#class-mockfunctioncontext) のインスタンスである特別な `mock` プロパティが含まれており、モックされた関数の動作を検査および変更するために使用できます。

この関数は、モック関数を作成するために使用されます。

次の例では、呼び出しごとにカウンターを 1 ずつ増分するモック関数を作成します。`times` オプションは、最初の 2 回の呼び出しで 1 ではなく 2 をカウンターに追加するようにモックの動作を変更するために使用されます。

```js [ESM]
test('mocks a counting function', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne, addTwo, { times: 2 });

  assert.strictEqual(fn(), 2);
  assert.strictEqual(fn(), 4);
  assert.strictEqual(fn(), 5);
  assert.strictEqual(fn(), 6);
});
```

### `mock.getter(object, methodName[, implementation][, options])` {#mockgetterobject-methodname-implementation-options}

**Added in: v19.3.0, v18.13.0**

この関数は、`options.getter`が`true`に設定された[`MockTracker.method`](/ja/nodejs/api/test#mockmethodobject-methodname-implementation-options)の構文糖です。

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**Added in: v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) モックされるメソッドを持つオブジェクト。
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) モックする`object`のメソッドの識別子。`object[methodName]`が関数でない場合、エラーがスローされます。
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) `object[methodName]`のモック実装として使用されるオプションの関数。**デフォルト:** `object[methodName]`で指定された元のメソッド。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) モックメソッドのオプションの構成オプション。次のプロパティがサポートされています。
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、`object[methodName]`はゲッターとして扱われます。このオプションは、`setter`オプションと一緒に使用することはできません。**デフォルト:** false。
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`の場合、`object[methodName]`はセッターとして扱われます。このオプションは、`getter`オプションと一緒に使用することはできません。**デフォルト:** false。
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) モックが`implementation`の動作を使用する回数。モックされたメソッドが`times`回呼び出されると、元の動作が自動的に復元されます。この値は、ゼロより大きい整数でなければなりません。**デフォルト:** `Infinity`。

- 戻り値: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) モックされたメソッド。モックされたメソッドには、[`MockFunctionContext`](/ja/nodejs/api/test#class-mockfunctioncontext)のインスタンスである特別な`mock`プロパティが含まれており、モックされたメソッドの動作を検査および変更するために使用できます。

この関数は、既存のオブジェクトメソッドにモックを作成するために使用されます。次の例は、既存のオブジェクトメソッドにモックが作成される方法を示しています。

```js [ESM]
test('spies on an object method', (t) => {
  const number = {
    value: 5,
    subtract(a) {
      return this.value - a;
    },
  };

  t.mock.method(number, 'subtract');
  assert.strictEqual(number.subtract.mock.callCount(), 0);
  assert.strictEqual(number.subtract(3), 2);
  assert.strictEqual(number.subtract.mock.callCount(), 1);

  const call = number.subtract.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 2);
  assert.strictEqual(call.error, undefined);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```

### `mock.module(specifier[, options])` {#mockmodulespecifier-options}

**Added in: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ja/nodejs/api/documentation#stability-index) [Stability: 1](/ja/nodejs/api/documentation#stability-index).0 - 早期開発
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ja/nodejs/api/url#the-whatwg-url-api) モックするモジュールを識別する文字列。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) モックモジュールのオプション設定。以下のプロパティがサポートされています:
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`の場合、`require()`または`import()`を呼び出すたびに新しいモックモジュールが生成されます。`true`の場合、後続の呼び出しは同じモックモジュールを返し、モックモジュールはCommonJSキャッシュに挿入されます。**デフォルト:** false。
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) モックモジュールのデフォルトエクスポートとして使用されるオプションの値。この値が提供されない場合、ESMモックにはデフォルトエクスポートは含まれません。モックがCommonJSまたは組み込みモジュールの場合、この設定は`module.exports`の値として使用されます。この値が提供されない場合、CJSおよび組み込みモックは空のオブジェクトを`module.exports`の値として使用します。
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) キーと値がモックモジュールの名前付きエクスポートの作成に使用されるオプションのオブジェクト。モックがCommonJSまたは組み込みモジュールの場合、これらの値は`module.exports`にコピーされます。したがって、名前付きエクスポートと非オブジェクトのデフォルトエクスポートの両方でモックが作成された場合、モックがCJSまたは組み込みモジュールとして使用されると、例外がスローされます。

- 戻り値: [\<MockModuleContext\>](/ja/nodejs/api/test#class-mockmodulecontext) モックを操作するために使用できるオブジェクト。

この関数は、ECMAScriptモジュール、CommonJSモジュール、およびNode.js組み込みモジュールのエクスポートをモックするために使用されます。モックする前の元のモジュールへの参照は影響を受けません。モジュールモックを有効にするには、Node.jsを[`--experimental-test-module-mocks`](/ja/nodejs/api/cli#--experimental-test-module-mocks)コマンドラインフラグを指定して起動する必要があります。

次の例は、モジュールのモックがどのように作成されるかを示しています。

```js [ESM]
test('mocks a builtin module in both module systems', async (t) => {
  // 'node:readline'のモックを、名前付きエクスポート'fn'で作成します。
  // 'node:readline'モジュールには存在しません。
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo()は元の'node:readline'モジュールのエクスポートです。
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // モックが復元されたため、元の組み込みモジュールが返されます。
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**追加:** v19.1.0, v18.13.0

この関数は、以前にこの `MockTracker` によって作成されたすべてのモックのデフォルトの動作を復元し、モックを `MockTracker` インスタンスから切り離します。切り離された後も、モックは引き続き使用できますが、`MockTracker` インスタンスを使用して動作をリセットしたり、その他の方法で操作したりすることはできなくなります。

各テストが完了すると、この関数はテストコンテキストの `MockTracker` で呼び出されます。グローバルな `MockTracker` が広範囲に使用されている場合は、この関数を手動で呼び出すことをお勧めします。

### `mock.restoreAll()` {#mockrestoreall}

**追加:** v19.1.0, v18.13.0

この関数は、以前にこの `MockTracker` によって作成されたすべてのモックのデフォルトの動作を復元します。`mock.reset()` とは異なり、`mock.restoreAll()` はモックを `MockTracker` インスタンスから切り離しません。

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**追加:** v19.3.0, v18.13.0

この関数は、`options.setter` が `true` に設定された [`MockTracker.method`](/ja/nodejs/api/test#mockmethodobject-methodname-implementation-options) の構文糖です。

## クラス: `MockTimers` {#class-mocktimers}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.1.0 | モックタイマーが安定版になりました。 |
| v20.4.0, v18.19.0 | 追加: v20.4.0, v18.19.0 |
:::

::: tip [安定版: 2 - 安定]
[安定版: 2](/ja/nodejs/api/documentation#stability-index) [安定性: 2](/ja/nodejs/api/documentation#stability-index) - 安定
:::

モックタイマーは、ソフトウェアテストで一般的に使用されるテクニックで、指定された時間間隔を実際に待たずに、`setInterval` や `setTimeout` などのタイマーの動作をシミュレートおよび制御します。

MockTimers は `Date` オブジェクトをモックすることもできます。

[`MockTracker`](/ja/nodejs/api/test#class-mocktracker) は、`MockTimers` インスタンスであるトップレベルの `timers` エクスポートを提供します。

### `timers.enable([enableOptions])` {#timersenableenableoptions}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v21.2.0, v20.11.0 | 使用可能な API とデフォルトの初期エポックを持つオプションオブジェクトになるようにパラメータを更新しました。 |
| v20.4.0, v18.19.0 | 追加: v20.4.0, v18.19.0 |
:::

指定されたタイマーのタイマーモックを有効にします。

- `enableOptions` [\<Object\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object) タイマーモックを有効にするためのオプションの構成オプション。次のプロパティがサポートされています。
    - `apis` [\<Array\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array) モックするタイマーを含むオプションの配列。現在サポートされているタイマーの値は、`'setInterval'`, `'setTimeout'`, `'setImmediate'`, および `'Date'` です。**デフォルト:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`。配列が提供されない場合、すべての時間関連 API (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, `'clearImmediate'`, および `'Date'`) がデフォルトでモックされます。
    - `now` [\<number\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date) `Date.now()` の値として使用する初期時間 (ミリ秒単位) を表すオプションの数値または Date オブジェクト。**デフォルト:** `0`。

**注意:** 特定のタイマーのモックを有効にすると、関連するクリア関数も暗黙的にモックされます。

**注意:** `Date` をモックすると、モックされたタイマーは同じ内部クロックを使用するため、それらの動作に影響します。

初期時間を設定しない使用例:

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['setInterval'] });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['setInterval'] });
```
:::

上記の例では、`setInterval` タイマーのモックを有効にし、`clearInterval` 関数を暗黙的にモックします。[node:timers](/ja/nodejs/api/timers)、[node:timers/promises](/ja/nodejs/api/timers#timers-promises-api)、および `globalThis` の `setInterval` 関数と `clearInterval` 関数のみがモックされます。

初期時間を設定した使用例:

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: 1000 });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: 1000 });
```
:::

初期 Date オブジェクトを時間として設定した使用例:

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: new Date() });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: new Date() });
```
:::

または、パラメータなしで `mock.timers.enable()` を呼び出すと:

すべてのタイマー (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, および `'clearImmediate'`) がモックされます。`node:timers`、`node:timers/promises`、および `globalThis` の `setInterval`、`clearInterval`、`setTimeout`、`clearTimeout`、`setImmediate`、および `clearImmediate` 関数がモックされます。グローバルな `Date` オブジェクトも同様です。


### `timers.reset()` {#timersreset}

**Added in: v20.4.0, v18.19.0**

この関数は、以前にこの `MockTimers` インスタンスによって作成されたすべてのモックのデフォルトの動作を復元し、モックを `MockTracker` インスタンスから切り離します。

**注:** 各テストが完了すると、この関数はテストコンテキストの `MockTracker` で呼び出されます。

::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.reset();
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.reset();
```
:::

### `timers[Symbol.dispose]()` {#timerssymboldispose}

`timers.reset()` を呼び出します。

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**Added in: v20.4.0, v18.19.0**

モックされたすべてのタイマーの時間を進めます。

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) タイマーを進める時間 (ミリ秒単位)。**Default:** `1`.

**注:** これは、Node.js の `setTimeout` の動作とは異なり、正の数のみを受け入れます。Node.js では、負の数を持つ `setTimeout` は、Web の互換性のためにのみサポートされています。

次の例では、`setTimeout` 関数をモックし、`.tick` を使用して時間を進め、保留中のすべてのタイマーをトリガーします。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

または、`.tick` 関数を何度も呼び出すことができます。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

`.tick` を使用して時間を進めると、モックが有効になった後に作成された `Date` オブジェクトの時間も進みます ( `Date` もモックされるように設定されている場合)。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::


#### 明示的な関数を使用する {#using-clear-functions}

前述のように、タイマーからのすべてのclear関数（`clearTimeout`、`clearInterval`、および`clearImmediate`）は暗黙的にモックされます。`setTimeout`を使用した次の例を見てください。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### Node.jsタイマーモジュールを使用する {#working-with-nodejs-timers-modules}

タイマーのモックを有効にすると、[node:timers](/ja/nodejs/api/timers)、[node:timers/promises](/ja/nodejs/api/timers#timers-promises-api)モジュール、およびNode.jsグローバルコンテキストからのタイマーが有効になります。

**注意：** `import { setTimeout } from 'node:timers'`のような関数の分割代入は、現在のところこのAPIではサポートされていません。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimers = require('node:timers');
const nodeTimersPromises = require('node:timers/promises');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

Node.jsでは、[node:timers/promises](/ja/nodejs/api/timers#timers-promises-api)からの`setInterval`は`AsyncGenerator`であり、このAPIでもサポートされています。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimersPromises = require('node:timers/promises');
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```
:::


### `timers.runAll()` {#timersrunall}

**Added in: v20.4.0, v18.19.0**

保留中のすべてのモックされたタイマーを即座にトリガーします。`Date`オブジェクトもモックされている場合、`Date`オブジェクトも最も遠いタイマーの時間まで進みます。

以下の例では、保留中のすべてのタイマーを即座にトリガーし、遅延なしで実行させます。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```
:::

**Note:** `runAll()`関数は、タイマーのモックのコンテキストでタイマーをトリガーするために特別に設計されています。モック環境外のリアルタイムのシステムクロックまたは実際のタイマーには影響しません。

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**Added in: v21.2.0, v20.11.0**

モックされた`Date`オブジェクトの参照として使用される現在のUnixタイムスタンプを設定します。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime replaces current time', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```
:::


#### 日付とタイマーの連携 {#dates-and-timers-working-together}

日付とタイマーのオブジェクトは相互に依存しています。`setTime()`を使用して現在時刻をモックされた`Date`オブジェクトに渡しても、`setTimeout`および`setInterval`で設定されたタイマーは**影響を受けません**。

ただし、`tick`メソッドはモックされた`Date`オブジェクトを**進めます**。

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('指定された順序でrunAll関数を実行する', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // 日付は進められますが、タイマーは作動しません
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('指定された順序でrunAll関数を実行する', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // 日付は進められますが、タイマーは作動しません
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## クラス: `TestsStream` {#class-testsstream}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | テストがスイートの場合、test:passおよびtest:failイベントに型が追加されました。 |
| v18.9.0, v16.19.0 | 追加: v18.9.0, v16.19.0 |
:::

- 拡張元: [\<Readable\>](/ja/nodejs/api/stream#class-streamreadable)

[`run()`](/ja/nodejs/api/test#runoptions)メソッドが正常に呼び出されると、テストの実行を表す一連のイベントをストリーミングする新しい[\<TestsStream\>](/ja/nodejs/api/test#class-testsstream)オブジェクトが返されます。`TestsStream`は、テストの定義順にイベントを発行します。

一部のイベントはテストの定義と同じ順序で発行されることが保証されていますが、他のイベントはテストの実行順に発行されます。


### イベント: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) カバレッジレポートを含むオブジェクト。
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 個々のファイルのカバレッジレポートの配列。各レポートは、次のスキーマを持つオブジェクトです。 
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ファイルの絶対パス。
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 行の総数。
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ブランチの総数。
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関数の総数。
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた行数。
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされたブランチ数。
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた関数数。
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた行の割合。
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされたブランチの割合。
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた関数の割合。
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 関数のカバレッジを表す関数の配列。 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 関数の名前。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関数が定義されている行番号。
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関数が呼び出された回数。
  
 
    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) ブランチのカバレッジを表すブランチの配列。 
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ブランチが定義されている行番号。
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ブランチが実行された回数。
  
 
    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) 行番号と、カバーされた回数を表す行の配列。 
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 行番号。
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 行がカバーされた回数。
  
 
  
 
    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 各カバレッジタイプのカバレッジが存在するかどうかを含むオブジェクト。 
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関数のカバレッジの閾値。
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ブランチのカバレッジの閾値。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 行のカバレッジの閾値。
  
 
    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) すべてのファイルのカバレッジの概要を含むオブジェクト。 
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 行の総数。
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ブランチの総数。
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 関数の総数。
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた行数。
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされたブランチ数。
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた関数数。
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた行の割合。
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされたブランチの割合。
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) カバーされた関数の割合。
  
 
    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) コードカバレッジが開始されたときのワーキングディレクトリ。これは、テストがNode.jsプロセスのワーキングディレクトリを変更した場合に、相対パス名を表示するのに役立ちます。
  
 
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネスティングレベル。
  
 

コードカバレッジが有効になっており、すべてのテストが完了したときに発行されます。


### イベント: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている列番号。テストが REPL を介して実行された場合は `undefined`。
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 追加の実行メタデータ。
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) テストが成功したかどうか。
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストの実行時間（ミリ秒単位）。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが成功しなかった場合に、テストによってスローされたエラーをラップするエラー。
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) テストによってスローされた実際のエラー。
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストのタイプ。これがスイートであるかどうかを示すために使用されます。
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストファイルのパス。テストが REPL を介して実行された場合は `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている行番号。テストが REPL を介して実行された場合は `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テスト名。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネストレベル。
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストの序数。
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.todo`](/ja/nodejs/api/test#contexttodomessage) が呼び出された場合に存在します。
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.skip`](/ja/nodejs/api/test#contextskipmessage) が呼び出された場合に存在します。
  
 

テストの実行が完了したときに発行されます。 このイベントは、テストが定義された順序と同じ順序では発行されません。 対応する宣言順イベントは `'test:pass'` および `'test:fail'` です。


### イベント: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている列番号。テストがREPL経由で実行された場合は`undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストファイルのパス。テストがREPL経由で実行された場合は`undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている行番号。テストがREPL経由で実行された場合は`undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テスト名。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネスティングレベル。
  
 

テストがデキューされたとき、実行される直前に発生します。このイベントは、テストが定義されたのと同じ順序で発生することは保証されていません。対応する宣言順のイベントは`'test:start'`です。

### イベント: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている列番号。テストがREPL経由で実行された場合は`undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストファイルのパス。テストがREPL経由で実行された場合は`undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている行番号。テストがREPL経由で実行された場合は`undefined`。
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 診断メッセージ。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネスティングレベル。
  
 

[`context.diagnostic`](/ja/nodejs/api/test#contextdiagnosticmessage)が呼び出されたときに発生します。このイベントは、テストが定義されたのと同じ順序で発生することが保証されています。


### Event: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている列番号。REPLを通してテストが実行された場合は`undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストファイルのパス。テストがREPLを通して実行された場合は`undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている行番号。テストがREPLを通して実行された場合は`undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テスト名。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネストレベル。
  
 

テストが実行待ちに入ったときに発生します。

### Event: `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている列番号。REPLを通してテストが実行された場合は`undefined`。
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 追加の実行メタデータ。 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストの実行時間（ミリ秒）。
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) テストによってスローされたエラーをラップするエラー。
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) テストによってスローされた実際のエラー。
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストのタイプ。これがスイートであるかどうかを示すために使用されます。
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストファイルのパス。テストがREPLを通して実行された場合は`undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている行番号。テストがREPLを通して実行された場合は`undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テスト名。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネストレベル。
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストの序数。
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.todo`](/ja/nodejs/api/test#contexttodomessage) が呼び出された場合に存在します。
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.skip`](/ja/nodejs/api/test#contextskipmessage) が呼び出された場合に存在します。
  
 

テストが失敗したときに発生します。このイベントは、テストが定義された順序と同じ順序で発生することが保証されています。対応する実行順序イベントは `'test:complete'` です。


### イベント: `'test:pass'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている列番号。REPL でテストが実行された場合は `undefined`。
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 追加の実行メタデータ。
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストの実行時間（ミリ秒）。
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストの型。これがスイートかどうかを示すために使用されます。
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストファイルのパス。REPL でテストが実行された場合は `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている行番号。REPL でテストが実行された場合は `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テスト名。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネストレベル。
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストの序数。
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.todo`](/ja/nodejs/api/test#contexttodomessage) が呼び出された場合に存在します。
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`context.skip`](/ja/nodejs/api/test#contextskipmessage) が呼び出された場合に存在します。
  
 

テストがパスしたときに発生します。このイベントは、テストが定義されたのと同じ順序で発生することが保証されています。対応する実行順序イベントは `'test:complete'` です。


### イベント: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている列番号。REPL経由でテストが実行された場合は `undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストファイルのパス。REPL経由でテストが実行された場合は `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている行番号。REPL経由でテストが実行された場合は `undefined`。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネスティングレベル。
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行されたサブテストの数。

与えられたテストのすべてのサブテストが完了したときに発生します。このイベントは、テストが定義されたのと同じ順序で発生することが保証されています。

### イベント: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている列番号。REPL経由でテストが実行された場合は `undefined`。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストファイルのパス。REPL経由でテストが実行された場合は `undefined`。
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) テストが定義されている行番号。REPL経由でテストが実行された場合は `undefined`。
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テスト名。
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストのネスティングレベル。

テストが自身とサブテストのステータスの報告を開始するときに発生します。このイベントは、テストが定義されたのと同じ順序で発生することが保証されています。対応する実行順序のイベントは `'test:dequeue'` です。


### Event: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テストファイルのパス。
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `stderr` に書き込まれたメッセージ。

実行中のテストが `stderr` に書き込むときに発生します。このイベントは、`--test` フラグが渡された場合にのみ発生します。このイベントは、テストが定義された順序で発生するとは限りません。

### Event: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) テストファイルのパス。
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `stdout` に書き込まれたメッセージ。

実行中のテストが `stdout` に書き込むときに発生します。このイベントは、`--test` フラグが渡された場合にのみ発生します。このイベントは、テストが定義された順序で発生するとは限りません。

### Event: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) さまざまなテスト結果のカウントを含むオブジェクト。
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) キャンセルされたテストの総数。
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 失敗したテストの総数。
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 合格したテストの総数。
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スキップされたテストの総数。
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行されたスイートの総数。
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) スイートを除く、実行されたテストの総数。
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) TODO テストの総数。
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) トップレベルのテストとスイートの総数。

    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストの実行時間 (ミリ秒単位)。
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) サマリーを生成したテストファイルのパス。サマリーが複数のファイルに対応する場合、この値は `undefined` です。
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) テストの実行が成功したと見なされるかどうかを示します。テストの失敗やカバレッジ閾値の未達成など、何らかのエラーが発生した場合、この値は `false` に設定されます。

テストの実行が完了したときに発生します。このイベントには、完了したテストの実行に関するメトリクスが含まれており、テストの実行が成功したか失敗したかを判断するのに役立ちます。プロセスレベルのテスト分離が使用されている場合、最終的な累積サマリーに加えて、`'test:summary'` イベントが各テストファイルに対して生成されます。


### イベント: `'test:watch:drained'` {#event-testwatchdrained}

ウォッチモードで実行待ちのテストがなくなったときに発生します。

## クラス: `TestContext` {#class-testcontext}

::: info [履歴]
| バージョン | 変更点 |
| --- | --- |
| v20.1.0, v18.17.0 | `before` 関数が TestContext に追加されました。 |
| v18.0.0, v16.17.0 | 追加: v18.0.0, v16.17.0 |
:::

`TestContext` のインスタンスは、テストランナーと対話するために、各テスト関数に渡されます。ただし、`TestContext` コンストラクターは API の一部として公開されていません。

### `context.before([fn][, options])` {#contextbeforefn-options}

**追加: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) フック関数。この関数の最初の引数は [`TestContext`](/ja/nodejs/api/test#class-testcontext) オブジェクトです。フックがコールバックを使用する場合、コールバック関数が2番目の引数として渡されます。 **デフォルト:** 何もしない関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) フックの構成オプション。次のプロパティがサポートされています。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のフックの中止を許可します。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フックが失敗するまでのミリ秒数。指定しない場合、サブテストはこの値を親から継承します。 **デフォルト:** `Infinity`。

この関数は、現在のテストのサブテストの前に実行されるフックを作成するために使用されます。

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**追加: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) フック関数。この関数の最初の引数は [`TestContext`](/ja/nodejs/api/test#class-testcontext) オブジェクトです。フックがコールバックを使用する場合、コールバック関数が2番目の引数として渡されます。 **デフォルト:** 何もしない関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) フックの構成オプション。次のプロパティがサポートされています。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のフックの中止を許可します。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フックが失敗するまでのミリ秒数。指定しない場合、サブテストはこの値を親から継承します。 **デフォルト:** `Infinity`。

この関数は、現在のテストの各サブテストの前に実行されるフックを作成するために使用されます。

```js [ESM]
test('トップレベルのテスト', async (t) => {
  t.beforeEach((t) => t.diagnostic(`${t.name}を実行しようとしています`));
  await t.test(
    'これはサブテストです',
    (t) => {
      assert.ok('ここに関連するアサーションがあります');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**Added in: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) フック関数。この関数の最初の引数は、[`TestContext`](/ja/nodejs/api/test#class-testcontext) オブジェクトです。フックがコールバックを使用する場合、コールバック関数が2番目の引数として渡されます。**Default:** 何もしない関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) フックの構成オプション。以下のプロパティがサポートされています:
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のフックを中断できます。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フックが失敗するまでのミリ秒数。指定しない場合、サブテストはこの値を親から継承します。**Default:** `Infinity`。

この関数は、現在のテストが終了した後に実行されるフックを作成するために使用されます。

```js [ESM]
test('top level test', async (t) => {
  t.after((t) => t.diagnostic(`finished running ${t.name}`));
  assert.ok('some relevant assertion here');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) フック関数。この関数の最初の引数は、[`TestContext`](/ja/nodejs/api/test#class-testcontext) オブジェクトです。フックがコールバックを使用する場合、コールバック関数が2番目の引数として渡されます。**Default:** 何もしない関数。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) フックの構成オプション。以下のプロパティがサポートされています:
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のフックを中断できます。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) フックが失敗するまでのミリ秒数。指定しない場合、サブテストはこの値を親から継承します。**Default:** `Infinity`。

この関数は、現在のテストの各サブテストの後に実行されるフックを作成するために使用されます。

```js [ESM]
test('top level test', async (t) => {
  t.afterEach((t) => t.diagnostic(`finished running ${t.name}`));
  await t.test(
    'This is a subtest',
    (t) => {
      assert.ok('some relevant assertion here');
    },
  );
});
```

### `context.assert` {#contextassert}

**追加:** v22.2.0, v20.15.0

`context` にバインドされたアサーションメソッドを含むオブジェクト。テスト計画を作成する目的のために、`node:assert` モジュールのトップレベル関数がここに公開されます。

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**追加:** v22.3.0

::: warning [安定版: 1 - 試験的]
[安定版: 1](/ja/nodejs/api/documentation#stability-index) [安定性: 1](/ja/nodejs/api/documentation#stability-index).0 - 早期開発
:::

- `value` [\<any\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Data_types) 文字列にシリアライズされる値。 Node.js が [`--test-update-snapshots`](/ja/nodejs/api/cli#--test-update-snapshots) フラグを指定して起動された場合、シリアライズされた値はスナップショットファイルに書き込まれます。 それ以外の場合、シリアライズされた値は既存のスナップショットファイル内の対応する値と比較されます。
- `options` [\<Object\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object) オプションの設定オプション。 次のプロパティがサポートされています:
    - `serializers` [\<Array\>](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array) `value` を文字列にシリアライズするために使用される同期関数の配列。 `value` は最初のシリアライザー関数への唯一の引数として渡されます。 各シリアライザーの戻り値は、次のシリアライザーへの入力として渡されます。 すべてのシリアライザーが実行されると、結果の値は文字列に強制されます。 **デフォルト:** シリアライザーが提供されていない場合、テストランナーのデフォルトのシリアライザーが使用されます。

この関数は、スナップショットテストのアサーションを実装します。

```js [ESM]
test('snapshot test with default serialization', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('snapshot test with custom serialization', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**追加: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) レポートされるメッセージ。

この関数は、診断を出力に書き込むために使用されます。診断情報は、テスト結果の最後に含まれます。この関数は値を返しません。

```js [ESM]
test('トップレベルのテスト', (t) => {
  t.diagnostic('診断メッセージ');
});
```
### `context.filePath` {#contextfilepath}

**追加: v22.6.0, v20.16.0**

現在のテストを作成したテストファイルの絶対パス。テストファイルがテストを生成する追加のモジュールをインポートする場合、インポートされたテストはルートテストファイルのパスを返します。

### `context.fullName` {#contextfullname}

**追加: v22.3.0**

テストの名前と、その祖先の名前を `\>` で区切ったもの。

### `context.name` {#contextname}

**追加: v18.8.0, v16.18.0**

テストの名前。

### `context.plan(count)` {#contextplancount}

::: info [履歴]
| バージョン | 変更 |
| --- | --- |
| v23.4.0 | この関数は実験的ではなくなりました。 |
| v22.2.0, v20.15.0 | 追加: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 実行されると予想されるアサーションおよびサブテストの数。

この関数は、テスト内で実行されると予想されるアサーションおよびサブテストの数を設定するために使用されます。実行されるアサーションおよびサブテストの数が予想される数と一致しない場合、テストは失敗します。

```js [ESM]
test('トップレベルのテスト', (t) => {
  t.plan(2);
  t.assert.ok('ここに関連するアサーション');
  t.test('サブテスト', () => {});
});
```
非同期コードを扱う場合、`plan` 関数を使用して、正しい数のアサーションが実行されることを確認できます。

```js [ESM]
test('ストリームを使用したプランニング', (t, done) => {
  function* generate() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  const expected = ['a', 'b', 'c'];
  t.plan(expected.length);
  const stream = Readable.from(generate());
  stream.on('data', (chunk) => {
    t.assert.strictEqual(chunk, expected.shift());
  });

  stream.on('end', () => {
    done();
  });
});
```

### `context.runOnly(shouldRunOnlyTests)` {#contextrunonlyshouldrunonlytests}

**追加:** v18.0.0, v16.17.0

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `only`テストを実行するかどうか。

`shouldRunOnlyTests` が真の場合、テストコンテキストは `only` オプションが設定されたテストのみを実行します。それ以外の場合、すべてのテストが実行されます。Node.js が [`--test-only`](/ja/nodejs/api/cli#--test-only) コマンドラインオプションで起動されなかった場合、この関数は no-op です。

```js [ESM]
test('トップレベルテスト', (t) => {
  // テストコンテキストは、'only' オプションでサブテストを実行するように設定できます。
  t.runOnly(true);
  return Promise.all([
    t.test('このサブテストはスキップされます'),
    t.test('このサブテストは実行されます', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**追加:** v18.7.0, v16.17.0

- タイプ: [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)

テストが中止されたときにテストサブタスクを中止するために使用できます。

```js [ESM]
test('トップレベルテスト', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**追加:** v18.0.0, v16.17.0

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 省略可能なスキップメッセージ。

この関数は、テストの出力をスキップとして示すようにします。`message` が指定されている場合、それは出力に含まれます。`skip()` を呼び出しても、テスト関数の実行は終了しません。この関数は値を返しません。

```js [ESM]
test('トップレベルテスト', (t) => {
  // テストに追加のロジックが含まれている場合は、ここでも必ず戻るようにしてください。
  t.skip('これはスキップされます');
});
```
### `context.todo([message])` {#contexttodomessage}

**追加:** v18.0.0, v16.17.0

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 省略可能な `TODO` メッセージ。

この関数は、テストの出力に `TODO` ディレクティブを追加します。`message` が指定されている場合、それは出力に含まれます。`todo()` を呼び出しても、テスト関数の実行は終了しません。この関数は値を返しません。

```js [ESM]
test('トップレベルテスト', (t) => {
  // このテストは `TODO` としてマークされています
  t.todo('これはTODOです');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [履歴]
| バージョン | 変更点 |
|---|---|
| v18.8.0, v16.18.0 | `signal` オプションを追加。 |
| v18.7.0, v16.17.0 | `timeout` オプションを追加。 |
| v18.0.0, v16.17.0 | 追加: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) サブテストの名前。テスト結果の報告時に表示されます。**デフォルト:** `fn` の `name` プロパティ。`fn` が名前を持たない場合は `'\<anonymous\>'`。
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) サブテストの設定オプション。以下のプロパティがサポートされています。
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 数値が指定された場合、その数のテストがアプリケーションスレッド内で並行して実行されます。`true` の場合、すべてのサブテストが並行して実行されます。`false` の場合、一度に 1 つのテストのみが実行されます。指定されていない場合、サブテストはこの値を親から継承します。**デフォルト:** `null`。
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 真偽値で、テストコンテキストが `only` テストを実行するように設定されている場合、このテストが実行されます。それ以外の場合、テストはスキップされます。**デフォルト:** `false`。
    - `signal` [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal) 進行中のテストを中止できます。
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 真偽値の場合、テストはスキップされます。文字列が指定された場合、その文字列はテスト結果にテストがスキップされた理由として表示されます。**デフォルト:** `false`。
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 真偽値の場合、テストは `TODO` としてマークされます。文字列が指定された場合、その文字列はテスト結果にテストが `TODO` である理由として表示されます。**デフォルト:** `false`。
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストが失敗するまでのミリ秒数。指定されていない場合、サブテストはこの値を親から継承します。**デフォルト:** `Infinity`。
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) テストで実行されることが期待されるアサーションとサブテストの数。テストで実行されるアサーションの数が、プランで指定された数と一致しない場合、テストは失敗します。**デフォルト:** `undefined`。

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) テスト対象の関数。この関数の最初の引数は [`TestContext`](/ja/nodejs/api/test#class-testcontext) オブジェクトです。テストがコールバックを使用する場合、コールバック関数は 2 番目の引数として渡されます。**デフォルト:** 何もしない関数。
- 戻り値: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) テストが完了すると `undefined` で fulfill されます。

この関数は、現在のテストの下にサブテストを作成するために使用されます。この関数は、トップレベルの [`test()`](/ja/nodejs/api/test#testname-options-fn) 関数と同じように動作します。

```js [ESM]
test('top level test', async (t) => {
  await t.test(
    'This is a subtest',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('some relevant assertion here');
    },
  );
});
```

## クラス: `SuiteContext` {#class-suitecontext}

**追加:** v18.7.0, v16.17.0

`SuiteContext` のインスタンスは、テストランナーとやり取りするために各スイート関数に渡されます。ただし、`SuiteContext` コンストラクターは API の一部として公開されていません。

### `context.filePath` {#contextfilepath_1}

**追加:** v22.6.0

現在のスイートを作成したテストファイルの絶対パス。テストファイルがスイートを生成する追加のモジュールをインポートする場合、インポートされたスイートはルートテストファイルのパスを返します。

### `context.name` {#contextname_1}

**追加:** v18.8.0, v16.18.0

スイートの名前。

### `context.signal` {#contextsignal_1}

**追加:** v18.7.0, v16.17.0

- 型: [\<AbortSignal\>](/ja/nodejs/api/globals#class-abortsignal)

テストが中止されたときに、テストサブタスクを中止するために使用できます。

