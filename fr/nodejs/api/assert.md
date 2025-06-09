---
title: Documentation du module Assert de Node.js
description: Le module Assert de Node.js fournit un ensemble simple de tests d'assertion qui peuvent être utilisés pour tester des invariants. Cette documentation couvre l'utilisation, les méthodes et les exemples du module assert dans Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation du module Assert de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Assert de Node.js fournit un ensemble simple de tests d'assertion qui peuvent être utilisés pour tester des invariants. Cette documentation couvre l'utilisation, les méthodes et les exemples du module assert dans Node.js.
  - - meta
    - name: twitter:title
      content: Documentation du module Assert de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Assert de Node.js fournit un ensemble simple de tests d'assertion qui peuvent être utilisés pour tester des invariants. Cette documentation couvre l'utilisation, les méthodes et les exemples du module assert dans Node.js.
---


# Assert {#assert}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

Le module `node:assert` fournit un ensemble de fonctions d'assertion pour vérifier les invariants.

## Mode d'assertion stricte {#strict-assertion-mode}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Exposé en tant que `require('node:assert/strict')`. |
| v13.9.0, v12.16.2 | Modification de "mode strict" en "mode d'assertion stricte" et de "mode hérité" en "mode d'assertion hérité" pour éviter toute confusion avec le sens plus courant de "mode strict". |
| v9.9.0 | Ajout de différences d'erreurs au mode d'assertion stricte. |
| v9.9.0 | Ajout du mode d'assertion stricte au module assert. |
| v9.9.0 | Ajouté dans : v9.9.0 |
:::

En mode d'assertion stricte, les méthodes non strictes se comportent comme leurs méthodes strictes correspondantes. Par exemple, [`assert.deepEqual()`](/fr/nodejs/api/assert#assertdeepequalactual-expected-message) se comportera comme [`assert.deepStrictEqual()`](/fr/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

En mode d'assertion stricte, les messages d'erreur pour les objets affichent une différence. En mode d'assertion hérité, les messages d'erreur pour les objets affichent les objets, souvent tronqués.

Pour utiliser le mode d'assertion stricte :

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';
```

```js [CJS]
const assert = require('node:assert').strict;
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';
```

```js [CJS]
const assert = require('node:assert/strict');
```
:::

Exemple de différence d'erreur :

::: code-group
```js [ESM]
import { strict as assert } from 'node:assert';

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```

```js [CJS]
const assert = require('node:assert/strict');

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]
```
:::

Pour désactiver les couleurs, utilisez les variables d'environnement `NO_COLOR` ou `NODE_DISABLE_COLORS`. Cela désactivera également les couleurs dans le REPL. Pour plus d'informations sur la prise en charge des couleurs dans les environnements de terminal, consultez la documentation tty [`getColorDepth()`](/fr/nodejs/api/tty#writestreamgetcolordepthenv).


## Mode d'assertion hérité {#legacy-assertion-mode}

Le mode d'assertion hérité utilise l'[`opérateur ==`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Equality) dans :

- [`assert.deepEqual()`](/fr/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/fr/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/fr/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/fr/nodejs/api/assert#assertnotequalactual-expected-message)

Pour utiliser le mode d'assertion hérité :

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

Le mode d'assertion hérité peut avoir des résultats surprenants, en particulier lors de l'utilisation de [`assert.deepEqual()`](/fr/nodejs/api/assert#assertdeepequalactual-expected-message) :

```js [CJS]
// AVERTISSEMENT : Cela ne lève pas d'AssertionError en mode d'assertion hérité !
assert.deepEqual(/a/gi, new Date());
```
## Classe : assert.AssertionError {#class-assertassertionerror}

- Hérite de : [\<errors.Error\>](/fr/nodejs/api/errors#class-error)

Indique l'échec d'une assertion. Toutes les erreurs lancées par le module `node:assert` seront des instances de la classe `AssertionError`.

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**Ajouté dans : v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Si fourni, le message d'erreur est défini sur cette valeur.
    - `actual` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La propriété `actual` sur l'instance d'erreur.
    - `expected` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La propriété `expected` sur l'instance d'erreur.
    - `operator` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) La propriété `operator` sur l'instance d'erreur.
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Si fourni, la trace de pile générée omet les frames avant cette fonction.

Une sous-classe de `Error` qui indique l'échec d'une assertion.

Toutes les instances contiennent les propriétés `Error` intégrées (`message` et `name`) et :

- `actual` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Défini sur l'argument `actual` pour les méthodes telles que [`assert.strictEqual()`](/fr/nodejs/api/assert#assertstrictequalactual-expected-message).
- `expected` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Défini sur la valeur `expected` pour les méthodes telles que [`assert.strictEqual()`](/fr/nodejs/api/assert#assertstrictequalactual-expected-message).
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le message a été généré automatiquement (`true`) ou non.
- `code` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) La valeur est toujours `ERR_ASSERTION` pour indiquer que l'erreur est une erreur d'assertion.
- `operator` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Défini sur la valeur de l'opérateur passée.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verify error output:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```

```js [CJS]
const assert = require('node:assert');

// Generate an AssertionError to compare the error message later:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verify error output:
try {
  assert.strictEqual(1, 2);
} catch (err) {
  assert(err instanceof assert.AssertionError);
  assert.strictEqual(err.message, message);
  assert.strictEqual(err.name, 'AssertionError');
  assert.strictEqual(err.actual, 1);
  assert.strictEqual(err.expected, 2);
  assert.strictEqual(err.code, 'ERR_ASSERTION');
  assert.strictEqual(err.operator, 'strictEqual');
  assert.strictEqual(err.generatedMessage, true);
}
```
:::


## Classe : `assert.CallTracker` {#class-assertcalltracker}

::: info [Historique]
| Version | Modifications |
|---|---|
| v20.1.0 | la classe `assert.CallTracker` a été dépréciée et sera supprimée dans une version ultérieure. |
| v14.2.0, v12.19.0 | Ajoutée dans : v14.2.0, v12.19.0 |
:::

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

