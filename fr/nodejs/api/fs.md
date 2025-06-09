---
title: Documentation de l'API du système de fichiers de Node.js
description: Guide complet sur le module système de fichiers de Node.js, détaillant les méthodes pour les opérations sur les fichiers comme la lecture, l'écriture, l'ouverture, la fermeture, et la gestion des permissions et des statistiques de fichiers.
head:
  - - meta
    - name: og:title
      content: Documentation de l'API du système de fichiers de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Guide complet sur le module système de fichiers de Node.js, détaillant les méthodes pour les opérations sur les fichiers comme la lecture, l'écriture, l'ouverture, la fermeture, et la gestion des permissions et des statistiques de fichiers.
  - - meta
    - name: twitter:title
      content: Documentation de l'API du système de fichiers de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Guide complet sur le module système de fichiers de Node.js, détaillant les méthodes pour les opérations sur les fichiers comme la lecture, l'écriture, l'ouverture, la fermeture, et la gestion des permissions et des statistiques de fichiers.
---


# Système de fichiers {#file-system}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

Le module `node:fs` permet d'interagir avec le système de fichiers d'une manière calquée sur les fonctions POSIX standard.

Pour utiliser les API basées sur les promesses :

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

Pour utiliser les API de rappel et synchrones :

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

Toutes les opérations du système de fichiers ont des formes synchrones, de rappel et basées sur des promesses, et sont accessibles en utilisant la syntaxe CommonJS et les modules ES6 (ESM).

## Exemple de promesse {#promise-example}

Les opérations basées sur les promesses renvoient une promesse qui est tenue lorsque l'opération asynchrone est terminée.

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```
:::

## Exemple de rappel {#callback-example}

La forme de rappel prend une fonction de rappel d'achèvement comme dernier argument et invoque l'opération de manière asynchrone. Les arguments transmis au rappel d'achèvement dépendent de la méthode, mais le premier argument est toujours réservé à une exception. Si l'opération est terminée avec succès, alors le premier argument est `null` ou `undefined`.

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
:::

Les versions basées sur le rappel des API du module `node:fs` sont préférables à l'utilisation des API de promesse lorsque des performances maximales (tant en termes de temps d'exécution que d'allocation de mémoire) sont requises.


## Exemple synchrone {#synchronous-example}

Les API synchrones bloquent la boucle d'événements Node.js et l'exécution ultérieure de JavaScript jusqu'à ce que l'opération soit terminée. Les exceptions sont levées immédiatement et peuvent être gérées à l'aide de `try…catch`, ou peuvent être autorisées à remonter.

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```
:::

## API Promises {#promises-api}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Exposé comme `require('fs/promises')`. |
| v11.14.0, v10.17.0 | Cette API n'est plus expérimentale. |
| v10.1.0 | L'API est accessible via `require('fs').promises` uniquement. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

L'API `fs/promises` fournit des méthodes asynchrones de système de fichiers qui renvoient des promesses.

Les API de promesses utilisent le pool de threads Node.js sous-jacent pour effectuer les opérations du système de fichiers hors du thread de boucle d'événements. Ces opérations ne sont pas synchronisées ou thread-safe. Des précautions doivent être prises lors de l'exécution de plusieurs modifications simultanées sur le même fichier, car une corruption des données peut se produire.

### Classe : `FileHandle` {#class-filehandle}

**Ajouté dans : v10.0.0**

Un objet [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) est un wrapper d'objet pour un descripteur de fichier numérique.

Les instances de l'objet [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) sont créées par la méthode `fsPromises.open()`.

Tous les objets [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) sont des [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter).

Si un [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) n'est pas fermé à l'aide de la méthode `filehandle.close()`, il tentera de fermer automatiquement le descripteur de fichier et d'émettre un avertissement de processus, aidant à prévenir les fuites de mémoire. Veuillez ne pas vous fier à ce comportement car il peut être peu fiable et le fichier peut ne pas être fermé. Au lieu de cela, fermez toujours explicitement les [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle). Node.js peut modifier ce comportement à l'avenir.


#### Événement : `'close'` {#event-close}

**Ajouté dans : v15.4.0**

L'événement `'close'` est émis lorsque le [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) a été fermé et ne peut plus être utilisé.

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.1.0, v20.10.0 | L'option `flush` est désormais prise en charge. |
| v15.14.0, v14.18.0 | L'argument `data` prend en charge `AsyncIterable`, `Iterable` et `Stream`. |
| v14.0.0 | Le paramètre `data` ne forcera plus les entrées non prises en charge en chaînes de caractères. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/fr/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, le descripteur de fichier sous-jacent est vidé avant sa fermeture. **Par défaut :** `false`.
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Alias de [`filehandle.writeFile()`](/fr/nodejs/api/fs#filehandlewritefiledata-options).

Lors de l'utilisation de descripteurs de fichiers, le mode ne peut pas être modifié par rapport à ce qui a été défini avec [`fsPromises.open()`](/fr/nodejs/api/fs#fspromisesopenpath-flags-mode). Par conséquent, cela équivaut à [`filehandle.writeFile()`](/fr/nodejs/api/fs#filehandlewritefiledata-options).


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**Ajouté dans : v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le masque de bits du mode fichier.
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Modifie les permissions sur le fichier. Voir [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**Ajouté dans : v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID utilisateur du nouveau propriétaire du fichier.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID de groupe du nouveau groupe du fichier.
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Modifie la propriété du fichier. Un wrapper pour [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

#### `filehandle.close()` {#filehandleclose}

**Ajouté dans : v10.0.0**

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Ferme le descripteur de fichier après avoir attendu la fin de toute opération en attente sur le descripteur.

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**Ajouté dans : v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `64 * 1024`
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Par défaut :** `undefined`
  
 
- Retourne : [\<fs.ReadStream\>](/fr/nodejs/api/fs#class-fsreadstream)

Les `options` peuvent inclure des valeurs `start` et `end` pour lire une plage d'octets à partir du fichier au lieu de la totalité du fichier. `start` et `end` sont inclusifs et commencent à compter à 0, les valeurs autorisées se trouvent dans la plage [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Si `start` est omis ou `undefined`, `filehandle.createReadStream()` lit séquentiellement à partir de la position actuelle du fichier. L'`encoding` peut être l'une de celles acceptées par [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si le `FileHandle` pointe vers un périphérique de caractères qui ne prend en charge que les lectures bloquantes (tel qu'un clavier ou une carte son), les opérations de lecture ne se terminent pas tant que des données ne sont pas disponibles. Cela peut empêcher le processus de se fermer et le flux de se fermer naturellement.

Par défaut, le flux émettra un événement `'close'` après sa destruction. Définissez l'option `emitClose` sur `false` pour modifier ce comportement.

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Create a stream from some character device.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
```
Si `autoClose` est false, le descripteur de fichier ne sera pas fermé, même en cas d'erreur. Il est de la responsabilité de l'application de le fermer et de s'assurer qu'il n'y a pas de fuite de descripteur de fichier. Si `autoClose` est défini sur true (comportement par défaut), sur `'error'` ou `'end'`, le descripteur de fichier sera fermé automatiquement.

Un exemple pour lire les 10 derniers octets d'un fichier de 100 octets :

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0, v20.10.0 | L'option `flush` est désormais supportée. |
| v16.11.0 | Ajouté dans : v16.11.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, le descripteur de fichier sous-jacent est vidé avant d'être fermé. **Par défaut :** `false`.


- Renvoie : [\<fs.WriteStream\>](/fr/nodejs/api/fs#class-fswritestream)

`options` peut également inclure une option `start` pour permettre l'écriture de données à une position située au-delà du début du fichier. Les valeurs autorisées se trouvent dans la plage [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. La modification d'un fichier plutôt que son remplacement peut nécessiter que l'option `flags` `open` soit définie sur `r+` plutôt que sur la valeur par défaut `r`. L'`encoding` peut être l'une de celles acceptées par [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si `autoClose` est défini sur true (comportement par défaut), le descripteur de fichier sera automatiquement fermé en cas de `'error'` ou de `'finish'`. Si `autoClose` est défini sur false, le descripteur de fichier ne sera pas fermé, même en cas d'erreur. Il incombe à l'application de le fermer et de s'assurer qu'il n'y a pas de fuite de descripteur de fichier.

Par défaut, le flux émettra un événement `'close'` après avoir été détruit. Définissez l'option `emitClose` sur `false` pour modifier ce comportement.


#### `filehandle.datasync()` {#filehandledatasync}

**Ajouté dans : v10.0.0**

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) S'accomplit avec `undefined` en cas de succès.

Force toutes les opérations d'E/S actuellement mises en file d'attente associées au fichier à l'état d'achèvement d'E/S synchronisées du système d'exploitation. Consultez la documentation POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) pour plus de détails.

Contrairement à `filehandle.sync`, cette méthode ne vide pas les métadonnées modifiées.

#### `filehandle.fd` {#filehandlefd}

**Ajouté dans : v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le descripteur de fichier numérique géré par l'objet [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle).

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Accepte les valeurs bigint comme `position`. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un tampon qui sera rempli avec les données de fichier lues.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'emplacement dans le tampon où commencer à remplir. **Par défaut :** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets à lire. **Par défaut :** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'emplacement où commencer à lire les données du fichier. Si `null` ou `-1`, les données seront lues à partir de la position actuelle du fichier, et la position sera mise à jour. Si `position` est un entier non négatif, la position actuelle du fichier restera inchangée. **Par défaut :** `null`
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) S'accomplit en cas de succès avec un objet avec deux propriétés :
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets lus
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Une référence à l'argument `buffer` transmis.

Lit les données du fichier et les stocke dans le tampon donné.

Si le fichier n'est pas modifié simultanément, la fin de fichier est atteinte lorsque le nombre d'octets lus est nul.


#### `filehandle.read([options])` {#filehandlereadoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Accepte les valeurs bigint comme `position`. |
| v13.11.0, v12.17.0 | Ajouté dans : v13.11.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un tampon qui sera rempli avec les données du fichier lues. **Par défaut :** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'emplacement dans le tampon où commencer le remplissage. **Par défaut :** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets à lire. **Par défaut :** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'emplacement à partir duquel commencer la lecture des données du fichier. Si `null` ou `-1`, les données seront lues à partir de la position actuelle du fichier, et la position sera mise à jour. Si `position` est un entier non négatif, la position actuelle du fichier restera inchangée. **Par défaut :** `null`

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise en cas de succès avec un objet avec deux propriétés :
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets lus
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Une référence à l'argument `buffer` transmis.

Lit les données du fichier et les stocke dans le tampon donné.

Si le fichier n'est pas modifié simultanément, la fin de fichier est atteinte lorsque le nombre d'octets lus est nul.


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Accepte les valeurs bigint comme `position`. |
| v18.2.0, v16.17.0 | Ajouté dans : v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un buffer qui sera rempli avec les données du fichier lues.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'emplacement dans le tampon où commencer à remplir. **Par défaut :** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets à lire. **Par défaut :** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'emplacement à partir duquel commencer à lire les données du fichier. Si `null` ou `-1`, les données seront lues à partir de la position actuelle du fichier et la position sera mise à jour. Si `position` est un entier non négatif, la position actuelle du fichier restera inchangée. **Par défaut :** `null`
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise en cas de succès avec un objet avec deux propriétés : 
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets lus.
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Une référence à l'argument `buffer` passé.
  
 

Lit les données du fichier et les stocke dans le buffer donné.

Si le fichier n'est pas modifié simultanément, la fin de fichier est atteinte lorsque le nombre d'octets lus est nul.


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.0.0, v18.17.0 | Ajout d'une option pour créer un flux 'bytes'. |
| v17.0.0 | Ajouté dans : v17.0.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Indique si un flux normal ou un flux `'bytes'` doit être ouvert. **Par défaut :** `undefined`
  
 
-  Renvoie : [\<ReadableStream\>](/fr/nodejs/api/webstreams#class-readablestream) 

Renvoie un `ReadableStream` qui peut être utilisé pour lire les données des fichiers.

Une erreur sera levée si cette méthode est appelée plus d'une fois ou si elle est appelée après que le `FileHandle` est fermé ou en cours de fermeture.



::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

Bien que le `ReadableStream` lise le fichier jusqu'à la fin, il ne fermera pas automatiquement le `FileHandle`. Le code utilisateur doit toujours appeler la méthode `fileHandle.close()`.

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**Ajouté dans: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d'abandonner une readFile en cours
  
 
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est remplie lors d'une lecture réussie avec le contenu du fichier. Si aucun encodage n'est spécifié (en utilisant `options.encoding`), les données sont renvoyées sous forme d'objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer). Sinon, les données seront une chaîne de caractères.

Lit de manière asynchrone tout le contenu d'un fichier.

Si `options` est une chaîne de caractères, alors elle spécifie l'`encoding`.

Le [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) doit prendre en charge la lecture.

Si un ou plusieurs appels `filehandle.read()` sont effectués sur un descripteur de fichier, puis un appel `filehandle.readFile()` est effectué, les données seront lues à partir de la position actuelle jusqu'à la fin du fichier. Il ne lit pas toujours depuis le début du fichier.


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Ajouté dans : v18.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `64 * 1024`
  
 
- Retourne : [\<readline.InterfaceConstructor\>](/fr/nodejs/api/readline#class-interfaceconstructor)

Méthode pratique pour créer une interface `readline` et diffuser en continu sur le fichier. Voir [`filehandle.createReadStream()`](/fr/nodejs/api/fs#filehandlecreatereadstreamoptions) pour les options.



::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**Ajouté dans : v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Le décalage par rapport au début du fichier à partir duquel les données doivent être lues. Si `position` n'est pas un `number`, les données seront lues à partir de la position actuelle. **Par défaut :** `null`
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise en cas de succès avec un objet contenant deux propriétés :
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre d'octets lus
    - `buffers` [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) propriété contenant une référence à l'entrée `buffers`.
  
 

Lire à partir d'un fichier et écrire dans un tableau de [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques renvoyées doivent être de type bigint. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `options` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<booléen\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques de l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) renvoyé doivent être de type `bigint`. **Par défaut :** `false`.


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec un [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour le fichier.

#### `filehandle.sync()` {#filehandlesync}

**Ajouté dans : v10.0.0**

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec `undefined` en cas de succès.

Demande que toutes les données du descripteur de fichier ouvert soient vidées sur le périphérique de stockage. L'implémentation spécifique dépend du système d'exploitation et du périphérique. Reportez-vous à la documentation POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) pour plus de détails.

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**Ajouté dans : v10.0.0**

- `len` [\<entier\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec `undefined` en cas de succès.

Tronque le fichier.

Si le fichier était plus grand que `len` octets, seuls les premiers `len` octets seront conservés dans le fichier.

L'exemple suivant ne conserve que les quatre premiers octets du fichier :

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```
Si le fichier était auparavant plus court que `len` octets, il est étendu et la partie étendue est remplie d'octets nuls (`'\0'`) :

Si `len` est négatif, alors `0` sera utilisé.


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Ajouté dans : v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Modifie les horodatages du système de fichiers de l’objet référencé par le [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle), puis confirme la promesse sans arguments en cas de succès.

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Le paramètre `buffer` ne forcera plus les entrées non prises en charge vers les tampons. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La position de début dans `buffer` à partir de laquelle les données à écrire commencent.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d’octets de `buffer` à écrire. **Par défaut :** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Le décalage par rapport au début du fichier où les données de `buffer` doivent être écrites. Si `position` n’est pas un `number`, les données seront écrites à la position actuelle. Voir la documentation POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) pour plus de détails. **Par défaut :** `null`
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Écrit `buffer` dans le fichier.

La promesse est exécutée avec un objet contenant deux propriétés :

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre d’octets écrits
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) une référence au `buffer` écrit.

Il n’est pas sûr d’utiliser `filehandle.write()` plusieurs fois sur le même fichier sans attendre que la promesse soit remplie (ou rejetée). Pour ce scénario, utilisez [`filehandle.createWriteStream()`](/fr/nodejs/api/fs#filehandlecreatewritestreamoptions).

Sur Linux, les écritures positionnelles ne fonctionnent pas lorsque le fichier est ouvert en mode ajout. Le noyau ignore l’argument de position et ajoute toujours les données à la fin du fichier.


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**Ajouté dans : v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `null`
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Écrit `buffer` dans le fichier.

Similaire à la fonction `filehandle.write` ci-dessus, cette version prend un objet `options` facultatif. Si aucun objet `options` n'est spécifié, il prendra par défaut les valeurs ci-dessus.

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Le paramètre `string` ne forcera plus les entrées non prises en charge en chaînes. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Le décalage par rapport au début du fichier où les données de `string` doivent être écrites. Si `position` n'est pas un `number`, les données seront écrites à la position actuelle. Voir la documentation POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) pour plus de détails. **Par défaut :** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage de chaîne attendu. **Par défaut :** `'utf8'`
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Écrit `string` dans le fichier. Si `string` n'est pas une chaîne, la promesse est rejetée avec une erreur.

La promesse est remplie avec un objet contenant deux propriétés :

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre d'octets écrits
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) une référence à la `string` écrite.

Il est dangereux d'utiliser `filehandle.write()` plusieurs fois sur le même fichier sans attendre que la promesse soit remplie (ou rejetée). Pour ce scénario, utilisez [`filehandle.createWriteStream()`](/fr/nodejs/api/fs#filehandlecreatewritestreamoptions).

Sous Linux, les écritures positionnelles ne fonctionnent pas lorsque le fichier est ouvert en mode append. Le noyau ignore l'argument de position et ajoute toujours les données à la fin du fichier.


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.14.0, v14.18.0 | L'argument `data` prend en charge `AsyncIterable`, `Iterable` et `Stream`. |
| v14.0.0 | Le paramètre `data` ne forcera plus la conversion des entrées non prises en charge en chaînes de caractères. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/fr/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'encodage de caractères attendu lorsque `data` est une chaîne de caractères. **Par défaut :** `'utf8'`


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Écrit de manière asynchrone des données dans un fichier, en remplaçant le fichier s'il existe déjà. `data` peut être une chaîne de caractères, un tampon, un [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) ou un objet [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol). La promesse est remplie sans arguments en cas de succès.

Si `options` est une chaîne de caractères, elle spécifie l'`encoding`.

Le [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) doit prendre en charge l'écriture.

Il est dangereux d'utiliser `filehandle.writeFile()` plusieurs fois sur le même fichier sans attendre que la promesse soit résolue (ou rejetée).

Si un ou plusieurs appels à `filehandle.write()` sont effectués sur un descripteur de fichier, puis qu'un appel à `filehandle.writeFile()` est effectué, les données seront écrites à partir de la position actuelle jusqu'à la fin du fichier. L'écriture ne se fait pas toujours à partir du début du fichier.


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**Ajouté dans : v12.9.0**

- `buffers` [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Le décalage par rapport au début du fichier où les données de `buffers` doivent être écrites. Si `position` n'est pas un `number`, les données seront écrites à la position actuelle. **Par défaut :** `null`
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Écrit un tableau de [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s dans le fichier.

La promesse est remplie avec un objet contenant deux propriétés :

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) le nombre d'octets écrits
- `buffers` [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) une référence à l'entrée `buffers`.

Il est dangereux d'appeler `writev()` plusieurs fois sur le même fichier sans attendre que la promesse soit remplie (ou rejetée).

Sous Linux, les écritures positionnelles ne fonctionnent pas lorsque le fichier est ouvert en mode ajout. Le noyau ignore l'argument de position et ajoute toujours les données à la fin du fichier.

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**Ajouté dans : v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Un alias pour `filehandle.close()`.


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `fs.constants.F_OK`
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec `undefined` en cas de succès.

Teste les autorisations d'un utilisateur pour le fichier ou le répertoire spécifié par `path`. L'argument `mode` est un entier optionnel qui spécifie les contrôles d'accessibilité à effectuer. `mode` doit être soit la valeur `fs.constants.F_OK`, soit un masque constitué du OU bit à bit de l'un des éléments suivants : `fs.constants.R_OK`, `fs.constants.W_OK` et `fs.constants.X_OK` (par exemple, `fs.constants.W_OK | fs.constants.R_OK`). Consultez [Constantes d'accès aux fichiers](/fr/nodejs/api/fs#file-access-constants) pour connaître les valeurs possibles de `mode`.

Si le contrôle d'accessibilité réussit, la promesse est tenue sans valeur. Si l'un des contrôles d'accessibilité échoue, la promesse est rejetée avec un objet [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). L'exemple suivant vérifie si le fichier `/etc/passwd` peut être lu et écrit par le processus en cours.

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```
Il n'est pas recommandé d'utiliser `fsPromises.access()` pour vérifier l'accessibilité d'un fichier avant d'appeler `fsPromises.open()`. Cela introduit une condition de concurrence, car d'autres processus peuvent modifier l'état du fichier entre les deux appels. Au lieu de cela, le code utilisateur doit ouvrir/lire/écrire le fichier directement et gérer l'erreur générée si le fichier n'est pas accessible.

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.1.0, v20.10.0 | L'option `flush` est désormais prise en charge. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) nom de fichier ou [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, le descripteur de fichier sous-jacent est vidé avant d'être fermé. **Par défaut :** `false`.


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec `undefined` en cas de succès.

Ajoute des données à un fichier de manière asynchrone, en créant le fichier s'il n'existe pas encore. `data` peut être une chaîne de caractères ou un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si `options` est une chaîne de caractères, elle spécifie alors l'`encoding`.

L'option `mode` n'affecte que le fichier nouvellement créé. Voir [`fs.open()`](/fr/nodejs/api/fs#fsopenpath-flags-mode-callback) pour plus de détails.

Le `path` peut être spécifié en tant que [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) qui a été ouvert pour l'ajout (à l'aide de `fsPromises.open()`).


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Modifie les permissions d'un fichier.

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Modifie le propriétaire d'un fichier.

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | L'argument `flags` a été remplacé par `mode` et une validation de type plus stricte a été imposée. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) nom du fichier source à copier
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) nom du fichier de destination de l'opération de copie
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Modificateurs optionnels qui spécifient le comportement de l'opération de copie. Il est possible de créer un masque constitué du OU bit à bit d'au moins deux valeurs (par exemple, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`) **Par défaut :** `0`.
    - `fs.constants.COPYFILE_EXCL` : L'opération de copie échoue si `dest` existe déjà.
    - `fs.constants.COPYFILE_FICLONE` : L'opération de copie tente de créer un reflink de copie sur écriture. Si la plateforme ne prend pas en charge la copie sur écriture, un mécanisme de copie de secours est utilisé.
    - `fs.constants.COPYFILE_FICLONE_FORCE` : L'opération de copie tente de créer un reflink de copie sur écriture. Si la plateforme ne prend pas en charge la copie sur écriture, l'opération échoue.
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Copie de manière asynchrone `src` vers `dest`. Par défaut, `dest` est écrasé s'il existe déjà.

Aucune garantie n'est donnée quant à l'atomicité de l'opération de copie. Si une erreur se produit après que le fichier de destination a été ouvert pour écriture, une tentative de suppression de la destination sera effectuée.

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt a été copié vers destination.txt');
} catch {
  console.error('Le fichier n\'a pas pu être copié');
}

// En utilisant COPYFILE_EXCL, l'opération échouera si destination.txt existe.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt a été copié vers destination.txt');
} catch {
  console.error('Le fichier n\'a pas pu être copié');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.3.0 | Cette API n'est plus expérimentale. |
| v20.1.0, v18.17.0 | Accepte une option `mode` supplémentaire pour spécifier le comportement de copie comme l'argument `mode` de `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Accepte une option `verbatimSymlinks` supplémentaire pour spécifier s'il faut effectuer une résolution de chemin pour les liens symboliques. |
| v16.7.0 | Ajouté dans : v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) chemin source à copier.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) chemin de destination vers lequel copier.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) déréférence les liens symboliques. **Par défaut :** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) quand `force` est `false` et que la destination existe, lève une erreur. **Par défaut :** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction permettant de filtrer les fichiers/répertoires copiés. Renvoie `true` pour copier l'élément, `false` pour l'ignorer. Lors de l'ignorance d'un répertoire, tout son contenu sera également ignoré. Peut également renvoyer une `Promise` qui se résout en `true` ou `false` **Par défaut :** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) chemin source à copier.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) chemin de destination vers lequel copier.
    - Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Une valeur coercible en `boolean` ou une `Promise` qui se réalise avec une telle valeur.


    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) écrase le fichier ou le répertoire existant. L'opération de copie ignorera les erreurs si vous définissez cette option sur false et que la destination existe. Utilisez l'option `errorOnExist` pour modifier ce comportement. **Par défaut :** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificateurs pour l'opération de copie. **Par défaut :** `0`. Voir l'indicateur `mode` de [`fsPromises.copyFile()`](/fr/nodejs/api/fs#fspromisescopyfilesrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les horodatages de `src` seront conservés. **Par défaut :** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copie les répertoires de manière récursive. **Par défaut :** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, la résolution de chemin pour les liens symboliques sera ignorée. **Par défaut :** `false`


- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec `undefined` en cas de succès.

Copie de manière asynchrone toute la structure de répertoires de `src` vers `dest`, y compris les sous-répertoires et les fichiers.

Lors de la copie d'un répertoire vers un autre répertoire, les globs ne sont pas pris en charge et le comportement est similaire à `cp dir1/ dir2/`.


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.2.0 | Ajout du support de `withFileTypes` en tant qu'option. |
| v22.0.0 | Ajouté dans : v22.0.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) répertoire de travail courant. **Par défaut :** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction pour filtrer les fichiers/répertoires. Retourne `true` pour exclure l'élément, `false` pour l'inclure. **Par défaut :** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la glob doit retourner les chemins en tant que Dirents, `false` sinon. **Par défaut :** `false`.

