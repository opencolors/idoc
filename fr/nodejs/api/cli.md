---
title: Options de ligne de commande de Node.js
description: Cette page offre un guide complet des options de ligne de commande disponibles dans Node.js, expliquant comment utiliser divers drapeaux et arguments pour configurer l'environnement d'exécution, gérer le débogage et contrôler le comportement d'exécution.
head:
  - - meta
    - name: og:title
      content: Options de ligne de commande de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette page offre un guide complet des options de ligne de commande disponibles dans Node.js, expliquant comment utiliser divers drapeaux et arguments pour configurer l'environnement d'exécution, gérer le débogage et contrôler le comportement d'exécution.
  - - meta
    - name: twitter:title
      content: Options de ligne de commande de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette page offre un guide complet des options de ligne de commande disponibles dans Node.js, expliquant comment utiliser divers drapeaux et arguments pour configurer l'environnement d'exécution, gérer le débogage et contrôler le comportement d'exécution.
---


# API de ligne de commande {#command-line-api}

Node.js est fourni avec une variété d'options CLI. Ces options exposent le débogage intégré, plusieurs façons d'exécuter des scripts et d'autres options d'exécution utiles.

Pour consulter cette documentation sous forme de page de manuel dans un terminal, exécutez `man node`.

## Synopsis {#synopsis}

`node [options] [options V8] [\<point-d'entrée-du-programme\> | -e "script" | -] [--] [arguments]`

`node inspect [\<point-d'entrée-du-programme\> | -e "script" | \<hôte\>:\<port\>] …`

`node --v8-options`

Exécutez sans arguments pour démarrer le [REPL](/fr/nodejs/api/repl).

Pour plus d'informations sur `node inspect`, consultez la documentation du [débogueur](/fr/nodejs/api/debugger).

## Point d'entrée du programme {#program-entry-point}

Le point d'entrée du programme est une chaîne de caractères de type spécificateur. Si la chaîne n'est pas un chemin absolu, elle est résolue comme un chemin relatif à partir du répertoire de travail actuel. Ce chemin est ensuite résolu par le chargeur de modules [CommonJS](/fr/nodejs/api/modules). Si aucun fichier correspondant n'est trouvé, une erreur est levée.

