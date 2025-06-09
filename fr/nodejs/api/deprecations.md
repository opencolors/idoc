---
title: Dépréciations de Node.js
description: Cette page documente les fonctionnalités obsolètes dans Node.js, offrant des conseils sur la mise à jour du code pour éviter l'utilisation d'API et de pratiques dépassées.
head:
  - - meta
    - name: og:title
      content: Dépréciations de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette page documente les fonctionnalités obsolètes dans Node.js, offrant des conseils sur la mise à jour du code pour éviter l'utilisation d'API et de pratiques dépassées.
  - - meta
    - name: twitter:title
      content: Dépréciations de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette page documente les fonctionnalités obsolètes dans Node.js, offrant des conseils sur la mise à jour du code pour éviter l'utilisation d'API et de pratiques dépassées.
---


# API Dépréciées {#deprecated-apis}

Les API Node.js peuvent être dépréciées pour l'une des raisons suivantes :

- L'utilisation de l'API est dangereuse.
- Une API alternative améliorée est disponible.
- Des modifications majeures de l'API sont attendues dans une future version majeure.

Node.js utilise quatre types de dépréciations :

- Documentation uniquement
- Application (code non-`node_modules` uniquement)
- Exécution (tout le code)
- Fin de vie

Une dépréciation de documentation uniquement est une dépréciation exprimée uniquement dans la documentation de l'API Node.js. Elles ne génèrent aucun effet secondaire lors de l'exécution de Node.js. Certaines dépréciations de documentation uniquement déclenchent un avertissement d'exécution lorsqu'elles sont lancées avec l'indicateur [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation) (ou son alternative, la variable d'environnement `NODE_PENDING_DEPRECATION=1`), de la même manière que les dépréciations d'exécution ci-dessous. Les dépréciations de documentation uniquement qui prennent en charge cet indicateur sont explicitement étiquetées comme telles dans la [liste des API dépréciées](/fr/nodejs/api/deprecations#list-of-deprecated-apis).

