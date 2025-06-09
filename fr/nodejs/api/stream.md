---
title: Documentation de l'API Stream de Node.js
description: Documentation détaillée sur l'API Stream de Node.js, couvrant les flux lisibles, écrivables, duplex et de transformation, ainsi que leurs méthodes, événements et exemples d'utilisation.
head:
  - - meta
    - name: og:title
      content: Documentation de l'API Stream de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentation détaillée sur l'API Stream de Node.js, couvrant les flux lisibles, écrivables, duplex et de transformation, ainsi que leurs méthodes, événements et exemples d'utilisation.
  - - meta
    - name: twitter:title
      content: Documentation de l'API Stream de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentation détaillée sur l'API Stream de Node.js, couvrant les flux lisibles, écrivables, duplex et de transformation, ainsi que leurs méthodes, événements et exemples d'utilisation.
---


# Stream {#stream}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

Un flux est une interface abstraite pour travailler avec des données en continu dans Node.js. Le module `node:stream` fournit une API pour implémenter l’interface de flux.

Il existe de nombreux objets de flux fournis par Node.js. Par exemple, une [requête vers un serveur HTTP](/fr/nodejs/api/http#class-httpincomingmessage) et [`process.stdout`](/fr/nodejs/api/process#processstdout) sont tous deux des instances de flux.

Les flux peuvent être lisibles, accessibles en écriture ou les deux. Tous les flux sont des instances de [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter).

Pour accéder au module `node:stream` :

```js [ESM]
const stream = require('node:stream');
```
Le module `node:stream` est utile pour créer de nouveaux types d’instances de flux. Il n’est généralement pas nécessaire d’utiliser le module `node:stream` pour consommer des flux.

## Organisation de ce document {#organization-of-this-document}

Ce document contient deux sections principales et une troisième section pour les notes. La première section explique comment utiliser les flux existants dans une application. La deuxième section explique comment créer de nouveaux types de flux.

## Types de flux {#types-of-streams}

Il existe quatre types de flux fondamentaux dans Node.js :

- [`Writable`](/fr/nodejs/api/stream#class-streamwritable) : flux dans lesquels des données peuvent être écrites (par exemple, [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options)).
- [`Readable`](/fr/nodejs/api/stream#class-streamreadable) : flux à partir desquels des données peuvent être lues (par exemple, [`fs.createReadStream()`](/fr/nodejs/api/fs#fscreatereadstreampath-options)).
- [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) : flux qui sont à la fois `Readable` et `Writable` (par exemple, [`net.Socket`](/fr/nodejs/api/net#class-netsocket)).
- [`Transform`](/fr/nodejs/api/stream#class-streamtransform) : flux `Duplex` qui peuvent modifier ou transformer les données lors de leur écriture et de leur lecture (par exemple, [`zlib.createDeflate()`](/fr/nodejs/api/zlib#zlibcreatedeflateoptions)).

De plus, ce module inclut les fonctions utilitaires [`stream.duplexPair()`](/fr/nodejs/api/stream#streamduplexpairoptions), [`stream.pipeline()`](/fr/nodejs/api/stream#streampipelinesource-transforms-destination-callback), [`stream.finished()`](/fr/nodejs/api/stream#streamfinishedstream-options-callback), [`stream.Readable.from()`](/fr/nodejs/api/stream#streamreadablefromiterable-options) et [`stream.addAbortSignal()`](/fr/nodejs/api/stream#streamaddabortsignalsignal-stream).


### API Streams Promises {#streams-promises-api}

**Ajouté dans : v15.0.0**

L'API `stream/promises` fournit un ensemble alternatif de fonctions d'utilité asynchrones pour les flux qui renvoient des objets `Promise` plutôt que d'utiliser des rappels. L'API est accessible via `require('node:stream/promises')` ou `require('node:stream').promises`.

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0, v17.2.0, v16.14.0 | Ajout de l'option `end`, qui peut être définie sur `false` pour empêcher la fermeture automatique du flux de destination lorsque la source se termine. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `streams` [\<Stream[]\>](/fr/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
 
 
- `...transforms` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
 
 
- `destination` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
 
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de pipeline
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Termine le flux de destination lorsque le flux source se termine. Les flux de transformation sont toujours terminés, même si cette valeur est `false`. **Par défaut :** `true`.
 
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est rempli lorsque le pipeline est terminé.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('Pipeline succeeded.');
```
:::

Pour utiliser un `AbortSignal`, transmettez-le à l'intérieur d'un objet d'options, comme dernier argument. Lorsque le signal est abandonné, `destroy` sera appelé sur le pipeline sous-jacent, avec une `AbortError`.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```
:::

L'API `pipeline` prend également en charge les générateurs asynchrones :



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

N'oubliez pas de gérer l'argument `signal` transmis au générateur asynchrone. En particulier dans le cas où le générateur asynchrone est la source du pipeline (c'est-à-dire le premier argument), sinon le pipeline ne se terminera jamais.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

L'API `pipeline` fournit la [version de rappel](/fr/nodejs/api/stream#streampipelinesource-transforms-destination-callback) :


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.5.0, v18.14.0 | Ajout du support pour `ReadableStream` et `WritableStream`. |
| v19.1.0, v18.13.0 | L'option `cleanup` a été ajoutée. |
| v15.0.0 | Ajouté dans : v15.0.0 |
:::

- `stream` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) Un flux/flux web lisible et/ou accessible en écriture.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Si `true`, supprime les écouteurs enregistrés par cette fonction avant que la promesse ne soit résolue. **Par défaut :** `false`.


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise lorsque le flux n'est plus lisible ou accessible en écriture.



::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Le flux a terminé la lecture.');
}

run().catch(console.error);
rs.resume(); // Vider le flux.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Le flux a terminé la lecture.');
}

run().catch(console.error);
rs.resume(); // Vider le flux.
```
:::

L'API `finished` fournit également une [version de rappel](/fr/nodejs/api/stream#streamfinishedstream-options-callback).

`stream.finished()` laisse des écouteurs d'événements en suspens (en particulier `'error'`, `'end'`, `'finish'` et `'close'`) après que la promesse retournée est résolue ou rejetée. La raison en est que les événements `'error'` inattendus (en raison d'implémentations de flux incorrectes) ne provoquent pas de plantages inattendus. Si ce comportement n'est pas souhaité, `options.cleanup` doit être défini sur `true` :

```js [ESM]
await finished(rs, { cleanup: true });
```

### Mode objet {#object-mode}

Tous les flux créés par les API Node.js fonctionnent exclusivement sur des chaînes de caractères, des objets [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), des objets [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) et [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) :

- `Strings` et `Buffers` sont les types les plus couramment utilisés avec les flux.
- `TypedArray` et `DataView` vous permettent de gérer les données binaires avec des types tels que `Int32Array` ou `Uint8Array`. Lorsque vous écrivez un TypedArray ou DataView dans un flux, Node.js traite les octets bruts.

Il est toutefois possible que les implémentations de flux fonctionnent avec d'autres types de valeurs JavaScript (à l'exception de `null`, qui a un rôle spécial dans les flux). Ces flux sont considérés comme fonctionnant en "mode objet".

Les instances de flux sont basculées en mode objet à l'aide de l'option `objectMode` lors de la création du flux. Tenter de basculer un flux existant en mode objet n'est pas sûr.

### Mise en mémoire tampon {#buffering}

Les flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) et [`Readable`](/fr/nodejs/api/stream#class-streamreadable) stockent des données dans une mémoire tampon interne.

La quantité de données potentiellement mises en mémoire tampon dépend de l'option `highWaterMark` passée au constructeur du flux. Pour les flux normaux, l'option `highWaterMark` spécifie un [nombre total d'octets](/fr/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding). Pour les flux fonctionnant en mode objet, `highWaterMark` spécifie un nombre total d'objets. Pour les flux fonctionnant sur (mais ne décodant pas) les chaînes de caractères, `highWaterMark` spécifie un nombre total d'unités de code UTF-16.

Les données sont mises en mémoire tampon dans les flux `Readable` lorsque l'implémentation appelle [`stream.push(chunk)`](/fr/nodejs/api/stream#readablepushchunk-encoding). Si le consommateur du flux n'appelle pas [`stream.read()`](/fr/nodejs/api/stream#readablereadsize), les données restent dans la file d'attente interne jusqu'à ce qu'elles soient consommées.

Une fois que la taille totale de la mémoire tampon de lecture interne atteint le seuil spécifié par `highWaterMark`, le flux arrête temporairement de lire les données de la ressource sous-jacente jusqu'à ce que les données actuellement mises en mémoire tampon puissent être consommées (c'est-à-dire que le flux cesse d'appeler la méthode interne [`readable._read()`](/fr/nodejs/api/stream#readable_readsize) qui est utilisée pour remplir la mémoire tampon de lecture).

Les données sont mises en mémoire tampon dans les flux `Writable` lorsque la méthode [`writable.write(chunk)`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) est appelée de manière répétée. Tant que la taille totale de la mémoire tampon d'écriture interne est inférieure au seuil défini par `highWaterMark`, les appels à `writable.write()` renvoient `true`. Une fois que la taille de la mémoire tampon interne atteint ou dépasse `highWaterMark`, `false` est renvoyé.

L'un des principaux objectifs de l'API `stream`, en particulier la méthode [`stream.pipe()`](/fr/nodejs/api/stream#readablepipedestination-options), est de limiter la mise en mémoire tampon des données à des niveaux acceptables afin que les sources et les destinations de vitesses différentes ne submergent pas la mémoire disponible.

L'option `highWaterMark` est un seuil, pas une limite : elle dicte la quantité de données qu'un flux met en mémoire tampon avant d'arrêter d'en demander davantage. Elle n'impose pas une limitation stricte de la mémoire en général. Les implémentations de flux spécifiques peuvent choisir d'imposer des limites plus strictes, mais cela est facultatif.

Comme les flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) et [`Transform`](/fr/nodejs/api/stream#class-streamtransform) sont à la fois `Readable` et `Writable`, chacun maintient *deux* mémoires tampons internes distinctes utilisées pour la lecture et l'écriture, ce qui permet à chaque côté de fonctionner indépendamment de l'autre tout en maintenant un flux de données approprié et efficace. Par exemple, les instances de [`net.Socket`](/fr/nodejs/api/net#class-netsocket) sont des flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) dont le côté `Readable` permet la consommation de données reçues *du* socket et dont le côté `Writable` permet l'écriture de données *vers* le socket. Étant donné que les données peuvent être écrites dans le socket à un rythme plus rapide ou plus lent que les données reçues, chaque côté doit fonctionner (et mettre en mémoire tampon) indépendamment de l'autre.

Les mécanismes de la mise en mémoire tampon interne sont un détail d'implémentation interne et peuvent être modifiés à tout moment. Cependant, pour certaines implémentations avancées, les mémoires tampons internes peuvent être récupérées à l'aide de `writable.writableBuffer` ou `readable.readableBuffer`. L'utilisation de ces propriétés non documentées est déconseillée.


## API pour les consommateurs de flux {#api-for-stream-consumers}

Presque toutes les applications Node.js, aussi simples soient-elles, utilisent les flux d'une manière ou d'une autre. Voici un exemple d'utilisation de flux dans une application Node.js qui implémente un serveur HTTP :

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` est un http.IncomingMessage, qui est un flux lisible.
  // `res` est un http.ServerResponse, qui est un flux inscriptible.

  let body = '';
  // Récupérer les données sous forme de chaînes utf8.
  // Si un encodage n'est pas défini, des objets Buffer seront reçus.
  req.setEncoding('utf8');

  // Les flux lisibles émettent des événements 'data' une fois qu'un écouteur est ajouté.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // L'événement 'end' indique que l'intégralité du corps a été reçue.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Renvoyer quelque chose d'intéressant à l'utilisateur :
      res.write(typeof data);
      res.end();
    } catch (er) {
      // Oups ! Mauvais JSON !
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```
Les flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) (tels que `res` dans l'exemple) exposent des méthodes telles que `write()` et `end()` qui sont utilisées pour écrire des données dans le flux.

Les flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable) utilisent l'API [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter) pour notifier le code de l'application lorsque des données sont disponibles pour être lues à partir du flux. Ces données disponibles peuvent être lues à partir du flux de plusieurs manières.

Les flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) et [`Readable`](/fr/nodejs/api/stream#class-streamreadable) utilisent l'API [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter) de diverses manières pour communiquer l'état actuel du flux.

Les flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) et [`Transform`](/fr/nodejs/api/stream#class-streamtransform) sont à la fois [`Writable`](/fr/nodejs/api/stream#class-streamwritable) et [`Readable`](/fr/nodejs/api/stream#class-streamreadable).

Les applications qui écrivent ou consomment des données à partir d'un flux ne sont pas tenues d'implémenter directement les interfaces de flux et n'auront généralement aucune raison d'appeler `require('node:stream')`.

Les développeurs souhaitant implémenter de nouveaux types de flux doivent se référer à la section [API pour les implémenteurs de flux](/fr/nodejs/api/stream#api-for-stream-implementers).


### Flux d'écriture {#writable-streams}

Les flux d'écriture sont une abstraction pour une *destination* vers laquelle des données sont écrites.

Les exemples de flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) incluent :

- [Requêtes HTTP, côté client](/fr/nodejs/api/http#class-httpclientrequest)
- [Réponses HTTP, côté serveur](/fr/nodejs/api/http#class-httpserverresponse)
- [Flux d'écriture fs](/fr/nodejs/api/fs#class-fswritestream)
- [Flux zlib](/fr/nodejs/api/zlib)
- [Flux crypto](/fr/nodejs/api/crypto)
- [Sockets TCP](/fr/nodejs/api/net#class-netsocket)
- [stdin de processus enfant](/fr/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/fr/nodejs/api/process#processstdout), [`process.stderr`](/fr/nodejs/api/process#processstderr)

Certains de ces exemples sont en réalité des flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) qui implémentent l'interface [`Writable`](/fr/nodejs/api/stream#class-streamwritable).

Tous les flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) implémentent l'interface définie par la classe `stream.Writable`.

Bien que les instances spécifiques de flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) puissent différer de diverses manières, tous les flux `Writable` suivent le même modèle d'utilisation fondamental, comme illustré dans l'exemple ci-dessous :

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### Classe : `stream.Writable` {#class-streamwritable}

**Ajouté dans : v0.9.4**

##### Événement : `'close'` {#event-close}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Ajout de l'option `emitClose` pour spécifier si `'close'` est émis lors de la destruction. |
| v0.9.4 | Ajouté dans : v0.9.4 |
:::

L'événement `'close'` est émis lorsque le flux et toutes ses ressources sous-jacentes (un descripteur de fichier, par exemple) ont été fermés. L'événement indique qu'aucun autre événement ne sera émis et qu'aucun autre calcul ne sera effectué.

Un flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) émettra toujours l'événement `'close'` s'il est créé avec l'option `emitClose`.

##### Événement : `'drain'` {#event-drain}

**Ajouté dans : v0.9.4**

Si un appel à [`stream.write(chunk)`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) renvoie `false`, l'événement `'drain'` est émis lorsqu'il est approprié de reprendre l'écriture de données dans le flux.

```js [ESM]
// Écrit les données dans le flux d'écriture fourni un million de fois.
// Soyez attentif à la contre-pression.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Dernière fois !
        writer.write(data, encoding, callback);
      } else {
        // Voyons si nous devons continuer ou attendre.
        // Ne transmettez pas le rappel, car nous n'avons pas encore terminé.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // A dû s'arrêter tôt !
      // Écrivez un peu plus une fois qu'il s'est vidé.
      writer.once('drain', write);
    }
  }
}
```

##### Événement : `'error'` {#event-error}

**Ajouté dans : v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L’événement `'error'` est émis si une erreur s’est produite lors de l’écriture ou de la transmission de données. Le rappel de l’écouteur reçoit un seul argument `Error` lors de son appel.

Le flux est fermé lorsque l’événement `'error'` est émis, sauf si l’option [`autoDestroy`](/fr/nodejs/api/stream#new-streamwritableoptions) a été définie sur `false` lors de la création du flux.

Après `'error'`, aucun autre événement autre que `'close'` *ne doit* être émis (y compris les événements `'error'`).

##### Événement : `'finish'` {#event-finish}

**Ajouté dans : v0.9.4**

L’événement `'finish'` est émis après que la méthode [`stream.end()`](/fr/nodejs/api/stream#writableendchunk-encoding-callback) a été appelée et que toutes les données ont été vidées vers le système sous-jacent.

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```
##### Événement : `'pipe'` {#event-pipe}

**Ajouté dans : v0.9.4**

- `src` [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) flux source qui transmet à cet enregistreur

L’événement `'pipe'` est émis lorsque la méthode [`stream.pipe()`](/fr/nodejs/api/stream#readablepipedestination-options) est appelée sur un flux lisible, ajoutant cet enregistreur à son ensemble de destinations.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### Événement : `'unpipe'` {#event-unpipe}

**Ajouté dans : v0.9.4**

- `src` [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) Le flux source qui a [unpiped](/fr/nodejs/api/stream#readableunpipedestination) cet enregistreur

L’événement `'unpipe'` est émis lorsque la méthode [`stream.unpipe()`](/fr/nodejs/api/stream#readableunpipedestination) est appelée sur un flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable), supprimant ce [`Writable`](/fr/nodejs/api/stream#class-streamwritable) de son ensemble de destinations.

Ceci est également émis au cas où ce flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) émet une erreur lorsqu’un flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable) y est transmis.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**Ajouté dans : v0.11.2**

La méthode `writable.cork()` force toutes les données écrites à être mises en mémoire tampon. Les données mises en mémoire tampon seront vidées lorsque les méthodes [`stream.uncork()`](/fr/nodejs/api/stream#writableuncork) ou [`stream.end()`](/fr/nodejs/api/stream#writableendchunk-encoding-callback) sont appelées.

L'intention principale de `writable.cork()` est de prendre en charge une situation dans laquelle plusieurs petits morceaux sont écrits dans le flux en succession rapide. Au lieu de les transmettre immédiatement à la destination sous-jacente, `writable.cork()` met en mémoire tampon tous les morceaux jusqu'à ce que `writable.uncork()` soit appelé, ce qui les transmettra tous à `writable._writev()`, si présent. Cela empêche une situation de blocage en tête de ligne où les données sont mises en mémoire tampon en attendant que le premier petit morceau soit traité. Cependant, l'utilisation de `writable.cork()` sans implémenter `writable._writev()` peut avoir un effet négatif sur le débit.

Voir aussi : [`writable.uncork()`](/fr/nodejs/api/stream#writableuncork), [`writable._writev()`](/fr/nodejs/api/stream#writable_writevchunks-callback).

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Fonctionne comme une opération no-op sur un flux qui a déjà été détruit. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Optionnel, une erreur à émettre avec l'événement `'error'`.
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Détruit le flux. Émet optionnellement un événement `'error'`, et émet un événement `'close'` (sauf si `emitClose` est défini sur `false`). Après cet appel, le flux d'écriture est terminé et les appels suivants à `write()` ou `end()` entraîneront une erreur `ERR_STREAM_DESTROYED`. C'est un moyen destructeur et immédiat de détruire un flux. Les appels précédents à `write()` peuvent ne pas avoir été vidés et peuvent déclencher une erreur `ERR_STREAM_DESTROYED`. Utilisez `end()` au lieu de destroy si les données doivent être vidées avant la fermeture, ou attendez l'événement `'drain'` avant de détruire le flux.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
Une fois que `destroy()` a été appelé, tout appel ultérieur sera une opération no-op et aucune autre erreur que celle de `_destroy()` ne pourra être émise en tant que `'error'`.

Les implémenteurs ne doivent pas remplacer cette méthode, mais plutôt implémenter [`writable._destroy()`](/fr/nodejs/api/stream#writable_destroyerr-callback).


##### `writable.closed` {#writableclosed}

**Ajouté dans : v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après l'émission de `'close'`.

##### `writable.destroyed` {#writabledestroyed}

**Ajouté dans : v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après l'appel de [`writable.destroy()`](/fr/nodejs/api/stream#writabledestroyerror).

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | L'argument `chunk` peut maintenant être une instance `TypedArray` ou `DataView`. |
| v15.0.0 | Le `callback` est invoqué avant 'finish' ou en cas d'erreur. |
| v14.0.0 | Le `callback` est invoqué si 'finish' ou 'error' est émis. |
| v10.0.0 | Cette méthode renvoie maintenant une référence à `writable`. |
| v8.0.0 | L'argument `chunk` peut maintenant être une instance `Uint8Array`. |
| v0.9.4 | Ajouté dans : v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Données optionnelles à écrire. Pour les flux ne fonctionnant pas en mode objet, `chunk` doit être une [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView). Pour les flux en mode objet, `chunk` peut être n'importe quelle valeur JavaScript autre que `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) L'encodage si `chunk` est une chaîne de caractères
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback lorsque le flux est terminé.
- Retourne : [\<this\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/this)

L'appel de la méthode `writable.end()` signale qu'aucune autre donnée ne sera écrite dans [`Writable`](/fr/nodejs/api/stream#class-streamwritable). Les arguments optionnels `chunk` et `encoding` permettent d'écrire un dernier chunk de données immédiatement avant de fermer le flux.

L'appel de la méthode [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) après l'appel de [`stream.end()`](/fr/nodejs/api/stream#writableendchunk-encoding-callback) lèvera une erreur.

```js [ESM]
// Écrivez 'hello, ' puis terminez par 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Il est désormais interdit d'écrire davantage !
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.1.0 | Cette méthode renvoie maintenant une référence à `writable`. |
| v0.11.15 | Ajoutée dans : v0.11.15 |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nouvel encodage par défaut
- Returns: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

La méthode `writable.setDefaultEncoding()` définit l'encodage `encoding` par défaut pour un flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable).

##### `writable.uncork()` {#writableuncork}

**Ajoutée dans : v0.11.2**

La méthode `writable.uncork()` vide toutes les données mises en mémoire tampon depuis l'appel de [`stream.cork()`](/fr/nodejs/api/stream#writablecork).

Lorsque vous utilisez [`writable.cork()`](/fr/nodejs/api/stream#writablecork) et `writable.uncork()` pour gérer la mise en mémoire tampon des écritures dans un flux, différez les appels à `writable.uncork()` en utilisant `process.nextTick()`. Cela permet de regrouper tous les appels `writable.write()` qui se produisent dans une phase donnée de la boucle d'événements Node.js.

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
Si la méthode [`writable.cork()`](/fr/nodejs/api/stream#writablecork) est appelée plusieurs fois sur un flux, le même nombre d'appels à `writable.uncork()` doit être appelé pour vider les données mises en mémoire tampon.

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // Les données ne seront pas vidées tant que uncork() n'aura pas été appelé une deuxième fois.
  stream.uncork();
});
```
Voir aussi : [`writable.cork()`](/fr/nodejs/api/stream#writablecork).

##### `writable.writable` {#writablewritable}

**Ajoutée dans : v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` s'il est sûr d'appeler [`writable.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback), ce qui signifie que le flux n'a pas été détruit, n'a pas généré d'erreur ou n'est pas terminé.

##### `writable.writableAborted` {#writablewritableaborted}

**Ajoutée dans : v18.0.0, v16.17.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie si le flux a été détruit ou a généré une erreur avant d'émettre `'finish'`.


##### `writable.writableEnded` {#writablewritableended}

**Ajouté dans : v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après que [`writable.end()`](/fr/nodejs/api/stream#writableendchunk-encoding-callback) ait été appelé. Cette propriété n'indique pas si les données ont été vidées, utilisez plutôt [`writable.writableFinished`](/fr/nodejs/api/stream#writablewritablefinished) pour cela.

##### `writable.writableCorked` {#writablewritablecorked}

**Ajouté dans : v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Nombre de fois où [`writable.uncork()`](/fr/nodejs/api/stream#writableuncork) doit être appelé pour décorker complètement le flux.

##### `writable.errored` {#writableerrored}

**Ajouté dans : v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Retourne une erreur si le flux a été détruit avec une erreur.

##### `writable.writableFinished` {#writablewritablefinished}

**Ajouté dans : v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est défini sur `true` immédiatement avant que l'événement [`'finish'`](/fr/nodejs/api/stream#event-finish) ne soit émis.

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**Ajouté dans : v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne la valeur de `highWaterMark` transmise lors de la création de cet `Writable`.

##### `writable.writableLength` {#writablewritablelength}

**Ajouté dans : v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cette propriété contient le nombre d'octets (ou d'objets) dans la file d'attente, prêts à être écrits. La valeur fournit des données d'introspection concernant l'état du `highWaterMark`.

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**Ajouté dans : v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` si le tampon du flux est plein et que le flux émettra `'drain'`.


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**Ajouté dans : v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter pour la propriété `objectMode` d’un flux `Writable` donné.

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**Ajouté dans : v22.4.0, v20.16.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Appelle [`writable.destroy()`](/fr/nodejs/api/stream#writabledestroyerror) avec un `AbortError` et renvoie une promesse qui est tenue lorsque le flux est terminé.

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | L’argument `chunk` peut maintenant être une instance `TypedArray` ou `DataView`. |
| v8.0.0 | L’argument `chunk` peut maintenant être une instance `Uint8Array`. |
| v6.0.0 | Passer `null` comme paramètre `chunk` sera toujours considéré comme invalide maintenant, même en mode objet. |
| v0.9.4 | Ajouté dans : v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Données optionnelles à écrire. Pour les flux qui ne fonctionnent pas en mode objet, `chunk` doit être une [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Pour les flux en mode objet, `chunk` peut être n’importe quelle valeur JavaScript autre que `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L’encodage, si `chunk` est une chaîne de caractères. **Par défaut :** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback pour lorsque ce morceau de données est vidé.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si le flux souhaite que le code appelant attende que l’événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon `true`.

La méthode `writable.write()` écrit des données dans le flux et appelle le `callback` fourni une fois que les données ont été entièrement traitées. Si une erreur se produit, le `callback` est appelé avec l’erreur comme premier argument. Le `callback` est appelé de manière asynchrone et avant l’émission de `'error'`.

La valeur de retour est `true` si le buffer interne est inférieur à `highWaterMark` configuré lors de la création du flux après l’admission de `chunk`. Si `false` est retourné, d’autres tentatives d’écriture de données dans le flux doivent s’arrêter jusqu’à ce que l’événement [`'drain'`](/fr/nodejs/api/stream#event-drain) soit émis.

Tant qu’un flux ne se vide pas, les appels à `write()` mettront en buffer `chunk` et retourneront false. Une fois que tous les chunks actuellement mis en buffer sont vidés (acceptés pour la livraison par le système d’exploitation), l’événement `'drain'` est émis. Une fois que `write()` retourne false, n’écrivez plus de chunks jusqu’à ce que l’événement `'drain'` soit émis. Bien qu’il soit autorisé d’appeler `write()` sur un flux qui ne se vide pas, Node.js mettra en buffer tous les chunks écrits jusqu’à ce que l’utilisation maximale de la mémoire se produise, auquel cas il abandonnera inconditionnellement. Même avant d’abandonner, une utilisation élevée de la mémoire entraînera de mauvaises performances du garbage collector et un RSS élevé (qui n’est généralement pas restitué au système, même après que la mémoire n’est plus nécessaire). Étant donné que les sockets TCP peuvent ne jamais se vider si le pair distant ne lit pas les données, l’écriture d’un socket qui ne se vide pas peut entraîner une vulnérabilité exploitable à distance.

L’écriture de données alors que le flux ne se vide pas est particulièrement problématique pour un [`Transform`](/fr/nodejs/api/stream#class-streamtransform), car les flux `Transform` sont mis en pause par défaut jusqu’à ce qu’ils soient connectés ou qu’un gestionnaire d’événements `'data'` ou `'readable'` soit ajouté.

Si les données à écrire peuvent être générées ou récupérées à la demande, il est recommandé d’encapsuler la logique dans un [`Readable`](/fr/nodejs/api/stream#class-streamreadable) et d’utiliser [`stream.pipe()`](/fr/nodejs/api/stream#readablepipedestination-options). Cependant, si l’appel de `write()` est préféré, il est possible de respecter la contre-pression et d’éviter les problèmes de mémoire en utilisant l’événement [`'drain'`](/fr/nodejs/api/stream#event-drain) :

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// Attendre que cb soit appelé avant d’effectuer toute autre écriture.
write('hello', () => {
  console.log('Écriture terminée, effectuez d’autres écritures maintenant.');
});
```
Un flux `Writable` en mode objet ignore toujours l’argument `encoding`.


### Flux lisibles {#readable-streams}

Les flux lisibles sont une abstraction pour une *source* à partir de laquelle les données sont consommées.

Les exemples de flux `Readable` incluent :

- [Réponses HTTP, sur le client](/fr/nodejs/api/http#class-httpincomingmessage)
- [Requêtes HTTP, sur le serveur](/fr/nodejs/api/http#class-httpincomingmessage)
- [Flux de lecture fs](/fr/nodejs/api/fs#class-fsreadstream)
- [Flux zlib](/fr/nodejs/api/zlib)
- [Flux crypto](/fr/nodejs/api/crypto)
- [Sockets TCP](/fr/nodejs/api/net#class-netsocket)
- [stdout et stderr du processus enfant](/fr/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/fr/nodejs/api/process#processstdin)

Tous les flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable) implémentent l'interface définie par la classe `stream.Readable`.

#### Deux modes de lecture {#two-reading-modes}

Les flux `Readable` fonctionnent effectivement dans l'un des deux modes suivants : flux continu et pause. Ces modes sont distincts du [mode objet](/fr/nodejs/api/stream#object-mode). Un flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable) peut être en mode objet ou non, qu'il soit en mode flux continu ou en mode pause.

- En mode flux continu, les données sont lues automatiquement à partir du système sous-jacent et fournies à une application le plus rapidement possible à l'aide d'événements via l'interface [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter).
- En mode pause, la méthode [`stream.read()`](/fr/nodejs/api/stream#readablereadsize) doit être appelée explicitement pour lire des blocs de données à partir du flux.

Tous les flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable) commencent en mode pause mais peuvent être basculés en mode flux continu de l'une des manières suivantes :

- Ajout d'un gestionnaire d'événements [`'data'`](/fr/nodejs/api/stream#event-data).
- Appel de la méthode [`stream.resume()`](/fr/nodejs/api/stream#readableresume).
- Appel de la méthode [`stream.pipe()`](/fr/nodejs/api/stream#readablepipedestination-options) pour envoyer les données à un [`Writable`](/fr/nodejs/api/stream#class-streamwritable).

Le `Readable` peut revenir en mode pause en utilisant l'une des méthodes suivantes :

- S'il n'y a pas de destinations de tube, en appelant la méthode [`stream.pause()`](/fr/nodejs/api/stream#readablepause).
- S'il y a des destinations de tube, en supprimant toutes les destinations de tube. Plusieurs destinations de tube peuvent être supprimées en appelant la méthode [`stream.unpipe()`](/fr/nodejs/api/stream#readableunpipedestination).

Le concept important à retenir est qu'un `Readable` ne générera pas de données tant qu'un mécanisme de consommation ou d'ignorance de ces données n'est pas fourni. Si le mécanisme de consommation est désactivé ou supprimé, le `Readable` *tentera* d'arrêter de générer les données.

Pour des raisons de compatibilité ascendante, la suppression des gestionnaires d'événements [`'data'`](/fr/nodejs/api/stream#event-data) ne mettra **pas** automatiquement le flux en pause. De plus, s'il existe des destinations pipelined, l'appel de [`stream.pause()`](/fr/nodejs/api/stream#readablepause) ne garantira pas que le flux *restera* en pause une fois que ces destinations seront épuisées et demanderont plus de données.

Si un [`Readable`](/fr/nodejs/api/stream#class-streamreadable) est basculé en mode flux continu et qu'il n'y a pas de consommateurs disponibles pour traiter les données, ces données seront perdues. Cela peut se produire, par exemple, lorsque la méthode `readable.resume()` est appelée sans qu'un écouteur ne soit attaché à l'événement `'data'`, ou lorsqu'un gestionnaire d'événements `'data'` est supprimé du flux.

L'ajout d'un gestionnaire d'événements [`'readable'`](/fr/nodejs/api/stream#event-readable) arrête automatiquement le flux, et les données doivent être consommées via [`readable.read()`](/fr/nodejs/api/stream#readablereadsize). Si le gestionnaire d'événements [`'readable'`](/fr/nodejs/api/stream#event-readable) est supprimé, le flux redémarrera s'il existe un gestionnaire d'événements [`'data'`](/fr/nodejs/api/stream#event-data).


#### Trois états {#three-states}

Les « deux modes » de fonctionnement d’un flux `Readable` sont une abstraction simplifiée pour la gestion d’état interne plus complexe qui se produit au sein de l’implémentation du flux `Readable`.

Plus précisément, à un moment donné, chaque `Readable` se trouve dans l’un des trois états possibles :

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

Lorsque `readable.readableFlowing` est `null`, aucun mécanisme de consommation des données du flux n’est fourni. Par conséquent, le flux ne génère pas de données. Dans cet état, attacher un écouteur à l’événement `'data'`, appeler la méthode `readable.pipe()` ou appeler la méthode `readable.resume()` fait passer `readable.readableFlowing` à `true`, ce qui amène le `Readable` à commencer à émettre activement des événements lorsque des données sont générées.

Appeler `readable.pause()`, `readable.unpipe()` ou recevoir une contre-pression fait passer `readable.readableFlowing` à `false`, ce qui interrompt temporairement le flux d’événements, mais *sans* interrompre la génération de données. Dans cet état, attacher un écouteur à l’événement `'data'` ne fait pas passer `readable.readableFlowing` à `true`.

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing est maintenant false.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing est toujours false.
pass.write('ok');  // N’émettra pas 'data'.
pass.resume();     // Doit être appelé pour que le flux émette 'data'.
// readableFlowing est maintenant true.
```

Tant que `readable.readableFlowing` est `false`, les données peuvent s’accumuler dans le tampon interne du flux.

#### Choisir un style d’API {#choose-one-api-style}

L’API de flux `Readable` a évolué au fil des versions de Node.js et fournit plusieurs méthodes de consommation des données de flux. En général, les développeurs doivent choisir *l’une* des méthodes de consommation des données et *ne doivent jamais* utiliser plusieurs méthodes pour consommer les données d’un seul flux. Plus précisément, l’utilisation d’une combinaison de `on('data')`, `on('readable')`, `pipe()` ou d’itérateurs asynchrones peut entraîner un comportement non intuitif.


#### Classe : `stream.Readable` {#class-streamreadable}

**Ajouté dans : v0.9.4**

##### Événement : `'close'` {#event-close_1}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Ajout de l'option `emitClose` pour spécifier si `'close'` est émis lors de la destruction. |
| v0.9.4 | Ajouté dans : v0.9.4 |
:::

L'événement `'close'` est émis lorsque le flux et toutes ses ressources sous-jacentes (un descripteur de fichier, par exemple) ont été fermés. L'événement indique qu'aucun autre événement ne sera émis et qu'aucun autre calcul n'aura lieu.

Un flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable) émettra toujours l'événement `'close'` s'il est créé avec l'option `emitClose`.

##### Événement : `'data'` {#event-data}

**Ajouté dans : v0.9.4**

- `chunk` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Le bloc de données. Pour les flux qui ne fonctionnent pas en mode objet, le bloc sera soit une chaîne de caractères, soit un `Buffer`. Pour les flux qui sont en mode objet, le bloc peut être n'importe quelle valeur JavaScript autre que `null`.

L'événement `'data'` est émis chaque fois que le flux cède la propriété d'un bloc de données à un consommateur. Cela peut se produire chaque fois que le flux est basculé en mode continu en appelant `readable.pipe()`, `readable.resume()` ou en attachant une fonction de rappel d'écouteur à l'événement `'data'`. L'événement `'data'` sera également émis chaque fois que la méthode `readable.read()` est appelée et qu'un bloc de données est disponible pour être renvoyé.

L'attache d'un écouteur d'événement `'data'` à un flux qui n'a pas été explicitement mis en pause basculera le flux en mode continu. Les données seront ensuite transmises dès qu'elles seront disponibles.

La fonction de rappel de l'écouteur recevra le bloc de données sous forme de chaîne de caractères si un encodage par défaut a été spécifié pour le flux à l'aide de la méthode `readable.setEncoding()`; sinon, les données seront transmises sous forme de `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

##### Événement : `'end'` {#event-end}

**Ajouté dans : v0.9.4**

L’événement `'end'` est émis lorsqu’il n’y a plus de données à consommer depuis le flux.

L’événement `'end'` **ne sera pas émis** à moins que les données ne soient complètement consommées. Cela peut être accompli en basculant le flux en mode continu, ou en appelant [`stream.read()`](/fr/nodejs/api/stream#readablereadsize) de manière répétée jusqu’à ce que toutes les données aient été consommées.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
});
```
##### Événement : `'error'` {#event-error_1}

**Ajouté dans : v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L’événement `'error'` peut être émis par une implémentation `Readable` à tout moment. Généralement, cela peut se produire si le flux sous-jacent est incapable de générer des données en raison d’une défaillance interne sous-jacente, ou lorsqu’une implémentation de flux tente d’envoyer un bloc de données non valide.

Le rappel de l’écouteur recevra un seul objet `Error`.

##### Événement : `'pause'` {#event-pause}

**Ajouté dans : v0.9.4**

L’événement `'pause'` est émis lorsque [`stream.pause()`](/fr/nodejs/api/stream#readablepause) est appelé et que `readableFlowing` n’est pas `false`.

##### Événement : `'readable'` {#event-readable}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | L’événement `'readable'` est toujours émis au prochain tick après l’appel de `.push()`. |
| v10.0.0 | L’utilisation de `'readable'` nécessite l’appel de `.read()`. |
| v0.9.4 | Ajouté dans : v0.9.4 |
:::

L’événement `'readable'` est émis lorsque des données sont disponibles pour être lues depuis le flux, jusqu’à la limite de remplissage configurée (`state.highWaterMark`). Effectivement, il indique que le flux contient de nouvelles informations dans le buffer. Si des données sont disponibles dans ce buffer, [`stream.read()`](/fr/nodejs/api/stream#readablereadsize) peut être appelé pour récupérer ces données. De plus, l’événement `'readable'` peut également être émis lorsque la fin du flux a été atteinte.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // Il y a des données à lire maintenant.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
Si la fin du flux a été atteinte, appeler [`stream.read()`](/fr/nodejs/api/stream#readablereadsize) renverra `null` et déclenchera l’événement `'end'`. Cela est également vrai s’il n’y a jamais eu de données à lire. Par exemple, dans l’exemple suivant, `foo.txt` est un fichier vide :

```js [ESM]
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```
La sortie de l’exécution de ce script est :

```bash [BASH]
$ node test.js
readable: null
end
```
Dans certains cas, l’attache d’un écouteur pour l’événement `'readable'` entraînera la lecture d’une certaine quantité de données dans un buffer interne.

En général, les mécanismes `readable.pipe()` et de l’événement `'data'` sont plus faciles à comprendre que l’événement `'readable'`. Cependant, la gestion de `'readable'` peut entraîner un débit accru.

Si `'readable'` et [`'data'`](/fr/nodejs/api/stream#event-data) sont utilisés en même temps, `'readable'` a la priorité dans le contrôle du flux, c’est-à-dire que `'data'` ne sera émis que lorsque [`stream.read()`](/fr/nodejs/api/stream#readablereadsize) est appelé. La propriété `readableFlowing` deviendrait `false`. S’il existe des écouteurs `'data'` lorsque `'readable'` est supprimé, le flux commencera à couler, c’est-à-dire que les événements `'data'` seront émis sans appeler `.resume()`.


##### Événement: `'resume'` {#event-resume}

**Ajouté dans : v0.9.4**

L'événement `'resume'` est émis lorsque [`stream.resume()`](/fr/nodejs/api/stream#readableresume) est appelé et que `readableFlowing` n'est pas `true`.

##### `readable.destroy([error])` {#readabledestroyerror}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Fonctionne comme une no-op sur un flux qui a déjà été détruit. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Erreur qui sera transmise comme charge utile dans l'événement `'error'`
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Détruit le flux. Émet facultativement un événement `'error'` et émet un événement `'close'` (sauf si `emitClose` est défini sur `false`). Après cet appel, le flux lisible libère toutes les ressources internes et les appels suivants à `push()` seront ignorés.

Une fois que `destroy()` a été appelé, tous les appels ultérieurs seront des no-op et aucune autre erreur, à l'exception de celles de `_destroy()`, ne peut être émise en tant que `'error'`.

Les implémenteurs ne doivent pas remplacer cette méthode, mais plutôt implémenter [`readable._destroy()`](/fr/nodejs/api/stream#readable_destroyerr-callback).

##### `readable.closed` {#readableclosed}

**Ajouté dans : v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après l'émission de `'close'`.

##### `readable.destroyed` {#readabledestroyed}

**Ajouté dans : v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après l'appel de [`readable.destroy()`](/fr/nodejs/api/stream#readabledestroyerror).

##### `readable.isPaused()` {#readableispaused}

**Ajouté dans : v0.11.14**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La méthode `readable.isPaused()` renvoie l'état de fonctionnement actuel du `Readable`. Ceci est principalement utilisé par le mécanisme qui sous-tend la méthode `readable.pipe()`. Dans la plupart des cas typiques, il n'y aura aucune raison d'utiliser cette méthode directement.

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()` {#readablepause}

**Ajouté dans : v0.9.4**

- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

La méthode `readable.pause()` fera qu'un flux en mode flux cesse d'émettre des événements [`'data'`](/fr/nodejs/api/stream#event-data), quittant le mode flux. Toutes les données qui deviennent disponibles restent dans le tampon interne.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```

La méthode `readable.pause()` n'a aucun effet s'il existe un écouteur d'événements `'readable'`.

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**Ajouté dans : v0.9.4**

- `destination` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable) Destination pour l'écriture des données
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options du pipe
  - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Terminer l'écriture lorsque la lecture se termine. **Par défaut :** `true`.

- Retourne : [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable) La *destination*, permettant une chaîne de pipes s'il s'agit d'un flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) ou [`Transform`](/fr/nodejs/api/stream#class-streamtransform)

La méthode `readable.pipe()` attache un flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) au `readable`, le faisant passer automatiquement en mode flux et en poussant toutes ses données vers le [`Writable`](/fr/nodejs/api/stream#class-streamwritable) attaché. Le flux de données sera géré automatiquement afin que le flux `Writable` de destination ne soit pas submergé par un flux `Readable` plus rapide.

L'exemple suivant pipe toutes les données du `readable` dans un fichier nommé `file.txt` :

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt'.
readable.pipe(writable);
```

Il est possible d'attacher plusieurs flux `Writable` à un seul flux `Readable`.

La méthode `readable.pipe()` renvoie une référence au flux *destination*, ce qui permet de mettre en place des chaînes de flux pipés :

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```

Par défaut, [`stream.end()`](/fr/nodejs/api/stream#writableendchunk-encoding-callback) est appelé sur le flux `Writable` de destination lorsque le flux `Readable` source émet [`'end'`](/fr/nodejs/api/stream#event-end), de sorte que la destination ne soit plus accessible en écriture. Pour désactiver ce comportement par défaut, l'option `end` peut être passée comme `false`, ce qui permet au flux de destination de rester ouvert :

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```

Un avertissement important est que si le flux `Readable` émet une erreur pendant le traitement, la destination `Writable` *n'est pas fermée* automatiquement. Si une erreur se produit, il sera nécessaire de fermer *manuellement* chaque flux afin d'éviter les fuites de mémoire.

Les flux `Writable` [`process.stderr`](/fr/nodejs/api/process#processstderr) et [`process.stdout`](/fr/nodejs/api/process#processstdout) ne sont jamais fermés tant que le processus Node.js n'est pas terminé, quelles que soient les options spécifiées.


##### `readable.read([size])` {#readablereadsize}

**Ajouté dans : v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Argument optionnel pour spécifier la quantité de données à lire.
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La méthode `readable.read()` lit les données du buffer interne et les retourne. Si aucune donnée n'est disponible pour être lue, `null` est retourné. Par défaut, les données sont retournées en tant qu'objet `Buffer`, sauf si un encodage a été spécifié à l'aide de la méthode `readable.setEncoding()` ou si le flux fonctionne en mode objet.

L'argument optionnel `size` spécifie un nombre spécifique d'octets à lire. Si `size` octets ne sont pas disponibles pour être lus, `null` sera retourné *sauf si* le flux s'est terminé, auquel cas toutes les données restantes dans le buffer interne seront retournées.

Si l'argument `size` n'est pas spécifié, toutes les données contenues dans le buffer interne seront retournées.

L'argument `size` doit être inférieur ou égal à 1 Gio.

La méthode `readable.read()` ne doit être appelée que sur les flux `Readable` fonctionnant en mode pause. En mode flux, `readable.read()` est appelé automatiquement jusqu'à ce que le buffer interne soit complètement vidé.

```js [ESM]
const readable = getReadableStreamSomehow();

// 'readable' peut être déclenché plusieurs fois lorsque des données sont mises en buffer
readable.on('readable', () => {
  let chunk;
  console.log('Le flux est lisible (nouvelles données reçues dans le buffer)');
  // Utilisez une boucle pour vous assurer que nous lisons toutes les données actuellement disponibles
  while (null !== (chunk = readable.read())) {
    console.log(`Lecture de ${chunk.length} octets de données...`);
  }
});

// 'end' sera déclenché une fois lorsqu'il n'y aura plus de données disponibles
readable.on('end', () => {
  console.log('Fin du flux atteinte.');
});
```
Chaque appel à `readable.read()` renvoie un chunk de données ou `null`, ce qui signifie qu'il n'y a plus de données à lire pour le moment. Ces chunks ne sont pas automatiquement concaténés. Étant donné qu'un seul appel `read()` ne renvoie pas toutes les données, l'utilisation d'une boucle while peut être nécessaire pour lire continuellement les chunks jusqu'à ce que toutes les données soient récupérées. Lors de la lecture d'un fichier volumineux, `.read()` peut renvoyer temporairement `null`, ce qui indique qu'il a consommé tout le contenu mis en buffer mais qu'il peut y avoir encore plus de données à mettre en buffer. Dans de tels cas, un nouvel événement `'readable'` est émis une fois qu'il y a plus de données dans le buffer, et l'événement `'end'` signifie la fin de la transmission des données.

Par conséquent, pour lire l'intégralité du contenu d'un fichier à partir d'un `readable`, il est nécessaire de collecter des chunks à travers plusieurs événements `'readable'` :

```js [ESM]
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```
Un flux `Readable` en mode objet renverra toujours un seul élément d'un appel à [`readable.read(size)`](/fr/nodejs/api/stream#readablereadsize), quelle que soit la valeur de l'argument `size`.

Si la méthode `readable.read()` retourne un chunk de données, un événement `'data'` sera également émis.

L'appel de [`stream.read([size])`](/fr/nodejs/api/stream#readablereadsize) après l'émission de l'événement [`'end'`](/fr/nodejs/api/stream#event-end) retournera `null`. Aucune erreur d'exécution ne sera levée.


##### `readable.readable` {#readablereadable}

**Ajoutée dans : v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` si on peut appeler en toute sécurité [`readable.read()`](/fr/nodejs/api/stream#readablereadsize), ce qui signifie que le flux n’a pas été détruit ou n’a pas émis `'error'` ou `'end'`.

##### `readable.readableAborted` {#readablereadableaborted}

**Ajoutée dans : v16.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie si le flux a été détruit ou a généré une erreur avant d’émettre `'end'`.

##### `readable.readableDidRead` {#readablereadabledidread}

**Ajoutée dans : v16.7.0, v14.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie si `'data'` a été émis.

##### `readable.readableEncoding` {#readablereadableencoding}

**Ajoutée dans : v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Getter pour la propriété `encoding` d’un flux `Readable` donné. La propriété `encoding` peut être définie à l’aide de la méthode [`readable.setEncoding()`](/fr/nodejs/api/stream#readablesetencodingencoding).

##### `readable.readableEnded` {#readablereadableended}

**Ajoutée dans : v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devient `true` lorsque l’événement [`'end'`](/fr/nodejs/api/stream#event-end) est émis.

##### `readable.errored` {#readableerrored}

**Ajoutée dans : v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Renvoie une erreur si le flux a été détruit avec une erreur.

##### `readable.readableFlowing` {#readablereadableflowing}

**Ajoutée dans : v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette propriété reflète l’état actuel d’un flux `Readable` tel que décrit dans la section [Trois états](/fr/nodejs/api/stream#three-states).


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**Ajouté dans : v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Renvoie la valeur de `highWaterMark` passée lors de la création de ce `Readable`.

##### `readable.readableLength` {#readablereadablelength}

**Ajouté dans : v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cette propriété contient le nombre d'octets (ou d'objets) dans la file d'attente prêts à être lus. La valeur fournit des données d'introspection concernant l'état de `highWaterMark`.

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**Ajouté dans : v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter pour la propriété `objectMode` d'un flux `Readable` donné.

##### `readable.resume()` {#readableresume}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | `resume()` n'a aucun effet s'il y a un écouteur d'événement `'readable'`. |
| v0.9.4 | Ajouté dans : v0.9.4 |
:::

- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

La méthode `readable.resume()` fait qu'un flux `Readable` explicitement mis en pause reprend l'émission d'événements [`'data'`](/fr/nodejs/api/stream#event-data), faisant passer le flux en mode de flux continu.

La méthode `readable.resume()` peut être utilisée pour consommer entièrement les données d'un flux sans réellement traiter ces données :

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Atteint la fin, mais n'a rien lu.');
  });
```
La méthode `readable.resume()` n'a aucun effet s'il existe un écouteur d'événement `'readable'`.

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**Ajouté dans : v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage à utiliser.
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

La méthode `readable.setEncoding()` définit l'encodage des caractères pour les données lues à partir du flux `Readable`.

Par défaut, aucun encodage n'est attribué et les données du flux seront renvoyées sous forme d'objets `Buffer`. La définition d'un encodage fait que les données du flux sont renvoyées sous forme de chaînes de l'encodage spécifié plutôt que sous forme d'objets `Buffer`. Par exemple, appeler `readable.setEncoding('utf8')` entraînera l'interprétation des données de sortie comme des données UTF-8 et leur transmission sous forme de chaînes. L'appel de `readable.setEncoding('hex')` entraînera l'encodage des données au format de chaîne hexadécimale.

Le flux `Readable` gérera correctement les caractères multi-octets livrés via le flux qui, autrement, seraient mal décodés s'ils étaient simplement extraits du flux en tant qu'objets `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Obtenu %d caractères de données de chaîne :', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**Ajouté dans : v0.9.4**

- `destination` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable) Flux spécifique optionnel pour supprimer le pipe
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

La méthode `readable.unpipe()` détache un flux `Writable` précédemment attaché en utilisant la méthode [`stream.pipe()`](/fr/nodejs/api/stream#readablepipedestination-options).

Si la `destination` n'est pas spécifiée, alors *tous* les pipes sont détachés.

Si la `destination` est spécifiée, mais qu'aucun pipe n'est configuré pour celui-ci, alors la méthode ne fait rien.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Toutes les données de readable vont dans 'file.txt',
// mais seulement pendant la première seconde.
readable.pipe(writable);
setTimeout(() => {
  console.log('Arrêt de l'écriture dans file.txt.');
  readable.unpipe(writable);
  console.log('Fermeture manuelle du flux de fichiers.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | L'argument `chunk` peut maintenant être une instance `TypedArray` ou `DataView`. |
| v8.0.0 | L'argument `chunk` peut maintenant être une instance `Uint8Array`. |
| v0.9.11 | Ajouté dans : v0.9.11 |
:::

- `chunk` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Bloc de données à remettre en tête de la file d'attente de lecture. Pour les flux ne fonctionnant pas en mode objet, `chunk` doit être une [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), un [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), un [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ou `null`. Pour les flux en mode objet, `chunk` peut être n'importe quelle valeur JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Encodage des blocs de type string. Doit être un encodage `Buffer` valide, tel que `'utf8'` ou `'ascii'`.

Passer `chunk` en tant que `null` signale la fin du flux (EOF) et se comporte de la même manière que `readable.push(null)`, après quoi aucune donnée supplémentaire ne peut être écrite. Le signal EOF est placé à la fin du tampon et toutes les données mises en mémoire tampon seront toujours vidées.

La méthode `readable.unshift()` repousse un bloc de données dans le tampon interne. Ceci est utile dans certaines situations où un flux est consommé par un code qui a besoin de « dé-consommer » une certaine quantité de données qu'il a extraites de manière optimiste de la source, afin que les données puissent être transmises à une autre partie.

La méthode `stream.unshift(chunk)` ne peut pas être appelée après que l'événement [`'end'`](/fr/nodejs/api/stream#event-end) ait été émis, sinon une erreur d'exécution sera levée.

Les développeurs qui utilisent `stream.unshift()` devraient souvent envisager d'utiliser plutôt un flux [`Transform`](/fr/nodejs/api/stream#class-streamtransform). Voir la section [API pour les implémenteurs de flux](/fr/nodejs/api/stream#api-for-stream-implementers) pour plus d'informations.

```js [ESM]
// Extraire un en-tête délimité par \n\n.
// Utiliser unshift() si nous en avons trop.
// Appeler le callback avec (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // En-tête de limite trouvé.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Supprimer l'écouteur 'readable' avant d'utiliser unshift.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Maintenant, le corps du message peut être lu depuis le flux.
        callback(null, header, stream);
        return;
      }
      // Toujours en train de lire l'en-tête.
      header += str;
    }
  }
}
```
Contrairement à [`stream.push(chunk)`](/fr/nodejs/api/stream#readablepushchunk-encoding), `stream.unshift(chunk)` ne mettra pas fin au processus de lecture en réinitialisant l'état de lecture interne du flux. Cela peut entraîner des résultats inattendus si `readable.unshift()` est appelé pendant une lecture (c'est-à-dire à partir d'une implémentation [`stream._read()`](/fr/nodejs/api/stream#readable_readsize) sur un flux personnalisé). Faire suivre l'appel à `readable.unshift()` d'un [`stream.push('')`](/fr/nodejs/api/stream#readablepushchunk-encoding) immédiat réinitialisera l'état de lecture de manière appropriée, mais il est préférable d'éviter simplement d'appeler `readable.unshift()` pendant le processus d'exécution d'une lecture.


##### `readable.wrap(stream)` {#readablewrapstream}

**Ajouté dans : v0.9.4**

- `stream` [\<Stream\>](/fr/nodejs/api/stream#stream) Un flux lisible de "style ancien"
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Avant Node.js 0.10, les flux n'implémentaient pas l'intégralité de l'API du module `node:stream` telle qu'elle est actuellement définie. (Voir [Compatibilité](/fr/nodejs/api/stream#compatibility-with-older-nodejs-versions) pour plus d'informations.)

Lorsque vous utilisez une ancienne bibliothèque Node.js qui émet des événements [`'data'`](/fr/nodejs/api/stream#event-data) et qui possède une méthode [`stream.pause()`](/fr/nodejs/api/stream#readablepause) qui n'est qu'informative, la méthode `readable.wrap()` peut être utilisée pour créer un flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable) qui utilise l'ancien flux comme source de données.

Il sera rarement nécessaire d'utiliser `readable.wrap()`, mais la méthode a été fournie pour faciliter l'interaction avec les anciennes applications et bibliothèques Node.js.

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // etc.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.14.0 | La prise en charge de Symbol.asyncIterator n'est plus expérimentale. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- Retourne : [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) pour consommer entièrement le flux.

```js [ESM]
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```
Si la boucle se termine par un `break`, `return` ou un `throw`, le flux sera détruit. En d'autres termes, itérer sur un flux consommera entièrement le flux. Le flux sera lu par blocs de taille égale à l'option `highWaterMark`. Dans l'exemple de code ci-dessus, les données seront dans un seul bloc si le fichier a moins de 64 Kio de données, car aucune option `highWaterMark` n'est fournie à [`fs.createReadStream()`](/fr/nodejs/api/fs#fscreatereadstreampath-options).


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**Ajouté dans : v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Appelle [`readable.destroy()`](/fr/nodejs/api/stream#readabledestroyerror) avec une `AbortError` et renvoie une promesse qui est résolue lorsque le flux est terminé.

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**Ajouté dans : v19.1.0, v18.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `stream` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est interrompu.
  
 
- Retourne : [\<Duplex\>](/fr/nodejs/api/stream#class-streamduplex) un flux composé avec le flux `stream`.

```js [ESM]
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['this is', 'compose as operator']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // Affiche ['this', 'is', 'compose', 'as', 'operator']
```
Voir [`stream.compose`](/fr/nodejs/api/stream#streamcomposestreams) pour plus d'informations.

##### `readable.iterator([options])` {#readableiteratoroptions}

**Ajouté dans : v16.3.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque défini sur `false`, l'appel de `return` sur l'itérateur asynchrone, ou la sortie d'une itération `for await...of` en utilisant un `break`, `return`, ou `throw` ne détruira pas le flux. **Par défaut :** `true`.
  
 
- Retourne : [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) pour consommer le flux.

L'itérateur créé par cette méthode donne aux utilisateurs la possibilité d'annuler la destruction du flux si la boucle `for await...of` est quittée par `return`, `break`, ou `throw`, ou si l'itérateur doit détruire le flux si le flux a émis une erreur pendant l'itération.

```js [ESM]
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Affiche 2 puis 3
  }

  console.log(readable.destroyed); // True, le flux a été totalement consommé
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])` {#readablemapfn-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.7.0, v18.19.0 | ajout de `highWaterMark` dans les options. |
| v17.4.0, v16.14.0 | Ajouté dans : v17.4.0, v16.14.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) une fonction à appliquer à chaque bloc du flux.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un bloc de données provenant du flux.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) abandonné si le flux est détruit, ce qui permet d'abandonner l'appel de `fn` plus tôt.
 
 
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre maximal d'invocations simultanées de `fn` à appeler sur le flux en même temps. **Par défaut :** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre d'éléments à mettre en mémoire tampon en attendant la consommation par l'utilisateur des éléments mappés. **Par défaut :** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.
 
- Retourne : [\<Readable\>](/fr/nodejs/api/stream#class-streamreadable) un flux mappé avec la fonction `fn`.

Cette méthode permet de mapper le flux. La fonction `fn` sera appelée pour chaque bloc du flux. Si la fonction `fn` renvoie une promesse, cette promesse sera `attendue` avant d'être transmise au flux de résultats.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Avec un mapper synchrone.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// Avec un mapper asynchrone, effectuant au plus 2 requêtes à la fois.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // Affiche le résultat DNS de resolver.resolve4.
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.7.0, v18.19.0 | Ajout de `highWaterMark` dans les options. |
| v17.4.0, v16.14.0 | Ajouté dans : v17.4.0, v16.14.0 |
:::

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) une fonction pour filtrer les chunks du flux.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk de données du flux.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) abandonné si le flux est détruit, ce qui permet d’abandonner l’appel `fn` plus tôt.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre maximal d’invocations simultanées de `fn` à appeler sur le flux à la fois. **Par défaut :** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre d’éléments à mettre en mémoire tampon en attendant la consommation par l’utilisateur des éléments filtrés. **Par défaut :** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.

- Retourne : [\<Readable\>](/fr/nodejs/api/stream#class-streamreadable) un flux filtré avec le prédicat `fn`.

Cette méthode permet de filtrer le flux. Pour chaque chunk du flux, la fonction `fn` sera appelée et si elle renvoie une valeur truthy, le chunk sera passé au flux de résultat. Si la fonction `fn` renvoie une promesse, cette promesse sera `await`ed.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Avec un prédicat synchrone.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Avec un prédicat asynchrone, effectuant au plus 2 requêtes à la fois.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // Affiche les domaines avec plus de 60 secondes sur l’enregistrement DNS résolu.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**Ajouté dans : v17.5.0, v16.15.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) une fonction à appeler sur chaque segment du flux.
    - `data` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) un segment de données du flux.
    - `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) abandonné si le flux est détruit, ce qui permet d'abandonner l'appel `fn` plus tôt.




- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) le nombre maximal d'invocations simultanées de `fn` à appeler sur le flux à la fois. **Par défaut :** `1`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.


- Retourne : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) une promesse pour quand le flux est terminé.

Cette méthode permet d'itérer sur un flux. Pour chaque segment du flux, la fonction `fn` sera appelée. Si la fonction `fn` retourne une promesse, cette promesse sera `attendue`.

Cette méthode diffère des boucles `for await...of` en ce sens qu'elle peut éventuellement traiter les segments simultanément. De plus, une itération `forEach` ne peut être arrêtée qu'en ayant transmis une option `signal` et en abandonnant le `AbortController` associé, tandis que `for await...of` peut être arrêté avec `break` ou `return`. Dans les deux cas, le flux sera détruit.

Cette méthode diffère de l'écoute de l'événement [`'data'`](/fr/nodejs/api/stream#event-data) en ce sens qu'elle utilise l'événement [`readable`](/fr/nodejs/api/stream#class-streamreadable) dans la machinerie sous-jacente et peut limiter le nombre d'appels `fn` simultanés.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// Avec un prédicat synchrone.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// Avec un prédicat asynchrone, effectuant au maximum 2 requêtes à la fois.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // Affiche le résultat, similaire à `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // Le flux est terminé
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**Ajouté dans : v17.5.0, v16.15.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d'annuler l'opération toArray si le signal est interrompu.
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) une promesse contenant un tableau avec le contenu du flux.

Cette méthode permet d'obtenir facilement le contenu d'un flux.

Comme cette méthode lit l'intégralité du flux en mémoire, elle annule les avantages des flux. Elle est destinée à l'interopérabilité et à la commodité, et non comme principale façon de consommer des flux.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// Effectuer des requêtes DNS simultanément à l'aide de .map et collecter
// les résultats dans un tableau à l'aide de toArray
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```
##### `readable.some(fn[, options])` {#readablesomefn-options}

**Ajouté dans : v17.5.0, v16.15.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) une fonction à appeler sur chaque bloc du flux.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un bloc de données du flux.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) abandonné si le flux est détruit, ce qui permet d'abandonner l'appel `fn` plus tôt.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre maximal d'invocations simultanées de `fn` à appeler sur le flux à la fois. **Par défaut :** `1`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) une promesse évaluant à `true` si `fn` a renvoyé une valeur truthy pour au moins l'un des blocs.

Cette méthode est similaire à `Array.prototype.some` et appelle `fn` sur chaque bloc du flux jusqu'à ce que la valeur de retour attendue soit `true` (ou toute valeur truthy). Une fois qu'un appel `fn` sur un bloc a renvoyé une valeur truthy, le flux est détruit et la promesse est remplie avec `true`. Si aucun des appels `fn` sur les blocs ne renvoie une valeur truthy, la promesse est remplie avec `false`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Avec un prédicat synchrone.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// Avec un prédicat asynchrone, effectuant au plus 2 vérifications de fichiers à la fois.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // `true` si un fichier de la liste est supérieur à 1 Mo
console.log('done'); // Le flux est terminé
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**Ajouté dans : v17.5.0, v16.17.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) une fonction à appeler sur chaque morceau du flux.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un morceau de données provenant du flux.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) abandonné si le flux est détruit, ce qui permet d'abandonner l'appel `fn` plus tôt.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre maximal d'invocations simultanées de `fn` à appeler sur le flux en même temps. **Par défaut :** `1`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.


- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) une promesse évaluant au premier morceau pour lequel `fn` a été évalué avec une valeur truthy, ou `undefined` si aucun élément n'a été trouvé.

Cette méthode est similaire à `Array.prototype.find` et appelle `fn` sur chaque morceau du flux pour trouver un morceau avec une valeur truthy pour `fn`. Une fois que la valeur de retour attendue d'un appel `fn` est truthy, le flux est détruit et la promesse est tenue avec la valeur pour laquelle `fn` a renvoyé une valeur truthy. Si tous les appels `fn` sur les morceaux renvoient une valeur falsy, la promesse est tenue avec `undefined`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Avec un prédicat synchrone.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// Avec un prédicat asynchrone, effectuant au plus 2 vérifications de fichier à la fois.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // Nom de fichier du gros fichier, si un fichier de la liste est plus grand que 1 Mo
console.log('done'); // Le flux est terminé
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**Ajouté dans: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) une fonction à appeler sur chaque morceau du flux.
    - `data` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) un morceau de données provenant du flux.
    - `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) annulé si le flux est détruit permettant d'annuler l'appel de `fn` plus tôt.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) le nombre maximal d'invocations simultanées de `fn` à appeler sur le flux à la fois. **Par défaut:** `1`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est annulé.
  
 
- Retourne: [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) une promesse évaluant à `true` si `fn` a renvoyé une valeur truthy pour tous les morceaux.

Cette méthode est similaire à `Array.prototype.every` et appelle `fn` sur chaque morceau dans le flux pour vérifier si toutes les valeurs de retour attendues sont des valeurs truthy pour `fn`. Une fois qu'un appel `fn` sur une valeur de retour attendue de morceau est falsy, le flux est détruit et la promesse est remplie avec `false`. Si tous les appels `fn` sur les morceaux renvoient une valeur truthy, la promesse est remplie avec `true`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// Avec un prédicat synchrone.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// Avec un prédicat asynchrone, effectuant au plus 2 vérifications de fichiers à la fois.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// `true` si tous les fichiers de la liste sont plus grands que 1MiB
console.log(allBigFiles);
console.log('done'); // Le flux est terminé
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Ajouté dans : v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) Une fonction à mapper sur chaque chunk du flux.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) un chunk de données du flux.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) abandonné si le flux est détruit, ce qui permet d'abandonner l'appel `fn` plus tôt.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre maximal d'invocations simultanées de `fn` à appeler sur le flux en même temps. **Par défaut :** `1`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.


- Renvoie : [\<Readable\>](/fr/nodejs/api/stream#class-streamreadable) un flux aplati avec la fonction `fn`.

Cette méthode renvoie un nouveau flux en appliquant le rappel donné à chaque chunk du flux, puis en aplatissant le résultat.

Il est possible de renvoyer un flux ou un autre itérable ou itérable asynchrone depuis `fn` et les flux de résultats seront fusionnés (aplatis) dans le flux renvoyé.

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// Avec un mapper synchrone.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// Avec un mapper asynchrone, combine le contenu de 4 fichiers
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // Cela contiendra le contenu (tous les chunks) des 4 fichiers
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**Ajouté dans : v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) : nombre de blocs à supprimer du readable.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.


- Retourne : [\<Readable\>](/fr/nodejs/api/stream#class-streamreadable) : un flux avec `limit` blocs supprimés.

Cette méthode renvoie un nouveau flux avec les premiers `limit` blocs supprimés.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**Ajouté dans : v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) : nombre de blocs à extraire du readable.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.


- Retourne : [\<Readable\>](/fr/nodejs/api/stream#class-streamreadable) : un flux avec `limit` blocs extraits.

Cette méthode renvoie un nouveau flux avec les premiers `limit` blocs.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**Ajouté dans : v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) : fonction de réduction à appeler sur chaque bloc du flux.
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) : valeur obtenue lors du dernier appel à `fn` ou la valeur `initial` si elle est spécifiée, ou le premier bloc du flux sinon.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) : un bloc de données du flux.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) abandonné si le flux est détruit, ce qui permet d’abandonner l’appel `fn` plus tôt.



- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) : valeur initiale à utiliser dans la réduction.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de détruire le flux si le signal est abandonné.


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) : une promesse pour la valeur finale de la réduction.

Cette méthode appelle `fn` sur chaque bloc du flux dans l’ordre, en lui passant le résultat du calcul sur l’élément précédent. Elle renvoie une promesse pour la valeur finale de la réduction.

Si aucune valeur `initial` n’est fournie, le premier bloc du flux est utilisé comme valeur initiale. Si le flux est vide, la promesse est rejetée avec une erreur `TypeError` avec la propriété de code `ERR_INVALID_ARGS`.

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```
La fonction de réduction itère le flux élément par élément, ce qui signifie qu’il n’y a pas de paramètre `concurrency` ni de parallélisme. Pour effectuer une `reduce` simultanément, vous pouvez extraire la fonction asynchrone dans la méthode [`readable.map`](/fr/nodejs/api/stream#readablemapfn-options).

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### Flux bidirectionnel et flux de transformation {#duplex-and-transform-streams}

#### Classe : `stream.Duplex` {#class-streamduplex}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.8.0 | Les instances de `Duplex` renvoient désormais `true` lors de la vérification de `instanceof stream.Writable`. |
| v0.9.4 | Ajouté dans : v0.9.4 |
:::

Les flux bidirectionnels sont des flux qui implémentent à la fois les interfaces [`Readable`](/fr/nodejs/api/stream#class-streamreadable) et [`Writable`](/fr/nodejs/api/stream#class-streamwritable).

Exemples de flux `Duplex` :

- [Sockets TCP](/fr/nodejs/api/net#class-netsocket)
- [Flux zlib](/fr/nodejs/api/zlib)
- [Flux crypto](/fr/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**Ajouté dans : v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si `false`, le flux mettra automatiquement fin au côté accessible en écriture lorsque le côté accessible en lecture se termine. Défini initialement par l’option de constructeur `allowHalfOpen`, qui est `true` par défaut.

Cela peut être modifié manuellement pour modifier le comportement semi-ouvert d’une instance de flux `Duplex` existante, mais doit être modifié avant que l’événement `'end'` ne soit émis.

#### Classe : `stream.Transform` {#class-streamtransform}

**Ajouté dans : v0.9.4**

Les flux de transformation sont des flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) où la sortie est liée d’une manière ou d’une autre à l’entrée. Comme tous les flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex), les flux `Transform` implémentent à la fois les interfaces [`Readable`](/fr/nodejs/api/stream#class-streamreadable) et [`Writable`](/fr/nodejs/api/stream#class-streamwritable).

Exemples de flux `Transform` :

- [Flux zlib](/fr/nodejs/api/zlib)
- [Flux crypto](/fr/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Fonctionne comme une no-op sur un flux qui a déjà été détruit. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Détruit le flux et émet éventuellement un événement `'error'`. Après cet appel, le flux de transformation libère toutes les ressources internes. Les implémenteurs ne doivent pas substituer cette méthode, mais plutôt implémenter [`readable._destroy()`](/fr/nodejs/api/stream#readable_destroyerr-callback). L’implémentation par défaut de `_destroy()` pour `Transform` émet également `'close'` sauf si `emitClose` est défini sur false.

Une fois que `destroy()` a été appelé, tout appel ultérieur sera une no-op et aucune autre erreur, à l’exception de `_destroy()`, ne pourra être émise en tant que `'error'`.


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**Ajouté dans : v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Une valeur à passer aux deux constructeurs [`Duplex`](/fr/nodejs/api/stream#class-streamduplex), pour définir des options telles que la mise en mémoire tampon.
- Retourne : [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) de deux instances [`Duplex`](/fr/nodejs/api/stream#class-streamduplex).

La fonction utilitaire `duplexPair` renvoie un tableau avec deux éléments, chacun étant un flux `Duplex` connecté à l’autre côté :

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
Tout ce qui est écrit dans un flux est rendu lisible sur l’autre. Il fournit un comportement analogue à une connexion réseau, où les données écrites par le client deviennent lisibles par le serveur, et vice versa.

Les flux Duplex sont symétriques ; l’un ou l’autre peut être utilisé sans aucune différence de comportement.

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.5.0 | Ajout de la prise en charge de `ReadableStream` et `WritableStream`. |
| v15.11.0 | L’option `signal` a été ajoutée. |
| v14.0.0 | `finished(stream, cb)` attendra l’événement `'close'` avant d’appeler le callback. L’implémentation essaie de détecter les anciens flux et n’applique ce comportement qu’aux flux qui sont censés émettre `'close'`. |
| v14.0.0 | L’émission de `'close'` avant `'end'` sur un flux `Readable` entraînera une erreur `ERR_STREAM_PREMATURE_CLOSE`. |
| v14.0.0 | Le callback sera appelé sur les flux qui ont déjà été terminés avant l’appel à `finished(stream, cb)`. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `stream` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) Un flux/flux web lisible et/ou inscriptible.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `false`, un appel à `emit('error', err)` n’est pas considéré comme terminé. **Par défaut :** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est définie sur `false`, le callback est appelé lorsque le flux se termine, même si le flux peut encore être lisible. **Par défaut :** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est définie sur `false`, le callback est appelé lorsque le flux se termine, même si le flux peut encore être inscriptible. **Par défaut :** `true`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d’abandonner l’attente de la fin du flux. Le flux sous-jacent ne sera *pas* abandonné si le signal est abandonné. Le callback sera appelé avec une `AbortError`. Tous les listeners enregistrés ajoutés par cette fonction seront également supprimés.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de callback qui prend un argument d’erreur facultatif.
- Retourne : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de nettoyage qui supprime tous les listeners enregistrés.

Une fonction pour être averti lorsqu’un flux n’est plus lisible, inscriptible ou a rencontré une erreur ou un événement de fermeture prématurée.

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Le flux a échoué.', err);
  } else {
    console.log('Le flux a terminé sa lecture.');
  }
});

rs.resume(); // Vider le flux.
```
Particulièrement utile dans les scénarios de gestion des erreurs où un flux est détruit prématurément (comme une requête HTTP abandonnée) et n’émettra pas `'end'` ou `'finish'`.

L’API `finished` fournit la [version promise](/fr/nodejs/api/stream#streamfinishedstream-options).

`stream.finished()` laisse des listeners d’événements pendants (en particulier `'error'`, `'end'`, `'finish'` et `'close'`) après que `callback` a été invoqué. La raison en est que les événements `'error'` inattendus (dus à des implémentations de flux incorrectes) ne provoquent pas de plantages inattendus. Si ce comportement n’est pas souhaité, la fonction de nettoyage renvoyée doit être invoquée dans le callback :

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.7.0, v18.16.0 | Ajout de la prise en charge des flux web. |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Le `pipeline(..., cb)` attendra l'événement `'close'` avant d'invoquer le callback. L'implémentation essaie de détecter les anciens flux et n'applique ce comportement qu'aux flux qui sont censés émettre `'close'`. |
| v13.10.0 | Ajout de la prise en charge des générateurs asynchrones. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `streams` [\<Stream[]\>](/fr/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/fr/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/fr/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)
    - Renvoie : [\<Iterable\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `...transforms` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/fr/nodejs/api/webstreams#class-transformstream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Renvoie : [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)


- `destination` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Renvoie : [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise)


- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelé lorsque le pipeline est complètement terminé.
    - `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` Valeur résolue de `Promise` renvoyée par `destination`.


- Renvoie : [\<Stream\>](/fr/nodejs/api/stream#stream)

Une méthode de module pour connecter des flux et des générateurs, transférer les erreurs, nettoyer correctement et fournir un rappel lorsque le pipeline est terminé.

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Utilisez l'API pipeline pour connecter facilement une série de flux
// et être averti lorsque le pipeline est entièrement terminé.

// Un pipeline pour compresser efficacement un fichier tar potentiellement énorme :

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Le pipeline a échoué.', err);
    } else {
      console.log('Le pipeline a réussi.');
    }
  },
);
```
L'API `pipeline` fournit une [version promise](/fr/nodejs/api/stream#streampipelinesource-transforms-destination-options).

`stream.pipeline()` appellera `stream.destroy(err)` sur tous les flux sauf :

- Les flux `Readable` qui ont émis `'end'` ou `'close'`.
- Les flux `Writable` qui ont émis `'finish'` ou `'close'`.

`stream.pipeline()` laisse des écouteurs d'événements en suspens sur les flux après l'invocation du `callback`. En cas de réutilisation des flux après un échec, cela peut entraîner des fuites d'écouteurs d'événements et des erreurs masquées. Si le dernier flux est lisible, les écouteurs d'événements en suspens seront supprimés afin que le dernier flux puisse être consommé ultérieurement.

`stream.pipeline()` ferme tous les flux lorsqu'une erreur est levée. L'utilisation de `IncomingRequest` avec `pipeline` peut entraîner un comportement inattendu car elle détruirait le socket sans envoyer la réponse attendue. Voir l'exemple ci-dessous :

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // Aucun fichier de ce type
      // ce message ne peut pas être envoyé une fois que `pipeline` a déjà détruit le socket
      return res.end('error!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.1.0, v20.10.0 | Ajout du support pour la classe de flux. |
| v19.8.0, v18.16.0 | Ajout du support pour les flux web. |
| v16.9.0 | Ajouté dans : v16.9.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - `stream.compose` est expérimental.
:::

- `streams` [\<Stream[]\>](/fr/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/fr/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/fr/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/fr/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Combine deux flux ou plus en un flux `Duplex` qui écrit dans le premier flux et lit à partir du dernier. Chaque flux fourni est piped vers le suivant, en utilisant `stream.pipeline`. Si l'un des flux génère une erreur, ils sont tous détruits, y compris le flux `Duplex` externe.

Étant donné que `stream.compose` retourne un nouveau flux qui à son tour peut (et doit) être piped vers d'autres flux, il permet la composition. En revanche, lors du passage de flux à `stream.pipeline`, généralement le premier flux est un flux lisible et le dernier un flux accessible en écriture, formant un circuit fermé.

S'il reçoit une `Function`, elle doit être une méthode factory prenant un `Iterable` `source`.

```js [ESM]
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // Affiche 'HELLOWORLD'
```
`stream.compose` peut être utilisé pour convertir des itérables asynchrones, des générateurs et des fonctions en flux.

- `AsyncIterable` convertit en un `Duplex` lisible. Ne peut pas produire `null`.
- `AsyncGeneratorFunction` convertit en un `Duplex` de transformation lisible/inscriptible. Doit prendre une `AsyncIterable` source comme premier paramètre. Ne peut pas produire `null`.
- `AsyncFunction` convertit en un `Duplex` inscriptible. Doit retourner soit `null`, soit `undefined`.

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Convertit AsyncIterable en Duplex lisible.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Convertit AsyncGenerator en Duplex de transformation.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Convertit AsyncFunction en Duplex inscriptible.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // Affiche 'HELLOWORLD'
```
Voir [`readable.compose(stream)`](/fr/nodejs/api/stream#readablecomposestream-options) pour `stream.compose` comme opérateur.


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**Ajouté dans: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Objet implémentant le protocole itérable `Symbol.asyncIterator` ou `Symbol.iterator`. Émet un événement 'error' si une valeur nulle est passée.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options fournies à `new stream.Readable([options])`. Par défaut, `Readable.from()` définira `options.objectMode` à `true`, sauf si cela est explicitement désactivé en définissant `options.objectMode` à `false`.
- Retourne: [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)

Une méthode utilitaire pour créer des flux lisibles à partir d'itérateurs.

```js [ESM]
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
L'appel de `Readable.from(string)` ou `Readable.from(buffer)` n'aura pas les chaînes ou les tampons itérés pour correspondre à la sémantique des autres flux pour des raisons de performances.

Si un objet `Iterable` contenant des promesses est passé comme argument, cela peut entraîner un rejet non géré.

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Rejet non géré
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**Ajouté dans: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `readableStream` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)
  
 
- Retourne : [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**Ajouté dans : v16.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `stream` [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)
- Retourne : `boolean`

Indique si le flux a été lu ou annulé.

### `stream.isErrored(stream)` {#streamiserroredstream}

**Ajouté dans : v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `stream` [\<Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/fr/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/fr/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indique si le flux a rencontré une erreur.

### `stream.isReadable(stream)` {#streamisreadablestream}

**Ajouté dans : v17.4.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `stream` [\<Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/fr/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indique si le flux est lisible.

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**Ajouté dans : v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `streamReadable` [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale de la file d'attente interne (du `ReadableStream` créé) avant que la contre-pression ne soit appliquée lors de la lecture à partir du `stream.Readable` donné. Si aucune valeur n'est fournie, elle sera tirée du `stream.Readable` donné.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction qui détermine la taille du bloc de données donné. Si aucune valeur n'est fournie, la taille sera `1` pour tous les blocs.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)




- Retourne : [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**Ajouté dans: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `writableStream` [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)
  
 
- Returns: [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**Ajouté dans: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `streamWritable` [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)
- Returns: [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.5.0, v18.17.0 | L'argument `src` peut maintenant être un `ReadableStream` ou `WritableStream`. |
| v16.8.0 | Ajouté dans : v16.8.0 |
:::

- `src` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<Blob\>](/fr/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)

Une méthode utilitaire pour créer des flux duplex.

- `Stream` convertit le flux d'écriture en `Duplex` accessible en écriture et le flux de lecture en `Duplex`.
- `Blob` convertit en `Duplex` accessible en lecture.
- `string` convertit en `Duplex` accessible en lecture.
- `ArrayBuffer` convertit en `Duplex` accessible en lecture.
- `AsyncIterable` convertit en `Duplex` accessible en lecture. Ne peut pas produire `null`.
- `AsyncGeneratorFunction` convertit en `Duplex` de transformation accessible en lecture/écriture. Doit prendre une source `AsyncIterable` comme premier paramètre. Ne peut pas produire `null`.
- `AsyncFunction` convertit en `Duplex` accessible en écriture. Doit renvoyer `null` ou `undefined`
- `Object ({ writable, readable })` convertit `readable` et `writable` en `Stream` puis les combine en `Duplex` où le `Duplex` écrira dans le `writable` et lira à partir du `readable`.
- `Promise` convertit en `Duplex` accessible en lecture. La valeur `null` est ignorée.
- `ReadableStream` convertit en `Duplex` accessible en lecture.
- `WritableStream` convertit en `Duplex` accessible en écriture.
- Returns: [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Si un objet `Iterable` contenant des promesses est passé comme argument, cela peut entraîner un rejet non géré.

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Rejet non géré
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**Ajouté dans : v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `pair` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)


- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal)


- Retourne : [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```js [CJS]
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```
:::


### `stream.Duplex.toWeb(streamDuplex)` {#streamduplextowebstreamduplex}

**Ajouté dans : v17.0.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stable: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `streamDuplex` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)
- Retourne : [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)
  
 



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```js [CJS]
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```
:::

### `stream.addAbortSignal(signal, stream)` {#streamaddabortsignalsignal-stream}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.7.0, v18.16.0 | Ajout du support pour `ReadableStream` et `WritableStream`. |
| v15.4.0 | Ajouté dans : v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un signal représentant une possible annulation.
- `stream` [\<Stream\>](/fr/nodejs/api/stream#stream) | [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) Un flux auquel rattacher un signal.

Rattache un AbortSignal à un flux lisible ou écrivable. Ceci permet au code de contrôler la destruction du flux en utilisant un `AbortController`.

L'appel à `abort` sur le `AbortController` correspondant au `AbortSignal` passé se comportera de la même manière que l'appel à `.destroy(new AbortError())` sur le flux, et `controller.error(new AbortError())` pour les flux web.

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Plus tard, abandonner l'opération fermant le flux
controller.abort();
```
Ou utiliser un `AbortSignal` avec un flux lisible comme un itérable asynchrone :

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // définir un délai d'attente
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // L'opération a été annulée
    } else {
      throw e;
    }
  }
})();
```
Ou utiliser un `AbortSignal` avec un ReadableStream :

```js [ESM]
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // L'opération a été annulée
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)` {#streamgetdefaulthighwatermarkobjectmode}

**Ajouté dans : v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne le highWaterMark par défaut utilisé par les flux. La valeur par défaut est `65536` (64 Ko), ou `16` pour `objectMode`.

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**Ajouté dans : v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valeur highWaterMark

Définit le highWaterMark par défaut utilisé par les flux.

## API pour les implémenteurs de flux {#api-for-stream-implementers}

L'API du module `node:stream` a été conçue pour permettre d'implémenter facilement des flux en utilisant le modèle d'héritage prototypique de JavaScript.

Tout d'abord, un développeur de flux déclarerait une nouvelle classe JavaScript qui étend l'une des quatre classes de flux de base (`stream.Writable`, `stream.Readable`, `stream.Duplex` ou `stream.Transform`), en s'assurant d'appeler le constructeur de la classe parente appropriée :

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
Lorsque vous étendez des flux, gardez à l'esprit les options que l'utilisateur peut et doit fournir avant de les transmettre au constructeur de base. Par exemple, si l'implémentation fait des hypothèses concernant les options `autoDestroy` et `emitClose`, ne permettez pas à l'utilisateur de les remplacer. Soyez explicite sur les options qui sont transmises au lieu de transmettre implicitement toutes les options.

La nouvelle classe de flux doit ensuite implémenter une ou plusieurs méthodes spécifiques, selon le type de flux créé, comme indiqué dans le tableau ci-dessous :

| Cas d'utilisation | Classe | Méthode(s) à implémenter |
|---|---|---|
| Lecture seulement | [`Readable`](/fr/nodejs/api/stream#class-streamreadable) | [`_read()`](/fr/nodejs/api/stream#readable_readsize) |
| Écriture seulement | [`Writable`](/fr/nodejs/api/stream#class-streamwritable) | [`_write()`](/fr/nodejs/api/stream#writable_writechunk-encoding-callback), [`_writev()`](/fr/nodejs/api/stream#writable_writevchunks-callback), [`_final()`](/fr/nodejs/api/stream#writable_finalcallback) |
| Lecture et écriture | [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) | [`_read()`](/fr/nodejs/api/stream#readable_readsize), [`_write()`](/fr/nodejs/api/stream#writable_writechunk-encoding-callback), [`_writev()`](/fr/nodejs/api/stream#writable_writevchunks-callback), [`_final()`](/fr/nodejs/api/stream#writable_finalcallback) |
| Opérer sur les données écrites, puis lire le résultat | [`Transform`](/fr/nodejs/api/stream#class-streamtransform) | [`_transform()`](/fr/nodejs/api/stream#transform_transformchunk-encoding-callback), [`_flush()`](/fr/nodejs/api/stream#transform_flushcallback), [`_final()`](/fr/nodejs/api/stream#writable_finalcallback) |
Le code d'implémentation d'un flux ne doit *jamais* appeler les méthodes "publiques" d'un flux qui sont destinées à être utilisées par les consommateurs (comme décrit dans la section [API pour les consommateurs de flux](/fr/nodejs/api/stream#api-for-stream-consumers)). Cela pourrait entraîner des effets secondaires indésirables dans le code de l'application qui consomme le flux.

Évitez de remplacer les méthodes publiques telles que `write()`, `end()`, `cork()`, `uncork()`, `read()` et `destroy()`, ou d'émettre des événements internes tels que `'error'`, `'data'`, `'end'`, `'finish'` et `'close'` via `.emit()`. Cela peut briser les invariants de flux actuels et futurs, ce qui entraînerait des problèmes de comportement et/ou de compatibilité avec d'autres flux, des utilitaires de flux et les attentes des utilisateurs.


### Construction simplifiée {#simplified-construction}

**Ajouté dans: v1.2.0**

Dans de nombreux cas simples, il est possible de créer un flux sans avoir recours à l'héritage. Ceci peut être réalisé en créant directement des instances des objets `stream.Writable`, `stream.Readable`, `stream.Duplex` ou `stream.Transform` et en passant les méthodes appropriées comme options du constructeur.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // Initialiser l'état et charger les ressources...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // Libérer les ressources...
  },
});
```
### Implémentation d'un flux d'écriture {#implementing-a-writable-stream}

La classe `stream.Writable` est étendue pour implémenter un flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable).

Les flux `Writable` personnalisés *doivent* appeler le constructeur `new stream.Writable([options])` et implémenter la méthode `writable._write()` et/ou `writable._writev()`.

#### `new stream.Writable([options])` {#new-streamwritableoptions}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | Augmentation de la valeur par défaut de highWaterMark. |
| v15.5.0 | Prise en charge du passage d'un AbortSignal. |
| v14.0.0 | Modification de la valeur par défaut de l'option `autoDestroy` à `true`. |
| v11.2.0, v10.16.0 | Ajout de l'option `autoDestroy` pour `destroy()` automatiquement le flux lorsqu'il émet `'finish'` ou des erreurs. |
| v10.0.0 | Ajout de l'option `emitClose` pour spécifier si `'close'` est émis lors de la destruction. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Niveau de tampon lorsque [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) commence à retourner `false`. **Par défaut :** `65536` (64 KiB), ou `16` pour les flux `objectMode`.
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique s'il faut encoder les `string` transmises à [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) en `Buffer` (avec l'encodage spécifié dans l'appel [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback)) avant de les transmettre à [`stream._write()`](/fr/nodejs/api/stream#writable_writechunk-encoding-callback). Les autres types de données ne sont pas convertis (c.-à-d. que les `Buffer` ne sont pas décodés en `string`). Si la valeur est définie sur false, les `string` ne seront pas converties. **Par défaut :** `true`.
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage par défaut utilisé lorsqu'aucun encodage n'est spécifié comme argument de [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback). **Par défaut :** `'utf8'`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si [`stream.write(anyObj)`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) est une opération valide. Lorsqu'elle est définie, il devient possible d'écrire des valeurs JavaScript autres que string, [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) si elle est prise en charge par l'implémentation du flux. **Par défaut :** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le flux doit émettre `'close'` après avoir été détruit. **Par défaut :** `true`.
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation pour la méthode [`stream._write()`](/fr/nodejs/api/stream#writable_writechunk-encoding-callback).
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation pour la méthode [`stream._writev()`](/fr/nodejs/api/stream#writable_writevchunks-callback).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation pour la méthode [`stream._destroy()`](/fr/nodejs/api/stream#writable_destroyerr-callback).
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation pour la méthode [`stream._final()`](/fr/nodejs/api/stream#writable_finalcallback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation pour la méthode [`stream._construct()`](/fr/nodejs/api/stream#writable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si ce flux doit appeler automatiquement `.destroy()` sur lui-même après sa fin. **Par défaut :** `true`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un signal représentant une éventuelle annulation.

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // Appelle le constructeur stream.Writable().
    super(options);
    // ...
  }
}
```
Ou, lors de l'utilisation de constructeurs de style pré-ES6 :

```js [ESM]
const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
```
Ou, en utilisant l'approche de constructeur simplifiée :

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```
L'appel de `abort` sur l'`AbortController` correspondant au `AbortSignal` transmis se comportera de la même manière que l'appel de `.destroy(new AbortError())` sur le flux d'écriture.

```js [ESM]
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// Plus tard, abandonner l'opération en fermant le flux
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**Ajouté dans : v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelez cette fonction (éventuellement avec un argument d'erreur) lorsque le flux a terminé son initialisation.

La méthode `_construct()` NE DOIT PAS être appelée directement. Elle peut être implémentée par les classes enfants, et si c'est le cas, elle sera appelée uniquement par les méthodes internes de la classe `Writable`.

Cette fonction optionnelle sera appelée dans un tick après que le constructeur du flux ait renvoyé une valeur, retardant tout appel à `_write()`, `_final()` et `_destroy()` jusqu'à ce que `callback` soit appelé. Ceci est utile pour initialiser l'état ou initialiser de manière asynchrone des ressources avant que le flux ne puisse être utilisé.

```js [ESM]
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `writable._write(chunk, encoding, callback)` {#writable_writechunk-encoding-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.11.0 | _write() est optionnel lors de la fourniture de _writev(). |
:::

- `chunk` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types) Le `Buffer` à écrire, converti à partir de la `string` passée à [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback). Si l'option `decodeStrings` du flux est `false` ou si le flux fonctionne en mode objet, le chunk ne sera pas converti et sera ce qui a été passé à [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Si le chunk est une chaîne de caractères, alors `encoding` est l'encodage de caractères de cette chaîne. Si le chunk est un `Buffer`, ou si le flux fonctionne en mode objet, `encoding` peut être ignoré.
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelez cette fonction (éventuellement avec un argument d'erreur) lorsque le traitement du chunk fourni est terminé.

Toutes les implémentations de flux `Writable` doivent fournir une méthode [`writable._write()`](/fr/nodejs/api/stream#writable_writechunk-encoding-callback) et/ou [`writable._writev()`](/fr/nodejs/api/stream#writable_writevchunks-callback) pour envoyer des données à la ressource sous-jacente.

Les flux [`Transform`](/fr/nodejs/api/stream#class-streamtransform) fournissent leur propre implémentation de [`writable._write()`](/fr/nodejs/api/stream#writable_writechunk-encoding-callback).

Cette fonction NE DOIT PAS être appelée directement par le code de l'application. Elle doit être implémentée par les classes enfants et appelée uniquement par les méthodes internes de la classe `Writable`.

La fonction `callback` doit être appelée de manière synchrone à l'intérieur de `writable._write()` ou de manière asynchrone (c'est-à-dire, tick différent) pour signaler soit que l'écriture s'est terminée avec succès, soit qu'elle a échoué avec une erreur. Le premier argument passé au `callback` doit être l'objet `Error` si l'appel a échoué ou `null` si l'écriture a réussi.

Tous les appels à `writable.write()` qui se produisent entre le moment où `writable._write()` est appelé et le moment où `callback` est appelé entraînent la mise en mémoire tampon des données écrites. Lorsque `callback` est invoqué, le flux peut émettre un événement [`'drain'`](/fr/nodejs/api/stream#event-drain). Si une implémentation de flux est capable de traiter plusieurs chunks de données à la fois, la méthode `writable._writev()` doit être implémentée.

Si la propriété `decodeStrings` est explicitement définie sur `false` dans les options du constructeur, alors `chunk` restera le même objet qui est passé à `.write()`, et peut être une chaîne de caractères plutôt qu'un `Buffer`. Ceci est destiné à prendre en charge les implémentations qui ont une gestion optimisée pour certains encodages de données de type chaîne. Dans ce cas, l'argument `encoding` indiquera l'encodage de caractères de la chaîne. Sinon, l'argument `encoding` peut être ignoré en toute sécurité.

La méthode `writable._write()` est préfixée par un underscore car elle est interne à la classe qui la définit et ne doit jamais être appelée directement par les programmes utilisateurs.


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Les données à écrire. La valeur est un tableau de [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) qui représentent chacun un bloc de données discret à écrire. Les propriétés de ces objets sont :
    - `chunk` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une instance de tampon ou une chaîne de caractères contenant les données à écrire. Le `chunk` sera une chaîne si le `Writable` a été créé avec l'option `decodeStrings` définie sur `false` et qu'une chaîne a été passée à `write()`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage des caractères du `chunk`. Si `chunk` est un `Buffer`, l'`encoding` sera `'buffer'`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de rappel (éventuellement avec un argument d'erreur) à invoquer lorsque le traitement des blocs fournis est terminé.

Cette fonction NE DOIT PAS être appelée directement par le code de l'application. Elle doit être implémentée par les classes enfants, et appelée uniquement par les méthodes internes de la classe `Writable`.

La méthode `writable._writev()` peut être implémentée en plus ou à la place de `writable._write()` dans les implémentations de flux qui sont capables de traiter plusieurs blocs de données à la fois. Si elle est implémentée et s'il y a des données mises en mémoire tampon provenant d'écritures précédentes, `_writev()` sera appelée à la place de `_write()`.

La méthode `writable._writev()` est préfixée par un trait de soulignement car elle est interne à la classe qui la définit, et ne doit jamais être appelée directement par les programmes utilisateur.

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**Ajouté dans : v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Une erreur possible.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de rappel qui prend un argument d'erreur facultatif.

La méthode `_destroy()` est appelée par [`writable.destroy()`](/fr/nodejs/api/stream#writabledestroyerror). Elle peut être remplacée par les classes enfants, mais elle **ne doit pas** être appelée directement.


#### `writable._final(callback)` {#writable_finalcallback}

**Ajouté dans : v8.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelez cette fonction (éventuellement avec un argument d’erreur) lorsque vous avez terminé d’écrire les données restantes.

La méthode `_final()` ne **doit pas** être appelée directement. Elle peut être implémentée par les classes enfants, et si c’est le cas, elle ne sera appelée que par les méthodes internes de la classe `Writable`.

Cette fonction optionnelle sera appelée avant la fermeture du flux, retardant l’événement `'finish'` jusqu’à ce que `callback` soit appelé. Ceci est utile pour fermer les ressources ou écrire les données mises en mémoire tampon avant la fin d’un flux.

#### Erreurs lors de l’écriture {#errors-while-writing}

Les erreurs survenant lors du traitement des méthodes [`writable._write()`](/fr/nodejs/api/stream#writable_writechunk-encoding-callback), [`writable._writev()`](/fr/nodejs/api/stream#writable_writevchunks-callback) et [`writable._final()`](/fr/nodejs/api/stream#writable_finalcallback) doivent être propagées en appelant le callback et en passant l’erreur comme premier argument. Lancer une `Error` depuis ces méthodes ou émettre manuellement un événement `'error'` entraîne un comportement indéfini.

Si un flux `Readable` est relié à un flux `Writable` lorsque `Writable` émet une erreur, le flux `Readable` sera déconnecté.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```
#### Un exemple de flux Writable {#an-example-writable-stream}

Ce qui suit illustre une implémentation de flux `Writable` personnalisée plutôt simpliste (et quelque peu inutile). Bien que cette instance de flux `Writable` spécifique ne soit d’aucune utilité particulière réelle, l’exemple illustre chacun des éléments requis d’une instance de flux [`Writable`](/fr/nodejs/api/stream#class-streamwritable) personnalisée :

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### Décodage des tampons dans un flux accessible en écriture {#decoding-buffers-in-a-writable-stream}

Le décodage des tampons est une tâche courante, par exemple, lors de l'utilisation de transformateurs dont l'entrée est une chaîne de caractères. Ce n'est pas un processus trivial lors de l'utilisation d'un encodage de caractères multi-octets, tel que UTF-8. L'exemple suivant montre comment décoder des chaînes multi-octets à l'aide de `StringDecoder` et de [`Writable`](/fr/nodejs/api/stream#class-streamwritable).

```js [ESM]
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```
### Implémentation d'un flux lisible {#implementing-a-readable-stream}

La classe `stream.Readable` est étendue pour implémenter un flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable).

Les flux `Readable` personnalisés *doivent* appeler le constructeur `new stream.Readable([options])` et implémenter la méthode [`readable._read()`](/fr/nodejs/api/stream#readable_readsize).

#### `new stream.Readable([options])` {#new-streamreadableoptions}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0 | augmenter highWaterMark par défaut. |
| v15.5.0 | prise en charge de la transmission d'un AbortSignal. |
| v14.0.0 | Changer l'option `autoDestroy` par défaut sur `true`. |
| v11.2.0, v10.16.0 | Ajouter l'option `autoDestroy` pour `destroy()` automatiquement le flux lorsqu'il émet `'end'` ou des erreurs. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le [nombre d'octets](/fr/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding) maximal à stocker dans la mémoire tampon interne avant de cesser de lire à partir de la ressource sous-jacente. **Par défaut :** `65536` (64 Kio), ou `16` pour les flux `objectMode`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si spécifié, les tampons seront décodés en chaînes à l'aide de l'encodage spécifié. **Par défaut :** `null`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si ce flux doit se comporter comme un flux d'objets. Ce qui signifie que [`stream.read(n)`](/fr/nodejs/api/stream#readablereadsize) renvoie une seule valeur au lieu d'un `Buffer` de taille `n`. **Par défaut :** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le flux doit émettre `'close'` après avoir été détruit. **Par défaut :** `true`.
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation de la méthode [`stream._read()`](/fr/nodejs/api/stream#readable_readsize).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation de la méthode [`stream._destroy()`](/fr/nodejs/api/stream#readable_destroyerr-callback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation de la méthode [`stream._construct()`](/fr/nodejs/api/stream#readable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si ce flux doit automatiquement appeler `.destroy()` sur lui-même après sa fin. **Par défaut :** `true`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un signal représentant une possible annulation.
  
 

```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // Appelle le constructeur stream.Readable(options).
    super(options);
    // ...
  }
}
```
Ou, lors de l'utilisation de constructeurs de style pré-ES6 :

```js [ESM]
const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
```
Ou, en utilisant l'approche de constructeur simplifiée :

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
Appeler `abort` sur le `AbortController` correspondant au `AbortSignal` transmis se comportera de la même manière que d'appeler `.destroy(new AbortError())` sur le flux lisible créé.

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// Plus tard, annuler l'opération en fermant le flux
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**Ajouté dans : v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelle cette fonction (éventuellement avec un argument d'erreur) lorsque le stream a fini de s'initialiser.

La méthode `_construct()` ne DOIT PAS être appelée directement. Elle peut être implémentée par les classes enfants, et si c'est le cas, elle sera appelée uniquement par les méthodes internes de la classe `Readable`.

Cette fonction optionnelle sera planifiée lors du prochain tick par le constructeur du stream, retardant tout appel à `_read()` et `_destroy()` jusqu'à ce que `callback` soit appelé. Ceci est utile pour initialiser l'état ou initialiser de manière asynchrone les ressources avant que le stream ne puisse être utilisé.

```js [ESM]
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `readable._read(size)` {#readable_readsize}

**Ajouté dans : v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'octets à lire de manière asynchrone

Cette fonction ne DOIT PAS être appelée directement par le code de l'application. Elle doit être implémentée par les classes enfants et appelée uniquement par les méthodes internes de la classe `Readable`.

Toutes les implémentations de flux `Readable` doivent fournir une implémentation de la méthode [`readable._read()`](/fr/nodejs/api/stream#readable_readsize) pour extraire les données de la ressource sous-jacente.

Lorsque [`readable._read()`](/fr/nodejs/api/stream#readable_readsize) est appelé, si des données sont disponibles à partir de la ressource, l'implémentation doit commencer à pousser ces données dans la file d'attente de lecture en utilisant la méthode [`this.push(dataChunk)`](/fr/nodejs/api/stream#readablepushchunk-encoding). `_read()` sera appelé à nouveau après chaque appel à [`this.push(dataChunk)`](/fr/nodejs/api/stream#readablepushchunk-encoding) une fois que le stream est prêt à accepter plus de données. `_read()` peut continuer à lire à partir de la ressource et à pousser des données jusqu'à ce que `readable.push()` renvoie `false`. Ce n'est que lorsque `_read()` est appelé à nouveau après qu'il s'est arrêté qu'il doit reprendre la poussée de données supplémentaires dans la file d'attente.

Une fois que la méthode [`readable._read()`](/fr/nodejs/api/stream#readable_readsize) a été appelée, elle ne sera plus appelée tant que davantage de données ne seront pas poussées via la méthode [`readable.push()`](/fr/nodejs/api/stream#readablepushchunk-encoding). Les données vides telles que les tampons et les chaînes vides ne provoqueront pas l'appel de [`readable._read()`](/fr/nodejs/api/stream#readable_readsize).

L'argument `size` est consultatif. Pour les implémentations où une "lecture" est une opération unique qui renvoie des données, l'argument `size` peut être utilisé pour déterminer la quantité de données à extraire. D'autres implémentations peuvent ignorer cet argument et simplement fournir des données lorsqu'elles deviennent disponibles. Il n'est pas nécessaire d'"attendre" que `size` octets soient disponibles avant d'appeler [`stream.push(chunk)`](/fr/nodejs/api/stream#readablepushchunk-encoding).

La méthode [`readable._read()`](/fr/nodejs/api/stream#readable_readsize) est préfixée par un trait de soulignement car elle est interne à la classe qui la définit et ne doit jamais être appelée directement par les programmes utilisateur.


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**Ajouté dans : v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Une erreur possible.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de rappel qui prend un argument d’erreur facultatif.

La méthode `_destroy()` est appelée par [`readable.destroy()`](/fr/nodejs/api/stream#readabledestroyerror). Elle peut être remplacée par les classes enfants, mais elle ne **doit pas** être appelée directement.

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | L'argument `chunk` peut maintenant être une instance `TypedArray` ou `DataView`. |
| v8.0.0 | L'argument `chunk` peut maintenant être une instance `Uint8Array`. |
:::

- `chunk` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Bloc de données à pousser dans la file d’attente de lecture. Pour les flux ne fonctionnant pas en mode objet, `chunk` doit être une [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Pour les flux en mode objet, `chunk` peut être n’importe quelle valeur JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Encodage des blocs de chaîne. Doit être un encodage `Buffer` valide, tel que `'utf8'` ou `'ascii'`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si des blocs de données supplémentaires peuvent continuer à être poussés ; `false` sinon.

Lorsque `chunk` est un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ou [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), le `chunk` de données sera ajouté à la file d’attente interne pour que les utilisateurs du flux puissent le consommer. Passer `chunk` comme `null` signale la fin du flux (EOF), après quoi aucune autre donnée ne peut être écrite.

Lorsque le `Readable` fonctionne en mode pause, les données ajoutées avec `readable.push()` peuvent être lues en appelant la méthode [`readable.read()`](/fr/nodejs/api/stream#readablereadsize) lorsque l’événement [`'readable'`](/fr/nodejs/api/stream#event-readable) est émis.

Lorsque le `Readable` fonctionne en mode flux, les données ajoutées avec `readable.push()` seront fournies en émettant un événement `'data'`.

La méthode `readable.push()` est conçue pour être aussi flexible que possible. Par exemple, lors de l’encapsulation d’une source de niveau inférieur qui fournit une forme de mécanisme de pause/reprise et un rappel de données, la source de bas niveau peut être encapsulée par l’instance `Readable` personnalisée :

```js [ESM]
// `_source` est un objet avec des méthodes readStop() et readStart(),
// et un membre `ondata` qui est appelé lorsqu’il y a des données, et
// un membre `onend` qui est appelé lorsque les données sont terminées.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Chaque fois qu’il y a des données, poussez-les dans la mémoire tampon interne.
    this._source.ondata = (chunk) => {
      // Si push() renvoie false, alors arrêtez la lecture de la source.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // Lorsque la source se termine, poussez le bloc `null` de signalisation EOF.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() sera appelé lorsque le flux voudra extraire plus de données.
  // L’argument de taille consultative est ignoré dans ce cas.
  _read(size) {
    this._source.readStart();
  }
}
```
La méthode `readable.push()` est utilisée pour pousser le contenu dans la mémoire tampon interne. Elle peut être pilotée par la méthode [`readable._read()`](/fr/nodejs/api/stream#readable_readsize).

Pour les flux ne fonctionnant pas en mode objet, si le paramètre `chunk` de `readable.push()` est `undefined`, il sera traité comme une chaîne ou une mémoire tampon vide. Voir [`readable.push('')`](/fr/nodejs/api/stream#readablepush) pour plus d’informations.


#### Erreurs lors de la lecture {#errors-while-reading}

Les erreurs survenant lors du traitement de [`readable._read()`](/fr/nodejs/api/stream#readable_readsize) doivent être propagées via la méthode [`readable.destroy(err)`](/fr/nodejs/api/stream#readable_destroyerr-callback). Lancer une `Error` depuis [`readable._read()`](/fr/nodejs/api/stream#readable_readsize) ou émettre manuellement un événement `'error'` entraîne un comportement indéfini.

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```
#### Un exemple de flux de comptage {#an-example-counting-stream}

Voici un exemple basique d'un flux `Readable` qui émet les chiffres de 1 à 1 000 000 dans l'ordre croissant, puis se termine.

```js [ESM]
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```
### Implémentation d'un flux duplex {#implementing-a-duplex-stream}

Un flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) est un flux qui implémente à la fois [`Readable`](/fr/nodejs/api/stream#class-streamreadable) et [`Writable`](/fr/nodejs/api/stream#class-streamwritable), comme une connexion socket TCP.

Étant donné que JavaScript ne prend pas en charge l'héritage multiple, la classe `stream.Duplex` est étendue pour implémenter un flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) (au lieu d'étendre les classes `stream.Readable` *et* `stream.Writable`).

La classe `stream.Duplex` hérite prototypiquement de `stream.Readable` et parasitiquement de `stream.Writable`, mais `instanceof` fonctionnera correctement pour les deux classes de base en raison du remplacement de [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) sur `stream.Writable`.

Les flux `Duplex` personnalisés *doivent* appeler le constructeur `new stream.Duplex([options])` et implémenter *à la fois* les méthodes [`readable._read()`](/fr/nodejs/api/stream#readable_readsize) et `writable._write()`.


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.4.0 | Les options `readableHighWaterMark` et `writableHighWaterMark` sont désormais prises en charge. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Passé aux constructeurs `Writable` et `Readable`. Possède également les champs suivants :
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `false`, le flux mettra automatiquement fin au côté inscriptible lorsque le côté lisible se termine. **Par défaut :** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définit si le `Duplex` doit être lisible. **Par défaut :** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définit si le `Duplex` doit être inscriptible. **Par défaut :** `true`.
    - `readableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définit `objectMode` pour le côté lisible du flux. N’a aucun effet si `objectMode` est `true`. **Par défaut :** `false`.
    - `writableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définit `objectMode` pour le côté inscriptible du flux. N’a aucun effet si `objectMode` est `true`. **Par défaut :** `false`.
    - `readableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit `highWaterMark` pour le côté lisible du flux. N’a aucun effet si `highWaterMark` est fourni.
    - `writableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit `highWaterMark` pour le côté inscriptible du flux. N’a aucun effet si `highWaterMark` est fourni.

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Ou, lorsque vous utilisez des constructeurs de style pré-ES6 :

```js [ESM]
const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
```
Ou, en utilisant l’approche simplifiée du constructeur :

```js [ESM]
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```
Lors de l’utilisation de pipeline :

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // Accepter les entrées de chaîne plutôt que les tampons
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // S'assurer que c'est un JSON valide.
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  },
);
```

#### Un exemple de flux duplex {#an-example-duplex-stream}

L'exemple suivant illustre un exemple simple d'un flux `Duplex` qui encapsule un objet source de bas niveau hypothétique auquel des données peuvent être écrites, et à partir duquel des données peuvent être lues, bien qu'en utilisant une API qui n'est pas compatible avec les flux Node.js. L'exemple suivant illustre un exemple simple d'un flux `Duplex` qui met en mémoire tampon les données écrites entrantes via l'interface [`Writable`](/fr/nodejs/api/stream#class-streamwritable) qui est relue via l'interface [`Readable`](/fr/nodejs/api/stream#class-streamreadable).

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // La source sous-jacente ne traite que les chaînes de caractères.
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
L'aspect le plus important d'un flux `Duplex` est que les côtés `Readable` et `Writable` fonctionnent indépendamment l'un de l'autre, bien qu'ils coexistent dans une seule instance d'objet.

#### Flux duplex en mode objet {#object-mode-duplex-streams}

Pour les flux `Duplex`, `objectMode` peut être défini exclusivement pour le côté `Readable` ou `Writable` en utilisant respectivement les options `readableObjectMode` et `writableObjectMode`.

Dans l'exemple suivant, par exemple, un nouveau flux `Transform` (qui est un type de flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex)) est créé avec un côté `Writable` en mode objet qui accepte les nombres JavaScript qui sont convertis en chaînes hexadécimales sur le côté `Readable`.

```js [ESM]
const { Transform } = require('node:stream');

// Tous les flux Transform sont également des flux Duplex.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // Contraint le chunk à un nombre si nécessaire.
    chunk |= 0;

    // Transforme le chunk en autre chose.
    const data = chunk.toString(16);

    // Pousse les données dans la file d'attente lisible.
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// Affiche : 01
myTransform.write(10);
// Affiche : 0a
myTransform.write(100);
// Affiche : 64
```

### Implémenter un flux de transformation {#implementing-a-transform-stream}

Un flux [`Transform`](/fr/nodejs/api/stream#class-streamtransform) est un flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) où la sortie est calculée d'une certaine manière à partir de l'entrée. Les exemples incluent les flux [zlib](/fr/nodejs/api/zlib) ou les flux [crypto](/fr/nodejs/api/crypto) qui compressent, chiffrent ou déchiffrent les données.

Il n'est pas obligatoire que la sortie ait la même taille que l'entrée, le même nombre de morceaux ou qu'elle arrive en même temps. Par exemple, un flux `Hash` n'aura qu'un seul morceau de sortie qui est fourni lorsque l'entrée est terminée. Un flux `zlib` produira une sortie soit beaucoup plus petite, soit beaucoup plus grande que son entrée.

La classe `stream.Transform` est étendue pour implémenter un flux [`Transform`](/fr/nodejs/api/stream#class-streamtransform).

La classe `stream.Transform` hérite par prototype de `stream.Duplex` et implémente ses propres versions des méthodes `writable._write()` et [`readable._read()`](/fr/nodejs/api/stream#readable_readsize). Les implémentations personnalisées de `Transform` *doivent* implémenter la méthode [`transform._transform()`](/fr/nodejs/api/stream#transform_transformchunk-encoding-callback) et *peuvent* également implémenter la méthode [`transform._flush()`](/fr/nodejs/api/stream#transform_flushcallback).

Il faut faire attention lors de l'utilisation des flux `Transform`, car les données écrites dans le flux peuvent entraîner la mise en pause du côté `Writable` du flux si la sortie du côté `Readable` n'est pas consommée.

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Passé aux constructeurs `Writable` et `Readable`. Possède également les champs suivants :
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation de la méthode [`stream._transform()`](/fr/nodejs/api/stream#transform_transformchunk-encoding-callback).
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Implémentation de la méthode [`stream._flush()`](/fr/nodejs/api/stream#transform_flushcallback).

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Ou, lors de l'utilisation de constructeurs de style antérieur à ES6 :

```js [ESM]
const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
```
Ou, en utilisant l'approche simplifiée du constructeur :

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### Événement : `'end'` {#event-end_1}

L'événement [`'end'`](/fr/nodejs/api/stream#event-end) provient de la classe `stream.Readable`. L'événement `'end'` est émis une fois que toutes les données ont été émises, ce qui se produit après l'appel du callback dans [`transform._flush()`](/fr/nodejs/api/stream#transform_flushcallback). En cas d'erreur, `'end'` ne doit pas être émis.

#### Événement : `'finish'` {#event-finish_1}

L'événement [`'finish'`](/fr/nodejs/api/stream#event-finish) provient de la classe `stream.Writable`. L'événement `'finish'` est émis après l'appel de [`stream.end()`](/fr/nodejs/api/stream#writableendchunk-encoding-callback) et une fois que tous les morceaux ont été traités par [`stream._transform()`](/fr/nodejs/api/stream#transform_transformchunk-encoding-callback). En cas d'erreur, `'finish'` ne doit pas être émis.

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de rappel (éventuellement avec un argument d'erreur et des données) à appeler lorsque les données restantes ont été vidées.

Cette fonction NE DOIT PAS être appelée directement par le code de l'application. Elle doit être implémentée par les classes enfants, et appelée uniquement par les méthodes internes de la classe `Readable`.

Dans certains cas, une opération de transformation peut avoir besoin d'émettre un bit de données supplémentaire à la fin du flux. Par exemple, un flux de compression `zlib` stocke une quantité d'état interne utilisée pour compresser de manière optimale la sortie. Lorsque le flux se termine, cependant, ces données supplémentaires doivent être vidées afin que les données compressées soient complètes.

Les implémentations [`Transform`](/fr/nodejs/api/stream#class-streamtransform) personnalisées *peuvent* implémenter la méthode `transform._flush()`. Celle-ci sera appelée lorsqu'il n'y aura plus de données écrites à consommer, mais avant que l'événement [`'end'`](/fr/nodejs/api/stream#event-end) ne soit émis, signalant la fin du flux [`Readable`](/fr/nodejs/api/stream#class-streamreadable).

Dans l'implémentation de `transform._flush()`, la méthode `transform.push()` peut être appelée zéro ou plusieurs fois, selon le cas. La fonction `callback` doit être appelée lorsque l'opération de vidage est terminée.

La méthode `transform._flush()` est préfixée par un trait de soulignement car elle est interne à la classe qui la définit, et ne doit jamais être appelée directement par les programmes utilisateur.


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Le `Buffer` à transformer, converti à partir de la `string` passée à [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback). Si l'option `decodeStrings` du flux est `false` ou si le flux fonctionne en mode objet, le chunk ne sera pas converti et sera ce qui a été passé à [`stream.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si le chunk est une chaîne de caractères, il s'agit du type d'encodage. Si le chunk est un buffer, il s'agit de la valeur spéciale `'buffer'`. Ignorez-la dans ce cas.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de callback (éventuellement avec un argument d'erreur et des données) à appeler une fois que le `chunk` fourni a été traité.

Cette fonction NE DOIT PAS être appelée directement par le code de l'application. Elle doit être implémentée par les classes enfants et appelée uniquement par les méthodes internes de la classe `Readable`.

Toutes les implémentations de flux `Transform` doivent fournir une méthode `_transform()` pour accepter l'entrée et produire la sortie. L'implémentation `transform._transform()` gère les octets en cours d'écriture, calcule une sortie, puis transmet cette sortie à la partie lisible à l'aide de la méthode `transform.push()`.

La méthode `transform.push()` peut être appelée zéro ou plusieurs fois pour générer une sortie à partir d'un seul chunk d'entrée, en fonction de la quantité à sortir à la suite du chunk.

Il est possible qu'aucune sortie ne soit générée à partir d'un chunk donné de données d'entrée.

La fonction `callback` ne doit être appelée que lorsque le chunk courant est complètement consommé. Le premier argument passé au `callback` doit être un objet `Error` si une erreur s'est produite lors du traitement de l'entrée, ou `null` sinon. Si un deuxième argument est passé au `callback`, il sera transmis à la méthode `transform.push()`, mais uniquement si le premier argument est falsy. En d'autres termes, les éléments suivants sont équivalents :

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
La méthode `transform._transform()` est préfixée par un trait de soulignement car elle est interne à la classe qui la définit et ne doit jamais être appelée directement par les programmes utilisateurs.

`transform._transform()` n'est jamais appelé en parallèle ; les flux implémentent un mécanisme de file d'attente, et pour recevoir le prochain chunk, `callback` doit être appelé, soit de manière synchrone, soit de manière asynchrone.


#### Classe : `stream.PassThrough` {#class-streampassthrough}

La classe `stream.PassThrough` est une implémentation triviale d'un flux [`Transform`](/fr/nodejs/api/stream#class-streamtransform) qui transmet simplement les octets d'entrée à la sortie. Son but est principalement destiné aux exemples et aux tests, mais il existe certains cas d'utilisation où `stream.PassThrough` est utile comme élément de base pour de nouveaux types de flux.

## Notes additionnelles {#additional-notes}

### Compatibilité des flux avec les générateurs asynchrones et les itérateurs asynchrones {#streams-compatibility-with-async-generators-and-async-iterators}

Avec la prise en charge des générateurs et itérateurs asynchrones en JavaScript, les générateurs asynchrones sont effectivement une construction de flux de premier ordre au niveau du langage à ce stade.

Certains cas d'interopérabilité courants de l'utilisation des flux Node.js avec des générateurs et itérateurs asynchrones sont fournis ci-dessous.

#### Consommation de flux lisibles avec des itérateurs asynchrones {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
Les itérateurs asynchrones enregistrent un gestionnaire d'erreurs permanent sur le flux pour éviter toute erreur post-destruction non gérée.

#### Création de flux lisibles avec des générateurs asynchrones {#creating-readable-streams-with-async-generators}

Un flux lisible Node.js peut être créé à partir d'un générateur asynchrone à l'aide de la méthode utilitaire `Readable.from()` :

```js [ESM]
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
#### Connexion à des flux d'écriture à partir d'itérateurs asynchrones {#piping-to-writable-streams-from-async-iterators}

Lors de l'écriture dans un flux d'écriture à partir d'un itérateur asynchrone, assurez-vous de gérer correctement la contre-pression et les erreurs. [`stream.pipeline()`](/fr/nodejs/api/stream#streampipelinesource-transforms-destination-callback) fait abstraction de la gestion de la contre-pression et des erreurs liées à la contre-pression :

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Callback Pattern
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise Pattern
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### Compatibilité avec les anciennes versions de Node.js {#compatibility-with-older-nodejs-versions}

Avant Node.js 0.10, l'interface de flux `Readable` était plus simple, mais aussi moins puissante et moins utile.

- Plutôt que d'attendre les appels à la méthode [`stream.read()`](/fr/nodejs/api/stream#readablereadsize), les événements [`'data'`](/fr/nodejs/api/stream#event-data) commenceraient à émettre immédiatement. Les applications qui auraient besoin d'effectuer un certain travail pour décider comment traiter les données étaient obligées de stocker les données lues dans des tampons afin que les données ne soient pas perdues.
- La méthode [`stream.pause()`](/fr/nodejs/api/stream#readablepause) était consultative, plutôt que garantie. Cela signifiait qu'il était toujours nécessaire d'être prêt à recevoir les événements [`'data'`](/fr/nodejs/api/stream#event-data) *même lorsque le flux était dans un état suspendu*.

Dans Node.js 0.10, la classe [`Readable`](/fr/nodejs/api/stream#class-streamreadable) a été ajoutée. Pour une compatibilité ascendante avec les anciens programmes Node.js, les flux `Readable` passent en "mode flux" lorsqu'un gestionnaire d'événements [`'data'`](/fr/nodejs/api/stream#event-data) est ajouté, ou lorsque la méthode [`stream.resume()`](/fr/nodejs/api/stream#readableresume) est appelée. L'effet est que, même lorsque l'on n'utilise pas la nouvelle méthode [`stream.read()`](/fr/nodejs/api/stream#readablereadsize) et l'événement [`'readable'`](/fr/nodejs/api/stream#event-readable), il n'est plus nécessaire de s'inquiéter de la perte de blocs [`'data'`](/fr/nodejs/api/stream#event-data).

Bien que la plupart des applications continuent de fonctionner normalement, cela introduit un cas limite dans les conditions suivantes :

- Aucun écouteur d'événements [`'data'`](/fr/nodejs/api/stream#event-data) n'est ajouté.
- La méthode [`stream.resume()`](/fr/nodejs/api/stream#readableresume) n'est jamais appelée.
- Le flux n'est pas redirigé vers une destination accessible en écriture.

Par exemple, considérez le code suivant :

```js [ESM]
// ATTENTION ! CASSÉ !
net.createServer((socket) => {

  // Nous ajoutons un écouteur 'end', mais ne consommons jamais les données.
  socket.on('end', () => {
    // Il n'arrivera jamais ici.
    socket.end('Le message a été reçu mais n'a pas été traité.\n');
  });

}).listen(1337);
```
Avant Node.js 0.10, les données des messages entrants seraient simplement supprimées. Cependant, dans Node.js 0.10 et versions ultérieures, le socket reste suspendu indéfiniment.

La solution de contournement dans cette situation consiste à appeler la méthode [`stream.resume()`](/fr/nodejs/api/stream#readableresume) pour démarrer le flux de données :

```js [ESM]
// Solution de contournement.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('Le message a été reçu mais n'a pas été traité.\n');
  });

  // Démarrez le flux de données, en le supprimant.
  socket.resume();
}).listen(1337);
```
En plus des nouveaux flux `Readable` qui passent en mode flux, les flux de style pré-0.10 peuvent être enveloppés dans une classe `Readable` en utilisant la méthode [`readable.wrap()`](/fr/nodejs/api/stream#readablewrapstream).


### `readable.read(0)` {#readableread0}

Dans certains cas, il est nécessaire de déclencher un rafraîchissement des mécanismes de flux lisibles sous-jacents, sans réellement consommer de données. Dans de tels cas, il est possible d'appeler `readable.read(0)`, qui renverra toujours `null`.

Si le tampon de lecture interne est inférieur à `highWaterMark` et que le flux n'est pas en cours de lecture, alors l'appel à `stream.read(0)` déclenchera un appel de bas niveau à [`stream._read()`](/fr/nodejs/api/stream#readable_readsize).

Bien que la plupart des applications n'aient presque jamais besoin de faire cela, il existe des situations au sein de Node.js où cela est fait, en particulier dans les entrailles de la classe de flux `Readable`.

### `readable.push('')` {#readablepush}

L'utilisation de `readable.push('')` n'est pas recommandée.

Pousser une [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String), [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/DataView) de zéro octet vers un flux qui n'est pas en mode objet a un effet secondaire intéressant. Puisqu'il s'agit *bien* d'un appel à [`readable.push()`](/fr/nodejs/api/stream#readablepushchunk-encoding), l'appel mettra fin au processus de lecture. Cependant, comme l'argument est une chaîne vide, aucune donnée n'est ajoutée au tampon lisible, il n'y a donc rien qu'un utilisateur puisse consommer.

### Discrépance `highWaterMark` après l'appel à `readable.setEncoding()` {#highwatermark-discrepancy-after-calling-readablesetencoding}

L'utilisation de `readable.setEncoding()` modifiera le comportement du fonctionnement de `highWaterMark` en mode non-objet.

En général, la taille du tampon actuel est mesurée par rapport à `highWaterMark` en *octets*. Cependant, après l'appel de `setEncoding()`, la fonction de comparaison commencera à mesurer la taille du tampon en *caractères*.

Ce n'est pas un problème dans les cas courants avec `latin1` ou `ascii`. Mais il est conseillé d'être attentif à ce comportement lorsque vous travaillez avec des chaînes qui pourraient contenir des caractères multi-octets.

