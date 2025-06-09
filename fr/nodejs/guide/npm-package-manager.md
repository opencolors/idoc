---
title: Guide complet de npm, le gestionnaire de packages Node.js
description: Apprenez à utiliser npm pour gérer les dépendances, installer et mettre à jour des packages et exécuter des tâches dans vos projets Node.js.
head:
  - - meta
    - name: og:title
      content: Guide complet de npm, le gestionnaire de packages Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Apprenez à utiliser npm pour gérer les dépendances, installer et mettre à jour des packages et exécuter des tâches dans vos projets Node.js.
  - - meta
    - name: twitter:title
      content: Guide complet de npm, le gestionnaire de packages Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Apprenez à utiliser npm pour gérer les dépendances, installer et mettre à jour des packages et exécuter des tâches dans vos projets Node.js.
---


# Une introduction au gestionnaire de paquets npm

## Introduction à npm

`npm` est le gestionnaire de paquets standard pour Node.js.

En septembre 2022, plus de 2,1 millions de paquets étaient répertoriés dans le registre npm, ce qui en fait le plus grand référentiel de code de langage unique au monde, et vous pouvez être sûr qu'il existe un paquet pour (presque !) tout.

Il a commencé comme un moyen de télécharger et de gérer les dépendances des paquets Node.js, mais il est depuis devenu un outil également utilisé dans le JavaScript frontend.

::: tip
`Yarn` et `pnpm` sont des alternatives à l'interface de ligne de commande npm. Vous pouvez également les consulter.
:::

## Paquets

### Installation de toutes les dépendances

Vous pouvez installer toutes les dépendances répertoriées dans votre fichier `package.json` en exécutant :

```bash
npm install
```

Cela installera tout ce dont le projet a besoin, dans le dossier `node_modules`, en le créant s'il n'existe pas déjà.

### Installation d'un seul paquet

Vous pouvez installer un seul paquet en exécutant :

```bash
npm install <nom-du-paquet>
```

De plus, depuis npm 5, cette commande ajoute `<nom-du-paquet>` aux dépendances du fichier `package.json`. Avant la version 5, vous deviez ajouter l'indicateur `--save`.

Vous verrez souvent d'autres indicateurs ajoutés à cette commande :

+ `--save-dev` (ou `-D`) qui ajoute le paquet à la section `devDependencies` du fichier `package.json`.
+ `--no-save` qui empêche l'enregistrement du paquet dans le fichier `package.json`.
+ `--no-optional` qui empêche l'installation des dépendances optionnelles.
+ `--save-optional` qui ajoute le paquet à la section `optionalDependencies` du fichier `package.json`.

Des raccourcis des indicateurs peuvent également être utilisés :

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

La différence entre devDependencies et dependencies est que le premier contient des outils de développement, comme une bibliothèque de test, tandis que le second est fourni avec l'application en production.

Quant aux optionalDependencies, la différence est que l'échec de la compilation de la dépendance n'entraînera pas l'échec de l'installation. Mais il est de la responsabilité de votre programme de gérer l'absence de la dépendance. Pour en savoir plus sur les [dépendances optionnelles](https://docs.npmjs.com/cli/v10/using-npm/config#optional).


### Mise à jour des paquets
La mise à jour est également facilitée, en exécutant

```bash
npm update
```

Cela mettra à jour toutes les dépendances vers leur dernière version.

Vous pouvez également spécifier un seul paquet à mettre à jour :

```bash
npm update <package-name>
```

### Suppression des paquets

Pour supprimer un paquet, vous pouvez exécuter :

```bash
npm uninstall <package-name>
```

### Gestion des versions
En plus des téléchargements simples, `npm` gère également la gestion des versions, vous pouvez donc spécifier une version spécifique d'un paquet, ou exiger une version supérieure ou inférieure à celle dont vous avez besoin.

Souvent, vous constaterez qu'une bibliothèque n'est compatible qu'avec une version majeure d'une autre bibliothèque.

Ou un bug dans la dernière version d'une lib, toujours non corrigé, cause un problème.

La spécification d'une version explicite d'une bibliothèque permet également de s'assurer que tout le monde utilise exactement la même version d'un paquet, de sorte que toute l'équipe utilise la même version jusqu'à ce que le fichier `package.json` soit mis à jour.

Dans tous ces cas, la gestion des versions est d'une grande aide, et `npm` suit la norme de [version sémantique (semver)](https://semver.org/lang/fr/).

Vous pouvez installer une version spécifique d'un paquet, en exécutant

```bash
npm install <package-name>@<version>
```

Vous pouvez également installer la dernière version d'un paquet, en exécutant

```bash
npm install <package-name>@latest
```

### Exécution des tâches
Le fichier package.json prend en charge un format pour spécifier les tâches de ligne de commande qui peuvent être exécutées en utilisant

```bash
npm run <task-name>
```

Par exemple, si vous avez un fichier package.json avec le contenu suivant :

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

Il est très courant d'utiliser cette fonctionnalité pour exécuter Webpack :

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

Ainsi, au lieu de taper ces longues commandes, qu'il est facile d'oublier ou de mal taper, vous pouvez exécuter

```bash
npm run watch
npm run dev
npm run prod
```

