---
title: Blocage et non-blocage dans Node.js
description: Cet article explique la différence entre les appels bloquants et non bloquants dans Node.js, notamment leur impact sur la boucle d'événements et la concurrence.
head:
  - - meta
    - name: og:title
      content: Blocage et non-blocage dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cet article explique la différence entre les appels bloquants et non bloquants dans Node.js, notamment leur impact sur la boucle d'événements et la concurrence.
  - - meta
    - name: twitter:title
      content: Blocage et non-blocage dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cet article explique la différence entre les appels bloquants et non bloquants dans Node.js, notamment leur impact sur la boucle d'événements et la concurrence.
---


# Aperçu du blocage et du non-blocage

Cet aperçu couvre la différence entre les appels bloquants et non bloquants dans Node.js. Cet aperçu fera référence à la boucle d'événements et à libuv, mais aucune connaissance préalable de ces sujets n'est requise. On suppose que les lecteurs ont une compréhension de base du langage JavaScript et du [modèle de rappel](/fr/nodejs/guide/javascript-asynchronous-programming-and-callbacks) de Node.js.

::: info
"E/S" se réfère principalement à l'interaction avec le disque et le réseau du système pris en charge par [libuv](https://libuv.org/).
:::

## Blocage

Le **blocage** se produit lorsque l'exécution de JavaScript supplémentaire dans le processus Node.js doit attendre la fin d'une opération non-JavaScript. Cela se produit parce que la boucle d'événements ne peut pas continuer à exécuter JavaScript pendant qu'une opération de **blocage** est en cours.

Dans Node.js, le JavaScript qui présente de mauvaises performances en raison d'une forte utilisation du processeur plutôt que d'une attente d'une opération non-JavaScript, telle que les E/S, n'est généralement pas qualifié de **blocage**. Les méthodes synchrones de la bibliothèque standard Node.js qui utilisent libuv sont les opérations de **blocage** les plus couramment utilisées. Les modules natifs peuvent également avoir des méthodes de **blocage**.

Toutes les méthodes d'E/S de la bibliothèque standard Node.js fournissent des versions asynchrones, qui sont **non bloquantes**, et acceptent les fonctions de rappel. Certaines méthodes ont également des homologues **bloquants**, dont les noms se terminent par `Sync`.

## Comparaison du code

Les méthodes **bloquantes** s'exécutent de manière **synchrone** et les méthodes **non bloquantes** s'exécutent de manière **asynchrone**.

En utilisant le module File System comme exemple, voici une lecture de fichier **synchrone** :

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // bloque ici jusqu'à ce que le fichier soit lu
```

Et voici un exemple **asynchrone** équivalent :

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
})
```

Le premier exemple semble plus simple que le second, mais il a l'inconvénient que la deuxième ligne **bloque** l'exécution de tout JavaScript supplémentaire jusqu'à ce que l'ensemble du fichier soit lu. Notez que dans la version synchrone, si une erreur est levée, elle devra être interceptée ou le processus plantera. Dans la version asynchrone, il appartient à l'auteur de décider si une erreur doit être levée comme indiqué.

Développons un peu notre exemple :

```js
const fs = require('node:fs')
const data = fs.readFileSync('/file.md') // bloque ici jusqu'à ce que le fichier soit lu
console.log(data)
moreWork() // s'exécutera après console.log
```

Et voici un exemple asynchrone similaire, mais pas équivalent :

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
moreWork() // s'exécutera avant console.log
```

Dans le premier exemple ci-dessus, `console.log` sera appelé avant `moreWork()`. Dans le deuxième exemple, `fs.readFile()` est **non bloquant**, de sorte que l'exécution de JavaScript peut continuer et `moreWork()` sera appelé en premier. La possibilité d'exécuter `moreWork()` sans attendre la fin de la lecture du fichier est un choix de conception essentiel qui permet un débit plus élevé.


## Concurrence et débit

L'exécution de JavaScript dans Node.js est monothread, la concurrence se réfère donc à la capacité de la boucle d'événements à exécuter des fonctions de rappel JavaScript après avoir terminé d'autres tâches. Tout code censé s'exécuter de manière concurrente doit permettre à la boucle d'événements de continuer à s'exécuter pendant que des opérations non-JavaScript, comme les E/S, se produisent.

Par exemple, considérons un cas où chaque requête vers un serveur web prend 50 ms à compléter et où 45 ms de ces 50 ms sont des E/S de base de données qui peuvent être effectuées de manière asynchrone. Choisir des opérations asynchrones non bloquantes libère ces 45 ms par requête pour traiter d'autres requêtes. Il s'agit d'une différence significative de capacité simplement en choisissant d'utiliser des méthodes non bloquantes au lieu de méthodes bloquantes.

La boucle d'événements est différente des modèles dans de nombreux autres langages où des threads supplémentaires peuvent être créés pour gérer le travail concurrent.

## Dangers du mélange de code bloquant et non bloquant

Il existe certains modèles qui doivent être évités lors de la gestion des E/S. Examinons un exemple :

```js
const fs = require('node:fs')
fs.readFile('/file.md', (err, data) => {
  if (err) throw err
  console.log(data)
})
fs.unlinkSync('/file.md')
```

Dans l'exemple ci-dessus, `fs.unlinkSync()` est susceptible d'être exécuté avant `fs.readFile()`, ce qui supprimerait `file.md` avant qu'il ne soit réellement lu. Une meilleure façon d'écrire ceci, qui est totalement non bloquante et garantit l'exécution dans l'ordre correct, est :

```js
const fs = require('node:fs')
fs.readFile('/file.md', (readFileErr, data) => {
  if (readFileErr) throw readFileErr
  console.log(data)
  fs.unlink('/file.md', unlinkErr => {
    if (unlinkErr) throw unlinkErr
  })
})
```

Ce qui précède place un appel **non bloquant** à `fs.unlink()` dans le rappel de `fs.readFile()`, ce qui garantit l'ordre correct des opérations.

