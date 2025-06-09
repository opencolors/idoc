---
title: Canal de Diagnostic Node.js
description: Le module Canal de Diagnostic dans Node.js fournit une API pour créer, publier et s'abonner à des canaux nommés d'informations de diagnostic, permettant une meilleure surveillance et débogage des applications.
head:
  - - meta
    - name: og:title
      content: Canal de Diagnostic Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Canal de Diagnostic dans Node.js fournit une API pour créer, publier et s'abonner à des canaux nommés d'informations de diagnostic, permettant une meilleure surveillance et débogage des applications.
  - - meta
    - name: twitter:title
      content: Canal de Diagnostic Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Canal de Diagnostic dans Node.js fournit une API pour créer, publier et s'abonner à des canaux nommés d'informations de diagnostic, permettant une meilleure surveillance et débogage des applications.
---


# Canal de diagnostics {#diagnostics-channel}

::: info [Historique]
| Version        | Modifications                                      |
| :------------- | :------------------------------------------------- |
| v19.2.0, v18.13.0 | `diagnostics_channel` est maintenant Stable.    |
| v15.1.0, v14.17.0 | Ajouté dans : v15.1.0, v14.17.0                   |
:::

::: tip [Stable: 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

Le module `node:diagnostics_channel` fournit une API pour créer des canaux nommés afin de signaler des données de message arbitraires à des fins de diagnostic.

Il est accessible en utilisant :

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

Il est prévu qu'un auteur de module souhaitant signaler des messages de diagnostic crée un ou plusieurs canaux de niveau supérieur pour signaler les messages. Les canaux peuvent également être acquis au moment de l'exécution, mais cela n'est pas encouragé en raison de la surcharge supplémentaire que cela représente. Les canaux peuvent être exportés pour plus de commodité, mais tant que le nom est connu, il peut être acquis n'importe où.

Si vous avez l'intention que votre module produise des données de diagnostic que d'autres pourront utiliser, il est recommandé d'inclure la documentation des canaux nommés utilisés ainsi que la forme des données du message. Les noms de canaux doivent généralement inclure le nom du module pour éviter les collisions avec les données d'autres modules.

## API publique {#public-api}

### Aperçu {#overview}

Voici un simple aperçu de l'API publique.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// Obtenir un objet de canal réutilisable
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Données reçues
}

// S'abonner au canal
diagnostics_channel.subscribe('my-channel', onMessage);

// Vérifier si le canal a un abonné actif
if (channel.hasSubscribers) {
  // Publier les données sur le canal
  channel.publish({
    some: 'data',
  });
}

// Se désabonner du canal
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// Obtenir un objet de canal réutilisable
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Données reçues
}

// S'abonner au canal
diagnostics_channel.subscribe('my-channel', onMessage);

// Vérifier si le canal a un abonné actif
if (channel.hasSubscribers) {
  // Publier les données sur le canal
  channel.publish({
    some: 'data',
  });
}

// Se désabonner du canal
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**Ajouté dans: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom du canal
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) S'il y a des abonnés actifs

Vérifie s'il y a des abonnés actifs au canal nommé. Ceci est utile si le message que vous souhaitez envoyer peut être coûteux à préparer.

