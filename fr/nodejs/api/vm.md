---
title: Documentation du module VM de Node.js
description: Le module VM (Machine Virtuelle) de Node.js fournit des API pour compiler et exécuter du code dans des contextes de moteur JavaScript V8. Il permet de créer des environnements JavaScript isolés, de sandboxer l'exécution du code et de gérer les contextes de script.
head:
  - - meta
    - name: og:title
      content: Documentation du module VM de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module VM (Machine Virtuelle) de Node.js fournit des API pour compiler et exécuter du code dans des contextes de moteur JavaScript V8. Il permet de créer des environnements JavaScript isolés, de sandboxer l'exécution du code et de gérer les contextes de script.
  - - meta
    - name: twitter:title
      content: Documentation du module VM de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module VM (Machine Virtuelle) de Node.js fournit des API pour compiler et exécuter du code dans des contextes de moteur JavaScript V8. Il permet de créer des environnements JavaScript isolés, de sandboxer l'exécution du code et de gérer les contextes de script.
---


# VM (exécution de JavaScript) {#vm-executing-javascript}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

Le module `node:vm` permet de compiler et d'exécuter du code dans des contextes de machine virtuelle V8.

**Le module <code>node:vm</code> n'est pas un mécanisme de sécurité. Ne l'utilisez pas pour exécuter du code non fiable.**

Le code JavaScript peut être compilé et exécuté immédiatement ou compilé, enregistré et exécuté ultérieurement.

Un cas d'utilisation courant est d'exécuter le code dans un contexte V8 différent. Cela signifie que le code invoqué a un objet global différent du code invoquant.

On peut fournir le contexte en [*contextualisant*](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) un objet. Le code invoqué traite toute propriété du contexte comme une variable globale. Toute modification des variables globales causée par le code invoqué est reflétée dans l'objet contexte.

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // Contextualiser l'objet.

const code = 'x += 40; var y = 17;';
// `x` et `y` sont des variables globales dans le contexte.
// Initialement, x a la valeur 2 car c'est la valeur de context.x.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y n'est pas défini.
```
## Classe: `vm.Script` {#class-vmscript}

**Ajoutée dans : v0.3.1**

Les instances de la classe `vm.Script` contiennent des scripts précompilés qui peuvent être exécutés dans des contextes spécifiques.

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.7.0, v20.12.0 | Ajout de la prise en charge de `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Ajout de la prise en charge des attributs d'importation au paramètre `importModuleDynamically`. |
| v10.6.0 | `produceCachedData` est obsolète et remplacée par `script.createCachedData()`. |
| v5.7.0 | Les options `cachedData` et `produceCachedData` sont désormais prises en charge. |
| v0.3.1 | Ajoutée dans : v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code JavaScript à compiler.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie le nom de fichier utilisé dans les traces de pile produites par ce script. **Par défaut :** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de colonne de la première ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `cachedData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fournit un `Buffer` ou `TypedArray`, ou `DataView` facultatif avec les données du cache de code de V8 pour la source fournie. Lorsqu'il est fourni, la valeur `cachedDataRejected` sera définie sur `true` ou `false` selon l'acceptation des données par V8.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est `true` et qu'aucune `cachedData` n'est présente, V8 tentera de produire des données de cache de code pour `code`. En cas de succès, un `Buffer` avec les données du cache de code de V8 sera produit et stocké dans la propriété `cachedData` de l'instance `vm.Script` renvoyée. La valeur `cachedDataProduced` sera définie sur `true` ou `false` selon que les données du cache de code sont produites avec succès ou non. Cette option est **obsolète** en faveur de `script.createCachedData()`. **Par défaut :** `false`.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/fr/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilisé pour spécifier comment les modules doivent être chargés pendant l'évaluation de ce script lorsque `import()` est appelé. Cette option fait partie de l'API des modules expérimentaux. Nous ne recommandons pas de l'utiliser dans un environnement de production. Pour des informations détaillées, voir [Prise en charge de `import()` dynamique dans les API de compilation](/fr/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 

Si `options` est une chaîne de caractères, elle spécifie alors le nom de fichier.

La création d'un nouvel objet `vm.Script` compile `code` mais ne l'exécute pas. Le `vm.Script` compilé peut être exécuté plusieurs fois ultérieurement. Le `code` n'est lié à aucun objet global ; il est plutôt lié avant chaque exécution, juste pour cette exécution.


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**Ajouté dans : v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Lorsque `cachedData` est fourni pour créer le `vm.Script`, cette valeur sera définie sur `true` ou `false` selon l'acceptation des données par V8. Sinon, la valeur est `undefined`.

### `script.createCachedData()` {#scriptcreatecacheddata}

**Ajouté dans : v10.6.0**

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Crée un cache de code qui peut être utilisé avec l'option `cachedData` du constructeur `Script`. Retourne un `Buffer`. Cette méthode peut être appelée à tout moment et un nombre quelconque de fois.

Le cache de code du `Script` ne contient aucun état observable par JavaScript. Le cache de code peut être enregistré en toute sécurité avec le code source du script et utilisé pour construire de nouvelles instances de `Script` à plusieurs reprises.

Les fonctions du code source du `Script` peuvent être marquées comme étant compilées paresseusement et elles ne sont pas compilées lors de la construction du `Script`. Ces fonctions seront compilées lorsqu'elles seront invoquées pour la première fois. Le cache de code sérialise les métadonnées que V8 connaît actuellement sur le `Script` qu'il peut utiliser pour accélérer les compilations futures.

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// Dans `cacheWithoutAdd`, la fonction `add()` est marquée pour une compilation complète
// lors de l'invocation.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd` contient la fonction `add()` entièrement compilée.
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.3.0 | L'option `breakOnSigint` est désormais prise en charge. |
| v0.3.1 | Ajouté dans : v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet [contextualisé](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) tel que renvoyé par la méthode `vm.createContext()`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, si une [`Error`](/fr/nodejs/api/errors#class-error) se produit lors de la compilation du `code`, la ligne de code à l'origine de l'erreur est attachée à la trace de la pile. **Par défaut :** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de millisecondes pendant lesquelles `code` doit être exécuté avant d'interrompre l'exécution. Si l'exécution est interrompue, une [`Error`](/fr/nodejs/api/errors#class-error) sera levée. Cette valeur doit être un entier strictement positif.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la réception de `SIGINT` (+) interrompra l'exécution et lèvera une [`Error`](/fr/nodejs/api/errors#class-error). Les gestionnaires existants pour l'événement qui ont été attachés via `process.on('SIGINT')` sont désactivés pendant l'exécution du script, mais continuent de fonctionner après cela. **Par défaut :** `false`.


- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) le résultat de la toute dernière instruction exécutée dans le script.

Exécute le code compilé contenu dans l'objet `vm.Script` dans le `contextifiedObject` donné et retourne le résultat. L'exécution du code n'a pas accès à la portée locale.

