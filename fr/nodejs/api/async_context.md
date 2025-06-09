---
title: Documentation Node.js - Suivi du contexte asynchrone
description: Découvrez comment suivre les opérations asynchrones dans Node.js avec le module async_hooks, qui permet d'enregistrer des rappels pour divers événements asynchrones.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Suivi du contexte asynchrone | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment suivre les opérations asynchrones dans Node.js avec le module async_hooks, qui permet d'enregistrer des rappels pour divers événements asynchrones.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Suivi du contexte asynchrone | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment suivre les opérations asynchrones dans Node.js avec le module async_hooks, qui permet d'enregistrer des rappels pour divers événements asynchrones.
---


# Suivi de contexte asynchrone {#asynchronous-context-tracking}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## Introduction {#introduction}

Ces classes sont utilisées pour associer un état et le propager à travers les rappels et les chaînes de promesses. Elles permettent de stocker des données pendant toute la durée d'une requête web ou de toute autre durée asynchrone. C'est similaire au stockage local de thread dans d'autres langages.

Les classes `AsyncLocalStorage` et `AsyncResource` font partie du module `node:async_hooks` :

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## Classe : `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.4.0 | AsyncLocalStorage est maintenant Stable. Auparavant, il était expérimental. |
| v13.10.0, v12.17.0 | Ajouté dans : v13.10.0, v12.17.0 |
:::

Cette classe crée des magasins qui restent cohérents à travers les opérations asynchrones.

Bien que vous puissiez créer votre propre implémentation au-dessus du module `node:async_hooks`, `AsyncLocalStorage` doit être préféré car il s'agit d'une implémentation performante et sûre en mémoire qui implique des optimisations significatives qui ne sont pas évidentes à implémenter.

L'exemple suivant utilise `AsyncLocalStorage` pour créer un simple enregistreur qui attribue des ID aux requêtes HTTP entrantes et les inclut dans les messages enregistrés dans chaque requête.

::: code-group
```js [ESM]
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```

```js [CJS]
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
:::

Chaque instance de `AsyncLocalStorage` maintient un contexte de stockage indépendant. Plusieurs instances peuvent exister simultanément en toute sécurité sans risque d'interférer avec les données des autres.


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.7.0, v18.16.0 | Option onPropagate expérimentale supprimée. |
| v19.2.0, v18.13.0 | Ajout de l'option onPropagate. |
| v13.10.0, v12.17.0 | Ajouté dans : v13.10.0, v12.17.0 |
:::

Crée une nouvelle instance de `AsyncLocalStorage`. Le stockage est uniquement fourni dans un appel `run()` ou après un appel `enterWith()`.

### Méthode statique : `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**Ajouté dans : v19.8.0, v18.16.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à lier au contexte d’exécution actuel.
- Retourne : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une nouvelle fonction qui appelle `fn` dans le contexte d’exécution capturé.

Lie la fonction donnée au contexte d’exécution actuel.

### Méthode statique : `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**Ajouté dans : v19.8.0, v18.16.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- Retourne : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une nouvelle fonction avec la signature `(fn: (...args) : R, ...args) : R`.

