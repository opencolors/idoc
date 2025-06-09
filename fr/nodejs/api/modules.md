---
title: Documentation Node.js - Modules
description: Découvrez la documentation de Node.js sur les modules, y compris CommonJS, les modules ES, et comment gérer les dépendances et la résolution des modules.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Modules | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez la documentation de Node.js sur les modules, y compris CommonJS, les modules ES, et comment gérer les dépendances et la résolution des modules.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Modules | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez la documentation de Node.js sur les modules, y compris CommonJS, les modules ES, et comment gérer les dépendances et la résolution des modules.
---


# Modules : modules CommonJS {#modules-commonjs-modules}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Les modules CommonJS sont la manière originale d’empaqueter du code JavaScript pour Node.js. Node.js prend également en charge la norme [modules ECMAScript](/fr/nodejs/api/esm) utilisée par les navigateurs et autres environnements d’exécution JavaScript.

Dans Node.js, chaque fichier est traité comme un module distinct. Par exemple, considérez un fichier nommé `foo.js` :

```js [ESM]
const circle = require('./circle.js');
console.log(`L’aire d’un cercle de rayon 4 est de ${circle.area(4)}`);
```

Sur la première ligne, `foo.js` charge le module `circle.js` qui se trouve dans le même répertoire que `foo.js`.

Voici le contenu de `circle.js` :

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```

Le module `circle.js` a exporté les fonctions `area()` et `circumference()`. Les fonctions et les objets sont ajoutés à la racine d’un module en spécifiant des propriétés supplémentaires sur l’objet spécial `exports`.

Les variables locales du module seront privées, car le module est encapsulé dans une fonction par Node.js (voir [encapsuleur de module](/fr/nodejs/api/modules#the-module-wrapper)). Dans cet exemple, la variable `PI` est privée à `circle.js`.

La propriété `module.exports` peut recevoir une nouvelle valeur (telle qu’une fonction ou un objet).

Dans le code suivant, `bar.js` utilise le module `square`, qui exporte une classe Square :

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`L’aire de mySquare est ${mySquare.area()}`);
```

Le module `square` est défini dans `square.js` :

```js [ESM]
// L’attribution à exports ne modifiera pas le module, vous devez utiliser module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```

Le système de modules CommonJS est implémenté dans le [module cœur `module`](/fr/nodejs/api/module).

## Activation {#enabling}

Node.js possède deux systèmes de modules : les modules CommonJS et les [modules ECMAScript](/fr/nodejs/api/esm).

Par défaut, Node.js traitera ce qui suit comme des modules CommonJS :

