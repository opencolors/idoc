---
title: Documentazione del modulo VM di Node.js
description: Il modulo VM (Macchina Virtuale) di Node.js fornisce API per compilare ed eseguire codice all'interno dei contesti del motore JavaScript V8. Permette la creazione di ambienti JavaScript isolati, l'esecuzione di codice in sandbox e la gestione dei contesti di script.
head:
  - - meta
    - name: og:title
      content: Documentazione del modulo VM di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo VM (Macchina Virtuale) di Node.js fornisce API per compilare ed eseguire codice all'interno dei contesti del motore JavaScript V8. Permette la creazione di ambienti JavaScript isolati, l'esecuzione di codice in sandbox e la gestione dei contesti di script.
  - - meta
    - name: twitter:title
      content: Documentazione del modulo VM di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo VM (Macchina Virtuale) di Node.js fornisce API per compilare ed eseguire codice all'interno dei contesti del motore JavaScript V8. Permette la creazione di ambienti JavaScript isolati, l'esecuzione di codice in sandbox e la gestione dei contesti di script.
---


# VM (esecuzione di JavaScript) {#vm-executing-javascript}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

Il modulo `node:vm` consente di compilare ed eseguire codice all'interno di contesti della Virtual Machine V8.

**Il modulo <code>node:vm</code> non è un meccanismo di sicurezza. Non utilizzarlo per eseguire codice non attendibile.**

Il codice JavaScript può essere compilato ed eseguito immediatamente, oppure compilato, salvato ed eseguito in seguito.

Un caso d'uso comune è eseguire il codice in un contesto V8 diverso. Ciò significa che il codice invocato ha un oggetto globale diverso dal codice chiamante.

Si può fornire il contesto [*contestualizzando*](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) un oggetto. Il codice invocato tratta qualsiasi proprietà nel contesto come una variabile globale. Qualsiasi modifica alle variabili globali causata dal codice invocato si riflette nell'oggetto contesto.

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // Contestualizza l'oggetto.

const code = 'x += 40; var y = 17;';
// `x` e `y` sono variabili globali nel contesto.
// Inizialmente, x ha il valore 2 perché quello è il valore di context.x.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y non è definito.
```
## Classe: `vm.Script` {#class-vmscript}

**Aggiunto in: v0.3.1**

Le istanze della classe `vm.Script` contengono script precompilati che possono essere eseguiti in contesti specifici.

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.7.0, v20.12.0 | Aggiunto il supporto per `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Aggiunto il supporto per gli attributi di importazione al parametro `importModuleDynamically`. |
| v10.6.0 | `produceCachedData` è deprecato a favore di `script.createCachedData()`. |
| v5.7.0 | Le opzioni `cachedData` e `produceCachedData` sono ora supportate. |
| v0.3.1 | Aggiunto in: v0.3.1 |
:::

- `code` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il codice JavaScript da compilare.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica il nome del file utilizzato nelle stack trace prodotte da questo script. **Predefinito:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di riga visualizzato nelle stack trace prodotte da questo script. **Predefinito:** `0`.
    - `columnOffset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di colonna della prima riga visualizzato nelle stack trace prodotte da questo script. **Predefinito:** `0`.
    - `cachedData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornisce un `Buffer` o `TypedArray`, o `DataView` opzionale con i dati della cache del codice di V8 per l'origine fornita. Quando fornito, il valore `cachedDataRejected` sarà impostato su `true` o `false` a seconda dell'accettazione dei dati da parte di V8.
    - `produceCachedData` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true` e nessun `cachedData` è presente, V8 tenterà di produrre dati della cache del codice per `code`. In caso di successo, verrà prodotto un `Buffer` con i dati della cache del codice di V8 e memorizzato nella proprietà `cachedData` dell'istanza `vm.Script` restituita. Il valore `cachedDataProduced` verrà impostato su `true` o `false` a seconda che i dati della cache del codice vengano prodotti con successo. Questa opzione è **deprecata** a favore di `script.createCachedData()`. **Predefinito:** `false`.
    - `importModuleDynamically` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/it/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilizzato per specificare come i moduli devono essere caricati durante la valutazione di questo script quando viene chiamato `import()`. Questa opzione fa parte dell'API dei moduli sperimentali. Si sconsiglia di utilizzarla in un ambiente di produzione. Per informazioni dettagliate, vedere [Supporto dell'importazione dinamica `import()` nelle API di compilazione](/it/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).



Se `options` è una stringa, allora specifica il nome del file.

La creazione di un nuovo oggetto `vm.Script` compila `code` ma non lo esegue. Il `vm.Script` compilato può essere eseguito successivamente più volte. Il `code` non è vincolato a nessun oggetto globale; piuttosto, è vincolato prima di ogni esecuzione, solo per quella esecuzione.


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**Aggiunto in: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Quando `cachedData` viene fornito per creare `vm.Script`, questo valore verrà impostato su `true` o `false` a seconda dell'accettazione dei dati da parte di V8. Altrimenti il valore è `undefined`.

### `script.createCachedData()` {#scriptcreatecacheddata}

**Aggiunto in: v10.6.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Crea una cache di codice che può essere utilizzata con l'opzione `cachedData` del costruttore `Script`. Restituisce un `Buffer`. Questo metodo può essere chiamato in qualsiasi momento e un numero qualsiasi di volte.

La cache di codice di `Script` non contiene alcuno stato osservabile di JavaScript. La cache di codice è sicura da salvare insieme al codice sorgente dello script e utilizzata per costruire più istanze `Script`.

Le funzioni nel sorgente `Script` possono essere contrassegnate come compilate pigramente e non vengono compilate durante la costruzione di `Script`. Queste funzioni verranno compilate quando vengono invocate per la prima volta. La cache di codice serializza i metadati che V8 conosce attualmente sullo `Script` che può utilizzare per accelerare le compilazioni future.

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// In `cacheWithoutAdd` la funzione `add()` è contrassegnata per la compilazione completa
// al momento dell'invocazione.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` contiene la funzione `add()` completamente compilata.
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.3.0 | L'opzione `breakOnSigint` è ora supportata. |
| v0.3.1 | Aggiunto in: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) come restituito dal metodo `vm.createContext()`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se si verifica un [`Error`](/it/nodejs/api/errors#class-error) durante la compilazione del `code`, la riga di codice che causa l'errore viene allegata alla traccia dello stack. **Predefinito:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di millisecondi per eseguire il `code` prima di terminare l'esecuzione. Se l'esecuzione viene terminata, verrà lanciato un [`Error`](/it/nodejs/api/errors#class-error). Questo valore deve essere un numero intero strettamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la ricezione di `SIGINT` (+) terminerà l'esecuzione e lancerà un [`Error`](/it/nodejs/api/errors#class-error). I gestori esistenti per l'evento che sono stati collegati tramite `process.on('SIGINT')` sono disabilitati durante l'esecuzione dello script, ma continuano a funzionare dopo. **Predefinito:** `false`.
  
 
- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) il risultato dell'ultima istruzione eseguita nello script.

Esegue il codice compilato contenuto dall'oggetto `vm.Script` all'interno del `contextifiedObject` specificato e restituisce il risultato. L'esecuzione del codice non ha accesso allo scope locale.

