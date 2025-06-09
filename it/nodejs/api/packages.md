---
title: Documentazione sui Pacchetti di Node.js
description: Esplora la documentazione ufficiale di Node.js sui pacchetti, inclusi come gestirli, crearli e pubblicarli, con dettagli su package.json, dipendenze e strumenti di gestione dei pacchetti.
head:
  - - meta
    - name: og:title
      content: Documentazione sui Pacchetti di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esplora la documentazione ufficiale di Node.js sui pacchetti, inclusi come gestirli, crearli e pubblicarli, con dettagli su package.json, dipendenze e strumenti di gestione dei pacchetti.
  - - meta
    - name: twitter:title
      content: Documentazione sui Pacchetti di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esplora la documentazione ufficiale di Node.js sui pacchetti, inclusi come gestirli, crearli e pubblicarli, con dettagli su package.json, dipendenze e strumenti di gestione dei pacchetti.
---


# Moduli: Pacchetti {#modules-packages}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.13.0, v12.20.0 | Aggiunto il supporto per i pattern `"exports"`. |
| v14.6.0, v12.19.0 | Aggiunto il campo `"imports"` del pacchetto. |
| v13.7.0, v12.17.0 | Rimosse le flag per le esportazioni condizionali. |
| v13.7.0, v12.16.0 | Rimossa l'opzione `--experimental-conditional-exports`. Nella versione 12.16.0, le esportazioni condizionali sono ancora dietro `--experimental-modules`. |
| v13.6.0, v12.16.0 | Rimossa la flag per l'auto-referenziazione di un pacchetto tramite il suo nome. |
| v12.7.0 | Introdotto il campo `"exports"` in `package.json` come alternativa più potente al classico campo `"main"`. |
| v12.0.0 | Aggiunto il supporto per i moduli ES utilizzando l'estensione del file `.js` tramite il campo `"type"` in `package.json`. |
:::

## Introduzione {#introduction}

Un pacchetto è un albero di cartelle descritto da un file `package.json`. Il pacchetto è costituito dalla cartella contenente il file `package.json` e da tutte le sottocartelle fino alla successiva cartella contenente un altro file `package.json` o una cartella denominata `node_modules`.

Questa pagina fornisce indicazioni per gli autori di pacchetti che scrivono file `package.json` insieme a un riferimento per i campi [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) definiti da Node.js.

## Determinare il sistema di moduli {#determining-module-system}

### Introduzione {#introduction_1}

Node.js tratterà quanto segue come [moduli ES](/it/nodejs/api/esm) quando passati a `node` come input iniziale o quando referenziati da istruzioni `import` o espressioni `import()`:

