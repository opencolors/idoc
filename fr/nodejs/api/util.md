---
title: Documentation Node.js - Utilitaires
description: La documentation de Node.js pour le module 'util', qui fournit des fonctions utilitaires pour les applications Node.js, y compris le débogage, l'inspection d'objets, et plus.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Utilitaires | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentation de Node.js pour le module 'util', qui fournit des fonctions utilitaires pour les applications Node.js, y compris le débogage, l'inspection d'objets, et plus.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Utilitaires | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentation de Node.js pour le module 'util', qui fournit des fonctions utilitaires pour les applications Node.js, y compris le débogage, l'inspection d'objets, et plus.
---


# Util {#util}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

Le module `node:util` répond aux besoins des API internes de Node.js. De nombreux utilitaires sont également utiles pour les développeurs d’applications et de modules. Pour y accéder :

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**Ajouté dans : v8.2.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction `async`
- Renvoie : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) une fonction de style callback

Prend une fonction `async` (ou une fonction qui renvoie une `Promise`) et renvoie une fonction suivant le style de callback avec gestion d’erreur en premier, c’est-à-dire prenant un callback `(err, value) => ...` comme dernier argument. Dans le callback, le premier argument sera la raison du rejet (ou `null` si la `Promise` est résolue), et le deuxième argument sera la valeur résolue.

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
Affichera :

```text [TEXT]
hello world
```
Le callback est exécuté de manière asynchrone et aura une trace de pile limitée. Si le callback lève une exception, le processus émettra un événement [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception), et s’il n’est pas géré, il se terminera.

Puisque `null` a une signification particulière comme premier argument d’un callback, si une fonction enveloppée rejette une `Promise` avec une valeur falsy comme raison, la valeur est enveloppée dans une `Error` avec la valeur d’origine stockée dans un champ nommé `reason`.

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // When the Promise was rejected with `null` it is wrapped with an Error and
  // the original value is stored in `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**Ajouté dans : v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une chaîne de caractères identifiant la portion de l'application pour laquelle la fonction `debuglog` est en cours de création.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Un callback invoqué la première fois que la fonction de journalisation est appelée avec un argument de fonction qui est une fonction de journalisation plus optimisée.
- Retourne : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de journalisation

La méthode `util.debuglog()` est utilisée pour créer une fonction qui écrit conditionnellement des messages de débogage dans `stderr` en fonction de l'existence de la variable d'environnement `NODE_DEBUG`. Si le nom de la `section` apparaît dans la valeur de cette variable d'environnement, alors la fonction retournée fonctionne de manière similaire à [`console.error()`](/fr/nodejs/api/console#consoleerrordata-args). Si ce n'est pas le cas, alors la fonction retournée est une no-op.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('hello from foo [%d]', 123);
```
Si ce programme est exécuté avec `NODE_DEBUG=foo` dans l'environnement, il affichera quelque chose comme :

```bash [BASH]
FOO 3245: hello from foo [123]
```
où `3245` est l'identifiant du processus. S'il n'est pas exécuté avec cette variable d'environnement définie, il n'affichera rien.

La `section` prend également en charge les caractères génériques :

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('hi there, it\'s foo-bar [%d]', 2333);
```
si elle est exécutée avec `NODE_DEBUG=foo*` dans l'environnement, elle affichera quelque chose comme :

```bash [BASH]
FOO-BAR 3257: hi there, it's foo-bar [2333]
```
Plusieurs noms de `section` séparés par des virgules peuvent être spécifiés dans la variable d'environnement `NODE_DEBUG` : `NODE_DEBUG=fs,net,tls`.

