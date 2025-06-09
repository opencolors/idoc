---
title: Node.js 테스트 러너 사용하기
description: Node.js의 내장 테스트 러너를 설정하고 사용하는 방법에 대한 가이드, 일반 설정, 서비스 워커 테스트, 스냅샷 테스트, 단위 테스트, 사용자 인터페이스 테스트 등이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js 테스트 러너 사용하기 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 내장 테스트 러너를 설정하고 사용하는 방법에 대한 가이드, 일반 설정, 서비스 워커 테스트, 스냅샷 테스트, 단위 테스트, 사용자 인터페이스 테스트 등이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js 테스트 러너 사용하기 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 내장 테스트 러너를 설정하고 사용하는 방법에 대한 가이드, 일반 설정, 서비스 워커 테스트, 스냅샷 테스트, 단위 테스트, 사용자 인터페이스 테스트 등이 포함됩니다.
---


# Node.js 테스트 러너 사용하기

Node.js는 유연하고 강력한 내장 테스트 러너를 제공합니다. 이 가이드는 이를 설정하고 사용하는 방법을 보여줍니다.

::: code-group
```bash [아키텍처 개요]
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
```bash [종속성 설치]
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
glob은 node v21+이 필요하며, glob 자체는 따옴표로 묶어야 합니다 (그렇지 않으면 예상과 다른 동작을 수행하며 처음에는 작동하는 것처럼 보이지만 실제로는 그렇지 않을 수 있습니다).
:::

항상 원하는 것들이 있으므로 다음과 같이 기본 설정 파일에 넣으십시오. 이 파일은 다른, 더 맞춤화된 설정에 의해 가져오게 됩니다.

## 일반 설정

```js 
import { register } from 'node:module';
register('some-typescript-loader');
// 이제부터 TypeScript가 지원됩니다.
// 그러나 다른 test/setup.*.mjs 파일은 여전히 일반 JavaScript여야 합니다!
```

그런 다음 각 설정에 대해 전용 `setup` 파일을 만듭니다 (각 파일 내에서 기본 `setup.mjs` 파일이 가져오도록 함). 설정을 격리해야 하는 여러 가지 이유가 있지만 가장 분명한 이유는 [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) + 성능입니다. 설정할 수 있는 많은 부분이 환경별 모의/스텁이며, 이는 상당히 비용이 많이 들고 테스트 실행 속도를 늦출 수 있습니다. 필요하지 않을 때 이러한 비용 (CI에 지불하는 실제 돈, 테스트 완료를 기다리는 시간 등)을 피하고 싶을 것입니다.

아래의 각 예는 실제 프로젝트에서 가져온 것입니다. 귀하의 프로젝트에 적합하지 않을 수 있지만, 각 예는 광범위하게 적용 가능한 일반적인 개념을 보여줍니다.


## ServiceWorker 테스트

`ServiceWorkerGlobalScope`는 다른 환경에는 존재하지 않는 매우 특정한 API를 포함하고 있으며, 일부 API는 다른 API(예: `fetch`)와 유사해 보이지만 향상된 동작을 가지고 있습니다. 이러한 API가 관련 없는 테스트에 유출되는 것을 원하지 않습니다.

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

## 스냅샷 테스트

이러한 테스트는 Jest에 의해 대중화되었으며, 현재 많은 라이브러리가 Node.js v22.3.0부터 이러한 기능을 구현합니다. 컴포넌트 렌더링 출력 및 [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) 구성 확인과 같은 여러 사용 사례가 있습니다. 개념은 사용 사례에 관계없이 동일합니다.

`--experimental-test-snapshots`를 통해 기능을 활성화하는 것 외에는 특정 구성이 필요하지 않습니다. 그러나 선택적 구성을 보여주기 위해 기존 테스트 구성 파일 중 하나에 다음과 같은 내용을 추가할 수 있습니다.

기본적으로 node는 구문 강조 표시 감지와 호환되지 않는 파일 이름(`.js.snapshot`)을 생성합니다. 생성된 파일은 실제로 CJS 파일이므로 더 적절한 파일 이름은 `.snapshot.cjs`로 끝나야 합니다 (또는 아래와 같이 더 간결하게 `.snap.cjs`); 이렇게 하면 ESM 프로젝트에서도 더 잘 처리됩니다.

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

