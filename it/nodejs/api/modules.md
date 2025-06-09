---
title: Documentazione Node.js - Moduli
description: Esplora la documentazione di Node.js sui moduli, inclusi CommonJS, moduli ES e come gestire le dipendenze e la risoluzione dei moduli.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Moduli | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esplora la documentazione di Node.js sui moduli, inclusi CommonJS, moduli ES e come gestire le dipendenze e la risoluzione dei moduli.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Moduli | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esplora la documentazione di Node.js sui moduli, inclusi CommonJS, moduli ES e come gestire le dipendenze e la risoluzione dei moduli.
---


# Moduli: Moduli CommonJS {#modules-commonjs-modules}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

I moduli CommonJS sono il modo originale per impacchettare il codice JavaScript per Node.js. Node.js supporta anche lo standard [moduli ECMAScript](/it/nodejs/api/esm) utilizzato dai browser e da altri runtime JavaScript.

In Node.js, ogni file viene trattato come un modulo separato. Ad esempio, considera un file di nome `foo.js`:

```js [ESM]
const circle = require('./circle.js');
console.log(`L'area di un cerchio di raggio 4 è ${circle.area(4)}`);
```
Nella prima riga, `foo.js` carica il modulo `circle.js` che si trova nella stessa directory di `foo.js`.

Ecco il contenuto di `circle.js`:

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
Il modulo `circle.js` ha esportato le funzioni `area()` e `circumference()`. Funzioni e oggetti vengono aggiunti alla radice di un modulo specificando proprietà aggiuntive sull'oggetto speciale `exports`.

Le variabili locali al modulo saranno private, perché il modulo è racchiuso in una funzione da Node.js (vedi [module wrapper](/it/nodejs/api/modules#the-module-wrapper)). In questo esempio, la variabile `PI` è privata a `circle.js`.

Alla proprietà `module.exports` può essere assegnato un nuovo valore (come una funzione o un oggetto).

Nel seguente codice, `bar.js` utilizza il modulo `square`, che esporta una classe Square:

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`L'area del mio quadrato è ${mySquare.area()}`);
```
Il modulo `square` è definito in `square.js`:

```js [ESM]
// L'assegnazione a exports non modificherà il modulo, deve essere usato module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
Il sistema di moduli CommonJS è implementato nel [`module` core module](/it/nodejs/api/module).

## Abilitazione {#enabling}

Node.js ha due sistemi di moduli: moduli CommonJS e [moduli ECMAScript](/it/nodejs/api/esm).

Per impostazione predefinita, Node.js tratterà i seguenti come moduli CommonJS:

