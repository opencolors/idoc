---
title: Deprecazioni di Node.js
description: Questa pagina documenta le funzionalità deprecate in Node.js, fornendo indicazioni su come aggiornare il codice per evitare l'uso di API e pratiche obsolete.
head:
  - - meta
    - name: og:title
      content: Deprecazioni di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa pagina documenta le funzionalità deprecate in Node.js, fornendo indicazioni su come aggiornare il codice per evitare l'uso di API e pratiche obsolete.
  - - meta
    - name: twitter:title
      content: Deprecazioni di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa pagina documenta le funzionalità deprecate in Node.js, fornendo indicazioni su come aggiornare il codice per evitare l'uso di API e pratiche obsolete.
---


# API Deprecate {#deprecated-apis}

Le API di Node.js potrebbero essere deprecate per uno dei seguenti motivi:

- L'utilizzo dell'API non è sicuro.
- È disponibile un'API alternativa migliorata.
- Sono previste modifiche che causano interruzioni all'API in una futura release principale.

Node.js utilizza quattro tipi di deprecazioni:

- Solo documentazione
- Applicazione (solo codice non `node_modules`)
- Runtime (tutto il codice)
- Fine vita

Una deprecazione Solo documentazione è una deprecazione espressa solo all'interno della documentazione dell'API di Node.js. Queste non generano effetti collaterali durante l'esecuzione di Node.js. Alcune deprecazioni Solo documentazione attivano un avviso di runtime quando vengono lanciate con il flag [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation) (o la sua alternativa, la variabile d'ambiente `NODE_PENDING_DEPRECATION=1`), in modo simile alle deprecazioni Runtime di seguito. Le deprecazioni Solo documentazione che supportano quel flag sono esplicitamente etichettate come tali nella [lista delle API Deprecate](/it/nodejs/api/deprecations#list-of-deprecated-apis).

Una deprecazione Applicazione solo per il codice non `node_modules`, genererà, per impostazione predefinita, un avviso di processo che verrà stampato su `stderr` la prima volta che l'API deprecata viene utilizzata nel codice che non viene caricato da `node_modules`. Quando viene utilizzato il flag della riga di comando [`--throw-deprecation`](/it/nodejs/api/cli#--throw-deprecation), una deprecazione Runtime causerà la generazione di un errore. Quando viene utilizzato [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation), gli avvisi verranno emessi anche per il codice caricato da `node_modules`.

Una deprecazione runtime per tutto il codice è simile alla deprecazione runtime per il codice non `node_modules`, tranne per il fatto che emette anche un avviso per il codice caricato da `node_modules`.

Una deprecazione di fine vita viene utilizzata quando la funzionalità è o sarà presto rimossa da Node.js.

## Revoca delle deprecazioni {#revoking-deprecations}

Occasionalmente, la deprecazione di un'API potrebbe essere invertita. In tali situazioni, questo documento verrà aggiornato con informazioni pertinenti alla decisione. Tuttavia, l'identificatore di deprecazione non verrà modificato.

## Elenco delle API deprecate {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Fine vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v1.6.0 | Deprecazione Runtime. |
:::

Tipo: Fine vita

`OutgoingMessage.prototype.flush()` è stato rimosso. Utilizzare invece `OutgoingMessage.prototype.flushHeaders()`.


### DEP0002: `require('_linklist')` {#dep0002-require_linklist}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Fine del ciclo di vita. |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v5.0.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

Il modulo `_linklist` è deprecato. Si prega di utilizzare un'alternativa userland.

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.15 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

`_writableState.buffer` è stato rimosso. Utilizzare invece `_writableState.getBuffer()`.

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.4.0 | Deprecazione solo documentale. |
:::

Tipo: Fine del ciclo di vita

La proprietà `CryptoStream.prototype.readyState` è stata rimossa.

### DEP0005: Costruttore `Buffer()` {#dep0005-buffer-constructor}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione solo documentale. |
:::

Tipo: Applicazione (solo codice non in `node_modules`)

La funzione `Buffer()` e il costruttore `new Buffer()` sono deprecati a causa di problemi di usabilità dell'API che possono portare a problemi di sicurezza accidentali.

In alternativa, utilizzare uno dei seguenti metodi per costruire oggetti `Buffer`:

- [`Buffer.alloc(size[, fill[, encoding]])`](/it/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding): Crea un `Buffer` con memoria *inizializzata*.
- [`Buffer.allocUnsafe(size)`](/it/nodejs/api/buffer#static-method-bufferallocunsafesize): Crea un `Buffer` con memoria *non inizializzata*.
- [`Buffer.allocUnsafeSlow(size)`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize): Crea un `Buffer` con memoria *non inizializzata*.
- [`Buffer.from(array)`](/it/nodejs/api/buffer#static-method-bufferfromarray): Crea un `Buffer` con una copia di `array`.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/it/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - Crea un `Buffer` che avvolge il dato `arrayBuffer`.
- [`Buffer.from(buffer)`](/it/nodejs/api/buffer#static-method-bufferfrombuffer): Crea un `Buffer` che copia `buffer`.
- [`Buffer.from(string[, encoding])`](/it/nodejs/api/buffer#static-method-bufferfromstring-encoding): Crea un `Buffer` che copia `string`.

Senza `--pending-deprecation`, gli avvisi di runtime si verificano solo per il codice non presente in `node_modules`. Ciò significa che non ci saranno avvisi di deprecazione per l'utilizzo di `Buffer()` nelle dipendenze. Con `--pending-deprecation`, si verifica un avviso di runtime indipendentemente da dove si verifica l'utilizzo di `Buffer()`.


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.14 | Deprecazione in fase di esecuzione. |
| v0.5.10 | Deprecazione solo documentale. |
:::

Tipo: Fine del ciclo di vita

All'interno dei metodi `spawn()`, `fork()` e `exec()` del modulo [`child_process`](/it/nodejs/api/child_process), l'opzione `options.customFds` è deprecata. Invece, è necessario utilizzare l'opzione `options.stdio`.

### DEP0007: Sostituisci `cluster` `worker.suicide` con `worker.exitedAfterDisconnect` {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Fine del ciclo di vita. |
| v7.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione solo documentale. |
:::

Tipo: Fine del ciclo di vita

In una versione precedente del `cluster` di Node.js, una proprietà booleana con il nome `suicide` è stata aggiunta all'oggetto `Worker`. L'intento di questa proprietà era di fornire un'indicazione di come e perché l'istanza `Worker` si è chiusa. In Node.js 6.0.0, la vecchia proprietà è stata deprecata e sostituita con una nuova proprietà [`worker.exitedAfterDisconnect`](/it/nodejs/api/cluster#workerexitedafterdisconnect). Il vecchio nome della proprietà non descriveva precisamente la semantica effettiva ed era inutilmente carico di emotività.

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.3.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

Il modulo `node:constants` è deprecato. Quando si richiede l'accesso alle costanti relative a moduli builtin specifici di Node.js, gli sviluppatori dovrebbero invece fare riferimento alla proprietà `constants` esposta dal modulo pertinente. Ad esempio, `require('node:fs').constants` e `require('node:os').constants`.

### DEP0009: `crypto.pbkdf2` senza digest {#dep0009-cryptopbkdf2-without-digest}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Fine del ciclo di vita (per `digest === null`). |
| v11.0.0 | Deprecazione in fase di esecuzione (per `digest === null`). |
| v8.0.0 | Fine del ciclo di vita (per `digest === undefined`). |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione in fase di esecuzione (per `digest === undefined`). |
:::

Tipo: Fine del ciclo di vita

L'uso dell'API [`crypto.pbkdf2()`](/it/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) senza specificare un digest è stato deprecato in Node.js 6.0 perché il metodo usava di default il digest non raccomandato `'SHA1'`. In precedenza, veniva stampato un avviso di deprecazione. A partire da Node.js 8.0.0, chiamare `crypto.pbkdf2()` o `crypto.pbkdf2Sync()` con `digest` impostato su `undefined` genererà un `TypeError`.

A partire da Node.js v11.0.0, chiamare queste funzioni con `digest` impostato su `null` stamperebbe un avviso di deprecazione per allinearsi al comportamento quando `digest` è `undefined`.

Ora, tuttavia, passare sia `undefined` che `null` genererà un `TypeError`.


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.13 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

L'API `crypto.createCredentials()` è stata rimossa. Si prega di utilizzare [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) invece.

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.13 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

La classe `crypto.Credentials` è stata rimossa. Si prega di utilizzare [`tls.SecureContext`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) invece.

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.7 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

`Domain.dispose()` è stato rimosso. Recuperare esplicitamente dalle azioni I/O fallite tramite i gestori di eventi di errore impostati sul dominio.

### DEP0013: funzione asincrona `fs` senza callback {#dep0013-fs-asynchronous-function-without-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v7.0.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

Chiamare una funzione asincrona senza una callback genera un `TypeError` in Node.js 10.0.0 e versioni successive. Vedi [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562).

### DEP0014: Interfaccia String legacy `fs.read` {#dep0014-fsread-legacy-string-interface}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Fine del ciclo di vita. |
| v6.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.1.96 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

L'interfaccia `String` legacy [`fs.read()`](/it/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) è deprecata. Utilizzare invece l'API `Buffer` come indicato nella documentazione.

### DEP0015: Interfaccia String legacy `fs.readSync` {#dep0015-fsreadsync-legacy-string-interface}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Fine del ciclo di vita. |
| v6.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.1.96 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

L'interfaccia `String` legacy [`fs.readSync()`](/it/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) è deprecata. Utilizzare invece l'API `Buffer` come indicato nella documentazione.


### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Fine del ciclo di vita. |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

Gli alias `GLOBAL` e `root` per la proprietà `global` sono stati deprecati in Node.js 6.0.0 e da allora sono stati rimossi.

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Fine del ciclo di vita. |
| v7.0.0 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

`Intl.v8BreakIterator` era un'estensione non standard ed è stata rimossa. Vedere [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter).

### DEP0018: Rifiuti di promise non gestiti {#dep0018-unhandled-promise-rejections}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Fine del ciclo di vita. |
| v7.0.0 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

I rifiuti di promise non gestiti sono deprecati. Per impostazione predefinita, i rifiuti di promise che non vengono gestiti terminano il processo Node.js con un codice di uscita diverso da zero. Per modificare il modo in cui Node.js tratta i rifiuti non gestiti, utilizzare l'opzione della riga di comando [`--unhandled-rejections`](/it/nodejs/api/cli#--unhandled-rejectionsmode).

### DEP0019: `require('.')` risolto al di fuori della directory {#dep0019-require-resolved-outside-directory}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Funzionalità rimossa. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v1.8.1 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

In alcuni casi, `require('.')` poteva essere risolto al di fuori della directory del pacchetto. Questo comportamento è stato rimosso.

### DEP0020: `Server.connections` {#dep0020-serverconnections}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Server.connections è stato rimosso. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.9.7 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

La proprietà `Server.connections` è stata deprecata in Node.js v0.9.7 ed è stata rimossa. Utilizzare invece il metodo [`Server.getConnections()`](/it/nodejs/api/net#servergetconnectionscallback).

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.7.12 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

Il metodo `Server.listenFD()` è stato deprecato e rimosso. Utilizzare invece [`Server.listen({fd: \<numero\>})`](/it/nodejs/api/net#serverlistenhandle-backlog-callback).


### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Fine del ciclo di vita. |
| v7.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

L'API `os.tmpDir()` è stata deprecata in Node.js 7.0.0 ed è stata rimossa. Utilizzare invece [`os.tmpdir()`](/it/nodejs/api/os#ostmpdir).

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.6.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

Il metodo `os.getNetworkInterfaces()` è deprecato. Utilizzare invece il metodo [`os.networkInterfaces()`](/it/nodejs/api/os#osnetworkinterfaces).

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Fine del ciclo di vita. |
| v7.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

L'API `REPLServer.prototype.convertToContext()` è stata rimossa.

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v1.0.0 | Deprecazione a runtime. |
:::

Tipo: Runtime

Il modulo `node:sys` è deprecato. Utilizzare invece il modulo [`util`](/it/nodejs/api/util).

### DEP0026: `util.print()` {#dep0026-utilprint}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.3 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

`util.print()` è stato rimosso. Utilizzare invece [`console.log()`](/it/nodejs/api/console#consolelogdata-args).

### DEP0027: `util.puts()` {#dep0027-utilputs}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.3 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

`util.puts()` è stato rimosso. Utilizzare invece [`console.log()`](/it/nodejs/api/console#consolelogdata-args).

### DEP0028: `util.debug()` {#dep0028-utildebug}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.3 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

`util.debug()` è stato rimosso. Utilizzare invece [`console.error()`](/it/nodejs/api/console#consoleerrordata-args).


### DEP0029: `util.error()` {#dep0029-utilerror}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.3 | Deprecazione runtime. |
:::

Tipo: Fine del ciclo di vita

`util.error()` è stato rimosso. Si prega di utilizzare invece [`console.error()`](/it/nodejs/api/console#consoleerrordata-args).

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentazione

La classe [`SlowBuffer`](/it/nodejs/api/buffer#class-slowbuffer) è deprecata. Si prega di utilizzare invece [`Buffer.allocUnsafeSlow(size)`](/it/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v5.2.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentazione

Il metodo [`ecdh.setPublicKey()`](/it/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) è ora deprecato poiché la sua inclusione nell'API non è utile.

### DEP0032: modulo `node:domain` {#dep0032-nodedomain-module}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v1.4.2 | Deprecazione solo documentale. |
:::

Tipo: Solo documentazione

Il modulo [`domain`](/it/nodejs/api/domain) è deprecato e non deve essere utilizzato.

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v3.2.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentazione

L'API [`events.listenerCount(emitter, eventName)`](/it/nodejs/api/events#eventslistenercountemitter-eventname) è deprecata. Si prega di utilizzare invece [`emitter.listenerCount(eventName)`](/it/nodejs/api/events#emitterlistenercounteventname-listener).

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v1.0.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentazione

L'API [`fs.exists(path, callback)`](/it/nodejs/api/fs#fsexistspath-callback) è deprecata. Si prega di utilizzare invece [`fs.stat()`](/it/nodejs/api/fs#fsstatpath-options-callback) o [`fs.access()`](/it/nodejs/api/fs#fsaccesspath-mode-callback).


### DEP0035: `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.4.7 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

L'API [`fs.lchmod(path, mode, callback)`](/it/nodejs/api/fs#fslchmodpath-mode-callback) è deprecata.

### DEP0036: `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.4.7 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

L'API [`fs.lchmodSync(path, mode)`](/it/nodejs/api/fs#fslchmodsyncpath-mode) è deprecata.

### DEP0037: `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.6.0 | Deprecazione revocata. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.4.7 | Deprecazione solo documentale. |
:::

Tipo: Deprecazione revocata

L'API [`fs.lchown(path, uid, gid, callback)`](/it/nodejs/api/fs#fslchownpath-uid-gid-callback) era deprecata. La deprecazione è stata revocata perché le API di supporto necessarie sono state aggiunte in libuv.

### DEP0038: `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.6.0 | Deprecazione revocata. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.4.7 | Deprecazione solo documentale. |
:::

Tipo: Deprecazione revocata

L'API [`fs.lchownSync(path, uid, gid)`](/it/nodejs/api/fs#fslchownsyncpath-uid-gid) era deprecata. La deprecazione è stata revocata perché le API di supporto necessarie sono state aggiunte in libuv.

### DEP0039: `require.extensions` {#dep0039-requireextensions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.10.6 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

La proprietà [`require.extensions`](/it/nodejs/api/modules#requireextensions) è deprecata.

### DEP0040: modulo `node:punycode` {#dep0040-nodepunycode-module}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Deprecazione in fase di esecuzione. |
| v16.6.0 | Aggiunto il supporto per `--pending-deprecation`. |
| v7.0.0 | Deprecazione solo documentale. |
:::

Tipo: Runtime

Il modulo [`punycode`](/it/nodejs/api/punycode) è deprecato. Si prega di utilizzare invece un'alternativa userland.


### DEP0041: Variabile d'ambiente `NODE_REPL_HISTORY_FILE` {#dep0041-node_repl_history_file-environment-variable}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v3.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

La variabile d'ambiente `NODE_REPL_HISTORY_FILE` è stata rimossa. Si prega di utilizzare invece `NODE_REPL_HISTORY`.

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v0.11.3 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

La classe [`tls.CryptoStream`](/it/nodejs/api/tls#class-tlscryptostream) è stata rimossa. Si prega di utilizzare invece [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket).

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Deprecazione in fase di runtime. |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione solo nella documentazione. |
| v0.11.15 | Deprecazione revocata. |
| v0.11.3 | Deprecazione in fase di runtime. |
:::

Tipo: Solo nella documentazione

La classe [`tls.SecurePair`](/it/nodejs/api/tls#class-tlssecurepair) è deprecata. Si prega di utilizzare invece [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket).

### DEP0044: `util.isArray()` {#dep0044-utilisarray}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | Deprecazione in fase di runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

L'API [`util.isArray()`](/it/nodejs/api/util#utilisarrayobject) è deprecata. Si prega di utilizzare invece `Array.isArray()`.

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione per fine del ciclo di vita. |
| v22.0.0 | Deprecazione in fase di runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

L'API `util.isBoolean()` è stata rimossa. Si prega di utilizzare invece `typeof arg === 'boolean'`.

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione per fine del ciclo di vita. |
| v22.0.0 | Deprecazione in fase di runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

L'API `util.isBuffer()` è stata rimossa. Si prega di utilizzare invece [`Buffer.isBuffer()`](/it/nodejs/api/buffer#static-method-bufferisbufferobj).


### DEP0047: `util.isDate()` {#dep0047-utilisdate}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentazione. |
:::

Tipo: End-of-Life

L'API `util.isDate()` è stata rimossa. Utilizzare invece `arg instanceof Date`.

### DEP0048: `util.isError()` {#dep0048-utiliserror}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentazione. |
:::

Tipo: End-of-Life

L'API `util.isError()` è stata rimossa. Utilizzare invece `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error`.

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentazione. |
:::

Tipo: End-of-Life

L'API `util.isFunction()` è stata rimossa. Utilizzare invece `typeof arg === 'function'`.

### DEP0050: `util.isNull()` {#dep0050-utilisnull}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentazione. |
:::

Tipo: End-of-Life

L'API `util.isNull()` è stata rimossa. Utilizzare invece `arg === null`.

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentazione. |
:::

Tipo: End-of-Life

L'API `util.isNullOrUndefined()` è stata rimossa. Utilizzare invece `arg === null || arg === undefined`.


### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione in fase di runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentale. |
:::

Tipo: End-of-Life

L'API `util.isNumber()` è stata rimossa. Si prega di utilizzare invece `typeof arg === 'number'`.

### DEP0053: `util.isObject()` {#dep0053-utilisobject}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione in fase di runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentale. |
:::

Tipo: End-of-Life

L'API `util.isObject()` è stata rimossa. Si prega di utilizzare invece `arg && typeof arg === 'object'`.

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione in fase di runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentale. |
:::

Tipo: End-of-Life

L'API `util.isPrimitive()` è stata rimossa. Si prega di utilizzare invece `arg === null || (typeof arg !=='object' && typeof arg !== 'function')`.

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione in fase di runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentale. |
:::

Tipo: End-of-Life

L'API `util.isRegExp()` è stata rimossa. Si prega di utilizzare invece `arg instanceof RegExp`.

### DEP0056: `util.isString()` {#dep0056-utilisstring}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione End-of-Life. |
| v22.0.0 | Deprecazione in fase di runtime. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo documentale. |
:::

Tipo: End-of-Life

L'API `util.isString()` è stata rimossa. Si prega di utilizzare invece `typeof arg === 'string'`.


### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione di fine vita. |
| v22.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine vita

L'API `util.isSymbol()` è stata rimossa. Si prega di utilizzare invece `typeof arg === 'symbol'`.

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione di fine vita. |
| v22.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0, v4.8.6 | È stato assegnato un codice di deprecazione. |
| v4.0.0, v3.3.1 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine vita

L'API `util.isUndefined()` è stata rimossa. Si prega di utilizzare invece `arg === undefined`.

### DEP0059: `util.log()` {#dep0059-utillog}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione di fine vita. |
| v22.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine vita

L'API `util.log()` è stata rimossa perché è una API legacy non manutenuta che è stata esposta involontariamente allo user land. Invece, si considerino le seguenti alternative in base alle proprie specifiche esigenze:

-  **Librerie di Log di Terze Parti**
-  **Usa <code>console.log(new Date().toLocaleString(), message)</code>**

Adottando una di queste alternative, è possibile effettuare la transizione da `util.log()` e scegliere una strategia di logging che si allinei ai requisiti specifici e alla complessità della propria applicazione.

### DEP0060: `util._extend()` {#dep0060-util_extend}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

L'API [`util._extend()`](/it/nodejs/api/util#util_extendtarget-source) è deprecata perché è una API legacy non manutenuta che è stata esposta involontariamente allo user land. Si prega di utilizzare invece `target = Object.assign(target, source)`.


### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Fine del ciclo di vita. |
| v8.0.0 | Deprecazione in fase di esecuzione. |
| v7.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

La classe `fs.SyncWriteStream` non è mai stata pensata per essere un'API accessibile pubblicamente ed è stata rimossa. Non sono disponibili API alternative. Si prega di utilizzare un'alternativa userland.

### DEP0062: `node --debug` {#dep0062-node---debug}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v8.0.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

`--debug` attiva la vecchia interfaccia del debugger V8, che è stata rimossa a partire da V8 5.8. È sostituita da Inspector, che viene attivato invece con `--inspect`.

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione

L'API `ServerResponse.prototype.writeHeader()` del modulo `node:http` è deprecata. Si prega di utilizzare invece `ServerResponse.prototype.writeHead()`.

Il metodo `ServerResponse.prototype.writeHeader()` non è mai stato documentato come API ufficialmente supportata.

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Deprecazione in fase di esecuzione. |
| v6.12.0 | È stato assegnato un codice di deprecazione. |
| v6.0.0 | Deprecazione solo nella documentazione. |
| v0.11.15 | Deprecazione revocata. |
| v0.11.3 | Deprecazione in fase di esecuzione. |
:::

Tipo: Runtime

L'API `tls.createSecurePair()` è stata deprecata nella documentazione in Node.js 0.11.3. Gli utenti dovrebbero utilizzare invece `tls.Socket`.

### DEP0065: `repl.REPL_MODE_MAGIC` e `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v8.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

La costante `REPL_MODE_MAGIC` del modulo `node:repl`, utilizzata per l'opzione `replMode`, è stata rimossa. Il suo comportamento è stato funzionalmente identico a quello di `REPL_MODE_SLOPPY` da Node.js 6.0.0, quando è stato importato V8 5.0. Si prega di utilizzare invece `REPL_MODE_SLOPPY`.

La variabile d'ambiente `NODE_REPL_MODE` viene utilizzata per impostare l'`replMode` sottostante di una sessione `node` interattiva. Anche il suo valore, `magic`, è stato rimosso. Si prega di utilizzare invece `sloppy`.


### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Deprecazione runtime. |
| v8.0.0 | Deprecazione solo documentazione. |
:::

Tipo: Runtime

Le proprietà `OutgoingMessage.prototype._headers` e `OutgoingMessage.prototype._headerNames` del modulo `node:http` sono deprecate. Utilizzare uno dei metodi pubblici (ad es. `OutgoingMessage.prototype.getHeader()`, `OutgoingMessage.prototype.getHeaders()`, `OutgoingMessage.prototype.getHeaderNames()`, `OutgoingMessage.prototype.getRawHeaderNames()`, `OutgoingMessage.prototype.hasHeader()`, `OutgoingMessage.prototype.removeHeader()`, `OutgoingMessage.prototype.setHeader()`) per lavorare con gli header in uscita.

Le proprietà `OutgoingMessage.prototype._headers` e `OutgoingMessage.prototype._headerNames` non sono mai state documentate come proprietà ufficialmente supportate.

### DEP0067: `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Deprecazione solo documentazione. |
:::

Tipo: Solo documentazione

L'API `OutgoingMessage.prototype._renderHeaders()` del modulo `node:http` è deprecata.

La proprietà `OutgoingMessage.prototype._renderHeaders` non è mai stata documentata come API ufficialmente supportata.

### DEP0068: `node debug` {#dep0068-node-debug}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Il comando legacy `node debug` è stato rimosso. |
| v8.0.0 | Deprecazione runtime. |
:::

Tipo: Fine del ciclo di vita

`node debug` corrisponde al debugger CLI legacy che è stato sostituito con un debugger CLI basato su V8-inspector disponibile tramite `node inspect`.

### DEP0069: `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v9.0.0 | Deprecazione runtime. |
| v8.0.0 | Deprecazione solo documentazione. |
:::

Tipo: Fine del ciclo di vita

DebugContext è stato rimosso in V8 e non è disponibile in Node.js 10+.

DebugContext era un'API sperimentale.

### DEP0070: `async_hooks.currentId()` {#dep0070-async_hookscurrentid}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Fine del ciclo di vita. |
| v8.2.0 | Deprecazione runtime. |
:::

Tipo: Fine del ciclo di vita

`async_hooks.currentId()` è stato rinominato `async_hooks.executionAsyncId()` per chiarezza.

Questa modifica è stata apportata mentre `async_hooks` era un'API sperimentale.


### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Fine del ciclo di vita. |
| v8.2.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

`async_hooks.triggerId()` è stato rinominato in `async_hooks.triggerAsyncId()` per maggiore chiarezza.

Questa modifica è stata apportata quando `async_hooks` era un'API sperimentale.

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Fine del ciclo di vita. |
| v8.2.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

`async_hooks.AsyncResource.triggerId()` è stato rinominato in `async_hooks.AsyncResource.triggerAsyncId()` per maggiore chiarezza.

Questa modifica è stata apportata quando `async_hooks` era un'API sperimentale.

### DEP0073: Diverse proprietà interne di `net.Server` {#dep0073-several-internal-properties-of-netserver}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v9.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

L'accesso a diverse proprietà interne e non documentate delle istanze di `net.Server` con nomi inappropriati è deprecato.

Poiché l'API originale non era documentata e non generalmente utile per il codice non interno, non viene fornita alcuna API di sostituzione.

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Fine del ciclo di vita. |
| v9.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

La proprietà `REPLServer.bufferedCommand` è stata deprecata a favore di [`REPLServer.clearBufferedCommand()`](/it/nodejs/api/repl#replserverclearbufferedcommand).

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Fine del ciclo di vita. |
| v9.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

`REPLServer.parseREPLKeyword()` è stato rimosso dalla visibilità dello spazio utente.

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Fine del ciclo di vita. |
| v9.0.0 | Deprecazione a runtime. |
| v8.6.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

`tls.parseCertString()` era un helper di analisi banale che è stato reso pubblico per errore. Sebbene dovesse analizzare le stringhe del soggetto e dell'emittente del certificato, non ha mai gestito correttamente i nomi distinti relativi a più valori.

Le versioni precedenti di questo documento suggerivano di utilizzare `querystring.parse()` come alternativa a `tls.parseCertString()`. Tuttavia, anche `querystring.parse()` non gestisce correttamente tutti gli argomenti del certificato e non deve essere utilizzato.


### DEP0077: `Module._debug()` {#dep0077-module_debug}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Deprecazione in runtime. |
:::

Tipo: Runtime

`Module._debug()` è obsoleto.

La funzione `Module._debug()` non è mai stata documentata come un'API ufficialmente supportata.

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Fine del ciclo di vita. |
| v9.0.0 | Deprecazione in runtime. |
:::

Tipo: Fine del ciclo di vita

`REPLServer.turnOffEditorMode()` è stato rimosso dalla visibilità dell'userland.

### DEP0079: Funzione di ispezione personalizzata sugli oggetti tramite `.inspect()` {#dep0079-custom-inspection-function-on-objects-via-inspect}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Fine del ciclo di vita. |
| v10.0.0 | Deprecazione in runtime. |
| v8.7.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

L'utilizzo di una proprietà denominata `inspect` su un oggetto per specificare una funzione di ispezione personalizzata per [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options) è obsoleto. Utilizzare invece [`util.inspect.custom`](/it/nodejs/api/util#utilinspectcustom). Per la retrocompatibilità con Node.js precedente alla versione 6.4.0, possono essere specificati entrambi.

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione

Il metodo interno `path._makeLong()` non era destinato all'uso pubblico. Tuttavia, i moduli userland lo hanno trovato utile. L'API interna è obsoleta e sostituita con un metodo `path.toNamespacedPath()` pubblico identico.

### DEP0081: `fs.truncate()` che utilizza un descrittore di file {#dep0081-fstruncate-using-a-file-descriptor}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | Deprecazione in runtime. |
:::

Tipo: Runtime

L'utilizzo di `fs.truncate()` e `fs.truncateSync()` con un descrittore di file è obsoleto. Utilizzare `fs.ftruncate()` o `fs.ftruncateSync()` per lavorare con i descrittori di file.

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Fine del ciclo di vita. |
| v9.0.0 | Deprecazione in runtime. |
:::

Tipo: Fine del ciclo di vita

`REPLServer.prototype.memory()` è necessario solo per i meccanismi interni del `REPLServer` stesso. Non utilizzare questa funzione.


### DEP0083: Disabilitazione di ECDH impostando `ecdhCurve` a `false` {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v9.2.0 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita.

L'opzione `ecdhCurve` per `tls.createSecureContext()` e `tls.TLSSocket` poteva essere impostata su `false` per disabilitare completamente ECDH solo sul server. Questa modalità è stata deprecata in preparazione alla migrazione a OpenSSL 1.1.0 e per coerenza con il client ed ora non è supportata. Utilizzare invece il parametro `ciphers`.

### DEP0084: Richiesta di dipendenze interne in bundle {#dep0084-requiring-bundled-internal-dependencies}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Questa funzionalità è stata rimossa. |
| v10.0.0 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

Dalle versioni 4.4.0 e 5.2.0 di Node.js, diversi moduli destinati esclusivamente all'uso interno sono stati erroneamente esposti al codice utente tramite `require()`. Questi moduli erano:

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (dalla 7.6.0)
- `node-inspect/lib/internal/inspect_client` (dalla 7.6.0)
- `node-inspect/lib/internal/inspect_repl` (dalla 7.6.0)

I moduli `v8/*` non hanno alcuna esportazione e, se non importati in un ordine specifico, genererebbero effettivamente errori. Pertanto, non ci sono praticamente casi d'uso legittimi per importarli tramite `require()`.

D'altra parte, `node-inspect` può essere installato localmente tramite un gestore di pacchetti, in quanto è pubblicato nel registro npm con lo stesso nome. Non è necessaria alcuna modifica al codice sorgente se ciò viene fatto.

### DEP0085: API sensibile AsyncHooks {#dep0085-asynchooks-sensitive-api}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v9.4.0, v8.10.0 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

L'API sensibile AsyncHooks non è mai stata documentata e presentava vari piccoli problemi. Utilizzare invece l'API `AsyncResource`. Vedere [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572).


### DEP0086: Rimuovi `runInAsyncIdScope` {#dep0086-remove-runinasyncidscope}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
| v9.4.0, v8.10.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

`runInAsyncIdScope` non emette l'evento `'before'` o `'after'` e può quindi causare molti problemi. Vedi [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328).

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.8.0 | Deprecazione revocata. |
| v9.9.0, v8.13.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Deprecazione revocata

L'importazione diretta di assert non era raccomandata in quanto le funzioni esposte utilizzano controlli di uguaglianza debole. La deprecazione è stata revocata perché l'uso del modulo `node:assert` non è scoraggiato e la deprecazione ha causato confusione negli sviluppatori.

### DEP0090: Lunghezze non valide del tag di autenticazione GCM {#dep0090-invalid-gcm-authentication-tag-lengths}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Fine del ciclo di vita. |
| v10.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

Node.js era solito supportare tutte le lunghezze dei tag di autenticazione GCM accettate da OpenSSL quando si chiama [`decipher.setAuthTag()`](/it/nodejs/api/crypto#deciphersetauthtagbuffer-encoding). A partire da Node.js v11.0.0, sono consentite solo lunghezze di tag di autenticazione di 128, 120, 112, 104, 96, 64 e 32 bit. I tag di autenticazione di altre lunghezze non sono validi secondo [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Fine del ciclo di vita. |
| v10.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

La proprietà `crypto.DEFAULT_ENCODING` esisteva solo per la compatibilità con le versioni di Node.js precedenti alle versioni 0.9.3 ed è stata rimossa.

### DEP0092: `this` di livello superiore associato a `module.exports` {#dep0092-top-level-this-bound-to-moduleexports}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione

L'assegnazione di proprietà a `this` di livello superiore in alternativa a `module.exports` è deprecata. Gli sviluppatori dovrebbero invece utilizzare `exports` o `module.exports`.


### DEP0093: `crypto.fips` è obsoleto e sostituito {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione a runtime. |
| v10.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

La proprietà [`crypto.fips`](/it/nodejs/api/crypto#cryptofips) è obsoleta. Si prega di utilizzare invece `crypto.setFips()` e `crypto.getFips()`.

### DEP0094: Utilizzo di `assert.fail()` con più di un argomento {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Deprecazione a runtime. |
:::

Tipo: Runtime

L'utilizzo di `assert.fail()` con più di un argomento è obsoleto. Utilizzare `assert.fail()` con un solo argomento o utilizzare un metodo diverso del modulo `node:assert`.

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Deprecazione a runtime. |
:::

Tipo: Runtime

`timers.enroll()` è obsoleto. Si prega di utilizzare invece [`setTimeout()`](/it/nodejs/api/timers#settimeoutcallback-delay-args) o [`setInterval()`](/it/nodejs/api/timers#setintervalcallback-delay-args) documentati pubblicamente.

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Deprecazione a runtime. |
:::

Tipo: Runtime

`timers.unenroll()` è obsoleto. Si prega di utilizzare invece [`clearTimeout()`](/it/nodejs/api/timers#cleartimeouttimeout) o [`clearInterval()`](/it/nodejs/api/timers#clearintervaltimeout) documentati pubblicamente.

### DEP0097: `MakeCallback` con proprietà `domain` {#dep0097-makecallback-with-domain-property}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Deprecazione a runtime. |
:::

Tipo: Runtime

Gli utenti di `MakeCallback` che aggiungono la proprietà `domain` per trasportare il contesto, dovrebbero iniziare a utilizzare la variante `async_context` di `MakeCallback` o `CallbackScope`, oppure la classe `AsyncResource` di alto livello.

### DEP0098: API AsyncHooks embedder `AsyncResource.emitBefore` e `AsyncResource.emitAfter` {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine vita. |
| v10.0.0, v9.6.0, v8.12.0 | Deprecazione a runtime. |
:::

Tipo: Fine vita

L'API embedded fornita da AsyncHooks espone i metodi `.emitBefore()` e `.emitAfter()` che sono molto facili da usare in modo errato e possono portare a errori irrecuperabili.

Utilizzare invece l'API [`asyncResource.runInAsyncScope()`](/it/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) che fornisce un'alternativa molto più sicura e conveniente. Vedere [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513).


### DEP0099: API C++ `node::MakeCallback` non consapevoli del contesto asincrono {#dep0099-async-context-unaware-nodemakecallback-c-apis}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Deprecazione in fase di compilazione. |
:::

Tipo: In fase di compilazione

Alcune versioni delle API `node::MakeCallback` disponibili per gli addon nativi sono deprecate. Si prega di utilizzare le versioni dell'API che accettano un parametro `async_context`.

### DEP0100: `process.assert()` {#dep0100-processassert}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Fine del ciclo di vita. |
| v10.0.0 | Deprecazione in fase di esecuzione. |
| v0.3.7 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

`process.assert()` è deprecato. Si prega di utilizzare il modulo [`assert`](/it/nodejs/api/assert) invece.

Questa non è mai stata una funzionalità documentata.

### DEP0101: `--with-lttng` {#dep0101---with-lttng}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
:::

Tipo: Fine del ciclo di vita

L'opzione di compilazione `--with-lttng` è stata rimossa.

### DEP0102: Utilizzo di `noAssert` nelle operazioni `Buffer#(read|write)` {#dep0102-using-noassert-in-bufferread|write-operations}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Fine del ciclo di vita. |
:::

Tipo: Fine del ciclo di vita

L'utilizzo dell'argomento `noAssert` non ha più alcuna funzionalità. Tutti gli input vengono verificati indipendentemente dal valore di `noAssert`. Saltare la verifica potrebbe portare a errori e crash difficili da trovare.

### DEP0103: Controlli dei tipi `process.binding('util').is[...]` {#dep0103-processbindingutilis-typechecks}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.9.0 | Superato da [DEP0111](/it/nodejs/api/deprecations#DEP0111). |
| v10.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

L'utilizzo di `process.binding()` in generale dovrebbe essere evitato. I metodi di controllo dei tipi in particolare possono essere sostituiti utilizzando [`util.types`](/it/nodejs/api/util#utiltypes).

Questa deprecazione è stata superata dalla deprecazione dell'API `process.binding()` ([DEP0111](/it/nodejs/api/deprecations#DEP0111)).

### DEP0104: Coercizione di stringhe di `process.env` {#dep0104-processenv-string-coercion}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

Quando si assegna una proprietà non stringa a [`process.env`](/it/nodejs/api/process#processenv), il valore assegnato viene implicitamente convertito in una stringa. Questo comportamento è deprecato se il valore assegnato non è una stringa, un booleano o un numero. In futuro, tale assegnazione potrebbe comportare un errore. Si prega di convertire la proprietà in una stringa prima di assegnarla a `process.env`.


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Fine del ciclo di vita. |
| v10.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

`decipher.finaltol()` non è mai stato documentato ed era un alias per [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding). Questa API è stata rimossa ed è consigliabile utilizzare invece [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding).

### DEP0106: `crypto.createCipher` e `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | Fine del ciclo di vita. |
| v11.0.0 | Deprecazione a runtime. |
| v10.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

`crypto.createCipher()` e `crypto.createDecipher()` sono stati rimossi perché utilizzano una funzione di derivazione della chiave debole (MD5 senza salt) e vettori di inizializzazione statici. Si consiglia di derivare una chiave utilizzando [`crypto.pbkdf2()`](/it/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) o [`crypto.scrypt()`](/it/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) con salt casuali e di utilizzare [`crypto.createCipheriv()`](/it/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) e [`crypto.createDecipheriv()`](/it/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) per ottenere rispettivamente gli oggetti [`Cipher`](/it/nodejs/api/crypto#class-cipher) e [`Decipher`](/it/nodejs/api/crypto#class-decipher).

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Fine del ciclo di vita. |
| v10.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

Questa era una funzione helper non documentata e non destinata all'uso al di fuori del core di Node.js e obsoleta dalla rimozione del supporto NPN (Next Protocol Negotiation).

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Fine del ciclo di vita. |
| v11.0.0 | Deprecazione a runtime. |
| v10.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

Alias deprecato per [`zlib.bytesWritten`](/it/nodejs/api/zlib#zlibbyteswritten). Il nome originale è stato scelto perché aveva senso interpretare il valore anche come il numero di byte letti dal motore, ma è incoerente con altri stream in Node.js che espongono valori con questi nomi.


### DEP0109: Supporto `http`, `https` e `tls` per URL non validi {#dep0109-http-https-and-tls-support-for-invalid-urls}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Fine del ciclo di vita. |
| v11.0.0 | Deprecazione a runtime. |
:::

Tipo: Fine del ciclo di vita

Alcuni URL precedentemente supportati (ma strettamente non validi) erano accettati tramite le API [`http.request()`](/it/nodejs/api/http#httprequestoptions-callback), [`http.get()`](/it/nodejs/api/http#httpgetoptions-callback), [`https.request()`](/it/nodejs/api/https#httpsrequestoptions-callback), [`https.get()`](/it/nodejs/api/https#httpsgetoptions-callback) e [`tls.checkServerIdentity()`](/it/nodejs/api/tls#tlscheckserveridentityhostname-cert) perché erano accettati dalla vecchia API `url.parse()`. Le API menzionate ora utilizzano il parser URL WHATWG che richiede URL strettamente validi. Passare un URL non valido è deprecato e il supporto verrà rimosso in futuro.

### DEP0110: Dati memorizzati nella cache di `vm.Script` {#dep0110-vmscript-cached-data}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.6.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione

L'opzione `produceCachedData` è deprecata. Utilizzare invece [`script.createCachedData()`](/it/nodejs/api/vm#scriptcreatecacheddata).

### DEP0111: `process.binding()` {#dep0111-processbinding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.12.0 | Aggiunto il supporto per `--pending-deprecation`. |
| v10.9.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

`process.binding()` è destinato esclusivamente all'uso da parte del codice interno di Node.js.

Sebbene `process.binding()` non abbia raggiunto lo stato di fine ciclo di vita in generale, non è disponibile quando il [modello di autorizzazioni](/it/nodejs/api/permissions#permission-model) è abilitato.

### DEP0112: API private `dgram` {#dep0112-dgram-private-apis}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Deprecazione a runtime. |
:::

Tipo: Runtime

Il modulo `node:dgram` conteneva precedentemente diverse API che non erano mai destinate all'accesso al di fuori del core di Node.js: `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()` e `dgram._createSocketHandle()`.


### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v11.0.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

`Cipher.setAuthTag()` e `Decipher.getAuthTag()` non sono più disponibili. Non sono mai stati documentati e generavano un errore quando venivano chiamati.

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v11.0.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

La funzione `crypto._toBuf()` non è stata progettata per essere utilizzata da moduli al di fuori del core di Node.js ed è stata rimossa.

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Aggiunta la deprecazione solo nella documentazione con supporto per `--pending-deprecation`. |
:::

Tipo: Solo documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

Nelle versioni recenti di Node.js, non c'è differenza tra [`crypto.randomBytes()`](/it/nodejs/api/crypto#cryptorandombytessize-callback) e `crypto.pseudoRandomBytes()`. Quest'ultimo è deprecato insieme agli alias non documentati `crypto.prng()` e `crypto.rng()` a favore di [`crypto.randomBytes()`](/it/nodejs/api/crypto#cryptorandombytessize-callback) e potrebbe essere rimosso in una versione futura.

### DEP0116: API URL legacy {#dep0116-legacy-url-api}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()` è di nuovo deprecato in DEP0169. |
| v15.13.0, v14.17.0 | Deprecazione revocata. Lo stato è cambiato in "Legacy". |
| v11.0.0 | Deprecazione solo documentazione. |
:::

Tipo: Deprecazione revocata

La [legacy URL API](/it/nodejs/api/url#legacy-url-api) è deprecata. Ciò include [`url.format()`](/it/nodejs/api/url#urlformaturlobject), [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), [`url.resolve()`](/it/nodejs/api/url#urlresolvefrom-to) e il [legacy `urlObject`](/it/nodejs/api/url#legacy-urlobject). Si prega di utilizzare invece la [WHATWG URL API](/it/nodejs/api/url#the-whatwg-url-api).


### DEP0117: Handle crittografici nativi {#dep0117-native-crypto-handles}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v11.0.0 | Deprecazione runtime. |
:::

Tipo: Fine del ciclo di vita

Le versioni precedenti di Node.js esponevano handle a oggetti nativi interni tramite la proprietà `_handle` delle classi `Cipher`, `Decipher`, `DiffieHellman`, `DiffieHellmanGroup`, `ECDH`, `Hash`, `Hmac`, `Sign` e `Verify`. La proprietà `_handle` è stata rimossa perché l'uso improprio dell'oggetto nativo può portare al crash dell'applicazione.

### DEP0118: Supporto di `dns.lookup()` per un nome host falsy {#dep0118-dnslookup-support-for-a-falsy-host-name}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Deprecazione runtime. |
:::

Tipo: Runtime

Le versioni precedenti di Node.js supportavano `dns.lookup()` con un nome host falsy come `dns.lookup(false)` a causa della retrocompatibilità. Questo comportamento non è documentato e si pensa che non venga utilizzato nelle app del mondo reale. Diventerà un errore nelle future versioni di Node.js.

### DEP0119: API privata `process.binding('uv').errname()` {#dep0119-processbindinguverrname-private-api}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.0.0 | Deprecazione solo documentazione. |
:::

Tipo: Solo documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

`process.binding('uv').errname()` è deprecato. Si prega di utilizzare invece [`util.getSystemErrorName()`](/it/nodejs/api/util#utilgetsystemerrornameerr).

### DEP0120: Supporto per i contatori delle prestazioni di Windows {#dep0120-windows-performance-counter-support}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Fine del ciclo di vita. |
| v11.0.0 | Deprecazione runtime. |
:::

Tipo: Fine del ciclo di vita

Il supporto per i contatori delle prestazioni di Windows è stato rimosso da Node.js. Le funzioni non documentate `COUNTER_NET_SERVER_CONNECTION()`, `COUNTER_NET_SERVER_CONNECTION_CLOSE()`, `COUNTER_HTTP_SERVER_REQUEST()`, `COUNTER_HTTP_SERVER_RESPONSE()`, `COUNTER_HTTP_CLIENT_REQUEST()` e `COUNTER_HTTP_CLIENT_RESPONSE()` sono state deprecate.

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Deprecazione runtime. |
:::

Tipo: Runtime

La funzione non documentata `net._setSimultaneousAccepts()` era originariamente destinata al debug e all'ottimizzazione delle prestazioni quando si utilizzavano i moduli `node:child_process` e `node:cluster` su Windows. La funzione non è generalmente utile e viene rimossa. Vedere la discussione qui: [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)


### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Deprecazione in fase di runtime. |
:::

Tipo: Runtime

Si prega di utilizzare invece `Server.prototype.setSecureContext()`.

### DEP0123: impostazione del ServerName TLS su un indirizzo IP {#dep0123-setting-the-tls-servername-to-an-ip-address}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Deprecazione in fase di runtime. |
:::

Tipo: Runtime

L'impostazione del ServerName TLS su un indirizzo IP non è consentita da [RFC 6066](https://tools.ietf.org/html/rfc6066#section-3). Questo verrà ignorato in una versione futura.

### DEP0124: utilizzo di `REPLServer.rli` {#dep0124-using-replserverrli}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Fine del ciclo di vita. |
| v12.0.0 | Deprecazione in fase di runtime. |
:::

Tipo: Fine del ciclo di vita

Questa proprietà è un riferimento all'istanza stessa.

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.0.0 | Deprecazione in fase di runtime. |
:::

Tipo: Runtime

Il modulo `node:_stream_wrap` è deprecato.

### DEP0126: `timers.active()` {#dep0126-timersactive}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.14.0 | Deprecazione in fase di runtime. |
:::

Tipo: Runtime

Il `timers.active()` precedentemente non documentato è deprecato. Si prega di utilizzare invece [`timeout.refresh()`](/it/nodejs/api/timers#timeoutrefresh) documentato pubblicamente. Se è necessario fare nuovamente riferimento al timeout, [`timeout.ref()`](/it/nodejs/api/timers#timeoutref) può essere utilizzato senza alcun impatto sulle prestazioni da Node.js 10.

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.14.0 | Deprecazione in fase di runtime. |
:::

Tipo: Runtime

Il `timers._unrefActive()` precedentemente non documentato e "privato" è deprecato. Si prega di utilizzare invece [`timeout.refresh()`](/it/nodejs/api/timers#timeoutrefresh) documentato pubblicamente. Se è necessario annullare il riferimento al timeout, [`timeout.unref()`](/it/nodejs/api/timers#timeoutunref) può essere utilizzato senza alcun impatto sulle prestazioni da Node.js 10.

### DEP0128: moduli con una voce `main` non valida e un file `index.js` {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Deprecazione in fase di runtime. |
| v12.0.0 | Solo documentazione. |
:::

Tipo: Runtime

I moduli che hanno una voce `main` non valida (ad es. `./does-not-exist.js`) e hanno anche un file `index.js` nella directory di livello superiore risolveranno il file `index.js`. Ciò è deprecato e genererà un errore nelle future versioni di Node.js.


### DEP0129: `ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Deprecazione in fase di esecuzione. |
| v11.14.0 | Solo documentazione. |
:::

Tipo: Esecuzione

La proprietà `_channel` degli oggetti del processo figlio restituiti da `spawn()` e funzioni simili non è destinata all'uso pubblico. Utilizzare invece `ChildProcess.channel`.

### DEP0130: `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Fine del ciclo di vita. |
| v13.0.0 | Deprecazione in fase di esecuzione. |
| v12.2.0 | Solo documentazione. |
:::

Tipo: Fine del ciclo di vita

Utilizzare invece [`module.createRequire()`](/it/nodejs/api/module#modulecreaterequirefilename).

### DEP0131: Parser HTTP legacy {#dep0131-legacy-http-parser}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Questa funzionalità è stata rimossa. |
| v12.22.0 | Deprecazione in fase di esecuzione. |
| v12.3.0 | Solo documentazione. |
:::

Tipo: Fine del ciclo di vita

Il parser HTTP legacy, utilizzato per impostazione predefinita nelle versioni di Node.js precedenti alla 12.0.0, è deprecato ed è stato rimosso nella v13.0.0. Prima della v13.0.0, il flag della riga di comando `--http-parser=legacy` poteva essere utilizzato per ripristinare l'utilizzo del parser legacy.

### DEP0132: `worker.terminate()` con callback {#dep0132-workerterminate-with-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.5.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Esecuzione

Passare una callback a [`worker.terminate()`](/it/nodejs/api/worker_threads#workerterminate) è deprecato. Utilizzare invece la `Promise` restituita o un listener all'evento `'exit'` del worker.

### DEP0133: `http` `connection` {#dep0133-http-connection}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.12.0 | Deprecazione solo documentazione. |
:::

Tipo: Solo documentazione

Preferire [`response.socket`](/it/nodejs/api/http#responsesocket) a [`response.connection`](/it/nodejs/api/http#responseconnection) e [`request.socket`](/it/nodejs/api/http#requestsocket) a [`request.connection`](/it/nodejs/api/http#requestconnection).

### DEP0134: `process._tickCallback` {#dep0134-process_tickcallback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.12.0 | Deprecazione solo documentazione. |
:::

Tipo: Solo documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

La proprietà `process._tickCallback` non è mai stata documentata come API ufficialmente supportata.


### DEP0135: `WriteStream.open()` e `ReadStream.open()` sono interni {#dep0135-writestreamopen-and-readstreamopen-are-internal}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Deprecazione a runtime. |
:::

Tipo: Runtime

[`WriteStream.open()`](/it/nodejs/api/fs#class-fswritestream) e [`ReadStream.open()`](/it/nodejs/api/fs#class-fsreadstream) sono API interne non documentate che non hanno senso utilizzare nello userspace. Gli stream di file dovrebbero essere sempre aperti tramite i relativi metodi factory [`fs.createWriteStream()`](/it/nodejs/api/fs#fscreatewritestreampath-options) e [`fs.createReadStream()`](/it/nodejs/api/fs#fscreatereadstreampath-options) o passando un descrittore di file nelle opzioni.

### DEP0136: `http` `finished` {#dep0136-http-finished}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.4.0, v12.16.0 | Deprecazione solo della documentazione. |
:::

Tipo: Solo documentazione

[`response.finished`](/it/nodejs/api/http#responsefinished) indica se [`response.end()`](/it/nodejs/api/http#responseenddata-encoding-callback) è stato chiamato, non se `'finish'` è stato emesso e i dati sottostanti sono stati scaricati.

Utilizzare invece [`response.writableFinished`](/it/nodejs/api/http#responsewritablefinished) o [`response.writableEnded`](/it/nodejs/api/http#responsewritableended) per evitare l'ambiguità.

Per mantenere il comportamento esistente, `response.finished` dovrebbe essere sostituito con `response.writableEnded`.

### DEP0137: Chiusura di fs.FileHandle durante il garbage collection {#dep0137-closing-fsfilehandle-on-garbage-collection}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Deprecazione a runtime. |
:::

Tipo: Runtime

Consentire la chiusura di un oggetto [`fs.FileHandle`](/it/nodejs/api/fs#class-filehandle) durante il garbage collection è deprecato. In futuro, ciò potrebbe comportare un errore che terminerà il processo.

Assicurarsi che tutti gli oggetti `fs.FileHandle` siano esplicitamente chiusi utilizzando `FileHandle.prototype.close()` quando `fs.FileHandle` non è più necessario:

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule` {#dep0138-processmainmodule}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione

[`process.mainModule`](/it/nodejs/api/process#processmainmodule) è una funzionalità solo CommonJS mentre l'oggetto globale `process` è condiviso con ambienti non-CommonJS. Il suo utilizzo all'interno di moduli ECMAScript non è supportato.

È deprecato a favore di [`require.main`](/it/nodejs/api/modules#accessing-the-main-module), perché serve allo stesso scopo ed è disponibile solo in ambienti CommonJS.

### DEP0139: `process.umask()` senza argomenti {#dep0139-processumask-with-no-arguments}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0, v12.19.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione

Chiamare `process.umask()` senza argomenti fa sì che l'umask a livello di processo venga scritto due volte. Questo introduce una race condition tra i thread ed è una potenziale vulnerabilità di sicurezza. Non esiste un'API alternativa sicura e multipiattaforma.

### DEP0140: Utilizzare `request.destroy()` invece di `request.abort()` {#dep0140-use-requestdestroy-instead-of-requestabort}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.1.0, v13.14.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione

Utilizzare [`request.destroy()`](/it/nodejs/api/http#requestdestroyerror) invece di [`request.abort()`](/it/nodejs/api/http#requestabort).

### DEP0141: `repl.inputStream` e `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.3.0 | Solo nella documentazione (supporta [`--pending-deprecation`][]). |
:::

Tipo: Solo nella documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

Il modulo `node:repl` ha esportato lo stream di input e output due volte. Utilizzare `.input` invece di `.inputStream` e `.output` invece di `.outputStream`.

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.3.0 | Solo nella documentazione (supporta [`--pending-deprecation`][]). |
:::

Tipo: Solo nella documentazione

Il modulo `node:repl` esporta una proprietà `_builtinLibs` che contiene un array di moduli integrati. Finora era incompleto ed è invece meglio fare affidamento su `require('node:module').builtinModules`.


### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Runtime `Transform._transformState` verrà rimosso nelle versioni future in cui non è più richiesto a causa della semplificazione dell'implementazione.

### DEP0144: `module.parent` {#dep0144-moduleparent}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.6.0, v12.19.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

Un modulo CommonJS può accedere al primo modulo che lo ha richiesto tramite `module.parent`. Questa funzionalità è deprecata perché non funziona in modo coerente in presenza di moduli ECMAScript e perché fornisce una rappresentazione inaccurata del grafico dei moduli CommonJS.

Alcuni moduli lo utilizzano per verificare se sono il punto di ingresso del processo corrente. Invece, si consiglia di confrontare `require.main` e `module`:

```js [ESM]
if (require.main === module) {
  // Sezione di codice che verrà eseguita solo se il file corrente è il punto di ingresso.
}
```
Quando si cercano i moduli CommonJS che hanno richiesto quello corrente, è possibile utilizzare `require.cache` e `module.children`:

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.6.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione

[`socket.bufferSize`](/it/nodejs/api/net#socketbuffersize) è solo un alias per [`writable.writableLength`](/it/nodejs/api/stream#writablewritablelength).

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.9.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione

Il [`crypto.Certificate()` constructor](/it/nodejs/api/crypto#legacy-api) è deprecato. Invece, utilizzare i [metodi statici di `crypto.Certificate()`](/it/nodejs/api/crypto#class-certificate).

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Deprecazione in fase di esecuzione. |
| v15.0.0 | Deprecazione in fase di esecuzione per comportamento permissivo. |
| v14.14.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

Nelle versioni future di Node.js, l'opzione `recursive` verrà ignorata per `fs.rmdir`, `fs.rmdirSync` e `fs.promises.rmdir`.

Invece, utilizzare `fs.rm(path, { recursive: true, force: true })`, `fs.rmSync(path, { recursive: true, force: true })` o `fs.promises.rm(path, { recursive: true, force: true })`.


### DEP0148: Mappature di cartelle in `"exports"` ( `"/"` finale) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.0.0 | Fine del ciclo di vita. |
| v16.0.0 | Deprecazione in fase di esecuzione. |
| v15.1.0 | Deprecazione in fase di esecuzione per importazioni auto-referenziali. |
| v14.13.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

L'utilizzo di `"/"` finale per definire mappature di sottocartelle nei campi [esportazioni di sottopercorso](/it/nodejs/api/packages#subpath-exports) o [importazioni di sottopercorso](/it/nodejs/api/packages#subpath-imports) è deprecato. Invece, utilizzare [pattern di sottopercorso](/it/nodejs/api/packages#subpath-patterns).

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione.

Preferire [`message.socket`](/it/nodejs/api/http#messagesocket) a [`message.connection`](/it/nodejs/api/http#messageconnection).

### DEP0150: Modifica del valore di `process.config` {#dep0150-changing-the-value-of-processconfig}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Fine del ciclo di vita. |
| v16.0.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Fine del ciclo di vita

La proprietà `process.config` fornisce accesso alle impostazioni di compilazione di Node.js. Tuttavia, la proprietà è modificabile e quindi soggetta a manomissioni. La possibilità di modificare il valore verrà rimossa in una versione futura di Node.js.

### DEP0151: Ricerca dell'indice principale e ricerca dell'estensione {#dep0151-main-index-lookup-and-extension-searching}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Deprecazione in fase di esecuzione. |
| v15.8.0, v14.18.0 | Deprecazione solo nella documentazione con supporto `--pending-deprecation`. |
:::

Tipo: Runtime

In precedenza, le ricerche di `index.js` e di estensione si applicavano alla risoluzione del punto di ingresso principale `import 'pkg'`, anche durante la risoluzione dei moduli ES.

Con questa deprecazione, tutte le risoluzioni del punto di ingresso principale del modulo ES richiedono una voce [`"exports"` o `"main"` esplicita](/it/nodejs/api/packages#main-entry-point-export) con l'esatta estensione del file.

### DEP0152: Proprietà Extension PerformanceEntry {#dep0152-extension-performanceentry-properties}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Deprecazione in fase di esecuzione. |
:::

Tipo: Runtime

I tipi di oggetto [\<PerformanceEntry\>](/it/nodejs/api/perf_hooks#class-performanceentry) `'gc'`, `'http2'` e `'http'` hanno proprietà aggiuntive assegnate che forniscono informazioni supplementari. Queste proprietà sono ora disponibili all'interno della proprietà standard `detail` dell'oggetto `PerformanceEntry`. Gli accessor esistenti sono stati deprecati e non devono più essere utilizzati.


### DEP0153: Forzatura del tipo delle opzioni `dns.lookup` e `dnsPromises.lookup` {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Fine del ciclo di vita. |
| v17.0.0 | Deprecazione in fase di esecuzione. |
| v16.8.0 | Deprecazione solo documentale. |
:::

Tipo: Fine del ciclo di vita

L'utilizzo di un valore non null o non intero per l'opzione `family`, un valore non null o non numerico per l'opzione `hints`, un valore non null o non booleano per l'opzione `all` o un valore non null o non booleano per l'opzione `verbatim` in [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/it/nodejs/api/dns#dnspromiseslookuphostname-options) genera un errore `ERR_INVALID_ARG_TYPE`.

### DEP0154: Opzioni di generazione della coppia di chiavi RSA-PSS {#dep0154-rsa-pss-generate-key-pair-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Deprecazione in fase di esecuzione. |
| v16.10.0 | Deprecazione solo documentale. |
:::

Tipo: In fase di esecuzione

Le opzioni `'hash'` e `'mgf1Hash'` sono sostituite da `'hashAlgorithm'` e `'mgf1HashAlgorithm'`.

### DEP0155: Barre finali nelle risoluzioni dello specificatore di pattern {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.0.0 | Deprecazione in fase di esecuzione. |
| v16.10.0 | Deprecazione solo documentale con supporto `--pending-deprecation`. |
:::

Tipo: In fase di esecuzione

La rimappatura degli specificatori che terminano con `"/"` come `import 'pkg/x/'` è obsoleta per le risoluzioni di pattern `"exports"` e `"imports"` del pacchetto.

### DEP0156: Proprietà `.aborted` ed evento `'abort'`, `'aborted'` in `http` {#dep0156-aborted-property-and-abort-aborted-event-in-http}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.0.0, v16.12.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

Passare all'API [\<Stream\>](/it/nodejs/api/stream#stream) invece, poiché [`http.ClientRequest`](/it/nodejs/api/http#class-httpclientrequest), [`http.ServerResponse`](/it/nodejs/api/http#class-httpserverresponse) e [`http.IncomingMessage`](/it/nodejs/api/http#class-httpincomingmessage) sono tutti basati su stream. Controllare `stream.destroyed` invece della proprietà `.aborted` e ascoltare `'close'` invece dell'evento `'abort'`, `'aborted'`.

La proprietà `.aborted` e l'evento `'abort'` sono utili solo per rilevare le chiamate a `.abort()`. Per chiudere una richiesta in anticipo, utilizzare Stream `.destroy([error])` quindi verificare che la proprietà `.destroyed` e l'evento `'close'` debbano avere lo stesso effetto. L'estremità ricevente deve anche controllare il valore [`readable.readableEnded`](/it/nodejs/api/stream#readablereadableended) su [`http.IncomingMessage`](/it/nodejs/api/http#class-httpincomingmessage) per ottenere se si trattava di un'interruzione o di una distruzione corretta.


### DEP0157: Supporto Thenable negli stream {#dep0157-thenable-support-in-streams}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Fine del ciclo di vita. |
| v17.2.0, v16.14.0 | Deprecazione solo documentale. |
:::

Tipo: Fine del ciclo di vita

Una funzionalità non documentata degli stream di Node.js era quella di supportare i thenable nei metodi di implementazione. Questa è ora deprecata, utilizzare invece i callback ed evitare l'uso di funzioni async per i metodi di implementazione degli stream.

Questa funzionalità ha fatto sì che gli utenti riscontrassero problemi imprevisti in cui l'utente implementa la funzione in stile callback ma utilizza ad esempio un metodo async che causerebbe un errore poiché la combinazione di promesse e semantica di callback non è valida.

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.5.0, v16.15.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentazione

Questo metodo è stato deprecato perché non è compatibile con `Uint8Array.prototype.slice()`, che è una superclasse di `Buffer`.

Utilizzare invece [`buffer.subarray`](/it/nodejs/api/buffer#bufsubarraystart-end) che fa la stessa cosa.

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Fine del ciclo di vita. |
:::

Tipo: Fine del ciclo di vita

Questo codice di errore è stato rimosso a causa dell'aggiunta di ulteriore confusione agli errori utilizzati per la convalida del tipo di valore.

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Deprecazione runtime. |
| v17.6.0, v16.15.0 | Deprecazione solo documentale. |
:::

Tipo: Runtime.

Questo evento è stato deprecato perché non funzionava con i combinatori di promesse V8, il che ne ha diminuito l'utilità.

### DEP0161: `process._getActiveRequests()` e `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.6.0, v16.15.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentazione

Le funzioni `process._getActiveHandles()` e `process._getActiveRequests()` non sono destinate all'uso pubblico e possono essere rimosse nelle versioni future.

Utilizzare [`process.getActiveResourcesInfo()`](/it/nodejs/api/process#processgetactiveresourcesinfo) per ottenere un elenco dei tipi di risorse attive e non i riferimenti effettivi.


### DEP0162: `fs.write()`, `fs.writeFileSync()` forzatura a stringa {#dep0162-fswrite-fswritefilesync-coercion-to-string}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Fine del ciclo di vita. |
| v18.0.0 | Deprecazione in fase di esecuzione. |
| v17.8.0, v16.15.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine del ciclo di vita

La forzatura implicita di oggetti con proprietà `toString` propria, passati come secondo parametro in [`fs.write()`](/it/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback), [`fs.writeFile()`](/it/nodejs/api/fs#fswritefilefile-data-options-callback), [`fs.appendFile()`](/it/nodejs/api/fs#fsappendfilepath-data-options-callback), [`fs.writeFileSync()`](/it/nodejs/api/fs#fswritefilesyncfile-data-options) e [`fs.appendFileSync()`](/it/nodejs/api/fs#fsappendfilesyncpath-data-options) è deprecata. Convertirli in stringhe primitive.

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.7.0, v16.17.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo nella documentazione

Questi metodi sono stati deprecati perché possono essere utilizzati in un modo che non mantiene il riferimento al canale attivo abbastanza a lungo per ricevere gli eventi.

Utilizzare [`diagnostics_channel.subscribe(name, onMessage)`](/it/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) o [`diagnostics_channel.unsubscribe(name, onMessage)`](/it/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage) che fanno la stessa cosa.

### DEP0164: `process.exit(code)`, `process.exitCode` forzatura a intero {#dep0164-processexitcode-processexitcode-coercion-to-integer}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Fine del ciclo di vita. |
| v19.0.0 | Deprecazione in fase di esecuzione. |
| v18.10.0, v16.18.0 | Deprecazione solo nella documentazione della forzatura a intero di `process.exitCode`. |
| v18.7.0, v16.17.0 | Deprecazione solo nella documentazione della forzatura a intero di `process.exit(code)`. |
:::

Tipo: Fine del ciclo di vita

Valori diversi da `undefined`, `null`, numeri interi e stringhe intere (ad es. `'1'`) sono deprecati come valore per il parametro `code` in [`process.exit()`](/it/nodejs/api/process#processexitcode) e come valore da assegnare a [`process.exitCode`](/it/nodejs/api/process#processexitcode_1).


### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Fine del ciclo di vita. |
| v22.0.0 | Deprecazione in fase di runtime. |
| v18.8.0, v16.18.0 | Deprecazione solo documentale. |
:::

Tipo: Fine del ciclo di vita

Il flag `--trace-atomics-wait` è stato rimosso perché utilizza l'hook V8 `SetAtomicsWaitCallback`, che verrà rimosso in una futura release di V8.

### DEP0166: Doppi slash in target di importazione ed esportazione {#dep0166-double-slashes-in-imports-and-exports-targets}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Deprecazione in fase di runtime. |
| v18.10.0 | Deprecazione solo documentale con supporto `--pending-deprecation`. |
:::

Tipo: Runtime

L'associazione di target di importazione ed esportazione di pacchetti a percorsi contenenti un doppio slash (di *"/"* o *"\"*) è deprecata e genererà un errore di convalida della risoluzione in una release futura. Questa stessa deprecazione si applica anche alle corrispondenze di pattern che iniziano o terminano con uno slash.

### DEP0167: Istanze deboli di `DiffieHellmanGroup` (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.10.0, v16.18.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentazione

I ben noti gruppi MODP `modp1`, `modp2` e `modp5` sono deprecati perché non sono sicuri contro attacchi pratici. Vedere la [RFC 8247 Sezione 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4) per i dettagli.

Questi gruppi potrebbero essere rimossi nelle future versioni di Node.js. Le applicazioni che si basano su questi gruppi dovrebbero valutare l'utilizzo di gruppi MODP più forti.

### DEP0168: Eccezione non gestita nei callback Node-API {#dep0168-unhandled-exception-in-node-api-callbacks}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.3.0, v16.17.0 | Deprecazione in fase di runtime. |
:::

Tipo: Runtime

La soppressione implicita delle eccezioni non gestite nei callback Node-API è ora deprecata.

Imposta il flag [`--force-node-api-uncaught-exceptions-policy`](/it/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) per forzare Node.js a emettere un evento [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception) se l'eccezione non viene gestita nei callback Node-API.


### DEP0169: `url.parse()` non sicuro {#dep0169-insecure-urlparse}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.9.0, v18.17.0 | Aggiunto il supporto per `--pending-deprecation`. |
| v19.0.0, v18.13.0 | Deprecazione solo documentazione. |
:::

Tipo: Solo documentazione (supporta [`--pending-deprecation`](/it/nodejs/api/cli#--pending-deprecation))

Il comportamento di [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) non è standardizzato ed è soggetto a errori che hanno implicazioni per la sicurezza. Utilizzare invece la [WHATWG URL API](/it/nodejs/api/url#the-whatwg-url-api). Le CVE non vengono rilasciate per le vulnerabilità di `url.parse()`.

### DEP0170: Porta non valida quando si utilizza `url.parse()` {#dep0170-invalid-port-when-using-urlparse}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Deprecazione runtime. |
| v19.2.0, v18.13.0 | Deprecazione solo documentazione. |
:::

Tipo: Runtime

[`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) accetta URL con porte che non sono numeri. Questo comportamento potrebbe comportare lo spoofing del nome host con input imprevisti. Questi URL genereranno un errore nelle versioni future di Node.js, come fa già la [WHATWG URL API](/it/nodejs/api/url#the-whatwg-url-api).

### DEP0171: Setter per intestazioni e trailer di `http.IncomingMessage` {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.3.0, v18.13.0 | Deprecazione solo documentazione. |
:::

Tipo: Solo documentazione

In una versione futura di Node.js, [`message.headers`](/it/nodejs/api/http#messageheaders), [`message.headersDistinct`](/it/nodejs/api/http#messageheadersdistinct), [`message.trailers`](/it/nodejs/api/http#messagetrailers) e [`message.trailersDistinct`](/it/nodejs/api/http#messagetrailersdistinct) saranno di sola lettura.

### DEP0172: La proprietà `asyncResource` delle funzioni associate di `AsyncResource` {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0 | Deprecazione runtime. |
:::

Tipo: Runtime

In una versione futura di Node.js, la proprietà `asyncResource` non verrà più aggiunta quando una funzione viene associata a un `AsyncResource`.

### DEP0173: La classe `assert.CallTracker` {#dep0173-the-assertcalltracker-class}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.1.0 | Deprecazione solo documentazione. |
:::

Tipo: Solo documentazione

In una versione futura di Node.js, [`assert.CallTracker`](/it/nodejs/api/assert#class-assertcalltracker) verrà rimossa. Considerare alternative come la funzione helper [`mock`](/it/nodejs/api/test#mocking).


### DEP0174: chiamare `promisify` su una funzione che restituisce una `Promise` {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.0.0 | Deprecazione in fase di esecuzione. |
| v20.8.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

Chiamare [`util.promisify`](/it/nodejs/api/util#utilpromisifyoriginal) su una funzione che restituisce una

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.8.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione

L'API [`util.toUSVString()`](/it/nodejs/api/util#utiltousvstringstring) è deprecata. Si prega di utilizzare [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) invece.

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.8.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione

I getter `F_OK`, `R_OK`, `W_OK` e `X_OK` esposti direttamente su `node:fs` sono deprecati. Ottenerli invece da `fs.constants` o `fs.promises.constants`.

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.7.0, v20.12.0 | Fine vita. |
| v21.3.0, v20.11.0 | È stato assegnato un codice di deprecazione. |
| v14.0.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Fine vita

L'API `util.types.isWebAssemblyCompiledModule` è stata rimossa. Si prega di utilizzare `value instanceof WebAssembly.Module` invece.

### DEP0178: `dirent.path` {#dep0178-direntpath}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione in fase di esecuzione. |
| v21.5.0, v20.12.0, v18.20.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

[`dirent.path`](/it/nodejs/api/fs#direntpath) è deprecato a causa della sua mancanza di coerenza tra le release line. Si prega di utilizzare invece [`dirent.parentPath`](/it/nodejs/api/fs#direntparentpath).

### DEP0179: Costruttore `Hash` {#dep0179-hash-constructor}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | Deprecazione in fase di esecuzione. |
| v21.5.0, v20.12.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

Chiamare direttamente la classe `Hash` con `Hash()` o `new Hash()` è deprecato perché si tratta di elementi interni, non destinati all'uso pubblico. Si prega di utilizzare il metodo [`crypto.createHash()`](/it/nodejs/api/crypto#cryptocreatehashalgorithm-options) per creare istanze di Hash.


### DEP0180: Costruttore `fs.Stats` {#dep0180-fsstats-constructor}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | Deprecazione in fase di esecuzione. |
| v20.13.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

Chiamare direttamente la classe `fs.Stats` con `Stats()` o `new Stats()` è deprecato perché sono elementi interni e non destinati all'uso pubblico.

### DEP0181: Costruttore `Hmac` {#dep0181-hmac-constructor}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0 | Deprecazione in fase di esecuzione. |
| v20.13.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

Chiamare direttamente la classe `Hmac` con `Hmac()` o `new Hmac()` è deprecato perché sono elementi interni e non destinati all'uso pubblico. Si prega di utilizzare il metodo [`crypto.createHmac()`](/it/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) per creare istanze Hmac.

### DEP0182: Tag di autenticazione GCM brevi senza `authTagLength` esplicito {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.0.0 | Deprecazione in fase di esecuzione. |
| v20.13.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Runtime

Le applicazioni che intendono utilizzare tag di autenticazione più corti della lunghezza predefinita del tag di autenticazione devono impostare l'opzione `authTagLength` della funzione [`crypto.createDecipheriv()`](/it/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) sulla lunghezza appropriata.

Per le cifrature in modalità GCM, la funzione [`decipher.setAuthTag()`](/it/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) accetta tag di autenticazione di qualsiasi lunghezza valida (vedere [DEP0090](/it/nodejs/api/deprecations#DEP0090)). Questo comportamento è deprecato per allinearsi meglio alle raccomandazioni per [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0183: API basate sul motore OpenSSL {#dep0183-openssl-engine-based-apis}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | Deprecazione solo nella documentazione. |
:::

Tipo: Solo documentazione

OpenSSL 3 ha deprecato il supporto per i motori personalizzati con una raccomandazione di passare al suo nuovo modello di provider. L'opzione `clientCertEngine` per `https.request()`, [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) e [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener); il `privateKeyEngine` e `privateKeyIdentifier` per [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions); e [`crypto.setEngine()`](/it/nodejs/api/crypto#cryptosetengineengine-flags) dipendono tutti da questa funzionalità di OpenSSL.


### DEP0184: Creazione di istanze delle classi `node:zlib` senza `new` {#dep0184-instantiating-nodezlib-classes-without-new}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.9.0, v20.18.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

La creazione di istanze di classi senza il qualificatore `new` esportato dal modulo `node:zlib` è deprecata. Si consiglia di utilizzare invece il qualificatore `new`. Questo vale per tutte le classi Zlib, come `Deflate`, `DeflateRaw`, `Gunzip`, `Inflate`, `InflateRaw`, `Unzip` e `Zlib`.

### DEP0185: Creazione di istanze delle classi `node:repl` senza `new` {#dep0185-instantiating-noderepl-classes-without-new}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.9.0, v20.18.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

La creazione di istanze di classi senza il qualificatore `new` esportato dal modulo `node:repl` è deprecata. Si consiglia di utilizzare invece il qualificatore `new`. Questo vale per tutte le classi REPL, incluse `REPLServer` e `Recoverable`.

### DEP0187: Passaggio di tipi di argomento non validi a `fs.existsSync` {#dep0187-passing-invalid-argument-types-to-fsexistssync}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.4.0 | Solo documentale. |
:::

Tipo: Solo documentale

Il passaggio di tipi di argomento non supportati è deprecato e, invece di restituire `false`, genererà un errore in una versione futura.

### DEP0188: `process.features.ipv6` e `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.4.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

Queste proprietà sono incondizionatamente `true`. Qualsiasi controllo basato su queste proprietà è ridondante.

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v23.4.0 | Deprecazione solo documentale. |
:::

Tipo: Solo documentale

`process.features.tls_alpn`, `process.features.tls_ocsp` e `process.features.tls_sni` sono deprecati, poiché i loro valori sono garantiti essere identici a quelli di `process.features.tls`.

