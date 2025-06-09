---
title: Documentation de l'API Process de Node.js
description: Documentation détaillée sur le module de processus de Node.js, couvrant la gestion des processus, les variables d'environnement, les signaux, etc.
head:
  - - meta
    - name: og:title
      content: Documentation de l'API Process de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentation détaillée sur le module de processus de Node.js, couvrant la gestion des processus, les variables d'environnement, les signaux, etc.
  - - meta
    - name: twitter:title
      content: Documentation de l'API Process de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentation détaillée sur le module de processus de Node.js, couvrant la gestion des processus, les variables d'environnement, les signaux, etc.
---


# Processus {#process}

**Code Source:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

L'objet `process` fournit des informations sur le processus Node.js en cours et permet de le contrôler.

::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## Événements du processus {#process-events}

L'objet `process` est une instance de [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter).

### Événement: `'beforeExit'` {#event-beforeexit}

**Ajouté dans: v0.11.12**

L'événement `'beforeExit'` est émis lorsque Node.js vide sa boucle d'événements et n'a plus de travail à planifier. Normalement, le processus Node.js se termine lorsqu'il n'y a plus de travail planifié, mais un écouteur enregistré sur l'événement `'beforeExit'` peut effectuer des appels asynchrones, et ainsi provoquer la poursuite du processus Node.js.

La fonction de rappel de l'écouteur est invoquée avec la valeur de [`process.exitCode`](/fr/nodejs/api/process#processexitcode_1) passée comme seul argument.

L'événement `'beforeExit'` *n'est pas* émis pour les conditions causant une terminaison explicite, telles que l'appel de [`process.exit()`](/fr/nodejs/api/process#processexitcode) ou les exceptions non interceptées.

L'événement `'beforeExit'` ne doit *pas* être utilisé comme alternative à l'événement `'exit'` sauf si l'intention est de planifier un travail supplémentaire.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Événement beforeExit du processus avec le code :', code);
});

process.on('exit', (code) => {
  console.log('Événement exit du processus avec le code :', code);
});

console.log('Ce message s’affiche en premier.');

// Affiche :
// Ce message s’affiche en premier.
// Événement beforeExit du processus avec le code : 0
// Événement exit du processus avec le code : 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Événement beforeExit du processus avec le code :', code);
});

process.on('exit', (code) => {
  console.log('Événement exit du processus avec le code :', code);
});

console.log('Ce message s’affiche en premier.');

// Affiche :
// Ce message s’affiche en premier.
// Événement beforeExit du processus avec le code : 0
// Événement exit du processus avec le code : 0
```
:::


### Événement : `'disconnect'` {#event-disconnect}

**Ajouté dans : v0.7.7**

Si le processus Node.js est lancé avec un canal IPC (voir la documentation [Processus enfant](/fr/nodejs/api/child_process) et [Cluster](/fr/nodejs/api/cluster)), l'événement `'disconnect'` sera émis lorsque le canal IPC est fermé.

### Événement : `'exit'` {#event-exit}

**Ajouté dans : v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'événement `'exit'` est émis lorsque le processus Node.js est sur le point de se terminer à la suite de :

- L'appel explicite de la méthode `process.exit()` ;
- La boucle d'événements Node.js n'a plus de travail supplémentaire à effectuer.

Il n'y a aucun moyen d'empêcher la sortie de la boucle d'événements à ce stade, et une fois que tous les listeners `'exit'` ont fini de s'exécuter, le processus Node.js se terminera.

La fonction de rappel du listener est appelée avec le code de sortie spécifié soit par la propriété [`process.exitCode`](/fr/nodejs/api/process#processexitcode_1), soit par l'argument `exitCode` passé à la méthode [`process.exit()`](/fr/nodejs/api/process#processexitcode).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
:::

Les fonctions de listener **doivent** uniquement effectuer des opérations **synchrones**. Le processus Node.js se terminera immédiatement après avoir appelé les listeners d'événements `'exit'` , ce qui entraînera l'abandon de tout travail supplémentaire encore mis en file d'attente dans la boucle d'événements. Dans l'exemple suivant, par exemple, le délai d'attente ne se produira jamais :

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```
:::


### Événement : `'message'` {#event-message}

