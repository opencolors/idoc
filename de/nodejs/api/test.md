---
title: Node.js Test Runner
description: Das Node.js Test Runner Modul bietet eine integrierte Lösung zum Schreiben und Ausführen von Tests in Node.js Anwendungen. Es unterstützt verschiedene Testformate, Berichte zur Abdeckung und integriert sich mit populären Test-Frameworks.
head:
  - - meta
    - name: og:title
      content: Node.js Test Runner | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Node.js Test Runner Modul bietet eine integrierte Lösung zum Schreiben und Ausführen von Tests in Node.js Anwendungen. Es unterstützt verschiedene Testformate, Berichte zur Abdeckung und integriert sich mit populären Test-Frameworks.
  - - meta
    - name: twitter:title
      content: Node.js Test Runner | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Node.js Test Runner Modul bietet eine integrierte Lösung zum Schreiben und Ausführen von Tests in Node.js Anwendungen. Es unterstützt verschiedene Testformate, Berichte zur Abdeckung und integriert sich mit populären Test-Frameworks.
---


# Test Runner {#test-runner}

::: info [Historie]
| Version  | Änderungen                                   |
| :------- | :------------------------------------------- |
| v20.0.0  | Der Test Runner ist jetzt stabil.            |
| v18.0.0, v16.17.0 | Hinzugefügt in: v18.0.0, v16.17.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

Das `node:test`-Modul erleichtert die Erstellung von JavaScript-Tests. Um darauf zuzugreifen:

::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

Dieses Modul ist nur unter dem `node:`-Schema verfügbar.

Über das `test`-Modul erstellte Tests bestehen aus einer einzelnen Funktion, die auf eine von drei Arten verarbeitet wird:

Das folgende Beispiel veranschaulicht, wie Tests mit dem `test`-Modul geschrieben werden.

```js [ESM]
test('synchroner bestandener Test', (t) => {
  // Dieser Test besteht, weil er keine Ausnahme auslöst.
  assert.strictEqual(1, 1);
});

test('synchroner fehlgeschlagener Test', (t) => {
  // Dieser Test schlägt fehl, weil er eine Ausnahme auslöst.
  assert.strictEqual(1, 2);
});

test('asynchroner bestandener Test', async (t) => {
  // Dieser Test besteht, weil das von der asynchronen
  // Funktion zurückgegebene Promise erfüllt und nicht abgelehnt wird.
  assert.strictEqual(1, 1);
});

test('asynchroner fehlgeschlagener Test', async (t) => {
  // Dieser Test schlägt fehl, weil das von der asynchronen
  // Funktion zurückgegebene Promise abgelehnt wird.
  assert.strictEqual(1, 2);
});

test('fehlgeschlagener Test mit Promises', (t) => {
  // Promises können auch direkt verwendet werden.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('Dies führt dazu, dass der Test fehlschlägt'));
    });
  });
});

test('Callback-Bestanden-Test', (t, done) => {
  // done() ist die Callback-Funktion. Wenn setImmediate() ausgeführt wird, ruft es
  // done() ohne Argumente auf.
  setImmediate(done);
});

test('Callback-Fehlgeschlagen-Test', (t, done) => {
  // Wenn setImmediate() ausgeführt wird, wird done() mit einem Error-Objekt aufgerufen und
  // der Test schlägt fehl.
  setImmediate(() => {
    done(new Error('Callback-Fehler'));
  });
});
```
Wenn Tests fehlschlagen, wird der Prozess-Exit-Code auf `1` gesetzt.


## Subtests {#subtests}

Die `test()`-Methode des Testkontexts ermöglicht die Erstellung von Subtests. Sie ermöglicht es Ihnen, Ihre Tests hierarchisch zu strukturieren, wobei Sie verschachtelte Tests innerhalb eines größeren Tests erstellen können. Diese Methode verhält sich identisch zur `test()`-Funktion der obersten Ebene. Das folgende Beispiel demonstriert die Erstellung eines Tests der obersten Ebene mit zwei Subtests.

```js [ESM]
test('top level test', async (t) => {
  await t.test('subtest 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subtest 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
In diesem Beispiel wird `await` verwendet, um sicherzustellen, dass beide Subtests abgeschlossen sind. Dies ist notwendig, da Tests nicht auf den Abschluss ihrer Subtests warten, anders als Tests, die innerhalb von Suiten erstellt werden. Alle Subtests, die noch ausstehen, wenn ihr übergeordneter Test beendet wird, werden abgebrochen und als Fehler behandelt. Alle Subtest-Fehler führen dazu, dass der übergeordnete Test fehlschlägt.

## Tests überspringen {#skipping-tests}

Einzelne Tests können übersprungen werden, indem die Option `skip` an den Test übergeben wird, oder indem die Methode `skip()` des Testkontexts aufgerufen wird, wie im folgenden Beispiel gezeigt.

```js [ESM]
// Die Skip-Option wird verwendet, aber keine Nachricht bereitgestellt.
test('skip option', { skip: true }, (t) => {
  // Dieser Code wird nie ausgeführt.
});

// Die Skip-Option wird verwendet und eine Nachricht bereitgestellt.
test('skip option with message', { skip: 'this is skipped' }, (t) => {
  // Dieser Code wird nie ausgeführt.
});

test('skip() method', (t) => {
  // Stellen Sie sicher, dass Sie auch hier zurückkehren, wenn der Test zusätzliche Logik enthält.
  t.skip();
});

test('skip() method with message', (t) => {
  // Stellen Sie sicher, dass Sie auch hier zurückkehren, wenn der Test zusätzliche Logik enthält.
  t.skip('this is skipped');
});
```
## TODO-Tests {#todo-tests}

Einzelne Tests können als fehlerhaft oder unvollständig markiert werden, indem die Option `todo` an den Test übergeben wird, oder indem die Methode `todo()` des Testkontexts aufgerufen wird, wie im folgenden Beispiel gezeigt. Diese Tests stellen eine ausstehende Implementierung oder einen Fehler dar, der behoben werden muss. TODO-Tests werden ausgeführt, aber nicht als Testfehler behandelt und beeinflussen daher nicht den Prozess-Exit-Code. Wenn ein Test sowohl als TODO als auch als übersprungen markiert ist, wird die TODO-Option ignoriert.

```js [ESM]
// Die Todo-Option wird verwendet, aber keine Nachricht bereitgestellt.
test('todo option', { todo: true }, (t) => {
  // Dieser Code wird ausgeführt, aber nicht als Fehler behandelt.
  throw new Error('this does not fail the test');
});

// Die Todo-Option wird verwendet und eine Nachricht bereitgestellt.
test('todo option with message', { todo: 'this is a todo test' }, (t) => {
  // Dieser Code wird ausgeführt.
});

test('todo() method', (t) => {
  t.todo();
});

