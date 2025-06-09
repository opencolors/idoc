---
title: Documentazione Node.js - Utilità
description: La documentazione di Node.js per il modulo 'util', che fornisce funzioni di utilità per le applicazioni Node.js, inclusi debug, ispezione di oggetti e altro.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Utilità | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentazione di Node.js per il modulo 'util', che fornisce funzioni di utilità per le applicazioni Node.js, inclusi debug, ispezione di oggetti e altro.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Utilità | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentazione di Node.js per il modulo 'util', che fornisce funzioni di utilità per le applicazioni Node.js, inclusi debug, ispezione di oggetti e altro.
---


# Util {#util}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

Il modulo `node:util` supporta le esigenze delle API interne di Node.js. Molte delle utilità sono utili anche per gli sviluppatori di applicazioni e moduli. Per accedervi:

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**Aggiunto in: v8.2.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione `async`
- Restituisce: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) una funzione in stile callback

Prende una funzione `async` (o una funzione che restituisce una `Promise`) e restituisce una funzione che segue lo stile callback error-first, ovvero che accetta una callback `(err, value) => ...` come ultimo argomento. Nella callback, il primo argomento sarà il motivo del rifiuto (o `null` se la `Promise` è stata risolta) e il secondo argomento sarà il valore risolto.

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
Stamperà:

```text [TEXT]
hello world
```
La callback viene eseguita in modo asincrono e avrà una traccia dello stack limitata. Se la callback genera un'eccezione, il processo emetterà un evento [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception) e, se non gestito, si chiuderà.

Poiché `null` ha un significato speciale come primo argomento di una callback, se una funzione avvolta rifiuta una `Promise` con un valore falsy come motivo, il valore viene avvolto in un `Error` con il valore originale memorizzato in un campo denominato `reason`.

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // Quando la Promise è stata rifiutata con `null` viene avvolta con un Error e
  // il valore originale viene memorizzato in `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**Aggiunto in: v0.11.3**

