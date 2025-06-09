---
title: Documentation Node.js - Crypto
description: Le module Crypto de Node.js fournit des fonctionnalités cryptographiques qui incluent un ensemble d'enveloppes pour les fonctions de hachage, HMAC, chiffrement, déchiffrement, signature et vérification d'OpenSSL. Il supporte divers algorithmes de chiffrement, la dérivation de clés et les signatures numériques, permettant aux développeurs de sécuriser les données et les communications dans les applications Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Crypto de Node.js fournit des fonctionnalités cryptographiques qui incluent un ensemble d'enveloppes pour les fonctions de hachage, HMAC, chiffrement, déchiffrement, signature et vérification d'OpenSSL. Il supporte divers algorithmes de chiffrement, la dérivation de clés et les signatures numériques, permettant aux développeurs de sécuriser les données et les communications dans les applications Node.js.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Crypto de Node.js fournit des fonctionnalités cryptographiques qui incluent un ensemble d'enveloppes pour les fonctions de hachage, HMAC, chiffrement, déchiffrement, signature et vérification d'OpenSSL. Il supporte divers algorithmes de chiffrement, la dérivation de clés et les signatures numériques, permettant aux développeurs de sécuriser les données et les communications dans les applications Node.js.
---


# Crypto {#crypto}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

Le module `node:crypto` fournit des fonctionnalités cryptographiques qui incluent un ensemble d'enveloppes pour les fonctions de hachage, HMAC, chiffrement, déchiffrement, signature et vérification d'OpenSSL.

::: code-group
```js [ESM]
const { createHmac } = await import('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Affiche :
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

```js [CJS]
const { createHmac } = require('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Affiche :
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```
:::

## Déterminer si le support crypto n'est pas disponible {#determining-if-crypto-support-is-unavailable}

Il est possible que Node.js soit construit sans inclure la prise en charge du module `node:crypto`. Dans de tels cas, tenter d'`import` à partir de `crypto` ou d'appeler `require('node:crypto')` entraînera une erreur.

Lors de l'utilisation de CommonJS, l'erreur renvoyée peut être interceptée à l'aide de try/catch :

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('la prise en charge de crypto est désactivée !');
}
```
Lors de l'utilisation du mot-clé lexical ESM `import`, l'erreur ne peut être interceptée que si un gestionnaire pour `process.on('uncaughtException')` est enregistré *avant* toute tentative de chargement du module (en utilisant, par exemple, un module de préchargement).

Lors de l'utilisation d'ESM, s'il y a une chance que le code puisse être exécuté sur une version de Node.js où la prise en charge de crypto n'est pas activée, envisagez d'utiliser la fonction [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) au lieu du mot-clé lexical `import` :

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('la prise en charge de crypto est désactivée !');
}
```

## Classe : `Certificate` {#class-certificate}

**Ajouté dans : v0.11.8**

SPKAC est un mécanisme de requête de signature de certificat initialement implémenté par Netscape et spécifié formellement dans le cadre de l’élément `keygen` de HTML5.

`\<keygen\>` est obsolète depuis [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) et les nouveaux projets ne devraient plus utiliser cet élément.

Le module `node:crypto` fournit la classe `Certificate` pour travailler avec les données SPKAC. L’utilisation la plus courante est le traitement des sorties générées par l’élément HTML5 `\<keygen\>`. Node.js utilise en interne [l’implémentation SPKAC d’OpenSSL](https://www.openssl.org/docs/man3.0/man1/openssl-spkac).

### Méthode statique : `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | L’argument spkac peut être un ArrayBuffer. A limité la taille de l’argument spkac à un maximum de 2**31 - 1 octets. |
| v9.0.0 | Ajouté dans : v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `spkac`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le composant de challenge de la structure de données `spkac`, qui comprend une clé publique et un challenge.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```
:::


### Méthode statique : `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | L'argument spkac peut être un ArrayBuffer. A limité la taille de l'argument spkac à un maximum de 2**31 - 1 octets. |
| v9.0.0 | Ajoutée dans : v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `spkac`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le composant de clé publique de la structure de données `spkac`, qui inclut une clé publique et un challenge.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Affiche : la clé publique comme <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Affiche : la clé publique comme <Buffer ...>
```
:::

### Méthode statique : `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | L'argument spkac peut être un ArrayBuffer. Ajout de l'encodage. A limité la taille de l'argument spkac à un maximum de 2**31 - 1 octets. |
| v9.0.0 | Ajoutée dans : v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `spkac`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la structure de données `spkac` fournie est valide, `false` sinon.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Affiche : true ou false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Affiche : true ou false
```
:::


### API Héritée {#legacy-api}

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

En tant qu'interface héritée, il est possible de créer de nouvelles instances de la classe `crypto.Certificate` comme illustré dans les exemples ci-dessous.

#### `new crypto.Certificate()` {#new-cryptocertificate}

Les instances de la classe `Certificate` peuvent être créées en utilisant le mot-clé `new` ou en appelant `crypto.Certificate()` comme une fonction :

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```

```js [CJS]
const { Certificate } = require('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```
:::

#### `certificate.exportChallenge(spkac[, encoding])` {#certificateexportchallengespkac-encoding}

**Ajouté dans : v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `spkac`.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le composant de défi de la structure de données `spkac`, qui comprend une clé publique et un défi.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Affiche : le défi sous forme de chaîne UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Affiche : le défi sous forme de chaîne UTF8
```
:::


#### `certificate.exportPublicKey(spkac[, encoding])` {#certificateexportpublickeyspkac-encoding}

**Ajouté dans: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `spkac`.
- Retourne: [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le composant clé publique de la structure de données `spkac`, qui inclut une clé publique et un défi.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Affiche : la clé publique sous forme de <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Affiche : la clé publique sous forme de <Buffer ...>
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**Ajouté dans: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `spkac`.
- Retourne: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la structure de données `spkac` donnée est valide, `false` sinon.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Affiche : true ou false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Affiche : true ou false
```
:::


## Classe : `Cipher` {#class-cipher}

**Ajouté dans : v0.1.94**