L'argument optionnel `callback` peut être utilisé pour remplacer la fonction de journalisation par une fonction différente qui n'a pas d'initialisation ou d'encapsulation inutile.

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // Remplacer par une fonction de journalisation qui optimise
  // le test de l'activation de la section
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**Ajouté dans: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Le getter `util.debuglog().enabled` est utilisé pour créer un test qui peut être utilisé dans des conditionnelles basées sur l'existence de la variable d'environnement `NODE_DEBUG`. Si le nom de la `section` apparaît dans la valeur de cette variable d'environnement, alors la valeur retournée sera `true`. Sinon, la valeur retournée sera `false`.

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```
Si ce programme est exécuté avec `NODE_DEBUG=foo` dans l'environnement, alors il affichera quelque chose comme :

```bash [BASH]
hello from foo [123]
```
## `util.debug(section)` {#utildebugsection}

**Ajouté dans: v14.9.0**

Alias pour `util.debuglog`. L'utilisation permet une lisibilité qui n'implique pas la journalisation lorsque seul `util.debuglog().enabled` est utilisé.

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Les avertissements de dépréciation ne sont émis qu'une seule fois pour chaque code. |
| v0.8.0 | Ajouté dans : v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction qui est en cours de dépréciation.
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un message d'avertissement à afficher lorsque la fonction dépréciée est invoquée.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un code de dépréciation. Voir la [liste des API dépréciées](/fr/nodejs/api/deprecations#list-of-deprecated-apis) pour une liste des codes.
- Retourne : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction dépréciée enveloppée pour émettre un avertissement.

La méthode `util.deprecate()` enveloppe `fn` (qui peut être une fonction ou une classe) de manière à ce qu'elle soit marquée comme dépréciée.

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // Faire quelque chose ici.
}, 'obsoleteFunction() est dépréciée. Utilisez newShinyFunction() à la place.');
```
Lorsqu'elle est appelée, `util.deprecate()` renverra une fonction qui émettra un `DeprecationWarning` en utilisant l'événement [`'warning'`](/fr/nodejs/api/process#event-warning). L'avertissement sera émis et imprimé dans `stderr` la première fois que la fonction retournée est appelée. Une fois l'avertissement émis, la fonction enveloppée est appelée sans émettre d'avertissement.

Si le même `code` optionnel est fourni dans plusieurs appels à `util.deprecate()`, l'avertissement ne sera émis qu'une seule fois pour ce `code`.

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // Émet un avertissement de dépréciation avec le code DEP0001
fn2(); // N'émet pas d'avertissement de dépréciation car il a le même code
```
Si les indicateurs de ligne de commande `--no-deprecation` ou `--no-warnings` sont utilisés, ou si la propriété `process.noDeprecation` est définie sur `true` *avant* le premier avertissement de dépréciation, la méthode `util.deprecate()` ne fait rien.

Si les indicateurs de ligne de commande `--trace-deprecation` ou `--trace-warnings` sont définis, ou si la propriété `process.traceDeprecation` est définie sur `true`, un avertissement et une trace de pile sont imprimés dans `stderr` la première fois que la fonction dépréciée est appelée.

Si l'indicateur de ligne de commande `--throw-deprecation` est défini, ou si la propriété `process.throwDeprecation` est définie sur `true`, une exception sera levée lorsque la fonction dépréciée est appelée.

L'indicateur de ligne de commande `--throw-deprecation` et la propriété `process.throwDeprecation` ont priorité sur `--trace-deprecation` et `process.traceDeprecation`.


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.11.0 | Le spécificateur `%c` est désormais ignoré. |
| v12.0.0 | L'argument `format` n'est désormais pris comme tel que s'il contient réellement des spécificateurs de format. |
| v12.0.0 | Si l'argument `format` n'est pas une chaîne de format, la mise en forme de la chaîne de sortie ne dépend plus du type du premier argument. Cette modification supprime les guillemets précédemment présents dans les chaînes qui étaient affichées lorsque le premier argument n'était pas une chaîne. |
| v11.4.0 | Les spécificateurs `%d`, `%f` et `%i` prennent désormais correctement en charge les Symboles. |
| v11.4.0 | La `depth` du spécificateur `%o` a à nouveau une profondeur par défaut de 4. |
| v11.0.0 | L'option `depth` du spécificateur `%o` reviendra désormais à la profondeur par défaut. |
| v10.12.0 | Les spécificateurs `%d` et `%i` prennent désormais en charge BigInt. |
| v8.4.0 | Les spécificateurs `%o` et `%O` sont désormais pris en charge. |
| v0.5.3 | Ajouté dans : v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Une chaîne de format de type `printf`.

La méthode `util.format()` renvoie une chaîne formatée en utilisant le premier argument comme une chaîne de format de type `printf` qui peut contenir zéro ou plusieurs spécificateurs de format. Chaque spécificateur est remplacé par la valeur convertie de l'argument correspondant. Les spécificateurs pris en charge sont :

- `%s` : `String` sera utilisé pour convertir toutes les valeurs sauf `BigInt`, `Object` et `-0`. Les valeurs `BigInt` seront représentées avec un `n` et les objets qui n'ont pas de fonction `toString` définie par l'utilisateur sont inspectés à l'aide de `util.inspect()` avec les options `{ depth: 0, colors: false, compact: 3 }`.
- `%d` : `Number` sera utilisé pour convertir toutes les valeurs sauf `BigInt` et `Symbol`.
- `%i` : `parseInt(value, 10)` est utilisé pour toutes les valeurs sauf `BigInt` et `Symbol`.
- `%f` : `parseFloat(value)` est utilisé pour toutes les valeurs sauf `Symbol`.
- `%j` : JSON. Remplacé par la chaîne `'[Circular]'` si l'argument contient des références circulaires.
- `%o` : `Object`. Une représentation sous forme de chaîne d'un objet avec une mise en forme d'objet JavaScript générique. Similaire à `util.inspect()` avec les options `{ showHidden: true, showProxy: true }`. Cela affichera l'objet complet, y compris les propriétés non énumérables et les proxys.
- `%O` : `Object`. Une représentation sous forme de chaîne d'un objet avec une mise en forme d'objet JavaScript générique. Similaire à `util.inspect()` sans options. Cela affichera l'objet complet, sans inclure les propriétés non énumérables et les proxys.
- `%c` : `CSS`. Ce spécificateur est ignoré et sautera tout CSS transmis.
- `%%` : signe pourcentage simple (`'%'`). Cela ne consomme pas d'argument.
- Retourne : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) La chaîne formatée

Si un spécificateur n'a pas d'argument correspondant, il n'est pas remplacé :

```js [ESM]
util.format('%s:%s', 'foo');
// Renvoie : 'foo:%s'
```
Les valeurs qui ne font pas partie de la chaîne de format sont formatées à l'aide de `util.inspect()` si leur type n'est pas `string`.

S'il y a plus d'arguments passés à la méthode `util.format()` que le nombre de spécificateurs, les arguments supplémentaires sont concaténés à la chaîne renvoyée, séparés par des espaces :

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// Renvoie : 'foo:bar baz'
```
Si le premier argument ne contient pas de spécificateur de format valide, `util.format()` renvoie une chaîne qui est la concaténation de tous les arguments séparés par des espaces :

```js [ESM]
util.format(1, 2, 3);
// Renvoie : '1 2 3'
```
Si un seul argument est passé à `util.format()`, il est renvoyé tel quel sans aucune mise en forme :

```js [ESM]
util.format('%% %s');
// Renvoie : '%% %s'
```
`util.format()` est une méthode synchrone qui est conçue comme un outil de débogage. Certaines valeurs d'entrée peuvent avoir une surcharge de performance importante qui peut bloquer la boucle d'événements. Utilisez cette fonction avec précaution et jamais dans un chemin de code critique.


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**Ajouté dans la version : v10.0.0**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cette fonction est identique à [`util.format()`](/fr/nodejs/api/util#utilformatformat-args), sauf qu'elle prend un argument `inspectOptions` qui spécifie les options qui sont transmises à [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options).

```js [ESM]
util.formatWithOptions({ colors: true }, 'Voir l\'objet %O', { foo: 42 });
// Renvoie 'Voir l'objet { foo: 42 }', où `42` est coloré comme un nombre
// lors de l'impression dans un terminal.
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.3.0 | L'API est renommée de `util.getCallSite` en `util.getCallSites()`. |
| v22.9.0 | Ajouté dans la version : v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre optionnel de trames à capturer en tant qu'objets de site d'appel. **Par défaut :** `10`. La plage autorisée est comprise entre 1 et 200.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionnel 
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Reconstruire l'emplacement d'origine dans la trace de la pile à partir de la source-map. Activé par défaut avec l'indicateur `--enable-source-maps`.
  
 
- Renvoie : [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un tableau d'objets de site d'appel 
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Renvoie le nom de la fonction associée à ce site d'appel.
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Renvoie le nom de la ressource qui contient le script de la fonction pour ce site d'appel.
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Renvoie le numéro, basé sur 1, de la ligne pour l'appel de fonction associé.
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Renvoie le décalage de colonne basé sur 1 sur la ligne pour l'appel de fonction associé.
  
 

Renvoie un tableau d'objets de site d'appel contenant la pile de la fonction appelante.

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('Sites d\'appel :');
  callSites.forEach((callSite, index) => {
    console.log(`Site d\'appel ${index + 1} :`);
    console.log(`Nom de la fonction : ${callSite.functionName}`);
    console.log(`Nom du script : ${callSite.scriptName}`);
    console.log(`Numéro de ligne : ${callSite.lineNumber}`);
    console.log(`Numéro de colonne : ${callSite.column}`);
  });
  // Site d'appel 1 :
  // Nom de la fonction : exampleFunction
  // Nom du script : /home/example.js
  // Numéro de ligne : 5
  // Numéro de colonne : 26

  // Site d'appel 2 :
  // Nom de la fonction : anotherFunction
  // Nom du script : /home/example.js
  // Numéro de ligne : 22
  // Numéro de colonne : 3

  // ...
}

// Une fonction pour simuler une autre couche de pile
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
Il est possible de reconstruire les emplacements d'origine en définissant l'option `sourceMap` sur `true`. Si la source map n'est pas disponible, l'emplacement d'origine sera le même que l'emplacement actuel. Lorsque l'indicateur `--enable-source-maps` est activé, par exemple lors de l'utilisation de `--experimental-transform-types`, `sourceMap` sera `true` par défaut.

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// Avec sourceMap :
// Nom de la fonction : ''
// Nom du script : example.js
// Numéro de ligne : 7
// Numéro de colonne : 26

// Sans sourceMap :
// Nom de la fonction : ''
// Nom du script : example.js
// Numéro de ligne : 2
// Numéro de colonne : 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**Ajouté dans : v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne le nom de chaîne pour un code d’erreur numérique provenant d’une API Node.js. Le mappage entre les codes d’erreur et les noms d’erreur dépend de la plateforme. Voir [Erreurs système courantes](/fr/nodejs/api/errors#common-system-errors) pour connaître les noms des erreurs courantes.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**Ajouté dans : v16.0.0, v14.17.0**

