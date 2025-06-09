---
title: Documentation REPL de Node.js
description: Découvrez le REPL de Node.js (Read-Eval-Print Loop) qui offre un environnement interactif pour exécuter du code JavaScript, déboguer et tester des applications Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation REPL de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez le REPL de Node.js (Read-Eval-Print Loop) qui offre un environnement interactif pour exécuter du code JavaScript, déboguer et tester des applications Node.js.
  - - meta
    - name: twitter:title
      content: Documentation REPL de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez le REPL de Node.js (Read-Eval-Print Loop) qui offre un environnement interactif pour exécuter du code JavaScript, déboguer et tester des applications Node.js.
---


# REPL {#repl}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

Le module `node:repl` fournit une implémentation Read-Eval-Print-Loop (REPL) qui est disponible à la fois en tant que programme autonome ou intégrable dans d’autres applications. Il est accessible en utilisant :



::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## Conception et fonctionnalités {#design-and-features}

Le module `node:repl` exporte la classe [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver). Lors de l’exécution, les instances de [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver) accepteront des lignes individuelles de saisie utilisateur, les évalueront en fonction d’une fonction d’évaluation définie par l’utilisateur, puis afficheront le résultat. L’entrée et la sortie peuvent provenir de `stdin` et `stdout`, respectivement, ou peuvent être connectées à n’importe quel [flux](/fr/nodejs/api/stream) Node.js.