Capture le contexte d’exécution actuel et renvoie une fonction qui accepte une fonction comme argument. Chaque fois que la fonction renvoyée est appelée, elle appelle la fonction qui lui est transmise dans le contexte capturé.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // retourne 123
```
AsyncLocalStorage.snapshot() peut remplacer l’utilisation d’AsyncResource pour des besoins simples de suivi du contexte asynchrone, par exemple :

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // retourne 123
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**Ajouté dans : v13.10.0, v12.17.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Désactive l'instance de `AsyncLocalStorage`. Tous les appels ultérieurs à `asyncLocalStorage.getStore()` renverront `undefined` jusqu'à ce que `asyncLocalStorage.run()` ou `asyncLocalStorage.enterWith()` soit appelé à nouveau.

Lors de l'appel de `asyncLocalStorage.disable()`, tous les contextes actuels liés à l'instance seront quittés.

L'appel de `asyncLocalStorage.disable()` est requis avant que `asyncLocalStorage` puisse être collecté par le garbage collector. Ceci ne s'applique pas aux magasins fournis par `asyncLocalStorage`, car ces objets sont collectés par le garbage collector en même temps que les ressources asynchrones correspondantes.

Utilisez cette méthode lorsque `asyncLocalStorage` n'est plus utilisé dans le processus actuel.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**Ajouté dans : v13.10.0, v12.17.0**

- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Retourne le magasin actuel. S'il est appelé en dehors d'un contexte asynchrone initialisé en appelant `asyncLocalStorage.run()` ou `asyncLocalStorage.enterWith()`, il renvoie `undefined`.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**Ajouté dans : v13.11.0, v12.17.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Effectue une transition vers le contexte pour le reste de l'exécution synchrone actuelle, puis conserve le magasin lors de tout appel asynchrone suivant.

Exemple :

```js [ESM]
const store = { id: 1 };
// Remplace le magasin précédent par l'objet magasin donné
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Renvoie l'objet magasin
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Renvoie le même objet
});
```
Cette transition se poursuivra pendant *toute* l'exécution synchrone. Cela signifie que si, par exemple, le contexte est entré dans un gestionnaire d'événements, les gestionnaires d'événements suivants s'exécuteront également dans ce contexte, à moins d'être spécifiquement liés à un autre contexte avec une `AsyncResource`. C'est pourquoi `run()` doit être préféré à `enterWith()` à moins qu'il n'y ait de fortes raisons d'utiliser cette dernière méthode.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Renvoie le même objet
});

asyncLocalStorage.getStore(); // Renvoie undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Renvoie le même objet
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**Ajouté dans: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Exécute une fonction de manière synchrone dans un contexte et renvoie sa valeur de retour. Le store n'est pas accessible en dehors de la fonction de rappel. Le store est accessible à toutes les opérations asynchrones créées dans la fonction de rappel.

Les `args` optionnels sont passés à la fonction de rappel.

Si la fonction de rappel lève une erreur, l'erreur est également levée par `run()`. La stacktrace n'est pas affectée par cet appel et le contexte est quitté.

Exemple :

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Renvoie l'objet store
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Renvoie l'objet store
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Renvoie undefined
  // L'erreur sera interceptée ici
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**Ajouté dans: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Exécute une fonction de manière synchrone en dehors d'un contexte et renvoie sa valeur de retour. Le store n'est pas accessible dans la fonction de rappel ou les opérations asynchrones créées dans la fonction de rappel. Tout appel `getStore()` effectué dans la fonction de rappel renverra toujours `undefined`.

Les `args` optionnels sont passés à la fonction de rappel.

Si la fonction de rappel lève une erreur, l'erreur est également levée par `exit()`. La stacktrace n'est pas affectée par cet appel et le contexte est ré-entré.

Exemple :

```js [ESM]
// Dans un appel à run
try {
  asyncLocalStorage.getStore(); // Renvoie l'objet ou la valeur du store
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Renvoie undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Renvoie le même objet ou la même valeur
  // L'erreur sera interceptée ici
}
```

### Utilisation avec `async/await` {#usage-with-async/await}

Si, au sein d'une fonction asynchrone, un seul appel `await` doit s'exécuter dans un contexte, le modèle suivant doit être utilisé :

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // La valeur de retour de foo sera attendue
  });
}
```
Dans cet exemple, le magasin n'est disponible que dans la fonction de rappel et les fonctions appelées par `foo`. En dehors de `run`, appeler `getStore` retournera `undefined`.

### Dépannage : Perte de contexte {#troubleshooting-context-loss}

Dans la plupart des cas, `AsyncLocalStorage` fonctionne sans problème. Dans de rares situations, le magasin actuel est perdu dans l'une des opérations asynchrones.