- Retourne : [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Retourne un Map de tous les codes d’erreur système disponibles à partir de l’API Node.js. Le mappage entre les codes d’erreur et les noms d’erreur dépend de la plateforme. Voir [Erreurs système courantes](/fr/nodejs/api/errors#common-system-errors) pour connaître les noms des erreurs courantes.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**Ajouté dans : v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne le message de chaîne pour un code d’erreur numérique provenant d’une API Node.js. Le mappage entre les codes d’erreur et les messages de chaîne dépend de la plateforme.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.0.0 | Le paramètre `constructor` peut maintenant faire référence à une classe ES6. |
| v0.3.0 | Ajouté dans : v0.3.0 |
:::

::: info [Stable: 3 - Hérité]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stabilité: 3](/fr/nodejs/api/documentation#stability-index) - Hérité : Veuillez plutôt utiliser la syntaxe de classe ES2015 et le mot-clé `extends`.
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

L’utilisation de `util.inherits()` est déconseillée. Veuillez utiliser les mots-clés `class` et `extends` de ES6 pour obtenir une prise en charge de l’héritage au niveau du langage. Notez également que les deux styles sont [sémantiquement incompatibles](https://github.com/nodejs/node/issues/4179).

Hérite des méthodes de prototype d’un [constructeur](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) dans un autre. Le prototype de `constructor` sera défini sur un nouvel objet créé à partir de `superConstructor`.

Cela ajoute principalement une validation d’entrée au-dessus de `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)`. Pour plus de commodité, `superConstructor` sera accessible via la propriété `constructor.super_`.

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
Exemple ES6 utilisant `class` et `extends` :

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.18.0 | ajout du support de `maxArrayLength` lors de l'inspection de `Set` et `Map`. |
| v17.3.0, v16.14.0 | L'option `numericSeparator` est désormais supportée. |
| v13.0.0 | Les références circulaires incluent désormais un marqueur vers la référence. |
| v14.6.0, v12.19.0 | Si `object` provient maintenant d'un `vm.Context` différent, une fonction d'inspection personnalisée ne recevra plus d'arguments spécifiques au contexte. |
| v13.13.0, v12.17.0 | L'option `maxStringLength` est désormais supportée. |
| v13.5.0, v12.16.0 | Les propriétés de prototype définies par l'utilisateur sont inspectées si `showHidden` est `true`. |
| v12.0.0 | La valeur par défaut des options `compact` est modifiée à `3` et la valeur par défaut des options `breakLength` est modifiée à `80`. |
| v12.0.0 | Les propriétés internes n'apparaissent plus dans l'argument de contexte d'une fonction d'inspection personnalisée. |
| v11.11.0 | L'option `compact` accepte les nombres pour un nouveau mode de sortie. |
| v11.7.0 | Les ArrayBuffers affichent désormais également leur contenu binaire. |
| v11.5.0 | L'option `getters` est désormais supportée. |
| v11.4.0 | La valeur par défaut de `depth` est revenue à `2`. |
| v11.0.0 | La valeur par défaut de `depth` est modifiée à `20`. |
| v11.0.0 | La sortie d'inspection est maintenant limitée à environ 128 Mio. Les données supérieures à cette taille ne seront pas entièrement inspectées. |
| v10.12.0 | L'option `sorted` est désormais supportée. |
| v10.6.0 | L'inspection des listes chaînées et des objets similaires est désormais possible jusqu'à la taille maximale de la pile d'appels. |
| v10.0.0 | Les entrées `WeakMap` et `WeakSet` peuvent désormais également être inspectées. |
| v9.9.0 | L'option `compact` est désormais supportée. |
| v6.6.0 | Les fonctions d'inspection personnalisées peuvent désormais renvoyer `this`. |
| v6.3.0 | L'option `breakLength` est désormais supportée. |
| v6.1.0 | L'option `maxArrayLength` est désormais supportée ; en particulier, les tableaux longs sont tronqués par défaut. |
| v6.1.0 | L'option `showProxy` est désormais supportée. |
| v0.3.0 | Ajoutée dans : v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) N'importe quelle primitive JavaScript ou `Object`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, les symboles et les propriétés non énumérables de `object` sont inclus dans le résultat formaté. Les entrées [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) et [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) sont également incluses, ainsi que les propriétés de prototype définies par l'utilisateur (à l'exclusion des propriétés de méthode). **Par défaut :** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de fois où la fonction doit être récursive lors du formatage de `object`. Ceci est utile pour inspecter de grands objets. Pour récurser jusqu'à la taille maximale de la pile d'appels, passez `Infinity` ou `null`. **Par défaut :** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la sortie est stylisée avec des codes de couleurs ANSI. Les couleurs sont personnalisables. Voir [Personnalisation des couleurs de `util.inspect`](/fr/nodejs/api/util#customizing-utilinspect-colors). **Par défaut :** `false`.
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `false`, les fonctions `[util.inspect.custom](depth, opts, inspect)` ne sont pas invoquées. **Par défaut :** `true`.
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, l'inspection `Proxy` inclut les objets [`target` et `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology). **Par défaut :** `false`.
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre maximum d'éléments `Array`, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) et [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) à inclure lors du formatage. Définissez sur `null` ou `Infinity` pour afficher tous les éléments. Définissez sur `0` ou négatif pour n'afficher aucun élément. **Par défaut :** `100`.
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre maximum de caractères à inclure lors du formatage. Définissez sur `null` ou `Infinity` pour afficher tous les éléments. Définissez sur `0` ou négatif pour n'afficher aucun caractère. **Par défaut :** `10000`.
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur à laquelle les valeurs d'entrée sont divisées sur plusieurs lignes. Définissez sur `Infinity` pour formater l'entrée sur une seule ligne (en combinaison avec `compact` défini sur `true` ou n'importe quel nombre \>= `1`). **Par défaut :** `80`.
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définir ceci sur `false` fait que chaque clé d'objet est affichée sur une nouvelle ligne. Il cassera sur les nouvelles lignes dans le texte qui est plus long que `breakLength`. Si défini sur un nombre, les `n` éléments intérieurs les plus proches sont réunis sur une seule ligne tant que toutes les propriétés tiennent dans `breakLength`. Les éléments de tableau courts sont également regroupés. Pour plus d'informations, voir l'exemple ci-dessous. **Par défaut :** `3`.
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Si défini sur `true` ou une fonction, toutes les propriétés d'un objet, et les entrées `Set` et `Map` sont triées dans la chaîne résultante. Si défini sur `true`, le [tri par défaut](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) est utilisé. Si défini sur une fonction, elle est utilisée comme [fonction de comparaison](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si défini sur `true`, les getters sont inspectés. Si défini sur `'get'`, seuls les getters sans setter correspondant sont inspectés. Si défini sur `'set'`, seuls les getters avec un setter correspondant sont inspectés. Ceci peut causer des effets secondaires en fonction de la fonction getter. **Par défaut :** `false`.
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si défini sur `true`, un tiret bas est utilisé pour séparer tous les trois chiffres dans tous les bigints et les nombres. **Par défaut :** `false`.
  
 
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La représentation de `object`.

La méthode `util.inspect()` renvoie une représentation sous forme de chaîne de `object` qui est destinée au débogage. La sortie de `util.inspect` peut changer à tout moment et ne doit pas être utilisée de manière programmatique. Des `options` supplémentaires peuvent être passées pour modifier le résultat. `util.inspect()` utilisera le nom du constructeur et/ou `@@toStringTag` pour créer une balise identifiable pour une valeur inspectée.

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
Les références circulaires pointent vers leur ancre en utilisant un index de référence :

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
L'exemple suivant inspecte toutes les propriétés de l'objet `util` :

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
L'exemple suivant met en évidence l'effet de l'option `compact` :

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // Une longue ligne
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Définir `compact` sur false ou un entier crée une sortie plus facile à lire.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Définir `breakLength` sur, par exemple, 150 imprimera le texte "Lorem ipsum" sur une seule ligne.
```
L'option `showHidden` permet d'inspecter les entrées [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) et [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet). S'il y a plus d'entrées que `maxArrayLength`, il n'y a aucune garantie quant aux entrées affichées. Cela signifie que la récupération des mêmes entrées [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) à deux reprises peut entraîner une sortie différente. De plus, les entrées sans références fortes restantes peuvent être collectées par le garbage collector à tout moment.

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
L'option `sorted` garantit que l'ordre d'insertion de la propriété d'un objet n'a pas d'impact sur le résultat de `util.inspect()`.

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` vient avant `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` vient avant `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` vient avant `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` vient avant `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
L'option `numericSeparator` ajoute un trait de soulignement tous les trois chiffres à tous les nombres.

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` est une méthode synchrone destinée au débogage. Sa longueur de sortie maximale est d'environ 128 Mio. Les entrées qui entraînent une sortie plus longue seront tronquées.


### Personnalisation des couleurs de `util.inspect` {#customizing-utilinspect-colors}

La sortie colorée (si activée) de `util.inspect` est personnalisable globalement via les propriétés `util.inspect.styles` et `util.inspect.colors`.

`util.inspect.styles` est une map associant un nom de style à une couleur de `util.inspect.colors`.

Les styles par défaut et les couleurs associées sont :

- `bigint` : `yellow`
- `boolean` : `yellow`
- `date` : `magenta`
- `module` : `underline`
- `name` : (pas de style)
- `null` : `bold`
- `number` : `yellow`
- `regexp` : `red`
- `special` : `cyan` (par exemple, `Proxies`)
- `string` : `green`
- `symbol` : `green`
- `undefined` : `grey`

Le style de couleur utilise des codes de contrôle ANSI qui peuvent ne pas être pris en charge sur tous les terminaux. Pour vérifier la prise en charge des couleurs, utilisez [`tty.hasColors()`](/fr/nodejs/api/tty#writestreamhascolorscount-env).

Les codes de contrôle prédéfinis sont répertoriés ci-dessous (regroupés en « Modificateurs », « Couleurs de premier plan » et « Couleurs d'arrière-plan »).

#### Modificateurs {#modifiers}

La prise en charge des modificateurs varie d'un terminal à l'autre. Ils seront généralement ignorés s'ils ne sont pas pris en charge.

- `reset` - Réinitialise tous les modificateurs (de couleur) à leurs valeurs par défaut
- **bold** - Met le texte en gras
- *italic* - Met le texte en italique
- underline - Souligne le texte
- ~~strikethrough~~ - Trace une ligne horizontale au centre du texte (Alias : `strikeThrough`, `crossedout`, `crossedOut`)
- `hidden` - Imprime le texte, mais le rend invisible (Alias : conceal)
- dim - Diminue l'intensité de la couleur (Alias : `faint`)
- overlined - Surline le texte
- blink - Cache et affiche le texte à intervalles réguliers
- inverse - Inverse les couleurs de premier plan et d'arrière-plan (Alias : `swapcolors`, `swapColors`)
- doubleunderline - Souligne le texte deux fois (Alias : `doubleUnderline`)
- framed - Trace un cadre autour du texte

#### Couleurs de premier plan {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (alias : `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### Couleurs d'arrière-plan {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (alias : `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### Fonctions d'inspection personnalisées sur les objets {#custom-inspection-functions-on-objects}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.3.0, v16.14.0 | L'argument inspect est ajouté pour plus d'interopérabilité. |
| v0.1.97 | Ajouté dans : v0.1.97 |
:::

Les objets peuvent également définir leur propre fonction [`[util.inspect.custom](depth, opts, inspect)`](/fr/nodejs/api/util#utilinspectcustom), que `util.inspect()` invoquera et utilisera le résultat lors de l'inspection de l'objet.

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Espacement de cinq espaces car c'est la taille de "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// Renvoie : "Box< true >"
```
Les fonctions personnalisées `[util.inspect.custom](depth, opts, inspect)` renvoient généralement une chaîne, mais peuvent renvoyer une valeur de n'importe quel type qui sera formatée en conséquence par `util.inspect()`.

```js [ESM]
const util = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// Renvoie : "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.12.0 | Ceci est maintenant défini comme un symbole partagé. |
| v6.6.0 | Ajouté dans : v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) qui peut être utilisé pour déclarer des fonctions d'inspection personnalisées.

En plus d'être accessible via `util.inspect.custom`, ce symbole est [enregistré globalement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) et peut être accédé dans n'importe quel environnement en tant que `Symbol.for('nodejs.util.inspect.custom')`.

L'utilisation de ceci permet d'écrire du code de manière portable, de sorte que la fonction d'inspection personnalisée soit utilisée dans un environnement Node.js et ignorée dans le navigateur. La fonction `util.inspect()` elle-même est passée comme troisième argument à la fonction d'inspection personnalisée pour permettre une plus grande portabilité.

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Affiche Password <xxxxxxxx>
```
Voir [Fonctions d'inspection personnalisées sur les objets](/fr/nodejs/api/util#custom-inspection-functions-on-objects) pour plus de détails.


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**Ajouté dans : v6.4.0**

La valeur `defaultOptions` permet de personnaliser les options par défaut utilisées par `util.inspect`. Ceci est utile pour les fonctions telles que `console.log` ou `util.format` qui appellent implicitement `util.inspect`. Elle doit être définie sur un objet contenant une ou plusieurs options [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options) valides. La définition directe des propriétés des options est également prise en charge.

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // Affiche le tableau tronqué
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // affiche le tableau complet
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**Ajouté dans : v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` s'il existe une égalité stricte en profondeur entre `val1` et `val2`. Sinon, renvoie `false`.

Voir [`assert.deepStrictEqual()`](/fr/nodejs/api/assert#assertdeepstrictequalactual-expected-message) pour plus d'informations sur l'égalité stricte en profondeur.

## Class: `util.MIMEType` {#class-utilmimetype}

**Ajouté dans : v19.1.0, v18.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Une implémentation de [la classe MIMEType](https://bmeck.github.io/node-proposal-mime-api/).

Conformément aux conventions des navigateurs, toutes les propriétés des objets `MIMEType` sont implémentées en tant que getters et setters sur le prototype de la classe, plutôt que comme des propriétés de données sur l'objet lui-même.

Une chaîne MIME est une chaîne structurée contenant plusieurs composants significatifs. Une fois analysé, un objet `MIMEType` est renvoyé contenant des propriétés pour chacun de ces composants.

### Constructor : `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le MIME d'entrée à analyser

Crée un nouvel objet `MIMEType` en analysant l'`input`.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

Une `TypeError` sera levée si l'`input` n'est pas un MIME valide. Notez qu'un effort sera fait pour contraindre les valeurs données en chaînes de caractères. Par exemple :



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Affiche : text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Affiche : text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la partie type du MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la partie sous-type du MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient l'essence du MIME. Cette propriété est en lecture seule. Utilisez `mime.type` ou `mime.subtype` pour modifier le MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/fr/nodejs/api/util#class-utilmimeparams)

Obtient l'objet [`MIMEParams`](/fr/nodejs/api/util#class-utilmimeparams) représentant les paramètres du MIME. Cette propriété est en lecture seule. Voir la documentation [`MIMEParams`](/fr/nodejs/api/util#class-utilmimeparams) pour plus de détails.

### `mime.toString()` {#mimetostring}

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `toString()` sur l'objet `MIMEType` retourne le MIME sérialisé.

En raison de la nécessité de se conformer aux normes, cette méthode ne permet pas aux utilisateurs de personnaliser le processus de sérialisation du MIME.

### `mime.toJSON()` {#mimetojson}

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias pour [`mime.toString()`](/fr/nodejs/api/util#mimetostring).

Cette méthode est automatiquement appelée lorsqu'un objet `MIMEType` est sérialisé avec [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## Classe : `util.MIMEParams` {#class-utilmimeparams}

**Ajouté dans : v19.1.0, v18.13.0**

L'API `MIMEParams` fournit un accès en lecture et en écriture aux paramètres d'un `MIMEType`.

### Constructeur : `new MIMEParams()` {#constructor-new-mimeparams}

Crée un nouvel objet `MIMEParams` avec des paramètres vides

::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Supprime toutes les paires nom-valeur dont le nom est `name`.


### `mimeParams.entries()` {#mimeparamsentries}

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retourne un itérateur sur chaque paire nom-valeur dans les paramètres. Chaque élément de l'itérateur est un `Array` JavaScript. Le premier élément du tableau est le `name`, le deuxième élément du tableau est la `value`.

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Une chaîne de caractères ou `null` s'il n'y a pas de paire nom-valeur avec le `name` donné.

Retourne la valeur de la première paire nom-valeur dont le nom est `name`. S'il n'y a pas de telles paires, `null` est retourné.

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` s'il existe au moins une paire nom-valeur dont le nom est `name`.

### `mimeParams.keys()` {#mimeparamskeys}

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retourne un itérateur sur les noms de chaque paire nom-valeur.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Définit la valeur dans l'objet `MIMEParams` associé à `name` sur `value`. S'il existe des paires nom-valeur préexistantes dont les noms sont `name`, définissez la valeur de la première paire sur `value`.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- Returns: [\<Iterator\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Iteration_protocols#le_protocole_it%C3%A9rateur)

Renvoie un itérateur sur les valeurs de chaque paire nom-valeur.

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- Returns: [\<Iterator\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Iteration_protocols#le_protocole_it%C3%A9rateur)

Alias pour [`mimeParams.entries()`](/fr/nodejs/api/util#mimeparamsentries).



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | Ajout de la prise en charge de l'autorisation d'options négatives dans la `config` d'entrée. |
| v20.0.0 | L'API n'est plus expérimentale. |
| v18.11.0, v16.19.0 | Ajout de la prise en charge des valeurs par défaut dans la `config` d'entrée. |
| v18.7.0, v16.17.0 | ajout de la prise en charge du retour d'informations d'analyse détaillées à l'aide de `tokens` dans la `config` d'entrée et les propriétés retournées. |
| v18.3.0, v16.17.0 | Ajouté dans : v18.3.0, v16.17.0 |
:::

-  `config` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Utilisé pour fournir des arguments pour l'analyse et pour configurer l'analyseur. `config` prend en charge les propriétés suivantes :
    - `args` [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_string) tableau de chaînes d'argument. **Default:** `process.argv` avec `execPath` et `filename` supprimés.
    - `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Utilisé pour décrire les arguments connus de l'analyseur. Les clés de `options` sont les noms longs des options et les valeurs sont un [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) acceptant les propriétés suivantes :
    - `type` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_string) Type d'argument, qui doit être `boolean` ou `string`.
    - `multiple` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_boolean) Indique si cette option peut être fournie plusieurs fois. Si `true`, toutes les valeurs seront collectées dans un tableau. Si `false`, les valeurs de l'option sont prioritaires en cas de conflit. **Default:** `false`.
    - `short` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_string) Un alias d'un seul caractère pour l'option.
    - `default` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_string) | [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_boolean) | [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_string) | [\<boolean[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_boolean) La valeur d'option par défaut lorsqu'elle n'est pas définie par args. Elle doit être du même type que la propriété `type`. Lorsque `multiple` est `true`, elle doit être un tableau.


    - `strict` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_boolean) Une erreur doit-elle être levée lorsque des arguments inconnus sont rencontrés, ou lorsque des arguments sont passés qui ne correspondent pas au `type` configuré dans `options`. **Default:** `true`.
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_boolean) Indique si cette commande accepte les arguments positionnels. **Default:** `false` si `strict` est `true`, sinon `true`.
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_boolean) Si `true`, permet de définir explicitement les options booléennes sur `false` en préfixant le nom de l'option avec `--no-`. **Default:** `false`.
    - `tokens` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_boolean) Retourne les jetons analysés. Ceci est utile pour étendre le comportement intégré, de l'ajout de vérifications supplémentaires au retraitement des jetons de différentes manières. **Default:** `false`.


-  Returns: [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Les arguments de ligne de commande analysés :
    - `values` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Un mappage des noms d'options analysés avec leurs valeurs [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_string) ou [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_boolean).
    - `positionals` [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_string) Arguments positionnels.
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#type_undefined) Voir la section [jetons parseArgs](/fr/nodejs/api/util#parseargs-tokens). Retourné uniquement si `config` inclut `tokens : true`.


Fournit une API de plus haut niveau pour l'analyse des arguments de ligne de commande que l'interaction directe avec `process.argv`. Prend une spécification pour les arguments attendus et retourne un objet structuré avec les options et les positionnels analysés.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::

### `parseArgs` `tokens` {#parseargs-tokens}

Des informations d'analyse détaillées sont disponibles pour ajouter des comportements personnalisés en spécifiant `tokens: true` dans la configuration. Les jetons retournés ont des propriétés décrivant :

- tous les jetons
    - `kind` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) L'un des éléments suivants : 'option', 'positional' ou 'option-terminator'.
    - `index` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) Index de l'élément dans `args` contenant le jeton. Donc l'argument source d'un jeton est `args[token.index]`.


- jetons d'option
    - `name` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Nom long de l'option.
    - `rawName` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Comment l'option est utilisée dans args, comme `-f` ou `--foo`.
    - `value` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<undefined\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/undefined) Valeur de l'option spécifiée dans args. Non défini pour les options booléennes.
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | [\<undefined\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/undefined) Si la valeur de l'option est spécifiée en ligne, comme `--foo=bar`.


