---
title: Documentation des paquets Node.js
description: Découvrez la documentation officielle de Node.js sur les paquets, y compris comment les gérer, les créer et les publier, avec des détails sur package.json, les dépendances et les outils de gestion de paquets.
head:
  - - meta
    - name: og:title
      content: Documentation des paquets Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez la documentation officielle de Node.js sur les paquets, y compris comment les gérer, les créer et les publier, avec des détails sur package.json, les dépendances et les outils de gestion de paquets.
  - - meta
    - name: twitter:title
      content: Documentation des paquets Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez la documentation officielle de Node.js sur les paquets, y compris comment les gérer, les créer et les publier, avec des détails sur package.json, les dépendances et les outils de gestion de paquets.
---


# Modules : Packages {#modules-packages}

::: info [Historique]
| Version        | Modifications                                                   |
| :------------- | :-------------------------------------------------------------- |
| v14.13.0, v12.20.0 | Ajout de la prise en charge des modèles `"exports"`.          |
| v14.6.0, v12.19.0 | Ajout du champ `"imports"` du package.                      |
| v13.7.0, v12.17.0 | Suppression du marquage conditionnel des exports.           |
| v13.7.0, v12.16.0 | Suppression de l'option `--experimental-conditional-exports`. Dans la version 12.16.0, les exports conditionnels restent derrière `--experimental-modules`. |
| v13.6.0, v12.16.0 | Suppression du marquage de l'auto-référencement d'un package à l'aide de son nom. |
| v12.7.0        | Introduction du champ `"exports"` `package.json` en tant qu'alternative plus puissante au champ `"main"` classique. |
| v12.0.0        | Ajout de la prise en charge des modules ES utilisant l'extension de fichier `.js` via le champ `"type"` `package.json`. |
:::

## Introduction {#introduction}

Un package est une arborescence de dossiers décrite par un fichier `package.json`. Le package se compose du dossier contenant le fichier `package.json` et de tous les sous-dossiers jusqu'au prochain dossier contenant un autre fichier `package.json`, ou d'un dossier nommé `node_modules`.

Cette page fournit des conseils aux auteurs de packages qui écrivent des fichiers `package.json` ainsi qu'une référence pour les champs [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) définis par Node.js.

## Détermination du système de modules {#determining-module-system}

### Introduction {#introduction_1}

Node.js traitera les éléments suivants comme des [modules ES](/fr/nodejs/api/esm) lorsqu'ils sont passés à `node` comme entrée initiale, ou lorsqu'ils sont référencés par des instructions `import` ou des expressions `import()` :

