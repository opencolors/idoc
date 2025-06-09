---
title: Uso del runner di test di Node.js
description: Una guida sulla configurazione e sull'utilizzo del runner di test integrato di Node.js, inclusa la configurazione generale, i test dei worker di servizio, i test di snapshot, i test unitari e i test dell'interfaccia utente.
head:
  - - meta
    - name: og:title
      content: Uso del runner di test di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una guida sulla configurazione e sull'utilizzo del runner di test integrato di Node.js, inclusa la configurazione generale, i test dei worker di servizio, i test di snapshot, i test unitari e i test dell'interfaccia utente.
  - - meta
    - name: twitter:title
      content: Uso del runner di test di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una guida sulla configurazione e sull'utilizzo del runner di test integrato di Node.js, inclusa la configurazione generale, i test dei worker di servizio, i test di snapshot, i test unitari e i test dell'interfaccia utente.
---


# Utilizzo del test runner di Node.js

Node.js ha un test runner integrato flessibile e robusto. Questa guida ti mostrerà come configurarlo e utilizzarlo.

::: code-group
```bash [Panoramica dell'architettura]
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
```bash [Installa le dipendenze]
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
i glob richiedono node v21+, e i glob stessi devono essere racchiusi tra virgolette (senza, otterrai un comportamento diverso dal previsto, in cui potrebbe sembrare inizialmente che funzioni ma non lo è).
:::

Ci sono alcune cose che vuoi sempre, quindi mettile in un file di setup di base come il seguente. Questo file verrà importato da altri setup più specifici.

## Setup generale

```js
import { register } from 'node:module';
register('some-typescript-loader');
// TypeScript è supportato d'ora in poi
// MA gli altri file test/setup.*.mjs devono essere ancora JavaScript puro!
```

