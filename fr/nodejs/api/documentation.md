---
title: Documentation Node.js
description: Découvrez la documentation complète de Node.js, couvrant les API, les modules et des exemples d'utilisation pour aider les développeurs à comprendre et utiliser efficacement Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez la documentation complète de Node.js, couvrant les API, les modules et des exemples d'utilisation pour aider les développeurs à comprendre et utiliser efficacement Node.js.
  - - meta
    - name: twitter:title
      content: Documentation Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez la documentation complète de Node.js, couvrant les API, les modules et des exemples d'utilisation pour aider les développeurs à comprendre et utiliser efficacement Node.js.
---


# À propos de cette documentation {#about-this-documentation}

Bienvenue dans la documentation de référence officielle de l'API pour Node.js !

Node.js est un environnement d'exécution JavaScript construit sur le [moteur JavaScript V8](https://v8.dev/).

## Contribution {#contributing}

Signalez les erreurs dans cette documentation dans [l'outil de suivi des problèmes](https://github.com/nodejs/node/issues/new). Consultez [le guide de contribution](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) pour savoir comment soumettre des requêtes d'extraction.

## Indice de stabilité {#stability-index}

Tout au long de la documentation, des indications de la stabilité d'une section sont fournies. Certaines API sont si éprouvées et si fiables qu'il est peu probable qu'elles changent un jour. D'autres sont toutes nouvelles et expérimentales, ou reconnues comme dangereuses.

Les indices de stabilité sont les suivants :

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) Stabilité : 0 - Déprécié. La fonctionnalité peut émettre des avertissements. La compatibilité ascendante n'est pas garantie.
:::

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) Stabilité : 1 - Expérimental. La fonctionnalité n'est pas soumise aux règles de [versionnage sémantique](https://semver.org/). Des changements incompatibles avec les versions antérieures ou une suppression peuvent se produire dans toute version future. L'utilisation de la fonctionnalité n'est pas recommandée dans les environnements de production.
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) Stabilité : 2 - Stable. La compatibilité avec l'écosystème npm est une priorité élevée.
:::

