---
title: Événements de traçage de Node.js
description: Documentation sur l'utilisation de l'API des événements de traçage de Node.js pour le profilage de performance et le débogage.
head:
  - - meta
    - name: og:title
      content: Événements de traçage de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentation sur l'utilisation de l'API des événements de traçage de Node.js pour le profilage de performance et le débogage.
  - - meta
    - name: twitter:title
      content: Événements de traçage de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentation sur l'utilisation de l'API des événements de traçage de Node.js pour le profilage de performance et le débogage.
---


# Événements de trace {#trace-events}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

**Code source :** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

Le module `node:trace_events` fournit un mécanisme pour centraliser les informations de traçage générées par V8, le cœur de Node.js et le code de l'espace utilisateur.

Le traçage peut être activé avec l'indicateur de ligne de commande `--trace-event-categories` ou en utilisant le module `node:trace_events`. L'indicateur `--trace-event-categories` accepte une liste de noms de catégories séparés par des virgules.

Les catégories disponibles sont :

- `node` : Un espace réservé vide.
- `node.async_hooks` : Active la capture de données de trace détaillées de [`async_hooks`](/fr/nodejs/api/async_hooks). Les événements [`async_hooks`](/fr/nodejs/api/async_hooks) ont un `asyncId` unique et une propriété spéciale `triggerId` `triggerAsyncId`.
- `node.bootstrap` : Active la capture des étapes importantes du bootstrap de Node.js.
- `node.console` : Active la capture de la sortie de `console.time()` et `console.count()`.
- `node.threadpoolwork.sync` : Active la capture des données de trace pour les opérations synchrones du pool de threads, telles que `blob`, `zlib`, `crypto` et `node_api`.
- `node.threadpoolwork.async` : Active la capture des données de trace pour les opérations asynchrones du pool de threads, telles que `blob`, `zlib`, `crypto` et `node_api`.
- `node.dns.native` : Active la capture des données de trace pour les requêtes DNS.
- `node.net.native` : Active la capture des données de trace pour le réseau.
- `node.environment` : Active la capture des étapes importantes de l'environnement Node.js.
- `node.fs.sync` : Active la capture des données de trace pour les méthodes synchrones du système de fichiers.
- `node.fs_dir.sync` : Active la capture des données de trace pour les méthodes synchrones de répertoire du système de fichiers.
- `node.fs.async` : Active la capture des données de trace pour les méthodes asynchrones du système de fichiers.
- `node.fs_dir.async` : Active la capture des données de trace pour les méthodes asynchrones de répertoire du système de fichiers.
- `node.perf` : Active la capture des mesures de l'[API Performance](/fr/nodejs/api/perf_hooks).
    - `node.perf.usertiming` : Active la capture des mesures et des marques User Timing de l'API Performance uniquement.
    - `node.perf.timerify` : Active la capture des mesures timerify de l'API Performance uniquement.
  
 
- `node.promises.rejections` : Active la capture des données de trace permettant de suivre le nombre de rejets de Promise non gérés et gérés après le rejet.
- `node.vm.script` : Active la capture des données de trace pour les méthodes `runInNewContext()`, `runInContext()` et `runInThisContext()` du module `node:vm`.
- `v8` : Les événements [V8](/fr/nodejs/api/v8) sont liés au GC, à la compilation et à l'exécution.
- `node.http` : Active la capture des données de trace pour les requêtes/réponses http.
- `node.module_timer` : Active la capture des données de trace pour le chargement des modules CJS.

Par défaut, les catégories `node`, `node.async_hooks` et `v8` sont activées.

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
Les versions antérieures de Node.js nécessitaient l'utilisation de l'indicateur `--trace-events-enabled` pour activer les événements de trace. Cette exigence a été supprimée. Cependant, l'indicateur `--trace-events-enabled` *peut* toujours être utilisé et activera par défaut les catégories d'événements de trace `node`, `node.async_hooks` et `v8`.