L'exemple suivant compile le code qui incrémente une variable globale, définit la valeur d'une autre variable globale, puis exécute le code plusieurs fois. Les globales sont contenues dans l'objet `context`.

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// Affiche : { animal: 'cat', count: 12, name: 'kitty' }
```
L'utilisation des options `timeout` ou `breakOnSigint` entraînera le démarrage de nouvelles boucles d'événements et de threads correspondants, ce qui entraînera une surcharge de performance non nulle.


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [Historique]
| Version | Modifications |
|---|---|
| v22.8.0, v20.18.0 | L'argument `contextObject` accepte désormais `vm.constants.DONT_CONTEXTIFY`. |
| v14.6.0 | L'option `microtaskMode` est désormais prise en charge. |
| v10.0.0 | L'option `contextCodeGeneration` est désormais prise en charge. |
| v6.3.0 | L'option `breakOnSigint` est désormais prise en charge. |
| v0.3.1 | Ajoutée dans : v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/fr/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Soit [`vm.constants.DONT_CONTEXTIFY`](/fr/nodejs/api/vm#vmconstantsdont_contextify), soit un objet qui sera [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Si `undefined`, un objet contextifié vide sera créé pour assurer la rétrocompatibilité.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, si une [`Error`](/fr/nodejs/api/errors#class-error) se produit lors de la compilation du `code`, la ligne de code à l'origine de l'erreur est jointe à la trace de la pile. **Par défaut :** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de millisecondes pendant lesquelles le `code` doit être exécuté avant d'être interrompu. Si l'exécution est interrompue, une [`Error`](/fr/nodejs/api/errors#class-error) sera levée. Cette valeur doit être un entier strictement positif.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la réception de `SIGINT` (+) interrompra l'exécution et lèvera une [`Error`](/fr/nodejs/api/errors#class-error). Les gestionnaires existants pour l'événement qui ont été attachés via `process.on('SIGINT')` sont désactivés pendant l'exécution du script, mais continuent de fonctionner après cela. **Par défaut :** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom lisible du contexte nouvellement créé. **Par défaut :** `'VM Context i'`, où `i` est un index numérique ascendant du contexte créé.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origine](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondant au contexte nouvellement créé à des fins d'affichage. L'origine doit être formatée comme une URL, mais avec uniquement le schéma, l'hôte et le port (si nécessaire), comme la valeur de la propriété [`url.origin`](/fr/nodejs/api/url#urlorigin) d'un objet [`URL`](/fr/nodejs/api/url#class-url). Plus précisément, cette chaîne doit omettre la barre oblique finale, car elle indique un chemin. **Par défaut :** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est false, tout appel à `eval` ou aux constructeurs de fonctions (`Function`, `GeneratorFunction`, etc.) lèvera une `EvalError`. **Par défaut :** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est false, toute tentative de compilation d'un module WebAssembly lèvera une `WebAssembly.CompileError`. **Par défaut :** `true`.

    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si la valeur est `afterEvaluate`, les microtâches (tâches planifiées via des `Promise`s et des `async function`s) seront exécutées immédiatement après l'exécution du script. Elles sont incluses dans les portées `timeout` et `breakOnSigint` dans ce cas.


- Retour : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) le résultat de la toute dernière instruction exécutée dans le script.

Cette méthode est un raccourci vers `script.runInContext(vm.createContext(options), options)`. Elle effectue plusieurs opérations à la fois :

L'exemple suivant compile du code qui définit une variable globale, puis exécute le code plusieurs fois dans différents contextes. Les variables globales sont définies et contenues dans chaque `contexte` individuel.

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Affiche : [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// Ceci lèverait une erreur si le contexte est créé à partir d'un objet contextifié.
// vm.constants.DONT_CONTEXTIFY permet de créer des contextes avec des
// objets globaux ordinaires qui peuvent être gelés.
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.3.0 | L'option `breakOnSigint` est désormais prise en charge. |
| v0.3.1 | Ajoutée dans : v0.3.1 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, si une [`Error`](/fr/nodejs/api/errors#class-error) se produit lors de la compilation du `code`, la ligne de code à l'origine de l'erreur est attachée à la trace de la pile. **Par défaut :** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de millisecondes pendant lesquelles le `code` doit être exécuté avant d'interrompre l'exécution. Si l'exécution est interrompue, une [`Error`](/fr/nodejs/api/errors#class-error) sera levée. Cette valeur doit être un entier strictement positif.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la réception de `SIGINT` (+) mettra fin à l'exécution et lèvera une [`Error`](/fr/nodejs/api/errors#class-error). Les gestionnaires existants pour l'événement qui ont été attachés via `process.on('SIGINT')` sont désactivés pendant l'exécution du script, mais continuent de fonctionner après cela. **Par défaut :** `false`.


- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) le résultat de la toute dernière instruction exécutée dans le script.

Exécute le code compilé contenu dans le `vm.Script` dans le contexte de l'objet `global` courant. L'exécution du code n'a pas accès à la portée locale, mais a *bien* accès à l'objet `global` courant.

L'exemple suivant compile du code qui incrémente une variable `global`, puis exécute ce code plusieurs fois :

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**Ajouté dans : v19.1.0, v18.13.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Lorsque le script est compilé à partir d'une source qui contient un commentaire magique de carte source, cette propriété est définie sur l'URL de la carte source.

::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## Classe : `vm.Module` {#class-vmmodule}

**Ajouté dans : v13.0.0, v12.16.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Cette fonctionnalité n'est disponible qu'avec l'indicateur de commande `--experimental-vm-modules` activé.

La classe `vm.Module` fournit une interface de bas niveau pour l'utilisation des modules ECMAScript dans les contextes de VM. C'est l'homologue de la classe `vm.Script` qui reflète fidèlement les [Enregistrements de module](https://262.ecma-international.org/14.0/#sec-abstract-module-records) tels que définis dans la spécification ECMAScript.

Contrairement à `vm.Script`, cependant, chaque objet `vm.Module` est lié à un contexte dès sa création. Les opérations sur les objets `vm.Module` sont intrinsèquement asynchrones, contrairement à la nature synchrone des objets `vm.Script`. L'utilisation de fonctions « async » peut faciliter la manipulation des objets `vm.Module`.

L'utilisation d'un objet `vm.Module` nécessite trois étapes distinctes : création/analyse, liaison et évaluation. Ces trois étapes sont illustrées dans l'exemple suivant.

Cette implémentation se situe à un niveau inférieur à celui du [chargeur de module ECMAScript](/fr/nodejs/api/esm#modules-ecmascript-modules). Il n'y a pas non plus de moyen d'interagir avec le chargeur pour le moment, bien qu'une prise en charge soit prévue.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// Step 1
//
// Create a Module by constructing a new `vm.SourceTextModule` object. This
// parses the provided source text, throwing a `SyntaxError` if anything goes
// wrong. By default, a Module is created in the top context. But here, we
// specify `contextifiedObject` as the context this Module belongs to.
//
// Here, we attempt to obtain the default export from the module "foo", and
// put it into local binding "secret".

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// Step 2
//
// "Link" the imported dependencies of this Module to it.
//
// The provided linking callback (the "linker") accepts two arguments: the
// parent module (`bar` in this case) and the string that is the specifier of
// the imported module. The callback is expected to return a Module that
// corresponds to the provided specifier, with certain requirements documented
// in `module.link()`.
//
// If linking has not started for the returned Module, the same linker
// callback will be called on the returned Module.
//
// Even top-level Modules without dependencies must be explicitly linked. The
// callback provided would never be called, however.
//
// The link() method returns a Promise that will be resolved when all the
// Promises returned by the linker resolve.
//
// Note: This is a contrived example in that the linker function creates a new
// "foo" module every time it is called. In a full-fledged module system, a
// cache would probably be used to avoid duplicated modules.

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // The "secret" variable refers to the global variable we added to
      // "contextifiedObject" when creating the context.
      export default secret;
    `, { context: referencingModule.context });

    // Using `contextifiedObject` instead of `referencingModule.context`
    // here would work as well.
  }
  throw new Error(`Unable to resolve dependency: ${specifier}`);
}
await bar.link(linker);

