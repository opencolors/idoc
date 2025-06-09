---
title: Programmation asynchrone JavaScript et rappels
description: JavaScript est synchrone par défaut, mais il peut gérer les opérations asynchrones via des rappels, qui sont des fonctions passées en arguments à d'autres fonctions et exécutées lorsqu'un événement spécifique se produit.
head:
  - - meta
    - name: og:title
      content: Programmation asynchrone JavaScript et rappels | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScript est synchrone par défaut, mais il peut gérer les opérations asynchrones via des rappels, qui sont des fonctions passées en arguments à d'autres fonctions et exécutées lorsqu'un événement spécifique se produit.
  - - meta
    - name: twitter:title
      content: Programmation asynchrone JavaScript et rappels | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScript est synchrone par défaut, mais il peut gérer les opérations asynchrones via des rappels, qui sont des fonctions passées en arguments à d'autres fonctions et exécutées lorsqu'un événement spécifique se produit.
---


# Programmation asynchrone en JavaScript et Callbacks

## Asynchronisme dans les langages de programmation
Les ordinateurs sont asynchrones par conception.

Asynchrone signifie que les choses peuvent se produire indépendamment du flux principal du programme.

Dans les ordinateurs grand public actuels, chaque programme s'exécute pendant un laps de temps spécifique, puis arrête son exécution pour permettre à un autre programme de poursuivre son exécution. Cette chose se déroule dans un cycle si rapide qu'il est impossible de le remarquer. Nous pensons que nos ordinateurs exécutent de nombreux programmes simultanément, mais c'est une illusion (sauf sur les machines multiprocesseurs).

Les programmes utilisent en interne des interruptions, un signal émis au processeur pour attirer l'attention du système.

Ne nous attardons pas sur les détails internes pour l'instant, mais gardons simplement à l'esprit qu'il est normal que les programmes soient asynchrones et interrompent leur exécution jusqu'à ce qu'ils aient besoin d'attention, permettant à l'ordinateur d'exécuter d'autres tâches entre-temps. Lorsqu'un programme attend une réponse du réseau, il ne peut pas arrêter le processeur tant que la requête n'est pas terminée.

Normalement, les langages de programmation sont synchrones et certains offrent un moyen de gérer l'asynchronisme dans le langage ou via des bibliothèques. C, Java, C#, PHP, Go, Ruby, Swift et Python sont tous synchrones par défaut. Certains d'entre eux gèrent les opérations asynchrones en utilisant des threads, en lançant un nouveau processus.

## JavaScript
JavaScript est **synchrone** par défaut et est monothread. Cela signifie que le code ne peut pas créer de nouveaux threads et s'exécuter en parallèle.

Les lignes de code sont exécutées en série, l'une après l'autre, par exemple :

```js
const a = 1;
const b = 2;
const c = a * b;
console.log(c);
doSomething();
```

Mais JavaScript est né à l'intérieur du navigateur, son travail principal, au début, était de répondre aux actions de l'utilisateur, comme `onClick`, `onMouseOver`, `onChange`, `onSubmit` et ainsi de suite. Comment pouvait-il faire cela avec un modèle de programmation synchrone ?

La réponse était dans son environnement. Le **navigateur** offre un moyen de le faire en fournissant un ensemble d'API qui peuvent gérer ce type de fonctionnalité.

Plus récemment, Node.js a introduit un environnement d'E/S non bloquant pour étendre ce concept à l'accès aux fichiers, aux appels réseau, etc.


## Callbacks
Vous ne pouvez pas savoir quand un utilisateur va cliquer sur un bouton. Vous définissez donc un gestionnaire d'événements pour l'événement de clic. Ce gestionnaire d'événements accepte une fonction, qui sera appelée lorsque l'événement est déclenché :

```js
document.getElementById('button').addEventListener('click', () => {
  // item clicked
});
```

C'est ce qu'on appelle un **callback**.

Un callback est une simple fonction qui est passée comme valeur à une autre fonction, et ne sera exécutée que lorsque l'événement se produit. Nous pouvons le faire car JavaScript a des fonctions de première classe, qui peuvent être affectées à des variables et passées à d'autres fonctions (appelées **fonctions d'ordre supérieur**)

Il est courant d'encapsuler tout votre code client dans un écouteur d'événements **load** sur l'objet **window**, qui exécute la fonction de rappel uniquement lorsque la page est prête :

```js
window.addEventListener('load', () => {
  // window loaded
  // do what you want
});
```

Les callbacks sont utilisés partout, pas seulement dans les événements DOM.

Un exemple courant est l'utilisation de timers :

```js
setTimeout(() => {
  // runs after 2 seconds
}, 2000);
```

Les requêtes XHR acceptent également un callback, dans cet exemple en affectant une fonction à une propriété qui sera appelée lorsqu'un événement particulier se produit (dans ce cas, l'état de la requête change) :

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    xhr.status === 200 ? console.log(xhr.responseText) : console.error('error');
  }
};
xhr.open('GET', 'https://yoursite.com');
xhr.send();
```

## Gérer les erreurs dans les callbacks
Comment gérer les erreurs avec les callbacks ? Une stratégie très courante consiste à utiliser ce que Node.js a adopté : le premier paramètre de toute fonction de rappel est l'objet d'erreur : les callbacks avec erreur en premier

S'il n'y a pas d'erreur, l'objet est nul. S'il y a une erreur, il contient une description de l'erreur et d'autres informations.

```js
const fs = require('node:fs');
fs.readFile('/file.json', (err, data) => {
  if (err) {
    // handle error
    console.log(err);
    return;
  }
  // no errors, process data
  console.log(data);
});
```


## Le problème avec les callbacks
Les callbacks sont parfaits pour les cas simples !

Cependant, chaque callback ajoute un niveau d'imbrication, et lorsque vous avez beaucoup de callbacks, le code commence à être compliqué très rapidement :

```js
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // votre code ici
      });
    }, 2000);
  });
});
```

Ce n'est qu'un simple code à 4 niveaux, mais j'ai vu beaucoup plus de niveaux d'imbrication et ce n'est pas amusant.

Comment résoudre ce problème ?

## Alternatives aux callbacks
À partir d'ES6, JavaScript a introduit plusieurs fonctionnalités qui nous aident avec le code asynchrone qui n'implique pas l'utilisation de callbacks : `Promises` (ES6) et `Async/Await` (ES2017).