**Ajouté dans : v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) un objet JSON analysé ou une valeur primitive sérialisable.
- `sendHandle` [\<net.Server\>](/fr/nodejs/api/net#class-netserver) | [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) un objet [`net.Server`](/fr/nodejs/api/net#class-netserver) ou [`net.Socket`](/fr/nodejs/api/net#class-netsocket), ou undefined.

Si le processus Node.js est généré avec un canal IPC (voir la documentation sur le [Processus enfant](/fr/nodejs/api/child_process) et le [Cluster](/fr/nodejs/api/cluster)), l’événement `'message'` est émis chaque fois qu’un message envoyé par un processus parent à l’aide de [`childprocess.send()`](/fr/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) est reçu par le processus enfant.

Le message passe par la sérialisation et l’analyse. Le message résultant peut ne pas être le même que celui qui est envoyé à l’origine.

Si l’option `serialization` a été définie sur `advanced` lors de la création du processus, l’argument `message` peut contenir des données que JSON n’est pas en mesure de représenter. Voir [Sérialisation avancée pour `child_process`](/fr/nodejs/api/child_process#advanced-serialization) pour plus de détails.

### Événement : `'multipleResolves'` {#event-multipleresolves}

**Ajouté dans : v10.12.0**

**Déprécié depuis : v17.6.0, v16.15.0**

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stability : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type de résolution. L’un de `'resolve'` ou `'reject'`.
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promesse qui s’est résolue ou a été rejetée plus d’une fois.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La valeur avec laquelle la promesse a été résolue ou rejetée après la résolution originale.

L’événement `'multipleResolves'` est émis chaque fois qu’une `Promise` a été :

- Résolue plus d’une fois.
- Rejetée plus d’une fois.
- Rejetée après la résolution.
- Résolue après le rejet.

Ceci est utile pour suivre les erreurs potentielles dans une application lors de l’utilisation du constructeur `Promise`, car les résolutions multiples sont silencieusement avalées. Cependant, la survenue de cet événement n’indique pas nécessairement une erreur. Par exemple, [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) peut déclencher un événement `'multipleResolves'`.

En raison du manque de fiabilité de l’événement dans des cas comme l’exemple [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) ci-dessus, il a été déprécié.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### Événement : `'rejectionHandled'` {#event-rejectionhandled}

**Ajouté dans : v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promesse gérée tardivement.

L'événement `'rejectionHandled'` est émis chaque fois qu'une `Promise` a été rejetée et qu'un gestionnaire d'erreur lui a été attaché (en utilisant [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch), par exemple) plus tard qu'un tour de la boucle d'événements Node.js.

L'objet `Promise` aurait été précédemment émis dans un événement `'unhandledRejection'`, mais au cours du traitement, il a acquis un gestionnaire de rejet.

Il n'y a pas de notion de niveau supérieur pour une chaîne `Promise` auquel les rejets peuvent toujours être gérés. Étant intrinsèquement asynchrone par nature, un rejet de `Promise` peut être géré à un moment futur, peut-être beaucoup plus tard que le tour de la boucle d'événements qu'il faut pour que l'événement `'unhandledRejection'` soit émis.

Une autre façon de dire ceci est que, contrairement au code synchrone où il existe une liste toujours croissante d'exceptions non gérées, avec les Promesses, il peut y avoir une liste croissante et décroissante de rejets non gérés.

Dans le code synchrone, l'événement `'uncaughtException'` est émis lorsque la liste des exceptions non gérées s'allonge.

Dans le code asynchrone, l'événement `'unhandledRejection'` est émis lorsque la liste des rejets non gérés s'allonge, et l'événement `'rejectionHandled'` est émis lorsque la liste des rejets non gérés diminue.

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

Dans cet exemple, la `Map` `unhandledRejections` va croître et diminuer avec le temps, reflétant les rejets qui commencent non gérés et qui sont ensuite gérés. Il est possible d'enregistrer ces erreurs dans un journal des erreurs, soit périodiquement (ce qui est probablement le mieux pour les applications de longue durée), soit à la sortie du processus (ce qui est probablement le plus pratique pour les scripts).


### Événement : `'workerMessage'` {#event-workermessage}

**Ajouté dans : v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Une valeur transmise à l’aide de [`postMessageToThread()`](/fr/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L’ID du thread de travail transmetteur ou `0` pour le thread principal.

L’événement `'workerMessage'` est émis pour tout message entrant envoyé par l’autre partie en utilisant [`postMessageToThread()`](/fr/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).

### Événement : `'uncaughtException'` {#event-uncaughtexception}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0, v10.17.0 | Ajout de l’argument `origin`. |
| v0.1.18 | Ajouté dans : v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L’exception non interceptée.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indique si l’exception provient d’un rejet non géré ou d’une erreur synchrone. Peut être `'uncaughtException'` ou `'unhandledRejection'`. Ce dernier est utilisé lorsqu’une exception se produit dans un contexte asynchrone basé sur `Promise` (ou si une `Promise` est rejetée) et que l’indicateur [`--unhandled-rejections`](/fr/nodejs/api/cli#--unhandled-rejectionsmode) est défini sur `strict` ou `throw` (ce qui est la valeur par défaut) et que le rejet n’est pas géré, ou lorsqu’un rejet se produit pendant la phase de chargement statique du module ES du point d’entrée de la ligne de commande.

L’événement `'uncaughtException'` est émis lorsqu’une exception JavaScript non interceptée remonte jusqu’à la boucle d’événement. Par défaut, Node.js gère ces exceptions en imprimant la trace de la pile sur `stderr` et en quittant avec le code 1, en remplaçant toute valeur précédemment définie de [`process.exitCode`](/fr/nodejs/api/process#processexitcode_1). L’ajout d’un gestionnaire pour l’événement `'uncaughtException'` remplace ce comportement par défaut. Alternativement, modifiez le [`process.exitCode`](/fr/nodejs/api/process#processexitcode_1) dans le gestionnaire `'uncaughtException'` qui entraînera la sortie du processus avec le code de sortie fourni. Sinon, en présence d’un tel gestionnaire, le processus se terminera avec 0.



::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

Il est possible de surveiller les événements `'uncaughtException'` sans remplacer le comportement par défaut consistant à quitter le processus en installant un écouteur `'uncaughtExceptionMonitor'`.


#### Avertissement : Utilisation correcte de `'uncaughtException'` {#warning-using-uncaughtexception-correctly}

`'uncaughtException'` est un mécanisme rudimentaire de gestion des exceptions destiné à être utilisé uniquement en dernier recours. L’événement ne *doit pas* être utilisé comme équivalent de `On Error Resume Next`. Les exceptions non gérées signifient intrinsèquement qu’une application est dans un état non défini. Tenter de reprendre le code de l’application sans récupérer correctement de l’exception peut entraîner des problèmes imprévisibles supplémentaires.

Les exceptions levées depuis le gestionnaire d’événements ne seront pas interceptées. Au lieu de cela, le processus se terminera avec un code de sortie non nul et la trace de la pile sera affichée. Ceci afin d’éviter la récursion infinie.

Tenter de reprendre le fonctionnement normal après une exception non gérée peut être similaire à débrancher le cordon d’alimentation lors de la mise à niveau d’un ordinateur. Neuf fois sur dix, il ne se passe rien. Mais la dixième fois, le système est corrompu.

L’utilisation correcte de `'uncaughtException'` est d’effectuer un nettoyage synchrone des ressources allouées (par exemple, les descripteurs de fichiers, les handles, etc.) avant d’arrêter le processus. **Il n’est pas sûr de reprendre un fonctionnement normal après <code>'uncaughtException'</code>.**

Pour redémarrer une application plantée de manière plus fiable, que `'uncaughtException'` soit émis ou non, un moniteur externe doit être utilisé dans un processus distinct pour détecter les défaillances de l’application et récupérer ou redémarrer au besoin.

### Événement : `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**Ajouté dans : v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) L’exception non gérée.
- `origin` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Indique si l’exception provient d’un rejet non géré ou d’erreurs synchrones. Peut être `'uncaughtException'` ou `'unhandledRejection'`. Ce dernier est utilisé lorsqu’une exception se produit dans un contexte asynchrone basé sur `Promise` (ou si une `Promise` est rejetée) et que l’indicateur [`--unhandled-rejections`](/fr/nodejs/api/cli#--unhandled-rejectionsmode) est défini sur `strict` ou `throw` (ce qui est la valeur par défaut) et que le rejet n’est pas géré, ou lorsqu’un rejet se produit pendant la phase de chargement statique du module ES du point d’entrée de la ligne de commande.

L’événement `'uncaughtExceptionMonitor'` est émis avant qu’un événement `'uncaughtException'` ne soit émis ou qu’un hook installé via [`process.setUncaughtExceptionCaptureCallback()`](/fr/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) ne soit appelé.

L’installation d’un écouteur `'uncaughtExceptionMonitor'` ne modifie pas le comportement une fois qu’un événement `'uncaughtException'` est émis. Le processus plantera toujours si aucun écouteur `'uncaughtException'` n’est installé.



::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Déclenche intentionnellement une exception, mais ne l’intercepte pas.
nonexistentFunc();
// Fait toujours planter Node.js
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Déclenche intentionnellement une exception, mais ne l’intercepte pas.
nonexistentFunc();
// Fait toujours planter Node.js
```
:::


### Événement : `'unhandledRejection'` {#event-unhandledrejection}

::: info [Historique]
| Version | Modifications |
|---|---|
| v7.0.0 | Le fait de ne pas gérer les rejets de `Promise` est obsolète. |
| v6.6.0 | Les rejets de `Promise` non gérés émettent désormais un avertissement de processus. |
| v1.4.1 | Ajouté dans : v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) L'objet avec lequel la promesse a été rejetée (généralement un objet [`Error`](/fr/nodejs/api/errors#class-error)).
- `promise` [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) La promesse rejetée.

L'événement `'unhandledRejection'` est émis chaque fois qu'une `Promise` est rejetée et qu'aucun gestionnaire d'erreur n'est attaché à la promesse dans un tour de la boucle d'événement. Lors de la programmation avec des promesses, les exceptions sont encapsulées en tant que "promesses rejetées". Les rejets peuvent être interceptés et gérés à l'aide de [`promise.catch()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) et sont propagés via une chaîne `Promise`. L'événement `'unhandledRejection'` est utile pour détecter et suivre les promesses qui ont été rejetées et dont les rejets n'ont pas encore été gérés.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Journalisation spécifique à l'application, lancement d'une erreur ou autre logique ici
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Notez la faute de frappe (`pasre`)
}); // Pas de `.catch()` ou `.then()`
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Journalisation spécifique à l'application, lancement d'une erreur ou autre logique ici
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Notez la faute de frappe (`pasre`)
}); // Pas de `.catch()` ou `.then()`
```
:::

Ce qui suit déclenchera également l'émission de l'événement `'unhandledRejection'` :

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // Initialement, définissez l'état chargé sur une promesse rejetée
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// pas de .catch ou .then sur resource.loaded pendant au moins un tour
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // Initialement, définissez l'état chargé sur une promesse rejetée
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// pas de .catch ou .then sur resource.loaded pendant au moins un tour
```
:::

Dans cet exemple, il est possible de suivre le rejet en tant qu'erreur de développeur, comme ce serait généralement le cas pour d'autres événements `'unhandledRejection'`. Pour résoudre de tels échecs, un gestionnaire [`.catch(() =\> { })`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) non opérationnel peut être attaché à `resource.loaded`, ce qui empêcherait l'émission de l'événement `'unhandledRejection'`.


### Événement : `'warning'` {#event-warning}

**Ajouté dans : v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Les propriétés clés de l'avertissement sont :
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom de l'avertissement. **Par défaut :** `'Warning'`.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une description de l'avertissement fournie par le système.
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une trace de la pile jusqu'à l'emplacement dans le code où l'avertissement a été émis.

L'événement `'warning'` est émis chaque fois que Node.js émet un avertissement de processus.

Un avertissement de processus est similaire à une erreur en ce qu'il décrit des conditions exceptionnelles qui sont portées à l'attention de l'utilisateur. Cependant, les avertissements ne font pas partie du flux normal de gestion des erreurs de Node.js et JavaScript. Node.js peut émettre des avertissements chaque fois qu'il détecte de mauvaises pratiques de codage qui pourraient entraîner des performances d'application sous-optimales, des bugs ou des vulnérabilités de sécurité.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // Affiche le nom de l'avertissement
  console.warn(warning.message); // Affiche le message de l'avertissement
  console.warn(warning.stack);   // Affiche la trace de la pile
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // Affiche le nom de l'avertissement
  console.warn(warning.message); // Affiche le message de l'avertissement
  console.warn(warning.stack);   // Affiche la trace de la pile
});
```
:::

Par défaut, Node.js affiche les avertissements de processus sur `stderr`. L'option de ligne de commande `--no-warnings` peut être utilisée pour supprimer la sortie de la console par défaut, mais l'événement `'warning'` sera toujours émis par l'objet `process`. Actuellement, il n'est pas possible de supprimer des types d'avertissement spécifiques autres que les avertissements de dépréciation. Pour supprimer les avertissements de dépréciation, consultez l'indicateur [`--no-deprecation`](/fr/nodejs/api/cli#--no-deprecation).

L'exemple suivant illustre l'avertissement qui est affiché sur `stderr` lorsque trop d'écouteurs ont été ajoutés à un événement :

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
En revanche, l'exemple suivant désactive la sortie d'avertissement par défaut et ajoute un gestionnaire personnalisé à l'événement `'warning'` :

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
L'option de ligne de commande `--trace-warnings` peut être utilisée pour que la sortie de la console par défaut pour les avertissements inclue la trace de pile complète de l'avertissement.

Le lancement de Node.js à l'aide de l'indicateur de ligne de commande `--throw-deprecation` entraînera la levée d'avertissements de dépréciation personnalisés sous forme d'exceptions.

L'utilisation de l'indicateur de ligne de commande `--trace-deprecation` entraînera l'affichage de la dépréciation personnalisée sur `stderr` avec la trace de la pile.

L'utilisation de l'indicateur de ligne de commande `--no-deprecation` supprimera tous les rapports de la dépréciation personnalisée.

Les indicateurs de ligne de commande `*-deprecation` n'affectent que les avertissements qui utilisent le nom `'DeprecationWarning'`.


#### Émettre des avertissements personnalisés {#emitting-custom-warnings}

Consultez la méthode [`process.emitWarning()`](/fr/nodejs/api/process#processemitwarningwarning-type-code-ctor) pour émettre des avertissements personnalisés ou spécifiques à l'application.

#### Noms d'avertissements Node.js {#nodejs-warning-names}

Il n'existe pas de directives strictes pour les types d'avertissements (identifiés par la propriété `name`) émis par Node.js. De nouveaux types d'avertissements peuvent être ajoutés à tout moment. Voici quelques-uns des types d'avertissements les plus courants :

- `'DeprecationWarning'` - Indique l'utilisation d'une API ou d'une fonctionnalité Node.js obsolète. Ces avertissements doivent inclure une propriété `'code'` identifiant le [code d'obsolescence](/fr/nodejs/api/deprecations).
- `'ExperimentalWarning'` - Indique l'utilisation d'une API ou d'une fonctionnalité Node.js expérimentale. Ces fonctionnalités doivent être utilisées avec prudence car elles peuvent changer à tout moment et ne sont pas soumises aux mêmes politiques strictes de gestion des versions sémantiques et de support à long terme que les fonctionnalités prises en charge.
- `'MaxListenersExceededWarning'` - Indique qu'un trop grand nombre d'écouteurs pour un événement donné ont été enregistrés sur un `EventEmitter` ou un `EventTarget`. C'est souvent le signe d'une fuite de mémoire.
- `'TimeoutOverflowWarning'` - Indique qu'une valeur numérique qui ne peut pas tenir dans un entier signé de 32 bits a été fournie aux fonctions `setTimeout()` ou `setInterval()`.
- `'TimeoutNegativeWarning'` - Indique qu'un nombre négatif a été fourni aux fonctions `setTimeout()` ou `setInterval()`.
- `'TimeoutNaNWarning'` - Indique qu'une valeur qui n'est pas un nombre a été fournie aux fonctions `setTimeout()` ou `setInterval()`.
- `'UnsupportedWarning'` - Indique l'utilisation d'une option ou d'une fonctionnalité non prise en charge qui sera ignorée plutôt que traitée comme une erreur. Un exemple est l'utilisation du message d'état de la réponse HTTP lors de l'utilisation de l'API de compatibilité HTTP/2.

### Événement: `'worker'` {#event-worker}

**Ajouté dans: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/fr/nodejs/api/worker_threads#class-worker) Le [\<Worker\>](/fr/nodejs/api/worker_threads#class-worker) qui a été créé.

L'événement `'worker'` est émis après la création d'un nouveau thread [\<Worker\>](/fr/nodejs/api/worker_threads#class-worker).


### Événements de signal {#signal-events}

Des événements de signal seront émis lorsque le processus Node.js reçoit un signal. Veuillez vous référer à [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) pour une liste des noms de signaux POSIX standard tels que `'SIGINT'`, `'SIGHUP'`, etc.

Les signaux ne sont pas disponibles sur les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).

Le gestionnaire de signaux recevra le nom du signal (`'SIGINT'`, `'SIGTERM'`, etc.) comme premier argument.

Le nom de chaque événement sera le nom commun en majuscules du signal (par exemple, `'SIGINT'` pour les signaux `SIGINT`).

::: code-group
```js [ESM]
import process from 'node:process';

// Commencer à lire à partir de stdin pour que le processus ne se termine pas.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Utilisation d'une seule fonction pour gérer plusieurs signaux
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// Commencer à lire à partir de stdin pour que le processus ne se termine pas.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Utilisation d'une seule fonction pour gérer plusieurs signaux
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'` est réservé par Node.js pour démarrer le [débogueur](/fr/nodejs/api/debugger). Il est possible d'installer un écouteur, mais cela pourrait interférer avec le débogueur.
- `'SIGTERM'` et `'SIGINT'` ont des gestionnaires par défaut sur les plates-formes non-Windows qui réinitialisent le mode terminal avant de quitter avec le code `128 + numéro de signal`. Si l'un de ces signaux a un écouteur installé, son comportement par défaut sera supprimé (Node.js ne se terminera plus).
- `'SIGPIPE'` est ignoré par défaut. Il peut avoir un écouteur installé.
- `'SIGHUP'` est généré sous Windows lorsque la fenêtre de la console est fermée, et sur d'autres plates-formes dans diverses conditions similaires. Voir [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7). Il peut avoir un écouteur installé, cependant Node.js sera inconditionnellement terminé par Windows environ 10 secondes plus tard. Sur les plates-formes non-Windows, le comportement par défaut de `SIGHUP` est de terminer Node.js, mais une fois qu'un écouteur a été installé, son comportement par défaut sera supprimé.
- `'SIGTERM'` n'est pas pris en charge sur Windows, il peut être écouté.
- `'SIGINT'` depuis le terminal est pris en charge sur toutes les plates-formes, et peut généralement être généré avec + (bien que cela puisse être configurable). Il n'est pas généré lorsque le [mode brut du terminal](/fr/nodejs/api/tty#readstreamsetrawmodemode) est activé et que + est utilisé.
- `'SIGBREAK'` est délivré sous Windows lorsque + est pressé. Sur les plates-formes non-Windows, il peut être écouté, mais il n'y a aucun moyen de l'envoyer ou de le générer.
- `'SIGWINCH'` est délivré lorsque la console a été redimensionnée. Sous Windows, cela ne se produira que lors de l'écriture dans la console lorsque le curseur est déplacé, ou lorsqu'un tty lisible est utilisé en mode brut.
- `'SIGKILL'` ne peut pas avoir d'écouteur installé, il terminera inconditionnellement Node.js sur toutes les plates-formes.
- `'SIGSTOP'` ne peut pas avoir d'écouteur installé.
- `'SIGBUS'`, `'SIGFPE'`, `'SIGSEGV'` et `'SIGILL'`, lorsqu'ils ne sont pas déclenchés artificiellement à l'aide de [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2), laissent intrinsèquement le processus dans un état à partir duquel il n'est pas sûr d'appeler des écouteurs JS. Cela pourrait entraîner l'arrêt de la réponse du processus.
- `0` peut être envoyé pour tester l'existence d'un processus, cela n'a aucun effet si le processus existe, mais renverra une erreur si le processus n'existe pas.

