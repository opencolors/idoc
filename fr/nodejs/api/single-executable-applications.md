---
title: Applications exécutables uniques avec Node.js
description: Découvrez comment créer et gérer des applications exécutables uniques avec Node.js, y compris comment empaqueter votre application, gérer les dépendances et traiter les considérations de sécurité.
head:
  - - meta
    - name: og:title
      content: Applications exécutables uniques avec Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment créer et gérer des applications exécutables uniques avec Node.js, y compris comment empaqueter votre application, gérer les dépendances et traiter les considérations de sécurité.
  - - meta
    - name: twitter:title
      content: Applications exécutables uniques avec Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment créer et gérer des applications exécutables uniques avec Node.js, y compris comment empaqueter votre application, gérer les dépendances et traiter les considérations de sécurité.
---


# Applications exécutables uniques {#single-executable-applications}

::: info [Historique]
| Version | Modifications |
|---|---|
| v20.6.0 | Ajout de la prise en charge de "useSnapshot". |
| v20.6.0 | Ajout de la prise en charge de "useCodeCache". |
| v19.7.0, v18.16.0 | Ajouté dans : v19.7.0, v18.16.0 |
:::

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

**Code source :** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

Cette fonctionnalité permet de distribuer facilement une application Node.js à un système sur lequel Node.js n’est pas installé.

