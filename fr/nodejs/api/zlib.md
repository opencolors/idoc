---
title: Documentation Node.js - Zlib
description: Le module zlib dans Node.js fournit des fonctionnalités de compression en utilisant les algorithmes Gzip, Deflate/Inflate et Brotli. Il inclut des méthodes synchrones et asynchrones pour compresser et décompresser les données, ainsi que diverses options pour personnaliser le comportement de la compression.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module zlib dans Node.js fournit des fonctionnalités de compression en utilisant les algorithmes Gzip, Deflate/Inflate et Brotli. Il inclut des méthodes synchrones et asynchrones pour compresser et décompresser les données, ainsi que diverses options pour personnaliser le comportement de la compression.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module zlib dans Node.js fournit des fonctionnalités de compression en utilisant les algorithmes Gzip, Deflate/Inflate et Brotli. Il inclut des méthodes synchrones et asynchrones pour compresser et décompresser les données, ainsi que diverses options pour personnaliser le comportement de la compression.
---


# Zlib {#zlib}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

Le module `node:zlib` fournit des fonctionnalités de compression implémentées à l’aide de Gzip, Deflate/Inflate et Brotli.

Pour y accéder :

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

La compression et la décompression sont construites autour de l’[API Streams](/fr/nodejs/api/stream) de Node.js.

La compression ou la décompression d’un flux (tel qu’un fichier) peut être accomplie en faisant passer le flux source à travers un flux `Transform` `zlib` dans un flux de destination :

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```
:::

Ou, en utilisant l’API `pipeline` promise :

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

await do_gzip('input.txt', 'input.txt.gz');
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
  .catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```
:::

Il est également possible de compresser ou de décompresser des données en une seule étape :

::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

import { promisify } from 'node:util';
const do_unzip = promisify(unzip);

const unzippedBuffer = await do_unzip(buffer);
console.log(unzippedBuffer.toString());
```

```js [CJS]
const { deflate, unzip } = require('node:zlib');

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```
:::

## Utilisation du pool de threads et considérations relatives aux performances {#threadpool-usage-and-performance-considerations}

Toutes les API `zlib`, à l'exception de celles qui sont explicitement synchrones, utilisent le pool de threads interne de Node.js. Cela peut entraîner des effets surprenants et des limitations de performances dans certaines applications.

La création et l'utilisation simultanées d'un grand nombre d'objets zlib peuvent entraîner une fragmentation importante de la mémoire.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// WARNING: DO NOT DO THIS!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// WARNING: DO NOT DO THIS!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

Dans l'exemple précédent, 30 000 instances deflate sont créées simultanément. En raison de la façon dont certains systèmes d'exploitation gèrent l'allocation et la désallocation de la mémoire, cela peut entraîner une fragmentation importante de la mémoire.

Il est fortement recommandé de mettre en cache les résultats des opérations de compression afin d'éviter de dupliquer les efforts.

## Compression des requêtes et des réponses HTTP {#compressing-http-requests-and-responses}

Le module `node:zlib` peut être utilisé pour implémenter la prise en charge des mécanismes d'encodage de contenu `gzip`, `deflate` et `br` définis par [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2).

L'en-tête HTTP [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) est utilisé dans une requête HTTP pour identifier les encodages de compression acceptés par le client. L'en-tête [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) est utilisé pour identifier les encodages de compression réellement appliqués à un message.

Les exemples ci-dessous sont considérablement simplifiés pour montrer le concept de base. L'utilisation du codage `zlib` peut être coûteuse et les résultats doivent être mis en cache. Voir [Réglage de l'utilisation de la mémoire](/fr/nodejs/api/zlib#memory-usage-tuning) pour plus d'informations sur les compromis vitesse/mémoire/compression impliqués dans l'utilisation de `zlib`.

::: code-group
```js [ESM]
// Client request example
import fs from 'node:fs';
import zlib from 'node:zlib';
import http from 'node:http';
import process from 'node:process';
import { pipeline } from 'node:stream';

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Or, just use zlib.createUnzip() to handle both of the following cases:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```js [CJS]
// Client request example
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Or, just use zlib.createUnzip() to handle both of the following cases:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```
:::