Cette fonctionnalité est déconseillée et sera supprimée dans une prochaine version. Veuillez envisager d'utiliser des alternatives telles que la fonction d'assistance [`mock`](/fr/nodejs/api/test#mocking).

### `new assert.CallTracker()` {#new-assertcalltracker}

**Ajoutée dans : v14.2.0, v12.19.0**

Crée un nouvel objet [`CallTracker`](/fr/nodejs/api/assert#class-assertcalltracker) qui peut être utilisé pour suivre si les fonctions ont été appelées un nombre spécifique de fois. La méthode `tracker.verify()` doit être appelée pour que la vérification ait lieu. Le schéma habituel serait de l'appeler dans un gestionnaire [`process.on('exit')`](/fr/nodejs/api/process#event-exit).

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() doit être appelée exactement 1 fois avant tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Appelle tracker.verify() et vérifie si toutes les fonctions tracker.calls() ont
// été appelées le nombre exact de fois.
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() doit être appelée exactement 1 fois avant tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Appelle tracker.verify() et vérifie si toutes les fonctions tracker.calls() ont
// été appelées le nombre exact de fois.
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**Ajoutée dans : v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Par défaut :** Une fonction no-op.
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `1`.
- Renvoie : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction qui enveloppe `fn`.

La fonction wrapper est censée être appelée exactement `exact` fois. Si la fonction n'a pas été appelée exactement `exact` fois lorsque [`tracker.verify()`](/fr/nodejs/api/assert#trackerverify) est appelée, alors [`tracker.verify()`](/fr/nodejs/api/assert#trackerverify) lèvera une erreur.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Crée un tracker d'appels.
const tracker = new assert.CallTracker();

function func() {}

// Renvoie une fonction qui enveloppe func() qui doit être appelée un nombre exact de fois
// avant tracker.verify().
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// Crée un tracker d'appels.
const tracker = new assert.CallTracker();

function func() {}

// Renvoie une fonction qui enveloppe func() qui doit être appelée un nombre exact de fois
// avant tracker.verify().
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**Ajouté dans : v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau avec tous les appels à une fonction suivie.
- Objet [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) les arguments passés à la fonction suivie

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**Ajouté dans : v14.2.0, v12.19.0**

- Retourne : [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau d'objets contenant des informations sur les fonctions wrapper retournées par [`tracker.calls()`](/fr/nodejs/api/assert#trackercallsfn-exact).
- Objet [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre réel de fois où la fonction a été appelée.
    - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de fois où la fonction devait être appelée.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom de la fonction qui est enveloppée.
    - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Une trace de pile de la fonction.

Les tableaux contiennent des informations sur le nombre prévu et réel d'appels des fonctions qui n'ont pas été appelées le nombre de fois prévu.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```

```js [CJS]
const assert = require('node:assert');

// Creates call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Returns a function that wraps func() that must be called exact times
// before tracker.verify().
const callsfunc = tracker.calls(func, 2);

// Returns an array containing information on callsfunc()
console.log(tracker.report());
// [
//  {
//    message: 'Expected the func function to be executed 2 time(s) but was
//    executed 0 time(s).',
//    actual: 0,
//    expected: 2,
//    operator: 'func',
//    stack: stack trace
//  }
// ]
```
:::


### `tracker.reset([fn])` {#trackerresetfn}

**Ajouté dans : v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) : une fonction suivie à réinitialiser.

Réinitialise les appels du traqueur d'appels. Si une fonction suivie est passée en argument, les appels seront réinitialisés pour cette fonction. Si aucun argument n'est passé, toutes les fonctions suivies seront réinitialisées.

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker a été appelé une fois
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```

```js [CJS]
const assert = require('node:assert');

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker a été appelé une fois
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**Ajouté dans : v14.2.0, v12.19.0**

Parcourt la liste des fonctions passées à [`tracker.calls()`](/fr/nodejs/api/assert#trackercallsfn-exact) et génère une erreur pour les fonctions qui n'ont pas été appelées le nombre de fois attendu.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Crée un traqueur d'appels.
const tracker = new assert.CallTracker();

function func() {}

// Renvoie une fonction qui encapsule func() qui doit être appelée un nombre exact de fois
// avant tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Lèvera une erreur car callsfunc() n'a été appelée qu'une seule fois.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// Crée un traqueur d'appels.
const tracker = new assert.CallTracker();

function func() {}

// Renvoie une fonction qui encapsule func() qui doit être appelée un nombre exact de fois
// avant tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Lèvera une erreur car callsfunc() n'a été appelée qu'une seule fois.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Ajouté dans : v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) L'entrée qui est vérifiée pour être truthy.
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Un alias de [`assert.ok()`](/fr/nodejs/api/assert#assertokvalue-message).

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.2.0, v20.15.0 | La cause de l'erreur et les propriétés d'erreurs sont maintenant également comparées. |
| v18.0.0 | La propriété lastIndex des expressions régulières est maintenant également comparée. |
| v16.0.0, v14.18.0 | En mode d'assertion Legacy, le statut est passé de Déprécié à Legacy. |
| v14.0.0 | NaN est désormais traité comme étant identique si les deux côtés sont NaN. |
| v12.0.0 | Les balises de type sont désormais correctement comparées et il y a quelques ajustements de comparaison mineurs pour rendre la vérification moins surprenante. |
| v9.0.0 | Les noms et les messages `Error` sont désormais correctement comparés. |
| v8.0.0 | Le contenu de `Set` et `Map` est également comparé. |
| v6.4.0, v4.7.1 | Les tranches de tableaux typés sont désormais gérées correctement. |
| v6.1.0, v4.5.0 | Les objets avec des références circulaires peuvent désormais être utilisés comme entrées. |
| v5.10.1, v4.4.3 | Gérer correctement les tableaux typés non-`Uint8Array`. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Mode d'assertion stricte**

Un alias de [`assert.deepStrictEqual()`](/fr/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

**Mode d'assertion Legacy**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Legacy : utilisez plutôt [`assert.deepStrictEqual()`](/fr/nodejs/api/assert#assertdeepstrictequalactual-expected-message).
:::

Teste l'égalité profonde entre les paramètres `actual` et `expected`. Il est recommandé d'utiliser [`assert.deepStrictEqual()`](/fr/nodejs/api/assert#assertdeepstrictequalactual-expected-message) à la place. [`assert.deepEqual()`](/fr/nodejs/api/assert#assertdeepequalactual-expected-message) peut avoir des résultats surprenants.

La notion d'*égalité profonde* signifie que les propriétés énumérables "propres" des objets enfants sont également évaluées récursivement selon les règles suivantes.


### Détails de la comparaison {#comparison-details}

- Les valeurs primitives sont comparées avec l'[`opérateur ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality), à l'exception de `NaN`. Il est traité comme identique si les deux côtés sont `NaN`.
- Les [balises de type](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) des objets doivent être les mêmes.
- Seules les [propriétés "propres" énumérables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) sont prises en compte.
- Les noms, les messages, les causes et les erreurs [`Error`](/fr/nodejs/api/errors#class-error) sont toujours comparés, même s'il ne s'agit pas de propriétés énumérables.
- Les [wrappers d'objets](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) sont comparés à la fois en tant qu'objets et en tant que valeurs non encapsulées.
- Les propriétés `Object` sont comparées sans ordre particulier.
- Les clés [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) et les éléments [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) sont comparés sans ordre particulier.
- La récursion s'arrête lorsque les deux côtés diffèrent ou lorsque les deux côtés rencontrent une référence circulaire.
- L'implémentation ne teste pas le [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) des objets.
- Les propriétés [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) ne sont pas comparées.
- La comparaison [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) et [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) ne repose pas sur leurs valeurs mais uniquement sur leurs instances.
- Les lastIndex, flags et source de [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) sont toujours comparés, même s'il ne s'agit pas de propriétés énumérables.

L'exemple suivant ne lève pas d'[`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) car les primitives sont comparées à l'aide de l'[`opérateur ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality).

::: code-group
```js [ESM]
import assert from 'node:assert';
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```

```js [CJS]
const assert = require('node:assert');
// WARNING: This does not throw an AssertionError!

assert.deepEqual('+00000000', false);
```
:::

L'égalité "profonde" signifie que les propriétés "propres" énumérables des objets enfants sont également évaluées :

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.deepEqual(obj1, obj1);
// OK

// Values of b are different:
assert.deepEqual(obj1, obj2);
// AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }

assert.deepEqual(obj1, obj3);
// OK

// Prototypes are ignored:
assert.deepEqual(obj1, obj4);
// AssertionError: { a: { b: 1 } } deepEqual {}
```
:::

Si les valeurs ne sont pas égales, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` est indéfini, un message d'erreur par défaut est attribué. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), alors il sera levé au lieu de l'[`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.2.0, v20.15.0 | La cause de l'erreur et les propriétés d'erreurs sont désormais comparées également. |
| v18.0.0 | La propriété lastIndex des expressions régulières est désormais comparée également. |
| v9.0.0 | Les propriétés de symboles énumérables sont désormais comparées. |
| v9.0.0 | La valeur `NaN` est désormais comparée en utilisant la comparaison [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v8.5.0 | Les noms et messages de `Error` sont désormais comparés correctement. |
| v8.0.0 | Le contenu de `Set` et `Map` est également comparé. |
| v6.1.0 | Les objets avec des références circulaires peuvent désormais être utilisés comme entrées. |
| v6.4.0, v4.7.1 | Les tranches de tableaux typés sont désormais gérées correctement. |
| v5.10.1, v4.4.3 | Gérer correctement les tableaux typés non-`Uint8Array`. |
| v1.2.0 | Ajouté dans : v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Types_de_donn%C3%A9es)
- `expected` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Types_de_donn%C3%A9es)
- `message` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String) | [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)

Teste l'égalité profonde entre les paramètres `actual` et `expected`. L'égalité « profonde » signifie que les propriétés « propres » énumérables des objets enfants sont également évaluées récursivement selon les règles suivantes.

### Détails de la comparaison {#comparison-details_1}

- Les valeurs primitives sont comparées en utilisant [`Object.is()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
- Les [balises de type](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) des objets doivent être les mêmes.
- Les [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) des objets sont comparés en utilisant l'[`opérateur ===`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Strict_equality).
- Seules les [propriétés « propres » énumérables](https://developer.mozilla.org/fr/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) sont prises en compte.
- Les noms, messages, causes et erreurs [`Error`](/fr/nodejs/api/errors#class-error) sont toujours comparés, même s'il ne s'agit pas de propriétés énumérables. `errors` est également comparé.
- Les propriétés [`Symbol`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Symbol) propres énumérables sont également comparées.
- Les [wrappers d'objet](https://developer.mozilla.org/fr/docs/Glossary/Primitive#primitive_wrapper_objects_in_javascript) sont comparés à la fois comme des objets et des valeurs déballées.
- Les propriétés `Object` sont comparées sans ordre.
- Les clés `Map`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map) et les éléments `Set`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set) sont comparés sans ordre.
- La récursion s'arrête lorsque les deux côtés diffèrent ou que les deux côtés rencontrent une référence circulaire.
- La comparaison [`WeakMap`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) et [`WeakSet`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) ne repose pas sur leurs valeurs. Voir ci-dessous pour plus de détails.
- lastIndex, les drapeaux et la source de [`RegExp`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Regular_Expressions) sont toujours comparés, même s'il ne s'agit pas de propriétés énumérables.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Cela échoue car 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Les objets suivants n'ont pas de propriétés propres
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// [[Prototype]] différent :
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Balises de type différentes :
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK car Object.is(NaN, NaN) est vrai.

// Nombres déballés différents :
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK car l'objet et la chaîne sont identiques lorsqu'ils sont déballés.

assert.deepStrictEqual(-0, -0);
// OK

// Zéros différents :
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, car c'est le même symbole sur les deux objets.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// OK, car il est impossible de comparer les entrées

// Échoue car weakMap3 a une propriété que weakMap1 ne contient pas :
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```

```js [CJS]
const assert = require('node:assert/strict');

// Cela échoue car 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Les objets suivants n'ont pas de propriétés propres
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// [[Prototype]] différent :
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Balises de type différentes :
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK car Object.is(NaN, NaN) est vrai.

// Nombres déballés différents :
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK car l'objet et la chaîne sont identiques lorsqu'ils sont déballés.

assert.deepStrictEqual(-0, -0);
// OK

// Zéros différents :
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, car c'est le même symbole sur les deux objets.

assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol2]: 1 });
// AssertionError [ERR_ASSERTION]: Inputs identical but not reference equal:
//
// {
//   [Symbol()]: 1
// }

const weakMap1 = new WeakMap();
const weakMap2 = new WeakMap([[{}, {}]]);
const weakMap3 = new WeakMap();
weakMap3.unequal = true;

assert.deepStrictEqual(weakMap1, weakMap2);
// OK, car il est impossible de comparer les entrées

// Échoue car weakMap3 a une propriété que weakMap1 ne contient pas :
assert.deepStrictEqual(weakMap1, weakMap3);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   WeakMap {
// +   [items unknown]
// -   [items unknown],
// -   unequal: true
//   }
```
:::

Si les valeurs ne sont pas égales, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` n'est pas défini, un message d'erreur par défaut est attribué. Si le paramètre `message` est une instance d'un [`Error`](/fr/nodejs/api/errors#class-error), il sera levé à la place de `AssertionError`.


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Cette API n'est plus expérimentale. |
| v13.6.0, v12.16.0 | Ajoutée dans : v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

S'attend à ce que l'entrée `string` ne corresponde pas à l'expression régulière.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotMatch('I will fail', /fail/);
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

assert.doesNotMatch(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.doesNotMatch('I will pass', /different/);
// OK
```
:::

Si les valeurs correspondent, ou si l'argument `string` est d'un autre type que `string`, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée avec une propriété `message` définie comme étant égale à la valeur du paramètre `message`. Si le paramètre `message` n'est pas défini, un message d'erreur par défaut est attribué. Si le paramètre `message` est une instance d'un [`Error`](/fr/nodejs/api/errors#class-error), alors il sera levé à la place de [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**Ajouté dans : v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Attend la promesse `asyncFn` ou, si `asyncFn` est une fonction, appelle immédiatement la fonction et attend que la promesse renvoyée se termine. Il vérifiera ensuite que la promesse n'est pas rejetée.

Si `asyncFn` est une fonction et qu'elle lève une erreur de manière synchrone, `assert.doesNotReject()` renverra une `Promise` rejetée avec cette erreur. Si la fonction ne renvoie pas de promesse, `assert.doesNotReject()` renverra une `Promise` rejetée avec une erreur [`ERR_INVALID_RETURN_VALUE`](/fr/nodejs/api/errors#err_invalid_return_value). Dans les deux cas, le gestionnaire d'erreurs est ignoré.

L'utilisation de `assert.doesNotReject()` n'est en fait pas utile car il y a peu d'avantages à attraper un rejet et à le rejeter à nouveau. Au lieu de cela, envisagez d'ajouter un commentaire à côté du chemin de code spécifique qui ne devrait pas rejeter et de garder les messages d'erreur aussi expressifs que possible.

Si spécifié, `error` peut être une [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), ou une fonction de validation. Voir [`assert.throws()`](/fr/nodejs/api/assert#assertthrowsfn-error-message) pour plus de détails.

Outre la nature asynchrone à attendre la fin, elle se comporte de la même manière que [`assert.doesNotThrow()`](/fr/nodejs/api/assert#assertdoesnotthrowfn-error-message).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.doesNotReject(
  async () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.doesNotReject(
    async () => {
      throw new TypeError('Wrong value');
    },
    SyntaxError,
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotReject(Promise.reject(new TypeError('Wrong value')))
  .then(() => {
    // ...
  });
```
:::


## `assert.doesNotThrow(fn[, error][, message])` {#assertdoesnotthrowfn-error-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.11.0, v4.4.5 | Le paramètre `message` est maintenant respecté. |
| v4.2.0 | Le paramètre `error` peut maintenant être une fonction fléchée. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Affirme que la fonction `fn` ne lève pas d'erreur.

L'utilisation de `assert.doesNotThrow()` n'est en fait pas utile car il n'y a aucun avantage à attraper une erreur, puis à la relancer. Au lieu de cela, envisagez d'ajouter un commentaire à côté du chemin de code spécifique qui ne devrait pas lever d'erreur et de conserver les messages d'erreur aussi expressifs que possible.

Lorsque `assert.doesNotThrow()` est appelée, elle appelle immédiatement la fonction `fn`.

Si une erreur est levée et qu'elle est du même type que celui spécifié par le paramètre `error`, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée. Si l'erreur est d'un type différent, ou si le paramètre `error` est indéfini, l'erreur est propagée à l'appelant.

Si spécifié, `error` peut être une [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), ou une fonction de validation. Voir [`assert.throws()`](/fr/nodejs/api/assert#assertthrowsfn-error-message) pour plus de détails.

L'exemple suivant, par exemple, lèvera une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) car il n'y a pas de type d'erreur correspondant dans l'assertion :

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Mauvaise valeur');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Mauvaise valeur');
  },
  SyntaxError,
);
```
:::

Cependant, l'exemple suivant entraînera une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) avec le message 'Got unwanted exception...' :

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Mauvaise valeur');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Mauvaise valeur');
  },
  TypeError,
);
```
:::

Si une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée et qu'une valeur est fournie pour le paramètre `message`, la valeur de `message` sera ajoutée au message [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) :

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Mauvaise valeur');
  },
  /Mauvaise valeur/,
  'Oups',
);
// Lève : AssertionError: Got unwanted exception: Oups
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Mauvaise valeur');
  },
  /Mauvaise valeur/,
  'Oups',
);
// Lève : AssertionError: Got unwanted exception: Oups
```
:::


## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0, v14.18.0 | En mode d'assertion Legacy, le statut est passé de Déprécié à Legacy. |
| v14.0.0 | NaN est désormais traité comme étant identique si les deux côtés sont NaN. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Mode d'assertion strict**

Un alias de [`assert.strictEqual()`](/fr/nodejs/api/assert#assertstrictequalactual-expected-message).

**Mode d'assertion Legacy**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Legacy : Utilisez plutôt [`assert.strictEqual()`](/fr/nodejs/api/assert#assertstrictequalactual-expected-message).
:::

Teste l'égalité superficielle et coercitive entre les paramètres `actual` et `expected` en utilisant l'[opérateur `==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality). `NaN` est traité spécialement et considéré comme identique si les deux côtés sont `NaN`.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```

```js [CJS]
const assert = require('node:assert');