// Step 3
//
// Evaluate the Module. The evaluate() method returns a promise which will
// resolve after the module has finished evaluating.

// Prints 42.
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // Step 1
  //
  // Create a Module by constructing a new `vm.SourceTextModule` object. This
  // parses the provided source text, throwing a `SyntaxError` if anything goes
  // wrong. By default, a Module is created in the top context. But here, we
  // specify `contextifiedObject` as the context this Module belongs to.
  //
  // Here, we attempt to obtain the default export from the module "foo", and
  // put it into local binding "secret".

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // Step 2
  //
  // "Link" the imported dependencies of this Module to it.
  //
  // The provided linking callback (the "linker") accepts two arguments: the
  // parent module (`bar` in this case) and the string that is the specifier of
  // the imported module. The callback is expected to return a Module that
  // corresponds to the provided specifier, with certain requirements documented
  // in `module.link()`.
  //
  // If linking has not started for the returned Module, the same linker
  // callback will be called on the returned Module.
  //
  // Even top-level Modules without dependencies must be explicitly linked. The
  // callback provided would never be called, however.
  //
  // The link() method returns a Promise that will be resolved when all the
  // Promises returned by the linker resolve.
  //
  // Note: This is a contrived example in that the linker function creates a new
  // "foo" module every time it is called. In a full-fledged module system, a
  // cache would probably be used to avoid duplicated modules.

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // The "secret" variable refers to the global variable we added to
        // "contextifiedObject" when creating the context.
        export default secret;
      `, { context: referencingModule.context });

      // Using `contextifiedObject` instead of `referencingModule.context`
      // here would work as well.
    }
    throw new Error(`Unable to resolve dependency: ${specifier}`);
  }
  await bar.link(linker);

  // Step 3
  //
  // Evaluate the Module. The evaluate() method returns a promise which will
  // resolve after the module has finished evaluating.

  // Prints 42.
  await bar.evaluate();
})();
```
:::


### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Les spécificateurs de toutes les dépendances de ce module. Le tableau renvoyé est gelé pour interdire toute modification.

Correspond au champ `[[RequestedModules]]` des [enregistrements de modules cycliques](https://tc39.es/ecma262/#sec-cyclic-module-records) dans la spécification ECMAScript.

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Si le `module.status` est `'errored'`, cette propriété contient l'exception levée par le module lors de l'évaluation. Si le statut est autre, l'accès à cette propriété entraînera une exception levée.

La valeur `undefined` ne peut pas être utilisée dans les cas où il n'y a pas d'exception levée en raison d'une possible ambiguïté avec `throw undefined;`.

Correspond au champ `[[EvaluationError]]` des [enregistrements de modules cycliques](https://tc39.es/ecma262/#sec-cyclic-module-records) dans la spécification ECMAScript.

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de millisecondes pour évaluer avant de mettre fin à l'exécution. Si l'exécution est interrompue, une [`Error`](/fr/nodejs/api/errors#class-error) sera levée. Cette valeur doit être un entier strictement positif.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la réception de `SIGINT` (+) mettra fin à l'exécution et lèvera une [`Error`](/fr/nodejs/api/errors#class-error). Les gestionnaires existants pour l'événement qui ont été attachés via `process.on('SIGINT')` sont désactivés pendant l'exécution du script, mais continuent de fonctionner après cela. **Par défaut :** `false`.


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Évaluer le module.

Cela doit être appelé après que le module a été lié ; sinon, il sera rejeté. Il pourrait également être appelé lorsque le module a déjà été évalué, auquel cas, soit il ne fera rien si l'évaluation initiale s'est terminée avec succès (`module.status` est `'evaluated'`), soit il relancera l'exception qui a résulté de l'évaluation initiale (`module.status` est `'errored'`).

Cette méthode ne peut pas être appelée pendant que le module est en cours d'évaluation (`module.status` est `'evaluating'`).

Correspond au champ [méthode concrète Evaluate()](https://tc39.es/ecma262/#sec-moduleevaluation) des [enregistrements de modules cycliques](https://tc39.es/ecma262/#sec-cyclic-module-records) dans la spécification ECMAScript.


### `module.identifier` {#moduleidentifier}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'identifiant du module courant, tel que défini dans le constructeur.

### `module.link(linker)` {#modulelinklinker}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | L'option `extra.assert` est renommée en `extra.attributes`. L'ancien nom est toujours fourni pour assurer la rétrocompatibilité. |
:::

- `linker` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    -  `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le spécificateur du module demandé :
    -  `referencingModule` [\<vm.Module\>](/fr/nodejs/api/vm#class-vmmodule) L'objet `Module` sur lequel `link()` est appelé.
    -  `extra` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `attributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Les données de l'attribut : Conformément à la norme ECMA-262, les hôtes doivent déclencher une erreur si un attribut non pris en charge est présent.
    - `assert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Alias pour `extra.attributes`.


    -  Renvoie : [\<vm.Module\>](/fr/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)


- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Lie les dépendances du module. Cette méthode doit être appelée avant l'évaluation et ne peut être appelée qu'une seule fois par module.

La fonction doit renvoyer un objet `Module` ou une `Promise` qui finit par se résoudre en un objet `Module`. Le `Module` renvoyé doit satisfaire aux deux invariants suivants :

- Il doit appartenir au même contexte que le `Module` parent.
- Son `status` ne doit pas être `'errored'`.

Si le `status` du `Module` renvoyé est `'unlinked'`, cette méthode sera appelée de manière récursive sur le `Module` renvoyé avec la même fonction `linker` fournie.

`link()` renvoie une `Promise` qui sera soit résolue lorsque toutes les instances de liaison se résoudront en un `Module` valide, soit rejetée si la fonction de liaison lève une exception ou renvoie un `Module` non valide.

La fonction de liaison correspond approximativement à l'opération abstraite [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) définie par l'implémentation dans la spécification ECMAScript, avec quelques différences essentielles :

- La fonction de liaison est autorisée à être asynchrone tandis que [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) est synchrone.

L'implémentation réelle de [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) utilisée pendant la liaison du module est celle qui renvoie les modules liés pendant la liaison. Étant donné qu'à ce stade, tous les modules auraient déjà été entièrement liés, l'implémentation de [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) est entièrement synchrone conformément à la spécification.

Correspond au champ [Link() concrete method](https://tc39.es/ecma262/#sec-moduledeclarationlinking) des [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) dans la spécification ECMAScript.


### `module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'objet d'espace de noms du module. Il n'est disponible qu'une fois la liaison (`module.link()`) terminée.

Correspond à l'opération abstraite [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) dans la spécification ECMAScript.

### `module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'état actuel du module. Il prendra l'une des valeurs suivantes :

-  `'unlinked'` : `module.link()` n'a pas encore été appelé.
-  `'linking'` : `module.link()` a été appelé, mais toutes les Promises renvoyées par la fonction de liaison n'ont pas encore été résolues.
-  `'linked'` : Le module a été lié avec succès, et toutes ses dépendances sont liées, mais `module.evaluate()` n'a pas encore été appelé.
-  `'evaluating'` : Le module est en cours d'évaluation par le biais d'un `module.evaluate()` sur lui-même ou sur un module parent.
-  `'evaluated'` : Le module a été évalué avec succès.
-  `'errored'` : Le module a été évalué, mais une exception a été levée.

Hormis `'errored'`, cette chaîne d'état correspond au champ `[[Status]]` du [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records) de la spécification. `'errored'` correspond à `'evaluated'` dans la spécification, mais avec `[[EvaluationError]]` défini sur une valeur qui n'est pas `undefined`.

## Classe : `vm.SourceTextModule` {#class-vmsourcetextmodule}

**Ajouté dans : v9.6.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Cette fonctionnalité n'est disponible qu'avec l'option de ligne de commande `--experimental-vm-modules` activée.

- Étend : [\<vm.Module\>](/fr/nodejs/api/vm#class-vmmodule)

La classe `vm.SourceTextModule` fournit l'[enregistrement de module de texte source](https://tc39.es/ecma262/#sec-source-text-module-records) tel que défini dans la spécification ECMAScript.

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.0.0, v16.12.0 | Ajout du support des attributs d'importation au paramètre `importModuleDynamically`. |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Code JavaScript du module à analyser
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chaîne utilisée dans les traces de pile. **Par défaut :** `'vm:module(i)'` où `i` est un index ascendant spécifique au contexte.
    - `cachedData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fournit un `Buffer` ou un `TypedArray` ou `DataView` facultatif avec les données du cache de code V8 pour la source fournie. Le `code` doit être le même que le module à partir duquel ce `cachedData` a été créé.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) tel que renvoyé par la méthode `vm.createContext()`, pour compiler et évaluer ce `Module` dans. Si aucun contexte n'est spécifié, le module est évalué dans le contexte d'exécution actuel.
    - `lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de ligne qui est affiché dans les traces de pile produites par ce `Module`. **Par défaut :** `0`.
    - `columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de colonne de la première ligne qui est affiché dans les traces de pile produites par ce `Module`. **Par défaut :** `0`.
    - `initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée lors de l'évaluation de ce `Module` pour initialiser le `import.meta`.
    - `meta` [\<import.meta\>](/fr/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/fr/nodejs/api/vm#class-vmsourcetextmodule)

    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Utilisé pour spécifier comment les modules doivent être chargés lors de l'évaluation de ce module lorsque `import()` est appelé. Cette option fait partie de l'API des modules expérimentaux. Nous ne recommandons pas de l'utiliser dans un environnement de production. Pour des informations détaillées, voir [Support of dynamic `import()` in compilation APIs](/fr/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

Crée une nouvelle instance de `SourceTextModule`.

Les propriétés affectées à l'objet `import.meta` qui sont des objets peuvent permettre au module d'accéder à des informations en dehors du `contexte` spécifié. Utilisez `vm.runInContext()` pour créer des objets dans un contexte spécifique.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // Note: this object is created in the top context. As such,
      // Object.getPrototypeOf(import.meta.prop) points to the
      // Object.prototype in the top context rather than that in
      // the contextified object.
      meta.prop = {};
    },
  });
// Since module has no dependencies, the linker function will never be called.
await module.link(() => {});
await module.evaluate();

// Now, Object.prototype.secret will be equal to 42.
//
// To fix this problem, replace
//     meta.prop = {};
// above with
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // Note: this object is created in the top context. As such,
        // Object.getPrototypeOf(import.meta.prop) points to the
        // Object.prototype in the top context rather than that in
        // the contextified object.
        meta.prop = {};
      },
    });
  // Since module has no dependencies, the linker function will never be called.
  await module.link(() => {});
  await module.evaluate();
  // Now, Object.prototype.secret will be equal to 42.
  //
  // To fix this problem, replace
  //     meta.prop = {};
  // above with
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**Ajouté dans : v13.7.0, v12.17.0**

