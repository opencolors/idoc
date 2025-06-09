---
title: Documentation Node.js  - Readline
description: Le module readline de Node.js fournit une interface pour lire des données d'un flux lisible (comme process.stdin) ligne par ligne. Il permet de créer des interfaces pour lire les entrées de la console, gérer les entrées utilisateur et gérer les opérations ligne par ligne.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js  - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module readline de Node.js fournit une interface pour lire des données d'un flux lisible (comme process.stdin) ligne par ligne. Il permet de créer des interfaces pour lire les entrées de la console, gérer les entrées utilisateur et gérer les opérations ligne par ligne.
  - - meta
    - name: twitter:title
      content: Documentation Node.js  - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module readline de Node.js fournit une interface pour lire des données d'un flux lisible (comme process.stdin) ligne par ligne. Il permet de créer des interfaces pour lire les entrées de la console, gérer les entrées utilisateur et gérer les opérations ligne par ligne.
---


# Readline {#readline}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

Le module `node:readline` fournit une interface pour lire des données à partir d’un flux [Readable](/fr/nodejs/api/stream#readable-streams) (tel que [`process.stdin`](/fr/nodejs/api/process#processstdin)) une ligne à la fois.

Pour utiliser les API basées sur les promesses :

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

Pour utiliser les API de rappel et synchrones :

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

L’exemple simple suivant illustre l’utilisation de base du module `node:readline`.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('Que pensez-vous de Node.js ? ');

console.log(`Merci pour vos précieux commentaires : ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('Que pensez-vous de Node.js ? ', (answer) => {
  // TODO : Enregistrer la réponse dans une base de données
  console.log(`Merci pour vos précieux commentaires : ${answer}`);

  rl.close();
});
```
:::

Une fois ce code invoqué, l’application Node.js ne se terminera pas tant que l’objet `readline.Interface` n’est pas fermé car l’interface attend que des données soient reçues sur le flux `input`.

## Class: `InterfaceConstructor` {#class-interfaceconstructor}

**Ajouté dans : v0.1.104**

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Les instances de la classe `InterfaceConstructor` sont construites à l’aide de la méthode `readlinePromises.createInterface()` ou `readline.createInterface()`. Chaque instance est associée à un seul flux `input` [Readable](/fr/nodejs/api/stream#readable-streams) et à un seul flux `output` [Writable](/fr/nodejs/api/stream#writable-streams). Le flux `output` est utilisé pour afficher des invites pour la saisie utilisateur qui arrive sur, et est lue à partir du flux `input`.


### Événement : `'close'` {#event-close}

**Ajouté dans : v0.1.98**

L’événement `'close'` est émis lorsque l’un des événements suivants se produit :

- La méthode `rl.close()` est appelée et l’instance `InterfaceConstructor` a cédé le contrôle sur les flux `input` et `output` ;
- Le flux `input` reçoit son événement `'end'` ;
- Le flux `input` reçoit + pour signaler la fin de la transmission (EOT) ;
- Le flux `input` reçoit + pour signaler `SIGINT` et aucun écouteur d’événement `'SIGINT'` n’est enregistré sur l’instance `InterfaceConstructor`.

La fonction d’écoute est appelée sans transmettre d’arguments.

L’instance `InterfaceConstructor` est terminée une fois que l’événement `'close'` est émis.

### Événement : `'line'` {#event-line}

**Ajouté dans : v0.1.98**

L’événement `'line'` est émis chaque fois que le flux `input` reçoit une entrée de fin de ligne (`\n`, `\r` ou `\r\n`). Cela se produit généralement lorsque l’utilisateur appuie sur  ou .

L’événement `'line'` est également émis si de nouvelles données ont été lues à partir d’un flux et que ce flux se termine sans marqueur de fin de ligne final.

La fonction d’écoute est appelée avec une chaîne contenant la seule ligne d’entrée reçue.

```js [ESM]
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```
### Événement : `'history'` {#event-history}

**Ajouté dans : v15.8.0, v14.18.0**

L’événement `'history'` est émis chaque fois que le tableau d’historique a changé.

La fonction d’écoute est appelée avec un tableau contenant le tableau d’historique. Il reflétera tous les changements, les lignes ajoutées et les lignes supprimées en raison de `historySize` et `removeHistoryDuplicates`.

Le but principal est de permettre à un écouteur de conserver l’historique. Il est également possible pour l’écouteur de modifier l’objet historique. Cela pourrait être utile pour empêcher certaines lignes d’être ajoutées à l’historique, comme un mot de passe.

```js [ESM]
rl.on('history', (history) => {
  console.log(`Received: ${history}`);
});
```
### Événement : `'pause'` {#event-pause}

**Ajouté dans : v0.7.5**

L’événement `'pause'` est émis lorsque l’un des événements suivants se produit :

- Le flux `input` est mis en pause.
- Le flux `input` n’est pas mis en pause et reçoit l’événement `'SIGCONT'`. (Voir les événements [`'SIGTSTP'`](/fr/nodejs/api/readline#event-sigtstp) et [`'SIGCONT'`](/fr/nodejs/api/readline#event-sigcont).)

La fonction d’écoute est appelée sans transmettre d’arguments.

```js [ESM]
rl.on('pause', () => {
  console.log('Readline paused.');
});
```

### Événement : `'resume'` {#event-resume}

**Ajouté dans : v0.7.5**

L'événement `'resume'` est émis chaque fois que le flux `input` est relancé.

La fonction d'écoute est appelée sans transmettre d'arguments.

```js [ESM]
rl.on('resume', () => {
  console.log('Readline repris.');
});
```
### Événement : `'SIGCONT'` {#event-sigcont}

**Ajouté dans : v0.7.5**

L'événement `'SIGCONT'` est émis lorsqu'un processus Node.js précédemment déplacé en arrière-plan à l'aide de + (c'est-à-dire `SIGTSTP`) est ensuite ramené au premier plan à l'aide de [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p).

Si le flux `input` a été interrompu *avant* la requête `SIGTSTP`, cet événement ne sera pas émis.

La fonction d'écoute est invoquée sans transmettre d'arguments.

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` reprendra automatiquement le flux
  rl.prompt();
});
```
L'événement `'SIGCONT'` *n'est pas* pris en charge sous Windows.

### Événement : `'SIGINT'` {#event-sigint}

**Ajouté dans : v0.3.0**

L'événement `'SIGINT'` est émis chaque fois que le flux `input` reçoit une entrée , généralement appelée `SIGINT`. S'il n'y a pas d'écouteurs d'événements `'SIGINT'` enregistrés lorsque le flux `input` reçoit un `SIGINT`, l'événement `'pause'` sera émis.

La fonction d'écoute est invoquée sans transmettre d'arguments.

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('Êtes-vous sûr de vouloir quitter ? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### Événement : `'SIGTSTP'` {#event-sigtstp}

**Ajouté dans : v0.7.5**

L'événement `'SIGTSTP'` est émis lorsque le flux `input` reçoit une entrée +, généralement appelée `SIGTSTP`. Si aucun écouteur d'événements `'SIGTSTP'` n'est enregistré lorsque le flux `input` reçoit un `SIGTSTP`, le processus Node.js sera envoyé en arrière-plan.

Lorsque le programme est repris à l'aide de [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p), les événements `'pause'` et `'SIGCONT'` seront émis. Ceux-ci peuvent être utilisés pour relancer le flux `input`.

Les événements `'pause'` et `'SIGCONT'` ne seront pas émis si l'`input` a été mis en pause avant que le processus ne soit envoyé en arrière-plan.

La fonction d'écoute est invoquée sans transmettre d'arguments.

```js [ESM]
rl.on('SIGTSTP', () => {
  // Cela remplacera SIGTSTP et empêchera le programme de passer à l'arrière-plan.
  console.log('SIGTSTP intercepté.');
});
```
L'événement `'SIGTSTP'` *n'est pas* pris en charge sous Windows.


### `rl.close()` {#rlclose}

**Ajouté dans : v0.1.98**

La méthode `rl.close()` ferme l'instance `InterfaceConstructor` et abandonne le contrôle sur les flux `input` et `output`. Lorsqu'elle est appelée, l'événement `'close'` est émis.

L'appel de `rl.close()` n'arrête pas immédiatement l'émission d'autres événements (y compris `'line'`) par l'instance `InterfaceConstructor`.

### `rl.pause()` {#rlpause}

**Ajouté dans : v0.3.4**

La méthode `rl.pause()` met en pause le flux `input`, ce qui permet de le reprendre ultérieurement si nécessaire.

L'appel de `rl.pause()` ne met pas immédiatement en pause d'autres événements (y compris `'line'`) émis par l'instance `InterfaceConstructor`.

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**Ajouté dans : v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) Si `true`, empêche la position du curseur d'être réinitialisée à `0`.

La méthode `rl.prompt()` écrit l'`invite` configurée de l'instance `InterfaceConstructor` sur une nouvelle ligne dans `output` afin de fournir à un utilisateur un nouvel emplacement où fournir une entrée.

Lorsqu'elle est appelée, `rl.prompt()` reprendra le flux `input` s'il a été mis en pause.

Si l'`InterfaceConstructor` a été créé avec `output` défini sur `null` ou `undefined`, l'invite n'est pas écrite.

### `rl.resume()` {#rlresume}

**Ajouté dans : v0.3.4**

La méthode `rl.resume()` reprend le flux `input` s'il a été mis en pause.

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**Ajouté dans : v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String)

La méthode `rl.setPrompt()` définit l'invite qui sera écrite dans `output` chaque fois que `rl.prompt()` est appelé.

### `rl.getPrompt()` {#rlgetprompt}

**Ajouté dans : v15.3.0, v14.17.0**

- Retourne : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) la chaîne d'invite actuelle

La méthode `rl.getPrompt()` renvoie l'invite actuelle utilisée par `rl.prompt()`.

### `rl.write(data[, key])` {#rlwritedata-key}

**Ajouté dans : v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String)
- `key` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) `true` pour indiquer la touche <kbd>Ctrl</kbd>.
    - `meta` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) `true` pour indiquer la touche <kbd>Meta</kbd>.
    - `shift` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) `true` pour indiquer la touche <kbd>Shift</kbd>.
    - `name` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) Le nom d'une touche.
  
 