- Retourne : [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Un AsyncIterator qui produit les chemins des fichiers correspondant au modèle.

::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**Obsolète depuis : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec `undefined` en cas de succès.

Modifie les permissions sur un lien symbolique.

Cette méthode est uniquement implémentée sur macOS.


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.6.0 | Cette API n'est plus obsolète. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Réussit avec `undefined` en cas de succès.

Modifie la propriété d'un lien symbolique.

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**Ajouté dans : v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Réussit avec `undefined` en cas de succès.

Modifie les heures d'accès et de modification d'un fichier de la même manière que [`fsPromises.utimes()`](/fr/nodejs/api/fs#fspromisesutimespath-atime-mtime), à la différence que si le chemin fait référence à un lien symbolique, alors le lien n'est pas déréférencé : au lieu de cela, les horodatages du lien symbolique lui-même sont modifiés.


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**Ajouté dans : v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Réussit avec `undefined` en cas de succès.

Crée un nouveau lien de `existingPath` vers `newPath`. Voir la documentation POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) pour plus de détails.

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques retournées doivent être de type bigint. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques dans l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) retourné doivent être `bigint`. **Par défaut :** `false`.
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Réussit avec l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour le lien symbolique `path` donné.

Équivalent à [`fsPromises.stat()`](/fr/nodejs/api/fs#fspromisesstatpath-options) sauf si `path` fait référence à un lien symbolique, auquel cas le lien lui-même est stat-é, et non le fichier auquel il fait référence. Reportez-vous au document POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) pour plus de détails.


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Non pris en charge sur Windows. **Par défaut :** `0o777`.


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) En cas de succès, est résolue avec `undefined` si `recursive` est `false`, ou le premier chemin de répertoire créé si `recursive` est `true`.

Crée un répertoire de manière asynchrone.

L'argument optionnel `options` peut être un entier spécifiant le `mode` (permissions et bits de persistance), ou un objet avec une propriété `mode` et une propriété `recursive` indiquant si les répertoires parents doivent être créés. L'appel de `fsPromises.mkdir()` lorsque `path` est un répertoire existant entraîne un rejet uniquement lorsque `recursive` est false.

::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### `fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.6.0, v18.19.0 | Le paramètre `prefix` accepte désormais les tampons et les URL. |
| v16.5.0, v14.18.0 | Le paramètre `prefix` accepte désormais une chaîne vide. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Se réalise avec une chaîne contenant le chemin du système de fichiers du répertoire temporaire nouvellement créé.

Crée un répertoire temporaire unique. Un nom de répertoire unique est généré en ajoutant six caractères aléatoires à la fin du `préfixe` fourni. En raison d'incohérences entre les plateformes, évitez les caractères `X` à la fin du `préfixe`. Certaines plateformes, notamment les BSD, peuvent renvoyer plus de six caractères aléatoires et remplacer les caractères `X` à la fin du `préfixe` par des caractères aléatoires.

L'argument `options` facultatif peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser.

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
La méthode `fsPromises.mkdtemp()` ajoutera les six caractères sélectionnés aléatoirement directement à la chaîne `prefix`. Par exemple, étant donné un répertoire `/tmp`, si l'intention est de créer un répertoire temporaire *dans* `/tmp`, le `prefix` doit se terminer par un séparateur de chemin d'accès spécifique à la plateforme (`require('node:path').sep`).


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [Historique]
| Version | Changements |
| --- | --- |
| v11.1.0 | L'argument `flags` est désormais optionnel et sa valeur par défaut est `'r'`. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Voir [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le mode de fichier (permission et bits collants) si le fichier est créé. **Par défaut :** `0o666` (lisible et accessible en écriture)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Se réalise avec un objet [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle).

Ouvre un [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle).

Référez-vous à la documentation POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) pour plus de détails.

Certains caractères (`\< \> : " / \ | ? *`) sont réservés sous Windows, comme indiqué dans [Naming Files, Paths, and Namespaces](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). Sous NTFS, si le nom de fichier contient un deux-points, Node.js ouvre un flux de système de fichiers, comme décrit dans [cette page MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [Historique]
| Version | Changements |
| --- | --- |
| v20.1.0, v18.17.0 | Option `recursive` ajoutée. |
| v13.1.0, v12.16.0 | L'option `bufferSize` a été introduite. |
| v12.12.0 | Ajoutée dans : v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'entrées de répertoire mises en mémoire tampon en interne lors de la lecture à partir du répertoire. Des valeurs plus élevées améliorent les performances mais augmentent l'utilisation de la mémoire. **Par défaut :** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `Dir` résolu sera un [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) contenant tous les sous-fichiers et répertoires. **Par défaut :** `false`


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Se réalise avec un [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir).

Ouvre de manière asynchrone un répertoire pour une analyse itérative. Voir la documentation POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) pour plus de détails.

Crée un [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir), qui contient toutes les autres fonctions pour lire et nettoyer le répertoire.

L'option `encoding` définit l'encodage pour le `path` lors de l'ouverture du répertoire et des opérations de lecture suivantes.

Exemple utilisant l'itération asynchrone :

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
Lors de l'utilisation de l'itérateur asynchrone, l'objet [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir) sera automatiquement fermé après la sortie de l'itérateur.


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0, v18.17.0 | Ajout de l'option `recursive`. |
| v10.11.0 | La nouvelle option `withFileTypes` a été ajoutée. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, lit le contenu d'un répertoire de manière récursive. En mode récursif, il listera tous les fichiers, sous-fichiers et répertoires. **Par défaut :** `false`.


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec un tableau des noms des fichiers dans le répertoire, excluant `'.'` et `'..'`.

Lit le contenu d'un répertoire.

L'argument optionnel `options` peut être une chaîne de caractères spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour les noms de fichiers. Si `encoding` est défini sur `'buffer'`, les noms de fichiers retournés seront passés en tant qu'objets [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si `options.withFileTypes` est défini sur `true`, le tableau retourné contiendra des objets [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent).

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.2.0, v14.17.0 | L'argument options peut inclure un AbortSignal pour annuler une requête readFile en cours. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) nom de fichier ou `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'r'`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d’annuler un readFile en cours

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Se réalise avec le contenu du fichier.

Lit de manière asynchrone le contenu entier d’un fichier.

Si aucun encodage n’est spécifié (en utilisant `options.encoding`), les données sont renvoyées sous forme d’objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer). Sinon, les données seront une chaîne de caractères.

Si `options` est une chaîne, elle spécifie l’encodage.

Lorsque le `path` est un répertoire, le comportement de `fsPromises.readFile()` est spécifique à la plateforme. Sous macOS, Linux et Windows, la promise sera rejetée avec une erreur. Sous FreeBSD, une représentation du contenu du répertoire sera renvoyée.

Voici un exemple de lecture d’un fichier `package.json` situé dans le même répertoire que le code en cours d’exécution :

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

Il est possible d’annuler un `readFile` en cours à l’aide d’un [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal). Si une requête est annulée, la promise renvoyée est rejetée avec une `AbortError` :

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Annuler la requête avant que la promise ne se réalise.
  controller.abort();

  await promise;
} catch (err) {
  // Quand une requête est annulée - err est une AbortError
  console.error(err);
}
```
L’annulation d’une requête en cours n’annule pas les requêtes individuelles du système d’exploitation, mais plutôt la mise en mémoire tampon interne effectuée par `fs.readFile`.

Tout [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) spécifié doit prendre en charge la lecture.


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec `linkString` en cas de succès.

Lit le contenu du lien symbolique référencé par `path`. Consultez la documentation POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) pour plus de détails. La promesse est remplie avec le `linkString` en cas de succès.

L'argument optionnel `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour le chemin de lien retourné. Si `encoding` est défini sur `'buffer'`, le chemin de lien retourné sera transmis en tant qu'objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`


- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec le chemin résolu en cas de succès.

Détermine l'emplacement réel de `path` en utilisant la même sémantique que la fonction `fs.realpath.native()`.

Seuls les chemins pouvant être convertis en chaînes UTF8 sont pris en charge.

L'argument optionnel `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour le chemin. Si `encoding` est défini sur `'buffer'`, le chemin retourné sera transmis en tant qu'objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Sous Linux, lorsque Node.js est lié à musl libc, le système de fichiers procfs doit être monté sur `/proc` pour que cette fonction fonctionne. Glibc n'a pas cette restriction.


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Ajouté dans : v10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Remplie avec `undefined` en cas de succès.

Renomme `oldPath` en `newPath`.

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | L'utilisation de `fsPromises.rmdir(path, { recursive: true })` sur un `path` qui est un fichier n'est plus autorisée et entraîne une erreur `ENOENT` sur Windows et une erreur `ENOTDIR` sur POSIX. |
| v16.0.0 | L'utilisation de `fsPromises.rmdir(path, { recursive: true })` sur un `path` qui n'existe pas n'est plus autorisée et entraîne une erreur `ENOENT`. |
| v16.0.0 | L'option `recursive` est obsolète, son utilisation déclenche un avertissement de dépréciation. |
| v14.14.0 | L'option `recursive` est obsolète, utilisez plutôt `fsPromises.rm`. |
| v13.3.0, v12.16.0 | L'option `maxBusyTries` est renommée en `maxRetries`, et sa valeur par défaut est 0. L'option `emfileWait` a été supprimée, et les erreurs `EMFILE` utilisent la même logique de nouvelle tentative que les autres erreurs. L'option `retryDelay` est maintenant prise en charge. Les erreurs `ENFILE` sont maintenant retentées. |
| v12.10.0 | Les options `recursive`, `maxBusyTries` et `emfileWait` sont désormais prises en charge. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si une erreur `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` est rencontrée, Node.js retente l'opération avec une attente linéaire de `retryDelay` millisecondes plus longue à chaque tentative. Cette option représente le nombre de tentatives. Cette option est ignorée si l'option `recursive` n'est pas `true`. **Par défaut :** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, effectue une suppression récursive du répertoire. En mode récursif, les opérations sont retentées en cas d'échec. **Par défaut :** `false`. **Obsolète.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le temps en millisecondes à attendre entre les tentatives. Cette option est ignorée si l'option `recursive` n'est pas `true`. **Par défaut :** `100`.
  
 
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Remplie avec `undefined` en cas de succès.

Supprime le répertoire identifié par `path`.

L'utilisation de `fsPromises.rmdir()` sur un fichier (pas un répertoire) entraîne le rejet de la promesse avec une erreur `ENOENT` sous Windows et une erreur `ENOTDIR` sous POSIX.

Pour obtenir un comportement similaire à la commande Unix `rm -rf`, utilisez [`fsPromises.rm()`](/fr/nodejs/api/fs#fspromisesrmpath-options) avec les options `{ recursive: true, force: true }`.


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**Ajouté dans : v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les exceptions seront ignorées si `path` n'existe pas. **Par défaut :** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si une erreur `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` est rencontrée, Node.js réessayera l'opération avec une attente de backoff linéaire de `retryDelay` millisecondes de plus à chaque tentative. Cette option représente le nombre de tentatives. Cette option est ignorée si l'option `recursive` n'est pas `true`. **Par défaut :** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, effectue une suppression de répertoire récursive. En mode récursif, les opérations sont réessayées en cas d'échec. **Par défaut :** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le temps en millisecondes à attendre entre les tentatives. Cette option est ignorée si l'option `recursive` n'est pas `true`. **Par défaut :** `100`.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est résolue avec `undefined` en cas de succès.

Supprime les fichiers et les répertoires (basé sur l'utilitaire standard POSIX `rm`).

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques renvoyées doivent être bigint. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques dans l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) renvoyé doivent être `bigint`. **Par défaut :** `false`.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est résolue avec l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour le `path` donné.


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**Ajouté dans : v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques de l'objet [\<fs.StatFs\>](/fr/nodejs/api/fs#class-fsstatfs) renvoyé doivent être de type `bigint`. **Par défaut :** `false`.


- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est résolue avec l'objet [\<fs.StatFs\>](/fr/nodejs/api/fs#class-fsstatfs) pour le `path` donné.

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [Historique]
| Version | Modifications |
|---|---|
| v19.0.0 | Si l'argument `type` est `null` ou omis, Node.js détectera automatiquement le type de `target` et sélectionnera automatiquement `dir` ou `file`. |
| v10.0.0 | Ajouté dans : v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est résolue avec `undefined` en cas de succès.

Crée un lien symbolique.

L’argument `type` n’est utilisé que sur les plateformes Windows et peut être `'dir'`, `'file'` ou `'junction'`. Si l'argument `type` est `null`, Node.js détectera automatiquement le type `target` et utilisera `'file'` ou `'dir'`. Si le `target` n’existe pas, `'file'` sera utilisé. Les points de jonction Windows nécessitent que le chemin de destination soit absolu. Lors de l’utilisation de `'junction'`, l’argument `target` sera automatiquement normalisé en chemin absolu. Les points de jonction sur les volumes NTFS ne peuvent pointer que vers des répertoires.


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est résolue avec `undefined` en cas de succès.

Tronque (raccourcit ou étend la longueur) le contenu à `path` à `len` octets.

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est résolue avec `undefined` en cas de succès.

Si `path` fait référence à un lien symbolique, alors le lien est supprimé sans affecter le fichier ou le répertoire auquel ce lien fait référence. Si `path` fait référence à un chemin de fichier qui n'est pas un lien symbolique, le fichier est supprimé. Voir la documentation POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) pour plus de détails.

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**Ajouté dans : v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est résolue avec `undefined` en cas de succès.

Change les horodatages du système de fichiers de l'objet référencé par `path`.

Les arguments `atime` et `mtime` suivent ces règles :

- Les valeurs peuvent être des nombres représentant l'heure Unix epoch, des `Date`s ou une chaîne numérique comme `'123456789.0'`.
- Si la valeur ne peut pas être convertie en nombre, ou est `NaN`, `Infinity` ou `-Infinity`, une `Error` sera levée.


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**Ajouté dans : v15.9.0, v14.18.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le processus doit continuer à s'exécuter tant que des fichiers sont surveillés. **Par défaut :** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si tous les sous-répertoires doivent être surveillés, ou uniquement le répertoire courant. Ceci s'applique lorsqu'un répertoire est spécifié, et uniquement sur les plateformes supportées (voir [caveats](/fr/nodejs/api/fs#caveats)). **Par défaut :** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie l'encodage de caractères à utiliser pour le nom de fichier passé au listener. **Par défaut :** `'utf8'`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) utilisé pour signaler quand le watcher doit s'arrêter.
  
 
- Retourne : [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) d'objets avec les propriétés :
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type de changement
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Le nom du fichier modifié.
  
 

Retourne un itérateur asynchrone qui surveille les changements sur `filename`, où `filename` est soit un fichier, soit un répertoire.

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
Sur la plupart des plateformes, `'rename'` est émis chaque fois qu'un nom de fichier apparaît ou disparaît dans le répertoire.

Toutes les [caveats](/fr/nodejs/api/fs#caveats) pour `fs.watch()` s'appliquent également à `fsPromises.watch()`.


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0, v20.10.0 | L'option `flush` est désormais prise en charge. |
| v15.14.0, v14.18.0 | L'argument `data` prend en charge `AsyncIterable`, `Iterable` et `Stream`. |
| v15.2.0, v14.17.0 | L'argument options peut inclure un AbortSignal pour annuler une requête writeFile en cours. |
| v14.0.0 | Le paramètre `data` ne forcera plus les entrées non prises en charge en chaînes de caractères. |
| v10.0.0 | Ajoutée dans : v10.0.0 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) nom de fichier ou `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/fr/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir la [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si toutes les données sont écrites avec succès dans le fichier, et que `flush` est `true`, alors `filehandle.sync()` est utilisé pour vider les données. **Par défaut :** `false`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d'annuler un writeFile en cours.

- Renvoie : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Est résolue avec `undefined` en cas de succès.

Écrit de manière asynchrone des données dans un fichier, en remplaçant le fichier s'il existe déjà. `data` peut être une chaîne de caractères, un buffer, un [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) ou un objet [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol).

L'option `encoding` est ignorée si `data` est un buffer.

Si `options` est une chaîne de caractères, alors elle spécifie l'encodage.

L'option `mode` affecte uniquement le fichier nouvellement créé. Voir [`fs.open()`](/fr/nodejs/api/fs#fsopenpath-flags-mode-callback) pour plus de détails.

Tout [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) spécifié doit prendre en charge l'écriture.

Il est dangereux d'utiliser `fsPromises.writeFile()` plusieurs fois sur le même fichier sans attendre que la promise soit réglée.

De même que `fsPromises.readFile`, `fsPromises.writeFile` est une méthode pratique qui effectue plusieurs appels `write` en interne pour écrire le buffer qui lui est transmis. Pour le code sensible aux performances, envisagez d'utiliser [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options) ou [`filehandle.createWriteStream()`](/fr/nodejs/api/fs#filehandlecreatewritestreamoptions).

Il est possible d'utiliser un [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) pour annuler un `fsPromises.writeFile()`. L'annulation est réalisée "au mieux", et une certaine quantité de données est susceptible d'être quand même écrite.

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```
L'annulation d'une requête en cours n'annule pas les requêtes individuelles du système d'exploitation, mais plutôt la mise en mémoire tampon interne effectuée par `fs.writeFile`.


### `fsPromises.constants` {#fspromisesconstants}

**Ajouté dans : v18.4.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne un objet contenant des constantes couramment utilisées pour les opérations du système de fichiers. L’objet est identique à `fs.constants`. Voir [Constantes FS](/fr/nodejs/api/fs#fs-constants) pour plus de détails.

## API Callback {#callback-api}

Les API de rappel effectuent toutes les opérations de manière asynchrone, sans bloquer la boucle d’événements, puis invoquent une fonction de rappel à la fin ou en cas d’erreur.

Les API de rappel utilisent le pool de threads Node.js sous-jacent pour effectuer des opérations de système de fichiers en dehors du thread de la boucle d’événements. Ces opérations ne sont ni synchronisées ni threadsafe. Des précautions doivent être prises lors de l’exécution de plusieurs modifications simultanées sur le même fichier, sinon des données risquent d’être corrompues.

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.8.0 | Les constantes `fs.F_OK`, `fs.R_OK`, `fs.W_OK` et `fs.X_OK` qui étaient présentes directement sur `fs` sont dépréciées. |
| v18.0.0 | La transmission d’un rappel invalide à l’argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file :`. |
| v6.3.0 | Les constantes telles que `fs.R_OK`, etc. qui étaient présentes directement sur `fs` ont été déplacées vers `fs.constants` en tant que dépréciation progressive. Par conséquent, pour Node.js `\< v6.3.0`, utilisez `fs` pour accéder à ces constantes, ou faites quelque chose comme `(fs.constants || fs).R_OK` pour travailler avec toutes les versions. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Teste les permissions d’un utilisateur pour le fichier ou le répertoire spécifié par `path`. L’argument `mode` est un entier facultatif qui spécifie les contrôles d’accessibilité à effectuer. `mode` doit être soit la valeur `fs.constants.F_OK` ou un masque constitué du OU bit à bit de l’un des `fs.constants.R_OK`, `fs.constants.W_OK`, et `fs.constants.X_OK` (par exemple, `fs.constants.W_OK | fs.constants.R_OK`). Consultez [Constantes d’accès aux fichiers](/fr/nodejs/api/fs#file-access-constants) pour les valeurs possibles de `mode`.

L’argument final, `callback`, est une fonction de rappel qui est appelée avec un argument d’erreur possible. Si l’un des contrôles d’accessibilité échoue, l’argument d’erreur sera un objet `Error`. Les exemples suivants vérifient si `package.json` existe, et s’il est lisible ou accessible en écriture.

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// Vérifier si le fichier existe dans le répertoire actuel.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'n\'existe pas' : 'existe'}`);
});

// Vérifier si le fichier est lisible.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'n\'est pas lisible' : 'est lisible'}`);
});

// Vérifier si le fichier est accessible en écriture.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'n\'est pas accessible en écriture' : 'est accessible en écriture'}`);
});