Node.js prend en charge la création d’[applications exécutables uniques](https://github.com/nodejs/single-executable) en autorisant l’injection d’un blob préparé par Node.js, qui peut contenir un script regroupé, dans le binaire `node`. Au démarrage, le programme vérifie si quelque chose a été injecté. Si le blob est trouvé, il exécute le script dans le blob. Sinon, Node.js fonctionne comme il le fait normalement.

La fonctionnalité d’application exécutable unique ne prend actuellement en charge que l’exécution d’un seul script intégré à l’aide du système de module [CommonJS](/fr/nodejs/api/modules#modules-commonjs-modules).

Les utilisateurs peuvent créer une application exécutable unique à partir de leur script regroupé avec le binaire `node` lui-même et tout outil capable d’injecter des ressources dans le binaire.

Voici les étapes à suivre pour créer une application exécutable unique à l’aide d’un de ces outils, [postject](https://github.com/nodejs/postject) :

## Génération de blobs de préparation exécutables uniques {#generating-single-executable-preparation-blobs}

Les blobs de préparation exécutables uniques qui sont injectés dans l’application peuvent être générés à l’aide de l’indicateur `--experimental-sea-config` du binaire Node.js qui sera utilisé pour créer l’exécutable unique. Il prend un chemin d’accès à un fichier de configuration au format JSON. Si le chemin qui lui est transmis n’est pas absolu, Node.js utilisera le chemin d’accès relatif au répertoire de travail actuel.

La configuration lit actuellement les champs de niveau supérieur suivants :

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "disableExperimentalSEAWarning": true, // Default: false
  "useSnapshot": false,  // Default: false
  "useCodeCache": true, // Default: false
  "assets": {  // Optional
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```
Si les chemins d’accès ne sont pas absolus, Node.js utilisera le chemin d’accès relatif au répertoire de travail actuel. La version du binaire Node.js utilisée pour produire le blob doit être la même que celle dans laquelle le blob sera injecté.

Remarque : lors de la génération de SEA multiplateformes (par exemple, la génération d’un SEA pour `linux-x64` sur `darwin-arm64`), `useCodeCache` et `useSnapshot` doivent être définis sur false pour éviter de générer des exécutables incompatibles. Étant donné que le cache de code et les instantanés ne peuvent être chargés que sur la même plateforme où ils sont compilés, l’exécutable généré peut planter au démarrage lors de la tentative de chargement du cache de code ou des instantanés créés sur une plateforme différente.


### Ressources {#assets}

Les utilisateurs peuvent inclure des ressources en ajoutant un dictionnaire clé-chemin à la configuration sous le champ `assets`. Au moment de la compilation, Node.js lirait les ressources à partir des chemins spécifiés et les regrouperait dans le blob de préparation. Dans l'exécutable généré, les utilisateurs peuvent récupérer les ressources à l'aide des API [`sea.getAsset()`](/fr/nodejs/api/single-executable-applications#seagetassetkey-encoding) et [`sea.getAssetAsBlob()`](/fr/nodejs/api/single-executable-applications#seagetassetasblobkey-options).

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
L'application mono-exécutable peut accéder aux ressources comme suit :

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// Renvoie une copie des données dans un ArrayBuffer.
const image = getAsset('a.jpg');
// Renvoie une chaîne décodée à partir de la ressource en tant qu'UTF8.
const text = getAsset('b.txt', 'utf8');
// Renvoie un Blob contenant la ressource.
const blob = getAssetAsBlob('a.jpg');
// Renvoie un ArrayBuffer contenant la ressource brute sans copie.
const raw = getRawAsset('a.jpg');
```
Consultez la documentation des API [`sea.getAsset()`](/fr/nodejs/api/single-executable-applications#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](/fr/nodejs/api/single-executable-applications#seagetassetasblobkey-options) et [`sea.getRawAsset()`](/fr/nodejs/api/single-executable-applications#seagetrawassetkey) pour plus d'informations.

### Prise en charge des instantanés de démarrage {#startup-snapshot-support}

Le champ `useSnapshot` peut être utilisé pour activer la prise en charge des instantanés de démarrage. Dans ce cas, le script `main` ne serait pas exécuté au lancement de l'exécutable final. Au lieu de cela, il serait exécuté lorsque le blob de préparation de l'application mono-exécutable est généré sur la machine de construction. Le blob de préparation généré inclurait alors un instantané capturant les états initialisés par le script `main`. L'exécutable final avec le blob de préparation injecté désérialiserait l'instantané au moment de l'exécution.

Lorsque `useSnapshot` est vrai, le script principal doit invoquer l'API [`v8.startupSnapshot.setDeserializeMainFunction()`](/fr/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) pour configurer le code qui doit être exécuté lorsque l'exécutable final est lancé par les utilisateurs.

Le modèle typique pour qu'une application utilise un instantané dans une application mono-exécutable est :

Les contraintes générales des scripts d'instantané de démarrage s'appliquent également au script principal lorsqu'il est utilisé pour créer un instantané pour l'application mono-exécutable, et le script principal peut utiliser l'[`API v8.startupSnapshot`](/fr/nodejs/api/v8#startup-snapshot-api) pour s'adapter à ces contraintes. Consultez la [documentation sur la prise en charge des instantanés de démarrage dans Node.js](/fr/nodejs/api/cli#--build-snapshot).


### Prise en charge du cache de code V8 {#v8-code-cache-support}

Lorsque `useCodeCache` est défini sur `true` dans la configuration, lors de la génération du blob de préparation de l'exécutable unique, Node.js compile le script `main` pour générer le cache de code V8. Le cache de code généré fera partie du blob de préparation et sera injecté dans l'exécutable final. Lorsque l'application exécutable unique est lancée, au lieu de compiler le script `main` à partir de zéro, Node.js utilise le cache de code pour accélérer la compilation, puis exécute le script, ce qui améliore les performances de démarrage.

**Remarque :** `import()` ne fonctionne pas lorsque `useCodeCache` est défini sur `true`.

## Dans le script principal injecté {#in-the-injected-main-script}

### API d'application à exécutable unique {#single-executable-application-api}

Le module intégré `node:sea` permet d'interagir avec l'application à exécutable unique à partir du script principal JavaScript intégré à l'exécutable.

#### `sea.isSea()` {#seaissea}

**Ajouté dans : v21.7.0, v20.12.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si ce script s'exécute à l'intérieur d'une application à exécutable unique.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**Ajouté dans : v21.7.0, v20.12.0**

Cette méthode peut être utilisée pour récupérer les ressources configurées pour être regroupées dans l’application à exécutable unique au moment de la construction. Une erreur est renvoyée si aucune ressource correspondante n’est trouvée.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) : la clé de la ressource dans le dictionnaire spécifié par le champ `assets` dans la configuration de l’application à exécutable unique.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) : si spécifié, la ressource sera décodée en tant que chaîne. Tout encodage pris en charge par le `TextDecoder` est accepté. Si non spécifié, un `ArrayBuffer` contenant une copie de la ressource sera renvoyé à la place.
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Ajouté dans : v21.7.0, v20.12.0**

Similaire à [`sea.getAsset()`](/fr/nodejs/api/single-executable-applications#seagetassetkey-encoding), mais renvoie le résultat dans un [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). Une erreur est levée si aucun asset correspondant n'est trouvé.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) : la clé de l'asset dans le dictionnaire spécifié par le champ `assets` dans la configuration de l'application à exécutable unique.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un type mime optionnel pour le blob.

- Retourne : [\<Blob\>](/fr/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Ajouté dans : v21.7.0, v20.12.0**

Cette méthode peut être utilisée pour récupérer les assets configurés pour être regroupés dans l'application à exécutable unique au moment de la construction. Une erreur est levée si aucun asset correspondant n'est trouvé.

Contrairement à `sea.getAsset()` ou `sea.getAssetAsBlob()`, cette méthode ne renvoie pas une copie. Au lieu de cela, elle renvoie l'asset brut regroupé à l'intérieur de l'exécutable.

Pour l'instant, les utilisateurs doivent éviter d'écrire dans le tampon de tableau renvoyé. Si la section injectée n'est pas marquée comme accessible en écriture ou n'est pas alignée correctement, les écritures dans le tampon de tableau renvoyé sont susceptibles d'entraîner un crash.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) : la clé de l'asset dans le dictionnaire spécifié par le champ `assets` dans la configuration de l'application à exécutable unique.
- Retourne : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `require(id)` dans le script principal injecté n'est pas basé sur un fichier {#requireid-in-the-injected-main-script-is-not-file-based}

`require()` dans le script principal injecté n'est pas le même que le [`require()`](/fr/nodejs/api/modules#requireid) disponible pour les modules qui ne sont pas injectés. Il ne possède pas non plus les propriétés que [`require()`](/fr/nodejs/api/modules#requireid) non injecté possède, à l'exception de [`require.main`](/fr/nodejs/api/modules#accessing-the-main-module). Il ne peut être utilisé que pour charger des modules intégrés. Tenter de charger un module qui ne peut être trouvé que dans le système de fichiers lèvera une erreur.

Au lieu de s'appuyer sur un `require()` basé sur un fichier, les utilisateurs peuvent regrouper leur application dans un fichier JavaScript autonome à injecter dans l'exécutable. Cela garantit également un graphe de dépendances plus déterministe.

Cependant, si un `require()` basé sur un fichier est toujours nécessaire, cela peut également être réalisé :

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### `__filename` et `module.filename` dans le script principal injecté {#__filename-and-modulefilename-in-the-injected-main-script}

Les valeurs de `__filename` et `module.filename` dans le script principal injecté sont égales à [`process.execPath`](/fr/nodejs/api/process#processexecpath).

### `__dirname` dans le script principal injecté {#__dirname-in-the-injected-main-script}

La valeur de `__dirname` dans le script principal injecté est égale au nom du répertoire de [`process.execPath`](/fr/nodejs/api/process#processexecpath).

## Notes {#notes}

### Processus de création d'une application exécutable unique {#single-executable-application-creation-process}

Un outil visant à créer une application Node.js exécutable unique doit injecter le contenu du blob préparé avec `--experimental-sea-config"` dans :

- une ressource nommée `NODE_SEA_BLOB` si le binaire `node` est un fichier [PE](https://en.wikipedia.org/wiki/Portable_Executable)
- une section nommée `NODE_SEA_BLOB` dans le segment `NODE_SEA` si le binaire `node` est un fichier [Mach-O](https://en.wikipedia.org/wiki/Mach-O)
- une note nommée `NODE_SEA_BLOB` si le binaire `node` est un fichier [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

Recherchez dans le binaire la chaîne [fuse](https://www.electronjs.org/docs/latest/tutorial/fuses) `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` et remplacez le dernier caractère par `1` pour indiquer qu'une ressource a été injectée.

### Prise en charge de la plateforme {#platform-support}

La prise en charge des exécutables uniques est testée régulièrement sur CI uniquement sur les plateformes suivantes :

- Windows
- macOS
- Linux (toutes les distributions [prises en charge par Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) à l'exception d'Alpine et toutes les architectures [prises en charge par Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) à l'exception de s390x)

Cela est dû à un manque de meilleurs outils pour générer des exécutables uniques qui peuvent être utilisés pour tester cette fonctionnalité sur d'autres plateformes.

Les suggestions concernant d'autres outils/workflows d'injection de ressources sont les bienvenues. Veuillez lancer une discussion sur [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions) pour nous aider à les documenter.