L'esempio seguente compila il codice che incrementa una variabile globale, imposta il valore di un'altra variabile globale, quindi esegue il codice più volte. Le variabili globali sono contenute nell'oggetto `context`.

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Prints: { animal: 'cat', count: 12, name: 'kitty' }
```
L'utilizzo delle opzioni `timeout` o `breakOnSigint` comporterà l'avvio di nuovi cicli di eventi e thread corrispondenti, che hanno un overhead di prestazioni diverso da zero.


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.8.0, v20.18.0 | L'argomento `contextObject` ora accetta `vm.constants.DONT_CONTEXTIFY`. |
| v14.6.0 | L'opzione `microtaskMode` è ora supportata. |
| v10.0.0 | L'opzione `contextCodeGeneration` è ora supportata. |
| v6.3.0 | L'opzione `breakOnSigint` è ora supportata. |
| v0.3.1 | Aggiunto in: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/it/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O [`vm.constants.DONT_CONTEXTIFY`](/it/nodejs/api/vm#vmconstantsdont_contextify) o un oggetto che verrà [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Se `undefined`, verrà creato un oggetto contestualizzato vuoto per compatibilità con le versioni precedenti.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se si verifica un [`Error`](/it/nodejs/api/errors#class-error) durante la compilazione del `code`, la riga di codice che causa l'errore viene allegata alla traccia dello stack. **Predefinito:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di millisecondi per eseguire `code` prima di terminare l'esecuzione. Se l'esecuzione viene terminata, verrà generato un [`Error`](/it/nodejs/api/errors#class-error). Questo valore deve essere un numero intero strettamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la ricezione di `SIGINT` (+) terminerà l'esecuzione e genererà un [`Error`](/it/nodejs/api/errors#class-error). I gestori esistenti per l'evento che sono stati allegati tramite `process.on('SIGINT')` sono disabilitati durante l'esecuzione dello script, ma continuano a funzionare dopo. **Predefinito:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome leggibile dal umano del contesto appena creato. **Predefinito:** `'VM Context i'`, dove `i` è un indice numerico crescente del contesto creato.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origine](https://developer.mozilla.org/en-US/docs/Glossary/Origin) corrispondente al contesto appena creato a scopo di visualizzazione. L'origine deve essere formattata come un URL, ma solo con lo schema, l'host e la porta (se necessario), come il valore della proprietà [`url.origin`](/it/nodejs/api/url#urlorigin) di un oggetto [`URL`](/it/nodejs/api/url#class-url). In particolare, questa stringa dovrebbe omettere la barra finale, poiché denota un percorso. **Predefinito:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su false, qualsiasi chiamata a `eval` o costruttori di funzioni (`Function`, `GeneratorFunction`, ecc.) genererà un `EvalError`. **Predefinito:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su false, qualsiasi tentativo di compilare un modulo WebAssembly genererà un `WebAssembly.CompileError`. **Predefinito:** `true`.


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se impostato su `afterEvaluate`, i microtask (task pianificati tramite `Promise` e `async function`) verranno eseguiti immediatamente dopo l'esecuzione dello script. In questo caso, sono inclusi negli ambiti `timeout` e `breakOnSigint`.


- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) il risultato dell'ultima istruzione eseguita nello script.

Questo metodo è una scorciatoia per `script.runInContext(vm.createContext(options), options)`. Esegue diverse operazioni contemporaneamente:

L'esempio seguente compila il codice che imposta una variabile globale, quindi esegue il codice più volte in contesti diversi. Le variabili globali sono impostate e contenute all'interno di ogni singolo `context`.

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// Questo genererebbe un errore se il contesto viene creato da un oggetto contestualizzato.
// vm.constants.DONT_CONTEXTIFY consente la creazione di contesti con oggetti globali ordinari
// che possono essere congelati.
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.3.0 | L'opzione `breakOnSigint` è ora supportata. |
| v0.3.1 | Aggiunto in: v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se si verifica un [`Error`](/it/nodejs/api/errors#class-error) durante la compilazione del `code`, la riga di codice che causa l'errore viene allegata alla traccia dello stack. **Predefinito:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di millisecondi per eseguire `code` prima di terminare l'esecuzione. Se l'esecuzione viene terminata, verrà generato un [`Error`](/it/nodejs/api/errors#class-error). Questo valore deve essere un numero intero strettamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la ricezione di `SIGINT` (+) terminerà l'esecuzione e genererà un [`Error`](/it/nodejs/api/errors#class-error). I gestori esistenti per l'evento che sono stati allegati tramite `process.on('SIGINT')` vengono disabilitati durante l'esecuzione dello script, ma continuano a funzionare dopo. **Predefinito:** `false`.

- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) il risultato dell'ultima istruzione eseguita nello script.

Esegue il codice compilato contenuto da `vm.Script` nel contesto dell'oggetto `global` corrente. L'esecuzione del codice non ha accesso all'ambito locale, ma *ha* accesso all'oggetto `global` corrente.

L'esempio seguente compila il codice che incrementa una variabile `global` quindi esegue quel codice più volte:

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**Aggiunto in: v19.1.0, v18.13.0**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Quando lo script viene compilato da una sorgente che contiene un commento magico di source map, questa proprietà verrà impostata sull'URL della source map.

::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## Classe: `vm.Module` {#class-vmmodule}

**Aggiunto in: v13.0.0, v12.16.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Questa funzionalità è disponibile solo con il flag di comando `--experimental-vm-modules` abilitato.

La classe `vm.Module` fornisce un'interfaccia di basso livello per l'utilizzo dei moduli ECMAScript nei contesti VM. È la controparte della classe `vm.Script` che rispecchia da vicino i [Module Record](https://262.ecma-international.org/14.0/#sec-abstract-module-records) come definiti nella specifica ECMAScript.

A differenza di `vm.Script` tuttavia, ogni oggetto `vm.Module` è vincolato a un contesto dalla sua creazione. Le operazioni sugli oggetti `vm.Module` sono intrinsecamente asincrone, in contrasto con la natura sincrona degli oggetti `vm.Script`. L'uso di funzioni 'async' può aiutare a manipolare gli oggetti `vm.Module`.

L'utilizzo di un oggetto `vm.Module` richiede tre passaggi distinti: creazione/analisi, collegamento e valutazione. Questi tre passaggi sono illustrati nel seguente esempio.

Questa implementazione si trova a un livello inferiore rispetto al [caricatore di moduli ECMAScript](/it/nodejs/api/esm#modules-ecmascript-modules). Inoltre, non c'è ancora modo di interagire con il Loader, anche se il supporto è pianificato.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Passaggio 1
//
// Crea un modulo costruendo un nuovo oggetto `vm.SourceTextModule`. Questo
// analizza il testo sorgente fornito, generando un `SyntaxError` se qualcosa va
// storto. Per impostazione predefinita, un modulo viene creato nel contesto principale. Ma qui, noi
// specifichiamo `contextifiedObject` come il contesto a cui appartiene questo modulo.
//
// Qui, tentiamo di ottenere l'esportazione predefinita dal modulo "foo" e
// metterla nel binding locale "secret".

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Passaggio 2
//
// "Collega" le dipendenze importate di questo modulo ad esso.
//
// Il callback di collegamento fornito (il "linker") accetta due argomenti: il
// modulo padre (`bar` in questo caso) e la stringa che è lo specificatore di
// del modulo importato. Il callback dovrebbe restituire un modulo che
// corrisponde allo specificatore fornito, con determinati requisiti documentati
// in `module.link()`.
//
// Se il collegamento non è iniziato per il modulo restituito, lo stesso linker
// il callback verrà chiamato sul modulo restituito.
//
// Anche i moduli di livello superiore senza dipendenze devono essere collegati esplicitamente. Il
// il callback fornito non verrebbe mai chiamato, tuttavia.
//
// Il metodo link() restituisce una Promise che verrà risolta quando tutte le
// Promises restituite dal linker si risolvono.
//
// Nota: questo è un esempio artificioso in quanto la funzione linker crea un nuovo
// modulo "foo" ogni volta che viene chiamato. In un sistema di moduli completo, a
// la cache verrebbe probabilmente utilizzata per evitare moduli duplicati.

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // La variabile "secret" si riferisce alla variabile globale che abbiamo aggiunto a
      // "contextifiedObject" quando si crea il contesto.
      export default secret;
    `, { context: referencingModule.context });

    // Anche l'utilizzo di `contextifiedObject` invece di `referencingModule.context`
    // qui funzionerebbe bene.
  }
  throw new Error(`Impossibile risolvere la dipendenza: ${specifier}`);
}
await bar.link(linker);

