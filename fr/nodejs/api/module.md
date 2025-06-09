---
title: Documentation Node.js - Système de modules
description: Cette page fournit une documentation détaillée sur le système de modules de Node.js, y compris les modules CommonJS et ES, comment charger des modules, la mise en cache des modules, et les différences entre les deux systèmes de modules.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Système de modules | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette page fournit une documentation détaillée sur le système de modules de Node.js, y compris les modules CommonJS et ES, comment charger des modules, la mise en cache des modules, et les différences entre les deux systèmes de modules.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Système de modules | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette page fournit une documentation détaillée sur le système de modules de Node.js, y compris les modules CommonJS et ES, comment charger des modules, la mise en cache des modules, et les différences entre les deux systèmes de modules.
---


# Modules : API `node:module` {#modules-nodemodule-api}

**Ajoutée dans : v0.3.7**

## L'objet `Module` {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Fournit des méthodes utilitaires générales lors de l'interaction avec des instances de `Module`, la variable [`module`](/fr/nodejs/api/module#the-module-object) souvent vue dans les modules [CommonJS](/fr/nodejs/api/modules). Accessible via `import 'node:module'` ou `require('node:module')`.

### `module.builtinModules` {#modulebuiltinmodules}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | La liste contient désormais également les modules avec préfixe uniquement. |
| v9.3.0, v8.10.0, v6.13.0 | Ajoutée dans : v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Une liste des noms de tous les modules fournis par Node.js. Peut être utilisée pour vérifier si un module est maintenu par un tiers ou non.

`module` dans ce contexte n'est pas le même objet que celui fourni par le [wrapper de module](/fr/nodejs/api/modules#the-module-wrapper). Pour y accéder, require le module `Module` :

::: code-group
```js [ESM]
// module.mjs
// Dans un module ECMAScript
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// Dans un module CommonJS
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**Ajoutée dans : v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Nom de fichier à utiliser pour construire la fonction require. Doit être un objet URL de fichier, une chaîne URL de fichier ou une chaîne de chemin absolu.
- Retourne : [\<require\>](/fr/nodejs/api/modules#requireid) Fonction Require

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js est un module CommonJS.
const siblingModule = require('./sibling-module');
```

### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**Ajoutée dans : v23.2.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Le spécificateur du module dont le `package.json` doit être récupéré. Lors du passage d'un *spécificateur nu*, le `package.json` à la racine du package est retourné. Lors du passage d'un *spécificateur relatif* ou d'un *spécificateur absolu*, le `package.json` parent le plus proche est retourné.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) L'emplacement absolu (chaîne d'URL `file :` ou chemin FS) du module conteneur. Pour CJS, utilisez `__filename` (pas `__dirname` !) ; pour ESM, utilisez `import.meta.url`. Vous n'avez pas besoin de le passer si `specifier` est un `absolute specifier`.
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un chemin si le `package.json` est trouvé. Lorsque `startLocation` est un package, le `package.json` racine du package ; lorsque `startLocation` est relatif ou non résolu, le `package.json` le plus proche de `startLocation`.

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```

::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// Même résultat lors du passage d'un spécificateur absolu :
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Lors du passage d'un spécificateur absolu, vous pourriez obtenir un résultat différent si le
// module résolu se trouve dans un sous-dossier qui a un `package.json` imbriqué.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// Même résultat lors du passage d'un spécificateur absolu :
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// Lors du passage d'un spécificateur absolu, vous pourriez obtenir un résultat différent si le
// module résolu se trouve dans un sous-dossier qui a un `package.json` imbriqué.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::

### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**Ajouté dans : v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du module
- Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) renvoie true si le module est intégré, sinon renvoie false

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.8.0, v18.19.0 | Ajout de la prise en charge des instances d'URL WHATWG. |
| v20.6.0, v18.19.0 | Ajouté dans : v20.6.0, v18.19.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).2 - Version candidate
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Hooks de personnalisation à enregistrer ; il doit s'agir de la même chaîne qui serait passée à `import()`, sauf que si elle est relative, elle est résolue par rapport à `parentURL`.
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Si vous souhaitez résoudre `specifier` par rapport à une URL de base, telle que `import.meta.url`, vous pouvez passer cette URL ici. **Par défaut :** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Si vous souhaitez résoudre `specifier` par rapport à une URL de base, telle que `import.meta.url`, vous pouvez passer cette URL ici. Cette propriété est ignorée si `parentURL` est fourni comme deuxième argument. **Par défaut :** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Toute valeur JavaScript arbitraire et clonable à passer dans le hook [`initialize`](/fr/nodejs/api/module#initialize).
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [objets transférables](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist) à passer dans le hook `initialize`.
  
 

Enregistre un module qui exporte des [hooks](/fr/nodejs/api/module#customization-hooks) qui personnalisent la résolution de module Node.js et le comportement de chargement. Voir [Hooks de personnalisation](/fr/nodejs/api/module#customization-hooks).


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Ajouté dans : v23.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Voir [load hook](/fr/nodejs/api/module#loadurl-context-nextload). **Par défaut :** `undefined`.
    - `resolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Voir [resolve hook](/fr/nodejs/api/module#resolvespecifier-context-nextresolve). **Par défaut :** `undefined`.

Enregistre les [hooks](/fr/nodejs/api/module#customization-hooks) qui personnalisent la résolution et le comportement de chargement des modules Node.js. Voir [Customization hooks](/fr/nodejs/api/module#customization-hooks).

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Ajouté dans : v23.2.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code dont il faut supprimer les annotations de type.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'strip'`. Les valeurs possibles sont :
    - `'strip'` Supprimer uniquement les annotations de type sans effectuer la transformation des fonctionnalités TypeScript.
    - `'transform'` Supprimer les annotations de type et transformer les fonctionnalités TypeScript en JavaScript.

    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`. Uniquement lorsque `mode` est `'transform'`, si `true`, une source map sera générée pour le code transformé.
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie l'URL source utilisée dans la source map.

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code avec les annotations de type supprimées. `module.stripTypeScriptTypes()` supprime les annotations de type du code TypeScript. Il peut être utilisé pour supprimer les annotations de type du code TypeScript avant de l'exécuter avec `vm.runInContext()` ou `vm.compileFunction()`. Par défaut, il génère une erreur si le code contient des fonctionnalités TypeScript qui nécessitent une transformation, telles que `Enums`, voir [type-stripping](/fr/nodejs/api/typescript#type-stripping) pour plus d'informations. Lorsque le mode est `'transform'`, il transforme également les fonctionnalités TypeScript en JavaScript, voir [transform TypeScript features](/fr/nodejs/api/typescript#typescript-features) pour plus d'informations. Lorsque le mode est `'strip'`, les source maps ne sont pas générées, car les emplacements sont préservés. Si `sourceMap` est fourni, lorsqu'il est en mode `'strip'`, une erreur sera générée.

*ATTENTION* : La sortie de cette fonction ne doit pas être considérée comme stable entre les versions de Node.js, en raison des modifications apportées à l'analyseur TypeScript.

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
:::

Si `sourceUrl` est fourni, il sera ajouté en tant que commentaire à la fin de la sortie :

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

Lorsque `mode` est `'transform'`, le code est transformé en JavaScript :

::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::


### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**Ajoutée dans : v12.12.0**

La méthode `module.syncBuiltinESMExports()` met à jour toutes les liaisons actives pour les [Modules ES](/fr/nodejs/api/esm) intégrés afin de correspondre aux propriétés des exports [CommonJS](/fr/nodejs/api/modules). Elle n'ajoute ni ne supprime les noms exportés des [Modules ES](/fr/nodejs/api/esm).

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // Il synchronise la propriété readFile existante avec la nouvelle valeur
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync a été supprimé du fs requis
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() ne supprime pas readFileSync de esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() n'ajoute pas de noms
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## Cache de compilation de module {#module-compile-cache}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.8.0 | ajout des API JavaScript initiales pour l'accès à l'exécution. |
| v22.1.0 | Ajoutée dans : v22.1.0 |
:::

Le cache de compilation de module peut être activé soit en utilisant la méthode [`module.enableCompileCache()`](/fr/nodejs/api/module#moduleenablecompilecachecachedir), soit la variable d'environnement [`NODE_COMPILE_CACHE=dir`](/fr/nodejs/api/cli#node_compile_cachedir). Une fois activé, chaque fois que Node.js compile un module CommonJS ou un module ECMAScript, il utilise le [cache de code V8](https://v8.dev/blog/code-caching-for-devs) sur disque, persistant dans le répertoire spécifié, pour accélérer la compilation. Cela peut ralentir le premier chargement d'un graphe de modules, mais les chargements suivants du même graphe de modules peuvent être considérablement accélérés si le contenu des modules ne change pas.

Pour nettoyer le cache de compilation généré sur le disque, supprimez simplement le répertoire du cache. Le répertoire du cache sera recréé la prochaine fois que le même répertoire sera utilisé pour le stockage du cache de compilation. Pour éviter de remplir le disque avec un cache obsolète, il est recommandé d'utiliser un répertoire sous [`os.tmpdir()`](/fr/nodejs/api/os#ostmpdir). Si le cache de compilation est activé par un appel à [`module.enableCompileCache()`](/fr/nodejs/api/module#moduleenablecompilecachecachedir) sans spécifier le répertoire, Node.js utilise la variable d'environnement [`NODE_COMPILE_CACHE=dir`](/fr/nodejs/api/cli#node_compile_cachedir) si elle est définie, ou par défaut `path.join(os.tmpdir(), 'node-compile-cache')` sinon. Pour localiser le répertoire du cache de compilation utilisé par une instance Node.js en cours d'exécution, utilisez [`module.getCompileCacheDir()`](/fr/nodejs/api/module#modulegetcompilecachedir).

Actuellement, lors de l'utilisation du cache de compilation avec la [couverture de code JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage), la couverture collectée par V8 peut être moins précise dans les fonctions qui sont désérialisées à partir du cache de code. Il est recommandé de désactiver cela lors de l'exécution de tests pour générer une couverture précise.

Le cache de compilation de module activé peut être désactivé par la variable d'environnement [`NODE_DISABLE_COMPILE_CACHE=1`](/fr/nodejs/api/cli#node_disable_compile_cache1). Cela peut être utile lorsque le cache de compilation entraîne des comportements inattendus ou indésirables (par exemple, une couverture de test moins précise).

Le cache de compilation généré par une version de Node.js ne peut pas être réutilisé par une version différente de Node.js. Le cache généré par différentes versions de Node.js sera stocké séparément si le même répertoire de base est utilisé pour conserver le cache, afin qu'ils puissent coexister.

Pour le moment, lorsque le cache de compilation est activé et qu'un module est chargé à nouveau, le cache de code est généré à partir du code compilé immédiatement, mais ne sera écrit sur le disque que lorsque l'instance Node.js est sur le point de quitter. Ceci est sujet à changement. La méthode [`module.flushCompileCache()`](/fr/nodejs/api/module#moduleflushcompilecache) peut être utilisée pour s'assurer que le cache de code accumulé est vidé sur le disque au cas où l'application souhaite générer d'autres instances Node.js et leur permettre de partager le cache bien avant que le parent ne quitte.


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**Ajouté dans : v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Les constantes suivantes sont renvoyées comme champ `status` dans l'objet retourné par [`module.enableCompileCache()`](/fr/nodejs/api/module#moduleenablecompilecachecachedir) pour indiquer le résultat de la tentative d'activation du [cache de compilation de module](/fr/nodejs/api/module#module-compile-cache).

| Constante | Description |
| --- | --- |
| `ENABLED` |        Node.js a activé le cache de compilation avec succès. Le répertoire utilisé pour stocker le cache de compilation sera renvoyé dans le champ `directory` de l'objet renvoyé. |
| `ALREADY_ENABLED` |        Le cache de compilation a déjà été activé, soit par un appel précédent à         `module.enableCompileCache()`  , soit par la variable d'environnement   `NODE_COMPILE_CACHE=dir`. Le répertoire utilisé pour stocker le cache de compilation sera renvoyé dans le champ `directory` de l'objet renvoyé. |
| `FAILED` |        Node.js ne parvient pas à activer le cache de compilation. Cela peut être dû à un manque d'autorisation d'utiliser le répertoire spécifié, ou à divers types d'erreurs de système de fichiers. Le détail de l'échec sera renvoyé dans le champ `message` de l'objet renvoyé. |
| `DISABLED` |        Node.js ne peut pas activer le cache de compilation car la variable d'environnement `NODE_DISABLE_COMPILE_CACHE=1` a été définie. |
### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**Ajouté dans : v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Chemin d'accès optionnel pour spécifier le répertoire où le cache de compilation sera stocké/récupéré.
- Renvoie : [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `status` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) L'une des valeurs de [`module.constants.compileCacheStatus`](/fr/nodejs/api/module#moduleconstantscompilecachestatus)
    - `message` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Si Node.js ne peut pas activer le cache de compilation, ceci contient le message d'erreur. Défini uniquement si `status` est `module.constants.compileCacheStatus.FAILED`.
    - `directory` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Undefined_type) Si le cache de compilation est activé, ceci contient le répertoire où le cache de compilation est stocké. Défini uniquement si `status` est `module.constants.compileCacheStatus.ENABLED` ou `module.constants.compileCacheStatus.ALREADY_ENABLED`.
  
 

Active le [cache de compilation de module](/fr/nodejs/api/module#module-compile-cache) dans l'instance Node.js actuelle.

Si `cacheDir` n'est pas spécifié, Node.js utilisera soit le répertoire spécifié par la variable d'environnement [`NODE_COMPILE_CACHE=dir`](/fr/nodejs/api/cli#node_compile_cachedir) si elle est définie, soit utilisera `path.join(os.tmpdir(), 'node-compile-cache')` sinon. Pour les cas d'utilisation généraux, il est recommandé d'appeler `module.enableCompileCache()` sans spécifier le `cacheDir`, afin que le répertoire puisse être remplacé par la variable d'environnement `NODE_COMPILE_CACHE` si nécessaire.

Étant donné que le cache de compilation est censé être une optimisation silencieuse qui n'est pas nécessaire au fonctionnement de l'application, cette méthode est conçue pour ne pas lever d'exception lorsque le cache de compilation ne peut pas être activé. Au lieu de cela, elle renverra un objet contenant un message d'erreur dans le champ `message` pour faciliter le débogage. Si le cache de compilation est activé avec succès, le champ `directory` dans l'objet renvoyé contient le chemin d'accès au répertoire où le cache de compilation est stocké. Le champ `status` dans l'objet renvoyé serait l'une des valeurs `module.constants.compileCacheStatus` pour indiquer le résultat de la tentative d'activation du [cache de compilation de module](/fr/nodejs/api/module#module-compile-cache).

Cette méthode n'affecte que l'instance Node.js actuelle. Pour l'activer dans les threads worker enfants, soit appelez également cette méthode dans les threads worker enfants, soit définissez la valeur de `process.env.NODE_COMPILE_CACHE` sur le répertoire du cache de compilation afin que le comportement puisse être hérité dans les worker enfants. Le répertoire peut être obtenu soit à partir du champ `directory` renvoyé par cette méthode, soit avec [`module.getCompileCacheDir()`](/fr/nodejs/api/module#modulegetcompilecachedir).


### `module.flushCompileCache()` {#moduleflushcompilecache}

**Ajouté dans : v23.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

Vide le [cache de compilation du module](/fr/nodejs/api/module#module-compile-cache) accumulé à partir des modules déjà chargés dans l'instance Node.js actuelle sur le disque. Cette fonction est renvoyée une fois que toutes les opérations du système de fichiers de vidage sont terminées, qu'elles réussissent ou non. S'il y a des erreurs, cela échouera silencieusement, car les échecs du cache de compilation ne devraient pas interférer avec le fonctionnement réel de l'application.

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**Ajouté dans : v22.8.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Chemin vers le répertoire [cache de compilation du module](/fr/nodejs/api/module#module-compile-cache) s'il est activé, ou `undefined` sinon.

## Hooks de personnalisation {#customization-hooks}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | Ajout du support pour les hooks synchrones et in-thread. |
| v20.6.0, v18.19.0 | Ajout du hook `initialize` pour remplacer `globalPreload`. |
| v18.6.0, v16.17.0 | Ajout du support pour l'enchaînement des chargeurs. |
| v16.12.0 | Suppression de `getFormat`, `getSource`, `transformSource` et `globalPreload` ; ajout du hook `load` et du hook `getGlobalPreload`. |
| v8.8.0 | Ajouté dans : v8.8.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index).2 - Candidat à la publication (version asynchrone) Stabilité : 1.1 - Développement actif (version synchrone)
:::

Il existe deux types de hooks de personnalisation de module actuellement pris en charge :

### Activation {#enabling}

La résolution et le chargement des modules peuvent être personnalisés par :

Les hooks peuvent être enregistrés avant l'exécution du code de l'application en utilisant l'indicateur [`--import`](/fr/nodejs/api/cli#--importmodule) ou [`--require`](/fr/nodejs/api/cli#-r---require-module) :

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```

::: code-group
```js [ESM]
// register-hooks.js
// Ce fichier ne peut être require()-ed que s'il ne contient pas de await de premier niveau.
// Utilisez module.register() pour enregistrer des hooks asynchrones dans un thread dédié.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// Utilisez module.register() pour enregistrer des hooks asynchrones dans un thread dédié.
register('./hooks.mjs', pathToFileURL(__filename));
```
:::

::: code-group
```js [ESM]
// Utilisez module.registerHooks() pour enregistrer les hooks synchrones dans le thread principal.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* implémentation */ },
  load(url, context, nextLoad) { /* implémentation */ },
});
```

```js [CJS]
// Utilisez module.registerHooks() pour enregistrer les hooks synchrones dans le thread principal.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* implémentation */ },
  load(url, context, nextLoad) { /* implémentation */ },
});
```
:::

Le fichier passé à `--import` ou `--require` peut également être une exportation d'une dépendance :

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
Où `some-package` a un champ [`"exports"`](/fr/nodejs/api/packages#exports) définissant l'exportation `/register` à mapper à un fichier qui appelle `register()`, comme l'exemple `register-hooks.js` suivant.

L'utilisation de `--import` ou `--require` garantit que les hooks sont enregistrés avant l'importation des fichiers d'application, y compris le point d'entrée de l'application et pour tous les threads de travail par défaut également.

Alternativement, `register()` et `registerHooks()` peuvent être appelés à partir du point d'entrée, bien que `import()` dynamique doit être utilisé pour tout code ESM qui doit être exécuté après l'enregistrement des hooks.

::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// Parce qu'il s'agit d'un `import()` dynamique, les hooks `http-to-https` s'exécuteront
// pour gérer `./my-app.js` et tous les autres fichiers qu'il importe ou nécessite.
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// Parce qu'il s'agit d'un `import()` dynamique, les hooks `http-to-https` s'exécuteront
// pour gérer `./my-app.js` et tous les autres fichiers qu'il importe ou nécessite.
import('./my-app.js');
```
:::

Les hooks de personnalisation s'exécuteront pour tous les modules chargés plus tard que l'enregistrement et les modules auxquels ils font référence via `import` et le `require` intégré. La fonction `require` créée par les utilisateurs à l'aide de `module.createRequire()` ne peut être personnalisée que par les hooks synchrones.

Dans cet exemple, nous enregistrons les hooks `http-to-https`, mais ils ne seront disponibles que pour les modules importés ultérieurement, dans ce cas, `my-app.js` et tout ce qu'il référence via `import` ou `require` intégré dans les dépendances CommonJS.

Si le `import('./my-app.js')` avait plutôt été un `import './my-app.js'` statique, l'application aurait *déjà* été chargée **avant** que les hooks `http-to-https` ne soient enregistrés. Cela est dû à la spécification des modules ES, où les importations statiques sont évaluées d'abord à partir des feuilles de l'arbre, puis en remontant vers le tronc. Il peut y avoir des importations statiques *dans* `my-app.js`, qui ne seront pas évaluées tant que `my-app.js` n'aura pas été importé dynamiquement.

Si des hooks synchrones sont utilisés, `import`, `require` et l'utilisateur `require` créé à l'aide de `createRequire()` sont pris en charge.

::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* implémentation des hooks synchrones */ });

const require = createRequire(import.meta.url);

// Les hooks synchrones affectent import, require() et la fonction require() utilisateur
// créée via createRequire().
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* implémentation des hooks synchrones */ });

const userRequire = createRequire(__filename);

// Les hooks synchrones affectent import, require() et la fonction require() utilisateur
// créée via createRequire().
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

Enfin, si tout ce que vous voulez faire est d'enregistrer des hooks avant l'exécution de votre application et que vous ne voulez pas créer un fichier séparé à cet effet, vous pouvez passer une URL `data:` à `--import` :

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### Chaînage {#chaining}

Il est possible d'appeler `register` plus d'une fois :

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

Dans cet exemple, les hooks enregistrés formeront des chaînes. Ces chaînes s'exécutent de la dernière entrée à la première sortie (LIFO). Si `foo.mjs` et `bar.mjs` définissent tous les deux un hook `resolve`, ils seront appelés comme suit (notez la lecture de droite à gauche) : valeur par défaut de Node ← `./foo.mjs` ← `./bar.mjs` (en commençant par `./bar.mjs`, puis `./foo.mjs`, puis la valeur par défaut de Node.js). Il en va de même pour tous les autres hooks.

Les hooks enregistrés affectent également `register` lui-même. Dans cet exemple, `bar.mjs` sera résolu et chargé via les hooks enregistrés par `foo.mjs` (car les hooks de `foo` auront déjà été ajoutés à la chaîne). Cela permet de faire des choses comme écrire des hooks dans des langages autres que JavaScript, à condition que les hooks enregistrés plus tôt soient transpilés en JavaScript.

La méthode `register` ne peut pas être appelée depuis le module qui définit les hooks.

Le chaînage de `registerHooks` fonctionne de manière similaire. Si des hooks synchrones et asynchrones sont mélangés, les hooks synchrones sont toujours exécutés avant le démarrage des hooks asynchrones, c'est-à-dire que, dans le dernier hook synchrone en cours d'exécution, son hook suivant inclut l'invocation des hooks asynchrones.

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* implementation of hooks */ };
const hook2 = { /* implementation of hooks */ };
// hook2 run before hook1.
registerHooks(hook1);
registerHooks(hook2);
```
:::


### Communication avec les hooks de personnalisation de module {#communication-with-module-customization-hooks}

Les hooks asynchrones s'exécutent sur un thread dédié, séparé du thread principal qui exécute le code de l'application. Cela signifie que la modification des variables globales n'affectera pas les autres threads, et que des canaux de messages doivent être utilisés pour communiquer entre les threads.

La méthode `register` peut être utilisée pour transmettre des données à un hook [`initialize`](/fr/nodejs/api/module#initialize). Les données transmises au hook peuvent inclure des objets transférables comme des ports.

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Cet exemple montre comment un canal de messages peut être utilisé pour
// communiquer avec les hooks, en envoyant `port2` aux hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Cet exemple montre comment un canal de messages peut être utilisé pour
// communiquer avec les hooks, en envoyant `port2` aux hooks.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

Les hooks de module synchrones sont exécutés sur le même thread que celui où le code de l'application est exécuté. Ils peuvent directement modifier les variables globales du contexte auquel le thread principal accède.

### Hooks {#hooks}

#### Hooks asynchrones acceptés par `module.register()` {#asynchronous-hooks-accepted-by-moduleregister}

La méthode [`register`](/fr/nodejs/api/module#moduleregisterspecifier-parenturl-options) peut être utilisée pour enregistrer un module qui exporte un ensemble de hooks. Les hooks sont des fonctions qui sont appelées par Node.js pour personnaliser la résolution de module et le processus de chargement. Les fonctions exportées doivent avoir des noms et des signatures spécifiques, et elles doivent être exportées en tant qu'exports nommés.

```js [ESM]
export async function initialize({ number, port }) {
  // Reçoit les données de `register`.
}