// Vérifier si le fichier est lisible et accessible en écriture.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'n\'est pas' : 'est'} lisible et accessible en écriture`);
});
```
N’utilisez pas `fs.access()` pour vérifier l’accessibilité d’un fichier avant d’appeler `fs.open()`, `fs.readFile()` ou `fs.writeFile()`. Cela introduit une condition de concurrence, car d’autres processus peuvent modifier l’état du fichier entre les deux appels. Au lieu de cela, le code utilisateur doit ouvrir/lire/écrire le fichier directement et gérer l’erreur soulevée si le fichier n’est pas accessible.

**write (NON RECOMMANDÉ)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile existe déjà');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**write (RECOMMANDÉ)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile existe déjà');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**read (NON RECOMMANDÉ)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile n\'existe pas');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**read (RECOMMANDÉ)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile n\'existe pas');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Les exemples « non recommandés » ci-dessus vérifient l’accessibilité, puis utilisent le fichier ; les exemples « recommandés » sont meilleurs, car ils utilisent le fichier directement et gèrent l’erreur, le cas échéant.

En général, vérifiez l’accessibilité d’un fichier uniquement si le fichier n’est pas utilisé directement, par exemple lorsque son accessibilité est un signal provenant d’un autre processus.

Sous Windows, les stratégies de contrôle d’accès (ACL) sur un répertoire peuvent limiter l’accès à un fichier ou à un répertoire. La fonction `fs.access()` ne vérifie toutefois pas l’ACL et peut donc signaler qu’un chemin d’accès est accessible même si l’ACL empêche l’utilisateur de le lire ou d’y écrire.


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.1.0, v20.10.0 | L'option `flush` est désormais prise en charge. |
| v18.0.0 | Le fait de passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera un `TypeError` à l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v7.0.0 | L'objet `options` passé ne sera jamais modifié. |
| v5.0.0 | Le paramètre `file` peut désormais être un descripteur de fichier. |
| v0.6.7 | Ajoutée dans : v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nom de fichier ou descripteur de fichier
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [la prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, le descripteur de fichier sous-jacent est vidé avant d'être fermé. **Par défaut :** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Ajoute des données de manière asynchrone à un fichier, en créant le fichier s'il n'existe pas déjà. `data` peut être une chaîne de caractères ou un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

L'option `mode` n'affecte que le fichier nouvellement créé. Voir [`fs.open()`](/fr/nodejs/api/fs#fsopenpath-flags-mode-callback) pour plus de détails.

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
Si `options` est une chaîne de caractères, elle spécifie alors l'encodage :

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
Le `path` peut être spécifié comme un descripteur de fichier numérique qui a été ouvert pour l'ajout (en utilisant `fs.open()` ou `fs.openSync()`). Le descripteur de fichier ne sera pas fermé automatiquement.

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une erreur `TypeError` au moment de l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.1.30 | Ajouté dans : v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number)
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)

Modifie de manière asynchrone les permissions d'un fichier. Aucun argument autre qu'une possible exception n'est donné au callback de complétion.

Voir la documentation POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) pour plus de détails.

```js [ESM]
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('Les permissions du fichier "my_file.txt" ont été modifiées !');
});
```
#### Modes de fichier {#file-modes}

L'argument `mode` utilisé dans les méthodes `fs.chmod()` et `fs.chmodSync()` est un masque de bits numérique créé en utilisant un OU logique des constantes suivantes :

| Constante | Octal | Description |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | lecture par le propriétaire |
| `fs.constants.S_IWUSR` | `0o200` | écriture par le propriétaire |
| `fs.constants.S_IXUSR` | `0o100` | exécution/recherche par le propriétaire |
| `fs.constants.S_IRGRP` | `0o40` | lecture par le groupe |
| `fs.constants.S_IWGRP` | `0o20` | écriture par le groupe |
| `fs.constants.S_IXGRP` | `0o10` | exécution/recherche par le groupe |
| `fs.constants.S_IROTH` | `0o4` | lecture par les autres |
| `fs.constants.S_IWOTH` | `0o2` | écriture par les autres |
| `fs.constants.S_IXOTH` | `0o1` | exécution/recherche par les autres |

Une méthode plus simple de construction du `mode` est d'utiliser une séquence de trois chiffres octaux (par exemple `765`). Le chiffre le plus à gauche (`7` dans l'exemple), spécifie les permissions pour le propriétaire du fichier. Le chiffre du milieu (`6` dans l'exemple), spécifie les permissions pour le groupe. Le chiffre le plus à droite (`5` dans l'exemple), spécifie les permissions pour les autres.

| Nombre | Description |
| --- | --- |
| `7` | lecture, écriture et exécution |
| `6` | lecture et écriture |
| `5` | lecture et exécution |
| `4` | lecture seule |
| `3` | écriture et exécution |
| `2` | écriture seule |
| `1` | exécution seule |
| `0` | aucune permission |

Par exemple, la valeur octale `0o765` signifie :

- Le propriétaire peut lire, écrire et exécuter le fichier.
- Le groupe peut lire et écrire le fichier.
- Les autres peuvent lire et exécuter le fichier.

Lors de l'utilisation de nombres bruts où les modes de fichier sont attendus, toute valeur supérieure à `0o777` peut entraîner des comportements spécifiques à la plate-forme qui ne sont pas pris en charge pour fonctionner de manière cohérente. Par conséquent, les constantes telles que `S_ISVTX`, `S_ISGID` ou `S_ISUID` ne sont pas exposées dans `fs.constants`.

Mises en garde : sous Windows, seule l’autorisation d’écriture peut être modifiée, et la distinction entre les autorisations de groupe, de propriétaire ou autres n’est pas mise en œuvre.


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | La transmission d'un rappel non valide à l'argument `callback` génère maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le transmettre générera une erreur `TypeError` au moment de l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le transmettre émettra un avertissement de dépréciation avec l'id DEP0013. |
| v0.1.97 | Ajouté dans : v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Modifie de manière asynchrone le propriétaire et le groupe d'un fichier. Aucun argument autre qu'une éventuelle exception n'est transmis au rappel d'achèvement.

Voir la documentation POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) pour plus de détails.

### `fs.close(fd[, callback])` {#fsclosefd-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | La transmission d'un rappel non valide à l'argument `callback` génère maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.9.0, v14.17.0 | Un rappel par défaut est maintenant utilisé si aucun n'est fourni. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le transmettre générera une erreur `TypeError` au moment de l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le transmettre émettra un avertissement de dépréciation avec l'id DEP0013. |
| v0.0.2 | Ajouté dans : v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Ferme le descripteur de fichier. Aucun argument autre qu'une éventuelle exception n'est transmis au rappel d'achèvement.

L'appel de `fs.close()` sur n'importe quel descripteur de fichier (`fd`) qui est actuellement utilisé par le biais de toute autre opération `fs` peut entraîner un comportement indéfini.

Voir la documentation POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) pour plus de détails.


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | L'argument `flags` a été remplacé par `mode` et une validation de type plus stricte a été imposée. |
| v8.5.0 | Ajouté dans : v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) nom du fichier source à copier
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) nom du fichier de destination de l'opération de copie
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificateurs pour l'opération de copie. **Par défaut :** `0`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Copie de manière asynchrone `src` vers `dest`. Par défaut, `dest` est écrasé s'il existe déjà. Aucun argument autre qu'une éventuelle exception n'est transmis à la fonction de rappel. Node.js ne donne aucune garantie quant à l'atomicité de l'opération de copie. Si une erreur se produit après que le fichier de destination a été ouvert pour l'écriture, Node.js tentera de supprimer la destination.

`mode` est un entier optionnel qui spécifie le comportement de l'opération de copie. Il est possible de créer un masque constitué du OU bit à bit d'au moins deux valeurs (par exemple, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL` : L'opération de copie échouera si `dest` existe déjà.
- `fs.constants.COPYFILE_FICLONE` : L'opération de copie tentera de créer un reflink de copie sur écriture. Si la plateforme ne prend pas en charge la copie sur écriture, un mécanisme de copie de repli est utilisé.
- `fs.constants.COPYFILE_FICLONE_FORCE` : L'opération de copie tentera de créer un reflink de copie sur écriture. Si la plateforme ne prend pas en charge la copie sur écriture, l'opération échouera.

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt will be created or overwritten by default.
copyFile('source.txt', 'destination.txt', callback);

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.3.0 | Cette API n'est plus expérimentale. |
| v20.1.0, v18.17.0 | Accepte une option `mode` supplémentaire pour spécifier le comportement de la copie comme argument `mode` de `fs.copyFile()`. |
| v18.0.0 | Passer un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v17.6.0, v16.15.0 | Accepte une option `verbatimSymlinks` supplémentaire pour spécifier si la résolution de chemin doit être effectuée pour les liens symboliques. |
| v16.7.0 | Ajouté dans : v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) chemin source à copier.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) chemin de destination où copier.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) déréférence les liens symboliques. **Par défaut :** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) lorsque `force` est `false`, et que la destination existe, lève une erreur. **Par défaut :** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction pour filtrer les fichiers/répertoires copiés. Retourne `true` pour copier l'élément, `false` pour l'ignorer. Lors de l'ignorance d'un répertoire, tout son contenu sera également ignoré. Peut également retourner une `Promise` qui se résout en `true` ou `false` **Par défaut :** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) chemin source à copier.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) chemin de destination où copier.
    - Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Une valeur qui peut être convertie en `boolean` ou une `Promise` qui se réalise avec une telle valeur.


    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) écrase le fichier ou le répertoire existant. L'opération de copie ignorera les erreurs si vous définissez cette option sur false et que la destination existe. Utilisez l'option `errorOnExist` pour modifier ce comportement. **Par défaut :** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificateurs pour l'opération de copie. **Par défaut :** `0`. Voir l'indicateur `mode` de [`fs.copyFile()`](/fr/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les timestamps de `src` seront conservés. **Par défaut :** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copie les répertoires de manière récursive **Par défaut :** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, la résolution de chemin pour les liens symboliques sera ignorée. **Par défaut :** `false`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Copie de manière asynchrone toute la structure de répertoires de `src` vers `dest`, y compris les sous-répertoires et les fichiers.

Lors de la copie d'un répertoire vers un autre, les globs ne sont pas pris en charge et le comportement est similaire à `cp dir1/ dir2/`.


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.10.0 | L'option `fs` n'a pas besoin de la méthode `open` si un `fd` a été fourni. |
| v16.10.0 | L'option `fs` n'a pas besoin de la méthode `close` si `autoClose` est `false`. |
| v15.5.0 | Ajout du support pour `AbortSignal`. |
| v15.4.0 | L'option `fd` accepte les arguments FileHandle. |
| v14.0.0 | Changer la valeur par défaut de `emitClose` à `true`. |
| v13.6.0, v12.17.0 | Les options `fs` permettent de remplacer l'implémentation `fs` utilisée. |
| v12.10.0 | Activer l'option `emitClose`. |
| v11.0.0 | Imposer de nouvelles restrictions sur `start` et `end`, en lançant des erreurs plus appropriées dans les cas où nous ne pouvons pas gérer raisonnablement les valeurs d'entrée. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | L'objet `options` passé ne sera jamais modifié. |
| v2.3.0 | L'objet `options` passé peut maintenant être une chaîne de caractères. |
| v0.1.31 | Ajouté dans : v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [support des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'r'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) **Par défaut :** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`


- Retourne : [\<fs.ReadStream\>](/fr/nodejs/api/fs#class-fsreadstream)

`options` peut inclure les valeurs `start` et `end` pour lire une plage d'octets du fichier au lieu du fichier entier. `start` et `end` sont tous deux inclusifs et commencent à compter à partir de 0, les valeurs autorisées se trouvent dans la plage [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Si `fd` est spécifié et que `start` est omis ou `undefined`, `fs.createReadStream()` lit séquentiellement à partir de la position actuelle du fichier. L'`encoding` peut être l'un de ceux acceptés par [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si `fd` est spécifié, `ReadStream` ignorera l'argument `path` et utilisera le descripteur de fichier spécifié. Cela signifie qu'aucun événement `'open'` ne sera émis. `fd` doit être bloquant ; les `fd` non bloquants doivent être passés à [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

Si `fd` pointe vers un périphérique de caractères qui prend uniquement en charge les lectures bloquantes (tel qu'un clavier ou une carte son), les opérations de lecture ne se terminent pas tant que les données ne sont pas disponibles. Cela peut empêcher le processus de se fermer et le flux de se fermer naturellement.

Par défaut, le flux émettra un événement `'close'` après avoir été détruit. Définissez l'option `emitClose` sur `false` pour modifier ce comportement.

En fournissant l'option `fs`, il est possible de remplacer les implémentations `fs` correspondantes pour `open`, `read` et `close`. Lors de la fourniture de l'option `fs`, un remplacement pour `read` est requis. Si aucun `fd` n'est fourni, un remplacement pour `open` est également requis. Si `autoClose` est `true`, un remplacement pour `close` est également requis.

```js [ESM]
import { createReadStream } from 'node:fs';

// Créer un flux à partir d'un périphérique de caractères.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // Cela peut ne pas fermer le flux.
  // Le fait de marquer artificiellement la fin de flux, comme si la ressource sous-jacente avait
  // indiqué la fin de fichier par elle-même, permet au flux de se fermer.
  // Cela n'annule pas les opérations de lecture en attente, et s'il y a une telle
  // opération, le processus peut toujours ne pas être en mesure de se fermer correctement
  // jusqu'à ce qu'il se termine.
  stream.push(null);
  stream.read(0);
}, 100);
```
Si `autoClose` est faux, alors le descripteur de fichier ne sera pas fermé, même s'il y a une erreur. Il est de la responsabilité de l'application de le fermer et de s'assurer qu'il n'y a pas de fuite de descripteur de fichier. Si `autoClose` est défini sur true (comportement par défaut), sur `'error'` ou `'end'`, le descripteur de fichier sera fermé automatiquement.

`mode` définit le mode de fichier (permission et bits collants), mais uniquement si le fichier a été créé.

Un exemple pour lire les 10 derniers octets d'un fichier de 100 octets de long :

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
Si `options` est une chaîne de caractères, alors elle spécifie l'encodage.


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0, v20.10.0 | L'option `flush` est désormais prise en charge. |
| v16.10.0 | L'option `fs` n'a pas besoin de la méthode `open` si un `fd` a été fourni. |
| v16.10.0 | L'option `fs` n'a pas besoin de la méthode `close` si `autoClose` est `false`. |
| v15.5.0 | Ajout de la prise en charge de `AbortSignal`. |
| v15.4.0 | L'option `fd` accepte les arguments FileHandle. |
| v14.0.0 | Changement de la valeur par défaut de `emitClose` à `true`. |
| v13.6.0, v12.17.0 | Les options `fs` permettent de remplacer l'implémentation `fs` utilisée. |
| v12.10.0 | Activation de l'option `emitClose`. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | L'objet `options` passé ne sera jamais modifié. |
| v5.5.0 | L'option `autoClose` est désormais prise en charge. |
| v2.3.0 | L'objet `options` passé peut désormais être une chaîne de caractères. |
| v0.1.31 | Ajoutée dans : v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir la [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'w'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) **Par défaut :** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, le descripteur de fichier sous-jacent est vidé avant d'être fermé. **Par défaut :** `false`.

- Retourne : [\<fs.WriteStream\>](/fr/nodejs/api/fs#class-fswritestream)

`options` peut également inclure une option `start` pour permettre l'écriture de données à une certaine position après le début du fichier, les valeurs autorisées se situent dans la plage [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. La modification d'un fichier plutôt que son remplacement peut nécessiter que l'option `flags` soit définie sur `r+` plutôt que sur la valeur par défaut `w`. L'`encoding` peut être l'une de celles acceptées par [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si `autoClose` est défini sur true (comportement par défaut), sur `'error'` ou `'finish'`, le descripteur de fichier sera automatiquement fermé. Si `autoClose` est false, alors le descripteur de fichier ne sera pas fermé, même en cas d'erreur. Il incombe à l'application de le fermer et de s'assurer qu'il n'y a pas de fuite de descripteur de fichier.

Par défaut, le flux émettra un événement `'close'` après avoir été détruit. Définissez l'option `emitClose` sur `false` pour modifier ce comportement.

En fournissant l'option `fs`, il est possible de remplacer les implémentations `fs` correspondantes pour `open`, `write`, `writev` et `close`. Le remplacement de `write()` sans `writev()` peut réduire les performances car certaines optimisations (`_writev()`) seront désactivées. Lorsque vous fournissez l'option `fs`, les remplacements pour au moins l'un des `write` et `writev` sont obligatoires. Si aucune option `fd` n'est fournie, un remplacement pour `open` est également requis. Si `autoClose` est `true`, un remplacement pour `close` est également requis.

Comme [\<fs.ReadStream\>](/fr/nodejs/api/fs#class-fsreadstream), si `fd` est spécifié, [\<fs.WriteStream\>](/fr/nodejs/api/fs#class-fswritestream) ignorera l'argument `path` et utilisera le descripteur de fichier spécifié. Cela signifie qu'aucun événement `'open'` ne sera émis. `fd` doit être bloquant ; les `fd` non bloquants doivent être passés à [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

Si `options` est une chaîne de caractères, elle spécifie l'encodage.


### `fs.exists(path, callback)` {#fsexistspath-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le fait de passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v1.0.0 | Déprécié depuis : v1.0.0 |
| v0.0.2 | Ajouté dans : v0.0.2 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez [`fs.stat()`](/fr/nodejs/api/fs#fsstatpath-options-callback) ou [`fs.access()`](/fr/nodejs/api/fs#fsaccesspath-mode-callback) à la place.
:::

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function)
    - `exists` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean)

Vérifie si l'élément au `path` donné existe en interrogeant le système de fichiers. Appelle ensuite l'argument `callback` avec true ou false :

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'il existe' : 'pas de passwd !');
});
```
**Les paramètres de ce callback ne sont pas cohérents avec les autres callbacks Node.js.** Normalement, le premier paramètre d'un callback Node.js est un paramètre `err`, éventuellement suivi d'autres paramètres. Le callback `fs.exists()` n'a qu'un seul paramètre booléen. C'est l'une des raisons pour lesquelles `fs.access()` est recommandé à la place de `fs.exists()`.

Si `path` est un lien symbolique, il est suivi. Ainsi, si `path` existe mais pointe vers un élément inexistant, le callback recevra la valeur `false`.

Il n'est pas recommandé d'utiliser `fs.exists()` pour vérifier l'existence d'un fichier avant d'appeler `fs.open()`, `fs.readFile()` ou `fs.writeFile()`. Cela introduit une condition de concurrence, car d'autres processus peuvent modifier l'état du fichier entre les deux appels. Au lieu de cela, le code utilisateur doit ouvrir/lire/écrire le fichier directement et gérer l'erreur levée si le fichier n'existe pas.

**écriture (NON RECOMMANDÉ)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile existe déjà');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**écriture (RECOMMANDÉ)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile existe déjà');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**lecture (NON RECOMMANDÉ)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile n'existe pas');
  }
});
```
**lecture (RECOMMANDÉ)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile n'existe pas');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Les exemples « non recommandés » ci-dessus vérifient l'existence puis utilisent le fichier ; les exemples « recommandés » sont meilleurs car ils utilisent directement le fichier et gèrent l'erreur, le cas échéant.

En général, vérifiez l'existence d'un fichier uniquement si le fichier ne sera pas utilisé directement, par exemple lorsque son existence est un signal d'un autre processus.


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lancera une erreur `TypeError` au moment de l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.4.7 | Ajouté dans : v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Définit les permissions sur le fichier. Aucun argument autre qu'une exception possible n'est donné au rappel de complétion.

Consultez la documentation POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) pour plus de détails.

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lancera une erreur `TypeError` au moment de l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.4.7 | Ajouté dans : v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Définit le propriétaire du fichier. Aucun argument autre qu'une exception possible n'est donné au rappel de complétion.

Consultez la documentation POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) pour plus de détails.


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.1.96 | Ajouté dans : v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Force toutes les opérations d'E/S actuellement en file d'attente associées au fichier à l'état d'achèvement d'E/S synchronisé du système d'exploitation. Consultez la documentation POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) pour plus de détails. Aucun argument autre qu'une éventuelle exception n'est transmis au rappel d'achèvement.

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques renvoyées doivent être de type bigint. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.1.95 | Ajouté dans : v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques dans l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) renvoyé doivent être de type `bigint`. **Par défaut :** `false`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats)

Appelle le rappel avec [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour le descripteur de fichier.

Consultez la documentation POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) pour plus de détails.


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` lors de l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'id DEP0013. |
| v0.1.96 | Ajouté dans : v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Demande que toutes les données du descripteur de fichier ouvert soient vidées sur le périphérique de stockage. L'implémentation spécifique dépend du système d'exploitation et du périphérique. Consultez la documentation POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) pour plus de détails. Aucun argument autre qu'une exception possible n'est donné au rappel de fin.

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` lors de l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'id DEP0013. |
| v0.8.6 | Ajouté dans : v0.8.6 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Tronque le descripteur de fichier. Aucun argument autre qu'une exception possible n'est donné au rappel de fin.

Consultez la documentation POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) pour plus de détails.

Si le fichier référencé par le descripteur de fichier était plus grand que `len` octets, seuls les premiers `len` octets seront conservés dans le fichier.

Par exemple, le programme suivant ne conserve que les quatre premiers octets du fichier :

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
Si le fichier était auparavant plus court que `len` octets, il est étendu, et la partie étendue est remplie d'octets nuls (`'\0'`) :

Si `len` est négatif, alors `0` sera utilisé.


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v4.1.0 | Les chaînes numériques, `NaN` et `Infinity` sont désormais autorisés comme spécificateurs de temps. |
| v0.4.2 | Ajoutée dans : v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Modifie les horodatages du système de fichiers de l'objet référencé par le descripteur de fichier fourni. Voir [`fs.utimes()`](/fr/nodejs/api/fs#fsutimespath-atime-mtime-callback).

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.2.0 | Ajout du support de `withFileTypes` comme option. |
| v22.0.0 | Ajoutée dans : v22.0.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

-  `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) répertoire de travail courant. **Par défaut :** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction pour filtrer les fichiers/répertoires. Renvoie `true` pour exclure l'élément, `false` pour l'inclure. **Par défaut :** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le glob doit renvoyer les chemins en tant que Dirents, `false` sinon. **Par défaut :** `false`.
  
 
-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 
-  Récupère les fichiers correspondant au modèle spécifié.

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | L'erreur renvoyée peut être une `AggregateError` si plus d'une erreur est renvoyée. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'identifiant DEP0013. |
| v0.4.7 | Déprécié depuis : v0.4.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

 

Modifie les permissions sur un lien symbolique. Aucun argument autre qu'une éventuelle exception n'est donné au callback d'achèvement.

Cette méthode est uniquement implémentée sur macOS.

Voir la documentation POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2) pour plus de détails.

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.6.0 | Cette API n'est plus obsolète. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'identifiant DEP0013. |
| v0.4.7 | Dépréciation de la documentation uniquement. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

 

Définit le propriétaire du lien symbolique. Aucun argument autre qu'une éventuelle exception n'est donné au callback d'achèvement.