```bash [BASH]
node --trace-events-enabled

# est équivalent à {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
Alternativement, les événements de trace peuvent être activés à l'aide du module `node:trace_events` :

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // Activer la capture d'événements de trace pour la catégorie 'node.perf'

// faire le travail

tracing.disable();  // Désactiver la capture d'événements de trace pour la catégorie 'node.perf'
```
L'exécution de Node.js avec le traçage activé produira des fichiers journaux qui peuvent être ouverts dans l'onglet [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) de Chrome.

Le fichier journal est appelé par défaut `node_trace.${rotation}.log`, où `${rotation}` est un identifiant de rotation de journal incrémenté. Le modèle de chemin de fichier peut être spécifié avec `--trace-event-file-pattern` qui accepte une chaîne de modèle qui prend en charge `${rotation}` et `${pid}` :

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
Pour garantir que le fichier journal est correctement généré après des événements de signal comme `SIGINT`, `SIGTERM` ou `SIGBREAK`, assurez-vous d'avoir les gestionnaires appropriés dans votre code, tels que :

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Reçu SIGINT.');
  process.exit(130);  // Ou code de sortie applicable selon le système d'exploitation et le signal
});
```
Le système de traçage utilise la même source de temps que celle utilisée par `process.hrtime()`. Cependant, les horodatages des événements de trace sont exprimés en microsecondes, contrairement à `process.hrtime()` qui renvoie des nanosecondes.

Les fonctionnalités de ce module ne sont pas disponibles dans les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker).


## Le module `node:trace_events` {#the-nodetrace_events-module}

**Ajouté dans : v10.0.0**

### Objet `Tracing` {#tracing-object}

**Ajouté dans : v10.0.0**

L'objet `Tracing` est utilisé pour activer ou désactiver le traçage pour des ensembles de catégories. Les instances sont créées à l'aide de la méthode `trace_events.createTracing()`.

Lors de sa création, l'objet `Tracing` est désactivé. L'appel de la méthode `tracing.enable()` ajoute les catégories à l'ensemble des catégories d'événements de trace activées. L'appel de `tracing.disable()` supprimera les catégories de l'ensemble des catégories d'événements de trace activées.

#### `tracing.categories` {#tracingcategories}

**Ajouté dans : v10.0.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Une liste, séparée par des virgules, des catégories d'événements de trace couvertes par cet objet `Tracing`.

#### `tracing.disable()` {#tracingdisable}

**Ajouté dans : v10.0.0**

Désactive cet objet `Tracing`.

Seules les catégories d'événements de trace *non* couvertes par d'autres objets `Tracing` activés et *non* spécifiées par l'indicateur `--trace-event-categories` seront désactivées.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// Prints 'node,node.perf,v8'
console.log(trace_events.getEnabledCategories());

t2.disable(); // Will only disable emission of the 'node.perf' category

// Prints 'node,v8'
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**Ajouté dans : v10.0.0**

Active cet objet `Tracing` pour l'ensemble de catégories couvertes par l'objet `Tracing`.

#### `tracing.enabled` {#tracingenabled}

**Ajouté dans : v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` uniquement si l'objet `Tracing` a été activé.

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**Ajouté dans : v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tableau de noms de catégories de trace. Les valeurs incluses dans le tableau sont converties en chaîne de caractères lorsque cela est possible. Une erreur sera levée si la valeur ne peut pas être convertie.


- Retourne : [\<Tracing\>](/fr/nodejs/api/tracing#tracing-object).

Crée et renvoie un objet `Tracing` pour l'ensemble de `categories` donné.

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// do stuff
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**Ajouté dans : v10.0.0**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne une liste séparée par des virgules de toutes les catégories d'événements de trace actuellement activées. L'ensemble actuel des catégories d'événements de trace activées est déterminé par l'*union* de tous les objets `Tracing` actuellement activés et de toutes les catégories activées à l'aide de l'indicateur `--trace-event-categories`.

Étant donné le fichier `test.js` ci-dessous, la commande `node --trace-event-categories node.perf test.js` affichera `'node.async_hooks,node.perf'` dans la console.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## Exemples {#examples}

### Collecter des données d'événements de trace par l'inspecteur {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // done
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // do something
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```
