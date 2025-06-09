---
title: Opzioni CLI di Node.js
description: Questa pagina fornisce una guida completa alle opzioni della riga di comando disponibili in Node.js, dettagliando come utilizzare vari flag e argomenti per configurare l'ambiente di esecuzione, gestire il debug e controllare il comportamento di esecuzione.
head:
  - - meta
    - name: og:title
      content: Opzioni CLI di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa pagina fornisce una guida completa alle opzioni della riga di comando disponibili in Node.js, dettagliando come utilizzare vari flag e argomenti per configurare l'ambiente di esecuzione, gestire il debug e controllare il comportamento di esecuzione.
  - - meta
    - name: twitter:title
      content: Opzioni CLI di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa pagina fornisce una guida completa alle opzioni della riga di comando disponibili in Node.js, dettagliando come utilizzare vari flag e argomenti per configurare l'ambiente di esecuzione, gestire il debug e controllare il comportamento di esecuzione.
---


# API della riga di comando {#command-line-api}

Node.js viene fornito con una varietà di opzioni CLI. Queste opzioni espongono il debugging integrato, diversi modi per eseguire script e altre utili opzioni di runtime.

Per visualizzare questa documentazione come una pagina di manuale in un terminale, esegui `man node`.

## Sinossi {#synopsis}

`node [options] [V8 options] [\<program-entry-point\> | -e "script" | -] [--] [arguments]`

`node inspect [\<program-entry-point\> | -e "script" | \<host\>:\<port\>] …`

`node --v8-options`

Esegui senza argomenti per avviare il [REPL](/it/nodejs/api/repl).

Per maggiori informazioni su `node inspect`, consulta la documentazione del [debugger](/it/nodejs/api/debugger).

## Punto di ingresso del programma {#program-entry-point}

Il punto di ingresso del programma è una stringa simile a un identificatore. Se la stringa non è un percorso assoluto, viene risolta come un percorso relativo dalla directory di lavoro corrente. Tale percorso viene quindi risolto dal caricatore di moduli [CommonJS](/it/nodejs/api/modules). Se non viene trovato alcun file corrispondente, viene generato un errore.

