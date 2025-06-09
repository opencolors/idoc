---
title: Documentation Node.js - Événements
description: Découvrez le module Événements dans Node.js, qui permet de gérer les opérations asynchrones via la programmation orientée événements. Apprenez sur les émetteurs d'événements, les écouteurs et comment gérer efficacement les événements.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Événements | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez le module Événements dans Node.js, qui permet de gérer les opérations asynchrones via la programmation orientée événements. Apprenez sur les émetteurs d'événements, les écouteurs et comment gérer efficacement les événements.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Événements | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez le module Événements dans Node.js, qui permet de gérer les opérations asynchrones via la programmation orientée événements. Apprenez sur les émetteurs d'événements, les écouteurs et comment gérer efficacement les événements.
---


# Événements {#events}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

Une grande partie de l’API principale de Node.js est construite autour d’une architecture asynchrone et événementielle idiomatique dans laquelle certains types d’objets (appelés « émetteurs ») émettent des événements nommés qui entraînent l’appel d’objets `Function` (« écouteurs »).

Par exemple : un objet [`net.Server`](/fr/nodejs/api/net#class-netserver) émet un événement chaque fois qu’un pair s’y connecte ; un [`fs.ReadStream`](/fr/nodejs/api/fs#class-fsreadstream) émet un événement lorsque le fichier est ouvert ; un [flux](/fr/nodejs/api/stream) émet un événement chaque fois que des données sont disponibles pour être lues.

Tous les objets qui émettent des événements sont des instances de la classe `EventEmitter`. Ces objets exposent une fonction `eventEmitter.on()` qui permet d’attacher une ou plusieurs fonctions aux événements nommés émis par l’objet. En règle générale, les noms d’événements sont des chaînes en camelCase, mais toute clé de propriété JavaScript valide peut être utilisée.

Lorsque l’objet `EventEmitter` émet un événement, toutes les fonctions attachées à cet événement spécifique sont appelées *synchroniquement*. Toutes les valeurs renvoyées par les écouteurs appelés sont *ignorées* et rejetées.

L’exemple suivant montre une instance simple de `EventEmitter` avec un seul écouteur. La méthode `eventEmitter.on()` est utilisée pour enregistrer les écouteurs, tandis que la méthode `eventEmitter.emit()` est utilisée pour déclencher l’événement.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```
:::

## Transmettre des arguments et `this` aux écouteurs {#passing-arguments-and-this-to-listeners}

La méthode `eventEmitter.emit()` permet de transmettre un ensemble arbitraire d’arguments aux fonctions d’écoute. Gardez à l’esprit que lorsqu’une fonction d’écoute ordinaire est appelée, le mot-clé standard `this` est intentionnellement défini pour faire référence à l’instance `EventEmitter` à laquelle l’écouteur est attaché.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```
:::

Il est possible d’utiliser les fonctions fléchées ES6 comme écouteurs, cependant, dans ce cas, le mot-clé `this` ne fera plus référence à l’instance `EventEmitter` :

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b undefined
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
:::


## Asynchrone vs. synchrone {#asynchronous-vs-synchronous}

L'`EventEmitter` appelle tous les écouteurs de manière synchrone dans l'ordre dans lequel ils ont été enregistrés. Cela garantit la bonne séquence des événements et permet d'éviter les conditions de concurrence et les erreurs logiques. Le cas échéant, les fonctions d'écoute peuvent passer à un mode de fonctionnement asynchrone en utilisant les méthodes `setImmediate()` ou `process.nextTick()` :

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## Gérer les événements une seule fois {#handling-events-only-once}

Lorsqu'un écouteur est enregistré à l'aide de la méthode `eventEmitter.on()`, cet écouteur est invoqué *chaque fois* que l'événement nommé est émis.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```
:::

En utilisant la méthode `eventEmitter.once()`, il est possible d'enregistrer un écouteur qui est appelé au plus une fois pour un événement particulier. Une fois l'événement émis, l'écouteur est désenregistré et *ensuite* appelé.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
:::


## Événements d'erreur {#error-events}

Lorsqu'une erreur se produit dans une instance `EventEmitter`, l'action typique est d'émettre un événement `'error'`. Ceux-ci sont traités comme des cas particuliers dans Node.js.

Si un `EventEmitter` n'a *pas* au moins un écouteur enregistré pour l'événement `'error'`, et qu'un événement `'error'` est émis, l'erreur est levée, une trace de pile est imprimée, et le processus Node.js se termine.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Lance une erreur et fait planter Node.js
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Lance une erreur et fait planter Node.js
```
:::

Pour se prémunir contre le plantage du processus Node.js, le module [`domain`](/fr/nodejs/api/domain) peut être utilisé. (Notez cependant que le module `node:domain` est déprécié.)

En guise de bonne pratique, des écouteurs doivent toujours être ajoutés pour les événements `'error'`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Affiche : whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Affiche : whoops! there was an error
```
:::

Il est possible de surveiller les événements `'error'` sans consommer l'erreur émise en installant un écouteur à l'aide du symbole `events.errorMonitor`.

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Lance toujours une erreur et fait planter Node.js
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Lance toujours une erreur et fait planter Node.js
```
:::


## Capture des rejets de promesses {#capture-rejections-of-promises}

L'utilisation de fonctions `async` avec des gestionnaires d'événements est problématique, car elle peut entraîner un rejet non géré en cas d'exception levée :

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```
:::

L'option `captureRejections` dans le constructeur `EventEmitter` ou le paramètre global modifie ce comportement, en installant un gestionnaire `.then(undefined, handler)` sur la `Promise`. Ce gestionnaire achemine l'exception de manière asynchrone vers la méthode [`Symbol.for('nodejs.rejection')`](/fr/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) s'il y en a une, ou vers le gestionnaire d'événement [`'error'`](/fr/nodejs/api/events#error-events) s'il n'y en a pas.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```js [CJS]
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```
:::

Définir `events.captureRejections = true` modifiera la valeur par défaut pour toutes les nouvelles instances de `EventEmitter`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```js [CJS]
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```
:::

Les événements `'error'` qui sont générés par le comportement `captureRejections` n'ont pas de gestionnaire catch pour éviter les boucles d'erreur infinies : la recommandation est de **ne pas utiliser les fonctions <code>async</code> comme gestionnaires d'événements <code>'error'</code>**.


## Classe : `EventEmitter` {#class-eventemitter}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.4.0, v12.16.0 | Ajout de l’option captureRejections. |
| v0.1.26 | Ajouté dans : v0.1.26 |
:::

La classe `EventEmitter` est définie et exposée par le module `node:events` :

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

Tous les `EventEmitter` émettent l’événement `'newListener'` lorsque de nouveaux auditeurs sont ajoutés et `'removeListener'` lorsque des auditeurs existants sont supprimés.

Elle prend en charge l’option suivante :

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Elle permet la [capture automatique du rejet de promesse](/fr/nodejs/api/events#capture-rejections-of-promises). **Par défaut :** `false`.

### Événement : `'newListener'` {#event-newlistener}

**Ajouté dans : v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom de l’événement écouté
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de gestion d’événements

L’instance `EventEmitter` émettra son propre événement `'newListener'` *avant* qu’un auditeur ne soit ajouté à son tableau interne d’auditeurs.

Les auditeurs enregistrés pour l’événement `'newListener'` reçoivent le nom de l’événement et une référence à l’auditeur en cours d’ajout.

Le fait que l’événement soit déclenché avant d’ajouter l’auditeur a un effet secondaire subtil mais important : tout auditeur *supplémentaire* enregistré pour le même `name` *dans* le rappel `'newListener'` est inséré *avant* l’auditeur en cours d’ajout.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// À faire une seule fois pour ne pas boucler indéfiniment
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insérer un nouvel auditeur devant
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Affiche :
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// À faire une seule fois pour ne pas boucler indéfiniment
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insérer un nouvel auditeur devant
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Affiche :
//   B
//   A
```
:::

### Événement : `'removeListener'` {#event-removelistener}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.1.0, v4.7.0 | Pour les écouteurs attachés en utilisant `.once()`, l'argument `listener` renvoie maintenant la fonction d'écoute d'origine. |
| v0.9.3 | Ajouté dans : v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<symbol\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Symbol) Le nom de l’événement.
- `listener` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de gestionnaire d’événements.

L'événement `'removeListener'` est émis *après* que le `listener` est supprimé.

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**Ajouté dans : v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<symbol\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- `listener` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)