// Passaggio 3
//
// Valuta il modulo. Il metodo evaluate() restituisce una promise che
// si risolverà dopo che il modulo ha terminato la valutazione.

// Stampa 42.
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Passaggio 1
  //
  // Crea un modulo costruendo un nuovo oggetto `vm.SourceTextModule`. Questo
  // analizza il testo sorgente fornito, generando un `SyntaxError` se qualcosa va
  // storto. Per impostazione predefinita, un modulo viene creato nel contesto principale. Ma qui, noi
  // specifichiamo `contextifiedObject` come il contesto a cui appartiene questo modulo.
  //
  // Qui, tentiamo di ottenere l'esportazione predefinita dal modulo "foo" e
  // metterla nel binding locale "secret".

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Passaggio 2
  //
  // "Collega" le dipendenze importate di questo modulo ad esso.
  //
  // Il callback di collegamento fornito (il "linker") accetta due argomenti: il
  // modulo padre (`bar` in questo caso) e la stringa che è lo specificatore di
  // del modulo importato. Il callback dovrebbe restituire un modulo che
  // corrisponde allo specificatore fornito, con determinati requisiti documentati
  // in `module.link()`.
  //
  // Se il collegamento non è iniziato per il modulo restituito, lo stesso linker
  // il callback verrà chiamato sul modulo restituito.
  //
  // Anche i moduli di livello superiore senza dipendenze devono essere collegati esplicitamente. Il
  // il callback fornito non verrebbe mai chiamato, tuttavia.
  //
  // Il metodo link() restituisce una Promise che verrà risolta quando tutte le
  // Promises restituite dal linker si risolvono.
  //
  // Nota: questo è un esempio artificioso in quanto la funzione linker crea un nuovo
  // modulo "foo" ogni volta che viene chiamato. In un sistema di moduli completo, a
  // la cache verrebbe probabilmente utilizzata per evitare moduli duplicati.

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // La variabile "secret" si riferisce alla variabile globale che abbiamo aggiunto a
        // "contextifiedObject" quando si crea il contesto.
        export default secret;
      `, { context: referencingModule.context });

      // Anche l'utilizzo di `contextifiedObject` invece di `referencingModule.context`
      // qui funzionerebbe bene.
    }
    throw new Error(`Impossibile risolvere la dipendenza: ${specifier}`);
  }
  await bar.link(linker);

  // Passaggio 3
  //
  // Valuta il modulo. Il metodo evaluate() restituisce una promise che
  // si risolverà dopo che il modulo ha terminato la valutazione.

  // Stampa 42.
  await bar.evaluate();
})();
```
:::


### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gli specificatori di tutte le dipendenze di questo modulo. L'array restituito è bloccato per impedire qualsiasi modifica.

Corrisponde al campo `[[RequestedModules]]` di [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) nella specifica ECMAScript.

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Se `module.status` è `'errored'`, questa proprietà contiene l'eccezione lanciata dal modulo durante la valutazione. Se lo stato è diverso, l'accesso a questa proprietà comporterà il lancio di un'eccezione.

Il valore `undefined` non può essere utilizzato per i casi in cui non vi è un'eccezione lanciata a causa di una possibile ambiguità con `throw undefined;`.

