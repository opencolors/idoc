---
title: Documentation de l'API Timers de Node.js
description: Le module Timers de Node.js fournit des fonctions pour planifier l'appel de fonctions à un moment futur. Cela inclut des méthodes comme setTimeout, setInterval, setImmediate et leurs équivalents de suppression, ainsi que process.nextTick pour exécuter du code lors de la prochaine itération de la boucle d'événements.
head:
  - - meta
    - name: og:title
      content: Documentation de l'API Timers de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Timers de Node.js fournit des fonctions pour planifier l'appel de fonctions à un moment futur. Cela inclut des méthodes comme setTimeout, setInterval, setImmediate et leurs équivalents de suppression, ainsi que process.nextTick pour exécuter du code lors de la prochaine itération de la boucle d'événements.
  - - meta
    - name: twitter:title
      content: Documentation de l'API Timers de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Timers de Node.js fournit des fonctions pour planifier l'appel de fonctions à un moment futur. Cela inclut des méthodes comme setTimeout, setInterval, setImmediate et leurs équivalents de suppression, ainsi que process.nextTick pour exécuter du code lors de la prochaine itération de la boucle d'événements.
---


# Temporisateurs {#timers}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

Le module `timer` expose une API globale pour planifier des fonctions à appeler dans un certain laps de temps. Étant donné que les fonctions de temporisation sont globales, il n'est pas nécessaire d'appeler `require('node:timers')` pour utiliser l'API.

Les fonctions de temporisation dans Node.js implémentent une API similaire à l'API de temporisation fournie par les navigateurs Web, mais utilisent une implémentation interne différente qui est construite autour de la [boucle d'événements](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) de Node.js.

## Classe : `Immediate` {#class-immediate}