assert.equal(1, 1);
// OK, 1 == 1
assert.equal(1, '1');
// OK, 1 == '1'
assert.equal(NaN, NaN);
// OK

assert.equal(1, 2);
// AssertionError: 1 == 2
assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
// AssertionError: { a: { b: 1 } } == { a: { b: 1 } }
```
:::

Si les valeurs ne sont pas égales, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est lancée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` n'est pas défini, un message d'erreur par défaut est attribué. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), alors il sera lancé à la place de l'`AssertionError`.


## `assert.fail([message])` {#assertfailmessage}

**Ajouté dans : v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **Par défaut :** `'Échec'`

Lance une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) avec le message d’erreur fourni ou un message d’erreur par défaut. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), il sera lancé à la place de [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail();
// AssertionError [ERR_ASSERTION]: Failed

assert.fail('boom');
// AssertionError [ERR_ASSERTION]: boom

assert.fail(new TypeError('need array'));
// TypeError: need array
```
:::

L’utilisation de `assert.fail()` avec plus de deux arguments est possible mais dépréciée. Voir ci-dessous pour plus de détails.

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L’appel de `assert.fail()` avec plus d’un argument est déprécié et émet un avertissement. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez `assert.fail([message])` ou d’autres fonctions assert à la place.
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Par défaut :** `assert.fail`

Si `message` est falsy, le message d’erreur est défini comme les valeurs de `actual` et `expected` séparées par l’`operator` fourni. Si seuls les deux arguments `actual` et `expected` sont fournis, `operator` prendra par défaut la valeur `'!='`. Si `message` est fourni comme troisième argument, il sera utilisé comme message d’erreur et les autres arguments seront stockés comme propriétés sur l’objet lancé. Si `stackStartFn` est fourni, tous les frames de pile au-dessus de cette fonction seront supprimés du stacktrace (voir [`Error.captureStackTrace`](/fr/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)). Si aucun argument n’est donné, le message par défaut `Failed` sera utilisé.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```

```js [CJS]
const assert = require('node:assert/strict');

assert.fail('a', 'b');
// AssertionError [ERR_ASSERTION]: 'a' != 'b'

assert.fail(1, 2, undefined, '>');
// AssertionError [ERR_ASSERTION]: 1 > 2

assert.fail(1, 2, 'fail');
// AssertionError [ERR_ASSERTION]: fail

assert.fail(1, 2, 'whoops', '>');
// AssertionError [ERR_ASSERTION]: whoops

assert.fail(1, 2, new TypeError('need array'));
// TypeError: need array
```
:::

Dans les trois derniers cas, `actual`, `expected` et `operator` n’ont aucune influence sur le message d’erreur.

Exemple d’utilisation de `stackStartFn` pour tronquer la stacktrace de l’exception :

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```

```js [CJS]
const assert = require('node:assert/strict');

function suppressFrame() {
  assert.fail('a', 'b', undefined, '!==', suppressFrame);
}
suppressFrame();
// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
//     at repl:1:1
//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
//     ...
```
:::


## `assert.ifError(value)` {#assertiferrorvalue}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Au lieu de lancer l'erreur originale, elle est maintenant enveloppée dans une [`AssertionError`][] qui contient la stack trace complète. |
| v10.0.0 | La valeur ne peut maintenant être que `undefined` ou `null`. Auparavant, toutes les valeurs falsy étaient traitées de la même manière que `null` et ne lançaient pas d'erreur. |
| v0.1.97 | Ajoutée dans : v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lance `value` si `value` n'est pas `undefined` ou `null`. Ceci est utile lors du test de l'argument `error` dans les rappels. La stack trace contient toutes les frames de l'erreur passée à `ifError()` incluant les nouvelles frames potentielles pour `ifError()` lui-même.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error

// Create some random error frames.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError got unwanted exception: test error
//     at ifErrorFrame
//     at errorFrame
```
:::


## `assert.match(string, regexp[, message])` {#assertmatchstring-regexp-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Cette API n'est plus expérimentale. |
| v13.6.0, v12.16.0 | Ajoutée dans : v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

S'attend à ce que l'entrée `string` corresponde à l'expression régulière.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.match('I will fail', /pass/);
// AssertionError [ERR_ASSERTION]: The input did not match the regular ...

assert.match(123, /pass/);
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

assert.match('I will pass', /pass/);
// OK
```
:::

Si les valeurs ne correspondent pas, ou si l'argument `string` est d'un type autre que `string`, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` est indéfini, un message d'erreur par défaut est affecté. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), il sera levé à la place de [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0, v14.18.0 | En mode d'assertion Legacy, le statut est passé de Deprecated à Legacy. |
| v14.0.0 | NaN est désormais traité comme étant identique si les deux côtés sont NaN. |
| v9.0.0 | Les noms et messages `Error` sont désormais correctement comparés. |
| v8.0.0 | Le contenu `Set` et `Map` est également comparé. |
| v6.4.0, v4.7.1 | Les tranches de tableaux typés sont désormais gérées correctement. |
| v6.1.0, v4.5.0 | Les objets avec des références circulaires peuvent désormais être utilisés comme entrées. |
| v5.10.1, v4.4.3 | Gérer correctement les tableaux typés non-`Uint8Array`. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Mode d'assertion strict**

Un alias de [`assert.notDeepStrictEqual()`](/fr/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).

**Mode d'assertion Legacy**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Legacy : Utilisez plutôt [`assert.notDeepStrictEqual()`](/fr/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).
:::

Teste toute inégalité profonde. L'opposé de [`assert.deepEqual()`](/fr/nodejs/api/assert#assertdeepequalactual-expected-message).

::: code-group
```js [ESM]
import assert from 'node:assert';

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```

```js [CJS]
const assert = require('node:assert');

const obj1 = {
  a: {
    b: 1,
  },
};
const obj2 = {
  a: {
    b: 2,
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};
const obj4 = { __proto__: obj1 };

assert.notDeepEqual(obj1, obj1);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj2);
// OK

assert.notDeepEqual(obj1, obj3);
// AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

assert.notDeepEqual(obj1, obj4);
// OK
```
:::

Si les valeurs sont profondément égales, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` est indéfini, un message d'erreur par défaut est affecté. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), il sera levé à la place de `AssertionError`.


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | `-0` et `+0` ne sont plus considérés comme égaux. |
| v9.0.0 | `NaN` est maintenant comparé en utilisant la comparaison [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v9.0.0 | Les noms et messages d'`Error` sont maintenant correctement comparés. |
| v8.0.0 | Le contenu de `Set` et `Map` est également comparé. |
| v6.1.0 | Les objets avec des références circulaires peuvent maintenant être utilisés comme entrées. |
| v6.4.0, v4.7.1 | Les tranches de tableaux typés sont maintenant gérées correctement. |
| v5.10.1, v4.4.3 | Gérer correctement les tableaux typés non-`Uint8Array`. |
| v1.2.0 | Ajoutée dans : v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)

Teste l’inégalité stricte en profondeur. Contraire de [`assert.deepStrictEqual()`](/fr/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
// OK
```
:::

Si les valeurs sont profondément et strictement égales, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` est indéfini, un message d’erreur par défaut est affecté. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), il sera levé à la place de [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0, v14.18.0 | En mode d’assertion hérité, le statut est passé de Déprécié à Hérité. |
| v14.0.0 | NaN est maintenant traité comme identique si les deux côtés sont NaN. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Mode d’assertion strict**

Un alias de [`assert.notStrictEqual()`](/fr/nodejs/api/assert#assertnotstrictequalactual-expected-message).

**Mode d’assertion hérité**

::: info [Stable : 3 - Hérité]
[Stable : 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Hérité : Utilisez [`assert.notStrictEqual()`](/fr/nodejs/api/assert#assertnotstrictequalactual-expected-message) à la place.
:::

Teste l’inégalité superficielle et coercitive avec l’[`opérateur !=`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Inequality). `NaN` est traité spécialement et considéré comme identique si les deux côtés sont `NaN`.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```

```js [CJS]
const assert = require('node:assert');

assert.notEqual(1, 2);
// OK

assert.notEqual(1, 1);
// AssertionError: 1 != 1

assert.notEqual(1, '1');
// AssertionError: 1 != '1'
```
:::

Si les valeurs sont égales, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` est indéfini, un message d’erreur par défaut est affecté. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), il sera levé à la place de [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [Historique]
| Version | Changements |
|---|---|
| v10.0.0 | La comparaison utilisée est passée de l'égalité stricte à `Object.is()`. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Teste l'inégalité stricte entre les paramètres `actual` et `expected` telle que déterminée par [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```

```js [CJS]
const assert = require('node:assert/strict');

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Expected "actual" to be strictly unequal to:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
:::

Si les valeurs sont strictement égales, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est lancée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` n'est pas défini, un message d'erreur par défaut est attribué. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), il sera lancé à la place de `AssertionError`.

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [Historique]
| Version | Changements |
|---|---|
| v10.0.0 | Le `assert.ok()` (sans arguments) utilisera désormais un message d'erreur prédéfini. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Teste si `value` est truthy. C'est équivalent à `assert.equal(!!value, true, message)`.

