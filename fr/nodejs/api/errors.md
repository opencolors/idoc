---
title: Documentation Node.js - Erreurs
description: Cette section de la documentation Node.js fournit des détails complets sur la gestion des erreurs, y compris les classes d'erreurs, les codes d'erreur et comment gérer les erreurs dans les applications Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Erreurs | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette section de la documentation Node.js fournit des détails complets sur la gestion des erreurs, y compris les classes d'erreurs, les codes d'erreur et comment gérer les erreurs dans les applications Node.js.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Erreurs | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette section de la documentation Node.js fournit des détails complets sur la gestion des erreurs, y compris les classes d'erreurs, les codes d'erreur et comment gérer les erreurs dans les applications Node.js.
---


# Erreurs {#errors}

Les applications s'exécutant dans Node.js rencontreront généralement quatre catégories d'erreurs :

- Les erreurs JavaScript standard telles que [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) et [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
- Les erreurs système déclenchées par des contraintes du système d'exploitation sous-jacent, telles qu'une tentative d'ouverture d'un fichier qui n'existe pas ou une tentative d'envoi de données sur un socket fermé.
- Les erreurs spécifiées par l'utilisateur déclenchées par le code de l'application.
- Les `AssertionError`s sont une classe spéciale d'erreurs qui peuvent être déclenchées lorsque Node.js détecte une violation de logique exceptionnelle qui ne devrait jamais se produire. Elles sont généralement levées par le module `node:assert`.

Toutes les erreurs JavaScript et système levées par Node.js héritent de, ou sont des instances de, la classe JavaScript standard [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) et sont garanties de fournir *au moins* les propriétés disponibles sur cette classe.

## Propagation et interception des erreurs {#error-propagation-and-interception}

Node.js prend en charge plusieurs mécanismes pour propager et gérer les erreurs qui se produisent pendant l'exécution d'une application. La manière dont ces erreurs sont signalées et gérées dépend entièrement du type d'`Error` et du style de l'API appelée.

Toutes les erreurs JavaScript sont traitées comme des exceptions qui génèrent et lèvent *immédiatement* une erreur à l'aide du mécanisme `throw` standard de JavaScript. Elles sont gérées à l'aide de la construction [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) fournie par le langage JavaScript.

```js [ESM]
// Lève une ReferenceError car z n'est pas défini.
try {
  const m = 1 ;
  const n = m + z ;
} catch (err) {
  // Gérer l'erreur ici.
}
```
Toute utilisation du mécanisme `throw` de JavaScript lèvera une exception qui *doit* être gérée, sinon le processus Node.js se terminera immédiatement.

À quelques exceptions près, les API *synchrones* (toute méthode bloquante qui ne renvoie pas de [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) et n'accepte pas non plus une fonction `callback`, comme [`fs.readFileSync`](/fr/nodejs/api/fs#fsreadfilesyncpath-options)), utiliseront `throw` pour signaler les erreurs.

Les erreurs qui se produisent dans les *API asynchrones* peuvent être signalées de plusieurs manières :

- Certaines méthodes asynchrones renvoient une [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), vous devez toujours tenir compte du fait qu'elle peut être rejetée. Consultez l'indicateur [`--unhandled-rejections`](/fr/nodejs/api/cli#--unhandled-rejectionsmode) pour savoir comment le processus réagira à un rejet de promesse non géré.
- La plupart des méthodes asynchrones qui acceptent une fonction `callback` accepteront un objet `Error` transmis comme premier argument à cette fonction. Si ce premier argument n'est pas `null` et est une instance de `Error`, une erreur s'est produite et doit être gérée.
- Lorsqu'une méthode asynchrone est appelée sur un objet qui est un [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter), les erreurs peuvent être routées vers l'événement `'error'` de cet objet.
- Une poignée de méthodes généralement asynchrones dans l'API Node.js peuvent encore utiliser le mécanisme `throw` pour lever des exceptions qui doivent être gérées à l'aide de `try…catch`. Il n'existe pas de liste exhaustive de ces méthodes ; veuillez consulter la documentation de chaque méthode pour déterminer le mécanisme de gestion des erreurs approprié requis.

L'utilisation du mécanisme d'événement `'error'` est plus courante pour les API [basées sur les flux](/fr/nodejs/api/stream) et [basées sur les émetteurs d'événements](/fr/nodejs/api/events#class-eventemitter), qui représentent elles-mêmes une série d'opérations asynchrones dans le temps (par opposition à une seule opération qui peut réussir ou échouer).

Pour *tous* les objets [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter), si un gestionnaire d'événements `'error'` n'est pas fourni, l'erreur sera levée, ce qui entraînera le signalement d'une exception non interceptée par le processus Node.js et son plantage, sauf si : un gestionnaire a été enregistré pour l'événement [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception), ou le module [`node:domain`](/fr/nodejs/api/domain) obsolète est utilisé.

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // Cela fera planter le processus car aucun événement 'error'
  // Le gestionnaire a été ajouté.
  ee.emit('error', new Error('Cela va planter'));
});
```
Les erreurs générées de cette manière *ne peuvent pas* être interceptées à l'aide de `try…catch` car elles sont levées *après* que le code appelant a déjà quitté.

Les développeurs doivent se référer à la documentation de chaque méthode pour déterminer exactement comment les erreurs levées par ces méthodes sont propagées.


## Classe : `Error` {#class-error}

Un objet JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) générique qui n'indique aucune circonstance particulière expliquant la raison pour laquelle l'erreur s'est produite. Les objets `Error` capturent une "trace de pile" détaillant le point du code où l'`Error` a été instanciée, et peuvent fournir une description textuelle de l'erreur.

Toutes les erreurs générées par Node.js, y compris toutes les erreurs système et JavaScript, seront soit des instances de la classe `Error`, soit en hériteront.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) L'erreur qui a causé l'erreur nouvellement créée.

Crée un nouvel objet `Error` et définit la propriété `error.message` sur le message texte fourni. Si un objet est passé comme `message`, le message texte est généré en appelant `String(message)`. Si l'option `cause` est fournie, elle est affectée à la propriété `error.cause`. La propriété `error.stack` représentera le point du code où `new Error()` a été appelé. Les traces de pile dépendent de l'[API de trace de pile de V8](https://v8.dev/docs/stack-trace-api). Les traces de pile s'étendent uniquement jusqu'à (a) le début de l'*exécution synchrone du code*, ou (b) le nombre de frames donné par la propriété `Error.stackTraceLimit`, la plus petite des deux valeurs étant retenue.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Crée une propriété `.stack` sur `targetObject`, qui, lorsqu'elle est accédée, renvoie une chaîne représentant l'emplacement dans le code où `Error.captureStackTrace()` a été appelé.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Semblable à `new Error().stack`
```

La première ligne de la trace sera préfixée par `${myObject.name}: ${myObject.message}`.

L'argument optionnel `constructorOpt` accepte une fonction. Si elle est fournie, toutes les frames au-dessus de `constructorOpt`, y compris `constructorOpt`, seront omises de la trace de pile générée.

L'argument `constructorOpt` est utile pour masquer les détails d'implémentation de la génération d'erreurs à l'utilisateur. Par exemple :

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Crée une erreur sans trace de pile pour éviter de calculer la trace de pile deux fois.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture la trace de pile au-dessus de la fonction b
  Error.captureStackTrace(error, b); // Ni la fonction c, ni b n'est incluse dans la trace de pile
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)

La propriété `Error.stackTraceLimit` spécifie le nombre de frames de pile collectées par une trace de pile (qu'elle soit générée par `new Error().stack` ou `Error.captureStackTrace(obj)`).

La valeur par défaut est `10` mais peut être définie à n'importe quel nombre JavaScript valide. Les modifications affecteront toute trace de pile capturée *après* que la valeur a été modifiée.

Si la valeur définie n'est pas un nombre, ou si elle est définie à un nombre négatif, les traces de pile ne captureront aucun frame.

### `error.cause` {#errorcause}

**Ajouté dans: v16.9.0**

- [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)

Si elle est présente, la propriété `error.cause` est la cause sous-jacente de l'`Error`. Elle est utilisée lors de la capture d'une erreur et de la levée d'une nouvelle avec un message ou un code différent afin d'avoir toujours accès à l'erreur d'origine.

La propriété `error.cause` est généralement définie en appelant `new Error(message, { cause })`. Elle n'est pas définie par le constructeur si l'option `cause` n'est pas fournie.

Cette propriété permet d'enchaîner les erreurs. Lors de la sérialisation d'objets `Error`, [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options) sérialise récursivement `error.cause` s'il est défini.

```js [ESM]
const cause = new Error('Le serveur HTTP distant a répondu avec un statut 500');
const symptom = new Error('Le message n'a pas pu être envoyé', { cause });

console.log(symptom);
// Affiche :
//   Error: Le message n'a pas pu être envoyé
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lignes correspondant à la trace de pile de la cause ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: Le serveur HTTP distant a répondu avec un statut 500
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String)

La propriété `error.code` est une étiquette de chaîne qui identifie le type d'erreur. `error.code` est la manière la plus stable d'identifier une erreur. Elle ne changera qu'entre les versions majeures de Node.js. En revanche, les chaînes `error.message` peuvent changer entre toutes les versions de Node.js. Voir [Codes d'erreur Node.js](/fr/nodejs/api/errors#nodejs-error-codes) pour plus de détails sur les codes spécifiques.

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String)

La propriété `error.message` est la description de chaîne de l'erreur telle que définie en appelant `new Error(message)`. Le `message` passé au constructeur apparaîtra également dans la première ligne de la trace de pile de l'`Error`, cependant changer cette propriété après que l'objet `Error` a été créé *peut ne pas* changer la première ligne de la trace de pile (par exemple, lorsque `error.stack` est lu avant que cette propriété ne soit modifiée).

```js [ESM]
const err = new Error('Le message');
console.error(err.message);
// Affiche : Le message
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String)

La propriété `error.stack` est une chaîne décrivant le point du code où l'`Error` a été instanciée.

```bash [BASH]
Error: Les choses continuent d'arriver !
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
La première ligne est formatée comme `\<nom de la classe d'erreur\>: \<message d'erreur\>`, et est suivie d'une série de cadres de pile (chaque ligne commençant par "at "). Chaque cadre décrit un site d'appel dans le code qui a conduit à la génération de l'erreur. V8 tente d'afficher un nom pour chaque fonction (par nom de variable, nom de fonction ou nom de méthode d'objet), mais il ne sera parfois pas en mesure de trouver un nom approprié. Si V8 ne peut pas déterminer un nom pour la fonction, seules les informations de localisation seront affichées pour ce cadre. Sinon, le nom de la fonction déterminé sera affiché avec les informations de localisation ajoutées entre parenthèses.

Les cadres ne sont générés que pour les fonctions JavaScript. Si, par exemple, l'exécution passe de manière synchrone par une fonction d'addon C++ appelée `cheetahify` qui appelle elle-même une fonction JavaScript, le cadre représentant l'appel `cheetahify` ne sera pas présent dans les traces de pile :

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` appelle *synchrone* speedy.
  cheetahify(function speedy() {
    throw new Error('oh non !');
  });
}