Voir la documentation POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) pour plus de détails.


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v14.5.0, v12.19.0 | Ajouté dans : v14.5.0, v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Modifie les heures d'accès et de modification d'un fichier de la même manière que [`fs.utimes()`](/fr/nodejs/api/fs#fsutimespath-atime-mtime-callback), à la différence que si le chemin d'accès fait référence à un lien symbolique, alors le lien n'est pas déréférencé : à la place, les horodatages du lien symbolique lui-même sont modifiés.

Aucun argument autre qu'une exception possible n'est transmis au rappel d'achèvement.

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus facultatif. Ne pas le passer lèvera une `TypeError` au moment de l'exécution. |
| v7.6.0 | Les paramètres `existingPath` et `newPath` peuvent être des objets `URL` WHATWG utilisant le protocole `file:`. La prise en charge est actuellement toujours *expérimentale*. |
| v7.0.0 | Le paramètre `callback` n'est plus facultatif. Ne pas le passer émettra un avertissement de dépréciation avec l'id DEP0013. |
| v0.1.31 | Ajouté dans : v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Crée un nouveau lien de `existingPath` vers `newPath`. Voir la documentation POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) pour plus de détails. Aucun argument autre qu'une exception possible n'est transmis au rappel d'achèvement.


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques retournées doivent être de type bigint. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une erreur `TypeError` à l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.1.30 | Ajouté dans : v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) Indique si les valeurs numériques de l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) retourné doivent être de type `bigint`. **Par défaut :** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Error)
    - `stats` [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats)



Récupère le [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour le lien symbolique référencé par le chemin. Le callback reçoit deux arguments `(err, stats)` où `stats` est un objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats). `lstat()` est identique à `stat()`, sauf que si `path` est un lien symbolique, alors le lien lui-même est statué, et non le fichier auquel il fait référence.

Voir la documentation POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) pour plus de détails.


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v13.11.0, v12.17.0 | En mode `recursive`, le callback reçoit maintenant le premier chemin créé en argument. |
| v10.12.0 | Le deuxième argument peut maintenant être un objet `options` avec les propriétés `recursive` et `mode`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera un `TypeError` à l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'id DEP0013. |
| v0.1.8 | Ajoutée dans : v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Non supporté sur Windows. **Par défaut :** `0o777`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Présent uniquement si un répertoire est créé avec `recursive` défini sur `true`.



Crée un répertoire de manière asynchrone.

Le callback reçoit une exception possible et, si `recursive` est `true`, le premier chemin de répertoire créé, `(err[, path])`. `path` peut toujours être `undefined` lorsque `recursive` est `true`, si aucun répertoire n'a été créé (par exemple, s'il a été créé précédemment).

L'argument optionnel `options` peut être un entier spécifiant `mode` (permission et bits sticky), ou un objet avec une propriété `mode` et une propriété `recursive` indiquant si les répertoires parents doivent être créés. L'appel de `fs.mkdir()` lorsque `path` est un répertoire qui existe provoque une erreur uniquement lorsque `recursive` est false. Si `recursive` est false et que le répertoire existe, une erreur `EEXIST` se produit.

```js [ESM]
import { mkdir } from 'node:fs';

// Crée ./tmp/a/apple, que ./tmp et ./tmp/a existent ou non.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
Sous Windows, l'utilisation de `fs.mkdir()` sur le répertoire racine, même avec la récursion, entraînera une erreur :

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
Voir la documentation POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) pour plus de détails.


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.6.0, v18.19.0 | Le paramètre `prefix` accepte désormais les buffers et les URL. |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v16.5.0, v14.18.0 | Le paramètre `prefix` accepte désormais une chaîne vide. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'identifiant DEP0013. |
| v6.2.1 | Le paramètre `callback` est désormais optionnel. |
| v5.10.0 | Ajouté dans : v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



Crée un répertoire temporaire unique.

Génère six caractères aléatoires à ajouter derrière un `prefix` requis pour créer un répertoire temporaire unique. En raison d'incohérences entre les plateformes, évitez les caractères `X` de fin dans `prefix`. Certaines plateformes, notamment les BSD, peuvent renvoyer plus de six caractères aléatoires et remplacer les caractères `X` de fin dans `prefix` par des caractères aléatoires.

Le chemin du répertoire créé est transmis sous forme de chaîne au deuxième paramètre du callback.

L'argument optionnel `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser.

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Affiche : /tmp/foo-itXde2 ou C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
La méthode `fs.mkdtemp()` ajoutera les six caractères sélectionnés de manière aléatoire directement à la chaîne `prefix`. Par exemple, étant donné un répertoire `/tmp`, si l'intention est de créer un répertoire temporaire *dans* `/tmp`, le `prefix` doit se terminer par un séparateur de chemin spécifique à la plateforme (`require('node:path').sep`).

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// Le répertoire parent du nouveau répertoire temporaire
const tmpDir = tmpdir();

// Cette méthode est *INCORRECTE* :
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Affichera quelque chose de similaire à `/tmpabc123`.
  // Un nouveau répertoire temporaire est créé à la racine du système de fichiers
  // plutôt que *dans* le répertoire /tmp.
});

// Cette méthode est *CORRECTE* :
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Affichera quelque chose de similaire à `/tmp/abc123`.
  // Un nouveau répertoire temporaire est créé dans
  // le répertoire /tmp.
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v11.1.0 | L'argument `flags` est désormais optionnel et sa valeur par défaut est `'r'`. |
| v9.9.0 | Les indicateurs `as` et `as+` sont désormais pris en charge. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v0.0.2 | Ajouté dans : v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Voir [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666` (lecture et écriture)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Ouverture asynchrone d'un fichier. Voir la documentation POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) pour plus de détails.

`mode` définit le mode de fichier (autorisation et bits collants), mais seulement si le fichier a été créé. Sous Windows, seule l'autorisation d'écriture peut être manipulée ; voir [`fs.chmod()`](/fr/nodejs/api/fs#fschmodpath-mode-callback).

Le callback reçoit deux arguments `(err, fd)`.

Certains caractères (`\< \> : " / \ | ? *`) sont réservés sous Windows, comme indiqué dans [Nommage des fichiers, des chemins et des espaces de noms](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). Sous NTFS, si le nom de fichier contient un deux-points, Node.js ouvre un flux de système de fichiers, comme décrit dans [cette page MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

Les fonctions basées sur `fs.open()` présentent également ce comportement : `fs.writeFile()`, `fs.readFile()`, etc.


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**Ajouté dans: v19.8.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un type MIME optionnel pour le blob.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec un [\<Blob\>](/fr/nodejs/api/buffer#class-blob) en cas de succès.

Renvoie un [\<Blob\>](/fr/nodejs/api/buffer#class-blob) dont les données sont soutenues par le fichier donné.

Le fichier ne doit pas être modifié après la création du [\<Blob\>](/fr/nodejs/api/buffer#class-blob). Toute modification entraînera l'échec de la lecture des données [\<Blob\>](/fr/nodejs/api/buffer#class-blob) avec une erreur `DOMException`. Opérations stat synchrones sur le fichier lors de la création du `Blob`, et avant chaque lecture afin de détecter si les données du fichier ont été modifiées sur le disque.

::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0, v18.17.0 | Ajout de l'option `recursive`. |
| v18.0.0 | Le fait de passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v13.1.0, v12.16.0 | L'option `bufferSize` a été introduite. |
| v12.12.0 | Ajouté dans: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'entrées de répertoire mises en mémoire tampon en interne lors de la lecture à partir du répertoire. Des valeurs plus élevées améliorent les performances, mais augmentent l'utilisation de la mémoire. **Par défaut :** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir)
  
 

Ouvre un répertoire de manière asynchrone. Voir la documentation POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3) pour plus de détails.

Crée un [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir), qui contient toutes les autres fonctions pour lire et nettoyer le répertoire.

L'option `encoding` définit l'encodage pour le `path` lors de l'ouverture du répertoire et des opérations de lecture suivantes.


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | La transmission d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Le paramètre `buffer` peut désormais être n'importe quel `TypedArray`, ou un `DataView`. |
| v7.4.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v6.0.0 | Le paramètre `length` peut désormais être `0`. |
| v0.0.2 | Ajoutée dans : v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Le buffer dans lequel les données seront écrites.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La position dans `buffer` où écrire les données.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets à lire.
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Spécifie où commencer la lecture dans le fichier. Si `position` est `null` ou `-1`, les données seront lues à partir de la position actuelle du fichier, et la position du fichier sera mise à jour. Si `position` est un entier non négatif, la position du fichier restera inchangée.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Lit les données du fichier spécifié par `fd`.

Le callback reçoit trois arguments, `(err, bytesRead, buffer)`.

Si le fichier n'est pas modifié simultanément, la fin de fichier est atteinte lorsque le nombre d'octets lus est nul.

Si cette méthode est invoquée comme sa version [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ed, elle renvoie une promesse pour un `Object` avec les propriétés `bytesRead` et `buffer`.

La méthode `fs.read()` lit les données du fichier spécifié par le descripteur de fichier (`fd`). L'argument `length` indique le nombre maximal d'octets que Node.js tentera de lire depuis le noyau. Cependant, le nombre réel d'octets lus (`bytesRead`) peut être inférieur à la `length` spécifiée pour diverses raisons.

Par exemple :

- Si le fichier est plus court que la `length` spécifiée, `bytesRead` sera défini sur le nombre réel d'octets lus.
- Si le fichier rencontre EOF (Fin de Fichier) avant que le tampon puisse être rempli, Node.js lira tous les octets disponibles jusqu'à ce que EOF soit rencontré, et le paramètre `bytesRead` dans le callback indiquera le nombre réel d'octets lus, qui peut être inférieur à la `length` spécifiée.
- Si le fichier est sur un `système de fichiers` réseau lent ou rencontre un autre problème pendant la lecture, `bytesRead` peut être inférieur à la `length` spécifiée.

Par conséquent, lors de l'utilisation de `fs.read()`, il est important de vérifier la valeur `bytesRead` pour déterminer le nombre d'octets réellement lus à partir du fichier. Selon la logique de votre application, vous devrez peut-être gérer les cas où `bytesRead` est inférieur à la `length` spécifiée, par exemple en enveloppant l'appel de lecture dans une boucle si vous avez besoin d'une quantité minimale d'octets.

Ce comportement est similaire à la fonction POSIX `preadv2`.


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.11.0, v12.17.0 | L'objet d'options peut être passé pour rendre facultatifs buffer, offset, length et position. |
| v13.11.0, v12.17.0 | Ajouté dans : v13.11.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Par défaut :** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
  
 

Semblable à la fonction [`fs.read()`](/fr/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), cette version prend un objet `options` facultatif. Si aucun objet `options` n'est spécifié, les valeurs par défaut ci-dessus seront utilisées.


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**Ajouté dans : v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Le buffer dans lequel les données seront écrites.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **Par défaut :** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
  
 

Similaire à la fonction [`fs.read()`](/fr/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), cette version prend un objet `options` optionnel. Si aucun objet `options` n'est spécifié, les valeurs par défaut ci-dessus seront utilisées.

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0, v18.17.0 | Ajout de l'option `recursive`. |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Nouvelle option `withFileTypes` ajoutée. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v6.0.0 | Le paramètre `options` a été ajouté. |
| v0.1.8 | Ajouté dans : v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, lit le contenu d'un répertoire de manière récursive. En mode récursif, il listera tous les fichiers, sous-fichiers et répertoires. **Par défaut :** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/fr/nodejs/api/fs#class-fsdirent)
  
 

Lit le contenu d'un répertoire. Le callback reçoit deux arguments `(err, files)` où `files` est un tableau des noms des fichiers dans le répertoire, excluant `'.'` et `'..'`.

Voir la documentation POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) pour plus de détails.

L'argument optionnel `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour les noms de fichiers passés au callback. Si `encoding` est défini sur `'buffer'`, les noms de fichiers retournés seront passés sous forme d'objets [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si `options.withFileTypes` est défini sur `true`, le tableau `files` contiendra des objets [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent).


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | L'erreur renvoyée peut être une `AggregateError` si plusieurs erreurs sont renvoyées. |
| v15.2.0, v14.17.0 | L'argument options peut inclure un AbortSignal pour annuler une requête readFile en cours. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v5.1.0 | Le `callback` sera toujours appelé avec `null` comme paramètre `error` en cas de succès. |
| v5.0.0 | Le paramètre `path` peut désormais être un descripteur de fichier. |
| v0.1.29 | Ajoutée dans : v0.1.29 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nom de fichier ou descripteur de fichier
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'r'`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d'annuler un readFile en cours

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
  
 

Lit de manière asynchrone l'intégralité du contenu d'un fichier.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
Le rappel reçoit deux arguments `(err, data)`, où `data` est le contenu du fichier.

Si aucun encodage n'est spécifié, le buffer brut est renvoyé.

Si `options` est une chaîne de caractères, elle spécifie l'encodage :

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
Lorsque le chemin est un répertoire, le comportement de `fs.readFile()` et [`fs.readFileSync()`](/fr/nodejs/api/fs#fsreadfilesyncpath-options) est spécifique à la plateforme. Sous macOS, Linux et Windows, une erreur sera renvoyée. Sous FreeBSD, une représentation du contenu du répertoire sera renvoyée.

```js [ESM]
import { readFile } from 'node:fs';

// macOS, Linux et Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

// FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
Il est possible d'annuler une requête en cours à l'aide d'un `AbortSignal`. Si une requête est annulée, le rappel est appelé avec une `AbortError` :

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// Lorsque vous souhaitez annuler la requête
controller.abort();
```
La fonction `fs.readFile()` met en mémoire tampon l'intégralité du fichier. Pour minimiser les coûts de mémoire, dans la mesure du possible, préférez la diffusion en flux via `fs.createReadStream()`.

L'annulation d'une requête en cours n'annule pas les requêtes individuelles du système d'exploitation, mais plutôt la mise en mémoire tampon interne effectuée par `fs.readFile`.


#### Descripteurs de fichiers {#file-descriptors}

#### Considérations de performance {#performance-considerations}

La méthode `fs.readFile()` lit de manière asynchrone le contenu d'un fichier en mémoire, bloc par bloc, permettant à la boucle d'événements de tourner entre chaque bloc. Cela permet à l'opération de lecture d'avoir moins d'impact sur les autres activités qui pourraient utiliser le pool de threads libuv sous-jacent, mais cela signifie qu'il faudra plus de temps pour lire un fichier complet en mémoire.

La surcharge de lecture supplémentaire peut varier considérablement d'un système à l'autre et dépend du type de fichier en cours de lecture. Si le type de fichier n'est pas un fichier régulier (par exemple un pipe) et que Node.js est incapable de déterminer une taille de fichier réelle, chaque opération de lecture chargera 64 KiB de données. Pour les fichiers réguliers, chaque lecture traitera 512 KiB de données.

Pour les applications qui nécessitent une lecture aussi rapide que possible du contenu des fichiers, il est préférable d'utiliser directement `fs.read()` et de laisser le code de l'application gérer lui-même la lecture du contenu complet du fichier.

Le problème GitHub de Node.js [#25741](https://github.com/nodejs/node/issues/25741) fournit plus d'informations et une analyse détaillée des performances de `fs.readFile()` pour plusieurs tailles de fichiers dans différentes versions de Node.js.

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus facultatif. Ne pas le passer lancera une `TypeError` au moment de l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus facultatif. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.1.31 | Ajouté dans : v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)


Lit le contenu du lien symbolique référencé par `path`. Le callback reçoit deux arguments `(err, linkString)`.

Voir la documentation POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) pour plus de détails.

L'argument optionnel `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour le chemin du lien transmis au callback. Si l'`encoding` est défini sur `'buffer'`, le chemin du lien renvoyé sera transmis comme un objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v13.13.0, v12.17.0 | Ajouté dans : v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

Lit à partir d'un fichier spécifié par `fd` et écrit dans un tableau de `ArrayBufferView`s en utilisant `readv()`.

`position` est le décalage par rapport au début du fichier à partir duquel les données doivent être lues. Si `typeof position !== 'number'`, les données seront lues à partir de la position actuelle.

Le rappel recevra trois arguments : `err`, `bytesRead` et `buffers`. `bytesRead` est le nombre d'octets lus dans le fichier.

Si cette méthode est appelée comme sa version [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ée, elle renvoie une promesse pour un `Object` avec les propriétés `bytesRead` et `buffers`.

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus facultatif. Ne pas le passer lèvera un `TypeError` à l'exécution. |
| v8.0.0 | Prise en charge de la résolution des pipes/sockets ajoutée. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus facultatif. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v6.4.0 | L'appel à `realpath` fonctionne à nouveau pour divers cas extrêmes sous Windows. |
| v6.0.0 | Le paramètre `cache` a été supprimé. |
| v0.1.31 | Ajouté dans : v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
  
 

Calcule de manière asynchrone le nom de chemin canonique en résolvant `.`, `..` et les liens symboliques.

Un nom de chemin canonique n'est pas nécessairement unique. Les liens physiques et les montages de liaison peuvent exposer une entité du système de fichiers via de nombreux noms de chemins.

Cette fonction se comporte comme [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3), avec quelques exceptions :

Le `callback` reçoit deux arguments `(err, resolvedPath)`. Peut utiliser `process.cwd` pour résoudre les chemins relatifs.

Seuls les chemins pouvant être convertis en chaînes UTF8 sont pris en charge.

L'argument facultatif `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour le chemin passé au rappel. Si `encoding` est défini sur `'buffer'`, le chemin renvoyé sera passé comme un objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si `path` se résout en un socket ou un pipe, la fonction renverra un nom dépendant du système pour cet objet.

Un chemin qui n'existe pas entraîne une erreur ENOENT. `error.path` est le chemin de fichier absolu.


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v9.2.0 | Ajoutée dans : v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)



[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) asynchrone.

Le `callback` reçoit deux arguments `(err, resolvedPath)`.

Seuls les chemins qui peuvent être convertis en chaînes UTF8 sont supportés.

L'argument optionnel `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour le chemin passé au callback. Si `encoding` est défini sur `'buffer'`, le chemin renvoyé sera passé comme un objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Sous Linux, lorsque Node.js est lié à musl libc, le système de fichiers procfs doit être monté sur `/proc` pour que cette fonction fonctionne. Glibc n'a pas cette restriction.

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v7.6.0 | Les paramètres `oldPath` et `newPath` peuvent être des objets `URL` WHATWG utilisant le protocole `file:`. La prise en charge est actuellement encore *expérimentale*. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.0.2 | Ajoutée dans : v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Renomme de manière asynchrone le fichier à `oldPath` vers le nom de chemin fourni comme `newPath`. Dans le cas où `newPath` existe déjà, il sera écrasé. S'il y a un répertoire à `newPath`, une erreur sera levée à la place. Aucun argument autre qu'une possible exception n'est donné au callback d'achèvement.

Voir aussi : [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | L'utilisation de `fs.rmdir(path, { recursive: true })` sur un `path` qui est un fichier n'est plus autorisée et entraîne une erreur `ENOENT` sur Windows et une erreur `ENOTDIR` sur POSIX. |
| v16.0.0 | L'utilisation de `fs.rmdir(path, { recursive: true })` sur un `path` qui n'existe pas n'est plus autorisée et entraîne une erreur `ENOENT`. |
| v16.0.0 | L'option `recursive` est obsolète, son utilisation déclenche un avertissement de dépréciation. |
| v14.14.0 | L'option `recursive` est obsolète, utilisez plutôt `fs.rm`. |
| v13.3.0, v12.16.0 | L'option `maxBusyTries` est renommée en `maxRetries`, et sa valeur par défaut est 0. L'option `emfileWait` a été supprimée, et les erreurs `EMFILE` utilisent la même logique de nouvelle tentative que les autres erreurs. L'option `retryDelay` est désormais supportée. Les erreurs `ENFILE` font désormais l'objet de nouvelles tentatives. |
| v12.10.0 | Les options `recursive`, `maxBusyTries` et `emfileWait` sont désormais supportées. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lancera un `TypeError` au moment de l'exécution. |
| v7.6.0 | Les paramètres `path` peuvent être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'id DEP0013. |
| v0.0.2 | Ajouté dans : v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) Si une erreur `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` est rencontrée, Node.js réessaie l'opération avec une attente de backoff linéaire de `retryDelay` millisecondes plus longue à chaque tentative. Cette option représente le nombre de tentatives. Cette option est ignorée si l'option `recursive` n'est pas `true`. **Par défaut :** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) Si `true`, effectue une suppression récursive du répertoire. En mode récursif, les opérations sont retentées en cas d'échec. **Par défaut :** `false`. **Obsolète.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) Le temps en millisecondes à attendre entre les tentatives. Cette option est ignorée si l'option `recursive` n'est pas `true`. **Par défaut :** `100`.


- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Error)


Asynchrone [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). Aucun argument autre qu'une éventuelle exception n'est fourni au callback d'achèvement.

L'utilisation de `fs.rmdir()` sur un fichier (pas un répertoire) entraîne une erreur `ENOENT` sur Windows et une erreur `ENOTDIR` sur POSIX.

Pour obtenir un comportement similaire à la commande Unix `rm -rf`, utilisez [`fs.rm()`](/fr/nodejs/api/fs#fsrmpath-options-callback) avec les options `{ recursive: true, force: true }`.


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.3.0, v16.14.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v14.14.0 | Ajouté dans : v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Lorsque `true`, les exceptions seront ignorées si `path` n'existe pas. **Par défaut :** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) Si une erreur `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` est rencontrée, Node.js réessayera l'opération avec un délai d'attente linéaire de `retryDelay` millisecondes plus long à chaque tentative. Cette option représente le nombre de tentatives. Cette option est ignorée si l'option `recursive` n'est pas `true`. **Par défaut :** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Si `true`, effectue une suppression récursive. En mode récursif, les opérations sont relancées en cas d'échec. **Par défaut :** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) Le temps en millisecondes à attendre entre les tentatives. Cette option est ignorée si l'option `recursive` n'est pas `true`. **Par défaut :** `100`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Supprime de manière asynchrone les fichiers et les répertoires (modelé sur l'utilitaire POSIX standard `rm`). Aucun argument autre qu'une exception possible n'est donné au callback d'achèvement.


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Transmettre un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques renvoyées doivent être de type bigint. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le transmettre lèvera une `TypeError` lors de l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le transmettre émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.0.2 | Ajouté dans : v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques dans l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) renvoyé doivent être de type `bigint`. **Par défaut :** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats)
  
 

