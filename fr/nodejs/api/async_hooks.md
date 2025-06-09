---
title: Documentation Node.js - Crochets Asynchrones
description: Découvrez l'API des crochets asynchrones dans Node.js, qui permet de suivre la durée de vie des ressources asynchrones dans les applications Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Crochets Asynchrones | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez l'API des crochets asynchrones dans Node.js, qui permet de suivre la durée de vie des ressources asynchrones dans les applications Node.js.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Crochets Asynchrones | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez l'API des crochets asynchrones dans Node.js, qui permet de suivre la durée de vie des ressources asynchrones dans les applications Node.js.
---


# Hooks asynchrones {#async-hooks}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental. Veuillez migrer hors de cette API, si possible. Nous ne recommandons pas d'utiliser les API [`createHook`](/fr/nodejs/api/async_hooks#async_hookscreatehookcallbacks), [`AsyncHook`](/fr/nodejs/api/async_hooks#class-asynchook) et [`executionAsyncResource`](/fr/nodejs/api/async_hooks#async_hooksexecutionasyncresource) car elles présentent des problèmes d'utilisabilité, des risques de sécurité et des implications sur les performances. Les cas d'utilisation du suivi du contexte asynchrone sont mieux servis par l'API stable [`AsyncLocalStorage`](/fr/nodejs/api/async_context#class-asynclocalstorage). Si vous avez un cas d'utilisation pour `createHook`, `AsyncHook` ou `executionAsyncResource` au-delà du besoin de suivi de contexte résolu par [`AsyncLocalStorage`](/fr/nodejs/api/async_context#class-asynclocalstorage) ou des données de diagnostic actuellement fournies par [Diagnostics Channel](/fr/nodejs/api/diagnostics_channel), veuillez ouvrir un problème sur [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) décrivant votre cas d'utilisation afin que nous puissions créer une API plus ciblée.
:::

**Code source:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

Nous déconseillons fortement l'utilisation de l'API `async_hooks`. D'autres API qui peuvent couvrir la plupart de ses cas d'utilisation incluent :