- File con estensione `.cjs`;
- File con estensione `.js` quando il file `package.json` principale più vicino contiene un campo di primo livello [`"type"`](/it/nodejs/api/packages#type) con il valore `"commonjs"`.
- File con estensione `.js` o senza estensione, quando il file `package.json` principale più vicino non contiene un campo di primo livello [`"type"`](/it/nodejs/api/packages#type) oppure non c'è alcun `package.json` in nessuna cartella principale; a meno che il file non contenga una sintassi che genera un errore a meno che non venga valutato come modulo ES. Gli autori del pacchetto dovrebbero includere il campo [`"type"`](/it/nodejs/api/packages#type), anche nei pacchetti in cui tutte le sorgenti sono CommonJS. Essere espliciti sul `type` del pacchetto renderà più facile per gli strumenti di compilazione e i loader determinare come i file nel pacchetto devono essere interpretati.
- File con un'estensione diversa da `.mjs`, `.cjs`, `.json`, `.node` o `.js` (quando il file `package.json` principale più vicino contiene un campo di primo livello [`"type"`](/it/nodejs/api/packages#type) con un valore di `"module"`, questi file saranno riconosciuti come moduli CommonJS solo se vengono inclusi tramite `require()`, non quando vengono utilizzati come punto di ingresso da riga di comando del programma).

Vedi [Determinazione del sistema di moduli](/it/nodejs/api/packages#determining-module-system) per maggiori dettagli.

La chiamata a `require()` utilizza sempre il loader del modulo CommonJS. La chiamata a `import()` utilizza sempre il loader del modulo ECMAScript.


## Accesso al modulo principale {#accessing-the-main-module}

Quando un file viene eseguito direttamente da Node.js, `require.main` viene impostato sul suo `module`. Ciò significa che è possibile determinare se un file è stato eseguito direttamente verificando `require.main === module`.

Per un file `foo.js`, questo sarà `true` se eseguito tramite `node foo.js`, ma `false` se eseguito da `require('./foo')`.

Quando il punto di ingresso non è un modulo CommonJS, `require.main` è `undefined` e il modulo principale è fuori portata.

## Suggerimenti per il gestore di pacchetti {#package-manager-tips}

La semantica della funzione `require()` di Node.js è stata progettata per essere sufficientemente generale da supportare strutture di directory ragionevoli. Si spera che i programmi di gestione dei pacchetti come `dpkg`, `rpm` e `npm` possano costruire pacchetti nativi dai moduli Node.js senza modifiche.

Di seguito, forniamo una struttura di directory suggerita che potrebbe funzionare:

Supponiamo di voler avere la cartella in `/usr/lib/node/\<nome-pacchetto\>/\<versione\>` contenente il contenuto di una versione specifica di un pacchetto.

I pacchetti possono dipendere l'uno dall'altro. Per installare il pacchetto `foo`, potrebbe essere necessario installare una versione specifica del pacchetto `bar`. Il pacchetto `bar` stesso potrebbe avere delle dipendenze e, in alcuni casi, queste potrebbero persino collidere o formare dipendenze cicliche.

Poiché Node.js cerca il `realpath` di tutti i moduli che carica (cioè, risolve i collegamenti simbolici) e quindi [cerca le loro dipendenze nelle cartelle `node_modules`](/it/nodejs/api/modules#loading-from-node_modules-folders), questa situazione può essere risolta con la seguente architettura:

- `/usr/lib/node/foo/1.2.3/`: Contenuto del pacchetto `foo`, versione 1.2.3.
- `/usr/lib/node/bar/4.3.2/`: Contenuto del pacchetto `bar` da cui dipende `foo`.
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: Collegamento simbolico a `/usr/lib/node/bar/4.3.2/`.
- `/usr/lib/node/bar/4.3.2/node_modules/*`: Collegamenti simbolici ai pacchetti da cui dipende `bar`.

Pertanto, anche se si verifica un ciclo o se ci sono conflitti di dipendenza, ogni modulo sarà in grado di ottenere una versione della sua dipendenza che può utilizzare.

Quando il codice nel pacchetto `foo` esegue `require('bar')`, otterrà la versione che è collegata simbolicamente in `/usr/lib/node/foo/1.2.3/node_modules/bar`. Quindi, quando il codice nel pacchetto `bar` chiama `require('quux')`, otterrà la versione che è collegata simbolicamente in `/usr/lib/node/bar/4.3.2/node_modules/quux`.

Inoltre, per rendere il processo di ricerca dei moduli ancora più ottimale, piuttosto che inserire i pacchetti direttamente in `/usr/lib/node`, potremmo inserirli in `/usr/lib/node_modules/\<nome\>/\<versione\>`. Quindi Node.js non si preoccuperà di cercare le dipendenze mancanti in `/usr/node_modules` o `/node_modules`.

Per rendere i moduli disponibili al REPL di Node.js, potrebbe essere utile aggiungere anche la cartella `/usr/lib/node_modules` alla variabile di ambiente `$NODE_PATH`. Poiché le ricerche di moduli che utilizzano le cartelle `node_modules` sono tutte relative e basate sul percorso reale dei file che effettuano le chiamate a `require()`, i pacchetti stessi possono essere ovunque.


## Caricamento di moduli ECMAScript tramite `require()` {#loading-ecmascript-modules-using-require}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Questa funzionalità non emette più un avviso sperimentale per impostazione predefinita, sebbene l'avviso possa ancora essere emesso da --trace-require-module. |
| v23.0.0 | Questa funzionalità non è più dietro il flag CLI `--experimental-require-module`. |
| v23.0.0 | Supporto all'esportazione interop `'module.exports'` in `require(esm)`. |
| v22.0.0, v20.17.0 | Aggiunto in: v22.0.0, v20.17.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato per il rilascio
:::

L'estensione `.mjs` è riservata ai [Moduli ECMAScript](/it/nodejs/api/esm). Consulta la sezione [Determinazione del sistema di moduli](/it/nodejs/api/packages#determining-module-system) per maggiori informazioni su quali file vengono analizzati come moduli ECMAScript.

`require()` supporta solo il caricamento di moduli ECMAScript che soddisfano i seguenti requisiti:

- Il modulo è completamente sincrono (non contiene `await` di livello superiore); e
- Una di queste condizioni è soddisfatta:

Se il modulo ES caricato soddisfa i requisiti, `require()` può caricarlo e restituire l'oggetto namespace del modulo. In questo caso è simile all' `import()` dinamico, ma viene eseguito in modo sincrono e restituisce direttamente l'oggetto namespace.

Con i seguenti moduli ES:

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
Un modulo CommonJS può caricarli con `require()`:

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```
Per l'interoperabilità con gli strumenti esistenti che convertono i moduli ES in CommonJS, che potrebbero quindi caricare moduli ES reali tramite `require()`, lo spazio dei nomi restituito conterrà una proprietà `__esModule: true` se ha un'esportazione `default` in modo che il codice di consumo generato dagli strumenti possa riconoscere le esportazioni predefinite nei moduli ES reali. Se lo spazio dei nomi definisce già `__esModule`, questo non verrà aggiunto. Questa proprietà è sperimentale e può cambiare in futuro. Dovrebbe essere utilizzata solo da strumenti che convertono i moduli ES in moduli CommonJS, seguendo le convenzioni dell'ecosistema esistenti. Il codice creato direttamente in CommonJS dovrebbe evitare di dipendere da esso.

Quando un modulo ES contiene sia esportazioni con nome che un'esportazione predefinita, il risultato restituito da `require()` è l'oggetto namespace del modulo, che inserisce l'esportazione predefinita nella proprietà `.default`, in modo simile ai risultati restituiti da `import()`. Per personalizzare ciò che deve essere restituito direttamente da `require(esm)`, il modulo ES può esportare il valore desiderato utilizzando il nome stringa `"module.exports"`.

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` viene persa per i consumatori CommonJS di questo modulo, a meno che non venga
// aggiunta a `Point` come proprietà statica.
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Le esportazioni con nome vengono perse quando viene utilizzato 'module.exports'
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
Si noti nell'esempio sopra, quando viene utilizzato il nome di esportazione `module.exports`, le esportazioni con nome andranno perse per i consumatori CommonJS. Per consentire ai consumatori CommonJS di continuare ad accedere alle esportazioni con nome, il modulo può assicurarsi che l'esportazione predefinita sia un oggetto con le esportazioni con nome allegate come proprietà. Ad esempio, con l'esempio sopra, `distance` può essere allegato all'esportazione predefinita, la classe `Point`, come metodo statico.

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```
Se il modulo che viene `require()` contiene `await` di livello superiore, o il grafo del modulo che `import` contiene `await` di livello superiore, verrà generato [`ERR_REQUIRE_ASYNC_MODULE`](/it/nodejs/api/errors#err_require_async_module). In questo caso, gli utenti devono caricare il modulo asincrono utilizzando [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

Se `--experimental-print-required-tla` è abilitato, invece di generare `ERR_REQUIRE_ASYNC_MODULE` prima della valutazione, Node.js valuterà il modulo, cercherà di individuare gli await di livello superiore e stamperà la loro posizione per aiutare gli utenti a risolverli.

Il supporto per il caricamento di moduli ES tramite `require()` è attualmente sperimentale e può essere disabilitato utilizzando `--no-experimental-require-module`. Per stampare dove viene utilizzata questa funzionalità, utilizzare [`--trace-require-module`](/it/nodejs/api/cli#--trace-require-modulemode).

Questa funzionalità può essere rilevata controllando se [`process.features.require_module`](/it/nodejs/api/process#processfeaturesrequire_module) è `true`.


## Tutto insieme {#all-together}

Per ottenere il nome esatto del file che verrà caricato quando viene chiamato `require()`, usa la funzione `require.resolve()`.

Mettendo insieme tutto quanto sopra, ecco l'algoritmo di alto livello in pseudocodice di ciò che fa `require()`:

```text [TEXT]
require(X) dal modulo al percorso Y
1. Se X è un modulo core,
   a. restituisci il modulo core
   b. FERMA
2. Se X inizia con '/'
   a. imposta Y come radice del file system
3. Se X inizia con './' o '/' o '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
   c. LANCIA "non trovato"
4. Se X inizia con '#'
   a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. LOAD_NODE_MODULES(X, dirname(Y))
7. LANCIA "non trovato"

MAYBE_DETECT_AND_LOAD(X)
1. Se X viene analizzato come un modulo CommonJS, carica X come un modulo CommonJS. FERMA.
2. Altrimenti, se il codice sorgente di X può essere analizzato come un modulo ECMAScript usando
  <a href="esm.md#resolver-algorithm-specification">DETECT_MODULE_SYNTAX definito nel
  resolver ESM</a>,
  a. Carica X come un modulo ECMAScript. FERMA.
3. LANCIA SyntaxError dal tentativo di analizzare X come CommonJS in 1. FERMA.

LOAD_AS_FILE(X)
1. Se X è un file, carica X come il suo formato di estensione del file. FERMA
2. Se X.js è un file,
    a. Trova l'ambito del pacchetto SCOPE più vicino a X.
    b. Se non è stato trovato alcun ambito
      1. MAYBE_DETECT_AND_LOAD(X.js)
    c. Se SCOPE/package.json contiene il campo "type",
      1. Se il campo "type" è "module", carica X.js come un modulo ECMAScript. FERMA.
      2. Se il campo "type" è "commonjs", carica X.js come un modulo CommonJS. FERMA.
    d. MAYBE_DETECT_AND_LOAD(X.js)
3. Se X.json è un file, carica X.json in un oggetto JavaScript. FERMA
4. Se X.node è un file, carica X.node come addon binario. FERMA

LOAD_INDEX(X)
1. Se X/index.js è un file
    a. Trova l'ambito del pacchetto SCOPE più vicino a X.
    b. Se non è stato trovato alcun ambito, carica X/index.js come un modulo CommonJS. FERMA.
    c. Se SCOPE/package.json contiene il campo "type",
      1. Se il campo "type" è "module", carica X/index.js come un modulo ECMAScript. FERMA.
      2. Altrimenti, carica X/index.js come un modulo CommonJS. FERMA.
2. Se X/index.json è un file, analizza X/index.json in un oggetto JavaScript. FERMA
3. Se X/index.node è un file, carica X/index.node come addon binario. FERMA

LOAD_AS_DIRECTORY(X)
1. Se X/package.json è un file,
   a. Analizza X/package.json e cerca il campo "main".
   b. Se "main" è un valore falsy, VAI A 2.
   c. sia M = X + (campo main json)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X) DEPRECATO
   g. LANCIA "non trovato"
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. sia DIRS = NODE_MODULES_PATHS(START)
2. per ogni DIR in DIRS:
   a. LOAD_PACKAGE_EXPORTS(X, DIR)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. sia PARTS = path split(START)
2. sia I = conteggio di PARTS - 1
3. sia DIRS = []
4. finché I >= 0,
   a. se PARTS[I] = "node_modules", VAI A d.
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIR + DIRS
   d. sia I = I - 1
5. restituisci DIRS + GLOBAL_FOLDERS

LOAD_PACKAGE_IMPORTS(X, DIR)
1. Trova l'ambito del pacchetto SCOPE più vicino a DIR.
2. Se non è stato trovato alcun ambito, restituisci.
3. Se "imports" in SCOPE/package.json è null o undefined, restituisci.
4. Se `--experimental-require-module` è abilitato
  a. sia CONDITIONS = ["node", "require", "module-sync"]
  b. Altrimenti, sia CONDITIONS = ["node", "require"]
5. sia MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">definito nel resolver ESM</a>.
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. Prova a interpretare X come una combinazione di NAME e SUBPATH dove il nome
   potrebbe avere un prefisso @scope/ e il sottopercorso inizia con una barra (`/`).
2. Se X non corrisponde a questo modello o DIR/NAME/package.json non è un file,
   restituisci.
3. Analizza DIR/NAME/package.json e cerca il campo "exports".
4. Se "exports" è null o undefined, restituisci.
5. Se `--experimental-require-module` è abilitato
  a. sia CONDITIONS = ["node", "require", "module-sync"]
  b. Altrimenti, sia CONDITIONS = ["node", "require"]
6. sia MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   "exports" in `package.json`, CONDITIONS) <a href="esm.md#resolver-algorithm-specification">definito nel resolver ESM</a>.
7. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. Trova l'ambito del pacchetto SCOPE più vicino a DIR.
2. Se non è stato trovato alcun ambito, restituisci.
3. Se "exports" in SCOPE/package.json è null o undefined, restituisci.
4. Se "name" in SCOPE/package.json non è il primo segmento di X, restituisci.
5. sia MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), "exports" in `package.json`, ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">definito nel resolver ESM</a>.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. sia RESOLVED_PATH = fileURLToPath(MATCH)
2. Se il file in RESOLVED_PATH esiste, carica RESOLVED_PATH come il suo formato
   di estensione. FERMA
3. LANCIA "non trovato"
```

## Caching {#caching}

I moduli vengono memorizzati nella cache dopo il primo caricamento. Ciò significa (tra le altre cose) che ogni chiamata a `require('foo')` restituirà esattamente lo stesso oggetto, se si risolvesse nello stesso file.

A condizione che `require.cache` non venga modificato, più chiamate a `require('foo')` non causeranno l'esecuzione del codice del modulo più volte. Questa è una caratteristica importante. Con esso, è possibile restituire oggetti "parzialmente completati", consentendo così il caricamento di dipendenze transitive anche quando causerebbero cicli.

Per fare in modo che un modulo esegua il codice più volte, esporta una funzione e chiama tale funzione.

### Avvertenze sulla memorizzazione nella cache dei moduli {#module-caching-caveats}

I moduli vengono memorizzati nella cache in base al loro nome file risolto. Poiché i moduli possono risolvere in un nome file diverso in base alla posizione del modulo chiamante (caricamento dalle cartelle `node_modules`), non è una *garanzia* che `require('foo')` restituirà sempre esattamente lo stesso oggetto, se si risolvesse in file diversi.

Inoltre, su file system o sistemi operativi non case-sensitive, diversi nomi file risolti possono puntare allo stesso file, ma la cache li tratterà comunque come moduli diversi e ricaricherà il file più volte. Ad esempio, `require('./foo')` e `require('./FOO')` restituiscono due oggetti diversi, indipendentemente dal fatto che `./foo` e `./FOO` siano o meno lo stesso file.

## Moduli integrati {#built-in-modules}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0, v14.18.0 | Aggiunto il supporto per l'importazione `node:` a `require(...)`. |
:::

Node.js ha diversi moduli compilati nel binario. Questi moduli sono descritti in modo più dettagliato altrove in questa documentazione.

I moduli integrati sono definiti all'interno del sorgente di Node.js e si trovano nella cartella `lib/`.

I moduli integrati possono essere identificati utilizzando il prefisso `node:`, nel qual caso aggira la cache `require`. Ad esempio, `require('node:http')` restituirà sempre il modulo HTTP integrato, anche se esiste una voce `require.cache` con quel nome.

Alcuni moduli integrati vengono sempre caricati in modo preferenziale se il loro identificatore viene passato a `require()`. Ad esempio, `require('http')` restituirà sempre il modulo HTTP integrato, anche se esiste un file con quel nome. L'elenco dei moduli integrati che possono essere caricati senza utilizzare il prefisso `node:` è esposto in [`module.builtinModules`](/it/nodejs/api/module#modulebuiltinmodules), elencato senza il prefisso.


### Moduli integrati con prefisso `node:` obbligatorio {#built-in-modules-with-mandatory-node-prefix}

Quando vengono caricati tramite `require()`, alcuni moduli integrati devono essere richiesti con il prefisso `node:`. Questo requisito esiste per evitare che i moduli integrati di nuova introduzione entrino in conflitto con i pacchetti user land che hanno già preso il nome. Attualmente, i moduli integrati che richiedono il prefisso `node:` sono:

- [`node:sea`](/it/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/it/nodejs/api/sqlite)
- [`node:test`](/it/nodejs/api/test)
- [`node:test/reporters`](/it/nodejs/api/test#test-reporters)

L'elenco di questi moduli è esposto in [`module.builtinModules`](/it/nodejs/api/module#modulebuiltinmodules), incluso il prefisso.

## Cicli {#cycles}

Quando ci sono chiamate `require()` circolari, un modulo potrebbe non aver terminato l'esecuzione quando viene restituito.

Considera questa situazione:

`a.js`:

```js [ESM]
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```
`b.js`:

```js [ESM]
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```
`main.js`:

```js [ESM]
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```
Quando `main.js` carica `a.js`, quindi `a.js` a sua volta carica `b.js`. A quel punto, `b.js` tenta di caricare `a.js`. Per evitare un ciclo infinito, viene restituita al modulo `b.js` una **copia incompleta** dell'oggetto `exports` di `a.js`. `b.js` quindi termina il caricamento e il suo oggetto `exports` viene fornito al modulo `a.js`.

Quando `main.js` ha caricato entrambi i moduli, entrambi sono terminati. L'output di questo programma sarebbe quindi:

```bash [BASH]
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
È necessaria un'attenta pianificazione per consentire alle dipendenze cicliche dei moduli di funzionare correttamente all'interno di un'applicazione.


## Moduli file {#file-modules}

Se il nome file esatto non viene trovato, Node.js tenterà di caricare il nome file richiesto con le estensioni aggiunte: `.js`, `.json` e infine `.node`. Quando si carica un file che ha un'estensione diversa (ad es. `.cjs`), il suo nome completo deve essere passato a `require()`, inclusa la sua estensione del file (ad es. `require('./file.cjs')`).

I file `.json` vengono analizzati come file di testo JSON, i file `.node` vengono interpretati come moduli aggiuntivi compilati caricati con `process.dlopen()`. I file che utilizzano qualsiasi altra estensione (o nessuna estensione) vengono analizzati come file di testo JavaScript. Fare riferimento alla sezione [Determinazione del sistema dei moduli](/it/nodejs/api/packages#determining-module-system) per capire quale obiettivo di analisi verrà utilizzato.

Un modulo richiesto con il prefisso `'/'` è un percorso assoluto al file. Ad esempio, `require('/home/marco/foo.js')` caricherà il file in `/home/marco/foo.js`.

Un modulo richiesto con il prefisso `'./'` è relativo al file che chiama `require()`. Cioè, `circle.js` deve trovarsi nella stessa directory di `foo.js` affinché `require('./circle')` lo trovi.

Senza un `'/'`, `'./'` o `'../'` iniziali per indicare un file, il modulo deve essere un modulo principale oppure viene caricato da una cartella `node_modules`.

Se il percorso specificato non esiste, `require()` genererà un errore [`MODULE_NOT_FOUND`](/it/nodejs/api/errors#module_not_found).

## Cartelle come moduli {#folders-as-modules}

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece [esportazioni di sottopercorso](/it/nodejs/api/packages#subpath-exports) o [importazioni di sottopercorso](/it/nodejs/api/packages#subpath-imports).
:::

Ci sono tre modi in cui una cartella può essere passata a `require()` come argomento.

Il primo è creare un file [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) nella root della cartella, che specifica un modulo `main`. Un esempio di file [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) potrebbe apparire così:

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
Se questo fosse in una cartella in `./some-library`, allora `require('./some-library')` tenterebbe di caricare `./some-library/lib/some-library.js`.

Se non è presente alcun file [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) nella directory, o se la voce [`"main"`](/it/nodejs/api/packages#main) è mancante o non può essere risolta, allora Node.js tenterà di caricare un file `index.js` o `index.node` da quella directory. Ad esempio, se non ci fosse alcun file [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) nell'esempio precedente, allora `require('./some-library')` tenterebbe di caricare:

- `./some-library/index.js`
- `./some-library/index.node`

Se questi tentativi falliscono, allora Node.js segnalerà l'intero modulo come mancante con l'errore predefinito:

```bash [BASH]
Error: Cannot find module 'some-library'
```
In tutti e tre i casi sopra, una chiamata `import('./some-library')` risulterebbe in un errore [`ERR_UNSUPPORTED_DIR_IMPORT`](/it/nodejs/api/errors#err_unsupported_dir_import). L'utilizzo di [esportazioni di sottopercorso](/it/nodejs/api/packages#subpath-exports) o [importazioni di sottopercorso](/it/nodejs/api/packages#subpath-imports) del pacchetto può fornire gli stessi vantaggi di organizzazione del contenimento delle cartelle come moduli e funzionare sia per `require` che per `import`.


## Caricamento dalle cartelle `node_modules` {#loading-from-node_modules-folders}

Se l'identificatore del modulo passato a `require()` non è un modulo [integrato](/it/nodejs/api/modules#built-in-modules) e non inizia con `'/'`, `'../'` o `'./'`, allora Node.js inizia dalla directory del modulo corrente, aggiunge `/node_modules` e tenta di caricare il modulo da quella posizione. Node.js non aggiungerà `node_modules` a un percorso che termina già con `node_modules`.

Se non viene trovato lì, si sposta alla directory principale e così via, fino a raggiungere la radice del file system.

Ad esempio, se il file in `'/home/ry/projects/foo.js'` chiama `require('bar.js')`, allora Node.js cercherebbe nelle seguenti posizioni, in questo ordine:

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

Ciò consente ai programmi di localizzare le proprie dipendenze, in modo che non si scontrino.

È possibile richiedere file specifici o sottomoduli distribuiti con un modulo includendo un suffisso di percorso dopo il nome del modulo. Ad esempio, `require('example-module/path/to/file')` risolverebbe `path/to/file` rispetto a dove si trova `example-module`. Il percorso con suffisso segue la stessa semantica di risoluzione del modulo.

## Caricamento dalle cartelle globali {#loading-from-the-global-folders}

Se la variabile d'ambiente `NODE_PATH` è impostata su un elenco di percorsi assoluti delimitati da due punti, allora Node.js cercherà quei percorsi per i moduli se non vengono trovati altrove.

Su Windows, `NODE_PATH` è delimitato da punti e virgola (`;`) invece che da due punti.

`NODE_PATH` è stato originariamente creato per supportare il caricamento di moduli da percorsi variabili prima che fosse definito l'attuale algoritmo di [risoluzione del modulo](/it/nodejs/api/modules#all-together).

`NODE_PATH` è ancora supportato, ma è meno necessario ora che l'ecosistema Node.js si è stabilizzato su una convenzione per la localizzazione dei moduli dipendenti. A volte le implementazioni che si basano su `NODE_PATH` mostrano un comportamento sorprendente quando le persone non sono consapevoli che `NODE_PATH` deve essere impostato. A volte le dipendenze di un modulo cambiano, causando il caricamento di una versione diversa (o anche di un modulo diverso) durante la ricerca di `NODE_PATH`.

Inoltre, Node.js cercherà nel seguente elenco di GLOBAL_FOLDERS:

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

Dove `$HOME` è la directory home dell'utente e `$PREFIX` è il `node_prefix` configurato di Node.js.

Questi sono principalmente per motivi storici.

Si consiglia vivamente di inserire le dipendenze nella cartella `node_modules` locale. Questi verranno caricati più velocemente e in modo più affidabile.


## Il wrapper del modulo {#the-module-wrapper}

Prima che il codice di un modulo venga eseguito, Node.js lo avvolge con un wrapper di funzione che assomiglia al seguente:

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// Il codice del modulo risiede effettivamente qui
});
```
Facendo questo, Node.js ottiene alcune cose:

- Mantiene le variabili di livello superiore (definite con `var`, `const` o `let`) limitate al modulo piuttosto che all'oggetto globale.
- Aiuta a fornire alcune variabili dall'aspetto globale che sono in realtà specifiche del modulo, come:
    - Gli oggetti `module` ed `exports` che l'implementatore può utilizzare per esportare valori dal modulo.
    - Le variabili di convenienza `__filename` e `__dirname`, contenenti il nome file assoluto e il percorso della directory del modulo.

 

## L'ambito del modulo {#the-module-scope}

### `__dirname` {#__dirname}

**Aggiunto in: v0.1.27**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il nome della directory del modulo corrente. Questo è lo stesso di [`path.dirname()`](/it/nodejs/api/path#pathdirnamepath) di [`__filename`](/it/nodejs/api/modules#__filename).

Esempio: eseguire `node example.js` da `/Users/mjr`

```js [ESM]
console.log(__dirname);
// Stampa: /Users/mjr
console.log(path.dirname(__filename));
// Stampa: /Users/mjr
```
### `__filename` {#__filename}

**Aggiunto in: v0.0.1**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il nome del file del modulo corrente. Questo è il percorso assoluto del file del modulo corrente con i collegamenti simbolici risolti.

Per un programma principale, questo non è necessariamente lo stesso del nome file utilizzato nella riga di comando.

Vedi [`__dirname`](/it/nodejs/api/modules#__dirname) per il nome della directory del modulo corrente.

Esempi:

Esecuzione di `node example.js` da `/Users/mjr`

```js [ESM]
console.log(__filename);
// Stampa: /Users/mjr/example.js
console.log(__dirname);
// Stampa: /Users/mjr
```
Dati due moduli: `a` e `b`, dove `b` è una dipendenza di `a` e c'è una struttura di directory di:

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

I riferimenti a `__filename` all'interno di `b.js` restituiranno `/Users/mjr/app/node_modules/b/b.js` mentre i riferimenti a `__filename` all'interno di `a.js` restituiranno `/Users/mjr/app/a.js`.


### `exports` {#exports}

**Aggiunto in: v0.1.12**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un riferimento a `module.exports` che è più corto da digitare. Vedere la sezione sulla [scorciatoia exports](/it/nodejs/api/modules#exports-shortcut) per i dettagli su quando usare `exports` e quando usare `module.exports`.

### `module` {#module}

**Aggiunto in: v0.1.16**

- [\<module\>](/it/nodejs/api/modules#the-module-object)

Un riferimento al modulo corrente, vedere la sezione sull'oggetto [`module`](/it/nodejs/api/modules#the-module-object). In particolare, `module.exports` è utilizzato per definire cosa un modulo esporta e rende disponibile tramite `require()`.

### `require(id)` {#requireid}

**Aggiunto in: v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) nome o percorso del modulo
- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) contenuto del modulo esportato

Utilizzato per importare moduli, `JSON` e file locali. I moduli possono essere importati da `node_modules`. I moduli locali e i file JSON possono essere importati usando un percorso relativo (es. `./`, `./foo`, `./bar/baz`, `../foo`) che sarà risolto rispetto alla directory denominata da [`__dirname`](/it/nodejs/api/modules#__dirname) (se definito) o alla directory di lavoro corrente. I percorsi relativi in stile POSIX sono risolti in modo indipendente dal sistema operativo, il che significa che gli esempi sopra funzioneranno su Windows nello stesso modo in cui funzionerebbero sui sistemi Unix.

```js [ESM]
// Importazione di un modulo locale con un percorso relativo alla `__dirname` o alla
// directory di lavoro corrente. (Su Windows, questo si risolverebbe in .\path\myLocalModule.)
const myLocalModule = require('./path/myLocalModule');

// Importazione di un file JSON:
const jsonData = require('./path/filename.json');

// Importazione di un modulo da node_modules o da un modulo integrato di Node.js:
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**Aggiunto in: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

I moduli vengono memorizzati nella cache in questo oggetto quando sono richiesti. Eliminando una coppia chiave-valore da questo oggetto, il successivo `require` ricaricherà il modulo. Questo non si applica agli [addon nativi](/it/nodejs/api/addons), per i quali la ricarica provocherà un errore.

È anche possibile aggiungere o sostituire voci. Questa cache viene controllata prima dei moduli integrati e se un nome corrispondente a un modulo integrato viene aggiunto alla cache, solo le chiamate require con prefisso `node:` riceveranno il modulo integrato. Usare con cautela!

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**Aggiunto in: v0.3.0**

**Deprecato a partire da: v0.10.6**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Indica a `require` come gestire determinate estensioni di file.

Elabora i file con estensione `.sjs` come `.js`:

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**Deprecato.** In passato, questo elenco è stato utilizzato per caricare moduli non JavaScript in Node.js compilandoli su richiesta. Tuttavia, in pratica, ci sono modi molto migliori per farlo, come caricare i moduli tramite un altro programma Node.js o compilarli in JavaScript in anticipo.

Evita di usare `require.extensions`. L'uso potrebbe causare bug sottili e la risoluzione delle estensioni diventa più lenta con ogni estensione registrata.

#### `require.main` {#requiremain}

**Aggiunto in: v0.1.17**

- [\<module\>](/it/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

L'oggetto `Module` che rappresenta lo script di entrata caricato all'avvio del processo Node.js, o `undefined` se il punto di ingresso del programma non è un modulo CommonJS. Vedi ["Accesso al modulo principale"](/it/nodejs/api/modules#accessing-the-main-module).

Nello script `entry.js`:

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.9.0 | L'opzione `paths` è ora supportata. |
| v0.3.0 | Aggiunto in: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso del modulo da risolvere.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Percorsi da cui risolvere la posizione del modulo. Se presenti, questi percorsi vengono utilizzati al posto dei percorsi di risoluzione predefiniti, ad eccezione di [GLOBAL_FOLDERS](/it/nodejs/api/modules#loading-from-the-global-folders) come `$HOME/.node_modules`, che sono sempre inclusi. Ciascuno di questi percorsi viene utilizzato come punto di partenza per l'algoritmo di risoluzione dei moduli, il che significa che la gerarchia `node_modules` viene controllata da questa posizione.
  
 
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il meccanismo interno `require()` per cercare la posizione di un modulo, ma invece di caricare il modulo, restituisce semplicemente il nome file risolto.

Se il modulo non viene trovato, viene generato un errore `MODULE_NOT_FOUND`.


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**Aggiunto in: v8.9.0**

- `request` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso del modulo i cui percorsi di ricerca vengono recuperati.
- Restituisce: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Restituisce un array contenente i percorsi ricercati durante la risoluzione di `request` o `null` se la stringa `request` fa riferimento a un modulo core, ad esempio `http` o `fs`.

## L'oggetto `module` {#the-module-object}

**Aggiunto in: v0.1.16**

- [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

In ciascun modulo, la variabile libera `module` è un riferimento all'oggetto che rappresenta il modulo corrente. Per comodità, `module.exports` è accessibile anche tramite il modulo globale `exports`. `module` non è in realtà una globale ma piuttosto locale a ciascun modulo.

### `module.children` {#modulechildren}

**Aggiunto in: v0.1.16**

- [\<module[]\>](/it/nodejs/api/modules#the-module-object)

Gli oggetti modulo richiesti per la prima volta da questo.

### `module.exports` {#moduleexports}

**Aggiunto in: v0.1.16**

- [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'oggetto `module.exports` viene creato dal sistema `Module`. A volte questo non è accettabile; molti vogliono che il loro modulo sia un'istanza di qualche classe. Per fare ciò, assegna l'oggetto di esportazione desiderato a `module.exports`. Assegnare l'oggetto desiderato a `exports` semplicemente ricollegherà la variabile locale `exports`, che probabilmente non è ciò che si desidera.

Ad esempio, supponiamo di creare un modulo chiamato `a.js`:

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// Fai un po' di lavoro e, dopo un po' di tempo, emetti
// l'evento 'ready' dal modulo stesso.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
Quindi in un altro file potremmo fare:

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('il modulo "a" è pronto');
});
```
L'assegnazione a `module.exports` deve essere eseguita immediatamente. Non può essere fatto in alcun callback. Questo non funziona:

`x.js`:

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js`:

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### Scorciatoia `exports` {#exports-shortcut}

**Aggiunto in: v0.1.16**

La variabile `exports` è disponibile all'interno dello scope a livello di file di un modulo e le viene assegnato il valore di `module.exports` prima che il modulo venga valutato.

Consente una scorciatoia, in modo che `module.exports.f = ...` possa essere scritto in modo più succinto come `exports.f = ...`. Tuttavia, tieni presente che, come qualsiasi variabile, se viene assegnato un nuovo valore a `exports`, non è più vincolato a `module.exports`:

```js [ESM]
module.exports.hello = true; // Esportato dalla richiesta del modulo
exports = { hello: false };  // Non esportato, disponibile solo nel modulo
```
Quando la proprietà `module.exports` viene completamente sostituita da un nuovo oggetto, è comune riassegnare anche `exports`:

```js [ESM]
module.exports = exports = function Constructor() {
  // ... ecc.
};
```
Per illustrare il comportamento, immagina questa ipotetica implementazione di `require()`, che è abbastanza simile a ciò che viene effettivamente fatto da `require()`:

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Codice del modulo qui. In questo esempio, definisci una funzione.
    function someFunc() {}
    exports = someFunc;
    // A questo punto, exports non è più una scorciatoia per module.exports e
    // questo modulo esporterà comunque un oggetto predefinito vuoto.
    module.exports = someFunc;
    // A questo punto, il modulo esporterà ora someFunc, invece dell'oggetto
    // predefinito.
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**Aggiunto in: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il nome file completamente risolto del modulo.

### `module.id` {#moduleid}

**Aggiunto in: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'identificatore per il modulo. In genere questo è il nome file completamente risolto.

### `module.isPreloading` {#moduleispreloading}

**Aggiunto in: v15.4.0, v14.17.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il modulo è in esecuzione durante la fase di precaricamento di Node.js.


### `module.loaded` {#moduleloaded}

**Aggiunto in: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica se il modulo ha terminato il caricamento, o è in fase di caricamento.

### `module.parent` {#moduleparent}

**Aggiunto in: v0.1.16**

**Deprecato a partire da: v14.6.0, v12.19.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: si prega di utilizzare invece [`require.main`](/it/nodejs/api/modules#requiremain) e [`module.children`](/it/nodejs/api/modules#modulechildren).
:::

- [\<module\>](/it/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Il modulo che ha richiesto per primo questo, o `null` se il modulo corrente è il punto di ingresso del processo corrente, o `undefined` se il modulo è stato caricato da qualcosa che non è un modulo CommonJS (E.G.: REPL o `import`).

### `module.path` {#modulepath}

**Aggiunto in: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il nome della directory del modulo. Questo è solitamente lo stesso di [`path.dirname()`](/it/nodejs/api/path#pathdirnamepath) di [`module.id`](/it/nodejs/api/modules#moduleid).

### `module.paths` {#modulepaths}

**Aggiunto in: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

I percorsi di ricerca per il modulo.

### `module.require(id)` {#modulerequireid}

**Aggiunto in: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) contenuto del modulo esportato

Il metodo `module.require()` fornisce un modo per caricare un modulo come se `require()` fosse stato chiamato dal modulo originale.

Per fare ciò, è necessario ottenere un riferimento all'oggetto `module`. Poiché `require()` restituisce `module.exports` e `module` è in genere *solo* disponibile all'interno del codice di un modulo specifico, deve essere esportato esplicitamente per poter essere utilizzato.


## L'oggetto `Module` {#the-module-object_1}

Questa sezione è stata spostata in [Moduli: modulo core `module`](/it/nodejs/api/module#the-module-object).

- [`module.builtinModules`](/it/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/it/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/it/nodejs/api/module#modulesyncbuiltinesmexports)

## Supporto per Source map v3 {#source-map-v3-support}

Questa sezione è stata spostata in [Moduli: modulo core `module`](/it/nodejs/api/module#source-map-v3-support).

- [`module.findSourceMap(path)`](/it/nodejs/api/module#modulefindsourcemappath)
- [Classe: `module.SourceMap`](/it/nodejs/api/module#class-modulesourcemap) 
    - [`new SourceMap(payload)`](/it/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/it/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/it/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

