---
title: Node.js のテストランナーを使用する
description: Node.js の組み込みテストランナーを設定および使用する方法についてのガイド、一般設定、サービスワーカーテスト、スナップショットテスト、ユニットテスト、ユーザーインターフェイステストなどを含む。
head:
  - - meta
    - name: og:title
      content: Node.js のテストランナーを使用する | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js の組み込みテストランナーを設定および使用する方法についてのガイド、一般設定、サービスワーカーテスト、スナップショットテスト、ユニットテスト、ユーザーインターフェイステストなどを含む。
  - - meta
    - name: twitter:title
      content: Node.js のテストランナーを使用する | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js の組み込みテストランナーを設定および使用する方法についてのガイド、一般設定、サービスワーカーテスト、スナップショットテスト、ユニットテスト、ユーザーインターフェイステストなどを含む。
---


# Node.js のテストランナーの使用

Node.js には、柔軟で堅牢な組み込みテストランナーがあります。このガイドでは、その設定方法と使用方法を説明します。

::: code-group
```bash [アーキテクチャ概要]
example/
  ├ …
  ├ src/
    ├ app/…
    └ sw/…
  └ test/
    ├ globals/
      ├ …
      ├ IndexedDb.js
      └ ServiceWorkerGlobalScope.js
    ├ setup.mjs
    ├ setup.units.mjs
    └ setup.ui.mjs
```
```bash [依存関係のインストール]
npm init -y
npm install --save-dev concurrently
```
```json [package.json]
{
  "name": "example",
  "scripts": {
    "test": "concurrently --kill-others-on-fail --prefix none npm:test:*",
    "test:sw": "node --import ./test/setup.sw.mjs --test './src/sw/**/*.spec.*'",
    "test:units": "node --import ./test/setup.units.mjs --test './src/app/**/*.spec.*'",
    "test:ui": "node --import ./test/setup.ui.mjs --test './src/app/**/*.test.*'"
  }
}
```
:::

::: info NOTE
グロブには node v21 以降が必要です。また、グロブ自体を引用符で囲む必要があります（囲まないと、期待される動作とは異なる動作になります。最初は動作しているように見えるかもしれませんが、実際には動作していません）。
:::

常に必要なものがいくつかあるので、次のような基本設定ファイルにそれらを入れてください。このファイルは、他の、よりオーダーメイドの設定によってインポートされます。

## 一般的な設定

```js
import { register } from 'node:module';
register('some-typescript-loader');
// TypeScript は以降サポートされます
// ただし、他の test/setup.*.mjs ファイルはプレーンな JavaScript である必要があります！
```

