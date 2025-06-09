---
title: Documentazione del Modulo Assert di Node.js
description: Il modulo Assert di Node.js fornisce un insieme semplice di test di asserzione che possono essere utilizzati per testare invarianti. Questa documentazione copre l'uso, i metodi e gli esempi del modulo assert in Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione del Modulo Assert di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Assert di Node.js fornisce un insieme semplice di test di asserzione che possono essere utilizzati per testare invarianti. Questa documentazione copre l'uso, i metodi e gli esempi del modulo assert in Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione del Modulo Assert di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Assert di Node.js fornisce un insieme semplice di test di asserzione che possono essere utilizzati per testare invarianti. Questa documentazione copre l'uso, i metodi e gli esempi del modulo assert in Node.js.
---


# Assert {#assert}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

Il modulo `node:assert` fornisce un insieme di funzioni di asserzione per verificare gli invarianti.

## Modalità di asserzione strict {#strict-assertion-mode}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Esposto come `require('node:assert/strict')`. |
| v13.9.0, v12.16.2 | Cambiato "strict mode" in "strict assertion mode" e "legacy mode" in "legacy assertion mode" per evitare confusione con il significato più comune di "strict mode". |
| v9.9.0 | Aggiunti diff di errore alla modalità di asserzione strict. |
| v9.9.0 | Aggiunta la modalità di asserzione strict al modulo assert. |
| v9.9.0 | Aggiunto in: v9.9.0 |
:::

