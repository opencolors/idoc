---
title: Documentation Node.js - Crochets de Performance
description: Découvrez l'API des crochets de performance dans Node.js, qui offre un accès aux métriques de performance et aux outils pour mesurer la performance des applications Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Crochets de Performance | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez l'API des crochets de performance dans Node.js, qui offre un accès aux métriques de performance et aux outils pour mesurer la performance des applications Node.js.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Crochets de Performance | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez l'API des crochets de performance dans Node.js, qui offre un accès aux métriques de performance et aux outils pour mesurer la performance des applications Node.js.
---


# API de mesure de la performance {#performance-measurement-apis}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

Ce module fournit une implémentation d'un sous-ensemble des [API de performance Web](https://w3c.github.io/perf-timing-primer/) du W3C, ainsi que des API supplémentaires pour les mesures de performance spécifiques à Node.js.

Node.js prend en charge les [API de performance Web](https://w3c.github.io/perf-timing-primer/) suivantes :

- [Temps haute résolution](https://www.w3.org/TR/hr-time-2)
- [Chronologie des performances](https://w3c.github.io/performance-timeline/)
- [Temps utilisateur](https://www.w3.org/TR/user-timing/)
- [Temps de ressource](https://www.w3.org/TR/resource-timing-2/)

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**Ajouté dans : v8.5.0**

Un objet qui peut être utilisé pour collecter des mesures de performance à partir de l’instance Node.js actuelle. Il est similaire à [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) dans les navigateurs.


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si `name` n'est pas fourni, supprime tous les objets `PerformanceMark` de la chronologie des performances. Si `name` est fourni, supprime uniquement la marque nommée.

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. |
| v16.7.0 | Ajouté dans : v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si `name` n'est pas fourni, supprime tous les objets `PerformanceMeasure` de la chronologie des performances. Si `name` est fourni, supprime uniquement la mesure nommée.

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si `name` n'est pas fourni, supprime tous les objets `PerformanceResourceTiming` de la chronologie des ressources. Si `name` est fourni, supprime uniquement la ressource nommée.

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Ajouté dans : v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le résultat d'un appel précédent à `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le résultat d'un appel précédent à `eventLoopUtilization()` avant `utilization1`.
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La méthode `eventLoopUtilization()` retourne un objet qui contient la durée cumulative du temps pendant lequel la boucle d'événements a été à la fois inactive et active en tant que temporisateur en millisecondes haute résolution. La valeur `utilization` est l'utilisation calculée de la boucle d'événements (ELU).

Si l'amorçage n'est pas encore terminé sur le thread principal, les propriétés ont la valeur `0`. L'ELU est immédiatement disponible sur les [threads Worker](/fr/nodejs/api/worker_threads#worker-threads) car l'amorçage se produit dans la boucle d'événements.

`utilization1` et `utilization2` sont des paramètres facultatifs.

Si `utilization1` est passé, alors le delta entre les temps `active` et `idle` de l'appel actuel, ainsi que la valeur `utilization` correspondante, sont calculés et retournés (similaire à [`process.hrtime()`](/fr/nodejs/api/process#processhrtimetime)).

Si `utilization1` et `utilization2` sont tous deux passés, alors le delta est calculé entre les deux arguments. Il s'agit d'une option pratique car, contrairement à [`process.hrtime()`](/fr/nodejs/api/process#processhrtimetime), le calcul de l'ELU est plus complexe qu'une simple soustraction.

L'ELU est similaire à l'utilisation du CPU, sauf qu'elle ne mesure que les statistiques de la boucle d'événements et non l'utilisation du CPU. Elle représente le pourcentage de temps que la boucle d'événements a passé en dehors du fournisseur d'événements de la boucle d'événements (par exemple, `epoll_wait`). Aucun autre temps d'inactivité du CPU n'est pris en compte. Voici un exemple de la façon dont un processus principalement inactif aura une ELU élevée.

::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

Bien que le CPU soit principalement inactif pendant l'exécution de ce script, la valeur de `utilization` est `1`. En effet, l'appel à [`child_process.spawnSync()`](/fr/nodejs/api/child_process#child_processspawnsynccommand-args-options) empêche la boucle d'événements de progresser.

Passer un objet défini par l'utilisateur au lieu du résultat d'un appel précédent à `eventLoopUtilization()` conduira à un comportement non défini. Les valeurs de retour ne sont pas garanties de refléter un état correct de la boucle d'événements.


### `performance.getEntries()` {#performancegetentries}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. |
| v16.7.0 | Ajoutée dans : v16.7.0 |
:::

- Retourne : [\<PerformanceEntry[]\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Retourne une liste d'objets `PerformanceEntry` par ordre chronologique par rapport à `performanceEntry.startTime`. Si vous êtes uniquement intéressé par les entrées de performance de certains types ou qui ont certains noms, consultez `performance.getEntriesByType()` et `performance.getEntriesByName()`.

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. |
| v16.7.0 | Ajoutée dans : v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<PerformanceEntry[]\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Retourne une liste d'objets `PerformanceEntry` par ordre chronologique par rapport à `performanceEntry.startTime` dont `performanceEntry.name` est égal à `name` et, éventuellement, dont `performanceEntry.entryType` est égal à `type`.

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. |
| v16.7.0 | Ajoutée dans : v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<PerformanceEntry[]\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Retourne une liste d'objets `PerformanceEntry` par ordre chronologique par rapport à `performanceEntry.startTime` dont `performanceEntry.entryType` est égal à `type`.

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. L'argument name n'est plus optionnel. |
| v16.0.0 | Mis à jour pour se conformer à la spécification User Timing Level 3. |
| v8.5.0 | Ajoutée dans : v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Détail optionnel supplémentaire à inclure avec la marque.
  - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un horodatage optionnel à utiliser comme heure de la marque. **Par défaut** : `performance.now()`.

Crée une nouvelle entrée `PerformanceMark` dans la Performance Timeline. Une `PerformanceMark` est une sous-classe de `PerformanceEntry` dont `performanceEntry.entryType` est toujours `'mark'`, et dont `performanceEntry.duration` est toujours `0`. Les marques de performance sont utilisées pour marquer des moments importants spécifiques dans la Performance Timeline.

L'entrée `PerformanceMark` créée est placée dans la Performance Timeline globale et peut être interrogée avec `performance.getEntries`, `performance.getEntriesByName` et `performance.getEntriesByType`. Lorsque l'observation est effectuée, les entrées doivent être effacées manuellement de la Performance Timeline globale avec `performance.clearMarks`.


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.2.0 | Ajout des arguments bodyInfo, responseStatus et deliveryType. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Timing Info](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL de la ressource
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom de l'initiateur, par exemple : 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le mode de cache doit être une chaîne vide ('') ou 'local'
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Fetch Response Body Info](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le code d'état de la réponse
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type de livraison. **Par défaut :** `''`.

*Cette propriété est une extension de Node.js. Elle n'est pas disponible dans les navigateurs Web.*

Crée une nouvelle entrée `PerformanceResourceTiming` dans la Timeline des ressources. Un `PerformanceResourceTiming` est une sous-classe de `PerformanceEntry` dont `performanceEntry.entryType` est toujours `'resource'`. Les ressources de performance sont utilisées pour marquer des moments dans la Timeline des ressources.

L'entrée `PerformanceMark` créée est placée dans la Timeline des ressources globale et peut être interrogée avec `performance.getEntries`, `performance.getEntriesByName` et `performance.getEntriesByType`. Lorsque l'observation est effectuée, les entrées doivent être effacées manuellement de la Timeline des performances globale avec `performance.clearResourceTimings`.


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. |
| v16.0.0 | Mise à jour pour être conforme à la spécification User Timing Level 3. |
| v13.13.0, v12.16.3 | Les paramètres `startMark` et `endMark` sont rendus optionnels. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionnel.
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Détail optionnel supplémentaire à inclure avec la mesure.
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Durée entre les heures de début et de fin.
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Horodatage à utiliser comme heure de fin, ou une chaîne identifiant une marque précédemment enregistrée.
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Horodatage à utiliser comme heure de début, ou une chaîne identifiant une marque précédemment enregistrée.


- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Optionnel. Doit être omis si `startMarkOrOptions` est un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Crée une nouvelle entrée `PerformanceMeasure` dans la Performance Timeline. Un `PerformanceMeasure` est une sous-classe de `PerformanceEntry` dont `performanceEntry.entryType` est toujours `'measure'`, et dont `performanceEntry.duration` mesure le nombre de millisecondes écoulées entre `startMark` et `endMark`.

L'argument `startMark` peut identifier n'importe quel `PerformanceMark` *existant* dans la Performance Timeline, ou *peut* identifier l'une des propriétés d'horodatage fournies par la classe `PerformanceNodeTiming`. Si le `startMark` nommé n'existe pas, une erreur est renvoyée.

L'argument optionnel `endMark` doit identifier n'importe quel `PerformanceMark` *existant* dans la Performance Timeline ou l'une des propriétés d'horodatage fournies par la classe `PerformanceNodeTiming`. `endMark` sera `performance.now()` si aucun paramètre n'est passé, sinon, si le `endMark` nommé n'existe pas, une erreur sera renvoyée.

L'entrée `PerformanceMeasure` créée est placée dans la Performance Timeline globale et peut être interrogée avec `performance.getEntries`, `performance.getEntriesByName` et `performance.getEntriesByType`. Lorsque l'observation est effectuée, les entrées doivent être effacées manuellement de la Performance Timeline globale avec `performance.clearMeasures`.


### `performance.nodeTiming` {#performancenodetiming}

**Ajouté dans : v8.5.0**

- [\<PerformanceNodeTiming\>](/fr/nodejs/api/perf_hooks#class-performancenodetiming)

*Cette propriété est une extension de Node.js. Elle n’est pas disponible dans les navigateurs Web.*

Une instance de la classe `PerformanceNodeTiming` qui fournit des mesures de performance pour des étapes opérationnelles spécifiques de Node.js.

### `performance.now()` {#performancenow}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l’objet `performance` comme récepteur. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne l’horodatage actuel en millisecondes à haute résolution, où 0 représente le début du processus `node` actuel.

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l’objet `performance` comme récepteur. |
| v18.8.0 | Ajouté dans : v18.8.0 |
:::

Définit la taille globale de la mémoire tampon de minutage des ressources de performance au nombre spécifié d’objets d’entrée de performance de type « resource ».

Par défaut, la taille maximale de la mémoire tampon est définie sur 250.

### `performance.timeOrigin` {#performancetimeorigin}

**Ajouté dans : v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin) spécifie l’horodatage en millisecondes à haute résolution auquel le processus `node` actuel a commencé, mesuré en temps Unix.

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Ajout de l’option histogram. |
| v16.0.0 | Réimplémenté pour utiliser du JavaScript pur et la possibilité de chronométrer les fonctions asynchrones. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `histogram` [\<RecordableHistogram\>](/fr/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) Un objet histogramme créé à l’aide de `perf_hooks.createHistogram()` qui enregistrera les durées d’exécution en nanosecondes.
  
 

*Cette propriété est une extension de Node.js. Elle n’est pas disponible dans les navigateurs Web.*

Encapsule une fonction dans une nouvelle fonction qui mesure le temps d’exécution de la fonction encapsulée. Un `PerformanceObserver` doit être abonné au type d’événement `'function'` pour que les détails de synchronisation soient accessibles.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```
:::

Si la fonction encapsulée retourne une promesse, un gestionnaire finally sera attaché à la promesse et la durée sera signalée une fois que le gestionnaire finally sera appelé.


### `performance.toJSON()` {#performancetojson}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `performance` comme récepteur. |
| v16.1.0 | Ajoutée dans : v16.1.0 |
:::

Un objet qui est une représentation JSON de l'objet `performance`. Il est similaire à [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON) dans les navigateurs.

#### Événement : `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**Ajoutée dans : v18.8.0**

L'événement `'resourcetimingbufferfull'` est déclenché lorsque la mémoire tampon globale de synchronisation des ressources de performance est pleine. Ajustez la taille de la mémoire tampon de synchronisation des ressources avec `performance.setResourceTimingBufferSize()` ou effacez la mémoire tampon avec `performance.clearResourceTimings()` dans l'écouteur d'événements pour permettre à davantage d'entrées d'être ajoutées à la mémoire tampon de la timeline de performance.

## Class: `PerformanceEntry` {#class-performanceentry}

**Ajoutée dans : v8.5.0**

Le constructeur de cette classe n'est pas directement exposé aux utilisateurs.

### `performanceEntry.duration` {#performanceentryduration}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Ce getter de propriété doit être appelé avec l'objet `PerformanceEntry` comme récepteur. |
| v8.5.0 | Ajoutée dans : v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre total de millisecondes écoulées pour cette entrée. Cette valeur n'aura pas de sens pour tous les types d'entrée de performance.

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Ce getter de propriété doit être appelé avec l'objet `PerformanceEntry` comme récepteur. |
| v8.5.0 | Ajoutée dans : v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le type de l'entrée de performance. Il peut être l'un des suivants :

- `'dns'` (Node.js uniquement)
- `'function'` (Node.js uniquement)
- `'gc'` (Node.js uniquement)
- `'http2'` (Node.js uniquement)
- `'http'` (Node.js uniquement)
- `'mark'` (disponible sur le Web)
- `'measure'` (disponible sur le Web)
- `'net'` (Node.js uniquement)
- `'node'` (Node.js uniquement)
- `'resource'` (disponible sur le Web)


### `performanceEntry.name` {#performanceentryname}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceEntry` comme récepteur. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le nom de l'entrée de performance.

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceEntry` comme récepteur. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'horodatage en millisecondes haute résolution marquant l'heure de début de l'entrée de performance.

## Classe : `PerformanceMark` {#class-performancemark}

**Ajouté dans : v18.2.0, v16.17.0**

- Étend : [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Expose les marques créées via la méthode `Performance.mark()`.

### `performanceMark.detail` {#performancemarkdetail}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceMark` comme récepteur. |
| v16.0.0 | Ajouté dans : v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Détail supplémentaire spécifié lors de la création avec la méthode `Performance.mark()`.

## Classe : `PerformanceMeasure` {#class-performancemeasure}

**Ajouté dans : v18.2.0, v16.17.0**

- Étend : [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Expose les mesures créées via la méthode `Performance.measure()`.

Le constructeur de cette classe n'est pas directement exposé aux utilisateurs.

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceMeasure` comme récepteur. |
| v16.0.0 | Ajouté dans : v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Détail supplémentaire spécifié lors de la création avec la méthode `Performance.measure()`.


## Classe : `PerformanceNodeEntry` {#class-performancenodeentry}

**Ajouté dans : v19.0.0**

- Hérite de : [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

*Cette classe est une extension de Node.js. Elle n’est pas disponible dans les navigateurs Web.*

Fournit des données de synchronisation Node.js détaillées.

Le constructeur de cette classe n’est pas directement exposé aux utilisateurs.

### `performanceNodeEntry.detail` {#performancenodeentrydetail}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Ce getter de propriété doit être appelé avec l’objet `PerformanceNodeEntry` comme récepteur. |
| v16.0.0 | Ajouté dans : v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Détails supplémentaires spécifiques au `entryType`.

### `performanceNodeEntry.flags` {#performancenodeentryflags}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Obsolète lors de l’exécution. Maintenant déplacé vers la propriété detail lorsque entryType est 'gc'. |
| v13.9.0, v12.17.0 | Ajouté dans : v13.9.0, v12.17.0 |
:::

::: danger [Stable : 0 - Obsolète]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Obsolète : Utilisez plutôt `performanceNodeEntry.detail`.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lorsque `performanceEntry.entryType` est égal à `'gc'`, la propriété `performance.flags` contient des informations supplémentaires sur l’opération de garbage collection. La valeur peut être l’une des suivantes :

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Obsolète lors de l’exécution. Maintenant déplacé vers la propriété detail lorsque entryType est 'gc'. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

::: danger [Stable : 0 - Obsolète]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Obsolète : Utilisez plutôt `performanceNodeEntry.detail`.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lorsque `performanceEntry.entryType` est égal à `'gc'`, la propriété `performance.kind` identifie le type d’opération de garbage collection qui s’est produite. La valeur peut être l’une des suivantes :

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### Détails du ramasse-miettes ('gc') {#garbage-collection-gc-details}

Quand `performanceEntry.type` est égal à `'gc'`, la propriété `performanceNodeEntry.detail` sera un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) avec deux propriétés :

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un parmi :
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
  
 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un parmi :
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`
  
 

### Détails HTTP ('http') {#http-http-details}

Quand `performanceEntry.type` est égal à `'http'`, la propriété `performanceNodeEntry.detail` sera un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant des informations supplémentaires.

Si `performanceEntry.name` est égal à `HttpClient`, le `detail` contiendra les propriétés suivantes : `req`, `res`. Et la propriété `req` sera un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant `method`, `url`, `headers`, la propriété `res` sera un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant `statusCode`, `statusMessage`, `headers`.

Si `performanceEntry.name` est égal à `HttpRequest`, le `detail` contiendra les propriétés suivantes : `req`, `res`. Et la propriété `req` sera un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant `method`, `url`, `headers`, la propriété `res` sera un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant `statusCode`, `statusMessage`, `headers`.

Cela pourrait ajouter une surcharge mémoire supplémentaire et ne devrait être utilisé qu'à des fins de diagnostic, et non être activé en production par défaut.


### Détails HTTP/2 ('http2') {#http/2-http2-details}

Quand `performanceEntry.type` est égal à `'http2'`, la propriété `performanceNodeEntry.detail` sera un [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant des informations de performance additionnelles.

Si `performanceEntry.name` est égal à `Http2Stream`, le `detail` contiendra les propriétés suivantes :

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets de trame `DATA` reçus pour ce `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets de trame `DATA` envoyés pour ce `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'identifiant du `Http2Stream` associé.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes écoulées entre le `startTime` de `PerformanceEntry` et la réception de la première trame `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes écoulées entre le `startTime` de `PerformanceEntry` et l'envoi de la première trame `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes écoulées entre le `startTime` de `PerformanceEntry` et la réception du premier en-tête.

Si `performanceEntry.name` est égal à `Http2Session`, le `detail` contiendra les propriétés suivantes :

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets reçus pour cette `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets envoyés pour cette `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de trames HTTP/2 reçues par la `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de trames HTTP/2 envoyées par la `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre maximum de flux ouverts simultanément pendant la durée de vie de la `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes écoulées depuis la transmission d'une trame `PING` et la réception de son accusé de réception. Présent uniquement si une trame `PING` a été envoyée sur la `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durée moyenne (en millisecondes) pour toutes les instances `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'instances `Http2Stream` traitées par la `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'server'` soit `'client'` pour identifier le type de `Http2Session`.


### Timerify ('function') Détails {#timerify-function-details}

Quand `performanceEntry.type` est égal à `'function'`, la propriété `performanceNodeEntry.detail` sera un [\<Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array) listant les arguments d'entrée de la fonction chronométrée.

### Net ('net') Détails {#net-net-details}

Quand `performanceEntry.type` est égal à `'net'`, la propriété `performanceNodeEntry.detail` sera un [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant des informations supplémentaires.

Si `performanceEntry.name` est égal à `connect`, le `detail` contiendra les propriétés suivantes : `host`, `port`.

### DNS ('dns') Détails {#dns-dns-details}

Quand `performanceEntry.type` est égal à `'dns'`, la propriété `performanceNodeEntry.detail` sera un [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) contenant des informations supplémentaires.

Si `performanceEntry.name` est égal à `lookup`, le `detail` contiendra les propriétés suivantes : `hostname`, `family`, `hints`, `verbatim`, `addresses`.

Si `performanceEntry.name` est égal à `lookupService`, le `detail` contiendra les propriétés suivantes : `host`, `port`, `hostname`, `service`.

Si `performanceEntry.name` est égal à `queryxxx` ou `getHostByAddr`, le `detail` contiendra les propriétés suivantes : `host`, `ttl`, `result`. La valeur de `result` est la même que le résultat de `queryxxx` ou `getHostByAddr`.

## Class : `PerformanceNodeTiming` {#class-performancenodetiming}

**Ajouté dans : v8.5.0**

- Étend : [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

*Cette propriété est une extension de Node.js. Elle n’est pas disponible dans les navigateurs Web.*

Fournit des détails de synchronisation pour Node.js lui-même. Le constructeur de cette classe n’est pas exposé aux utilisateurs.

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**Ajouté dans : v8.5.0**

- [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes haute résolution auquel le processus Node.js a terminé l’amorçage. Si l’amorçage n’est pas encore terminé, la propriété a la valeur -1.


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**Ajouté dans : v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes haute résolution auquel l’environnement Node.js a été initialisé.

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**Ajouté dans : v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes haute résolution du temps pendant lequel la boucle d’événements a été inactive dans le fournisseur d’événements de la boucle d’événements (par exemple, `epoll_wait`). Ceci ne tient pas compte de l’utilisation du CPU. Si la boucle d’événements n’a pas encore démarré (par exemple, dans le premier tick du script principal), la propriété a la valeur 0.

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**Ajouté dans : v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes haute résolution auquel la boucle d’événements Node.js s’est terminée. Si la boucle d’événements n’est pas encore terminée, la propriété a la valeur -1. Elle ne peut avoir une valeur différente de -1 que dans un gestionnaire de l’événement [`'exit'`](/fr/nodejs/api/process#event-exit).

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**Ajouté dans : v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes haute résolution auquel la boucle d’événements Node.js a démarré. Si la boucle d’événements n’a pas encore démarré (par exemple, dans le premier tick du script principal), la propriété a la valeur -1.

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**Ajouté dans : v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes haute résolution auquel le processus Node.js a été initialisé.

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**Ajouté dans : v22.8.0, v20.18.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’itérations de la boucle d’événements.
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’événements qui ont été traités par le gestionnaire d’événements.
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’événements qui attendaient d’être traités lorsque le fournisseur d’événements a été appelé.

Ceci est un wrapper de la fonction `uv_metrics_info`. Il retourne l’ensemble actuel des métriques de la boucle d’événements.

Il est recommandé d’utiliser cette propriété à l’intérieur d’une fonction dont l’exécution a été planifiée à l’aide de `setImmediate` pour éviter de collecter des métriques avant de terminer toutes les opérations planifiées pendant l’itération de la boucle actuelle.

::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**Ajouté dans : v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes à haute résolution auquel la plateforme V8 a été initialisée.

## Classe : `PerformanceResourceTiming` {#class-performanceresourcetiming}

**Ajouté dans : v18.2.0, v16.17.0**

- Hérite de : [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Fournit des données de minutage réseau détaillées concernant le chargement des ressources d’une application.

Le constructeur de cette classe n’est pas directement exposé aux utilisateurs.

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Ce getter de propriété doit être appelé avec l’objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes à haute résolution immédiatement avant la répartition de la requête `fetch`. Si la ressource n’est pas interceptée par un worker, la propriété renvoie toujours 0.

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Ce getter de propriété doit être appelé avec l’objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes à haute résolution qui représente l’heure de début de la récupération qui initie la redirection.

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Ce getter de propriété doit être appelé avec l’objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’horodatage en millisecondes à haute résolution qui sera créé immédiatement après la réception du dernier octet de la réponse de la dernière redirection.


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Le getter de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le timestamp en millisecondes à haute résolution juste avant que Node.js ne commence à récupérer la ressource.

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Le getter de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le timestamp en millisecondes à haute résolution juste avant que Node.js ne commence la recherche du nom de domaine pour la ressource.

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Le getter de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le timestamp en millisecondes à haute résolution représentant le moment immédiatement après que Node.js ait terminé la recherche du nom de domaine pour la ressource.

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Le getter de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le timestamp en millisecondes à haute résolution représentant le moment immédiatement avant que Node.js ne commence à établir la connexion au serveur pour récupérer la ressource.


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'horodatage en millisecondes haute résolution représentant le moment immédiatement après que Node.js a terminé d'établir la connexion au serveur pour récupérer la ressource.

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'horodatage en millisecondes haute résolution représentant le moment immédiatement avant que Node.js ne démarre le processus de négociation pour sécuriser la connexion actuelle.

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'horodatage en millisecondes haute résolution représentant le moment immédiatement avant que Node.js ne reçoive le premier octet de la réponse du serveur.

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'horodatage en millisecondes haute résolution représentant le moment immédiatement après que Node.js a reçu le dernier octet de la ressource ou immédiatement avant la fermeture de la connexion de transport, selon la première éventualité.


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajoutée dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#number_type)

Un nombre représentant la taille (en octets) de la ressource récupérée. La taille inclut les champs d'en-tête de réponse plus le corps de la charge utile de réponse.

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajoutée dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#number_type)

Un nombre représentant la taille (en octets) reçue de la requête (HTTP ou cache) du corps de la charge utile, avant de supprimer tout codage de contenu appliqué.

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'accesseur de cette propriété doit être appelé avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajoutée dans : v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#number_type)

Un nombre représentant la taille (en octets) reçue de la requête (HTTP ou cache) du corps du message, après avoir supprimé tout codage de contenu appliqué.

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cette méthode doit être appelée avec l'objet `PerformanceResourceTiming` comme récepteur. |
| v18.2.0, v16.17.0 | Ajoutée dans : v18.2.0, v16.17.0 |
:::

Renvoie un `object` qui est la représentation JSON de l'objet `PerformanceResourceTiming`.

## Classe : `PerformanceObserver` {#class-performanceobserver}

**Ajoutée dans : v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**Ajoutée dans : v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#string_type)

Récupérer les types supportés.


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `list` [\<PerformanceObserverEntryList\>](/fr/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/fr/nodejs/api/perf_hooks#class-performanceobserver)
  
 

Les objets `PerformanceObserver` fournissent des notifications lorsque de nouvelles instances `PerformanceEntry` ont été ajoutées à la chronologie des performances (Performance Timeline).



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

Étant donné que les instances `PerformanceObserver` introduisent leurs propres frais de performance supplémentaires, les instances ne doivent pas rester abonnées indéfiniment aux notifications. Les utilisateurs doivent déconnecter les observers dès qu'ils ne sont plus nécessaires.

Le `callback` est invoqué lorsqu'un `PerformanceObserver` est notifié de nouvelles instances `PerformanceEntry`. Le rappel reçoit une instance `PerformanceObserverEntryList` et une référence au `PerformanceObserver`.

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**Ajouté dans : v8.5.0**

Déconnecte l'instance `PerformanceObserver` de toutes les notifications.


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.7.0 | Mis à jour pour se conformer à Performance Timeline Level 2. L'option buffered a été rajoutée. |
| v16.0.0 | Mis à jour pour se conformer à User Timing Level 3. L'option buffered a été supprimée. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un seul type [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry). Ne doit pas être fourni si `entryTypes` est déjà spécifié.
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tableau de chaînes identifiant les types d'instances [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry) qui intéressent l'observateur. Si elle n'est pas fournie, une erreur sera levée.
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si true, le callback de l'observateur est appelé avec une liste d'entrées `PerformanceEntry` globales mises en mémoire tampon. Si false, seules les `PerformanceEntry` créées après le point temporel sont envoyées au callback de l'observateur. **Par défaut :** `false`.


Abonne l'instance de [\<PerformanceObserver\>](/fr/nodejs/api/perf_hooks#class-performanceobserver) aux notifications des nouvelles instances de [\<PerformanceEntry\>](/fr/nodejs/api/perf_hooks#class-performanceentry) identifiées soit par `options.entryTypes`, soit par `options.type` :

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // Appelé une fois de manière asynchrone. `list` contient trois éléments.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // Appelé une fois de manière asynchrone. `list` contient trois éléments.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**Ajouté dans : v16.0.0**

- Retourne : [\<PerformanceEntry[]\>](/fr/nodejs/api/perf_hooks#class-performanceentry) Liste actuelle des entrées stockées dans l'observateur de performance, en la vidant.

## Classe : `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**Ajouté dans : v8.5.0**

La classe `PerformanceObserverEntryList` est utilisée pour fournir un accès aux instances `PerformanceEntry` passées à un `PerformanceObserver`. Le constructeur de cette classe n'est pas exposé aux utilisateurs.

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**Ajouté dans : v8.5.0**

- Retourne : [\<PerformanceEntry[]\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Retourne une liste d'objets `PerformanceEntry` dans l'ordre chronologique par rapport à `performanceEntry.startTime`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**Ajouté dans : v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<PerformanceEntry[]\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Retourne une liste d'objets `PerformanceEntry` dans l'ordre chronologique par rapport à `performanceEntry.startTime` dont `performanceEntry.name` est égal à `name`, et éventuellement, dont `performanceEntry.entryType` est égal à `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**Ajouté dans : v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<PerformanceEntry[]\>](/fr/nodejs/api/perf_hooks#class-performanceentry)

Retourne une liste d'objets `PerformanceEntry` dans l'ordre chronologique par rapport à `performanceEntry.startTime` dont la propriété `performanceEntry.entryType` est égale à `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**Ajouté dans : v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `lowest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) La valeur discernable la plus basse. Doit être une valeur entière supérieure à 0. **Par défaut :** `1`.
  - `highest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) La valeur enregistrable la plus élevée. Doit être une valeur entière égale ou supérieure à deux fois `lowest`. **Par défaut :** `Number.MAX_SAFE_INTEGER`.
  - `figures` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de chiffres de précision. Doit être un nombre compris entre `1` et `5`. **Par défaut :** `3`.

- Retourne : [\<RecordableHistogram\>](/fr/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Retourne un [\<RecordableHistogram\>](/fr/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram).


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**Ajouté dans: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le taux d'échantillonnage en millisecondes. Doit être supérieur à zéro. **Par défaut:** `10`.


- Retourne: [\<IntervalHistogram\>](/fr/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*Cette propriété est une extension de Node.js. Elle n'est pas disponible dans les navigateurs Web.*

Crée un objet `IntervalHistogram` qui échantillonne et rapporte le délai de la boucle d'événements au fil du temps. Les délais seront rapportés en nanosecondes.

L'utilisation d'un minuteur pour détecter le délai approximatif de la boucle d'événements fonctionne car l'exécution des minuteurs est spécifiquement liée au cycle de vie de la boucle d'événements libuv. C'est-à-dire qu'un délai dans la boucle entraînera un délai dans l'exécution du minuteur, et ces délais sont précisément ce que cette API est destinée à détecter.

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## Classe : `Histogram` {#class-histogram}

**Ajouté dans : v11.10.0**

### `histogram.count` {#histogramcount}

**Ajouté dans : v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre d'échantillons enregistrés par l'histogramme.

### `histogram.countBigInt` {#histogramcountbigint}

**Ajouté dans : v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Le nombre d'échantillons enregistrés par l'histogramme.


### `histogram.exceeds` {#histogramexceeds}

**Ajouté dans : v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre de fois où le délai de la boucle d'événements a dépassé le seuil maximal d'une heure.

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**Ajouté dans : v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Le nombre de fois où le délai de la boucle d'événements a dépassé le seuil maximal d'une heure.

### `histogram.max` {#histogrammax}

**Ajouté dans : v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le délai maximal enregistré de la boucle d'événements.

### `histogram.maxBigInt` {#histogrammaxbigint}

**Ajouté dans : v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Le délai maximal enregistré de la boucle d'événements.

### `histogram.mean` {#histogrammean}

**Ajouté dans : v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La moyenne des délais enregistrés de la boucle d'événements.

### `histogram.min` {#histogrammin}

**Ajouté dans : v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le délai minimal enregistré de la boucle d'événements.

### `histogram.minBigInt` {#histogramminbigint}

**Ajouté dans : v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Le délai minimal enregistré de la boucle d'événements.

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**Ajouté dans : v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Une valeur de percentile dans la plage (0, 100].
- Returns : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne la valeur au percentile donné.

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**Ajouté dans : v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Une valeur de percentile dans la plage (0, 100].
- Returns : [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Retourne la valeur au percentile donné.


### `histogram.percentiles` {#histogrampercentiles}

**Ajouté dans : v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Retourne un objet `Map` détaillant la distribution percentile accumulée.

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**Ajouté dans : v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Retourne un objet `Map` détaillant la distribution percentile accumulée.

### `histogram.reset()` {#histogramreset}

**Ajouté dans : v11.10.0**

Réinitialise les données de l’histogramme collectées.

### `histogram.stddev` {#histogramstddev}

**Ajouté dans : v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L’écart type des délais de la boucle d’événements enregistrés.

## Class: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

Un `Histogram` qui est mis à jour périodiquement à un intervalle donné.

### `histogram.disable()` {#histogramdisable}

**Ajouté dans : v11.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Désactive le temporisateur d’intervalle de mise à jour. Retourne `true` si le temporisateur a été arrêté, `false` s’il était déjà arrêté.

### `histogram.enable()` {#histogramenable}

**Ajouté dans : v11.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Active le temporisateur d’intervalle de mise à jour. Retourne `true` si le temporisateur a été démarré, `false` s’il était déjà démarré.

### Cloner un `IntervalHistogram` {#cloning-an-intervalhistogram}

Les instances [\<IntervalHistogram\>](/fr/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) peuvent être clonées via [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport). À l’extrémité de réception, l’histogramme est cloné en tant qu’objet [\<Histogram\>](/fr/nodejs/api/perf_hooks#class-histogram) brut qui n’implémente pas les méthodes `enable()` et `disable()`.

## Class: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**Ajouté dans : v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**Ajouté dans : v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/fr/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Ajoute les valeurs de `other` à cet histogramme.


### `histogram.record(val)` {#histogramrecordval}

**Ajouté dans : v15.9.0, v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) La valeur à enregistrer dans l'histogramme.

### `histogram.recordDelta()` {#histogramrecorddelta}

**Ajouté dans : v15.9.0, v14.18.0**

Calcule la quantité de temps (en nanosecondes) qui s'est écoulée depuis l'appel précédent à `recordDelta()` et enregistre cette quantité dans l'histogramme.

## Exemples {#examples}

### Mesurer la durée des opérations asynchrones {#measuring-the-duration-of-async-operations}

L'exemple suivant utilise les API [Hooks Async](/fr/nodejs/api/async_hooks) et Performance pour mesurer la durée réelle d'une opération Timeout (y compris le temps nécessaire à l'exécution du callback).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### Mesurer le temps nécessaire pour charger les dépendances {#measuring-how-long-it-takes-to-load-dependencies}

L'exemple suivant mesure la durée des opérations `require()` pour charger les dépendances :

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Activer l'observateur
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey patch la fonction require
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Activer l'observateur
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### Mesurer la durée d'un aller-retour HTTP {#measuring-how-long-one-http-round-trip-takes}

L'exemple suivant est utilisé pour suivre le temps passé par le client HTTP (`OutgoingMessage`) et la requête HTTP (`IncomingMessage`). Pour le client HTTP, cela signifie l'intervalle de temps entre le début de la requête et la réception de la réponse, et pour la requête HTTP, cela signifie l'intervalle de temps entre la réception de la requête et l'envoi de la réponse :

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::


### Mesurer le temps que prend `net.connect` (uniquement pour TCP) lorsque la connexion réussit {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### Mesurer le temps que prend le DNS lorsque la requête réussit {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