- jetons positionnels
    - `value` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) La valeur de l'argument positionnel dans args (c'est-à-dire `args[index]`).


- jeton option-terminator

Les jetons retournés sont dans l'ordre rencontré dans les args d'entrée. Les options qui apparaissent plus d'une fois dans args produisent un jeton pour chaque utilisation. Les groupes d'options courtes comme `-xy` se développent en un jeton pour chaque option. Donc `-xxx` produit trois jetons.

Par exemple, pour ajouter la prise en charge d'une option négative comme `--no-color` (que `allowNegative` prend en charge lorsque l'option est de type `boolean`), les jetons retournés peuvent être retraités pour modifier la valeur stockée pour l'option négative.

::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Retraiter les jetons d'option et remplacer les valeurs retournées.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Stocker foo:false pour --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Réenregistrer la valeur pour que la dernière gagne si à la fois --foo et --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Retraiter les jetons d'option et remplacer les valeurs retournées.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Stocker foo:false pour --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Réenregistrer la valeur pour que la dernière gagne si à la fois --foo et --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

Exemple d'utilisation montrant les options négatives, et quand une option est utilisée de plusieurs façons, alors la dernière l'emporte.

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

**Ajouté dans: v21.7.0, v20.12.0**

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le contenu brut d'un fichier `.env`.

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Étant donné un exemple de fichier `.env` :

