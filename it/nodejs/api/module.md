---
title: Documentazione Node.js - Sistema dei Moduli
description: Questa pagina fornisce una documentazione dettagliata sul sistema dei moduli di Node.js, inclusi i moduli CommonJS e ES, come caricare i moduli, la cache dei moduli e le differenze tra i due sistemi di moduli.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Sistema dei Moduli | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa pagina fornisce una documentazione dettagliata sul sistema dei moduli di Node.js, inclusi i moduli CommonJS e ES, come caricare i moduli, la cache dei moduli e le differenze tra i due sistemi di moduli.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Sistema dei Moduli | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa pagina fornisce una documentazione dettagliata sul sistema dei moduli di Node.js, inclusi i moduli CommonJS e ES, come caricare i moduli, la cache dei moduli e le differenze tra i due sistemi di moduli.
---


# Moduli: API `node:module` {#modules-nodemodule-api}

**Aggiunto in: v0.3.7**

## L'oggetto `Module` {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Fornisce metodi di utilità generali quando si interagisce con le istanze di `Module`, la variabile [`module`](/it/nodejs/api/module#the-module-object) spesso vista nei moduli [CommonJS](/it/nodejs/api/modules). Vi si accede tramite `import 'node:module'` o `require('node:module')`.

### `module.builtinModules` {#modulebuiltinmodules}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | L'elenco ora contiene anche moduli solo prefisso. |
| v9.3.0, v8.10.0, v6.13.0 | Aggiunto in: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un elenco dei nomi di tutti i moduli forniti da Node.js. Può essere utilizzato per verificare se un modulo è gestito da terzi o meno.

`module` in questo contesto non è lo stesso oggetto fornito dal [wrapper del modulo](/it/nodejs/api/modules#the-module-wrapper). Per accedervi, richiedere il modulo `Module`:



::: code-group
```js [ESM]
// module.mjs
// In un modulo ECMAScript
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// In un modulo CommonJS
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**Aggiunto in: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Nome file da utilizzare per costruire la funzione require. Deve essere un oggetto URL file, una stringa URL file o una stringa di percorso assoluto.
- Restituisce: [\<require\>](/it/nodejs/api/modules#requireid) Funzione Require

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js è un modulo CommonJS.
const siblingModule = require('./sibling-module');
```
### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**Aggiunto in: v23.2.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Lo specificatore per il modulo di cui recuperare il `package.json`. Quando si passa uno *specificatore bare*, viene restituito il `package.json` alla radice del pacchetto. Quando si passa uno *specificatore relativo* o uno *specificatore assoluto*, viene restituito il `package.json` genitore più vicino.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) La posizione assoluta (stringa URL `file:` o percorso FS) del modulo contenitore. Per CJS, utilizzare `__filename` (non `__dirname`!); per ESM, utilizzare `import.meta.url`. Non è necessario passarlo se `specifier` è uno `specificatore assoluto`.
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un percorso se viene trovato il `package.json`. Quando `startLocation` è un pacchetto, il `package.json` radice del pacchetto; quando è relativo o non risolto, il `package.json` più vicino alla `startLocation`.

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```


::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// Stesso risultato quando si passa invece uno specificatore assoluto:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Quando si passa uno specificatore assoluto, si potrebbe ottenere un risultato diverso se il
// modulo risolto si trova all'interno di una sottocartella che ha `package.json` nidificati.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// Stesso risultato quando si passa invece uno specificatore assoluto:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Quando si passa uno specificatore assoluto, si potrebbe ottenere un risultato diverso se il
// modulo risolto si trova all'interno di una sottocartella che ha `package.json` nidificati.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::

### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**Aggiunto in: v18.6.0, v16.17.0**

- `moduleName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) nome del modulo
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) restituisce true se il modulo è incorporato, altrimenti restituisce false

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.8.0, v18.19.0 | Aggiunto il supporto per le istanze URL WHATWG. |
| v20.6.0, v18.19.0 | Aggiunto in: v20.6.0, v18.19.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato alla versione
:::

- `specifier` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Hook di personalizzazione da registrare; questa dovrebbe essere la stessa stringa che verrebbe passata a `import()`, tranne che se è relativa, viene risolta rispetto a `parentURL`.
- `parentURL` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Se vuoi risolvere `specifier` rispetto a un URL di base, come `import.meta.url`, puoi passare quell'URL qui. **Predefinito:** `'data:'`
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Se vuoi risolvere `specifier` rispetto a un URL di base, come `import.meta.url`, puoi passare quell'URL qui. Questa proprietà viene ignorata se `parentURL` viene fornito come secondo argomento. **Predefinito:** `'data:'`
    - `data` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualsiasi valore JavaScript arbitrario e clonabile da passare all'hook [`initialize`](/it/nodejs/api/module#initialize).
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [oggetti trasferibili](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist) da passare all'hook `initialize`.
  
 