Corrisponde al campo `[[EvaluationError]]` di [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) nella specifica ECMAScript.

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di millisecondi da valutare prima di terminare l'esecuzione. Se l'esecuzione viene interrotta, verrà lanciato un [`Error`](/it/nodejs/api/errors#class-error). Questo valore deve essere un intero strettamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la ricezione di `SIGINT` (+) terminerà l'esecuzione e lancerà un [`Error`](/it/nodejs/api/errors#class-error). I gestori esistenti per l'evento che sono stati collegati tramite `process.on('SIGINT')` vengono disabilitati durante l'esecuzione dello script, ma continuano a funzionare successivamente. **Predefinito:** `false`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si completa con `undefined` in caso di successo.

Valuta il modulo.

Questo deve essere chiamato dopo che il modulo è stato collegato; altrimenti verrà rifiutato. Potrebbe essere chiamato anche quando il modulo è già stato valutato, nel qual caso non farà nulla se la valutazione iniziale si è conclusa con successo (`module.status` è `'evaluated'`) oppure rilancerà l'eccezione che la valutazione iniziale ha comportato (`module.status` è `'errored'`).

Questo metodo non può essere chiamato mentre il modulo è in fase di valutazione (`module.status` è `'evaluating'`).

Corrisponde al campo [Evaluate() concrete method](https://tc39.es/ecma262/#sec-moduleevaluation) di [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) nella specifica ECMAScript.


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'identificatore del modulo corrente, come impostato nel costruttore.

### `module.link(linker)` {#modulelinklinker}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | L'opzione `extra.assert` è rinominata in `extra.attributes`. Il nome precedente è ancora fornito per compatibilità con le versioni precedenti. |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lo specificatore del modulo richiesto:
    - `referencingModule` [\<vm.Module\>](/it/nodejs/api/vm#class-vmmodule) L'oggetto `Module` su cui viene chiamato `link()`.
    - `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) I dati dell'attributo: Secondo ECMA-262, ci si aspetta che gli host attivino un errore se è presente un attributo non supportato.
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Alias per `extra.attributes`.


    - Restituisce: [\<vm.Module\>](/it/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Collega le dipendenze del modulo. Questo metodo deve essere chiamato prima della valutazione e può essere chiamato una sola volta per modulo.

Si prevede che la funzione restituisca un oggetto `Module` o una `Promise` che alla fine si risolva in un oggetto `Module`. Il `Module` restituito deve soddisfare i seguenti due invarianti:

- Deve appartenere allo stesso contesto del `Module` padre.
- Il suo `status` non deve essere `'errored'`.

Se lo `status` del `Module` restituito è `'unlinked'`, questo metodo verrà chiamato ricorsivamente sul `Module` restituito con la stessa funzione `linker` fornita.

`link()` restituisce una `Promise` che verrà risolta quando tutte le istanze di collegamento si risolvono in un `Module` valido, oppure rifiutata se la funzione linker genera un'eccezione o restituisce un `Module` non valido.

La funzione linker corrisponde approssimativamente all'operazione astratta [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) definita dall'implementazione nella specifica ECMAScript, con alcune differenze fondamentali:

- La funzione linker può essere asincrona mentre [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) è sincrona.

L'implementazione effettiva di [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) utilizzata durante il collegamento del modulo è quella che restituisce i moduli collegati durante il collegamento. Poiché a quel punto tutti i moduli sarebbero già stati completamente collegati, l'implementazione di [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) è completamente sincrona per specifica.

Corrisponde al campo [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) di [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) nella specifica ECMAScript.


### `module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'oggetto namespace del modulo. Questo è disponibile solo dopo che il collegamento (`module.link()`) è stato completato.

Corrisponde all'operazione astratta [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) nella specifica ECMAScript.

### `module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Lo stato attuale del modulo. Sarà uno tra:

-  `'unlinked'`: `module.link()` non è ancora stato chiamato.
-  `'linking'`: `module.link()` è stato chiamato, ma non tutte le Promise restituite dalla funzione di collegamento sono state ancora risolte.
-  `'linked'`: Il modulo è stato collegato con successo e tutte le sue dipendenze sono collegate, ma `module.evaluate()` non è ancora stato chiamato.
-  `'evaluating'`: Il modulo è in fase di valutazione tramite un `module.evaluate()` su se stesso o su un modulo padre.
-  `'evaluated'`: Il modulo è stato valutato con successo.
-  `'errored'`: Il modulo è stato valutato, ma è stata generata un'eccezione.

Oltre a `'errored'`, questa stringa di stato corrisponde al campo `[[Status]]` del [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) della specifica. `'errored'` corrisponde a `'evaluated'` nella specifica, ma con `[[EvaluationError]]` impostato su un valore che non è `undefined`.

## Classe: `vm.SourceTextModule` {#class-vmsourcetextmodule}

**Aggiunto in: v9.6.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Questa funzionalità è disponibile solo con il flag di comando `--experimental-vm-modules` abilitato.

- Estende: [\<vm.Module\>](/it/nodejs/api/vm#class-vmmodule)

La classe `vm.SourceTextModule` fornisce il [Source Text Module Record](https://tc39.es/ecma262/#sec-source-text-module-records) come definito nella specifica ECMAScript.

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.0.0, v16.12.0 | Aggiunto il supporto per gli attributi di importazione al parametro `importModuleDynamically`. |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codice del modulo JavaScript da analizzare
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Stringa utilizzata nelle stack trace. **Predefinito:** `'vm:module(i)'` dove `i` è un indice crescente specifico del contesto.
    - `cachedData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornisce un `Buffer` o `TypedArray`, o `DataView` opzionale con i dati della cache del codice V8 per la sorgente fornita. Il `code` deve essere lo stesso del modulo da cui è stato creato questo `cachedData`.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) come restituito dal metodo `vm.createContext()`, per compilare e valutare questo `Module` in. Se non viene specificato alcun contesto, il modulo viene valutato nel contesto di esecuzione corrente.
    - `lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di riga visualizzato nelle stack trace prodotte da questo `Module`. **Predefinito:** `0`.
    - `columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di colonna della prima riga visualizzato nelle stack trace prodotte da questo `Module`. **Predefinito:** `0`.
    - `initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamato durante la valutazione di questo `Module` per inizializzare `import.meta`.
    - `meta` [\<import.meta\>](/it/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/it/nodejs/api/vm#class-vmsourcetextmodule)

    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Utilizzato per specificare come i moduli devono essere caricati durante la valutazione di questo modulo quando viene chiamato `import()`. Questa opzione fa parte dell'API dei moduli sperimentali. Si sconsiglia di utilizzarla in un ambiente di produzione. Per informazioni dettagliate, vedere [Supporto di `import()` dinamico nelle API di compilazione](/it/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

Crea una nuova istanza di `SourceTextModule`.

Le proprietà assegnate all'oggetto `import.meta` che sono oggetti possono consentire al modulo di accedere a informazioni al di fuori del `context` specificato. Utilizzare `vm.runInContext()` per creare oggetti in un contesto specifico.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// Since module has no dependencies, the linker function will never be called.
await module.link(() => {});
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // Since module has no dependencies, the linker function will never be called.
  await module.link(() => {});
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**Aggiunto in: v13.7.0, v12.17.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Crea una cache di codice che può essere utilizzata con l'opzione `cachedData` del costruttore `SourceTextModule`. Restituisce un `Buffer`. Questo metodo può essere chiamato un numero qualsiasi di volte prima che il modulo sia stato valutato.

La cache di codice di `SourceTextModule` non contiene alcuno stato osservabile di JavaScript. La cache di codice è sicura per essere salvata insieme al codice sorgente e utilizzata per costruire nuove istanze di `SourceTextModule` più volte.

Le funzioni nel sorgente `SourceTextModule` possono essere contrassegnate come compilate in modo pigro e non vengono compilate alla costruzione di `SourceTextModule`. Queste funzioni verranno compilate quando vengono invocate per la prima volta. La cache di codice serializza i metadati che V8 attualmente conosce su `SourceTextModule` che può utilizzare per velocizzare le compilazioni future.

```js [ESM]
// Crea un modulo iniziale
const module = new vm.SourceTextModule('const a = 1;');

// Crea dati memorizzati nella cache da questo modulo
const cachedData = module.createCachedData();

// Crea un nuovo modulo utilizzando i dati memorizzati nella cache. Il codice deve essere lo stesso.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## Classe: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**Aggiunto in: v13.0.0, v12.16.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Questa funzionalità è disponibile solo con il flag di comando `--experimental-vm-modules` abilitato.

- Estende: [\<vm.Module\>](/it/nodejs/api/vm#class-vmmodule)

La classe `vm.SyntheticModule` fornisce il [Record del modulo sintetico](https://heycam.github.io/webidl/#synthetic-module-records) come definito nella specifica WebIDL. Lo scopo dei moduli sintetici è fornire un'interfaccia generica per esporre sorgenti non JavaScript ai grafi dei moduli ECMAScript.

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// Utilizza `module` nel collegamento...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**Aggiunto in: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Array di nomi che verranno esportati dal modulo.
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamata quando il modulo viene valutato.
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Stringa utilizzata nelle stack trace. **Predefinito:** `'vm:module(i)'` dove `i` è un indice crescente specifico del contesto.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) come restituito dal metodo `vm.createContext()`, per compilare e valutare questo `Module` in.

Crea una nuova istanza `SyntheticModule`.

Gli oggetti assegnati alle esportazioni di questa istanza possono consentire agli importatori del modulo di accedere a informazioni al di fuori del `context` specificato. Utilizzare `vm.runInContext()` per creare oggetti in un contesto specifico.

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**Aggiunto in: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome dell'esportazione da impostare.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore a cui impostare l'esportazione.

Questo metodo viene utilizzato dopo che il modulo è collegato per impostare i valori delle esportazioni. Se viene chiamato prima che il modulo sia collegato, verrà generato un errore [`ERR_VM_MODULE_STATUS`](/it/nodejs/api/errors#err_vm_module_status).

::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.7.0, v20.12.0 | Aggiunto il supporto per `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v19.6.0, v18.15.0 | Il valore restituito ora include `cachedDataRejected` con la stessa semantica della versione `vm.Script` se è stata passata l'opzione `cachedData`. |
| v17.0.0, v16.12.0 | Aggiunto il supporto per gli attributi di importazione al parametro `importModuleDynamically`. |
| v15.9.0 | Aggiunta nuovamente l'opzione `importModuleDynamically`. |
| v14.3.0 | Rimozione di `importModuleDynamically` a causa di problemi di compatibilità. |
| v14.1.0, v13.14.0 | L'opzione `importModuleDynamically` è ora supportata. |
| v10.10.0 | Aggiunto in: v10.10.0 |
:::

- `code` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il corpo della funzione da compilare.
- `params` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array di stringhe contenente tutti i parametri per la funzione.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica il nome del file utilizzato nelle stack trace prodotte da questo script. **Predefinito:** `''`.
    - `lineOffset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di riga visualizzato nelle stack trace prodotte da questo script. **Predefinito:** `0`.
    - `columnOffset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di colonna della prima riga visualizzato nelle stack trace prodotte da questo script. **Predefinito:** `0`.
    - `cachedData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornisce un `Buffer` o `TypedArray` opzionale, oppure `DataView` con i dati della cache del codice V8 per l'origine fornita. Questo deve essere prodotto da una precedente chiamata a [`vm.compileFunction()`](/it/nodejs/api/vm#vmcompilefunctioncode-params-options) con lo stesso `code` e `params`.
    - `produceCachedData` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Specifica se produrre nuovi dati della cache. **Predefinito:** `false`.
    - `parsingContext` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) in cui la suddetta funzione deve essere compilata.
    - `contextExtensions` [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un array contenente una raccolta di estensioni del contesto (oggetti che racchiudono l'ambito corrente) da applicare durante la compilazione. **Predefinito:** `[]`.


- `importModuleDynamically` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/it/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilizzato per specificare come i moduli devono essere caricati durante la valutazione di questa funzione quando viene chiamato `import()`. Questa opzione fa parte dell'API dei moduli sperimentali. Si sconsiglia di utilizzarla in un ambiente di produzione. Per informazioni dettagliate, vedere [Supporto di `import()` dinamico nelle API di compilazione](/it/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
- Restituisce: [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Compila il codice specificato nel contesto fornito (se non viene fornito alcun contesto, viene utilizzato il contesto corrente) e lo restituisce racchiuso all'interno di una funzione con i `params` specificati.


## `vm.constants` {#vmconstants}

**Aggiunto in: v21.7.0, v20.12.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un oggetto contenente costanti comunemente utilizzate per le operazioni VM.

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**Aggiunto in: v21.7.0, v20.12.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Una costante che può essere utilizzata come opzione `importModuleDynamically` per `vm.Script` e `vm.compileFunction()` in modo che Node.js utilizzi il loader ESM predefinito dal contesto principale per caricare il modulo richiesto.

Per informazioni dettagliate, vedere [Supporto di `import()` dinamico nelle API di compilazione](/it/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.8.0, v20.18.0 | L'argomento `contextObject` ora accetta `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Aggiunto il supporto per `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v21.2.0, v20.11.0 | L'opzione `importModuleDynamically` è ora supportata. |
| v14.6.0 | L'opzione `microtaskMode` è ora supportata. |
| v10.0.0 | Il primo argomento non può più essere una funzione. |
| v10.0.0 | L'opzione `codeGeneration` è ora supportata. |
| v0.3.1 | Aggiunto in: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/it/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Sia [`vm.constants.DONT_CONTEXTIFY`](/it/nodejs/api/vm#vmconstantsdont_contextify) o un oggetto che sarà [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Se `undefined`, verrà creato un oggetto contestualizzato vuoto per compatibilità con le versioni precedenti.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome leggibile del contesto appena creato. **Predefinito:** `'VM Context i'`, dove `i` è un indice numerico crescente del contesto creato.
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origine](https://developer.mozilla.org/en-US/docs/Glossary/Origin) corrispondente al contesto appena creato a scopo di visualizzazione. L'origine deve essere formattata come un URL, ma solo con lo schema, l'host e la porta (se necessario), come il valore della proprietà [`url.origin`](/it/nodejs/api/url#urlorigin) di un oggetto [`URL`](/it/nodejs/api/url#class-url). In particolare, questa stringa deve omettere la barra finale, poiché denota un percorso. **Predefinito:** `''`.
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su false, qualsiasi chiamata a `eval` o costruttori di funzioni (`Function`, `GeneratorFunction`, ecc.) genererà un `EvalError`. **Predefinito:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su false, qualsiasi tentativo di compilare un modulo WebAssembly genererà un `WebAssembly.CompileError`. **Predefinito:** `true`.


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se impostato su `afterEvaluate`, i microtask (task pianificati tramite `Promise` e `async function`) verranno eseguiti immediatamente dopo che uno script è stato eseguito tramite [`script.runInContext()`](/it/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). Sono inclusi negli ambiti `timeout` e `breakOnSigint` in quel caso.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/it/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilizzato per specificare come i moduli devono essere caricati quando `import()` viene chiamato in questo contesto senza uno script o modulo di riferimento. Questa opzione fa parte dell'API dei moduli sperimentali. Si sconsiglia di utilizzarla in un ambiente di produzione. Per informazioni dettagliate, vedere [Supporto di `import()` dinamico nelle API di compilazione](/it/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) oggetto contestualizzato.

Se il dato `contextObject` è un oggetto, il metodo `vm.createContext()` [preparerà quell'oggetto](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) e restituirà un riferimento ad esso in modo che possa essere utilizzato nelle chiamate a [`vm.runInContext()`](/it/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) o [`script.runInContext()`](/it/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). All'interno di tali script, l'oggetto globale verrà incapsulato dal `contextObject`, mantenendo tutte le sue proprietà esistenti ma avendo anche gli oggetti e le funzioni built-in che qualsiasi [oggetto globale](https://es5.github.io/#x15.1) standard ha. Al di fuori degli script eseguiti dal modulo vm, le variabili globali rimarranno invariate.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Stampa: { globalVar: 2 }

console.log(global.globalVar);
// Stampa: 3
```
Se `contextObject` viene omesso (o passato esplicitamente come `undefined`), verrà restituito un nuovo oggetto [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) vuoto.

Quando l'oggetto globale nel contesto appena creato è [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object), ha alcune peculiarità rispetto agli oggetti globali ordinari. Ad esempio, non può essere congelato. Per creare un contesto senza le peculiarità di contestualizzazione, passa [`vm.constants.DONT_CONTEXTIFY`](/it/nodejs/api/vm#vmconstantsdont_contextify) come argomento `contextObject`. Vedere la documentazione di [`vm.constants.DONT_CONTEXTIFY`](/it/nodejs/api/vm#vmconstantsdont_contextify) per i dettagli.

Il metodo `vm.createContext()` è principalmente utile per creare un singolo contesto che può essere utilizzato per eseguire più script. Ad esempio, se si emula un browser web, il metodo può essere utilizzato per creare un singolo contesto che rappresenta l'oggetto globale di una finestra, quindi eseguire tutti i tag `\<script\>` insieme all'interno di quel contesto.

Il `name` e l'`origin` forniti del contesto sono resi visibili tramite l'API Inspector.


## `vm.isContext(object)` {#vmiscontextobject}

**Aggiunto in: v0.11.7**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` se l'oggetto `object` dato è stato [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) usando [`vm.createContext()`](/it/nodejs/api/vm#vmcreatecontextcontextobject-options), o se è l'oggetto globale di un contesto creato usando [`vm.constants.DONT_CONTEXTIFY`](/it/nodejs/api/vm#vmconstantsdont_contextify).

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**Aggiunto in: v13.10.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Misura la memoria conosciuta da V8 e utilizzata da tutti i contesti conosciuti dall'isolato V8 corrente, o dal contesto principale.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzionale.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O `'summary'` o `'detailed'`. Nella modalità summary, verrà restituita solo la memoria misurata per il contesto principale. Nella modalità detailed, verrà restituita la memoria misurata per tutti i contesti conosciuti dall'isolato V8 corrente. **Predefinito:** `'summary'`
    - `execution` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O `'default'` o `'eager'`. Con l'esecuzione predefinita, la promise non si risolverà fino all'avvio della successiva garbage collection pianificata, il che potrebbe richiedere un po' di tempo (o mai se il programma esce prima della prossima GC). Con l'esecuzione eager, la GC verrà avviata immediatamente per misurare la memoria. **Predefinito:** `'default'`
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se la memoria viene misurata correttamente, la promise si risolverà con un oggetto contenente informazioni sull'utilizzo della memoria. Altrimenti verrà rifiutata con un errore `ERR_CONTEXT_NOT_INITIALIZED`.

Il formato dell'oggetto con cui la Promise restituita potrebbe risolversi è specifico del motore V8 e potrebbe cambiare da una versione di V8 all'altra.

Il risultato restituito è diverso dalle statistiche restituite da `v8.getHeapSpaceStatistics()` in quanto `vm.measureMemory()` misura la memoria raggiungibile da ciascun contesto specifico di V8 nell'istanza corrente del motore V8, mentre il risultato di `v8.getHeapSpaceStatistics()` misura la memoria occupata da ciascuno spazio heap nell'istanza V8 corrente.

```js [ESM]
const vm = require('node:vm');
// Misura la memoria utilizzata dal contesto principale.
vm.measureMemory({ mode: 'summary' })
  // Questo è lo stesso di vm.measureMemory()
  .then((result) => {
    // Il formato corrente è:
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // Fare riferimento al contesto qui in modo che non venga
    // raccolto dalla GC fino al completamento della misurazione.
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [Cronologia]
| Versione | Modifiche |
|---|---|
| v21.7.0, v20.12.0 | Aggiunto il supporto per `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Aggiunto il supporto per gli attributi di importazione al parametro `importModuleDynamically`. |
| v6.3.0 | L'opzione `breakOnSigint` è ora supportata. |
| v0.3.1 | Aggiunto in: v0.3.1 |
:::

- `code` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il codice JavaScript da compilare ed eseguire.
- `contextifiedObject` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'oggetto [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) che verrà utilizzato come `global` quando il `code` viene compilato ed eseguito.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica il nome del file utilizzato nelle stack trace prodotte da questo script. **Predefinito:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di riga visualizzato nelle stack trace prodotte da questo script. **Predefinito:** `0`.
    - `columnOffset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di colonna della prima riga visualizzato nelle stack trace prodotte da questo script. **Predefinito:** `0`.
    - `displayErrors` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se si verifica un [`Error`](/it/nodejs/api/errors#class-error) durante la compilazione del `code`, la riga di codice che causa l'errore viene allegata alla stack trace. **Predefinito:** `true`.
    - `timeout` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di millisecondi per eseguire `code` prima di terminare l'esecuzione. Se l'esecuzione viene terminata, verrà generato un [`Error`](/it/nodejs/api/errors#class-error). Questo valore deve essere un numero intero strettamente positivo.
    - `breakOnSigint` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la ricezione di `SIGINT` (+) terminerà l'esecuzione e genererà un [`Error`](/it/nodejs/api/errors#class-error). I gestori esistenti per l'evento che sono stati allegati tramite `process.on('SIGINT')` vengono disabilitati durante l'esecuzione dello script, ma continuano a funzionare successivamente. **Predefinito:** `false`.
    - `cachedData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornisce un `Buffer` o `TypedArray` o `DataView` facoltativo con i dati della cache del codice V8 per la sorgente fornita.
    - `importModuleDynamically` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/it/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilizzato per specificare come i moduli devono essere caricati durante la valutazione di questo script quando viene chiamato `import()`. Questa opzione fa parte dell'API dei moduli sperimentali. Si sconsiglia di utilizzarla in un ambiente di produzione. Per informazioni dettagliate, vedere [Supporto di `import()` dinamico nelle API di compilazione](/it/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

Il metodo `vm.runInContext()` compila `code`, lo esegue all'interno del contesto di `contextifiedObject`, quindi restituisce il risultato. L'esecuzione del codice non ha accesso all'ambito locale. L'oggetto `contextifiedObject` *deve* essere stato precedentemente [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) utilizzando il metodo [`vm.createContext()`](/it/nodejs/api/vm#vmcreatecontextcontextobject-options).

Se `options` è una stringa, specifica il nome del file.

L'esempio seguente compila ed esegue script diversi utilizzando un singolo oggetto [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object):

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.8.0, v20.18.0 | L'argomento `contextObject` ora accetta `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Aggiunto il supporto per `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Aggiunto il supporto per gli attributi di importazione al parametro `importModuleDynamically`. |
| v14.6.0 | L'opzione `microtaskMode` è ora supportata. |
| v10.0.0 | L'opzione `contextCodeGeneration` è ora supportata. |
| v6.3.0 | L'opzione `breakOnSigint` è ora supportata. |
| v0.3.1 | Aggiunto in: v0.3.1 |
:::

- `code` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il codice JavaScript da compilare ed eseguire.
- `contextObject` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/it/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Sia [`vm.constants.DONT_CONTEXTIFY`](/it/nodejs/api/vm#vmconstantsdont_contextify) che un oggetto che verrà [contestualizzato](/it/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Se `undefined`, verrà creato un oggetto contestualizzato vuoto per retrocompatibilità.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica il nome del file utilizzato nelle stack trace prodotte da questo script. **Predefinito:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di riga visualizzato nelle stack trace prodotte da questo script. **Predefinito:** `0`.
    - `columnOffset` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di colonna della prima riga visualizzato nelle stack trace prodotte da questo script. **Predefinito:** `0`.
    - `displayErrors` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se si verifica un [`Error`](/it/nodejs/api/errors#class-error) durante la compilazione del `code`, la riga di codice che causa l'errore viene allegata alla stack trace. **Predefinito:** `true`.
    - `timeout` [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di millisecondi per eseguire il `code` prima di terminare l'esecuzione. Se l'esecuzione viene terminata, verrà generato un [`Error`](/it/nodejs/api/errors#class-error). Questo valore deve essere un intero strettamente positivo.
    - `breakOnSigint` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la ricezione di `SIGINT` (+) terminerà l'esecuzione e genererà un [`Error`](/it/nodejs/api/errors#class-error). I gestori esistenti per l'evento che sono stati allegati tramite `process.on('SIGINT')` sono disabilitati durante l'esecuzione dello script, ma continuano a funzionare dopo. **Predefinito:** `false`.
    - `contextName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome leggibile dal utente del contesto appena creato. **Predefinito:** `'VM Context i'`, dove `i` è un indice numerico crescente del contesto creato.
    - `contextOrigin` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origine](https://developer.mozilla.org/en-US/docs/Glossary/Origin) corrispondente al contesto appena creato a scopo di visualizzazione. L'origine deve essere formattata come un URL, ma solo con lo schema, l'host e la porta (se necessario), come il valore della proprietà [`url.origin`](/it/nodejs/api/url#urlorigin) di un oggetto [`URL`](/it/nodejs/api/url#class-url). In particolare, questa stringa deve omettere la barra finale, poiché denota un percorso. **Predefinito:** `''`.
    - `contextCodeGeneration` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
        - `strings` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su false, qualsiasi chiamata a `eval` o costruttori di funzioni (`Function`, `GeneratorFunction`, ecc.) genererà un `EvalError`. **Predefinito:** `true`.
        - `wasm` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su false, qualsiasi tentativo di compilare un modulo WebAssembly genererà un `WebAssembly.CompileError`. **Predefinito:** `true`.
  
 
    - `cachedData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornisce un `Buffer` o `TypedArray` o `DataView` opzionale con i dati della cache del codice V8 per l'origine fornita.
    - `importModuleDynamically` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/it/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Usato per specificare come i moduli devono essere caricati durante la valutazione di questo script quando viene chiamato `import()`. Questa opzione fa parte dell'API dei moduli sperimentali. Si sconsiglia di utilizzarlo in un ambiente di produzione. Per informazioni dettagliate, vedere [Supporto di `import()` dinamico nelle API di compilazione](/it/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
    - `microtaskMode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se impostato su `afterEvaluate`, le microtask (task pianificate tramite `Promise` e `async function`) verranno eseguite immediatamente dopo l'esecuzione dello script. In tal caso, sono inclusi negli ambiti `timeout` e `breakOnSigint`.
  
 
- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) il risultato dell'ultima istruzione eseguita nello script.

Questo metodo è una scorciatoia per `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)`. Se `options` è una stringa, specifica il nome del file.

Fa diverse cose contemporaneamente:

L'esempio seguente compila ed esegue codice che incrementa una variabile globale e ne imposta una nuova. Queste variabili globali sono contenute in `contextObject`.

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Prints: { animal: 'cat', count: 3, name: 'kitty' }

// This would throw if the context is created from a contextified object.
// vm.constants.DONT_CONTEXTIFY allows creating contexts with ordinary global objects that
// can be frozen.
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.7.0, v20.12.0 | Aggiunto il supporto per `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Aggiunto il supporto per gli attributi di importazione al parametro `importModuleDynamically`. |
| v6.3.0 | L'opzione `breakOnSigint` è ora supportata. |
| v0.3.1 | Aggiunto in: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il codice JavaScript da compilare ed eseguire.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica il nome del file utilizzato negli stack trace prodotti da questo script. **Predefinito:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di riga visualizzato negli stack trace prodotti da questo script. **Predefinito:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica l'offset del numero di colonna della prima riga visualizzato negli stack trace prodotti da questo script. **Predefinito:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, se si verifica un [`Error`](/it/nodejs/api/errors#class-error) durante la compilazione del `code`, la riga di codice che causa l'errore viene allegata allo stack trace. **Predefinito:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di millisecondi per eseguire `code` prima di terminare l'esecuzione. Se l'esecuzione viene terminata, verrà generato un [`Error`](/it/nodejs/api/errors#class-error). Questo valore deve essere un numero intero strettamente positivo.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la ricezione di `SIGINT` (+) terminerà l'esecuzione e genererà un [`Error`](/it/nodejs/api/errors#class-error). I gestori esistenti per l'evento che sono stati collegati tramite `process.on('SIGINT')` vengono disabilitati durante l'esecuzione dello script, ma continuano a funzionare successivamente. **Predefinito:** `false`.
    - `cachedData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fornisce un `Buffer` o `TypedArray` opzionale, o `DataView` con i dati della cache del codice V8 per l'origine fornita.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/it/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilizzato per specificare come i moduli devono essere caricati durante la valutazione di questo script quando viene chiamato `import()`. Questa opzione fa parte dell'API dei moduli sperimentali. Si sconsiglia di utilizzarlo in un ambiente di produzione. Per informazioni dettagliate, consulta [Supporto dell'`import()` dinamico nelle API di compilazione](/it/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

- Returns: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) il risultato dell'ultima istruzione eseguita nello script.

`vm.runInThisContext()` compila `code`, lo esegue nel contesto del `global` corrente e restituisce il risultato. L'esecuzione del codice non ha accesso allo scope locale, ma ha accesso all'oggetto `global` corrente.

Se `options` è una stringa, specifica il nome del file.

L'esempio seguente illustra l'utilizzo sia di `vm.runInThisContext()` sia della funzione JavaScript [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) per eseguire lo stesso codice:

```js [ESM]
const vm = require('node:vm');
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```
Poiché `vm.runInThisContext()` non ha accesso allo scope locale, `localVar` rimane invariato. Al contrario, [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) *ha* accesso allo scope locale, quindi il valore di `localVar` viene modificato. In questo modo, `vm.runInThisContext()` è molto simile a una chiamata [indiretta di `eval()`](https://es5.github.io/#x10.4.2), ad es. `(0,eval)('code')`.


## Esempio: Esecuzione di un server HTTP all'interno di una VM {#example-running-an-http-server-within-a-vm}

Quando si utilizza [`script.runInThisContext()`](/it/nodejs/api/vm#scriptruninthiscontextoptions) o [`vm.runInThisContext()`](/it/nodejs/api/vm#vmruninthiscontextcode-options), il codice viene eseguito all'interno del contesto globale V8 corrente. Il codice passato a questo contesto VM avrà il suo scope isolato.

Per eseguire un semplice server web utilizzando il modulo `node:http`, il codice passato al contesto deve chiamare `require('node:http')` da solo, oppure avere un riferimento al modulo `node:http` passato ad esso. Ad esempio:

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
Il `require()` nel caso sopra condivide lo stato con il contesto da cui viene passato. Ciò può introdurre rischi quando viene eseguito codice non affidabile, ad esempio alterando oggetti nel contesto in modi indesiderati.

## Cosa significa "contestualizzare" un oggetto? {#what-does-it-mean-to-"contextify"-an-object?}

Tutto il JavaScript eseguito all'interno di Node.js viene eseguito nell'ambito di un "contesto". Secondo la [Guida per l'Embedder di V8](https://v8.dev/docs/embed#contexts):

Quando il metodo `vm.createContext()` viene chiamato con un oggetto, l'argomento `contextObject` verrà utilizzato per avvolgere l'oggetto globale di una nuova istanza di un contesto V8 (se `contextObject` è `undefined`, verrà creato un nuovo oggetto dal contesto corrente prima che venga contestualizzato). Questo contesto V8 fornisce al `code` eseguito utilizzando i metodi del modulo `node:vm` un ambiente globale isolato all'interno del quale può operare. Il processo di creazione del contesto V8 e di associazione con il `contextObject` nel contesto esterno è ciò che questo documento definisce "contestualizzare" l'oggetto.

La contestualizzazione introdurrebbe alcune stranezze al valore `globalThis` nel contesto. Ad esempio, non può essere bloccato e non è uguale per riferimento al `contextObject` nel contesto esterno.

```js [ESM]
const vm = require('node:vm');

// Un'opzione `contextObject` undefined rende l'oggetto globale contestualizzato.
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// Un oggetto globale contestualizzato non può essere bloccato.
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
Per creare un contesto con un oggetto globale ordinario e ottenere l'accesso a un proxy globale nel contesto esterno con meno stranezze, specifica `vm.constants.DONT_CONTEXTIFY` come argomento `contextObject`.


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

Quando utilizzata come argomento `contextObject` nelle API vm, questa costante indica a Node.js di creare un contesto senza avvolgere il suo oggetto globale con un altro oggetto in modo specifico per Node.js. Di conseguenza, il valore `globalThis` all'interno del nuovo contesto si comporterebbe in modo più simile a uno ordinario.

```js [ESM]
const vm = require('node:vm');

// Utilizza vm.constants.DONT_CONTEXTIFY per bloccare l'oggetto globale.
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
Quando `vm.constants.DONT_CONTEXTIFY` viene utilizzato come argomento `contextObject` per [`vm.createContext()`](/it/nodejs/api/vm#vmcreatecontextcontextobject-options), l'oggetto restituito è un oggetto simile a un proxy per l'oggetto globale nel contesto appena creato con meno peculiarità specifiche di Node.js. È uguale al valore `globalThis` nel nuovo contesto, può essere modificato dall'esterno del contesto e può essere utilizzato per accedere direttamente alle funzioni integrate nel nuovo contesto.

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// L'oggetto restituito è uguale a globalThis nel nuovo contesto.
console.log(vm.runInContext('globalThis', context) === context);  // true

// Può essere utilizzato per accedere direttamente alle variabili globali nel nuovo contesto.
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// Può essere bloccato e influisce sul contesto interno.
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## Interazioni di timeout con task asincroni e Promise {#timeout-interactions-with-asynchronous-tasks-and-promises}

`Promise` e `async function` possono pianificare l'esecuzione di task asincroni da parte del motore JavaScript. Per impostazione predefinita, questi task vengono eseguiti dopo che tutte le funzioni JavaScript sullo stack corrente hanno terminato l'esecuzione. Ciò consente di eludere le funzionalità delle opzioni `timeout` e `breakOnSigint`.

Ad esempio, il seguente codice eseguito da `vm.runInNewContext()` con un timeout di 5 millisecondi pianifica un ciclo infinito da eseguire dopo che una promise si è risolta. Il ciclo pianificato non viene mai interrotto dal timeout:

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// Questo viene stampato *prima* di 'entering loop' (!)
console.log('done executing');
```
Questo può essere risolto passando `microtaskMode: 'afterEvaluate'` al codice che crea il `Context`:

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
In questo caso, il microtask pianificato tramite `promise.then()` verrà eseguito prima di tornare da `vm.runInNewContext()` e verrà interrotto dalla funzionalità `timeout`. Questo si applica solo al codice in esecuzione in un `vm.Context`, quindi ad esempio [`vm.runInThisContext()`](/it/nodejs/api/vm#vmruninthiscontextcode-options) non accetta questa opzione.

I callback di Promise vengono inseriti nella coda dei microtask del contesto in cui sono stati creati. Ad esempio, se `() =\> loop()` viene sostituito con solo `loop` nell'esempio sopra, allora `loop` verrà inserito nella coda globale dei microtask, perché è una funzione dal contesto esterno (principale), e quindi sarà anche in grado di eludere il timeout.

Se le funzioni di pianificazione asincrona come `process.nextTick()`, `queueMicrotask()`, `setTimeout()`, `setImmediate()`, ecc. vengono rese disponibili all'interno di un `vm.Context`, le funzioni passate a esse verranno aggiunte alle code globali, che sono condivise da tutti i contesti. Pertanto, anche i callback passati a quelle funzioni non sono controllabili tramite il timeout.


## Supporto di `import()` dinamico nelle API di compilazione {#support-of-dynamic-import-in-compilation-apis}

Le seguenti API supportano un'opzione `importModuleDynamically` per abilitare `import()` dinamico nel codice compilato dal modulo vm.

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

Questa opzione fa ancora parte dell'API dei moduli sperimentali. Si sconsiglia di utilizzarla in un ambiente di produzione.

### Quando l'opzione `importModuleDynamically` non è specificata o è indefinita {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

Se questa opzione non è specificata, o se è `undefined`, il codice contenente `import()` può comunque essere compilato dalle API vm, ma quando il codice compilato viene eseguito ed effettivamente chiama `import()`, il risultato verrà rifiutato con [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/it/nodejs/api/errors#err_vm_dynamic_import_callback_missing).

### Quando `importModuleDynamically` è `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

Questa opzione non è attualmente supportata per `vm.SourceTextModule`.

Con questa opzione, quando un `import()` viene avviato nel codice compilato, Node.js utilizzerebbe il caricatore ESM predefinito dal contesto principale per caricare il modulo richiesto e restituirlo al codice in esecuzione.

Ciò consente l'accesso ai moduli integrati di Node.js come `fs` o `http` al codice in fase di compilazione. Se il codice viene eseguito in un contesto diverso, tenere presente che gli oggetti creati dai moduli caricati dal contesto principale provengono ancora dal contesto principale e non sono `instanceof` delle classi integrate nel nuovo contesto.

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL caricato dal contesto principale non è un'istanza della classe Function
// nel nuovo contesto.
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: URL caricato dal contesto principale non è un'istanza della classe Function
// nel nuovo contesto.
script.runInNewContext().then(console.log);
```
:::

Questa opzione consente anche allo script o alla funzione di caricare moduli utente:

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// Scrivi test.js e test.txt nella directory in cui si trova lo script corrente
// in esecuzione.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// Compila uno script che carica test.mjs e poi test.json
// come se lo script fosse posizionato nella stessa directory.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// Scrivi test.js e test.txt nella directory in cui si trova lo script corrente
// in esecuzione.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// Compila uno script che carica test.mjs e poi test.json
// come se lo script fosse posizionato nella stessa directory.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

Ci sono alcune avvertenze con il caricamento dei moduli utente utilizzando il caricatore predefinito dal contesto principale:


### Quando `importModuleDynamically` è una funzione {#when-importmoduledynamically-is-a-function}

Quando `importModuleDynamically` è una funzione, verrà invocata quando `import()` viene chiamato nel codice compilato per consentire agli utenti di personalizzare come il modulo richiesto deve essere compilato e valutato. Attualmente, l'istanza di Node.js deve essere avviata con il flag `--experimental-vm-modules` affinché questa opzione funzioni. Se il flag non è impostato, questo callback verrà ignorato. Se il codice valutato chiama effettivamente `import()`, il risultato verrà rifiutato con [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/it/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag).

Il callback `importModuleDynamically(specifier, referrer, importAttributes)` ha la seguente firma:

- `specifier` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) identificatore passato a `import()`
- `referrer` [\<vm.Script\>](/it/nodejs/api/vm#class-vmscript) | [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/it/nodejs/api/vm#class-vmsourcetextmodule) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il referrer è il `vm.Script` compilato per `new vm.Script`, `vm.runInThisContext`, `vm.runInContext` e `vm.runInNewContext`. È la `Funzione` compilata per `vm.compileFunction`, il `vm.SourceTextModule` compilato per `new vm.SourceTextModule` e l'`Oggetto` di contesto per `vm.createContext()`.
- `importAttributes` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il valore `"with"` passato al parametro opzionale [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call), o un oggetto vuoto se non è stato fornito alcun valore.
- Restituisce: [\<Oggetto Spazio dei Nomi Modulo\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/it/nodejs/api/vm#class-vmmodule) Si consiglia di restituire un `vm.Module` per sfruttare il tracciamento degli errori ed evitare problemi con gli spazi dei nomi che contengono esportazioni di funzioni `then`.



::: code-group
```js [ESM]
// Questo script deve essere eseguito con --experimental-vm-modules.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // Lo script compilato
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// Questo script deve essere eseguito con --experimental-vm-modules.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // Lo script compilato
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