- Renvoie : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Crée un cache de code qui peut être utilisé avec l'option `cachedData` du constructeur `SourceTextModule`. Renvoie un `Buffer`. Cette méthode peut être appelée un nombre quelconque de fois avant que le module n'ait été évalué.

Le cache de code de `SourceTextModule` ne contient aucun état observable par JavaScript. Le cache de code peut être enregistré en toute sécurité avec le code source et utilisé pour construire de nouvelles instances de `SourceTextModule` plusieurs fois.

Les fonctions dans la source `SourceTextModule` peuvent être marquées comme étant compilées paresseusement et elles ne sont pas compilées lors de la construction de `SourceTextModule`. Ces fonctions seront compilées lorsqu'elles seront invoquées pour la première fois. Le cache de code sérialise les métadonnées que V8 connaît actuellement sur le `SourceTextModule` qu'il peut utiliser pour accélérer les compilations futures.

```js [ESM]
// Create an initial module
const module = new vm.SourceTextModule('const a = 1;');

// Create cached data from this module
const cachedData = module.createCachedData();

// Create a new module using the cached data. The code must be the same.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## Classe : `vm.SyntheticModule` {#class-vmsyntheticmodule}

**Ajouté dans : v13.0.0, v12.16.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Cette fonctionnalité n'est disponible qu'avec l'indicateur de commande `--experimental-vm-modules` activé.

- Etend : [\<vm.Module\>](/fr/nodejs/api/vm#class-vmmodule)

La classe `vm.SyntheticModule` fournit le [Synthetic Module Record](https://heycam.github.io/webidl/#synthetic-module-records) tel que défini dans la spécification WebIDL. Le but des modules synthétiques est de fournir une interface générique pour exposer des sources non-JavaScript aux graphes de modules ECMAScript.

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// Use `module` in linking...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**Ajouté dans : v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Tableau de noms qui seront exportés depuis le module.
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée lorsque le module est évalué.
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Chaîne utilisée dans les traces de pile. **Par défaut :** `'vm:module(i)'` où `i` est un index ascendant spécifique au contexte.
    - `context` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) tel que renvoyé par la méthode `vm.createContext()` afin de compiler et d'évaluer ce `Module` dans ce contexte.

Crée une nouvelle instance de `SyntheticModule`.

Les objets assignés aux exports de cette instance peuvent permettre aux importateurs du module d'accéder à des informations en dehors du `contexte` spécifié. Utilisez `vm.runInContext()` pour créer des objets dans un contexte spécifique.

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**Ajouté dans : v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Nom de l'export à définir.
- `value` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) La valeur à laquelle définir l'export.

Cette méthode est utilisée après que le module est lié pour définir les valeurs des exports. Si elle est appelée avant que le module ne soit lié, une erreur [`ERR_VM_MODULE_STATUS`](/fr/nodejs/api/errors#err_vm_module_status) sera levée.

::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.7.0, v20.12.0 | Ajout du support de `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v19.6.0, v18.15.0 | La valeur de retour inclut maintenant `cachedDataRejected` avec la même sémantique que la version `vm.Script` si l'option `cachedData` a été passée. |
| v17.0.0, v16.12.0 | Ajout du support des attributs d'importation au paramètre `importModuleDynamically`. |
| v15.9.0 | Ajout de nouveau de l'option `importModuleDynamically`. |
| v14.3.0 | Suppression de `importModuleDynamically` en raison de problèmes de compatibilité. |
| v14.1.0, v13.14.0 | L'option `importModuleDynamically` est maintenant supportée. |
| v10.10.0 | Ajoutée dans : v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le corps de la fonction à compiler.
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tableau de chaînes contenant tous les paramètres de la fonction.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie le nom de fichier utilisé dans les traces de pile produites par ce script. **Par défaut :** `''`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de colonne de la première ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `cachedData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fournit un `Buffer` ou `TypedArray` ou `DataView` optionnel avec les données de cache de code V8 pour la source fournie. Cela doit être produit par un appel antérieur à [`vm.compileFunction()`](/fr/nodejs/api/vm#vmcompilefunctioncode-params-options) avec le même `code` et `params`.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Spécifie s'il faut produire de nouvelles données de cache. **Par défaut :** `false`.
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) dans lequel ladite fonction doit être compilée.
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un tableau contenant une collection d'extensions de contexte (objets enveloppant la portée actuelle) à appliquer lors de la compilation. **Par défaut :** `[]`.

- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/fr/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilisé pour spécifier comment les modules doivent être chargés pendant l'évaluation de cette fonction lorsque `import()` est appelé. Cette option fait partie de l'API de modules expérimentale. Nous ne recommandons pas de l'utiliser dans un environnement de production. Pour des informations détaillées, voir [Support of dynamic `import()` in compilation APIs](/fr/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
- Retourne : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Compile le code donné dans le contexte fourni (si aucun contexte n'est fourni, le contexte actuel est utilisé), et le renvoie enveloppé dans une fonction avec les `params` donnés.


## `vm.constants` {#vmconstants}

**Ajouté dans : v21.7.0, v20.12.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Renvoie un objet contenant des constantes couramment utilisées pour les opérations VM.

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**Ajouté dans : v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Une constante qui peut être utilisée comme option `importModuleDynamically` pour `vm.Script` et `vm.compileFunction()` afin que Node.js utilise le chargeur ESM par défaut du contexte principal pour charger le module demandé.

Pour des informations détaillées, voir [Prise en charge de `import()` dynamique dans les API de compilation](/fr/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.8.0, v20.18.0 | L'argument `contextObject` accepte désormais `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Ajout de la prise en charge de `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v21.2.0, v20.11.0 | L'option `importModuleDynamically` est désormais prise en charge. |
| v14.6.0 | L'option `microtaskMode` est désormais prise en charge. |
| v10.0.0 | Le premier argument ne peut plus être une fonction. |
| v10.0.0 | L'option `codeGeneration` est désormais prise en charge. |
| v0.3.1 | Ajouté dans : v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/fr/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Soit [`vm.constants.DONT_CONTEXTIFY`](/fr/nodejs/api/vm#vmconstantsdont_contextify), soit un objet qui sera [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Si `undefined`, un objet contextifié vide sera créé pour assurer la rétrocompatibilité.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom lisible du contexte nouvellement créé. **Default:** `'VM Context i'`, où `i` est un index numérique ascendant du contexte créé.
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origine](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondant au contexte nouvellement créé à des fins d'affichage. L'origine doit être formatée comme une URL, mais avec uniquement le schéma, l'hôte et le port (si nécessaire), comme la valeur de la propriété [`url.origin`](/fr/nodejs/api/url#urlorigin) d'un objet [`URL`](/fr/nodejs/api/url#class-url). Plus particulièrement, cette chaîne doit omettre la barre oblique de fin, car elle indique un chemin d'accès. **Default:** `''`.
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si elle est définie sur false, tout appel à `eval` ou à des constructeurs de fonctions (`Function`, `GeneratorFunction`, etc.) lèvera une `EvalError`. **Default:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si elle est définie sur false, toute tentative de compilation d'un module WebAssembly lèvera une `WebAssembly.CompileError`. **Default:** `true`.
  
 
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) S'il est défini sur `afterEvaluate`, les microtâches (tâches planifiées via des `Promise` et des `async function`) seront exécutées immédiatement après qu'un script a été exécuté via [`script.runInContext()`](/fr/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). Elles sont incluses dans les portées `timeout` et `breakOnSigint` dans ce cas.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/fr/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilisée pour spécifier comment les modules doivent être chargés lorsque `import()` est appelé dans ce contexte sans script de référence ni module. Cette option fait partie de l'API des modules expérimentaux. Nous ne recommandons pas de l'utiliser dans un environnement de production. Pour des informations détaillées, voir [Prise en charge de `import()` dynamique dans les API de compilation](/fr/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
  
 
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objet contextifié.

Si le `contextObject` donné est un objet, la méthode `vm.createContext()` va [préparer cet objet](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) et renvoyer une référence à celui-ci afin qu'il puisse être utilisé dans les appels à [`vm.runInContext()`](/fr/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) ou [`script.runInContext()`](/fr/nodejs/api/vm#scriptrunincontextcontextifiedobject-options). Dans de tels scripts, l'objet global sera encapsulé par le `contextObject`, conservant toutes ses propriétés existantes, mais ayant également les objets et fonctions intégrés que tout [objet global](https://es5.github.io/#x15.1) standard possède. En dehors des scripts exécutés par le module vm, les variables globales resteront inchangées.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
```
Si `contextObject` est omis (ou passé explicitement comme `undefined`), un nouvel objet [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) vide sera renvoyé.