- `section` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa che identifica la porzione dell'applicazione per cui viene creata la funzione `debuglog`.
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una callback invocata la prima volta che la funzione di logging viene chiamata con un argomento funzione che è una funzione di logging più ottimizzata.
- Restituisce: [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione di logging

Il metodo `util.debuglog()` viene utilizzato per creare una funzione che scrive condizionatamente messaggi di debug su `stderr` in base all'esistenza della variabile d'ambiente `NODE_DEBUG`. Se il nome `section` appare all'interno del valore di quella variabile d'ambiente, allora la funzione restituita opera in modo simile a [`console.error()`](/it/nodejs/api/console#consoleerrordata-args). In caso contrario, la funzione restituita è una no-op.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('hello from foo [%d]', 123);
```
Se questo programma viene eseguito con `NODE_DEBUG=foo` nell'ambiente, allora produrrà un output simile a:

```bash [BASH]
FOO 3245: hello from foo [123]
```
dove `3245` è l'ID del processo. Se non viene eseguito con quella variabile d'ambiente impostata, allora non stamperà nulla.

La `section` supporta anche i caratteri jolly:

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('hi there, it\'s foo-bar [%d]', 2333);
```
Se viene eseguito con `NODE_DEBUG=foo*` nell'ambiente, allora produrrà un output simile a:

```bash [BASH]
FOO-BAR 3257: hi there, it's foo-bar [2333]
```
È possibile specificare più nomi `section` separati da virgole nella variabile d'ambiente `NODE_DEBUG`: `NODE_DEBUG=fs,net,tls`.

L'argomento opzionale `callback` può essere utilizzato per sostituire la funzione di logging con una funzione diversa che non ha alcuna inizializzazione o wrapping non necessari.

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // Replace with a logging function that optimizes out
  // testing if the section is enabled
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**Aggiunto in: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il getter `util.debuglog().enabled` viene utilizzato per creare un test che può essere utilizzato in condizioni basate sull'esistenza della variabile d'ambiente `NODE_DEBUG`. Se il nome della `section` appare all'interno del valore di quella variabile d'ambiente, allora il valore restituito sarà `true`. In caso contrario, il valore restituito sarà `false`.

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```
Se questo programma viene eseguito con `NODE_DEBUG=foo` nell'ambiente, allora genererà un output simile a:

```bash [BASH]
hello from foo [123]
```
## `util.debug(section)` {#utildebugsection}

**Aggiunto in: v14.9.0**

Alias per `util.debuglog`. L'utilizzo consente la leggibilità di ciò che non implica la registrazione quando si utilizza solo `util.debuglog().enabled`.

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Gli avvisi di deprecazione vengono emessi solo una volta per ogni codice. |
| v0.8.0 | Aggiunto in: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione che viene deprecata.
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un messaggio di avviso da visualizzare quando viene richiamata la funzione deprecata.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un codice di deprecazione. Vedi l'[elenco delle API deprecate](/it/nodejs/api/deprecations#list-of-deprecated-apis) per un elenco di codici.
- Restituisce: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione deprecata incapsulata per emettere un avviso.

Il metodo `util.deprecate()` incapsula `fn` (che può essere una funzione o una classe) in modo tale che sia contrassegnata come deprecata.

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // Fai qualcosa qui.
}, 'obsoleteFunction() è deprecata. Usa invece newShinyFunction().');
```
Quando viene chiamata, `util.deprecate()` restituirà una funzione che emetterà un `DeprecationWarning` utilizzando l'evento [`'warning'`](/it/nodejs/api/process#event-warning). L'avviso verrà emesso e stampato su `stderr` la prima volta che viene chiamata la funzione restituita. Dopo che l'avviso è stato emesso, la funzione incapsulata viene chiamata senza emettere un avviso.

Se lo stesso `code` opzionale viene fornito in più chiamate a `util.deprecate()`, l'avviso verrà emesso solo una volta per quel `code`.

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // Emette un avviso di deprecazione con codice DEP0001
fn2(); // Non emette un avviso di deprecazione perché ha lo stesso codice
```
Se vengono utilizzate le flag della riga di comando `--no-deprecation` o `--no-warnings`, o se la proprietà `process.noDeprecation` è impostata su `true` *prima* del primo avviso di deprecazione, il metodo `util.deprecate()` non fa nulla.

Se vengono impostate le flag della riga di comando `--trace-deprecation` o `--trace-warnings`, o se la proprietà `process.traceDeprecation` è impostata su `true`, un avviso e una traccia dello stack vengono stampati su `stderr` la prima volta che viene chiamata la funzione deprecata.

Se viene impostata la flag della riga di comando `--throw-deprecation`, o la proprietà `process.throwDeprecation` è impostata su `true`, allora verrà generata un'eccezione quando viene chiamata la funzione deprecata.

La flag della riga di comando `--throw-deprecation` e la proprietà `process.throwDeprecation` hanno la precedenza su `--trace-deprecation` e `process.traceDeprecation`.


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.11.0 | Lo specificatore `%c` ora viene ignorato. |
| v12.0.0 | L'argomento `format` ora viene considerato tale solo se contiene effettivamente specificatori di formato. |
| v12.0.0 | Se l'argomento `format` non è una stringa di formato, la formattazione della stringa di output non dipende più dal tipo del primo argomento. Questa modifica rimuove le virgolette precedentemente presenti dalle stringhe che venivano visualizzate quando il primo argomento non era una stringa. |
| v11.4.0 | Gli specificatori `%d`, `%f` e `%i` ora supportano correttamente i Symbol. |
| v11.4.0 | La `depth` dello specificatore `%o` ha di nuovo una profondità predefinita di 4. |
| v11.0.0 | L'opzione `depth` dello specificatore `%o` ora tornerà alla profondità predefinita. |
| v10.12.0 | Gli specificatori `%d` e `%i` ora supportano BigInt. |
| v8.4.0 | Gli specificatori `%o` e `%O` sono ora supportati. |
| v0.5.3 | Aggiunto in: v0.5.3 |
:::

- `format` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa di formato simile a `printf`.

Il metodo `util.format()` restituisce una stringa formattata utilizzando il primo argomento come una stringa di formato simile a `printf` che può contenere zero o più specificatori di formato. Ogni specificatore viene sostituito con il valore convertito dall'argomento corrispondente. Gli specificatori supportati sono:

- `%s`: `String` verrà utilizzato per convertire tutti i valori tranne `BigInt`, `Object` e `-0`. I valori `BigInt` saranno rappresentati con una `n` e gli Oggetti che non hanno una funzione `toString` definita dall'utente vengono ispezionati utilizzando `util.inspect()` con le opzioni `{ depth: 0, colors: false, compact: 3 }`.
- `%d`: `Number` verrà utilizzato per convertire tutti i valori tranne `BigInt` e `Symbol`.
- `%i`: `parseInt(value, 10)` viene utilizzato per tutti i valori tranne `BigInt` e `Symbol`.
- `%f`: `parseFloat(value)` viene utilizzato per tutti i valori tranne `Symbol`.
- `%j`: JSON. Sostituito con la stringa `'[Circular]'` se l'argomento contiene riferimenti circolari.
- `%o`: `Object`. Una rappresentazione di stringa di un oggetto con la formattazione generica di oggetti JavaScript. Simile a `util.inspect()` con le opzioni `{ showHidden: true, showProxy: true }`. Questo mostrerà l'oggetto completo incluse le proprietà non enumerabili e i proxy.
- `%O`: `Object`. Una rappresentazione di stringa di un oggetto con la formattazione generica di oggetti JavaScript. Simile a `util.inspect()` senza opzioni. Questo mostrerà l'oggetto completo escluse le proprietà non enumerabili e i proxy.
- `%c`: `CSS`. Questo specificatore viene ignorato e salterà qualsiasi CSS passato.
- `%%`: singolo segno di percentuale (`'%'`). Questo non consuma un argomento.
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La stringa formattata

Se uno specificatore non ha un argomento corrispondente, non viene sostituito:

```js [ESM]
util.format('%s:%s', 'foo');
// Restituisce: 'foo:%s'
```
I valori che non fanno parte della stringa di formato vengono formattati utilizzando `util.inspect()` se il loro tipo non è `string`.

Se al metodo `util.format()` vengono passati più argomenti rispetto al numero di specificatori, gli argomenti extra vengono concatenati alla stringa restituita, separati da spazi:

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// Restituisce: 'foo:bar baz'
```
Se il primo argomento non contiene uno specificatore di formato valido, `util.format()` restituisce una stringa che è la concatenazione di tutti gli argomenti separati da spazi:

```js [ESM]
util.format(1, 2, 3);
// Restituisce: '1 2 3'
```
Se viene passato un solo argomento a `util.format()`, viene restituito così com'è senza alcuna formattazione:

```js [ESM]
util.format('%% %s');
// Restituisce: '%% %s'
```
`util.format()` è un metodo sincrono che è inteso come strumento di debug. Alcuni valori di input possono avere un significativo sovraccarico di prestazioni che può bloccare l'event loop. Utilizzare questa funzione con cautela e mai in un percorso di codice critico.


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**Aggiunto in: v10.0.0**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Questa funzione è identica a [`util.format()`](/it/nodejs/api/util#utilformatformat-args), tranne per il fatto che accetta un argomento `inspectOptions` che specifica le opzioni che vengono passate a [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options).

```js [ESM]
util.formatWithOptions({ colors: true }, 'Vedi l\'oggetto %O', { foo: 42 });
// Restituisce 'Vedi l\'oggetto { foo: 42 }', dove `42` è colorato come un numero
// quando viene stampato su un terminale.
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.3.0 | L'API è stata rinominata da `util.getCallSite` a `util.getCallSites()`. |
| v22.9.0 | Aggiunto in: v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero opzionale di frame da acquisire come oggetti call site. **Predefinito:** `10`. L'intervallo consentito è compreso tra 1 e 200.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzionale
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ricostruisci la posizione originale nella stacktrace dalla source-map. Abilitato per impostazione predefinita con il flag `--enable-source-maps`.
  
 
- Restituisce: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un array di oggetti call site
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Restituisce il nome della funzione associata a questo call site.
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Restituisce il nome della risorsa che contiene lo script per la funzione per questo call site.
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Restituisce il numero, in base 1, della riga per la chiamata di funzione associata.
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Restituisce l'offset della colonna in base 1 sulla riga per la chiamata di funzione associata.
  
 

Restituisce un array di oggetti call site contenente lo stack della funzione chiamante.

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Nome Funzione: ${callSite.functionName}`);
    console.log(`Nome Script: ${callSite.scriptName}`);
    console.log(`Numero Riga: ${callSite.lineNumber}`);
    console.log(`Numero Colonna: ${callSite.column}`);
  });
  // CallSite 1:
  // Nome Funzione: exampleFunction
  // Nome Script: /home/example.js
  // Numero Riga: 5
  // Numero Colonna: 26

  // CallSite 2:
  // Nome Funzione: anotherFunction
  // Nome Script: /home/example.js
  // Numero Riga: 22
  // Numero Colonna: 3

  // ...
}

// Una funzione per simulare un altro livello di stack
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
È possibile ricostruire le posizioni originali impostando l'opzione `sourceMap` su `true`. Se la source map non è disponibile, la posizione originale sarà la stessa della posizione corrente. Quando il flag `--enable-source-maps` è abilitato, ad esempio quando si utilizza `--experimental-transform-types`, `sourceMap` sarà `true` per impostazione predefinita.

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// Con sourceMap:
// Nome Funzione: ''
// Nome Script: example.js
// Numero Riga: 7
// Numero Colonna: 26

// Senza sourceMap:
// Nome Funzione: ''
// Nome Script: example.js
// Numero Riga: 2
// Numero Colonna: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**Aggiunto in: v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il nome stringa per un codice di errore numerico proveniente da un'API di Node.js. La mappatura tra codici di errore e nomi di errore dipende dalla piattaforma. Vedi [Errori di Sistema Comuni](/it/nodejs/api/errors#common-system-errors) per i nomi degli errori comuni.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**Aggiunto in: v16.0.0, v14.17.0**