次に、各設定に対して、専用の `setup` ファイルを作成します（各ファイル内でベース `setup.mjs` ファイルがインポートされていることを確認してください）。設定を分離する理由はいくつかありますが、最も明白な理由は[YAGNI](https://ja.wikipedia.org/wiki/YAGNI) + パフォーマンスです。設定するものの多くは環境固有のモック/スタブであり、非常にコストがかかり、テストの実行を遅くする可能性があります。必要ない場合は、これらのコスト（CI に支払う文字通りのお金、テストの完了を待つ時間など）を回避する必要があります。

以下の各例は、実際のプロジェクトから取得されたものです。あなたのプロジェクトに適切/適用可能ではないかもしれませんが、それぞれが広く適用可能な一般的な概念を示しています。


## ServiceWorker テスト

`ServiceWorkerGlobalScope` は、他の環境には存在しない非常に特殊な API を含んでおり、その API の一部は他の API (例: `fetch`) と一見似ていますが、拡張された動作をします。これらの API が無関係なテストに漏れ出ることは避けたいでしょう。

```js
import { beforeEach } from 'node:test';

import { ServiceWorkerGlobalScope } from './globals/ServiceWorkerGlobalScope.js';

import './setup.mjs'; // 💡

beforeEach(globalSWBeforeEach);
function globalSWBeforeEach() {
  globalThis.self = new ServiceWorkerGlobalScope();
}
```
```js
import assert from 'node:assert/strict';
import { describe, mock, it } from 'node:test';

import { onActivate } from './onActivate.js';

describe('ServiceWorker::onActivate()', () => {
  const globalSelf = globalThis.self;
  const claim = mock.fn(async function mock__claim() {});
  const matchAll = mock.fn(async function mock__matchAll() {});

  class ActivateEvent extends Event {
    constructor(...args) {
      super('activate', ...args);
    }
  }

  before(() => {
    globalThis.self = {
      clients: { claim, matchAll },
    };
  });
  after(() => {
    global.self = globalSelf;
  });

  it('should claim all clients', async () => {
    await onActivate(new ActivateEvent());

    assert.equal(claim.mock.callCount(), 1);
    assert.equal(matchAll.mock.callCount(), 1);
  });
});
```

## スナップショットテスト

これらは Jest によって普及しました。現在、多くのライブラリがそのような機能を実装しており、Node.js も v22.3.0 以降同様です。コンポーネントのレンダリング出力の検証や、[Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) の設定など、いくつかのユースケースがあります。概念はユースケースに関係なく同じです。

`--experimental-test-snapshots` を介して機能を有効にすることを除いて、特定の構成は必要ありません。ただし、オプションの構成を示すには、既存のテスト構成ファイルのいずれかに次のようなものを追加するでしょう。

デフォルトでは、node は構文ハイライトの検出と互換性のないファイル名 `.js.snapshot` を生成します。生成されたファイルは実際には CJS ファイルであるため、より適切なファイル名は `.snapshot.cjs` (またはより簡潔に下の例のように `.snap.cjs`) で終わります。これにより、ESM プロジェクトでもより適切に処理されます。

```js
import { basename, dirname, extname, join } from 'node:path';
import { snapshot } from 'node:test';

snapshot.setResolveSnapshotPath(generateSnapshotPath);
/**
 * @param {string} testFilePath '/tmp/foo.test.js'
 * @returns {string} '/tmp/foo.test.snap.cjs'
 */
function generateSnapshotPath(testFilePath) {
  const ext = extname(testFilePath);
  const filename = basename(testFilePath, ext);
  const base = dirname(testFilePath);

  return join(base, `${filename}.snap.cjs`);
}
```

以下の例は、UI コンポーネントの [testing library](https://testing-library.com/) を使用したスナップショットテストを示しています ( `assert.snapshot` への 2 つの異なるアクセス方法に注意してください)。

```js
import { describe, it } from 'node:test';

import { prettyDOM } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

import { SomeComponent } from './SomeComponent.jsx';


describe('<SomeComponent>', () => {
  // For people preferring "fat-arrow" syntax, the following is probably better for consistency
  it('should render defaults when no props are provided', (t) => {
    const component = render(<SomeComponent />).container.firstChild;

    t.assert.snapshot(prettyDOM(component));
  });

  it('should consume `foo` when provided', function() {
    const component = render(<SomeComponent foo="bar" />).container.firstChild;

    this.assert.snapshot(prettyDOM(component));
    // `this` works only when `function` is used (not "fat arrow").
  });
});
```

::: warning
`assert.snapshot` は `node:assert` ではなく、テストのコンテキスト (t または this) から取得されます。これは、テストコンテキストが `node:assert` では不可能なスコープにアクセスできるために必要です ( `snapshot (this, value)` のように `assert.snapshot` が使用されるたびに手動で提供する必要があります。これはかなり面倒です)。
:::


## ユニットテスト

ユニットテストは最もシンプルなテストであり、通常は特別なものを必要としません。テストの大部分はおそらくユニットテストになるでしょうから、このセットアップを最小限に抑えることが重要です。なぜなら、セットアップのパフォーマンスがわずかに低下するだけでも、それが拡大して連鎖するからです。

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// plain-text files like graphql can now be imported:
// import GET_ME from 'get-me.gql'; GET_ME = '
```

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Cat } from './Cat.js';
import { Fish } from './Fish.js';
import { Plastic } from './Plastic.js';

describe('Cat', () => {
  it('should eat fish', () => {
    const cat = new Cat();
    const fish = new Fish();

    assert.doesNotThrow(() => cat.eat(fish));
  });

  it('should NOT eat plastic', () => {
    const cat = new Cat();
    const plastic = new Plastic();

    assert.throws(() => cat.eat(plastic));
  });
});
```

## ユーザーインターフェイステスト

UIテストは一般的にDOMを必要とし、場合によっては他のブラウザ固有のAPI（下記で使用されている`IndexedDb`など）も必要とします。これらは非常に複雑で、セットアップにコストがかかる傾向があります。

`IndexedDb`のようなAPIを使用しているが、それが非常に隔離されている場合、以下のようなグローバルモックは適切な方法ではないかもしれません。代わりに、この`beforeEach`を`IndexedDb`にアクセスする特定のテストに移動することを検討してください。`IndexedDb`（またはその他）にアクセスするモジュール自体が広くアクセスされている場合は、そのモジュールをモックするか（おそらくより良い選択肢）、ここに保持してください。

```js
import { register } from 'node:module';

// ⚠️ JSDomのインスタンスは1つだけ生成するようにしてください。複数生成すると多くの🤬につながります。
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ これを指定しないと、多くの🤬につながる可能性があります。
});

// グローバルを装飾する方法の例。
// JSDOMの`history`はナビゲーションを処理しません。以下はほとんどの場合を処理します。
const pushState = globalThis.history.pushState.bind(globalThis.history);
globalThis.history.pushState = function mock_pushState(data, unused, url) {
  pushState(data, unused, url);
  globalThis.location.assign(url);
};

beforeEach(globalUIBeforeEach);
function globalUIBeforeEach() {
  globalThis.indexedDb = new IndexedDb();
}
```

UIテストには2つの異なるレベルがあります。ユニットライクなもの（外部および依存関係がモックされる）と、よりエンドツーエンドなもの（IndexedDbのような外部のみがモックされ、残りのチェーンは本物）。前者は一般的に純粋なオプションであり、後者は通常、[Playwright](https://playwright.dev/)や[Puppeteer](https://pptr.dev/)のようなもので完全にエンドツーエンドの自動化されたユーザビリティテストに委ねられます。以下は前者の例です。

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

// ⚠️ SomeOtherComponentは静的なインポートではないことに注意してください。
// これは、独自のインポートをモックしやすくするために必要なことです。


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ 順序が重要です。モックはそのコンシューマーがインポートされる前に設定する必要があります。

    // `--experimental-test-module-mocks`を設定する必要があります。
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // これは、スナップショットで処理したくないでしょう。なぜなら、それは脆いからです。
    // エラーメッセージに重要でない更新が行われた場合、
    // スナップショットテストは誤って失敗します
    // （そして、スナップショットは実際には価値がないのに更新する必要があります）。

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