Si `value` n'est pas truthy, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est lancée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` est `undefined`, un message d'erreur par défaut est affecté. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), il sera lancé à la place de `AssertionError`. Si aucun argument n'est passé, `message` sera défini sur la chaîne : `'No value argument passed to \`assert.ok()\```.

Soyez conscient que dans la `repl`, le message d'erreur sera différent de celui lancé dans un fichier ! Voir ci-dessous pour plus de détails.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: No value argument passed to `assert.ok()`

assert.ok(false, 'it\'s false');
// AssertionError: it's false

// In the repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In a file (e.g. test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert.ok(0)
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
```

```js [CJS]
const assert = require('node:assert');

// Using `assert()` works the same:
assert(0);
// AssertionError: The expression evaluated to a falsy value:
//
//   assert(0)
```
:::


## `assert.rejects(asyncFn[, error][, message])` {#assertrejectsasyncfn-error-message}

**Ajoutée dans : v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Attend la promesse `asyncFn` ou, si `asyncFn` est une fonction, appelle immédiatement la fonction et attend que la promesse renvoyée se termine. Il vérifiera ensuite que la promesse est rejetée.

Si `asyncFn` est une fonction et qu'elle lève une erreur de manière synchrone, `assert.rejects()` renverra une `Promise` rejetée avec cette erreur. Si la fonction ne renvoie pas de promesse, `assert.rejects()` renverra une `Promise` rejetée avec une erreur [`ERR_INVALID_RETURN_VALUE`](/fr/nodejs/api/errors#err_invalid_return_value). Dans les deux cas, le gestionnaire d'erreurs est ignoré.

