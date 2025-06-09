---
title: Module URL - Documentation Node.js
description: Le module URL de Node.js fournit des utilitaires pour la résolution et l'analyse des URL. Il supporte la norme WHATWG URL et l'API urlObject héritée, offrant des méthodes pour travailler avec les URL dans les deux formats.
head:
  - - meta
    - name: og:title
      content: Module URL - Documentation Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module URL de Node.js fournit des utilitaires pour la résolution et l'analyse des URL. Il supporte la norme WHATWG URL et l'API urlObject héritée, offrant des méthodes pour travailler avec les URL dans les deux formats.
  - - meta
    - name: twitter:title
      content: Module URL - Documentation Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module URL de Node.js fournit des utilitaires pour la résolution et l'analyse des URL. Il supporte la norme WHATWG URL et l'API urlObject héritée, offrant des méthodes pour travailler avec les URL dans les deux formats.
---


# URL {#url}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

Le module `node:url` fournit des utilitaires pour la résolution et l’analyse des URL. Il est accessible en utilisant :

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## Chaînes d’URL et objets URL {#url-strings-and-url-objects}

Une chaîne d’URL est une chaîne structurée contenant plusieurs composants significatifs. Lors de l’analyse, un objet URL est renvoyé contenant des propriétés pour chacun de ces composants.

