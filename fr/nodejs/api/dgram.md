---
title: Documentation Node.js - dgram
description: Le module dgram fournit une implémentation des sockets de datagrammes UDP, permettant la création d'applications client et serveur capables d'envoyer et de recevoir des paquets de datagrammes.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module dgram fournit une implémentation des sockets de datagrammes UDP, permettant la création d'applications client et serveur capables d'envoyer et de recevoir des paquets de datagrammes.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - dgram | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module dgram fournit une implémentation des sockets de datagrammes UDP, permettant la création d'applications client et serveur capables d'envoyer et de recevoir des paquets de datagrammes.
---


# Sockets UDP/datagramme {#udp/datagram-sockets}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/dgram.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dgram.js)

Le module `node:dgram` fournit une implémentation des sockets de datagramme UDP.

::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::

## Classe : `dgram.Socket` {#class-dgramsocket}

**Ajouté dans : v0.1.99**

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Encapsule la fonctionnalité de datagramme.

De nouvelles instances de `dgram.Socket` sont créées à l'aide de [`dgram.createSocket()`](/fr/nodejs/api/dgram#dgramcreatesocketoptions-callback). Le mot-clé `new` ne doit pas être utilisé pour créer des instances de `dgram.Socket`.

### Événement : `'close'` {#event-close}

**Ajouté dans : v0.1.99**

L'événement `'close'` est émis après qu'un socket est fermé avec [`close()`](/fr/nodejs/api/dgram#socketclosecallback). Une fois déclenché, aucun nouvel événement `'message'` ne sera émis sur ce socket.

### Événement : `'connect'` {#event-connect}

**Ajouté dans : v12.0.0**

L'événement `'connect'` est émis après qu'un socket est associé à une adresse distante à la suite d'un appel [`connect()`](/fr/nodejs/api/dgram#socketconnectport-address-callback) réussi.


### Événement : `'error'` {#event-error}

**Ajouté dans : v0.1.99**

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

L’événement `'error'` est émis chaque fois qu’une erreur se produit. La fonction de gestion d’événements reçoit un seul objet `Error`.

### Événement : `'listening'` {#event-listening}

**Ajouté dans : v0.1.99**

L’événement `'listening'` est émis une fois que le `dgram.Socket` est adressable et peut recevoir des données. Cela se produit soit explicitement avec `socket.bind()`, soit implicitement la première fois que des données sont envoyées à l’aide de `socket.send()`. Tant que le `dgram.Socket` n’est pas à l’écoute, les ressources système sous-jacentes n’existent pas et les appels tels que `socket.address()` et `socket.setTTL()` échoueront.

### Événement : `'message'` {#event-message}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0 | La propriété `family` renvoie désormais une chaîne de caractères au lieu d’un nombre. |
| v18.0.0 | La propriété `family` renvoie désormais un nombre au lieu d’une chaîne de caractères. |
| v0.1.99 | Ajouté dans : v0.1.99 |
:::

L’événement `'message'` est émis lorsqu’un nouveau datagramme est disponible sur un socket. La fonction de gestion d’événements reçoit deux arguments : `msg` et `rinfo`.

- `msg` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le message.
- `rinfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Informations sur l’adresse distante.
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’adresse de l’expéditeur.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La famille d’adresses (`'IPv4'` ou `'IPv6'`).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le port de l’expéditeur.
    - `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille du message.
  
 

Si l’adresse source du paquet entrant est une adresse locale de liaison IPv6, le nom de l’interface est ajouté à l’`address`. Par exemple, un paquet reçu sur l’interface `en0` peut avoir le champ d’adresse défini sur `'fe80::2618:1234:ab11:3b9c%en0'`, où `'%en0'` est le nom de l’interface en tant que suffixe d’ID de zone.


### `socket.addMembership(multicastAddress[, multicastInterface])` {#socketaddmembershipmulticastaddress-multicastinterface}

**Ajoutée dans : v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Indique au noyau de rejoindre un groupe de multidiffusion à l'adresse `multicastAddress` et à l'interface `multicastInterface` spécifiées en utilisant l'option de socket `IP_ADD_MEMBERSHIP`. Si l'argument `multicastInterface` n'est pas spécifié, le système d'exploitation choisira une interface et y ajoutera l'appartenance. Pour ajouter l'appartenance à chaque interface disponible, appelez `addMembership` plusieurs fois, une fois par interface.

Lorsqu'elle est appelée sur un socket non lié, cette méthode se liera implicitement à un port aléatoire, en écoutant sur toutes les interfaces.

Lors du partage d'un socket UDP entre plusieurs workers `cluster`, la fonction `socket.addMembership()` ne doit être appelée qu'une seule fois, sinon une erreur `EADDRINUSE` se produira :

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // Works ok.
  cluster.fork(); // Fails with EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```

```js [CJS]
const cluster = require('node:cluster');
const dgram = require('node:dgram');

if (cluster.isPrimary) {
  cluster.fork(); // Works ok.
  cluster.fork(); // Fails with EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```
:::

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketaddsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Ajoutée dans : v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Indique au noyau de rejoindre un canal de multidiffusion spécifique à la source à l'adresse `sourceAddress` et à l'adresse `groupAddress` spécifiées, en utilisant `multicastInterface` avec l'option de socket `IP_ADD_SOURCE_MEMBERSHIP`. Si l'argument `multicastInterface` n'est pas spécifié, le système d'exploitation choisira une interface et y ajoutera l'appartenance. Pour ajouter l'appartenance à chaque interface disponible, appelez `socket.addSourceSpecificMembership()` plusieurs fois, une fois par interface.

Lorsqu'elle est appelée sur un socket non lié, cette méthode se liera implicitement à un port aléatoire, en écoutant sur toutes les interfaces.


### `socket.address()` {#socketaddress}

**Ajouté dans : v0.1.99**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne un objet contenant les informations d'adresse d'un socket. Pour les sockets UDP, cet objet contiendra les propriétés `address`, `family` et `port`.

Cette méthode lève `EBADF` si elle est appelée sur un socket non lié.

### `socket.bind([port][, address][, callback])` {#socketbindport-address-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v0.9.1 | La méthode a été modifiée en un modèle d'exécution asynchrone. Le code existant devra être modifié pour passer une fonction de rappel à l'appel de la méthode. |
| v0.1.99 | Ajouté dans : v0.1.99 |
:::

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) sans paramètres. Appelée lorsque la liaison est terminée.