- Les fichiers avec une extension `.cjs` ;
- Les fichiers avec une extension `.js` lorsque le fichier `package.json` parent le plus proche contient un champ de niveau supérieur [`"type"`](/fr/nodejs/api/packages#type) avec la valeur `"commonjs"`.
- Les fichiers avec une extension `.js` ou sans extension, lorsque le fichier `package.json` parent le plus proche ne contient pas de champ de niveau supérieur [`"type"`](/fr/nodejs/api/packages#type) ou qu’il n’y a pas de `package.json` dans un dossier parent quelconque ; sauf si le fichier contient une syntaxe qui provoque une erreur à moins d’être évalué comme un module ES. Les auteurs de packages doivent inclure le champ [`"type"`](/fr/nodejs/api/packages#type), même dans les packages où toutes les sources sont CommonJS. Le fait d’être explicite sur le `type` du package facilitera la tâche des outils de construction et des chargeurs pour déterminer comment les fichiers du package doivent être interprétés.
- Les fichiers avec une extension qui n’est pas `.mjs`, `.cjs`, `.json`, `.node` ou `.js` (lorsque le fichier `package.json` parent le plus proche contient un champ de niveau supérieur [`"type"`](/fr/nodejs/api/packages#type) avec la valeur `"module"`, ces fichiers ne seront reconnus comme des modules CommonJS que s’ils sont inclus via `require()`, et non lorsqu’ils sont utilisés comme point d’entrée en ligne de commande du programme).

Voir [Détermination du système de modules](/fr/nodejs/api/packages#determining-module-system) pour plus de détails.

L’appel de `require()` utilise toujours le chargeur de modules CommonJS. L’appel de `import()` utilise toujours le chargeur de modules ECMAScript.


## Accéder au module principal {#accessing-the-main-module}

Lorsqu'un fichier est exécuté directement depuis Node.js, `require.main` est défini sur son `module`. Cela signifie qu'il est possible de déterminer si un fichier a été exécuté directement en testant `require.main === module`.

Pour un fichier `foo.js`, cela sera `true` s'il est exécuté via `node foo.js`, mais `false` s'il est exécuté par `require('./foo')`.

Lorsque le point d'entrée n'est pas un module CommonJS, `require.main` est `undefined`, et le module principal est hors de portée.

## Conseils pour les gestionnaires de paquets {#package-manager-tips}

La sémantique de la fonction `require()` de Node.js a été conçue pour être suffisamment générale pour prendre en charge des structures de répertoire raisonnables. Les programmes de gestion de paquets tels que `dpkg`, `rpm` et `npm` pourront, espérons-le, créer des paquets natifs à partir de modules Node.js sans modification.

Dans ce qui suit, nous donnons une structure de répertoire suggérée qui pourrait fonctionner :

Supposons que nous voulions que le dossier `/usr/lib/node/\<some-package\>/\<some-version\>` contienne le contenu d'une version spécifique d'un paquet.

Les paquets peuvent dépendre les uns des autres. Afin d'installer le paquet `foo`, il peut être nécessaire d'installer une version spécifique du paquet `bar`. Le paquet `bar` peut lui-même avoir des dépendances, et dans certains cas, celles-ci peuvent même entrer en conflit ou former des dépendances cycliques.

Étant donné que Node.js recherche le `realpath` de tous les modules qu'il charge (c'est-à-dire qu'il résout les liens symboliques) et qu'il [recherche ensuite leurs dépendances dans les dossiers `node_modules`](/fr/nodejs/api/modules#loading-from-node_modules-folders), cette situation peut être résolue avec l'architecture suivante :

- `/usr/lib/node/foo/1.2.3/` : Contenu du paquet `foo`, version 1.2.3.
- `/usr/lib/node/bar/4.3.2/` : Contenu du paquet `bar` dont `foo` dépend.
- `/usr/lib/node/foo/1.2.3/node_modules/bar` : Lien symbolique vers `/usr/lib/node/bar/4.3.2/`.
- `/usr/lib/node/bar/4.3.2/node_modules/*` : Liens symboliques vers les paquets dont `bar` dépend.

Ainsi, même si un cycle est rencontré, ou s'il y a des conflits de dépendances, chaque module sera en mesure d'obtenir une version de sa dépendance qu'il peut utiliser.

Lorsque le code du paquet `foo` fait `require('bar')`, il obtiendra la version qui est liée symboliquement dans `/usr/lib/node/foo/1.2.3/node_modules/bar`. Ensuite, lorsque le code du paquet `bar` appelle `require('quux')`, il obtiendra la version qui est liée symboliquement dans `/usr/lib/node/bar/4.3.2/node_modules/quux`.

De plus, pour rendre le processus de recherche de module encore plus optimal, plutôt que de placer les paquets directement dans `/usr/lib/node`, nous pourrions les placer dans `/usr/lib/node_modules/\<name\>/\<version\>`. Alors Node.js ne se souciera pas de chercher les dépendances manquantes dans `/usr/node_modules` ou `/node_modules`.

Afin de rendre les modules disponibles pour le REPL de Node.js, il pourrait être utile d'ajouter également le dossier `/usr/lib/node_modules` à la variable d'environnement `$NODE_PATH`. Étant donné que les recherches de modules utilisant les dossiers `node_modules` sont toutes relatives et basées sur le chemin réel des fichiers qui font les appels à `require()`, les paquets eux-mêmes peuvent se trouver n'importe où.


## Chargement de modules ECMAScript en utilisant `require()` {#loading-ecmascript-modules-using-require}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | Cette fonctionnalité n'émet plus d'avertissement expérimental par défaut, bien que l'avertissement puisse toujours être émis par --trace-require-module. |
| v23.0.0 | Cette fonctionnalité n'est plus derrière l'indicateur CLI `--experimental-require-module`. |
| v23.0.0 | Prise en charge de l'exportation d'interopérabilité `'module.exports'` dans `require(esm)`. |
| v22.0.0, v20.17.0 | Ajouté dans : v22.0.0, v20.17.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).2 - Version candidate
:::

L'extension `.mjs` est réservée aux [Modules ECMAScript](/fr/nodejs/api/esm). Voir la section [Détermination du système de modules](/fr/nodejs/api/packages#determining-module-system) pour plus d'informations concernant les fichiers qui sont analysés en tant que modules ECMAScript.

`require()` prend uniquement en charge le chargement des modules ECMAScript qui répondent aux exigences suivantes :

- Le module est entièrement synchrone (ne contient pas de `await` de niveau supérieur) ; et
- L'une de ces conditions est remplie :

Si le module ES chargé répond aux exigences, `require()` peut le charger et renvoyer l'objet d'espace de noms du module. Dans ce cas, il est similaire à `import()` dynamique, mais il est exécuté de manière synchrone et renvoie directement l'objet d'espace de noms.

Avec les modules ES suivants :

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
Un module CommonJS peut les charger avec `require()` :

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```
Pour l'interopérabilité avec les outils existants qui convertissent les modules ES en CommonJS, qui pourraient ensuite charger de vrais modules ES via `require()`, l'espace de noms renvoyé contiendrait une propriété `__esModule: true` s'il a une exportation `default` afin que le code consommateur généré par les outils puisse reconnaître les exportations par défaut dans les vrais modules ES. Si l'espace de noms définit déjà `__esModule`, cela ne serait pas ajouté. Cette propriété est expérimentale et peut changer à l'avenir. Elle ne doit être utilisée que par les outils convertissant les modules ES en modules CommonJS, en suivant les conventions existantes de l'écosystème. Le code écrit directement en CommonJS doit éviter d'en dépendre.

Lorsqu'un module ES contient à la fois des exportations nommées et une exportation par défaut, le résultat renvoyé par `require()` est l'objet d'espace de noms du module, qui place l'exportation par défaut dans la propriété `.default`, similaire aux résultats renvoyés par `import()`. Pour personnaliser ce qui doit être renvoyé directement par `require(esm)`, le module ES peut exporter la valeur souhaitée en utilisant le nom de chaîne `"module.exports"`.

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` est perdu pour les consommateurs CommonJS de ce module, sauf s'il est
// ajouté à `Point` en tant que propriété statique.
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Les exportations nommées sont perdues lorsque 'module.exports' est utilisé
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
Notez dans l'exemple ci-dessus, lorsque le nom d'exportation `module.exports` est utilisé, les exportations nommées seront perdues pour les consommateurs CommonJS. Pour permettre aux consommateurs CommonJS de continuer à accéder aux exportations nommées, le module peut s'assurer que l'exportation par défaut est un objet avec les exportations nommées attachées comme propriétés. Par exemple, avec l'exemple ci-dessus, `distance` peut être attaché à l'exportation par défaut, la classe `Point`, comme une méthode statique.

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```
Si le module en cours de `require()` contient `await` de niveau supérieur, ou si le graphique de module qu'il `import` contient `await` de niveau supérieur, [`ERR_REQUIRE_ASYNC_MODULE`](/fr/nodejs/api/errors#err_require_async_module) sera levé. Dans ce cas, les utilisateurs doivent charger le module asynchrone en utilisant [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

Si `--experimental-print-required-tla` est activé, au lieu de lever `ERR_REQUIRE_ASYNC_MODULE` avant l'évaluation, Node.js évaluera le module, essaiera de localiser les awaits de niveau supérieur, et imprimera leur emplacement pour aider les utilisateurs à les corriger.

La prise en charge du chargement des modules ES en utilisant `require()` est actuellement expérimentale et peut être désactivée en utilisant `--no-experimental-require-module`. Pour imprimer où cette fonctionnalité est utilisée, utilisez [`--trace-require-module`](/fr/nodejs/api/cli#--trace-require-modulemode).

Cette fonctionnalité peut être détectée en vérifiant si [`process.features.require_module`](/fr/nodejs/api/process#processfeaturesrequire_module) est `true`.


## Tout ensemble {#all-together}

Pour obtenir le nom de fichier exact qui sera chargé lorsque `require()` est appelé, utilisez la fonction `require.resolve()`.

En réunissant tout ce qui précède, voici l'algorithme de haut niveau en pseudocode de ce que fait `require()` :

```text [TEXT]
require(X) depuis le module au chemin Y
1. Si X est un module principal,
   a. retourner le module principal
   b. ARRÊTER
2. Si X commence par '/'
   a. définir Y comme étant la racine du système de fichiers
3. Si X commence par './' ou '/' ou '../'
   a. CHARGER_COMME_FICHIER(Y + X)
   b. CHARGER_COMME_RÉPERTOIRE(Y + X)
   c. LANCER "introuvable"
4. Si X commence par '#'
   a. CHARGER_IMPORTATIONS_DE_PAQUET(X, dirname(Y))
5. CHARGER_SOI_MÊME_DU_PAQUET(X, dirname(Y))
6. CHARGER_MODULES_NODE(X, dirname(Y))
7. LANCER "introuvable"

PEUT-ÊTRE_DÉTECTER_ET_CHARGER(X)
1. Si X est analysé comme un module CommonJS, charger X comme un module CommonJS. ARRÊTER.
2. Sinon, si le code source de X peut être analysé comme un module ECMAScript en utilisant
  <a href="esm.md#resolver-algorithm-specification">DÉTECTER_SYNTAXE_DE_MODULE défini dans
  le résolveur ESM</a>,
  a. Charger X comme un module ECMAScript. ARRÊTER.
3. LANCER l'erreur SyntaxError en tentant d'analyser X comme CommonJS dans 1. ARRÊTER.

CHARGER_COMME_FICHIER(X)
1. Si X est un fichier, charger X comme son format d'extension de fichier. ARRÊTER
2. Si X.js est un fichier,
    a. Trouver l'étendue de paquet SCOPE la plus proche de X.
    b. Si aucune étendue n'a été trouvée
      1. PEUT-ÊTRE_DÉTECTER_ET_CHARGER(X.js)
    c. Si SCOPE/package.json contient le champ "type",
      1. Si le champ "type" est "module", charger X.js comme un module ECMAScript. ARRÊTER.
      2. Si le champ "type" est "commonjs", charger X.js comme un module CommonJS. ARRÊTER.
    d. PEUT-ÊTRE_DÉTECTER_ET_CHARGER(X.js)
3. Si X.json est un fichier, charger X.json dans un objet JavaScript. ARRÊTER
4. Si X.node est un fichier, charger X.node comme un module complémentaire binaire. ARRÊTER

CHARGER_INDEX(X)
1. Si X/index.js est un fichier
    a. Trouver l'étendue de paquet SCOPE la plus proche de X.
    b. Si aucune étendue n'a été trouvée, charger X/index.js comme un module CommonJS. ARRÊTER.
    c. Si SCOPE/package.json contient le champ "type",
      1. Si le champ "type" est "module", charger X/index.js comme un module ECMAScript. ARRÊTER.
      2. Sinon, charger X/index.js comme un module CommonJS. ARRÊTER.
2. Si X/index.json est un fichier, analyser X/index.json en un objet JavaScript. ARRÊTER
3. Si X/index.node est un fichier, charger X/index.node comme un module complémentaire binaire. ARRÊTER

CHARGER_COMME_RÉPERTOIRE(X)
1. Si X/package.json est un fichier,
   a. Analyser X/package.json, et rechercher le champ "main".
   b. Si "main" est une valeur fausse, ALLER À 2.
   c. soit M = X + (champ principal json)
   d. CHARGER_COMME_FICHIER(M)
   e. CHARGER_INDEX(M)
   f. CHARGER_INDEX(X) DÉPRÉCIÉ
   g. LANCER "introuvable"
2. CHARGER_INDEX(X)

CHARGER_MODULES_NODE(X, DÉMARRER)
1. soit DIRS = CHEMINS_MODULES_NODE(DÉMARRER)
2. pour chaque DIR dans DIRS :
   a. CHARGER_EXPORATIONS_DE_PAQUET(X, DIR)
   b. CHARGER_COMME_FICHIER(DIR/X)
   c. CHARGER_COMME_RÉPERTOIRE(DIR/X)

CHEMINS_MODULES_NODE(DÉMARRER)
1. soit PARTS = chemin diviser(DÉMARRER)
2. soit I = nombre de PARTS - 1
3. soit DIRS = []
4. tant que I >= 0,
   a. si PARTS[I] = "node_modules", ALLER À d.
   b. DIR = chemin joindre(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIR + DIRS
   d. soit I = I - 1
5. retourner DIRS + DOSSIERS_GLOBAUX

CHARGER_IMPORTATIONS_DE_PAQUET(X, DIR)
1. Trouver l'étendue de paquet SCOPE la plus proche de DIR.
2. Si aucune étendue n'a été trouvée, retourner.
3. Si les "importations" de SCOPE/package.json sont nulles ou non définies, retourner.
4. Si `--experimental-require-module` est activé
  a. soit CONDITIONS = ["node", "require", "module-sync"]
  b. Sinon, soit CONDITIONS = ["node", "require"]
5. soit MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">défini dans le résolveur ESM</a>.
6. RESOLVE_ESM_MATCH(MATCH).

CHARGER_EXPORATIONS_DE_PAQUET(X, DIR)
1. Essayer d'interpréter X comme une combinaison de NAME et SUBPATH où le nom
   peut avoir un préfixe @scope/ et le sous-chemin commence par une barre oblique (`/`).
2. Si X ne correspond pas à ce modèle ou si DIR/NAME/package.json n'est pas un fichier,
   retourner.
3. Analyser DIR/NAME/package.json, et rechercher le champ "exports".
4. Si "exports" est nul ou non défini, retourner.
5. Si `--experimental-require-module` est activé
  a. soit CONDITIONS = ["node", "require", "module-sync"]
  b. Sinon, soit CONDITIONS = ["node", "require"]
6. soit MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) <a href="esm.md#resolver-algorithm-specification">défini dans le résolveur ESM</a>.
7. RESOLVE_ESM_MATCH(MATCH)

CHARGER_SOI_MÊME_DU_PAQUET(X, DIR)
1. Trouver l'étendue de paquet SCOPE la plus proche de DIR.
2. Si aucune étendue n'a été trouvée, retourner.
3. Si les "exports" de SCOPE/package.json sont nuls ou non définis, retourner.
4. Si le "name" de SCOPE/package.json n'est pas le premier segment de X, retourner.
5. soit MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">défini dans le résolveur ESM</a>.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. soit RESOLVED_PATH = fileURLToPath(MATCH)
2. Si le fichier à RESOLVED_PATH existe, charger RESOLVED_PATH comme son extension
   format. ARRÊTER
3. LANCER "introuvable"
```

## Mise en cache {#caching}

Les modules sont mis en cache après leur première chargement. Cela signifie (entre autres choses) que chaque appel à `require('foo')` retournera exactement le même objet, s'il se résout au même fichier.

À condition que `require.cache` ne soit pas modifié, plusieurs appels à `require('foo')` n'entraîneront pas l'exécution du code du module plusieurs fois. C'est une caractéristique importante. Grâce à elle, des objets « partiellement terminés » peuvent être retournés, ce qui permet de charger des dépendances transitives même lorsqu'elles provoqueraient des cycles.

Pour qu'un module exécute du code plusieurs fois, exportez une fonction et appelez cette fonction.

### Avertissements concernant la mise en cache des modules {#module-caching-caveats}

Les modules sont mis en cache en fonction de leur nom de fichier résolu. Étant donné que les modules peuvent se résoudre en un nom de fichier différent en fonction de l'emplacement du module appelant (chargement à partir des dossiers `node_modules`), il n'est pas *garanti* que `require('foo')` renvoie toujours exactement le même objet, s'il se résout à différents fichiers.

De plus, sur les systèmes de fichiers ou les systèmes d'exploitation insensibles à la casse, différents noms de fichiers résolus peuvent pointer vers le même fichier, mais le cache les traitera toujours comme des modules différents et rechargera le fichier plusieurs fois. Par exemple, `require('./foo')` et `require('./FOO')` renvoient deux objets différents, que `./foo` et `./FOO` soient ou non le même fichier.

## Modules intégrés {#built-in-modules}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0, v14.18.0 | Ajout de la prise en charge de l'importation `node:` à `require(...)`. |
:::

Node.js possède plusieurs modules compilés dans le binaire. Ces modules sont décrits plus en détail ailleurs dans cette documentation.

Les modules intégrés sont définis dans la source de Node.js et se trouvent dans le dossier `lib/`.

Les modules intégrés peuvent être identifiés à l'aide du préfixe `node:`, auquel cas ils contournent le cache `require`. Par exemple, `require('node:http')` renverra toujours le module HTTP intégré, même s'il existe une entrée `require.cache` portant ce nom.

Certains modules intégrés sont toujours chargés de préférence si leur identifiant est transmis à `require()`. Par exemple, `require('http')` renverra toujours le module HTTP intégré, même s'il existe un fichier portant ce nom. La liste des modules intégrés qui peuvent être chargés sans utiliser le préfixe `node:` est exposée dans [`module.builtinModules`](/fr/nodejs/api/module#modulebuiltinmodules), répertoriée sans le préfixe.


### Modules intégrés avec le préfixe obligatoire `node:` {#built-in-modules-with-mandatory-node-prefix}

Lorsqu'ils sont chargés par `require()`, certains modules intégrés doivent être demandés avec le préfixe `node:`. Cette exigence existe pour empêcher les modules intégrés nouvellement introduits d'entrer en conflit avec les packages utilisateur qui ont déjà pris le nom. Actuellement, les modules intégrés qui nécessitent le préfixe `node:` sont les suivants :

- [`node:sea`](/fr/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/fr/nodejs/api/sqlite)
- [`node:test`](/fr/nodejs/api/test)
- [`node:test/reporters`](/fr/nodejs/api/test#test-reporters)

La liste de ces modules est exposée dans [`module.builtinModules`](/fr/nodejs/api/module#modulebuiltinmodules), y compris le préfixe.

## Cycles {#cycles}

Lorsqu'il y a des appels `require()` circulaires, un module peut ne pas avoir fini de s'exécuter lorsqu'il est retourné.

Considérez cette situation :

`a.js` :

```js [ESM]
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```
`b.js` :

```js [ESM]
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```
`main.js` :

```js [ESM]
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```
Lorsque `main.js` charge `a.js`, puis `a.js` charge à son tour `b.js`. À ce stade, `b.js` essaie de charger `a.js`. Afin d'empêcher une boucle infinie, une **copie non terminée** de l'objet `exports` de `a.js` est renvoyée au module `b.js`. `b.js` termine ensuite le chargement et son objet `exports` est fourni au module `a.js`.

Au moment où `main.js` a chargé les deux modules, ils sont tous les deux terminés. La sortie de ce programme serait donc :

```bash [BASH]
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
Une planification minutieuse est nécessaire pour permettre aux dépendances de modules cycliques de fonctionner correctement dans une application.


## Modules de fichiers {#file-modules}

Si le nom de fichier exact n'est pas trouvé, Node.js tentera de charger le nom de fichier requis avec les extensions ajoutées : `.js`, `.json` et enfin `.node`. Lors du chargement d'un fichier qui a une extension différente (par exemple `.cjs`), son nom complet doit être passé à `require()`, y compris son extension de fichier (par exemple `require('./file.cjs')`).

Les fichiers `.json` sont analysés comme des fichiers texte JSON, les fichiers `.node` sont interprétés comme des modules complémentaires compilés chargés avec `process.dlopen()`. Les fichiers utilisant toute autre extension (ou aucune extension) sont analysés comme des fichiers texte JavaScript. Consultez la section [Détermination du système de modules](/fr/nodejs/api/packages#determining-module-system) pour comprendre quel objectif d'analyse sera utilisé.

Un module requis préfixé par `'/'` est un chemin absolu vers le fichier. Par exemple, `require('/home/marco/foo.js')` chargera le fichier à `/home/marco/foo.js`.

Un module requis préfixé par `'./'` est relatif au fichier appelant `require()`. Autrement dit, `circle.js` doit se trouver dans le même répertoire que `foo.js` pour que `require('./circle')` le trouve.

Sans `'/'`, `'./'` ou `'../'` en tête pour indiquer un fichier, le module doit être un module principal ou être chargé à partir d'un dossier `node_modules`.

Si le chemin donné n'existe pas, `require()` lèvera une erreur [`MODULE_NOT_FOUND`](/fr/nodejs/api/errors#module_not_found).

## Dossiers en tant que modules {#folders-as-modules}

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Legacy : Utilisez plutôt les [exportations de sous-chemin](/fr/nodejs/api/packages#subpath-exports) ou les [importations de sous-chemin](/fr/nodejs/api/packages#subpath-imports).
:::

Il existe trois façons de passer un dossier à `require()` comme argument.

La première consiste à créer un fichier [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) à la racine du dossier, qui spécifie un module `main`. Un exemple de fichier [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) pourrait ressembler à ceci :

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
Si cela se trouvait dans un dossier à `./some-library`, alors `require('./some-library')` tenterait de charger `./some-library/lib/some-library.js`.

S'il n'y a pas de fichier [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) présent dans le répertoire, ou si l'entrée [`"main"`](/fr/nodejs/api/packages#main) est manquante ou ne peut pas être résolue, alors Node.js tentera de charger un fichier `index.js` ou `index.node` hors de ce répertoire. Par exemple, s'il n'y avait pas de fichier [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) dans l'exemple précédent, alors `require('./some-library')` tenterait de charger :

- `./some-library/index.js`
- `./some-library/index.node`

Si ces tentatives échouent, Node.js signalera l'ensemble du module comme manquant avec l'erreur par défaut :

```bash [BASH]
Error: Cannot find module 'some-library'
```
Dans les trois cas ci-dessus, un appel `import('./some-library')` entraînerait une erreur [`ERR_UNSUPPORTED_DIR_IMPORT`](/fr/nodejs/api/errors#err_unsupported_dir_import). L'utilisation des [exportations de sous-chemin](/fr/nodejs/api/packages#subpath-exports) ou des [importations de sous-chemin](/fr/nodejs/api/packages#subpath-imports) de package peut fournir les mêmes avantages d'organisation de confinement que les dossiers en tant que modules, et fonctionner à la fois pour `require` et `import`.


## Chargement depuis les dossiers `node_modules` {#loading-from-node_modules-folders}

Si l'identifiant de module passé à `require()` n'est pas un module [intégré](/fr/nodejs/api/modules#built-in-modules), et ne commence pas par `'/'`, `'../'` ou `'./'`, alors Node.js commence par le répertoire du module courant, ajoute `/node_modules` et tente de charger le module à partir de cet emplacement. Node.js n'ajoutera pas `node_modules` à un chemin se terminant déjà par `node_modules`.

S'il n'est pas trouvé là, il se déplace vers le répertoire parent, et ainsi de suite, jusqu'à atteindre la racine du système de fichiers.

Par exemple, si le fichier à l'adresse `'/home/ry/projects/foo.js'` appelait `require('bar.js')`, alors Node.js chercherait aux emplacements suivants, dans cet ordre :

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

Cela permet aux programmes de localiser leurs dépendances, afin qu'elles ne s'entrechoquent pas.

Il est possible d'exiger des fichiers spécifiques ou des sous-modules distribués avec un module en incluant un suffixe de chemin après le nom du module. Par exemple, `require('example-module/path/to/file')` résoudrait `path/to/file` par rapport à l'emplacement de `example-module`. Le chemin suffixé suit la même sémantique de résolution de module.

## Chargement depuis les dossiers globaux {#loading-from-the-global-folders}

Si la variable d'environnement `NODE_PATH` est définie sur une liste de chemins absolus délimités par deux-points, alors Node.js recherchera ces chemins pour les modules s'ils ne sont pas trouvés ailleurs.

Sous Windows, `NODE_PATH` est délimité par des points-virgules (`;`) au lieu de deux-points.

`NODE_PATH` a été initialement créé pour prendre en charge le chargement de modules à partir de chemins variables avant que l'algorithme actuel de [résolution de module](/fr/nodejs/api/modules#all-together) ne soit défini.

`NODE_PATH` est toujours pris en charge, mais est moins nécessaire maintenant que l'écosystème Node.js s'est installé sur une convention pour localiser les modules dépendants. Parfois, les déploiements qui reposent sur `NODE_PATH` présentent un comportement surprenant lorsque les personnes ne sont pas conscientes que `NODE_PATH` doit être défini. Parfois, les dépendances d'un module changent, ce qui entraîne le chargement d'une version différente (voire d'un module différent) lors de la recherche dans `NODE_PATH`.

De plus, Node.js recherchera dans la liste suivante de GLOBAL_FOLDERS :

- 1 : `$HOME/.node_modules`
- 2 : `$HOME/.node_libraries`
- 3 : `$PREFIX/lib/node`

Où `$HOME` est le répertoire personnel de l'utilisateur et `$PREFIX` est le `node_prefix` configuré de Node.js.

Ce sont principalement des raisons historiques.

Il est fortement encouragé de placer les dépendances dans le dossier `node_modules` local. Celles-ci seront chargées plus rapidement et plus fiablement.


## Le wrapper de module {#the-module-wrapper}

Avant que le code d'un module ne soit exécuté, Node.js l'encapsule avec un wrapper de fonction qui ressemble à ceci :

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// Le code du module vit en fait ici
});
```

Ce faisant, Node.js réalise plusieurs choses :

- Il maintient les variables de niveau supérieur (définies avec `var`, `const` ou `let`) limitées au module plutôt qu'à l'objet global.
- Il permet de fournir des variables d'apparence globale qui sont en fait spécifiques au module, telles que :
    - Les objets `module` et `exports` que l'implémenteur peut utiliser pour exporter des valeurs du module.
    - Les variables de commodité `__filename` et `__dirname`, contenant le nom de fichier absolu et le chemin d'accès au répertoire du module.

## La portée du module {#the-module-scope}

### `__dirname` {#__dirname}

**Ajouté dans : v0.1.27**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le nom du répertoire du module courant. Il s'agit du même que le [`path.dirname()`](/fr/nodejs/api/path#pathdirnamepath) de [`__filename`](/fr/nodejs/api/modules#__filename).

Exemple : exécuter `node example.js` depuis `/Users/mjr`

```js [ESM]
console.log(__dirname);
// Affiche : /Users/mjr
console.log(path.dirname(__filename));
// Affiche : /Users/mjr
```

### `__filename` {#__filename}

**Ajouté dans : v0.0.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le nom de fichier du module courant. Il s'agit du chemin absolu du fichier du module courant avec les liens symboliques résolus.

Pour un programme principal, ce n'est pas nécessairement le même que le nom de fichier utilisé dans la ligne de commande.

Voir [`__dirname`](/fr/nodejs/api/modules#__dirname) pour le nom de répertoire du module courant.

Exemples :

Exécuter `node example.js` depuis `/Users/mjr`

```js [ESM]
console.log(__filename);
// Affiche : /Users/mjr/example.js
console.log(__dirname);
// Affiche : /Users/mjr
```

Étant donné deux modules : `a` et `b`, où `b` est une dépendance de `a` et qu'il existe une structure de répertoires de :

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

Les références à `__filename` dans `b.js` renverront `/Users/mjr/app/node_modules/b/b.js` tandis que les références à `__filename` dans `a.js` renverront `/Users/mjr/app/a.js`.


### `exports` {#exports}

**Ajouté dans : v0.1.12**

- [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)

Une référence à `module.exports` qui est plus courte à taper. Consultez la section sur le [raccourci exports](/fr/nodejs/api/modules#exports-shortcut) pour plus de détails sur quand utiliser `exports` et quand utiliser `module.exports`.

### `module` {#module}

**Ajouté dans : v0.1.16**

- [\<module\>](/fr/nodejs/api/modules#the-module-object)

Une référence au module actuel, voir la section sur l'objet [`module`](/fr/nodejs/api/modules#the-module-object). En particulier, `module.exports` est utilisé pour définir ce qu'un module exporte et rend disponible via `require()`.

### `require(id)` {#requireid}

**Ajouté dans : v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) nom ou chemin du module
- Retourne : [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) contenu du module exporté

Utilisé pour importer des modules, des fichiers `JSON` et des fichiers locaux. Les modules peuvent être importés depuis `node_modules`. Les modules locaux et les fichiers JSON peuvent être importés en utilisant un chemin relatif (par exemple `./`, `./foo`, `./bar/baz`, `../foo`) qui sera résolu par rapport au répertoire nommé par [`__dirname`](/fr/nodejs/api/modules#__dirname) (si défini) ou au répertoire de travail actuel. Les chemins relatifs de style POSIX sont résolus de manière indépendante du système d'exploitation, ce qui signifie que les exemples ci-dessus fonctionneront sur Windows de la même manière que sur les systèmes Unix.

```js [ESM]
// Importation d'un module local avec un chemin relatif à `__dirname` ou au répertoire
// de travail courant. (Sur Windows, ceci serait résolu en .\path\myLocalModule.)
const myLocalModule = require('./path/myLocalModule');

// Importation d'un fichier JSON :
const jsonData = require('./path/filename.json');

// Importation d'un module depuis node_modules ou un module intégré à Node.js :
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**Ajouté dans : v0.3.0**

- [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)

Les modules sont mis en cache dans cet objet lorsqu'ils sont requis. En supprimant une valeur de clé de cet objet, le prochain `require` rechargera le module. Ceci ne s'applique pas aux [modules complémentaires natifs](/fr/nodejs/api/addons), pour lesquels le rechargement entraînera une erreur.

Il est également possible d'ajouter ou de remplacer des entrées. Ce cache est vérifié avant les modules intégrés, et si un nom correspondant à un module intégré est ajouté au cache, seules les requêtes `require` préfixées par `node:` recevront le module intégré. Utilisez avec précaution !

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**Ajouté dans : v0.3.0**

**Déprécié depuis : v0.10.6**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Indique à `require` comment gérer certaines extensions de fichier.

Traitez les fichiers avec l'extension `.sjs` comme `.js` :

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**Déprécié.** Par le passé, cette liste était utilisée pour charger des modules non-JavaScript dans Node.js en les compilant à la demande. Cependant, en pratique, il existe de bien meilleures façons de le faire, comme le chargement de modules via un autre programme Node.js, ou leur compilation en JavaScript à l'avance.

Évitez d'utiliser `require.extensions`. Son utilisation pourrait provoquer des bogues subtils et la résolution des extensions devient plus lente à chaque extension enregistrée.

#### `require.main` {#requiremain}

**Ajouté dans : v0.1.17**

- [\<module\>](/fr/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

L'objet `Module` représentant le script d'entrée chargé au lancement du processus Node.js, ou `undefined` si le point d'entrée du programme n'est pas un module CommonJS. Voir ["Accéder au module principal"](/fr/nodejs/api/modules#accessing-the-main-module).

Dans le script `entry.js` :

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.9.0 | L'option `paths` est maintenant supportée. |
| v0.3.0 | Ajouté dans : v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin du module à résoudre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chemins à partir desquels résoudre l'emplacement du module. Si présents, ces chemins sont utilisés à la place des chemins de résolution par défaut, à l'exception des [GLOBAL_FOLDERS](/fr/nodejs/api/modules#loading-from-the-global-folders) tels que `$HOME/.node_modules`, qui sont toujours inclus. Chacun de ces chemins est utilisé comme point de départ pour l'algorithme de résolution de module, ce qui signifie que la hiérarchie `node_modules` est vérifiée à partir de cet emplacement.
  
 
- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilisez le mécanisme interne `require()` pour rechercher l'emplacement d'un module, mais au lieu de charger le module, renvoyez simplement le nom de fichier résolu.

Si le module est introuvable, une erreur `MODULE_NOT_FOUND` est levée.


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**Ajouté dans : v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin du module dont les chemins de recherche sont en cours de récupération.
- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Retourne un tableau contenant les chemins recherchés lors de la résolution de `request` ou `null` si la chaîne `request` fait référence à un module principal, par exemple `http` ou `fs`.

## L’objet `module` {#the-module-object}

**Ajouté dans : v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dans chaque module, la variable libre `module` est une référence à l’objet représentant le module courant. Pour plus de commodité, `module.exports` est également accessible via le module-global `exports`. `module` n’est pas réellement une variable globale, mais plutôt locale à chaque module.

### `module.children` {#modulechildren}

**Ajouté dans : v0.1.16**

- [\<module[]\>](/fr/nodejs/api/modules#the-module-object)

Les objets module requis pour la première fois par celui-ci.

### `module.exports` {#moduleexports}

**Ajouté dans : v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L’objet `module.exports` est créé par le système `Module`. Parfois, ce n’est pas acceptable ; beaucoup veulent que leur module soit une instance d’une certaine classe. Pour ce faire, assignez l’objet exporté souhaité à `module.exports`. L’attribution de l’objet souhaité à `exports` ne fera que relier la variable locale `exports`, ce qui n’est probablement pas ce qui est souhaité.

Par exemple, supposons que nous créions un module appelé `a.js` :

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// Do some work, and after some time emit
// the 'ready' event from the module itself.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
Puis, dans un autre fichier, nous pourrions faire :

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
```
L’affectation à `module.exports` doit être effectuée immédiatement. Elle ne peut pas être effectuée dans des rappels. Ceci ne fonctionne pas :

`x.js` :

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js` :

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### Raccourci `exports` {#exports-shortcut}

**Ajouté dans : v0.1.16**

La variable `exports` est disponible dans la portée de niveau fichier d’un module, et sa valeur est affectée à `module.exports` avant que le module ne soit évalué.

Elle permet un raccourci, de sorte que `module.exports.f = ...` puisse être écrit plus succinctement comme `exports.f = ...`. Cependant, sachez que, comme toute variable, si une nouvelle valeur est affectée à `exports`, elle n’est plus liée à `module.exports` :

```js [ESM]
module.exports.hello = true; // Exporté à partir de require de module
exports = { hello: false };  // Non exporté, uniquement disponible dans le module
```
Lorsque la propriété `module.exports` est complètement remplacée par un nouvel objet, il est courant de réaffecter également `exports` :

```js [ESM]
module.exports = exports = function Constructor() {
  // ... etc.
};
```
Pour illustrer le comportement, imaginez cette implémentation hypothétique de `require()`, qui est très similaire à ce qui est réellement fait par `require()` :

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Module code here. In this example, define a function.
    function someFunc() {}
    exports = someFunc;
    // At this point, exports is no longer a shortcut to module.exports, and
    // this module will still export an empty default object.
    module.exports = someFunc;
    // At this point, the module will now export someFunc, instead of the
    // default object.
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**Ajouté dans : v0.1.16**

- [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String)

Le nom de fichier complet du module.

### `module.id` {#moduleid}

**Ajouté dans : v0.1.16**

- [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String)

L’identifiant du module. En général, il s’agit du nom de fichier complet.

### `module.isPreloading` {#moduleispreloading}

**Ajouté dans : v15.4.0, v14.17.0**

- Type : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) `true` si le module s’exécute pendant la phase de préchargement de Node.js.


### `module.loaded` {#moduleloaded}

**Ajouté dans : v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indique si le module est terminé de charger, ou s'il est en cours de chargement.

### `module.parent` {#moduleparent}

**Ajouté dans : v0.1.16**

**Déprécié depuis : v14.6.0, v12.19.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Veuillez utiliser [`require.main`](/fr/nodejs/api/modules#requiremain) et [`module.children`](/fr/nodejs/api/modules#modulechildren) à la place.
:::

- [\<module\>](/fr/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Le module qui a requis celui-ci en premier, ou `null` si le module actuel est le point d'entrée du processus actuel, ou `undefined` si le module a été chargé par quelque chose qui n'est pas un module CommonJS (E.G.: REPL ou `import`).

### `module.path` {#modulepath}

**Ajouté dans : v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le nom du répertoire du module. C'est généralement le même que le [`path.dirname()`](/fr/nodejs/api/path#pathdirnamepath) de [`module.id`](/fr/nodejs/api/modules#moduleid).

### `module.paths` {#modulepaths}

**Ajouté dans : v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Les chemins de recherche pour le module.

### `module.require(id)` {#modulerequireid}

**Ajouté dans : v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) contenu du module exporté

La méthode `module.require()` fournit un moyen de charger un module comme si `require()` était appelé à partir du module d'origine.

Pour ce faire, il est nécessaire d'obtenir une référence à l'objet `module`. Étant donné que `require()` renvoie `module.exports` et que `module` n'est généralement disponible *que* dans le code d'un module spécifique, il doit être explicitement exporté pour pouvoir être utilisé.


## L'objet `Module` {#the-module-object_1}

Cette section a été déplacée vers [Modules : module central `module`](/fr/nodejs/api/module#the-module-object).

- [`module.builtinModules`](/fr/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/fr/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/fr/nodejs/api/module#modulesyncbuiltinesmexports)

## Prise en charge de la source map v3 {#source-map-v3-support}

Cette section a été déplacée vers [Modules : module central `module`](/fr/nodejs/api/module#source-map-v3-support).

- [`module.findSourceMap(path)`](/fr/nodejs/api/module#modulefindsourcemappath)
- [Classe : `module.SourceMap`](/fr/nodejs/api/module#class-modulesourcemap)
    - [`new SourceMap(payload)`](/fr/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/fr/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/fr/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

