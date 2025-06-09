---
title: Documentation Node.js - HTTP/2
description: Cette page fournit une documentation complète sur le module HTTP/2 dans Node.js, détaillant son API, son utilisation et des exemples pour implémenter des serveurs et clients HTTP/2.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette page fournit une documentation complète sur le module HTTP/2 dans Node.js, détaillant son API, son utilisation et des exemples pour implémenter des serveurs et clients HTTP/2.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - HTTP/2 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette page fournit une documentation complète sur le module HTTP/2 dans Node.js, détaillant son API, son utilisation et des exemples pour implémenter des serveurs et clients HTTP/2.
---


# HTTP/2 {#http/2}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Les requêtes avec l'en-tête `host` (avec ou sans `:authority`) peuvent désormais être envoyées/reçues. |
| v15.3.0, v14.17.0 | Il est possible d'abandonner une requête avec un AbortSignal. |
| v10.10.0 | HTTP/2 est désormais Stable. Auparavant, il était Expérimental. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/http2.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http2.js)

Le module `node:http2` fournit une implémentation du protocole [HTTP/2](https://tools.ietf.org/html/rfc7540). Il est accessible en utilisant :

```js [ESM]
const http2 = require('node:http2');
```
## Déterminer si le support crypto n'est pas disponible {#determining-if-crypto-support-is-unavailable}

Il est possible que Node.js soit construit sans inclure la prise en charge du module `node:crypto`. Dans de tels cas, tenter d'`import` depuis `node:http2` ou d'appeler `require('node:http2')` entraînera la levée d'une erreur.

Lors de l'utilisation de CommonJS, l'erreur levée peut être interceptée à l'aide de try/catch :

```js [CJS]
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('La prise en charge de http2 est désactivée !');
}
```
Lors de l'utilisation du mot-clé lexical ESM `import`, l'erreur ne peut être interceptée que si un gestionnaire pour `process.on('uncaughtException')` est enregistré *avant* toute tentative de chargement du module (en utilisant, par exemple, un module de préchargement).

Lors de l'utilisation d'ESM, s'il y a une chance que le code puisse être exécuté sur une version de Node.js où la prise en charge de crypto n'est pas activée, envisagez d'utiliser la fonction [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) au lieu du mot-clé lexical `import` :

```js [ESM]
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('La prise en charge de http2 est désactivée !');
}
```
## API Core {#core-api}

L'API Core fournit une interface de bas niveau conçue spécifiquement autour de la prise en charge des fonctionnalités du protocole HTTP/2. Elle n'est spécifiquement *pas* conçue pour être compatible avec l'API du module [HTTP/1](/fr/nodejs/api/http) existant. Cependant, l'[API de compatibilité](/fr/nodejs/api/http2#compatibility-api) l'est.

L'API Core `http2` est beaucoup plus symétrique entre le client et le serveur que l'API `http`. Par exemple, la plupart des événements, tels que `'error'`, `'connect'` et `'stream'`, peuvent être émis par le code côté client ou le code côté serveur.


### Exemple côté serveur {#server-side-example}

L'exemple suivant illustre un simple serveur HTTP/2 utilisant l'API Core. Étant donné qu'aucun navigateur connu ne prend en charge [HTTP/2 non chiffré](https://http2.github.io/faq/#does-http2-require-encryption), l'utilisation de [`http2.createSecureServer()`](/fr/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) est nécessaire lors de la communication avec des clients de navigateurs.



::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::

Pour générer le certificat et la clé pour cet exemple, exécutez :

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```
### Exemple côté client {#client-side-example}

L'exemple suivant illustre un client HTTP/2 :



::: code-group
```js [ESM]
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```
:::


### Classe : `Http2Session` {#class-http2session}

**Ajouté dans : v8.4.0**

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Les instances de la classe `http2.Http2Session` représentent une session de communications active entre un client et un serveur HTTP/2. Les instances de cette classe ne sont *pas* destinées à être construites directement par le code utilisateur.

Chaque instance `Http2Session` présentera des comportements légèrement différents selon qu'elle fonctionne comme un serveur ou un client. La propriété `http2session.type` peut être utilisée pour déterminer le mode dans lequel une `Http2Session` fonctionne. Côté serveur, le code utilisateur devrait rarement avoir l'occasion de travailler directement avec l'objet `Http2Session`, la plupart des actions étant généralement effectuées par le biais d'interactions avec les objets `Http2Server` ou `Http2Stream`.

Le code utilisateur ne créera pas directement d'instances `Http2Session`. Les instances `Http2Session` côté serveur sont créées par l'instance `Http2Server` lorsqu'une nouvelle connexion HTTP/2 est reçue. Les instances `Http2Session` côté client sont créées à l'aide de la méthode `http2.connect()`.

#### `Http2Session` et les sockets {#http2session-and-sockets}

Chaque instance `Http2Session` est associée à exactement un [`net.Socket`](/fr/nodejs/api/net#class-netsocket) ou [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket) lors de sa création. Lorsque le `Socket` ou le `Http2Session` sont détruits, les deux sont détruits.

En raison des exigences spécifiques de sérialisation et de traitement imposées par le protocole HTTP/2, il n'est pas recommandé au code utilisateur de lire ou d'écrire des données vers une instance `Socket` liée à une `Http2Session`. Cela peut mettre la session HTTP/2 dans un état indéterminé, rendant la session et le socket inutilisables.

Une fois qu'un `Socket` a été lié à une `Http2Session`, le code utilisateur doit uniquement s'appuyer sur l'API de la `Http2Session`.

#### Événement : `'close'` {#event-close}

**Ajouté dans : v8.4.0**

L'événement `'close'` est émis une fois que la `Http2Session` a été détruite. Son écouteur n'attend aucun argument.

#### Événement : `'connect'` {#event-connect}

**Ajouté dans : v8.4.0**

- `session` [\<Http2Session\>](/fr/nodejs/api/http2#class-http2session)
- `socket` [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

L'événement `'connect'` est émis une fois que la `Http2Session` a été connectée avec succès au pair distant et que la communication peut commencer.

Le code utilisateur n'écoute généralement pas cet événement directement.


#### Événement : `'error'` {#event-error}

**Ajouté dans : v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'événement `'error'` est émis lorsqu'une erreur se produit lors du traitement d'une `Http2Session`.

#### Événement : `'frameError'` {#event-frameerror}

**Ajouté dans : v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le type de trame.
- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le code d'erreur.
- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID de flux (ou `0` si la trame n'est pas associée à un flux).

L'événement `'frameError'` est émis lorsqu'une erreur se produit lors de la tentative d'envoi d'une trame sur la session. Si la trame qui n'a pas pu être envoyée est associée à un `Http2Stream` spécifique, une tentative d'émission d'un événement `'frameError'` sur le `Http2Stream` est effectuée.

Si l'événement `'frameError'` est associé à un flux, le flux sera fermé et détruit immédiatement après l'événement `'frameError'`. Si l'événement n'est pas associé à un flux, la `Http2Session` sera arrêtée immédiatement après l'événement `'frameError'`.

#### Événement : `'goaway'` {#event-goaway}

**Ajouté dans : v8.4.0**

- `errorCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le code d'erreur HTTP/2 spécifié dans la trame `GOAWAY`.
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID du dernier flux que le pair distant a traité avec succès (ou `0` si aucun ID n'est spécifié).
- `opaqueData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Si des données opaques supplémentaires ont été incluses dans la trame `GOAWAY`, une instance `Buffer` sera passée contenant ces données.

L'événement `'goaway'` est émis lorsqu'une trame `GOAWAY` est reçue.

L'instance `Http2Session` sera arrêtée automatiquement lorsque l'événement `'goaway'` sera émis.


#### Événement : `'localSettings'` {#event-localsettings}

**Ajouté dans : v8.4.0**

- `settings` [\<Objet Paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object) Une copie de la frame `SETTINGS` reçue.

L'événement `'localSettings'` est émis lorsqu'une frame `SETTINGS` d'accusé de réception a été reçue.

Lors de l'utilisation de `http2session.settings()` pour soumettre de nouveaux paramètres, les paramètres modifiés ne prennent effet que lorsque l'événement `'localSettings'` est émis.

```js [ESM]
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Utilisez les nouveaux paramètres */
});
```
#### Événement : `'ping'` {#event-ping}

**Ajouté dans : v10.12.0**

- `payload` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) La charge utile de 8 octets de la frame `PING`

L'événement `'ping'` est émis chaque fois qu'une frame `PING` est reçue du pair connecté.

#### Événement : `'remoteSettings'` {#event-remotesettings}

**Ajouté dans : v8.4.0**

- `settings` [\<Objet Paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object) Une copie de la frame `SETTINGS` reçue.

L'événement `'remoteSettings'` est émis lorsqu'une nouvelle frame `SETTINGS` est reçue du pair connecté.

```js [ESM]
session.on('remoteSettings', (settings) => {
  /* Utilisez les nouveaux paramètres */
});
```
#### Événement : `'stream'` {#event-stream}

**Ajouté dans : v8.4.0**

- `stream` [\<Http2Stream\>](/fr/nodejs/api/http2#class-http2stream) Une référence au flux
- `headers` [\<Objet En-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object) Un objet décrivant les en-têtes
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Les indicateurs numériques associés
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau contenant les noms des en-têtes bruts suivis de leurs valeurs respectives.

L'événement `'stream'` est émis lorsqu'un nouveau `Http2Stream` est créé.

```js [ESM]
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
Côté serveur, le code utilisateur n'écoutera généralement pas cet événement directement, et enregistrera plutôt un gestionnaire pour l'événement `'stream'` émis par les instances `net.Server` ou `tls.Server` renvoyées respectivement par `http2.createServer()` et `http2.createSecureServer()`, comme dans l'exemple ci-dessous :

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Crée un serveur HTTP/2 non chiffré
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Crée un serveur HTTP/2 non chiffré
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::

Même si les flux HTTP/2 et les sockets réseau ne sont pas dans une correspondance 1:1, une erreur réseau détruira chaque flux individuel et doit être gérée au niveau du flux, comme indiqué ci-dessus.


#### Événement : `'timeout'` {#event-timeout}

**Ajouté dans : v8.4.0**

Après l'utilisation de la méthode `http2session.setTimeout()` pour définir la période de timeout pour cette `Http2Session`, l'événement `'timeout'` est émis s'il n'y a aucune activité sur la `Http2Session` après le nombre de millisecondes configuré. Son écouteur ne s'attend à aucun argument.

```js [ESM]
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```
#### `http2session.alpnProtocol` {#http2sessionalpnprotocol}

**Ajouté dans : v9.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

La valeur sera `undefined` si la `Http2Session` n'est pas encore connectée à un socket, `h2c` si la `Http2Session` n'est pas connectée à un `TLSSocket`, ou renverra la valeur de la propriété `alpnProtocol` du `TLSSocket` connecté.

#### `http2session.close([callback])` {#http2sessionclosecallback}

**Ajouté dans : v9.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Ferme gracieusement la `Http2Session`, permettant à tous les flux existants de se terminer d'eux-mêmes et empêchant la création de nouvelles instances de `Http2Stream`. Une fois fermée, `http2session.destroy()` *peut* être appelée s'il n'y a pas d'instances `Http2Stream` ouvertes.

Si spécifié, la fonction `callback` est enregistrée en tant que gestionnaire pour l'événement `'close'`.

#### `http2session.closed` {#http2sessionclosed}

**Ajouté dans : v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sera `true` si cette instance de `Http2Session` a été fermée, sinon `false`.

#### `http2session.connecting` {#http2sessionconnecting}

**Ajouté dans : v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sera `true` si cette instance de `Http2Session` est toujours en cours de connexion, sera définie sur `false` avant d'émettre l'événement `connect` et/ou d'appeler le rappel `http2.connect`.

#### `http2session.destroy([error][, code])` {#http2sessiondestroyerror-code}

**Ajouté dans : v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Un objet `Error` si la `Http2Session` est détruite en raison d'une erreur.
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le code d'erreur HTTP/2 à envoyer dans la trame `GOAWAY` finale. Si non spécifié et que `error` n'est pas indéfini, la valeur par défaut est `INTERNAL_ERROR`, sinon la valeur par défaut est `NO_ERROR`.

Met fin immédiatement à la `Http2Session` et au `net.Socket` ou `tls.TLSSocket` associé.

Une fois détruite, la `Http2Session` émettra l'événement `'close'`. Si `error` n'est pas indéfini, un événement `'error'` sera émis immédiatement avant l'événement `'close'`.

S'il reste des `Http2Streams` ouverts associés à la `Http2Session`, ceux-ci seront également détruits.


#### `http2session.destroyed` {#http2sessiondestroyed}

**Ajouté dans : v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sera `true` si cette instance `Http2Session` a été détruite et ne doit plus être utilisée, sinon `false`.

#### `http2session.encrypted` {#http2sessionencrypted}

**Ajouté dans : v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

La valeur est `undefined` si le socket de session `Http2Session` n’a pas encore été connecté, `true` si la `Http2Session` est connectée avec un `TLSSocket`, et `false` si la `Http2Session` est connectée à tout autre type de socket ou de flux.

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])` {#http2sessiongoawaycode-laststreamid-opaquedata}

**Ajouté dans : v9.4.0**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un code d’erreur HTTP/2
- `lastStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L’ID numérique du dernier `Http2Stream` traité
- `opaqueData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Une instance `TypedArray` ou `DataView` contenant des données supplémentaires à transporter dans la frame `GOAWAY`.

Transmet une frame `GOAWAY` au pair connecté *sans* arrêter la `Http2Session`.

#### `http2session.localSettings` {#http2sessionlocalsettings}

**Ajouté dans : v8.4.0**

- [\<HTTP/2 Settings Object\>](/fr/nodejs/api/http2#settings-object)

Un objet sans prototype décrivant les paramètres locaux actuels de cette `Http2Session`. Les paramètres locaux sont locaux à *cette* instance `Http2Session`.

#### `http2session.originSet` {#http2sessionoriginset}

**Ajouté dans : v9.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Si la `Http2Session` est connectée à un `TLSSocket`, la propriété `originSet` renverra un `Array` d’origines pour lesquelles la `Http2Session` peut être considérée comme faisant autorité.

La propriété `originSet` n’est disponible que lors de l’utilisation d’une connexion TLS sécurisée.


#### `http2session.pendingSettingsAck` {#http2sessionpendingsettingsack}

**Ajouté dans : v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indique si `Http2Session` est en attente d'un accusé de réception d'une trame `SETTINGS` envoyée. Sera `true` après avoir appelé la méthode `http2session.settings()`. Sera `false` une fois que toutes les trames `SETTINGS` envoyées auront été acquittées.

#### `http2session.ping([payload, ]callback)` {#http2sessionpingpayload-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | La transmission d’un rappel non valide à l’argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.9.3 | Ajouté dans : v8.9.3 |
:::

- `payload` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Payload ping optionnel.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envoie une trame `PING` au pair HTTP/2 connecté. Une fonction `callback` doit être fournie. La méthode retournera `true` si le `PING` a été envoyé, `false` sinon.

Le nombre maximal de pings en suspens (non reconnus) est déterminé par l’option de configuration `maxOutstandingPings`. Le maximum par défaut est 10.

Si fourni, le `payload` doit être un `Buffer`, `TypedArray` ou `DataView` contenant 8 octets de données qui seront transmis avec le `PING` et renvoyés avec l’accusé de réception du ping.

Le rappel sera invoqué avec trois arguments : un argument d’erreur qui sera `null` si le `PING` a été correctement acquitté, un argument `duration` qui indique le nombre de millisecondes écoulées depuis l’envoi du ping et la réception de l’accusé de réception, et un `Buffer` contenant la charge utile `PING` de 8 octets.

```js [ESM]
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});
```
Si l’argument `payload` n’est pas spécifié, la charge utile par défaut sera l’horodatage 64 bits (little endian) marquant le début de la durée `PING`.


#### `http2session.ref()` {#http2sessionref}

**Ajouté dans la version : v9.4.0**

Appelle [`ref()`](/fr/nodejs/api/net#socketref) sur le [`net.Socket`](/fr/nodejs/api/net#class-netsocket) sous-jacent de cette instance `Http2Session`.

#### `http2session.remoteSettings` {#http2sessionremotesettings}

**Ajouté dans la version : v8.4.0**

- [\<Objet de paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object)

Un objet sans prototype décrivant les paramètres distants actuels de cette `Http2Session`. Les paramètres distants sont définis par le pair HTTP/2 *connecté*.

#### `http2session.setLocalWindowSize(windowSize)` {#http2sessionsetlocalwindowsizewindowsize}

**Ajouté dans la version : v15.3.0, v14.18.0**

- `windowSize` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)

Définit la taille de la fenêtre de l'endpoint local. La `windowSize` est la taille totale de la fenêtre à définir, pas le delta.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```
:::