La méthode `rl.write()` écrit soit `data`, soit une séquence de touches identifiée par `key` dans la `output`. L'argument `key` n'est pris en charge que si `output` est un terminal de texte [TTY](/fr/nodejs/api/tty). Voir [Combinaisons de touches TTY](/fr/nodejs/api/readline#tty-keybindings) pour une liste des combinaisons de touches.

Si `key` est spécifié, `data` est ignoré.

Lorsqu'elle est appelée, `rl.write()` reprendra le flux `input` s'il a été mis en pause.

Si `InterfaceConstructor` a été créé avec `output` défini sur `null` ou `undefined`, `data` et `key` ne sont pas écrits.

```js [ESM]
rl.write('Supprimer ceci !');
// Simuler Ctrl+U pour supprimer la ligne écrite précédemment
rl.write(null, { ctrl: true, name: 'u' });
```
La méthode `rl.write()` écrira les données dans le `input` de l'`Interface` `readline` *comme si elles étaient fournies par l'utilisateur*.


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.14.0, v10.17.0 | La prise en charge de Symbol.asyncIterator n’est plus expérimentale. |
| v11.4.0, v10.16.0 | Ajoutée dans : v11.4.0, v10.16.0 |
:::

- Renvoie : [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

Crée un objet `AsyncIterator` qui itère sur chaque ligne du flux d’entrée en tant que chaîne de caractères. Cette méthode permet l’itération asynchrone des objets `InterfaceConstructor` via des boucles `for await...of`.

Les erreurs dans le flux d’entrée ne sont pas transmises.

Si la boucle est terminée avec `break`, `throw` ou `return`, [`rl.close()`](/fr/nodejs/api/readline#rlclose) sera appelée. En d’autres termes, l’itération sur un `InterfaceConstructor` consommera toujours entièrement le flux d’entrée.

Les performances ne sont pas au même niveau que l’API traditionnelle d’événement `'line'`. Utilisez `'line'` à la place pour les applications sensibles aux performances.

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // Chaque ligne de l’entrée readline sera successivement disponible ici sous forme de
    // `line`.
  }
}
```
`readline.createInterface()` commencera à consommer le flux d’entrée une fois invoqué. Avoir des opérations asynchrones entre la création de l’interface et l’itération asynchrone peut entraîner la perte de lignes.

### `rl.line` {#rlline}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.8.0, v14.18.0 | La valeur sera toujours une chaîne de caractères, jamais indéfinie. |
| v0.1.98 | Ajoutée dans : v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Les données d’entrée actuelles en cours de traitement par node.

Cela peut être utilisé lors de la collecte d’entrées à partir d’un flux TTY pour récupérer la valeur actuelle qui a été traitée jusqu’à présent, avant que l’événement `line` ne soit émis. Une fois que l’événement `line` a été émis, cette propriété sera une chaîne vide.

Sachez que la modification de la valeur pendant l’exécution de l’instance peut avoir des conséquences imprévues si `rl.cursor` n’est pas également contrôlé.

**Si vous n’utilisez pas de flux TTY pour l’entrée, utilisez l’événement <a href="#event-line"><code>'line'</code></a>.**

Un cas d’utilisation possible serait le suivant :

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**Ajouté dans : v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

La position du curseur par rapport à `rl.line`.

Cela permet de suivre l’emplacement du curseur actuel dans la chaîne d’entrée, lors de la lecture de l’entrée à partir d’un flux TTY. La position du curseur détermine la portion de la chaîne d’entrée qui sera modifiée lors du traitement de l’entrée, ainsi que la colonne où le curseur du terminal sera rendu.

### `rl.getCursorPos()` {#rlgetcursorpos}

**Ajouté dans : v13.5.0, v12.16.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la ligne de l’invite sur laquelle le curseur se trouve actuellement
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la colonne de l’écran sur laquelle le curseur se trouve actuellement

Retourne la position réelle du curseur par rapport à l’invite d’entrée + la chaîne. Les chaînes d’entrée longues (avec retour à la ligne), ainsi que les invites multilignes sont incluses dans les calculs.

## API Promises {#promises-api}

**Ajouté dans : v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

### Class: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**Ajouté dans : v17.0.0**

- Hérite de : [\<readline.InterfaceConstructor\>](/fr/nodejs/api/readline#class-interfaceconstructor)

Les instances de la classe `readlinePromises.Interface` sont construites à l’aide de la méthode `readlinePromises.createInterface()`. Chaque instance est associée à un seul flux `input` [Readable](/fr/nodejs/api/stream#readable-streams) et à un seul flux `output` [Writable](/fr/nodejs/api/stream#writable-streams). Le flux `output` est utilisé pour afficher les invites d’entrée utilisateur qui arrivent sur le flux `input` et qui en sont lues.


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Ajouté dans: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une déclaration ou une requête à écrire dans `output`, préfixée à l'invite.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet éventuellement d'annuler la fonction `question()` à l'aide d'un `AbortSignal`.
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Une promesse qui est remplie avec l'entrée de l'utilisateur en réponse à la `query`.

La méthode `rl.question()` affiche la `query` en l'écrivant dans la `output`, attend que l'entrée utilisateur soit fournie sur `input`, puis invoque la fonction `callback` en passant l'entrée fournie comme premier argument.

Lorsqu'elle est appelée, `rl.question()` reprend le flux `input` s'il a été interrompu.

Si `readlinePromises.Interface` a été créé avec `output` défini sur `null` ou `undefined`, la `query` n'est pas écrite.

Si la question est appelée après `rl.close()`, elle retourne une promesse rejetée.

Exemple d'utilisation :

```js [ESM]
const answer = await rl.question('Quelle est votre nourriture préférée ? ');
console.log(`Oh, donc votre nourriture préférée est ${answer}`);
```
Utilisation d'un `AbortSignal` pour annuler une question.

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('La question sur la nourriture a expiré');
}, { once: true });

const answer = await rl.question('Quelle est votre nourriture préférée ? ', { signal });
console.log(`Oh, donc votre nourriture préférée est ${answer}`);
```
### Classe: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Ajouté dans: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Ajouté dans: v17.0.0**

- `stream` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable) Un flux [TTY](/fr/nodejs/api/tty).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, il n'est pas nécessaire d'appeler `rl.commit()`.
  
 


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Ajouté dans : v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1` : à gauche du curseur
    - `1` : à droite du curseur
    - `0` : la ligne entière
  
 
- Retourne : this

La méthode `rl.clearLine()` ajoute à la liste interne d'actions en attente une action qui efface la ligne courante du `stream` associé dans une direction spécifiée identifiée par `dir`. Appelez `rl.commit()` pour voir l'effet de cette méthode, à moins que `autoCommit : true` n'ait été passé au constructeur.

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Ajouté dans : v17.0.0**

- Retourne : this

La méthode `rl.clearScreenDown()` ajoute à la liste interne d'actions en attente une action qui efface le stream associé à partir de la position actuelle du curseur vers le bas. Appelez `rl.commit()` pour voir l'effet de cette méthode, à moins que `autoCommit : true` n'ait été passé au constructeur.

#### `rl.commit()` {#rlcommit}

**Ajouté dans : v17.0.0**

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

La méthode `rl.commit()` envoie toutes les actions en attente au `stream` associé et efface la liste interne des actions en attente.

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Ajouté dans : v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : this

La méthode `rl.cursorTo()` ajoute à la liste interne d'actions en attente une action qui déplace le curseur à la position spécifiée dans le `stream` associé. Appelez `rl.commit()` pour voir l'effet de cette méthode, à moins que `autoCommit : true` n'ait été passé au constructeur.

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Ajouté dans : v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : this

La méthode `rl.moveCursor()` ajoute à la liste interne d'actions en attente une action qui déplace le curseur de manière *relative* à sa position actuelle dans le `stream` associé. Appelez `rl.commit()` pour voir l'effet de cette méthode, à moins que `autoCommit : true` n'ait été passé au constructeur.


#### `rl.rollback()` {#rlrollback}

**Ajouté dans : v17.0.0**

- Retourne : this

La méthode `rl.rollback` efface la liste interne des actions en attente sans l'envoyer au `stream` associé.

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**Ajouté dans : v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) Le flux [Readable](/fr/nodejs/api/stream#readable-streams) à écouter. Cette option est *obligatoire*.
    - `output` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable) Le flux [Writable](/fr/nodejs/api/stream#writable-streams) vers lequel écrire les données readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction optionnelle utilisée pour l'autocomplétion par tabulation.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si les flux `input` et `output` doivent être traités comme un TTY, et que des codes d'échappement ANSI/VT100 doivent y être écrits. **Par défaut:** vérification de `isTTY` sur le flux `output` lors de l'instanciation.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste initiale des lignes d'historique. Cette option n'a de sens que si `terminal` est défini sur `true` par l'utilisateur ou par une vérification `output` interne, sinon le mécanisme de mise en cache de l'historique n'est pas initialisé du tout. **Par défaut:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre maximal de lignes d'historique conservées. Pour désactiver l'historique, définissez cette valeur sur `0`. Cette option n'a de sens que si `terminal` est défini sur `true` par l'utilisateur ou par une vérification `output` interne, sinon le mécanisme de mise en cache de l'historique n'est pas initialisé du tout. **Par défaut:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, lorsqu'une nouvelle ligne de saisie ajoutée à la liste d'historique duplique une ligne plus ancienne, cette dernière est supprimée de la liste. **Par défaut:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La chaîne d'invite à utiliser. **Par défaut:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si le délai entre `\r` et `\n` dépasse `crlfDelay` millisecondes, `\r` et `\n` seront tous les deux traités comme une fin de ligne distincte. `crlfDelay` sera forcé à être un nombre non inférieur à `100`. Il peut être défini sur `Infinity`, auquel cas `\r` suivi de `\n` sera toujours considéré comme un seul saut de ligne (ce qui peut être raisonnable pour [la lecture de fichiers](/fr/nodejs/api/readline#example-read-file-stream-line-by-line) avec un délimiteur de ligne `\r\n`). **Par défaut:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durée pendant laquelle `readlinePromises` attendra un caractère (lors de la lecture d'une séquence de touches ambiguë en millisecondes, une séquence qui peut à la fois former une séquence de touches complète en utilisant l'entrée lue jusqu'à présent et peut prendre une entrée supplémentaire pour compléter une séquence de touches plus longue). **Par défaut:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'espaces qu'une tabulation représente (minimum 1). **Par défaut:** `8`.


- Retourne : [\<readlinePromises.Interface\>](/fr/nodejs/api/readline#class-readlinepromisesinterface)

La méthode `readlinePromises.createInterface()` crée une nouvelle instance de `readlinePromises.Interface`.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Une fois l'instance `readlinePromises.Interface` créée, le cas le plus courant est d'écouter l'événement `'line'` :

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Si `terminal` est `true` pour cette instance, alors le flux `output` obtiendra la meilleure compatibilité s'il définit une propriété `output.columns` et émet un événement `'resize'` sur `output` si ou lorsque les colonnes changent ([`process.stdout`](/fr/nodejs/api/process#processstdout) le fait automatiquement lorsqu'il s'agit d'un TTY).


#### Utilisation de la fonction `completer` {#use-of-the-completer-function}

La fonction `completer` prend la ligne actuelle saisie par l'utilisateur comme argument, et renvoie un `Array` avec 2 entrées :

- Un `Array` avec les entrées correspondantes pour la complétion.
- La sous-chaîne qui a été utilisée pour la correspondance.

Par exemple : `[[substr1, substr2, ...], chaîne_originale]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Afficher toutes les complétions si aucune n'est trouvée
  return [hits.length ? hits : completions, line];
}
```
La fonction `completer` peut également renvoyer une [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise), ou être asynchrone :

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## API Callback {#callback-api}

**Ajoutée dans : v0.1.104**

### Classe : `readline.Interface` {#class-readlineinterface}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.0.0 | La classe `readline.Interface` hérite maintenant de `Interface`. |
| v0.1.104 | Ajoutée dans : v0.1.104 |
:::

- Hérite de : [\<readline.InterfaceConstructor\>](/fr/nodejs/api/readline#class-interfaceconstructor)

Les instances de la classe `readline.Interface` sont construites à l'aide de la méthode `readline.createInterface()`. Chaque instance est associée à un seul flux `input` [Readable](/fr/nodejs/api/stream#readable-streams) et à un seul flux `output` [Writable](/fr/nodejs/api/stream#writable-streams). Le flux `output` est utilisé pour imprimer des invites pour la saisie de l'utilisateur qui arrive sur le flux `input` et est lu à partir de celui-ci.

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**Ajoutée dans : v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Une déclaration ou une requête à écrire dans `output`, ajoutée devant l'invite.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet éventuellement d'annuler la `question()` à l'aide d'un `AbortController`.


- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de rappel qui est invoquée avec l'entrée de l'utilisateur en réponse à la `query`.

La méthode `rl.question()` affiche la `query` en l'écrivant dans la `output`, attend que l'entrée de l'utilisateur soit fournie sur `input`, puis invoque la fonction `callback` en passant l'entrée fournie comme premier argument.

Lorsqu'elle est appelée, `rl.question()` reprendra le flux `input` s'il a été mis en pause.

Si l'objet `readline.Interface` a été créé avec `output` défini sur `null` ou `undefined`, la `query` n'est pas écrite.

La fonction `callback` transmise à `rl.question()` ne suit pas le schéma typique d'acceptation d'un objet `Error` ou `null` comme premier argument. Le `callback` est appelé avec la réponse fournie comme seul argument.

Une erreur sera levée si vous appelez `rl.question()` après `rl.close()`.

Exemple d'utilisation :

```js [ESM]
rl.question('Quelle est votre nourriture préférée ? ', (answer) => {
  console.log(`Oh, donc votre nourriture préférée est ${answer}`);
});
```
Utilisation d'un `AbortController` pour annuler une question.

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('Quelle est votre nourriture préférée ? ', { signal }, (answer) => {
  console.log(`Oh, donc votre nourriture préférée est ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('La question sur la nourriture a expiré');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le fait de passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Le callback write() et la valeur de retour du stream sont exposés. |
