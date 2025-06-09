---
title: Documentation de l'API Console de Node.js
description: L'API Console de Node.js fournit une console de débogage simple, similaire au mécanisme de console JavaScript fourni par les navigateurs web. Cette documentation détaille les méthodes disponibles pour la journalisation, le débogage et l'inspection des objets JavaScript dans un environnement Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation de l'API Console de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: L'API Console de Node.js fournit une console de débogage simple, similaire au mécanisme de console JavaScript fourni par les navigateurs web. Cette documentation détaille les méthodes disponibles pour la journalisation, le débogage et l'inspection des objets JavaScript dans un environnement Node.js.
  - - meta
    - name: twitter:title
      content: Documentation de l'API Console de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: L'API Console de Node.js fournit une console de débogage simple, similaire au mécanisme de console JavaScript fourni par les navigateurs web. Cette documentation détaille les méthodes disponibles pour la journalisation, le débogage et l'inspection des objets JavaScript dans un environnement Node.js.
---


# Console {#console}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

Le module `node:console` fournit une simple console de débogage similaire au mécanisme de console JavaScript fourni par les navigateurs web.

Le module exporte deux composants spécifiques :

- Une classe `Console` avec des méthodes telles que `console.log()`, `console.error()` et `console.warn()` qui peuvent être utilisées pour écrire dans n'importe quel flux Node.js.
- Une instance globale `console` configurée pour écrire dans [`process.stdout`](/fr/nodejs/api/process#processstdout) et [`process.stderr`](/fr/nodejs/api/process#processstderr). La `console` globale peut être utilisée sans appeler `require('node:console')`.

*<strong>Attention</strong>* : Les méthodes de l'objet console global ne sont ni systématiquement synchrones comme les API de navigateur auxquelles elles ressemblent, ni systématiquement asynchrones comme tous les autres flux Node.js. Les programmes qui souhaitent dépendre du comportement synchrone/asynchrone des fonctions de la console doivent d'abord déterminer la nature du flux de support de la console. Ceci est dû au fait que le flux dépend de la plate-forme sous-jacente et de la configuration de flux standard du processus actuel. Consultez la [note sur l'E/S de processus](/fr/nodejs/api/process#a-note-on-process-io) pour plus d'informations.

Exemple d'utilisation de la `console` globale :

```js [ESM]
console.log('hello world');
// Affiche : hello world, sur stdout
console.log('hello %s', 'world');
// Affiche : hello world, sur stdout
console.error(new Error('Whoops, something bad happened'));
// Affiche le message d'erreur et le stack trace sur stderr :
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// Affiche : Danger Will Robinson! Danger!, sur stderr
```
Exemple d'utilisation de la classe `Console` :

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// Affiche : hello world, sur out
myConsole.log('hello %s', 'world');
// Affiche : hello world, sur out
myConsole.error(new Error('Whoops, something bad happened'));
// Affiche : [Error: Whoops, something bad happened], sur err

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// Affiche : Danger Will Robinson! Danger!, sur err
```

## Classe : `Console` {#class-console}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Les erreurs qui surviennent lors de l'écriture dans les flux sous-jacents seront désormais ignorées par défaut. |
:::

La classe `Console` peut être utilisée pour créer un simple logger avec des flux de sortie configurables et est accessible en utilisant `require('node:console').Console` ou `console.Console` (ou leurs contreparties déstructurées) :

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.2.0, v12.17.0 | L'option `groupIndentation` a été introduite. |
| v11.7.0 | L'option `inspectOptions` a été introduite. |
| v10.0.0 | Le constructeur `Console` prend désormais en charge un argument `options`, et l'option `colorMode` a été introduite. |
| v8.0.0 | L'option `ignoreErrors` a été introduite. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ignore les erreurs lors de l'écriture dans les flux sous-jacents. **Par défaut :** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Définit la prise en charge des couleurs pour cette instance `Console`. Si la valeur est `true`, la coloration est activée lors de l'inspection des valeurs. Si la valeur est `false`, la coloration est désactivée lors de l'inspection des valeurs. Si la valeur est `'auto'`, la prise en charge des couleurs dépend de la valeur de la propriété `isTTY` et de la valeur renvoyée par `getColorDepth()` sur le flux respectif. Cette option ne peut pas être utilisée si `inspectOptions.colors` est également défini. **Par défaut :** `'auto'`.
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Spécifie les options qui sont transmises à [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options).
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'indentation du groupe. **Par défaut :** `2`.

Crée une nouvelle `Console` avec une ou deux instances de flux d'écriture. `stdout` est un flux d'écriture pour imprimer les logs ou les informations. `stderr` est utilisé pour les avertissements ou les erreurs. Si `stderr` n'est pas fourni, `stdout` est utilisé pour `stderr`.

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

La `console` globale est une `Console` spéciale dont la sortie est envoyée à [`process.stdout`](/fr/nodejs/api/process#processstdout) et [`process.stderr`](/fr/nodejs/api/process#processstderr). Elle équivaut à appeler :

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L'implémentation est désormais conforme à la spécification et ne lève plus d'exception. |
| v0.1.101 | Ajouté dans : v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La valeur testée pour être truthy.
- `...message` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Tous les arguments autres que `value` sont utilisés comme message d'erreur.

`console.assert()` écrit un message si `value` est [falsy](https://developer.mozilla.org/fr/docs/Glossary/Falsy) ou omis. Il écrit uniquement un message et n'affecte pas l'exécution par ailleurs. La sortie commence toujours par `"Assertion failed"`. Si fourni, `message` est formaté à l'aide de [`util.format()`](/fr/nodejs/api/util#utilformatformat-args).

Si `value` est [truthy](https://developer.mozilla.org/fr/docs/Glossary/Truthy), rien ne se passe.

```js [ESM]
console.assert(true, 'ne fait rien');

console.assert(false, 'Oups %s ça', 'n\'a pas');
// Assertion failed: Oups ça n'a pas fonctionné

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**Ajouté dans : v8.3.0**

Lorsque `stdout` est un TTY, appeler `console.clear()` tentera d'effacer le TTY. Lorsque `stdout` n'est pas un TTY, cette méthode ne fait rien.

Le fonctionnement spécifique de `console.clear()` peut varier selon les systèmes d'exploitation et les types de terminaux. Pour la plupart des systèmes d'exploitation Linux, `console.clear()` fonctionne de la même manière que la commande shell `clear`. Sous Windows, `console.clear()` efface uniquement la sortie dans la fenêtre du terminal actuel pour le binaire Node.js.

### `console.count([label])` {#consolecountlabel}

**Ajouté dans : v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) L'étiquette d'affichage pour le compteur. **Par défaut :** `'default'`.

Maintient un compteur interne spécifique à `label` et affiche sur `stdout` le nombre de fois que `console.count()` a été appelé avec le `label` donné.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Ajouté dans : v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’étiquette d’affichage du compteur. **Par défaut :** `'default'`.

Réinitialise le compteur interne spécifique à `label`.

```js [ESM]
> console.count('abc');
abc : 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc : 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.10.0 | `console.debug` est désormais un alias de `console.log`. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La fonction `console.debug()` est un alias de [`console.log()`](/fr/nodejs/api/console#consolelogdata-args).

### `console.dir(obj[, options])` {#consoledirobj-options}

**Ajouté dans : v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, les propriétés non énumérables et symboliques de l’objet seront également affichées. **Par défaut :** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Indique à [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options) combien de fois réitérer lors du formatage de l’objet. Ceci est utile pour inspecter de grands objets compliqués. Pour que la réitération soit indéfinie, passez `null`. **Par défaut :** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la sortie sera stylisée avec des codes de couleur ANSI. Les couleurs sont personnalisables ; voir [personnalisation des couleurs `util.inspect()`](/fr/nodejs/api/util#customizing-utilinspect-colors). **Par défaut :** `false`.



Utilise [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options) sur `obj` et affiche la chaîne résultante dans `stdout`. Cette fonction contourne toute fonction `inspect()` personnalisée définie sur `obj`.


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.3.0 | `console.dirxml` appelle désormais `console.log` pour ses arguments. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)

Cette méthode appelle `console.log()` en lui passant les arguments reçus. Cette méthode ne produit aucun formatage XML.

### `console.error([data][, ...args])` {#consoleerrordata-args}

**Ajouté dans : v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)

Affiche sur `stderr` avec un saut de ligne. Plusieurs arguments peuvent être passés, le premier étant utilisé comme message principal et tous les autres comme valeurs de substitution similaires à [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (les arguments sont tous passés à [`util.format()`](/fr/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const code = 5;
console.error('error #%d', code);
// Affiche : error #5, sur stderr
console.error('error', code);
// Affiche : error 5, sur stderr
```
Si des éléments de formatage (par exemple, `%d`) ne sont pas trouvés dans la première chaîne, alors [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options) est appelé sur chaque argument et les valeurs de chaîne résultantes sont concaténées. Voir [`util.format()`](/fr/nodejs/api/util#utilformatformat-args) pour plus d'informations.

### `console.group([...label])` {#consolegrouplabel}

**Ajouté dans : v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)

Augmente l'indentation des lignes suivantes par des espaces de la longueur de `groupIndentation`.

Si un ou plusieurs `label`s sont fournis, ceux-ci sont imprimés en premier sans l'indentation supplémentaire.

### `console.groupCollapsed()` {#consolegroupcollapsed}

**Ajouté dans : v8.5.0**

Un alias pour [`console.group()`](/fr/nodejs/api/console#consolegrouplabel).

### `console.groupEnd()` {#consolegroupend}

**Ajouté dans : v8.5.0**

Diminue l'indentation des lignes suivantes par des espaces de la longueur de `groupIndentation`.


### `console.info([data][, ...args])` {#consoleinfodata-args}

**Ajouté dans : v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La fonction `console.info()` est un alias de [`console.log()`](/fr/nodejs/api/console#consolelogdata-args).

### `console.log([data][, ...args])` {#consolelogdata-args}

**Ajouté dans : v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Affiche sur `stdout` avec un saut de ligne. Plusieurs arguments peuvent être passés, le premier étant utilisé comme message principal et tous les autres comme valeurs de substitution, de la même manière que [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (les arguments sont tous passés à [`util.format()`](/fr/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Affiche : count: 5, sur stdout
console.log('count:', count);
// Affiche : count: 5, sur stdout
```
Voir [`util.format()`](/fr/nodejs/api/util#utilformatformat-args) pour plus d'informations.

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**Ajouté dans : v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Autres propriétés pour construire le tableau.

Tente de construire un tableau avec les colonnes des propriétés de `tabularData` (ou utilise `properties`) et les lignes de `tabularData` et l'enregistre. Revient à simplement enregistrer l'argument s'il ne peut pas être analysé comme tabulaire.

```js [ESM]
// Ceux-ci ne peuvent pas être analysés comme des données tabulaires
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**Ajouté dans : v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'default'`

Démarre un chronomètre qui peut être utilisé pour calculer la durée d’une opération. Les chronomètres sont identifiés par un `label` unique. Utilisez le même `label` lors de l’appel de [`console.timeEnd()`](/fr/nodejs/api/console#consoletimeendlabel) pour arrêter le chronomètre et afficher le temps écoulé dans les unités de temps appropriées sur `stdout`. Par exemple, si le temps écoulé est de 3 869 ms, `console.timeEnd()` affiche "3.869s".

### `console.timeEnd([label])` {#consoletimeendlabel}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Le temps écoulé est affiché avec une unité de temps appropriée. |
| v6.0.0 | Cette méthode ne prend plus en charge les appels multiples qui ne correspondent pas aux appels `console.time()` individuels ; voir ci-dessous pour plus de détails. |
| v0.1.104 | Ajouté dans : v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'default'`

Arrête un chronomètre qui a été précédemment démarré en appelant [`console.time()`](/fr/nodejs/api/console#consoletimelabel) et affiche le résultat sur `stdout` :

```js [ESM]
console.time('tas-de-trucs');
// Faire un tas de trucs.
console.timeEnd('tas-de-trucs');
// Affiche : tas-de-trucs : 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**Ajouté dans : v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Pour un chronomètre qui a été précédemment démarré en appelant [`console.time()`](/fr/nodejs/api/console#consoletimelabel), affiche le temps écoulé et d’autres arguments `data` sur `stdout` :

```js [ESM]
console.time('processus');
const value = expensiveProcess1(); // Retourne 42
console.timeLog('processus', value);
// Affiche "processus : 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('processus');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**Ajouté dans : v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Affiche sur `stderr` la chaîne `'Trace : '`, suivie du message formaté [`util.format()`](/fr/nodejs/api/util#utilformatformat-args) et de la trace de pile jusqu’à la position actuelle dans le code.

```js [ESM]
console.trace('Montre-moi');
// Affiche : (la trace de pile variera en fonction de l’endroit où la trace est appelée)
// Trace : Montre-moi
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**Ajouté dans : v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La fonction `console.warn()` est un alias de [`console.error()`](/fr/nodejs/api/console#consoleerrordata-args).

## Méthodes réservées à l'inspecteur {#inspector-only-methods}

Les méthodes suivantes sont exposées par le moteur V8 dans l'API générale, mais n'affichent rien sauf si elles sont utilisées conjointement avec l'[inspecteur](/fr/nodejs/api/debugger) (indicateur `--inspect`).

### `console.profile([label])` {#consoleprofilelabel}

**Ajouté dans : v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cette méthode n'affiche rien sauf si elle est utilisée dans l'inspecteur. La méthode `console.profile()` démarre un profil CPU JavaScript avec un label optionnel jusqu'à ce que [`console.profileEnd()`](/fr/nodejs/api/console#consoleprofileendlabel) soit appelé. Le profil est ensuite ajouté au panneau **Profile** de l'inspecteur.

```js [ESM]
console.profile('MonLabel');
// Du code
console.profileEnd('MonLabel');
// Ajoute le profil 'MonLabel' au panneau Profils de l'inspecteur.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**Ajouté dans : v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cette méthode n'affiche rien sauf si elle est utilisée dans l'inspecteur. Arrête la session actuelle de profilage du CPU JavaScript si elle a été démarrée et imprime le rapport dans le panneau **Profils** de l'inspecteur. Voir [`console.profile()`](/fr/nodejs/api/console#consoleprofilelabel) pour un exemple.

Si cette méthode est appelée sans label, le profil démarré le plus récemment est arrêté.

### `console.timeStamp([label])` {#consoletimestamplabel}

**Ajouté dans : v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cette méthode n'affiche rien sauf si elle est utilisée dans l'inspecteur. La méthode `console.timeStamp()` ajoute un événement avec le label `'label'` au panneau **Timeline** de l'inspecteur.