Quindi, per ogni setup, crea un file `setup` dedicato (assicurandoti che il file `setup.mjs` di base sia importato all'interno di ciascuno). Ci sono una serie di motivi per isolare i setup, ma il motivo più ovvio è [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) + performance: gran parte di ciò che potresti configurare sono mock/stub specifici dell'ambiente, che possono essere piuttosto costosi e rallentare le esecuzioni dei test. Vuoi evitare questi costi (denaro letterale che paghi a CI, tempo di attesa per il completamento dei test, ecc.) quando non ne hai bisogno.

Ogni esempio qui sotto è stato preso da progetti reali; potrebbero non essere appropriati/applicabili al tuo, ma ognuno dimostra concetti generali che sono ampiamente applicabili.


## Test di ServiceWorker

`ServiceWorkerGlobalScope` contiene API molto specifiche che non esistono in altri ambienti e alcune delle sue API sono apparentemente simili ad altre (es. `fetch`) ma hanno un comportamento aumentato. Non vuoi che questi si riversino in test non correlati.

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

## Test di snapshot

Questi sono stati resi popolari da Jest; ora, molte librerie implementano tale funzionalità, incluso Node.js dalla versione v22.3.0. Esistono diversi casi d'uso come la verifica dell'output di rendering dei componenti e la configurazione [Infrastructure as Code](https://en.wikipedia.org/wiki/Infrastructure_as_code). Il concetto è lo stesso indipendentemente dal caso d'uso.

Non è richiesta alcuna configurazione specifica, tranne l'abilitazione della funzionalità tramite `--experimental-test-snapshots`. Ma per dimostrare la configurazione opzionale, probabilmente aggiungeresti qualcosa di simile al seguente a uno dei tuoi file di configurazione dei test esistenti.

Per impostazione predefinita, node genera un nome file incompatibile con il rilevamento dell'evidenziazione della sintassi: `.js.snapshot`. Il file generato è in realtà un file CJS, quindi un nome file più appropriato terminerebbe con `.snapshot.cjs` (o più succintamente `.snap.cjs` come di seguito); questo gestirà anche meglio nei progetti ESM.

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

L'esempio seguente dimostra il test di snapshot con [testing library](https://testing-library.com/) per i componenti dell'interfaccia utente; nota i due diversi modi di accedere a `assert.snapshot`):

```js
import { describe, it } from 'node:test';

import { prettyDOM } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Qualsiasi framework (es svelte)

import { SomeComponent } from './SomeComponent.jsx';


describe('<SomeComponent>', () => {
  // Per le persone che preferiscono la sintassi "fat-arrow", la seguente è probabilmente migliore per la coerenza
  it('should render defaults when no props are provided', (t) => {
    const component = render(<SomeComponent />).container.firstChild;

    t.assert.snapshot(prettyDOM(component));
  });

  it('should consume `foo` when provided', function() {
    const component = render(<SomeComponent foo="bar" />).container.firstChild;

    this.assert.snapshot(prettyDOM(component));
    // `this` funziona solo quando viene utilizzata `function` (non "fat arrow").
  });
});
```

::: warning
`assert.snapshot` proviene dal contesto del test (t o this), non da `node:assert`. Ciò è necessario perché il contesto del test ha accesso a un ambito che è impossibile per `node:assert` (dovresti fornirlo manualmente ogni volta che viene utilizzato `assert.snapshot`, come `snapshot (this, value)`, il che sarebbe piuttosto tedioso).
:::


## Unit test

Gli unit test sono i test più semplici e generalmente non richiedono nulla di speciale. La stragrande maggioranza dei tuoi test saranno probabilmente unit test, quindi è importante mantenere questa configurazione al minimo perché una piccola diminuzione delle prestazioni di configurazione si ingrandirà e si propagherà a cascata.

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// i file di testo semplice come graphql possono ora essere importati:
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

## Test dell'interfaccia utente

I test dell'interfaccia utente generalmente richiedono un DOM e possibilmente altre API specifiche del browser (come `IndexedDb` utilizzato di seguito). Questi tendono ad essere molto complicati e costosi da impostare.

Se utilizzi un'API come `IndexedDb` ma è molto isolata, un mock globale come quello sotto potrebbe non essere la strada da percorrere. Invece, forse sposta questo `beforeEach` nel test specifico in cui verrà effettuato l'accesso a `IndexedDb`. Nota che se il modulo che accede a `IndexedDb` (o altro) è esso stesso ampiamente accessibile, esegui il mock di quel modulo (probabilmente l'opzione migliore) o mantienilo qui.

```js
import { register } from 'node:module';

// ⚠️ Assicurati che venga istanziata solo 1 istanza di JSDom; più istanze porteranno a molti 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ La mancata specifica di questo porterà probabilmente a molti 🤬
});

// Esempio di come decorare un globale.
// La `history` di JSDOM non gestisce la navigazione; quanto segue gestisce la maggior parte dei casi.
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

Puoi avere 2 diversi livelli di test dell'interfaccia utente: uno simile a un'unità (in cui gli elementi esterni e le dipendenze sono simulati) e uno più end-to-end (in cui solo gli elementi esterni come IndexedDb sono simulati ma il resto della catena è reale). Il primo è generalmente l'opzione più pura e il secondo è generalmente rinviato a un test di usabilità automatizzato completamente end-to-end tramite qualcosa come [Playwright](https://playwright.dev/) o [Puppeteer](https://pptr.dev/). Di seguito è riportato un esempio del primo.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

// ⚠️ Nota che SomeOtherComponent NON è un import statico;
// questo è necessario per facilitare la simulazione dei propri import.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ La sequenza è importante: il mock deve essere impostato PRIMA che il suo consumatore venga importato.

    // Richiede l'impostazione di `--experimental-test-module-mocks`.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // Questo non vorresti gestirlo con uno snapshot perché sarebbe fragile:
    // Quando vengono apportati aggiornamenti irrilevanti al messaggio di errore,
    // il test dello snapshot fallirebbe erroneamente
    // (e lo snapshot dovrebbe essere aggiornato senza un reale valore).

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
