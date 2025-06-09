---
title: Modules ECMAScript dans Node.js
description: Cette page fournit une documentation détaillée sur l'utilisation des modules ECMAScript (ESM) dans Node.js, y compris la résolution des modules, la syntaxe d'importation et d'exportation, et la compatibilité avec CommonJS.
head:
  - - meta
    - name: og:title
      content: Modules ECMAScript dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette page fournit une documentation détaillée sur l'utilisation des modules ECMAScript (ESM) dans Node.js, y compris la résolution des modules, la syntaxe d'importation et d'exportation, et la compatibilité avec CommonJS.
  - - meta
    - name: twitter:title
      content: Modules ECMAScript dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette page fournit une documentation détaillée sur l'utilisation des modules ECMAScript (ESM) dans Node.js, y compris la résolution des modules, la syntaxe d'importation et d'exportation, et la compatibilité avec CommonJS.
---


# Modules: Modules ECMAScript {#modules-ecmascript-modules}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.1.0 | Les attributs d'importation ne sont plus expérimentaux. |
| v22.0.0 | Suppression de la prise en charge des assertions d'importation. |
| v21.0.0, v20.10.0, v18.20.0 | Ajout du support expérimental pour les attributs d'importation. |
| v20.0.0, v18.19.0 | Les hooks de personnalisation de module sont exécutés en dehors du thread principal. |
| v18.6.0, v16.17.0 | Ajout du support pour le chaînage des hooks de personnalisation de module. |
| v17.1.0, v16.14.0 | Ajout du support expérimental pour les assertions d'importation. |
| v17.0.0, v16.12.0 | Consolidation des hooks de personnalisation, suppression des hooks `getFormat`, `getSource`, `transformSource` et `getGlobalPreloadCode`, ajout des hooks `load` et `globalPreload` permettant de renvoyer `format` depuis les hooks `resolve` ou `load`. |
| v14.8.0 | Suppression de l'indicateur Top-Level Await. |
| v15.3.0, v14.17.0, v12.22.0 | Stabilisation de l'implémentation des modules. |
| v14.13.0, v12.20.0 | Support pour la détection des exports nommés CommonJS. |
| v14.0.0, v13.14.0, v12.20.0 | Suppression de l'avertissement sur les modules expérimentaux. |
| v13.2.0, v12.17.0 | Le chargement des modules ECMAScript ne nécessite plus d'indicateur de ligne de commande. |
| v12.0.0 | Ajout du support des modules ES utilisant l'extension de fichier `.js` via le champ `"type"` de `package.json`. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

## Introduction {#introduction}