- [`AsyncLocalStorage`](/fr/nodejs/api/async_context#class-asynclocalstorage) suit le contexte asynchrone.
- [`process.getActiveResourcesInfo()`](/fr/nodejs/api/process#processgetactiveresourcesinfo) suit les ressources actives.

Le module `node:async_hooks` fournit une API pour suivre les ressources asynchrones. Il est accessible à l'aide de :

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## Terminologie {#terminology}

Une ressource asynchrone représente un objet avec un callback associé. Ce callback peut être appelé plusieurs fois, comme l'événement `'connection'` dans `net.createServer()`, ou une seule fois comme dans `fs.open()`. Une ressource peut également être fermée avant que le callback ne soit appelé. `AsyncHook` ne fait pas explicitement la distinction entre ces différents cas, mais les représente comme le concept abstrait qu'est une ressource.

Si des [`Worker`](/fr/nodejs/api/worker_threads#class-worker)s sont utilisés, chaque thread possède une interface `async_hooks` indépendante, et chaque thread utilisera un nouvel ensemble d'ID asynchrones.


## Aperçu {#overview}

Voici un simple aperçu de l'API publique.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// Renvoie l'ID du contexte d'exécution actuel.
const eid = async_hooks.executionAsyncId();

// Renvoie l'ID du gestionnaire responsable du déclenchement du rappel de
// la portée d'exécution actuelle à appeler.
const tid = async_hooks.triggerAsyncId();

// Crée une nouvelle instance AsyncHook. Tous ces rappels sont optionnels.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Autorise les rappels de cette instance AsyncHook à appeler. Ce n'est pas une
// action implicite après l'exécution du constructeur, et doit être explicitement
// exécuté pour commencer à exécuter des rappels.
asyncHook.enable();

// Désactive l'écoute des nouveaux événements asynchrones.
asyncHook.disable();

//
// Les rappels suivants peuvent être passés à createHook().
//

// init() est appelé pendant la construction de l'objet. La ressource peut ne pas avoir
// terminé sa construction lorsque ce rappel s'exécute. Par conséquent, tous les champs de la
// ressource référencée par "asyncId" peuvent ne pas avoir été renseignés.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() est appelé juste avant l'appel du rappel de la ressource. Il peut être
// appelé 0-N fois pour les gestionnaires (tels que TCPWrap), et sera appelé exactement 1
// fois pour les requêtes (telles que FSReqCallback).
function before(asyncId) { }

// after() est appelé juste après la fin du rappel de la ressource.
function after(asyncId) { }

// destroy() est appelé lorsque la ressource est détruite.
function destroy(asyncId) { }

// promiseResolve() est appelé uniquement pour les ressources de promesse, lorsque la
// fonction resolve() passée au constructeur Promise est invoquée
// (directement ou par d'autres moyens de résolution d'une promesse).
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// Renvoie l'ID du contexte d'exécution actuel.
const eid = async_hooks.executionAsyncId();

// Renvoie l'ID du gestionnaire responsable du déclenchement du rappel de
// la portée d'exécution actuelle à appeler.
const tid = async_hooks.triggerAsyncId();

// Crée une nouvelle instance AsyncHook. Tous ces rappels sont optionnels.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Autorise les rappels de cette instance AsyncHook à appeler. Ce n'est pas une
// action implicite après l'exécution du constructeur, et doit être explicitement
// exécuté pour commencer à exécuter des rappels.
asyncHook.enable();

// Désactive l'écoute des nouveaux événements asynchrones.
asyncHook.disable();

//
// Les rappels suivants peuvent être passés à createHook().
//

// init() est appelé pendant la construction de l'objet. La ressource peut ne pas avoir
// terminé sa construction lorsque ce rappel s'exécute. Par conséquent, tous les champs de la
// ressource référencée par "asyncId" peuvent ne pas avoir été renseignés.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() est appelé juste avant l'appel du rappel de la ressource. Il peut être
// appelé 0-N fois pour les gestionnaires (tels que TCPWrap), et sera appelé exactement 1
// fois pour les requêtes (telles que FSReqCallback).
function before(asyncId) { }

// after() est appelé juste après la fin du rappel de la ressource.
function after(asyncId) { }

// destroy() est appelé lorsque la ressource est détruite.
function destroy(asyncId) { }

// promiseResolve() est appelé uniquement pour les ressources de promesse, lorsque la
// fonction resolve() passée au constructeur Promise est invoquée
// (directement ou par d'autres moyens de résolution d'une promesse).
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**Ajouté dans : v8.1.0**

- `callbacks` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Les [Rappels de Hook](/fr/nodejs/api/async_hooks#hook-callbacks) à enregistrer
    - `init` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le [`rappel init`](/fr/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
    - `before` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le [`rappel before`](/fr/nodejs/api/async_hooks#beforeasyncid).
    - `after` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le [`rappel after`](/fr/nodejs/api/async_hooks#afterasyncid).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le [`rappel destroy`](/fr/nodejs/api/async_hooks#destroyasyncid).
    - `promiseResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le [`rappel promiseResolve`](/fr/nodejs/api/async_hooks#promiseresolveasyncid).


- Retourne: [\<AsyncHook\>](/fr/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Instance utilisée pour désactiver et activer les hooks

Enregistre les fonctions à appeler pour différents événements de durée de vie de chaque opération asynchrone.

Les rappels `init()`/`before()`/`after()`/`destroy()` sont appelés pour l'événement asynchrone respectif pendant la durée de vie d'une ressource.

Tous les rappels sont facultatifs. Par exemple, si seule la suppression des ressources doit être suivie, seul le rappel `destroy` doit être passé. Les spécificités de toutes les fonctions qui peuvent être passées à `callbacks` se trouvent dans la section [Rappels de Hook](/fr/nodejs/api/async_hooks#hook-callbacks).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

Les rappels seront hérités via la chaîne de prototypes :

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
Étant donné que les promesses sont des ressources asynchrones dont le cycle de vie est suivi via le mécanisme des hooks asynchrones, les rappels `init()`, `before()`, `after()` et `destroy()` *ne doivent pas* être des fonctions asynchrones qui retournent des promesses.


### Gestion des erreurs {#error-handling}

Si des rappels `AsyncHook` lèvent une exception, l'application affichera la trace de pile et s'arrêtera. Le chemin de sortie suit celui d'une exception non interceptée, mais tous les écouteurs `'uncaughtException'` sont supprimés, forçant ainsi le processus à s'arrêter. Les rappels `'exit'` seront toujours appelés, sauf si l'application est exécutée avec `--abort-on-uncaught-exception`, auquel cas une trace de pile sera affichée et l'application s'arrêtera, laissant un fichier core.

La raison de ce comportement de gestion des erreurs est que ces rappels s'exécutent à des moments potentiellement instables dans le cycle de vie d'un objet, par exemple lors de la construction et de la destruction d'une classe. Pour cette raison, il est jugé nécessaire d'arrêter rapidement le processus afin d'éviter un abandon involontaire à l'avenir. Cela peut être modifié à l'avenir si une analyse approfondie est effectuée pour garantir qu'une exception peut suivre le flux de contrôle normal sans effets secondaires involontaires.

### Affichage dans les rappels `AsyncHook` {#printing-in-asynchook-callbacks}

Étant donné que l'affichage dans la console est une opération asynchrone, `console.log()` entraînera l'appel de rappels `AsyncHook`. L'utilisation de `console.log()` ou d'opérations asynchrones similaires à l'intérieur d'une fonction de rappel `AsyncHook` provoquera une récursion infinie. Une solution simple à cela lors du débogage consiste à utiliser une opération de journalisation synchrone telle que `fs.writeFileSync(file, msg, flag)`. Cela affichera dans le fichier et n'invoquera pas `AsyncHook` de manière récursive car elle est synchrone.

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Utilisez une fonction comme celle-ci lors du débogage à l'intérieur d'un rappel AsyncHook
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Utilisez une fonction comme celle-ci lors du débogage à l'intérieur d'un rappel AsyncHook
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

Si une opération asynchrone est nécessaire pour la journalisation, il est possible de suivre ce qui a causé l'opération asynchrone en utilisant les informations fournies par `AsyncHook` lui-même. La journalisation doit alors être ignorée si c'est la journalisation elle-même qui a entraîné l'appel du rappel `AsyncHook`. En faisant cela, la récursion infinie est rompue.


## Classe : `AsyncHook` {#class-asynchook}

La classe `AsyncHook` expose une interface pour suivre les événements du cycle de vie des opérations asynchrones.

### `asyncHook.enable()` {#asynchookenable}

- Retourne : [\<AsyncHook\>](/fr/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Une référence à `asyncHook`.

Active les rappels pour une instance `AsyncHook` donnée. Si aucun rappel n’est fourni, l’activation est une opération sans effet.

L’instance `AsyncHook` est désactivée par défaut. Si l’instance `AsyncHook` doit être activée immédiatement après sa création, le modèle suivant peut être utilisé.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- Retourne : [\<AsyncHook\>](/fr/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Une référence à `asyncHook`.

Désactive les rappels pour une instance `AsyncHook` donnée du pool global de rappels `AsyncHook` à exécuter. Une fois qu’un hook a été désactivé, il ne sera plus appelé tant qu’il n’aura pas été réactivé.

Par souci de cohérence de l’API, `disable()` renvoie également l’instance `AsyncHook`.

### Rappels de Hook {#hook-callbacks}

Les événements clés du cycle de vie des événements asynchrones ont été classés en quatre domaines : instantiation, avant/après l’appel du rappel et lors de la destruction de l’instance.

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un ID unique pour la ressource asynchrone.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type de la ressource asynchrone.
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L’ID unique de la ressource asynchrone dans le contexte d’exécution de laquelle cette ressource asynchrone a été créée.
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Référence à la ressource représentant l’opération asynchrone, doit être libérée pendant la *destruction*.

Appelé lorsqu’une classe est construite et qu’elle a la *possibilité* d’émettre un événement asynchrone. Cela *ne signifie pas* que l’instance doit appeler `before`/`after` avant que `destroy` ne soit appelé, mais seulement que la possibilité existe.

Ce comportement peut être observé en faisant quelque chose comme ouvrir une ressource puis la fermer avant qu’elle ne puisse être utilisée. L’extrait de code suivant le démontre.

::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

Chaque nouvelle ressource reçoit un ID qui est unique dans la portée de l’instance Node.js actuelle.


##### `type` {#type}

Le `type` est une chaîne de caractères identifiant le type de ressource qui a causé l'appel à `init`. Généralement, il correspondra au nom du constructeur de la ressource.

Le `type` des ressources créées par Node.js lui-même peut changer dans n'importe quelle version de Node.js. Les valeurs valides incluent `TLSWRAP`, `TCPWRAP`, `TCPSERVERWRAP`, `GETADDRINFOREQWRAP`, `FSREQCALLBACK`, `Microtask` et `Timeout`. Inspectez le code source de la version de Node.js utilisée pour obtenir la liste complète.

De plus, les utilisateurs de [`AsyncResource`](/fr/nodejs/api/async_context#class-asyncresource) créent des ressources asynchrones indépendantes de Node.js lui-même.

Il existe également le type de ressource `PROMISE`, qui est utilisé pour suivre les instances de `Promise` et le travail asynchrone planifié par celles-ci.

Les utilisateurs peuvent définir leur propre `type` lorsqu'ils utilisent l'API publique d'intégration.

Il est possible d'avoir des collisions de noms de type. Les intégrateurs sont encouragés à utiliser des préfixes uniques, tels que le nom du paquet npm, pour éviter les collisions lors de l'écoute des hooks.

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` est l'`asyncId` de la ressource qui a causé (ou "déclenché") l'initialisation de la nouvelle ressource et qui a causé l'appel à `init`. Ceci est différent de `async_hooks.executionAsyncId()` qui ne montre que *quand* une ressource a été créée, tandis que `triggerAsyncId` montre *pourquoi* une ressource a été créée.

Voici une simple démonstration de `triggerAsyncId` :

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net');
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

Sortie lors de l'accès au serveur avec `nc localhost 8080` :

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
Le `TCPSERVERWRAP` est le serveur qui reçoit les connexions.

Le `TCPWRAP` est la nouvelle connexion du client. Lorsqu'une nouvelle connexion est établie, l'instance `TCPWrap` est immédiatement construite. Cela se produit en dehors de toute pile JavaScript. (Un `executionAsyncId()` de `0` signifie qu'il est exécuté à partir de C++ sans aucune pile JavaScript au-dessus.) Avec seulement ces informations, il serait impossible de relier les ressources entre elles en termes de ce qui a causé leur création, donc `triggerAsyncId` est chargé de propager la ressource responsable de l'existence de la nouvelle ressource.


##### `resource` {#resource}

`resource` est un objet qui représente la ressource asynchrone réelle qui a été initialisée. L'API pour accéder à l'objet peut être spécifiée par le créateur de la ressource. Les ressources créées par Node.js lui-même sont internes et peuvent changer à tout moment. Par conséquent, aucune API n'est spécifiée pour celles-ci.

Dans certains cas, l'objet ressource est réutilisé pour des raisons de performance, il n'est donc pas sûr de l'utiliser comme clé dans un `WeakMap` ou d'y ajouter des propriétés.

##### Exemple de contexte asynchrone {#asynchronous-context-example}

Le cas d'utilisation du suivi de contexte est couvert par l'API stable [`AsyncLocalStorage`](/fr/nodejs/api/async_context#class-asynclocalstorage). Cet exemple illustre uniquement le fonctionnement des hooks asynchrones, mais [`AsyncLocalStorage`](/fr/nodejs/api/async_context#class-asynclocalstorage) est plus adapté à ce cas d'utilisation.

Voici un exemple avec des informations supplémentaires sur les appels à `init` entre les appels `before` et `after`, en particulier ce à quoi ressemblera le rappel de `listen()`. Le formatage de la sortie est légèrement plus élaboré pour faciliter la visualisation du contexte d'appel.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

Sortie en démarrant uniquement le serveur :

```bash [BASH]
TCPSERVERWRAP(5) : déclencheur : 1 exécution : 1
TickObject(6) : déclencheur : 5 exécution : 1
before : 6
  Timeout(7) : déclencheur : 6 exécution : 6
after : 6
destroy : 6
before : 7
>>> 7
  TickObject(8) : déclencheur : 7 exécution : 7
after : 7
before : 8
after : 8
```
Comme illustré dans l'exemple, `executionAsyncId()` et `execution` spécifient chacun la valeur du contexte d'exécution actuel ; qui est délimité par les appels à `before` et `after`.

L'utilisation de `execution` uniquement pour représenter graphiquement l'allocation des ressources donne les résultats suivants :

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
Le `TCPSERVERWRAP` ne fait pas partie de ce graphique, même si c'est la raison pour laquelle `console.log()` a été appelé. En effet, la liaison à un port sans nom d'hôte est une opération *synchrone*, mais pour maintenir une API entièrement asynchrone, le rappel de l'utilisateur est placé dans un `process.nextTick()`. C'est pourquoi `TickObject` est présent dans la sortie et est un « parent » pour le rappel `.listen()`.

Le graphique n'indique que *quand* une ressource a été créée, pas *pourquoi*, donc pour suivre le *pourquoi*, utilisez `triggerAsyncId`. Ce qui peut être représenté par le graphique suivant :

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lorsqu'une opération asynchrone est initiée (comme un serveur TCP recevant une nouvelle connexion) ou terminée (comme l'écriture de données sur le disque), un rappel est appelé pour notifier l'utilisateur. Le rappel `before` est appelé juste avant que ledit rappel ne soit exécuté. `asyncId` est l'identifiant unique attribué à la ressource sur le point d'exécuter le rappel.

Le rappel `before` sera appelé de 0 à N fois. Le rappel `before` sera généralement appelé 0 fois si l'opération asynchrone a été annulée ou, par exemple, si aucune connexion n'est reçue par un serveur TCP. Les ressources asynchrones persistantes comme un serveur TCP appelleront généralement le rappel `before` plusieurs fois, tandis que d'autres opérations comme `fs.open()` ne l'appelleront qu'une seule fois.

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Appelé immédiatement après la fin du rappel spécifié dans `before`.

Si une exception non interceptée se produit pendant l'exécution du rappel, alors `after` s'exécutera *après* l'émission de l'événement `'uncaughtException'` ou l'exécution du gestionnaire d'un `domain`.

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Appelé après que la ressource correspondant à `asyncId` est détruite. Il est également appelé de manière asynchrone à partir de l'API d'intégration `emitDestroy()`.

Certaines ressources dépendent du ramasse-miettes pour le nettoyage. Par conséquent, si une référence est faite à l'objet `resource` passé à `init`, il est possible que `destroy` ne soit jamais appelé, ce qui provoque une fuite de mémoire dans l'application. Si la ressource ne dépend pas du ramasse-miettes, cela ne posera pas de problème.

L'utilisation du hook destroy entraîne une surcharge supplémentaire car il permet le suivi des instances `Promise` via le ramasse-miettes.

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**Ajouté dans : v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Appelé lorsque la fonction `resolve` passée au constructeur `Promise` est invoquée (directement ou par d'autres moyens de résolution d'une promesse).

`resolve()` n'effectue aucun travail synchrone observable.

La `Promise` n'est pas nécessairement tenue ou rejetée à ce stade si la `Promise` a été résolue en assumant l'état d'une autre `Promise`.

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
appelle les rappels suivants :

```text [TEXT]
init pour PROMISE avec l'ID 5, ID de déclencheur : 1
  promise resolve 5      # correspond à resolve(true)
init pour PROMISE avec l'ID 6, ID de déclencheur : 5  # la Promise renvoyée par then()
  before 6               # le rappel then() est entré
  promise resolve 6      # le rappel then() résout la promesse en renvoyant
  after 6
```

### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**Ajouté dans la version : v13.9.0, v12.17.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) La ressource représentant l'exécution actuelle. Utile pour stocker des données dans la ressource.

Les objets de ressource retournés par `executionAsyncResource()` sont le plus souvent des objets de gestion interne de Node.js avec des API non documentées. L'utilisation de fonctions ou de propriétés sur l'objet est susceptible de planter votre application et doit être évitée.

L'utilisation de `executionAsyncResource()` dans le contexte d'exécution de niveau supérieur renverra un objet vide car il n'y a pas d'objet de gestion ou de requête à utiliser, mais le fait d'avoir un objet représentant le niveau supérieur peut être utile.

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

Cela peut être utilisé pour implémenter le stockage local de continuation sans utiliser de `Map` de suivi pour stocker les métadonnées :

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // Private symbol to avoid pollution

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // Private symbol to avoid pollution

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.2.0 | Renommé de `currentId`. |
| v8.1.0 | Ajouté dans : v8.1.0 |
:::

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'`asyncId` du contexte d'exécution actuel. Utile pour suivre quand quelque chose appelle.

::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

L'ID renvoyé par `executionAsyncId()` est lié au timing de l'exécution, pas à la causalité (qui est couverte par `triggerAsyncId()`):

```js [ESM]
const server = net.createServer((conn) => {
  // Retourne l'ID du serveur, pas de la nouvelle connexion, car le
  // callback s'exécute dans le scope d'exécution du MakeCallback() du serveur.
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // Retourne l'ID d'un TickObject (process.nextTick()) car tous les
  // callbacks passés à .listen() sont enveloppés dans un nextTick().
  async_hooks.executionAsyncId();
});
```
Les contextes Promise peuvent ne pas obtenir des `executionAsyncIds` précis par défaut. Voir la section sur le [suivi de l'exécution des promesses](/fr/nodejs/api/async_hooks#promise-execution-tracking).

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID de la ressource responsable de l'appel du callback en cours d'exécution.

```js [ESM]
const server = net.createServer((conn) => {
  // La ressource qui a causé (ou déclenché) l'appel de ce callback
  // était celle de la nouvelle connexion. Ainsi, la valeur de retour de triggerAsyncId()
  // est l'asyncId de "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Même si tous les callbacks passés à .listen() sont enveloppés dans un nextTick()
  // le callback lui-même existe car l'appel à .listen() du serveur
  // a été fait. Donc la valeur de retour serait l'ID du serveur.
  async_hooks.triggerAsyncId();
});
```
Les contextes Promise peuvent ne pas obtenir des `triggerAsyncId` valides par défaut. Voir la section sur le [suivi de l'exécution des promesses](/fr/nodejs/api/async_hooks#promise-execution-tracking).


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**Ajouté dans : v17.2.0, v16.14.0**

- Retourne : Une map des types de fournisseurs vers l'identifiant numérique correspondant. Cette map contient tous les types d'événements qui pourraient être émis par l'événement `async_hooks.init()`.

Cette fonctionnalité supprime l'utilisation dépréciée de `process.binding('async_wrap').Providers`. Voir : [DEP0111](/fr/nodejs/api/deprecations#dep0111-processbinding)

## Suivi de l'exécution des Promises {#promise-execution-tracking}

Par défaut, les exécutions de promises ne sont pas assignées à des `asyncId` en raison de la nature relativement coûteuse de l'[API d'introspection des promises](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) fournie par V8. Cela signifie que les programmes utilisant des promises ou `async`/`await` n'obtiendront pas les identifiants d'exécution et de déclenchement corrects pour les contextes de rappel de promise par défaut.

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produit :
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produit :
// eid 1 tid 0
```
:::

Notez que le rappel `then()` prétend s'être exécuté dans le contexte de la portée extérieure, même s'il y a eu un saut asynchrone. De plus, la valeur de `triggerAsyncId` est `0`, ce qui signifie qu'il nous manque le contexte de la ressource qui a causé (déclenché) l'exécution du rappel `then()`.

L'installation de hooks asynchrones via `async_hooks.createHook` active le suivi de l'exécution des promises :

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // force l'activation de PromiseHooks.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produit :
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // force l'activation de PromiseHooks.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produit :
// eid 7 tid 6
```
:::

Dans cet exemple, l'ajout d'une fonction de hook réelle a activé le suivi des promises. Il y a deux promises dans l'exemple ci-dessus ; la promise créée par `Promise.resolve()` et la promise retournée par l'appel à `then()`. Dans l'exemple ci-dessus, la première promise a reçu l'`asyncId` `6` et la seconde a reçu l'`asyncId` `7`. Lors de l'exécution du rappel `then()`, nous nous exécutons dans le contexte de la promise avec l'`asyncId` `7`. Cette promise a été déclenchée par la ressource asynchrone `6`.

Une autre subtilité avec les promises est que les rappels `before` et `after` ne sont exécutés que sur les promises chaînées. Cela signifie que les promises non créées par `then()`/`catch()` n'auront pas les rappels `before` et `after` déclenchés sur elles. Pour plus de détails, consultez les détails de l'API V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit).


## API JavaScript pour intégrer {#javascript-embedder-api}

Les développeurs de bibliothèques qui gèrent leurs propres ressources asynchrones effectuant des tâches comme l'E/S, le pool de connexions ou la gestion des files d'attente de rappels peuvent utiliser l'API JavaScript `AsyncResource` afin que tous les rappels appropriés soient appelés.

### Classe : `AsyncResource` {#class-asyncresource}

La documentation de cette classe a été déplacée [`AsyncResource`](/fr/nodejs/api/async_context#class-asyncresource).

## Classe : `AsyncLocalStorage` {#class-asynclocalstorage}

La documentation de cette classe a été déplacée [`AsyncLocalStorage`](/fr/nodejs/api/async_context#class-asynclocalstorage).