Alias pour `emitter.on(eventName, listener)`.

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**Ajouté dans : v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<symbol\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- `...args` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean)

Appelle de manière synchrone chacun des écouteurs enregistrés pour l’événement nommé `eventName`, dans l’ordre dans lequel ils ont été enregistrés, en transmettant les arguments fournis à chacun.

Retourne `true` si l’événement avait des écouteurs, `false` sinon.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// Premier écouteur
myEmitter.on('event', function firstListener() {
  console.log('Helloooo ! premier écouteur');
});
// Deuxième écouteur
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`événement avec les paramètres ${arg1}, ${arg2} dans le deuxième écouteur`);
});
// Troisième écouteur
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`événement avec les paramètres ${parameters} dans le troisième écouteur`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! premier écouteur
// événement avec les paramètres 1, 2 dans le deuxième écouteur
// événement avec les paramètres 1, 2, 3, 4, 5 dans le troisième écouteur
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// Premier écouteur
myEmitter.on('event', function firstListener() {
  console.log('Helloooo ! premier écouteur');
});
// Deuxième écouteur
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`événement avec les paramètres ${arg1}, ${arg2} dans le deuxième écouteur`);
});
// Troisième écouteur
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`événement avec les paramètres ${parameters} dans le troisième écouteur`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! premier écouteur
// événement avec les paramètres 1, 2 dans le deuxième écouteur
// événement avec les paramètres 1, 2, 3, 4, 5 dans le troisième écouteur
```
:::


### `emitter.eventNames()` {#emittereventnames}

**Ajoutée dans : v6.0.0**

- Retourne : [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Retourne un tableau listant les événements pour lesquels l'émetteur a enregistré des auditeurs. Les valeurs du tableau sont des chaînes ou des `Symbol`s.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Affiche : [ 'foo', 'bar', Symbol(symbol) ]
```

```js [CJS]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Affiche : [ 'foo', 'bar', Symbol(symbol) ]
```
:::

### `emitter.getMaxListeners()` {#emittergetmaxlisteners}

**Ajoutée dans : v1.0.0**

- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne la valeur maximale actuelle de l'auditeur pour l'`EventEmitter` qui est soit définie par [`emitter.setMaxListeners(n)`](/fr/nodejs/api/events#emittersetmaxlistenersn) ou est par défaut [`events.defaultMaxListeners`](/fr/nodejs/api/events#eventsdefaultmaxlisteners).

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.8.0, v18.16.0 | Ajout de l'argument `listener`. |
| v3.2.0 | Ajoutée dans : v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) : le nom de l’événement écouté.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) : la fonction de gestion des événements.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne le nombre d’auditeurs qui écoutent l’événement nommé `eventName`. Si `listener` est fourni, il renverra le nombre de fois où l’auditeur est trouvé dans la liste des auditeurs de l’événement.


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.0.0 | Pour les listeners attachés en utilisant `.once()`, cela renvoie maintenant les listeners originaux au lieu des fonctions wrapper. |
| v0.1.26 | Ajouté dans : v0.1.26 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Retourne : [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Retourne une copie du tableau des listeners pour l'événement nommé `eventName`.

```js [ESM]
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**Ajouté dans : v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Alias de [`emitter.removeListener()`](/fr/nodejs/api/events#emitterremovelistenereventname-listener).

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**Ajouté dans : v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom de l'événement.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de callback
- Retourne : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Ajoute la fonction `listener` à la fin du tableau des listeners pour l'événement nommé `eventName`. Aucune vérification n'est effectuée pour voir si le `listener` a déjà été ajouté. Plusieurs appels passant la même combinaison de `eventName` et `listener` entraîneront l'ajout et l'appel du `listener` plusieurs fois.

```js [ESM]
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```
Retourne une référence à `EventEmitter`, afin que les appels puissent être chaînés.

Par défaut, les listeners d'événements sont invoqués dans l'ordre dans lequel ils sont ajoutés. La méthode `emitter.prependListener()` peut être utilisée comme alternative pour ajouter le listener d'événements au début du tableau des listeners.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**Ajouté dans : v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom de l'événement.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de rappel
- Retourne : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Ajoute une fonction `listener` **à exécution unique** pour l'événement nommé `eventName`. La prochaine fois que `eventName` est déclenché, ce listener est supprimé puis invoqué.

```js [ESM]
server.once('connection', (stream) => {
  console.log('Ah, nous avons notre premier utilisateur !');
});
```
Retourne une référence à l' `EventEmitter`, afin que les appels puissent être chaînés.

Par défaut, les listeners d'événements sont invoqués dans l'ordre dans lequel ils sont ajoutés. La méthode `emitter.prependOnceListener()` peut être utilisée comme alternative pour ajouter le listener d'événement au début du tableau des listeners.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**Ajouté dans : v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom de l'événement.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de rappel
- Retourne : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Ajoute la fonction `listener` au *début* du tableau des listeners pour l'événement nommé `eventName`. Aucune vérification n'est effectuée pour voir si le `listener` a déjà été ajouté. Plusieurs appels passant la même combinaison de `eventName` et `listener` entraîneront l'ajout et l'appel du `listener` plusieurs fois.

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('quelqu'un s'est connecté !');
});
```
Retourne une référence à l' `EventEmitter`, afin que les appels puissent être chaînés.


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**Ajouté dans: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom de l’événement.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de rappel
- Retourne : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Ajoute une fonction `listener` **à usage unique** pour l’événement nommé `eventName` au *début* du tableau des auditeurs. La prochaine fois que `eventName` est déclenché, cet auditeur est supprimé, puis invoqué.

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```
Retourne une référence à l’`EventEmitter`, afin que les appels puissent être chaînés.

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**Ajouté dans: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Retourne : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Supprime tous les auditeurs, ou ceux de l’`eventName` spécifié.

C’est une mauvaise pratique de supprimer des auditeurs ajoutés ailleurs dans le code, en particulier lorsque l’instance `EventEmitter` a été créée par un autre composant ou module (par exemple, les sockets ou les flux de fichiers).

Retourne une référence à l’`EventEmitter`, afin que les appels puissent être chaînés.

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**Ajouté dans: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Supprime le `listener` spécifié du tableau des auditeurs pour l’événement nommé `eventName`.

```js [ESM]
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()` supprimera, au maximum, une instance d’un auditeur du tableau d’auditeurs. Si un seul auditeur a été ajouté plusieurs fois au tableau d’auditeurs pour l’`eventName` spécifié, alors `removeListener()` doit être appelé plusieurs fois pour supprimer chaque instance.

Une fois qu’un événement est émis, tous les auditeurs qui y sont attachés au moment de l’émission sont appelés dans l’ordre. Cela implique que tout appel `removeListener()` ou `removeAllListeners()` *après* l’émission et *avant* que le dernier auditeur ne termine son exécution ne les supprimera pas de `emit()` en cours. Les événements suivants se comportent comme prévu.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA supprime l’auditeur callbackB mais il sera toujours appelé.
// Tableau interne des auditeurs au moment de l’émission [callbackA, callbackB]
myEmitter.emit('event');
// Affiche :
//   A
//   B

// callbackB est maintenant supprimé.
// Tableau interne des auditeurs [callbackA]
myEmitter.emit('event');
// Affiche :
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA supprime l’auditeur callbackB mais il sera toujours appelé.
// Tableau interne des auditeurs au moment de l’émission [callbackA, callbackB]
myEmitter.emit('event');
// Affiche :
//   A
//   B

// callbackB est maintenant supprimé.
// Tableau interne des auditeurs [callbackA]
myEmitter.emit('event');
// Affiche :
//   A
```
:::

Comme les auditeurs sont gérés à l’aide d’un tableau interne, l’appel de cette fonction modifiera les index de position de tout auditeur enregistré *après* l’auditeur en cours de suppression. Cela n’aura pas d’incidence sur l’ordre dans lequel les auditeurs sont appelés, mais cela signifie que toutes les copies du tableau d’auditeurs telles que renvoyées par la méthode `emitter.listeners()` devront être recréées.

Lorsqu’une seule fonction a été ajoutée en tant que gestionnaire plusieurs fois pour un seul événement (comme dans l’exemple ci-dessous), `removeListener()` supprimera l’instance ajoutée le plus récemment. Dans l’exemple, l’auditeur `once('ping')` est supprimé :

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```
:::

Retourne une référence à l’`EventEmitter`, afin que les appels puissent être chaînés.


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**Ajouté dans : v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Par défaut, les `EventEmitter` affichent un avertissement si plus de `10` listeners sont ajoutés pour un événement particulier. Il s'agit d'une valeur par défaut utile qui permet de trouver les fuites de mémoire. La méthode `emitter.setMaxListeners()` permet de modifier la limite pour cette instance spécifique de `EventEmitter`. La valeur peut être définie sur `Infinity` (ou `0`) pour indiquer un nombre illimité de listeners.

Retourne une référence à `EventEmitter`, afin que les appels puissent être chaînés.

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**Ajouté dans : v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Retourne : [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Retourne une copie du tableau des listeners pour l'événement nommé `eventName`, y compris tous les wrappers (tels que ceux créés par `.once()`).

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: info [Historique]
| Version        | Modifications                                            |
| :------------- | :------------------------------------------------------- |
| v17.4.0, v16.14.0 | N'est plus expérimental.                                 |
| v13.4.0, v12.16.0 | Ajoutée dans : v13.4.0, v12.16.0                       |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La méthode `Symbol.for('nodejs.rejection')` est appelée si un rejet de promesse se produit lors de l'émission d'un événement et que [`captureRejections`](/fr/nodejs/api/events#capture-rejections-of-promises) est activé sur l'émetteur. Il est possible d'utiliser [`events.captureRejectionSymbol`](/fr/nodejs/api/events#eventscapturerejectionsymbol) à la place de `Symbol.for('nodejs.rejection')`.

::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

```js [CJS]
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**Ajouté dans : v0.11.2**

Par défaut, un maximum de `10` auditeurs peuvent être enregistrés pour un même événement. Cette limite peut être modifiée pour des instances `EventEmitter` individuelles en utilisant la méthode [`emitter.setMaxListeners(n)`](/fr/nodejs/api/events#emittersetmaxlistenersn). Pour modifier la valeur par défaut pour *toutes* les instances `EventEmitter`, la propriété `events.defaultMaxListeners` peut être utilisée. Si cette valeur n'est pas un nombre positif, une `RangeError` est levée.

Soyez prudent lorsque vous définissez `events.defaultMaxListeners`, car la modification affecte *toutes* les instances `EventEmitter`, y compris celles créées avant la modification. Cependant, l'appel de [`emitter.setMaxListeners(n)`](/fr/nodejs/api/events#emittersetmaxlistenersn) a toujours la priorité sur `events.defaultMaxListeners`.

Ce n'est pas une limite stricte. L'instance `EventEmitter` autorisera l'ajout d'un plus grand nombre d'auditeurs, mais affichera un avertissement de trace sur stderr indiquant qu'une "possible fuite de mémoire EventEmitter" a été détectée. Pour un seul `EventEmitter`, les méthodes `emitter.getMaxListeners()` et `emitter.setMaxListeners()` peuvent être utilisées pour éviter temporairement cet avertissement :

`defaultMaxListeners` n'a aucun effet sur les instances `AbortSignal`. Bien qu'il soit toujours possible d'utiliser [`emitter.setMaxListeners(n)`](/fr/nodejs/api/events#emittersetmaxlistenersn) pour définir une limite d'avertissement pour les instances `AbortSignal` individuelles, par défaut les instances `AbortSignal` n'avertissent pas.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

L'indicateur de ligne de commande [`--trace-warnings`](/fr/nodejs/api/cli#--trace-warnings) peut être utilisé pour afficher la trace de pile de tels avertissements.

L'avertissement émis peut être inspecté avec [`process.on('warning')`](/fr/nodejs/api/process#event-warning) et aura les propriétés supplémentaires `emitter`, `type` et `count`, faisant référence à l'instance de l'émetteur d'événements, au nom de l'événement et au nombre d'auditeurs attachés, respectivement. Sa propriété `name` est définie sur `'MaxListenersExceededWarning'`.


## `events.errorMonitor` {#eventserrormonitor}

**Ajouté dans : v13.6.0, v12.17.0**

Ce symbole doit être utilisé pour installer un écouteur uniquement pour surveiller les événements `'error'`. Les écouteurs installés à l'aide de ce symbole sont appelés avant que les écouteurs `'error'` réguliers ne soient appelés.

L'installation d'un écouteur à l'aide de ce symbole ne modifie pas le comportement une fois qu'un événement `'error'` est émis. Par conséquent, le processus plantera toujours si aucun écouteur `'error'` régulier n'est installé.

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**Ajouté dans : v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String) | [\<symbol\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Symbole)
- Retourne : [\<Function[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)

Retourne une copie du tableau des écouteurs pour l'événement nommé `eventName`.

Pour les `EventEmitter`s, cela se comporte exactement de la même manière que l'appel de `.listeners` sur l'émetteur.

Pour les `EventTarget`s, c'est la seule façon d'obtenir les écouteurs d'événements pour la cible d'événement. Ceci est utile à des fins de débogage et de diagnostic.

::: code-group
```js [ESM]
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```js [CJS]
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```
:::


## `events.getMaxListeners(emitterOrTarget)` {#eventsgetmaxlistenersemitterortarget}

**Ajouté dans : v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget)
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne le nombre maximum actuel d'écouteurs définis.

Pour les `EventEmitter`, cela se comporte exactement de la même manière que l'appel de `.getMaxListeners` sur l'émetteur.

Pour les `EventTarget`, c'est le seul moyen d'obtenir le nombre maximum d'écouteurs d'événements pour la cible d'événement. Si le nombre de gestionnaires d'événements sur un seul EventTarget dépasse le maximum défini, EventTarget affichera un avertissement.

::: code-group
```js [ESM]
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```js [CJS]
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```
:::

## `events.once(emitter, name[, options])` {#eventsonceemitter-name-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | L'option `signal` est désormais prise en charge. |
| v11.13.0, v10.16.0 | Ajouté dans : v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Peut être utilisé pour annuler l'attente de l'événement.

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Crée une `Promise` qui est résolue lorsque l'`EventEmitter` émet l'événement donné ou qui est rejetée si l'`EventEmitter` émet `'error'` pendant l'attente. La `Promise` sera résolue avec un tableau de tous les arguments émis à l'événement donné.

Cette méthode est intentionnellement générique et fonctionne avec l'interface [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) de la plateforme web, qui n'a pas de sémantique d'événement `'error'` spéciale et n'écoute pas l'événement `'error'`.

::: code-group
```js [ESM]
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```js [CJS]
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```
:::

La gestion spéciale de l'événement `'error'` n'est utilisée que lorsque `events.once()` est utilisé pour attendre un autre événement. Si `events.once()` est utilisé pour attendre l'événement '`error'` lui-même, alors il est traité comme tout autre type d'événement sans gestion spéciale :

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```
:::

Un [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) peut être utilisé pour annuler l'attente de l'événement :

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```
:::


### Attendre plusieurs événements émis sur `process.nextTick()` {#awaiting-multiple-events-emitted-on-processnexttick}

Il existe un cas limite à noter lors de l'utilisation de la fonction `events.once()` pour attendre plusieurs événements émis dans le même lot d'opérations `process.nextTick()`, ou chaque fois que plusieurs événements sont émis de manière synchrone. Plus précisément, étant donné que la file d'attente `process.nextTick()` est vidée avant la file d'attente de microtâches `Promise`, et que `EventEmitter` émet tous les événements de manière synchrone, il est possible que `events.once()` manque un événement.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Cette Promise ne sera jamais résolue car l'événement 'foo' aura
  // déjà été émis avant la création de la Promise.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Cette Promise ne sera jamais résolue car l'événement 'foo' aura
  // déjà été émis avant la création de la Promise.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::

Pour capturer les deux événements, créez chacune des Promises *avant* d'attendre l'une ou l'autre, puis il devient possible d'utiliser `Promise.all()`, `Promise.race()` ou `Promise.allSettled()` :

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::


## `events.captureRejections` {#eventscapturerejections}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.4.0, v16.14.0 | N’est plus expérimental. |
| v13.4.0, v12.16.0 | Ajouté dans : v13.4.0, v12.16.0 |
:::

Valeur : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Modifie l’option `captureRejections` par défaut sur tous les nouveaux objets `EventEmitter`.

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.4.0, v16.14.0 | N’est plus expérimental. |
| v13.4.0, v12.16.0 | Ajouté dans : v13.4.0, v12.16.0 |
:::

Valeur : `Symbol.for('nodejs.rejection')`

Voir comment écrire un [gestionnaire de rejet](/fr/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) personnalisé.

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**Ajouté dans : v0.9.12**

**Obsolète depuis : v3.2.0**

::: danger [Stable: 0 - Obsolète]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Obsolète : Utilisez [`emitter.listenerCount()`](/fr/nodejs/api/events#emitterlistenercounteventname-listener) à la place.
:::

- `emitter` [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter) L’émetteur à interroger.
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom de l’événement.

Une méthode de classe qui renvoie le nombre d’écouteurs pour le `eventName` donné enregistré sur le `emitter` donné.

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | Prise en charge des options `highWaterMark` et `lowWaterMark`, par souci de cohérence. Les anciennes options sont toujours prises en charge. |
| v20.0.0 | Les options `close`, `highWatermark` et `lowWatermark` sont désormais prises en charge. |
| v13.6.0, v12.16.0 | Ajoutée dans : v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Le nom de l'événement écouté.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Peut être utilisé pour annuler l'attente d'événements.
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Noms des événements qui mettront fin à l'itération.
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `Number.MAX_SAFE_INTEGER` La limite supérieure. L'émetteur est mis en pause chaque fois que la taille des événements mis en mémoire tampon est supérieure à celle-ci. Pris en charge uniquement sur les émetteurs implémentant les méthodes `pause()` et `resume()`.
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `1` La limite inférieure. L'émetteur est relancé chaque fois que la taille des événements mis en mémoire tampon est inférieure à celle-ci. Pris en charge uniquement sur les émetteurs implémentant les méthodes `pause()` et `resume()`.
  
 
- Retourne : [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) qui itère sur les événements `eventName` émis par l'`emitter`.



::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Émettre plus tard
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // L'exécution de ce bloc interne est synchrone et il
  // traite un événement à la fois (même avec await). Ne pas utiliser
  // si une exécution simultanée est requise.
  console.log(event); // affiche ['bar'] [42]
}
// Inatteignable ici
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Émettre plus tard
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // L'exécution de ce bloc interne est synchrone et il
    // traite un événement à la fois (même avec await). Ne pas utiliser
    // si une exécution simultanée est requise.
    console.log(event); // affiche ['bar'] [42]
  }
  // Inatteignable ici
})();
```
:::

Retourne un `AsyncIterator` qui itère sur les événements `eventName`. Il lèvera une exception si l'`EventEmitter` émet `'error'`. Il supprime tous les auditeurs lors de la sortie de la boucle. La `value` renvoyée par chaque itération est un tableau composé des arguments d'événement émis.

Un [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) peut être utilisé pour annuler l'attente d'événements :



::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Émettre plus tard
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // L'exécution de ce bloc interne est synchrone et il
    // traite un événement à la fois (même avec await). Ne pas utiliser
    // si une exécution simultanée est requise.
    console.log(event); // affiche ['bar'] [42]
  }
  // Inatteignable ici
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Émettre plus tard
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // L'exécution de ce bloc interne est synchrone et il
    // traite un événement à la fois (même avec await). Ne pas utiliser
    // si une exécution simultanée est requise.
    console.log(event); // affiche ['bar'] [42]
  }
  // Inatteignable ici
})();

process.nextTick(() => ac.abort());
```
:::

## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**Ajouté dans : v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un nombre non négatif. Le nombre maximum d'auditeurs par événement `EventTarget`.
- `...eventsTargets` [\<EventTarget[]\>](/fr/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/fr/nodejs/api/events#class-eventemitter) Zéro instance ou plus de [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) ou [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter). Si aucun n'est spécifié, `n` est défini comme maximum par défaut pour tous les objets [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) et [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter) nouvellement créés.

::: code-group
```js [ESM]
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```js [CJS]
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```
:::

## `events.addAbortListener(signal, listener)` {#eventsaddabortlistenersignal-listener}

**Ajouté dans : v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/fr/nodejs/api/events#event-listener)
- Retourne : [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Un jetable qui supprime l'écouteur `abort`.

Écoute une fois l'événement `abort` sur le `signal` fourni.

Écouter l'événement `abort` sur les signaux d'abandon n'est pas sûr et peut entraîner des fuites de ressources, car une autre tierce partie avec le signal peut appeler [`e.stopImmediatePropagation()`](/fr/nodejs/api/events#eventstopimmediatepropagation). Malheureusement, Node.js ne peut pas changer cela car cela violerait la norme Web. De plus, l'API d'origine permet d'oublier facilement de supprimer les écouteurs.

Cette API permet d'utiliser en toute sécurité les `AbortSignal` dans les API Node.js en résolvant ces deux problèmes en écoutant l'événement de sorte que `stopImmediatePropagation` n'empêche pas l'écouteur de s'exécuter.

Retourne un jetable afin qu'il puisse être désinscrit plus facilement.

::: code-group
```js [CJS]
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

```js [ESM]
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```
:::


## Classe : `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**Ajoutée dans : v17.4.0, v16.14.0**

Intègre `EventEmitter` avec [\<AsyncResource\>](/fr/nodejs/api/async_hooks#class-asyncresource) pour les `EventEmitter` qui nécessitent un suivi asynchrone manuel. Plus précisément, tous les événements émis par les instances de `events.EventEmitterAsyncResource` s’exécuteront dans son [contexte asynchrone](/fr/nodejs/api/async_context).

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// L’outillage de suivi asynchrone identifiera ceci comme « Q ».
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// Les écouteurs 'foo' s’exécuteront dans le contexte asynchrone des EventEmitters.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// Les écouteurs 'foo' sur les EventEmitters ordinaires qui ne suivent pas
// le contexte asynchrone, s’exécutent toutefois dans le même contexte asynchrone que emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```js [CJS]
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// L’outillage de suivi asynchrone identifiera ceci comme « Q ».
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// Les écouteurs 'foo' s’exécuteront dans le contexte asynchrone des EventEmitters.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// Les écouteurs 'foo' sur les EventEmitters ordinaires qui ne suivent pas
// le contexte asynchrone, s’exécutent toutefois dans le même contexte asynchrone que emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```
:::

La classe `EventEmitterAsyncResource` a les mêmes méthodes et prend les mêmes options que `EventEmitter` et `AsyncResource` eux-mêmes.


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Active la [capture automatique des rejets de promesses](/fr/nodejs/api/events#capture-rejections-of-promises). **Par défaut :** `false`.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type d'événement asynchrone. **Par défaut :** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID du contexte d'exécution qui a créé cet événement asynchrone. **Par défaut :** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, désactive `emitDestroy` lorsque l'objet est nettoyé par le garbage collector. Il n'est généralement pas nécessaire de définir cette option (même si `emitDestroy` est appelé manuellement), sauf si `asyncId` de la ressource est récupéré et que l'API sensible `emitDestroy` est appelée avec elle. Lorsque la valeur est définie sur `false`, l'appel `emitDestroy` lors du garbage collection n'aura lieu que s'il existe au moins un hook `destroy` actif. **Par défaut :** `false`.

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'`asyncId` unique attribué à la ressource.

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- Type : [\<AsyncResource\>](/fr/nodejs/api/async_hooks#class-asyncresource) sous-jacent.

L'objet `AsyncResource` renvoyé a une propriété `eventEmitter` supplémentaire qui fournit une référence à cet `EventEmitterAsyncResource`.

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

Appelle tous les hooks `destroy`. Cela ne doit être appelé qu'une seule fois. Une erreur sera levée s'il est appelé plus d'une fois. Cela **doit** être appelé manuellement. Si la ressource est laissée à la collecte par le GC, les hooks `destroy` ne seront jamais appelés.


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- Type : [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le même `triggerAsyncId` qui est transmis au constructeur `AsyncResource`.

## API `EventTarget` et `Event` {#eventtarget-and-event-api}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Modification de la gestion des erreurs EventTarget. |
| v15.4.0 | N'est plus expérimental. |
| v15.0.0 | Les classes `EventTarget` et `Event` sont maintenant disponibles en tant que globales. |
| v14.5.0 | Ajouté dans : v14.5.0 |
:::

Les objets `EventTarget` et `Event` sont une implémentation spécifique à Node.js de l'[`API Web EventTarget`](https://dom.spec.whatwg.org/#eventtarget) qui sont exposés par certaines API centrales de Node.js.

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('l'événement foo s'est produit !');
});
```
### `EventTarget` Node.js vs. `EventTarget` DOM {#nodejs-eventtarget-vs-dom-eventtarget}

Il existe deux différences essentielles entre le `EventTarget` Node.js et l'[`API Web EventTarget`](https://dom.spec.whatwg.org/#eventtarget) :

### `NodeEventTarget` vs. `EventEmitter` {#nodeeventtarget-vs-eventemitter}

L'objet `NodeEventTarget` implémente un sous-ensemble modifié de l'API `EventEmitter` qui lui permet d'*émuler* étroitement un `EventEmitter` dans certaines situations. Un `NodeEventTarget` *n'est pas* une instance de `EventEmitter` et ne peut pas être utilisé à la place d'un `EventEmitter` dans la plupart des cas.

### Écouteur d'événements {#event-listener}

Les écouteurs d'événements enregistrés pour un `type` d'événement peuvent être des fonctions JavaScript ou des objets avec une propriété `handleEvent` dont la valeur est une fonction.

Dans les deux cas, la fonction gestionnaire est invoquée avec l'argument `event` passé à la fonction `eventTarget.dispatchEvent()`.

Les fonctions asynchrones peuvent être utilisées comme écouteurs d'événements. Si une fonction gestionnaire asynchrone rejette, le rejet est capturé et géré comme décrit dans [Gestion des erreurs `EventTarget`](/fr/nodejs/api/events#eventtarget-error-handling).

Une erreur levée par une fonction gestionnaire n'empêche pas les autres gestionnaires d'être invoqués.

La valeur de retour d'une fonction gestionnaire est ignorée.

Les gestionnaires sont toujours invoqués dans l'ordre dans lequel ils ont été ajoutés.

Les fonctions gestionnaires peuvent modifier l'objet `event`.

```js [ESM]
function handler1(event) {
  console.log(event.type);  // Affiche 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Affiche 'foo'
  console.log(event.a);  // Affiche 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Affiche 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Affiche 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### Gestion des erreurs `EventTarget` {#eventtarget-error-handling}

Lorsqu'un écouteur d'événements enregistré lève une exception (ou renvoie une Promise qui est rejetée), par défaut l'erreur est traitée comme une exception non interceptée sur `process.nextTick()`. Cela signifie que les exceptions non interceptées dans les `EventTarget` mettront fin au processus Node.js par défaut.

Lever une exception dans un écouteur d'événements *n'empêchera pas* les autres gestionnaires enregistrés d'être invoqués.

L'`EventTarget` n'implémente aucune gestion par défaut spéciale pour les événements de type `'error'` comme `EventEmitter`.

Actuellement, les erreurs sont d'abord transmises à l'événement `process.on('error')` avant d'atteindre `process.on('uncaughtException')`. Ce comportement est obsolète et changera dans une future version pour aligner `EventTarget` avec d'autres API Node.js. Tout code s'appuyant sur l'événement `process.on('error')` doit être aligné sur le nouveau comportement.

### Classe : `Event` {#class-event}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | La classe `Event` est maintenant disponible via l'objet global. |
| v14.5.0 | Ajoutée dans : v14.5.0 |
:::

L'objet `Event` est une adaptation de l'[API Web `Event`](https://dom.spec.whatwg.org/#event). Les instances sont créées en interne par Node.js.

#### `event.bubbles` {#eventbubbles}

**Ajoutée dans : v14.5.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Renvoie toujours `false`.

Ceci n'est pas utilisé dans Node.js et est fourni uniquement à des fins d'exhaustivité.

#### `event.cancelBubble` {#eventcancelbubble}

**Ajoutée dans : v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable : 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Legacy : utiliser [`event.stopPropagation()`](/fr/nodejs/api/events#eventstoppropagation) à la place.
:::

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias pour `event.stopPropagation()` s'il est défini sur `true`. Ceci n'est pas utilisé dans Node.js et est fourni uniquement à des fins d'exhaustivité.

#### `event.cancelable` {#eventcancelable}

**Ajoutée dans : v14.5.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Vrai si l'événement a été créé avec l'option `cancelable`.


#### `event.composed` {#eventcomposed}

**Ajouté dans : v14.5.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Retourne toujours `false`.

Ceci n'est pas utilisé dans Node.js et est fourni uniquement par souci d'exhaustivité.

#### `event.composedPath()` {#eventcomposedpath}

**Ajouté dans : v14.5.0**

Retourne un tableau contenant l'`EventTarget` actuel comme seule entrée ou vide si l'événement n'est pas en cours de distribution. Ceci n'est pas utilisé dans Node.js et est fourni uniquement par souci d'exhaustivité.

#### `event.currentTarget` {#eventcurrenttarget}

**Ajouté dans : v14.5.0**

- Type : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) L'`EventTarget` qui distribue l'événement.

Alias de `event.target`.

#### `event.defaultPrevented` {#eventdefaultprevented}

**Ajouté dans : v14.5.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` si `cancelable` est `true` et que `event.preventDefault()` a été appelé.

#### `event.eventPhase` {#eventeventphase}

**Ajouté dans : v14.5.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Retourne `0` lorsqu'un événement n'est pas en cours de distribution, `2` lorsqu'il est en cours de distribution.

Ceci n'est pas utilisé dans Node.js et est fourni uniquement par souci d'exhaustivité.

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**Ajouté dans : v19.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Hérité : La spécification WHATWG considère qu'il est obsolète et que les utilisateurs ne devraient pas l'utiliser du tout.
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Redondant avec les constructeurs d'événements et incapable de définir `composed`. Ceci n'est pas utilisé dans Node.js et est fourni uniquement par souci d'exhaustivité.

#### `event.isTrusted` {#eventistrusted}

**Ajouté dans : v14.5.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

L'événement `abort` de [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) est émis avec `isTrusted` défini sur `true`. La valeur est `false` dans tous les autres cas.


#### `event.preventDefault()` {#eventpreventdefault}

**Ajouté dans : v14.5.0**

Définit la propriété `defaultPrevented` sur `true` si `cancelable` est `true`.

#### `event.returnValue` {#eventreturnvalue}

**Ajouté dans : v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Legacy : Utilisez [`event.defaultPrevented`](/fr/nodejs/api/events#eventdefaultprevented) à la place.
:::

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Vrai si l’événement n’a pas été annulé.

La valeur de `event.returnValue` est toujours l’opposé de `event.defaultPrevented`. Ceci n’est pas utilisé dans Node.js et est fourni uniquement à titre d’exhaustivité.

#### `event.srcElement` {#eventsrcelement}

**Ajouté dans : v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Legacy : Utilisez [`event.target`](/fr/nodejs/api/events#eventtarget) à la place.
:::

- Type : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) Le `EventTarget` qui déclenche l’événement.

Alias pour `event.target`.

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Ajouté dans : v14.5.0**

Arrête l’invocation des écouteurs d’événements après la fin de l’écouteur actuel.

#### `event.stopPropagation()` {#eventstoppropagation}

**Ajouté dans : v14.5.0**

Ceci n’est pas utilisé dans Node.js et est fourni uniquement à titre d’exhaustivité.

#### `event.target` {#eventtarget}

**Ajouté dans : v14.5.0**

- Type : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) Le `EventTarget` qui déclenche l’événement.

#### `event.timeStamp` {#eventtimestamp}

**Ajouté dans : v14.5.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes lors de la création de l’objet `Event`.

#### `event.type` {#eventtype}

**Ajouté dans : v14.5.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L’identificateur de type d’événement.

### Class: `EventTarget` {#class-eventtarget}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | La classe `EventTarget` est désormais disponible via l’objet global. |
| v14.5.0 | Ajouté dans : v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.4.0 | Ajout de la prise en charge de l'option `signal`. |
| v14.5.0 | Ajouté dans : v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/fr/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est `true`, l'écouteur est automatiquement supprimé lorsqu'il est invoqué pour la première fois. **Par défaut :** `false`.
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est `true`, sert d'indice que l'écouteur n'appellera pas la méthode `preventDefault()` de l'objet `Event`. **Par défaut :** `false`.
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Non directement utilisé par Node.js. Ajouté pour l'exhaustivité de l'API. **Par défaut :** `false`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) L'écouteur sera supprimé lorsque la méthode `abort()` de l'objet AbortSignal donné sera appelée.
  
 

Ajoute un nouveau gestionnaire pour l'événement `type`. Un `listener` donné n'est ajouté qu'une seule fois par `type` et par valeur d'option `capture`.

Si l'option `once` est `true`, le `listener` est supprimé après la prochaine fois qu'un événement `type` est déclenché.

L'option `capture` n'est pas utilisée par Node.js d'une manière fonctionnelle autre que le suivi des écouteurs d'événements enregistrés selon la spécification `EventTarget`. Plus précisément, l'option `capture` est utilisée dans le cadre de la clé lors de l'enregistrement d'un `listener`. Un `listener` individuel peut être ajouté une fois avec `capture = false` et une fois avec `capture = true`.

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // premier
target.addEventListener('foo', handler, { capture: false }); // second

// Supprime la deuxième instance de handler
target.removeEventListener('foo', handler);

// Supprime la première instance de handler
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**Ajouté dans : v14.5.0**

-   `event` [\<Event\>](/fr/nodejs/api/events#class-event)
-   Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la valeur de l’attribut `cancelable` de l’événement est false ou si sa méthode `preventDefault()` n’a pas été appelée, sinon `false`.

Distribue l’`event` à la liste des gestionnaires pour `event.type`.

Les écouteurs d’événements enregistrés sont invoqués de manière synchrone dans l’ordre dans lequel ils ont été enregistrés.

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**Ajouté dans : v14.5.0**

-   `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-   `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/fr/nodejs/api/events#event-listener)
-   `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    -   `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Supprime le `listener` de la liste des gestionnaires pour l’`event` `type`.

### Class: `CustomEvent` {#class-customevent}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | N’est plus expérimental. |
| v22.1.0, v20.13.0 | CustomEvent est désormais stable. |
| v19.0.0 | N’est plus derrière l’indicateur CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Ajouté dans : v18.7.0, v16.17.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

-   Extends: [\<Event\>](/fr/nodejs/api/events#class-event)

L’objet `CustomEvent` est une adaptation de l’[`API Web CustomEvent`](https://dom.spec.whatwg.org/#customevent). Les instances sont créées en interne par Node.js.

#### `event.detail` {#eventdetail}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent est désormais stable. |
| v18.7.0, v16.17.0 | Ajouté dans : v18.7.0, v16.17.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

-   Type : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Renvoie les données personnalisées transmises lors de l’initialisation.

Lecture seule.


### Classe : `NodeEventTarget` {#class-nodeeventtarget}

**Ajouté dans : v14.5.0**

- Hérite de : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget)

`NodeEventTarget` est une extension spécifique à Node.js de `EventTarget` qui émule un sous-ensemble de l'API `EventEmitter`.

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**Ajouté dans : v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/fr/nodejs/api/events#event-listener)
- Retourne : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) `this`

Extension spécifique à Node.js de la classe `EventTarget` qui émule l'API `EventEmitter` équivalente. La seule différence entre `addListener()` et `addEventListener()` est que `addListener()` renvoie une référence à `EventTarget`.

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**Ajouté dans : v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si des auditeurs d’événements enregistrés pour le `type` existent, sinon `false`.

Extension spécifique à Node.js de la classe `EventTarget` qui distribue l’`arg` à la liste des gestionnaires pour `type`.

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**Ajouté dans : v14.5.0**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Extension spécifique à Node.js de la classe `EventTarget` qui renvoie un tableau de noms de `type` d’événement pour lesquels des auditeurs d’événements sont enregistrés.

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**Ajouté dans : v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Extension spécifique à Node.js de la classe `EventTarget` qui renvoie le nombre d’auditeurs d’événements enregistrés pour le `type`.


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**Ajouté dans : v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Extension spécifique à Node.js de la classe `EventTarget` qui définit le nombre maximal d'écouteurs d'événements à `n`.

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**Ajouté dans : v14.5.0**

- Returns : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Extension spécifique à Node.js de la classe `EventTarget` qui renvoie le nombre maximal d'écouteurs d'événements.

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**Ajouté dans : v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/fr/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

- Returns : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) this

Alias spécifique à Node.js pour `eventTarget.removeEventListener()`.

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**Ajouté dans : v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/fr/nodejs/api/events#event-listener)
- Returns : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) this

Alias spécifique à Node.js pour `eventTarget.addEventListener()`.

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**Ajouté dans : v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/fr/nodejs/api/events#event-listener)
- Returns : [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) this

Extension spécifique à Node.js de la classe `EventTarget` qui ajoute un écouteur `once` pour le `type` d'événement donné. Ceci est équivalent à appeler `on` avec l'option `once` définie sur `true`.


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**Ajouté dans: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  Renvoie: [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) this

Extension spécifique à Node.js de la classe `EventTarget`. Si `type` est spécifié, supprime tous les auditeurs enregistrés pour `type`, sinon supprime tous les auditeurs enregistrés.

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**Ajouté dans: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/fr/nodejs/api/events#event-listener)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


-  Renvoie: [\<EventTarget\>](/fr/nodejs/api/events#class-eventtarget) this

Extension spécifique à Node.js de la classe `EventTarget` qui supprime le `listener` pour le `type` donné. La seule différence entre `removeListener()` et `removeEventListener()` est que `removeListener()` renverra une référence à `EventTarget`.