[`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2) asynchrone. Le callback reçoit deux arguments `(err, stats)` où `stats` est un objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats).

En cas d'erreur, `err.code` sera l'une des [Erreurs système courantes](/fr/nodejs/api/errors#common-system-errors).

[`fs.stat()`](/fr/nodejs/api/fs#fsstatpath-options-callback) suit les liens symboliques. Utilisez [`fs.lstat()`](/fr/nodejs/api/fs#fslstatpath-options-callback) pour examiner les liens eux-mêmes.

Il n'est pas recommandé d'utiliser `fs.stat()` pour vérifier l'existence d'un fichier avant d'appeler `fs.open()`, `fs.readFile()` ou `fs.writeFile()`. Au lieu de cela, le code utilisateur doit ouvrir/lire/écrire directement le fichier et gérer l'erreur levée si le fichier n'est pas disponible.

Pour vérifier si un fichier existe sans le manipuler ensuite, [`fs.access()`](/fr/nodejs/api/fs#fsaccesspath-mode-callback) est recommandé.

Par exemple, étant donné la structure de répertoire suivante :

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
Le programme suivant vérifiera les statistiques des chemins donnés :

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
La sortie résultante ressemblera à :

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**Ajouté dans : v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques dans l'objet [\<fs.StatFs\>](/fr/nodejs/api/fs#class-fsstatfs) retourné doivent être `bigint`. **Par défaut :** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/fr/nodejs/api/fs#class-fsstatfs)



[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2) asynchrone. Renvoie des informations sur le système de fichiers monté qui contient `path`. Le callback reçoit deux arguments `(err, stats)` où `stats` est un objet [\<fs.StatFs\>](/fr/nodejs/api/fs#class-fsstatfs).

En cas d'erreur, `err.code` sera l'une des [Erreurs Système Courantes](/fr/nodejs/api/errors#common-system-errors).

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v12.0.0 | Si l'argument `type` est laissé indéfini, Node détectera automatiquement le type `target` et sélectionnera automatiquement `dir` ou `file`. |
| v7.6.0 | Les paramètres `target` et `path` peuvent être des objets `URL` WHATWG utilisant le protocole `file:`. La prise en charge est actuellement *expérimentale*. |
| v0.1.31 | Ajouté dans : v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Crée le lien appelé `path` pointant vers `target`. Aucun argument autre qu'une éventuelle exception n'est donné au callback d'achèvement.

Voir la documentation POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2) pour plus de détails.

L'argument `type` est uniquement disponible sur Windows et ignoré sur les autres plateformes. Il peut être défini sur `'dir'`, `'file'` ou `'junction'`. Si l'argument `type` est `null`, Node.js détectera automatiquement le type `target` et utilisera `'file'` ou `'dir'`. Si le `target` n'existe pas, `'file'` sera utilisé. Les points de jonction Windows nécessitent que le chemin de destination soit absolu. Lors de l'utilisation de `'junction'`, l'argument `target` sera automatiquement normalisé en chemin absolu. Les points de jonction sur les volumes NTFS ne peuvent pointer que vers des répertoires.

Les cibles relatives sont relatives au répertoire parent du lien.

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
L'exemple ci-dessus crée un lien symbolique `mewtwo` qui pointe vers `mew` dans le même répertoire :

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v16.0.0 | L'erreur renvoyée peut être une `AggregateError` si plus d'une erreur est renvoyée. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera un `TypeError` à l'exécution. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'identifiant DEP0013. |
| v0.8.6 | Ajoutée dans : v0.8.6 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

Tronque le fichier. Aucun argument autre qu'une possible exception n'est donné au callback d'achèvement. Un descripteur de fichier peut également être passé comme premier argument. Dans ce cas, `fs.ftruncate()` est appelé.

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// En supposant que 'path/file.txt' est un fichier ordinaire.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt a été tronqué');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// En supposant que 'path/file.txt' est un fichier ordinaire.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt a été tronqué');
});
```
:::

Le passage d'un descripteur de fichier est déconseillé et peut entraîner le lancement d'une erreur à l'avenir.

Voir la documentation POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2) pour plus de détails.


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lancera une `TypeError` lors de l'exécution. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.0.2 | Ajoutée dans : v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Supprime de manière asynchrone un fichier ou un lien symbolique. Aucun argument autre qu'une éventuelle exception n'est transmis au callback de complétion.

```js [ESM]
import { unlink } from 'node:fs';
// En supposant que 'path/file.txt' est un fichier normal.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt a été supprimé');
});
```

`fs.unlink()` ne fonctionnera pas sur un répertoire, vide ou non. Pour supprimer un répertoire, utilisez [`fs.rmdir()`](/fr/nodejs/api/fs#fsrmdirpath-options-callback).

Voir la documentation POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) pour plus de détails.

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**Ajoutée dans : v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Optionnel, un listener précédemment attaché en utilisant `fs.watchFile()`

Arrête de surveiller les modifications sur `filename`. Si `listener` est spécifié, seul ce listener particulier est supprimé. Sinon, *tous* les listeners sont supprimés, ce qui arrête effectivement la surveillance de `filename`.

L'appel de `fs.unwatchFile()` avec un nom de fichier qui n'est pas surveillé est une opération sans effet (no-op), et non une erreur.

L'utilisation de [`fs.watch()`](/fr/nodejs/api/fs#fswatchfilename-options-listener) est plus efficace que `fs.watchFile()` et `fs.unwatchFile()`. `fs.watch()` doit être utilisé à la place de `fs.watchFile()` et `fs.unwatchFile()` lorsque cela est possible.


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lèvera une `TypeError` à l'exécution. |
| v8.0.0 | `NaN`, `Infinity` et `-Infinity` ne sont plus des spécificateurs de temps valides. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v4.1.0 | Les chaînes numériques, `NaN` et `Infinity` sont désormais des spécificateurs de temps autorisés. |
| v0.4.2 | Ajouté dans : v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) | [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) | [\<Date\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) | [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) | [\<Date\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Error)

Modifie les horodatages du système de fichiers de l'objet référencé par `path`.

Les arguments `atime` et `mtime` suivent ces règles :

- Les valeurs peuvent être des nombres représentant l'heure Unix en secondes, des `Date`s ou une chaîne numérique comme `'123456789.0'`.
- Si la valeur ne peut pas être convertie en nombre, ou est `NaN`, `Infinity` ou `-Infinity`, une `Error` sera levée.


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.1.0 | Ajout du support récursif pour Linux, AIX et IBMi. |
| v15.9.0, v14.17.0 | Ajout du support pour la fermeture du surveillant avec un AbortSignal. |
| v7.6.0 | Le paramètre `filename` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v7.0.0 | L'objet `options` transmis ne sera jamais modifié. |
| v0.5.10 | Ajouté dans : v0.5.10 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le processus doit continuer à s'exécuter tant que des fichiers sont surveillés. **Par défaut:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si tous les sous-répertoires doivent être surveillés, ou seulement le répertoire courant. Ceci s'applique lorsqu'un répertoire est spécifié, et seulement sur les plateformes supportées (voir [mises en garde](/fr/nodejs/api/fs#caveats)). **Par défaut:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie l'encodage de caractères à utiliser pour le nom de fichier passé à l'écouteur. **Par défaut:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet de fermer le surveillant avec un AbortSignal.
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **Par défaut:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 
- Retourne : [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher)

Surveille les changements sur `filename`, où `filename` est soit un fichier, soit un répertoire.

Le deuxième argument est optionnel. Si `options` est fourni sous forme de chaîne de caractères, il spécifie l'`encoding`. Sinon, `options` doit être passé comme un objet.

La fonction de rappel de l'écouteur reçoit deux arguments `(eventType, filename)`. `eventType` est soit `'rename'`, soit `'change'`, et `filename` est le nom du fichier qui a déclenché l'événement.

Sur la plupart des plateformes, `'rename'` est émis chaque fois qu'un nom de fichier apparaît ou disparaît dans le répertoire.

La fonction de rappel de l'écouteur est attachée à l'événement `'change'` déclenché par [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher), mais ce n'est pas la même chose que la valeur `'change'` de `eventType`.

Si un `signal` est passé, l'abandon du AbortController correspondant fermera le [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) retourné.


#### Mises en garde {#caveats}

L'API `fs.watch` n'est pas cohérente à 100% entre les plateformes et n'est pas disponible dans certaines situations.

Sous Windows, aucun événement ne sera émis si le répertoire surveillé est déplacé ou renommé. Une erreur `EPERM` est signalée lorsque le répertoire surveillé est supprimé.

##### Disponibilité {#availability}

Cette fonctionnalité dépend du système d'exploitation sous-jacent fournissant un moyen d'être notifié des modifications du système de fichiers.

- Sur les systèmes Linux, cela utilise [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7).
- Sur les systèmes BSD, cela utilise [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2).
- Sur macOS, cela utilise [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2) pour les fichiers et [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events) pour les répertoires.
- Sur les systèmes SunOS (y compris Solaris et SmartOS), cela utilise [`event ports`](https://illumos.org/man/port_create).
- Sur les systèmes Windows, cette fonctionnalité dépend de [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw).
- Sur les systèmes AIX, cette fonctionnalité dépend de [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/), qui doit être activé.
- Sur les systèmes IBM i, cette fonctionnalité n'est pas prise en charge.

Si la fonctionnalité sous-jacente n'est pas disponible pour une raison quelconque, alors `fs.watch()` ne pourra pas fonctionner et peut lever une exception. Par exemple, la surveillance de fichiers ou de répertoires peut être peu fiable, et dans certains cas impossible, sur les systèmes de fichiers réseau (NFS, SMB, etc.) ou les systèmes de fichiers hôtes lors de l'utilisation de logiciels de virtualisation tels que Vagrant ou Docker.

Il est toujours possible d'utiliser `fs.watchFile()`, qui utilise l'interrogation stat, mais cette méthode est plus lente et moins fiable.

##### Inodes {#inodes}

Sur les systèmes Linux et macOS, `fs.watch()` résout le chemin d'accès à un [inode](https://en.wikipedia.org/wiki/Inode) et surveille l'inode. Si le chemin surveillé est supprimé et recréé, un nouvel inode lui est attribué. La surveillance émettra un événement pour la suppression, mais continuera de surveiller l'inode *original*. Les événements pour le nouvel inode ne seront pas émis. C'est le comportement attendu.

Les fichiers AIX conservent le même inode pendant toute la durée de vie d'un fichier. L'enregistrement et la fermeture d'un fichier surveillé sur AIX entraîneront deux notifications (une pour l'ajout de nouveau contenu et une pour la troncature).


##### Argument `filename` {#filename-argument}

Fournir l'argument `filename` dans le rappel n'est pris en charge que sur Linux, macOS, Windows et AIX. Même sur les plates-formes prises en charge, `filename` n'est pas toujours garanti. Par conséquent, ne présumez pas que l'argument `filename` est toujours fourni dans le rappel et prévoyez une logique de repli s'il est `null`.

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.5.0 | L'option `bigint` est désormais prise en charge. |
| v7.6.0 | Le paramètre `filename` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.31 | Ajoutée dans : v0.1.31 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `5007`
  
 
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `current` [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats)
  
 
- Retourne : [\<fs.StatWatcher\>](/fr/nodejs/api/fs#class-fsstatwatcher)

Surveille les modifications sur `filename`. Le rappel `listener` sera appelé chaque fois que le fichier sera accédé.

L'argument `options` peut être omis. S'il est fourni, il doit s'agir d'un objet. L'objet `options` peut contenir un booléen nommé `persistent` qui indique si le processus doit continuer à s'exécuter tant que les fichiers sont surveillés. L'objet `options` peut spécifier une propriété `interval` indiquant la fréquence à laquelle la cible doit être interrogée en millisecondes.

Le `listener` reçoit deux arguments : l'objet stat courant et l'objet stat précédent :

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
```
Ces objets stat sont des instances de `fs.Stat`. Si l'option `bigint` est `true`, les valeurs numériques de ces objets sont spécifiées sous forme de `BigInt`.

Pour être notifié lorsque le fichier a été modifié, et pas seulement consulté, il est nécessaire de comparer `curr.mtimeMs` et `prev.mtimeMs`.

Lorsqu'une opération `fs.watchFile` entraîne une erreur `ENOENT`, elle invoque le listener une fois, avec tous les champs mis à zéro (ou, pour les dates, l'époque Unix). Si le fichier est créé ultérieurement, le listener est appelé à nouveau, avec les derniers objets stat. Il s'agit d'un changement de fonctionnalité depuis la version v0.10.

L'utilisation de [`fs.watch()`](/fr/nodejs/api/fs#fswatchfilename-options-listener) est plus efficace que `fs.watchFile` et `fs.unwatchFile`. `fs.watch` doit être utilisé à la place de `fs.watchFile` et `fs.unwatchFile` lorsque cela est possible.

Lorsqu'un fichier surveillé par `fs.watchFile()` disparaît et réapparaît, le contenu de `previous` dans le deuxième événement de rappel (la réapparition du fichier) sera le même que le contenu de `previous` dans le premier événement de rappel (sa disparition).

Cela se produit lorsque :

- le fichier est supprimé, puis restauré
- le fichier est renommé, puis renommé une seconde fois avec son nom d'origine


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lance maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Le paramètre `buffer` ne forcera plus les entrées non prises en charge en chaînes de caractères. |
| v10.10.0 | Le paramètre `buffer` peut maintenant être n'importe quel `TypedArray` ou un `DataView`. |
| v10.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer lancera une `TypeError` à l'exécution. |
| v7.4.0 | Le paramètre `buffer` peut maintenant être un `Uint8Array`. |
| v7.2.0 | Les paramètres `offset` et `length` sont maintenant optionnels. |
| v7.0.0 | Le paramètre `callback` n'est plus optionnel. Ne pas le passer émettra un avertissement de dépréciation avec l'ID DEP0013. |
| v0.0.2 | Ajouté dans : v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Écrit `buffer` dans le fichier spécifié par `fd`.

`offset` détermine la partie du tampon à écrire, et `length` est un entier spécifiant le nombre d'octets à écrire.

`position` se réfère à l'offset depuis le début du fichier où ces données doivent être écrites. Si `typeof position !== 'number'`, les données seront écrites à la position actuelle. Voir [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

Le callback recevra trois arguments `(err, bytesWritten, buffer)` où `bytesWritten` spécifie le nombre d'*octets* qui ont été écrits à partir de `buffer`.

Si cette méthode est invoquée en tant que version [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ée, elle renvoie une promesse pour un `Object` avec les propriétés `bytesWritten` et `buffer`.

Il est dangereux d'utiliser `fs.write()` plusieurs fois sur le même fichier sans attendre le callback. Pour ce scénario, [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options) est recommandé.

Sur Linux, les écritures positionnelles ne fonctionnent pas lorsque le fichier est ouvert en mode append. Le noyau ignore l'argument position et ajoute toujours les données à la fin du fichier.


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**Ajouté dans : v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `null`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)



Écrit `buffer` dans le fichier spécifié par `fd`.

Semblable à la fonction `fs.write` ci-dessus, cette version prend un objet `options` facultatif. Si aucun objet `options` n’est spécifié, il sera par défaut avec les valeurs ci-dessus.

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Le fait de passer au paramètre `string` un objet avec sa propre fonction `toString` n’est plus pris en charge. |
| v17.8.0 | Le fait de passer au paramètre `string` un objet avec sa propre fonction `toString` est obsolète. |
| v14.12.0 | Le paramètre `string` va transformer en chaîne un objet avec une fonction `toString` explicite. |
| v14.0.0 | Le paramètre `string` ne forcera plus l’entrée non prise en charge en chaînes. |
| v10.0.0 | Le paramètre `callback` n’est plus facultatif. Ne pas le passer lèvera une `TypeError` au moment de l’exécution. |
| v7.2.0 | Le paramètre `position` est désormais facultatif. |
| v7.0.0 | Le paramètre `callback` n’est plus facultatif. Ne pas le passer émettra un avertissement de dépréciation avec l’ID DEP0013. |
| v0.11.5 | Ajouté dans : v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



Écrit `string` dans le fichier spécifié par `fd`. Si `string` n’est pas une chaîne, une exception est levée.

`position` fait référence au décalage par rapport au début du fichier où ces données doivent être écrites. Si `typeof position !== 'number'`, les données seront écrites à la position actuelle. Voir [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

`encoding` est l’encodage de chaîne attendu.

Le rappel recevra les arguments `(err, written, string)` où `written` spécifie le nombre d’*octets* que la chaîne passée a requis pour être écrite. Les octets écrits ne sont pas nécessairement identiques aux caractères de chaîne écrits. Voir [`Buffer.byteLength`](/fr/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding).

Il n’est pas sûr d’utiliser `fs.write()` plusieurs fois sur le même fichier sans attendre le rappel. Pour ce scénario, [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options) est recommandé.

Sur Linux, les écritures positionnelles ne fonctionnent pas lorsque le fichier est ouvert en mode append. Le noyau ignore l’argument de position et ajoute toujours les données à la fin du fichier.

Sous Windows, si le descripteur de fichier est connecté à la console (par exemple, `fd == 1` ou `stdout`), une chaîne contenant des caractères non-ASCII ne sera pas rendue correctement par défaut, quel que soit l’encodage utilisé. Il est possible de configurer la console pour qu’elle affiche correctement l’UTF-8 en modifiant la page de codes active avec la commande `chcp 65001`. Consultez la documentation [chcp](https://ss64.com/nt/chcp) pour plus de détails.


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0, v20.10.0 | L'option `flush` est désormais prise en charge. |
| v19.0.0 | Passer à un paramètre `string` un objet avec sa propre fonction `toString` n'est plus pris en charge. |
| v18.0.0 | Passer un rappel invalide à l'argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v17.8.0 | Passer à un paramètre `string` un objet avec sa propre fonction `toString` est déprécié. |
| v16.0.0 | L'erreur renvoyée peut être une `AggregateError` si plusieurs erreurs sont renvoyées. |
| v15.2.0, v14.17.0 | L'argument options peut inclure un AbortSignal pour annuler une requête writeFile en cours. |
| v14.12.0 | Le paramètre `data` transformera en chaîne un objet avec une fonction `toString` explicite. |
| v14.0.0 | Le paramètre `data` ne forcera plus les entrées non prises en charge en chaînes. |
| v10.10.0 | Le paramètre `data` peut désormais être n'importe quel `TypedArray` ou un `DataView`. |
| v10.0.0 | Le paramètre `callback` n'est plus facultatif. Ne pas le passer lèvera une `TypeError` au moment de l'exécution. |
| v7.4.0 | Le paramètre `data` peut désormais être un `Uint8Array`. |
| v7.0.0 | Le paramètre `callback` n'est plus facultatif. Ne pas le passer émettra un avertissement de dépréciation avec l'id DEP0013. |
| v5.0.0 | Le paramètre `file` peut désormais être un descripteur de fichier. |
| v0.1.29 | Ajouté dans : v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nom de fichier ou descripteur de fichier
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir la [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si toutes les données sont correctement écrites dans le fichier, et que `flush` est `true`, `fs.fsync()` est utilisé pour vider les données. **Par défaut :** `false`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d'annuler une écriture de fichier en cours.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)


Lorsque `file` est un nom de fichier, écrit les données de manière asynchrone dans le fichier, en remplaçant le fichier s'il existe déjà. `data` peut être une chaîne ou un tampon.

Lorsque `file` est un descripteur de fichier, le comportement est similaire à l'appel direct de `fs.write()` (ce qui est recommandé). Consultez les remarques ci-dessous concernant l'utilisation d'un descripteur de fichier.

L'option `encoding` est ignorée si `data` est un tampon.

L'option `mode` n'affecte que le fichier nouvellement créé. Voir [`fs.open()`](/fr/nodejs/api/fs#fsopenpath-flags-mode-callback) pour plus de détails.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
Si `options` est une chaîne, elle spécifie l'encodage :

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
Il n'est pas sûr d'utiliser `fs.writeFile()` plusieurs fois sur le même fichier sans attendre le rappel. Pour ce scénario, [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options) est recommandé.

De même que `fs.readFile`, `fs.writeFile` est une méthode pratique qui effectue en interne plusieurs appels à `write` pour écrire le tampon qui lui est transmis. Pour un code sensible aux performances, envisagez d'utiliser [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options).

Il est possible d'utiliser un [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) pour annuler un `fs.writeFile()`. L'annulation est "faite au mieux", et une certaine quantité de données est susceptible d'être encore écrite.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // When a request is aborted - the callback is called with an AbortError
});
// When the request should be aborted
controller.abort();
```
L'abandon d'une requête en cours n'abandonne pas les requêtes individuelles du système d'exploitation, mais plutôt la mise en mémoire tampon interne effectuée par `fs.writeFile`.


#### Utilisation de `fs.writeFile()` avec des descripteurs de fichier {#using-fswritefile-with-file-descriptors}

Lorsque `file` est un descripteur de fichier, le comportement est presque identique à un appel direct à `fs.write()` comme :

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```
La différence avec un appel direct à `fs.write()` est que, dans des conditions inhabituelles, `fs.write()` peut n'écrire qu'une partie du tampon et doit être relancé pour écrire les données restantes, tandis que `fs.writeFile()` réessaie jusqu'à ce que les données soient entièrement écrites (ou qu'une erreur se produise).

Les implications de ceci sont une source fréquente de confusion. Dans le cas du descripteur de fichier, le fichier n'est pas remplacé ! Les données ne sont pas nécessairement écrites au début du fichier, et les données originales du fichier peuvent rester avant et/ou après les données nouvellement écrites.

Par exemple, si `fs.writeFile()` est appelé deux fois de suite, d'abord pour écrire la chaîne de caractères `'Hello'`, puis pour écrire la chaîne de caractères `', World'`, le fichier contiendra `'Hello, World'`, et peut contenir certaines des données originales du fichier (en fonction de la taille du fichier original et de la position du descripteur de fichier). Si un nom de fichier avait été utilisé au lieu d'un descripteur, le fichier serait garanti de ne contenir que `', World'`.

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v12.9.0 | Ajouté dans : v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

Écrit un tableau de `ArrayBufferView`s dans le fichier spécifié par `fd` en utilisant `writev()`.

`position` est le décalage par rapport au début du fichier où ces données doivent être écrites. Si `typeof position !== 'number'`, les données seront écrites à la position actuelle.

Le callback recevra trois arguments : `err`, `bytesWritten` et `buffers`. `bytesWritten` indique le nombre d'octets écrits à partir de `buffers`.

Si cette méthode est [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ée, elle renvoie une promesse pour un `Object` avec les propriétés `bytesWritten` et `buffers`.

Il est dangereux d'utiliser `fs.writev()` plusieurs fois sur le même fichier sans attendre le callback. Pour ce scénario, utilisez [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options).

Sous Linux, les écritures positionnelles ne fonctionnent pas lorsque le fichier est ouvert en mode ajout. Le noyau ignore l'argument de position et ajoute toujours les données à la fin du fichier.


## API Synchrone {#synchronous-api}

Les API synchrones effectuent toutes les opérations de manière synchrone, bloquant la boucle d'événements jusqu'à ce que l'opération se termine ou échoue.

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.11.15 | Ajouté dans : v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `fs.constants.F_OK`

Teste de manière synchrone les permissions d'un utilisateur pour le fichier ou le répertoire spécifié par `path`. L'argument `mode` est un entier optionnel qui spécifie les vérifications d'accessibilité à effectuer. `mode` doit être soit la valeur `fs.constants.F_OK`, soit un masque constitué du OU bit à bit de n'importe lequel de `fs.constants.R_OK`, `fs.constants.W_OK` et `fs.constants.X_OK` (par exemple, `fs.constants.W_OK | fs.constants.R_OK`). Consultez [Constantes d'accès aux fichiers](/fr/nodejs/api/fs#file-access-constants) pour connaître les valeurs possibles de `mode`.

Si l'une des vérifications d'accessibilité échoue, une `Error` sera levée. Sinon, la méthode renverra `undefined`.

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.1.0, v20.10.0 | L'option `flush` est désormais prise en charge. |
| v7.0.0 | L'objet `options` passé ne sera jamais modifié. |
| v5.0.0 | Le paramètre `file` peut maintenant être un descripteur de fichier. |
| v0.6.7 | Ajouté dans : v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nom de fichier ou descripteur de fichier
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, le descripteur de fichier sous-jacent est vidé avant d'être fermé. **Par défaut :** `false`.
  
 

Ajoute de manière synchrone des données à un fichier, en créant le fichier s'il n'existe pas encore. `data` peut être une chaîne de caractères ou un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

L'option `mode` n'affecte que le fichier nouvellement créé. Voir [`fs.open()`](/fr/nodejs/api/fs#fsopenpath-flags-mode-callback) pour plus de détails.

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
```
Si `options` est une chaîne de caractères, alors elle spécifie l'encodage :

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
Le `path` peut être spécifié comme un descripteur de fichier numérique qui a été ouvert pour ajout (en utilisant `fs.open()` ou `fs.openSync()`). Le descripteur de fichier ne sera pas fermé automatiquement.

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.6.7 | Ajoutée dans : v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Pour des informations détaillées, voir la documentation de la version asynchrone de cette API : [`fs.chmod()`](/fr/nodejs/api/fs#fschmodpath-mode-callback).

Voir la documentation POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2) pour plus de détails.

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.97 | Ajoutée dans : v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Modifie de manière synchrone le propriétaire et le groupe d'un fichier. Renvoie `undefined`. C'est la version synchrone de [`fs.chown()`](/fr/nodejs/api/fs#fschownpath-uid-gid-callback).

Voir la documentation POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2) pour plus de détails.

### `fs.closeSync(fd)` {#fsclosesyncfd}

**Ajoutée dans : v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Ferme le descripteur de fichier. Renvoie `undefined`.

L'appel de `fs.closeSync()` sur n'importe quel descripteur de fichier (`fd`) qui est actuellement utilisé par une autre opération `fs` peut entraîner un comportement indéfini.

Voir la documentation POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2) pour plus de détails.


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Le paramètre `flags` a été remplacé par `mode` et une validation de type plus stricte a été imposée. |
| v8.5.0 | Ajouté dans la version : v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) nom de fichier source à copier
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) nom de fichier de destination de l’opération de copie
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificateurs pour l’opération de copie. **Par défaut :** `0`.