Les modules ECMAScript sont [le format standard officiel](https://tc39.github.io/ecma262/#sec-modules) pour empaqueter le code JavaScript en vue de sa réutilisation. Les modules sont définis à l'aide d'une variété d'instructions [`import`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/import) et [`export`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/export).

L'exemple suivant d'un module ES exporte une fonction :

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
L'exemple suivant d'un module ES importe la fonction de `addTwo.mjs` :

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// Affiche : 6
console.log(addTwo(4));
```
Node.js prend entièrement en charge les modules ECMAScript tels qu'ils sont actuellement spécifiés et assure l'interopérabilité entre eux et son format de module d'origine, [CommonJS](/fr/nodejs/api/modules).


## Activation {#enabling}

Node.js possède deux systèmes de modules : les modules [CommonJS](/fr/nodejs/api/modules) et les modules ECMAScript.

Les auteurs peuvent demander à Node.js d'interpréter JavaScript comme un module ES via l'extension de fichier `.mjs`, le champ [`"type"`](/fr/nodejs/api/packages#type) du `package.json` avec la valeur `"module"`, ou l'indicateur [`--input-type`](/fr/nodejs/api/cli#--input-typetype) avec la valeur `"module"`. Ce sont des marqueurs explicites indiquant que le code est destiné à être exécuté en tant que module ES.

Inversement, les auteurs peuvent explicitement demander à Node.js d'interpréter JavaScript comme CommonJS via l'extension de fichier `.cjs`, le champ [`"type"`](/fr/nodejs/api/packages#type) du `package.json` avec la valeur `"commonjs"`, ou l'indicateur [`--input-type`](/fr/nodejs/api/cli#--input-typetype) avec la valeur `"commonjs"`.

Lorsque le code ne possède pas de marqueurs explicites pour l'un ou l'autre système de module, Node.js inspecte le code source d'un module pour rechercher la syntaxe du module ES. Si une telle syntaxe est trouvée, Node.js exécute le code en tant que module ES ; sinon, il exécute le module en tant que CommonJS. Voir [Déterminer le système de modules](/fr/nodejs/api/packages#determining-module-system) pour plus de détails.

## Packages {#packages}

Cette section a été déplacée vers [Modules : Packages](/fr/nodejs/api/packages).

## Spécificateurs `import` {#import-specifiers}

### Terminologie {#terminology}

Le *spécificateur* d'une instruction `import` est la chaîne de caractères après le mot-clé `from`, par exemple `'node:path'` dans `import { sep } from 'node:path'`. Les spécificateurs sont également utilisés dans les instructions `export from`, et comme argument de l'expression `import()`.

Il existe trois types de spécificateurs :

-  *Spécificateurs relatifs* comme `'./startup.js'` ou `'../config.mjs'`. Ils font référence à un chemin relatif à l'emplacement du fichier important. *L'extension de fichier
est toujours nécessaire pour ceux-ci.*
-  *Spécificateurs nus* comme `'some-package'` ou `'some-package/shuffle'`. Ils peuvent faire référence au point d'entrée principal d'un package par le nom du package, ou à un module de fonctionnalité spécifique au sein d'un package préfixé par le nom du package, conformément aux exemples respectifs. *L'inclusion de l'extension de fichier n'est nécessaire
que pour les packages sans champ <a href="packages.html#exports"><code>"exports"</code></a>.*
-  *Spécificateurs absolus* comme `'file:///opt/nodejs/config.js'`. Ils se réfèrent directement et explicitement à un chemin complet.

La résolution des spécificateurs nus est gérée par l'[algorithme de résolution et de chargement des modules Node.js](/fr/nodejs/api/esm#resolution-algorithm-specification). Toutes les autres résolutions de spécificateurs sont toujours résolues uniquement avec la sémantique de résolution [URL](https://url.spec.whatwg.org/) relative standard.

Comme dans CommonJS, les fichiers de module au sein des packages peuvent être accessibles en ajoutant un chemin d'accès au nom du package, sauf si le [`package.json`](/fr/nodejs/api/packages#nodejs-packagejson-field-definitions) du package contient un champ [`"exports"`](/fr/nodejs/api/packages#exports), auquel cas les fichiers au sein des packages ne peuvent être accessibles que via les chemins d'accès définis dans [`"exports"`](/fr/nodejs/api/packages#exports).

Pour plus de détails sur ces règles de résolution de packages qui s'appliquent aux spécificateurs nus dans la résolution de modules Node.js, voir la [documentation des packages](/fr/nodejs/api/packages).


### Extensions de fichier obligatoires {#mandatory-file-extensions}

Une extension de fichier doit être fournie lors de l'utilisation du mot-clé `import` pour résoudre les spécificateurs relatifs ou absolus. Les index de répertoire (par exemple, `'./startup/index.js'`) doivent également être entièrement spécifiés.

Ce comportement correspond à la façon dont `import` se comporte dans les environnements de navigateur, en supposant un serveur typiquement configuré.

### URLs {#urls}

Les modules ES sont résolus et mis en cache en tant qu'URLs. Cela signifie que les caractères spéciaux doivent être [encodés en pourcentage](/fr/nodejs/api/url#percent-encoding-in-urls), tels que `#` avec `%23` et `?` avec `%3F`.

Les schémas d'URL `file:`, `node:` et `data:` sont pris en charge. Un spécificateur comme `'https://example.com/app.js'` n'est pas pris en charge nativement dans Node.js, sauf si vous utilisez un [chargeur HTTPS personnalisé](/fr/nodejs/api/module#import-from-https).

#### URLs `file:` {#file-urls}

Les modules sont chargés plusieurs fois si le spécificateur `import` utilisé pour les résoudre a une requête ou un fragment différent.

```js [ESM]
import './foo.mjs?query=1'; // charge ./foo.mjs avec la requête "?query=1"
import './foo.mjs?query=2'; // charge ./foo.mjs avec la requête "?query=2"
```
La racine du volume peut être référencée via `/`, `//` ou `file:///`. Compte tenu des différences entre [URL](https://url.spec.whatwg.org/) et la résolution de chemin (tels que les détails de l'encodage en pourcentage), il est recommandé d'utiliser [url.pathToFileURL](/fr/nodejs/api/url#urlpathtofileurlpath-options) lors de l'importation d'un chemin.

#### Imports `data:` {#data-imports}

**Ajouté dans : v12.10.0**

Les [`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) sont prises en charge pour l'importation avec les types MIME suivants :

- `text/javascript` pour les modules ES
- `application/json` pour JSON
- `application/wasm` pour Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```
Les `data:` URLs ne résolvent que les [spécificateurs nus](/fr/nodejs/api/esm#terminology) pour les modules intégrés et les [spécificateurs absolus](/fr/nodejs/api/esm#terminology). La résolution des [spécificateurs relatifs](/fr/nodejs/api/esm#terminology) ne fonctionne pas car `data:` n'est pas un [schéma spécial](https://url.spec.whatwg.org/#special-scheme). Par exemple, tenter de charger `./foo` à partir de `data:text/javascript,import "./foo";` échoue à se résoudre car il n'y a pas de concept de résolution relative pour les `data:` URLs.


#### Imports `node:` {#node-imports}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0, v14.18.0 | Ajout de la prise en charge des imports `node:` à `require(...)`. |
| v14.13.1, v12.20.0 | Ajouté dans : v14.13.1, v12.20.0 |
:::

Les URL `node:` sont prises en charge comme moyen alternatif de charger les modules intégrés de Node.js. Ce schéma d'URL permet de référencer les modules intégrés par des chaînes d'URL absolues valides.

```js [ESM]
import fs from 'node:fs/promises';
```
## Attributs d'import {#import-attributes}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | Passage des assertions d'import aux attributs d'import. |
| v17.1.0, v16.14.0 | Ajouté dans : v17.1.0, v16.14.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Les [attributs d'import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) sont une syntaxe en ligne pour les instructions d'import de module afin de transmettre plus d'informations avec le spécificateur de module.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js ne prend en charge que l'attribut `type`, pour lequel il prend en charge les valeurs suivantes :

| Attribut `type` | Nécessaire pour |
| --- | --- |
| `'json'` | [Modules JSON](/fr/nodejs/api/esm#json-modules) |
L'attribut `type: 'json'` est obligatoire lors de l'importation de modules JSON.

## Modules intégrés {#built-in-modules}

Les [modules intégrés](/fr/nodejs/api/modules#built-in-modules) fournissent des exports nommés de leur API publique. Un export par défaut est également fourni, qui est la valeur des exports CommonJS. L'export par défaut peut être utilisé, entre autres, pour modifier les exports nommés. Les exports nommés des modules intégrés ne sont mis à jour qu'en appelant [`module.syncBuiltinESMExports()`](/fr/nodejs/api/module#modulesyncbuiltinesmexports).

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## Expressions `import()` {#import-expressions}

L'[import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) dynamique est pris en charge à la fois dans les modules CommonJS et ES. Dans les modules CommonJS, il peut être utilisé pour charger des modules ES.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La méta propriété `import.meta` est un `Object` qui contient les propriétés suivantes. Elle n'est prise en charge que dans les modules ES.

### `import.meta.dirname` {#importmetadirname}

**Ajouté dans: v21.2.0, v20.11.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).2 - Candidat à la version
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du répertoire du module actuel. C'est la même chose que [`path.dirname()`](/fr/nodejs/api/path#pathdirnamepath) de [`import.meta.filename`](/fr/nodejs/api/esm#importmetafilename).

### `import.meta.filename` {#importmetafilename}

**Ajouté dans: v21.2.0, v20.11.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).2 - Candidat à la version
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin d'accès absolu complet et le nom de fichier du module actuel, avec les liens symboliques résolus.
- C'est la même chose que [`url.fileURLToPath()`](/fr/nodejs/api/url#urlfileurltopathurl-options) de [`import.meta.url`](/fr/nodejs/api/esm#importmetaurl).

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL `file:` absolue du module.

Ceci est défini exactement de la même manière que dans les navigateurs fournissant l'URL du fichier de module actuel.

Cela permet des schémas utiles tels que le chargement de fichiers relatifs :

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.6.0, v18.19.0 | N'est plus derrière l'indicateur CLI `--experimental-import-meta-resolve`, sauf pour le paramètre non standard `parentURL`. |
| v20.6.0, v18.19.0 | Cette API ne lève plus d'exception lorsqu'elle cible des URL `file:` qui ne correspondent pas à un fichier existant sur le FS local. |
| v20.0.0, v18.19.0 | Cette API renvoie désormais une chaîne de caractères de manière synchrone au lieu d'une Promesse. |
| v16.2.0, v14.18.0 | Ajout de la prise en charge de l'objet WHATWG `URL` au paramètre `parentURL`. |
| v13.9.0, v12.16.2 | Ajouté dans: v13.9.0, v12.16.2 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).2 - Candidat à la version
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le spécificateur de module à résoudre par rapport au module actuel.
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La chaîne d'URL absolue vers laquelle le spécificateur serait résolu.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) est une fonction de résolution relative au module étendue à chaque module, renvoyant la chaîne d'URL.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
Toutes les fonctionnalités de la résolution de module Node.js sont prises en charge. Les résolutions de dépendance sont soumises aux résolutions d'exportations autorisées dans le package.

**Avertissements** :

- Cela peut entraîner des opérations synchrones sur le système de fichiers, ce qui peut avoir un impact sur les performances de la même manière que `require.resolve`.
- Cette fonctionnalité n'est pas disponible dans les chargeurs personnalisés (cela créerait un blocage).

**API non standard** :

Lorsque vous utilisez l'indicateur `--experimental-import-meta-resolve`, cette fonction accepte un deuxième argument :

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Une URL de module parent absolue facultative à partir de laquelle résoudre. **Par défaut :** `import.meta.url`


## Interopérabilité avec CommonJS {#interoperability-with-commonjs}

### Déclarations `import` {#import-statements}

Une déclaration `import` peut référencer un module ES ou un module CommonJS. Les déclarations `import` sont autorisées uniquement dans les modules ES, mais les expressions [`import()`](/fr/nodejs/api/esm#import-expressions) dynamiques sont prises en charge dans CommonJS pour charger les modules ES.

Lors de l'importation de [modules CommonJS](/fr/nodejs/api/esm#commonjs-namespaces), l'objet `module.exports` est fourni comme l'export par défaut. Des exports nommés peuvent être disponibles, fournis par une analyse statique par souci de commodité pour une meilleure compatibilité de l'écosystème.

### `require` {#require}

Le module CommonJS `require` ne prend actuellement en charge que le chargement des modules ES synchrones (c'est-à-dire les modules ES qui n'utilisent pas `await` au niveau supérieur).

Voir [Chargement des modules ECMAScript en utilisant `require()`](/fr/nodejs/api/modules#loading-ecmascript-modules-using-require) pour plus de détails.

### Espaces de noms CommonJS {#commonjs-namespaces}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Ajout du marqueur d'exportation `'module.exports'` aux espaces de noms CJS. |
| v14.13.0 | Ajouté dans : v14.13.0 |
:::

Les modules CommonJS sont constitués d'un objet `module.exports` qui peut être de n'importe quel type.

Pour prendre en charge cela, lors de l'importation de CommonJS à partir d'un module ECMAScript, un wrapper d'espace de noms pour le module CommonJS est construit, qui fournit toujours une clé d'exportation `default` pointant vers la valeur `module.exports` de CommonJS.

De plus, une analyse statique heuristique est effectuée sur le texte source du module CommonJS pour obtenir une liste statique des exports à fournir sur l'espace de noms à partir des valeurs sur `module.exports`. Ceci est nécessaire car ces espaces de noms doivent être construits avant l'évaluation du module CJS.

Ces objets d'espace de noms CommonJS fournissent également l'exportation `default` en tant qu'exportation nommée `'module.exports'`, afin d'indiquer sans ambiguïté que leur représentation dans CommonJS utilise cette valeur, et non la valeur de l'espace de noms. Cela reflète la sémantique de la gestion du nom d'exportation `'module.exports'` dans la prise en charge de l'interopérabilité [`require(esm)`](/fr/nodejs/api/modules#loading-ecmascript-modules-using-require).

Lors de l'importation d'un module CommonJS, il peut être importé de manière fiable en utilisant l'importation par défaut du module ES ou sa syntaxe simplifiée correspondante :

```js [ESM]
import { default as cjs } from 'cjs';
// Identique à ce qui précède
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Affiche :
//   <module.exports>
//   true
```
Cet objet exotique d'espace de noms de module peut être directement observé soit en utilisant `import * as m from 'cjs'`, soit un import dynamique :

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Affiche :
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
Pour une meilleure compatibilité avec l'utilisation existante dans l'écosystème JS, Node.js tente également de déterminer les exports nommés CommonJS de chaque module CommonJS importé afin de les fournir en tant qu'exports de module ES séparés à l'aide d'un processus d'analyse statique.

Par exemple, considérez un module CommonJS écrit :

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
Le module précédent prend en charge les imports nommés dans les modules ES :

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// Affiche : 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Affiche : { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Affiche :
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
Comme on peut le voir dans le dernier exemple de l'objet exotique d'espace de noms de module étant journalisé, l'exportation `name` est copiée à partir de l'objet `module.exports` et définie directement sur l'espace de noms du module ES lorsque le module est importé.

Les mises à jour de liaison en direct ou les nouvelles exportations ajoutées à `module.exports` ne sont pas détectées pour ces exports nommés.

La détection des exports nommés est basée sur des modèles de syntaxe courants, mais ne détecte pas toujours correctement les exports nommés. Dans ces cas, l'utilisation du formulaire d'importation par défaut décrit ci-dessus peut être une meilleure option.

La détection des exports nommés couvre de nombreux modèles d'exportation courants, les modèles de réexportation et les sorties d'outils de construction et de transpilateurs. Voir [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2) pour la sémantique exacte implémentée.


### Différences entre les modules ES et CommonJS {#differences-between-es-modules-and-commonjs}

#### Pas de `require`, `exports` ou `module.exports` {#no-require-exports-or-moduleexports}

Dans la plupart des cas, l'importation `import` des modules ES peut être utilisée pour charger des modules CommonJS.

Si nécessaire, une fonction `require` peut être construite dans un module ES en utilisant [`module.createRequire()`](/fr/nodejs/api/module#modulecreaterequirefilename).

#### Pas de `__filename` ou `__dirname` {#no-__filename-or-__dirname}

Ces variables CommonJS ne sont pas disponibles dans les modules ES.

Les cas d'utilisation de `__filename` et `__dirname` peuvent être reproduits via [`import.meta.filename`](/fr/nodejs/api/esm#importmetafilename) et [`import.meta.dirname`](/fr/nodejs/api/esm#importmetadirname).

#### Pas de chargement d'Addons {#no-addon-loading}

Les [Addons](/fr/nodejs/api/addons) ne sont actuellement pas pris en charge avec les importations de modules ES.

Ils peuvent à la place être chargés avec [`module.createRequire()`](/fr/nodejs/api/module#modulecreaterequirefilename) ou [`process.dlopen`](/fr/nodejs/api/process#processdlopenmodule-filename-flags).

#### Pas de `require.resolve` {#no-requireresolve}

La résolution relative peut être gérée via `new URL('./local', import.meta.url)`.

Pour un remplacement complet de `require.resolve`, il existe l'API [import.meta.resolve](/fr/nodejs/api/esm#importmetaresolvespecifier).

Alternativement, `module.createRequire()` peut être utilisé.

#### Pas de `NODE_PATH` {#no-node_path}

`NODE_PATH` ne fait pas partie de la résolution des spécificateurs `import`. Veuillez utiliser des liens symboliques si ce comportement est souhaité.

#### Pas de `require.extensions` {#no-requireextensions}

`require.extensions` n'est pas utilisé par `import`. Les hooks de personnalisation de modules peuvent fournir un remplacement.

#### Pas de `require.cache` {#no-requirecache}

`require.cache` n'est pas utilisé par `import` car le chargeur de modules ES a son propre cache séparé.

## Modules JSON {#json-modules}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.1.0 | Les modules JSON ne sont plus expérimentaux. |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Les fichiers JSON peuvent être référencés par `import`:

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
La syntaxe `with { type: 'json' }` est obligatoire ; voir [Attributs d’importation](/fr/nodejs/api/esm#import-attributes).

Le JSON importé expose uniquement une exportation `default`. Il n’y a aucune prise en charge pour les exportations nommées. Une entrée de cache est créée dans le cache CommonJS pour éviter la duplication. Le même objet est renvoyé dans CommonJS si le module JSON a déjà été importé à partir du même chemin.


## Modules Wasm {#wasm-modules}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

L'importation de modules WebAssembly est prise en charge sous l'indicateur `--experimental-wasm-modules`, permettant d'importer n'importe quel fichier `.wasm` comme des modules normaux tout en prenant en charge leurs importations de modules.

Cette intégration est conforme à la [Proposition d'intégration des modules ES pour WebAssembly](https://github.com/webassembly/esm-integration).

Par exemple, un `index.mjs` contenant :

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
exécuté sous :

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
fournirait l'interface des exports pour l'instanciation de `module.wasm`.

## `await` de niveau supérieur {#top-level-await}

**Ajouté dans : v14.8.0**

Le mot-clé `await` peut être utilisé dans le corps de niveau supérieur d'un module ECMAScript.

En supposant un `a.mjs` avec

```js [ESM]
export const five = await Promise.resolve(5);
```
Et un `b.mjs` avec

```js [ESM]
import { five } from './a.mjs';

console.log(five); // Affiche `5`
```
```bash [BASH]
node b.mjs # fonctionne
```
Si une expression `await` de niveau supérieur ne se résout jamais, le processus `node` se terminera avec un [code d'état](/fr/nodejs/api/process#exit-codes) `13`.

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Promise qui ne se résout jamais :
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Affiche `13`
});
```
## Chargeurs {#loaders}

L'ancienne documentation sur les chargeurs se trouve maintenant dans [Modules : Hooks de personnalisation](/fr/nodejs/api/module#customization-hooks).

## Algorithme de résolution et de chargement {#resolution-and-loading-algorithm}

### Fonctionnalités {#features}

Le résolveur par défaut possède les propriétés suivantes :

- Résolution basée sur FileURL comme celle utilisée par les modules ES
- Résolution d'URL relative et absolue
- Pas d'extensions par défaut
- Pas de `main` de dossier
- Recherche de résolution de package de spécificateur bare via node_modules
- Ne échoue pas sur les extensions ou les protocoles inconnus
- Peut éventuellement fournir un indice du format à la phase de chargement

Le chargeur par défaut possède les propriétés suivantes :

- Prise en charge du chargement de modules intégrés via les URL `node:`
- Prise en charge du chargement de modules « inline » via les URL `data:`
- Prise en charge du chargement de modules `file:`
- Échoue sur tout autre protocole d'URL
- Échoue sur les extensions inconnues pour le chargement `file:` (ne prend en charge que `.cjs`, `.js` et `.mjs`)


### Algorithme de résolution {#resolution-algorithm}

L'algorithme pour charger un spécificateur de module ES est donné par la méthode **ESM_RESOLVE** ci-dessous. Il renvoie l'URL résolue pour un spécificateur de module par rapport à une parentURL.

L'algorithme de résolution détermine l'URL résolue complète pour un chargement de module, ainsi que son format de module suggéré. L'algorithme de résolution ne détermine pas si le protocole de l'URL résolue peut être chargé, ou si les extensions de fichier sont autorisées, ces validations sont plutôt appliquées par Node.js pendant la phase de chargement (par exemple, s'il a été demandé de charger une URL ayant un protocole qui n'est pas `file:`, `data:` ou `node:`).

L'algorithme essaie également de déterminer le format du fichier en fonction de l'extension (voir l'algorithme `ESM_FILE_FORMAT` ci-dessous). S'il ne reconnaît pas l'extension de fichier (par exemple, si ce n'est pas `.mjs`, `.cjs` ou `.json`), alors un format `undefined` est renvoyé, ce qui lèvera une erreur pendant la phase de chargement.

L'algorithme pour déterminer le format de module d'une URL résolue est fourni par **ESM_FILE_FORMAT**, qui renvoie le format de module unique pour n'importe quel fichier. Le format *"module"* est renvoyé pour un module ECMAScript, tandis que le format *"commonjs"* est utilisé pour indiquer un chargement via l'ancien chargeur CommonJS. Des formats supplémentaires tels que *"addon"* peuvent être étendus dans de futures mises à jour.

Dans les algorithmes suivants, toutes les erreurs de sous-routine sont propagées comme des erreurs de ces routines de niveau supérieur, sauf indication contraire.

*defaultConditions* est le tableau de noms d'environnement conditionnel, `["node", "import"]`.

Le résolveur peut lever les erreurs suivantes :

- *Invalid Module Specifier* : Le spécificateur de module est une URL, un nom de package ou un spécificateur de sous-chemin de package non valide.
- *Invalid Package Configuration* : La configuration package.json est non valide ou contient une configuration non valide.
- *Invalid Package Target* : Les exports ou imports de package définissent un module cible pour le package qui est un type ou une cible de chaîne non valide.
- *Package Path Not Exported* : Les exports de package ne définissent ni n'autorisent un sous-chemin cible dans le package pour le module donné.
- *Package Import Not Defined* : Les imports de package ne définissent pas le spécificateur.
- *Module Not Found* : Le package ou le module demandé n'existe pas.
- *Unsupported Directory Import* : Le chemin résolu correspond à un répertoire, qui n'est pas une cible prise en charge pour les imports de module.


### Spécification de l'algorithme de résolution {#resolution-algorithm-specification}

**ESM_RESOLVE**(*spécificateur*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*spécificateur*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### Personnalisation de l'algorithme de résolution des spécificateurs ESM {#customizing-esm-specifier-resolution-algorithm}

Les [Hooks de personnalisation des modules](/fr/nodejs/api/module#customization-hooks) fournissent un mécanisme pour personnaliser l'algorithme de résolution des spécificateurs ESM. Un exemple qui fournit une résolution de style CommonJS pour les spécificateurs ESM est [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader).

