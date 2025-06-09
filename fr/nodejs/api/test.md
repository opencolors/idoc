---
title: Exécuteur de tests Node.js
description: Le module Exécuteur de tests de Node.js fournit une solution intégrée pour écrire et exécuter des tests dans les applications Node.js. Il supporte divers formats de test, des rapports de couverture et s'intègre avec des frameworks de test populaires.
head:
  - - meta
    - name: og:title
      content: Exécuteur de tests Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Exécuteur de tests de Node.js fournit une solution intégrée pour écrire et exécuter des tests dans les applications Node.js. Il supporte divers formats de test, des rapports de couverture et s'intègre avec des frameworks de test populaires.
  - - meta
    - name: twitter:title
      content: Exécuteur de tests Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Exécuteur de tests de Node.js fournit une solution intégrée pour écrire et exécuter des tests dans les applications Node.js. Il supporte divers formats de test, des rapports de couverture et s'intègre avec des frameworks de test populaires.
---


# Lanceur de tests {#test-runner}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Le lanceur de tests est maintenant stable. |
| v18.0.0, v16.17.0 | Ajouté dans : v18.0.0, v16.17.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

Le module `node:test` facilite la création de tests JavaScript. Pour y accéder :

::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

Ce module est uniquement disponible sous le schéma `node:`.

Les tests créés via le module `test` consistent en une seule fonction qui est traitée de l’une des trois manières suivantes :

L’exemple suivant illustre la façon dont les tests sont écrits à l’aide du module `test`.

```js [ESM]
test('test synchrone réussi', (t) => {
  // Ce test réussit car il ne lève pas d'exception.
  assert.strictEqual(1, 1);
});

test('test synchrone échoué', (t) => {
  // Ce test échoue car il lève une exception.
  assert.strictEqual(1, 2);
});

test('test asynchrone réussi', async (t) => {
  // Ce test réussit car la Promise renvoyée par la fonction asynchrone
  // est résolue et non rejetée.
  assert.strictEqual(1, 1);
});

test('test asynchrone échoué', async (t) => {
  // Ce test échoue car la Promise renvoyée par la fonction asynchrone
  // est rejetée.
  assert.strictEqual(1, 2);
});

test('test échoué utilisant des Promises', (t) => {
  // Les Promises peuvent également être utilisées directement.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('cela entraînera l'échec du test'));
    });
  });
});

test('test de réussite de rappel', (t, done) => {
  // done() est la fonction de rappel. Lorsque setImmediate() s'exécute, il appelle
  // done() sans arguments.
  setImmediate(done);
});

test('test d'échec de rappel', (t, done) => {
  // Lorsque setImmediate() s'exécute, done() est appelé avec un objet Error et
  // le test échoue.
  setImmediate(() => {
    done(new Error('échec de rappel'));
  });
});
```
Si des tests échouent, le code de sortie du processus est défini sur `1`.


## Sous-tests {#subtests}

La méthode `test()` du contexte de test permet de créer des sous-tests. Elle vous permet de structurer vos tests de manière hiérarchique, où vous pouvez créer des tests imbriqués dans un test plus grand. Cette méthode se comporte de manière identique à la fonction `test()` de niveau supérieur. L'exemple suivant illustre la création d'un test de niveau supérieur avec deux sous-tests.

```js [ESM]
test('test de niveau supérieur', async (t) => {
  await t.test('sous-test 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('sous-test 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
Dans cet exemple, `await` est utilisé pour garantir que les deux sous-tests sont terminés. Ceci est nécessaire car les tests n'attendent pas la fin de leurs sous-tests, contrairement aux tests créés dans les suites. Tous les sous-tests qui sont toujours en cours d'exécution lorsque leur parent se termine sont annulés et traités comme des échecs. Tout échec de sous-test entraîne l'échec du test parent.

## Ignorer des tests {#skipping-tests}

Les tests individuels peuvent être ignorés en passant l'option `skip` au test, ou en appelant la méthode `skip()` du contexte de test comme indiqué dans l'exemple suivant.

```js [ESM]
// L'option skip est utilisée, mais aucun message n'est fourni.
test('option skip', { skip: true }, (t) => {
  // Ce code n'est jamais exécuté.
});

// L'option skip est utilisée et un message est fourni.
test('option skip avec message', { skip: 'ceci est ignoré' }, (t) => {
  // Ce code n'est jamais exécuté.
});

test('méthode skip()', (t) => {
  // Assurez-vous de retourner ici également si le test contient une logique supplémentaire.
  t.skip();
});

test('méthode skip() avec message', (t) => {
  // Assurez-vous de retourner ici également si le test contient une logique supplémentaire.
  t.skip('ceci est ignoré');
});
```
## Tests TODO {#todo-tests}

Les tests individuels peuvent être marqués comme instables ou incomplets en passant l'option `todo` au test, ou en appelant la méthode `todo()` du contexte de test, comme indiqué dans l'exemple suivant. Ces tests représentent une implémentation en attente ou un bogue qui doit être corrigé. Les tests TODO sont exécutés, mais ne sont pas traités comme des échecs de test et n'affectent donc pas le code de sortie du processus. Si un test est marqué à la fois comme TODO et ignoré, l'option TODO est ignorée.

```js [ESM]
// L'option todo est utilisée, mais aucun message n'est fourni.
test('option todo', { todo: true }, (t) => {
  // Ce code est exécuté, mais n'est pas traité comme un échec.
  throw new Error('ceci ne fait pas échouer le test');
});

// L'option todo est utilisée et un message est fourni.
test('option todo avec message', { todo: 'ceci est un test todo' }, (t) => {
  // Ce code est exécuté.
});

test('méthode todo()', (t) => {
  t.todo();
});