Lorsque l'objet global dans le contexte nouvellement créé est [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object), il présente certaines particularités par rapport aux objets globaux ordinaires. Par exemple, il ne peut pas être gelé. Pour créer un contexte sans les particularités de la contextification, passez [`vm.constants.DONT_CONTEXTIFY`](/fr/nodejs/api/vm#vmconstantsdont_contextify) comme argument `contextObject`. Consultez la documentation de [`vm.constants.DONT_CONTEXTIFY`](/fr/nodejs/api/vm#vmconstantsdont_contextify) pour plus de détails.

La méthode `vm.createContext()` est principalement utile pour créer un contexte unique qui peut être utilisé pour exécuter plusieurs scripts. Par exemple, si vous émulez un navigateur Web, la méthode peut être utilisée pour créer un contexte unique représentant l'objet global d'une fenêtre, puis exécuter toutes les balises `\<script\>` ensemble dans ce contexte.

Le `name` et l'`origin` fournis du contexte sont rendus visibles via l'API Inspector.


## `vm.isContext(object)` {#vmiscontextobject}

**Ajouté dans : v0.11.7**

- `object` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si l'objet `object` donné a été [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) en utilisant [`vm.createContext()`](/fr/nodejs/api/vm#vmcreatecontextcontextobject-options), ou si c'est l'objet global d'un contexte créé en utilisant [`vm.constants.DONT_CONTEXTIFY`](/fr/nodejs/api/vm#vmconstantsdont_contextify).

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**Ajouté dans : v13.10.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Mesure la mémoire connue de V8 et utilisée par tous les contextes connus de l'isolate V8 actuel, ou le contexte principal.

- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Optionnel.
    - `mode` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Soit `'summary'` ou `'detailed'`. En mode résumé, seule la mémoire mesurée pour le contexte principal sera renvoyée. En mode détaillé, la mémoire mesurée pour tous les contextes connus de l'isolate V8 actuel sera renvoyée. **Par défaut :** `'summary'`
    - `execution` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Soit `'default'` ou `'eager'`. Avec l'exécution par défaut, la promesse ne sera résolue qu'après le démarrage de la prochaine collecte des ordures planifiée, ce qui peut prendre un certain temps (voire jamais si le programme se termine avant le prochain GC). Avec l'exécution anticipée, le GC démarrera immédiatement pour mesurer la mémoire. **Par défaut :** `'default'`


- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Si la mémoire est mesurée avec succès, la promesse se résoudra avec un objet contenant des informations sur l'utilisation de la mémoire. Sinon, elle sera rejetée avec une erreur `ERR_CONTEXT_NOT_INITIALIZED`.

Le format de l'objet avec lequel la Promise retournée peut se résoudre est spécifique au moteur V8 et peut changer d'une version de V8 à l'autre.

Le résultat renvoyé est différent des statistiques renvoyées par `v8.getHeapSpaceStatistics()` en ce sens que `vm.measureMemory()` mesure la mémoire accessible par chaque contexte spécifique de V8 dans l'instance actuelle du moteur V8, tandis que le résultat de `v8.getHeapSpaceStatistics()` mesure la mémoire occupée par chaque espace de tas dans l'instance V8 actuelle.

```js [ESM]
const vm = require('node:vm');
// Mesure la mémoire utilisée par le contexte principal.
vm.measureMemory({ mode: 'summary' })
  // Ceci est identique à vm.measureMemory()
  .then((result) => {
    // Le format actuel est :
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // Référence le contexte ici afin qu'il ne soit pas collecté par le GC
    // jusqu'à ce que la mesure soit terminée.
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.7.0, v20.12.0 | Ajout du support de `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Ajout du support des attributs d'importation au paramètre `importModuleDynamically`. |
| v6.3.0 | L'option `breakOnSigint` est désormais prise en charge. |
| v0.3.1 | Ajoutée dans : v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code JavaScript à compiler et à exécuter.
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) qui sera utilisé comme `global` lorsque le `code` sera compilé et exécuté.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie le nom de fichier utilisé dans les traces de pile produites par ce script. **Par défaut :** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de colonne de la première ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, si une [`Error`](/fr/nodejs/api/errors#class-error) se produit lors de la compilation du `code`, la ligne de code à l'origine de l'erreur est ajoutée à la trace de pile. **Par défaut :** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de millisecondes pendant lesquelles `code` doit être exécuté avant d'être arrêté. Si l'exécution est arrêtée, une [`Error`](/fr/nodejs/api/errors#class-error) sera levée. Cette valeur doit être un entier strictement positif.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la réception de `SIGINT` (+) mettra fin à l'exécution et lèvera une [`Error`](/fr/nodejs/api/errors#class-error). Les gestionnaires existants pour l'événement qui ont été attachés via `process.on('SIGINT')` sont désactivés pendant l'exécution du script, mais continuent de fonctionner après cela. **Par défaut :** `false`.
    - `cachedData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fournit un `Buffer` ou `TypedArray`, ou `DataView` facultatif avec les données du cache de code V8 pour la source fournie.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/fr/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilisé pour spécifier comment les modules doivent être chargés lors de l'évaluation de ce script lorsque `import()` est appelé. Cette option fait partie de l'API des modules expérimentaux. Nous ne recommandons pas de l'utiliser dans un environnement de production. Pour des informations détaillées, voir [Prise en charge de `import()` dynamique dans les API de compilation](/fr/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).

La méthode `vm.runInContext()` compile `code`, l'exécute dans le contexte de `contextifiedObject`, puis renvoie le résultat. Le code en cours d'exécution n'a pas accès à la portée locale. L'objet `contextifiedObject` *doit* avoir été précédemment [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) en utilisant la méthode [`vm.createContext()`](/fr/nodejs/api/vm#vmcreatecontextcontextobject-options).

Si `options` est une chaîne de caractères, elle spécifie alors le nom du fichier.

L'exemple suivant compile et exécute différents scripts en utilisant un seul objet [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) :

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// Prints: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.8.0, v20.18.0 | L'argument `contextObject` accepte désormais `vm.constants.DONT_CONTEXTIFY`. |
| v21.7.0, v20.12.0 | Ajout du support de `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Ajout du support des attributs d'importation au paramètre `importModuleDynamically`. |
| v14.6.0 | L'option `microtaskMode` est désormais prise en charge. |
| v10.0.0 | L'option `contextCodeGeneration` est désormais prise en charge. |
| v6.3.0 | L'option `breakOnSigint` est désormais prise en charge. |
| v0.3.1 | Ajouté dans : v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code JavaScript à compiler et à exécuter.
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/fr/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Soit [`vm.constants.DONT_CONTEXTIFY`](/fr/nodejs/api/vm#vmconstantsdont_contextify), soit un objet qui sera [contextifié](/fr/nodejs/api/vm#what-does-it-mean-to-contextify-an-object). Si `undefined`, un objet contextifié vide sera créé pour assurer la rétrocompatibilité.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie le nom de fichier utilisé dans les traces de pile produites par ce script. **Par défaut :** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de colonne de la première ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est `true`, si une [`Error`](/fr/nodejs/api/errors#class-error) se produit lors de la compilation du `code`, la ligne de code à l'origine de l'erreur est jointe à la trace de pile. **Par défaut :** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de millisecondes pendant lesquelles le `code` doit être exécuté avant d'être arrêté. Si l'exécution est arrêtée, une [`Error`](/fr/nodejs/api/errors#class-error) sera levée. Cette valeur doit être un entier strictement positif.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est `true`, la réception de `SIGINT` (+) mettra fin à l'exécution et lèvera une [`Error`](/fr/nodejs/api/errors#class-error). Les gestionnaires existants pour l'événement qui ont été attachés via `process.on('SIGINT')` sont désactivés pendant l'exécution du script, mais continuent de fonctionner après cela. **Par défaut :** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom lisible par l'homme du contexte nouvellement créé. **Par défaut :** `'VM Context i'`, où `i` est un index numérique ascendant du contexte créé.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [Origine](https://developer.mozilla.org/en-US/docs/Glossary/Origin) correspondant au contexte nouvellement créé à des fins d'affichage. L'origine doit être formatée comme une URL, mais avec uniquement le schéma, l'hôte et le port (si nécessaire), comme la valeur de la propriété [`url.origin`](/fr/nodejs/api/url#urlorigin) d'un objet [`URL`](/fr/nodejs/api/url#class-url). Plus particulièrement, cette chaîne doit omettre la barre oblique finale, car elle désigne un chemin d'accès. **Par défaut :** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur false, tout appel à `eval` ou aux constructeurs de fonctions (`Function`, `GeneratorFunction`, etc.) lèvera une `EvalError`. **Par défaut :** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur false, toute tentative de compilation d'un module WebAssembly lèvera une `WebAssembly.CompileError`. **Par défaut :** `true`.
  
    - `cachedData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fournit un `Buffer` ou `TypedArray` facultatif, ou `DataView` avec les données du cache de code V8 pour la source fournie.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/fr/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilisé pour spécifier comment les modules doivent être chargés lors de l'évaluation de ce script lorsque `import()` est appelé. Cette option fait partie de l'API de modules expérimentaux. Nous ne recommandons pas de l'utiliser dans un environnement de production. Pour des informations détaillées, voir [Support de l'importation dynamique `import()` dans les API de compilation](/fr/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si la valeur est définie sur `afterEvaluate`, les microtâches (tâches planifiées via `Promise`s et `async function`s) seront exécutées immédiatement après l'exécution du script. Elles sont incluses dans les étendues `timeout` et `breakOnSigint` dans ce cas.
  
 
- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) le résultat de la toute dernière instruction exécutée dans le script.

Cette méthode est un raccourci pour `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)`. Si `options` est une chaîne, alors elle spécifie le nom de fichier.

Elle fait plusieurs choses à la fois :

L'exemple suivant compile et exécute du code qui incrémente une variable globale et en définit une nouvelle. Ces variables globales sont contenues dans le `contextObject`.

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// Prints: { animal: 'cat', count: 3, name: 'kitty' }

// This would throw if the context is created from a contextified object.
// vm.constants.DONT_CONTEXTIFY allows creating contexts with ordinary global objects that
// can be frozen.
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.7.0, v20.12.0 | Ajout du support pour `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`. |
| v17.0.0, v16.12.0 | Ajout du support des attributs d'importation au paramètre `importModuleDynamically`. |
| v6.3.0 | L'option `breakOnSigint` est désormais prise en charge. |
| v0.3.1 | Ajouté dans : v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code JavaScript à compiler et à exécuter.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie le nom de fichier utilisé dans les traces de pile produites par ce script. **Par défaut :** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le décalage du numéro de colonne de la première ligne qui est affiché dans les traces de pile produites par ce script. **Par défaut :** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, si une [`Error`](/fr/nodejs/api/errors#class-error) se produit lors de la compilation du `code`, la ligne de code à l'origine de l'erreur est attachée à la trace de pile. **Par défaut :** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de millisecondes pendant lesquelles `code` doit être exécuté avant d'interrompre l'exécution. Si l'exécution est interrompue, une [`Error`](/fr/nodejs/api/errors#class-error) sera levée. Cette valeur doit être un entier strictement positif.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la réception de `SIGINT` (+) mettra fin à l'exécution et lèvera une [`Error`](/fr/nodejs/api/errors#class-error). Les gestionnaires existants pour l'événement qui ont été attachés via `process.on('SIGINT')` sont désactivés pendant l'exécution du script, mais continuent de fonctionner après cela. **Par défaut :** `false`.
    - `cachedData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Fournit un `Buffer` ou `TypedArray` ou `DataView` facultatif avec les données du cache de code V8 pour la source fournie.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/fr/nodejs/api/vm#vmconstantsuse_main_context_default_loader) Utilisé pour spécifier comment les modules doivent être chargés lors de l'évaluation de ce script lorsque `import()` est appelé. Cette option fait partie de l'API des modules expérimentaux. Nous ne recommandons pas de l'utiliser dans un environnement de production. Pour des informations détaillées, voir [Prise en charge de l'importation dynamique `import()` dans les API de compilation](/fr/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis).


- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) le résultat de la toute dernière instruction exécutée dans le script.

