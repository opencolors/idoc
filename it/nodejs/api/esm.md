---
title: Moduli ECMAScript in Node.js
description: Questa pagina fornisce una documentazione dettagliata su come utilizzare i moduli ECMAScript (ESM) in Node.js, inclusa la risoluzione dei moduli, la sintassi di importazione ed esportazione, e la compatibilità con CommonJS.
head:
  - - meta
    - name: og:title
      content: Moduli ECMAScript in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa pagina fornisce una documentazione dettagliata su come utilizzare i moduli ECMAScript (ESM) in Node.js, inclusa la risoluzione dei moduli, la sintassi di importazione ed esportazione, e la compatibilità con CommonJS.
  - - meta
    - name: twitter:title
      content: Moduli ECMAScript in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa pagina fornisce una documentazione dettagliata su come utilizzare i moduli ECMAScript (ESM) in Node.js, inclusa la risoluzione dei moduli, la sintassi di importazione ed esportazione, e la compatibilità con CommonJS.
---


# Moduli: Moduli ECMAScript {#modules-ecmascript-modules}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.1.0 | Gli attributi di importazione non sono più sperimentali. |
| v22.0.0 | Rimossa il supporto per le asserzioni di importazione. |
| v21.0.0, v20.10.0, v18.20.0 | Aggiunto supporto sperimentale per gli attributi di importazione. |
| v20.0.0, v18.19.0 | Gli hook di personalizzazione dei moduli vengono eseguiti al di fuori del thread principale. |
| v18.6.0, v16.17.0 | Aggiunto supporto per il concatenamento di hook di personalizzazione dei moduli. |
| v17.1.0, v16.14.0 | Aggiunto supporto sperimentale per le asserzioni di importazione. |
| v17.0.0, v16.12.0 | Consolidati gli hook di personalizzazione, rimossi gli hook `getFormat`, `getSource`, `transformSource` e `getGlobalPreloadCode` aggiunti gli hook `load` e `globalPreload` che consentono di restituire `format` da entrambi gli hook `resolve` o `load`. |
| v14.8.0 | Rimosso il flag Top-Level Await. |
| v15.3.0, v14.17.0, v12.22.0 | Stabilizzata l'implementazione dei moduli. |
| v14.13.0, v12.20.0 | Supporto per il rilevamento delle esportazioni denominate CommonJS. |
| v14.0.0, v13.14.0, v12.20.0 | Rimosso l'avviso sui moduli sperimentali. |
| v13.2.0, v12.17.0 | Il caricamento dei moduli ECMAScript non richiede più un flag da riga di comando. |
| v12.0.0 | Aggiunto supporto per i moduli ES che utilizzano l'estensione del file `.js` tramite il campo `"type"` di `package.json`. |
| v8.5.0 | Aggiunto in: v8.5.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

## Introduzione {#introduction}