Cet objet est créé en interne et est renvoyé par [`setImmediate()`](/fr/nodejs/api/timers#setimmediatecallback-args). Il peut être transmis à [`clearImmediate()`](/fr/nodejs/api/timers#clearimmediateimmediate) afin d'annuler les actions planifiées.

Par défaut, lorsqu'un immédiat est planifié, la boucle d'événements Node.js continue de s'exécuter tant que l'immédiat est actif. L'objet `Immediate` renvoyé par [`setImmediate()`](/fr/nodejs/api/timers#setimmediatecallback-args) exporte les fonctions `immediate.ref()` et `immediate.unref()` qui peuvent être utilisées pour contrôler ce comportement par défaut.

### `immediate.hasRef()` {#immediatehasref}

**Ajoutée dans : v11.0.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si true, l'objet `Immediate` maintiendra la boucle d'événements Node.js active.

### `immediate.ref()` {#immediateref}

**Ajoutée dans : v9.7.0**

- Retourne : [\<Immediate\>](/fr/nodejs/api/timers#class-immediate) une référence à `immediate`

Lorsqu'elle est appelée, demande à la boucle d'événements Node.js de *ne pas* se fermer tant que `Immediate` est actif. Appeler `immediate.ref()` plusieurs fois n'aura aucun effet.

Par défaut, tous les objets `Immediate` sont "ref'ed", ce qui rend normalement inutile d'appeler `immediate.ref()` sauf si `immediate.unref()` a été appelé précédemment.


### `immediate.unref()` {#immediateunref}

**Ajouté dans : v9.7.0**

- Retourne : [\<Immediate\>](/fr/nodejs/api/timers#class-immediate) une référence à `immediate`

Lorsqu'il est appelé, l'objet `Immediate` actif n'exigera pas que la boucle d'événements Node.js reste active. S'il n'y a pas d'autre activité maintenant la boucle d'événements en cours d'exécution, le processus peut se terminer avant que le callback de l'objet `Immediate` ne soit invoqué. Appeler `immediate.unref()` plusieurs fois n'aura aucun effet.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**Ajouté dans : v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Annule l’immédiat. Ceci est similaire à appeler `clearImmediate()`.

## Class: `Timeout` {#class-timeout}

Cet objet est créé en interne et est retourné par [`setTimeout()`](/fr/nodejs/api/timers#settimeoutcallback-delay-args) et [`setInterval()`](/fr/nodejs/api/timers#setintervalcallback-delay-args). Il peut être passé à [`clearTimeout()`](/fr/nodejs/api/timers#cleartimeouttimeout) ou [`clearInterval()`](/fr/nodejs/api/timers#clearintervaltimeout) afin d'annuler les actions planifiées.

Par défaut, lorsqu'un minuteur est planifié en utilisant soit [`setTimeout()`](/fr/nodejs/api/timers#settimeoutcallback-delay-args) soit [`setInterval()`](/fr/nodejs/api/timers#setintervalcallback-delay-args), la boucle d'événements Node.js continuera à s'exécuter tant que le minuteur est actif. Chacun des objets `Timeout` retournés par ces fonctions exporte les fonctions `timeout.ref()` et `timeout.unref()` qui peuvent être utilisées pour contrôler ce comportement par défaut.

### `timeout.close()` {#timeoutclose}

**Ajouté dans : v0.9.1**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Hérité : Utilisez plutôt [`clearTimeout()`](/fr/nodejs/api/timers#cleartimeouttimeout).
:::

- Retourne : [\<Timeout\>](/fr/nodejs/api/timers#class-timeout) une référence à `timeout`

Annule le timeout.

### `timeout.hasRef()` {#timeouthasref}

**Ajouté dans : v11.0.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si la valeur est true, l'objet `Timeout` maintiendra la boucle d'événements Node.js active.


### `timeout.ref()` {#timeoutref}

**Ajouté dans : v0.9.1**

- Retourne : [\<Timeout\>](/fr/nodejs/api/timers#class-timeout) une référence au `timeout`

Lorsqu'elle est appelée, demande à la boucle d'événements Node.js de *ne pas* se fermer tant que le `Timeout` est actif. Appeler `timeout.ref()` plusieurs fois n'aura aucun effet.

Par défaut, tous les objets `Timeout` sont "ref'ed", ce qui rend normalement inutile l'appel à `timeout.ref()` sauf si `timeout.unref()` a été appelé précédemment.

### `timeout.refresh()` {#timeoutrefresh}

**Ajouté dans : v10.2.0**

- Retourne : [\<Timeout\>](/fr/nodejs/api/timers#class-timeout) une référence au `timeout`

Définit l'heure de début du timer à l'heure actuelle et reprogramme le timer pour appeler son callback à la durée précédemment spécifiée, ajustée à l'heure actuelle. Ceci est utile pour actualiser un timer sans allouer un nouvel objet JavaScript.

Utiliser ceci sur un timer qui a déjà appelé son callback réactivera le timer.

### `timeout.unref()` {#timeoutunref}

**Ajouté dans : v0.9.1**

- Retourne : [\<Timeout\>](/fr/nodejs/api/timers#class-timeout) une référence au `timeout`

Lorsqu'il est appelé, l'objet `Timeout` actif n'exigera pas que la boucle d'événements Node.js reste active. S'il n'y a aucune autre activité maintenant la boucle d'événements en cours d'exécution, le processus peut se fermer avant que le callback de l'objet `Timeout` ne soit invoqué. Appeler `timeout.unref()` plusieurs fois n'aura aucun effet.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**Ajouté dans : v14.9.0, v12.19.0**

- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) un nombre qui peut être utilisé pour référencer ce `timeout`

Force un `Timeout` à être une primitive. La primitive peut être utilisée pour effacer le `Timeout`. La primitive ne peut être utilisée que dans le même thread où le timeout a été créé. Par conséquent, pour l'utiliser dans les [`worker_threads`](/fr/nodejs/api/worker_threads), il doit d'abord être passé au thread correct. Ceci permet une compatibilité améliorée avec les implémentations `setTimeout()` et `setInterval()` du navigateur.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**Ajouté dans : v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Annule le délai d'attente.


## Programmation de temporisateurs {#scheduling-timers}

Un temporisateur dans Node.js est une construction interne qui appelle une fonction donnée après une certaine période de temps. Le moment où la fonction d'un temporisateur est appelée varie en fonction de la méthode utilisée pour créer le temporisateur et du travail effectué par la boucle d'événements Node.js.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.9.1 | Ajoutée dans : v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à appeler à la fin de ce tour de la [boucle d'événements](https://nodejs.org/fr/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) de Node.js
- `...args` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Arguments optionnels à passer lorsque le `callback` est appelé.
- Retourne : [\<Immediate\>](/fr/nodejs/api/timers#class-immediate) pour une utilisation avec [`clearImmediate()`](/fr/nodejs/api/timers#clearimmediateimmediate)

Planifie l'exécution "immédiate" du `callback` après les rappels des événements d'E/S.

Lorsque plusieurs appels à `setImmediate()` sont effectués, les fonctions `callback` sont mises en file d'attente pour être exécutées dans l'ordre dans lequel elles sont créées. La totalité de la file d'attente des rappels est traitée à chaque itération de la boucle d'événements. Si un temporisateur immédiat est mis en file d'attente depuis l'intérieur d'un rappel en cours d'exécution, ce temporisateur ne sera pas déclenché avant la prochaine itération de la boucle d'événements.

Si `callback` n'est pas une fonction, une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) sera levée.

Cette méthode possède une variante personnalisée pour les promesses qui est disponible en utilisant [`timersPromises.setImmediate()`](/fr/nodejs/api/timers#timerspromisessetimmediatevalue-options).

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Ajoutée dans : v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à appeler lorsque le temporisateur expire.
- `delay` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes à attendre avant d'appeler le `callback`. **Par défaut :** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Arguments optionnels à passer lorsque le `callback` est appelé.
- Retourne : [\<Timeout\>](/fr/nodejs/api/timers#class-timeout) pour une utilisation avec [`clearInterval()`](/fr/nodejs/api/timers#clearintervaltimeout)

Planifie l'exécution répétée de `callback` toutes les `delay` millisecondes.

Lorsque `delay` est supérieur à `2147483647` ou inférieur à `1` ou `NaN`, le `delay` sera défini sur `1`. Les délais non entiers sont tronqués en un entier.

Si `callback` n'est pas une fonction, une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) sera levée.

Cette méthode possède une variante personnalisée pour les promesses qui est disponible en utilisant [`timersPromises.setInterval()`](/fr/nodejs/api/timers#timerspromisessetintervaldelay-value-options).


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève maintenant une erreur `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Ajouté dans : v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à appeler lorsque le délai est écoulé.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes à attendre avant d'appeler le `callback`. **Par défaut :** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Arguments optionnels à passer lorsque le `callback` est appelé.
- Retourne : [\<Timeout\>](/fr/nodejs/api/timers#class-timeout) à utiliser avec [`clearTimeout()`](/fr/nodejs/api/timers#cleartimeouttimeout)

Planifie l'exécution d'un `callback` unique après `delay` millisecondes.

Le `callback` ne sera probablement pas invoqué précisément dans `delay` millisecondes. Node.js ne donne aucune garantie quant au moment exact où les callbacks seront déclenchés, ni quant à leur ordre. Le callback sera appelé aussi près que possible du moment spécifié.

Lorsque `delay` est supérieur à `2147483647` ou inférieur à `1` ou `NaN`, le `delay` sera défini sur `1`. Les délais non entiers sont tronqués en un entier.

Si `callback` n'est pas une fonction, une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) sera levée.

Cette méthode a une variante personnalisée pour les promesses qui est disponible en utilisant [`timersPromises.setTimeout()`](/fr/nodejs/api/timers#timerspromisessettimeoutdelay-value-options).

## Annulation des temporisateurs {#cancelling-timers}

Les méthodes [`setImmediate()`](/fr/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/fr/nodejs/api/timers#setintervalcallback-delay-args) et [`setTimeout()`](/fr/nodejs/api/timers#settimeoutcallback-delay-args) renvoient chacune des objets qui représentent les temporisateurs planifiés. Ceux-ci peuvent être utilisés pour annuler le temporisateur et l'empêcher de se déclencher.

Pour les variantes promissifiées de [`setImmediate()`](/fr/nodejs/api/timers#setimmediatecallback-args) et [`setTimeout()`](/fr/nodejs/api/timers#settimeoutcallback-delay-args), un [`AbortController`](/fr/nodejs/api/globals#class-abortcontroller) peut être utilisé pour annuler le temporisateur. En cas d'annulation, les promesses renvoyées seront rejetées avec une `'AbortError'`.

Pour `setImmediate()` :

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Nous n'attendons pas la promesse afin que `ac.abort()` soit appelé simultanément.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```

```js [CJS]
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```
:::

Pour `setTimeout()` :

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Nous n'attendons pas la promesse afin que `ac.abort()` soit appelé simultanément.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```

```js [CJS]
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**Ajouté dans: v0.9.1**

- `immediate` [\<Immediate\>](/fr/nodejs/api/timers#class-immediate) Un objet `Immediate` tel que renvoyé par [`setImmediate()`](/fr/nodejs/api/timers#setimmediatecallback-args).

Annule un objet `Immediate` créé par [`setImmediate()`](/fr/nodejs/api/timers#setimmediatecallback-args).

### `clearInterval(timeout)` {#clearintervaltimeout}

**Ajouté dans: v0.0.1**

- `timeout` [\<Timeout\>](/fr/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un objet `Timeout` tel que renvoyé par [`setInterval()`](/fr/nodejs/api/timers#setintervalcallback-delay-args) ou la [primitive](/fr/nodejs/api/timers#timeoutsymboltoprimitive) de l'objet `Timeout` sous forme de chaîne de caractères ou de nombre.

Annule un objet `Timeout` créé par [`setInterval()`](/fr/nodejs/api/timers#setintervalcallback-delay-args).

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Ajouté dans: v0.0.1**

- `timeout` [\<Timeout\>](/fr/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un objet `Timeout` tel que renvoyé par [`setTimeout()`](/fr/nodejs/api/timers#settimeoutcallback-delay-args) ou la [primitive](/fr/nodejs/api/timers#timeoutsymboltoprimitive) de l'objet `Timeout` sous forme de chaîne de caractères ou de nombre.

Annule un objet `Timeout` créé par [`setTimeout()`](/fr/nodejs/api/timers#settimeoutcallback-delay-args).

## API de promesses des timers {#timers-promises-api}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Sortie de l'état expérimental. |
| v15.0.0 | Ajouté dans: v15.0.0 |
:::

L'API `timers/promises` fournit un ensemble alternatif de fonctions de timer qui renvoient des objets `Promise`. L'API est accessible via `require('node:timers/promises')`.

::: code-group
```js [ESM]
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```js [CJS]
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```
:::


### `timersPromises.setTimeout([delay[, value[, options]]])` {#timerspromisessettimeoutdelay-value-options}

**Ajouté dans : v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes à attendre avant de réaliser la promesse. **Par défaut :** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Une valeur avec laquelle la promesse est réalisée.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définir sur `false` pour indiquer que le `Timeout` planifié ne doit pas nécessiter que la boucle d’événement Node.js reste active. **Par défaut :** `true`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un `AbortSignal` optionnel qui peut être utilisé pour annuler le `Timeout` planifié.

::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Affiche 'result'
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Affiche 'result'
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**Ajouté dans : v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Une valeur avec laquelle la promesse est réalisée.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définir sur `false` pour indiquer que l' `Immediate` planifié ne doit pas nécessiter que la boucle d’événement Node.js reste active. **Par défaut :** `true`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un `AbortSignal` optionnel qui peut être utilisé pour annuler l' `Immediate` planifié.

::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Affiche 'result'
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Affiche 'result'
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**Ajouté dans : v15.9.0**

Retourne un itérateur asynchrone qui génère des valeurs à un intervalle de `delay` ms. Si `ref` vaut `true`, vous devez appeler explicitement ou implicitement `next()` de l'itérateur asynchrone pour maintenir la boucle d'événements active.

- `delay` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes à attendre entre les itérations. **Par défaut :** `1`.
- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Une valeur avec laquelle l'itérateur renvoie.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Définir sur `false` pour indiquer que le `Timeout` planifié entre les itérations ne doit pas exiger que la boucle d'événements Node.js reste active. **Par défaut :** `true`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un `AbortSignal` optionnel qui peut être utilisé pour annuler le `Timeout` planifié entre les opérations.

::: code-group
```js [ESM]
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```js [CJS]
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```
:::

### `timersPromises.scheduler.wait(delay[, options])` {#timerspromisesschedulerwaitdelay-options}

**Ajouté dans : v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `delay` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes à attendre avant de résoudre la promesse.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Définir sur `false` pour indiquer que le `Timeout` planifié ne doit pas exiger que la boucle d'événements Node.js reste active. **Par défaut :** `true`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un `AbortSignal` optionnel qui peut être utilisé pour annuler l'attente.

- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Une API expérimentale définie par le projet de spécification [Scheduling APIs](https://github.com/WICG/scheduling-apis) en cours de développement en tant qu'API Web Platform standard.

L'appel à `timersPromises.scheduler.wait(delay, options)` équivaut à l'appel à `timersPromises.setTimeout(delay, undefined, options)`.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // Wait one second before continuing
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**Ajouté dans : v17.3.0, v16.14.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Une API expérimentale définie par le brouillon de spécification des [API de planification](https://github.com/WICG/scheduling-apis) en cours de développement en tant qu’API de plateforme Web standard.

L’appel de `timersPromises.scheduler.yield()` équivaut à appeler `timersPromises.setImmediate()` sans arguments.