Les instances de [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver) prennent en charge la saisie semi-automatique des entrées, l’aperçu de la saisie semi-automatique, l’édition de ligne simpliste de style Emacs, les entrées multilignes, la recherche inverse [ZSH](https://en.wikipedia.org/wiki/Z_shell)-like, la recherche d’historique basée sur des sous-chaînes [ZSH](https://en.wikipedia.org/wiki/Z_shell)-like, la sortie de style ANSI, la sauvegarde et la restauration de l’état actuel de la session REPL, la récupération d’erreurs et les fonctions d’évaluation personnalisables. Les terminaux qui ne prennent pas en charge les styles ANSI et l’édition de ligne de style Emacs reviennent automatiquement à un ensemble de fonctionnalités limité.

### Commandes et touches spéciales {#commands-and-special-keys}

Les commandes spéciales suivantes sont prises en charge par toutes les instances REPL :

- `.break` : Lorsque vous êtes en train de saisir une expression multiligne, entrez la commande `.break` (ou appuyez sur +) pour abandonner la saisie ou le traitement de cette expression.
- `.clear` : Réinitialise le `contexte` REPL à un objet vide et efface toute expression multiligne en cours de saisie.
- `.exit` : Ferme le flux d’E/S, ce qui entraîne la sortie du REPL.
- `.help` : Affiche cette liste de commandes spéciales.
- `.save` : Enregistre la session REPL actuelle dans un fichier : `\> .save ./file/to/save.js`
- `.load` : Charge un fichier dans la session REPL actuelle. `\> .load ./file/to/load.js`
- `.editor` : Passe en mode éditeur (+ pour terminer, + pour annuler).

```bash [BASH]
> .editor
// Entering editor mode (^D to finish, ^C to cancel)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
Les combinaisons de touches suivantes dans le REPL ont ces effets spéciaux :

- + : Lorsqu’elle est enfoncée une fois, a le même effet que la commande `.break`. Lorsqu’elle est enfoncée deux fois sur une ligne vide, a le même effet que la commande `.exit`.
- + : A le même effet que la commande `.exit`.
- : Lorsque vous appuyez sur une ligne vide, affiche les variables globales et locales (scope). Lorsque vous appuyez sur une autre saisie, affiche les options de saisie semi-automatique pertinentes.

Pour les liaisons de clés relatives à la recherche inverse-i, voir [`reverse-i-search`](/fr/nodejs/api/repl#reverse-i-search). Pour toutes les autres liaisons de clés, voir [Liaisons de clés TTY](/fr/nodejs/api/readline#tty-keybindings).


### Évaluation par défaut {#default-evaluation}

Par défaut, toutes les instances de [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver) utilisent une fonction d'évaluation qui évalue les expressions JavaScript et fournit un accès aux modules intégrés de Node.js. Ce comportement par défaut peut être remplacé en passant une fonction d'évaluation alternative lors de la création de l'instance [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver).

#### Expressions JavaScript {#javascript-expressions}

L'évaluateur par défaut prend en charge l'évaluation directe des expressions JavaScript :

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
Sauf si elles sont définies dans des blocs ou des fonctions, les variables déclarées implicitement ou à l'aide des mots-clés `const`, `let` ou `var` sont déclarées dans la portée globale.

#### Portée globale et locale {#global-and-local-scope}

L'évaluateur par défaut permet d'accéder à toutes les variables qui existent dans la portée globale. Il est possible d'exposer explicitement une variable au REPL en l'affectant à l'objet `context` associé à chaque `REPLServer` :

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

Les propriétés de l'objet `context` apparaissent comme locales dans le REPL :

```bash [BASH]
$ node repl_test.js
> m
'message'
```
Les propriétés du contexte ne sont pas en lecture seule par défaut. Pour spécifier des globales en lecture seule, les propriétés du contexte doivent être définies à l'aide de `Object.defineProperty()` :

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### Accès aux modules principaux de Node.js {#accessing-core-nodejs-modules}

L'évaluateur par défaut chargera automatiquement les modules principaux de Node.js dans l'environnement REPL lorsqu'il est utilisé. Par exemple, sauf indication contraire en tant que variable globale ou de portée, l'entrée `fs` sera évaluée à la demande comme `global.fs = require('node:fs')`.

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### Exceptions globales non interceptées {#global-uncaught-exceptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.3.0 | L'événement `'uncaughtException'` est désormais déclenché si le REPL est utilisé comme un programme autonome. |
:::

Le REPL utilise le module [`domain`](/fr/nodejs/api/domain) pour intercepter toutes les exceptions non interceptées pour cette session REPL.

Cette utilisation du module [`domain`](/fr/nodejs/api/domain) dans le REPL a les effets secondaires suivants :

- Les exceptions non interceptées n'émettent l'événement [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception) que dans le REPL autonome. L'ajout d'un écouteur pour cet événement dans un REPL au sein d'un autre programme Node.js entraîne [`ERR_INVALID_REPL_INPUT`](/fr/nodejs/api/errors#err_invalid_repl_input).
- Tenter d'utiliser [`process.setUncaughtExceptionCaptureCallback()`](/fr/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) lève une erreur [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/fr/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture).

#### Affectation de la variable `_` (underscore) {#assignment-of-the-_-underscore-variable}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.8.0 | Ajout du support `_error`. |
:::

L'évaluateur par défaut assigne, par défaut, le résultat de l'expression évaluée le plus récemment à la variable spéciale `_` (underscore). Définir explicitement `_` sur une valeur désactivera ce comportement.

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Expression assignment to _ now disabled.
4
> 1 + 1
2
> _
4
```
De même, `_error` fera référence à la dernière erreur rencontrée, le cas échéant. Définir explicitement `_error` sur une valeur désactivera ce comportement.

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### Mot-clé `await` {#await-keyword}

La prise en charge du mot-clé `await` est activée au niveau supérieur.

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```
Une limitation connue de l'utilisation du mot-clé `await` dans le REPL est qu'il invalidera la portée lexicale des mots-clés `const` et `let`.

Par exemple:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```
[`--no-experimental-repl-await`](/fr/nodejs/api/cli#--no-experimental-repl-await) désactivera await de niveau supérieur dans REPL.


### Recherche incrémentale inversée {#reverse-i-search}

**Ajouté dans : v13.6.0, v12.17.0**

Le REPL prend en charge la recherche incrémentale inversée bidirectionnelle, similaire à [ZSH](https://en.wikipedia.org/wiki/Z_shell). Elle est déclenchée avec + pour effectuer une recherche vers l'arrière et + pour effectuer une recherche vers l'avant.

Les entrées d'historique dupliquées seront ignorées.

Les entrées sont acceptées dès qu'une touche est pressée qui ne correspond pas à la recherche inversée. L'annulation est possible en appuyant sur  ou +.

Changer de direction recherche immédiatement l'entrée suivante dans la direction prévue à partir de la position actuelle.

### Fonctions d'évaluation personnalisées {#custom-evaluation-functions}

Lorsqu'un nouveau [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver) est créé, une fonction d'évaluation personnalisée peut être fournie. Cela peut être utilisé, par exemple, pour implémenter des applications REPL entièrement personnalisées.

L'exemple suivant illustre un REPL qui met au carré un nombre donné :

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```
:::

#### Erreurs récupérables {#recoverable-errors}

À l'invite REPL, appuyer sur  envoie la ligne d'entrée actuelle à la fonction `eval`. Afin de prendre en charge l'entrée multiligne, la fonction `eval` peut renvoyer une instance de `repl.Recoverable` à la fonction de rappel fournie :

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### Personnalisation de la sortie REPL {#customizing-repl-output}

Par défaut, les instances de [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver) formatent la sortie à l'aide de la méthode [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options) avant d'écrire la sortie dans le flux `Writable` fourni (`process.stdout` par défaut). L'option d'inspection `showProxy` est définie sur true par défaut et l'option `colors` est définie sur true en fonction de l'option `useColors` du REPL.

L'option booléenne `useColors` peut être spécifiée lors de la construction pour indiquer à l'écrivain par défaut d'utiliser des codes de style ANSI pour colorer la sortie de la méthode `util.inspect()`.

Si le REPL est exécuté en tant que programme autonome, il est également possible de modifier les [paramètres d'inspection par défaut](/fr/nodejs/api/util#utilinspectobject-options) du REPL depuis l'intérieur du REPL en utilisant la propriété `inspect.replDefaults` qui reflète les `defaultOptions` de [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options).

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
Pour personnaliser entièrement la sortie d'une instance [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver), transmettez une nouvelle fonction pour l'option `writer` lors de la construction. L'exemple suivant, par exemple, convertit simplement tout texte saisi en majuscules :

::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## Classe : `REPLServer` {#class-replserver}

**Ajoutée dans : v0.1.91**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [`repl.start()`](/fr/nodejs/api/repl#replstartoptions)
- Hérite de : [\<readline.Interface\>](/fr/nodejs/api/readline#class-readlineinterface)

Les instances de `repl.REPLServer` sont créées à l'aide de la méthode [`repl.start()`](/fr/nodejs/api/repl#replstartoptions) ou directement à l'aide du mot-clé JavaScript `new`.

::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### Événement : `'exit'` {#event-exit}

**Ajouté dans : v0.7.7**

L’événement `'exit'` est émis lorsque le REPL est quitté, soit en recevant la commande `.exit` en entrée, soit lorsque l’utilisateur appuie deux fois sur + pour signaler `SIGINT`, soit en appuyant sur + pour signaler `'end'` sur le flux d’entrée. La fonction de rappel de l’écouteur est appelée sans aucun argument.

```js [ESM]
replServer.on('exit', () => {
  console.log('Événement "exit" reçu du repl !');
  process.exit();
});
```
### Événement : `'reset'` {#event-reset}

**Ajouté dans : v0.11.0**

L’événement `'reset'` est émis lorsque le contexte du REPL est réinitialisé. Cela se produit chaque fois que la commande `.clear` est reçue en entrée *sauf si* le REPL utilise l’évaluateur par défaut et que l’instance `repl.REPLServer` a été créée avec l’option `useGlobal` définie sur `true`. La fonction de rappel de l’écouteur sera appelée avec une référence à l’objet `context` comme seul argument.

Cela peut être utilisé principalement pour réinitialiser le contexte REPL à un état prédéfini :

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

Lorsque ce code est exécuté, la variable globale `'m'` peut être modifiée mais ensuite réinitialisée à sa valeur initiale en utilisant la commande `.clear` :

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**Ajouté dans : v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le mot clé de la commande (*sans* le caractère `.` initial).
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à invoquer lorsque la commande est traitée.

La méthode `replServer.defineCommand()` est utilisée pour ajouter de nouvelles commandes préfixées par `.` à l’instance REPL. Ces commandes sont invoquées en tapant un `.` suivi du `keyword`. Le `cmd` est soit une `Function`, soit un `Object` avec les propriétés suivantes :

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Texte d’aide à afficher lorsque `.help` est entré (Facultatif).
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à exécuter, acceptant éventuellement un seul argument de chaîne.

L’exemple suivant montre deux nouvelles commandes ajoutées à l’instance REPL :

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

Les nouvelles commandes peuvent ensuite être utilisées à partir de l’instance REPL :

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Ajouté dans: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La méthode `replServer.displayPrompt()` prépare l'instance REPL à recevoir des entrées de l'utilisateur, en affichant l'`invite` configurée sur une nouvelle ligne dans la `sortie` et en réactivant l'`entrée` pour accepter de nouvelles entrées.

Lorsqu'une entrée multiligne est saisie, des points de suspension sont affichés à la place de l'« invite ».

Lorsque `preserveCursor` est `true`, le positionnement du curseur ne sera pas réinitialisé à `0`.

La méthode `replServer.displayPrompt` est principalement destinée à être appelée depuis la fonction d'action pour les commandes enregistrées à l'aide de la méthode `replServer.defineCommand()`.

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Ajouté dans : v9.0.0**

La méthode `replServer.clearBufferedCommand()` efface toute commande qui a été mise en mémoire tampon mais pas encore exécutée. Cette méthode est principalement destinée à être appelée depuis la fonction d'action pour les commandes enregistrées à l'aide de la méthode `replServer.defineCommand()`.

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Ajouté dans : v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) le chemin d'accès au fichier d'historique
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) appelée lorsque les écritures d'historique sont prêtes ou en cas d'erreur
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/fr/nodejs/api/repl#class-replserver)
  
 

Initialise un fichier journal d'historique pour l'instance REPL. Lors de l'exécution du binaire Node.js et de l'utilisation du REPL en ligne de commande, un fichier d'historique est initialisé par défaut. Cependant, ce n'est pas le cas lors de la création d'un REPL par programme. Utilisez cette méthode pour initialiser un fichier journal d'historique lorsque vous travaillez avec des instances REPL par programme.

## `repl.builtinModules` {#replbuiltinmodules}

**Ajouté dans : v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Une liste des noms de tous les modules Node.js, par exemple `'http'`.


## `repl.start([options])` {#replstartoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.4.0, v12.17.0 | L'option `preview` est maintenant disponible. |
| v12.0.0 | L'option `terminal` suit maintenant la description par défaut dans tous les cas et `useColors` vérifie `hasColors()` si disponible. |
| v10.0.0 | Le `replMode` `REPL_MAGIC_MODE` a été supprimé. |
| v6.3.0 | L'option `breakEvalOnSigint` est maintenant prise en charge. |
| v5.8.0 | Le paramètre `options` est maintenant optionnel. |
| v0.1.91 | Ajouté dans : v0.1.91 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'invite d'entrée à afficher. **Par défaut:** `'\> '` (avec un espace de fin).
    - `input` [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) Le flux `Readable` à partir duquel l'entrée REPL sera lue. **Par défaut:** `process.stdin`.
    - `output` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable) Le flux `Writable` dans lequel la sortie REPL sera écrite. **Par défaut:** `process.stdout`.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, spécifie que la `output` doit être traitée comme un terminal TTY. **Par défaut:** vérification de la valeur de la propriété `isTTY` sur le flux `output` lors de l'instanciation.
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à utiliser lors de l'évaluation de chaque ligne d'entrée donnée. **Par défaut:** un wrapper asynchrone pour la fonction JavaScript `eval()`. Une fonction `eval` peut générer une erreur avec `repl.Recoverable` pour indiquer que l'entrée est incomplète et inviter à saisir des lignes supplémentaires.
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, spécifie que la fonction `writer` par défaut doit inclure un style de couleur ANSI à la sortie REPL. Si une fonction `writer` personnalisée est fournie, cela n'a aucun effet. **Par défaut:** vérification de la prise en charge des couleurs sur le flux `output` si la valeur `terminal` de l'instance REPL est `true`.
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, spécifie que la fonction d'évaluation par défaut utilisera le JavaScript `global` comme contexte au lieu de créer un nouveau contexte distinct pour l'instance REPL. Le REPL de la CLI node définit cette valeur sur `true`. **Par défaut:** `false`.
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, spécifie que le writer par défaut ne produira pas la valeur de retour d'une commande si elle est évaluée à `undefined`. **Par défaut:** `false`.
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à invoquer pour formater la sortie de chaque commande avant d'écrire dans `output`. **Par défaut:** [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options).
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction optionnelle utilisée pour la complétion automatique personnalisée par tabulation. Voir [`readline.InterfaceCompleter`](/fr/nodejs/api/readline#use-of-the-completer-function) pour un exemple.
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Un indicateur qui spécifie si l'évaluateur par défaut exécute toutes les commandes JavaScript en mode strict ou en mode par défaut (relâché). Les valeurs acceptables sont :
    - `repl.REPL_MODE_SLOPPY` pour évaluer les expressions en mode relâché.
    - `repl.REPL_MODE_STRICT` pour évaluer les expressions en mode strict. Ceci est équivalent à faire précéder chaque instruction repl de `'use strict'`.
  
 
    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Arrête d'évaluer le morceau de code actuel lorsque `SIGINT` est reçu, comme lorsque + est enfoncé. Cela ne peut pas être utilisé avec une fonction `eval` personnalisée. **Par défaut:** `false`.
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définit si le repl affiche les aperçus d'auto-complétion et de sortie ou non. **Par défaut:** `true` avec la fonction eval par défaut et `false` si une fonction eval personnalisée est utilisée. Si `terminal` est falsy, alors il n'y a pas d'aperçus et la valeur de `preview` n'a aucun effet.
  
 
- Returns: [\<repl.REPLServer\>](/fr/nodejs/api/repl#class-replserver)

La méthode `repl.start()` crée et démarre une instance de [`repl.REPLServer`](/fr/nodejs/api/repl#class-replserver).

Si `options` est une chaîne de caractères, alors elle spécifie l'invite d'entrée :

::: code-group
```js [ESM]
import repl from 'node:repl';

// a Unix style prompt
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// a Unix style prompt
repl.start('$ ');
```
:::


## Le REPL Node.js {#the-nodejs-repl}

Node.js lui-même utilise le module `node:repl` pour fournir sa propre interface interactive pour exécuter JavaScript. Ceci peut être utilisé en exécutant le binaire Node.js sans passer d'arguments (ou en passant l'argument `-i`) :

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### Options des variables d'environnement {#environment-variable-options}

Divers comportements du REPL Node.js peuvent être personnalisés en utilisant les variables d'environnement suivantes :

- `NODE_REPL_HISTORY`: Lorsqu'un chemin valide est donné, l'historique REPL persistant sera sauvegardé dans le fichier spécifié plutôt que dans `.node_repl_history` dans le répertoire personnel de l'utilisateur. Définir cette valeur à `''` (une chaîne vide) désactivera l'historique REPL persistant. Les espaces seront supprimés de la valeur. Sur les plateformes Windows, les variables d'environnement avec des valeurs vides ne sont pas valides, donc définissez cette variable à un ou plusieurs espaces pour désactiver l'historique REPL persistant.
- `NODE_REPL_HISTORY_SIZE`: Contrôle le nombre de lignes d'historique qui seront conservées si l'historique est disponible. Doit être un nombre positif. **Par défaut :** `1000`.
- `NODE_REPL_MODE`: Peut être soit `'sloppy'` soit `'strict'`. **Par défaut :** `'sloppy'`, ce qui permettra d'exécuter du code en mode non strict.

### Historique persistant {#persistent-history}

Par défaut, le REPL Node.js conservera l'historique entre les sessions REPL `node` en sauvegardant les entrées dans un fichier `.node_repl_history` situé dans le répertoire personnel de l'utilisateur. Ceci peut être désactivé en définissant la variable d'environnement `NODE_REPL_HISTORY=''`.

### Utiliser le REPL Node.js avec des éditeurs de ligne avancés {#using-the-nodejs-repl-with-advanced-line-editors}

Pour les éditeurs de ligne avancés, démarrez Node.js avec la variable d'environnement `NODE_NO_READLINE=1`. Ceci démarrera le REPL principal et le débogueur dans les paramètres de terminal canoniques, ce qui permettra l'utilisation avec `rlwrap`.

Par exemple, ce qui suit peut être ajouté à un fichier `.bashrc` :

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### Démarrer plusieurs instances REPL contre une seule instance en cours d'exécution {#starting-multiple-repl-instances-against-a-single-running-instance}

Il est possible de créer et d'exécuter plusieurs instances REPL contre une seule instance en cours d'exécution de Node.js qui partagent un seul objet `global` mais ont des interfaces d'E/S séparées.

L'exemple suivant, par exemple, fournit des REPL séparés sur `stdin`, un socket Unix et un socket TCP :

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

L'exécution de cette application à partir de la ligne de commande démarrera un REPL sur stdin. D'autres clients REPL peuvent se connecter via le socket Unix ou le socket TCP. `telnet`, par exemple, est utile pour se connecter aux sockets TCP, tandis que `socat` peut être utilisé pour se connecter aux sockets Unix et TCP.

En démarrant un REPL à partir d'un serveur basé sur un socket Unix au lieu de stdin, il est possible de se connecter à un processus Node.js de longue durée sans le redémarrer.

Pour un exemple d'exécution d'un REPL "complet" (`terminal`) sur une instance `net.Server` et `net.Socket`, voir : [https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310).

Pour un exemple d'exécution d'une instance REPL sur [`curl(1)`](https://curl.haxx.se/docs/manpage), voir : [https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342).

Cet exemple est uniquement destiné à des fins éducatives pour démontrer comment les REPL Node.js peuvent être démarrés en utilisant différents flux d'E/S. Il ne doit **pas** être utilisé dans des environnements de production ou dans tout contexte où la sécurité est une préoccupation sans mesures de protection supplémentaires. Si vous devez implémenter des REPL dans une application réelle, envisagez des approches alternatives qui atténuent ces risques, telles que l'utilisation de mécanismes d'entrée sécurisés et l'évitement des interfaces réseau ouvertes.

