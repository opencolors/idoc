---
title: Documentation Node.js - Décodeur de Chaînes
description: Le module Décodeur de Chaînes fournit une API pour décoder les objets Buffer en chaînes de caractères, optimisée pour l'encodage interne des caractères des chaînes.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Décodeur de Chaînes | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Décodeur de Chaînes fournit une API pour décoder les objets Buffer en chaînes de caractères, optimisée pour l'encodage interne des caractères des chaînes.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Décodeur de Chaînes | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Décodeur de Chaînes fournit une API pour décoder les objets Buffer en chaînes de caractères, optimisée pour l'encodage interne des caractères des chaînes.
---


# Décodeur de chaîne {#string-decoder}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

Le module `node:string_decoder` fournit une API pour décoder les objets `Buffer` en chaînes de caractères d'une manière qui préserve les caractères UTF-8 et UTF-16 multi-octets encodés. Il est accessible en utilisant :

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

L'exemple suivant illustre l'utilisation de base de la classe `StringDecoder`.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Affiche : ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Affiche : €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Affiche : ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Affiche : €
```
:::

Lorsqu'une instance `Buffer` est écrite dans l'instance `StringDecoder`, une mémoire tampon interne est utilisée pour s'assurer que la chaîne décodée ne contient aucun caractère multi-octets incomplet. Ceux-ci sont conservés dans la mémoire tampon jusqu'au prochain appel à `stringDecoder.write()` ou jusqu'à ce que `stringDecoder.end()` soit appelé.

Dans l'exemple suivant, les trois octets encodés en UTF-8 du symbole de l'euro européen (`€`) sont écrits sur trois opérations distinctes :

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Affiche : €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Affiche : €
```
:::


## Classe : `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**Ajouté dans : v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de caractères que `StringDecoder` utilisera. **Par défaut :** `'utf8'`.

Crée une nouvelle instance de `StringDecoder`.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**Ajouté dans : v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Les octets à décoder.
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne toute entrée restante stockée dans le tampon interne sous forme de chaîne. Les octets représentant des caractères UTF-8 et UTF-16 incomplets seront remplacés par des caractères de substitution appropriés pour l’encodage des caractères.

Si l’argument `buffer` est fourni, un dernier appel à `stringDecoder.write()` est effectué avant de retourner l’entrée restante. Une fois que `end()` est appelé, l’objet `stringDecoder` peut être réutilisé pour une nouvelle entrée.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Chaque caractère non valide est maintenant remplacé par un seul caractère de remplacement au lieu d’un pour chaque octet individuel. |
| v0.1.99 | Ajouté dans : v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Les octets à décoder.
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne une chaîne décodée, en s’assurant que tous les caractères multioctets incomplets à la fin du `Buffer`, du `TypedArray` ou du `DataView` sont omis de la chaîne retournée et stockés dans un tampon interne pour le prochain appel à `stringDecoder.write()` ou `stringDecoder.end()`.

