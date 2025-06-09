---
title: Supporto di TypeScript in Node.js
description: Scopri come usare TypeScript con Node.js, inclusa l'installazione, la configurazione e le migliori pratiche per integrare TypeScript nei tuoi progetti Node.js.
head:
  - - meta
    - name: og:title
      content: Supporto di TypeScript in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come usare TypeScript con Node.js, inclusa l'installazione, la configurazione e le migliori pratiche per integrare TypeScript nei tuoi progetti Node.js.
  - - meta
    - name: twitter:title
      content: Supporto di TypeScript in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come usare TypeScript con Node.js, inclusa l'installazione, la configurazione e le migliori pratiche per integrare TypeScript nei tuoi progetti Node.js.
---


# Moduli: TypeScript {#modules-typescript}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.7.0 | Aggiunto il flag `--experimental-transform-types`. |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

## Abilitazione {#enabling}

Ci sono due modi per abilitare il supporto runtime di TypeScript in Node.js:

## Supporto completo di TypeScript {#full-typescript-support}

Per utilizzare TypeScript con il supporto completo di tutte le funzionalità di TypeScript, incluso `tsconfig.json`, è possibile utilizzare un pacchetto di terze parti. Queste istruzioni utilizzano [`tsx`](https://tsx.is/) come esempio, ma sono disponibili molte altre librerie simili.

## Rimozione dei tipi {#type-stripping}

**Aggiunto in: v22.6.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Il flag [`--experimental-strip-types`](/it/nodejs/api/cli#--experimental-strip-types) abilita Node.js per eseguire file TypeScript. Per impostazione predefinita, Node.js eseguirà solo i file che non contengono funzionalità TypeScript che richiedono la trasformazione, come enum o spazi dei nomi. Node.js sostituirà le annotazioni di tipo inline con spazi vuoti e non verrà eseguito alcun controllo del tipo. Per abilitare la trasformazione di tali funzionalità, utilizzare il flag [`--experimental-transform-types`](/it/nodejs/api/cli#--experimental-transform-types). Le funzionalità di TypeScript che dipendono dalle impostazioni all'interno di `tsconfig.json`, come i percorsi o la conversione della sintassi JavaScript più recente in standard precedenti, non sono intenzionalmente supportate. Per ottenere il supporto completo di TypeScript, vedere [Supporto completo di TypeScript](/it/nodejs/api/typescript#full-typescript-support).

La funzionalità di rimozione dei tipi è progettata per essere leggera. Non supportando intenzionalmente le sintassi che richiedono la generazione di codice JavaScript e sostituendo i tipi inline con spazi vuoti, Node.js può eseguire codice TypeScript senza la necessità di source map.

La rimozione dei tipi funziona con la maggior parte delle versioni di TypeScript, ma si consiglia la versione 5.7 o successiva con le seguenti impostazioni di `tsconfig.json`:

```json [JSON]
{
  "compilerOptions": {
     "target": "esnext",
     "module": "nodenext",
     "allowImportingTsExtensions": true,
     "rewriteRelativeImportExtensions": true,
     "verbatimModuleSyntax": true
  }
}
```

### Determinazione del sistema di moduli {#determining-module-system}

Node.js supporta sia la sintassi [CommonJS](/it/nodejs/api/modules) che quella [ES Modules](/it/nodejs/api/esm) nei file TypeScript. Node.js non convertirà da un sistema di moduli all'altro; se vuoi che il tuo codice venga eseguito come un modulo ES, devi usare la sintassi `import` e `export`, e se vuoi che il tuo codice venga eseguito come CommonJS devi usare `require` e `module.exports`.

- I file `.ts` avranno il loro sistema di moduli determinato [allo stesso modo dei file `.js`.](/it/nodejs/api/packages#determining-module-system) Per usare la sintassi `import` e `export`, aggiungi `"type": "module"` al `package.json` padre più vicino.
- I file `.mts` saranno sempre eseguiti come moduli ES, in modo simile ai file `.mjs`.
- I file `.cts` saranno sempre eseguiti come moduli CommonJS, in modo simile ai file `.cjs`.
- I file `.tsx` non sono supportati.

Come nei file JavaScript, [le estensioni dei file sono obbligatorie](/it/nodejs/api/esm#mandatory-file-extensions) nelle istruzioni `import` e nelle espressioni `import()`: `import './file.ts'`, non `import './file'`. A causa della retrocompatibilità, le estensioni dei file sono anche obbligatorie nelle chiamate `require()`: `require('./file.ts')`, non `require('./file')`, in modo simile a come l'estensione `.cjs` è obbligatoria nelle chiamate `require` nei file CommonJS.

L'opzione `tsconfig.json` `allowImportingTsExtensions` consentirà al compilatore TypeScript `tsc` di controllare i tipi di file con specificatori `import` che includono l'estensione `.ts`.

### Funzionalità di TypeScript {#typescript-features}

Poiché Node.js sta rimuovendo solo i tipi inline, qualsiasi funzionalità TypeScript che implichi la *sostituzione* della sintassi TypeScript con una nuova sintassi JavaScript genererà un errore, a meno che non venga passato il flag [`--experimental-transform-types`](/it/nodejs/api/cli#--experimental-transform-types).

Le funzionalità più importanti che richiedono la trasformazione sono:

- `Enum`
- `namespaces`
- `legacy module`
- proprietà dei parametri

Poiché i Decorator sono attualmente una [proposta TC39 Stage 3](https://github.com/tc39/proposal-decorators) e saranno presto supportati dal motore JavaScript, non vengono trasformati e comporteranno un errore di analisi. Questa è una limitazione temporanea e sarà risolta in futuro.

Inoltre, Node.js non legge i file `tsconfig.json` e non supporta le funzionalità che dipendono dalle impostazioni all'interno di `tsconfig.json`, come percorsi o la conversione di una sintassi JavaScript più recente in standard precedenti.


### Importazione di tipi senza la parola chiave `type` {#importing-types-without-type-keyword}

A causa della natura dello stripping dei tipi, la parola chiave `type` è necessaria per rimuovere correttamente gli import di tipi. Senza la parola chiave `type`, Node.js tratterà l'import come un import di valore, il che comporterà un errore di runtime. L'opzione tsconfig [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) può essere utilizzata per abbinare questo comportamento.

Questo esempio funzionerà correttamente:

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
Questo comporterà un errore di runtime:

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### Forme di input non file {#non-file-forms-of-input}

Lo stripping dei tipi può essere abilitato per `--eval`. Il sistema di moduli sarà determinato da `--input-type`, come lo è per JavaScript.

La sintassi TypeScript non è supportata in REPL, input STDIN, `--print`, `--check` e `inspect`.

### Source map {#source-maps}

Poiché i tipi inline vengono sostituiti da spazi vuoti, le source map non sono necessarie per numeri di riga corretti negli stack trace; e Node.js non le genera. Quando [`--experimental-transform-types`](/it/nodejs/api/cli#--experimental-transform-types) è abilitato, le source map sono abilitate di default.

### Type stripping nelle dipendenze {#type-stripping-in-dependencies}

Per scoraggiare gli autori di pacchetti dalla pubblicazione di pacchetti scritti in TypeScript, Node.js di default rifiuterà di gestire i file TypeScript all'interno di cartelle sotto un percorso `node_modules`.

### Alias di percorso {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) non verranno trasformati e quindi produrranno un errore. La feature più simile disponibile è [importazioni di sottopercorso](/it/nodejs/api/packages#subpath-imports) con la limitazione che devono iniziare con `#`.