Une dépréciation d'application pour le code non-`node_modules` uniquement générera, par défaut, un avertissement de processus qui sera affiché sur `stderr` la première fois que l'API dépréciée est utilisée dans du code qui n'est pas chargé depuis `node_modules`. Lorsque l'indicateur de ligne de commande [`--throw-deprecation`](/fr/nodejs/api/cli#--throw-deprecation) est utilisé, une dépréciation d'exécution provoquera le lancement d'une erreur. Lorsque [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation) est utilisé, des avertissements seront également émis pour le code chargé depuis `node_modules`.

Une dépréciation d'exécution pour tout le code est similaire à la dépréciation d'exécution pour le code non-`node_modules`, sauf qu'elle émet également un avertissement pour le code chargé depuis `node_modules`.

Une dépréciation de fin de vie est utilisée lorsque la fonctionnalité est ou sera bientôt supprimée de Node.js.

## Révocation des dépréciations {#revoking-deprecations}

Occasionnellement, la dépréciation d'une API peut être annulée. Dans de telles situations, ce document sera mis à jour avec des informations pertinentes à la décision. Cependant, l'identifiant de dépréciation ne sera pas modifié.

## Liste des API dépréciées {#list-of-deprecated-apis}

### DEP0001 : `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v1.6.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

`OutgoingMessage.prototype.flush()` a été supprimé. Utilisez `OutgoingMessage.prototype.flushHeaders()` à la place.


### DEP0002 : `require('_linklist')` {#dep0002-require_linklist}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Fin de vie. |
| v6.12.0 | Un code d’obsolescence a été attribué. |
| v5.0.0 | Obsolescence d’exécution. |
:::

Type : Fin de vie

Le module `_linklist` est obsolète. Veuillez utiliser une alternative userland.

### DEP0003 : `_writableState.buffer` {#dep0003-_writablestatebuffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code d’obsolescence a été attribué. |
| v0.11.15 | Obsolescence d’exécution. |
:::

Type : Fin de vie

`_writableState.buffer` a été supprimé. Utilisez `_writableState.getBuffer()` à la place.

### DEP0004 : `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code d’obsolescence a été attribué. |
| v0.4.0 | Obsolescence de la documentation uniquement. |
:::

Type : Fin de vie

La propriété `CryptoStream.prototype.readyState` a été supprimée.

### DEP0005 : Constructeur `Buffer()` {#dep0005-buffer-constructor}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Obsolescence d’exécution. |
| v6.12.0 | Un code d’obsolescence a été attribué. |
| v6.0.0 | Obsolescence de la documentation uniquement. |
:::

Type : Application (code non-`node_modules` uniquement)

La fonction `Buffer()` et le constructeur `new Buffer()` sont obsolètes en raison de problèmes d’utilisabilité de l’API qui peuvent entraîner des problèmes de sécurité accidentels.

Comme alternative, utilisez l’une des méthodes suivantes de construction d’objets `Buffer` :

- [`Buffer.alloc(size[, fill[, encoding]])`](/fr/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) : Créer un `Buffer` avec de la mémoire *initialisée*.
- [`Buffer.allocUnsafe(size)`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) : Créer un `Buffer` avec de la mémoire *non initialisée*.
- [`Buffer.allocUnsafeSlow(size)`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) : Créer un `Buffer` avec de la mémoire *non initialisée*.
- [`Buffer.from(array)`](/fr/nodejs/api/buffer#static-method-bufferfromarray) : Créer un `Buffer` avec une copie de `array`
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/fr/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - Créer un `Buffer` qui encapsule le `arrayBuffer` donné.
- [`Buffer.from(buffer)`](/fr/nodejs/api/buffer#static-method-bufferfrombuffer) : Créer un `Buffer` qui copie `buffer`.
- [`Buffer.from(string[, encoding])`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding) : Créer un `Buffer` qui copie `string`.

Sans `--pending-deprecation`, les avertissements d’exécution ne se produisent que pour le code qui n’est pas dans `node_modules`. Cela signifie qu’il n’y aura pas d’avertissements d’obsolescence pour l’utilisation de `Buffer()` dans les dépendances. Avec `--pending-deprecation`, un avertissement d’exécution en résulte, peu importe où l’utilisation de `Buffer()` se produit.


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v0.11.14 | Dépréciation à l'exécution. |
| v0.5.10 | Dépréciation de la documentation uniquement. |
:::

Type: Fin de vie

Dans les méthodes `spawn()`, `fork()` et `exec()` du module [`child_process`](/fr/nodejs/api/child_process), l'option `options.customFds` est obsolète. L'option `options.stdio` doit être utilisée à la place.

### DEP0007: Remplacer `cluster` `worker.suicide` par `worker.exitedAfterDisconnect` {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Fin de vie. |
| v7.0.0 | Dépréciation à l'exécution. |
| v6.12.0 | Un code de dépréciation a été attribué. |
| v6.0.0 | Dépréciation de la documentation uniquement. |
:::

Type: Fin de vie

Dans une version antérieure du `cluster` Node.js, une propriété booléenne nommée `suicide` a été ajoutée à l'objet `Worker`. L'intention de cette propriété était de fournir une indication de la façon dont l'instance `Worker` s'est terminée et pourquoi. Dans Node.js 6.0.0, l'ancienne propriété a été dépréciée et remplacée par une nouvelle propriété [`worker.exitedAfterDisconnect`](/fr/nodejs/api/cluster#workerexitedafterdisconnect). L'ancien nom de propriété ne décrivait pas précisément la sémantique réelle et était inutilement chargé d'émotion.

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0 | Un code de dépréciation a été attribué. |
| v6.3.0 | Dépréciation de la documentation uniquement. |
:::

Type: Documentation uniquement

Le module `node:constants` est déprécié. Lors de la demande d'accès à des constantes pertinentes pour des modules intégrés Node.js spécifiques, les développeurs doivent plutôt se référer à la propriété `constants` exposée par le module concerné. Par exemple, `require('node:fs').constants` et `require('node:os').constants`.

### DEP0009: `crypto.pbkdf2` sans digest {#dep0009-cryptopbkdf2-without-digest}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Fin de vie (pour `digest === null`). |
| v11.0.0 | Dépréciation à l'exécution (pour `digest === null`). |
| v8.0.0 | Fin de vie (pour `digest === undefined`). |
| v6.12.0 | Un code de dépréciation a été attribué. |
| v6.0.0 | Dépréciation à l'exécution (pour `digest === undefined`). |
:::

Type: Fin de vie

L'utilisation de l'API [`crypto.pbkdf2()`](/fr/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) sans spécifier de digest a été dépréciée dans Node.js 6.0 car la méthode utilisait par défaut le digest `'SHA1'` non recommandé. Auparavant, un avertissement de dépréciation était imprimé. À partir de Node.js 8.0.0, appeler `crypto.pbkdf2()` ou `crypto.pbkdf2Sync()` avec `digest` défini sur `undefined` lèvera une `TypeError`.

À partir de Node.js v11.0.0, appeler ces fonctions avec `digest` défini sur `null` imprimerait un avertissement de dépréciation pour s'aligner sur le comportement lorsque `digest` est `undefined`.

Maintenant, cependant, passer `undefined` ou `null` lèvera une `TypeError`.


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code d'obsolescence a été attribué. |
| v0.11.13 | Obsolescence d'exécution. |
:::

Type : Fin de vie

L’API `crypto.createCredentials()` a été supprimée. Veuillez utiliser [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) à la place.

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code d'obsolescence a été attribué. |
| v0.11.13 | Obsolescence d'exécution. |
:::

Type : Fin de vie

La classe `crypto.Credentials` a été supprimée. Veuillez utiliser [`tls.SecureContext`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) à la place.

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code d'obsolescence a été attribué. |
| v0.11.7 | Obsolescence d'exécution. |
:::

Type : Fin de vie

`Domain.dispose()` a été supprimé. Récupérez les actions d'E/S ayant échoué explicitement via les gestionnaires d'événements d'erreur définis sur le domaine.

### DEP0013: Fonction asynchrone `fs` sans rappel {#dep0013-fs-asynchronous-function-without-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v7.0.0 | Obsolescence d'exécution. |
:::

Type : Fin de vie

L'appel d'une fonction asynchrone sans rappel lève une `TypeError` dans Node.js 10.0.0 et versions ultérieures. Voir [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562).

### DEP0014: Ancienne interface String `fs.read` {#dep0014-fsread-legacy-string-interface}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Fin de vie. |
| v6.0.0 | Obsolescence d'exécution. |
| v6.12.0, v4.8.6 | Un code d'obsolescence a été attribué. |
| v0.1.96 | Obsolescence de la documentation uniquement. |
:::

Type : Fin de vie

L'ancienne interface `String` de [`fs.read()`](/fr/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) est obsolète. Utilisez l'API `Buffer` comme indiqué dans la documentation à la place.

### DEP0015: Ancienne interface String `fs.readSync` {#dep0015-fsreadsync-legacy-string-interface}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Fin de vie. |
| v6.0.0 | Obsolescence d'exécution. |
| v6.12.0, v4.8.6 | Un code d'obsolescence a été attribué. |
| v0.1.96 | Obsolescence de la documentation uniquement. |
:::

Type : Fin de vie

L'ancienne interface `String` de [`fs.readSync()`](/fr/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) est obsolète. Utilisez l'API `Buffer` comme indiqué dans la documentation à la place.


### DEP0016 : `GLOBAL`/`root` {#dep0016-global/root}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Fin de vie. |
| v6.12.0 | Un code d’obsolescence a été attribué. |
| v6.0.0 | Obsolescence d’exécution. |
:::

Type : Fin de vie

Les alias `GLOBAL` et `root` pour la propriété `global` ont été déclarés obsolètes dans Node.js 6.0.0 et ont depuis été supprimés.

### DEP0017 : `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Fin de vie. |
| v7.0.0 | Obsolescence d’exécution. |
:::

Type : Fin de vie

`Intl.v8BreakIterator` était une extension non standard et a été supprimée. Voir [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter).

### DEP0018 : Rejets de promesses non gérés {#dep0018-unhandled-promise-rejections}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Fin de vie. |
| v7.0.0 | Obsolescence d’exécution. |
:::

Type : Fin de vie

Les rejets de promesses non gérés sont obsolètes. Par défaut, les rejets de promesses qui ne sont pas gérés mettent fin au processus Node.js avec un code de sortie différent de zéro. Pour modifier la façon dont Node.js traite les rejets non gérés, utilisez l’option de ligne de commande [`--unhandled-rejections`](/fr/nodejs/api/cli#--unhandled-rejectionsmode).

### DEP0019 : `require('.')` résolu en dehors du répertoire {#dep0019-require-resolved-outside-directory}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fonctionnalité supprimée. |
| v6.12.0, v4.8.6 | Un code d’obsolescence a été attribué. |
| v1.8.1 | Obsolescence d’exécution. |
:::

Type : Fin de vie

Dans certains cas, `require('.')` pouvait être résolu en dehors du répertoire du package. Ce comportement a été supprimé.

### DEP0020 : `Server.connections` {#dep0020-serverconnections}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Server.connections a été supprimé. |
| v6.12.0, v4.8.6 | Un code d’obsolescence a été attribué. |
| v0.9.7 | Obsolescence d’exécution. |
:::

Type : Fin de vie

La propriété `Server.connections` a été déclarée obsolète dans Node.js v0.9.7 et a été supprimée. Veuillez utiliser la méthode [`Server.getConnections()`](/fr/nodejs/api/net#servergetconnectionscallback) à la place.

### DEP0021 : `Server.listenFD` {#dep0021-serverlistenfd}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code d’obsolescence a été attribué. |
| v0.7.12 | Obsolescence d’exécution. |
:::

Type : Fin de vie

La méthode `Server.listenFD()` a été déclarée obsolète et supprimée. Veuillez utiliser [`Server.listen({fd: \<number\>})`](/fr/nodejs/api/net#serverlistenhandle-backlog-callback) à la place.


### DEP0022 : `os.tmpDir()` {#dep0022-ostmpdir}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Fin de vie. |
| v7.0.0 | Dépréciation à l’exécution. |
:::

Type : Fin de vie

L’API `os.tmpDir()` a été dépréciée dans Node.js 7.0.0 et a été supprimée depuis. Veuillez utiliser [`os.tmpdir()`](/fr/nodejs/api/os#ostmpdir) à la place.

### DEP0023 : `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v0.6.0 | Dépréciation à l’exécution. |
:::

Type : Fin de vie

La méthode `os.getNetworkInterfaces()` est dépréciée. Veuillez utiliser la méthode [`os.networkInterfaces()`](/fr/nodejs/api/os#osnetworkinterfaces) à la place.

### DEP0024 : `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Fin de vie. |
| v7.0.0 | Dépréciation à l’exécution. |
:::

Type : Fin de vie

L’API `REPLServer.prototype.convertToContext()` a été supprimée.

### DEP0025 : `require('node:sys')` {#dep0025-requirenodesys}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v1.0.0 | Dépréciation à l’exécution. |
:::

Type : Exécution

Le module `node:sys` est déprécié. Veuillez utiliser le module [`util`](/fr/nodejs/api/util) à la place.

### DEP0026 : `util.print()` {#dep0026-utilprint}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v0.11.3 | Dépréciation à l’exécution. |
:::

Type : Fin de vie

`util.print()` a été supprimé. Veuillez utiliser [`console.log()`](/fr/nodejs/api/console#consolelogdata-args) à la place.

### DEP0027 : `util.puts()` {#dep0027-utilputs}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v0.11.3 | Dépréciation à l’exécution. |
:::

Type : Fin de vie

`util.puts()` a été supprimé. Veuillez utiliser [`console.log()`](/fr/nodejs/api/console#consolelogdata-args) à la place.

### DEP0028 : `util.debug()` {#dep0028-utildebug}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v0.11.3 | Dépréciation à l’exécution. |
:::

Type : Fin de vie

`util.debug()` a été supprimé. Veuillez utiliser [`console.error()`](/fr/nodejs/api/console#consoleerrordata-args) à la place.


### DEP0029: `util.error()` {#dep0029-utilerror}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v0.11.3 | Dépréciation d'exécution. |
:::

Type : Fin de vie

`util.error()` a été supprimé. Veuillez utiliser [`console.error()`](/fr/nodejs/api/console#consoleerrordata-args) à la place.

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0 | Un code de dépréciation a été attribué. |
| v6.0.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Uniquement dans la documentation

La classe [`SlowBuffer`](/fr/nodejs/api/buffer#class-slowbuffer) est dépréciée. Veuillez utiliser [`Buffer.allocUnsafeSlow(size)`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) à la place.

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0 | Un code de dépréciation a été attribué. |
| v5.2.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Uniquement dans la documentation

La méthode [`ecdh.setPublicKey()`](/fr/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding) est maintenant dépréciée car son inclusion dans l'API n'est pas utile.

### DEP0032: Module `node:domain` {#dep0032-nodedomain-module}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v1.4.2 | Dépréciation uniquement dans la documentation. |
:::

Type : Uniquement dans la documentation

Le module [`domain`](/fr/nodejs/api/domain) est déprécié et ne doit pas être utilisé.

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v3.2.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Uniquement dans la documentation

L'API [`events.listenerCount(emitter, eventName)`](/fr/nodejs/api/events#eventslistenercountemitter-eventname) est dépréciée. Veuillez utiliser [`emitter.listenerCount(eventName)`](/fr/nodejs/api/events#emitterlistenercounteventname-listener) à la place.

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v1.0.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Uniquement dans la documentation

L'API [`fs.exists(path, callback)`](/fr/nodejs/api/fs#fsexistspath-callback) est dépréciée. Veuillez utiliser [`fs.stat()`](/fr/nodejs/api/fs#fsstatpath-options-callback) ou [`fs.access()`](/fr/nodejs/api/fs#fsaccesspath-mode-callback) à la place.


### DEP0035 : `fs.lchmod(path, mode, callback)` {#dep0035-fslchmodpath-mode-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0, v4.8.6 | Un code de dépréciation a été assigné. |
| v0.4.7 | Dépréciation limitée à la documentation. |
:::

Type : Limité à la documentation

L’API [`fs.lchmod(path, mode, callback)`](/fr/nodejs/api/fs#fslchmodpath-mode-callback) est obsolète.

### DEP0036 : `fs.lchmodSync(path, mode)` {#dep0036-fslchmodsyncpath-mode}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0, v4.8.6 | Un code de dépréciation a été assigné. |
| v0.4.7 | Dépréciation limitée à la documentation. |
:::

Type : Limité à la documentation

L’API [`fs.lchmodSync(path, mode)`](/fr/nodejs/api/fs#fslchmodsyncpath-mode) est obsolète.

### DEP0037 : `fs.lchown(path, uid, gid, callback)` {#dep0037-fslchownpath-uid-gid-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.6.0 | Dépréciation révoquée. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été assigné. |
| v0.4.7 | Dépréciation limitée à la documentation. |
:::

Type : Dépréciation révoquée

L’API [`fs.lchown(path, uid, gid, callback)`](/fr/nodejs/api/fs#fslchownpath-uid-gid-callback) était obsolète. La dépréciation a été révoquée car les API de support requises ont été ajoutées dans libuv.

### DEP0038 : `fs.lchownSync(path, uid, gid)` {#dep0038-fslchownsyncpath-uid-gid}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.6.0 | Dépréciation révoquée. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été assigné. |
| v0.4.7 | Dépréciation limitée à la documentation. |
:::

Type : Dépréciation révoquée

L’API [`fs.lchownSync(path, uid, gid)`](/fr/nodejs/api/fs#fslchownsyncpath-uid-gid) était obsolète. La dépréciation a été révoquée car les API de support requises ont été ajoutées dans libuv.

### DEP0039 : `require.extensions` {#dep0039-requireextensions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.12.0, v4.8.6 | Un code de dépréciation a été assigné. |
| v0.10.6 | Dépréciation limitée à la documentation. |
:::

Type : Limité à la documentation

La propriété [`require.extensions`](/fr/nodejs/api/modules#requireextensions) est obsolète.

### DEP0040 : module `node:punycode` {#dep0040-nodepunycode-module}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Dépréciation d’exécution. |
| v16.6.0 | Ajout de la prise en charge de `--pending-deprecation`. |
| v7.0.0 | Dépréciation limitée à la documentation. |
:::

Type : Exécution

Le module [`punycode`](/fr/nodejs/api/punycode) est obsolète. Veuillez utiliser une alternative userland à la place.


### DEP0041 : variable d’environnement `NODE_REPL_HISTORY_FILE` {#dep0041-node_repl_history_file-environment-variable}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v3.0.0 | Dépréciation limitée à la documentation. |
:::

Type : Fin de vie

La variable d’environnement `NODE_REPL_HISTORY_FILE` a été supprimée. Veuillez utiliser `NODE_REPL_HISTORY` à la place.

### DEP0042 : `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v0.11.3 | Dépréciation limitée à la documentation. |
:::

Type : Fin de vie

La classe [`tls.CryptoStream`](/fr/nodejs/api/tls#class-tlscryptostream) a été supprimée. Veuillez utiliser [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket) à la place.

### DEP0043 : `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Dépréciation d’exécution. |
| v6.12.0 | Un code de dépréciation a été attribué. |
| v6.0.0 | Dépréciation limitée à la documentation. |
| v0.11.15 | Dépréciation révoquée. |
| v0.11.3 | Dépréciation d’exécution. |
:::

Type : Documentation uniquement

La classe [`tls.SecurePair`](/fr/nodejs/api/tls#class-tlssecurepair) est obsolète. Veuillez utiliser [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket) à la place.

### DEP0044 : `util.isArray()` {#dep0044-utilisarray}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | Dépréciation d’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation limitée à la documentation. |
:::

Type : Exécution

L’API [`util.isArray()`](/fr/nodejs/api/util#utilisarrayobject) est obsolète. Veuillez utiliser `Array.isArray()` à la place.

### DEP0045 : `util.isBoolean()` {#dep0045-utilisboolean}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation d’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation limitée à la documentation. |
:::

Type : Fin de vie

L’API `util.isBoolean()` a été supprimée. Veuillez utiliser `typeof arg === 'boolean'` à la place.

### DEP0046 : `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation d’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation limitée à la documentation. |
:::

Type : Fin de vie

L’API `util.isBuffer()` a été supprimée. Veuillez utiliser [`Buffer.isBuffer()`](/fr/nodejs/api/buffer#static-method-bufferisbufferobj) à la place.


### DEP0047 : `util.isDate()` {#dep0047-utilisdate}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation en fin de vie. |
| v22.0.0 | Dépréciation d'exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation de documentation uniquement. |
:::

Type : Fin de vie

L'API `util.isDate()` a été supprimée. Veuillez plutôt utiliser `arg instanceof Date`.

### DEP0048 : `util.isError()` {#dep0048-utiliserror}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation en fin de vie. |
| v22.0.0 | Dépréciation d'exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation de documentation uniquement. |
:::

Type : Fin de vie

L'API `util.isError()` a été supprimée. Veuillez plutôt utiliser `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error`.

### DEP0049 : `util.isFunction()` {#dep0049-utilisfunction}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation en fin de vie. |
| v22.0.0 | Dépréciation d'exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation de documentation uniquement. |
:::

Type : Fin de vie

L'API `util.isFunction()` a été supprimée. Veuillez plutôt utiliser `typeof arg === 'function'`.

### DEP0050 : `util.isNull()` {#dep0050-utilisnull}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation en fin de vie. |
| v22.0.0 | Dépréciation d'exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation de documentation uniquement. |
:::

Type : Fin de vie

L'API `util.isNull()` a été supprimée. Veuillez plutôt utiliser `arg === null`.

### DEP0051 : `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation en fin de vie. |
| v22.0.0 | Dépréciation d'exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation de documentation uniquement. |
:::

Type : Fin de vie

L'API `util.isNullOrUndefined()` a été supprimée. Veuillez plutôt utiliser `arg === null || arg === undefined`.


### DEP0052 : `util.isNumber()` {#dep0052-utilisnumber}

::: info [Historique]
| Version | Modifications |
|---|---|
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation à l’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation réservée à la documentation. |
:::

Type : Fin de vie

L’API `util.isNumber()` a été supprimée. Veuillez utiliser `typeof arg === 'number'` à la place.

### DEP0053 : `util.isObject()` {#dep0053-utilisobject}

::: info [Historique]
| Version | Modifications |
|---|---|
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation à l’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation réservée à la documentation. |
:::

Type : Fin de vie

L’API `util.isObject()` a été supprimée. Veuillez utiliser `arg && typeof arg === 'object'` à la place.

### DEP0054 : `util.isPrimitive()` {#dep0054-utilisprimitive}

::: info [Historique]
| Version | Modifications |
|---|---|
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation à l’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation réservée à la documentation. |
:::

Type : Fin de vie

L’API `util.isPrimitive()` a été supprimée. Veuillez utiliser `arg === null || (typeof arg !=='object' && typeof arg !== 'function')` à la place.

### DEP0055 : `util.isRegExp()` {#dep0055-utilisregexp}

::: info [Historique]
| Version | Modifications |
|---|---|
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation à l’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation réservée à la documentation. |
:::

Type : Fin de vie

L’API `util.isRegExp()` a été supprimée. Veuillez utiliser `arg instanceof RegExp` à la place.

### DEP0056 : `util.isString()` {#dep0056-utilisstring}

::: info [Historique]
| Version | Modifications |
|---|---|
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation à l’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation réservée à la documentation. |
:::

Type : Fin de vie

L’API `util.isString()` a été supprimée. Veuillez utiliser `typeof arg === 'string'` à la place.


### DEP0057 : `util.isSymbol()` {#dep0057-utilissymbol}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation d’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation uniquement dans la documentation. |
:::

Type : Fin de vie

L’API `util.isSymbol()` a été supprimée. Veuillez utiliser `typeof arg === 'symbol'` à la place.

### DEP0058 : `util.isUndefined()` {#dep0058-utilisundefined}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation d’exécution. |
| v6.12.0, v4.8.6 | Un code de dépréciation a été attribué. |
| v4.0.0, v3.3.1 | Dépréciation uniquement dans la documentation. |
:::

Type : Fin de vie

L’API `util.isUndefined()` a été supprimée. Veuillez utiliser `arg === undefined` à la place.

### DEP0059 : `util.log()` {#dep0059-utillog}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation de fin de vie. |
| v22.0.0 | Dépréciation d’exécution. |
| v6.12.0 | Un code de dépréciation a été attribué. |
| v6.0.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Fin de vie

L’API `util.log()` a été supprimée, car il s’agit d’une API héritée non maintenue qui a été exposée par accident au domaine utilisateur. Au lieu de cela, considérez les alternatives suivantes en fonction de vos besoins spécifiques :

-  **Bibliothèques de journalisation tierces**
-  **Utiliser <code>console.log(new Date().toLocaleString(), message)</code>**

En adoptant l’une de ces alternatives, vous pouvez abandonner `util.log()` et choisir une stratégie de journalisation qui correspond aux exigences et à la complexité spécifiques de votre application.

### DEP0060 : `util._extend()` {#dep0060-util_extend}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | Dépréciation d’exécution. |
| v6.12.0 | Un code de dépréciation a été attribué. |
| v6.0.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Exécution

L’API [`util._extend()`](/fr/nodejs/api/util#util_extendtarget-source) est dépréciée, car il s’agit d’une API héritée non maintenue qui a été exposée par accident au domaine utilisateur. Veuillez utiliser `target = Object.assign(target, source)` à la place.


### DEP0061 : `fs.SyncWriteStream` {#dep0061-fssyncwritestream}

::: info [Historique]
| Version | Modifications |
|---|---|
| v11.0.0 | Fin de vie. |
| v8.0.0 | Obsolescence d’exécution. |
| v7.0.0 | Obsolescence de la documentation uniquement. |
:::

Type : Fin de vie

La classe `fs.SyncWriteStream` n’a jamais été conçue comme une API accessible au public et a été supprimée. Aucune API alternative n’est disponible. Veuillez utiliser une alternative en espace utilisateur.

### DEP0062 : `node --debug` {#dep0062-node---debug}

::: info [Historique]
| Version | Modifications |
|---|---|
| v12.0.0 | Fin de vie. |
| v8.0.0 | Obsolescence d’exécution. |
:::

Type : Fin de vie

`--debug` active l’interface de débogueur V8 héritée, qui a été supprimée à partir de V8 5.8. Elle est remplacée par l’inspecteur qui est activé avec `--inspect` à la place.

### DEP0063 : `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}

::: info [Historique]
| Version | Modifications |
|---|---|
| v8.0.0 | Obsolescence de la documentation uniquement. |
:::

Type : Documentation uniquement

L’API `ServerResponse.prototype.writeHeader()` du module `node:http` est obsolète. Veuillez utiliser `ServerResponse.prototype.writeHead()` à la place.

La méthode `ServerResponse.prototype.writeHeader()` n’a jamais été documentée comme une API officiellement prise en charge.

### DEP0064 : `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}

::: info [Historique]
| Version | Modifications |
|---|---|
| v8.0.0 | Obsolescence d’exécution. |
| v6.12.0 | Un code d’obsolescence a été attribué. |
| v6.0.0 | Obsolescence de la documentation uniquement. |
| v0.11.15 | Obsolescence révoquée. |
| v0.11.3 | Obsolescence d’exécution. |
:::

Type : Exécution

L’API `tls.createSecurePair()` a été déclarée obsolète dans la documentation dans Node.js 0.11.3. Les utilisateurs doivent utiliser `tls.Socket` à la place.

### DEP0065 : `repl.REPL_MODE_MAGIC` et `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}

::: info [Historique]
| Version | Modifications |
|---|---|
| v10.0.0 | Fin de vie. |
| v8.0.0 | Obsolescence de la documentation uniquement. |
:::

Type : Fin de vie

La constante `REPL_MODE_MAGIC` du module `node:repl`, utilisée pour l’option `replMode`, a été supprimée. Son comportement est fonctionnellement identique à celui de `REPL_MODE_SLOPPY` depuis Node.js 6.0.0, lorsque V8 5.0 a été importé. Veuillez utiliser `REPL_MODE_SLOPPY` à la place.

La variable d’environnement `NODE_REPL_MODE` est utilisée pour définir le `replMode` sous-jacent d’une session `node` interactive. Sa valeur, `magic`, est également supprimée. Veuillez utiliser `sloppy` à la place.


### DEP0066 : `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Dépréciation d’exécution. |
| v8.0.0 | Dépréciation de documentation seulement. |
:::

Type : Exécution

Les propriétés `OutgoingMessage.prototype._headers` et `OutgoingMessage.prototype._headerNames` du module `node:http` sont obsolètes. Utilisez l’une des méthodes publiques (par exemple, `OutgoingMessage.prototype.getHeader()`, `OutgoingMessage.prototype.getHeaders()`, `OutgoingMessage.prototype.getHeaderNames()`, `OutgoingMessage.prototype.getRawHeaderNames()`, `OutgoingMessage.prototype.hasHeader()`, `OutgoingMessage.prototype.removeHeader()`, `OutgoingMessage.prototype.setHeader()`) pour travailler avec les en-têtes sortants.

Les propriétés `OutgoingMessage.prototype._headers` et `OutgoingMessage.prototype._headerNames` n’ont jamais été documentées comme des propriétés officiellement prises en charge.

### DEP0067 : `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Dépréciation de documentation seulement. |
:::

Type : Documentation seulement

L’API `OutgoingMessage.prototype._renderHeaders()` du module `node:http` est obsolète.

La propriété `OutgoingMessage.prototype._renderHeaders` n’a jamais été documentée comme une API officiellement prise en charge.

### DEP0068 : `node debug` {#dep0068-node-debug}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | L’ancienne commande `node debug` a été supprimée. |
| v8.0.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

`node debug` correspond à l’ancien débogueur CLI qui a été remplacé par un débogueur CLI basé sur V8-inspector disponible via `node inspect`.

### DEP0069 : `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v9.0.0 | Dépréciation d’exécution. |
| v8.0.0 | Dépréciation de documentation seulement. |
:::

Type : Fin de vie

DebugContext a été supprimé dans V8 et n’est pas disponible dans Node.js 10+.

DebugContext était une API expérimentale.

### DEP0070 : `async_hooks.currentId()` {#dep0070-async_hookscurrentid}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Fin de vie. |
| v8.2.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

`async_hooks.currentId()` a été renommé `async_hooks.executionAsyncId()` pour plus de clarté.

Cette modification a été effectuée alors que `async_hooks` était une API expérimentale.


### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Fin de vie. |
| v8.2.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

`async_hooks.triggerId()` a été renommé `async_hooks.triggerAsyncId()` pour plus de clarté.

Cette modification a été apportée alors que `async_hooks` était une API expérimentale.

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Fin de vie. |
| v8.2.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

`async_hooks.AsyncResource.triggerId()` a été renommé `async_hooks.AsyncResource.triggerAsyncId()` pour plus de clarté.

Cette modification a été apportée alors que `async_hooks` était une API expérimentale.

### DEP0073: Plusieurs propriétés internes de `net.Server` {#dep0073-several-internal-properties-of-netserver}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v9.0.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

L'accès à plusieurs propriétés internes et non documentées des instances `net.Server` avec des noms inappropriés est déconseillé.

Comme l'API d'origine n'était pas documentée et n'était généralement pas utile pour le code non interne, aucune API de remplacement n'est fournie.

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Fin de vie. |
| v9.0.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

La propriété `REPLServer.bufferedCommand` a été dépréciée en faveur de [`REPLServer.clearBufferedCommand()`](/fr/nodejs/api/repl#replserverclearbufferedcommand).

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Fin de vie. |
| v9.0.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

`REPLServer.parseREPLKeyword()` a été retiré de la visibilité de l'espace utilisateur.

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Fin de vie. |
| v9.0.0 | Dépréciation d'exécution. |
| v8.6.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Fin de vie

`tls.parseCertString()` était un assistant d'analyse trivial qui a été rendu public par erreur. Bien qu'il était censé analyser les chaînes de sujet et d'émetteur de certificat, il n'a jamais géré correctement les noms distinctifs relatifs à plusieurs valeurs.

Les versions antérieures de ce document suggéraient d'utiliser `querystring.parse()` comme alternative à `tls.parseCertString()`. Cependant, `querystring.parse()` ne gère pas non plus correctement tous les sujets de certificat et ne doit pas être utilisé.


### DEP0077: `Module._debug()` {#dep0077-module_debug}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Dépréciation d'exécution. |
:::

Type : Exécution

`Module._debug()` est déprécié.

La fonction `Module._debug()` n'a jamais été documentée comme une API officiellement prise en charge.

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Fin de vie. |
| v9.0.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

`REPLServer.turnOffEditorMode()` a été supprimé de la visibilité du userland.

### DEP0079: Fonction d'inspection personnalisée sur les objets via `.inspect()` {#dep0079-custom-inspection-function-on-objects-via-inspect}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Fin de vie. |
| v10.0.0 | Dépréciation d'exécution. |
| v8.7.0 | Dépréciation de la documentation uniquement. |
:::

Type : Fin de vie

L'utilisation d'une propriété nommée `inspect` sur un objet pour spécifier une fonction d'inspection personnalisée pour [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options) est dépréciée. Utilisez plutôt [`util.inspect.custom`](/fr/nodejs/api/util#utilinspectcustom). Pour une compatibilité descendante avec Node.js antérieure à la version 6.4.0, les deux peuvent être spécifiés.

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

Le `path._makeLong()` interne n'était pas destiné à un usage public. Cependant, les modules userland l'ont trouvé utile. L'API interne est dépréciée et remplacée par une méthode `path.toNamespacedPath()` publique identique.

### DEP0081: `fs.truncate()` utilisant un descripteur de fichier {#dep0081-fstruncate-using-a-file-descriptor}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Dépréciation d'exécution. |
:::

Type : Exécution

L'utilisation de `fs.truncate()` `fs.truncateSync()` avec un descripteur de fichier est dépréciée. Veuillez utiliser `fs.ftruncate()` ou `fs.ftruncateSync()` pour travailler avec des descripteurs de fichier.

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Fin de vie. |
| v9.0.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

`REPLServer.prototype.memory()` n'est nécessaire que pour les mécanismes internes du `REPLServer` lui-même. N'utilisez pas cette fonction.


### DEP0083: Désactivation de ECDH en définissant `ecdhCurve` sur `false` {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v9.2.0 | Dépréciation lors de l'exécution. |
:::

Type: Fin de vie.

L'option `ecdhCurve` pour `tls.createSecureContext()` et `tls.TLSSocket` pouvait être définie sur `false` pour désactiver complètement ECDH sur le serveur uniquement. Ce mode a été déprécié en préparation de la migration vers OpenSSL 1.1.0 et pour assurer la cohérence avec le client, et il n'est plus pris en charge. Utilisez plutôt le paramètre `ciphers`.

### DEP0084: Exiger les dépendances internes groupées {#dep0084-requiring-bundled-internal-dependencies}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Cette fonctionnalité a été supprimée. |
| v10.0.0 | Dépréciation lors de l'exécution. |
:::

Type: Fin de vie

Depuis les versions 4.4.0 et 5.2.0 de Node.js, plusieurs modules destinés uniquement à un usage interne ont été exposés par erreur au code utilisateur via `require()`. Ces modules étaient :

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
- `node-inspect/lib/_inspect` (à partir de la version 7.6.0)
- `node-inspect/lib/internal/inspect_client` (à partir de la version 7.6.0)
- `node-inspect/lib/internal/inspect_repl` (à partir de la version 7.6.0)

Les modules `v8/*` n'ont pas d'exports et, s'ils ne sont pas importés dans un ordre spécifique, ils lèvent en fait des erreurs. En tant que tels, il n'existe pratiquement aucun cas d'utilisation légitime pour les importer via `require()`.

D'autre part, `node-inspect` peut être installé localement via un gestionnaire de packages, car il est publié sur le registre npm sous le même nom. Aucune modification du code source n'est nécessaire si cela est fait.

### DEP0085: API sensible AsyncHooks {#dep0085-asynchooks-sensitive-api}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v9.4.0, v8.10.0 | Dépréciation lors de l'exécution. |
:::

Type: Fin de vie

L'API sensible AsyncHooks n'a jamais été documentée et présentait divers problèmes mineurs. Utilisez plutôt l'API `AsyncResource`. Voir [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572).


### DEP0086 : Suppression de `runInAsyncIdScope` {#dep0086-remove-runinasyncidscope}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
| v9.4.0, v8.10.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

`runInAsyncIdScope` n’émet pas l’événement `'before'` ou `'after'` et peut donc causer beaucoup de problèmes. Voir [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328).

### DEP0089 : `require('node:assert')` {#dep0089-requirenodeassert}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.8.0 | Dépréciation annulée. |
| v9.9.0, v8.13.0 | Dépréciation de documentation uniquement. |
:::

Type : Dépréciation annulée

L’importation directe d’assert n’était pas recommandée, car les fonctions exposées utilisent des contrôles d’égalité lâches. La dépréciation a été annulée, car l’utilisation du module `node:assert` n’est pas déconseillée et la dépréciation a semé la confusion chez les développeurs.

### DEP0090 : Longueurs de balise d’authentification GCM non valides {#dep0090-invalid-gcm-authentication-tag-lengths}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Fin de vie. |
| v10.0.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

Node.js prenait en charge toutes les longueurs de balise d’authentification GCM acceptées par OpenSSL lors de l’appel de [`decipher.setAuthTag()`](/fr/nodejs/api/crypto#deciphersetauthtagbuffer-encoding). À partir de Node.js v11.0.0, seules les longueurs de balise d’authentification de 128, 120, 112, 104, 96, 64 et 32 bits sont autorisées. Les balises d’authentification d’autres longueurs ne sont pas valides selon [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0091 : `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Fin de vie. |
| v10.0.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

La propriété `crypto.DEFAULT_ENCODING` n’existait que pour assurer la compatibilité avec les versions de Node.js antérieures aux versions 0.9.3 et a été supprimée.

### DEP0092 : `this` de niveau supérieur lié à `module.exports` {#dep0092-top-level-this-bound-to-moduleexports}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Dépréciation de documentation uniquement. |
:::

Type : Documentation uniquement

L’attribution de propriétés au `this` de niveau supérieur en tant qu’alternative à `module.exports` est dépréciée. Les développeurs doivent utiliser `exports` ou `module.exports` à la place.


### DEP0093 : `crypto.fips` est obsolète et remplacé {#dep0093-cryptofips-is-deprecated-and-replaced}

::: info [Historique]
| Version | Modifications |
|---|---|
| v23.0.0 | Dépréciation d’exécution. |
| v10.0.0 | Dépréciation de la documentation uniquement. |
:::

Type : Exécution

La propriété [`crypto.fips`](/fr/nodejs/api/crypto#cryptofips) est obsolète. Veuillez utiliser `crypto.setFips()` et `crypto.getFips()` à la place.

### DEP0094 : Utilisation de `assert.fail()` avec plus d’un argument {#dep0094-using-assertfail-with-more-than-one-argument}

::: info [Historique]
| Version | Modifications |
|---|---|
| v10.0.0 | Dépréciation d’exécution. |
:::

Type : Exécution

L’utilisation de `assert.fail()` avec plus d’un argument est obsolète. Utilisez `assert.fail()` avec un seul argument ou utilisez une autre méthode du module `node:assert`.

### DEP0095 : `timers.enroll()` {#dep0095-timersenroll}

::: info [Historique]
| Version | Modifications |
|---|---|
| v10.0.0 | Dépréciation d’exécution. |
:::

Type : Exécution

`timers.enroll()` est obsolète. Veuillez utiliser [`setTimeout()`](/fr/nodejs/api/timers#settimeoutcallback-delay-args) ou [`setInterval()`](/fr/nodejs/api/timers#setintervalcallback-delay-args) documentés publiquement à la place.

### DEP0096 : `timers.unenroll()` {#dep0096-timersunenroll}

::: info [Historique]
| Version | Modifications |
|---|---|
| v10.0.0 | Dépréciation d’exécution. |
:::

Type : Exécution

`timers.unenroll()` est obsolète. Veuillez utiliser [`clearTimeout()`](/fr/nodejs/api/timers#cleartimeouttimeout) ou [`clearInterval()`](/fr/nodejs/api/timers#clearintervaltimeout) documentés publiquement à la place.

### DEP0097 : `MakeCallback` avec la propriété `domain` {#dep0097-makecallback-with-domain-property}

::: info [Historique]
| Version | Modifications |
|---|---|
| v10.0.0 | Dépréciation d’exécution. |
:::

Type : Exécution

Les utilisateurs de `MakeCallback` qui ajoutent la propriété `domain` pour transporter le contexte doivent commencer à utiliser la variante `async_context` de `MakeCallback` ou `CallbackScope`, ou la classe de haut niveau `AsyncResource`.

### DEP0098 : API AsyncHooks embarquée `AsyncResource.emitBefore` et `AsyncResource.emitAfter` {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}

::: info [Historique]
| Version | Modifications |
|---|---|
| v12.0.0 | Fin de vie. |
| v10.0.0, v9.6.0, v8.12.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

L’API intégrée fournie par AsyncHooks expose les méthodes `.emitBefore()` et `.emitAfter()` qui sont très faciles à utiliser de manière incorrecte, ce qui peut entraîner des erreurs irrécupérables.

Utilisez plutôt l’API [`asyncResource.runInAsyncScope()`](/fr/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args) qui offre une alternative beaucoup plus sûre et plus pratique. Voir [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513).


### DEP0099 : API C++ `node::MakeCallback` asynchrones non conscientes du contexte {#dep0099-async-context-unaware-nodemakecallback-c-apis}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Obsolescence au moment de la compilation. |
:::

Type : Au moment de la compilation

Certaines versions des API `node::MakeCallback` disponibles pour les addons natifs sont obsolètes. Veuillez utiliser les versions de l’API qui acceptent un paramètre `async_context`.

### DEP0100 : `process.assert()` {#dep0100-processassert}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Fin de vie. |
| v10.0.0 | Obsolescence lors de l’exécution. |
| v0.3.7 | Obsolescence de la documentation uniquement. |
:::

Type : Fin de vie

`process.assert()` est obsolète. Veuillez utiliser le module [`assert`](/fr/nodejs/api/assert) à la place.

Cela n’a jamais été une fonctionnalité documentée.

### DEP0101 : `--with-lttng` {#dep0101---with-lttng}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
:::

Type : Fin de vie

L’option de compilation `--with-lttng` a été supprimée.

### DEP0102 : Utilisation de `noAssert` dans les opérations `Buffer#(read|write)` {#dep0102-using-noassert-in-bufferread|write-operations}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Fin de vie. |
:::

Type : Fin de vie

L’utilisation de l’argument `noAssert` n’a plus aucune fonctionnalité. Toutes les entrées sont vérifiées quelle que soit la valeur de `noAssert`. Le fait d’ignorer la vérification pourrait entraîner des erreurs et des plantages difficiles à trouver.

### DEP0103 : Les vérifications de type `process.binding('util').is[...]` {#dep0103-processbindingutilis-typechecks}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.9.0 | Remplacé par [DEP0111](/fr/nodejs/api/deprecations#DEP0111). |
| v10.0.0 | Obsolescence de la documentation uniquement. |
:::

Type : Documentation uniquement (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

L’utilisation de `process.binding()` en général doit être évitée. Les méthodes de vérification de type en particulier peuvent être remplacées en utilisant [`util.types`](/fr/nodejs/api/util#utiltypes).

Cette obsolescence a été remplacée par l’obsolescence de l’API `process.binding()` ([DEP0111](/fr/nodejs/api/deprecations#DEP0111)).

### DEP0104 : Coercition de chaîne `process.env` {#dep0104-processenv-string-coercion}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Obsolescence de la documentation uniquement. |
:::

Type : Documentation uniquement (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

Lors de l’attribution d’une propriété non-chaîne à [`process.env`](/fr/nodejs/api/process#processenv), la valeur attribuée est implicitement convertie en chaîne. Ce comportement est obsolète si la valeur attribuée n’est pas une chaîne, un booléen ou un nombre. À l’avenir, une telle attribution pourrait entraîner une erreur. Veuillez convertir la propriété en chaîne avant de l’attribuer à `process.env`.


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Fin de vie. |
| v10.0.0 | Dépréciation lors de l'exécution. |
:::

Type: Fin de vie

`decipher.finaltol()` n'a jamais été documenté et était un alias pour [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding). Cette API a été supprimée, et il est recommandé d'utiliser [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding) à la place.

### DEP0106: `crypto.createCipher` et `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | Fin de vie. |
| v11.0.0 | Dépréciation lors de l'exécution. |
| v10.0.0 | Dépréciation uniquement dans la documentation. |
:::

Type: Fin de vie

`crypto.createCipher()` et `crypto.createDecipher()` ont été supprimés car ils utilisent une fonction de dérivation de clé faible (MD5 sans sel) et des vecteurs d'initialisation statiques. Il est recommandé de dériver une clé en utilisant [`crypto.pbkdf2()`](/fr/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) ou [`crypto.scrypt()`](/fr/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) avec des sels aléatoires et d'utiliser [`crypto.createCipheriv()`](/fr/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) et [`crypto.createDecipheriv()`](/fr/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) pour obtenir les objets [`Cipher`](/fr/nodejs/api/crypto#class-cipher) et [`Decipher`](/fr/nodejs/api/crypto#class-decipher) respectivement.

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Fin de vie. |
| v10.0.0 | Dépréciation lors de l'exécution. |
:::

Type: Fin de vie

Il s'agissait d'une fonction d'assistance non documentée, non destinée à être utilisée en dehors du cœur de Node.js et rendue obsolète par la suppression de la prise en charge de NPN (Next Protocol Negotiation).

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Fin de vie. |
| v11.0.0 | Dépréciation lors de l'exécution. |
| v10.0.0 | Dépréciation uniquement dans la documentation. |
:::

Type: Fin de vie

Alias obsolète pour [`zlib.bytesWritten`](/fr/nodejs/api/zlib#zlibbyteswritten). Le nom original a été choisi car il était également logique d'interpréter la valeur comme le nombre d'octets lus par le moteur, mais il est incohérent avec les autres flux de Node.js qui exposent des valeurs sous ces noms.


### DEP0109 : Prise en charge de `http`, `https` et `tls` pour les URLs invalides {#dep0109-http-https-and-tls-support-for-invalid-urls}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Fin de vie. |
| v11.0.0 | Dépréciation au moment de l'exécution. |
:::

Type : Fin de vie

Certaines URLs précédemment prises en charge (mais strictement invalides) étaient acceptées via les APIs [`http.request()`](/fr/nodejs/api/http#httprequestoptions-callback), [`http.get()`](/fr/nodejs/api/http#httpgetoptions-callback), [`https.request()`](/fr/nodejs/api/https#httpsrequestoptions-callback), [`https.get()`](/fr/nodejs/api/https#httpsgetoptions-callback) et [`tls.checkServerIdentity()`](/fr/nodejs/api/tls#tlscheckserveridentityhostname-cert) parce qu'elles étaient acceptées par l'ancienne API `url.parse()`. Les APIs mentionnées utilisent désormais l'analyseur d'URL WHATWG qui exige des URLs strictement valides. Le passage d'une URL invalide est obsolète et la prise en charge sera supprimée à l'avenir.

### DEP0110 : Données mises en cache `vm.Script` {#dep0110-vmscript-cached-data}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.6.0 | Dépréciation limitée à la documentation. |
:::

Type : Dépréciation limitée à la documentation

L'option `produceCachedData` est obsolète. Utilisez [`script.createCachedData()`](/fr/nodejs/api/vm#scriptcreatecacheddata) à la place.

### DEP0111 : `process.binding()` {#dep0111-processbinding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.12.0 | Ajout de la prise en charge de `--pending-deprecation`. |
| v10.9.0 | Dépréciation limitée à la documentation. |
:::

Type : Dépréciation limitée à la documentation (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

`process.binding()` est destiné à être utilisé uniquement par le code interne de Node.js.

Bien que `process.binding()` n'ait pas atteint le statut de fin de vie en général, il n'est pas disponible lorsque le [modèle d'autorisation](/fr/nodejs/api/permissions#permission-model) est activé.

### DEP0112 : APIs privées `dgram` {#dep0112-dgram-private-apis}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Dépréciation au moment de l'exécution. |
:::

Type : Exécution

Le module `node:dgram` contenait auparavant plusieurs APIs qui n'étaient jamais destinées à être accédées en dehors du cœur de Node.js : `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()` et `dgram._createSocketHandle()`.


### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v11.0.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

`Cipher.setAuthTag()` et `Decipher.getAuthTag()` ne sont plus disponibles. Ils n'ont jamais été documentés et déclenchaient une erreur lorsqu'ils étaient appelés.

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Fin de vie. |
| v11.0.0 | Dépréciation d'exécution. |
:::

Type : Fin de vie

La fonction `crypto._toBuf()` n'a pas été conçue pour être utilisée par des modules en dehors du cœur de Node.js et a été supprimée.

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Ajout d'une dépréciation limitée à la documentation avec prise en charge de `--pending-deprecation`. |
:::

Type : Limité à la documentation (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

Dans les versions récentes de Node.js, il n'y a aucune différence entre [`crypto.randomBytes()`](/fr/nodejs/api/crypto#cryptorandombytessize-callback) et `crypto.pseudoRandomBytes()`. Cette dernière est dépréciée avec les alias non documentés `crypto.prng()` et `crypto.rng()` en faveur de [`crypto.randomBytes()`](/fr/nodejs/api/crypto#cryptorandombytessize-callback) et pourrait être supprimée dans une future version.

### DEP0116: API URL héritée {#dep0116-legacy-url-api}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()` est à nouveau dépréciée dans DEP0169. |
| v15.13.0, v14.17.0 | Dépréciation révoquée. Statut modifié en "Hérité". |
| v11.0.0 | Dépréciation limitée à la documentation. |
:::

Type : Dépréciation révoquée

L'[API URL héritée](/fr/nodejs/api/url#legacy-url-api) est dépréciée. Ceci inclut [`url.format()`](/fr/nodejs/api/url#urlformaturlobject), [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), [`url.resolve()`](/fr/nodejs/api/url#urlresolvefrom-to), et l'[`urlObject` héritée](/fr/nodejs/api/url#legacy-urlobject). Veuillez utiliser plutôt l'[API URL WHATWG](/fr/nodejs/api/url#the-whatwg-url-api).


### DEP0117 : Gestionnaires de crypto natifs {#dep0117-native-crypto-handles}

::: info [Historique]
| Version | Modifications |
|---|---|
| v12.0.0 | Fin de vie. |
| v11.0.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

Les versions précédentes de Node.js exposaient les gestionnaires aux objets natifs internes via la propriété `_handle` des classes `Cipher`, `Decipher`, `DiffieHellman`, `DiffieHellmanGroup`, `ECDH`, `Hash`, `Hmac`, `Sign` et `Verify`. La propriété `_handle` a été supprimée car une utilisation incorrecte de l’objet natif peut entraîner le plantage de l’application.

### DEP0118 : Prise en charge de `dns.lookup()` pour un nom d’hôte faux {#dep0118-dnslookup-support-for-a-falsy-host-name}

::: info [Historique]
| Version | Modifications |
|---|---|
| v11.0.0 | Dépréciation d’exécution. |
:::

Type : Exécution

Les versions précédentes de Node.js prenaient en charge `dns.lookup()` avec un nom d’hôte faux comme `dns.lookup(false)` en raison de la compatibilité ascendante. Ce comportement n’est pas documenté et est considéré comme inutilisé dans les applications du monde réel. Il deviendra une erreur dans les versions futures de Node.js.

### DEP0119 : API privée `process.binding('uv').errname()` {#dep0119-processbindinguverrname-private-api}

::: info [Historique]
| Version | Modifications |
|---|---|
| v11.0.0 | Dépréciation réservée à la documentation. |
:::

Type : Réservée à la documentation (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

`process.binding('uv').errname()` est déprécié. Veuillez plutôt utiliser [`util.getSystemErrorName()`](/fr/nodejs/api/util#utilgetsystemerrornameerr).

### DEP0120 : Prise en charge du compteur de performance Windows {#dep0120-windows-performance-counter-support}

::: info [Historique]
| Version | Modifications |
|---|---|
| v12.0.0 | Fin de vie. |
| v11.0.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

La prise en charge du compteur de performance Windows a été supprimée de Node.js. Les fonctions non documentées `COUNTER_NET_SERVER_CONNECTION()`, `COUNTER_NET_SERVER_CONNECTION_CLOSE()`, `COUNTER_HTTP_SERVER_REQUEST()`, `COUNTER_HTTP_SERVER_RESPONSE()`, `COUNTER_HTTP_CLIENT_REQUEST()` et `COUNTER_HTTP_CLIENT_RESPONSE()` ont été dépréciées.

### DEP0121 : `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}

::: info [Historique]
| Version | Modifications |
|---|---|
| v12.0.0 | Dépréciation d’exécution. |
:::

Type : Exécution

La fonction non documentée `net._setSimultaneousAccepts()` était initialement destinée au débogage et à l’optimisation des performances lors de l’utilisation des modules `node:child_process` et `node:cluster` sous Windows. La fonction n’est généralement pas utile et est en cours de suppression. Voir la discussion ici : [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)


### DEP0122 : `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Dépréciation à l’exécution. |
:::

Type : Exécution

Veuillez utiliser `Server.prototype.setSecureContext()` à la place.

### DEP0123 : définition du TLS ServerName sur une adresse IP {#dep0123-setting-the-tls-servername-to-an-ip-address}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Dépréciation à l’exécution. |
:::

Type : Exécution

La définition du TLS ServerName sur une adresse IP n’est pas autorisée par [RFC 6066](https://tools.ietf.org/html/rfc6066#section-3). Ceci sera ignoré dans une version future.

### DEP0124 : utilisation de `REPLServer.rli` {#dep0124-using-replserverrli}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Fin de vie. |
| v12.0.0 | Dépréciation à l’exécution. |
:::

Type : Fin de vie

Cette propriété est une référence à l’instance elle-même.

### DEP0125 : `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Dépréciation à l’exécution. |
:::

Type : Exécution

Le module `node:_stream_wrap` est obsolète.

### DEP0126 : `timers.active()` {#dep0126-timersactive}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.14.0 | Dépréciation à l’exécution. |
:::

Type : Exécution

La fonction `timers.active()` précédemment non documentée est obsolète. Veuillez utiliser à la place la fonction [`timeout.refresh()`](/fr/nodejs/api/timers#timeoutrefresh) publiquement documentée. Si le référencement du délai d’attente est nécessaire, [`timeout.ref()`](/fr/nodejs/api/timers#timeoutref) peut être utilisé sans impact sur les performances depuis Node.js 10.

### DEP0127 : `timers._unrefActive()` {#dep0127-timers_unrefactive}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.14.0 | Dépréciation à l’exécution. |
:::

Type : Exécution

La fonction `timers._unrefActive()` précédemment non documentée et « privée » est obsolète. Veuillez utiliser à la place la fonction [`timeout.refresh()`](/fr/nodejs/api/timers#timeoutrefresh) publiquement documentée. Si la suppression de la référence du délai d’attente est nécessaire, [`timeout.unref()`](/fr/nodejs/api/timers#timeoutunref) peut être utilisé sans impact sur les performances depuis Node.js 10.

### DEP0128 : modules avec une entrée `main` invalide et un fichier `index.js` {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Dépréciation à l’exécution. |
| v12.0.0 | Documentation uniquement. |
:::

Type : Exécution

Les modules qui ont une entrée `main` invalide (par exemple, `./does-not-exist.js`) et qui ont également un fichier `index.js` dans le répertoire de niveau supérieur résoudront le fichier `index.js`. Ceci est obsolète et va générer une erreur dans les futures versions de Node.js.


### DEP0129 : `ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Obsolescence d’exécution. |
| v11.14.0 | Documentation uniquement. |
:::

Type : Exécution

La propriété `_channel` des objets de processus enfant renvoyés par `spawn()` et des fonctions similaires n’est pas destinée à un usage public. Utilisez plutôt `ChildProcess.channel`.

### DEP0130 : `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Fin de vie. |
| v13.0.0 | Obsolescence d’exécution. |
| v12.2.0 | Documentation uniquement. |
:::

Type : Fin de vie

Utilisez plutôt [`module.createRequire()`](/fr/nodejs/api/module#modulecreaterequirefilename).

### DEP0131 : Analyseur HTTP hérité {#dep0131-legacy-http-parser}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Cette fonctionnalité a été supprimée. |
| v12.22.0 | Obsolescence d’exécution. |
| v12.3.0 | Documentation uniquement. |
:::

Type : Fin de vie

L’analyseur HTTP hérité, utilisé par défaut dans les versions de Node.js antérieures à 12.0.0, est obsolète et a été supprimé dans la version v13.0.0. Avant la version v13.0.0, l’indicateur de ligne de commande `--http-parser=legacy` pouvait être utilisé pour revenir à l’utilisation de l’analyseur hérité.

### DEP0132 : `worker.terminate()` avec rappel {#dep0132-workerterminate-with-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.5.0 | Obsolescence d’exécution. |
:::

Type : Exécution

Il est obsolète de passer un rappel à [`worker.terminate()`](/fr/nodejs/api/worker_threads#workerterminate). Utilisez plutôt la `Promise` renvoyée, ou un listener pour l’événement `'exit'` du worker.

### DEP0133 : `http` `connection` {#dep0133-http-connection}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.12.0 | Obsolescence de la documentation uniquement. |
:::

Type : Documentation uniquement

Préférez [`response.socket`](/fr/nodejs/api/http#responsesocket) à [`response.connection`](/fr/nodejs/api/http#responseconnection) et [`request.socket`](/fr/nodejs/api/http#requestsocket) à [`request.connection`](/fr/nodejs/api/http#requestconnection).

### DEP0134 : `process._tickCallback` {#dep0134-process_tickcallback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.12.0 | Obsolescence de la documentation uniquement. |
:::

Type : Documentation uniquement (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

La propriété `process._tickCallback` n’a jamais été documentée comme une API officiellement prise en charge.


### DEP0135 : `WriteStream.open()` et `ReadStream.open()` sont internes {#dep0135-writestreamopen-and-readstreamopen-are-internal}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Dépréciation d'exécution. |
:::

Type : Exécution

[`WriteStream.open()`](/fr/nodejs/api/fs#class-fswritestream) et [`ReadStream.open()`](/fr/nodejs/api/fs#class-fsreadstream) sont des API internes non documentées qu'il n'est pas logique d'utiliser dans l'espace utilisateur. Les flux de fichiers doivent toujours être ouverts via leurs méthodes de fabrique correspondantes [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options) et [`fs.createReadStream()`](/fr/nodejs/api/fs#fscreatereadstreampath-options)) ou en transmettant un descripteur de fichier dans les options.

### DEP0136 : `http` `finished` {#dep0136-http-finished}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.4.0, v12.16.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

[`response.finished`](/fr/nodejs/api/http#responsefinished) indique si [`response.end()`](/fr/nodejs/api/http#responseenddata-encoding-callback) a été appelé, et non si `'finish'` a été émis et si les données sous-jacentes ont été vidées.

Utilisez plutôt [`response.writableFinished`](/fr/nodejs/api/http#responsewritablefinished) ou [`response.writableEnded`](/fr/nodejs/api/http#responsewritableended) pour éviter toute ambiguïté.

Pour maintenir le comportement existant, `response.finished` doit être remplacé par `response.writableEnded`.

### DEP0137 : Fermeture de fs.FileHandle lors du ramassage des ordures {#dep0137-closing-fsfilehandle-on-garbage-collection}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Dépréciation d'exécution. |
:::

Type : Exécution

Autoriser la fermeture d'un objet [`fs.FileHandle`](/fr/nodejs/api/fs#class-filehandle) lors du ramassage des ordures est déprécié. À l'avenir, cela pourrait entraîner une erreur qui mettra fin au processus.

Veuillez vous assurer que tous les objets `fs.FileHandle` sont explicitement fermés à l'aide de `FileHandle.prototype.close()` lorsque le `fs.FileHandle` n'est plus nécessaire :

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

### DEP0138 : `process.mainModule` {#dep0138-processmainmodule}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Obsolescence de documentation uniquement. |
:::

Type : Documentation uniquement

[`process.mainModule`](/fr/nodejs/api/process#processmainmodule) est une fonctionnalité réservée à CommonJS, tandis que l’objet global `process` est partagé avec l’environnement non-CommonJS. Son utilisation dans les modules ECMAScript n’est pas prise en charge.

Il est obsolète en faveur de [`require.main`](/fr/nodejs/api/modules#accessing-the-main-module), car il remplit le même objectif et n’est disponible que dans l’environnement CommonJS.

### DEP0139 : `process.umask()` sans argument {#dep0139-processumask-with-no-arguments}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0, v12.19.0 | Obsolescence de documentation uniquement. |
:::

Type : Documentation uniquement

L’appel de `process.umask()` sans argument entraîne l’écriture deux fois du masque umask à l’échelle du processus. Cela introduit une condition de concurrence entre les threads et constitue une vulnérabilité potentielle de sécurité. Il n’existe pas d’API alternative sécurisée et multiplateforme.

### DEP0140 : Utiliser `request.destroy()` au lieu de `request.abort()` {#dep0140-use-requestdestroy-instead-of-requestabort}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.1.0, v13.14.0 | Obsolescence de documentation uniquement. |
:::

Type : Documentation uniquement

Utiliser [`request.destroy()`](/fr/nodejs/api/http#requestdestroyerror) au lieu de [`request.abort()`](/fr/nodejs/api/http#requestabort).

### DEP0141 : `repl.inputStream` et `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.3.0 | Documentation uniquement (prend en charge [`--pending-deprecation`][]). |
:::

Type : Documentation uniquement (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

Le module `node:repl` a exporté le flux d’entrée et de sortie deux fois. Utilisez `.input` au lieu de `.inputStream` et `.output` au lieu de `.outputStream`.

### DEP0142 : `repl._builtinLibs` {#dep0142-repl_builtinlibs}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.3.0 | Documentation uniquement (prend en charge [`--pending-deprecation`][]). |
:::

Type : Documentation uniquement

Le module `node:repl` exporte une propriété `_builtinLibs` qui contient un tableau de modules intégrés. Elle était incomplète jusqu’à présent et il est préférable de s’appuyer sur `require('node:module').builtinModules`.


### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0 | Dépréciation d'exécution. |
:::

Type : Exécution `Transform._transformState` sera supprimé dans les versions futures où il ne sera plus nécessaire en raison de la simplification de l’implémentation.

### DEP0144: `module.parent` {#dep0144-moduleparent}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.6.0, v12.19.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

Un module CommonJS peut accéder au premier module qui l’a requis en utilisant `module.parent`. Cette fonctionnalité est obsolète, car elle ne fonctionne pas de manière cohérente en présence de modules ECMAScript et parce qu’elle donne une représentation inexacte du graphe de module CommonJS.

Certains modules l’utilisent pour vérifier s’ils sont le point d’entrée du processus actuel. Au lieu de cela, il est recommandé de comparer `require.main` et `module`:

```js [ESM]
if (require.main === module) {
  // Section de code qui ne s'exécutera que si le fichier courant est le point d'entrée.
}
```
Lors de la recherche des modules CommonJS qui ont requis le module courant, `require.cache` et `module.children` peuvent être utilisés :

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.6.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

[`socket.bufferSize`](/fr/nodejs/api/net#socketbuffersize) est juste un alias pour [`writable.writableLength`](/fr/nodejs/api/stream#writablewritablelength).

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

Le [`crypto.Certificate()` constructeur](/fr/nodejs/api/crypto#legacy-api) est déprécié. Utilisez plutôt [les méthodes statiques de `crypto.Certificate()`](/fr/nodejs/api/crypto#class-certificate).

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Dépréciation d'exécution. |
| v15.0.0 | Dépréciation d'exécution pour un comportement permissif. |
| v14.14.0 | Dépréciation de la documentation uniquement. |
:::

Type : Exécution

Dans les futures versions de Node.js, l’option `recursive` sera ignorée pour `fs.rmdir`, `fs.rmdirSync` et `fs.promises.rmdir`.

Utilisez plutôt `fs.rm(path, { recursive: true, force: true })`, `fs.rmSync(path, { recursive: true, force: true })` ou `fs.promises.rm(path, { recursive: true, force: true })`.


### DEP0148 : Mappages de dossiers dans `"exports"` (barre oblique `"/"` de fin) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.0.0 | Fin de vie. |
| v16.0.0 | Dépréciation d’exécution. |
| v15.1.0 | Dépréciation d’exécution pour les importations auto-référentielles. |
| v14.13.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Exécution

L’utilisation d’une barre oblique `"/"` de fin pour définir des mappages de dossiers de sous-chemin dans les champs [exports de sous-chemin](/fr/nodejs/api/packages#subpath-exports) ou [importations de sous-chemin](/fr/nodejs/api/packages#subpath-imports) est obsolète. Utilisez plutôt les [modèles de sous-chemin](/fr/nodejs/api/packages#subpath-patterns).

### DEP0149 : `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Uniquement dans la documentation.

Préférez [`message.socket`](/fr/nodejs/api/http#messagesocket) à [`message.connection`](/fr/nodejs/api/http#messageconnection).

### DEP0150 : Modification de la valeur de `process.config` {#dep0150-changing-the-value-of-processconfig}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Fin de vie. |
| v16.0.0 | Dépréciation d’exécution. |
:::

Type : Fin de vie

La propriété `process.config` donne accès aux paramètres de compilation de Node.js. Cependant, la propriété est mutable et donc sujette à des altérations. La possibilité de modifier la valeur sera supprimée dans une future version de Node.js.

### DEP0151 : Recherche d’index principal et recherche d’extension {#dep0151-main-index-lookup-and-extension-searching}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Dépréciation d’exécution. |
| v15.8.0, v14.18.0 | Dépréciation uniquement dans la documentation avec prise en charge de `--pending-deprecation`. |
:::

Type : Exécution

Auparavant, les recherches de `index.js` et de l’extension s’appliquaient à la résolution du point d’entrée principal `import 'pkg'`, même lors de la résolution des modules ES.

Avec cette dépréciation, toutes les résolutions de point d’entrée principal du module ES nécessitent une [entrée `"exports"` ou `"main"` explicite](/fr/nodejs/api/packages#main-entry-point-export) avec l’extension de fichier exacte.

### DEP0152 : Propriétés Extension PerformanceEntry {#dep0152-extension-performanceentry-properties}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Dépréciation d’exécution. |
:::

Type : Exécution

Les types d’objet [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry) `'gc'`, `'http2'` et `'http'` ont des propriétés supplémentaires qui leur sont attribuées et qui fournissent des informations supplémentaires. Ces propriétés sont désormais disponibles dans la propriété `detail` standard de l’objet `PerformanceEntry`. Les accesseurs existants ont été déclarés obsolètes et ne doivent plus être utilisés.


### DEP0153 : conversion de type des options `dns.lookup` et `dnsPromises.lookup` {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Fin de vie. |
| v17.0.0 | Dépréciation d’exécution. |
| v16.8.0 | Dépréciation de la documentation uniquement. |
:::

Type : Fin de vie

L’utilisation d’une valeur non null et non entière pour l’option `family`, d’une valeur non nulle et non numérique pour l’option `hints`, d’une valeur non nulle et non booléenne pour l’option `all` ou d’une valeur non nulle et non booléenne pour l’option `verbatim` dans [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) et [`dnsPromises.lookup()`](/fr/nodejs/api/dns#dnspromiseslookuphostname-options) lève une erreur `ERR_INVALID_ARG_TYPE`.

### DEP0154 : Options de génération de paires de clés RSA-PSS {#dep0154-rsa-pss-generate-key-pair-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Dépréciation d’exécution. |
| v16.10.0 | Dépréciation de la documentation uniquement. |
:::

Type : Exécution

Les options `'hash'` et `'mgf1Hash'` sont remplacées par `'hashAlgorithm'` et `'mgf1HashAlgorithm'`.

### DEP0155 : Barres obliques finales dans les résolutions de spécificateurs de modèle {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.0.0 | Dépréciation d’exécution. |
| v16.10.0 | Dépréciation de la documentation uniquement avec la prise en charge de `--pending-deprecation`. |
:::

Type : Exécution

Le remappage des spécificateurs se terminant par `"/"` comme `import 'pkg/x/'` est obsolète pour les résolutions de modèle `"exports"` et `"imports"` du paquet.

### DEP0156 : Propriété `.aborted` et événement `'abort'`, `'aborted'` dans `http` {#dep0156-aborted-property-and-abort-aborted-event-in-http}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.0.0, v16.12.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

Passez plutôt à l’API [\<Stream\>](/fr/nodejs/api/stream#stream), car les [`http.ClientRequest`](/fr/nodejs/api/http#class-httpclientrequest), [`http.ServerResponse`](/fr/nodejs/api/http#class-httpserverresponse) et [`http.IncomingMessage`](/fr/nodejs/api/http#class-httpincomingmessage) sont tous basés sur des flux. Vérifiez `stream.destroyed` au lieu de la propriété `.aborted` et écoutez `'close'` au lieu de l’événement `'abort'`, `'aborted'`.

La propriété `.aborted` et l’événement `'abort'` ne sont utiles que pour détecter les appels `.abort()`. Pour fermer une requête plus tôt, utilisez Stream `.destroy([error])`, puis vérifiez que la propriété `.destroyed` et l’événement `'close'` devraient avoir le même effet. L’extrémité de réception doit également vérifier la valeur [`readable.readableEnded`](/fr/nodejs/api/stream#readablereadableended) sur [`http.IncomingMessage`](/fr/nodejs/api/http#class-httpincomingmessage) pour savoir s’il s’agissait d’un arrêt ou d’une destruction normale.


### DEP0157: Prise en charge des thenables dans les streams {#dep0157-thenable-support-in-streams}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Fin de vie. |
| v17.2.0, v16.14.0 | Dépréciation de documentation uniquement. |
:::

Type : Fin de vie

Une fonctionnalité non documentée des flux Node.js était la prise en charge des thenables dans les méthodes d'implémentation. Ceci est maintenant obsolète, utilisez plutôt des rappels et évitez d'utiliser une fonction asynchrone pour les méthodes d'implémentation des flux.

Cette fonctionnalité a amené les utilisateurs à rencontrer des problèmes inattendus lorsque l'utilisateur implémente la fonction dans un style de rappel mais utilise, par exemple, une méthode asynchrone, ce qui provoquerait une erreur car le mélange de la sémantique de promesse et de rappel n'est pas valide.

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.5.0, v16.15.0 | Dépréciation de documentation uniquement. |
:::

Type : Documentation uniquement

Cette méthode a été dépréciée car elle n'est pas compatible avec `Uint8Array.prototype.slice()`, qui est une superclasse de `Buffer`.

Utilisez plutôt [`buffer.subarray`](/fr/nodejs/api/buffer#bufsubarraystart-end) qui fait la même chose.

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Fin de vie. |
:::

Type : Fin de vie

Ce code d'erreur a été supprimé car il ajoutait de la confusion aux erreurs utilisées pour la validation du type de valeur.

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Dépréciation d'exécution. |
| v17.6.0, v16.15.0 | Dépréciation de documentation uniquement. |
:::

Type : Exécution.

Cet événement a été déprécié car il ne fonctionnait pas avec les combinateurs de promesses V8, ce qui diminuait son utilité.

### DEP0161: `process._getActiveRequests()` et `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.6.0, v16.15.0 | Dépréciation de documentation uniquement. |
:::

Type : Documentation uniquement

Les fonctions `process._getActiveHandles()` et `process._getActiveRequests()` ne sont pas destinées à un usage public et peuvent être supprimées dans les prochaines versions.

Utilisez [`process.getActiveResourcesInfo()`](/fr/nodejs/api/process#processgetactiveresourcesinfo) pour obtenir une liste des types de ressources actives et non les références réelles.


### DEP0162 : `fs.write()`, `fs.writeFileSync()` conversion forcée en chaîne de caractères {#dep0162-fswrite-fswritefilesync-coercion-to-string}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Fin de vie. |
| v18.0.0 | Dépréciation d'exécution. |
| v17.8.0, v16.15.0 | Dépréciation de la documentation uniquement. |
:::

Type : Fin de vie

La conversion implicite d'objets avec leur propre propriété `toString`, passés comme deuxième paramètre dans [`fs.write()`](/fr/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback), [`fs.writeFile()`](/fr/nodejs/api/fs#fswritefilefile-data-options-callback), [`fs.appendFile()`](/fr/nodejs/api/fs#fsappendfilepath-data-options-callback), [`fs.writeFileSync()`](/fr/nodejs/api/fs#fswritefilesyncfile-data-options) et [`fs.appendFileSync()`](/fr/nodejs/api/fs#fsappendfilesyncpath-data-options) est obsolète. Convertissez-les en chaînes de caractères primitives.

### DEP0163 : `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.7.0, v16.17.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

Ces méthodes ont été déclarées obsolètes car elles peuvent être utilisées d'une manière qui ne maintient pas la référence du canal suffisamment longtemps pour recevoir les événements.

Utilisez [`diagnostics_channel.subscribe(name, onMessage)`](/fr/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) ou [`diagnostics_channel.unsubscribe(name, onMessage)`](/fr/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage) qui font la même chose à la place.

### DEP0164 : `process.exit(code)`, `process.exitCode` conversion forcée en entier {#dep0164-processexitcode-processexitcode-coercion-to-integer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Fin de vie. |
| v19.0.0 | Dépréciation d'exécution. |
| v18.10.0, v16.18.0 | Dépréciation de la documentation uniquement de la conversion d'entiers `process.exitCode`. |
| v18.7.0, v16.17.0 | Dépréciation de la documentation uniquement de la conversion d'entiers `process.exit(code)`. |
:::

Type : Fin de vie

Les valeurs autres que `undefined`, `null`, les nombres entiers et les chaînes d'entiers (par exemple, `'1'`) sont obsolètes en tant que valeur pour le paramètre `code` dans [`process.exit()`](/fr/nodejs/api/process#processexitcode) et en tant que valeur à affecter à [`process.exitCode`](/fr/nodejs/api/process#processexitcode_1).


### DEP0165 : `--trace-atomics-wait` {#dep0165---trace-atomics-wait}

::: info [Historique]
| Version | Modifications |
|---|---|
| v23.0.0 | Fin de vie. |
| v22.0.0 | Dépréciation à l’exécution. |
| v18.8.0, v16.18.0 | Dépréciation limitée à la documentation. |
:::

Type : Fin de vie

L’indicateur `--trace-atomics-wait` a été supprimé car il utilise le hook V8 `SetAtomicsWaitCallback`, qui sera supprimé dans une future version de V8.

### DEP0166 : Doubles barres obliques dans les cibles d’imports et d’exports {#dep0166-double-slashes-in-imports-and-exports-targets}

::: info [Historique]
| Version | Modifications |
|---|---|
| v19.0.0 | Dépréciation à l’exécution. |
| v18.10.0 | Dépréciation limitée à la documentation avec la prise en charge de `--pending-deprecation`. |
:::

Type : Exécution

Les cibles d’importation et d’exportation de paquets mappant vers des chemins incluant une double barre oblique (de *"/"* ou *"\"*) sont dépréciées et échoueront avec une erreur de validation de résolution dans une future version. Cette même dépréciation s’applique également aux correspondances de modèles commençant ou se terminant par une barre oblique.

### DEP0167 : Instances `DiffieHellmanGroup` faibles (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}

::: info [Historique]
| Version | Modifications |
|---|---|
| v18.10.0, v16.18.0 | Dépréciation limitée à la documentation. |
:::

Type : Documentation uniquement

Les groupes MODP bien connus `modp1`, `modp2` et `modp5` sont dépréciés car ils ne sont pas sécurisés contre les attaques pratiques. Voir [RFC 8247 Section 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4) pour plus de détails.

Ces groupes pourraient être supprimés dans les futures versions de Node.js. Les applications qui s’appuient sur ces groupes devraient évaluer l’utilisation de groupes MODP plus forts à la place.

### DEP0168 : Exception non gérée dans les rappels de Node-API {#dep0168-unhandled-exception-in-node-api-callbacks}

::: info [Historique]
| Version | Modifications |
|---|---|
| v18.3.0, v16.17.0 | Dépréciation à l’exécution. |
:::

Type : Exécution

La suppression implicite des exceptions non interceptées dans les rappels de Node-API est maintenant dépréciée.

Définissez l’indicateur [`--force-node-api-uncaught-exceptions-policy`](/fr/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy) pour forcer Node.js à émettre un événement [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception) si l’exception n’est pas gérée dans les rappels de Node-API.


### DEP0169: `url.parse()` non sécurisé {#dep0169-insecure-urlparse}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.9.0, v18.17.0 | Ajout du support pour `--pending-deprecation`. |
| v19.0.0, v18.13.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Documentation uniquement (prend en charge [`--pending-deprecation`](/fr/nodejs/api/cli#--pending-deprecation))

Le comportement de [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) n’est pas standardisé et est sujet à des erreurs qui ont des implications en matière de sécurité. Utilisez plutôt l’[API URL WHATWG](/fr/nodejs/api/url#the-whatwg-url-api). Les CVE ne sont pas émises pour les vulnérabilités de `url.parse()`.

### DEP0170 : Port non valide lors de l’utilisation de `url.parse()` {#dep0170-invalid-port-when-using-urlparse}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Dépréciation lors de l’exécution. |
| v19.2.0, v18.13.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Exécution

[`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) accepte les URL avec des ports qui ne sont pas des nombres. Ce comportement peut entraîner une usurpation de nom d’hôte avec une entrée inattendue. Ces URL généreront une erreur dans les futures versions de Node.js, comme le fait déjà l’[API URL WHATWG](/fr/nodejs/api/url#the-whatwg-url-api).

### DEP0171 : Accesseurs (setters) pour les en-têtes et les suites d’en-têtes de `http.IncomingMessage` {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.3.0, v18.13.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Documentation uniquement

Dans une future version de Node.js, [`message.headers`](/fr/nodejs/api/http#messageheaders), [`message.headersDistinct`](/fr/nodejs/api/http#messageheadersdistinct), [`message.trailers`](/fr/nodejs/api/http#messagetrailers) et [`message.trailersDistinct`](/fr/nodejs/api/http#messagetrailersdistinct) seront en lecture seule.

### DEP0172 : La propriété `asyncResource` des fonctions liées à `AsyncResource` {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Dépréciation lors de l’exécution. |
:::

Type : Exécution

Dans une future version de Node.js, la propriété `asyncResource` ne sera plus ajoutée lorsqu’une fonction est liée à un `AsyncResource`.

### DEP0173 : La classe `assert.CallTracker` {#dep0173-the-assertcalltracker-class}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Documentation uniquement

Dans une future version de Node.js, [`assert.CallTracker`](/fr/nodejs/api/assert#class-assertcalltracker) sera supprimée. Pensez à utiliser des alternatives telles que la fonction d’assistance [`mock`](/fr/nodejs/api/test#mocking).


### DEP0174 : appel de `promisify` sur une fonction qui renvoie une `Promise` {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Obsolescence d’exécution. |
| v20.8.0 | Obsolescence de la documentation uniquement. |
:::

Type : Exécution

Appel de [`util.promisify`](/fr/nodejs/api/util#utilpromisifyoriginal) sur une fonction qui renvoie une

### DEP0175 : `util.toUSVString` {#dep0175-utiltousvstring}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.8.0 | Obsolescence de la documentation uniquement. |
:::

Type : Documentation uniquement

L’API [`util.toUSVString()`](/fr/nodejs/api/util#utiltousvstringstring) est obsolète. Veuillez utiliser [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed) à la place.

### DEP0176 : `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.8.0 | Obsolescence de la documentation uniquement. |
:::

Type : Documentation uniquement

Les getters `F_OK`, `R_OK`, `W_OK` et `X_OK` exposés directement sur `node:fs` sont obsolètes. Obtenez-les à partir de `fs.constants` ou `fs.promises.constants` à la place.

### DEP0177 : `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.7.0, v20.12.0 | Fin de vie. |
| v21.3.0, v20.11.0 | Un code d’obsolescence a été attribué. |
| v14.0.0 | Obsolescence de la documentation uniquement. |
:::

Type : Fin de vie

L’API `util.types.isWebAssemblyCompiledModule` a été supprimée. Veuillez utiliser `value instanceof WebAssembly.Module` à la place.

### DEP0178 : `dirent.path` {#dep0178-direntpath}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Obsolescence d’exécution. |
| v21.5.0, v20.12.0, v18.20.0 | Obsolescence de la documentation uniquement. |
:::

Type : Exécution

`dirent.path` est obsolète en raison de son manque d’uniformité entre les différentes lignes de publication. Veuillez utiliser [`dirent.parentPath`](/fr/nodejs/api/fs#direntparentpath) à la place.

### DEP0179 : Constructeur `Hash` {#dep0179-hash-constructor}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | Obsolescence d’exécution. |
| v21.5.0, v20.12.0 | Obsolescence de la documentation uniquement. |
:::

Type : Exécution

L’appel direct de la classe `Hash` avec `Hash()` ou `new Hash()` est obsolète car il s’agit d’éléments internes, non destinés à un usage public. Veuillez utiliser la méthode [`crypto.createHash()`](/fr/nodejs/api/crypto#cryptocreatehashalgorithm-options) pour créer des instances Hash.


### DEP0180 : Constructeur `fs.Stats` {#dep0180-fsstats-constructor}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | Dépréciation à l’exécution. |
| v20.13.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Exécution

L’appel direct de la classe `fs.Stats` avec `Stats()` ou `new Stats()` est déprécié car il s’agit d’éléments internes qui ne sont pas destinés à un usage public.

### DEP0181 : Constructeur `Hmac` {#dep0181-hmac-constructor}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | Dépréciation à l’exécution. |
| v20.13.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Exécution

L’appel direct de la classe `Hmac` avec `Hmac()` ou `new Hmac()` est déprécié car il s’agit d’éléments internes qui ne sont pas destinés à un usage public. Veuillez utiliser la méthode [`crypto.createHmac()`](/fr/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) pour créer des instances Hmac.

### DEP0182 : Balises d’authentification GCM courtes sans `authTagLength` explicite {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Dépréciation à l’exécution. |
| v20.13.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Exécution

Les applications qui souhaitent utiliser des balises d’authentification plus courtes que la longueur par défaut de la balise d’authentification doivent définir l’option `authTagLength` de la fonction [`crypto.createDecipheriv()`](/fr/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) sur la longueur appropriée.

Pour les chiffrements en mode GCM, la fonction [`decipher.setAuthTag()`](/fr/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) accepte les balises d’authentification de toute longueur valide (voir [DEP0090](/fr/nodejs/api/deprecations#DEP0090)). Ce comportement est déprécié afin de mieux s’aligner sur les recommandations de la norme [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf).

### DEP0183 : API basées sur le moteur OpenSSL {#dep0183-openssl-engine-based-apis}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Dépréciation uniquement dans la documentation. |
:::

Type : Uniquement documentation

OpenSSL 3 a déprécié la prise en charge des moteurs personnalisés et recommande de passer à son nouveau modèle de fournisseur. L’option `clientCertEngine` pour `https.request()`, [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) et [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) ; les `privateKeyEngine` et `privateKeyIdentifier` pour [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) ; et [`crypto.setEngine()`](/fr/nodejs/api/crypto#cryptosetengineengine-flags) dépendent toutes de cette fonctionnalité d’OpenSSL.


### DEP0184 : Instanciation des classes `node:zlib` sans `new` {#dep0184-instantiating-nodezlib-classes-without-new}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.9.0, v20.18.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

L'instanciation de classes sans le qualificateur `new` exporté par le module `node:zlib` est obsolète. Il est recommandé d'utiliser le qualificateur `new` à la place. Ceci s'applique à toutes les classes Zlib, telles que `Deflate`, `DeflateRaw`, `Gunzip`, `Inflate`, `InflateRaw`, `Unzip` et `Zlib`.

### DEP0185 : Instanciation des classes `node:repl` sans `new` {#dep0185-instantiating-noderepl-classes-without-new}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.9.0, v20.18.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

L'instanciation de classes sans le qualificateur `new` exporté par le module `node:repl` est obsolète. Il est recommandé d'utiliser le qualificateur `new` à la place. Ceci s'applique à toutes les classes REPL, y compris `REPLServer` et `Recoverable`.

### DEP0187 : Transmission de types d'arguments non valides à `fs.existsSync` {#dep0187-passing-invalid-argument-types-to-fsexistssync}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.4.0 | Documentation uniquement. |
:::

Type : Documentation uniquement

La transmission de types d'arguments non pris en charge est obsolète et, au lieu de renvoyer `false`, lèvera une erreur dans une version future.

### DEP0188 : `process.features.ipv6` et `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.4.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

Ces propriétés sont inconditionnellement `true`. Toutes les vérifications basées sur ces propriétés sont redondantes.

### DEP0189 : `process.features.tls_*` {#dep0189-processfeaturestls_*}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.4.0 | Dépréciation de la documentation uniquement. |
:::

Type : Documentation uniquement

`process.features.tls_alpn`, `process.features.tls_ocsp` et `process.features.tls_sni` sont obsolètes, car leurs valeurs sont garanties identiques à celles de `process.features.tls`.