아래 예제는 UI 컴포넌트에 대한 [테스트 라이브러리](https://testing-library.com/)를 사용한 스냅샷 테스트를 보여줍니다. `assert.snapshot`에 액세스하는 두 가지 다른 방법을 참고하십시오.

```js
import { describe, it } from 'node:test';

import { prettyDOM } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

import { SomeComponent } from './SomeComponent.jsx';


describe('<SomeComponent>', () => {
  // "fat-arrow" 구문을 선호하는 사람들에게는 다음이 일관성을 위해 더 좋을 것입니다.
  it('should render defaults when no props are provided', (t) => {
    const component = render(<SomeComponent />).container.firstChild;

    t.assert.snapshot(prettyDOM(component));
  });

  it('should consume `foo` when provided', function() {
    const component = render(<SomeComponent foo="bar" />).container.firstChild;

    this.assert.snapshot(prettyDOM(component));
    // `this`는 `function`이 사용된 경우에만 작동합니다 ("fat arrow" 아님).
  });
});
```

::: warning
`assert.snapshot`은 `node:assert`가 아닌 테스트의 컨텍스트 (t 또는 this)에서 가져옵니다. 이는 테스트 컨텍스트가 `node:assert`에는 불가능한 범위에 액세스할 수 있기 때문에 필요합니다 (`snapshot (this, value)`처럼 `assert.snapshot`이 사용될 때마다 수동으로 제공해야 함). 이는 다소 번거로울 것입니다.
:::


## 유닛 테스트

유닛 테스트는 가장 간단한 테스트이며 일반적으로 특별한 것이 필요하지 않습니다. 테스트의 대부분은 유닛 테스트일 가능성이 높으므로 설정 성능이 약간만 저하되어도 확대되고 연쇄적으로 영향을 미치므로 설정을 최소화하는 것이 중요합니다.

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// graphql과 같은 일반 텍스트 파일을 이제 가져올 수 있습니다.
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

## 사용자 인터페이스 테스트

UI 테스트는 일반적으로 DOM이 필요하며 경우에 따라 다른 브라우저별 API(예: 아래에서 사용되는 `IndexedDb`)가 필요합니다. 이러한 테스트는 설정이 매우 복잡하고 비용이 많이 드는 경향이 있습니다.

`IndexedDb`와 같은 API를 사용하지만 매우 격리된 경우 아래와 같은 전역 모의(mock)는 적합하지 않을 수 있습니다. 대신 이 `beforeEach`를 `IndexedDb`에 액세스할 특정 테스트로 이동하는 것이 좋습니다. `IndexedDb`(또는 다른 것)에 액세스하는 모듈 자체가 널리 액세스되는 경우 해당 모듈을 모의하거나(아마도 더 나은 옵션) 여기에 유지하십시오.

```js
import { register } from 'node:module';

// ⚠️ JSDom의 인스턴스가 1개만 생성되도록 합니다. 여러 개가 생성되면 🤬가 많이 발생합니다.
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ 이 값을 지정하지 않으면 🤬가 많이 발생할 수 있습니다.
});

// 전역을 데코레이션하는 방법의 예입니다.
// JSDOM의 `history`는 탐색을 처리하지 않습니다. 다음은 대부분의 경우를 처리합니다.
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

UI 테스트에는 두 가지 수준이 있습니다. 하나는 유닛과 유사한 수준(외부 및 종속성이 모의됨)이고 다른 하나는 보다 엔드 투 엔드 수준(IndexedDb와 같은 외부만 모의되고 나머지 체인은 실제임)입니다. 전자가 일반적으로 더 순수한 옵션이고 후자는 일반적으로 [Playwright](https://playwright.dev/) 또는 [Puppeteer](https://pptr.dev/)와 같은 것을 통해 완전히 엔드 투 엔드 자동화된 사용성 테스트로 연기됩니다. 다음은 전자의 예입니다.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // 모든 프레임워크(예: svelte)

// ⚠️ SomeOtherComponent는 정적 가져오기가 아닙니다.
// 자체 가져오기를 모의하는 데 필요합니다.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ 시퀀스가 중요합니다. 모의는 소비자를 가져오기 전에 설정해야 합니다.

    // `--experimental-test-module-mocks`를 설정해야 합니다.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // 스냅샷으로 처리하고 싶지 않을 것입니다. 스냅샷은 깨지기 쉽기 때문입니다.
    // 중요하지 않은 업데이트가 오류 메시지에 적용되면
    // 스냅샷 테스트가 잘못 실패합니다.
    // (실제 가치가 없으므로 스냅샷을 업데이트해야 합니다).

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
