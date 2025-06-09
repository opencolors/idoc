---
title: Comprendre process.nextTick() dans Node.js
description: Découvrez comment fonctionne process.nextTick() dans Node.js et comment il diffère de setImmediate() et setTimeout(). Comprenez la boucle d'événements et comment utiliser nextTick() pour exécuter du code de manière asynchrone.
head:
  - - meta
    - name: og:title
      content: Comprendre process.nextTick() dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment fonctionne process.nextTick() dans Node.js et comment il diffère de setImmediate() et setTimeout(). Comprenez la boucle d'événements et comment utiliser nextTick() pour exécuter du code de manière asynchrone.
  - - meta
    - name: twitter:title
      content: Comprendre process.nextTick() dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment fonctionne process.nextTick() dans Node.js et comment il diffère de setImmediate() et setTimeout(). Comprenez la boucle d'événements et comment utiliser nextTick() pour exécuter du code de manière asynchrone.
---


# Comprendre `process.nextTick()`

Lorsque vous essayez de comprendre la boucle d'événements Node.js, une partie importante est `process.nextTick()`. Chaque fois que la boucle d'événements effectue un cycle complet, nous l'appelons un tick.

Lorsque nous passons une fonction à process.nextTick(), nous demandons au moteur d'invoquer cette fonction à la fin de l'opération en cours, avant le début du prochain tick de la boucle d'événements :

```js
process.nextTick(() => {
  // faire quelque chose
})
```

La boucle d'événements est occupée à traiter le code de la fonction en cours. Une fois cette opération terminée, le moteur JS exécute toutes les fonctions passées aux appels `nextTick` pendant cette opération.

C'est la façon dont nous pouvons dire au moteur JS de traiter une fonction de manière asynchrone (après la fonction actuelle), mais dès que possible, sans la mettre en file d'attente.

L'appel de `setTimeout(() => {}, 0)` exécutera la fonction à la fin du prochain tick, beaucoup plus tard que lors de l'utilisation de `nextTick()` qui priorise l'appel et l'exécute juste avant le début du prochain tick.

Utilisez `nextTick()` lorsque vous voulez vous assurer que lors de la prochaine itération de la boucle d'événements, le code est déjà exécuté.

## Un exemple de l'ordre des événements :

```js
console.log('Bonjour => numéro 1')
setImmediate(() => {
  console.log('S\'exécute avant le timeout => numéro 3')
})
setTimeout(() => {
  console.log('Le timeout s\'exécute en dernier => numéro 4')
}, 0)
process.nextTick(() => {
  console.log('S\'exécute au prochain tick => numéro 2')
})
```

## Exemple de sortie :

```bash
Bonjour => numéro 1
S'exécute au prochain tick => numéro 2
S'exécute avant le timeout => numéro 3
Le timeout s'exécute en dernier => numéro 4
```

La sortie exacte peut différer d'une exécution à l'autre.

