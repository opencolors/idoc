---
title: Comprendre la boucle d'événements Node.js
description: La boucle d'événements est le cœur de Node.js, permettant d'exécuter des opérations I/O non bloquantes. Il s'agit d'une boucle à thread unique qui décharge les opérations vers le noyau du système lorsque cela est possible.
head:
  - - meta
    - name: og:title
      content: Comprendre la boucle d'événements Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La boucle d'événements est le cœur de Node.js, permettant d'exécuter des opérations I/O non bloquantes. Il s'agit d'une boucle à thread unique qui décharge les opérations vers le noyau du système lorsque cela est possible.
  - - meta
    - name: twitter:title
      content: Comprendre la boucle d'événements Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La boucle d'événements est le cœur de Node.js, permettant d'exécuter des opérations I/O non bloquantes. Il s'agit d'une boucle à thread unique qui décharge les opérations vers le noyau du système lorsque cela est possible.
---


# La boucle d'événement Node.js

## Qu'est-ce que la boucle d'événement ?

La boucle d'événement est ce qui permet à Node.js d'effectuer des opérations d'E/S non bloquantes - malgré le fait qu'un seul thread JavaScript est utilisé par défaut - en déchargeant les opérations vers le noyau du système chaque fois que possible.

Étant donné que la plupart des noyaux modernes sont multithreadés, ils peuvent gérer plusieurs opérations s'exécutant en arrière-plan. Lorsqu'une de ces opérations est terminée, le noyau indique à Node.js afin que le rappel approprié puisse être ajouté à la file d'attente de sondage pour être éventuellement exécuté. Nous expliquerons cela plus en détail plus loin dans ce sujet.

## La boucle d'événement expliquée

