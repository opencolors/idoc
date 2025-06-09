---
title: Documentation du module Path de Node.js
description: Le module Path de Node.js fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires. Il propose des méthodes pour manipuler et transformer les chemins de fichiers de manière indépendante de la plateforme, y compris la normalisation, la jonction, la résolution et l'analyse des chemins.
head:
  - - meta
    - name: og:title
      content: Documentation du module Path de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Path de Node.js fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires. Il propose des méthodes pour manipuler et transformer les chemins de fichiers de manière indépendante de la plateforme, y compris la normalisation, la jonction, la résolution et l'analyse des chemins.
  - - meta
    - name: twitter:title
      content: Documentation du module Path de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Path de Node.js fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires. Il propose des méthodes pour manipuler et transformer les chemins de fichiers de manière indépendante de la plateforme, y compris la normalisation, la jonction, la résolution et l'analyse des chemins.
---


# Path {#path}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

Le module `node:path` fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires. Il est accessible via :

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows vs. POSIX {#windows-vs-posix}

Le fonctionnement par défaut du module `node:path` varie en fonction du système d’exploitation sur lequel une application Node.js s’exécute. Plus précisément, lors de l’exécution sur un système d’exploitation Windows, le module `node:path` suppose que des chemins de style Windows sont utilisés.

Ainsi, l’utilisation de `path.basename()` peut donner des résultats différents sur POSIX et Windows :

Sur POSIX :

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Returns: 'C:\\temp\\myfile.html'
```
Sur Windows :

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```
Pour obtenir des résultats cohérents lorsque vous travaillez avec des chemins de fichiers Windows sur n’importe quel système d’exploitation, utilisez [`path.win32`](/fr/nodejs/api/path#pathwin32) :

Sur POSIX et Windows :

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```
Pour obtenir des résultats cohérents lorsque vous travaillez avec des chemins de fichiers POSIX sur n’importe quel système d’exploitation, utilisez [`path.posix`](/fr/nodejs/api/path#pathposix) :

Sur POSIX et Windows :

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// Returns: 'myfile.html'
```
Sous Windows, Node.js suit le concept de répertoire de travail par lecteur. Ce comportement peut être observé lors de l’utilisation d’un chemin de lecteur sans barre oblique inverse. Par exemple, `path.resolve('C:\\')` peut potentiellement renvoyer un résultat différent de `path.resolve('C:')`. Pour plus d’informations, consultez [cette page MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [History]
| Version | Changes |
| --- | --- |
| v6.0.0 | Passing a non-string as the `path` argument will throw now. |
| v0.1.25 | Added in: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un suffixe optionnel à supprimer
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `path.basename()` renvoie la dernière partie d’un `path`, de manière similaire à la commande Unix `basename`. Les [séparateurs de répertoire](/fr/nodejs/api/path#pathsep) de fin sont ignorés.

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// Returns: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Returns: 'quux'
```
Bien que Windows traite généralement les noms de fichiers, y compris les extensions de fichiers, de manière insensible à la casse, cette fonction ne le fait pas. Par exemple, `C:\\foo.html` et `C:\\foo.HTML` font référence au même fichier, mais `basename` traite l’extension comme une chaîne sensible à la casse :

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// Returns: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Returns: 'foo.HTML'
```
Un [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si `path` n’est pas une chaîne ou si `suffix` est donné et n’est pas une chaîne.


## `path.delimiter` {#pathdelimiter}

**Ajouté dans : v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Fournit le délimiteur de chemin spécifique à la plate-forme :

- `;` pour Windows
- `:` pour POSIX

Par exemple, sur POSIX :

```js [ESM]
console.log(process.env.PATH);
// Affiche : '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Renvoie : ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
Sur Windows :

```js [ESM]
console.log(process.env.PATH);
// Affiche : 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Renvoie ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | Le fait de passer une valeur non-string comme argument `path` lèvera maintenant une exception. |
| v0.1.16 | Ajouté dans : v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `path.dirname()` renvoie le nom du répertoire d’un `path`, de la même manière que la commande Unix `dirname`. Les séparateurs de répertoire de fin sont ignorés, voir [`path.sep`](/fr/nodejs/api/path#pathsep).

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// Renvoie : '/foo/bar/baz/asdf'
```
Une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si `path` n’est pas une chaîne de caractères.

## `path.extname(path)` {#pathextnamepath}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | Le fait de passer une valeur non-string comme argument `path` lèvera maintenant une exception. |
| v0.1.25 | Ajouté dans : v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `path.extname()` renvoie l’extension du `path`, de la dernière occurrence du caractère `.` (point) à la fin de la chaîne dans la dernière partie du `path`. S’il n’y a pas de `.` dans la dernière partie du `path`, ou s’il n’y a pas de caractères `.` autres que le premier caractère du nom de base de `path` (voir `path.basename()`), une chaîne vide est renvoyée.

```js [ESM]
path.extname('index.html');
// Renvoie : '.html'

path.extname('index.coffee.md');
// Renvoie : '.md'

path.extname('index.');
// Renvoie : '.'

path.extname('index');
// Renvoie : ''

path.extname('.index');
// Renvoie : ''

path.extname('.index.md');
// Renvoie : '.md'
```
Une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si `path` n’est pas une chaîne de caractères.


## `path.format(pathObject)` {#pathformatpathobject}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Le point sera ajouté s'il n'est pas spécifié dans `ext`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `pathObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Tout objet JavaScript ayant les propriétés suivantes :
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `path.format()` retourne une chaîne de chemin à partir d'un objet. C'est l'inverse de [`path.parse()`](/fr/nodejs/api/path#pathparsepath).

Lors de la fourniture de propriétés au `pathObject`, n'oubliez pas qu'il existe des combinaisons où une propriété a la priorité sur une autre :

- `pathObject.root` est ignoré si `pathObject.dir` est fourni
- `pathObject.ext` et `pathObject.name` sont ignorés si `pathObject.base` existe

Par exemple, sur POSIX :

```js [ESM]
// Si `dir`, `root` et `base` sont fournis,
// `${dir}${path.sep}${base}`
// sera retourné. `root` est ignoré.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Retourne : '/home/user/dir/file.txt'

// `root` sera utilisé si `dir` n'est pas spécifié.
// Si seul `root` est fourni ou si `dir` est égal à `root`, alors le
// séparateur de plateforme ne sera pas inclus. `ext` sera ignoré.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Retourne : '/file.txt'

// `name` + `ext` sera utilisé si `base` n'est pas spécifié.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Retourne : '/file.txt'

// Le point sera ajouté s'il n'est pas spécifié dans `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Retourne : '/file.txt'
```
Sous Windows :

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// Retourne : 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**Ajouté dans : v22.5.0, v20.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin à comparer avec le modèle glob.
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le modèle glob avec lequel comparer le chemin.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le `path` correspond ou non au `pattern`.

La méthode `path.matchesGlob()` détermine si `path` correspond au `pattern`.

Par exemple :

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
Une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si `path` ou `pattern` ne sont pas des chaînes de caractères.

## `path.isAbsolute(path)` {#pathisabsolutepath}

**Ajouté dans : v0.11.2**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La méthode `path.isAbsolute()` détermine si `path` est un chemin absolu.

Si le `path` donné est une chaîne de longueur nulle, `false` sera retourné.

Par exemple, sur POSIX :

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
Sur Windows :

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
Une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si `path` n’est pas une chaîne de caractères.

## `path.join([...paths])` {#pathjoinpaths}

**Ajouté dans : v0.1.16**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une séquence de segments de chemin
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `path.join()` joint tous les segments `path` donnés en utilisant le séparateur spécifique à la plateforme comme délimiteur, puis normalise le chemin résultant.

Les segments `path` de longueur nulle sont ignorés. Si la chaîne de chemin jointe est une chaîne de longueur nulle, alors `'.'` sera retourné, représentant le répertoire de travail actuel.

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Retourne : '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Lève 'TypeError: Path must be a string. Received {}'
```
Une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si l’un des segments de chemin n’est pas une chaîne de caractères.


## `path.normalize(path)` {#pathnormalizepath}

**Ajouté dans : v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `path.normalize()` normalise le `path` donné, en résolvant les segments `'..'` et `'.'`.

Lorsque plusieurs caractères de séparation de segments de chemin séquentiels sont trouvés (par exemple, `/` sur POSIX et `\` ou `/` sur Windows), ils sont remplacés par une seule instance du séparateur de segments de chemin spécifique à la plate-forme (`/` sur POSIX et `\` sur Windows). Les séparateurs de fin sont conservés.

Si le `path` est une chaîne de longueur nulle, `'.'` est renvoyé, représentant le répertoire de travail actuel.

Sur POSIX, les types de normalisation appliqués par cette fonction ne respectent pas strictement la spécification POSIX. Par exemple, cette fonction remplacera deux barres obliques initiales par une seule barre oblique comme s'il s'agissait d'un chemin absolu régulier, alors que certains systèmes POSIX attribuent une signification particulière aux chemins commençant par exactement deux barres obliques. De même, d'autres substitutions effectuées par cette fonction, telles que la suppression des segments `..`, peuvent modifier la façon dont le système sous-jacent résout le chemin.

Par exemple, sur POSIX :

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// Renvoie : '/foo/bar/baz/asdf'
```
Sur Windows :

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Renvoie : 'C:\\temp\\foo\\'
```
Étant donné que Windows reconnaît plusieurs séparateurs de chemin, les deux séparateurs seront remplacés par des instances du séparateur préféré de Windows (`\`):

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Renvoie : 'C:\\temp\\foo\\bar'
```
Une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si `path` n'est pas une chaîne.

## `path.parse(path)` {#pathparsepath}

**Ajouté dans : v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Renvoie : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La méthode `path.parse()` renvoie un objet dont les propriétés représentent des éléments significatifs du `path`. Les séparateurs de répertoire de fin sont ignorés, voir [`path.sep`](/fr/nodejs/api/path#pathsep).

L'objet renvoyé aura les propriétés suivantes :

- `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Par exemple, sur POSIX :

```js [ESM]
path.parse('/home/user/dir/file.txt');
// Renvoie :
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(Tous les espaces dans la ligne "" doivent être ignorés. Ils sont purement pour le formatage.)
```
Sous Windows :

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// Renvoie :
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(Tous les espaces dans la ligne "" doivent être ignorés. Ils sont purement pour le formatage.)
```
Une [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si `path` n'est pas une chaîne.


## `path.posix` {#pathposix}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.3.0 | Exposé comme `require('path/posix')`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propriété `path.posix` donne accès aux implémentations spécifiques à POSIX des méthodes `path`.

L’API est accessible via `require('node:path').posix` ou `require('node:path/posix')`.

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.8.0 | Sous Windows, les barres obliques de début pour les chemins UNC sont maintenant incluses dans la valeur de retour. |
| v0.5.0 | Ajouté dans : v0.5.0 |
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `path.relative()` renvoie le chemin relatif de `from` vers `to` en fonction du répertoire de travail actuel. Si `from` et `to` se résolvent chacun vers le même chemin (après avoir appelé `path.resolve()` sur chacun), une chaîne de longueur nulle est renvoyée.

Si une chaîne de longueur nulle est passée comme `from` ou `to`, le répertoire de travail actuel sera utilisé à la place des chaînes de longueur nulle.

Par exemple, sur POSIX :

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Retourne : '../../impl/bbb'
```

Sous Windows :

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Retourne : '..\\..\\impl\\bbb'
```

Une erreur [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si `from` ou `to` n’est pas une chaîne de caractères.

## `path.resolve([...paths])` {#pathresolvepaths}

**Ajouté dans : v0.3.4**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une séquence de chemins ou de segments de chemin
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `path.resolve()` résout une séquence de chemins ou de segments de chemin en un chemin absolu.

La séquence de chemins donnée est traitée de droite à gauche, chaque `path` suivant étant ajouté jusqu’à ce qu’un chemin absolu soit construit. Par exemple, étant donné la séquence de segments de chemin : `/foo`, `/bar`, `baz`, appeler `path.resolve('/foo', '/bar', 'baz')` renverrait `/bar/baz` car `'baz'` n’est pas un chemin absolu mais `'/bar' + '/' + 'baz'` l’est.

Si, après avoir traité tous les segments `path` donnés, un chemin absolu n’a pas encore été généré, le répertoire de travail actuel est utilisé.

Le chemin résultant est normalisé et les barres obliques de fin sont supprimées sauf si le chemin est résolu vers le répertoire racine.

Les segments `path` de longueur nulle sont ignorés.

Si aucun segment `path` n’est passé, `path.resolve()` renvoie le chemin absolu du répertoire de travail actuel.

```js [ESM]
path.resolve('/foo/bar', './baz');
// Retourne : '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Retourne : '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// Si le répertoire de travail actuel est /home/myself/node,
// cela renvoie '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

Une erreur [`TypeError`](/fr/nodejs/api/errors#class-typeerror) est levée si l’un des arguments n’est pas une chaîne.


## `path.sep` {#pathsep}

**Ajouté dans : v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Fournit le séparateur de segments de chemin spécifique à la plateforme :

- `\` sur Windows
- `/` sur POSIX

Par exemple, sur POSIX :

```js [ESM]
'foo/bar/baz'.split(path.sep);
// Renvoie : ['foo', 'bar', 'baz']
```
Sur Windows :

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// Renvoie : ['foo', 'bar', 'baz']
```
Sur Windows, la barre oblique (`/`) et la barre oblique inversée (`\`) sont acceptées comme séparateurs de segments de chemin ; cependant, les méthodes `path` n'ajoutent que des barres obliques inversées (`\`).

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**Ajouté dans : v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Sur les systèmes Windows uniquement, renvoie un [chemin préfixé par un espace de noms](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces) équivalent pour le `path` donné. Si `path` n'est pas une chaîne, `path` sera renvoyé sans modifications.

Cette méthode n'a de sens que sur les systèmes Windows. Sur les systèmes POSIX, la méthode n'est pas opérationnelle et renvoie toujours `path` sans modifications.

## `path.win32` {#pathwin32}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.3.0 | Exposé en tant que `require('path/win32')`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La propriété `path.win32` donne accès aux implémentations spécifiques à Windows des méthodes `path`.

L'API est accessible via `require('node:path').win32` ou `require('node:path/win32')`.

