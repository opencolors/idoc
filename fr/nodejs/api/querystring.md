---
title: Documentation Node.js - Chaîne de requête
description: Cette section de la documentation Node.js détaille le module querystring, qui fournit des utilitaires pour analyser et formater les chaînes de requête URL. Elle inclut des méthodes pour échapper et déséchapper les caractères spéciaux, gérer les objets imbriqués et gérer la sérialisation des chaînes de requête.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Chaîne de requête | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette section de la documentation Node.js détaille le module querystring, qui fournit des utilitaires pour analyser et formater les chaînes de requête URL. Elle inclut des méthodes pour échapper et déséchapper les caractères spéciaux, gérer les objets imbriqués et gérer la sérialisation des chaînes de requête.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Chaîne de requête | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette section de la documentation Node.js détaille le module querystring, qui fournit des utilitaires pour analyser et formater les chaînes de requête URL. Elle inclut des méthodes pour échapper et déséchapper les caractères spéciaux, gérer les objets imbriqués et gérer la sérialisation des chaînes de requête.
---


# Chaîne de requête {#query-string}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

Le module `node:querystring` fournit des utilitaires pour analyser et formater les chaînes de requête d'URL. Il est accessible en utilisant :

```js [ESM]
const querystring = require('node:querystring');
```

`querystring` est plus performant que [\<URLSearchParams\>](/fr/nodejs/api/url#class-urlsearchparams) mais n'est pas une API standardisée. Utilisez [\<URLSearchParams\>](/fr/nodejs/api/url#class-urlsearchparams) lorsque les performances ne sont pas critiques ou lorsque la compatibilité avec le code du navigateur est souhaitable.

## `querystring.decode()` {#querystringdecode}

**Ajouté dans : v0.1.99**

La fonction `querystring.decode()` est un alias de `querystring.parse()`.

## `querystring.encode()` {#querystringencode}

**Ajouté dans : v0.1.99**

La fonction `querystring.encode()` est un alias de `querystring.stringify()`.

## `querystring.escape(str)` {#querystringescapestr}

**Ajouté dans : v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `querystring.escape()` effectue un encodage en pourcentage d'URL sur le `str` donné d'une manière optimisée pour les exigences spécifiques des chaînes de requête d'URL.

La méthode `querystring.escape()` est utilisée par `querystring.stringify()` et n'est généralement pas censée être utilisée directement. Elle est exportée principalement pour permettre au code de l'application de fournir une implémentation de codage en pourcentage de remplacement si nécessaire en affectant `querystring.escape` à une autre fonction.

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Plusieurs entrées vides sont maintenant analysées correctement (par exemple, `&=&=`). |
| v6.0.0 | L'objet retourné n'hérite plus de `Object.prototype`. |
| v6.0.0, v4.2.4 | Le paramètre `eq` peut désormais avoir une longueur supérieure à `1`. |
| v0.1.25 | Ajouté dans : v0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La chaîne de requête d'URL à analyser
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La sous-chaîne utilisée pour délimiter les paires clé/valeur dans la chaîne de requête. **Par défaut :** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). La sous-chaîne utilisée pour délimiter les clés et les valeurs dans la chaîne de requête. **Par défaut :** `'='`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à utiliser lors du décodage des caractères encodés en pourcentage dans la chaîne de requête. **Par défaut :** `querystring.unescape()`.
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre maximal de clés à analyser. Spécifiez `0` pour supprimer les limitations de comptage des clés. **Par défaut :** `1000`.

La méthode `querystring.parse()` analyse une chaîne de requête d'URL (`str`) en une collection de paires clé/valeur.

Par exemple, la chaîne de requête `'foo=bar&abc=xyz&abc=123'` est analysée en :

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```

L'objet renvoyé par la méthode `querystring.parse()` *n'hérite pas* prototypiquement de l'objet `Object` JavaScript. Cela signifie que les méthodes `Object` typiques telles que `obj.toString()`, `obj.hasOwnProperty()` et autres ne sont pas définies et *ne fonctionneront pas*.

Par défaut, les caractères encodés en pourcentage dans la chaîne de requête seront supposés utiliser l'encodage UTF-8. Si un autre encodage de caractères est utilisé, une option `decodeURIComponent` alternative devra être spécifiée :

```js [ESM]
// En supposant que la fonction gbkDecodeURIComponent existe déjà...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**Ajouté dans: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'objet à sérialiser dans une chaîne de requête d'URL
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La sous-chaîne utilisée pour délimiter les paires clé-valeur dans la chaîne de requête. **Par défaut :** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). La sous-chaîne utilisée pour délimiter les clés et les valeurs dans la chaîne de requête. **Par défaut :** `'='`.
- `options`
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction à utiliser lors de la conversion des caractères non sécurisés pour les URL en encodage en pourcentage dans la chaîne de requête. **Par défaut :** `querystring.escape()`.

La méthode `querystring.stringify()` produit une chaîne de requête d'URL à partir d'un `obj` donné en itérant sur les "propriétés propres" de l'objet.

Elle sérialise les types de valeurs suivants passés dans `obj` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Les valeurs numériques doivent être finies. Toutes les autres valeurs d'entrée seront converties en chaînes vides.

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Renvoie 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Renvoie 'foo:bar;baz:qux'
```
Par défaut, les caractères nécessitant un encodage en pourcentage dans la chaîne de requête seront encodés en UTF-8. Si un encodage alternatif est requis, une option `encodeURIComponent` alternative devra être spécifiée :

```js [ESM]
// En supposant que la fonction gbkEncodeURIComponent existe déjà,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**Ajouté dans: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `querystring.unescape()` effectue le décodage des caractères URL encodés en pourcentage sur le `str` donné.

La méthode `querystring.unescape()` est utilisée par `querystring.parse()` et il n'est généralement pas prévu de l'utiliser directement. Elle est exportée principalement pour permettre au code de l'application de fournir une implémentation de décodage de remplacement si nécessaire en assignant `querystring.unescape` à une fonction alternative.

Par défaut, la méthode `querystring.unescape()` tente d'utiliser la méthode JavaScript intégrée `decodeURIComponent()` pour décoder. Si cela échoue, un équivalent plus sûr qui ne lève pas d'erreur sur les URL mal formées sera utilisé.