Registra un modulo che esporta [hook](/it/nodejs/api/module#customization-hooks) che personalizzano la risoluzione dei moduli Node.js e il comportamento di caricamento. Vedi [Hook di personalizzazione](/it/nodejs/api/module#customization-hooks).


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Aggiunto in: v23.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vedi [load hook](/it/nodejs/api/module#loadurl-context-nextload). **Predefinito:** `undefined`.
    - `resolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Vedi [resolve hook](/it/nodejs/api/module#resolvespecifier-context-nextresolve). **Predefinito:** `undefined`.

Registra gli [hook](/it/nodejs/api/module#customization-hooks) che personalizzano la risoluzione dei moduli Node.js e il comportamento di caricamento. Vedi [Hook di personalizzazione](/it/nodejs/api/module#customization-hooks).

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Aggiunto in: v23.2.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il codice da cui rimuovere le annotazioni di tipo.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'strip'`. I valori possibili sono:
    - `'strip'` Rimuove solo le annotazioni di tipo senza eseguire la trasformazione delle funzionalità di TypeScript.
    - `'transform'` Rimuove le annotazioni di tipo e trasforma le funzionalità di TypeScript in JavaScript.

    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`. Solo quando `mode` è `'transform'`, se `true`, verrà generata una source map per il codice trasformato.
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica l'URL di origine utilizzato nella source map.

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il codice con le annotazioni di tipo rimosse. `module.stripTypeScriptTypes()` rimuove le annotazioni di tipo dal codice TypeScript. Può essere utilizzato per rimuovere le annotazioni di tipo dal codice TypeScript prima di eseguirlo con `vm.runInContext()` o `vm.compileFunction()`. Per impostazione predefinita, genererà un errore se il codice contiene funzionalità TypeScript che richiedono la trasformazione come `Enums`, vedere [type-stripping](/it/nodejs/api/typescript#type-stripping) per ulteriori informazioni. Quando la modalità è `'transform'`, trasforma anche le funzionalità TypeScript in JavaScript, vedere [transform TypeScript features](/it/nodejs/api/typescript#typescript-features) per ulteriori informazioni. Quando la modalità è `'strip'`, le source map non vengono generate, perché le posizioni vengono preservate. Se `sourceMap` viene fornito, quando la modalità è `'strip'`, verrà generato un errore.

*ATTENZIONE*: L'output di questa funzione non deve essere considerato stabile tra le versioni di Node.js, a causa delle modifiche nel parser TypeScript.

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
:::

Se `sourceUrl` viene fornito, verrà aggiunto come commento alla fine dell'output:

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

Quando `mode` è `'transform'`, il codice viene trasformato in JavaScript:

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::


### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**Aggiunto in: v12.12.0**

Il metodo `module.syncBuiltinESMExports()` aggiorna tutti i binding live per gli [ES Modules](/it/nodejs/api/esm) incorporati in modo che corrispondano alle proprietà degli exports [CommonJS](/it/nodejs/api/modules). Non aggiunge né rimuove nomi esportati dagli [ES Modules](/it/nodejs/api/esm).

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // Sincronizza la proprietà readFile esistente con il nuovo valore
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync è stato eliminato dall'fs richiesto
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() non rimuove readFileSync da esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() non aggiunge nomi
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## Cache di compilazione dei moduli {#module-compile-cache}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.8.0 | aggiunte le API JavaScript iniziali per l'accesso in fase di esecuzione. |
| v22.1.0 | Aggiunto in: v22.1.0 |
:::

La cache di compilazione dei moduli può essere abilitata utilizzando il metodo [`module.enableCompileCache()`](/it/nodejs/api/module#moduleenablecompilecachecachedir) o la variabile d'ambiente [`NODE_COMPILE_CACHE=dir`](/it/nodejs/api/cli#node_compile_cachedir). Dopo che è stata abilitata, ogni volta che Node.js compila un CommonJS o un ECMAScript Module, utilizzerà la [cache del codice V8](https://v8.dev/blog/code-caching-for-devs) su disco persistente nella directory specificata per velocizzare la compilazione. Ciò potrebbe rallentare il primo caricamento di un grafico dei moduli, ma i caricamenti successivi dello stesso grafico dei moduli potrebbero ottenere un notevole aumento di velocità se il contenuto dei moduli non cambia.

Per pulire la cache di compilazione generata su disco, è sufficiente rimuovere la directory della cache. La directory della cache verrà ricreata la prossima volta che la stessa directory verrà utilizzata per l'archiviazione della cache di compilazione. Per evitare di riempire il disco con cache obsoleta, si consiglia di utilizzare una directory in [`os.tmpdir()`](/it/nodejs/api/os#ostmpdir). Se la cache di compilazione è abilitata da una chiamata a [`module.enableCompileCache()`](/it/nodejs/api/module#moduleenablecompilecachecachedir) senza specificare la directory, Node.js utilizzerà la variabile d'ambiente [`NODE_COMPILE_CACHE=dir`](/it/nodejs/api/cli#node_compile_cachedir) se impostata, altrimenti verrà impostata come predefinita `path.join(os.tmpdir(), 'node-compile-cache')`. Per individuare la directory della cache di compilazione utilizzata da un'istanza di Node.js in esecuzione, utilizzare [`module.getCompileCacheDir()`](/it/nodejs/api/module#modulegetcompilecachedir).

Attualmente, quando si utilizza la cache di compilazione con la [copertura del codice JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage), la copertura raccolta da V8 potrebbe essere meno precisa nelle funzioni deserializzate dalla cache del codice. Si consiglia di disattivare questa opzione quando si eseguono test per generare una copertura precisa.

La cache di compilazione dei moduli abilitata può essere disabilitata dalla variabile d'ambiente [`NODE_DISABLE_COMPILE_CACHE=1`](/it/nodejs/api/cli#node_disable_compile_cache1). Ciò può essere utile quando la cache di compilazione porta a comportamenti imprevisti o indesiderati (ad esempio, una copertura dei test meno precisa).

La cache di compilazione generata da una versione di Node.js non può essere riutilizzata da una versione diversa di Node.js. La cache generata da versioni diverse di Node.js verrà archiviata separatamente se viene utilizzata la stessa directory di base per conservare la cache, in modo che possano coesistere.

Al momento, quando la cache di compilazione è abilitata e un modulo viene caricato di nuovo, la cache del codice viene generata immediatamente dal codice compilato, ma verrà scritta su disco solo quando l'istanza di Node.js sta per uscire. Questo è soggetto a modifiche. Il metodo [`module.flushCompileCache()`](/it/nodejs/api/module#moduleflushcompilecache) può essere utilizzato per garantire che la cache del codice accumulata venga scaricata su disco nel caso in cui l'applicazione desideri generare altre istanze di Node.js e consentire loro di condividere la cache molto prima che il padre esca.


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**Aggiunto in: v22.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

Le seguenti costanti vengono restituite come campo `status` nell'oggetto restituito da [`module.enableCompileCache()`](/it/nodejs/api/module#moduleenablecompilecachecachedir) per indicare il risultato del tentativo di abilitare la [cache di compilazione del modulo](/it/nodejs/api/module#module-compile-cache).

| Costante | Descrizione |
| --- | --- |
| `ENABLED` | Node.js ha abilitato correttamente la cache di compilazione. La directory utilizzata per memorizzare la cache di compilazione verrà restituita nel campo `directory` nell'oggetto restituito. |
| `ALREADY_ENABLED` | La cache di compilazione è già stata abilitata in precedenza, o da una precedente chiamata a `module.enableCompileCache()`, o dalla variabile d'ambiente `NODE_COMPILE_CACHE=dir`. La directory utilizzata per memorizzare la cache di compilazione verrà restituita nel campo `directory` nell'oggetto restituito. |
| `FAILED` | Node.js non riesce ad abilitare la cache di compilazione. Ciò può essere causato dalla mancanza di autorizzazioni per utilizzare la directory specificata o da vari tipi di errori del file system. I dettagli dell'errore verranno restituiti nel campo `message` nell'oggetto restituito. |
| `DISABLED` | Node.js non può abilitare la cache di compilazione perché è stata impostata la variabile d'ambiente `NODE_DISABLE_COMPILE_CACHE=1`. |
### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**Aggiunto in: v22.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

- `cacheDir` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Percorso opzionale per specificare la directory in cui verrà archiviata/recuperata la cache di compilazione.
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `status` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uno dei [`module.constants.compileCacheStatus`](/it/nodejs/api/module#moduleconstantscompilecachestatus)
    - `message` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se Node.js non può abilitare la cache di compilazione, questo contiene il messaggio di errore. Impostato solo se `status` è `module.constants.compileCacheStatus.FAILED`.
    - `directory` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Se la cache di compilazione è abilitata, questo contiene la directory in cui è archiviata la cache di compilazione. Impostato solo se `status` è `module.constants.compileCacheStatus.ENABLED` o `module.constants.compileCacheStatus.ALREADY_ENABLED`.

Abilita la [cache di compilazione del modulo](/it/nodejs/api/module#module-compile-cache) nell'istanza corrente di Node.js.

Se `cacheDir` non è specificato, Node.js utilizzerà la directory specificata dalla variabile d'ambiente [`NODE_COMPILE_CACHE=dir`](/it/nodejs/api/cli#node_compile_cachedir) se è impostata, oppure utilizzerà `path.join(os.tmpdir(), 'node-compile-cache')` altrimenti. Per casi d'uso generali, si consiglia di chiamare `module.enableCompileCache()` senza specificare `cacheDir`, in modo che la directory possa essere sovrascritta dalla variabile d'ambiente `NODE_COMPILE_CACHE` quando necessario.

Poiché la cache di compilazione dovrebbe essere un'ottimizzazione silenziosa che non è richiesta per la funzionalità dell'applicazione, questo metodo è progettato per non generare alcuna eccezione quando la cache di compilazione non può essere abilitata. Invece, restituirà un oggetto contenente un messaggio di errore nel campo `message` per facilitare il debug. Se la cache di compilazione viene abilitata correttamente, il campo `directory` nell'oggetto restituito contiene il percorso della directory in cui è archiviata la cache di compilazione. Il campo `status` nell'oggetto restituito sarà uno dei valori `module.constants.compileCacheStatus` per indicare il risultato del tentativo di abilitare la [cache di compilazione del modulo](/it/nodejs/api/module#module-compile-cache).

Questo metodo influisce solo sull'istanza corrente di Node.js. Per abilitarlo nei thread di lavoro figlio, o chiama questo metodo anche nei thread di lavoro figlio, oppure imposta il valore `process.env.NODE_COMPILE_CACHE` nella directory della cache di compilazione in modo che il comportamento possa essere ereditato dai worker figlio. La directory può essere ottenuta dal campo `directory` restituito da questo metodo, oppure con [`module.getCompileCacheDir()`](/it/nodejs/api/module#modulegetcompilecachedir).


### `module.flushCompileCache()` {#moduleflushcompilecache}

**Aggiunto in: v23.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

Svuota la [cache di compilazione dei moduli](/it/nodejs/api/module#module-compile-cache) accumulata dai moduli già caricati nell'istanza corrente di Node.js su disco. Restituisce al termine di tutte le operazioni del file system di svuotamento, indipendentemente dal fatto che abbiano successo o meno. In caso di errori, l'operazione fallirà silenziosamente, poiché le mancate corrispondenze della cache di compilazione non dovrebbero interferire con il funzionamento effettivo dell'applicazione.

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**Aggiunto in: v22.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Percorso della directory della [cache di compilazione dei moduli](/it/nodejs/api/module#module-compile-cache) se abilitata, altrimenti `undefined`.

## Hook di personalizzazione {#customization-hooks}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Aggiunto il supporto per gli hook sincroni e in-thread. |
| v20.6.0, v18.19.0 | Aggiunto l'hook `initialize` per sostituire `globalPreload`. |
| v18.6.0, v16.17.0 | Aggiunto il supporto per l'incatenamento dei loader. |
| v16.12.0 | Rimossi `getFormat`, `getSource`, `transformSource` e `globalPreload`; aggiunti l'hook `load` e l'hook `getGlobalPreload`. |
| v8.8.0 | Aggiunto in: v8.8.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato al rilascio (versione asincrona) Stabilità: 1.1 - Sviluppo attivo (versione sincrona)
:::

Esistono due tipi di hook di personalizzazione dei moduli attualmente supportati:

### Abilitazione {#enabling}

La risoluzione e il caricamento dei moduli possono essere personalizzati tramite:

Gli hook possono essere registrati prima che venga eseguito il codice dell'applicazione utilizzando il flag [`--import`](/it/nodejs/api/cli#--importmodule) o [`--require`](/it/nodejs/api/cli#-r---require-module):

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```

::: code-group
```js [ESM]
// register-hooks.js
// Questo file può essere require()-ed solo se non contiene await di livello superiore.
// Usa module.register() per registrare hook asincroni in un thread dedicato.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// Usa module.register() per registrare hook asincroni in un thread dedicato.
register('./hooks.mjs', pathToFileURL(__filename));
```
:::

::: code-group
```js [ESM]
// Usa module.registerHooks() per registrare hook sincroni nel thread principale.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
```

```js [CJS]
// Usa module.registerHooks() per registrare hook sincroni nel thread principale.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* implementation */ },
  load(url, context, nextLoad) { /* implementation */ },
});
```
:::

Il file passato a `--import` o `--require` può anche essere un'esportazione da una dipendenza:

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
Dove `some-package` ha un campo [`"exports"`](/it/nodejs/api/packages#exports) che definisce l'esportazione `/register` da mappare a un file che chiama `register()`, come il seguente esempio `register-hooks.js`.

L'utilizzo di `--import` o `--require` garantisce che gli hook vengano registrati prima che vengano importati i file dell'applicazione, inclusi il punto di ingresso dell'applicazione e per eventuali thread di worker anche per impostazione predefinita.

In alternativa, `register()` e `registerHooks()` possono essere chiamati dal punto di ingresso, sebbene `import()` dinamico debba essere utilizzato per qualsiasi codice ESM che deve essere eseguito dopo che gli hook sono stati registrati.

::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// Poiché si tratta di un `import()` dinamico, gli hook `http-to-https` verranno eseguiti
// per gestire './my-app.js' e qualsiasi altro file che importa o richiede.
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// Poiché si tratta di un `import()` dinamico, gli hook `http-to-https` verranno eseguiti
// per gestire './my-app.js' e qualsiasi altro file che importa o richiede.
import('./my-app.js');
```
:::

Gli hook di personalizzazione verranno eseguiti per tutti i moduli caricati successivamente alla registrazione e i moduli a cui fanno riferimento tramite `import` e il `require` integrato. La funzione `require` creata dagli utenti utilizzando `module.createRequire()` può essere personalizzata solo dagli hook sincroni.

In questo esempio, stiamo registrando gli hook `http-to-https`, ma saranno disponibili solo per i moduli importati successivamente, in questo caso, `my-app.js` e qualsiasi cosa a cui faccia riferimento tramite `import` o `require` integrato nelle dipendenze CommonJS.

Se `import('./my-app.js')` fosse stato invece un `import './my-app.js'` statico, l'app sarebbe stata *già* caricata **prima** che gli hook `http-to-https` fossero registrati. Questo è dovuto alla specifica dei moduli ES, dove le importazioni statiche vengono valutate prima dalle foglie dell'albero, quindi di nuovo al tronco. Ci possono essere importazioni statiche *all'interno* di `my-app.js`, che non verranno valutate fino a quando `my-app.js` non viene importato dinamicamente.

Se vengono utilizzati hook sincroni, sono supportati sia `import`, `require` e `require` utente creato utilizzando `createRequire()`.

::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* implementation of synchronous hooks */ });

const require = createRequire(import.meta.url);

// Gli hook sincroni influiscono su import, require() e sulla funzione require() utente
// creato tramite createRequire().
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* implementation of synchronous hooks */ });

const userRequire = createRequire(__filename);

// Gli hook sincroni influiscono su import, require() e sulla funzione require() utente
// creato tramite createRequire().
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

Infine, se tutto ciò che si desidera fare è registrare gli hook prima che l'app venga eseguita e non si desidera creare un file separato a tale scopo, è possibile passare un URL `data:` a `--import`:

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### Concatenazione {#chaining}

È possibile chiamare `register` più di una volta:

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

In questo esempio, gli hook registrati formeranno delle catene. Queste catene vengono eseguite in modalità LIFO (last-in, first out). Se sia `foo.mjs` che `bar.mjs` definiscono un hook `resolve`, verranno chiamati in questo modo (nota da destra a sinistra): predefinito di Node ← `./foo.mjs` ← `./bar.mjs` (a partire da `./bar.mjs`, poi `./foo.mjs`, poi il predefinito di Node.js). Lo stesso vale per tutti gli altri hook.

Gli hook registrati influiscono anche su `register` stesso. In questo esempio, `bar.mjs` verrà risolto e caricato tramite gli hook registrati da `foo.mjs` (perché gli hook di `foo` saranno già stati aggiunti alla catena). Ciò consente di scrivere hook in linguaggi diversi da JavaScript, a condizione che gli hook registrati in precedenza vengano transpilati in JavaScript.

Il metodo `register` non può essere chiamato dall'interno del modulo che definisce gli hook.

La concatenazione di `registerHooks` funziona in modo simile. Se gli hook sincroni e asincroni sono mescolati, gli hook sincroni vengono sempre eseguiti per primi prima che inizino a essere eseguiti gli hook asincroni, ovvero, nell'ultimo hook sincrono in esecuzione, il suo hook successivo include l'invocazione degli hook asincroni.

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```
:::


### Comunicazione con gli hook di personalizzazione dei moduli {#communication-with-module-customization-hooks}

Gli hook asincroni vengono eseguiti su un thread dedicato, separato dal thread principale che esegue il codice dell'applicazione. Ciò significa che la modifica delle variabili globali non influirà sugli altri thread e i canali di messaggi devono essere utilizzati per comunicare tra i thread.

Il metodo `register` può essere utilizzato per passare dati a un hook [`initialize`](/it/nodejs/api/module#initialize). I dati passati all'hook possono includere oggetti trasferibili come le porte.

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Questo esempio dimostra come un canale di messaggi può essere utilizzato per
// comunicare con gli hook, inviando `port2` agli hook.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Questo esempio mostra come un canale di messaggi può essere utilizzato per
// comunicare con gli hook, inviando `port2` agli hook.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

Gli hook dei moduli sincroni vengono eseguiti sullo stesso thread in cui viene eseguito il codice dell'applicazione. Possono modificare direttamente le variabili globali del contesto a cui accede il thread principale.

### Hook {#hooks}

#### Hook asincroni accettati da `module.register()` {#asynchronous-hooks-accepted-by-moduleregister}

Il metodo [`register`](/it/nodejs/api/module#moduleregisterspecifier-parenturl-options) può essere utilizzato per registrare un modulo che esporta un insieme di hook. Gli hook sono funzioni che vengono chiamate da Node.js per personalizzare il processo di risoluzione e caricamento dei moduli. Le funzioni esportate devono avere nomi e firme specifici e devono essere esportate come esportazioni denominate.

```js [ESM]
export async function initialize({ number, port }) {
  // Riceve dati da `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // Prende uno specificatore `import` o `require` e lo risolve in un URL.
}

export async function load(url, context, nextLoad) {
  // Prende un URL risolto e restituisce il codice sorgente da valutare.
}
```
Gli hook asincroni vengono eseguiti in un thread separato, isolato dal thread principale in cui viene eseguito il codice dell'applicazione. Ciò significa che è un [realm](https://tc39.es/ecma262/#realm) diverso. Il thread degli hook può essere terminato dal thread principale in qualsiasi momento, quindi non fare affidamento sul completamento delle operazioni asincrone (come `console.log`). Per impostazione predefinita, vengono ereditati nei worker figlio.


#### Hook sincroni accettati da `module.registerHooks()` {#synchronous-hooks-accepted-by-moduleregisterhooks}

**Aggiunto in: v23.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Il metodo `module.registerHooks()` accetta funzioni hook sincrone. `initialize()` non è supportato né necessario, poiché chi implementa l'hook può semplicemente eseguire il codice di inizializzazione direttamente prima della chiamata a `module.registerHooks()`.

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // Prendi uno specifier `import` o `require` e risolvilo in un URL.
}

function load(url, context, nextLoad) {
  // Prendi un URL risolto e restituisci il codice sorgente da valutare.
}
```

Gli hook sincroni vengono eseguiti nello stesso thread e nello stesso [realm](https://tc39.es/ecma262/#realm) in cui vengono caricati i moduli. A differenza degli hook asincroni, non vengono ereditati nei thread worker figlio per impostazione predefinita, anche se gli hook vengono registrati utilizzando un file precaricato da [`--import`](/it/nodejs/api/cli#--importmodule) o [`--require`](/it/nodejs/api/cli#-r---require-module), i thread worker figlio possono ereditare gli script precaricati tramite l'ereditarietà di `process.execArgv`. Vedere [la documentazione di `Worker`](/it/nodejs/api/worker_threads#new-workerfilename-options) per i dettagli.

Negli hook sincroni, gli utenti possono aspettarsi che `console.log()` venga completato nello stesso modo in cui si aspettano che `console.log()` nel codice del modulo venga completato.

#### Convenzioni degli hook {#conventions-of-hooks}

Gli hook fanno parte di una [catena](/it/nodejs/api/module#chaining), anche se quella catena è costituita da un solo hook personalizzato (fornito dall'utente) e dall'hook predefinito, che è sempre presente. Le funzioni hook sono nidificate: ognuna deve sempre restituire un oggetto semplice e l'incatenamento avviene come risultato di ogni funzione che chiama `next\<hookName\>()`, che è un riferimento all'hook del loader successivo (in ordine LIFO).

Un hook che restituisce un valore privo di una proprietà richiesta genera un'eccezione. Un hook che restituisce senza chiamare `next\<hookName\>()` *e* senza restituire `shortCircuit: true` genera anche un'eccezione. Questi errori servono a prevenire interruzioni involontarie nella catena. Restituire `shortCircuit: true` da un hook per segnalare che la catena termina intenzionalmente nel tuo hook.


#### `initialize()` {#initialize}

**Aggiunto in: v20.6.0, v18.19.0**

::: warning [Stable: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Release candidate
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) I dati da `register(loader, import.meta.url, { data })`.

L'hook `initialize` è accettato solo da [`register`](/it/nodejs/api/module#moduleregisterspecifier-parenturl-options). `registerHooks()` non lo supporta né ne ha bisogno, poiché l'inizializzazione eseguita per gli hook sincroni può essere eseguita direttamente prima della chiamata a `registerHooks()`.

L'hook `initialize` fornisce un modo per definire una funzione personalizzata che viene eseguita nel thread degli hook quando il modulo degli hook viene inizializzato. L'inizializzazione avviene quando il modulo degli hook viene registrato tramite [`register`](/it/nodejs/api/module#moduleregisterspecifier-parenturl-options).

Questo hook può ricevere dati da una chiamata a [`register`](/it/nodejs/api/module#moduleregisterspecifier-parenturl-options), incluse porte e altri oggetti trasferibili. Il valore di ritorno di `initialize` può essere un [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), nel qual caso sarà atteso prima che l'esecuzione del thread dell'applicazione principale riprenda.

Codice di personalizzazione del modulo:

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
Codice del chiamante:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Questo esempio mostra come un canale di messaggi può essere utilizzato per comunicare
// tra il thread principale (dell'applicazione) e gli hook in esecuzione sul thread degli hook,
// inviando `port2` all'hook `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Questo esempio mostra come un canale di messaggi può essere utilizzato per comunicare
// tra il thread principale (dell'applicazione) e gli hook in esecuzione sul thread degli hook,
// inviando `port2` all'hook `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Aggiunto il supporto per gli hook sincroni e in-thread. |
| v21.0.0, v20.10.0, v18.19.0 | La proprietà `context.importAssertions` è stata sostituita con `context.importAttributes`. L'utilizzo del vecchio nome è ancora supportato e genererà un avviso sperimentale. |
| v18.6.0, v16.17.0 | Aggiunto il supporto per il concatenamento di hook resolve. Ogni hook deve chiamare `nextResolve()` o includere una proprietà `shortCircuit` impostata su `true` nel suo ritorno. |
| v17.1.0, v16.14.0 | Aggiunto il supporto per le asserzioni di importazione. |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato al rilascio (versione asincrona) Stabilità: 1.1 - Sviluppo attivo (versione sincrona)
:::

- `specifier` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `conditions` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Condizioni di esportazione del `package.json` rilevante
    - `importAttributes` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto le cui coppie chiave-valore rappresentano gli attributi per il modulo da importare
    - `parentURL` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il modulo che importa questo, o undefined se questo è il punto di ingresso di Node.js
  
 
- `nextResolve` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'hook `resolve` successivo nella catena, o l'hook `resolve` predefinito di Node.js dopo l'ultimo hook `resolve` fornito dall'utente 
    - `specifier` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La versione asincrona accetta sia un oggetto contenente le seguenti proprietà, sia una `Promise` che si risolverà in tale oggetto. La versione sincrona accetta solo un oggetto restituito in modo sincrono. 
    - `format` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un suggerimento per l'hook di caricamento (potrebbe essere ignorato) `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Gli attributi di importazione da utilizzare durante la memorizzazione nella cache del modulo (opzionale; se escluso, verrà utilizzato l'input)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un segnale che indica che questo hook intende terminare la catena di hook `resolve`. **Predefinito:** `false`
    - `url` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL assoluto a cui questo input si risolve
  
 

La catena di hook `resolve` è responsabile di comunicare a Node.js dove trovare e come memorizzare nella cache una determinata istruzione o espressione `import` o una chiamata `require`. Può opzionalmente restituire un formato (come `'module'`) come suggerimento per l'hook `load`. Se viene specificato un formato, l'hook `load` è in definitiva responsabile della fornitura del valore `format` finale (ed è libero di ignorare il suggerimento fornito da `resolve`); se `resolve` fornisce un `format`, è richiesto un hook `load` personalizzato anche solo per passare il valore all'hook `load` predefinito di Node.js.

Gli attributi del tipo di importazione fanno parte della chiave della cache per il salvataggio dei moduli caricati nella cache interna dei moduli. L'hook `resolve` è responsabile della restituzione di un oggetto `importAttributes` se il modulo deve essere memorizzato nella cache con attributi diversi da quelli presenti nel codice sorgente.

La proprietà `conditions` in `context` è un array di condizioni che verranno utilizzate per abbinare le [condizioni di esportazione del pacchetto](/it/nodejs/api/packages#conditional-exports) per questa richiesta di risoluzione. Possono essere utilizzate per cercare mappature condizionali altrove o per modificare l'elenco quando si chiama la logica di risoluzione predefinita.

Le attuali [condizioni di esportazione del pacchetto](/it/nodejs/api/packages#conditional-exports) sono sempre nell'array `context.conditions` passato all'hook. Per garantire il *comportamento di risoluzione dello specificatore di modulo Node.js predefinito* quando si chiama `defaultResolve`, l'array `context.conditions` passato ad esso *deve* includere *tutti* gli elementi dell'array `context.conditions` originariamente passato all'hook `resolve`.

```js [ESM]
// Versione asincrona accettata da module.register().
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // Alcune condizioni.
    // Per alcuni o tutti gli identificatori, esegui una logica personalizzata per la risoluzione.
    // Restituisci sempre un oggetto della forma {url: <stringa>}.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // Un'altra condizione.
    // Quando si chiama `defaultResolve`, gli argomenti possono essere modificati. In questo
    // caso, sta aggiungendo un altro valore per la corrispondenza delle esportazioni condizionali.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // Rimanda all'hook successivo nella catena, che sarebbe il
  // risoluzione predefinita di Node.js se questo è l'ultimo caricatore specificato dall'utente.
  return nextResolve(specifier);
}
```
```js [ESM]
// Versione sincrona accettata da module.registerHooks().
function resolve(specifier, context, nextResolve) {
  // Simile alla resolve() asincrona sopra, poiché quella non ha
  // qualsiasi logica asincrona.
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Aggiunto il supporto per la versione sincrona e in-thread. |
| v20.6.0 | Aggiunto il supporto per `source` con formato `commonjs`. |
| v18.6.0, v16.17.0 | Aggiunto il supporto per il concatenamento degli hook di caricamento. Ogni hook deve chiamare `nextLoad()` o includere una proprietà `shortCircuit` impostata su `true` nel suo ritorno. |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato al rilascio (versione asincrona) Stabilità: 1.1 - Sviluppo attivo (versione sincrona)
:::

- `url` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL restituito dalla catena `resolve`
- `context` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `conditions` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Condizioni di esportazione del relativo `package.json`
    - `format` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il formato opzionalmente fornito dalla catena di hook `resolve`
    - `importAttributes` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- `nextLoad` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'hook `load` successivo nella catena, o l'hook `load` predefinito di Node.js dopo l'ultimo hook `load` fornito dall'utente.
    - `url` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La versione asincrona accetta un oggetto contenente le seguenti proprietà o una `Promise` che si risolverà in tale oggetto. La versione sincrona accetta solo un oggetto restituito in modo sincrono. 
    - `format` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un segnale che indica che questo hook intende terminare la catena di hook `load`. **Predefinito:** `false`
    - `source` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) L'origine per Node.js da valutare
  
 

L'hook `load` fornisce un modo per definire un metodo personalizzato per determinare come un URL deve essere interpretato, recuperato e analizzato. È anche responsabile della convalida degli attributi di importazione.

Il valore finale di `format` deve essere uno dei seguenti:

| `format` | Descrizione | Tipi accettabili per `source` restituito da `load` |
| --- | --- | --- |
| `'builtin'` | Carica un modulo integrato di Node.js | Non applicabile |
| `'commonjs'` | Carica un modulo CommonJS di Node.js | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) , `null` , `undefined` } |
| `'json'` | Carica un file JSON | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | Carica un modulo ES | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | Carica un modulo WebAssembly | { [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
Il valore di `source` viene ignorato per il tipo `'builtin'` perché attualmente non è possibile sostituire il valore di un modulo integrato (core) di Node.js.


##### Avvertenza nell'hook asincrono `load` {#caveat-in-the-asynchronous-load-hook}

Quando si utilizza l'hook asincrono `load`, omettere vs fornire un `source` per `'commonjs'` ha effetti molto diversi:

- Quando viene fornito un `source`, tutte le chiamate `require` da questo modulo saranno elaborate dal caricatore ESM con gli hook `resolve` e `load` registrati; tutte le chiamate `require.resolve` da questo modulo saranno elaborate dal caricatore ESM con gli hook `resolve` registrati; sarà disponibile solo un sottoinsieme dell'API CommonJS (ad es. niente `require.extensions`, niente `require.cache`, niente `require.resolve.paths`) e le modifiche tramite monkey-patching sul caricatore di moduli CommonJS non verranno applicate.
- Se `source` è `undefined` o `null`, verrà gestito dal caricatore di moduli CommonJS e le chiamate `require`/`require.resolve` non passeranno attraverso gli hook registrati. Questo comportamento per `source` nullo è temporaneo — in futuro, `source` nullo non sarà supportato.

Queste avvertenze non si applicano all'hook sincrono `load`, nel qual caso l'insieme completo di API CommonJS disponibili per i moduli CommonJS personalizzati e `require`/`require.resolve` passano sempre attraverso gli hook registrati.

L'implementazione interna asincrona `load` di Node.js, che è il valore di `next` per l'ultimo hook nella catena `load`, restituisce `null` per `source` quando `format` è `'commonjs'` per compatibilità con le versioni precedenti. Ecco un esempio di hook che opterebbe per l'utilizzo del comportamento non predefinito:

```js [ESM]
import { readFile } from 'node:fs/promises';

// Versione asincrona accettata da module.register(). Questa correzione non è necessaria
// per la versione sincrona accettata da module.registerSync().
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
Questo non si applica neanche all'hook sincrono `load`, nel qual caso il `source` restituito contiene il codice sorgente caricato dall'hook successivo, indipendentemente dal formato del modulo.

- L'oggetto [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) specifico è un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).
- L'oggetto [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) specifico è un [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

Se il valore sorgente di un formato basato su testo (cioè `'json'`, `'module'`) non è una stringa, viene convertito in una stringa utilizzando [`util.TextDecoder`](/it/nodejs/api/util#class-utiltextdecoder).

L'hook `load` fornisce un modo per definire un metodo personalizzato per recuperare il codice sorgente di un URL risolto. Ciò consentirebbe a un caricatore di evitare potenzialmente la lettura di file dal disco. Potrebbe anche essere utilizzato per mappare un formato non riconosciuto a uno supportato, ad esempio `yaml` a `module`.

```js [ESM]
// Versione asincrona accettata da module.register().
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // Alcune condizioni
    /*
      Per alcuni o tutti gli URL, eseguire una logica personalizzata per il recupero dell'origine.
      Restituire sempre un oggetto della forma {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // Rimanda all'hook successivo nella catena.
  return nextLoad(url);
}
```
```js [ESM]
// Versione sincrona accettata da module.registerHooks().
function load(url, context, nextLoad) {
  // Simile al load() asincrono sopra, poiché questo non ha
  // alcuna logica asincrona.
}
```
In uno scenario più avanzato, questo può anche essere utilizzato per trasformare un'origine non supportata in una supportata (vedi [Esempi](/it/nodejs/api/module#examples) sotto).


### Esempi {#examples}

I vari hook di personalizzazione del modulo possono essere utilizzati insieme per ottenere ampie personalizzazioni dei comportamenti di caricamento e valutazione del codice di Node.js.

#### Importazione da HTTPS {#import-from-https}

L'hook seguente registra hook per abilitare il supporto rudimentale per tali identificatori. Sebbene questo possa sembrare un miglioramento significativo della funzionalità principale di Node.js, ci sono notevoli svantaggi nell'utilizzo effettivo di questi hook: le prestazioni sono molto più lente rispetto al caricamento di file dal disco, non c'è memorizzazione nella cache e non c'è sicurezza.

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // Per caricare JavaScript sulla rete, dobbiamo recuperarlo e
  // restituirlo.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // Questo esempio presuppone che tutto il codice JavaScript fornito dalla rete sia codice
          // del modulo ES.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Lascia che Node.js gestisca tutti gli altri URL.
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
Con il modulo di hook precedente, l'esecuzione di `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` stampa la versione corrente di CoffeeScript per il modulo all'URL in `main.mjs`.

#### Transpilazione {#transpilation}

Le sorgenti che sono in formati che Node.js non capisce possono essere convertite in JavaScript usando l'[`hook load`](/it/nodejs/api/module#loadurl-context-nextload).

Questo è meno performante della transpilazione dei file di origine prima di eseguire Node.js; gli hook del transpiler dovrebbero essere usati solo per scopi di sviluppo e test.


##### Versione asincrona {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // I file CoffeeScript possono essere sia CommonJS che moduli ES, quindi vogliamo che
    // qualsiasi file CoffeeScript venga trattato da Node.js allo stesso modo di un file .js
    // nella stessa posizione. Per determinare come Node.js interpreterebbe un file .js arbitrario,
    // cerca nel file system il file package.json padre più vicino
    // e leggi il suo campo "type".
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // Questo hook converte il codice sorgente CoffeeScript in codice sorgente JavaScript
    // per tutti i file CoffeeScript importati.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Lascia che Node.js gestisca tutti gli altri URL.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` è solo un percorso di file durante la prima iterazione quando viene passato
  // l'URL risolto dall'hook load()
  // un percorso di file effettivo da load() conterrà un'estensione di file poiché è
  // richiesto dalle specifiche
  // questo semplice controllo di verità per verificare se `url` contiene un'estensione di file
  // funzionerà per la maggior parte dei progetti, ma non copre alcuni casi limite (come
  // file senza estensione o un URL che termina con uno spazio finale)
  const isFilePath = !!extname(url);
  // Se è un percorso di file, ottieni la directory in cui si trova
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // Componi un percorso di file a un package.json nella stessa directory,
  // che potrebbe esistere o meno
  const packagePath = resolvePath(dir, 'package.json');
  // Prova a leggere il package.json possibilmente inesistente
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // Se package.json esisteva e conteneva un campo `type` con un valore, voilà
  if (type) return type;
  // Altrimenti, (se non alla radice) continua a controllare la directory successiva
  // Se alla radice, fermati e restituisci false
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### Versione sincrona {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### Esecuzione degli hook {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
Con i precedenti moduli degli hook, l'esecuzione di `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` o `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` fa sì che `main.coffee` venga trasformato in JavaScript dopo che il suo codice sorgente è stato caricato dal disco ma prima che Node.js lo esegua; e così via per tutti i file `.coffee`, `.litcoffee` o `.coffee.md` a cui si fa riferimento tramite istruzioni `import` di qualsiasi file caricato.


#### Mappe di importazione {#import-maps}

I due esempi precedenti definivano hook `load`. Questo è un esempio di un hook `resolve`. Questo modulo di hook legge un file `import-map.json` che definisce quali specificatori sovrascrivere ad altri URL (questa è un'implementazione molto semplicistica di un piccolo sottoinsieme della specifica "mappe di importazione").

##### Versione asincrona {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### Versione sincrona {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### Utilizzo degli hook {#using-the-hooks}

Con questi file:

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
Eseguendo `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` o `node --import ./import-map-sync-hooks.js main.js` dovrebbe stampare `some module!`.

## Supporto per Source map v3 {#source-map-v3-support}

**Aggiunto in: v13.7.0, v12.17.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Helper per interagire con la cache delle source map. Questa cache viene popolata quando l'analisi delle source map è abilitata e le [direttive di inclusione delle source map](https://sourcemaps.info/spec#h.lmz475t4mvbx) vengono trovate nel footer di un modulo.

Per abilitare l'analisi delle source map, Node.js deve essere eseguito con il flag [`--enable-source-maps`](/it/nodejs/api/cli#--enable-source-maps) o con la code coverage abilitata impostando [`NODE_V8_COVERAGE=dir`](/it/nodejs/api/cli#node_v8_coveragedir).

::: code-group
```js [ESM]
// module.mjs
// In un modulo ECMAScript
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// In un modulo CommonJS
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**Aggiunto in: v13.7.0, v12.17.0**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<module.SourceMap\>](/it/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Restituisce `module.SourceMap` se viene trovata una source map, `undefined` altrimenti.

`path` è il percorso risolto per il file per il quale deve essere recuperata una source map corrispondente.

### Classe: `module.SourceMap` {#class-modulesourcemap}

**Aggiunto in: v13.7.0, v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<numero[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Crea una nuova istanza di `sourceMap`.

`payload` è un oggetto con chiavi corrispondenti al [formato Source map v3](https://sourcemaps.info/spec#h.mofvlxcwqzej):

- `file`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` è un array opzionale della lunghezza di ogni riga nel codice generato.

#### `sourceMap.payload` {#sourcemappayload}

- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Getter per il payload utilizzato per costruire l'istanza [`SourceMap`](/it/nodejs/api/module#class-modulesourcemap).


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset del numero di riga a base zero nel sorgente generato
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset del numero di colonna a base zero nel sorgente generato
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dato un offset di riga e un offset di colonna nel file sorgente generato, restituisce un oggetto che rappresenta l'intervallo SourceMap nel file originale, se trovato, oppure un oggetto vuoto in caso contrario.

L'oggetto restituito contiene le seguenti chiavi:

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset di riga dell'inizio dell'intervallo nel sorgente generato
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset di colonna dell'inizio dell'intervallo nel sorgente generato
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del file della sorgente originale, come riportato nella SourceMap
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset di riga dell'inizio dell'intervallo nella sorgente originale
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset di colonna dell'inizio dell'intervallo nella sorgente originale
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il valore restituito rappresenta l'intervallo raw così come appare nella SourceMap, basato su offset a base zero, *non* su numeri di riga e colonna a base 1 come appaiono nei messaggi di errore e negli oggetti CallSite.

Per ottenere i numeri di riga e colonna corrispondenti a base 1 da un lineNumber e columnNumber come riportato dagli stack di Error e dagli oggetti CallSite, utilizzare `sourceMap.findOrigin(lineNumber, columnNumber)`


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di riga in base 1 del sito di chiamata nella sorgente generata
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di colonna in base 1 del sito di chiamata nella sorgente generata
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dato un `lineNumber` e un `columnNumber` in base 1 da un sito di chiamata nella sorgente generata, trova la posizione corrispondente del sito di chiamata nella sorgente originale.

Se `lineNumber` e `columnNumber` forniti non vengono trovati in nessuna source map, viene restituito un oggetto vuoto. Altrimenti, l'oggetto restituito contiene le seguenti chiavi:

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Il nome dell'intervallo nella source map, se ne è stato fornito uno
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del file della sorgente originale, come riportato nella SourceMap
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il lineNumber in base 1 del sito di chiamata corrispondente nella sorgente originale
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il columnNumber in base 1 del sito di chiamata corrispondente nella sorgente originale