| v0.7.7 | Ajouté dans : v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number)
    - `-1` : à gauche du curseur
    - `1` : à droite du curseur
    - `0` : toute la ligne
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoquée une fois l'opération terminée.
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) `false` si `stream` souhaite que le code appelant attende que l'événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon `true`.

La méthode `readline.clearLine()` efface la ligne actuelle du stream [TTY](/fr/nodejs/api/tty) donné dans une direction spécifiée identifiée par `dir`.

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le fait de passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Le callback write() et la valeur de retour du stream sont exposés. |
| v0.7.7 | Ajouté dans : v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoquée une fois l'opération terminée.
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) `false` si `stream` souhaite que le code appelant attende que l'événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon `true`.

La méthode `readline.clearScreenDown()` efface le stream [TTY](/fr/nodejs/api/tty) donné à partir de la position actuelle du curseur vers le bas.


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.14.0, v14.18.0 | L'option `signal` est désormais prise en charge. |
| v15.8.0, v14.18.0 | L'option `history` est désormais prise en charge. |
| v13.9.0 | L'option `tabSize` est désormais prise en charge. |
| v8.3.0, v6.11.4 | Suppression de la limite maximale de l'option `crlfDelay`. |
| v6.6.0 | L'option `crlfDelay` est désormais prise en charge. |
| v6.3.0 | L'option `prompt` est désormais prise en charge. |
| v6.0.0 | L'option `historySize` peut désormais être `0`. |
| v0.1.98 | Ajouté dans : v0.1.98 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) Le flux [Readable](/fr/nodejs/api/stream#readable-streams) à écouter. Cette option est *obligatoire*.
    - `output` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable) Le flux [Writable](/fr/nodejs/api/stream#writable-streams) dans lequel écrire les données readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction optionnelle utilisée pour l'auto-complétion par tabulation.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si les flux `input` et `output` doivent être traités comme un TTY, et si des codes d'échappement ANSI/VT100 doivent y être écrits. **Par défaut :** vérification de `isTTY` sur le flux `output` lors de l'instanciation.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste initiale des lignes d'historique. Cette option n'a de sens que si `terminal` est défini sur `true` par l'utilisateur ou par une vérification interne de `output`, sinon le mécanisme de mise en cache de l'historique n'est pas initialisé du tout. **Par défaut :** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre maximal de lignes d'historique conservées. Pour désactiver l'historique, définissez cette valeur sur `0`. Cette option n'a de sens que si `terminal` est défini sur `true` par l'utilisateur ou par une vérification interne de `output`, sinon le mécanisme de mise en cache de l'historique n'est pas initialisé du tout. **Par défaut :** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, lorsqu'une nouvelle ligne de saisie ajoutée à la liste d'historique duplique une ligne plus ancienne, cette ligne plus ancienne est supprimée de la liste. **Par défaut :** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La chaîne d'invite à utiliser. **Par défaut :** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si le délai entre `\r` et `\n` dépasse `crlfDelay` millisecondes, `\r` et `\n` seront traités comme des entrées de fin de ligne distinctes. `crlfDelay` sera forcé à être un nombre non inférieur à `100`. Il peut être défini sur `Infinity`, auquel cas `\r` suivi de `\n` sera toujours considéré comme un seul saut de ligne (ce qui peut être raisonnable pour [lire des fichiers](/fr/nodejs/api/readline#example-read-file-stream-line-by-line) avec le délimiteur de ligne `\r\n`). **Par défaut :** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durée pendant laquelle `readline` attendra un caractère (lors de la lecture d'une séquence de touches ambigüe en millisecondes, une qui peut à la fois former une séquence de touches complète en utilisant l'entrée lue jusqu'à présent et peut prendre une entrée supplémentaire pour compléter une séquence de touches plus longue). **Par défaut :** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'espaces auxquels une tabulation est égale (minimum 1). **Par défaut :** `8`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet de fermer l'interface à l'aide d'un AbortSignal. L'abandon du signal appellera en interne `close` sur l'interface.

- Renvoie : [\<readline.Interface\>](/fr/nodejs/api/readline#class-readlineinterface)

La méthode `readline.createInterface()` crée une nouvelle instance de `readline.Interface`.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Une fois l'instance `readline.Interface` créée, le cas le plus courant est d'écouter l'événement `'line'` :

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Si `terminal` est `true` pour cette instance, le flux `output` bénéficiera de la meilleure compatibilité s'il définit une propriété `output.columns` et émet un événement `'resize'` sur `output` si ou quand les colonnes changent ([`process.stdout`](/fr/nodejs/api/process#processstdout) le fait automatiquement lorsqu'il s'agit d'un TTY).

Lors de la création d'un `readline.Interface` utilisant `stdin` comme entrée, le programme ne se terminera pas tant qu'il n'aura pas reçu un [caractère EOF](https://en.wikipedia.org/wiki/End-of-file#EOF_character). Pour quitter sans attendre la saisie de l'utilisateur, appelez `process.stdin.unref()`.


#### Utilisation de la fonction `completer` {#use-of-the-completer-function_1}

La fonction `completer` prend la ligne actuelle saisie par l'utilisateur comme argument et renvoie un `Array` avec 2 entrées :

- Un `Array` avec les entrées correspondantes pour la complétion.
- La sous-chaîne qui a été utilisée pour la correspondance.

Par exemple : `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Afficher toutes les complétions si aucune n'est trouvée
  return [hits.length ? hits : completions, line];
}
```
La fonction `completer` peut être appelée de manière asynchrone si elle accepte deux arguments :

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Le rappel et la valeur de retour de stream.write() sont exposés. |
| v0.7.7 | Ajouté dans : v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoqué une fois l'opération terminée.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si `stream` souhaite que le code appelant attende que l'événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon `true`.

La méthode `readline.cursorTo()` déplace le curseur à la position spécifiée dans un `stream` [TTY](/fr/nodejs/api/tty) donné.

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Le rappel et la valeur de retour de stream.write() sont exposés. |
| v0.7.7 | Ajouté dans : v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoqué une fois l'opération terminée.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si `stream` souhaite que le code appelant attende que l'événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon `true`.

La méthode `readline.moveCursor()` déplace le curseur *relativement* à sa position actuelle dans un `stream` [TTY](/fr/nodejs/api/tty) donné.


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**Ajouté dans : v0.7.7**

- `stream` [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/fr/nodejs/api/readline#class-interfaceconstructor)

La méthode `readline.emitKeypressEvents()` permet au flux [Readable](/fr/nodejs/api/stream#readable-streams) donné de commencer à émettre des événements `'keypress'` correspondant à l'entrée reçue.

En option, `interface` spécifie une instance `readline.Interface` pour laquelle la saisie semi-automatique est désactivée lorsque des entrées copiées-collées sont détectées.

Si le `stream` est un [TTY](/fr/nodejs/api/tty), alors il doit être en mode brut.

Ceci est automatiquement appelé par toute instance readline sur son `input` si le `input` est un terminal. La fermeture de l'instance `readline` n'empêche pas le `input` d'émettre des événements `'keypress'`.

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## Exemple : Petit CLI {#example-tiny-cli}

L'exemple suivant illustre l'utilisation de la classe `readline.Interface` pour implémenter une petite interface de ligne de commande :

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## Exemple : Lire un flux de fichier ligne par ligne {#example-read-file-stream-line-by-line}

Un cas d’utilisation courant pour `readline` est de consommer un fichier d’entrée une ligne à la fois. La façon la plus simple de le faire est d’utiliser l’API [`fs.ReadStream`](/fr/nodejs/api/fs#class-fsreadstream) ainsi qu’une boucle `for await...of` :

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note : nous utilisons l’option crlfDelay pour reconnaître toutes les instances de CR LF
  // ('\r\n') dans input.txt comme un seul saut de ligne.

  for await (const line of rl) {
    // Chaque ligne dans input.txt sera successivement disponible ici comme `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note : nous utilisons l’option crlfDelay pour reconnaître toutes les instances de CR LF
  // ('\r\n') dans input.txt comme un seul saut de ligne.

  for await (const line of rl) {
    // Chaque ligne dans input.txt sera successivement disponible ici comme `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```
:::

Alternativement, on pourrait utiliser l’événement [`'line'`](/fr/nodejs/api/readline#event-line) :

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```
:::

Actuellement, la boucle `for await...of` peut être un peu plus lente. Si le flux `async` / `await` et la vitesse sont tous deux essentiels, une approche mixte peut être appliquée :

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```
:::


## Raccourcis clavier TTY {#tty-keybindings}

| Raccourcis clavier | Description | Notes |
| --- | --- | --- |
|   +    +   | Supprimer la ligne à gauche | Ne fonctionne pas sous Linux, Mac et Windows |
|   +    +   | Supprimer la ligne à droite | Ne fonctionne pas sous Mac |
|   +   | Émettre   `SIGINT`   ou fermer l'instance readline ||
|   +   | Supprimer à gauche ||
|   +   | Supprimer à droite ou fermer l'instance readline si la ligne courante est vide / EOF | Ne fonctionne pas sous Windows |
|   +   | Supprimer de la position courante au début de la ligne ||
|   +   | Supprimer de la position courante à la fin de la ligne ||
|   +   | Coller (Rappeler) le texte précédemment supprimé | Ne fonctionne qu'avec le texte supprimé par     +     ou     +   |
|   +   | Parcourir les textes précédemment supprimés | Disponible uniquement si la dernière frappe est     +     ou     +   |
|   +   | Aller au début de la ligne ||
|   +   | Aller à la fin de la ligne ||
|   +   | Reculer d'un caractère ||
|   +   | Avancer d'un caractère ||
|   +   | Effacer l'écran ||
|   +   | Élément suivant de l'historique ||
|   +   | Élément précédent de l'historique ||
|   +   | Annuler la modification précédente | Toute frappe qui émet le code de touche   `0x1F`   effectuera cette action.     Dans de nombreux terminaux, par exemple   `xterm`  ,     c'est lié à     +    . |
|   +   | Rétablir la modification précédente | De nombreux terminaux n'ont pas de frappe de rétablissement par défaut.     Nous choisissons le code de touche   `0x1E`   pour effectuer le rétablissement.     Dans   `xterm`  , il est lié à     +         par défaut. |
|   +   | Déplace le processus en cours d'exécution en arrière-plan. Tapez       `fg`   et appuyez sur          pour revenir. | Ne fonctionne pas sous Windows |
|   +     ou         +   | Supprimer en arrière jusqu'à une limite de mot |   +     Ne fonctionne pas     sous Linux, Mac et Windows |
|   +   | Supprimer en avant jusqu'à une limite de mot | Ne fonctionne pas sous Mac |
|   +     ou         +   | Mot à gauche |   +     Ne fonctionne pas     sous Mac |
|   +     ou         +   | Mot à droite |   +     Ne fonctionne pas     sous Mac |
|   +     ou         +   | Supprimer le mot à droite |   +     Ne fonctionne pas     sous Windows |
|   +   | Supprimer le mot à gauche | Ne fonctionne pas sous Mac |