::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Retourne : { HELLO : 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Retourne : { HELLO : 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.8.0 | L'appel de `promisify` sur une fonction qui retourne une `Promise` est obsolète. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Prend une fonction suivant le style de rappel courant avec gestion d'erreur en premier, c'est-à-dire en prenant un rappel `(err, value) => ...` comme dernier argument, et retourne une version qui retourne des promesses.

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Faire quelque chose avec `stats`
}).catch((error) => {
  // Gérer l'erreur.
});
```
Ou, de manière équivalente en utilisant des `async function` :

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`Ce répertoire appartient à ${stats.uid}`);
}

callStat();
```
S'il existe une propriété `original[util.promisify.custom]`, `promisify` renverra sa valeur, voir [Fonctions promifiées personnalisées](/fr/nodejs/api/util#custom-promisified-functions).

`promisify()` suppose que `original` est une fonction prenant un rappel comme argument final dans tous les cas. Si `original` n'est pas une fonction, `promisify()` renverra une erreur. Si `original` est une fonction mais que son dernier argument n'est pas un rappel avec gestion d'erreur en premier, un rappel avec gestion d'erreur en premier lui sera toujours transmis comme dernier argument.

L'utilisation de `promisify()` sur des méthodes de classe ou d'autres méthodes qui utilisent `this` peut ne pas fonctionner comme prévu, sauf si elle est traitée spécialement :

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: Cannot read property 'a' of undefined
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### Fonctions "promisifiées" personnalisées {#custom-promisified-functions}

