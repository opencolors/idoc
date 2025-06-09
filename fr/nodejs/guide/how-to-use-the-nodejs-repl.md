---
title: Comment utiliser le REPL de Node.js
description: Découvrez comment utiliser le REPL de Node.js pour tester rapidement du code JavaScript simple et explorer ses fonctionnalités, notamment le mode multiligne, les variables spéciales et les commandes point.
head:
  - - meta
    - name: og:title
      content: Comment utiliser le REPL de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment utiliser le REPL de Node.js pour tester rapidement du code JavaScript simple et explorer ses fonctionnalités, notamment le mode multiligne, les variables spéciales et les commandes point.
  - - meta
    - name: twitter:title
      content: Comment utiliser le REPL de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment utiliser le REPL de Node.js pour tester rapidement du code JavaScript simple et explorer ses fonctionnalités, notamment le mode multiligne, les variables spéciales et les commandes point.
---


# Comment utiliser le REPL de Node.js

La commande `node` est celle que nous utilisons pour exécuter nos scripts Node.js :

```bash
node script.js
```

Si nous exécutons la commande `node` sans aucun script à exécuter ni aucun argument, nous démarrons une session REPL :

```bash
node
```

::: tip NOTE
REPL signifie Read Evaluate Print Loop (lire, évaluer, imprimer, boucle), et il s'agit d'un environnement de langage de programmation (en gros une fenêtre de console) qui prend une seule expression comme entrée utilisateur et renvoie le résultat à la console après exécution. La session REPL offre un moyen pratique de tester rapidement du code JavaScript simple.
:::

Si vous l'essayez maintenant dans votre terminal, voici ce qui se passe :

```bash
> node
>
```

La commande reste en mode veille et attend que nous entrions quelque chose.

::: tip
si vous ne savez pas comment ouvrir votre terminal, recherchez sur Google « Comment ouvrir un terminal sur votre système d'exploitation ».
:::

Le REPL attend que nous entrions du code JavaScript, pour être plus précis.

Commencez simplement et entrez :

```bash
> console.log('test')
test
undefined
>
```

La première valeur, `test`, est la sortie que nous avons dit à la console d'imprimer, puis nous obtenons `undefined` qui est la valeur de retour de l'exécution de `console.log()`. Node a lu cette ligne de code, l'a évaluée, a imprimé le résultat, puis est revenu à l'attente d'autres lignes de code. Node parcourra ces trois étapes en boucle pour chaque morceau de code que nous exécutons dans le REPL jusqu'à ce que nous quittions la session. C'est de là que le REPL tire son nom.

Node imprime automatiquement le résultat de toute ligne de code JavaScript sans avoir besoin de lui demander de le faire. Par exemple, tapez la ligne suivante et appuyez sur Entrée :

```bash
> 5==5
false
>
```

Notez la différence dans les sorties des deux lignes ci-dessus. Le REPL de Node a imprimé `undefined` après l'exécution de `console.log()`, tandis que d'autre part, il a simplement imprimé le résultat de `5== '5'`. Vous devez garder à l'esprit que la première n'est qu'une instruction en JavaScript, et la seconde est une expression.

Dans certains cas, le code que vous souhaitez tester peut nécessiter plusieurs lignes. Par exemple, disons que vous voulez définir une fonction qui génère un nombre aléatoire, dans la session REPL, tapez la ligne suivante et appuyez sur Entrée :

```javascript
function generateRandom()
...
```

Le REPL de Node est assez intelligent pour déterminer que vous n'avez pas encore fini d'écrire votre code, et il passera en mode multiligne pour que vous puissiez saisir plus de code. Maintenant, terminez votre définition de fonction et appuyez sur Entrée :

```javascript
function generateRandom()
...return Math.random()
```


### La variable spéciale :

Si après un certain code vous tapez `_`, cela affichera le résultat de la dernière opération.

### La touche flèche vers le haut :

Si vous appuyez sur la touche flèche vers le haut, vous aurez accès à l'historique des lignes de code précédentes exécutées dans la session REPL actuelle, et même dans les sessions précédentes.

## Commandes pointées

Le REPL possède des commandes spéciales, toutes commençant par un point `.`. Les voici :
- `.help` : affiche l'aide des commandes pointées.
- `.editor` : active le mode éditeur, pour écrire facilement du code JavaScript multiligne. Une fois dans ce mode, entrez `ctrl-D` pour exécuter le code que vous avez écrit.
- `.break` : lors de la saisie d'une expression multiligne, la saisie de la commande `.break` interrompra la saisie. Identique à la pression de `ctrl-C`.
- `.clear` : réinitialise le contexte REPL à un objet vide et efface toute expression multiligne en cours de saisie.
- `.1oad` : charge un fichier JavaScript, par rapport au répertoire de travail actuel.
- `.save` : enregistre tout ce que vous avez saisi dans la session REPL dans un fichier (spécifiez le nom de fichier).
- `.exit` : quitte le repl (identique à la pression de `ctrl-C` deux fois).

Le REPL sait quand vous tapez une instruction multiligne sans avoir besoin d'invoquer `.editor`. Par exemple, si vous commencez à taper une itération comme celle-ci :
```javascript
[1, 2,3].foxEach(num=>{
```
et que vous appuyez sur Entrée, le REPL passera à une nouvelle ligne qui commence par 3 points, indiquant que vous pouvez maintenant continuer à travailler sur ce bloc.
```javascript
1... console.log (num)
2...}
```

Si vous tapez `.break` à la fin d'une ligne, le mode multiligne s'arrêtera et l'instruction ne sera pas exécutée.

## Exécuter REPL à partir d'un fichier JavaScript

Nous pouvons importer le REPL dans un fichier JavaScript en utilisant `repl`.
```javascript
const repl = require('node:repl');
```

En utilisant la variable `repl`, nous pouvons effectuer diverses opérations. Pour démarrer l'invite de commande REPL, tapez la ligne suivante :
```javascript
repl.start();
```

Exécutez le fichier dans la ligne de commande.
```bash
node repl.js
```

Vous pouvez transmettre une chaîne qui s'affiche au démarrage du REPL. La valeur par défaut est '>' (avec un espace de fin), mais nous pouvons définir une invite personnalisée.
```javascript
// une invite de style Unix
const local = repl.start('$ ');
```

Vous pouvez afficher un message lors de la fermeture du REPL.

```javascript
local.on('exit', () => {
  console.log('fermeture du repl');
  process.exit();
});
```

Vous pouvez en savoir plus sur le module REPL dans la [documentation REPL](/fr/nodejs/api/repl).

