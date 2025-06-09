---
title: API Web Streams de Node.js
description: Documentation de l'API Web Streams dans Node.js, expliquant comment travailler avec les flux pour une gestion efficace des données, y compris les flux lisibles, écrivables et de transformation.
head:
  - - meta
    - name: og:title
      content: API Web Streams de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentation de l'API Web Streams dans Node.js, expliquant comment travailler avec les flux pour une gestion efficace des données, y compris les flux lisibles, écrivables et de transformation.
  - - meta
    - name: twitter:title
      content: API Web Streams de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentation de l'API Web Streams dans Node.js, expliquant comment travailler avec les flux pour une gestion efficace des données, y compris les flux lisibles, écrivables et de transformation.
---


# API Web Streams {#web-streams-api}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | N'est plus expérimental. |
| v18.0.0 | L'utilisation de cette API n'émet plus d'avertissement d'exécution. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

::: tip [Stable : 2 - Stable]
[Stable : 2](/fr/nodejs/api/documentation#stability-index) [Stabilité : 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Une implémentation de la [norme WHATWG Streams](https://streams.spec.whatwg.org/).

## Aperçu {#overview}

La [norme WHATWG Streams](https://streams.spec.whatwg.org/) (ou « flux Web ») définit une API pour la gestion des données de flux. Elle est similaire à l'API [Streams](/fr/nodejs/api/stream) de Node.js, mais elle est apparue plus tard et est devenue l'API « standard » pour la diffusion de données en continu dans de nombreux environnements JavaScript.

Il existe trois principaux types d'objets :

- `ReadableStream` - Représente une source de données de flux.
- `WritableStream` - Représente une destination pour les données de flux.
- `TransformStream` - Représente un algorithme de transformation des données de flux.

### Exemple `ReadableStream` {#example-readablestream}

Cet exemple crée un `ReadableStream` simple qui envoie l'horodatage `performance.now()` actuel une fois par seconde indéfiniment. Un itérable asynchrone est utilisé pour lire les données du flux.

::: code-group
```js [ESM]
import {
  ReadableStream,
} from 'node:stream/web';

import {
  setInterval as every,
} from 'node:timers/promises';

import {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

for await (const value of stream)
  console.log(value);
```

```js [CJS]
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} = require('node:perf_hooks');

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```
:::


## API {#api}

### Classe : `ReadableStream` {#class-readablestream}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l'objet global. |
| v16.5.0 | Ajoutée dans : v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**Ajoutée dans : v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur qui est invoquée immédiatement lorsque le `ReadableStream` est créé.
    - `controller` [\<ReadableStreamDefaultController\>](/fr/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/fr/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Retourne : `undefined` ou une promesse résolue avec `undefined`.
  
 
    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur qui est appelée à plusieurs reprises lorsque la file d'attente interne `ReadableStream` n'est pas pleine. L'opération peut être synchrone ou asynchrone. Si elle est asynchrone, la fonction ne sera pas appelée à nouveau tant que la promesse précédemment retournée n'est pas résolue.
    - `controller` [\<ReadableStreamDefaultController\>](/fr/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/fr/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Retourne : Une promesse résolue avec `undefined`.
  
 
    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur qui est appelée lorsque le `ReadableStream` est annulé.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retourne : Une promesse résolue avec `undefined`.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Doit être `'bytes'` ou `undefined`.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Utilisé uniquement lorsque `type` est égal à `'bytes'`. Lorsqu'il est défini sur une valeur différente de zéro, un tampon de vue est automatiquement alloué à `ReadableByteStreamController.byobRequest`. Lorsqu'il n'est pas défini, il faut utiliser les files d'attente internes du flux pour transférer des données via le lecteur par défaut `ReadableStreamDefaultReader`.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale de la file d'attente interne avant que la contre-pression ne soit appliquée.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur, utilisée pour identifier la taille de chaque bloc de données.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `readableStream.locked` {#readablestreamlocked}

**Ajouté dans : v16.5.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Défini sur `true` s'il existe un lecteur actif pour ce [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream).

La propriété `readableStream.locked` est `false` par défaut et passe à `true` lorsqu'il existe un lecteur actif consommant les données du flux.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**Ajouté dans : v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : Une promesse résolue avec `undefined` une fois l'annulation terminée.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**Ajouté dans : v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` ou `undefined`
  
 
- Retourne : [\<ReadableStreamDefaultReader\>](/fr/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/fr/nodejs/api/webstreams#class-readastreambyobreader)



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

const stream = new ReadableStream();

const reader = stream.getReader();

console.log(await reader.read());
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

const stream = new ReadableStream();

const reader = stream.getReader();

reader.read().then(console.log);
```
:::

Fait passer `readableStream.locked` à `true`.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**Ajouté dans : v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `readable` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) Le `ReadableStream` vers lequel `transform.writable` enverra les données potentiellement modifiées qu'il reçoit de ce `ReadableStream`.
    - `writable` [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) Le `WritableStream` dans lequel les données de ce `ReadableStream` seront écrites.
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les erreurs dans ce `ReadableStream` n'entraîneront pas l'abandon de `transform.writable`.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les erreurs dans la destination `transform.writable` n'entraînent pas l'annulation de ce `ReadableStream`.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, la fermeture de ce `ReadableStream` n'entraîne pas la fermeture de `transform.writable`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d'annuler le transfert de données à l'aide d'un [\<AbortController\>](/fr/nodejs/api/globals#class-abortcontroller).
  
 
- Retourne : [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) Depuis `transform.readable`.

Connecte ce [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) à la paire de [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) et [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) fournie dans l'argument `transform` de sorte que les données de ce [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) soient écrites dans `transform.writable`, éventuellement transformées, puis envoyées à `transform.readable`. Une fois le pipeline configuré, `transform.readable` est renvoyé.

Fait passer `readableStream.locked` à `true` pendant que l'opération de pipe est active.



::: code-group
```js [ESM]
import {
  ReadableStream,
  TransformStream,
} from 'node:stream/web';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

for await (const chunk of transformedStream)
  console.log(chunk);
  // Prints: A
```

```js [CJS]
const {
  ReadableStream,
  TransformStream,
} = require('node:stream/web');

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

(async () => {
  for await (const chunk of transformedStream)
    console.log(chunk);
    // Prints: A
})();
```
:::

#### `readableStream.pipeTo(destination[, options])` {#readablestreampipetodestination-options}

**Ajouté dans : v16.5.0**

- `destination` [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) Un [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) vers lequel les données de ce `ReadableStream` seront écrites.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les erreurs dans ce `ReadableStream` n'entraîneront pas l'abandon de `destination`.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les erreurs dans la `destination` n'entraîneront pas l'annulation de ce `ReadableStream`.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, la fermeture de ce `ReadableStream` n'entraîne pas la fermeture de `destination`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet d'annuler le transfert de données à l'aide d'un [\<AbortController\>](/fr/nodejs/api/globals#class-abortcontroller).
  
 
- Retourne : Une promesse résolue avec `undefined`

Fait en sorte que `readableStream.locked` soit `true` pendant que l'opération de tube est active.

#### `readableStream.tee()` {#readablestreamtee}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.10.0, v16.18.0 | Prise en charge du partage d'un flux d'octets lisible. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

- Retourne : [\<ReadableStream[]\>](/fr/nodejs/api/webstreams#class-readablestream)

Retourne une paire de nouvelles instances [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) vers lesquelles les données de ce `ReadableStream` seront transmises. Chacune recevra les mêmes données.

Fait en sorte que `readableStream.locked` soit `true`.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Ajouté dans : v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, empêche le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) d'être fermé lorsque l'itérateur asynchrone se termine brusquement. **Par défaut** : `false`.
  
 

Crée et retourne un itérateur asynchrone utilisable pour consommer les données de ce `ReadableStream`.

Fait en sorte que `readableStream.locked` soit `true` pendant que l'itérateur asynchrone est actif.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### Itération Asynchrone {#async-iteration}

L'objet [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) prend en charge le protocole d'itérateur asynchrone en utilisant la syntaxe `for await`.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
L'itérateur asynchrone consommera le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) jusqu'à ce qu'il se termine.

Par défaut, si l'itérateur asynchrone se termine prématurément (via un `break`, un `return` ou un `throw`), le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) sera fermé. Pour empêcher la fermeture automatique du [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream), utilisez la méthode `readableStream.values()` pour acquérir l'itérateur asynchrone et définissez l'option `preventCancel` sur `true`.

Le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) ne doit pas être verrouillé (c'est-à-dire qu'il ne doit pas avoir de lecteur actif existant). Pendant l'itération asynchrone, le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) sera verrouillé.

#### Transfert avec `postMessage()` {#transferring-with-postmessage}

Une instance de [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) peut être transférée en utilisant un [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new ReadableStream(getReadableSourceSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getReader().read().then((chunk) => {
    console.log(chunk);
  });
};

port2.postMessage(stream, [stream]);
```
### `ReadableStream.from(iterable)` {#readablestreamfromiterable}

**Ajouté dans : v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Objet implémentant le protocole itérable `Symbol.asyncIterator` ou `Symbol.iterator`.

Une méthode utilitaire qui crée un nouveau [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) à partir d'un itérable.

::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const stream = ReadableStream.from(asyncIterableGenerator());

for await (const chunk of stream)
  console.log(chunk); // Prints: 'a', 'b', 'c'
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

(async () => {
  const stream = ReadableStream.from(asyncIterableGenerator());

  for await (const chunk of stream)
    console.log(chunk); // Prints: 'a', 'b', 'c'
})();
```
:::


### Classe : `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est désormais exposée sur l’objet global. |
| v16.5.0 | Ajoutée dans : v16.5.0 |
:::

Par défaut, appeler `readableStream.getReader()` sans arguments renverra une instance de `ReadableStreamDefaultReader`. Le lecteur par défaut traite les morceaux de données transmis via le flux comme des valeurs opaques, ce qui permet à [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) de fonctionner généralement avec n’importe quelle valeur JavaScript.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**Ajoutée dans : v16.5.0**

- `stream` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)

Crée un nouveau [\<ReadableStreamDefaultReader\>](/fr/nodejs/api/webstreams#class-readablestreamdefaultreader) qui est verrouillé sur le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) donné.

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**Ajoutée dans : v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : Une Promise résolue avec `undefined`.

Annule le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) et retourne une Promise qui est résolue lorsque le flux sous-jacent a été annulé.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**Ajoutée dans : v16.5.0**

- Type : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Résolue avec `undefined` lorsque le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) associé est fermé ou rejetée si le flux présente des erreurs ou si le verrou du lecteur est libéré avant que le flux ne termine sa fermeture.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**Ajoutée dans : v16.5.0**

- Retourne : Une Promise résolue avec un objet :
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Demande le prochain morceau de données du [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) sous-jacent et retourne une Promise qui est résolue avec les données une fois qu’elles sont disponibles.


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Ajouté dans : v16.5.0**

Libère le verrouillage de ce lecteur sur le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) sous-jacent.

### Classe : `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est désormais exposée sur l'objet global. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

`ReadableStreamBYOBReader` est un consommateur alternatif pour les [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) orientés octets (ceux qui sont créés avec `underlyingSource.type` défini sur `'bytes'` lorsque le `ReadableStream` a été créé).

`BYOB` est l'abréviation de "bring your own buffer" (apportez votre propre tampon). Il s'agit d'un modèle qui permet une lecture plus efficace des données orientées octets qui évite les copies superflues.

```js [ESM]
import {
  open,
} from 'node:fs/promises';

import {
  ReadableStream,
} from 'node:stream/web';

import { Buffer } from 'node:buffer';

class Source {
  type = 'bytes';
  autoAllocateChunkSize = 1024;

  async start(controller) {
    this.file = await open(new URL(import.meta.url));
    this.controller = controller;
  }

  async pull(controller) {
    const view = controller.byobRequest?.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength,
    });

    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    controller.byobRequest.respond(bytesRead);
  }
}

const stream = new ReadableStream(new Source());

async function read(stream) {
  const reader = stream.getReader({ mode: 'byob' });

  const chunks = [];
  let result;
  do {
    result = await reader.read(Buffer.alloc(100));
    if (result.value !== undefined)
      chunks.push(Buffer.from(result.value));
  } while (!result.done);

  return Buffer.concat(chunks);
}

const data = await read(stream);
console.log(Buffer.from(data).toString());
```
#### `new ReadableStreamBYOBReader(stream)` {#new-readablestreambyobreaderstream}

**Ajouté dans : v16.5.0**

- `stream` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)

Crée un nouveau `ReadableStreamBYOBReader` qui est verrouillé sur le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) donné.


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Ajouté dans : v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : Une promesse résolue avec `undefined`.