En utilisant le symbole `util.promisify.custom`, il est possible de remplacer la valeur de retour de [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal) :

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// affiche 'true'
```
Cela peut être utile dans les cas où la fonction originale ne suit pas le format standard qui consiste à prendre un callback avec une erreur comme premier argument en tant que dernier argument.

Par exemple, avec une fonction qui prend `(foo, onSuccessCallback, onErrorCallback)` :

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
Si `promisify.custom` est défini, mais n'est pas une fonction, `promisify()` lève une erreur.

### `util.promisify.custom` {#utilpromisifycustom}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.16.2 | Ceci est maintenant défini comme un symbole partagé. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) qui peut être utilisé pour déclarer des variantes promisifiées personnalisées des fonctions, voir [Fonctions "promisifiées" personnalisées](/fr/nodejs/api/util#custom-promisified-functions).

En plus d'être accessible via `util.promisify.custom`, ce symbole est [enregistré globalement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) et peut être accédé dans n'importe quel environnement en tant que `Symbol.for('nodejs.util.promisify.custom')`.

Par exemple, avec une fonction qui prend `(foo, onSuccessCallback, onErrorCallback)` :

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**Ajouté dans : v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne `str` avec tous les codes d’échappement ANSI supprimés.

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// Affiche "value"
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [Stable: 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | styleText est désormais stable. |
| v22.8.0, v20.18.0 | Respecte isTTY et les variables d’environnement telles que NO_COLORS, NODE_DISABLE_COLORS et FORCE_COLOR. |
| v21.7.0, v20.12.0 | Ajouté dans : v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un format de texte ou un tableau de formats de texte défini dans `util.inspect.colors`.
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le texte à formater.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est true, `stream` est vérifié pour voir s’il peut gérer les couleurs. **Par défaut :** `true`.
    - `stream` [\<Stream\>](/fr/nodejs/api/stream#stream) Un flux qui sera validé pour voir s’il peut être coloré. **Par défaut :** `process.stdout`.
  
 

Cette fonction renvoie un texte formaté en tenant compte du `format` transmis pour l’impression dans un terminal. Elle est consciente des capacités du terminal et agit en fonction de la configuration définie via les variables d’environnement `NO_COLORS`, `NODE_DISABLE_COLORS` et `FORCE_COLOR`.



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Valider si process.stderr a TTY
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process');

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Valider si process.stderr a TTY
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors` fournit également des formats de texte tels que `italic` et `underline`, et vous pouvez combiner les deux :

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
Lorsque vous passez un tableau de formats, l’ordre d’application du format est de gauche à droite, de sorte que le style suivant peut écraser le précédent.

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
La liste complète des formats se trouve dans [modifiers](/fr/nodejs/api/util#modifiers).


## Class: `util.TextDecoder` {#class-utiltextdecoder}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | La classe est maintenant disponible sur l'objet global. |
| v8.3.0 | Ajoutée dans : v8.3.0 |
:::

Une implémentation de l'API `TextDecoder` de [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/).

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### Encodages pris en charge par WHATWG {#whatwg-supported-encodings}

Conformément à [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/), les encodages pris en charge par l'API `TextDecoder` sont décrits dans les tableaux ci-dessous. Pour chaque encodage, un ou plusieurs alias peuvent être utilisés.

Différentes configurations de build de Node.js prennent en charge différents ensembles d'encodages. (voir [Internationalisation](/fr/nodejs/api/intl))

#### Encodages pris en charge par défaut (avec données ICU complètes) {#encodings-supported-by-default-with-full-icu-data}

| Encodage | Alias |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |


#### Encodages pris en charge lorsque Node.js est compilé avec l'option `small-icu` {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| Encodage | Alias |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### Encodages pris en charge lorsque ICU est désactivé {#encodings-supported-when-icu-is-disabled}

| Encodage | Alias |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`  ,   `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
L'encodage `'iso-8859-16'` listé dans le [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) n'est pas pris en charge.

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String) Identifie l'`encoding` que cette instance `TextDecoder` prend en charge. **Default:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) `true` si les échecs de décodage sont fatals. Cette option n'est pas prise en charge lorsque ICU est désactivé (voir [Internationalization](/fr/nodejs/api/intl)). **Default:** `false`.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) Lorsque `true`, le `TextDecoder` inclura la marque d'ordre des octets dans le résultat décodé. Lorsque `false`, la marque d'ordre des octets sera supprimée de la sortie. Cette option n'est utilisée que lorsque `encoding` est `'utf-8'`, `'utf-16be'`, ou `'utf-16le'`. **Default:** `false`.
  
 

Crée une nouvelle instance `TextDecoder`. L'`encoding` peut spécifier l'un des encodages pris en charge ou un alias.

La classe `TextDecoder` est également disponible sur l'objet global.

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Une instance `ArrayBuffer`, `DataView` ou `TypedArray` contenant les données encodées.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stream` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) `true` si des blocs de données supplémentaires sont attendus. **Default:** `false`.
  
 
- Returns: [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String)

Décode l'`input` et retourne une chaîne de caractères. Si `options.stream` est `true`, toute séquence d'octets incomplète survenant à la fin de l'`input` est mise en mémoire tampon en interne et émise après le prochain appel à `textDecoder.decode()`.

Si `textDecoder.fatal` est `true`, les erreurs de décodage qui se produisent entraîneront la levée d'une erreur `TypeError`.


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'encodage pris en charge par l'instance `TextDecoder`.

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La valeur sera `true` si les erreurs de décodage entraînent le lancement d'un `TypeError`.

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La valeur sera `true` si le résultat du décodage inclut la marque d'ordre des octets.

## Classe : `util.TextEncoder` {#class-utiltextencoder}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | La classe est désormais disponible sur l’objet global. |
| v8.3.0 | Ajoutée dans : v8.3.0 |
:::

Une implémentation de l'API `TextEncoder` de la [Norme d'encodage WHATWG](https://encoding.spec.whatwg.org/). Toutes les instances de `TextEncoder` prennent uniquement en charge l'encodage UTF-8.

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```