Outre la nature asynchrone d'attendre la fin de l'exécution, se comporte de manière identique à [`assert.throws()`](/fr/nodejs/api/assert#assertthrowsfn-error-message).

Si spécifié, `error` peut être une [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), une fonction de validation, un objet où chaque propriété sera testée, ou une instance d'erreur où chaque propriété sera testée, y compris les propriétés non énumérables `message` et `name`.

Si spécifié, `message` sera le message fourni par [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) si `asyncFn` ne parvient pas à rejeter.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  {
    name: 'TypeError',
    message: 'Wrong value',
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    {
      name: 'TypeError',
      message: 'Wrong value',
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Wrong value');
  },
  (err) => {
    assert.strictEqual(err.name, 'TypeError');
    assert.strictEqual(err.message, 'Wrong value');
    return true;
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Wrong value');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Wrong value');
      return true;
    },
  );
})();
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```

```js [CJS]
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Wrong value')),
  Error,
).then(() => {
  // ...
});
```
:::

`error` ne peut pas être une chaîne de caractères. Si une chaîne de caractères est fournie comme second argument, alors `error` est considéré comme omis et la chaîne sera utilisée pour `message` à la place. Cela peut conduire à des erreurs faciles à manquer. Veuillez lire attentivement l'exemple dans [`assert.throws()`](/fr/nodejs/api/assert#assertthrowsfn-error-message) si l'utilisation d'une chaîne de caractères comme second argument est envisagée.


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | La comparaison utilisée est passée de l'égalité stricte à `Object.is()`. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Teste l'égalité stricte entre les paramètres `actual` et `expected` tel que déterminé par [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```

