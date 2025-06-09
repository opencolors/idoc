---
title: Utilisation du lanceur de tests Node.js
description: Un guide sur la configuration et l'utilisation du lanceur de tests intégré de Node.js, y compris la configuration générale, les tests de worker de service, les tests de capture instantanée, les tests unitaires et les tests d'interface utilisateur.
head:
  - - meta
    - name: og:title
      content: Utilisation du lanceur de tests Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Un guide sur la configuration et l'utilisation du lanceur de tests intégré de Node.js, y compris la configuration générale, les tests de worker de service, les tests de capture instantanée, les tests unitaires et les tests d'interface utilisateur.
  - - meta
    - name: twitter:title
      content: Utilisation du lanceur de tests Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Un guide sur la configuration et l'utilisation du lanceur de tests intégré de Node.js, y compris la configuration générale, les tests de worker de service, les tests de capture instantanée, les tests unitaires et les tests d'interface utilisateur.
---


# Utilisation du lanceur de tests de Node.js

Node.js dispose d'un lanceur de tests intégré flexible et robuste. Ce guide vous montrera comment le configurer et l'utiliser.

::: code-group
```bash [Aperçu de l'architecture]
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
```bash [Installer les dépendances]
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
Les glob requièrent Node v21+, et les glob doivent eux-mêmes être entourés de guillemets (sans, vous obtiendrez un comportement différent de celui attendu, où il peut d'abord sembler fonctionner mais ce n'est pas le cas).
:::

Il y a certaines choses que vous voulez toujours, alors mettez-les dans un fichier de configuration de base comme le suivant. Ce fichier sera importé par d'autres configurations plus spécifiques.

## Configuration générale

```js
import { register } from 'node:module';
register('some-typescript-loader');
// TypeScript est pris en charge par la suite
// MAIS les autres fichiers test/setup.*.mjs doivent toujours être du JavaScript pur !
```

Ensuite, pour chaque configuration, créez un fichier `setup` dédié (en vous assurant que le fichier `setup.mjs` de base est importé dans chacun). Il existe un certain nombre de raisons d'isoler les configurations, mais la raison la plus évidente est [YAGNI](https://fr.wikipedia.org/wiki/You_aren't_gonna_need_it) + performance : une grande partie de ce que vous configurez peut être des mocks/stubs spécifiques à l'environnement, qui peuvent être assez coûteux et ralentiront l'exécution des tests. Vous voulez éviter ces coûts (l'argent littéral que vous payez au CI, le temps d'attente que les tests se terminent, etc.) lorsque vous n'en avez pas besoin.

Chaque exemple ci-dessous a été tiré de projets réels ; ils peuvent ne pas être appropriés/applicables aux vôtres, mais chacun démontre des concepts généraux qui sont largement applicables.


## Tests ServiceWorker

`ServiceWorkerGlobalScope` contient des API très spécifiques qui n'existent pas dans d'autres environnements, et certaines de ses API sont apparemment similaires à d'autres (ex `fetch`) mais ont un comportement augmenté. Vous ne voulez pas que celles-ci se répandent dans des tests non liés.

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

## Tests de captures instantanées (Snapshot tests)

Ceux-ci ont été popularisés par Jest ; maintenant, de nombreuses bibliothèques implémentent une telle fonctionnalité, y compris Node.js à partir de la v22.3.0. Il existe plusieurs cas d'utilisation tels que la vérification de la sortie du rendu des composants et la configuration de [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code). Le concept est le même quel que soit le cas d'utilisation.

Aucune configuration spécifique n'est requise, sauf l'activation de la fonctionnalité via `--experimental-test-snapshots`. Mais pour démontrer la configuration optionnelle, vous ajouteriez probablement quelque chose comme ce qui suit à l'un de vos fichiers de configuration de test existants.

Par défaut, node génère un nom de fichier incompatible avec la détection de la coloration syntaxique : `.js.snapshot`. Le fichier généré est en fait un fichier CJS, donc un nom de fichier plus approprié se terminerait par `.snapshot.cjs` (ou plus succinctement `.snap.cjs` comme ci-dessous) ; cela gérera également mieux dans les projets ESM.

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

L'exemple ci-dessous illustre les tests de capture instantanée avec [testing library](https://testing-library.com/) pour les composants UI ; notez les deux façons différentes d'accéder à `assert.snapshot`) :

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
`assert.snapshot` vient du contexte du test (t ou this), pas de `node:assert`. Ceci est nécessaire car le contexte de test a accès à une portée impossible pour `node:assert` (vous devriez la fournir manuellement à chaque fois que `assert.snapshot` est utilisé, comme `snapshot (this, value)`, ce qui serait plutôt fastidieux).
:::


## Tests unitaires

Les tests unitaires sont les tests les plus simples et ne nécessitent généralement rien de spécial. La grande majorité de vos tests seront probablement des tests unitaires, il est donc important de maintenir cette configuration minimale, car une petite diminution des performances de configuration s'amplifiera et se propagera.

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// Les fichiers en texte brut comme graphql peuvent maintenant être importés :
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

## Tests d’interface utilisateur

Les tests d’interface utilisateur nécessitent généralement un DOM et éventuellement d’autres API spécifiques au navigateur (telles que `IndexedDb` utilisée ci-dessous). Ceux-ci ont tendance à être très compliqués et coûteux à configurer.

Si vous utilisez une API comme `IndexedDb`, mais qu’elle est très isolée, une simulation globale comme celle ci-dessous n’est peut-être pas la solution. Au lieu de cela, déplacez peut-être ce `beforeEach` dans le test spécifique où `IndexedDb` sera accessible. Notez que si le module accédant à `IndexedDb` (ou autre) est lui-même largement accessible, simulez ce module (probablement la meilleure option), ou conservez-le ici.

```js
import { register } from 'node:module';

// ⚠️ Assurez-vous qu’une seule instance de JSDom est instanciée ; plusieurs instances mèneront à beaucoup de 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ Ne pas spécifier ceci mènera probablement à beaucoup de 🤬
});

// Exemple de la façon de décorer un global.
// L’`history` de JSDOM ne gère pas la navigation ; ce qui suit gère la plupart des cas.
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

Vous pouvez avoir 2 niveaux différents de tests d’interface utilisateur : un type unitaire (où les éléments externes et les dépendances sont simulés) et un plus de bout en bout (où seuls les éléments externes comme IndexedDb sont simulés, mais le reste de la chaîne est réel). Le premier est généralement l’option la plus pure, et le second est généralement renvoyé à un test d’utilisabilité automatisé entièrement de bout en bout via quelque chose comme [Playwright](https://playwright.dev/) ou [Puppeteer](https://pptr.dev/). Ci-dessous, voici un exemple du premier.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Tout framework (ex svelte)

// ⚠️ Notez que SomeOtherComponent n’est PAS une importation statique ;
// ceci est nécessaire afin de faciliter la simulation de ses propres importations.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ La séquence est importante : la simulation doit être configurée AVANT que son consommateur ne soit importé.

    // Nécessite que le `--experimental-test-module-mocks` soit défini.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // Ceci, vous ne voudriez pas le gérer avec un instantané, car ce serait fragile :
    // Lorsque des mises à jour sans conséquence sont apportées au message d’erreur,
    // le test d’instantané échouerait à tort
    // (et l’instantané devrait être mis à jour sans valeur réelle).

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
