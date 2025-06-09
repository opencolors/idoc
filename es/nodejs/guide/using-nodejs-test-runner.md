---
title: Uso del ejecutor de pruebas de Node.js
description: Una guía sobre la configuración y el uso del ejecutor de pruebas integrado de Node.js, incluyendo la configuración general, las pruebas de worker de servicio, las pruebas de instantánea, las pruebas unitarias y las pruebas de interfaz de usuario.
head:
  - - meta
    - name: og:title
      content: Uso del ejecutor de pruebas de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una guía sobre la configuración y el uso del ejecutor de pruebas integrado de Node.js, incluyendo la configuración general, las pruebas de worker de servicio, las pruebas de instantánea, las pruebas unitarias y las pruebas de interfaz de usuario.
  - - meta
    - name: twitter:title
      content: Uso del ejecutor de pruebas de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una guía sobre la configuración y el uso del ejecutor de pruebas integrado de Node.js, incluyendo la configuración general, las pruebas de worker de servicio, las pruebas de instantánea, las pruebas unitarias y las pruebas de interfaz de usuario.
---


# Usando el ejecutor de pruebas de Node.js

Node.js tiene un ejecutor de pruebas incorporado flexible y robusto. Esta guía te mostrará cómo configurarlo y usarlo.

::: code-group
```bash [Descripción general de la arquitectura]
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
```bash [Instalar dependencias]
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
Los globs requieren node v21+, y los globs deben estar entre comillas (sin ellas, obtendrás un comportamiento diferente al esperado, en el que puede parecer que funciona al principio, pero no es así).
:::

Hay algunas cosas que siempre quieres, así que ponlas en un archivo de configuración base como el siguiente. Este archivo será importado por otras configuraciones más específicas.

## Configuración general

```js 
import { register } from 'node:module';
register('some-typescript-loader');
// TypeScript es compatible a partir de ahora
// ¡PERO otros archivos test/setup.*.mjs aún deben ser JavaScript plano!
```

Luego, para cada configuración, crea un archivo `setup` dedicado (asegurándote de que el archivo base `setup.mjs` se importe dentro de cada uno). Hay varias razones para aislar las configuraciones, pero la razón más obvia es [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) + rendimiento: gran parte de lo que puedes estar configurando son mocks/stubs específicos del entorno, que pueden ser bastante costosos y ralentizarán la ejecución de las pruebas. Quieres evitar esos costos (dinero literal que pagas a CI, tiempo esperando que terminen las pruebas, etc.) cuando no los necesitas.

Cada ejemplo a continuación fue tomado de proyectos del mundo real; puede que no sean apropiados/aplicables a los tuyos, pero cada uno demuestra conceptos generales que son ampliamente aplicables.


## Pruebas de ServiceWorker

`ServiceWorkerGlobalScope` contiene APIs muy específicas que no existen en otros entornos, y algunas de sus APIs son aparentemente similares a otras (ej. `fetch`) pero tienen un comportamiento aumentado. No querrá que esto se extienda a pruebas no relacionadas.

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

## Pruebas de instantáneas