In modalità di asserzione strict, i metodi non strict si comportano come i loro corrispondenti metodi strict. Ad esempio, [`assert.deepEqual()`](/it/nodejs/api/assert#assertdeepequalactual-expected-message) si comporterà come [`assert.deepStrictEqual()`](/it/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

In modalità di asserzione strict, i messaggi di errore per gli oggetti visualizzano una diff. In modalità di asserzione legacy, i messaggi di errore per gli oggetti visualizzano gli oggetti, spesso troncati.

Per utilizzare la modalità di asserzione strict:



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

Esempio di diff di errore:



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

Per disattivare i colori, utilizzare le variabili d'ambiente `NO_COLOR` o `NODE_DISABLE_COLORS`. Questo disattiverà anche i colori nella REPL. Per maggiori informazioni sul supporto dei colori negli ambienti terminali, leggi la documentazione di tty [`getColorDepth()`](/it/nodejs/api/tty#writestreamgetcolordepthenv).


## Modalità di asserzione legacy {#legacy-assertion-mode}

La modalità di asserzione legacy utilizza l'[`operatore ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) in:

- [`assert.deepEqual()`](/it/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/it/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/it/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/it/nodejs/api/assert#assertnotequalactual-expected-message)

Per utilizzare la modalità di asserzione legacy:

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

La modalità di asserzione legacy può avere risultati sorprendenti, specialmente quando si utilizza [`assert.deepEqual()`](/it/nodejs/api/assert#assertdeepequalactual-expected-message):

```js [CJS]
// ATTENZIONE: Questo non solleva un AssertionError in modalità di asserzione legacy!
assert.deepEqual(/a/gi, new Date());
```
## Classe: assert.AssertionError {#class-assertassertionerror}

- Estende: [\<errors.Error\>](/it/nodejs/api/errors#class-error)

Indica il fallimento di un'asserzione. Tutti gli errori sollevati dal modulo `node:assert` saranno istanze della classe `AssertionError`.

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**Aggiunto in: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se fornito, il messaggio di errore è impostato su questo valore.
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La proprietà `actual` sull'istanza dell'errore.
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La proprietà `expected` sull'istanza dell'errore.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La proprietà `operator` sull'istanza dell'errore.
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se fornito, la traccia dello stack generata omette i frame precedenti a questa funzione.

Una sottoclasse di `Error` che indica il fallimento di un'asserzione.

Tutte le istanze contengono le proprietà `Error` integrate (`message` e `name`) e:

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Impostato sull'argomento `actual` per metodi come [`assert.strictEqual()`](/it/nodejs/api/assert#assertstrictequalactual-expected-message).
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Impostato sul valore `expected` per metodi come [`assert.strictEqual()`](/it/nodejs/api/assert#assertstrictequalactual-expected-message).
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il messaggio è stato generato automaticamente (`true`) o meno.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il valore è sempre `ERR_ASSERTION` per mostrare che l'errore è un errore di asserzione.
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Impostato sul valore dell'operatore passato.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Genera un AssertionError per confrontare il messaggio di errore in seguito:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verifica l'output dell'errore:
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

// Genera un AssertionError per confrontare il messaggio di errore in seguito:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Verifica l'output dell'errore:
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


## Classe: `assert.CallTracker` {#class-assertcalltracker}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0 | La classe `assert.CallTracker` è stata deprecata e verrà rimossa in una versione futura. |
| v14.2.0, v12.19.0 | Aggiunta in: v14.2.0, v12.19.0 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

Questa funzionalità è deprecata e verrà rimossa in una versione futura. Si prega di considerare l'utilizzo di alternative come la funzione helper [`mock`](/it/nodejs/api/test#mocking).

### `new assert.CallTracker()` {#new-assertcalltracker}

**Aggiunta in: v14.2.0, v12.19.0**

Crea un nuovo oggetto [`CallTracker`](/it/nodejs/api/assert#class-assertcalltracker) che può essere utilizzato per tracciare se le funzioni sono state chiamate un numero specifico di volte. `tracker.verify()` deve essere chiamato affinché la verifica abbia luogo. Lo schema usuale sarebbe quello di chiamarlo in un gestore di [`process.on('exit')`](/it/nodejs/api/process#event-exit).

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() deve essere chiamato esattamente 1 volta prima di tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Chiama tracker.verify() e verifica se tutte le funzioni tracker.calls() sono state
// chiamate il numero esatto di volte.
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() deve essere chiamato esattamente 1 volta prima di tracker.verify().
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Chiama tracker.verify() e verifica se tutte le funzioni tracker.calls() sono state
// chiamate il numero esatto di volte.
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**Aggiunta in: v14.2.0, v12.19.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Predefinito:** Una funzione no-op.
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `1`.
- Restituisce: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione che avvolge `fn`.

Si prevede che la funzione wrapper venga chiamata esattamente `exact` volte. Se la funzione non è stata chiamata esattamente `exact` volte quando viene chiamato [`tracker.verify()`](/it/nodejs/api/assert#trackerverify), allora [`tracker.verify()`](/it/nodejs/api/assert#trackerverify) genererà un errore.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Crea call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Restituisce una funzione che avvolge func() che deve essere chiamata un numero esatto di volte
// prima di tracker.verify().
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// Crea call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Restituisce una funzione che avvolge func() che deve essere chiamata un numero esatto di volte
// prima di tracker.verify().
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**Aggiunto in: v18.8.0, v16.18.0**

-  `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
-  Restituisce: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array con tutte le chiamate a una funzione tracciata.
-  Oggetto [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) gli argomenti passati alla funzione tracciata



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

**Aggiunto in: v14.2.0, v12.19.0**

- Restituisce: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di oggetti contenente informazioni sulle funzioni wrapper restituite da [`tracker.calls()`](/it/nodejs/api/assert#trackercallsfn-exact).
- Oggetto [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero effettivo di volte in cui la funzione è stata chiamata.
    - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di volte in cui ci si aspettava che la funzione fosse chiamata.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome della funzione di cui è stato eseguito il wrapping.
    - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Una traccia dello stack della funzione.



Gli array contengono informazioni sul numero previsto ed effettivo di chiamate delle funzioni che non sono state chiamate il numero di volte previsto.



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

**Aggiunto in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) una funzione tracciata da resettare.

Resetta le chiamate del call tracker. Se una funzione tracciata viene passata come argomento, le chiamate verranno resettate per essa. Se non vengono passati argomenti, tutte le funzioni tracciate verranno resettate.

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker è stato chiamato una volta
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
// Tracker è stato chiamato una volta
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**Aggiunto in: v14.2.0, v12.19.0**

Itera attraverso l'elenco di funzioni passate a [`tracker.calls()`](/it/nodejs/api/assert#trackercallsfn-exact) e lancerà un errore per le funzioni che non sono state chiamate il numero di volte previsto.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Crea un call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Restituisce una funzione che avvolge func() che deve essere chiamata un numero
// esatto di volte prima di tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Lancerà un errore poiché callsfunc() è stato chiamato solo una volta.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// Crea un call tracker.
const tracker = new assert.CallTracker();

function func() {}

// Restituisce una funzione che avvolge func() che deve essere chiamata un numero
// esatto di volte prima di tracker.verify().
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Lancerà un errore poiché callsfunc() è stato chiamato solo una volta.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Aggiunto in: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) L'input che viene controllato per essere truthy.
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Un alias di [`assert.ok()`](/it/nodejs/api/assert#assertokvalue-message).

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.2.0, v20.15.0 | Anche la causa dell'errore e le proprietà errors vengono ora confrontate. |
| v18.0.0 | Anche la proprietà lastIndex delle espressioni regolari viene ora confrontata. |
| v16.0.0, v14.18.0 | Nella modalità di asserzione Legacy, lo stato è cambiato da Obsoleto a Legacy. |
| v14.0.0 | NaN viene ora trattato come identico se entrambi i lati sono NaN. |
| v12.0.0 | I tag di tipo vengono ora confrontati correttamente e ci sono alcune piccole modifiche al confronto per rendere il controllo meno sorprendente. |
| v9.0.0 | I nomi e i messaggi di `Error` vengono ora confrontati correttamente. |
| v8.0.0 | Viene confrontato anche il contenuto di `Set` e `Map`. |
| v6.4.0, v4.7.1 | Le slice di array tipizzati vengono ora gestite correttamente. |
| v6.1.0, v4.5.0 | Gli oggetti con riferimenti circolari possono ora essere usati come input. |
| v5.10.1, v4.4.3 | Gestire correttamente gli array tipizzati non-`Uint8Array`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modalità di asserzione rigorosa**

Un alias di [`assert.deepStrictEqual()`](/it/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

**Modalità di asserzione Legacy**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece [`assert.deepStrictEqual()`](/it/nodejs/api/assert#assertdeepstrictequalactual-expected-message).
:::

Verifica l'uguaglianza profonda tra i parametri `actual` e `expected`. Si consiglia di utilizzare [`assert.deepStrictEqual()`](/it/nodejs/api/assert#assertdeepstrictequalactual-expected-message). [`assert.deepEqual()`](/it/nodejs/api/assert#assertdeepequalactual-expected-message) può avere risultati sorprendenti.

*Uguaglianza profonda* significa che anche le proprietà "own" enumerabili degli oggetti figlio vengono valutate ricorsivamente secondo le seguenti regole.


### Dettagli del confronto {#comparison-details}

- I valori primitivi vengono confrontati con l'[`operatore ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality), ad eccezione di `NaN`. Viene trattato come identico nel caso in cui entrambi i lati siano `NaN`.
- I [tag di tipo](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) degli oggetti devono essere gli stessi.
- Vengono considerate solo le [proprietà "own" enumerabili](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
- I nomi, i messaggi, le cause e gli errori di [`Error`](/it/nodejs/api/errors#class-error) vengono sempre confrontati, anche se non si tratta di proprietà enumerabili.
- I [wrapper di oggetti](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) vengono confrontati sia come oggetti che come valori non incapsulati.
- Le proprietà di `Object` vengono confrontate senza un ordine specifico.
- Le chiavi di [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) e gli elementi di [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) vengono confrontati senza un ordine specifico.
- La ricorsione si arresta quando entrambi i lati differiscono o entrambi i lati incontrano un riferimento circolare.
- L'implementazione non testa la proprietà [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) degli oggetti.
- Le proprietà [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) non vengono confrontate.
- Il confronto di [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) non si basa sui loro valori, ma solo sulle loro istanze.
- lastIndex, flags e source di [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) vengono sempre confrontati, anche se non si tratta di proprietà enumerabili.

L'esempio seguente non genera un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) perché i tipi primitivi vengono confrontati utilizzando l'[`operatore ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality).

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

L'uguaglianza "profonda" significa che vengono valutate anche le proprietà "own" enumerabili degli oggetti figlio:

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

Se i valori non sono uguali, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata uguale al valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di [`Error`](/it/nodejs/api/errors#class-error), allora verrà generato al posto di [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror).


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.2.0, v20.15.0 | Vengono ora confrontati anche i valori cause e errors dell'errore. |
| v18.0.0 | Viene ora confrontata anche la proprietà lastIndex delle espressioni regolari. |
| v9.0.0 | Vengono ora confrontate le proprietà simbolo enumerabili. |
| v9.0.0 | Il valore `NaN` viene ora confrontato utilizzando il confronto [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v8.5.0 | I nomi e i messaggi di `Error` vengono ora confrontati correttamente. |
| v8.0.0 | Viene confrontato anche il contenuto di `Set` e `Map`. |
| v6.1.0 | Gli oggetti con riferimenti circolari possono ora essere utilizzati come input. |
| v6.4.0, v4.7.1 | Le fette di array tipizzati vengono ora gestite correttamente. |
| v5.10.1, v4.4.3 | Gestisci correttamente gli array tipizzati non-`Uint8Array`. |
| v1.2.0 | Aggiunto in: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Esegue dei test per verificare l'uguaglianza profonda tra i parametri `actual` e `expected`. L'uguaglianza "profonda" significa che le proprietà "proprie" enumerabili degli oggetti figlio vengono valutate ricorsivamente anche secondo le seguenti regole.

### Dettagli del confronto {#comparison-details_1}

- I valori primitivi vengono confrontati utilizzando [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
- I [tag di tipo](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) degli oggetti devono essere uguali.
- [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) degli oggetti vengono confrontati utilizzando l'[`operatore ===`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality).
- Vengono considerate solo le [proprietà "proprie" enumerabili](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties).
- I nomi, i messaggi, le cause e gli errori di [`Error`](/it/nodejs/api/errors#class-error) vengono sempre confrontati, anche se queste non sono proprietà enumerabili. Viene confrontato anche `errors`.
- Vengono confrontate anche le proprietà [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) proprie enumerabili.
- I [wrapper di oggetti](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) vengono confrontati sia come oggetti sia come valori non incapsulati.
- Le proprietà di `Object` vengono confrontate senza ordine.
- Le chiavi di [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) e gli elementi di [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) vengono confrontati senza ordine.
- La ricorsione si interrompe quando entrambi i lati differiscono o entrambi i lati incontrano un riferimento circolare.
- Il confronto di [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) non si basa sui loro valori. Vedi sotto per maggiori dettagli.
- lastIndex, flags e source di [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) vengono sempre confrontati, anche se queste non sono proprietà enumerabili.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Questo fallisce perché 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// I seguenti oggetti non hanno proprietà proprie
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// [[Prototype]] differente:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Tag di tipo differenti:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK perché Object.is(NaN, NaN) è vero.

// Numeri non incapsulati differenti:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK perché l'oggetto e la stringa sono identici quando non incapsulati.

assert.deepStrictEqual(-0, -0);
// OK

// Zeri differenti:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, perché è lo stesso simbolo su entrambi gli oggetti.

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
// OK, perché è impossibile confrontare le voci

// Fallisce perché weakMap3 ha una proprietà che weakMap1 non contiene:
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

// Questo fallisce perché 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// I seguenti oggetti non hanno proprietà proprie
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// [[Prototype]] differente:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Tag di tipo differenti:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK perché Object.is(NaN, NaN) è vero.

// Numeri non incapsulati differenti:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK perché l'oggetto e la stringa sono identici quando non incapsulati.

assert.deepStrictEqual(-0, -0);
// OK

// Zeri differenti:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, perché è lo stesso simbolo su entrambi gli oggetti.

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
// OK, perché è impossibile confrontare le voci

// Fallisce perché weakMap3 ha una proprietà che weakMap1 non contiene:
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

Se i valori non sono uguali, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata uguale al valore del parametro `message`. Se il parametro `message` non è definito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error), allora verrà generato invece di `AssertionError`.


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Questa API non è più sperimentale. |
| v13.6.0, v12.16.0 | Aggiunto in: v13.6.0, v12.16.0 |
:::

- `string` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Si aspetta che l'input `string` non corrisponda all'espressione regolare.

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

Se i valori corrispondono, o se l'argomento `string` è di un tipo diverso da `string`, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata sul valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error) allora verrà lanciato invece di [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror).

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**Aggiunto in: v10.0.0**

- `asyncFn` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Attende la promise `asyncFn` o, se `asyncFn` è una funzione, chiama immediatamente la funzione e attende il completamento della promise restituita. Quindi controllerà che la promise non sia rifiutata.

Se `asyncFn` è una funzione e genera un errore in modo sincrono, `assert.doesNotReject()` restituirà una `Promise` rifiutata con quell'errore. Se la funzione non restituisce una promise, `assert.doesNotReject()` restituirà una `Promise` rifiutata con un errore [`ERR_INVALID_RETURN_VALUE`](/it/nodejs/api/errors#err_invalid_return_value). In entrambi i casi, il gestore degli errori viene ignorato.

L'utilizzo di `assert.doesNotReject()` non è in realtà utile perché c'è poco vantaggio nel catturare un rifiuto e poi rifiutarlo di nuovo. Invece, valuta la possibilità di aggiungere un commento accanto al percorso del codice specifico che non dovrebbe rifiutare e mantieni i messaggi di errore il più espressivi possibile.

Se specificato, `error` può essere una [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), o una funzione di convalida. Consulta [`assert.throws()`](/it/nodejs/api/assert#assertthrowsfn-error-message) per maggiori dettagli.

Oltre alla natura asincrona di attesa del completamento, si comporta in modo identico a [`assert.doesNotThrow()`](/it/nodejs/api/assert#assertdoesnotthrowfn-error-message).

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v5.11.0, v4.4.5 | Il parametro `message` è ora rispettato. |
| v4.2.0 | Il parametro `error` può ora essere una funzione freccia. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Asserisce che la funzione `fn` non generi un errore.

In realtà, l'utilizzo di `assert.doesNotThrow()` non è utile perché non c'è alcun vantaggio nel catturare un errore e poi rilanciarlo. Invece, considera di aggiungere un commento accanto al percorso di codice specifico che non dovrebbe generare errori e mantieni i messaggi di errore il più espressivi possibile.

Quando viene chiamato `assert.doesNotThrow()`, chiamerà immediatamente la funzione `fn`.

Se viene generato un errore ed è dello stesso tipo di quello specificato dal parametro `error`, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror). Se l'errore è di un tipo diverso o se il parametro `error` non è definito, l'errore viene propagato di nuovo al chiamante.

Se specificato, `error` può essere una [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), o una funzione di validazione. Vedi [`assert.throws()`](/it/nodejs/api/assert#assertthrowsfn-error-message) per maggiori dettagli.

Il seguente, ad esempio, genererà il [`TypeError`](/it/nodejs/api/errors#class-typeerror) perché non esiste un tipo di errore corrispondente nell'asserzione:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  SyntaxError,
);
```
:::

Tuttavia, quanto segue risulterà in un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con il messaggio "Got unwanted exception...":

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  TypeError,
);
```
:::

Se viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) e viene fornito un valore per il parametro `message`, il valore di `message` verrà aggiunto al messaggio [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror):

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```

```js [CJS]
const assert = require('node:assert/strict');

assert.doesNotThrow(
  () => {
    throw new TypeError('Wrong value');
  },
  /Wrong value/,
  'Whoops',
);
// Throws: AssertionError: Got unwanted exception: Whoops
```
:::


## `assert.equal(actual, expected[, message])` {#assertequalactual-expected-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0, v14.18.0 | Nella modalità di asserzione Legacy, lo stato è stato modificato da Deprecato a Legacy. |
| v14.0.0 | NaN viene ora trattato come identico se entrambi i lati sono NaN. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modalità di asserzione Strict**

Un alias di [`assert.strictEqual()`](/it/nodejs/api/assert#assertstrictequalactual-expected-message).

**Modalità di asserzione Legacy**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece [`assert.strictEqual()`](/it/nodejs/api/assert#assertstrictequalactual-expected-message).
:::

Verifica l'uguaglianza superficiale e coercitiva tra i parametri `actual` ed `expected` usando l'[`operatore ==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality). `NaN` viene gestito in modo speciale e trattato come identico se entrambi i lati sono `NaN`.

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

Se i valori non sono uguali, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata uguale al valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error) allora verrà generato invece dell'`AssertionError`.


## `assert.fail([message])` {#assertfailmessage}

**Aggiunto in: v0.1.21**

- `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **Predefinito:** `'Failed'`

Genera un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con il messaggio di errore fornito o un messaggio di errore predefinito. Se il parametro `message` è un'istanza di [`Error`](/it/nodejs/api/errors#class-error), verrà generato al posto di [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror).



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

L'utilizzo di `assert.fail()` con più di due argomenti è possibile ma deprecato. Vedere di seguito per ulteriori dettagli.

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Chiamare `assert.fail()` con più di un argomento è deprecato ed emette un avviso. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece `assert.fail([message])` o altre funzioni assert.
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'!='`
- `stackStartFn` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Predefinito:** `assert.fail`

Se `message` è falsy, il messaggio di errore viene impostato come i valori di `actual` e `expected` separati dall'`operator` fornito. Se vengono forniti solo i due argomenti `actual` e `expected`, `operator` sarà predefinito a `'!='`. Se `message` viene fornito come terzo argomento, verrà utilizzato come messaggio di errore e gli altri argomenti verranno memorizzati come proprietà sull'oggetto generato. Se viene fornito `stackStartFn`, tutti i frame di stack sopra quella funzione verranno rimossi dallo stacktrace (vedere [`Error.captureStackTrace`](/it/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)). Se non vengono forniti argomenti, verrà utilizzato il messaggio predefinito `Failed`.



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

Negli ultimi tre casi `actual`, `expected` e `operator` non hanno alcuna influenza sul messaggio di errore.

Esempio di utilizzo di `stackStartFn` per troncare lo stacktrace dell'eccezione:



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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Invece di lanciare l'errore originale, viene ora racchiuso in un [`AssertionError`][] che contiene l'intera traccia dello stack. |
| v10.0.0 | Value ora può essere solo `undefined` o `null`. Prima tutti i valori falsi venivano gestiti come `null` e non lanciavano un'eccezione. |
| v0.1.97 | Aggiunto in: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lancia `value` se `value` non è `undefined` o `null`. Questo è utile quando si testa l'argomento `error` nei callback. La traccia dello stack contiene tutti i frame dell'errore passato a `ifError()` inclusi i potenziali nuovi frame per `ifError()` stesso.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError ha ricevuto un'eccezione indesiderata: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError ha ricevuto un'eccezione indesiderata: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError ha ricevuto un'eccezione indesiderata: Error

// Crea alcuni frame di errore casuali.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError ha ricevuto un'eccezione indesiderata: test error
//     at ifErrorFrame
//     at errorFrame
```

```js [CJS]
const assert = require('node:assert/strict');

assert.ifError(null);
// OK
assert.ifError(0);
// AssertionError [ERR_ASSERTION]: ifError ha ricevuto un'eccezione indesiderata: 0
assert.ifError('error');
// AssertionError [ERR_ASSERTION]: ifError ha ricevuto un'eccezione indesiderata: 'error'
assert.ifError(new Error());
// AssertionError [ERR_ASSERTION]: ifError ha ricevuto un'eccezione indesiderata: Error

// Crea alcuni frame di errore casuali.
let err;
(function errorFrame() {
  err = new Error('test error');
})();

(function ifErrorFrame() {
  assert.ifError(err);
})();
// AssertionError [ERR_ASSERTION]: ifError ha ricevuto un'eccezione indesiderata: test error
//     at ifErrorFrame
//     at errorFrame
```
:::


## `assert.match(string, regexp[, message])` {#assertmatchstring-regexp-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Questa API non è più sperimentale. |
| v13.6.0, v12.16.0 | Aggiunta in: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Si aspetta che l'input `string` corrisponda all'espressione regolare.

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

Se i valori non corrispondono, o se l'argomento `string` è di un tipo diverso da `string`, viene generata una [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata uguale al valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error) allora verrà lanciato invece dell'[`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror).

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0, v14.18.0 | Nella modalità di asserzione Legacy, lo stato è stato modificato da Deprecated a Legacy. |
| v14.0.0 | NaN viene ora trattato come identico se entrambi i lati sono NaN. |
| v9.0.0 | I nomi e i messaggi di `Error` vengono ora confrontati correttamente. |
| v8.0.0 | Viene confrontato anche il contenuto di `Set` e `Map`. |
| v6.4.0, v4.7.1 | Le sezioni di array tipizzati vengono ora gestite correttamente. |
| v6.1.0, v4.5.0 | Gli oggetti con riferimenti circolari possono ora essere utilizzati come input. |
| v5.10.1, v4.4.3 | Gestisce correttamente gli array tipizzati non `Uint8Array`. |
| v0.1.21 | Aggiunta in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modalità di asserzione rigorosa**

Un alias di [`assert.notDeepStrictEqual()`](/it/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).

**Modalità di asserzione Legacy**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: utilizzare invece [`assert.notDeepStrictEqual()`](/it/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).
:::

Verifica qualsiasi disuguaglianza profonda. Opposto di [`assert.deepEqual()`](/it/nodejs/api/assert#assertdeepequalactual-expected-message).

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

Se i valori sono profondamente uguali, viene generata una [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata uguale al valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error) allora verrà lanciato invece dell'`AssertionError`.


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | `-0` e `+0` non sono più considerati uguali. |
| v9.0.0 | `NaN` viene ora confrontato utilizzando il confronto [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero). |
| v9.0.0 | I nomi e i messaggi di `Error` vengono ora confrontati correttamente. |
| v8.0.0 | Viene confrontato anche il contenuto di `Set` e `Map`. |
| v6.1.0 | Gli oggetti con riferimenti circolari possono ora essere utilizzati come input. |
| v6.4.0, v4.7.1 | Le sezioni di array tipizzati vengono ora gestite correttamente. |
| v5.10.1, v4.4.3 | Gestisci correttamente gli array tipizzati non-`Uint8Array`. |
| v1.2.0 | Aggiunto in: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Verifica la disuguaglianza stretta profonda. Opposto di [`assert.deepStrictEqual()`](/it/nodejs/api/assert#assertdeepstrictequalactual-expected-message).



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

Se i valori sono profondamente e strettamente uguali, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata uguale al valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error) allora verrà generato invece di [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror).

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0, v14.18.0 | In modalità di asserzione Legacy, lo stato è cambiato da Deprecato a Legacy. |
| v14.0.0 | NaN viene ora trattato come identico se entrambi i lati sono NaN. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Modalità di asserzione Strict**

Un alias di [`assert.notStrictEqual()`](/it/nodejs/api/assert#assertnotstrictequalactual-expected-message).

**Modalità di asserzione Legacy**

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece [`assert.notStrictEqual()`](/it/nodejs/api/assert#assertnotstrictequalactual-expected-message).
:::

Verifica la disuguaglianza shallow e coercitiva con l'[`operatore !=`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality). `NaN` viene gestito in modo speciale e trattato come identico se entrambi i lati sono `NaN`.



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

Se i valori sono uguali, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata uguale al valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error) allora verrà generato invece di `AssertionError`.


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Il confronto utilizzato è stato modificato da Uguaglianza Stretta a `Object.is()`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Verifica la disuguaglianza stretta tra i parametri `actual` e `expected` come determinato da [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Previsto che "actual" sia strettamente diverso da:
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
// AssertionError [ERR_ASSERTION]: Previsto che "actual" sia strettamente diverso da:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
:::

Se i valori sono strettamente uguali, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata sul valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error) allora verrà lanciato invece dell'`AssertionError`.

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | `assert.ok()` (senza argomenti) ora utilizzerà un messaggio di errore predefinito. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Verifica se `value` è truthy. È equivalente a `assert.equal(!!value, true, message)`.

Se `value` non è truthy, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata sul valore del parametro `message`. Se il parametro `message` è `undefined`, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error), verrà lanciato invece dell'`AssertionError`. Se non vengono passati affatto argomenti, `message` sarà impostato sulla stringa: `'Nessun argomento di valore passato a `assert.ok()`'`.

Tieni presente che nella `repl` il messaggio di errore sarà diverso da quello lanciato in un file! Vedi sotto per maggiori dettagli.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.ok(true);
// OK
assert.ok(1);
// OK

assert.ok();
// AssertionError: Nessun argomento di valore passato a `assert.ok()`

assert.ok(false, 'è falso');
// AssertionError: è falso

// Nella repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In un file (ad esempio test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: L'espressione ha valutato a un valore falsy:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: L'espressione ha valutato a un valore falsy:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: L'espressione ha valutato a un valore falsy:
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
// AssertionError: Nessun argomento di valore passato a `assert.ok()`

assert.ok(false, 'è falso');
// AssertionError: è falso

// Nella repl:
assert.ok(typeof 123 === 'string');
// AssertionError: false == true

// In un file (ad esempio test.js):
assert.ok(typeof 123 === 'string');
// AssertionError: L'espressione ha valutato a un valore falsy:
//
//   assert.ok(typeof 123 === 'string')

assert.ok(false);
// AssertionError: L'espressione ha valutato a un valore falsy:
//
//   assert.ok(false)

assert.ok(0);
// AssertionError: L'espressione ha valutato a un valore falsy:
//
//   assert.ok(0)
```
:::

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// L'uso di `assert()` funziona allo stesso modo:
assert(0);
// AssertionError: L'espressione ha valutato a un valore falsy:
//
//   assert(0)
```

```js [CJS]
const assert = require('node:assert');

// L'uso di `assert()` funziona allo stesso modo:
assert(0);
// AssertionError: L'espressione ha valutato a un valore falsy:
//
//   assert(0)
```
:::


## `assert.rejects(asyncFn[, error][, message])` {#assertrejectsasyncfn-error-message}

**Aggiunto in: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Attende la promise `asyncFn` o, se `asyncFn` è una funzione, chiama immediatamente la funzione e attende che la promise restituita venga completata. Quindi verificherà che la promise venga rifiutata.

Se `asyncFn` è una funzione e genera un errore in modo sincrono, `assert.rejects()` restituirà una `Promise` rifiutata con quell'errore. Se la funzione non restituisce una promise, `assert.rejects()` restituirà una `Promise` rifiutata con un errore [`ERR_INVALID_RETURN_VALUE`](/it/nodejs/api/errors#err_invalid_return_value). In entrambi i casi, il gestore degli errori viene saltato.

Oltre alla natura async per attendere il completamento, si comporta in modo identico a [`assert.throws()`](/it/nodejs/api/assert#assertthrowsfn-error-message).

Se specificato, `error` può essere una [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), una funzione di validazione, un oggetto in cui ogni proprietà verrà testata, o un'istanza di errore in cui ogni proprietà verrà testata, comprese le proprietà non enumerabili `message` e `name`.

Se specificato, `message` sarà il messaggio fornito da [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) se `asyncFn` non riesce a essere rifiutato.

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

`error` non può essere una stringa. Se una stringa viene fornita come secondo argomento, si presume che `error` venga omesso e la stringa verrà utilizzata invece per `message`. Ciò può portare a errori facili da perdere. Si prega di leggere attentamente l'esempio in [`assert.throws()`](/it/nodejs/api/assert#assertthrowsfn-error-message) se si considera l'utilizzo di una stringa come secondo argomento.


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Il confronto utilizzato è cambiato da Strict Equality a `Object.is()`. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Verifica la stretta uguaglianza tra i parametri `actual` e `expected` come determinato da [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).

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

Se i valori non sono strettamente uguali, viene generato un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror) con una proprietà `message` impostata uguale al valore del parametro `message`. Se il parametro `message` è indefinito, viene assegnato un messaggio di errore predefinito. Se il parametro `message` è un'istanza di un [`Error`](/it/nodejs/api/errors#class-error) allora verrà lanciato invece dell'[`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror).


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.2.0 | Il parametro `error` ora può essere un oggetto contenente espressioni regolari. |
| v9.9.0 | Il parametro `error` ora può essere anche un oggetto. |
| v4.2.0 | Il parametro `error` ora può essere una arrow function. |
| v0.1.21 | Aggiunto in: v0.1.21 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si aspetta che la funzione `fn` generi un errore.

Se specificato, `error` può essere una [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), una funzione di validazione, un oggetto di validazione in cui ogni proprietà verrà testata per l'uguaglianza profonda rigorosa, o un'istanza di errore in cui ogni proprietà verrà testata per l'uguaglianza profonda rigorosa incluse le proprietà non enumerabili `message` e `name`. Quando si utilizza un oggetto, è anche possibile utilizzare un'espressione regolare, quando si esegue la validazione rispetto a una proprietà stringa. Vedere sotto per esempi.

Se specificato, `message` verrà aggiunto al messaggio fornito da `AssertionError` se la chiamata `fn` non riesce a generare o nel caso in cui la validazione dell'errore fallisca.

Oggetto/istanza di errore di validazione personalizzata:



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('Valore errato');
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
    message: 'Valore errato',
    info: {
      nested: true,
      baz: 'text',
    },
    // Saranno testate solo le proprietà sull'oggetto di validazione.
    // L'utilizzo di oggetti nidificati richiede che tutte le proprietà siano presenti. Altrimenti
    // la validazione fallirà.
  },
);

// Utilizzo di espressioni regolari per validare le proprietà dell'errore:
assert.throws(
  () => {
    throw err;
  },
  {
    // Le proprietà `name` e `message` sono stringhe e l'utilizzo di espressioni regolari
    // su di esse corrisponderà alla stringa. Se falliscono, verrà generato un
    // errore.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // Non è possibile utilizzare espressioni regolari per le proprietà nidificate!
      baz: 'text',
    },
    // La proprietà `reg` contiene un'espressione regolare e solo se l'oggetto
    // di validazione contiene un'espressione regolare identica, passerà.
    reg: /abc/i,
  },
);

// Fallisce a causa delle diverse proprietà `message` e `name`:
assert.throws(
  () => {
    const otherErr = new Error('Non trovato');
    // Copia tutte le proprietà enumerabili da `err` a `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Le proprietà `message` e `name` dell'errore verranno controllate anche quando si utilizza
  // un errore come oggetto di validazione.
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('Valore errato');
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
    message: 'Valore errato',
    info: {
      nested: true,
      baz: 'text',
    },
    // Saranno testate solo le proprietà sull'oggetto di validazione.
    // L'utilizzo di oggetti nidificati richiede che tutte le proprietà siano presenti. Altrimenti
    // la validazione fallirà.
  },
);

// Utilizzo di espressioni regolari per validare le proprietà dell'errore:
assert.throws(
  () => {
    throw err;
  },
  {
    // Le proprietà `name` e `message` sono stringhe e l'utilizzo di espressioni regolari
    // su di esse corrisponderà alla stringa. Se falliscono, verrà generato un
    // errore.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // Non è possibile utilizzare espressioni regolari per le proprietà nidificate!
      baz: 'text',
    },
    // La proprietà `reg` contiene un'espressione regolare e solo se l'oggetto
    // di validazione contiene un'espressione regolare identica, passerà.
    reg: /abc/i,
  },
);

// Fallisce a causa delle diverse proprietà `message` e `name`:
assert.throws(
  () => {
    const otherErr = new Error('Non trovato');
    // Copia tutte le proprietà enumerabili da `err` a `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Le proprietà `message` e `name` dell'errore verranno controllate anche quando si utilizza
  // un errore come oggetto di validazione.
  err,
);
```
:::

Convalida instanceof utilizzando il costruttore:



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valore errato');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valore errato');
  },
  Error,
);
```
:::

Convalida il messaggio di errore utilizzando [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions):

L'utilizzo di un'espressione regolare esegue `.toString` sull'oggetto errore e quindi includerà anche il nome dell'errore.



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valore errato');
  },
  /^Error: Valore errato$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valore errato');
  },
  /^Error: Valore errato$/,
);
```
:::

Convalida dell'errore personalizzata:

La funzione deve restituire `true` per indicare che tutte le convalide interne sono state superate. Altrimenti fallirà con un [`AssertionError`](/it/nodejs/api/assert#class-assertassertionerror).



::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Valore errato');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Evita di restituire qualsiasi cosa dalle funzioni di validazione oltre a `true`.
    // Altrimenti, non è chiaro quale parte della validazione sia fallita. Invece,
    // genera un errore sulla validazione specifica che è fallita (come fatto in questo
    // esempio) e aggiungi quante più informazioni di debug utili possibili a tale errore
    // possibile.
    return true;
  },
  'errore inatteso',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Valore errato');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Evita di restituire qualsiasi cosa dalle funzioni di validazione oltre a `true`.
    // Altrimenti, non è chiaro quale parte della validazione sia fallita. Invece,
    // genera un errore sulla validazione specifica che è fallita (come fatto in questo
    // esempio) e aggiungi quante più informazioni di debug utili possibili a tale errore
    // possibile.
    return true;
  },
  'errore inatteso',
);
```
:::

`error` non può essere una stringa. Se viene fornita una stringa come secondo argomento, si presume che `error` venga omesso e la stringa verrà invece utilizzata per `message`. Questo può portare a errori facili da perdere. L'utilizzo dello stesso messaggio del messaggio di errore generato comporterà un errore `ERR_AMBIGUOUS_ARGUMENT`. Si prega di leggere attentamente l'esempio seguente se si considera l'utilizzo di una stringa come secondo argomento:



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

// Il secondo argomento è una stringa e la funzione di input ha generato un errore.
// Il primo caso non genererà poiché non corrisponde al messaggio di errore
// generato dalla funzione di input!
assert.throws(throwingFirst, 'Second');
// Nell'esempio successivo, il messaggio non ha alcun vantaggio rispetto al messaggio proveniente da
// errore e poiché non è chiaro se l'utente intendeva effettivamente corrispondere
// rispetto al messaggio di errore, Node.js genera un errore `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// La stringa viene utilizzata solo (come messaggio) nel caso in cui la funzione non generi:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Eccezione prevista mancante: Second

// Se si intendeva abbinare il messaggio di errore, fare invece questo:
// Non genera perché i messaggi di errore corrispondono.
assert.throws(throwingSecond, /Second$/);

// Se il messaggio di errore non corrisponde, viene generato un AssertionError.
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

// Il secondo argomento è una stringa e la funzione di input ha generato un errore.
// Il primo caso non genererà poiché non corrisponde al messaggio di errore
// generato dalla funzione di input!
assert.throws(throwingFirst, 'Second');
// Nell'esempio successivo, il messaggio non ha alcun vantaggio rispetto al messaggio proveniente da
// errore e poiché non è chiaro se l'utente intendeva effettivamente corrispondere
// rispetto al messaggio di errore, Node.js genera un errore `ERR_AMBIGUOUS_ARGUMENT`.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// La stringa viene utilizzata solo (come messaggio) nel caso in cui la funzione non generi:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Eccezione prevista mancante: Second

// Se si intendeva abbinare il messaggio di errore, fare invece questo:
// Non genera perché i messaggi di errore corrispondono.
assert.throws(throwingSecond, /Second$/);

// Se il messaggio di errore non corrisponde, viene generato un AssertionError.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

A causa della notazione fonte di confusione e soggetta a errori, evitare una stringa come secondo argomento.


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**Aggiunto in: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/it/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) Asserisce l'equivalenza tra i parametri `actual` e `expected` attraverso un confronto approfondito, assicurando che tutte le proprietà nel parametro `expected` siano presenti nel parametro `actual` con valori equivalenti, non consentendo la coercizione del tipo. La principale differenza con [`assert.deepStrictEqual()`](/it/nodejs/api/assert#assertdeepstrictequalactual-expected-message) è che [`assert.partialDeepStrictEqual()`](/it/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) non richiede che tutte le proprietà nel parametro `actual` siano presenti nel parametro `expected`. Questo metodo dovrebbe sempre superare gli stessi casi di test di [`assert.deepStrictEqual()`](/it/nodejs/api/assert#assertdeepstrictequalactual-expected-message), comportandosi come un suo super insieme.

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