Copie de manière synchrone `src` vers `dest`. Par défaut, `dest` est remplacé s’il existe déjà. Renvoie `undefined`. Node.js ne donne aucune garantie quant à l’atomicité de l’opération de copie. Si une erreur se produit après que le fichier de destination a été ouvert pour écriture, Node.js tente de supprimer la destination.

`mode` est un entier optionnel qui spécifie le comportement de l’opération de copie. Il est possible de créer un masque constitué du OU bit à bit de deux valeurs ou plus (par exemple `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL` : l’opération de copie échoue si `dest` existe déjà.
- `fs.constants.COPYFILE_FICLONE` : l’opération de copie tente de créer un reflink copy-on-write. Si la plateforme ne prend pas en charge copy-on-write, un mécanisme de copie de secours est utilisé.
- `fs.constants.COPYFILE_FICLONE_FORCE` : l’opération de copie tente de créer un reflink copy-on-write. Si la plateforme ne prend pas en charge copy-on-write, l’opération échoue.

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// destination.txt sera créé ou remplacé par défaut.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt a été copié vers destination.txt');

// En utilisant COPYFILE_EXCL, l’opération échoue si destination.txt existe.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.3.0 | Cette API n'est plus expérimentale. |
| v20.1.0, v18.17.0 | Accepte une option `mode` supplémentaire pour spécifier le comportement de copie comme l'argument `mode` de `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Accepte une option `verbatimSymlinks` supplémentaire pour spécifier s'il faut effectuer la résolution du chemin pour les liens symboliques. |
| v16.7.0 | Ajouté dans : v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) chemin source à copier.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) chemin de destination vers lequel copier.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) déréférence les liens symboliques. **Par défaut :** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) lorsque `force` est `false` et que la destination existe, lève une erreur. **Par défaut :** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction pour filtrer les fichiers/répertoires copiés. Renvoie `true` pour copier l'élément, `false` pour l'ignorer. Lors de l'ignorance d'un répertoire, tout son contenu sera également ignoré. **Par défaut :** `undefined` 
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) chemin source à copier.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) chemin de destination vers lequel copier.
    - Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Toute valeur non-`Promise` qui peut être forcée à `boolean`.
  
 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) écrase le fichier ou le répertoire existant. L'opération de copie ignorera les erreurs si vous définissez cette option sur false et que la destination existe. Utilisez l'option `errorOnExist` pour modifier ce comportement. **Par défaut :** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) modificateurs pour l'opération de copie. **Par défaut :** `0`. Voir l'indicateur `mode` de [`fs.copyFileSync()`](/fr/nodejs/api/fs#fscopyfilesyncsrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les horodatages de `src` seront conservés. **Par défaut :** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) copie les répertoires de manière récursive. **Par défaut :** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, la résolution du chemin pour les liens symboliques sera ignorée. **Par défaut :** `false`
  
 

Copie de manière synchrone toute la structure de répertoires de `src` vers `dest`, y compris les sous-répertoires et les fichiers.

Lors de la copie d'un répertoire vers un autre répertoire, les globs ne sont pas pris en charge et le comportement est similaire à `cp dir1/ dir2/`.


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si le chemin d'accès existe, `false` sinon.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.exists()`](/fr/nodejs/api/fs#fsexistspath-callback).

`fs.exists()` est dépréciée, mais `fs.existsSync()` ne l'est pas. Le paramètre `callback` de `fs.exists()` accepte des paramètres qui ne sont pas cohérents avec les autres rappels Node.js. `fs.existsSync()` n'utilise pas de rappel.

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('Le chemin existe.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**Ajoutée dans : v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Définit les permissions sur le fichier. Retourne `undefined`.

Voir la documentation POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2) pour plus de détails.

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**Ajoutée dans : v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID utilisateur du nouveau propriétaire du fichier.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID de groupe du nouveau groupe du fichier.

Définit le propriétaire du fichier. Retourne `undefined`.

Voir la documentation POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2) pour plus de détails.


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**Ajouté dans : v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Force toutes les opérations d’E/S actuellement en file d’attente associées au fichier à l’état d’achèvement d’E/S synchronisées du système d’exploitation. Reportez-vous à la documentation POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2) pour plus de détails. Retourne `undefined`.

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques renvoyées doivent être bigint. |
| v0.1.95 | Ajouté dans : v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques dans l’objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) renvoyé doivent être `bigint`. **Par défaut :** `false`.


- Retourne : [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats)

Récupère le [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour le descripteur de fichier.

Consultez la documentation POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2) pour plus de détails.

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**Ajouté dans : v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Demande que toutes les données du descripteur de fichier ouvert soient écrites sur le périphérique de stockage. L’implémentation spécifique dépend du système d’exploitation et du périphérique. Reportez-vous à la documentation POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) pour plus de détails. Retourne `undefined`.

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**Ajouté dans : v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`

Tronque le descripteur de fichier. Retourne `undefined`.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.ftruncate()`](/fr/nodejs/api/fs#fsftruncatefd-len-callback).


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v4.1.0 | Les chaînes numériques, `NaN` et `Infinity` sont désormais autorisées comme spécificateurs de temps. |
| v0.4.2 | Ajoutée dans : v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Version synchrone de [`fs.futimes()`](/fr/nodejs/api/fs#fsfutimesfd-atime-mtime-callback). Renvoie `undefined`.

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.2.0 | Ajout du support de `withFileTypes` comme option. |
| v22.0.0 | Ajoutée dans : v22.0.0 |
:::

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) répertoire de travail courant. **Par défaut :** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction pour filtrer les fichiers/répertoires. Retourne `true` pour exclure l’élément, `false` pour l’inclure. **Par défaut :** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le glob doit retourner des chemins en tant que Dirents, `false` sinon. **Par défaut :** `false`.

- Renvoie : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) chemins des fichiers qui correspondent au modèle.

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**Obsolète depuis : v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Modifie les permissions sur un lien symbolique. Renvoie `undefined`.

Cette méthode n'est implémentée que sur macOS.

Voir la documentation POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man/man2/lchmod.2) pour plus de détails.

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.6.0 | Cette API n'est plus obsolète. |
| v0.4.7 | Obsolescence uniquement dans la documentation. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID utilisateur du nouveau propriétaire du fichier.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID de groupe du nouveau groupe du fichier.

Définit le propriétaire du chemin. Renvoie `undefined`.

Voir la documentation POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2) pour plus de détails.

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**Ajouté dans : v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Modifie les horodatages du système de fichiers du lien symbolique référencé par `path`. Renvoie `undefined` ou lève une exception lorsque les paramètres sont incorrects ou que l'opération échoue. Il s'agit de la version synchrone de [`fs.lutimes()`](/fr/nodejs/api/fs#fslutimespath-atime-mtime-callback).


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Les paramètres `existingPath` et `newPath` peuvent être des objets `URL` WHATWG utilisant le protocole `file:`. Le support est actuellement encore *expérimental*. |
| v0.1.31 | Ajouté dans : v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)

Crée un nouveau lien de `existingPath` vers `newPath`. Voir la documentation POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) pour plus de détails. Retourne `undefined`.

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.3.0, v14.17.0 | Accepte une option `throwIfNoEntry` pour spécifier si une exception doit être levée si l'entrée n'existe pas. |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques retournées doivent être bigint. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.30 | Ajouté dans : v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques de l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) retourné doivent être `bigint`. **Par défaut :** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si une exception sera levée si aucune entrée de système de fichiers n'existe, plutôt que de retourner `undefined`. **Par défaut :** `true`.


- Retourne : [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats)

Récupère le [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour le lien symbolique référencé par `path`.

Voir la documentation POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) pour plus de détails.


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.11.0, v12.17.0 | En mode `recursive`, le premier chemin créé est maintenant renvoyé. |
| v10.12.0 | Le deuxième argument peut maintenant être un objet `options` avec les propriétés `recursive` et `mode`. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Non supporté sur Windows. **Par défaut :** `0o777`.
  
 
- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Crée un répertoire de manière synchrone. Renvoie `undefined`, ou si `recursive` est `true`, le premier chemin de répertoire créé. Il s'agit de la version synchrone de [`fs.mkdir()`](/fr/nodejs/api/fs#fsmkdirpath-options-callback).

Voir la documentation POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) pour plus de détails.

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.6.0, v18.19.0 | Le paramètre `prefix` accepte désormais les tampons et les URL. |
| v16.5.0, v14.18.0 | Le paramètre `prefix` accepte désormais une chaîne vide. |
| v5.10.0 | Ajouté dans : v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
  
 
- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie le chemin du répertoire créé.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.mkdtemp()`](/fr/nodejs/api/fs#fsmkdtempprefix-options-callback).

L'argument optionnel `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser.


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0, v18.17.0 | Ajout de l'option `recursive`. |
| v13.1.0, v12.16.0 | L'option `bufferSize` a été introduite. |
| v12.12.0 | Ajouté dans : v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d'entrées de répertoire mises en mémoire tampon en interne lors de la lecture du répertoire. Des valeurs plus élevées améliorent les performances, mais augmentent l'utilisation de la mémoire. **Par défaut :** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
  
 
- Retourne : [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir)

Ouvre un répertoire de manière synchrone. Voir [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Crée un [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir), qui contient toutes les fonctions supplémentaires pour lire et nettoyer le répertoire.

L'option `encoding` définit l'encodage du `path` lors de l'ouverture du répertoire et des opérations de lecture suivantes.

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.1.0 | L'argument `flags` est désormais facultatif et sa valeur par défaut est `'r'`. |
| v9.9.0 | Les attributs `as` et `as+` sont désormais pris en charge. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `'r'`. Voir [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags).
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne un entier représentant le descripteur de fichier.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.open()`](/fr/nodejs/api/fs#fsopenpath-flags-mode-callback).


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0, v18.17.0 | Ajout de l'option `recursive`. |
| v10.10.0 | Nouvelle option `withFileTypes` ajoutée. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, lit le contenu d'un répertoire de manière récursive. En mode récursif, il liste tous les fichiers, sous-fichiers et répertoires. **Par défaut :** `false`.
  
 
- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/fr/nodejs/api/fs#class-fsdirent)

Lit le contenu du répertoire.

Voir la documentation POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) pour plus de détails.

L'argument optionnel `options` peut être une chaîne de caractères spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour les noms de fichiers retournés. Si `encoding` est défini sur `'buffer'`, les noms de fichiers retournés seront passés en tant qu'objets [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Si `options.withFileTypes` est défini sur `true`, le résultat contiendra des objets [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent).


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v5.0.0 | Le paramètre `path` peut maintenant être un descripteur de fichier. |
| v0.1.8 | Ajouté dans : v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nom de fichier ou descripteur de fichier
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir la [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'r'`.


- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Renvoie le contenu du `path`.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.readFile()`](/fr/nodejs/api/fs#fsreadfilepath-options-callback).

Si l'option `encoding` est spécifiée, cette fonction renvoie une chaîne de caractères. Sinon, elle renvoie un buffer.

De manière similaire à [`fs.readFile()`](/fr/nodejs/api/fs#fsreadfilepath-options-callback), lorsque le chemin d'accès est un répertoire, le comportement de `fs.readFileSync()` est spécifique à la plateforme.

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS, Linux, et Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

// FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.31 | Ajoutée dans : v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
  
 
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Retourne la valeur de chaîne du lien symbolique.

Voir la documentation POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2) pour plus de détails.

L'argument facultatif `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour le chemin du lien retourné. Si `encoding` est défini sur `'buffer'`, le chemin du lien renvoyé sera transmis en tant qu'objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.10.0 | Le paramètre `buffer` peut maintenant être n'importe quel `TypedArray` ou un `DataView`. |
| v6.0.0 | Le paramètre `length` peut maintenant être `0`. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne le nombre de `bytesRead`.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.read()`](/fr/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.13.0, v12.17.0 | L'objet des options peut être transmis pour rendre l'offset, la length et la position optionnels. |
| v13.13.0, v12.17.0 | Ajoutée dans : v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
  
 
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne le nombre de `bytesRead`.

Similaire à la fonction `fs.readSync` ci-dessus, cette version prend un objet `options` optionnel. Si aucun objet `options` n'est spécifié, les valeurs par défaut ci-dessus seront utilisées.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.read()`](/fr/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**Ajoutée dans : v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets lus.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.readv()`](/fr/nodejs/api/fs#fsreadvfd-buffers-position-callback).


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | Ajout de la prise en charge de la résolution Pipe/Socket. |
| v7.6.0 | Le paramètre `path` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v6.4.0 | L'appel à `realpathSync` fonctionne à nouveau pour divers cas extrêmes sous Windows. |
| v6.0.0 | Le paramètre `cache` a été supprimé. |
| v0.1.31 | Ajoutée dans : v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`


- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Renvoie le nom de chemin résolu.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.realpath()`](/fr/nodejs/api/fs#fsrealpathpath-options-callback).

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**Ajoutée dans : v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Default:** `'utf8'`


- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

[`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) synchrone.

Seuls les chemins qui peuvent être convertis en chaînes UTF8 sont pris en charge.

L'argument facultatif `options` peut être une chaîne spécifiant un encodage, ou un objet avec une propriété `encoding` spécifiant l'encodage de caractères à utiliser pour le chemin renvoyé. Si `encoding` est défini sur `'buffer'`, le chemin renvoyé sera passé en tant qu'objet [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

Sous Linux, lorsque Node.js est lié à musl libc, le système de fichiers procfs doit être monté sur `/proc` pour que cette fonction fonctionne. Glibc n'a pas cette restriction.


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Les paramètres `oldPath` et `newPath` peuvent être des objets `URL` WHATWG utilisant le protocole `file:`. La prise en charge est actuellement *expérimentale*. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)

Renomme le fichier de `oldPath` à `newPath`. Retourne `undefined`.

Voir la documentation POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2) pour plus de détails.

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | L’utilisation de `fs.rmdirSync(path, { recursive: true })` sur un `path` qui est un fichier n’est plus autorisée et entraîne une erreur `ENOENT` sous Windows et une erreur `ENOTDIR` sous POSIX. |
| v16.0.0 | L’utilisation de `fs.rmdirSync(path, { recursive: true })` sur un `path` qui n’existe pas n’est plus autorisée et entraîne une erreur `ENOENT`. |
| v16.0.0 | L’option `recursive` est obsolète, son utilisation déclenche un avertissement de dépréciation. |
| v14.14.0 | L’option `recursive` est obsolète, utilisez plutôt `fs.rmSync`. |
| v13.3.0, v12.16.0 | L’option `maxBusyTries` est renommée en `maxRetries`, et sa valeur par défaut est 0. L’option `emfileWait` a été supprimée, et les erreurs `EMFILE` utilisent la même logique de nouvelle tentative que les autres erreurs. L’option `retryDelay` est désormais prise en charge. Les erreurs `ENFILE` sont maintenant retentées. |
| v12.10.0 | Les options `recursive`, `maxBusyTries` et `emfileWait` sont désormais prises en charge. |
| v7.6.0 | Les paramètres `path` peuvent être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Si une erreur `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` est rencontrée, Node.js relance l’opération avec une temporisation linéaire de `retryDelay` millisecondes plus longue à chaque essai. Cette option représente le nombre de tentatives. Cette option est ignorée si l’option `recursive` n’est pas `true`. **Par défaut :** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, effectue une suppression récursive du répertoire. En mode récursif, les opérations sont relancées en cas d’échec. **Par défaut :** `false`. **Obsolète.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) La durée en millisecondes à attendre entre les tentatives. Cette option est ignorée si l’option `recursive` n’est pas `true`. **Par défaut :** `100`.

Synchronous [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). Retourne `undefined`.

L’utilisation de `fs.rmdirSync()` sur un fichier (pas un répertoire) entraîne une erreur `ENOENT` sous Windows et une erreur `ENOTDIR` sous POSIX.

Pour obtenir un comportement similaire à la commande Unix `rm -rf`, utilisez [`fs.rmSync()`](/fr/nodejs/api/fs#fsrmsyncpath-options) avec les options `{ recursive: true, force: true }`.


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.3.0, v16.14.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v14.14.0 | Ajouté dans : v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, les exceptions seront ignorées si `path` n’existe pas. **Par défaut :** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si une erreur `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` ou `EPERM` est rencontrée, Node.js réessayera l’opération avec un délai d’attente linéaire de `retryDelay` millisecondes plus long à chaque tentative. Cette option représente le nombre de tentatives. Cette option est ignorée si l’option `recursive` n’est pas `true`. **Par défaut :** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, effectue une suppression récursive du répertoire. En mode récursif, les opérations sont relancées en cas d’échec. **Par défaut :** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le temps en millisecondes à attendre entre les tentatives. Cette option est ignorée si l’option `recursive` n’est pas `true`. **Par défaut :** `100`.

Supprime de manière synchrone les fichiers et répertoires (modelé sur l’utilitaire POSIX standard `rm`). Renvoie `undefined`.

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.3.0, v14.17.0 | Accepte une option `throwIfNoEntry` pour spécifier si une exception doit être levée si l’entrée n’existe pas. |
| v10.5.0 | Accepte un objet `options` supplémentaire pour spécifier si les valeurs numériques renvoyées doivent être bigint. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques dans l’objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) renvoyé doivent être `bigint`. **Par défaut :** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si une exception sera levée si aucune entrée de système de fichiers n’existe, au lieu de renvoyer `undefined`. **Par défaut :** `true`.

- Renvoie : [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats)

