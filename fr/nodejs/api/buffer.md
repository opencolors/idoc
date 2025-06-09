---
title: Documentation Buffer de Node.js
description: La documentation Buffer de Node.js fournit des informations détaillées sur la manière de travailler avec des données binaires dans Node.js, y compris la création, la manipulation et la conversion de buffers.
head:
  - - meta
    - name: og:title
      content: Documentation Buffer de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentation Buffer de Node.js fournit des informations détaillées sur la manière de travailler avec des données binaires dans Node.js, y compris la création, la manipulation et la conversion de buffers.
  - - meta
    - name: twitter:title
      content: Documentation Buffer de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentation Buffer de Node.js fournit des informations détaillées sur la manière de travailler avec des données binaires dans Node.js, y compris la création, la manipulation et la conversion de buffers.
---


# Buffer {#buffer}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

Les objets `Buffer` sont utilisés pour représenter une séquence d’octets de longueur fixe. De nombreuses API Node.js prennent en charge les `Buffer`s.

La classe `Buffer` est une sous-classe de la classe [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) de JavaScript et l’étend avec des méthodes qui couvrent des cas d’utilisation supplémentaires. Les API Node.js acceptent les [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) simples partout où les `Buffer`s sont également pris en charge.

Bien que la classe `Buffer` soit disponible dans la portée globale, il est toujours recommandé de la référencer explicitement via une instruction import ou require.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crée un Buffer rempli de zéros de longueur 10.
const buf1 = Buffer.alloc(10);

// Crée un Buffer de longueur 10,
// rempli d’octets qui ont tous la valeur `1`.
const buf2 = Buffer.alloc(10, 1);

// Crée un buffer non initialisé de longueur 10.
// C’est plus rapide que d’appeler Buffer.alloc() mais l’instance Buffer renvoyée
// peut contenir d’anciennes données qui doivent être
// remplacées à l’aide de fill(), write() ou d’autres fonctions qui remplissent le contenu du Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Crée un Buffer contenant les octets [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Crée un Buffer contenant les octets [1, 1, 1, 1] – les entrées
// sont toutes tronquées à l’aide de `(value & 255)` pour tenir dans la plage 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Crée un Buffer contenant les octets UTF-8 encodés pour la chaîne 'tést' :
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (en notation hexadécimale)
// [116, 195, 169, 115, 116] (en notation décimale)
const buf6 = Buffer.from('tést');

// Crée un Buffer contenant les octets Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crée un Buffer rempli de zéros de longueur 10.
const buf1 = Buffer.alloc(10);

// Crée un Buffer de longueur 10,
// rempli d’octets qui ont tous la valeur `1`.
const buf2 = Buffer.alloc(10, 1);

// Crée un buffer non initialisé de longueur 10.
// C’est plus rapide que d’appeler Buffer.alloc() mais l’instance Buffer renvoyée
// peut contenir d’anciennes données qui doivent être
// remplacées à l’aide de fill(), write() ou d’autres fonctions qui remplissent le contenu du Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Crée un Buffer contenant les octets [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Crée un Buffer contenant les octets [1, 1, 1, 1] – les entrées
// sont toutes tronquées à l’aide de `(value & 255)` pour tenir dans la plage 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Crée un Buffer contenant les octets UTF-8 encodés pour la chaîne 'tést' :
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (en notation hexadécimale)
// [116, 195, 169, 115, 116] (en notation décimale)
const buf6 = Buffer.from('tést');

// Crée un Buffer contenant les octets Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## Buffers et encodages de caractères {#buffers-and-character-encodings}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.7.0, v14.18.0 | Introduction de l'encodage `base64url`. |
| v6.4.0 | Introduction de `latin1` comme alias de `binary`. |
| v5.0.0 | Suppression des encodages obsolètes `raw` et `raws`. |
:::

Lors de la conversion entre `Buffer` et chaînes de caractères, un encodage de caractères peut être spécifié. Si aucun encodage de caractères n'est spécifié, UTF-8 sera utilisé par défaut.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Affiche : 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Affiche : aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Affiche : <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Affiche : <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Affiche : 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Affiche : aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Affiche : <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Affiche : <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

Les buffers Node.js acceptent toutes les variations de casse des chaînes d'encodage qu'ils reçoivent. Par exemple, UTF-8 peut être spécifié comme `'utf8'`, `'UTF8'` ou `'uTf8'`.

Les encodages de caractères actuellement pris en charge par Node.js sont les suivants :