Windows ne prend pas en charge les signaux et n'a donc pas d'équivalent à la terminaison par signal, mais Node.js offre une certaine émulation avec [`process.kill()`](/fr/nodejs/api/process#processkillpid-signal), et [`subprocess.kill()`](/fr/nodejs/api/child_process#subprocesskillsignal):

- L'envoi de `SIGINT`, `SIGTERM` et `SIGKILL` entraînera la terminaison inconditionnelle du processus cible, et ensuite, le sous-processus signalera que le processus a été terminé par un signal.
- L'envoi du signal `0` peut être utilisé comme un moyen indépendant de la plate-forme pour tester l'existence d'un processus.


## `process.abort()` {#processabort}

**Ajouté dans : v0.7.0**

La méthode `process.abort()` force le processus Node.js à quitter immédiatement et à générer un fichier core.

Cette fonctionnalité n'est pas disponible dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**Ajouté dans : v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

La propriété `process.allowedNodeEnvironmentFlags` est un `Set` spécial en lecture seule des flags autorisés dans la variable d'environnement [`NODE_OPTIONS`](/fr/nodejs/api/cli#node_optionsoptions).

`process.allowedNodeEnvironmentFlags` étend `Set`, mais remplace `Set.prototype.has` pour reconnaître plusieurs représentations possibles différentes des flags. `process.allowedNodeEnvironmentFlags.has()` retournera `true` dans les cas suivants :

- Les flags peuvent omettre les tirets simples (`-`) ou doubles (`--`) initiaux ; par exemple, `inspect-brk` pour `--inspect-brk`, ou `r` pour `-r`.
- Les flags transmis à V8 (comme indiqué dans `--v8-options`) peuvent remplacer un ou plusieurs tirets *non initiaux* par un trait de soulignement, ou inversement ; par exemple, `--perf_basic_prof`, `--perf-basic-prof`, `--perf_basic-prof`, etc.
- Les flags peuvent contenir un ou plusieurs caractères égal (`=`) ; tous les caractères après et incluant le premier égal seront ignorés ; par exemple, `--stack-trace-limit=100`.
- Les flags *doivent* être autorisés dans [`NODE_OPTIONS`](/fr/nodejs/api/cli#node_optionsoptions).

Lors de l'itération sur `process.allowedNodeEnvironmentFlags`, les flags n'apparaîtront qu'une *seule* fois ; chacun commencera par un ou plusieurs tirets. Les flags transmis à V8 contiendront des traits de soulignement au lieu de tirets non initiaux :

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

Les méthodes `add()`, `clear()` et `delete()` de `process.allowedNodeEnvironmentFlags` ne font rien et échoueront silencieusement.

Si Node.js a été compilé *sans* prise en charge de [`NODE_OPTIONS`](/fr/nodejs/api/cli#node_optionsoptions) (indiqué dans [`process.config`](/fr/nodejs/api/process#processconfig)), `process.allowedNodeEnvironmentFlags` contiendra ce qui *aurait été* autorisé.


## `process.arch` {#processarch}

**Ajouté dans : v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'architecture du CPU du système d'exploitation pour lequel le binaire Node.js a été compilé. Les valeurs possibles sont : `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` et `'x64'`.

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`L'architecture de ce processeur est ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`L'architecture de ce processeur est ${arch}`);
```
:::

## `process.argv` {#processargv}

**Ajouté dans : v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `process.argv` renvoie un tableau contenant les arguments de ligne de commande passés lors du lancement du processus Node.js. Le premier élément sera [`process.execPath`](/fr/nodejs/api/process#processexecpath). Voir `process.argv0` si l'accès à la valeur originale de `argv[0]` est nécessaire. Le deuxième élément sera le chemin d'accès au fichier JavaScript en cours d'exécution. Les éléments restants seront tous les arguments de ligne de commande supplémentaires.

Par exemple, en supposant le script suivant pour `process-args.js` :

::: code-group
```js [ESM]
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

Lancement du processus Node.js comme :

```bash [BASH]
node process-args.js one two=three four
```
Génèrerait la sortie :

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Ajouté dans : v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `process.argv0` stocke une copie en lecture seule de la valeur originale de `argv[0]` passée au démarrage de Node.js.

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | L'objet n'expose plus accidentellement les liaisons C++ natives. |
| v7.1.0 | Ajouté dans : v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si le processus Node.js a été lancé avec un canal IPC (voir la documentation sur les [Processus Enfant](/fr/nodejs/api/child_process)), la propriété `process.channel` est une référence au canal IPC. Si aucun canal IPC n'existe, cette propriété est `undefined`.

### `process.channel.ref()` {#processchannelref}

**Ajouté dans : v7.1.0**

Cette méthode permet au canal IPC de maintenir la boucle d'événements du processus en cours d'exécution si `.unref()` a été appelé auparavant.

En général, ceci est géré par le nombre d'écouteurs `'disconnect'` et `'message'` sur l'objet `process`. Cependant, cette méthode peut être utilisée pour demander explicitement un comportement spécifique.

### `process.channel.unref()` {#processchannelunref}

**Ajouté dans : v7.1.0**

Cette méthode fait en sorte que le canal IPC ne maintienne pas la boucle d'événements du processus en cours d'exécution, et lui permet de se terminer même lorsque le canal est ouvert.

En général, ceci est géré par le nombre d'écouteurs `'disconnect'` et `'message'` sur l'objet `process`. Cependant, cette méthode peut être utilisée pour demander explicitement un comportement spécifique.

## `process.chdir(directory)` {#processchdirdirectory}

**Ajouté dans : v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `process.chdir()` change le répertoire de travail actuel du processus Node.js ou lève une exception si cela échoue (par exemple, si le `directory` spécifié n'existe pas).

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

Cette fonctionnalité n'est pas disponible dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).


## `process.config` {#processconfig}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'objet `process.config` est maintenant figé. |
| v16.0.0 | La modification de process.config est dépréciée. |
| v0.7.7 | Ajouté dans : v0.7.7 |
:::

- [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propriété `process.config` renvoie un `Object` figé contenant la représentation JavaScript des options de configuration utilisées pour compiler l'exécutable Node.js actuel. C'est le même que le fichier `config.gypi` qui a été produit lors de l'exécution du script `./configure`.

Un exemple de sortie possible ressemble à ceci :

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**Ajouté dans : v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Si le processus Node.js est généré avec un canal IPC (voir la documentation [Processus Enfant](/fr/nodejs/api/child_process) et [Cluster](/fr/nodejs/api/cluster)), la propriété `process.connected` renverra `true` tant que le canal IPC est connecté et renverra `false` après l'appel de `process.disconnect()`.

Une fois que `process.connected` est `false`, il n'est plus possible d'envoyer des messages sur le canal IPC en utilisant `process.send()`.

## `process.constrainedMemory()` {#processconstrainedmemory}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | Valeur de retour alignée avec `uv_get_constrained_memory`. |
| v19.6.0, v18.15.0 | Ajouté dans : v19.6.0, v18.15.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)

Obtient la quantité de mémoire disponible pour le processus (en octets) en fonction des limites imposées par le système d'exploitation. S'il n'y a pas de telle contrainte, ou si la contrainte est inconnue, `0` est renvoyé.

Voir [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory) pour plus d'informations.


## `process.availableMemory()` {#processavailablememory}

**Ajouté dans : v22.0.0, v20.13.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Obtient la quantité de mémoire libre qui est encore disponible pour le processus (en octets).

Voir [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory) pour plus d'informations.

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Ajouté dans : v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Une valeur de retour précédente d'un appel à `process.cpuUsage()`
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



La méthode `process.cpuUsage()` renvoie l'utilisation du temps CPU utilisateur et système du processus actuel, dans un objet avec les propriétés `user` et `system`, dont les valeurs sont des valeurs en microsecondes (millionième de seconde). Ces valeurs mesurent le temps passé respectivement dans le code utilisateur et système, et peuvent être supérieures au temps écoulé réel si plusieurs cœurs de CPU effectuent des tâches pour ce processus.

Le résultat d'un appel précédent à `process.cpuUsage()` peut être passé comme argument à la fonction, pour obtenir une lecture de différence.



::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**Ajoutée dans : v0.1.8**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `process.cwd()` renvoie le répertoire de travail courant du processus Node.js.

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Répertoire courant : ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Répertoire courant : ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**Ajoutée dans : v0.7.2**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le port utilisé par le débogueur Node.js lorsqu'il est activé.

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**Ajoutée dans : v0.7.2**

Si le processus Node.js est généré avec un canal IPC (voir la documentation [Processus enfant](/fr/nodejs/api/child_process) et [Cluster](/fr/nodejs/api/cluster)), la méthode `process.disconnect()` fermera le canal IPC vers le processus parent, permettant au processus enfant de se terminer correctement une fois qu'il n'y a plus de connexions le maintenant en vie.

L'effet de l'appel à `process.disconnect()` est le même que l'appel à [`ChildProcess.disconnect()`](/fr/nodejs/api/child_process#subprocessdisconnect) à partir du processus parent.

Si le processus Node.js n'a pas été généré avec un canal IPC, `process.disconnect()` sera `undefined`.

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Ajout de la prise en charge de l'argument `flags`. |
| v0.1.16 | Ajoutée dans : v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/fr/nodejs/api/os#dlopen-constants) **Par défaut :** `os.constants.dlopen.RTLD_LAZY`

La méthode `process.dlopen()` permet de charger dynamiquement des objets partagés. Elle est principalement utilisée par `require()` pour charger des Addons C++, et ne doit pas être utilisée directement, sauf dans des cas particuliers. En d'autres termes, [`require()`](/fr/nodejs/api/globals#require) doit être préféré à `process.dlopen()` à moins qu'il n'y ait des raisons spécifiques telles que des drapeaux dlopen personnalisés ou le chargement à partir de modules ES.

L'argument `flags` est un entier qui permet de spécifier le comportement de dlopen. Voir la documentation [`os.constants.dlopen`](/fr/nodejs/api/os#dlopen-constants) pour plus de détails.

Une exigence importante lors de l'appel à `process.dlopen()` est que l'instance `module` doit être passée. Les fonctions exportées par l'Addon C++ sont alors accessibles via `module.exports`.

L'exemple ci-dessous montre comment charger un Addon C++, nommé `local.node`, qui exporte une fonction `foo`. Tous les symboles sont chargés avant que l'appel ne revienne, en passant la constante `RTLD_NOW`. Dans cet exemple, la constante est supposée être disponible.

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(avertissement[, options])` {#processemitwarningwarning-options}

**Ajouté dans: v8.0.0**

- `avertissement` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'avertissement à émettre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lorsque `avertissement` est une `String`, `type` est le nom à utiliser pour le *type* d'avertissement émis. **Par défaut:** `'Warning'`.
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un identifiant unique pour l'instance d'avertissement émise.
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Lorsque `avertissement` est une `String`, `ctor` est une fonction optionnelle utilisée pour limiter la trace de pile générée. **Par défaut:** `process.emitWarning`.
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Texte supplémentaire à inclure avec l'erreur.
  
 

La méthode `process.emitWarning()` peut être utilisée pour émettre des avertissements de processus personnalisés ou spécifiques à l'application. Ceux-ci peuvent être écoutés en ajoutant un gestionnaire à l'événement [`'warning'`](/fr/nodejs/api/process#event-warning).



::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Émet un avertissement avec un code et des détails supplémentaires.
emitWarning('Quelque chose s\'est produit !', {
  code: 'MY_WARNING',
  detail: 'Voici quelques informations supplémentaires',
});
// Émet :
// (node:56338) [MY_WARNING] Warning: Quelque chose s'est produit !
// Voici quelques informations supplémentaires
```

```js [CJS]
const { emitWarning } = require('node:process');

// Émet un avertissement avec un code et des détails supplémentaires.
emitWarning('Quelque chose s\'est produit !', {
  code: 'MY_WARNING',
  detail: 'Voici quelques informations supplémentaires',
});
// Émet :
// (node:56338) [MY_WARNING] Warning: Quelque chose s'est produit !
// Voici quelques informations supplémentaires
```
:::

Dans cet exemple, un objet `Error` est généré en interne par `process.emitWarning()` et transmis au gestionnaire [`'warning'`](/fr/nodejs/api/process#event-warning).



::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Quelque chose s'est produit !'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Trace de pile
  console.warn(warning.detail);  // 'Voici quelques informations supplémentaires'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Quelque chose s'est produit !'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Trace de pile
  console.warn(warning.detail);  // 'Voici quelques informations supplémentaires'
});
```
:::

Si `avertissement` est passé en tant qu'objet `Error`, l'argument `options` est ignoré.


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**Ajouté dans : v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'avertissement à émettre.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quand `warning` est une `String`, `type` est le nom à utiliser pour le *type* d'avertissement émis. **Par défaut:** `'Warning'`.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un identifiant unique pour l'instance d'avertissement émise.
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Quand `warning` est une `String`, `ctor` est une fonction optionnelle utilisée pour limiter la trace de pile générée. **Par défaut:** `process.emitWarning`.

La méthode `process.emitWarning()` peut être utilisée pour émettre des avertissements de processus personnalisés ou spécifiques à l'application. Ceux-ci peuvent être écoutés en ajoutant un gestionnaire à l'événement [`'warning'`](/fr/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Émettre un avertissement en utilisant une chaîne de caractères.
emitWarning('Quelque chose s'est produit !');
// Émet : (node : 56338) Warning : Quelque chose s'est produit !
```

```js [CJS]
const { emitWarning } = require('node:process');

// Émettre un avertissement en utilisant une chaîne de caractères.
emitWarning('Quelque chose s'est produit !');
// Émet : (node : 56338) Warning : Quelque chose s'est produit !
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Émettre un avertissement en utilisant une chaîne et un type.
emitWarning('Quelque chose s'est produit !', 'CustomWarning');
// Émet : (node : 56338) CustomWarning : Quelque chose s'est produit !
```

```js [CJS]
const { emitWarning } = require('node:process');

// Émettre un avertissement en utilisant une chaîne et un type.
emitWarning('Quelque chose s'est produit !', 'CustomWarning');
// Émet : (node : 56338) CustomWarning : Quelque chose s'est produit !
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('Quelque chose s'est produit !', 'CustomWarning', 'WARN001');
// Émet : (node : 56338) [WARN001] CustomWarning : Quelque chose s'est produit !
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('Quelque chose s'est produit !', 'CustomWarning', 'WARN001');
// Émet : (node : 56338) [WARN001] CustomWarning : Quelque chose s'est produit !
```
:::

Dans chacun des exemples précédents, un objet `Error` est généré en interne par `process.emitWarning()` et transmis au gestionnaire [`'warning'`](/fr/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

Si `warning` est passé comme un objet `Error`, il sera transmis au gestionnaire d'événements `'warning'` sans modification (et les arguments optionnels `type`, `code` et `ctor` seront ignorés) :

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Émettre un avertissement en utilisant un objet Error.
const myWarning = new Error('Quelque chose s'est produit !');
// Utilisez la propriété name Error pour spécifier le nom du type
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Émet : (node : 56338) [WARN001] CustomWarning : Quelque chose s'est produit !
```

```js [CJS]
const { emitWarning } = require('node:process');

// Émettre un avertissement en utilisant un objet Error.
const myWarning = new Error('Quelque chose s'est produit !');
// Utilisez la propriété name Error pour spécifier le nom du type
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Émet : (node : 56338) [WARN001] CustomWarning : Quelque chose s'est produit !
```
:::

Une `TypeError` est levée si `warning` est autre chose qu'une chaîne de caractères ou un objet `Error`.

Bien que les avertissements de processus utilisent des objets `Error`, le mécanisme d'avertissement de processus ne remplace **pas** les mécanismes normaux de gestion des erreurs.

La gestion supplémentaire suivante est implémentée si le `type` d'avertissement est `'DeprecationWarning'` :

- Si l'indicateur de ligne de commande `--throw-deprecation` est utilisé, l'avertissement de dépréciation est levé comme une exception au lieu d'être émis comme un événement.
- Si l'indicateur de ligne de commande `--no-deprecation` est utilisé, l'avertissement de dépréciation est supprimé.
- Si l'indicateur de ligne de commande `--trace-deprecation` est utilisé, l'avertissement de dépréciation est imprimé sur `stderr` avec la trace de pile complète.


### Éviter les avertissements en double {#avoiding-duplicate-warnings}

En guise de bonne pratique, les avertissements ne doivent être émis qu'une seule fois par processus. Pour ce faire, placez `emitWarning()` derrière un booléen.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// N'émet rien
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// N'émet rien
```
:::

## `process.env` {#processenv}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.14.0 | Les threads Worker utiliseront désormais une copie du `process.env` du thread parent par défaut, configurable via l'option `env` du constructeur `Worker`. |
| v10.0.0 | La conversion implicite de la valeur de la variable en chaîne de caractères est dépréciée. |
| v0.1.27 | Ajouté dans : v0.1.27 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propriété `process.env` renvoie un objet contenant l'environnement utilisateur. Voir [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7).

Un exemple de cet objet ressemble à ceci :

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
Il est possible de modifier cet objet, mais ces modifications ne seront pas répercutées en dehors du processus Node.js, ni (sauf demande explicite) dans d'autres threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker). En d'autres termes, l'exemple suivant ne fonctionnerait pas :

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
Alors que ce qui suit fonctionnera :

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

L'assignation d'une propriété sur `process.env` convertira implicitement la valeur en chaîne de caractères. **Ce comportement est déprécié.** Les versions futures de Node.js peuvent générer une erreur lorsque la valeur n'est pas une chaîne de caractères, un nombre ou un booléen.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

Utilisez `delete` pour supprimer une propriété de `process.env`.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

Sur les systèmes d'exploitation Windows, les variables d'environnement ne sont pas sensibles à la casse.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

Sauf indication contraire lors de la création d'une instance de [`Worker`](/fr/nodejs/api/worker_threads#class-worker), chaque thread [`Worker`](/fr/nodejs/api/worker_threads#class-worker) possède sa propre copie de `process.env`, basée sur le `process.env` de son thread parent, ou sur ce qui a été spécifié comme option `env` au constructeur [`Worker`](/fr/nodejs/api/worker_threads#class-worker). Les modifications apportées à `process.env` ne seront pas visibles entre les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker), et seul le thread principal peut apporter des modifications visibles par le système d'exploitation ou par les modules complémentaires natifs. Sous Windows, une copie de `process.env` sur une instance de [`Worker`](/fr/nodejs/api/worker_threads#class-worker) fonctionne d'une manière sensible à la casse, contrairement au thread principal.


## `process.execArgv` {#processexecargv}

**Ajouté dans : v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `process.execArgv` renvoie l'ensemble des options de ligne de commande spécifiques à Node.js passées lors du lancement du processus Node.js. Ces options n'apparaissent pas dans le tableau renvoyé par la propriété [`process.argv`](/fr/nodejs/api/process#processargv) et n'incluent pas l'exécutable Node.js, le nom du script ou toute option suivant le nom du script. Ces options sont utiles pour engendrer des processus enfants avec le même environnement d'exécution que le parent.

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
Résultats dans `process.execArgv` :

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
Et `process.argv` :

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
Consultez [`Worker` constructor](/fr/nodejs/api/worker_threads#new-workerfilename-options) pour le comportement détaillé des threads worker avec cette propriété.

## `process.execPath` {#processexecpath}

**Ajouté dans : v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `process.execPath` renvoie le nom de chemin absolu de l'exécutable qui a démarré le processus Node.js. Les liens symboliques, le cas échéant, sont résolus.

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | N'accepte qu'un code de type nombre, ou de type chaîne s'il représente un entier. |
| v0.1.13 | Ajouté dans : v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le code de sortie. Pour le type chaîne, seules les chaînes d'entiers (par exemple, « 1 ») sont autorisées. **Par défaut :** `0`.

La méthode `process.exit()` demande à Node.js de terminer le processus de manière synchrone avec un statut de sortie `code`. Si `code` est omis, exit utilise soit le code « success » `0`, soit la valeur de `process.exitCode` s'il a été défini. Node.js ne se terminera pas tant que tous les écouteurs d'événements [`'exit'`](/fr/nodejs/api/process#event-exit) ne sont pas appelés.

Pour quitter avec un code « failure » :



::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

Le shell qui a exécuté Node.js doit voir le code de sortie comme `1`.

L'appel de `process.exit()` forcera le processus à se terminer aussi rapidement que possible, même s'il existe encore des opérations asynchrones en attente qui ne sont pas encore terminées, y compris les opérations d'E/S vers `process.stdout` et `process.stderr`.

Dans la plupart des cas, il n'est pas réellement nécessaire d'appeler `process.exit()` explicitement. Le processus Node.js se terminera de lui-même *s'il n'y a pas de travail supplémentaire en attente* dans la boucle d'événements. La propriété `process.exitCode` peut être définie pour indiquer au processus quel code de sortie utiliser lorsque le processus se termine correctement.

Par exemple, l'exemple suivant illustre une *mauvaise utilisation* de la méthode `process.exit()` qui pourrait entraîner la troncature et la perte des données imprimées sur stdout :



::: code-group
```js [ESM]
import { exit } from 'node:process';

// Voici un exemple de ce qu'il *ne faut pas* faire :
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// Voici un exemple de ce qu'il *ne faut pas* faire :
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

La raison pour laquelle cela est problématique est que les écritures dans `process.stdout` dans Node.js sont parfois *asynchrones* et peuvent se produire sur plusieurs cycles de la boucle d'événements Node.js. L'appel de `process.exit()`, cependant, force le processus à se terminer *avant* que ces écritures supplémentaires dans `stdout` puissent être effectuées.

Au lieu d'appeler `process.exit()` directement, le code *doit* définir le `process.exitCode` et permettre au processus de se terminer naturellement en évitant de planifier un travail supplémentaire pour la boucle d'événements :



::: code-group
```js [ESM]
import process from 'node:process';

// Comment définir correctement le code de sortie tout en laissant
// le processus se terminer correctement.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// Comment définir correctement le code de sortie tout en laissant
// le processus se terminer correctement.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

S'il est nécessaire d'arrêter le processus Node.js en raison d'une condition d'erreur, il est plus sûr de lever une erreur *non interceptée* et de laisser le processus se terminer en conséquence que d'appeler `process.exit()`.

Dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker), cette fonction arrête le thread courant plutôt que le processus courant.


## `process.exitCode` {#processexitcode_1}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Accepte uniquement un code de type nombre, ou de type chaîne s'il représente un entier. |
| v0.11.8 | Ajouté dans : v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le code de sortie. Pour le type chaîne, seules les chaînes entières (par exemple, '1') sont autorisées. **Par défaut :** `undefined`.

Un nombre qui sera le code de sortie du processus, lorsque le processus se termine normalement, ou se termine via [`process.exit()`](/fr/nodejs/api/process#processexitcode) sans spécifier de code.

La spécification d'un code à [`process.exit(code)`](/fr/nodejs/api/process#processexitcode) remplacera tout paramètre précédent de `process.exitCode`.

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**Ajouté dans : v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js met en cache les modules intégrés.

## `process.features.debug` {#processfeaturesdebug}

**Ajouté dans : v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js est une version de débogage.

## `process.features.inspector` {#processfeaturesinspector}

**Ajouté dans : v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js inclut l'inspecteur.

## `process.features.ipv6` {#processfeaturesipv6}

**Ajouté dans : v0.5.3**

**Déprécié depuis : v23.4.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Cette propriété est toujours vraie, et toutes les vérifications basées sur elle sont redondantes.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js inclut la prise en charge d'IPv6.

Étant donné que toutes les versions de Node.js prennent en charge IPv6, cette valeur est toujours `true`.


## `process.features.require_module` {#processfeaturesrequire_module}

**Ajouté dans : v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js prend en charge [le chargement des modules ECMAScript à l’aide de `require()` ](/fr/nodejs/api/modules#loading-ecmascript-modules-using-require).

## `process.features.tls` {#processfeaturestls}

**Ajouté dans : v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js inclut la prise en charge de TLS.

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**Déprécié depuis : v23.4.0**

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez `process.features.tls` à la place.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js inclut la prise en charge d’ALPN dans TLS.

Dans Node.js 11.0.0 et les versions ultérieures, les dépendances OpenSSL offrent une prise en charge inconditionnelle d’ALPN. Cette valeur est donc identique à celle de `process.features.tls`.

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**Ajouté dans : v0.11.13**

**Déprécié depuis : v23.4.0**

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez `process.features.tls` à la place.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js inclut la prise en charge d’OCSP dans TLS.

Dans Node.js 11.0.0 et les versions ultérieures, les dépendances OpenSSL offrent une prise en charge inconditionnelle d’OCSP. Cette valeur est donc identique à celle de `process.features.tls`.

## `process.features.tls_sni` {#processfeaturestls_sni}

**Ajouté dans : v0.5.3**

**Déprécié depuis : v23.4.0**

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez `process.features.tls` à la place.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js inclut la prise en charge de SNI dans TLS.

Dans Node.js 11.0.0 et les versions ultérieures, les dépendances OpenSSL offrent une prise en charge inconditionnelle de SNI. Cette valeur est donc identique à celle de `process.features.tls`.


## `process.features.typescript` {#processfeaturestypescript}

**Ajouté dans : v23.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Une valeur qui est `"strip"` si Node.js est exécuté avec `--experimental-strip-types`, `"transform"` si Node.js est exécuté avec `--experimental-transform-types`, et `false` sinon.

## `process.features.uv` {#processfeaturesuv}

**Ajouté dans : v0.5.3**

**Déprécié depuis : v23.4.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Cette propriété est toujours vraie, et toute vérification basée sur elle est redondante.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une valeur booléenne qui est `true` si la version actuelle de Node.js inclut la prise en charge de libuv.

Puisqu'il n'est pas possible de compiler Node.js sans libuv, cette valeur est toujours `true`.

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La référence à la ressource qui est suivie.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de rappel à appeler lorsque la ressource est finalisée.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La référence à la ressource qui est suivie.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'événement qui a déclenché la finalisation. Par défaut, 'exit'.

Cette fonction enregistre une fonction de rappel à appeler lorsque le processus émet l'événement `exit` si l'objet `ref` n'a pas été collecté par le garbage collector. Si l'objet `ref` a été collecté par le garbage collector avant que l'événement `exit` ne soit émis, la fonction de rappel sera supprimée du registre de finalisation, et elle ne sera pas appelée à la sortie du processus.

À l'intérieur de la fonction de rappel, vous pouvez libérer les ressources allouées par l'objet `ref`. Sachez que toutes les limitations appliquées à l'événement `beforeExit` sont également appliquées à la fonction `callback`, ce qui signifie qu'il est possible que la fonction de rappel ne soit pas appelée dans des circonstances particulières.

L'idée de cette fonction est de vous aider à libérer des ressources lorsque le processus commence à se terminer, mais aussi de permettre à l'objet d'être collecté par le garbage collector s'il n'est plus utilisé.

Par exemple : vous pouvez enregistrer un objet qui contient un tampon, vous voulez vous assurer que le tampon est libéré lorsque le processus se termine, mais si l'objet est collecté par le garbage collector avant la fin du processus, nous n'avons plus besoin de libérer le tampon, donc dans ce cas, nous supprimons simplement la fonction de rappel du registre de finalisation.

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Veuillez vous assurer que la fonction passée à finalization.register()
// ne crée pas de fermeture autour d'objets inutiles.
function onFinalize(obj, event) {
  // Vous pouvez faire ce que vous voulez avec l'objet
  obj.dispose();
}

function setup() {
  // Cet objet peut être collecté en toute sécurité par le garbage collector,
  // et la fonction d'arrêt résultante ne sera pas appelée.
  // Il n'y a pas de fuites.
  const myDisposableObject = {
    dispose() {
      // Libérez vos ressources de manière synchrone
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Veuillez vous assurer que la fonction passée à finalization.register()
// ne crée pas de fermeture autour d'objets inutiles.
function onFinalize(obj, event) {
  // Vous pouvez faire ce que vous voulez avec l'objet
  obj.dispose();
}

function setup() {
  // Cet objet peut être collecté en toute sécurité par le garbage collector,
  // et la fonction d'arrêt résultante ne sera pas appelée.
  // Il n'y a pas de fuites.
  const myDisposableObject = {
    dispose() {
      // Libérez vos ressources de manière synchrone
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

Le code ci-dessus repose sur les hypothèses suivantes :

- les fonctions fléchées sont évitées
- il est recommandé que les fonctions régulières se trouvent dans le contexte global (racine)

Les fonctions régulières *pourraient* référencer le contexte où vit `obj`, rendant `obj` non collectable par le garbage collector.

Les fonctions fléchées conserveront le contexte précédent. Considérez, par exemple :

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // Même quelque chose comme ça est fortement déconseillé
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
Il est très peu probable (mais pas impossible) que cet objet soit collecté par le garbage collector, mais si ce n'est pas le cas, `dispose` sera appelé lorsque `process.exit` sera appelé.

Soyez prudent et évitez de vous fier à cette fonctionnalité pour la suppression des ressources critiques, car il n'est pas garanti que la fonction de rappel sera appelée dans toutes les circonstances.


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement Actif
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La référence à la ressource qui est suivie.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de rappel à appeler lorsque la ressource est finalisée.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La référence à la ressource qui est suivie.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'événement qui a déclenché la finalisation. La valeur par défaut est 'beforeExit'.



Cette fonction se comporte exactement comme `register`, sauf que le rappel sera appelé lorsque le processus émet l'événement `beforeExit` si l'objet `ref` n'a pas été collecté par le ramasse-miettes.

Soyez conscient que toutes les limitations appliquées à l'événement `beforeExit` sont également appliquées à la fonction `callback`, ce qui signifie qu'il est possible que le rappel ne soit pas appelé dans des circonstances particulières.

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement Actif
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La référence à la ressource qui a été enregistrée précédemment.

Cette fonction supprime l'enregistrement de l'objet du registre de finalisation, de sorte que le rappel ne sera plus appelé.



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Veuillez vous assurer que la fonction passée à finalization.register()
// ne crée pas de fermeture autour d'objets inutiles.
function onFinalize(obj, event) {
  // Vous pouvez faire ce que vous voulez avec l'objet
  obj.dispose();
}

function setup() {
  // Cet objet peut être collecté en toute sécurité par le ramasse-miettes,
  // et la fonction d'arrêt résultante ne sera pas appelée.
  // Il n'y a pas de fuites.
  const myDisposableObject = {
    dispose() {
      // Libérez vos ressources de manière synchrone
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // Faites quelque chose

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Veuillez vous assurer que la fonction passée à finalization.register()
// ne crée pas de fermeture autour d'objets inutiles.
function onFinalize(obj, event) {
  // Vous pouvez faire ce que vous voulez avec l'objet
  obj.dispose();
}

function setup() {
  // Cet objet peut être collecté en toute sécurité par le ramasse-miettes,
  // et la fonction d'arrêt résultante ne sera pas appelée.
  // Il n'y a pas de fuites.
  const myDisposableObject = {
    dispose() {
      // Libérez vos ressources de manière synchrone
    },
  };

  // Veuillez vous assurer que la fonction passée à finalization.register()
  // ne crée pas de fermeture autour d'objets inutiles.
  function onFinalize(obj, event) {
    // Vous pouvez faire ce que vous voulez avec l'objet
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // Faites quelque chose

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**Ajouté dans : v17.3.0, v16.14.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- Retourne: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `process.getActiveResourcesInfo()` renvoie un tableau de chaînes contenant les types de ressources actives qui maintiennent actuellement la boucle d'événements active.

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Avant:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('Après:', getActiveResourcesInfo());
// Affiche:
//   Avant: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   Après: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Avant:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('Après:', getActiveResourcesInfo());
// Affiche:
//   Avant: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   Après: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**Ajouté dans : v22.3.0, v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ID du module intégré demandé.
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)` fournit un moyen de charger les modules intégrés dans une fonction disponible globalement. Les modules ES qui doivent prendre en charge d'autres environnements peuvent l'utiliser pour charger conditionnellement un module intégré Node.js lorsqu'il est exécuté dans Node.js, sans avoir à gérer l'erreur de résolution qui peut être levée par `import` dans un environnement non-Node.js ou sans avoir à utiliser `import()` dynamique qui transforme soit le module en un module asynchrone, soit transforme une API synchrone en une API asynchrone.

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // Exécuter dans Node.js, utiliser le module fs de Node.js.
  const fs = globalThis.process.getBuiltinModule('fs');
  // Si `require()` est nécessaire pour charger les modules utilisateur, utiliser createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
Si `id` spécifie un module intégré disponible dans le processus Node.js actuel, la méthode `process.getBuiltinModule(id)` renvoie le module intégré correspondant. Si `id` ne correspond à aucun module intégré, `undefined` est renvoyé.

`process.getBuiltinModule(id)` accepte les ID de modules intégrés qui sont reconnus par [`module.isBuiltin(id)`](/fr/nodejs/api/module#moduleisbuiltinmodulename). Certains modules intégrés doivent être chargés avec le préfixe `node:`, voir [modules intégrés avec préfixe `node:` obligatoire](/fr/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix). Les références renvoyées par `process.getBuiltinModule(id)` pointent toujours vers le module intégré correspondant à `id` même si les utilisateurs modifient [`require.cache`](/fr/nodejs/api/modules#requirecache) afin que `require(id)` renvoie autre chose.


## `process.getegid()` {#processgetegid}

**Ajouté dans : v2.0.0**

La méthode `process.getegid()` renvoie l’identité numérique effective du groupe du processus Node.js. (Voir [`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`GID actuel : ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`GID actuel : ${process.getegid()}`);
}
```
:::

Cette fonction est uniquement disponible sur les plates-formes POSIX (c’est-à-dire pas Windows ou Android).

## `process.geteuid()` {#processgeteuid}

**Ajouté dans : v2.0.0**

- Renvoie : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La méthode `process.geteuid()` renvoie l’identité numérique effective de l’utilisateur du processus. (Voir [`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`UID actuel : ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`UID actuel : ${process.geteuid()}`);
}
```
:::

Cette fonction est uniquement disponible sur les plates-formes POSIX (c’est-à-dire pas Windows ou Android).

## `process.getgid()` {#processgetgid}

**Ajouté dans : v0.1.31**

- Renvoie : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La méthode `process.getgid()` renvoie l’identité numérique du groupe du processus. (Voir [`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`GID actuel : ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`GID actuel : ${process.getgid()}`);
}
```
:::

Cette fonction est uniquement disponible sur les plates-formes POSIX (c’est-à-dire pas Windows ou Android).

## `process.getgroups()` {#processgetgroups}

**Ajouté dans : v0.9.4**

- Renvoie : [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La méthode `process.getgroups()` renvoie un tableau avec les ID de groupe supplémentaires. POSIX ne précise pas si l’ID de groupe effectif est inclus, mais Node.js s’assure qu’il l’est toujours.



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

Cette fonction est uniquement disponible sur les plates-formes POSIX (c’est-à-dire pas Windows ou Android).


## `process.getuid()` {#processgetuid}

**Ajouté dans : v0.1.28**

- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La méthode `process.getuid()` renvoie l'identité numérique de l'utilisateur du processus. (Voir [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`UID actuel : ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`UID actuel : ${process.getuid()}`);
}
```
:::

Cette fonction n'est disponible que sur les plateformes POSIX (c'est-à-dire pas Windows ou Android).

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Ajouté dans : v9.3.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indique si un callback a été défini en utilisant [`process.setUncaughtExceptionCaptureCallback()`](/fr/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

## `process.hrtime([time])` {#processhrtimetime}

**Ajouté dans : v0.7.6**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stabilité: 3](/fr/nodejs/api/documentation#stability-index) - Legacy. Utilisez plutôt [`process.hrtime.bigint()`](/fr/nodejs/api/process#processhrtimebigint).
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le résultat d'un appel précédent à `process.hrtime()`
- Retourne : [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

C'est la version héritée de [`process.hrtime.bigint()`](/fr/nodejs/api/process#processhrtimebigint) avant que `bigint` ne soit introduit en JavaScript.

La méthode `process.hrtime()` renvoie le temps réel actuel en haute résolution dans un `Array` tuple `[seconds, nanoseconds]`, où `nanoseconds` est la partie restante du temps réel qui ne peut pas être représentée avec la précision en secondes.

`time` est un paramètre optionnel qui doit être le résultat d'un appel précédent à `process.hrtime()` pour calculer la différence avec le temps actuel. Si le paramètre passé n'est pas un `Array` tuple, une `TypeError` sera levée. Passer un tableau défini par l'utilisateur au lieu du résultat d'un appel précédent à `process.hrtime()` entraînera un comportement indéfini.

Ces temps sont relatifs à un temps arbitraire dans le passé, et ne sont pas liés à l'heure du jour et ne sont donc pas sujets à la dérive de l'horloge. L'utilisation principale est pour mesurer la performance entre les intervalles :

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark a pris ${diff[0] * NS_PER_SEC + diff[1]} nanosecondes`);
  // Benchmark a pris 1000000552 nanosecondes
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark a pris ${diff[0] * NS_PER_SEC + diff[1]} nanosecondes`);
  // Benchmark a pris 1000000552 nanosecondes
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**Ajouté dans : v10.7.0**

- Retourne : [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La version `bigint` de la méthode [`process.hrtime()`](/fr/nodejs/api/process#processhrtimetime) renvoyant le temps réel haute résolution actuel en nanosecondes sous forme de `bigint`.

Contrairement à [`process.hrtime()`](/fr/nodejs/api/process#processhrtimetime), elle ne prend pas en charge d'argument `time` supplémentaire, car la différence peut simplement être calculée directement par soustraction des deux `bigint`.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**Ajouté dans : v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nom d’utilisateur ou l’identifiant numérique.
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nom de groupe ou un identifiant numérique.

La méthode `process.initgroups()` lit le fichier `/etc/group` et initialise la liste d’accès au groupe, en utilisant tous les groupes dont l’utilisateur est membre. Il s’agit d’une opération privilégiée qui exige que le processus Node.js ait un accès `root` ou la capacité `CAP_SETGID`.

Soyez prudent lorsque vous supprimez les privilèges :

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

Cette fonction est uniquement disponible sur les plateformes POSIX (c’est-à-dire pas Windows ni Android). Cette fonctionnalité n’est pas disponible dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).


## `process.kill(pid[, signal])` {#processkillpid-signal}

**Ajoutée dans : v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un ID de processus
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le signal à envoyer, sous forme de chaîne ou de nombre. **Par défaut :** `'SIGTERM'`.

La méthode `process.kill()` envoie le `signal` au processus identifié par `pid`.

Les noms de signal sont des chaînes telles que `'SIGINT'` ou `'SIGHUP'`. Voir [Événements de Signal](/fr/nodejs/api/process#signal-events) et [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) pour plus d'informations.

Cette méthode renverra une erreur si le `pid` cible n'existe pas. Dans un cas particulier, un signal de `0` peut être utilisé pour tester l'existence d'un processus. Les plateformes Windows renverront une erreur si le `pid` est utilisé pour tuer un groupe de processus.

Même si le nom de cette fonction est `process.kill()`, il s'agit en réalité uniquement d'un expéditeur de signal, comme l'appel système `kill`. Le signal envoyé peut faire autre chose que tuer le processus cible.

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

Lorsque `SIGUSR1` est reçu par un processus Node.js, Node.js démarre le débogueur. Voir [Événements de Signal](/fr/nodejs/api/process#signal-events).

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**Ajoutée dans : v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **Par défaut :** `'./.env'`

Charge le fichier `.env` dans `process.env`. L'utilisation de `NODE_OPTIONS` dans le fichier `.env` n'aura aucun effet sur Node.js.

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**Ajoutée dans : v0.1.17**

**Dépréciée depuis : v14.0.0**

::: danger [Stable: 0 - Dépréciée]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Dépréciée : Utilisez [`require.main`](/fr/nodejs/api/modules#accessing-the-main-module) à la place.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propriété `process.mainModule` fournit une autre façon de récupérer [`require.main`](/fr/nodejs/api/modules#accessing-the-main-module). La différence est que si le module principal change au moment de l’exécution, [`require.main`](/fr/nodejs/api/modules#accessing-the-main-module) peut toujours faire référence au module principal d’origine dans les modules qui ont été requis avant que le changement ne se produise. En général, il est prudent de supposer que les deux font référence au même module.

Comme avec [`require.main`](/fr/nodejs/api/modules#accessing-the-main-module), `process.mainModule` sera `undefined` s’il n’y a pas de script d’entrée.

## `process.memoryUsage()` {#processmemoryusage}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.9.0, v12.17.0 | `arrayBuffers` a été ajouté à l’objet retourné. |
| v7.2.0 | `external` a été ajouté à l’objet retourné. |
| v0.1.16 | Ajoutée dans : v0.1.16 |
:::

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Retourne un objet décrivant l’utilisation de la mémoire du processus Node.js mesurée en octets.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Affiche :
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Affiche :
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- `heapTotal` et `heapUsed` font référence à l’utilisation de la mémoire de V8.
- `external` fait référence à l’utilisation de la mémoire des objets C++ liés aux objets JavaScript gérés par V8.
- `rss`, Resident Set Size, est la quantité d’espace occupée dans le périphérique de mémoire principal (c’est-à-dire un sous-ensemble de la mémoire totale allouée) pour le processus, y compris tous les objets et codes C++ et JavaScript.
- `arrayBuffers` fait référence à la mémoire allouée pour les `ArrayBuffer` et les `SharedArrayBuffer`, y compris tous les [`Buffer`](/fr/nodejs/api/buffer) Node.js. Ceci est également inclus dans la valeur `external`. Lorsque Node.js est utilisé comme bibliothèque intégrée, cette valeur peut être `0` car les allocations pour les `ArrayBuffer` peuvent ne pas être suivies dans ce cas.

Lorsque vous utilisez les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker), `rss` sera une valeur valide pour l’ensemble du processus, tandis que les autres champs ne feront référence qu’au thread actuel.

La méthode `process.memoryUsage()` itère sur chaque page pour recueillir des informations sur l’utilisation de la mémoire, ce qui peut être lent selon les allocations de mémoire du programme.


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**Ajouté dans : v15.6.0, v14.18.0**

- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La méthode `process.memoryUsage.rss()` renvoie un entier représentant la taille de l’ensemble résident (RSS) en octets.

La taille de l’ensemble résident est la quantité d’espace occupée dans le dispositif de mémoire principale (c’est-à-dire un sous-ensemble de la mémoire totale allouée) pour le processus, y compris tous les objets et le code C++ et JavaScript.

Il s’agit de la même valeur que la propriété `rss` fournie par `process.memoryUsage()`, mais `process.memoryUsage.rss()` est plus rapide.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.7.0, v20.18.0 | Stabilité modifiée à Legacy. |
| v18.0.0 | Le passage d’un callback invalide à l’argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v1.8.1 | Des arguments supplémentaires après `callback` sont désormais pris en charge. |
| v0.1.26 | Ajouté dans : v0.1.26 |
:::

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Legacy : Utilisez plutôt [`queueMicrotask()`](/fr/nodejs/api/globals#queuemicrotaskcallback).
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Arguments supplémentaires à passer lors de l’appel du `callback`

`process.nextTick()` ajoute `callback` à la "next tick queue". Cette file d’attente est entièrement vidée après l’exécution complète de l’opération actuelle sur la pile JavaScript et avant que la boucle d’événement ne soit autorisée à continuer. Il est possible de créer une boucle infinie si l’on devait appeler récursivement `process.nextTick()`. Voir le guide [Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick) pour plus d’informations.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

C’est important lors du développement d’API afin de donner aux utilisateurs la possibilité d’affecter des gestionnaires d’événements *après* la construction d’un objet mais avant que toute E/S ne se produise :

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() est appelé maintenant, pas avant.
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() est appelé maintenant, pas avant.
```
:::

Il est très important que les API soient soit 100 % synchrones, soit 100 % asynchrones. Considérez cet exemple :

```js [ESM]
// ATTENTION ! NE PAS UTILISER ! DANGER MAUVAIS ET NON SÛR !
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
Cette API est dangereuse car dans le cas suivant :

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
Il n’est pas clair si `foo()` ou `bar()` sera appelé en premier.

L’approche suivante est bien meilleure :

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::


### Quand utiliser `queueMicrotask()` au lieu de `process.nextTick()` {#when-to-use-queuemicrotask-vs-processnexttick}

L'API [`queueMicrotask()`](/fr/nodejs/api/globals#queuemicrotaskcallback) est une alternative à `process.nextTick()` qui diffère également l'exécution d'une fonction en utilisant la même file d'attente de microtâches que celle utilisée pour exécuter les gestionnaires then, catch et finally des promesses résolues. Dans Node.js, chaque fois que la "file d'attente du prochain tick" est vidée, la file d'attente des microtâches est vidée immédiatement après.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```
:::

Pour *la plupart* des cas d'utilisation au niveau de l'utilisateur, l'API `queueMicrotask()` fournit un mécanisme portable et fiable pour différer l'exécution qui fonctionne dans plusieurs environnements de plateformes JavaScript et doit être préférée à `process.nextTick()`. Dans des scénarios simples, `queueMicrotask()` peut remplacer directement `process.nextTick()`.

```js [ESM]
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
```
Une différence notable entre les deux API est que `process.nextTick()` permet de spécifier des valeurs supplémentaires qui seront passées en tant qu'arguments à la fonction différée lorsqu'elle est appelée. Pour obtenir le même résultat avec `queueMicrotask()`, il faut utiliser une closure ou une fonction liée :

```js [ESM]
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
```
Il existe des différences mineures dans la manière dont les erreurs soulevées dans la file d'attente du prochain tick et la file d'attente des microtâches sont gérées. Les erreurs levées dans un rappel de microtâche mis en file d'attente doivent être gérées dans le rappel mis en file d'attente lorsque cela est possible. Si ce n'est pas le cas, le gestionnaire d'événements `process.on('uncaughtException')` peut être utilisé pour capturer et gérer les erreurs.

En cas de doute, à moins que les capacités spécifiques de `process.nextTick()` ne soient nécessaires, utilisez `queueMicrotask()`.


## `process.noDeprecation` {#processnodeprecation}

**Ajouté dans : v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `process.noDeprecation` indique si l'indicateur `--no-deprecation` est défini sur le processus Node.js actuel. Consultez la documentation de l'[`événement 'warning'`](/fr/nodejs/api/process#event-warning) et de la [`méthode emitWarning()`](/fr/nodejs/api/process#processemitwarningwarning-type-code-ctor) pour plus d'informations sur le comportement de cet indicateur.

## `process.permission` {#processpermission}

**Ajouté dans : v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Cette API est disponible via l'indicateur [`--permission`](/fr/nodejs/api/cli#--permission).

`process.permission` est un objet dont les méthodes sont utilisées pour gérer les permissions du processus actuel. Une documentation supplémentaire est disponible dans le [Modèle de permissions](/fr/nodejs/api/permissions#permission-model).

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**Ajouté dans : v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vérifie que le processus est capable d'accéder à la portée et à la référence données. Si aucune référence n'est fournie, une portée globale est supposée, par exemple, `process.permission.has('fs.read')` vérifiera si le processus a TOUTES les permissions de lecture du système de fichiers.

La référence a une signification basée sur la portée fournie. Par exemple, la référence lorsque la portée est le Système de fichiers signifie fichiers et dossiers.

Les portées disponibles sont :

- `fs` - Tout le système de fichiers
- `fs.read` - Opérations de lecture du système de fichiers
- `fs.write` - Opérations d'écriture du système de fichiers
- `child` - Opérations de création de processus enfant
- `worker` - Opération de création de thread Worker

```js [ESM]
// Vérifie si le processus a la permission de lire le fichier README
process.permission.has('fs.read', './README.md');
// Vérifie si le processus a des opérations de permission de lecture
process.permission.has('fs.read');
```


## `process.pid` {#processpid}

**Ajouté dans la version : v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propriété `process.pid` renvoie le PID du processus.

::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`Ce processus a le PID ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`Ce processus a le PID ${pid}`);
```
:::

## `process.platform` {#processplatform}

**Ajouté dans la version : v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `process.platform` renvoie une chaîne de caractères identifiant la plateforme du système d'exploitation pour laquelle le binaire Node.js a été compilé.

Les valeurs possibles actuellement sont :

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`

::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`Cette plateforme est ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`Cette plateforme est ${platform}`);
```
:::

La valeur `'android'` peut également être renvoyée si Node.js est construit sur le système d'exploitation Android. Cependant, la prise en charge d'Android dans Node.js [est expérimentale](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `process.ppid` {#processppid}

**Ajouté dans la version : v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propriété `process.ppid` renvoie le PID du parent du processus actuel.

::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`Le processus parent a le PID ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`Le processus parent a le PID ${ppid}`);
```
:::

## `process.release` {#processrelease}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v4.2.0 | La propriété `lts` est désormais prise en charge. |
| v3.0.0 | Ajouté dans la version : v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propriété `process.release` renvoie un `Object` contenant des métadonnées relatives à la version actuelle, notamment les URL du fichier tarball source et du fichier tarball contenant uniquement les en-têtes.

`process.release` contient les propriétés suivantes :

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une valeur qui sera toujours `'node'`.
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) une URL absolue pointant vers un fichier *<code>.tar.gz</code>* contenant le code source de la version actuelle.
- `headersUrl`[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) une URL absolue pointant vers un fichier *<code>.tar.gz</code>* contenant uniquement les fichiers d'en-tête source de la version actuelle. Ce fichier est considérablement plus petit que le fichier source complet et peut être utilisé pour compiler des modules complémentaires natifs Node.js.
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) une URL absolue pointant vers un fichier *<code>node.lib</code>* correspondant à l'architecture et à la version de la version actuelle. Ce fichier est utilisé pour compiler des modules complémentaires natifs Node.js. *Cette propriété est uniquement présente sur les versions Windows de Node.js et sera absente sur toutes les autres plateformes.*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) une étiquette de chaîne identifiant l'étiquette [LTS](https://github.com/nodejs/Release) de cette version. Cette propriété n'existe que pour les versions LTS et est `undefined` pour tous les autres types de versions, y compris les versions *actuelles*. Les valeurs valides incluent les noms de code des versions LTS (y compris celles qui ne sont plus prises en charge).
    - `'Fermium'` pour la ligne LTS 14.x à partir de la version 14.15.0.
    - `'Gallium'` pour la ligne LTS 16.x à partir de la version 16.13.0.
    - `'Hydrogen'` pour la ligne LTS 18.x à partir de la version 18.12.0. Pour les autres noms de code des versions LTS, consultez [Node.js Changelog Archive](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
Dans les versions personnalisées à partir de versions non publiées de l'arborescence source, seule la propriété `name` peut être présente. Il ne faut pas compter sur l'existence des propriétés supplémentaires.


## `process.report` {#processreport}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette API n'est plus expérimentale. |
| v11.8.0 | Ajoutée dans : v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` est un objet dont les méthodes sont utilisées pour générer des rapports de diagnostic pour le processus actuel. Une documentation supplémentaire est disponible dans la [documentation des rapports](/fr/nodejs/api/report).

### `process.report.compact` {#processreportcompact}

**Ajoutée dans : v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Écrit les rapports dans un format compact, JSON sur une seule ligne, plus facilement consommable par les systèmes de traitement des journaux que le format multiligne par défaut conçu pour la consommation humaine.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Les rapports sont-ils compacts ? ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Les rapports sont-ils compacts ? ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette API n'est plus expérimentale. |
| v11.12.0 | Ajoutée dans : v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Répertoire dans lequel le rapport est écrit. La valeur par défaut est la chaîne vide, indiquant que les rapports sont écrits dans le répertoire de travail actuel du processus Node.js.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Le répertoire des rapports est ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Le répertoire des rapports est ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette API n'est plus expérimentale. |
| v11.12.0 | Ajoutée dans : v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Nom de fichier dans lequel le rapport est écrit. S'il est défini sur la chaîne vide, le nom de fichier de sortie sera composé d'un horodatage, d'un PID et d'un numéro de séquence. La valeur par défaut est la chaîne vide.

Si la valeur de `process.report.filename` est définie sur `'stdout'` ou `'stderr'`, le rapport est écrit respectivement sur la sortie standard ou la sortie d'erreur du processus.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Le nom de fichier du rapport est ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Le nom de fichier du rapport est ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette API n'est plus expérimentale. |
| v11.8.0 | Ajoutée dans : v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Une erreur personnalisée utilisée pour signaler la pile JavaScript.
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne une représentation JavaScript Object d'un rapport de diagnostic pour le processus en cours d'exécution. La trace de pile JavaScript du rapport est extraite de `err`, si elle est présente.

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Similaire à process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Similaire à process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

Une documentation supplémentaire est disponible dans la [documentation du rapport](/fr/nodejs/api/report).

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0, v14.17.0 | Cette API n'est plus expérimentale. |
| v11.12.0 | Ajoutée dans : v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si `true`, un rapport de diagnostic est généré en cas d'erreurs fatales, telles que les erreurs de mémoire insuffisante ou les assertions C++ échouées.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette API n'est plus expérimentale. |
| v11.12.0 | Ajoutée dans : v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si `true`, un rapport de diagnostic est généré lorsque le processus reçoit le signal spécifié par `process.report.signal`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Rapport sur le signal : ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Rapport sur le signal : ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette API n'est plus expérimentale. |
| v11.12.0 | Ajoutée dans : v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si `true`, un rapport de diagnostic est généré lors d'une exception non interceptée.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Rapport sur l'exception : ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Rapport sur l'exception : ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**Ajoutée dans : v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si `true`, un rapport de diagnostic est généré sans les variables d'environnement.

### `process.report.signal` {#processreportsignal}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette API n'est plus expérimentale. |
| v11.12.0 | Ajoutée dans : v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le signal utilisé pour déclencher la création d'un rapport de diagnostic. La valeur par défaut est `'SIGUSR2'`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Signal de rapport : ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Signal de rapport : ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | Cette API n'est plus expérimentale. |
| v11.8.0 | Ajoutée dans : v11.8.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du fichier où le rapport est écrit. Il doit s'agir d'un chemin relatif, qui sera ajouté au répertoire spécifié dans `process.report.directory`, ou au répertoire de travail actuel du processus Node.js, si non spécifié.
- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Une erreur personnalisée utilisée pour rapporter la pile JavaScript.
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Retourne le nom de fichier du rapport généré.

Écrit un rapport de diagnostic dans un fichier. Si `filename` n'est pas fourni, le nom de fichier par défaut inclut la date, l'heure, le PID et un numéro de séquence. La trace de la pile JavaScript du rapport est tirée de `err`, si elle est présente.

Si la valeur de `filename` est définie sur `'stdout'` ou `'stderr'`, le rapport est écrit respectivement dans la sortie standard ou la sortie d'erreur du processus.

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

Une documentation supplémentaire est disponible dans la [documentation du rapport](/fr/nodejs/api/report).

## `process.resourceUsage()` {#processresourceusage}

**Ajoutée dans : v12.6.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) l'utilisation des ressources pour le processus actuel. Toutes ces valeurs proviennent de l'appel `uv_getrusage` qui retourne une [`uv_rusage_t struct`](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t).
    - `userCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_utime` calculé en microsecondes. C'est la même valeur que [`process.cpuUsage().user`](/fr/nodejs/api/process#processcpuusagepreviousvalue).
    - `systemCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_stime` calculé en microsecondes. C'est la même valeur que [`process.cpuUsage().system`](/fr/nodejs/api/process#processcpuusagepreviousvalue).
    - `maxRSS` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_maxrss` qui est la taille maximale de l'ensemble résident utilisé en kilo-octets.
    - `sharedMemorySize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_ixrss` mais n'est supporté par aucune plateforme.
    - `unsharedDataSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_idrss` mais n'est supporté par aucune plateforme.
    - `unsharedStackSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_isrss` mais n'est supporté par aucune plateforme.
    - `minorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_minflt` qui est le nombre de défauts de page mineurs pour le processus, voir [cet article pour plus de détails](https://en.wikipedia.org/wiki/Page_fault#Minor).
    - `majorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_majflt` qui est le nombre de défauts de page majeurs pour le processus, voir [cet article pour plus de détails](https://en.wikipedia.org/wiki/Page_fault#Major). Ce champ n'est pas supporté sur Windows.
    - `swappedOut` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_nswap` mais n'est supporté par aucune plateforme.
    - `fsRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_inblock` qui est le nombre de fois où le système de fichiers a dû effectuer une entrée.
    - `fsWrite` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_oublock` qui est le nombre de fois où le système de fichiers a dû effectuer une sortie.
    - `ipcSent` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_msgsnd` mais n'est supporté par aucune plateforme.
    - `ipcReceived` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_msgrcv` mais n'est supporté par aucune plateforme.
    - `signalsCount` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_nsignals` mais n'est supporté par aucune plateforme.
    - `voluntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_nvcsw` qui est le nombre de fois qu'un changement de contexte CPU a résulté du fait qu'un processus a volontairement abandonné le processeur avant que son temps d'exécution ne soit terminé (généralement pour attendre la disponibilité d'une ressource). Ce champ n'est pas supporté sur Windows.
    - `involuntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) correspond à `ru_nivcsw` qui est le nombre de fois qu'un changement de contexte CPU a résulté du fait qu'un processus de priorité plus élevée est devenu exécutable ou parce que le processus courant a dépassé son temps d'exécution. Ce champ n'est pas supporté sur Windows.

::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::


## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**Ajoutée dans : v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/fr/nodejs/api/net#class-netserver) | [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) utilisée pour paramétrer l’envoi de certains types de handles. `options` prend en charge les propriétés suivantes :
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Une valeur qui peut être utilisée lors du passage d’instances de `net.Socket`. Lorsque la valeur est `true`, le socket est maintenu ouvert dans le processus d’envoi. **Par défaut :** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si Node.js est généré avec un canal IPC, la méthode `process.send()` peut être utilisée pour envoyer des messages au processus parent. Les messages seront reçus en tant qu’événement [`'message'`](/fr/nodejs/api/child_process#event-message) sur l’objet [`ChildProcess`](/fr/nodejs/api/child_process#class-childprocess) du parent.

Si Node.js n’a pas été généré avec un canal IPC, `process.send` sera `undefined`.

Le message passe par la sérialisation et l’analyse. Le message résultant peut ne pas être le même que celui qui est envoyé à l’origine.

## `process.setegid(id)` {#processsetegidid}

**Ajoutée dans : v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nom de groupe ou un ID

La méthode `process.setegid()` définit l’identité de groupe effective du processus. (Voir [`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2).) L’`id` peut être transmis soit en tant qu’ID numérique, soit en tant que chaîne de nom de groupe. Si un nom de groupe est spécifié, cette méthode se bloque lors de la résolution de l’ID numérique associé.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Cette fonction est uniquement disponible sur les plateformes POSIX (c’est-à-dire pas Windows ou Android). Cette fonctionnalité n’est pas disponible dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).


## `process.seteuid(id)` {#processseteuidid}

**Ajoutée dans : v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nom d’utilisateur ou un ID

La méthode `process.seteuid()` définit l’identité d’utilisateur effective du processus. (Voir [`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2).) L’`id` peut être transmis soit sous forme d’un ID numérique, soit sous forme d’une chaîne de nom d’utilisateur. Si un nom d’utilisateur est spécifié, la méthode se bloque lors de la résolution de l’ID numérique associé.



::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`UID actuel : ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`Nouvel UID : ${process.geteuid()}`);
  } catch (err) {
    console.error(`Échec de la définition de l’UID : ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`UID actuel : ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`Nouvel UID : ${process.geteuid()}`);
  } catch (err) {
    console.error(`Échec de la définition de l’UID : ${err}`);
  }
}
```
:::

Cette fonction est uniquement disponible sur les plateformes POSIX (c’est-à-dire pas Windows ou Android). Cette fonctionnalité n’est pas disponible dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).

## `process.setgid(id)` {#processsetgidid}

**Ajoutée dans : v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nom ou l’ID du groupe

La méthode `process.setgid()` définit l’identité de groupe du processus. (Voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).) L’`id` peut être transmis soit sous forme d’un ID numérique, soit sous forme d’une chaîne de nom de groupe. Si un nom de groupe est spécifié, cette méthode se bloque lors de la résolution de l’ID numérique associé.



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`GID actuel : ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`Nouveau GID : ${process.getgid()}`);
  } catch (err) {
    console.error(`Échec de la définition du GID : ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`GID actuel : ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`Nouveau GID : ${process.getgid()}`);
  } catch (err) {
    console.error(`Échec de la définition du GID : ${err}`);
  }
}
```
:::

Cette fonction est uniquement disponible sur les plateformes POSIX (c’est-à-dire pas Windows ou Android). Cette fonctionnalité n’est pas disponible dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Ajouté dans : v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La méthode `process.setgroups()` définit les ID de groupe supplémentaires pour le processus Node.js. Il s’agit d’une opération privilégiée qui nécessite que le processus Node.js ait la capacité `root` ou `CAP_SETGID`.

Le tableau `groups` peut contenir des ID de groupe numériques, des noms de groupe ou les deux.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

Cette fonction est uniquement disponible sur les plateformes POSIX (c’est-à-dire pas Windows ni Android). Cette fonctionnalité n’est pas disponible dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).

## `process.setuid(id)` {#processsetuidid}

**Ajouté dans : v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `process.setuid(id)` définit l’identité de l’utilisateur du processus. (Voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).) L’`id` peut être transmis sous forme d’ID numérique ou de chaîne de nom d’utilisateur. Si un nom d’utilisateur est spécifié, la méthode se bloque lors de la résolution de l’ID numérique associé.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Cette fonction est uniquement disponible sur les plateformes POSIX (c’est-à-dire pas Windows ni Android). Cette fonctionnalité n’est pas disponible dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**Ajouté dans : v16.6.0, v14.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette fonction active ou désactive la prise en charge de [Source Map v3](https://sourcemaps.info/spec) pour les traces de pile.

Elle fournit les mêmes fonctionnalités que le lancement du processus Node.js avec les options de ligne de commande `--enable-source-maps`.

Seuls les source maps dans les fichiers JavaScript qui sont chargés après l'activation des source maps seront analysés et chargés.

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**Ajouté dans : v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

La fonction `process.setUncaughtExceptionCaptureCallback()` définit une fonction qui sera appelée lorsqu'une exception non interceptée se produit, qui recevra la valeur de l'exception elle-même comme premier argument.

Si une telle fonction est définie, l'événement [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception) ne sera pas émis. Si `--abort-on-uncaught-exception` a été passé depuis la ligne de commande ou défini via [`v8.setFlagsFromString()`](/fr/nodejs/api/v8#v8setflagsfromstringflags), le processus ne s'arrêtera pas. Les actions configurées pour avoir lieu sur les exceptions, telles que la génération de rapports, seront également affectées.

Pour annuler la fonction de capture, `process.setUncaughtExceptionCaptureCallback(null)` peut être utilisé. L'appel de cette méthode avec un argument non-`null` pendant qu'une autre fonction de capture est définie lèvera une erreur.

L'utilisation de cette fonction est mutuellement exclusive avec l'utilisation du module intégré [`domain`](/fr/nodejs/api/domain) déprécié.

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**Ajouté dans : v20.7.0, v18.19.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `process.sourceMapsEnabled` renvoie si la prise en charge de [Source Map v3](https://sourcemaps.info/spec) pour les traces de pile est activée.


## `process.stderr` {#processstderr}

- [\<Stream\>](/fr/nodejs/api/stream#stream)

La propriété `process.stderr` renvoie un flux connecté à `stderr` (fd `2`). C'est un [`net.Socket`](/fr/nodejs/api/net#class-netsocket) (qui est un flux [Duplex](/fr/nodejs/api/stream#duplex-and-transform-streams)) sauf si fd `2` fait référence à un fichier, auquel cas c'est un flux [Writable](/fr/nodejs/api/stream#writable-streams).

`process.stderr` diffère des autres flux Node.js de manières importantes. Voir [note sur les E/S de processus](/fr/nodejs/api/process#a-note-on-process-io) pour plus d'informations.

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cette propriété fait référence à la valeur du descripteur de fichier sous-jacent de `process.stderr`. La valeur est fixée à `2`. Dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker), ce champ n'existe pas.

## `process.stdin` {#processstdin}

- [\<Stream\>](/fr/nodejs/api/stream#stream)

La propriété `process.stdin` renvoie un flux connecté à `stdin` (fd `0`). C'est un [`net.Socket`](/fr/nodejs/api/net#class-netsocket) (qui est un flux [Duplex](/fr/nodejs/api/stream#duplex-and-transform-streams)) sauf si fd `0` fait référence à un fichier, auquel cas c'est un flux [Readable](/fr/nodejs/api/stream#readable-streams).

Pour plus de détails sur la façon de lire à partir de `stdin`, voir [`readable.read()`](/fr/nodejs/api/stream#readablereadsize).

En tant que flux [Duplex](/fr/nodejs/api/stream#duplex-and-transform-streams), `process.stdin` peut également être utilisé en mode "ancien" qui est compatible avec les scripts écrits pour Node.js avant la v0.10. Pour plus d'informations, consultez [Compatibilité des flux](/fr/nodejs/api/stream#compatibility-with-older-nodejs-versions).

En mode flux "ancien", le flux `stdin` est suspendu par défaut, il faut donc appeler `process.stdin.resume()` pour le lire. Notez également que l'appel de `process.stdin.resume()` lui-même ferait passer le flux en mode "ancien".

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cette propriété fait référence à la valeur du descripteur de fichier sous-jacent de `process.stdin`. La valeur est fixée à `0`. Dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker), ce champ n'existe pas.


## `process.stdout` {#processstdout}

- [\<Stream\>](/fr/nodejs/api/stream#stream)

La propriété `process.stdout` renvoie un flux connecté à `stdout` (fd `1`). C'est un [`net.Socket`](/fr/nodejs/api/net#class-netsocket) (qui est un flux [Duplex](/fr/nodejs/api/stream#duplex-and-transform-streams)) à moins que fd `1` ne fasse référence à un fichier, auquel cas c'est un flux [Writable](/fr/nodejs/api/stream#writable-streams).

Par exemple, pour copier `process.stdin` vers `process.stdout` :

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

`process.stdout` diffère des autres flux Node.js de manières importantes. Voir [note sur l'E/S du processus](/fr/nodejs/api/process#a-note-on-process-io) pour plus d'informations.

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cette propriété fait référence à la valeur du descripteur de fichier sous-jacent de `process.stdout`. La valeur est fixée à `1`. Dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker), ce champ n'existe pas.

### Une note sur l'E/S du processus {#a-note-on-process-i/o}

`process.stdout` et `process.stderr` diffèrent des autres flux Node.js de manières importantes :

Ces comportements sont en partie pour des raisons historiques, car les modifier créerait une incompatibilité ascendante, mais ils sont également attendus par certains utilisateurs.

Les écritures synchrones évitent les problèmes tels que la sortie écrite avec `console.log()` ou `console.error()` étant inopinément entrelacée, ou pas écrite du tout si `process.exit()` est appelé avant qu'une écriture asynchrone ne soit terminée. Voir [`process.exit()`](/fr/nodejs/api/process#processexitcode) pour plus d'informations.

*<strong>Avertissement</strong>*: Les écritures synchrones bloquent la boucle d'événement jusqu'à ce que l'écriture soit terminée. Cela peut être quasi instantané dans le cas d'une sortie vers un fichier, mais sous une charge système élevée, les pipes qui ne sont pas lus à l'extrémité de réception, ou avec des terminaux ou des systèmes de fichiers lents, il est possible que la boucle d'événement soit bloquée assez souvent et assez longtemps pour avoir de graves impacts négatifs sur les performances. Cela peut ne pas être un problème lors de l'écriture dans une session de terminal interactive, mais soyez particulièrement prudent lors de la journalisation de la production vers les flux de sortie du processus.

Pour vérifier si un flux est connecté à un contexte [TTY](/fr/nodejs/api/tty#tty), vérifiez la propriété `isTTY`.

Par exemple :

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
Voir la documentation [TTY](/fr/nodejs/api/tty#tty) pour plus d'informations.


## `process.throwDeprecation` {#processthrowdeprecation}

**Ajouté dans: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La valeur initiale de `process.throwDeprecation` indique si l'indicateur `--throw-deprecation` est défini sur le processus Node.js actuel. `process.throwDeprecation` est mutable, donc le fait que les avertissements de dépréciation entraînent ou non des erreurs peut être modifié lors de l'exécution. Voir la documentation de l'événement [`'warning'` event](/fr/nodejs/api/process#event-warning) et de la méthode [`emitWarning()` method](/fr/nodejs/api/process#processemitwarningwarning-type-code-ctor) pour plus d'informations.

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**Ajouté dans: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `process.title` renvoie le titre du processus en cours (c'est-à-dire la valeur actuelle de `ps`). L'affectation d'une nouvelle valeur à `process.title` modifie la valeur actuelle de `ps`.

Lorsqu'une nouvelle valeur est affectée, différentes plateformes imposeront différentes restrictions de longueur maximale sur le titre. Habituellement, ces restrictions sont assez limitées. Par exemple, sous Linux et macOS, `process.title` est limité à la taille du nom du binaire plus la longueur des arguments de la ligne de commande, car la définition de `process.title` écrase la mémoire `argv` du processus. Node.js v0.8 autorisait des chaînes de titre de processus plus longues en écrasant également la mémoire `environ`, mais cela était potentiellement dangereux et déroutant dans certains cas (plutôt obscurs).

L'affectation d'une valeur à `process.title` peut ne pas entraîner une étiquette précise dans les applications de gestion de processus telles que macOS Activity Monitor ou Windows Services Manager.


## `process.traceDeprecation` {#processtracedeprecation}

**Ajouté dans : v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `process.traceDeprecation` indique si l’indicateur `--trace-deprecation` est défini sur le processus Node.js actuel. Voir la documentation de l’[`événement 'warning'`](/fr/nodejs/api/process#event-warning) et de la [`méthode emitWarning()`](/fr/nodejs/api/process#processemitwarningwarning-type-code-ctor) pour plus d’informations sur le comportement de cet indicateur.

## `process.umask()` {#processumask}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0, v12.19.0 | L’appel à `process.umask()` sans arguments est obsolète. |
| v0.1.19 | Ajouté dans : v0.1.19 |
:::

::: danger [Stable : 0 - Obsolète]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Obsolète. L’appel de `process.umask()` sans argument entraîne l’écriture deux fois de l’umask à l’échelle du processus. Cela introduit une condition de concurrence entre les threads, et constitue une vulnérabilité potentielle de sécurité. Il n’existe pas d’API alternative sûre et multiplateforme.
:::

`process.umask()` renvoie le masque de création de mode de fichier du processus Node.js. Les processus enfants héritent du masque du processus parent.

## `process.umask(mask)` {#processumaskmask}

**Ajouté dans : v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` définit le masque de création de mode de fichier du processus Node.js. Les processus enfants héritent du masque du processus parent. Renvoie le masque précédent.

::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

Dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker), `process.umask(mask)` lèvera une exception.


## `process.uptime()` {#processuptime}

**Ajouté dans : v0.5.0**

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La méthode `process.uptime()` renvoie le nombre de secondes pendant lesquelles le processus Node.js actuel a été en cours d'exécution.

La valeur de retour inclut les fractions de seconde. Utilisez `Math.floor()` pour obtenir des secondes entières.

## `process.version` {#processversion}

**Ajouté dans : v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `process.version` contient la chaîne de version de Node.js.



::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

Pour obtenir la chaîne de version sans le *v* ajouté, utilisez `process.versions.node`.

## `process.versions` {#processversions}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | La propriété `v8` inclut désormais un suffixe spécifique à Node.js. |
| v4.2.0 | La propriété `icu` est désormais prise en charge. |
| v0.2.0 | Ajouté dans : v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propriété `process.versions` renvoie un objet listant les chaînes de version de Node.js et de ses dépendances. `process.versions.modules` indique la version actuelle de l'ABI, qui est incrémentée à chaque modification d'une API C++. Node.js refusera de charger des modules qui ont été compilés par rapport à une version d'ABI de module différente.



::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

Générera un objet similaire à :

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```

## Codes de sortie {#exit-codes}

Node.js se terminera normalement avec un code de statut `0` lorsqu'il n'y a plus d'opérations asynchrones en attente. Les codes de statut suivants sont utilisés dans d'autres cas :

- `1` **Exception fatale non interceptée** : Il y a eu une exception non interceptée, et elle n'a pas été gérée par un domaine ou un gestionnaire d'événements [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception).
- `2` : Non utilisé (réservé par Bash pour une mauvaise utilisation intégrée)
- `3` **Erreur d'analyse interne JavaScript** : Le code source JavaScript interne au processus d'amorçage de Node.js a provoqué une erreur d'analyse. Ceci est extrêmement rare, et ne peut généralement se produire que pendant le développement de Node.js lui-même.
- `4` **Échec d'évaluation interne JavaScript** : Le code source JavaScript interne au processus d'amorçage de Node.js n'a pas réussi à renvoyer une valeur de fonction lors de l'évaluation. Ceci est extrêmement rare, et ne peut généralement se produire que pendant le développement de Node.js lui-même.
- `5` **Erreur fatale** : Il y a eu une erreur fatale irrécupérable dans V8. Généralement, un message sera imprimé sur stderr avec le préfixe `FATAL ERROR`.
- `6` **Gestionnaire d'exceptions interne non-fonctionnel** : Il y a eu une exception non interceptée, mais la fonction de gestion des exceptions fatales interne a été définie sur une non-fonction, et n'a pas pu être appelée.
- `7` **Échec d'exécution du gestionnaire d'exceptions interne** : Il y a eu une exception non interceptée, et la fonction de gestion des exceptions fatales interne elle-même a levé une erreur en essayant de la gérer. Cela peut se produire, par exemple, si un gestionnaire [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception) ou `domain.on('error')` lève une erreur.
- `8` : Non utilisé. Dans les versions précédentes de Node.js, le code de sortie 8 indiquait parfois une exception non interceptée.
- `9` **Argument invalide** : Soit une option inconnue a été spécifiée, soit une option nécessitant une valeur a été fournie sans valeur.
- `10` **Échec d'exécution interne JavaScript** : Le code source JavaScript interne au processus d'amorçage de Node.js a levé une erreur lorsque la fonction d'amorçage a été appelée. Ceci est extrêmement rare, et ne peut généralement se produire que pendant le développement de Node.js lui-même.
- `12` **Argument de débogage invalide** : Les options `--inspect` et/ou `--inspect-brk` ont été définies, mais le numéro de port choisi était invalide ou indisponible.
- `13` **Await de niveau supérieur non réglé** : `await` a été utilisé en dehors d'une fonction dans le code de niveau supérieur, mais la `Promise` passée n'a jamais été réglée.
- `14` **Échec de l'instantané** : Node.js a été démarré pour créer un instantané de démarrage V8 et il a échoué car certaines exigences de l'état de l'application n'étaient pas remplies.
- `\>128` **Sorties de signal** : Si Node.js reçoit un signal fatal tel que `SIGKILL` ou `SIGHUP`, son code de sortie sera `128` plus la valeur du code de signal. Il s'agit d'une pratique POSIX standard, car les codes de sortie sont définis comme des entiers de 7 bits, et les sorties de signal définissent le bit de poids fort, puis contiennent la valeur du code de signal. Par exemple, le signal `SIGABRT` a la valeur `6`, donc le code de sortie attendu sera `128` + `6`, ou `134`.