La classe `TextEncoder` est également disponible sur l'objet global.

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le texte à encoder. **Par défaut :** une chaîne vide.
- Retourne : [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Encode UTF-8 la chaîne `input` et retourne un `Uint8Array` contenant les octets encodés.

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**Ajoutée dans : v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le texte à encoder.
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Le tableau pour contenir le résultat de l’encodage.
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Les unités de code Unicode lues de src.
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Les octets UTF-8 écrits de dest.

Encode UTF-8 la chaîne `src` dans le Uint8Array `dest` et retourne un objet contenant les unités de code Unicode lues et les octets UTF-8 écrits.

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'encodage pris en charge par l'instance `TextEncoder`. Toujours défini sur `'utf-8'`.

## `util.toUSVString(string)` {#utiltousvstringstring}

**Ajouté dans : v16.8.0, v14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne la `string` après avoir remplacé tout point de code de substitution (ou, de manière équivalente, toute unité de code de substitution non appariée) par le « caractère de remplacement » Unicode U+FFFD.

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**Ajouté dans : v18.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Crée et renvoie une instance de [\<AbortController\>](/fr/nodejs/api/globals#class-abortcontroller) dont [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) est marquée comme transférable et peut être utilisée avec `structuredClone()` ou `postMessage()`.

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**Ajouté dans : v18.11.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)
- Retourne : [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)

Marque le [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) donné comme transférable afin qu'il puisse être utilisé avec `structuredClone()` et `postMessage()`.

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**Ajouté dans: v19.7.0, v18.16.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Tout objet non nul lié à l'opération annulable et conservé faiblement. Si `resource` est collecté par le garbage collector avant que le `signal` ne soit annulé, la promesse reste en suspens, ce qui permet à Node.js d'arrêter de la suivre. Cela aide à prévenir les fuites de mémoire dans les opérations de longue durée ou non annulables.
- Retourne: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Écoute l'événement d'abandon sur le `signal` fourni et renvoie une promesse qui se résout lorsque le `signal` est abandonné. Si `resource` est fourni, il référence faiblement l'objet associé à l'opération, donc si `resource` est collecté par le garbage collector avant que le `signal` ne soit abandonné, alors la promesse renvoyée reste en suspens. Cela empêche les fuites de mémoire dans les opérations de longue durée ou non annulables.

::: code-group
```js [CJS]
const { aborted } = require('node:util');

// Obtenir un objet avec un signal annulable, comme une ressource ou une opération personnalisée.
const dependent = obtainSomethingAbortable();

// Passer `dependent` comme ressource, indiquant que la promesse ne doit se résoudre que
// si `dependent` est toujours en mémoire lorsque le signal est abandonné.
aborted(dependent.signal, dependent).then(() => {

  // Ce code s'exécute lorsque `dependent` est abandonné.
  console.log('La ressource dépendante a été abandonnée.');
});

// Simuler un événement qui déclenche l'abandon.
dependent.on('event', () => {
  dependent.abort(); // Cela provoquera la résolution de la promesse `aborted`.
});
```

```js [ESM]
import { aborted } from 'node:util';

// Obtenir un objet avec un signal annulable, comme une ressource ou une opération personnalisée.
const dependent = obtainSomethingAbortable();

// Passer `dependent` comme ressource, indiquant que la promesse ne doit se résoudre que
// si `dependent` est toujours en mémoire lorsque le signal est abandonné.
aborted(dependent.signal, dependent).then(() => {

  // Ce code s'exécute lorsque `dependent` est abandonné.
  console.log('La ressource dépendante a été abandonnée.');
});

// Simuler un événement qui déclenche l'abandon.
dependent.on('event', () => {
  dependent.abort(); // Cela provoquera la résolution de la promesse `aborted`.
});
```
:::


## `util.types` {#utiltypes}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.3.0 | Exposé en tant que `require('util/types')`. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

`util.types` fournit des vérifications de type pour différents types d'objets intégrés. Contrairement à `instanceof` ou `Object.prototype.toString.call(value)`, ces vérifications n'inspectent pas les propriétés de l'objet qui sont accessibles depuis JavaScript (comme leur prototype), et ont généralement la surcharge d'appeler C++.

Le résultat ne donne généralement aucune garantie sur les types de propriétés ou de comportements qu'une valeur expose en JavaScript. Ils sont principalement utiles pour les développeurs d'addons qui préfèrent effectuer des vérifications de type en JavaScript.

L'API est accessible via `require('node:util').types` ou `require('node:util/types')`.

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si la valeur est une instance intégrée de [`ArrayBuffer`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou [`SharedArrayBuffer`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).

Voir aussi [`util.types.isArrayBuffer()`](/fr/nodejs/api/util#utiltypesisarraybuffervalue) et [`util.types.isSharedArrayBuffer()`](/fr/nodejs/api/util#utiltypesissharedarraybuffervalue).

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Retourne true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // Retourne true
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si la valeur est une instance de l'une des vues [`ArrayBuffer`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), telles que les objets de tableau typé ou [`DataView`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView). Équivalent à [`ArrayBuffer.isView()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet `arguments`.

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // Renvoie true
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) intégrée. Cela n'inclut *pas* les instances [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Habituellement, il est souhaitable de tester les deux ; voir [`util.types.isAnyArrayBuffer()`](/fr/nodejs/api/util#utiltypesisanyarraybuffervalue) pour cela.

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // Renvoie true
util.types.isArrayBuffer(new SharedArrayBuffer());  // Renvoie false
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une [fonction asynchrone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). Cela ne renvoie que ce que le moteur JavaScript voit ; en particulier, la valeur de retour peut ne pas correspondre au code source original si un outil de transcompilation a été utilisé.

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // Renvoie false
util.types.isAsyncFunction(async function foo() {});  // Renvoie true
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance de `BigInt64Array`.

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // Renvoie true
util.types.isBigInt64Array(new BigUint64Array());  // Renvoie false
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**Ajouté dans : v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet BigInt, par exemple, créé par `Object(BigInt(123))`.

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // Renvoie true
util.types.isBigIntObject(BigInt(123));   // Renvoie false
util.types.isBigIntObject(123);  // Renvoie false
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance de `BigUint64Array`.

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // Renvoie false
util.types.isBigUint64Array(new BigUint64Array());  // Renvoie true
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet booléen, par exemple, créé par `new Boolean()`.

```js [ESM]
util.types.isBooleanObject(false);  // Renvoie false
util.types.isBooleanObject(true);   // Renvoie false
util.types.isBooleanObject(new Boolean(false)); // Renvoie true
util.types.isBooleanObject(new Boolean(true));  // Renvoie true
util.types.isBooleanObject(Boolean(false)); // Renvoie false
util.types.isBooleanObject(Boolean(true));  // Renvoie false
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**Ajouté dans : v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet primitif empaqueté, par exemple créé par `new Boolean()`, `new String()` ou `Object(Symbol())`.

Par exemple :

```js [ESM]
util.types.isBoxedPrimitive(false); // Retourne false
util.types.isBoxedPrimitive(new Boolean(false)); // Retourne true
util.types.isBoxedPrimitive(Symbol('foo')); // Retourne false
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // Retourne true
util.types.isBoxedPrimitive(Object(BigInt(5))); // Retourne true
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**Ajouté dans : v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si `value` est une [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey), `false` sinon.

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) intégrée.

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // Retourne true
util.types.isDataView(new Float64Array());  // Retourne false
```
Voir aussi [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) intégrée.

```js [ESM]
util.types.isDate(new Date());  // Retourne true
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si la valeur est une valeur `External` native.

Une valeur `External` native est un type spécial d'objet qui contient un pointeur C++ brut (`void*`) pour l'accès depuis le code natif, et n'a pas d'autres propriétés. Ces objets sont créés soit par des éléments internes de Node.js, soit par des addons natifs. En JavaScript, ce sont des objets [gelés](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) avec un prototype `null`.

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // retourne true
util.types.isExternal(0); // retourne false
util.types.isExternal(new String('foo')); // retourne false
```
Pour plus d'informations sur `napi_create_external`, reportez-vous à [`napi_create_external()`](/fr/nodejs/api/n-api#napi_create_external).

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si la valeur est une instance intégrée de [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array).

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // Retourne false
util.types.isFloat32Array(new Float32Array());  // Retourne true
util.types.isFloat32Array(new Float64Array());  // Retourne false
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array).

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // Renvoie false
util.types.isFloat64Array(new Uint8Array());  // Renvoie false
util.types.isFloat64Array(new Float64Array());  // Renvoie true
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une fonction générateur. Ceci ne renvoie que ce que le moteur JavaScript voit ; en particulier, la valeur de retour peut ne pas correspondre au code source original si un outil de transpilage a été utilisé.

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // Renvoie false
util.types.isGeneratorFunction(function* foo() {});  // Renvoie true
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet générateur tel que renvoyé par une fonction générateur intégrée. Ceci ne renvoie que ce que le moteur JavaScript voit ; en particulier, la valeur de retour peut ne pas correspondre au code source original si un outil de transpilage a été utilisé.

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // Renvoie true
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array).

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // Renvoie false
util.types.isInt8Array(new Int8Array());  // Renvoie true
util.types.isInt8Array(new Float64Array());  // Renvoie false
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**Ajouté dans: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array).

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // Renvoie false
util.types.isInt16Array(new Int16Array());  // Renvoie true
util.types.isInt16Array(new Float64Array());  // Renvoie false
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**Ajouté dans: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array).

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // Renvoie false
util.types.isInt32Array(new Int32Array());  // Renvoie true
util.types.isInt32Array(new Float64Array());  // Renvoie false
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**Ajouté dans: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si `value` est un [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject), `false` sinon.

### `util.types.isMap(value)` {#utiltypesismapvalue}

**Ajouté dans: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

```js [ESM]
util.types.isMap(new Map());  // Renvoie true
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un itérateur renvoyé pour une instance [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) intégrée.

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // Renvoie true
util.types.isMapIterator(map.values());  // Renvoie true
util.types.isMapIterator(map.entries());  // Renvoie true
util.types.isMapIterator(map[Symbol.iterator]());  // Renvoie true
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance d'un [Objet d'Espace de Noms de Module](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects).

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Renvoie true
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur a été renvoyée par le constructeur d'un [type `Error` intégré](https://tc39.es/ecma262/#sec-error-objects).

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
Les sous-classes des types d'erreur natifs sont également des erreurs natives :

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
Une valeur étant `instanceof` une classe d'erreur native n'est pas équivalent à `isNativeError()` renvoyant `true` pour cette valeur. `isNativeError()` renvoie `true` pour les erreurs qui proviennent d'un [domaine](https://tc39.es/ecma262/#realm) différent tandis que `instanceof Error` renvoie `false` pour ces erreurs :

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
Inversement, `isNativeError()` renvoie `false` pour tous les objets qui n'ont pas été renvoyés par le constructeur d'une erreur native. Cela inclut les valeurs qui sont `instanceof` des erreurs natives :

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**Ajouté dans: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet nombre, par ex. créé par `new Number()`.

