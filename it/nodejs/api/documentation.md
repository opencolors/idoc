---
title: Documentazione di Node.js
description: Esplora la documentazione completa di Node.js, che copre API, moduli ed esempi di utilizzo per aiutare gli sviluppatori a comprendere e utilizzare efficacemente Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esplora la documentazione completa di Node.js, che copre API, moduli ed esempi di utilizzo per aiutare gli sviluppatori a comprendere e utilizzare efficacemente Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esplora la documentazione completa di Node.js, che copre API, moduli ed esempi di utilizzo per aiutare gli sviluppatori a comprendere e utilizzare efficacemente Node.js.
---


# Informazioni su questa documentazione {#about-this-documentation}

Benvenuti alla documentazione di riferimento ufficiale delle API per Node.js!

Node.js è un runtime JavaScript costruito sul [motore JavaScript V8](https://v8.dev/).

## Contribuire {#contributing}

Segnala gli errori in questa documentazione nel [tracker dei problemi](https://github.com/nodejs/node/issues/new). Consulta [la guida per i contributi](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) per le istruzioni su come inviare pull request.

## Indice di stabilità {#stability-index}

In tutta la documentazione sono presenti indicazioni sulla stabilità di una sezione. Alcune API sono così collaudate e affidabili che è improbabile che cambino mai. Altre sono nuovissime e sperimentali, oppure note per essere pericolose.

Gli indici di stabilità sono i seguenti:

::: danger [Stabile: 0 - Obsoleto]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) Stabilità: 0 - Obsoleto. La funzionalità potrebbe emettere avvisi. La compatibilità con le versioni precedenti non è garantita.
:::

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) Stabilità: 1 - Sperimentale. La funzionalità non è soggetta alle regole di [versionamento semantico](https://semver.org/). Modifiche o rimozioni non retrocompatibili possono verificarsi in qualsiasi versione futura. L'uso della funzionalità non è raccomandato in ambienti di produzione.
:::

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) Stabilità: 2 - Stabile. La compatibilità con l'ecosistema npm è una priorità alta.
:::

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) Stabilità: 3 - Legacy. Sebbene sia improbabile che questa funzionalità venga rimossa e sia comunque coperta dalle garanzie di versionamento semantico, non è più attivamente mantenuta e sono disponibili altre alternative.
:::

Le funzionalità sono contrassegnate come legacy piuttosto che come obsolete se il loro utilizzo non causa danni e sono ampiamente utilizzate all'interno dell'ecosistema npm. È improbabile che i bug trovati nelle funzionalità legacy vengano corretti.

Prestare attenzione quando si utilizzano funzionalità sperimentali, in particolare quando si creano librerie. Gli utenti potrebbero non essere consapevoli che vengono utilizzate funzionalità sperimentali. Bug o modifiche al comportamento possono sorprendere gli utenti quando si verificano modifiche alle API sperimentali. Per evitare sorprese, l'uso di una funzionalità sperimentale potrebbe richiedere un flag da riga di comando. Le funzionalità sperimentali possono anche emettere un [avviso](/it/nodejs/api/process#event-warning).


## Panoramica sulla stabilità {#stability-overview}