::: code-group
```js [ESM]
// server example
// Running a gzip operation on every request is quite expensive.
// It would be much more efficient to cache the compressed buffer.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Store both a compressed and an uncompressed version of the resource.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Note: This is not a conformant accept-encoding parser.
  // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

```js [CJS]
// server example
// Running a gzip operation on every request is quite expensive.
// It would be much more efficient to cache the compressed buffer.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Store both a compressed and an uncompressed version of the resource.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Note: This is not a conformant accept-encoding parser.
  // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```
:::

Par défaut, les méthodes `zlib` renvoient une erreur lors de la décompression de données tronquées. Cependant, s'il est connu que les données sont incomplètes, ou si le désir est d'inspecter uniquement le début d'un fichier compressé, il est possible de supprimer la gestion des erreurs par défaut en modifiant la méthode de vidage qui est utilisée pour décompresser le dernier bloc de données d'entrée :

```js [ESM]
// This is a truncated version of the buffer from the above examples
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // For Brotli, the equivalent is zlib.constants.BROTLI_OPERATION_FLUSH.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
Cela ne modifiera pas le comportement dans d'autres situations de levée d'erreurs, par exemple lorsque les données d'entrée ont un format non valide. En utilisant cette méthode, il ne sera pas possible de déterminer si l'entrée s'est terminée prématurément ou si elle manque les contrôles d'intégrité, ce qui rend nécessaire de vérifier manuellement que le résultat décompressé est valide.


## Optimisation de l'utilisation de la mémoire {#memory-usage-tuning}

### Pour les flux basés sur zlib {#for-zlib-based-streams}

Depuis `zlib/zconf.h`, modifié pour l'utilisation de Node.js :

Les besoins en mémoire pour deflate sont (en octets) :

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
C'est-à-dire : 128K pour `windowBits` = 15 + 128K pour `memLevel` = 8 (valeurs par défaut) plus quelques kilo-octets pour les petits objets.

Par exemple, pour réduire les besoins en mémoire par défaut de 256 K à 128 K, les options doivent être définies sur :

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
Cependant, cela dégradera généralement la compression.

Les besoins en mémoire pour inflate sont (en octets) `1 \<\< windowBits`. C'est-à-dire 32 K pour `windowBits` = 15 (valeur par défaut) plus quelques kilo-octets pour les petits objets.

Ceci s'ajoute à une seule mémoire tampon de sortie interne de taille `chunkSize`, qui est par défaut de 16 K.

La vitesse de la compression `zlib` est affectée le plus considérablement par le paramètre `level`. Un niveau plus élevé entraînera une meilleure compression, mais prendra plus de temps. Un niveau inférieur entraînera moins de compression, mais sera beaucoup plus rapide.

En général, des options d'utilisation de la mémoire plus importantes signifieront que Node.js devra effectuer moins d'appels à `zlib` car il pourra traiter plus de données à chaque opération `write`. Il s'agit donc d'un autre facteur qui affecte la vitesse, au détriment de l'utilisation de la mémoire.

### Pour les flux basés sur Brotli {#for-brotli-based-streams}

Il existe des équivalents aux options zlib pour les flux basés sur Brotli, bien que ces options aient des plages différentes de celles de zlib :

- L'option `level` de zlib correspond à l'option `BROTLI_PARAM_QUALITY` de Brotli.
- L'option `windowBits` de zlib correspond à l'option `BROTLI_PARAM_LGWIN` de Brotli.

Voir [ci-dessous](/fr/nodejs/api/zlib#brotli-constants) pour plus de détails sur les options spécifiques à Brotli.

## Vidage {#flushing}

L'appel de [`.flush()`](/fr/nodejs/api/zlib#zlibflushkind-callback) sur un flux de compression fera en sorte que `zlib` renvoie autant de sortie que possible actuellement. Cela peut se faire au détriment de la qualité de la compression, mais peut être utile lorsque les données doivent être disponibles dès que possible.

Dans l'exemple suivant, `flush()` est utilisé pour écrire une réponse HTTP partielle compressée au client :

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // Par souci de simplicité, les vérifications Accept-Encoding sont omises.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Si une erreur se produit, nous ne pouvons pas faire grand-chose car
      // le serveur a déjà envoyé le code de réponse 200 et
      // une certaine quantité de données a déjà été envoyée au client.
      // La meilleure chose que nous puissions faire est d'interrompre immédiatement la réponse
      // et d'enregistrer l'erreur.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // Les données ont été transmises à zlib, mais l'algorithme de compression peut
      // avoir décidé de mettre en mémoire tampon les données pour une compression plus efficace.
      // L'appel de .flush() rendra les données disponibles dès que le client
      // sera prêt à les recevoir.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

```js [CJS]
const zlib = require('node:zlib');
const http = require('node:http');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  // Par souci de simplicité, les vérifications Accept-Encoding sont omises.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // Si une erreur se produit, nous ne pouvons pas faire grand-chose car
      // le serveur a déjà envoyé le code de réponse 200 et
      // une certaine quantité de données a déjà été envoyée au client.
      // La meilleure chose que nous puissions faire est d'interrompre immédiatement la réponse
      // et d'enregistrer l'erreur.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // Les données ont été transmises à zlib, mais l'algorithme de compression peut
      // avoir décidé de mettre en mémoire tampon les données pour une compression plus efficace.
      // L'appel de .flush() rendra les données disponibles dès que le client
      // sera prêt à les recevoir.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## Constantes {#constants}