Cette API est facultative, mais utile lorsque vous essayez de publier des messages à partir d'un code très sensible aux performances.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Il y a des abonnés, préparer et publier le message
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Il y a des abonnés, préparer et publier le message
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**Ajouté dans: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom du canal
- Retourne : [\<Channel\>](/fr/nodejs/api/diagnostics_channel#class-channel) L'objet de canal nommé

Il s'agit du point d'entrée principal pour tous ceux qui souhaitent publier sur un canal nommé. Il produit un objet de canal qui est optimisé pour réduire autant que possible la surcharge au moment de la publication.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**Ajouté dans : v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom du canal
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le gestionnaire pour recevoir les messages du canal
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Les données du message
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom du canal
  
 

Enregistre un gestionnaire de messages pour s'abonner à ce canal. Ce gestionnaire de messages sera exécuté de manière synchrone chaque fois qu'un message sera publié sur le canal. Toutes les erreurs lancées dans le gestionnaire de messages déclencheront une [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Données reçues
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Données reçues
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**Ajouté dans : v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom du canal
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le gestionnaire précédemment abonné à supprimer
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le gestionnaire a été trouvé, `false` sinon.

Supprime un gestionnaire de messages précédemment enregistré sur ce canal avec [`diagnostics_channel.subscribe(name, onMessage)`](/fr/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/fr/nodejs/api/diagnostics_channel#class-tracingchannel) Nom du canal ou objet contenant tous les [Canaux TracingChannel](/fr/nodejs/api/diagnostics_channel#tracingchannel-channels)
- Retourne : [\<TracingChannel\>](/fr/nodejs/api/diagnostics_channel#class-tracingchannel) Collection de canaux à tracer avec

Crée un wrapper [`TracingChannel`](/fr/nodejs/api/diagnostics_channel#class-tracingchannel) pour les [Canaux TracingChannel](/fr/nodejs/api/diagnostics_channel#tracingchannel-channels) donnés. Si un nom est donné, les canaux de traçage correspondants seront créés sous la forme `tracing:${name}:${eventType}` où `eventType` correspond aux types de [Canaux TracingChannel](/fr/nodejs/api/diagnostics_channel#tracingchannel-channels).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### Classe : `Channel` {#class-channel}

**Ajoutée dans : v15.1.0, v14.17.0**

La classe `Channel` représente un canal nommé individuel au sein du pipeline de données. Elle est utilisée pour suivre les abonnés et pour publier des messages lorsque des abonnés sont présents. Elle existe en tant qu’objet distinct pour éviter les recherches de canal au moment de la publication, ce qui permet des vitesses de publication très rapides et une utilisation intensive tout en entraînant des coûts minimes. Les canaux sont créés avec [`diagnostics_channel.channel(name)`](/fr/nodejs/api/diagnostics_channel#diagnostics_channelchannelname), la construction d’un canal directement avec `new Channel(name)` n’est pas prise en charge.

#### `channel.hasSubscribers` {#channelhassubscribers}

**Ajoutée dans : v15.1.0, v14.17.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) S’il y a des abonnés actifs

Vérifiez s’il y a des abonnés actifs à ce canal. Ceci est utile si le message que vous souhaitez envoyer peut être coûteux à préparer.

Cette API est facultative mais utile lorsque vous essayez de publier des messages à partir de code très sensible aux performances.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // Il y a des abonnés, préparer et publier le message
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // Il y a des abonnés, préparer et publier le message
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**Ajoutée dans : v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Types_de_donn%C3%A9es) Le message à envoyer aux abonnés du canal

Publier un message à tous les abonnés au canal. Cela déclenchera les gestionnaires de messages de manière synchrone afin qu’ils s’exécutent dans le même contexte.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**Ajouté dans : v15.1.0, v14.17.0**

**Obsolète depuis : v18.7.0, v16.17.0**

::: danger [Stable: 0 - Obsolète]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Obsolète : Utilisez [`diagnostics_channel.subscribe(name, onMessage)`](/fr/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le gestionnaire pour recevoir les messages du canal
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Les données du message
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom du canal
  
 

Enregistrez un gestionnaire de messages pour vous abonner à ce canal. Ce gestionnaire de messages sera exécuté de manière synchrone chaque fois qu'un message sera publié sur le canal. Toute erreur levée dans le gestionnaire de messages déclenchera un [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.7.0, v16.17.0 | Obsolète depuis : v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | Ajout d'une valeur de retour. Ajouté aux canaux sans abonnés. |
| v15.1.0, v14.17.0 | Ajouté dans : v15.1.0, v14.17.0 |
:::

::: danger [Stable: 0 - Obsolète]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Obsolète : Utilisez [`diagnostics_channel.unsubscribe(name, onMessage)`](/fr/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le gestionnaire précédemment abonné à supprimer
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le gestionnaire a été trouvé, `false` sinon.

Supprimez un gestionnaire de messages précédemment enregistré sur ce canal avec [`channel.subscribe(onMessage)`](/fr/nodejs/api/diagnostics_channel#channelsubscribeonmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `store` [\<AsyncLocalStorage\>](/fr/nodejs/api/async_context#class-asynclocalstorage) Le store auquel lier les données de contexte
- `transform` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Transforme les données de contexte avant de définir le contexte du store.

Lorsque [`channel.runStores(context, ...)`](/fr/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) est appelé, les données de contexte fournies sont appliquées à tout store lié au canal. Si le store a déjà été lié, la fonction `transform` précédente est remplacée par la nouvelle. La fonction `transform` peut être omise pour définir directement les données de contexte fournies comme contexte.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `store` [\<AsyncLocalStorage\>](/fr/nodejs/api/async_context#class-asynclocalstorage) Le store à dissocier du canal.
- Returns: [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le store a été trouvé, `false` sinon.

Supprime un gestionnaire de messages précédemment enregistré auprès de ce canal avec [`channel.bindStore(store)`](/fr/nodejs/api/diagnostics_channel#channelbindstorestore-transform).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Message à envoyer aux abonnés et à lier aux magasins
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Gestionnaire à exécuter dans le contexte de stockage saisi
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Le récepteur à utiliser pour l'appel de fonction.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Arguments optionnels à passer à la fonction.

Applique les données fournies à toutes les instances AsyncLocalStorage liées au canal pendant la durée de la fonction donnée, puis publie sur le canal dans la portée de ces données appliquées aux magasins.

Si une fonction de transformation a été donnée à [`channel.bindStore(store)`](/fr/nodejs/api/diagnostics_channel#channelbindstorestore-transform), elle sera appliquée pour transformer les données du message avant qu'elles ne deviennent la valeur de contexte pour le magasin. Le contexte de stockage précédent est accessible depuis la fonction de transformation dans les cas où une liaison de contexte est requise.

Le contexte appliqué au magasin doit être accessible dans tout code asynchrone qui continue à partir de l'exécution qui a commencé pendant la fonction donnée, mais il existe des situations dans lesquelles une [perte de contexte](/fr/nodejs/api/async_context#troubleshooting-context-loss) peut se produire.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### Classe : `TracingChannel` {#class-tracingchannel}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

La classe `TracingChannel` est une collection de [Canaux TracingChannel](/fr/nodejs/api/diagnostics_channel#tracingchannel-channels) qui expriment ensemble une seule action traçable. Elle est utilisée pour formaliser et simplifier le processus de production d'événements pour le traçage du flux d'application. [`diagnostics_channel.tracingChannel()`](/fr/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) est utilisé pour construire un `TracingChannel`. Comme avec `Channel`, il est recommandé de créer et de réutiliser un seul `TracingChannel` au niveau supérieur du fichier plutôt que de les créer dynamiquement.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `subscribers` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ensemble d'abonnés [Canaux TracingChannel](/fr/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Fonction\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement start`](/fr/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Fonction\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement end`](/fr/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Fonction\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement asyncStart`](/fr/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Fonction\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement asyncEnd`](/fr/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Fonction\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement error`](/fr/nodejs/api/diagnostics_channel#errorevent)
  
 

Aide à abonner une collection de fonctions aux canaux correspondants. Cela revient à appeler [`channel.subscribe(onMessage)`](/fr/nodejs/api/diagnostics_channel#channelsubscribeonmessage) sur chaque canal individuellement.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ensemble d'abonnés aux [Canaux TracingChannel](/fr/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement start`](/fr/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement end`](/fr/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement asyncStart`](/fr/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement asyncEnd`](/fr/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) L'abonné à l'[`événement error`](/fr/nodejs/api/diagnostics_channel#errorevent)
  
 
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si tous les gestionnaires ont été désabonnés avec succès, et `false` sinon.

Assistant pour désabonner une collection de fonctions des canaux correspondants. Ceci est identique à l'appel de [`channel.unsubscribe(onMessage)`](/fr/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) sur chaque canal individuellement.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction autour de laquelle créer un trace
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objet partagé pour corréler les événements
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Le receveur à utiliser pour l'appel de fonction
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Arguments optionnels à passer à la fonction
- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La valeur de retour de la fonction donnée

Trace un appel de fonction synchrone. Cela produira toujours un [`start` événement](/fr/nodejs/api/diagnostics_channel#startevent) et un [`end` événement](/fr/nodejs/api/diagnostics_channel#endevent) autour de l'exécution et peut produire un [`error` événement](/fr/nodejs/api/diagnostics_channel#errorevent) si la fonction donnée lève une erreur. Cela exécutera la fonction donnée en utilisant [`channel.runStores(context, ...)`](/fr/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) sur le canal `start`, ce qui garantit que tous les événements doivent avoir des magasins liés définis pour correspondre à ce contexte de trace.

Pour garantir que seuls des graphes de trace corrects sont formés, les événements ne seront publiés que si des abonnés sont présents avant le démarrage de la trace. Les abonnements qui sont ajoutés après le début de la trace ne recevront pas les événements futurs de cette trace, seules les traces futures seront vues.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction renvoyant une Promise pour encapsuler une trace
- `context` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Objet partagé pour corréler les événements de trace
- `thisArg` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Le récepteur à utiliser pour l’appel de fonction
- `...args` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Arguments optionnels à passer à la fonction
- Returns: [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Chaînée à partir de la promesse renvoyée par la fonction donnée

Trace un appel de fonction renvoyant une promesse. Cela produira toujours un événement [`start` event](/fr/nodejs/api/diagnostics_channel#startevent) et un événement [`end` event](/fr/nodejs/api/diagnostics_channel#endevent) autour de la partie synchrone de l’exécution de la fonction, et produira un événement [`asyncStart` event](/fr/nodejs/api/diagnostics_channel#asyncstartevent) et un événement [`asyncEnd` event](/fr/nodejs/api/diagnostics_channel#asyncendevent) lorsqu’une continuation de promesse est atteinte. Cela peut également produire un événement [`error` event](/fr/nodejs/api/diagnostics_channel#errorevent) si la fonction donnée lève une erreur ou si la promesse renvoyée est rejetée. Cela exécutera la fonction donnée en utilisant [`channel.runStores(context, ...)`](/fr/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) sur le canal `start`, ce qui garantit que tous les événements devraient avoir des magasins liés définis pour correspondre à ce contexte de trace.

Pour garantir que seuls des graphes de trace corrects sont formés, les événements ne seront publiés que si des abonnés sont présents avant le démarrage de la trace. Les abonnements qui sont ajoutés après le début de la trace ne recevront pas les événements futurs de cette trace, seules les traces futures seront visibles.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**Ajouté dans : v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback utilisant une fonction pour envelopper un trace
- `position` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Position de l'argument (indexé à zéro) du callback attendu (par défaut, le dernier argument si `undefined` est passé)
- `context` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Objet partagé pour corréler les événements de trace (par défaut `{}` si `undefined` est passé)
- `thisArg` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Le récepteur à utiliser pour l'appel de fonction
- `...args` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) arguments à passer à la fonction (doit inclure le callback)
- Retourne : [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La valeur de retour de la fonction donnée

Trace un appel de fonction recevant un callback. Le callback doit suivre la convention de l'erreur comme premier argument, généralement utilisée. Cela produira toujours un événement [`start` event](/fr/nodejs/api/diagnostics_channel#startevent) et un [`end` event](/fr/nodejs/api/diagnostics_channel#endevent) autour de la partie synchrone de l'exécution de la fonction, et produira un événement [`asyncStart` event](/fr/nodejs/api/diagnostics_channel#asyncstartevent) et un événement [`asyncEnd` event](/fr/nodejs/api/diagnostics_channel#asyncendevent) autour de l'exécution du callback. Il peut également produire un événement [`error` event](/fr/nodejs/api/diagnostics_channel#errorevent) si la fonction donnée lève une exception ou si le premier argument passé au callback est défini. Cela exécutera la fonction donnée en utilisant [`channel.runStores(context, ...)`](/fr/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) sur le canal `start`, ce qui garantit que tous les événements ont tous les magasins liés définis pour correspondre à ce contexte de trace.

Pour garantir que seuls des graphes de trace corrects sont formés, les événements ne seront publiés que si des abonnés sont présents avant le début de la trace. Les abonnements qui sont ajoutés après le début de la trace ne recevront pas les événements futurs de cette trace, seules les traces futures seront visibles.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

Le callback sera également exécuté avec [`channel.runStores(context, ...)`](/fr/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) ce qui permet la récupération de la perte de contexte dans certains cas.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**Ajouté dans : v22.0.0, v20.13.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si l’un des canaux individuels a un abonné, `false` sinon.

Il s’agit d’une méthode d’assistance disponible sur une instance de [`TracingChannel`](/fr/nodejs/api/diagnostics_channel#class-tracingchannel) pour vérifier si l’un des [Canaux TracingChannel](/fr/nodejs/api/diagnostics_channel#tracingchannel-channels) a des abonnés. `true` est renvoyé si l’un d’eux a au moins un abonné, `false` est renvoyé sinon.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```
:::

### Canaux TracingChannel {#tracingchannel-channels}

Un TracingChannel est une collection de plusieurs diagnostics_channels représentant des points spécifiques dans le cycle de vie de l’exécution d’une seule action traçable. Le comportement est divisé en cinq diagnostics_channels comprenant `start`, `end`, `asyncStart`, `asyncEnd` et `error`. Une seule action traçable partagera le même objet d’événement entre tous les événements, ce qui peut être utile pour gérer la corrélation via une weakmap.

Ces objets d’événement seront étendus avec des valeurs `result` ou `error` lorsque la tâche est « terminée ». Dans le cas d’une tâche synchrone, le `result` sera la valeur de retour et l’`error` sera tout ce qui est lancé depuis la fonction. Avec les fonctions asynchrones basées sur un callback, le `result` sera le deuxième argument du callback tandis que l’`error` sera soit une erreur levée visible dans l’événement `end`, soit le premier argument du callback dans l’un des événements `asyncStart` ou `asyncEnd`.

Pour garantir que seuls les graphiques de trace corrects soient formés, les événements ne doivent être publiés que si des abonnés sont présents avant de démarrer la trace. Les abonnements qui sont ajoutés après le début de la trace ne doivent pas recevoir les événements futurs de cette trace, seules les traces futures seront vues.

Les canaux de traçage doivent suivre un modèle de nommage de :

- `tracing:module.class.method:start` ou `tracing:module.function:start`
- `tracing:module.class.method:end` ou `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` ou `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` ou `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` ou `tracing:module.function:error`


#### `start(event)` {#startevent}

- Nom : `tracing:${name}:start`

L’événement `start` représente le moment où une fonction est appelée. À ce stade, les données de l’événement peuvent contenir les arguments de la fonction ou tout autre élément disponible au tout début de l’exécution de la fonction.

#### `end(event)` {#endevent}

- Nom : `tracing:${name}:end`

L’événement `end` représente le moment où un appel de fonction renvoie une valeur. Dans le cas d’une fonction asynchrone, c’est le moment où la promesse est renvoyée, et non le moment où la fonction elle-même effectue une instruction de retour en interne. À ce stade, si la fonction tracée était synchrone, le champ `result` sera défini sur la valeur de retour de la fonction. Le champ `error` peut également être présent pour représenter toute erreur générée.

Il est recommandé d’écouter spécifiquement l’événement `error` pour suivre les erreurs, car il est possible qu’une action traçable produise plusieurs erreurs. Par exemple, une tâche asynchrone qui échoue peut être démarrée en interne avant que la partie synchrone de la tâche ne génère une erreur.

#### `asyncStart(event)` {#asyncstartevent}

- Nom : `tracing:${name}:asyncStart`

L’événement `asyncStart` représente le rappel ou la continuation d’une fonction traçable qui est atteinte. À ce stade, des éléments tels que les arguments de rappel peuvent être disponibles, ou tout autre élément exprimant le « résultat » de l’action.

Pour les fonctions basées sur des rappels, le premier argument du rappel sera attribué au champ `error`, s’il n’est pas `undefined` ou `null`, et le deuxième argument sera attribué au champ `result`.

Pour les promesses, l’argument du chemin `resolve` sera attribué à `result` ou l’argument du chemin `reject` sera attribué à `error`.

Il est recommandé d’écouter spécifiquement l’événement `error` pour suivre les erreurs, car il est possible qu’une action traçable produise plusieurs erreurs. Par exemple, une tâche asynchrone qui échoue peut être démarrée en interne avant que la partie synchrone de la tâche ne génère une erreur.

#### `asyncEnd(event)` {#asyncendevent}

- Nom : `tracing:${name}:asyncEnd`

L’événement `asyncEnd` représente le rappel d’une fonction asynchrone qui renvoie. Il est peu probable que les données de l’événement changent après l’événement `asyncStart`, mais il peut être utile de voir le moment où le rappel se termine.


#### `error(event)` {#errorevent}

- Nom : `tracing:${name}:error`

L’événement `error` représente toute erreur produite par la fonction traçable, que ce soit de manière synchrone ou asynchrone. Si une erreur est levée dans la partie synchrone de la fonction tracée, l’erreur sera affectée au champ `error` de l’événement et l’événement `error` sera déclenché. Si une erreur est reçue de manière asynchrone via un rappel ou un rejet de promesse, elle sera également affectée au champ `error` de l’événement et déclenchera l’événement `error`.

Il est possible qu’un seul appel de fonction traçable produise des erreurs plusieurs fois. Il faut donc en tenir compte lors de la consommation de cet événement. Par exemple, si une autre tâche asynchrone est déclenchée en interne et échoue, puis que la partie synchrone de la fonction lève une erreur, deux événements `error` seront émis, un pour l’erreur synchrone et un pour l’erreur asynchrone.

### Canaux intégrés {#built-in-channels}

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stability : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Bien que l’API diagnostics_channel soit désormais considérée comme stable, les canaux intégrés actuellement disponibles ne le sont pas. Chaque canal doit être déclaré stable indépendamment.

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)

Émis lorsque le client crée un objet de requête. Contrairement à `http.client.request.start`, cet événement est émis avant que la requête n’ait été envoyée.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)

Émis lorsque le client démarre une requête.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Émis lorsqu’une erreur se produit lors d’une requête client.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)

Émis lorsque le client reçoit une réponse.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/fr/nodejs/api/http#class-httpserver)

Émis lorsque le serveur reçoit une requête.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)

Émis lorsque le serveur crée une réponse. L’événement est émis avant que la réponse ne soit envoyée.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/fr/nodejs/api/http#class-httpserver)

Émis lorsque le serveur envoie une réponse.


#### Modules {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant les propriétés suivantes :
    - `id` - Argument passé à `require()`. Nom du module.
    - `parentFilename` - Nom du module qui a tenté d'exécuter require(id).
  
 

Émis quand `require()` est exécuté. Voir l'événement [`start`](/fr/nodejs/api/diagnostics_channel#startevent).

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant les propriétés suivantes :
    - `id` - Argument passé à `require()`. Nom du module.
    - `parentFilename` - Nom du module qui a tenté d'exécuter require(id).
  
 

Émis quand un appel à `require()` retourne. Voir l'événement [`end`](/fr/nodejs/api/diagnostics_channel#endevent).

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant les propriétés suivantes :
    - `id` - Argument passé à `require()`. Nom du module.
    - `parentFilename` - Nom du module qui a tenté d'exécuter require(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Émis quand `require()` lève une erreur. Voir l'événement [`error`](/fr/nodejs/api/diagnostics_channel#errorevent).

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant les propriétés suivantes :
    - `id` - Argument passé à `import()`. Nom du module.
    - `parentURL` - Objet URL du module qui a tenté d'exécuter import(id).
  
 

Émis quand `import()` est invoqué. Voir l'événement [`asyncStart`](/fr/nodejs/api/diagnostics_channel#asyncstartevent).

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant les propriétés suivantes :
    - `id` - Argument passé à `import()`. Nom du module.
    - `parentURL` - Objet URL du module qui a tenté d'exécuter import(id).
  
 

Émis quand `import()` est terminé. Voir l'événement [`asyncEnd`](/fr/nodejs/api/diagnostics_channel#asyncendevent).

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant les propriétés suivantes :
    - `id` - Argument passé à `import()`. Nom du module.
    - `parentURL` - Objet URL du module qui a tenté d'exécuter import(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Émis quand `import()` lève une erreur. Voir l'événement [`error`](/fr/nodejs/api/diagnostics_channel#errorevent).


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Émis lorsqu'un nouveau socket client TCP ou pipe est créé.

`net.server.socket`

- `socket` [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Émis lorsqu'une nouvelle connexion TCP ou pipe est reçue.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/fr/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Émis lorsque [`net.Server.listen()`](/fr/nodejs/api/net#serverlisten) est invoqué, avant que le port ou le pipe ne soit réellement configuré.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Émis lorsque [`net.Server.listen()`](/fr/nodejs/api/net#serverlisten) est terminé et que le serveur est donc prêt à accepter les connexions.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/fr/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Émis lorsque [`net.Server.listen()`](/fr/nodejs/api/net#serverlisten) renvoie une erreur.

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/fr/nodejs/api/dgram#class-dgramsocket)

Émis lorsqu'un nouveau socket UDP est créé.

#### Processus {#process}

**Ajouté dans : v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/fr/nodejs/api/child_process#class-childprocess)

Émis lorsqu'un nouveau processus est créé.

#### Thread de travail {#worker-thread}

**Ajouté dans : v16.18.0**

`worker_threads`

- `worker` [`Worker`](/fr/nodejs/api/worker_threads#class-worker)

Émis lorsqu'un nouveau thread est créé.