makeFaster();
// lancera :
//   /home/gbusey/file.js:6
//       throw new Error('oh non !');
//           ^
//   Error: oh non !
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
Les informations de localisation seront l'une des suivantes :

- `native`, si le cadre représente un appel interne à V8 (comme dans `[].forEach`).
- `plain-filename.js:line:column`, si le cadre représente un appel interne à Node.js.
- `/absolute/path/to/file.js:line:column`, si le cadre représente un appel dans un programme utilisateur (utilisant le système de module CommonJS), ou ses dépendances.
- `\<transport-protocol\>:///url/to/module/file.mjs:line:column`, si le cadre représente un appel dans un programme utilisateur (utilisant le système de module ES), ou ses dépendances.

La chaîne représentant la trace de pile est générée paresseusement lorsque la propriété `error.stack` est **consultée**.

Le nombre de cadres capturés par la trace de pile est limité par le plus petit de `Error.stackTraceLimit` ou du nombre de cadres disponibles sur le tick actuel de la boucle d'événement.


## Classe : `AssertionError` {#class-assertionerror}

- Étend : [\<errors.Error\>](/fr/nodejs/api/errors#class-error)

Indique l'échec d'une assertion. Pour plus de détails, voir [`Class: assert.AssertionError`](/fr/nodejs/api/assert#class-assertassertionerror).

## Classe : `RangeError` {#class-rangeerror}

- Étend : [\<errors.Error\>](/fr/nodejs/api/errors#class-error)

Indique qu'un argument fourni ne se trouvait pas dans l'ensemble ou la plage de valeurs acceptables pour une fonction ; qu'il s'agisse d'une plage numérique ou en dehors de l'ensemble d'options pour un paramètre de fonction donné.

```js [ESM]
require('node:net').connect(-1);
// Lève "RangeError: "port" option should be >= 0 and < 65536: -1"
```
Node.js générera et lèvera des instances `RangeError` *immédiatement* comme forme de validation des arguments.

## Classe : `ReferenceError` {#class-referenceerror}

- Étend : [\<errors.Error\>](/fr/nodejs/api/errors#class-error)

Indique qu'une tentative est faite pour accéder à une variable qui n'est pas définie. De telles erreurs indiquent généralement des fautes de frappe dans le code, ou un programme autrement cassé.

Bien que le code client puisse générer et propager ces erreurs, en pratique, seul V8 le fera.

```js [ESM]
doesNotExist;
// Lève ReferenceError, doesNotExist n'est pas une variable dans ce programme.
```
À moins qu'une application ne génère et n'exécute dynamiquement du code, les instances `ReferenceError` indiquent un bug dans le code ou ses dépendances.

## Classe : `SyntaxError` {#class-syntaxerror}

- Étend : [\<errors.Error\>](/fr/nodejs/api/errors#class-error)

Indique qu'un programme n'est pas un JavaScript valide. Ces erreurs ne peuvent être générées et propagées qu'à la suite de l'évaluation du code. L'évaluation du code peut se produire à la suite de `eval`, `Function`, `require` ou [vm](/fr/nodejs/api/vm). Ces erreurs sont presque toujours révélatrices d'un programme cassé.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' sera une SyntaxError.
}
```
Les instances `SyntaxError` sont irrécupérables dans le contexte qui les a créées ; elles ne peuvent être interceptées que par d'autres contextes.

## Classe : `SystemError` {#class-systemerror}

- Étend : [\<errors.Error\>](/fr/nodejs/api/errors#class-error)

Node.js génère des erreurs système lorsque des exceptions se produisent dans son environnement d'exécution. Celles-ci se produisent généralement lorsqu'une application viole une contrainte du système d'exploitation. Par exemple, une erreur système se produira si une application tente de lire un fichier qui n'existe pas.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si présent, l'adresse à laquelle une connexion réseau a échoué
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code d'erreur sous forme de chaîne
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si présent, le chemin de fichier de destination lors du signalement d'une erreur de système de fichiers
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro d'erreur fourni par le système
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si présent, des détails supplémentaires sur la condition d'erreur
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une description de l'erreur lisible par l'homme fournie par le système
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si présent, le chemin de fichier lors du signalement d'une erreur de système de fichiers
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si présent, le port de connexion réseau qui n'est pas disponible
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom de l'appel système qui a déclenché l'erreur


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si présent, `error.address` est une chaîne décrivant l'adresse à laquelle une connexion réseau a échoué.

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `error.code` est une chaîne représentant le code d'erreur.

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si présent, `error.dest` est le chemin du fichier de destination lors du signalement d'une erreur de système de fichiers.

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propriété `error.errno` est un nombre négatif qui correspond au code d'erreur défini dans [`Gestion des erreurs libuv`](https://docs.libuv.org/en/v1.x/errors).

Sous Windows, le numéro d'erreur fourni par le système sera normalisé par libuv.

Pour obtenir la représentation sous forme de chaîne du code d'erreur, utilisez [`util.getSystemErrorName(error.errno)`](/fr/nodejs/api/util#utilgetsystemerrornameerr).

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Si présent, `error.info` est un objet contenant des détails sur la condition d'erreur.

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` est une description de l'erreur fournie par le système, lisible par l'homme.

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si présent, `error.path` est une chaîne contenant un nom de chemin invalide pertinent.

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Si présent, `error.port` est le port de connexion réseau qui n'est pas disponible.

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `error.syscall` est une chaîne décrivant l'[appel système](https://man7.org/linux/man-pages/man2/syscalls.2) qui a échoué.


### Erreurs système courantes {#common-system-errors}

Voici une liste d'erreurs système couramment rencontrées lors de l'écriture d'un programme Node.js. Pour une liste complète, consultez la [page de manuel `errno`(3)](https://man7.org/linux/man-pages/man3/errno.3).

-  `EACCES` (Permission denied) : Une tentative a été faite pour accéder à un fichier d'une manière interdite par ses permissions d'accès aux fichiers.
-  `EADDRINUSE` (Address already in use) : Une tentative de liaison d'un serveur ([`net`](/fr/nodejs/api/net), [`http`](/fr/nodejs/api/http), ou [`https`](/fr/nodejs/api/https)) à une adresse locale a échoué car un autre serveur sur le système local occupait déjà cette adresse.
-  `ECONNREFUSED` (Connection refused) : Aucune connexion n'a pu être établie car la machine cible l'a activement refusée. Cela résulte généralement d'une tentative de connexion à un service inactif sur l'hôte distant.
-  `ECONNRESET` (Connection reset by peer) : Une connexion a été fermée de force par un pair. Cela résulte normalement d'une perte de connexion sur le socket distant en raison d'un délai d'attente ou d'un redémarrage. Couramment rencontrée via les modules [`http`](/fr/nodejs/api/http) et [`net`](/fr/nodejs/api/net).
-  `EEXIST` (File exists) : Un fichier existant était la cible d'une opération qui exigeait que la cible n'existe pas.
-  `EISDIR` (Is a directory) : Une opération attendait un fichier, mais le chemin d'accès donné était un répertoire.
-  `EMFILE` (Too many open files in system) : Le nombre maximal de [descripteurs de fichiers](https://en.wikipedia.org/wiki/File_descriptor) autorisés sur le système a été atteint, et les demandes d'un autre descripteur ne peuvent être satisfaites tant qu'au moins un n'a pas été fermé. Cela se produit lors de l'ouverture de nombreux fichiers simultanément en parallèle, en particulier sur les systèmes (notamment macOS) où la limite de descripteurs de fichiers pour les processus est faible. Pour remédier à une limite basse, exécutez `ulimit -n 2048` dans le même shell qui exécutera le processus Node.js.
-  `ENOENT` (No such file or directory) : Couramment soulevée par les opérations [`fs`](/fr/nodejs/api/fs) pour indiquer qu'un composant du chemin d'accès spécifié n'existe pas. Aucune entité (fichier ou répertoire) n'a pu être trouvée par le chemin donné.
-  `ENOTDIR` (Not a directory) : Un composant du chemin d'accès donné existait, mais n'était pas un répertoire comme prévu. Couramment soulevée par [`fs.readdir`](/fr/nodejs/api/fs#fsreaddirpath-options-callback).
-  `ENOTEMPTY` (Directory not empty) : Un répertoire avec des entrées était la cible d'une opération qui exige un répertoire vide, généralement [`fs.unlink`](/fr/nodejs/api/fs#fsunlinkpath-callback).
-  `ENOTFOUND` (DNS lookup failed) : Indique un échec DNS de `EAI_NODATA` ou `EAI_NONAME`. Ce n'est pas une erreur POSIX standard.
-  `EPERM` (Operation not permitted) : Une tentative a été faite pour effectuer une opération qui nécessite des privilèges élevés.
-  `EPIPE` (Broken pipe) : Une écriture sur un tube, un socket ou un FIFO pour lequel il n'y a pas de processus pour lire les données. Couramment rencontrée aux couches [`net`](/fr/nodejs/api/net) et [`http`](/fr/nodejs/api/http), indiquant que le côté distant du flux vers lequel on écrit a été fermé.
-  `ETIMEDOUT` (Operation timed out) : Une requête de connexion ou d'envoi a échoué car la partie connectée n'a pas répondu correctement après un certain temps. Généralement rencontrée par [`http`](/fr/nodejs/api/http) ou [`net`](/fr/nodejs/api/net). Souvent un signe qu'un `socket.end()` n'a pas été correctement appelé.


## Classe : `TypeError` {#class-typeerror}

- S'étend de [\<errors.Error\>](/fr/nodejs/api/errors#class-error)

Indique qu'un argument fourni n'est pas d'un type autorisé. Par exemple, passer une fonction à un paramètre qui attend une chaîne de caractères serait une `TypeError`.

```js [ESM]
require('node:url').parse(() => { });
// Lève TypeError, car elle attendait une chaîne de caractères.
```
Node.js générera et lèvera des instances `TypeError` *immédiatement* comme forme de validation d'argument.

## Exceptions vs. erreurs {#exceptions-vs-errors}

Une exception JavaScript est une valeur qui est levée à la suite d'une opération non valide ou comme cible d'une instruction `throw`. Bien qu'il ne soit pas obligatoire que ces valeurs soient des instances de `Error` ou des classes héritant de `Error`, toutes les exceptions levées par Node.js ou l'environnement d'exécution JavaScript *seront* des instances de `Error`.

Certaines exceptions sont *irrécupérables* au niveau JavaScript. Ces exceptions feront *toujours* planter le processus Node.js. Les exemples incluent les vérifications `assert()` ou les appels `abort()` dans la couche C++.

## Erreurs OpenSSL {#openssl-errors}

Les erreurs provenant de `crypto` ou `tls` sont de la classe `Error`, et en plus des propriétés standard `.code` et `.message`, peuvent avoir des propriétés OpenSSL supplémentaires.

### `error.opensslErrorStack` {#erroropensslerrorstack}

Un tableau d'erreurs qui peut donner un contexte sur l'origine d'une erreur dans la bibliothèque OpenSSL.

### `error.function` {#errorfunction}

La fonction OpenSSL dans laquelle l'erreur trouve son origine.

### `error.library` {#errorlibrary}

La bibliothèque OpenSSL dans laquelle l'erreur trouve son origine.

### `error.reason` {#errorreason}

Une chaîne de caractères lisible décrivant la raison de l'erreur.

## Codes d'erreur Node.js {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**Ajouté dans : v15.0.0**

Utilisé lorsqu'une opération a été abandonnée (généralement à l'aide d'un `AbortController`).

Les API qui n'utilisent *pas* de `AbortSignal` ne lèvent généralement pas d'erreur avec ce code.

Ce code n'utilise pas la convention régulière `ERR_*` utilisée par les erreurs Node.js afin d'être compatible avec `AbortError` de la plate-forme web.

### `ERR_ACCESS_DENIED` {#err_access_denied}

Un type d'erreur spécial qui est déclenché chaque fois que Node.js tente d'accéder à une ressource restreinte par le [Modèle de permission](/fr/nodejs/api/permissions#permission-model).


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

Un argument de fonction est utilisé d'une manière qui suggère que la signature de la fonction peut être mal comprise. Ceci est levé par le module `node:assert` lorsque le paramètre `message` dans `assert.throws(block, message)` correspond au message d'erreur levé par `block` car cette utilisation suggère que l'utilisateur pense que `message` est le message attendu plutôt que le message que `AssertionError` affichera si `block` ne lève pas d'erreur.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

Un argument itérable (c'est-à-dire une valeur qui fonctionne avec les boucles `for...of`) était requis, mais n'a pas été fourni à une API Node.js.

### `ERR_ASSERTION` {#err_assertion}

Un type d'erreur spécial qui peut être déclenché chaque fois que Node.js détecte une violation de logique exceptionnelle qui ne devrait jamais se produire. Ceux-ci sont généralement levés par le module `node:assert`.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

Une tentative a été faite pour enregistrer quelque chose qui n'est pas une fonction en tant que callback `AsyncHooks`.

### `ERR_ASYNC_TYPE` {#err_async_type}

Le type d'une ressource asynchrone était invalide. Les utilisateurs peuvent également définir leurs propres types s'ils utilisent l'API d'intégration publique.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

Les données transmises à un flux Brotli n'ont pas été compressées avec succès.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

Une clé de paramètre non valide a été transmise lors de la construction d'un flux Brotli.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

Une tentative a été faite pour créer une instance `Buffer` Node.js à partir d'un code d'addon ou d'intégrateur, alors que dans un contexte de moteur JS qui n'est pas associé à une instance Node.js. Les données transmises à la méthode `Buffer` auront été libérées au moment où la méthode renvoie.

Lors de la rencontre de cette erreur, une alternative possible à la création d'une instance `Buffer` est de créer un `Uint8Array` normal, qui ne diffère que par le prototype de l'objet résultant. Les `Uint8Array` sont généralement acceptés dans toutes les API du cœur de Node.js où les `Buffer` le sont ; ils sont disponibles dans tous les contextes.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

Une opération en dehors des limites d'un `Buffer` a été tentée.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

Une tentative a été faite pour créer un `Buffer` plus grand que la taille maximale autorisée.


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.js n'a pas pu surveiller le signal `SIGINT`.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

Un processus enfant a été fermé avant que le parent ne reçoive une réponse.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

Utilisé lorsqu'un processus enfant est créé sans spécifier de canal IPC.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

Utilisé lorsque le processus principal essaie de lire des données à partir de STDERR/STDOUT du processus enfant, et que la longueur des données est supérieure à l'option `maxBuffer`.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.2.0, v14.17.1 | Le message d'erreur a été réintroduit. |
| v11.12.0 | Le message d'erreur a été supprimé. |
| v10.5.0 | Ajouté dans : v10.5.0 |
:::

Il y a eu une tentative d'utilisation d'une instance `MessagePort` dans un état fermé, généralement après que `.close()` ait été appelé.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console` a été instancié sans flux `stdout`, ou `Console` a un flux `stdout` ou `stderr` non accessible en écriture.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**Ajouté dans: v12.5.0**

Un constructeur de classe a été appelé et n'est pas appelable.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

Un constructeur pour une classe a été appelé sans `new`.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

Le contexte vm transmis à l'API n'est pas encore initialisé. Cela peut se produire lorsqu'une erreur se produit (et est interceptée) lors de la création du contexte, par exemple, lorsque l'allocation échoue ou que la taille maximale de la pile d'appels est atteinte lors de la création du contexte.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

Un moteur OpenSSL a été demandé (par exemple, via les options TLS `clientCertEngine` ou `privateKeyEngine`) qui n'est pas pris en charge par la version d'OpenSSL utilisée, probablement en raison de l'indicateur de compilation `OPENSSL_NO_ENGINE`.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

Une valeur invalide pour l'argument `format` a été passée à la méthode `getPublicKey()` de la classe `crypto.ECDH()`.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

Une valeur invalide pour l'argument `key` a été passée à la méthode `computeSecret()` de la classe `crypto.ECDH()`. Cela signifie que la clé publique se trouve en dehors de la courbe elliptique.


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

Un identifiant de moteur cryptographique invalide a été passé à [`require('node:crypto').setEngine()`](/fr/nodejs/api/crypto#cryptosetengineengine-flags).

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

L'argument de ligne de commande [`--force-fips`](/fr/nodejs/api/cli#--force-fips) a été utilisé mais il y a eu une tentative d'activer ou de désactiver le mode FIPS dans le module `node:crypto`.

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

Une tentative d'activer ou de désactiver le mode FIPS a été faite, mais le mode FIPS n'était pas disponible.

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/fr/nodejs/api/crypto#hashdigestencoding) a été appelé plusieurs fois. La méthode `hash.digest()` ne doit être appelée qu'une seule fois par instance d'un objet `Hash`.

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/fr/nodejs/api/crypto#hashupdatedata-inputencoding) a échoué pour une raison quelconque. Cela devrait rarement, voire jamais, arriver.

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

Les clés cryptographiques données sont incompatibles avec l'opération tentée.

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

L'encodage de clé publique ou privée sélectionné est incompatible avec d'autres options.

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**Ajouté dans : v15.0.0**

L'initialisation du sous-système crypto a échoué.

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**Ajouté dans : v15.0.0**

Une balise d'authentification invalide a été fournie.

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**Ajouté dans : v15.0.0**

Un compteur invalide a été fourni pour un chiffrement en mode compteur.

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**Ajouté dans : v15.0.0**

Une courbe elliptique invalide a été fournie.

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

Un [algorithme de hachage crypto](/fr/nodejs/api/crypto#cryptogethashes) invalide a été spécifié.

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**Ajouté dans : v15.0.0**

Un vecteur d'initialisation invalide a été fourni.

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**Ajouté dans : v15.0.0**

Une clé Web JSON invalide a été fournie.

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**Ajouté dans : v15.0.0**

Une longueur de clé invalide a été fournie.

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**Ajouté dans : v15.0.0**

Une paire de clés invalide a été fournie.

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**Ajouté dans : v15.0.0**

Un type de clé invalide a été fourni.


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

Le type de l'objet de clé crypto donné n'est pas valide pour l'opération tentée.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**Ajouté dans : v15.0.0**

Une longueur de message invalide a été fournie.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**Ajouté dans : v15.0.0**

Un ou plusieurs paramètres de [`crypto.scrypt()`](/fr/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) ou [`crypto.scryptSync()`](/fr/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) sont en dehors de leur plage légale.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

Une méthode crypto a été utilisée sur un objet qui était dans un état invalide. Par exemple, appeler [`cipher.getAuthTag()`](/fr/nodejs/api/crypto#ciphergetauthtag) avant d'appeler `cipher.final()`.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**Ajouté dans : v15.0.0**

Une longueur de tag d'authentification invalide a été fournie.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**Ajouté dans : v15.0.0**

L'initialisation d'une opération crypto asynchrone a échoué.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

La courbe elliptique de la clé n'est pas enregistrée pour être utilisée dans le [Registre de courbes elliptiques de clé Web JSON](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve).

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

Le type de clé asymétrique de la clé n'est pas enregistré pour être utilisé dans le [Registre des types de clé Web JSON](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types).

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**Ajouté dans : v15.0.0**

Une opération crypto a échoué pour une raison non spécifiée.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

L'algorithme PBKDF2 a échoué pour des raisons non spécifiées. OpenSSL ne fournit pas plus de détails et Node.js non plus.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.js a été compilé sans le support `scrypt`. Ce n'est pas possible avec les binaires de la version officielle, mais cela peut arriver avec des versions personnalisées, y compris les versions de distribution.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

Une `key` de signature n'a pas été fournie à la méthode [`sign.sign()`](/fr/nodejs/api/crypto#signsignprivatekey-outputencoding).

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

[`crypto.timingSafeEqual()`](/fr/nodejs/api/crypto#cryptotimingsafeequala-b) a été appelé avec des arguments `Buffer`, `TypedArray` ou `DataView` de longueurs différentes.


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

Un chiffrement inconnu a été spécifié.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

Un nom de groupe Diffie-Hellman inconnu a été donné. Voir [`crypto.getDiffieHellman()`](/fr/nodejs/api/crypto#cryptogetdiffiehellmangroupname) pour une liste des noms de groupes valides.

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**Ajouté dans : v15.0.0, v14.18.0**

Une tentative d'invocation d'une opération crypto non prise en charge a été faite.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**Ajouté dans : v16.4.0, v14.17.4**

Une erreur s'est produite avec le [débogueur](/fr/nodejs/api/debugger).

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**Ajouté dans : v16.4.0, v14.17.4**

Le [débogueur](/fr/nodejs/api/debugger) a expiré en attendant que l'hôte/port requis soit libre.

### `ERR_DIR_CLOSED` {#err_dir_closed}

Le [`fs.Dir`](/fr/nodejs/api/fs#class-fsdir) a été préalablement fermé.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**Ajouté dans : v14.3.0**

Un appel synchrone de lecture ou de fermeture a été tenté sur un [`fs.Dir`](/fr/nodejs/api/fs#class-fsdir) qui a des opérations asynchrones en cours.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**Ajouté dans : v16.10.0, v14.19.0**

Le chargement des addons natifs a été désactivé à l'aide de [`--no-addons`](/fr/nodejs/api/cli#--no-addons).

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**Ajouté dans : v15.0.0**

Un appel à `process.dlopen()` a échoué.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` n'a pas réussi à définir le serveur DNS.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

Le module `node:domain` n'était pas utilisable car il n'a pas pu établir les hooks de gestion des erreurs requis, car [`process.setUncaughtExceptionCaptureCallback()`](/fr/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) avait été appelé à un moment antérieur.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

[`process.setUncaughtExceptionCaptureCallback()`](/fr/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) n'a pas pu être appelé car le module `node:domain` a été chargé à un moment antérieur.

La trace de pile est étendue pour inclure le moment où le module `node:domain` a été chargé.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

[`v8.startupSnapshot.setDeserializeMainFunction()`](/fr/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) n'a pas pu être appelé car il avait déjà été appelé auparavant.


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

Les données fournies à l'API `TextDecoder()` étaient invalides selon l'encodage fourni.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

L'encodage fourni à l'API `TextDecoder()` n'était pas l'un des [Encodages pris en charge par WHATWG](/fr/nodejs/api/util#whatwg-supported-encodings).

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` ne peut pas être utilisé avec une entrée ESM.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

Lancée lorsqu'une tentative est faite pour distribuer récursivement un événement sur `EventTarget`.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

Le contexte d'exécution JS n'est pas associé à un environnement Node.js. Cela peut se produire lorsque Node.js est utilisé comme une bibliothèque intégrée et que certains hooks pour le moteur JS ne sont pas correctement configurés.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

Une `Promise` qui a été transformée en rappel via `util.callbackify()` a été rejetée avec une valeur falsy.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**Ajouté dans : v14.0.0**

Utilisé lorsqu'une fonctionnalité qui n'est pas disponible sur la plate-forme actuelle qui exécute Node.js est utilisée.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**Ajouté dans : v16.7.0**

Une tentative a été faite pour copier un répertoire vers un non-répertoire (fichier, lien symbolique, etc.) en utilisant [`fs.cp()`](/fr/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**Ajouté dans : v16.7.0**

Une tentative a été faite pour copier un fichier qui existait déjà avec [`fs.cp()`](/fr/nodejs/api/fs#fscpsrc-dest-options-callback), avec `force` et `errorOnExist` définis sur `true`.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**Ajouté dans : v16.7.0**

Lors de l'utilisation de [`fs.cp()`](/fr/nodejs/api/fs#fscpsrc-dest-options-callback), `src` ou `dest` pointait vers un chemin d'accès invalide.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**Ajouté dans : v16.7.0**

Une tentative a été faite pour copier un tube nommé avec [`fs.cp()`](/fr/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**Ajouté dans : v16.7.0**

Une tentative a été faite pour copier un non-répertoire (fichier, lien symbolique, etc.) vers un répertoire en utilisant [`fs.cp()`](/fr/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**Ajouté dans : v16.7.0**

Une tentative a été faite pour copier vers un socket avec [`fs.cp()`](/fr/nodejs/api/fs#fscpsrc-dest-options-callback).


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Ajouté dans : v16.7.0**

Lors de l’utilisation de [`fs.cp()`](/fr/nodejs/api/fs#fscpsrc-dest-options-callback), un lien symbolique dans `dest` pointait vers un sous-répertoire de `src`.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Ajouté dans : v16.7.0**

Une tentative a été faite de copier vers un type de fichier inconnu avec [`fs.cp()`](/fr/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_EISDIR` {#err_fs_eisdir}

Le chemin est un répertoire.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

Une tentative a été faite pour lire un fichier dont la taille est supérieure à la taille maximale autorisée pour un `Buffer`.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

Les trames HTTP/2 ALTSVC nécessitent une origine valide.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

Les trames HTTP/2 ALTSVC sont limitées à un maximum de 16 382 octets de payload.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

Pour les requêtes HTTP/2 utilisant la méthode `CONNECT`, le pseudo-en-tête `:authority` est obligatoire.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

Pour les requêtes HTTP/2 utilisant la méthode `CONNECT`, le pseudo-en-tête `:path` est interdit.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

Pour les requêtes HTTP/2 utilisant la méthode `CONNECT`, le pseudo-en-tête `:scheme` est interdit.

### `ERR_HTTP2_ERROR` {#err_http2_error}

Une erreur HTTP/2 non spécifique s’est produite.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

De nouveaux flux HTTP/2 ne peuvent pas être ouverts après que `Http2Session` a reçu une trame `GOAWAY` du pair connecté.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

Des en-têtes supplémentaires ont été spécifiés après qu’une réponse HTTP/2 a été initiée.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

Une tentative a été faite pour envoyer plusieurs en-têtes de réponse.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

Plusieurs valeurs ont été fournies pour un champ d’en-tête HTTP/2 qui devait avoir une seule valeur.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

Les codes d’état HTTP informatifs (`1xx`) ne peuvent pas être définis comme code d’état de réponse sur les réponses HTTP/2.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

Les en-têtes spécifiques à la connexion HTTP/1 ne peuvent pas être utilisés dans les requêtes et les réponses HTTP/2.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

Une valeur d’en-tête HTTP/2 non valide a été spécifiée.


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

Un code d'état informationnel HTTP non valide a été spécifié. Les codes d'état informationnels doivent être des entiers compris entre `100` et `199` (inclus).

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

Les trames `ORIGIN` HTTP/2 nécessitent une origine valide.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

Les instances `Buffer` et `Uint8Array` transmises à l'API `http2.getUnpackedSettings()` doivent avoir une longueur multiple de six.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

Seuls les pseudo-en-têtes HTTP/2 valides (`:status`, `:path`, `:authority`, `:scheme` et `:method`) peuvent être utilisés.

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

Une action a été effectuée sur un objet `Http2Session` qui avait déjà été détruit.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

Une valeur non valide a été spécifiée pour un paramètre HTTP/2.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

Une opération a été effectuée sur un flux qui avait déjà été détruit.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

Chaque fois qu'une trame `SETTINGS` HTTP/2 est envoyée à un homologue connecté, ce dernier est tenu d'envoyer un accusé de réception indiquant qu'il a reçu et appliqué les nouveaux `SETTINGS`. Par défaut, un nombre maximal de trames `SETTINGS` non accusées peuvent être envoyées à un moment donné. Ce code d'erreur est utilisé lorsque cette limite est atteinte.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

Une tentative a été faite pour initier un nouveau flux push depuis un flux push. Les flux push imbriqués ne sont pas autorisés.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

Mémoire insuffisante lors de l'utilisation de l'API `http2session.setLocalWindowSize(windowSize)`.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

Une tentative a été faite pour manipuler directement (lire, écrire, mettre en pause, reprendre, etc.) un socket attaché à une `Http2Session`.

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

Les trames `ORIGIN` HTTP/2 sont limitées à une longueur de 16382 octets.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

Le nombre de flux créés sur une seule session HTTP/2 a atteint la limite maximale.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

Une charge utile de message a été spécifiée pour un code de réponse HTTP pour lequel une charge utile est interdite.


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

Un ping HTTP/2 a été annulé.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

Les charges utiles du ping HTTP/2 doivent avoir une longueur exacte de 8 octets.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

Un pseudo-en-tête HTTP/2 a été utilisé de manière inappropriée. Les pseudo-en-têtes sont des noms de clés d'en-tête qui commencent par le préfixe `:`.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

Une tentative a été faite pour créer un flux push, qui avait été désactivé par le client.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

Une tentative a été faite pour utiliser l'API `Http2Stream.prototype.responseWithFile()` afin d'envoyer un répertoire.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

Une tentative a été faite pour utiliser l'API `Http2Stream.prototype.responseWithFile()` afin d'envoyer autre chose qu'un fichier régulier, mais des options `offset` ou `length` ont été fournies.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

La `Http2Session` s'est fermée avec un code d'erreur non nul.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

Les paramètres de `Http2Session` ont été annulés.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

Une tentative a été faite pour connecter un objet `Http2Session` à un `net.Socket` ou `tls.TLSSocket` qui avait déjà été lié à un autre objet `Http2Session`.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

Une tentative a été faite pour utiliser la propriété `socket` d'une `Http2Session` qui a déjà été fermée.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

L'utilisation du code de statut Informationnel `101` est interdite dans HTTP/2.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

Un code de statut HTTP invalide a été spécifié. Les codes de statut doivent être un entier compris entre `100` et `599` (inclus).

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

Un `Http2Stream` a été détruit avant que des données ne soient transmises à l'homologue connecté.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

Un code d'erreur non nul a été spécifié dans une trame `RST_STREAM`.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

Lors de la définition de la priorité d'un flux HTTP/2, le flux peut être marqué comme une dépendance pour un flux parent. Ce code d'erreur est utilisé lorsqu'une tentative est faite pour marquer un flux comme dépendant de lui-même.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

Le nombre de paramètres personnalisés pris en charge (10) a été dépassé.


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Ajouté dans : v15.14.0**

La limite des trames de protocole HTTP/2 invalides acceptables envoyées par le pair, telle que spécifiée par l'option `maxSessionInvalidFrames`, a été dépassée.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

Les en-têtes de fin ont déjà été envoyés sur le `Http2Stream`.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

La méthode `http2stream.sendTrailers()` ne peut être appelée qu'après l'émission de l'événement `'wantTrailers'` sur un objet `Http2Stream`. L'événement `'wantTrailers'` ne sera émis que si l'option `waitForTrailers` est définie pour le `Http2Stream`.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

`http2.connect()` a reçu une URL qui utilise un protocole autre que `http:` ou `https:`.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

Une erreur est levée lors de l'écriture dans une réponse HTTP qui n'autorise pas de contenu.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

La taille du corps de la réponse ne correspond pas à la valeur de l'en-tête content-length spécifié.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

Une tentative a été faite pour ajouter plus d'en-têtes après que les en-têtes aient déjà été envoyés.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

Une valeur d'en-tête HTTP invalide a été spécifiée.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

Le code d'état était en dehors de la plage de codes d'état standard (100-999).

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

Le client n'a pas envoyé la requête complète dans le délai imparti.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

Le [`ServerResponse`](/fr/nodejs/api/http#class-httpserverresponse) donné était déjà assigné à un socket.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

La modification du codage du socket n'est pas autorisée par la [RFC 7230 Section 3](https://tools.ietf.org/html/rfc7230#section-3).

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

L'en-tête `Trailer` a été défini alors que le codage de transfert ne le prend pas en charge.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

Une tentative a été faite pour construire un objet en utilisant un constructeur non public.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Ajouté dans : v21.1.0**

Un attribut d'importation est manquant, empêchant l'importation du module spécifié.


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Ajouté dans : v21.1.0**

Un attribut `type` d’importation a été fourni, mais le module spécifié est d’un type différent.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Ajouté dans : v21.0.0, v20.10.0, v18.19.0**

Un attribut d’importation n’est pas pris en charge par cette version de Node.js.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

Une paire d’options est incompatible l’une avec l’autre et ne peut pas être utilisée en même temps.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

L’indicateur `--input-type` a été utilisé pour tenter d’exécuter un fichier. Cet indicateur ne peut être utilisé qu’avec une entrée via `--eval`, `--print` ou `STDIN`.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

Lors de l’utilisation du module `node:inspector`, une tentative a été faite pour activer l’inspecteur alors qu’il avait déjà commencé à écouter sur un port. Utilisez `inspector.close()` avant de l’activer à une adresse différente.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

Lors de l’utilisation du module `node:inspector`, une tentative de connexion a été effectuée alors que l’inspecteur était déjà connecté.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

Lors de l’utilisation du module `node:inspector`, une tentative a été faite pour utiliser l’inspecteur après que la session ait déjà été fermée.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

Une erreur s’est produite lors de l’exécution d’une commande via le module `node:inspector`.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

L’`inspector` n’est pas actif lorsque `inspector.waitForDebugger()` est appelé.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

Le module `node:inspector` n’est pas disponible pour être utilisé.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

Lors de l’utilisation du module `node:inspector`, une tentative a été faite pour utiliser l’inspecteur avant qu’il ne soit connecté.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

Une API a été appelée sur le thread principal qui ne peut être utilisée qu’à partir du thread worker.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

Il y avait un bug dans Node.js ou une utilisation incorrecte des éléments internes de Node.js. Pour corriger l’erreur, ouvrez un ticket sur [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues).


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

L'adresse fournie n'est pas comprise par l'API Node.js.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

La famille d'adresses fournie n'est pas comprise par l'API Node.js.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

Un argument de type incorrect a été passé à une API Node.js.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

Une valeur non valide ou non prise en charge a été passée pour un argument donné.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

Un `asyncId` ou `triggerAsyncId` non valide a été passé en utilisant `AsyncHooks`. Un ID inférieur à -1 ne devrait jamais se produire.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

Un swap a été effectué sur un `Buffer` mais sa taille n'était pas compatible avec l'opération.

### `ERR_INVALID_CHAR` {#err_invalid_char}

Des caractères non valides ont été détectés dans les en-têtes.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

Un curseur sur un flux donné ne peut pas être déplacé vers une ligne spécifiée sans une colonne spécifiée.

### `ERR_INVALID_FD` {#err_invalid_fd}

Un descripteur de fichier ('fd') n'était pas valide (par exemple, il s'agissait d'une valeur négative).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

Un type de descripteur de fichier ('fd') n'était pas valide.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

Une API Node.js qui consomme des URL `file:` (telles que certaines fonctions dans le module [`fs`](/fr/nodejs/api/fs)) a rencontré une URL de fichier avec un hôte incompatible. Cette situation ne peut se produire que sur les systèmes de type Unix où seul `localhost` ou un hôte vide est pris en charge.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

Une API Node.js qui consomme des URL `file:` (telles que certaines fonctions du module [`fs`](/fr/nodejs/api/fs)) a rencontré une URL de fichier avec un chemin incompatible. La sémantique exacte pour déterminer si un chemin peut être utilisé dépend de la plate-forme.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

Une tentative a été faite pour envoyer un "handle" non pris en charge sur un canal de communication IPC à un processus enfant. Voir [`subprocess.send()`](/fr/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) et [`process.send()`](/fr/nodejs/api/process#processsendmessage-sendhandle-options-callback) pour plus d'informations.

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

Un jeton HTTP non valide a été fourni.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

Une adresse IP n'est pas valide.


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

La syntaxe d'un MIME n'est pas valide.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**Ajouté dans : v15.0.0, v14.18.0**

Une tentative a été faite pour charger un module qui n'existe pas ou qui n'est pas valide d'une autre manière.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

La chaîne de module importée est une URL, un nom de paquetage ou un spécificateur de sous-chemin de paquetage invalide.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

Une erreur s'est produite lors de la définition d'un attribut invalide sur la propriété d'un objet.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

Un fichier [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) invalide n'a pas pu être analysé.

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

Le champ [`"exports"`](/fr/nodejs/api/packages#exports) de `package.json` contient une valeur de mappage de cible invalide pour la résolution de module tentée.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

Un `options.protocol` invalide a été passé à `http.request()`.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

Les options `breakEvalOnSigint` et `eval` ont toutes deux été définies dans la configuration [`REPL`](/fr/nodejs/api/repl), ce qui n'est pas pris en charge.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

L'entrée ne peut pas être utilisée dans le [`REPL`](/fr/nodejs/api/repl). Les conditions dans lesquelles cette erreur est utilisée sont décrites dans la documentation [`REPL`](/fr/nodejs/api/repl).

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

Levée si une option de fonction ne fournit pas une valeur valide pour l'une de ses propriétés d'objet retournées lors de l'exécution.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

Levée si une option de fonction ne fournit pas un type de valeur attendu pour l'une de ses propriétés d'objet retournées lors de l'exécution.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

Levée si une option de fonction ne renvoie pas un type de valeur attendu lors de l'exécution, par exemple lorsqu'une fonction est censée renvoyer une promesse.

### `ERR_INVALID_STATE` {#err_invalid_state}

**Ajouté dans : v15.0.0**

Indique qu'une opération ne peut pas être effectuée en raison d'un état invalide. Par exemple, un objet peut déjà avoir été détruit ou peut être en train d'effectuer une autre opération.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

Un `Buffer`, `TypedArray`, `DataView` ou `string` a été fourni comme entrée stdio à un fork asynchrone. Voir la documentation du module [`child_process`](/fr/nodejs/api/child_process) pour plus d'informations.


### `ERR_INVALID_THIS` {#err_invalid_this}

Une fonction API Node.js a été appelée avec une valeur `this` incompatible.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Lève un TypeError avec le code 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

Un élément dans l'`itérable` fourni au [WHATWG](/fr/nodejs/api/url#the-whatwg-url-api) [`constructeur URLSearchParams`](/fr/nodejs/api/url#new-urlsearchparamsiterable) ne représentait pas un tuple `[nom, valeur]` - c'est-à-dire, si un élément n'est pas itérable, ou ne consiste pas en exactement deux éléments.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**Ajouté dans : v23.0.0**

La syntaxe TypeScript fournie n'est pas valide ou n'est pas prise en charge. Cela peut se produire lors de l'utilisation d'une syntaxe TypeScript qui nécessite une transformation avec [suppression de type](/fr/nodejs/api/typescript#type-stripping).

### `ERR_INVALID_URI` {#err_invalid_uri}

Un URI invalide a été passé.

### `ERR_INVALID_URL` {#err_invalid_url}

Une URL invalide a été passée au [WHATWG](/fr/nodejs/api/url#the-whatwg-url-api) [`constructeur URL`](/fr/nodejs/api/url#new-urlinput-base) ou à l'ancien [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) pour être analysée. L'objet d'erreur lancé a généralement une propriété supplémentaire `'input'` qui contient l'URL qui n'a pas pu être analysée.

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

Une tentative a été faite d'utiliser une URL d'un schéma (protocole) incompatible à des fins spécifiques. Il est uniquement utilisé dans la prise en charge de l'[API WHATWG URL](/fr/nodejs/api/url#the-whatwg-url-api) dans le module [`fs`](/fr/nodejs/api/fs) (qui n'accepte que les URL avec le schéma `'file'`), mais peut également être utilisé dans d'autres API Node.js à l'avenir.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

Une tentative a été faite d'utiliser un canal de communication IPC qui était déjà fermé.

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

Une tentative a été faite de déconnecter un canal de communication IPC qui était déjà déconnecté. Voir la documentation du module [`child_process`](/fr/nodejs/api/child_process) pour plus d'informations.

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

Une tentative a été faite de créer un processus Node.js enfant en utilisant plus d'un canal de communication IPC. Voir la documentation du module [`child_process`](/fr/nodejs/api/child_process) pour plus d'informations.


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

Une tentative d'ouverture d'un canal de communication IPC avec un processus Node.js forké de manière synchrone a été effectuée. Consultez la documentation du module [`child_process`](/fr/nodejs/api/child_process) pour plus d'informations.

### `ERR_IP_BLOCKED` {#err_ip_blocked}

L'adresse IP est bloquée par `net.BlockList`.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**Ajouté dans : v18.6.0, v16.17.0**

Un hook de chargement ESM est retourné sans appeler `next()` et sans signaler explicitement un court-circuit.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**Ajouté dans : v23.5.0**

Une erreur s'est produite lors du chargement d'une extension SQLite.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

Une tentative d'allocation de mémoire (généralement dans la couche C++) a été effectuée, mais elle a échoué.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**Ajouté dans : v14.5.0, v12.19.0**

Un message envoyé à un [`MessagePort`](/fr/nodejs/api/worker_threads#class-messageport) n'a pas pu être désérialisé dans le [`Context`](/fr/nodejs/api/vm) vm cible. Tous les objets Node.js ne peuvent pas être instanciés avec succès dans n'importe quel contexte pour le moment, et tenter de les transférer à l'aide de `postMessage()` peut échouer du côté de la réception dans ce cas.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

Une méthode est requise mais non implémentée.

### `ERR_MISSING_ARGS` {#err_missing_args}

Un argument requis d'une API Node.js n'a pas été transmis. Ceci n'est utilisé que pour une stricte conformité à la spécification de l'API (qui dans certains cas peut accepter `func(undefined)` mais pas `func()`). Dans la plupart des API Node.js natives, `func(undefined)` et `func()` sont traités de manière identique, et le code d'erreur [`ERR_INVALID_ARG_TYPE`](/fr/nodejs/api/errors#err-invalid-arg-type) peut être utilisé à la place.

### `ERR_MISSING_OPTION` {#err_missing_option}

Pour les API qui acceptent les objets d'options, certaines options peuvent être obligatoires. Ce code est levé si une option requise est manquante.

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

Une tentative de lecture d'une clé chiffrée a été effectuée sans spécifier de phrase secrète.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

La plateforme V8 utilisée par cette instance de Node.js ne prend pas en charge la création de Workers. Ceci est causé par un manque de support d'intégration pour les Workers. En particulier, cette erreur ne se produira pas avec les builds standard de Node.js.


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

Un fichier de module n'a pas pu être résolu par le chargeur de modules ECMAScript lors d'une tentative d'opération `import` ou lors du chargement du point d'entrée du programme.

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

Un rappel a été appelé plus d'une fois.

Un rappel est presque toujours destiné à n'être appelé qu'une seule fois, car la requête peut être satisfaite ou rejetée, mais pas les deux en même temps. Ce dernier serait possible en appelant un rappel plus d'une fois.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

Lors de l'utilisation de `Node-API`, un constructeur transmis n'était pas une fonction.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

Lors de l'appel de `napi_create_dataview()`, un `offset` donné était en dehors des limites de la vue de données ou `offset + length` était supérieur à la longueur d'un `buffer` donné.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

Lors de l'appel de `napi_create_typedarray()`, l'`offset` fourni n'était pas un multiple de la taille de l'élément.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

Lors de l'appel de `napi_create_typedarray()`, `(length * size_of_element) + byte_offset` était supérieur à la longueur du `buffer` donné.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

Une erreur s'est produite lors de l'appel de la partie JavaScript de la fonction thread-safe.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

Une erreur s'est produite lors de la tentative de récupération de la valeur JavaScript `undefined`.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

Un addon natif non conscient du contexte a été chargé dans un processus qui les interdit.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

Une tentative a été faite pour utiliser des opérations qui ne peuvent être utilisées que lors de la construction d'un instantané de démarrage V8, même si Node.js n'en construit pas un.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**Ajouté dans : v21.7.0, v20.12.0**

L'opération ne peut pas être effectuée lorsqu'elle ne se trouve pas dans une application mono-exécutable.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

Une tentative a été faite pour effectuer des opérations qui ne sont pas prises en charge lors de la construction d'un instantané de démarrage.

### `ERR_NO_CRYPTO` {#err_no_crypto}

Une tentative a été faite pour utiliser les fonctionnalités de cryptographie alors que Node.js n'a pas été compilé avec la prise en charge de la cryptographie OpenSSL.


### `ERR_NO_ICU` {#err_no_icu}

Une tentative d'utilisation de fonctionnalités nécessitant [ICU](/fr/nodejs/api/intl#internationalization-support) a été effectuée, mais Node.js n'a pas été compilé avec le support ICU.

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**Ajouté dans : v23.0.0**

Une tentative d'utilisation de fonctionnalités nécessitant la [prise en charge native de TypeScript](/fr/nodejs/api/typescript#type-stripping) a été effectuée, mais Node.js n'a pas été compilé avec la prise en charge de TypeScript.

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**Ajouté dans : v15.0.0**

Une opération a échoué. Ceci est généralement utilisé pour signaler l'échec général d'une opération asynchrone.

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

Une valeur donnée est hors de la plage acceptée.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

Le champ [`"imports"`](/fr/nodejs/api/packages#imports) du `package.json` ne définit pas le mapping de spécificateur de package interne donné.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

Le champ [`"exports"`](/fr/nodejs/api/packages#exports) du `package.json` n'exporte pas le sous-chemin demandé. Étant donné que les exports sont encapsulés, les modules internes privés qui ne sont pas exportés ne peuvent pas être importés via la résolution de package, sauf si vous utilisez une URL absolue.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**Ajouté dans : v18.3.0, v16.17.0**

Lorsque `strict` est défini sur `true`, est lancé par [`util.parseArgs()`](/fr/nodejs/api/util#utilparseargsconfig) si une valeur [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) est fournie pour une option de type [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), ou si une valeur [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) est fournie pour une option de type [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**Ajouté dans : v18.3.0, v16.17.0**

Lancé par [`util.parseArgs()`](/fr/nodejs/api/util#utilparseargsconfig), lorsqu'un argument positionnel est fourni et que `allowPositionals` est défini sur `false`.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**Ajouté dans : v18.3.0, v16.17.0**

Lorsque `strict` est défini sur `true`, est lancé par [`util.parseArgs()`](/fr/nodejs/api/util#utilparseargsconfig) si un argument n'est pas configuré dans `options`.


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

Une valeur d'horodatage invalide a été fournie pour une marque ou une mesure de performance.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

Des options invalides ont été fournies pour une mesure de performance.

### `ERR_PROTO_ACCESS` {#err_proto_access}

L'accès à `Object.prototype.__proto__` a été interdit en utilisant [`--disable-proto=throw`](/fr/nodejs/api/cli#--disable-protomode). [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) et [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) doivent être utilisés pour obtenir et définir le prototype d'un objet.

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**Ajouté dans : v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Une erreur d'application QUIC s'est produite.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**Ajouté dans : v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

L'établissement d'une connexion QUIC a échoué.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**Ajouté dans : v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Un point de terminaison QUIC s'est fermé avec une erreur.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**Ajouté dans : v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

L'ouverture d'un flux QUIC a échoué.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**Ajouté dans : v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Une erreur de transport QUIC s'est produite.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**Ajouté dans : v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Une session QUIC a échoué car une négociation de version est requise.


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Lors d'une tentative d'utiliser `require()` sur un [Module ES](/fr/nodejs/api/esm), le module s'avère être asynchrone. C'est-à-dire qu'il contient un top-level await.

Pour voir où se trouve le top-level await, utilisez `--experimental-print-required-tla` (cela exécuterait les modules avant de rechercher les top-level awaits).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Lors d'une tentative d'utiliser `require()` sur un [Module ES](/fr/nodejs/api/esm), une bordure CommonJS vers ESM ou ESM vers CommonJS participe à un cycle immédiat. Cela n'est pas autorisé car les Modules ES ne peuvent pas être évalués pendant qu'ils sont déjà en cours d'évaluation.

Pour éviter le cycle, l'appel `require()` impliqué dans un cycle ne doit pas se produire au niveau supérieur d'un Module ES (via `createRequire()`) ou d'un module CommonJS, et doit être effectué de manière paresseuse dans une fonction interne.

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | require() prend désormais en charge le chargement des modules ES synchrones par défaut. |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

Une tentative a été faite pour `require()` un [Module ES](/fr/nodejs/api/esm).

Cette erreur est dépréciée car `require()` prend désormais en charge le chargement des modules ES synchrones. Lorsque `require()` rencontre un module ES qui contient un `await` de niveau supérieur, il lèvera [`ERR_REQUIRE_ASYNC_MODULE`](/fr/nodejs/api/errors#err_require_async_module) à la place.

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

L'exécution du script a été interrompue par `SIGINT` (Par exemple, + a été pressé.)

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

L'exécution du script a expiré, probablement en raison de bugs dans le script en cours d'exécution.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

La méthode [`server.listen()`](/fr/nodejs/api/net#serverlisten) a été appelée alors qu'un `net.Server` était déjà à l'écoute. Cela s'applique à toutes les instances de `net.Server`, y compris les instances `Server` HTTP, HTTPS et HTTP/2.


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

La méthode [`server.close()`](/fr/nodejs/api/net#serverclosecallback) a été appelée alors qu'un `net.Server` n'était pas en cours d'exécution. Ceci s'applique à toutes les instances de `net.Server`, y compris les instances `Server` HTTP, HTTPS et HTTP/2.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**Ajouté dans : v21.7.0, v20.12.0**

Une clé a été transmise aux API d'application exécutable unique pour identifier un actif, mais aucune correspondance n'a été trouvée.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

Une tentative a été faite pour lier un socket qui a déjà été lié.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

Une taille invalide (négative) a été passée pour les options `recvBufferSize` ou `sendBufferSize` dans [`dgram.createSocket()`](/fr/nodejs/api/dgram#dgramcreatesocketoptions-callback).

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

Une fonction API attendant un port \>= 0 et \< 65536 a reçu une valeur invalide.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

Une fonction API attendant un type de socket (`udp4` ou `udp6`) a reçu une valeur invalide.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

Lors de l'utilisation de [`dgram.createSocket()`](/fr/nodejs/api/dgram#dgramcreatesocketoptions-callback), la taille du `Buffer` de réception ou d'envoi n'a pas pu être déterminée.

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

Une tentative a été faite pour opérer sur un socket déjà fermé.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

Lors de l'appel de [`net.Socket.write()`](/fr/nodejs/api/net#socketwritedata-encoding-callback) sur un socket en cours de connexion et que le socket a été fermé avant que la connexion ne soit établie.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

Le socket n'a pas pu se connecter à une adresse renvoyée par le DNS dans le délai d'attente autorisé lors de l'utilisation de l'algorithme de sélection automatique de la famille.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

Un appel [`dgram.connect()`](/fr/nodejs/api/dgram#socketconnectport-address-callback) a été effectué sur un socket déjà connecté.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

Un appel [`dgram.disconnect()`](/fr/nodejs/api/dgram#socketdisconnect) ou [`dgram.remoteAddress()`](/fr/nodejs/api/dgram#socketremoteaddress) a été effectué sur un socket déconnecté.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

Un appel a été effectué et le sous-système UDP n'était pas en cours d'exécution.


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

La source map n'a pas pu être analysée car elle n'existe pas ou est corrompue.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

Un fichier importé à partir d'une source map n'a pas été trouvé.

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**Ajouté dans : v22.5.0**

Une erreur a été renvoyée par [SQLite](/fr/nodejs/api/sqlite).

### `ERR_SRI_PARSE` {#err_sri_parse}

Une chaîne a été fournie pour une vérification d'intégrité des sous-ressources, mais n'a pas pu être analysée. Vérifiez le format des attributs d'intégrité en consultant la [spécification d'intégrité des sous-ressources](https://www.w3.org/TR/SRI/#the-integrity-attribute).

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

Une méthode de flux a été appelée qui ne peut pas se terminer car le flux est terminé.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

Une tentative a été faite pour appeler [`stream.pipe()`](/fr/nodejs/api/stream#readablepipedestination-options) sur un flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable).

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

Une méthode de flux a été appelée qui ne peut pas se terminer car le flux a été détruit à l'aide de `stream.destroy()`.

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

Une tentative a été faite pour appeler [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) avec un chunk `null`.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

Une erreur renvoyée par `stream.finished()` et `stream.pipeline()`, lorsqu'un flux ou un pipeline se termine de manière non gracieuse sans erreur explicite.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

Une tentative a été faite pour appeler [`stream.push()`](/fr/nodejs/api/stream#readablepushchunk-encoding) après qu'un `null` (EOF) ait été poussé vers le flux.

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

Une tentative a été faite pour rediriger vers un flux fermé ou détruit dans un pipeline.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

Une tentative a été faite pour appeler [`stream.unshift()`](/fr/nodejs/api/stream#readableunshiftchunk-encoding) après que l'événement `'end'` ait été émis.

### `ERR_STREAM_WRAP` {#err_stream_wrap}

Empêche un abandon si un décodeur de chaîne a été défini sur le Socket ou si le décodeur est en `objectMode`.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

Une tentative a été faite d'appeler [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) après que `stream.end()` a été appelé.

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

Une tentative a été faite de créer une chaîne de caractères plus longue que la longueur maximale autorisée.

### `ERR_SYNTHETIC` {#err_synthetic}

Un objet d'erreur artificiel utilisé pour capturer la pile d'appels pour les rapports de diagnostic.

### `ERR_SYSTEM_ERROR` {#err_system_error}

Une erreur système non spécifiée ou non spécifique s'est produite dans le processus Node.js. L'objet d'erreur aura une propriété d'objet `err.info` avec des détails supplémentaires.

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

Une erreur représentant un état d'analyse lexicale défaillant.

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

Une erreur représentant un état d'analyse syntaxique défaillant. Des informations supplémentaires sur le jeton à l'origine de l'erreur sont disponibles via la propriété `cause`.

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

Cette erreur représente une validation TAP échouée.

### `ERR_TEST_FAILURE` {#err_test_failure}

Cette erreur représente un test échoué. Des informations supplémentaires sur l'échec sont disponibles via la propriété `cause`. La propriété `failureType` spécifie ce que le test faisait lorsque l'échec s'est produit.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

Cette erreur est levée lorsqu'un `ALPNCallback` renvoie une valeur qui ne figure pas dans la liste des protocoles ALPN proposés par le client.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

Cette erreur est levée lors de la création d'un `TLSServer` si les options TLS incluent à la fois `ALPNProtocols` et `ALPNCallback`. Ces options s'excluent mutuellement.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

Cette erreur est levée par `checkServerIdentity` si une propriété `subjectaltname` fournie par l'utilisateur viole les règles d'encodage. Les objets de certificat produits par Node.js lui-même sont toujours conformes aux règles d'encodage et ne provoqueront jamais cette erreur.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

Lors de l'utilisation de TLS, le nom d'hôte/l'adresse IP du pair ne correspond à aucun des `subjectAltNames` dans son certificat.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

Lors de l'utilisation de TLS, le paramètre proposé pour le protocole d'accord de clé Diffie-Hellman (`DH`) est trop petit. Par défaut, la longueur de la clé doit être supérieure ou égale à 1024 bits pour éviter les vulnérabilités, même s'il est fortement recommandé d'utiliser 2048 bits ou plus pour une sécurité renforcée.


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

Un handshake TLS/SSL a expiré. Dans ce cas, le serveur doit également abandonner la connexion.

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**Ajouté dans: v13.3.0**

Le contexte doit être un `SecureContext`.

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

La méthode `secureProtocol` spécifiée n'est pas valide. Elle est soit inconnue, soit désactivée car elle n'est pas sécurisée.

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

Les versions de protocole TLS valides sont `'TLSv1'`, `'TLSv1.1'` ou `'TLSv1.2'`.

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**Ajouté dans : v13.10.0, v12.17.0**

Le socket TLS doit être connecté et sécurisé. Assurez-vous que l'événement 'secure' est émis avant de continuer.

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

Tenter de définir un protocole TLS `minVersion` ou `maxVersion` entre en conflit avec une tentative de définition explicite de `secureProtocol`. Utilisez l'un ou l'autre mécanisme.

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

Échec de la définition de l'indice d'identité PSK. L'indice est peut-être trop long.

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

Une tentative de renégociation TLS a été effectuée sur une instance de socket avec renégociation désactivée.

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

Lors de l'utilisation de TLS, la méthode `server.addContext()` a été appelée sans fournir de nom d'hôte dans le premier paramètre.

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

Une quantité excessive de renégociations TLS est détectée, ce qui constitue un vecteur potentiel d'attaques par déni de service.

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

Une tentative a été faite d'émettre une indication de nom de serveur à partir d'un socket TLS côté serveur, ce qui n'est valable que depuis un client.

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

La méthode `trace_events.createTracing()` nécessite au moins une catégorie d'événement de trace.

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

Le module `node:trace_events` n'a pas pu être chargé car Node.js a été compilé avec l'indicateur `--without-v8-platform`.

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

Un flux `Transform` s'est terminé alors qu'il était encore en transformation.

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

Un flux `Transform` s'est terminé avec des données encore dans le tampon d'écriture.


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

L'initialisation d'un TTY a échoué en raison d'une erreur système.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

La fonction a été appelée dans un gestionnaire [`process.on('exit')`](/fr/nodejs/api/process#event-exit) qui ne devrait pas être appelée dans un gestionnaire [`process.on('exit')`](/fr/nodejs/api/process#event-exit).

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

[`process.setUncaughtExceptionCaptureCallback()`](/fr/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) a été appelé deux fois, sans d'abord réinitialiser le rappel à `null`.

Cette erreur est conçue pour éviter d'écraser accidentellement un rappel enregistré à partir d'un autre module.

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

Une chaîne contenant des caractères non échappés a été reçue.

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

Une erreur non gérée s'est produite (par exemple, lorsqu'un événement `'error'` est émis par un [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter) mais qu'un gestionnaire `'error'` n'est pas enregistré).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

Utilisé pour identifier un type spécifique d'erreur interne de Node.js qui ne devrait généralement pas être déclenchée par le code utilisateur. Les instances de cette erreur pointent vers un bug interne dans le binaire Node.js lui-même.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

Un identifiant de groupe ou d'utilisateur Unix qui n'existe pas a été passé.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

Une option d'encodage invalide ou inconnue a été passée à une API.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Une tentative a été faite pour charger un module avec une extension de fichier inconnue ou non prise en charge.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Une tentative a été faite pour charger un module avec un format inconnu ou non pris en charge.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

Un signal de processus invalide ou inconnu a été passé à une API attendant un signal valide (tel que [`subprocess.kill()`](/fr/nodejs/api/child_process#subprocesskillsignal)).


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

L'instruction `import` d'une URL de répertoire n'est pas prise en charge. Utilisez plutôt [l'auto-référence à un paquet en utilisant son nom](/fr/nodejs/api/packages#self-referencing-a-package-using-its-name) et [définissez un sous-chemin personnalisé](/fr/nodejs/api/packages#subpath-exports) dans le champ [`"exports"`](/fr/nodejs/api/packages#exports) du fichier [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions).

```js [ESM]
import './'; // non pris en charge
import './index.js'; // pris en charge
import 'package-name'; // pris en charge
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

L'instruction `import` avec des schémas d'URL autres que `file` et `data` n'est pas prise en charge.

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**Ajouté dans : v22.6.0**

La suppression des types n'est pas prise en charge pour les fichiers descendants d'un répertoire `node_modules`.

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

Une tentative de résolution d'un référent de module invalide a été effectuée. Cela peut se produire lors de l'importation ou de l'appel de `import.meta.resolve()` avec :

- un spécificateur nu qui n'est pas un module intégré à partir d'un module dont le schéma d'URL n'est pas `file`.
- une [URL relative](https://url.spec.whatwg.org/#relative-url-string) à partir d'un module dont le schéma d'URL n'est pas un [schéma spécial](https://url.spec.whatwg.org/#special-scheme).

```js [ESM]
try {
  // Tentative d'importation du paquet 'bare-specifier' depuis un module d'URL `data:` :
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Une tentative d'utilisation de quelque chose qui était déjà fermé a été effectuée.

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

Lors de l'utilisation de l'API Performance Timing (`perf_hooks`), aucun type d'entrée de performance valide n'est trouvé.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

Un rappel d'importation dynamique n'a pas été spécifié.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

Un rappel d'importation dynamique a été invoqué sans `--experimental-vm-modules`.


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

Le module qui a tenté d'être lié n'est pas éligible au lien, pour l'une des raisons suivantes :

- Il a déjà été lié (`linkingStatus` est `'linked'`)
- Il est en cours de liaison (`linkingStatus` est `'linking'`)
- La liaison a échoué pour ce module (`linkingStatus` est `'errored'`)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

L'option `cachedData` passée à un constructeur de module n'est pas valide.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

Les données mises en cache ne peuvent pas être créées pour les modules qui ont déjà été évalués.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

Le module renvoyé par la fonction linker provient d'un contexte différent de celui du module parent. Les modules liés doivent partager le même contexte.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

Le module n'a pas pu être lié en raison d'un échec.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

La valeur accomplie d'une promesse de liaison n'est pas un objet `vm.Module`.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

L'état actuel du module ne permet pas cette opération. La signification spécifique de l'erreur dépend de la fonction spécifique.

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

L'instance WASI a déjà démarré.

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

L'instance WASI n'a pas été démarrée.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**Ajouté dans : v18.1.0**

La `Response` qui a été passée à `WebAssembly.compileStreaming` ou à `WebAssembly.instantiateStreaming` n'est pas une réponse WebAssembly valide.

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

L'initialisation de `Worker` a échoué.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

L'option `execArgv` passée au constructeur `Worker` contient des indicateurs non valides.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Le thread de destination a renvoyé une erreur lors du traitement d'un message envoyé via [`postMessageToThread()`](/fr/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Le thread demandé dans [`postMessageToThread()`](/fr/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) n'est pas valide ou n'a pas d'écouteur `workerMessage`.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

L'identifiant de thread demandé dans [`postMessageToThread()`](/fr/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) est l'identifiant de thread actuel.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Ajouté dans : v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

L'envoi d'un message via [`postMessageToThread()`](/fr/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) a expiré.

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

Une opération a échoué car l'instance `Worker` n'est pas en cours d'exécution.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

L'instance `Worker` s'est arrêtée car elle a atteint sa limite de mémoire.

### `ERR_WORKER_PATH` {#err_worker_path}

Le chemin d'accès au script principal d'un worker n'est ni un chemin absolu, ni un chemin relatif commençant par `./` ou `../`.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

Toutes les tentatives de sérialisation d'une exception non interceptée d'un thread de worker ont échoué.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

La fonctionnalité demandée n'est pas prise en charge dans les threads de worker.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

La création d'un objet [`zlib`](/fr/nodejs/api/zlib) a échoué en raison d'une configuration incorrecte.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Ajouté dans : v21.6.2, v20.11.1, v18.19.1**

Trop de données ont été reçues pour une extension de segment. Afin de se protéger contre les clients malveillants ou mal configurés, si plus de 16 Kio de données sont reçues, une `Error` avec ce code sera émise.


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.4.0, v10.15.0 | La taille maximale de l'en-tête dans `http_parser` a été fixée à 8 KiB. |
:::

Trop de données d'en-tête HTTP ont été reçues. Afin de se protéger contre les clients malveillants ou mal configurés, si plus de `maxHeaderSize` de données d'en-tête HTTP sont reçues, l'analyse HTTP sera abandonnée sans qu'un objet de requête ou de réponse ne soit créé, et une `Error` avec ce code sera émise.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

Le serveur envoie à la fois un en-tête `Content-Length` et `Transfer-Encoding: chunked`.

`Transfer-Encoding: chunked` permet au serveur de maintenir une connexion persistante HTTP pour le contenu généré dynamiquement. Dans ce cas, l'en-tête HTTP `Content-Length` ne peut pas être utilisé.

Utilisez `Content-Length` ou `Transfer-Encoding: chunked`.

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Ajout de la propriété `requireStack`. |
:::

Un fichier de module n'a pas pu être résolu par le chargeur de modules CommonJS lors d'une tentative d'opération [`require()`](/fr/nodejs/api/modules#requireid) ou lors du chargement du point d'entrée du programme.

## Codes d'erreur Node.js hérités {#legacy-nodejs-error-codes}

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Ces codes d'erreur sont soit incohérents, soit ont été supprimés.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**Ajouté dans: v10.5.0**

**Supprimé dans: v12.5.0**

La valeur passée à `postMessage()` contenait un objet qui n'est pas supporté pour le transfert.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**Supprimé dans: v15.0.0**

L'appel natif de `process.cpuUsage` n'a pas pu être traité.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**Ajouté dans: v9.0.0**

**Supprimé dans: v12.12.0**

L'encodage UTF-16 a été utilisé avec [`hash.digest()`](/fr/nodejs/api/crypto#hashdigestencoding). Bien que la méthode `hash.digest()` autorise la transmission d'un argument `encoding`, ce qui fait que la méthode renvoie une chaîne de caractères plutôt qu'un `Buffer`, l'encodage UTF-16 (par exemple `ucs` ou `utf16le`) n'est pas pris en charge.


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**Supprimé dans : v23.0.0**

Une combinaison d'options incompatibles a été transmise à [`crypto.scrypt()`](/fr/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) ou [`crypto.scryptSync()`](/fr/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options). Les nouvelles versions de Node.js utilisent désormais le code d'erreur [`ERR_INCOMPATIBLE_OPTION_PAIR`](/fr/nodejs/api/errors#err_incompatible_option_pair) à la place, ce qui est cohérent avec d'autres API.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**Supprimé dans : v23.0.0**

Un type de lien symbolique non valide a été transmis aux méthodes [`fs.symlink()`](/fr/nodejs/api/fs#fssymlinktarget-path-type-callback) ou [`fs.symlinkSync()`](/fr/nodejs/api/fs#fssymlinksynctarget-path-type).

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'un échec se produit lors de l'envoi d'une trame individuelle sur la session HTTP/2.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'un objet d'en-têtes HTTP/2 est attendu.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'un en-tête requis est manquant dans un message HTTP/2.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Les en-têtes d'information HTTP/2 doivent être envoyés *avant* d'appeler la méthode `Http2Stream.prototype.respond()`.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'une action a été effectuée sur un flux HTTP/2 qui a déjà été fermé.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'un caractère non valide est trouvé dans un message d'état de réponse HTTP (phrase descriptive).

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**Ajouté dans : v17.1.0, v16.14.0**

**Supprimé dans : v21.1.0**

Une assertion d’importation a échoué, empêchant l’importation du module spécifié.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**Ajouté dans : v17.1.0, v16.14.0**

**Supprimé dans : v21.1.0**

Une assertion d’importation est manquante, empêchant l’importation du module spécifié.


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**Ajouté dans: v17.1.0, v16.14.0**

**Supprimé dans: v21.1.0**

Un attribut d'importation n'est pas pris en charge par cette version de Node.js.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**Ajouté dans: v10.0.0**

**Supprimé dans: v11.0.0**

Un index donné était hors de la plage acceptée (par exemple, des décalages négatifs).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**Ajouté dans: v8.0.0**

**Supprimé dans: v15.0.0**

Une valeur invalide ou inattendue a été passée dans un objet d'options.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**Ajouté dans: v9.0.0**

**Supprimé dans: v15.0.0**

Un encodage de fichier invalide ou inconnu a été passé.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**Ajouté dans: v8.5.0**

**Supprimé dans: v16.7.0**

Lors de l'utilisation de l'API Performance Timing (`perf_hooks`), une marque de performance est invalide.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Une `DOMException` est levée à la place. |
| v21.0.0 | Supprimé dans: v21.0.0 |
:::

Un objet de transfert invalide a été passé à `postMessage()`.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**Supprimé dans: v22.2.0**

Une tentative a été faite pour charger une ressource, mais la ressource ne correspond pas à l'intégrité définie par le manifeste de politique. Consultez la documentation des manifestes de politique pour plus d'informations.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**Supprimé dans: v22.2.0**

Une tentative a été faite pour charger une ressource, mais la ressource n'était pas répertoriée comme une dépendance de l'endroit qui a tenté de la charger. Consultez la documentation des manifestes de politique pour plus d'informations.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**Supprimé dans: v22.2.0**

Une tentative a été faite pour charger un manifeste de politique, mais le manifeste comportait plusieurs entrées pour une ressource qui ne correspondaient pas entre elles. Mettez à jour les entrées du manifeste pour qu'elles correspondent afin de résoudre cette erreur. Consultez la documentation des manifestes de politique pour plus d'informations.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**Supprimé dans: v22.2.0**

Une ressource de manifeste de politique avait une valeur invalide pour l'un de ses champs. Mettez à jour l'entrée du manifeste pour qu'elle corresponde afin de résoudre cette erreur. Consultez la documentation des manifestes de politique pour plus d'informations.


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**Supprimé dans: v22.2.0**

Une ressource de manifeste de politique avait une valeur non valide pour l'un de ses mappages de dépendances. Mettez à jour l'entrée du manifeste pour correspondre afin de résoudre cette erreur. Consultez la documentation des manifestes de politique pour plus d'informations.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**Supprimé dans: v22.2.0**

Une tentative a été faite pour charger un manifeste de politique, mais le manifeste n'a pas pu être analysé. Consultez la documentation des manifestes de politique pour plus d'informations.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**Supprimé dans: v22.2.0**

Une tentative a été faite pour lire à partir d'un manifeste de politique, mais l'initialisation du manifeste n'a pas encore eu lieu. Il s'agit probablement d'un bug dans Node.js.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**Supprimé dans: v22.2.0**

Un manifeste de politique a été chargé, mais avait une valeur inconnue pour son comportement "onerror". Consultez la documentation des manifestes de politique pour plus d'informations.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**Supprimé dans: v15.0.0**

Ce code d'erreur a été remplacé par [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/fr/nodejs/api/errors#err_missing_transferable_in_transfer_list) dans Node.js v15.0.0, car il n'est plus précis étant donné qu'il existe désormais d'autres types d'objets transférables.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Une `DOMException` est lancée à la place. |
| v21.0.0 | Supprimé dans: v21.0.0 |
| v15.0.0 | Ajouté dans: v15.0.0 |
:::

Un objet qui doit être explicitement listé dans l'argument `transferList` se trouve dans l'objet passé à un appel [`postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist), mais n'est pas fourni dans le `transferList` pour cet appel. Généralement, il s'agit d'un `MessagePort`.

Dans les versions de Node.js antérieures à v15.0.0, le code d'erreur utilisé ici était [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/fr/nodejs/api/errors#err_missing_message_port_in_transfer_list). Cependant, l'ensemble des types d'objets transférables a été élargi pour couvrir plus de types que `MessagePort`.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**Ajouté dans: v9.0.0**

**Supprimé dans: v10.0.0**

Utilisé par la `Node-API` lorsque `Constructor.prototype` n'est pas un objet.


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Ajouté dans : v10.6.0, v8.16.0**

**Supprimé dans : v14.2.0, v12.17.0**

Sur le thread principal, les valeurs sont supprimées de la file d'attente associée à la fonction thread-safe dans une boucle d'inactivité. Cette erreur indique qu'une erreur s'est produite lors de la tentative de démarrage de la boucle.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Ajouté dans : v10.6.0, v8.16.0**

**Supprimé dans : v14.2.0, v12.17.0**

Une fois qu'il ne reste plus d'éléments dans la file d'attente, la boucle d'inactivité doit être suspendue. Cette erreur indique que la boucle d'inactivité n'a pas pu s'arrêter.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

Une API Node.js a été appelée d'une manière non prise en charge, telle que `Buffer.write(string, encoding, offset[, length])`.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé de manière générique pour identifier qu'une opération a causé une condition de mémoire insuffisante.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Le module `node:repl` n'a pas pu analyser les données du fichier d'historique REPL.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Ajouté dans : v9.0.0**

**Supprimé dans : v14.0.0**

Les données n'ont pas pu être envoyées sur un socket.

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.12.0 | Plutôt que d'émettre une erreur, `process.stderr.end()` ferme maintenant uniquement le côté du flux mais pas la ressource sous-jacente, ce qui rend cette erreur obsolète. |
| v10.12.0 | Supprimé dans : v10.12.0 |
:::

Une tentative a été faite pour fermer le flux `process.stderr`. De par sa conception, Node.js ne permet pas aux flux `stdout` ou `stderr` d'être fermés par le code utilisateur.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.12.0 | Plutôt que d'émettre une erreur, `process.stderr.end()` ferme maintenant uniquement le côté du flux mais pas la ressource sous-jacente, ce qui rend cette erreur obsolète. |
| v10.12.0 | Supprimé dans : v10.12.0 |
:::

Une tentative a été faite pour fermer le flux `process.stdout`. De par sa conception, Node.js ne permet pas aux flux `stdout` ou `stderr` d'être fermés par le code utilisateur.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'une tentative est faite d'utiliser un flux lisible qui n'a pas implémenté [`readable._read()`](/fr/nodejs/api/stream#readable_readsize).


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'une requête de renégociation TLS a échoué de manière non spécifique.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**Ajouté dans : v10.5.0**

**Supprimé dans : v14.0.0**

Un `SharedArrayBuffer` dont la mémoire n'est pas gérée par le moteur JavaScript ou par Node.js a été rencontré lors de la sérialisation. Un tel `SharedArrayBuffer` ne peut pas être sérialisé.

Cela ne peut se produire que lorsque des modules complémentaires natifs créent des `SharedArrayBuffer` en mode "externalisé", ou mettent des `SharedArrayBuffer` existants en mode externalisé.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**Ajouté dans : v8.0.0**

**Supprimé dans : v11.7.0**

Une tentative a été faite pour lancer un processus Node.js avec un type de fichier `stdin` inconnu. Cette erreur est généralement une indication d'un bug dans Node.js lui-même, bien qu'il soit possible que le code utilisateur la déclenche.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**Ajouté dans : v8.0.0**

**Supprimé dans : v11.7.0**

Une tentative a été faite pour lancer un processus Node.js avec un type de fichier `stdout` ou `stderr` inconnu. Cette erreur est généralement une indication d'un bug dans Node.js lui-même, bien qu'il soit possible que le code utilisateur la déclenche.

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

L'API V8 `BreakIterator` a été utilisée mais l'ensemble complet de données ICU n'est pas installé.

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'une valeur donnée est hors de la plage acceptée.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**Ajouté dans : v10.0.0**

**Supprimé dans : v18.1.0, v16.17.0**

La fonction de linker a retourné un module pour lequel la liaison a échoué.

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

Le module doit être lié avec succès avant l'instanciation.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**Ajouté dans : v11.0.0**

**Supprimé dans : v16.9.0**

Le nom de chemin utilisé pour le script principal d'un worker a une extension de fichier inconnue.

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**Ajouté dans : v9.0.0**

**Supprimé dans : v10.0.0**

Utilisé lorsqu'une tentative est faite d'utiliser un objet `zlib` après qu'il a déjà été fermé.


## Codes d'erreur OpenSSL {#openssl-error-codes}

### Erreurs de validité temporelle {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

Le certificat n'est pas encore valide : la date notBefore est postérieure à l'heure actuelle.

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

Le certificat a expiré : la date notAfter est antérieure à l'heure actuelle.

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

La liste de révocation de certificats (CRL) a une date de publication future.

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

La liste de révocation de certificats (CRL) a expiré.

#### `CERT_REVOKED` {#cert_revoked}

Le certificat a été révoqué ; il figure sur une liste de révocation de certificats (CRL).

### Erreurs liées à la confiance ou à la chaîne {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

Le certificat de l'émetteur d'un certificat recherché n'a pas pu être trouvé. Cela signifie normalement que la liste des certificats de confiance n'est pas complète.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

L'émetteur du certificat est inconnu. C'est le cas si l'émetteur n'est pas inclus dans la liste des certificats de confiance.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

Le certificat transmis est auto-signé et le même certificat n'a pas pu être trouvé dans la liste des certificats de confiance.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

L'émetteur du certificat est inconnu. C'est le cas si l'émetteur n'est pas inclus dans la liste des certificats de confiance.

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

La longueur de la chaîne de certificats est supérieure à la profondeur maximale.

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

La CRL référencée par le certificat n'a pas pu être trouvée.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

Aucune signature n'a pu être vérifiée car la chaîne ne contient qu'un seul certificat et il n'est pas auto-signé.

#### `CERT_UNTRUSTED` {#cert_untrusted}

L'autorité de certification (CA) racine n'est pas marquée comme approuvée pour l'usage spécifié.

### Erreurs d'extension de base {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

Un certificat CA est invalide. Soit ce n'est pas une CA, soit ses extensions ne sont pas compatibles avec l'usage fourni.

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

Le paramètre pathlength basicConstraints a été dépassé.

### Erreurs liées au nom {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

Le certificat ne correspond pas au nom fourni.

### Erreurs d'usage et de politique {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

Le certificat fourni ne peut pas être utilisé aux fins spécifiées.

#### `CERT_REJECTED` {#cert_rejected}

L'autorité de certification racine est marquée pour rejeter l'objectif spécifié.

### Erreurs de formatage {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

La signature du certificat n'est pas valide.

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

La signature de la liste de révocation de certificats (CRL) n'est pas valide.

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

Le champ notBefore du certificat contient une heure non valide.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

Le champ notAfter du certificat contient une heure non valide.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

Le champ lastUpdate de la CRL contient une heure non valide.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

Le champ nextUpdate de la CRL contient une heure non valide.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

La signature du certificat n'a pas pu être déchiffrée. Cela signifie que la valeur réelle de la signature n'a pas pu être déterminée, plutôt que de ne pas correspondre à la valeur attendue ; ceci n'est significatif que pour les clés RSA.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

La signature de la liste de révocation de certificats (CRL) n'a pas pu être déchiffrée : cela signifie que la valeur réelle de la signature n'a pas pu être déterminée, plutôt que de ne pas correspondre à la valeur attendue.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

La clé publique dans le SubjectPublicKeyInfo du certificat n'a pas pu être lue.

### Autres erreurs OpenSSL {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

Une erreur s'est produite lors de la tentative d'allocation de mémoire. Cela ne devrait jamais arriver.