Récupère le [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour le chemin d’accès.


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**Ajouté dans : v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si les valeurs numériques dans l'objet [\<fs.StatFs\>](/fr/nodejs/api/fs#class-fsstatfs) retourné doivent être `bigint`. **Par défaut :** `false`.


- Retourne : [\<fs.StatFs\>](/fr/nodejs/api/fs#class-fsstatfs)

[`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2) synchrone. Renvoie des informations sur le système de fichiers monté qui contient `path`.

En cas d'erreur, le `err.code` sera l'une des [erreurs système courantes](/fr/nodejs/api/errors#common-system-errors).

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Si l'argument `type` n'est pas défini, Node détectera automatiquement le type de `target` et sélectionnera automatiquement `dir` ou `file`. |
| v7.6.0 | Les paramètres `target` et `path` peuvent être des objets WHATWG `URL` utilisant le protocole `file:`. La prise en charge est actuellement encore *expérimentale*. |
| v0.1.31 | Ajouté dans : v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`

Retourne `undefined`.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.symlink()`](/fr/nodejs/api/fs#fssymlinktarget-path-type-callback).


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**Ajouté dans : v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`

Tronque le fichier. Renvoie `undefined`. Un descripteur de fichier peut également être transmis comme premier argument. Dans ce cas, `fs.ftruncateSync()` est appelé.

La transmission d'un descripteur de fichier est obsolète et peut entraîner une erreur à l'avenir.

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)

[`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) synchrone. Renvoie `undefined`.

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.0.0 | `NaN`, `Infinity` et `-Infinity` ne sont plus des spécificateurs de temps valides. |
| v7.6.0 | Le paramètre `path` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v4.1.0 | Les chaînes numériques, `NaN` et `Infinity` sont désormais autorisées comme spécificateurs de temps. |
| v0.4.2 | Ajouté dans : v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Renvoie `undefined`.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.utimes()`](/fr/nodejs/api/fs#fsutimespath-atime-mtime-callback).


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0, v20.10.0 | L'option `flush` est désormais prise en charge. |
| v19.0.0 | Transmettre à l'objet paramètre `data` avec sa propre fonction `toString` n'est plus pris en charge. |
| v17.8.0 | Transmettre à l'objet paramètre `data` avec sa propre fonction `toString` est obsolète. |
| v14.12.0 | Le paramètre `data` transformera en chaîne un objet avec une fonction `toString` explicite. |
| v14.0.0 | Le paramètre `data` ne forcera plus les entrées non prises en charge en chaînes. |
| v10.10.0 | Le paramètre `data` peut désormais être n'importe quel `TypedArray` ou `DataView`. |
| v7.4.0 | Le paramètre `data` peut désormais être un `Uint8Array`. |
| v5.0.0 | Le paramètre `file` peut désormais être un descripteur de fichier. |
| v0.1.29 | Ajouté dans : v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nom de fichier ou descripteur de fichier
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir la [prise en charge des `flags` du système de fichiers](/fr/nodejs/api/fs#file-system-flags). **Par défaut :** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si toutes les données sont écrites avec succès dans le fichier et que `flush` est `true`, `fs.fsyncSync()` est utilisé pour vider les données.

Renvoie `undefined`.

L'option `mode` affecte uniquement le fichier nouvellement créé. Voir [`fs.open()`](/fr/nodejs/api/fs#fsopenpath-flags-mode-callback) pour plus de détails.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.writeFile()`](/fr/nodejs/api/fs#fswritefilefile-data-options-callback).


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Le paramètre `buffer` ne forcera plus les entrées non prises en charge à devenir des chaînes. |
| v10.10.0 | Le paramètre `buffer` peut désormais être n'importe quel `TypedArray` ou un `DataView`. |
| v7.4.0 | Le paramètre `buffer` peut désormais être un `Uint8Array`. |
| v7.2.0 | Les paramètres `offset` et `length` sont désormais optionnels. |
| v0.1.21 | Ajoutée dans : v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d’octets écrits.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.write(fd, buffer...)`](/fr/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**Ajoutée dans : v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `null`
  
 
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d’octets écrits.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.write(fd, buffer...)`](/fr/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | Le paramètre `string` ne forcera plus les entrées non prises en charge en chaînes de caractères. |
| v7.2.0 | Le paramètre `position` est désormais optionnel. |
| v0.11.5 | Ajouté dans : v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets écrits.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.write(fd, string...)`](/fr/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**Ajouté dans : v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Par défaut :** `null`
- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets écrits.

Pour des informations détaillées, consultez la documentation de la version asynchrone de cette API : [`fs.writev()`](/fr/nodejs/api/fs#fswritevfd-buffers-position-callback).

## Objets communs {#common-objects}

Les objets communs sont partagés par toutes les variantes de l'API du système de fichiers (promise, callback et synchrone).


### Classe : `fs.Dir` {#class-fsdir}

**Ajoutée dans : v12.12.0**

Une classe représentant un flux de répertoire.

Créée par [`fs.opendir()`](/fr/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/fr/nodejs/api/fs#fsopendirsyncpath-options) ou [`fsPromises.opendir()`](/fr/nodejs/api/fs#fspromisesopendirpath-options).

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
Lors de l'utilisation de l'itérateur asynchrone, l'objet [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir) sera automatiquement fermé après la sortie de l'itérateur.

#### `dir.close()` {#dirclose}

**Ajoutée dans : v12.12.0**

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Ferme de manière asynchrone le descripteur de ressource sous-jacent du répertoire. Les lectures suivantes entraîneront des erreurs.

Une promise est renvoyée et sera remplie une fois la ressource fermée.

#### `dir.close(callback)` {#dirclosecallback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | La transmission d'un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v12.12.0 | Ajoutée dans : v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Ferme de manière asynchrone le descripteur de ressource sous-jacent du répertoire. Les lectures suivantes entraîneront des erreurs.

Le `callback` sera appelé une fois le descripteur de ressource fermé.

#### `dir.closeSync()` {#dirclosesync}

**Ajoutée dans : v12.12.0**

Ferme de manière synchrone le descripteur de ressource sous-jacent du répertoire. Les lectures suivantes entraîneront des erreurs.

#### `dir.path` {#dirpath}

**Ajoutée dans : v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le chemin en lecture seule de ce répertoire tel qu'il a été fourni à [`fs.opendir()`](/fr/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/fr/nodejs/api/fs#fsopendirsyncpath-options) ou [`fsPromises.opendir()`](/fr/nodejs/api/fs#fspromisesopendirpath-options).


#### `dir.read()` {#dirread}

**Ajouté dans : v12.12.0**

- Retourne : [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Réussit avec un [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Lit de manière asynchrone l’entrée de répertoire suivante via [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) comme un [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent).

Une promesse est renvoyée qui sera résolue avec un [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent), ou `null` s’il n’y a plus d’entrées de répertoire à lire.

Les entrées de répertoire renvoyées par cette fonction ne sont dans aucun ordre particulier tel que fourni par les mécanismes de répertoire sous-jacents du système d’exploitation. Les entrées ajoutées ou supprimées lors de l’itération sur le répertoire peuvent ne pas être incluses dans les résultats de l’itération.

#### `dir.read(callback)` {#dirreadcallback}

**Ajouté dans : v12.12.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
  
 

Lit de manière asynchrone l’entrée de répertoire suivante via [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) comme un [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent).

Une fois la lecture terminée, le `callback` sera appelé avec un [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent), ou `null` s’il n’y a plus d’entrées de répertoire à lire.

Les entrées de répertoire renvoyées par cette fonction ne sont dans aucun ordre particulier tel que fourni par les mécanismes de répertoire sous-jacents du système d’exploitation. Les entrées ajoutées ou supprimées lors de l’itération sur le répertoire peuvent ne pas être incluses dans les résultats de l’itération.

#### `dir.readSync()` {#dirreadsync}

**Ajouté dans : v12.12.0**

- Retourne : [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Lit de manière synchrone l’entrée de répertoire suivante comme un [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent). Consultez la documentation POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) pour plus de détails.

S’il n’y a plus d’entrées de répertoire à lire, `null` sera renvoyé.

Les entrées de répertoire renvoyées par cette fonction ne sont dans aucun ordre particulier tel que fourni par les mécanismes de répertoire sous-jacents du système d’exploitation. Les entrées ajoutées ou supprimées lors de l’itération sur le répertoire peuvent ne pas être incluses dans les résultats de l’itération.


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**Ajouté dans : v12.12.0**

- Retourne : [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Un AsyncIterator de [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent)

Itère de manière asynchrone sur le répertoire jusqu'à ce que toutes les entrées aient été lues. Consultez la documentation POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) pour plus de détails.

Les entrées renvoyées par l'itérateur asynchrone sont toujours un [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent). Le cas `null` de `dir.read()` est géré en interne.

Voir [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir) pour un exemple.

Les entrées de répertoire renvoyées par cet itérateur ne sont dans aucun ordre particulier tel que fourni par les mécanismes de répertoire sous-jacents du système d'exploitation. Les entrées ajoutées ou supprimées lors de l'itération sur le répertoire peuvent ne pas être incluses dans les résultats de l'itération.

### Class : `fs.Dirent` {#class-fsdirent}

**Ajouté dans : v10.10.0**

Une représentation d'une entrée de répertoire, qui peut être un fichier ou un sous-répertoire dans le répertoire, tel que renvoyé par la lecture d'un [\<fs.Dir\>](/fr/nodejs/api/fs#class-fsdir). L'entrée de répertoire est une combinaison du nom de fichier et des paires de type de fichier.

De plus, lorsque [`fs.readdir()`](/fr/nodejs/api/fs#fsreaddirpath-options-callback) ou [`fs.readdirSync()`](/fr/nodejs/api/fs#fsreaddirsyncpath-options) est appelé avec l'option `withFileTypes` définie sur `true`, le tableau résultant est rempli avec des objets [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent), plutôt que des chaînes de caractères ou des [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)s.

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**Ajouté dans : v10.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) décrit un périphérique de bloc.

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**Ajouté dans : v10.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) décrit un périphérique de caractères.


#### `dirent.isDirectory()` {#direntisdirectory}

**Ajouté dans : v10.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) décrit un répertoire du système de fichiers.

#### `dirent.isFIFO()` {#direntisfifo}

**Ajouté dans : v10.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) décrit un tube FIFO (premier entré, premier sorti).

#### `dirent.isFile()` {#direntisfile}

**Ajouté dans : v10.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) décrit un fichier normal.

#### `dirent.isSocket()` {#direntissocket}

**Ajouté dans : v10.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) décrit un socket.

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**Ajouté dans : v10.10.0**

- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) décrit un lien symbolique.

#### `dirent.name` {#direntname}

**Ajouté dans : v10.10.0**

- [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Le nom de fichier auquel cet objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) fait référence. Le type de cette valeur est déterminé par l'`options.encoding` passée à [`fs.readdir()`](/fr/nodejs/api/fs#fsreaddirpath-options-callback) ou [`fs.readdirSync()`](/fr/nodejs/api/fs#fsreaddirsyncpath-options).

#### `dirent.parentPath` {#direntparentpath}

**Ajouté dans : v21.4.0, v20.12.0, v18.20.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

- [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)

Le chemin d'accès au répertoire parent du fichier auquel cet objet [\<fs.Dirent\>](/fr/nodejs/api/fs#class-fsdirent) fait référence.


#### `dirent.path` {#direntpath}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.2.0 | La propriété n’est plus en lecture seule. |
| v23.0.0 | L’accès à cette propriété émet un avertissement. Elle est maintenant en lecture seule. |
| v21.5.0, v20.12.0, v18.20.0 | Déprécié depuis : v21.5.0, v20.12.0, v18.20.0 |
| v20.1.0, v18.17.0 | Ajouté dans : v20.1.0, v18.17.0 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez [`dirent.parentPath`](/fr/nodejs/api/fs#direntparentpath) à la place.
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Alias de `dirent.parentPath`.

### Class: `fs.FSWatcher` {#class-fsfswatcher}

**Ajouté dans : v0.5.8**

- Hérite de [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Un appel réussi à la méthode [`fs.watch()`](/fr/nodejs/api/fs#fswatchfilename-options-listener) renverra un nouvel objet [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher).

Tous les objets [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) émettent un événement `'change'` chaque fois qu’un fichier surveillé spécifique est modifié.

#### Event: `'change'` {#event-change}

**Ajouté dans : v0.5.8**

- `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le type d’événement de modification qui s’est produit
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le nom du fichier qui a été modifié (si pertinent/disponible)

Émis lorsque quelque chose change dans un répertoire ou un fichier surveillé. Voir plus de détails dans [`fs.watch()`](/fr/nodejs/api/fs#fswatchfilename-options-listener).

L’argument `filename` peut ne pas être fourni en fonction de la prise en charge du système d’exploitation. Si `filename` est fourni, il sera fourni sous la forme d’un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) si `fs.watch()` est appelé avec son option `encoding` définie sur `'buffer'`, sinon `filename` sera une chaîne UTF-8.

```js [ESM]
import { watch } from 'node:fs';
// Exemple lorsqu'il est géré via l'écouteur fs.watch()
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Affiche : <Buffer ...>
  }
});
```

#### Événement : `'close'` {#event-close_1}

**Ajouté dans : v10.0.0**

Émis lorsque l'observateur arrête de surveiller les changements. L'objet [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) fermé n'est plus utilisable dans le gestionnaire d'événements.

#### Événement : `'error'` {#event-error}

**Ajouté dans : v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Émis lorsqu'une erreur se produit lors de la surveillance du fichier. L'objet [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) en erreur n'est plus utilisable dans le gestionnaire d'événements.

#### `watcher.close()` {#watcherclose}

**Ajouté dans : v0.5.8**

Arrête de surveiller les changements sur le [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) donné. Une fois arrêté, l'objet [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) n'est plus utilisable.

#### `watcher.ref()` {#watcherref}

**Ajouté dans : v14.3.0, v12.20.0**

- Retourne : [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher)

Lorsqu'elle est appelée, demande à la boucle d'événements Node.js de *ne pas* se terminer tant que le [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) est actif. Appeler `watcher.ref()` plusieurs fois n'aura aucun effet.

Par défaut, tous les objets [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) sont "ref'ed", ce qui rend normalement inutile l'appel à `watcher.ref()` sauf si `watcher.unref()` a été appelé précédemment.

#### `watcher.unref()` {#watcherunref}

**Ajouté dans : v14.3.0, v12.20.0**

- Retourne : [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher)

Lorsqu'il est appelé, l'objet [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) actif n'exigera pas que la boucle d'événements Node.js reste active. S'il n'y a pas d'autre activité maintenant la boucle d'événements en cours d'exécution, le processus peut se terminer avant que le rappel de l'objet [\<fs.FSWatcher\>](/fr/nodejs/api/fs#class-fsfswatcher) ne soit invoqué. Appeler `watcher.unref()` plusieurs fois n'aura aucun effet.

### Classe : `fs.StatWatcher` {#class-fsstatwatcher}

**Ajouté dans : v14.3.0, v12.20.0**

- Hérite de [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Un appel réussi à la méthode `fs.watchFile()` renverra un nouvel objet [\<fs.StatWatcher\>](/fr/nodejs/api/fs#class-fsstatwatcher).

#### `watcher.ref()` {#watcherref_1}

**Ajouté dans : v14.3.0, v12.20.0**

- Retourne : [\<fs.StatWatcher\>](/fr/nodejs/api/fs#class-fsstatwatcher)

Lorsqu'elle est appelée, demande à la boucle d'événements Node.js de *ne pas* se terminer tant que le [\<fs.StatWatcher\>](/fr/nodejs/api/fs#class-fsstatwatcher) est actif. Appeler `watcher.ref()` plusieurs fois n'aura aucun effet.

Par défaut, tous les objets [\<fs.StatWatcher\>](/fr/nodejs/api/fs#class-fsstatwatcher) sont "ref'ed", ce qui rend normalement inutile l'appel à `watcher.ref()` sauf si `watcher.unref()` a été appelé précédemment.


#### `watcher.unref()` {#watcherunref_1}

**Ajouté dans : v14.3.0, v12.20.0**

- Retourne : [\<fs.StatWatcher\>](/fr/nodejs/api/fs#class-fsstatwatcher)

Lorsqu'il est appelé, l'objet [\<fs.StatWatcher\>](/fr/nodejs/api/fs#class-fsstatwatcher) actif n'exigera pas que la boucle d'événements Node.js reste active. S'il n'y a pas d'autre activité maintenant la boucle d'événements en cours d'exécution, le processus peut se terminer avant que le rappel de l'objet [\<fs.StatWatcher\>](/fr/nodejs/api/fs#class-fsstatwatcher) ne soit invoqué. Appeler `watcher.unref()` plusieurs fois n'aura aucun effet.

### Class : `fs.ReadStream` {#class-fsreadstream}

**Ajouté dans : v0.1.93**

- Étend : [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)

Les instances de [\<fs.ReadStream\>](/fr/nodejs/api/fs#class-fsreadstream) sont créées et retournées à l'aide de la fonction [`fs.createReadStream()`](/fr/nodejs/api/fs#fscreatereadstreampath-options).

#### Événement : `'close'` {#event-close_2}

**Ajouté dans : v0.1.93**

Émis lorsque le descripteur de fichier sous-jacent de [\<fs.ReadStream\>](/fr/nodejs/api/fs#class-fsreadstream) a été fermé.

#### Événement : `'open'` {#event-open}

**Ajouté dans : v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Descripteur de fichier entier utilisé par le [\<fs.ReadStream\>](/fr/nodejs/api/fs#class-fsreadstream).

Émis lorsque le descripteur de fichier de [\<fs.ReadStream\>](/fr/nodejs/api/fs#class-fsreadstream) a été ouvert.

#### Événement : `'ready'` {#event-ready}

**Ajouté dans : v9.11.0**

Émis lorsque le [\<fs.ReadStream\>](/fr/nodejs/api/fs#class-fsreadstream) est prêt à être utilisé.

Déclenché immédiatement après `'open'`.

#### `readStream.bytesRead` {#readstreambytesread}

**Ajouté dans : v6.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre d'octets qui ont été lus jusqu'à présent.

#### `readStream.path` {#readstreampath}

**Ajouté dans : v0.1.93**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Le chemin d'accès au fichier à partir duquel le flux lit, tel que spécifié dans le premier argument de `fs.createReadStream()`. Si `path` est transmis en tant que chaîne, alors `readStream.path` sera une chaîne. Si `path` est transmis en tant que [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), alors `readStream.path` sera un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer). Si `fd` est spécifié, alors `readStream.path` sera `undefined`.


#### `readStream.pending` {#readstreampending}

**Ajouté dans : v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette propriété est `true` si le fichier sous-jacent n'a pas encore été ouvert, c'est-à-dire avant que l'événement `'ready'` ne soit émis.

### Classe : `fs.Stats` {#class-fsstats}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.0.0, v20.13.0 | Le constructeur public est obsolète. |
| v8.1.0 | Ajout des heures sous forme de nombres. |
| v0.1.21 | Ajouté dans : v0.1.21 |
:::

Un objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) fournit des informations sur un fichier.

Les objets renvoyés par [`fs.stat()`](/fr/nodejs/api/fs#fsstatpath-options-callback), [`fs.lstat()`](/fr/nodejs/api/fs#fslstatpath-options-callback), [`fs.fstat()`](/fr/nodejs/api/fs#fsfstatfd-options-callback) et leurs équivalents synchrones sont de ce type. Si `bigint` dans les `options` transmises à ces méthodes est vrai, les valeurs numériques seront `bigint` au lieu de `number`, et l'objet contiendra des propriétés supplémentaires de précision nanoseconde suffixées par `Ns`. Les objets `Stat` ne doivent pas être créés directement à l'aide du mot-clé `new`.

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
Version `bigint` :

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**Ajouté dans : v0.1.10**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) décrit un périphérique de bloc.

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**Ajouté dans : v0.1.10**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) décrit un périphérique de caractères.

#### `stats.isDirectory()` {#statsisdirectory}

**Ajouté dans : v0.1.10**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) décrit un répertoire du système de fichiers.

Si l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) a été obtenu en appelant [`fs.lstat()`](/fr/nodejs/api/fs#fslstatpath-options-callback) sur un lien symbolique qui pointe vers un répertoire, cette méthode renverra `false`. En effet, [`fs.lstat()`](/fr/nodejs/api/fs#fslstatpath-options-callback) renvoie des informations sur un lien symbolique lui-même et non sur le chemin vers lequel il pointe.

#### `stats.isFIFO()` {#statsisfifo}

**Ajouté dans : v0.1.10**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) décrit un tube FIFO (first-in-first-out).

#### `stats.isFile()` {#statsisfile}

**Ajouté dans : v0.1.10**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) décrit un fichier standard.

#### `stats.isSocket()` {#statsissocket}

**Ajouté dans : v0.1.10**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) décrit un socket.

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**Ajouté dans : v0.1.10**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) décrit un lien symbolique.

Cette méthode n'est valide que lors de l'utilisation de [`fs.lstat()`](/fr/nodejs/api/fs#fslstatpath-options-callback).


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'identifiant numérique du périphérique contenant le fichier.

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Le numéro "Inode" spécifique au système de fichiers pour le fichier.

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Un champ de bits décrivant le type de fichier et le mode.

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Le nombre de liens physiques qui existent pour le fichier.

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'identifiant numérique de l'utilisateur propriétaire du fichier (POSIX).

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'identifiant numérique du groupe propriétaire du fichier (POSIX).

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Un identifiant numérique de périphérique si le fichier représente un périphérique.

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La taille du fichier en octets.

Si le système de fichiers sous-jacent ne prend pas en charge la récupération de la taille du fichier, ce sera `0`.


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

La taille du bloc du système de fichiers pour les opérations d'E/S.

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Le nombre de blocs alloués pour ce fichier.

#### `stats.atimeMs` {#statsatimems}

**Ajouté dans : v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'horodatage indiquant la dernière fois que ce fichier a été accédé, exprimé en millisecondes depuis l'époque POSIX.

#### `stats.mtimeMs` {#statsmtimems}

**Ajouté dans : v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'horodatage indiquant la dernière fois que ce fichier a été modifié, exprimé en millisecondes depuis l'époque POSIX.

#### `stats.ctimeMs` {#statsctimems}

**Ajouté dans : v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'horodatage indiquant la dernière fois que l'état du fichier a été modifié, exprimé en millisecondes depuis l'époque POSIX.

#### `stats.birthtimeMs` {#statsbirthtimems}

**Ajouté dans : v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

L'horodatage indiquant la date de création de ce fichier, exprimé en millisecondes depuis l'époque POSIX.

#### `stats.atimeNs` {#statsatimens}

**Ajouté dans : v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Présent uniquement si `bigint: true` est passé à la méthode qui génère l'objet. L'horodatage indiquant la dernière fois que ce fichier a été accédé, exprimé en nanosecondes depuis l'époque POSIX.


#### `stats.mtimeNs` {#statsmtimens}

**Ajouté dans : v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Présent uniquement lorsque `bigint: true` est passé à la méthode qui génère l’objet. L’horodatage indiquant la dernière modification de ce fichier exprimé en nanosecondes depuis l’époque POSIX.

#### `stats.ctimeNs` {#statsctimens}

**Ajouté dans : v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Présent uniquement lorsque `bigint: true` est passé à la méthode qui génère l’objet. L’horodatage indiquant la dernière modification de l’état du fichier exprimé en nanosecondes depuis l’époque POSIX.

#### `stats.birthtimeNs` {#statsbirthtimens}

**Ajouté dans : v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Présent uniquement lorsque `bigint: true` est passé à la méthode qui génère l’objet. L’horodatage indiquant la date de création de ce fichier exprimé en nanosecondes depuis l’époque POSIX.

#### `stats.atime` {#statsatime}

**Ajouté dans : v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

L’horodatage indiquant la dernière fois que ce fichier a été accédé.

#### `stats.mtime` {#statsmtime}

**Ajouté dans : v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

L’horodatage indiquant la dernière modification de ce fichier.

#### `stats.ctime` {#statsctime}

**Ajouté dans : v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

L’horodatage indiquant la dernière modification de l’état du fichier.

#### `stats.birthtime` {#statsbirthtime}

**Ajouté dans : v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

L’horodatage indiquant la date de création de ce fichier.

#### Valeurs temporelles de Stat {#stat-time-values}

Les propriétés `atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` sont des valeurs numériques qui contiennent les temps correspondants en millisecondes. Leur précision est spécifique à la plateforme. Lorsque `bigint: true` est passé à la méthode qui génère l’objet, les propriétés seront des [bigints](https://tc39.github.io/proposal-bigint), sinon elles seront des [nombres](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type).

Les propriétés `atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` sont des [bigints](https://tc39.github.io/proposal-bigint) qui contiennent les temps correspondants en nanosecondes. Elles sont uniquement présentes lorsque `bigint: true` est passé à la méthode qui génère l’objet. Leur précision est spécifique à la plateforme.

`atime`, `mtime`, `ctime` et `birthtime` sont des représentations alternatives d’objet [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) des différents temps. Les valeurs `Date` et numériques ne sont pas connectées. L’attribution d’une nouvelle valeur numérique ou la modification de la valeur `Date` ne seront pas reflétées dans la représentation alternative correspondante.

Les temps dans l’objet stat ont la sémantique suivante :

- `atime` "Temps d’accès" : Heure à laquelle les données du fichier ont été consultées pour la dernière fois. Modifié par les appels système [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) et [`read(2)`](http://man7.org/linux/man-pages/man2/read.2).
- `mtime` "Temps modifié" : Heure à laquelle les données du fichier ont été modifiées pour la dernière fois. Modifié par les appels système [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) et [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `ctime` "Temps de modification" : Heure à laquelle l’état du fichier a été modifié pour la dernière fois (modification des données d’inode). Modifié par les appels système [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2), [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2), [`link(2)`](http://man7.org/linux/man-pages/man2/link.2), [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2), [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) et [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `birthtime` "Heure de naissance" : Heure de création du fichier. Défini une fois lors de la création du fichier. Sur les systèmes de fichiers où `birthtime` n’est pas disponible, ce champ peut contenir soit `ctime`, soit `1970-01-01T00:00Z` (c’est-à-dire, l’horodatage de l’époque Unix `0`). Dans ce cas, cette valeur peut être supérieure à `atime` ou `mtime`. Sur Darwin et autres variantes FreeBSD, également défini si `atime` est explicitement défini sur une valeur antérieure à la `birthtime` actuelle à l’aide de l’appel système [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2).

Avant Node.js 0.12, `ctime` contenait `birthtime` sur les systèmes Windows. À partir de 0.12, `ctime` n’est pas "l’heure de création", et sur les systèmes Unix, il ne l’a jamais été.


### Classe : `fs.StatFs` {#class-fsstatfs}

**Ajoutée dans : v19.6.0, v18.15.0**

Fournit des informations sur un système de fichiers monté.

Les objets retournés par [`fs.statfs()`](/fr/nodejs/api/fs#fsstatfspath-options-callback) et son homologue synchrone sont de ce type. Si `bigint` dans les `options` passées à ces méthodes est `true`, les valeurs numériques seront `bigint` au lieu de `number`.

```bash [BASH]
StatFs {
  type : 1397114950,
  bsize : 4096,
  blocks : 121938943,
  bfree : 61058895,
  bavail : 61058895,
  files : 999,
  ffree : 1000000
}
```
Version `bigint` :

```bash [BASH]
StatFs {
  type : 1397114950n,
  bsize : 4096n,
  blocks : 121938943n,
  bfree : 61058895n,
  bavail : 61058895n,
  files : 999n,
  ffree : 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**Ajoutée dans : v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Blocs libres disponibles pour les utilisateurs non privilégiés.

#### `statfs.bfree` {#statfsbfree}

**Ajoutée dans : v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Blocs libres dans le système de fichiers.

#### `statfs.blocks` {#statfsblocks}

**Ajoutée dans : v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nombre total de blocs de données dans le système de fichiers.

#### `statfs.bsize` {#statfsbsize}

**Ajoutée dans : v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Taille de bloc de transfert optimale.

#### `statfs.ffree` {#statfsffree}

**Ajoutée dans : v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nœuds de fichiers libres dans le système de fichiers.


#### `statfs.files` {#statfsfiles}

**Ajouté dans : v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Nombre total de nœuds de fichiers dans le système de fichiers.

#### `statfs.type` {#statfstype}

**Ajouté dans : v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Type de système de fichiers.

### Class: `fs.WriteStream` {#class-fswritestream}

**Ajouté dans : v0.1.93**

- Étend [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable)

Les instances de [\<fs.WriteStream\>](/fr/nodejs/api/fs#class-fswritestream) sont créées et renvoyées à l'aide de la fonction [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options).

#### Event: `'close'` {#event-close_3}

**Ajouté dans : v0.1.93**

Émis lorsque le descripteur de fichier sous-jacent de [\<fs.WriteStream\>](/fr/nodejs/api/fs#class-fswritestream) a été fermé.

#### Event: `'open'` {#event-open_1}

**Ajouté dans : v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Descripteur de fichier entier utilisé par [\<fs.WriteStream\>](/fr/nodejs/api/fs#class-fswritestream).

Émis lorsque le fichier de [\<fs.WriteStream\>](/fr/nodejs/api/fs#class-fswritestream) est ouvert.

#### Event: `'ready'` {#event-ready_1}

**Ajouté dans : v9.11.0**

Émis lorsque [\<fs.WriteStream\>](/fr/nodejs/api/fs#class-fswritestream) est prêt à être utilisé.

Déclenché immédiatement après `'open'`.

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**Ajouté dans : v0.4.7**

Le nombre d'octets écrits jusqu'à présent. N'inclut pas les données qui sont toujours en file d'attente pour l'écriture.

#### `writeStream.close([callback])` {#writestreamclosecallback}

**Ajouté dans : v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Ferme `writeStream`. Accepte facultativement un rappel qui sera exécuté une fois que `writeStream` sera fermé.


#### `writeStream.path` {#writestreampath}

**Ajouté dans : v0.1.93**

Le chemin d’accès au fichier dans lequel le flux écrit, tel que spécifié dans le premier argument de [`fs.createWriteStream()`](/fr/nodejs/api/fs#fscreatewritestreampath-options). Si `path` est transmis en tant que chaîne, alors `writeStream.path` sera une chaîne. Si `path` est transmis en tant que [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), alors `writeStream.path` sera un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer).

#### `writeStream.pending` {#writestreampending}

**Ajouté dans : v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette propriété est `true` si le fichier sous-jacent n’a pas encore été ouvert, c’est-à-dire avant que l’événement `'ready'` ne soit émis.

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Renvoie un objet contenant des constantes couramment utilisées pour les opérations du système de fichiers.

#### Constantes FS {#fs-constants}

Les constantes suivantes sont exportées par `fs.constants` et `fsPromises.constants`.

Toutes les constantes ne seront pas disponibles sur tous les systèmes d’exploitation ; ceci est particulièrement important pour Windows, où de nombreuses définitions spécifiques à POSIX ne sont pas disponibles. Pour les applications portables, il est recommandé de vérifier leur présence avant de les utiliser.

Pour utiliser plusieurs constantes, utilisez l’opérateur OU bit à bit `|`.

Exemple :

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### Constantes d’accès aux fichiers {#file-access-constants}

Les constantes suivantes sont destinées à être utilisées comme paramètre `mode` transmis à [`fsPromises.access()`](/fr/nodejs/api/fs#fspromisesaccesspath-mode), [`fs.access()`](/fr/nodejs/api/fs#fsaccesspath-mode-callback) et [`fs.accessSync()`](/fr/nodejs/api/fs#fsaccesssyncpath-mode).

| Constante | Description |
| --- | --- |
| `F_OK` | Indicateur signalant que le fichier est visible par le processus appelant. C’est utile pour déterminer si un fichier existe, mais ne dit rien sur les autorisations `rwx`. Valeur par défaut si aucun mode n’est spécifié. |
| `R_OK` | Indicateur signalant que le fichier peut être lu par le processus appelant. |
| `W_OK` | Indicateur signalant que le fichier peut être écrit par le processus appelant. |
| `X_OK` | Indicateur signalant que le fichier peut être exécuté par le processus appelant. Cela n’a aucun effet sur Windows (se comportera comme `fs.constants.F_OK`). |
Les définitions sont également disponibles sur Windows.


##### Constantes de copie de fichier {#file-copy-constants}

Les constantes suivantes sont destinées à être utilisées avec [`fs.copyFile()`](/fr/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).

| Constante | Description |
|---|---|
| `COPYFILE_EXCL` | Si elle est présente, l'opération de copie échouera avec une erreur si le chemin de destination existe déjà. |
| `COPYFILE_FICLONE` | Si elle est présente, l'opération de copie tentera de créer un reflink de copie sur écriture. Si la plateforme sous-jacente ne prend pas en charge la copie sur écriture, un mécanisme de copie de repli est utilisé. |
| `COPYFILE_FICLONE_FORCE` | Si elle est présente, l'opération de copie tentera de créer un reflink de copie sur écriture. Si la plateforme sous-jacente ne prend pas en charge la copie sur écriture, l'opération échouera avec une erreur. |

Les définitions sont également disponibles sur Windows.

##### Constantes d'ouverture de fichier {#file-open-constants}

Les constantes suivantes sont destinées à être utilisées avec `fs.open()`.

| Constante | Description |
|---|---|
| `O_RDONLY` | Drapeau indiquant d'ouvrir un fichier en accès lecture seule. |
| `O_WRONLY` | Drapeau indiquant d'ouvrir un fichier en accès écriture seule. |
| `O_RDWR` | Drapeau indiquant d'ouvrir un fichier en accès lecture-écriture. |
| `O_CREAT` | Drapeau indiquant de créer le fichier s'il n'existe pas déjà. |
| `O_EXCL` | Drapeau indiquant que l'ouverture d'un fichier doit échouer si le drapeau `O_CREAT` est défini et que le fichier existe déjà. |
| `O_NOCTTY` | Drapeau indiquant que si le chemin identifie un périphérique terminal, l'ouverture du chemin ne doit pas faire de ce terminal le terminal de contrôle du processus (si le processus n'en a pas déjà un). |
| `O_TRUNC` | Drapeau indiquant que si le fichier existe et est un fichier régulier, et que le fichier est ouvert avec succès en accès écriture, sa longueur doit être tronquée à zéro. |
| `O_APPEND` | Drapeau indiquant que les données seront ajoutées à la fin du fichier. |
| `O_DIRECTORY` | Drapeau indiquant que l'ouverture doit échouer si le chemin n'est pas un répertoire. |
| `O_NOATIME` | Drapeau indiquant que les accès en lecture au système de fichiers n'entraîneront plus de mise à jour des informations `atime` associées au fichier. Ce drapeau est disponible uniquement sur les systèmes d'exploitation Linux. |
| `O_NOFOLLOW` | Drapeau indiquant que l'ouverture doit échouer si le chemin est un lien symbolique. |
| `O_SYNC` | Drapeau indiquant que le fichier est ouvert pour E/S synchronisée avec les opérations d'écriture en attente de l'intégrité du fichier. |
| `O_DSYNC` | Drapeau indiquant que le fichier est ouvert pour E/S synchronisée avec les opérations d'écriture en attente de l'intégrité des données. |
| `O_SYMLINK` | Drapeau indiquant d'ouvrir le lien symbolique lui-même plutôt que la ressource vers laquelle il pointe. |
| `O_DIRECT` | Lorsqu'il est défini, une tentative sera faite pour minimiser les effets de mise en cache des E/S de fichiers. |
| `O_NONBLOCK` | Drapeau indiquant d'ouvrir le fichier en mode non bloquant lorsque cela est possible. |
| `UV_FS_O_FILEMAP` | Lorsqu'il est défini, un mappage de fichier mémoire est utilisé pour accéder au fichier. Ce drapeau est disponible uniquement sur les systèmes d'exploitation Windows. Sur les autres systèmes d'exploitation, ce drapeau est ignoré. |

Sur Windows, seuls `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_RDONLY`, `O_RDWR`, `O_TRUNC`, `O_WRONLY` et `UV_FS_O_FILEMAP` sont disponibles.


##### Constantes de type de fichier {#file-type-constants}

Les constantes suivantes sont destinées à être utilisées avec la propriété `mode` de l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour déterminer le type d'un fichier.

| Constante | Description |
| --- | --- |
| `S_IFMT` | Masque de bits utilisé pour extraire le code de type de fichier. |
| `S_IFREG` | Constante de type de fichier pour un fichier régulier. |
| `S_IFDIR` | Constante de type de fichier pour un répertoire. |
| `S_IFCHR` | Constante de type de fichier pour un fichier de périphérique orienté caractère. |
| `S_IFBLK` | Constante de type de fichier pour un fichier de périphérique orienté bloc. |
| `S_IFIFO` | Constante de type de fichier pour un FIFO/pipe. |
| `S_IFLNK` | Constante de type de fichier pour un lien symbolique. |
| `S_IFSOCK` | Constante de type de fichier pour un socket. |
Sur Windows, seuls `S_IFCHR`, `S_IFDIR`, `S_IFLNK`, `S_IFMT` et `S_IFREG` sont disponibles.

##### Constantes de mode de fichier {#file-mode-constants}

Les constantes suivantes sont destinées à être utilisées avec la propriété `mode` de l'objet [\<fs.Stats\>](/fr/nodejs/api/fs#class-fsstats) pour déterminer les autorisations d'accès d'un fichier.

| Constante | Description |
| --- | --- |
| `S_IRWXU` | Mode de fichier indiquant que le propriétaire peut lire, écrire et exécuter. |
| `S_IRUSR` | Mode de fichier indiquant que le propriétaire peut lire. |
| `S_IWUSR` | Mode de fichier indiquant que le propriétaire peut écrire. |
| `S_IXUSR` | Mode de fichier indiquant que le propriétaire peut exécuter. |
| `S_IRWXG` | Mode de fichier indiquant que le groupe peut lire, écrire et exécuter. |
| `S_IRGRP` | Mode de fichier indiquant que le groupe peut lire. |
| `S_IWGRP` | Mode de fichier indiquant que le groupe peut écrire. |
| `S_IXGRP` | Mode de fichier indiquant que le groupe peut exécuter. |
| `S_IRWXO` | Mode de fichier indiquant que les autres peuvent lire, écrire et exécuter. |
| `S_IROTH` | Mode de fichier indiquant que les autres peuvent lire. |
| `S_IWOTH` | Mode de fichier indiquant que les autres peuvent écrire. |
| `S_IXOTH` | Mode de fichier indiquant que les autres peuvent exécuter. |
Sur Windows, seuls `S_IRUSR` et `S_IWUSR` sont disponibles.

## Notes {#notes}

### Ordre des opérations basées sur des rappels et des promesses {#ordering-of-callback-and-promise-based-operations}

Comme elles sont exécutées de manière asynchrone par le pool de threads sous-jacent, il n'y a pas d'ordre garanti lors de l'utilisation des méthodes basées sur des rappels ou des promesses.

Par exemple, le code suivant est sujet à erreur car l'opération `fs.stat()` peut se terminer avant l'opération `fs.rename()` :

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
Il est important d'ordonner correctement les opérations en attendant les résultats de l'une avant d'invoquer l'autre :



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

Ou, lors de l'utilisation des API de rappel, déplacez l'appel `fs.stat()` dans le rappel de l'opération `fs.rename()` :



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```
:::


### Chemins de fichiers {#file-paths}

La plupart des opérations `fs` acceptent les chemins de fichiers qui peuvent être spécifiés sous la forme d'une chaîne de caractères, d'un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer), ou d'un objet [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) utilisant le protocole `file:`.

#### Chemins de type chaîne de caractères {#string-paths}

Les chemins de type chaîne de caractères sont interprétés comme des séquences de caractères UTF-8 identifiant le nom de fichier absolu ou relatif. Les chemins relatifs seront résolus par rapport au répertoire de travail courant tel que déterminé en appelant `process.cwd()`.

Exemple utilisant un chemin absolu sur POSIX :

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Faire quelque chose avec le fichier
} finally {
  await fd?.close();
}
```
Exemple utilisant un chemin relatif sur POSIX (par rapport à `process.cwd()`) :

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Faire quelque chose avec le fichier
} finally {
  await fd?.close();
}
```
#### Chemins d'URL de fichier {#file-url-paths}

**Ajouté dans : v7.6.0**

Pour la plupart des fonctions du module `node:fs`, l'argument `path` ou `filename` peut être passé comme un objet [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) utilisant le protocole `file:`.

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
Les URL `file:` sont toujours des chemins absolus.

##### Considérations spécifiques à la plateforme {#platform-specific-considerations}

Sous Windows, les [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) `file:` avec un nom d'hôte sont converties en chemins UNC, tandis que les [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) `file:` avec des lettres de lecteur sont converties en chemins absolus locaux. Les [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) `file:` sans nom d'hôte ni lettre de lecteur entraîneront une erreur :

```js [ESM]
import { readFileSync } from 'node:fs';
// Sous Windows :

// - Les URL de fichier WHATWG avec un nom d'hôte sont converties en chemin UNC
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - Les URL de fichier WHATWG avec des lettres de lecteur sont converties en chemin absolu
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - Les URL de fichier WHATWG sans nom d'hôte doivent avoir une lettre de lecteur
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH] : Le chemin d'URL de fichier doit être absolu
```
Les [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) `file:` avec des lettres de lecteur doivent utiliser `:` comme séparateur juste après la lettre de lecteur. L'utilisation d'un autre séparateur entraînera une erreur.

Sur toutes les autres plates-formes, les [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) `file:` avec un nom d'hôte ne sont pas prises en charge et entraîneront une erreur :

```js [ESM]
import { readFileSync } from 'node:fs';
// Sur les autres plateformes :

// - Les URL de fichier WHATWG avec un nom d'hôte ne sont pas prises en charge
// file://hostname/p/a/t/h/file => throw !
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH] : doit être absolu

// - Les URL de fichier WHATWG sont converties en chemin absolu
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
Une [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) `file:` ayant des caractères de barre oblique encodés entraînera une erreur sur toutes les plateformes :

```js [ESM]
import { readFileSync } from 'node:fs';

// Sous Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH] : Le chemin d'URL de fichier ne doit pas inclure de caractères \ ou / encodés */

// Sous POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH] : Le chemin d'URL de fichier ne doit pas inclure de caractères / encodés */
```
Sous Windows, les [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) `file:` ayant une barre oblique inversée encodée entraîneront une erreur :

```js [ESM]
import { readFileSync } from 'node:fs';

// Sous Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH] : Le chemin d'URL de fichier ne doit pas inclure de caractères \ ou / encodés */
```

#### Chemins d'accès Buffer {#buffer-paths}

Les chemins d'accès spécifiés à l'aide d'un [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) sont principalement utiles sur certains systèmes d'exploitation POSIX qui traitent les chemins de fichiers comme des séquences d'octets opaques. Sur ces systèmes, il est possible qu'un seul chemin de fichier contienne des sous-séquences qui utilisent plusieurs encodages de caractères. Comme pour les chemins de chaînes, les chemins [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) peuvent être relatifs ou absolus :

Exemple d'utilisation d'un chemin absolu sur POSIX :

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
```
#### Répertoires de travail par lecteur sous Windows {#per-drive-working-directories-on-windows}

Sous Windows, Node.js suit le concept de répertoire de travail par lecteur. Ce comportement peut être observé lors de l'utilisation d'un chemin de lecteur sans barre oblique inverse. Par exemple, `fs.readdirSync('C:\\')` peut potentiellement renvoyer un résultat différent de `fs.readdirSync('C:')`. Pour plus d'informations, consultez [cette page MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

### Descripteurs de fichiers {#file-descriptors_1}

Sur les systèmes POSIX, pour chaque processus, le noyau conserve une table des fichiers et des ressources actuellement ouverts. Chaque fichier ouvert se voit attribuer un identifiant numérique simple appelé *descripteur de fichier*. Au niveau du système, toutes les opérations du système de fichiers utilisent ces descripteurs de fichiers pour identifier et suivre chaque fichier spécifique. Les systèmes Windows utilisent un mécanisme différent, mais conceptuellement similaire, pour suivre les ressources. Pour simplifier les choses pour les utilisateurs, Node.js fait abstraction des différences entre les systèmes d'exploitation et attribue à tous les fichiers ouverts un descripteur de fichier numérique.

Les méthodes `fs.open()` basées sur des rappels et `fs.openSync()` synchrones ouvrent un fichier et allouent un nouveau descripteur de fichier. Une fois alloué, le descripteur de fichier peut être utilisé pour lire des données, écrire des données ou demander des informations sur le fichier.

Les systèmes d'exploitation limitent le nombre de descripteurs de fichiers qui peuvent être ouverts à un moment donné. Il est donc essentiel de fermer le descripteur une fois les opérations terminées. Le non-respect de cette consigne entraînera une fuite de mémoire qui finira par provoquer le plantage d'une application.

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
Les API basées sur des promesses utilisent un objet [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) à la place du descripteur de fichier numérique. Ces objets sont mieux gérés par le système pour garantir qu'aucune ressource n'est perdue. Cependant, il est toujours nécessaire de les fermer une fois les opérations terminées :

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // use stat
} finally {
  await file.close();
}
```

### Utilisation du pool de threads {#threadpool-usage}

Toutes les API du système de fichiers basées sur des rappels et des promesses (à l'exception de `fs.FSWatcher()`) utilisent le pool de threads de libuv. Cela peut avoir des implications de performances surprenantes et négatives pour certaines applications. Voir la documentation [`UV_THREADPOOL_SIZE`](/fr/nodejs/api/cli#uv_threadpool_sizesize) pour plus d'informations.

### Flags du système de fichiers {#file-system-flags}

Les flags suivants sont disponibles partout où l'option `flag` prend une chaîne de caractères.

- `'a'` : ouvre le fichier pour ajout. Le fichier est créé s'il n'existe pas.
- `'ax'` : comme `'a'`, mais échoue si le chemin existe.
- `'a+'` : ouvre le fichier pour lecture et ajout. Le fichier est créé s'il n'existe pas.
- `'ax+'` : comme `'a+'`, mais échoue si le chemin existe.
- `'as'` : ouvre le fichier pour ajout en mode synchrone. Le fichier est créé s'il n'existe pas.
- `'as+'` : ouvre le fichier pour lecture et ajout en mode synchrone. Le fichier est créé s'il n'existe pas.
- `'r'` : ouvre le fichier en lecture seule. Une exception se produit si le fichier n'existe pas.
- `'rs'` : ouvre le fichier en lecture seule en mode synchrone. Une exception se produit si le fichier n'existe pas.
- `'r+'` : ouvre le fichier en lecture et en écriture. Une exception se produit si le fichier n'existe pas.
- `'rs+'` : ouvre le fichier en lecture et en écriture en mode synchrone. Demande au système d'exploitation de contourner le cache du système de fichiers local. Ceci est principalement utile pour ouvrir des fichiers sur des montages NFS, car cela permet de contourner le cache local potentiellement obsolète. Cela a un impact très réel sur les performances d'E/S, il est donc déconseillé d'utiliser ce flag, sauf si cela est nécessaire. Cela ne transforme pas `fs.open()` ou `fsPromises.open()` en un appel bloquant synchrone. Si une opération synchrone est souhaitée, quelque chose comme `fs.openSync()` doit être utilisé.
- `'w'` : ouvre le fichier en écriture. Le fichier est créé (s'il n'existe pas) ou tronqué (s'il existe).
- `'wx'` : comme `'w'`, mais échoue si le chemin existe.
- `'w+'` : ouvre le fichier en lecture et en écriture. Le fichier est créé (s'il n'existe pas) ou tronqué (s'il existe).
- `'wx+'` : comme `'w+'`, mais échoue si le chemin existe.

`flag` peut aussi être un nombre, comme documenté par [`open(2)`](http://man7.org/linux/man-pages/man2/open.2) ; les constantes couramment utilisées sont disponibles dans `fs.constants`. Sous Windows, les flags sont traduits en leurs équivalents, le cas échéant, par exemple `O_WRONLY` en `FILE_GENERIC_WRITE`, ou `O_EXCL|O_CREAT` en `CREATE_NEW`, tels qu'acceptés par `CreateFileW`.

Le flag exclusif `'x'` (flag `O_EXCL` dans [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)) fait en sorte que l'opération renvoie une erreur si le chemin existe déjà. Sur POSIX, si le chemin est un lien symbolique, l'utilisation de `O_EXCL` renvoie une erreur même si le lien pointe vers un chemin qui n'existe pas. Le flag exclusif peut ne pas fonctionner avec les systèmes de fichiers réseau.

Sous Linux, les écritures positionnelles ne fonctionnent pas lorsque le fichier est ouvert en mode ajout. Le noyau ignore l'argument de position et ajoute toujours les données à la fin du fichier.

Modifier un fichier plutôt que de le remplacer peut nécessiter que l'option `flag` soit définie sur `'r+'` plutôt que sur la valeur par défaut `'w'`.

Le comportement de certains flags est spécifique à la plateforme. Ainsi, l'ouverture d'un répertoire sur macOS et Linux avec le flag `'a+'`, comme dans l'exemple ci-dessous, renverra une erreur. En revanche, sous Windows et FreeBSD, un descripteur de fichier ou un `FileHandle` sera renvoyé.

```js [ESM]
// macOS et Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows et FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```

Sous Windows, l'ouverture d'un fichier caché existant à l'aide du flag `'w'` (que ce soit via `fs.open()`, `fs.writeFile()` ou `fsPromises.open()`) échouera avec `EPERM`. Les fichiers cachés existants peuvent être ouverts en écriture avec le flag `'r+'`.

Un appel à `fs.ftruncate()` ou `filehandle.truncate()` peut être utilisé pour réinitialiser le contenu du fichier.