export async function resolve(specifier, context, nextResolve) {
  // Prend un spécificateur `import` ou `require` et le résout en une URL.
}

export async function load(url, context, nextLoad) {
  // Prend une URL résolue et renvoie le code source à évaluer.
}
```
Les hooks asynchrones sont exécutés dans un thread séparé, isolé du thread principal où le code de l'application est exécuté. Cela signifie qu'il s'agit d'un [realm](https://tc39.es/ecma262/#realm) différent. Le thread des hooks peut être terminé par le thread principal à tout moment, donc ne comptez pas sur les opérations asynchrones (comme `console.log`) pour se terminer. Ils sont hérités par défaut dans les workers enfants.


#### Hooks synchrones acceptés par `module.registerHooks()` {#synchronous-hooks-accepted-by-moduleregisterhooks}

**Ajouté dans : v23.5.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif
:::

La méthode `module.registerHooks()` accepte les fonctions de hook synchrones. `initialize()` n’est pas pris en charge ni nécessaire, car l’implémenteur de hook peut simplement exécuter le code d’initialisation directement avant l’appel à `module.registerHooks()`.

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // Prend un identifiant `import` ou `require` et le résout en une URL.
}

function load(url, context, nextLoad) {
  // Prend une URL résolue et renvoie le code source à évaluer.
}
```