Si votre code est basé sur des rappels, il suffit de le promesse avec [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal) pour qu'il commence à fonctionner avec les promesses natives.

Si vous devez utiliser une API basée sur des rappels ou si votre code suppose une implémentation thenable personnalisée, utilisez la classe [`AsyncResource`](/fr/nodejs/api/async_context#class-asyncresource) pour associer l'opération asynchrone au contexte d'exécution correct. Trouvez l'appel de fonction responsable de la perte de contexte en consignant le contenu de `asyncLocalStorage.getStore()` après les appels que vous soupçonnez être responsables de la perte. Lorsque le code enregistre `undefined`, le dernier rappel appelé est probablement responsable de la perte de contexte.

## Classe : `AsyncResource` {#class-asyncresource}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.4.0 | AsyncResource est désormais stable. Auparavant, il était expérimental. |
:::

La classe `AsyncResource` est conçue pour être étendue par les ressources asynchrones de l'intégrateur. Grâce à cela, les utilisateurs peuvent facilement déclencher les événements de durée de vie de leurs propres ressources.

Le hook `init` se déclenchera lorsqu'un `AsyncResource` est instancié.

Voici un aperçu de l'API `AsyncResource`.

::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() est conçu pour être étendu. Instancier un
// nouveau AsyncResource() déclenche également init. Si triggerAsyncId est omis, alors
// async_hook.executionAsyncId() est utilisé.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Exécute une fonction dans le contexte d'exécution de la ressource. Cela va
// * établir le contexte de la ressource
// * déclencher les rappels AsyncHooks before
// * appeler la fonction fournie `fn` avec les arguments fournis
// * déclencher les rappels AsyncHooks after
// * restaurer le contexte d'exécution d'origine
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Appelle les rappels AsyncHooks destroy.
asyncResource.emitDestroy();

// Renvoie l'ID unique attribué à l'instance AsyncResource.
asyncResource.asyncId();

// Renvoie l'ID de déclenchement pour l'instance AsyncResource.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() est conçu pour être étendu. Instancier un
// nouveau AsyncResource() déclenche également init. Si triggerAsyncId est omis, alors
// async_hook.executionAsyncId() est utilisé.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Exécute une fonction dans le contexte d'exécution de la ressource. Cela va
// * établir le contexte de la ressource
// * déclencher les rappels AsyncHooks before
// * appeler la fonction fournie `fn` avec les arguments fournis
// * déclencher les rappels AsyncHooks after
// * restaurer le contexte d'exécution d'origine
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Appelle les rappels AsyncHooks destroy.
asyncResource.emitDestroy();

// Renvoie l'ID unique attribué à l'instance AsyncResource.
asyncResource.asyncId();

// Renvoie l'ID de déclenchement pour l'instance AsyncResource.
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type d'événement asynchrone.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID du contexte d'exécution qui a créé cet événement asynchrone. **Par défaut :** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si défini sur `true`, désactive `emitDestroy` lorsque l'objet est récupéré par le ramasse-miettes. Il n'est généralement pas nécessaire de le définir (même si `emitDestroy` est appelé manuellement), sauf si l'`asyncId` de la ressource est récupéré et que l'`emitDestroy` de l'API sensible est appelé avec lui. Lorsque la valeur est `false`, l'appel `emitDestroy` lors de la récupération de mémoire n'aura lieu que s'il existe au moins un hook `destroy` actif. **Par défaut :** `false`.
  
 

Exemple d'utilisation :

```js [ESM]
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```
### Méthode statique : `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | La propriété `asyncResource` ajoutée à la fonction liée a été dépréciée et sera supprimée dans une version future. |
| v17.8.0, v16.15.0 | Modification de la valeur par défaut lorsque `thisArg` n'est pas défini pour utiliser `this` de l'appelant. |
| v16.0.0 | Ajout de thisArg facultatif. |
| v14.8.0, v12.19.0 | Ajouté dans : v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à lier au contexte d'exécution actuel.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nom facultatif à associer à l'`AsyncResource` sous-jacente.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lie la fonction donnée au contexte d'exécution actuel.


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | La propriété `asyncResource` ajoutée à la fonction liée a été dépréciée et sera supprimée dans une future version. |
| v17.8.0, v16.15.0 | Changement de la valeur par défaut lorsque `thisArg` est indéfini pour utiliser `this` de l'appelant. |
| v16.0.0 | Ajout de thisArg optionnel. |
| v14.8.0, v12.19.0 | Ajouté dans : v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à lier à la `AsyncResource` actuelle.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lie la fonction donnée pour qu'elle s'exécute dans le scope de cette `AsyncResource`.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**Ajouté dans : v9.6.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à appeler dans le contexte d'exécution de cette ressource asynchrone.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Le récepteur à utiliser pour l'appel de la fonction.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Arguments optionnels à passer à la fonction.

Appelle la fonction fournie avec les arguments fournis dans le contexte d'exécution de la ressource asynchrone. Cela établira le contexte, déclenchera les callbacks AsyncHooks before, appellera la fonction, déclenchera les callbacks AsyncHooks after, puis restaurera le contexte d'exécution original.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- Retourne : [\<AsyncResource\>](/fr/nodejs/api/async_hooks#class-asyncresource) Une référence à `asyncResource`.

Appelle tous les hooks `destroy`. Ceci ne doit être appelé qu'une seule fois. Une erreur sera levée s'il est appelé plus d'une fois. Ceci **doit** être appelé manuellement. Si la ressource est laissée à être collectée par le GC, les hooks `destroy` ne seront jamais appelés.


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L’`asyncId` unique attribué à la ressource.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le même `triggerAsyncId` qui est passé au constructeur `AsyncResource`.

### Utilisation de `AsyncResource` pour un pool de threads `Worker` {#using-asyncresource-for-a-worker-thread-pool}

L’exemple suivant montre comment utiliser la classe `AsyncResource` pour fournir correctement le suivi asynchrone pour un pool [`Worker`](/fr/nodejs/api/worker_threads#class-worker). D’autres pools de ressources, tels que les pools de connexions de bases de données, peuvent suivre un modèle similaire.

En supposant que la tâche consiste à additionner deux nombres, en utilisant un fichier nommé `task_processor.js` avec le contenu suivant :

::: code-group
```js [ESM]
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```js [CJS]
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```
:::

Un pool Worker autour de celui-ci pourrait utiliser la structure suivante :

::: code-group
```js [ESM]
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```js [CJS]
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```
:::

Sans le suivi explicite ajouté par les objets `WorkerPoolTaskInfo`, il semblerait que les rappels soient associés aux objets `Worker` individuels. Cependant, la création des `Worker` n’est pas associée à la création des tâches et ne fournit pas d’informations sur le moment où les tâches ont été planifiées.

Ce pool pourrait être utilisé comme suit :

::: code-group
```js [ESM]
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```js [CJS]
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```
:::


### Intégration d'`AsyncResource` avec `EventEmitter` {#integrating-asyncresource-with-eventemitter}

Les écouteurs d'événements déclenchés par un [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter) peuvent être exécutés dans un contexte d'exécution différent de celui qui était actif lorsque `eventEmitter.on()` a été appelé.

L'exemple suivant montre comment utiliser la classe `AsyncResource` pour associer correctement un écouteur d'événements au contexte d'exécution correct. La même approche peut être appliquée à un [`Stream`](/fr/nodejs/api/stream#stream) ou à une classe événementielle similaire.

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Le contexte d'exécution est lié à la portée externe actuelle.
  }));
  req.on('close', () => {
    // Le contexte d'exécution est lié à la portée qui a provoqué l'émission de 'close'.
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Le contexte d'exécution est lié à la portée externe actuelle.
  }));
  req.on('close', () => {
    // Le contexte d'exécution est lié à la portée qui a provoqué l'émission de 'close'.
  });
  res.end();
}).listen(3000);
```
:::