- Restituisce: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Restituisce una Map di tutti i codici di errore di sistema disponibili dall'API di Node.js. La mappatura tra codici di errore e nomi di errore dipende dalla piattaforma. Vedi [Errori di Sistema Comuni](/it/nodejs/api/errors#common-system-errors) per i nomi degli errori comuni.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**Aggiunto in: v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il messaggio stringa per un codice di errore numerico proveniente da un'API di Node.js. La mappatura tra codici di errore e messaggi stringa dipende dalla piattaforma.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v5.0.0 | Il parametro `constructor` ora può fare riferimento a una classe ES6. |
| v0.3.0 | Aggiunto in: v0.3.0 |
:::

::: info [Stabile: 3 - Ereditato]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Ereditato: Utilizzare la sintassi della classe ES2015 e la parola chiave `extends` invece.
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

L'utilizzo di `util.inherits()` è sconsigliato. Si prega di utilizzare le parole chiave `class` ed `extends` di ES6 per ottenere il supporto dell'ereditarietà a livello di linguaggio. Si noti inoltre che i due stili sono [semanticamente incompatibili](https://github.com/nodejs/node/issues/4179).

Eredita i metodi prototype da un [costruttore](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) in un altro. Il prototype di `constructor` sarà impostato su un nuovo oggetto creato da `superConstructor`.

Questo aggiunge principalmente una convalida dell'input in aggiunta a `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)`. Come ulteriore comodità, `superConstructor` sarà accessibile tramite la proprietà `constructor.super_`.

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
Esempio ES6 utilizzando `class` ed `extends`:

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.18.0 | Aggiunto il supporto per `maxArrayLength` quando si ispezionano `Set` e `Map`. |
| v17.3.0, v16.14.0 | L'opzione `numericSeparator` è ora supportata. |
| v13.0.0 | I riferimenti circolari ora includono un marcatore al riferimento. |
| v14.6.0, v12.19.0 | Se `object` proviene ora da un `vm.Context` diverso, una funzione di ispezione personalizzata su di esso non riceverà più argomenti specifici del contesto. |
| v13.13.0, v12.17.0 | L'opzione `maxStringLength` è ora supportata. |
| v13.5.0, v12.16.0 | Le proprietà del prototipo definite dall'utente vengono ispezionate nel caso in cui `showHidden` sia `true`. |
| v12.0.0 | Il valore predefinito delle opzioni `compact` è stato modificato in `3` e il valore predefinito delle opzioni `breakLength` è stato modificato in `80`. |
| v12.0.0 | Le proprietà interne non compaiono più nell'argomento context di una funzione di ispezione personalizzata. |
| v11.11.0 | L'opzione `compact` accetta numeri per una nuova modalità di output. |
| v11.7.0 | ArrayBuffers ora mostra anche i loro contenuti binari. |
| v11.5.0 | L'opzione `getters` è ora supportata. |
| v11.4.0 | Il valore predefinito di `depth` è tornato a `2`. |
| v11.0.0 | Il valore predefinito di `depth` è stato modificato in `20`. |
| v11.0.0 | L'output dell'ispezione è ora limitato a circa 128 MiB. I dati al di sopra di tale dimensione non saranno completamente ispezionati. |
| v10.12.0 | L'opzione `sorted` è ora supportata. |
| v10.6.0 | L'ispezione di liste collegate e oggetti simili è ora possibile fino alla dimensione massima dello stack di chiamate. |
| v10.0.0 | Le voci `WeakMap` e `WeakSet` possono ora essere ispezionate. |
| v9.9.0 | L'opzione `compact` è ora supportata. |
| v6.6.0 | Le funzioni di ispezione personalizzate possono ora restituire `this`. |
| v6.3.0 | L'opzione `breakLength` è ora supportata. |
| v6.1.0 | L'opzione `maxArrayLength` è ora supportata; in particolare, gli array lunghi vengono troncati per impostazione predefinita. |
| v6.1.0 | L'opzione `showProxy` è ora supportata. |
| v0.3.0 | Aggiunto in: v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi primitivo JavaScript o `Object`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, i simboli e le proprietà non enumerabili di `object` sono inclusi nel risultato formattato. Anche le voci [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) sono incluse così come le proprietà del prototipo definite dall'utente (escluse le proprietà del metodo). **Predefinito:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di volte da ricorrere durante la formattazione di `object`. Questo è utile per ispezionare oggetti di grandi dimensioni. Per ricorrere fino alla dimensione massima dello stack di chiamate, passare `Infinity` o `null`. **Predefinito:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, l'output viene stilizzato con codici colore ANSI. I colori sono personalizzabili. Vedi [Personalizzazione dei colori di `util.inspect`](/it/nodejs/api/util#customizing-utilinspect-colors). **Predefinito:** `false`.
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `false`, le funzioni `[util.inspect.custom](depth, opts, inspect)` non vengono invocate. **Predefinito:** `true`.
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, l'ispezione di `Proxy` include gli oggetti [`target` e `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology). **Predefinito:** `false`.
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero massimo di elementi `Array`, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) da includere durante la formattazione. Impostare su `null` o `Infinity` per mostrare tutti gli elementi. Impostare su `0` o negativo per non mostrare alcun elemento. **Predefinito:** `100`.
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero massimo di caratteri da includere durante la formattazione. Impostare su `null` o `Infinity` per mostrare tutti gli elementi. Impostare su `0` o negativo per non mostrare alcun carattere. **Predefinito:** `10000`.
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza alla quale i valori di input vengono suddivisi su più righe. Impostare su `Infinity` per formattare l'input come una singola riga (in combinazione con `compact` impostato su `true` o qualsiasi numero \>= `1`). **Predefinito:** `80`.
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'impostazione di questo su `false` fa sì che ogni chiave dell'oggetto venga visualizzata su una nuova riga. Si interromperà su nuove righe nel testo più lungo di `breakLength`. Se impostato su un numero, gli `n` elementi interni più interni vengono uniti su una singola riga purché tutte le proprietà rientrino in `breakLength`. Anche gli elementi di array brevi sono raggruppati insieme. Per maggiori informazioni, vedere l'esempio qui sotto. **Predefinito:** `3`.
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se impostato su `true` o una funzione, tutte le proprietà di un oggetto e le voci `Set` e `Map` vengono ordinate nella stringa risultante. Se impostato su `true` viene utilizzato l'[ordinamento predefinito](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). Se impostato su una funzione, viene utilizzato come [funzione di confronto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se impostato su `true`, i getter vengono ispezionati. Se impostato su `'get'`, vengono ispezionati solo i getter senza un setter corrispondente. Se impostato su `'set'`, vengono ispezionati solo i getter con un setter corrispondente. Questo potrebbe causare effetti collaterali a seconda della funzione getter. **Predefinito:** `false`.
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `true`, un carattere di sottolineatura viene utilizzato per separare ogni tre cifre in tutti i bigint e numeri. **Predefinito:** `false`.
  
 
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La rappresentazione di `object`.

Il metodo `util.inspect()` restituisce una rappresentazione stringa di `object` che è destinata al debug. L'output di `util.inspect` può cambiare in qualsiasi momento e non si dovrebbe fare affidamento su di esso a livello di programmazione. Possono essere passate `options` aggiuntive che alterano il risultato. `util.inspect()` utilizzerà il nome del costruttore e/o `@@toStringTag` per creare un tag identificabile per un valore ispezionato.

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
I riferimenti circolari puntano al loro ancoraggio utilizzando un indice di riferimento:

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
L'esempio seguente ispeziona tutte le proprietà dell'oggetto `util`:

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
L'esempio seguente evidenzia l'effetto dell'opzione `compact`:

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // Una riga lunga
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// L'impostazione di `compact` su false o su un intero crea un output più leggibile.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// L'impostazione di `breakLength` ad es. 150 stamperà il testo "Lorem ipsum" in una
// singola riga.
```
L'opzione `showHidden` consente di ispezionare le voci [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) e [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet). Se ci sono più voci di `maxArrayLength`, non vi è alcuna garanzia di quali voci vengono visualizzate. Ciò significa che il recupero delle stesse voci [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) due volte può comportare un output diverso. Inoltre, le voci senza riferimenti forti rimanenti possono essere sottoposte a garbage collection in qualsiasi momento.

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
L'opzione `sorted` garantisce che l'ordine di inserimento delle proprietà di un oggetto non influisca sul risultato di `util.inspect()`.

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` viene prima di `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` viene prima di `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` viene prima di `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` viene prima di `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
L'opzione `numericSeparator` aggiunge un carattere di sottolineatura ogni tre cifre a tutti i numeri.

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` è un metodo sincrono destinato al debug. La sua lunghezza massima di output è di circa 128 MiB. Gli input che producono un output più lungo verranno troncati.


### Personalizzazione dei colori di `util.inspect` {#customizing-utilinspect-colors}

L'output a colori (se abilitato) di `util.inspect` è personalizzabile globalmente tramite le proprietà `util.inspect.styles` e `util.inspect.colors`.

`util.inspect.styles` è una mappa che associa un nome di stile a un colore da `util.inspect.colors`.

Gli stili predefiniti e i colori associati sono:

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (nessuno stile)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (ad esempio, `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

Lo stile dei colori utilizza i codici di controllo ANSI che potrebbero non essere supportati su tutti i terminali. Per verificare il supporto dei colori, utilizzare [`tty.hasColors()`](/it/nodejs/api/tty#writestreamhascolorscount-env).

I codici di controllo predefiniti sono elencati di seguito (raggruppati come "Modificatori", "Colori di primo piano" e "Colori di sfondo").

#### Modificatori {#modifiers}

Il supporto dei modificatori varia a seconda dei diversi terminali. Verranno per lo più ignorati, se non supportati.

- `reset` - Reimposta tutti i modificatori (di colore) ai loro valori predefiniti
- **bold** - Rende il testo in grassetto
- *italic* - Rende il testo in corsivo
- underline - Rende il testo sottolineato
- ~~strikethrough~~ - Traccia una linea orizzontale attraverso il centro del testo (Alias: `strikeThrough`, `crossedout`, `crossedOut`)
- `hidden` - Stampa il testo, ma lo rende invisibile (Alias: conceal)
- dim - Intensità del colore ridotta (Alias: `faint`)
- overlined - Rende il testo sopralineato
- blink - Nasconde e mostra il testo a intervalli
- inverse - Scambia i colori di primo piano e di sfondo (Alias: `swapcolors`, `swapColors`)
- doubleunderline - Rende il testo con doppia sottolineatura (Alias: `doubleUnderline`)
- framed - Disegna una cornice attorno al testo

#### Colori di primo piano {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (alias: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### Colori di sfondo {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (alias: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### Funzioni di ispezione personalizzate sugli oggetti {#custom-inspection-functions-on-objects}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.3.0, v16.14.0 | L'argomento inspect è stato aggiunto per una maggiore interoperabilità. |
| v0.1.97 | Aggiunto in: v0.1.97 |
:::

Gli oggetti possono anche definire la propria funzione [`[util.inspect.custom](depth, opts, inspect)`](/it/nodejs/api/util#utilinspectcustom), che `util.inspect()` richiamerà e utilizzerà il risultato durante l'ispezione dell'oggetto.

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Cinque spazi di riempimento perché questa è la dimensione di "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// Restituisce: "Box< true >"
```
Le funzioni `[util.inspect.custom](depth, opts, inspect)` personalizzate in genere restituiscono una stringa, ma possono restituire un valore di qualsiasi tipo che verrà formattato di conseguenza da `util.inspect()`.

```js [ESM]
const util = require('node:util');

const obj = { foo: 'questo non verrà visualizzato nell'output di inspect()' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// Restituisce: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.12.0 | Ora questo è definito come un simbolo condiviso. |
| v6.6.0 | Aggiunto in: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) che può essere utilizzato per dichiarare funzioni di ispezione personalizzate.

Oltre ad essere accessibile tramite `util.inspect.custom`, questo simbolo è [registrato globalmente](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) e può essere acceduto in qualsiasi ambiente come `Symbol.for('nodejs.util.inspect.custom')`.

L'utilizzo di questo consente di scrivere codice in modo portatile, in modo che la funzione di ispezione personalizzata venga utilizzata in un ambiente Node.js e ignorata nel browser. La funzione `util.inspect()` stessa viene passata come terzo argomento alla funzione di ispezione personalizzata per consentire un'ulteriore portabilità.

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Stampa Password <xxxxxxxx>
```
Vedi [Funzioni di ispezione personalizzate sugli oggetti](/it/nodejs/api/util#custom-inspection-functions-on-objects) per maggiori dettagli.


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**Aggiunto in: v6.4.0**

Il valore `defaultOptions` consente la personalizzazione delle opzioni predefinite utilizzate da `util.inspect`. Ciò è utile per funzioni come `console.log` o `util.format` che chiamano implicitamente `util.inspect`. Deve essere impostato su un oggetto contenente una o più opzioni valide di [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options). È supportata anche l'impostazione diretta delle proprietà delle opzioni.

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // Registra l'array troncato
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // registra l'array completo
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**Aggiunto in: v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se esiste una profonda uguaglianza stretta tra `val1` e `val2`. Altrimenti, restituisce `false`.

Vedere [`assert.deepStrictEqual()`](/it/nodejs/api/assert#assertdeepstrictequalactual-expected-message) per ulteriori informazioni sull'uguaglianza stretta profonda.

## Classe: `util.MIMEType` {#class-utilmimetype}

**Aggiunto in: v19.1.0, v18.13.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Un'implementazione della [classe MIMEType](https://bmeck.github.io/node-proposal-mime-api/).

In conformità con le convenzioni del browser, tutte le proprietà degli oggetti `MIMEType` sono implementate come getter e setter sul prototipo della classe, anziché come proprietà di dati sull'oggetto stesso.

Una stringa MIME è una stringa strutturata contenente più componenti significativi. Quando viene analizzato, viene restituito un oggetto `MIMEType` contenente proprietà per ciascuno di questi componenti.

### Costruttore: `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il MIME di input da analizzare

Crea un nuovo oggetto `MIMEType` analizzando l'`input`.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

Verrà generato un `TypeError` se l'`input` non è un MIME valido. Si noti che verrà fatto uno sforzo per forzare i valori forniti in stringhe. Per esempio:



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la porzione di tipo del MIME.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la porzione di sottotipo del MIME.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene l'essenza del MIME. Questa proprietà è di sola lettura. Utilizza `mime.type` o `mime.subtype` per modificare il MIME.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/it/nodejs/api/util#class-utilmimeparams)

Ottiene l'oggetto [`MIMEParams`](/it/nodejs/api/util#class-utilmimeparams) che rappresenta i parametri del MIME. Questa proprietà è di sola lettura. Vedi la documentazione di [`MIMEParams`](/it/nodejs/api/util#class-utilmimeparams) per i dettagli.

### `mime.toString()` {#mimetostring}

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `toString()` sull'oggetto `MIMEType` restituisce il MIME serializzato.

A causa della necessità di conformità agli standard, questo metodo non consente agli utenti di personalizzare il processo di serializzazione del MIME.

### `mime.toJSON()` {#mimetojson}

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias per [`mime.toString()`](/it/nodejs/api/util#mimetostring).

Questo metodo viene chiamato automaticamente quando un oggetto `MIMEType` viene serializzato con [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## Classe: `util.MIMEParams` {#class-utilmimeparams}

**Aggiunto in: v19.1.0, v18.13.0**

L'API `MIMEParams` fornisce accesso in lettura e scrittura ai parametri di un `MIMEType`.

### Costruttore: `new MIMEParams()` {#constructor-new-mimeparams}

Crea un nuovo oggetto `MIMEParams` con parametri vuoti

::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Rimuove tutte le coppie nome-valore il cui nome è `name`.


### `mimeParams.entries()` {#mimeparamsentries}

- Returns: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Restituisce un iteratore su ciascuna delle coppie nome-valore nei parametri. Ogni elemento dell'iteratore è un `Array` JavaScript. Il primo elemento dell'array è il `name`, il secondo elemento dell'array è il `value`.

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Una stringa o `null` se non esiste una coppia nome-valore con il `name` specificato.

Restituisce il valore della prima coppia nome-valore il cui nome è `name`. Se non ci sono tali coppie, viene restituito `null`.

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se esiste almeno una coppia nome-valore il cui nome è `name`.

### `mimeParams.keys()` {#mimeparamskeys}

- Returns: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Restituisce un iteratore sui nomi di ciascuna coppia nome-valore.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Imposta il valore nell'oggetto `MIMEParams` associato a `name` a `value`. Se ci sono coppie nome-valore preesistenti i cui nomi sono `name`, imposta il valore della prima coppia su `value`.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- Restituisce: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Restituisce un iteratore sui valori di ogni coppia nome-valore.

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- Restituisce: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Alias per [`mimeParams.entries()`](/it/nodejs/api/util#mimeparamsentries).



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | aggiunta del supporto per consentire opzioni negative in input `config`. |
| v20.0.0 | L'API non è più sperimentale. |
| v18.11.0, v16.19.0 | Aggiunta del supporto per i valori predefiniti in input `config`. |
| v18.7.0, v16.17.0 | aggiunta del supporto per la restituzione di informazioni di analisi dettagliate utilizzando `tokens` in input `config` e proprietà restituite. |
| v18.3.0, v16.17.0 | Aggiunto in: v18.3.0, v16.17.0 |
:::

- `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Utilizzato per fornire argomenti per l'analisi e per configurare il parser. `config` supporta le seguenti proprietà:
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array di stringhe di argomenti. **Predefinito:** `process.argv` con `execPath` e `filename` rimossi.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Utilizzato per descrivere gli argomenti noti al parser. Le chiavi di `options` sono i nomi lunghi delle opzioni e i valori sono un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) che accetta le seguenti proprietà:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo di argomento, che deve essere `boolean` o `string`.
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se questa opzione può essere fornita più volte. Se `true`, tutti i valori verranno raccolti in un array. Se `false`, i valori per l'opzione sono quelli dell'ultima occorrenza. **Predefinito:** `false`.
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un alias di un singolo carattere per l'opzione.
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Il valore predefinito dell'opzione quando non è impostato da args. Deve essere dello stesso tipo della proprietà `type`. Quando `multiple` è `true`, deve essere un array.


    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se si verifica un errore quando vengono rilevati argomenti sconosciuti o quando vengono passati argomenti che non corrispondono al `type` configurato in `options`. **Predefinito:** `true`.
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se questo comando accetta argomenti posizionali. **Predefinito:** `false` se `strict` è `true`, altrimenti `true`.
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, consente di impostare esplicitamente le opzioni booleane su `false` anteponendo al nome dell'opzione `--no-`. **Predefinito:** `false`.
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Restituisce i token analizzati. Questo è utile per estendere il comportamento integrato, dall'aggiunta di controlli aggiuntivi alla rielaborazione dei token in modi diversi. **Predefinito:** `false`.


- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Gli argomenti della riga di comando analizzati:
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Una mappatura dei nomi delle opzioni analizzate con i loro valori [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) o [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Argomenti posizionali.
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vedere la sezione [token parseArgs](/it/nodejs/api/util#parseargs-tokens). Restituito solo se `config` include `tokens: true`.



Fornisce un'API di livello superiore per l'analisi degli argomenti della riga di comando rispetto all'interazione diretta con `process.argv`. Prende una specifica per gli argomenti previsti e restituisce un oggetto strutturato con le opzioni e i posizionali analizzati.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::


### `parseArgs` `tokens` {#parseargs-tokens}

Informazioni dettagliate sull'analisi sono disponibili per l'aggiunta di comportamenti personalizzati specificando `tokens: true` nella configurazione. I token restituiti hanno proprietà che descrivono:

- tutti i token
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uno tra 'option', 'positional' o 'option-terminator'.
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Indice dell'elemento in `args` contenente il token. Quindi l'argomento di origine per un token è `args[token.index]`.
  
 
- token di opzione
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome lungo dell'opzione.
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Come viene utilizzata l'opzione in args, come `-f` di `--foo`.
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Valore dell'opzione specificato in args. Non definito per le opzioni booleane.
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Indica se il valore dell'opzione è specificato in linea, come `--foo=bar`.
  
 
- token posizionali
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il valore dell'argomento posizionale in args (ovvero `args[index]`).
  
 
- token di terminazione delle opzioni

I token restituiti sono nell'ordine in cui vengono incontrati negli args di input. Le opzioni che compaiono più di una volta in args producono un token per ogni utilizzo. I gruppi di opzioni brevi come `-xy` si espandono in un token per ogni opzione. Quindi `-xxx` produce tre token.

Ad esempio, per aggiungere il supporto per un'opzione negata come `--no-color` (che `allowNegative` supporta quando l'opzione è di tipo `boolean`), i token restituiti possono essere rielaborati per modificare il valore memorizzato per l'opzione negata.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

Esempio di utilizzo che mostra le opzioni negate e quando un'opzione viene utilizzata in più modi, l'ultima ha la precedenza.

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

**Aggiunto in: v21.7.0, v20.12.0**

- `content` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il contenuto grezzo di un file `.env`.

- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dato un esempio di file `.env`:

::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Restituisce: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Restituisce: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.8.0 | Chiamare `promisify` su una funzione che restituisce una `Promise` è deprecato. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

- `original` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Prende una funzione che segue il comune stile di callback con errore-first, ovvero prendendo una callback `(err, value) =\> ...` come ultimo argomento, e restituisce una versione che restituisce promises.

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Fai qualcosa con `stats`
}).catch((error) => {
  // Gestisci l'errore.
});
```
Oppure, equivalentemente usando le `async function`:

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`Questa directory è di proprietà di ${stats.uid}`);
}

callStat();
```
Se è presente una proprietà `original[util.promisify.custom]`, `promisify` restituirà il suo valore, vedi [Funzioni promesse personalizzate](/it/nodejs/api/util#custom-promisified-functions).

`promisify()` presuppone che `original` sia una funzione che accetta un callback come suo argomento finale in tutti i casi. Se `original` non è una funzione, `promisify()` lancerà un errore. Se `original` è una funzione ma il suo ultimo argomento non è una callback con errore-first, gli verrà comunque passato un callback con errore-first come suo ultimo argomento.

L'utilizzo di `promisify()` sui metodi di classe o altri metodi che usano `this` potrebbe non funzionare come previsto a meno che non venga gestito in modo speciale:

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: Cannot read property 'a' of undefined
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### Funzioni promissificate personalizzate {#custom-promisified-functions}

Usando il simbolo `util.promisify.custom` è possibile sovrascrivere il valore di ritorno di [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal):

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// prints 'true'
```
Questo può essere utile nei casi in cui la funzione originale non segue il formato standard di prendere un callback error-first come ultimo argomento.

Ad esempio, con una funzione che accetta `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
Se `promisify.custom` è definito ma non è una funzione, `promisify()` genererà un errore.

### `util.promisify.custom` {#utilpromisifycustom}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.16.2 | Questo è ora definito come un simbolo condiviso. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) che può essere utilizzato per dichiarare varianti promissificate personalizzate di funzioni, vedi [Funzioni promissificate personalizzate](/it/nodejs/api/util#custom-promisified-functions).

Oltre ad essere accessibile tramite `util.promisify.custom`, questo simbolo è [registrato globalmente](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) e può essere accessibile in qualsiasi ambiente come `Symbol.for('nodejs.util.promisify.custom')`.

Ad esempio, con una funzione che accetta `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**Aggiunto in: v16.11.0**

- `str` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce `str` con tutti i codici di escape ANSI rimossi.

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// Stampa "value"
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | styleText è ora stabile. |
| v22.8.0, v20.18.0 | Rispetta isTTY e le variabili d'ambiente come NO_COLORS, NODE_DISABLE_COLORS e FORCE_COLOR. |
| v21.7.0, v20.12.0 | Aggiunto in: v21.7.0, v20.12.0 |
:::

- `format` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un formato di testo o un Array di formati di testo definiti in `util.inspect.colors`.
- `text` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il testo da formattare.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `validateStream` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando è true, `stream` viene controllato per vedere se può gestire i colori. **Predefinito:** `true`.
    - `stream` [\<Stream\>](/it/nodejs/api/stream#stream) Uno stream che verrà convalidato per vedere se può essere colorato. **Predefinito:** `process.stdout`.
  
 

Questa funzione restituisce un testo formattato considerando il `format` passato per la stampa in un terminale. È consapevole delle capacità del terminale e agisce in base alla configurazione impostata tramite le variabili d'ambiente `NO_COLORS`, `NODE_DISABLE_COLORS` e `FORCE_COLOR`.



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Convalida se process.stderr ha TTY
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Convalida se process.stderr ha TTY
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors` fornisce anche formati di testo come `italic` e `underline` ed è possibile combinarli entrambi:

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
Quando si passa un array di formati, l'ordine del formato applicato è da sinistra a destra, quindi lo stile successivo potrebbe sovrascrivere quello precedente.

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
L'elenco completo dei formati è disponibile in [modifiers](/it/nodejs/api/util#modifiers).


## Classe: `util.TextDecoder` {#class-utiltextdecoder}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | La classe è ora disponibile sull'oggetto globale. |
| v8.3.0 | Aggiunta in: v8.3.0 |
:::

Un'implementazione dell'API `TextDecoder` dello [Standard di codifica WHATWG](https://encoding.spec.whatwg.org/).

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### Codifiche supportate da WHATWG {#whatwg-supported-encodings}

Secondo lo [Standard di codifica WHATWG](https://encoding.spec.whatwg.org/), le codifiche supportate dall'API `TextDecoder` sono delineate nelle tabelle seguenti. Per ogni codifica, è possibile utilizzare uno o più alias.

Diverse configurazioni di build di Node.js supportano diversi set di codifiche. (vedi [Internazionalizzazione](/it/nodejs/api/intl))

#### Codifiche supportate per impostazione predefinita (con dati ICU completi) {#encodings-supported-by-default-with-full-icu-data}

| Codifica | Alias |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |

#### Codifiche supportate quando Node.js è compilato con l'opzione `small-icu` {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| Codifica | Alias |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### Codifiche supportate quando ICU è disabilitato {#encodings-supported-when-icu-is-disabled}

| Codifica | Alias |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
La codifica `'iso-8859-16'` elencata nel [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) non è supportata.

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifica la `encoding` che questa istanza di `TextDecoder` supporta. **Predefinito:** `'utf-8'`.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se gli errori di decodifica sono fatali. Questa opzione non è supportata quando ICU è disabilitato (vedi [Internazionalizzazione](/it/nodejs/api/intl)). **Predefinito:** `false`.
    - `ignoreBOM` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, il `TextDecoder` includerà il byte order mark nel risultato decodificato. Quando `false`, il byte order mark verrà rimosso dall'output. Questa opzione viene utilizzata solo quando `encoding` è `'utf-8'`, `'utf-16be'` o `'utf-16le'`. **Predefinito:** `false`.
  
 

Crea una nuova istanza di `TextDecoder`. La `encoding` può specificare una delle codifiche supportate o un alias.

La classe `TextDecoder` è disponibile anche sull'oggetto globale.

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Un'istanza di `ArrayBuffer`, `DataView` o `TypedArray` contenente i dati codificati.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `stream` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se sono previsti ulteriori blocchi di dati. **Predefinito:** `false`.
  
 
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Decodifica l'`input` e restituisce una stringa. Se `options.stream` è `true`, qualsiasi sequenza di byte incompleta che si verifica alla fine dell'`input` viene memorizzata internamente nel buffer ed emessa dopo la successiva chiamata a `textDecoder.decode()`.

Se `textDecoder.fatal` è `true`, gli errori di decodifica che si verificano genereranno un `TypeError`.


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La codifica supportata dall'istanza `TextDecoder`.

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il valore sarà `true` se gli errori di decodifica comportano la generazione di un `TypeError`.

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il valore sarà `true` se il risultato della decodifica includerà il byte order mark.

## Classe: `util.TextEncoder` {#class-utiltextencoder}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | La classe è ora disponibile sull'oggetto globale. |
| v8.3.0 | Aggiunto in: v8.3.0 |
:::

Un'implementazione della [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) API `TextEncoder`. Tutte le istanze di `TextEncoder` supportano solo la codifica UTF-8.

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```
La classe `TextEncoder` è disponibile anche sull'oggetto globale.

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il testo da codificare. **Predefinito:** una stringa vuota.
- Restituisce: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Codifica UTF-8 la stringa `input` e restituisce un `Uint8Array` contenente i byte codificati.

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**Aggiunto in: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il testo da codificare.
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) L'array per contenere il risultato della codifica.
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le unità di codice Unicode lette di src.
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) I byte UTF-8 scritti di dest.
  
 

Codifica UTF-8 la stringa `src` in `dest` Uint8Array e restituisce un oggetto contenente le unità di codice Unicode lette e i byte UTF-8 scritti.

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La codifica supportata dall'istanza `TextEncoder`. Impostata sempre su `'utf-8'`.

## `util.toUSVString(string)` {#utiltousvstringstring}

**Aggiunto in: v16.8.0, v14.18.0**

- `string` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la `stringa` dopo aver sostituito qualsiasi punto di codice surrogato (o equivalentemente, qualsiasi unità di codice surrogato spaiata) con il "carattere di sostituzione" Unicode U+FFFD.

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**Aggiunto in: v18.11.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Crea e restituisce un'istanza di [\<AbortController\>](/it/nodejs/api/globals#class-abortcontroller) il cui [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) è contrassegnato come trasferibile e può essere utilizzato con `structuredClone()` o `postMessage()`.

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**Aggiunto in: v18.11.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)
- Restituisce: [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)

Contrassegna il [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) specificato come trasferibile in modo che possa essere utilizzato con `structuredClone()` e `postMessage()`.

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**Aggiunto in: v19.7.0, v18.16.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Qualsiasi oggetto non nullo legato all'operazione annullabile e mantenuto debolmente. Se `resource` viene raccolto dal garbage collector prima che `signal` venga interrotto, la promise rimane in sospeso, consentendo a Node.js di smettere di tenerla traccia. Ciò aiuta a prevenire perdite di memoria in operazioni di lunga durata o non annullabili.
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Ascolta l'evento di interruzione sul `signal` fornito e restituisce una promise che si risolve quando il `signal` viene interrotto. Se viene fornito `resource`, fa riferimento debolmente all'oggetto associato all'operazione, quindi se `resource` viene raccolto dal garbage collector prima che `signal` venga interrotto, la promise restituita rimane in sospeso. Ciò impedisce perdite di memoria in operazioni di lunga durata o non annullabili.



::: code-group
```js [CJS]
const { aborted } = require('node:util');

// Ottieni un oggetto con un segnale annullabile, come una risorsa o un'operazione personalizzata.
const dependent = obtainSomethingAbortable();

// Passa `dependent` come risorsa, indicando che la promise deve risolversi solo
// se `dependent` è ancora in memoria quando il segnale viene interrotto.
aborted(dependent.signal, dependent).then(() => {

  // Questo codice viene eseguito quando `dependent` viene interrotto.
  console.log('La risorsa dipendente è stata interrotta.');
});

// Simula un evento che attiva l'interruzione.
dependent.on('event', () => {
  dependent.abort(); // Ciò farà sì che la promise `aborted` si risolva.
});
```

```js [ESM]
import { aborted } from 'node:util';

// Ottieni un oggetto con un segnale annullabile, come una risorsa o un'operazione personalizzata.
const dependent = obtainSomethingAbortable();

// Passa `dependent` come risorsa, indicando che la promise deve risolversi solo
// se `dependent` è ancora in memoria quando il segnale viene interrotto.
aborted(dependent.signal, dependent).then(() => {

  // Questo codice viene eseguito quando `dependent` viene interrotto.
  console.log('La risorsa dipendente è stata interrotta.');
});

// Simula un evento che attiva l'interruzione.
dependent.on('event', () => {
  dependent.abort(); // Ciò farà sì che la promise `aborted` si risolva.
});
```
:::


## `util.types` {#utiltypes}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.3.0 | Esposta come `require('util/types')`. |
| v10.0.0 | Aggiunta in: v10.0.0 |
:::

`util.types` fornisce controlli di tipo per diversi tipi di oggetti integrati. A differenza di `instanceof` o `Object.prototype.toString.call(value)`, questi controlli non ispezionano le proprietà dell'oggetto accessibili da JavaScript (come il loro prototipo) e di solito hanno il sovraccarico di chiamare in C++.

Il risultato generalmente non fornisce alcuna garanzia sui tipi di proprietà o comportamento che un valore espone in JavaScript. Sono principalmente utili per gli sviluppatori di addon che preferiscono eseguire il controllo del tipo in JavaScript.

L'API è accessibile tramite `require('node:util').types` o `require('node:util/types')`.

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**Aggiunta in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza incorporata di [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).

Vedi anche [`util.types.isArrayBuffer()`](/it/nodejs/api/util#utiltypesisarraybuffervalue) e [`util.types.isSharedArrayBuffer()`](/it/nodejs/api/util#utiltypesissharedarraybuffervalue).

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Restituisce true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // Restituisce true
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**Aggiunta in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza di una delle viste [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), come gli oggetti array tipizzati o [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Equivalente a [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un oggetto `arguments`.

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // Restituisce true
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) incorporata. Ciò *non* include le istanze [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Di solito, è desiderabile testare entrambe; Vedi [`util.types.isAnyArrayBuffer()`](/it/nodejs/api/util#utiltypesisanyarraybuffervalue) per questo.

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // Restituisce true
util.types.isArrayBuffer(new SharedArrayBuffer());  // Restituisce false
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è una [funzione async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). Questo riporta solo ciò che il motore JavaScript sta vedendo; in particolare, il valore restituito potrebbe non corrispondere al codice sorgente originale se è stato utilizzato uno strumento di transpiling.

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // Restituisce false
util.types.isAsyncFunction(async function foo() {});  // Restituisce true
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza di `BigInt64Array`.

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // Restituisce true
util.types.isBigInt64Array(new BigUint64Array());  // Restituisce false
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**Aggiunto in: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un oggetto BigInt, ad esempio creato da `Object(BigInt(123))`.

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // Restituisce true
util.types.isBigIntObject(BigInt(123));   // Restituisce false
util.types.isBigIntObject(123);  // Restituisce false
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza di `BigUint64Array`.

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // Restituisce false
util.types.isBigUint64Array(new BigUint64Array());  // Restituisce true
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un oggetto booleano, ad esempio creato da `new Boolean()`.

```js [ESM]
util.types.isBooleanObject(false);  // Restituisce false
util.types.isBooleanObject(true);   // Restituisce false
util.types.isBooleanObject(new Boolean(false)); // Restituisce true
util.types.isBooleanObject(new Boolean(true));  // Restituisce true
util.types.isBooleanObject(Boolean(false)); // Restituisce false
util.types.isBooleanObject(Boolean(true));  // Restituisce false
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**Aggiunto in: v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un qualsiasi oggetto primitivo boxed, ad esempio creato da `new Boolean()`, `new String()` o `Object(Symbol())`.

Per esempio:

```js [ESM]
util.types.isBoxedPrimitive(false); // Restituisce false
util.types.isBoxedPrimitive(new Boolean(false)); // Restituisce true
util.types.isBoxedPrimitive(Symbol('foo')); // Restituisce false
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // Restituisce true
util.types.isBoxedPrimitive(Object(BigInt(5))); // Restituisce true
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**Aggiunto in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se `value` è una [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey), `false` altrimenti.

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza built-in di [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView).

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // Restituisce true
util.types.isDataView(new Float64Array());  // Restituisce false
```
Vedi anche [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza built-in di [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

```js [ESM]
util.types.isDate(new Date());  // Restituisce true
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un valore `External` nativo.

Un valore `External` nativo è un tipo speciale di oggetto che contiene un puntatore C++ raw (`void*`) per l'accesso dal codice nativo e non ha altre proprietà. Tali oggetti vengono creati internamente da Node.js o da componenti aggiuntivi nativi. In JavaScript, sono oggetti [congelati](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) con un prototipo `null`.

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // restituisce true
util.types.isExternal(0); // restituisce false
util.types.isExternal(new String('foo')); // restituisce false
```
Per ulteriori informazioni su `napi_create_external`, fare riferimento a [`napi_create_external()`](/it/nodejs/api/n-api#napi_create_external).

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza integrata di [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array).

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // Restituisce false
util.types.isFloat32Array(new Float32Array());  // Restituisce true
util.types.isFloat32Array(new Float64Array());  // Restituisce false
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array) incorporata.

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // Restituisce false
util.types.isFloat64Array(new Uint8Array());  // Restituisce false
util.types.isFloat64Array(new Float64Array());  // Restituisce true
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è una funzione generatore. Questo riporta solo ciò che il motore JavaScript sta vedendo; in particolare, il valore di ritorno potrebbe non corrispondere al codice sorgente originale se è stato utilizzato uno strumento di transpiling.

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // Restituisce false
util.types.isGeneratorFunction(function* foo() {});  // Restituisce true
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un oggetto generatore come restituito da una funzione generatore integrata. Questo riporta solo ciò che il motore JavaScript sta vedendo; in particolare, il valore di ritorno potrebbe non corrispondere al codice sorgente originale se è stato utilizzato uno strumento di transpiling.

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // Restituisce true
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array) incorporata.

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // Restituisce false
util.types.isInt8Array(new Int8Array());  // Restituisce true
util.types.isInt8Array(new Float64Array());  // Restituisce false
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array) incorporata.

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // Restituisce false
util.types.isInt16Array(new Int16Array());  // Restituisce true
util.types.isInt16Array(new Float64Array());  // Restituisce false
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array) incorporata.

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // Restituisce false
util.types.isInt32Array(new Int32Array());  // Restituisce true
util.types.isInt32Array(new Float64Array());  // Restituisce false
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**Aggiunto in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se `value` è un [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject), `false` altrimenti.

### `util.types.isMap(value)` {#utiltypesismapvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) incorporata.

```js [ESM]
util.types.isMap(new Map());  // Restituisce true
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un iteratore restituito per un'istanza [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) integrata.

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // Restituisce true
util.types.isMapIterator(map.values());  // Restituisce true
util.types.isMapIterator(map.entries());  // Restituisce true
util.types.isMapIterator(map[Symbol.iterator]());  // Restituisce true
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza di un [Oggetto Spazio dei Nomi del Modulo](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects).

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Restituisce true
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è stato restituito dal costruttore di un [tipo `Error` integrato](https://tc39.es/ecma262/#sec-error-objects).

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
Anche le sottoclassi dei tipi di errore nativi sono errori nativi:

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
Un valore che è `instanceof` di una classe di errore nativa non è equivalente a `isNativeError()` che restituisce `true` per quel valore. `isNativeError()` restituisce `true` per gli errori che provengono da un [realm](https://tc39.es/ecma262/#realm) diverso mentre `instanceof Error` restituisce `false` per questi errori:

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
Viceversa, `isNativeError()` restituisce `false` per tutti gli oggetti che non sono stati restituiti dal costruttore di un errore nativo. Ciò include i valori che sono `instanceof` di errori nativi:

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un oggetto numero, ad esempio creato da `new Number()`.

```js [ESM]
util.types.isNumberObject(0);  // Restituisce false
util.types.isNumberObject(new Number(0));   // Restituisce true
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) integrato.

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // Restituisce true
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza di [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Restituisce false
util.types.isProxy(proxy);  // Restituisce true
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un oggetto espressione regolare.

```js [ESM]
util.types.isRegExp(/abc/);  // Restituisce true
util.types.isRegExp(new RegExp('abc'));  // Restituisce true
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) integrata.

```js [ESM]
util.types.isSet(new Set());  // Restituisce true
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un iteratore restituito per un'istanza [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) integrata.

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // Restituisce true
util.types.isSetIterator(set.values());  // Restituisce true
util.types.isSetIterator(set.entries());  // Restituisce true
util.types.isSetIterator(set[Symbol.iterator]());  // Restituisce true
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) integrata. Questo *non* include le istanze [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Di solito, è desiderabile testare entrambi; Vedi [`util.types.isAnyArrayBuffer()`](/it/nodejs/api/util#utiltypesisanyarraybuffervalue) per quello.

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Restituisce false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Restituisce true
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un oggetto stringa, ad esempio creato da `new String()`.

```js [ESM]
util.types.isStringObject('foo');  // Restituisce false
util.types.isStringObject(new String('foo'));   // Restituisce true
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un oggetto simbolo, creato chiamando `Object()` su una primitiva `Symbol`.

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // Restituisce false
util.types.isSymbolObject(Object(symbol));   // Restituisce true
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) incorporata.

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // Restituisce false
util.types.isTypedArray(new Uint8Array());  // Restituisce true
util.types.isTypedArray(new Float64Array());  // Restituisce true
```
Vedi anche [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) incorporata.

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // Restituisce false
util.types.isUint8Array(new Uint8Array());  // Restituisce true
util.types.isUint8Array(new Float64Array());  // Restituisce false
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray) integrata.

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // Restituisce false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Restituisce true
util.types.isUint8ClampedArray(new Float64Array());  // Restituisce false
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array) integrata.

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // Restituisce false
util.types.isUint16Array(new Uint16Array());  // Restituisce true
util.types.isUint16Array(new Float64Array());  // Restituisce false
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array) integrata.

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // Restituisce false
util.types.isUint32Array(new Uint32Array());  // Restituisce true
util.types.isUint32Array(new Float64Array());  // Restituisce false
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) integrata.

```js [ESM]
util.types.isWeakMap(new WeakMap());  // Restituisce true
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**Aggiunto in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se il valore è un'istanza [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) incorporata.

```js [ESM]
util.types.isWeakSet(new WeakSet());  // Restituisce true
```
## API Deprecate {#deprecated-apis}

Le seguenti API sono deprecate e non devono più essere utilizzate. Le applicazioni e i moduli esistenti devono essere aggiornati per trovare approcci alternativi.

### `util._extend(target, source)` {#util_extendtarget-source}

**Aggiunto in: v0.7.5**

**Deprecato a partire da: v6.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Il metodo `util._extend()` non è mai stato concepito per essere utilizzato al di fuori dei moduli Node.js interni. La community lo ha trovato e utilizzato comunque.

È deprecato e non deve essere utilizzato nel nuovo codice. JavaScript offre funzionalità integrate molto simili tramite [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### `util.isArray(object)` {#utilisarrayobject}

**Aggiunto in: v0.6.0**

**Deprecato a partire da: v4.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias per [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

Restituisce `true` se l'`object` fornito è un `Array`. Altrimenti, restituisce `false`.

```js [ESM]
const util = require('node:util');

util.isArray([]);
// Restituisce: true
util.isArray(new Array());
// Restituisce: true
util.isArray({});
// Restituisce: false
```