Les hooks synchrones sont exécutés dans le même thread et le même [realm](https://tc39.es/ecma262/#realm) où les modules sont chargés. Contrairement aux hooks asynchrones, ils ne sont pas hérités par défaut dans les threads de worker enfants, bien que si les hooks sont enregistrés à l’aide d’un fichier préchargé par [`--import`](/fr/nodejs/api/cli#--importmodule) ou [`--require`](/fr/nodejs/api/cli#-r---require-module), les threads de worker enfants peuvent hériter des scripts préchargés via l’héritage `process.execArgv`. Consultez [la documentation de `Worker`](/fr/nodejs/api/worker_threads#new-workerfilename-options) pour plus de détails.

Dans les hooks synchrones, les utilisateurs peuvent s’attendre à ce que `console.log()` se termine de la même manière qu’ils s’attendent à ce que `console.log()` dans le code du module se termine.

#### Conventions des hooks {#conventions-of-hooks}

Les hooks font partie d’une [chaîne](/fr/nodejs/api/module#chaining), même si cette chaîne ne comprend qu’un seul hook personnalisé (fourni par l’utilisateur) et le hook par défaut, qui est toujours présent. Les fonctions de hook s’imbriquent : chacune doit toujours renvoyer un objet simple, et le chaînage se produit à la suite de chaque fonction appelant `next\<hookName\>()`, qui est une référence au hook du chargeur suivant (dans l’ordre LIFO).

Un hook qui renvoie une valeur dépourvue d’une propriété requise déclenche une exception. Un hook qui renvoie sans appeler `next\<hookName\>()` *et* sans renvoyer `shortCircuit: true` déclenche également une exception. Ces erreurs visent à éviter les ruptures involontaires dans la chaîne. Renvoyez `shortCircuit: true` d’un hook pour signaler que la chaîne se termine intentionnellement à votre hook.


#### `initialize()` {#initialize}

**Ajouté dans : v20.6.0, v18.19.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stable : 1](/fr/nodejs/api/documentation#stability-index).2 - Candidat à la publication
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Les données de `register(loader, import.meta.url, { data })`.

Le hook `initialize` est uniquement accepté par [`register`](/fr/nodejs/api/module#moduleregisterspecifier-parenturl-options). `registerHooks()` ne le prend pas en charge et n’en a pas besoin, car l’initialisation effectuée pour les hooks synchrones peut être exécutée directement avant l’appel à `registerHooks()`.

Le hook `initialize` permet de définir une fonction personnalisée qui s’exécute dans le thread des hooks lorsque le module des hooks est initialisé. L’initialisation a lieu lorsque le module des hooks est enregistré via [`register`](/fr/nodejs/api/module#moduleregisterspecifier-parenturl-options).

Ce hook peut recevoir des données d’un appel [`register`](/fr/nodejs/api/module#moduleregisterspecifier-parenturl-options), y compris des ports et d’autres objets transférables. La valeur de retour de `initialize` peut être une [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), auquel cas elle sera attendue avant que l’exécution du thread d’application principal ne reprenne.

Code de personnalisation du module :

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
Code de l’appelant :



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// Cet exemple montre comment un canal de messages peut être utilisé pour communiquer
// entre le thread principal (d’application) et les hooks exécutés sur le thread
// des hooks, en envoyant `port2` au hook `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// Cet exemple montre comment un canal de messages peut être utilisé pour communiquer
// entre le thread principal (d’application) et les hooks exécutés sur le thread
// des hooks, en envoyant `port2` au hook `initialize`.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | Ajout du support pour les hooks synchrones et in-thread. |
| v21.0.0, v20.10.0, v18.19.0 | La propriété `context.importAssertions` est remplacée par `context.importAttributes`. L'utilisation de l'ancien nom est toujours prise en charge et émettra un avertissement expérimental. |
| v18.6.0, v16.17.0 | Ajout du support pour chaîner les hooks de résolution. Chaque hook doit soit appeler `nextResolve()` soit inclure une propriété `shortCircuit` définie sur `true` dans son retour. |
| v17.1.0, v16.14.0 | Ajout du support des assertions d'importation. |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).2 - Candidat à la publication (version asynchrone) Stabilité : 1.1 - Développement actif (version synchrone)
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Conditions d'exportation du `package.json` pertinent
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet dont les paires clé-valeur représentent les attributs du module à importer
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le module important celui-ci, ou undefined si c'est le point d'entrée de Node.js


- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le hook `resolve` suivant dans la chaîne, ou le hook `resolve` par défaut de Node.js après le dernier hook `resolve` fourni par l'utilisateur
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La version asynchrone prend soit un objet contenant les propriétés suivantes, soit une `Promise` qui sera résolue en un tel objet. La version synchrone n'accepte qu'un objet renvoyé de manière synchrone.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un indice pour le hook de chargement (il peut être ignoré) `'builtin' | 'commonjs' | 'json' | 'module' | 'wasm'`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Les attributs d'importation à utiliser lors de la mise en cache du module (facultatif ; s'il est exclu, l'entrée sera utilisée)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un signal indiquant que ce hook a l'intention de terminer la chaîne de hooks `resolve`. **Par défaut :** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL absolue à laquelle cette entrée est résolue


La chaîne de hooks `resolve` est chargée d'indiquer à Node.js où trouver et comment mettre en cache une instruction ou une expression `import` donnée, ou un appel `require`. Il peut éventuellement renvoyer un format (tel que `'module'`) comme indication au hook `load`. Si un format est spécifié, le hook `load` est en fin de compte responsable de la fourniture de la valeur finale de `format` (et il est libre d'ignorer l'indication fournie par `resolve`) ; si `resolve` fournit un `format`, un hook `load` personnalisé est requis, même si ce n'est que pour transmettre la valeur au hook `load` par défaut de Node.js.

Les attributs de type d'importation font partie de la clé de cache pour enregistrer les modules chargés dans le cache de modules interne. Le hook `resolve` est chargé de renvoyer un objet `importAttributes` si le module doit être mis en cache avec des attributs différents de ceux présents dans le code source.

La propriété `conditions` dans `context` est un tableau de conditions qui seront utilisées pour faire correspondre [les conditions d'exportation de package](/fr/nodejs/api/packages#conditional-exports) pour cette demande de résolution. Ils peuvent être utilisés pour rechercher des mappages conditionnels ailleurs ou pour modifier la liste lors de l'appel à la logique de résolution par défaut.

Les [conditions d'exportation de package](/fr/nodejs/api/packages#conditional-exports) actuelles sont toujours dans le tableau `context.conditions` transmis au hook. Pour garantir *le comportement de résolution du spécificateur de module Node.js par défaut* lors de l'appel à `defaultResolve`, le tableau `context.conditions` qui lui est transmis *doit* inclure *tous* les éléments du tableau `context.conditions` initialement transmis au hook `resolve`.

```js [ESM]
// Version asynchrone acceptée par module.register().
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // Une certaine condition.
    // Pour certains ou tous les spécificateurs, effectuez une logique personnalisée pour la résolution.
    // Renvoie toujours un objet de la forme {url: <string>}.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // Une autre condition.
    // Lors de l'appel de `defaultResolve`, les arguments peuvent être modifiés. Dans ce
    // cas, il ajoute une autre valeur pour faire correspondre les exportations conditionnelles.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // S'en remettre au hook suivant dans la chaîne, qui serait la
  // résolution par défaut de Node.js s'il s'agit du dernier chargeur spécifié par l'utilisateur.
  return nextResolve(specifier);
}
```
```js [ESM]
// Version synchrone acceptée par module.registerHooks().
function resolve(specifier, context, nextResolve) {
  // Similaire à la résolution asynchrone() ci-dessus, car celle-ci n'a pas
  // toute logique asynchrone.
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.5.0 | Ajout de la prise en charge de la version synchrone et in-thread. |
| v20.6.0 | Ajout de la prise en charge de `source` avec le format `commonjs`. |
| v18.6.0, v16.17.0 | Ajout de la prise en charge de l'enchaînement des hooks de chargement. Chaque hook doit soit appeler `nextLoad()` soit inclure une propriété `shortCircuit` définie sur `true` dans son retour. |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index).2 - Version candidate (version asynchrone) Stabilité: 1.1 - Développement actif (version synchrone)
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL renvoyée par la chaîne `resolve`
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Conditions d'export du `package.json` concerné
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le format éventuellement fourni par la chaîne de hook `resolve`
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- `nextLoad` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Le hook `load` suivant dans la chaîne, ou le hook `load` par défaut de Node.js après le dernier hook `load` fourni par l'utilisateur.
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- Renvoie : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) La version asynchrone prend soit un objet contenant les propriétés suivantes, soit une `Promise` qui sera résolue en un tel objet. La version synchrone n'accepte qu'un objet renvoyé de manière synchrone.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un signal indiquant que ce hook a l'intention de mettre fin à la chaîne de hooks `load`. **Par défaut :** `false`
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) La source que Node.js doit évaluer
  
 

Le hook `load` fournit un moyen de définir une méthode personnalisée pour déterminer comment une URL doit être interprétée, récupérée et analysée. Il est également chargé de valider les attributs d'importation.

La valeur finale de `format` doit être l'une des suivantes :

| `format` | Description | Types acceptables pour `source` renvoyés par `load` |
| --- | --- | --- |
| `'builtin'` | Charger un module intégré de Node.js | Non applicable |
| `'commonjs'` | Charger un module CommonJS de Node.js | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) , `null` , `undefined` } |
| `'json'` | Charger un fichier JSON | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | Charger un module ES | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | Charger un module WebAssembly | { [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
La valeur de `source` est ignorée pour le type `'builtin'` car il n'est actuellement pas possible de remplacer la valeur d'un module intégré (core) de Node.js.


##### Mise en garde concernant le hook asynchrone `load` {#caveat-in-the-asynchronous-load-hook}

Lors de l'utilisation du hook asynchrone `load`, l'omission ou la fourniture d'une `source` pour `'commonjs'` a des effets très différents :

- Lorsqu'une `source` est fournie, tous les appels `require` de ce module seront traités par le chargeur ESM avec les hooks `resolve` et `load` enregistrés ; tous les appels `require.resolve` de ce module seront traités par le chargeur ESM avec les hooks `resolve` enregistrés ; seule un sous-ensemble de l'API CommonJS sera disponible (par exemple, pas de `require.extensions`, pas de `require.cache`, pas de `require.resolve.paths`) et le monkey-patching sur le chargeur de module CommonJS ne s'appliquera pas.
- Si `source` n'est pas définie ou est `null`, elle sera gérée par le chargeur de module CommonJS et les appels `require`/`require.resolve` ne passeront pas par les hooks enregistrés. Ce comportement pour une `source` nulle est temporaire — à l'avenir, une `source` nulle ne sera pas prise en charge.

Ces mises en garde ne s'appliquent pas au hook synchrone `load`, auquel cas l'ensemble complet des API CommonJS disponibles pour les modules CommonJS personnalisés, et `require`/`require.resolve` passent toujours par les hooks enregistrés.

L'implémentation interne asynchrone `load` de Node.js, qui est la valeur de `next` pour le dernier hook de la chaîne `load`, renvoie `null` pour `source` lorsque `format` est `'commonjs'` pour assurer la rétrocompatibilité. Voici un exemple de hook qui choisirait d'utiliser le comportement non défini par défaut :

```js [ESM]
import { readFile } from 'node:fs/promises';

// Version asynchrone acceptée par module.register(). Ce correctif n'est pas nécessaire
// pour la version synchrone acceptée par module.registerSync().
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
Cela ne s'applique pas non plus au hook synchrone `load`, auquel cas la `source` renvoyée contient le code source chargé par le hook suivant, quel que soit le format du module.

- L'objet [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) spécifique est un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).
- L'objet [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) spécifique est un [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

Si la valeur source d'un format textuel (c'est-à-dire `'json'`, `'module'`) n'est pas une chaîne de caractères, elle est convertie en une chaîne à l'aide de [`util.TextDecoder`](/fr/nodejs/api/util#class-utiltextdecoder).

Le hook `load` fournit un moyen de définir une méthode personnalisée pour récupérer le code source d'une URL résolue. Cela permettrait à un chargeur d'éviter potentiellement de lire des fichiers sur le disque. Il pourrait également être utilisé pour mapper un format non reconnu à un format pris en charge, par exemple `yaml` à `module`.

```js [ESM]
// Version asynchrone acceptée par module.register().
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // Une condition quelconque
    /*
      Pour certaines ou toutes les URLs, effectuez une logique personnalisée pour récupérer la source.
      Retournez toujours un objet de la forme {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // Déférez au hook suivant de la chaîne.
  return nextLoad(url);
}
```
```js [ESM]
// Version synchrone acceptée par module.registerHooks().
function load(url, context, nextLoad) {
  // Similaire à la fonction asynchrone load() ci-dessus, car celle-ci ne contient pas
  // de logique asynchrone.
}
```
Dans un scénario plus avancé, cela peut également être utilisé pour transformer une source non prise en charge en une source prise en charge (voir [Exemples](/fr/nodejs/api/module#examples) ci-dessous).


### Exemples {#examples}

Les différents points d'ancrage de personnalisation des modules peuvent être utilisés ensemble pour réaliser des personnalisations de grande envergure des comportements de chargement et d'évaluation du code Node.js.

#### Importer depuis HTTPS {#import-from-https}

Le point d'ancrage ci-dessous enregistre des points d'ancrage pour activer une prise en charge rudimentaire de tels spécificateurs. Bien que cela puisse sembler être une amélioration significative de la fonctionnalité principale de Node.js, l'utilisation réelle de ces points d'ancrage présente des inconvénients importants : les performances sont beaucoup plus lentes que le chargement de fichiers à partir du disque, il n'y a pas de mise en cache et il n'y a aucune sécurité.

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // Pour que JavaScript soit chargé sur le réseau, nous devons le récupérer et
  // le retourner.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // Cet exemple suppose que tout le code JavaScript fourni par le réseau est du code de module ES
          // code.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Laisser Node.js gérer toutes les autres URL.
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
Avec le module de points d'ancrage précédent, l'exécution de `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs` affiche la version actuelle de CoffeeScript selon le module à l'URL dans `main.mjs`.

#### Transpilation {#transpilation}

Les sources qui sont dans des formats que Node.js ne comprend pas peuvent être converties en JavaScript à l'aide du [`load` hook](/fr/nodejs/api/module#loadurl-context-nextload).

Ceci est moins performant que la transpilation des fichiers sources avant d'exécuter Node.js ; les points d'ancrage de transpilation ne doivent être utilisés qu'à des fins de développement et de test.


##### Version asynchrone {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // Les fichiers CoffeeScript peuvent être soit CommonJS soit des modules ES, donc nous voulons que
    // tout fichier CoffeeScript soit traité par Node.js de la même manière qu'un fichier .js
    // au même emplacement. Pour déterminer comment Node.js interpréterait un fichier .js arbitraire,
    // recherchez dans le système de fichiers le fichier package.json parent le plus proche
    // et lisez son champ "type".
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // Ce hook convertit le code source CoffeeScript en code source JavaScript
    // pour tous les fichiers CoffeeScript importés.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Laisser Node.js gérer toutes les autres URLs.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url` n'est qu'un chemin de fichier lors de la première itération lorsqu'on lui passe
  // l'url résolue depuis le hook load()
  // un chemin de fichier réel depuis load() contiendra une extension de fichier car elle est
  // requise par la spécification
  // cette simple vérification de vérité pour savoir si `url` contient une extension de fichier
  // fonctionnera pour la plupart des projets mais ne couvre pas certains cas limites (tels que
  // les fichiers sans extension ou une url se terminant par un espace de fin)
  const isFilePath = !!extname(url);
  // S'il s'agit d'un chemin de fichier, obtenir le répertoire dans lequel il se trouve
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // Composer un chemin de fichier vers un package.json dans le même répertoire,
  // qui peut exister ou non
  const packagePath = resolvePath(dir, 'package.json');
  // Essayer de lire le package.json possiblement inexistant
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // Si package.json existait et contenait un champ `type` avec une valeur, voilà
  if (type) return type;
  // Sinon, (si ce n'est pas à la racine) continuer à vérifier le répertoire supérieur suivant
  // Si à la racine, arrêter et renvoyer false
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### Version synchrone {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### Exécution des hooks {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Propulsé par Node.js version #{version}"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
Avec les modules de hooks précédents, l'exécution de `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` ou `node --import ./coffeescript-sync-hooks.mjs ./main.coffee` fait que `main.coffee` est transformé en JavaScript après que son code source est chargé depuis le disque, mais avant que Node.js ne l'exécute ; et ainsi de suite pour tous les fichiers `.coffee`, `.litcoffee` ou `.coffee.md` référencés via les instructions `import` de n'importe quel fichier chargé.


#### Cartes d'importation {#import-maps}

Les deux exemples précédents définissaient des hooks `load`. Voici un exemple de hook `resolve`. Ce module de hooks lit un fichier `import-map.json` qui définit quels identificateurs remplacer par d'autres URL (il s'agit d'une implémentation très simpliste d'un petit sous-ensemble de la spécification "cartes d'importation").

##### Version asynchrone {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### Version synchrone {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### Utilisation des hooks {#using-the-hooks}

Avec ces fichiers :

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
L'exécution de `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` ou `node --import ./import-map-sync-hooks.js main.js` doit afficher `some module!`.

## Prise en charge de Source Map v3 {#source-map-v3-support}

**Ajoutée dans : v13.7.0, v12.17.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Assistants pour interagir avec le cache de la carte source. Ce cache est rempli lorsque l'analyse de la carte source est activée et que des [directives d'inclusion de carte source](https://sourcemaps.info/spec#h.lmz475t4mvbx) sont trouvées dans le pied de page d'un module.

Pour activer l'analyse des cartes sources, Node.js doit être exécuté avec l'indicateur [`--enable-source-maps`](/fr/nodejs/api/cli#--enable-source-maps) ou avec la couverture du code activée en définissant [`NODE_V8_COVERAGE=dir`](/fr/nodejs/api/cli#node_v8_coveragedir).



::: code-group
```js [ESM]
// module.mjs
// Dans un module ECMAScript
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// Dans un module CommonJS
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**Ajouté dans: v13.7.0, v12.17.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne: [\<module.SourceMap\>](/fr/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Retourne `module.SourceMap` si une source map est trouvée, `undefined` sinon.

`path` est le chemin résolu du fichier pour lequel une source map correspondante doit être récupérée.

### Class: `module.SourceMap` {#class-modulesourcemap}

**Ajouté dans: v13.7.0, v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Crée une nouvelle instance `sourceMap`.

`payload` est un objet avec des clés correspondant au [format Source map v3](https://sourcemaps.info/spec#h.mofvlxcwqzej) :

- `file`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths` est un tableau optionnel de la longueur de chaque ligne dans le code généré.

#### `sourceMap.payload` {#sourcemappayload}

- Retourne: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Getter pour la payload utilisée pour construire l'instance [`SourceMap`](/fr/nodejs/api/module#class-modulesourcemap).


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset du numéro de ligne (indexé à zéro) dans la source générée
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset du numéro de colonne (indexé à zéro) dans la source générée
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Étant donné un offset de ligne et un offset de colonne dans le fichier source généré, renvoie un objet représentant la plage SourceMap dans le fichier original si elle est trouvée, ou un objet vide sinon.

L'objet renvoyé contient les clés suivantes :

- generatedLine : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset de ligne du début de la plage dans la source générée
- generatedColumn : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset de colonne du début de la plage dans la source générée
- originalSource : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom de fichier de la source originale, tel qu'indiqué dans le SourceMap
- originalLine : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset de ligne du début de la plage dans la source originale
- originalColumn : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'offset de colonne du début de la plage dans la source originale
- name : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La valeur renvoyée représente la plage brute telle qu'elle apparaît dans le SourceMap, basée sur des offsets indexés à zéro, *et non* des numéros de ligne et de colonne indexés à 1 tels qu'ils apparaissent dans les messages d'erreur et les objets CallSite.

Pour obtenir les numéros de ligne et de colonne indexés à 1 correspondants à partir d'un lineNumber et d'un columnNumber tels qu'ils sont rapportés par les piles d'erreurs et les objets CallSite, utilisez `sourceMap.findOrigin(lineNumber, columnNumber)`


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro de ligne, indexé à partir de 1, de l’emplacement d’appel dans la source générée
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le numéro de colonne, indexé à partir de 1, de l’emplacement d’appel dans la source générée
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Étant donné un `lineNumber` et un `columnNumber` indexés à partir de 1 à partir d’un emplacement d’appel dans la source générée, trouver l’emplacement d’appel correspondant dans la source originale.

Si le `lineNumber` et le `columnNumber` fournis ne sont pas trouvés dans une source map, un objet vide est retourné. Sinon, l’objet retourné contient les clés suivantes :

- name : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le nom de la plage dans la source map, si elle a été fournie
- fileName : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du fichier de la source originale, tel qu’indiqué dans la SourceMap
- lineNumber : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le lineNumber, indexé à partir de 1, de l’emplacement d’appel correspondant dans la source originale
- columnNumber : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le columnNumber, indexé à partir de 1, de l’emplacement d’appel correspondant dans la source originale