| API | Stabilità |
| --- | --- |
| [Assert](/it/nodejs/api/assert) |<div class="custom-block tip"> (2) Stabile </div>|
| [Hook asincroni](/it/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) Sperimentale </div>|
| [Tracciamento del contesto asincrono](/it/nodejs/api/async_context) |<div class="custom-block tip"> (2) Stabile </div>|
| [Buffer](/it/nodejs/api/buffer) |<div class="custom-block tip"> (2) Stabile </div>|
| [Processo figlio](/it/nodejs/api/child_process) |<div class="custom-block tip"> (2) Stabile </div>|
| [Cluster](/it/nodejs/api/cluster) |<div class="custom-block tip"> (2) Stabile </div>|
| [Console](/it/nodejs/api/console) |<div class="custom-block tip"> (2) Stabile </div>|
| [Crypto](/it/nodejs/api/crypto) |<div class="custom-block tip"> (2) Stabile </div>|
| [Canale di diagnostica](/it/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) Stabile </div>|
| [DNS](/it/nodejs/api/dns) |<div class="custom-block tip"> (2) Stabile </div>|
| [Domain](/it/nodejs/api/domain) |<div class="custom-block danger"> (0) Obsoleto </div>|
| [File system](/it/nodejs/api/fs) |<div class="custom-block tip"> (2) Stabile </div>|
| [HTTP](/it/nodejs/api/http) |<div class="custom-block tip"> (2) Stabile </div>|
| [HTTP/2](/it/nodejs/api/http2) |<div class="custom-block tip"> (2) Stabile </div>|
| [HTTPS](/it/nodejs/api/https) |<div class="custom-block tip"> (2) Stabile </div>|
| [Inspector](/it/nodejs/api/inspector) |<div class="custom-block tip"> (2) Stabile </div>|
| [Moduli: API `node:module`](/it/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - Release candidate (versione asincrona) Stabilità: 1.1 - Sviluppo attivo (versione sincrona) </div>|
| [Moduli: moduli CommonJS](/it/nodejs/api/modules) |<div class="custom-block tip"> (2) Stabile </div>|
| [Moduli: TypeScript](/it/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - Sviluppo attivo </div>|
| [OS](/it/nodejs/api/os) |<div class="custom-block tip"> (2) Stabile </div>|
| [Path](/it/nodejs/api/path) |<div class="custom-block tip"> (2) Stabile </div>|
| [API di misurazione delle prestazioni](/it/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) Stabile </div>|
| [Punycode](/it/nodejs/api/punycode) |<div class="custom-block danger"> (0) Obsoleto </div>|
| [Stringa di query](/it/nodejs/api/querystring) |<div class="custom-block tip"> (2) Stabile </div>|
| [Readline](/it/nodejs/api/readline) |<div class="custom-block tip"> (2) Stabile </div>|
| [REPL](/it/nodejs/api/repl) |<div class="custom-block tip"> (2) Stabile </div>|
| [Applicazioni eseguibili singole](/it/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - Sviluppo attivo </div>|
| [SQLite](/it/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - Sviluppo attivo. </div>|
| [Stream](/it/nodejs/api/stream) |<div class="custom-block tip"> (2) Stabile </div>|
| [String decoder](/it/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) Stabile </div>|
| [Test runner](/it/nodejs/api/test) |<div class="custom-block tip"> (2) Stabile </div>|
| [Timers](/it/nodejs/api/timers) |<div class="custom-block tip"> (2) Stabile </div>|
| [TLS (SSL)](/it/nodejs/api/tls) |<div class="custom-block tip"> (2) Stabile </div>|
| [Eventi di traccia](/it/nodejs/api/tracing) |<div class="custom-block warning"> (1) Sperimentale </div>|
| [TTY](/it/nodejs/api/tty) |<div class="custom-block tip"> (2) Stabile </div>|
| [Socket UDP/datagram](/it/nodejs/api/dgram) |<div class="custom-block tip"> (2) Stabile </div>|
| [URL](/it/nodejs/api/url) |<div class="custom-block tip"> (2) Stabile </div>|
| [Util](/it/nodejs/api/util) |<div class="custom-block tip"> (2) Stabile </div>|
| [VM (esecuzione di JavaScript)](/it/nodejs/api/vm) |<div class="custom-block tip"> (2) Stabile </div>|
| [Web Crypto API](/it/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) Stabile </div>|
| [Web Streams API](/it/nodejs/api/webstreams) |<div class="custom-block tip"> (2) Stabile </div>|
| [Interfaccia di sistema WebAssembly (WASI)](/it/nodejs/api/wasi) |<div class="custom-block warning"> (1) Sperimentale </div>|
| [Thread di Worker](/it/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) Stabile </div>|
| [Zlib](/it/nodejs/api/zlib) |<div class="custom-block tip"> (2) Stabile </div>|


## Output JSON {#json-output}

**Aggiunto in: v0.6.12**

Ogni documento `.html` ha un corrispondente documento `.json`. Questo è per IDE e altre utilità che consumano la documentazione.

## Chiamate di sistema e pagine man {#system-calls-and-man-pages}

Le funzioni di Node.js che avvolgono una chiamata di sistema lo documenteranno. La documentazione rimanda alle corrispondenti pagine man che descrivono come funziona la chiamata di sistema.

La maggior parte delle chiamate di sistema Unix hanno analoghi in Windows. Tuttavia, differenze di comportamento possono essere inevitabili.