Le module `node:url` fournit deux API pour travailler avec les URL : une API héritée spécifique à Node.js et une API plus récente qui implémente la même [norme d’URL WHATWG](https://url.spec.whatwg.org/) que celle utilisée par les navigateurs web.

Une comparaison entre les API WHATWG et héritées est fournie ci-dessous. Au-dessus de l’URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`, les propriétés d’un objet renvoyé par le `url.parse()` hérité sont affichées. Ci-dessous se trouvent les propriétés d’un objet `URL` WHATWG.

La propriété `origin` de l’URL WHATWG inclut `protocol` et `host`, mais pas `username` ni `password`.

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(Tous les espaces dans la ligne « » doivent être ignorés. Ils sont uniquement destinés à la mise en forme.)
```
Analyse de la chaîne d’URL à l’aide de l’API WHATWG :

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
Analyse de la chaîne d’URL à l’aide de l’API héritée :

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::


### Construction d'une URL à partir de composants et obtention de la chaîne construite {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

Il est possible de construire une URL WHATWG à partir de composants en utilisant soit les mutateurs de propriétés, soit une chaîne de gabarit littéral :

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
Pour obtenir la chaîne d'URL construite, utilisez l'accesseur de propriété `href` :

```js [ESM]
console.log(myURL.href);
```
## L'API URL WHATWG {#the-whatwg-url-api}

### Classe : `URL` {#class-url}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | La classe est maintenant disponible sur l'objet global. |
| v7.0.0, v6.13.0 | Ajouté dans : v7.0.0, v6.13.0 |
:::

Classe `URL` compatible avec le navigateur, implémentée en suivant la norme URL WHATWG. Des [exemples d'URL analysées](https://url.spec.whatwg.org/#example-url-parsing) peuvent être trouvés dans la norme elle-même. La classe `URL` est également disponible sur l'objet global.

Conformément aux conventions du navigateur, toutes les propriétés des objets `URL` sont implémentées en tant qu'accesseurs et mutateurs sur le prototype de la classe, plutôt qu'en tant que propriétés de données sur l'objet lui-même. Ainsi, contrairement aux [anciens `urlObject`](/fr/nodejs/api/url#legacy-urlobject)s, l'utilisation du mot-clé `delete` sur n'importe quelle propriété des objets `URL` (par exemple `delete myURL.protocol`, `delete myURL.pathname`, etc.) n'a aucun effet, mais renverra toujours `true`.

#### `new URL(input[, base])` {#new-urlinput-base}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0, v18.17.0 | L'exigence ICU est supprimée. |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL d'entrée absolue ou relative à analyser. Si `input` est relative, alors `base` est requis. Si `input` est absolu, la `base` est ignorée. Si `input` n'est pas une chaîne de caractères, elle est d'abord [convertie en chaîne de caractères](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL de base par rapport à laquelle résoudre si l'`input` n'est pas absolu. Si `base` n'est pas une chaîne de caractères, elle est d'abord [convertie en chaîne de caractères](https://tc39.es/ecma262/#sec-tostring).

Crée un nouvel objet `URL` en analysant l'`input` par rapport à la `base`. Si `base` est passé en tant que chaîne de caractères, il sera analysé de manière équivalente à `new URL(base)`.

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
Le constructeur URL est accessible en tant que propriété sur l'objet global. Il peut également être importé depuis le module url intégré :

::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // Affiche 'true'.
```

```js [CJS]
console.log(URL === require('node:url').URL); // Affiche 'true'.
```
:::

Une `TypeError` sera levée si l'`input` ou la `base` ne sont pas des URL valides. Notez qu'un effort sera fait pour contraindre les valeurs données en chaînes de caractères. Par exemple :

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
Les caractères Unicode apparaissant dans le nom d'hôte de l'`input` seront automatiquement convertis en ASCII en utilisant l'algorithme [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4).

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
Dans les cas où il n'est pas connu à l'avance si l'`input` est une URL absolue et qu'une `base` est fournie, il est conseillé de valider que l'`origin` de l'objet `URL` est bien celui attendu.

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la portion de fragment de l'URL.

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Affiche #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Affiche https://example.org/foo#baz
```
Les caractères d'URL invalides inclus dans la valeur attribuée à la propriété `hash` sont [encodés en pourcentage](/fr/nodejs/api/url#percent-encoding-in-urls). La sélection des caractères à encoder en pourcentage peut varier quelque peu par rapport à ce que les méthodes [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) et [`url.format()`](/fr/nodejs/api/url#urlformaturlobject) produiraient.

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la portion hôte de l'URL.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Affiche example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Affiche https://example.com:82/foo
```
Les valeurs d'hôte invalides attribuées à la propriété `host` sont ignorées.

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la portion nom d'hôte de l'URL. La principale différence entre `url.host` et `url.hostname` est que `url.hostname` n'inclut *pas* le port.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Affiche example.org

// Définir le nom d'hôte ne change pas le port
myURL.hostname = 'example.com';
console.log(myURL.href);
// Affiche https://example.com:81/foo

// Utiliser myURL.host pour changer le nom d'hôte et le port
myURL.host = 'example.org:82';
console.log(myURL.href);
// Affiche https://example.org:82/foo
```
Les valeurs de nom d'hôte invalides attribuées à la propriété `hostname` sont ignorées.

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit l'URL sérialisée.

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Affiche https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Affiche https://example.com/bar
```
Obtenir la valeur de la propriété `href` équivaut à appeler [`url.toString()`](/fr/nodejs/api/url#urltostring).

Définir la valeur de cette propriété à une nouvelle valeur équivaut à créer un nouvel objet `URL` en utilisant [`new URL(value)`](/fr/nodejs/api/url#new-urlinput-base). Chacune des propriétés de l'objet `URL` sera modifiée.

Si la valeur attribuée à la propriété `href` n'est pas une URL valide, une `TypeError` sera lancée.


#### `url.origin` {#urlorigin}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le schéma "gopher" n'est plus spécial et `url.origin` renvoie désormais `'null'` pour celui-ci. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient la sérialisation en lecture seule de l'origine de l'URL.

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Affiche https://example.org
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Affiche https://xn--g6w251d

console.log(idnURL.hostname);
// Affiche xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la partie mot de passe de l'URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// Affiche xyz

myURL.password = '123';
console.log(myURL.href);
// Affiche https://abc:/
```
Les caractères d'URL invalides inclus dans la valeur assignée à la propriété `password` sont [encodés en pourcentage](/fr/nodejs/api/url#percent-encoding-in-urls). La sélection des caractères à encoder en pourcentage peut varier quelque peu par rapport à ce que les méthodes [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) et [`url.format()`](/fr/nodejs/api/url#urlformaturlobject) produiraient.

#### `url.pathname` {#urlpathname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la partie chemin de l'URL.

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Affiche /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Affiche https://example.org/abcdef?123
```
Les caractères d'URL invalides inclus dans la valeur assignée à la propriété `pathname` sont [encodés en pourcentage](/fr/nodejs/api/url#percent-encoding-in-urls). La sélection des caractères à encoder en pourcentage peut varier quelque peu par rapport à ce que les méthodes [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) et [`url.format()`](/fr/nodejs/api/url#urlformaturlobject) produiraient.


#### `url.port` {#urlport}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le schéma "gopher" n'est plus spécial. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la partie port de l'URL.

La valeur du port peut être un nombre ou une chaîne contenant un nombre compris entre `0` et `65535` (inclus). Définir la valeur sur le port par défaut des objets `URL` étant donné le `protocol` entraînera la transformation de la valeur `port` en une chaîne vide (`''`).

La valeur du port peut être une chaîne vide, auquel cas le port dépend du protocole/schéma :

| protocole | port |
| --- | --- |
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |
Lors de l'attribution d'une valeur au port, la valeur sera d'abord convertie en une chaîne à l'aide de `.toString()`.

Si cette chaîne n'est pas valide mais qu'elle commence par un nombre, le nombre principal est attribué à `port`. Si le nombre se situe en dehors de la plage indiquée ci-dessus, il est ignoré.

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Affiche 8888

// Les ports par défaut sont automatiquement transformés en chaîne vide
// (le port par défaut du protocole HTTPS est 443)
myURL.port = '443';
console.log(myURL.port);
// Affiche la chaîne vide
console.log(myURL.href);
// Affiche https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// Affiche 1234
console.log(myURL.href);
// Affiche https://example.org:1234/

// Les chaînes de port complètement invalides sont ignorées
myURL.port = 'abcd';
console.log(myURL.port);
// Affiche 1234

// Les nombres initiaux sont traités comme un numéro de port
myURL.port = '5678abcd';
console.log(myURL.port);
// Affiche 5678

// Les nombres non entiers sont tronqués
myURL.port = 1234.5678;
console.log(myURL.port);
// Affiche 1234

// Les nombres hors plage qui ne sont pas représentés en notation scientifique
// seront ignorés.
myURL.port = 1e10; // 10000000000, sera vérifié en termes de plage comme décrit ci-dessous
console.log(myURL.port);
// Affiche 1234
```
Les nombres qui contiennent une décimale, tels que les nombres à virgule flottante ou les nombres en notation scientifique, ne font pas exception à cette règle. Les nombres initiaux jusqu'à la décimale seront définis comme port de l'URL, à condition qu'ils soient valides :

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// Affiche 4 (car c'est le nombre initial dans la chaîne '4.567e21')
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la partie protocole de l'URL.

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Affiche https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Affiche ftp://example.org/
```
Les valeurs de protocole URL invalides assignées à la propriété `protocol` sont ignorées.

##### Schémas spéciaux {#special-schemes}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le schéma "gopher" n'est plus spécial. |
:::

La [Norme URL WHATWG](https://url.spec.whatwg.org/) considère une poignée de schémas de protocole URL comme *spéciaux* en termes de façon dont ils sont analysés et sérialisés. Lorsqu'une URL est analysée en utilisant l'un de ces protocoles spéciaux, la propriété `url.protocol` peut être modifiée en un autre protocole spécial, mais ne peut pas être modifiée en un protocole non spécial, et vice versa.

Par exemple, passer de `http` à `https` fonctionne :

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
Cependant, passer de `http` à un hypothétique protocole `fish` ne fonctionne pas car le nouveau protocole n'est pas spécial.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
De même, passer d'un protocole non spécial à un protocole spécial n'est pas non plus autorisé :

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
Selon la norme URL WHATWG, les schémas de protocoles spéciaux sont `ftp`, `file`, `http`, `https`, `ws` et `wss`.

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la partie requête sérialisée de l'URL.

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Affiche ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Affiche https://example.org/abc?abc=xyz
```
Tout caractère URL invalide apparaissant dans la valeur affectée à la propriété `search` sera [encodé en pourcentage](/fr/nodejs/api/url#percent-encoding-in-urls). La sélection des caractères à encoder en pourcentage peut varier quelque peu par rapport à ce que les méthodes [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) et [`url.format()`](/fr/nodejs/api/url#urlformaturlobject) produiraient.


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/fr/nodejs/api/url#class-urlsearchparams)

Obtient l'objet [`URLSearchParams`](/fr/nodejs/api/url#class-urlsearchparams) représentant les paramètres de requête de l'URL. Cette propriété est en lecture seule, mais l'objet `URLSearchParams` qu'elle fournit peut être utilisé pour modifier l'instance de l'URL ; pour remplacer l'intégralité des paramètres de requête de l'URL, utilisez le setter [`url.search`](/fr/nodejs/api/url#urlsearch). Consultez la documentation [`URLSearchParams`](/fr/nodejs/api/url#class-urlsearchparams) pour plus de détails.

Soyez prudent lorsque vous utilisez `.searchParams` pour modifier l'`URL` car, selon la spécification WHATWG, l'objet `URLSearchParams` utilise des règles différentes pour déterminer quels caractères doivent être encodés en pourcentage. Par exemple, l'objet `URL` n'encodera pas en pourcentage le caractère tilde ASCII (`~`), alors que `URLSearchParams` l'encodera toujours :

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // affiche ?foo=~bar

// Modifiez l'URL via searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // affiche ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtient et définit la partie nom d'utilisateur de l'URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// Affiche abc

myURL.username = '123';
console.log(myURL.href);
// Affiche https://123:/
```
Tous les caractères d'URL invalides apparaissant dans la valeur attribuée à la propriété `username` seront [encodés en pourcentage](/fr/nodejs/api/url#percent-encoding-in-urls). La sélection des caractères à encoder en pourcentage peut varier quelque peu de ce que les méthodes [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) et [`url.format()`](/fr/nodejs/api/url#urlformaturlobject) produiraient.

#### `url.toString()` {#urltostring}

- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `toString()` sur l'objet `URL` renvoie l'URL sérialisée. La valeur renvoyée est équivalente à celle de [`url.href`](/fr/nodejs/api/url#urlhref) et [`url.toJSON()`](/fr/nodejs/api/url#urltojson).


#### `url.toJSON()` {#urltojson}

**Ajouté dans : v7.7.0, v6.13.0**

- Retourne : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String)

La méthode `toJSON()` sur l'objet `URL` renvoie l'URL sérialisée. La valeur renvoyée est équivalente à celle de [`url.href`](/fr/nodejs/api/url#urlhref) et [`url.toString()`](/fr/nodejs/api/url#urltostring).

Cette méthode est automatiquement appelée lorsqu'un objet `URL` est sérialisé avec [`JSON.stringify()`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**Ajouté dans : v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `blob` [\<Blob\>](/fr/nodejs/api/buffer#class-blob)
- Retourne : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String)

Crée une chaîne d'URL `'blob:nodedata:...'` qui représente l'objet [\<Blob\>](/fr/nodejs/api/buffer#class-blob) donné et peut être utilisée pour récupérer le `Blob` ultérieurement.

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// plus tard...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
Les données stockées par le [\<Blob\>](/fr/nodejs/api/buffer#class-blob) enregistré seront conservées en mémoire jusqu'à ce que `URL.revokeObjectURL()` soit appelé pour le supprimer.

Les objets `Blob` sont enregistrés dans le thread actuel. Si vous utilisez des Worker Threads, les objets `Blob` enregistrés dans un Worker ne seront pas disponibles pour les autres workers ou le thread principal.

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**Ajouté dans : v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `id` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Une chaîne d'URL `'blob:nodedata:...` renvoyée par un appel précédent à `URL.createObjectURL()`.

Supprime le [\<Blob\>](/fr/nodejs/api/buffer#class-blob) stocké identifié par l'ID donné. Tenter de révoquer un ID qui n'est pas enregistré échouera silencieusement.


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**Ajouté dans : v19.9.0, v18.17.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL d'entrée absolue ou relative à analyser. Si `input` est relative, alors `base` est requis. Si `input` est absolue, la `base` est ignorée. Si `input` n'est pas une chaîne de caractères, elle est d'abord [convertie en chaîne de caractères](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL de base à utiliser pour la résolution si l'`input` n'est pas absolue. Si `base` n'est pas une chaîne de caractères, elle est d'abord [convertie en chaîne de caractères](https://tc39.es/ecma262/#sec-tostring).
- Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vérifie si un `input` relatif à la `base` peut être analysé en une `URL`.

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**Ajouté dans : v22.1.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL d'entrée absolue ou relative à analyser. Si `input` est relative, alors `base` est requis. Si `input` est absolue, la `base` est ignorée. Si `input` n'est pas une chaîne de caractères, elle est d'abord [convertie en chaîne de caractères](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL de base à utiliser pour la résolution si l'`input` n'est pas absolue. Si `base` n'est pas une chaîne de caractères, elle est d'abord [convertie en chaîne de caractères](https://tc39.es/ecma262/#sec-tostring).
- Renvoie : [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Analyse une chaîne de caractères comme une URL. Si `base` est fournie, elle sera utilisée comme URL de base dans le but de résoudre les URL `input` non absolues. Renvoie `null` si `input` n'est pas valide.


### Classe : `URLSearchParams` {#class-urlsearchparams}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | La classe est maintenant disponible sur l’objet global. |
| v7.5.0, v6.13.0 | Ajoutée dans : v7.5.0, v6.13.0 |
:::

L’API `URLSearchParams` fournit un accès en lecture et en écriture à la query d’une `URL`. La classe `URLSearchParams` peut également être utilisée de manière autonome avec l’un des quatre constructeurs suivants. La classe `URLSearchParams` est également disponible sur l’objet global.

L’interface WHATWG `URLSearchParams` et le module [`querystring`](/fr/nodejs/api/querystring) ont un objectif similaire, mais l’objectif du module [`querystring`](/fr/nodejs/api/querystring) est plus général, car il permet la personnalisation des caractères délimiteurs (`&` et `=`). En revanche, cette API est conçue uniquement pour les chaînes de requête d’URL.

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// Affiche 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// Affiche https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// Affiche https://example.org/?a=b

const newSearchParams = new URLSearchParams(myURL.searchParams);
// Ce qui précède équivaut à
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// Affiche https://example.org/?a=b
console.log(newSearchParams.toString());
// Affiche a=b&a=c

// newSearchParams.toString() est implicitement appelé
myURL.search = newSearchParams;
console.log(myURL.href);
// Affiche https://example.org/?a=b&a=c
newSearchParams.delete('a');
console.log(myURL.href);
// Affiche https://example.org/?a=b&a=c
```
#### `new URLSearchParams()` {#new-urlsearchparams}

Instancie un nouvel objet `URLSearchParams` vide.

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une chaîne de requête

Analyse la `string` comme une chaîne de requête et l’utilise pour instancier un nouvel objet `URLSearchParams`. Un `'?'` de début, s’il est présent, est ignoré.

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// Affiche 'abc'
console.log(params.toString());
// Affiche 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// Affiche 'user=abc&query=xyz'
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**Ajouté dans : v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet représentant une collection de paires clé-valeur

Instancie un nouvel objet `URLSearchParams` avec une table de hachage de requête. La clé et la valeur de chaque propriété de `obj` sont toujours forcées en chaînes de caractères.

Contrairement au module [`querystring`](/fr/nodejs/api/querystring), les clés en double sous forme de valeurs de tableau ne sont pas autorisées. Les tableaux sont transformés en chaînes de caractères à l'aide de [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString), qui joint simplement tous les éléments du tableau avec des virgules.

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// Prints [ 'first,second' ]
console.log(params.toString());
// Prints 'user=abc&query=first%2Csecond'
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**Ajouté dans : v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Un objet itérable dont les éléments sont des paires clé-valeur

Instancie un nouvel objet `URLSearchParams` avec une carte itérable d'une manière similaire au constructeur de [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). `iterable` peut être un `Array` ou tout objet itérable. Cela signifie que `iterable` peut être un autre `URLSearchParams`, auquel cas le constructeur créera simplement un clone du `URLSearchParams` fourni. Les éléments de `iterable` sont des paires clé-valeur, et peuvent eux-mêmes être n'importe quel objet itérable.

Les clés en double sont autorisées.

```js [ESM]
let params;

// Using an array
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// Using a Map object
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Prints 'user=abc&query=xyz'

// Using a generator function
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// Each key-value pair must have exactly two elements
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Throws TypeError [ERR_INVALID_TUPLE]:
//        Each query pair must be an iterable [name, value] tuple
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ajoute une nouvelle paire nom-valeur à la chaîne de requête.

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.2.0, v18.18.0 | Ajoute la prise en charge de l'argument `value` optionnel. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Si `value` est fourni, supprime toutes les paires nom-valeur où le nom est `name` et la valeur est `value`.

Si `value` n'est pas fourni, supprime toutes les paires nom-valeur dont le nom est `name`.

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retourne un `Iterator` ES6 sur chacune des paires nom-valeur dans la requête. Chaque élément de l'itérateur est un `Array` JavaScript. Le premier élément du `Array` est le `name`, le second élément du `Array` est la `value`.

Alias pour [`urlSearchParams[@@iterator]()`](/fr/nodejs/api/url#urlsearchparamssymboliterator).

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un rappel invalide à l'argument `fn` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoquée pour chaque paire nom-valeur dans la requête.
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) À utiliser comme valeur `this` lorsque `fn` est appelée.

Itère sur chaque paire nom-valeur dans la requête et invoque la fonction donnée.

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Affiche :
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Une chaîne de caractères ou `null` s'il n'y a pas de paire nom-valeur avec le `name` donné.

Retourne la valeur de la première paire nom-valeur dont le nom est `name`. S'il n'y a pas de telles paires, `null` est retourné.

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne les valeurs de toutes les paires nom-valeur dont le nom est `name`. S'il n'y a pas de telles paires, un tableau vide est retourné.

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.2.0, v18.18.0 | Ajout de la prise en charge de l'argument optionnel `value`. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vérifie si l'objet `URLSearchParams` contient une ou plusieurs paires clé-valeur basées sur `name` et un argument `value` optionnel.

Si `value` est fourni, retourne `true` lorsqu'une paire nom-valeur avec le même `name` et la même `value` existe.

Si `value` n'est pas fourni, retourne `true` s'il existe au moins une paire nom-valeur dont le nom est `name`.

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retourne un `Iterator` ES6 sur les noms de chaque paire nom-valeur.

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// Affiche :
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Définit la valeur dans l'objet `URLSearchParams` associé à `name` sur `value`. S'il existe des paires nom-valeur préexistantes dont les noms sont `name`, définit la valeur de la première paire sur `value` et supprime toutes les autres. Sinon, ajoute la paire nom-valeur à la chaîne de requête.

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Affiche foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Affiche foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**Ajouté dans : v19.8.0, v18.16.0**

Nombre total d'entrées de paramètre.

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**Ajouté dans : v7.7.0, v6.13.0**

Trie toutes les paires nom-valeur existantes sur place par leurs noms. Le tri est effectué avec un [algorithme de tri stable](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability), de sorte que l'ordre relatif entre les paires nom-valeur ayant le même nom est préservé.

Cette méthode peut être utilisée, en particulier, pour augmenter le nombre de succès du cache.

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Affiche query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne les paramètres de recherche sérialisés sous forme de chaîne, avec des caractères encodés en pourcentage si nécessaire.

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retourne un `Iterator` ES6 sur les valeurs de chaque paire nom-valeur.


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Retourne un `Iterator` ES6 sur chacune des paires nom-valeur dans la chaîne de requête. Chaque élément de l'itérateur est un `Array` JavaScript. Le premier élément du `Array` est le `nom`, le deuxième élément du `Array` est la `valeur`.

Alias pour [`urlSearchParams.entries()`](/fr/nodejs/api/url#urlsearchparamsentries).

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Affiche :
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0, v18.17.0 | L'exigence ICU est supprimée. |
| v7.4.0, v6.13.0 | Ajouté dans : v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne la sérialisation ASCII [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) du `domaine`. Si `domain` est un domaine non valide, la chaîne vide est retournée.

Elle effectue l'opération inverse de [`url.domainToUnicode()`](/fr/nodejs/api/url#urldomaintounicodedomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Affiche xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Affiche xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Affiche une chaîne vide
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Affiche xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Affiche xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Affiche une chaîne vide
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0, v18.17.0 | L'exigence ICU est supprimée. |
| v7.4.0, v6.13.0 | Ajouté dans : v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne la sérialisation Unicode du `domaine`. Si `domain` est un domaine non valide, la chaîne vide est retournée.

Elle effectue l'opération inverse de [`url.domainToASCII()`](/fr/nodejs/api/url#urldomaintoasciidomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Affiche español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Affiche 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Affiche une chaîne vide
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Affiche español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Affiche 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Affiche une chaîne vide
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | L'argument `options` peut maintenant être utilisé pour déterminer comment analyser l'argument `path`. |
| v10.12.0 | Ajouté dans : v10.12.0 |
:::

- `url` [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La chaîne URL de fichier ou l'objet URL à convertir en chemin.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` si le `path` doit être renvoyé en tant que chemin de fichier Windows, `false` pour posix, et `undefined` pour la valeur par défaut du système. **Par défaut :** `undefined`.
  
 
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin de fichier Node.js spécifique à la plate-forme entièrement résolu.

Cette fonction garantit les décodages corrects des caractères encodés en pourcentage ainsi que la garantie d'une chaîne de chemin absolu valide multiplateforme.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // Incorrect : /C:/path/
fileURLToPath('file:///C:/path/');         // Correct :   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Incorrect : /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correct :   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Incorrect : /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correct :   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Incorrect : /hello%20world
fileURLToPath('file:///hello world');      // Correct :   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // Incorrect : /C:/path/
fileURLToPath('file:///C:/path/');         // Correct :   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Incorrect : /foo.txt
fileURLToPath('file://nas/foo.txt');       // Correct :   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Incorrect : /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Correct :   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Incorrect : /hello%20world
fileURLToPath('file:///hello world');      // Correct :   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**Ajoutée dans : v7.6.0**

- `URL` [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Un objet [WHATWG URL](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la chaîne d'URL sérialisée doit inclure le nom d'utilisateur et le mot de passe, `false` sinon. **Par défaut :** `true`.
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la chaîne d'URL sérialisée doit inclure le fragment, `false` sinon. **Par défaut :** `true`.
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la chaîne d'URL sérialisée doit inclure la requête de recherche, `false` sinon. **Par défaut :** `true`.
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si les caractères Unicode apparaissant dans le composant hôte de la chaîne URL doivent être encodés directement au lieu d'être encodés en Punycode. **Par défaut :** `false`.
  
 
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne une sérialisation personnalisable d'une représentation `String` URL d'un objet [WHATWG URL](/fr/nodejs/api/url#the-whatwg-url-api).

L'objet URL possède à la fois une méthode `toString()` et une propriété `href` qui renvoient des sérialisations de chaîne de l'URL. Cependant, celles-ci ne sont en aucun cas personnalisables. La méthode `url.format(URL[, options])` permet une personnalisation de base de la sortie.



::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | L'argument `options` peut maintenant être utilisé pour déterminer comment renvoyer la valeur `path`. |
| v10.12.0 | Ajouté dans : v10.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin à convertir en URL de fichier.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` si le `path` doit être traité comme un chemin de fichier Windows, `false` pour posix et `undefined` pour la valeur par défaut du système. **Par défaut:** `undefined`.


- Retourne: [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) L'objet URL du fichier.

Cette fonction garantit que `path` est résolu de manière absolue et que les caractères de contrôle URL sont correctement encodés lors de la conversion en URL de fichier.

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // Incorrect : file:///foo#1
pathToFileURL('/foo#1');              // Correct :   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Incorrect : file:///some/path%.c
pathToFileURL('/some/path%.c');       // Correct :   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // Incorrect : throws (POSIX)
new URL(__filename);                  // Incorrect : C:\... (Windows)
pathToFileURL(__filename);            // Correct :   file:///... (POSIX)
pathToFileURL(__filename);            // Correct :   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // Incorrect : file:///foo#1
pathToFileURL('/foo#1');              // Correct :   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Incorrect : file:///some/path%.c
pathToFileURL('/some/path%.c');       // Correct :   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.9.0, v18.17.0 | L'objet retourné contiendra également toutes les propriétés propres énumérables de l'argument `url`. |
| v15.7.0, v14.18.0 | Ajoutée dans : v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) L'objet [WHATWG URL](/fr/nodejs/api/url#the-whatwg-url-api) à convertir en objet d'options.
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objet d'options
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Protocole à utiliser.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nom de domaine ou une adresse IP du serveur auquel envoyer la requête.
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La portion fragment de l'URL.
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La portion de requête sérialisée de l'URL.
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La portion chemin de l'URL.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chemin de requête. Doit inclure la chaîne de requête, le cas échéant. Ex. : `'/index.html?page=12'`. Une exception est levée lorsque le chemin de la requête contient des caractères illégaux. Actuellement, seuls les espaces sont rejetés, mais cela peut changer à l'avenir.
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL sérialisée.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port du serveur distant.
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Authentification de base, c'est-à-dire `'user:password'` pour calculer un en-tête d'autorisation.

Cette fonction utilitaire convertit un objet URL en un objet d'options ordinaire tel que prévu par les API [`http.request()`](/fr/nodejs/api/http#httprequestoptions-callback) et [`https.request()`](/fr/nodejs/api/https#httpsrequestoptions-callback).

::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## API d'URL héritée {#legacy-url-api}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.13.0, v14.17.0 | L'obsolescence a été révoquée. Le statut est passé à "Hérité". |
| v11.0.0 | Cette API est obsolète. |
:::

::: info [Stable: 3 - Hérité]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stable: 3](/fr/nodejs/api/documentation#stability-index) - Hérité : utilisez plutôt l'API URL WHATWG.
:::

### `urlObject` hérité {#legacy-urlobject}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.13.0, v14.17.0 | L'obsolescence a été révoquée. Le statut est passé à "Hérité". |
| v11.0.0 | L'API URL héritée est obsolète. Utilisez l'API URL WHATWG. |
:::

::: info [Stable: 3 - Hérité]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stable: 3](/fr/nodejs/api/documentation#stability-index) - Hérité : utilisez plutôt l'API URL WHATWG.
:::

L'`urlObject` hérité (`require('node:url').Url` ou `import { Url } from 'node:url'`) est créé et renvoyé par la fonction `url.parse()`.

#### `urlObject.auth` {#urlobjectauth}

La propriété `auth` est la partie nom d'utilisateur et mot de passe de l'URL, également appelée *userinfo*. Ce sous-ensemble de chaîne suit le `protocol` et les doubles barres obliques (si présentes) et précède le composant `host`, délimité par `@`. La chaîne est soit le nom d'utilisateur, soit le nom d'utilisateur et le mot de passe séparés par `:`.

Par exemple : `'user:pass'`.

#### `urlObject.hash` {#urlobjecthash}

La propriété `hash` est la partie identifiant de fragment de l'URL, y compris le caractère `#` de début.

Par exemple : `'#hash'`.

#### `urlObject.host` {#urlobjecthost}

La propriété `host` est la partie hôte complète en minuscules de l'URL, y compris le `port` si spécifié.

Par exemple : `'sub.example.com:8080'`.

#### `urlObject.hostname` {#urlobjecthostname}

La propriété `hostname` est la partie nom d'hôte en minuscules du composant `host` *sans* le `port` inclus.

Par exemple : `'sub.example.com'`.

#### `urlObject.href` {#urlobjecthref}

La propriété `href` est la chaîne URL complète qui a été analysée avec les composants `protocol` et `host` convertis en minuscules.

Par exemple : `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`.


#### `urlObject.path` {#urlobjectpath}

La propriété `path` est une concaténation des composants `pathname` et `search`.

Par exemple : `'/p/a/t/h?query=string'`.

Aucun décodage du `path` n'est effectué.

#### `urlObject.pathname` {#urlobjectpathname}

La propriété `pathname` consiste en la section de chemin d'accès complète de l'URL. C'est tout ce qui suit le `host` (y compris le `port`) et avant le début des composants `query` ou `hash`, délimité par le point d'interrogation ASCII (`?`) ou les caractères dièse (`#`).

Par exemple : `'/p/a/t/h'`.

Aucun décodage de la chaîne de chemin d'accès n'est effectué.

#### `urlObject.port` {#urlobjectport}

La propriété `port` est la partie numérique du port du composant `host`.

Par exemple : `'8080'`.

#### `urlObject.protocol` {#urlobjectprotocol}

La propriété `protocol` identifie le schéma de protocole en minuscules de l'URL.

Par exemple : `'http:'`.

#### `urlObject.query` {#urlobjectquery}

La propriété `query` est soit la chaîne de requête sans le point d'interrogation ASCII de début (`?`), soit un objet renvoyé par la méthode `parse()` du module [`querystring`](/fr/nodejs/api/querystring). Le fait que la propriété `query` soit une chaîne ou un objet est déterminé par l'argument `parseQueryString` passé à `url.parse()`.

Par exemple : `'query=string'` ou `{'query': 'string'}`.

Si elle est renvoyée sous forme de chaîne, aucun décodage de la chaîne de requête n'est effectué. Si elle est renvoyée sous forme d'objet, les clés et les valeurs sont décodées.

#### `urlObject.search` {#urlobjectsearch}

La propriété `search` consiste en la partie "chaîne de requête" complète de l'URL, y compris le caractère point d'interrogation ASCII de début (`?`).

Par exemple : `'?query=string'`.

Aucun décodage de la chaîne de requête n'est effectué.

#### `urlObject.slashes` {#urlobjectslashes}

La propriété `slashes` est un `boolean` avec une valeur de `true` si deux caractères barre oblique ASCII (`/`) sont requis après les deux-points dans le `protocol`.

### `url.format(urlObject)` {#urlformaturlobject}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.0.0 | Lève désormais une exception `ERR_INVALID_URL` lorsque la conversion Punycode d'un nom d'hôte introduit des modifications qui pourraient entraîner une nouvelle analyse de l'URL de manière différente. |
| v15.13.0, v14.17.0 | Dépréciation révoquée. Statut changé en "Legacy". |
| v11.0.0 | L'API d'URL Legacy est dépréciée. Utilisez l'API d'URL WHATWG. |
| v7.0.0 | Les URLs avec un schéma `file:` utiliseront désormais toujours le nombre correct de barres obliques quel que soit l'option `slashes`. Une option `slashes` fausse sans protocole est désormais également respectée à tout moment. |
| v0.1.25 | Ajouté dans : v0.1.25 |
:::

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Legacy: Utilisez l'API d'URL WHATWG à la place.
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un objet URL (tel que renvoyé par `url.parse()` ou construit autrement). S'il s'agit d'une chaîne, elle est convertie en objet en la passant à `url.parse()`.

La méthode `url.format()` renvoie une chaîne URL formatée dérivée de `urlObject`.

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
Si `urlObject` n'est pas un objet ou une chaîne, `url.format()` lèvera une [`TypeError`](/fr/nodejs/api/errors#class-typeerror).

Le processus de formatage fonctionne comme suit :

- Une nouvelle chaîne vide `result` est créée.
- Si `urlObject.protocol` est une chaîne, elle est ajoutée telle quelle à `result`.
- Sinon, si `urlObject.protocol` n'est pas `undefined` et n'est pas une chaîne, une [`Error`](/fr/nodejs/api/errors#class-error) est levée.
- Pour toutes les valeurs de chaîne de `urlObject.protocol` qui *ne se terminent pas* par un caractère deux-points ASCII (`:`), la chaîne littérale `:` sera ajoutée à `result`.
- Si l'une des conditions suivantes est vraie, la chaîne littérale `//` sera ajoutée à `result` :
    - la propriété `urlObject.slashes` est vraie ;
    - `urlObject.protocol` commence par `http`, `https`, `ftp`, `gopher` ou `file` ;


- Si la valeur de la propriété `urlObject.auth` est truthy et que `urlObject.host` ou `urlObject.hostname` ne sont pas `undefined`, la valeur de `urlObject.auth` sera forcée en une chaîne et ajoutée à `result` suivie de la chaîne littérale `@`.
- Si la propriété `urlObject.host` est `undefined` alors :
    - Si `urlObject.hostname` est une chaîne, elle est ajoutée à `result`.
    - Sinon, si `urlObject.hostname` n'est pas `undefined` et n'est pas une chaîne, une [`Error`](/fr/nodejs/api/errors#class-error) est levée.
    - Si la valeur de la propriété `urlObject.port` est truthy et que `urlObject.hostname` n'est pas `undefined` :
    - La chaîne littérale `:` est ajoutée à `result`, et
    - La valeur de `urlObject.port` est forcée en une chaîne et ajoutée à `result`.




- Sinon, si la valeur de la propriété `urlObject.host` est truthy, la valeur de `urlObject.host` est forcée en une chaîne et ajoutée à `result`.
- Si la propriété `urlObject.pathname` est une chaîne qui n'est pas une chaîne vide :
    - Si `urlObject.pathname` *ne commence pas* par une barre oblique ASCII (`/`), alors la chaîne littérale `'/'` est ajoutée à `result`.
    - La valeur de `urlObject.pathname` est ajoutée à `result`.


- Sinon, si `urlObject.pathname` n'est pas `undefined` et n'est pas une chaîne, une [`Error`](/fr/nodejs/api/errors#class-error) est levée.
- Si la propriété `urlObject.search` est `undefined` et si la propriété `urlObject.query` est un `Object`, la chaîne littérale `?` est ajoutée à `result` suivie de la sortie de l'appel de la méthode `stringify()` du module [`querystring`](/fr/nodejs/api/querystring) en passant la valeur de `urlObject.query`.
- Sinon, si `urlObject.search` est une chaîne :
    - Si la valeur de `urlObject.search` *ne commence pas* par le caractère point d'interrogation ASCII (`?`), la chaîne littérale `?` est ajoutée à `result`.
    - La valeur de `urlObject.search` est ajoutée à `result`.


- Sinon, si `urlObject.search` n'est pas `undefined` et n'est pas une chaîne, une [`Error`](/fr/nodejs/api/errors#class-error) est levée.
- Si la propriété `urlObject.hash` est une chaîne :
    - Si la valeur de `urlObject.hash` *ne commence pas* par le caractère dièse ASCII (`#`), la chaîne littérale `#` est ajoutée à `result`.
    - La valeur de `urlObject.hash` est ajoutée à `result`.


- Sinon, si la propriété `urlObject.hash` n'est pas `undefined` et n'est pas une chaîne, une [`Error`](/fr/nodejs/api/errors#class-error) est levée.
- `result` est renvoyé.


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0, v18.13.0 | Dépréciation uniquement dans la documentation. |
| v15.13.0, v14.17.0 | Dépréciation révoquée. Statut modifié en "Legacy". |
| v11.14.0 | La propriété `pathname` de l'objet URL retourné est maintenant `/` lorsqu'il n'y a pas de chemin et que le schéma de protocole est `ws:` ou `wss:`. |
| v11.0.0 | L'API URL Legacy est obsolète. Utilisez l'API URL WHATWG. |
| v9.0.0 | La propriété `search` de l'objet URL retourné est maintenant `null` lorsqu'aucune chaîne de requête n'est présente. |
| v0.1.25 | Ajouté dans : v0.1.25 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez plutôt l'API URL WHATWG.
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La chaîne URL à analyser.
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, la propriété `query` sera toujours définie sur un objet renvoyé par la méthode `parse()` du module [`querystring`](/fr/nodejs/api/querystring). Si `false`, la propriété `query` de l'objet URL renvoyé sera une chaîne non analysée et non décodée. **Par défaut :** `false`.
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, le premier jeton après la chaîne littérale `//` et précédant le prochain `/` sera interprété comme l'`host`. Par exemple, étant donné `//foo/bar`, le résultat serait `{host: 'foo', pathname: '/bar'}` plutôt que `{pathname: '//foo/bar'}`. **Par défaut :** `false`.

La méthode `url.parse()` prend une chaîne URL, l'analyse et renvoie un objet URL.

Une `TypeError` est levée si `urlString` n'est pas une chaîne.

Une `URIError` est levée si la propriété `auth` est présente mais ne peut pas être décodée.

`url.parse()` utilise un algorithme souple et non standard pour analyser les chaînes URL. Il est sujet à des problèmes de sécurité tels que [l'usurpation de nom d'hôte](https://hackerone.com/reports/678487) et une gestion incorrecte des noms d'utilisateur et des mots de passe. Ne pas utiliser avec des entrées non fiables. Les CVE ne sont pas émis pour les vulnérabilités `url.parse()`. Utilisez plutôt l'API [URL WHATWG](/fr/nodejs/api/url#the-whatwg-url-api).


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.13.0, v14.17.0 | Dépréciation révoquée. Statut modifié en "Hérité". |
| v11.0.0 | L'API URL héritée est dépréciée. Utilisez l'API URL WHATWG. |
| v6.6.0 | Les champs `auth` sont désormais conservés intacts lorsque `from` et `to` font référence au même hôte. |
| v6.0.0 | Les champs `auth` sont effacés maintenant que le paramètre `to` contient un nom d'hôte. |
| v6.5.0, v4.6.2 | Le champ `port` est maintenant correctement copié. |
| v0.1.25 | Ajouté dans : v0.1.25 |
:::

::: info [Stable: 3 - Hérité]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stabilité : 3](/fr/nodejs/api/documentation#stability-index) - Hérité : utilisez plutôt l'API URL WHATWG.
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL de base à utiliser si `to` est une URL relative.
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL cible à résoudre.

La méthode `url.resolve()` résout une URL cible par rapport à une URL de base d'une manière similaire à celle d'un navigateur Web résolvant une balise d'ancrage.

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
Pour obtenir le même résultat en utilisant l'API URL WHATWG :

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` est une URL relative.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## Encodage en pourcentage dans les URL {#percent-encoding-in-urls}

Les URL sont autorisées à ne contenir qu'une certaine plage de caractères. Tout caractère en dehors de cette plage doit être encodé. La façon dont ces caractères sont encodés et les caractères à encoder dépend entièrement de l'endroit où le caractère est situé dans la structure de l'URL.


### API Héritée {#legacy-api}

Dans l'API Héritée, les espaces (`' '`) et les caractères suivants seront automatiquement échappés dans les propriétés des objets URL :

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
Par exemple, le caractère espace ASCII (`' '`) est encodé en `%20`. Le caractère barre oblique ASCII (`/`) est encodé en `%3C`.

### API WHATWG {#whatwg-api}

La [norme URL WHATWG](https://url.spec.whatwg.org/) utilise une approche plus sélective et plus précise pour la sélection des caractères encodés que celle utilisée par l'API Héritée.

L'algorithme WHATWG définit quatre « ensembles d'encodage en pourcentage » qui décrivent des plages de caractères qui doivent être encodés en pourcentage :

-  L'*ensemble d'encodage en pourcentage de contrôle C0* comprend les points de code dans la plage U+0000 à U+001F (inclus) et tous les points de code supérieurs à U+007E (~).
-  L'*ensemble d'encodage en pourcentage de fragment* comprend l'*ensemble d'encodage en pourcentage de contrôle C0* et les points de code U+0020 ESPACE, U+0022 ("), U+003C (\<), U+003E (\>) et U+0060 (`).
-  L'*ensemble d'encodage en pourcentage de chemin* comprend l'*ensemble d'encodage en pourcentage de contrôle C0* et les points de code U+0020 ESPACE, U+0022 ("), U+0023 (#), U+003C (\<), U+003E (\>), U+003F (?), U+0060 (`), U+007B ({) et U+007D (}).
-  L'*ensemble d'encodage d'informations utilisateur* comprend l'*ensemble d'encodage en pourcentage de chemin* et les points de code U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B ([) à U+005E(^), et U+007C (|).

L'*ensemble d'encodage en pourcentage d'informations utilisateur* est utilisé exclusivement pour le nom d'utilisateur et les mots de passe encodés dans l'URL. L'*ensemble d'encodage en pourcentage de chemin* est utilisé pour le chemin de la plupart des URL. L'*ensemble d'encodage en pourcentage de fragment* est utilisé pour les fragments d'URL. L'*ensemble d'encodage en pourcentage de contrôle C0* est utilisé pour l'hôte et le chemin dans certaines conditions spécifiques, en plus de tous les autres cas.

Lorsque des caractères non ASCII apparaissent dans un nom d'hôte, le nom d'hôte est encodé à l'aide de l'algorithme [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4). Notez, cependant, qu'un nom d'hôte *peut* contenir *à la fois* des caractères encodés en Punycode et des caractères encodés en pourcentage :

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Affiche https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Affiche https://xn--1xa.example.com
```