```js [CJS]
const assert = require('node:assert/strict');

assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
//
// 1 !== 2

assert.strictEqual(1, 1);
// OK

assert.strictEqual('Hello foobar', 'Hello World!');
// AssertionError [ERR_ASSERTION]: Expected inputs to be strictly equal:
// + actual - expected
//
// + 'Hello foobar'
// - 'Hello World!'
//          ^

const apples = 1;
const oranges = 2;
assert.strictEqual(apples, oranges, `apples ${apples} !== oranges ${oranges}`);
// AssertionError [ERR_ASSERTION]: apples 1 !== oranges 2

assert.strictEqual(1, '1', new TypeError('Inputs are not identical'));
// TypeError: Inputs are not identical
```
:::

Si les valeurs ne sont pas strictement égales, une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror) est levée avec une propriété `message` définie sur la valeur du paramètre `message`. Si le paramètre `message` est indéfini, un message d'erreur par défaut est attribué. Si le paramètre `message` est une instance de [`Error`](/fr/nodejs/api/errors#class-error), il sera levé à la place de [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.2.0 | Le paramètre `error` peut maintenant être un objet contenant des expressions régulières. |
| v9.9.0 | Le paramètre `error` peut maintenant être également un objet. |
| v4.2.0 | Le paramètre `error` peut maintenant être une fonction fléchée. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

