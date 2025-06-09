---
title: Documentation du module Inspecteur de Node.js
description: Le module Inspecteur de Node.js fournit une API pour interagir avec l'inspecteur V8, permettant aux développeurs de déboguer les applications Node.js en se connectant au protocole de l'inspecteur.
head:
  - - meta
    - name: og:title
      content: Documentation du module Inspecteur de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Inspecteur de Node.js fournit une API pour interagir avec l'inspecteur V8, permettant aux développeurs de déboguer les applications Node.js en se connectant au protocole de l'inspecteur.
  - - meta
    - name: twitter:title
      content: Documentation du module Inspecteur de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Inspecteur de Node.js fournit une API pour interagir avec l'inspecteur V8, permettant aux développeurs de déboguer les applications Node.js en se connectant au protocole de l'inspecteur.
---


# Inspecteur {#inspector}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

Le module `node:inspector` fournit une API pour interagir avec l'inspecteur V8.

Il est accessible en utilisant :

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

ou

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## API des Promesses {#promises-api}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

**Ajouté dans : v19.0.0**

### Classe: `inspector.Session` {#class-inspectorsession}

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

La `inspector.Session` est utilisée pour envoyer des messages au back-end de l'inspecteur V8 et pour recevoir les réponses et les notifications des messages.

#### `new inspector.Session()` {#new-inspectorsession}

**Ajouté dans : v8.0.0**

Crée une nouvelle instance de la classe `inspector.Session`. La session de l'inspecteur doit être connectée via [`session.connect()`](/fr/nodejs/api/inspector#sessionconnect) avant que les messages puissent être envoyés au back-end de l'inspecteur.

Lors de l'utilisation de `Session`, l'objet produit par l'API console ne sera pas libéré, sauf si nous avons effectué manuellement la commande `Runtime.DiscardConsoleEntries`.

#### Événement : `'inspectorNotification'` {#event-inspectornotification}

**Ajouté dans : v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet message de notification

Émis lorsqu'une notification de l'inspecteur V8 est reçue.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
Il est également possible de s'abonner uniquement aux notifications avec une méthode spécifique :


#### Événement : `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**Ajouté dans : v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet de message de notification

Émis lorsqu'une notification d'inspecteur est reçue et que son champ de méthode est défini sur la valeur `\<inspector-protocol-method\>`.

L'extrait suivant installe un écouteur sur l'événement [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) et affiche la raison de la suspension du programme chaque fois que l'exécution du programme est suspendue (par exemple, via des points d'arrêt) :

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**Ajouté dans : v8.0.0**

Connecte une session au back-end de l'inspecteur.

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**Ajouté dans : v12.11.0**

Connecte une session au back-end de l'inspecteur du thread principal. Une exception sera levée si cette API n'a pas été appelée sur un thread Worker.

#### `session.disconnect()` {#sessiondisconnect}

**Ajouté dans : v8.0.0**

