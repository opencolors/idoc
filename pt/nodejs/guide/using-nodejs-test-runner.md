---
title: Usando o executor de testes do Node.js
description: Um guia sobre como configurar e usar o executor de testes integrado do Node.js, incluindo configuração geral, testes de worker de serviço, testes de captura instantânea, testes unitários e testes de interface do usuário.
head:
  - - meta
    - name: og:title
      content: Usando o executor de testes do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Um guia sobre como configurar e usar o executor de testes integrado do Node.js, incluindo configuração geral, testes de worker de serviço, testes de captura instantânea, testes unitários e testes de interface do usuário.
  - - meta
    - name: twitter:title
      content: Usando o executor de testes do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Um guia sobre como configurar e usar o executor de testes integrado do Node.js, incluindo configuração geral, testes de worker de serviço, testes de captura instantânea, testes unitários e testes de interface do usuário.
---


# Usando o executor de testes do Node.js

O Node.js possui um executor de testes embutido flexível e robusto. Este guia mostrará como configurá-lo e usá-lo.

::: code-group
```bash [Visão geral da arquitetura]
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
```bash [Instalar dependências]
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

::: info NOTA
Globs exigem node v21+, e os globs em si devem ser envolvidos em aspas (sem, você obterá um comportamento diferente do esperado, onde pode parecer estar funcionando no início, mas não está).
:::

Existem algumas coisas que você sempre vai querer, então coloque-as em um arquivo de configuração base como o seguinte. Este arquivo será importado por outras configurações mais personalizadas.

## Configuração geral

```js 
import { register } from 'node:module';
register('some-typescript-loader');
// TypeScript é suportado daqui em diante
// MAS outros arquivos test/setup.*.mjs ainda devem ser JavaScript puro!
```

Em seguida, para cada configuração, crie um arquivo `setup` dedicado (garantindo que o arquivo base `setup.mjs` seja importado em cada um). Existem vários motivos para isolar as configurações, mas o motivo mais óbvio é [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) + desempenho: muito do que você pode estar configurando são mocks/stubs específicos do ambiente, que podem ser bastante caros e diminuirão a velocidade das execuções de teste. Você deseja evitar esses custos (dinheiro literal que você paga ao CI, tempo esperando que os testes terminem, etc.) quando não precisar deles.

Cada exemplo abaixo foi retirado de projetos do mundo real; eles podem não ser apropriados/aplicáveis ao seu, mas cada um demonstra conceitos gerais que são amplamente aplicáveis.


## Testes de ServiceWorker

`ServiceWorkerGlobalScope` contém APIs muito específicas que não existem em outros ambientes, e algumas de suas APIs são aparentemente semelhantes a outras (ex: `fetch`), mas têm comportamento aumentado. Você não quer que elas se espalhem para testes não relacionados.

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

## Testes de Snapshot

Estes foram popularizados pelo Jest; agora, muitas bibliotecas implementam tal funcionalidade, incluindo o Node.js a partir da v22.3.0. Existem vários casos de uso, como verificar a saída de renderização de componentes e a configuração de [Infraestrutura como Código](https://en.wikipedia.org/wiki/Infrastructure_as_code). O conceito é o mesmo, independentemente do caso de uso.

Não há nenhuma configuração específica necessária, exceto habilitar o recurso via `--experimental-test-snapshots`. Mas para demonstrar a configuração opcional, você provavelmente adicionaria algo como o seguinte a um de seus arquivos de configuração de teste existentes.

Por padrão, o node gera um nome de arquivo que é incompatível com a detecção de destaque de sintaxe: `.js.snapshot`. O arquivo gerado é, na verdade, um arquivo CJS, então um nome de arquivo mais apropriado terminaria com `.snapshot.cjs` (ou mais sucintamente `.snap.cjs` como abaixo); isso também lidará melhor em projetos ESM.

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

O exemplo abaixo demonstra o teste de snapshot com [testing library](https://testing-library.com/) para componentes de UI; observe as duas maneiras diferentes de acessar `assert.snapshot`):

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
`assert.snapshot` vem do contexto do teste (t ou this), não de `node:assert`. Isso é necessário porque o contexto do teste tem acesso a um escopo que é impossível para `node:assert` (você teria que fornecê-lo manualmente toda vez que `assert.snapshot` fosse usado, como `snapshot (this, value)`, o que seria bastante tedioso).
:::


## Testes Unitários

Testes unitários são os testes mais simples e geralmente não exigem nada de especial. A grande maioria dos seus testes provavelmente será de testes unitários, por isso é importante manter essa configuração mínima, porque uma pequena diminuição no desempenho da configuração aumentará e se propagará.

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// arquivos de texto simples como graphql agora podem ser importados:
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

## Testes de Interface do Usuário

Testes de UI geralmente requerem um DOM e possivelmente outras APIs específicas do navegador (como `IndexedDb` usado abaixo). Estes tendem a ser muito complicados e caros de configurar.

Se você usa uma API como `IndexedDb`, mas ela é muito isolada, um mock global como abaixo talvez não seja a melhor opção. Em vez disso, talvez mova este `beforeEach` para o teste específico onde `IndexedDb` será acessado. Observe que se o módulo que acessa `IndexedDb` (ou o que for) for amplamente acessado, faça mock desse módulo (provavelmente a melhor opção) ou mantenha-o aqui.

```js
import { register } from 'node:module';

// ⚠️ Certifique-se de que apenas 1 instância de JSDom seja instanciada; múltiplas levarão a muitos 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ Não especificar isso provavelmente levará a muitos 🤬
});

// Exemplo de como decorar um global.
// `history` do JSDOM não lida com a navegação; o seguinte lida com a maioria dos casos.
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

Você pode ter 2 níveis diferentes de testes de UI: um semelhante a unidade (em que externos e dependências são simulados) e um mais ponta a ponta (onde apenas externos como IndexedDb são simulados, mas o restante da cadeia é real). O primeiro é geralmente a opção mais pura e o último é geralmente adiado para um teste de usabilidade automatizado totalmente ponta a ponta por meio de algo como [Playwright](https://playwright.dev/) ou [Puppeteer](https://pptr.dev/). Abaixo está um exemplo do primeiro.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

// ⚠️ Observe que SomeOtherComponent NÃO é uma importação estática;
// isso é necessário para facilitar a simulação de suas próprias importações.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ A sequência é importante: o mock deve ser configurado ANTES que seu consumidor seja importado.

    // Requer que `--experimental-test-module-mocks` seja definido.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // Isso você não gostaria de lidar com um snapshot porque seria frágil:
    // Quando atualizações inconsequentes são feitas na mensagem de erro,
    // o teste de snapshot falharia erroneamente
    // (e o snapshot precisaria ser atualizado sem valor real).

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