```js [ESM]
util.types.isNumberObject(0);  // Retourne false
util.types.isNumberObject(new Number(0));   // Retourne true
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**Ajouté dans: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) intégré.

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // Retourne true
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**Ajouté dans: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Retourne false
util.types.isProxy(proxy);  // Retourne true
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**Ajouté dans: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet expression régulière.

```js [ESM]
util.types.isRegExp(/abc/);  // Retourne true
util.types.isRegExp(new RegExp('abc'));  // Retourne true
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) intégrée.

```js [ESM]
util.types.isSet(new Set());  // Renvoie true
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un itérateur renvoyé pour une instance [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) intégrée.

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // Renvoie true
util.types.isSetIterator(set.values());  // Renvoie true
util.types.isSetIterator(set.entries());  // Renvoie true
util.types.isSetIterator(set[Symbol.iterator]());  // Renvoie true
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) intégrée. Cela n'inclut *pas* les instances [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Il est généralement souhaitable de tester les deux ; voir [`util.types.isAnyArrayBuffer()`](/fr/nodejs/api/util#utiltypesisanyarraybuffervalue) pour cela.

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Renvoie false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Renvoie true
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet de type chaîne de caractères, par exemple créé par `new String()`.

```js [ESM]
util.types.isStringObject('foo');  // Renvoie false
util.types.isStringObject(new String('foo'));   // Renvoie true
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est un objet de type symbole, créé en appelant `Object()` sur une primitive `Symbol`.

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // Renvoie false
util.types.isSymbolObject(Object(symbol));   // Renvoie true
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) intégrée.

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // Renvoie false
util.types.isTypedArray(new Uint8Array());  // Renvoie true
util.types.isTypedArray(new Float64Array());  // Renvoie true
```
Voir également [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) intégrée.

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // Renvoie false
util.types.isUint8Array(new Uint8Array());  // Renvoie true
util.types.isUint8Array(new Float64Array());  // Renvoie false
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray).

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // Renvoie false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Renvoie true
util.types.isUint8ClampedArray(new Float64Array());  // Renvoie false
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array).

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // Renvoie false
util.types.isUint16Array(new Uint16Array());  // Renvoie true
util.types.isUint16Array(new Float64Array());  // Renvoie false
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array).

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // Renvoie false
util.types.isUint32Array(new Uint32Array());  // Renvoie true
util.types.isUint32Array(new Float64Array());  // Renvoie false
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**Ajouté dans : v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance intégrée de [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap).

```js [ESM]
util.types.isWeakMap(new WeakMap());  // Renvoie true
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**Ajouté dans: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si la valeur est une instance [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) intégrée.

```js [ESM]
util.types.isWeakSet(new WeakSet());  // Renvoie true
```
## APIs Dépréciées {#deprecated-apis}

Les APIs suivantes sont dépréciées et ne doivent plus être utilisées. Les applications et modules existants doivent être mis à jour pour trouver des approches alternatives.

### `util._extend(target, source)` {#util_extendtarget-source}

**Ajouté dans: v0.7.5**

**Déprécié depuis : v6.0.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) à la place.
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La méthode `util._extend()` n'a jamais été destinée à être utilisée en dehors des modules internes de Node.js. La communauté l'a trouvée et utilisée malgré tout.

Elle est dépréciée et ne doit pas être utilisée dans du nouveau code. JavaScript propose des fonctionnalités intégrées très similaires grâce à [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### `util.isArray(object)` {#utilisarrayobject}

**Ajouté dans: v0.6.0**

**Déprécié depuis : v4.0.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) à la place.
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias pour [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

Renvoie `true` si l'`objet` donné est un `Array`. Sinon, renvoie `false`.

```js [ESM]
const util = require('node:util');

util.isArray([]);
// Renvoie : true
util.isArray(new Array());
// Renvoie : true
util.isArray({});
// Renvoie : false
```

