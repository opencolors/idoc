---
title: Support de TypeScript dans Node.js
description: Découvrez comment utiliser TypeScript avec Node.js, y compris l'installation, la configuration et les meilleures pratiques pour intégrer TypeScript dans vos projets Node.js.
head:
  - - meta
    - name: og:title
      content: Support de TypeScript dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment utiliser TypeScript avec Node.js, y compris l'installation, la configuration et les meilleures pratiques pour intégrer TypeScript dans vos projets Node.js.
  - - meta
    - name: twitter:title
      content: Support de TypeScript dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment utiliser TypeScript avec Node.js, y compris l'installation, la configuration et les meilleures pratiques pour intégrer TypeScript dans vos projets Node.js.
---


# Modules: TypeScript {#modules-typescript}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.7.0 | Ajout du flag `--experimental-transform-types`. |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

## Activation {#enabling}

Il existe deux façons d'activer le support de TypeScript au runtime dans Node.js :

## Support complet de TypeScript {#full-typescript-support}

Pour utiliser TypeScript avec un support complet de toutes les fonctionnalités de TypeScript, y compris `tsconfig.json`, vous pouvez utiliser un paquet tiers. Ces instructions utilisent [`tsx`](https://tsx.is/) comme exemple, mais il existe de nombreuses autres bibliothèques similaires disponibles.

## Suppression des types {#type-stripping}

**Ajouté dans : v22.6.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Le flag [`--experimental-strip-types`](/fr/nodejs/api/cli#--experimental-strip-types) permet à Node.js d'exécuter des fichiers TypeScript. Par défaut, Node.js exécutera uniquement les fichiers qui ne contiennent pas de fonctionnalités TypeScript nécessitant une transformation, telles que les enums ou les namespaces. Node.js remplacera les annotations de type en ligne par des espaces blancs, et aucune vérification de type n'est effectuée. Pour activer la transformation de telles fonctionnalités, utilisez le flag [`--experimental-transform-types`](/fr/nodejs/api/cli#--experimental-transform-types). Les fonctionnalités TypeScript qui dépendent des paramètres dans `tsconfig.json`, tels que les chemins ou la conversion d'une syntaxe JavaScript plus récente en normes plus anciennes, ne sont intentionnellement pas prises en charge. Pour obtenir un support complet de TypeScript, consultez [Support complet de TypeScript](/fr/nodejs/api/typescript#full-typescript-support).

La fonctionnalité de suppression de types est conçue pour être légère. En ne prenant intentionnellement pas en charge les syntaxes qui nécessitent la génération de code JavaScript, et en remplaçant les types en ligne par des espaces blancs, Node.js peut exécuter du code TypeScript sans avoir besoin de source maps.

La suppression de types fonctionne avec la plupart des versions de TypeScript, mais nous recommandons la version 5.7 ou plus récente avec les paramètres `tsconfig.json` suivants :

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

### Détermination du système de modules {#determining-module-system}

Node.js prend en charge à la fois la syntaxe [CommonJS](/fr/nodejs/api/modules) et [ES Modules](/fr/nodejs/api/esm) dans les fichiers TypeScript. Node.js ne convertira pas d'un système de modules à un autre ; si vous souhaitez que votre code s'exécute en tant que module ES, vous devez utiliser la syntaxe `import` et `export`, et si vous souhaitez que votre code s'exécute en tant que CommonJS, vous devez utiliser `require` et `module.exports`.

- Les fichiers `.ts` auront leur système de modules déterminé [de la même manière que les fichiers `.js`.](/fr/nodejs/api/packages#determining-module-system) Pour utiliser la syntaxe `import` et `export`, ajoutez `"type": "module"` au `package.json` parent le plus proche.
- Les fichiers `.mts` seront toujours exécutés en tant que modules ES, de manière similaire aux fichiers `.mjs`.
- Les fichiers `.cts` seront toujours exécutés en tant que modules CommonJS, de manière similaire aux fichiers `.cjs`.
- Les fichiers `.tsx` ne sont pas pris en charge.

Comme dans les fichiers JavaScript, [les extensions de fichiers sont obligatoires](/fr/nodejs/api/esm#mandatory-file-extensions) dans les instructions `import` et les expressions `import()` : `import './file.ts'`, pas `import './file'`. En raison de la rétrocompatibilité, les extensions de fichiers sont également obligatoires dans les appels `require()` : `require('./file.ts')`, pas `require('./file')`, de la même manière que l'extension `.cjs` est obligatoire dans les appels `require` dans les fichiers CommonJS.

L'option `tsconfig.json` `allowImportingTsExtensions` permettra au compilateur TypeScript `tsc` de vérifier le typage des fichiers avec des spécificateurs `import` qui incluent l'extension `.ts`.

### Fonctionnalités TypeScript {#typescript-features}

Étant donné que Node.js supprime uniquement les types en ligne, toute fonctionnalité TypeScript impliquant le *remplacement* de la syntaxe TypeScript par une nouvelle syntaxe JavaScript entraînera une erreur, à moins que l'indicateur [`--experimental-transform-types`](/fr/nodejs/api/cli#--experimental-transform-types) ne soit passé.

Les fonctionnalités les plus importantes qui nécessitent une transformation sont :

- `Enum`
- `namespaces`
- `legacy module`
- propriétés des paramètres

Étant donné que les décorateurs sont actuellement une [proposition TC39 de l'étape 3](https://github.com/tc39/proposal-decorators) et seront bientôt pris en charge par le moteur JavaScript, ils ne sont pas transformés et entraîneront une erreur d'analyse. Il s'agit d'une limitation temporaire qui sera résolue à l'avenir.

De plus, Node.js ne lit pas les fichiers `tsconfig.json` et ne prend pas en charge les fonctionnalités qui dépendent des paramètres de `tsconfig.json`, telles que les chemins ou la conversion d'une syntaxe JavaScript plus récente en normes plus anciennes.


### Importer des types sans le mot-clé `type` {#importing-types-without-type-keyword}

En raison de la nature de la suppression des types, le mot-clé `type` est nécessaire pour supprimer correctement les importations de types. Sans le mot-clé `type`, Node.js traitera l'importation comme une importation de valeur, ce qui entraînera une erreur d'exécution. L'option [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) de tsconfig peut être utilisée pour correspondre à ce comportement.

Cet exemple fonctionnera correctement :

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
Ceci entraînera une erreur d'exécution :

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### Formes d'entrée autres que les fichiers {#non-file-forms-of-input}

La suppression de type peut être activée pour `--eval`. Le système de modules sera déterminé par `--input-type`, comme pour JavaScript.

La syntaxe TypeScript n'est pas prise en charge dans le REPL, l'entrée STDIN, `--print`, `--check` et `inspect`.

### Cartes de sources {#source-maps}

Étant donné que les types en ligne sont remplacés par des espaces blancs, les cartes de sources ne sont pas nécessaires pour des numéros de ligne corrects dans les traces de pile ; et Node.js ne les génère pas. Lorsque [`--experimental-transform-types`](/fr/nodejs/api/cli#--experimental-transform-types) est activé, les cartes de sources sont activées par défaut.

### Suppression de type dans les dépendances {#type-stripping-in-dependencies}

Afin de décourager les auteurs de packages de publier des packages écrits en TypeScript, Node.js refusera par défaut de traiter les fichiers TypeScript dans les dossiers situés sous un chemin `node_modules`.

### Alias de chemins {#paths-aliases}

Les "chemins" [`tsconfig`](https://www.typescriptlang.org/tsconfig/#paths) ne seront pas transformés et produiront donc une erreur. La fonctionnalité la plus proche disponible est [les importations de sous-chemins](/fr/nodejs/api/packages#subpath-imports) avec la limitation qu'elles doivent commencer par `#`.