::: info [Stable : 3 - Hérité]
[Stable : 3](/fr/nodejs/api/documentation#stability-index) Stabilité : 3 - Hérité. Bien qu'il soit peu probable que cette fonctionnalité soit supprimée et qu'elle soit toujours couverte par les garanties de versionnage sémantique, elle n'est plus activement maintenue, et d'autres alternatives sont disponibles.
:::

Les fonctionnalités sont marquées comme héritées plutôt que comme dépréciées si leur utilisation ne cause aucun dommage et si elles sont largement utilisées dans l'écosystème npm. Il est peu probable que les bogues trouvés dans les fonctionnalités héritées soient corrigés.

Soyez prudent lorsque vous utilisez des fonctionnalités expérimentales, en particulier lors de la création de bibliothèques. Les utilisateurs peuvent ne pas être conscients de l'utilisation de fonctionnalités expérimentales. Les bogues ou les changements de comportement peuvent surprendre les utilisateurs lorsque des modifications de l'API expérimentale se produisent. Pour éviter les surprises, l'utilisation d'une fonctionnalité expérimentale peut nécessiter un indicateur de ligne de commande. Les fonctionnalités expérimentales peuvent également émettre un [avertissement](/fr/nodejs/api/process#event-warning).


## Aperçu de la stabilité {#stability-overview}

| API | Stabilité |
| --- | --- |
| [Assert](/fr/nodejs/api/assert) |<div class="custom-block tip"> (2) Stable </div>|
| [Hooks Async](/fr/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) Expérimental </div>|
| [Suivi du contexte asynchrone](/fr/nodejs/api/async_context) |<div class="custom-block tip"> (2) Stable </div>|
| [Buffer](/fr/nodejs/api/buffer) |<div class="custom-block tip"> (2) Stable </div>|
| [Processus enfant](/fr/nodejs/api/child_process) |<div class="custom-block tip"> (2) Stable </div>|
| [Cluster](/fr/nodejs/api/cluster) |<div class="custom-block tip"> (2) Stable </div>|
| [Console](/fr/nodejs/api/console) |<div class="custom-block tip"> (2) Stable </div>|
| [Crypto](/fr/nodejs/api/crypto) |<div class="custom-block tip"> (2) Stable </div>|
| [Canal de diagnostics](/fr/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) Stable </div>|
| [DNS](/fr/nodejs/api/dns) |<div class="custom-block tip"> (2) Stable </div>|
| [Domaine](/fr/nodejs/api/domain) |<div class="custom-block danger"> (0) Déprécié </div>|
| [Système de fichiers](/fr/nodejs/api/fs) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTP](/fr/nodejs/api/http) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTP/2](/fr/nodejs/api/http2) |<div class="custom-block tip"> (2) Stable </div>|
| [HTTPS](/fr/nodejs/api/https) |<div class="custom-block tip"> (2) Stable </div>|
| [Inspecteur](/fr/nodejs/api/inspector) |<div class="custom-block tip"> (2) Stable </div>|
| [Modules: API `node:module`](/fr/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - Release candidate (version asynchrone) Stabilité : 1.1 - Développement actif (version synchrone) </div>|
| [Modules : modules CommonJS](/fr/nodejs/api/modules) |<div class="custom-block tip"> (2) Stable </div>|
| [Modules : TypeScript](/fr/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - Développement actif </div>|
| [OS](/fr/nodejs/api/os) |<div class="custom-block tip"> (2) Stable </div>|
| [Path](/fr/nodejs/api/path) |<div class="custom-block tip"> (2) Stable </div>|
| [API de mesure des performances](/fr/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) Stable </div>|
| [Punycode](/fr/nodejs/api/punycode) |<div class="custom-block danger"> (0) Déprécié </div>|
| [Chaîne de requête](/fr/nodejs/api/querystring) |<div class="custom-block tip"> (2) Stable </div>|
| [Readline](/fr/nodejs/api/readline) |<div class="custom-block tip"> (2) Stable </div>|
| [REPL](/fr/nodejs/api/repl) |<div class="custom-block tip"> (2) Stable </div>|
| [Applications exécutables uniques](/fr/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - Développement actif </div>|
| [SQLite](/fr/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - Développement actif. </div>|
| [Stream](/fr/nodejs/api/stream) |<div class="custom-block tip"> (2) Stable </div>|
| [Décodeur de chaîne](/fr/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) Stable </div>|
| [Test runner](/fr/nodejs/api/test) |<div class="custom-block tip"> (2) Stable </div>|
| [Minuteurs](/fr/nodejs/api/timers) |<div class="custom-block tip"> (2) Stable </div>|
| [TLS (SSL)](/fr/nodejs/api/tls) |<div class="custom-block tip"> (2) Stable </div>|
| [Événements de trace](/fr/nodejs/api/tracing) |<div class="custom-block warning"> (1) Expérimental </div>|
| [TTY](/fr/nodejs/api/tty) |<div class="custom-block tip"> (2) Stable </div>|
| [Sockets UDP/datagramme](/fr/nodejs/api/dgram) |<div class="custom-block tip"> (2) Stable </div>|
| [URL](/fr/nodejs/api/url) |<div class="custom-block tip"> (2) Stable </div>|
| [Util](/fr/nodejs/api/util) |<div class="custom-block tip"> (2) Stable </div>|
| [VM (exécution de JavaScript)](/fr/nodejs/api/vm) |<div class="custom-block tip"> (2) Stable </div>|
| [API Web Crypto](/fr/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) Stable </div>|
| [API Web Streams](/fr/nodejs/api/webstreams) |<div class="custom-block tip"> (2) Stable </div>|
| [Interface du système WebAssembly (WASI)](/fr/nodejs/api/wasi) |<div class="custom-block warning"> (1) Expérimental </div>|
| [Threads de Worker](/fr/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) Stable </div>|
| [Zlib](/fr/nodejs/api/zlib) |<div class="custom-block tip"> (2) Stable </div>|


## Sortie JSON {#json-output}

**Ajouté dans: v0.6.12**

Chaque document `.html` a un document `.json` correspondant. Ceci est destiné aux IDE et autres utilitaires qui consomment la documentation.

## Appels système et pages de manuel {#system-calls-and-man-pages}

Les fonctions Node.js qui encapsulent un appel système le documenteront. La documentation renvoie aux pages de manuel correspondantes qui décrivent le fonctionnement de l'appel système.

La plupart des appels système Unix ont des équivalents Windows. Néanmoins, des différences de comportement peuvent être inévitables.