I moduli ECMAScript sono [il formato standard ufficiale](https://tc39.github.io/ecma262/#sec-modules) per confezionare il codice JavaScript per il riutilizzo. I moduli sono definiti utilizzando una varietà di istruzioni [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) e [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

Il seguente esempio di un modulo ES esporta una funzione:

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
Il seguente esempio di un modulo ES importa la funzione da `addTwo.mjs`:

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// Stampa: 6
console.log(addTwo(4));
```
Node.js supporta completamente i moduli ECMAScript così come sono attualmente specificati e fornisce interoperabilità tra essi e il suo formato di modulo originale, [CommonJS](/it/nodejs/api/modules).


## Abilitazione {#enabling}

Node.js ha due sistemi di moduli: moduli [CommonJS](/it/nodejs/api/modules) e moduli ECMAScript.

Gli autori possono indicare a Node.js di interpretare JavaScript come un modulo ES tramite l'estensione del file `.mjs`, il campo [`"type"`](/it/nodejs/api/packages#type) in `package.json` con il valore `"module"` o il flag [`--input-type`](/it/nodejs/api/cli#--input-typetype) con il valore `"module"`. Questi sono indicatori espliciti che il codice è destinato a essere eseguito come un modulo ES.

Viceversa, gli autori possono indicare esplicitamente a Node.js di interpretare JavaScript come CommonJS tramite l'estensione del file `.cjs`, il campo [`"type"`](/it/nodejs/api/packages#type) in `package.json` con il valore `"commonjs"` o il flag [`--input-type`](/it/nodejs/api/cli#--input-typetype) con il valore `"commonjs"`.

Quando il codice è privo di indicatori espliciti per entrambi i sistemi di moduli, Node.js ispezionerà il codice sorgente di un modulo per cercare la sintassi del modulo ES. Se tale sintassi viene trovata, Node.js eseguirà il codice come un modulo ES; altrimenti eseguirà il modulo come CommonJS. Vedi [Determinazione del sistema di moduli](/it/nodejs/api/packages#determining-module-system) per maggiori dettagli.

## Pacchetti {#packages}

Questa sezione è stata spostata a [Moduli: Pacchetti](/it/nodejs/api/packages).

## Specificatori `import` {#import-specifiers}

### Terminologia {#terminology}

Lo *specificatore* di un'istruzione `import` è la stringa dopo la parola chiave `from`, ad esempio `'node:path'` in `import { sep } from 'node:path'`. Gli specificatori vengono utilizzati anche nelle istruzioni `export from` e come argomento per un'espressione `import()`.

Esistono tre tipi di specificatori:

-  *Specificatori relativi* come `'./startup.js'` o `'../config.mjs'`. Si riferiscono a un percorso relativo alla posizione del file di importazione. *L'estensione del file è sempre necessaria per questi.*
-  *Specificatori nudi* come `'some-package'` o `'some-package/shuffle'`. Possono fare riferimento al punto di ingresso principale di un pacchetto tramite il nome del pacchetto o a un modulo di funzionalità specifico all'interno di un pacchetto preceduto dal nome del pacchetto come negli esempi rispettivamente. *L'inclusione dell'estensione del file è necessaria solo per i pacchetti senza un campo <a href="packages.html#exports"><code>"exports"</code></a>.*
-  *Specificatori assoluti* come `'file:///opt/nodejs/config.js'`. Si riferiscono direttamente ed esplicitamente a un percorso completo.

La risoluzione degli specificatori nudi è gestita dall'[algoritmo di risoluzione e caricamento dei moduli di Node.js](/it/nodejs/api/esm#resolution-algorithm-specification). Tutte le altre risoluzioni degli specificatori vengono sempre risolte solo con la semantica standard di risoluzione [URL](https://url.spec.whatwg.org/) relativa.

Come in CommonJS, è possibile accedere ai file dei moduli all'interno dei pacchetti aggiungendo un percorso al nome del pacchetto a meno che il [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) del pacchetto non contenga un campo [`"exports"`](/it/nodejs/api/packages#exports), nel qual caso è possibile accedere ai file all'interno dei pacchetti solo tramite i percorsi definiti in [`"exports"`](/it/nodejs/api/packages#exports).

Per i dettagli su queste regole di risoluzione dei pacchetti che si applicano agli specificatori nudi nella risoluzione dei moduli di Node.js, consulta la [documentazione sui pacchetti](/it/nodejs/api/packages).


### Estensioni file obbligatorie {#mandatory-file-extensions}

Un'estensione file deve essere fornita quando si utilizza la parola chiave `import` per risolvere specificatori relativi o assoluti. Anche gli indici di directory (ad es. `'./startup/index.js'`) devono essere completamente specificati.

Questo comportamento corrisponde al modo in cui `import` si comporta negli ambienti browser, presumendo un server tipicamente configurato.

### URL {#urls}

I moduli ES vengono risolti e memorizzati nella cache come URL. Ciò significa che i caratteri speciali devono essere [percent-encoded](/it/nodejs/api/url#percent-encoding-in-urls), come `#` con `%23` e `?` con `%3F`.

Sono supportati gli schemi URL `file:`, `node:` e `data:`. Uno specificatore come `'https://example.com/app.js'` non è supportato nativamente in Node.js a meno che non si utilizzi un [caricatore HTTPS personalizzato](/it/nodejs/api/module#import-from-https).

#### URL `file:` {#file-urls}

I moduli vengono caricati più volte se lo specificatore `import` utilizzato per risolverli ha una query o un frammento diversi.

```js [ESM]
import './foo.mjs?query=1'; // carica ./foo.mjs con la query "?query=1"
import './foo.mjs?query=2'; // carica ./foo.mjs con la query "?query=2"
```
La radice del volume può essere referenziata tramite `/`, `//` o `file:///`. Date le differenze tra [URL](https://url.spec.whatwg.org/) e la risoluzione del percorso (come i dettagli della codifica percentuale), si consiglia di utilizzare [url.pathToFileURL](/it/nodejs/api/url#urlpathtofileurlpath-options) quando si importa un percorso.

#### Importazioni `data:` {#data-imports}

**Aggiunto in: v12.10.0**

Gli [`URL data:`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) sono supportati per l'importazione con i seguenti tipi MIME:

- `text/javascript` per i moduli ES
- `application/json` per JSON
- `application/wasm` per Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```
Gli URL `data:` risolvono solo gli [specificatori nudi](/it/nodejs/api/esm#terminology) per i moduli incorporati e gli [specificatori assoluti](/it/nodejs/api/esm#terminology). La risoluzione degli [specificatori relativi](/it/nodejs/api/esm#terminology) non funziona perché `data:` non è uno [schema speciale](https://url.spec.whatwg.org/#special-scheme). Ad esempio, il tentativo di caricare `./foo` da `data:text/javascript,import "./foo";` non riesce a risolvere perché non esiste un concetto di risoluzione relativa per gli URL `data:`.


#### `node:` importazioni {#node-imports}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0, v14.18.0 | Aggiunto il supporto `node:` per l'importazione in `require(...)`. |
| v14.13.1, v12.20.0 | Aggiunto in: v14.13.1, v12.20.0 |
:::

Gli URL `node:` sono supportati come mezzo alternativo per caricare i moduli integrati di Node.js. Questo schema URL consente di fare riferimento ai moduli integrati tramite stringhe URL assolute valide.

```js [ESM]
import fs from 'node:fs/promises';
```
## Attributi di importazione {#import-attributes}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | Passaggio da Asserzioni di importazione ad Attributi di importazione. |
| v17.1.0, v16.14.0 | Aggiunto in: v17.1.0, v16.14.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Gli [attributi di importazione](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) sono una sintassi inline per le istruzioni di importazione dei moduli per trasmettere maggiori informazioni insieme allo specificatore del modulo.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js supporta solo l'attributo `type`, per il quale supporta i seguenti valori:

| Attributo   `type` | Necessario per |
| --- | --- |
| `'json'` | [Moduli JSON](/it/nodejs/api/esm#json-modules) |
L'attributo `type: 'json'` è obbligatorio quando si importano moduli JSON.

## Moduli incorporati {#built-in-modules}

I [moduli incorporati](/it/nodejs/api/modules#built-in-modules) forniscono esportazioni denominate della loro API pubblica. Viene inoltre fornita un'esportazione predefinita che è il valore delle esportazioni CommonJS. L'esportazione predefinita può essere utilizzata, tra l'altro, per modificare le esportazioni denominate. Le esportazioni denominate dei moduli incorporati vengono aggiornate solo chiamando [`module.syncBuiltinESMExports()`](/it/nodejs/api/module#modulesyncbuiltinesmexports).

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## Espressioni `import()` {#import-expressions}

L'[importazione dinamica `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) è supportata sia nei moduli CommonJS che nei moduli ES. Nei moduli CommonJS può essere utilizzata per caricare moduli ES.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La meta proprietà `import.meta` è un `Object` che contiene le seguenti proprietà. È supportata solo nei moduli ES.

### `import.meta.dirname` {#importmetadirname}

**Aggiunto in: v21.2.0, v20.11.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato al rilascio
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome della directory del modulo corrente. È uguale a [`path.dirname()`](/it/nodejs/api/path#pathdirnamepath) di [`import.meta.filename`](/it/nodejs/api/esm#importmetafilename).

### `import.meta.filename` {#importmetafilename}

**Aggiunto in: v21.2.0, v20.11.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato al rilascio
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso completo assoluto e il nome del file del modulo corrente, con i collegamenti simbolici risolti.
- Questo è uguale a [`url.fileURLToPath()`](/it/nodejs/api/url#urlfileurltopathurl-options) di [`import.meta.url`](/it/nodejs/api/esm#importmetaurl).

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL `file:` assoluto del modulo.

Questo è definito esattamente come nei browser che forniscono l'URL del file del modulo corrente.

Ciò consente schemi utili come il caricamento di file relativi:

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```

### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.6.0, v18.19.0 | Non più dietro il flag CLI `--experimental-import-meta-resolve`, ad eccezione del parametro `parentURL` non standard. |
| v20.6.0, v18.19.0 | Questa API non genera più un'eccezione quando punta a URL `file:` che non corrispondono a un file esistente nel FS locale. |
| v20.0.0, v18.19.0 | Questa API ora restituisce una stringa in modo sincrono anziché una Promise. |
| v16.2.0, v14.18.0 | Aggiunto il supporto per l'oggetto WHATWG `URL` al parametro `parentURL`. |
| v13.9.0, v12.16.2 | Aggiunto in: v13.9.0, v12.16.2 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato al rilascio
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lo specificatore del modulo da risolvere rispetto al modulo corrente.
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La stringa URL assoluta a cui lo specificatore si risolverebbe.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) è una funzione di risoluzione relativa al modulo con ambito a ciascun modulo, che restituisce la stringa URL.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```

Sono supportate tutte le funzionalità della risoluzione dei moduli di Node.js. Le risoluzioni delle dipendenze sono soggette alle risoluzioni delle esportazioni consentite all'interno del pacchetto.

**Avvertenze**:

- Ciò può comportare operazioni sincrone sul file system, che possono influire sulle prestazioni in modo simile a `require.resolve`.
- Questa funzionalità non è disponibile all'interno dei loader personalizzati (creerebbe un deadlock).

**API non standard**:

Quando si utilizza il flag `--experimental-import-meta-resolve`, tale funzione accetta un secondo argomento:

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Un URL del modulo padre assoluto facoltativo da cui risolvere. **Predefinito:** `import.meta.url`


## Interoperabilità con CommonJS {#interoperability-with-commonjs}

### Istruzioni `import` {#import-statements}

Un'istruzione `import` può fare riferimento a un modulo ES o a un modulo CommonJS. Le istruzioni `import` sono consentite solo nei moduli ES, ma le espressioni dinamiche [`import()`](/it/nodejs/api/esm#import-expressions) sono supportate in CommonJS per caricare moduli ES.

Quando si importano [moduli CommonJS](/it/nodejs/api/esm#commonjs-namespaces), l'oggetto `module.exports` viene fornito come esportazione predefinita. Le esportazioni con nome possono essere disponibili, fornite dall'analisi statica come una comodità per una migliore compatibilità dell'ecosistema.

### `require` {#require}

Il modulo CommonJS `require` attualmente supporta solo il caricamento di moduli ES sincroni (ovvero, moduli ES che non utilizzano `await` di livello superiore).

Vedi [Caricamento di moduli ECMAScript tramite `require()`](/it/nodejs/api/modules#loading-ecmascript-modules-using-require) per i dettagli.

### Namespace CommonJS {#commonjs-namespaces}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Aggiunto il marcatore di esportazione `'module.exports'` ai namespace CJS. |
| v14.13.0 | Aggiunto in: v14.13.0 |
:::

I moduli CommonJS sono costituiti da un oggetto `module.exports` che può essere di qualsiasi tipo.

Per supportare ciò, quando si importa CommonJS da un modulo ECMAScript, viene costruito un wrapper namespace per il modulo CommonJS, che fornisce sempre una chiave di esportazione `default` che punta al valore `module.exports` di CommonJS.

Inoltre, viene eseguita un'analisi statica euristica sul testo sorgente del modulo CommonJS per ottenere un elenco statico di esportazioni, nel miglior modo possibile, da fornire sul namespace dai valori su `module.exports`. Ciò è necessario poiché questi namespace devono essere costruiti prima della valutazione del modulo CJS.

Questi oggetti namespace CommonJS forniscono anche l'esportazione `default` come esportazione con nome `'module.exports'`, al fine di indicare inequivocabilmente che la loro rappresentazione in CommonJS utilizza questo valore e non il valore del namespace. Ciò rispecchia la semantica della gestione del nome di esportazione `'module.exports'` nel supporto di interop [`require(esm)`](/it/nodejs/api/modules#loading-ecmascript-modules-using-require).

Quando si importa un modulo CommonJS, può essere importato in modo affidabile utilizzando l'importazione predefinita del modulo ES o la sua sintassi simile:

```js [ESM]
import { default as cjs } from 'cjs';
// Identico a quanto sopra
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Stampa:
//   <module.exports>
//   true
```
Questo oggetto esotico namespace del modulo può essere osservato direttamente quando si utilizza `import * as m from 'cjs'` o un'importazione dinamica:

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Stampa:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
Per una migliore compatibilità con l'uso esistente nell'ecosistema JS, Node.js, inoltre, tenta di determinare le esportazioni con nome CommonJS di ogni modulo CommonJS importato per fornirle come esportazioni di moduli ES separate utilizzando un processo di analisi statica.

Ad esempio, si consideri un modulo CommonJS scritto:

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
Il modulo precedente supporta le importazioni con nome nei moduli ES:

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// Stampa: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Stampa: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Stampa:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
Come si può vedere dall'ultimo esempio dell'oggetto esotico namespace del modulo che viene registrato, l'esportazione `name` viene copiata dall'oggetto `module.exports` e impostata direttamente sul namespace del modulo ES quando il modulo viene importato.

Gli aggiornamenti live binding o le nuove esportazioni aggiunte a `module.exports` non vengono rilevati per queste esportazioni con nome.

Il rilevamento delle esportazioni con nome si basa su modelli di sintassi comuni ma non rileva sempre correttamente le esportazioni con nome. In questi casi, l'utilizzo del modulo di importazione predefinito descritto sopra può essere un'opzione migliore.

Il rilevamento delle esportazioni con nome copre molti modelli di esportazione comuni, modelli di riesportazione e output di strumenti di compilazione e transpiler. Vedere [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2) per la semantica esatta implementata.


### Differenze tra i moduli ES e CommonJS {#differences-between-es-modules-and-commonjs}

#### Nessun `require`, `exports` o `module.exports` {#no-require-exports-or-moduleexports}

Nella maggior parte dei casi, l'`import` del modulo ES può essere utilizzato per caricare i moduli CommonJS.

Se necessario, una funzione `require` può essere creata all'interno di un modulo ES utilizzando [`module.createRequire()`](/it/nodejs/api/module#modulecreaterequirefilename).

#### Nessun `__filename` o `__dirname` {#no-__filename-or-__dirname}

Queste variabili CommonJS non sono disponibili nei moduli ES.

I casi d'uso di `__filename` e `__dirname` possono essere replicati tramite [`import.meta.filename`](/it/nodejs/api/esm#importmetafilename) e [`import.meta.dirname`](/it/nodejs/api/esm#importmetadirname).

#### Nessun caricamento di Addon {#no-addon-loading}

Gli [Addon](/it/nodejs/api/addons) non sono attualmente supportati con gli import dei moduli ES.

Possono invece essere caricati con [`module.createRequire()`](/it/nodejs/api/module#modulecreaterequirefilename) o [`process.dlopen`](/it/nodejs/api/process#processdlopenmodule-filename-flags).

#### Nessun `require.resolve` {#no-requireresolve}

La risoluzione relativa può essere gestita tramite `new URL('./local', import.meta.url)`.

Per una sostituzione completa di `require.resolve`, esiste l'API [import.meta.resolve](/it/nodejs/api/esm#importmetaresolvespecifier).

In alternativa, è possibile utilizzare `module.createRequire()`.

#### Nessun `NODE_PATH` {#no-node_path}

`NODE_PATH` non fa parte della risoluzione degli specificatori `import`. Si prega di utilizzare i collegamenti simbolici se si desidera questo comportamento.

#### Nessun `require.extensions` {#no-requireextensions}

`require.extensions` non viene utilizzato da `import`. Gli hook di personalizzazione dei moduli possono fornire una sostituzione.

#### Nessun `require.cache` {#no-requirecache}

`require.cache` non viene utilizzato da `import` poiché il caricatore di moduli ES ha la propria cache separata.

## Moduli JSON {#json-modules}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.1.0 | I moduli JSON non sono più sperimentali. |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

I file JSON possono essere referenziati da `import`:

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
La sintassi `with { type: 'json' }` è obbligatoria; vedere [Attributi di importazione](/it/nodejs/api/esm#import-attributes).

Il JSON importato espone solo un export `default`. Non è previsto il supporto per gli export con nome. Viene creata una voce della cache nella cache CommonJS per evitare duplicazioni. Lo stesso oggetto viene restituito in CommonJS se il modulo JSON è già stato importato dallo stesso percorso.


## Moduli Wasm {#wasm-modules}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

L'importazione di moduli WebAssembly è supportata tramite il flag `--experimental-wasm-modules`, consentendo l'importazione di qualsiasi file `.wasm` come normali moduli, supportando al contempo le loro importazioni di moduli.

Questa integrazione è in linea con la [Proposta di integrazione del modulo ES per WebAssembly](https://github.com/webassembly/esm-integration).

Ad esempio, un `index.mjs` contenente:

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
eseguito sotto:

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
fornirebbe l'interfaccia di esportazione per l'instanziazione di `module.wasm`.

## `await` di livello superiore {#top-level-await}

**Aggiunto in: v14.8.0**

La parola chiave `await` può essere utilizzata nel corpo di primo livello di un modulo ECMAScript.

Supponendo un `a.mjs` con

```js [ESM]
export const five = await Promise.resolve(5);
```
E un `b.mjs` con

```js [ESM]
import { five } from './a.mjs';

console.log(five); // Registra `5`
```
```bash [BASH]
node b.mjs # funziona
```
Se un'espressione `await` di livello superiore non si risolve mai, il processo `node` si chiuderà con un [codice di stato](/it/nodejs/api/process#exit-codes) `13`.

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Promessa che non si risolve mai:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Registra `13`
});
```
## Caricatori {#loaders}

La precedente documentazione sui Loader è ora disponibile in [Moduli: Hook di personalizzazione](/it/nodejs/api/module#customization-hooks).

## Algoritmo di risoluzione e caricamento {#resolution-and-loading-algorithm}

### Caratteristiche {#features}

Il resolver predefinito ha le seguenti proprietà:

- Risoluzione basata su FileURL come utilizzato dai moduli ES
- Risoluzione URL relativa e assoluta
- Nessuna estensione predefinita
- Nessun main della cartella
- Ricerca di risoluzione del pacchetto di specifier nudo tramite node_modules
- Non fallisce su estensioni o protocolli sconosciuti
- Può opzionalmente fornire un suggerimento del formato alla fase di caricamento

Il loader predefinito ha le seguenti proprietà

- Supporto per il caricamento di moduli integrati tramite URL `node:`
- Supporto per il caricamento di moduli "inline" tramite URL `data:`
- Supporto per il caricamento di moduli `file:`
- Fallisce su qualsiasi altro protocollo URL
- Fallisce su estensioni sconosciute per il caricamento `file:` (supporta solo `.cjs`, `.js` e `.mjs`)


### Algoritmo di risoluzione {#resolution-algorithm}

L'algoritmo per caricare uno specificatore di modulo ES è fornito tramite il metodo **ESM_RESOLVE** di seguito. Restituisce l'URL risolto per uno specificatore di modulo relativo a un parentURL.

L'algoritmo di risoluzione determina l'URL risolto completo per un caricamento del modulo, insieme al suo formato di modulo suggerito. L'algoritmo di risoluzione non determina se il protocollo URL risolto può essere caricato o se le estensioni dei file sono consentite, invece queste validazioni vengono applicate da Node.js durante la fase di caricamento (ad esempio, se è stato richiesto di caricare un URL che ha un protocollo diverso da `file:`, `data:` o `node:`).

L'algoritmo cerca anche di determinare il formato del file in base all'estensione (vedere l'algoritmo `ESM_FILE_FORMAT` di seguito). Se non riconosce l'estensione del file (ad esempio, se non è `.mjs`, `.cjs` o `.json`), viene restituito un formato `undefined`, che genererà un'eccezione durante la fase di caricamento.

L'algoritmo per determinare il formato del modulo di un URL risolto è fornito da **ESM_FILE_FORMAT**, che restituisce il formato del modulo univoco per qualsiasi file. Il formato *"module"* viene restituito per un modulo ECMAScript, mentre il formato *"commonjs"* viene utilizzato per indicare il caricamento tramite il loader CommonJS legacy. Formati aggiuntivi come *"addon"* possono essere estesi in aggiornamenti futuri.

Nei seguenti algoritmi, tutti gli errori delle subroutine vengono propagati come errori di queste routine di livello superiore, salvo diversa indicazione.

*defaultConditions* è l'array del nome dell'ambiente condizionale, `["node", "import"]`.

Il resolver può generare i seguenti errori:

- *Invalid Module Specifier*: Lo specificatore del modulo è un URL, un nome di pacchetto o uno specificatore di sottopercorso di pacchetto non valido.
- *Invalid Package Configuration*: La configurazione di package.json non è valida o contiene una configurazione non valida.
- *Invalid Package Target*: Le esportazioni o le importazioni del pacchetto definiscono un modulo di destinazione per il pacchetto che è un tipo o una destinazione stringa non valida.
- *Package Path Not Exported*: Le esportazioni del pacchetto non definiscono o non consentono un sottopercorso di destinazione nel pacchetto per il modulo specificato.
- *Package Import Not Defined*: Le importazioni del pacchetto non definiscono lo specificatore.
- *Module Not Found*: Il pacchetto o il modulo richiesto non esiste.
- *Unsupported Directory Import*: Il percorso risolto corrisponde a una directory, che non è una destinazione supportata per le importazioni di moduli.


### Specifiche dell'Algoritmo di Risoluzione {#resolution-algorithm-specification}

**ESM_RESOLVE**(*specifier*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*specifier*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### Personalizzazione dell'algoritmo di risoluzione degli specificatori ESM {#customizing-esm-specifier-resolution-algorithm}

Gli [hook di personalizzazione dei moduli](/it/nodejs/api/module#customization-hooks) forniscono un meccanismo per personalizzare l'algoritmo di risoluzione degli specificatori ESM. Un esempio che fornisce la risoluzione in stile CommonJS per gli specificatori ESM è [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader).

