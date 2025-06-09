---
title: Comprendre setImmediate() dans Node.js
description: Découvrez comment fonctionne setImmediate() dans Node.js, ses différences avec setTimeout(), process.nextTick() et Promise.then(), ainsi que son interaction avec la boucle d'événements et les files d'attente.
head:
  - - meta
    - name: og:title
      content: Comprendre setImmediate() dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment fonctionne setImmediate() dans Node.js, ses différences avec setTimeout(), process.nextTick() et Promise.then(), ainsi que son interaction avec la boucle d'événements et les files d'attente.
  - - meta
    - name: twitter:title
      content: Comprendre setImmediate() dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment fonctionne setImmediate() dans Node.js, ses différences avec setTimeout(), process.nextTick() et Promise.then(), ainsi que son interaction avec la boucle d'événements et les files d'attente.
---


# Comprendre `setImmediate()`

Quand vous voulez exécuter un morceau de code de manière asynchrone, mais le plus tôt possible, une option est d'utiliser la fonction `setImmediate()` fournie par Node.js :

```js
setImmediate(() => {
    // do something
})
```

Toute fonction passée en argument à `setImmediate()` est un rappel qui est exécuté lors de la prochaine itération de la boucle d'événement.

Quelle est la différence entre `setImmediate()` et `setTimeout(() => {}, 0)` (en passant un délai d'attente de 0 ms), et entre `process.nextTick()` et `Promise.then()` ?

Une fonction passée à `process.nextTick()` va être exécutée lors de l'itération actuelle de la boucle d'événement, après la fin de l'opération en cours. Cela signifie qu'elle s'exécutera toujours avant `setTimeout` et `setImmediate`.

Un rappel `setTimeout()` avec un délai de 0 ms est très similaire à `setImmediate()`. L'ordre d'exécution dépendra de divers facteurs, mais ils seront tous deux exécutés lors de la prochaine itération de la boucle d'événement.

Un rappel `process.nextTick` est ajouté à la **file d'attente process.nextTick**. Un rappel `Promise.then()` est ajouté à la **file d'attente de microtâches** des promesses. Un rappel `setTimeout`, `setImmediate` est ajouté à la **file d'attente de macrotâches**.

La boucle d'événement exécute d'abord les tâches dans la **file d'attente process.nextTick**, puis exécute la **file d'attente de microtâches** des promesses, puis exécute la **file d'attente de macrotâches** `setTimeout` ou `setImmediate`.

Voici un exemple pour montrer l'ordre entre `setImmediate()`, `process.nextTick()` et `Promise.then()` :

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');
const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};
start();
// start foo bar zoo baz
```

Ce code appellera d'abord `start()`, puis appellera `foo()` dans la **file d'attente process.nextTick**. Après cela, il gérera la **file d'attente de microtâches** des promesses, qui affichera bar et ajoutera `zoo()` dans la **file d'attente process.nextTick** en même temps. Ensuite, il appellera `zoo() ` qui vient d'être ajouté. À la fin, `baz()` dans la **file d'attente de macrotâches** est appelé.

Le principe susmentionné est vrai dans les cas CommonJS, mais gardez à l'esprit que dans les modules ES, par exemple les fichiers `mjs`, l'ordre d'exécution sera différent :

```js
// start bar foo zoo baz
```

En effet, le module ES en cours de chargement est encapsulé en tant qu'opération asynchrone, et donc l'ensemble du script se trouve déjà dans la `file d'attente de microtâches` des promesses. Ainsi, lorsque la promesse est immédiatement résolue, son rappel est ajouté à la `file d'attente de microtâches`. Node.js tentera d'effacer la file d'attente avant de passer à une autre file d'attente, et vous verrez donc qu'elle affiche bar en premier.

