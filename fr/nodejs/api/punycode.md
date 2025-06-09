---
title: Documentation Node.js - Punycode
description: Cette page fournit une documentation détaillée sur le module Punycode dans Node.js, utilisé pour l'encodage et le décodage des noms de domaine internationalisés.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette page fournit une documentation détaillée sur le module Punycode dans Node.js, utilisé pour l'encodage et le décodage des noms de domaine internationalisés.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette page fournit une documentation détaillée sur le module Punycode dans Node.js, utilisé pour l'encodage et le décodage des noms de domaine internationalisés.
---


# Punycode {#punycode}

**Obsolète depuis : v7.0.0**

::: danger [Stable: 0 - Obsolète]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Obsolète
:::

**Code source :** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**La version du module punycode intégrée à Node.js est obsolète.** Dans une future version majeure de Node.js, ce module sera supprimé. Les utilisateurs qui dépendent actuellement du module `punycode` doivent passer à l'utilisation du module [Punycode.js](https://github.com/bestiejs/punycode.js) fourni par l'utilisateur à la place. Pour l'encodage d'URL basé sur punycode, consultez [`url.domainToASCII`](/fr/nodejs/api/url#urldomaintoasciidomain) ou, plus généralement, l'[API WHATWG URL](/fr/nodejs/api/url#the-whatwg-url-api).

Le module `punycode` est une version intégrée du module [Punycode.js](https://github.com/bestiejs/punycode.js). Il est accessible à l'aide de :

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492) est un schéma d'encodage de caractères défini par RFC 3492 qui est principalement destiné à être utilisé dans les noms de domaine internationalisés. Étant donné que les noms d'hôte dans les URL sont limités aux caractères ASCII uniquement, les noms de domaine qui contiennent des caractères non ASCII doivent être convertis en ASCII à l'aide du schéma Punycode. Par exemple, le caractère japonais qui se traduit par le mot anglais `'example'` est `'例'`. Le nom de domaine internationalisé, `'例.com'` (équivalent à `'example.com'`) est représenté par Punycode comme la chaîne ASCII `'xn--fsq.com'`.

Le module `punycode` fournit une implémentation simple de la norme Punycode.

Le module `punycode` est une dépendance tierce utilisée par Node.js et mise à la disposition des développeurs par commodité. Les correctifs ou autres modifications apportées au module doivent être dirigés vers le projet [Punycode.js](https://github.com/bestiejs/punycode.js).

## `punycode.decode(string)` {#punycodedecodestring}

**Ajouté dans : v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `punycode.decode()` convertit une chaîne [Punycode](https://tools.ietf.org/html/rfc3492) de caractères ASCII uniquement en la chaîne équivalente de points de code Unicode.

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**Ajouté dans : v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `punycode.encode()` convertit une chaîne de points de code Unicode en une chaîne [Punycode](https://tools.ietf.org/html/rfc3492) de caractères ASCII uniquement.

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**Ajouté dans : v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `punycode.toASCII()` convertit une chaîne Unicode représentant un nom de domaine internationalisé en [Punycode](https://tools.ietf.org/html/rfc3492). Seules les parties non ASCII du nom de domaine seront converties. L'appel de `punycode.toASCII()` sur une chaîne qui ne contient déjà que des caractères ASCII n'aura aucun effet.

```js [ESM]
// encode domain names
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**Ajouté dans : v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `punycode.toUnicode()` convertit une chaîne représentant un nom de domaine contenant des caractères encodés en [Punycode](https://tools.ietf.org/html/rfc3492) en Unicode. Seules les parties encodées en [Punycode](https://tools.ietf.org/html/rfc3492) du nom de domaine sont converties.

```js [ESM]
// decode domain names
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**Ajouté dans : v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**Ajouté dans : v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode `punycode.ucs2.decode()` renvoie un tableau contenant les valeurs numériques des points de code de chaque symbole Unicode dans la chaîne.

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// surrogate pair for U+1D306 tetragram for centre:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**Ajouté dans : v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La méthode `punycode.ucs2.encode()` renvoie une chaîne basée sur un tableau de valeurs numériques de points de code.

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**Ajouté dans : v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie une chaîne identifiant le numéro de version actuel de [Punycode.js](https://github.com/bestiejs/punycode.js).