- Hérite de : [\<stream.Transform\>](/fr/nodejs/api/stream#class-streamtransform)

Les instances de la classe `Cipher` sont utilisées pour chiffrer des données. La classe peut être utilisée de deux manières :

- En tant que [flux](/fr/nodejs/api/stream) qui est à la fois lisible et accessible en écriture, où des données non chiffrées simples sont écrites pour produire des données chiffrées du côté lisible, ou
- En utilisant les méthodes [`cipher.update()`](/fr/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) et [`cipher.final()`](/fr/nodejs/api/crypto#cipherfinaloutputencoding) pour produire les données chiffrées.

La méthode [`crypto.createCipheriv()`](/fr/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) est utilisée pour créer des instances `Cipher`. Les objets `Cipher` ne doivent pas être créés directement à l’aide du mot-clé `new`.

Exemple : Utilisation d’objets `Cipher` en tant que flux :

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```
:::

Exemple : Utilisation de `Cipher` et de flux canalisés :

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';

import {
  pipeline,
} from 'node:stream';

const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const {
  pipeline,
} = require('node:stream');

const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```
:::

Exemple : Utilisation des méthodes [`cipher.update()`](/fr/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) et [`cipher.final()`](/fr/nodejs/api/crypto#cipherfinaloutputencoding) :

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```
:::


### `cipher.final([outputEncoding])` {#cipherfinaloutputencoding}

**Ajouté dans : v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tout contenu chiffré restant. Si `outputEncoding` est spécifié, une chaîne de caractères est renvoyée. Si un `outputEncoding` n'est pas fourni, un [`Buffer`](/fr/nodejs/api/buffer) est renvoyé.

Une fois que la méthode `cipher.final()` a été appelée, l'objet `Cipher` ne peut plus être utilisé pour chiffrer des données. Toute tentative d'appel à `cipher.final()` plus d'une fois entraînera une erreur.

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Ajouté dans : v1.0.0**

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Lors de l'utilisation d'un mode de chiffrement authentifié (`GCM`, `CCM`, `OCB` et `chacha20-poly1305` sont actuellement pris en charge), la méthode `cipher.getAuthTag()` renvoie un [`Buffer`](/fr/nodejs/api/buffer) contenant la *balise d'authentification* qui a été calculée à partir des données fournies.

La méthode `cipher.getAuthTag()` ne doit être appelée qu'une fois le chiffrement terminé à l'aide de la méthode [`cipher.final()`](/fr/nodejs/api/crypto#cipherfinaloutputencoding).

Si l'option `authTagLength` a été définie lors de la création de l'instance `cipher`, cette fonction renverra exactement `authTagLength` octets.

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Ajouté dans : v1.0.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options [`stream.transform`](/fr/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de chaîne à utiliser lorsque `buffer` est une chaîne.

- Retourne : [\<Cipher\>](/fr/nodejs/api/crypto#class-cipher) La même instance `Cipher` pour le chaînage de méthodes.

Lors de l'utilisation d'un mode de chiffrement authentifié (`GCM`, `CCM`, `OCB` et `chacha20-poly1305` sont actuellement pris en charge), la méthode `cipher.setAAD()` définit la valeur utilisée pour le paramètre d'entrée *données d'authentification supplémentaires* (AAD).

L'option `plaintextLength` est facultative pour `GCM` et `OCB`. Lors de l'utilisation de `CCM`, l'option `plaintextLength` doit être spécifiée et sa valeur doit correspondre à la longueur du texte brut en octets. Voir [Mode CCM](/fr/nodejs/api/crypto#ccm-mode).

La méthode `cipher.setAAD()` doit être appelée avant [`cipher.update()`](/fr/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding).


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**Ajouté dans: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut:** `true`
- Retourne: [\<Cipher\>](/fr/nodejs/api/crypto#class-cipher) La même instance `Cipher` pour le chaînage de méthodes.

Lors de l'utilisation d'algorithmes de chiffrement par blocs, la classe `Cipher` ajoute automatiquement un remplissage aux données d'entrée à la taille de bloc appropriée. Pour désactiver le remplissage par défaut, appelez `cipher.setAutoPadding(false)`.

Lorsque `autoPadding` est `false`, la longueur de l'ensemble des données d'entrée doit être un multiple de la taille de bloc du chiffreur, sinon [`cipher.final()`](/fr/nodejs/api/crypto#cipherfinaloutputencoding) lèvera une erreur. La désactivation du remplissage automatique est utile pour un remplissage non standard, par exemple en utilisant `0x0` au lieu du remplissage PKCS.

La méthode `cipher.setAutoPadding()` doit être appelée avant [`cipher.final()`](/fr/nodejs/api/crypto#cipherfinaloutputencoding).

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | L'`inputEncoding` par défaut est passé de `binary` à `utf8`. |
| v0.1.94 | Ajouté dans: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) des données.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne: [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Met à jour le chiffreur avec `data`. Si l'argument `inputEncoding` est fourni, l'argument `data` est une chaîne utilisant l'encodage spécifié. Si l'argument `inputEncoding` n'est pas fourni, `data` doit être un [`Buffer`](/fr/nodejs/api/buffer), un `TypedArray` ou un `DataView`. Si `data` est un [`Buffer`](/fr/nodejs/api/buffer), un `TypedArray` ou un `DataView`, alors `inputEncoding` est ignoré.

L'`outputEncoding` spécifie le format de sortie des données chiffrées. Si l'`outputEncoding` est spécifié, une chaîne utilisant l'encodage spécifié est renvoyée. Si aucun `outputEncoding` n'est fourni, un [`Buffer`](/fr/nodejs/api/buffer) est renvoyé.

La méthode `cipher.update()` peut être appelée plusieurs fois avec de nouvelles données jusqu'à ce que [`cipher.final()`](/fr/nodejs/api/crypto#cipherfinaloutputencoding) soit appelé. Appeler `cipher.update()` après [`cipher.final()`](/fr/nodejs/api/crypto#cipherfinaloutputencoding) entraînera une erreur.


## Classe : `Decipher` {#class-decipher}

**Ajoutée dans : v0.1.94**

- Hérite de : [\<stream.Transform\>](/fr/nodejs/api/stream#class-streamtransform)

Les instances de la classe `Decipher` sont utilisées pour déchiffrer des données. La classe peut être utilisée de deux manières :

- En tant que [flux](/fr/nodejs/api/stream) qui est à la fois lisible et accessible en écriture, où des données chiffrées simples sont écrites pour produire des données non chiffrées du côté lisible, ou
- En utilisant les méthodes [`decipher.update()`](/fr/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) et [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding) pour produire les données non chiffrées.

La méthode [`crypto.createDecipheriv()`](/fr/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) est utilisée pour créer des instances `Decipher`. Les objets `Decipher` ne doivent pas être créés directement à l'aide du mot-clé `new`.

Exemple : Utilisation des objets `Decipher` comme flux :

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```
:::

Exemple : Utilisation de `Decipher` et de flux dirigés :

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```
:::

Exemple : Utilisation des méthodes [`decipher.update()`](/fr/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) et [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding) :

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```
:::


### `decipher.final([outputEncoding])` {#decipherfinaloutputencoding}

**Ajouté dans : v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tout contenu déchiffré restant. Si `outputEncoding` est spécifié, une chaîne de caractères est retournée. Si un `outputEncoding` n'est pas fourni, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.

Une fois que la méthode `decipher.final()` a été appelée, l'objet `Decipher` ne peut plus être utilisé pour déchiffrer des données. Toute tentative d'appel de `decipher.final()` plus d'une fois entraînera une erreur.

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | L'argument buffer peut être une chaîne de caractères ou ArrayBuffer et est limité à un maximum de 2 ** 31 - 1 octets. |
| v7.2.0 | Cette méthode renvoie désormais une référence à `decipher`. |
| v1.0.0 | Ajouté dans : v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/fr/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Encodage de chaîne à utiliser lorsque `buffer` est une chaîne.

- Retourne : [\<Decipher\>](/fr/nodejs/api/crypto#class-decipher) Le même Decipher pour le chaînage de méthodes.

Lors de l'utilisation d'un mode de chiffrement authentifié (`GCM`, `CCM`, `OCB` et `chacha20-poly1305` sont actuellement pris en charge), la méthode `decipher.setAAD()` définit la valeur utilisée pour le paramètre d'entrée *données d'authentification supplémentaires* (AAD).

L'argument `options` est facultatif pour `GCM`. Lors de l'utilisation de `CCM`, l'option `plaintextLength` doit être spécifiée et sa valeur doit correspondre à la longueur du texte chiffré en octets. Voir [Mode CCM](/fr/nodejs/api/crypto#ccm-mode).

La méthode `decipher.setAAD()` doit être appelée avant [`decipher.update()`](/fr/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding).

Lorsque vous passez une chaîne de caractères en tant que `buffer`, veuillez tenir compte des [mises en garde lors de l'utilisation de chaînes de caractères comme entrées des API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | L'utilisation de longueurs de balise GCM autres que 128 bits sans spécifier l'option `authTagLength` lors de la création de `decipher` est obsolète. |
| v15.0.0 | L'argument buffer peut être une chaîne ou un ArrayBuffer et est limité à 2 ** 31 - 1 octets maximum. |
| v11.0.0 | Cette méthode lève désormais une exception si la longueur de la balise GCM est invalide. |
| v7.2.0 | Cette méthode renvoie désormais une référence à `decipher`. |
| v1.0.0 | Ajoutée dans : v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Encodage de chaîne à utiliser lorsque `buffer` est une chaîne.
- Retourne : [\<Decipher\>](/fr/nodejs/api/crypto#class-decipher) Le même Decipher pour le chaînage de méthodes.

Lors de l'utilisation d'un mode de chiffrement authentifié ( `GCM`, `CCM`, `OCB` et `chacha20-poly1305` sont actuellement pris en charge), la méthode `decipher.setAuthTag()` est utilisée pour transmettre la *balise d'authentification* reçue. Si aucune balise n'est fournie, ou si le texte chiffré a été falsifié, [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding) lèvera une exception, indiquant que le texte chiffré doit être rejeté en raison d'une authentification ayant échoué. Si la longueur de la balise n'est pas valide conformément à [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) ou ne correspond pas à la valeur de l'option `authTagLength`, `decipher.setAuthTag()` lèvera une erreur.

La méthode `decipher.setAuthTag()` doit être appelée avant [`decipher.update()`](/fr/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) pour le mode `CCM` ou avant [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding) pour les modes `GCM` et `OCB` et `chacha20-poly1305`. `decipher.setAuthTag()` ne peut être appelée qu'une seule fois.

Lors du passage d'une chaîne comme balise d'authentification, veuillez tenir compte des [mises en garde lors de l'utilisation de chaînes comme entrées aux API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**Ajouté dans : v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
- Retourne : [\<Decipher\>](/fr/nodejs/api/crypto#class-decipher) Le même déchiffreur pour le chaînage de méthodes.

Lorsque les données ont été chiffrées sans remplissage de bloc standard, appeler `decipher.setAutoPadding(false)` désactivera le remplissage automatique pour empêcher [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding) de vérifier et de supprimer le remplissage.

La désactivation du remplissage automatique ne fonctionnera que si la longueur des données d'entrée est un multiple de la taille de bloc des chiffrements.

La méthode `decipher.setAutoPadding()` doit être appelée avant [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding).

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | La valeur par défaut de `inputEncoding` est passée de `binary` à `utf8`. |
| v0.1.94 | Ajouté dans : v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `data`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Met à jour le déchiffreur avec `data`. Si l'argument `inputEncoding` est donné, l'argument `data` est une chaîne utilisant l'encodage spécifié. Si l'argument `inputEncoding` n'est pas donné, `data` doit être un [`Buffer`](/fr/nodejs/api/buffer). Si `data` est un [`Buffer`](/fr/nodejs/api/buffer), alors `inputEncoding` est ignoré.

`outputEncoding` spécifie le format de sortie des données chiffrées. Si `outputEncoding` est spécifié, une chaîne utilisant l'encodage spécifié est retournée. Si aucun `outputEncoding` n'est fourni, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.

La méthode `decipher.update()` peut être appelée plusieurs fois avec de nouvelles données jusqu'à ce que [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding) soit appelée. Appeler `decipher.update()` après [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding) entraînera une erreur.

Même si le chiffrement sous-jacent implémente l'authentification, l'authenticité et l'intégrité du texte brut renvoyé par cette fonction peuvent être incertaines pour le moment. Pour les algorithmes de chiffrement authentifiés, l'authenticité n'est généralement établie que lorsque l'application appelle [`decipher.final()`](/fr/nodejs/api/crypto#decipherfinaloutputencoding).


## Classe : `DiffieHellman` {#class-diffiehellman}

**Ajouté dans : v0.5.0**

La classe `DiffieHellman` est un utilitaire permettant de créer des échanges de clés Diffie-Hellman.

Les instances de la classe `DiffieHellman` peuvent être créées à l’aide de la fonction [`crypto.createDiffieHellman()`](/fr/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Générer les clés d’Alice...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Générer les clés de Bob...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Échanger et générer le secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

```js [CJS]
const assert = require('node:assert');

const {
  createDiffieHellman,
} = require('node:crypto');

// Générer les clés d’Alice...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Générer les clés de Bob...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Échanger et générer le secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**Ajouté dans : v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) d’une chaîne `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcule le secret partagé en utilisant `otherPublicKey` comme clé publique de l’autre partie et retourne le secret partagé calculé. La clé fournie est interprétée en utilisant le `inputEncoding` spécifié, et le secret est encodé en utilisant le `outputEncoding` spécifié. Si `inputEncoding` n’est pas fourni, `otherPublicKey` doit être un [`Buffer`](/fr/nodejs/api/buffer), `TypedArray` ou `DataView`.

Si `outputEncoding` est donné, une chaîne de caractères est retournée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**Ajouté dans : v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur renvoyée.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Génère les valeurs de clé Diffie-Hellman privée et publique, sauf si elles ont déjà été générées ou calculées, et renvoie la clé publique dans l' `encoding` spécifié. Cette clé doit être transférée à l'autre partie. Si `encoding` est fourni, une chaîne de caractères est renvoyée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est renvoyé.

Cette fonction est un simple wrapper autour de [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key). En particulier, une fois qu'une clé privée a été générée ou définie, l'appel de cette fonction met uniquement à jour la clé publique, mais ne génère pas de nouvelle clé privée.

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**Ajouté dans : v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur renvoyée.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne le générateur Diffie-Hellman dans l' `encoding` spécifié. Si `encoding` est fourni, une chaîne de caractères est renvoyée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est renvoyé.

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**Ajouté dans : v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur renvoyée.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne le nombre premier Diffie-Hellman dans l' `encoding` spécifié. Si `encoding` est fourni, une chaîne de caractères est renvoyée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est renvoyé.


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**Ajouté dans : v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne la clé privée Diffie-Hellman dans l' `encoding` spécifié. Si `encoding` est fourni, une chaîne de caractères est retournée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**Ajouté dans : v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne la clé publique Diffie-Hellman dans l' `encoding` spécifié. Si `encoding` est fourni, une chaîne de caractères est retournée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**Ajouté dans : v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `privateKey`.

Définit la clé privée Diffie-Hellman. Si l'argument `encoding` est fourni, `privateKey` doit être une chaîne de caractères. Si aucun `encoding` n'est fourni, `privateKey` doit être un [`Buffer`](/fr/nodejs/api/buffer), un `TypedArray` ou un `DataView`.

Cette fonction ne calcule pas automatiquement la clé publique associée. Soit [`diffieHellman.setPublicKey()`](/fr/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding), soit [`diffieHellman.generateKeys()`](/fr/nodejs/api/crypto#diffiehellmangeneratekeysencoding) peuvent être utilisés pour fournir manuellement la clé publique ou pour la dériver automatiquement.


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**Ajouté dans: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `publicKey`.

Définit la clé publique Diffie-Hellman. Si l'argument `encoding` est fourni, `publicKey` doit être une chaîne. Si aucun `encoding` n'est fourni, `publicKey` doit être un [`Buffer`](/fr/nodejs/api/buffer), `TypedArray` ou `DataView`.

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**Ajouté dans: v0.11.12**

Un champ de bits contenant tous les avertissements et/ou erreurs résultant d'une vérification effectuée lors de l'initialisation de l'objet `DiffieHellman`.

Les valeurs suivantes sont valides pour cette propriété (telles que définies dans le module `node:constants`) :

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## Classe : `DiffieHellmanGroup` {#class-diffiehellmangroup}

**Ajouté dans: v0.7.5**

La classe `DiffieHellmanGroup` prend un groupe modp bien connu comme argument. Elle fonctionne de la même manière que `DiffieHellman`, sauf qu'elle ne permet pas de modifier ses clés après la création. En d'autres termes, elle n'implémente pas les méthodes `setPublicKey()` ou `setPrivateKey()`.

::: code-group
```js [ESM]
const { createDiffieHellmanGroup } = await import('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```

```js [CJS]
const { createDiffieHellmanGroup } = require('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```
:::

Les groupes suivants sont pris en charge :

- `'modp14'` (2048 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 3)
- `'modp15'` (3072 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 4)
- `'modp16'` (4096 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 5)
- `'modp17'` (6144 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 6)
- `'modp18'` (8192 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 7)

Les groupes suivants sont toujours pris en charge mais obsolètes (voir [Mises en garde](/fr/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)) :

- `'modp1'` (768 bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Section 6.1)
- `'modp2'` (1 024 bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Section 6.2)
- `'modp5'` (1 536 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Section 2)

Ces groupes obsolètes pourraient être supprimés dans les versions futures de Node.js.


## Classe : `ECDH` {#class-ecdh}

**Ajoutée dans : v0.11.14**

La classe `ECDH` est un utilitaire pour créer des échanges de clés Elliptic Curve Diffie-Hellman (ECDH).

Les instances de la classe `ECDH` peuvent être créées à l’aide de la fonction [`crypto.createECDH()`](/fr/nodejs/api/crypto#cryptocreateecdhcurvename).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// Générer les clés d'Alice...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Générer les clés de Bob...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Échanger et générer le secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

```js [CJS]
const assert = require('node:assert');

const {
  createECDH,
} = require('node:crypto');

// Générer les clés d'Alice...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Générer les clés de Bob...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Échanger et générer le secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### Méthode statique : `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**Ajoutée dans : v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `key`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'uncompressed'`
- Renvoie : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Convertit la clé publique EC Diffie-Hellman spécifiée par `key` et `curve` au format spécifié par `format`. L’argument `format` spécifie l’encodage des points et peut être `'compressed'`, `'uncompressed'` ou `'hybrid'`. La clé fournie est interprétée à l’aide de l’`inputEncoding` spécifié, et la clé renvoyée est encodée à l’aide de l’`outputEncoding` spécifié.

Utiliser [`crypto.getCurves()`](/fr/nodejs/api/crypto#cryptogetcurves) pour obtenir une liste des noms de courbe disponibles. Sur les versions récentes d’OpenSSL, `openssl ecparam -list_curves` affichera également le nom et la description de chaque courbe elliptique disponible.

Si `format` n’est pas spécifié, le point sera renvoyé au format `'uncompressed'`.

Si l'`inputEncoding` n’est pas fourni, `key` doit être un [`Buffer`](/fr/nodejs/api/buffer), `TypedArray` ou `DataView`.

Exemple (décompression d’une clé) :

::: code-group
```js [ESM]
const {
  createECDH,
  ECDH,
} = await import('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// La clé convertie et la clé publique non compressée doivent être identiques
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```

```js [CJS]
const {
  createECDH,
  ECDH,
} = require('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// La clé convertie et la clé publique non compressée doivent être identiques
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::


### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Format d'erreur modifié pour mieux prendre en charge les erreurs de clé publique invalide. |
| v6.0.0 | L'`inputEncoding` par défaut est passé de `binary` à `utf8`. |
| v0.11.14 | Ajouté dans : v0.11.14 |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Renvoie : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcule le secret partagé en utilisant `otherPublicKey` comme clé publique de l'autre partie et renvoie le secret partagé calculé. La clé fournie est interprétée en utilisant le `inputEncoding` spécifié, et le secret renvoyé est encodé en utilisant le `outputEncoding` spécifié. Si le `inputEncoding` n'est pas fourni, `otherPublicKey` doit être un [`Buffer`](/fr/nodejs/api/buffer), un `TypedArray` ou un `DataView`.

Si `outputEncoding` est donné, une chaîne de caractères sera renvoyée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est renvoyé.

`ecdh.computeSecret` lèvera une erreur `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` lorsque `otherPublicKey` se trouve en dehors de la courbe elliptique. Étant donné que `otherPublicKey` est généralement fourni par un utilisateur distant sur un réseau non sécurisé, assurez-vous de gérer cette exception en conséquence.


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**Ajouté dans : v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'uncompressed'`
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Génère les valeurs de clé privée et publique EC Diffie-Hellman, et retourne la clé publique dans le `format` et l'`encoding` spécifiés. Cette clé doit être transférée à l’autre partie.

L’argument `format` spécifie le codage de point et peut être `'compressed'` ou `'uncompressed'`. Si `format` n’est pas spécifié, le point sera retourné au format `'uncompressed'`.

Si `encoding` est fourni, une chaîne de caractères est retournée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**Ajouté dans : v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’EC Diffie-Hellman dans l'`encoding` spécifié.

Si `encoding` est spécifié, une chaîne de caractères est retournée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**Ajouté dans : v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'uncompressed'`
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La clé publique EC Diffie-Hellman dans l'`encoding` et le `format` spécifiés.

L’argument `format` spécifie le codage de point et peut être `'compressed'` ou `'uncompressed'`. Si `format` n’est pas spécifié, le point sera retourné au format `'uncompressed'`.

Si `encoding` est spécifié, une chaîne de caractères est retournée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**Ajouté dans : v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `privateKey`.

Définit la clé privée EC Diffie-Hellman. Si `encoding` est fourni, `privateKey` doit être une chaîne de caractères ; sinon, `privateKey` doit être un [`Buffer`](/fr/nodejs/api/buffer), un `TypedArray` ou un `DataView`.

Si `privateKey` n'est pas valide pour la courbe spécifiée lors de la création de l'objet `ECDH`, une erreur est levée. Lors de la définition de la clé privée, le point public (clé) associé est également généré et défini dans l'objet `ECDH`.

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**Ajouté dans : v0.11.14**

**Déprécié depuis : v5.2.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `publicKey`.

Définit la clé publique EC Diffie-Hellman. Si `encoding` est fourni, `publicKey` doit être une chaîne ; sinon, un [`Buffer`](/fr/nodejs/api/buffer), un `TypedArray` ou un `DataView` est attendu.

Il n'y a normalement aucune raison d'appeler cette méthode car `ECDH` nécessite uniquement une clé privée et la clé publique de l'autre partie pour calculer le secret partagé. Généralement, soit [`ecdh.generateKeys()`](/fr/nodejs/api/crypto#ecdhgeneratekeysencoding-format), soit [`ecdh.setPrivateKey()`](/fr/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) sera appelé. La méthode [`ecdh.setPrivateKey()`](/fr/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) tente de générer le point/clé public associé à la clé privée définie.

Exemple (obtention d'un secret partagé) :

::: code-group
```js [ESM]
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// Il s'agit d'un moyen rapide de spécifier l'une des clés privées précédentes d'Alice.
// Il serait imprudent d'utiliser une clé privée aussi prévisible dans une application réelle.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob utilise une paire de clés pseudo-aléatoires
// cryptographiquement fortes nouvellement générée.
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret et bobSecret doivent être la même valeur de secret partagé.
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// Il s'agit d'un moyen rapide de spécifier l'une des clés privées précédentes d'Alice.
// Il serait imprudent d'utiliser une clé privée aussi prévisible dans une application réelle.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob utilise une paire de clés pseudo-aléatoires
// cryptographiquement fortes nouvellement générée.
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret et bobSecret doivent être la même valeur de secret partagé.
console.log(aliceSecret === bobSecret);
```
:::


## Classe : `Hash` {#class-hash}

**Ajoutée dans : v0.1.92**

- Hérite de : [\<stream.Transform\>](/fr/nodejs/api/stream#class-streamtransform)

La classe `Hash` est un utilitaire pour créer des condensés de hachage de données. Elle peut être utilisée de deux manières :

- En tant que [flux](/fr/nodejs/api/stream) qui est à la fois lisible et accessible en écriture, où les données sont écrites pour produire un condensé de hachage calculé du côté lisible, ou
- En utilisant les méthodes [`hash.update()`](/fr/nodejs/api/crypto#hashupdatedata-inputencoding) et [`hash.digest()`](/fr/nodejs/api/crypto#hashdigestencoding) pour produire le hachage calculé.

La méthode [`crypto.createHash()`](/fr/nodejs/api/crypto#cryptocreatehashalgorithm-options) est utilisée pour créer des instances `Hash`. Les objets `Hash` ne doivent pas être créés directement à l’aide du mot-clé `new`.

Exemple : Utilisation d’objets `Hash` comme flux :

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Un seul élément sera produit par le
  // flux de hachage.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Affiche :
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Un seul élément sera produit par le
  // flux de hachage.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Affiche :
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

Exemple : Utilisation de `Hash` et de flux canalisés :

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const { createHash } = await import('node:crypto');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```
:::

Exemple : Utilisation des méthodes [`hash.update()`](/fr/nodejs/api/crypto#hashupdatedata-inputencoding) et [`hash.digest()`](/fr/nodejs/api/crypto#hashdigestencoding) :

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Affiche :
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Affiche :
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::


### `hash.copy([options])` {#hashcopyoptions}

**Ajouté dans : v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/fr/nodejs/api/stream#new-streamtransformoptions)
- Retourne : [\<Hash\>](/fr/nodejs/api/crypto#class-hash)

Crée un nouvel objet `Hash` qui contient une copie approfondie de l'état interne de l'objet `Hash` actuel.

L'argument optionnel `options` contrôle le comportement du flux. Pour les fonctions de hachage XOF telles que `'shake256'`, l'option `outputLength` peut être utilisée pour spécifier la longueur de sortie souhaitée en octets.

Une erreur est levée lorsqu'une tentative est faite pour copier l'objet `Hash` après que sa méthode [`hash.digest()`](/fr/nodejs/api/crypto#hashdigestencoding) a été appelée.

::: code-group
```js [ESM]
// Calculate a rolling hash.
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
```

```js [CJS]
// Calculate a rolling hash.
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
```
:::

### `hash.digest([encoding])` {#hashdigestencoding}

**Ajouté dans : v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcule le condensé de toutes les données passées pour être hachées (en utilisant la méthode [`hash.update()`](/fr/nodejs/api/crypto#hashupdatedata-inputencoding)). Si `encoding` est fourni, une chaîne de caractères sera retournée ; sinon un [`Buffer`](/fr/nodejs/api/buffer) est retourné.

L'objet `Hash` ne peut plus être utilisé après que la méthode `hash.digest()` a été appelée. Plusieurs appels provoqueront une erreur.


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | Le `inputEncoding` par défaut est passé de `binary` à `utf8`. |
| v0.1.92 | Ajoutée dans : v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `data`.

Met à jour le contenu du hachage avec les `data` donnés, dont l’encodage est indiqué dans `inputEncoding`. Si `encoding` n’est pas fourni et que les `data` sont une chaîne, un encodage de `'utf8'` est appliqué. Si `data` est un [`Buffer`](/fr/nodejs/api/buffer), `TypedArray` ou `DataView`, alors `inputEncoding` est ignoré.

Cette méthode peut être appelée plusieurs fois avec de nouvelles données lors de la diffusion en continu.

## Classe : `Hmac` {#class-hmac}

**Ajoutée dans : v0.1.94**

- Hérite de : [\<stream.Transform\>](/fr/nodejs/api/stream#class-streamtransform)

La classe `Hmac` est un utilitaire de création de condensés HMAC cryptographiques. Elle peut être utilisée de deux manières :

- En tant que [flux](/fr/nodejs/api/stream) qui est à la fois lisible et accessible en écriture, où les données sont écrites pour produire un condensé HMAC calculé du côté lisible, ou
- En utilisant les méthodes [`hmac.update()`](/fr/nodejs/api/crypto#hmacupdatedata-inputencoding) et [`hmac.digest()`](/fr/nodejs/api/crypto#hmacdigestencoding) pour produire le condensé HMAC calculé.

La méthode [`crypto.createHmac()`](/fr/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) est utilisée pour créer des instances `Hmac`. Les objets `Hmac` ne doivent pas être créés directement à l’aide du mot-clé `new`.

Exemple : Utilisation d’objets `Hmac` en tant que flux :

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

Exemple : Utilisation de `Hmac` et de flux redirigés :

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { stdout } = require('node:process');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```
:::

Exemple : Utilisation des méthodes [`hmac.update()`](/fr/nodejs/api/crypto#hmacupdatedata-inputencoding) et [`hmac.digest()`](/fr/nodejs/api/crypto#hmacdigestencoding) :

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::


### `hmac.digest([encoding])` {#hmacdigestencoding}

**Ajouté dans: v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne: [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcule le condensé HMAC de toutes les données passées en utilisant [`hmac.update()`](/fr/nodejs/api/crypto#hmacupdatedata-inputencoding). Si `encoding` est fourni, une chaîne de caractères est retournée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est retourné.

L'objet `Hmac` ne peut plus être utilisé après l'appel de `hmac.digest()`. Plusieurs appels à `hmac.digest()` entraîneront une erreur.

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | La valeur par défaut de `inputEncoding` est passée de `binary` à `utf8`. |
| v0.1.94 | Ajouté dans : v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `data`.

Met à jour le contenu de `Hmac` avec les `data` donnés, dont l'encodage est indiqué dans `inputEncoding`. Si `encoding` n'est pas fourni, et que `data` est une chaîne de caractères, un encodage `'utf8'` est appliqué. Si `data` est un [`Buffer`](/fr/nodejs/api/buffer), `TypedArray`, ou `DataView`, alors `inputEncoding` est ignoré.

Cette méthode peut être appelée plusieurs fois avec de nouvelles données lors de leur diffusion en continu.

## Classe : `KeyObject` {#class-keyobject}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0, v12.19.0 | Les instances de cette classe peuvent maintenant être transmises aux threads worker en utilisant `postMessage`. |
| v11.13.0 | Cette classe est maintenant exportée. |
| v11.6.0 | Ajouté dans : v11.6.0 |
:::

Node.js utilise une classe `KeyObject` pour représenter une clé symétrique ou asymétrique, et chaque type de clé expose des fonctions différentes. Les méthodes [`crypto.createSecretKey()`](/fr/nodejs/api/crypto#cryptocreatesecretkeykey-encoding), [`crypto.createPublicKey()`](/fr/nodejs/api/crypto#cryptocreatepublickeykey) et [`crypto.createPrivateKey()`](/fr/nodejs/api/crypto#cryptocreateprivatekeykey) sont utilisées pour créer des instances de `KeyObject`. Les objets `KeyObject` ne doivent pas être créés directement en utilisant le mot-clé `new`.

La plupart des applications devraient envisager d'utiliser la nouvelle API `KeyObject` au lieu de passer des clés sous forme de chaînes de caractères ou de `Buffer` en raison de l'amélioration des fonctionnalités de sécurité.

Les instances de `KeyObject` peuvent être passées à d'autres threads via [`postMessage()`](/fr/nodejs/api/worker_threads#portpostmessagevalue-transferlist). Le récepteur obtient un `KeyObject` cloné, et le `KeyObject` n'a pas besoin d'être listé dans l'argument `transferList`.


### Méthode statique : `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**Ajouté dans : v15.0.0**

- `key` [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- Renvoie : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)

Exemple : Conversion d'une instance `CryptoKey` en un `KeyObject` :



::: code-group
```js [ESM]
const { KeyObject } = await import('node:crypto');
const { subtle } = globalThis.crypto;

const key = await subtle.generateKey({
  name: 'HMAC',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

const keyObject = KeyObject.from(key);
console.log(keyObject.symmetricKeySize);
// Affiche : 32 (taille de la clé symétrique en octets)
```

```js [CJS]
const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;

(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Affiche : 32 (taille de la clé symétrique en octets)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.9.0 | Expose les paramètres de séquence `RSASSA-PSS-params` pour les clés RSA-PSS. |
| v15.7.0 | Ajouté dans : v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `modulusLength` : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Taille de la clé en bits (RSA, DSA).
    - `publicExponent` : [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Exposant public (RSA).
    - `hashAlgorithm` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du condensé de message (RSA-PSS).
    - `mgf1HashAlgorithm` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du condensé de message utilisé par MGF1 (RSA-PSS).
    - `saltLength` : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur minimale du sel en octets (RSA-PSS).
    - `divisorLength` : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Taille de `q` en bits (DSA).
    - `namedCurve` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom de la courbe (EC).
  
 

Cette propriété existe uniquement sur les clés asymétriques. Selon le type de clé, cet objet contient des informations sur la clé. Aucune des informations obtenues grâce à cette propriété ne peut être utilisée pour identifier de manière unique une clé ou pour compromettre la sécurité de la clé.

Pour les clés RSA-PSS, si le matériel de clé contient une séquence `RSASSA-PSS-params`, les propriétés `hashAlgorithm`, `mgf1HashAlgorithm` et `saltLength` seront définies.

D'autres détails sur la clé peuvent être exposés via cette API à l'aide d'attributs supplémentaires.


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.9.0, v12.17.0 | Ajout du support pour `'dh'`. |
| v12.0.0 | Ajout du support pour `'rsa-pss'`. |
| v12.0.0 | Cette propriété renvoie maintenant `undefined` pour les instances KeyObject de type non reconnu au lieu d’abandonner. |
| v12.0.0 | Ajout du support pour `'x25519'` et `'x448'`. |
| v12.0.0 | Ajout du support pour `'ed25519'` et `'ed448'`. |
| v11.6.0 | Ajouté dans : v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Pour les clés asymétriques, cette propriété représente le type de la clé. Les types de clés pris en charge sont :

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

Cette propriété est `undefined` pour les types `KeyObject` non reconnus et les clés symétriques.

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**Ajouté dans : v17.7.0, v16.15.0**

- `otherKeyObject` : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) Un `KeyObject` avec lequel comparer `keyObject`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` ou `false` selon que les clés ont exactement le même type, la même valeur et les mêmes paramètres. Cette méthode n’est pas [à temps constant](https://en.wikipedia.org/wiki/Timing_attack).

### `keyObject.export([options])` {#keyobjectexportoptions}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.9.0 | Ajout du support pour le format `'jwk'`. |
| v11.6.0 | Ajouté dans : v11.6.0 |
:::

- `options` : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Pour les clés symétriques, les options d’encodage suivantes peuvent être utilisées :

- `format` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'buffer'` (par défaut) ou `'jwk'`.

Pour les clés publiques, les options d’encodage suivantes peuvent être utilisées :

- `type` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être l’un des `'pkcs1'` (RSA uniquement) ou `'spki'`.
- `format` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'pem'`, `'der'` ou `'jwk'`.

Pour les clés privées, les options d’encodage suivantes peuvent être utilisées :

- `type` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être l’un des `'pkcs1'` (RSA uniquement), `'pkcs8'` ou `'sec1'` (EC uniquement).
- `format` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'pem'`, `'der'` ou `'jwk'`.
- `cipher` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si spécifié, la clé privée sera chiffrée avec le `cipher` et la `passphrase` donnés en utilisant le chiffrement basé sur mot de passe PKCS#5 v2.0.
- `passphrase` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) La phrase secrète à utiliser pour le chiffrement, voir `cipher`.

Le type de résultat dépend du format d’encodage sélectionné, lorsque PEM le résultat est une chaîne, lorsque DER il s’agit d’un buffer contenant les données encodées en DER, lorsque [JWK](https://tools.ietf.org/html/rfc7517) il s’agit d’un objet.

Lorsque le format d’encodage [JWK](https://tools.ietf.org/html/rfc7517) a été sélectionné, toutes les autres options d’encodage sont ignorées.

Les clés de type PKCS#1, SEC1 et PKCS#8 peuvent être chiffrées en utilisant une combinaison des options `cipher` et `format`. Le `type` PKCS#8 peut être utilisé avec n’importe quel `format` pour chiffrer n’importe quel algorithme de clé (RSA, EC ou DH) en spécifiant un `cipher`. PKCS#1 et SEC1 ne peuvent être chiffrés qu’en spécifiant un `cipher` lorsque le `format` PEM est utilisé. Pour une compatibilité maximale, utilisez PKCS#8 pour les clés privées chiffrées. Étant donné que PKCS#8 définit son propre mécanisme de chiffrement, le chiffrement au niveau PEM n’est pas pris en charge lors du chiffrement d’une clé PKCS#8. Voir [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) pour le chiffrement PKCS#8 et [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) pour le chiffrement PKCS#1 et SEC1.


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**Ajouté dans : v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Pour les clés secrètes, cette propriété représente la taille de la clé en octets. Cette propriété est `undefined` pour les clés asymétriques.

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**Ajouté dans : v23.0.0**

- `algorithm` : [\<AlgorithmIdentifier\>](/fr/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/fr/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/fr/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/fr/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable` : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages` : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [Utilisations de la clé](/fr/nodejs/api/webcrypto#cryptokeyusages).
- Retourne : [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)

Convertit une instance `KeyObject` en une `CryptoKey`.

### `keyObject.type` {#keyobjecttype}

**Ajouté dans : v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Selon le type de ce `KeyObject`, cette propriété est soit `'secret'` pour les clés secrètes (symétriques), soit `'public'` pour les clés publiques (asymétriques), soit `'private'` pour les clés privées (asymétriques).

## Class: `Sign` {#class-sign}

**Ajouté dans : v0.1.92**

- Hérite de : [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)

La classe `Sign` est un utilitaire pour générer des signatures. Elle peut être utilisée de deux manières :

- En tant que [flux](/fr/nodejs/api/stream) accessible en écriture, où les données à signer sont écrites et la méthode [`sign.sign()`](/fr/nodejs/api/crypto#signsignprivatekey-outputencoding) est utilisée pour générer et renvoyer la signature, ou
- En utilisant les méthodes [`sign.update()`](/fr/nodejs/api/crypto#signupdatedata-inputencoding) et [`sign.sign()`](/fr/nodejs/api/crypto#signsignprivatekey-outputencoding) pour produire la signature.

La méthode [`crypto.createSign()`](/fr/nodejs/api/crypto#cryptocreatesignalgorithm-options) est utilisée pour créer des instances `Sign`. L’argument est le nom de chaîne de la fonction de hachage à utiliser. Les objets `Sign` ne doivent pas être créés directement à l’aide du mot clé `new`.

Exemple : Utilisation des objets `Sign` et [`Verify`](/fr/nodejs/api/crypto#class-verify) comme flux :

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Affiche : true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Affiche : true
```
:::

Exemple : Utilisation des méthodes [`sign.update()`](/fr/nodejs/api/crypto#signupdatedata-inputencoding) et [`verify.update()`](/fr/nodejs/api/crypto#verifyupdatedata-inputencoding) :

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Affiche : true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Affiche : true
```
:::


### `sign.sign(privateKey[, outputEncoding])` {#signsignprivatekey-outputencoding}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | La privateKey peut également être un ArrayBuffer et CryptoKey. |
| v13.2.0, v12.16.0 | Cette fonction prend désormais en charge les signatures IEEE-P1363 DSA et ECDSA. |
| v12.0.0 | Cette fonction prend désormais en charge les clés RSA-PSS. |
| v11.6.0 | Cette fonction prend désormais en charge les objets clés. |
| v8.0.0 | La prise en charge de RSASSA-PSS et des options supplémentaires a été ajoutée. |
| v0.1.92 | Ajoutée dans : v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) 
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la valeur de retour.
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcule la signature sur toutes les données transmises en utilisant soit [`sign.update()`](/fr/nodejs/api/crypto#signupdatedata-inputencoding) soit [`sign.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback).

Si `privateKey` n'est pas un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), cette fonction se comporte comme si `privateKey` avait été passé à [`crypto.createPrivateKey()`](/fr/nodejs/api/crypto#cryptocreateprivatekeykey). Si c'est un objet, les propriétés supplémentaires suivantes peuvent être passées :

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pour DSA et ECDSA, cette option spécifie le format de la signature générée. Cela peut être l'un des suivants :
    - `'der'` (par défaut) : structure de signature ASN.1 codée DER encodant `(r, s)`.
    - `'ieee-p1363'` : Format de signature `r || s` tel que proposé dans IEEE-P1363.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valeur de remplissage facultative pour RSA, l'une des suivantes :
    - `crypto.constants.RSA_PKCS1_PADDING` (par défaut)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` utilisera MGF1 avec la même fonction de hachage utilisée pour signer le message comme spécifié dans la section 3.1 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), à moins qu'une fonction de hachage MGF1 n'ait été spécifiée dans le cadre de la clé conformément à la section 3.3 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur du sel lorsque le remplissage est `RSA_PKCS1_PSS_PADDING`. La valeur spéciale `crypto.constants.RSA_PSS_SALTLEN_DIGEST` définit la longueur du sel sur la taille du condensé, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (par défaut) la définit sur la valeur maximale autorisée.

Si `outputEncoding` est fourni, une chaîne de caractères est renvoyée ; sinon, un [`Buffer`](/fr/nodejs/api/buffer) est renvoyé.

L'objet `Sign` ne peut plus être utilisé après l'appel de la méthode `sign.sign()`. Plusieurs appels à `sign.sign()` entraîneront la levée d'une erreur.


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | La valeur par défaut de `inputEncoding` est passée de `binary` à `utf8`. |
| v0.1.92 | Ajoutée dans : v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `data`.

Met à jour le contenu de `Sign` avec les `data` fournis, dont l'encodage est indiqué dans `inputEncoding`. Si `encoding` n'est pas fourni et que `data` est une chaîne, un encodage de `'utf8'` est appliqué. Si `data` est un [`Buffer`](/fr/nodejs/api/buffer), `TypedArray` ou `DataView`, alors `inputEncoding` est ignoré.

Cette méthode peut être appelée plusieurs fois avec de nouvelles données au fur et à mesure de leur transmission.

## Class: `Verify` {#class-verify}

**Ajoutée dans : v0.1.92**

- Hérite de : [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)

La classe `Verify` est un utilitaire pour vérifier les signatures. Elle peut être utilisée de deux manières :

- En tant que [stream](/fr/nodejs/api/stream) accessible en écriture où les données écrites sont utilisées pour valider la signature fournie, ou
- En utilisant les méthodes [`verify.update()`](/fr/nodejs/api/crypto#verifyupdatedata-inputencoding) et [`verify.verify()`](/fr/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) pour vérifier la signature.

La méthode [`crypto.createVerify()`](/fr/nodejs/api/crypto#cryptocreateverifyalgorithm-options) est utilisée pour créer des instances de `Verify`. Les objets `Verify` ne doivent pas être créés directement à l'aide du mot-clé `new`.

Voir [`Sign`](/fr/nodejs/api/crypto#class-sign) pour des exemples.

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | La valeur par défaut de `inputEncoding` est passée de `binary` à `utf8`. |
| v0.1.92 | Ajoutée dans : v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `data`.

Met à jour le contenu de `Verify` avec les `data` fournis, dont l'encodage est indiqué dans `inputEncoding`. Si `inputEncoding` n'est pas fourni et que `data` est une chaîne, un encodage de `'utf8'` est appliqué. Si `data` est un [`Buffer`](/fr/nodejs/api/buffer), `TypedArray` ou `DataView`, alors `inputEncoding` est ignoré.

Cette méthode peut être appelée plusieurs fois avec de nouvelles données au fur et à mesure de leur transmission.


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | L'objet peut également être un ArrayBuffer et CryptoKey. |
| v13.2.0, v12.16.0 | Cette fonction prend désormais en charge les signatures IEEE-P1363 DSA et ECDSA. |
| v12.0.0 | Cette fonction prend désormais en charge les clés RSA-PSS. |
| v11.7.0 | La clé peut maintenant être une clé privée. |
| v8.0.0 | La prise en charge de RSASSA-PSS et d'options supplémentaires a été ajoutée. |
| v0.1.92 | Ajoutée dans : v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `signature`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` ou `false` selon la validité de la signature pour les données et la clé publique.

Vérifie les données fournies en utilisant l'`objet` et la `signature` donnés.

Si `object` n'est pas un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), cette fonction se comporte comme si `object` avait été transmis à [`crypto.createPublicKey()`](/fr/nodejs/api/crypto#cryptocreatepublickeykey). Si c'est un objet, les propriétés supplémentaires suivantes peuvent être transmises :

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pour DSA et ECDSA, cette option spécifie le format de la signature. Cela peut être l'un des éléments suivants :
    - `'der'` (par défaut) : Structure de signature ASN.1 à encodage DER encodant `(r, s)`.
    - `'ieee-p1363'` : Format de signature `r || s` tel que proposé dans IEEE-P1363.


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valeur de remplissage facultative pour RSA, l'une des suivantes :
    - `crypto.constants.RSA_PKCS1_PADDING` (par défaut)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` utilisera MGF1 avec la même fonction de hachage utilisée pour vérifier le message tel que spécifié dans la section 3.1 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), à moins qu'une fonction de hachage MGF1 n'ait été spécifiée dans le cadre de la clé conformément à la section 3.3 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur du sel lorsque le remplissage est `RSA_PKCS1_PSS_PADDING`. La valeur spéciale `crypto.constants.RSA_PSS_SALTLEN_DIGEST` définit la longueur du sel à la taille du condensé, `crypto.constants.RSA_PSS_SALTLEN_AUTO` (par défaut) la fait déterminer automatiquement.

L'argument `signature` est la signature précédemment calculée pour les données, dans le `signatureEncoding`. Si un `signatureEncoding` est spécifié, la `signature` doit être une chaîne ; sinon, la `signature` doit être un [`Buffer`](/fr/nodejs/api/buffer), un `TypedArray` ou une `DataView`.

L'objet `verify` ne peut plus être utilisé une fois que `verify.verify()` a été appelé. Plusieurs appels à `verify.verify()` entraîneront une erreur.

Étant donné que les clés publiques peuvent être dérivées de clés privées, une clé privée peut être transmise à la place d'une clé publique.


## Classe : `X509Certificate` {#class-x509certificate}

**Ajoutée dans : v15.6.0**

Encapsule un certificat X509 et fournit un accès en lecture seule à ses informations.

::: code-group
```js [ESM]
const { X509Certificate } = await import('node:crypto');

const x509 = new X509Certificate('{... certifié codé en PEM ...}');

console.log(x509.subject);
```

```js [CJS]
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... certifié codé en PEM ...}');

console.log(x509.subject);
```
:::

### `new X509Certificate(buffer)` {#new-x509certificatebuffer}

**Ajoutée dans : v15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un certificat X509 codé en PEM ou DER.

### `x509.ca` {#x509ca}

**Ajoutée dans : v15.6.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Sera `true` s'il s'agit d'un certificat d'autorité de certification (CA).

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | L'option subject prend désormais `'default'` par défaut. |
| v17.5.0, v16.15.0 | L'option subject peut désormais être définie sur `'default'`. |
| v17.5.0, v16.14.1 | Les options `wildcards`, `partialWildcards`, `multiLabelWildcards` et `singleLabelSubdomains` ont été supprimées car elles n'avaient aucun effet. |
| v15.6.0 | Ajoutée dans : v15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'`, ou `'never'`. **Par défaut :** `'default'`.

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Retourne `email` si le certificat correspond, `undefined` si ce n'est pas le cas.

Vérifie si le certificat correspond à l'adresse e-mail donnée.

Si l'option `'subject'` est indéfinie ou définie sur `'default'`, l'objet du certificat n'est pris en compte que si l'extension de nom alternatif de l'objet n'existe pas ou ne contient aucune adresse e-mail.

Si l'option `'subject'` est définie sur `'always'` et si l'extension de nom alternatif de l'objet n'existe pas ou ne contient pas d'adresse e-mail correspondante, l'objet du certificat est pris en compte.

Si l'option `'subject'` est définie sur `'never'`, l'objet du certificat n'est jamais pris en compte, même si le certificat ne contient aucun nom alternatif d'objet.


### `x509.checkHost(name[, options])` {#x509checkhostname-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | L'option subject a maintenant la valeur par défaut `'default'`. |
| v17.5.0, v16.15.0 | L'option subject peut maintenant être définie sur `'default'`. |
| v15.6.0 | Ajouté dans : v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'`, ou `'never'`. **Par défaut :** `'default'`.
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`.
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`.
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`.
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`.


- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Retourne un nom de sujet qui correspond à `name`, ou `undefined` si aucun nom de sujet ne correspond à `name`.

Vérifie si le certificat correspond au nom d'hôte donné.

Si le certificat correspond au nom d'hôte donné, le nom du sujet correspondant est retourné. Le nom retourné peut être une correspondance exacte (par exemple, `foo.example.com`) ou il peut contenir des caractères génériques (par exemple, `*.example.com`). Étant donné que les comparaisons de noms d'hôte ne sont pas sensibles à la casse, le nom du sujet retourné peut également différer du `name` donné en termes de capitalisation.

Si l'option `'subject'` est indéfinie ou définie sur `'default'`, le sujet du certificat n'est pris en compte que si l'extension de nom alternatif du sujet n'existe pas ou ne contient aucun nom DNS. Ce comportement est conforme à la [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) (« HTTP Over TLS »).

Si l'option `'subject'` est définie sur `'always'` et si l'extension de nom alternatif du sujet n'existe pas ou ne contient pas de nom DNS correspondant, le sujet du certificat est pris en compte.

Si l'option `'subject'` est définie sur `'never'`, le sujet du certificat n'est jamais pris en compte, même si le certificat ne contient aucun nom alternatif de sujet.


### `x509.checkIP(ip)` {#x509checkipip}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.5.0, v16.14.1 | L'argument `options` a été supprimé car il n'avait aucun effet. |
| v15.6.0 | Ajouté dans : v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Retourne `ip` si le certificat correspond, `undefined` si ce n'est pas le cas.

Vérifie si le certificat correspond à l'adresse IP donnée (IPv4 ou IPv6).

Seuls les noms alternatifs de sujet `iPAddress` [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt) sont pris en compte, et ils doivent correspondre exactement à l'adresse `ip` donnée. Les autres noms alternatifs de sujet ainsi que le champ sujet du certificat sont ignorés.

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**Ajouté dans : v15.6.0**

- `otherCert` [\<X509Certificate\>](/fr/nodejs/api/crypto#class-x509certificate)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vérifie si ce certificat a été émis par le `otherCert` donné.

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**Ajouté dans : v15.6.0**

- `privateKey` [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) Une clé privée.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vérifie si la clé publique de ce certificat est cohérente avec la clé privée donnée.

### `x509.extKeyUsage` {#x509extkeyusage}

**Ajouté dans : v15.6.0**

- Type : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un tableau détaillant les utilisations étendues de la clé pour ce certificat.

### `x509.fingerprint` {#x509fingerprint}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'empreinte SHA-1 de ce certificat.

Étant donné que SHA-1 est cassé cryptographiquement et que la sécurité de SHA-1 est nettement inférieure à celle des algorithmes couramment utilisés pour signer les certificats, envisagez d'utiliser [`x509.fingerprint256`](/fr/nodejs/api/crypto#x509fingerprint256) à la place.


### `x509.fingerprint256` {#x509fingerprint256}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)

L’empreinte SHA-256 de ce certificat.

### `x509.fingerprint512` {#x509fingerprint512}

**Ajouté dans : v17.2.0, v16.14.0**

- Type : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)

L’empreinte SHA-512 de ce certificat.

Étant donné que le calcul de l’empreinte SHA-256 est généralement plus rapide et qu’elle ne représente que la moitié de la taille de l’empreinte SHA-512, [`x509.fingerprint256`](/fr/nodejs/api/crypto#x509fingerprint256) peut être un meilleur choix. Bien que SHA-512 offre probablement un niveau de sécurité plus élevé en général, la sécurité de SHA-256 correspond à celle de la plupart des algorithmes couramment utilisés pour signer des certificats.

### `x509.infoAccess` {#x509infoaccess}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.3.1, v16.13.2 | Des parties de cette chaîne peuvent être encodées en tant que littéraux de chaîne JSON en réponse à CVE-2021-44532. |
| v15.6.0 | Ajouté dans : v15.6.0 |
:::

- Type : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)

Une représentation textuelle de l’extension d’accès aux informations d’autorité du certificat.

Il s’agit d’une liste de descriptions d’accès séparées par un saut de ligne. Chaque ligne commence par la méthode d’accès et le type d’emplacement d’accès, suivis d’un deux-points et de la valeur associée à l’emplacement d’accès.

Après le préfixe indiquant la méthode d’accès et le type de l’emplacement d’accès, le reste de chaque ligne peut être entre guillemets pour indiquer que la valeur est un littéral de chaîne JSON. Pour assurer la compatibilité ascendante, Node.js n’utilise les littéraux de chaîne JSON dans cette propriété que lorsque cela est nécessaire pour éviter toute ambiguïté. Le code tiers doit être prêt à gérer les deux formats d’entrée possibles.

### `x509.issuer` {#x509issuer}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)

L’identification de l’émetteur incluse dans ce certificat.


### `x509.issuerCertificate` {#x509issuercertificate}

**Ajouté dans : v15.9.0**

- Type : [\<X509Certificate\>](/fr/nodejs/api/crypto#class-x509certificate)

Le certificat de l’émetteur ou `undefined` si le certificat de l’émetteur n’est pas disponible.

### `x509.publicKey` {#x509publickey}

**Ajouté dans : v15.6.0**

- Type : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)

La clé publique [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) pour ce certificat.

### `x509.raw` {#x509raw}

**Ajouté dans : v15.6.0**

- Type : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Un `Buffer` contenant l’encodage DER de ce certificat.

### `x509.serialNumber` {#x509serialnumber}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le numéro de série de ce certificat.

Les numéros de série sont attribués par les autorités de certification et n’identifient pas les certificats de manière unique. Envisagez plutôt d’utiliser [`x509.fingerprint256`](/fr/nodejs/api/crypto#x509fingerprint256) comme identifiant unique.

### `x509.subject` {#x509subject}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le sujet complet de ce certificat.

### `x509.subjectAltName` {#x509subjectaltname}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.3.1, v16.13.2 | Certaines parties de cette chaîne peuvent être encodées en tant que littéraux de chaîne JSON en réponse à CVE-2021-44532. |
| v15.6.0 | Ajouté dans : v15.6.0 |
:::

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L’autre nom du sujet spécifié pour ce certificat.

Il s’agit d’une liste d’autres noms de sujets séparés par des virgules. Chaque entrée commence par une chaîne identifiant le type de l’autre nom du sujet, suivie d’un deux-points et de la valeur associée à l’entrée.

Les versions antérieures de Node.js supposaient incorrectement qu’il était sûr de diviser cette propriété à la séquence de deux caractères `', '` (voir [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532)). Cependant, les certificats malveillants et légitimes peuvent contenir d’autres noms de sujets qui incluent cette séquence lorsqu’ils sont représentés sous forme de chaîne.

Après le préfixe indiquant le type de l’entrée, le reste de chaque entrée peut être mis entre guillemets pour indiquer que la valeur est un littéral de chaîne JSON. Pour assurer la rétrocompatibilité, Node.js n’utilise les littéraux de chaîne JSON dans cette propriété que lorsque cela est nécessaire pour éviter toute ambiguïté. Le code tiers doit être préparé à gérer les deux formats d’entrée possibles.


### `x509.toJSON()` {#x509tojson}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il n'existe pas d'encodage JSON standard pour les certificats X509. La méthode `toJSON()` renvoie une chaîne contenant le certificat encodé PEM.

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Ajouté dans : v15.6.0**

- Type : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Renvoie des informations sur ce certificat en utilisant l'encodage d'[objet de certificat](/fr/nodejs/api/tls#certificate-object) existant.

### `x509.toString()` {#x509tostring}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie le certificat encodé PEM.

### `x509.validFrom` {#x509validfrom}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La date/heure à partir de laquelle ce certificat est valide.

### `x509.validFromDate` {#x509validfromdate}

**Ajouté dans : v23.0.0**

- Type : [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La date/heure à partir de laquelle ce certificat est valide, encapsulée dans un objet `Date`.

### `x509.validTo` {#x509validto}

**Ajouté dans : v15.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La date/heure jusqu'à laquelle ce certificat est valide.

### `x509.validToDate` {#x509validtodate}

**Ajouté dans : v23.0.0**

- Type : [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La date/heure jusqu'à laquelle ce certificat est valide, encapsulée dans un objet `Date`.

### `x509.verify(publicKey)` {#x509verifypublickey}

**Ajouté dans : v15.6.0**

- `publicKey` [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) Une clé publique.
- Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vérifie que ce certificat a été signé par la clé publique donnée. N'effectue aucune autre vérification de validation sur le certificat.


## Méthodes et propriétés du module `node:crypto` {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidat[, options], callback)` {#cryptocheckprimecandidate-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Ajouté dans : v15.8.0 |
:::

- `candidat` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Un nombre premier possible encodé comme une séquence d'octets big-endian de longueur arbitraire.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'itérations probabilistes de primalité de Miller-Rabin à effectuer. Lorsque la valeur est `0` (zéro), un nombre de vérifications est utilisé qui donne un taux de faux positifs d'au plus 2 pour une entrée aléatoire. Il faut faire attention lors de la sélection d'un nombre de vérifications. Reportez-vous à la documentation OpenSSL pour la fonction [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) les options `nchecks` pour plus de détails. **Par défaut :** `0`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Défini sur un objet [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) si une erreur s'est produite pendant la vérification.
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le candidat est un nombre premier avec une probabilité d'erreur inférieure à `0.25 ** options.checks`.


Vérifie la primalité du `candidat`.


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**Ajouté dans : v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Un nombre premier possible encodé comme une séquence d'octets big-endian de longueur arbitraire.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'itérations probabilistes de primalité de Miller-Rabin à effectuer. Lorsque la valeur est `0` (zéro), un nombre de vérifications est utilisé qui donne un taux de faux positifs d'au plus 2 pour une entrée aléatoire. Il faut faire attention lors de la sélection d'un nombre de vérifications. Consultez la documentation OpenSSL pour les options `nchecks` de la fonction [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) pour plus de détails. **Par défaut :** `0`

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le candidat est un nombre premier avec une probabilité d'erreur inférieure à `0.25 ** options.checks`.

Vérifie si le `candidat` est premier.

### `crypto.constants` {#cryptoconstants}

**Ajouté dans : v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objet contenant les constantes couramment utilisées pour les opérations liées à la cryptographie et à la sécurité. Les constantes spécifiques actuellement définies sont décrites dans [Constantes Crypto](/fr/nodejs/api/crypto#crypto-constants).


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.9.0, v16.17.0 | L'option `authTagLength` est maintenant optionnelle lors de l'utilisation du chiffrement `chacha20-poly1305` et est par défaut de 16 octets. |
| v15.0.0 | Les arguments password et iv peuvent être un ArrayBuffer et sont chacun limités à un maximum de 2 ** 31 - 1 octets. |
| v11.6.0 | L'argument `key` peut maintenant être un `KeyObject`. |
| v11.2.0, v10.17.0 | Le chiffrement `chacha20-poly1305` (la variante IETF de ChaCha20-Poly1305) est maintenant pris en charge. |
| v10.10.0 | Les chiffrements en mode OCB sont désormais pris en charge. |
| v10.2.0 | L'option `authTagLength` peut maintenant être utilisée pour produire des balises d'authentification plus courtes en mode GCM et sa valeur par défaut est de 16 octets. |
| v9.9.0 | Le paramètre `iv` peut maintenant être `null` pour les chiffrements qui n'ont pas besoin de vecteur d'initialisation. |
| v0.1.94 | Ajoutée dans : v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/fr/nodejs/api/stream#new-streamtransformoptions)
- Retourne : [\<Cipher\>](/fr/nodejs/api/crypto#class-cipher)

Crée et retourne un objet `Cipher`, avec l'`algorithm`, la `key` et le vecteur d'initialisation (`iv`) donnés.

L'argument `options` contrôle le comportement du flux et est optionnel sauf lorsqu'un chiffrement en mode CCM ou OCB (par exemple `'aes-128-ccm'`) est utilisé. Dans ce cas, l'option `authTagLength` est requise et spécifie la longueur de la balise d'authentification en octets, voir [mode CCM](/fr/nodejs/api/crypto#ccm-mode). En mode GCM, l'option `authTagLength` n'est pas requise mais peut être utilisée pour définir la longueur de la balise d'authentification qui sera renvoyée par `getAuthTag()` et sa valeur par défaut est de 16 octets. Pour `chacha20-poly1305`, l'option `authTagLength` est par défaut de 16 octets.

L'`algorithm` dépend d'OpenSSL, des exemples sont `'aes192'`, etc. Sur les versions récentes d'OpenSSL, `openssl list -cipher-algorithms` affichera les algorithmes de chiffrement disponibles.

La `key` est la clé brute utilisée par l'`algorithm` et `iv` est un [vecteur d'initialisation](https://en.wikipedia.org/wiki/Initialization_vector). Les deux arguments doivent être des chaînes encodées en `'utf8'`, des [Buffers](/fr/nodejs/api/buffer), des `TypedArray` ou des `DataView`. La `key` peut éventuellement être un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject) de type `secret`. Si le chiffrement n'a pas besoin de vecteur d'initialisation, `iv` peut être `null`.

Lorsque vous passez des chaînes pour `key` ou `iv`, veuillez tenir compte des [mises en garde lors de l'utilisation de chaînes comme entrées des API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Les vecteurs d'initialisation doivent être imprévisibles et uniques ; idéalement, ils seront cryptographiquement aléatoires. Ils n'ont pas besoin d'être secrets : les IV sont généralement simplement ajoutés aux messages chiffrés non chiffrés. Il peut sembler contradictoire que quelque chose doive être imprévisible et unique, mais n'ait pas besoin d'être secret ; rappelez-vous qu'un attaquant ne doit pas être capable de prédire à l'avance ce que sera un IV donné.


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.9.0, v16.17.0 | L'option `authTagLength` est désormais facultative lors de l'utilisation du chiffrement `chacha20-poly1305` et sa valeur par défaut est de 16 octets. |
| v11.6.0 | L'argument `key` peut désormais être un `KeyObject`. |
| v11.2.0, v10.17.0 | Le chiffrement `chacha20-poly1305` (la variante IETF de ChaCha20-Poly1305) est désormais pris en charge. |
| v10.10.0 | Les chiffrements en mode OCB sont désormais pris en charge. |
| v10.2.0 | L'option `authTagLength` peut désormais être utilisée pour limiter les longueurs de balises d'authentification GCM acceptées. |
| v9.9.0 | Le paramètre `iv` peut désormais être `null` pour les chiffrements qui n'ont pas besoin de vecteur d'initialisation. |
| v0.1.94 | Ajoutée dans : v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/fr/nodejs/api/stream#new-streamtransformoptions)
- Retourne : [\<Decipher\>](/fr/nodejs/api/crypto#class-decipher)

Crée et renvoie un objet `Decipher` qui utilise l'`algorithm`, la `key` et le vecteur d'initialisation (`iv`) donnés.

L'argument `options` contrôle le comportement du flux et est facultatif, sauf lorsqu'un chiffrement en mode CCM ou OCB (par exemple, `'aes-128-ccm'`) est utilisé. Dans ce cas, l'option `authTagLength` est obligatoire et spécifie la longueur de la balise d'authentification en octets ; voir [Mode CCM](/fr/nodejs/api/crypto#ccm-mode). Pour AES-GCM et `chacha20-poly1305`, l'option `authTagLength` est définie par défaut sur 16 octets et doit être définie sur une valeur différente si une longueur différente est utilisée.

L'`algorithm` dépend d'OpenSSL, des exemples sont `'aes192'`, etc. Sur les versions récentes d'OpenSSL, `openssl list -cipher-algorithms` affichera les algorithmes de chiffrement disponibles.

La `key` est la clé brute utilisée par l'`algorithm` et `iv` est un [vecteur d'initialisation](https://en.wikipedia.org/wiki/Initialization_vector). Les deux arguments doivent être des chaînes encodées en `'utf8'`, des [Buffers](/fr/nodejs/api/buffer), des `TypedArray` ou des `DataView`. La `key` peut éventuellement être un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject) de type `secret`. Si le chiffrement n'a pas besoin d'un vecteur d'initialisation, `iv` peut être `null`.

Lorsque vous transmettez des chaînes pour `key` ou `iv`, veuillez tenir compte des [mises en garde lors de l'utilisation de chaînes comme entrées aux API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Les vecteurs d'initialisation doivent être imprévisibles et uniques ; idéalement, ils seront cryptographiquement aléatoires. Ils n'ont pas besoin d'être secrets : les IV sont généralement simplement ajoutés aux messages en texte chiffré non chiffrés. Il peut sembler contradictoire que quelque chose doive être imprévisible et unique, mais n'ait pas besoin d'être secret ; rappelez-vous qu'un attaquant ne doit pas être en mesure de prédire à l'avance quel sera un IV donné.


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | L'argument `prime` peut désormais être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | L'argument `prime` peut désormais être un `Uint8Array`. |
| v6.0.0 | La valeur par défaut des paramètres d'encodage est passée de `binary` à `utf8`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `prime`.
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Par défaut :** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'[encodage](/fr/nodejs/api/buffer#buffers-and-character-encodings) de la chaîne `generator`.
- Retourne : [\<DiffieHellman\>](/fr/nodejs/api/crypto#class-diffiehellman)

Crée un objet d'échange de clés `DiffieHellman` en utilisant le `prime` fourni et un `generator` spécifique facultatif.

L'argument `generator` peut être un nombre, une chaîne de caractères ou un [`Buffer`](/fr/nodejs/api/buffer). Si `generator` n'est pas spécifié, la valeur `2` est utilisée.

Si `primeEncoding` est spécifié, `prime` doit être une chaîne de caractères ; sinon, un [`Buffer`](/fr/nodejs/api/buffer), `TypedArray` ou `DataView` est attendu.

Si `generatorEncoding` est spécifié, `generator` doit être une chaîne ; sinon, un nombre, [`Buffer`](/fr/nodejs/api/buffer), `TypedArray` ou `DataView` est attendu.


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**Ajouté dans : v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `2`
- Retourne : [\<DiffieHellman\>](/fr/nodejs/api/crypto#class-diffiehellman)

Crée un objet d’échange de clés `DiffieHellman` et génère un nombre premier de `primeLength` bits en utilisant un `generator` numérique spécifique optionnel. Si `generator` n’est pas spécifié, la valeur `2` est utilisée.

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**Ajouté dans : v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<DiffieHellmanGroup\>](/fr/nodejs/api/crypto#class-diffiehellmangroup)

Un alias pour [`crypto.getDiffieHellman()`](/fr/nodejs/api/crypto#cryptogetdiffiehellmangroupname)

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**Ajouté dans : v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<ECDH\>](/fr/nodejs/api/crypto#class-ecdh)

Crée un objet d’échange de clés Elliptic Curve Diffie-Hellman (`ECDH`) en utilisant une courbe prédéfinie spécifiée par la chaîne `curveName`. Utilisez [`crypto.getCurves()`](/fr/nodejs/api/crypto#cryptogetcurves) pour obtenir une liste des noms de courbes disponibles. Sur les versions récentes d’OpenSSL, `openssl ecparam -list_curves` affichera également le nom et la description de chaque courbe elliptique disponible.

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.8.0 | L’option `outputLength` a été ajoutée pour les fonctions de hachage XOF. |
| v0.1.92 | Ajouté dans : v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/fr/nodejs/api/stream#new-streamtransformoptions)
- Retourne : [\<Hash\>](/fr/nodejs/api/crypto#class-hash)

Crée et retourne un objet `Hash` qui peut être utilisé pour générer des condensés de hachage en utilisant l’`algorithm` donné. L’argument optionnel `options` contrôle le comportement du flux. Pour les fonctions de hachage XOF telles que `'shake256'`, l’option `outputLength` peut être utilisée pour spécifier la longueur de sortie souhaitée en octets.

L’`algorithm` dépend des algorithmes disponibles pris en charge par la version d’OpenSSL sur la plateforme. Les exemples sont `'sha256'`, `'sha512'`, etc. Sur les versions récentes d’OpenSSL, `openssl list -digest-algorithms` affichera les algorithmes de condensé disponibles.

Exemple : générer la somme sha256 d’un fichier



::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHash,
} = await import('node:crypto');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHash,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createHmac(algorithm, key[, options])` {#cryptocreatehmacalgorithm-key-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | La clé peut également être un ArrayBuffer ou une CryptoKey. L'option d'encodage a été ajoutée. La clé ne peut pas contenir plus de 2 ** 32 - 1 octets. |
| v11.6.0 | L'argument `key` peut maintenant être un `KeyObject`. |
| v0.1.94 | Ajouté dans : v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/fr/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de chaîne à utiliser lorsque `key` est une chaîne.

- Retourne : [\<Hmac\>](/fr/nodejs/api/crypto#class-hmac)

Crée et renvoie un objet `Hmac` qui utilise les `algorithm` et `key` donnés. L'argument `options` facultatif contrôle le comportement du flux.

L'`algorithm` dépend des algorithmes disponibles pris en charge par la version d'OpenSSL sur la plateforme. Les exemples sont `'sha256'`, `'sha512'`, etc. Sur les versions récentes d'OpenSSL, `openssl list -digest-algorithms` affichera les algorithmes de hachage disponibles.

La `key` est la clé HMAC utilisée pour générer le hachage HMAC cryptographique. S'il s'agit d'un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), son type doit être `secret`. S'il s'agit d'une chaîne, veuillez tenir compte des [mises en garde lors de l'utilisation de chaînes comme entrées aux API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis). S'il a été obtenu à partir d'une source d'entropie cryptographiquement sécurisée, telle que [`crypto.randomBytes()`](/fr/nodejs/api/crypto#cryptorandombytessize-callback) ou [`crypto.generateKey()`](/fr/nodejs/api/crypto#cryptogeneratekeytype-options-callback), sa longueur ne doit pas dépasser la taille de bloc de `algorithm` (par exemple, 512 bits pour SHA-256).

Exemple : génération du HMAC sha256 d'un fichier

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createPrivateKey(key)` {#cryptocreateprivatekeykey}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.12.0 | La clé peut également être un objet JWK. |
| v15.0.0 | La clé peut également être un ArrayBuffer. L'option d'encodage a été ajoutée. La clé ne peut pas contenir plus de 2 ** 32 - 1 octets. |
| v11.6.0 | Ajoutée dans : v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le matériel de la clé, au format PEM, DER ou JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'pem'`, `'der'`, ou `'jwk'`. **Par défaut :** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'pkcs1'`, `'pkcs8'` ou `'sec1'`. Cette option est requise uniquement si le `format` est `'der'` et ignorée sinon.
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) La phrase de passe à utiliser pour le déchiffrement.
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de chaîne à utiliser lorsque `key` est une chaîne.

- Retourne : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)

Crée et renvoie un nouvel objet clé contenant une clé privée. Si `key` est une chaîne ou un `Buffer`, le `format` est supposé être `'pem'`; sinon, `key` doit être un objet avec les propriétés décrites ci-dessus.

Si la clé privée est chiffrée, une `passphrase` doit être spécifiée. La longueur de la phrase de passe est limitée à 1024 octets.


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.12.0 | La clé peut également être un objet JWK. |
| v15.0.0 | La clé peut également être un ArrayBuffer. L'option d'encodage a été ajoutée. La clé ne peut pas contenir plus de 2 ** 32 - 1 octets. |
| v11.13.0 | L'argument `key` peut désormais être un `KeyObject` de type `private`. |
| v11.7.0 | L'argument `key` peut désormais être une clé privée. |
| v11.6.0 | Ajouté dans : v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Le matériau de la clé, au format PEM, DER ou JWK.
    - `format` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'pem'`, `'der'` ou `'jwk'`. **Par défaut :** `'pem'`.
    - `type` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'pkcs1'` ou `'spki'`. Cette option n'est requise que si le `format` est `'der'` et ignorée sinon.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de chaîne à utiliser lorsque `key` est une chaîne.

- Retourne : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)

Crée et renvoie un nouvel objet de clé contenant une clé publique. Si `key` est une chaîne ou un `Buffer`, le `format` est supposé être `'pem'` ; si `key` est un `KeyObject` de type `'private'`, la clé publique est dérivée de la clé privée donnée ; sinon, `key` doit être un objet avec les propriétés décrites ci-dessus.

Si le format est `'pem'`, `'key'` peut également être un certificat X.509.

Étant donné que les clés publiques peuvent être dérivées de clés privées, une clé privée peut être transmise à la place d'une clé publique. Dans ce cas, cette fonction se comporte comme si [`crypto.createPrivateKey()`](/fr/nodejs/api/crypto#cryptocreateprivatekeykey) avait été appelée, sauf que le type du `KeyObject` renvoyé sera `'public'` et que la clé privée ne pourra pas être extraite du `KeyObject` renvoyé. De même, si un `KeyObject` de type `'private'` est donné, un nouveau `KeyObject` de type `'public'` sera renvoyé et il sera impossible d'extraire la clé privée de l'objet renvoyé.


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.8.0, v16.18.0 | La clé peut maintenant avoir une longueur nulle. |
| v15.0.0 | La clé peut également être un ArrayBuffer ou une chaîne de caractères. L'argument encoding a été ajouté. La clé ne peut pas contenir plus de 2 ** 32 - 1 octets. |
| v11.6.0 | Ajoutée dans : v11.6.0 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de la chaîne lorsque `key` est une chaîne.
- Retourne : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)

Crée et retourne un nouvel objet clé contenant une clé secrète pour le chiffrement symétrique ou `Hmac`.

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**Ajoutée dans : v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options [`stream.Writable`](/fr/nodejs/api/stream#new-streamwritableoptions)
- Retourne : [\<Sign\>](/fr/nodejs/api/crypto#class-sign)

Crée et retourne un objet `Sign` qui utilise l'`algorithm` donné. Utilisez [`crypto.getHashes()`](/fr/nodejs/api/crypto#cryptogethashes) pour obtenir les noms des algorithmes de hachage disponibles. L'argument optionnel `options` contrôle le comportement de `stream.Writable`.

Dans certains cas, une instance `Sign` peut être créée en utilisant le nom d'un algorithme de signature, tel que `'RSA-SHA256'`, au lieu d'un algorithme de hachage. Cela utilisera l'algorithme de hachage correspondant. Cela ne fonctionne pas pour tous les algorithmes de signature, tels que `'ecdsa-with-SHA256'`, il est donc préférable d'utiliser toujours les noms d'algorithmes de hachage.


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**Ajouté dans: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options [`stream.Writable`](/fr/nodejs/api/stream#new-streamwritableoptions)
- Retourne : [\<Verify\>](/fr/nodejs/api/crypto#class-verify)

Crée et retourne un objet `Verify` qui utilise l'algorithme donné. Utilisez [`crypto.getHashes()`](/fr/nodejs/api/crypto#cryptogethashes) pour obtenir un tableau de noms des algorithmes de signature disponibles. L'argument optionnel `options` contrôle le comportement `stream.Writable`.

Dans certains cas, une instance `Verify` peut être créée en utilisant le nom d'un algorithme de signature, tel que `'RSA-SHA256'`, au lieu d'un algorithme de hachage. Cela utilisera l'algorithme de hachage correspondant. Cela ne fonctionne pas pour tous les algorithmes de signature, tels que `'ecdsa-with-SHA256'`, il est donc préférable d'utiliser toujours les noms d'algorithmes de hachage.

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**Ajouté dans : v13.9.0, v12.17.0**

- `options` : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `privateKey` : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)
    - `publicKey` : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)


- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Calcule le secret Diffie-Hellman basé sur une `privateKey` et une `publicKey`. Les deux clés doivent avoir le même `asymmetricKeyType`, qui doit être l'un des éléments suivants : `'dh'` (pour Diffie-Hellman), `'ec'`, `'x448'` ou `'x25519'` (pour ECDH).

### `crypto.fips` {#cryptofips}

**Ajouté dans: v6.0.0**

**Déprécié depuis : v10.0.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

Propriété permettant de vérifier et de contrôler si un fournisseur de chiffrement conforme à la norme FIPS est actuellement utilisé. Définir la valeur sur true nécessite une version FIPS de Node.js.

Cette propriété est dépréciée. Veuillez utiliser `crypto.setFips()` et `crypto.getFips()` à la place.


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Envoyer un rappel invalide à l'argument `callback` renvoie maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Ajouté dans: v15.0.0 |
:::

- `type` : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'utilisation prévue de la clé secrète générée. Les valeurs actuellement acceptées sont `'hmac'` et `'aes'`.
- `options` : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length` : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur de la clé à générer, en bits. Doit être une valeur supérieure à 0.
    - Si `type` est `'hmac'`, la longueur minimale est de 8 et la longueur maximale est de 2-1. Si la valeur n'est pas un multiple de 8, la clé générée sera tronquée à `Math.floor(length / 8)`.
    - Si `type` est `'aes'`, la longueur doit être `128`, `192` ou `256`.



- `callback` : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` : [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key` : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)

Génère de manière asynchrone une nouvelle clé secrète aléatoire de la `length` donnée. Le `type` déterminera les validations à effectuer sur la `length`.

::: code-group
```js [ESM]
const {
  generateKey,
} = await import('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```

```js [CJS]
const {
  generateKey,
} = require('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```
:::

La taille d'une clé HMAC générée ne doit pas dépasser la taille de bloc de la fonction de hachage sous-jacente. Voir [`crypto.createHmac()`](/fr/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) pour plus d'informations.


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v16.10.0 | Ajout de la possibilité de définir les paramètres de séquence `RSASSA-PSS-params` pour les paires de clés RSA-PSS. |
| v13.9.0, v12.17.0 | Ajout du support pour Diffie-Hellman. |
| v12.0.0 | Ajout du support pour les paires de clés RSA-PSS. |
| v12.0.0 | Ajout de la possibilité de générer des paires de clés X25519 et X448. |
| v12.0.0 | Ajout de la possibilité de générer des paires de clés Ed25519 et Ed448. |
| v11.6.0 | Les fonctions `generateKeyPair` et `generateKeyPairSync` produisent désormais des objets de clé si aucun encodage n'a été spécifié. |
| v10.12.0 | Ajouté dans : v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'`, ou `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Taille de la clé en bits (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Exposant public (RSA). **Par défaut :** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du condensé de message (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du condensé de message utilisé par MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur minimale du sel en octets (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Taille de `q` en bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom de la courbe à utiliser (EC).
    - `prime`: [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le paramètre premier (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur première en bits (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Générateur personnalisé (DH). **Par défaut :** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du groupe Diffie-Hellman (DH). Voir [`crypto.getDiffieHellman()`](/fr/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'named'` ou `'explicit'` (EC). **Par défaut :** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Voir [`keyObject.export()`](/fr/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Voir [`keyObject.export()`](/fr/nodejs/api/crypto#keyobjectexportoptions).


- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)



Génère une nouvelle paire de clés asymétriques du `type` donné. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 et DH sont actuellement pris en charge.

Si un `publicKeyEncoding` ou `privateKeyEncoding` a été spécifié, cette fonction se comporte comme si [`keyObject.export()`](/fr/nodejs/api/crypto#keyobjectexportoptions) avait été appelé sur son résultat. Sinon, la partie respective de la clé est renvoyée en tant que [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject).

Il est recommandé d'encoder les clés publiques en tant que `'spki'` et les clés privées en tant que `'pkcs8'` avec chiffrement pour le stockage à long terme :

::: code-group
```js [ESM]
const {
  generateKeyPair,
} = await import('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
```

```js [CJS]
const {
  generateKeyPair,
} = require('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
```
:::

À la fin, `callback` sera appelé avec `err` défini sur `undefined` et `publicKey` / `privateKey` représentant la paire de clés générée.

Si cette méthode est appelée comme sa version [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ed, elle renvoie une `Promise` pour un `Object` avec les propriétés `publicKey` et `privateKey`.


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.10.0 | Ajout de la possibilité de définir les paramètres de séquence `RSASSA-PSS-params` pour les paires de clés RSA-PSS. |
| v13.9.0, v12.17.0 | Ajout du support pour Diffie-Hellman. |
| v12.0.0 | Ajout du support pour les paires de clés RSA-PSS. |
| v12.0.0 | Ajout de la possibilité de générer des paires de clés X25519 et X448. |
| v12.0.0 | Ajout de la possibilité de générer des paires de clés Ed25519 et Ed448. |
| v11.6.0 | Les fonctions `generateKeyPair` et `generateKeyPairSync` produisent maintenant des objets clés si aucun encodage n'a été spécifié. |
| v10.12.0 | Ajouté dans : v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` ou `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Taille de la clé en bits (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Exposant public (RSA). **Par défaut :** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du condensé de message (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du condensé de message utilisé par MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur minimale du sel en octets (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Taille de `q` en bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom de la courbe à utiliser (EC).
    - `prime`: [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le paramètre premier (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur du nombre premier en bits (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Générateur personnalisé (DH). **Par défaut :** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du groupe Diffie-Hellman (DH). Voir [`crypto.getDiffieHellman()`](/fr/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'named'` ou `'explicit'` (EC). **Par défaut :** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Voir [`keyObject.export()`](/fr/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Voir [`keyObject.export()`](/fr/nodejs/api/crypto#keyobjectexportoptions).
  
 
- Retourne: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)
  
 

Génère une nouvelle paire de clés asymétriques du `type` donné. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 et DH sont actuellement pris en charge.

Si `publicKeyEncoding` ou `privateKeyEncoding` a été spécifié, cette fonction se comporte comme si [`keyObject.export()`](/fr/nodejs/api/crypto#keyobjectexportoptions) avait été appelé sur son résultat. Sinon, la partie respective de la clé est renvoyée en tant que [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject).

Lors de l'encodage des clés publiques, il est recommandé d'utiliser `'spki'`. Lors de l'encodage des clés privées, il est recommandé d'utiliser `'pkcs8'` avec une phrase secrète forte, et de garder la phrase secrète confidentielle.

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
} = await import('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

```js [CJS]
const {
  generateKeyPairSync,
} = require('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```
:::

La valeur de retour `{ publicKey, privateKey }` représente la paire de clés générée. Lorsque l'encodage PEM a été sélectionné, la clé respective sera une chaîne de caractères, sinon ce sera un buffer contenant les données encodées en DER.


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**Ajouté dans : v15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’utilisation prévue de la clé secrète générée. Les valeurs actuellement acceptées sont `'hmac'` et `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur en bits de la clé à générer.
    - Si `type` est `'hmac'`, le minimum est 8 et la longueur maximale est 2-1. Si la valeur n’est pas un multiple de 8, la clé générée sera tronquée à `Math.floor(length / 8)`.
    - Si `type` est `'aes'`, la longueur doit être l’une des valeurs suivantes : `128`, `192` ou `256`.



- Renvoie : [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject)

Génère de manière synchrone une nouvelle clé secrète aléatoire de la `length` donnée. Le `type` déterminera les validations qui seront effectuées sur la `length`.



::: code-group
```js [ESM]
const {
  generateKeySync,
} = await import('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```

```js [CJS]
const {
  generateKeySync,
} = require('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```
:::

La taille d’une clé HMAC générée ne doit pas dépasser la taille de bloc de la fonction de hachage sous-jacente. Voir [`crypto.createHmac()`](/fr/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) pour plus d’informations.

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d’un callback invalide à l’argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Ajouté dans : v15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille (en bits) du nombre premier à générer.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, le nombre premier généré est renvoyé sous forme de `bigint`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)



Génère un nombre premier pseudo-aléatoire de `size` bits.

Si `options.safe` est `true`, le nombre premier sera un nombre premier sûr, c’est-à-dire que `(prime - 1) / 2` sera également un nombre premier.

Les paramètres `options.add` et `options.rem` peuvent être utilisés pour appliquer des exigences supplémentaires, par exemple, pour Diffie-Hellman :

- Si `options.add` et `options.rem` sont tous les deux définis, le nombre premier satisfera la condition `prime % add = rem`.
- Si seul `options.add` est défini et que `options.safe` n’est pas `true`, le nombre premier satisfera la condition `prime % add = 1`.
- Si seul `options.add` est défini et que `options.safe` est défini sur `true`, le nombre premier satisfera à la place la condition `prime % add = 3`. Ceci est nécessaire car `prime % add = 1` pour `options.add \> 2` contredirait la condition appliquée par `options.safe`.
- `options.rem` est ignoré si `options.add` n’est pas donné.

`options.add` et `options.rem` doivent être encodés en tant que séquences big-endian s’ils sont donnés en tant que `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` ou `DataView`.

Par défaut, le nombre premier est encodé en tant que séquence big-endian d’octets dans un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Si l’option `bigint` est `true`, alors un [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) est fourni.


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**Ajouté dans : v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille (en bits) du nombre premier à générer.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, le nombre premier généré est renvoyé en tant que `bigint`.

- Returns: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Génère un nombre premier pseudo-aléatoire de `size` bits.

Si `options.safe` est `true`, le nombre premier sera un nombre premier sûr -- c'est-à-dire que `(prime - 1) / 2` sera également un nombre premier.

Les paramètres `options.add` et `options.rem` peuvent être utilisés pour appliquer des exigences supplémentaires, par exemple, pour Diffie-Hellman :

- Si `options.add` et `options.rem` sont tous deux définis, le nombre premier satisfera la condition que `prime % add = rem`.
- Si seul `options.add` est défini et que `options.safe` n'est pas `true`, le nombre premier satisfera la condition que `prime % add = 1`.
- Si seul `options.add` est défini et que `options.safe` est défini sur `true`, le nombre premier satisfera plutôt la condition que `prime % add = 3`. Ceci est nécessaire car `prime % add = 1` pour `options.add \> 2` contredirait la condition appliquée par `options.safe`.
- `options.rem` est ignoré si `options.add` n'est pas donné.

`options.add` et `options.rem` doivent tous deux être encodés en tant que séquences big-endian s'ils sont donnés en tant que `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` ou `DataView`.

Par défaut, le nombre premier est encodé sous la forme d'une séquence big-endian d'octets dans un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Si l'option `bigint` est `true`, alors un [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) est fourni.


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**Ajouté dans: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nom ou le nid du chiffrement à interroger.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Une longueur de clé de test.
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Une longueur d’IV de test.


- Retourne: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du chiffrement.
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nid du chiffrement.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille du bloc du chiffrement en octets. Cette propriété est omise lorsque `mode` est `'stream'`.
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur du vecteur d’initialisation attendue ou par défaut en octets. Cette propriété est omise si le chiffrement n’utilise pas de vecteur d’initialisation.
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur de clé attendue ou par défaut en octets.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le mode de chiffrement. Un parmi `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'ocb'`, `'ofb'`, `'stream'`, `'wrap'`, `'xts'`.



Retourne des informations sur un chiffrement donné.

Certains chiffrements acceptent des clés et des vecteurs d’initialisation de longueur variable. Par défaut, la méthode `crypto.getCipherInfo()` renvoie les valeurs par défaut pour ces chiffrements. Pour tester si une longueur de clé ou une longueur iv donnée est acceptable pour un chiffrement donné, utilisez les options `keyLength` et `ivLength`. Si les valeurs données ne sont pas acceptables, `undefined` sera renvoyé.


### `crypto.getCiphers()` {#cryptogetciphers}

**Ajouté dans : v0.9.3**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tableau avec les noms des algorithmes de chiffrement pris en charge.

::: code-group
```js [ESM]
const {
  getCiphers,
} = await import('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```

```js [CJS]
const {
  getCiphers,
} = require('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```
:::

### `crypto.getCurves()` {#cryptogetcurves}

**Ajouté dans : v2.3.0**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tableau avec les noms des courbes elliptiques prises en charge.

::: code-group
```js [ESM]
const {
  getCurves,
} = await import('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```

```js [CJS]
const {
  getCurves,
} = require('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```
:::

### `crypto.getDiffieHellman(groupName)` {#cryptogetdiffiehellmangroupname}

**Ajouté dans : v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<DiffieHellmanGroup\>](/fr/nodejs/api/crypto#class-diffiehellmangroup)

Crée un objet d'échange de clés `DiffieHellmanGroup` prédéfini. Les groupes pris en charge sont répertoriés dans la documentation de [`DiffieHellmanGroup`](/fr/nodejs/api/crypto#class-diffiehellmangroup).

L'objet retourné imite l'interface des objets créés par [`crypto.createDiffieHellman()`](/fr/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding), mais ne permettra pas de modifier les clés (avec [`diffieHellman.setPublicKey()`](/fr/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding), par exemple). L'avantage d'utiliser cette méthode est que les parties n'ont pas à générer ni à échanger un module de groupe au préalable, ce qui permet de gagner du temps de processeur et de communication.

Exemple (obtention d'un secret partagé) :

::: code-group
```js [ESM]
const {
  getDiffieHellman,
} = await import('node:crypto');
const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret et bobSecret devraient être identiques */
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  getDiffieHellman,
} = require('node:crypto');

const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret et bobSecret devraient être identiques */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**Ajouté dans : v10.0.0**

- Renvoie : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` si et seulement si un fournisseur de chiffrement conforme à la norme FIPS est actuellement utilisé, `0` sinon. Une future version semver majeure pourrait modifier le type de retour de cette API en [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `crypto.getHashes()` {#cryptogethashes}

**Ajouté dans : v0.9.3**

- Renvoie : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tableau des noms des algorithmes de hachage pris en charge, tels que `'RSA-SHA256'`. Les algorithmes de hachage sont également appelés algorithmes de "résumé".

::: code-group
```js [ESM]
const {
  getHashes,
} = await import('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```

```js [CJS]
const {
  getHashes,
} = require('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```
:::

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Ajouté dans : v17.4.0**

- `typedArray` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- Renvoie : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Renvoie `typedArray`.

Un alias pratique pour [`crypto.webcrypto.getRandomValues()`](/fr/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray). Cette implémentation n'est pas conforme à la spécification Web Crypto. Pour écrire du code compatible avec le Web, utilisez plutôt [`crypto.webcrypto.getRandomValues()`](/fr/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray).


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**Ajouté dans: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index).2 - Candidat à la publication
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Lorsque `data` est une chaîne de caractères, elle sera encodée en UTF-8 avant d'être hachée. Si un encodage d'entrée différent est souhaité pour une entrée de type chaîne de caractères, l'utilisateur peut encoder la chaîne de caractères dans un `TypedArray` en utilisant soit `TextEncoder`, soit `Buffer.from()` et en passant le `TypedArray` encodé dans cette API à la place.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)  [Encoding](/fr/nodejs/api/buffer#buffers-and-character-encodings) utilisé pour encoder le condensé retourné. **Par défaut:** `'hex'`.
- Retourne: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Un utilitaire pour créer des condensés de hachage ponctuels des données. Il peut être plus rapide que `crypto.createHash()` basé sur des objets lors du hachage d'une plus petite quantité de données (\<= 5MB) qui est facilement disponible. Si les données peuvent être volumineuses ou si elles sont diffusées en continu, il est toujours recommandé d'utiliser `crypto.createHash()` à la place.

L'`algorithm` dépend des algorithmes disponibles pris en charge par la version d'OpenSSL sur la plateforme. Les exemples sont `'sha256'`, `'sha512'`, etc. Sur les versions récentes d'OpenSSL, `openssl list -digest-algorithms` affichera les algorithmes de condensé disponibles.

Exemple:

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// Hacher une chaîne de caractères et renvoyer le résultat sous forme de chaîne encodée en hexadécimal.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Encoder une chaîne codée en base64 dans un Buffer, la hacher et renvoyer
// le résultat sous forme de tampon.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// Hacher une chaîne de caractères et renvoyer le résultat sous forme de chaîne encodée en hexadécimal.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Encoder une chaîne codée en base64 dans un Buffer, la hacher et renvoyer
// le résultat sous forme de tampon.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Transmettre un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v18.8.0, v16.18.0 | Le matériel de clé d'entrée peut maintenant avoir une longueur nulle. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'algorithme de condensé à utiliser.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) Le matériel de clé d'entrée. Doit être fourni mais peut être de longueur nulle.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) La valeur de sel. Doit être fournie mais peut être de longueur nulle.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Valeur d'informations supplémentaires. Doit être fournie mais peut être de longueur nulle, et ne peut pas dépasser 1024 octets.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur de la clé à générer. Doit être supérieur à 0. La valeur maximale autorisée est `255` fois le nombre d'octets produits par la fonction de condensé sélectionnée (par exemple, `sha512` génère des hachages de 64 octets, ce qui rend la sortie HKDF maximale de 16320 octets).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

HKDF est une fonction de dérivation de clé simple définie dans la RFC 5869. Les paramètres `ikm`, `salt` et `info` fournis sont utilisés avec le `digest` pour dériver une clé de `keylen` octets.

La fonction `callback` fournie est appelée avec deux arguments : `err` et `derivedKey`. Si une erreur se produit lors de la dérivation de la clé, `err` sera défini ; sinon, `err` sera `null`. La `derivedKey` générée avec succès sera transmise au callback en tant que [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Une erreur sera levée si l'un des arguments d'entrée spécifie des valeurs ou des types non valides.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdf,
} = await import('node:crypto');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```

```js [CJS]
const {
  hkdf,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```
:::


### `crypto.hkdfSync(digest, ikm, salt, info, keylen)` {#cryptohkdfsyncdigest-ikm-salt-info-keylen}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.8.0, v16.18.0 | Le matériel de clé d'entrée peut maintenant être de longueur nulle. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'algorithme de hachage à utiliser.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) Le matériel de clé d'entrée. Doit être fourni, mais peut être de longueur nulle.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) La valeur du sel. Doit être fourni, mais peut être de longueur nulle.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Valeur d'informations supplémentaires. Doit être fourni, mais peut être de longueur nulle et ne peut pas dépasser 1024 octets.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longueur de la clé à générer. Doit être supérieure à 0. La valeur maximale autorisée est `255` fois le nombre d'octets produits par la fonction de hachage sélectionnée (par exemple, `sha512` génère des hachages de 64 octets, ce qui rend la sortie HKDF maximale de 16320 octets).
- Retourne : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Fournit une fonction de dérivation de clé HKDF synchrone telle que définie dans la RFC 5869. Les `ikm`, `salt` et `info` donnés sont utilisés avec le `digest` pour dériver une clé de `keylen` octets.

La `derivedKey` générée avec succès sera renvoyée sous forme de [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

Une erreur sera levée si l'un des arguments d'entrée spécifie des valeurs ou des types non valides, ou si la clé dérivée ne peut pas être générée.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdfSync,
} = await import('node:crypto');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```

```js [CJS]
const {
  hkdfSync,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```
:::


### `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)` {#cryptopbkdf2password-salt-iterations-keylen-digest-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Les arguments password et salt peuvent également être des instances ArrayBuffer. |
| v14.0.0 | Le paramètre `iterations` est désormais limité aux valeurs positives. Les versions antérieures traitaient les autres valeurs comme étant égales à un. |
| v8.0.0 | Le paramètre `digest` est désormais toujours requis. |
| v6.0.0 | L'appel de cette fonction sans passer le paramètre `digest` est désormais obsolète et émettra un avertissement. |
| v6.0.0 | L'encodage par défaut de `password` s'il s'agit d'une chaîne est passé de `binary` à `utf8`. |
| v0.5.5 | Ajoutée dans : v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Fournit une implémentation asynchrone de Password-Based Key Derivation Function 2 (PBKDF2). Un algorithme de condensé HMAC sélectionné, spécifié par `digest`, est appliqué pour dériver une clé de la longueur d'octet demandée (`keylen`) à partir du `password`, du `salt` et des `iterations`.

La fonction `callback` fournie est appelée avec deux arguments : `err` et `derivedKey`. Si une erreur se produit lors de la dérivation de la clé, `err` sera définie ; sinon, `err` sera `null`. Par défaut, la `derivedKey` générée avec succès sera passée au rappel en tant que [`Buffer`](/fr/nodejs/api/buffer). Une erreur sera levée si l'un des arguments d'entrée spécifie des valeurs ou des types non valides.

L'argument `iterations` doit être un nombre aussi élevé que possible. Plus le nombre d'itérations est élevé, plus la clé dérivée sera sécurisée, mais plus le temps nécessaire pour la terminer sera long.

Le `salt` doit être aussi unique que possible. Il est recommandé qu'un sel soit aléatoire et d'une longueur d'au moins 16 octets. Voir [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) pour plus de détails.

Lorsque vous passez des chaînes pour `password` ou `salt`, veuillez prendre en compte les [mises en garde lors de l'utilisation de chaînes comme entrées des API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

::: code-group
```js [ESM]
const {
  pbkdf2,
} = await import('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```

```js [CJS]
const {
  pbkdf2,
} = require('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```
:::

Une liste des fonctions de hachage prises en charge peut être récupérée à l'aide de [`crypto.getHashes()`](/fr/nodejs/api/crypto#cryptogethashes).

Cette API utilise le pool de threads de libuv, ce qui peut avoir des implications surprenantes et négatives en termes de performances pour certaines applications ; consultez la documentation [`UV_THREADPOOL_SIZE`](/fr/nodejs/api/cli#uv_threadpool_sizesize) pour plus d'informations.


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Le paramètre `iterations` est maintenant limité aux valeurs positives. Les versions antérieures traitaient les autres valeurs comme un. |
| v6.0.0 | Appeler cette fonction sans passer le paramètre `digest` est maintenant déprécié et émettra un avertissement. |
| v6.0.0 | L'encodage par défaut pour `password` s'il s'agit d'une chaîne est passé de `binary` à `utf8`. |
| v0.9.3 | Ajouté dans : v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Fournit une implémentation synchrone de la fonction de dérivation de clé basée sur un mot de passe 2 (PBKDF2). Un algorithme de hachage HMAC sélectionné spécifié par `digest` est appliqué pour dériver une clé de la longueur d'octet demandée (`keylen`) à partir du `password`, du `salt` et des `iterations`.

Si une erreur se produit, une `Error` sera levée, sinon la clé dérivée sera retournée sous forme de [`Buffer`](/fr/nodejs/api/buffer).

L'argument `iterations` doit être un nombre défini aussi haut que possible. Plus le nombre d'itérations est élevé, plus la clé dérivée sera sécurisée, mais plus il faudra de temps pour terminer.

Le `salt` doit être aussi unique que possible. Il est recommandé qu'un salt soit aléatoire et d'au moins 16 octets. Voir [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) pour plus de détails.

Lors du passage de chaînes de caractères pour `password` ou `salt`, veuillez tenir compte des [mises en garde lors de l'utilisation de chaînes de caractères comme entrées aux API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

::: code-group
```js [ESM]
const {
  pbkdf2Sync,
} = await import('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```

```js [CJS]
const {
  pbkdf2Sync,
} = require('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```
:::

Un tableau de fonctions de hachage prises en charge peut être récupéré à l'aide de [`crypto.getHashes()`](/fr/nodejs/api/crypto#cryptogethashes).


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | Le remplissage `RSA_PKCS1_PADDING` a été désactivé, sauf si la build OpenSSL prend en charge le rejet implicite. |
| v15.0.0 | Ajout de string, ArrayBuffer et CryptoKey comme types de clés autorisés. Le oaepLabel peut être un ArrayBuffer. Le buffer peut être une string ou un ArrayBuffer. Tous les types qui acceptent les buffers sont limités à un maximum de 2 ** 31 - 1 octets. |
| v12.11.0 | L'option `oaepLabel` a été ajoutée. |
| v12.9.0 | L'option `oaepHash` a été ajoutée. |
| v11.6.0 | Cette fonction prend désormais en charge les objets key. |
| v0.11.14 | Ajoutée dans : v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La fonction de hachage à utiliser pour le remplissage OAEP et MGF1. **Par défaut :** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) L'étiquette à utiliser pour le remplissage OAEP. Si elle n'est pas spécifiée, aucune étiquette n'est utilisée.
    - `padding` [\<crypto.constants\>](/fr/nodejs/api/crypto#cryptoconstants) Une valeur de remplissage optionnelle définie dans `crypto.constants`, qui peut être : `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` ou `crypto.constants.RSA_PKCS1_OAEP_PADDING`.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Renvoie : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Un nouveau `Buffer` avec le contenu déchiffré.

Déchiffre `buffer` avec `privateKey`. `buffer` a été précédemment chiffré à l'aide de la clé publique correspondante, par exemple à l'aide de [`crypto.publicEncrypt()`](/fr/nodejs/api/crypto#cryptopublicencryptkey-buffer).

Si `privateKey` n'est pas un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), cette fonction se comporte comme si `privateKey` avait été passé à [`crypto.createPrivateKey()`](/fr/nodejs/api/crypto#cryptocreateprivatekeykey). Si c'est un objet, la propriété `padding` peut être passée. Sinon, cette fonction utilise `RSA_PKCS1_OAEP_PADDING`.

L'utilisation de `crypto.constants.RSA_PKCS1_PADDING` dans [`crypto.privateDecrypt()`](/fr/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) nécessite qu'OpenSSL prenne en charge le rejet implicite (`rsa_pkcs1_implicit_rejection`). Si la version d'OpenSSL utilisée par Node.js ne prend pas en charge cette fonctionnalité, toute tentative d'utilisation de `RSA_PKCS1_PADDING` échouera.


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Ajout de string, ArrayBuffer et CryptoKey comme types de clés autorisés. Le mot de passe peut être un ArrayBuffer. Le buffer peut être une string ou un ArrayBuffer. Tous les types qui acceptent les buffers sont limités à un maximum de 2 ** 31 - 1 octets. |
| v11.6.0 | Cette fonction prend désormais en charge les objets clés. |
| v1.1.0 | Ajoutée dans : v1.1.0 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) Une clé privée encodée en PEM.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un mot de passe optionnel pour la clé privée.
    - `padding` [\<crypto.constants\>](/fr/nodejs/api/crypto#cryptoconstants) Une valeur de remplissage optionnelle définie dans `crypto.constants`, qui peut être : `crypto.constants.RSA_NO_PADDING` ou `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de chaîne à utiliser lorsque `buffer`, `key` ou `passphrase` sont des chaînes.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Un nouveau `Buffer` avec le contenu chiffré.

Chiffre `buffer` avec `privateKey`. Les données renvoyées peuvent être déchiffrées à l'aide de la clé publique correspondante, par exemple en utilisant [`crypto.publicDecrypt()`](/fr/nodejs/api/crypto#cryptopublicdecryptkey-buffer).

Si `privateKey` n'est pas un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), cette fonction se comporte comme si `privateKey` avait été passé à [`crypto.createPrivateKey()`](/fr/nodejs/api/crypto#cryptocreateprivatekeykey). S'il s'agit d'un objet, la propriété `padding` peut être passée. Sinon, cette fonction utilise `RSA_PKCS1_PADDING`.


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Ajout de string, ArrayBuffer et CryptoKey comme types de clé autorisés. La phrase de passe peut être un ArrayBuffer. Le buffer peut être une string ou un ArrayBuffer. Tous les types qui acceptent les buffers sont limités à un maximum de 2 ** 31 - 1 octets. |
| v11.6.0 | Cette fonction prend désormais en charge les objets clés. |
| v1.1.0 | Ajouté dans : v1.1.0 |
:::

- `key` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Une phrase de passe facultative pour la clé privée.
    - `padding` [\<crypto.constants\>](/fr/nodejs/api/crypto#cryptoconstants) Une valeur de padding facultative définie dans `crypto.constants`, qui peut être : `crypto.constants.RSA_NO_PADDING` ou `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’encodage de string à utiliser lorsque `buffer`, `key` ou `passphrase` sont des strings.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Un nouveau `Buffer` avec le contenu déchiffré.

Déchiffre `buffer` avec `key`.`buffer` a été précédemment chiffré à l’aide de la clé privée correspondante, par exemple à l’aide de [`crypto.privateEncrypt()`](/fr/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer).

Si `key` n’est pas un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), cette fonction se comporte comme si `key` avait été passé à [`crypto.createPublicKey()`](/fr/nodejs/api/crypto#cryptocreatepublickeykey). S’il s’agit d’un objet, la propriété `padding` peut être passée. Sinon, cette fonction utilise `RSA_PKCS1_PADDING`.

Étant donné que les clés publiques RSA peuvent être dérivées de clés privées, une clé privée peut être transmise à la place d’une clé publique.


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Ajout de string, ArrayBuffer, et CryptoKey comme types de clés autorisés. oaepLabel et passphrase peuvent être des ArrayBuffers. Le buffer peut être une string ou un ArrayBuffer. Tous les types qui acceptent les buffers sont limités à un maximum de 2 ** 31 - 1 octets. |
| v12.11.0 | L'option `oaepLabel` a été ajoutée. |
| v12.9.0 | L'option `oaepHash` a été ajoutée. |
| v11.6.0 | Cette fonction prend désormais en charge les objets clés. |
| v0.11.14 | Ajoutée dans : v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey) Une clé publique ou privée encodée en PEM, [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject), ou [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey).
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La fonction de hachage à utiliser pour le remplissage OAEP et MGF1. **Par défaut :** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) L'étiquette à utiliser pour le remplissage OAEP. Si elle n'est pas spécifiée, aucune étiquette n'est utilisée.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Une phrase de passe facultative pour la clé privée.
    - `padding` [\<crypto.constants\>](/fr/nodejs/api/crypto#cryptoconstants) Une valeur de remplissage facultative définie dans `crypto.constants`, qui peut être : `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` ou `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de chaîne à utiliser lorsque `buffer`, `key`, `oaepLabel` ou `passphrase` sont des chaînes.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Un nouveau `Buffer` avec le contenu chiffré.

Chiffre le contenu de `buffer` avec `key` et renvoie un nouveau [`Buffer`](/fr/nodejs/api/buffer) avec le contenu chiffré. Les données retournées peuvent être déchiffrées à l'aide de la clé privée correspondante, par exemple à l'aide de [`crypto.privateDecrypt()`](/fr/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer).

Si `key` n'est pas un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), cette fonction se comporte comme si `key` avait été passé à [`crypto.createPublicKey()`](/fr/nodejs/api/crypto#cryptocreatepublickeykey). Si c'est un objet, la propriété `padding` peut être passée. Sinon, cette fonction utilise `RSA_PKCS1_OAEP_PADDING`.

Étant donné que les clés publiques RSA peuvent être dérivées des clés privées, une clé privée peut être passée à la place d'une clé publique.


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v9.0.0 | Passer `null` comme argument `callback` lève désormais `ERR_INVALID_CALLBACK`. |
| v0.5.8 | Ajoutée dans : v0.5.8 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets à générer. La `size` ne doit pas être supérieure à `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) si la fonction `callback` n'est pas fournie.

Génère des données pseudo-aléatoires cryptographiquement robustes. L'argument `size` est un nombre indiquant le nombre d'octets à générer.

Si une fonction `callback` est fournie, les octets sont générés de manière asynchrone et la fonction `callback` est invoquée avec deux arguments : `err` et `buf`. Si une erreur se produit, `err` sera un objet `Error` ; sinon, il sera `null`. L'argument `buf` est un [`Buffer`](/fr/nodejs/api/buffer) contenant les octets générés.

::: code-group
```js [ESM]
// Asynchrone
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} octets de données aléatoires : ${buf.toString('hex')}`);
});
```

```js [CJS]
// Asynchrone
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} octets de données aléatoires : ${buf.toString('hex')}`);
});
```
:::

Si la fonction `callback` n'est pas fournie, les octets aléatoires sont générés de manière synchrone et renvoyés sous forme de [`Buffer`](/fr/nodejs/api/buffer). Une erreur sera levée s'il y a un problème lors de la génération des octets.

::: code-group
```js [ESM]
// Synchrone
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} octets de données aléatoires : ${buf.toString('hex')}`);
```

```js [CJS]
// Synchrone
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} octets de données aléatoires : ${buf.toString('hex')}`);
```
:::

La méthode `crypto.randomBytes()` ne se terminera pas tant qu'il n'y aura pas suffisamment d'entropie disponible. Cela ne devrait normalement jamais prendre plus de quelques millisecondes. Le seul moment où la génération des octets aléatoires peut vraisemblablement bloquer pendant une période plus longue est juste après le démarrage, lorsque l'ensemble du système est encore pauvre en entropie.

Cette API utilise le pool de threads de libuv, ce qui peut avoir des implications de performances surprenantes et négatives pour certaines applications ; voir la documentation [`UV_THREADPOOL_SIZE`](/fr/nodejs/api/cli#uv_threadpool_sizesize) pour plus d'informations.

La version asynchrone de `crypto.randomBytes()` est effectuée dans une seule requête du pool de threads. Pour minimiser la variation de la longueur des tâches du pool de threads, partitionnez les grandes requêtes `randomBytes` lorsque vous le faites dans le cadre de l'exécution d'une requête client.


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Envoyer un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v9.0.0 | L'argument `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v7.10.0, v6.13.0 | Ajouté dans : v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Doit être fourni. La taille du `buffer` fourni ne doit pas être supérieure à `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `buffer.length - offset`. La `size` ne doit pas être supérieure à `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

Cette fonction est similaire à [`crypto.randomBytes()`](/fr/nodejs/api/crypto#cryptorandombytessize-callback) mais exige que le premier argument soit un [`Buffer`](/fr/nodejs/api/buffer) qui sera rempli. Elle exige également qu'un rappel soit transmis.

Si la fonction `callback` n'est pas fournie, une erreur sera levée.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// Ce qui précède équivaut à :
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// Ce qui précède équivaut à :
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

Toute instance `ArrayBuffer`, `TypedArray` ou `DataView` peut être passée en tant que `buffer`.

Bien que cela inclue des instances de `Float32Array` et `Float64Array`, cette fonction ne doit pas être utilisée pour générer des nombres à virgule flottante aléatoires. Le résultat peut contenir `+Infinity`, `-Infinity` et `NaN`, et même si le tableau ne contient que des nombres finis, ils ne sont pas tirés d'une distribution aléatoire uniforme et n'ont pas de limites inférieure ou supérieure significatives.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```
:::

Cette API utilise le threadpool de libuv, ce qui peut avoir des implications de performance surprenantes et négatives pour certaines applications ; consultez la documentation [`UV_THREADPOOL_SIZE`](/fr/nodejs/api/cli#uv_threadpool_sizesize) pour plus d'informations.

La version asynchrone de `crypto.randomFill()` est exécutée dans une seule requête de threadpool. Pour minimiser la variation de la longueur des tâches du threadpool, partitionnez les grandes requêtes `randomFill` lorsque vous le faites dans le cadre de l'exécution d'une requête client.


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | L'argument `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v7.10.0, v6.13.0 | Ajouté dans : v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Doit être fourni. La taille du `buffer` fourni ne doit pas dépasser `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `buffer.length - offset`. La `size` ne doit pas être supérieure à `2**31 - 1`.
- Retourne : [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) L'objet passé en tant qu'argument `buffer`.

Version synchrone de [`crypto.randomFill()`](/fr/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// Ce qui précède est équivalent à :
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// Ce qui précède est équivalent à :
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

N'importe quelle instance `ArrayBuffer`, `TypedArray` ou `DataView` peut être passée en tant que `buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```
:::


### `crypto.randomInt([min, ]max[, callback])` {#cryptorandomintmin-max-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v14.10.0, v12.19.0 | Ajouté dans : v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Début de la plage aléatoire (inclus). **Par défaut :** `0`.
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Fin de la plage aléatoire (exclus).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`.

Renvoie un entier aléatoire `n` tel que `min \<= n \< max`. Cette implémentation évite le [biais de modulo](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).

La plage (`max - min`) doit être inférieure à 2. `min` et `max` doivent être des [entiers sûrs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

Si la fonction `callback` n'est pas fournie, l'entier aléatoire est généré de manière synchrone.

::: code-group
```js [ESM]
// Asynchrone
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Nombre aléatoire choisi parmi (0, 1, 2) : ${n}`);
});
```

```js [CJS]
// Asynchrone
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Nombre aléatoire choisi parmi (0, 1, 2) : ${n}`);
});
```
:::

::: code-group
```js [ESM]
// Synchrone
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Nombre aléatoire choisi parmi (0, 1, 2) : ${n}`);
```

```js [CJS]
// Synchrone
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Nombre aléatoire choisi parmi (0, 1, 2) : ${n}`);
```
:::

::: code-group
```js [ESM]
// Avec l'argument `min`
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`Le dé a roulé : ${n}`);
```

```js [CJS]
// Avec l'argument `min`
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`Le dé a roulé : ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**Ajouté dans : v15.6.0, v14.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Par défaut, pour améliorer les performances, Node.js génère et met en cache suffisamment de données aléatoires pour générer jusqu'à 128 UUID aléatoires. Pour générer un UUID sans utiliser le cache, définissez `disableEntropyCache` sur `true`. **Par défaut :** `false`.


- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Génère un UUID aléatoire de version 4 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt). L'UUID est généré à l'aide d'un générateur de nombres pseudo-aléatoires cryptographiques.

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Les arguments password et salt peuvent également être des instances ArrayBuffer. |
| v12.8.0, v10.17.0 | La valeur `maxmem` peut maintenant être n'importe quel entier sûr. |
| v10.9.0 | Les noms d'option `cost`, `blockSize` et `parallelization` ont été ajoutés. |
| v10.5.0 | Ajouté dans : v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre de coût CPU/mémoire. Doit être une puissance de deux supérieure à un. **Par défaut :** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre de taille de bloc. **Par défaut :** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre de parallélisation. **Par défaut :** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias pour `cost`. Un seul des deux peut être spécifié.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias pour `blockSize`. Un seul des deux peut être spécifié.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias pour `parallelization`. Un seul des deux peut être spécifié.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limite supérieure de la mémoire. Une erreur se produit lorsque (approximativement) `128 * N * r > maxmem`. **Par défaut :** `32 * 1024 * 1024`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)



Fournit une implémentation asynchrone de [scrypt](https://en.wikipedia.org/wiki/Scrypt). Scrypt est une fonction de dérivation de clé basée sur un mot de passe qui est conçue pour être coûteuse en termes de calcul et de mémoire afin de rendre les attaques par force brute non rentables.

Le `salt` doit être aussi unique que possible. Il est recommandé qu'un sel soit aléatoire et d'une longueur d'au moins 16 octets. Voir [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) pour plus de détails.

Lorsque vous passez des chaînes de caractères pour `password` ou `salt`, veuillez tenir compte des [mises en garde lors de l'utilisation de chaînes de caractères comme entrées des API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

La fonction `callback` est appelée avec deux arguments : `err` et `derivedKey`. `err` est un objet d'exception lorsque la dérivation de clé échoue, sinon `err` est `null`. `derivedKey` est passé au callback en tant que [`Buffer`](/fr/nodejs/api/buffer).

Une exception est levée lorsque l'un des arguments d'entrée spécifie des valeurs ou des types non valides.



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// Utilisation des paramètres d'usine par défaut.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Utilisation d'un paramètre N personnalisé. Doit être une puissance de deux.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// Utilisation des paramètres d'usine par défaut.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Utilisation d'un paramètre N personnalisé. Doit être une puissance de deux.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::

### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.8.0, v10.17.0 | La valeur `maxmem` peut maintenant être n'importe quel entier sûr. |
| v10.9.0 | Les noms d'option `cost`, `blockSize` et `parallelization` ont été ajoutés. |
| v10.5.0 | Ajouté dans : v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre de coût CPU/mémoire. Doit être une puissance de deux supérieure à un. **Par défaut :** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre de taille de bloc. **Par défaut :** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre de parallélisation. **Par défaut :** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias pour `cost`. Un seul des deux peut être spécifié.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias pour `blockSize`. Un seul des deux peut être spécifié.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias pour `parallelization`. Un seul des deux peut être spécifié.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limite supérieure de la mémoire. C'est une erreur lorsque (approximativement) `128 * N * r \> maxmem`. **Par défaut :** `32 * 1024 * 1024`.

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Fournit une implémentation [scrypt](https://en.wikipedia.org/wiki/Scrypt) synchrone. Scrypt est une fonction de dérivation de clé basée sur un mot de passe qui est conçue pour être coûteuse en termes de calcul et de mémoire afin de rendre les attaques par force brute non rentables.

Le `salt` doit être aussi unique que possible. Il est recommandé qu'un salt soit aléatoire et d'au moins 16 octets. Voir [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) pour plus de détails.

Lorsque vous passez des chaînes pour `password` ou `salt`, veuillez tenir compte des [mises en garde lors de l'utilisation de chaînes comme entrées aux API cryptographiques](/fr/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Une exception est levée lorsque la dérivation de clé échoue, sinon la clé dérivée est renvoyée sous forme de [`Buffer`](/fr/nodejs/api/buffer).

Une exception est levée lorsque l'un des arguments d'entrée spécifie des valeurs ou des types non valides.

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// Utilisation des valeurs par défaut de l'usine.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Utilisation d'un paramètre N personnalisé. Doit être une puissance de deux.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// Utilisation des valeurs par défaut de l'usine.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Utilisation d'un paramètre N personnalisé. Doit être une puissance de deux.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::


### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Ajouté dans: v15.6.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille totale du tas sécurisé alloué, telle que spécifiée à l'aide de l'indicateur de ligne de commande `--secure-heap=n`.
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'allocation minimale à partir du tas sécurisé, telle que spécifiée à l'aide de l'indicateur de ligne de commande `--secure-heap-min`.
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre total d'octets actuellement alloués à partir du tas sécurisé.
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le ratio calculé entre `used` et le nombre total d'octets alloués.

### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | La prise en charge des moteurs personnalisés dans OpenSSL 3 est dépréciée. |
| v0.11.11 | Ajouté dans: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/fr/nodejs/api/crypto#cryptoconstants) **Par défaut :** `crypto.constants.ENGINE_METHOD_ALL`

Charge et définit le `engine` pour certaines ou toutes les fonctions OpenSSL (sélectionnées par les flags). La prise en charge des moteurs personnalisés dans OpenSSL est obsolète à partir d'OpenSSL 3.

`engine` peut être soit un identifiant, soit un chemin d'accès à la bibliothèque partagée du moteur.

L'argument optionnel `flags` utilise `ENGINE_METHOD_ALL` par défaut. `flags` est un champ de bits prenant l'un ou un mélange des flags suivants (définis dans `crypto.constants`) :

- `crypto.constants.ENGINE_METHOD_RSA`
- `crypto.constants.ENGINE_METHOD_DSA`
- `crypto.constants.ENGINE_METHOD_DH`
- `crypto.constants.ENGINE_METHOD_RAND`
- `crypto.constants.ENGINE_METHOD_EC`
- `crypto.constants.ENGINE_METHOD_CIPHERS`
- `crypto.constants.ENGINE_METHOD_DIGESTS`
- `crypto.constants.ENGINE_METHOD_PKEY_METHS`
- `crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS`
- `crypto.constants.ENGINE_METHOD_ALL`
- `crypto.constants.ENGINE_METHOD_NONE`


### `crypto.setFips(bool)` {#cryptosetfipsbool}

**Ajouté dans : v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` pour activer le mode FIPS.

Active le fournisseur de chiffrement conforme FIPS dans une build Node.js compatible FIPS. Génère une erreur si le mode FIPS n'est pas disponible.

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Argument de rappel optionnel ajouté. |
| v13.2.0, v12.16.0 | Cette fonction prend désormais en charge les signatures DSA et ECDSA IEEE-P1363. |
| v12.0.0 | Ajouté dans : v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
  
 
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) si la fonction `callback` n'est pas fournie.

Calcule et renvoie la signature de `data` en utilisant la clé privée et l'algorithme donnés. Si `algorithm` est `null` ou `undefined`, l'algorithme dépend du type de clé (en particulier Ed25519 et Ed448).

Si `key` n'est pas un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), cette fonction se comporte comme si `key` avait été passé à [`crypto.createPrivateKey()`](/fr/nodejs/api/crypto#cryptocreateprivatekeykey). S'il s'agit d'un objet, les propriétés supplémentaires suivantes peuvent être passées :

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pour DSA et ECDSA, cette option spécifie le format de la signature générée. Elle peut être l'une des suivantes :
    - `'der'` (par défaut) : Structure de signature ASN.1 codée en DER codant `(r, s)`.
    - `'ieee-p1363'` : Format de signature `r || s` tel que proposé dans IEEE-P1363.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valeur de remplissage optionnelle pour RSA, l'une des suivantes :
    - `crypto.constants.RSA_PKCS1_PADDING` (par défaut)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` utilise MGF1 avec la même fonction de hachage que celle utilisée pour signer le message, comme spécifié dans la section 3.1 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur du sel lorsque le remplissage est `RSA_PKCS1_PSS_PADDING`. La valeur spéciale `crypto.constants.RSA_PSS_SALTLEN_DIGEST` définit la longueur du sel sur la taille du condensé, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (par défaut) la définit sur la valeur maximale autorisée.

Si la fonction `callback` est fournie, cette fonction utilise le pool de threads de libuv.


### `crypto.subtle` {#cryptosubtle}

**Ajouté dans : v17.4.0**

- Type : [\<SubtleCrypto\>](/fr/nodejs/api/webcrypto#class-subtlecrypto)

Un alias pratique pour [`crypto.webcrypto.subtle`](/fr/nodejs/api/webcrypto#class-subtlecrypto).

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Les arguments a et b peuvent également être des ArrayBuffer. |
| v6.6.0 | Ajouté dans : v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette fonction compare les octets sous-jacents qui représentent les instances `ArrayBuffer`, `TypedArray` ou `DataView` données en utilisant un algorithme à temps constant.

Cette fonction ne divulgue pas d'informations de synchronisation qui permettraient à un attaquant de deviner l'une des valeurs. Elle est adaptée à la comparaison de digests HMAC ou de valeurs secrètes telles que les cookies d'authentification ou les [URL de capacité](https://www.w3.org/TR/capability-urls/).

`a` et `b` doivent tous deux être des `Buffer`s, des `TypedArray`s ou des `DataView`s, et ils doivent avoir la même longueur d'octet. Une erreur est levée si `a` et `b` ont des longueurs d'octet différentes.

Si au moins un des `a` et `b` est un `TypedArray` avec plus d'un octet par entrée, tel que `Uint16Array`, le résultat sera calculé en utilisant l'ordre des octets de la plateforme.

**Lorsque les deux entrées sont des <code>Float32Array</code>s ou des
<code>Float64Array</code>s, cette fonction peut renvoyer des résultats inattendus en raison de l'encodage IEEE 754
des nombres à virgule flottante. En particulier, ni <code>x === y</code> ni
<code>Object.is(x, y)</code> n'impliquent que les représentations en octets de deux nombres à virgule flottante
<code>x</code> et <code>y</code> sont égales.**

L'utilisation de `crypto.timingSafeEqual` ne garantit pas que le code *environnant* est sécurisé en termes de synchronisation. Il faut veiller à ce que le code environnant n'introduise pas de vulnérabilités liées à la synchronisation.


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [Historique]
| Version | Modifications |
|---|---|
| v18.0.0 | Transmettre un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Argument callback optionnel ajouté. |
| v15.0.0 | Les arguments data, key et signature peuvent également être des ArrayBuffer. |
| v13.2.0, v12.16.0 | Cette fonction prend désormais en charge les signatures DSA et ECDSA IEEE-P1363. |
| v12.0.0 | Ajoutée dans : v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/fr/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/fr/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` ou `false` selon la validité de la signature pour les données et la clé publique si la fonction `callback` n'est pas fournie.

Vérifie la signature donnée pour `data` en utilisant la clé et l'algorithme donnés. Si `algorithm` est `null` ou `undefined`, alors l'algorithme dépend du type de clé (en particulier Ed25519 et Ed448).

Si `key` n'est pas un [`KeyObject`](/fr/nodejs/api/crypto#class-keyobject), cette fonction se comporte comme si `key` avait été passé à [`crypto.createPublicKey()`](/fr/nodejs/api/crypto#cryptocreatepublickeykey). S'il s'agit d'un objet, les propriétés supplémentaires suivantes peuvent être passées :

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Pour DSA et ECDSA, cette option spécifie le format de la signature. Elle peut être l'une des suivantes :
    - `'der'` (par défaut) : structure de signature ASN.1 encodée en DER encodant `(r, s)`.
    - `'ieee-p1363'` : format de signature `r || s` tel que proposé dans IEEE-P1363.

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valeur de remplissage optionnelle pour RSA, l'une des suivantes :
    - `crypto.constants.RSA_PKCS1_PADDING` (par défaut)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` utilisera MGF1 avec la même fonction de hachage utilisée pour signer le message comme spécifié dans la section 3.1 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longueur du sel lorsque le remplissage est `RSA_PKCS1_PSS_PADDING`. La valeur spéciale `crypto.constants.RSA_PSS_SALTLEN_DIGEST` définit la longueur du sel sur la taille du condensé, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (par défaut) la définit sur la valeur maximale autorisée.

L'argument `signature` est la signature précédemment calculée pour les `data`.

Étant donné que les clés publiques peuvent être dérivées de clés privées, une clé privée ou une clé publique peut être passée pour `key`.

Si la fonction `callback` est fournie, cette fonction utilise le pool de threads de libuv.


### `crypto.webcrypto` {#cryptowebcrypto}

**Ajouté dans : v15.0.0**

Type : [\<Crypto\>](/fr/nodejs/api/webcrypto#class-crypto) Une implémentation de la norme Web Crypto API.

Voir la [documentation de l'API Web Crypto](/fr/nodejs/api/webcrypto) pour plus de détails.

## Notes {#notes}

### Utilisation de chaînes de caractères comme entrées des API cryptographiques {#using-strings-as-inputs-to-cryptographic-apis}

Pour des raisons historiques, de nombreuses API cryptographiques fournies par Node.js acceptent des chaînes de caractères comme entrées alors que l'algorithme cryptographique sous-jacent fonctionne sur des séquences d'octets. Ces instances incluent les textes bruts, les textes chiffrés, les clés symétriques, les vecteurs d'initialisation, les mots de passe, les sels, les balises d'authentification et les données authentifiées supplémentaires.

Lorsque vous passez des chaînes de caractères aux API cryptographiques, tenez compte des facteurs suivants.

- Toutes les séquences d'octets ne sont pas des chaînes UTF-8 valides. Par conséquent, lorsqu'une séquence d'octets de longueur `n` est dérivée d'une chaîne de caractères, son entropie est généralement inférieure à l'entropie d'une séquence d'octets `n` aléatoire ou pseudo-aléatoire. Par exemple, aucune chaîne UTF-8 ne donnera la séquence d'octets `c0 af`. Les clés secrètes devraient presque exclusivement être des séquences d'octets aléatoires ou pseudo-aléatoires.
- De même, lors de la conversion de séquences d'octets aléatoires ou pseudo-aléatoires en chaînes UTF-8, les sous-séquences qui ne représentent pas des points de code valides peuvent être remplacées par le caractère de remplacement Unicode (`U+FFFD`). La représentation en octets de la chaîne Unicode résultante peut donc ne pas être égale à la séquence d'octets à partir de laquelle la chaîne a été créée. Les sorties des chiffrements, des fonctions de hachage, des algorithmes de signature et des fonctions de dérivation de clé sont des séquences d'octets pseudo-aléatoires et ne doivent pas être utilisées comme chaînes Unicode.
- Lorsque les chaînes de caractères sont obtenues à partir d'une saisie utilisateur, certains caractères Unicode peuvent être représentés de plusieurs manières équivalentes qui donnent des séquences d'octets différentes. Par exemple, lors du passage d'un mot de passe utilisateur à une fonction de dérivation de clé, telle que PBKDF2 ou scrypt, le résultat de la fonction de dérivation de clé dépend du fait que la chaîne utilise des caractères composés ou décomposés. Node.js ne normalise pas les représentations de caractères. Les développeurs devraient envisager d'utiliser [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) sur les saisies utilisateur avant de les transmettre aux API cryptographiques.


### API des flux hérités (antérieur à Node.js 0.10) {#legacy-streams-api-prior-to-nodejs-010}

Le module Crypto a été ajouté à Node.js avant qu'il n'y ait le concept d'une API de flux unifiée, et avant qu'il n'y ait des objets [`Buffer`](/fr/nodejs/api/buffer) pour gérer les données binaires. De ce fait, de nombreuses classes `crypto` ont des méthodes que l'on ne trouve généralement pas dans d'autres classes Node.js qui implémentent l'API des [flux](/fr/nodejs/api/stream) (par exemple, `update()`, `final()` ou `digest()`). De plus, de nombreuses méthodes acceptaient et renvoyaient des chaînes encodées en `'latin1'` par défaut plutôt que des `Buffer`s. Cette valeur par défaut a été modifiée après Node.js v0.8 pour utiliser les objets [`Buffer`](/fr/nodejs/api/buffer) par défaut à la place.

### Prise en charge des algorithmes faibles ou compromis {#support-for-weak-or-compromised-algorithms}

Le module `node:crypto` prend toujours en charge certains algorithmes qui sont déjà compromis et dont l'utilisation n'est pas recommandée. L'API permet également l'utilisation de chiffrements et de hachages avec une petite taille de clé qui sont trop faibles pour une utilisation sûre.

Les utilisateurs doivent assumer l'entière responsabilité de la sélection de l'algorithme de chiffrement et de la taille de la clé en fonction de leurs exigences de sécurité.

Sur la base des recommandations de [NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf) :

- MD5 et SHA-1 ne sont plus acceptables lorsque la résistance aux collisions est requise, comme pour les signatures numériques.
- Il est recommandé que la clé utilisée avec les algorithmes RSA, DSA et DH ait au moins 2 048 bits et que celle de la courbe d'ECDSA et d'ECDH ait au moins 224 bits, pour une utilisation sûre pendant plusieurs années.
- Les groupes DH de `modp1`, `modp2` et `modp5` ont une taille de clé inférieure à 2048 bits et ne sont pas recommandés.

Consultez la référence pour d'autres recommandations et détails.

Certains algorithmes qui ont des faiblesses connues et qui sont peu pertinents en pratique ne sont disponibles que via le [fournisseur hérité](/fr/nodejs/api/cli#--openssl-legacy-provider), qui n'est pas activé par défaut.

### Mode CCM {#ccm-mode}

CCM est l'un des [algorithmes AEAD](https://en.wikipedia.org/wiki/Authenticated_encryption) pris en charge. Les applications qui utilisent ce mode doivent respecter certaines restrictions lors de l'utilisation de l'API de chiffrement :

- La longueur de la balise d'authentification doit être spécifiée lors de la création du chiffrement en définissant l'option `authTagLength` et doit être de 4, 6, 8, 10, 12, 14 ou 16 octets.
- La longueur du vecteur d'initialisation (nonce) `N` doit être comprise entre 7 et 13 octets (`7 ≤ N ≤ 13`).
- La longueur du texte en clair est limitée à `2 ** (8 * (15 - N))` octets.
- Lors du déchiffrement, la balise d'authentification doit être définie via `setAuthTag()` avant d'appeler `update()`. Sinon, le déchiffrement échouera et `final()` lèvera une erreur conformément à la section 2.6 de [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt).
- L'utilisation de méthodes de flux telles que `write(data)`, `end(data)` ou `pipe()` en mode CCM peut échouer car CCM ne peut pas gérer plus d'un bloc de données par instance.
- Lors de la transmission de données authentifiées supplémentaires (AAD), la longueur du message réel en octets doit être transmise à `setAAD()` via l'option `plaintextLength`. De nombreuses bibliothèques de chiffrement incluent la balise d'authentification dans le texte chiffré, ce qui signifie qu'elles produisent des textes chiffrés de la longueur `plaintextLength + authTagLength`. Node.js n'inclut pas la balise d'authentification, la longueur du texte chiffré est donc toujours `plaintextLength`. Cela n'est pas nécessaire si aucun AAD n'est utilisé.
- Étant donné que CCM traite l'intégralité du message en une seule fois, `update()` doit être appelé exactement une fois.
- Même si l'appel de `update()` suffit pour chiffrer/déchiffrer le message, les applications *doivent* appeler `final()` pour calculer ou vérifier la balise d'authentification.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = await import('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```

```js [CJS]
const { Buffer } = require('node:buffer');
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```
:::


### Mode FIPS {#fips-mode}

Lors de l'utilisation d'OpenSSL 3, Node.js prend en charge FIPS 140-2 lorsqu'il est utilisé avec un fournisseur OpenSSL 3 approprié, tel que le [fournisseur FIPS d'OpenSSL 3](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider) qui peut être installé en suivant les instructions du [fichier README FIPS d'OpenSSL](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md).

Pour la prise en charge FIPS dans Node.js, vous aurez besoin de :

- Un fournisseur FIPS OpenSSL 3 correctement installé.
- Un [fichier de configuration du module FIPS](https://www.openssl.org/docs/man3.0/man5/fips_config) OpenSSL 3.
- Un fichier de configuration OpenSSL 3 qui référence le fichier de configuration du module FIPS.

Node.js devra être configuré avec un fichier de configuration OpenSSL qui pointe vers le fournisseur FIPS. Un exemple de fichier de configuration ressemble à ceci :

```text [TEXT]
nodejs_conf = nodejs_init

.include /<chemin absolu>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# Le nom de la section fips doit correspondre au nom de la section à l'intérieur du {#the-fips-section-name-should-match-the-section-name-inside-the}
# fichier fipsmodule.cnf inclus.
fips = fips_sect

[default_sect]
activate = 1
```
où `fipsmodule.cnf` est le fichier de configuration du module FIPS généré à partir de l'étape d'installation du fournisseur FIPS :

```bash [BASH]
openssl fipsinstall
```
Définissez la variable d'environnement `OPENSSL_CONF` pour pointer vers votre fichier de configuration et `OPENSSL_MODULES` vers l'emplacement de la bibliothèque dynamique du fournisseur FIPS. Par exemple :

```bash [BASH]
export OPENSSL_CONF=/<chemin vers le fichier de configuration>/nodejs.cnf
export OPENSSL_MODULES=/<chemin vers la bibliothèque openssl>/ossl-modules
```
Le mode FIPS peut ensuite être activé dans Node.js soit :

- En démarrant Node.js avec les indicateurs de ligne de commande `--enable-fips` ou `--force-fips`.
- En appelant par programmation `crypto.setFips(true)`.

En option, le mode FIPS peut être activé dans Node.js via le fichier de configuration OpenSSL. Par exemple :

```text [TEXT]
nodejs_conf = nodejs_init

.include /<chemin absolu>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# Le nom de la section fips doit correspondre au nom de la section à l'intérieur du {#included-fipsmodulecnf}
# fichier fipsmodule.cnf inclus.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## Constantes Crypto {#the-fips-section-name-should-match-the-section-name-inside-the_1}

Les constantes suivantes exportées par `crypto.constants` s'appliquent à diverses utilisations des modules `node:crypto`, `node:tls` et `node:https` et sont généralement spécifiques à OpenSSL.

### Options OpenSSL {#included-fipsmodulecnf_1}

Consultez la [liste des indicateurs SSL OP](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options) pour plus de détails.

| Constante | Description |
| --- | --- |
| `SSL_OP_ALL` | Applique plusieurs correctifs de bogues dans OpenSSL. Voir       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html)       pour plus de détails. |
| `SSL_OP_ALLOW_NO_DHE_KEX` | Indique à OpenSSL d'autoriser un mode d'échange de clés non basé sur [EC]DHE     pour TLS v1.3 |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | Autorise une renégociation héritée non sécurisée entre OpenSSL et des     clients ou serveurs non corrigés. Voir       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html)  . |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | Tente d'utiliser les préférences du serveur au lieu de celles du client lors de la     sélection d'un chiffrement. Le comportement dépend de la version du protocole. Voir       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html)  . |
| `SSL_OP_CISCO_ANYCONNECT` | Indique à OpenSSL d'utiliser l'identifiant de version Cisco de DTLS_BAD_VER. |
| `SSL_OP_COOKIE_EXCHANGE` | Indique à OpenSSL d'activer l'échange de cookies. |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | Indique à OpenSSL d'ajouter une extension server-hello d'une ancienne version     du brouillon cryptopro. |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | Indique à OpenSSL de désactiver un correctif de vulnérabilité SSL 3.0/TLS 1.0     ajouté dans OpenSSL 0.9.6d. |
| `SSL_OP_LEGACY_SERVER_CONNECT` | Permet la connexion initiale aux serveurs qui ne prennent pas en charge RI. |
| `SSL_OP_NO_COMPRESSION` | Indique à OpenSSL de désactiver la prise en charge de la compression SSL/TLS. |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | Indique à OpenSSL de désactiver encrypt-then-MAC. |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | Indique à OpenSSL de désactiver la renégociation. |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | Indique à OpenSSL de toujours démarrer une nouvelle session lors de la     renégociation. |
| `SSL_OP_NO_SSLv2` | Indique à OpenSSL de désactiver SSL v2 |
| `SSL_OP_NO_SSLv3` | Indique à OpenSSL de désactiver SSL v3 |
| `SSL_OP_NO_TICKET` | Indique à OpenSSL de désactiver l'utilisation des tickets RFC4507bis. |
| `SSL_OP_NO_TLSv1` | Indique à OpenSSL de désactiver TLS v1 |
| `SSL_OP_NO_TLSv1_1` | Indique à OpenSSL de désactiver TLS v1.1 |
| `SSL_OP_NO_TLSv1_2` | Indique à OpenSSL de désactiver TLS v1.2 |
| `SSL_OP_NO_TLSv1_3` | Indique à OpenSSL de désactiver TLS v1.3 |
| `SSL_OP_PRIORITIZE_CHACHA` | Indique au serveur OpenSSL de donner la priorité à ChaCha20-Poly1305     lorsque le client le fait.     Cette option n'a aucun effet si       `SSL_OP_CIPHER_SERVER_PREFERENCE`       n'est pas activé. |
| `SSL_OP_TLS_ROLLBACK_BUG` | Indique à OpenSSL de désactiver la détection des attaques de restauration de version. |

### Constantes de moteur OpenSSL {#crypto-constants}

| Constante | Description |
| --- | --- |
| `ENGINE_METHOD_RSA` | Limiter l'utilisation du moteur à RSA |
| `ENGINE_METHOD_DSA` | Limiter l'utilisation du moteur à DSA |
| `ENGINE_METHOD_DH` | Limiter l'utilisation du moteur à DH |
| `ENGINE_METHOD_RAND` | Limiter l'utilisation du moteur à RAND |
| `ENGINE_METHOD_EC` | Limiter l'utilisation du moteur à EC |
| `ENGINE_METHOD_CIPHERS` | Limiter l'utilisation du moteur à CIPHERS |
| `ENGINE_METHOD_DIGESTS` | Limiter l'utilisation du moteur à DIGESTS |
| `ENGINE_METHOD_PKEY_METHS` | Limiter l'utilisation du moteur à PKEY_METHS |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | Limiter l'utilisation du moteur à PKEY_ASN1_METHS |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### Autres constantes OpenSSL {#openssl-options}

| Constante | Description |
| --- | --- |
| `DH_CHECK_P_NOT_SAFE_PRIME` ||
| `DH_CHECK_P_NOT_PRIME` ||
| `DH_UNABLE_TO_CHECK_GENERATOR` ||
| `DH_NOT_SUITABLE_GENERATOR` ||
| `RSA_PKCS1_PADDING` ||
| `RSA_SSLV23_PADDING` ||
| `RSA_NO_PADDING` ||
| `RSA_PKCS1_OAEP_PADDING` ||
| `RSA_X931_PADDING` ||
| `RSA_PKCS1_PSS_PADDING` ||
| `RSA_PSS_SALTLEN_DIGEST` | Définit la longueur du sel pour `RSA_PKCS1_PSS_PADDING` à la taille du condensat lors de la signature ou de la vérification. |
| `RSA_PSS_SALTLEN_MAX_SIGN` | Définit la longueur du sel pour `RSA_PKCS1_PSS_PADDING` à la valeur maximale autorisée lors de la signature des données. |
| `RSA_PSS_SALTLEN_AUTO` | Permet de déterminer automatiquement la longueur du sel pour `RSA_PKCS1_PSS_PADDING` lors de la vérification d'une signature. |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Constantes crypto Node.js {#openssl-engine-constants}

| Constante | Description |
| --- | --- |
| `defaultCoreCipherList` | Spécifie la liste de chiffrement par défaut intégrée utilisée par Node.js. |
| `defaultCipherList` | Spécifie la liste de chiffrement par défaut active utilisée par le processus Node.js actuel. |