Annule le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) et renvoie une promesse qui est résolue lorsque le flux sous-jacent a été annulé.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Ajouté dans : v16.5.0**

- Type : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Résolue avec `undefined` lorsque le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) associé est fermé ou rejetée si le flux rencontre une erreur ou si le verrou du lecteur est libéré avant que le flux ne finisse de se fermer.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.7.0, v20.17.0 | Ajout de l'option `min`. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

- `view` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lorsqu'elle est définie, la promesse renvoyée ne sera résolue que lorsque le nombre `min` d'éléments sera disponible. Lorsqu'elle n'est pas définie, la promesse se résout lorsqu'au moins un élément est disponible.


- Retourne : Une promesse résolue avec un objet :
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


Demande le bloc de données suivant depuis le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) sous-jacent et renvoie une promesse qui est résolue avec les données une fois qu'elles sont disponibles.

Ne passez pas une instance d'objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) mis en pool à cette méthode. Les objets `Buffer` mis en pool sont créés à l'aide de `Buffer.allocUnsafe()`, ou `Buffer.from()`, ou sont souvent renvoyés par divers rappels du module `node:fs`. Ces types de `Buffer` utilisent un objet [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) sous-jacent partagé qui contient toutes les données de toutes les instances `Buffer` mises en pool. Lorsqu'un `Buffer`, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) est passé à `readableStreamBYOBReader.read()`, l'`ArrayBuffer` sous-jacent de la vue est *détaché*, invalidant toutes les vues existantes qui peuvent exister sur cet `ArrayBuffer`. Cela peut avoir des conséquences désastreuses pour votre application.


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Ajouté dans : v16.5.0**

