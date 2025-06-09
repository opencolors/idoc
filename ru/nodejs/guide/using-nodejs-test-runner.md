---
title: Использование тестового запуска Node.js
description: Руководство по настройке и использованию встроенного тестового запуска Node.js, включая общие настройки, тесты сервис-воркеров, тесты моментальных снимков, модульные тесты и тесты пользовательского интерфейса.
head:
  - - meta
    - name: og:title
      content: Использование тестового запуска Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Руководство по настройке и использованию встроенного тестового запуска Node.js, включая общие настройки, тесты сервис-воркеров, тесты моментальных снимков, модульные тесты и тесты пользовательского интерфейса.
  - - meta
    - name: twitter:title
      content: Использование тестового запуска Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Руководство по настройке и использованию встроенного тестового запуска Node.js, включая общие настройки, тесты сервис-воркеров, тесты моментальных снимков, модульные тесты и тесты пользовательского интерфейса.
---


# Использование тестового движка Node.js

Node.js имеет гибкий и надежный встроенный тестовый движок. Это руководство покажет вам, как его настроить и использовать.

::: code-group
```bash [Обзор архитектуры]
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
```bash [Установка зависимостей]
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
глобы требуют node v21+, и сами глобы должны быть заключены в кавычки (без этого вы получите другое поведение, чем ожидалось, при котором может сначала показаться, что он работает, но это не так).
:::

Есть вещи, которые вам всегда нужны, поэтому поместите их в базовый файл настройки, как показано ниже. Этот файл будет импортирован другими, более специализированными настройками.

## Общая настройка

```js 
import { register } from 'node:module';
register('some-typescript-loader');
// Поддержка TypeScript в дальнейшем
// НО другие файлы test/setup.*.mjs по-прежнему должны быть простым JavaScript!
```

Затем для каждой настройки создайте выделенный файл `setup` (убедившись, что базовый файл `setup.mjs` импортирован в каждом). Есть ряд причин для изоляции настроек, но самая очевидная причина - [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) + производительность: большая часть того, что вы можете настраивать, - это специфичные для среды моки/заглушки, которые могут быть довольно дорогими и замедлят выполнение тестов. Вы хотите избежать этих затрат (буквально денег, которые вы платите за CI, времени ожидания завершения тестов и т. д.), когда они вам не нужны.

Каждый из приведенных ниже примеров был взят из реальных проектов; они могут быть неуместными/неприменимыми к вашим, но каждый демонстрирует общие концепции, которые широко применимы.


## ServiceWorker тесты

`ServiceWorkerGlobalScope` содержит очень специфические API, которых нет в других средах, и некоторые из его API кажутся похожими на другие (например, `fetch`), но имеют расширенное поведение. Вы не хотите, чтобы они проникали в несвязанные тесты.

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

## Snapshot тесты

Они были популяризированы Jest; теперь многие библиотеки реализуют такую функциональность, включая Node.js начиная с v22.3.0. Существует несколько вариантов использования, таких как проверка вывода рендеринга компонентов и [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code) конфигурации. Концепция одинакова независимо от варианта использования.

Никакой специальной конфигурации не требуется, кроме включения функции с помощью `--experimental-test-snapshots`. Но чтобы продемонстрировать необязательную конфигурацию, вы, вероятно, добавите что-то вроде следующего в один из существующих файлов конфигурации тестов.

По умолчанию node генерирует имя файла, несовместимое с обнаружением подсветки синтаксиса: `.js.snapshot`. Сгенерированный файл на самом деле является файлом CJS, поэтому более подходящим именем файла будет заканчиваться на `.snapshot.cjs` (или более кратко `.snap.cjs`, как показано ниже); это также будет лучше работать в проектах ESM.

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