test('méthode todo() avec message', (t) => {
  t.todo('ceci est un test todo et n\'est pas traité comme un échec');
  throw new Error('ceci ne fait pas échouer le test');
});
```

## Alias `describe()` et `it()` {#describe-and-it-aliases}

Les suites et les tests peuvent également être écrits à l'aide des fonctions `describe()` et `it()`. [`describe()`](/fr/nodejs/api/test#describename-options-fn) est un alias pour [`suite()`](/fr/nodejs/api/test#suitename-options-fn), et [`it()`](/fr/nodejs/api/test#itname-options-fn) est un alias pour [`test()`](/fr/nodejs/api/test#testname-options-fn).

```js [ESM]
describe('Une chose', () => {
  it('devrait fonctionner', () => {
    assert.strictEqual(1, 1);
  });

  it('devrait être ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('une chose imbriquée', () => {
    it('devrait fonctionner', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` et `it()` sont importés depuis le module `node:test`.



::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## Tests `only` {#only-tests}

Si Node.js est démarré avec l'option de ligne de commande [`--test-only`](/fr/nodejs/api/cli#--test-only), ou si l'isolation des tests est désactivée, il est possible de passer outre tous les tests à l'exception d'un sous-ensemble sélectionné en passant l'option `only` aux tests qui doivent être exécutés. Lorsqu'un test avec l'option `only` est défini, tous les sous-tests sont également exécutés. Si une suite a l'option `only` définie, tous les tests dans la suite sont exécutés, à moins qu'elle n'ait des descendants avec l'option `only` définie, auquel cas seuls ces tests sont exécutés.

Lors de l'utilisation de [sous-tests](/fr/nodejs/api/test#subtests) dans un `test()`/`it()`, il est nécessaire de marquer tous les tests ancêtres avec l'option `only` pour exécuter uniquement un sous-ensemble sélectionné de tests.

La méthode `runOnly()` du contexte de test peut être utilisée pour implémenter le même comportement au niveau du sous-test. Les tests qui ne sont pas exécutés sont omis de la sortie de l'exécuteur de tests.

```js [ESM]
// Supposons que Node.js est exécuté avec l'option de ligne de commande --test-only.
// L'option 'only' de la suite est définie, donc ces tests sont exécutés.
test('ce test est exécuté', { only: true }, async (t) => {
  // Dans ce test, tous les sous-tests sont exécutés par défaut.
  await t.test('exécution du sous-test');

  // Le contexte de test peut être mis à jour pour exécuter les sous-tests avec l'option 'only'.
  t.runOnly(true);
  await t.test('ce sous-test est maintenant ignoré');
  await t.test('ce sous-test est exécuté', { only: true });

  // Rebasculer le contexte pour exécuter tous les tests.
  t.runOnly(false);
  await t.test('ce sous-test est maintenant exécuté');

  // Ne pas exécuter explicitement ces tests.
  await t.test('sous-test ignoré 3', { only: false });
  await t.test('sous-test ignoré 4', { skip: true });
});

// L'option 'only' n'est pas définie, donc ce test est ignoré.
test('ce test n'est pas exécuté', () => {
  // Ce code n'est pas exécuté.
  throw new Error('fail');
});

describe('une suite', () => {
  // L'option 'only' est définie, donc ce test est exécuté.
  it('ce test est exécuté', { only: true }, () => {
    // Ce code est exécuté.
  });

  it('ce test n'est pas exécuté', () => {
    // Ce code n'est pas exécuté.
    throw new Error('fail');
  });
});

describe.only('une suite', () => {
  // L'option 'only' est définie, donc ce test est exécuté.
  it('ce test est exécuté', () => {
    // Ce code est exécuté.
  });

  it('ce test est exécuté', () => {
    // Ce code est exécuté.
  });
});
```

## Filtrer les tests par nom {#filtering-tests-by-name}

L'option de ligne de commande [`--test-name-pattern`](/fr/nodejs/api/cli#--test-name-pattern) peut être utilisée pour exécuter uniquement les tests dont le nom correspond au modèle fourni, et l'option [`--test-skip-pattern`](/fr/nodejs/api/cli#--test-skip-pattern) peut être utilisée pour ignorer les tests dont le nom correspond au modèle fourni. Les modèles de noms de test sont interprétés comme des expressions régulières JavaScript. Les options `--test-name-pattern` et `--test-skip-pattern` peuvent être spécifiées plusieurs fois afin d'exécuter des tests imbriqués. Pour chaque test exécuté, tous les hooks de test correspondants, tels que `beforeEach()`, sont également exécutés. Les tests qui ne sont pas exécutés sont omis de la sortie de l'exécuteur de tests.

Étant donné le fichier de test suivant, le démarrage de Node.js avec l'option `--test-name-pattern="test [1-3]"` entraînerait l'exécution de `test 1`, `test 2` et `test 3` par l'exécuteur de tests. Si `test 1` ne correspond pas au modèle de nom de test, ses sous-tests ne s'exécuteraient pas, bien qu'ils correspondent au modèle. Le même ensemble de tests pourrait également être exécuté en passant `--test-name-pattern` plusieurs fois (par exemple, `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"`, etc.).

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
Les modèles de noms de test peuvent également être spécifiés à l'aide de littéraux d'expression régulière. Cela permet d'utiliser les drapeaux d'expression régulière. Dans l'exemple précédent, le démarrage de Node.js avec `--test-name-pattern="/test [4-5]/i"` (ou `--test-skip-pattern="/test [4-5]/i"`) correspondrait à `Test 4` et `Test 5` car le modèle est insensible à la casse.

Pour correspondre à un seul test avec un modèle, vous pouvez le préfixer avec tous les noms de ses tests ancêtres séparés par un espace, pour vous assurer qu'il est unique. Par exemple, étant donné le fichier de test suivant :

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
Le démarrage de Node.js avec `--test-name-pattern="test 1 some test"` ne correspondrait qu'à `some test` dans `test 1`.

Les modèles de noms de test ne modifient pas l'ensemble des fichiers que l'exécuteur de tests exécute.

Si `--test-name-pattern` et `--test-skip-pattern` sont tous les deux fournis, les tests doivent satisfaire **aux deux** exigences pour être exécutés.


## Activité asynchrone superflue {#extraneous-asynchronous-activity}

Une fois qu'une fonction de test a fini de s'exécuter, les résultats sont rapportés aussi rapidement que possible tout en conservant l'ordre des tests. Cependant, il est possible que la fonction de test génère une activité asynchrone qui lui survive. L'exécuteur de test gère ce type d'activité, mais ne retarde pas le rapport des résultats du test pour la prendre en compte.

Dans l'exemple suivant, un test se termine avec deux opérations `setImmediate()` toujours en suspens. La première `setImmediate()` tente de créer un nouveau sous-test. Étant donné que le test parent est déjà terminé et a affiché ses résultats, le nouveau sous-test est immédiatement marqué comme ayant échoué, et rapporté ultérieurement au [\<TestsStream\>](/fr/nodejs/api/test#class-testsstream).

La deuxième `setImmediate()` crée un événement `uncaughtException`. Les événements `uncaughtException` et `unhandledRejection` provenant d'un test terminé sont marqués comme ayant échoué par le module `test` et rapportés comme avertissements de diagnostic au niveau supérieur par le [\<TestsStream\>](/fr/nodejs/api/test#class-testsstream).

```js [ESM]
test('un test qui crée une activité asynchrone', (t) => {
  setImmediate(() => {
    t.test('sous-test créé trop tard', (t) => {
      throw new Error('erreur1');
    });
  });

  setImmediate(() => {
    throw new Error('erreur2');
  });

  // Le test se termine après cette ligne.
});
```
## Mode Surveillance {#watch-mode}

**Ajouté dans : v19.2.0, v18.13.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

L'exécuteur de tests Node.js prend en charge l'exécution en mode surveillance en passant l'indicateur `--watch` :

```bash [BASH]
node --test --watch
```
En mode surveillance, l'exécuteur de tests surveillera les modifications apportées aux fichiers de test et à leurs dépendances. Lorsqu'une modification est détectée, l'exécuteur de tests réexécutera les tests affectés par la modification. L'exécuteur de tests continuera à s'exécuter jusqu'à ce que le processus soit terminé.

## Exécution des tests à partir de la ligne de commande {#running-tests-from-the-command-line}

L'exécuteur de tests Node.js peut être invoqué à partir de la ligne de commande en passant l'indicateur [`--test`](/fr/nodejs/api/cli#--test) :

```bash [BASH]
node --test
```
Par défaut, Node.js exécutera tous les fichiers correspondant à ces modèles :

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

Lorsque [`--experimental-strip-types`](/fr/nodejs/api/cli#--experimental-strip-types) est fourni, les modèles supplémentaires suivants sont mis en correspondance :

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

Alternativement, un ou plusieurs modèles glob peuvent être fournis comme argument(s) final(aux) à la commande Node.js, comme indiqué ci-dessous. Les modèles glob suivent le comportement de [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7). Les modèles glob doivent être placés entre guillemets doubles sur la ligne de commande pour éviter l'expansion du shell, ce qui peut réduire la portabilité entre les systèmes.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
Les fichiers correspondants sont exécutés en tant que fichiers de test. Plus d'informations sur l'exécution des fichiers de test peuvent être trouvées dans la section [modèle d'exécution de l'exécuteur de test](/fr/nodejs/api/test#test-runner-execution-model).


### Modèle d'exécution du lanceur de tests {#test-runner-execution-model}

Lorsque l'isolation des tests au niveau du processus est activée, chaque fichier de test correspondant est exécuté dans un processus enfant distinct. Le nombre maximal de processus enfants exécutés à un moment donné est contrôlé par l'indicateur [`--test-concurrency`](/fr/nodejs/api/cli#--test-concurrency). Si le processus enfant se termine avec un code de sortie de 0, le test est considéré comme réussi. Sinon, le test est considéré comme un échec. Les fichiers de test doivent être exécutables par Node.js, mais ne sont pas tenus d'utiliser le module `node:test` en interne.

Chaque fichier de test est exécuté comme s'il s'agissait d'un script ordinaire. C'est-à-dire que si le fichier de test lui-même utilise `node:test` pour définir des tests, tous ces tests seront exécutés au sein d'un seul thread d'application, quelle que soit la valeur de l'option `concurrency` de [`test()`](/fr/nodejs/api/test#testname-options-fn).

Lorsque l'isolation des tests au niveau du processus est désactivée, chaque fichier de test correspondant est importé dans le processus du lanceur de tests. Une fois que tous les fichiers de test ont été chargés, les tests de niveau supérieur sont exécutés avec une concurrence de un. Étant donné que tous les fichiers de test sont exécutés dans le même contexte, il est possible que les tests interagissent les uns avec les autres d'une manière qui n'est pas possible lorsque l'isolation est activée. Par exemple, si un test repose sur un état global, il est possible que cet état soit modifié par un test provenant d'un autre fichier.

## Collecte de la couverture du code {#collecting-code-coverage}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Lorsque Node.js est démarré avec l'indicateur de ligne de commande [`--experimental-test-coverage`](/fr/nodejs/api/cli#--experimental-test-coverage), la couverture du code est collectée et des statistiques sont rapportées une fois que tous les tests sont terminés. Si la variable d'environnement [`NODE_V8_COVERAGE`](/fr/nodejs/api/cli#node_v8_coveragedir) est utilisée pour spécifier un répertoire de couverture du code, les fichiers de couverture V8 générés sont écrits dans ce répertoire. Les modules de base de Node.js et les fichiers dans les répertoires `node_modules/` ne sont pas inclus par défaut dans le rapport de couverture. Cependant, ils peuvent être explicitement inclus via l'indicateur [`--test-coverage-include`](/fr/nodejs/api/cli#--test-coverage-include). Par défaut, tous les fichiers de test correspondants sont exclus du rapport de couverture. Les exclusions peuvent être remplacées en utilisant l'indicateur [`--test-coverage-exclude`](/fr/nodejs/api/cli#--test-coverage-exclude). Si la couverture est activée, le rapport de couverture est envoyé à tous les [rapporteurs de test](/fr/nodejs/api/test#test-reporters) via l'événement `'test:coverage'`.

La couverture peut être désactivée sur une série de lignes en utilisant la syntaxe de commentaire suivante :

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // Le code dans cette branche ne sera jamais exécuté, mais les lignes sont ignorées
  // à des fins de couverture. Toutes les lignes suivant le commentaire 'disable' sont
  // ignorées jusqu'à ce qu'un commentaire 'enable' correspondant soit rencontré.
  console.log('this is never executed');
}
/* node:coverage enable */
```
La couverture peut également être désactivée pour un nombre de lignes spécifié. Après le nombre de lignes spécifié, la couverture sera automatiquement réactivée. Si le nombre de lignes n'est pas explicitement fourni, une seule ligne est ignorée.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### Rapporteurs de couverture {#coverage-reporters}

Les rapporteurs tap et spec imprimeront un résumé des statistiques de couverture. Il existe également un rapporteur lcov qui générera un fichier lcov pouvant être utilisé comme rapport de couverture approfondi.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- Aucun résultat de test n'est rapporté par ce rapporteur.
- Ce rapporteur devrait idéalement être utilisé en parallèle d'un autre rapporteur.

## Simulation (Mocking) {#mocking}

Le module `node:test` prend en charge la simulation pendant les tests via un objet `mock` de niveau supérieur. L'exemple suivant crée un espion sur une fonction qui additionne deux nombres. L'espion est ensuite utilisé pour vérifier que la fonction a été appelée comme prévu.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('espionne une fonction', () => {
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

  // Réinitialise les mocks suivis globalement.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('espionne une fonction', () => {
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

  // Réinitialise les mocks suivis globalement.
  mock.reset();
});
```
:::

La même fonctionnalité de simulation est également exposée sur l'objet [`TestContext`](/fr/nodejs/api/test#class-testcontext) de chaque test. L'exemple suivant crée un espion sur une méthode d'objet en utilisant l'API exposée sur le `TestContext`. L'avantage de la simulation via le contexte de test est que l'exécuteur de test restaurera automatiquement toutes les fonctionnalités simulées une fois le test terminé.

```js [ESM]
test('espionne une méthode d'objet', (t) => {
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

### Minuteurs {#timers}

La simulation de minuteurs est une technique couramment utilisée dans les tests logiciels pour simuler et contrôler le comportement des minuteurs, tels que `setInterval` et `setTimeout`, sans attendre réellement les intervalles de temps spécifiés.

Référez-vous à la classe [`MockTimers`](/fr/nodejs/api/test#class-mocktimers) pour une liste complète des méthodes et fonctionnalités.

Cela permet aux développeurs d'écrire des tests plus fiables et prévisibles pour les fonctionnalités dépendant du temps.

L'exemple ci-dessous montre comment simuler `setTimeout`. En utilisant `.enable({ apis: ['setTimeout'] });`, cela simulera les fonctions `setTimeout` dans les modules [node:timers](/fr/nodejs/api/timers) et [node:timers/promises](/fr/nodejs/api/timers#timers-promises-api), ainsi que depuis le contexte global de Node.js.

**Remarque :** La déstructuration de fonctions telles que `import { setTimeout } from 'node:timers'` n'est actuellement pas prise en charge par cette API.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('simule setTimeout pour qu'il soit exécuté de manière synchrone sans avoir à attendre réellement', () => {
  const fn = mock.fn();

  // Choisissez éventuellement ce qu'il faut simuler
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avance dans le temps
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Réinitialise les mocks suivis globalement.
  mock.timers.reset();

  // Si vous appelez reset sur une instance de mock, cela réinitialisera également l'instance de timers
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('simule setTimeout pour qu'il soit exécuté de manière synchrone sans avoir à attendre réellement', () => {
  const fn = mock.fn();

  // Choisissez éventuellement ce qu'il faut simuler
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avance dans le temps
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Réinitialise les mocks suivis globalement.
  mock.timers.reset();

  // Si vous appelez reset sur une instance de mock, cela réinitialisera également l'instance de timers
  mock.reset();
});
```
:::

La même fonctionnalité de simulation est également exposée dans la propriété mock sur l'objet [`TestContext`](/fr/nodejs/api/test#class-testcontext) de chaque test. L'avantage de la simulation via le contexte de test est que l'exécuteur de test restaurera automatiquement toutes les fonctionnalités de minuteurs simulés une fois le test terminé.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simule setTimeout pour qu'il soit exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
  const fn = context.mock.fn();

  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avance dans le temps
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simule setTimeout pour qu'il soit exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
  const fn = context.mock.fn();

  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avance dans le temps
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

### Dates {#dates}

L'API de simulation des minuteurs permet également de simuler l'objet `Date`. Il s'agit d'une fonctionnalité utile pour tester les fonctionnalités dépendantes du temps ou pour simuler des fonctions de calendrier internes telles que `Date.now()`.

L'implémentation des dates fait également partie de la classe [`MockTimers`](/fr/nodejs/api/test#class-mocktimers). Consultez-la pour obtenir une liste complète des méthodes et des fonctionnalités.

**Note :** Les dates et les minuteurs sont dépendants lorsqu'ils sont simulés ensemble. Cela signifie que si vous avez à la fois `Date` et `setTimeout` simulés, l'avancement du temps fera également avancer la date simulée, car ils simulent une seule horloge interne.

L'exemple ci-dessous montre comment simuler l'objet `Date` et obtenir la valeur actuelle de `Date.now()`.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simule l’objet Date', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['Date'] });
  // Si non spécifié, la date initiale sera basée sur 0 dans l'époque UNIX
  assert.strictEqual(Date.now(), 0);

  // L'avance dans le temps fera également avancer la date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simule l’objet Date', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['Date'] });
  // Si non spécifié, la date initiale sera basée sur 0 dans l'époque UNIX
  assert.strictEqual(Date.now(), 0);

  // L'avance dans le temps fera également avancer la date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

S'il n'y a pas d'époque initiale définie, la date initiale sera basée sur 0 dans l'époque Unix. Il s'agit du 1er janvier 1970, 00:00:00 UTC. Vous pouvez définir une date initiale en passant une propriété `now` à la méthode `.enable()`. Cette valeur sera utilisée comme date initiale pour l'objet `Date` simulé. Il peut s'agir d'un entier positif ou d'un autre objet Date.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simule l’objet Date avec l’heure initiale', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // L'avance dans le temps fera également avancer la date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simule l’objet Date avec l’heure initiale', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // L'avance dans le temps fera également avancer la date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

Vous pouvez utiliser la méthode `.setTime()` pour déplacer manuellement la date simulée à une autre heure. Cette méthode n'accepte qu'un entier positif.

**Note :** Cette méthode exécutera tous les minuteurs simulés qui sont dans le passé à partir de la nouvelle heure.

Dans l'exemple ci-dessous, nous définissons une nouvelle heure pour la date simulée.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('définit l’heure d’un objet Date', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // L'avance dans le temps fera également avancer la date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('définit l’heure d’un objet Date', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // L'avance dans le temps fera également avancer la date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Si vous avez un minuteur qui est configuré pour s'exécuter dans le passé, il sera exécuté comme si la méthode `.tick()` avait été appelée. Ceci est utile si vous souhaitez tester une fonctionnalité dépendante du temps qui est déjà dans le passé.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('exécute les minuteurs lorsque setTime passe les tics', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Le minuteur n'est pas exécuté car l'heure n'est pas encore atteinte
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Le minuteur est exécuté car l'heure est maintenant atteinte
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('exécute les minuteurs lorsque setTime passe les tics', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Le minuteur n'est pas exécuté car l'heure n'est pas encore atteinte
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Le minuteur est exécuté car l'heure est maintenant atteinte
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

L'utilisation de `.runAll()` exécutera tous les minuteurs qui sont actuellement dans la file d'attente. Cela fera également avancer la date simulée à l'heure du dernier minuteur qui a été exécuté comme si le temps était passé.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('exécute les minuteurs lorsque setTime passe les tics', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Tous les minuteurs sont exécutés car l'heure est maintenant atteinte
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('exécute les minuteurs lorsque setTime passe les tics', (context) => {
  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Tous les minuteurs sont exécutés car l'heure est maintenant atteinte
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::


## Tests d'instantané {#snapshot-testing}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

Les tests d'instantané permettent de sérialiser des valeurs arbitraires en chaînes de caractères et de les comparer à un ensemble de valeurs de référence. Les valeurs de référence sont appelées instantanés et sont stockées dans un fichier d'instantané. Les fichiers d'instantané sont gérés par l'exécuteur de test, mais sont conçus pour être lisibles par l'homme afin de faciliter le débogage. La meilleure pratique consiste à archiver les fichiers d'instantané dans le système de contrôle de version avec vos fichiers de test.

Les fichiers d'instantané sont générés en démarrant Node.js avec l'indicateur de ligne de commande [`--test-update-snapshots`](/fr/nodejs/api/cli#--test-update-snapshots). Un fichier d'instantané distinct est généré pour chaque fichier de test. Par défaut, le fichier d'instantané porte le même nom que le fichier de test avec l'extension `.snapshot`. Ce comportement peut être configuré à l'aide de la fonction `snapshot.setResolveSnapshotPath()`. Chaque assertion d'instantané correspond à une exportation dans le fichier d'instantané.

Un exemple de test d'instantané est présenté ci-dessous. La première fois que ce test est exécuté, il échouera car le fichier d'instantané correspondant n'existe pas.

```js [ESM]
// test.js
suite('suite de tests d'instantané', () => {
  test('test d'instantané', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
Générez le fichier d'instantané en exécutant le fichier de test avec `--test-update-snapshots`. Le test doit réussir et un fichier nommé `test.js.snapshot` est créé dans le même répertoire que le fichier de test. Le contenu du fichier d'instantané est présenté ci-dessous. Chaque instantané est identifié par le nom complet du test et un compteur pour différencier les instantanés dans le même test.

```js [ESM]
exports[`suite de tests d'instantané > test d'instantané 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`suite de tests d'instantané > test d'instantané 2`] = `
5
`;
```
Une fois le fichier d'instantané créé, exécutez à nouveau les tests sans l'indicateur `--test-update-snapshots`. Les tests devraient maintenant réussir.


## Rapporteurs de test {#test-reporters}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.9.0, v18.17.0 | Les rapporteurs sont désormais exposés à `node:test/reporters`. |
| v19.6.0, v18.15.0 | Ajouté dans : v19.6.0, v18.15.0 |
:::

Le module `node:test` prend en charge le passage d'indicateurs [`--test-reporter`](/fr/nodejs/api/cli#--test-reporter) pour que l'exécuteur de tests utilise un rapporteur spécifique.

Les rapporteurs intégrés suivants sont pris en charge :

-  `spec` Le rapporteur `spec` affiche les résultats des tests dans un format lisible par l'homme. C'est le rapporteur par défaut.
-  `tap` Le rapporteur `tap` affiche les résultats des tests au format [TAP](https://testanything.org/).
-  `dot` Le rapporteur `dot` affiche les résultats des tests dans un format compact, où chaque test réussi est représenté par un `.`, et chaque test échoué est représenté par un `X`.
-  `junit` Le rapporteur junit affiche les résultats des tests au format XML jUnit
-  `lcov` Le rapporteur `lcov` affiche la couverture des tests lorsqu'il est utilisé avec l'indicateur [`--experimental-test-coverage`](/fr/nodejs/api/cli#--experimental-test-coverage).

La sortie exacte de ces rapporteurs est susceptible de changer entre les versions de Node.js, et ne doit pas être utilisée de manière programmatique. Si un accès programmatique à la sortie de l'exécuteur de tests est requis, utilisez les événements émis par la [\<TestsStream\>](/fr/nodejs/api/test#class-testsstream).

Les rapporteurs sont disponibles via le module `node:test/reporters` :

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### Rapporteurs personnalisés {#custom-reporters}

[`--test-reporter`](/fr/nodejs/api/cli#--test-reporter) peut être utilisé pour spécifier un chemin vers un rapporteur personnalisé. Un rapporteur personnalisé est un module qui exporte une valeur acceptée par [stream.compose](/fr/nodejs/api/stream#streamcomposestreams). Les rapporteurs doivent transformer les événements émis par une [\<TestsStream\>](/fr/nodejs/api/test#class-testsstream)

Exemple de rapporteur personnalisé utilisant [\<stream.Transform\>](/fr/nodejs/api/stream#class-streamtransform) :

::: code-group
```js [ESM]
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} mis en file d'attente`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} en file d'attente`);
        break;
      case 'test:watch:drained':
        callback(null, 'file d'attente de surveillance des tests vidée');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} démarré`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} réussi`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} échoué`);
        break;
      case 'test:plan':
        callback(null, 'plan de test');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `nombre total de lignes : ${totalLineCount}\n`);
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
        callback(null, `test ${event.data.name} mis en file d'attente`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} en file d'attente`);
        break;
      case 'test:watch:drained':
        callback(null, 'file d'attente de surveillance des tests vidée');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} démarré`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} réussi`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} échoué`);
        break;
      case 'test:plan':
        callback(null, 'plan de test');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `nombre total de lignes : ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```
:::

Exemple de rapporteur personnalisé utilisant une fonction de générateur :

::: code-group
```js [ESM]
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} mis en file d'attente\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} en file d'attente\n`;
        break;
      case 'test:watch:drained':
        yield 'file d'attente de surveillance des tests vidée\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} démarré\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} réussi\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} échoué\n`;
        break;
      case 'test:plan':
        yield 'plan de test\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `nombre total de lignes : ${totalLineCount}\n`;
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
        yield `test ${event.data.name} mis en file d'attente\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} en file d'attente\n`;
        break;
      case 'test:watch:drained':
        yield 'file d'attente de surveillance des tests vidée\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} démarré\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} réussi\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} échoué\n`;
        break;
      case 'test:plan':
        yield 'plan de test\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `nombre total de lignes : ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```
:::

La valeur fournie à `--test-reporter` doit être une chaîne de caractères telle que celle utilisée dans un `import()` dans le code JavaScript, ou une valeur fournie pour [`--import`](/fr/nodejs/api/cli#--importmodule).


### Plusieurs rapporteurs {#multiple-reporters}

L'option [`--test-reporter`](/fr/nodejs/api/cli#--test-reporter) peut être spécifiée plusieurs fois pour rapporter les résultats des tests dans plusieurs formats. Dans ce cas, il est nécessaire de spécifier une destination pour chaque rapporteur en utilisant [`--test-reporter-destination`](/fr/nodejs/api/cli#--test-reporter-destination). La destination peut être `stdout`, `stderr` ou un chemin de fichier. Les rapporteurs et les destinations sont appariés selon l'ordre dans lequel ils ont été spécifiés.

Dans l'exemple suivant, le rapporteur `spec` affichera les résultats sur `stdout`, et le rapporteur `dot` affichera les résultats dans `file.txt` :

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
Lorsqu'un seul rapporteur est spécifié, la destination est par défaut `stdout`, sauf si une destination est explicitement fournie.

## `run([options])` {#runoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Ajout de l'option `cwd`. |
| v23.0.0 | Ajout des options de couverture. |
| v22.8.0 | Ajout de l'option `isolation`. |
| v22.6.0 | Ajout de l'option `globPatterns`. |
| v22.0.0, v20.14.0 | Ajout de l'option `forceExit`. |
| v20.1.0, v18.17.0 | Ajout d'une option testNamePatterns. |
| v18.9.0, v16.19.0 | Ajout dans : v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour l'exécution des tests. Les propriétés suivantes sont prises en charge :
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si un nombre est fourni, ce nombre de processus de test s'exécutera en parallèle, chaque processus correspondant à un fichier de test. Si `true`, `os.availableParallelism() - 1` fichiers de test s'exécuteront en parallèle. Si `false`, un seul fichier de test sera exécuté à la fois. **Par défaut :** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie le répertoire de travail courant à utiliser par le lanceur de tests. Sert de chemin de base pour la résolution des fichiers selon le [modèle d'exécution du lanceur de tests](/fr/nodejs/api/test#test-runner-execution-model). **Par défaut :** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau contenant la liste des fichiers à exécuter. **Par défaut :** fichiers correspondants du [modèle d'exécution du lanceur de tests](/fr/nodejs/api/test#test-runner-execution-model).
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Configure le lanceur de tests pour qu'il quitte le processus une fois que tous les tests connus ont fini de s'exécuter, même si la boucle d'événements devrait autrement rester active. **Par défaut :** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau contenant la liste des modèles glob pour faire correspondre les fichiers de test. Cette option ne peut pas être utilisée avec `files`. **Par défaut :** fichiers correspondants du [modèle d'exécution du lanceur de tests](/fr/nodejs/api/test#test-runner-execution-model).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Définit le port de l'inspecteur du processus enfant de test. Cela peut être un nombre ou une fonction qui ne prend aucun argument et renvoie un nombre. Si une valeur nulle est fournie, chaque processus obtient son propre port, incrémenté à partir du `process.debugPort` du principal. Cette option est ignorée si l'option `isolation` est définie sur `'none'` car aucun processus enfant n'est créé. **Par défaut :** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Configure le type d'isolation des tests. Si elle est définie sur `'process'`, chaque fichier de test est exécuté dans un processus enfant séparé. Si elle est définie sur `'none'`, tous les fichiers de test sont exécutés dans le processus courant. **Par défaut :** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est vraie, le contexte de test n'exécutera que les tests qui ont l'option `only` définie.
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction qui accepte l'instance `TestsStream` et peut être utilisée pour configurer des écouteurs avant l'exécution des tests. **Par défaut :** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau d'options de ligne de commande à passer à l'exécutable `node` lors de la création des sous-processus. Cette option n'a aucun effet lorsque `isolation` est `'none'`. **Par défaut :** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau d'options de ligne de commande à passer à chaque fichier de test lors de la création des sous-processus. Cette option n'a aucun effet lorsque `isolation` est `'none'`. **Par défaut :** `[]`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d'abandonner une exécution de test en cours.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Une chaîne, une expression régulière ou un tableau d'expressions régulières, qui peut être utilisé pour n'exécuter que les tests dont le nom correspond au modèle fourni. Les modèles de nom de test sont interprétés comme des expressions régulières JavaScript. Pour chaque test exécuté, tous les hooks de test correspondants, tels que `beforeEach()`, sont également exécutés. **Par défaut :** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Une chaîne, une expression régulière ou un tableau d'expressions régulières, qui peut être utilisé pour exclure l'exécution des tests dont le nom correspond au modèle fourni. Les modèles de nom de test sont interprétés comme des expressions régulières JavaScript. Pour chaque test exécuté, tous les hooks de test correspondants, tels que `beforeEach()`, sont également exécutés. **Par défaut :** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel l'exécution du test échouera. Si elle n'est pas spécifiée, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique s'il faut exécuter en mode surveillance ou non. **Par défaut :** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Exécution des tests dans un fragment spécifique. **Par défaut :** `undefined`.
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) est un entier positif compris entre 1 et `\<total\>` qui spécifie l'index du fragment à exécuter. Cette option est *obligatoire*.
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) est un entier positif qui spécifie le nombre total de fragments dans lesquels diviser les fichiers de test. Cette option est *obligatoire*.

    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) activer la collecte de [couverture de code](/fr/nodejs/api/test#collecting-code-coverage). **Par défaut :** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Exclut des fichiers spécifiques de la couverture de code à l'aide d'un motif glob, qui peut correspondre aux chemins de fichiers absolus et relatifs. Cette propriété n'est applicable que si `coverage` a été défini sur `true`. Si `coverageExcludeGlobs` et `coverageIncludeGlobs` sont fournis, les fichiers doivent répondre aux **deux** critères pour être inclus dans le rapport de couverture. **Par défaut :** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Inclut des fichiers spécifiques dans la couverture de code à l'aide d'un motif glob, qui peut correspondre aux chemins de fichiers absolus et relatifs. Cette propriété n'est applicable que si `coverage` a été défini sur `true`. Si `coverageExcludeGlobs` et `coverageIncludeGlobs` sont fournis, les fichiers doivent répondre aux **deux** critères pour être inclus dans le rapport de couverture. **Par défaut :** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Exiger un pourcentage minimum de lignes couvertes. Si la couverture de code n'atteint pas le seuil spécifié, le processus se terminera avec le code `1`. **Par défaut :** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Exiger un pourcentage minimum de branches couvertes. Si la couverture de code n'atteint pas le seuil spécifié, le processus se terminera avec le code `1`. **Par défaut :** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Exiger un pourcentage minimum de fonctions couvertes. Si la couverture de code n'atteint pas le seuil spécifié, le processus se terminera avec le code `1`. **Par défaut :** `0`.

- Retourne : [\<TestsStream\>](/fr/nodejs/api/test#class-testsstream)

**Remarque :** `shard` est utilisé pour paralléliser horizontalement l'exécution des tests sur plusieurs machines ou processus, ce qui est idéal pour les exécutions à grande échelle dans des environnements variés. Il est incompatible avec le mode `watch`, conçu pour une itération rapide du code en réexécutant automatiquement les tests lors des modifications de fichiers.

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

**Ajouté dans : v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom de la suite, qui est affiché lors de la communication des résultats des tests. **Par défaut :** La propriété `name` de `fn`, ou `'\<anonymous\>'` si `fn` n’a pas de nom.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration facultatives pour la suite. Cela prend en charge les mêmes options que `test([name][, options][, fn])`.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de suite déclarant les tests et suites imbriqués. Le premier argument de cette fonction est un objet [`SuiteContext`](/fr/nodejs/api/test#class-suitecontext). **Par défaut :** Une fonction no-op.
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Immédiatement résolue avec `undefined`.

La fonction `suite()` est importée du module `node:test`.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**Ajouté dans : v22.0.0, v20.13.0**

Raccourci pour ignorer une suite. Ceci est identique à [`suite([name], { skip: true }[, fn])`](/fr/nodejs/api/test#suitename-options-fn).

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**Ajouté dans : v22.0.0, v20.13.0**

Raccourci pour marquer une suite comme `TODO`. Ceci est identique à [`suite([name], { todo: true }[, fn])`](/fr/nodejs/api/test#suitename-options-fn).

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**Ajouté dans : v22.0.0, v20.13.0**

Raccourci pour marquer une suite comme `only`. Ceci est identique à [`suite([name], { only: true }[, fn])`](/fr/nodejs/api/test#suitename-options-fn).

## `test([name][, options][, fn])` {#testname-options-fn}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.2.0, v18.17.0 | Ajout des raccourcis `skip`, `todo` et `only`. |
| v18.8.0, v16.18.0 | Ajout d’une option `signal`. |
| v18.7.0, v16.17.0 | Ajout d’une option `timeout`. |
| v18.0.0, v16.17.0 | Ajouté dans : v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du test, qui est affiché lors de la communication des résultats des tests. **Par défaut :** La propriété `name` de `fn`, ou `'\<anonymous\>'` si `fn` n’a pas de nom.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le test. Les propriétés suivantes sont prises en charge :
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si un nombre est fourni, ce nombre de tests s’exécutera en parallèle dans le thread d’application. Si `true`, tous les tests asynchrones planifiés s’exécutent simultanément dans le thread. Si `false`, un seul test s’exécute à la fois. Si non spécifié, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `false`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est truthy et que le contexte de test est configuré pour exécuter uniquement les tests `only`, ce test sera exécuté. Sinon, le test est ignoré. **Par défaut :** `false`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un test en cours.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si truthy, le test est ignoré. Si une chaîne est fournie, cette chaîne est affichée dans les résultats du test comme raison d’ignorer le test. **Par défaut :** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si truthy, le test est marqué comme `TODO`. Si une chaîne est fournie, cette chaîne est affichée dans les résultats du test comme raison pour laquelle le test est `TODO`. **Par défaut :** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel le test échouera. Si non spécifié, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d’assertions et de sous-tests attendus à exécuter dans le test. Si le nombre d’assertions exécutées dans le test ne correspond pas au nombre spécifié dans le plan, le test échouera. **Par défaut :** `undefined`.

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction testée. Le premier argument de cette fonction est un objet [`TestContext`](/fr/nodejs/api/test#class-testcontext). Si le test utilise des rappels, la fonction de rappel est transmise comme deuxième argument. **Par défaut :** Une fonction no-op.
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Résolue avec `undefined` une fois le test terminé, ou immédiatement si le test s’exécute dans une suite.

La fonction `test()` est la valeur importée du module `test`. Chaque invocation de cette fonction entraîne le signalement du test au [\<TestsStream\>](/fr/nodejs/api/test#class-testsstream).

L’objet `TestContext` transmis à l’argument `fn` peut être utilisé pour effectuer des actions liées au test actuel. Les exemples incluent l’ignorance du test, l’ajout d’informations de diagnostic supplémentaires ou la création de sous-tests.

`test()` renvoie une `Promise` qui se réalise une fois le test terminé. si `test()` est appelé dans une suite, elle se réalise immédiatement. La valeur de retour peut généralement être ignorée pour les tests de niveau supérieur. Cependant, la valeur de retour des sous-tests doit être utilisée pour empêcher le test parent de se terminer en premier et d’annuler le sous-test, comme indiqué dans l’exemple suivant.

```js [ESM]
test('top level test', async (t) => {
  // The setTimeout() in the following subtest would cause it to outlive its
  // parent test if 'await' is removed on the next line. Once the parent test
  // completes, it will cancel any outstanding subtests.
  await t.test('longer running subtest', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
L’option `timeout` peut être utilisée pour faire échouer le test s’il prend plus de `timeout` millisecondes. Cependant, ce n’est pas un mécanisme fiable pour annuler les tests, car un test en cours d’exécution peut bloquer le thread d’application et ainsi empêcher l’annulation planifiée.


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

Abréviation pour ignorer un test, identique à [`test([name], { skip: true }[, fn])`](/fr/nodejs/api/test#testname-options-fn).

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

Abréviation pour marquer un test comme `TODO`, identique à [`test([name], { todo: true }[, fn])`](/fr/nodejs/api/test#testname-options-fn).

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

Abréviation pour marquer un test comme `only`, identique à [`test([name], { only: true }[, fn])`](/fr/nodejs/api/test#testname-options-fn).

## `describe([name][, options][, fn])` {#describename-options-fn}

Alias pour [`suite()`](/fr/nodejs/api/test#suitename-options-fn).

La fonction `describe()` est importée depuis le module `node:test`.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

Abréviation pour ignorer une suite de tests. Ceci est identique à [`describe([name], { skip: true }[, fn])`](/fr/nodejs/api/test#describename-options-fn).

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

Abréviation pour marquer une suite de tests comme `TODO`. Ceci est identique à [`describe([name], { todo: true }[, fn])`](/fr/nodejs/api/test#describename-options-fn).

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**Ajouté dans : v19.8.0, v18.15.0**

Abréviation pour marquer une suite de tests comme `only`. Ceci est identique à [`describe([name], { only: true }[, fn])`](/fr/nodejs/api/test#describename-options-fn).

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.8.0, v18.16.0 | Appeler `it()` est maintenant équivalent à appeler `test()`. |
| v18.6.0, v16.17.0 | Ajouté dans : v18.6.0, v16.17.0 |
:::

Alias pour [`test()`](/fr/nodejs/api/test#testname-options-fn).

La fonction `it()` est importée depuis le module `node:test`.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

Abréviation pour ignorer un test, identique à [`it([name], { skip: true }[, fn])`](/fr/nodejs/api/test#testname-options-fn).

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

Abréviation pour marquer un test comme `TODO`, identique à [`it([name], { todo: true }[, fn])`](/fr/nodejs/api/test#testname-options-fn).

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**Ajouté dans : v19.8.0, v18.15.0**

Abréviation pour marquer un test comme `only`, identique à [`it([name], { only: true }[, fn])`](/fr/nodejs/api/test#testname-options-fn).


## `before([fn][, options])` {#beforefn-options}

**Ajouté dans : v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de hook. Si le hook utilise des rappels (callbacks), la fonction de rappel est passée comme deuxième argument. **Par défaut :** Une fonction no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le hook. Les propriétés suivantes sont prises en charge :
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un hook en cours.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel le hook échouera. S’il n’est pas spécifié, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.
  
 

Cette fonction crée un hook qui s’exécute avant l’exécution d’une suite.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('sur le point d\'exécuter un test'));
  it('est un sous-test', () => {
    assert.ok('une assertion pertinente ici');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Ajouté dans : v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de hook. Si le hook utilise des rappels (callbacks), la fonction de rappel est passée comme deuxième argument. **Par défaut :** Une fonction no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le hook. Les propriétés suivantes sont prises en charge :
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un hook en cours.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel le hook échouera. S’il n’est pas spécifié, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.
  
 

Cette fonction crée un hook qui s’exécute après l’exécution d’une suite.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('exécution des tests terminée'));
  it('est un sous-test', () => {
    assert.ok('une assertion pertinente ici');
  });
});
```
**Remarque :** Le hook `after` est garanti d’être exécuté, même si les tests au sein de la suite échouent.


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Ajouté dans : v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de hook. Si le hook utilise des rappels, la fonction de rappel est passée en deuxième argument. **Par défaut :** Une fonction no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le hook. Les propriétés suivantes sont prises en charge :
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un hook en cours.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel le hook échouera. Si elle n’est pas spécifiée, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.
  
 

Cette fonction crée un hook qui s’exécute avant chaque test dans la suite actuelle.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Ajouté dans : v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de hook. Si le hook utilise des rappels, la fonction de rappel est passée en deuxième argument. **Par défaut :** Une fonction no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le hook. Les propriétés suivantes sont prises en charge :
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un hook en cours.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel le hook échouera. Si elle n’est pas spécifiée, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.
  
 

Cette fonction crée un hook qui s’exécute après chaque test dans la suite actuelle. Le hook `afterEach()` est exécuté même si le test échoue.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**Ajouté dans: v22.3.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

Un objet dont les méthodes sont utilisées pour configurer les paramètres de snapshot par défaut dans le processus actuel. Il est possible d'appliquer la même configuration à tous les fichiers en plaçant le code de configuration commun dans un module préchargé avec `--require` ou `--import`.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**Ajouté dans: v22.3.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau de fonctions synchrones utilisées comme sérialiseurs par défaut pour les tests de snapshot.

Cette fonction est utilisée pour personnaliser le mécanisme de sérialisation par défaut utilisé par l'exécuteur de tests. Par défaut, l'exécuteur de tests effectue la sérialisation en appelant `JSON.stringify(value, null, 2)` sur la valeur fournie. `JSON.stringify()` a des limitations concernant les structures circulaires et les types de données pris en charge. Si un mécanisme de sérialisation plus robuste est requis, cette fonction doit être utilisée.

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**Ajouté dans: v22.3.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction utilisée pour calculer l'emplacement du fichier de snapshot. La fonction reçoit le chemin du fichier de test comme seul argument. Si le test n'est pas associé à un fichier (par exemple dans le REPL), l'entrée est indéfinie. `fn()` doit renvoyer une chaîne spécifiant l'emplacement du fichier de snapshot.

Cette fonction est utilisée pour personnaliser l'emplacement du fichier de snapshot utilisé pour les tests de snapshot. Par défaut, le nom de fichier du snapshot est le même que le nom de fichier du point d'entrée avec une extension de fichier `.snapshot`.


## Classe : `MockFunctionContext` {#class-mockfunctioncontext}

**Ajoutée dans : v19.1.0, v18.13.0**

La classe `MockFunctionContext` est utilisée pour inspecter ou manipuler le comportement des mocks créés via les API [`MockTracker`](/fr/nodejs/api/test#class-mocktracker).

### `ctx.calls` {#ctxcalls}

**Ajoutée dans : v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un getter qui renvoie une copie du tableau interne utilisé pour suivre les appels au mock. Chaque entrée du tableau est un objet avec les propriétés suivantes.

- `arguments` [\<Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau des arguments passés à la fonction mockée.
- `error` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Si la fonction mockée a levé une exception, cette propriété contient la valeur levée. **Par défaut :** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La valeur renvoyée par la fonction mockée.
- `stack` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) Un objet `Error` dont la pile peut être utilisée pour déterminer le site d’appel de l’invocation de la fonction mockée.
- `target` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Si la fonction mockée est un constructeur, ce champ contient la classe en cours de construction. Sinon, il sera `undefined`.
- `this` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La valeur `this` de la fonction mockée.

### `ctx.callCount()` {#ctxcallcount}

**Ajoutée dans : v19.1.0, v18.13.0**

- Renvoie : [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fois où ce mock a été invoqué.

Cette fonction renvoie le nombre de fois où ce mock a été invoqué. Cette fonction est plus efficace que de vérifier `ctx.calls.length`, car `ctx.calls` est un getter qui crée une copie du tableau interne de suivi des appels.


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**Ajouté dans : v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction à utiliser comme nouvelle implémentation du mock.

Cette fonction est utilisée pour modifier le comportement d'un mock existant.

L'exemple suivant crée une fonction mock à l'aide de `t.mock.fn()`, appelle la fonction mock, puis modifie l'implémentation du mock par une fonction différente.

```js [ESM]
test('modifie le comportement d\'un mock', (t) => {
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

**Ajouté dans : v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction à utiliser comme implémentation du mock pour le numéro d'appel spécifié par `onCall`.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro d'appel qui utilisera `implementation`. Si l'appel spécifié a déjà eu lieu, une exception est levée. **Par défaut :** Le numéro de l'appel suivant.

Cette fonction est utilisée pour modifier le comportement d'un mock existant pour un seul appel. Une fois l'appel `onCall` effectué, le mock reviendra au comportement qu'il aurait utilisé si `mockImplementationOnce()` n'avait pas été appelé.

L'exemple suivant crée une fonction mock à l'aide de `t.mock.fn()`, appelle la fonction mock, modifie l'implémentation du mock par une fonction différente pour l'appel suivant, puis reprend son comportement précédent.

```js [ESM]
test('modifie le comportement d\'un mock une seule fois', (t) => {
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

**Ajouté dans : v19.3.0, v18.13.0**

Réinitialise l’historique des appels de la fonction mock.

### `ctx.restore()` {#ctxrestore}

**Ajouté dans : v19.1.0, v18.13.0**

Réinitialise l’implémentation de la fonction mock à son comportement original. Le mock peut toujours être utilisé après avoir appelé cette fonction.

## Class: `MockModuleContext` {#class-mockmodulecontext}

**Ajouté dans : v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

La classe `MockModuleContext` est utilisée pour manipuler le comportement des mocks de modules créés via les API [`MockTracker`](/fr/nodejs/api/test#class-mocktracker).

### `ctx.restore()` {#ctxrestore_1}

**Ajouté dans : v22.3.0, v20.18.0**

Réinitialise l’implémentation du module mock.

## Class: `MockTracker` {#class-mocktracker}

**Ajouté dans : v19.1.0, v18.13.0**

La classe `MockTracker` est utilisée pour gérer la fonctionnalité de mocking. Le module d’exécution de test fournit une exportation `mock` de niveau supérieur qui est une instance `MockTracker`. Chaque test fournit également sa propre instance `MockTracker` via la propriété `mock` du contexte de test.

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**Ajouté dans : v19.1.0, v18.13.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Une fonction optionnelle pour créer un mock sur. **Par défaut :** Une fonction no-op.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Une fonction optionnelle utilisée comme implémentation de mock pour `original`. Ceci est utile pour créer des mocks qui présentent un comportement pendant un nombre spécifié d’appels, puis restaurer le comportement de `original`. **Par défaut :** La fonction spécifiée par `original`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration facultatives pour la fonction mock. Les propriétés suivantes sont prises en charge :
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fois où le mock utilisera le comportement de `implementation`. Une fois que la fonction mock a été appelée `times` fois, elle restaurera automatiquement le comportement de `original`. Cette valeur doit être un entier supérieur à zéro. **Par défaut :** `Infinity`.


- Retourne : [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) La fonction mockée. La fonction mockée contient une propriété spéciale `mock`, qui est une instance de [`MockFunctionContext`](/fr/nodejs/api/test#class-mockfunctioncontext), et peut être utilisée pour inspecter et modifier le comportement de la fonction mockée.

Cette fonction est utilisée pour créer une fonction mock.

L’exemple suivant crée une fonction mock qui incrémente un compteur de un à chaque invocation. L’option `times` est utilisée pour modifier le comportement du mock de telle sorte que les deux premières invocations ajoutent deux au compteur au lieu de un.

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

**Ajouté dans : v19.3.0, v18.13.0**

Cette fonction est un sucre syntaxique pour [`MockTracker.method`](/fr/nodejs/api/test#mockmethodobject-methodname-implementation-options) avec `options.getter` défini sur `true`.

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**Ajouté dans : v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L’objet dont la méthode est simulée.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) L’identifiant de la méthode sur `object` à simuler. Si `object[methodName]` n’est pas une fonction, une erreur est levée.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Une fonction optionnelle utilisée comme implémentation de simulation pour `object[methodName]`. **Par défaut :** La méthode originale spécifiée par `object[methodName]`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration optionnelles pour la méthode simulée. Les propriétés suivantes sont prises en charge :
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, `object[methodName]` est traité comme un getter. Cette option ne peut pas être utilisée avec l’option `setter`. **Par défaut :** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, `object[methodName]` est traité comme un setter. Cette option ne peut pas être utilisée avec l’option `getter`. **Par défaut :** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fois que le mock utilisera le comportement de `implementation`. Une fois que la méthode simulée a été appelée `times` fois, elle restaurera automatiquement le comportement original. Cette valeur doit être un entier supérieur à zéro. **Par défaut :** `Infinity`.
  
 
- Retourne : [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) La méthode simulée. La méthode simulée contient une propriété spéciale `mock`, qui est une instance de [`MockFunctionContext`](/fr/nodejs/api/test#class-mockfunctioncontext), et peut être utilisée pour inspecter et modifier le comportement de la méthode simulée.

Cette fonction est utilisée pour créer un mock sur une méthode d’objet existante. L’exemple suivant montre comment un mock est créé sur une méthode d’objet existante.

```js [ESM]
test('espionne une méthode d’objet', (t) => {
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

**Ajouté dans : v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable : 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Une chaîne identifiant le module à simuler.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration facultatives pour le module simulé. Les propriétés suivantes sont prises en charge :
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `false`, chaque appel à `require()` ou `import()` génère un nouveau module simulé. Si `true`, les appels suivants renverront le même module simulé, et le module simulé est inséré dans le cache CommonJS. **Par défaut :** false.
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Une valeur facultative utilisée comme exportation par défaut du module simulé. Si cette valeur n’est pas fournie, les simulations ESM n’incluent pas d’exportation par défaut. Si la simulation est un module CommonJS ou intégré, ce paramètre est utilisé comme valeur de `module.exports`. Si cette valeur n’est pas fournie, les simulations CJS et intégrées utilisent un objet vide comme valeur de `module.exports`.
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet facultatif dont les clés et les valeurs sont utilisées pour créer les exportations nommées du module simulé. Si la simulation est un module CommonJS ou intégré, ces valeurs sont copiées sur `module.exports`. Par conséquent, si une simulation est créée avec à la fois des exportations nommées et une exportation par défaut non-objet, la simulation lèvera une exception lorsqu’elle sera utilisée comme module CJS ou intégré.
  
 
- Retourne : [\<MockModuleContext\>](/fr/nodejs/api/test#class-mockmodulecontext) Un objet qui peut être utilisé pour manipuler la simulation.

Cette fonction est utilisée pour simuler les exportations des modules ECMAScript, des modules CommonJS et des modules intégrés Node.js. Toutes les références au module original avant la simulation ne sont pas affectées. Afin d’activer la simulation de module, Node.js doit être démarré avec l’indicateur de ligne de commande [`--experimental-test-module-mocks`](/fr/nodejs/api/cli#--experimental-test-module-mocks).

L’exemple suivant montre comment une simulation est créée pour un module.

```js [ESM]
test('simule un module intégré dans les deux systèmes de module', async (t) => {
  // Crée une simulation de 'node:readline' avec une exportation nommée 'fn', qui
  // n’existe pas dans le module original 'node:readline'.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() est une exportation du module original 'node:readline'.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // La simulation est restaurée, donc le module intégré original est retourné.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**Ajouté dans : v19.1.0, v18.13.0**

Cette fonction restaure le comportement par défaut de toutes les simulations qui ont été précédemment créées par ce `MockTracker` et dissocie les simulations de l’instance `MockTracker`. Une fois dissociées, les simulations peuvent toujours être utilisées, mais l’instance `MockTracker` ne peut plus être utilisée pour réinitialiser leur comportement ou interagir avec elles de quelque manière que ce soit.

Une fois chaque test terminé, cette fonction est appelée sur le `MockTracker` du contexte de test. Si le `MockTracker` global est largement utilisé, il est recommandé d’appeler cette fonction manuellement.

### `mock.restoreAll()` {#mockrestoreall}

**Ajouté dans : v19.1.0, v18.13.0**

Cette fonction restaure le comportement par défaut de toutes les simulations qui ont été précédemment créées par ce `MockTracker`. Contrairement à `mock.reset()`, `mock.restoreAll()` ne dissocie pas les simulations de l’instance `MockTracker`.

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**Ajouté dans : v19.3.0, v18.13.0**

Cette fonction est un sucre syntaxique pour [`MockTracker.method`](/fr/nodejs/api/test#mockmethodobject-methodname-implementation-options) avec `options.setter` défini sur `true`.

## Classe : `MockTimers` {#class-mocktimers}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.1.0 | Les Mock Timers sont désormais stables. |
| v20.4.0, v18.19.0 | Ajouté dans : v20.4.0, v18.19.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

La simulation de timers est une technique couramment utilisée dans les tests logiciels pour simuler et contrôler le comportement des timers, tels que `setInterval` et `setTimeout`, sans réellement attendre les intervalles de temps spécifiés.

MockTimers est également capable de simuler l’objet `Date`.

Le [`MockTracker`](/fr/nodejs/api/test#class-mocktracker) fournit une exportation `timers` de niveau supérieur qui est une instance `MockTimers`.

### `timers.enable([enableOptions])` {#timersenableenableoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.2.0, v20.11.0 | Paramètres mis à jour pour être un objet d’options avec les API disponibles et l’époque initiale par défaut. |
| v20.4.0, v18.19.0 | Ajouté dans : v20.4.0, v18.19.0 |
:::

Active la simulation de timers pour les timers spécifiés.

- `enableOptions` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration facultatives pour activer la simulation de timers. Les propriétés suivantes sont prises en charge :
    - `apis` [\<Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau facultatif contenant les timers à simuler. Les valeurs de timer actuellement prises en charge sont `'setInterval'`, `'setTimeout'`, `'setImmediate'` et `'Date'`. **Par défaut :** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. Si aucun tableau n’est fourni, toutes les API liées au temps (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, `'clearImmediate'` et `'Date'`) seront simulées par défaut.
    - `now` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Date) Un nombre ou un objet Date facultatif représentant l’heure initiale (en millisecondes) à utiliser comme valeur pour `Date.now()`. **Par défaut :** `0`.

**Remarque :** Lorsque vous activez la simulation pour un timer spécifique, sa fonction de suppression associée sera également simulée implicitement.

**Remarque :** La simulation de `Date` affectera le comportement des timers simulés car ils utilisent la même horloge interne.

Exemple d’utilisation sans définir l’heure initiale :

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

L’exemple ci-dessus active la simulation pour le timer `setInterval` et simule implicitement la fonction `clearInterval`. Seules les fonctions `setInterval` et `clearInterval` de [node:timers](/fr/nodejs/api/timers), [node:timers/promises](/fr/nodejs/api/timers#timers-promises-api) et `globalThis` seront simulées.

Exemple d’utilisation avec l’heure initiale définie

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

Exemple d’utilisation avec un objet Date initial comme heure définie

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

Sinon, si vous appelez `mock.timers.enable()` sans aucun paramètre :

Tous les timers (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` et `'clearImmediate'`) seront simulés. Les fonctions `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate` et `clearImmediate` de `node:timers`, `node:timers/promises` et `globalThis` seront simulées. Ainsi que l’objet `Date` global.


### `timers.reset()` {#timersreset}

**Ajouté dans : v20.4.0, v18.19.0**

Cette fonction restaure le comportement par défaut de toutes les simulations qui ont été précédemment créées par cette instance `MockTimers` et dissocie les simulations de l’instance `MockTracker`.

**Note :** Après chaque fin de test, cette fonction est appelée sur le `MockTracker` du contexte de test.

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

Appelle `timers.reset()`.

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**Ajouté dans : v20.4.0, v18.19.0**

Avance le temps pour tous les minuteurs simulés.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le temps, en millisecondes, d’avancer les minuteurs. **Par défaut :** `1`.

**Note :** Ceci diffère du comportement de `setTimeout` dans Node.js et accepte uniquement les nombres positifs. Dans Node.js, `setTimeout` avec des nombres négatifs n’est pris en charge que pour des raisons de compatibilité web.

L’exemple suivant simule une fonction `setTimeout` et, en utilisant `.tick`, avance dans le temps en déclenchant tous les minuteurs en attente.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simule setTimeout pour qu’il soit exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Avancer dans le temps
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simule setTimeout pour qu’il soit exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avancer dans le temps
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Alternativement, la fonction `.tick` peut être appelée plusieurs fois

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simule setTimeout pour qu’il soit exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
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

test('simule setTimeout pour qu’il soit exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
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

Avancer dans le temps en utilisant `.tick` avancera également dans le temps pour tout objet `Date` créé après l’activation de la simulation (si `Date` a également été défini pour être simulé).

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simule setTimeout pour qu’il soit exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Avancer dans le temps
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simule setTimeout pour qu’il soit exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Avancer dans le temps
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::


#### Utilisation des fonctions clear {#using-clear-functions}

Comme mentionné, toutes les fonctions clear des minuteurs (`clearTimeout`, `clearInterval` et `clearImmediate`) sont implicitement simulées. Regardez cet exemple utilisant `setTimeout` :

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simule setTimeout pour être exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
  const fn = context.mock.fn();

  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitement simulé également
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // Étant donné que setTimeout a été effacé, la fonction simulée ne sera jamais appelée
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simule setTimeout pour être exécuté de manière synchrone sans avoir à attendre réellement', (context) => {
  const fn = context.mock.fn();

  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitement simulé également
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // Étant donné que setTimeout a été effacé, la fonction simulée ne sera jamais appelée
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### Travailler avec les modules de minuteurs Node.js {#working-with-nodejs-timers-modules}

Une fois que vous avez activé la simulation des minuteurs, les modules [node:timers](/fr/nodejs/api/timers), [node:timers/promises](/fr/nodejs/api/timers#timers-promises-api) et les minuteurs du contexte global Node.js sont activés :

**Remarque :** La déstructuration des fonctions telles que `import { setTimeout } from 'node:timers'` n’est actuellement pas prise en charge par cette API.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('simule setTimeout pour être exécuté de manière synchrone sans avoir à attendre réellement', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Avance dans le temps
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

test('simule setTimeout pour être exécuté de manière synchrone sans avoir à attendre réellement', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Choisissez éventuellement ce qu'il faut simuler
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Avance dans le temps
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

Dans Node.js, `setInterval` de [node:timers/promises](/fr/nodejs/api/timers#timers-promises-api) est un `AsyncGenerator` et est également pris en charge par cette API :

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('devrait cocher cinq fois en testant un cas d’utilisation réel', async (context) => {
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
test('devrait cocher cinq fois en testant un cas d’utilisation réel', async (context) => {
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

**Ajouté dans : v20.4.0, v18.19.0**

Déclenche immédiatement tous les temporisateurs simulés en attente. Si l’objet `Date` est également simulé, il avancera également l’objet `Date` à l’heure du temporisateur le plus éloigné.

L’exemple ci-dessous déclenche immédiatement tous les temporisateurs en attente, ce qui les fait s’exécuter sans délai.

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

**Note :** La fonction `runAll()` est spécialement conçue pour déclencher les temporisateurs dans le contexte de la simulation de temporisateur. Elle n’a aucun effet sur les horloges système en temps réel ou les temporisateurs réels en dehors de l’environnement de simulation.

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**Ajouté dans : v21.2.0, v20.11.0**

Définit l’horodatage Unix actuel qui sera utilisé comme référence pour tous les objets `Date` simulés.

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


#### Dates et minuteurs travaillant ensemble {#dates-and-timers-working-together}

Les dates et les objets minuteurs sont dépendants les uns des autres. Si vous utilisez `setTime()` pour passer l'heure actuelle à l'objet `Date` simulé, les minuteurs définis avec `setTimeout` et `setInterval` ne seront **pas** affectés.

Cependant, la méthode `tick` **fera** avancer l'objet `Date` simulé.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('exécuter toutes les fonctions dans l\'ordre donné', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // La date est avancée mais les minuteurs ne s'égrènent pas
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('exécuter toutes les fonctions dans l\'ordre donné', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // La date est avancée mais les minuteurs ne s'égrènent pas
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## Classe : `TestsStream` {#class-testsstream}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | type ajouté aux événements test :pass et test :fail lorsque le test est une suite. |
| v18.9.0, v16.19.0 | Ajouté dans : v18.9.0, v16.19.0 |
:::

- Étend [\<Readable\>](/fr/nodejs/api/stream#class-streamreadable)

Un appel réussi à la méthode [`run()`](/fr/nodejs/api/test#runoptions) renverra un nouvel objet [\<TestsStream\>](/fr/nodejs/api/test#class-testsstream), diffusant en continu une série d'événements représentant l'exécution des tests. `TestsStream` émettra des événements, dans l'ordre de la définition des tests.

Certains événements sont garantis d'être émis dans le même ordre que les tests sont définis, tandis que d'autres sont émis dans l'ordre dans lequel les tests s'exécutent.


### Événement : `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet contenant le rapport de couverture.
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau de rapports de couverture pour les fichiers individuels. Chaque rapport est un objet avec le schéma suivant :
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin absolu du fichier.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de lignes.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de branches.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de fonctions.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de lignes couvertes.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de branches couvertes.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fonctions couvertes.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le pourcentage de lignes couvertes.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le pourcentage de branches couvertes.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le pourcentage de fonctions couvertes.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau de fonctions représentant la couverture des fonctions.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom de la fonction.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro de la ligne où la fonction est définie.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fois que la fonction a été appelée.

    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau de branches représentant la couverture des branches.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro de la ligne où la branche est définie.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fois que la branche a été empruntée.

    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau de lignes représentant les numéros de ligne et le nombre de fois qu'elles ont été couvertes.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro de ligne.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fois que la ligne a été couverte.

    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet indiquant si la couverture pour chaque type de couverture a été atteinte.
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le seuil de couverture des fonctions.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le seuil de couverture des branches.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le seuil de couverture des lignes.

    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet contenant un résumé de la couverture pour tous les fichiers.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de lignes.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de branches.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de fonctions.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de lignes couvertes.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de branches couvertes.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fonctions couvertes.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le pourcentage de lignes couvertes.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le pourcentage de branches couvertes.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le pourcentage de fonctions couvertes.

    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le répertoire de travail lorsque la couverture du code a commencé. Ceci est utile pour afficher les noms de chemin relatifs au cas où les tests auraient modifié le répertoire de travail du processus Node.js.

    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d'imbrication du test.

Émis lorsque la couverture du code est activée et que tous les tests sont terminés.


### Événement: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de la colonne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Métadonnées d'exécution supplémentaires.
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le test a réussi ou non.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durée du test en millisecondes.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Une erreur encapsulant l'erreur levée par le test s'il n'a pas réussi.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'erreur réelle levée par le test.

    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le type de test, utilisé pour indiquer s'il s'agit d'une suite.

    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin du fichier de test, `undefined` si le test a été exécuté via le REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de ligne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d'imbrication du test.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro d'ordre du test.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Présent si [`context.todo`](/fr/nodejs/api/test#contexttodomessage) est appelé
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Présent si [`context.skip`](/fr/nodejs/api/test#contextskipmessage) est appelé

Émis lorsqu'un test termine son exécution. Cet événement n'est pas émis dans le même ordre que les tests sont définis. Les événements de déclaration ordonnés correspondants sont `'test:pass'` et `'test:fail'`.


### Événement : `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de la colonne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin d’accès au fichier de test, `undefined` si le test a été exécuté via le REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de la ligne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d’imbrication du test.
  
 

Émis lorsqu’un test est retiré de la file d’attente, juste avant son exécution. Il n’est pas garanti que cet événement soit émis dans le même ordre que les tests sont définis. L’événement ordonné de déclaration correspondant est `'test:start'`.

### Événement : `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de la colonne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin d’accès au fichier de test, `undefined` si le test a été exécuté via le REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de la ligne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le message de diagnostic.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d’imbrication du test.
  
 

Émis lorsque [`context.diagnostic`](/fr/nodejs/api/test#contextdiagnosticmessage) est appelé. Il est garanti que cet événement sera émis dans le même ordre que les tests sont définis.


### Événement : `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de colonne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin du fichier de test, `undefined` si le test a été exécuté via le REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de ligne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d'imbrication du test.
  
 

Émis lorsqu'un test est mis en file d'attente pour l'exécution.

### Événement : `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de colonne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Métadonnées d'exécution supplémentaires.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durée du test en millisecondes.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Une erreur encapsulant l'erreur lancée par le test.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'erreur réelle lancée par le test.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le type du test, utilisé pour indiquer s'il s'agit d'une suite.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin du fichier de test, `undefined` si le test a été exécuté via le REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de ligne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d'imbrication du test.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro d'ordre du test.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Présent si [`context.todo`](/fr/nodejs/api/test#contexttodomessage) est appelé
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Présent si [`context.skip`](/fr/nodejs/api/test#contextskipmessage) est appelé
  
 

Émis lorsqu'un test échoue. Cet événement est garanti d'être émis dans le même ordre que les tests sont définis. L'événement d'exécution correspondant est `'test:complete'`.


### Événement : `'test:pass'` {#event-testpass}

- `data` [\<Objet\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<nombre\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) | [\<indéfini\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de colonne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `details` [\<Objet\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Métadonnées d’exécution supplémentaires.
    - `duration_ms` [\<nombre\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) La durée du test en millisecondes.
    - `type` [\<chaîne de caractères\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<indéfini\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Le type du test, utilisé pour indiquer s’il s’agit d’une suite.


    - `file` [\<chaîne de caractères\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<indéfini\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin du fichier de test, `undefined` si le test a été exécuté via le REPL.
    - `line` [\<nombre\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) | [\<indéfini\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de ligne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `name` [\<chaîne de caractères\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Le nom du test.
    - `nesting` [\<nombre\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d’imbrication du test.
    - `testNumber` [\<nombre\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le numéro d’ordre du test.
    - `todo` [\<chaîne de caractères\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<booléen\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<indéfini\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Présent si [`context.todo`](/fr/nodejs/api/test#contexttodomessage) est appelé
    - `skip` [\<chaîne de caractères\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<booléen\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<indéfini\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Présent si [`context.skip`](/fr/nodejs/api/test#contextskipmessage) est appelé



Émis lorsqu’un test réussit. Cet événement est garanti d’être émis dans le même ordre que les tests sont définis. L’événement ordonné d’exécution correspondant est `'test:complete'`.


### Événement : `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de colonne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin d'accès au fichier de test, `undefined` si le test a été exécuté via le REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de ligne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d'imbrication du test.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de sous-tests qui ont été exécutés.
  
 

Émis lorsque tous les sous-tests d'un test donné sont terminés. Cet événement est garanti d'être émis dans le même ordre que les tests sont définis.

### Événement : `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de colonne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin d'accès au fichier de test, `undefined` si le test a été exécuté via le REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le numéro de ligne où le test est défini, ou `undefined` si le test a été exécuté via le REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le niveau d'imbrication du test.
  
 

Émis lorsqu'un test commence à signaler son propre statut et celui de ses sous-tests. Cet événement est garanti d'être émis dans le même ordre que les tests sont définis. L'événement ordonné d'exécution correspondant est `'test:dequeue'`.


### Événement : `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin d'accès au fichier de test.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le message écrit dans `stderr`.

 

Émis lorsqu'un test en cours d'exécution écrit dans `stderr`. Cet événement n'est émis que si l'indicateur `--test` est passé. Il n'est pas garanti que cet événement soit émis dans le même ordre que celui dans lequel les tests sont définis.

### Événement : `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin d'accès au fichier de test.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le message écrit dans `stdout`.

 

Émis lorsqu'un test en cours d'exécution écrit dans `stdout`. Cet événement n'est émis que si l'indicateur `--test` est passé. Il n'est pas garanti que cet événement soit émis dans le même ordre que celui dans lequel les tests sont définis.

### Événement : `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet contenant les nombres des différents résultats de test.
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de tests annulés.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de tests ayant échoué.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de tests réussis.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de tests ignorés.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de suites exécutées.
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de tests exécutés, à l'exclusion des suites.
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de tests TODO.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total de tests et de suites de niveau supérieur.
  
 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durée de l'exécution du test en millisecondes.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le chemin d'accès du fichier de test qui a généré le résumé. Si le résumé correspond à plusieurs fichiers, cette valeur est `undefined`.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si l'exécution du test est considérée comme réussie ou non. Si une condition d'erreur se produit, telle qu'un test échoué ou un seuil de couverture non atteint, cette valeur sera définie sur `false`.

 

Émis lorsqu'une exécution de test se termine. Cet événement contient des mesures relatives à l'exécution du test terminée et est utile pour déterminer si une exécution de test a réussi ou échoué. Si l'isolation des tests au niveau du processus est utilisée, un événement `'test:summary'` est généré pour chaque fichier de test en plus d'un résumé cumulatif final.


### Événement : `'test:watch:drained'` {#event-testwatchdrained}

Émis lorsqu’il n’y a plus de tests en file d’attente pour être exécutés en mode surveillance.

## Classe : `TestContext` {#class-testcontext}

::: info [Historique]
| Version | Modifications |
|---|---|
| v20.1.0, v18.17.0 | La fonction `before` a été ajoutée à TestContext. |
| v18.0.0, v16.17.0 | Ajouté dans : v18.0.0, v16.17.0 |
:::

Une instance de `TestContext` est transmise à chaque fonction de test afin d’interagir avec l’exécuteur de tests. Toutefois, le constructeur `TestContext` n’est pas exposé dans le cadre de l’API.

### `context.before([fn][, options])` {#contextbeforefn-options}

**Ajouté dans : v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de hook. Le premier argument de cette fonction est un objet [`TestContext`](/fr/nodejs/api/test#class-testcontext). Si le hook utilise des rappels, la fonction de rappel est transmise comme deuxième argument. **Par défaut :** une fonction no-op.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le hook. Les propriétés suivantes sont prises en charge :
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un hook en cours.
    - `timeout` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Nombre de millisecondes après lequel le hook échouera. Si elle n’est pas spécifiée, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.

Cette fonction est utilisée pour créer un hook s’exécutant avant le sous-test du test actuel.

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**Ajouté dans : v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de hook. Le premier argument de cette fonction est un objet [`TestContext`](/fr/nodejs/api/test#class-testcontext). Si le hook utilise des rappels, la fonction de rappel est transmise comme deuxième argument. **Par défaut :** une fonction no-op.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le hook. Les propriétés suivantes sont prises en charge :
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un hook en cours.
    - `timeout` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Nombre de millisecondes après lequel le hook échouera. Si elle n’est pas spécifiée, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.

Cette fonction est utilisée pour créer un hook s’exécutant avant chaque sous-test du test actuel.

```js [ESM]
test('test de niveau supérieur', async (t) => {
  t.beforeEach((t) => t.diagnostic(`sur le point d’exécuter ${t.name}`));
  await t.test(
    'Il s’agit d’un sous-test',
    (t) => {
      assert.ok('une assertion pertinente ici');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**Ajouté dans : v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de hook. Le premier argument de cette fonction est un objet [`TestContext`](/fr/nodejs/api/test#class-testcontext). Si le hook utilise des rappels, la fonction de rappel est transmise en tant que deuxième argument. **Par défaut :** une fonction no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le hook. Les propriétés suivantes sont prises en charge :
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un hook en cours.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel le hook échouera. S’il n’est pas spécifié, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.

Cette fonction est utilisée pour créer un hook qui s’exécute après la fin du test actuel.

```js [ESM]
test('top level test', async (t) => {
  t.after((t) => t.diagnostic(`finished running ${t.name}`));
  assert.ok('some relevant assertion here');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**Ajouté dans : v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction de hook. Le premier argument de cette fonction est un objet [`TestContext`](/fr/nodejs/api/test#class-testcontext). Si le hook utilise des rappels, la fonction de rappel est transmise en tant que deuxième argument. **Par défaut :** une fonction no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le hook. Les propriétés suivantes sont prises en charge :
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d’abandonner un hook en cours.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel le hook échouera. S’il n’est pas spécifié, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.

Cette fonction est utilisée pour créer un hook qui s’exécute après chaque sous-test du test actuel.

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

**Ajouté dans : v22.2.0, v20.15.0**

Un objet contenant des méthodes d’assertion liées à `context`. Les fonctions de niveau supérieur du module `node:assert` sont exposées ici dans le but de créer des plans de test.

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**Ajouté dans : v22.3.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Une valeur à sérialiser en chaîne. Si Node.js a été démarré avec l’indicateur [`--test-update-snapshots`](/fr/nodejs/api/cli#--test-update-snapshots), la valeur sérialisée est écrite dans le fichier d’instantané. Sinon, la valeur sérialisée est comparée à la valeur correspondante dans le fichier d’instantané existant.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration facultatives. Les propriétés suivantes sont prises en charge :
    - `serializers` [\<Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau de fonctions synchrones utilisées pour sérialiser `value` en une chaîne. `value` est passé comme seul argument à la première fonction de sérialisation. La valeur de retour de chaque sérialiseur est passée comme entrée au sérialiseur suivant. Une fois que tous les sérialiseurs ont été exécutés, la valeur résultante est forcée en une chaîne. **Par défaut :** Si aucun sérialiseur n’est fourni, les sérialiseurs par défaut de l’exécuteur de test sont utilisés.



Cette fonction implémente des assertions pour les tests d’instantané.

```js [ESM]
test('test d’instantané avec sérialisation par défaut', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('test d’instantané avec sérialisation personnalisée', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**Ajouté dans : v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Message à signaler.

Cette fonction sert à écrire des diagnostics dans la sortie. Toute information de diagnostic est incluse à la fin des résultats du test. Cette fonction ne renvoie pas de valeur.

```js [ESM]
test('test de niveau supérieur', (t) => {
  t.diagnostic('Un message de diagnostic');
});
```
### `context.filePath` {#contextfilepath}

**Ajouté dans : v22.6.0, v20.16.0**

Le chemin absolu du fichier de test qui a créé le test actuel. Si un fichier de test importe des modules supplémentaires qui génèrent des tests, les tests importés renverront le chemin du fichier de test racine.

### `context.fullName` {#contextfullname}

**Ajouté dans : v22.3.0**

Le nom du test et de chacun de ses ancêtres, séparés par `\>`.

### `context.name` {#contextname}

**Ajouté dans : v18.8.0, v16.18.0**

Le nom du test.

### `context.plan(count)` {#contextplancount}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.4.0 | Cette fonction n'est plus expérimentale. |
| v22.2.0, v20.15.0 | Ajouté dans : v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'assertions et de sous-tests qui doivent être exécutés.

Cette fonction sert à définir le nombre d'assertions et de sous-tests qui doivent être exécutés dans le test. Si le nombre d'assertions et de sous-tests qui sont exécutés ne correspond pas au nombre prévu, le test échouera.

```js [ESM]
test('test de niveau supérieur', (t) => {
  t.plan(2);
  t.assert.ok('une assertion pertinente ici');
  t.test('sous-test', () => {});
});
```
Lorsque vous travaillez avec du code asynchrone, la fonction `plan` peut être utilisée pour garantir que le nombre correct d'assertions est exécuté :

```js [ESM]
test('planification avec des flux', (t, done) => {
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

**Ajouté dans : v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique s'il faut exécuter ou non les tests `only`.

Si `shouldRunOnlyTests` est truthy, le contexte de test n'exécutera que les tests pour lesquels l'option `only` est définie. Sinon, tous les tests sont exécutés. Si Node.js n'a pas été démarré avec l'option de ligne de commande [`--test-only`](/fr/nodejs/api/cli#--test-only), cette fonction est sans effet.

```js [ESM]
test('top level test', (t) => {
  // Le contexte de test peut être configuré pour exécuter des sous-tests avec l'option 'only'.
  t.runOnly(true);
  return Promise.all([
    t.test('this subtest is now skipped'),
    t.test('this subtest is run', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**Ajouté dans : v18.7.0, v16.17.0**

- Type : [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)

Peut être utilisé pour annuler les sous-tâches de test lorsque le test a été annulé.

```js [ESM]
test('top level test', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**Ajouté dans : v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Message de skip optionnel.

Cette fonction fait que la sortie du test indique que le test est ignoré. Si `message` est fourni, il est inclus dans la sortie. L'appel de `skip()` ne met pas fin à l'exécution de la fonction de test. Cette fonction ne renvoie pas de valeur.

```js [ESM]
test('top level test', (t) => {
  // Assurez-vous de revenir ici également si le test contient une logique supplémentaire.
  t.skip('this is skipped');
});
```
### `context.todo([message])` {#contexttodomessage}

**Ajouté dans : v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Message `TODO` optionnel.

Cette fonction ajoute une directive `TODO` à la sortie du test. Si `message` est fourni, il est inclus dans la sortie. L'appel de `todo()` ne met pas fin à l'exécution de la fonction de test. Cette fonction ne renvoie pas de valeur.

```js [ESM]
test('top level test', (t) => {
  // Ce test est marqué comme `TODO`
  t.todo('this is a todo');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.8.0, v16.18.0 | Ajout d'une option `signal`. |
| v18.7.0, v16.17.0 | Ajout d'une option `timeout`. |
| v18.0.0, v16.17.0 | Ajouté dans : v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du sous-test, qui s'affiche lors du signalement des résultats des tests. **Par défaut :** la propriété `name` de `fn`, ou `'\<anonymous\>'` si `fn` n'a pas de nom.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour le sous-test. Les propriétés suivantes sont prises en charge :
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Si un nombre est fourni, ce nombre de tests s'exécuterait en parallèle au sein du thread d'application. Si `true`, tous les sous-tests s'exécuteraient en parallèle. Si `false`, un seul test s'exécuterait à la fois. Si non spécifié, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `null`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si vrai, et que le contexte de test est configuré pour exécuter uniquement les tests `only`, ce test sera exécuté. Sinon, le test est ignoré. **Par défaut :** `false`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d'abandonner un test en cours.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si vrai, le test est ignoré. Si une chaîne est fournie, cette chaîne est affichée dans les résultats du test comme motif d'ignorance du test. **Par défaut :** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si vrai, le test est marqué comme `TODO`. Si une chaîne est fournie, cette chaîne est affichée dans les résultats du test comme motif pour lequel le test est `TODO`. **Par défaut :** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre de millisecondes après lequel le test échouera. Si non spécifié, les sous-tests héritent de cette valeur de leur parent. **Par défaut :** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'assertions et de sous-tests attendus lors de l'exécution du test. Si le nombre d'assertions exécutées dans le test ne correspond pas au nombre spécifié dans le plan, le test échouera. **Par défaut :** `undefined`.

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La fonction testée. Le premier argument de cette fonction est un objet [`TestContext`](/fr/nodejs/api/test#class-testcontext). Si le test utilise des rappels, la fonction de rappel est passée en deuxième argument. **Par défaut :** une fonction no-op.
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Remplie avec `undefined` une fois le test terminé.

Cette fonction est utilisée pour créer des sous-tests dans le test actuel. Cette fonction se comporte de la même manière que la fonction [`test()`](/fr/nodejs/api/test#testname-options-fn) de niveau supérieur.

```js [ESM]
test('test de niveau supérieur', async (t) => {
  await t.test(
    'Ceci est un sous-test',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('assertion pertinente ici');
    },
  );
});
```

## Classe : `SuiteContext` {#class-suitecontext}

**Ajoutée dans : v18.7.0, v16.17.0**

Une instance de `SuiteContext` est passée à chaque fonction de suite afin d’interagir avec le lanceur de test. Cependant, le constructeur `SuiteContext` n’est pas exposé dans le cadre de l’API.

### `context.filePath` {#contextfilepath_1}

**Ajoutée dans : v22.6.0**

Le chemin absolu du fichier de test qui a créé la suite actuelle. Si un fichier de test importe des modules supplémentaires qui génèrent des suites, les suites importées renvoient le chemin du fichier de test racine.

### `context.name` {#contextname_1}

**Ajoutée dans : v18.8.0, v16.18.0**

Le nom de la suite.

### `context.signal` {#contextsignal_1}

**Ajoutée dans : v18.7.0, v16.17.0**

- Type : [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)

Peut être utilisé pour abandonner les sous-tâches de test lorsque le test a été abandonné.