- Les fichiers avec une extension `.mjs`.
- Les fichiers avec une extension `.js` lorsque le fichier `package.json` parent le plus proche contient un champ de premier niveau [`"type"`](/fr/nodejs/api/packages#type) avec une valeur de `"module"`.
- Les chaînes passées en argument à `--eval`, ou transmises à `node` via `STDIN`, avec l'indicateur `--input-type=module`.
- Le code contenant une syntaxe analysée avec succès uniquement en tant que [modules ES](/fr/nodejs/api/esm), comme les instructions `import` ou `export` ou `import.meta`, sans marqueur explicite de la manière dont il doit être interprété. Les marqueurs explicites sont les extensions `.mjs` ou `.cjs`, les champs `"type"` `package.json` avec les valeurs `"module"` ou `"commonjs"`, ou l'indicateur `--input-type`. Les expressions dynamiques `import()` sont prises en charge dans les modules CommonJS ou ES et ne forceraient pas un fichier à être traité comme un module ES. Voir [Détection de syntaxe](/fr/nodejs/api/packages#syntax-detection).

Node.js traitera les éléments suivants comme des [CommonJS](/fr/nodejs/api/modules) lorsqu'ils sont passés à `node` comme entrée initiale, ou lorsqu'ils sont référencés par des instructions `import` ou des expressions `import()` :

- Les fichiers avec une extension `.cjs`.
- Les fichiers avec une extension `.js` lorsque le fichier `package.json` parent le plus proche contient un champ de premier niveau [`"type"`](/fr/nodejs/api/packages#type) avec une valeur de `"commonjs"`.
- Les chaînes passées en argument à `--eval` ou `--print`, ou transmises à `node` via `STDIN`, avec l'indicateur `--input-type=commonjs`.
- Les fichiers avec une extension `.js` sans fichier `package.json` parent ou lorsque le fichier `package.json` parent le plus proche n'a pas de champ `type`, et où le code peut être évalué avec succès en tant que CommonJS. En d'autres termes, Node.js essaie d'exécuter ces fichiers « ambigus » en tant que CommonJS en premier, et réessayera de les évaluer en tant que modules ES si l'évaluation en tant que CommonJS échoue parce que l'analyseur a trouvé une syntaxe de module ES.

L'écriture de la syntaxe du module ES dans des fichiers « ambigus » entraîne une perte de performance, et il est donc conseillé aux auteurs d'être explicites autant que possible. En particulier, les auteurs de packages doivent toujours inclure le champ [`"type"`](/fr/nodejs/api/packages#type) dans leurs fichiers `package.json`, même dans les packages où toutes les sources sont CommonJS. Être explicite sur le `type` du package permettra de pérenniser le package au cas où le type par défaut de Node.js changerait un jour, et cela facilitera également la tâche des outils de construction et des chargeurs pour déterminer comment les fichiers du package doivent être interprétés.


### Détection de syntaxe {#syntax-detection}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.7.0 | La détection de syntaxe est activée par défaut. |
| v21.1.0, v20.10.0 | Ajouté dans : v21.1.0, v20.10.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).2 - Version candidate
:::

Node.js inspectera le code source des entrées ambiguës pour déterminer si elles contiennent une syntaxe de module ES ; si une telle syntaxe est détectée, l'entrée sera traitée comme un module ES.

Les entrées ambiguës sont définies comme suit :

- Les fichiers avec une extension `.js` ou sans extension ; et soit aucun fichier `package.json` de contrôle, soit un fichier qui n'a pas de champ `type`.
- Entrée de chaîne (`--eval` ou `STDIN`) lorsque `--input-type` n'est pas spécifié.

La syntaxe du module ES est définie comme une syntaxe qui lèverait une exception lorsqu'elle est évaluée comme CommonJS. Cela comprend les éléments suivants :

- Instructions `import` (mais *pas* les expressions `import()`, qui sont valides dans CommonJS).
- Instructions `export`.
- Références `import.meta`.
- `await` au niveau supérieur d'un module.
- Redéclarations lexicales des variables wrapper CommonJS (`require`, `module`, `exports`, `__dirname`, `__filename`).

### Chargeurs de modules {#modules-loaders}

Node.js dispose de deux systèmes pour résoudre un spécificateur et charger des modules.

Il existe le chargeur de modules CommonJS :

- Il est entièrement synchrone.
- Il est responsable de la gestion des appels `require()`.
- Il est patchable (monkey patching).
- Il prend en charge les [dossiers en tant que modules](/fr/nodejs/api/modules#folders-as-modules).
- Lors de la résolution d'un spécificateur, si aucune correspondance exacte n'est trouvée, il essaiera d'ajouter des extensions (`.js`, `.json` et enfin `.node`) puis tentera de résoudre les [dossiers en tant que modules](/fr/nodejs/api/modules#folders-as-modules).
- Il traite `.json` comme des fichiers texte JSON.
- Les fichiers `.node` sont interprétés comme des modules d'extension compilés chargés avec `process.dlopen()`.
- Il traite tous les fichiers qui n'ont pas d'extensions `.json` ou `.node` comme des fichiers texte JavaScript.
- Il ne peut être utilisé pour [charger des modules ECMAScript à partir de modules CommonJS](/fr/nodejs/api/modules#loading-ecmascript-modules-using-require) que si le graphe des modules est synchrone (c'est-à-dire qu'il ne contient pas de `await` de niveau supérieur). Lorsqu'il est utilisé pour charger un fichier texte JavaScript qui n'est pas un module ECMAScript, le fichier sera chargé comme un module CommonJS.

Il existe le chargeur de modules ECMAScript :

- Il est asynchrone, sauf s'il est utilisé pour charger des modules pour `require()`.
- Il est responsable de la gestion des instructions `import` et des expressions `import()`.
- Il n'est pas patchable (monkey patching), peut être personnalisé à l'aide de [crochets de chargeur](/fr/nodejs/api/esm#loaders).
- Il ne prend pas en charge les dossiers en tant que modules, les index de répertoire (par exemple, `'./startup/index.js'`) doivent être entièrement spécifiés.
- Il n'effectue aucune recherche d'extension. Une extension de fichier doit être fournie lorsque le spécificateur est une URL de fichier relative ou absolue.
- Il peut charger des modules JSON, mais un attribut de type d'importation est requis.
- Il n'accepte que les extensions `.js`, `.mjs` et `.cjs` pour les fichiers texte JavaScript.
- Il peut être utilisé pour charger des modules JavaScript CommonJS. Ces modules sont transmis via `cjs-module-lexer` pour essayer d'identifier les exports nommés, qui sont disponibles s'ils peuvent être déterminés par analyse statique. Les modules CommonJS importés ont leurs URLs converties en chemins absolus, puis sont chargés via le chargeur de modules CommonJS.


### `package.json` et extensions de fichier {#packagejson-and-file-extensions}

Au sein d'un paquet, le champ [`"type"`](/fr/nodejs/api/packages#type) du [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) définit comment Node.js doit interpréter les fichiers `.js`. Si un fichier `package.json` n'a pas de champ `"type"`, les fichiers `.js` sont traités comme [CommonJS](/fr/nodejs/api/modules).

Une valeur `"type"` de `"module"` dans `package.json` indique à Node.js d'interpréter les fichiers `.js` de ce paquet comme utilisant la syntaxe [ES module](/fr/nodejs/api/esm).

Le champ `"type"` s'applique non seulement aux points d'entrée initiaux (`node my-app.js`) mais aussi aux fichiers référencés par les instructions `import` et les expressions `import()`.

```js [ESM]
// my-app.js, traité comme un module ES car il y a un fichier package.json
// dans le même dossier avec "type": "module".

import './startup/init.js';
// Chargé comme module ES car ./startup ne contient pas de fichier package.json,
// et hérite donc de la valeur "type" du niveau supérieur.

import 'commonjs-package';
// Chargé comme CommonJS car ./node_modules/commonjs-package/package.json
// n'a pas de champ "type" ou contient "type": "commonjs".

import './node_modules/commonjs-package/index.js';
// Chargé comme CommonJS car ./node_modules/commonjs-package/package.json
// n'a pas de champ "type" ou contient "type": "commonjs".
```
Les fichiers se terminant par `.mjs` sont toujours chargés comme [modules ES](/fr/nodejs/api/esm) quel que soit le `package.json` parent le plus proche.

Les fichiers se terminant par `.cjs` sont toujours chargés comme [CommonJS](/fr/nodejs/api/modules) quel que soit le `package.json` parent le plus proche.

```js [ESM]
import './legacy-file.cjs';
// Chargé comme CommonJS car .cjs est toujours chargé comme CommonJS.

import 'commonjs-package/src/index.mjs';
// Chargé comme module ES car .mjs est toujours chargé comme module ES.
```
Les extensions `.mjs` et `.cjs` peuvent être utilisées pour mélanger les types au sein du même paquet :

- Dans un paquet `"type": "module"`, Node.js peut être configuré pour interpréter un fichier particulier comme [CommonJS](/fr/nodejs/api/modules) en le nommant avec une extension `.cjs` (étant donné que les fichiers `.js` et `.mjs` sont traités comme des modules ES dans un paquet `"module"`).
- Dans un paquet `"type": "commonjs"`, Node.js peut être configuré pour interpréter un fichier particulier comme un [module ES](/fr/nodejs/api/esm) en le nommant avec une extension `.mjs` (étant donné que les fichiers `.js` et `.cjs` sont traités comme CommonJS dans un paquet `"commonjs"`).


### Indicateur `--input-type` {#--input-type-flag}

**Ajouté dans : v12.0.0**

Les chaînes de caractères passées en argument à `--eval` (ou `-e`), ou transmises à `node` via `STDIN`, sont traitées comme des [modules ES](/fr/nodejs/api/esm) lorsque l'indicateur `--input-type=module` est défini.

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
Par souci d'exhaustivité, il existe également `--input-type=commonjs`, pour exécuter explicitement une entrée de chaîne de caractères en tant que CommonJS. C'est le comportement par défaut si `--input-type` n'est pas spécifié.

## Détermination du gestionnaire de paquets {#determining-package-manager}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Bien que tous les projets Node.js soient censés pouvoir être installés par tous les gestionnaires de paquets une fois publiés, leurs équipes de développement sont souvent tenues d'utiliser un gestionnaire de paquets spécifique. Pour faciliter ce processus, Node.js est livré avec un outil appelé [Corepack](/fr/nodejs/api/corepack) qui vise à rendre tous les gestionnaires de paquets disponibles de manière transparente dans votre environnement - à condition que Node.js soit installé.

Par défaut, Corepack n'appliquera aucun gestionnaire de paquets spécifique et utilisera les versions génériques « Last Known Good » associées à chaque version de Node.js, mais vous pouvez améliorer cette expérience en définissant le champ [`"packageManager"`](/fr/nodejs/api/packages#packagemanager) dans le `package.json` de votre projet.

## Points d'entrée du paquet {#package-entry-points}

Dans le fichier `package.json` d'un paquet, deux champs peuvent définir les points d'entrée d'un paquet : [`"main"`](/fr/nodejs/api/packages#main) et [`"exports"`](/fr/nodejs/api/packages#exports). Les deux champs s'appliquent aux points d'entrée des modules ES et des modules CommonJS.

Le champ [`"main"`](/fr/nodejs/api/packages#main) est pris en charge dans toutes les versions de Node.js, mais ses capacités sont limitées : il ne définit que le point d'entrée principal du paquet.

Le champ [`"exports"`](/fr/nodejs/api/packages#exports) fournit une alternative moderne à [`"main"`](/fr/nodejs/api/packages#main) permettant de définir plusieurs points d'entrée, la prise en charge de la résolution conditionnelle des entrées entre les environnements et **d'empêcher tout autre point d'entrée que ceux définis dans <a href="#exports"><code>"exports"</code></a>**. Cette encapsulation permet aux auteurs de modules de définir clairement l'interface publique de leur paquet.

Pour les nouveaux paquets ciblant les versions actuellement prises en charge de Node.js, le champ [`"exports"`](/fr/nodejs/api/packages#exports) est recommandé. Pour les paquets prenant en charge Node.js 10 et versions antérieures, le champ [`"main"`](/fr/nodejs/api/packages#main) est requis. Si [`"exports"`](/fr/nodejs/api/packages#exports) et [`"main"`](/fr/nodejs/api/packages#main) sont tous les deux définis, le champ [`"exports"`](/fr/nodejs/api/packages#exports) est prioritaire sur [`"main"`](/fr/nodejs/api/packages#main) dans les versions prises en charge de Node.js.

Les [exports conditionnels](/fr/nodejs/api/packages#conditional-exports) peuvent être utilisés dans [`"exports"`](/fr/nodejs/api/packages#exports) pour définir différents points d'entrée de paquet par environnement, y compris si le paquet est référencé via `require` ou via `import`. Pour plus d'informations sur la prise en charge des modules CommonJS et des modules ES dans un seul paquet, veuillez consulter [la section sur les paquets double CommonJS/ES module](/fr/nodejs/api/packages#dual-commonjses-module-packages).

Les paquets existants introduisant le champ [`"exports"`](/fr/nodejs/api/packages#exports) empêcheront les consommateurs du paquet d'utiliser les points d'entrée qui ne sont pas définis, y compris le [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) (par exemple `require('your-package/package.json')`). **Il s'agira probablement d'une modification destructrice.**

Pour que l'introduction de [`"exports"`](/fr/nodejs/api/packages#exports) ne soit pas destructrice, assurez-vous que chaque point d'entrée précédemment pris en charge est exporté. Il est préférable de spécifier explicitement les points d'entrée afin que l'API publique du paquet soit bien définie. Par exemple, un projet qui exportait auparavant `main`, `lib`, `feature` et le `package.json` pourrait utiliser le `package.exports` suivant :

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
Alternativement, un projet pourrait choisir d'exporter des dossiers entiers avec et sans sous-chemins avec extension en utilisant des modèles d'exportation :

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
Ce qui précède assurant une compatibilité descendante pour toutes les versions mineures du paquet, une future modification majeure du paquet peut alors restreindre correctement les exports aux seuls exports de fonctionnalités spécifiques exposés :

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

### Point d'entrée principal de l'exportation {#main-entry-point-export}

Lors de l'écriture d'un nouveau paquet, il est recommandé d'utiliser le champ [`"exports"`](/fr/nodejs/api/packages#exports) :

```json [JSON]
{
  "exports": "./index.js"
}
```
Lorsque le champ [`"exports"`](/fr/nodejs/api/packages#exports) est défini, tous les sous-chemins du paquet sont encapsulés et ne sont plus disponibles pour les importateurs. Par exemple, `require('pkg/subpath.js')` génère une erreur [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/fr/nodejs/api/errors#err_package_path_not_exported).

Cette encapsulation des exports fournit des garanties plus fiables sur les interfaces de paquet pour les outils et lors de la gestion des mises à niveau semver pour un paquet. Ce n'est pas une encapsulation forte puisqu'une `require` directe d'un sous-chemin absolu du paquet tel que `require('/path/to/node_modules/pkg/subpath.js')` chargera toujours `subpath.js`.

Toutes les versions de Node.js actuellement prises en charge et les outils de construction modernes prennent en charge le champ `"exports"`. Pour les projets utilisant une ancienne version de Node.js ou un outil de construction associé, la compatibilité peut être obtenue en incluant le champ `"main"` à côté de `"exports"` pointant vers le même module :

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### Exports de sous-chemins {#subpath-exports}

**Ajouté dans : v12.7.0**

Lors de l'utilisation du champ [`"exports"`](/fr/nodejs/api/packages#exports), des sous-chemins personnalisés peuvent être définis avec le point d'entrée principal en traitant le point d'entrée principal comme le sous-chemin `"."` :

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
Désormais, seul le sous-chemin défini dans [`"exports"`](/fr/nodejs/api/packages#exports) peut être importé par un consommateur :

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// Charge ./node_modules/es-module-package/src/submodule.js
```
Alors que les autres sous-chemins provoqueront une erreur :

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// Lève ERR_PACKAGE_PATH_NOT_EXPORTED
```
#### Extensions dans les sous-chemins {#extensions-in-subpaths}

Les auteurs de paquets doivent fournir des sous-chemins avec extension (`import 'pkg/subpath.js'`) ou sans extension (`import 'pkg/subpath'`) dans leurs exports. Cela garantit qu'il n'y a qu'un seul sous-chemin pour chaque module exporté, de sorte que tous les dépendants importent le même spécificateur cohérent, ce qui maintient le contrat du paquet clair pour les consommateurs et simplifie les complétions des sous-chemins de paquet.

Traditionnellement, les paquets avaient tendance à utiliser le style sans extension, qui a l'avantage d'être lisible et de masquer le véritable chemin du fichier dans le paquet.

Avec les [cartes d'importation](https://github.com/WICG/import-maps) qui fournissent désormais une norme pour la résolution de paquets dans les navigateurs et autres environnements d'exécution JavaScript, l'utilisation du style sans extension peut entraîner des définitions de cartes d'importation gonflées. Les extensions de fichier explicites peuvent éviter ce problème en permettant à la carte d'importation d'utiliser un [mappage de dossiers de paquets](https://github.com/WICG/import-maps#packages-via-trailing-slashes) pour mapper plusieurs sous-chemins lorsque cela est possible au lieu d'une entrée de carte distincte par export de sous-chemin de paquet. Cela reflète également l'exigence d'utiliser [le chemin complet du spécificateur](/fr/nodejs/api/esm#mandatory-file-extensions) dans les spécificateurs d'importation relatifs et absolus.


### Sucre syntaxique pour les exports {#exports-sugar}

**Ajouté dans : v12.11.0**

Si l'export `"."` est le seul export, le champ [`"exports"`](/fr/nodejs/api/packages#exports) fournit un sucre syntaxique pour ce cas en étant la valeur directe du champ [`"exports"`](/fr/nodejs/api/packages#exports).

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
peut être écrit :

```json [JSON]
{
  "exports": "./index.js"
}
```
### Imports de sous-chemins {#subpath-imports}

**Ajouté dans : v14.6.0, v12.19.0**

En plus du champ [`"exports"`](/fr/nodejs/api/packages#exports), il existe un champ `"imports"` dans le paquet pour créer des correspondances privées qui s'appliquent uniquement aux spécificateurs d'importation à partir de l'intérieur du paquet lui-même.

Les entrées dans le champ `"imports"` doivent toujours commencer par `#` pour s'assurer qu'elles sont différenciées des spécificateurs de paquets externes.

Par exemple, le champ imports peut être utilisé pour bénéficier des avantages des exports conditionnels pour les modules internes :

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
où `import '#dep'` n'obtient pas la résolution du paquet externe `dep-node-native` (y compris ses exports à leur tour), et obtient à la place le fichier local `./dep-polyfill.js` par rapport au paquet dans d'autres environnements.

Contrairement au champ `"exports"`, le champ `"imports"` permet de mapper vers des paquets externes.

Les règles de résolution pour le champ imports sont par ailleurs analogues à celles du champ exports.

### Modèles de sous-chemins {#subpath-patterns}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.10.0, v14.19.0 | Support des suffixe de motif dans le champ "imports". |
| v16.9.0, v14.19.0 | Support des suffixe de motif. |
| v14.13.0, v12.20.0 | Ajouté dans : v14.13.0, v12.20.0 |
:::

Pour les paquets avec un petit nombre d'exports ou d'imports, nous recommandons de lister explicitement chaque entrée de sous-chemin d'exports. Mais pour les paquets qui ont un grand nombre de sous-chemins, cela pourrait entraîner un gonflement du `package.json` et des problèmes de maintenance.

Pour ces cas d'utilisation, des modèles d'exports de sous-chemins peuvent être utilisés à la place :

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
**<code>*</code> Les mappages exposent les sous-chemins imbriqués car il s'agit uniquement d'une syntaxe de remplacement de chaîne.**

Toutes les occurrences de `*` sur le côté droit seront ensuite remplacées par cette valeur, y compris si elle contient des séparateurs `/`.

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// Charge ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// Charge ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// Charge ./node_modules/es-module-package/src/internal/z.js
```
Il s'agit d'une correspondance et d'un remplacement statique direct sans aucune gestion spéciale des extensions de fichier. L'inclusion de `"*.js"` des deux côtés du mappage restreint les exports de paquets exposés aux seuls fichiers JS.

La propriété des exports étant statiquement énumérable est maintenue avec les modèles d'exports puisque les exports individuels pour un paquet peuvent être déterminés en traitant le modèle cible du côté droit comme un glob `**` par rapport à la liste des fichiers dans le paquet. Étant donné que les chemins `node_modules` sont interdits dans les cibles d'exports, cette expansion dépend uniquement des fichiers du paquet lui-même.

Pour exclure les sous-dossiers privés des motifs, des cibles `null` peuvent être utilisées :

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
// Lève : ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// Charge ./node_modules/es-module-package/src/features/x.js
```

### Exports conditionnels {#conditional-exports}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.7.0, v12.16.0 | Suppression du drapeau des exports conditionnels. |
| v13.2.0, v12.16.0 | Ajouté dans : v13.2.0, v12.16.0 |
:::

Les exports conditionnels fournissent un moyen de mapper différents chemins en fonction de certaines conditions. Ils sont pris en charge pour les importations CommonJS et les importations de modules ES.

Par exemple, un paquet qui souhaite fournir différents exports de modules ES pour `require()` et `import` peut être écrit :

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
Node.js implémente les conditions suivantes, listées par ordre de spécificité décroissante, car les conditions doivent être définies :

- `"node-addons"` - similaire à `"node"` et correspond à n'importe quel environnement Node.js. Cette condition peut être utilisée pour fournir un point d'entrée qui utilise des extensions C++ natives par opposition à un point d'entrée qui est plus universel et ne repose pas sur des extensions natives. Cette condition peut être désactivée via l'option [`--no-addons`](/fr/nodejs/api/cli#--no-addons).
- `"node"` - correspond à n'importe quel environnement Node.js. Peut être un fichier CommonJS ou un module ES. *Dans la plupart des cas, il n'est pas nécessaire d'appeler explicitement la plateforme Node.js.*
- `"import"` - correspond lorsque le paquet est chargé via `import` ou `import()`, ou via toute opération d'import ou de résolution de premier niveau par le chargeur de modules ECMAScript. S'applique quel que soit le format de module du fichier cible. *Toujours mutuellement exclusif avec <code>"require"</code>.*
- `"require"` - correspond lorsque le paquet est chargé via `require()`. Le fichier référencé doit être chargeable avec `require()`, bien que la condition corresponde quel que soit le format de module du fichier cible. Les formats attendus incluent CommonJS, JSON, les extensions natives et les modules ES. *Toujours mutuellement exclusif avec <code>"import"</code>.*
- `"module-sync"` - correspond, quel que soit le chargement du paquet via `import`, `import()` ou `require()`. Le format attendu est celui des modules ES qui ne contiennent pas d'await de premier niveau dans leur graphe de modules - si c'est le cas, `ERR_REQUIRE_ASYNC_MODULE` sera lancé lorsque le module est `require()`-ed.
- `"default"` - le repli générique qui correspond toujours. Peut être un fichier CommonJS ou un module ES. *Cette condition doit toujours venir en dernier.*

Dans l'objet [`"exports"`](/fr/nodejs/api/packages#exports), l'ordre des clés est important. Lors de la correspondance des conditions, les entrées les plus anciennes ont une priorité plus élevée et prévalent sur les entrées les plus récentes. *La règle générale est que les conditions doivent être classées de la plus spécifique à la moins spécifique dans l'ordre des objets*.

L'utilisation des conditions `"import"` et `"require"` peut entraîner certains dangers, qui sont expliqués plus en détail dans [la section sur les paquets doubles CommonJS/module ES](/fr/nodejs/api/packages#dual-commonjses-module-packages).

La condition `"node-addons"` peut être utilisée pour fournir un point d'entrée qui utilise des extensions C++ natives. Cependant, cette condition peut être désactivée via l'option [`--no-addons`](/fr/nodejs/api/cli#--no-addons). Lors de l'utilisation de `"node-addons"`, il est recommandé de traiter `"default"` comme une amélioration qui fournit un point d'entrée plus universel, par exemple en utilisant WebAssembly au lieu d'une extension native.

Les exports conditionnels peuvent également être étendus aux sous-chemins des exports, par exemple :

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
Définit un paquet où `require('pkg/feature.js')` et `import 'pkg/feature.js'` pourraient fournir différentes implémentations entre Node.js et d'autres environnements JS.

Lors de l'utilisation de branches d'environnement, incluez toujours une condition `"default"` lorsque cela est possible. Fournir une condition `"default"` garantit que tout environnement JS inconnu peut utiliser cette implémentation universelle, ce qui évite à ces environnements JS de prétendre être des environnements existants afin de prendre en charge les paquets avec des exports conditionnels. Pour cette raison, il est généralement préférable d'utiliser les branches de condition `"node"` et `"default"` plutôt que d'utiliser les branches de condition `"node"` et `"browser"`.


### Conditions imbriquées {#nested-conditions}

En plus des correspondances directes, Node.js prend également en charge les objets de conditions imbriquées.

Par exemple, pour définir un paquet qui n'a que des points d'entrée en mode dual pour une utilisation dans Node.js mais pas dans le navigateur :

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

Les conditions continuent d'être comparées dans l'ordre comme avec les conditions plates. Si une condition imbriquée n'a pas de mappage, la vérification des conditions restantes de la condition parent se poursuivra. De cette façon, les conditions imbriquées se comportent de manière analogue aux instructions `if` imbriquées en JavaScript.

### Résolution des conditions utilisateur {#resolving-user-conditions}

**Ajouté dans : v14.9.0, v12.19.0**

Lors de l'exécution de Node.js, des conditions utilisateur personnalisées peuvent être ajoutées avec l'indicateur `--conditions` :

```bash [BASH]
node --conditions=development index.js
```

ce qui résoudrait alors la condition `"development"` dans les importations et exportations de paquets, tout en résolvant les conditions existantes `"node"`, `"node-addons"`, `"default"`, `"import"` et `"require"` comme il convient.

Un nombre quelconque de conditions personnalisées peut être défini avec des indicateurs répétés.

Les conditions typiques ne doivent contenir que des caractères alphanumériques, en utilisant ":", "-" ou "=" comme séparateurs si nécessaire. Tout le reste peut entraîner des problèmes de compatibilité en dehors de Node.

Dans Node, les conditions ont très peu de restrictions, mais celles-ci incluent spécifiquement :

### Définitions de conditions communautaires {#community-conditions-definitions}

Les chaînes de condition autres que les conditions `"import"`, `"require"`, `"node"`, `"module-sync"`, `"node-addons"` et `"default"` [implémentées dans le cœur de Node.js](/fr/nodejs/api/packages#conditional-exports) sont ignorées par défaut.

D'autres plateformes peuvent implémenter d'autres conditions, et les conditions utilisateur peuvent être activées dans Node.js via l'indicateur [`--conditions` / `-C`](/fr/nodejs/api/packages#resolving-user-conditions).

Étant donné que les conditions de paquet personnalisées nécessitent des définitions claires pour garantir une utilisation correcte, une liste des conditions de paquet connues et courantes et de leurs définitions strictes est fournie ci-dessous pour faciliter la coordination de l'écosystème.

- `"types"` - peut être utilisé par les systèmes de saisie pour résoudre le fichier de saisie pour l'exportation donnée. *Cette condition doit toujours être incluse en premier.*
- `"browser"` - tout environnement de navigateur Web.
- `"development"` - peut être utilisé pour définir un point d'entrée d'environnement réservé au développement, par exemple pour fournir un contexte de débogage supplémentaire tel que de meilleurs messages d'erreur lors de l'exécution en mode développement. *Doit toujours être mutuellement exclusif avec <code>"production"</code>.*
- `"production"` - peut être utilisé pour définir un point d'entrée d'environnement de production. *Doit toujours être mutuellement exclusif avec <code>"development"</code>.*

Pour les autres environnements d'exécution, les définitions de clés de condition spécifiques à la plateforme sont gérées par [WinterCG](https://wintercg.org/) dans la spécification de proposition [Runtime Keys](https://runtime-keys.proposal.wintercg.org/).

De nouvelles définitions de conditions peuvent être ajoutées à cette liste en créant une requête d'extraction vers la [documentation Node.js pour cette section](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions). Les exigences pour répertorier une nouvelle définition de condition ici sont les suivantes :

- La définition doit être claire et non ambiguë pour tous les implémenteurs.
- Le cas d'utilisation expliquant pourquoi la condition est nécessaire doit être clairement justifié.
- Il doit exister une utilisation d'implémentation existante suffisante.
- Le nom de la condition ne doit pas entrer en conflit avec une autre définition de condition ou une condition largement utilisée.
- La liste de la définition de condition doit fournir un avantage de coordination à l'écosystème qui ne serait pas possible autrement. Par exemple, ce ne serait pas nécessairement le cas pour les conditions spécifiques à l'entreprise ou à l'application.
- La condition doit être telle qu'un utilisateur de Node.js s'attendrait à ce qu'elle figure dans la documentation principale de Node.js. La condition `"types"` en est un bon exemple : elle n'a pas vraiment sa place dans la proposition [Runtime Keys](https://runtime-keys.proposal.wintercg.org/), mais elle convient bien ici dans la documentation Node.js.

Les définitions ci-dessus peuvent être déplacées vers un registre de conditions dédié en temps voulu.


### Auto-référencement d'un paquet en utilisant son nom {#self-referencing-a-package-using-its-name}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.6.0, v12.16.0 | Suppression du marquage de l'auto-référencement d'un paquet en utilisant son nom. |
| v13.1.0, v12.16.0 | Ajouté dans : v13.1.0, v12.16.0 |
:::

Au sein d'un paquet, les valeurs définies dans le champ [`"exports"`](/fr/nodejs/api/packages#exports) du fichier `package.json` du paquet peuvent être référencées via le nom du paquet. Par exemple, en supposant que le `package.json` soit :

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
Alors tout module *dans ce paquet* peut référencer une exportation dans le paquet lui-même :

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // Importe "something" depuis ./index.mjs.
```
L'auto-référencement n'est disponible que si `package.json` a [`"exports"`](/fr/nodejs/api/packages#exports), et permettra d'importer uniquement ce que [`"exports"`](/fr/nodejs/api/packages#exports) (dans le `package.json`) autorise. Ainsi, le code ci-dessous, étant donné le paquet précédent, générera une erreur d'exécution :

```js [ESM]
// ./another-module.mjs

// Importe "another" depuis ./m.mjs. Échoue car
// le champ "exports" de "package.json"
// ne fournit pas d'exportation nommée "./m.mjs".
import { another } from 'a-package/m.mjs';
```
L'auto-référencement est également disponible lors de l'utilisation de `require`, à la fois dans un module ES et dans un module CommonJS. Par exemple, ce code fonctionnera également :

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // Charge depuis ./foo.js.
```
Enfin, l'auto-référencement fonctionne également avec les paquets à portée. Par exemple, ce code fonctionnera également :

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
## Paquets doubles CommonJS/module ES {#dual-commonjs/es-module-packages}

Voir [le dépôt d'exemples de paquets](https://github.com/nodejs/package-examples) pour plus de détails.

## Définitions de champs `package.json` Node.js {#nodejs-packagejson-field-definitions}

Cette section décrit les champs utilisés par l'exécution Node.js. D'autres outils (tels que [npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)) utilisent des champs supplémentaires qui sont ignorés par Node.js et non documentés ici.

Les champs suivants dans les fichiers `package.json` sont utilisés dans Node.js :

- [`"name"`](/fr/nodejs/api/packages#name) - Pertinent lors de l'utilisation d'importations nommées dans un paquet. Également utilisé par les gestionnaires de paquets comme nom du paquet.
- [`"main"`](/fr/nodejs/api/packages#main) - Le module par défaut lors du chargement du paquet, si les exports ne sont pas spécifiés, et dans les versions de Node.js antérieures à l'introduction des exports.
- [`"packageManager"`](/fr/nodejs/api/packages#packagemanager) - Le gestionnaire de paquets recommandé lors de la contribution au paquet. Tiré parti par les shims [Corepack](/fr/nodejs/api/corepack).
- [`"type"`](/fr/nodejs/api/packages#type) - Le type de paquet déterminant s'il faut charger les fichiers `.js` comme CommonJS ou comme modules ES.
- [`"exports"`](/fr/nodejs/api/packages#exports) - Exports de paquets et exports conditionnels. Lorsqu'il est présent, limite les sous-modules qui peuvent être chargés à partir du paquet.
- [`"imports"`](/fr/nodejs/api/packages#imports) - Importations de paquets, pour une utilisation par les modules au sein du paquet lui-même.


### `"name"` {#"name"}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.6.0, v12.16.0 | Suppression de l'option `--experimental-resolve-self`. |
| v13.1.0, v12.16.0 | Ajouté dans : v13.1.0, v12.16.0 |
:::

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "nom-du-package"
}
```
Le champ `"name"` définit le nom de votre package. La publication sur le registre *npm* nécessite un nom qui satisfait [certaines exigences](https://docs.npmjs.com/files/package.json#name).

Le champ `"name"` peut être utilisé en plus du champ [`"exports"`](/fr/nodejs/api/packages#exports) pour [s'auto-référencer](/fr/nodejs/api/packages#self-referencing-a-package-using-its-name) un package en utilisant son nom.

### `"main"` {#"main"}

**Ajouté dans : v0.4.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
Le champ `"main"` définit le point d'entrée d'un package lorsqu'il est importé par son nom via une recherche `node_modules`. Sa valeur est un chemin.

Lorsqu'un package a un champ [`"exports"`](/fr/nodejs/api/packages#exports), celui-ci prévaudra sur le champ `"main"` lors de l'importation du package par son nom.

Il définit également le script qui est utilisé lorsque le [répertoire du package est chargé via `require()`](/fr/nodejs/api/modules#folders-as-modules).

```js [CJS]
// Cela se résout en ./path/to/directory/index.js.
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**Ajouté dans : v16.9.0, v14.19.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<nom du gestionnaire de paquets>@<version>"
}
```
Le champ `"packageManager"` définit quel gestionnaire de paquets doit être utilisé lorsque l'on travaille sur le projet actuel. Il peut être défini sur n'importe lequel des [gestionnaires de paquets supportés](/fr/nodejs/api/corepack#supported-package-managers), et garantira que vos équipes utilisent exactement les mêmes versions de gestionnaire de paquets sans avoir à installer quoi que ce soit d'autre que Node.js.

Ce champ est actuellement expérimental et nécessite une activation ; consultez la page [Corepack](/fr/nodejs/api/corepack) pour plus de détails sur la procédure.


### `"type"` {#"type"}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.2.0, v12.17.0 | Suppression du flag `--experimental-modules`. |
| v12.0.0 | Ajouté dans : v12.0.0 |
:::

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le champ `"type"` définit le format de module que Node.js utilise pour tous les fichiers `.js` qui ont ce fichier `package.json` comme parent le plus proche.

Les fichiers se terminant par `.js` sont chargés en tant que modules ES lorsque le fichier `package.json` parent le plus proche contient un champ de niveau supérieur `"type"` avec une valeur de `"module"`.

Le `package.json` parent le plus proche est défini comme le premier `package.json` trouvé lors de la recherche dans le dossier actuel, le dossier parent de ce dossier, et ainsi de suite jusqu'à ce qu'un dossier node_modules ou la racine du volume soit atteinte.

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# Dans le même dossier que le package.json précédent {#in-same-folder-as-preceding-packagejson}
node my-app.js # S'exécute en tant que module ES
```
Si le `package.json` parent le plus proche n'a pas de champ `"type"`, ou contient `"type": "commonjs"`, les fichiers `.js` sont traités comme [CommonJS](/fr/nodejs/api/modules). Si la racine du volume est atteinte et qu'aucun `package.json` n'est trouvé, les fichiers `.js` sont traités comme [CommonJS](/fr/nodejs/api/modules).

Les instructions `import` des fichiers `.js` sont traitées comme des modules ES si le `package.json` parent le plus proche contient `"type": "module"`.

```js [ESM]
// my-app.js, qui fait partie du même exemple que ci-dessus
import './startup.js'; // Chargé en tant que module ES à cause du package.json
```
Quelle que soit la valeur du champ `"type"`, les fichiers `.mjs` sont toujours traités comme des modules ES et les fichiers `.cjs` sont toujours traités comme CommonJS.

### `"exports"` {#"exports"}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.13.0, v12.20.0 | Ajout du support des modèles `"exports"`. |
| v13.7.0, v12.17.0 | Suppression du flag des exports conditionnels. |
| v13.7.0, v12.16.0 | Implémentation de l'ordonnancement logique des exports conditionnels. |
| v13.7.0, v12.16.0 | Suppression de l'option `--experimental-conditional-exports`. Dans la version 12.16.0, les exports conditionnels sont toujours derrière `--experimental-modules`. |
| v13.2.0, v12.16.0 | Implémentation des exports conditionnels. |
| v12.7.0 | Ajouté dans : v12.7.0 |
:::

- Type : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
Le champ `"exports"` permet de définir les [points d'entrée](/fr/nodejs/api/packages#package-entry-points) d'un package lorsqu'il est importé par nom, chargé soit via une recherche `node_modules`, soit par une [auto-référence](/fr/nodejs/api/packages#self-referencing-a-package-using-its-name) à son propre nom. Il est pris en charge dans Node.js 12+ comme alternative à [`"main"`](/fr/nodejs/api/packages#main) qui peut prendre en charge la définition de [subpath exports](/fr/nodejs/api/packages#subpath-exports) et de [conditional exports](/fr/nodejs/api/packages#conditional-exports) tout en encapsulant les modules internes non exportés.

Les [Exports Conditionnels](/fr/nodejs/api/packages#conditional-exports) peuvent également être utilisés dans `"exports"` pour définir différents points d'entrée de package par environnement, y compris si le package est référencé via `require` ou via `import`.

Tous les chemins définis dans `"exports"` doivent être des URL de fichiers relatives commençant par `./`.


### `"imports"` {#"imports"}

**Ajouté dans : v14.6.0, v12.19.0**

- Type : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

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
Les entrées dans le champ imports doivent être des chaînes de caractères commençant par `#`.

Les importations de paquets permettent le mappage vers des paquets externes.

Ce champ définit les [importations de sous-chemin](/fr/nodejs/api/packages#subpath-imports) pour le paquet actuel.

