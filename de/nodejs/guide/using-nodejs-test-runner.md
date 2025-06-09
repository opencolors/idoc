---
title: Verwendung des Test-Runners von Node.js
description: Ein Leitfaden zur Einrichtung und Verwendung des integrierten Test-Runners von Node.js, einschließlich allgemeiner Einrichtung, Service-Worker-Tests, Snapshot-Tests, Unit-Tests und Benutzeroberflächen-Tests.
head:
  - - meta
    - name: og:title
      content: Verwendung des Test-Runners von Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Ein Leitfaden zur Einrichtung und Verwendung des integrierten Test-Runners von Node.js, einschließlich allgemeiner Einrichtung, Service-Worker-Tests, Snapshot-Tests, Unit-Tests und Benutzeroberflächen-Tests.
  - - meta
    - name: twitter:title
      content: Verwendung des Test-Runners von Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Ein Leitfaden zur Einrichtung und Verwendung des integrierten Test-Runners von Node.js, einschließlich allgemeiner Einrichtung, Service-Worker-Tests, Snapshot-Tests, Unit-Tests und Benutzeroberflächen-Tests.
---


# Verwenden des Test-Runners von Node.js

Node.js verfügt über einen flexiblen und robusten integrierten Test-Runner. Diese Anleitung zeigt Ihnen, wie Sie ihn einrichten und verwenden.

::: code-group
```bash [Architekturüberblick]
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
```bash [Abhängigkeiten installieren]
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
Globs benötigen Node v21+ und die Globs selbst müssen in Anführungszeichen stehen (ohne dies erhalten Sie ein anderes Verhalten als erwartet, wobei es zunächst so aussieht, als ob es funktioniert, es aber nicht tut).
:::

Es gibt einige Dinge, die Sie immer wollen, also legen Sie sie in eine Basis-Setup-Datei wie die folgende. Diese Datei wird von anderen, spezifischeren Setups importiert.

## Allgemeine Einrichtung

```js
import { register } from 'node:module';
register('some-typescript-loader');
// TypeScript wird fortan unterstützt
// ABER andere test/setup.*.mjs-Dateien müssen weiterhin reines JavaScript sein!
```

Erstellen Sie dann für jedes Setup eine dedizierte `setup`-Datei (und stellen Sie sicher, dass die Basisdatei `setup.mjs` in jedem Setup importiert wird). Es gibt eine Reihe von Gründen, die Setups zu isolieren, aber der offensichtlichste Grund ist [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) + Leistung: Vieles von dem, was Sie möglicherweise einrichten, sind umgebungsspezifische Mocks/Stubs, die ziemlich teuer sein können und Testläufe verlangsamen. Sie möchten diese Kosten (buchstäblich Geld, das Sie an CI zahlen, Wartezeit für das Abschließen von Tests usw.) vermeiden, wenn Sie sie nicht benötigen.

Jedes der folgenden Beispiele stammt aus realen Projekten; sie sind möglicherweise nicht für Ihre geeignet/anwendbar, aber jedes demonstriert allgemeine Konzepte, die allgemein anwendbar sind.


## ServiceWorker-Tests

`ServiceWorkerGlobalScope` enthält sehr spezifische APIs, die in anderen Umgebungen nicht existieren, und einige seiner APIs ähneln scheinbar anderen (z. B. `fetch`), haben aber ein erweitertes Verhalten. Sie möchten nicht, dass diese in nicht verwandte Tests gelangen.

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

  it('sollte alle Clients beanspruchen', async () => {
    await onActivate(new ActivateEvent());

    assert.equal(claim.mock.callCount(), 1);
    assert.equal(matchAll.mock.callCount(), 1);
  });
});
```

## Snapshot-Tests

Diese wurden von Jest populär gemacht; mittlerweile implementieren viele Bibliotheken solche Funktionalitäten, darunter auch Node.js ab v22.3.0. Es gibt mehrere Anwendungsfälle, wie z. B. die Überprüfung der Rendering-Ausgabe von Komponenten und der [Infrastruktur als Code](https://en.wikipedia.org/wiki/Infrastructure_as_code)-Konfiguration. Das Konzept ist unabhängig vom Anwendungsfall das gleiche.

Es ist keine spezielle Konfiguration erforderlich, außer der Aktivierung der Funktion über `--experimental-test-snapshots`. Um die optionale Konfiguration zu demonstrieren, würden Sie wahrscheinlich etwas wie das Folgende zu einer Ihrer bestehenden Testkonfigurationsdateien hinzufügen.

Standardmäßig generiert Node einen Dateinamen, der nicht mit der Syntaxhervorhebungserkennung kompatibel ist: `.js.snapshot`. Die generierte Datei ist eigentlich eine CJS-Datei, daher wäre ein geeigneterer Dateiname `.snapshot.cjs` (oder kürzer `.snap.cjs` wie unten); dies wird auch in ESM-Projekten besser funktionieren.

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

Das folgende Beispiel demonstriert Snapshot-Tests mit der [Testing Library](https://testing-library.com/) für UI-Komponenten; beachten Sie die zwei verschiedenen Möglichkeiten, auf `assert.snapshot` zuzugreifen):

```js
import { describe, it } from 'node:test';

