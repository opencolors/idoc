---
title: Émetteur d'événements Node.js
description: Découvrez l'émetteur d'événements Node.js, un outil puissant pour gérer les événements dans vos applications backend.
head:
  - - meta
    - name: og:title
      content: Émetteur d'événements Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez l'émetteur d'événements Node.js, un outil puissant pour gérer les événements dans vos applications backend.
  - - meta
    - name: twitter:title
      content: Émetteur d'événements Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez l'émetteur d'événements Node.js, un outil puissant pour gérer les événements dans vos applications backend.
---


# L'émetteur d'événements Node.js

Si vous avez travaillé avec JavaScript dans le navigateur, vous savez à quel point l'interaction de l'utilisateur est gérée par le biais d'événements : clics de souris, pressions sur les boutons du clavier, réactions aux mouvements de la souris, etc.

Côté serveur, Node.js nous offre la possibilité de construire un système similaire en utilisant le **[module events](/fr/nodejs/api/events)**.

Ce module, en particulier, propose la classe EventEmitter, que nous utiliserons pour gérer nos événements.

Vous l'initialisez en utilisant

```js
import EventEmitter from 'node:events';
const eventEmitter = new EventEmitter();
```

Cet objet expose, entre autres, les méthodes `on` et `emit`.

- `emit` est utilisé pour déclencher un événement
- `on` est utilisé pour ajouter une fonction de rappel qui sera exécutée lorsque l'événement sera déclenché

Par exemple, créons un événement `start`, et à titre d'exemple, réagissons à cet événement en nous contentant d'enregistrer dans la console :

```js
eventEmitter.on('start', () => {
  console.log('started');
});
```

Lorsque nous exécutons

```js
eventEmitter.emit('start');
```

la fonction de gestion d'événement est déclenchée, et nous obtenons le journal de la console.

Vous pouvez transmettre des arguments au gestionnaire d'événements en les transmettant en tant qu'arguments supplémentaires à `emit()` :

```js
eventEmitter.on('start', number => {
  console.log(`started ${number}`);
});
eventEmitter.emit('start', 23);
```

Plusieurs arguments :

```js
eventEmitter.on('start', (start, end) => {
  console.log(`started from ${start} to ${end}`);
});
eventEmitter.emit('start', 1, 100);
```

L'objet EventEmitter expose également plusieurs autres méthodes pour interagir avec les événements, telles que

- `once()` : ajouter un écouteur unique
- `removeListener()` / `off()` : supprimer un écouteur d'événement d'un événement
- `removeAllListeners()` : supprimer tous les écouteurs d'un événement

Vous pouvez en savoir plus sur ces méthodes dans la [documentation du module events](/fr/nodejs/api/events).