Pour les clients http2, l'événement approprié est soit `'connect'` soit `'remoteSettings'`.

#### `http2session.setTimeout(msecs, callback)` {#http2sessionsettimeoutmsecs-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | La transmission d'un rappel invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Ajouté dans la version : v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)

Utilisé pour définir une fonction de rappel qui est appelée lorsqu'il n'y a aucune activité sur le `Http2Session` après `msecs` millisecondes. Le `callback` donné est enregistré en tant qu'écouteur sur l'événement `'timeout'`.


#### `http2session.socket` {#http2sessionsocket}

**Ajouté dans : v8.4.0**

- [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket)

Renvoie un objet `Proxy` qui agit comme un `net.Socket` (ou `tls.TLSSocket`) mais limite les méthodes disponibles à celles qui peuvent être utilisées en toute sécurité avec HTTP/2.

`destroy`, `emit`, `end`, `pause`, `read`, `resume` et `write` lèveront une erreur avec le code `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Voir [`Http2Session` et Sockets](/fr/nodejs/api/http2#http2session-and-sockets) pour plus d'informations.

La méthode `setTimeout` sera appelée sur cette `Http2Session`.

Toutes les autres interactions seront routées directement vers le socket.

#### `http2session.state` {#http2sessionstate}

**Ajouté dans : v8.4.0**

Fournit des informations diverses sur l'état actuel de la `Http2Session`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `effectiveLocalWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille actuelle de la fenêtre de contrôle de flux locale (de réception) pour la `Http2Session`.
    - `effectiveRecvDataLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre actuel d'octets qui ont été reçus depuis le dernier `WINDOW_UPDATE` de contrôle de flux.
    - `nextStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'identifiant numérique à utiliser la prochaine fois qu'un nouveau `Http2Stream` est créé par cette `Http2Session`.
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets que le pair distant peut envoyer sans recevoir un `WINDOW_UPDATE`.
    - `lastProcStreamID` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID numérique du `Http2Stream` pour lequel une trame `HEADERS` ou `DATA` a été reçue le plus récemment.
    - `remoteWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets que cette `Http2Session` peut envoyer sans recevoir un `WINDOW_UPDATE`.
    - `outboundQueueSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de trames actuellement dans la file d'attente sortante pour cette `Http2Session`.
    - `deflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille actuelle en octets de la table d'état de compression d'en-tête sortante.
    - `inflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille actuelle en octets de la table d'état de compression d'en-tête entrante.

Un objet décrivant l'état actuel de cette `Http2Session`.


#### `http2session.settings([settings][, callback])` {#http2sessionsettingssettings-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Ajoutée dans : v8.4.0 |
:::