Lorsque Node.js démarre, il initialise la boucle d'événement, traite le script d'entrée fourni (ou passe en REPL, ce qui n'est pas couvert dans ce document) qui peut effectuer des appels d'API asynchrones, planifier des minuteurs ou appeler process.nextTick(), puis commence à traiter la boucle d'événement.

Le diagramme suivant montre un aperçu simplifié de l'ordre des opérations de la boucle d'événement.

```bash
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

::: tip
Chaque case sera appelée "phase" de la boucle d'événement.
:::

Chaque phase a une file d'attente FIFO de rappels à exécuter. Bien que chaque phase soit spéciale à sa manière, en général, lorsque la boucle d'événement entre dans une phase donnée, elle effectue toutes les opérations spécifiques à cette phase, puis exécute les rappels dans la file d'attente de cette phase jusqu'à ce que la file d'attente soit épuisée ou que le nombre maximal de rappels ait été exécuté. Lorsque la file d'attente est épuisée ou que la limite de rappel est atteinte, la boucle d'événement passe à la phase suivante, et ainsi de suite.

Étant donné que l'une de ces opérations peut planifier davantage d'opérations et que les nouveaux événements traités dans la phase de **sondage** sont mis en file d'attente par le noyau, les événements de sondage peuvent être mis en file d'attente pendant que les événements de sondage sont en cours de traitement. En conséquence, les rappels de longue durée peuvent permettre à la phase de sondage de durer beaucoup plus longtemps que le seuil d'un minuteur. Consultez les sections sur les minuteurs et les sondages pour plus de détails.

::: tip
Il existe une légère différence entre l'implémentation Windows et l'implémentation Unix/Linux, mais ce n'est pas important pour cette démonstration. Les parties les plus importantes sont ici. Il y a en fait sept ou huit étapes, mais celles qui nous intéressent - celles que Node.js utilise réellement - sont celles ci-dessus.
:::


## Aperçu des phases
- **timers** (temporisateurs) : cette phase exécute les rappels planifiés par `setTimeout()` et `setInterval()`.
- **pending callbacks** (rappels en attente) : exécute les rappels d'E/S différés à l'itération suivante de la boucle.
- **idle, prepare** (inactif, préparation) : uniquement utilisé en interne.
- **poll** (sondage) : récupère de nouveaux événements d'E/S ; exécute les rappels liés aux E/S (presque tous à l'exception des rappels de fermeture, ceux planifiés par des temporisateurs et `setImmediate()`) ; Node se bloquera ici le cas échéant.
- **check** (vérification) : les rappels `setImmediate()` sont invoqués ici.
- **close callbacks** (rappels de fermeture) : certains rappels de fermeture, par exemple `socket.on('close', ...)`.

Entre chaque exécution de la boucle d'événements, Node.js vérifie s'il attend des E/S asynchrones ou des temporisateurs et s'arrête proprement s'il n'y en a pas.

## Phases en détail

### timers (temporisateurs)

Un temporisateur spécifie le **seuil** après lequel un rappel fourni peut être exécuté plutôt que l'heure **exacte** à laquelle une personne *souhaite qu'il soit exécuté*. Les rappels des temporisateurs s'exécuteront dès qu'ils pourront être planifiés après le temps spécifié ; cependant, la planification du système d'exploitation ou l'exécution d'autres rappels peuvent les retarder.

::: tip
Techniquement, la phase de [sondage](/fr/nodejs/guide/nodejs-event-loop#poll) contrôle le moment où les temporisateurs sont exécutés.
:::

Par exemple, supposons que vous planifiez un délai d'attente pour s'exécuter après un seuil de 100 ms, puis que votre script commence à lire de manière asynchrone un fichier qui prend 95 ms :

```js
const fs = require('node:fs');
function someAsyncOperation(callback) {
  // Supposons que cela prenne 95 ms pour se terminer
  fs.readFile('/path/to/file', callback);
}
const timeoutScheduled = Date.now();
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms se sont écoulées depuis que j'ai été planifié`);
}, 100);
// faire someAsyncOperation qui prend 95 ms pour se terminer
someAsyncOperation(() => {
  const startCallback = Date.now();
  // faire quelque chose qui prendra 10ms...
  while (Date.now() - startCallback < 10) {
    // ne rien faire
  }
});
```

Lorsque la boucle d'événements entre dans la phase de **sondage**, elle a une file d'attente vide (`fs.readFile()` n'est pas terminé), elle attendra donc le nombre de ms restant jusqu'à ce que le seuil du temporisateur le plus proche soit atteint. Pendant qu'elle attend, 95 ms s'écoulent, `fs.readFile()` termine de lire le fichier et son rappel, qui prend 10 ms pour se terminer, est ajouté à la file d'attente de sondage et exécuté. Lorsque le rappel est terminé, il n'y a plus de rappels dans la file d'attente, la boucle d'événements verra que le seuil du temporisateur le plus proche a été atteint, puis reviendra à la phase des temporisateurs pour exécuter le rappel du temporisateur. Dans cet exemple, vous verrez que le délai total entre la planification du temporisateur et l'exécution de son rappel sera de 105 ms.

::: tip
Pour empêcher la phase de sondage d'affamer la boucle d'événements, [libuv](https://libuv.org/) (la bibliothèque C qui implémente la boucle d'événements Node.js et tous les comportements asynchrones de la plate-forme) a également un maximum rigide (dépendant du système) avant d'arrêter le sondage pour plus d'événements.
:::


## Callbacks en attente
Cette phase exécute les callbacks pour certaines opérations système telles que les types d'erreurs TCP. Par exemple, si un socket TCP reçoit `ECONNREFUSED` lors d'une tentative de connexion, certains systèmes *nix veulent attendre pour signaler l'erreur. Ceci sera mis en file d'attente pour être exécuté dans la phase des **callbacks en attente**.

### Poll

La phase **poll** a deux fonctions principales :

1. Calculer combien de temps il doit bloquer et interroger pour les E/S, puis
2. Traiter les événements dans la file d'attente **poll**.

Lorsque la boucle d'événements entre dans la phase **poll** et qu'aucun minuteur n'est programmé, l'une des deux choses suivantes se produira :

- Si la file d'attente ***poll*** ***n'est pas vide***, la boucle d'événements itérera sur sa file d'attente de callbacks en les exécutant de manière synchrone jusqu'à ce que la file d'attente soit épuisée ou que la limite matérielle dépendant du système soit atteinte.

- Si la file d'attente ***poll*** ***est vide***, une des deux choses suivantes se produira :

    - Si des scripts ont été planifiés par `setImmediate()`, la boucle d'événements terminera la phase **poll** et continuera vers la phase de contrôle pour exécuter ces scripts planifiés.

    - Si des scripts **n'ont pas** été planifiés par `setImmediate()`, la boucle d'événements attendra que des callbacks soient ajoutés à la file d'attente, puis les exécutera immédiatement.

Une fois que la file d'attente **poll** est vide, la boucle d'événements vérifiera les minuteurs *dont les seuils de temps* ont été atteints. Si un ou plusieurs minuteurs sont prêts, la boucle d'événements reviendra à la phase **timers** pour exécuter les callbacks de ces minuteurs.

### Check

Cette phase permet à une personne d'exécuter des callbacks immédiatement après la fin de la phase **poll**. Si la phase **poll** devient inactive et que des scripts ont été mis en file d'attente avec `setImmediate()`, la boucle d'événements peut continuer vers la phase de contrôle plutôt que d'attendre.

`setImmediate()` est en fait un minuteur spécial qui s'exécute dans une phase distincte de la boucle d'événements. Il utilise une API libuv qui planifie l'exécution des callbacks après la fin de la phase **poll**.

Généralement, au fur et à mesure que le code est exécuté, la boucle d'événements atteindra finalement la phase **poll** où elle attendra une connexion entrante, une requête, etc. Cependant, si un callback a été planifié avec `setImmediate()` et que la phase **poll** devient inactive, elle se terminera et continuera vers la phase **check** plutôt que d'attendre les événements **poll**.


### Rappels de fermeture

Si un socket ou un handle est fermé brusquement (par exemple, `socket.destroy()`), l'événement `'close'` sera émis dans cette phase. Sinon, il sera émis via `process.nextTick()`.

## `setImmediate()` vs `setTimeout()`

`setImmediate()` et `setTimeout()` sont similaires, mais se comportent différemment selon le moment où ils sont appelés.

- `setImmediate()` est conçu pour exécuter un script une fois que la phase de **polling** actuelle est terminée.
- `setTimeout()` planifie l'exécution d'un script après l'expiration d'un seuil minimal en ms.

L'ordre dans lequel les timers sont exécutés varie en fonction du contexte dans lequel ils sont appelés. Si les deux sont appelés à partir du module principal, le timing sera lié aux performances du processus (qui peuvent être affectées par d'autres applications en cours d'exécution sur la machine).

Par exemple, si nous exécutons le script suivant qui ne se trouve pas dans un cycle d'E/S (c'est-à-dire le module principal), l'ordre dans lequel les deux timers sont exécutés est non déterministe, car il est lié aux performances du processus :

::: code-group

```js [JS]
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);
setImmediate(() => {
  console.log('immediate');
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
timeout
immediate
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

Cependant, si vous déplacez les deux appels dans un cycle d'E/S, le rappel immédiat est toujours exécuté en premier :

::: code-group

```js [JS]
// timeout_vs_immediate.js
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
immediate
timeout
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

Le principal avantage de l'utilisation de `setImmediate()` par rapport à `setTimeout()` est que `setImmediate()` sera toujours exécuté avant tous les timers s'il est planifié dans un cycle d'E/S, indépendamment du nombre de timers présents.


## `process.nextTick()`

### Comprendre `process.nextTick()`

Vous avez peut-être remarqué que `process.nextTick()` n'était pas affiché dans le diagramme, même s'il fait partie de l'API asynchrone. C'est parce que `process.nextTick()` ne fait pas techniquement partie de la boucle d'événement. Au lieu de cela, la `nextTickQueue` sera traitée une fois l'opération en cours terminée, quelle que soit la phase actuelle de la boucle d'événement. Ici, une opération est définie comme une transition du gestionnaire C/C++ sous-jacent, et la gestion du JavaScript qui doit être exécuté.

Si l'on reprend notre diagramme, chaque fois que vous appelez `process.nextTick()` dans une phase donnée, tous les rappels passés à `process.nextTick()` seront résolus avant que la boucle d'événement ne continue. Cela peut créer de mauvaises situations car **cela vous permet de "privatiser" vos E/S en effectuant des appels récursifs à** `process.nextTick()`, ce qui empêche la boucle d'événement d'atteindre la phase de **sondage**.

### Pourquoi cela serait-il autorisé ?

Pourquoi quelque chose comme ça serait-il inclus dans Node.js ? Une partie de la réponse réside dans une philosophie de conception selon laquelle une API devrait toujours être asynchrone, même lorsqu'elle n'a pas besoin de l'être. Prenez cet extrait de code par exemple :

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

L'extrait effectue une vérification des arguments et s'ils ne sont pas corrects, il transmettra l'erreur au rappel. L'API a été mise à jour assez récemment pour autoriser le passage d'arguments à `process.nextTick()`, ce qui lui permet de prendre tous les arguments passés après le rappel pour qu'ils soient propagés en tant qu'arguments au rappel, vous n'avez donc pas besoin d'imbriquer des fonctions.

Ce que nous faisons, c'est renvoyer une erreur à l'utilisateur, mais seulement après avoir permis au reste du code de l'utilisateur de s'exécuter. En utilisant `process.nextTick()`, nous garantissons que `apiCall()` exécute toujours son rappel après le reste du code de l'utilisateur et avant que la boucle d'événement ne soit autorisée à continuer. Pour ce faire, la pile d'appels JS est autorisée à se dérouler, puis à exécuter immédiatement le rappel fourni, ce qui permet à une personne d'effectuer des appels récursifs à `process.nextTick()` sans atteindre une `RangeError: Maximum call stack size exceeded from v8`.

Cette philosophie peut conduire à des situations potentiellement problématiques. Prenez cet extrait par exemple :

```js
let bar;
// ceci a une signature asynchrone, mais appelle le rappel de manière synchrone
function someAsyncApiCall(callback) {
  callback();
}
// le rappel est appelé avant que `someAsyncApiCall` ne soit terminé.
someAsyncApiCall(() => {
  // puisque someAsyncApiCall n'est pas terminé, aucune valeur n'a été attribuée à bar
  console.log('bar', bar); // undefined
});
bar = 1;
```

L'utilisateur définit `someAsyncApiCall()` comme ayant une signature asynchrone, mais elle fonctionne en réalité de manière synchrone. Lorsqu'elle est appelée, le rappel fourni à `someAsyncApiCall()` est appelé dans la même phase de la boucle d'événement car `someAsyncApiCall()` ne fait rien d'asynchrone. Par conséquent, le rappel essaie de référencer bar même s'il n'a peut-être pas encore cette variable dans la portée, car le script n'a pas pu s'exécuter jusqu'à la fin.

En plaçant le rappel dans un `process.nextTick()`, le script a toujours la possibilité de s'exécuter jusqu'à la fin, ce qui permet à toutes les variables, fonctions, etc. d'être initialisées avant l'appel du rappel. Il a également l'avantage de ne pas permettre à la boucle d'événement de continuer. Il peut être utile pour l'utilisateur d'être alerté d'une erreur avant que la boucle d'événement ne soit autorisée à continuer. Voici l'exemple précédent utilisant `process.nextTick()` :

```js
let bar;
function someAsyncApiCall(callback) {
  process.nextTick(callback);
}
someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});
bar = 1;
```

Voici un autre exemple concret :

```js
const server = net.createServer(() => {}).listen(8080);
server.on('listening', () => {});
```

Lorsqu'un seul port est passé, le port est lié immédiatement. Ainsi, le rappel `'listening'` pourrait être appelé immédiatement. Le problème est que le rappel `.on('listening')` n'aura pas été défini à ce moment-là.

Pour contourner ce problème, l'événement `'listening'` est mis en file d'attente dans un `nextTick()` pour permettre au script de s'exécuter jusqu'à la fin. Cela permet à l'utilisateur de définir les gestionnaires d'événements qu'il souhaite.


## `process.nextTick()` vs `setImmediate()`

Nous avons deux appels qui se ressemblent du point de vue de l'utilisateur, mais leurs noms sont déroutants.

- `process.nextTick()` se déclenche immédiatement dans la même phase
- `setImmediate()` se déclenche lors de l'itération ou du "tick" suivant de la boucle d'événements

En substance, les noms devraient être inversés. `process.nextTick()` se déclenche plus immédiatement que `setImmediate()`, mais c'est un artefact du passé qui a peu de chances de changer. Effectuer cette inversion casserait un grand pourcentage des paquets sur npm. Chaque jour, de nouveaux modules sont ajoutés, ce qui signifie que chaque jour où nous attendons, plus de ruptures potentielles se produisent. Bien qu'ils soient déroutants, les noms eux-mêmes ne changeront pas.

::: tip
Nous recommandons aux développeurs d'utiliser `setImmediate()` dans tous les cas, car il est plus facile à comprendre.
:::

## Pourquoi utiliser `process.nextTick()` ?

Il y a deux raisons principales :

1. Permettre aux utilisateurs de gérer les erreurs, de nettoyer les ressources inutiles ou peut-être de réessayer la requête avant que la boucle d'événements ne se poursuive.

2. Parfois, il est nécessaire de permettre à un rappel de s'exécuter une fois que la pile d'appels s'est déroulée, mais avant que la boucle d'événements ne se poursuive.

Un exemple est de correspondre aux attentes de l'utilisateur. Exemple simple :

```js
const server = net.createServer();
server.on('connection', conn => {});
server.listen(8080);
server.on('listening', () => {});
```

Supposons que `listen()` soit exécuté au début de la boucle d'événements, mais que le rappel d'écoute soit placé dans un `setImmediate()`. À moins qu'un nom d'hôte ne soit transmis, la liaison au port se fera immédiatement. Pour que la boucle d'événements se poursuive, elle doit atteindre la phase de sondage, ce qui signifie qu'il existe une probabilité non nulle qu'une connexion ait pu être reçue, ce qui permet de déclencher l'événement de connexion avant l'événement d'écoute.

Un autre exemple consiste à étendre un `EventEmitter` et à émettre un événement depuis le constructeur :

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.emit('event');
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

Vous ne pouvez pas émettre un événement depuis le constructeur immédiatement, car le script n'aura pas été traité au point où l'utilisateur affecte un rappel à cet événement. Ainsi, dans le constructeur lui-même, vous pouvez utiliser `process.nextTick()` pour définir un rappel pour émettre l'événement une fois que le constructeur a terminé, ce qui fournit les résultats attendus :

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // use nextTick to emit the event once a handler is assigned
    process.nextTick(() => {
      this.emit('event');
    });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```