- File con estensione `.mjs`.
- File con estensione `.js` quando il file `package.json` padre più vicino contiene un campo [`"type"`](/it/nodejs/api/packages#type) di livello superiore con un valore di `"module"`.
- Stringhe passate come argomento a `--eval` o inviate a `node` tramite `STDIN`, con il flag `--input-type=module`.
- Codice contenente sintassi che viene analizzata con successo solo come [moduli ES](/it/nodejs/api/esm), come istruzioni `import` o `export` o `import.meta`, senza un marcatore esplicito di come dovrebbe essere interpretato. I marcatori espliciti sono le estensioni `.mjs` o `.cjs`, i campi `"type"` in `package.json` con valori `"module"` o `"commonjs"` o il flag `--input-type`. Le espressioni `import()` dinamiche sono supportate sia nei moduli CommonJS che ES e non forzerebbero il trattamento di un file come modulo ES. Vedi [Rilevamento della sintassi](/it/nodejs/api/packages#syntax-detection).

Node.js tratterà quanto segue come [CommonJS](/it/nodejs/api/modules) quando passati a `node` come input iniziale o quando referenziati da istruzioni `import` o espressioni `import()`:

- File con estensione `.cjs`.
- File con estensione `.js` quando il file `package.json` padre più vicino contiene un campo di livello superiore [`"type"`](/it/nodejs/api/packages#type) con un valore di `"commonjs"`.
- Stringhe passate come argomento a `--eval` o `--print` o inviate a `node` tramite `STDIN`, con il flag `--input-type=commonjs`.
- File con estensione `.js` senza un file `package.json` padre o in cui il file `package.json` padre più vicino non ha un campo `type` e in cui il codice può essere valutato con successo come CommonJS. In altre parole, Node.js tenta di eseguire tali file "ambigui" prima come CommonJS e ritenterà di valutarli come moduli ES se la valutazione come CommonJS fallisce perché il parser ha trovato la sintassi del modulo ES.

Scrivere la sintassi del modulo ES in file "ambigui" comporta un costo in termini di prestazioni e, pertanto, si consiglia agli autori di essere espliciti ove possibile. In particolare, gli autori del pacchetto dovrebbero sempre includere il campo [`"type"`](/it/nodejs/api/packages#type) nei loro file `package.json`, anche nei pacchetti in cui tutte le origini sono CommonJS. Essere espliciti riguardo al `type` del pacchetto proteggerà il pacchetto nel caso in cui il tipo predefinito di Node.js dovesse mai cambiare e renderà anche più facile per gli strumenti di compilazione e i loader determinare come interpretare i file nel pacchetto.


### Rilevamento della sintassi {#syntax-detection}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.7.0 | Il rilevamento della sintassi è abilitato per impostazione predefinita. |
| v21.1.0, v20.10.0 | Aggiunto in: v21.1.0, v20.10.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato per il rilascio
:::

Node.js ispezionerà il codice sorgente di input ambigui per determinare se contiene sintassi di modulo ES; se viene rilevata tale sintassi, l'input verrà trattato come un modulo ES.

L'input ambiguo è definito come:

- File con estensione `.js` o senza estensione; e nessun file `package.json` di controllo o uno privo di un campo `type`.
- Input di stringa (`--eval` o `STDIN`) quando `--input-type` non è specificato.

La sintassi del modulo ES è definita come sintassi che verrebbe lanciata se valutata come CommonJS. Questo include quanto segue:

- istruzioni `import` (ma *non* espressioni `import()`, che sono valide in CommonJS).
- istruzioni `export`.
- riferimenti `import.meta`.
- `await` al livello superiore di un modulo.
- Ridefinizioni lessicali delle variabili wrapper CommonJS (`require`, `module`, `exports`, `__dirname`, `__filename`).

### Caricatori di moduli {#modules-loaders}

Node.js ha due sistemi per risolvere uno specificatore e caricare i moduli.

C'è il caricatore di moduli CommonJS:

- È completamente sincrono.
- È responsabile della gestione delle chiamate `require()`.
- È monkey patchable.
- Supporta [cartelle come moduli](/it/nodejs/api/modules#folders-as-modules).
- Quando si risolve uno specificatore, se non viene trovata una corrispondenza esatta, proverà ad aggiungere estensioni (`.js`, `.json` e infine `.node`) e quindi tenterà di risolvere [cartelle come moduli](/it/nodejs/api/modules#folders-as-modules).
- Tratta `.json` come file di testo JSON.
- I file `.node` vengono interpretati come moduli addon compilati caricati con `process.dlopen()`.
- Tratta tutti i file privi di estensione `.json` o `.node` come file di testo JavaScript.
- Può essere utilizzato solo per [caricare moduli ECMAScript da moduli CommonJS](/it/nodejs/api/modules#loading-ecmascript-modules-using-require) se il grafico del modulo è sincrono (che non contiene `await` di primo livello). Quando utilizzato per caricare un file di testo JavaScript che non è un modulo ECMAScript, il file verrà caricato come modulo CommonJS.

C'è il caricatore di moduli ECMAScript:

- È asincrono, a meno che non venga utilizzato per caricare moduli per `require()`.
- È responsabile della gestione delle istruzioni `import` e delle espressioni `import()`.
- Non è monkey patchable, può essere personalizzato utilizzando gli [hook del caricatore](/it/nodejs/api/esm#loaders).
- Non supporta cartelle come moduli, gli indici di directory (ad es. `'./startup/index.js'`) devono essere completamente specificati.
- Non esegue la ricerca di estensioni. Un'estensione di file deve essere fornita quando lo specificatore è un URL di file relativo o assoluto.
- Può caricare moduli JSON, ma è necessario un attributo di tipo import.
- Accetta solo le estensioni `.js`, `.mjs` e `.cjs` per i file di testo JavaScript.
- Può essere utilizzato per caricare moduli JavaScript CommonJS. Tali moduli vengono passati attraverso `cjs-module-lexer` per cercare di identificare le esportazioni nominate, che sono disponibili se possono essere determinate attraverso l'analisi statica. I moduli CommonJS importati hanno i loro URL convertiti in percorsi assoluti e vengono quindi caricati tramite il caricatore di moduli CommonJS.


### `package.json` ed estensioni dei file {#packagejson-and-file-extensions}

All'interno di un pacchetto, il campo [`"type"`](/it/nodejs/api/packages#type) del [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) definisce come Node.js dovrebbe interpretare i file `.js`. Se un file `package.json` non ha un campo `"type"`, i file `.js` vengono trattati come [CommonJS](/it/nodejs/api/modules).

Un valore `"type"` di `"module"` nel `package.json` indica a Node.js di interpretare i file `.js` all'interno di quel pacchetto utilizzando la sintassi [ES module](/it/nodejs/api/esm).

Il campo `"type"` si applica non solo ai punti di ingresso iniziali (`node my-app.js`) ma anche ai file a cui si fa riferimento tramite istruzioni `import` ed espressioni `import()`.

```js [ESM]
// my-app.js, trattato come un modulo ES perché c'è un file package.json
// nella stessa cartella con "type": "module".

import './startup/init.js';
// Caricato come modulo ES poiché ./startup non contiene un file package.json,
// e quindi eredita il valore "type" da un livello superiore.

import 'commonjs-package';
// Caricato come CommonJS poiché ./node_modules/commonjs-package/package.json
// manca di un campo "type" o contiene "type": "commonjs".

import './node_modules/commonjs-package/index.js';
// Caricato come CommonJS poiché ./node_modules/commonjs-package/package.json
// manca di un campo "type" o contiene "type": "commonjs".
```
I file che terminano con `.mjs` vengono sempre caricati come [moduli ES](/it/nodejs/api/esm) indipendentemente dal `package.json` genitore più vicino.

I file che terminano con `.cjs` vengono sempre caricati come [CommonJS](/it/nodejs/api/modules) indipendentemente dal `package.json` genitore più vicino.

```js [ESM]
import './legacy-file.cjs';
// Caricato come CommonJS poiché .cjs viene sempre caricato come CommonJS.

import 'commonjs-package/src/index.mjs';
// Caricato come modulo ES poiché .mjs viene sempre caricato come modulo ES.
```
Le estensioni `.mjs` e `.cjs` possono essere utilizzate per combinare tipi all'interno dello stesso pacchetto:

- All'interno di un pacchetto `"type": "module"`, è possibile indicare a Node.js di interpretare un particolare file come [CommonJS](/it/nodejs/api/modules) denominandolo con un'estensione `.cjs` (poiché sia i file `.js` che `.mjs` vengono trattati come moduli ES all'interno di un pacchetto `"module"`).
- All'interno di un pacchetto `"type": "commonjs"`, è possibile indicare a Node.js di interpretare un particolare file come un [modulo ES](/it/nodejs/api/esm) denominandolo con un'estensione `.mjs` (poiché sia i file `.js` che `.cjs` vengono trattati come CommonJS all'interno di un pacchetto `"commonjs"`).


### Flag `--input-type` {#--input-type-flag}

**Aggiunto in: v12.0.0**

Le stringhe passate come argomento a `--eval` (o `-e`), o inviate a `node` tramite `STDIN`, vengono trattate come [moduli ES](/it/nodejs/api/esm) quando è impostato il flag `--input-type=module`.

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
Per completezza esiste anche `--input-type=commonjs`, per eseguire esplicitamente l'input di stringhe come CommonJS. Questo è il comportamento predefinito se `--input-type` non è specificato.

## Determinazione del gestore di pacchetti {#determining-package-manager}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Mentre ci si aspetta che tutti i progetti Node.js siano installabili da tutti i gestori di pacchetti una volta pubblicati, i loro team di sviluppo sono spesso tenuti a utilizzare un gestore di pacchetti specifico. Per semplificare questo processo, Node.js viene fornito con uno strumento chiamato [Corepack](/it/nodejs/api/corepack) che mira a rendere tutti i gestori di pacchetti trasparentemente disponibili nel tuo ambiente, a condizione che tu abbia installato Node.js.

Per impostazione predefinita, Corepack non applicherà alcun gestore di pacchetti specifico e utilizzerà le versioni generiche "Last Known Good" associate a ciascuna release di Node.js, ma puoi migliorare questa esperienza impostando il campo [`"packageManager"`](/it/nodejs/api/packages#packagemanager) nel `package.json` del tuo progetto.

## Punti di ingresso del pacchetto {#package-entry-points}

Nel file `package.json` di un pacchetto, due campi possono definire i punti di ingresso per un pacchetto: [`"main"`](/it/nodejs/api/packages#main) e [`"exports"`](/it/nodejs/api/packages#exports). Entrambi i campi si applicano sia ai punti di ingresso del modulo ES che del modulo CommonJS.

Il campo [`"main"`](/it/nodejs/api/packages#main) è supportato in tutte le versioni di Node.js, ma le sue capacità sono limitate: definisce solo il punto di ingresso principale del pacchetto.

Il campo [`"exports"`](/it/nodejs/api/packages#exports) fornisce un'alternativa moderna a [`"main"`](/it/nodejs/api/packages#main) che consente di definire più punti di ingresso, il supporto della risoluzione condizionale degli ingressi tra gli ambienti e **impedisce qualsiasi altro punto di ingresso oltre a quelli definiti in <a href="#exports"><code>"exports"</code></a>**. Questo incapsulamento consente agli autori del modulo di definire chiaramente l'interfaccia pubblica per il loro pacchetto.

Per i nuovi pacchetti destinati alle versioni attualmente supportate di Node.js, si consiglia il campo [`"exports"`](/it/nodejs/api/packages#exports). Per i pacchetti che supportano Node.js 10 e versioni precedenti, è richiesto il campo [`"main"`](/it/nodejs/api/packages#main). Se sono definiti sia [`"exports"`](/it/nodejs/api/packages#exports) che [`"main"`](/it/nodejs/api/packages#main), il campo [`"exports"`](/it/nodejs/api/packages#exports) ha la precedenza su [`"main"`](/it/nodejs/api/packages#main) nelle versioni supportate di Node.js.

Gli [export condizionali](/it/nodejs/api/packages#conditional-exports) possono essere utilizzati all'interno di [`"exports"`](/it/nodejs/api/packages#exports) per definire diversi punti di ingresso del pacchetto per ambiente, incluso se il pacchetto viene referenziato tramite `require` o tramite `import`. Per ulteriori informazioni sul supporto sia dei moduli CommonJS che dei moduli ES in un singolo pacchetto, consultare [la sezione dei pacchetti dual CommonJS/ES module](/it/nodejs/api/packages#dual-commonjses-module-packages).

I pacchetti esistenti che introducono il campo [`"exports"`](/it/nodejs/api/packages#exports) impediranno ai consumatori del pacchetto di utilizzare qualsiasi punto di ingresso non definito, incluso il [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) (ad esempio `require('your-package/package.json')`). **Questo sarà probabilmente una modifica che causa interruzioni.**

Per rendere non dirompente l'introduzione di [`"exports"`](/it/nodejs/api/packages#exports), assicurarsi che ogni punto di ingresso precedentemente supportato venga esportato. È meglio specificare esplicitamente i punti di ingresso in modo che l'API pubblica del pacchetto sia ben definita. Ad esempio, un progetto che in precedenza esportava `main`, `lib`, `feature` e il `package.json` potrebbe utilizzare il seguente `package.exports`:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
In alternativa, un progetto potrebbe scegliere di esportare intere cartelle sia con che senza sottopath estesi utilizzando pattern di esportazione:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```
Con quanto sopra che fornisce compatibilità con le versioni minori del pacchetto, una futura modifica principale per il pacchetto può quindi limitare correttamente le esportazioni solo alle esportazioni di funzionalità specifiche esposte:

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### Esportazione del punto di ingresso principale {#main-entry-point-export}

Quando si scrive un nuovo pacchetto, si consiglia di utilizzare il campo [`"exports"`](/it/nodejs/api/packages#exports):

```json [JSON]
{
  "exports": "./index.js"
}
```
Quando il campo [`"exports"`](/it/nodejs/api/packages#exports) è definito, tutti i sottopercorsi del pacchetto vengono incapsulati e non sono più disponibili agli importatori. Ad esempio, `require('pkg/subpath.js')` genera un errore [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/it/nodejs/api/errors#err_package_path_not_exported).

Questa incapsulamento delle esportazioni fornisce garanzie più affidabili sulle interfacce del pacchetto per gli strumenti e quando si gestiscono gli aggiornamenti semver per un pacchetto. Non si tratta di un incapsulamento forte poiché un require diretto di qualsiasi sottopercorso assoluto del pacchetto come `require('/path/to/node_modules/pkg/subpath.js')` caricherà comunque `subpath.js`.

Tutte le versioni attualmente supportate di Node.js e gli strumenti di build moderni supportano il campo `"exports"`. Per i progetti che utilizzano una versione precedente di Node.js o uno strumento di build correlato, la compatibilità può essere raggiunta includendo il campo `"main"` insieme a `"exports"` che punta allo stesso modulo:

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### Esportazioni di sottopercorsi {#subpath-exports}

**Aggiunto in: v12.7.0**

Quando si utilizza il campo [`"exports"`](/it/nodejs/api/packages#exports), è possibile definire sottopercorsi personalizzati insieme al punto di ingresso principale trattando il punto di ingresso principale come sottopercorso `"."`:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
Ora solo il sottopercorso definito in [`"exports"`](/it/nodejs/api/packages#exports) può essere importato da un consumatore:

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// Carica ./node_modules/es-module-package/src/submodule.js
```
Mentre altri sottopercorsi daranno errore:

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// Genera ERR_PACKAGE_PATH_NOT_EXPORTED
```
#### Estensioni nei sottopercorsi {#extensions-in-subpaths}

Gli autori del pacchetto devono fornire sottopercorsi con estensione (`import 'pkg/subpath.js'`) o senza estensione (`import 'pkg/subpath'`) nelle loro esportazioni. Ciò garantisce che ci sia un solo sottopercorso per ogni modulo esportato in modo che tutti i dipendenti importino lo stesso identificatore coerente, mantenendo il contratto del pacchetto chiaro per i consumatori e semplificando i completamenti del sottopercorso del pacchetto.

Tradizionalmente, i pacchetti tendevano a utilizzare lo stile senza estensione, che ha i vantaggi della leggibilità e della mascheratura del vero percorso del file all'interno del pacchetto.

Con le [import maps](https://github.com/WICG/import-maps) che ora forniscono uno standard per la risoluzione dei pacchetti nei browser e in altri runtime JavaScript, l'utilizzo dello stile senza estensione può comportare definizioni di import map gonfie. Le estensioni di file esplicite possono evitare questo problema consentendo alla import map di utilizzare un [packages folder mapping](https://github.com/WICG/import-maps#packages-via-trailing-slashes) per mappare più sottopercorsi ove possibile invece di una voce di mappa separata per ogni esportazione di sottopercorso del pacchetto. Ciò rispecchia anche il requisito di utilizzare [il percorso completo dell'identificatore](/it/nodejs/api/esm#mandatory-file-extensions) negli identificatori di importazione relativi e assoluti.


### Abbreviazioni per le esportazioni {#exports-sugar}

**Aggiunto in: v12.11.0**

Se l'esportazione `"."` è l'unica esportazione, il campo [`"exports"`](/it/nodejs/api/packages#exports) fornisce un'abbreviazione per questo caso, essendo il valore diretto del campo [`"exports"`](/it/nodejs/api/packages#exports).

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
può essere scritto:

```json [JSON]
{
  "exports": "./index.js"
}
```
### Importazioni di sottopath {#subpath-imports}

**Aggiunto in: v14.6.0, v12.19.0**

Oltre al campo [`"exports"`](/it/nodejs/api/packages#exports), esiste un campo `"imports"` del package per creare mappature private che si applicano solo agli specificatori di importazione dall'interno del package stesso.

Le voci nel campo `"imports"` devono sempre iniziare con `#` per garantire che siano disambiguate dagli specificatori di package esterni.

Ad esempio, il campo imports può essere utilizzato per ottenere i vantaggi delle esportazioni condizionali per i moduli interni:

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
dove `import '#dep'` non ottiene la risoluzione del package esterno `dep-node-native` (incluse le sue esportazioni a sua volta), e invece ottiene il file locale `./dep-polyfill.js` relativo al package in altri ambienti.

A differenza del campo `"exports"`, il campo `"imports"` consente la mappatura a package esterni.

Le regole di risoluzione per il campo imports sono altrimenti analoghe al campo exports.

### Schemi di sottopath {#subpath-patterns}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.10.0, v14.19.0 | Supporto per i trailer di pattern nel campo "imports". |
| v16.9.0, v14.19.0 | Supporto per i trailer di pattern. |
| v14.13.0, v12.20.0 | Aggiunto in: v14.13.0, v12.20.0 |
:::

Per i package con un piccolo numero di esportazioni o importazioni, si consiglia di elencare esplicitamente ogni voce del sottopath di esportazione. Ma per i package che hanno un gran numero di sottopath, ciò potrebbe causare un eccessivo aumento delle dimensioni di `package.json` e problemi di manutenzione.

Per questi casi d'uso, è possibile utilizzare invece schemi di esportazione di sottopath:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
**<code>*</code> le mappature espongono sottopath nidificati in quanto è solo una sintassi di sostituzione di stringhe.**

Tutte le istanze di `*` sul lato destro verranno quindi sostituite con questo valore, anche se contiene separatori `/`.

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// Carica ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// Carica ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// Carica ./node_modules/es-module-package/src/internal/z.js
```
Questa è una corrispondenza e una sostituzione statica diretta senza alcuna gestione speciale per le estensioni dei file. Includere `"*.js"` su entrambi i lati della mappatura limita le esportazioni del package esposte solo ai file JS.

La proprietà delle esportazioni di essere staticamente enumerabile viene mantenuta con gli schemi di esportazione poiché le singole esportazioni per un package possono essere determinate trattando il pattern di destinazione lato destro come un glob `**` rispetto all'elenco dei file all'interno del package. Poiché i percorsi `node_modules` sono vietati nelle destinazioni di esportazione, questa espansione dipende solo dai file del package stesso.

Per escludere le sottocartelle private dagli schemi, è possibile utilizzare destinazioni `null`:

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```
```js [ESM]
import featureInternal from 'es-module-package/features/private-internal/m.js';
// Solleva: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// Carica ./node_modules/es-module-package/src/features/x.js
```

### Esportazioni condizionali {#conditional-exports}

::: info [Cronologia]
| Versione        | Modifiche                                                                                                                                                                                                                       |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| v13.7.0, v12.16.0 | Rimuovi il flag per le esportazioni condizionali.                                                                                                                                                                              |
| v13.2.0, v12.16.0 | Aggiunto in: v13.2.0, v12.16.0                                                                                                                                                                                             |
:::

Le esportazioni condizionali forniscono un modo per mappare a percorsi diversi a seconda di determinate condizioni. Sono supportate sia per le importazioni CommonJS che per i moduli ES.

Ad esempio, un pacchetto che desidera fornire diverse esportazioni di moduli ES per `require()` e `import` può essere scritto come segue:

```json [JSON]
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```

Node.js implementa le seguenti condizioni, elencate in ordine dalla più specifica alla meno specifica, poiché le condizioni dovrebbero essere definite:

- `"node-addons"` - simile a `"node"` e corrisponde a qualsiasi ambiente Node.js. Questa condizione può essere utilizzata per fornire un punto di ingresso che utilizza componenti aggiuntivi C++ nativi, invece di un punto di ingresso più universale e che non si basa su componenti aggiuntivi nativi. Questa condizione può essere disabilitata tramite il flag [`--no-addons`](/it/nodejs/api/cli#--no-addons).
- `"node"` - corrisponde a qualsiasi ambiente Node.js. Può essere un file CommonJS o un modulo ES. *Nella maggior parte dei casi, non è necessario richiamare esplicitamente la piattaforma Node.js.*
- `"import"` - corrisponde quando il pacchetto viene caricato tramite `import` o `import()`, oppure tramite qualsiasi operazione di importazione o risoluzione di livello superiore dal caricatore di moduli ECMAScript. Si applica indipendentemente dal formato del modulo del file di destinazione. *Sempre reciprocamente esclusivo con <code>"require"</code>.*
- `"require"` - corrisponde quando il pacchetto viene caricato tramite `require()`. Il file di riferimento dovrebbe essere caricabile con `require()`, anche se la condizione corrisponde indipendentemente dal formato del modulo del file di destinazione. I formati previsti includono CommonJS, JSON, componenti aggiuntivi nativi e moduli ES. *Sempre reciprocamente esclusivo con <code>"import"</code>.*
- `"module-sync"` - corrisponde indipendentemente dal fatto che il pacchetto venga caricato tramite `import`, `import()` o `require()`. Si prevede che il formato sia moduli ES che non contengono await di livello superiore nel suo grafo di moduli: in tal caso, verrà generato `ERR_REQUIRE_ASYNC_MODULE` quando il modulo viene eseguito con `require()`.
- `"default"` - il fallback generico che corrisponde sempre. Può essere un file CommonJS o un modulo ES. *Questa condizione dovrebbe sempre venire per ultima.*

All'interno dell'oggetto [`"exports"`](/it/nodejs/api/packages#exports), l'ordine delle chiavi è significativo. Durante la corrispondenza delle condizioni, le voci precedenti hanno una priorità più alta e hanno la precedenza sulle voci successive. *La regola generale è che le condizioni dovrebbero essere dalla più specifica alla meno specifica nell'ordine degli oggetti.*

L'utilizzo delle condizioni `"import"` e `"require"` può portare ad alcuni rischi, che sono ulteriormente spiegati nella [sezione dei pacchetti duali CommonJS/ES module](/it/nodejs/api/packages#dual-commonjses-module-packages).

La condizione `"node-addons"` può essere utilizzata per fornire un punto di ingresso che utilizza componenti aggiuntivi C++ nativi. Tuttavia, questa condizione può essere disabilitata tramite il flag [`--no-addons`](/it/nodejs/api/cli#--no-addons). Quando si utilizza `"node-addons"`, si consiglia di trattare `"default"` come un miglioramento che fornisce un punto di ingresso più universale, ad esempio utilizzando WebAssembly invece di un componente aggiuntivo nativo.

Le esportazioni condizionali possono anche essere estese ai sottopercorsi di esportazione, ad esempio:

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```

Definisce un pacchetto in cui `require('pkg/feature.js')` e `import 'pkg/feature.js')` potrebbero fornire implementazioni diverse tra Node.js e altri ambienti JS.

Quando si utilizzano rami di ambiente, includere sempre una condizione `"default"` ove possibile. Fornire una condizione `"default"` garantisce che qualsiasi ambiente JS sconosciuto sia in grado di utilizzare questa implementazione universale, il che aiuta a evitare che questi ambienti JS debbano fingere di essere ambienti esistenti per supportare pacchetti con esportazioni condizionali. Per questo motivo, l'utilizzo dei rami di condizione `"node"` e `"default"` è solitamente preferibile all'utilizzo dei rami di condizione `"node"` e `"browser"`.


### Condizioni nidificate {#nested-conditions}

Oltre alle mappature dirette, Node.js supporta anche oggetti di condizione nidificati.

Ad esempio, per definire un pacchetto che ha solo punti di ingresso in modalità duale per l'uso in Node.js ma non nel browser:

```json [JSON]
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```
Le condizioni continuano a essere abbinate in ordine come con le condizioni piatte. Se una condizione nidificata non ha alcuna mappatura, continuerà a controllare le condizioni rimanenti della condizione padre. In questo modo, le condizioni nidificate si comportano in modo analogo alle istruzioni `if` JavaScript nidificate.

### Risoluzione delle condizioni utente {#resolving-user-conditions}

**Aggiunto in: v14.9.0, v12.19.0**

Quando si esegue Node.js, è possibile aggiungere condizioni utente personalizzate con il flag `--conditions`:

```bash [BASH]
node --conditions=development index.js
```
che risolverebbe quindi la condizione `"development"` negli import e negli export dei pacchetti, risolvendo contemporaneamente le condizioni esistenti `"node"`, `"node-addons"`, `"default"`, `"import"` e `"require"` come appropriato.

È possibile impostare un numero qualsiasi di condizioni personalizzate con flag ripetuti.

Le condizioni tipiche dovrebbero contenere solo caratteri alfanumerici, utilizzando ":", "-" o "=" come separatori se necessario. Qualsiasi altra cosa potrebbe incorrere in problemi di compatibilità al di fuori di node.

In node, le condizioni hanno pochissime restrizioni, ma in particolare queste includono:

### Definizioni delle condizioni della comunità {#community-conditions-definitions}

Le stringhe di condizione diverse dalle condizioni `"import"`, `"require"`, `"node"`, `"module-sync"`, `"node-addons"` e `"default"` [implementate nel core di Node.js](/it/nodejs/api/packages#conditional-exports) vengono ignorate per impostazione predefinita.

Altre piattaforme possono implementare altre condizioni e le condizioni utente possono essere abilitate in Node.js tramite il flag [`--conditions` / `-C`](/it/nodejs/api/packages#resolving-user-conditions).

Poiché le condizioni personalizzate dei pacchetti richiedono definizioni chiare per garantire un utilizzo corretto, di seguito viene fornito un elenco di condizioni di pacchetto comuni note e le loro definizioni rigorose per favorire il coordinamento dell'ecosistema.

- `"types"` - può essere utilizzato dai sistemi di digitazione per risolvere il file di digitazione per l'esportazione specificata. *Questa condizione deve essere sempre inclusa per prima.*
- `"browser"` - qualsiasi ambiente browser web.
- `"development"` - può essere utilizzato per definire un punto di ingresso per un ambiente di solo sviluppo, ad esempio per fornire un contesto di debug aggiuntivo come messaggi di errore migliori quando si esegue in modalità di sviluppo. *Deve essere sempre
mutuamente esclusivo con <code>"production"</code>.*
- `"production"` - può essere utilizzato per definire un punto di ingresso per un ambiente di produzione. *Deve essere sempre mutuamente esclusivo con <code>"development"</code>.*

Per altri runtime, le definizioni delle chiavi di condizione specifiche della piattaforma sono gestite dal [WinterCG](https://wintercg.org/) nella specifica della proposta [Runtime Keys](https://runtime-keys.proposal.wintercg.org/).

Nuove definizioni di condizioni possono essere aggiunte a questo elenco creando una pull request alla [documentazione di Node.js per questa sezione](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions). I requisiti per l'elenco di una nuova definizione di condizione qui sono:

- La definizione deve essere chiara e univoca per tutti gli implementatori.
- Il caso d'uso per cui è necessaria la condizione deve essere chiaramente giustificato.
- Dovrebbe esistere un utilizzo sufficiente dell'implementazione esistente.
- Il nome della condizione non deve essere in conflitto con un'altra definizione di condizione o condizione in ampio uso.
- L'elenco della definizione della condizione dovrebbe fornire un vantaggio di coordinamento all'ecosistema che altrimenti non sarebbe possibile. Ad esempio, questo non sarebbe necessariamente il caso per le condizioni specifiche dell'azienda o specifiche dell'applicazione.
- La condizione dovrebbe essere tale che un utente Node.js si aspetterebbe che fosse nella documentazione principale di Node.js. La condizione `"types"` è un buon esempio: non appartiene realmente alla proposta [Runtime Keys](https://runtime-keys.proposal.wintercg.org/) ma si adatta bene qui nella documentazione di Node.js.

Le definizioni di cui sopra potrebbero essere spostate in un registro delle condizioni dedicato a tempo debito.


### Auto-referenziazione di un pacchetto usando il suo nome {#self-referencing-a-package-using-its-name}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.6.0, v12.16.0 | Rimosso il flag per l'auto-referenziazione di un pacchetto usando il suo nome. |
| v13.1.0, v12.16.0 | Aggiunto in: v13.1.0, v12.16.0 |
:::

All'interno di un pacchetto, i valori definiti nel campo [`"exports"`](/it/nodejs/api/packages#exports) del `package.json` del pacchetto possono essere referenziati tramite il nome del pacchetto. Ad esempio, supponendo che il `package.json` sia:

```json [JSON]
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```
Allora qualsiasi modulo *in quel pacchetto* può fare riferimento a un export nel pacchetto stesso:

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // Importa "something" da ./index.mjs.
```
L'auto-referenziazione è disponibile solo se `package.json` ha [`"exports"`](/it/nodejs/api/packages#exports), e consentirà di importare solo ciò che quel [`"exports"`](/it/nodejs/api/packages#exports) (nel `package.json`) consente. Quindi il codice seguente, dato il pacchetto precedente, genererà un errore di runtime:

```js [ESM]
// ./another-module.mjs

// Importa "another" da ./m.mjs. Fallisce perché
// il campo "exports" del "package.json"
// non fornisce un export chiamato "./m.mjs".
import { another } from 'a-package/m.mjs';
```
L'auto-referenziazione è disponibile anche quando si utilizza `require`, sia in un modulo ES che in uno CommonJS. Ad esempio, anche questo codice funzionerà:

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // Carica da ./foo.js.
```
Infine, l'auto-referenziazione funziona anche con i pacchetti scoped. Ad esempio, anche questo codice funzionerà:

```json [JSON]
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```
```js [CJS]
// ./index.js
module.exports = 42;
```
```js [CJS]
// ./other.js
console.log(require('@my/package'));
```
```bash [BASH]
$ node other.js
42
```
## Pacchetti duali CommonJS/ES module {#dual-commonjs/es-module-packages}

Vedi [il repository di esempi di pacchetti](https://github.com/nodejs/package-examples) per i dettagli.

## Definizioni dei campi `package.json` di Node.js {#nodejs-packagejson-field-definitions}

Questa sezione descrive i campi utilizzati dal runtime di Node.js. Altri strumenti (come [npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)) utilizzano campi aggiuntivi che vengono ignorati da Node.js e non documentati qui.

I seguenti campi nei file `package.json` sono utilizzati in Node.js:

- [`"name"`](/it/nodejs/api/packages#name) - Rilevante quando si utilizzano importazioni con nome all'interno di un pacchetto. Utilizzato anche dai gestori di pacchetti come nome del pacchetto.
- [`"main"`](/it/nodejs/api/packages#main) - Il modulo predefinito quando si carica il pacchetto, se gli export non sono specificati, e nelle versioni di Node.js precedenti all'introduzione degli export.
- [`"packageManager"`](/it/nodejs/api/packages#packagemanager) - Il gestore di pacchetti consigliato quando si contribuisce al pacchetto. Sfruttato dagli shim di [Corepack](/it/nodejs/api/corepack).
- [`"type"`](/it/nodejs/api/packages#type) - Il tipo di pacchetto che determina se caricare i file `.js` come CommonJS o moduli ES.
- [`"exports"`](/it/nodejs/api/packages#exports) - Esportazioni del pacchetto ed esportazioni condizionali. Quando presente, limita quali sottomoduli possono essere caricati dall'interno del pacchetto.
- [`"imports"`](/it/nodejs/api/packages#imports) - Importazioni del pacchetto, per l'uso da parte dei moduli all'interno del pacchetto stesso.


### `"name"` {#"name"}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.6.0, v12.16.0 | Rimossa l'opzione `--experimental-resolve-self`. |
| v13.1.0, v12.16.0 | Aggiunta in: v13.1.0, v12.16.0 |
:::

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "nome-del-pacchetto"
}
```
Il campo `"name"` definisce il nome del tuo pacchetto. La pubblicazione nel registro *npm* richiede un nome che soddisfi [determinati requisiti](https://docs.npmjs.com/files/package.json#name).

Il campo `"name"` può essere utilizzato in aggiunta al campo [`"exports"`](/it/nodejs/api/packages#exports) per [auto-riferire](/it/nodejs/api/packages#self-referencing-a-package-using-its-name) un pacchetto usando il suo nome.

### `"main"` {#"main"}

**Aggiunta in: v0.4.0**

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
Il campo `"main"` definisce il punto di ingresso di un pacchetto quando viene importato per nome tramite una ricerca `node_modules`. Il suo valore è un percorso.

Quando un pacchetto ha un campo [`"exports"`](/it/nodejs/api/packages#exports), questo avrà la precedenza sul campo `"main"` quando si importa il pacchetto per nome.

Definisce anche lo script che viene utilizzato quando la [directory del pacchetto viene caricata tramite `require()` ](/it/nodejs/api/modules#folders-as-modules).

```js [CJS]
// Questo si risolve in ./path/to/directory/index.js.
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**Aggiunta in: v16.9.0, v14.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<nome del gestore di pacchetti>@<versione>"
}
```
Il campo `"packageManager"` definisce quale gestore di pacchetti dovrebbe essere utilizzato quando si lavora al progetto corrente. Può essere impostato su uno qualsiasi dei [gestori di pacchetti supportati](/it/nodejs/api/corepack#supported-package-managers) e garantirà che i tuoi team utilizzino esattamente le stesse versioni del gestore di pacchetti senza dover installare altro oltre a Node.js.

Questo campo è attualmente sperimentale e deve essere accettato; controlla la pagina [Corepack](/it/nodejs/api/corepack) per i dettagli sulla procedura.


### `"type"` {#"type"}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.2.0, v12.17.0 | Rimosso il flag `--experimental-modules`. |
| v12.0.0 | Aggiunto in: v12.0.0 |
:::

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il campo `"type"` definisce il formato del modulo che Node.js utilizza per tutti i file `.js` che hanno quel file `package.json` come genitore più vicino.

I file che terminano con `.js` vengono caricati come moduli ES quando il file `package.json` genitore più vicino contiene un campo di livello superiore `"type"` con un valore di `"module"`.

Il `package.json` genitore più vicino è definito come il primo `package.json` trovato durante la ricerca nella cartella corrente, nel genitore di quella cartella e così via fino a raggiungere una cartella node_modules o la radice del volume.

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# Nella stessa cartella del package.json precedente {#in-same-folder-as-preceding-packagejson}
node my-app.js # Esegue come modulo ES
```
Se il `package.json` genitore più vicino manca di un campo `"type"`, o contiene `"type": "commonjs"`, i file `.js` vengono trattati come [CommonJS](/it/nodejs/api/modules). Se viene raggiunta la radice del volume e non viene trovato alcun `package.json`, i file `.js` vengono trattati come [CommonJS](/it/nodejs/api/modules).

Le istruzioni `import` dei file `.js` vengono trattate come moduli ES se il `package.json` genitore più vicino contiene `"type": "module"`.

```js [ESM]
// my-app.js, parte dello stesso esempio di sopra
import './startup.js'; // Caricato come modulo ES a causa del package.json
```
Indipendentemente dal valore del campo `"type"`, i file `.mjs` vengono sempre trattati come moduli ES e i file `.cjs` vengono sempre trattati come CommonJS.

### `"exports"` {#"exports"}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.13.0, v12.20.0 | Aggiunto il supporto per i pattern `"exports"`. |
| v13.7.0, v12.17.0 | Rimosso il flag delle esportazioni condizionali. |
| v13.7.0, v12.16.0 | Implementato l'ordinamento logico delle esportazioni condizionali. |
| v13.7.0, v12.16.0 | Rimossa l'opzione `--experimental-conditional-exports`. Nella versione 12.16.0, le esportazioni condizionali sono ancora dietro a `--experimental-modules`. |
| v13.2.0, v12.16.0 | Implementate le esportazioni condizionali. |
| v12.7.0 | Aggiunto in: v12.7.0 |
:::

- Tipo: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
Il campo `"exports"` consente di definire i [punti di ingresso](/it/nodejs/api/packages#package-entry-points) di un pacchetto quando importato per nome caricato tramite una ricerca `node_modules` o un [auto-riferimento](/it/nodejs/api/packages#self-referencing-a-package-using-its-name) al proprio nome. È supportato in Node.js 12+ come alternativa a [`"main"`](/it/nodejs/api/packages#main) che può supportare la definizione di [esportazioni di sottopercorsi](/it/nodejs/api/packages#subpath-exports) ed [esportazioni condizionali](/it/nodejs/api/packages#conditional-exports) incapsulando al contempo moduli interni non esportati.

Le [Esportazioni condizionali](/it/nodejs/api/packages#conditional-exports) possono essere utilizzate anche all'interno di `"exports"` per definire diversi punti di ingresso del pacchetto per ambiente, incluso se il pacchetto viene referenziato tramite `require` o tramite `import`.

Tutti i percorsi definiti in `"exports"` devono essere URL di file relativi che iniziano con `./`.


### `"imports"` {#"imports"}

**Aggiunto in: v14.6.0, v12.19.0**

- Tipo: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
Le voci nel campo `imports` devono essere stringhe che iniziano con `#`.

Gli import di pacchetto consentono la mappatura a pacchetti esterni.

Questo campo definisce gli [import di sottopercorso](/it/nodejs/api/packages#subpath-imports) per il pacchetto corrente.