Pour les sockets UDP, amène le `dgram.Socket` à écouter les messages de datagramme sur un `port` nommé et une `address` optionnelle. Si `port` n'est pas spécifié ou est `0`, le système d'exploitation tentera de se lier à un port aléatoire. Si `address` n'est pas spécifié, le système d'exploitation tentera d'écouter sur toutes les adresses. Une fois la liaison terminée, un événement `'listening'` est émis et la fonction `callback` optionnelle est appelée.

Spécifier à la fois un écouteur d'événements `'listening'` et passer un `callback` à la méthode `socket.bind()` n'est pas nocif mais pas très utile.

Un socket de datagramme lié maintient le processus Node.js en cours d'exécution pour recevoir les messages de datagramme.

Si la liaison échoue, un événement `'error'` est généré. Dans de rares cas (par exemple, tentative de liaison avec un socket fermé), une [`Error`](/fr/nodejs/api/errors#class-error) peut être levée.

Exemple d'un serveur UDP écoutant sur le port 41234 :



::: code-group
```js [ESM]
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```js [CJS]
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```
:::


### `socket.bind(options[, callback])` {#socketbindoptions-callback}

**Ajouté dans : v0.11.14**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Requis. Prend en charge les propriétés suivantes :
    - `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Pour les sockets UDP, amène le `dgram.Socket` à écouter les messages de datagrammes sur un `port` nommé et une `address` optionnelle qui sont passés en tant que propriétés d'un objet `options` passé comme premier argument. Si `port` n'est pas spécifié ou est `0`, le système d'exploitation tentera de se lier à un port aléatoire. Si `address` n'est pas spécifié, le système d'exploitation tentera d'écouter sur toutes les adresses. Une fois la liaison terminée, un événement `'listening'` est émis et la fonction `callback` optionnelle est appelée.

L'objet `options` peut contenir une propriété `fd`. Lorsqu'un `fd` supérieur à `0` est défini, il s'enroule autour d'un socket existant avec le descripteur de fichier donné. Dans ce cas, les propriétés de `port` et `address` seront ignorées.

Spécifier à la fois un écouteur d'événement `'listening'` et passer un `callback` à la méthode `socket.bind()` n'est pas nuisible mais pas très utile.

L'objet `options` peut contenir une propriété supplémentaire `exclusive` qui est utilisée lors de l'utilisation d'objets `dgram.Socket` avec le module [`cluster`](/fr/nodejs/api/cluster). Lorsque `exclusive` est défini sur `false` (la valeur par défaut), les workers de cluster utiliseront le même handle de socket sous-jacent, ce qui permettra de partager les tâches de gestion des connexions. Lorsque `exclusive` est `true`, cependant, le handle n'est pas partagé et toute tentative de partage de port entraîne une erreur. La création d'un `dgram.Socket` avec l'option `reusePort` définie sur `true` fait que `exclusive` est toujours `true` lorsque `socket.bind()` est appelé.

Un socket de datagramme lié maintient le processus Node.js en cours d'exécution pour recevoir les messages de datagramme.

Si la liaison échoue, un événement `'error'` est généré. Dans de rares cas (par exemple, tentative de liaison avec un socket fermé), une [`Error`](/fr/nodejs/api/errors#class-error) peut être levée.

Un exemple de socket écoutant sur un port exclusif est présenté ci-dessous.

```js [ESM]
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.close([callback])` {#socketclosecallback}

**Ajouté dans : v0.1.99**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée lorsque le socket a été fermé.

Ferme le socket sous-jacent et arrête l'écoute des données sur celui-ci. Si un callback est fourni, il est ajouté en tant qu'écouteur de l'événement [`'close'`](/fr/nodejs/api/dgram#event-close).

### `socket[Symbol.asyncDispose]()` {#socketsymbolasyncdispose}

**Ajouté dans : v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Appelle [`socket.close()`](/fr/nodejs/api/dgram#socketclosecallback) et renvoie une promesse qui se réalise lorsque le socket est fermé.

### `socket.connect(port[, address][, callback])` {#socketconnectport-address-callback}

**Ajouté dans : v12.0.0**

- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée lorsque la connexion est terminée ou en cas d'erreur.

Associe le `dgram.Socket` à une adresse et un port distants. Chaque message envoyé par ce handle est automatiquement envoyé à cette destination. De plus, le socket ne recevra que les messages de ce pair distant. Tenter d'appeler `connect()` sur un socket déjà connecté entraînera une exception [`ERR_SOCKET_DGRAM_IS_CONNECTED`](/fr/nodejs/api/errors#err_socket_dgram_is_connected). Si `address` n'est pas fourni, `'127.0.0.1'` (pour les sockets `udp4`) ou `'::1'` (pour les sockets `udp6`) seront utilisés par défaut. Une fois la connexion terminée, un événement `'connect'` est émis et la fonction `callback` optionnelle est appelée. En cas d'échec, le `callback` est appelé ou, à défaut, un événement `'error'` est émis.

### `socket.disconnect()` {#socketdisconnect}

**Ajouté dans : v12.0.0**

Une fonction synchrone qui dissocie un `dgram.Socket` connecté de son adresse distante. Tenter d'appeler `disconnect()` sur un socket non lié ou déjà déconnecté entraînera une exception [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/fr/nodejs/api/errors#err_socket_dgram_not_connected).


### `socket.dropMembership(multicastAddress[, multicastInterface])` {#socketdropmembershipmulticastaddress-multicastinterface}

**Ajoutée dans : v0.6.9**

- `multicastAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Demande au noyau de quitter un groupe multicast à `multicastAddress` en utilisant l'option de socket `IP_DROP_MEMBERSHIP`. Cette méthode est automatiquement appelée par le noyau lorsque le socket est fermé ou que le processus se termine, de sorte que la plupart des applications n'auront jamais de raison de l'appeler.

Si `multicastInterface` n'est pas spécifié, le système d'exploitation tentera de supprimer l'appartenance sur toutes les interfaces valides.

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])` {#socketdropsourcespecificmembershipsourceaddress-groupaddress-multicastinterface}

**Ajoutée dans : v13.1.0, v12.16.0**

- `sourceAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `groupAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `multicastInterface` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Demande au noyau de quitter un canal multicast spécifique à la source à l'adresse `sourceAddress` et `groupAddress` données en utilisant l'option de socket `IP_DROP_SOURCE_MEMBERSHIP`. Cette méthode est automatiquement appelée par le noyau lorsque le socket est fermé ou que le processus se termine, de sorte que la plupart des applications n'auront jamais de raison de l'appeler.

Si `multicastInterface` n'est pas spécifié, le système d'exploitation tentera de supprimer l'appartenance sur toutes les interfaces valides.

### `socket.getRecvBufferSize()` {#socketgetrecvbuffersize}

**Ajoutée dans : v8.7.0**

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la taille en octets de la mémoire tampon de réception de socket `SO_RCVBUF`.

Cette méthode lève [`ERR_SOCKET_BUFFER_SIZE`](/fr/nodejs/api/errors#err_socket_buffer_size) si elle est appelée sur un socket non lié.

### `socket.getSendBufferSize()` {#socketgetsendbuffersize}

**Ajoutée dans : v8.7.0**

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la taille en octets de la mémoire tampon d'envoi de socket `SO_SNDBUF`.

Cette méthode lève [`ERR_SOCKET_BUFFER_SIZE`](/fr/nodejs/api/errors#err_socket_buffer_size) si elle est appelée sur un socket non lié.


### `socket.getSendQueueSize()` {#socketgetsendqueuesize}

**Ajouté dans : v18.8.0, v16.19.0**

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets mis en file d’attente pour l’envoi.

### `socket.getSendQueueCount()` {#socketgetsendqueuecount}

**Ajouté dans : v18.8.0, v16.19.0**

- Retourne : [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre de requêtes d’envoi actuellement dans la file d’attente en attente de traitement.

### `socket.ref()` {#socketref}

**Ajouté dans : v0.9.1**

- Retourne : [\<dgram.Socket\>](/fr/nodejs/api/dgram#class-dgramsocket)

Par défaut, la liaison d’un socket empêchera le processus Node.js de se terminer tant que le socket est ouvert. La méthode `socket.unref()` peut être utilisée pour exclure le socket du comptage de références qui maintient le processus Node.js actif. La méthode `socket.ref()` rajoute le socket au comptage de références et restaure le comportement par défaut.

Appeler `socket.ref()` plusieurs fois n’aura aucun effet supplémentaire.

La méthode `socket.ref()` renvoie une référence au socket afin que les appels puissent être chaînés.

### `socket.remoteAddress()` {#socketremoteaddress}

**Ajouté dans : v12.0.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne un objet contenant l'`address`, la `family` et le `port` du point de terminaison distant. Cette méthode lève une exception [`ERR_SOCKET_DGRAM_NOT_CONNECTED`](/fr/nodejs/api/errors#err_socket_dgram_not_connected) si le socket n’est pas connecté.

### `socket.send(msg[, offset, length][, port][, address][, callback])` {#socketsendmsg-offset-length-port-address-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.0.0 | Le paramètre `address` n’accepte désormais qu’une `string`, `null` ou `undefined`. |
| v14.5.0, v12.19.0 | Le paramètre `msg` peut désormais être n’importe quel `TypedArray` ou `DataView`. |
| v12.0.0 | Ajout du support pour l’envoi de données sur les sockets connectés. |
| v8.0.0 | Le paramètre `msg` peut désormais être un `Uint8Array`. |
| v8.0.0 | Le paramètre `address` est désormais toujours optionnel. |
| v6.0.0 | En cas de succès, `callback` sera désormais appelé avec un argument `error` de `null` plutôt que `0`. |
| v5.7.0 | Le paramètre `msg` peut désormais être un tableau. De plus, les paramètres `offset` et `length` sont désormais optionnels. |
| v0.1.99 | Ajouté dans : v0.1.99 |
:::

- `msg` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Message à envoyer.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Décalage dans le tampon où le message commence.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre d’octets dans le message.
- `port` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port de destination.
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d’hôte ou adresse IP de destination.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée lorsque le message a été envoyé.

Diffuse un datagramme sur le socket. Pour les sockets sans connexion, le `port` et l'`address` de destination doivent être spécifiés. Les sockets connectés, en revanche, utiliseront leur point de terminaison distant associé, de sorte que les arguments `port` et `address` ne doivent pas être définis.

L’argument `msg` contient le message à envoyer. Selon son type, un comportement différent peut s’appliquer. Si `msg` est un `Buffer`, un `TypedArray` ou un `DataView`, `offset` et `length` spécifient le décalage dans le `Buffer` où le message commence et le nombre d’octets dans le message, respectivement. Si `msg` est une `String`, alors elle est automatiquement convertie en un `Buffer` avec l’encodage `'utf8'`. Avec les messages qui contiennent des caractères multi-octets, `offset` et `length` seront calculés par rapport à la [longueur en octets](/fr/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) et non à la position du caractère. Si `msg` est un tableau, `offset` et `length` ne doivent pas être spécifiés.

L’argument `address` est une chaîne de caractères. Si la valeur de `address` est un nom d’hôte, le DNS sera utilisé pour résoudre l’adresse de l’hôte. Si `address` n’est pas fourni ou est nul, `'127.0.0.1'` (pour les sockets `udp4`) ou `'::1'` (pour les sockets `udp6`) sera utilisé par défaut.

Si le socket n’a pas été précédemment lié avec un appel à `bind`, le socket se voit attribuer un numéro de port aléatoire et est lié à l’adresse "toutes les interfaces" (`'0.0.0.0'` pour les sockets `udp4`, `'::0'` pour les sockets `udp6`.)

Une fonction `callback` facultative peut être spécifiée comme moyen de signaler les erreurs DNS ou de déterminer quand il est sûr de réutiliser l’objet `buf`. Les recherches DNS retardent le temps d’envoi d’au moins un tick de la boucle d’événement Node.js.

La seule façon de savoir avec certitude que le datagramme a été envoyé est d’utiliser un `callback`. Si une erreur se produit et qu’un `callback` est donné, l’erreur sera passée comme premier argument au `callback`. Si un `callback` n’est pas donné, l’erreur est émise en tant qu’événement `'error'` sur l’objet `socket`.

Offset et length sont optionnels, mais les deux *doivent* être définis si l’un ou l’autre est utilisé. Ils ne sont pris en charge que lorsque le premier argument est un `Buffer`, un `TypedArray` ou un `DataView`.

Cette méthode lève [`ERR_SOCKET_BAD_PORT`](/fr/nodejs/api/errors#err_socket_bad_port) si elle est appelée sur un socket non lié.

Exemple d’envoi d’un paquet UDP à un port sur `localhost` ;

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```
:::

Exemple d’envoi d’un paquet UDP composé de plusieurs tampons à un port sur `127.0.0.1` ;

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```
:::

L’envoi de plusieurs tampons peut être plus rapide ou plus lent selon l’application et le système d’exploitation. Exécutez des benchmarks pour déterminer la stratégie optimale au cas par cas. En général, cependant, l’envoi de plusieurs tampons est plus rapide.

Exemple d’envoi d’un paquet UDP à l’aide d’un socket connecté à un port sur `localhost` :

::: code-group
```js [ESM]
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```

```js [CJS]
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```
:::

#### Note concernant la taille des datagrammes UDP {#note-about-udp-datagram-size}

La taille maximale d'un datagramme IPv4/v6 dépend de l'`MTU` (Maximum Transmission Unit - Unité de Transmission Maximale) et de la taille du champ `Payload Length` (Longueur de la Charge Utile).

- Le champ `Payload Length` a une largeur de 16 bits, ce qui signifie qu'une charge utile normale ne peut pas dépasser 64K octets, y compris l'en-tête Internet et les données (65 507 octets = 65 535 − 8 octets d'en-tête UDP − 20 octets d'en-tête IP) ; ceci est généralement vrai pour les interfaces de bouclage, mais ces messages de datagramme longs ne sont pas pratiques pour la plupart des hôtes et des réseaux.
- L'`MTU` est la plus grande taille qu'une technologie de couche de liaison donnée peut prendre en charge pour les messages de datagrammes. Pour toute liaison, IPv4 impose une `MTU` minimale de 68 octets, tandis que la `MTU` recommandée pour IPv4 est de 576 (généralement recommandée comme `MTU` pour les applications de type accès commuté), qu'elles arrivent entières ou en fragments. Pour IPv6, la `MTU` minimale est de 1280 octets. Toutefois, la taille minimale obligatoire de la mémoire tampon de réassemblage des fragments est de 1500 octets. La valeur de 68 octets est très petite, car la plupart des technologies de couche de liaison actuelles, comme Ethernet, ont une `MTU` minimale de 1500.

Il est impossible de connaître à l'avance la MTU de chaque liaison par laquelle un paquet pourrait transiter. L'envoi d'un datagramme supérieur à la `MTU` du destinataire ne fonctionnera pas, car le paquet sera supprimé silencieusement sans informer la source que les données n'ont pas atteint le destinataire prévu.

### `socket.setBroadcast(flag)` {#socketsetbroadcastflag}

**Ajouté dans : v0.6.9**

- `flag` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type)

Définit ou efface l'option de socket `SO_BROADCAST`. Lorsque la valeur est définie sur `true`, les paquets UDP peuvent être envoyés à l'adresse de diffusion d'une interface locale.

Cette méthode lève `EBADF` si elle est appelée sur un socket non lié.

### `socket.setMulticastInterface(multicastInterface)` {#socketsetmulticastinterfacemulticastinterface}

**Ajouté dans : v8.6.0**

- `multicastInterface` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type)

*Toutes les références à la portée dans cette section font référence aux
<a href="https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses">Index de zone IPv6</a>, qui sont définis par <a href="https://tools.ietf.org/html/rfc4007">RFC 4007</a>. Sous forme de chaîne, une adresse IP
avec un index de portée est écrite sous la forme <code>'IP%scope'</code> où scope est un nom d'interface
ou un numéro d'interface.*

Définit l'interface de multidiffusion sortante par défaut du socket sur une interface choisie ou rétablit la sélection de l'interface système. L'`interfaceMulticast` doit être une représentation de chaîne valide d'une adresse IP de la famille du socket.

Pour les sockets IPv4, il doit s'agir de l'adresse IP configurée pour l'interface physique souhaitée. Tous les paquets envoyés en multidiffusion sur le socket seront envoyés sur l'interface déterminée par l'utilisation la plus récente et réussie de cet appel.

Pour les sockets IPv6, `multicastInterface` doit inclure une portée pour indiquer l'interface, comme dans les exemples suivants. Dans IPv6, les appels `send` individuels peuvent également utiliser une portée explicite dans les adresses ; par conséquent, seuls les paquets envoyés à une adresse de multidiffusion sans spécifier de portée explicite sont affectés par l'utilisation la plus récente et réussie de cet appel.

Cette méthode lève `EBADF` si elle est appelée sur un socket non lié.


#### Exemple : interface de multidiffusion sortante IPv6 {#example-ipv6-outgoing-multicast-interface}

Sur la plupart des systèmes, où le format de la portée utilise le nom de l’interface :

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```
Sur Windows, où le format de la portée utilise un numéro d’interface :

```js [ESM]
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```
#### Exemple : interface de multidiffusion sortante IPv4 {#example-ipv4-outgoing-multicast-interface}

Tous les systèmes utilisent une IP de l’hôte sur l’interface physique souhaitée :

```js [ESM]
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```
#### Résultats d’appel {#call-results}

Un appel sur un socket qui n’est pas prêt à envoyer ou qui n’est plus ouvert peut générer une [`Error`](/fr/nodejs/api/errors#class-error) *Not running*.

Si `multicastInterface` ne peut pas être analysé en une adresse IP, une [`System Error`](/fr/nodejs/api/errors#class-systemerror) *EINVAL* est générée.

Sur IPv4, si `multicastInterface` est une adresse valide mais ne correspond à aucune interface, ou si l’adresse ne correspond pas à la famille, une [`System Error`](/fr/nodejs/api/errors#class-systemerror) telle que `EADDRNOTAVAIL` ou `EPROTONOSUP` est générée.

Sur IPv6, la plupart des erreurs liées à la spécification ou à l’omission de la portée entraîneront la poursuite de l’utilisation par le socket (ou le retour à) la sélection d’interface par défaut du système.

L’adresse ANY de la famille d’adresses d’un socket (IPv4 `'0.0.0.0'` ou IPv6 `'::'`) peut être utilisée pour renvoyer le contrôle de l’interface sortante par défaut des sockets au système pour les futurs paquets de multidiffusion.

### `socket.setMulticastLoopback(flag)` {#socketsetmulticastloopbackflag}

**Ajouté dans : v0.3.8**

- `flag` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Définit ou efface l’option de socket `IP_MULTICAST_LOOP`. Lorsque cette option est définie sur `true`, les paquets de multidiffusion seront également reçus sur l’interface locale.

Cette méthode génère `EBADF` si elle est appelée sur un socket non lié.

### `socket.setMulticastTTL(ttl)` {#socketsetmulticastttlttl}

**Ajouté dans : v0.3.8**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Définit l’option de socket `IP_MULTICAST_TTL`. Bien que TTL signifie généralement "Time to Live" (durée de vie), dans ce contexte, il spécifie le nombre de sauts IP qu’un paquet est autorisé à effectuer, spécifiquement pour le trafic de multidiffusion. Chaque routeur ou passerelle qui transfère un paquet décrémente le TTL. Si le TTL est décrémenté à 0 par un routeur, il ne sera pas transféré.

L’argument `ttl` peut être compris entre 0 et 255. La valeur par défaut sur la plupart des systèmes est `1`.

Cette méthode génère `EBADF` si elle est appelée sur un socket non lié.


### `socket.setRecvBufferSize(taille)` {#socketsetrecvbuffersizesize}

**Ajouté dans : v8.7.0**

- `taille` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Définit l'option de socket `SO_RCVBUF`. Définit la taille maximale de la mémoire tampon de réception de socket en octets.

Cette méthode émet une erreur [`ERR_SOCKET_BUFFER_SIZE`](/fr/nodejs/api/errors#err_socket_buffer_size) si elle est appelée sur un socket non lié.

### `socket.setSendBufferSize(taille)` {#socketsetsendbuffersizesize}

**Ajouté dans : v8.7.0**

- `taille` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Définit l'option de socket `SO_SNDBUF`. Définit la taille maximale de la mémoire tampon d'envoi de socket en octets.

Cette méthode émet une erreur [`ERR_SOCKET_BUFFER_SIZE`](/fr/nodejs/api/errors#err_socket_buffer_size) si elle est appelée sur un socket non lié.

### `socket.setTTL(ttl)` {#socketsetttlttl}

**Ajouté dans : v0.1.101**

- `ttl` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Définit l'option de socket `IP_TTL`. Bien que TTL signifie généralement "Time to Live" (Durée de vie), dans ce contexte, elle spécifie le nombre de sauts IP qu'un paquet est autorisé à effectuer. Chaque routeur ou passerelle qui transmet un paquet décrémente le TTL. Si le TTL est décrémenté à 0 par un routeur, il ne sera pas transmis. La modification des valeurs TTL est généralement effectuée pour les sondes réseau ou lors de la multidiffusion.

L'argument `ttl` peut être compris entre 1 et 255. La valeur par défaut sur la plupart des systèmes est 64.

Cette méthode émet une erreur `EBADF` si elle est appelée sur un socket non lié.

### `socket.unref()` {#socketunref}

**Ajouté dans : v0.9.1**

- Retourne : [\<dgram.Socket\>](/fr/nodejs/api/dgram#class-dgramsocket)

Par défaut, la liaison d'un socket empêchera le processus Node.js de se fermer tant que le socket est ouvert. La méthode `socket.unref()` peut être utilisée pour exclure le socket du comptage de références qui maintient le processus Node.js actif, permettant au processus de se fermer même si le socket est toujours à l'écoute.

L'appel de `socket.unref()` plusieurs fois n'aura aucun effet supplémentaire.

La méthode `socket.unref()` renvoie une référence au socket afin que les appels puissent être chaînés.


## Fonctions du module `node:dgram` {#nodedgram-module-functions}

### `dgram.createSocket(options[, callback])` {#dgramcreatesocketoptions-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.1.0 | L'option `reusePort` est prise en charge. |
| v15.8.0 | La prise en charge d'AbortSignal a été ajoutée. |
| v11.4.0 | L'option `ipv6Only` est prise en charge. |
| v8.7.0 | Les options `recvBufferSize` et `sendBufferSize` sont désormais prises en charge. |
| v8.6.0 | L'option `lookup` est prise en charge. |
| v0.11.13 | Ajoutée dans : v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Les options disponibles sont :
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La famille de sockets. Doit être `'udp4'` ou `'udp6'`. Requis.
    - `reuseAddr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true` [`socket.bind()`](/fr/nodejs/api/dgram#socketbindport-address-callback) réutilisera l'adresse, même si un autre processus a déjà lié un socket à celle-ci, mais un seul socket peut recevoir les données. **Par défaut :** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true` [`socket.bind()`](/fr/nodejs/api/dgram#socketbindport-address-callback) réutilisera le port, même si un autre processus a déjà lié un socket à celui-ci. Les datagrammes entrants sont distribués aux sockets d'écoute. L'option est disponible uniquement sur certaines plateformes, telles que Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 et AIX 7.2.5+. Sur les plateformes non prises en charge, cette option génère une erreur lorsque le socket est lié. **Par défaut :** `false`.
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définir `ipv6Only` sur `true` désactivera la prise en charge de la double pile, c'est-à-dire que la liaison à l'adresse `::` ne liera pas `0.0.0.0`. **Par défaut :** `false`.
    - `recvBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la valeur de socket `SO_RCVBUF`.
    - `sendBufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit la valeur de socket `SO_SNDBUF`.
    - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction de recherche personnalisée. **Par défaut :** [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback).
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un AbortSignal qui peut être utilisé pour fermer un socket.
    - `receiveBlockList` [\<net.BlockList\>](/fr/nodejs/api/net#class-netblocklist) `receiveBlockList` peut être utilisé pour supprimer les datagrammes entrants vers des adresses IP, des plages d'adresses IP ou des sous-réseaux IP spécifiques. Cela ne fonctionne pas si le serveur se trouve derrière un proxy inverse, un NAT, etc., car l'adresse vérifiée par rapport à la liste de blocage est l'adresse du proxy ou celle spécifiée par le NAT.
    - `sendBlockList` [\<net.BlockList\>](/fr/nodejs/api/net#class-netblocklist) `sendBlockList` peut être utilisé pour désactiver l'accès sortant à des adresses IP, des plages d'adresses IP ou des sous-réseaux IP spécifiques.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Attachée en tant qu'écouteur pour les événements `'message'`. Facultatif.
- Retourne : [\<dgram.Socket\>](/fr/nodejs/api/dgram#class-dgramsocket)

Crée un objet `dgram.Socket`. Une fois le socket créé, l'appel de [`socket.bind()`](/fr/nodejs/api/dgram#socketbindport-address-callback) demandera au socket de commencer à écouter les messages datagrammes. Lorsque `address` et `port` ne sont pas transmis à [`socket.bind()`](/fr/nodejs/api/dgram#socketbindport-address-callback), la méthode liera le socket à l'adresse « toutes les interfaces » sur un port aléatoire (elle fait ce qu'il faut pour les sockets `udp4` et `udp6`). L'adresse et le port liés peuvent être récupérés à l'aide de [`socket.address().address`](/fr/nodejs/api/dgram#socketaddress) et [`socket.address().port`](/fr/nodejs/api/dgram#socketaddress).

Si l'option `signal` est activée, l'appel de `.abort()` sur le `AbortController` correspondant est similaire à l'appel de `.close()` sur le socket :

```js [ESM]
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// Later, when you want to close the server.
controller.abort();
```

### `dgram.createSocket(type[, callback])` {#dgramcreatesockettype-callback}

**Ajouté dans : v0.1.99**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'udp4'`, soit `'udp6'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Attachée en tant qu'écouteur aux événements `'message'`.
- Retourne : [\<dgram.Socket\>](/fr/nodejs/api/dgram#class-dgramsocket)

Crée un objet `dgram.Socket` du `type` spécifié.

Une fois le socket créé, l'appel de [`socket.bind()`](/fr/nodejs/api/dgram#socketbindport-address-callback) demandera au socket de commencer à écouter les messages de datagrammes. Lorsque `address` et `port` ne sont pas passés à [`socket.bind()`](/fr/nodejs/api/dgram#socketbindport-address-callback), la méthode liera le socket à l'adresse "toutes les interfaces" sur un port aléatoire (elle fait ce qu'il faut pour les sockets `udp4` et `udp6`). L'adresse et le port liés peuvent être récupérés en utilisant [`socket.address().address`](/fr/nodejs/api/dgram#socketaddress) et [`socket.address().port`](/fr/nodejs/api/dgram#socketaddress).

