---
title: Documentation de Corepack de Node.js
description: Corepack est un binaire fourni avec Node.js, offrant une interface standard pour gérer les gestionnaires de paquets comme npm, pnpm et Yarn. Il permet aux utilisateurs de basculer facilement entre différents gestionnaires de paquets et versions, garantissant la compatibilité et simplifiant le flux de travail de développement.
head:
  - - meta
    - name: og:title
      content: Documentation de Corepack de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Corepack est un binaire fourni avec Node.js, offrant une interface standard pour gérer les gestionnaires de paquets comme npm, pnpm et Yarn. Il permet aux utilisateurs de basculer facilement entre différents gestionnaires de paquets et versions, garantissant la compatibilité et simplifiant le flux de travail de développement.
  - - meta
    - name: twitter:title
      content: Documentation de Corepack de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Corepack est un binaire fourni avec Node.js, offrant une interface standard pour gérer les gestionnaires de paquets comme npm, pnpm et Yarn. Il permet aux utilisateurs de basculer facilement entre différents gestionnaires de paquets et versions, garantissant la compatibilité et simplifiant le flux de travail de développement.
---


# Corepack {#corepack}

**Ajouté dans : v16.9.0, v14.19.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>* est un outil expérimental pour aider à gérer les versions de vos gestionnaires de paquets. Il expose des proxys binaires pour chaque [gestionnaire de paquets pris en charge](/fr/nodejs/api/corepack#supported-package-managers) qui, lorsqu'ils sont appelés, identifieront le gestionnaire de paquets configuré pour le projet actuel, le téléchargeront si nécessaire et finiront par l'exécuter.

Bien que Corepack soit distribué avec les installations par défaut de Node.js, les gestionnaires de paquets gérés par Corepack ne font pas partie de la distribution de Node.js et :

- Lors de la première utilisation, Corepack télécharge la dernière version depuis le réseau.
- Toute mise à jour requise (liée à des vulnérabilités de sécurité ou autre) ne relève pas du projet Node.js. Si nécessaire, les utilisateurs finaux doivent trouver comment mettre à jour par eux-mêmes.

Cette fonctionnalité simplifie deux flux de travail principaux :

- Elle facilite l'intégration des nouveaux contributeurs, car ils n'auront plus à suivre les processus d'installation spécifiques au système simplement pour avoir le gestionnaire de paquets que vous souhaitez.
- Elle vous permet de vous assurer que chaque membre de votre équipe utilisera exactement la version du gestionnaire de paquets que vous souhaitez qu'ils utilisent, sans qu'ils aient à la synchroniser manuellement chaque fois que vous devez effectuer une mise à jour.

## Flux de travail {#workflows}

### Activation de la fonctionnalité {#enabling-the-feature}

En raison de son statut expérimental, Corepack doit actuellement être activé explicitement pour avoir un effet. Pour ce faire, exécutez [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name), ce qui configurera les liens symboliques dans votre environnement à côté du binaire `node` (et écrasera les liens symboliques existants si nécessaire).

À partir de ce moment, tout appel aux [binaires pris en charge](/fr/nodejs/api/corepack#supported-package-managers) fonctionnera sans configuration supplémentaire. Si vous rencontrez un problème, exécutez [`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name) pour supprimer les proxys de votre système (et envisagez d'ouvrir un problème sur le [dépôt Corepack](https://github.com/nodejs/corepack) pour nous le faire savoir).


### Configuration d'un paquet {#configuring-a-package}

Les proxys Corepack trouveront le fichier [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) le plus proche dans votre hiérarchie de répertoires actuelle pour extraire sa propriété [`"packageManager"`](/fr/nodejs/api/packages#packagemanager).

Si la valeur correspond à un [gestionnaire de paquets pris en charge](/fr/nodejs/api/corepack#supported-package-managers), Corepack s'assurera que tous les appels aux binaires concernés sont exécutés avec la version demandée, en la téléchargeant à la demande si nécessaire, et en abandonnant si elle ne peut pas être récupérée avec succès.

Vous pouvez utiliser [`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion) pour demander à Corepack de mettre à jour votre fichier `package.json` local afin d'utiliser le gestionnaire de paquets de votre choix :

```bash [BASH]
corepack use  # définit la dernière version 7.x dans le package.json
corepack use yarn@* # définit la dernière version dans le package.json
```
### Mise à niveau des versions globales {#upgrading-the-global-versions}

Lorsqu'il est exécuté en dehors d'un projet existant (par exemple, lors de l'exécution de `yarn init`), Corepack utilisera par défaut des versions prédéfinies correspondant approximativement aux dernières versions stables de chaque outil. Ces versions peuvent être remplacées en exécutant la commande [`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion) avec la version du gestionnaire de paquets que vous souhaitez définir :

```bash [BASH]
corepack install --global
```
Alternativement, une balise ou une plage peut être utilisée :

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### Flux de travail hors ligne {#offline-workflow}

De nombreux environnements de production n'ont pas d'accès au réseau. Étant donné que Corepack télécharge généralement les versions du gestionnaire de paquets directement à partir de leurs registres, cela peut entrer en conflit avec ces environnements. Pour éviter que cela ne se produise, appelez la commande [`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion) pendant que vous avez encore un accès réseau (généralement en même temps que vous préparez votre image de déploiement). Cela garantira que les gestionnaires de paquets requis sont disponibles même sans accès réseau.

La commande `pack` possède [divers indicateurs](https://github.com/nodejs/corepack#utility-commands). Consultez la [documentation Corepack](https://github.com/nodejs/corepack#readme) détaillée pour plus d'informations.


## Gestionnaires de paquets pris en charge {#supported-package-managers}

Les binaires suivants sont fournis via Corepack :

| Gestionnaire de paquets | Noms des binaires |
| --- | --- |
| [Yarn](https://yarnpkg.com/) | `yarn`  ,   `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`  ,   `pnpx` |
## Questions fréquentes {#common-questions}

### Comment Corepack interagit-il avec npm ? {#how-does-corepack-interact-with-npm?}

Bien que Corepack puisse prendre en charge npm comme n’importe quel autre gestionnaire de paquets, ses shims ne sont pas activés par défaut. Cela a quelques conséquences :

- Il est toujours possible d’exécuter une commande `npm` dans un projet configuré pour être utilisé avec un autre gestionnaire de paquets, car Corepack ne peut pas l’intercepter.
- Bien que `npm` soit une option valide dans la propriété [`"packageManager"`](/fr/nodejs/api/packages#packagemanager), l’absence de shim entraînera l’utilisation du npm global.

### L’exécution de `npm install -g yarn` ne fonctionne pas {#running-npm-install--g-yarn-doesnt-work}

npm empêche de remplacer accidentellement les binaires Corepack lors d’une installation globale. Pour éviter ce problème, envisagez l’une des options suivantes :

- N’exécutez pas cette commande ; Corepack fournira de toute façon les binaires du gestionnaire de paquets et s’assurera que les versions demandées sont toujours disponibles, il n’est donc pas nécessaire d’installer explicitement les gestionnaires de paquets.
- Ajoutez l’indicateur `--force` à `npm install` ; cela indiquera à npm qu’il est acceptable de remplacer les binaires, mais vous effacerez les binaires Corepack dans le processus. (Exécutez [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) pour les rajouter.)

