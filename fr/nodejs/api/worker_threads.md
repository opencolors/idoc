---
title: Threads de travail Node.js
description: Documentation sur l'utilisation des threads de travail dans Node.js pour tirer parti du multithreading pour les tâches intensives en CPU, avec un aperçu de la classe Worker, la communication entre threads et des exemples d'utilisation.
head:
  - - meta
    - name: og:title
      content: Threads de travail Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentation sur l'utilisation des threads de travail dans Node.js pour tirer parti du multithreading pour les tâches intensives en CPU, avec un aperçu de la classe Worker, la communication entre threads et des exemples d'utilisation.
  - - meta
    - name: twitter:title
      content: Threads de travail Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentation sur l'utilisation des threads de travail dans Node.js pour tirer parti du multithreading pour les tâches intensives en CPU, avec un aperçu de la classe Worker, la communication entre threads et des exemples d'utilisation.
---


# Threads de travail (Worker threads) {#worker-threads}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

Le module `node:worker_threads` permet d'utiliser des threads qui exécutent JavaScript en parallèle. Pour y accéder :

```js [ESM]
const worker = require('node:worker_threads');
```

Les Workers (threads) sont utiles pour effectuer des opérations JavaScript gourmandes en CPU. Ils ne sont pas très utiles pour les tâches gourmandes en E/S. Les opérations d'E/S asynchrones intégrées de Node.js sont plus efficaces que les Workers.

Contrairement à `child_process` ou `cluster`, `worker_threads` peuvent partager de la mémoire. Ils le font en transférant des instances `ArrayBuffer` ou en partageant des instances `SharedArrayBuffer`.

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```

L'exemple ci-dessus génère un thread Worker pour chaque appel `parseJSAsync()`. En pratique, utilisez un pool de Workers pour ce type de tâches. Sinon, les frais généraux liés à la création de Workers dépasseraient probablement leurs avantages.

Lors de l'implémentation d'un pool de workers, utilisez l'API [`AsyncResource`](/fr/nodejs/api/async_hooks#class-asyncresource) pour informer les outils de diagnostic (par exemple, pour fournir des traces de pile asynchrones) de la corrélation entre les tâches et leurs résultats. Consultez la section ["Utilisation de `AsyncResource` pour un pool de threads `Worker`"](/fr/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool) dans la documentation `async_hooks` pour un exemple d'implémentation.

Les threads de travail héritent des options non spécifiques au processus par défaut. Reportez-vous à [`Options du constructeur Worker`](/fr/nodejs/api/worker_threads#new-workerfilename-options) pour savoir comment personnaliser les options des threads de travail, en particulier les options `argv` et `execArgv`.


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.5.0, v16.15.0 | N’est plus expérimental. |
| v15.12.0, v14.18.0 | Ajouté dans : v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Toute valeur JavaScript arbitraire et clonable qui peut être utilisée comme clé [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Au sein d’un thread de worker, `worker.getEnvironmentData()` retourne un clone des données passées au `worker.setEnvironmentData()` du thread de spawning. Chaque nouveau `Worker` reçoit automatiquement sa propre copie des données d’environnement.

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Affiche 'World!'.
}
```
## `worker.isMainThread` {#workerismainthread}

**Ajouté dans : v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` si ce code ne s’exécute pas à l’intérieur d’un thread [`Worker`](/fr/nodejs/api/worker_threads#class-worker).

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // Ceci recharge le fichier courant à l’intérieur d’une instance Worker.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Affiche 'false'.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**Ajouté dans : v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Toute valeur JavaScript arbitraire.

Marque un objet comme non transférable. Si `object` se trouve dans la liste de transfert d’un appel [`port.postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist), une erreur est levée. Il s’agit d’une no-op si `object` est une valeur primitive.

En particulier, cela a du sens pour les objets qui peuvent être clonés, plutôt que transférés, et qui sont utilisés par d’autres objets du côté de l’envoi. Par exemple, Node.js marque les `ArrayBuffer`s qu’il utilise pour son [`Buffer` pool](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) avec ceci.

Cette opération ne peut pas être annulée.

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // Ceci lèvera une erreur, car pooledBuffer n’est pas transférable.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// La ligne suivante affiche le contenu de typedArray1 -- il possède toujours
// sa mémoire et n’a pas été transféré. Sans
// `markAsUntransferable()`, ceci afficherait un Uint8Array vide et l’appel
// postMessage aurait réussi.
// typedArray2 est également intact.
console.log(typedArray1);
console.log(typedArray2);
```
Il n’y a pas d’équivalent à cette API dans les navigateurs.


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**Ajouté dans: v21.0.0**

- `object` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Toute valeur JavaScript.
- Retourne: [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Vérifie si un objet est marqué comme non transférable avec [`markAsUntransferable()`](/fr/nodejs/api/worker_threads#workermarkasuntransferableobject).

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Retourne true.
```
Il n'y a pas d'équivalent à cette API dans les navigateurs.

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**Ajouté dans: v23.0.0**

- `object` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Toute valeur JavaScript arbitraire.