S'attend à ce que la fonction `fn` lève une erreur.

Si spécifié, `error` peut être une [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), une fonction de validation, un objet de validation où chaque propriété sera testée pour une égalité stricte en profondeur, ou une instance d'erreur où chaque propriété sera testée pour une égalité stricte en profondeur, y compris les propriétés non énumérables `message` et `name`. Lors de l'utilisation d'un objet, il est également possible d'utiliser une expression régulière, lors de la validation par rapport à une propriété de chaîne. Voir ci-dessous pour des exemples.

Si spécifié, `message` sera ajouté au message fourni par `AssertionError` si l'appel `fn` ne parvient pas à lever ou si la validation de l'erreur échoue.

Objet de validation personnalisé/instance d'erreur :

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('Mauvaise valeur');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Mauvaise valeur',
    info: {
      nested: true,
      baz: 'text',
    },
    // Seules les propriétés de l'objet de validation seront testées.
    // L'utilisation d'objets imbriqués nécessite que toutes les propriétés soient présentes. Sinon,
    // la validation va échouer.
  },
);

// Utilisation d'expressions régulières pour valider les propriétés d'erreur :
assert.throws(
  () => {
    throw err;
  },
  {
    // Les propriétés `name` et `message` sont des chaînes et l'utilisation d'expressions régulières
    // sur celles-ci correspondra à la chaîne. Si elles échouent, une
    // erreur est levée.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // Il n'est pas possible d'utiliser des expressions régulières pour les propriétés imbriquées !
      baz: 'text',
    },
    // La propriété `reg` contient une expression régulière et seulement si l'objet de
    // validation contient une expression régulière identique, elle va
    // passer.
    reg: /abc/i,
  },
);

