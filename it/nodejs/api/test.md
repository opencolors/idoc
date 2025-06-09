---
title: Node.js Test Runner
description: Il modulo Test Runner di Node.js fornisce una soluzione integrata per scrivere ed eseguire test all'interno delle applicazioni Node.js. Supporta vari formati di test, report di copertura e si integra con framework di test popolari.
head:
  - - meta
    - name: og:title
      content: Node.js Test Runner | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Test Runner di Node.js fornisce una soluzione integrata per scrivere ed eseguire test all'interno delle applicazioni Node.js. Supporta vari formati di test, report di copertura e si integra con framework di test popolari.
  - - meta
    - name: twitter:title
      content: Node.js Test Runner | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Test Runner di Node.js fornisce una soluzione integrata per scrivere ed eseguire test all'interno delle applicazioni Node.js. Supporta vari formati di test, report di copertura e si integra con framework di test popolari.
---


# Esecutore di test {#test-runner}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | L'esecutore di test è ora stabile. |
| v18.0.0, v16.17.0 | Aggiunto in: v18.0.0, v16.17.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/test.js](https://github.com/nodejs/node/blob/v23.5.0/lib/test.js)

Il modulo `node:test` facilita la creazione di test JavaScript. Per accedervi:



::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

Questo modulo è disponibile solo con lo schema `node:`.

I test creati tramite il modulo `test` consistono in una singola funzione che viene elaborata in uno dei tre modi seguenti:

L'esempio seguente illustra come i test vengono scritti utilizzando il modulo `test`.

```js [ESM]
test('test di superamento sincrono', (t) => {
  // Questo test viene superato perché non genera un'eccezione.
  assert.strictEqual(1, 1);
});

test('test di fallimento sincrono', (t) => {
  // Questo test fallisce perché genera un'eccezione.
  assert.strictEqual(1, 2);
});

test('test di superamento asincrono', async (t) => {
  // Questo test viene superato perché la Promise restituita dalla funzione async
  // è definita e non rifiutata.
  assert.strictEqual(1, 1);
});

test('test di fallimento asincrono', async (t) => {
  // Questo test fallisce perché la Promise restituita dalla funzione async
  // viene rifiutata.
  assert.strictEqual(1, 2);
});

test('test di fallimento che utilizza le Promise', (t) => {
  // Le Promise possono essere utilizzate anche direttamente.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('questo causerà il fallimento del test'));
    });
  });
});

test('test di superamento della callback', (t, done) => {
  // done() è la funzione di callback. Quando setImmediate() viene eseguito, richiama
  // done() senza argomenti.
  setImmediate(done);
});

test('test di fallimento della callback', (t, done) => {
  // Quando setImmediate() viene eseguito, done() viene richiamato con un oggetto Error e
  // il test fallisce.
  setImmediate(() => {
    done(new Error('fallimento della callback'));
  });
});
```
Se uno dei test fallisce, il codice di uscita del processo viene impostato su `1`.


## Sottotest {#subtests}

Il metodo `test()` del contesto di test consente la creazione di sottotest. Permette di strutturare i test in modo gerarchico, dove è possibile creare test nidificati all'interno di un test più ampio. Questo metodo si comporta in modo identico alla funzione `test()` di livello superiore. Il seguente esempio dimostra la creazione di un test di livello superiore con due sottotest.

```js [ESM]
test('test di livello superiore', async (t) => {
  await t.test('sottotest 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('sottotest 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
In questo esempio, `await` viene utilizzato per garantire che entrambi i sottotest siano stati completati. Ciò è necessario perché i test non attendono il completamento dei loro sottotest, a differenza dei test creati all'interno delle suite. Tutti i sottotest che sono ancora in sospeso quando il loro genitore termina vengono annullati e trattati come errori. Qualsiasi errore del sottotest causa il fallimento del test genitore.

## Ignorare i test {#skipping-tests}

I singoli test possono essere ignorati passando l'opzione `skip` al test, o chiamando il metodo `skip()` del contesto di test come mostrato nel seguente esempio.

```js [ESM]
// L'opzione skip viene utilizzata, ma non viene fornito alcun messaggio.
test('opzione skip', { skip: true }, (t) => {
  // Questo codice non viene mai eseguito.
});

// L'opzione skip viene utilizzata e viene fornito un messaggio.
test('opzione skip con messaggio', { skip: 'questo viene ignorato' }, (t) => {
  // Questo codice non viene mai eseguito.
});

test('metodo skip()', (t) => {
  // Assicurati di ritornare anche qui se il test contiene logica aggiuntiva.
  t.skip();
});

test('metodo skip() con messaggio', (t) => {
  // Assicurati di ritornare anche qui se il test contiene logica aggiuntiva.
  t.skip('questo viene ignorato');
});
```
## Test TODO {#todo-tests}

I singoli test possono essere contrassegnati come instabili o incompleti passando l'opzione `todo` al test, o chiamando il metodo `todo()` del contesto di test, come mostrato nel seguente esempio. Questi test rappresentano un'implementazione in sospeso o un bug che deve essere corretto. I test TODO vengono eseguiti, ma non vengono trattati come errori di test e, pertanto, non influiscono sul codice di uscita del processo. Se un test è contrassegnato sia come TODO che come ignorato, l'opzione TODO viene ignorata.

```js [ESM]
// L'opzione todo viene utilizzata, ma non viene fornito alcun messaggio.
test('opzione todo', { todo: true }, (t) => {
  // Questo codice viene eseguito, ma non viene trattato come un errore.
  throw new Error('questo non fa fallire il test');
});

// L'opzione todo viene utilizzata e viene fornito un messaggio.
test('opzione todo con messaggio', { todo: 'questo è un test todo' }, (t) => {
  // Questo codice viene eseguito.
});

test('metodo todo()', (t) => {
  t.todo();
});

test('metodo todo() con messaggio', (t) => {
  t.todo('questo è un test todo e non viene trattato come un errore');
  throw new Error('questo non fa fallire il test');
});
```

## Alias di `describe()` e `it()` {#describe-and-it-aliases}

Suite e test possono essere scritti anche usando le funzioni `describe()` e `it()`. [`describe()`](/it/nodejs/api/test#describename-options-fn) è un alias per [`suite()`](/it/nodejs/api/test#suitename-options-fn), e [`it()`](/it/nodejs/api/test#itname-options-fn) è un alias per [`test()`](/it/nodejs/api/test#testname-options-fn).

```js [ESM]
describe('Una cosa', () => {
  it('dovrebbe funzionare', () => {
    assert.strictEqual(1, 1);
  });

  it('dovrebbe andare bene', () => {
    assert.strictEqual(2, 2);
  });

  describe('una cosa nidificata', () => {
    it('dovrebbe funzionare', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` e `it()` vengono importati dal modulo `node:test`.



::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## Test `only` {#only-tests}

Se Node.js viene avviato con l'opzione da riga di comando [`--test-only`](/it/nodejs/api/cli#--test-only), o l'isolamento dei test è disabilitato, è possibile saltare tutti i test tranne un sottoinsieme selezionato passando l'opzione `only` ai test che dovrebbero essere eseguiti. Quando viene impostato un test con l'opzione `only`, vengono eseguiti anche tutti i subtest. Se una suite ha impostato l'opzione `only`, vengono eseguiti tutti i test all'interno della suite, a meno che non abbia discendenti con l'opzione `only` impostata, nel qual caso vengono eseguiti solo tali test.

Quando si utilizzano [subtest](/it/nodejs/api/test#subtests) all'interno di un `test()`/`it()`, è necessario contrassegnare tutti i test antenati con l'opzione `only` per eseguire solo un sottoinsieme selezionato di test.

Il metodo `runOnly()` del contesto di test può essere utilizzato per implementare lo stesso comportamento a livello di subtest. I test che non vengono eseguiti vengono omessi dall'output del runner di test.

```js [ESM]
// Si supponga che Node.js venga eseguito con l'opzione da riga di comando --test-only.
// L'opzione 'only' della suite è impostata, quindi questi test vengono eseguiti.
test('questo test viene eseguito', { only: true }, async (t) => {
  // All'interno di questo test, tutti i subtest vengono eseguiti per impostazione predefinita.
  await t.test('esecuzione del subtest');

  // Il contesto di test può essere aggiornato per eseguire i subtest con l'opzione 'only'.
  t.runOnly(true);
  await t.test('questo subtest ora viene saltato');
  await t.test('questo subtest viene eseguito', { only: true });

  // Riportare il contesto per eseguire tutti i test.
  t.runOnly(false);
  await t.test('questo subtest ora viene eseguito');

  // Esplicitamente non eseguire questi test.
  await t.test('subtest saltato 3', { only: false });
  await t.test('subtest saltato 4', { skip: true });
});

// L'opzione 'only' non è impostata, quindi questo test viene saltato.
test('questo test non viene eseguito', () => {
  // Questo codice non viene eseguito.
  throw new Error('fallimento');
});

describe('una suite', () => {
  // L'opzione 'only' è impostata, quindi questo test viene eseguito.
  it('questo test viene eseguito', { only: true }, () => {
    // Questo codice viene eseguito.
  });

  it('questo test non viene eseguito', () => {
    // Questo codice non viene eseguito.
    throw new Error('fallimento');
  });
});

describe.only('una suite', () => {
  // L'opzione 'only' è impostata, quindi questo test viene eseguito.
  it('questo test viene eseguito', () => {
    // Questo codice viene eseguito.
  });

  it('questo test viene eseguito', () => {
    // Questo codice viene eseguito.
  });
});
```

## Filtrare i test per nome {#filtering-tests-by-name}

L'opzione della riga di comando [`--test-name-pattern`](/it/nodejs/api/cli#--test-name-pattern) può essere utilizzata per eseguire solo i test il cui nome corrisponde al pattern fornito, e l'opzione [`--test-skip-pattern`](/it/nodejs/api/cli#--test-skip-pattern) può essere utilizzata per saltare i test il cui nome corrisponde al pattern fornito. I pattern del nome del test sono interpretati come espressioni regolari JavaScript. Le opzioni `--test-name-pattern` e `--test-skip-pattern` possono essere specificate più volte per eseguire test nidificati. Per ogni test che viene eseguito, vengono eseguiti anche tutti gli hook di test corrispondenti, come `beforeEach()`. I test che non vengono eseguiti vengono omessi dall'output del test runner.

Dato il seguente file di test, avviare Node.js con l'opzione `--test-name-pattern="test [1-3]"` farebbe sì che il test runner eseguisse `test 1`, `test 2` e `test 3`. Se `test 1` non corrispondesse al pattern del nome del test, allora i suoi sottotest non verrebbero eseguiti, nonostante corrispondano al pattern. Lo stesso insieme di test potrebbe anche essere eseguito passando `--test-name-pattern` più volte (es. `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"`, ecc.).

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
I pattern del nome del test possono anche essere specificati utilizzando valori letterali di espressioni regolari. Ciò consente di utilizzare i flag delle espressioni regolari. Nell'esempio precedente, avviare Node.js con `--test-name-pattern="/test [4-5]/i"` (o `--test-skip-pattern="/test [4-5]/i"`) corrisponderebbe a `Test 4` e `Test 5` perché il pattern non fa distinzione tra maiuscole e minuscole.

Per abbinare un singolo test con un pattern, puoi prefissarlo con tutti i nomi dei suoi test antenati separati da uno spazio, per assicurarti che sia univoco. Ad esempio, dato il seguente file di test:

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
Avviare Node.js con `--test-name-pattern="test 1 some test"` corrisponderebbe solo a `some test` in `test 1`.

I pattern del nome del test non modificano l'insieme di file che il test runner esegue.

Se vengono forniti sia `--test-name-pattern` che `--test-skip-pattern`, i test devono soddisfare **entrambi** i requisiti per essere eseguiti.


## Attività asincrona estranea {#extraneous-asynchronous-activity}

Una volta che una funzione di test termina l'esecuzione, i risultati vengono riportati il più rapidamente possibile, mantenendo l'ordine dei test. Tuttavia, è possibile che la funzione di test generi attività asincrone che sopravvivono al test stesso. Il test runner gestisce questo tipo di attività, ma non ritarda la segnalazione dei risultati dei test per assecondarla.

Nell'esempio seguente, un test viene completato con due operazioni `setImmediate()` ancora in sospeso. Il primo `setImmediate()` tenta di creare un nuovo subtest. Poiché il test principale è già terminato e ha prodotto i suoi risultati, il nuovo subtest viene immediatamente contrassegnato come non riuscito e segnalato successivamente a [\<TestsStream\>](/it/nodejs/api/test#class-testsstream).

Il secondo `setImmediate()` crea un evento `uncaughtException`. Gli eventi `uncaughtException` e `unhandledRejection` provenienti da un test completato vengono contrassegnati come non riusciti dal modulo `test` e segnalati come avvisi diagnostici al livello superiore da [\<TestsStream\>](/it/nodejs/api/test#class-testsstream).

```js [ESM]
test('un test che crea attività asincrona', (t) => {
  setImmediate(() => {
    t.test('subtest creato troppo tardi', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // Il test termina dopo questa riga.
});
```
## Modalità di osservazione {#watch-mode}

**Aggiunto in: v19.2.0, v18.13.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Il test runner di Node.js supporta l'esecuzione in modalità di osservazione passando il flag `--watch`:

```bash [BASH]
node --test --watch
```
In modalità di osservazione, il test runner osserverà le modifiche ai file di test e alle loro dipendenze. Quando viene rilevata una modifica, il test runner rieseguirà i test interessati dalla modifica. Il test runner continuerà a essere eseguito finché il processo non viene terminato.

## Esecuzione dei test dalla riga di comando {#running-tests-from-the-command-line}

Il test runner di Node.js può essere richiamato dalla riga di comando passando il flag [`--test`](/it/nodejs/api/cli#--test):

```bash [BASH]
node --test
```
Per impostazione predefinita, Node.js eseguirà tutti i file che corrispondono a questi pattern:

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

Quando viene fornito [`--experimental-strip-types`](/it/nodejs/api/cli#--experimental-strip-types), vengono abbinati i seguenti pattern aggiuntivi:

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

In alternativa, è possibile fornire uno o più pattern glob come argomento finale al comando Node.js, come mostrato di seguito. I pattern glob seguono il comportamento di [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7). I pattern glob devono essere racchiusi tra virgolette doppie sulla riga di comando per impedire l'espansione della shell, che può ridurre la portabilità tra i sistemi.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
I file corrispondenti vengono eseguiti come file di test. Ulteriori informazioni sull'esecuzione dei file di test sono disponibili nella sezione [modello di esecuzione del test runner](/it/nodejs/api/test#test-runner-execution-model).


### Modello di esecuzione del test runner {#test-runner-execution-model}

Quando l'isolamento del test a livello di processo è abilitato, ogni file di test corrispondente viene eseguito in un processo figlio separato. Il numero massimo di processi figlio in esecuzione contemporaneamente è controllato dal flag [`--test-concurrency`](/it/nodejs/api/cli#--test-concurrency). Se il processo figlio termina con un codice di uscita pari a 0, il test è considerato superato. Altrimenti, il test è considerato fallito. I file di test devono essere eseguibili da Node.js, ma non è necessario che utilizzino internamente il modulo `node:test`.

Ogni file di test viene eseguito come se fosse uno script normale. Cioè, se il file di test stesso utilizza `node:test` per definire i test, tutti questi test verranno eseguiti all'interno di un singolo thread dell'applicazione, indipendentemente dal valore dell'opzione `concurrency` di [`test()`](/it/nodejs/api/test#testname-options-fn).

Quando l'isolamento del test a livello di processo è disabilitato, ogni file di test corrispondente viene importato nel processo del test runner. Una volta caricati tutti i file di test, i test di livello superiore vengono eseguiti con una concorrenza pari a uno. Poiché tutti i file di test vengono eseguiti nello stesso contesto, è possibile che i test interagiscano tra loro in modi che non sono possibili quando l'isolamento è abilitato. Ad esempio, se un test si basa sullo stato globale, è possibile che tale stato venga modificato da un test proveniente da un altro file.

## Raccolta della code coverage {#collecting-code-coverage}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Quando Node.js viene avviato con il flag della riga di comando [`--experimental-test-coverage`](/it/nodejs/api/cli#--experimental-test-coverage), viene raccolta la code coverage e vengono riportate le statistiche una volta che tutti i test sono stati completati. Se la variabile d'ambiente [`NODE_V8_COVERAGE`](/it/nodejs/api/cli#node_v8_coveragedir) viene utilizzata per specificare una directory di code coverage, i file di coverage V8 generati vengono scritti in tale directory. I moduli core di Node.js e i file all'interno delle directory `node_modules/` non sono, per impostazione predefinita, inclusi nel report di coverage. Tuttavia, possono essere esplicitamente inclusi tramite il flag [`--test-coverage-include`](/it/nodejs/api/cli#--test-coverage-include). Per impostazione predefinita, tutti i file di test corrispondenti sono esclusi dal report di coverage. Le esclusioni possono essere sovrascritte utilizzando il flag [`--test-coverage-exclude`](/it/nodejs/api/cli#--test-coverage-exclude). Se la coverage è abilitata, il report di coverage viene inviato a qualsiasi [test reporter](/it/nodejs/api/test#test-reporters) tramite l'evento `'test:coverage'`.

La coverage può essere disabilitata su una serie di righe utilizzando la seguente sintassi di commento:

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // Il codice in questo ramo non verrà mai eseguito, ma le righe vengono ignorate ai fini della
  // coverage. Tutte le righe che seguono il commento 'disable' vengono ignorate
  // fino a quando non viene incontrato un commento 'enable' corrispondente.
  console.log('questo non viene mai eseguito');
}
/* node:coverage enable */
```
La coverage può anche essere disabilitata per un numero specificato di righe. Dopo il numero specificato di righe, la coverage verrà automaticamente riabilitata. Se il numero di righe non viene fornito esplicitamente, viene ignorata una singola riga.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('questo non viene mai eseguito'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('questo non viene mai eseguito');
}
```

### Reporter di copertura {#coverage-reporters}

I reporter tap e spec stamperanno un riepilogo delle statistiche di copertura. Esiste anche un reporter lcov che genererà un file lcov che può essere utilizzato come report di copertura approfondito.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- Nessun risultato del test viene riportato da questo reporter.
- Questo reporter dovrebbe idealmente essere utilizzato insieme a un altro reporter.

## Mocking {#mocking}

Il modulo `node:test` supporta il mocking durante i test tramite un oggetto `mock` di livello superiore. L'esempio seguente crea una spia su una funzione che somma due numeri. La spia viene quindi utilizzata per asserire che la funzione è stata chiamata come previsto.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('spies on a function', () => {
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

  // Reset the globally tracked mocks.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('spies on a function', () => {
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

  // Reset the globally tracked mocks.
  mock.reset();
});
```
:::

La stessa funzionalità di mocking è anche esposta sull'oggetto [`TestContext`](/it/nodejs/api/test#class-testcontext) di ogni test. L'esempio seguente crea una spia su un metodo di oggetto utilizzando l'API esposta sul `TestContext`. Il vantaggio di eseguire il mocking tramite il contesto del test è che il test runner ripristinerà automaticamente tutte le funzionalità sottoposte a mocking una volta terminato il test.

```js [ESM]
test('spies on an object method', (t) => {
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

Il mocking dei timer è una tecnica comunemente utilizzata nei test del software per simulare e controllare il comportamento dei timer, come `setInterval` e `setTimeout`, senza dover effettivamente attendere gli intervalli di tempo specificati.

Fare riferimento alla classe [`MockTimers`](/it/nodejs/api/test#class-mocktimers) per un elenco completo di metodi e funzionalità.

Ciò consente agli sviluppatori di scrivere test più affidabili e prevedibili per le funzionalità dipendenti dal tempo.

L'esempio seguente mostra come eseguire il mock di `setTimeout`. Utilizzando `.enable({ apis: ['setTimeout'] });` verrà eseguito il mock delle funzioni `setTimeout` nei moduli [node:timers](/it/nodejs/api/timers) e [node:timers/promises](/it/nodejs/api/timers#timers-promises-api), nonché dal contesto globale di Node.js.

**Nota:** La destrutturazione di funzioni come `import { setTimeout } from 'node:timers'` non è attualmente supportata da questa API.

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

La stessa funzionalità di mocking è esposta anche nella proprietà mock sull'oggetto [`TestContext`](/it/nodejs/api/test#class-testcontext) di ogni test. Il vantaggio del mocking tramite il contesto di test è che il test runner ripristinerà automaticamente tutte le funzionalità dei timer mockati al termine del test.

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


### Date {#dates}

L'API dei timer simulati consente anche la simulazione dell'oggetto `Date`. Questa è una funzione utile per testare funzionalità dipendenti dal tempo o per simulare funzioni di calendario interne come `Date.now()`.

L'implementazione delle date fa anche parte della classe [`MockTimers`](/it/nodejs/api/test#class-mocktimers). Fare riferimento a essa per un elenco completo di metodi e funzionalità.

**Nota:** Le date e i timer sono dipendenti quando vengono simulati insieme. Ciò significa che se hai sia `Date` che `setTimeout` simulati, l'avanzamento del tempo farà avanzare anche la data simulata poiché simulano un singolo orologio interno.

L'esempio seguente mostra come simulare l'oggetto `Date` e ottenere il valore corrente di `Date.now()`.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula l\'oggetto Date', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['Date'] });
  // Se non specificato, la data iniziale si baserà su 0 nell'epoca UNIX
  assert.strictEqual(Date.now(), 0);

  // L'avanzamento nel tempo farà avanzare anche la data
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula l\'oggetto Date', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['Date'] });
  // Se non specificato, la data iniziale si baserà su 0 nell'epoca UNIX
  assert.strictEqual(Date.now(), 0);

  // L'avanzamento nel tempo farà avanzare anche la data
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

Se non è impostata un'epoca iniziale, la data iniziale si baserà su 0 nell'epoca Unix. Questo è il 1° gennaio 1970, 00:00:00 UTC. È possibile impostare una data iniziale passando una proprietà `now` al metodo `.enable()`. Questo valore verrà utilizzato come data iniziale per l'oggetto `Date` simulato. Può essere un numero intero positivo o un altro oggetto Date.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula l\'oggetto Date con l\'ora iniziale', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // L'avanzamento nel tempo farà avanzare anche la data
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula l\'oggetto Date con l\'ora iniziale', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // L'avanzamento nel tempo farà avanzare anche la data
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

È possibile utilizzare il metodo `.setTime()` per spostare manualmente la data simulata a un altro momento. Questo metodo accetta solo un numero intero positivo.

**Nota:** Questo metodo eseguirà tutti i timer simulati che si trovano nel passato rispetto al nuovo momento.

Nell'esempio seguente stiamo impostando una nuova ora per la data simulata.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('imposta l\'ora di un oggetto data', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // L'avanzamento nel tempo farà avanzare anche la data
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('imposta l\'ora di un oggetto data', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // L'avanzamento nel tempo farà avanzare anche la data
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Se hai un timer impostato per essere eseguito in passato, verrà eseguito come se fosse stato chiamato il metodo `.tick()`. Questo è utile se si desidera testare funzionalità dipendenti dal tempo che sono già nel passato.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('esegue i timer quando setTime passa i tick', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Il timer non viene eseguito perché il tempo non è ancora stato raggiunto
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Il timer viene eseguito perché il tempo è ora stato raggiunto
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('esegue i timer quando setTime passa i tick', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Il timer non viene eseguito perché il tempo non è ancora stato raggiunto
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Il timer viene eseguito perché il tempo è ora stato raggiunto
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

L'utilizzo di `.runAll()` eseguirà tutti i timer attualmente in coda. Ciò farà avanzare anche la data simulata all'ora dell'ultimo timer eseguito come se il tempo fosse trascorso.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('esegue i timer quando setTime passa i tick', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Tutti i timer vengono eseguiti perché il tempo è ora stato raggiunto
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('esegue i timer quando setTime passa i tick', (context) => {
  // Facoltativamente, scegli cosa simulare
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // Tutti i timer vengono eseguiti perché il tempo è ora stato raggiunto
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::


## Test di snapshot {#snapshot-testing}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

I test di snapshot consentono di serializzare valori arbitrari in valori stringa e confrontarli con un insieme di valori noti validi. I valori noti validi sono noti come snapshot e sono memorizzati in un file di snapshot. I file di snapshot sono gestiti dal test runner, ma sono progettati per essere leggibili dall'utente per facilitare il debug. La prassi migliore è che i file di snapshot siano archiviati nel controllo del codice sorgente insieme ai file di test.

I file di snapshot vengono generati avviando Node.js con il flag da riga di comando [`--test-update-snapshots`](/it/nodejs/api/cli#--test-update-snapshots). Viene generato un file di snapshot separato per ciascun file di test. Per impostazione predefinita, il file di snapshot ha lo stesso nome del file di test con l'estensione `.snapshot`. Questo comportamento può essere configurato utilizzando la funzione `snapshot.setResolveSnapshotPath()`. Ogni asserzione di snapshot corrisponde a un export nel file di snapshot.

Un esempio di test di snapshot è mostrato di seguito. La prima volta che questo test viene eseguito, fallirà perché il file di snapshot corrispondente non esiste.

```js [ESM]
// test.js
suite('suite di test di snapshot', () => {
  test('test di snapshot', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
Genera il file di snapshot eseguendo il file di test con `--test-update-snapshots`. Il test dovrebbe passare e un file denominato `test.js.snapshot` viene creato nella stessa directory del file di test. Il contenuto del file di snapshot è mostrato di seguito. Ogni snapshot è identificato dal nome completo del test e da un contatore per distinguere tra gli snapshot nello stesso test.

```js [ESM]
exports[`suite di test di snapshot > test di snapshot 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`suite di test di snapshot > test di snapshot 2`] = `
5
`;
```
Una volta creato il file di snapshot, esegui di nuovo i test senza il flag `--test-update-snapshots`. I test ora dovrebbero passare.


## Reporter di test {#test-reporters}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.9.0, v18.17.0 | I reporter sono ora esposti in `node:test/reporters`. |
| v19.6.0, v18.15.0 | Aggiunto in: v19.6.0, v18.15.0 |
:::

Il modulo `node:test` supporta il passaggio di flag [`--test-reporter`](/it/nodejs/api/cli#--test-reporter) affinché il test runner utilizzi un reporter specifico.

Sono supportati i seguenti reporter integrati:

-  `spec` Il reporter `spec` restituisce i risultati dei test in un formato leggibile. Questo è il reporter predefinito.
-  `tap` Il reporter `tap` restituisce i risultati dei test nel formato [TAP](https://testanything.org/).
-  `dot` Il reporter `dot` restituisce i risultati dei test in un formato compatto, in cui ogni test superato è rappresentato da un `.`, e ogni test fallito è rappresentato da una `X`.
-  `junit` Il reporter junit restituisce i risultati dei test in un formato XML jUnit
-  `lcov` Il reporter `lcov` restituisce la copertura dei test quando viene utilizzato con il flag [`--experimental-test-coverage`](/it/nodejs/api/cli#--experimental-test-coverage).

L'output esatto di questi reporter è soggetto a modifiche tra le versioni di Node.js e non dovrebbe essere considerato affidabile a livello programmatico. Se è necessario l'accesso programmatico all'output del test runner, utilizzare gli eventi emessi da [\<TestsStream\>](/it/nodejs/api/test#class-testsstream).

I reporter sono disponibili tramite il modulo `node:test/reporters`:

::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### Reporter personalizzati {#custom-reporters}

[`--test-reporter`](/it/nodejs/api/cli#--test-reporter) può essere utilizzato per specificare un percorso a un reporter personalizzato. Un reporter personalizzato è un modulo che esporta un valore accettato da [stream.compose](/it/nodejs/api/stream#streamcomposestreams). I reporter devono trasformare gli eventi emessi da un [\<TestsStream\>](/it/nodejs/api/test#class-testsstream)

Esempio di un reporter personalizzato che utilizza [\<stream.Transform\>](/it/nodejs/api/stream#class-streamtransform):

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

Esempio di un reporter personalizzato che utilizza una funzione generatore:

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

Il valore fornito a `--test-reporter` deve essere una stringa come quella utilizzata in un `import()` nel codice JavaScript o un valore fornito per [`--import`](/it/nodejs/api/cli#--importmodule).


### Reporter multipli {#multiple-reporters}

Il flag [`--test-reporter`](/it/nodejs/api/cli#--test-reporter) può essere specificato più volte per riportare i risultati dei test in diversi formati. In questa situazione è necessario specificare una destinazione per ciascun reporter utilizzando [`--test-reporter-destination`](/it/nodejs/api/cli#--test-reporter-destination). La destinazione può essere `stdout`, `stderr` o un percorso di file. I reporter e le destinazioni vengono accoppiati in base all'ordine in cui sono stati specificati.

Nell'esempio seguente, il reporter `spec` genererà l'output su `stdout` e il reporter `dot` genererà l'output su `file.txt`:

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
Quando viene specificato un singolo reporter, la destinazione sarà predefinita su `stdout`, a meno che non venga fornita esplicitamente una destinazione.

## `run([options])` {#runoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Aggiunta l'opzione `cwd`. |
| v23.0.0 | Aggiunte opzioni di coverage. |
| v22.8.0 | Aggiunta l'opzione `isolation`. |
| v22.6.0 | Aggiunta l'opzione `globPatterns`. |
| v22.0.0, v20.14.0 | Aggiunta l'opzione `forceExit`. |
| v20.1.0, v18.17.0 | Aggiunta un'opzione testNamePatterns. |
| v18.9.0, v16.19.0 | Aggiunto in: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'esecuzione dei test. Sono supportate le seguenti proprietà:
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se viene fornito un numero, verranno eseguiti in parallelo tanti processi di test quanti sono indicati, dove ogni processo corrisponde a un file di test. Se `true`, verranno eseguiti in parallelo `os.availableParallelism() - 1` file di test. Se `false`, verrà eseguito un solo file di test alla volta. **Predefinito:** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica la directory di lavoro corrente da utilizzare per l'esecuzione dei test. Serve come percorso base per la risoluzione dei file in base al [modello di esecuzione del test runner](/it/nodejs/api/test#test-runner-execution-model). **Predefinito:** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array contenente l'elenco dei file da eseguire. **Predefinito:** file corrispondenti dal [modello di esecuzione del test runner](/it/nodejs/api/test#test-runner-execution-model).
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Configura il test runner per terminare il processo una volta che tutti i test noti hanno finito di essere eseguiti, anche se il ciclo di eventi altrimenti rimarrebbe attivo. **Predefinito:** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array contenente l'elenco di modelli glob per la corrispondenza dei file di test. Questa opzione non può essere utilizzata insieme a `files`. **Predefinito:** file corrispondenti dal [modello di esecuzione del test runner](/it/nodejs/api/test#test-runner-execution-model).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Imposta la porta dell'inspector del processo figlio di test. Può essere un numero o una funzione che non accetta argomenti e restituisce un numero. Se viene fornito un valore null, ogni processo ottiene la propria porta, incrementata da `process.debugPort` del primario. Questa opzione viene ignorata se l'opzione `isolation` è impostata su `'none'` poiché non vengono generati processi figlio. **Predefinito:** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Configura il tipo di isolamento del test. Se impostato su `'process'`, ogni file di test viene eseguito in un processo figlio separato. Se impostato su `'none'`, tutti i file di test vengono eseguiti nel processo corrente. **Predefinito:** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se truthy, il contesto del test eseguirà solo i test che hanno l'opzione `only` impostata
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione che accetta l'istanza `TestsStream` e può essere utilizzata per impostare i listener prima che vengano eseguiti test. **Predefinito:** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di flag CLI da passare all'eseguibile `node` quando si generano i sottoprocessi. Questa opzione non ha effetto quando `isolation` è `'none`'. **Predefinito:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di flag CLI da passare a ciascun file di test quando si generano i sottoprocessi. Questa opzione non ha effetto quando `isolation` è `'none'`. **Predefinito:** `[]`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un'esecuzione di test in corso.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Una stringa, RegExp o un array RegExp, che può essere utilizzato per eseguire solo i test il cui nome corrisponde al pattern fornito. I pattern dei nomi dei test vengono interpretati come espressioni regolari JavaScript. Per ogni test eseguito, vengono eseguiti anche tutti gli hook di test corrispondenti, come `beforeEach()`. **Predefinito:** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Una stringa, RegExp o un array RegExp, che può essere utilizzato per escludere l'esecuzione di test il cui nome corrisponde al pattern fornito. I pattern dei nomi dei test vengono interpretati come espressioni regolari JavaScript. Per ogni test eseguito, vengono eseguiti anche tutti gli hook di test corrispondenti, come `beforeEach()`. **Predefinito:** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo i quali l'esecuzione del test fallirà. Se non specificato, i subtest ereditano questo valore dal loro genitore. **Predefinito:** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se eseguire o meno in modalità watch. **Predefinito:** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Esecuzione di test in uno shard specifico. **Predefinito:** `undefined`.
        - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) è un intero positivo compreso tra 1 e `\<total\>` che specifica l'indice dello shard da eseguire. Questa opzione è *obbligatoria*.
        - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) è un intero positivo che specifica il numero totale di shard in cui suddividere i file di test. Questa opzione è *obbligatoria*.


    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) abilita la raccolta della [code coverage](/it/nodejs/api/test#collecting-code-coverage). **Predefinito:** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Esclude file specifici dalla code coverage utilizzando un pattern glob, che può corrispondere sia a percorsi di file assoluti che relativi. Questa proprietà è applicabile solo quando `coverage` è stato impostato su `true`. Se vengono forniti sia `coverageExcludeGlobs` che `coverageIncludeGlobs`, i file devono soddisfare **entrambi** i criteri per essere inclusi nel report di coverage. **Predefinito:** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Include file specifici nella code coverage utilizzando un pattern glob, che può corrispondere sia a percorsi di file assoluti che relativi. Questa proprietà è applicabile solo quando `coverage` è stato impostato su `true`. Se vengono forniti sia `coverageExcludeGlobs` che `coverageIncludeGlobs`, i file devono soddisfare **entrambi** i criteri per essere inclusi nel report di coverage. **Predefinito:** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Richiedi una percentuale minima di righe coperte. Se la code coverage non raggiunge la soglia specificata, il processo terminerà con il codice `1`. **Predefinito:** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Richiedi una percentuale minima di branch coperte. Se la code coverage non raggiunge la soglia specificata, il processo terminerà con il codice `1`. **Predefinito:** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Richiedi una percentuale minima di funzioni coperte. Se la code coverage non raggiunge la soglia specificata, il processo terminerà con il codice `1`. **Predefinito:** `0`.


- Restituisce: [\<TestsStream\>](/it/nodejs/api/test#class-testsstream)

**Nota:** `shard` viene utilizzato per parallelizzare orizzontalmente l'esecuzione dei test su più macchine o processi, ideale per esecuzioni su larga scala in ambienti diversi. È incompatibile con la modalità `watch`, pensata per una rapida iterazione del codice eseguendo automaticamente i test sulle modifiche dei file.



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

**Aggiunto in: v22.0.0, v20.13.0**

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome della suite, che viene visualizzato quando si riportano i risultati dei test. **Predefinito:** La proprietà `name` di `fn`, oppure `'\<anonymous\>'` se `fn` non ha un nome.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione facoltative per la suite. Supporta le stesse opzioni di `test([name][, options][, fn])`.
- `fn` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<FunzioneAsincrona\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione suite che dichiara test e suite nidificati. Il primo argomento di questa funzione è un oggetto [`SuiteContext`](/it/nodejs/api/test#class-suitecontext). **Predefinito:** Una funzione no-op.
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Immediatamente soddisfatta con `undefined`.

La funzione `suite()` viene importata dal modulo `node:test`.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**Aggiunto in: v22.0.0, v20.13.0**

Abbreviazione per saltare una suite. È lo stesso di [`suite([name], { skip: true }[, fn])`](/it/nodejs/api/test#suitename-options-fn).

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**Aggiunto in: v22.0.0, v20.13.0**

Abbreviazione per contrassegnare una suite come `TODO`. È lo stesso di [`suite([name], { todo: true }[, fn])`](/it/nodejs/api/test#suitename-options-fn).

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**Aggiunto in: v22.0.0, v20.13.0**

Abbreviazione per contrassegnare una suite come `only`. È lo stesso di [`suite([name], { only: true }[, fn])`](/it/nodejs/api/test#suitename-options-fn).

## `test([name][, options][, fn])` {#testname-options-fn}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.2.0, v18.17.0 | Aggiunte le abbreviazioni `skip`, `todo` e `only`. |
| v18.8.0, v16.18.0 | Aggiunta un'opzione `signal`. |
| v18.7.0, v16.17.0 | Aggiunta un'opzione `timeout`. |
| v18.0.0, v16.17.0 | Aggiunto in: v18.0.0, v16.17.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del test, che viene visualizzato quando si riportano i risultati dei test. **Predefinito:** La proprietà `name` di `fn`, oppure `'\<anonymous\>'` se `fn` non ha un nome.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per il test. Sono supportate le seguenti proprietà:
    - `concurrency` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se viene fornito un numero, quel numero di test verrebbe eseguito in parallelo all'interno del thread dell'applicazione. Se `true`, tutti i test asincroni pianificati vengono eseguiti contemporaneamente all'interno del thread. Se `false`, viene eseguito un solo test alla volta. Se non specificato, i sottotest ereditano questo valore dal loro genitore. **Predefinito:** `false`.
    - `only` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se truthy e il contesto del test è configurato per eseguire solo test `only`, questo test verrà eseguito. Altrimenti, il test viene saltato. **Predefinito:** `false`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un test in corso.
    - `skip` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se truthy, il test viene saltato. Se viene fornita una stringa, quella stringa viene visualizzata nei risultati del test come motivo per saltare il test. **Predefinito:** `false`.
    - `todo` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se truthy, il test viene contrassegnato come `TODO`. Se viene fornita una stringa, quella stringa viene visualizzata nei risultati del test come motivo per cui il test è `TODO`. **Predefinito:** `false`.
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo il quale il test fallirà. Se non specificato, i sottotest ereditano questo valore dal loro genitore. **Predefinito:** `Infinity`.
    - `plan` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di asserzioni e sottotest che si prevede vengano eseguiti nel test. Se il numero di asserzioni eseguite nel test non corrisponde al numero specificato nel piano, il test fallirà. **Predefinito:** `undefined`.


- `fn` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<FunzioneAsincrona\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione sotto test. Il primo argomento di questa funzione è un oggetto [`TestContext`](/it/nodejs/api/test#class-testcontext). Se il test utilizza callback, la funzione di callback viene passata come secondo argomento. **Predefinito:** Una funzione no-op.
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Soddisfatta con `undefined` una volta completato il test, oppure immediatamente se il test viene eseguito all'interno di una suite.

La funzione `test()` è il valore importato dal modulo `test`. Ogni invocazione di questa funzione comporta la segnalazione del test allo [\<TestsStream\>](/it/nodejs/api/test#class-testsstream).

L'oggetto `TestContext` passato all'argomento `fn` può essere utilizzato per eseguire azioni relative al test corrente. Gli esempi includono saltare il test, aggiungere ulteriori informazioni diagnostiche o creare sottotest.

`test()` restituisce una `Promise` che si soddisfa una volta completato il test. Se `test()` viene chiamato all'interno di una suite, si soddisfa immediatamente. Il valore di ritorno può solitamente essere scartato per i test di livello superiore. Tuttavia, il valore di ritorno dai sottotest deve essere utilizzato per impedire che il test padre finisca prima e annulli il sottotest, come mostrato nel seguente esempio.

```js [ESM]
test('test di livello superiore', async (t) => {
  // Il setTimeout() nel seguente sottotest farebbe sì che sopravvivesse al suo
  // test padre se 'await' viene rimosso nella riga successiva. Una volta che il test padre
  // viene completato, annullerà tutti i sottotest in sospeso.
  await t.test('sottotest a esecuzione più lunga', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
L'opzione `timeout` può essere utilizzata per far fallire il test se impiega più di `timeout` millisecondi per essere completato. Tuttavia, non è un meccanismo affidabile per annullare i test perché un test in esecuzione potrebbe bloccare il thread dell'applicazione e quindi impedire l'annullamento pianificato.


## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

Abbreviazione per saltare un test, equivalente a [`test([name], { skip: true }[, fn])`](/it/nodejs/api/test#testname-options-fn).

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

Abbreviazione per contrassegnare un test come `TODO`, equivalente a [`test([name], { todo: true }[, fn])`](/it/nodejs/api/test#testname-options-fn).

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

Abbreviazione per contrassegnare un test come `only`, equivalente a [`test([name], { only: true }[, fn])`](/it/nodejs/api/test#testname-options-fn).

## `describe([name][, options][, fn])` {#describename-options-fn}

Alias per [`suite()`](/it/nodejs/api/test#suitename-options-fn).

La funzione `describe()` viene importata dal modulo `node:test`.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

Abbreviazione per saltare una suite. È equivalente a [`describe([name], { skip: true }[, fn])`](/it/nodejs/api/test#describename-options-fn).

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

Abbreviazione per contrassegnare una suite come `TODO`. È equivalente a [`describe([name], { todo: true }[, fn])`](/it/nodejs/api/test#describename-options-fn).

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**Aggiunto in: v19.8.0, v18.15.0**

Abbreviazione per contrassegnare una suite come `only`. È equivalente a [`describe([name], { only: true }[, fn])`](/it/nodejs/api/test#describename-options-fn).

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.8.0, v18.16.0 | La chiamata a `it()` ora equivale alla chiamata a `test()`. |
| v18.6.0, v16.17.0 | Aggiunto in: v18.6.0, v16.17.0 |
:::

Alias per [`test()`](/it/nodejs/api/test#testname-options-fn).

La funzione `it()` viene importata dal modulo `node:test`.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

Abbreviazione per saltare un test, equivalente a [`it([name], { skip: true }[, fn])`](/it/nodejs/api/test#testname-options-fn).

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

Abbreviazione per contrassegnare un test come `TODO`, equivalente a [`it([name], { todo: true }[, fn])`](/it/nodejs/api/test#testname-options-fn).

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**Aggiunto in: v19.8.0, v18.15.0**

Abbreviazione per contrassegnare un test come `only`, equivalente a [`it([name], { only: true }[, fn])`](/it/nodejs/api/test#testname-options-fn).


## `before([fn][, options])` {#beforefn-options}

**Aggiunto in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione hook. Se l'hook utilizza callback, la funzione di callback viene passata come secondo argomento. **Predefinito:** una funzione no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'hook. Sono supportate le seguenti proprietà:
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un hook in corso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo i quali l'hook fallirà. Se non specificato, i sottotest ereditano questo valore dal loro genitore. **Predefinito:** `Infinity`.

Questa funzione crea un hook che viene eseguito prima dell'esecuzione di una suite.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Aggiunto in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione hook. Se l'hook utilizza callback, la funzione di callback viene passata come secondo argomento. **Predefinito:** una funzione no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'hook. Sono supportate le seguenti proprietà:
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un hook in corso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo i quali l'hook fallirà. Se non specificato, i sottotest ereditano questo valore dal loro genitore. **Predefinito:** `Infinity`.

Questa funzione crea un hook che viene eseguito dopo l'esecuzione di una suite.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**Nota:** L'hook `after` è garantito per essere eseguito, anche se i test all'interno della suite falliscono.


## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Aggiunto in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione hook. Se l'hook utilizza delle callback, la funzione callback viene passata come secondo argomento. **Predefinito:** Una funzione no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'hook. Sono supportate le seguenti proprietà:
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un hook in corso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo i quali l'hook fallirà. Se non specificato, i subtest ereditano questo valore dal loro genitore. **Predefinito:** `Infinity`.
  
 

Questa funzione crea un hook che viene eseguito prima di ogni test nella suite corrente.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Aggiunto in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione hook. Se l'hook utilizza delle callback, la funzione callback viene passata come secondo argomento. **Predefinito:** Una funzione no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'hook. Sono supportate le seguenti proprietà:
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un hook in corso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo i quali l'hook fallirà. Se non specificato, i subtest ereditano questo valore dal loro genitore. **Predefinito:** `Infinity`.
  
 

Questa funzione crea un hook che viene eseguito dopo ogni test nella suite corrente. L'hook `afterEach()` viene eseguito anche se il test fallisce.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```

## `snapshot` {#snapshot}

**Aggiunto in: v22.3.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

Un oggetto i cui metodi vengono utilizzati per configurare le impostazioni predefinite degli snapshot nel processo corrente. È possibile applicare la stessa configurazione a tutti i file inserendo il codice di configurazione comune in un modulo precaricato con `--require` o `--import`.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#snapshotsetdefaultsnapshotserializersserializers}

**Aggiunto in: v22.3.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di funzioni sincrone utilizzate come serializzatori predefiniti per i test snapshot.

Questa funzione viene utilizzata per personalizzare il meccanismo di serializzazione predefinito utilizzato dal test runner. Per impostazione predefinita, il test runner esegue la serializzazione chiamando `JSON.stringify(value, null, 2)` sul valore fornito. `JSON.stringify()` ha delle limitazioni riguardanti le strutture circolari e i tipi di dati supportati. Se è necessario un meccanismo di serializzazione più robusto, è necessario utilizzare questa funzione.

### `snapshot.setResolveSnapshotPath(fn)` {#snapshotsetresolvesnapshotpathfn}

**Aggiunto in: v22.3.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione utilizzata per calcolare la posizione del file snapshot. La funzione riceve il percorso del file di test come unico argomento. Se il test non è associato a un file (ad esempio nella REPL), l'input è indefinito. `fn()` deve restituire una stringa che specifica la posizione del file snapshot.

Questa funzione viene utilizzata per personalizzare la posizione del file snapshot utilizzato per il test snapshot. Per impostazione predefinita, il nome del file snapshot è lo stesso del nome del file punto di ingresso con un'estensione del file `.snapshot`.


## Classe: `MockFunctionContext` {#class-mockfunctioncontext}

**Aggiunto in: v19.1.0, v18.13.0**

La classe `MockFunctionContext` viene utilizzata per ispezionare o manipolare il comportamento dei mock creati tramite le API [`MockTracker`](/it/nodejs/api/test#class-mocktracker).

### `ctx.calls` {#ctxcalls}

**Aggiunto in: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un getter che restituisce una copia dell'array interno utilizzato per tracciare le chiamate al mock. Ogni voce nell'array è un oggetto con le seguenti proprietà.

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array degli argomenti passati alla funzione mock.
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Se la funzione mock ha generato un'eccezione, questa proprietà contiene il valore generato. **Predefinito:** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore restituito dalla funzione mock.
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un oggetto `Error` il cui stack può essere utilizzato per determinare il callsite dell'invocazione della funzione mock.
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se la funzione mock è un costruttore, questo campo contiene la classe in costruzione. Altrimenti questo sarà `undefined`.
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore `this` della funzione mock.

### `ctx.callCount()` {#ctxcallcount}

**Aggiunto in: v19.1.0, v18.13.0**

- Restituisce: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di volte in cui questo mock è stato invocato.

Questa funzione restituisce il numero di volte in cui questo mock è stato invocato. Questa funzione è più efficiente rispetto al controllo di `ctx.calls.length` perché `ctx.calls` è un getter che crea una copia dell'array interno di tracciamento delle chiamate.


### `ctx.mockImplementation(implementation)` {#ctxmockimplementationimplementation}

**Aggiunto in: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione da utilizzare come nuova implementazione del mock.

Questa funzione viene utilizzata per modificare il comportamento di un mock esistente.

L'esempio seguente crea una funzione mock usando `t.mock.fn()`, chiama la funzione mock e quindi modifica l'implementazione del mock in una funzione diversa.

```js [ESM]
test('modifica il comportamento di un mock', (t) => {
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

**Aggiunto in: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione da utilizzare come implementazione del mock per il numero di invocazione specificato da `onCall`.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di invocazione che utilizzerà `implementation`. Se l'invocazione specificata è già avvenuta, viene generata un'eccezione. **Predefinito:** Il numero della prossima invocazione.

Questa funzione viene utilizzata per modificare il comportamento di un mock esistente per una singola invocazione. Una volta che l'invocazione `onCall` si è verificata, il mock ripristinerà qualsiasi comportamento avrebbe utilizzato se `mockImplementationOnce()` non fosse stato chiamato.

L'esempio seguente crea una funzione mock usando `t.mock.fn()`, chiama la funzione mock, modifica l'implementazione del mock in una funzione diversa per la prossima invocazione e quindi riprende il suo comportamento precedente.

```js [ESM]
test('modifica il comportamento di un mock una volta', (t) => {
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

**Aggiunto in: v19.3.0, v18.13.0**

Ripristina la cronologia delle chiamate della funzione mock.

### `ctx.restore()` {#ctxrestore}

**Aggiunto in: v19.1.0, v18.13.0**

Ripristina l'implementazione della funzione mock al suo comportamento originale. Il mock può essere ancora utilizzato dopo aver chiamato questa funzione.

## Classe: `MockModuleContext` {#class-mockmodulecontext}

**Aggiunto in: v22.3.0, v20.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

La classe `MockModuleContext` viene utilizzata per manipolare il comportamento dei mock dei moduli creati tramite le API [`MockTracker`](/it/nodejs/api/test#class-mocktracker).

### `ctx.restore()` {#ctxrestore_1}

**Aggiunto in: v22.3.0, v20.18.0**

Ripristina l'implementazione del modulo mock.

## Classe: `MockTracker` {#class-mocktracker}

**Aggiunto in: v19.1.0, v18.13.0**

La classe `MockTracker` viene utilizzata per gestire la funzionalità di mocking. Il modulo test runner fornisce un'esportazione `mock` di livello superiore che è un'istanza di `MockTracker`. Ogni test fornisce anche la propria istanza di `MockTracker` tramite la proprietà `mock` del contesto di test.

### `mock.fn([original[, implementation]][, options])` {#mockfnoriginal-implementation-options}

**Aggiunto in: v19.1.0, v18.13.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Una funzione opzionale su cui creare un mock. **Predefinito:** Una funzione no-op.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Una funzione opzionale utilizzata come implementazione mock per `original`. Questo è utile per creare mock che mostrano un comportamento per un numero specificato di chiamate e quindi ripristinare il comportamento di `original`. **Predefinito:** La funzione specificata da `original`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione opzionali per la funzione mock. Sono supportate le seguenti proprietà:
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di volte in cui il mock utilizzerà il comportamento di `implementation`. Una volta che la funzione mock è stata chiamata `times` volte, ripristinerà automaticamente il comportamento di `original`. Questo valore deve essere un numero intero maggiore di zero. **Predefinito:** `Infinity`.

- Restituisce: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) La funzione mockata. La funzione mockata contiene una proprietà speciale `mock`, che è un'istanza di [`MockFunctionContext`](/it/nodejs/api/test#class-mockfunctioncontext) e può essere utilizzata per ispezionare e modificare il comportamento della funzione mockata.

Questa funzione viene utilizzata per creare una funzione mock.

L'esempio seguente crea una funzione mock che incrementa un contatore di uno a ogni invocazione. L'opzione `times` viene utilizzata per modificare il comportamento del mock in modo che le prime due invocazioni aggiungano due al contatore anziché uno.

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

**Aggiunto in: v19.3.0, v18.13.0**

Questa funzione è una sintassi semplificata per [`MockTracker.method`](/it/nodejs/api/test#mockmethodobject-methodname-implementation-options) con `options.getter` impostato su `true`.

### `mock.method(object, methodName[, implementation][, options])` {#mockmethodobject-methodname-implementation-options}

**Aggiunto in: v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto il cui metodo viene simulato.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) L'identificatore del metodo sull'oggetto `object` da simulare. Se `object[methodName]` non è una funzione, viene generato un errore.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Una funzione opzionale usata come implementazione simulata per `object[methodName]`. **Predefinito:** Il metodo originale specificato da `object[methodName]`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione opzionali per il metodo simulato. Sono supportate le seguenti proprietà:
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, `object[methodName]` viene trattato come un getter. Questa opzione non può essere utilizzata con l'opzione `setter`. **Predefinito:** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, `object[methodName]` viene trattato come un setter. Questa opzione non può essere utilizzata con l'opzione `getter`. **Predefinito:** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di volte in cui il mock userà il comportamento di `implementation`. Una volta che il metodo simulato è stato chiamato `times` volte, ripristinerà automaticamente il comportamento originale. Questo valore deve essere un numero intero maggiore di zero. **Predefinito:** `Infinity`.

- Restituisce: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) Il metodo simulato. Il metodo simulato contiene una speciale proprietà `mock`, che è un'istanza di [`MockFunctionContext`](/it/nodejs/api/test#class-mockfunctioncontext), e può essere utilizzata per ispezionare e modificare il comportamento del metodo simulato.

Questa funzione viene utilizzata per creare un mock su un metodo di oggetto esistente. Il seguente esempio dimostra come viene creato un mock su un metodo di oggetto esistente.

```js [ESM]
test('spies on an object method', (t) => {
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

**Aggiunto in: v22.3.0, v20.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

- `specifier` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Una stringa che identifica il modulo da simulare.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione opzionali per il modulo simulato. Sono supportate le seguenti proprietà:
    - `cache` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `false`, ogni chiamata a `require()` o `import()` genera un nuovo modulo simulato. Se `true`, le chiamate successive restituiranno lo stesso modulo simulato e il modulo simulato viene inserito nella cache CommonJS. **Predefinito:** false.
    - `defaultExport` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valore opzionale utilizzato come esportazione predefinita del modulo simulato. Se questo valore non viene fornito, le simulazioni ESM non includono un'esportazione predefinita. Se la simulazione è un modulo CommonJS o builtin, questa impostazione viene utilizzata come valore di `module.exports`. Se questo valore non viene fornito, le simulazioni CJS e builtin utilizzano un oggetto vuoto come valore di `module.exports`.
    - `namedExports` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto opzionale le cui chiavi e valori vengono utilizzati per creare le esportazioni nominate del modulo simulato. Se la simulazione è un modulo CommonJS o builtin, questi valori vengono copiati su `module.exports`. Pertanto, se una simulazione viene creata sia con esportazioni nominate che con un'esportazione predefinita non oggetto, la simulazione genererà un'eccezione quando utilizzata come modulo CJS o builtin.

- Restituisce: [\<MockModuleContext\>](/it/nodejs/api/test#class-mockmodulecontext) Un oggetto che può essere utilizzato per manipolare la simulazione.

Questa funzione viene utilizzata per simulare le esportazioni di moduli ECMAScript, moduli CommonJS e moduli builtin di Node.js. Qualsiasi riferimento al modulo originale prima della simulazione non è interessato. Per abilitare la simulazione del modulo, Node.js deve essere avviato con il flag della riga di comando [`--experimental-test-module-mocks`](/it/nodejs/api/cli#--experimental-test-module-mocks).

L'esempio seguente dimostra come viene creata una simulazione per un modulo.

```js [ESM]
test('simula un modulo builtin in entrambi i sistemi di moduli', async (t) => {
  // Crea una simulazione di 'node:readline' con un'esportazione nominata 'fn', che
  // non esiste nel modulo originale 'node:readline'.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() è un'esportazione del modulo originale 'node:readline'.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // La simulazione viene ripristinata, quindi viene restituito il modulo builtin originale.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```

### `mock.reset()` {#mockreset}

**Aggiunto in: v19.1.0, v18.13.0**

Questa funzione ripristina il comportamento predefinito di tutti i mock creati in precedenza da questo `MockTracker` e dissocia i mock dall'istanza `MockTracker`. Una volta dissociati, i mock possono ancora essere utilizzati, ma l'istanza `MockTracker` non può più essere utilizzata per ripristinare il loro comportamento o interagire con essi in altro modo.

Al termine di ogni test, questa funzione viene chiamata sul `MockTracker` del contesto del test. Se il `MockTracker` globale viene utilizzato ampiamente, si consiglia di chiamare questa funzione manualmente.

### `mock.restoreAll()` {#mockrestoreall}

**Aggiunto in: v19.1.0, v18.13.0**

Questa funzione ripristina il comportamento predefinito di tutti i mock creati in precedenza da questo `MockTracker`. A differenza di `mock.reset()`, `mock.restoreAll()` non dissocia i mock dall'istanza `MockTracker`.

### `mock.setter(object, methodName[, implementation][, options])` {#mocksetterobject-methodname-implementation-options}

**Aggiunto in: v19.3.0, v18.13.0**

Questa funzione è un'astrazione sintattica per [`MockTracker.method`](/it/nodejs/api/test#mockmethodobject-methodname-implementation-options) con `options.setter` impostato su `true`.

## Classe: `MockTimers` {#class-mocktimers}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.1.0 | I Mock Timers sono ora stabili. |
| v20.4.0, v18.19.0 | Aggiunto in: v20.4.0, v18.19.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Il mocking dei timer è una tecnica comunemente usata nei test del software per simulare e controllare il comportamento dei timer, come `setInterval` e `setTimeout`, senza attendere effettivamente gli intervalli di tempo specificati.

MockTimers è anche in grado di simulare l'oggetto `Date`.

Il [`MockTracker`](/it/nodejs/api/test#class-mocktracker) fornisce un export `timers` di livello superiore che è un'istanza di `MockTimers`.

### `timers.enable([enableOptions])` {#timersenableenableoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.2.0, v20.11.0 | Parametri aggiornati per essere un oggetto opzione con API disponibili e l'epoca iniziale predefinita. |
| v20.4.0, v18.19.0 | Aggiunto in: v20.4.0, v18.19.0 |
:::

Abilita il mocking dei timer per i timer specificati.

- `enableOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione opzionali per l'abilitazione del mocking dei timer. Sono supportate le seguenti proprietà:
    - `apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array opzionale contenente i timer da simulare. I valori dei timer attualmente supportati sono `'setInterval'`, `'setTimeout'`, `'setImmediate'` e `'Date'`. **Predefinito:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. Se non viene fornito alcun array, tutte le API relative al tempo (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` e `'clearImmediate'`) verranno simulate per impostazione predefinita.
    - `now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) Un numero o un oggetto Date opzionale che rappresenta il tempo iniziale (in millisecondi) da utilizzare come valore per `Date.now()`. **Predefinito:** `0`.
  
 

**Nota:** quando si abilita il mocking per un timer specifico, anche la sua funzione di clear associata verrà simulata implicitamente.

**Nota:** il mocking di `Date` influirà sul comportamento dei timer simulati in quanto utilizzano lo stesso orologio interno.

Esempio di utilizzo senza impostare il tempo iniziale:



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

L'esempio precedente abilita il mocking per il timer `setInterval` e simula implicitamente la funzione `clearInterval`. Verranno simulate solo le funzioni `setInterval` e `clearInterval` da [node:timers](/it/nodejs/api/timers), [node:timers/promises](/it/nodejs/api/timers#timers-promises-api) e `globalThis`.

Esempio di utilizzo con il tempo iniziale impostato



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

Esempio di utilizzo con l'oggetto Date iniziale come tempo impostato



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

In alternativa, se si chiama `mock.timers.enable()` senza parametri:

Tutti i timer (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'` e `'clearImmediate'`) verranno simulati. Le funzioni `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate` e `clearImmediate` da `node:timers`, `node:timers/promises` e `globalThis` verranno simulate. Così come l'oggetto `Date` globale.


### `timers.reset()` {#timersreset}

**Aggiunto in: v20.4.0, v18.19.0**

Questa funzione ripristina il comportamento predefinito di tutti i mock creati in precedenza da questa istanza di `MockTimers` e dissocia i mock dall'istanza di `MockTracker`.

**Nota:** Al termine di ogni test, questa funzione viene chiamata sul `MockTracker` del contesto del test.

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

Chiama `timers.reset()`.

### `timers.tick([milliseconds])` {#timerstickmilliseconds}

**Aggiunto in: v20.4.0, v18.19.0**

Avanza il tempo per tutti i timer simulati.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità di tempo, in millisecondi, per avanzare i timer. **Predefinito:** `1`.

**Nota:** Questo si discosta dal comportamento di `setTimeout` in Node.js e accetta solo numeri positivi. In Node.js, `setTimeout` con numeri negativi è supportato solo per motivi di compatibilità web.

L'esempio seguente simula una funzione `setTimeout` e, utilizzando `.tick`, avanza nel tempo attivando tutti i timer in sospeso.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Avanza nel tempo
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Avanza nel tempo
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

In alternativa, la funzione `.tick` può essere chiamata più volte

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', (context) => {
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

test('simula setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', (context) => {
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

Avanzare il tempo utilizzando `.tick` avanzerà anche il tempo per qualsiasi oggetto `Date` creato dopo che il mock è stato abilitato (se anche `Date` è stato impostato per essere simulato).

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('simula setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Avanza nel tempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('simula setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Avanza nel tempo
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::


#### Utilizzo di funzioni clear {#using-clear-functions}

Come menzionato, tutte le funzioni clear dai timer (`clearTimeout`, `clearInterval` e `clearImmediate`) sono implicitamente mockate. Dai un'occhiata a questo esempio che utilizza `setTimeout`:

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mock setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', (context) => {
  const fn = context.mock.fn();

  // Opzionalmente scegli cosa mockare
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitamente mockato anche questo
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // Dato che setTimeout è stato cancellato, la funzione mock non verrà mai chiamata
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mock setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', (context) => {
  const fn = context.mock.fn();

  // Opzionalmente scegli cosa mockare
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

#### Lavorare con i moduli timer di Node.js {#working-with-nodejs-timers-modules}

Una volta abilitato il mocking dei timer, i moduli [node:timers](/it/nodejs/api/timers), [node:timers/promises](/it/nodejs/api/timers#timers-promises-api) e i timer dal contesto globale di Node.js sono abilitati:

**Nota:** La destrutturazione di funzioni come `import { setTimeout } from 'node:timers'` non è attualmente supportata da questa API.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('mock setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Opzionalmente scegli cosa mockare
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Avanza nel tempo
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

test('mock setTimeout per essere eseguito in modo sincrono senza dover effettivamente aspettare', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Opzionalmente scegli cosa mockare
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

In Node.js, `setInterval` da [node:timers/promises](/it/nodejs/api/timers#timers-promises-api) è un `AsyncGenerator` ed è anche supportato da questa API:

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

**Aggiunto in: v20.4.0, v18.19.0**

Attiva immediatamente tutti i timer simulati in sospeso. Se anche l'oggetto `Date` è simulato, farà avanzare anche l'oggetto `Date` all'ora del timer più lontano.

L'esempio seguente attiva immediatamente tutti i timer in sospeso, facendoli eseguire senza alcun ritardo.

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

**Nota:** La funzione `runAll()` è specificamente progettata per attivare i timer nel contesto della simulazione dei timer. Non ha alcun effetto sugli orologi di sistema in tempo reale o sui timer effettivi al di fuori dell'ambiente di simulazione.

### `timers.setTime(milliseconds)` {#timerssettimemilliseconds}

**Aggiunto in: v21.2.0, v20.11.0**

Imposta il timestamp Unix corrente che verrà utilizzato come riferimento per qualsiasi oggetto `Date` simulato.

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


#### Date e Timer che lavorano insieme {#dates-and-timers-working-together}

Date e oggetti timer dipendono l'uno dall'altro. Se usi `setTime()` per passare l'ora corrente all'oggetto `Date` simulato, i timer impostati con `setTimeout` e `setInterval` **non** saranno influenzati.

Tuttavia, il metodo `tick` **avanzera** l'oggetto `Date` simulato.

::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('esegui tutte le funzioni seguendo l\'ordine dato', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // La data è avanzata ma i timer non scattano
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('esegui tutte le funzioni seguendo l\'ordine dato', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // La data è avanzata ma i timer non scattano
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## Classe: `TestsStream` {#class-testsstream}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | aggiunto il tipo agli eventi test:pass e test:fail per quando il test è una suite. |
| v18.9.0, v16.19.0 | Aggiunto in: v18.9.0, v16.19.0 |
:::

- Estende [\<Readable\>](/it/nodejs/api/stream#class-streamreadable)

Una chiamata riuscita al metodo [`run()`](/it/nodejs/api/test#runoptions) restituirà un nuovo oggetto [\<TestsStream\>](/it/nodejs/api/test#class-testsstream), trasmettendo una serie di eventi che rappresentano l'esecuzione dei test. `TestsStream` emetterà eventi, nell'ordine della definizione dei test

Alcuni degli eventi sono garantiti per essere emessi nello stesso ordine in cui sono definiti i test, mentre altri vengono emessi nell'ordine in cui i test vengono eseguiti.


### Evento: `'test:coverage'` {#event-testcoverage}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto contenente il report sulla coverage.
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di report sulla coverage per singoli file. Ogni report è un oggetto con il seguente schema:
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso assoluto del file.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di righe.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di branch.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di funzioni.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di righe coperte.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di branch coperte.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di funzioni coperte.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La percentuale di righe coperte.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La percentuale di branch coperte.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La percentuale di funzioni coperte.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di funzioni che rappresentano la coverage delle funzioni.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome della funzione.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di riga in cui è definita la funzione.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di volte in cui la funzione è stata chiamata.
  
 
    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di branch che rappresentano la coverage dei branch.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di riga in cui è definito il branch.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di volte in cui il branch è stato eseguito.
  
 
    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di righe che rappresentano i numeri di riga e il numero di volte in cui sono state coperte.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di riga.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di volte in cui la riga è stata coperta.
  
 
  
 
    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto contenente se la coverage per ogni tipo di coverage è sufficiente o meno.
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La soglia di coverage delle funzioni.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La soglia di coverage dei branch.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La soglia di coverage delle righe.
  
 
    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto contenente un riepilogo della coverage per tutti i file.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di righe.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di branch.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di funzioni.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di righe coperte.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di branch coperte.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di funzioni coperte.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La percentuale di righe coperte.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La percentuale di branch coperte.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La percentuale di funzioni coperte.
  
 
    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La directory di lavoro quando è iniziata la code coverage. Questo è utile per visualizzare i nomi dei percorsi relativi nel caso in cui i test abbiano modificato la directory di lavoro del processo Node.js.
  
 
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.
  
 

Emesso quando la code coverage è abilitata e tutti i test sono stati completati.


### Evento: `'test:complete'` {#event-testcomplete}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di colonna in cui il test è definito, o `undefined` se il test è stato eseguito tramite REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadati di esecuzione aggiuntivi.
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il test è stato superato o meno.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durata del test in millisecondi.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un errore che incapsula l'errore generato dal test se non è stato superato.
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'errore effettivo generato dal test.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il tipo di test, utilizzato per indicare se si tratta di una suite.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test, `undefined` se il test è stato eseguito tramite REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di riga in cui il test è definito, o `undefined` se il test è stato eseguito tramite REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero ordinale del test.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se viene chiamato [`context.todo`](/it/nodejs/api/test#contexttodomessage).
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se viene chiamato [`context.skip`](/it/nodejs/api/test#contextskipmessage).
  
 

Emesso quando un test completa la sua esecuzione. Questo evento non viene emesso nello stesso ordine in cui sono definiti i test. Gli eventi ordinati di dichiarazione corrispondenti sono `'test:pass'` e `'test:fail'`.


### Evento: `'test:dequeue'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di colonna in cui è definito il test, o `undefined` se il test è stato eseguito tramite REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test, `undefined` se il test è stato eseguito tramite REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di riga in cui è definito il test, o `undefined` se il test è stato eseguito tramite REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.
  
 

Emesso quando un test viene rimosso dalla coda, immediatamente prima di essere eseguito. Non è garantito che questo evento venga emesso nello stesso ordine in cui sono definiti i test. L'evento ordinato di dichiarazione corrispondente è `'test:start'`.

### Evento: `'test:diagnostic'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di colonna in cui è definito il test, o `undefined` se il test è stato eseguito tramite REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test, `undefined` se il test è stato eseguito tramite REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di riga in cui è definito il test, o `undefined` se il test è stato eseguito tramite REPL.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il messaggio diagnostico.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.
  
 

Emesso quando viene chiamato [`context.diagnostic`](/it/nodejs/api/test#contextdiagnosticmessage). È garantito che questo evento venga emesso nello stesso ordine in cui sono definiti i test.


### Evento: `'test:enqueue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di colonna in cui è definito il test, o `undefined` se il test è stato eseguito tramite REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test, `undefined` se il test è stato eseguito tramite REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di riga in cui è definito il test, o `undefined` se il test è stato eseguito tramite REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.
  
 

Emesso quando un test viene accodato per l'esecuzione.

### Evento: `'test:fail'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di colonna in cui è definito il test, o `undefined` se il test è stato eseguito tramite REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadati di esecuzione aggiuntivi. 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durata del test in millisecondi.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un errore che avvolge l'errore generato dal test. 
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'errore effettivo generato dal test.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il tipo di test, utilizzato per indicare se si tratta di una suite.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test, `undefined` se il test è stato eseguito tramite REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di riga in cui è definito il test, o `undefined` se il test è stato eseguito tramite REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero ordinale del test.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se viene chiamato [`context.todo`](/it/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se viene chiamato [`context.skip`](/it/nodejs/api/test#contextskipmessage)
  
 

Emesso quando un test fallisce. È garantito che questo evento venga emesso nello stesso ordine in cui sono definiti i test. L'evento corrispondente ordinato per esecuzione è `'test:complete'`.


### Evento: `'test:pass'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di colonna in cui il test è definito, oppure `undefined` se il test è stato eseguito tramite la REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Metadati di esecuzione aggiuntivi.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durata del test in millisecondi.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il tipo di test, utilizzato per indicare se si tratta di una suite.

    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test, `undefined` se il test è stato eseguito tramite la REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di riga in cui il test è definito, oppure `undefined` se il test è stato eseguito tramite la REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero ordinale del test.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se viene chiamato [`context.todo`](/it/nodejs/api/test#contexttodomessage)
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Presente se viene chiamato [`context.skip`](/it/nodejs/api/test#contextskipmessage)

Emesso quando un test viene superato. È garantito che questo evento venga emesso nello stesso ordine in cui sono definiti i test. L'evento ordinato di esecuzione corrispondente è `'test:complete'`.


### Evento: `'test:plan'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di colonna dove il test è definito, o `undefined` se il test è stato eseguito tramite REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test, `undefined` se il test è stato eseguito tramite REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di riga dove il test è definito, o `undefined` se il test è stato eseguito tramite REPL.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di sottotest eseguiti.

Emesso quando tutti i sottotest sono stati completati per un dato test. Questo evento è garantito per essere emesso nello stesso ordine in cui i test sono definiti.

### Evento: `'test:start'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di colonna dove il test è definito, o `undefined` se il test è stato eseguito tramite REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test, `undefined` se il test è stato eseguito tramite REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il numero di riga dove il test è definito, o `undefined` se il test è stato eseguito tramite REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del test.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il livello di nidificazione del test.

Emesso quando un test inizia a segnalare il proprio stato e quello dei suoi sottotest. Questo evento è garantito per essere emesso nello stesso ordine in cui i test sono definiti. L'evento corrispondente ordinato per esecuzione è `'test:dequeue'`.


### Evento: `'test:stderr'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso del file di test.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il messaggio scritto su `stderr`.
  
 

Emesso quando un test in esecuzione scrive su `stderr`. Questo evento viene emesso solo se viene passato il flag `--test`. Non è garantito che questo evento venga emesso nello stesso ordine in cui sono definiti i test.

### Evento: `'test:stdout'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso del file di test.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il messaggio scritto su `stdout`.
  
 

Emesso quando un test in esecuzione scrive su `stdout`. Questo evento viene emesso solo se viene passato il flag `--test`. Non è garantito che questo evento venga emesso nello stesso ordine in cui sono definiti i test.

### Evento: `'test:summary'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto contenente i conteggi dei vari risultati dei test.
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di test annullati.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di test falliti.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di test superati.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di test saltati.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di suite eseguite.
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di test eseguiti, escluse le suite.
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di test TODO.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di test e suite di primo livello.
  
 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durata dell'esecuzione del test in millisecondi.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il percorso del file di test che ha generato il riepilogo. Se il riepilogo corrisponde a più file, questo valore è `undefined`.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se l'esecuzione del test è considerata riuscita o meno. Se si verifica una condizione di errore, come un test fallito o una soglia di copertura non soddisfatta, questo valore verrà impostato su `false`.
  
 

Emesso al completamento di un'esecuzione di test. Questo evento contiene metriche relative all'esecuzione di test completata ed è utile per determinare se un'esecuzione di test è stata superata o meno. Se viene utilizzato l'isolamento dei test a livello di processo, viene generato un evento `'test:summary'` per ciascun file di test in aggiunta a un riepilogo cumulativo finale.


### Evento: `'test:watch:drained'` {#event-testwatchdrained}

Emesso quando non ci sono più test in coda per l'esecuzione in modalità watch.

## Classe: `TestContext` {#class-testcontext}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | La funzione `before` è stata aggiunta a TestContext. |
| v18.0.0, v16.17.0 | Aggiunto in: v18.0.0, v16.17.0 |
:::

Un'istanza di `TestContext` viene passata a ciascuna funzione di test per interagire con il test runner. Tuttavia, il costruttore `TestContext` non è esposto come parte dell'API.

### `context.before([fn][, options])` {#contextbeforefn-options}

**Aggiunto in: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione hook. Il primo argomento di questa funzione è un oggetto [`TestContext`](/it/nodejs/api/test#class-testcontext). Se l'hook utilizza callback, la funzione di callback viene passata come secondo argomento. **Predefinito:** Una funzione no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'hook. Sono supportate le seguenti proprietà:
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un hook in corso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo il quale l'hook fallirà. Se non specificato, i subtest ereditano questo valore dal loro elemento principale. **Predefinito:** `Infinity`.

Questa funzione viene utilizzata per creare un hook in esecuzione prima del subtest del test corrente.

### `context.beforeEach([fn][, options])` {#contextbeforeeachfn-options}

**Aggiunto in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione hook. Il primo argomento di questa funzione è un oggetto [`TestContext`](/it/nodejs/api/test#class-testcontext). Se l'hook utilizza callback, la funzione di callback viene passata come secondo argomento. **Predefinito:** Una funzione no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'hook. Sono supportate le seguenti proprietà:
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un hook in corso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo il quale l'hook fallirà. Se non specificato, i subtest ereditano questo valore dal loro elemento principale. **Predefinito:** `Infinity`.

Questa funzione viene utilizzata per creare un hook in esecuzione prima di ogni subtest del test corrente.

```js [ESM]
test('test di livello superiore', async (t) => {
  t.beforeEach((t) => t.diagnostic(`in procinto di eseguire ${t.name}`));
  await t.test(
    'Questo è un subtest',
    (t) => {
      assert.ok('un\'asserzione rilevante qui');
    },
  );
});
```

### `context.after([fn][, options])` {#contextafterfn-options}

**Aggiunto in: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione hook. Il primo argomento di questa funzione è un oggetto [`TestContext`](/it/nodejs/api/test#class-testcontext). Se l'hook utilizza callback, la funzione di callback viene passata come secondo argomento. **Predefinito:** Una funzione no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'hook. Sono supportate le seguenti proprietà:
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un hook in corso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo il quale l'hook fallirà. Se non specificato, i sottotest ereditano questo valore dal loro elemento padre. **Predefinito:** `Infinity`.
  
 

Questa funzione viene utilizzata per creare un hook che viene eseguito al termine del test corrente.

```js [ESM]
test('test di livello superiore', async (t) => {
  t.after((t) => t.diagnostic(`esecuzione terminata di ${t.name}`));
  assert.ok('qualche asserzione rilevante qui');
});
```
### `context.afterEach([fn][, options])` {#contextaftereachfn-options}

**Aggiunto in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione hook. Il primo argomento di questa funzione è un oggetto [`TestContext`](/it/nodejs/api/test#class-testcontext). Se l'hook utilizza callback, la funzione di callback viene passata come secondo argomento. **Predefinito:** Una funzione no-op.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per l'hook. Sono supportate le seguenti proprietà:
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di interrompere un hook in corso.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo il quale l'hook fallirà. Se non specificato, i sottotest ereditano questo valore dal loro elemento padre. **Predefinito:** `Infinity`.
  
 

Questa funzione viene utilizzata per creare un hook che viene eseguito dopo ogni sottotest del test corrente.

```js [ESM]
test('test di livello superiore', async (t) => {
  t.afterEach((t) => t.diagnostic(`esecuzione terminata di ${t.name}`));
  await t.test(
    'Questo è un sottotest',
    (t) => {
      assert.ok('qualche asserzione rilevante qui');
    },
  );
});
```

### `context.assert` {#contextassert}

**Aggiunto in: v22.2.0, v20.15.0**

Un oggetto contenente metodi di asserzione legati a `context`. Le funzioni di livello superiore del modulo `node:assert` sono esposte qui allo scopo di creare piani di test.

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.snapshot(value[, options])` {#contextassertsnapshotvalue-options}

**Aggiunto in: v22.3.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Fase iniziale di sviluppo
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Un valore da serializzare in una stringa. Se Node.js è stato avviato con il flag [`--test-update-snapshots`](/it/nodejs/api/cli#--test-update-snapshots), il valore serializzato viene scritto nel file snapshot. Altrimenti, il valore serializzato viene confrontato con il valore corrispondente nel file snapshot esistente.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione opzionali. Sono supportate le seguenti proprietà:
    - `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di funzioni sincrone utilizzate per serializzare `value` in una stringa. `value` viene passato come unico argomento alla prima funzione serializzatore. Il valore di ritorno di ciascun serializzatore viene passato come input al serializzatore successivo. Una volta che tutti i serializzatori sono stati eseguiti, il valore risultante viene forzato a una stringa. **Predefinito:** Se non vengono forniti serializzatori, vengono utilizzati i serializzatori predefiniti del test runner.
  
 

Questa funzione implementa le asserzioni per il testing snapshot.

```js [ESM]
test('test snapshot con serializzazione predefinita', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('test snapshot con serializzazione personalizzata', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```

### `context.diagnostic(message)` {#contextdiagnosticmessage}

**Aggiunto in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Messaggio da riportare.

Questa funzione viene utilizzata per scrivere diagnostiche nell'output. Qualsiasi informazione diagnostica è inclusa alla fine dei risultati del test. Questa funzione non restituisce un valore.

```js [ESM]
test('test di livello superiore', (t) => {
  t.diagnostic('Un messaggio diagnostico');
});
```
### `context.filePath` {#contextfilepath}

**Aggiunto in: v22.6.0, v20.16.0**

Il percorso assoluto del file di test che ha creato il test corrente. Se un file di test importa moduli aggiuntivi che generano test, i test importati restituiranno il percorso del file di test radice.

### `context.fullName` {#contextfullname}

**Aggiunto in: v22.3.0**

Il nome del test e di ciascuno dei suoi antenati, separati da `\>`.

### `context.name` {#contextname}

**Aggiunto in: v18.8.0, v16.18.0**

Il nome del test.

### `context.plan(count)` {#contextplancount}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.4.0 | Questa funzione non è più sperimentale. |
| v22.2.0, v20.15.0 | Aggiunto in: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di asserzioni e sottotest previsti per l'esecuzione.

Questa funzione viene utilizzata per impostare il numero di asserzioni e sottotest che dovrebbero essere eseguiti all'interno del test. Se il numero di asserzioni e sottotest eseguiti non corrisponde al conteggio previsto, il test fallirà.

```js [ESM]
test('test di livello superiore', (t) => {
  t.plan(2);
  t.assert.ok('qualche asserzione rilevante qui');
  t.test('sottotest', () => {});
});
```
Quando si lavora con codice asincrono, la funzione `plan` può essere utilizzata per garantire che venga eseguito il numero corretto di asserzioni:

```js [ESM]
test('pianificazione con stream', (t, done) => {
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

**Aggiunto in: v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se eseguire solo i test `only`.

Se `shouldRunOnlyTests` è truthy, il contesto di test eseguirà solo i test che hanno l'opzione `only` impostata. Altrimenti, vengono eseguiti tutti i test. Se Node.js non è stato avviato con l'opzione da riga di comando [`--test-only`](/it/nodejs/api/cli#--test-only), questa funzione è un no-op.

```js [ESM]
test('test di livello superiore', (t) => {
  // Il contesto di test può essere impostato per eseguire subtest con l'opzione 'only'.
  t.runOnly(true);
  return Promise.all([
    t.test('questo subtest ora viene saltato'),
    t.test('questo subtest viene eseguito', { only: true }),
  ]);
});
```
### `context.signal` {#contextsignal}

**Aggiunto in: v18.7.0, v16.17.0**

- Tipo: [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)

Può essere utilizzato per interrompere le sottoattività di test quando il test è stato interrotto.

```js [ESM]
test('test di livello superiore', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#contextskipmessage}

**Aggiunto in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Messaggio di salto facoltativo.

Questa funzione fa sì che l'output del test indichi il test come saltato. Se viene fornito `message`, è incluso nell'output. La chiamata a `skip()` non termina l'esecuzione della funzione di test. Questa funzione non restituisce un valore.

```js [ESM]
test('test di livello superiore', (t) => {
  // Assicurati di tornare qui anche se il test contiene ulteriore logica.
  t.skip('questo viene saltato');
});
```
### `context.todo([message])` {#contexttodomessage}

**Aggiunto in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Messaggio `TODO` facoltativo.

Questa funzione aggiunge una direttiva `TODO` all'output del test. Se viene fornito `message`, è incluso nell'output. La chiamata a `todo()` non termina l'esecuzione della funzione di test. Questa funzione non restituisce un valore.

```js [ESM]
test('test di livello superiore', (t) => {
  // Questo test è contrassegnato come `TODO`
  t.todo('questo è un todo');
});
```

### `context.test([name][, options][, fn])` {#contexttestname-options-fn}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.8.0, v16.18.0 | Aggiunta un'opzione `signal`. |
| v18.7.0, v16.17.0 | Aggiunta un'opzione `timeout`. |
| v18.0.0, v16.17.0 | Aggiunto in: v18.0.0, v16.17.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del sottotest, che viene visualizzato durante la segnalazione dei risultati dei test. **Predefinito:** La proprietà `name` di `fn`, o `'\<anonymous\>'` se `fn` non ha un nome.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di configurazione per il sottotest. Sono supportate le seguenti proprietà:
    - `concurrency` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Se viene fornito un numero, quel numero di test verrebbe eseguito in parallelo all'interno del thread dell'applicazione. Se `true`, tutti i sottotest verrebbero eseguiti in parallelo. Se `false`, verrebbe eseguito solo un test alla volta. Se non specificato, i sottotest ereditano questo valore dal loro genitore. **Predefinito:** `null`.
    - `only` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se truthy, e il contesto del test è configurato per eseguire test `only`, allora questo test verrà eseguito. Altrimenti, il test viene saltato. **Predefinito:** `false`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Permette di interrompere un test in corso.
    - `skip` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se truthy, il test viene saltato. Se viene fornita una stringa, quella stringa viene visualizzata nei risultati del test come motivo per saltare il test. **Predefinito:** `false`.
    - `todo` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se truthy, il test viene contrassegnato come `TODO`. Se viene fornita una stringa, quella stringa viene visualizzata nei risultati del test come motivo per cui il test è `TODO`. **Predefinito:** `false`.
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un numero di millisecondi dopo il quale il test fallirà. Se non specificato, i sottotest ereditano questo valore dal loro genitore. **Predefinito:** `Infinity`.
    - `plan` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di asserzioni e sottotest che si prevede vengano eseguiti nel test. Se il numero di asserzioni eseguite nel test non corrisponde al numero specificato nel piano, il test fallirà. **Predefinito:** `undefined`.


- `fn` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) La funzione in fase di test. Il primo argomento di questa funzione è un oggetto [`TestContext`](/it/nodejs/api/test#class-testcontext). Se il test utilizza callback, la funzione di callback viene passata come secondo argomento. **Predefinito:** Una funzione no-op.
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Soddisfatta con `undefined` una volta completato il test.

Questa funzione viene utilizzata per creare sottotest nel test corrente. Questa funzione si comporta nello stesso modo della funzione [`test()`](/it/nodejs/api/test#testname-options-fn) di livello superiore.

```js [ESM]
test('test di livello superiore', async (t) => {
  await t.test(
    'Questo è un sottotest',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('qualche asserzione rilevante qui');
    },
  );
});
```

## Classe: `SuiteContext` {#class-suitecontext}

**Aggiunto in: v18.7.0, v16.17.0**

Un'istanza di `SuiteContext` viene passata a ogni funzione suite per interagire con il test runner. Tuttavia, il costruttore `SuiteContext` non è esposto come parte dell'API.

### `context.filePath` {#contextfilepath_1}

**Aggiunto in: v22.6.0**

Il percorso assoluto del file di test che ha creato la suite corrente. Se un file di test importa moduli aggiuntivi che generano suite, le suite importate restituiranno il percorso del file di test radice.

### `context.name` {#contextname_1}

**Aggiunto in: v18.8.0, v16.18.0**

Il nome della suite.

### `context.signal` {#contextsignal_1}

**Aggiunto in: v18.7.0, v16.17.0**

- Tipo: [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)

Può essere utilizzato per interrompere le attività secondarie del test quando il test è stato interrotto.

