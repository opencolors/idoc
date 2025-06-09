---
title: Minuteries JavaScript - setTimeout et setInterval
description: Découvrez comment utiliser les minuteries JavaScript pour retarder l'exécution des fonctions et planifier des tâches avec setTimeout et setInterval.
head:
  - - meta
    - name: og:title
      content: Minuteries JavaScript - setTimeout et setInterval | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment utiliser les minuteries JavaScript pour retarder l'exécution des fonctions et planifier des tâches avec setTimeout et setInterval.
  - - meta
    - name: twitter:title
      content: Minuteries JavaScript - setTimeout et setInterval | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment utiliser les minuteries JavaScript pour retarder l'exécution des fonctions et planifier des tâches avec setTimeout et setInterval.
---


# Découvrir les temporisateurs JavaScript

### `setTimeout()`

Lorsque vous écrivez du code JavaScript, vous pouvez souhaiter retarder l'exécution d'une fonction.

C'est le rôle de `setTimeout`. Vous spécifiez une fonction de rappel à exécuter plus tard, et une valeur exprimant combien de temps plus tard vous voulez qu'elle s'exécute, en millisecondes :

```js
setTimeout(() => {
  // s'exécute après 2 secondes
}, 2000);
setTimeout(() => {
  // s'exécute après 50 millisecondes
}, 50);
```

Cette syntaxe définit une nouvelle fonction. Vous pouvez appeler n'importe quelle autre fonction que vous voulez à l'intérieur, ou vous pouvez passer un nom de fonction existant, et un ensemble de paramètres :

```js
const myFunction = (firstParam, secondParam) => {
  // faire quelque chose
};
// s'exécute après 2 secondes
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout` renvoie l'identifiant du temporisateur. Il n'est généralement pas utilisé, mais vous pouvez stocker cet identifiant, et l'effacer si vous voulez supprimer l'exécution de cette fonction planifiée :

```js
const id = setTimeout(() => {
  // devrait s'exécuter après 2 secondes
}, 2000);
// J'ai changé d'avis
clearTimeout(id);
```

## Délai nul

Si vous spécifiez un délai d'attente de 0, la fonction de rappel sera exécutée dès que possible, mais après l'exécution de la fonction actuelle :

```js
setTimeout(() => {
  console.log('après ');
}, 0);
console.log(' avant ');
```

Ce code affichera

```bash
avant
après
```

C'est particulièrement utile pour éviter de bloquer le CPU sur des tâches intensives et permettre à d'autres fonctions d'être exécutées tout en effectuant un calcul lourd, en mettant en file d'attente les fonctions dans le planificateur.

::: tip
Certains navigateurs (IE et Edge) implémentent une méthode `setImmediate()` qui fait exactement la même chose, mais elle n'est pas standard et [non disponible sur d'autres navigateurs](https://caniuse.com/#feat=setimmediate). Mais c'est une fonction standard dans Node.js.
:::

### `setInterval()`

`setInterval` est une fonction similaire à `setTimeout`, avec une différence : au lieu d'exécuter la fonction de rappel une seule fois, elle l'exécutera indéfiniment, à l'intervalle de temps spécifique que vous spécifiez (en millisecondes) :

```js
setInterval(() => {
  // s'exécute toutes les 2 secondes
}, 2000);
```

La fonction ci-dessus s'exécute toutes les 2 secondes, sauf si vous lui demandez de s'arrêter, en utilisant `clearInterval`, en lui passant l'identifiant d'intervalle que `setInterval` a renvoyé :

```js
const id = setInterval(() => {
  // s'exécute toutes les 2 secondes
}, 2000);
// J'ai changé d'avis
clearInterval(id);
```

Il est courant d'appeler `clearInterval` à l'intérieur de la fonction de rappel `setInterval`, pour lui permettre de déterminer automatiquement si elle doit s'exécuter à nouveau ou s'arrêter. Par exemple, ce code exécute quelque chose à moins que App.somethingIWait ait la valeur arrived :


## setTimeout Récursif

`setInterval` lance une fonction toutes les n millisecondes, sans tenir compte du moment où une fonction a terminé son exécution.

Si une fonction prend toujours le même temps, tout va bien.

Peut-être que la fonction prend des temps d'exécution différents, en fonction des conditions du réseau.

Et peut-être qu'une longue exécution chevauche la suivante.

Pour éviter cela, vous pouvez programmer un setTimeout récursif à appeler lorsque la fonction de rappel se termine :

```js
const myFunction = () => {
  // faire quelque chose
  setTimeout(myFunction, 1000);
};
setTimeout(myFunction, 1000);
```

`setTimeout` et `setInterval` sont disponibles dans Node.js, via le [module Timers](/fr/nodejs/api/timers).

Node.js fournit également `setImmediate()`, qui équivaut à utiliser `setTimeout(() => {}, 0)`, principalement utilisé pour travailler avec la boucle d'événements Node.js.