Estas fueron popularizadas por Jest; ahora, muchas bibliotecas implementan tal funcionalidad, incluyendo Node.js a partir de la v22.3.0. Existen varios casos de uso, como la verificación de la salida de renderizado de componentes y la configuración de [Infraestructura como Código](https://en.wikipedia.org/wiki/Infrastructure_as_code). El concepto es el mismo independientemente del caso de uso.

No se requiere ninguna configuración específica, excepto habilitar la característica a través de `--experimental-test-snapshots`. Pero para demostrar la configuración opcional, probablemente agregaría algo como lo siguiente a uno de sus archivos de configuración de prueba existentes.

De forma predeterminada, node genera un nombre de archivo que es incompatible con la detección de resaltado de sintaxis: `.js.snapshot`. El archivo generado es en realidad un archivo CJS, por lo que un nombre de archivo más apropiado terminaría con `.snapshot.cjs` (o más sucintamente `.snap.cjs` como se muestra a continuación); esto también funcionará mejor en proyectos ESM.

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

El siguiente ejemplo demuestra las pruebas de instantáneas con [testing library](https://testing-library.com/) para componentes de la interfaz de usuario; tenga en cuenta las dos formas diferentes de acceder a `assert.snapshot`):

```js
import { describe, it } from 'node:test';

import { prettyDOM } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

import { SomeComponent } from './SomeComponent.jsx';


describe('<SomeComponent>', () => {
  // Para las personas que prefieren la sintaxis de "flecha gorda", lo siguiente es probablemente mejor para la coherencia
  it('should render defaults when no props are provided', (t) => {
    const component = render(<SomeComponent />).container.firstChild;

    t.assert.snapshot(prettyDOM(component));
  });

  it('should consume `foo` when provided', function() {
    const component = render(<SomeComponent foo="bar" />).container.firstChild;

    this.assert.snapshot(prettyDOM(component));
    // `this` funciona solo cuando se usa `function` (no "flecha gorda").
  });
});
```

::: warning
`assert.snapshot` proviene del contexto de la prueba (t o this), no de `node:assert`. Esto es necesario porque el contexto de la prueba tiene acceso a un ámbito que es imposible para `node:assert` (tendría que proporcionarlo manualmente cada vez que se usa `assert.snapshot`, como `snapshot (this, value)`, lo cual sería bastante tedioso).
:::


## Pruebas unitarias

Las pruebas unitarias son las pruebas más simples y generalmente no requieren nada especialmente. La gran mayoría de sus pruebas probablemente serán pruebas unitarias, por lo que es importante mantener esta configuración al mínimo porque una pequeña disminución en el rendimiento de la configuración se ampliará y se encadenará.

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// Los archivos de texto sin formato como graphql ahora se pueden importar:
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

## Pruebas de interfaz de usuario

Las pruebas de la interfaz de usuario generalmente requieren un DOM y posiblemente otras API específicas del navegador (como `IndexedDb` que se usa a continuación). Estos tienden a ser muy complicados y costosos de configurar.

Si usa una API como `IndexedDb` pero está muy aislada, una simulación global como la que se muestra a continuación tal vez no sea el camino a seguir. En cambio, tal vez mueva este `beforeEach` a la prueba específica donde se accederá a `IndexedDb`. Tenga en cuenta que si el módulo que accede a `IndexedDb` (o lo que sea) tiene un acceso generalizado, simule ese módulo (probablemente la mejor opción) o manténgalo aquí.

```js
import { register } from 'node:module';

// ⚠️ Asegúrese de que solo se instancie 1 instancia de JSDom; múltiples instancias conducirán a muchos 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ No especificar esto probablemente conducirá a muchos 🤬
});

// Ejemplo de cómo decorar un global.
// El `history` de JSDOM no maneja la navegación; lo siguiente maneja la mayoría de los casos.
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

Puede tener 2 niveles diferentes de pruebas de interfaz de usuario: una similar a la unidad (en la que se simulan elementos externos y dependencias) y una más de extremo a extremo (donde solo se simulan elementos externos como IndexedDb, pero el resto de la cadena es real). La primera es generalmente la opción más pura, y la segunda generalmente se difiere a una prueba de usabilidad automatizada de extremo a extremo a través de algo como [Playwright](https://playwright.dev/) o [Puppeteer](https://pptr.dev/). A continuación se muestra un ejemplo del primero.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

// ⚠️ Tenga en cuenta que SomeOtherComponent NO es una importación estática;
// esto es necesario para facilitar la simulación de sus propias importaciones.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ La secuencia importa: la simulación debe configurarse ANTES de importar su consumidor.

    // Requiere que se establezca `--experimental-test-module-mocks`.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('when calcSomeValue fails', () => {
    // Esto no querría manejarlo con una instantánea porque sería frágil:
    // Cuando se realizan actualizaciones intrascendentes en el mensaje de error,
    // la prueba de instantánea fallaría erróneamente
    // (y la instantánea debería actualizarse sin ningún valor real).

    it('should fail gracefully by displaying a pretty error', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