import { prettyDOM } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Beliebiges Framework (z. B. Svelte)

import { SomeComponent } from './SomeComponent.jsx';


describe('<SomeComponent>', () => {
  // Für Leute, die die "Fat-Arrow"-Syntax bevorzugen, ist das Folgende wahrscheinlich besser für die Konsistenz
  it('sollte Standardwerte rendern, wenn keine Props bereitgestellt werden', (t) => {
    const component = render(<SomeComponent />).container.firstChild;

    t.assert.snapshot(prettyDOM(component));
  });

  it('sollte `foo` verbrauchen, wenn es bereitgestellt wird', function() {
    const component = render(<SomeComponent foo="bar" />).container.firstChild;

    this.assert.snapshot(prettyDOM(component));
    // `this` funktioniert nur, wenn `function` verwendet wird (nicht "Fat Arrow").
  });
});
```

::: warning
`assert.snapshot` kommt aus dem Kontext des Tests (t oder this), nicht aus `node:assert`. Dies ist notwendig, da der Testkontext Zugriff auf einen Scope hat, der für `node:assert` unmöglich ist (Sie müssten ihn jedes Mal manuell bereitstellen, wenn `assert.snapshot` verwendet wird, wie `snapshot (this, value)`, was ziemlich mühsam wäre).
:::


## Unit-Tests

Unit-Tests sind die einfachsten Tests und erfordern im Allgemeinen relativ wenig Spezielles. Der Großteil Ihrer Tests wird wahrscheinlich Unit-Tests sein, daher ist es wichtig, dieses Setup minimal zu halten, da eine kleine Verringerung der Setup-Performance sich verstärkt und kaskadiert.

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// Klartextdateien wie graphql können jetzt importiert werden:
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

## User-Interface-Tests

UI-Tests erfordern im Allgemeinen ein DOM und möglicherweise andere browserspezifische APIs (wie z. B. `IndexedDb`, das unten verwendet wird). Diese sind in der Regel sehr kompliziert und teuer einzurichten.

Wenn Sie eine API wie `IndexedDb` verwenden, diese aber sehr isoliert ist, ist ein globaler Mock wie unten vielleicht nicht der richtige Weg. Verschieben Sie stattdessen dieses `beforeEach` in den jeweiligen Test, in dem auf `IndexedDb` zugegriffen wird. Beachten Sie, dass, wenn das Modul, das auf `IndexedDb` (oder was auch immer) zugreift, selbst weit verbreitet ist, entweder dieses Modul mocken (wahrscheinlich die bessere Option) oder dies hier behalten.

```js
import { register } from 'node:module';

// ⚠️ Stellen Sie sicher, dass nur 1 Instanz von JSDom instanziiert wird; mehrere führen zu vielen 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ Wenn dies nicht angegeben wird, führt dies wahrscheinlich zu vielen 🤬
});

// Beispiel für das Dekorieren eines Globals.
// JSDOMs `history` behandelt keine Navigation; das Folgende behandelt die meisten Fälle.
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

Sie können 2 verschiedene Ebenen von UI-Tests haben: einen Unit-ähnlichen (wobei Externe und Abhängigkeiten gemockt werden) und einen eher End-to-End-Test (wobei nur Externe wie IndexedDb gemockt werden, der Rest der Kette aber real ist). Ersteres ist im Allgemeinen die reinere Option, und Letzteres wird im Allgemeinen auf einen vollständig automatisierten End-to-End-Usability-Test über etwas wie [Playwright](https://playwright.dev/) oder [Puppeteer](https://pptr.dev/) verschoben. Unten ist ein Beispiel für Ersteres.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Beliebiges Framework (z. B. Svelte)

// ⚠️ Beachten Sie, dass SomeOtherComponent KEIN statischer Import ist;
// dies ist notwendig, um das Mocken seiner eigenen Importe zu erleichtern.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ Die Reihenfolge ist wichtig: Der Mock muss eingerichtet werden, BEVOR sein Konsument importiert wird.

    // Erfordert, dass `--experimental-test-module-mocks` gesetzt ist.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // Dies sollten Sie nicht mit einem Snapshot behandeln, da dies brüchig wäre:
    // Wenn unbedeutende Aktualisierungen an der Fehlermeldung vorgenommen werden,
    // würde der Snapshot-Test fälschlicherweise fehlschlagen
    // (und der Snapshot müsste ohne echten Mehrwert aktualisiert werden).

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
