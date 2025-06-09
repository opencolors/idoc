---
title: 使用 Node.js 的测试运行器
description: 有关设置和使用 Node.js 内置测试运行器的指南，包括通用设置、服务工作者测试、快照测试、单元测试和用户界面测试。
head:
  - - meta
    - name: og:title
      content: 使用 Node.js 的测试运行器 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 有关设置和使用 Node.js 内置测试运行器的指南，包括通用设置、服务工作者测试、快照测试、单元测试和用户界面测试。
  - - meta
    - name: twitter:title
      content: 使用 Node.js 的测试运行器 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 有关设置和使用 Node.js 内置测试运行器的指南，包括通用设置、服务工作者测试、快照测试、单元测试和用户界面测试。
---


# 使用 Node.js 的测试运行器

Node.js 有一个灵活而强大的内置测试运行器。本指南将向您展示如何设置和使用它。

::: code-group
```bash [架构概览]
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
```bash [安装依赖]
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
glob 需要 node v21+，并且 glob 本身必须用引号括起来（否则，您会得到与预期不同的行为，其中可能首先看起来是有效的，但实际上并非如此）。
:::

有些事情是您始终需要的，所以将它们放在一个基础设置文件中，如下所示。该文件将被其他更定制的设置导入。

## 常规设置

```js
import { register } from 'node:module';
register('some-typescript-loader');
// 此后支持 TypeScript
// 但是其他 test/setup.*.mjs 文件仍然必须是纯 JavaScript！
```

然后对于每个设置，创建一个专用的 `setup` 文件（确保在每个文件中都导入基础的 `setup.mjs` 文件）。隔离设置有很多原因，但最明显的原因是 [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) + 性能：您可能设置的许多内容都是特定于环境的模拟/桩，这些模拟/桩可能非常昂贵并且会减慢测试运行速度。您希望在不需要时避免这些成本（您支付给 CI 的实际费用、等待测试完成的时间等）。

下面的每个示例都取自真实的项目；它们可能不适合/适用于您的项目，但每个示例都演示了广泛适用的通用概念。


## ServiceWorker 测试

`ServiceWorkerGlobalScope` 包含其他环境中不存在的非常特定的 API，并且它的一些 API 表面上与其他 API（例如 `fetch`）相似，但具有增强的行为。您不希望这些溢出到不相关的测试中。

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

## 快照测试

这些测试由 Jest 推广；现在，许多库都实现了这样的功能，包括 Node.js 从 v22.3.0 开始。 有几种用例，例如验证组件渲染输出和[基础设施即代码](https://en.wikipedia.org/wiki/Infrastructure_as_code)配置。 无论用例如何，概念都是相同的。

除了通过 `--experimental-test-snapshots` 启用该功能外，不需要任何特定的配置。 但是为了演示可选配置，您可能会将类似以下内容添加到您现有的测试配置文件之一中。

默认情况下，node 生成的文件名与语法突出显示检测不兼容：`.js.snapshot`。 生成的文件实际上是一个 CJS 文件，因此更合适的文件名将以 `.snapshot.cjs` 结尾（或更简洁地以 `.snap.cjs` 结尾，如下所示）； 这也将在 ESM 项目中更好地处理。

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

下面的示例演示了使用 [testing library](https://testing-library.com/) 进行 UI 组件的快照测试； 请注意访问 `assert.snapshot` 的两种不同方式）：

```js
import { describe, it } from 'node:test';

import { prettyDOM } from '@testing-library/dom';
import { render } from '@testing-library/react'; // 任何框架（例如 svelte）

import { SomeComponent } from './SomeComponent.jsx';


describe('<SomeComponent>', () => {
  // 对于喜欢“箭头函数”语法的人来说，以下内容可能更适合保持一致性
  it('should render defaults when no props are provided', (t) => {
    const component = render(<SomeComponent />).container.firstChild;

    t.assert.snapshot(prettyDOM(component));
  });

  it('should consume `foo` when provided', function() {
    const component = render(<SomeComponent foo="bar" />).container.firstChild;

    this.assert.snapshot(prettyDOM(component));
    // `this` 仅在使用 `function` 时有效（而不是“箭头函数”）。
  });
});
```

::: warning
`assert.snapshot` 来自测试的上下文（t 或 this），而不是 `node:assert`。 这是必要的，因为测试上下文可以访问 `node:assert` 无法访问的范围（您每次使用 `assert.snapshot` 时都必须手动提供它，例如 `snapshot (this, value)`，这将非常乏味）。
:::


## 单元测试

单元测试是最简单的测试，通常不需要特别的东西。 你的大部分测试很可能是单元测试，因此保持这种设置的最小化非常重要，因为设置性能的微小降低将会放大并级联。

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// 现在可以导入纯文本文件，如 graphql：
// import GET_ME from 'get-me.gql'; GET_ME = '
```

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Cat } from './Cat.js';
import { Fish } from './Fish.js';
import { Plastic } from './Plastic.js';

describe('Cat', () => {
  it('应该吃鱼', () => {
    const cat = new Cat();
    const fish = new Fish();

    assert.doesNotThrow(() => cat.eat(fish));
  });

  it('不应该吃塑料', () => {
    const cat = new Cat();
    const plastic = new Plastic();

    assert.throws(() => cat.eat(plastic));
  });
});
```

## 用户界面测试

UI 测试通常需要一个 DOM，以及可能的其他浏览器特定 API（如下面使用的 `IndexedDb`）。 这些测试的设置往往非常复杂且成本很高。

如果您使用像 `IndexedDb` 这样的 API，但它是非常孤立的，那么像下面这样的全局模拟可能不是最好的选择。 相反，也许将这个 `beforeEach` 移动到将要访问 `IndexedDb` 的特定测试中。 请注意，如果访问 `IndexedDb`（或任何其他东西）的模块本身被广泛访问，则可以模拟该模块（可能是更好的选择），或者将其保留在此处。

```js
import { register } from 'node:module';

// ⚠️ 确保只实例化 1 个 JSDom 实例；多个实例会导致很多 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ 未能指定此项可能会导致很多 🤬
});

// 如何装饰全局变量的示例。
// JSDOM 的 `history` 不处理导航；以下代码处理大多数情况。
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

您可以拥有 2 个不同级别的 UI 测试：类似单元测试（其中外部依赖项被模拟）和更端到端（其中仅外部依赖项（如 IndexedDb）被模拟，而链的其余部分是真实的）。 前者通常是更纯粹的选择，后者通常推迟到通过诸如 [Playwright](https://playwright.dev/) 或 [Puppeteer](https://pptr.dev/) 之类的东西进行的完全端到端的自动化可用性测试。 下面是前者的一个例子。

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // 任何框架 (例如 svelte)

// ⚠️ 请注意，SomeOtherComponent 不是静态导入；
// 这对于促进模拟其自身的导入是必要的。


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ 顺序很重要：必须在导入其消费者之前设置模拟。

    // 需要设置 `--experimental-test-module-mocks`。
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('当 calcSomeValue 失败时', () => {
    // 您不希望使用快照来处理这种情况，因为这会很脆弱：
    // 当对错误消息进行无关紧要的更新时，
    // 快照测试会错误地失败
    // (并且快照需要更新，没有实际价值)。

    it('应该通过显示一个漂亮的错误来优雅地失败', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
