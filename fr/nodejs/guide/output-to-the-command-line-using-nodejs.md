---
title: Sortie sur la ligne de commande avec Node.js
description: Node.js fournit un module console avec diverses méthodes pour interagir avec la ligne de commande, notamment la journalisation, le comptage, la temporisation, etc.
head:
  - - meta
    - name: og:title
      content: Sortie sur la ligne de commande avec Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js fournit un module console avec diverses méthodes pour interagir avec la ligne de commande, notamment la journalisation, le comptage, la temporisation, etc.
  - - meta
    - name: twitter:title
      content: Sortie sur la ligne de commande avec Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js fournit un module console avec diverses méthodes pour interagir avec la ligne de commande, notamment la journalisation, le comptage, la temporisation, etc.
---


# Sortie vers la ligne de commande avec Node.js

Sortie basique en utilisant le module console
Node.js fournit un module console qui offre de nombreuses façons très utiles d'interagir avec la ligne de commande. Il est fondamentalement le même que l'objet console que vous trouvez dans le navigateur.

La méthode la plus basique et la plus utilisée est `console.log()`, qui affiche la chaîne que vous lui passez dans la console. Si vous passez un objet, il le rendra sous forme de chaîne.

Vous pouvez passer plusieurs variables à `console.log`, par exemple :
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

Nous pouvons également formater de jolies phrases en passant des variables et un spécificateur de format. Par exemple:
```javascript
console.log('Mon %s a %d oreilles', 'chat', 2);
```

- %s formate une variable en tant que chaîne
- %d formate une variable en tant que nombre
- %i formate une variable en tant que sa partie entière uniquement
- %o formate une variable en tant qu'objet
Exemple:
```javascript
console.log('%o', Number);
```
## Effacer la console

`console.clear()` efface la console (le comportement peut dépendre de la console utilisée).

## Compter les éléments

`console.count()` est une méthode pratique.
Prenez ce code :
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('La valeur de x est '+x+' et a été vérifiée... combien de fois ?');
console.count('La valeur de x est'+x+'et a été vérifiée... combien de fois ?');
console.count('La valeur de y est'+y+'et a été vérifiée... combien de fois ?');
```

Ce qui se passe, c'est que `console.count()` comptera le nombre de fois qu'une chaîne est affichée et affichera le compte à côté :

Vous pouvez simplement compter les pommes et les oranges :

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## Réinitialiser le comptage

La méthode `console.countReset()` réinitialise le compteur utilisé avec `console.count()`.

Nous utiliserons l'exemple des pommes et des oranges pour illustrer cela.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## Afficher la trace de la pile

Il peut arriver qu'il soit utile d'afficher la trace de la pile d'appels d'une fonction, peut-être pour répondre à la question de savoir comment vous avez atteint cette partie du code ?

Vous pouvez le faire en utilisant `console.trace()` :

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

Cela affichera la trace de la pile. Voici ce qui est affiché si nous essayons cela dans le REPL de Node.js :

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## Calculer le temps passé

Vous pouvez facilement calculer le temps d'exécution d'une fonction en utilisant `time()` et `timeEnd()`.

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // faire quelque chose, et mesurer le temps que cela prend
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout et stderr

Comme nous l'avons vu, `console.log` est excellent pour afficher des messages dans la console. C'est ce qu'on appelle la sortie standard, ou stdout.

`console.error` affiche dans le flux stderr.

Il n'apparaîtra pas dans la console, mais il apparaîtra dans le journal des erreurs.

## Colorer la sortie

Vous pouvez colorer la sortie de votre texte dans la console en utilisant des séquences d'échappement. Une séquence d'échappement est un ensemble de caractères qui identifie une couleur.

Exemple :

```javascript
console.log('x1b[33ms/x1b[0m', 'hi!');
```

Vous pouvez essayer cela dans le REPL de Node.js, et cela affichera hi! en jaune.

Cependant, c'est la manière de bas niveau de faire cela. La manière la plus simple de colorer la sortie de la console est d'utiliser une bibliothèque. Chalk est une telle bibliothèque, et en plus de la coloration, elle aide également avec d'autres facilités de style, comme rendre le texte gras, italique ou souligné.

Vous l'installez avec `npm install chalk`, puis vous pouvez l'utiliser :

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

L'utilisation de `chalk.yellow` est beaucoup plus pratique que d'essayer de se souvenir des codes d'échappement, et le code est beaucoup plus lisible.

Consultez le lien du projet publié ci-dessus pour d'autres exemples d'utilisation.


## Créer une barre de progression

`progress` est un excellent paquet pour créer une barre de progression dans la console. Installez-le en utilisant `npm install progress`.

Cet extrait crée une barre de progression en 10 étapes, et chaque 100ms, une étape est complétée. Lorsque la barre est complète, nous effaçons l'intervalle :

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```