test('todo() method with message', (t) => {
  t.todo('this is a todo test and is not treated as a failure');
  throw new Error('this does not fail the test');
});
```

## `describe()`- und `it()`-Aliase {#describe-and-it-aliases}

Suites und Tests können auch mit den Funktionen `describe()` und `it()` geschrieben werden. [`describe()`](/de/nodejs/api/test#describename-options-fn) ist ein Alias für [`suite()`](/de/nodejs/api/test#suitename-options-fn) und [`it()`](/de/nodejs/api/test#itname-options-fn) ist ein Alias für [`test()`](/de/nodejs/api/test#testname-options-fn).

```js [ESM]
describe('A thing', () => {
  it('should work', () => {
    assert.strictEqual(1, 1);
  });

  it('should be ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('a nested thing', () => {
    it('should work', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` und `it()` werden aus dem Modul `node:test` importiert.

::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## `only`-Tests {#only-tests}

Wenn Node.js mit der Befehlszeilenoption [`--test-only`](/de/nodejs/api/cli#--test-only) gestartet wird oder die Testisolation deaktiviert ist, ist es möglich, alle Tests bis auf eine ausgewählte Teilmenge zu überspringen, indem die Option `only` an die Tests übergeben wird, die ausgeführt werden sollen. Wenn ein Test mit der Option `only` gesetzt ist, werden auch alle Untertests ausgeführt. Wenn eine Suite die Option `only` gesetzt hat, werden alle Tests innerhalb der Suite ausgeführt, es sei denn, sie hat Nachkommen mit der Option `only` gesetzt, in diesem Fall werden nur diese Tests ausgeführt.

Bei Verwendung von [Untertests](/de/nodejs/api/test#subtests) innerhalb eines `test()`/`it()` ist es erforderlich, alle übergeordneten Tests mit der Option `only` zu markieren, um nur eine ausgewählte Teilmenge von Tests auszuführen.

Die `runOnly()`-Methode des Testkontexts kann verwendet werden, um dasselbe Verhalten auf der Ebene der Untertests zu implementieren. Tests, die nicht ausgeführt werden, werden aus der Ausgabe des Testläufers weggelassen.

```js [ESM]
// Angenommen, Node.js wird mit der Befehlszeilenoption --test-only ausgeführt.
// Die 'only'-Option der Suite ist gesetzt, daher werden diese Tests ausgeführt.
test('this test is run', { only: true }, async (t) => {
  // Innerhalb dieses Tests werden standardmäßig alle Untertests ausgeführt.
  await t.test('running subtest');

  // Der Testkontext kann aktualisiert werden, um Untertests mit der Option 'only' auszuführen.
  t.runOnly(true);
  await t.test('this subtest is now skipped');
  await t.test('this subtest is run', { only: true });

  // Schalten Sie den Kontext zurück, um alle Tests auszuführen.
  t.runOnly(false);
  await t.test('this subtest is now run');

  // Führen Sie diese Tests explizit nicht aus.
  await t.test('skipped subtest 3', { only: false });
  await t.test('skipped subtest 4', { skip: true });
});

// Die Option 'only' ist nicht gesetzt, daher wird dieser Test übersprungen.
test('this test is not run', () => {
  // Dieser Code wird nicht ausgeführt.
  throw new Error('fail');
});

describe('a suite', () => {
  // Die Option 'only' ist gesetzt, daher wird dieser Test ausgeführt.
  it('this test is run', { only: true }, () => {
    // Dieser Code wird ausgeführt.
  });

  it('this test is not run', () => {
    // Dieser Code wird nicht ausgeführt.
    throw new Error('fail');
  });
});

describe.only('a suite', () => {
  // Die Option 'only' ist gesetzt, daher wird dieser Test ausgeführt.
  it('this test is run', () => {
    // Dieser Code wird ausgeführt.
  });

  it('this test is run', () => {
    // Dieser Code wird ausgeführt.
  });
});
```

## Tests nach Namen filtern {#filtering-tests-by-name}

Die Kommandozeilenoption [`--test-name-pattern`](/de/nodejs/api/cli#--test-name-pattern) kann verwendet werden, um nur Tests auszuführen, deren Namen mit dem angegebenen Muster übereinstimmen, und die Option [`--test-skip-pattern`](/de/nodejs/api/cli#--test-skip-pattern) kann verwendet werden, um Tests zu überspringen, deren Namen mit dem angegebenen Muster übereinstimmen. Testnamensmuster werden als reguläre JavaScript-Ausdrücke interpretiert. Die Optionen `--test-name-pattern` und `--test-skip-pattern` können mehrfach angegeben werden, um verschachtelte Tests auszuführen. Für jeden Test, der ausgeführt wird, werden auch alle zugehörigen Test-Hooks, wie z. B. `beforeEach()`, ausgeführt. Tests, die nicht ausgeführt werden, werden aus der Ausgabe des Test-Runners entfernt.

Angenommen, die folgende Testdatei liegt vor, würde das Starten von Node.js mit der Option `--test-name-pattern="test [1-3]"` dazu führen, dass der Test-Runner `test 1`, `test 2` und `test 3` ausführt. Wenn `test 1` nicht mit dem Testnamensmuster übereinstimmt, würden seine Untertests nicht ausgeführt, obwohl sie mit dem Muster übereinstimmen. Der gleiche Satz von Tests könnte auch durch mehrfaches Übergeben von `--test-name-pattern` ausgeführt werden (z. B. `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"`, usw.).

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
Testnamensmuster können auch mithilfe von Literalen für reguläre Ausdrücke angegeben werden. Dies ermöglicht die Verwendung von Flags für reguläre Ausdrücke. Im vorherigen Beispiel würde das Starten von Node.js mit `--test-name-pattern="/test [4-5]/i"` (oder `--test-skip-pattern="/test [4-5]/i"`) `Test 4` und `Test 5` zuordnen, da das Muster nicht zwischen Groß- und Kleinschreibung unterscheidet.

Um einen einzelnen Test mit einem Muster zuzuordnen, können Sie ihm alle Namen seiner übergeordneten Tests voranstellen, die durch ein Leerzeichen getrennt sind, um sicherzustellen, dass er eindeutig ist. Zum Beispiel, gegeben die folgende Testdatei:

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
Das Starten von Node.js mit `--test-name-pattern="test 1 some test"` würde nur `some test` in `test 1` zuordnen.

Testnamensmuster ändern nicht die Menge der Dateien, die der Test-Runner ausführt.

Wenn sowohl `--test-name-pattern` als auch `--test-skip-pattern` angegeben werden, müssen Tests **beide** Anforderungen erfüllen, um ausgeführt zu werden.


## Überflüssige asynchrone Aktivität {#extraneous-asynchronous-activity}

Sobald eine Testfunktion die Ausführung beendet hat, werden die Ergebnisse so schnell wie möglich gemeldet, wobei die Reihenfolge der Tests beibehalten wird. Es ist jedoch möglich, dass die Testfunktion asynchrone Aktivitäten erzeugt, die den Test selbst überdauern. Der Test Runner verarbeitet diese Art von Aktivität, verzögert aber nicht die Meldung der Testergebnisse, um sie zu berücksichtigen.

Im folgenden Beispiel wird ein Test mit zwei noch ausstehenden `setImmediate()`-Operationen abgeschlossen. Das erste `setImmediate()` versucht, einen neuen Untertest zu erstellen. Da der übergeordnete Test bereits beendet ist und seine Ergebnisse ausgegeben hat, wird der neue Untertest sofort als fehlgeschlagen markiert und später an den [\<TestsStream\>](/de/nodejs/api/test#class-testsstream) gemeldet.

Das zweite `setImmediate()` erzeugt ein `uncaughtException`-Ereignis. `uncaughtException`- und `unhandledRejection`-Ereignisse, die von einem abgeschlossenen Test stammen, werden vom `test`-Modul als fehlgeschlagen markiert und vom [\<TestsStream\>](/de/nodejs/api/test#class-testsstream) als Diagnosewarnungen auf oberster Ebene gemeldet.

```js [ESM]
test('ein Test, der asynchrone Aktivität erzeugt', (t) => {
  setImmediate(() => {
    t.test('Untertest, der zu spät erstellt wird', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // Der Test endet nach dieser Zeile.
});
```
## Watch-Modus {#watch-mode}

**Hinzugefügt in: v19.2.0, v18.13.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Der Node.js Test Runner unterstützt die Ausführung im Watch-Modus durch Übergabe des `--watch` Flags:

```bash [BASH]
node --test --watch
```
Im Watch-Modus überwacht der Test Runner Änderungen an Testdateien und deren Abhängigkeiten. Wenn eine Änderung erkannt wird, führt der Test Runner die von der Änderung betroffenen Tests erneut aus. Der Test Runner wird so lange ausgeführt, bis der Prozess beendet wird.

## Ausführen von Tests über die Befehlszeile {#running-tests-from-the-command-line}

Der Node.js Test Runner kann über die Befehlszeile aufgerufen werden, indem das [`--test`](/de/nodejs/api/cli#--test) Flag übergeben wird:

```bash [BASH]
node --test
```
Standardmäßig führt Node.js alle Dateien aus, die mit diesen Mustern übereinstimmen:

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

Wenn [`--experimental-strip-types`](/de/nodejs/api/cli#--experimental-strip-types) angegeben wird, werden die folgenden zusätzlichen Muster abgeglichen:

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

Alternativ können ein oder mehrere Glob-Muster als letzte Argumente an den Node.js-Befehl übergeben werden, wie unten gezeigt. Glob-Muster folgen dem Verhalten von [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7). Die Glob-Muster sollten auf der Befehlszeile in doppelte Anführungszeichen gesetzt werden, um eine Shell-Expansion zu verhindern, die die Portabilität über verschiedene Systeme hinweg verringern kann.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
Übereinstimmende Dateien werden als Testdateien ausgeführt. Weitere Informationen zur Ausführung von Testdateien finden Sie im Abschnitt [Test Runner Ausführungsmodell](/de/nodejs/api/test#test-runner-execution-model).


### Test Runner Ausführungsmodell {#test-runner-execution-model}

Wenn die Testisolation auf Prozessebene aktiviert ist, wird jede übereinstimmende Testdatei in einem separaten Kindprozess ausgeführt. Die maximale Anzahl von Kindprozessen, die gleichzeitig ausgeführt werden, wird über das Flag [`--test-concurrency`](/de/nodejs/api/cli#--test-concurrency) gesteuert. Wenn der Kindprozess mit einem Exit-Code von 0 endet, gilt der Test als bestanden. Andernfalls gilt der Test als fehlgeschlagen. Testdateien müssen von Node.js ausführbar sein, müssen aber das Modul `node:test` nicht intern verwenden.

Jede Testdatei wird so ausgeführt, als wäre sie ein normales Skript. Das heißt, wenn die Testdatei selbst `node:test` verwendet, um Tests zu definieren, werden alle diese Tests innerhalb eines einzelnen Anwendungsthreads ausgeführt, unabhängig vom Wert der Option `concurrency` von [`test()`](/de/nodejs/api/test#testname-options-fn).

Wenn die Testisolation auf Prozessebene deaktiviert ist, wird jede übereinstimmende Testdatei in den Test Runner Prozess importiert. Sobald alle Testdateien geladen wurden, werden die Tests der obersten Ebene mit einer Parallelität von eins ausgeführt. Da alle Testdateien im selben Kontext ausgeführt werden, können Tests auf eine Weise miteinander interagieren, die bei aktivierter Isolation nicht möglich ist. Wenn beispielsweise ein Test auf einem globalen Zustand basiert, kann dieser Zustand durch einen Test aus einer anderen Datei geändert werden.

## Sammeln der Codeabdeckung {#collecting-code-coverage}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stability: 1](/de/nodejs/api/documentation#stability-index) - Experimental
:::

Wenn Node.js mit dem Kommandozeilen-Flag [`--experimental-test-coverage`](/de/nodejs/api/cli#--experimental-test-coverage) gestartet wird, wird die Codeabdeckung gesammelt und Statistiken werden gemeldet, sobald alle Tests abgeschlossen sind. Wenn die Umgebungsvariable [`NODE_V8_COVERAGE`](/de/nodejs/api/cli#node_v8_coveragedir) verwendet wird, um ein Codeabdeckungsverzeichnis anzugeben, werden die generierten V8-Abdeckungsdateien in dieses Verzeichnis geschrieben. Node.js-Kernmodule und Dateien in `node_modules/`-Verzeichnissen sind standardmäßig nicht im Abdeckungsbericht enthalten. Sie können jedoch explizit über das Flag [`--test-coverage-include`](/de/nodejs/api/cli#--test-coverage-include) einbezogen werden. Standardmäßig werden alle übereinstimmenden Testdateien vom Abdeckungsbericht ausgeschlossen. Ausschlüsse können mithilfe des Flags [`--test-coverage-exclude`](/de/nodejs/api/cli#--test-coverage-exclude) überschrieben werden. Wenn die Abdeckung aktiviert ist, wird der Abdeckungsbericht über das Ereignis `'test:coverage'` an alle [Testreporter](/de/nodejs/api/test#test-reporters) gesendet.

Die Abdeckung kann für eine Reihe von Zeilen mit der folgenden Kommentarsyntax deaktiviert werden:

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // Code in diesem Zweig wird niemals ausgeführt, aber die Zeilen werden für
  // Abdeckungszwecke ignoriert. Alle Zeilen, die dem 'disable'-Kommentar folgen, werden ignoriert,
  // bis ein entsprechender 'enable'-Kommentar gefunden wird.
  console.log('this is never executed');
}
/* node:coverage enable */
```
Die Abdeckung kann auch für eine bestimmte Anzahl von Zeilen deaktiviert werden. Nach der angegebenen Anzahl von Zeilen wird die Abdeckung automatisch wieder aktiviert. Wenn die Anzahl der Zeilen nicht explizit angegeben wird, wird eine einzelne Zeile ignoriert.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```

### Coverage-Reporter {#coverage-reporters}

Die `tap`- und `spec`-Reporter geben eine Zusammenfassung der Coverage-Statistiken aus. Es gibt auch einen `lcov`-Reporter, der eine `lcov`-Datei erzeugt, die als detaillierter Coverage-Bericht verwendet werden kann.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- Von diesem Reporter werden keine Testergebnisse gemeldet.
- Dieser Reporter sollte idealerweise zusammen mit einem anderen Reporter verwendet werden.

## Mocking {#mocking}

Das Modul `node:test` unterstützt Mocking während des Testens über ein Top-Level-Objekt `mock`. Das folgende Beispiel erstellt einen Spy für eine Funktion, die zwei Zahlen addiert. Der Spy wird dann verwendet, um zu bestätigen, dass die Funktion wie erwartet aufgerufen wurde.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('spioniert eine Funktion aus', () => {
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

  // Setzt die global verfolgten Mocks zurück.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('spioniert eine Funktion aus', () => {
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

  // Setzt die global verfolgten Mocks zurück.
  mock.reset();
});
```
:::

Die gleiche Mocking-Funktionalität wird auch auf dem [`TestContext`](/de/nodejs/api/test#class-testcontext)-Objekt jedes Tests bereitgestellt. Das folgende Beispiel erstellt einen Spy für eine Objektmethode unter Verwendung der API, die im `TestContext` verfügbar ist. Der Vorteil des Mocking über den Testkontext besteht darin, dass der Test Runner automatisch alle gemockten Funktionen wiederherstellt, sobald der Test abgeschlossen ist.

```js [ESM]
test('spioniert eine Objektmethode aus', (t) => {
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

### Timer {#timers}

Das Mocken von Timern ist eine Technik, die häufig in Softwaretests verwendet wird, um das Verhalten von Timern wie `setInterval` und `setTimeout` zu simulieren und zu steuern, ohne tatsächlich auf die angegebenen Zeitintervalle zu warten.

Eine vollständige Liste der Methoden und Funktionen finden Sie in der Klasse [`MockTimers`](/de/nodejs/api/test#class-mocktimers).

Dies ermöglicht es Entwicklern, zuverlässigere und besser vorhersagbare Tests für zeitabhängige Funktionen zu schreiben.

Das folgende Beispiel zeigt, wie `setTimeout` gemockt wird. Durch die Verwendung von `.enable({ apis: ['setTimeout'] });` werden die `setTimeout`-Funktionen in den Modulen [node:timers](/de/nodejs/api/timers) und [node:timers/promises](/de/nodejs/api/timers#timers-promises-api) sowie aus dem globalen Kontext von Node.js gemockt.

**Hinweis:** Das Destrukturieren von Funktionen wie `import { setTimeout } from 'node:timers'` wird von dieser API derzeit nicht unterstützt.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', () => {
  const fn = mock.fn();

  // Optionally choose what to mock
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Reset the globally tracked mocks.
  mock.timers.reset();

  // If you call reset mock instance, it will also reset timers instance
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', () => {
  const fn = mock.fn();

  // Optionally choose what to mock
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Reset the globally tracked mocks.
  mock.timers.reset();

  // If you call reset mock instance, it will also reset timers instance
  mock.reset();
});
```
:::

Die gleiche Mocking-Funktionalität wird auch in der Mock-Eigenschaft des [`TestContext`](/de/nodejs/api/test#class-testcontext)-Objekts jedes Tests bereitgestellt. Der Vorteil des Mockens über den Testkontext besteht darin, dass der Test Runner alle gemockten Timer-Funktionen automatisch wiederherstellt, sobald der Test abgeschlossen ist.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::


### Datumsangaben {#dates}

Die Mock-Timer-API ermöglicht auch das Mocken des `Date`-Objekts. Dies ist eine nützliche Funktion zum Testen zeitabhängiger Funktionen oder zum Simulieren interner Kalenderfunktionen wie `Date.now()`.

Die Datumsangaben-Implementierung ist ebenfalls Teil der [`MockTimers`](/de/nodejs/api/test#class-mocktimers)-Klasse. Dort finden Sie eine vollständige Liste der Methoden und Funktionen.

**Hinweis:** Datumsangaben und Timer sind voneinander abhängig, wenn sie zusammen gemockt werden. Das bedeutet, dass wenn Sie sowohl `Date` als auch `setTimeout` gemockt haben, das Vorrücken der Zeit auch das gemockte Datum vorrückt, da sie eine einzelne interne Uhr simulieren.

Das folgende Beispiel zeigt, wie das `Date`-Objekt gemockt und der aktuelle Wert von `Date.now()` abgerufen wird.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

Wenn keine anfängliche Epoche festgelegt ist, basiert das anfängliche Datum auf 0 in der Unix-Epoche. Dies ist der 1. Januar 1970, 00:00:00 UTC. Sie können ein anfängliches Datum festlegen, indem Sie eine `now`-Eigenschaft an die `.enable()`-Methode übergeben. Dieser Wert wird als anfängliches Datum für das gemockte `Date`-Objekt verwendet. Es kann entweder eine positive ganze Zahl oder ein anderes Date-Objekt sein.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

Sie können die `.setTime()`-Methode verwenden, um das gemockte Datum manuell auf eine andere Zeit zu verschieben. Diese Methode akzeptiert nur eine positive ganze Zahl.

**Hinweis:** Diese Methode führt alle gemockten Timer aus, die in der Vergangenheit der neuen Zeit liegen.

Im folgenden Beispiel setzen wir eine neue Zeit für das gemockte Datum.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Wenn Sie einen Timer haben, der in der Vergangenheit ausgeführt werden soll, wird er so ausgeführt, als ob die `.tick()`-Methode aufgerufen wurde. Dies ist nützlich, wenn Sie zeitabhängige Funktionen testen möchten, die bereits in der Vergangenheit liegen.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Die Verwendung von `.runAll()` führt alle Timer aus, die sich derzeit in der Warteschlange befinden. Dadurch wird auch das gemockte Datum auf die Zeit des letzten Timers vorgerückt, der ausgeführt wurde, als ob die Zeit vergangen wäre.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::


## Snapshot-Tests {#snapshot-testing}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

Snapshot-Tests ermöglichen es, beliebige Werte in String-Werte zu serialisieren und mit einem Satz bekannter guter Werte zu vergleichen. Die bekannten guten Werte werden als Snapshots bezeichnet und in einer Snapshot-Datei gespeichert. Snapshot-Dateien werden vom Test Runner verwaltet, sind aber so konzipiert, dass sie für Menschen lesbar sind, um das Debugging zu erleichtern. Best Practice ist, Snapshot-Dateien zusammen mit Ihren Testdateien in die Quellcodeverwaltung einzuchecken.

Snapshot-Dateien werden generiert, indem Node.js mit dem Kommandozeilen-Flag [`--test-update-snapshots`](/de/nodejs/api/cli#--test-update-snapshots) gestartet wird. Für jede Testdatei wird eine separate Snapshot-Datei generiert. Standardmäßig hat die Snapshot-Datei den gleichen Namen wie die Testdatei mit der Dateiendung `.snapshot`. Dieses Verhalten kann mit der Funktion `snapshot.setResolveSnapshotPath()` konfiguriert werden. Jede Snapshot-Assertion entspricht einem Export in der Snapshot-Datei.

Ein Beispiel für einen Snapshot-Test ist unten dargestellt. Wenn dieser Test zum ersten Mal ausgeführt wird, schlägt er fehl, da die entsprechende Snapshot-Datei nicht existiert.

```js [ESM]
// test.js
suite('Suite von Snapshot-Tests', () => {
  test('Snapshot-Test', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
Generieren Sie die Snapshot-Datei, indem Sie die Testdatei mit `--test-update-snapshots` ausführen. Der Test sollte bestanden werden und eine Datei namens `test.js.snapshot` im selben Verzeichnis wie die Testdatei erstellt werden. Der Inhalt der Snapshot-Datei ist unten dargestellt. Jeder Snapshot wird durch den vollständigen Namen des Tests und einen Zähler identifiziert, um zwischen Snapshots im selben Test zu unterscheiden.

```js [ESM]
exports[`Suite von Snapshot-Tests > Snapshot-Test 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`Suite von Snapshot-Tests > Snapshot-Test 2`] = `
5
`;
```
Sobald die Snapshot-Datei erstellt wurde, führen Sie die Tests erneut ohne das Flag `--test-update-snapshots` aus. Die Tests sollten jetzt bestanden werden.


## Test-Reporter {#test-reporters}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.9.0, v18.17.0 | Reporter werden nun unter `node:test/reporters` bereitgestellt. |
| v19.6.0, v18.15.0 | Hinzugefügt in: v19.6.0, v18.15.0 |
:::

Das `node:test`-Modul unterstützt das Übergeben von [`--test-reporter`](/de/nodejs/api/cli#--test-reporter)-Flags, damit der Test Runner einen bestimmten Reporter verwendet.

Die folgenden eingebauten Reporter werden unterstützt:

-  `spec` Der `spec`-Reporter gibt die Testergebnisse in einem für Menschen lesbaren Format aus. Dies ist der Standard-Reporter.
-  `tap` Der `tap`-Reporter gibt die Testergebnisse im [TAP](https://testanything.org/)-Format aus.
-  `dot` Der `dot`-Reporter gibt die Testergebnisse in einem kompakten Format aus, wobei jeder bestandene Test durch ein `.` und jeder fehlgeschlagene Test durch ein `X` dargestellt wird.
-  `junit` Der JUnit-Reporter gibt die Testergebnisse in einem jUnit-XML-Format aus.
-  `lcov` Der `lcov`-Reporter gibt die Testabdeckung aus, wenn er mit dem Flag [`--experimental-test-coverage`](/de/nodejs/api/cli#--experimental-test-coverage) verwendet wird.

Die genaue Ausgabe dieser Reporter kann sich zwischen den Node.js-Versionen ändern und sollte nicht programmatisch verwendet werden. Wenn programmatischer Zugriff auf die Ausgabe des Test Runners erforderlich ist, verwenden Sie die Ereignisse, die vom [\<TestsStream\>](/de/nodejs/api/test#class-testsstream) ausgegeben werden.

Die Reporter sind über das Modul `node:test/reporters` verfügbar:

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### Benutzerdefinierte Reporter {#custom-reporters}

[`--test-reporter`](/de/nodejs/api/cli#--test-reporter) kann verwendet werden, um einen Pfad zu einem benutzerdefinierten Reporter anzugeben. Ein benutzerdefinierter Reporter ist ein Modul, das einen Wert exportiert, der von [stream.compose](/de/nodejs/api/stream#streamcomposestreams) akzeptiert wird. Reporter sollten Ereignisse transformieren, die von einem [\<TestsStream\>](/de/nodejs/api/test#class-testsstream) ausgegeben werden.

Beispiel für einen benutzerdefinierten Reporter, der [\<stream.Transform\>](/de/nodejs/api/stream#class-streamtransform) verwendet:

::: code-group
```js [ESM]
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
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
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```
:::

Beispiel für einen benutzerdefinierten Reporter, der eine Generatorfunktion verwendet:

::: code-group
```js [ESM]
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
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
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```
:::

Der Wert, der an `--test-reporter` übergeben wird, sollte eine Zeichenkette sein, wie sie in einem `import()` in JavaScript-Code verwendet wird, oder ein Wert, der für [`--import`](/de/nodejs/api/cli#--importmodule) bereitgestellt wird.


### Mehrere Reporter {#multiple-reporters}

Das Flag [`--test-reporter`](/de/nodejs/api/cli#--test-reporter) kann mehrfach angegeben werden, um Testergebnisse in verschiedenen Formaten auszugeben. In diesem Fall ist es erforderlich, mit [`--test-reporter-destination`](/de/nodejs/api/cli#--test-reporter-destination) ein Ziel für jeden Reporter anzugeben. Das Ziel kann `stdout`, `stderr` oder ein Dateipfad sein. Reporter und Ziele werden entsprechend der Reihenfolge ihrer Angabe gepaart.

Im folgenden Beispiel wird der `spec`-Reporter nach `stdout` ausgeben, und der `dot`-Reporter nach `file.txt`:

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
Wenn nur ein Reporter angegeben wird, ist das Ziel standardmäßig `stdout`, es sei denn, ein Ziel wird explizit angegeben.

## `run([options])` {#runoptions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Die Option `cwd` wurde hinzugefügt. |
| v23.0.0 | Deckungs-Optionen wurden hinzugefügt. |
| v22.8.0 | Die Option `isolation` wurde hinzugefügt. |
| v22.6.0 | Die Option `globPatterns` wurde hinzugefügt. |
| v22.0.0, v20.14.0 | Die Option `forceExit` wurde hinzugefügt. |
| v20.1.0, v18.17.0 | Eine TestNamePatterns Option hinzugefügt. |
| v18.9.0, v16.19.0 | Hinzugefügt in: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für die Ausführung von Tests. Die folgenden Eigenschaften werden unterstützt:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn eine Zahl angegeben wird, werden so viele Testprozesse parallel ausgeführt, wobei jeder Prozess einer Testdatei entspricht. Wenn `true`, werden `os.availableParallelism() - 1` Testdateien parallel ausgeführt. Wenn `false`, wird nur eine Testdatei gleichzeitig ausgeführt. **Standard:** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt das aktuelle Arbeitsverzeichnis an, das vom Test Runner verwendet werden soll. Dient als Basispfad zum Auflösen von Dateien gemäß dem [Test Runner Ausführungsmodell](/de/nodejs/api/test#test-runner-execution-model). **Standard:** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array, das die Liste der auszuführenden Dateien enthält. **Standard:** Übereinstimmende Dateien aus dem [Test Runner Ausführungsmodell](/de/nodejs/api/test#test-runner-execution-model).
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Konfiguriert den Test Runner so, dass der Prozess beendet wird, sobald alle bekannten Tests ausgeführt wurden, auch wenn die Event-Loop andernfalls aktiv bleiben würde. **Standard:** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array, das die Liste der Glob-Muster enthält, die mit Testdateien übereinstimmen sollen. Diese Option kann nicht zusammen mit `files` verwendet werden. **Standard:** Übereinstimmende Dateien aus dem [Test Runner Ausführungsmodell](/de/nodejs/api/test#test-runner-execution-model).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Legt den Inspector-Port des Test-Child-Prozesses fest. Dies kann eine Zahl oder eine Funktion sein, die keine Argumente entgegennimmt und eine Zahl zurückgibt. Wenn ein Null-Wert angegeben wird, erhält jeder Prozess seinen eigenen Port, der von `process.debugPort` des primären Prozesses inkrementiert wird. Diese Option wird ignoriert, wenn die Option `isolation` auf `'none'` gesetzt ist, da keine Child-Prozesse erzeugt werden. **Standard:** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Konfiguriert die Art der Testisolation. Wenn sie auf `'process'` gesetzt ist, wird jede Testdatei in einem separaten Child-Prozess ausgeführt. Wenn sie auf `'none'` gesetzt ist, werden alle Testdateien im aktuellen Prozess ausgeführt. **Standard:** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn wahrheitsgemäß, führt der Testkontext nur Tests aus, bei denen die Option `only` gesetzt ist.
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Funktion, die die `TestsStream`-Instanz akzeptiert und zum Einrichten von Listenern verwendet werden kann, bevor Tests ausgeführt werden. **Standard:** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von CLI-Flags, die an die ausführbare `node`-Datei übergeben werden sollen, wenn die Subprozesse erzeugt werden. Diese Option hat keine Auswirkung, wenn `isolation` `'none'` ist. **Standard:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von CLI-Flags, die an jede Testdatei übergeben werden sollen, wenn die Subprozesse erzeugt werden. Diese Option hat keine Auswirkung, wenn `isolation` `'none'` ist. **Standard:** `[]`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen einer laufenden Testausführung.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Eine Zeichenkette, ein RegExp oder ein RegExp-Array, das verwendet werden kann, um nur Tests auszuführen, deren Name mit dem bereitgestellten Muster übereinstimmt. Testnamensmuster werden als reguläre JavaScript-Ausdrücke interpretiert. Für jeden Test, der ausgeführt wird, werden auch alle entsprechenden Testhooks ausgeführt, wie z. B. `beforeEach()`. **Standard:** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Eine Zeichenkette, ein RegExp oder ein RegExp-Array, das verwendet werden kann, um die Ausführung von Tests auszuschließen, deren Name mit dem bereitgestellten Muster übereinstimmt. Testnamensmuster werden als reguläre JavaScript-Ausdrücke interpretiert. Für jeden Test, der ausgeführt wird, werden auch alle entsprechenden Testhooks ausgeführt, wie z. B. `beforeEach()`. **Standard:** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach der die Testausführung fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem Elternteil. **Standard:** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob im Beobachtungsmodus ausgeführt werden soll oder nicht. **Standard:** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ausführen von Tests in einem bestimmten Shard. **Standard:** `undefined`.
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ist eine positive ganze Zahl zwischen 1 und `\<total\>`, die den Index des auszuführenden Shards angibt. Diese Option ist *erforderlich*.
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ist eine positive ganze Zahl, die die Gesamtzahl der Shards angibt, in die die Testdateien aufgeteilt werden sollen. Diese Option ist *erforderlich*.
  
    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aktivieren der [Codeabdeckungs-Erfassung](/de/nodejs/api/test#collecting-code-coverage). **Standard:** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Schließt bestimmte Dateien mit einem Glob-Muster von der Codeabdeckung aus, das sowohl absolute als auch relative Dateipfade abgleichen kann. Diese Eigenschaft gilt nur, wenn `coverage` auf `true` gesetzt wurde. Wenn sowohl `coverageExcludeGlobs` als auch `coverageIncludeGlobs` bereitgestellt werden, müssen Dateien **beide** Kriterien erfüllen, um in den Abdeckungsbericht aufgenommen zu werden. **Standard:** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Schließt bestimmte Dateien mit einem Glob-Muster in die Codeabdeckung ein, das sowohl absolute als auch relative Dateipfade abgleichen kann. Diese Eigenschaft gilt nur, wenn `coverage` auf `true` gesetzt wurde. Wenn sowohl `coverageExcludeGlobs` als auch `coverageIncludeGlobs` bereitgestellt werden, müssen Dateien **beide** Kriterien erfüllen, um in den Abdeckungsbericht aufgenommen zu werden. **Standard:** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Erfordert einen Mindestprozentsatz abgedeckter Zeilen. Wenn die Codeabdeckung den angegebenen Schwellenwert nicht erreicht, wird der Prozess mit dem Code `1` beendet. **Standard:** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Erfordert einen Mindestprozentsatz abgedeckter Branches. Wenn die Codeabdeckung den angegebenen Schwellenwert nicht erreicht, wird der Prozess mit dem Code `1` beendet. **Standard:** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Erfordert einen Mindestprozentsatz abgedeckter Funktionen. Wenn die Codeabdeckung den angegebenen Schwellenwert nicht erreicht, wird der Prozess mit dem Code `1` beendet. **Standard:** `0`.

- Gibt zurück: [\<TestsStream\>](/de/nodejs/api/test#class-testsstream)

**Hinweis:** `shard` wird verwendet, um die Testausführung horizontal über Maschinen oder Prozesse zu parallelisieren, ideal für groß angelegte Ausführungen in verschiedenen Umgebungen. Es ist inkompatibel mit dem `watch`-Modus, der für die schnelle Code-Iteration entwickelt wurde, indem Tests bei Dateiänderungen automatisch erneut ausgeführt werden.

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

**Hinzugefügt in: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name der Suite, der bei der Meldung von Testergebnissen angezeigt wird. **Standard:** Die `name`-Eigenschaft von `fn` oder `'\<anonymous\>'`, wenn `fn` keinen Namen hat.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionale Konfigurationsoptionen für die Suite. Dies unterstützt die gleichen Optionen wie `test([name][, options][, fn])`.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Suite-Funktion, die verschachtelte Tests und Suiten deklariert. Das erste Argument für diese Funktion ist ein [`SuiteContext`](/de/nodejs/api/test#class-suitecontext)-Objekt. **Standard:** Eine No-op-Funktion.
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird sofort mit `undefined` erfüllt.

Die Funktion `suite()` wird aus dem Modul `node:test` importiert.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**Hinzugefügt in: v22.0.0, v20.13.0**

Abkürzung zum Überspringen einer Suite. Dies ist dasselbe wie [`suite([name], { skip: true }[, fn])`](/de/nodejs/api/test#suitename-options-fn).

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**Hinzugefügt in: v22.0.0, v20.13.0**

Abkürzung zum Markieren einer Suite als `TODO`. Dies ist dasselbe wie [`suite([name], { todo: true }[, fn])`](/de/nodejs/api/test#suitename-options-fn).

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**Hinzugefügt in: v22.0.0, v20.13.0**

Abkürzung zum Markieren einer Suite als `only`. Dies ist dasselbe wie [`suite([name], { only: true }[, fn])`](/de/nodejs/api/test#suitename-options-fn).

## `test([name][, options][, fn])` {#testname-options-fn}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.2.0, v18.17.0 | Die Kurzformen `skip`, `todo` und `only` wurden hinzugefügt. |
| v18.8.0, v16.18.0 | Eine `signal`-Option wurde hinzugefügt. |
| v18.7.0, v16.17.0 | Eine `timeout`-Option wurde hinzugefügt. |
| v18.0.0, v16.17.0 | Hinzugefügt in: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name des Tests, der bei der Meldung von Testergebnissen angezeigt wird. **Standard:** Die `name`-Eigenschaft von `fn` oder `'\<anonymous\>'`, wenn `fn` keinen Namen hat.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Test. Die folgenden Eigenschaften werden unterstützt:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn eine Zahl angegeben wird, werden so viele Tests parallel innerhalb des Anwendungsthreads ausgeführt. Wenn `true`, werden alle geplanten asynchronen Tests gleichzeitig innerhalb des Threads ausgeführt. Wenn `false`, wird nur ein Test gleichzeitig ausgeführt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem übergeordneten Element. **Standard:** `false`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn wahrheitsgemäß und der Testkontext so konfiguriert ist, dass er `only`-Tests ausführt, wird dieser Test ausgeführt. Andernfalls wird der Test übersprungen. **Standard:** `false`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Tests.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn wahrheitsgemäß, wird der Test übersprungen. Wenn eine Zeichenkette angegeben wird, wird diese Zeichenkette in den Testergebnissen als Grund für das Überspringen des Tests angezeigt. **Standard:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn wahrheitsgemäß, wird der Test als `TODO` markiert. Wenn eine Zeichenkette angegeben wird, wird diese Zeichenkette in den Testergebnissen als Grund dafür angezeigt, warum der Test `TODO` ist. **Standard:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach der der Test fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem übergeordneten Element. **Standard:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Zusicherungen und Subtests, die voraussichtlich im Test ausgeführt werden. Wenn die Anzahl der im Test ausgeführten Zusicherungen nicht mit der im Plan angegebenen Anzahl übereinstimmt, schlägt der Test fehl. **Standard:** `undefined`.
  
 
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die zu testende Funktion. Das erste Argument für diese Funktion ist ein [`TestContext`](/de/nodejs/api/test#class-testcontext)-Objekt. Wenn der Test Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-op-Funktion.
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Wird mit `undefined` erfüllt, sobald der Test abgeschlossen ist, oder sofort, wenn der Test innerhalb einer Suite ausgeführt wird.

Die Funktion `test()` ist der Wert, der aus dem Modul `test` importiert wird. Jede Aufruf dieser Funktion führt dazu, dass der Test an den [\<TestsStream\>](/de/nodejs/api/test#class-testsstream) gemeldet wird.

Das `TestContext`-Objekt, das dem `fn`-Argument übergeben wird, kann verwendet werden, um Aktionen im Zusammenhang mit dem aktuellen Test auszuführen. Beispiele hierfür sind das Überspringen des Tests, das Hinzufügen zusätzlicher Diagnoseinformationen oder das Erstellen von Subtests.

`test()` gibt ein `Promise` zurück, das erfüllt wird, sobald der Test abgeschlossen ist. Wenn `test()` innerhalb einer Suite aufgerufen wird, wird es sofort erfüllt. Der Rückgabewert kann normalerweise für Tests der obersten Ebene verworfen werden. Der Rückgabewert von Subtests sollte jedoch verwendet werden, um zu verhindern, dass der übergeordnete Test zuerst abgeschlossen wird und den Subtest abbricht, wie im folgenden Beispiel gezeigt.

```js [ESM]
test('top level test', async (t) => {
  // Das setTimeout() im folgenden Subtest würde dazu führen, dass er seinen
  // übergeordneten Test überlebt, wenn 'await' in der nächsten Zeile entfernt wird. Sobald der übergeordnete Test
  // abgeschlossen ist, werden alle ausstehenden Subtests abgebrochen.
  await t.test('longer running subtest', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
Die Option `timeout` kann verwendet werden, um den Test fehlschlagen zu lassen, wenn er länger als `timeout` Millisekunden dauert. Dies ist jedoch kein zuverlässiger Mechanismus zum Abbrechen von Tests, da ein laufender Test den Anwendungsthread blockieren und so die geplante Abbruch verhindern kann.


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

Kurzform für das Überspringen eines Tests, entspricht [`test([name], { skip: true }[, fn])`](/de/nodejs/api/test#testname-options-fn).

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

Kurzform zum Markieren eines Tests als `TODO`, entspricht [`test([name], { todo: true }[, fn])`](/de/nodejs/api/test#testname-options-fn).

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

Kurzform zum Markieren eines Tests als `only`, entspricht [`test([name], { only: true }[, fn])`](/de/nodejs/api/test#testname-options-fn).

## `describe([name][, options][, fn])` {#describename-options-fn}

Alias für [`suite()`](/de/nodejs/api/test#suitename-options-fn).

Die Funktion `describe()` wird aus dem Modul `node:test` importiert.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

Kurzform zum Überspringen einer Suite. Dies entspricht [`describe([name], { skip: true }[, fn])`](/de/nodejs/api/test#describename-options-fn).

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

Kurzform zum Markieren einer Suite als `TODO`. Dies entspricht [`describe([name], { todo: true }[, fn])`](/de/nodejs/api/test#describename-options-fn).

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**Hinzugefügt in: v19.8.0, v18.15.0**

Kurzform zum Markieren einer Suite als `only`. Dies entspricht [`describe([name], { only: true }[, fn])`](/de/nodejs/api/test#describename-options-fn).

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.8.0, v18.16.0 | Der Aufruf von `it()` entspricht jetzt dem Aufruf von `test()`. |
| v18.6.0, v16.17.0 | Hinzugefügt in: v18.6.0, v16.17.0 |
:::

Alias für [`test()`](/de/nodejs/api/test#testname-options-fn).

Die Funktion `it()` wird aus dem Modul `node:test` importiert.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

Kurzform für das Überspringen eines Tests, entspricht [`it([name], { skip: true }[, fn])`](/de/nodejs/api/test#testname-options-fn).

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

Kurzform zum Markieren eines Tests als `TODO`, entspricht [`it([name], { todo: true }[, fn])`](/de/nodejs/api/test#testname-options-fn).

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**Hinzugefügt in: v19.8.0, v18.15.0**

Kurzform zum Markieren eines Tests als `only`, entspricht [`it([name], { only: true }[, fn])`](/de/nodejs/api/test#testname-options-fn).


## `before([fn][, options])` {#beforefn-options}

**Hinzugefügt in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Hook-Funktion. Wenn der Hook Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Hook. Die folgenden Eigenschaften werden unterstützt:
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Hooks.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach denen der Hook fehlschlägt. Wenn nicht angegeben, erben Untertests diesen Wert von ihrem übergeordneten Element. **Standard:** `Infinity`.



Diese Funktion erstellt einen Hook, der vor der Ausführung einer Suite ausgeführt wird.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Hinzugefügt in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Hook-Funktion. Wenn der Hook Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Hook. Die folgenden Eigenschaften werden unterstützt:
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Hooks.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach denen der Hook fehlschlägt. Wenn nicht angegeben, erben Untertests diesen Wert von ihrem übergeordneten Element. **Standard:** `Infinity`.



Diese Funktion erstellt einen Hook, der nach der Ausführung einer Suite ausgeführt wird.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**Hinweis:** Der `after`-Hook wird garantiert ausgeführt, auch wenn Tests innerhalb der Suite fehlschlagen.


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Hinzugefügt in: v18.8.0, v16.18.0**

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Hook-Funktion. Wenn der Hook Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Hook. Die folgenden Eigenschaften werden unterstützt:
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Hooks.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach denen der Hook fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem übergeordneten Element. **Standard:** `Infinity`.

Diese Funktion erstellt einen Hook, der vor jedem Test in der aktuellen Suite ausgeführt wird.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Hinzugefügt in: v18.8.0, v16.18.0**

- `fn` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Hook-Funktion. Wenn der Hook Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Hook. Die folgenden Eigenschaften werden unterstützt:
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Hooks.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach denen der Hook fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem übergeordneten Element. **Standard:** `Infinity`.

Diese Funktion erstellt einen Hook, der nach jedem Test in der aktuellen Suite ausgeführt wird. Der `afterEach()`-Hook wird auch dann ausgeführt, wenn der Test fehlschlägt.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**Hinzugefügt in: v22.3.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

Ein Objekt, dessen Methoden verwendet werden, um Standard-Snapshot-Einstellungen im aktuellen Prozess zu konfigurieren. Es ist möglich, dieselbe Konfiguration auf alle Dateien anzuwenden, indem gemeinsamer Konfigurationscode in einem Modul platziert wird, das mit `--require` oder `--import` vorgeladen wird.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**Hinzugefügt in: v22.3.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array synchroner Funktionen, das als Standard-Serialisierer für Snapshot-Tests verwendet wird.

Diese Funktion wird verwendet, um den Standard-Serialisierungsmechanismus anzupassen, der vom Test Runner verwendet wird. Standardmäßig führt der Test Runner die Serialisierung durch Aufruf von `JSON.stringify(value, null, 2)` auf dem bereitgestellten Wert durch. `JSON.stringify()` hat Einschränkungen in Bezug auf zirkuläre Strukturen und unterstützte Datentypen. Wenn ein robusterer Serialisierungsmechanismus erforderlich ist, sollte diese Funktion verwendet werden.

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**Hinzugefügt in: v22.3.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Funktion, die verwendet wird, um den Speicherort der Snapshot-Datei zu berechnen. Die Funktion empfängt den Pfad der Testdatei als einziges Argument. Wenn der Test nicht mit einer Datei verknüpft ist (z. B. in der REPL), ist die Eingabe undefiniert. `fn()` muss einen String zurückgeben, der den Speicherort der Snapshot-Datei angibt.

Diese Funktion wird verwendet, um den Speicherort der Snapshot-Datei anzupassen, die für Snapshot-Tests verwendet wird. Standardmäßig ist der Snapshot-Dateiname derselbe wie der Dateiname des Einstiegspunkts mit der Dateierweiterung `.snapshot`.


## Klasse: `MockFunctionContext` {#class-mockfunctioncontext}

**Hinzugefügt in: v19.1.0, v18.13.0**

Die Klasse `MockFunctionContext` wird verwendet, um das Verhalten von Mocks zu inspizieren oder zu manipulieren, die über die [`MockTracker`](/de/nodejs/api/test#class-mocktracker)-APIs erstellt wurden.

### `ctx.calls` {#ctxcalls}

**Hinzugefügt in: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Ein Getter, der eine Kopie des internen Arrays zurückgibt, das verwendet wird, um Aufrufe des Mocks zu verfolgen. Jeder Eintrag im Array ist ein Objekt mit den folgenden Eigenschaften.

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array der Argumente, die an die Mock-Funktion übergeben wurden.
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Wenn die Mock-Funktion eine Ausnahme ausgelöst hat, enthält diese Eigenschaft den ausgelösten Wert. **Standard:** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der von der Mock-Funktion zurückgegebene Wert.
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein `Error`-Objekt, dessen Stack verwendet werden kann, um den Callsite des Mock-Funktionsaufrufs zu bestimmen.
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Wenn die Mock-Funktion ein Konstruktor ist, enthält dieses Feld die Klasse, die konstruiert wird. Andernfalls ist dies `undefined`.
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Der `this`-Wert der Mock-Funktion.

### `ctx.callCount()` {#ctxcallcount}

**Hinzugefügt in: v19.1.0, v18.13.0**

- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl, wie oft dieser Mock aufgerufen wurde.

Diese Funktion gibt die Anzahl zurück, wie oft dieser Mock aufgerufen wurde. Diese Funktion ist effizienter als die Überprüfung von `ctx.calls.length`, da `ctx.calls` ein Getter ist, der eine Kopie des internen Arrays zur Verfolgung von Aufrufen erstellt.


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**Hinzugefügt in: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Funktion, die als neue Implementierung des Mocks verwendet werden soll.

Diese Funktion wird verwendet, um das Verhalten eines vorhandenen Mocks zu ändern.

Das folgende Beispiel erstellt eine Mock-Funktion mit `t.mock.fn()`, ruft die Mock-Funktion auf und ändert dann die Mock-Implementierung in eine andere Funktion.

```js [ESM]
test('changes a mock behavior', (t) => {
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

**Hinzugefügt in: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Funktion, die als Mock-Implementierung für die durch `onCall` angegebene Aufrufnummer verwendet werden soll.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Aufrufnummer, die `implementation` verwenden wird. Wenn der angegebene Aufruf bereits stattgefunden hat, wird eine Ausnahme ausgelöst. **Standard:** Die Nummer des nächsten Aufrufs.

Diese Funktion wird verwendet, um das Verhalten eines vorhandenen Mocks für einen einzelnen Aufruf zu ändern. Sobald der Aufruf `onCall` stattgefunden hat, kehrt der Mock zu dem Verhalten zurück, das er verwendet hätte, wenn `mockImplementationOnce()` nicht aufgerufen worden wäre.

Das folgende Beispiel erstellt eine Mock-Funktion mit `t.mock.fn()`, ruft die Mock-Funktion auf, ändert die Mock-Implementierung für den nächsten Aufruf in eine andere Funktion und setzt dann das vorherige Verhalten fort.

```js [ESM]
test('changes a mock behavior once', (t) => {
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

**Hinzugefügt in: v19.3.0, v18.13.0**

Setzt den Aufrufverlauf der Mock-Funktion zurück.

### `ctx.restore()` {#ctxrestore}

**Hinzugefügt in: v19.1.0, v18.13.0**

Setzt die Implementierung der Mock-Funktion auf ihr ursprüngliches Verhalten zurück. Der Mock kann nach dem Aufruf dieser Funktion weiterhin verwendet werden.

## Klasse: `MockModuleContext` {#class-mockmodulecontext}

**Hinzugefügt in: v22.3.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

Die Klasse `MockModuleContext` wird verwendet, um das Verhalten von Modul-Mocks zu manipulieren, die über die [`MockTracker`](/de/nodejs/api/test#class-mocktracker)-APIs erstellt wurden.

### `ctx.restore()` {#ctxrestore_1}

**Hinzugefügt in: v22.3.0, v20.18.0**

Setzt die Implementierung des Mock-Moduls zurück.

## Klasse: `MockTracker` {#class-mocktracker}

**Hinzugefügt in: v19.1.0, v18.13.0**

Die Klasse `MockTracker` wird verwendet, um die Mocking-Funktionalität zu verwalten. Das Test-Runner-Modul stellt einen Top-Level-`mock`-Export bereit, der eine `MockTracker`-Instanz ist. Jeder Test stellt auch seine eigene `MockTracker`-Instanz über die `mock`-Eigenschaft des Testkontexts bereit.

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**Hinzugefügt in: v19.1.0, v18.13.0**

- `original` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine optionale Funktion, auf der ein Mock erstellt werden soll. **Standard:** Eine No-Op-Funktion.
- `implementation` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine optionale Funktion, die als Mock-Implementierung für `original` verwendet wird. Dies ist nützlich, um Mocks zu erstellen, die für eine bestimmte Anzahl von Aufrufen ein Verhalten zeigen und dann das Verhalten von `original` wiederherstellen. **Standard:** Die von `original` angegebene Funktion.
- `options` [\<Objekt\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionale Konfigurationsoptionen für die Mock-Funktion. Die folgenden Eigenschaften werden unterstützt:
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Male, die der Mock das Verhalten von `implementation` verwendet. Sobald die Mock-Funktion `times`-mal aufgerufen wurde, wird automatisch das Verhalten von `original` wiederhergestellt. Dieser Wert muss eine ganze Zahl größer als Null sein. **Standard:** `Infinity`.

- Gibt zurück: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) Die Mock-Funktion. Die Mock-Funktion enthält eine spezielle `mock`-Eigenschaft, die eine Instanz von [`MockFunctionContext`](/de/nodejs/api/test#class-mockfunctioncontext) ist und zum Untersuchen und Ändern des Verhaltens der Mock-Funktion verwendet werden kann.

Diese Funktion wird verwendet, um eine Mock-Funktion zu erstellen.

Das folgende Beispiel erstellt eine Mock-Funktion, die bei jedem Aufruf einen Zähler um eins erhöht. Die Option `times` wird verwendet, um das Mock-Verhalten so zu ändern, dass die ersten beiden Aufrufe zwei zum Zähler hinzufügen anstatt eins.

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

**Hinzugefügt in: v19.3.0, v18.13.0**

Diese Funktion ist ein Syntax-Zucker für [`MockTracker.method`](/de/nodejs/api/test#mockmethodobject-methodname-implementation-options) mit `options.getter` auf `true` gesetzt.

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**Hinzugefügt in: v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Objekt, dessen Methode gemockt wird.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Der Bezeichner der Methode auf `object`, die gemockt werden soll. Wenn `object[methodName]` keine Funktion ist, wird ein Fehler ausgelöst.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Eine optionale Funktion, die als Mock-Implementierung für `object[methodName]` verwendet wird. **Standard:** Die ursprüngliche Methode, die durch `object[methodName]` angegeben wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionale Konfigurationsoptionen für die Mock-Methode. Die folgenden Eigenschaften werden unterstützt:
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird `object[methodName]` als Getter behandelt. Diese Option kann nicht mit der Option `setter` verwendet werden. **Standard:** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird `object[methodName]` als Setter behandelt. Diese Option kann nicht mit der Option `getter` verwendet werden. **Standard:** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Male, die der Mock das Verhalten von `implementation` verwendet. Sobald die gemockte Methode `times` Mal aufgerufen wurde, wird automatisch das ursprüngliche Verhalten wiederhergestellt. Dieser Wert muss eine ganze Zahl größer als Null sein. **Standard:** `Infinity`.

- Gibt zurück: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) Die gemockte Methode. Die gemockte Methode enthält eine spezielle `mock`-Eigenschaft, die eine Instanz von [`MockFunctionContext`](/de/nodejs/api/test#class-mockfunctioncontext) ist und zum Untersuchen und Ändern des Verhaltens der gemockten Methode verwendet werden kann.

Diese Funktion wird verwendet, um einen Mock auf einer bestehenden Objektmethode zu erstellen. Das folgende Beispiel demonstriert, wie ein Mock auf einer bestehenden Objektmethode erstellt wird.

```js [ESM]
test('spioniert eine Objektmethode aus', (t) => {
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

**Hinzugefügt in: v22.3.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Eine Zeichenkette, die das zu mockende Modul identifiziert.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionale Konfigurationsoptionen für das Mock-Modul. Die folgenden Eigenschaften werden unterstützt:
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `false`, erzeugt jeder Aufruf von `require()` oder `import()` ein neues Mock-Modul. Wenn `true`, geben nachfolgende Aufrufe denselben Modul-Mock zurück und das Mock-Modul wird in den CommonJS-Cache eingefügt. **Standard:** false.
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein optionaler Wert, der als Standardexport des gemockten Moduls verwendet wird. Wenn dieser Wert nicht angegeben wird, enthalten ESM-Mocks keinen Standardexport. Wenn der Mock ein CommonJS- oder eingebautes Modul ist, wird diese Einstellung als Wert von `module.exports` verwendet. Wenn dieser Wert nicht angegeben wird, verwenden CJS- und Builtin-Mocks ein leeres Objekt als Wert von `module.exports`.
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein optionales Objekt, dessen Schlüssel und Werte verwendet werden, um die benannten Exporte des Mock-Moduls zu erstellen. Wenn der Mock ein CommonJS- oder Builtin-Modul ist, werden diese Werte auf `module.exports` kopiert. Wenn also ein Mock sowohl mit benannten Exporten als auch mit einem Nicht-Objekt-Standardexport erstellt wird, wirft der Mock eine Ausnahme, wenn er als CJS- oder Builtin-Modul verwendet wird.


- Gibt zurück: [\<MockModuleContext\>](/de/nodejs/api/test#class-mockmodulecontext) Ein Objekt, das zum Bearbeiten des Mocks verwendet werden kann.

Diese Funktion wird verwendet, um die Exporte von ECMAScript-Modulen, CommonJS-Modulen und Node.js-Builtin-Modulen zu mocken. Alle Verweise auf das Originalmodul vor dem Mocking sind davon nicht betroffen. Um das Modul-Mocking zu aktivieren, muss Node.js mit dem Befehlszeilen-Flag [`--experimental-test-module-mocks`](/de/nodejs/api/cli#--experimental-test-module-mocks) gestartet werden.

Das folgende Beispiel demonstriert, wie ein Mock für ein Modul erstellt wird.

```js [ESM]
test('mocks a builtin module in both module systems', async (t) => {
  // Create a mock of 'node:readline' with a named export named 'fn', which
  // does not exist in the original 'node:readline' module.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() is an export of the original 'node:readline' module.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // The mock is restored, so the original builtin module is returned.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**Hinzugefügt in: v19.1.0, v18.13.0**

Diese Funktion stellt das Standardverhalten aller Mocks wieder her, die zuvor von diesem `MockTracker` erstellt wurden, und trennt die Mocks von der `MockTracker`-Instanz. Nach dem Trennen können die Mocks weiterhin verwendet werden, aber die `MockTracker`-Instanz kann nicht mehr verwendet werden, um ihr Verhalten zurückzusetzen oder auf andere Weise mit ihnen zu interagieren.

Nachdem jeder Test abgeschlossen ist, wird diese Funktion auf dem `MockTracker` des Testkontextes aufgerufen. Wenn der globale `MockTracker` umfassend verwendet wird, wird empfohlen, diese Funktion manuell aufzurufen.

### `mock.restoreAll()` {#mockrestoreall}

**Hinzugefügt in: v19.1.0, v18.13.0**

Diese Funktion stellt das Standardverhalten aller Mocks wieder her, die zuvor von diesem `MockTracker` erstellt wurden. Im Gegensatz zu `mock.reset()` trennt `mock.restoreAll()` die Mocks nicht von der `MockTracker`-Instanz.

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**Hinzugefügt in: v19.3.0, v18.13.0**

Diese Funktion ist Syntaxzucker für [`MockTracker.method`](/de/nodejs/api/test#mockmethodobject-methodname-implementation-options) mit `options.setter` auf `true` gesetzt.

## Klasse: `MockTimers` {#class-mocktimers}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.1.0 | Die Mock Timers sind jetzt stabil. |
| v20.4.0, v18.19.0 | Hinzugefügt in: v20.4.0, v18.19.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Das Mocken von Timern ist eine Technik, die üblicherweise beim Softwaretesten verwendet wird, um das Verhalten von Timern wie `setInterval` und `setTimeout` zu simulieren und zu steuern, ohne tatsächlich auf die angegebenen Zeitintervalle zu warten.

MockTimers ist auch in der Lage, das `Date`-Objekt zu mocken.

Der [`MockTracker`](/de/nodejs/api/test#class-mocktracker) bietet einen Top-Level-`timers`-Export, der eine `MockTimers`-Instanz ist.

### `timers.enable([enableOptions])` {#timersenableenableoptions}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.2.0, v20.11.0 | Parameter wurden aktualisiert, um ein Options-Objekt mit verfügbaren APIs und der anfänglichen Standard-Epoche zu sein. |
| v20.4.0, v18.19.0 | Hinzugefügt in: v20.4.0, v18.19.0 |
:::

Aktiviert das Timer-Mocking für die angegebenen Timer.

- `enableOptions` [\<Objekt\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionale Konfigurationsoptionen zum Aktivieren des Timer-Mockings. Die folgenden Eigenschaften werden unterstützt:
    - `apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein optionales Array, das die zu mockenden Timer enthält. Die derzeit unterstützten Timer-Werte sind `'setInterval'`, `'setTimeout'`, `'setImmediate'` und `'Date'`. **Standard:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. Wenn kein Array bereitgestellt wird, werden standardmäßig alle zeitbezogenen APIs (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, `'clearImmediate'` und `'Date'`) gemockt.
    - `now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Eine optionale Zahl oder ein Date-Objekt, das die Anfangszeit (in Millisekunden) darstellt, die als Wert für `Date.now()` verwendet werden soll. **Standard:** `0`.



**Hinweis:** Wenn Sie das Mocking für einen bestimmten Timer aktivieren, wird auch die zugehörige Clear-Funktion implizit gemockt.

**Hinweis:** Das Mocken von `Date` beeinflusst das Verhalten der gemockten Timer, da diese die gleiche interne Uhr verwenden.

Beispiel für die Verwendung ohne Festlegung der Anfangszeit:



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

Das obige Beispiel aktiviert das Mocking für den `setInterval`-Timer und mockt implizit die Funktion `clearInterval`. Nur die Funktionen `setInterval` und `clearInterval` von [node:timers](/de/nodejs/api/timers), [node:timers/promises](/de/nodejs/api/timers#timers-promises-api) und `globalThis` werden gemockt.

Beispiel für die Verwendung mit festgelegter Anfangszeit



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

Beispiel für die Verwendung mit einem initialen Date-Objekt als Zeitangabe



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

Alternativ können Sie `mock.timers.enable()` ohne Parameter aufrufen:

Alle Timer (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` und `'clearImmediate'`) werden gemockt. Die Funktionen `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate` und `clearImmediate` von `node:timers`, `node:timers/promises` und `globalThis` werden gemockt. Sowie das globale `Date`-Objekt.


### `timers.reset()` {#timersreset}

**Hinzugefügt in: v20.4.0, v18.19.0**

Diese Funktion stellt das Standardverhalten aller Mock-Objekte wieder her, die zuvor von dieser `MockTimers`-Instanz erstellt wurden, und trennt die Mock-Objekte von der `MockTracker`-Instanz.

**Hinweis:** Nach Abschluss jedes Tests wird diese Funktion für den `MockTracker` des Testkontexts aufgerufen.

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

Ruft `timers.reset()` auf.

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**Hinzugefügt in: v20.4.0, v18.19.0**

Erhöht die Zeit für alle simulierten Timer.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Zeitbetrag in Millisekunden, um den die Timer erhöht werden sollen. **Standard:** `1`.

**Hinweis:** Dies weicht vom Verhalten von `setTimeout` in Node.js ab und akzeptiert nur positive Zahlen. In Node.js wird `setTimeout` mit negativen Zahlen nur aus Gründen der Webkompatibilität unterstützt.

Das folgende Beispiel simuliert eine `setTimeout`-Funktion und erhöht mit `.tick` die Zeit, wodurch alle ausstehenden Timer ausgelöst werden.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Alternativ kann die `.tick`-Funktion mehrmals aufgerufen werden.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
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

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
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

Das Erhöhen der Zeit mit `.tick` erhöht auch die Zeit für jedes `Date`-Objekt, das nach der Aktivierung des Mock-Objekts erstellt wurde (wenn `Date` ebenfalls für die Simulation festgelegt wurde).

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::


#### Verwenden von Clear-Funktionen {#using-clear-functions}

Wie bereits erwähnt, werden alle Clear-Funktionen von Timern (`clearTimeout`, `clearInterval` und `clearImmediate`) implizit gemockt. Schauen Sie sich dieses Beispiel mit `setTimeout` an:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### Arbeiten mit Node.js Timer-Modulen {#working-with-nodejs-timers-modules}

Sobald Sie das Mocken von Timern aktivieren, werden die Module [node:timers](/de/nodejs/api/timers), [node:timers/promises](/de/nodejs/api/timers#timers-promises-api) und Timer aus dem globalen Node.js-Kontext aktiviert:

**Hinweis:** Das Destrukturieren von Funktionen wie `import { setTimeout } from 'node:timers'` wird derzeit von dieser API nicht unterstützt.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
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

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

In Node.js ist `setInterval` aus [node:timers/promises](/de/nodejs/api/timers#timers-promises-api) ein `AsyncGenerator` und wird ebenfalls von dieser API unterstützt:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('should tick five times testing a real use case', async (context) => {
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
test('should tick five times testing a real use case', async (context) => {
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

**Hinzugefügt in: v20.4.0, v18.19.0**

Löst sofort alle ausstehenden simulierten Timer aus. Wenn das `Date`-Objekt ebenfalls simuliert wird, wird das `Date`-Objekt auch auf die Zeit des weitesten Timers vorgeschoben.

Das folgende Beispiel löst alle ausstehenden Timer sofort aus, wodurch sie ohne Verzögerung ausgeführt werden.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll-Funktionen folgen der angegebenen Reihenfolge', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Beachten Sie, dass, wenn beide Timer das gleiche Timeout haben,
  // die Ausführungsreihenfolge garantiert ist
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // Das Date-Objekt wird auch auf die Zeit des weitesten Timers vorgeschoben
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll-Funktionen folgen der angegebenen Reihenfolge', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Beachten Sie, dass, wenn beide Timer das gleiche Timeout haben,
  // die Ausführungsreihenfolge garantiert ist
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // Das Date-Objekt wird auch auf die Zeit des weitesten Timers vorgeschoben
  assert.strictEqual(Date.now(), 9999);
});
```
:::

**Hinweis:** Die Funktion `runAll()` ist speziell dafür ausgelegt, Timer im Kontext der Timer-Simulation auszulösen. Sie hat keine Auswirkungen auf Echtzeit-Systemuhren oder tatsächliche Timer außerhalb der Simulationsumgebung.

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**Hinzugefügt in: v21.2.0, v20.11.0**

Legt den aktuellen Unix-Zeitstempel fest, der als Referenz für alle simulierten `Date`-Objekte verwendet wird.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll-Funktionen folgen der angegebenen Reihenfolge', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now wird nicht simuliert
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now ist jetzt 1000
  assert.strictEqual(Date.now(), setTime);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime ersetzt aktuelle Zeit', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now wird nicht simuliert
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now ist jetzt 1000
  assert.strictEqual(Date.now(), setTime);
});
```
:::


#### Zusammenspiel von Datum und Timern {#dates-and-timers-working-together}

Datumsobjekte und Timerobjekte sind voneinander abhängig. Wenn Sie mit `setTime()` die aktuelle Zeit an das gemockte `Date`-Objekt übergeben, werden die gesetzten Timer mit `setTimeout` und `setInterval` **nicht** beeinflusst.

Die `tick`-Methode **wird** jedoch das gemockte `Date`-Objekt vorwärts bewegen.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll Funktionen in der gegebenen Reihenfolge ausführen', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // Das Datum wird vorwärts bewegt, aber die Timer ticken nicht
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll Funktionen in der gegebenen Reihenfolge ausführen', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // Das Datum wird vorwärts bewegt, aber die Timer ticken nicht
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## Klasse: `TestsStream` {#class-testsstream}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | Typ zu den Ereignissen test:pass und test:fail hinzugefügt, wenn der Test eine Suite ist. |
| v18.9.0, v16.19.0 | Hinzugefügt in: v18.9.0, v16.19.0 |
:::

- Erweitert [\<Readable\>](/de/nodejs/api/stream#class-streamreadable)

Ein erfolgreicher Aufruf der Methode [`run()`](/de/nodejs/api/test#runoptions) gibt ein neues [\<TestsStream\>](/de/nodejs/api/test#class-testsstream)-Objekt zurück, das eine Reihe von Ereignissen streamt, die die Ausführung der Tests darstellen. `TestsStream` emittiert Ereignisse in der Reihenfolge der Testdefinitionen.

Einige der Ereignisse werden garantiert in der gleichen Reihenfolge wie die Tests definiert emittiert, während andere in der Reihenfolge emittiert werden, in der die Tests ausgeführt werden.


### Ereignis: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das den Coverage-Bericht enthält.
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von Coverage-Berichten für einzelne Dateien. Jeder Bericht ist ein Objekt mit folgendem Schema:
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der absolute Pfad der Datei.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der Zeilen.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der Verzweigungen.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der Funktionen.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der abgedeckten Zeilen.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der abgedeckten Verzweigungen.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der abgedeckten Funktionen.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Prozentsatz der abgedeckten Zeilen.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Prozentsatz der abgedeckten Verzweigungen.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Prozentsatz der abgedeckten Funktionen.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von Funktionen, das die Funktionsabdeckung darstellt.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name der Funktion.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Zeilennummer, in der die Funktion definiert ist.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl, wie oft die Funktion aufgerufen wurde.

    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von Verzweigungen, das die Verzweigungsabdeckung darstellt.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Zeilennummer, in der die Verzweigung definiert ist.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl, wie oft die Verzweigung ausgeführt wurde.

    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von Zeilen, das die Zeilennummern und die Anzahl, wie oft sie abgedeckt wurden, darstellt.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Zeilennummer.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl, wie oft die Zeile abgedeckt wurde.

    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das angibt, ob die Coverage für jeden Coverage-Typ erfüllt ist.
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Schwellenwert für die Funktionsabdeckung.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Schwellenwert für die Verzweigungsabdeckung.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Schwellenwert für die Zeilenabdeckung.

    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das eine Zusammenfassung der Coverage für alle Dateien enthält.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der Zeilen.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der Verzweigungen.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der Funktionen.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der abgedeckten Zeilen.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der abgedeckten Verzweigungen.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der abgedeckten Funktionen.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Prozentsatz der abgedeckten Zeilen.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Prozentsatz der abgedeckten Verzweigungen.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Prozentsatz der abgedeckten Funktionen.

    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Arbeitsverzeichnis, als die Codeabdeckung gestartet wurde. Dies ist nützlich, um relative Pfadnamen anzuzeigen, falls die Tests das Arbeitsverzeichnis des Node.js-Prozesses geändert haben.

    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Verschachtelungstiefe des Tests.

Wird ausgelöst, wenn die Codeabdeckung aktiviert ist und alle Tests abgeschlossen wurden.


### Ereignis: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Spaltennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Zusätzliche Ausführungsmetadaten.
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob der Test bestanden wurde oder nicht.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Dauer des Tests in Millisekunden.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Ein Fehler, der den vom Test ausgelösten Fehler umschließt, wenn er nicht bestanden wurde.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Der tatsächliche Fehler, der vom Test ausgelöst wurde.


    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Testtyp, der angibt, ob es sich um eine Suite handelt.


    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Zeilennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Testname.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Verschachtelungstiefe des Tests.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Ordnungszahl des Tests.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vorhanden, wenn [`context.todo`](/de/nodejs/api/test#contexttodomessage) aufgerufen wird
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vorhanden, wenn [`context.skip`](/de/nodejs/api/test#contextskipmessage) aufgerufen wird


Wird ausgelöst, wenn ein Test seine Ausführung abgeschlossen hat. Dieses Ereignis wird nicht in der gleichen Reihenfolge wie die Tests definiert werden ausgelöst. Die entsprechenden deklarationsgeordneten Ereignisse sind `'test:pass'` und `'test:fail'`.


### Ereignis: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Spaltennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Zeilennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Testname.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Verschachtelungsebene des Tests.
  
 

Wird ausgelöst, wenn ein Test aus der Warteschlange entfernt wird, unmittelbar bevor er ausgeführt wird. Es wird nicht garantiert, dass dieses Ereignis in der gleichen Reihenfolge wie die Definitionen der Tests ausgelöst wird. Das entsprechende geordnete Deklarationsereignis ist `'test:start'`.

### Ereignis: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Spaltennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Zeilennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Diagnosemeldung.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Verschachtelungsebene des Tests.
  
 

Wird ausgelöst, wenn [`context.diagnostic`](/de/nodejs/api/test#contextdiagnosticmessage) aufgerufen wird. Es wird garantiert, dass dieses Ereignis in der gleichen Reihenfolge wie die Definitionen der Tests ausgelöst wird.


### Ereignis: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Spaltennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Zeilennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Testname.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Schachtelungsebene des Tests.
  
 

Wird ausgelöst, wenn ein Test zur Ausführung in die Warteschlange eingereiht wird.

### Ereignis: `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Spaltennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Zusätzliche Ausführungsmetadaten.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Dauer des Tests in Millisekunden.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ein Error, der den vom Test ausgelösten Fehler umschließt.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Der tatsächliche vom Test ausgelöste Fehler.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Testtyp, der angibt, ob es sich um eine Suite handelt.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Zeilennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Testname.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Schachtelungsebene des Tests.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Ordnungszahl des Tests.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vorhanden, wenn [`context.todo`](/de/nodejs/api/test#contexttodomessage) aufgerufen wird.
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vorhanden, wenn [`context.skip`](/de/nodejs/api/test#contextskipmessage) aufgerufen wird.
  
 

Wird ausgelöst, wenn ein Test fehlschlägt. Dieses Ereignis wird garantiert in der gleichen Reihenfolge wie die Tests definiert werden ausgelöst. Das entsprechende Ausführungsreihenfolge-Ereignis ist `'test:complete'`.


### Ereignis: `'test:pass'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Spaltennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Zusätzliche Ausführungs-Metadaten.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Dauer des Tests in Millisekunden.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Testtyp, der angibt, ob es sich um eine Suite handelt.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Zeilennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Testname.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Verschachtelungsebene des Tests.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Ordnungszahl des Tests.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vorhanden, wenn [`context.todo`](/de/nodejs/api/test#contexttodomessage) aufgerufen wird.
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vorhanden, wenn [`context.skip`](/de/nodejs/api/test#contextskipmessage) aufgerufen wird.
  
 

Wird ausgelöst, wenn ein Test bestanden wurde. Dieses Ereignis wird garantiert in der gleichen Reihenfolge ausgelöst, in der die Tests definiert sind. Das entsprechende Ereignis in der Ausführungsreihenfolge ist `'test:complete'`.


### Ereignis: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Spaltennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Zeilennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Verschachtelungsebene des Tests.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der bereits ausgeführten Untertests.
  
 

Wird ausgelöst, wenn alle Untertests für einen bestimmten Test abgeschlossen wurden. Es wird garantiert, dass dieses Ereignis in der gleichen Reihenfolge wie die Tests definiert werden ausgelöst wird.

### Ereignis: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Spaltennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die Zeilennummer, in der der Test definiert ist, oder `undefined`, wenn der Test über die REPL ausgeführt wurde.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Testname.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Verschachtelungsebene des Tests.
  
 

Wird ausgelöst, wenn ein Test beginnt, seinen eigenen Status und den seiner Untertests zu melden. Es wird garantiert, dass dieses Ereignis in der gleichen Reihenfolge wie die Tests definiert werden ausgelöst wird. Das entsprechende ereignisgesteuerte Ausführungsereignis ist `'test:dequeue'`.


### Ereignis: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Pfad der Testdatei.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die in `stderr` geschriebene Nachricht.

Wird ausgelöst, wenn ein laufender Test in `stderr` schreibt. Dieses Ereignis wird nur ausgelöst, wenn das Flag `--test` übergeben wird. Es wird nicht garantiert, dass dieses Ereignis in der gleichen Reihenfolge ausgelöst wird, in der die Tests definiert sind.

### Ereignis: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Pfad der Testdatei.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die in `stdout` geschriebene Nachricht.

Wird ausgelöst, wenn ein laufender Test in `stdout` schreibt. Dieses Ereignis wird nur ausgelöst, wenn das Flag `--test` übergeben wird. Es wird nicht garantiert, dass dieses Ereignis in der gleichen Reihenfolge ausgelöst wird, in der die Tests definiert sind.

### Ereignis: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das die Zählwerte verschiedener Testergebnisse enthält.
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der abgebrochenen Tests.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der fehlgeschlagenen Tests.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der bestandenen Tests.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der übersprungenen Tests.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der ausgeführten Suites.
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der ausgeführten Tests, Suites ausgenommen.
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der TODO-Tests.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der Top-Level-Tests und -Suites.

    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Dauer des Testlaufs in Millisekunden.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Der Pfad der Testdatei, die die Zusammenfassung generiert hat. Wenn die Zusammenfassung mehreren Dateien entspricht, ist dieser Wert `undefined`.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob der Testlauf als erfolgreich betrachtet wird oder nicht. Wenn ein Fehlerzustand auftritt, z. B. ein fehlerhafter Test oder eine nicht erfüllte Coverage-Schwelle, wird dieser Wert auf `false` gesetzt.

Wird ausgelöst, wenn ein Testlauf abgeschlossen ist. Dieses Ereignis enthält Metriken zum abgeschlossenen Testlauf und ist nützlich, um festzustellen, ob ein Testlauf bestanden oder fehlgeschlagen ist. Wenn die Testisolierung auf Prozessebene verwendet wird, wird zusätzlich zu einer endgültigen kumulativen Zusammenfassung ein `'test:summary'`-Ereignis für jede Testdatei generiert.


### Ereignis: `'test:watch:drained'` {#event-testwatchdrained}

Wird ausgegeben, wenn keine weiteren Tests zur Ausführung im Beobachtungsmodus in der Warteschlange stehen.

## Klasse: `TestContext` {#class-testcontext}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v20.1.0, v18.17.0 | Die Funktion `before` wurde zu TestContext hinzugefügt. |
| v18.0.0, v16.17.0 | Hinzugefügt in: v18.0.0, v16.17.0 |
:::

Eine Instanz von `TestContext` wird jeder Testfunktion übergeben, um mit dem Test Runner zu interagieren. Der `TestContext`-Konstruktor ist jedoch nicht Teil der API.

### `context.before([fn][, options])` {#contextbeforefn-options}

**Hinzugefügt in: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Hook-Funktion. Das erste Argument für diese Funktion ist ein [`TestContext`](/de/nodejs/api/test#class-testcontext)-Objekt. Wenn der Hook Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Hook. Die folgenden Eigenschaften werden unterstützt:
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Hooks.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach der der Hook fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem Elternteil. **Standard:** `Infinity`.

Diese Funktion wird verwendet, um einen Hook zu erstellen, der vor dem Subtest des aktuellen Tests ausgeführt wird.

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**Hinzugefügt in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Hook-Funktion. Das erste Argument für diese Funktion ist ein [`TestContext`](/de/nodejs/api/test#class-testcontext)-Objekt. Wenn der Hook Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Hook. Die folgenden Eigenschaften werden unterstützt:
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Hooks.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach der der Hook fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem Elternteil. **Standard:** `Infinity`.

Diese Funktion wird verwendet, um einen Hook zu erstellen, der vor jedem Subtest des aktuellen Tests ausgeführt wird.

```js [ESM]
test('Top-Level-Test', async (t) => {
  t.beforeEach((t) => t.diagnostic(`wird ausgeführt ${t.name}`));
  await t.test(
    'Dies ist ein Subtest',
    (t) => {
      assert.ok('hier ist eine relevante Assertion');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**Hinzugefügt in: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Hook-Funktion. Das erste Argument dieser Funktion ist ein [`TestContext`](/de/nodejs/api/test#class-testcontext)-Objekt. Wenn der Hook Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Hook. Die folgenden Eigenschaften werden unterstützt:
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Hooks.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach denen der Hook fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem Elternteil. **Standard:** `Infinity`.
  
 

Diese Funktion wird verwendet, um einen Hook zu erstellen, der ausgeführt wird, nachdem der aktuelle Test abgeschlossen ist.

```js [ESM]
test('Top-Level-Test', async (t) => {
  t.after((t) => t.diagnostic(`Die Ausführung von ${t.name} ist abgeschlossen`));
  assert.ok('Hier ist eine relevante Assertion');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**Hinzugefügt in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die Hook-Funktion. Das erste Argument dieser Funktion ist ein [`TestContext`](/de/nodejs/api/test#class-testcontext)-Objekt. Wenn der Hook Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Hook. Die folgenden Eigenschaften werden unterstützt:
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Hooks.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach denen der Hook fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem Elternteil. **Standard:** `Infinity`.
  
 

Diese Funktion wird verwendet, um einen Hook zu erstellen, der nach jedem Subtest des aktuellen Tests ausgeführt wird.

```js [ESM]
test('Top-Level-Test', async (t) => {
  t.afterEach((t) => t.diagnostic(`Die Ausführung von ${t.name} ist abgeschlossen`));
  await t.test(
    'Dies ist ein Subtest',
    (t) => {
      assert.ok('Hier ist eine relevante Assertion');
    },
  );
});
```

### `context.assert` {#contextassert}

**Hinzugefügt in: v22.2.0, v20.15.0**

Ein Objekt, das Assertionsmethoden enthält, die an `context` gebunden sind. Die Top-Level-Funktionen aus dem `node:assert`-Modul werden hier bereitgestellt, um Testpläne zu erstellen.

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**Hinzugefügt in: v22.3.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ein Wert, der in einen String serialisiert werden soll. Wenn Node.js mit dem Flag [`--test-update-snapshots`](/de/nodejs/api/cli#--test-update-snapshots) gestartet wurde, wird der serialisierte Wert in die Snapshot-Datei geschrieben. Andernfalls wird der serialisierte Wert mit dem entsprechenden Wert in der vorhandenen Snapshot-Datei verglichen.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionale Konfigurationsoptionen. Die folgenden Eigenschaften werden unterstützt:
    - `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array synchroner Funktionen, die verwendet werden, um `value` in einen String zu serialisieren. `value` wird als einziges Argument an die erste Serializer-Funktion übergeben. Der Rückgabewert jedes Serializers wird als Eingabe an den nächsten Serializer übergeben. Sobald alle Serializer ausgeführt wurden, wird der resultierende Wert in einen String umgewandelt. **Standard:** Wenn keine Serializer bereitgestellt werden, werden die Standard-Serializer des Test Runners verwendet.



Diese Funktion implementiert Assertions für Snapshot-Tests.

```js [ESM]
test('Snapshot-Test mit Standardserialisierung', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('Snapshot-Test mit benutzerdefinierter Serialisierung', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**Hinzugefügt in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zu meldende Nachricht.

Diese Funktion wird verwendet, um Diagnosen in die Ausgabe zu schreiben. Alle Diagnoseinformationen werden am Ende der Testergebnisse hinzugefügt. Diese Funktion gibt keinen Wert zurück.

```js [ESM]
test('Top-Level-Test', (t) => {
  t.diagnostic('Eine Diagnosemeldung');
});
```
### `context.filePath` {#contextfilepath}

**Hinzugefügt in: v22.6.0, v20.16.0**

Der absolute Pfad der Testdatei, die den aktuellen Test erstellt hat. Wenn eine Testdatei zusätzliche Module importiert, die Tests generieren, geben die importierten Tests den Pfad der Stammtestdatei zurück.

### `context.fullName` {#contextfullname}

**Hinzugefügt in: v22.3.0**

Der Name des Tests und jedes seiner Vorfahren, getrennt durch `\>`.

### `context.name` {#contextname}

**Hinzugefügt in: v18.8.0, v16.18.0**

Der Name des Tests.

### `context.plan(count)` {#contextplancount}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.4.0 | Diese Funktion ist nicht mehr experimentell. |
| v22.2.0, v20.15.0 | Hinzugefügt in: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Zusicherungen und Subtests, die voraussichtlich ausgeführt werden.

Diese Funktion wird verwendet, um die Anzahl der Zusicherungen und Subtests festzulegen, die voraussichtlich innerhalb des Tests ausgeführt werden. Wenn die Anzahl der ausgeführten Zusicherungen und Subtests nicht mit der erwarteten Anzahl übereinstimmt, schlägt der Test fehl.

```js [ESM]
test('Top-Level-Test', (t) => {
  t.plan(2);
  t.assert.ok('hier eine relevante Zusicherung');
  t.test('Subtest', () => {});
});
```
Bei der Arbeit mit asynchronem Code kann die Funktion `plan` verwendet werden, um sicherzustellen, dass die richtige Anzahl von Zusicherungen ausgeführt wird:

```js [ESM]
test('Planung mit Streams', (t, done) => {
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

**Hinzugefügt in: v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob nur Tests mit der Option `only` ausgeführt werden sollen.

Wenn `shouldRunOnlyTests` als "truthy" interpretiert wird, führt der Testkontext nur Tests aus, bei denen die Option `only` gesetzt ist. Andernfalls werden alle Tests ausgeführt. Wenn Node.js nicht mit der Kommandozeilenoption [`--test-only`](/de/nodejs/api/cli#--test-only) gestartet wurde, ist diese Funktion ein No-Op.

```js [ESM]
test('top level test', (t) => {
  // Der Testkontext kann so eingestellt werden, dass Subtests mit der Option 'only' ausgeführt werden.
  t.runOnly(true);
  return Promise.all([
    t.test('this subtest is now skipped'),
    t.test('this subtest is run', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**Hinzugefügt in: v18.7.0, v16.17.0**

- Typ: [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)

Kann verwendet werden, um Test-Subtasks abzubrechen, wenn der Test abgebrochen wurde.

```js [ESM]
test('top level test', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**Hinzugefügt in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Optionale Überspringungsnachricht.

Diese Funktion bewirkt, dass die Ausgabe des Tests den Test als übersprungen anzeigt. Wenn `message` angegeben wird, wird sie in die Ausgabe aufgenommen. Der Aufruf von `skip()` beendet die Ausführung der Testfunktion nicht. Diese Funktion gibt keinen Wert zurück.

```js [ESM]
test('top level test', (t) => {
  // Stellen Sie sicher, dass Sie auch hier zurückkehren, wenn der Test zusätzliche Logik enthält.
  t.skip('this is skipped');
});
```
### `context.todo([message])` {#contexttodomessage}

**Hinzugefügt in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Optionale `TODO`-Nachricht.

Diese Funktion fügt der Ausgabe des Tests eine `TODO`-Direktive hinzu. Wenn `message` angegeben wird, wird sie in die Ausgabe aufgenommen. Der Aufruf von `todo()` beendet die Ausführung der Testfunktion nicht. Diese Funktion gibt keinen Wert zurück.

```js [ESM]
test('top level test', (t) => {
  // Dieser Test ist als `TODO` markiert
  t.todo('this is a todo');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.8.0, v16.18.0 | Füge eine `signal`-Option hinzu. |
| v18.7.0, v16.17.0 | Füge eine `timeout`-Option hinzu. |
| v18.0.0, v16.17.0 | Hinzugefügt in: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name des Untertests, der bei der Meldung von Testergebnissen angezeigt wird. **Standard:** Die `name`-Eigenschaft von `fn` oder `'\<anonymous\>'`, falls `fn` keinen Namen hat.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Konfigurationsoptionen für den Untertest. Die folgenden Eigenschaften werden unterstützt:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Wenn eine Zahl angegeben wird, werden so viele Tests parallel innerhalb des Anwendungsthreads ausgeführt. Wenn `true`, werden alle Untertests parallel ausgeführt. Wenn `false`, wird nur ein Test gleichzeitig ausgeführt. Wenn nicht angegeben, erben Untertests diesen Wert von ihrem übergeordneten Element. **Standard:** `null`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn truthy und der Testkontext für die Ausführung von `only`-Tests konfiguriert ist, wird dieser Test ausgeführt. Andernfalls wird der Test übersprungen. **Standard:** `false`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Ermöglicht das Abbrechen eines laufenden Tests.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn truthy, wird der Test übersprungen. Wenn eine Zeichenfolge angegeben wird, wird diese Zeichenfolge in den Testergebnissen als Grund für das Überspringen des Tests angezeigt. **Standard:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn truthy, wird der Test als `TODO` markiert. Wenn eine Zeichenfolge angegeben wird, wird diese Zeichenfolge in den Testergebnissen als Grund dafür angezeigt, warum der Test `TODO` ist. **Standard:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Anzahl von Millisekunden, nach denen der Test fehlschlägt. Wenn nicht angegeben, erben Untertests diesen Wert von ihrem übergeordneten Element. **Standard:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Zusicherungen und Untertests, die voraussichtlich im Test ausgeführt werden. Wenn die Anzahl der im Test ausgeführten Zusicherungen nicht mit der im Plan angegebenen Anzahl übereinstimmt, schlägt der Test fehl. **Standard:** `undefined`.


- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Die zu testende Funktion. Das erste Argument für diese Funktion ist ein [`TestContext`](/de/nodejs/api/test#class-testcontext)-Objekt. Wenn der Test Callbacks verwendet, wird die Callback-Funktion als zweites Argument übergeben. **Standard:** Eine No-Op-Funktion.
- Gibt zurück: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Erfüllt mit `undefined`, sobald der Test abgeschlossen ist.

Diese Funktion wird verwendet, um Untertests unter dem aktuellen Test zu erstellen. Diese Funktion verhält sich auf die gleiche Weise wie die Top-Level-Funktion [`test()`](/de/nodejs/api/test#testname-options-fn).

```js [ESM]
test('Top-Level-Test', async (t) => {
  await t.test(
    'Dies ist ein Untertest',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('hier eine relevante Zusicherung');
    },
  );
});
```

## Klasse: `SuiteContext` {#class-suitecontext}

**Hinzugefügt in: v18.7.0, v16.17.0**

Eine Instanz von `SuiteContext` wird jeder Suite-Funktion übergeben, um mit dem Test Runner zu interagieren. Der `SuiteContext`-Konstruktor wird jedoch nicht als Teil der API verfügbar gemacht.

### `context.filePath` {#contextfilepath_1}

**Hinzugefügt in: v22.6.0**

Der absolute Pfad der Testdatei, die die aktuelle Suite erstellt hat. Wenn eine Testdatei zusätzliche Module importiert, die Suiten generieren, geben die importierten Suiten den Pfad der Root-Testdatei zurück.

### `context.name` {#contextname_1}

**Hinzugefügt in: v18.8.0, v16.18.0**

Der Name der Suite.

### `context.signal` {#contextsignal_1}

**Hinzugefügt in: v18.7.0, v16.17.0**

- Typ: [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal)

Kann verwendet werden, um Test-Unteraufgaben abzubrechen, wenn der Test abgebrochen wurde.