`vm.runInThisContext()` compile le `code`, l'exécute dans le contexte du `global` actuel et renvoie le résultat. Le code en cours d'exécution n'a pas accès à la portée locale, mais a accès à l'objet `global` actuel.

Si `options` est une chaîne, elle spécifie le nom de fichier.

L'exemple suivant illustre l'utilisation de `vm.runInThisContext()` et de la fonction JavaScript [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) pour exécuter le même code :

```js [ESM]
const vm = require('node:vm');
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```
Étant donné que `vm.runInThisContext()` n'a pas accès à la portée locale, `localVar` reste inchangé. En revanche, [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) *a* accès à la portée locale, la valeur de `localVar` est donc modifiée. De cette façon, `vm.runInThisContext()` ressemble beaucoup à un [appel `eval()` indirect](https://es5.github.io/#x10.4.2), par exemple `(0,eval)('code')`.


## Exemple : Exécuter un serveur HTTP dans une VM {#example-running-an-http-server-within-a-vm}

Lors de l'utilisation de [`script.runInThisContext()`](/fr/nodejs/api/vm#scriptruninthiscontextoptions) ou de [`vm.runInThisContext()`](/fr/nodejs/api/vm#vmruninthiscontextcode-options), le code est exécuté dans le contexte global V8 actuel. Le code transmis à ce contexte VM aura sa propre portée isolée.