Ferme immédiatement la session. Tous les rappels de messages en attente seront appelés avec une erreur. [`session.connect()`](/fr/nodejs/api/inspector#sessionconnect) devra être appelée pour pouvoir renvoyer des messages. La session reconnectée perdra tout l'état de l'inspecteur, tel que les agents activés ou les points d'arrêt configurés.

#### `session.post(method[, params])` {#sessionpostmethod-params}

**Ajouté dans : v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Envoie un message au back-end de l'inspecteur.

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```
La dernière version du protocole de l'inspecteur V8 est publiée sur [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

L'inspecteur Node.js prend en charge tous les domaines du protocole Chrome DevTools déclarés par V8. Le domaine du protocole Chrome DevTools fournit une interface pour interagir avec l'un des agents d'exécution utilisés pour inspecter l'état de l'application et écouter les événements d'exécution.


#### Exemple d'utilisation {#example-usage}

Outre le débogueur, divers profileurs V8 sont disponibles via le protocole DevTools.

##### Profileur CPU {#cpu-profiler}

Voici un exemple montrant comment utiliser le [Profileur CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler) :

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Invoquer la logique métier sous mesure ici...

// un peu plus tard...
const { profile } = await session.post('Profiler.stop');

// Écrire le profil sur le disque, le télécharger, etc.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### Profileur de tas (Heap) {#heap-profiler}

Voici un exemple montrant comment utiliser le [Profileur de tas](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler) :

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## API de rappel {#callback-api}

### Classe: `inspector.Session` {#class-inspectorsession_1}

- Hérite de: [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

L'objet `inspector.Session` est utilisé pour envoyer des messages au back-end de l'inspecteur V8 et pour recevoir les réponses aux messages et les notifications.

#### `new inspector.Session()` {#new-inspectorsession_1}

**Ajouté dans : v8.0.0**

Crée une nouvelle instance de la classe `inspector.Session`. La session de l'inspecteur doit être connectée via [`session.connect()`](/fr/nodejs/api/inspector#sessionconnect) avant que les messages puissent être envoyés au back-end de l'inspecteur.

Lorsque vous utilisez `Session`, l'objet généré par l'API de la console ne sera pas libéré, sauf si nous avons exécuté manuellement la commande `Runtime.DiscardConsoleEntries`.


#### Événement : `'inspectorNotification'` {#event-inspectornotification_1}

**Ajouté dans : v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet de message de notification

Émis lorsqu'une notification de l'inspecteur V8 est reçue.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
Il est également possible de ne s'abonner qu'aux notifications avec une méthode spécifique :

#### Événement : `&lt;inspector-protocol-method&gt;` ; {#event-&lt;inspector-protocol-method&gt;;_1}

**Ajouté dans : v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet de message de notification

Émis lorsqu'une notification d'inspecteur est reçue et que son champ method est défini sur la valeur `\<inspector-protocol-method\>`.

L'extrait de code suivant installe un écouteur sur l'événement [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused), et affiche la raison de la suspension du programme chaque fois que l'exécution du programme est suspendue (par le biais de points d'arrêt, par exemple) :

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**Ajouté dans : v8.0.0**

Connecte une session au back-end de l'inspecteur.

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**Ajouté dans : v12.11.0**

Connecte une session au back-end de l'inspecteur du thread principal. Une exception sera levée si cette API n'a pas été appelée sur un thread Worker.

#### `session.disconnect()` {#sessiondisconnect_1}

**Ajouté dans : v8.0.0**

Ferme immédiatement la session. Tous les rappels de message en attente seront appelés avec une erreur. [`session.connect()`](/fr/nodejs/api/inspector#sessionconnect) devra être appelé pour pouvoir renvoyer des messages. Une session reconnectée perdra tout l'état de l'inspecteur, tel que les agents activés ou les points d'arrêt configurés.

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Envoie un message au back-end de l'inspecteur. `callback` sera notifié lorsqu'une réponse sera reçue. `callback` est une fonction qui accepte deux arguments optionnels : erreur et résultat spécifique au message.

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```
La dernière version du protocole d'inspecteur V8 est publiée sur le [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

L'inspecteur Node.js prend en charge tous les domaines Chrome DevTools Protocol déclarés par V8. Le domaine Chrome DevTools Protocol fournit une interface pour interagir avec l'un des agents d'exécution utilisés pour inspecter l'état de l'application et écouter les événements d'exécution.

Vous ne pouvez pas définir `reportProgress` sur `true` lorsque vous envoyez une commande `HeapProfiler.takeHeapSnapshot` ou `HeapProfiler.stopTrackingHeapObjects` à V8.


#### Exemple d'utilisation {#example-usage_1}

Outre le débogueur, divers profileurs V8 sont disponibles via le protocole DevTools.

##### Profileur CPU {#cpu-profiler_1}

Voici un exemple montrant comment utiliser le [Profileur CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler) :

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Invoquer la logique métier en cours de mesure ici...

    // quelque temps plus tard...
    session.post('Profiler.stop', (err, { profile }) => {
      // Ecrire le profil sur le disque, le télécharger, etc.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### Profileur de tas {#heap-profiler_1}

Voici un exemple montrant comment utiliser le [Profileur de tas](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler) :

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## Objets Communs {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.10.0 | L'API est exposée dans les threads worker. |
| v9.0.0 | Ajouté dans : v9.0.0 |
:::

Tente de fermer toutes les connexions restantes, bloquant la boucle d'événements jusqu'à ce que toutes soient fermées. Une fois toutes les connexions fermées, désactive l'inspecteur.

### `inspector.console` {#inspectorconsole}

- [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet pour envoyer des messages à la console de l'inspecteur distant.

```js [ESM]
require('node:inspector').console.log('a message');
```
La console de l'inspecteur n'a pas la parité d'API avec la console Node.js.


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.6.0 | inspector.open() renvoie maintenant un objet `Disposable`. |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port d'écoute pour les connexions de l'inspecteur. Optionnel. **Par défaut :** ce qui a été spécifié sur la CLI.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hôte d'écoute pour les connexions de l'inspecteur. Optionnel. **Par défaut :** ce qui a été spécifié sur la CLI.
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Bloquer jusqu'à ce qu'un client soit connecté. Optionnel. **Par défaut :** `false`.
- Retourne : [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Un Disposable qui appelle [`inspector.close()`](/fr/nodejs/api/inspector#inspectorclose).

Active l'inspecteur sur l'hôte et le port. Équivalent à `node --inspect=[[host:]port]`, mais peut être fait par programme après que node a démarré.

Si wait est `true`, bloquera jusqu'à ce qu'un client se soit connecté au port d'inspection et que le contrôle de flux ait été transmis au client du débogueur.

Voir l'[avertissement de sécurité](/fr/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) concernant l'utilisation du paramètre `host`.

### `inspector.url()` {#inspectorurl}

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Retourne l'URL de l'inspecteur actif, ou `undefined` s'il n'y en a pas.

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**Ajouté dans : v12.7.0**

Bloque jusqu'à ce qu'un client (existant ou connecté ultérieurement) ait envoyé la commande `Runtime.runIfWaitingForDebugger`.

Une exception sera levée s'il n'y a pas d'inspecteur actif.

## Intégration avec les DevTools {#integration-with-devtools}

Le module `node:inspector` fournit une API pour l'intégration avec les outils de développement qui prennent en charge le protocole Chrome DevTools. Les interfaces DevTools connectées à une instance Node.js en cours d'exécution peuvent capturer les événements de protocole émis par l'instance et les afficher en conséquence pour faciliter le débogage. Les méthodes suivantes diffusent un événement de protocole à toutes les interfaces connectées. Les `params` passés aux méthodes peuvent être facultatifs, selon le protocole.

```js [ESM]
// L'événement `Network.requestWillBeSent` sera déclenché.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**Ajouté dans : v22.6.0, v20.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Cette fonctionnalité est uniquement disponible avec l'indicateur `--experimental-network-inspection` activé.

Diffuse l'événement `Network.requestWillBeSent` aux interfaces connectées. Cet événement indique que l'application est sur le point d'envoyer une requête HTTP.

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**Ajouté dans : v22.6.0, v20.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Cette fonctionnalité est uniquement disponible avec l'indicateur `--experimental-network-inspection` activé.

Diffuse l'événement `Network.responseReceived` aux interfaces connectées. Cet événement indique qu'une réponse HTTP est disponible.


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Ajouté dans: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Cette fonctionnalité est uniquement disponible avec l'indicateur `--experimental-network-inspection` activé.

Diffuse l'événement `Network.loadingFinished` aux frontaux connectés. Cet événement indique que le chargement de la requête HTTP est terminé.

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Ajouté dans: v22.7.0, v20.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Cette fonctionnalité est uniquement disponible avec l'indicateur `--experimental-network-inspection` activé.

Diffuse l'événement `Network.loadingFailed` aux frontaux connectés. Cet événement indique que le chargement de la requête HTTP a échoué.

## Support des points d'arrêt {#support-of-breakpoints}

Le [`Debugger` domain](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) du protocole Chrome DevTools permet à une `inspector.Session` de s'attacher à un programme et de définir des points d'arrêt pour parcourir les codes.

Cependant, la définition de points d'arrêt avec une `inspector.Session` du même thread, qui est connectée par [`session.connect()`](/fr/nodejs/api/inspector#sessionconnect), doit être évitée car le programme auquel on s'attache et que l'on met en pause est précisément le débogueur lui-même. Essayez plutôt de vous connecter au thread principal via [`session.connectToMainThread()`](/fr/nodejs/api/inspector#sessionconnecttomainthread) et de définir des points d'arrêt dans un thread worker, ou connectez-vous avec un programme [Debugger](/fr/nodejs/api/debugger) via une connexion WebSocket.