// Échoue en raison des différentes propriétés `message` et `name` :
assert.throws(
  () => {
    const otherErr = new Error('Non trouvé');
    // Copier toutes les propriétés énumérables de `err` vers `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Les propriétés `message` et `name` de l'erreur seront également vérifiées lors de l'utilisation
  // d'une erreur comme objet de validation.
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('Mauvaise valeur');
err.code = 404;
err.foo = 'bar';
err.info = {
  nested: true,
  baz: 'text',
};
err.reg = /abc/i;

assert.throws(
  () => {
    throw err;
  },
  {
    name: 'TypeError',
    message: 'Mauvaise valeur',
    info: {
      nested: true,
      baz: 'text',
    },
    // Seules les propriétés de l'objet de validation seront testées.
    // L'utilisation d'objets imbriqués nécessite que toutes les propriétés soient présentes. Sinon,
    // la validation va échouer.
  },
);

// Utilisation d'expressions régulières pour valider les propriétés d'erreur :
assert.throws(
  () => {
    throw err;
  },
  {
    // Les propriétés `name` et `message` sont des chaînes et l'utilisation d'expressions régulières
    // sur celles-ci correspondra à la chaîne. Si elles échouent, une
    // erreur est levée.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // Il n'est pas possible d'utiliser des expressions régulières pour les propriétés imbriquées !
      baz: 'text',
    },
    // La propriété `reg` contient une expression régulière et seulement si l'objet de
    // validation contient une expression régulière identique, elle va
    // passer.
    reg: /abc/i,
  },
);

// Échoue en raison des différentes propriétés `message` et `name` :
assert.throws(
  () => {
    const otherErr = new Error('Non trouvé');
    // Copier toutes les propriétés énumérables de `err` vers `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Les propriétés `message` et `name` de l'erreur seront également vérifiées lors de l'utilisation
  // d'une erreur comme objet de validation.
  err,
);
```
:::

Valider instanceof en utilisant le constructeur :

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Mauvaise valeur');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Mauvaise valeur');
  },
  Error,
);
```
:::

Valider le message d'erreur en utilisant [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) :

L'utilisation d'une expression régulière exécute `.toString` sur l'objet d'erreur, et inclura donc également le nom de l'erreur.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Mauvaise valeur');
  },
  /^Error: Mauvaise valeur$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Mauvaise valeur');
  },
  /^Error: Mauvaise valeur$/,
);
```
:::

Validation d'erreur personnalisée :

La fonction doit renvoyer `true` pour indiquer que toutes les validations internes ont réussi. Sinon, elle échouera avec une [`AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Mauvaise valeur');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Évitez de renvoyer quoi que ce soit des fonctions de validation en dehors de `true`.
    // Sinon, il n'est pas clair quelle partie de la validation a échoué. Au lieu de cela,
    // lancez une erreur concernant la validation spécifique qui a échoué (comme cela est fait dans cet
    // exemple) et ajoutez autant d'informations de débogage utiles à cette erreur que
    // possible.
    return true;
  },
  'erreur inattendue',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Mauvaise valeur');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Évitez de renvoyer quoi que ce soit des fonctions de validation en dehors de `true`.
    // Sinon, il n'est pas clair quelle partie de la validation a échoué. Au lieu de cela,
    // lancez une erreur concernant la validation spécifique qui a échoué (comme cela est fait dans cet
    // exemple) et ajoutez autant d'informations de débogage utiles à cette erreur que
    // possible.
    return true;
  },
  'erreur inattendue',
);
```
:::

`error` ne peut pas être une chaîne. Si une chaîne est fournie comme deuxième argument, alors `error` est supposé être omis et la chaîne sera utilisée pour `message` à la place. Cela peut conduire à des erreurs faciles à manquer. L'utilisation du même message que le message d'erreur lancé entraînera une erreur `ERR_AMBIGUOUS_ARGUMENT`. Veuillez lire attentivement l'exemple ci-dessous si l'utilisation d'une chaîne comme deuxième argument est envisagée :

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// Le deuxième argument est une chaîne et la fonction d'entrée a levé une erreur.
// Le premier cas ne lèvera pas car il ne correspond pas au message d'erreur
// levé par la fonction d'entrée !
assert.throws(throwingFirst, 'Second');
// Dans l'exemple suivant, le message n'a aucun avantage par rapport au message de
// l'erreur et puisqu'il n'est pas clair si l'utilisateur avait réellement l'intention de correspondre
// au message d'erreur, Node.js lève une erreur `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// La chaîne est uniquement utilisée (comme message) au cas où la fonction ne lève pas :
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION] : Exception attendue manquante : Second

// Si l'intention était de correspondre au message d'erreur, faites ceci à la place :
// Cela ne lève pas car les messages d'erreur correspondent.
assert.throws(throwingSecond, /Second$/);

// Si le message d'erreur ne correspond pas, une AssertionError est levée.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```

```js [CJS]
const assert = require('node:assert/strict');

function throwingFirst() {
  throw new Error('First');
}

function throwingSecond() {
  throw new Error('Second');
}

function notThrowing() {}

// Le deuxième argument est une chaîne et la fonction d'entrée a levé une erreur.
// Le premier cas ne lèvera pas car il ne correspond pas au message d'erreur
// levé par la fonction d'entrée !
assert.throws(throwingFirst, 'Second');
// Dans l'exemple suivant, le message n'a aucun avantage par rapport au message de
// l'erreur et puisqu'il n'est pas clair si l'utilisateur avait réellement l'intention de correspondre
// au message d'erreur, Node.js lève une erreur `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// La chaîne est uniquement utilisée (comme message) au cas où la fonction ne lève pas :
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION] : Exception attendue manquante : Second

// Si l'intention était de correspondre au message d'erreur, faites ceci à la place :
// Cela ne lève pas car les messages d'erreur correspondent.
assert.throws(throwingSecond, /Second$/);

// Si le message d'erreur ne correspond pas, une AssertionError est levée.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

En raison de la notation confuse et sujette aux erreurs, évitez une chaîne comme deuxième argument.


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**Ajouté dans : v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).0 - Développement initial
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/fr/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) Asserte l’équivalence entre les paramètres `actual` et `expected` par le biais d’une comparaison approfondie, garantissant que toutes les propriétés du paramètre `expected` sont présentes dans le paramètre `actual` avec des valeurs équivalentes, sans autoriser la coercition de type. La principale différence avec [`assert.deepStrictEqual()`](/fr/nodejs/api/assert#assertdeepstrictequalactual-expected-message) est que [`assert.partialDeepStrictEqual()`](/fr/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) n’exige pas que toutes les propriétés du paramètre `actual` soient présentes dans le paramètre `expected`. Cette méthode devrait toujours réussir les mêmes cas de test que [`assert.deepStrictEqual()`](/fr/nodejs/api/assert#assertdeepstrictequalactual-expected-message), se comportant comme un sur-ensemble de celui-ci.

::: code-group
```js [ESM]
import assert from 'node:assert';

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual(new Set(['value1', 'value2']), new Set(['value1', 'value2']));
// OK

assert.partialDeepStrictEqual(new Map([['key1', 'value1']]), new Map([['key1', 'value1']]));
// OK

assert.partialDeepStrictEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]));
// OK

assert.partialDeepStrictEqual(/abc/, /abc/);
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual(new Date(0), new Date(0));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```

```js [CJS]
const assert = require('node:assert');

assert.partialDeepStrictEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } });
// OK

assert.partialDeepStrictEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
// OK

assert.partialDeepStrictEqual([{ a: 5 }, { b: 5 }], [{ a: 5 }]);
// OK

assert.partialDeepStrictEqual(new Set([{ a: 1 }, { b: 1 }]), new Set([{ a: 1 }]));
// OK

assert.partialDeepStrictEqual({ a: 1 }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: 1, b: '2' }, { a: 1, b: 2 });
// AssertionError

assert.partialDeepStrictEqual({ a: { b: 2 } }, { a: { b: '2' } });
// AssertionError
```
:::

