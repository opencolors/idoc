---
title: Obtenir les entrées utilisateur dans Node.js
description: Découvrez comment créer des programmes CLI Node.js interactifs à l'aide du module readline et du package Inquirer.js.
head:
  - - meta
    - name: og:title
      content: Obtenir les entrées utilisateur dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment créer des programmes CLI Node.js interactifs à l'aide du module readline et du package Inquirer.js.
  - - meta
    - name: twitter:title
      content: Obtenir les entrées utilisateur dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment créer des programmes CLI Node.js interactifs à l'aide du module readline et du package Inquirer.js.
---


# Accepter une entrée depuis la ligne de commande dans Node.js

Comment rendre un programme CLI Node.js interactif ?

Node.js depuis la version 7 fournit le module readline pour effectuer exactement cela : obtenir une entrée depuis un flux lisible tel que le flux `process.stdin`, qui, pendant l'exécution d'un programme Node.js, est l'entrée du terminal, une ligne à la fois.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Quel est votre nom?", name => {
    console.log('Salut ' + name + '!');
    rl.close();
});
```

Ce bout de code demande le nom de l'utilisateur, et une fois que le texte est entré et que l'utilisateur appuie sur Entrée, nous envoyons une salutation.

La méthode `question()` affiche le premier paramètre (une question) et attend l'entrée de l'utilisateur. Elle appelle la fonction de rappel une fois que Entrée est enfoncée.

Dans cette fonction de rappel, nous fermons l'interface readline.

`readline` offre plusieurs autres méthodes, veuillez les consulter dans la documentation du package liée ci-dessus.

Si vous devez exiger un mot de passe, il est préférable de ne pas le renvoyer en écho, mais plutôt d'afficher un symbole *.

Le moyen le plus simple est d'utiliser le package readline-sync qui est très similaire en termes d'API et gère cela immédiatement. Une solution plus complète et abstraite est fournie par le package Inquirer.js.

Vous pouvez l'installer en utilisant `npm install inquirer`, et ensuite vous pouvez répliquer le code ci-dessus comme ceci :

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "Quel est votre nom?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('Salut ' + answers.name + '!');
});
```

`Inquirer.js` vous permet de faire beaucoup de choses comme poser des questions à choix multiples, avoir des boutons radio, des confirmations, et plus encore.

Il vaut la peine de connaître toutes les alternatives, en particulier celles intégrées fournies par Node.js, mais si vous prévoyez de faire passer l'entrée CLI au niveau supérieur, `Inquirer.js` est un choix optimal.

