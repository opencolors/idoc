---
title: Node.js Assert Modul Dokumentation
description: Das Assert-Modul von Node.js bietet eine einfache Sammlung von Assertionstests, die verwendet werden können, um Invarianten zu testen. Diese Dokumentation behandelt die Verwendung, Methoden und Beispiele des Assert-Moduls in Node.js.
head:
  - - meta
    - name: og:title
      content: Node.js Assert Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Assert-Modul von Node.js bietet eine einfache Sammlung von Assertionstests, die verwendet werden können, um Invarianten zu testen. Diese Dokumentation behandelt die Verwendung, Methoden und Beispiele des Assert-Moduls in Node.js.
  - - meta
    - name: twitter:title
      content: Node.js Assert Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Assert-Modul von Node.js bietet eine einfache Sammlung von Assertionstests, die verwendet werden können, um Invarianten zu testen. Diese Dokumentation behandelt die Verwendung, Methoden und Beispiele des Assert-Moduls in Node.js.
---


# Assert {#assert}

::: tip [Stable: 2 - Stable]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/assert.js](https://github.com/nodejs/node/blob/v23.5.0/lib/assert.js)

Das Modul `node:assert` stellt eine Reihe von Assertionsfunktionen zur Verfügung, um Invarianten zu verifizieren.

## Strikter Assertionsmodus {#strict-assertion-mode}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Als `require('node:assert/strict')` verfügbar gemacht. |
| v13.9.0, v12.16.2 | "Strict mode" wurde in "strikter Assertionsmodus" und "Legacy-Modus" in "Legacy-Assertionsmodus" geändert, um Verwechslungen mit der üblicheren Bedeutung von "Strict mode" zu vermeiden. |
| v9.9.0 | Fehler-Diffs zum strikten Assertionsmodus hinzugefügt. |
| v9.9.0 | Strikter Assertionsmodus zum Assert-Modul hinzugefügt. |
| v9.9.0 | Hinzugefügt in: v9.9.0 |
:::

Im strikten Assertionsmodus verhalten sich nicht-strikte Methoden wie ihre entsprechenden strikten Methoden. Beispielsweise verhält sich [`assert.deepEqual()`](/de/nodejs/api/assert#assertdeepequalactual-expected-message) wie [`assert.deepStrictEqual()`](/de/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

Im strikten Assertionsmodus zeigen Fehlermeldungen für Objekte einen Diff an. Im Legacy-Assertionsmodus zeigen Fehlermeldungen für Objekte die Objekte an, oft abgeschnitten.

So verwenden Sie den strikten Assertionsmodus:

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

Beispiel für einen Fehler-Diff:

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

Um die Farben zu deaktivieren, verwenden Sie die Umgebungsvariablen `NO_COLOR` oder `NODE_DISABLE_COLORS`. Dadurch werden auch die Farben in der REPL deaktiviert. Weitere Informationen zur Farbunterstützung in Terminalumgebungen finden Sie in der tty [`getColorDepth()`](/de/nodejs/api/tty#writestreamgetcolordepthenv)-Dokumentation.


## Legacy-Assertionsmodus {#legacy-assertion-mode}

Der Legacy-Assertionsmodus verwendet den [`==`-Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) in:

- [`assert.deepEqual()`](/de/nodejs/api/assert#assertdeepequalactual-expected-message)
- [`assert.equal()`](/de/nodejs/api/assert#assertequalactual-expected-message)
- [`assert.notDeepEqual()`](/de/nodejs/api/assert#assertnotdeepequalactual-expected-message)
- [`assert.notEqual()`](/de/nodejs/api/assert#assertnotequalactual-expected-message)

So verwenden Sie den Legacy-Assertionsmodus:

::: code-group
```js [ESM]
import assert from 'node:assert';
```

```js [CJS]
const assert = require('node:assert');
```
:::

Der Legacy-Assertionsmodus kann überraschende Ergebnisse liefern, insbesondere bei Verwendung von [`assert.deepEqual()`](/de/nodejs/api/assert#assertdeepequalactual-expected-message):

```js [CJS]
// WARNUNG: Dies wirft im Legacy-Assertionsmodus keine AssertionError!
assert.deepEqual(/a/gi, new Date());
```
## Klasse: assert.AssertionError {#class-assertassertionerror}

- Erweitert: [\<errors.Error\>](/de/nodejs/api/errors#class-error)

Zeigt das Fehlschlagen einer Assertion an. Alle vom Modul `node:assert` ausgelösten Fehler sind Instanzen der Klasse `AssertionError`.

### `new assert.AssertionError(options)` {#new-assertassertionerroroptions}

**Hinzugefügt in: v0.1.21**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn angegeben, wird die Fehlermeldung auf diesen Wert gesetzt.
    - `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Eigenschaft `actual` in der Fehlerinstanz.
    - `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Eigenschaft `expected` in der Fehlerinstanz.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Eigenschaft `operator` in der Fehlerinstanz.
    - `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wenn angegeben, lässt der generierte Stack-Trace Frames vor dieser Funktion aus.

Eine Unterklasse von `Error`, die das Fehlschlagen einer Assertion anzeigt.

Alle Instanzen enthalten die eingebauten `Error`-Eigenschaften (`message` und `name`) und:

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Wird auf das Argument `actual` für Methoden wie [`assert.strictEqual()`](/de/nodejs/api/assert#assertstrictequalactual-expected-message) gesetzt.
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Wird auf den `expected`-Wert für Methoden wie [`assert.strictEqual()`](/de/nodejs/api/assert#assertstrictequalactual-expected-message) gesetzt.
- `generatedMessage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob die Nachricht automatisch generiert wurde (`true`) oder nicht.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Wert ist immer `ERR_ASSERTION`, um anzuzeigen, dass es sich bei dem Fehler um einen Assertionsfehler handelt.
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wird auf den übergebenen Operatorwert gesetzt.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Generiere eine AssertionError, um die Fehlermeldung später zu vergleichen:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Überprüfe die Fehlerausgabe:
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

// Generiere eine AssertionError, um die Fehlermeldung später zu vergleichen:
const { message } = new assert.AssertionError({
  actual: 1,
  expected: 2,
  operator: 'strictEqual',
});

// Überprüfe die Fehlerausgabe:
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


## Klasse: `assert.CallTracker` {#class-assertcalltracker}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.1.0 | Die Klasse `assert.CallTracker` ist als veraltet markiert und wird in einer zukünftigen Version entfernt. |
| v14.2.0, v12.19.0 | Hinzugefügt in: v14.2.0, v12.19.0 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

Dieses Feature ist veraltet und wird in einer zukünftigen Version entfernt. Bitte erwägen Sie die Verwendung von Alternativen wie der Helferfunktion [`mock`](/de/nodejs/api/test#mocking).

### `new assert.CallTracker()` {#new-assertcalltracker}

**Hinzugefügt in: v14.2.0, v12.19.0**

Erstellt ein neues [`CallTracker`](/de/nodejs/api/assert#class-assertcalltracker)-Objekt, das verwendet werden kann, um zu verfolgen, ob Funktionen eine bestimmte Anzahl von Malen aufgerufen wurden. `tracker.verify()` muss aufgerufen werden, damit die Überprüfung stattfindet. Das übliche Muster wäre, es in einem [`process.on('exit')`](/de/nodejs/api/process#event-exit)-Handler aufzurufen.

::: code-group
```js [ESM]
import assert from 'node:assert';
import process from 'node:process';

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() muss genau 1 Mal vor tracker.verify() aufgerufen werden.
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Ruft tracker.verify() auf und überprüft, ob alle tracker.calls()-Funktionen
// exakte Male aufgerufen wurden.
process.on('exit', () => {
  tracker.verify();
});
```

```js [CJS]
const assert = require('node:assert');
const process = require('node:process');

const tracker = new assert.CallTracker();

function func() {}

// callsfunc() muss genau 1 Mal vor tracker.verify() aufgerufen werden.
const callsfunc = tracker.calls(func, 1);

callsfunc();

// Ruft tracker.verify() auf und überprüft, ob alle tracker.calls()-Funktionen
// exakte Male aufgerufen wurden.
process.on('exit', () => {
  tracker.verify();
});
```
:::

### `tracker.calls([fn][, exact])` {#trackercallsfn-exact}

**Hinzugefügt in: v14.2.0, v12.19.0**

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Standard:** Eine No-Op-Funktion.
- `exact` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `1`.
- Gibt zurück: [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Funktion, die `fn` umschließt.

Es wird erwartet, dass die Wrapper-Funktion genau `exact` Mal aufgerufen wird. Wenn die Funktion nicht genau `exact` Mal aufgerufen wurde, wenn [`tracker.verify()`](/de/nodejs/api/assert#trackerverify) aufgerufen wird, wirft [`tracker.verify()`](/de/nodejs/api/assert#trackerverify) einen Fehler.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Erstellt Call-Tracker.
const tracker = new assert.CallTracker();

function func() {}

// Gibt eine Funktion zurück, die func() umschließt, die exakte Male
// vor tracker.verify() aufgerufen werden muss.
const callsfunc = tracker.calls(func);
```

```js [CJS]
const assert = require('node:assert');

// Erstellt Call-Tracker.
const tracker = new assert.CallTracker();

function func() {}

// Gibt eine Funktion zurück, die func() umschließt, die exakte Male
// vor tracker.verify() aufgerufen werden muss.
const callsfunc = tracker.calls(func);
```
:::


### `tracker.getCalls(fn)` {#trackergetcallsfn}

**Hinzugefügt in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array mit allen Aufrufen einer überwachten Funktion.
- Objekt [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Die Argumente, die an die überwachte Funktion übergeben wurden.

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

// Erstellt einen Call Tracker.
const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);
callsfunc(1, 2, 3);

assert.deepStrictEqual(tracker.getCalls(callsfunc),
                       [{ thisArg: undefined, arguments: [1, 2, 3] }]);
```
:::

### `tracker.report()` {#trackerreport}

**Hinzugefügt in: v14.2.0, v12.19.0**

- Gibt zurück: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von Objekten, das Informationen über die Wrapper-Funktionen enthält, die von [`tracker.calls()`](/de/nodejs/api/assert#trackercallsfn-exact) zurückgegeben werden.
- Objekt [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `actual` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die tatsächliche Anzahl der Funktionsaufrufe.
    - `expected` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Funktionsaufrufe, die erwartet wurde.
    - `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name der Funktion, die umschlossen ist.
    - `stack` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Stack Trace der Funktion.

Das Array enthält Informationen über die erwartete und tatsächliche Anzahl der Aufrufe der Funktionen, die nicht die erwartete Anzahl von Malen aufgerufen wurden.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Erstellt einen Call Tracker.
const tracker = new assert.CallTracker();

function func() {}

// Gibt eine Funktion zurück, die func() umschließt und vor tracker.verify()
// genau 'times' Mal aufgerufen werden muss.
const callsfunc = tracker.calls(func, 2);

// Gibt ein Array mit Informationen zu callsfunc() zurück
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

// Erstellt einen Call Tracker.
const tracker = new assert.CallTracker();

function func() {}

// Gibt eine Funktion zurück, die func() umschließt und vor tracker.verify()
// genau 'times' Mal aufgerufen werden muss.
const callsfunc = tracker.calls(func, 2);

// Gibt ein Array mit Informationen zu callsfunc() zurück
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

**Hinzugefügt in: v18.8.0, v16.18.0**

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) eine verfolgte Funktion, die zurückgesetzt werden soll.

Setzt Aufrufe des Call-Trackers zurück. Wenn eine verfolgte Funktion als Argument übergeben wird, werden die Aufrufe für diese zurückgesetzt. Wenn keine Argumente übergeben werden, werden alle verfolgten Funktionen zurückgesetzt.

::: code-group
```js [ESM]
import assert from 'node:assert';

const tracker = new assert.CallTracker();

function func() {}
const callsfunc = tracker.calls(func);

callsfunc();
// Tracker wurde einmal aufgerufen
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
// Tracker wurde einmal aufgerufen
assert.strictEqual(tracker.getCalls(callsfunc).length, 1);

tracker.reset(callsfunc);
assert.strictEqual(tracker.getCalls(callsfunc).length, 0);
```
:::

### `tracker.verify()` {#trackerverify}

**Hinzugefügt in: v14.2.0, v12.19.0**

Iteriert durch die Liste der Funktionen, die an [`tracker.calls()`](/de/nodejs/api/assert#trackercallsfn-exact) übergeben wurden und löst einen Fehler für Funktionen aus, die nicht die erwartete Anzahl von Malen aufgerufen wurden.

::: code-group
```js [ESM]
import assert from 'node:assert';

// Erstellt einen Call-Tracker.
const tracker = new assert.CallTracker();

function func() {}

// Gibt eine Funktion zurück, die func() umschließt, die vor tracker.verify()
// genau mal aufgerufen werden muss.
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Wirft einen Fehler, da callsfunc() nur einmal aufgerufen wurde.
tracker.verify();
```

```js [CJS]
const assert = require('node:assert');

// Erstellt einen Call-Tracker.
const tracker = new assert.CallTracker();

function func() {}

// Gibt eine Funktion zurück, die func() umschließt, die vor tracker.verify()
// genau mal aufgerufen werden muss.
const callsfunc = tracker.calls(func, 2);

callsfunc();

// Wirft einen Fehler, da callsfunc() nur einmal aufgerufen wurde.
tracker.verify();
```
:::


## `assert(value[, message])` {#assertvalue-message}

**Hinzugefügt in: v0.5.9**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Die Eingabe, die auf Wahrheit geprüft wird.
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Ein Alias von [`assert.ok()`](/de/nodejs/api/assert#assertokvalue-message).

## `assert.deepEqual(actual, expected[, message])` {#assertdeepequalactual-expected-message}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.2.0, v20.15.0 | Fehlerursache und Fehler-Eigenschaften werden jetzt ebenfalls verglichen. |
| v18.0.0 | Die Eigenschaft `lastIndex` regulärer Ausdrücke wird nun ebenfalls verglichen. |
| v16.0.0, v14.18.0 | Im Legacy-Assertionsmodus wurde der Status von Deprecated zu Legacy geändert. |
| v14.0.0 | NaN wird jetzt als identisch behandelt, wenn beide Seiten NaN sind. |
| v12.0.0 | Die Typ-Tags werden jetzt korrekt verglichen, und es gibt ein paar kleinere Vergleichsanpassungen, um die Überprüfung weniger überraschend zu gestalten. |
| v9.0.0 | Die `Error`-Namen und -Meldungen werden jetzt korrekt verglichen. |
| v8.0.0 | Der Inhalt von `Set` und `Map` wird ebenfalls verglichen. |
| v6.4.0, v4.7.1 | Typed-Array-Slices werden jetzt korrekt behandelt. |
| v6.1.0, v4.5.0 | Objekte mit zirkulären Referenzen können jetzt als Eingaben verwendet werden. |
| v5.10.1, v4.4.3 | Behandelt nicht-`Uint8Array` Typed Arrays korrekt. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Strikter Assertionsmodus**

Ein Alias von [`assert.deepStrictEqual()`](/de/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

**Legacy Assertionsmodus**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`assert.deepStrictEqual()`](/de/nodejs/api/assert#assertdeepstrictequalactual-expected-message).
:::

Testet auf tiefe Gleichheit zwischen den Parametern `actual` und `expected`. Erwägen Sie stattdessen die Verwendung von [`assert.deepStrictEqual()`](/de/nodejs/api/assert#assertdeepstrictequalactual-expected-message). [`assert.deepEqual()`](/de/nodejs/api/assert#assertdeepequalactual-expected-message) kann zu überraschenden Ergebnissen führen.

*Tiefe Gleichheit* bedeutet, dass die aufzählbaren "eigenen" Eigenschaften von Kindobjekten auch rekursiv nach den folgenden Regeln ausgewertet werden.


### Vergleichsdetails {#comparison-details}

- Primitive Werte werden mit dem [`==` Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) verglichen, mit Ausnahme von `NaN`. Es wird als identisch behandelt, falls beide Seiten `NaN` sind.
- [Typ-Tags](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) von Objekten müssen gleich sein.
- Es werden nur [aufzählbare "eigene" Eigenschaften](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) berücksichtigt.
- [`Error`](/de/nodejs/api/errors#class-error) Namen, Meldungen, Ursachen und Fehler werden immer verglichen, auch wenn diese keine aufzählbaren Eigenschaften sind.
- [Objekt-Wrapper](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) werden sowohl als Objekte als auch als entpackte Werte verglichen.
- `Object` Eigenschaften werden ungeordnet verglichen.
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) Schlüssel und [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) Elemente werden ungeordnet verglichen.
- Die Rekursion stoppt, wenn beide Seiten unterschiedlich sind oder beide Seiten auf eine zirkuläre Referenz stoßen.
- Die Implementierung testet nicht den [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) von Objekten.
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) Eigenschaften werden nicht verglichen.
- Der Vergleich von [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) und [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) basiert nicht auf ihren Werten, sondern nur auf ihren Instanzen.
- [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) lastIndex, Flags und Source werden immer verglichen, auch wenn diese keine aufzählbaren Eigenschaften sind.

Das folgende Beispiel wirft keinen [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror), da die primitiven Datentypen mit dem [`==` Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) verglichen werden.



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

"Tiefe" Gleichheit bedeutet, dass auch die aufzählbaren "eigenen" Eigenschaften von Kindobjekten ausgewertet werden:



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

Wenn die Werte nicht gleich sind, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message` Eigenschaft ausgelöst, die dem Wert des `message` Parameters entspricht. Wenn der `message` Parameter nicht definiert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message` Parameter eine Instanz von [`Error`](/de/nodejs/api/errors#class-error) ist, wird er anstelle des [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) geworfen.


## `assert.deepStrictEqual(actual, expected[, message])` {#assertdeepstrictequalactual-expected-message}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.2.0, v20.15.0 | Fehlerursache und Fehler-Eigenschaften werden jetzt ebenfalls verglichen. |
| v18.0.0 | Die Eigenschaft `lastIndex` regulärer Ausdrücke wird jetzt ebenfalls verglichen. |
| v9.0.0 | Aufzählbare Symbol-Eigenschaften werden jetzt verglichen. |
| v9.0.0 | `NaN` wird jetzt mit dem [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero)-Vergleich verglichen. |
| v8.5.0 | Die Namen und Meldungen von `Error` werden jetzt korrekt verglichen. |
| v8.0.0 | Der Inhalt von `Set` und `Map` wird ebenfalls verglichen. |
| v6.1.0 | Objekte mit zirkulären Referenzen können jetzt als Eingaben verwendet werden. |
| v6.4.0, v4.7.1 | Typed-Array-Slices werden jetzt korrekt behandelt. |
| v5.10.1, v4.4.3 | Behandelt nicht-`Uint8Array` Typed Arrays korrekt. |
| v1.2.0 | Hinzugefügt in: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testet auf tiefe Gleichheit zwischen den Parametern `actual` und `expected`. "Tiefe" Gleichheit bedeutet, dass die aufzählbaren "eigenen" Eigenschaften von Kindobjekten ebenfalls rekursiv nach den folgenden Regeln ausgewertet werden.

### Vergleichsdetails {#comparison-details_1}

- Primitive Werte werden mit [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) verglichen.
- [Typ-Tags](https://tc39.github.io/ecma262/#sec-object.prototype.tostring) von Objekten sollten gleich sein.
- [`[[Prototype]]`](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots) von Objekten werden mit dem [`===` Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) verglichen.
- Nur [aufzählbare "eigene" Eigenschaften](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties) werden berücksichtigt.
- [`Error`](/de/nodejs/api/errors#class-error)-Namen, -Meldungen, -Ursachen und -Fehler werden immer verglichen, auch wenn dies keine aufzählbaren Eigenschaften sind. `errors` wird ebenfalls verglichen.
- Aufzählbare eigene [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)-Eigenschaften werden ebenfalls verglichen.
- [Objekt-Wrapper](https://developer.mozilla.org/en-US/docs/Glossary/Primitive#Primitive_wrapper_objects_in_JavaScript) werden sowohl als Objekte als auch als entpackte Werte verglichen.
- `Object`-Eigenschaften werden ungeordnet verglichen.
- [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)-Schlüssel und [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)-Elemente werden ungeordnet verglichen.
- Die Rekursion stoppt, wenn sich beide Seiten unterscheiden oder beide Seiten auf eine zirkuläre Referenz stoßen.
- Der Vergleich von [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) und [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) basiert nicht auf ihren Werten. Weitere Informationen finden Sie unten.
- `RegExp` lastIndex, Flags und Source werden immer verglichen, auch wenn dies keine aufzählbaren Eigenschaften sind.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

// Dies schlägt fehl, weil 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Die folgenden Objekte haben keine eigenen Eigenschaften
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Unterschiedliches [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Unterschiedliche Typ-Tags:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK, weil Object.is(NaN, NaN) true ist.

// Unterschiedliche entpackte Zahlen:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK, weil das Objekt und die Zeichenkette beim Entpacken identisch sind.

assert.deepStrictEqual(-0, -0);
// OK

// Unterschiedliche Nullen:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, weil es dasselbe Symbol in beiden Objekten ist.

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
// OK, weil es unmöglich ist, die Einträge zu vergleichen

// Schlägt fehl, weil weakMap3 eine Eigenschaft hat, die weakMap1 nicht enthält:
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

// Dies schlägt fehl, weil 1 !== '1'.
assert.deepStrictEqual({ a: 1 }, { a: '1' });
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
//   {
// +   a: 1
// -   a: '1'
//   }

// Die folgenden Objekte haben keine eigenen Eigenschaften
const date = new Date();
const object = {};
const fakeDate = {};
Object.setPrototypeOf(fakeDate, Date.prototype);

// Unterschiedliches [[Prototype]]:
assert.deepStrictEqual(object, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + {}
// - Date {}

// Unterschiedliche Typ-Tags:
assert.deepStrictEqual(date, fakeDate);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 2018-04-26T00:49:08.604Z
// - Date {}

assert.deepStrictEqual(NaN, NaN);
// OK, weil Object.is(NaN, NaN) true ist.

// Unterschiedliche entpackte Zahlen:
assert.deepStrictEqual(new Number(1), new Number(2));
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + [Number: 1]
// - [Number: 2]

assert.deepStrictEqual(new String('foo'), Object('foo'));
// OK, weil das Objekt und die Zeichenkette beim Entpacken identisch sind.

assert.deepStrictEqual(-0, -0);
// OK

// Unterschiedliche Nullen:
assert.deepStrictEqual(0, -0);
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected
//
// + 0
// - -0

const symbol1 = Symbol();
const symbol2 = Symbol();
assert.deepStrictEqual({ [symbol1]: 1 }, { [symbol1]: 1 });
// OK, weil es dasselbe Symbol in beiden Objekten ist.

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
// OK, weil es unmöglich ist, die Einträge zu vergleichen

// Schlägt fehl, weil weakMap3 eine Eigenschaft hat, die weakMap1 nicht enthält:
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

Wenn die Werte nicht gleich sind, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message`-Eigenschaft ausgelöst, die auf den Wert des `message`-Parameters gesetzt ist. Wenn der `message`-Parameter undefiniert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message`-Parameter eine Instanz eines [`Error`](/de/nodejs/api/errors#class-error) ist, wird dieser anstelle des `AssertionError` ausgelöst.


## `assert.doesNotMatch(string, regexp[, message])` {#assertdoesnotmatchstring-regexp-message}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Diese API ist nicht mehr experimentell. |
| v13.6.0, v12.16.0 | Hinzugefügt in: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Erwartet, dass die Eingabe `string` nicht mit dem regulären Ausdruck übereinstimmt.

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

Wenn die Werte übereinstimmen oder das `string`-Argument einen anderen Typ als `string` hat, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message`-Eigenschaft ausgelöst, die dem Wert des `message`-Parameters entspricht. Wenn der `message`-Parameter undefiniert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message`-Parameter eine Instanz von [`Error`](/de/nodejs/api/errors#class-error) ist, wird diese anstelle des [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) ausgelöst.

## `assert.doesNotReject(asyncFn[, error][, message])` {#assertdoesnotrejectasyncfn-error-message}

**Hinzugefügt in: v10.0.0**

- `asyncFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Erwartet das `asyncFn`-Promise oder, falls `asyncFn` eine Funktion ist, ruft die Funktion sofort auf und erwartet, dass das zurückgegebene Promise abgeschlossen wird. Anschließend wird überprüft, ob das Promise nicht abgelehnt wird.

Wenn `asyncFn` eine Funktion ist und synchron einen Fehler auslöst, gibt `assert.doesNotReject()` ein abgelehntes `Promise` mit diesem Fehler zurück. Wenn die Funktion kein Promise zurückgibt, gibt `assert.doesNotReject()` ein abgelehntes `Promise` mit einem [`ERR_INVALID_RETURN_VALUE`](/de/nodejs/api/errors#err_invalid_return_value)-Fehler zurück. In beiden Fällen wird der Fehler-Handler übersprungen.

Die Verwendung von `assert.doesNotReject()` ist eigentlich nicht nützlich, da es wenig Sinn macht, eine Ablehnung abzufangen und sie dann erneut abzulehnen. Stattdessen sollten Sie erwägen, einen Kommentar neben dem spezifischen Codepfad hinzuzufügen, der nicht ablehnen sollte, und Fehlermeldungen so aussagekräftig wie möglich zu gestalten.

Falls angegeben, kann `error` eine [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) oder eine Validierungsfunktion sein. Weitere Informationen finden Sie unter [`assert.throws()`](/de/nodejs/api/assert#assertthrowsfn-error-message).

Abgesehen von der asynchronen Natur des Wartens auf den Abschluss verhält es sich identisch mit [`assert.doesNotThrow()`](/de/nodejs/api/assert#assertdoesnotthrowfn-error-message).

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v5.11.0, v4.4.5 | Der Parameter `message` wird jetzt berücksichtigt. |
| v4.2.0 | Der Parameter `error` kann jetzt eine Arrow-Funktion sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Stellt sicher, dass die Funktion `fn` keinen Fehler auslöst.

Die Verwendung von `assert.doesNotThrow()` ist eigentlich nicht nützlich, da es keinen Vorteil bringt, einen Fehler abzufangen und ihn dann erneut auszulösen. Stattdessen sollte man erwägen, einen Kommentar neben den spezifischen Codepfad hinzuzufügen, der keinen Fehler auslösen sollte, und Fehlermeldungen so aussagekräftig wie möglich zu halten.

Wenn `assert.doesNotThrow()` aufgerufen wird, wird die Funktion `fn` sofort aufgerufen.

Wenn ein Fehler ausgelöst wird und er vom gleichen Typ ist wie der durch den Parameter `error` angegebene, dann wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) ausgelöst. Wenn der Fehler von einem anderen Typ ist oder wenn der Parameter `error` nicht definiert ist, wird der Fehler an den Aufrufer zurückgegeben.

Falls angegeben, kann `error` eine [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) oder eine Validierungsfunktion sein. Weitere Details finden Sie unter [`assert.throws()`](/de/nodejs/api/assert#assertthrowsfn-error-message).

Das Folgende löst beispielsweise den [`TypeError`](/de/nodejs/api/errors#class-typeerror) aus, da kein übereinstimmender Fehlertyp in der Assertion vorhanden ist:

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

Das Folgende führt jedoch zu einem [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit der Meldung 'Got unwanted exception...':

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

Wenn ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) ausgelöst wird und ein Wert für den Parameter `message` angegeben wird, wird der Wert von `message` an die [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror)-Meldung angehängt:

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

::: info [Geschichte]
| Version | Änderungen |
| --- | --- |
| v16.0.0, v14.18.0 | Im Legacy-Assertionsmodus wurde der Status von Veraltet zu Legacy geändert. |
| v14.0.0 | NaN wird nun als identisch behandelt, wenn beide Seiten NaN sind. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Strikter Assertionsmodus**

Ein Alias von [`assert.strictEqual()`](/de/nodejs/api/assert#assertstrictequalactual-expected-message).

**Legacy-Assertionsmodus**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`assert.strictEqual()`](/de/nodejs/api/assert#assertstrictequalactual-expected-message).
:::

Testet flache, koerzitive Gleichheit zwischen den Parametern `actual` und `expected` unter Verwendung des [`==` Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality). `NaN` wird speziell behandelt und als identisch betrachtet, wenn beide Seiten `NaN` sind.

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

Wenn die Werte nicht gleich sind, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message`-Eigenschaft ausgelöst, die auf den Wert des `message`-Parameters gesetzt ist. Wenn der `message`-Parameter undefiniert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message`-Parameter eine Instanz eines [`Error`](/de/nodejs/api/errors#class-error) ist, wird dieser anstelle des `AssertionError` ausgelöst.


## `assert.fail([message])` {#assertfailmessage}

**Hinzugefügt in: v0.1.21**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) **Standard:** `'Failed'`

Wirft einen [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit der angegebenen Fehlermeldung oder einer Standardfehlermeldung. Wenn der `message`-Parameter eine Instanz von [`Error`](/de/nodejs/api/errors#class-error) ist, wird er anstelle des [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) geworfen.

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

Die Verwendung von `assert.fail()` mit mehr als zwei Argumenten ist möglich, aber veraltet. Weitere Informationen finden Sie unten.

## `assert.fail(actual, expected[, message[, operator[, stackStartFn]]])` {#assertfailactual-expected-message-operator-stackstartfn}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Das Aufrufen von `assert.fail()` mit mehr als einem Argument ist veraltet und gibt eine Warnung aus. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen `assert.fail([message])` oder andere Assert-Funktionen.
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `operator` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'!='`
- `stackStartFn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) **Standard:** `assert.fail`

Wenn `message` einen Falsy-Wert hat, wird die Fehlermeldung als die Werte von `actual` und `expected` gesetzt, getrennt durch den angegebenen `operator`. Wenn nur die beiden Argumente `actual` und `expected` angegeben werden, ist `operator` standardmäßig `'!='`. Wenn `message` als drittes Argument angegeben wird, wird es als Fehlermeldung verwendet und die anderen Argumente werden als Eigenschaften des geworfenen Objekts gespeichert. Wenn `stackStartFn` angegeben wird, werden alle Stack-Frames oberhalb dieser Funktion aus dem Stacktrace entfernt (siehe [`Error.captureStackTrace`](/de/nodejs/api/errors#errorcapturestacktracetargetobject-constructoropt)). Wenn keine Argumente angegeben werden, wird die Standardmeldung `Failed` verwendet.

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

In den letzten drei Fällen haben `actual`, `expected` und `operator` keinen Einfluss auf die Fehlermeldung.

Beispiel für die Verwendung von `stackStartFn` zum Abschneiden des Stacktrace der Ausnahme:

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

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Anstatt den ursprünglichen Fehler zu werfen, wird er jetzt in einen [`AssertionError`][] verpackt, der den vollständigen Stack-Trace enthält. |
| v10.0.0 | Der Wert darf jetzt nur noch `undefined` oder `null` sein. Zuvor wurden alle falschen Werte wie `null` behandelt und haben keinen Fehler ausgelöst. |
| v0.1.97 | Hinzugefügt in: v0.1.97 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Wirft `value`, wenn `value` nicht `undefined` oder `null` ist. Dies ist nützlich, wenn das `error`-Argument in Callbacks getestet wird. Der Stack-Trace enthält alle Frames des Fehlers, der an `ifError()` übergeben wurde, einschließlich der potenziellen neuen Frames für `ifError()` selbst.

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


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Diese API ist nicht mehr experimentell. |
| v13.6.0, v12.16.0 | Hinzugefügt in: v13.6.0, v12.16.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `regexp` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Erwartet, dass die `string`-Eingabe mit dem regulären Ausdruck übereinstimmt.

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

Wenn die Werte nicht übereinstimmen oder das `string`-Argument einen anderen Typ als `string` hat, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message`-Eigenschaft ausgelöst, die auf den Wert des `message`-Parameters gesetzt ist. Wenn der `message`-Parameter undefiniert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message`-Parameter eine Instanz eines [`Error`](/de/nodejs/api/errors#class-error) ist, wird dieser anstelle des [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) ausgelöst.

## `assert.notDeepEqual(actual, expected[, message])` {#assertnotdeepequalactual-expected-message}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0, v14.18.0 | Im Legacy-Assertion-Modus wurde der Status von Deprecated zu Legacy geändert. |
| v14.0.0 | NaN wird nun als identisch behandelt, wenn beide Seiten NaN sind. |
| v9.0.0 | Die `Error`-Namen und -Meldungen werden nun korrekt verglichen. |
| v8.0.0 | Der `Set`- und `Map`-Inhalt wird ebenfalls verglichen. |
| v6.4.0, v4.7.1 | Typed-Array-Slices werden jetzt korrekt verarbeitet. |
| v6.1.0, v4.5.0 | Objekte mit zirkulären Referenzen können jetzt als Eingaben verwendet werden. |
| v5.10.1, v4.4.3 | Handle non-`Uint8Array` typed arrays correctly. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Strikter Assertion-Modus**

Ein Alias von [`assert.notDeepStrictEqual()`](/de/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).

**Legacy-Assertion-Modus**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`assert.notDeepStrictEqual()`](/de/nodejs/api/assert#assertnotdeepstrictequalactual-expected-message).
:::

Testet auf tiefe Ungleichheit. Gegenteil von [`assert.deepEqual()`](/de/nodejs/api/assert#assertdeepequalactual-expected-message).

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

Wenn die Werte tief gleich sind, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message`-Eigenschaft ausgelöst, die auf den Wert des `message`-Parameters gesetzt ist. Wenn der `message`-Parameter undefiniert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message`-Parameter eine Instanz eines [`Error`](/de/nodejs/api/errors#class-error) ist, wird dieser anstelle des `AssertionError` ausgelöst.


## `assert.notDeepStrictEqual(actual, expected[, message])` {#assertnotdeepstrictequalactual-expected-message}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | `-0` und `+0` werden nicht mehr als gleich angesehen. |
| v9.0.0 | `NaN` wird jetzt mit dem [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero)-Vergleich verglichen. |
| v9.0.0 | Die `Error`-Namen und -Meldungen werden jetzt korrekt verglichen. |
| v8.0.0 | Der Inhalt von `Set` und `Map` wird ebenfalls verglichen. |
| v6.1.0 | Objekte mit zirkulären Referenzen können jetzt als Eingaben verwendet werden. |
| v6.4.0, v4.7.1 | Typed-Array-Slices werden jetzt korrekt verarbeitet. |
| v5.10.1, v4.4.3 | Behandle nicht-`Uint8Array` Typed Arrays korrekt. |
| v1.2.0 | Hinzugefügt in: v1.2.0 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testet auf tiefe strikte Ungleichheit. Gegenteil von [`assert.deepStrictEqual()`](/de/nodejs/api/assert#assertdeepstrictequalactual-expected-message).

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

Wenn die Werte tief und strikt gleich sind, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) ausgelöst, wobei die Eigenschaft `message` auf den Wert des Parameters `message` gesetzt ist. Wenn der Parameter `message` nicht definiert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der Parameter `message` eine Instanz von [`Error`](/de/nodejs/api/errors#class-error) ist, dann wird dieser anstelle des [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) geworfen.

## `assert.notEqual(actual, expected[, message])` {#assertnotequalactual-expected-message}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0, v14.18.0 | Im Legacy-Assertion-Modus wurde der Status von Deprecated zu Legacy geändert. |
| v14.0.0 | NaN wird jetzt als identisch behandelt, wenn beide Seiten NaN sind. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

**Strikter Assertionsmodus**

Ein Alias von [`assert.notStrictEqual()`](/de/nodejs/api/assert#assertnotstrictequalactual-expected-message).

**Legacy-Assertionsmodus**

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) [Stabilität: 3](/de/nodejs/api/documentation#stability-index) - Legacy: Verwenden Sie stattdessen [`assert.notStrictEqual()`](/de/nodejs/api/assert#assertnotstrictequalactual-expected-message).
:::

Testet flache, erzwungene Ungleichheit mit dem [`!=` Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Inequality). `NaN` wird speziell behandelt und als identisch behandelt, wenn beide Seiten `NaN` sind.

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

Wenn die Werte gleich sind, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) ausgelöst, wobei die Eigenschaft `message` auf den Wert des Parameters `message` gesetzt ist. Wenn der Parameter `message` nicht definiert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der Parameter `message` eine Instanz von [`Error`](/de/nodejs/api/errors#class-error) ist, dann wird dieser anstelle des `AssertionError` geworfen.


## `assert.notStrictEqual(actual, expected[, message])` {#assertnotstrictequalactual-expected-message}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Verwendeter Vergleich von strikter Gleichheit zu `Object.is()` geändert. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testet die strikte Ungleichheit zwischen den Parametern `actual` und `expected`, wie durch [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) bestimmt.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.notStrictEqual(1, 2);
// OK

assert.notStrictEqual(1, 1);
// AssertionError [ERR_ASSERTION]: Es wurde erwartet, dass "actual" strikt ungleich ist zu:
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
// AssertionError [ERR_ASSERTION]: Es wurde erwartet, dass "actual" strikt ungleich ist zu:
//
// 1

assert.notStrictEqual(1, '1');
// OK
```
:::

Wenn die Werte strikt gleich sind, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message`-Eigenschaft ausgelöst, die dem Wert des `message`-Parameters entspricht. Wenn der `message`-Parameter undefiniert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message`-Parameter eine Instanz eines [`Error`](/de/nodejs/api/errors#class-error) ist, wird dieser anstelle des `AssertionError` ausgelöst.

## `assert.ok(value[, message])` {#assertokvalue-message}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Das `assert.ok()` (ohne Argumente) verwendet jetzt eine vordefinierte Fehlermeldung. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testet, ob `value` truthy ist. Es ist äquivalent zu `assert.equal(!!value, true, message)`.

Wenn `value` nicht truthy ist, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message`-Eigenschaft ausgelöst, die dem Wert des `message`-Parameters entspricht. Wenn der `message`-Parameter `undefined` ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message`-Parameter eine Instanz eines [`Error`](/de/nodejs/api/errors#class-error) ist, wird dieser anstelle des `AssertionError` ausgelöst. Wenn überhaupt keine Argumente übergeben werden, wird `message` auf die Zeichenfolge gesetzt: `'No value argument passed to `assert.ok()`'`.

Beachten Sie, dass in der `repl` die Fehlermeldung anders ist als die, die in einer Datei ausgelöst wird! Weitere Details finden Sie unten.

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

**Hinzugefügt in: v10.0.0**

- `asyncFn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Objekt\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Erwartet das `asyncFn` Promise oder, falls `asyncFn` eine Funktion ist, ruft die Funktion sofort auf und wartet, bis das zurückgegebene Promise abgeschlossen ist. Anschließend wird geprüft, ob das Promise abgelehnt wird.

Wenn `asyncFn` eine Funktion ist und synchron einen Fehler auslöst, gibt `assert.rejects()` ein abgelehntes `Promise` mit diesem Fehler zurück. Wenn die Funktion kein Promise zurückgibt, gibt `assert.rejects()` ein abgelehntes `Promise` mit einem [`ERR_INVALID_RETURN_VALUE`](/de/nodejs/api/errors#err_invalid_return_value)-Fehler zurück. In beiden Fällen wird der Fehlerhandler übersprungen.

Abgesehen von der asynchronen Natur, auf den Abschluss zu warten, verhält es sich identisch zu [`assert.throws()`](/de/nodejs/api/assert#assertthrowsfn-error-message).

Falls angegeben, kann `error` eine [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), eine Validierungsfunktion, ein Objekt, bei dem jede Eigenschaft getestet wird, oder eine Instanz eines Fehlers sein, bei dem jede Eigenschaft getestet wird, einschließlich der nicht aufzählbaren Eigenschaften `message` und `name`.

Falls angegeben, ist `message` die Nachricht, die von der [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) bereitgestellt wird, wenn `asyncFn` nicht ablehnt.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

await assert.rejects(
  async () => {
    throw new TypeError('Falscher Wert');
  },
  {
    name: 'TypeError',
    message: 'Falscher Wert',
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Falscher Wert');
    },
    {
      name: 'TypeError',
      message: 'Falscher Wert',
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
    throw new TypeError('Falscher Wert');
  },
  (err) => {
    assert.strictEqual(err.name, 'TypeError');
    assert.strictEqual(err.message, 'Falscher Wert');
    return true;
  },
);
```

```js [CJS]
const assert = require('node:assert/strict');

(async () => {
  await assert.rejects(
    async () => {
      throw new TypeError('Falscher Wert');
    },
    (err) => {
      assert.strictEqual(err.name, 'TypeError');
      assert.strictEqual(err.message, 'Falscher Wert');
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
  Promise.reject(new Error('Falscher Wert')),
  Error,
).then(() => {
  // ...
});
```

```js [CJS]
const assert = require('node:assert/strict');

assert.rejects(
  Promise.reject(new Error('Falscher Wert')),
  Error,
).then(() => {
  // ...
});
```
:::

`error` darf keine Zeichenkette sein. Wenn eine Zeichenkette als zweites Argument angegeben wird, wird angenommen, dass `error` weggelassen wurde und die Zeichenkette stattdessen für `message` verwendet wird. Dies kann zu leicht zu übersehenden Fehlern führen. Bitte lesen Sie das Beispiel in [`assert.throws()`](/de/nodejs/api/assert#assertthrowsfn-error-message) sorgfältig durch, wenn die Verwendung einer Zeichenkette als zweites Argument in Betracht gezogen wird.


## `assert.strictEqual(actual, expected[, message])` {#assertstrictequalactual-expected-message}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Verwendeter Vergleich von strikter Gleichheit zu `Object.is()` geändert. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Testet die strikte Gleichheit zwischen den Parametern `actual` und `expected`, wie sie durch [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) bestimmt wird.



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

Wenn die Werte nicht strikt gleich sind, wird ein [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) mit einer `message`-Eigenschaft ausgelöst, die auf den Wert des `message`-Parameters gesetzt ist. Wenn der `message`-Parameter undefiniert ist, wird eine Standardfehlermeldung zugewiesen. Wenn der `message`-Parameter eine Instanz von [`Error`](/de/nodejs/api/errors#class-error) ist, wird dieser anstelle des [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) ausgelöst.


## `assert.throws(fn[, error][, message])` {#assertthrowsfn-error-message}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.2.0 | Der `error`-Parameter kann jetzt ein Objekt sein, das reguläre Ausdrücke enthält. |
| v9.9.0 | Der `error`-Parameter kann jetzt auch ein Objekt sein. |
| v4.2.0 | Der `error`-Parameter kann jetzt eine Pfeilfunktion sein. |
| v0.1.21 | Hinzugefügt in: v0.1.21 |
:::

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `error` [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<Objekt\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Erwartet, dass die Funktion `fn` einen Fehler auslöst.

Falls angegeben, kann `error` eine [`Class`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions), eine Validierungsfunktion, ein Validierungsobjekt, bei dem jede Eigenschaft auf strikte tiefe Gleichheit getestet wird, oder eine Instanz eines Fehlers sein, bei dem jede Eigenschaft auf strikte tiefe Gleichheit getestet wird, einschließlich der nicht aufzählbaren Eigenschaften `message` und `name`. Bei Verwendung eines Objekts ist es auch möglich, einen regulären Ausdruck zu verwenden, wenn gegen eine Zeichenketten-Eigenschaft validiert wird. Siehe unten für Beispiele.

Falls angegeben, wird `message` an die von `AssertionError` bereitgestellte Nachricht angehängt, falls der Aufruf von `fn` keinen Fehler auslöst oder die Fehlervalidierung fehlschlägt.

Benutzerdefiniertes Validierungsobjekt/Fehlerinstanz:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

const err = new TypeError('Falscher Wert');
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
    message: 'Falscher Wert',
    info: {
      nested: true,
      baz: 'text',
    },
    // Es werden nur Eigenschaften des Validierungsobjekts getestet.
    // Die Verwendung von verschachtelten Objekten erfordert, dass alle Eigenschaften vorhanden sind. Andernfalls
    // schlägt die Validierung fehl.
  },
);

// Verwenden von regulären Ausdrücken zur Validierung von Fehlereigenschaften:
assert.throws(
  () => {
    throw err;
  },
  {
    // Die Eigenschaften `name` und `message` sind Zeichenketten, und die Verwendung regulärer
    // Ausdrücke darauf gleicht gegen die Zeichenkette ab. Wenn sie fehlschlagen, wird ein
    // Fehler ausgelöst.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // Es ist nicht möglich, reguläre Ausdrücke für verschachtelte Eigenschaften zu verwenden!
      baz: 'text',
    },
    // Die `reg`-Eigenschaft enthält einen regulären Ausdruck, und nur wenn das
    // Validierungsobjekt einen identischen regulären Ausdruck enthält, wird er
    // bestanden.
    reg: /abc/i,
  },
);

// Fehler aufgrund der unterschiedlichen Eigenschaften `message` und `name`:
assert.throws(
  () => {
    const otherErr = new Error('Nicht gefunden');
    // Kopieren Sie alle aufzählbaren Eigenschaften von `err` nach `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Die Eigenschaften `message` und `name` des Fehlers werden ebenfalls geprüft, wenn ein
  // Fehler als Validierungsobjekt verwendet wird.
  err,
);
```

```js [CJS]
const assert = require('node:assert/strict');

const err = new TypeError('Falscher Wert');
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
    message: 'Falscher Wert',
    info: {
      nested: true,
      baz: 'text',
    },
    // Es werden nur Eigenschaften des Validierungsobjekts getestet.
    // Die Verwendung von verschachtelten Objekten erfordert, dass alle Eigenschaften vorhanden sind. Andernfalls
    // schlägt die Validierung fehl.
  },
);

// Verwenden von regulären Ausdrücken zur Validierung von Fehlereigenschaften:
assert.throws(
  () => {
    throw err;
  },
  {
    // Die Eigenschaften `name` und `message` sind Zeichenketten, und die Verwendung regulärer
    // Ausdrücke darauf gleicht gegen die Zeichenkette ab. Wenn sie fehlschlagen, wird ein
    // Fehler ausgelöst.
    name: /^TypeError$/,
    message: /Wrong/,
    foo: 'bar',
    info: {
      nested: true,
      // Es ist nicht möglich, reguläre Ausdrücke für verschachtelte Eigenschaften zu verwenden!
      baz: 'text',
    },
    // Die `reg`-Eigenschaft enthält einen regulären Ausdruck, und nur wenn das
    // Validierungsobjekt einen identischen regulären Ausdruck enthält, wird er
    // bestanden.
    reg: /abc/i,
  },
);

// Fehler aufgrund der unterschiedlichen Eigenschaften `message` und `name`:
assert.throws(
  () => {
    const otherErr = new Error('Nicht gefunden');
    // Kopieren Sie alle aufzählbaren Eigenschaften von `err` nach `otherErr`.
    for (const [key, value] of Object.entries(err)) {
      otherErr[key] = value;
    }
    throw otherErr;
  },
  // Die Eigenschaften `message` und `name` des Fehlers werden ebenfalls geprüft, wenn ein
  // Fehler als Validierungsobjekt verwendet wird.
  err,
);
```
:::

Validate instanceof using constructor:

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Falscher Wert');
  },
  Error,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Falscher Wert');
  },
  Error,
);
```
:::

Validieren der Fehlermeldung mithilfe von [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions):

Die Verwendung eines regulären Ausdrucks führt `.toString` für das Fehlerobjekt aus und enthält daher auch den Fehlernamen.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Falscher Wert');
  },
  /^Error: Falscher Wert$/,
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Falscher Wert');
  },
  /^Error: Falscher Wert$/,
);
```
:::

Benutzerdefinierte Fehlerüberprüfung:

Die Funktion muss `true` zurückgeben, um anzuzeigen, dass alle internen Validierungen bestanden wurden. Andernfalls schlägt sie mit einem [`AssertionError`](/de/nodejs/api/assert#class-assertassertionerror) fehl.

::: code-group
```js [ESM]
import assert from 'node:assert/strict';

assert.throws(
  () => {
    throw new Error('Falscher Wert');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Vermeiden Sie es, etwas anderes als `true` von Validierungsfunktionen zurückzugeben.
    // Andernfalls ist nicht klar, welcher Teil der Validierung fehlgeschlagen ist. Werfen Sie stattdessen
    // einen Fehler über die spezifische Validierung, die fehlgeschlagen ist (wie in diesem
    // Beispiel), und fügen Sie diesem Fehler so viele hilfreiche Debugging-Informationen wie
    // möglich hinzu.
    return true;
  },
  'Unerwarteter Fehler',
);
```

```js [CJS]
const assert = require('node:assert/strict');

assert.throws(
  () => {
    throw new Error('Falscher Wert');
  },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err));
    // Vermeiden Sie es, etwas anderes als `true` von Validierungsfunktionen zurückzugeben.
    // Andernfalls ist nicht klar, welcher Teil der Validierung fehlgeschlagen ist. Werfen Sie stattdessen
    // einen Fehler über die spezifische Validierung, die fehlgeschlagen ist (wie in diesem
    // Beispiel), und fügen Sie diesem Fehler so viele hilfreiche Debugging-Informationen wie
    // möglich hinzu.
    return true;
  },
  'Unerwarteter Fehler',
);
```
:::

`error` darf keine Zeichenkette sein. Wenn eine Zeichenkette als zweites Argument angegeben wird, wird angenommen, dass `error` weggelassen wurde und die Zeichenkette stattdessen für `message` verwendet wird. Dies kann zu leicht zu übersehenden Fehlern führen. Die Verwendung derselben Nachricht wie die ausgelöste Fehlermeldung führt zu einem `ERR_AMBIGUOUS_ARGUMENT`-Fehler. Bitte lesen Sie das folgende Beispiel sorgfältig durch, wenn die Verwendung einer Zeichenkette als zweites Argument in Betracht gezogen wird:

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

// Das zweite Argument ist eine Zeichenkette und die Eingabefunktion hat einen Fehler ausgelöst.
// Der erste Fall löst keinen Fehler aus, da er nicht mit der Fehlermeldung
// übereinstimmt, die von der Eingabefunktion ausgelöst wird!
assert.throws(throwingFirst, 'Second');
// Im nächsten Beispiel hat die Nachricht keinen Vorteil gegenüber der Nachricht aus dem
// Fehler, und da nicht klar ist, ob der Benutzer tatsächlich gegen die Fehlermeldung
// vergleichen wollte, löst Node.js einen `ERR_AMBIGUOUS_ARGUMENT`-Fehler aus.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// Die Zeichenkette wird nur (als Nachricht) verwendet, falls die Funktion keinen Fehler auslöst:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Fehlende erwartete Ausnahme: Second

// Wenn beabsichtigt war, die Fehlermeldung zu vergleichen, tun Sie dies stattdessen:
// Es löst keinen Fehler aus, da die Fehlermeldungen übereinstimmen.
assert.throws(throwingSecond, /Second$/);

// Wenn die Fehlermeldung nicht übereinstimmt, wird ein AssertionError ausgelöst.
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

// Das zweite Argument ist eine Zeichenkette und die Eingabefunktion hat einen Fehler ausgelöst.
// Der erste Fall löst keinen Fehler aus, da er nicht mit der Fehlermeldung
// übereinstimmt, die von der Eingabefunktion ausgelöst wird!
assert.throws(throwingFirst, 'Second');
// Im nächsten Beispiel hat die Nachricht keinen Vorteil gegenüber der Nachricht aus dem
// Fehler, und da nicht klar ist, ob der Benutzer tatsächlich gegen die Fehlermeldung
// vergleichen wollte, löst Node.js einen `ERR_AMBIGUOUS_ARGUMENT`-Fehler aus.
assert.throws(throwingSecond, 'Second');
// TypeError [ERR_AMBIGUOUS_ARGUMENT]

// Die Zeichenkette wird nur (als Nachricht) verwendet, falls die Funktion keinen Fehler auslöst:
assert.throws(notThrowing, 'Second');
// AssertionError [ERR_ASSERTION]: Fehlende erwartete Ausnahme: Second

// Wenn beabsichtigt war, die Fehlermeldung zu vergleichen, tun Sie dies stattdessen:
// Es löst keinen Fehler aus, da die Fehlermeldungen übereinstimmen.
assert.throws(throwingSecond, /Second$/);

// Wenn die Fehlermeldung nicht übereinstimmt, wird ein AssertionError ausgelöst.
assert.throws(throwingFirst, /Second$/);
// AssertionError [ERR_ASSERTION]
```
:::

Vermeiden Sie aufgrund der verwirrenden, fehleranfälligen Notation eine Zeichenkette als zweites Argument.


## `assert.partialDeepStrictEqual(actual, expected[, message])` {#assertpartialdeepstrictequalactual-expected-message}

**Hinzugefügt in: v23.4.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

- `actual` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `expected` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

[`assert.partialDeepStrictEqual()`](/de/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) Bestätigt die Äquivalenz zwischen den Parametern `actual` und `expected` durch einen tiefen Vergleich, wobei sichergestellt wird, dass alle Eigenschaften im Parameter `expected` im Parameter `actual` mit äquivalenten Werten vorhanden sind, ohne Typumwandlung zuzulassen. Der Hauptunterschied zu [`assert.deepStrictEqual()`](/de/nodejs/api/assert#assertdeepstrictequalactual-expected-message) besteht darin, dass [`assert.partialDeepStrictEqual()`](/de/nodejs/api/assert#assertpartialdeepstrictequalactual-expected-message) nicht erfordert, dass alle Eigenschaften im Parameter `actual` im Parameter `expected` vorhanden sind. Diese Methode sollte immer die gleichen Testfälle wie [`assert.deepStrictEqual()`](/de/nodejs/api/assert#assertdeepstrictequalactual-expected-message) bestehen und sich wie eine Obermenge davon verhalten.

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