Libère le verrou de ce lecteur sur le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) sous-jacent.

### Classe : `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Ajouté dans : v16.5.0**

Chaque [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) a un contrôleur responsable de l'état interne et de la gestion de la file d'attente du stream. Le `ReadableStreamDefaultController` est l'implémentation de contrôleur par défaut pour les `ReadableStream`s qui ne sont pas orientés octets.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Ajouté dans : v16.5.0**

Ferme le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) auquel ce contrôleur est associé.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Ajouté dans : v16.5.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Renvoie la quantité de données restante pour remplir la file d'attente du [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Ajouté dans : v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Ajoute un nouveau bloc de données à la file d'attente du [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Ajouté dans : v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Signale une erreur qui provoque l'erreur et la fermeture du [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream).

### Classe : `ReadableByteStreamController` {#class-readablebytestreamcontroller}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.10.0 | Prise en charge de la gestion d'une requête de tirage BYOB d'un lecteur libéré. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

Chaque [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) a un contrôleur responsable de l'état interne et de la gestion de la file d'attente du stream. Le `ReadableByteStreamController` est destiné aux `ReadableStream`s orientés octets.


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Ajouté dans : v16.5.0**

- Type : [\<ReadableStreamBYOBRequest\>](/fr/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Ajouté dans : v16.5.0**

Ferme le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) auquel ce contrôleur est associé.

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Ajouté dans : v16.5.0**

- Type : [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number)

Renvoie la quantité de données restant à remplir dans la file d'attente du [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Ajouté dans : v16.5.0**

- `chunk` : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Ajoute un nouveau bloc de données à la file d'attente du [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Ajouté dans : v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)

Signale une erreur qui provoque l'erreur et la fermeture du [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream).

### Classe : `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est désormais exposée sur l'objet global. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

Lors de l'utilisation de `ReadableByteStreamController` dans les flux orientés octets, et lors de l'utilisation de `ReadableStreamBYOBReader`, la propriété `readableByteStreamController.byobRequest` fournit un accès à une instance `ReadableStreamBYOBRequest` qui représente la requête de lecture en cours. L'objet est utilisé pour accéder à l'`ArrayBuffer`/`TypedArray` qui a été fourni pour que la requête de lecture soit remplie, et fournit des méthodes pour signaler que les données ont été fournies.


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**Ajouté dans : v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Signale qu'un nombre `bytesWritten` d'octets a été écrit dans `readableStreamBYOBRequest.view`.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**Ajouté dans : v16.5.0**

- `view` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Signale que la requête a été satisfaite avec des octets écrits dans un nouveau `Buffer`, `TypedArray` ou `DataView`.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**Ajouté dans : v16.5.0**

- Type : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### Classe : `WritableStream` {#class-writablestream}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l'objet global. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

Le `WritableStream` est une destination vers laquelle les données de flux sont envoyées.

```js [ESM]
import {
  WritableStream,
} from 'node:stream/web';

const stream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
});

await stream.getWriter().write('Hello World');
```
#### `new WritableStream([underlyingSink[, strategy]])` {#new-writablestreamunderlyingsink-strategy}

**Ajouté dans : v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur qui est invoquée immédiatement lorsque le `WritableStream` est créé.
    - `controller` [\<WritableStreamDefaultController\>](/fr/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Retourne : `undefined` ou une promesse remplie avec `undefined`.


    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur qui est invoquée lorsqu'un bloc de données a été écrit dans le `WritableStream`.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/fr/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Retourne : Une promesse remplie avec `undefined`.


    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur qui est appelée lorsque le `WritableStream` est fermé.
    - Retourne : Une promesse remplie avec `undefined`.


    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur qui est appelée pour fermer brusquement le `WritableStream`.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retourne : Une promesse remplie avec `undefined`.


    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) L'option `type` est réservée pour une utilisation future et *doit* être indéfinie.


- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale de la file d'attente interne avant l'application de la contre-pression.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l'utilisateur utilisée pour identifier la taille de chaque bloc de données.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**Ajouté dans : v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : Une promesse remplie avec `undefined`.

Interrompt brusquement le `WritableStream`. Toutes les écritures en file d’attente seront annulées avec leurs promesses associées rejetées.

#### `writableStream.close()` {#writablestreamclose}

**Ajouté dans : v16.5.0**

- Retourne : Une promesse remplie avec `undefined`.

Ferme le `WritableStream` lorsqu’aucune écriture supplémentaire n’est attendue.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**Ajouté dans : v16.5.0**

- Retourne : [\<WritableStreamDefaultWriter\>](/fr/nodejs/api/webstreams#class-writablestreamdefaultwriter)

Crée et retourne une nouvelle instance d’écriture qui peut être utilisée pour écrire des données dans le `WritableStream`.

#### `writableStream.locked` {#writablestreamlocked}

**Ajouté dans : v16.5.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `writableStream.locked` est `false` par défaut et passe à `true` lorsqu’il y a un writer actif attaché à ce `WritableStream`.

#### Transfert avec postMessage() {#transferring-with-postmessage_1}

Une instance [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) peut être transférée en utilisant un [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### Classe : `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l’objet global. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**Ajouté dans : v16.5.0**

- `stream` [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)

Crée un nouveau `WritableStreamDefaultWriter` qui est verrouillé au `WritableStream` donné.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**Ajouté dans : v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : Une promesse remplie avec `undefined`.

Interrompt brusquement le `WritableStream`. Toutes les écritures en file d’attente seront annulées avec leurs promesses associées rejetées.


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**Ajouté dans : v16.5.0**

- Retourne : Une promesse résolue avec `undefined`.

Ferme le `WritableStream` lorsqu'aucune écriture supplémentaire n'est attendue.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**Ajouté dans : v16.5.0**

- Type : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Résolue avec `undefined` lorsque le [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) associé est fermé ou rejetée si le flux rencontre des erreurs ou si le verrou du writer est relâché avant que le flux ne termine sa fermeture.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**Ajouté dans : v16.5.0**

- Type : [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)

La quantité de données requise pour remplir la file d'attente du [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**Ajouté dans : v16.5.0**

- Type : [\<Promise\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise) Résolue avec `undefined` lorsque le writer est prêt à être utilisé.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**Ajouté dans : v16.5.0**

Libère le verrou de ce writer sur le [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) sous-jacent.

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**Ajouté dans : v16.5.0**

- `chunk` : [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : Une promesse résolue avec `undefined`.

Ajoute un nouveau bloc de données à la file d'attente du [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream).

### Classe : `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l'objet global. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

Le `WritableStreamDefaultController` gère l'état interne du [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**Ajouté dans : v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Data_types)

Appelé par le code utilisateur pour signaler qu'une erreur s'est produite lors du traitement des données du `WritableStream`. Une fois appelé, le [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) sera abandonné, avec les écritures en attente actuellement annulées.


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- Type : [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un `AbortSignal` qui peut être utilisé pour annuler les opérations d’écriture ou de fermeture en attente lorsqu’un [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) est interrompu.

### Class : `TransformStream` {#class-transformstream}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l’objet global. |
| v16.5.0 | Ajoutée dans : v16.5.0 |
:::

Un `TransformStream` se compose d’un [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) et d’un [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream) qui sont connectés de telle sorte que les données écrites dans le `WritableStream` soient reçues, et potentiellement transformées, avant d’être poussées dans la file d’attente du `ReadableStream`.

```js [ESM]
import {
  TransformStream,
} from 'node:stream/web';

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

await Promise.all([
  transform.writable.getWriter().write('A'),
  transform.readable.getReader().read(),
]);
```
#### `new TransformStream([transformer[, writableStrategy[, readableStrategy]]])` {#new-transformstreamtransformer-writablestrategy-readablestrategy}

**Ajoutée dans : v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l’utilisateur qui est appelée immédiatement lorsque le `TransformStream` est créé.
    - `controller` [\<TransformStreamDefaultController\>](/fr/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Renvoie : `undefined` ou une promesse remplie avec `undefined`

    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l’utilisateur qui reçoit, et potentiellement modifie, un bloc de données écrit dans `transformStream.writable`, avant de le transférer vers `transformStream.readable`.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/fr/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Renvoie : une promesse remplie avec `undefined`.

    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l’utilisateur qui est appelée immédiatement avant que le côté accessible en écriture du `TransformStream` ne soit fermé, signalant la fin du processus de transformation.
    - `controller` [\<TransformStreamDefaultController\>](/fr/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Renvoie : une promesse remplie avec `undefined`.

    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) l’option `readableType` est réservée pour une utilisation future et *doit* être `undefined`.
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) l’option `writableType` est réservée pour une utilisation future et *doit* être `undefined`.

- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale de la file d’attente interne avant l’application de la contre-pression.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l’utilisateur utilisée pour identifier la taille de chaque bloc de données.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Renvoie : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale de la file d’attente interne avant l’application de la contre-pression.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction définie par l’utilisateur utilisée pour identifier la taille de chaque bloc de données.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Renvoie : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `transformStream.readable` {#transformstreamreadable}

**Ajouté dans : v16.5.0**

- Type : [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Ajouté dans : v16.5.0**

- Type : [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)

#### Transfert avec postMessage() {#transferring-with-postmessage_2}

Une instance de [\<TransformStream\>](/fr/nodejs/api/webstreams#class-transformstream) peut être transférée en utilisant un [\<MessagePort\>](/fr/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### Classe : `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l'objet global. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

Le `TransformStreamDefaultController` gère l'état interne du `TransformStream`.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Ajouté dans : v16.5.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La quantité de données nécessaire pour remplir la queue côté lisible.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Ajouté dans : v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Ajoute un morceau de données à la queue côté lisible.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Ajouté dans : v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Signale aux côtés lisible et inscriptible qu'une erreur s'est produite lors du traitement des données de transformation, ce qui entraîne la fermeture abrupte des deux côtés.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Ajouté dans : v16.5.0**

Ferme le côté lisible du transport et entraîne la fermeture abrupte du côté inscriptible avec une erreur.

### Classe : `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l'objet global. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**Ajouté dans : v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**Ajouté dans : v16.5.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**Ajouté dans : v16.5.0**

- Type : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Class: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l’objet global. |
| v16.5.0 | Ajouté dans : v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**Ajouté dans : v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**Ajouté dans : v16.5.0**

- Type : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**Ajouté dans : v16.5.0**

- Type : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

### Class: `TextEncoderStream` {#class-textencoderstream}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l’objet global. |
| v16.6.0 | Ajouté dans : v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**Ajouté dans : v16.6.0**

Crée une nouvelle instance de `TextEncoderStream`.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Ajouté dans : v16.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L’encodage pris en charge par l’instance de `TextEncoderStream`.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Ajouté dans : v16.6.0**

- Type : [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Ajouté dans : v16.6.0**

- Type : [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)

### Class: `TextDecoderStream` {#class-textdecoderstream}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est désormais exposée sur l’objet global. |
| v16.6.0 | Ajouté dans : v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Ajouté dans : v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifie l’`encoding` que cette instance de `TextDecoder` prend en charge. **Par défaut :** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si les échecs de décodage sont fatals.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, le `TextDecoderStream` inclura la marque d’ordre des octets dans le résultat décodé. Lorsque `false`, la marque d’ordre des octets sera supprimée de la sortie. Cette option n’est utilisée que lorsque `encoding` est `'utf-8'`, `'utf-16be'` ou `'utf-16le'`. **Par défaut :** `false`.
  
 

Crée une nouvelle instance de `TextDecoderStream`.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Ajouté dans : v16.6.0**

- Type : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L’encodage pris en charge par l’instance de `TextDecoderStream`.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Ajouté dans : v16.6.0**

- Type : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La valeur sera `true` si les erreurs de décodage entraînent la levée d’une `TypeError`.


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Ajouté dans: v16.6.0**

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La valeur sera `true` si le résultat du décodage inclut la marque d’ordre des octets.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Ajouté dans: v16.6.0**

- Type: [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Ajouté dans: v16.6.0**

- Type: [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)

### Class: `CompressionStream` {#class-compressionstream}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l’objet global. |
| v17.0.0 | Ajouté dans: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.2.0, v20.12.0 | Le format accepte désormais la valeur `deflate-raw`. |
| v17.0.0 | Ajouté dans: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un parmi `'deflate'`, `'deflate-raw'`, ou `'gzip'`.

#### `compressionStream.readable` {#compressionstreamreadable}

**Ajouté dans: v17.0.0**

- Type: [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Ajouté dans: v17.0.0**

- Type: [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)

### Class: `DecompressionStream` {#class-decompressionstream}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Cette classe est maintenant exposée sur l’objet global. |
| v17.0.0 | Ajouté dans: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.2.0, v20.12.0 | Le format accepte désormais la valeur `deflate-raw`. |
| v17.0.0 | Ajouté dans: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un parmi `'deflate'`, `'deflate-raw'`, ou `'gzip'`.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Ajouté dans: v17.0.0**

- Type: [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Ajouté dans: v17.0.0**

- Type: [\<WritableStream\>](/fr/nodejs/api/webstreams#class-writablestream)


### Consommateurs d'utilitaires {#utility-consumers}

**Ajouté dans : v16.7.0**

Les fonctions de consommateur d'utilitaires fournissent des options courantes pour consommer des flux.

Elles sont accessibles en utilisant :

::: code-group
```js [ESM]
import {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} from 'node:stream/consumers';
```

```js [CJS]
const {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} = require('node:stream/consumers');
```
:::

#### `streamConsumers.arrayBuffer(stream)` {#streamconsumersarraybufferstream}

**Ajouté dans : v16.7.0**

- `stream` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec un `ArrayBuffer` contenant le contenu complet du flux.

::: code-group
```js [ESM]
import { arrayBuffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');

const readable = Readable.from(dataArray);
const data = await arrayBuffer(readable);
console.log(`from readable: ${data.byteLength}`);
// Prints: from readable: 76
```

```js [CJS]
const { arrayBuffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { TextEncoder } = require('node:util');

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');
const readable = Readable.from(dataArray);
arrayBuffer(readable).then((data) => {
  console.log(`from readable: ${data.byteLength}`);
  // Prints: from readable: 76
});
```
:::

#### `streamConsumers.blob(stream)` {#streamconsumersblobstream}

**Ajouté dans : v16.7.0**

- `stream` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec un [\<Blob\>](/fr/nodejs/api/buffer#class-blob) contenant le contenu complet du flux.

::: code-group
```js [ESM]
import { blob } from 'node:stream/consumers';

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
const data = await blob(readable);
console.log(`from readable: ${data.size}`);
// Prints: from readable: 27
```

```js [CJS]
const { blob } = require('node:stream/consumers');

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
blob(readable).then((data) => {
  console.log(`from readable: ${data.size}`);
  // Prints: from readable: 27
});
```
:::


#### `streamConsumers.buffer(stream)` {#streamconsumersbufferstream}

**Ajouté dans : v16.7.0**

- `stream` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) contenant l’intégralité du contenu du flux.

::: code-group
```js [ESM]
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Affiche : from readable: 27
```

```js [CJS]
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Affiche : from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**Ajouté dans : v16.7.0**

- `stream` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec le contenu du flux analysé en tant que chaîne encodée en UTF-8 qui est ensuite passée via `JSON.parse()`.

::: code-group
```js [ESM]
import { json } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
const data = await json(readable);
console.log(`from readable: ${data.length}`);
// Affiche : from readable: 100
```

```js [CJS]
const { json } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
json(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Affiche : from readable: 100
});
```
:::


#### `streamConsumers.text(stream)` {#streamconsumerstextstream}

**Ajouté dans : v16.7.0**

- `stream` [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec le contenu du flux analysé en tant que chaîne encodée en UTF-8.

::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