Si un fichier est trouvé, son chemin sera transmis au [chargeur de modules ES](/fr/nodejs/api/packages#modules-loaders) dans l'une des conditions suivantes :

- Le programme a été démarré avec un indicateur de ligne de commande qui force le chargement du point d'entrée avec le chargeur de module ECMAScript, tel que `--import`.
- Le fichier a une extension `.mjs`.
- Le fichier n'a pas d'extension `.cjs` et le fichier `package.json` parent le plus proche contient un champ [`"type"`](/fr/nodejs/api/packages#type) de niveau supérieur avec une valeur de `"module"`.

Sinon, le fichier est chargé à l'aide du chargeur de modules CommonJS. Consultez [Chargeurs de modules](/fr/nodejs/api/packages#modules-loaders) pour plus de détails.

### Mise en garde concernant le point d'entrée du chargeur de modules ECMAScript {#ecmascript-modules-loader-entry-point-caveat}

Lors du chargement, le [chargeur de modules ES](/fr/nodejs/api/packages#modules-loaders) charge le point d'entrée du programme, la commande `node` n'acceptera en entrée que les fichiers avec les extensions `.js`, `.mjs` ou `.cjs` ; et avec les extensions `.wasm` lorsque [`--experimental-wasm-modules`](/fr/nodejs/api/cli#--experimental-wasm-modules) est activé.

## Options {#options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.12.0 | Les underscores au lieu des tirets sont désormais autorisés pour les options Node.js, en plus des options V8. |
:::

Toutes les options, y compris les options V8, permettent de séparer les mots par des tirets (`-`) ou des underscores (`_`). Par exemple, `--pending-deprecation` est équivalent à `--pending_deprecation`.

Si une option qui prend une seule valeur (telle que `--max-http-header-size`) est passée plusieurs fois, la dernière valeur passée est utilisée. Les options de la ligne de commande sont prioritaires sur les options passées via la variable d'environnement [`NODE_OPTIONS`](/fr/nodejs/api/cli#node_optionsoptions).


### `-` {#-}

**Ajouté dans : v8.0.0**

Alias pour stdin. Analogue à l'utilisation de `-` dans d'autres utilitaires de ligne de commande, ce qui signifie que le script est lu depuis stdin, et le reste des options sont passées à ce script.

### `--` {#--}

**Ajouté dans : v6.11.0**

Indique la fin des options de node. Passe le reste des arguments au script. Si aucun nom de fichier de script ou script eval/print n'est fourni avant cela, alors l'argument suivant est utilisé comme nom de fichier de script.

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**Ajouté dans : v0.10.8**

L'abandon au lieu de la sortie entraîne la génération d'un fichier core pour l'analyse post-mortem à l'aide d'un débogueur (tel que `lldb`, `gdb` et `mdb`).

Si cet indicateur est passé, le comportement peut toujours être défini pour ne pas abandonner via [`process.setUncaughtExceptionCaptureCallback()`](/fr/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) (et via l'utilisation du module `node:domain` qui l'utilise).

### `--allow-addons` {#--allow-addons}

**Ajouté dans : v21.6.0, v20.12.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Lors de l'utilisation du [Modèle d'autorisations](/fr/nodejs/api/permissions#permission-model), le processus ne pourra pas utiliser les modules complémentaires natifs par défaut. Les tentatives de le faire lèveront une `ERR_DLOPEN_DISABLED` à moins que l'utilisateur ne passe explicitement l'indicateur `--allow-addons` au démarrage de Node.js.

Exemple :

```js [CJS]
// Tentative d'exiger un module complémentaire natif
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

**Ajouté dans : v20.0.0**

::: warning [Stable: 1 - Experimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stable : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Lors de l'utilisation du [modèle d'autorisations](/fr/nodejs/api/permissions#permission-model), le processus ne pourra pas créer de processus enfant par défaut. Les tentatives de le faire lèveront une erreur `ERR_ACCESS_DENIED` à moins que l'utilisateur ne transmette explicitement l'indicateur `--allow-child-process` lors du démarrage de Node.js.

Exemple :

```js [ESM]
const childProcess = require('node:child_process');
// Tentative de contournement de l'autorisation
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


::: info [History]
| Version | Modifications |
| --- | --- |
| v23.5.0 | Le modèle d'autorisations et les indicateurs --allow-fs sont stables. |
| v20.7.0 | Les chemins délimités par une virgule (`,`) ne sont plus autorisés. |
| v20.0.0 | Ajouté dans : v20.0.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stable : 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Cet indicateur configure les autorisations de lecture du système de fichiers à l'aide du [modèle d'autorisations](/fr/nodejs/api/permissions#permission-model).

Les arguments valides pour l'indicateur `--allow-fs-read` sont :

- `*` : pour autoriser toutes les opérations `FileSystemRead`.
- Plusieurs chemins peuvent être autorisés à l'aide de plusieurs indicateurs `--allow-fs-read`. Exemple : `--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

Des exemples sont disponibles dans la documentation [Autorisations du système de fichiers](/fr/nodejs/api/permissions#file-system-permissions).

Le module d'initialisation doit également être autorisé. Considérez l'exemple suivant :

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
Le processus doit avoir accès au module `index.js` :

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | Le modèle d'autorisations et les flags --allow-fs sont stables. |
| v20.7.0 | Les chemins délimités par une virgule (`,`) ne sont plus autorisés. |
| v20.0.0 | Ajouté dans : v20.0.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Ce flag configure les autorisations d'écriture du système de fichiers à l'aide du [Modèle d'autorisations](/fr/nodejs/api/permissions#permission-model).

Les arguments valides pour le flag `--allow-fs-write` sont :

- `*` - Pour autoriser toutes les opérations `FileSystemWrite`.
- Plusieurs chemins peuvent être autorisés en utilisant plusieurs flags `--allow-fs-write`. Exemple : `--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

Les chemins délimités par une virgule (`,`) ne sont plus autorisés. Lorsqu'un seul flag est passé avec une virgule, un avertissement sera affiché.

Des exemples peuvent être trouvés dans la documentation [Autorisations du système de fichiers](/fr/nodejs/api/permissions#file-system-permissions).

### `--allow-wasi` {#--allow-wasi}

**Ajouté dans : v22.3.0, v20.16.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Lors de l'utilisation du [Modèle d'autorisations](/fr/nodejs/api/permissions#permission-model), le processus ne sera pas capable de créer des instances WASI par défaut. Pour des raisons de sécurité, l'appel lèvera une erreur `ERR_ACCESS_DENIED` à moins que l'utilisateur ne passe explicitement le flag `--allow-wasi` dans le processus Node.js principal.

Exemple :

```js [ESM]
const { WASI } = require('node:wasi');
// Tentative de contournement de l'autorisation
new WASI({
  version: 'preview1',
  // Tentative de montage de l'ensemble du système de fichiers
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

**Ajouté dans : v20.0.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Lors de l'utilisation du [Modèle d'autorisations](/fr/nodejs/api/permissions#permission-model), le processus ne pourra pas créer de threads worker par défaut. Pour des raisons de sécurité, l'appel lèvera une erreur `ERR_ACCESS_DENIED` à moins que l'utilisateur ne passe explicitement le flag `--allow-worker` dans le processus Node.js principal.

Exemple :

```js [ESM]
const { Worker } = require('node:worker_threads');
// Tentative de contournement de l'autorisation
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

**Ajouté dans : v18.8.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Génère un blob d'instantané lorsque le processus se termine et l'écrit sur le disque, qui peut être chargé ultérieurement avec `--snapshot-blob`.

Lors de la création de l'instantané, si `--snapshot-blob` n'est pas spécifié, le blob généré sera écrit, par défaut, dans `snapshot.blob` dans le répertoire de travail actuel. Sinon, il sera écrit dans le chemin spécifié par `--snapshot-blob`.

```bash [BASH]
$ echo "globalThis.foo = 'Je viens de l'instantané'" > snapshot.js

# Exécutez snapshot.js pour initialiser l'application et enregistrer l'état {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# dans snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Chargez l'instantané généré et démarrez l'application depuis index.js. {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
Je viens de l'instantané
```
L'API [`v8.startupSnapshot`](/fr/nodejs/api/v8#startup-snapshot-api) peut être utilisée pour spécifier un point d'entrée au moment de la création de l'instantané, évitant ainsi le besoin d'un script d'entrée supplémentaire au moment de la désérialisation :

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('Je viens de l'instantané'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
Je viens de l'instantané
```
Pour plus d'informations, consultez la documentation de l'API [`v8.startupSnapshot`](/fr/nodejs/api/v8#startup-snapshot-api).

Actuellement, la prise en charge de l'instantané d'exécution est expérimentale dans la mesure où :

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**Ajouté dans : v21.6.0, v20.12.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Spécifie le chemin d'accès à un fichier de configuration JSON qui configure le comportement de création d'instantanés.

Les options suivantes sont actuellement prises en charge :

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Requis. Fournit le nom du script exécuté avant la création de l'instantané, comme si [`--build-snapshot`](/fr/nodejs/api/cli#--build-snapshot) avait été transmis avec `builder` comme nom de script principal.
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Facultatif. L'inclusion du cache de code réduit le temps passé à compiler les fonctions incluses dans l'instantané au prix d'une taille d'instantané plus importante et potentiellement de la rupture de la portabilité de l'instantané.

Lors de l'utilisation de cet indicateur, les fichiers de script supplémentaires fournis sur la ligne de commande ne seront pas exécutés et seront plutôt interprétés comme des arguments de ligne de commande réguliers.


### `-c`, `--check` {#--build-snapshot-config}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L'option `--require` est désormais prise en charge lors de la vérification d'un fichier. |
| v5.0.0, v4.2.0 | Ajouté dans : v5.0.0, v4.2.0 |
:::

Vérifie la syntaxe du script sans l'exécuter.

### `--completion-bash` {#-c---check}

**Ajouté dans : v10.12.0**

Affiche le script de complétion bash sourçable pour Node.js.

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.9.0, v20.18.0 | L'indicateur n'est plus expérimental. |
| v14.9.0, v12.19.0 | Ajouté dans : v14.9.0, v12.19.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Fournit des conditions de résolution [d'exports conditionnels](/fr/nodejs/api/packages#conditional-exports) personnalisées.

N'importe quel nombre de noms de condition de chaîne personnalisés est autorisé.

Les conditions Node.js par défaut de `"node"`, `"default"`, `"import"` et `"require"` s'appliqueront toujours comme défini.

Par exemple, pour exécuter un module avec des résolutions "development" :

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Les indicateurs `--cpu-prof` sont désormais stables. |
| v12.0.0 | Ajouté dans : v12.0.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Démarre le profileur CPU V8 au démarrage et écrit le profil CPU sur le disque avant de quitter.

Si `--cpu-prof-dir` n'est pas spécifié, le profil généré est placé dans le répertoire de travail actuel.

Si `--cpu-prof-name` n'est pas spécifié, le profil généré est nommé `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`.

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Les indicateurs `--cpu-prof` sont désormais stables. |
| v12.0.0 | Ajouté dans : v12.0.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Spécifie le répertoire où les profils CPU générés par `--cpu-prof` seront placés.

La valeur par défaut est contrôlée par l'option de ligne de commande [`--diagnostic-dir`](/fr/nodejs/api/cli#--diagnostic-dirdirectory).


### `--cpu-prof-interval` {#--cpu-prof-dir}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Les indicateurs `--cpu-prof` sont maintenant stables. |
| v12.2.0 | Ajouté dans : v12.2.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Spécifie l'intervalle d'échantillonnage en microsecondes pour les profils CPU générés par `--cpu-prof`. La valeur par défaut est de 1 000 microsecondes.

### `--cpu-prof-name` {#--cpu-prof-interval}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Les indicateurs `--cpu-prof` sont maintenant stables. |
| v12.0.0 | Ajouté dans : v12.0.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Spécifie le nom de fichier du profil CPU généré par `--cpu-prof`.

### `--diagnostic-dir=directory` {#--cpu-prof-name}

Définit le répertoire dans lequel tous les fichiers de sortie de diagnostic sont écrits. Par défaut, il s'agit du répertoire de travail actuel.

Affecte le répertoire de sortie par défaut de :

- [`--cpu-prof-dir`](/fr/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/fr/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/fr/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**Ajouté dans : v13.12.0, v12.17.0**

Désactive la propriété `Object.prototype.__proto__`. Si `mode` est `delete`, la propriété est entièrement supprimée. Si `mode` est `throw`, les accès à la propriété lèvent une exception avec le code `ERR_PROTO_ACCESS`.

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

**Ajouté dans : v21.3.0, v20.11.0**

Désactive les avertissements de processus spécifiques par `code` ou `type`.

Les avertissements émis depuis [`process.emitWarning()`](/fr/nodejs/api/process#processemitwarningwarning-options) peuvent contenir un `code` et un `type`. Cette option empêchera l'émission d'avertissements ayant un `code` ou un `type` correspondant.

Liste des [avertissements de dépréciation](/fr/nodejs/api/deprecations#list-of-deprecated-apis).

Les types d'avertissement du noyau Node.js sont les suivants : `DeprecationWarning` et `ExperimentalWarning`.

Par exemple, le script suivant n'émettra pas [DEP0025 `require('node:sys')`](/fr/nodejs/api/deprecations#dep0025-requirenodesys) lorsqu'il est exécuté avec `node --disable-warning=DEP0025` :

::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

Par exemple, le script suivant émettra [DEP0025 `require('node:sys')`](/fr/nodejs/api/deprecations#dep0025-requirenodesys), mais pas d'avertissements expérimentaux (tels que [ExperimentalWarning : `vm.measureMemory` est une fonctionnalité expérimentale](/fr/nodejs/api/vm#vmmeasurememoryoptions) dans <=v21) lorsqu'il est exécuté avec `node --disable-warning=ExperimentalWarning` :

::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**Ajouté dans : v22.2.0, v20.15.0**

Par défaut, Node.js active les vérifications de limites WebAssembly basées sur le gestionnaire de pièges. Par conséquent, V8 n'a pas besoin d'insérer des vérifications de limites en ligne dans le code compilé à partir de WebAssembly, ce qui peut accélérer considérablement l'exécution de WebAssembly, mais cette optimisation nécessite l'allocation d'une grande cage de mémoire virtuelle (actuellement 10 Go). Si le processus Node.js n'a pas accès à un espace d'adressage de mémoire virtuelle suffisamment grand en raison de configurations système ou de limitations matérielles, les utilisateurs ne pourront pas exécuter de WebAssembly impliquant une allocation dans cette cage de mémoire virtuelle et verront une erreur de mémoire insuffisante.

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

`--disable-wasm-trap-handler` désactive cette optimisation afin que les utilisateurs puissent au moins exécuter WebAssembly (avec des performances moins optimales) lorsque l'espace d'adressage de mémoire virtuelle disponible pour leur processus Node.js est inférieur à ce dont la cage de mémoire V8 WebAssembly a besoin.

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**Ajouté dans : v9.8.0**

Fait en sorte que les fonctionnalités linguistiques intégrées comme `eval` et `new Function` qui génèrent du code à partir de chaînes lèvent une exception à la place. Cela n'affecte pas le module Node.js `node:vm`.

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first` est maintenant pris en charge. |
| v17.0.0 | Valeur par défaut modifiée à `verbatim`. |
| v16.4.0, v14.18.0 | Ajouté dans : v16.4.0, v14.18.0 |
:::

Définit la valeur par défaut de `order` dans [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) et [`dnsPromises.lookup()`](/fr/nodejs/api/dns#dnspromiseslookuphostname-options). La valeur peut être :

- `ipv4first` : définit la valeur par défaut de `order` sur `ipv4first`.
- `ipv6first` : définit la valeur par défaut de `order` sur `ipv6first`.
- `verbatim` : définit la valeur par défaut de `order` sur `verbatim`.

La valeur par défaut est `verbatim` et [`dns.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnssetdefaultresultorderorder) a une priorité plus élevée que `--dns-result-order`.


### `--enable-fips` {#--dns-result-order=order}

**Ajouté dans : v6.0.0**

Active le cryptage compatible FIPS au démarrage. (Nécessite que Node.js soit construit avec OpenSSL compatible FIPS.)

### `--enable-network-family-autoselection` {#--enable-fips}

**Ajouté dans : v18.18.0**

Active l’algorithme de sélection automatique de famille, sauf si les options de connexion le désactivent explicitement.

### `--enable-source-maps` {#--enable-network-family-autoselection}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.11.0, v14.18.0 | Cette API n’est plus expérimentale. |
| v12.12.0 | Ajouté dans : v12.12.0 |
:::

Active la prise en charge de [Source Map v3](https://sourcemaps.info/spec) pour les traces de pile.

Lorsque vous utilisez un transpileur, tel que TypeScript, les traces de pile générées par une application font référence au code transpilé, et non à la position de la source d’origine. L’option `--enable-source-maps` permet la mise en cache des cartes de sources et fait de son mieux pour signaler les traces de pile par rapport au fichier source d’origine.

La substitution de `Error.prepareStackTrace` peut empêcher `--enable-source-maps` de modifier la trace de pile. Appelez et renvoyez les résultats de la fonction `Error.prepareStackTrace` d’origine dans la fonction de substitution pour modifier la trace de pile avec les cartes de sources.

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Modifier l’erreur et la trace et formater la trace de pile avec
  // Error.prepareStackTrace d’origine.
  return originalPrepareStackTrace(error, trace);
};
```
Notez que l’activation des cartes de sources peut introduire une latence dans votre application lorsque `Error.stack` est accédé. Si vous accédez fréquemment à `Error.stack` dans votre application, tenez compte des implications de performance de `--enable-source-maps`.

### `--entry-url` {#--enable-source-maps}

**Ajouté dans : v23.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Lorsqu’il est présent, Node.js interprétera le point d’entrée comme une URL, plutôt que comme un chemin.

Suit les règles de résolution des [modules ECMAScript](/fr/nodejs/api/esm#modules-ecmascript-modules).

Tout paramètre de requête ou hachage dans l’URL sera accessible via [`import.meta.url`](/fr/nodejs/api/esm#importmetaurl).

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**Ajouté dans : v22.9.0**

Le comportement est le même que [`--env-file`](/fr/nodejs/api/cli#--env-fileconfig), mais une erreur n'est pas levée si le fichier n'existe pas.

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.7.0, v20.12.0 | Ajout de la prise en charge des valeurs multilignes. |
| v20.6.0 | Ajouté dans : v20.6.0 |
:::

Charge les variables d'environnement à partir d'un fichier relatif au répertoire courant, les rendant disponibles aux applications sur `process.env`. Les [variables d'environnement qui configurent Node.js](/fr/nodejs/api/cli#environment-variables), telles que `NODE_OPTIONS`, sont analysées et appliquées. Si la même variable est définie dans l'environnement et dans le fichier, la valeur de l'environnement est prioritaire.

Vous pouvez transmettre plusieurs arguments `--env-file`. Les fichiers suivants remplacent les variables préexistantes définies dans les fichiers précédents.

Une erreur est levée si le fichier n'existe pas.

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
Le format du fichier doit être d'une ligne par paire clé-valeur de nom et de valeur de variable d'environnement séparées par `=`:

```text [TEXT]
PORT=3000
```
Tout texte après un `#` est traité comme un commentaire :

```text [TEXT]
# Ceci est un commentaire {#--env-file=config}
PORT=3000 # Ceci est également un commentaire
```
Les valeurs peuvent commencer et se terminer par les guillemets suivants : ```, `"` ou `'`. Ils sont omis des valeurs.

```text [TEXT]
USERNAME="nodejs" # aura pour résultat `nodejs` comme valeur.
```
Les valeurs multilignes sont prises en charge :

```text [TEXT]
MULTI_LINE="CECI EST
UNE MULTILIGNE"
# aura pour résultat `CECI EST\nUNE MULTILIGNE` comme valeur. {#this-is-a-comment}
```
Le mot clé Export avant une clé est ignoré :

```text [TEXT]
export USERNAME="nodejs" # aura pour résultat `nodejs` comme valeur.
```
Si vous souhaitez charger des variables d'environnement à partir d'un fichier qui peut ne pas exister, vous pouvez utiliser l'indicateur [`--env-file-if-exists`](/fr/nodejs/api/cli#--env-file-if-existsconfig) à la place.


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.6.0 | Eval prend désormais en charge la suppression expérimentale des types. |
| v5.11.0 | Les bibliothèques intégrées sont désormais disponibles en tant que variables prédéfinies. |
| v0.5.2 | Ajouté dans : v0.5.2 |
:::

Évalue l’argument suivant en tant que JavaScript. Les modules prédéfinis dans le REPL peuvent également être utilisés dans `script`.

Sous Windows, avec `cmd.exe`, un guillemet simple ne fonctionnera pas correctement car il ne reconnaît que les guillemets doubles `"` pour la citation. Dans Powershell ou Git Bash, `'` et `"` sont utilisables.

Il est possible d’exécuter du code contenant des types en ligne en passant [`--experimental-strip-types`](/fr/nodejs/api/cli#--experimental-strip-types).

### `--experimental-async-context-frame` {#-e---eval-"script"}

**Ajouté dans : v22.7.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Active l'utilisation de [`AsyncLocalStorage`](/fr/nodejs/api/async_context#class-asynclocalstorage) soutenu par `AsyncContextFrame` plutôt que l'implémentation par défaut qui repose sur async_hooks. Ce nouveau modèle est mis en œuvre de manière très différente et pourrait donc avoir des différences dans la façon dont les données de contexte circulent au sein de l'application. En tant que tel, il est actuellement recommandé de s'assurer que le comportement de votre application n'est pas affecté par ce changement avant de l'utiliser en production.

### `--experimental-eventsource` {#--experimental-async-context-frame}

**Ajouté dans : v22.3.0, v20.18.0**

Active l'exposition de [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) dans la portée globale.

### `--experimental-import-meta-resolve` {#--experimental-eventsource}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.6.0, v18.19.0 | import.meta.resolve synchrone disponible par défaut, avec l'indicateur conservé pour activer le deuxième argument expérimental tel que pris en charge précédemment. |
| v13.9.0, v12.16.2 | Ajouté dans : v13.9.0, v12.16.2 |
:::

Active la prise en charge expérimentale de l’URL parent de `import.meta.resolve()`, qui permet de passer un deuxième argument `parentURL` pour la résolution contextuelle.

Auparavant, contrôlait l’ensemble de la fonctionnalité `import.meta.resolve`.


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.11.1 | Ce drapeau a été renommé de `--loader` à `--experimental-loader`. |
| v8.8.0 | Ajouté dans : v8.8.0 |
:::

Spécifie le `module` contenant les [points d'ancrage de personnalisation de module](/fr/nodejs/api/module#customization-hooks) exportés. `module` peut être n'importe quelle chaîne acceptée comme un [spécificateur `import`](/fr/nodejs/api/esm#import-specifiers).

### `--experimental-network-inspection` {#--experimental-loader=module}

**Ajouté dans : v22.6.0, v20.18.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Active la prise en charge expérimentale de l'inspection du réseau avec Chrome DevTools.

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**Ajouté dans : v22.0.0, v20.17.0**

Si le module ES qui est `require()`d contient `await` de niveau supérieur, ce drapeau permet à Node.js d'évaluer le module, d'essayer de localiser les await de niveau supérieur et d'imprimer leur emplacement pour aider les utilisateurs à les trouver.

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Ceci est maintenant vrai par défaut. |
| v22.0.0, v20.17.0 | Ajouté dans : v22.0.0, v20.17.0 |
:::

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Développement Actif
:::

Prend en charge le chargement d'un graphe de module ES synchrone dans `require()`.

Voir [Chargement des modules ECMAScript en utilisant `require()`](/fr/nodejs/api/modules#loading-ecmascript-modules-using-require).

### `--experimental-sea-config` {#--experimental-require-module}

**Ajouté dans : v20.0.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Utilisez ce drapeau pour générer un blob qui peut être injecté dans le binaire Node.js pour produire une [application exécutable unique](/fr/nodejs/api/single-executable-applications). Consultez la documentation concernant [cette configuration](/fr/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs) pour plus de détails.


### `--experimental-shadow-realm` {#--experimental-sea-config}

**Ajouté dans : v19.0.0, v18.13.0**

Utilisez cet indicateur pour activer la prise en charge de [ShadowRealm](https://github.com/tc39/proposal-shadowrealm).

### `--experimental-strip-types` {#--experimental-shadow-realm}

**Ajouté dans : v22.6.0**

::: warning [Stable: 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Active la suppression expérimentale des types pour les fichiers TypeScript. Pour plus d'informations, consultez la documentation sur la [suppression des types TypeScript](/fr/nodejs/api/typescript#type-stripping).

### `--experimental-test-coverage` {#--experimental-strip-types}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0, v18.17.0 | Cette option peut être utilisée avec `--test`. |
| v19.7.0, v18.15.0 | Ajouté dans : v19.7.0, v18.15.0 |
:::

Lorsqu'elle est utilisée conjointement avec le module `node:test`, un rapport de couverture de code est généré dans le cadre de la sortie de l'exécuteur de tests. Si aucun test n'est exécuté, aucun rapport de couverture n'est généré. Consultez la documentation sur la [collecte de la couverture de code à partir des tests](/fr/nodejs/api/test#collecting-code-coverage) pour plus de détails.

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**Ajouté dans : v22.8.0**

::: warning [Stable: 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

Configure le type d'isolation de test utilisé dans l'exécuteur de tests. Lorsque `mode` est `'process'`, chaque fichier de test est exécuté dans un processus enfant distinct. Lorsque `mode` est `'none'`, tous les fichiers de test s'exécutent dans le même processus que l'exécuteur de tests. Le mode d'isolation par défaut est `'process'`. Cet indicateur est ignoré si l'indicateur `--test` n'est pas présent. Consultez la section [modèle d'exécution de l'exécuteur de tests](/fr/nodejs/api/test#test-runner-execution-model) pour plus d'informations.

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**Ajouté dans : v22.3.0, v20.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).0 - Développement précoce
:::

Active la simulation de module dans l'exécuteur de tests.


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**Ajouté dans : v22.7.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stability : 1](/fr/nodejs/api/documentation#stability-index) - Développement actif
:::

Active la transformation de la syntaxe TypeScript uniquement en code JavaScript. Implique `--experimental-strip-types` et `--enable-source-maps`.

### `--experimental-vm-modules` {#--experimental-transform-types}

**Ajouté dans : v9.6.0**

Active la prise en charge expérimentale des modules ES dans le module `node:vm`.

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0, v18.17.0 | Cette option n'est plus requise, car WASI est activé par défaut, mais elle peut toujours être transmise. |
| v13.6.0 | est passé de `--experimental-wasi-unstable-preview0` à `--experimental-wasi-unstable-preview1`. |
| v13.3.0, v12.16.0 | Ajouté dans : v13.3.0, v12.16.0 |
:::

Active la prise en charge expérimentale de l'interface système WebAssembly (WASI).

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**Ajouté dans : v12.3.0**

Active la prise en charge expérimentale des modules WebAssembly.

### `--experimental-webstorage` {#--experimental-wasm-modules}

**Ajouté dans : v22.4.0**

Active la prise en charge expérimentale de [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

### `--expose-gc` {#--experimental-webstorage}

**Ajouté dans : v22.3.0, v20.18.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stability : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental. Ce drapeau est hérité de V8 et peut être modifié en amont.
:::

Ce drapeau exposera l'extension gc de V8.

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**Ajouté dans : v12.12.0**

Désactive le chargement des modules complémentaires natifs qui ne sont pas [sensibles au contexte](/fr/nodejs/api/addons#context-aware-addons).

### `--force-fips` {#--force-context-aware}

**Ajouté dans : v6.0.0**

Force la crypto conforme à la norme FIPS au démarrage. (Ne peut pas être désactivé à partir du code de script.) (Mêmes exigences que `--enable-fips`.)

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**Ajouté dans : v18.3.0, v16.17.0**

Applique l'événement `uncaughtException` sur les rappels asynchrones Node-API.

Pour éviter qu'un module complémentaire existant ne fasse planter le processus, cet indicateur n'est pas activé par défaut. À l'avenir, cet indicateur sera activé par défaut pour appliquer le comportement correct.


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**Ajouté dans : v11.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Active les intrinsèques figées expérimentales telles que `Array` et `Object`.

Seul le contexte racine est pris en charge. Il n'y a aucune garantie que `globalThis.Array` soit bien la référence intrinsèque par défaut. Le code peut se casser sous cet indicateur.

Pour permettre l'ajout de polyfills, [`--require`](/fr/nodejs/api/cli#-r---require-module) et [`--import`](/fr/nodejs/api/cli#--importmodule) s'exécutent tous les deux avant de figer les intrinsèques.

### `--heap-prof` {#--frozen-intrinsics}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Les indicateurs `--heap-prof` sont désormais stables. |
| v12.4.0 | Ajouté dans : v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stable: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Démarre le profileur de tas V8 au démarrage et écrit le profil de tas sur le disque avant de quitter.

Si `--heap-prof-dir` n'est pas spécifié, le profil généré est placé dans le répertoire de travail actuel.

Si `--heap-prof-name` n'est pas spécifié, le profil généré est nommé `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`.

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```

### `--heap-prof-dir` {#--heap-prof}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Les indicateurs `--heap-prof` sont désormais stables. |
| v12.4.0 | Ajouté dans : v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stable: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Spécifie le répertoire où les profils de tas générés par `--heap-prof` seront placés.

La valeur par défaut est contrôlée par l'option de ligne de commande [`--diagnostic-dir`](/fr/nodejs/api/cli#--diagnostic-dirdirectory).

### `--heap-prof-interval` {#--heap-prof-dir}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Les indicateurs `--heap-prof` sont désormais stables. |
| v12.4.0 | Ajouté dans : v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stable: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Spécifie l'intervalle d'échantillonnage moyen en octets pour les profils de tas générés par `--heap-prof`. La valeur par défaut est de 512 * 1024 octets.


### `--heap-prof-name` {#--heap-prof-interval}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Les options `--heap-prof` sont désormais stables. |
| v12.4.0 | Ajouté dans : v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Spécifie le nom de fichier du profil de tas généré par `--heap-prof`.

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**Ajouté dans : v15.1.0, v14.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Écrit un instantané de tas V8 sur le disque lorsque l'utilisation du tas V8 approche de la limite du tas. `count` doit être un entier non négatif (dans ce cas, Node.js n'écrira pas plus de `max_count` instantanés sur le disque).

Lors de la génération d'instantanés, le garbage collection peut être déclenché et faire baisser l'utilisation du tas. Par conséquent, plusieurs instantanés peuvent être écrits sur le disque avant que l'instance Node.js ne manque finalement de mémoire. Ces instantanés de tas peuvent être comparés pour déterminer quels objets sont alloués pendant la période où des instantanés consécutifs sont pris. Il n'est pas garanti que Node.js écrira exactement `max_count` instantanés sur le disque, mais il fera de son mieux pour en générer au moins un et jusqu'à `max_count` instantanés avant que l'instance Node.js ne manque de mémoire lorsque `max_count` est supérieur à `0`.

La génération d'instantanés V8 prend du temps et de la mémoire (à la fois de la mémoire gérée par le tas V8 et de la mémoire native en dehors du tas V8). Plus le tas est grand, plus il a besoin de ressources. Node.js ajustera le tas V8 pour tenir compte de la surcharge de mémoire du tas V8 supplémentaire et fera de son mieux pour éviter d'utiliser toute la mémoire disponible pour le processus. Lorsque le processus utilise plus de mémoire que le système ne le juge approprié, le processus peut être interrompu brusquement par le système, en fonction de la configuration du système.

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

**Ajouté dans : v12.0.0**

Active un gestionnaire de signal qui amène le processus Node.js à écrire un vidage de tas lorsque le signal spécifié est reçu. `signal` doit être un nom de signal valide. Désactivé par défaut.

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

**Ajouté dans : v0.1.3**

Affiche les options de ligne de commande de node. La sortie de cette option est moins détaillée que ce document.

### `--icu-data-dir=file` {#-h---help}

**Ajouté dans : v0.11.15**

Spécifie le chemin de chargement des données ICU. (Remplace `NODE_ICU_DATA`.)

### `--import=module` {#--icu-data-dir=file}

**Ajouté dans : v19.0.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Précharger le module spécifié au démarrage. Si l'indicateur est fourni plusieurs fois, chaque module sera exécuté séquentiellement dans l'ordre dans lequel il apparaît, en commençant par ceux fournis dans [`NODE_OPTIONS`](/fr/nodejs/api/cli#node_optionsoptions).

Suit les règles de résolution du [module ECMAScript](/fr/nodejs/api/esm#modules-ecmascript-modules). Utilisez [`--require`](/fr/nodejs/api/cli#-r---require-module) pour charger un [module CommonJS](/fr/nodejs/api/modules). Les modules préchargés avec `--require` s'exécuteront avant les modules préchargés avec `--import`.

Les modules sont préchargés dans le thread principal ainsi que dans tous les threads de travail, les processus dérivés ou les processus regroupés.

### `--input-type=type` {#--import=module}

**Ajouté dans : v12.0.0**

Ceci configure Node.js pour interpréter l'entrée `--eval` ou `STDIN` comme CommonJS ou comme un module ES. Les valeurs valides sont `"commonjs"` ou `"module"`. La valeur par défaut est `"commonjs"`.

Le REPL ne prend pas en charge cette option. L'utilisation de `--input-type=module` avec [`--print`](/fr/nodejs/api/cli#-p---print-script) générera une erreur, car `--print` ne prend pas en charge la syntaxe des modules ES.


### `--insecure-http-parser` {#--input-type=type}

**Ajouté dans : v13.4.0, v12.15.0, v10.19.0**

Active les indicateurs de tolérance sur l'analyseur HTTP. Cela peut permettre l'interopérabilité avec des implémentations HTTP non conformes.

Lorsqu'il est activé, l'analyseur accepte les éléments suivants :

- Valeurs d'en-têtes HTTP invalides.
- Versions HTTP invalides.
- Autoriser les messages contenant à la fois les en-têtes `Transfer-Encoding` et `Content-Length`.
- Autoriser les données supplémentaires après le message lorsque `Connection: close` est présent.
- Autoriser des encodages de transfert supplémentaires après que `chunked` ait été fourni.
- Autoriser `\n` à être utilisé comme séparateur de jetons au lieu de `\r\n`.
- Autoriser `\r\n` à ne pas être fourni après un bloc.
- Autoriser les espaces à être présents après une taille de bloc et avant `\r\n`.

Tout ce qui précède exposera votre application à une attaque de dissimulation ou d'empoisonnement de requête. Évitez d'utiliser cette option.

#### Avertissement : lier l'inspecteur à une combinaison IP :port publique est dangereux {#--insecure-http-parser}

Lier l'inspecteur à une IP publique (y compris `0.0.0.0`) avec un port ouvert est dangereux, car cela permet à des hôtes externes de se connecter à l'inspecteur et d'effectuer une attaque d'[exécution de code à distance](https://www.owasp.org/index.php/Code_Injection).

Si vous spécifiez un hôte, assurez-vous que :

- L'hôte n'est pas accessible depuis les réseaux publics.
- Un pare-feu interdit les connexions indésirables sur le port.

**Plus précisément, <code>--inspect=0.0.0.0</code> est dangereux si le port (<code>9229</code> par
défaut) n'est pas protégé par un pare-feu.**

Consultez la section [implications de sécurité du débogage](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications) pour plus d'informations.

### `--inspect-brk[=[hôte :]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**Ajouté dans : v7.6.0**

Active l'inspecteur sur `hôte:port` et s'arrête au début du script utilisateur. La valeur par défaut de `hôte:port` est `127.0.0.1:9229`. Si le port `0` est spécifié, un port disponible aléatoire sera utilisé.

Consultez [Intégration de l'inspecteur V8 pour Node.js](/fr/nodejs/api/debugger#v8-inspector-integration-for-nodejs) pour plus d'explications sur le débogueur Node.js.

### `--inspect-port=[hôte :]port` {#--inspect-brk=hostport}

**Ajouté dans : v7.6.0**

Définit `hôte:port` à utiliser lorsque l'inspecteur est activé. Utile lors de l'activation de l'inspecteur en envoyant le signal `SIGUSR1`.

L'hôte par défaut est `127.0.0.1`. Si le port `0` est spécifié, un port disponible aléatoire sera utilisé.

Consultez l'[avertissement de sécurité](/fr/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) ci-dessous concernant l'utilisation du paramètre `hôte`.


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

Spécifie les façons d'exposer l'URL du websocket de l'inspecteur.

Par défaut, l'URL du websocket de l'inspecteur est disponible dans stderr et sous le point de terminaison `/json/list` sur `http://host:port/json/list`.

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**Ajouté dans : v22.2.0, v20.15.0**

Active l'inspecteur sur `host:port` et attend qu'un débogueur soit attaché. `host:port` par défaut est `127.0.0.1:9229`. Si le port `0` est spécifié, un port disponible aléatoire sera utilisé.

Voir [Intégration de V8 Inspector pour Node.js](/fr/nodejs/api/debugger#v8-inspector-integration-for-nodejs) pour plus d'explications sur le débogueur Node.js.

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**Ajouté dans : v6.3.0**

Active l'inspecteur sur `host:port`. La valeur par défaut est `127.0.0.1:9229`. Si le port `0` est spécifié, un port disponible aléatoire sera utilisé.

L'intégration de V8 Inspector permet à des outils tels que Chrome DevTools et les IDE de déboguer et de profiler les instances Node.js. Les outils se connectent aux instances Node.js via un port TCP et communiquent en utilisant le [protocole Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/). Voir [Intégration de V8 Inspector pour Node.js](/fr/nodejs/api/debugger#v8-inspector-integration-for-nodejs) pour plus d'explications sur le débogueur Node.js.

### `-i`, `--interactive` {#--inspect=hostport}

**Ajouté dans : v0.7.7**

Ouvre le REPL même si stdin ne semble pas être un terminal.

### `--jitless` {#-i---interactive}

**Ajouté dans : v12.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental. Cet indicateur est hérité de V8 et est sujet à modification en amont.
:::

Désactive [l'allocation en temps réel de la mémoire exécutable](https://v8.dev/blog/jitless). Ceci peut être requis sur certaines plateformes pour des raisons de sécurité. Cela peut aussi réduire la surface d'attaque sur d'autres plateformes, mais l'impact sur les performances peut être sévère.

### `--localstorage-file=file` {#--jitless}

**Ajouté dans : v22.4.0**

Le fichier utilisé pour stocker les données `localStorage`. Si le fichier n’existe pas, il est créé la première fois que `localStorage` est consulté. Le même fichier peut être partagé entre plusieurs processus Node.js simultanément. Cet indicateur est une opération sans effet, sauf si Node.js est démarré avec l’indicateur `--experimental-webstorage`.


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.13.0 | Modification de la taille maximale par défaut des en-têtes HTTP de 8 KiB à 16 KiB. |
| v11.6.0, v10.15.0 | Ajouté dans : v11.6.0, v10.15.0 |
:::

Spécifie la taille maximale, en octets, des en-têtes HTTP. La valeur par défaut est de 16 KiB.

### `--napi-modules` {#--max-http-header-size=size}

**Ajouté dans : v7.10.0**

Cette option est une opération nulle. Elle est conservée pour des raisons de compatibilité.

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**Ajouté dans : v22.1.0, v20.13.0**

Définit la valeur par défaut du délai d’attente de la tentative de sélection automatique de la famille de réseau. Pour plus d’informations, consultez [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/fr/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**Ajouté dans : v16.10.0, v14.19.0**

Désactive la condition d’exportation `node-addons` et désactive également le chargement des modules complémentaires natifs. Lorsque `--no-addons` est spécifié, l’appel de `process.dlopen` ou l’exigence d’un module complémentaire C++ natif échoueront et lèveront une exception.

### `--no-deprecation` {#--no-addons}

**Ajouté dans : v0.8.0**

Masque les avertissements de dépréciation.

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.7.0 | La détection de syntaxe est activée par défaut. |
| v21.1.0, v20.10.0 | Ajouté dans : v21.1.0, v20.10.0 |
:::

Désactive l’utilisation de la [détection de syntaxe](/fr/nodejs/api/packages#syntax-detection) pour déterminer le type de module.

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**Ajouté dans : v21.2.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Désactive l’exposition de l’[API Navigator](/fr/nodejs/api/globals#navigator) sur la portée globale.

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**Ajouté dans : v16.6.0**

Utilisez cet indicateur pour désactiver l’attente de niveau supérieur dans REPL.

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Ceci est maintenant faux par défaut. |
| v22.0.0, v20.17.0 | Ajouté dans : v22.0.0, v20.17.0 |
:::

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Désactive la prise en charge du chargement d’un graphe de module ES synchrone dans `require()`.

Voir [Chargement des modules ECMAScript en utilisant `require()`](/fr/nodejs/api/modules#loading-ecmascript-modules-using-require).


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [Historique]
| Version | Changements |
| --- | --- |
| v23.4.0 | SQLite n'est plus marqué comme expérimental, mais l'est toujours. |
| v22.5.0 | Ajouté dans : v22.5.0 |
:::

Désactive le module expérimental [`node:sqlite`](/fr/nodejs/api/sqlite).

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**Ajouté dans : v22.0.0**

Désactive l'exposition de [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) dans la portée globale.

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**Ajouté dans : v17.0.0**

Masque les informations supplémentaires sur une exception fatale qui provoque la sortie.

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**Ajouté dans : v9.0.0**

Désactive les vérifications d'exécution pour `async_hooks`. Celles-ci seront toujours activées dynamiquement lorsque `async_hooks` est activé.

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**Ajouté dans : v16.10.0**

Ne pas rechercher les modules dans les chemins globaux comme `$HOME/.node_modules` et `$NODE_PATH`.

### `--no-network-family-autoselection` {#--no-global-search-paths}


::: info [Historique]
| Version | Changements |
| --- | --- |
| v20.0.0 | Le drapeau a été renommé de `--no-enable-network-family-autoselection` à `--no-network-family-autoselection`. L'ancien nom peut toujours fonctionner comme un alias. |
| v19.4.0 | Ajouté dans : v19.4.0 |
:::

Désactive l'algorithme d'auto-sélection de la famille, sauf si les options de connexion l'activent explicitement.

### `--no-warnings` {#--no-network-family-autoselection}

**Ajouté dans : v6.0.0**

Masque tous les avertissements de processus (y compris les dépréciations).

### `--node-memory-debug` {#--no-warnings}

**Ajouté dans : v15.0.0, v14.18.0**

Active les vérifications de débogage supplémentaires pour les fuites de mémoire dans les internes de Node.js. Ceci n'est généralement utile qu'aux développeurs qui déboguent Node.js lui-même.

### `--openssl-config=file` {#--node-memory-debug}

**Ajouté dans : v6.9.0**

Charge un fichier de configuration OpenSSL au démarrage. Entre autres utilisations, cela peut être utilisé pour activer le chiffrement conforme à la norme FIPS si Node.js est construit contre OpenSSL compatible FIPS.

### `--openssl-legacy-provider` {#--openssl-config=file}

**Ajouté dans : v17.0.0, v16.17.0**

Active le fournisseur hérité OpenSSL 3.0. Pour plus d'informations, veuillez consulter [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy).

### `--openssl-shared-config` {#--openssl-legacy-provider}

**Ajouté dans : v18.5.0, v16.17.0, v14.21.0**

Active la section de configuration par défaut d'OpenSSL, `openssl_conf`, pour être lue à partir du fichier de configuration OpenSSL. Le fichier de configuration par défaut est nommé `openssl.cnf`, mais cela peut être modifié en utilisant la variable d'environnement `OPENSSL_CONF`, ou en utilisant l'option de ligne de commande `--openssl-config`. L'emplacement du fichier de configuration OpenSSL par défaut dépend de la manière dont OpenSSL est lié à Node.js. Le partage de la configuration OpenSSL peut avoir des implications indésirables et il est recommandé d'utiliser une section de configuration spécifique à Node.js qui est `nodejs_conf` et est par défaut lorsque cette option n'est pas utilisée.


### `--pending-deprecation` {#--openssl-shared-config}

**Ajouté dans : v8.0.0**

Émet des avertissements de dépréciation en attente.

Les dépréciations en attente sont généralement identiques à une dépréciation d'exécution, à la différence notable qu'elles sont désactivées par défaut et ne seront pas émises à moins que l'indicateur de ligne de commande `--pending-deprecation` ou la variable d'environnement `NODE_PENDING_DEPRECATION=1` ne soient définis. Les dépréciations en attente sont utilisées pour fournir une sorte de mécanisme d'« alerte précoce » sélectif que les développeurs peuvent exploiter pour détecter l'utilisation d'API dépréciées.

### `--permission` {#--pending-deprecation}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | Le modèle d'autorisation est maintenant stable. |
| v20.0.0 | Ajouté dans : v20.0.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Active le modèle d'autorisation pour le processus actuel. Lorsqu'il est activé, les autorisations suivantes sont restreintes :

- Système de fichiers - gérable via les indicateurs [`--allow-fs-read`](/fr/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/fr/nodejs/api/cli#--allow-fs-write)
- Processus enfant - gérable via l'indicateur [`--allow-child-process`](/fr/nodejs/api/cli#--allow-child-process)
- Threads de Worker - gérables via l'indicateur [`--allow-worker`](/fr/nodejs/api/cli#--allow-worker)
- WASI - gérable via l'indicateur [`--allow-wasi`](/fr/nodejs/api/cli#--allow-wasi)
- Addons - gérables via l'indicateur [`--allow-addons`](/fr/nodejs/api/cli#--allow-addons)

### `--preserve-symlinks` {#--permission}

**Ajouté dans : v6.3.0**

Indique au chargeur de modules de préserver les liens symboliques lors de la résolution et de la mise en cache des modules.

Par défaut, lorsque Node.js charge un module à partir d'un chemin d'accès qui est lié symboliquement à un emplacement de disque différent, Node.js déréférence le lien et utilise le « chemin réel » réel du module sur le disque à la fois comme identifiant et comme chemin racine pour localiser d'autres modules de dépendance. Dans la plupart des cas, ce comportement par défaut est acceptable. Cependant, lors de l'utilisation de dépendances homologues liées symboliquement, comme illustré dans l'exemple ci-dessous, le comportement par défaut provoque une exception si `moduleA` tente de require `moduleB` en tant que dépendance homologue :

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
L'indicateur de ligne de commande `--preserve-symlinks` indique à Node.js d'utiliser le chemin du lien symbolique pour les modules par opposition au chemin réel, ce qui permet de trouver les dépendances homologues liées symboliquement.

Notez, cependant, que l'utilisation de `--preserve-symlinks` peut avoir d'autres effets secondaires. Plus précisément, les modules *natifs* liés symboliquement peuvent ne pas se charger s'ils sont liés à partir de plusieurs emplacements dans l'arborescence des dépendances (Node.js les considérerait comme deux modules distincts et tenterait de charger le module plusieurs fois, ce qui provoquerait la levée d'une exception).

L'indicateur `--preserve-symlinks` ne s'applique pas au module principal, ce qui permet à `node --preserve-symlinks node_module/.bin/\<foo\>` de fonctionner. Pour appliquer le même comportement au module principal, utilisez également `--preserve-symlinks-main`.


### `--preserve-symlinks-main` {#--preserve-symlinks}

**Ajouté dans la version : v10.2.0**

Indique au chargeur de modules de conserver les liens symboliques lors de la résolution et de la mise en cache du module principal (`require.main`).

Cet indicateur existe pour que le module principal puisse être inclus dans le même comportement que `--preserve-symlinks` donne à toutes les autres importations ; ce sont des indicateurs distincts, cependant, pour assurer la rétrocompatibilité avec les anciennes versions de Node.js.

`--preserve-symlinks-main` n'implique pas `--preserve-symlinks` ; utilisez `--preserve-symlinks-main` en plus de `--preserve-symlinks` lorsqu'il n'est pas souhaitable de suivre les liens symboliques avant de résoudre les chemins relatifs.

Voir [`--preserve-symlinks`](/fr/nodejs/api/cli#--preserve-symlinks) pour plus d'informations.

### `-p`, `--print "script"` {#--preserve-symlinks-main}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.11.0 | Les bibliothèques intégrées sont désormais disponibles en tant que variables prédéfinies. |
| v0.6.4 | Ajouté dans la version : v0.6.4 |
:::

Identique à `-e` mais affiche le résultat.

### `--prof` {#-p---print-"script"}

**Ajouté dans la version : v2.0.0**

Générer une sortie de profileur V8.

### `--prof-process` {#--prof}

**Ajouté dans la version : v5.2.0**

Traiter la sortie du profileur V8 générée à l'aide de l'option V8 `--prof`.

### `--redirect-warnings=file` {#--prof-process}

**Ajouté dans la version : v8.0.0**

Écrire les avertissements de processus dans le fichier donné au lieu de les afficher sur stderr. Le fichier sera créé s'il n'existe pas et sera ajouté à la fin s'il existe déjà. Si une erreur se produit lors de la tentative d'écriture de l'avertissement dans le fichier, l'avertissement sera écrit à la place sur stderr.

Le nom du `fichier` peut être un chemin absolu. S'il ne l'est pas, le répertoire par défaut dans lequel il sera écrit est contrôlé par l'option de ligne de commande [`--diagnostic-dir`](/fr/nodejs/api/cli#--diagnostic-dirdirectory).

### `--report-compact` {#--redirect-warnings=file}

**Ajouté dans la version : v13.12.0, v12.17.0**

Écrire des rapports dans un format compact, JSON sur une seule ligne, plus facilement consommable par les systèmes de traitement des journaux que le format multiligne par défaut conçu pour la consommation humaine.

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette option n'est plus expérimentale. |
| v12.0.0 | Modification de `--diagnostic-report-directory` en `--report-directory`. |
| v11.8.0 | Ajouté dans la version : v11.8.0 |
:::

Emplacement où le rapport sera généré.


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**Ajouté dans : v23.3.0**

Lorsque `--report-exclude-env` est passé, le rapport de diagnostic généré ne contiendra pas les données `environmentVariables`.

### `--report-exclude-network` {#--report-exclude-env}

**Ajouté dans : v22.0.0, v20.13.0**

Exclure `header.networkInterfaces` du rapport de diagnostic. Par défaut, ceci n'est pas défini et les interfaces réseau sont incluses.

### `--report-filename=filename` {#--report-exclude-network}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette option n'est plus expérimentale. |
| v12.0.0 | passage de `--diagnostic-report-filename` à `--report-filename`. |
| v11.8.0 | Ajouté dans : v11.8.0 |
:::

Nom du fichier dans lequel le rapport sera écrit.

Si le nom de fichier est défini sur `'stdout'` ou `'stderr'`, le rapport est écrit respectivement dans la sortie standard ou la sortie d'erreur du processus.

### `--report-on-fatalerror` {#--report-filename=filename}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | Cette option n'est plus expérimentale. |
| v12.0.0 | passage de `--diagnostic-report-on-fatalerror` à `--report-on-fatalerror`. |
| v11.8.0 | Ajouté dans : v11.8.0 |
:::

Active le déclenchement du rapport en cas d'erreurs fatales (erreurs internes au runtime de Node.js telles qu'un manque de mémoire) qui entraînent l'arrêt de l'application. Utile pour inspecter divers éléments de données de diagnostic tels que le tas, la pile, l'état de la boucle d'événements, la consommation de ressources, etc. pour comprendre l'erreur fatale.

### `--report-on-signal` {#--report-on-fatalerror}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette option n'est plus expérimentale. |
| v12.0.0 | passage de `--diagnostic-report-on-signal` à `--report-on-signal`. |
| v11.8.0 | Ajouté dans : v11.8.0 |
:::

Active la génération d'un rapport lors de la réception du signal spécifié (ou prédéfini) par le processus Node.js en cours d'exécution. Le signal pour déclencher le rapport est spécifié via `--report-signal`.

### `--report-signal=signal` {#--report-on-signal}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette option n'est plus expérimentale. |
| v12.0.0 | passage de `--diagnostic-report-signal` à `--report-signal`. |
| v11.8.0 | Ajouté dans : v11.8.0 |
:::

Définit ou réinitialise le signal pour la génération de rapports (non pris en charge sous Windows). Le signal par défaut est `SIGUSR2`.


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.8.0, v16.18.0 | Le rapport n'est pas généré si l'exception non interceptée est gérée. |
| v13.12.0, v12.17.0 | Cette option n'est plus expérimentale. |
| v12.0.0 | changement de `--diagnostic-report-uncaught-exception` à `--report-uncaught-exception`. |
| v11.8.0 | Ajouté dans : v11.8.0 |
:::

Active la génération d'un rapport lorsque le processus se termine en raison d'une exception non interceptée. Utile pour inspecter la pile JavaScript conjointement avec la pile native et d'autres données d'environnement d'exécution.

### `-r`, `--require module` {#--report-uncaught-exception}

**Ajouté dans : v1.6.0**

Précharge le module spécifié au démarrage.

Suit les règles de résolution de module de `require()`. `module` peut être soit un chemin vers un fichier, soit un nom de module Node.

Seuls les modules CommonJS sont pris en charge. Utilisez [`--import`](/fr/nodejs/api/cli#--importmodule) pour précharger un [module ECMAScript](/fr/nodejs/api/esm#modules-ecmascript-modules). Les modules préchargés avec `--require` s'exécuteront avant les modules préchargés avec `--import`.

Les modules sont préchargés dans le thread principal ainsi que dans tous les threads de worker, les processus dupliqués ou les processus en cluster.

### `--run` {#-r---require-module}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.3.0 | La variable d'environnement NODE_RUN_SCRIPT_NAME est ajoutée. |
| v22.3.0 | La variable d'environnement NODE_RUN_PACKAGE_JSON_PATH est ajoutée. |
| v22.3.0 | Parcourt jusqu'au répertoire racine et trouve un fichier `package.json` pour exécuter la commande, et met à jour la variable d'environnement `PATH` en conséquence. |
| v22.0.0 | Ajouté dans : v22.0.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Cela exécute une commande spécifiée à partir de l'objet `"scripts"` d'un fichier package.json. Si une `"commande"` manquante est fournie, elle répertorie les scripts disponibles.

`--run` parcourt jusqu'au répertoire racine et trouve un fichier `package.json` pour exécuter la commande.

`--run` ajoute `./node_modules/.bin` pour chaque ancêtre du répertoire courant, au `PATH` afin d'exécuter les binaires à partir de différents dossiers où plusieurs répertoires `node_modules` sont présents, si `ancestor-folder/node_modules/.bin` est un répertoire.

`--run` exécute la commande dans le répertoire contenant le `package.json` associé.

Par exemple, la commande suivante exécutera le script `test` du `package.json` dans le dossier courant :

```bash [BASH]
$ node --run test
```
Vous pouvez également passer des arguments à la commande. Tout argument après `--` sera ajouté au script :

```bash [BASH]
$ node --run test -- --verbose
```

#### Limitations intentionnelles {#--run}

`node --run` n'est pas conçu pour correspondre aux comportements de `npm run` ou des commandes `run` des autres gestionnaires de paquets. L'implémentation Node.js est intentionnellement plus limitée, afin de se concentrer sur des performances optimales pour les cas d'utilisation les plus courants. Certaines fonctionnalités d'autres implémentations `run` qui sont intentionnellement exclues sont :

- Exécution des scripts `pre` ou `post` en plus du script spécifié.
- Définition de variables d'environnement spécifiques au gestionnaire de paquets.

#### Variables d'environnement {#intentional-limitations}

Les variables d'environnement suivantes sont définies lors de l'exécution d'un script avec `--run` :

- `NODE_RUN_SCRIPT_NAME`: Le nom du script en cours d'exécution. Par exemple, si `--run` est utilisé pour exécuter `test`, la valeur de cette variable sera `test`.
- `NODE_RUN_PACKAGE_JSON_PATH`: Le chemin d'accès au `package.json` en cours de traitement.

### `--secure-heap-min=n` {#environment-variables}

**Ajouté dans : v15.6.0**

Lors de l'utilisation de `--secure-heap`, l'indicateur `--secure-heap-min` spécifie l'allocation minimale du tas sécurisé. La valeur minimale est `2`. La valeur maximale est la plus petite entre `--secure-heap` et `2147483647`. La valeur donnée doit être une puissance de deux.

### `--secure-heap=n` {#--secure-heap-min=n}

**Ajouté dans : v15.6.0**

Initialise un tas sécurisé OpenSSL de `n` octets. Une fois initialisé, le tas sécurisé est utilisé pour certains types d'allocations dans OpenSSL pendant la génération de clés et d'autres opérations. Ceci est utile, par exemple, pour empêcher la fuite d'informations sensibles en raison de dépassements de pointeurs ou de sous-dépassements.

Le tas sécurisé est de taille fixe et ne peut pas être redimensionné lors de l'exécution. Par conséquent, s'il est utilisé, il est important de sélectionner un tas suffisamment grand pour couvrir toutes les utilisations de l'application.

La taille du tas donnée doit être une puissance de deux. Toute valeur inférieure à 2 désactivera le tas sécurisé.

Le tas sécurisé est désactivé par défaut.

Le tas sécurisé n'est pas disponible sur Windows.

Voir [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init) pour plus de détails.

### `--snapshot-blob=path` {#--secure-heap=n}

**Ajouté dans : v18.8.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Lorsqu'il est utilisé avec `--build-snapshot`, `--snapshot-blob` spécifie le chemin d'accès où le blob d'instantané généré est écrit. S'il n'est pas spécifié, le blob généré est écrit dans `snapshot.blob` dans le répertoire de travail courant.

Lorsqu'il est utilisé sans `--build-snapshot`, `--snapshot-blob` spécifie le chemin d'accès au blob qui est utilisé pour restaurer l'état de l'application.

Lors du chargement d'un instantané, Node.js vérifie que :

S'ils ne correspondent pas, Node.js refuse de charger l'instantané et se termine avec le code d'état 1.


### `--test` {#--snapshot-blob=path}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | L'exécuteur de tests est maintenant stable. |
| v19.2.0, v18.13.0 | L'exécuteur de tests prend désormais en charge l'exécution en mode surveillance. |
| v18.1.0, v16.17.0 | Ajouté dans : v18.1.0, v16.17.0 |
:::

Démarre l'exécuteur de tests en ligne de commande de Node.js. Cet indicateur ne peut pas être combiné avec `--watch-path`, `--check`, `--eval`, `--interactive` ou l'inspecteur. Voir la documentation sur [l'exécution de tests à partir de la ligne de commande](/fr/nodejs/api/test#running-tests-from-the-command-line) pour plus de détails.

### `--test-concurrency` {#--test}

**Ajouté dans : v21.0.0, v20.10.0, v18.19.0**

Le nombre maximal de fichiers de test que l'interface de ligne de commande de l'exécuteur de test exécutera simultanément. Si `--experimental-test-isolation` est défini sur `'none'`, cet indicateur est ignoré et la concurrence est de un. Sinon, la concurrence est par défaut `os.availableParallelism() - 1`.

### `--test-coverage-branches=seuil` {#--test-concurrency}

**Ajouté dans : v22.8.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Exige un pourcentage minimum de branches couvertes. Si la couverture du code n'atteint pas le seuil spécifié, le processus se terminera avec le code `1`.

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Exclut des fichiers spécifiques de la couverture du code en utilisant un modèle glob, qui peut correspondre à des chemins de fichiers absolus et relatifs.

Cette option peut être spécifiée plusieurs fois pour exclure plusieurs modèles glob.

Si `--test-coverage-exclude` et `--test-coverage-include` sont fournis, les fichiers doivent répondre aux **deux** critères pour être inclus dans le rapport de couverture.

Par défaut, tous les fichiers de test correspondants sont exclus du rapport de couverture. La spécification de cette option remplacera le comportement par défaut.

### `--test-coverage-functions=seuil` {#--test-coverage-exclude}

**Ajouté dans : v22.8.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Exige un pourcentage minimum de fonctions couvertes. Si la couverture du code n'atteint pas le seuil spécifié, le processus se terminera avec le code `1`.


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**Ajouté dans : v22.5.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stable : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Inclut des fichiers spécifiques dans la couverture du code en utilisant un modèle glob, qui peut correspondre à des chemins de fichiers absolus et relatifs.

Cette option peut être spécifiée plusieurs fois pour inclure plusieurs modèles glob.

Si `--test-coverage-exclude` et `--test-coverage-include` sont tous deux fournis, les fichiers doivent répondre aux **deux** critères pour être inclus dans le rapport de couverture.

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**Ajouté dans : v22.8.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stable : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Exige un pourcentage minimum de lignes couvertes. Si la couverture du code n'atteint pas le seuil spécifié, le processus se terminera avec le code `1`.

### `--test-force-exit` {#--test-coverage-lines=threshold}

**Ajouté dans : v22.0.0, v20.14.0**

Configure le lanceur de test pour quitter le processus une fois que tous les tests connus ont fini de s'exécuter, même si la boucle d'événements resterait active autrement.

### `--test-name-pattern` {#--test-force-exit}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Le lanceur de test est désormais stable. |
| v18.11.0 | Ajouté dans : v18.11.0 |
:::

Une expression régulière qui configure le lanceur de test pour n'exécuter que les tests dont le nom correspond au modèle fourni. Consultez la documentation sur [le filtrage des tests par nom](/fr/nodejs/api/test#filtering-tests-by-name) pour plus de détails.

Si `--test-name-pattern` et `--test-skip-pattern` sont tous deux fournis, les tests doivent satisfaire aux **deux** exigences pour être exécutés.

### `--test-only` {#--test-name-pattern}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Le lanceur de test est désormais stable. |
| v18.0.0, v16.17.0 | Ajouté dans : v18.0.0, v16.17.0 |
:::

Configure le lanceur de test pour n'exécuter que les tests de niveau supérieur qui ont l'option `only` définie. Cet indicateur n'est pas nécessaire lorsque l'isolation des tests est désactivée.

### `--test-reporter` {#--test-only}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Le lanceur de test est désormais stable. |
| v19.6.0, v18.15.0 | Ajouté dans : v19.6.0, v18.15.0 |
:::

Un rapporteur de test à utiliser lors de l'exécution des tests. Consultez la documentation sur [les rapporteurs de test](/fr/nodejs/api/test#test-reporters) pour plus de détails.


### `--test-reporter-destination` {#--test-reporter}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | L'exécuteur de tests est maintenant stable. |
| v19.6.0, v18.15.0 | Ajouté dans : v19.6.0, v18.15.0 |
:::

La destination du rapporteur de test correspondant. Voir la documentation sur les [rapporteurs de test](/fr/nodejs/api/test#test-reporters) pour plus de détails.

### `--test-shard` {#--test-reporter-destination}

**Ajouté dans : v20.5.0, v18.19.0**

Fragment de la suite de tests à exécuter dans un format de `\<index\>/\<total\>`, où

`index` est un entier positif, l'index des parties divisées `total` est un entier positif, le total des parties divisées. Cette commande divisera tous les fichiers de tests en `total` parties égales, et n'exécutera que ceux qui se trouvent dans une partie `index`.

Par exemple, pour diviser votre suite de tests en trois parties, utilisez ceci :

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**Ajouté dans : v22.1.0**

Une expression régulière qui configure l'exécuteur de tests pour ignorer les tests dont le nom correspond au modèle fourni. Voir la documentation sur le [filtrage des tests par nom](/fr/nodejs/api/test#filtering-tests-by-name) pour plus de détails.

Si `--test-name-pattern` et `--test-skip-pattern` sont tous deux fournis, les tests doivent satisfaire **les deux** exigences pour être exécutés.

### `--test-timeout` {#--test-skip-pattern}

**Ajouté dans : v21.2.0, v20.11.0**

Un nombre de millisecondes après lequel l'exécution du test échouera. Si non spécifié, les sous-tests héritent de cette valeur de leur parent. La valeur par défaut est `Infinity`.

### `--test-update-snapshots` {#--test-timeout}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.4.0 | Les tests de captures instantanées ne sont plus expérimentaux. |
| v22.3.0 | Ajouté dans : v22.3.0 |
:::

Régénère les fichiers de captures instantanées utilisés par l'exécuteur de tests pour les [tests de captures instantanées](/fr/nodejs/api/test#snapshot-testing).

### `--throw-deprecation` {#--test-update-snapshots}

**Ajouté dans : v0.11.14**

Lance des erreurs pour les dépréciations.

### `--title=title` {#--throw-deprecation}

**Ajouté dans : v10.7.0**

Définit `process.title` au démarrage.

### `--tls-cipher-list=list` {#--title=title}

**Ajouté dans : v4.0.0**

Spécifie une autre liste de chiffrement TLS par défaut. Nécessite que Node.js soit compilé avec le support de la crypto (par défaut).


### `--tls-keylog=file` {#--tls-cipher-list=list}

**Ajouté dans : v13.2.0, v12.16.0**

Enregistre les données de clé TLS dans un fichier. Les données de clé sont au format NSS `SSLKEYLOGFILE` et peuvent être utilisées par des logiciels (tels que Wireshark) pour décrypter le trafic TLS.

### `--tls-max-v1.2` {#--tls-keylog=file}

**Ajouté dans : v12.0.0, v10.20.0**

Définit [`tls.DEFAULT_MAX_VERSION`](/fr/nodejs/api/tls#tlsdefault_max_version) sur 'TLSv1.2'. À utiliser pour désactiver la prise en charge de TLSv1.3.

### `--tls-max-v1.3` {#--tls-max-v12}

**Ajouté dans : v12.0.0**

Définit [`tls.DEFAULT_MAX_VERSION`](/fr/nodejs/api/tls#tlsdefault_max_version) par défaut sur 'TLSv1.3'. À utiliser pour activer la prise en charge de TLSv1.3.

### `--tls-min-v1.0` {#--tls-max-v13}

**Ajouté dans : v12.0.0, v10.20.0**

Définit [`tls.DEFAULT_MIN_VERSION`](/fr/nodejs/api/tls#tlsdefault_min_version) par défaut sur 'TLSv1'. À utiliser pour la compatibilité avec d'anciens clients ou serveurs TLS.

### `--tls-min-v1.1` {#--tls-min-v10}

**Ajouté dans : v12.0.0, v10.20.0**

Définit [`tls.DEFAULT_MIN_VERSION`](/fr/nodejs/api/tls#tlsdefault_min_version) par défaut sur 'TLSv1.1'. À utiliser pour la compatibilité avec d'anciens clients ou serveurs TLS.

### `--tls-min-v1.2` {#--tls-min-v11}

**Ajouté dans : v12.2.0, v10.20.0**

Définit [`tls.DEFAULT_MIN_VERSION`](/fr/nodejs/api/tls#tlsdefault_min_version) par défaut sur 'TLSv1.2'. Il s'agit de la valeur par défaut pour 12.x et versions ultérieures, mais l'option est prise en charge pour la compatibilité avec les anciennes versions de Node.js.

### `--tls-min-v1.3` {#--tls-min-v12}

**Ajouté dans : v12.0.0**

Définit [`tls.DEFAULT_MIN_VERSION`](/fr/nodejs/api/tls#tlsdefault_min_version) par défaut sur 'TLSv1.3'. À utiliser pour désactiver la prise en charge de TLSv1.2, qui n'est pas aussi sécurisée que TLSv1.3.

### `--trace-deprecation` {#--tls-min-v13}

**Ajouté dans : v0.8.0**

Affiche les stack traces pour les dépréciations.

### `--trace-env` {#--trace-deprecation}

**Ajouté dans : v23.4.0**

Affiche des informations sur tout accès aux variables d'environnement effectué dans l'instance Node.js actuelle vers stderr, y compris :

- Les lectures de variables d'environnement que Node.js effectue en interne.
- Les écritures sous la forme `process.env.KEY = "SOME VALUE"`.
- Les lectures sous la forme `process.env.KEY`.
- Les définitions sous la forme `Object.defineProperty(process.env, 'KEY', {...})`.
- Les requêtes sous la forme `Object.hasOwn(process.env, 'KEY')`, `process.env.hasOwnProperty('KEY')` ou `'KEY' in process.env`.
- Les suppressions sous la forme `delete process.env.KEY`.
- Les énumérations sous la forme de `...process.env` ou `Object.keys(process.env)`.

Seuls les noms des variables d'environnement auxquelles on accède sont affichés. Les valeurs ne sont pas affichées.

Pour afficher la stack trace de l'accès, utilisez `--trace-env-js-stack` et/ou `--trace-env-native-stack`.


### `--trace-env-js-stack` {#--trace-env}

**Ajoutée dans : v23.4.0**

En plus de ce que fait `--trace-env`, ceci affiche la trace de pile JavaScript de l'accès.

### `--trace-env-native-stack` {#--trace-env-js-stack}

**Ajoutée dans : v23.4.0**

En plus de ce que fait `--trace-env`, ceci affiche la trace de pile native de l'accès.

### `--trace-event-categories` {#--trace-env-native-stack}

**Ajoutée dans : v7.7.0**

Une liste séparée par des virgules de catégories qui doivent être suivies lorsque le traçage des événements de trace est activé à l'aide de `--trace-events-enabled`.

### `--trace-event-file-pattern` {#--trace-event-categories}

**Ajoutée dans : v9.8.0**

Chaîne de modèle spécifiant le chemin d'accès aux données d'événements de trace, elle prend en charge `${rotation}` et `${pid}`.

### `--trace-events-enabled` {#--trace-event-file-pattern}

**Ajoutée dans : v7.7.0**

Active la collecte des informations de traçage des événements de trace.

### `--trace-exit` {#--trace-events-enabled}

**Ajoutée dans : v13.5.0, v12.16.0**

Affiche une trace de pile chaque fois qu'un environnement est quitté de manière proactive, c'est-à-dire en invoquant `process.exit()`.

### `--trace-require-module=mode` {#--trace-exit}

**Ajoutée dans : v23.5.0**

Affiche des informations sur l'utilisation de [Chargement des modules ECMAScript à l'aide de `require()`] (/fr/nodejs/api/modules#loading-ecmascript-modules-using-require).

Lorsque `mode` est `all`, toute l'utilisation est affichée. Lorsque `mode` est `no-node-modules`, l'utilisation du dossier `node_modules` est exclue.

### `--trace-sigint` {#--trace-require-module=mode}

**Ajoutée dans : v13.9.0, v12.17.0**

Affiche une trace de pile sur SIGINT.

### `--trace-sync-io` {#--trace-sigint}

**Ajoutée dans : v2.1.0**

Affiche une trace de pile chaque fois qu'une E/S synchrone est détectée après le premier tour de la boucle d'événements.

### `--trace-tls` {#--trace-sync-io}

**Ajoutée dans : v12.2.0**

Affiche les informations de trace des paquets TLS sur `stderr`. Ceci peut être utilisé pour déboguer les problèmes de connexion TLS.

### `--trace-uncaught` {#--trace-tls}

**Ajoutée dans : v13.1.0**

Affiche les traces de pile pour les exceptions non interceptées ; généralement, la trace de pile associée à la création d'une `Error` est affichée, alors que ceci permet à Node.js d'afficher également la trace de pile associée au lancement de la valeur (qui n'a pas besoin d'être une instance de `Error`).

L'activation de cette option peut affecter négativement le comportement du ramasse-miettes.

### `--trace-warnings` {#--trace-uncaught}

**Ajoutée dans : v6.0.0**

Affiche les traces de pile pour les avertissements de processus (y compris les dépréciations).


### `--track-heap-objects` {#--trace-warnings}

**Ajouté dans : v2.4.0**

Suivre les allocations d’objets du tas pour les instantanés du tas.

### `--unhandled-rejections=mode` {#--track-heap-objects}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le mode par défaut a été modifié en `throw`. Auparavant, un avertissement était émis. |
| v12.0.0, v10.17.0 | Ajouté dans : v12.0.0, v10.17.0 |
:::

L’utilisation de cet indicateur permet de modifier ce qui doit se passer lorsqu’un rejet non géré se produit. L’un des modes suivants peut être choisi :

- `throw` : Émet [`unhandledRejection`](/fr/nodejs/api/process#event-unhandledrejection). Si ce hook n’est pas défini, augmente le rejet non géré en tant qu’exception non interceptée. C’est la valeur par défaut.
- `strict` : Augmente le rejet non géré en tant qu’exception non interceptée. Si l’exception est gérée, [`unhandledRejection`](/fr/nodejs/api/process#event-unhandledrejection) est émis.
- `warn` : Déclenche toujours un avertissement, peu importe si le hook [`unhandledRejection`](/fr/nodejs/api/process#event-unhandledrejection) est défini ou non, mais n’imprime pas l’avertissement de dépréciation.
- `warn-with-error-code` : Émet [`unhandledRejection`](/fr/nodejs/api/process#event-unhandledrejection). Si ce hook n’est pas défini, déclenche un avertissement et définit le code de sortie du processus sur 1.
- `none` : Ignore tous les avertissements.

Si un rejet se produit pendant la phase de chargement statique du module ES du point d’entrée de la ligne de commande, il l’augmentera toujours en tant qu’exception non interceptée.

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**Ajouté dans : v6.11.0**

Utiliser le magasin d’AC Mozilla fourni par la version actuelle de Node.js ou utiliser le magasin d’AC par défaut d’OpenSSL. Le magasin par défaut est sélectionnable au moment de la construction.

Le magasin d’AC groupé, tel que fourni par Node.js, est un instantané du magasin d’AC Mozilla qui est corrigé au moment de la publication. Il est identique sur toutes les plateformes prises en charge.

L’utilisation du magasin OpenSSL permet des modifications externes du magasin. Pour la plupart des distributions Linux et BSD, ce magasin est maintenu par les responsables de la distribution et les administrateurs système. L’emplacement du magasin d’AC OpenSSL dépend de la configuration de la bibliothèque OpenSSL, mais cela peut être modifié au moment de l’exécution à l’aide de variables d’environnement.

Voir `SSL_CERT_DIR` et `SSL_CERT_FILE`.


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**Ajouté dans : v13.6.0, v12.17.0**

Re-mappe le code statique de Node.js vers de grandes pages mémoire au démarrage. Si le système cible le prend en charge, cela déplacera le code statique de Node.js vers des pages de 2 Mio au lieu de pages de 4 Kio.

Les valeurs suivantes sont valides pour `mode` :

- `off` : aucune tentative de mappage ne sera effectuée. C'est la valeur par défaut.
- `on` : si le système d'exploitation le prend en charge, une tentative de mappage sera effectuée. L'échec du mappage sera ignoré et un message sera affiché dans l'erreur standard.
- `silent` : si le système d'exploitation le prend en charge, une tentative de mappage sera effectuée. L'échec du mappage sera ignoré et ne sera pas signalé.

### `--v8-options` {#--use-largepages=mode}

**Ajouté dans : v0.1.3**

Affiche les options de ligne de commande V8.

### `--v8-pool-size=num` {#--v8-options}

**Ajouté dans : v5.10.0**

Définit la taille du pool de threads de V8 qui sera utilisée pour allouer les tâches en arrière-plan.

Si la valeur est définie sur `0`, Node.js choisira une taille appropriée pour le pool de threads en fonction d'une estimation de la quantité de parallélisme.

La quantité de parallélisme fait référence au nombre de calculs qui peuvent être effectués simultanément sur une machine donnée. En général, c'est la même chose que le nombre d'UC, mais cela peut diverger dans des environnements tels que les machines virtuelles ou les conteneurs.

### `-v`, `--version` {#--v8-pool-size=num}

**Ajouté dans : v0.1.3**

Affiche la version de Node.

### `--watch` {#-v---version}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | Le mode watch est désormais stable. |
| v19.2.0, v18.13.0 | L'exécuteur de tests prend désormais en charge l'exécution en mode watch. |
| v18.11.0, v16.19.0 | Ajouté dans : v18.11.0, v16.19.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Démarre Node.js en mode watch. En mode watch, les modifications apportées aux fichiers surveillés entraînent le redémarrage du processus Node.js. Par défaut, le mode watch surveille le point d'entrée et tout module requis ou importé. Utilisez `--watch-path` pour spécifier les chemins à surveiller.

Cet indicateur ne peut pas être combiné avec `--check`, `--eval`, `--interactive`, ou la REPL.

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | Le mode surveillance est maintenant stable. |
| v18.11.0, v16.19.0 | Ajouté dans : v18.11.0, v16.19.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Démarre Node.js en mode surveillance et spécifie les chemins à surveiller. En mode surveillance, les modifications apportées aux chemins surveillés entraînent le redémarrage du processus Node.js. Cela désactivera la surveillance des modules requis ou importés, même lorsqu'il est utilisé en combinaison avec `--watch`.

Cet indicateur ne peut pas être combiné avec `--check`, `--eval`, `--interactive`, `--test` ou le REPL.

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
Cette option n'est prise en charge que sur macOS et Windows. Une exception `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` sera levée lorsque l'option est utilisée sur une plateforme qui ne la prend pas en charge.

### `--watch-preserve-output` {#--watch-path}

**Ajouté dans : v19.3.0, v18.13.0**

Désactive la suppression du contenu de la console lorsque le mode surveillance redémarre le processus.

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**Ajouté dans : v6.0.0**

Remplit automatiquement avec des zéros toutes les nouvelles instances [`Buffer`](/fr/nodejs/api/buffer#class-buffer) et [`SlowBuffer`](/fr/nodejs/api/buffer#class-slowbuffer) allouées.

## Variables d’environnement {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

La variable d'environnement `FORCE_COLOR` est utilisée pour activer la sortie colorisée ANSI. La valeur peut être :

- `1`, `true` ou la chaîne vide `''` indiquent la prise en charge de 16 couleurs,
- `2` pour indiquer la prise en charge de 256 couleurs, ou
- `3` pour indiquer la prise en charge de 16 millions de couleurs.

Lorsque `FORCE_COLOR` est utilisé et défini sur une valeur prise en charge, les variables d'environnement `NO_COLOR` et `NODE_DISABLE_COLORS` sont ignorées.

Toute autre valeur entraînera la désactivation de la sortie colorisée.

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**Ajouté dans : v22.1.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Active le [cache de compilation de module](/fr/nodejs/api/module#module-compile-cache) pour l’instance Node.js. Consultez la documentation du [cache de compilation de module](/fr/nodejs/api/module#module-compile-cache) pour plus de détails.


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**Ajouté dans : v0.1.32**

Liste séparée par des `','` des modules principaux qui doivent afficher des informations de débogage.

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

Liste séparée par des `','` des modules C++ principaux qui doivent afficher des informations de débogage.

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**Ajouté dans : v0.3.0**

Lorsqu'elle est définie, les couleurs ne seront pas utilisées dans le REPL.

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**Ajouté dans : v22.8.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Désactive le [cache de compilation des modules](/fr/nodejs/api/module#module-compile-cache) pour l'instance Node.js. Voir la documentation du [cache de compilation des modules](/fr/nodejs/api/module#module-compile-cache) pour plus de détails.

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**Ajouté dans : v7.3.0**

Lorsqu'elle est définie, les autorités de certification "racine" bien connues (comme VeriSign) seront étendues avec les certificats supplémentaires dans `file`. Le fichier doit contenir un ou plusieurs certificats de confiance au format PEM. Un message sera émis (une seule fois) avec [`process.emitWarning()`](/fr/nodejs/api/process#processemitwarningwarning-options) si le fichier est manquant ou mal formé, mais toute autre erreur sera ignorée.

Ni les certificats bien connus ni les certificats supplémentaires ne sont utilisés lorsque la propriété d'options `ca` est explicitement spécifiée pour un client ou un serveur TLS ou HTTPS.

Cette variable d'environnement est ignorée lorsque `node` est exécuté en tant que root setuid ou possède des capacités de fichier Linux définies.

La variable d'environnement `NODE_EXTRA_CA_CERTS` n'est lue que lorsque le processus Node.js est lancé pour la première fois. La modification de la valeur au moment de l'exécution à l'aide de `process.env.NODE_EXTRA_CA_CERTS` n'a aucun effet sur le processus en cours.

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**Ajouté dans : v0.11.15**

Chemin d'accès aux données pour les données ICU (objet `Intl`). Étendra les données liées lorsqu'elles sont compilées avec la prise en charge de small-icu.

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**Ajouté dans : v6.11.0**

Lorsqu'elle est définie sur `1`, les avertissements de processus sont désactivés.

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**Ajouté dans : v8.0.0**

Liste d'options de ligne de commande séparées par des espaces. `options...` sont interprétées avant les options de ligne de commande, de sorte que les options de ligne de commande remplaceront ou se composeront après tout ce qui se trouve dans `options...`. Node.js quittera avec une erreur si une option qui n'est pas autorisée dans l'environnement est utilisée, telle que `-p` ou un fichier de script.

Si une valeur d'option contient un espace, elle peut être échappée à l'aide de guillemets doubles :

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
Un drapeau singleton passé en tant qu'option de ligne de commande remplacera le même drapeau passé dans `NODE_OPTIONS` :

```bash [BASH]
# L'inspecteur sera disponible sur le port 5555 {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
Un drapeau qui peut être passé plusieurs fois sera traité comme si ses instances `NODE_OPTIONS` étaient passées en premier, puis ses instances de ligne de commande ensuite :

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# équivaut à : {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
Les options Node.js autorisées figurent dans la liste suivante. Si une option prend en charge à la fois les variantes --XX et --no-XX, elles sont toutes deux prises en charge, mais une seule est incluse dans la liste ci-dessous.

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

Les options V8 autorisées sont :

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

`--perf-basic-prof-only-functions`, `--perf-basic-prof`, `--perf-prof-unwinding-info` et `--perf-prof` ne sont disponibles que sur Linux.

`--enable-etw-stack-walking` n'est disponible que sur Windows.


### `NODE_PATH=chemin[:…]` {#is-equivalent-to}

**Ajouté dans : v0.1.32**

Liste de répertoires séparés par `':'` ajoutés au début du chemin de recherche des modules.

Sur Windows, il s’agit plutôt d’une liste séparée par `';'`.

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**Ajouté dans : v8.0.0**

Lorsque la valeur est définie sur `1`, émet des avertissements de dépréciation en attente.

Les dépréciations en attente sont généralement identiques à une dépréciation d’exécution, à l’exception notable qu’elles sont désactivées par défaut et ne seront pas émises à moins que l’indicateur de ligne de commande `--pending-deprecation` ou la variable d’environnement `NODE_PENDING_DEPRECATION=1` ne soient définis. Les dépréciations en attente sont utilisées pour fournir une sorte de mécanisme d’« alerte précoce » sélectif que les développeurs peuvent utiliser pour détecter l’utilisation d’API obsolètes.

### `NODE_PENDING_PIPE_INSTANCES=instances` {#node_pending_deprecation=1}

Définit le nombre de gestionnaires d’instances de canal en attente lorsque le serveur de canal attend des connexions. Ce paramètre s’applique à Windows uniquement.

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**Ajouté dans : v7.1.0**

Lorsque la valeur est définie sur `1`, indique au chargeur de modules de conserver les liens symboliques lors de la résolution et de la mise en cache des modules.

### `NODE_REDIRECT_WARNINGS=fichier` {#node_preserve_symlinks=1}

**Ajouté dans : v8.0.0**

Lorsqu’elle est définie, les avertissements de processus seront émis dans le fichier donné au lieu d’être imprimés sur stderr. Le fichier sera créé s’il n’existe pas et sera ajouté s’il existe déjà. Si une erreur se produit lors de la tentative d’écriture de l’avertissement dans le fichier, l’avertissement sera écrit à la place sur stderr. Ceci est équivalent à l’utilisation de l’indicateur de ligne de commande `--redirect-warnings=file`.

### `NODE_REPL_EXTERNAL_MODULE=fichier` {#node_redirect_warnings=file}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.3.0, v20.16.0 | Supprime la possibilité d’utiliser cette variable d’environnement avec kDisableNodeOptionsEnv pour les intégrateurs. |
| v13.0.0, v12.16.0 | Ajouté dans : v13.0.0, v12.16.0 |
:::

Chemin d’accès à un module Node.js qui sera chargé à la place du REPL intégré. Remplacer cette valeur par une chaîne vide (`''`) utilisera le REPL intégré.

### `NODE_REPL_HISTORY=fichier` {#node_repl_external_module=file}

**Ajouté dans : v3.0.0**

Chemin d’accès au fichier utilisé pour stocker l’historique REPL persistant. Le chemin d’accès par défaut est `~/.node_repl_history`, qui est remplacé par cette variable. Définir la valeur sur une chaîne vide (`''` ou `' '`) désactive l’historique REPL persistant.


### `NODE_SKIP_PLATFORM_CHECK=value` {#node_repl_history=file}

**Ajouté dans: v14.5.0**

Si `value` est égal à `'1'`, la vérification d'une plateforme prise en charge est ignorée lors du démarrage de Node.js. Node.js pourrait ne pas s'exécuter correctement. Tout problème rencontré sur les plateformes non prises en charge ne sera pas corrigé.

### `NODE_TEST_CONTEXT=value` {#node_skip_platform_check=value}

Si `value` est égal à `'child'`, les options du rapporteur de test seront remplacées et la sortie du test sera envoyée à stdout au format TAP. Si une autre valeur est fournie, Node.js ne garantit pas le format du rapporteur utilisé ni sa stabilité.

### `NODE_TLS_REJECT_UNAUTHORIZED=value` {#node_test_context=value}

Si `value` est égal à `'0'`, la validation du certificat est désactivée pour les connexions TLS. Cela rend TLS, et HTTPS par extension, non sécurisé. L'utilisation de cette variable d'environnement est fortement déconseillée.

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

Lorsqu'elle est définie, Node.js commencera à sortir les données de [couverture du code JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage) et de [Source Map](https://sourcemaps.info/spec) dans le répertoire fourni en argument (les informations de couverture sont écrites au format JSON dans des fichiers avec un préfixe `coverage`).

`NODE_V8_COVERAGE` se propagera automatiquement aux sous-processus, ce qui facilitera l'instrumentation des applications qui appellent la famille de fonctions `child_process.spawn()`. `NODE_V8_COVERAGE` peut être définie sur une chaîne vide, pour empêcher la propagation.

### `NO_COLOR=&lt;any&gt;` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) est un alias pour `NODE_DISABLE_COLORS`. La valeur de la variable d'environnement est arbitraire.

#### Sortie de la couverture {#no_color=&lt;any&gt;}

La couverture est sortie sous forme d'un tableau d'objets [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) sur la clé de niveau supérieur `result` :

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
#### Cache de la source map {#coverage-output}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Si des données de source map sont trouvées, elles sont ajoutées à la clé de niveau supérieur `source-map-cache` sur l'objet de couverture JSON.

`source-map-cache` est un objet dont les clés représentent les fichiers à partir desquels les source maps ont été extraites, et les valeurs incluent l'URL brute de la source map (dans la clé `url`), les informations analysées de Source Map v3 (dans la clé `data`), et les longueurs de ligne du fichier source (dans la clé `lineLengths`).

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

### `OPENSSL_CONF=fichier` {#source-map-cache}

**Ajouté dans: v6.11.0**

Charge un fichier de configuration OpenSSL au démarrage. Entre autres utilisations, cela peut être utilisé pour activer la crypto conforme à FIPS si Node.js est construit avec `./configure --openssl-fips`.

Si l'option de ligne de commande [`--openssl-config`](/fr/nodejs/api/cli#--openssl-configfichier) est utilisée, la variable d'environnement est ignorée.

### `SSL_CERT_DIR=répertoire` {#openssl_conf=file}

**Ajouté dans: v7.7.0**

Si `--use-openssl-ca` est activé, cela remplace et définit le répertoire d'OpenSSL contenant les certificats de confiance.

Sachez qu'à moins que l'environnement enfant ne soit explicitement défini, cette variable d'environnement sera héritée par tous les processus enfants, et s'ils utilisent OpenSSL, cela peut les amener à faire confiance aux mêmes autorités de certification que node.

### `SSL_CERT_FILE=fichier` {#ssl_cert_dir=dir}

**Ajouté dans: v7.7.0**

Si `--use-openssl-ca` est activé, cela remplace et définit le fichier d'OpenSSL contenant les certificats de confiance.

Sachez qu'à moins que l'environnement enfant ne soit explicitement défini, cette variable d'environnement sera héritée par tous les processus enfants, et s'ils utilisent OpenSSL, cela peut les amener à faire confiance aux mêmes autorités de certification que node.

### `TZ` {#ssl_cert_file=file}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.2.0 | La modification de la variable TZ à l'aide de process.env.TZ = modifie également le fuseau horaire sur Windows. |
| v13.0.0 | La modification de la variable TZ à l'aide de process.env.TZ = modifie le fuseau horaire sur les systèmes POSIX. |
| v0.0.1 | Ajouté dans: v0.0.1 |
:::

La variable d'environnement `TZ` est utilisée pour spécifier la configuration du fuseau horaire.

Bien que Node.js ne prenne pas en charge toutes les [façons dont `TZ` est géré dans d'autres environnements](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable), il prend en charge les [ID de fuseaux horaires](https://fr.wikipedia.org/wiki/Liste_des_fuseaux_horaires_de_la_base_de_donn%C3%A9es_tz) de base (tels que `'Etc/UTC'`, `'Europe/Paris'` ou `'America/New_York'`). Il peut prendre en charge quelques autres abréviations ou alias, mais ceux-ci sont fortement déconseillés et non garantis.

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=size` {#tz}

Définit le nombre de threads utilisés dans le pool de threads de libuv à `size`.

Les API système asynchrones sont utilisées par Node.js dans la mesure du possible, mais là où elles n'existent pas, le pool de threads de libuv est utilisé pour créer des API Node asynchrones basées sur des API système synchrones. Les API Node.js qui utilisent le pool de threads sont :

- toutes les API `fs`, autres que les API de surveillance de fichiers et celles qui sont explicitement synchrones
- les API crypto asynchrones telles que `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`
- `dns.lookup()`
- toutes les API `zlib`, autres que celles qui sont explicitement synchrones

Étant donné que le pool de threads de libuv a une taille fixe, cela signifie que si, pour une raison quelconque, l'une de ces API prend beaucoup de temps, d'autres API (apparemment sans rapport) qui s'exécutent dans le pool de threads de libuv subiront une dégradation des performances. Afin d'atténuer ce problème, une solution potentielle consiste à augmenter la taille du pool de threads de libuv en définissant la variable d'environnement `'UV_THREADPOOL_SIZE'` sur une valeur supérieure à `4` (sa valeur par défaut actuelle). Cependant, définir ceci depuis l'intérieur du processus en utilisant `process.env.UV_THREADPOOL_SIZE=size` n'est pas garanti de fonctionner car le pool de threads aurait été créé dans le cadre de l'initialisation de l'environnement d'exécution bien avant que le code utilisateur ne soit exécuté. Pour plus d'informations, consultez la [documentation du pool de threads libuv](https://docs.libuv.org/en/latest/threadpool).

## Options V8 utiles {#uv_threadpool_size=size}

V8 possède son propre ensemble d'options CLI. Toute option CLI V8 fournie à `node` sera transmise à V8 pour être traitée. Les options de V8 n'ont *aucune garantie de stabilité*. L'équipe V8 elle-même ne les considère pas comme faisant partie de son API formelle et se réserve le droit de les modifier à tout moment. De même, elles ne sont pas couvertes par les garanties de stabilité de Node.js. La plupart des options V8 ne présentent d'intérêt que pour les développeurs V8. Malgré cela, il existe un petit ensemble d'options V8 qui sont largement applicables à Node.js, et elles sont documentées ici :

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (en Mio) {#--jitless_1}

Définit la taille maximale de la section de mémoire ancienne de V8. Lorsque la consommation de mémoire approche la limite, V8 consacre plus de temps au ramassage des ordures afin de libérer la mémoire inutilisée.

Sur une machine avec 2 Gio de mémoire, envisagez de définir cette valeur à 1536 (1,5 Gio) pour laisser de la mémoire pour d'autres utilisations et éviter la permutation.

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (en Mio) {#--max-old-space-size=size-in-mib}

Définit la taille maximale du [semi-espace](https://www.memorymanagement.org/glossary/s#semi.space) pour le [ramasseur de déchets de nettoyage](https://v8.dev/blog/orinoco-parallel-scavenger) de V8 en Mio (mébioctets). L'augmentation de la taille maximale d'un semi-espace peut améliorer le débit de Node.js au prix d'une consommation de mémoire plus importante.

Étant donné que la taille de la jeune génération du tas V8 est trois fois supérieure (voir [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) dans V8) à la taille du semi-espace, une augmentation de 1 Mio du semi-espace s'applique à chacun des trois semi-espaces individuels et entraîne une augmentation de la taille du tas de 3 Mio. L'amélioration du débit dépend de votre charge de travail (voir [#42511](https://github.com/nodejs/node/issues/42511)).

La valeur par défaut dépend de la limite de mémoire. Par exemple, sur les systèmes 64 bits avec une limite de mémoire de 512 Mio, la taille maximale d'un semi-espace est par défaut de 1 Mio. Pour les limites de mémoire allant jusqu'à 2 Gio inclus, la taille maximale par défaut d'un semi-espace sera inférieure à 16 Mio sur les systèmes 64 bits.

Pour obtenir la meilleure configuration pour votre application, vous devez essayer différentes valeurs de max-semi-space-size lors de l'exécution de benchmarks pour votre application.

Par exemple, benchmark sur un système 64 bits :

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

Nombre maximal de cadres de pile à collecter dans la trace de pile d'une erreur. Le définir sur 0 désactive la collecte des traces de pile. La valeur par défaut est 10.

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # affiche 12
```