Se viene trovato un file, il suo percorso verrà passato al [caricatore di moduli ES](/it/nodejs/api/packages#modules-loaders) in una delle seguenti condizioni:

- Il programma è stato avviato con un flag della riga di comando che forza il caricamento del punto di ingresso con il caricatore di moduli ECMAScript, come `--import`.
- Il file ha un'estensione `.mjs`.
- Il file non ha un'estensione `.cjs` e il file `package.json` genitore più vicino contiene un campo [`"type"`](/it/nodejs/api/packages#type) di primo livello con un valore di `"module"`.

Altrimenti, il file viene caricato utilizzando il caricatore di moduli CommonJS. Vedi [Caricatori di moduli](/it/nodejs/api/packages#modules-loaders) per maggiori dettagli.

### Avvertenza sul punto di ingresso del caricatore di moduli ECMAScript {#ecmascript-modules-loader-entry-point-caveat}

Durante il caricamento, il [caricatore di moduli ES](/it/nodejs/api/packages#modules-loaders) carica il punto di ingresso del programma, il comando `node` accetterà come input solo file con estensioni `.js`, `.mjs` o `.cjs`; e con estensioni `.wasm` quando [`--experimental-wasm-modules`](/it/nodejs/api/cli#--experimental-wasm-modules) è abilitato.

## Opzioni {#options}

::: info [Storia]
| Versione | Modifiche |
| --- | --- |
| v10.12.0 | Sono ora consentiti anche i trattini bassi anziché i trattini per le opzioni di Node.js, oltre alle opzioni V8. |
:::

Tutte le opzioni, incluse le opzioni V8, consentono di separare le parole con trattini (`-`) o trattini bassi (`_`). Ad esempio, `--pending-deprecation` è equivalente a `--pending_deprecation`.

Se un'opzione che accetta un singolo valore (come `--max-http-header-size`) viene passata più di una volta, viene utilizzato l'ultimo valore passato. Le opzioni dalla riga di comando hanno la precedenza sulle opzioni passate tramite la variabile d'ambiente [`NODE_OPTIONS`](/it/nodejs/api/cli#node_optionsoptions).


### `-` {#-}

**Aggiunto in: v8.0.0**

Alias per stdin. Analogo all'uso di `-` in altre utilità da riga di comando, il che significa che lo script viene letto da stdin e il resto delle opzioni vengono passate a tale script.

### `--` {#--}

**Aggiunto in: v6.11.0**

Indica la fine delle opzioni di Node. Passa il resto degli argomenti allo script. Se prima di questo non viene fornito alcun nome di file script o script eval/print, l'argomento successivo viene utilizzato come nome di file script.

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**Aggiunto in: v0.10.8**

L'interruzione anziché l'uscita causa la generazione di un file core per l'analisi post-mortem utilizzando un debugger (come `lldb`, `gdb` e `mdb`).

Se questo flag viene passato, il comportamento può comunque essere impostato per non interrompere tramite [`process.setUncaughtExceptionCaptureCallback()`](/it/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) (e tramite l'utilizzo del modulo `node:domain` che lo utilizza).

### `--allow-addons` {#--allow-addons}

**Aggiunto in: v21.6.0, v20.12.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Quando si utilizza il [Modello delle autorizzazioni](/it/nodejs/api/permissions#permission-model), il processo non sarà in grado di utilizzare i componenti aggiuntivi nativi per impostazione predefinita. I tentativi di farlo genereranno un `ERR_DLOPEN_DISABLED` a meno che l'utente non passi esplicitamente il flag `--allow-addons` all'avvio di Node.js.

Esempio:

```js [CJS]
// Tentativo di richiedere un componente aggiuntivo nativo
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**Aggiunto in: v20.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Quando si utilizza il [Modello di autorizzazione](/it/nodejs/api/permissions#permission-model), il processo non sarà in grado di generare alcun processo figlio per impostazione predefinita. I tentativi di farlo genereranno un `ERR_ACCESS_DENIED` a meno che l'utente non passi esplicitamente il flag `--allow-child-process` all'avvio di Node.js.

Esempio:

```js [ESM]
const childProcess = require('node:child_process');
// Tentativo di bypassare l'autorizzazione
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Il modello di autorizzazione e i flag --allow-fs sono stabili. |
| v20.7.0 | I percorsi delimitati da virgola (`,`) non sono più consentiti. |
| v20.0.0 | Aggiunto in: v20.0.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Questo flag configura le autorizzazioni di lettura del file system utilizzando il [Modello di autorizzazione](/it/nodejs/api/permissions#permission-model).

Gli argomenti validi per il flag `--allow-fs-read` sono:

- `*` - Per consentire tutte le operazioni `FileSystemRead`.
- È possibile consentire più percorsi utilizzando più flag `--allow-fs-read`. Esempio `--allow-fs-read=/cartella1/ --allow-fs-read=/cartella1/`

È possibile trovare esempi nella documentazione [Autorizzazioni del file system](/it/nodejs/api/permissions#file-system-permissions).

Anche il modulo inizializzatore deve essere consentito. Considera il seguente esempio:

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
Il processo deve avere accesso al modulo `index.js`:

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Il modello di autorizzazione e i flag --allow-fs sono stabili. |
| v20.7.0 | I percorsi delimitati da virgola (`,`) non sono più consentiti. |
| v20.0.0 | Aggiunto in: v20.0.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Questo flag configura le autorizzazioni di scrittura del file system utilizzando il [Modello di Autorizzazione](/it/nodejs/api/permissions#permission-model).

Gli argomenti validi per il flag `--allow-fs-write` sono:

- `*` - Per consentire tutte le operazioni `FileSystemWrite`.
- È possibile consentire più percorsi utilizzando più flag `--allow-fs-write`. Esempio `--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

I percorsi delimitati da virgola (`,`) non sono più consentiti. Quando si passa un singolo flag con una virgola, verrà visualizzato un avviso.

Esempi sono disponibili nella documentazione [Autorizzazioni del file system](/it/nodejs/api/permissions#file-system-permissions).

### `--allow-wasi` {#--allow-wasi}

**Aggiunto in: v22.3.0, v20.16.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Quando si utilizza il [Modello di autorizzazione](/it/nodejs/api/permissions#permission-model), il processo non sarà in grado di creare alcuna istanza WASI per impostazione predefinita. Per motivi di sicurezza, la chiamata genererà un `ERR_ACCESS_DENIED` a meno che l'utente non passi esplicitamente il flag `--allow-wasi` nel processo principale di Node.js.

Esempio:

```js [ESM]
const { WASI } = require('node:wasi');
// Tentativo di aggirare l'autorizzazione
new WASI({
  version: 'preview1',
  // Tentativo di montare l'intero filesystem
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**Aggiunto in: v20.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Quando si utilizza il [Modello di autorizzazione](/it/nodejs/api/permissions#permission-model), il processo non sarà in grado di creare alcun thread di worker per impostazione predefinita. Per motivi di sicurezza, la chiamata genererà un `ERR_ACCESS_DENIED` a meno che l'utente non passi esplicitamente il flag `--allow-worker` nel processo principale di Node.js.

Esempio:

```js [ESM]
const { Worker } = require('node:worker_threads');
// Tentativo di aggirare l'autorizzazione
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**Aggiunto in: v18.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Genera un blob snapshot quando il processo termina e lo scrive su disco, che può essere caricato in seguito con `--snapshot-blob`.

Quando si crea lo snapshot, se `--snapshot-blob` non è specificato, il blob generato verrà scritto, per impostazione predefinita, in `snapshot.blob` nella directory di lavoro corrente. Altrimenti, verrà scritto nel percorso specificato da `--snapshot-blob`.

```bash [BASH]
$ echo "globalThis.foo = 'Vengo dallo snapshot'" > snapshot.js

# Esegui snapshot.js per inizializzare l'applicazione e salvare lo {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# stato in snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Carica lo snapshot generato e avvia l'applicazione da index.js. {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
Vengo dallo snapshot
```
L'API [`v8.startupSnapshot` API](/it/nodejs/api/v8#startup-snapshot-api) può essere utilizzata per specificare un punto di ingresso al momento della creazione dello snapshot, evitando così la necessità di uno script di ingresso aggiuntivo al momento della deserializzazione:

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('Vengo dallo snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
Vengo dallo snapshot
```
Per ulteriori informazioni, consulta la documentazione dell'API [`v8.startupSnapshot` API](/it/nodejs/api/v8#startup-snapshot-api).

Attualmente il supporto per lo snapshot in fase di esecuzione è sperimentale in quanto:

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**Aggiunto in: v21.6.0, v20.12.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Specifica il percorso di un file di configurazione JSON che configura il comportamento di creazione dello snapshot.

Le seguenti opzioni sono attualmente supportate:

- `builder` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Richiesto. Fornisce il nome dello script che viene eseguito prima della creazione dello snapshot, come se [`--build-snapshot`](/it/nodejs/api/cli#--build-snapshot) fosse stato passato con `builder` come nome dello script principale.
- `withoutCodeCache` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Opzionale. Includere la cache del codice riduce il tempo impiegato per la compilazione delle funzioni incluse nello snapshot a scapito di una dimensione dello snapshot maggiore e potenzialmente interrompendo la portabilità dello snapshot.

Quando si utilizza questo flag, i file di script aggiuntivi forniti nella riga di comando non verranno eseguiti e verranno invece interpretati come normali argomenti della riga di comando.


### `-c`, `--check` {#--build-snapshot-config}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | L'opzione `--require` è ora supportata quando si controlla un file. |
| v5.0.0, v4.2.0 | Aggiunto in: v5.0.0, v4.2.0 |
:::

Verifica la sintassi dello script senza eseguirlo.

### `--completion-bash` {#-c---check}

**Aggiunto in: v10.12.0**

Stampa lo script di completamento bash utilizzabile per Node.js.

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.9.0, v20.18.0 | Il flag non è più sperimentale. |
| v14.9.0, v12.19.0 | Aggiunto in: v14.9.0, v12.19.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Fornisce condizioni di risoluzione [conditional exports](/it/nodejs/api/packages#conditional-exports) personalizzate.

È consentito un numero qualsiasi di nomi di condizioni stringa personalizzate.

Le condizioni Node.js predefinite di `"node"`, `"default"`, `"import"` e `"require"` si applicheranno sempre come definite.

Ad esempio, per eseguire un modulo con risoluzioni "development":

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | I flag `--cpu-prof` sono ora stabili. |
| v12.0.0 | Aggiunto in: v12.0.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Avvia il profiler CPU V8 all'avvio e scrive il profilo CPU su disco prima di uscire.

Se `--cpu-prof-dir` non è specificato, il profilo generato viene inserito nella directory di lavoro corrente.

Se `--cpu-prof-name` non è specificato, il profilo generato viene chiamato `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`.

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | I flag `--cpu-prof` sono ora stabili. |
| v12.0.0 | Aggiunto in: v12.0.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Specifica la directory in cui verranno inseriti i profili CPU generati da `--cpu-prof`.

Il valore predefinito è controllato dall'opzione della riga di comando [`--diagnostic-dir`](/it/nodejs/api/cli#--diagnostic-dirdirectory).


### `--cpu-prof-interval` {#--cpu-prof-dir}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | I flag `--cpu-prof` sono ora stabili. |
| v12.2.0 | Aggiunto in: v12.2.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Specifica l'intervallo di campionamento in microsecondi per i profili CPU generati da `--cpu-prof`. Il valore predefinito è 1000 microsecondi.

### `--cpu-prof-name` {#--cpu-prof-interval}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | I flag `--cpu-prof` sono ora stabili. |
| v12.0.0 | Aggiunto in: v12.0.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Specifica il nome del file del profilo CPU generato da `--cpu-prof`.

### `--diagnostic-dir=directory` {#--cpu-prof-name}

Imposta la directory in cui vengono scritti tutti i file di output diagnostici. Il valore predefinito è la directory di lavoro corrente.

Influenza la directory di output predefinita di:

- [`--cpu-prof-dir`](/it/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/it/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/it/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**Aggiunto in: v13.12.0, v12.17.0**

Disabilita la proprietà `Object.prototype.__proto__`. Se `mode` è `delete`, la proprietà viene rimossa completamente. Se `mode` è `throw`, gli accessi alla proprietà generano un'eccezione con il codice `ERR_PROTO_ACCESS`.

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

**Aggiunto in: v21.3.0, v20.11.0**

Disabilita specifici avvisi di processo tramite `code` o `type`.

Gli avvisi emessi da [`process.emitWarning()`](/it/nodejs/api/process#processemitwarningwarning-options) possono contenere un `code` e un `type`. Questa opzione non emetterà avvisi che hanno un `code` o un `type` corrispondente.

Elenco degli [avvisi di deprecazione](/it/nodejs/api/deprecations#list-of-deprecated-apis).

I tipi di avviso del core di Node.js sono: `DeprecationWarning` e `ExperimentalWarning`

Ad esempio, lo script seguente non emetterà [DEP0025 `require('node:sys')`](/it/nodejs/api/deprecations#dep0025-requirenodesys) quando eseguito con `node --disable-warning=DEP0025`:



::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

Ad esempio, lo script seguente emetterà [DEP0025 `require('node:sys')`](/it/nodejs/api/deprecations#dep0025-requirenodesys), ma non alcun avviso sperimentale (come [ExperimentalWarning: `vm.measureMemory` is an experimental feature](/it/nodejs/api/vm#vmmeasurememoryoptions) in \<=v21) quando eseguito con `node --disable-warning=ExperimentalWarning`:



::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm';

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**Aggiunto in: v22.2.0, v20.15.0**

Di default, Node.js abilita i controlli dei limiti di WebAssembly basati su trap-handler. Di conseguenza, V8 non ha bisogno di inserire controlli dei limiti inline nel codice compilato da WebAssembly, il che può accelerare significativamente l'esecuzione di WebAssembly, ma questa ottimizzazione richiede l'allocazione di una grande gabbia di memoria virtuale (attualmente 10GB). Se il processo Node.js non ha accesso a uno spazio di indirizzi di memoria virtuale sufficientemente grande a causa di configurazioni di sistema o limitazioni hardware, gli utenti non saranno in grado di eseguire alcun WebAssembly che implichi l'allocazione in questa gabbia di memoria virtuale e visualizzeranno un errore di memoria insufficiente.

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): could not allocate memory
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler` disabilita questa ottimizzazione in modo che gli utenti possano almeno eseguire WebAssembly (con prestazioni meno ottimali) quando lo spazio degli indirizzi di memoria virtuale disponibile per il loro processo Node.js è inferiore a quello necessario per la gabbia di memoria V8 WebAssembly.

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**Aggiunto in: v9.8.0**

Fa sì che le funzionalità del linguaggio integrate come `eval` e `new Function` che generano codice da stringhe generino invece un'eccezione. Ciò non influisce sul modulo `node:vm` di Node.js.

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | L'opzione `ipv6first` è ora supportata. |
| v17.0.0 | Il valore predefinito è stato modificato in `verbatim`. |
| v16.4.0, v14.18.0 | Aggiunto in: v16.4.0, v14.18.0 |
:::

Imposta il valore predefinito di `order` in [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/it/nodejs/api/dns#dnspromiseslookuphostname-options). Il valore può essere:

- `ipv4first`: imposta `order` predefinito su `ipv4first`.
- `ipv6first`: imposta `order` predefinito su `ipv6first`.
- `verbatim`: imposta `order` predefinito su `verbatim`.

Il valore predefinito è `verbatim` e [`dns.setDefaultResultOrder()`](/it/nodejs/api/dns#dnssetdefaultresultorderorder) ha una priorità maggiore rispetto a `--dns-result-order`.


### `--enable-fips` {#--dns-result-order=order}

**Aggiunto in: v6.0.0**

Abilita la crittografia conforme a FIPS all'avvio. (Richiede che Node.js sia compilato con OpenSSL compatibile con FIPS.)

### `--enable-network-family-autoselection` {#--enable-fips}

**Aggiunto in: v18.18.0**

Abilita l'algoritmo di selezione automatica della famiglia a meno che le opzioni di connessione non lo disabilitino esplicitamente.

### `--enable-source-maps` {#--enable-network-family-autoselection}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.11.0, v14.18.0 | Questa API non è più sperimentale. |
| v12.12.0 | Aggiunto in: v12.12.0 |
:::

Abilita il supporto per [Source Map v3](https://sourcemaps.info/spec) per le stack trace.

Quando si utilizza un transpiler, come TypeScript, le stack trace generate da un'applicazione fanno riferimento al codice transpilato, non alla posizione sorgente originale. `--enable-source-maps` abilita la memorizzazione nella cache delle Source Map e fa del suo meglio per segnalare le stack trace rispetto al file sorgente originale.

La sovrascrittura di `Error.prepareStackTrace` può impedire a `--enable-source-maps` di modificare la stack trace. Chiama e restituisci i risultati dell'originale `Error.prepareStackTrace` nella funzione di sovrascrittura per modificare la stack trace con le source map.

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Modifica l'errore e la traccia e formatta la stack trace con
  // l'originale Error.prepareStackTrace.
  return originalPrepareStackTrace(error, trace);
};
```
Tieni presente che l'abilitazione delle source map può introdurre latenza nella tua applicazione quando si accede a `Error.stack`. Se accedi frequentemente a `Error.stack` nella tua applicazione, tieni conto delle implicazioni sulle prestazioni di `--enable-source-maps`.

### `--entry-url` {#--enable-source-maps}

**Aggiunto in: v23.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Quando presente, Node.js interpreterà il punto di ingresso come un URL, piuttosto che un percorso.

Segue le regole di risoluzione dei [moduli ECMAScript](/it/nodejs/api/esm#modules-ecmascript-modules).

Qualsiasi parametro di query o hash nell'URL sarà accessibile tramite [`import.meta.url`](/it/nodejs/api/esm#importmetaurl).

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**Aggiunto in: v22.9.0**

Il comportamento è lo stesso di [`--env-file`](/it/nodejs/api/cli#--env-fileconfig), ma non viene generato un errore se il file non esiste.

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.7.0, v20.12.0 | Aggiunto il supporto per i valori multilinea. |
| v20.6.0 | Aggiunto in: v20.6.0 |
:::

Carica le variabili d'ambiente da un file relativo alla directory corrente, rendendole disponibili alle applicazioni su `process.env`. Le [variabili d'ambiente che configurano Node.js](/it/nodejs/api/cli#environment-variables), come `NODE_OPTIONS`, vengono analizzate e applicate. Se la stessa variabile è definita nell'ambiente e nel file, il valore dell'ambiente ha la precedenza.

È possibile passare più argomenti `--env-file`. I file successivi sovrascrivono le variabili preesistenti definite nei file precedenti.

Viene generato un errore se il file non esiste.

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
Il formato del file dovrebbe essere una riga per ogni coppia chiave-valore di nome della variabile d'ambiente e valore separati da `=`:

```text [TEXT]
PORT=3000
```
Qualsiasi testo dopo un `#` viene trattato come commento:

```text [TEXT]
# Questo è un commento {#--env-file=config}
PORT=3000 # Anche questo è un commento
```
I valori possono iniziare e terminare con le seguenti virgolette: ```, `"` o `'`. Vengono omessi dai valori.

```text [TEXT]
USERNAME="nodejs" # risulterà in `nodejs` come valore.
```
Sono supportati valori multilinea:

```text [TEXT]
MULTI_LINE="QUESTO È
UNA MULTILINEA"
# risulterà in `QUESTO È\nA MULTILINEA` come valore. {#this-is-a-comment}
```
La parola chiave Export prima di una chiave viene ignorata:

```text [TEXT]
export USERNAME="nodejs" # risulterà in `nodejs` come valore.
```
Se si desidera caricare le variabili d'ambiente da un file che potrebbe non esistere, è invece possibile utilizzare il flag [`--env-file-if-exists`](/it/nodejs/api/cli#--env-file-if-existsconfig).


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.6.0 | Eval ora supporta la rimozione dei tipi sperimentale. |
| v5.11.0 | Le librerie integrate sono ora disponibili come variabili predefinite. |
| v0.5.2 | Aggiunto in: v0.5.2 |
:::

Valuta l'argomento seguente come JavaScript. I moduli predefiniti nella REPL possono essere utilizzati anche in `script`.

Su Windows, usando `cmd.exe` un singolo apice non funzionerà correttamente perché riconosce solo le doppie virgolette `"` per le virgolette. In Powershell o Git bash, sia `'` che `"` sono utilizzabili.

È possibile eseguire codice contenente tipi inline passando [`--experimental-strip-types`](/it/nodejs/api/cli#--experimental-strip-types).

### `--experimental-async-context-frame` {#-e---eval-"script"}

**Aggiunto in: v22.7.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Abilita l'uso di [`AsyncLocalStorage`](/it/nodejs/api/async_context#class-asynclocalstorage) supportato da `AsyncContextFrame` anziché l'implementazione predefinita che si basa su async_hooks. Questo nuovo modello è implementato in modo molto diverso e quindi potrebbe presentare differenze nel modo in cui i dati di contesto fluiscono all'interno dell'applicazione. Pertanto, si raccomanda attualmente di assicurarsi che il comportamento dell'applicazione non sia influenzato da questa modifica prima di utilizzarla in produzione.

### `--experimental-eventsource` {#--experimental-async-context-frame}

**Aggiunto in: v22.3.0, v20.18.0**

Abilita l'esposizione della [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) nello scope globale.

### `--experimental-import-meta-resolve` {#--experimental-eventsource}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.6.0, v18.19.0 | import.meta.resolve sincrono reso disponibile per impostazione predefinita, con il flag mantenuto per abilitare il secondo argomento sperimentale come precedentemente supportato. |
| v13.9.0, v12.16.2 | Aggiunto in: v13.9.0, v12.16.2 |
:::

Abilita il supporto sperimentale dell'URL padre `import.meta.resolve()`, che consente di passare un secondo argomento `parentURL` per la risoluzione contestuale.

In precedenza controllava l'intera funzionalità `import.meta.resolve`.


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.11.1 | Questo flag è stato rinominato da `--loader` a `--experimental-loader`. |
| v8.8.0 | Aggiunto in: v8.8.0 |
:::

Specifica il `module` contenente gli [hook di personalizzazione del modulo](/it/nodejs/api/module#customization-hooks) esportati. `module` può essere qualsiasi stringa accettata come specificatore di [`import`](/it/nodejs/api/esm#import-specifiers).

### `--experimental-network-inspection` {#--experimental-loader=module}

**Aggiunto in: v22.6.0, v20.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Abilita il supporto sperimentale per l'ispezione di rete con Chrome DevTools.

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**Aggiunto in: v22.0.0, v20.17.0**

Se il modulo ES in fase di `require()` contiene `await` di primo livello, questo flag consente a Node.js di valutare il modulo, tentare di individuare gli await di primo livello e stampare la loro posizione per aiutare gli utenti a trovarli.

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Ora è vero per impostazione predefinita. |
| v22.0.0, v20.17.0 | Aggiunto in: v22.0.0, v20.17.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

Supporta il caricamento di un grafo di moduli ES sincrono in `require()`.

Vedi [Caricamento di moduli ECMAScript utilizzando `require()`](/it/nodejs/api/modules#loading-ecmascript-modules-using-require).

### `--experimental-sea-config` {#--experimental-require-module}

**Aggiunto in: v20.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Usa questo flag per generare un blob che può essere iniettato nel binario Node.js per produrre una [singola applicazione eseguibile](/it/nodejs/api/single-executable-applications). Consulta la documentazione su [questa configurazione](/it/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs) per i dettagli.


### `--experimental-shadow-realm` {#--experimental-sea-config}

**Aggiunto in: v19.0.0, v18.13.0**

Usa questo flag per abilitare il supporto a [ShadowRealm](https://github.com/tc39/proposal-shadowrealm).

### `--experimental-strip-types` {#--experimental-shadow-realm}

**Aggiunto in: v22.6.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo attivo
:::

Abilita la rimozione sperimentale dei tipi per i file TypeScript. Per maggiori informazioni, consulta la documentazione sulla [rimozione dei tipi TypeScript](/it/nodejs/api/typescript#type-stripping).

### `--experimental-test-coverage` {#--experimental-strip-types}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0, v18.17.0 | Questa opzione può essere utilizzata con `--test`. |
| v19.7.0, v18.15.0 | Aggiunto in: v19.7.0, v18.15.0 |
:::

Quando utilizzato in combinazione con il modulo `node:test`, un report sulla code coverage viene generato come parte dell'output del test runner. Se non vengono eseguiti test, non viene generato alcun report sulla coverage. Consulta la documentazione sulla [raccolta della code coverage dai test](/it/nodejs/api/test#collecting-code-coverage) per maggiori dettagli.

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**Aggiunto in: v22.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

Configura il tipo di isolamento dei test utilizzato nel test runner. Quando `mode` è `'process'`, ogni file di test viene eseguito in un processo figlio separato. Quando `mode` è `'none'`, tutti i file di test vengono eseguiti nello stesso processo del test runner. La modalità di isolamento predefinita è `'process'`. Questo flag viene ignorato se il flag `--test` non è presente. Consulta la sezione [modello di esecuzione del test runner](/it/nodejs/api/test#test-runner-execution-model) per maggiori informazioni.

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**Aggiunto in: v22.3.0, v20.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).0 - Sviluppo iniziale
:::

Abilita il mocking dei moduli nel test runner.


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**Aggiunto in: v22.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sviluppo attivo
:::

Abilita la trasformazione della sintassi esclusivamente TypeScript in codice JavaScript. Implica `--experimental-strip-types` e `--enable-source-maps`.

### `--experimental-vm-modules` {#--experimental-transform-types}

**Aggiunto in: v9.6.0**

Abilita il supporto sperimentale ai moduli ES nel modulo `node:vm`.

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0, v18.17.0 | Questa opzione non è più necessaria poiché WASI è abilitato per impostazione predefinita, ma può comunque essere passata. |
| v13.6.0 | modificato da `--experimental-wasi-unstable-preview0` a `--experimental-wasi-unstable-preview1`. |
| v13.3.0, v12.16.0 | Aggiunto in: v13.3.0, v12.16.0 |
:::

Abilita il supporto sperimentale per WebAssembly System Interface (WASI).

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**Aggiunto in: v12.3.0**

Abilita il supporto sperimentale per i moduli WebAssembly.

### `--experimental-webstorage` {#--experimental-wasm-modules}

**Aggiunto in: v22.4.0**

Abilita il supporto sperimentale per [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

### `--expose-gc` {#--experimental-webstorage}

**Aggiunto in: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale. Questo flag è ereditato da V8 ed è soggetto a modifiche a monte.
:::

Questo flag esporrà l'estensione gc da V8.

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**Aggiunto in: v12.12.0**

Disabilita il caricamento di addon nativi che non sono [consapevoli del contesto](/it/nodejs/api/addons#context-aware-addons).

### `--force-fips` {#--force-context-aware}

**Aggiunto in: v6.0.0**

Forza la crittografia conforme a FIPS all'avvio. (Non può essere disabilitato dal codice script.) (Gli stessi requisiti di `--enable-fips`.)

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**Aggiunto in: v18.3.0, v16.17.0**

Impone l'evento `uncaughtException` sui callback asincroni Node-API.

Per evitare che un componente aggiuntivo esistente arresti in modo anomalo il processo, questo flag non è abilitato per impostazione predefinita. In futuro, questo flag sarà abilitato per impostazione predefinita per imporre il comportamento corretto.


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**Aggiunto in: v11.12.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Abilita gli intrinsics frozen sperimentali come `Array` e `Object`.

È supportato solo il contesto radice. Non vi è alcuna garanzia che `globalThis.Array` sia effettivamente il riferimento intrinseco predefinito. Il codice potrebbe interrompersi con questo flag.

Per consentire l'aggiunta di polyfill, sia [`--require`](/it/nodejs/api/cli#-r---require-module) che [`--import`](/it/nodejs/api/cli#--importmodule) vengono eseguiti prima di congelare gli intrinsics.

### `--heap-prof` {#--frozen-intrinsics}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | I flag `--heap-prof` sono ora stabili. |
| v12.4.0 | Aggiunto in: v12.4.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Avvia il profiler heap V8 all'avvio e scrive il profilo heap su disco prima di uscire.

Se `--heap-prof-dir` non è specificato, il profilo generato viene inserito nella directory di lavoro corrente.

Se `--heap-prof-name` non è specificato, il profilo generato viene denominato `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`.

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```
### `--heap-prof-dir` {#--heap-prof}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | I flag `--heap-prof` sono ora stabili. |
| v12.4.0 | Aggiunto in: v12.4.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Specifica la directory in cui verranno inseriti i profili heap generati da `--heap-prof`.

Il valore predefinito è controllato dall'opzione della riga di comando [`--diagnostic-dir`](/it/nodejs/api/cli#--diagnostic-dirdirectory).

### `--heap-prof-interval` {#--heap-prof-dir}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | I flag `--heap-prof` sono ora stabili. |
| v12.4.0 | Aggiunto in: v12.4.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Specifica l'intervallo di campionamento medio in byte per i profili heap generati da `--heap-prof`. Il valore predefinito è 512 * 1024 byte.


### `--heap-prof-name` {#--heap-prof-interval}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | I flag `--heap-prof` sono ora stabili. |
| v12.4.0 | Aggiunto in: v12.4.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Specifica il nome del file del profilo heap generato da `--heap-prof`.

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**Aggiunto in: v15.1.0, v14.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Scrive un'istantanea dell'heap V8 su disco quando l'utilizzo dell'heap V8 si sta avvicinando al limite dell'heap. `count` dovrebbe essere un numero intero non negativo (nel qual caso Node.js non scriverà più di `max_count` istantanee su disco).

Quando si generano istantanee, la garbage collection può essere attivata e ridurre l'utilizzo dell'heap. Pertanto, più istantanee possono essere scritte su disco prima che l'istanza di Node.js esaurisca definitivamente la memoria. Queste istantanee dell'heap possono essere confrontate per determinare quali oggetti vengono allocati durante il periodo in cui vengono scattate istantanee consecutive. Non è garantito che Node.js scriva esattamente `max_count` istantanee su disco, ma farà del suo meglio per generare almeno una e fino a `max_count` istantanee prima che l'istanza di Node.js esaurisca la memoria quando `max_count` è maggiore di `0`.

La generazione di istantanee V8 richiede tempo e memoria (sia memoria gestita dall'heap V8 che memoria nativa al di fuori dell'heap V8). Più grande è l'heap, più risorse necessita. Node.js adatterà l'heap V8 per adattarsi al sovraccarico di memoria aggiuntivo dell'heap V8 e farà del suo meglio per evitare di utilizzare tutta la memoria disponibile per il processo. Quando il processo utilizza più memoria di quanto il sistema ritenga appropriato, il processo può essere interrotto bruscamente dal sistema, a seconda della configurazione del sistema.

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```


### `--heapsnapshot-signal=signal` {#--heapsnapshot-near-heap-limit=max_count}

**Aggiunto in: v12.0.0**

Abilita un gestore di segnale che fa sì che il processo Node.js scriva un dump dell'heap quando viene ricevuto il segnale specificato. `signal` deve essere un nome di segnale valido. Disabilitato per impostazione predefinita.

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**Aggiunto in: v0.1.3**

Stampa le opzioni della riga di comando di node. L'output di questa opzione è meno dettagliato di questo documento.

### `--icu-data-dir=file` {#-h---help}

**Aggiunto in: v0.11.15**

Specifica il percorso di caricamento dei dati ICU. (Sovrascrive `NODE_ICU_DATA`.)

### `--import=module` {#--icu-data-dir=file}

**Aggiunto in: v19.0.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Precarica il modulo specificato all'avvio. Se il flag viene fornito più volte, ogni modulo verrà eseguito sequenzialmente nell'ordine in cui appaiono, a partire da quelli forniti in [`NODE_OPTIONS`](/it/nodejs/api/cli#node_optionsoptions).

Segue le regole di risoluzione del [modulo ECMAScript](/it/nodejs/api/esm#modules-ecmascript-modules). Utilizza [`--require`](/it/nodejs/api/cli#-r---require-module) per caricare un [modulo CommonJS](/it/nodejs/api/modules). I moduli precaricati con `--require` verranno eseguiti prima dei moduli precaricati con `--import`.

I moduli vengono precaricati nel thread principale così come in qualsiasi thread worker, processo forkato o processo in cluster.

### `--input-type=type` {#--import=module}

**Aggiunto in: v12.0.0**

Questo configura Node.js per interpretare l'input `--eval` o `STDIN` come CommonJS o come un modulo ES. I valori validi sono `"commonjs"` o `"module"`. Il valore predefinito è `"commonjs"`.

La REPL non supporta questa opzione. L'utilizzo di `--input-type=module` con [`--print`](/it/nodejs/api/cli#-p---print-script) genererà un errore, poiché `--print` non supporta la sintassi del modulo ES.


### `--insecure-http-parser` {#--input-type=type}

**Aggiunto in: v13.4.0, v12.15.0, v10.19.0**

Abilita i flag di permissività sul parser HTTP. Ciò potrebbe consentire l'interoperabilità con implementazioni HTTP non conformi.

Quando abilitato, il parser accetterà quanto segue:

- Valori di intestazione HTTP non validi.
- Versioni HTTP non valide.
- Consentire messaggi contenenti entrambe le intestazioni `Transfer-Encoding` e `Content-Length`.
- Consentire dati extra dopo il messaggio quando è presente `Connection: close`.
- Consentire codifiche di trasferimento extra dopo che è stato fornito `chunked`.
- Consentire l'uso di `\n` come separatore di token anziché `\r\n`.
- Consentire che `\r\n` non venga fornito dopo un chunk.
- Consentire la presenza di spazi dopo una dimensione del chunk e prima di `\r\n`.

Tutto quanto sopra esporrà la tua applicazione ad attacchi di request smuggling o poisoning. Evita di utilizzare questa opzione.

#### Avviso: associare l'inspector a una combinazione IP:porta pubblica è insicuro {#--insecure-http-parser}

Associare l'inspector a un IP pubblico (incluso `0.0.0.0`) con una porta aperta è insicuro, poiché consente agli host esterni di connettersi all'inspector ed eseguire un attacco di [esecuzione di codice remoto](https://www.owasp.org/index.php/Code_Injection).

Se si specifica un host, assicurarsi che:

- L'host non sia accessibile da reti pubbliche.
- Un firewall non consenta connessioni indesiderate sulla porta.

**Più specificamente, <code>--inspect=0.0.0.0</code> è insicuro se la porta (<code>9229</code> per
impostazione predefinita) non è protetta da firewall.**

Vedere la sezione [implicazioni sulla sicurezza del debug](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications) per ulteriori informazioni.

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**Aggiunto in: v7.6.0**

Attiva l'inspector su `host:port` e interrompi all'inizio dello script utente. L'`host:port` predefinito è `127.0.0.1:9229`. Se viene specificata la porta `0`, verrà utilizzata una porta disponibile casuale.

Vedi [Integrazione dell'Inspector V8 per Node.js](/it/nodejs/api/debugger#v8-inspector-integration-for-nodejs) per ulteriori spiegazioni sul debugger di Node.js.

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**Aggiunto in: v7.6.0**

Imposta l'`host:port` da utilizzare quando l'inspector è attivato. Utile quando si attiva l'inspector inviando il segnale `SIGUSR1`.

L'host predefinito è `127.0.0.1`. Se viene specificata la porta `0`, verrà utilizzata una porta disponibile casuale.

Vedere l'[avviso di sicurezza](/it/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) di seguito relativo all'utilizzo del parametro `host`.


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

Specifica le modalità di esposizione dell'URL del websocket dell'inspector.

Di default, l'URL del websocket dell'inspector è disponibile in stderr e sotto l'endpoint `/json/list` su `http://host:port/json/list`.

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**Aggiunto in: v22.2.0, v20.15.0**

Attiva l'inspector su `host:port` e aspetta che un debugger venga collegato. Il `host:port` predefinito è `127.0.0.1:9229`. Se viene specificata la porta `0`, verrà utilizzata una porta casuale disponibile.

Vedi [Integrazione V8 Inspector per Node.js](/it/nodejs/api/debugger#v8-inspector-integration-for-nodejs) per ulteriori spiegazioni sul debugger di Node.js.

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**Aggiunto in: v6.3.0**

Attiva l'inspector su `host:port`. Il valore predefinito è `127.0.0.1:9229`. Se viene specificata la porta `0`, verrà utilizzata una porta casuale disponibile.

L'integrazione di V8 inspector consente a strumenti come Chrome DevTools e IDE di eseguire il debug e profilare istanze di Node.js. Gli strumenti si collegano alle istanze di Node.js tramite una porta TCP e comunicano utilizzando il [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/). Vedi [Integrazione V8 Inspector per Node.js](/it/nodejs/api/debugger#v8-inspector-integration-for-nodejs) per ulteriori spiegazioni sul debugger di Node.js.

### `-i`, `--interactive` {#--inspect=hostport}

**Aggiunto in: v0.7.7**

Apre la REPL anche se stdin non sembra essere un terminale.

### `--jitless` {#-i---interactive}

**Aggiunto in: v12.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale. Questo flag è ereditato da V8 ed è soggetto a modifiche upstream.
:::

Disabilita l'[allocazione a runtime di memoria eseguibile](https://v8.dev/blog/jitless). Ciò potrebbe essere richiesto su alcune piattaforme per motivi di sicurezza. Può anche ridurre la superficie di attacco su altre piattaforme, ma l'impatto sulle prestazioni potrebbe essere grave.

### `--localstorage-file=file` {#--jitless}

**Aggiunto in: v22.4.0**

Il file utilizzato per memorizzare i dati di `localStorage`. Se il file non esiste, viene creato la prima volta che si accede a `localStorage`. Lo stesso file può essere condiviso tra più processi Node.js contemporaneamente. Questo flag è un no-op a meno che Node.js non venga avviato con il flag `--experimental-webstorage`.


### `--max-http-header-size=dimensione` {#--localstorage-file=file}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.13.0 | Modifica della dimensione massima predefinita degli header HTTP da 8 KiB a 16 KiB. |
| v11.6.0, v10.15.0 | Aggiunta in: v11.6.0, v10.15.0 |
:::

Specifica la dimensione massima, in byte, degli header HTTP. Il valore predefinito è 16 KiB.

### `--napi-modules` {#--max-http-header-size=size}

**Aggiunta in: v7.10.0**

Questa opzione è un no-op. Viene mantenuta per compatibilità.

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**Aggiunta in: v22.1.0, v20.13.0**

Imposta il valore predefinito per il timeout del tentativo di selezione automatica della famiglia di rete. Per ulteriori informazioni, consulta [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/it/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**Aggiunta in: v16.10.0, v14.19.0**

Disabilita la condizione di esportazione `node-addons`, nonché il caricamento di componenti aggiuntivi nativi. Quando viene specificato `--no-addons`, la chiamata a `process.dlopen` o la richiesta di un componente aggiuntivo C++ nativo non riusciranno e genereranno un'eccezione.

### `--no-deprecation` {#--no-addons}

**Aggiunta in: v0.8.0**

Disattiva gli avvisi di deprecazione.

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.7.0 | Il rilevamento della sintassi è abilitato di default. |
| v21.1.0, v20.10.0 | Aggiunta in: v21.1.0, v20.10.0 |
:::

Disabilita l'utilizzo del [rilevamento della sintassi](/it/nodejs/api/packages#syntax-detection) per determinare il tipo di modulo.

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**Aggiunta in: v21.2.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Disabilita l'esposizione dell'[API Navigator](/it/nodejs/api/globals#navigator) nello scope globale.

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**Aggiunta in: v16.6.0**

Utilizza questo flag per disabilitare l'await di livello superiore in REPL.

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Ora è false per impostazione predefinita. |
| v22.0.0, v20.17.0 | Aggiunta in: v22.0.0, v20.17.0 |
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sviluppo Attivo
:::

Disabilita il supporto per il caricamento di un grafo di moduli ES sincrono in `require()`.

Vedi [Caricamento di moduli ECMAScript utilizzando `require()`](/it/nodejs/api/modules#loading-ecmascript-modules-using-require).


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.4.0 | SQLite non è più contrassegnato come sperimentale, ma lo è ancora. |
| v22.5.0 | Aggiunto in: v22.5.0 |
:::

Disabilita il modulo sperimentale [`node:sqlite`](/it/nodejs/api/sqlite).

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**Aggiunto in: v22.0.0**

Disabilita l'esposizione di [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) nello scope globale.

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**Aggiunto in: v17.0.0**

Nasconde informazioni aggiuntive su eccezioni fatali che causano l'uscita.

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**Aggiunto in: v9.0.0**

Disabilita i controlli di runtime per `async_hooks`. Questi saranno comunque abilitati dinamicamente quando `async_hooks` è abilitato.

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**Aggiunto in: v16.10.0**

Non cercare moduli da percorsi globali come `$HOME/.node_modules` e `$NODE_PATH`.

### `--no-network-family-autoselection` {#--no-global-search-paths}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Il flag è stato rinominato da `--no-enable-network-family-autoselection` a `--no-network-family-autoselection`. Il vecchio nome può ancora funzionare come alias. |
| v19.4.0 | Aggiunto in: v19.4.0 |
:::

Disabilita l'algoritmo di selezione automatica della famiglia a meno che le opzioni di connessione non lo abilitino esplicitamente.

### `--no-warnings` {#--no-network-family-autoselection}

**Aggiunto in: v6.0.0**

Silenzia tutti gli avvisi del processo (comprese le deprecazioni).

### `--node-memory-debug` {#--no-warnings}

**Aggiunto in: v15.0.0, v14.18.0**

Abilita controlli di debug extra per le perdite di memoria negli elementi interni di Node.js. Questo è solitamente utile solo per gli sviluppatori che eseguono il debug di Node.js stesso.

### `--openssl-config=file` {#--node-memory-debug}

**Aggiunto in: v6.9.0**

Carica un file di configurazione OpenSSL all'avvio. Tra gli altri usi, questo può essere usato per abilitare la crittografia conforme a FIPS se Node.js è costruito con OpenSSL abilitato a FIPS.

### `--openssl-legacy-provider` {#--openssl-config=file}

**Aggiunto in: v17.0.0, v16.17.0**

Abilita il provider legacy di OpenSSL 3.0. Per ulteriori informazioni, consultare [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy).

### `--openssl-shared-config` {#--openssl-legacy-provider}

**Aggiunto in: v18.5.0, v16.17.0, v14.21.0**

Abilita la sezione di configurazione predefinita di OpenSSL, `openssl_conf` per essere letta dal file di configurazione di OpenSSL. Il file di configurazione predefinito si chiama `openssl.cnf` ma può essere cambiato usando la variabile d'ambiente `OPENSSL_CONF`, o usando l'opzione da linea di comando `--openssl-config`. La posizione del file di configurazione predefinito di OpenSSL dipende da come OpenSSL è collegato a Node.js. La condivisione della configurazione di OpenSSL potrebbe avere implicazioni indesiderate ed è raccomandato usare una sezione di configurazione specifica per Node.js che è `nodejs_conf` ed è quella predefinita quando questa opzione non è usata.


### `--pending-deprecation` {#--openssl-shared-config}

**Aggiunto in: v8.0.0**

Emette avvisi di deprecazione in sospeso.

Le deprecazioni in sospeso sono generalmente identiche a una deprecazione in fase di esecuzione, con l'eccezione degna di nota che sono *disattivate* per impostazione predefinita e non verranno emesse a meno che non sia impostato il flag della riga di comando `--pending-deprecation` o la variabile d'ambiente `NODE_PENDING_DEPRECATION=1`. Le deprecazioni in sospeso vengono utilizzate per fornire una sorta di meccanismo selettivo di "preavviso" che gli sviluppatori possono sfruttare per rilevare l'uso di API deprecate.

### `--permission` {#--pending-deprecation}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.5.0 | Il modello di autorizzazioni è ora stabile. |
| v20.0.0 | Aggiunto in: v20.0.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Abilita il Modello di Autorizzazioni per il processo corrente. Quando è abilitato, le seguenti autorizzazioni sono limitate:

- File System - gestibile tramite i flag [`--allow-fs-read`](/it/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/it/nodejs/api/cli#--allow-fs-write)
- Child Process - gestibile tramite il flag [`--allow-child-process`](/it/nodejs/api/cli#--allow-child-process)
- Worker Threads - gestibile tramite il flag [`--allow-worker`](/it/nodejs/api/cli#--allow-worker)
- WASI - gestibile tramite il flag [`--allow-wasi`](/it/nodejs/api/cli#--allow-wasi)
- Addons - gestibile tramite il flag [`--allow-addons`](/it/nodejs/api/cli#--allow-addons)

### `--preserve-symlinks` {#--permission}

**Aggiunto in: v6.3.0**

Indica al caricatore del modulo di conservare i link simbolici durante la risoluzione e la memorizzazione nella cache dei moduli.

Per impostazione predefinita, quando Node.js carica un modulo da un percorso collegato simbolicamente a una diversa posizione su disco, Node.js dereferenzia il link e utilizza il "percorso reale" effettivo su disco del modulo sia come identificatore sia come percorso radice per individuare altri moduli di dipendenza. Nella maggior parte dei casi, questo comportamento predefinito è accettabile. Tuttavia, quando si utilizzano dipendenze peer collegate simbolicamente, come illustrato nell'esempio seguente, il comportamento predefinito fa sì che venga generata un'eccezione se `moduleA` tenta di richiedere `moduleB` come dipendenza peer:

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```
Il flag della riga di comando `--preserve-symlinks` indica a Node.js di utilizzare il percorso del link simbolico per i moduli anziché il percorso reale, consentendo di trovare le dipendenze peer collegate simbolicamente.

Si noti, tuttavia, che l'utilizzo di `--preserve-symlinks` può avere altri effetti collaterali. In particolare, i moduli *nativi* collegati simbolicamente potrebbero non essere caricati se sono collegati da più di una posizione nell'albero delle dipendenze (Node.js li vedrebbe come due moduli separati e tenterebbe di caricare il modulo più volte, causando la generazione di un'eccezione).

Il flag `--preserve-symlinks` non si applica al modulo principale, il che consente a `node --preserve-symlinks node_module/.bin/\<foo\>` di funzionare. Per applicare lo stesso comportamento al modulo principale, utilizzare anche `--preserve-symlinks-main`.


### `--preserve-symlinks-main` {#--preserve-symlinks}

**Aggiunto in: v10.2.0**

Indica al loader dei moduli di preservare i collegamenti simbolici durante la risoluzione e la memorizzazione nella cache del modulo principale (`require.main`).

Questo flag esiste in modo che il modulo principale possa essere incluso nello stesso comportamento che `--preserve-symlinks` offre a tutti gli altri import; tuttavia, sono flag separati, per garantire la retrocompatibilità con le versioni precedenti di Node.js.

`--preserve-symlinks-main` non implica `--preserve-symlinks`; usa `--preserve-symlinks-main` in aggiunta a `--preserve-symlinks` quando non è desiderabile seguire i collegamenti simbolici prima di risolvere i percorsi relativi.

Vedi [`--preserve-symlinks`](/it/nodejs/api/cli#--preserve-symlinks) per maggiori informazioni.

### `-p`, `--print "script"` {#--preserve-symlinks-main}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v5.11.0 | Le librerie incorporate ora sono disponibili come variabili predefinite. |
| v0.6.4 | Aggiunto in: v0.6.4 |
:::

Identico a `-e` ma stampa il risultato.

### `--prof` {#-p---print-"script"}

**Aggiunto in: v2.0.0**

Genera l'output del profiler V8.

### `--prof-process` {#--prof}

**Aggiunto in: v5.2.0**

Elabora l'output del profiler V8 generato utilizzando l'opzione V8 `--prof`.

### `--redirect-warnings=file` {#--prof-process}

**Aggiunto in: v8.0.0**

Scrive gli avvisi del processo nel file specificato anziché stamparli su stderr. Il file verrà creato se non esiste e verrà aggiunto se esiste già. Se si verifica un errore durante il tentativo di scrivere l'avviso nel file, l'avviso verrà scritto invece su stderr.

Il nome del `file` può essere un percorso assoluto. In caso contrario, la directory predefinita in cui verrà scritto è controllata dall'opzione della riga di comando [`--diagnostic-dir`](/it/nodejs/api/cli#--diagnostic-dirdirectory).

### `--report-compact` {#--redirect-warnings=file}

**Aggiunto in: v13.12.0, v12.17.0**

Scrive i report in un formato compatto, JSON a riga singola, più facilmente utilizzabile dai sistemi di elaborazione dei log rispetto al formato predefinito a più righe progettato per il consumo umano.

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa opzione non è più sperimentale. |
| v12.0.0 | Modificato da `--diagnostic-report-directory` a `--report-directory`. |
| v11.8.0 | Aggiunto in: v11.8.0 |
:::

Posizione in cui verrà generato il report.


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**Aggiunto in: v23.3.0**

Quando viene passato `--report-exclude-env`, il report diagnostico generato non conterrà i dati di `environmentVariables`.

### `--report-exclude-network` {#--report-exclude-env}

**Aggiunto in: v22.0.0, v20.13.0**

Esclude `header.networkInterfaces` dal report diagnostico. Di default, questa opzione non è impostata e le interfacce di rete sono incluse.

### `--report-filename=filename` {#--report-exclude-network}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa opzione non è più sperimentale. |
| v12.0.0 | modificato da `--diagnostic-report-filename` a `--report-filename`. |
| v11.8.0 | Aggiunto in: v11.8.0 |
:::

Nome del file in cui verrà scritto il report.

Se il nome del file è impostato su `'stdout'` o `'stderr'`, il report viene scritto rispettivamente nello stdout o nello stderr del processo.

### `--report-on-fatalerror` {#--report-filename=filename}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | Questa opzione non è più sperimentale. |
| v12.0.0 | modificato da `--diagnostic-report-on-fatalerror` a `--report-on-fatalerror`. |
| v11.8.0 | Aggiunto in: v11.8.0 |
:::

Abilita l'attivazione del report in caso di errori irreversibili (errori interni al runtime di Node.js come esaurimento della memoria) che portano alla terminazione dell'applicazione. Utile per ispezionare vari elementi di dati diagnostici come heap, stack, stato del ciclo di eventi, consumo di risorse, ecc. per ragionare sull'errore irreversibile.

### `--report-on-signal` {#--report-on-fatalerror}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa opzione non è più sperimentale. |
| v12.0.0 | modificato da `--diagnostic-report-on-signal` a `--report-on-signal`. |
| v11.8.0 | Aggiunto in: v11.8.0 |
:::

Abilita la generazione di report alla ricezione del segnale specificato (o predefinito) al processo Node.js in esecuzione. Il segnale per attivare il report è specificato tramite `--report-signal`.

### `--report-signal=signal` {#--report-on-signal}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.12.0, v12.17.0 | Questa opzione non è più sperimentale. |
| v12.0.0 | modificato da `--diagnostic-report-signal` a `--report-signal`. |
| v11.8.0 | Aggiunto in: v11.8.0 |
:::

Imposta o reimposta il segnale per la generazione del report (non supportato su Windows). Il segnale predefinito è `SIGUSR2`.


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [Cronologia]
| Versione | Cambiamenti |
| --- | --- |
| v18.8.0, v16.18.0 | Il report non viene generato se l'eccezione non catturata viene gestita. |
| v13.12.0, v12.17.0 | Questa opzione non è più sperimentale. |
| v12.0.0 | modificato da `--diagnostic-report-uncaught-exception` a `--report-uncaught-exception`. |
| v11.8.0 | Aggiunto in: v11.8.0 |
:::

Abilita la generazione di un report quando il processo termina a causa di un'eccezione non catturata. Utile quando si ispeziona lo stack JavaScript in combinazione con lo stack nativo e altri dati dell'ambiente di runtime.

### `-r`, `--require module` {#--report-uncaught-exception}

**Aggiunto in: v1.6.0**

Precarica il modulo specificato all'avvio.

Segue le regole di risoluzione dei moduli di `require()`. `module` può essere sia un percorso a un file, sia un nome di modulo node.

Sono supportati solo i moduli CommonJS. Utilizzare [`--import`](/it/nodejs/api/cli#--importmodule) per precaricare un [modulo ECMAScript](/it/nodejs/api/esm#modules-ecmascript-modules). I moduli precaricati con `--require` verranno eseguiti prima dei moduli precaricati con `--import`.

I moduli vengono precaricati nel thread principale così come in tutti i thread worker, processi fork o processi cluster.

### `--run` {#-r---require-module}

::: info [Cronologia]
| Versione | Cambiamenti |
| --- | --- |
| v22.3.0 | Aggiunta la variabile d'ambiente NODE_RUN_SCRIPT_NAME. |
| v22.3.0 | Aggiunta la variabile d'ambiente NODE_RUN_PACKAGE_JSON_PATH. |
| v22.3.0 | Risale fino alla directory principale e trova un file `package.json` da cui eseguire il comando, e aggiorna di conseguenza la variabile d'ambiente `PATH`. |
| v22.0.0 | Aggiunto in: v22.0.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Esegue un comando specificato dall'oggetto `"scripts"` di un file package.json. Se viene fornito un `"command"` mancante, elencherà gli script disponibili.

`--run` risale fino alla directory root e trova un file `package.json` da cui eseguire il comando.

`--run` antepone `./node_modules/.bin` per ogni antenato della directory corrente, a `PATH` per eseguire i binari da diverse cartelle in cui sono presenti più directory `node_modules`, se `ancestor-folder/node_modules/.bin` è una directory.

`--run` esegue il comando nella directory contenente il relativo `package.json`.

Ad esempio, il seguente comando eseguirà lo script `test` del `package.json` nella cartella corrente:

```bash [BASH]
$ node --run test
```
È anche possibile passare argomenti al comando. Qualsiasi argomento dopo `--` verrà aggiunto allo script:

```bash [BASH]
$ node --run test -- --verbose
```

#### Limitazioni intenzionali {#--run}

`node --run` non è pensato per corrispondere ai comportamenti di `npm run` o dei comandi `run` di altri gestori di pacchetti. L'implementazione di Node.js è intenzionalmente più limitata, al fine di concentrarsi sulle massime prestazioni per i casi d'uso più comuni. Alcune funzionalità di altre implementazioni di `run` che sono intenzionalmente escluse sono:

- Esecuzione di script `pre` o `post` oltre allo script specificato.
- Definizione di variabili d'ambiente specifiche del gestore di pacchetti.

#### Variabili d'ambiente {#intentional-limitations}

Le seguenti variabili d'ambiente sono impostate quando si esegue uno script con `--run`:

- `NODE_RUN_SCRIPT_NAME`: Il nome dello script in esecuzione. Ad esempio, se `--run` viene utilizzato per eseguire `test`, il valore di questa variabile sarà `test`.
- `NODE_RUN_PACKAGE_JSON_PATH`: Il percorso del `package.json` che viene elaborato.

### `--secure-heap-min=n` {#environment-variables}

**Aggiunto in: v15.6.0**

Quando si usa `--secure-heap`, il flag `--secure-heap-min` specifica l'allocazione minima dall'heap sicuro. Il valore minimo è `2`. Il valore massimo è il minore tra `--secure-heap` e `2147483647`. Il valore fornito deve essere una potenza di due.

### `--secure-heap=n` {#--secure-heap-min=n}

**Aggiunto in: v15.6.0**

Inizializza un heap sicuro OpenSSL di `n` byte. Quando inizializzato, l'heap sicuro viene utilizzato per tipi selezionati di allocazioni all'interno di OpenSSL durante la generazione di chiavi e altre operazioni. Questo è utile, ad esempio, per impedire che informazioni sensibili vengano divulgate a causa di overrun o underrun del puntatore.

L'heap sicuro è di dimensioni fisse e non può essere ridimensionato in fase di esecuzione, quindi, se utilizzato, è importante selezionare un heap sufficientemente grande da coprire tutti gli usi dell'applicazione.

La dimensione dell'heap fornita deve essere una potenza di due. Qualsiasi valore inferiore a 2 disabiliterà l'heap sicuro.

L'heap sicuro è disabilitato per impostazione predefinita.

L'heap sicuro non è disponibile su Windows.

Vedere [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init) per maggiori dettagli.

### `--snapshot-blob=path` {#--secure-heap=n}

**Aggiunto in: v18.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Quando usato con `--build-snapshot`, `--snapshot-blob` specifica il percorso in cui viene scritto il blob snapshot generato. Se non specificato, il blob generato viene scritto in `snapshot.blob` nella directory di lavoro corrente.

Quando usato senza `--build-snapshot`, `--snapshot-blob` specifica il percorso del blob utilizzato per ripristinare lo stato dell'applicazione.

Quando si carica uno snapshot, Node.js controlla che:

Se non corrispondono, Node.js si rifiuta di caricare lo snapshot ed esce con codice di stato 1.


### `--test` {#--snapshot-blob=path}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Il test runner è ora stabile. |
| v19.2.0, v18.13.0 | Il test runner ora supporta l'esecuzione in modalità watch. |
| v18.1.0, v16.17.0 | Aggiunto in: v18.1.0, v16.17.0 |
:::

Avvia il test runner da riga di comando di Node.js. Questo flag non può essere combinato con `--watch-path`, `--check`, `--eval`, `--interactive` o l'inspector. Consulta la documentazione su [esecuzione di test dalla riga di comando](/it/nodejs/api/test#running-tests-from-the-command-line) per maggiori dettagli.

### `--test-concurrency` {#--test}

**Aggiunto in: v21.0.0, v20.10.0, v18.19.0**

Il numero massimo di file di test che la CLI del test runner eseguirà contemporaneamente. Se `--experimental-test-isolation` è impostato su `'none'`, questo flag viene ignorato e la concorrenza è uno. Altrimenti, la concorrenza predefinita è `os.availableParallelism() - 1`.

### `--test-coverage-branches=threshold` {#--test-concurrency}

**Aggiunto in: v22.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Richiede una percentuale minima di branch coperti. Se la code coverage non raggiunge la soglia specificata, il processo uscirà con codice `1`.

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Esclude file specifici dalla code coverage utilizzando un pattern glob, che può corrispondere sia a percorsi di file assoluti che relativi.

Questa opzione può essere specificata più volte per escludere più pattern glob.

Se vengono forniti sia `--test-coverage-exclude` che `--test-coverage-include`, i file devono soddisfare **entrambi** i criteri per essere inclusi nel report di coverage.

Per impostazione predefinita, tutti i file di test corrispondenti vengono esclusi dal report di coverage. Specificare questa opzione sovrascriverà il comportamento predefinito.

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**Aggiunto in: v22.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Richiede una percentuale minima di funzioni coperte. Se la code coverage non raggiunge la soglia specificata, il processo uscirà con codice `1`.


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**Aggiunto in: v22.5.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Include file specifici nella code coverage utilizzando un pattern glob, che può corrispondere sia a percorsi di file assoluti che relativi.

Questa opzione può essere specificata più volte per includere più pattern glob.

Se vengono forniti sia `--test-coverage-exclude` che `--test-coverage-include`, i file devono soddisfare **entrambi** i criteri per essere inclusi nel report di coverage.

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**Aggiunto in: v22.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Richiede una percentuale minima di linee coperte. Se la code coverage non raggiunge la soglia specificata, il processo terminerà con il codice `1`.

### `--test-force-exit` {#--test-coverage-lines=threshold}

**Aggiunto in: v22.0.0, v20.14.0**

Configura il test runner per terminare il processo una volta che tutti i test conosciuti hanno terminato l'esecuzione, anche se il ciclo di eventi altrimenti rimarrebbe attivo.

### `--test-name-pattern` {#--test-force-exit}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Il test runner è ora stabile. |
| v18.11.0 | Aggiunto in: v18.11.0 |
:::

Un'espressione regolare che configura il test runner per eseguire solo i test il cui nome corrisponde al pattern fornito. Consultare la documentazione sul [filtraggio dei test per nome](/it/nodejs/api/test#filtering-tests-by-name) per maggiori dettagli.

Se vengono forniti sia `--test-name-pattern` che `--test-skip-pattern`, i test devono soddisfare **entrambi** i requisiti per essere eseguiti.

### `--test-only` {#--test-name-pattern}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Il test runner è ora stabile. |
| v18.0.0, v16.17.0 | Aggiunto in: v18.0.0, v16.17.0 |
:::

Configura il test runner per eseguire solo i test di livello superiore che hanno l'opzione `only` impostata. Questo flag non è necessario quando l'isolamento dei test è disabilitato.

### `--test-reporter` {#--test-only}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Il test runner è ora stabile. |
| v19.6.0, v18.15.0 | Aggiunto in: v19.6.0, v18.15.0 |
:::

Un test reporter da utilizzare durante l'esecuzione dei test. Consultare la documentazione sui [test reporter](/it/nodejs/api/test#test-reporters) per maggiori dettagli.


### `--test-reporter-destination` {#--test-reporter}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Il test runner è ora stabile. |
| v19.6.0, v18.15.0 | Aggiunto in: v19.6.0, v18.15.0 |
:::

La destinazione per il test reporter corrispondente. Consulta la documentazione sui [test reporter](/it/nodejs/api/test#test-reporters) per maggiori dettagli.

### `--test-shard` {#--test-reporter-destination}

**Aggiunto in: v20.5.0, v18.19.0**

Shard della suite di test da eseguire in formato `\<indice\>/\<totale\>`, dove

`indice` è un numero intero positivo, indice delle parti divise `totale` è un numero intero positivo, totale delle parti divise. Questo comando dividerà tutti i file di test in `totale` parti uguali ed eseguirà solo quelli che si trovano in una parte `indice`.

Ad esempio, per dividere la tua suite di test in tre parti, usa questo:

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**Aggiunto in: v22.1.0**

Un'espressione regolare che configura il test runner per saltare i test il cui nome corrisponde al modello fornito. Consulta la documentazione sul [filtraggio dei test per nome](/it/nodejs/api/test#filtering-tests-by-name) per maggiori dettagli.

Se vengono forniti sia `--test-name-pattern` che `--test-skip-pattern`, i test devono soddisfare **entrambi** i requisiti per essere eseguiti.

### `--test-timeout` {#--test-skip-pattern}

**Aggiunto in: v21.2.0, v20.11.0**

Un numero di millisecondi dopo i quali l'esecuzione del test fallirà. Se non specificato, i sottotest ereditano questo valore dal loro genitore. Il valore predefinito è `Infinity`.

### `--test-update-snapshots` {#--test-timeout}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.4.0 | Il test degli snapshot non è più sperimentale. |
| v22.3.0 | Aggiunto in: v22.3.0 |
:::

Rigenera i file di snapshot utilizzati dal test runner per il [test degli snapshot](/it/nodejs/api/test#snapshot-testing).

### `--throw-deprecation` {#--test-update-snapshots}

**Aggiunto in: v0.11.14**

Genera errori per le deprecazioni.

### `--title=title` {#--throw-deprecation}

**Aggiunto in: v10.7.0**

Imposta `process.title` all'avvio.

### `--tls-cipher-list=list` {#--title=title}

**Aggiunto in: v4.0.0**

Specifica un elenco di cifrari TLS predefinito alternativo. Richiede che Node.js sia compilato con il supporto crittografico (predefinito).


### `--tls-keylog=file` {#--tls-cipher-list=list}

**Aggiunto in: v13.2.0, v12.16.0**

Registra il materiale della chiave TLS in un file. Il materiale della chiave è in formato NSS `SSLKEYLOGFILE` e può essere utilizzato da software (come Wireshark) per decriptare il traffico TLS.

### `--tls-max-v1.2` {#--tls-keylog=file}

**Aggiunto in: v12.0.0, v10.20.0**

Imposta [`tls.DEFAULT_MAX_VERSION`](/it/nodejs/api/tls#tlsdefault_max_version) su 'TLSv1.2'. Utilizzare per disabilitare il supporto per TLSv1.3.

### `--tls-max-v1.3` {#--tls-max-v12}

**Aggiunto in: v12.0.0**

Imposta [`tls.DEFAULT_MAX_VERSION`](/it/nodejs/api/tls#tlsdefault_max_version) predefinito su 'TLSv1.3'. Utilizzare per abilitare il supporto per TLSv1.3.

### `--tls-min-v1.0` {#--tls-max-v13}

**Aggiunto in: v12.0.0, v10.20.0**

Imposta [`tls.DEFAULT_MIN_VERSION`](/it/nodejs/api/tls#tlsdefault_min_version) predefinito su 'TLSv1'. Utilizzare per la compatibilità con vecchi client o server TLS.

### `--tls-min-v1.1` {#--tls-min-v10}

**Aggiunto in: v12.0.0, v10.20.0**

Imposta [`tls.DEFAULT_MIN_VERSION`](/it/nodejs/api/tls#tlsdefault_min_version) predefinito su 'TLSv1.1'. Utilizzare per la compatibilità con vecchi client o server TLS.

### `--tls-min-v1.2` {#--tls-min-v11}

**Aggiunto in: v12.2.0, v10.20.0**

Imposta [`tls.DEFAULT_MIN_VERSION`](/it/nodejs/api/tls#tlsdefault_min_version) predefinito su 'TLSv1.2'. Questa è l'impostazione predefinita per 12.x e versioni successive, ma l'opzione è supportata per la compatibilità con le versioni precedenti di Node.js.

### `--tls-min-v1.3` {#--tls-min-v12}

**Aggiunto in: v12.0.0**

Imposta [`tls.DEFAULT_MIN_VERSION`](/it/nodejs/api/tls#tlsdefault_min_version) predefinito su 'TLSv1.3'. Utilizzare per disabilitare il supporto per TLSv1.2, che non è sicuro come TLSv1.3.

### `--trace-deprecation` {#--tls-min-v13}

**Aggiunto in: v0.8.0**

Stampa le stack trace per le deprecazioni.

### `--trace-env` {#--trace-deprecation}

**Aggiunto in: v23.4.0**

Stampa informazioni su qualsiasi accesso alle variabili d'ambiente eseguito nell'istanza Node.js corrente a stderr, tra cui:

- Le letture delle variabili d'ambiente che Node.js esegue internamente.
- Scritture nella forma `process.env.KEY = "SOME VALUE"`.
- Letture nella forma `process.env.KEY`.
- Definizioni nella forma `Object.defineProperty(process.env, 'KEY', {...})`.
- Query nella forma `Object.hasOwn(process.env, 'KEY')`, `process.env.hasOwnProperty('KEY')` o `'KEY' in process.env`.
- Eliminazioni nella forma `delete process.env.KEY`.
- Enumerazioni nella forma di `...process.env` o `Object.keys(process.env)`.

Vengono stampati solo i nomi delle variabili d'ambiente a cui si accede. I valori non vengono stampati.

Per stampare lo stack trace dell'accesso, utilizzare `--trace-env-js-stack` e/o `--trace-env-native-stack`.


### `--trace-env-js-stack` {#--trace-env}

**Aggiunto in: v23.4.0**

Oltre a ciò che fa `--trace-env`, questo stampa la traccia dello stack JavaScript dell'accesso.

### `--trace-env-native-stack` {#--trace-env-js-stack}

**Aggiunto in: v23.4.0**

Oltre a ciò che fa `--trace-env`, questo stampa la traccia dello stack nativo dell'accesso.

### `--trace-event-categories` {#--trace-env-native-stack}

**Aggiunto in: v7.7.0**

Un elenco separato da virgole di categorie che devono essere tracciate quando la tracciatura degli eventi di traccia è abilitata usando `--trace-events-enabled`.

### `--trace-event-file-pattern` {#--trace-event-categories}

**Aggiunto in: v9.8.0**

Stringa modello che specifica il percorso del file per i dati degli eventi di traccia, supporta `${rotation}` e `${pid}`.

### `--trace-events-enabled` {#--trace-event-file-pattern}

**Aggiunto in: v7.7.0**

Abilita la raccolta di informazioni di tracciatura degli eventi di traccia.

### `--trace-exit` {#--trace-events-enabled}

**Aggiunto in: v13.5.0, v12.16.0**

Stampa una traccia dello stack ogni volta che un ambiente viene chiuso proattivamente, ad es. invocando `process.exit()`.

### `--trace-require-module=mode` {#--trace-exit}

**Aggiunto in: v23.5.0**

Stampa informazioni sull'utilizzo di [Caricamento di moduli ECMAScript usando `require()`] (/it/nodejs/api/modules#loading-ecmascript-modules-using-require).

Quando `mode` è `all`, viene stampato tutto l'utilizzo. Quando `mode` è `no-node-modules`, l'utilizzo dalla cartella `node_modules` è escluso.

### `--trace-sigint` {#--trace-require-module=mode}

**Aggiunto in: v13.9.0, v12.17.0**

Stampa una traccia dello stack su SIGINT.

### `--trace-sync-io` {#--trace-sigint}

**Aggiunto in: v2.1.0**

Stampa una traccia dello stack ogni volta che viene rilevata I/O sincrona dopo il primo ciclo dell'event loop.

### `--trace-tls` {#--trace-sync-io}

**Aggiunto in: v12.2.0**

Stampa informazioni di traccia dei pacchetti TLS su `stderr`. Questo può essere usato per fare il debug di problemi di connessione TLS.

### `--trace-uncaught` {#--trace-tls}

**Aggiunto in: v13.1.0**

Stampa le tracce dello stack per le eccezioni non intercettate; di solito, viene stampata la traccia dello stack associata alla creazione di un `Error`, mentre questo fa sì che Node.js stampi anche la traccia dello stack associata al lancio del valore (che non deve essere un'istanza di `Error`).

L'abilitazione di questa opzione può influire negativamente sul comportamento della garbage collection.

### `--trace-warnings` {#--trace-uncaught}

**Aggiunto in: v6.0.0**

Stampa le tracce dello stack per gli avvisi di processo (incluse le deprecazioni).


### `--track-heap-objects` {#--trace-warnings}

**Aggiunto in: v2.4.0**

Traccia le allocazioni di oggetti heap per gli snapshot dell'heap.

### `--unhandled-rejections=mode` {#--track-heap-objects}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Modificata la modalità predefinita in `throw`. In precedenza, veniva emesso un avviso. |
| v12.0.0, v10.17.0 | Aggiunto in: v12.0.0, v10.17.0 |
:::

L'uso di questo flag consente di modificare cosa dovrebbe accadere quando si verifica un rifiuto non gestito. È possibile scegliere una delle seguenti modalità:

- `throw`: Emette [`unhandledRejection`](/it/nodejs/api/process#event-unhandledrejection). Se questo hook non è impostato, solleva il rifiuto non gestito come eccezione non rilevata. Questo è il comportamento predefinito.
- `strict`: Solleva il rifiuto non gestito come eccezione non rilevata. Se l'eccezione viene gestita, viene emesso [`unhandledRejection`](/it/nodejs/api/process#event-unhandledrejection).
- `warn`: Attiva sempre un avviso, indipendentemente dal fatto che l'hook [`unhandledRejection`](/it/nodejs/api/process#event-unhandledrejection) sia impostato o meno, ma non stampa l'avviso di deprecazione.
- `warn-with-error-code`: Emette [`unhandledRejection`](/it/nodejs/api/process#event-unhandledrejection). Se questo hook non è impostato, attiva un avviso e imposta il codice di uscita del processo su 1.
- `none`: Silenzia tutti gli avvisi.

Se si verifica un rifiuto durante la fase di caricamento statico del modulo ES del punto di ingresso della riga di comando, verrà sempre sollevato come eccezione non rilevata.

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**Aggiunto in: v6.11.0**

Utilizza l'archivio CA Mozilla in bundle fornito dalla versione corrente di Node.js o utilizza l'archivio CA predefinito di OpenSSL. L'archivio predefinito è selezionabile in fase di compilazione.

L'archivio CA in bundle, fornito da Node.js, è un'istantanea dell'archivio CA Mozilla che viene fissata al momento del rilascio. È identico su tutte le piattaforme supportate.

L'utilizzo dell'archivio OpenSSL consente modifiche esterne dell'archivio. Per la maggior parte delle distribuzioni Linux e BSD, questo archivio è gestito dai manutentori della distribuzione e dagli amministratori di sistema. La posizione dell'archivio CA di OpenSSL dipende dalla configurazione della libreria OpenSSL, ma può essere modificata in fase di esecuzione utilizzando le variabili d'ambiente.

Vedere `SSL_CERT_DIR` e `SSL_CERT_FILE`.


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**Aggiunto in: v13.6.0, v12.17.0**

Rimappa il codice statico di Node.js su pagine di memoria di grandi dimensioni all'avvio. Se supportato dal sistema di destinazione, ciò farà sì che il codice statico di Node.js venga spostato su pagine da 2 MiB anziché pagine da 4 KiB.

I seguenti valori sono validi per `mode`:

- `off`: Non verrà tentata alcuna mappatura. Questo è il valore predefinito.
- `on`: Se supportato dal sistema operativo, verrà tentata la mappatura. L'errore di mappatura verrà ignorato e verrà stampato un messaggio sull'errore standard.
- `silent`: Se supportato dal sistema operativo, verrà tentata la mappatura. L'errore di mappatura verrà ignorato e non verrà segnalato.

### `--v8-options` {#--use-largepages=mode}

**Aggiunto in: v0.1.3**

Stampa le opzioni della riga di comando di V8.

### `--v8-pool-size=num` {#--v8-options}

**Aggiunto in: v5.10.0**

Imposta la dimensione del pool di thread di V8 che verrà utilizzato per allocare i lavori in background.

Se impostato su `0`, Node.js sceglierà una dimensione appropriata del pool di thread in base a una stima della quantità di parallelismo.

La quantità di parallelismo si riferisce al numero di calcoli che possono essere eseguiti simultaneamente in una data macchina. In generale, è uguale alla quantità di CPU, ma può divergere in ambienti come VM o container.

### `-v`, `--version` {#--v8-pool-size=num}

**Aggiunto in: v0.1.3**

Stampa la versione di Node.

### `--watch` {#-v---version}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0, v20.13.0 | La modalità di osservazione è ora stabile. |
| v19.2.0, v18.13.0 | Test runner ora supporta l'esecuzione in modalità di osservazione. |
| v18.11.0, v16.19.0 | Aggiunto in: v18.11.0, v16.19.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Avvia Node.js in modalità di osservazione. Quando in modalità di osservazione, le modifiche ai file osservati causano il riavvio del processo Node.js. Per impostazione predefinita, la modalità di osservazione osserverà il punto di ingresso e qualsiasi modulo richiesto o importato. Usa `--watch-path` per specificare quali percorsi osservare.

Questo flag non può essere combinato con `--check`, `--eval`, `--interactive` o REPL.

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0, v20.13.0 | La modalità watch è ora stabile. |
| v18.11.0, v16.19.0 | Aggiunto in: v18.11.0, v16.19.0 |
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Avvia Node.js in modalità watch e specifica quali percorsi monitorare. Quando è in modalità watch, le modifiche ai percorsi monitorati provocano il riavvio del processo Node.js. Questo disattiverà il monitoraggio dei moduli richiesti o importati, anche se utilizzato in combinazione con `--watch`.

Questo flag non può essere combinato con `--check`, `--eval`, `--interactive`, `--test` o REPL.

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
Questa opzione è supportata solo su macOS e Windows. Un'eccezione `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` verrà generata quando l'opzione viene utilizzata su una piattaforma che non la supporta.

### `--watch-preserve-output` {#--watch-path}

**Aggiunto in: v19.3.0, v18.13.0**

Disabilita la pulizia della console quando la modalità watch riavvia il processo.

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**Aggiunto in: v6.0.0**

Riempie automaticamente con zeri tutte le istanze di [`Buffer`](/it/nodejs/api/buffer#class-buffer) e [`SlowBuffer`](/it/nodejs/api/buffer#class-slowbuffer) appena allocate.

## Variabili d'ambiente {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

La variabile d'ambiente `FORCE_COLOR` viene utilizzata per abilitare l'output colorato ANSI. Il valore può essere:

- `1`, `true` o la stringa vuota `''` indicano il supporto a 16 colori,
- `2` per indicare il supporto a 256 colori, o
- `3` per indicare il supporto a 16 milioni di colori.

Quando `FORCE_COLOR` viene utilizzata e impostata su un valore supportato, sia le variabili d'ambiente `NO_COLOR` che `NODE_DISABLE_COLORS` vengono ignorate.

Qualsiasi altro valore comporterà la disabilitazione dell'output colorato.

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**Aggiunto in: v22.1.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sviluppo Attivo
:::

Abilita la [cache di compilazione del modulo](/it/nodejs/api/module#module-compile-cache) per l'istanza di Node.js. Consultare la documentazione della [cache di compilazione del modulo](/it/nodejs/api/module#module-compile-cache) per i dettagli.


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**Aggiunto in: v0.1.32**

Elenco separato da `','` dei moduli principali che devono stampare le informazioni di debug.

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

Elenco separato da `','` dei moduli core C++ che devono stampare le informazioni di debug.

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**Aggiunto in: v0.3.0**

Quando impostato, i colori non verranno utilizzati nella REPL.

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**Aggiunto in: v22.8.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).1 - Sviluppo Attivo
:::

Disabilita la [cache di compilazione dei moduli](/it/nodejs/api/module#module-compile-cache) per l'istanza di Node.js. Vedere la documentazione della [cache di compilazione dei moduli](/it/nodejs/api/module#module-compile-cache) per i dettagli.

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**Aggiunto in: v7.3.0**

Quando impostato, le CA "root" ben note (come VeriSign) verranno estese con i certificati extra in `file`. Il file deve consistere di uno o più certificati attendibili in formato PEM. Verrà emesso un messaggio (una volta) con [`process.emitWarning()`](/it/nodejs/api/process#processemitwarningwarning-options) se il file è mancante o non valido, ma eventuali errori verranno altrimenti ignorati.

Né i certificati ben noti né quelli extra vengono utilizzati quando la proprietà delle opzioni `ca` è esplicitamente specificata per un client o server TLS o HTTPS.

Questa variabile d'ambiente viene ignorata quando `node` viene eseguito come setuid root o ha le capability di file Linux impostate.

La variabile d'ambiente `NODE_EXTRA_CA_CERTS` viene letta solo quando il processo Node.js viene avviato per la prima volta. Cambiare il valore in fase di esecuzione usando `process.env.NODE_EXTRA_CA_CERTS` non ha alcun effetto sul processo corrente.

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**Aggiunto in: v0.11.15**

Percorso dei dati per i dati ICU (oggetto `Intl`). Estenderà i dati collegati quando compilato con il supporto small-icu.

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**Aggiunto in: v6.11.0**

Quando impostato su `1`, gli avvisi di processo vengono silenziati.

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**Aggiunto in: v8.0.0**

Un elenco separato da spazi di opzioni della riga di comando. `options...` vengono interpretate prima delle opzioni della riga di comando, quindi le opzioni della riga di comando sovrascriveranno o si combineranno dopo qualsiasi cosa in `options...`. Node.js uscirà con un errore se viene utilizzata un'opzione non consentita nell'ambiente, come `-p` o un file di script.

Se un valore di opzione contiene uno spazio, può essere escaped usando le virgolette doppie:

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
Un flag singleton passato come opzione della riga di comando sovrascriverà lo stesso flag passato in `NODE_OPTIONS`:

```bash [BASH]
# L'inspector sarà disponibile sulla porta 5555 {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
Un flag che può essere passato più volte verrà trattato come se le sue istanze `NODE_OPTIONS` fossero state passate per prime, e poi le sue istanze della riga di comando successivamente:

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# è equivalente a: {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
Le opzioni di Node.js consentite sono nel seguente elenco. Se un'opzione supporta sia le varianti --XX che --no-XX, entrambe sono supportate ma solo una è inclusa nell'elenco seguente.

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

Le opzioni V8 consentite sono:

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`, `--perf-basic-prof`, `--perf-prof-unwinding-info` e `--perf-prof` sono disponibili solo su Linux.

`--enable-etw-stack-walking` è disponibile solo su Windows.


### `NODE_PATH=path[:…]` {#is-equivalent-to}

**Aggiunto in: v0.1.32**

Lista di directory separate da `':'` anteposte al percorso di ricerca dei moduli.

Su Windows, questa è invece una lista separata da `';'`.

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**Aggiunto in: v8.0.0**

Se impostato a `1`, emette avvisi di deprecazione in sospeso.

Le deprecazioni in sospeso sono generalmente identiche a una deprecazione in fase di esecuzione, con la notevole eccezione che sono *disattivate* per impostazione predefinita e non verranno emesse a meno che non venga impostato il flag della riga di comando `--pending-deprecation` o la variabile di ambiente `NODE_PENDING_DEPRECATION=1`. Le deprecazioni in sospeso vengono utilizzate per fornire una sorta di meccanismo selettivo di "allerta precoce" che gli sviluppatori possono sfruttare per rilevare l'utilizzo di API obsolete.

### `NODE_PENDING_PIPE_INSTANCES=instances` {#node_pending_deprecation=1}

Imposta il numero di handle di istanze pipe in sospeso quando il server pipe è in attesa di connessioni. Questa impostazione si applica solo a Windows.

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**Aggiunto in: v7.1.0**

Se impostato a `1`, indica al loader del modulo di preservare i collegamenti simbolici durante la risoluzione e la memorizzazione nella cache dei moduli.

### `NODE_REDIRECT_WARNINGS=file` {#node_preserve_symlinks=1}

**Aggiunto in: v8.0.0**

Se impostato, gli avvisi di processo verranno emessi nel file specificato invece di essere stampati su stderr. Il file verrà creato se non esiste e verrà aggiunto se esiste già. Se si verifica un errore durante il tentativo di scrivere l'avviso nel file, l'avviso verrà invece scritto su stderr. Questo è equivalente all'uso del flag della riga di comando `--redirect-warnings=file`.

### `NODE_REPL_EXTERNAL_MODULE=file` {#node_redirect_warnings=file}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.3.0, v20.16.0 | Rimossa la possibilità di utilizzare questa variabile d'ambiente con kDisableNodeOptionsEnv per embedders. |
| v13.0.0, v12.16.0 | Aggiunto in: v13.0.0, v12.16.0 |
:::

Percorso di un modulo Node.js che verrà caricato al posto della REPL integrata. Sostituire questo valore con una stringa vuota (`''`) utilizzerà la REPL integrata.

### `NODE_REPL_HISTORY=file` {#node_repl_external_module=file}

**Aggiunto in: v3.0.0**

Percorso del file utilizzato per memorizzare la cronologia REPL persistente. Il percorso predefinito è `~/.node_repl_history`, che viene sovrascritto da questa variabile. Impostare il valore su una stringa vuota (`''` o `' '`) disabilita la cronologia REPL persistente.


### `NODE_SKIP_PLATFORM_CHECK=value` {#node_repl_history=file}

**Aggiunta in: v14.5.0**

Se `value` è uguale a `'1'`, il controllo per una piattaforma supportata viene saltato durante l'avvio di Node.js. Node.js potrebbe non essere eseguito correttamente. Eventuali problemi riscontrati su piattaforme non supportate non verranno risolti.

### `NODE_TEST_CONTEXT=value` {#node_skip_platform_check=value}

Se `value` è uguale a `'child'`, le opzioni del reporter di test verranno sovrascritte e l'output dei test verrà inviato a stdout nel formato TAP. Se viene fornito qualsiasi altro valore, Node.js non fornisce garanzie sul formato del reporter utilizzato o sulla sua stabilità.

### `NODE_TLS_REJECT_UNAUTHORIZED=value` {#node_test_context=value}

Se `value` è uguale a `'0'`, la convalida del certificato è disabilitata per le connessioni TLS. Ciò rende TLS, e HTTPS per estensione, insicuro. L'uso di questa variabile d'ambiente è fortemente sconsigliato.

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

Quando impostato, Node.js inizierà a emettere i dati di [copertura del codice JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage) e [Mappa di origine](https://sourcemaps.info/spec) nella directory fornita come argomento (le informazioni sulla copertura sono scritte come JSON in file con un prefisso `coverage`).

`NODE_V8_COVERAGE` si propagherà automaticamente ai sottoprocessi, semplificando l'instrumentazione delle applicazioni che chiamano la famiglia di funzioni `child_process.spawn()`. `NODE_V8_COVERAGE` può essere impostato su una stringa vuota, per impedire la propagazione.

### `NO_COLOR=&lt;any&gt;` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) è un alias per `NODE_DISABLE_COLORS`. Il valore della variabile d'ambiente è arbitrario.

#### Output della copertura {#no_color=&lt;any&gt;}

La copertura viene emessa come un array di oggetti [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) sulla chiave di primo livello `result`:

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```
#### Cache della mappa di origine {#coverage-output}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Se trovati, i dati della mappa di origine vengono aggiunti alla chiave di primo livello `source-map-cache` sull'oggetto di copertura JSON.

`source-map-cache` è un oggetto con chiavi che rappresentano i file da cui sono state estratte le mappe di origine e valori che includono l'URL della mappa di origine non elaborata (nella chiave `url`), le informazioni analizzate di Source Map v3 (nella chiave `data`) e le lunghezze delle righe del file di origine (nella chiave `lineLengths`).

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=file` {#source-map-cache}

**Aggiunto in: v6.11.0**

Carica un file di configurazione OpenSSL all'avvio. Tra gli altri usi, può essere utilizzato per abilitare la crittografia conforme a FIPS se Node.js è compilato con `./configure --openssl-fips`.

Se viene utilizzata l'opzione della riga di comando [`--openssl-config`](/it/nodejs/api/cli#--openssl-configfile), la variabile d'ambiente viene ignorata.

### `SSL_CERT_DIR=dir` {#openssl_conf=file}

**Aggiunto in: v7.7.0**

Se `--use-openssl-ca` è abilitato, questo sovrascrive e imposta la directory di OpenSSL contenente i certificati attendibili.

Tieni presente che, a meno che l'ambiente figlio non sia impostato esplicitamente, questa variabile d'ambiente verrà ereditata da qualsiasi processo figlio e, se utilizza OpenSSL, potrebbe far sì che questi si fidino delle stesse CA di Node.

### `SSL_CERT_FILE=file` {#ssl_cert_dir=dir}

**Aggiunto in: v7.7.0**

Se `--use-openssl-ca` è abilitato, questo sovrascrive e imposta il file di OpenSSL contenente i certificati attendibili.

Tieni presente che, a meno che l'ambiente figlio non sia impostato esplicitamente, questa variabile d'ambiente verrà ereditata da qualsiasi processo figlio e, se utilizza OpenSSL, potrebbe far sì che questi si fidino delle stesse CA di Node.

### `TZ` {#ssl_cert_file=file}


::: info [Storia]
| Versione | Modifiche |
| --- | --- |
| v16.2.0 | La modifica della variabile TZ tramite process.env.TZ = cambia anche il fuso orario su Windows. |
| v13.0.0 | La modifica della variabile TZ tramite process.env.TZ = cambia il fuso orario sui sistemi POSIX. |
| v0.0.1 | Aggiunto in: v0.0.1 |
:::

La variabile d'ambiente `TZ` viene utilizzata per specificare la configurazione del fuso orario.

Sebbene Node.js non supporti tutti i vari [modi in cui `TZ` viene gestito in altri ambienti](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable), supporta gli [ID del fuso orario](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) di base (come `'Etc/UTC'`, `'Europe/Paris'` o `'America/New_York'`). Potrebbe supportare alcune altre abbreviazioni o alias, ma questi sono fortemente sconsigliati e non garantiti.

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=dimensione` {#tz}

Imposta il numero di thread utilizzati nel threadpool di libuv a `dimensione` thread.

Le API di sistema asincrone vengono utilizzate da Node.js ogni volta che è possibile, ma dove non esistono, il threadpool di libuv viene utilizzato per creare API di nodo asincrone basate su API di sistema sincrone. Le API di Node.js che utilizzano il threadpool sono:

- tutte le API `fs`, ad eccezione delle API di monitoraggio dei file e di quelle esplicitamente sincrone
- API crittografiche asincrone come `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`
- `dns.lookup()`
- tutte le API `zlib`, ad eccezione di quelle esplicitamente sincrone

Poiché il threadpool di libuv ha una dimensione fissa, ciò significa che se per qualsiasi motivo una qualsiasi di queste API impiega molto tempo, altre API (apparentemente non correlate) che vengono eseguite nel threadpool di libuv sperimenteranno un degrado delle prestazioni. Per mitigare questo problema, una potenziale soluzione è aumentare la dimensione del threadpool di libuv impostando la variabile di ambiente `'UV_THREADPOOL_SIZE'` su un valore maggiore di `4` (il suo valore predefinito corrente). Tuttavia, impostare questo dall'interno del processo utilizzando `process.env.UV_THREADPOOL_SIZE=dimensione` non è garantito che funzioni poiché il threadpool sarebbe stato creato come parte dell'inizializzazione del runtime molto prima che il codice utente venga eseguito. Per ulteriori informazioni, consultare la [documentazione del threadpool di libuv](https://docs.libuv.org/en/latest/threadpool).

## Opzioni V8 utili {#uv_threadpool_size=size}

V8 ha il proprio set di opzioni della CLI. Qualsiasi opzione della CLI di V8 fornita a `node` verrà passata a V8 per la gestione. Le opzioni di V8 *non hanno garanzia di stabilità*. Lo stesso team di V8 non le considera parte della loro API formale e si riserva il diritto di modificarle in qualsiasi momento. Allo stesso modo, non sono coperte dalle garanzie di stabilità di Node.js. Molte delle opzioni di V8 sono di interesse solo per gli sviluppatori di V8. Nonostante ciò, esiste un piccolo set di opzioni di V8 che sono ampiamente applicabili a Node.js e sono documentate qui:

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (in MiB) {#--jitless_1}

Imposta la dimensione massima della sezione di memoria old di V8. Man mano che il consumo di memoria si avvicina al limite, V8 dedicherà più tempo alla garbage collection nel tentativo di liberare la memoria inutilizzata.

Su una macchina con 2 GiB di memoria, considera di impostare questo valore a 1536 (1,5 GiB) per lasciare un po' di memoria per altri usi ed evitare lo swapping.

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (in MiB) {#--max-old-space-size=size-in-mib}

Imposta la dimensione massima del [semi-spazio](https://www.memorymanagement.org/glossary/s#semi.space) per il [garbage collector di tipo scavenge](https://v8.dev/blog/orinoco-parallel-scavenger) di V8 in MiB (mebibyte). Aumentare la dimensione massima di un semi-spazio può migliorare la velocità effettiva per Node.js al costo di un maggiore consumo di memoria.

Poiché la dimensione della generazione young dell'heap di V8 è tre volte (vedi [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) in V8) la dimensione del semi-spazio, un aumento di 1 MiB al semi-spazio si applica a ciascuno dei tre singoli semi-spazi e fa aumentare la dimensione dell'heap di 3 MiB. Il miglioramento della velocità effettiva dipende dal carico di lavoro (vedi [#42511](https://github.com/nodejs/node/issues/42511)).

Il valore predefinito dipende dal limite di memoria. Ad esempio, sui sistemi a 64 bit con un limite di memoria di 512 MiB, la dimensione massima di un semi-spazio è impostata di default a 1 MiB. Per i limiti di memoria fino a 2 GiB inclusi, la dimensione massima predefinita di un semi-spazio sarà inferiore a 16 MiB sui sistemi a 64 bit.

Per ottenere la migliore configurazione per la tua applicazione, dovresti provare diversi valori di max-semi-space-size quando esegui benchmark per la tua applicazione.

Ad esempio, benchmark su sistemi a 64 bit:

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

Il numero massimo di frame dello stack da raccogliere nello stack trace di un errore. Impostandolo a 0 si disabilita la raccolta dello stack trace. Il valore predefinito è 10.

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # stampa 12
```