**Ajoutée dans : v0.5.8**

### Constantes zlib {#zlib-constants}

Toutes les constantes définies dans `zlib.h` sont également définies dans `require('node:zlib').constants`. Dans le cours normal des opérations, il ne sera pas nécessaire d'utiliser ces constantes. Elles sont documentées afin que leur présence ne soit pas surprenante. Cette section est tirée presque directement de la [documentation zlib](https://zlib.net/manual#Constants).

Auparavant, les constantes étaient disponibles directement à partir de `require('node:zlib')`, par exemple `zlib.Z_NO_FLUSH`. L'accès aux constantes directement à partir du module est toujours possible, mais il est obsolète.

Valeurs de vidage autorisées.

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

Codes de retour pour les fonctions de compression/décompression. Les valeurs négatives sont des erreurs, les valeurs positives sont utilisées pour des événements spéciaux mais normaux.

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

Niveaux de compression.

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

Stratégie de compression.

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Constantes Brotli {#brotli-constants}

**Ajoutée dans : v11.7.0, v10.16.0**

Il existe plusieurs options et autres constantes disponibles pour les flux basés sur Brotli :

#### Opérations de vidage {#flush-operations}

Les valeurs suivantes sont des opérations de vidage valides pour les flux basés sur Brotli :

- `zlib.constants.BROTLI_OPERATION_PROCESS` (par défaut pour toutes les opérations)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (par défaut lors de l’appel de `.flush()`)
- `zlib.constants.BROTLI_OPERATION_FINISH` (par défaut pour le dernier bloc)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - Cette opération particulière peut être difficile à utiliser dans un contexte Node.js, car la couche de flux rend difficile de savoir quelles données finiront par se retrouver dans cette trame. De plus, il n’existe actuellement aucun moyen de consommer ces données via l’API Node.js.


#### Options du compresseur {#compressor-options}

Plusieurs options peuvent être définies sur les encodeurs Brotli, affectant l'efficacité et la vitesse de compression. Les clés et les valeurs sont accessibles en tant que propriétés de l'objet `zlib.constants`.

Les options les plus importantes sont :

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (par défaut)
    - `BROTLI_MODE_TEXT`, ajusté pour le texte UTF-8
    - `BROTLI_MODE_FONT`, ajusté pour les polices WOFF 2.0
  
 
- `BROTLI_PARAM_QUALITY`
    - Varie de `BROTLI_MIN_QUALITY` à `BROTLI_MAX_QUALITY`, avec une valeur par défaut de `BROTLI_DEFAULT_QUALITY`.
  
 
- `BROTLI_PARAM_SIZE_HINT`
    - Valeur entière représentant la taille d'entrée attendue ; la valeur par défaut est `0` pour une taille d'entrée inconnue.
  
 

Les indicateurs suivants peuvent être définis pour un contrôle avancé de l'algorithme de compression et du réglage de l'utilisation de la mémoire :

- `BROTLI_PARAM_LGWIN`
    - Varie de `BROTLI_MIN_WINDOW_BITS` à `BROTLI_MAX_WINDOW_BITS`, avec une valeur par défaut de `BROTLI_DEFAULT_WINDOW`, ou jusqu'à `BROTLI_LARGE_MAX_WINDOW_BITS` si l'indicateur `BROTLI_PARAM_LARGE_WINDOW` est défini.
  
 
- `BROTLI_PARAM_LGBLOCK`
    - Varie de `BROTLI_MIN_INPUT_BLOCK_BITS` à `BROTLI_MAX_INPUT_BLOCK_BITS`.
  
 
- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - Indicateur booléen qui diminue le taux de compression en faveur de la vitesse de décompression.
  
 
- `BROTLI_PARAM_LARGE_WINDOW`
    - Indicateur booléen activant le mode « Large Window Brotli » (non compatible avec le format Brotli tel que standardisé dans [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).
  
 
- `BROTLI_PARAM_NPOSTFIX`
    - Varie de `0` à `BROTLI_MAX_NPOSTFIX`.
  
 
- `BROTLI_PARAM_NDIRECT`
    - Varie de `0` à `15 \<\< NPOSTFIX` par pas de `1 \<\< NPOSTFIX`.
  
 

#### Options du décompresseur {#decompressor-options}

Ces options avancées sont disponibles pour contrôler la décompression :

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - Indicateur booléen qui affecte les schémas d'allocation de mémoire interne.
  
 
- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - Indicateur booléen activant le mode « Large Window Brotli » (non compatible avec le format Brotli tel que standardisé dans [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


## Class: `Options` {#class-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0, v12.19.0 | L'option `maxOutputLength` est maintenant prise en charge. |
| v9.4.0 | L'option `dictionary` peut être un `ArrayBuffer`. |
| v8.0.0 | L'option `dictionary` peut maintenant être un `Uint8Array`. |
| v5.11.0 | L'option `finishFlush` est maintenant prise en charge. |
| v0.11.1 | Ajoutée dans : v0.11.1 |
:::

Chaque classe basée sur zlib prend un objet `options`. Aucune option n'est requise.

Certaines options ne sont pertinentes que lors de la compression et sont ignorées par les classes de décompression.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (compression uniquement)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (compression uniquement)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (compression uniquement)
- `dictionary` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (deflate/inflate uniquement, dictionnaire vide par défaut)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (Si `true`, renvoie un objet avec `buffer` et `engine`.)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limite la taille de la sortie lors de l'utilisation des [méthodes pratiques](/fr/nodejs/api/zlib#convenience-methods). **Par défaut:** [`buffer.kMaxLength`](/fr/nodejs/api/buffer#bufferkmaxlength)

Voir la documentation [`deflateInit2` et `inflateInit2`](https://zlib.net/manual#Advanced) pour plus d'informations.


## Classe : `BrotliOptions` {#class-brotlioptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0, v12.19.0 | L’option `maxOutputLength` est désormais prise en charge. |
| v11.7.0 | Ajouté dans : v11.7.0 |
:::

Chaque classe basée sur Brotli prend un objet `options`. Toutes les options sont facultatives.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `16 * 1024`
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objet clé-valeur contenant les [paramètres Brotli](/fr/nodejs/api/zlib#brotli-constants) indexés.
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limite la taille de la sortie lors de l’utilisation des [méthodes pratiques](/fr/nodejs/api/zlib#convenience-methods). **Par défaut :** [`buffer.kMaxLength`](/fr/nodejs/api/buffer#bufferkmaxlength)

Par exemple :

```js [ESM]
const stream = zlib.createBrotliCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(inputFile).size,
  },
});
```
## Classe : `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**Ajouté dans : v11.7.0, v10.16.0**

Compresse les données à l’aide de l’algorithme Brotli.

## Classe : `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**Ajouté dans : v11.7.0, v10.16.0**

Décompresse les données à l’aide de l’algorithme Brotli.

## Classe : `zlib.Deflate` {#class-zlibdeflate}

**Ajouté dans : v0.5.8**

Compresse les données à l’aide de deflate.

## Classe : `zlib.DeflateRaw` {#class-zlibdeflateraw}

**Ajouté dans : v0.5.8**

Compresse les données à l’aide de deflate et n’ajoute pas d’en-tête `zlib`.

## Classe : `zlib.Gunzip` {#class-zlibgunzip}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | Les données indésirables à la fin du flux d’entrée entraînent désormais un événement `'error'`. |
| v5.9.0 | Plusieurs membres de fichiers gzip concaténés sont désormais pris en charge. |
| v5.0.0 | Un flux d’entrée tronqué entraîne désormais un événement `'error'`. |
| v0.5.8 | Ajouté dans : v0.5.8 |
:::

Décompresse un flux gzip.


## Classe : `zlib.Gzip` {#class-zlibgzip}

**Ajoutée dans : v0.5.8**

Compresse des données en utilisant gzip.

## Classe : `zlib.Inflate` {#class-zlibinflate}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.0.0 | Un flux d'entrée tronqué entraînera désormais un événement `'error'`. |
| v0.5.8 | Ajoutée dans : v0.5.8 |
:::

Décompresse un flux deflate.

## Classe : `zlib.InflateRaw` {#class-zlibinflateraw}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.8.0 | Les dictionnaires personnalisés sont désormais pris en charge par `InflateRaw`. |
| v5.0.0 | Un flux d'entrée tronqué entraînera désormais un événement `'error'`. |
| v0.5.8 | Ajoutée dans : v0.5.8 |
:::

Décompresse un flux deflate brut.

## Classe : `zlib.Unzip` {#class-zlibunzip}

**Ajoutée dans : v0.5.8**

Décompresse un flux compressé en Gzip ou Deflate en détectant automatiquement l'en-tête.

## Classe : `zlib.ZlibBase` {#class-zlibzlibbase}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.7.0, v10.16.0 | Cette classe a été renommée de `Zlib` à `ZlibBase`. |
| v0.5.8 | Ajoutée dans : v0.5.8 |
:::

Non exportée par le module `node:zlib`. Elle est documentée ici car c'est la classe de base des classes de compresseur/décompresseur.

Cette classe hérite de [`stream.Transform`](/fr/nodejs/api/stream#class-streamtransform), permettant aux objets `node:zlib` d'être utilisés dans les pipes et les opérations de flux similaires.

### `zlib.bytesWritten` {#zlibbyteswritten}

**Ajoutée dans : v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propriété `zlib.bytesWritten` spécifie le nombre d'octets écrits dans le moteur, avant que les octets ne soient traités (compressés ou décompressés, selon le cas pour la classe dérivée).

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**Ajoutée dans : v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Lorsque `data` est une chaîne, elle sera encodée en UTF-8 avant d'être utilisée pour le calcul.
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Une valeur de départ optionnelle. Elle doit être un entier non signé de 32 bits. **Par défaut :** `0`
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un entier non signé de 32 bits contenant la somme de contrôle.

Calcule une somme de contrôle [Cyclic Redundancy Check](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) de 32 bits de `data`. Si `value` est spécifié, il est utilisé comme valeur de départ de la somme de contrôle, sinon, 0 est utilisé comme valeur de départ.

L'algorithme CRC est conçu pour calculer les sommes de contrôle et détecter les erreurs de transmission des données. Il n'est pas adapté à l'authentification cryptographique.

Pour être cohérent avec d'autres API, si les `data` sont une chaîne, ils seront encodés en UTF-8 avant d'être utilisés pour le calcul. Si les utilisateurs utilisent uniquement Node.js pour calculer et faire correspondre les sommes de contrôle, cela fonctionne bien avec d'autres API qui utilisent l'encodage UTF-8 par défaut.

Certaines bibliothèques JavaScript tierces calculent la somme de contrôle sur une chaîne basée sur `str.charCodeAt()` afin qu'elle puisse être exécutée dans les navigateurs. Si les utilisateurs veulent faire correspondre la somme de contrôle calculée avec ce type de bibliothèque dans le navigateur, il est préférable d'utiliser la même bibliothèque dans Node.js si elle s'exécute également dans Node.js. Si les utilisateurs doivent utiliser `zlib.crc32()` pour faire correspondre la somme de contrôle produite par une telle bibliothèque tierce :

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

```js [CJS]
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```
:::


### `zlib.close([callback])` {#zlibclosecallback}

**Ajouté dans : v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Ferme le handle sous-jacent.

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**Ajouté dans : v0.5.8**

- `kind` **Par défaut :** `zlib.constants.Z_FULL_FLUSH` pour les flux basés sur zlib, `zlib.constants.BROTLI_OPERATION_FLUSH` pour les flux basés sur Brotli.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Vide les données en attente. N'appelez pas ceci à la légère, les vidages prématurés ont un impact négatif sur l'efficacité de l'algorithme de compression.

L'appel de cette fonction ne vide que les données de l'état interne de `zlib`, et n'effectue aucun type de vidage au niveau des flux. Au contraire, il se comporte comme un appel normal à `.write()`, c'est-à-dire qu'il sera mis en file d'attente derrière les autres écritures en attente et ne produira de sortie que lorsque des données sont lues dans le flux.

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**Ajouté dans : v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Cette fonction n'est disponible que pour les flux basés sur zlib, c'est-à-dire pas Brotli.

Met à jour dynamiquement le niveau de compression et la stratégie de compression. Applicable uniquement à l'algorithme deflate.

### `zlib.reset()` {#zlibreset}

**Ajouté dans : v0.7.0**

Réinitialise le compresseur/décompresseur aux paramètres d'usine. Applicable uniquement aux algorithmes inflate et deflate.

## `zlib.constants` {#zlibconstants}

**Ajouté dans : v7.0.0**

Fournit un objet énumérant les constantes liées à Zlib.

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**Ajouté dans : v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/fr/nodejs/api/zlib#class-brotlioptions)

Crée et renvoie un nouvel objet [`BrotliCompress`](/fr/nodejs/api/zlib#class-zlibbrotlicompress).


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**Ajouté dans : v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/fr/nodejs/api/zlib#class-brotlioptions)

Crée et renvoie un nouvel objet [`BrotliDecompress`](/fr/nodejs/api/zlib#class-zlibbrotlidecompress).

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**Ajouté dans : v0.5.8**

- `options` [\<zlib options\>](/fr/nodejs/api/zlib#class-options)

Crée et renvoie un nouvel objet [`Deflate`](/fr/nodejs/api/zlib#class-zlibdeflate).

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**Ajouté dans : v0.5.8**

- `options` [\<zlib options\>](/fr/nodejs/api/zlib#class-options)

Crée et renvoie un nouvel objet [`DeflateRaw`](/fr/nodejs/api/zlib#class-zlibdeflateraw).

Une mise à niveau de zlib de 1.2.8 à 1.2.11 a changé de comportement lorsque `windowBits` est défini sur 8 pour les flux deflate bruts. zlib définissait automatiquement `windowBits` sur 9 s'il était initialement défini sur 8. Les versions plus récentes de zlib lèveront une exception, Node.js a donc restauré le comportement d'origine consistant à mettre à niveau une valeur de 8 à 9, car le passage de `windowBits = 9` à zlib génère en fait un flux compressé qui utilise effectivement une fenêtre de 8 bits uniquement.

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**Ajouté dans : v0.5.8**

- `options` [\<zlib options\>](/fr/nodejs/api/zlib#class-options)

Crée et renvoie un nouvel objet [`Gunzip`](/fr/nodejs/api/zlib#class-zlibgunzip).

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**Ajouté dans : v0.5.8**

- `options` [\<zlib options\>](/fr/nodejs/api/zlib#class-options)

Crée et renvoie un nouvel objet [`Gzip`](/fr/nodejs/api/zlib#class-zlibgzip). Voir [l'exemple](/fr/nodejs/api/zlib#zlib).

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**Ajouté dans : v0.5.8**

- `options` [\<zlib options\>](/fr/nodejs/api/zlib#class-options)

Crée et renvoie un nouvel objet [`Inflate`](/fr/nodejs/api/zlib#class-zlibinflate).

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**Ajouté dans : v0.5.8**

- `options` [\<zlib options\>](/fr/nodejs/api/zlib#class-options)

Crée et renvoie un nouvel objet [`InflateRaw`](/fr/nodejs/api/zlib#class-zlibinflateraw).

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**Ajouté dans : v0.5.8**

- `options` [\<zlib options\>](/fr/nodejs/api/zlib#class-options)

Crée et renvoie un nouvel objet [`Unzip`](/fr/nodejs/api/zlib#class-zlibunzip).


## Méthodes de commodité {#convenience-methods}

Toutes ces méthodes prennent un [`Buffer`](/fr/nodejs/api/buffer#class-buffer), un [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), un [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), un [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou une chaîne de caractères comme premier argument, un second argument optionnel pour fournir des options aux classes `zlib` et appellera le callback fourni avec `callback(error, result)`.

Chaque méthode a une contrepartie `*Sync`, qui accepte les mêmes arguments, mais sans callback.

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**Ajouté dans : v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options brotli\>](/fr/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**Ajouté dans : v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options brotli\>](/fr/nodejs/api/zlib#class-brotlioptions)

Compresse un bloc de données avec [`BrotliCompress`](/fr/nodejs/api/zlib#class-zlibbrotlicompress).


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**Ajouté dans : v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options brotli\>](/fr/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**Ajouté dans : v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options brotli\>](/fr/nodejs/api/zlib#class-brotlioptions)

Décompresse un bloc de données avec [`BrotliDecompress`](/fr/nodejs/api/zlib#class-zlibbrotlidecompress).

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut maintenant être un `Uint8Array`. |
| v0.6.0 | Ajouté dans : v0.6.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)

Compresse un bloc de données avec [`Deflate`](/fr/nodejs/api/zlib#class-zlibdeflate).

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v0.6.0 | Ajoutée dans : v0.6.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)

Compresse un bloc de données avec [`DeflateRaw`](/fr/nodejs/api/zlib#class-zlibdeflateraw).


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut maintenant être un `Uint8Array`. |
| v0.6.0 | Ajoutée dans : v0.6.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut maintenant être un `Uint8Array`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)

Décompresse un bloc de données avec [`Gunzip`](/fr/nodejs/api/zlib#class-zlibgunzip).

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut maintenant être un `Uint8Array`. |
| v0.6.0 | Ajoutée dans : v0.6.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut maintenant être un `Uint8Array`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)

Compresse un bloc de données avec [`Gzip`](/fr/nodejs/api/zlib#class-zlibgzip).

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut maintenant être un `Uint8Array`. |
| v0.6.0 | Ajoutée dans : v0.6.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut maintenant être un `Uint8Array`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)

Décompresse un bloc de données avec [`Inflate`](/fr/nodejs/api/zlib#class-zlibinflate).


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v0.6.0 | Ajoutée dans : v0.6.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)

Décompresse un bloc de données avec [`InflateRaw`](/fr/nodejs/api/zlib#class-zlibinflateraw).

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v0.6.0 | Ajoutée dans : v0.6.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.4.0 | Le paramètre `buffer` peut être un `ArrayBuffer`. |
| v8.0.0 | Le paramètre `buffer` peut être n'importe quel `TypedArray` ou `DataView`. |
| v8.0.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v0.11.12 | Ajouté dans : v0.11.12 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<options zlib\>](/fr/nodejs/api/zlib#class-options)

Décompresse un bloc de données avec [`Unzip`](/fr/nodejs/api/zlib#class-zlibunzip).

