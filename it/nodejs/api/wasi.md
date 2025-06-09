---
title: Documentazione WASI di Node.js
description: Esplora la documentazione di Node.js per l'interfaccia di sistema WebAssembly (WASI), che dettaglia come utilizzare WASI negli ambienti Node.js, inclusi API per operazioni di sistema di file, variabili d'ambiente e altro.
head:
  - - meta
    - name: og:title
      content: Documentazione WASI di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esplora la documentazione di Node.js per l'interfaccia di sistema WebAssembly (WASI), che dettaglia come utilizzare WASI negli ambienti Node.js, inclusi API per operazioni di sistema di file, variabili d'ambiente e altro.
  - - meta
    - name: twitter:title
      content: Documentazione WASI di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esplora la documentazione di Node.js per l'interfaccia di sistema WebAssembly (WASI), che dettaglia come utilizzare WASI negli ambienti Node.js, inclusi API per operazioni di sistema di file, variabili d'ambiente e altro.
---


# Interfaccia di Sistema WebAssembly (WASI) {#webassembly-system-interface-wasi}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

**Il modulo <code>node:wasi</code> attualmente non fornisce le
proprietà di sicurezza complete del file system fornite da alcuni runtime WASI.
Il supporto completo per il sandboxing sicuro del file system potrebbe o meno essere implementato in
futuro. Nel frattempo, non fare affidamento su di esso per eseguire codice non attendibile.**

**Codice sorgente:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

L'API WASI fornisce un'implementazione della specifica [WebAssembly System Interface](https://wasi.dev/). WASI fornisce alle applicazioni WebAssembly l'accesso al sistema operativo sottostante tramite una raccolta di funzioni di tipo POSIX.

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi';
const { argv, env } = require('node:process';
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

Per eseguire l'esempio sopra, crea un nuovo file in formato testo WebAssembly chiamato `demo.wat`:

```text [TEXT]
(module
    ;; Importa la funzione WASI fd_write richiesta che scriverà i vettori io forniti su stdout
    ;; La firma della funzione per fd_write è:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Restituisce il numero di byte scritti
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Scrivi 'hello world\n' nella memoria a un offset di 8 byte
    ;; Nota la nuova riga finale necessaria affinché il testo appaia
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Creazione di un nuovo vettore io all'interno della memoria lineare
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - Questo è un puntatore all'inizio della stringa 'hello world\n'
        (i32.store (i32.const 4) (i32.const 12)) ;; iov.iov_len - La lunghezza della stringa 'hello world\n'

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 per stdout
            (i32.const 0) ;; *iovs - Il puntatore all'array iov, che è memorizzato nella posizione di memoria 0
            (i32.const 1) ;; iovs_len - Stiamo stampando 1 stringa memorizzata in un iov - quindi uno.
            (i32.const 20) ;; nwritten - Un posto nella memoria per memorizzare il numero di byte scritti
        )
        drop ;; Scarta il numero di byte scritti dalla cima dello stack
    )
)
```
Usa [wabt](https://github.com/WebAssembly/wabt) per compilare `.wat` in `.wasm`

```bash [BASH]
wat2wasm demo.wat
```

## Sicurezza {#security}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.2.0, v20.11.0 | Chiarite le proprietà di sicurezza di WASI. |
| v21.2.0, v20.11.0 | Aggiunto in: v21.2.0, v20.11.0 |
:::

WASI fornisce un modello basato sulle capability tramite il quale alle applicazioni vengono fornite le proprie capability personalizzate `env`, `preopens`, `stdin`, `stdout`, `stderr` e `exit`.

**L'attuale modello di minaccia di Node.js non fornisce il sandboxing sicuro presente in alcuni runtime WASI.**

Sebbene le funzionalità di capability siano supportate, non costituiscono un modello di sicurezza in Node.js. Ad esempio, il sandboxing del file system può essere aggirato con varie tecniche. Il progetto sta valutando se queste garanzie di sicurezza potrebbero essere aggiunte in futuro.

## Classe: `WASI` {#class-wasi}

**Aggiunto in: v13.3.0, v12.16.0**

La classe `WASI` fornisce l'API di chiamata di sistema WASI e metodi di convenienza aggiuntivi per lavorare con applicazioni basate su WASI. Ogni istanza `WASI` rappresenta un ambiente distinto.

### `new WASI([options])` {#new-wasioptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0 | il valore predefinito di returnOnExit è stato modificato in true. |
| v20.0.0 | L'opzione version è ora obbligatoria e non ha un valore predefinito. |
| v19.8.0 | campo version aggiunto alle opzioni. |
| v13.3.0, v12.16.0 | Aggiunto in: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array di stringhe che l'applicazione WebAssembly vedrà come argomenti della riga di comando. Il primo argomento è il percorso virtuale del comando WASI stesso. **Predefinito:** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto simile a `process.env` che l'applicazione WebAssembly vedrà come il suo ambiente. **Predefinito:** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Questo oggetto rappresenta la struttura di directory locale dell'applicazione WebAssembly. Le chiavi stringa di `preopens` vengono trattate come directory all'interno del file system. I valori corrispondenti in `preopens` sono i percorsi reali di tali directory sulla macchina host.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Per impostazione predefinita, quando le applicazioni WASI chiamano `__wasi_proc_exit()`  `wasi.start()` restituirà il codice di uscita specificato anziché terminare il processo. Impostando questa opzione su `false` farà in modo che il processo Node.js termini con il codice di uscita specificato. **Predefinito:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il descrittore di file utilizzato come input standard nell'applicazione WebAssembly. **Predefinito:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il descrittore di file utilizzato come output standard nell'applicazione WebAssembly. **Predefinito:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il descrittore di file utilizzato come errore standard nell'applicazione WebAssembly. **Predefinito:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La versione di WASI richiesta. Attualmente le uniche versioni supportate sono `unstable` e `preview1`. Questa opzione è obbligatoria.


### `wasi.getImportObject()` {#wasigetimportobject}

**Aggiunto in: v19.8.0**

Restituisce un oggetto di importazione che può essere passato a `WebAssembly.instantiate()` se non sono necessarie altre importazioni WASM oltre a quelle fornite da WASI.

Se la versione `unstable` è stata passata al costruttore, restituirà:

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
Se la versione `preview1` è stata passata al costruttore o non è stata specificata alcuna versione, restituirà:

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Aggiunto in: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Tenta di avviare l'esecuzione di `instance` come comando WASI invocando la sua esportazione `_start()`. Se `instance` non contiene un'esportazione `_start()`, o se `instance` contiene un'esportazione `_initialize()`, viene generata un'eccezione.

`start()` richiede che `instance` esporti un [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) denominato `memory`. Se `instance` non ha un'esportazione `memory`, viene generata un'eccezione.

Se `start()` viene chiamato più di una volta, viene generata un'eccezione.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Aggiunto in: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Tenta di inizializzare `instance` come un reattore WASI invocando la sua esportazione `_initialize()`, se presente. Se `instance` contiene un'esportazione `_start()`, viene generata un'eccezione.

`initialize()` richiede che `instance` esporti un [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) denominato `memory`. Se `instance` non ha un'esportazione `memory`, viene generata un'eccezione.

Se `initialize()` viene chiamato più di una volta, viene generata un'eccezione.

### `wasi.wasiImport` {#wasiwasiimport}

**Aggiunto in: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` è un oggetto che implementa l'API di chiamata di sistema WASI. Questo oggetto deve essere passato come importazione `wasi_snapshot_preview1` durante l'istanza di un [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