Afin d'exécuter un simple serveur web en utilisant le module `node:http`, le code transmis au contexte doit soit appeler `require('node:http')` lui-même, soit avoir une référence au module `node:http` qui lui est transmise. Par exemple :

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
Le `require()` dans le cas ci-dessus partage l'état avec le contexte duquel il est transmis. Cela peut introduire des risques lorsque du code non fiable est exécuté, par exemple en modifiant des objets dans le contexte de manière indésirable.

## Que signifie "contextifier" un objet ? {#what-does-it-mean-to-"contextify"-an-object?}

Tout le JavaScript exécuté dans Node.js s'exécute dans la portée d'un "contexte". Selon le [Guide de l'intégrateur V8](https://v8.dev/docs/embed#contexts) :

Lorsque la méthode `vm.createContext()` est appelée avec un objet, l'argument `contextObject` sera utilisé pour encapsuler l'objet global d'une nouvelle instance d'un contexte V8 (si `contextObject` est `undefined`, un nouvel objet sera créé à partir du contexte actuel avant sa contextification). Ce contexte V8 fournit au `code` exécuté à l'aide des méthodes du module `node:vm` un environnement global isolé dans lequel il peut fonctionner. Le processus de création du contexte V8 et de son association avec le `contextObject` dans le contexte externe est ce que ce document appelle la "contextification" de l'objet.

La contextification introduirait quelques bizarreries à la valeur `globalThis` dans le contexte. Par exemple, il ne peut pas être gelé, et il n'est pas une référence égale au `contextObject` dans le contexte externe.

```js [ESM]
const vm = require('node:vm');

// Une option `contextObject` indéfinie rend l'objet global contextifié.
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// Un objet global contextifié ne peut pas être gelé.
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
Pour créer un contexte avec un objet global ordinaire et accéder à un proxy global dans le contexte externe avec moins de bizarreries, spécifiez `vm.constants.DONT_CONTEXTIFY` comme argument `contextObject`.


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

Lorsque cette constante est utilisée comme argument `contextObject` dans les API vm, elle indique à Node.js de créer un contexte sans envelopper son objet global avec un autre objet d'une manière spécifique à Node.js. Par conséquent, la valeur `globalThis` à l'intérieur du nouveau contexte se comporterait plus comme une valeur ordinaire.

```js [ESM]
const vm = require('node:vm');

// Utilisez vm.constants.DONT_CONTEXTIFY pour geler l'objet global.
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
Lorsque `vm.constants.DONT_CONTEXTIFY` est utilisé comme argument `contextObject` pour [`vm.createContext()`](/fr/nodejs/api/vm#vmcreatecontextcontextobject-options), l'objet renvoyé est un objet de type proxy vers l'objet global dans le contexte nouvellement créé, avec moins d'excentricités spécifiques à Node.js. Il est de référence égale à la valeur `globalThis` dans le nouveau contexte, peut être modifié de l'extérieur du contexte et peut être utilisé pour accéder directement aux éléments intégrés dans le nouveau contexte.

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// L'objet renvoyé est de référence égale à globalThis dans le nouveau contexte.
console.log(vm.runInContext('globalThis', context) === context);  // true

// Peut être utilisé pour accéder directement aux globales dans le nouveau contexte.
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// Peut être gelé et cela affecte le contexte interne.
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## Interactions de timeout avec les tâches asynchrones et les Promesses {#timeout-interactions-with-asynchronous-tasks-and-promises}

Les `Promise`s et les `async function`s peuvent planifier des tâches exécutées de manière asynchrone par le moteur JavaScript. Par défaut, ces tâches sont exécutées une fois que toutes les fonctions JavaScript de la pile actuelle ont terminé leur exécution. Cela permet d'échapper aux fonctionnalités des options `timeout` et `breakOnSigint`.

Par exemple, le code suivant exécuté par `vm.runInNewContext()` avec un timeout de 5 millisecondes planifie une boucle infinie à exécuter après la résolution d'une promise. La boucle planifiée n'est jamais interrompue par le timeout :

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// Ceci est affiché *avant* 'entering loop' (!)
console.log('done executing');
```
Ceci peut être résolu en passant `microtaskMode: 'afterEvaluate'` au code qui crée le `Context` :

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
Dans ce cas, la microtâche planifiée via `promise.then()` sera exécutée avant de revenir de `vm.runInNewContext()`, et sera interrompue par la fonctionnalité `timeout`. Ceci ne s'applique qu'au code s'exécutant dans un `vm.Context`, donc par exemple, [`vm.runInThisContext()`](/fr/nodejs/api/vm#vmruninthiscontextcode-options) ne prend pas cette option.

Les rappels Promise sont entrés dans la file d'attente de microtâches du contexte dans lequel ils ont été créés. Par exemple, si `() =\> loop()` est remplacé par simplement `loop` dans l'exemple ci-dessus, alors `loop` sera poussé dans la file d'attente de microtâches globale, car c'est une fonction du contexte externe (principal), et sera donc également capable d'échapper au timeout.

Si des fonctions de planification asynchrone telles que `process.nextTick()`, `queueMicrotask()`, `setTimeout()`, `setImmediate()`, etc. sont mises à disposition à l'intérieur d'un `vm.Context`, les fonctions qui leur sont passées seront ajoutées aux files d'attente globales, qui sont partagées par tous les contextes. Par conséquent, les rappels passés à ces fonctions ne sont pas non plus contrôlables via le timeout.


## Prise en charge de `import()` dynamique dans les API de compilation {#support-of-dynamic-import-in-compilation-apis}

Les API suivantes prennent en charge une option `importModuleDynamically` pour activer `import()` dynamique dans le code compilé par le module vm.

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

Cette option fait toujours partie de l'API des modules expérimentaux. Nous ne recommandons pas de l'utiliser dans un environnement de production.

### Lorsque l'option `importModuleDynamically` n'est pas spécifiée ou indéfinie {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

Si cette option n'est pas spécifiée, ou si elle est `undefined`, le code contenant `import()` peut toujours être compilé par les API vm, mais lorsque le code compilé est exécuté et qu'il appelle effectivement `import()`, le résultat sera rejeté avec [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/fr/nodejs/api/errors#err_vm_dynamic_import_callback_missing).

### Lorsque `importModuleDynamically` est `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

Cette option n'est actuellement pas prise en charge pour `vm.SourceTextModule`.

Avec cette option, lorsqu'un `import()` est lancé dans le code compilé, Node.js utiliserait le chargeur ESM par défaut du contexte principal pour charger le module demandé et le renvoyer au code en cours d'exécution.

Cela donne accès aux modules intégrés de Node.js tels que `fs` ou `http` au code en cours de compilation. Si le code est exécuté dans un contexte différent, sachez que les objets créés par les modules chargés à partir du contexte principal proviennent toujours du contexte principal et ne sont pas `instanceof` des classes intégrées dans le nouveau contexte.

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: L'URL chargée depuis le contexte principal n'est pas une instance de la classe Function
// dans le nouveau contexte.
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: L'URL chargée depuis le contexte principal n'est pas une instance de la classe Function
// dans le nouveau contexte.
script.runInNewContext().then(console.log);
```
:::

Cette option permet également au script ou à la fonction de charger des modules utilisateur :

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// Écrit test.js et test.txt dans le répertoire où le script actuel
// en cours d'exécution est situé.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// Compile un script qui charge test.mjs puis test.json
// comme si le script était placé dans le même répertoire.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// Écrit test.js et test.txt dans le répertoire où le script actuel
// en cours d'exécution est situé.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// Compile un script qui charge test.mjs puis test.json
// comme si le script était placé dans le même répertoire.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

Il y a quelques mises en garde concernant le chargement de modules utilisateur à l'aide du chargeur par défaut du contexte principal :


### Quand `importModuleDynamically` est une fonction {#when-importmoduledynamically-is-a-function}

Quand `importModuleDynamically` est une fonction, elle sera invoquée quand `import()` est appelé dans le code compilé pour permettre aux utilisateurs de personnaliser la manière dont le module requis doit être compilé et évalué. Actuellement, l'instance Node.js doit être lancée avec l'indicateur `--experimental-vm-modules` pour que cette option fonctionne. Si l'indicateur n'est pas défini, ce rappel sera ignoré. Si le code évalué appelle réellement `import()`, le résultat sera rejeté avec [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/fr/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag).

Le rappel `importModuleDynamically(specifier, referrer, importAttributes)` a la signature suivante :

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) specifier passé à `import()`
- `referrer` [\<vm.Script\>](/fr/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/fr/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le référent est le `vm.Script` compilé pour `new vm.Script`, `vm.runInThisContext`, `vm.runInContext` et `vm.runInNewContext`. C'est la `Function` compilée pour `vm.compileFunction`, le `vm.SourceTextModule` compilé pour `new vm.SourceTextModule`, et le `Object` de contexte pour `vm.createContext()`.
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) La valeur `"with"` passée au paramètre optionnel [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call), ou un objet vide si aucune valeur n'a été fournie.
- Returns: [\<Module Namespace Object\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/fr/nodejs/api/vm#class-vmmodule) Il est recommandé de renvoyer un `vm.Module` afin de profiter du suivi des erreurs et d'éviter les problèmes liés aux espaces de noms qui contiennent des exportations de fonctions `then`.



::: code-group
```js [ESM]
// Ce script doit être exécuté avec --experimental-vm-modules.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // Le script compilé
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// Ce script doit être exécuté avec --experimental-vm-modules.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // Le script compilé
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