- `settings` [\<Objet Paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback appelée une fois que la session est connectée ou immédiatement si la session est déjà connectée.
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
    - `settings` [\<Objet Paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object) L'objet `settings` mis à jour.
    - `duration` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Met à jour les paramètres locaux actuels pour cette `Http2Session` et envoie une nouvelle frame `SETTINGS` au pair HTTP/2 connecté.

Une fois appelée, la propriété `http2session.pendingSettingsAck` sera `true` tant que la session attendra que le pair distant accuse réception des nouveaux paramètres.

Les nouveaux paramètres ne deviendront effectifs qu'une fois que l'accusé de réception `SETTINGS` sera reçu et que l'événement `'localSettings'` sera émis. Il est possible d'envoyer plusieurs frames `SETTINGS` pendant que l'accusé de réception est toujours en attente.

#### `http2session.type` {#http2sessiontype}

**Ajoutée dans : v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`http2session.type` sera égal à `http2.constants.NGHTTP2_SESSION_SERVER` si cette instance de `Http2Session` est un serveur, et `http2.constants.NGHTTP2_SESSION_CLIENT` si l'instance est un client.

#### `http2session.unref()` {#http2sessionunref}

**Ajoutée dans : v9.4.0**

Appelle [`unref()`](/fr/nodejs/api/net#socketunref) sur le [`net.Socket`](/fr/nodejs/api/net#class-netsocket) sous-jacent de cette instance de `Http2Session`.


### Classe : `ServerHttp2Session` {#class-serverhttp2session}

**Ajouté dans : v8.4.0**

- Hérite de : [\<Http2Session\>](/fr/nodejs/api/http2#class-http2session)

#### `serverhttp2session.altsvc(alt, originOrStream)` {#serverhttp2sessionaltsvcalt-originorstream}

**Ajouté dans : v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une description de la configuration du service alternatif telle que définie par la [RFC 7838](https://tools.ietf.org/html/rfc7838).
- `originOrStream` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Soit une chaîne URL spécifiant l’origine (ou un `Object` avec une propriété `origin`), soit l’identifiant numérique d’un `Http2Stream` actif tel que donné par la propriété `http2stream.id`.

Soumet une trame `ALTSVC` (telle que définie par la [RFC 7838](https://tools.ietf.org/html/rfc7838)) au client connecté.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```js [CJS]
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```
:::

L’envoi d’une trame `ALTSVC` avec un ID de flux spécifique indique que le service alternatif est associé à l’origine du `Http2Stream` donné.

Les chaînes `alt` et d’origine *doivent* contenir uniquement des octets ASCII et sont interprétées strictement comme une séquence d’octets ASCII. La valeur spéciale `'clear'` peut être transmise pour effacer tout service alternatif précédemment défini pour un domaine donné.

Lorsqu’une chaîne est passée pour l’argument `originOrStream`, elle sera analysée comme une URL et l’origine en sera dérivée. Par exemple, l’origine de l’URL HTTP `'https://example.org/foo/bar'` est la chaîne ASCII `'https://example.org'`. Une erreur sera renvoyée si la chaîne donnée ne peut pas être analysée comme une URL ou si une origine valide ne peut pas être dérivée.

Un objet `URL`, ou tout objet avec une propriété `origin`, peut être passé en tant que `originOrStream`, auquel cas la valeur de la propriété `origin` sera utilisée. La valeur de la propriété `origin` *doit* être une origine ASCII correctement sérialisée.


#### Spécification de services alternatifs {#specifying-alternative-services}

Le format du paramètre `alt` est strictement défini par la [RFC 7838](https://tools.ietf.org/html/rfc7838) comme une chaîne ASCII contenant une liste d'éléments "alternatifs" séparés par des virgules, associés à un hôte et un port spécifiques.

Par exemple, la valeur `'h2="example.org:81"'` indique que le protocole HTTP/2 est disponible sur l'hôte `'example.org'` sur le port TCP/IP 81. L'hôte et le port *doivent* être contenus entre guillemets (`"`).

Plusieurs alternatives peuvent être spécifiées, par exemple : `'h2="example.org:81", h2=":82"'`.

L'identifiant de protocole (`'h2'` dans les exemples) peut être n'importe quel [ID de protocole ALPN](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids) valide.

La syntaxe de ces valeurs n'est pas validée par l'implémentation Node.js et est transmise telle quelle, fournie par l'utilisateur ou reçue du pair.

#### `serverhttp2session.origin(...origins)` {#serverhttp2sessionoriginorigins}

**Ajoutée dans : v10.12.0**

- `origins` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Une ou plusieurs chaînes URL transmises comme arguments séparés.

Soumet un frame `ORIGIN` (tel que défini par la [RFC 8336](https://tools.ietf.org/html/rfc8336)) au client connecté afin de faire connaître l'ensemble des origines pour lesquelles le serveur est en mesure de fournir des réponses faisant autorité.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```
:::

Lorsqu'une chaîne est transmise comme `origin`, elle sera analysée comme une URL et l'origine sera dérivée. Par exemple, l'origine de l'URL HTTP `'https://example.org/foo/bar'` est la chaîne ASCII `'https://example.org'`. Une erreur sera renvoyée si la chaîne donnée ne peut pas être analysée comme une URL ou si une origine valide ne peut pas être dérivée.

Un objet `URL`, ou tout objet avec une propriété `origin`, peut être transmis comme `origin`, auquel cas la valeur de la propriété `origin` sera utilisée. La valeur de la propriété `origin` *doit* être une origine ASCII correctement sérialisée.

Alternativement, l'option `origins` peut être utilisée lors de la création d'un nouveau serveur HTTP/2 à l'aide de la méthode `http2.createSecureServer()` :

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```
:::


### Class: `ClientHttp2Session` {#class-clienthttp2session}

**Ajouté dans: v8.4.0**

- Hérite de: [\<Http2Session\>](/fr/nodejs/api/http2#class-http2session)

#### Événement: `'altsvc'` {#event-altsvc}

**Ajouté dans: v9.4.0**

- `alt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `streamId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'événement `'altsvc'` est émis chaque fois qu'une trame `ALTSVC` est reçue par le client. L'événement est émis avec la valeur `ALTSVC`, l'origine et l'ID du flux. Si aucune `origin` n'est fournie dans la trame `ALTSVC`, `origin` sera une chaîne vide.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```
:::

#### Événement: `'origin'` {#event-origin}

**Ajouté dans: v10.12.0**

- `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'événement `'origin'` est émis chaque fois qu'une trame `ORIGIN` est reçue par le client. L'événement est émis avec un tableau de chaînes `origin`. `http2session.originSet` sera mis à jour pour inclure les origines reçues.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```
:::

L'événement `'origin'` n'est émis que lors de l'utilisation d'une connexion TLS sécurisée.


#### `clienthttp2session.request(headers[, options])` {#clienthttp2sessionrequestheaders-options}

**Ajouté dans: v8.4.0**

-  `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)
-  `options` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le côté *inscriptible* du `Http2Stream` doit être fermé initialement, comme lors de l'envoi d'une requête `GET` qui ne doit pas attendre un corps de payload.
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true` et que `parent` identifie un flux parent, le flux créé devient la seule dépendance directe du parent, et toutes les autres dépendances existantes deviennent des dépendances du flux nouvellement créé. **Par défaut:** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie l'identifiant numérique d'un flux dont dépend le flux nouvellement créé.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie la dépendance relative d'un flux par rapport aux autres flux ayant le même `parent`. La valeur est un nombre compris entre `1` et `256` (inclus).
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, le `Http2Stream` émettra l'événement `'wantTrailers'` après que la dernière trame `DATA` ait été envoyée.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un AbortSignal qui peut être utilisé pour abandonner une requête en cours.

-  Retourne : [\<ClientHttp2Stream\>](/fr/nodejs/api/http2#class-clienthttp2stream)

Uniquement pour les instances `Http2Session` du client HTTP/2, `http2session.request()` crée et retourne une instance `Http2Stream` qui peut être utilisée pour envoyer une requête HTTP/2 au serveur connecté.

Lorsqu'une `ClientHttp2Session` est créée pour la première fois, le socket peut ne pas être encore connecté. Si `clienthttp2session.request()` est appelé pendant ce temps, la requête réelle sera différée jusqu'à ce que le socket soit prêt à fonctionner. Si la `session` est fermée avant que la requête réelle ne soit exécutée, une erreur `ERR_HTTP2_GOAWAY_SESSION` est levée.

Cette méthode n'est disponible que si `http2session.type` est égal à `http2.constants.NGHTTP2_SESSION_CLIENT`.

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```js [CJS]
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```
:::

Lorsque l'option `options.waitForTrailers` est définie, l'événement `'wantTrailers'` est émis immédiatement après avoir mis en file d'attente le dernier bloc de données de payload à envoyer. La méthode `http2stream.sendTrailers()` peut alors être appelée pour envoyer des en-têtes de fin au pair.

Lorsque `options.waitForTrailers` est défini, le `Http2Stream` ne se fermera pas automatiquement lorsque la trame `DATA` finale est transmise. Le code utilisateur doit appeler `http2stream.sendTrailers()` ou `http2stream.close()` pour fermer le `Http2Stream`.

Lorsque `options.signal` est défini avec un `AbortSignal` et que `abort` est appelé sur le `AbortController` correspondant, la requête émettra un événement `'error'` avec une erreur `AbortError`.

Les pseudo-en-têtes `:method` et `:path` ne sont pas spécifiés dans `headers`, ils sont respectivement définis par défaut sur :

- `:method` = `'GET'`
- `:path` = `/`


### Classe : `Http2Stream` {#class-http2stream}

**Ajouté dans : v8.4.0**

- Hérite : [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Chaque instance de la classe `Http2Stream` représente un flux de communications HTTP/2 bidirectionnel via une instance de `Http2Session`. Une seule `Http2Session` peut avoir jusqu’à 2-1 instances de `Http2Stream` au cours de sa durée de vie.

Le code utilisateur ne construira pas directement les instances de `Http2Stream`. Au contraire, celles-ci sont créées, gérées et fournies au code utilisateur via l’instance de `Http2Session`. Sur le serveur, les instances de `Http2Stream` sont créées soit en réponse à une requête HTTP entrante (et transmises au code utilisateur via l’événement `'stream'`), soit en réponse à un appel à la méthode `http2stream.pushStream()`. Sur le client, les instances de `Http2Stream` sont créées et renvoyées lorsque la méthode `http2session.request()` est appelée, soit en réponse à un événement `'push'` entrant.

La classe `Http2Stream` est une base pour les classes [`ServerHttp2Stream`](/fr/nodejs/api/http2#class-serverhttp2stream) et [`ClientHttp2Stream`](/fr/nodejs/api/http2#class-clienthttp2stream), chacune étant utilisée spécifiquement par le Server ou le Client, respectivement.

Toutes les instances de `Http2Stream` sont des flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex). Le côté `Writable` de `Duplex` est utilisé pour envoyer des données au pair connecté, tandis que le côté `Readable` est utilisé pour recevoir les données envoyées par le pair connecté.

L’encodage de caractères de texte par défaut pour un `Http2Stream` est UTF-8. Lors de l’utilisation d’un `Http2Stream` pour envoyer du texte, utilisez l’en-tête `'content-type'` pour définir l’encodage des caractères.

```js [ESM]
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```
#### Cycle de vie de `Http2Stream` {#http2stream-lifecycle}

##### Création {#creation}

Côté serveur, les instances de [`ServerHttp2Stream`](/fr/nodejs/api/http2#class-serverhttp2stream) sont créées lorsque :

- Une nouvelle trame `HEADERS` HTTP/2 avec un ID de flux inutilisé précédemment est reçue ;
- La méthode `http2stream.pushStream()` est appelée.

Côté client, les instances de [`ClientHttp2Stream`](/fr/nodejs/api/http2#class-clienthttp2stream) sont créées lorsque la méthode `http2session.request()` est appelée.

Sur le client, l’instance de `Http2Stream` renvoyée par `http2session.request()` peut ne pas être immédiatement prête à être utilisée si la `Http2Session` parente n’a pas encore été entièrement établie. Dans ce cas, les opérations appelées sur `Http2Stream` seront mises en mémoire tampon jusqu’à ce que l’événement `'ready'` soit émis. Le code utilisateur devrait rarement, voire jamais, avoir besoin de gérer directement l’événement `'ready'`. L’état prêt d’un `Http2Stream` peut être déterminé en vérifiant la valeur de `http2stream.id`. Si la valeur est `undefined`, le flux n’est pas encore prêt à être utilisé.


##### Destruction {#destruction}

Toutes les instances de [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) sont détruites soit lorsque :

- Une trame `RST_STREAM` pour le flux est reçue par le pair connecté, et (pour les flux clients uniquement) les données en attente ont été lues.
- La méthode `http2stream.close()` est appelée, et (pour les flux clients uniquement) les données en attente ont été lues.
- Les méthodes `http2stream.destroy()` ou `http2session.destroy()` sont appelées.

Lorsqu'une instance `Http2Stream` est détruite, une tentative sera faite pour envoyer une trame `RST_STREAM` au pair connecté.

Lorsque l'instance `Http2Stream` est détruite, l'événement `'close'` sera émis. Parce que `Http2Stream` est une instance de `stream.Duplex`, l'événement `'end'` sera également émis si les données du flux sont en cours de transmission. L'événement `'error'` peut également être émis si `http2stream.destroy()` a été appelé avec une `Error` passée comme premier argument.

Une fois que `Http2Stream` a été détruit, la propriété `http2stream.destroyed` sera `true` et la propriété `http2stream.rstCode` spécifiera le code d'erreur `RST_STREAM`. L'instance `Http2Stream` n'est plus utilisable une fois détruite.

#### Événement : `'aborted'` {#event-aborted}

**Ajouté dans : v8.4.0**

L'événement `'aborted'` est émis chaque fois qu'une instance `Http2Stream` est anormalement interrompue en pleine communication. Son écouteur ne s'attend à aucun argument.

L'événement `'aborted'` ne sera émis que si le côté accessible en écriture de `Http2Stream` n'a pas été terminé.

#### Événement : `'close'` {#event-close_1}

**Ajouté dans : v8.4.0**

L'événement `'close'` est émis lorsque `Http2Stream` est détruit. Une fois cet événement émis, l'instance `Http2Stream` n'est plus utilisable.

Le code d'erreur HTTP/2 utilisé lors de la fermeture du flux peut être récupéré à l'aide de la propriété `http2stream.rstCode`. Si le code est une valeur autre que `NGHTTP2_NO_ERROR` (`0`), un événement `'error'` aura également été émis.

#### Événement : `'error'` {#event-error_1}

**Ajouté dans : v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L'événement `'error'` est émis lorsqu'une erreur se produit lors du traitement d'un `Http2Stream`.


#### Événement : `'frameError'` {#event-frameerror_1}

**Ajouté dans : v8.4.0**

- `type` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le type de frame.
- `code` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le code d’erreur.
- `id` [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) L’id du flux (ou `0` si le frame n’est pas associé à un flux).

L’événement `'frameError'` est émis lorsqu’une erreur se produit lors de la tentative d’envoi d’une frame. Lorsqu’elle est appelée, la fonction de gestion recevra un argument entier identifiant le type de frame et un argument entier identifiant le code d’erreur. L’instance `Http2Stream` sera détruite immédiatement après l’émission de l’événement `'frameError'`.

#### Événement : `'ready'` {#event-ready}

**Ajouté dans : v8.4.0**

L’événement `'ready'` est émis lorsque le `Http2Stream` a été ouvert, qu’un `id` lui a été attribué et qu’il peut être utilisé. L’auditeur ne s’attend à aucun argument.

#### Événement : `'timeout'` {#event-timeout_1}

**Ajouté dans : v8.4.0**

L’événement `'timeout'` est émis après qu’aucune activité n’ait été reçue pour ce `Http2Stream` dans le nombre de millisecondes défini à l’aide de `http2stream.setTimeout()`. Son écouteur ne s’attend à aucun argument.

#### Événement : `'trailers'` {#event-trailers}

**Ajouté dans : v8.4.0**

- `headers` [\<Objet d'En-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object) Un objet décrivant les en-têtes
- `flags` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Les drapeaux numériques associés

L’événement `'trailers'` est émis lorsqu’un bloc d’en-têtes associé aux champs d’en-tête de fin est reçu. Le rappel de l’écouteur reçoit l'[Objet d'En-têtes HTTP/2](/fr/nodejs/api/http2#headers-object) et les drapeaux associés aux en-têtes.

Cet événement peut ne pas être émis si `http2stream.end()` est appelé avant que les trailers ne soient reçus et que les données entrantes ne soient pas lues ou écoutées.

```js [ESM]
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### Événement : `'wantTrailers'` {#event-wanttrailers}

**Ajouté dans : v10.0.0**

L'événement `'wantTrailers'` est émis lorsque le `Http2Stream` a mis en file d'attente la dernière trame `DATA` à envoyer sur une trame et que le `Http2Stream` est prêt à envoyer les en-têtes de fin. Lors de l'initiation d'une requête ou d'une réponse, l'option `waitForTrailers` doit être définie pour que cet événement soit émis.

#### `http2stream.aborted` {#http2streamaborted}

**Ajouté dans : v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Défini sur `true` si l'instance `Http2Stream` a été interrompue anormalement. Lorsqu'il est défini, l'événement `'aborted'` aura été émis.

#### `http2stream.bufferSize` {#http2streambuffersize}

**Ajouté dans : v11.2.0, v10.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cette propriété affiche le nombre de caractères actuellement mis en mémoire tampon pour être écrits. Voir [`net.Socket.bufferSize`](/fr/nodejs/api/net#socketbuffersize) pour plus de détails.

#### `http2stream.close(code[, callback])` {#http2streamclosecode-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | La transmission d'un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Entier non signé 32 bits identifiant le code d'erreur. **Par défaut :** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction optionnelle enregistrée pour écouter l'événement `'close'`.

Ferme l'instance `Http2Stream` en envoyant une trame `RST_STREAM` au pair HTTP/2 connecté.

#### `http2stream.closed` {#http2streamclosed}

**Ajouté dans : v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Défini sur `true` si l'instance `Http2Stream` a été fermée.

#### `http2stream.destroyed` {#http2streamdestroyed}

**Ajouté dans : v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Défini sur `true` si l'instance `Http2Stream` a été détruite et n'est plus utilisable.


#### `http2stream.endAfterHeaders` {#http2streamendafterheaders}

**Ajouté dans : v10.11.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Défini sur `true` si l’indicateur `END_STREAM` a été défini dans la trame HEADERS de requête ou de réponse reçue, indiquant qu’aucune donnée supplémentaire ne doit être reçue et que le côté lisible de `Http2Stream` sera fermé.

#### `http2stream.id` {#http2streamid}

**Ajouté dans : v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

L’identifiant numérique de flux de cette instance de `Http2Stream`. Défini sur `undefined` si l’identifiant de flux n’a pas encore été attribué.

#### `http2stream.pending` {#http2streampending}

**Ajouté dans : v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Défini sur `true` si l’instance de `Http2Stream` n’a pas encore reçu d’identifiant de flux numérique.

#### `http2stream.priority(options)` {#http2streampriorityoptions}

**Ajouté dans : v8.4.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true` et que `parent` identifie un flux parent, ce flux devient la seule dépendance directe du parent, tous les autres dépendants existants devenant des dépendants de ce flux. **Par défaut :** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie l’identifiant numérique d’un flux dont ce flux dépend.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie la dépendance relative d’un flux par rapport à d’autres flux avec le même `parent`. La valeur est un nombre compris entre `1` et `256` (inclus).
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, modifie la priorité localement sans envoyer de trame `PRIORITY` à l’homologue connecté.

Met à jour la priorité de cette instance de `Http2Stream`.


#### `http2stream.rstCode` {#http2streamrstcode}

**Ajouté dans : v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Défini sur le [code d'erreur](/fr/nodejs/api/http2#error-codes-for-rst_stream-and-goaway) `RST_STREAM` rapporté lorsque le `Http2Stream` est détruit après avoir reçu une trame `RST_STREAM` du pair connecté, en appelant `http2stream.close()` ou `http2stream.destroy()`. Sera `undefined` si le `Http2Stream` n'a pas été fermé.

#### `http2stream.sentHeaders` {#http2streamsentheaders}

**Ajouté dans : v9.5.0**

- [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)

Un objet contenant les en-têtes sortants envoyés pour ce `Http2Stream`.

#### `http2stream.sentInfoHeaders` {#http2streamsentinfoheaders}

**Ajouté dans : v9.5.0**

- [\<Tableau d'objets d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)

Un tableau d'objets contenant les en-têtes informationnels (additionnels) sortants envoyés pour ce `Http2Stream`.

#### `http2stream.sentTrailers` {#http2streamsenttrailers}

**Ajouté dans : v9.5.0**

- [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)

Un objet contenant les trailers sortants envoyés pour ce `HttpStream`.

#### `http2stream.session` {#http2streamsession}

**Ajouté dans : v8.4.0**

- [\<Http2Session\>](/fr/nodejs/api/http2#class-http2session)

Une référence à l'instance `Http2Session` qui possède ce `Http2Stream`. La valeur sera `undefined` après la destruction de l'instance `Http2Stream`.

#### `http2stream.setTimeout(msecs, callback)` {#http2streamsettimeoutmsecs-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)



::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// Annuler le flux s'il n'y a pas d'activité après 5 secondes
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Annuler le flux s'il n'y a pas d'activité après 5 secondes
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```
:::


#### `http2stream.state` {#http2streamstate}

**Ajouté dans : v8.4.0**

Fournit des informations diverses sur l'état actuel du `Http2Stream`.

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `localWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets que le pair connecté peut envoyer pour ce `Http2Stream` sans recevoir de `WINDOW_UPDATE`.
    - `state` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un drapeau indiquant l'état actuel de bas niveau du `Http2Stream` tel que déterminé par `nghttp2`.
    - `localClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` si ce `Http2Stream` a été fermé localement.
    - `remoteClose` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` si ce `Http2Stream` a été fermé à distance.
    - `sumDependencyWeight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le poids total de toutes les instances `Http2Stream` qui dépendent de ce `Http2Stream` tel que spécifié à l'aide de trames `PRIORITY`.
    - `weight` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le poids de priorité de ce `Http2Stream`.

Un état actuel de ce `Http2Stream`.

#### `http2stream.sendTrailers(headers)` {#http2streamsendtrailersheaders}

**Ajouté dans : v10.0.0**

- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)

Envoie une trame `HEADERS` de fin au pair HTTP/2 connecté. Cette méthode entraînera la fermeture immédiate de `Http2Stream` et ne doit être appelée qu'une fois l'événement `'wantTrailers'` émis. Lors de l'envoi d'une requête ou d'une réponse, l'option `options.waitForTrailers` doit être définie afin de maintenir le `Http2Stream` ouvert après la trame `DATA` finale afin que les trailers puissent être envoyés.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```
:::

La spécification HTTP/1 interdit aux trailers de contenir des champs de pseudo-en-tête HTTP/2 (par exemple, `':method'`, `':path'`, etc.).


### Classe : `ClientHttp2Stream` {#class-clienthttp2stream}

**Ajoutée dans : v8.4.0**

- Étend [\<Http2Stream\>](/fr/nodejs/api/http2#class-http2stream)

La classe `ClientHttp2Stream` est une extension de `Http2Stream` qui est utilisée exclusivement sur les clients HTTP/2. Les instances `Http2Stream` sur le client fournissent des événements tels que `'response'` et `'push'` qui ne sont pertinents que sur le client.

#### Événement : `'continue'` {#event-continue}

**Ajoutée dans : v8.5.0**

Émis lorsque le serveur envoie un statut `100 Continue`, généralement parce que la requête contenait `Expect: 100-continue`. Ceci est une instruction indiquant que le client doit envoyer le corps de la requête.

#### Événement : `'headers'` {#event-headers}

**Ajoutée dans : v8.4.0**

- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'événement `'headers'` est émis lorsqu'un bloc supplémentaire d'en-têtes est reçu pour un flux, par exemple lorsqu'un bloc d'en-têtes informationnels `1xx` est reçu. Le rappel de l'écouteur reçoit l'[Objet d'en-têtes HTTP/2](/fr/nodejs/api/http2#headers-object) et les indicateurs associés aux en-têtes.

```js [ESM]
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```
#### Événement : `'push'` {#event-push}

**Ajoutée dans : v8.4.0**

- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'événement `'push'` est émis lorsque les en-têtes de réponse pour un flux Server Push sont reçus. Le rappel de l'écouteur reçoit l'[Objet d'en-têtes HTTP/2](/fr/nodejs/api/http2#headers-object) et les indicateurs associés aux en-têtes.

```js [ESM]
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```
#### Événement : `'response'` {#event-response}

**Ajoutée dans : v8.4.0**

- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

L'événement `'response'` est émis lorsqu'une trame `HEADERS` de réponse a été reçue pour ce flux depuis le serveur HTTP/2 connecté. L'écouteur est invoqué avec deux arguments : un `Object` contenant l'[Objet d'en-têtes HTTP/2](/fr/nodejs/api/http2#headers-object) reçu, et les indicateurs associés aux en-têtes.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```
:::


### Classe : `ServerHttp2Stream` {#class-serverhttp2stream}

**Ajouté dans : v8.4.0**

- Hérite de : [\<Http2Stream\>](/fr/nodejs/api/http2#class-http2stream)

La classe `ServerHttp2Stream` est une extension de [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) qui est utilisée exclusivement sur les serveurs HTTP/2. Les instances `Http2Stream` sur le serveur fournissent des méthodes supplémentaires telles que `http2stream.pushStream()` et `http2stream.respond()` qui ne sont pertinentes que sur le serveur.

#### `http2stream.additionalHeaders(headers)` {#http2streamadditionalheadersheaders}

**Ajouté dans : v8.4.0**

- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)

Envoie une trame `HEADERS` d'information supplémentaire au pair HTTP/2 connecté.

#### `http2stream.headersSent` {#http2streamheaderssent}

**Ajouté dans : v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Vrai si les en-têtes ont été envoyés, faux sinon (lecture seule).

#### `http2stream.pushAllowed` {#http2streampushallowed}

**Ajouté dans : v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Propriété en lecture seule mappée au drapeau `SETTINGS_ENABLE_PUSH` de la trame `SETTINGS` la plus récente du client distant. Sera `true` si le pair distant accepte les flux push, `false` sinon. Les paramètres sont les mêmes pour chaque `Http2Stream` dans la même `Http2Session`.

#### `http2stream.pushStream(headers[, options], callback)` {#http2streampushstreamheaders-options-callback}

::: info [Historique]
| Version | Changements |
| --- | --- |
| v18.0.0 | Le passage d'un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true` et que `parent` identifie un Stream parent, le flux créé devient la seule dépendance directe du parent, tous les autres dépendants existants devenant dépendants du flux nouvellement créé. **Par défaut :** `false`.
    - `parent` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Spécifie l'identifiant numérique d'un flux dont dépend le flux nouvellement créé.

- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback appelé une fois que le flux push a été initié.
    - `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `pushStream` [\<ServerHttp2Stream\>](/fr/nodejs/api/http2#class-serverhttp2stream) L'objet `pushStream` retourné.
    - `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object) Objet d'en-têtes avec lequel le `pushStream` a été initié.

Lance un flux push. Le callback est invoqué avec la nouvelle instance `Http2Stream` créée pour le flux push passée comme second argument, ou une `Error` passée comme premier argument.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```
:::

Définir le poids d'un flux push n'est pas autorisé dans la trame `HEADERS`. Passez une valeur `weight` à `http2stream.priority` avec l'option `silent` définie sur `true` pour activer l'équilibrage de la bande passante côté serveur entre les flux concurrents.

Appeler `http2stream.pushStream()` depuis un flux push n'est pas autorisé et lèvera une erreur.


#### `http2stream.respond([headers[, options]])` {#http2streamrespondheaders-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0, v12.19.0 | Autoriser la définition explicite des en-têtes de date. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)
- `options` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définir sur `true` pour indiquer que la réponse n'inclura pas de données de charge utile.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, le `Http2Stream` émettra l'événement `'wantTrailers'` après que la dernière trame `DATA` ait été envoyée.
  
 



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```
:::

Initie une réponse. Lorsque l'option `options.waitForTrailers` est définie, l'événement `'wantTrailers'` sera émis immédiatement après avoir mis en file d'attente le dernier bloc de données de charge utile à envoyer. La méthode `http2stream.sendTrailers()` peut ensuite être utilisée pour envoyer des champs d'en-tête de fin au pair.

Lorsque `options.waitForTrailers` est défini, le `Http2Stream` ne se fermera pas automatiquement lorsque la dernière trame `DATA` est transmise. Le code utilisateur doit appeler `http2stream.sendTrailers()` ou `http2stream.close()` pour fermer le `Http2Stream`.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```
:::


#### `http2stream.respondWithFD(fd[, headers[, options]])` {#http2streamrespondwithfdfd-headers-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0, v12.19.0 | Autoriser la définition explicite des en-têtes de date. |
| v12.12.0 | L'option `fd` peut maintenant être un `FileHandle`. |
| v10.0.0 | Tout descripteur de fichier lisible, pas nécessairement pour un fichier régulier, est maintenant pris en charge. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/fr/nodejs/api/fs#class-filehandle) Un descripteur de fichier lisible.
- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, le `Http2Stream` émet l'événement `'wantTrailers'` après l'envoi de la dernière trame `DATA`.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La position de décalage à partir de laquelle commencer la lecture.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantité de données du fd à envoyer.


Lance une réponse dont les données sont lues à partir du descripteur de fichier donné. Aucune validation n'est effectuée sur le descripteur de fichier donné. Si une erreur se produit lors de la tentative de lecture des données à l'aide du descripteur de fichier, le `Http2Stream` sera fermé à l'aide d'une trame `RST_STREAM` utilisant le code standard `INTERNAL_ERROR`.

Lorsqu'elle est utilisée, l'interface `Duplex` de l'objet `Http2Stream` est fermée automatiquement.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```
:::

La fonction `options.statCheck` facultative peut être spécifiée pour donner au code utilisateur la possibilité de définir des en-têtes de contenu supplémentaires en fonction des détails `fs.Stat` du fd donné. Si la fonction `statCheck` est fournie, la méthode `http2stream.respondWithFD()` effectuera un appel `fs.fstat()` pour collecter des informations sur le descripteur de fichier fourni.

Les options `offset` et `length` peuvent être utilisées pour limiter la réponse à un sous-ensemble de plage spécifique. Cela peut être utilisé, par exemple, pour prendre en charge les demandes HTTP Range.

Le descripteur de fichier ou `FileHandle` n'est pas fermé lorsque le flux est fermé, il devra donc être fermé manuellement une fois qu'il n'est plus nécessaire. L'utilisation simultanée du même descripteur de fichier pour plusieurs flux n'est pas prise en charge et peut entraîner une perte de données. La réutilisation d'un descripteur de fichier une fois qu'un flux est terminé est prise en charge.

Lorsque l'option `options.waitForTrailers` est définie, l'événement `'wantTrailers'` sera émis immédiatement après la mise en file d'attente du dernier bloc de données de charge utile à envoyer. La méthode `http2stream.sendTrailers()` peut ensuite être utilisée pour envoyer des champs d'en-tête de fin au pair.

Lorsque `options.waitForTrailers` est défini, le `Http2Stream` ne se fermera pas automatiquement lorsque la trame `DATA` finale est transmise. Le code utilisateur *doit* appeler `http2stream.sendTrailers()` ou `http2stream.close()` pour fermer le `Http2Stream`.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```
:::


#### `http2stream.respondWithFile(path[, headers[, options]])` {#http2streamrespondwithfilepath-headers-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0, v12.19.0 | Autorise la définition explicite des en-têtes de date. |
| v10.0.0 | Tout fichier lisible, pas nécessairement un fichier régulier, est maintenant pris en charge. |
| v8.4.0 | Ajoutée dans : v8.4.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `headers` [\<Objet d'En-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `statCheck` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `onError` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction de rappel invoquée en cas d'erreur avant l'envoi.
    - `waitForTrailers` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, le `Http2Stream` émettra l'événement `'wantTrailers'` après l'envoi de la dernière trame `DATA`.
    - `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La position de décalage à partir de laquelle commencer la lecture.
    - `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantité de données du descripteur de fichier à envoyer.

Envoie un fichier régulier comme réponse. Le `path` doit spécifier un fichier régulier, sinon un événement `'error'` sera émis sur l'objet `Http2Stream`.

Lorsqu'elle est utilisée, l'interface `Duplex` de l'objet `Http2Stream` sera fermée automatiquement.

La fonction optionnelle `options.statCheck` peut être spécifiée pour donner au code utilisateur la possibilité de définir des en-têtes de contenu supplémentaires basés sur les détails `fs.Stat` du fichier donné :

Si une erreur se produit lors de la tentative de lecture des données du fichier, le `Http2Stream` sera fermé à l'aide d'une trame `RST_STREAM` utilisant le code `INTERNAL_ERROR` standard. Si le rappel `onError` est défini, il sera appelé. Sinon, le flux sera détruit.

Exemple utilisant un chemin de fichier :

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() peut lever une exception si le flux a été détruit par
    // l'autre côté.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Effectuer la gestion réelle des erreurs.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() peut lever une exception si le flux a été détruit par
    // l'autre côté.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Effectuer la gestion réelle des erreurs.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```
:::

La fonction `options.statCheck` peut également être utilisée pour annuler l'opération d'envoi en renvoyant `false`. Par exemple, une requête conditionnelle peut vérifier les résultats stat pour déterminer si le fichier a été modifié afin de renvoyer une réponse `304` appropriée :

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Vérifier le stat ici...
    stream.respond({ ':status': 304 });
    return false; // Annuler l'opération d'envoi
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Vérifier le stat ici...
    stream.respond({ ':status': 304 });
    return false; // Annuler l'opération d'envoi
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```
:::

Le champ d'en-tête `content-length` sera automatiquement défini.

Les options `offset` et `length` peuvent être utilisées pour limiter la réponse à un sous-ensemble de plage spécifique. Ceci peut être utilisé, par exemple, pour prendre en charge les requêtes de plage HTTP.

La fonction `options.onError` peut également être utilisée pour gérer toutes les erreurs qui pourraient se produire avant le début de la livraison du fichier. Le comportement par défaut consiste à détruire le flux.

Lorsque l'option `options.waitForTrailers` est définie, l'événement `'wantTrailers'` sera émis immédiatement après la mise en file d'attente du dernier morceau de données de charge utile à envoyer. La méthode `http2stream.sendTrailers()` peut ensuite être utilisée pour envoyer des champs d'en-tête de fin au pair.

Lorsque `options.waitForTrailers` est défini, le `Http2Stream` ne se fermera pas automatiquement lorsque la trame `DATA` finale est transmise. Le code utilisateur doit appeler `http2stream.sendTrailers()` ou `http2stream.close()` pour fermer le `Http2Stream`.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```
:::


### Classe : `Http2Server` {#class-http2server}

**Ajouté dans : v8.4.0**

- Hérite de : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Les instances de `Http2Server` sont créées à l'aide de la fonction `http2.createServer()`. La classe `Http2Server` n'est pas directement exportée par le module `node:http2`.

#### Événement : `'checkContinue'` {#event-checkcontinue}

**Ajouté dans : v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/fr/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/fr/nodejs/api/http2#class-http2http2serverresponse)

Si un écouteur [`'request'`](/fr/nodejs/api/http2#event-request) est enregistré ou si [`http2.createServer()`](/fr/nodejs/api/http2#http2createserveroptions-onrequesthandler) reçoit une fonction de callback, l'événement `'checkContinue'` est émis chaque fois qu'une requête avec un `Expect : 100-continue` HTTP est reçue. Si cet événement n'est pas écouté, le serveur répondra automatiquement avec un statut `100 Continue` comme il convient.

La gestion de cet événement implique d'appeler [`response.writeContinue()`](/fr/nodejs/api/http2#responsewritecontinue) si le client doit continuer à envoyer le corps de la requête, ou de générer une réponse HTTP appropriée (par exemple, 400 Bad Request) si le client ne doit pas continuer à envoyer le corps de la requête.

Lorsque cet événement est émis et géré, l'événement [`'request'`](/fr/nodejs/api/http2#event-request) n'est pas émis.

#### Événement : `'connection'` {#event-connection}

**Ajouté dans : v8.4.0**

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Cet événement est émis lorsqu'un nouveau flux TCP est établi. `socket` est généralement un objet de type [`net.Socket`](/fr/nodejs/api/net#class-netsocket). Généralement, les utilisateurs ne souhaitent pas accéder à cet événement.

Cet événement peut également être émis explicitement par les utilisateurs pour injecter des connexions dans le serveur HTTP. Dans ce cas, tout flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) peut être passé.

#### Événement : `'request'` {#event-request}

**Ajouté dans : v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/fr/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/fr/nodejs/api/http2#class-http2http2serverresponse)

Émis chaque fois qu'il y a une requête. Il peut y avoir plusieurs requêtes par session. Voir l'[API de compatibilité](/fr/nodejs/api/http2#compatibility-api).


#### Événement : `'session'` {#event-session}

**Ajouté dans : v8.4.0**

- `session` [\<ServerHttp2Session\>](/fr/nodejs/api/http2#class-serverhttp2session)

L'événement `'session'` est émis lorsqu'une nouvelle `Http2Session` est créée par le `Http2Server`.

#### Événement : `'sessionError'` {#event-sessionerror}

**Ajouté dans : v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/fr/nodejs/api/http2#class-serverhttp2session)

L'événement `'sessionError'` est émis lorsqu'un événement `'error'` est émis par un objet `Http2Session` associé au `Http2Server`.

#### Événement : `'stream'` {#event-stream_1}

**Ajouté dans : v8.4.0**

- `stream` [\<Http2Stream\>](/fr/nodejs/api/http2#class-http2stream) Une référence au flux
- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object) Un objet décrivant les en-têtes
- `flags` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Les indicateurs numériques associés
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau contenant les noms d'en-tête bruts suivis de leurs valeurs respectives.

L'événement `'stream'` est émis lorsqu'un événement `'stream'` a été émis par une `Http2Session` associée au serveur.

Voir aussi l'événement `'stream'` de [`Http2Session`](/fr/nodejs/api/http2#event-stream).

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Événement : `'timeout'` {#event-timeout_2}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Le délai d’attente par défaut est passé de 120s à 0 (pas de délai d’attente). |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

L’événement `'timeout'` est émis lorsqu’il n’y a aucune activité sur le Server pendant un certain nombre de millisecondes définies à l’aide de `http2server.setTimeout()`. **Par défaut :** 0 (pas de délai d’attente)

#### `server.close([callback])` {#serverclosecallback}

**Ajouté dans : v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Empêche le serveur d’établir de nouvelles sessions. Cela n’empêche pas la création de nouveaux flux de requêtes en raison de la nature persistante des sessions HTTP/2. Pour arrêter correctement le serveur, appelez [`http2session.close()`](/fr/nodejs/api/http2#http2sessionclosecallback) sur toutes les sessions actives.

Si `callback` est fourni, il n’est pas appelé tant que toutes les sessions actives n’ont pas été fermées, bien que le serveur ait déjà cessé d’autoriser de nouvelles sessions. Voir [`net.Server.close()`](/fr/nodejs/api/net#serverclosecallback) pour plus de détails.

#### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Ajouté dans : v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Appelle [`server.close()`](/fr/nodejs/api/http2#serverclosecallback) et renvoie une promesse qui se réalise lorsque le serveur s’est fermé.

#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d’un rappel non valide à l’argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v13.0.0 | Le délai d’attente par défaut est passé de 120s à 0 (pas de délai d’attente). |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** 0 (pas de délai d’attente)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<Http2Server\>](/fr/nodejs/api/http2#class-http2server)

Utilisé pour définir la valeur de délai d’attente pour les requêtes de serveur http2, et définit une fonction de rappel qui est appelée lorsqu’il n’y a aucune activité sur le `Http2Server` après `msecs` millisecondes.

Le rappel donné est enregistré en tant qu’écouteur sur l’événement `'timeout'`.

Dans le cas où `callback` n’est pas une fonction, une nouvelle erreur `ERR_INVALID_ARG_TYPE` sera levée.


#### `server.timeout` {#servertimeout}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Le délai d'attente par défaut est passé de 120 s à 0 (pas de délai d'attente). |
| v8.4.0 | Ajouté dans: v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Délai d'attente en millisecondes. **Par défaut :** 0 (pas de délai d'attente)

Le nombre de millisecondes d'inactivité avant qu'un socket ne soit présumé avoir expiré.

Une valeur de `0` désactivera le comportement de délai d'attente sur les connexions entrantes.

La logique de délai d'attente du socket est configurée lors de la connexion, donc la modification de cette valeur affecte uniquement les nouvelles connexions au serveur, et non les connexions existantes.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings}

**Ajouté dans : v15.1.0, v14.17.0**

- `settings` [\<Objet de paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object)

Utilisé pour mettre à jour le serveur avec les paramètres fournis.

Lance `ERR_HTTP2_INVALID_SETTING_VALUE` pour les valeurs `settings` non valides.

Lance `ERR_INVALID_ARG_TYPE` pour un argument `settings` non valide.

### Classe : `Http2SecureServer` {#class-http2secureserver}

**Ajouté dans : v8.4.0**

- Étend : [\<tls.Server\>](/fr/nodejs/api/tls#class-tlsserver)

Les instances de `Http2SecureServer` sont créées à l'aide de la fonction `http2.createSecureServer()`. La classe `Http2SecureServer` n'est pas exportée directement par le module `node:http2`.

#### Événement : `'checkContinue'` {#event-checkcontinue_1}

**Ajouté dans : v8.5.0**

- `request` [\<http2.Http2ServerRequest\>](/fr/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/fr/nodejs/api/http2#class-http2http2serverresponse)

Si un écouteur [`'request'`](/fr/nodejs/api/http2#event-request) est enregistré ou si [`http2.createSecureServer()`](/fr/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) reçoit une fonction de rappel, l'événement `'checkContinue'` est émis chaque fois qu'une requête avec un HTTP `Expect: 100-continue` est reçue. Si cet événement n'est pas écouté, le serveur répondra automatiquement avec un statut `100 Continue` de manière appropriée.

La gestion de cet événement implique d'appeler [`response.writeContinue()`](/fr/nodejs/api/http2#responsewritecontinue) si le client doit continuer à envoyer le corps de la requête, ou de générer une réponse HTTP appropriée (par exemple, 400 Bad Request) si le client ne doit pas continuer à envoyer le corps de la requête.

Lorsque cet événement est émis et géré, l'événement [`'request'`](/fr/nodejs/api/http2#event-request) ne sera pas émis.


#### Événement : `'connection'` {#event-connection_1}

**Ajouté dans : v8.4.0**

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Cet événement est émis lorsqu'un nouveau flux TCP est établi, avant que la négociation TLS ne commence. `socket` est généralement un objet de type [`net.Socket`](/fr/nodejs/api/net#class-netsocket). Généralement, les utilisateurs ne voudront pas accéder à cet événement.

Cet événement peut également être émis explicitement par les utilisateurs pour injecter des connexions dans le serveur HTTP. Dans ce cas, tout flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) peut être passé.

#### Événement : `'request'` {#event-request_1}

**Ajouté dans : v8.4.0**

- `request` [\<http2.Http2ServerRequest\>](/fr/nodejs/api/http2#class-http2http2serverrequest)
- `response` [\<http2.Http2ServerResponse\>](/fr/nodejs/api/http2#class-http2http2serverresponse)

Émis chaque fois qu'il y a une requête. Il peut y avoir plusieurs requêtes par session. Voir l'[API de compatibilité](/fr/nodejs/api/http2#compatibility-api).

#### Événement : `'session'` {#event-session_1}

**Ajouté dans : v8.4.0**

- `session` [\<ServerHttp2Session\>](/fr/nodejs/api/http2#class-serverhttp2session)

L'événement `'session'` est émis lorsqu'une nouvelle `Http2Session` est créée par le `Http2SecureServer`.

#### Événement : `'sessionError'` {#event-sessionerror_1}

**Ajouté dans : v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `session` [\<ServerHttp2Session\>](/fr/nodejs/api/http2#class-serverhttp2session)

L'événement `'sessionError'` est émis lorsqu'un événement `'error'` est émis par un objet `Http2Session` associé au `Http2SecureServer`.

#### Événement : `'stream'` {#event-stream_2}

**Ajouté dans : v8.4.0**

- `stream` [\<Http2Stream\>](/fr/nodejs/api/http2#class-http2stream) Une référence au flux
- `headers` [\<HTTP/2 Headers Object\>](/fr/nodejs/api/http2#headers-object) Un objet décrivant les en-têtes
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Les indicateurs numériques associés
- `rawHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau contenant les noms d'en-tête bruts suivis de leurs valeurs respectives.

L'événement `'stream'` est émis lorsqu'un événement `'stream'` a été émis par un `Http2Session` associé au serveur.

Voir aussi l'événement `'stream'` de [`Http2Session`](/fr/nodejs/api/http2#event-stream).

::: code-group
```js [ESM]
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```js [CJS]
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```
:::


#### Événement : `'timeout'` {#event-timeout_3}

**Ajouté dans : v8.4.0**

L'événement `'timeout'` est émis lorsqu'il n'y a aucune activité sur le serveur pendant un certain nombre de millisecondes défini à l'aide de `http2secureServer.setTimeout()`. **Par défaut :** 2 minutes.

#### Événement : `'unknownProtocol'` {#event-unknownprotocol}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | Cet événement ne sera émis que si le client n'a pas transmis d'extension ALPN pendant la négociation TLS. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

L'événement `'unknownProtocol'` est émis lorsqu'un client qui se connecte ne parvient pas à négocier un protocole autorisé (c'est-à-dire HTTP/2 ou HTTP/1.1). Le gestionnaire d'événements reçoit le socket à gérer. Si aucun écouteur n'est enregistré pour cet événement, la connexion est interrompue. Un délai d'attente peut être spécifié à l'aide de l'option `'unknownProtocolTimeout'` transmise à [`http2.createSecureServer()`](/fr/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler).

Dans les versions antérieures de Node.js, cet événement était émis si `allowHTTP1` est `false` et, pendant la négociation TLS, le client n'envoie pas d'extension ALPN ou envoie une extension ALPN qui n'inclut pas HTTP/2 (`h2`). Les versions plus récentes de Node.js n'émettent cet événement que si `allowHTTP1` est `false` et que le client n'envoie pas d'extension ALPN. Si le client envoie une extension ALPN qui n'inclut pas HTTP/2 (ou HTTP/1.1 si `allowHTTP1` est `true`), la négociation TLS échouera et aucune connexion sécurisée ne sera établie.

Voir l'[API de compatibilité](/fr/nodejs/api/http2#compatibility-api).

#### `server.close([callback])` {#serverclosecallback_1}

**Ajouté dans : v8.4.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Empêche le serveur d'établir de nouvelles sessions. Cela n'empêche pas la création de nouveaux flux de requêtes en raison de la nature persistante des sessions HTTP/2. Pour arrêter correctement le serveur, appelez [`http2session.close()`](/fr/nodejs/api/http2#http2sessionclosecallback) sur toutes les sessions actives.

Si `callback` est fourni, il n'est pas invoqué tant que toutes les sessions actives n'ont pas été fermées, bien que le serveur ait déjà cessé d'autoriser de nouvelles sessions. Voir [`tls.Server.close()`](/fr/nodejs/api/tls#serverclosecallback) pour plus de détails.


#### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback_1}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Ajoutée dans : v8.4.0 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `120000` (2 minutes)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<Http2SecureServer\>](/fr/nodejs/api/http2#class-http2secureserver)

Utilisée pour définir la valeur de timeout pour les requêtes de serveur sécurisé http2, et définit une fonction de callback qui est appelée lorsqu'il n'y a aucune activité sur le `Http2SecureServer` après `msecs` millisecondes.

Le callback donné est enregistré en tant qu'écouteur sur l'événement `'timeout'`.

Si `callback` n'est pas une fonction, une nouvelle erreur `ERR_INVALID_ARG_TYPE` sera levée.

#### `server.timeout` {#servertimeout_1}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Le timeout par défaut est passé de 120s à 0 (pas de timeout). |
| v8.4.0 | Ajoutée dans : v8.4.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout en millisecondes. **Par défaut :** 0 (pas de timeout)

Le nombre de millisecondes d'inactivité avant qu'un socket ne soit présumé avoir expiré.

Une valeur de `0` désactivera le comportement de timeout sur les connexions entrantes.

La logique de timeout du socket est mise en place lors de la connexion, donc changer cette valeur affecte uniquement les nouvelles connexions au serveur, pas les connexions existantes.

#### `server.updateSettings([settings])` {#serverupdatesettingssettings_1}

**Ajoutée dans : v15.1.0, v14.17.0**

- `settings` [\<Objet de paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object)

Utilisée pour mettre à jour le serveur avec les paramètres fournis.

Lève `ERR_HTTP2_INVALID_SETTING_VALUE` pour les valeurs `settings` invalides.

Lève `ERR_INVALID_ARG_TYPE` pour un argument `settings` invalide.

### `http2.createServer([options][, onRequestHandler])` {#http2createserveroptions-onrequesthandler}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.0.0 | Ajout de `streamResetBurst` et `streamResetRate`. |
| v13.0.0 | La `PADDING_STRATEGY_CALLBACK` est devenue équivalente à fournir `PADDING_STRATEGY_ALIGNED` et `selectPadding` a été supprimée. |
| v13.3.0, v12.16.0 | Ajout de l'option `maxSessionRejectedStreams` avec une valeur par défaut de 100. |
| v13.3.0, v12.16.0 | Ajout de l'option `maxSessionInvalidFrames` avec une valeur par défaut de 1000. |
| v12.4.0 | Le paramètre `options` prend désormais en charge les options de `net.createServer()`. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Ajout de l'option `unknownProtocolTimeout` avec une valeur par défaut de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Ajout de l'option `maxSettings` avec une valeur par défaut de 32. |
| v9.6.0 | Ajout des options `Http1IncomingMessage` et `Http1ServerResponse`. |
| v8.9.3 | Ajout de l'option `maxOutstandingPings` avec une limite par défaut de 10. |
| v8.9.3 | Ajout de l'option `maxHeaderListPairs` avec une limite par défaut de 128 paires d'en-têtes. |
| v8.4.0 | Ajoutée dans : v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la taille maximale de la table dynamique pour la déflation des champs d'en-tête. **Par défaut :** `4Kio`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal d'entrées de paramètres par trame `SETTINGS`. La valeur minimale autorisée est `1`. **Par défaut :** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la mémoire maximale que la `Http2Session` est autorisée à utiliser. La valeur est exprimée en nombre de mégaoctets, par exemple `1` égale 1 mégaoctet. La valeur minimale autorisée est `1`. Il s'agit d'une limite basée sur le crédit, les `Http2Stream` existants peuvent entraîner le dépassement de cette limite, mais les nouvelles instances `Http2Stream` seront rejetées tant que cette limite sera dépassée. Le nombre actuel de sessions `Http2Stream`, l'utilisation actuelle de la mémoire des tables de compression d'en-tête, les données actuelles mises en file d'attente pour être envoyées et les trames `PING` et `SETTINGS` non acquittées sont toutes comptabilisées dans la limite actuelle. **Par défaut :** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal d'entrées d'en-tête. Ceci est similaire à [`server.maxHeadersCount`](/fr/nodejs/api/http#servermaxheaderscount) ou [`request.maxHeadersCount`](/fr/nodejs/api/http#requestmaxheaderscount) dans le module `node:http`. La valeur minimale est `4`. **Par défaut :** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de pings en attente, non acquittés. **Par défaut :** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la taille maximale autorisée pour un bloc d'en-têtes sérialisé et compressé. Les tentatives d'envoi d'en-têtes qui dépassent cette limite entraîneront l'émission d'un événement `'frameError'` et la fermeture et la destruction du flux. Bien que cela définisse la taille maximale autorisée pour l'ensemble du bloc d'en-têtes, `nghttp2` (la bibliothèque http2 interne) a une limite de `65536` pour chaque paire clé/valeur décompressée.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La stratégie utilisée pour déterminer la quantité de remplissage à utiliser pour les trames `HEADERS` et `DATA`. **Par défaut :** `http2.constants.PADDING_STRATEGY_NONE`. La valeur peut être l'une des suivantes :
    - `http2.constants.PADDING_STRATEGY_NONE` : Aucun remplissage n'est appliqué.
    - `http2.constants.PADDING_STRATEGY_MAX` : La quantité maximale de remplissage, déterminée par l'implémentation interne, est appliquée.
    - `http2.constants.PADDING_STRATEGY_ALIGNED` : Tente d'appliquer suffisamment de remplissage pour garantir que la longueur totale de la trame, y compris l'en-tête de 9 octets, est un multiple de 8. Pour chaque trame, il existe un nombre maximal autorisé d'octets de remplissage qui est déterminé par l'état actuel du contrôle de flux et les paramètres. Si ce maximum est inférieur à la quantité calculée nécessaire pour garantir l'alignement, le maximum est utilisé et la longueur totale de la trame n'est pas nécessairement alignée sur 8 octets.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de flux simultanés pour le pair distant comme si une trame `SETTINGS` avait été reçue. Sera remplacé si le pair distant définit sa propre valeur pour `maxConcurrentStreams`. **Par défaut :** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de trames invalides qui seront tolérées avant la fermeture de la session. **Par défaut :** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de flux rejetés lors de la création qui seront tolérés avant la fermeture de la session. Chaque rejet est associé à une erreur `NGHTTP2_ENHANCE_YOUR_CALM` qui devrait indiquer au pair de ne plus ouvrir de flux, continuer à ouvrir des flux est donc considéré comme un signe de pair malveillant. **Par défaut :** `100`.
    - `settings` [\<Objet de paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object) Les paramètres initiaux à envoyer au pair distant lors de la connexion.
    - `streamResetBurst` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) et `streamResetRate` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la limite de débit pour la réinitialisation du flux entrant (trame RST_STREAM). Les deux paramètres doivent être définis pour avoir un effet, et la valeur par défaut est respectivement 1000 et 33.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Le tableau de valeurs entières détermine les types de paramètres, qui sont inclus dans la propriété `CustomSettings` des remoteSettings reçus. Veuillez consulter la propriété `CustomSettings` de l'objet `Http2Settings` pour plus d'informations sur les types de paramètres autorisés.
    - `Http1IncomingMessage` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage) Spécifie la classe `IncomingMessage` à utiliser pour le fallback HTTP/1. Utile pour étendre le `http.IncomingMessage` original. **Par défaut :** `http.IncomingMessage`.
    - `Http1ServerResponse` [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse) Spécifie la classe `ServerResponse` à utiliser pour le fallback HTTP/1. Utile pour étendre le `http.ServerResponse` original. **Par défaut :** `http.ServerResponse`.
    - `Http2ServerRequest` [\<http2.Http2ServerRequest\>](/fr/nodejs/api/http2#class-http2http2serverrequest) Spécifie la classe `Http2ServerRequest` à utiliser. Utile pour étendre le `Http2ServerRequest` original. **Par défaut :** `Http2ServerRequest`.
    - `Http2ServerResponse` [\<http2.Http2ServerResponse\>](/fr/nodejs/api/http2#class-http2http2serverresponse) Spécifie la classe `Http2ServerResponse` à utiliser. Utile pour étendre le `Http2ServerResponse` original. **Par défaut :** `Http2ServerResponse`.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie un timeout en millisecondes pendant lequel un serveur doit attendre lorsqu'un événement [`'unknownProtocol'`](/fr/nodejs/api/http2#event-unknownprotocol) est émis. Si le socket n'a pas été détruit avant cette heure, le serveur le détruira. **Par défaut :** `10000`.
    - ... : Toute option [`net.createServer()`](/fr/nodejs/api/net#netcreateserveroptions-connectionlistener) peut être fournie.

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Voir [API de compatibilité](/fr/nodejs/api/http2#compatibility-api)
- Retourne : [\<Http2Server\>](/fr/nodejs/api/http2#class-http2server)

Retourne une instance `net.Server` qui crée et gère les instances `Http2Session`.

Comme aucun navigateur connu ne prend en charge [HTTP/2 non chiffré](https://http2.github.io/faq/#does-http2-require-encryption), l'utilisation de [`http2.createSecureServer()`](/fr/nodejs/api/http2#http2createsecureserveroptions-onrequesthandler) est nécessaire lors de la communication avec des clients de navigateur.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';

// Create an unencrypted HTTP/2 server.
// Since there are no browsers known that support
// unencrypted HTTP/2, the use of `createSecureServer()`
// is necessary when communicating with browser clients.
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```js [CJS]
const http2 = require('node:http2');

// Create an unencrypted HTTP/2 server.
// Since there are no browsers known that support
// unencrypted HTTP/2, the use of `http2.createSecureServer()`
// is necessary when communicating with browser clients.
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```
:::


### `http2.createSecureServer(options[, onRequestHandler])` {#http2createsecureserveroptions-onrequesthandler}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | `PADDING_STRATEGY_CALLBACK` a été rendu équivalent à fournir `PADDING_STRATEGY_ALIGNED` et `selectPadding` a été supprimé. |
| v13.3.0, v12.16.0 | Ajout de l'option `maxSessionRejectedStreams` avec une valeur par défaut de 100. |
| v13.3.0, v12.16.0 | Ajout de l'option `maxSessionInvalidFrames` avec une valeur par défaut de 1000. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Ajout de l'option `unknownProtocolTimeout` avec une valeur par défaut de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Ajout de l'option `maxSettings` avec une valeur par défaut de 32. |
| v10.12.0 | Ajout de l'option `origins` pour envoyer automatiquement une trame `ORIGIN` au démarrage de la `Http2Session`. |
| v8.9.3 | Ajout de l'option `maxOutstandingPings` avec une limite par défaut de 10. |
| v8.9.3 | Ajout de l'option `maxHeaderListPairs` avec une limite par défaut de 128 paires d'en-têtes. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHTTP1` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Les connexions clientes entrantes qui ne prennent pas en charge HTTP/2 seront rétrogradées vers HTTP/1.x lorsque cette option est définie sur `true`. Voir l'événement [`'unknownProtocol'`](/fr/nodejs/api/http2#event-unknownprotocol). Voir [Négociation ALPN](/fr/nodejs/api/http2#alpn-negotiation). **Par défaut :** `false`.
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la taille maximale de la table dynamique pour dégonfler les champs d'en-tête. **Par défaut :** `4Kio`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal d'entrées de paramètres par trame `SETTINGS`. La valeur minimale autorisée est `1`. **Par défaut :** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la mémoire maximale que la `Http2Session` est autorisée à utiliser. La valeur est exprimée en nombre de mégaoctets, par exemple `1` équivaut à 1 mégaoctet. La valeur minimale autorisée est `1`. Il s'agit d'une limite basée sur le crédit, les `Http2Stream` existants peuvent entraîner le dépassement de cette limite, mais les nouvelles instances `Http2Stream` seront rejetées tant que cette limite est dépassée. Le nombre actuel de sessions `Http2Stream`, l'utilisation actuelle de la mémoire des tables de compression d'en-tête, les données actuelles mises en file d'attente pour être envoyées et les trames `PING` et `SETTINGS` non accusées de réception sont tous pris en compte dans la limite actuelle. **Par défaut :** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal d'entrées d'en-tête. Ceci est similaire à [`server.maxHeadersCount`](/fr/nodejs/api/http#servermaxheaderscount) ou [`request.maxHeadersCount`](/fr/nodejs/api/http#requestmaxheaderscount) dans le module `node:http`. La valeur minimale est `4`. **Par défaut :** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de pings en attente non reconnus. **Par défaut :** `10`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la taille maximale autorisée pour un bloc d'en-têtes sérialisé et compressé. Les tentatives d'envoi d'en-têtes qui dépassent cette limite entraîneront l'émission d'un événement `'frameError'` et la fermeture et la destruction du flux.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Stratégie utilisée pour déterminer la quantité de remplissage à utiliser pour les trames `HEADERS` et `DATA`. **Par défaut :** `http2.constants.PADDING_STRATEGY_NONE`. La valeur peut être l'une des suivantes :
    - `http2.constants.PADDING_STRATEGY_NONE` : Aucun remplissage n'est appliqué.
    - `http2.constants.PADDING_STRATEGY_MAX` : La quantité maximale de remplissage, déterminée par l'implémentation interne, est appliquée.
    - `http2.constants.PADDING_STRATEGY_ALIGNED` : Tente d'appliquer suffisamment de remplissage pour garantir que la longueur totale de la trame, y compris l'en-tête de 9 octets, est un multiple de 8. Pour chaque trame, il existe un nombre maximal autorisé d'octets de remplissage qui est déterminé par l'état actuel du contrôle de flux et les paramètres. Si ce maximum est inférieur à la quantité calculée nécessaire pour garantir l'alignement, le maximum est utilisé et la longueur totale de la trame n'est pas nécessairement alignée sur 8 octets.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de flux simultanés pour le pair distant comme si une trame `SETTINGS` avait été reçue. Sera remplacé si le pair distant définit sa propre valeur pour `maxConcurrentStreams`. **Par défaut :** `100`.
    - `maxSessionInvalidFrames` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de trames invalides qui seront tolérées avant la fermeture de la session. **Par défaut :** `1000`.
    - `maxSessionRejectedStreams` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de flux rejetés lors de la création qui seront tolérés avant la fermeture de la session. Chaque rejet est associé à une erreur `NGHTTP2_ENHANCE_YOUR_CALM` qui devrait indiquer au pair de ne plus ouvrir de flux, continuer à ouvrir des flux est donc considéré comme un signe de comportement incorrect du pair. **Par défaut :** `100`.
    - `settings` [\<Objet Paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object) Les paramètres initiaux à envoyer au pair distant lors de la connexion.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Le tableau de valeurs entières détermine les types de paramètres, qui sont inclus dans la propriété `customSettings` des remoteSettings reçus. Veuillez consulter la propriété `customSettings` de l'objet `Http2Settings` pour plus d'informations sur les types de paramètres autorisés.
    - ... : Toutes les options [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) peuvent être fournies. Pour les serveurs, les options d'identité (`pfx` ou `key`/`cert`) sont généralement requises.
    - `origins` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un tableau de chaînes d'origine à envoyer dans une trame `ORIGIN` immédiatement après la création d'une nouvelle `Http2Session` de serveur.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie un délai d'attente en millisecondes qu'un serveur doit attendre lorsqu'un événement [`'unknownProtocol'`](/fr/nodejs/api/http2#event-unknownprotocol) est émis. Si le socket n'a pas été détruit à ce moment-là, le serveur le détruira. **Par défaut :** `10000`.

- `onRequestHandler` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Voir [API de Compatibilité](/fr/nodejs/api/http2#compatibility-api)
- Retourne : [\<Http2SecureServer\>](/fr/nodejs/api/http2#class-http2secureserver)

Retourne une instance `tls.Server` qui crée et gère les instances `Http2Session`.

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```js [CJS]
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```
:::


### `http2.connect(authority[, options][, listener])` {#http2connectauthority-options-listener}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | La stratégie `PADDING_STRATEGY_CALLBACK` a été rendue équivalente à la fourniture de `PADDING_STRATEGY_ALIGNED` et `selectPadding` a été supprimé. |
| v15.10.0, v14.16.0, v12.21.0, v10.24.0 | Ajout de l'option `unknownProtocolTimeout` avec une valeur par défaut de 10000. |
| v14.4.0, v12.18.0, v10.21.0 | Ajout de l'option `maxSettings` avec une valeur par défaut de 32. |
| v8.9.3 | Ajout de l'option `maxOutstandingPings` avec une limite par défaut de 10. |
| v8.9.3 | Ajout de l'option `maxHeaderListPairs` avec une limite par défaut de 128 paires d'en-têtes. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `authority` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Le serveur HTTP/2 distant auquel se connecter. Il doit s'agir d'une URL valide minimale avec le préfixe `http://` ou `https://`, le nom d'hôte et le port IP (si un port non-par-défaut est utilisé). Les informations d'identification (ID utilisateur et mot de passe), le chemin d'accès, la chaîne de requête et les détails du fragment dans l'URL seront ignorés.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxDeflateDynamicTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la taille maximale de la table dynamique pour dégonfler les champs d'en-tête. **Par défaut :** `4Kio`.
    - `maxSettings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximum d'entrées de paramètres par trame `SETTINGS`. La valeur minimale autorisée est `1`. **Par défaut :** `32`.
    - `maxSessionMemory`[\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la mémoire maximale que la `Http2Session` est autorisée à utiliser. La valeur est exprimée en nombre de mégaoctets, par exemple `1` équivaut à 1 mégaoctet. La valeur minimale autorisée est `1`. Il s'agit d'une limite basée sur le crédit, les `Http2Stream` existants peuvent entraîner le dépassement de cette limite, mais les nouvelles instances `Http2Stream` seront rejetées tant que cette limite est dépassée. Le nombre actuel de sessions `Http2Stream`, l'utilisation actuelle de la mémoire des tables de compression d'en-tête, les données actuellement mises en file d'attente à envoyer et les trames `PING` et `SETTINGS` non acquittées sont tous pris en compte dans la limite actuelle. **Par défaut :** `10`.
    - `maxHeaderListPairs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximum d'entrées d'en-tête. Ceci est similaire à [`server.maxHeadersCount`](/fr/nodejs/api/http#servermaxheaderscount) ou [`request.maxHeadersCount`](/fr/nodejs/api/http#requestmaxheaderscount) dans le module `node:http`. La valeur minimale est `1`. **Par défaut :** `128`.
    - `maxOutstandingPings` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximum de pings en suspens non acquittés. **Par défaut :** `10`.
    - `maxReservedRemoteStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximum de flux push réservés que le client acceptera à un moment donné. Une fois que le nombre actuel de flux push actuellement réservés dépasse cette limite, les nouveaux flux push envoyés par le serveur seront automatiquement rejetés. La valeur minimale autorisée est 0. La valeur maximale autorisée est 2-1. Une valeur négative définit cette option sur la valeur maximale autorisée. **Par défaut :** `200`.
    - `maxSendHeaderBlockLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la taille maximale autorisée pour un bloc d'en-têtes sérialisé et compressé. Les tentatives d'envoi d'en-têtes qui dépassent cette limite entraîneront l'émission d'un événement `'frameError'` et la fermeture et la destruction du flux.
    - `paddingStrategy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Stratégie utilisée pour déterminer la quantité de remplissage à utiliser pour les trames `HEADERS` et `DATA`. **Par défaut :** `http2.constants.PADDING_STRATEGY_NONE`. La valeur peut être l'une des suivantes :
    - `http2.constants.PADDING_STRATEGY_NONE`: Aucun remplissage n'est appliqué.
    - `http2.constants.PADDING_STRATEGY_MAX`: La quantité maximale de remplissage, déterminée par l'implémentation interne, est appliquée.
    - `http2.constants.PADDING_STRATEGY_ALIGNED`: Tente d'appliquer suffisamment de remplissage pour garantir que la longueur totale de la trame, y compris l'en-tête de 9 octets, est un multiple de 8. Pour chaque trame, il existe un nombre maximal autorisé d'octets de remplissage qui est déterminé par l'état actuel du contrôle de flux et les paramètres. Si ce maximum est inférieur à la quantité calculée nécessaire pour assurer l'alignement, le maximum est utilisé et la longueur totale de la trame n'est pas nécessairement alignée sur 8 octets.

    - `peerMaxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit le nombre maximal de flux simultanés pour le pair distant comme si une trame `SETTINGS` avait été reçue. Sera remplacé si le pair distant définit sa propre valeur pour `maxConcurrentStreams`. **Par défaut :** `100`.
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le protocole avec lequel se connecter, s'il n'est pas défini dans l'`authority`. La valeur peut être `'http:'` ou `'https:'`. **Par défaut :** `'https:'`
    - `settings` [\<Objet Paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object) Les paramètres initiaux à envoyer au pair distant lors de la connexion.
    - `remoteCustomSettings` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Le tableau de valeurs entières détermine les types de paramètres, qui sont inclus dans la propriété `CustomSettings` des remoteSettings reçus. Veuillez consulter la propriété `CustomSettings` de l'objet `Http2Settings` pour plus d'informations sur les types de paramètres autorisés.
    - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Un rappel optionnel qui reçoit l'instance `URL` transmise à `connect` et l'objet `options`, et renvoie tout flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) qui doit être utilisé comme connexion pour cette session.
    - ... : Toutes les options [`net.connect()`](/fr/nodejs/api/net#netconnect) ou [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) peuvent être fournies.
    - `unknownProtocolTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie un délai d'attente en millisecondes qu'un serveur doit attendre lorsqu'un événement [`'unknownProtocol'`](/fr/nodejs/api/http2#event-unknownprotocol) est émis. Si le socket n'a pas été détruit avant cette heure, le serveur le détruira. **Par défaut :** `10000`.

- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Sera enregistré en tant qu'écouteur unique de l'événement [`'connect'`](/fr/nodejs/api/http2#event-connect).
- Retourne : [\<ClientHttp2Session\>](/fr/nodejs/api/http2#class-clienthttp2session)

Retourne une instance de `ClientHttp2Session`.

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Use the client */

client.close();
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use the client */

client.close();
```
:::


### `http2.constants` {#http2constants}

**Ajouté dans : v8.4.0**

#### Codes d'erreur pour `RST_STREAM` et `GOAWAY` {#error-codes-for-rst_stream-and-goaway}

| Valeur | Nom | Constante |
| --- | --- | --- |
| `0x00` | Aucune erreur | `http2.constants.NGHTTP2_NO_ERROR` |
| `0x01` | Erreur de protocole | `http2.constants.NGHTTP2_PROTOCOL_ERROR` |
| `0x02` | Erreur interne | `http2.constants.NGHTTP2_INTERNAL_ERROR` |
| `0x03` | Erreur de contrôle de flux | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR` |
| `0x04` | Délai d'attente des paramètres | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT` |
| `0x05` | Flux fermé | `http2.constants.NGHTTP2_STREAM_CLOSED` |
| `0x06` | Erreur de taille de trame | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR` |
| `0x07` | Flux refusé | `http2.constants.NGHTTP2_REFUSED_STREAM` |
| `0x08` | Annuler | `http2.constants.NGHTTP2_CANCEL` |
| `0x09` | Erreur de compression | `http2.constants.NGHTTP2_COMPRESSION_ERROR` |
| `0x0a` | Erreur de connexion | `http2.constants.NGHTTP2_CONNECT_ERROR` |
| `0x0b` | Modérez votre calme | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM` |
| `0x0c` | Sécurité insuffisante | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 requis | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED` |
L'événement `'timeout'` est émis lorsqu'il n'y a aucune activité sur le serveur pendant un nombre donné de millisecondes défini à l'aide de `http2server.setTimeout()`.

### `http2.getDefaultSettings()` {#http2getdefaultsettings}

**Ajouté dans : v8.4.0**

- Retourne : [\<Objet Paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object)

Renvoie un objet contenant les paramètres par défaut pour une instance `Http2Session`. Cette méthode renvoie une nouvelle instance d'objet chaque fois qu'elle est appelée, de sorte que les instances renvoyées peuvent être modifiées en toute sécurité pour être utilisées.

### `http2.getPackedSettings([settings])` {#http2getpackedsettingssettings}

**Ajouté dans : v8.4.0**

- `settings` [\<Objet Paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object)
- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Renvoie une instance `Buffer` contenant la représentation sérialisée des paramètres HTTP/2 donnés, comme spécifié dans la spécification [HTTP/2](https://tools.ietf.org/html/rfc7540). Ceci est destiné à être utilisé avec le champ d'en-tête `HTTP2-Settings`.



::: code-group
```js [ESM]
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```js [CJS]
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```
:::


### `http2.getUnpackedSettings(buf)` {#http2getunpackedsettingsbuf}

**Ajouté dans : v8.4.0**

- `buf` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Les paramètres compressés.
- Retourne : [\<Objet de paramètres HTTP/2\>](/fr/nodejs/api/http2#settings-object)

Retourne un [Objet de paramètres HTTP/2](/fr/nodejs/api/http2#settings-object) contenant les paramètres désérialisés du `Buffer` donné, tel que généré par `http2.getPackedSettings()`.

### `http2.performServerHandshake(socket[, options])` {#http2performserverhandshakesocket-options}

**Ajouté dans : v21.7.0, v20.12.0**

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - ... : Toute option de [`http2.createServer()`](/fr/nodejs/api/http2#http2createserveroptions-onrequesthandler) peut être fournie.


- Retourne : [\<ServerHttp2Session\>](/fr/nodejs/api/http2#class-serverhttp2session)

Crée une session de serveur HTTP/2 à partir d'un socket existant.

### `http2.sensitiveHeaders` {#http2sensitiveheaders}

**Ajouté dans : v15.0.0, v14.18.0**

- [\<symbol\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Symbol_type)

Ce symbole peut être défini comme une propriété sur l'objet d'en-têtes HTTP/2 avec une valeur de tableau afin de fournir une liste d'en-têtes considérés comme sensibles. Voir [En-têtes sensibles](/fr/nodejs/api/http2#sensitive-headers) pour plus de détails.

### Objet des en-têtes {#headers-object}

Les en-têtes sont représentés comme des propriétés propres sur les objets JavaScript. Les clés de propriété seront sérialisées en minuscules. Les valeurs de propriété doivent être des chaînes de caractères (si ce n'est pas le cas, elles seront converties en chaînes de caractères) ou un `Array` de chaînes de caractères (afin d'envoyer plus d'une valeur par champ d'en-tête).

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```
Les objets d'en-tête passés aux fonctions de rappel auront un prototype `null`. Cela signifie que les méthodes d'objet JavaScript normales telles que `Object.prototype.toString()` et `Object.prototype.hasOwnProperty()` ne fonctionneront pas.

Pour les en-têtes entrants :

- L'en-tête `:status` est converti en `number`.
- Les doublons de `:status`, `:method`, `:authority`, `:scheme`, `:path`, `:protocol`, `age`, `authorization`, `access-control-allow-credentials`, `access-control-max-age`, `access-control-request-method`, `content-encoding`, `content-language`, `content-length`, `content-location`, `content-md5`, `content-range`, `content-type`, `date`, `dnt`, `etag`, `expires`, `from`, `host`, `if-match`, `if-modified-since`, `if-none-match`, `if-range`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `range`, `referer`, `retry-after`, `tk`, `upgrade-insecure-requests`, `user-agent` ou `x-content-type-options` sont rejetés.
- `set-cookie` est toujours un tableau. Les doublons sont ajoutés au tableau.
- Pour les en-têtes `cookie` en double, les valeurs sont jointes avec '; '.
- Pour tous les autres en-têtes, les valeurs sont jointes avec ', '.



::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```
:::


#### En-têtes sensibles {#sensitive-headers}

Les en-têtes HTTP2 peuvent être marqués comme sensibles, ce qui signifie que l'algorithme de compression d'en-tête HTTP/2 ne les indexera jamais. Cela peut être pertinent pour les valeurs d'en-tête à faible entropie et qui peuvent être considérées comme précieuses pour un attaquant, par exemple `Cookie` ou `Authorization`. Pour ce faire, ajoutez le nom de l'en-tête à la propriété `[http2.sensitiveHeaders]` sous forme de tableau :

```js [ESM]
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```
Pour certains en-têtes, tels que `Authorization` et les en-têtes `Cookie` courts, cet indicateur est défini automatiquement.

Cette propriété est également définie pour les en-têtes reçus. Elle contiendra les noms de tous les en-têtes marqués comme sensibles, y compris ceux marqués de cette manière automatiquement.

### Objet de paramètres {#settings-object}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.12.0 | Le paramètre `maxConcurrentStreams` est plus strict. |
| v8.9.3 | Le paramètre `maxHeaderListSize` est désormais strictement appliqué. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

Les API `http2.getDefaultSettings()`, `http2.getPackedSettings()`, `http2.createServer()`, `http2.createSecureServer()`, `http2session.settings()`, `http2session.localSettings` et `http2session.remoteSettings` renvoient ou reçoivent en entrée un objet qui définit les paramètres de configuration d'un objet `Http2Session`. Ces objets sont des objets JavaScript ordinaires contenant les propriétés suivantes.

- `headerTableSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre maximal d'octets utilisés pour la compression d'en-tête. La valeur minimale autorisée est 0. La valeur maximale autorisée est 2-1. **Par défaut :** `4096`.
- `enablePush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Spécifie `true` si les flux push HTTP/2 doivent être autorisés sur les instances `Http2Session`. **Par défaut :** `true`.
- `initialWindowSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie la taille initiale de la fenêtre en octets de *l'expéditeur* pour le contrôle de flux au niveau du flux. La valeur minimale autorisée est 0. La valeur maximale autorisée est 2-1. **Par défaut :** `65535`.
- `maxFrameSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie la taille en octets de la plus grande charge utile de trame. La valeur minimale autorisée est 16 384. La valeur maximale autorisée est 2-1. **Par défaut :** `16384`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre maximal de flux simultanés autorisés sur une `Http2Session`. Il n'y a pas de valeur par défaut, ce qui implique qu'au moins théoriquement, 2-1 flux peuvent être ouverts simultanément à tout moment dans une `Http2Session`. La valeur minimale est 0. La valeur maximale autorisée est 2-1. **Par défaut :** `4294967295`.
- `maxHeaderListSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie la taille maximale (octets non compressés) de la liste d'en-têtes qui sera acceptée. La valeur minimale autorisée est 0. La valeur maximale autorisée est 2-1. **Par défaut :** `65535`.
- `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias pour `maxHeaderListSize`.
- `enableConnectProtocol`[\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Spécifie `true` si le « protocole de connexion étendu » défini par [RFC 8441](https://tools.ietf.org/html/rfc8441) doit être activé. Ce paramètre n'est pertinent que s'il est envoyé par le serveur. Une fois que le paramètre `enableConnectProtocol` a été activé pour une `Http2Session` donnée, il ne peut plus être désactivé. **Par défaut :** `false`.
- `customSettings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Spécifie des paramètres supplémentaires, qui ne sont pas encore implémentés dans Node et les bibliothèques sous-jacentes. La clé de l'objet définit la valeur numérique du type de paramètres (tel que défini dans le registre « HTTP/2 SETTINGS » établi par [RFC 7540]) et les valeurs, la valeur numérique réelle des paramètres. Le type de paramètres doit être un entier compris entre 1 et 2^16-1. Il ne doit pas s'agir d'un type de paramètres déjà géré par Node, c'est-à-dire qu'il doit actuellement être supérieur à 6, bien que ce ne soit pas une erreur. Les valeurs doivent être des entiers non signés compris entre 0 et 2^32-1. Actuellement, un maximum de 10 paramètres personnalisés est pris en charge. Il est uniquement pris en charge pour l'envoi de SETTINGS, ou pour la réception de valeurs de paramètres spécifiées dans les options `remoteCustomSettings` de l'objet serveur ou client. Ne mélangez pas le mécanisme `customSettings` pour un ID de paramètres avec les interfaces pour les paramètres gérés nativement, au cas où un paramètre deviendrait nativement pris en charge dans une future version de Node.

Toutes les propriétés supplémentaires de l'objet de paramètres sont ignorées.


### Gestion des erreurs {#error-handling}

Plusieurs types d'erreurs peuvent survenir lors de l'utilisation du module `node:http2` :

Les erreurs de validation se produisent lorsqu'un argument, une option ou une valeur de paramètre incorrect est passé. Elles seront toujours signalées par un `throw` synchrone.

Les erreurs d'état se produisent lorsqu'une action est tentée à un moment incorrect (par exemple, tenter d'envoyer des données sur un flux après sa fermeture). Elles seront signalées soit par un `throw` synchrone, soit via un événement `'error'` sur les objets `Http2Stream`, `Http2Session` ou Serveur HTTP/2, selon où et quand l'erreur se produit.

Les erreurs internes se produisent lorsqu'une session HTTP/2 échoue de manière inattendue. Elles seront signalées via un événement `'error'` sur les objets `Http2Session` ou Serveur HTTP/2.

Les erreurs de protocole se produisent lorsque diverses contraintes du protocole HTTP/2 sont violées. Elles seront signalées soit par un `throw` synchrone, soit via un événement `'error'` sur les objets `Http2Stream`, `Http2Session` ou Serveur HTTP/2, selon où et quand l'erreur se produit.

### Gestion des caractères invalides dans les noms et les valeurs d'en-tête {#invalid-character-handling-in-header-names-and-values}

L'implémentation HTTP/2 applique une gestion plus stricte des caractères invalides dans les noms et les valeurs d'en-tête HTTP que l'implémentation HTTP/1.

Les noms de champs d'en-tête sont *insensibles à la casse* et sont transmis sur le réseau strictement sous forme de chaînes de caractères minuscules. L'API fournie par Node.js permet de définir les noms d'en-tête sous forme de chaînes de caractères mixtes (par exemple, `Content-Type`), mais les convertira en minuscules (par exemple, `content-type`) lors de la transmission.

Les noms de champs d'en-tête *doivent uniquement* contenir un ou plusieurs des caractères ASCII suivants : `a`-`z`, `A`-`Z`, `0`-`9`, `!`, `#`, `$`, `%`, `&`, `'`, `*`, `+`, `-`, `.`, `^`, `_`, ``` (backtick), `|` et `~`.

L'utilisation de caractères invalides dans un nom de champ d'en-tête HTTP entraînera la fermeture du flux avec signalement d'une erreur de protocole.

Les valeurs des champs d'en-tête sont traitées avec plus d'indulgence, mais *ne doivent pas* contenir de caractères de saut de ligne ou de retour chariot et *doivent* être limitées aux caractères US-ASCII, conformément aux exigences de la spécification HTTP.


### Envoyer des flux (push streams) sur le client {#push-streams-on-the-client}

Pour recevoir des flux envoyés (pushed streams) sur le client, définissez un écouteur pour l'événement `'stream'` sur le `ClientHttp2Session` :

::: code-group
```js [ESM]
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Process response headers
  });
  pushedStream.on('data', (chunk) => { /* handle pushed data */ });
});

const req = client.request({ ':path': '/' });
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Process response headers
  });
  pushedStream.on('data', (chunk) => { /* handle pushed data */ });
});

const req = client.request({ ':path': '/' });
```
:::

### Prise en charge de la méthode `CONNECT` {#supporting-the-connect-method}

La méthode `CONNECT` est utilisée pour permettre à un serveur HTTP/2 d'être utilisé comme proxy pour les connexions TCP/IP.

Un simple serveur TCP :

::: code-group
```js [ESM]
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```js [CJS]
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```
:::

Un proxy HTTP/2 CONNECT :

::: code-group
```js [ESM]
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Only accept CONNECT requests
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // It's a very good idea to verify that hostname and port are
  // things this proxy should be connecting to.
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```js [CJS]
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Only accept CONNECT requests
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // It's a very good idea to verify that hostname and port are
  // things this proxy should be connecting to.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```
:::

Un client HTTP/2 CONNECT :

::: code-group
```js [ESM]
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// Must not specify the ':path' and ':scheme' headers
// for CONNECT requests or an error will be thrown.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```js [CJS]
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// Must not specify the ':path' and ':scheme' headers
// for CONNECT requests or an error will be thrown.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```
:::


### Le protocole `CONNECT` étendu {#the-extended-connect-protocol}

[RFC 8441](https://tools.ietf.org/html/rfc8441) définit une extension de "Protocole CONNECT Étendu" à HTTP/2 qui peut être utilisée pour amorcer l'utilisation d'un `Http2Stream` utilisant la méthode `CONNECT` comme tunnel pour d'autres protocoles de communication (tels que WebSockets).

L'utilisation du protocole CONNECT étendu est activée par les serveurs HTTP/2 en utilisant le paramètre `enableConnectProtocol` :

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```js [CJS]
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```
:::

Une fois que le client reçoit la trame `SETTINGS` du serveur indiquant que le CONNECT étendu peut être utilisé, il peut envoyer des requêtes `CONNECT` qui utilisent le pseudo-en-tête HTTP/2 `':protocol'` :

::: code-group
```js [ESM]
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```js [CJS]
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```
:::

## API de compatibilité {#compatibility-api}

L'API de compatibilité a pour objectif de fournir une expérience de développement similaire à HTTP/1 lors de l'utilisation de HTTP/2, permettant de développer des applications qui prennent en charge à la fois [HTTP/1](/fr/nodejs/api/http) et HTTP/2. Cette API cible uniquement l'**API publique** de [HTTP/1](/fr/nodejs/api/http). Cependant, de nombreux modules utilisent des méthodes ou un état internes, et ceux-ci *ne sont pas pris en charge* car il s'agit d'une implémentation complètement différente.

L'exemple suivant crée un serveur HTTP/2 en utilisant l'API de compatibilité :

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
:::

Afin de créer un serveur mixte [HTTPS](/fr/nodejs/api/https) et HTTP/2, reportez-vous à la section [négociation ALPN](/fr/nodejs/api/http2#alpn-negotiation). La mise à niveau à partir de serveurs HTTP/1 non-TLS n'est pas prise en charge.

L'API de compatibilité HTTP/2 est composée de [`Http2ServerRequest`](/fr/nodejs/api/http2#class-http2http2serverrequest) et [`Http2ServerResponse`](/fr/nodejs/api/http2#class-http2http2serverresponse). Elles visent la compatibilité API avec HTTP/1, mais elles ne masquent pas les différences entre les protocoles. Par exemple, le message d'état pour les codes HTTP est ignoré.


### Négociation ALPN {#alpn-negotiation}

La négociation ALPN permet de prendre en charge à la fois [HTTPS](/fr/nodejs/api/https) et HTTP/2 sur le même socket. Les objets `req` et `res` peuvent être HTTP/1 ou HTTP/2, et une application **doit** se limiter à l'API publique de [HTTP/1](/fr/nodejs/api/http), et détecter s'il est possible d'utiliser les fonctionnalités plus avancées de HTTP/2.

L'exemple suivant crée un serveur qui prend en charge les deux protocoles :

::: code-group
```js [ESM]
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // Detects if it is a HTTPS request or HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```js [CJS]
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // Detects if it is a HTTPS request or HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```
:::

L'événement `'request'` fonctionne de manière identique sur [HTTPS](/fr/nodejs/api/https) et HTTP/2.

### Class: `http2.Http2ServerRequest` {#class-http2http2serverrequest}

**Ajoutée dans : v8.4.0**

- Hérite : [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)

Un objet `Http2ServerRequest` est créé par [`http2.Server`](/fr/nodejs/api/http2#class-http2server) ou [`http2.SecureServer`](/fr/nodejs/api/http2#class-http2secureserver) et passé comme premier argument à l'événement [`'request'`](/fr/nodejs/api/http2#event-request). Il peut être utilisé pour accéder à un statut de requête, aux en-têtes et aux données.


#### Événement : `'aborted'` {#event-aborted_1}

**Ajouté dans : v8.4.0**

L'événement `'aborted'` est émis chaque fois qu'une instance `Http2ServerRequest` est anormalement interrompue en milieu de communication.

L'événement `'aborted'` ne sera émis que si le côté accessible en écriture de `Http2ServerRequest` n'a pas été terminé.

#### Événement : `'close'` {#event-close_2}

**Ajouté dans : v8.4.0**

Indique que le [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) sous-jacent a été fermé. Tout comme `'end'`, cet événement ne se produit qu'une seule fois par réponse.

#### `request.aborted` {#requestaborted}

**Ajouté dans : v10.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `request.aborted` sera `true` si la requête a été abandonnée.

#### `request.authority` {#requestauthority}

**Ajouté dans : v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le champ pseudo-en-tête d'autorité de la requête. Étant donné que HTTP/2 permet aux requêtes de définir soit `:authority` soit `host`, cette valeur est dérivée de `req.headers[':authority']` si elle est présente. Sinon, elle est dérivée de `req.headers['host']`.

#### `request.complete` {#requestcomplete}

**Ajouté dans : v12.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `request.complete` sera `true` si la requête a été complétée, abandonnée ou détruite.

#### `request.connection` {#requestconnection}

**Ajouté dans : v8.4.0**

**Déconseillé depuis : v13.0.0**

::: danger [Stable : 0 - Déconseillé]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stability : 0](/fr/nodejs/api/documentation#stability-index) - Déconseillé. Utilisez [`request.socket`](/fr/nodejs/api/http2#requestsocket).
:::

- [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket)

Voir [`request.socket`](/fr/nodejs/api/http2#requestsocket).

#### `request.destroy([error])` {#requestdestroyerror}

**Ajouté dans : v8.4.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Appelle `destroy()` sur le [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) qui a reçu le [`Http2ServerRequest`](/fr/nodejs/api/http2#class-http2http2serverrequest). Si `error` est fourni, un événement `'error'` est émis et `error` est passé comme argument à tous les auditeurs de l'événement.

Cela ne fait rien si le flux a déjà été détruit.


#### `request.headers` {#requestheaders}

**Ajoutée dans : v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'objet des en-têtes de requête/réponse.

Paires clé-valeur des noms et des valeurs d'en-tête. Les noms d'en-tête sont en minuscules.

```js [ESM]
// Affiche quelque chose comme :
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Voir [Objet des en-têtes HTTP/2](/fr/nodejs/api/http2#headers-object).

En HTTP/2, le chemin de requête, le nom d'hôte, le protocole et la méthode sont représentés sous forme d'en-têtes spéciaux préfixés par le caractère `:` (par exemple, `':path'`). Ces en-têtes spéciaux seront inclus dans l'objet `request.headers`. Il faut veiller à ne pas modifier par inadvertance ces en-têtes spéciaux, car des erreurs peuvent se produire. Par exemple, la suppression de tous les en-têtes de la requête entraînera des erreurs :

```js [ESM]
removeAllHeaders(request.headers);
assert(request.url);   // Échoue car l'en-tête :path a été supprimé
```
#### `request.httpVersion` {#requesthttpversion}

**Ajoutée dans : v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Dans le cas d'une requête de serveur, la version HTTP envoyée par le client. Dans le cas d'une réponse client, la version HTTP du serveur connecté. Renvoie `'2.0'`.

De même, `message.httpVersionMajor` est le premier entier et `message.httpVersionMinor` est le second.

#### `request.method` {#requestmethod}

**Ajoutée dans : v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La méthode de requête sous forme de chaîne. En lecture seule. Exemples : `'GET'`, `'DELETE'`.

#### `request.rawHeaders` {#requestrawheaders}

**Ajoutée dans : v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La liste des en-têtes de requête/réponse bruts exactement tels qu'ils ont été reçus.

Les clés et les valeurs sont dans la même liste. Ce n'est *pas* une liste de tuples. Ainsi, les décalages pairs sont des valeurs clés et les décalages impairs sont les valeurs associées.

Les noms d'en-têtes ne sont pas mis en minuscules et les doublons ne sont pas fusionnés.

```js [ESM]
// Affiche quelque chose comme :
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```

#### `request.rawTrailers` {#requestrawtrailers}

**Ajouté dans : v8.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Les clés et les valeurs des en-têtes de fin de requête/réponse brutes exactement telles qu'elles ont été reçues. Remplies uniquement lors de l'événement `'end'`.

#### `request.scheme` {#requestscheme}

**Ajouté dans : v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le pseudo-champ d'en-tête de schéma de requête indiquant la portion de schéma de l'URL cible.

#### `request.setTimeout(msecs, callback)` {#requestsettimeoutmsecs-callback}

**Ajouté dans : v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<http2.Http2ServerRequest\>](/fr/nodejs/api/http2#class-http2http2serverrequest)

Définit la valeur du délai d'attente de [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) sur `msecs`. Si un callback est fourni, il est ajouté en tant qu'écouteur sur l'événement `'timeout'` sur l'objet de réponse.

Si aucun écouteur `'timeout'` n'est ajouté à la requête, à la réponse ou au serveur, les [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) sont détruits lorsqu'ils expirent. Si un gestionnaire est affecté aux événements `'timeout'` de la requête, de la réponse ou du serveur, les sockets expirés doivent être gérés explicitement.

#### `request.socket` {#requestsocket}

**Ajouté dans : v8.4.0**

- [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket)

Renvoie un objet `Proxy` qui agit comme un `net.Socket` (ou `tls.TLSSocket`) mais applique des getters, des setters et des méthodes basés sur la logique HTTP/2.

Les propriétés `destroyed`, `readable` et `writable` seront extraites de et définies sur `request.stream`.

Les méthodes `destroy`, `emit`, `end`, `on` et `once` seront appelées sur `request.stream`.

La méthode `setTimeout` sera appelée sur `request.stream.session`.

`pause`, `read`, `resume` et `write` lanceront une erreur avec le code `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Voir [`Http2Session` et Sockets](/fr/nodejs/api/http2#http2session-and-sockets) pour plus d'informations.

Toutes les autres interactions seront directement routées vers le socket. Avec la prise en charge TLS, utilisez [`request.socket.getPeerCertificate()`](/fr/nodejs/api/tls#tlssocketgetpeercertificatedetailed) pour obtenir les détails d'authentification du client.


#### `request.stream` {#requeststream}

**Ajouté dans : v8.4.0**

- [\<Http2Stream\>](/fr/nodejs/api/http2#class-http2stream)

L’objet [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) soutenant la requête.

#### `request.trailers` {#requesttrailers}

**Ajouté dans : v8.4.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L’objet des en-têtes de fin de requête/réponse. Rempli uniquement à l’événement `'end'`.

#### `request.url` {#requesturl}

**Ajouté dans : v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Chaîne d’URL de la requête. Cela ne contient que l’URL présente dans la requête HTTP réelle. Si la requête est :

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Alors `request.url` sera :

```js [ESM]
'/status?name=ryan'
```
Pour analyser l’URL en ses parties, `new URL()` peut être utilisé :

```bash [BASH]
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
### Class: `http2.Http2ServerResponse` {#class-http2http2serverresponse}

**Ajouté dans : v8.4.0**

- Hérite de : [\<Stream\>](/fr/nodejs/api/stream#stream)

Cet objet est créé en interne par un serveur HTTP, pas par l’utilisateur. Il est transmis comme deuxième paramètre à l’événement [`'request'`](/fr/nodejs/api/http2#event-request).

#### Event: `'close'` {#event-close_3}

**Ajouté dans : v8.4.0**

Indique que le [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) sous-jacent a été terminé avant que [`response.end()`](/fr/nodejs/api/http2#responseenddata-encoding-callback) n’ait été appelé ou capable de vider.

#### Event: `'finish'` {#event-finish}

**Ajouté dans : v8.4.0**

Émis lorsque la réponse a été envoyée. Plus précisément, cet événement est émis lorsque le dernier segment des en-têtes et du corps de la réponse a été transmis au multiplexage HTTP/2 pour transmission sur le réseau. Cela n’implique pas que le client ait déjà reçu quoi que ce soit.

Après cet événement, plus aucun événement ne sera émis sur l’objet de réponse.


#### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Ajouté dans : v8.4.0**

- `headers` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)

Cette méthode ajoute des en-têtes de fin HTTP (un en-tête mais à la fin du message) à la réponse.

Tenter de définir un nom de champ d'en-tête ou une valeur contenant des caractères non valides entraînera la levée d'une erreur [`TypeError`](/fr/nodejs/api/errors#class-typeerror).

#### `response.appendHeader(name, value)` {#responseappendheadername-value}

**Ajouté dans : v21.7.0, v20.12.0**

- `name` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)

Ajoute une seule valeur d'en-tête à l'objet d'en-tête.

Si la valeur est un tableau, cela équivaut à appeler cette méthode plusieurs fois.

S'il n'y avait pas de valeurs précédentes pour l'en-tête, cela équivaut à appeler [`response.setHeader()`](/fr/nodejs/api/http2#responsesetheadername-value).

Tenter de définir un nom de champ d'en-tête ou une valeur contenant des caractères non valides entraînera la levée d'une erreur [`TypeError`](/fr/nodejs/api/errors#class-typeerror).

```js [ESM]
// Renvoie les en-têtes incluant "set-cookie: a" et "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```

#### `response.connection` {#responseconnection}

**Ajouté dans : v8.4.0**

**Déprécié depuis : v13.0.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez [`response.socket`](/fr/nodejs/api/http2#responsesocket).
:::

- [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket)

Voir [`response.socket`](/fr/nodejs/api/http2#responsesocket).

#### `response.createPushResponse(headers, callback)` {#responsecreatepushresponseheaders-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `headers` [\<Objet d'en-têtes HTTP/2\>](/fr/nodejs/api/http2#headers-object) Un objet décrivant les en-têtes
- `callback` [\<Fonction\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée une fois que `http2stream.pushStream()` est terminé, ou bien lorsque la tentative de création du `Http2Stream` poussé a échoué ou a été rejetée, ou bien lorsque l'état de `Http2ServerRequest` est fermé avant d'appeler la méthode `http2stream.pushStream()`
    - `err` [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `res` [\<http2.Http2ServerResponse\>](/fr/nodejs/api/http2#class-http2http2serverresponse) L'objet `Http2ServerResponse` nouvellement créé

Appelez [`http2stream.pushStream()`](/fr/nodejs/api/http2#http2streampushstreamheaders-options-callback) avec les en-têtes donnés, et enveloppez le [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) donné sur un `Http2ServerResponse` nouvellement créé comme paramètre de callback en cas de succès. Lorsque `Http2ServerRequest` est fermé, le callback est appelé avec une erreur `ERR_HTTP2_INVALID_STREAM`.


#### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Cette méthode renvoie désormais une référence à `ServerResponse`. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Renvoie : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Cette méthode indique au serveur que tous les en-têtes et le corps de la réponse ont été envoyés ; ce serveur doit considérer ce message comme complet. La méthode, `response.end()`, DOIT être appelée sur chaque réponse.

Si `data` est spécifié, cela équivaut à appeler [`response.write(data, encoding)`](/fr/nodejs/api/http#responsewritechunk-encoding-callback) suivi de `response.end(callback)`.

Si `callback` est spécifié, il sera appelé lorsque le flux de réponse sera terminé.

#### `response.finished` {#responsefinished}

**Ajouté dans : v8.4.0**

**Déprécié depuis : v13.4.0, v12.16.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez [`response.writableEnded`](/fr/nodejs/api/http2#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Valeur booléenne indiquant si la réponse est terminée. Commence à `false`. Après l'exécution de [`response.end()`](/fr/nodejs/api/http2#responseenddata-encoding-callback), la valeur sera `true`.

#### `response.getHeader(name)` {#responsegetheadername}

**Ajouté dans : v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Renvoie : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Lit un en-tête qui a déjà été mis en file d'attente mais pas envoyé au client. Le nom n'est pas sensible à la casse.

```js [ESM]
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()` {#responsegetheadernames}

**Ajouté dans : v8.4.0**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie un tableau contenant les noms uniques des en-têtes sortants actuels. Tous les noms d'en-têtes sont en minuscules.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```
#### `response.getHeaders()` {#responsegetheaders}

**Ajouté dans : v8.4.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Renvoie une copie superficielle des en-têtes sortants actuels. Puisqu'une copie superficielle est utilisée, les valeurs de tableau peuvent être modifiées sans appels supplémentaires aux diverses méthodes du module http relatives aux en-têtes. Les clés de l'objet renvoyé sont les noms des en-têtes et les valeurs sont les valeurs respectives des en-têtes. Tous les noms d'en-têtes sont en minuscules.

L'objet renvoyé par la méthode `response.getHeaders()` *n'hérite pas* de manière prototypique de l'objet JavaScript `Object`. Cela signifie que les méthodes `Object` typiques telles que `obj.toString()`, `obj.hasOwnProperty()` et autres ne sont pas définies et *ne fonctionneront pas*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
#### `response.hasHeader(name)` {#responsehasheadername}

**Ajouté dans : v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'en-tête identifié par `name` est actuellement défini dans les en-têtes sortants. La correspondance du nom de l'en-tête n'est pas sensible à la casse.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
#### `response.headersSent` {#responseheaderssent}

**Ajouté dans : v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vrai si les en-têtes ont été envoyés, faux sinon (lecture seule).


#### `response.removeHeader(name)` {#responseremoveheadername}

**Ajouté dans : v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Supprime un en-tête qui a été mis en file d'attente pour un envoi implicite.

```js [ESM]
response.removeHeader('Content-Encoding');
```
#### `response.req` {#responsereq}

**Ajouté dans : v15.7.0**

- [\<http2.Http2ServerRequest\>](/fr/nodejs/api/http2#class-http2http2serverrequest)

Une référence à l'objet HTTP2 `request` original.

#### `response.sendDate` {#responsesenddate}

**Ajouté dans : v8.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Lorsque la valeur est true, l'en-tête Date sera automatiquement généré et envoyé dans la réponse s'il n'est pas déjà présent dans les en-têtes. La valeur par défaut est true.

Ceci ne doit être désactivé que pour les tests ; HTTP exige l'en-tête Date dans les réponses.

#### `response.setHeader(name, value)` {#responsesetheadername-value}

**Ajouté dans : v8.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Définit une seule valeur d'en-tête pour les en-têtes implicites. Si cet en-tête existe déjà dans les en-têtes à envoyer, sa valeur sera remplacée. Utilisez un tableau de chaînes ici pour envoyer plusieurs en-têtes avec le même nom.

```js [ESM]
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```
ou

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Tenter de définir un nom ou une valeur de champ d'en-tête qui contient des caractères non valides entraînera la levée d'une [`TypeError`](/fr/nodejs/api/errors#class-typeerror).

Lorsque des en-têtes ont été définis avec [`response.setHeader()`](/fr/nodejs/api/http2#responsesetheadername-value), ils seront fusionnés avec tous les en-têtes transmis à [`response.writeHead()`](/fr/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), les en-têtes transmis à [`response.writeHead()`](/fr/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) ayant la priorité.

```js [ESM]
// Renvoie content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Ajoutée dans : v8.4.0**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<http2.Http2ServerResponse\>](/fr/nodejs/api/http2#class-http2http2serverresponse)

Définit la valeur de timeout du [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) à `msecs`. Si un callback est fourni, il est ajouté en tant qu'écouteur sur l'événement `'timeout'` de l'objet réponse.

Si aucun écouteur `'timeout'` n'est ajouté à la requête, à la réponse ou au serveur, les [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream)s sont détruits lorsqu'ils expirent. Si un gestionnaire est assigné aux événements `'timeout'` de la requête, de la réponse ou du serveur, les sockets ayant expiré doivent être gérés explicitement.

#### `response.socket` {#responsesocket}

**Ajoutée dans : v8.4.0**

- [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) | [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket)

Retourne un objet `Proxy` qui agit comme un `net.Socket` (ou `tls.TLSSocket`) mais applique des getters, setters et méthodes basés sur la logique HTTP/2.

Les propriétés `destroyed`, `readable` et `writable` seront récupérées et définies sur `response.stream`.

Les méthodes `destroy`, `emit`, `end`, `on` et `once` seront appelées sur `response.stream`.

La méthode `setTimeout` sera appelée sur `response.stream.session`.

`pause`, `read`, `resume` et `write` lanceront une erreur avec le code `ERR_HTTP2_NO_SOCKET_MANIPULATION`. Voir [`Http2Session` et Sockets](/fr/nodejs/api/http2#http2session-and-sockets) pour plus d'informations.

Toutes les autres interactions seront routées directement vers le socket.

::: code-group
```js [ESM]
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::


#### `response.statusCode` {#responsestatuscode}

**Ajouté dans : v8.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lorsque vous utilisez des en-têtes implicites (sans appeler [`response.writeHead()`](/fr/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) explicitement), cette propriété contrôle le code d'état qui sera envoyé au client lorsque les en-têtes seront purgés.

```js [ESM]
response.statusCode = 404;
```
Une fois que l'en-tête de réponse a été envoyé au client, cette propriété indique le code d'état qui a été envoyé.

#### `response.statusMessage` {#responsestatusmessage}

**Ajouté dans : v8.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le message d'état n'est pas pris en charge par HTTP/2 (RFC 7540 8.1.2.4). Il renvoie une chaîne vide.

#### `response.stream` {#responsestream}

**Ajouté dans : v8.4.0**

- [\<Http2Stream\>](/fr/nodejs/api/http2#class-http2stream)

L'objet [`Http2Stream`](/fr/nodejs/api/http2#class-http2stream) qui soutient la réponse.

#### `response.writableEnded` {#responsewritableended}

**Ajouté dans : v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après que [`response.end()`](/fr/nodejs/api/http2#responseenddata-encoding-callback) ait été appelé. Cette propriété n'indique pas si les données ont été purgées ; pour cela, utilisez plutôt [`writable.writableFinished`](/fr/nodejs/api/stream#writablewritablefinished).

#### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}

**Ajouté dans : v8.4.0**

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si cette méthode est appelée et que [`response.writeHead()`](/fr/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) n'a pas été appelée, elle passera en mode d'en-tête implicite et purgera les en-têtes implicites.

Ceci envoie un morceau du corps de la réponse. Cette méthode peut être appelée plusieurs fois pour fournir des parties successives du corps.

Dans le module `node:http`, le corps de la réponse est omis lorsque la requête est une requête HEAD. De même, les réponses `204` et `304` *ne doivent pas* inclure de corps de message.

`chunk` peut être une chaîne de caractères ou un buffer. Si `chunk` est une chaîne de caractères, le deuxième paramètre spécifie comment l'encoder en un flux d'octets. Par défaut, l'`encoding` est `'utf8'`. `callback` sera appelée lorsque ce morceau de données sera purgé.

Il s'agit du corps HTTP brut et cela n'a rien à voir avec les encodages de corps multi-parties de plus haut niveau qui peuvent être utilisés.

La première fois que [`response.write()`](/fr/nodejs/api/http2#responsewritechunk-encoding-callback) est appelée, elle envoie les informations d'en-tête mises en mémoire tampon et le premier morceau du corps au client. La deuxième fois que [`response.write()`](/fr/nodejs/api/http2#responsewritechunk-encoding-callback) est appelée, Node.js suppose que les données seront diffusées en continu et envoie les nouvelles données séparément. C'est-à-dire que la réponse est mise en mémoire tampon jusqu'au premier morceau du corps.

Retourne `true` si la totalité des données a été purgée avec succès dans le tampon du noyau. Retourne `false` si tout ou partie des données a été mise en file d'attente dans la mémoire de l'utilisateur. `'drain'` sera émis lorsque le tampon sera à nouveau libre.


#### `response.writeContinue()` {#responsewritecontinue}

**Ajouté dans : v8.4.0**

Envoie un statut `100 Continue` au client, indiquant que le corps de la requête doit être envoyé. Voir l'événement [`'checkContinue'`](/fr/nodejs/api/http2#event-checkcontinue) sur `Http2Server` et `Http2SecureServer`.

#### `response.writeEarlyHints(hints)` {#responsewriteearlyhintshints}

**Ajouté dans : v18.11.0**

- `hints` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envoie un statut `103 Early Hints` au client avec un en-tête Link, indiquant que l'agent utilisateur peut précharger/préconnecter les ressources liées. `hints` est un objet contenant les valeurs des en-têtes à envoyer avec le message des premières indications.

**Exemple**

```js [ESM]
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
});
```
#### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v11.10.0, v10.17.0 | Retourne `this` depuis `writeHead()` pour permettre le chaînage avec `end()`. |
| v8.4.0 | Ajouté dans : v8.4.0 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Retourne : [\<http2.Http2ServerResponse\>](/fr/nodejs/api/http2#class-http2http2serverresponse)

Envoie un en-tête de réponse à la requête. Le code de statut est un code de statut HTTP à 3 chiffres, tel que `404`. Le dernier argument, `headers`, correspond aux en-têtes de réponse.

Retourne une référence à `Http2ServerResponse`, afin que les appels puissent être chaînés.

Pour assurer la compatibilité avec [HTTP/1](/fr/nodejs/api/http), un `statusMessage` lisible par l'homme peut être transmis comme deuxième argument. Toutefois, étant donné que `statusMessage` n'a aucune signification dans HTTP/2, l'argument n'aura aucun effet et un avertissement de processus sera émis.

```js [ESM]
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```
`Content-Length` est indiqué en octets et non en caractères. L'API `Buffer.byteLength()` peut être utilisée pour déterminer le nombre d'octets dans un encodage donné. Sur les messages sortants, Node.js ne vérifie pas si Content-Length et la longueur du corps transmis sont égaux ou non. Cependant, lors de la réception de messages, Node.js rejettera automatiquement les messages lorsque le `Content-Length` ne correspond pas à la taille réelle de la charge utile.

Cette méthode ne peut être appelée qu'une seule fois sur un message avant que [`response.end()`](/fr/nodejs/api/http2#responseenddata-encoding-callback) ne soit appelé.

Si [`response.write()`](/fr/nodejs/api/http2#responsewritechunk-encoding-callback) ou [`response.end()`](/fr/nodejs/api/http2#responseenddata-encoding-callback) sont appelés avant d'appeler ceci, les en-têtes implicites/modifiables seront calculés et appelleront cette fonction.

Lorsque des en-têtes ont été définis avec [`response.setHeader()`](/fr/nodejs/api/http2#responsesetheadername-value), ils seront fusionnés avec tous les en-têtes transmis à [`response.writeHead()`](/fr/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers), les en-têtes transmis à [`response.writeHead()`](/fr/nodejs/api/http2#responsewriteheadstatuscode-statusmessage-headers) ayant priorité.

```js [ESM]
// Retourne content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```
Toute tentative de définition d'un nom ou d'une valeur de champ d'en-tête contenant des caractères non valides entraînera la levée d'une [`TypeError`](/fr/nodejs/api/errors#class-typeerror).


## Collecte des métriques de performance HTTP/2 {#collecting-http/2-performance-metrics}

L'API [Performance Observer](/fr/nodejs/api/perf_hooks) peut être utilisée pour collecter des métriques de performance de base pour chaque instance `Http2Session` et `Http2Stream`.

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // affiche 'http2'
  if (entry.name === 'Http2Session') {
    // L'entrée contient des statistiques sur la Http2Session
  } else if (entry.name === 'Http2Stream') {
    // L'entrée contient des statistiques sur la Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```js [CJS]
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // affiche 'http2'
  if (entry.name === 'Http2Session') {
    // L'entrée contient des statistiques sur la Http2Session
  } else if (entry.name === 'Http2Stream') {
    // L'entrée contient des statistiques sur la Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```
:::

La propriété `entryType` de `PerformanceEntry` sera égale à `'http2'`.

La propriété `name` de `PerformanceEntry` sera égale à `'Http2Stream'` ou `'Http2Session'`.

Si `name` est égal à `Http2Stream`, la `PerformanceEntry` contiendra les propriétés supplémentaires suivantes :

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets de trame `DATA` reçus pour ce `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets de trame `DATA` envoyés pour ce `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'identifiant du `Http2Stream` associé
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes écoulées entre le `startTime` de `PerformanceEntry` et la réception de la première trame `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes écoulées entre le `startTime` de `PerformanceEntry` et l'envoi de la première trame `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes écoulées entre le `startTime` de `PerformanceEntry` et la réception du premier en-tête.

Si `name` est égal à `Http2Session`, la `PerformanceEntry` contiendra les propriétés supplémentaires suivantes :

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets reçus pour cette `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'octets envoyés pour cette `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de trames HTTP/2 reçues par la `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de trames HTTP/2 envoyées par la `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre maximal de flux ouverts simultanément pendant la durée de vie de la `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes écoulées depuis la transmission d'une trame `PING` et la réception de son accusé de réception. Présent uniquement si une trame `PING` a été envoyée sur la `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durée moyenne (en millisecondes) pour toutes les instances `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre d'instances `Http2Stream` traitées par la `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'server'` soit `'client'` pour identifier le type de `Http2Session`.


## Note sur `:authority` et `host` {#note-on-authority-and-host}

HTTP/2 exige que les requêtes aient soit le pseudo-en-tête `:authority`, soit l'en-tête `host`. Préférez `:authority` lors de la construction directe d'une requête HTTP/2, et `host` lors de la conversion depuis HTTP/1 (dans les proxies, par exemple).

L'API de compatibilité utilise `host` comme solution de repli si `:authority` est absent. Consultez [`request.authority`](/fr/nodejs/api/http2#requestauthority) pour plus d'informations. Cependant, si vous n'utilisez pas l'API de compatibilité (ou si vous utilisez directement `req.headers`), vous devez implémenter vous-même tout comportement de repli.