- `'utf8'` (alias : `'utf-8'`) : Caractères Unicode encodés sur plusieurs octets. De nombreuses pages Web et autres formats de documents utilisent [UTF-8](https://en.wikipedia.org/wiki/UTF-8). Il s'agit de l'encodage de caractères par défaut. Lors du décodage d'un `Buffer` en une chaîne qui ne contient pas exclusivement des données UTF-8 valides, le caractère de remplacement Unicode `U+FFFD` � sera utilisé pour représenter ces erreurs.
- `'utf16le'` (alias : `'utf-16le'`) : Caractères Unicode encodés sur plusieurs octets. Contrairement à `'utf8'`, chaque caractère de la chaîne sera encodé à l'aide de 2 ou 4 octets. Node.js prend uniquement en charge la variante [petit-boutiste](https://en.wikipedia.org/wiki/Endianness) de [UTF-16](https://en.wikipedia.org/wiki/UTF-16).
- `'latin1'` : Latin-1 signifie [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1). Cet encodage de caractères ne prend en charge que les caractères Unicode de `U+0000` à `U+00FF`. Chaque caractère est encodé à l'aide d'un seul octet. Les caractères qui ne rentrent pas dans cette plage sont tronqués et seront mappés à des caractères de cette plage.

La conversion d'un `Buffer` en une chaîne à l'aide de l'un des éléments ci-dessus est appelée décodage, et la conversion d'une chaîne en un `Buffer` est appelée encodage.

Node.js prend également en charge les encodages binaire-texte suivants. Pour les encodages binaire-texte, la convention de nommage est inversée : la conversion d'un `Buffer` en une chaîne est généralement appelée encodage, et la conversion d'une chaîne en un `Buffer` est appelée décodage.

- `'base64'` : Encodage [Base64](https://en.wikipedia.org/wiki/Base64). Lors de la création d'un `Buffer` à partir d'une chaîne, cet encodage acceptera également correctement « l'alphabet sûr pour les URL et les noms de fichiers », comme spécifié dans [RFC 4648, section 5](https://tools.ietf.org/html/rfc4648#section-5). Les caractères d'espacement tels que les espaces, les tabulations et les nouvelles lignes contenus dans la chaîne encodée en base64 sont ignorés.
- `'base64url'` : Encodage [base64url](https://tools.ietf.org/html/rfc4648#section-5) comme spécifié dans [RFC 4648, section 5](https://tools.ietf.org/html/rfc4648#section-5). Lors de la création d'un `Buffer` à partir d'une chaîne, cet encodage acceptera également correctement les chaînes encodées en base64 standard. Lors de l'encodage d'un `Buffer` en une chaîne, cet encodage omettra le remplissage.
- `'hex'` : Encode chaque octet en deux caractères hexadécimaux. Une troncature de données peut se produire lors du décodage de chaînes qui ne sont pas exclusivement constituées d'un nombre pair de caractères hexadécimaux. Voir ci-dessous pour un exemple.

Les encodages de caractères hérités suivants sont également pris en charge :

- `'ascii'` : Pour les données [ASCII](https://en.wikipedia.org/wiki/ASCII) 7 bits uniquement. Lors de l'encodage d'une chaîne dans un `Buffer`, cela équivaut à utiliser `'latin1'`. Lors du décodage d'un `Buffer` en une chaîne, l'utilisation de cet encodage désactivera en outre le bit le plus élevé de chaque octet avant le décodage en tant que `'latin1'`. En général, il ne devrait y avoir aucune raison d'utiliser cet encodage, car `'utf8'` (ou, si l'on sait que les données sont toujours uniquement ASCII, `'latin1'`) sera un meilleur choix lors de l'encodage ou du décodage de texte uniquement ASCII. Il est uniquement fourni pour la compatibilité héritée.
- `'binary'` : Alias pour `'latin1'`. Le nom de cet encodage peut être très trompeur, car tous les encodages répertoriés ici convertissent entre des chaînes et des données binaires. Pour la conversion entre les chaînes et les `Buffer`, `'utf8'` est généralement le bon choix.
- `'ucs2'`, `'ucs-2'` : Alias de `'utf16le'`. UCS-2 désignait auparavant une variante d'UTF-16 qui ne prenait pas en charge les caractères dont les points de code étaient supérieurs à U+FFFF. Dans Node.js, ces points de code sont toujours pris en charge.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Affiche <Buffer 1a>, données tronquées lorsque la première valeur non hexadécimale
// ('g') est rencontrée.

Buffer.from('1a7', 'hex');
// Affiche <Buffer 1a>, données tronquées lorsque les données se terminent par un seul chiffre ('7').

Buffer.from('1634', 'hex');
// Affiche <Buffer 16 34>, toutes les données sont représentées.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Affiche <Buffer 1a>, données tronquées lorsque la première valeur non hexadécimale
// ('g') est rencontrée.

Buffer.from('1a7', 'hex');
// Affiche <Buffer 1a>, données tronquées lorsque les données se terminent par un seul chiffre ('7').

Buffer.from('1634', 'hex');
// Affiche <Buffer 16 34>, toutes les données sont représentées.
```
:::

Les navigateurs Web modernes suivent le [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/) qui alias `'latin1'` et `'ISO-8859-1'` en `'win-1252'`. Cela signifie que lors d'une action telle que `http.get()`, si le jeu de caractères renvoyé est l'un de ceux répertoriés dans la spécification WHATWG, il est possible que le serveur ait en fait renvoyé des données encodées en `'win-1252'`, et l'utilisation de l'encodage `'latin1'` peut décoder incorrectement les caractères.


## Buffers et TypedArrays {#buffers-and-typedarrays}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v3.0.0 | La classe `Buffer` hérite désormais de `Uint8Array`. |
:::

Les instances de `Buffer` sont également des instances JavaScript de [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) et [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray). Toutes les méthodes de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) sont disponibles sur les `Buffer`. Il existe cependant de subtiles incompatibilités entre l'API `Buffer` et l'API [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

En particulier :

- Alors que [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) crée une copie d'une partie du `TypedArray`, [`Buffer.prototype.slice()`](/fr/nodejs/api/buffer#bufslicestart-end) crée une vue sur le `Buffer` existant sans copie. Ce comportement peut être surprenant, et n'existe que pour la compatibilité avec l'ancien code. [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) peut être utilisé pour obtenir le comportement de [`Buffer.prototype.slice()`](/fr/nodejs/api/buffer#bufslicestart-end) à la fois sur les `Buffer` et les autres `TypedArray`, et il est préférable de l'utiliser.
- [`buf.toString()`](/fr/nodejs/api/buffer#buftostringencoding-start-end) est incompatible avec son équivalent `TypedArray`.
- Un certain nombre de méthodes, par exemple [`buf.indexOf()`](/fr/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), prennent en charge des arguments supplémentaires.

Il existe deux façons de créer de nouvelles instances de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) à partir d'un `Buffer` :

- Passer un `Buffer` à un constructeur [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) copiera le contenu du `Buffer`, interprété comme un tableau d'entiers, et non comme une séquence d'octets du type cible.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```
:::

- Passer le [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sous-jacent du `Buffer` créera un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) qui partagera sa mémoire avec le `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```
:::

Il est possible de créer un nouveau `Buffer` qui partage la même mémoire allouée qu'une instance [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) en utilisant la propriété `.buffer` de l'objet `TypedArray` de la même manière. [`Buffer.from()`](/fr/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) se comporte comme `new Uint8Array()` dans ce contexte.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```
:::

Lors de la création d'un `Buffer` à l'aide de la propriété `.buffer` d'un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), il est possible d'utiliser uniquement une partie du [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sous-jacent en transmettant les paramètres `byteOffset` et `length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```
:::

Les signatures et implémentations de `Buffer.from()` et [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) sont différentes. Plus précisément, les variantes [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) acceptent un deuxième argument qui est une fonction de mappage qui est appelée sur chaque élément du tableau typé :

- `TypedArray.from(source[, mapFn[, thisArg]])`

La méthode `Buffer.from()`, cependant, ne prend pas en charge l'utilisation d'une fonction de mappage :

- [`Buffer.from(array)`](/fr/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/fr/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/fr/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## Tampons et itération {#buffers-and-iteration}

Les instances de `Buffer` peuvent être parcourues à l'aide de la syntaxe `for..of` :

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Affiche :
//   1
//   2
//   3
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Affiche :
//   1
//   2
//   3
```
:::

De plus, les méthodes [`buf.values()`](/fr/nodejs/api/buffer#bufvalues), [`buf.keys()`](/fr/nodejs/api/buffer#bufkeys) et [`buf.entries()`](/fr/nodejs/api/buffer#bufentries) peuvent être utilisées pour créer des itérateurs.

## Classe : `Blob` {#class-blob}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0, v16.17.0 | N'est plus expérimental. |
| v15.7.0, v14.18.0 | Ajouté dans : v15.7.0, v14.18.0 |
:::

Un [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) encapsule des données brutes immuables qui peuvent être partagées en toute sécurité entre plusieurs threads worker.

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.7.0 | Ajout de l'option standard `endings` pour remplacer les fins de ligne, et suppression de l'option non standard `encoding`. |
| v15.7.0, v14.18.0 | Ajouté dans : v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/fr/nodejs/api/buffer#class-blob) Un tableau de chaînes de caractères, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), ou d'objets [\<Blob\>](/fr/nodejs/api/buffer#class-blob), ou tout mélange de ces objets, qui seront stockés dans le `Blob`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'transparent'` ou `'native'`. Lorsque la valeur est définie sur `'native'`, les fins de ligne dans les parties de la source de la chaîne seront converties en fin de ligne native de la plateforme, comme spécifié par `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type de contenu Blob. L'intention est que `type` transmette le type de média MIME des données, mais aucune validation du format de type n'est effectuée.

Crée un nouvel objet `Blob` contenant une concaténation des sources données.

Les sources [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) et [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) sont copiées dans le "Blob" et peuvent donc être modifiées en toute sécurité après la création du "Blob".

Les sources de chaînes sont encodées en tant que séquences d'octets UTF-8 et copiées dans le Blob. Les paires de substitution non appariées dans chaque partie de la chaîne seront remplacées par des caractères de remplacement Unicode U+FFFD.


### `blob.arrayBuffer()` {#blobarraybuffer}

**Ajouté dans : v15.7.0, v14.18.0**

- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Renvoie une promesse qui se réalise avec un [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contenant une copie des données `Blob`.

#### `blob.bytes()` {#blobbytes}

**Ajouté dans : v22.3.0, v20.16.0**

La méthode `blob.bytes()` renvoie l’octet de l’objet `Blob` sous forme de `Promise<Uint8Array>`.

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Affiche : Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**Ajouté dans : v15.7.0, v14.18.0**

La taille totale du `Blob` en octets.

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**Ajouté dans : v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) L’index de départ.
- `end` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) L’index de fin.
- `type` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Le content-type pour le nouveau `Blob`

Crée et renvoie un nouveau `Blob` contenant un sous-ensemble des données de cet objet `Blob`. Le `Blob` original n’est pas modifié.

### `blob.stream()` {#blobstream}

**Ajouté dans : v16.7.0**

- Retourne : [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)

Renvoie un nouveau `ReadableStream` qui permet de lire le contenu du `Blob`.

### `blob.text()` {#blobtext}

**Ajouté dans : v15.7.0, v14.18.0**

- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Renvoie une promesse qui se réalise avec le contenu du `Blob` décodé comme une chaîne UTF-8.

### `blob.type` {#blobtype}

**Ajouté dans : v15.7.0, v14.18.0**

- Type : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)

Le content-type du `Blob`.


### Objets `Blob` et `MessageChannel` {#blob-objects-and-messagechannel}

Une fois qu'un objet [\<Blob\>](/fr/nodejs/api/buffer#class-blob) est créé, il peut être envoyé via `MessagePort` vers plusieurs destinations sans transfert ni copie immédiate des données. Les données contenues dans le `Blob` ne sont copiées que lorsque les méthodes `arrayBuffer()` ou `text()` sont appelées.

::: code-group
```js [ESM]
import { Blob } from 'node:buffer';
import { setTimeout as delay } from 'node:timers/promises';

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```

```js [CJS]
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```
:::

## Classe : `Buffer` {#class-buffer}

La classe `Buffer` est un type global pour traiter directement les données binaires. Il peut être construit de différentes manières.

### Méthode statique : `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Lance ERR_INVALID_ARG_TYPE ou ERR_OUT_OF_RANGE au lieu de ERR_INVALID_ARG_VALUE pour les arguments d'entrée invalides. |
| v15.0.0 | Lance ERR_INVALID_ARG_VALUE au lieu de ERR_INVALID_OPT_VALUE pour les arguments d'entrée invalides. |
| v10.0.0 | Tenter de remplir un tampon de longueur non nulle avec un tampon de longueur nulle déclenche une exception. |
| v10.0.0 | Spécifier une chaîne invalide pour `fill` déclenche une exception. |
| v8.9.3 | Spécifier une chaîne invalide pour `fill` entraîne maintenant un tampon rempli de zéros. |
| v5.10.0 | Ajouté dans : v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur souhaitée du nouveau `Buffer`.
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Une valeur pour pré-remplir le nouveau `Buffer` avec. **Par défaut :** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `fill` est une chaîne, voici son encodage. **Par défaut :** `'utf8'`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Alloue un nouveau `Buffer` de `size` octets. Si `fill` est `undefined`, le `Buffer` sera rempli de zéros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```
:::

Si `size` est supérieur à [`buffer.constants.MAX_LENGTH`](/fr/nodejs/api/buffer#bufferconstantsmax_length) ou inférieur à 0, [`ERR_OUT_OF_RANGE`](/fr/nodejs/api/errors#err_out_of_range) est levée.

Si `fill` est spécifié, le `Buffer` alloué sera initialisé en appelant [`buf.fill(fill)`](/fr/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```
:::

Si `fill` et `encoding` sont spécifiés, le `Buffer` alloué sera initialisé en appelant [`buf.fill(fill, encoding)`](/fr/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```
:::

Appeler [`Buffer.alloc()`](/fr/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) peut être sensiblement plus lent que l’alternative [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize), mais garantit que le contenu de l’instance `Buffer` nouvellement créée ne contiendra jamais de données sensibles provenant d’allocations précédentes, y compris les données qui n’auraient pas été allouées pour les `Buffer`s.

Une `TypeError` sera levée si `size` n’est pas un nombre.


### Méthode statique : `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Lance ERR_INVALID_ARG_TYPE ou ERR_OUT_OF_RANGE au lieu de ERR_INVALID_ARG_VALUE pour les arguments d'entrée non valides. |
| v15.0.0 | Lance ERR_INVALID_ARG_VALUE au lieu de ERR_INVALID_OPT_VALUE pour les arguments d'entrée non valides. |
| v7.0.0 | Passer une `size` négative lèvera désormais une erreur. |
| v5.10.0 | Ajouté dans : v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur souhaitée du nouveau `Buffer`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Alloue un nouveau `Buffer` de `size` octets. Si `size` est supérieur à [`buffer.constants.MAX_LENGTH`](/fr/nodejs/api/buffer#bufferconstantsmax_length) ou inférieur à 0, [`ERR_OUT_OF_RANGE`](/fr/nodejs/api/errors#err_out_of_range) est levée.

La mémoire sous-jacente des instances `Buffer` créées de cette manière *n'est pas initialisée*. Le contenu du `Buffer` nouvellement créé est inconnu et *peut contenir des données sensibles*. Utilisez plutôt [`Buffer.alloc()`](/fr/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) pour initialiser les instances `Buffer` avec des zéros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Affiche (le contenu peut varier) : <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Affiche : <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Affiche (le contenu peut varier) : <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Affiche : <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

Un `TypeError` sera levé si `size` n'est pas un nombre.

Le module `Buffer` pré-alloue une instance `Buffer` interne de la taille [`Buffer.poolSize`](/fr/nodejs/api/buffer#class-property-bufferpoolsize) qui est utilisée comme pool pour l'allocation rapide de nouvelles instances `Buffer` créées en utilisant [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(array)`](/fr/nodejs/api/buffer#static-method-bufferfromarray), [`Buffer.from(string)`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding) et [`Buffer.concat()`](/fr/nodejs/api/buffer#static-method-bufferconcatlist-totallength) uniquement lorsque `size` est inférieur à `Buffer.poolSize \>\>\> 1` (partie entière de [`Buffer.poolSize`](/fr/nodejs/api/buffer#class-property-bufferpoolsize) divisée par deux).

L'utilisation de ce pool de mémoire interne pré-alloué est une différence essentielle entre l'appel de `Buffer.alloc(size, fill)` et `Buffer.allocUnsafe(size).fill(fill)`. Plus précisément, `Buffer.alloc(size, fill)` *n'utilisera jamais* le pool `Buffer` interne, tandis que `Buffer.allocUnsafe(size).fill(fill)` *utilisera* le pool `Buffer` interne si `size` est inférieur ou égal à la moitié de [`Buffer.poolSize`](/fr/nodejs/api/buffer#class-property-bufferpoolsize). La différence est subtile, mais peut être importante lorsqu'une application nécessite les performances supplémentaires que [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) fournit.


### Méthode statique : `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0 | Lancer ERR_INVALID_ARG_TYPE ou ERR_OUT_OF_RANGE au lieu de ERR_INVALID_ARG_VALUE pour les arguments d'entrée non valides. |
| v15.0.0 | Lancer ERR_INVALID_ARG_VALUE au lieu de ERR_INVALID_OPT_VALUE pour les arguments d'entrée non valides. |
| v5.12.0 | Ajouté dans : v5.12.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur souhaitée du nouveau `Buffer`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Alloue un nouveau `Buffer` de `size` octets. Si `size` est supérieur à [`buffer.constants.MAX_LENGTH`](/fr/nodejs/api/buffer#bufferconstantsmax_length) ou inférieur à 0, [`ERR_OUT_OF_RANGE`](/fr/nodejs/api/errors#err_out_of_range) est émis. Un `Buffer` de longueur zéro est créé si `size` est 0.

La mémoire sous-jacente des instances `Buffer` créées de cette manière *n'est pas initialisée*. Le contenu du `Buffer` nouvellement créé est inconnu et *peut contenir des données sensibles*. Utilisez [`buf.fill(0)`](/fr/nodejs/api/buffer#buffillvalue-offset-end-encoding) pour initialiser ces instances `Buffer` avec des zéros.

Lorsque vous utilisez [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) pour allouer de nouvelles instances `Buffer`, les allocations inférieures à `Buffer.poolSize \>\>\> 1` (4 KiB lorsque la poolSize par défaut est utilisée) sont extraites d'un seul `Buffer` pré-alloué. Cela permet aux applications d'éviter la surcharge de garbage collection liée à la création de nombreuses instances `Buffer` allouées individuellement. Cette approche améliore à la fois les performances et l'utilisation de la mémoire en éliminant la nécessité de suivre et de nettoyer autant d'objets `ArrayBuffer` individuels.

Cependant, dans le cas où un développeur pourrait avoir besoin de conserver un petit bloc de mémoire d'un pool pendant une durée indéterminée, il peut être approprié de créer une instance `Buffer` non groupée à l'aide de `Buffer.allocUnsafeSlow()` puis d'en copier les bits pertinents.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Besoin de conserver quelques petits blocs de mémoire.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allouer pour les données conservées.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copier les données dans la nouvelle allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Besoin de conserver quelques petits blocs de mémoire.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Allouer pour les données conservées.
    const sb = Buffer.allocUnsafeSlow(10);

    // Copier les données dans la nouvelle allocation.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

Un `TypeError` sera émis si `size` n'est pas un nombre.


### Méthode statique : `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.0.0 | Le passage d’une entrée non valide lève désormais une erreur. |
| v5.10.0 | Le paramètre `string` peut désormais être n’importe quel `TypedArray`, `DataView` ou `ArrayBuffer`. |
| v0.1.90 | Ajoutée dans : v0.1.90 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Une valeur pour calculer la longueur de.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `string` est une chaîne de caractères, il s’agit de son encodage. **Par défaut :** `'utf8'`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d’octets contenus dans `string`.

Retourne la longueur en octets d’une chaîne de caractères lorsqu’elle est encodée à l’aide de `encoding`. Ce n’est pas la même chose que [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length), qui ne tient pas compte de l’encodage utilisé pour convertir la chaîne de caractères en octets.

Pour `'base64'`, `'base64url'` et `'hex'`, cette fonction suppose une entrée valide. Pour les chaînes de caractères qui contiennent des données non encodées en base64/hexadécimal (par exemple, des espaces blancs), la valeur de retour peut être supérieure à la longueur d’un `Buffer` créé à partir de la chaîne de caractères.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} caractères, ` +
            `${Buffer.byteLength(str, 'utf8')} octets`);
// Prints: ½ + ¼ = ¾: 9 caractères, 12 octets
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} caractères, ` +
            `${Buffer.byteLength(str, 'utf8')} octets`);
// Prints: ½ + ¼ = ¾: 9 caractères, 12 octets
```
:::

Lorsque `string` est un `Buffer`/[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)/[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)/[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)/ [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), la longueur en octets signalée par `.byteLength` est retournée.


### Méthode statique : `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Les arguments peuvent désormais être des `Uint8Array`. |
| v0.11.13 | Ajouté dans : v0.11.13 |
:::

- `buf1` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Soit `-1`, `0`, ou `1`, en fonction du résultat de la comparaison. Voir [`buf.compare()`](/fr/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) pour plus de détails.

Compare `buf1` à `buf2`, généralement dans le but de trier des tableaux d'instances `Buffer`. Ceci équivaut à appeler [`buf1.compare(buf2)`](/fr/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Affiche : [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Ce résultat est égal à : [buf2, buf1].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Affiche : [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Ce résultat est égal à : [buf2, buf1].)
```
:::

### Méthode statique : `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Les éléments de `list` peuvent désormais être des `Uint8Array`. |
| v0.7.11 | Ajouté dans : v0.7.11 |
:::

- `list` [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Liste des instances `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) à concaténer.
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur totale des instances `Buffer` dans `list` une fois concaténées.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Retourne un nouveau `Buffer` qui est le résultat de la concaténation de toutes les instances `Buffer` dans la `list`.

Si la liste ne contient aucun élément, ou si la `totalLength` est 0, un nouveau `Buffer` de longueur nulle est renvoyé.

Si `totalLength` n'est pas fourni, il est calculé à partir des instances `Buffer` dans `list` en additionnant leurs longueurs.

Si `totalLength` est fourni, il est converti en un entier non signé. Si la longueur combinée des `Buffer`s dans `list` dépasse `totalLength`, le résultat est tronqué à `totalLength`. Si la longueur combinée des `Buffer`s dans `list` est inférieure à `totalLength`, l'espace restant est rempli de zéros.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Créer un seul `Buffer` à partir d'une liste de trois instances `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Affiche : 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Affiche : <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Affiche : 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Créer un seul `Buffer` à partir d'une liste de trois instances `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Affiche : 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Affiche : <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Affiche : 42
```
:::

`Buffer.concat()` peut également utiliser le pool `Buffer` interne comme le fait [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Méthode statique : `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**Ajoutée dans : v19.8.0, v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Le [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) à copier.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage de début dans `view`. **Par défaut :** : `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'éléments de `view` à copier. **Par défaut :** `view.length - offset`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Copie la mémoire sous-jacente de `view` dans un nouveau `Buffer`.

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### Méthode statique : `Buffer.from(array)` {#static-method-bufferfromarray}

**Ajoutée dans : v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Alloue un nouveau `Buffer` en utilisant un `array` d'octets dans la plage `0` – `255`. Les entrées de tableau en dehors de cette plage seront tronquées pour s'y intégrer.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crée un nouveau Buffer contenant les octets UTF-8 de la chaîne 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crée un nouveau Buffer contenant les octets UTF-8 de la chaîne 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

Si `array` est un objet de type `Array` (c'est-à-dire un objet avec une propriété `length` de type `number`), il est traité comme s'il s'agissait d'un tableau, sauf s'il s'agit d'un `Buffer` ou d'un `Uint8Array`. Cela signifie que toutes les autres variantes de `TypedArray` sont traitées comme un `Array`. Pour créer un `Buffer` à partir des octets qui sauvegardent un `TypedArray`, utilisez [`Buffer.copyBytesFrom()`](/fr/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length).

Une erreur `TypeError` sera levée si `array` n'est pas un `Array` ou un autre type approprié pour les variantes `Buffer.from()`.

`Buffer.from(array)` et [`Buffer.from(string)`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding) peuvent également utiliser le pool `Buffer` interne comme le fait [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Méthode statique : `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**Ajoutée dans : v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), par exemple la propriété `.buffer` d’un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Indice du premier octet à exposer. **Par défaut :** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à exposer. **Par défaut :** `arrayBuffer.byteLength - byteOffset`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Ceci crée une vue du [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sans copier la mémoire sous-jacente. Par exemple, lorsqu’une référence à la propriété `.buffer` d’une instance [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) est transmise, le `Buffer` nouvellement créé partagera la même mémoire allouée que le `ArrayBuffer` sous-jacent de [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```
:::

Les arguments optionnels `byteOffset` et `length` spécifient une plage de mémoire dans `arrayBuffer` qui sera partagée par le `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```
:::

Une `TypeError` sera levée si `arrayBuffer` n’est pas un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) ou un autre type approprié pour les variantes `Buffer.from()`.

Il est important de se rappeler qu’un `ArrayBuffer` de stockage peut couvrir une plage de mémoire qui s’étend au-delà des limites d’une vue `TypedArray`. Un nouveau `Buffer` créé à l’aide de la propriété `buffer` d’un `TypedArray` peut s’étendre au-delà de la plage du `TypedArray` :

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 elements
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 elements
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Prints: <Buffer 63 64 65 66>
```
:::


### Méthode statique : `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**Ajoutée dans : v5.10.0**

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` existant ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) à partir duquel copier les données.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Copie les données `buffer` passées sur une nouvelle instance `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Affiche : auffer
console.log(buf2.toString());
// Affiche : buffer
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Affiche : auffer
console.log(buf2.toString());
// Affiche : buffer
```
:::

Une `TypeError` sera levée si `buffer` n’est pas un `Buffer` ou un autre type approprié pour les variantes `Buffer.from()`.

### Méthode statique : `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**Ajoutée dans : v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet prenant en charge `Symbol.toPrimitive` ou `valueOf()`.
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un décalage d’octet ou un encodage.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Une longueur.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Pour les objets dont la fonction `valueOf()` renvoie une valeur qui n’est pas strictement égale à `object`, renvoie `Buffer.from(object.valueOf(), offsetOrEncoding, length)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from(new String('this is a test'));
// Affiche : <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Affiche : <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Pour les objets qui prennent en charge `Symbol.toPrimitive`, renvoie `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Affiche : <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Affiche : <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Une `TypeError` sera levée si `object` n’a pas les méthodes mentionnées ou n’est pas d’un autre type approprié pour les variantes `Buffer.from()`.


### Méthode statique : `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**Ajouté dans : v5.10.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une chaîne de caractères à encoder.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’encodage de `string`. **Par défaut :** `'utf8'`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Crée un nouveau `Buffer` contenant `string`. Le paramètre `encoding` identifie l’encodage de caractères à utiliser lors de la conversion de `string` en octets.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Affiche : this is a tést
console.log(buf2.toString());
// Affiche : this is a tést
console.log(buf1.toString('latin1'));
// Affiche : this is a tÃ©st
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Affiche : this is a tést
console.log(buf2.toString());
// Affiche : this is a tést
console.log(buf1.toString('latin1'));
// Affiche : this is a tÃ©st
```
:::

Une erreur `TypeError` sera levée si `string` n’est pas une chaîne de caractères ou un autre type approprié pour les variantes `Buffer.from()`.

[`Buffer.from(string)`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding) peut également utiliser le pool `Buffer` interne comme le fait [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize).

### Méthode statique : `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**Ajouté dans la version : v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si `obj` est un `Buffer`, `false` sinon.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```
:::


### Méthode statique : `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**Ajouté dans : v0.9.1**

- `encoding` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String) Le nom d’un encodage de caractères à vérifier.
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean)

Renvoie `true` si `encoding` est le nom d’un encodage de caractères pris en charge, ou `false` sinon.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// Affiche : true

console.log(Buffer.isEncoding('hex'));
// Affiche : true

console.log(Buffer.isEncoding('utf/8'));
// Affiche : false

console.log(Buffer.isEncoding(''));
// Affiche : false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Affiche : true

console.log(Buffer.isEncoding('hex'));
// Affiche : true

console.log(Buffer.isEncoding('utf/8'));
// Affiche : false

console.log(Buffer.isEncoding(''));
// Affiche : false
```
:::

### Propriété de classe : `Buffer.poolSize` {#class-property-bufferpoolsize}

**Ajouté dans : v0.11.3**

- [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Number) **Par défaut :** `8192`

C’est la taille (en octets) des instances `Buffer` internes préallouées utilisées pour le regroupement. Cette valeur peut être modifiée.

### `buf[index]` {#bufindex}

- `index` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Number)

L’opérateur d’index `[index]` peut être utilisé pour obtenir et définir l’octet à la position `index` dans `buf`. Les valeurs font référence à des octets individuels, de sorte que la plage de valeurs autorisée est comprise entre `0x00` et `0xFF` (hexadécimal) ou entre `0` et `255` (décimal).

Cet opérateur est hérité de `Uint8Array`, son comportement sur les accès hors limites est donc le même que `Uint8Array`. En d’autres termes, `buf[index]` renvoie `undefined` lorsque `index` est négatif ou supérieur ou égal à `buf.length`, et `buf[index] = value` ne modifie pas le tampon si `index` est négatif ou `\>= buf.length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Copie une chaîne ASCII dans un `Buffer` un octet à la fois.
// (Cela ne fonctionne que pour les chaînes ASCII uniquement. En général, il faut utiliser
// `Buffer.from()` pour effectuer cette conversion.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Affiche : Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Copie une chaîne ASCII dans un `Buffer` un octet à la fois.
// (Cela ne fonctionne que pour les chaînes ASCII uniquement. En général, il faut utiliser
// `Buffer.from()` pour effectuer cette conversion.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Affiche : Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) L'objet `ArrayBuffer` sous-jacent sur lequel cet objet `Buffer` est créé.

Il n'est pas garanti que cet `ArrayBuffer` corresponde exactement au `Buffer` d'origine. Voir les notes sur `buf.byteOffset` pour plus de détails.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```
:::

### `buf.byteOffset` {#bufbyteoffset}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le `byteOffset` de l'objet `ArrayBuffer` sous-jacent du `Buffer`.

Lors de la définition de `byteOffset` dans `Buffer.from(ArrayBuffer, byteOffset, length)`, ou parfois lors de l'allocation d'un `Buffer` plus petit que `Buffer.poolSize`, le tampon ne commence pas à partir d'un décalage zéro sur l'`ArrayBuffer` sous-jacent.

Cela peut poser des problèmes lors de l'accès à l'`ArrayBuffer` sous-jacent directement à l'aide de `buf.buffer`, car d'autres parties de l'`ArrayBuffer` peuvent ne pas être liées à l'objet `Buffer` lui-même.

Un problème courant lors de la création d'un objet `TypedArray` qui partage sa mémoire avec un `Buffer` est que, dans ce cas, il faut spécifier correctement le `byteOffset` :



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer';

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Le paramètre `target` peut maintenant être un `Uint8Array`. |
| v5.11.0 | Des paramètres supplémentaires pour spécifier des décalages sont maintenant pris en charge. |
| v0.11.13 | Ajoutée dans : v0.11.13 |
:::

- `target` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) avec lequel comparer `buf`.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage dans `target` auquel commencer la comparaison. **Par défaut :** `0`.
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage dans `target` auquel terminer la comparaison (non inclus). **Par défaut :** `target.length`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage dans `buf` auquel commencer la comparaison. **Par défaut :** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage dans `buf` auquel terminer la comparaison (non inclus). **Par défaut :** [`buf.length`](/fr/nodejs/api/buffer#buflength).
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Compare `buf` avec `target` et retourne un nombre indiquant si `buf` vient avant, après ou est identique à `target` dans l'ordre de tri. La comparaison est basée sur la séquence réelle d'octets dans chaque `Buffer`.

- `0` est retourné si `target` est identique à `buf`.
- `1` est retourné si `target` doit venir *avant* `buf` lors du tri.
- `-1` est retourné si `target` doit venir *après* `buf` lors du tri.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```
:::

Les arguments optionnels `targetStart`, `targetEnd`, `sourceStart` et `sourceEnd` peuvent être utilisés pour limiter la comparaison à des plages spécifiques dans `target` et `buf` respectivement.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```
:::

[`ERR_OUT_OF_RANGE`](/fr/nodejs/api/errors#err_out_of_range) est émis si `targetStart < 0`, `sourceStart < 0`, `targetEnd > target.byteLength` ou `sourceEnd > source.byteLength`.


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**Ajoutée dans : v0.1.90**

- `target` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) dans lequel copier.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage dans `target` auquel commencer l’écriture. **Par défaut :** `0`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage dans `buf` à partir duquel commencer la copie. **Par défaut :** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage dans `buf` auquel arrêter la copie (non inclus). **Par défaut :** [`buf.length`](/fr/nodejs/api/buffer#buflength).
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d’octets copiés.

Copie les données d’une région de `buf` vers une région dans `target`, même si la région de mémoire `target` chevauche `buf`.

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) effectue la même opération, et est disponible pour tous les TypedArrays, y compris les `Buffer`s de Node.js, bien qu’elle prenne des arguments de fonction différents.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crée deux instances de `Buffer`.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 est la valeur ASCII décimale pour 'a'.
  buf1[i] = i + 97;
}

// Copie les octets 16 à 19 de `buf1` dans `buf2` en commençant à l’octet 8 de `buf2`.
buf1.copy(buf2, 8, 16, 20);
// Ceci équivaut à :
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Affiche : !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crée deux instances de `Buffer`.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 est la valeur ASCII décimale pour 'a'.
  buf1[i] = i + 97;
}

// Copie les octets 16 à 19 de `buf1` dans `buf2` en commençant à l’octet 8 de `buf2`.
buf1.copy(buf2, 8, 16, 20);
// Ceci équivaut à :
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Affiche : !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Crée un `Buffer` et copie les données d’une région vers une région qui se chevauche
// dans le même `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 est la valeur ASCII décimale pour 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Affiche : efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Crée un `Buffer` et copie les données d’une région vers une région qui se chevauche
// dans le même `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 est la valeur ASCII décimale pour 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Affiche : efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**Ajouté dans : v1.1.0**

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crée et retourne un [itérateur](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) de paires `[index, byte]` à partir du contenu de `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Affiche tout le contenu d'un `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Affiche :
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Affiche tout le contenu d'un `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Affiche :
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### `buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Les arguments peuvent désormais être des `Uint8Array`. |
| v0.11.13 | Ajouté dans : v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) avec lequel comparer `buf`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si `buf` et `otherBuffer` ont exactement les mêmes octets, `false` sinon. Équivalent à [`buf.compare(otherBuffer) === 0`](/fr/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Affiche : true
console.log(buf1.equals(buf3));
// Affiche : false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Affiche : true
console.log(buf1.equals(buf3));
// Affiche : false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.0.0 | Lance `ERR_OUT_OF_RANGE` au lieu de `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Les valeurs `end` négatives lancent une erreur `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Tenter de remplir un tampon de longueur non nulle avec un tampon de longueur nulle déclenche une exception. |
| v10.0.0 | Spécifier une chaîne invalide pour `value` déclenche une exception. |
| v5.7.0 | Le paramètre `encoding` est désormais pris en charge. |
| v0.5.0 | Ajoutée dans : v0.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La valeur avec laquelle remplir `buf`. Une valeur vide (string, Uint8Array, Buffer) est forcée à `0`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à remplir `buf`. **Par défaut :** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Où arrêter de remplir `buf` (non inclus). **Par défaut :** [`buf.length`](/fr/nodejs/api/buffer#buflength).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage pour `value` si `value` est une chaîne. **Par défaut :** `'utf8'`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Une référence à `buf`.

Remplit `buf` avec la `value` spécifiée. Si `offset` et `end` ne sont pas donnés, tout le `buf` sera rempli :

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Remplir un `Buffer` avec le caractère ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Affiche : hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Remplir un tampon avec une chaîne vide
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Affiche : <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Remplir un `Buffer` avec le caractère ASCII 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Affiche : hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Remplir un tampon avec une chaîne vide
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Affiche : <Buffer 00 00 00 00 00>
```
:::

`value` est forcée à une valeur `uint32` si ce n'est pas une chaîne, un `Buffer` ou un entier. Si l'entier résultant est supérieur à `255` (décimal), `buf` sera rempli avec `value & 255`.

Si l'écriture finale d'une opération `fill()` tombe sur un caractère multi-octet, seuls les octets de ce caractère qui tiennent dans `buf` sont écrits :

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Remplir un `Buffer` avec un caractère qui prend deux octets en UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Affiche : <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Remplir un `Buffer` avec un caractère qui prend deux octets en UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Affiche : <Buffer c8 a2 c8 a2 c8>
```
:::

Si `value` contient des caractères invalides, elle est tronquée ; s'il ne reste plus de données de remplissage valides, une exception est levée :

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Affiche : <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Affiche : <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Lance une exception.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Affiche : <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Affiche : <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Lance une exception.
```
:::


### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**Ajouté dans : v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Ce qu'il faut rechercher.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Où commencer la recherche dans `buf`. Si négatif, l'offset est calculé à partir de la fin de `buf`. **Par défaut :** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Si `value` est une chaîne de caractères, il s'agit de son encodage. **Par défaut :** `'utf8'`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si `value` a été trouvé dans `buf`, `false` sinon.

Équivalent à [`buf.indexOf() !== -1`](/fr/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | La `value` peut désormais être un `Uint8Array`. |
| v5.7.0, v4.4.0 | Lorsque `encoding` est passé, le paramètre `byteOffset` n'est plus obligatoire. |
| v1.5.0 | Ajouté dans : v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ce qu'il faut rechercher.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Où commencer la recherche dans `buf`. Si négatif, le décalage est calculé à partir de la fin de `buf`. **Par défaut:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `value` est une chaîne, c'est l'encodage utilisé pour déterminer la représentation binaire de la chaîne qui sera recherchée dans `buf`. **Par défaut:** `'utf8'`.
- Renvoie: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'index de la première occurrence de `value` dans `buf`, ou `-1` si `buf` ne contient pas `value`.

Si `value` est :

- une chaîne de caractères, `value` est interprété selon l'encodage des caractères dans `encoding`.
- un `Buffer` ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), `value` sera utilisé dans son intégralité. Pour comparer un `Buffer` partiel, utilisez [`buf.subarray`](/fr/nodejs/api/buffer#bufsubarraystart-end).
- un nombre, `value` sera interprété comme une valeur entière non signée de 8 bits comprise entre `0` et `255`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```
:::

Si `value` n'est pas une chaîne de caractères, un nombre ou un `Buffer`, cette méthode lèvera une exception `TypeError`. Si `value` est un nombre, il sera converti en une valeur d'octet valide, un entier entre 0 et 255.

Si `byteOffset` n'est pas un nombre, il sera converti en nombre. Si le résultat de la conversion est `NaN` ou `0`, alors l'intégralité du tampon sera recherchée. Ce comportement correspond à [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```
:::

Si `value` est une chaîne vide ou un `Buffer` vide et que `byteOffset` est inférieur à `buf.length`, `byteOffset` sera renvoyé. Si `value` est vide et que `byteOffset` est au moins égal à `buf.length`, `buf.length` sera renvoyé.


### `buf.keys()` {#bufkeys}

**Ajouté dans : v1.1.0**

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crée et retourne un [itérateur](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) des clés (index) de `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```
:::

### `buf.lastIndexOf(value[, byteOffset][, encoding])` {#buflastindexofvalue-byteoffset-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | La `value` peut maintenant être un `Uint8Array`. |
| v6.0.0 | Ajouté dans : v6.0.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ce qu’il faut rechercher.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Où commencer la recherche dans `buf`. Si négatif, le décalage est calculé à partir de la fin de `buf`. **Par défaut :** `buf.length - 1`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `value` est une chaîne, il s’agit de l’encodage utilisé pour déterminer la représentation binaire de la chaîne qui sera recherchée dans `buf`. **Par défaut :** `'utf8'`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L’index de la dernière occurrence de `value` dans `buf`, ou `-1` si `buf` ne contient pas `value`.

Identique à [`buf.indexOf()`](/fr/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), sauf que la dernière occurrence de `value` est trouvée plutôt que la première.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```
:::

Si `value` n’est pas une chaîne, un nombre ou un `Buffer`, cette méthode lèvera une `TypeError`. Si `value` est un nombre, il sera converti en une valeur d’octet valide, un entier compris entre 0 et 255.

Si `byteOffset` n’est pas un nombre, il sera converti en nombre. Tous les arguments qui se transforment en `NaN`, comme `{}` ou `undefined`, rechercheront dans l’ensemble du tampon. Ce comportement correspond à [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```
:::

Si `value` est une chaîne vide ou un `Buffer` vide, `byteOffset` sera retourné.


### `buf.length` {#buflength}

**Ajouté dans : v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Renvoie le nombre d’octets dans `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Créez un `Buffer` et écrivez une chaîne plus courte en utilisant UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Affiche : 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Affiche : 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Créez un `Buffer` et écrivez une chaîne plus courte en utilisant UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Affiche : 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Affiche : 1234
```
:::

### `buf.parent` {#bufparent}

**Obsolète depuis : v8.0.0**

::: danger [Stable: 0 - Obsolète]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Obsolète : Utilisez [`buf.buffer`](/fr/nodejs/api/buffer#bufbuffer) à la place.
:::

La propriété `buf.parent` est un alias obsolète pour `buf.buffer`.

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**Ajouté dans : v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer la lecture. Doit satisfaire : `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lit un entier 64 bits signé, big-endian depuis `buf` à l’`offset` spécifié.

Les entiers lus depuis un `Buffer` sont interprétés comme des valeurs signées en complément à deux.

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**Ajouté dans : v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer la lecture. Doit satisfaire : `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lit un entier 64 bits signé, little-endian depuis `buf` à l’`offset` spécifié.

Les entiers lus depuis un `Buffer` sont interprétés comme des valeurs signées en complément à deux.


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.10.0, v12.19.0 | Cette fonction est également disponible sous le nom `buf.readBigUint64BE()`. |
| v12.0.0, v10.20.0 | Ajoutée dans : v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer la lecture. Doit satisfaire : `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lit un entier non signé de 64 bits en big-endian depuis `buf` à l’`offset` spécifié.

Cette fonction est également disponible sous l’alias `readBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Affiche : 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Affiche : 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.10.0, v12.19.0 | Cette fonction est également disponible sous le nom `buf.readBigUint64LE()`. |
| v12.0.0, v10.20.0 | Ajoutée dans : v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer la lecture. Doit satisfaire : `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Lit un entier non signé de 64 bits en little-endian depuis `buf` à l’`offset` spécifié.

Cette fonction est également disponible sous l’alias `readBigUint64LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Affiche : 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Affiche : 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un double 64 bits big-endian depuis `buf` à l’`offset` spécifié.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Affiche : 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Affiche : 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un double 64 bits little-endian depuis `buf` à l’`offset` spécifié.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Affiche : 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Affiche : 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Lève ERR_OUT_OF_RANGE.
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un float 32 bits, big-endian depuis `buf` à l'`offset` spécifié.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Affiche : 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Affiche : 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un float 32 bits, little-endian depuis `buf` à l'`offset` spécifié.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Affiche : 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Affiche : 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Lève ERR_OUT_OF_RANGE.
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite du décalage en `uint32`. |
| v0.5.0 | Ajouté dans : v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 1`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier signé de 8 bits à partir de `buf` à l'adresse `offset` spécifiée.

Les entiers lus à partir d'un `Buffer` sont interprétés comme des valeurs signées en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Affiche : -1
console.log(buf.readInt8(1));
// Affiche : 5
console.log(buf.readInt8(2));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Affiche : -1
console.log(buf.readInt8(1));
// Affiche : 5
console.log(buf.readInt8(2));
// Lève ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite du décalage en `uint32`. |
| v0.5.5 | Ajouté dans : v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 2`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier signé de 16 bits big-endian à partir de `buf` à l'adresse `offset` spécifiée.

Les entiers lus à partir d'un `Buffer` sont interprétés comme des valeurs signées en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Affiche : 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Affiche : 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | `noAssert` supprimé et plus de coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajouté dans : v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 2`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier 16 bits signé en little-endian depuis `buf` à l' `offset` spécifié.

Les entiers lus depuis un `Buffer` sont interprétés comme des valeurs signées en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Affiche : 1280
console.log(buf.readInt16LE(1));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Affiche : 1280
console.log(buf.readInt16LE(1));
// Lève ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | `noAssert` supprimé et plus de coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajouté dans : v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier 32 bits signé en big-endian depuis `buf` à l' `offset` spécifié.

Les entiers lus depuis un `Buffer` sont interprétés comme des valeurs signées en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Affiche : 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Affiche : 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajouté dans : v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier 32 bits signé, little-endian, depuis `buf` à l' `offset` spécifié.

Les entiers lus depuis un `Buffer` sont interprétés comme des valeurs signées en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Affiche : 83886080
console.log(buf.readInt32LE(1));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Affiche : 83886080
console.log(buf.readInt32LE(1));
// Lève ERR_OUT_OF_RANGE.
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset et de `byteLength` en `uint32`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à lire. Doit satisfaire `0 \< byteLength \<= 6`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit `byteLength` nombre d'octets depuis `buf` à l' `offset` spécifié et interprète le résultat comme une valeur signée en complément à deux, big-endian, supportant jusqu'à 48 bits de précision.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Affiche : 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Lève ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Affiche : 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Lève ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Lève ERR_OUT_OF_RANGE.
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et de la coercition implicite de l'offset et de `byteLength` en `uint32`. |
| v0.11.15 | Ajoutée dans : v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à lire. Doit satisfaire `0 \< byteLength \<= 6`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit `byteLength` octets depuis `buf` à l'emplacement `offset` spécifié et interprète le résultat comme une valeur signée en complément à deux en little-endian prenant en charge jusqu'à 48 bits de précision.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Affiche : -546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Affiche : -546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible sous le nom `buf.readUint8()`. |
| v10.0.0 | Suppression de `noAssert` et de la coercition implicite de l'offset en `uint32`. |
| v0.5.0 | Ajoutée dans : v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 1`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier non signé de 8 bits depuis `buf` à l'emplacement `offset` spécifié.

Cette fonction est également disponible sous l'alias `readUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Affiche : 1
console.log(buf.readUInt8(1));
// Affiche : 254
console.log(buf.readUInt8(2));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Affiche : 1
console.log(buf.readUInt8(1));
// Affiche : 254
console.log(buf.readUInt8(2));
// Lève ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible en tant que `buf.readUint16BE()`. |
| v10.0.0 | Suppression de `noAssert` et de la coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 2`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier non signé de 16 bits en big-endian depuis `buf` à l' `offset` spécifié.

Cette fonction est également disponible sous l'alias `readUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Affiche : 1234
console.log(buf.readUInt16BE(1).toString(16));
// Affiche : 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Affiche : 1234
console.log(buf.readUInt16BE(1).toString(16));
// Affiche : 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible en tant que `buf.readUint16LE()`. |
| v10.0.0 | Suppression de `noAssert` et de la coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 2`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier non signé de 16 bits en little-endian depuis `buf` à l' `offset` spécifié.

Cette fonction est également disponible sous l'alias `readUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Affiche : 3412
console.log(buf.readUInt16LE(1).toString(16));
// Affiche : 5634
console.log(buf.readUInt16LE(2).toString(16));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Affiche : 3412
console.log(buf.readUInt16LE(1).toString(16));
// Affiche : 5634
console.log(buf.readUInt16LE(2).toString(16));
// Lève ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible sous le nom de `buf.readUint32BE()`. |
| v10.0.0 | Suppression de `noAssert` et de la coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier non signé de 32 bits en big-endian à partir de `buf` à l'`offset` spécifié.

Cette fonction est également disponible sous l'alias `readUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Affiche : 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Affiche : 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible sous le nom de `buf.readUint32LE()`. |
| v10.0.0 | Suppression de `noAssert` et de la coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit un entier non signé de 32 bits en little-endian à partir de `buf` à l'`offset` spécifié.

Cette fonction est également disponible sous l'alias `readUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Affiche : 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Affiche : 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Lève ERR_OUT_OF_RANGE.
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible en tant que `buf.readUintBE()`. |
| v10.0.0 | `noAssert` a été supprimé, ainsi que la coercition implicite de l'offset et de `byteLength` en `uint32`. |
| v0.11.15 | Ajoutée dans : v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à lire. Doit satisfaire `0 \< byteLength \<= 6`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit `byteLength` octets à partir de `buf` à l' `offset` spécifié et interprète le résultat comme un entier non signé en big-endian prenant en charge jusqu'à 48 bits de précision.

Cette fonction est également disponible sous l'alias `readUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Affiche : 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Lève ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Affiche : 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Lève ERR_OUT_OF_RANGE.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible en tant que `buf.readUintLE()`. |
| v10.0.0 | `noAssert` a été supprimé, ainsi que la coercition implicite de l'offset et de `byteLength` en `uint32`. |
| v0.11.15 | Ajoutée dans : v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer la lecture. Doit satisfaire `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à lire. Doit satisfaire `0 \< byteLength \<= 6`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lit `byteLength` octets à partir de `buf` à l' `offset` spécifié et interprète le résultat comme un entier non signé, en little-endian prenant en charge jusqu'à 48 bits de précision.

Cette fonction est également disponible sous l'alias `readUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Affiche : ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Affiche : ab9078563412
```
:::


### `buf.subarray([start[, end]])` {#bufsubarraystart-end}

**Ajouté dans : v3.0.0**

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Où le nouveau `Buffer` commencera. **Par défaut :** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Où le nouveau `Buffer` se terminera (non inclus). **Par défaut :** [`buf.length`](/fr/nodejs/api/buffer#buflength).
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Retourne un nouveau `Buffer` qui référence la même mémoire que l’original, mais décalé et rogné par les index `start` et `end`.

Spécifier un `end` supérieur à [`buf.length`](/fr/nodejs/api/buffer#buflength) retournera le même résultat qu’un `end` égal à [`buf.length`](/fr/nodejs/api/buffer#buflength).

Cette méthode est héritée de [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray).

Modifier la nouvelle tranche `Buffer` modifiera la mémoire dans le `Buffer` original car la mémoire allouée des deux objets se chevauche.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Créer un `Buffer` avec l’alphabet ASCII, prendre une tranche, et modifier un octet
// à partir du `Buffer` original.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 est la valeur ASCII décimale pour 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Affiche : abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Affiche : !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Créer un `Buffer` avec l’alphabet ASCII, prendre une tranche, et modifier un octet
// à partir du `Buffer` original.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 est la valeur ASCII décimale pour 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Affiche : abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Affiche : !bc
```
:::

Spécifier des index négatifs provoque la génération de la tranche par rapport à la fin de `buf` plutôt qu’au début.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Affiche : buffe
// (Équivalent à buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Affiche : buff
// (Équivalent à buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Affiche : uff
// (Équivalent à buf.subarray(1, 4).)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Affiche : buffe
// (Équivalent à buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Affiche : buff
// (Équivalent à buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Affiche : uff
// (Équivalent à buf.subarray(1, 4).)
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.5.0, v16.15.0 | La méthode buf.slice() est obsolète. |
| v7.0.0 | Tous les décalages sont maintenant forcés en entiers avant d'effectuer des calculs avec eux. |
| v7.1.0, v6.9.2 | Forcer les décalages en entiers gère maintenant correctement les valeurs en dehors de la plage d'entiers 32 bits. |
| v0.3.0 | Ajouté dans : v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Où le nouveau `Buffer` va commencer. **Par défaut :** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Où le nouveau `Buffer` va se terminer (non inclus). **Par défaut :** [`buf.length`](/fr/nodejs/api/buffer#buflength).
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

::: danger [Stable: 0 - Obsolète]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Obsolète : Utilisez [`buf.subarray`](/fr/nodejs/api/buffer#bufsubarraystart-end) à la place.
:::

Retourne un nouveau `Buffer` qui référence la même mémoire que l'original, mais décalé et recadré par les index `start` et `end`.

Cette méthode n'est pas compatible avec `Uint8Array.prototype.slice()`, qui est une superclasse de `Buffer`. Pour copier la tranche, utilisez `Uint8Array.prototype.slice()`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Affiche: cuffer

console.log(buf.toString());
// Affiche: buffer

// Avec buf.slice(), le buffer original est modifié.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Affiche: cuffer
console.log(buf.toString());
// Affiche également: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Affiche: cuffer

console.log(buf.toString());
// Affiche: buffer

// Avec buf.slice(), le buffer original est modifié.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Affiche: cuffer
console.log(buf.toString());
// Affiche également: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**Ajouté dans : v5.10.0**

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Une référence à `buf`.

Interprète `buf` comme un tableau d’entiers non signés de 16 bits et permute l’ordre des octets *sur place*. Lève [`ERR_INVALID_BUFFER_SIZE`](/fr/nodejs/api/errors#err_invalid_buffer_size) si [`buf.length`](/fr/nodejs/api/buffer#buflength) n’est pas un multiple de 2.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

Une utilisation pratique de `buf.swap16()` est d’effectuer une conversion rapide sur place entre UTF-16 little-endian et UTF-16 big-endian :

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```
:::

### `buf.swap32()` {#bufswap32}

**Ajouté dans : v5.10.0**

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Une référence à `buf`.

Interprète `buf` comme un tableau d’entiers non signés de 32 bits et permute l’ordre des octets *sur place*. Lève [`ERR_INVALID_BUFFER_SIZE`](/fr/nodejs/api/errors#err_invalid_buffer_size) si [`buf.length`](/fr/nodejs/api/buffer#buflength) n’est pas un multiple de 4.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::


### `buf.swap64()` {#bufswap64}

**Ajoutée dans : v6.3.0**

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Une référence à `buf`.

Interprète `buf` comme un tableau de nombres 64 bits et inverse l’ordre des octets *sur place*. Lève [`ERR_INVALID_BUFFER_SIZE`](/fr/nodejs/api/errors#err_invalid_buffer_size) si [`buf.length`](/fr/nodejs/api/buffer#buflength) n’est pas un multiple de 8.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Affiche : <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Affiche : <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Lève ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Affiche : <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Affiche : <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Lève ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.toJSON()` {#buftojson}

**Ajoutée dans : v0.9.2**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne une représentation JSON de `buf`. [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) appelle implicitement cette fonction lors de la transformation en chaîne d’une instance `Buffer`.

`Buffer.from()` accepte les objets au format retourné par cette méthode. En particulier, `Buffer.from(buf.toJSON())` fonctionne comme `Buffer.from(buf)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Affiche : {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Affiche : <Buffer 01 02 03 04 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Affiche : {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Affiche : <Buffer 01 02 03 04 05>
```
:::


### `buf.toString([encoding[, start[, end]]])` {#buftostringencoding-start-end}

**Ajouté dans: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de caractères à utiliser. **Par défaut :** `'utf8'`.
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage d'octet auquel commencer le décodage. **Par défaut :** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le décalage d'octet auquel arrêter le décodage (non inclus). **Par défaut :** [`buf.length`](/fr/nodejs/api/buffer#buflength).
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Décode `buf` en une chaîne de caractères selon l'encodage de caractères spécifié dans `encoding`. `start` et `end` peuvent être passés pour ne décoder qu'un sous-ensemble de `buf`.

Si `encoding` est `'utf8'` et qu'une séquence d'octets dans l'entrée n'est pas un UTF-8 valide, alors chaque octet invalide est remplacé par le caractère de remplacement `U+FFFD`.

La longueur maximale d'une instance de chaîne (en unités de code UTF-16) est disponible sous le nom de [`buffer.constants.MAX_STRING_LENGTH`](/fr/nodejs/api/buffer#bufferconstantsmax_string_length).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 est la valeur ASCII décimale pour 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 est la valeur ASCII décimale pour 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```
:::


### `buf.values()` {#bufvalues}

**Ajouté dans : v1.1.0**

- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Crée et retourne un [itérateur](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) pour les valeurs (octets) de `buf`. Cette fonction est appelée automatiquement lorsqu’un `Buffer` est utilisé dans une instruction `for..of`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```
:::

### `buf.write(string[, offset[, length]][, encoding])` {#bufwritestring-offset-length-encoding}

**Ajouté dans : v0.1.90**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chaîne à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire `string`. **Par défaut :** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre maximum d’octets à écrire (les octets écrits ne dépasseront pas `buf.length - offset`). **Par défaut :** `buf.length - offset`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’encodage des caractères de `string`. **Par défaut :** `'utf8'`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets écrits.

Écrit `string` dans `buf` à `offset` selon l’encodage des caractères dans `encoding`. Le paramètre `length` est le nombre d’octets à écrire. Si `buf` ne contient pas suffisamment d’espace pour contenir la chaîne entière, seule une partie de `string` sera écrite. Cependant, les caractères partiellement encodés ne seront pas écrits.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```
:::


### `buf.writeBigInt64BE(value[, offset])` {#bufwritebigint64bevalue-offset}

**Ajouté dans : v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire à : `0 <= offset <= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l’`offset` spécifié en big-endian.

`value` est interprété et écrit comme un entier signé en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Affiche : <Buffer 01 02 03 04 05 06 07 08>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Affiche : <Buffer 01 02 03 04 05 06 07 08>
```
:::

### `buf.writeBigInt64LE(value[, offset])` {#bufwritebigint64levalue-offset}

**Ajouté dans : v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire à : `0 <= offset <= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l’`offset` spécifié en little-endian.

`value` est interprété et écrit comme un entier signé en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Affiche : <Buffer 08 07 06 05 04 03 02 01>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Affiche : <Buffer 08 07 06 05 04 03 02 01>
```
:::


### `buf.writeBigUInt64BE(value[, offset])` {#bufwritebiguint64bevalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.10.0, v12.19.0 | Cette fonction est également disponible en tant que `buf.writeBigUint64BE()`. |
| v12.0.0, v10.20.0 | Ajoutée dans : v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire : `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l’`offset` spécifié en tant que big-endian.

Cette fonction est également disponible sous l’alias `writeBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Affiche : <Buffer de ca fa fe ca ce fa de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Affiche : <Buffer de ca fa fe ca ce fa de>
```
:::

### `buf.writeBigUInt64LE(value[, offset])` {#bufwritebiguint64levalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.10.0, v12.19.0 | Cette fonction est également disponible en tant que `buf.writeBigUint64LE()`. |
| v12.0.0, v10.20.0 | Ajoutée dans : v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire : `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l’`offset` spécifié en tant que little-endian.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Affiche : <Buffer de fa ce ca fe fa ca de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Affiche : <Buffer de fa ce ca fe fa ca de>
```
:::

Cette fonction est également disponible sous l’alias `writeBigUint64LE`.


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | `noAssert` supprimé et plus de coercition implicite de l'offset en `uint32`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'offset `offset` spécifié en big-endian. La `value` doit être un nombre JavaScript. Le comportement est indéfini lorsque `value` est autre chose qu'un nombre JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```
:::

### `buf.writeDoubleLE(value[, offset])` {#bufwritedoublelevalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | `noAssert` supprimé et plus de coercition implicite de l'offset en `uint32`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 8`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'offset `offset` spécifié en little-endian. La `value` doit être un nombre JavaScript. Le comportement est indéfini lorsque `value` est autre chose qu'un nombre JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```
:::


### `buf.writeFloatBE(value[, offset])` {#bufwritefloatbevalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.11.15 | Ajoutée dans : v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'`offset` spécifié en big-endian. Le comportement est indéfini lorsque `value` est autre chose qu'un nombre JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.11.15 | Ajoutée dans : v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'`offset` spécifié en little-endian. Le comportement est indéfini lorsque `value` est autre chose qu'un nombre JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | `noAssert` a été supprimé et il n’y a plus de coercition implicite de l’offset en `uint32`. |
| v0.5.0 | Ajoutée dans : v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 1`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l’`offset` spécifié. `value` doit être un entier signé valide de 8 bits. Le comportement est indéfini lorsque `value` est autre chose qu’un entier signé de 8 bits.

`value` est interprété et écrit comme un entier signé en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Affiche : <Buffer 02 fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Affiche : <Buffer 02 fe>
```
:::

### `buf.writeInt16BE(value[, offset])` {#bufwriteint16bevalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | `noAssert` a été supprimé et il n’y a plus de coercition implicite de l’offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 2`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l'`offset` spécifié en big-endian. La `value` doit être un entier signé valide de 16 bits. Le comportement est indéfini lorsque `value` est autre chose qu’un entier signé de 16 bits.

La `value` est interprétée et écrite comme un entier signé en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Affiche : <Buffer 01 02>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Affiche : <Buffer 01 02>
```
:::


### `buf.writeInt16LE(value[, offset])` {#bufwriteint16levalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et de la coercion implicite de l’offset en `uint32`. |
| v0.5.5 | Ajouté dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 2`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l’`offset` spécifié en little-endian. La `value` doit être un entier signé 16 bits valide. Le comportement est indéfini lorsque `value` est autre chose qu’un entier signé 16 bits.

La `value` est interprétée et écrite comme un entier signé en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```
:::

### `buf.writeInt32BE(value[, offset])` {#bufwriteint32bevalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et de la coercion implicite de l’offset en `uint32`. |
| v0.5.5 | Ajouté dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l’`offset` spécifié en big-endian. La `value` doit être un entier signé 32 bits valide. Le comportement est indéfini lorsque `value` est autre chose qu’un entier signé 32 bits.

La `value` est interprétée et écrite comme un entier signé en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```
:::


### `buf.writeInt32LE(value[, offset])` {#bufwriteint32levalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajouté dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `value` dans `buf` à l’`offset` spécifié en little-endian. La `value` doit être un entier signé 32 bits valide. Le comportement est indéfini lorsque `value` est autre chose qu’un entier signé 32 bits.

La `value` est interprétée et écrite comme un entier signé en complément à deux.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Affiche : <Buffer 08 07 06 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Affiche : <Buffer 08 07 06 05>
```
:::

### `buf.writeIntBE(value, offset, byteLength)` {#bufwriteintbevalue-offset-bytelength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l’offset et de `byteLength` en `uint32`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets à écrire. Doit satisfaire `0 \< byteLength \<= 6`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d’octets écrits.

Écrit `byteLength` octets de `value` dans `buf` à l’`offset` spécifié en big-endian. Prend en charge jusqu’à 48 bits de précision. Le comportement est indéfini lorsque `value` est autre chose qu’un entier signé.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Affiche : <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Affiche : <Buffer 12 34 56 78 90 ab>
```
:::


### `buf.writeIntLE(value, offset, byteLength)` {#bufwriteintlevalue-offset-bytelength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset et de `byteLength` en `uint32`. |
| v0.11.15 | Ajoutée dans : v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à écrire. Doit satisfaire `0 \< byteLength \<= 6`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `byteLength` octets de `value` dans `buf` à l'emplacement `offset` spécifié en little-endian. Supporte jusqu'à 48 bits de précision. Le comportement est indéfini lorsque `value` est autre chose qu'un entier signé.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::

### `buf.writeUInt8(value[, offset])` {#bufwriteuint8value-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible sous le nom de `buf.writeUint8()`. |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.5.0 | Ajoutée dans : v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 1`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'emplacement `offset` spécifié. `value` doit être un entier non signé de 8 bits valide. Le comportement est indéfini lorsque `value` est autre chose qu'un entier non signé de 8 bits.

Cette fonction est également disponible sous l'alias `writeUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Prints: <Buffer 03 04 23 42>
```
:::


### `buf.writeUInt16BE(value[, offset])` {#bufwriteuint16bevalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible en tant que `buf.writeUint16BE()`. |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 2`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'aide de l'`offset` spécifié en big-endian. La `value` doit être un entier non signé de 16 bits valide. Le comportement est indéfini lorsque `value` est autre chose qu'un entier non signé de 16 bits.

Cette fonction est également disponible sous l'alias `writeUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible en tant que `buf.writeUint16LE()`. |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 2`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'aide de l'`offset` spécifié en little-endian. La `value` doit être un entier non signé de 16 bits valide. Le comportement est indéfini lorsque `value` est autre chose qu'un entier non signé de 16 bits.

Cette fonction est également disponible sous l'alias `writeUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Prints: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible sous le nom de `buf.writeUint32BE()`. |
| v10.0.0 | Suppression de `noAssert` et de la coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'aide de l'`offset` spécifié en big-endian. La `value` doit être un entier non signé de 32 bits valide. Le comportement est indéfini lorsque `value` est différent d'un entier non signé de 32 bits.

Cette fonction est également disponible sous l'alias `writeUint32BE`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible sous le nom de `buf.writeUint32LE()`. |
| v10.0.0 | Suppression de `noAssert` et de la coercition implicite de l'offset en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - 4`. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `value` dans `buf` à l'aide de l'`offset` spécifié en little-endian. La `value` doit être un entier non signé de 32 bits valide. Le comportement est indéfini lorsque `value` est différent d'un entier non signé de 32 bits.

Cette fonction est également disponible sous l'alias `writeUint32LE`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Prints: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible sous le nom `buf.writeUintBE()`. |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset et de `byteLength` en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à écrire. Doit satisfaire `0 \< byteLength \<= 6`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `byteLength` octets de `value` dans `buf` à l' `offset` spécifié en big-endian. Prend en charge jusqu'à 48 bits de précision. Le comportement est indéfini lorsque `value` est autre chose qu'un entier non signé.

Cette fonction est également disponible sous l'alias `writeUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::

### `buf.writeUIntLE(value, offset, byteLength)` {#bufwriteuintlevalue-offset-bytelength}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.9.0, v12.19.0 | Cette fonction est également disponible sous le nom `buf.writeUintLE()`. |
| v10.0.0 | Suppression de `noAssert` et plus de coercition implicite de l'offset et de `byteLength` en `uint32`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre à écrire dans `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à ignorer avant de commencer à écrire. Doit satisfaire `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à écrire. Doit satisfaire `0 \< byteLength \<= 6`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` plus le nombre d'octets écrits.

Écrit `byteLength` octets de `value` dans `buf` à l' `offset` spécifié en little-endian. Prend en charge jusqu'à 48 bits de précision. Le comportement est indéfini lorsque `value` est autre chose qu'un entier non signé.

Cette fonction est également disponible sous l'alias `writeUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::


### `new Buffer(array)` {#new-bufferarray}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L'appel à ce constructeur émet un avertissement de dépréciation lorsqu'il est exécuté à partir de code situé en dehors du répertoire `node_modules`. |
| v7.2.1 | L'appel à ce constructeur n'émet plus d'avertissement de dépréciation. |
| v7.0.0 | L'appel à ce constructeur émet désormais un avertissement de dépréciation. |
| v6.0.0 | Déprécié depuis : v6.0.0 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez plutôt [`Buffer.from(array)`](/fr/nodejs/api/buffer#static-method-bufferfromarray).
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un tableau d'octets à copier.

Voir [`Buffer.from(array)`](/fr/nodejs/api/buffer#static-method-bufferfromarray).

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L'appel à ce constructeur émet un avertissement de dépréciation lorsqu'il est exécuté à partir de code situé en dehors du répertoire `node_modules`. |
| v7.2.1 | L'appel à ce constructeur n'émet plus d'avertissement de dépréciation. |
| v7.0.0 | L'appel à ce constructeur émet désormais un avertissement de dépréciation. |
| v6.0.0 | Les paramètres `byteOffset` et `length` sont désormais pris en charge. |
| v6.0.0 | Déprécié depuis : v6.0.0 |
| v3.0.0 | Ajouté dans : v3.0.0 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez plutôt [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/fr/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) ou la propriété `.buffer` d'un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Index du premier octet à exposer. **Par défaut :** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à exposer. **Par défaut :** `arrayBuffer.byteLength - byteOffset`.

Voir [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/fr/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L'appel à ce constructeur émet un avertissement de dépréciation lorsqu'il est exécuté à partir d'un code en dehors du répertoire `node_modules`. |
| v7.2.1 | L'appel à ce constructeur n'émet plus d'avertissement de dépréciation. |
| v7.0.0 | L'appel à ce constructeur émet désormais un avertissement de dépréciation. |
| v6.0.0 | Déprécié depuis : v6.0.0 |
:::

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez [`Buffer.from(buffer)`](/fr/nodejs/api/buffer#static-method-bufferfrombuffer) à la place.
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un `Buffer` existant ou [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) à partir duquel copier les données.

Voir [`Buffer.from(buffer)`](/fr/nodejs/api/buffer#static-method-bufferfrombuffer).

### `new Buffer(size)` {#new-buffersize}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L'appel à ce constructeur émet un avertissement de dépréciation lorsqu'il est exécuté à partir d'un code en dehors du répertoire `node_modules`. |
| v8.0.0 | `new Buffer(size)` renverra par défaut une mémoire remplie de zéros. |
| v7.2.1 | L'appel à ce constructeur n'émet plus d'avertissement de dépréciation. |
| v7.0.0 | L'appel à ce constructeur émet désormais un avertissement de dépréciation. |
| v6.0.0 | Déprécié depuis : v6.0.0 |
:::

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez [`Buffer.alloc()`](/fr/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) à la place (voir aussi [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize)).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur souhaitée du nouveau `Buffer`.

Voir [`Buffer.alloc()`](/fr/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) et [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize). Cette variante du constructeur est équivalente à [`Buffer.alloc()`](/fr/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding).


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L'appel à ce constructeur émet un avertissement de dépréciation lorsqu'il est exécuté à partir d'un code en dehors du répertoire `node_modules`. |
| v7.2.1 | L'appel à ce constructeur n'émet plus d'avertissement de dépréciation. |
| v7.0.0 | L'appel à ce constructeur émet désormais un avertissement de dépréciation. |
| v6.0.0 | Déprécié depuis : v6.0.0 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez [`Buffer.from(string[, encoding])`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding) à la place.
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chaîne à encoder.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de `string`. **Par défaut :** `'utf8'`.

Voir [`Buffer.from(string[, encoding])`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding).

## Classe : `File` {#class-file}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Rend les instances File clonables. |
| v20.0.0 | N'est plus expérimental. |
| v19.2.0, v18.13.0 | Ajouté dans : v19.2.0, v18.13.0 |
:::

- Étend : [\<Blob\>](/fr/nodejs/api/buffer#class-blob)

Un [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) fournit des informations sur les fichiers.

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**Ajouté dans : v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/fr/nodejs/api/buffer#class-blob) | [\<File[]\>](/fr/nodejs/api/buffer#class-file) Un tableau d'objets string, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [\<File\>](/fr/nodejs/api/buffer#class-file) ou [\<Blob\>](/fr/nodejs/api/buffer#class-blob), ou tout mélange de tels objets, qui seront stockés dans le `File`.
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du fichier.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'une des valeurs `'transparent'` ou `'native'`. Lorsque la valeur est définie sur `'native'`, les fins de ligne dans les parties sources de chaîne seront converties en fin de ligne native de la plateforme, comme spécifié par `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type de contenu du fichier.
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La date de dernière modification du fichier. **Par défaut :** `Date.now()`.


### `file.name` {#filename}

**Ajouté dans : v19.2.0, v18.13.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le nom du `File`.

### `file.lastModified` {#filelastmodified}

**Ajouté dans : v19.2.0, v18.13.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La date de dernière modification du `File`.

## API du module `node:buffer` {#nodebuffer-module-apis}

Bien que l'objet `Buffer` soit disponible en tant qu'objet global, il existe des API supplémentaires liées à `Buffer` qui ne sont disponibles que via le module `node:buffer` accessible à l'aide de `require('node:buffer')`.

### `buffer.atob(data)` {#bufferatobdata}

**Ajouté dans : v15.13.0, v14.17.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Hérité. Utilisez `Buffer.from(data, 'base64')` à la place.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) La chaîne d'entrée encodée en Base64.

Décode une chaîne de données encodées en Base64 en octets et encode ces octets dans une chaîne en utilisant Latin-1 (ISO-8859-1).

Les `data` peuvent être n'importe quelle valeur JavaScript qui peut être forcée en une chaîne.

**Cette fonction est uniquement fournie pour la compatibilité avec les anciennes API de la plateforme Web et ne doit jamais être utilisée dans un nouveau code, car elle utilise des chaînes pour représenter des données binaires et précède l'introduction des tableaux typés en JavaScript. Pour le code s'exécutant à l'aide des API Node.js, la conversion entre des chaînes encodées en base64 et des données binaires doit être effectuée à l'aide de <code>Buffer.from(str, 'base64')</code> et <code>buf.toString('base64')</code>.**

### `buffer.btoa(data)` {#bufferbtoadata}

**Ajouté dans : v15.13.0, v14.17.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/fr/nodejs/api/documentation#stability-index) [Stability: 3](/fr/nodejs/api/documentation#stability-index) - Hérité. Utilisez `buf.toString('base64')` à la place.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Une chaîne ASCII (Latin1).

Décode une chaîne en octets en utilisant Latin-1 (ISO-8859) et encode ces octets dans une chaîne en utilisant Base64.

Les `data` peuvent être n'importe quelle valeur JavaScript qui peut être forcée en une chaîne.

**Cette fonction est uniquement fournie pour la compatibilité avec les anciennes API de la plateforme Web et ne doit jamais être utilisée dans un nouveau code, car elle utilise des chaînes pour représenter des données binaires et précède l'introduction des tableaux typés en JavaScript. Pour le code s'exécutant à l'aide des API Node.js, la conversion entre des chaînes encodées en base64 et des données binaires doit être effectuée à l'aide de <code>Buffer.from(str, 'base64')</code> et <code>buf.toString('base64')</code>.**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**Ajouté dans : v19.6.0, v18.15.0**

- input [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) L'entrée à valider.
- Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette fonction renvoie `true` si `input` contient uniquement des données valides encodées en ASCII, y compris le cas où `input` est vide.

Lève une exception si l'entrée `input` est un tampon de tableau détaché.

### `buffer.isUtf8(input)` {#bufferisutf8input}

**Ajouté dans : v19.4.0, v18.14.0**

- input [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) L'entrée à valider.
- Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette fonction renvoie `true` si `input` contient uniquement des données valides encodées en UTF-8, y compris le cas où `input` est vide.

Lève une exception si l'entrée `input` est un tampon de tableau détaché.

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**Ajouté dans : v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `50`

Renvoie le nombre maximum d'octets qui seront renvoyés lorsque `buf.inspect()` est appelé. Ceci peut être substitué par les modules utilisateurs. Voir [`util.inspect()`](/fr/nodejs/api/util#utilinspectobject-options) pour plus de détails sur le comportement de `buf.inspect()`.

### `buffer.kMaxLength` {#bufferkmaxlength}

**Ajouté dans : v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale autorisée pour une seule instance de `Buffer`.

Un alias pour [`buffer.constants.MAX_LENGTH`](/fr/nodejs/api/buffer#bufferconstantsmax_length).

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**Ajouté dans : v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur maximale autorisée pour une seule instance `string`.

Un alias pour [`buffer.constants.MAX_STRING_LENGTH`](/fr/nodejs/api/buffer#bufferconstantsmax_string_length).


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**Ajouté dans : v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une chaîne d'URL `'blob:nodedata:...` renvoyée par un appel antérieur à `URL.createObjectURL()`.
- Retourne : [\<Blob\>](/fr/nodejs/api/buffer#class-blob)

Résout un `'blob:nodedata:...'` un objet [\<Blob\>](/fr/nodejs/api/buffer#class-blob) associé enregistré à l'aide d'un appel antérieur à `URL.createObjectURL()`.

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Le paramètre `source` peut désormais être un `Uint8Array`. |
| v7.1.0 | Ajouté dans : v7.1.0 |
:::

- `source` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Une instance `Buffer` ou `Uint8Array`.
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage actuel.
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage cible.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Réencode l'instance `Buffer` ou `Uint8Array` donnée d'un encodage de caractères à un autre. Renvoie une nouvelle instance `Buffer`.

Lève une exception si `fromEnc` ou `toEnc` spécifient des encodages de caractères non valides ou si la conversion de `fromEnc` vers `toEnc` n'est pas autorisée.

Les encodages pris en charge par `buffer.transcode()` sont : `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'` et `'binary'`.

Le processus de transcodage utilisera des caractères de substitution si une séquence d'octets donnée ne peut pas être correctement représentée dans l'encodage cible. Par exemple :



::: code-group
```js [ESM]
import { Buffer, transcode } from 'node:buffer';

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

```js [CJS]
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```
:::

Étant donné que le signe Euro (`€`) n'est pas représentable en US-ASCII, il est remplacé par `?` dans le `Buffer` transcoder.


### Classe : `SlowBuffer` {#class-slowbuffer}

**Déconseillé depuis la version : v6.0.0**

::: danger [Stable: 0 - Déconseillé]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déconseillé : Utilisez [`Buffer.allocUnsafeSlow()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) à la place.
:::

Voir [`Buffer.allocUnsafeSlow()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize). Cela n'a jamais été une classe dans le sens où le constructeur a toujours renvoyé une instance `Buffer`, plutôt qu'une instance `SlowBuffer`.

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**Déconseillé depuis la version : v6.0.0**

::: danger [Stable: 0 - Déconseillé]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déconseillé : Utilisez [`Buffer.allocUnsafeSlow()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) à la place.
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur souhaitée du nouveau `SlowBuffer`.

Voir [`Buffer.allocUnsafeSlow()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### Constantes de Buffer {#buffer-constants}

**Ajouté dans : v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | La valeur est passée à 2 - 1 sur les architectures 64 bits. |
| v15.0.0 | La valeur est passée à 2 sur les architectures 64 bits. |
| v14.0.0 | La valeur est passée de 2 - 1 à 2 - 1 sur les architectures 64 bits. |
| v8.2.0 | Ajouté dans : v8.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale autorisée pour une seule instance `Buffer`.

Sur les architectures 32 bits, cette valeur est actuellement de 2 - 1 (environ 1 Gio).

Sur les architectures 64 bits, cette valeur est actuellement de 2 - 1 (environ 8 Pio).

Elle reflète [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0) en interne.

Cette valeur est également disponible sous le nom [`buffer.kMaxLength`](/fr/nodejs/api/buffer#bufferkmaxlength).

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**Ajouté dans : v8.2.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur maximale autorisée pour une seule instance `string`.

Représente la plus grande `length` qu'une primitive `string` peut avoir, comptée en unités de code UTF-16.

Cette valeur peut dépendre du moteur JS utilisé.


## `Buffer.from()`, `Buffer.alloc()` et `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

Dans les versions de Node.js antérieures à la version 6.0.0, les instances de `Buffer` étaient créées à l'aide de la fonction constructeur `Buffer`, qui alloue le `Buffer` renvoyé différemment selon les arguments fournis :

- Le fait de passer un nombre comme premier argument à `Buffer()` (par exemple, `new Buffer(10)`) alloue un nouvel objet `Buffer` de la taille spécifiée. Avant Node.js 8.0.0, la mémoire allouée pour ces instances de `Buffer` *n'est pas* initialisée et *peut contenir des données sensibles*. Ces instances de `Buffer` *doivent* ensuite être initialisées en utilisant soit [`buf.fill(0)`](/fr/nodejs/api/buffer#buffillvalue-offset-end-encoding), soit en écrivant dans l'intégralité du `Buffer` avant de lire les données du `Buffer`. Bien que ce comportement soit *intentionnel* afin d'améliorer les performances, l'expérience de développement a démontré qu'une distinction plus explicite est nécessaire entre la création d'un `Buffer` rapide mais non initialisé et la création d'un `Buffer` plus lent mais plus sûr. Depuis Node.js 8.0.0, `Buffer(num)` et `new Buffer(num)` renvoient un `Buffer` avec une mémoire initialisée.
- Le fait de passer une chaîne de caractères, un tableau ou un `Buffer` comme premier argument copie les données de l'objet passé dans le `Buffer`.
- Le fait de passer un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou un [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) renvoie un `Buffer` qui partage la mémoire allouée avec le tampon de tableau donné.

Étant donné que le comportement de `new Buffer()` est différent selon le type du premier argument, des problèmes de sécurité et de fiabilité peuvent être introduits par inadvertance dans les applications lorsque la validation des arguments ou l'initialisation de `Buffer` n'est pas effectuée.

Par exemple, si un attaquant peut amener une application à recevoir un nombre là où une chaîne de caractères est attendue, l'application peut appeler `new Buffer(100)` au lieu de `new Buffer("100")`, ce qui l'amène à allouer un tampon de 100 octets au lieu d'allouer un tampon de 3 octets avec le contenu `"100"`. Ceci est généralement possible en utilisant des appels d'API JSON. Étant donné que JSON fait la distinction entre les types numériques et les types chaînes de caractères, il permet l'injection de nombres là où une application naïvement écrite qui ne valide pas suffisamment ses entrées pourrait s'attendre à toujours recevoir une chaîne de caractères. Avant Node.js 8.0.0, le tampon de 100 octets pouvait contenir des données préexistantes arbitraires en mémoire, et pouvait donc être utilisé pour exposer des secrets en mémoire à un attaquant distant. Depuis Node.js 8.0.0, l'exposition de la mémoire ne peut pas se produire car les données sont remplies de zéros. Cependant, d'autres attaques sont toujours possibles, comme le fait de provoquer l'allocation de très grands tampons par le serveur, entraînant une dégradation des performances ou un crash en raison de l'épuisement de la mémoire.

Pour rendre la création d'instances de `Buffer` plus fiable et moins sujette aux erreurs, les différentes formes du constructeur `new Buffer()` ont été **dépréciées** et remplacées par les méthodes distinctes `Buffer.from()`, [`Buffer.alloc()`](/fr/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) et [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize).

*Les développeurs doivent migrer toutes les utilisations existantes des constructeurs <code>new Buffer()</code>
vers l'une de ces nouvelles API.*

- [`Buffer.from(array)`](/fr/nodejs/api/buffer#static-method-bufferfromarray) renvoie un nouveau `Buffer` qui *contient une copie* des octets fournis.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/fr/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) renvoie un nouveau `Buffer` qui *partage la même mémoire allouée* que l'[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) donné.
- [`Buffer.from(buffer)`](/fr/nodejs/api/buffer#static-method-bufferfrombuffer) renvoie un nouveau `Buffer` qui *contient une copie* du contenu du `Buffer` donné.
- [`Buffer.from(string[, encoding])`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding) renvoie un nouveau `Buffer` qui *contient une copie* de la chaîne de caractères fournie.
- [`Buffer.alloc(size[, fill[, encoding]])`](/fr/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) renvoie un nouveau `Buffer` initialisé de la taille spécifiée. Cette méthode est plus lente que [`Buffer.allocUnsafe(size)`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) mais garantit que les instances de `Buffer` nouvellement créées ne contiennent jamais d'anciennes données potentiellement sensibles. Une `TypeError` sera levée si `size` n'est pas un nombre.
- [`Buffer.allocUnsafe(size)`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) et [`Buffer.allocUnsafeSlow(size)`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) renvoient chacun un nouveau `Buffer` non initialisé de la `size` spécifiée. Étant donné que le `Buffer` n'est pas initialisé, le segment de mémoire alloué peut contenir d'anciennes données potentiellement sensibles.

Les instances de `Buffer` renvoyées par [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(string)`](/fr/nodejs/api/buffer#static-method-bufferfromstring-encoding), [`Buffer.concat()`](/fr/nodejs/api/buffer#static-method-bufferconcatlist-totallength) et [`Buffer.from(array)`](/fr/nodejs/api/buffer#static-method-bufferfromarray) *peuvent* être allouées à partir d'un pool de mémoire interne partagé si la `size` est inférieure ou égale à la moitié de [`Buffer.poolSize`](/fr/nodejs/api/buffer#class-property-bufferpoolsize). Les instances renvoyées par [`Buffer.allocUnsafeSlow()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) *n'utilisent jamais* le pool de mémoire interne partagé.


### L'option de ligne de commande `--zero-fill-buffers` {#the---zero-fill-buffers-command-line-option}

**Ajouté dans : v5.10.0**

Node.js peut être démarré en utilisant l'option de ligne de commande `--zero-fill-buffers` pour que toutes les instances `Buffer` nouvellement allouées soient remplies de zéros par défaut lors de leur création. Sans cette option, les buffers créés avec [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.allocUnsafeSlow()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) et `new SlowBuffer(size)` ne sont pas remplis de zéros. L'utilisation de cet indicateur peut avoir un impact négatif mesurable sur les performances. Utilisez l'option `--zero-fill-buffers` uniquement lorsque cela est nécessaire pour garantir que les instances `Buffer` nouvellement allouées ne contiennent pas d'anciennes données potentiellement sensibles.

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### Qu'est-ce qui rend `Buffer.allocUnsafe()` et `Buffer.allocUnsafeSlow()` "non sécurisés" ? {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

Lors de l'appel de [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) et [`Buffer.allocUnsafeSlow()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafeslowsize), le segment de mémoire allouée est *non initialisé* (il n'est pas rempli de zéros). Bien que cette conception rende l'allocation de mémoire assez rapide, le segment de mémoire allouée peut contenir d'anciennes données potentiellement sensibles. L'utilisation d'un `Buffer` créé par [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize) sans *complètement* écraser la mémoire peut permettre à ces anciennes données d'être divulguées lorsque la mémoire `Buffer` est lue.

Bien qu'il existe des avantages clairs en termes de performances à utiliser [`Buffer.allocUnsafe()`](/fr/nodejs/api/buffer#static-method-bufferallocunsafesize), des précautions supplémentaires *doivent* être prises afin d'éviter d'introduire des vulnérabilités de sécurité dans une application.