В примере ниже демонстрируется тестирование снимков с помощью [testing library](https://testing-library.com/) для UI компонентов; обратите внимание на два разных способа доступа к `assert.snapshot`):

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
`assert.snapshot` происходит из контекста теста (t или this), а не из `node:assert`. Это необходимо, потому что контекст теста имеет доступ к области видимости, которая недоступна для `node:assert` (вам пришлось бы вручную предоставлять ее каждый раз, когда используется `assert.snapshot`, например `snapshot (this, value)`, что было бы довольно утомительно).
:::


## Unit tests

Unit tests are the simplest tests and generally require relatively nothing special. The vast majority of your tests will likely be unit tests, so it is important to keep this setup minimal because a small decrease to setup performance will magnify and cascade.

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

## User Interface tests

UI tests generally require a DOM, and possibly other browser-specific APIs (such as `IndexedDb` used below). These tend to be very complicated and expensive to setup.

If you use an API like `IndexedDb` but it's very isolated, a global mock like below is perhaps not the way to go. Instead, perhaps move this `beforeEach` into the specific test where `IndexedDb` will be accessed. Note that if the module accessing `IndexedDb` (or whatever) is itself widely accessed, either mock that module (probably the better option), or do keep this here.

```js
import { register } from 'node:module';

// ⚠️ Ensure only 1 instance of JSDom is instantiated; multiples will lead to many 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ Failing to specify this will likely lead to many 🤬
});

// Example of how to decorate a global.
// JSDOM's `history` does not handle navigation; the following handles most cases.
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

You can have 2 different levels of UI tests: a unit-like (wherein externals & dependencies are mocked) and a more end-to-end (where only externals like IndexedDb are mocked but the rest of the chain is real). The former is generally the purer option, and the latter is generally deferred to a fully end-to-end automated usability test via something like [Playwright](https://playwright.dev/) or [Puppeteer](https://pptr.dev/). Below is an example of the former.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

// ⚠️ Note that SomeOtherComponent is NOT a static import;
// this is necessary in order to facilitate mocking its own imports.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ Sequence matters: the mock must be set up BEFORE its consumer is imported.

    // Requires the `--experimental-test-module-mocks` be set.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // This you would not want to handle with a snapshot because that would be brittle:
    // When inconsequential updates are made to the error message,
    // the snapshot test would erroneously fail
    // (and the snapshot would need to be updated for no real value).

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```

## Юнит-тесты

Юнит-тесты - это самые простые тесты, которые обычно не требуют ничего особенного. Подавляющее большинство ваших тестов, вероятно, будут юнит-тестами, поэтому важно свести эту настройку к минимуму, поскольку небольшое снижение производительности настройки увеличится и каскадируется.

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

## Тесты пользовательского интерфейса

UI-тесты обычно требуют DOM и, возможно, других специфичных для браузера API (таких как `IndexedDb`, используемый ниже). Они, как правило, очень сложны и дороги в настройке.

Если вы используете API, такой как `IndexedDb`, но он очень изолирован, глобальный мок, как показано ниже, возможно, не подойдет. Вместо этого, возможно, переместите этот `beforeEach` в конкретный тест, где будет осуществляться доступ к `IndexedDb`. Обратите внимание, что если модуль, обращающийся к `IndexedDb` (или чему-либо еще), широко используется, либо замокайте этот модуль (вероятно, лучший вариант), либо оставьте его здесь.

```js
import { register } from 'node:module';

// ⚠️ Убедитесь, что создан только 1 экземпляр JSDom; множественные приведут к большому количеству 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ Неуказание этого, вероятно, приведет к большому количеству 🤬
});

// Пример того, как украсить глобальный объект.
// `history` в JSDOM не обрабатывает навигацию; следующее обрабатывает большинство случаев.
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

У вас может быть 2 разных уровня UI-тестов: юнит-подобный (в котором внешние зависимости замоканы) и более сквозной (где замоканы только внешние зависимости, такие как IndexedDb, но остальная часть цепочки реальна). Первый обычно является более чистым вариантом, а второй обычно откладывается до полностью сквозного автоматизированного теста юзабилити с помощью чего-то вроде [Playwright](https://playwright.dev/) или [Puppeteer](https://pptr.dev/). Ниже приведен пример первого.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Любой фреймворк (ex svelte)

// ⚠️ Обратите внимание, что SomeOtherComponent НЕ является статическим импортом;
// это необходимо для облегчения замокивания собственных импортов.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ Последовательность имеет значение: мок должен быть настроен ДО импорта его потребителя.

    // Требуется установить `--experimental-test-module-mocks`.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // Это вы не захотите обрабатывать с помощью снимка, потому что это было бы ненадежно:
    // Когда в сообщение об ошибке вносятся несущественные обновления,
    // тест снимка ошибочно завершится неудачей
    // (и снимок нужно будет обновить без реальной ценности).

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