Marque un objet comme non clonable. Si `object` est utilisé comme [`message`](/fr/nodejs/api/worker_threads#event-message) dans un appel à [`port.postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist), une erreur est levée. Ceci est une no-op si `object` est une valeur primitive.

Cela n'a aucun effet sur `ArrayBuffer`, ou tout objet de type `Buffer`.

Cette opération est irréversible.

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // Ceci lèvera une erreur, car anyObject n'est pas clonable.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
Il n'y a pas d'équivalent à cette API dans les navigateurs.

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**Ajouté dans: v11.13.0**

-  `port` [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport) Le port de message à transférer.
-  `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) tel que renvoyé par la méthode `vm.createContext()`.
-  Retourne: [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport)

Transfère un `MessagePort` vers un [`vm`](/fr/nodejs/api/vm) Context différent. L'objet `port` d'origine est rendu inutilisable, et l'instance `MessagePort` retournée prend sa place.

Le `MessagePort` retourné est un objet dans le contexte cible et hérite de sa classe globale `Object`. Les objets passés à l'écouteur [`port.onmessage()`](https://developer.mozilla.org/fr/docs/Web/API/MessagePort/onmessage) sont également créés dans le contexte cible et héritent de sa classe globale `Object`.

Cependant, le `MessagePort` créé n'hérite plus de [`EventTarget`](https://developer.mozilla.org/fr/docs/Web/API/EventTarget), et seul [`port.onmessage()`](https://developer.mozilla.org/fr/docs/Web/API/MessagePort/onmessage) peut être utilisé pour recevoir des événements en l'utilisant.


## `worker.parentPort` {#workerparentport}

**Ajouté dans : v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport)

Si ce thread est un [`Worker`](/fr/nodejs/api/worker_threads#class-worker), il s'agit d'un [`MessagePort`](/fr/nodejs/api/worker_threads#class-messageport) permettant la communication avec le thread parent. Les messages envoyés à l'aide de `parentPort.postMessage()` sont disponibles dans le thread parent à l'aide de `worker.on('message')`, et les messages envoyés depuis le thread parent à l'aide de `worker.postMessage()` sont disponibles dans ce thread à l'aide de `parentPort.on('message')`.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Affiche 'Hello, world !'.
  });
  worker.postMessage('Hello, world !');
} else {
  // Lorsque qu'un message provenant du thread parent est reçu, le renvoyer :
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Développement actif
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID du thread cible. Si l'ID du thread n'est pas valide, une erreur [`ERR_WORKER_MESSAGING_FAILED`](/fr/nodejs/api/errors#err_worker_messaging_failed) sera émise. Si l'ID du thread cible est l'ID du thread actuel, une erreur [`ERR_WORKER_MESSAGING_SAME_THREAD`](/fr/nodejs/api/errors#err_worker_messaging_same_thread) sera émise.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La valeur à envoyer.
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si un ou plusieurs objets de type `MessagePort` sont passés dans `value`, une `transferList` est requise pour ces éléments ou [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/fr/nodejs/api/errors#err_missing_message_port_in_transfer_list) est émise. Voir [`port.postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist) pour plus d'informations.
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Temps d'attente en millisecondes pour que le message soit livré. Par défaut, il est `undefined`, ce qui signifie attendre indéfiniment. Si l'opération expire, une erreur [`ERR_WORKER_MESSAGING_TIMEOUT`](/fr/nodejs/api/errors#err_worker_messaging_timeout) est émise.
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Une promesse qui est tenue si le message a été traité avec succès par le thread de destination.

Envoie une valeur à un autre worker, identifié par son ID de thread.

Si le thread cible n'a pas d'écouteur pour l'événement `workerMessage`, l'opération émettra une erreur [`ERR_WORKER_MESSAGING_FAILED`](/fr/nodejs/api/errors#err_worker_messaging_failed).

Si le thread cible a émis une erreur lors du traitement de l'événement `workerMessage`, l'opération émettra une erreur [`ERR_WORKER_MESSAGING_ERRORED`](/fr/nodejs/api/errors#err_worker_messaging_errored).

Cette méthode doit être utilisée lorsque le thread cible n'est pas le parent ou l'enfant direct du thread actuel. Si les deux threads sont parent-enfant, utilisez [`require('node:worker_threads').parentPort.postMessage()`](/fr/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) et [`worker.postMessage()`](/fr/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) pour que les threads communiquent.

L'exemple ci-dessous montre l'utilisation de `postMessageToThread` : il crée 10 threads imbriqués, le dernier essaiera de communiquer avec le thread principal.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.12.0 | L'argument port peut maintenant également faire référence à un `BroadcastChannel`. |
| v12.3.0 | Ajouté dans : v12.3.0 |
:::

-  `port` [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/fr/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget) 
-  Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 

Reçoit un seul message d'un `MessagePort` donné. Si aucun message n'est disponible, `undefined` est retourné, sinon un objet avec une seule propriété `message` qui contient la charge utile du message, correspondant au message le plus ancien dans la queue du `MessagePort`.

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Affiche : { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Affiche : undefined
```
Lorsque cette fonction est utilisée, aucun événement `'message'` n'est émis et l'écouteur `onmessage` n'est pas invoqué.

## `worker.resourceLimits` {#workerresourcelimits}

**Ajouté dans : v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Fournit l'ensemble des contraintes de ressources du moteur JS à l'intérieur de ce thread Worker. Si l'option `resourceLimits` a été passée au constructeur [`Worker`](/fr/nodejs/api/worker_threads#class-worker), cela correspond à ses valeurs.

Si ceci est utilisé dans le thread principal, sa valeur est un objet vide.


## `worker.SHARE_ENV` {#workershare_env}

**Ajouté dans : v11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Une valeur spéciale qui peut être passée comme option `env` du constructeur [`Worker`](/fr/nodejs/api/worker_threads#class-worker), pour indiquer que le thread courant et le thread Worker doivent partager l'accès en lecture et en écriture au même ensemble de variables d'environnement.

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // Affiche 'foo'.
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.5.0, v16.15.0 | N'est plus expérimental. |
| v15.12.0, v14.18.0 | Ajouté dans : v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) N'importe quelle valeur JavaScript arbitraire et clonable qui peut être utilisée comme clé [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) N'importe quelle valeur JavaScript arbitraire et clonable qui sera clonée et transmise automatiquement à toutes les nouvelles instances de `Worker`. Si `value` est passé comme `undefined`, toute valeur précédemment définie pour la `key` sera supprimée.

L'API `worker.setEnvironmentData()` définit le contenu de `worker.getEnvironmentData()` dans le thread courant et toutes les nouvelles instances `Worker` générées à partir du contexte courant.

## `worker.threadId` {#workerthreadid}

**Ajouté dans : v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un identifiant entier pour le thread courant. Sur l'objet worker correspondant (s'il y en a un), il est disponible en tant que [`worker.threadId`](/fr/nodejs/api/worker_threads#workerthreadid_1). Cette valeur est unique pour chaque instance de [`Worker`](/fr/nodejs/api/worker_threads#class-worker) au sein d'un même processus.


## `worker.workerData` {#workerworkerdata}

**Ajouté dans la version : v10.5.0**

Une valeur JavaScript arbitraire qui contient un clone des données transmises au constructeur `Worker` de ce thread.

Les données sont clonées comme si elles utilisaient [`postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist), conformément à l'[algorithme de clonage structuré HTML](https://developer.mozilla.org/fr/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // Affiche 'Hello, world!'.
}
```
## Class : `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | N'est plus expérimental. |
| v15.4.0 | Ajouté dans la version : v15.4.0 |
:::

Les instances de `BroadcastChannel` permettent une communication asynchrone un-à-plusieurs avec toutes les autres instances de `BroadcastChannel` liées au même nom de canal.

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**Ajouté dans la version : v15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Le nom du canal auquel se connecter. Toute valeur JavaScript qui peut être convertie en chaîne de caractères à l'aide de ``${name}`` est autorisée.

### `broadcastChannel.close()` {#broadcastchannelclose}

**Ajouté dans la version : v15.4.0**

Ferme la connexion `BroadcastChannel`.

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**Ajouté dans la version : v15.4.0**

- Type : [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoquée avec un seul argument `MessageEvent` lorsqu'un message est reçu.


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**Ajouté dans : v15.4.0**

- Type : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoqué lorsqu’un message reçu ne peut pas être désérialisé.

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**Ajouté dans : v15.4.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Toute valeur JavaScript clonable.

### `broadcastChannel.ref()` {#broadcastchannelref}

**Ajouté dans : v15.4.0**

Contraire de `unref()`. Appeler `ref()` sur un BroadcastChannel précédemment `unref()` ne permet *pas* au programme de se fermer s’il s’agit du seul descripteur actif restant (le comportement par défaut). Si le port est `ref()`é, appeler `ref()` à nouveau n’a aucun effet.

### `broadcastChannel.unref()` {#broadcastchannelunref}

**Ajouté dans : v15.4.0**

Appeler `unref()` sur un BroadcastChannel permet au thread de se fermer si c’est le seul descripteur actif dans le système d’événements. Si le BroadcastChannel est déjà `unref()`é, appeler `unref()` à nouveau n’a aucun effet.

## Class : `MessageChannel` {#class-messagechannel}

**Ajouté dans : v10.5.0**

Les instances de la classe `worker.MessageChannel` représentent un canal de communication bidirectionnel et asynchrone. Le `MessageChannel` n’a pas de méthodes propres. `new MessageChannel()` produit un objet avec les propriétés `port1` et `port2`, qui font référence aux instances [`MessagePort`](/fr/nodejs/api/worker_threads#class-messageport) liées.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// Prints: received { foo: 'bar' } from the `port1.on('message')` listener
```
## Classe : `MessagePort` {#class-messageport}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.7.0 | Cette classe hérite maintenant de `EventTarget` au lieu de `EventEmitter`. |
| v10.5.0 | Ajouté dans : v10.5.0 |
:::

- Hérite de : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget)

Les instances de la classe `worker.MessagePort` représentent une extrémité d’un canal de communication bidirectionnel et asynchrone. Il peut être utilisé pour transférer des données structurées, des régions de mémoire et d’autres `MessagePort`s entre différents [`Worker`](/fr/nodejs/api/worker_threads#class-worker)s.

Cette implémentation correspond aux [`MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)s du navigateur.


### Événement : `'close'` {#event-close}

**Ajouté dans : v10.5.0**

L’événement `'close'` est émis une fois que l’un des côtés du canal a été déconnecté.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// Affiche :
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### Événement : `'message'` {#event-message}

**Ajouté dans : v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La valeur transmise

L’événement `'message'` est émis pour tout message entrant, contenant l’entrée clonée de [`port.postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist).

Les auditeurs de cet événement reçoivent un clone du paramètre `value` tel qu’il est passé à `postMessage()` et aucun autre argument.

### Événement : `'messageerror'` {#event-messageerror}

**Ajouté dans : v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) Un objet Error

L’événement `'messageerror'` est émis lorsque la désérialisation d’un message a échoué.

Actuellement, cet événement est émis lorsqu’une erreur se produit lors de l’instanciation de l’objet JS publié à la réception. De telles situations sont rares, mais peuvent se produire, par exemple, lorsque certains objets API Node.js sont reçus dans un `vm.Context` (où les API Node.js ne sont actuellement pas disponibles).

### `port.close()` {#portclose}

**Ajouté dans : v10.5.0**

Désactive l’envoi ultérieur de messages de chaque côté de la connexion. Cette méthode peut être appelée lorsqu’aucune autre communication n’aura lieu sur ce `MessagePort`.

L’événement [`'close'` ](/fr/nodejs/api/worker_threads#event-close) est émis sur les deux instances `MessagePort` qui font partie du canal.

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Une erreur est levée lorsqu’un objet non transférable figure dans la liste de transfert. |
| v15.6.0 | Ajout de `X509Certificate` à la liste des types clonables. |
| v15.0.0 | Ajout de `CryptoKey` à la liste des types clonables. |
| v15.14.0, v14.18.0 | Ajout de 'BlockList' à la liste des types clonables. |
| v15.9.0, v14.18.0 | Ajout des types 'Histogram' à la liste des types clonables. |
| v14.5.0, v12.19.0 | Ajout de `KeyObject` à la liste des types clonables. |
| v14.5.0, v12.19.0 | Ajout de `FileHandle` à la liste des types transférables. |
| v10.5.0 | Ajouté dans : v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envoie une valeur JavaScript au côté récepteur de ce canal. `value` est transférée d’une manière compatible avec l’[algorithme de clonage structuré HTML](https://developer.mozilla.org/fr/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

En particulier, les différences significatives par rapport à `JSON` sont les suivantes :

- `value` peut contenir des références circulaires.
- `value` peut contenir des instances de types JS intégrés tels que `RegExp`s, `BigInt`s, `Map`s, `Set`s, etc.
- `value` peut contenir des tableaux typés, à la fois en utilisant `ArrayBuffer`s et `SharedArrayBuffer`s.
- `value` peut contenir des instances de [`WebAssembly.Module`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module).
- `value` ne peut pas contenir d’objets natifs (basés sur C++), autres que :
    - [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)s,
    - [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle)s,
    - [\<Histogram\>](/fr/nodejs/api/perf_hooks#class-histogram)s,
    - [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)s,
    - [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport)s,
    - [\<net.BlockList\>](/fr/nodejs/api/net#class-netblocklist)s,
    - [\<net.SocketAddress\>](/fr/nodejs/api/net#class-netsocketaddress)es,
    - [\<X509Certificate\>](/fr/nodejs/api/crypto#class-x509certificate)s.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// Prints: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList` peut être une liste d’objets [`ArrayBuffer`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`MessagePort`](/fr/nodejs/api/worker_threads#class-messageport) et [`FileHandle`](/fr/nodejs/api/fs#class-filehandle). Après le transfert, ils ne sont plus utilisables du côté de l’envoi du canal (même s’ils ne sont pas contenus dans `value`). Contrairement aux [processus enfants](/fr/nodejs/api/child_process), le transfert de handles tels que les sockets réseau n’est actuellement pas pris en charge.

Si `value` contient des instances [`SharedArrayBuffer`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), celles-ci sont accessibles depuis les deux threads. Ils ne peuvent pas être répertoriés dans `transferList`.

`value` peut toujours contenir des instances `ArrayBuffer` qui ne sont pas dans `transferList` ; dans ce cas, la mémoire sous-jacente est copiée plutôt que déplacée.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// Ceci publie une copie de `uint8Array` :
port2.postMessage(uint8Array);
// Ceci ne copie pas les données, mais rend `uint8Array` inutilisable :
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// La mémoire de `sharedUint8Array` est accessible à la fois depuis
// l’original et la copie reçue par `.on('message')` :
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// Ceci transfère un port de message fraîchement créé au destinataire.
// Ceci peut être utilisé, par exemple, pour créer des canaux de communication entre
// plusieurs threads `Worker` qui sont des enfants du même thread parent.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
L’objet message est cloné immédiatement et peut être modifié après la publication sans avoir d’effets secondaires.

Pour plus d’informations sur les mécanismes de sérialisation et de désérialisation derrière cette API, consultez l’[API de sérialisation du module `node:v8`](/fr/nodejs/api/v8#serialization-api).

#### Considérations lors du transfert de TypedArrays et de Buffers {#considerations-when-transferring-typedarrays-and-buffers}

Toutes les instances `TypedArray` et `Buffer` sont des vues sur un `ArrayBuffer` sous-jacent. C'est-à-dire que c'est le `ArrayBuffer` qui stocke réellement les données brutes, tandis que les objets `TypedArray` et `Buffer` fournissent un moyen de visualiser et de manipuler les données. Il est possible et courant de créer plusieurs vues sur la même instance de `ArrayBuffer`. Il faut faire très attention lors de l'utilisation d'une liste de transfert pour transférer un `ArrayBuffer`, car cela rend inutilisables toutes les instances `TypedArray` et `Buffer` qui partagent le même `ArrayBuffer`.

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // affiche 5

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // affiche 0
```
Pour les instances `Buffer` en particulier, la possibilité de transférer ou de cloner le `ArrayBuffer` sous-jacent dépend entièrement de la façon dont les instances ont été créées, ce qui souvent ne peut pas être déterminé de manière fiable.

Un `ArrayBuffer` peut être marqué avec [`markAsUntransferable()`](/fr/nodejs/api/worker_threads#workermarkasuntransferableobject) pour indiquer qu'il doit toujours être cloné et jamais transféré.

Selon la façon dont une instance `Buffer` a été créée, elle peut ou non posséder son `ArrayBuffer` sous-jacent. Un `ArrayBuffer` ne doit pas être transféré à moins qu'il ne soit connu que l'instance `Buffer` le possède. En particulier, pour les `Buffer` créés à partir du pool interne de `Buffer` (en utilisant, par exemple, `Buffer.from()` ou `Buffer.allocUnsafe()`), leur transfert n'est pas possible et ils sont toujours clonés, ce qui envoie une copie de l'ensemble du pool de `Buffer`. Ce comportement peut entraîner une utilisation de la mémoire plus élevée et des problèmes de sécurité potentiels.

Voir [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) pour plus de détails sur le pooling de `Buffer`.

Les `ArrayBuffer` pour les instances `Buffer` créées à l'aide de `Buffer.alloc()` ou `Buffer.allocUnsafeSlow()` peuvent toujours être transférés, mais cela rend inutilisables toutes les autres vues existantes de ces `ArrayBuffer`.


#### Considérations lors du clonage d'objets avec prototypes, classes et accesseurs {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

Étant donné que le clonage d'objets utilise l'[algorithme de clonage structuré HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), les propriétés non énumérables, les accesseurs de propriétés et les prototypes d'objets ne sont pas conservés. En particulier, les objets [`Buffer`](/fr/nodejs/api/buffer) seront lus comme de simples [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) du côté réception, et les instances de classes JavaScript seront clonées comme de simples objets JavaScript.

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
Cette limitation s'étend à de nombreux objets intégrés, tels que l'objet global `URL` :

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**Ajouté dans : v18.1.0, v16.17.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si la valeur est true, l'objet `MessagePort` maintiendra la boucle d'événement Node.js active.

### `port.ref()` {#portref}

**Ajouté dans : v10.5.0**

Contraire de `unref()`. L'appel de `ref()` sur un port précédemment `unref()` ne permet *pas* au programme de se terminer s'il s'agit du seul handle actif restant (le comportement par défaut). Si le port est `ref()`, appeler à nouveau `ref()` n'a aucun effet.

Si des listeners sont attachés ou supprimés à l'aide de `.on('message')`, le port est `ref()` et `unref()` automatiquement selon qu'il existe ou non des listeners pour l'événement.


### `port.start()` {#portstart}

**Ajouté dans : v10.5.0**

Commence à recevoir des messages sur ce `MessagePort`. Lorsque ce port est utilisé comme émetteur d’événements, cette méthode est appelée automatiquement une fois que les listeners `'message'` sont attachés.

Cette méthode existe pour assurer la parité avec l’API Web `MessagePort`. Dans Node.js, elle n’est utile que pour ignorer les messages lorsqu’aucun écouteur d’événements n’est présent. Node.js diverge également dans sa gestion de `.onmessage`. La définition de celui-ci appelle automatiquement `.start()`, mais sa suppression permet de mettre les messages en file d’attente jusqu’à ce qu’un nouveau gestionnaire soit défini ou que le port soit supprimé.

### `port.unref()` {#portunref}

**Ajouté dans : v10.5.0**

Appeler `unref()` sur un port permet au thread de se fermer si c’est la seule handle active dans le système d’événements. Si le port est déjà `unref()`ed, appeler `unref()` à nouveau n’a aucun effet.

Si des listeners sont attachés ou supprimés à l’aide de `.on('message')`, le port est `ref()`ed et `unref()`ed automatiquement selon qu’il existe ou non des listeners pour l’événement.

## Classe : `Worker` {#class-worker}

**Ajouté dans : v10.5.0**

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

La classe `Worker` représente un thread d’exécution JavaScript indépendant. La plupart des API Node.js y sont disponibles.

Les différences notables dans un environnement Worker sont :

- Les flux [`process.stdin`](/fr/nodejs/api/process#processstdin), [`process.stdout`](/fr/nodejs/api/process#processstdout) et [`process.stderr`](/fr/nodejs/api/process#processstderr) peuvent être redirigés par le thread parent.
- La propriété [`require('node:worker_threads').isMainThread`](/fr/nodejs/api/worker_threads#workerismainthread) est définie sur `false`.
- Le port de message [`require('node:worker_threads').parentPort`](/fr/nodejs/api/worker_threads#workerparentport) est disponible.
- [`process.exit()`](/fr/nodejs/api/process#processexitcode) n’arrête pas l’ensemble du programme, mais seulement le thread unique, et [`process.abort()`](/fr/nodejs/api/process#processabort) n’est pas disponible.
- [`process.chdir()`](/fr/nodejs/api/process#processchdirdirectory) et les méthodes `process` qui définissent les identifiants de groupe ou d’utilisateur ne sont pas disponibles.
- [`process.env`](/fr/nodejs/api/process#processenv) est une copie des variables d’environnement du thread parent, sauf indication contraire. Les modifications apportées à une copie ne sont pas visibles dans les autres threads et ne sont pas visibles par les modules complémentaires natifs (sauf si [`worker.SHARE_ENV`](/fr/nodejs/api/worker_threads#workershare_env) est transmis en tant qu’option `env` au constructeur [`Worker`](/fr/nodejs/api/worker_threads#class-worker)). Sous Windows, contrairement au thread principal, une copie des variables d’environnement fonctionne en tenant compte de la casse.
- [`process.title`](/fr/nodejs/api/process#processtitle) ne peut pas être modifié.
- Les signaux ne sont pas transmis via [`process.on('...')`](/fr/nodejs/api/process#signal-events).
- L’exécution peut s’arrêter à tout moment à la suite de l’invocation de [`worker.terminate()`](/fr/nodejs/api/worker_threads#workerterminate).
- Les canaux IPC des processus parents ne sont pas accessibles.
- Le module [`trace_events`](/fr/nodejs/api/tracing) n’est pas pris en charge.
- Les modules complémentaires natifs ne peuvent être chargés à partir de plusieurs threads que s’ils remplissent [certaines conditions](/fr/nodejs/api/addons#worker-support).

La création d’instances `Worker` à l’intérieur d’autres `Worker`s est possible.

Comme les [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) et le [`node:cluster` module](/fr/nodejs/api/cluster), la communication bidirectionnelle peut être réalisée par le biais du transfert de messages entre threads. En interne, un `Worker` possède une paire intégrée de [`MessagePort`](/fr/nodejs/api/worker_threads#class-messageport)s qui sont déjà associées l’une à l’autre lorsque le `Worker` est créé. Bien que l’objet `MessagePort` du côté parent ne soit pas directement exposé, ses fonctionnalités sont exposées via [`worker.postMessage()`](/fr/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) et l’événement [`worker.on('message')`](/fr/nodejs/api/worker_threads#event-message_1) sur l’objet `Worker` pour le thread parent.

Pour créer des canaux de messagerie personnalisés (ce qui est encouragé par rapport à l’utilisation du canal global par défaut, car cela facilite la séparation des préoccupations), les utilisateurs peuvent créer un objet `MessageChannel` sur l’un ou l’autre thread et transmettre l’un des `MessagePort`s sur ce `MessageChannel` à l’autre thread via un canal préexistant, tel que le canal global.

Voir [`port.postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist) pour plus d’informations sur la façon dont les messages sont transmis, et quel type de valeurs JavaScript peut être transporté avec succès à travers la barrière des threads.

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.8.0, v18.16.0 | Ajout du support d'une option `name`, qui permet d'ajouter un nom au titre du worker pour le débogage. |
| v14.9.0 | Le paramètre `filename` peut être un objet `URL` WHATWG utilisant le protocole `data:`. |
| v14.9.0 | L'option `trackUnmanagedFds` a été définie sur `true` par défaut. |
| v14.6.0, v12.19.0 | L'option `trackUnmanagedFds` a été introduite. |
| v13.13.0, v12.17.0 | L'option `transferList` a été introduite. |
| v13.12.0, v12.17.0 | Le paramètre `filename` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v13.4.0, v12.16.0 | L'option `argv` a été introduite. |
| v13.2.0, v12.16.0 | L'option `resourceLimits` a été introduite. |
| v10.5.0 | Ajoutée dans : v10.5.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Le chemin d'accès au script principal ou au module du Worker. Doit être soit un chemin absolu, soit un chemin relatif (c'est-à-dire relatif au répertoire de travail actuel) commençant par `./` ou `../`, soit un objet `URL` WHATWG utilisant le protocole `file:` ou `data:`. Lors de l'utilisation d'une [`data: URL`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs), les données sont interprétées en fonction du type MIME à l'aide du [chargeur de module ECMAScript](/fr/nodejs/api/esm#data-imports). Si `options.eval` est `true`, il s'agit d'une chaîne contenant du code JavaScript plutôt qu'un chemin d'accès.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Liste des arguments qui seraient transformés en chaînes de caractères et ajoutés à `process.argv` dans le worker. Ceci est très similaire à `workerData` mais les valeurs sont disponibles sur le `process.argv` global comme si elles étaient passées comme options CLI au script.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si défini, spécifie la valeur initiale de `process.env` à l'intérieur du thread Worker. En tant que valeur spéciale, [`worker.SHARE_ENV`](/fr/nodejs/api/worker_threads#workershare_env) peut être utilisé pour spécifier que le thread parent et le thread enfant doivent partager leurs variables d'environnement ; dans ce cas, les modifications apportées à l'objet `process.env` d'un thread affectent également l'autre thread. **Par défaut :** `process.env`.
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true` et que le premier argument est une `string`, interprète le premier argument du constructeur comme un script qui est exécuté une fois que le worker est en ligne.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste des options CLI de node transmises au worker. Les options V8 (telles que `--max-old-space-size`) et les options qui affectent le processus (telles que `--title`) ne sont pas prises en charge. Si elle est définie, elle est fournie en tant que [`process.execArgv`](/fr/nodejs/api/process#processexecargv) à l'intérieur du worker. Par défaut, les options sont héritées du thread parent.
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si cette option est définie sur `true`, alors `worker.stdin` fournit un flux accessible en écriture dont le contenu apparaît comme `process.stdin` à l'intérieur du Worker. Par défaut, aucune donnée n'est fournie.
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si cette option est définie sur `true`, alors `worker.stdout` n'est pas automatiquement redirigé vers `process.stdout` dans le parent.
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si cette option est définie sur `true`, alors `worker.stderr` n'est pas automatiquement redirigé vers `process.stderr` dans le parent.
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Toute valeur JavaScript qui est clonée et rendue disponible en tant que [`require('node:worker_threads').workerData`](/fr/nodejs/api/worker_threads#workerworkerdata). Le clonage se produit comme décrit dans l'[algorithme de clonage structuré HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), et une erreur est levée si l'objet ne peut pas être cloné (par exemple, parce qu'il contient des `function`s).
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si cette option est définie sur `true`, alors le Worker suit les descripteurs de fichiers bruts gérés via [`fs.open()`](/fr/nodejs/api/fs#fsopenpath-flags-mode-callback) et [`fs.close()`](/fr/nodejs/api/fs#fsclosefd-callback), et les ferme lorsque le Worker se termine, de la même manière que d'autres ressources telles que les sockets réseau ou les descripteurs de fichiers gérés via l'API [`FileHandle`](/fr/nodejs/api/fs#class-filehandle). Cette option est automatiquement héritée par tous les `Worker` imbriqués. **Par défaut :** `true`.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si un ou plusieurs objets de type `MessagePort` sont passés dans `workerData`, une `transferList` est requise pour ces éléments ou [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/fr/nodejs/api/errors#err_missing_message_port_in_transfer_list) est levée. Voir [`port.postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist) pour plus d'informations.
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un ensemble facultatif de limites de ressources pour la nouvelle instance de moteur JS. Atteindre ces limites entraîne la fin de l'instance `Worker`. Ces limites affectent uniquement le moteur JS, et aucune donnée externe, y compris aucun `ArrayBuffer`. Même si ces limites sont définies, le processus peut toujours s'arrêter s'il rencontre une situation globale de mémoire insuffisante.
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale du tas principal en Mo. Si l'argument de ligne de commande [`--max-old-space-size`](/fr/nodejs/api/cli#--max-old-space-sizesize-in-mib) est défini, il remplace ce paramètre.
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale d'un espace de tas pour les objets créés récemment. Si l'argument de ligne de commande [`--max-semi-space-size`](/fr/nodejs/api/cli#--max-semi-space-sizesize-in-mib) est défini, il remplace ce paramètre.
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille d'une plage de mémoire pré-allouée utilisée pour le code généré.
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale par défaut de la pile pour le thread. De petites valeurs peuvent entraîner des instances Worker inutilisables. **Par défaut :** `4`.
  
 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un `name` facultatif à ajouter au titre du worker à des fins de débogage/identification, ce qui donne le titre final sous la forme `[worker ${id}] ${name}`. **Par défaut :** `''`.
  


### Événement : `'error'` {#event-error}

**Ajouté dans : v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'événement `'error'` est émis si le thread worker lève une exception non interceptée. Dans ce cas, le worker est terminé.

### Événement : `'exit'` {#event-exit}

**Ajouté dans : v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)

L'événement `'exit'` est émis une fois que le worker s'est arrêté. Si le worker s'est arrêté en appelant [`process.exit()`](/fr/nodejs/api/process#processexitcode), le paramètre `exitCode` est le code de sortie transmis. Si le worker a été terminé, le paramètre `exitCode` est `1`.

Il s'agit de l'événement final émis par toute instance de `Worker`.

### Événement : `'message'` {#event-message_1}

**Ajouté dans : v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La valeur transmise

L'événement `'message'` est émis lorsque le thread worker a invoqué [`require('node:worker_threads').parentPort.postMessage()`](/fr/nodejs/api/worker_threads#workerpostmessagevalue-transferlist). Voir l'événement [`port.on('message')`](/fr/nodejs/api/worker_threads#event-message) pour plus de détails.

Tous les messages envoyés depuis le thread worker sont émis avant que l'[`'exit'` event](/fr/nodejs/api/worker_threads#event-exit) ne soit émis sur l'objet `Worker`.

### Événement : `'messageerror'` {#event-messageerror_1}

**Ajouté dans : v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) Un objet Error

L'événement `'messageerror'` est émis lorsque la désérialisation d'un message a échoué.

### Événement : `'online'` {#event-online}

**Ajouté dans : v10.5.0**

L'événement `'online'` est émis lorsque le thread worker a commencé à exécuter du code JavaScript.

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.1.0 | Prise en charge des options pour configurer le heap snapshot. |
| v13.9.0, v12.17.0 | Ajouté dans : v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Si true, expose les éléments internes dans le heap snapshot. **Par défaut :** `false`.
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Si true, expose les valeurs numériques dans des champs artificiels. **Par défaut :** `false`.


- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Une promesse pour un Readable Stream contenant un heap snapshot V8

Retourne un flux lisible pour un snapshot V8 de l'état actuel du Worker. Voir [`v8.getHeapSnapshot()`](/fr/nodejs/api/v8#v8getheapsnapshotoptions) pour plus de détails.

Si le thread Worker ne s'exécute plus, ce qui peut se produire avant que l'événement [`'exit'` event](/fr/nodejs/api/worker_threads#event-exit) ne soit émis, la `Promise` retournée est rejetée immédiatement avec une erreur [`ERR_WORKER_NOT_RUNNING`](/fr/nodejs/api/errors#err_worker_not_running).


### `worker.performance` {#workerperformance}

**Ajouté dans : v15.1.0, v14.17.0, v12.22.0**

Un objet qui peut être utilisé pour interroger les informations de performance d'une instance de worker. Semblable à [`perf_hooks.performance`](/fr/nodejs/api/perf_hooks#perf_hooksperformance).

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Ajouté dans : v15.1.0, v14.17.0, v12.22.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le résultat d'un appel précédent à `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le résultat d'un appel précédent à `eventLoopUtilization()` avant `utilization1`.
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Le même appel que [`perf_hooks` `eventLoopUtilization()`](/fr/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2), sauf que les valeurs de l'instance du worker sont retournées.

Une différence est que, contrairement au thread principal, l'amorçage dans un worker se fait dans la boucle d'événements. Ainsi, l'utilisation de la boucle d'événements est immédiatement disponible une fois que le script du worker commence son exécution.

Un temps `idle` qui n'augmente pas n'indique pas que le worker est bloqué dans l'amorçage. Les exemples suivants montrent comment la durée de vie entière du worker n'accumule jamais de temps `idle`, mais est toujours en mesure de traiter les messages.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
L'utilisation de la boucle d'événements d'un worker n'est disponible qu'après l'émission de l' [`'online'` event](/fr/nodejs/api/worker_threads#event-online), et si elle est appelée avant cela, ou après l' [`'exit'` event](/fr/nodejs/api/worker_threads#event-exit), alors toutes les propriétés ont la valeur `0`.


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**Ajouté dans : v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envoie un message au worker qui est reçu via [`require('node:worker_threads').parentPort.on('message')`](/fr/nodejs/api/worker_threads#event-message). Voir [`port.postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist) pour plus de détails.

### `worker.ref()` {#workerref}

**Ajouté dans : v10.5.0**

Contrairement à `unref()`, l'appel de `ref()` sur un worker précédemment `unref()` ne permet *pas* au programme de se terminer s'il s'agit du seul gestionnaire actif restant (le comportement par défaut). Si le worker est `ref()`é, appeler `ref()` à nouveau n'a aucun effet.

### `worker.resourceLimits` {#workerresourcelimits_1}

**Ajouté dans : v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Fournit l'ensemble des contraintes de ressources du moteur JS pour ce thread Worker. Si l'option `resourceLimits` a été passée au constructeur [`Worker`](/fr/nodejs/api/worker_threads#class-worker), cela correspond à ses valeurs.

Si le worker s'est arrêté, la valeur de retour est un objet vide.

### `worker.stderr` {#workerstderr}

**Ajouté dans : v10.5.0**

- [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)

Il s'agit d'un flux lisible qui contient les données écrites dans [`process.stderr`](/fr/nodejs/api/process#processstderr) à l'intérieur du thread worker. Si `stderr: true` n'a pas été passé au constructeur [`Worker`](/fr/nodejs/api/worker_threads#class-worker), alors les données sont transmises au flux [`process.stderr`](/fr/nodejs/api/process#processstderr) du thread parent.


### `worker.stdin` {#workerstdin}

**Ajouté dans: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)

Si `stdin: true` a été passé au constructeur [`Worker`](/fr/nodejs/api/worker_threads#class-worker), il s'agit d'un flux accessible en écriture. Les données écrites dans ce flux seront disponibles dans le thread worker en tant que [`process.stdin`](/fr/nodejs/api/process#processstdin).

### `worker.stdout` {#workerstdout}

**Ajouté dans: v10.5.0**

- [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)

Il s'agit d'un flux accessible en lecture qui contient les données écrites dans [`process.stdout`](/fr/nodejs/api/process#processstdout) à l'intérieur du thread worker. Si `stdout: true` n'a pas été passé au constructeur [`Worker`](/fr/nodejs/api/worker_threads#class-worker), alors les données sont redirigées vers le flux [`process.stdout`](/fr/nodejs/api/process#processstdout) du thread parent.

### `worker.terminate()` {#workerterminate}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.5.0 | Cette fonction renvoie désormais une Promise. Le passage d'un rappel est obsolète et était inutile jusqu'à cette version, car le Worker était en fait arrêté de manière synchrone. L'arrêt est désormais une opération entièrement asynchrone. |
| v10.5.0 | Ajouté dans: v10.5.0 |
:::

- Retourne: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Arrête l'exécution de tout JavaScript dans le thread worker dès que possible. Renvoie une Promise pour le code de sortie qui est résolue lorsque l'événement [`'exit'` event](/fr/nodejs/api/worker_threads#event-exit) est émis.

### `worker.threadId` {#workerthreadid_1}

**Ajouté dans: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Un identifiant entier pour le thread référencé. À l'intérieur du thread worker, il est disponible en tant que [`require('node:worker_threads').threadId`](/fr/nodejs/api/worker_threads#workerthreadid). Cette valeur est unique pour chaque instance `Worker` à l'intérieur d'un seul processus.

### `worker.unref()` {#workerunref}

**Ajouté dans: v10.5.0**

Appeler `unref()` sur un worker permet au thread de se terminer si c'est le seul handle actif dans le système d'événements. Si le worker est déjà `unref()`é, appeler à nouveau `unref()` n'a aucun effet.


## Notes {#notes}

### Blocage synchrone de stdio {#synchronous-blocking-of-stdio}

Les `Worker`s utilisent le passage de messages via [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport) pour implémenter les interactions avec `stdio`. Cela signifie que la sortie `stdio` provenant d'un `Worker` peut être bloquée par du code synchrone du côté du destinataire qui bloque la boucle d'événements Node.js.

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // Boucle pour simuler du travail.
  }
} else {
  // Cette sortie sera bloquée par la boucle for dans le thread principal.
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // Boucle pour simuler du travail.
  }
} else {
  // Cette sortie sera bloquée par la boucle for dans le thread principal.
  console.log('foo');
}
```
:::

### Lancement de threads worker à partir de scripts de préchargement {#launching-worker-threads-from-preload-scripts}

Soyez prudent lors du lancement de threads worker à partir de scripts de préchargement (scripts chargés et exécutés à l'aide de l'indicateur de ligne de commande `-r`). À moins que l'option `execArgv` ne soit explicitement définie, les nouveaux threads Worker héritent automatiquement des indicateurs de ligne de commande du processus en cours d'exécution et préchargeront les mêmes scripts de préchargement que le thread principal. Si le script de préchargement lance inconditionnellement un thread worker, chaque thread engendré engendrera un autre jusqu'à ce que l'application plante.

