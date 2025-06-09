---
title: Documentation Node.js - Réseau
description: Le module 'net' dans Node.js fournit une API réseau asynchrone pour créer des serveurs et des clients TCP ou IPC basés sur des flux. Il inclut des méthodes pour créer des connexions, des serveurs et gérer les opérations de socket.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Réseau | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module 'net' dans Node.js fournit une API réseau asynchrone pour créer des serveurs et des clients TCP ou IPC basés sur des flux. Il inclut des méthodes pour créer des connexions, des serveurs et gérer les opérations de socket.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Réseau | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module 'net' dans Node.js fournit une API réseau asynchrone pour créer des serveurs et des clients TCP ou IPC basés sur des flux. Il inclut des méthodes pour créer des connexions, des serveurs et gérer les opérations de socket.
---


# Net {#net}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/net.js](https://github.com/nodejs/node/blob/v23.5.0/lib/net.js)

Le module `node:net` fournit une API réseau asynchrone pour la création de serveurs TCP ou [IPC](/fr/nodejs/api/net#ipc-support) basés sur des flux ([`net.createServer()`](/fr/nodejs/api/net#netcreateserveroptions-connectionlistener)) et de clients ([`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection)).

Il est accessible en utilisant :

::: code-group
```js [ESM]
import net from 'node:net';
```

```js [CJS]
const net = require('node:net');
```
:::

## Prise en charge d'IPC {#ipc-support}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.8.0 | Prise en charge de la liaison à un chemin de socket de domaine Unix abstrait comme `\0abstract`. Nous pouvons lier '\0' pour Node.js `\< v20.4.0`. |
:::

Le module `node:net` prend en charge IPC avec des pipes nommés sous Windows et des sockets de domaine Unix sur les autres systèmes d'exploitation.

### Identification des chemins pour les connexions IPC {#identifying-paths-for-ipc-connections}

[`net.connect()`](/fr/nodejs/api/net#netconnect), [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection), [`server.listen()`](/fr/nodejs/api/net#serverlisten) et [`socket.connect()`](/fr/nodejs/api/net#socketconnect) prennent un paramètre `path` pour identifier les points de terminaison IPC.

Sous Unix, le domaine local est également connu sous le nom de domaine Unix. Le chemin est un nom de chemin de système de fichiers. Une erreur sera générée si la longueur du nom de chemin est supérieure à la longueur de `sizeof(sockaddr_un.sun_path)`. Les valeurs typiques sont de 107 octets sous Linux et de 103 octets sous macOS. Si une abstraction d'API Node.js crée le socket de domaine Unix, elle dissociera également le socket de domaine Unix. Par exemple, [`net.createServer()`](/fr/nodejs/api/net#netcreateserveroptions-connectionlistener) peut créer un socket de domaine Unix et [`server.close()`](/fr/nodejs/api/net#serverclosecallback) le dissociera. Mais si un utilisateur crée le socket de domaine Unix en dehors de ces abstractions, l'utilisateur devra le supprimer. Il en va de même lorsqu'une API Node.js crée un socket de domaine Unix, mais que le programme plante ensuite. En bref, un socket de domaine Unix sera visible dans le système de fichiers et persistera jusqu'à sa dissociation. Sous Linux, vous pouvez utiliser un socket abstrait Unix en ajoutant `\0` au début du chemin, tel que `\0abstract`. Le chemin d'accès au socket abstrait Unix n'est pas visible dans le système de fichiers et disparaîtra automatiquement lorsque toutes les références ouvertes au socket seront fermées.

Sous Windows, le domaine local est implémenté à l'aide d'un pipe nommé. Le chemin *doit* faire référence à une entrée dans `\\?\pipe\` ou `\\.\pipe\`. Tous les caractères sont autorisés, mais ce dernier peut effectuer un certain traitement des noms de pipe, tel que la résolution des séquences `..`. Malgré son apparence, l'espace de noms du pipe est plat. Les pipes ne *persisteront pas*. Ils sont supprimés lorsque la dernière référence à eux est fermée. Contrairement aux sockets de domaine Unix, Windows fermera et supprimera le pipe lorsque le processus propriétaire se termine.

L'échappement des chaînes JavaScript nécessite que les chemins soient spécifiés avec un échappement de barre oblique inverse supplémentaire tel que :

```js [ESM]
net.createServer().listen(
  path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

## Class: `net.BlockList` {#class-netblocklist}

**Ajouté dans: v15.0.0, v14.18.0**

L'objet `BlockList` peut être utilisé avec certaines API réseau pour spécifier des règles de désactivation de l'accès entrant ou sortant à des adresses IP, des plages d'adresses IP ou des sous-réseaux IP spécifiques.

### `blockList.addAddress(address[, type])` {#blocklistaddaddressaddress-type}

**Ajouté dans: v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/fr/nodejs/api/net#class-netsocketaddress) Une adresse IPv4 ou IPv6.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'ipv4'` soit `'ipv6'`. **Par défaut:** `'ipv4'`.

Ajoute une règle pour bloquer l'adresse IP donnée.

### `blockList.addRange(start, end[, type])` {#blocklistaddrangestart-end-type}

**Ajouté dans: v15.0.0, v14.18.0**

- `start` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/fr/nodejs/api/net#class-netsocketaddress) L'adresse IPv4 ou IPv6 de début de plage.
- `end` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/fr/nodejs/api/net#class-netsocketaddress) L'adresse IPv4 ou IPv6 de fin de plage.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'ipv4'` soit `'ipv6'`. **Par défaut:** `'ipv4'`.

Ajoute une règle pour bloquer une plage d'adresses IP de `start` (inclus) à `end` (inclus).

### `blockList.addSubnet(net, prefix[, type])` {#blocklistaddsubnetnet-prefix-type}

**Ajouté dans: v15.0.0, v14.18.0**

- `net` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/fr/nodejs/api/net#class-netsocketaddress) L'adresse réseau IPv4 ou IPv6.
- `prefix` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de bits de préfixe CIDR. Pour IPv4, cette valeur doit être comprise entre `0` et `32`. Pour IPv6, elle doit être comprise entre `0` et `128`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'ipv4'` soit `'ipv6'`. **Par défaut:** `'ipv4'`.

Ajoute une règle pour bloquer une plage d'adresses IP spécifiée sous forme de masque de sous-réseau.


### `blockList.check(address[, type])` {#blocklistcheckaddress-type}

**Ajouté dans : v15.0.0, v14.18.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<net.SocketAddress\>](/fr/nodejs/api/net#class-netsocketaddress) L'adresse IP à vérifier.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'ipv4'` ou `'ipv6'`. **Par défaut :** `'ipv4'`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si l'adresse IP donnée correspond à l'une des règles ajoutées à la `BlockList`.

```js [ESM]
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Affiche : true
console.log(blockList.check('10.0.0.3'));  // Affiche : true
console.log(blockList.check('222.111.111.222'));  // Affiche : false

// La notation IPv6 pour les adresses IPv4 fonctionne :
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Affiche : true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Affiche : true
```
### `blockList.rules` {#blocklistrules}

**Ajouté dans : v15.0.0, v14.18.0**

- Type : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La liste des règles ajoutées à la liste de blocage.

### `BlockList.isBlockList(value)` {#blocklistisblocklistvalue}

**Ajouté dans : v23.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Toute valeur JS
- Retourne `true` si la `value` est un `net.BlockList`.

## Classe : `net.SocketAddress` {#class-netsocketaddress}

**Ajouté dans : v15.14.0, v14.18.0**

### `new net.SocketAddress([options])` {#new-netsocketaddressoptions}

**Ajouté dans : v15.14.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'adresse réseau sous forme de chaîne IPv4 ou IPv6. **Par défaut** : `'127.0.0.1'` si `family` est `'ipv4'` ; `'::'` si `family` est `'ipv6'`.
    - `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'une des valeurs `'ipv4'` ou `'ipv6'`. **Par défaut** : `'ipv4'`.
    - `flowlabel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Une étiquette de flux IPv6 utilisée uniquement si `family` est `'ipv6'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un port IP.


### `socketaddress.address` {#socketaddressaddress}

**Ajouté dans : v15.14.0, v14.18.0**

- Type [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

### `socketaddress.family` {#socketaddressfamily}

**Ajouté dans : v15.14.0, v14.18.0**

- Type [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `'ipv4'` soit `'ipv6'`.

### `socketaddress.flowlabel` {#socketaddressflowlabel}

**Ajouté dans : v15.14.0, v14.18.0**

- Type [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `socketaddress.port` {#socketaddressport}

**Ajouté dans : v15.14.0, v14.18.0**

- Type [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### `SocketAddress.parse(input)` {#socketaddressparseinput}

**Ajouté dans : v23.4.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une chaîne de caractères contenant une adresse IP et un port optionnel, par ex. `123.1.2.3:1234` ou `[1::1]:1234`.
- Retourne : [\<net.SocketAddress\>](/fr/nodejs/api/net#class-netsocketaddress) Renvoie une `SocketAddress` si l'analyse a réussi. Sinon, retourne `undefined`.

## Classe : `net.Server` {#class-netserver}

**Ajouté dans : v0.1.90**

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Cette classe est utilisée pour créer un serveur TCP ou [IPC](/fr/nodejs/api/net#ipc-support).

### `new net.Server([options][, connectionListener])` {#new-netserveroptions-connectionlistener}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Voir [`net.createServer([options][, connectionListener])`](/fr/nodejs/api/net#netcreateserveroptions-connectionlistener).
- `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Automatiquement défini comme écouteur pour l'événement [`'connection'`](/fr/nodejs/api/net#event-connection).
- Retourne : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

`net.Server` est un [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter) avec les événements suivants :

### Événement : `'close'` {#event-close}

**Ajouté dans : v0.5.0**

Émis lorsque le serveur se ferme. Si des connexions existent, cet événement n'est pas émis tant que toutes les connexions ne sont pas terminées.


### Événement : `'connection'` {#event-connection}

**Ajouté dans : v0.1.90**

- [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) L’objet de connexion

Émis lorsqu’une nouvelle connexion est établie. `socket` est une instance de `net.Socket`.

### Événement : `'error'` {#event-error}

**Ajouté dans : v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Émis lorsqu’une erreur se produit. Contrairement à [`net.Socket`](/fr/nodejs/api/net#class-netsocket), l’événement [`'close'`](/fr/nodejs/api/net#event-close) ne sera **pas** émis directement après cet événement, sauf si [`server.close()`](/fr/nodejs/api/net#serverclosecallback) est appelé manuellement. Voir l’exemple dans la discussion sur [`server.listen()`](/fr/nodejs/api/net#serverlisten).

### Événement : `'listening'` {#event-listening}

**Ajouté dans : v0.1.90**

Émis lorsque le serveur a été lié après avoir appelé [`server.listen()`](/fr/nodejs/api/net#serverlisten).

### Événement : `'drop'` {#event-drop}

**Ajouté dans : v18.6.0, v16.17.0**

Lorsque le nombre de connexions atteint le seuil de `server.maxConnections`, le serveur abandonnera les nouvelles connexions et émettra l’événement `'drop'` à la place. S’il s’agit d’un serveur TCP, l’argument est le suivant, sinon l’argument est `undefined`.

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L’argument passé à l’écouteur d’événement.
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Adresse locale.
    - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port local.
    - `localFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Famille locale.
    - `remoteAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Adresse distante.
    - `remotePort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port distant.
    - `remoteFamily` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Famille IP distante. `'IPv4'` ou `'IPv6'`.


### `server.address()` {#serveraddress}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0 | La propriété `family` renvoie désormais une chaîne de caractères au lieu d'un nombre. |
| v18.0.0 | La propriété `family` renvoie désormais un nombre au lieu d'une chaîne de caractères. |
| v0.1.90 | Ajoutée dans : v0.1.90 |
:::

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Retourne l'`address` liée, le nom de la `family` de l'adresse, et le `port` du serveur tel que rapporté par le système d'exploitation s'il est à l'écoute sur un socket IP (utile pour trouver quel port a été assigné lors de l'obtention d'une adresse assignée par le système d'exploitation) : `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

Pour un serveur écoutant sur un pipe ou un socket de domaine Unix, le nom est retourné sous forme de chaîne de caractères.

```js [ESM]
const server = net.createServer((socket) => {
  socket.end('goodbye\n');
}).on('error', (err) => {
  // Handle errors here.
  throw err;
});

// Grab an arbitrary unused port.
server.listen(() => {
  console.log('opened server on', server.address());
});
```
`server.address()` retourne `null` avant que l'événement `'listening'` n'ait été émis ou après l'appel à `server.close()`.

### `server.close([callback])` {#serverclosecallback}

**Ajoutée dans : v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée lorsque le serveur est fermé.
- Retourne : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Empêche le serveur d'accepter de nouvelles connexions et conserve les connexions existantes. Cette fonction est asynchrone, le serveur est finalement fermé lorsque toutes les connexions sont terminées et que le serveur émet un événement [`'close'`](/fr/nodejs/api/net#event-close). La fonction `callback` facultative sera appelée une fois que l'événement `'close'` se produira. Contrairement à cet événement, elle sera appelée avec une `Error` comme seul argument si le serveur n'était pas ouvert lors de sa fermeture.


### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Ajouté dans : v20.5.0, v18.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Appelle [`server.close()`](/fr/nodejs/api/net#serverclosecallback) et retourne une promesse qui se réalise lorsque le serveur est fermé.

### `server.getConnections(callback)` {#servergetconnectionscallback}

**Ajouté dans : v0.9.7**

- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Obtient de manière asynchrone le nombre de connexions simultanées sur le serveur. Fonctionne lorsque des sockets ont été envoyées à des forks.

Le rappel doit prendre deux arguments `err` et `count`.

### `server.listen()` {#serverlisten}

Démarre un serveur en attente de connexions. Un `net.Server` peut être un serveur TCP ou un serveur [IPC](/fr/nodejs/api/net#ipc-support) selon ce qu'il écoute.

Signatures possibles :

- [`server.listen(handle[, backlog][, callback])`](/fr/nodejs/api/net#serverlistenhandle-backlog-callback)
- [`server.listen(options[, callback])`](/fr/nodejs/api/net#serverlistenoptions-callback)
- [`server.listen(path[, backlog][, callback])`](/fr/nodejs/api/net#serverlistenpath-backlog-callback) pour les serveurs [IPC](/fr/nodejs/api/net#ipc-support)
- [`server.listen([port[, host[, backlog]]][, callback])`](/fr/nodejs/api/net#serverlistenport-host-backlog-callback) pour les serveurs TCP

Cette fonction est asynchrone. Lorsque le serveur commence à écouter, l'événement [`'listening'`](/fr/nodejs/api/net#event-listening) est émis. Le dernier paramètre `callback` sera ajouté en tant qu'écouteur de l'événement [`'listening'`](/fr/nodejs/api/net#event-listening).

Toutes les méthodes `listen()` peuvent prendre un paramètre `backlog` pour spécifier la longueur maximale de la file d'attente des connexions en attente. La longueur réelle sera déterminée par le système d'exploitation via des paramètres sysctl tels que `tcp_max_syn_backlog` et `somaxconn` sous Linux. La valeur par défaut de ce paramètre est 511 (et non 512).

Tous les [`net.Socket`](/fr/nodejs/api/net#class-netsocket) sont définis sur `SO_REUSEADDR` (voir [`socket(7)`](https://man7.org/linux/man-pages/man7/socket.7) pour plus de détails).

La méthode `server.listen()` peut être appelée à nouveau si et seulement si une erreur s'est produite lors du premier appel `server.listen()` ou si `server.close()` a été appelé. Sinon, une erreur `ERR_SERVER_ALREADY_LISTEN` sera levée.

L'une des erreurs les plus courantes rencontrées lors de l'écoute est `EADDRINUSE`. Cela se produit lorsqu'un autre serveur écoute déjà sur le `port`/`path`/`handle` demandé. Une façon de gérer cela serait de réessayer après un certain temps :

```js [ESM]
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

#### `server.listen(handle[, backlog][, callback])` {#serverlistenhandle-backlog-callback}

**Ajouté dans : v0.5.10**

- `handle` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre courant des fonctions [`server.listen()`](/fr/nodejs/api/net#serverlisten)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Renvoie : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Démarre un serveur écoutant les connexions sur un `handle` donné qui a déjà été lié à un port, un socket de domaine Unix ou un tube nommé Windows.

L'objet `handle` peut être soit un serveur, soit un socket (n'importe quoi avec un membre `_handle` sous-jacent), soit un objet avec un membre `fd` qui est un descripteur de fichier valide.

L'écoute sur un descripteur de fichier n'est pas prise en charge sous Windows.

#### `server.listen(options[, callback])` {#serverlistenoptions-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v23.1.0 | L'option `reusePort` est prise en charge. |
| v15.6.0 | La prise en charge d'AbortSignal a été ajoutée. |
| v11.4.0 | L'option `ipv6Only` est prise en charge. |
| v0.11.14 | Ajouté dans : v0.11.14 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Requis. Prend en charge les propriétés suivantes :
    - `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre courant des fonctions [`server.listen()`](/fr/nodejs/api/net#serverlisten).
    - `exclusive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ipv6Only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Pour les serveurs TCP, la définition de `ipv6Only` sur `true` désactivera la prise en charge de la double pile, c'est-à-dire que la liaison à l'hôte `::` ne fera pas en sorte que `0.0.0.0` soit lié. **Par défaut :** `false`.
    - `reusePort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Pour les serveurs TCP, la définition de `reusePort` sur `true` permet à plusieurs sockets sur le même hôte de se lier au même port. Les connexions entrantes sont distribuées par le système d'exploitation aux sockets d'écoute. Cette option n'est disponible que sur certaines plateformes, telles que Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 et AIX 7.2.5+. **Par défaut :** `false`.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Sera ignoré si `port` est spécifié. Voir [Identification des chemins pour les connexions IPC](/fr/nodejs/api/net#identifying-paths-for-ipc-connections).
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `readableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Pour les serveurs IPC, rend le pipe lisible pour tous les utilisateurs. **Par défaut :** `false`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un AbortSignal qui peut être utilisé pour fermer un serveur d'écoute.
    - `writableAll` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Pour les serveurs IPC, rend le pipe accessible en écriture pour tous les utilisateurs. **Par défaut :** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) functions.
- Renvoie : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Si `port` est spécifié, il se comporte de la même manière que [`server.listen([port[, host[, backlog]]][, callback])`](/fr/nodejs/api/net#serverlistenport-host-backlog-callback). Sinon, si `path` est spécifié, il se comporte de la même manière que [`server.listen(path[, backlog][, callback])`](/fr/nodejs/api/net#serverlistenpath-backlog-callback). Si aucun d'eux n'est spécifié, une erreur sera levée.

Si `exclusive` est `false` (par défaut), les workers de cluster utiliseront le même handle sous-jacent, ce qui permettra de partager les tâches de gestion des connexions. Lorsque `exclusive` est `true`, le handle n'est pas partagé, et toute tentative de partage de port entraîne une erreur. Un exemple d'écoute sur un port exclusif est présenté ci-dessous.

```js [ESM]
server.listen({
  host: 'localhost',
  port: 80,
  exclusive: true,
});
```
Lorsque `exclusive` est `true` et que le handle sous-jacent est partagé, il est possible que plusieurs workers interrogent un handle avec des backlogs différents. Dans ce cas, le premier `backlog` passé au processus maître sera utilisé.

Le démarrage d'un serveur IPC en tant que root peut rendre le chemin du serveur inaccessible aux utilisateurs non privilégiés. L'utilisation de `readableAll` et `writableAll` rendra le serveur accessible à tous les utilisateurs.

Si l'option `signal` est activée, l'appel de `.abort()` sur le `AbortController` correspondant est similaire à l'appel de `.close()` sur le serveur :

```js [ESM]
const controller = new AbortController();
server.listen({
  host: 'localhost',
  port: 80,
  signal: controller.signal,
});
// Plus tard, lorsque vous souhaitez fermer le serveur.
controller.abort();
```

#### `server.listen(path[, backlog][, callback])` {#serverlistenpath-backlog-callback}

**Ajouté dans : v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chemin que le serveur doit écouter. Voir [Identification des chemins pour les connexions IPC](/fr/nodejs/api/net#identifying-paths-for-ipc-connections).
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre commun des fonctions [`server.listen()`](/fr/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Retourne : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Démarre un serveur [IPC](/fr/nodejs/api/net#ipc-support) en écoutant les connexions sur le `path` donné.

#### `server.listen([port[, host[, backlog]]][, callback])` {#serverlistenport-host-backlog-callback}

**Ajouté dans : v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `backlog` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Paramètre commun des fonctions [`server.listen()`](/fr/nodejs/api/net#serverlisten).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function).
- Retourne : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Démarre un serveur TCP en écoutant les connexions sur le `port` et l'`host` donnés.

Si `port` est omis ou est égal à 0, le système d’exploitation affectera un port inutilisé arbitraire, qui peut être récupéré en utilisant `server.address().port` après que l’événement [`'listening'`](/fr/nodejs/api/net#event-listening) a été émis.

Si `host` est omis, le serveur acceptera les connexions sur l'[adresse IPv6 non spécifiée](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) lorsque IPv6 est disponible, ou l'[adresse IPv4 non spécifiée](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`) autrement.

Dans la plupart des systèmes d’exploitation, l’écoute de l'[adresse IPv6 non spécifiée](https://en.wikipedia.org/wiki/IPv6_address#Unspecified_address) (`::`) peut amener le `net.Server` à également écouter sur l'[adresse IPv4 non spécifiée](https://en.wikipedia.org/wiki/0.0.0.0) (`0.0.0.0`).


### `server.listening` {#serverlistening}

**Ajouté dans: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le serveur est à l'écoute des connexions.

### `server.maxConnections` {#servermaxconnections}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.0.0 | Définir `maxConnections` sur `0` abandonne toutes les connexions entrantes. Auparavant, il était interprété comme `Infinity`. |
| v0.2.0 | Ajouté dans: v0.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Lorsque le nombre de connexions atteint le seuil `server.maxConnections` :

Il n'est pas recommandé d'utiliser cette option une fois qu'un socket a été envoyé à un enfant avec [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options).

### `server.dropMaxConnection` {#serverdropmaxconnection}

**Ajouté dans: v23.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Définissez cette propriété sur `true` pour commencer à fermer les connexions une fois que le nombre de connexions atteint le seuil [`server.maxConnections`][]. Ce paramètre n'est effectif qu'en mode cluster.

### `server.ref()` {#serverref}

**Ajouté dans: v0.9.1**

- Retourne : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Contrairement à `unref()`, appeler `ref()` sur un serveur précédemment `unref` *ne* permettra *pas* au programme de se terminer si c'est le seul serveur restant (le comportement par défaut). Si le serveur est `ref`, appeler `ref()` à nouveau n'aura aucun effet.

### `server.unref()` {#serverunref}

**Ajouté dans: v0.9.1**

- Retourne : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Appeler `unref()` sur un serveur permettra au programme de se terminer si c'est le seul serveur actif dans le système d'événements. Si le serveur est déjà `unref`, appeler `unref()` à nouveau n'aura aucun effet.

## Classe : `net.Socket` {#class-netsocket}

**Ajouté dans : v0.3.4**

- Étend : [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Cette classe est une abstraction d'un socket TCP ou d'un point de terminaison [IPC](/fr/nodejs/api/net#ipc-support) de diffusion en continu (utilise des pipes nommés sur Windows et des sockets de domaine Unix sinon). C'est également un [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter).

Un `net.Socket` peut être créé par l'utilisateur et utilisé directement pour interagir avec un serveur. Par exemple, il est renvoyé par [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection), de sorte que l'utilisateur puisse l'utiliser pour parler au serveur.

Il peut également être créé par Node.js et transmis à l'utilisateur lorsqu'une connexion est reçue. Par exemple, il est transmis aux listeners d'un événement [`'connection'`](/fr/nodejs/api/net#event-connection) émis sur un [`net.Server`](/fr/nodejs/api/net#class-netserver), de sorte que l'utilisateur puisse l'utiliser pour interagir avec le client.


### `new net.Socket([options])` {#new-netsocketoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.14.0 | Prise en charge d'AbortSignal ajoutée. |
| v12.10.0 | Option `onread` ajoutée. |
| v0.3.4 | Ajoutée dans : v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Les options disponibles sont :
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si défini sur `false`, alors le socket terminera automatiquement le côté accessible en écriture lorsque le côté accessible en lecture se terminera. Voir [`net.createServer()`](/fr/nodejs/api/net#netcreateserveroptions-connectionlistener) et l'événement [`'end'`](/fr/nodejs/api/net#event-end) pour plus de détails. **Par défaut :** `false`.
    - `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si spécifié, encapsule un socket existant avec le descripteur de fichier donné, sinon un nouveau socket sera créé.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si spécifié, les données entrantes sont stockées dans un seul `buffer` et transmises au `callback` fourni lorsque des données arrivent sur le socket. Cela entraînera la désactivation de la fonctionnalité de streaming de données. Le socket émettra des événements comme `'error'`, `'end'` et `'close'` comme d'habitude. Les méthodes comme `pause()` et `resume()` se comporteront également comme prévu.
    - `buffer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Soit un bloc de mémoire réutilisable à utiliser pour stocker les données entrantes, soit une fonction qui renvoie un tel bloc.
    - `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Cette fonction est appelée pour chaque bloc de données entrantes. Deux arguments lui sont transmis : le nombre d'octets écrits dans `buffer` et une référence à `buffer`. Renvoie `false` de cette fonction pour `pause()` implicitement le socket. Cette fonction sera exécutée dans le contexte global.
  
 
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Autoriser les lectures sur le socket lorsqu'un `fd` est passé, sinon ignoré. **Par défaut :** `false`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Un signal d’abandon qui peut être utilisé pour détruire le socket.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Autoriser les écritures sur le socket lorsqu'un `fd` est passé, sinon ignoré. **Par défaut :** `false`.
  
 
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Crée un nouvel objet socket.

Le socket nouvellement créé peut être soit un socket TCP, soit un point de terminaison [IPC](/fr/nodejs/api/net#ipc-support) en streaming, selon ce à quoi il [`connect()`](/fr/nodejs/api/net#socketconnect) se connecte.


### Événement : `'close'` {#event-close_1}

**Ajouté dans : v0.1.90**

- `hadError` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si le socket a rencontré une erreur de transmission.

Émis une fois que le socket est complètement fermé. L'argument `hadError` est un booléen qui indique si le socket a été fermé en raison d'une erreur de transmission.

### Événement : `'connect'` {#event-connect}

**Ajouté dans : v0.1.90**

Émis lorsqu'une connexion socket est établie avec succès. Voir [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection).

### Événement : `'connectionAttempt'` {#event-connectionattempt}

**Ajouté dans : v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'adresse IP à laquelle le socket tente de se connecter.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le port auquel le socket tente de se connecter.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La famille de l'adresse IP. Il peut s'agir de `6` pour IPv6 ou de `4` pour IPv4.

Émis lorsqu'une nouvelle tentative de connexion est démarrée. Ceci peut être émis plusieurs fois si l'algorithme de sélection automatique de la famille est activé dans [`socket.connect(options)`](/fr/nodejs/api/net#socketconnectoptions-connectlistener).

### Événement : `'connectionAttemptFailed'` {#event-connectionattemptfailed}

**Ajouté dans : v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'adresse IP à laquelle le socket a tenté de se connecter.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le port auquel le socket a tenté de se connecter.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La famille de l'adresse IP. Il peut s'agir de `6` pour IPv6 ou de `4` pour IPv4.
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'erreur associée à l'échec.

Émis lorsqu'une tentative de connexion a échoué. Ceci peut être émis plusieurs fois si l'algorithme de sélection automatique de la famille est activé dans [`socket.connect(options)`](/fr/nodejs/api/net#socketconnectoptions-connectlistener).


### Événement : `'connectionAttemptTimeout'` {#event-connectionattempttimeout}

**Ajouté dans : v21.6.0, v20.12.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'adresse IP à laquelle le socket a tenté de se connecter.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le port auquel le socket a tenté de se connecter.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La famille de l'adresse IP. Elle peut être `6` pour IPv6 ou `4` pour IPv4.

Émis lorsqu'une tentative de connexion a expiré. Cet événement n'est émis (et peut être émis plusieurs fois) que si l'algorithme de sélection automatique de la famille est activé dans [`socket.connect(options)`](/fr/nodejs/api/net#socketconnectoptions-connectlistener).

### Événement : `'data'` {#event-data}

**Ajouté dans : v0.1.90**

- [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Émis lorsque des données sont reçues. L'argument `data` sera un `Buffer` ou une `String`. L'encodage des données est défini par [`socket.setEncoding()`](/fr/nodejs/api/net#socketsetencodingencoding).

Les données seront perdues s'il n'y a pas d'écouteur lorsqu'un `Socket` émet un événement `'data'`.

### Événement : `'drain'` {#event-drain}

**Ajouté dans : v0.1.90**

Émis lorsque le tampon d'écriture devient vide. Peut être utilisé pour réguler les chargements.

Voir aussi : les valeurs de retour de `socket.write()`.

### Événement : `'end'` {#event-end}

**Ajouté dans : v0.1.90**

Émis lorsque l'autre extrémité du socket signale la fin de la transmission, mettant ainsi fin au côté lisible du socket.

Par défaut (`allowHalfOpen` est `false`), le socket renverra un paquet de fin de transmission et détruira son descripteur de fichier une fois qu'il aura écrit sa file d'attente d'écriture en attente. Cependant, si `allowHalfOpen` est défini sur `true`, le socket ne [`end()`](/fr/nodejs/api/net#socketenddata-encoding-callback) pas automatiquement son côté inscriptible, permettant à l'utilisateur d'écrire des quantités arbitraires de données. L'utilisateur doit appeler [`end()`](/fr/nodejs/api/net#socketenddata-encoding-callback) explicitement pour fermer la connexion (c'est-à-dire renvoyer un paquet FIN).


### Événement : `'error'` {#event-error_1}

**Ajouté dans : v0.1.90**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Émis lorsqu'une erreur se produit. L'événement `'close'` sera appelé directement après cet événement.

### Événement : `'lookup'` {#event-lookup}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.10.0 | Le paramètre `host` est désormais pris en charge. |
| v0.11.3 | Ajouté dans : v0.11.3 |
:::

Émis après la résolution du nom d'hôte, mais avant la connexion. Ne s'applique pas aux sockets Unix.

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) L'objet d'erreur. Voir [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback).
- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'adresse IP.
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Le type d'adresse. Voir [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom d'hôte.

### Événement : `'ready'` {#event-ready}

**Ajouté dans : v9.11.0**

Émis lorsqu'un socket est prêt à être utilisé.

Déclenché immédiatement après `'connect'`.

### Événement : `'timeout'` {#event-timeout}

**Ajouté dans : v0.1.90**

Émis si le socket expire en raison de l'inactivité. Ceci sert uniquement à indiquer que le socket est inactif. L'utilisateur doit fermer manuellement la connexion.

Voir aussi : [`socket.setTimeout()`](/fr/nodejs/api/net#socketsettimeouttimeout-callback).

### `socket.address()` {#socketaddress}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0 | La propriété `family` renvoie désormais une chaîne au lieu d'un nombre. |
| v18.0.0 | La propriété `family` renvoie désormais un nombre au lieu d'une chaîne. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- Renvoie : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Renvoie l'`address` liée, le nom de la `family` d'adresse et le `port` du socket tel que rapporté par le système d'exploitation : `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`


### `socket.autoSelectFamilyAttemptedAddresses` {#socketautoselectfamilyattemptedaddresses}

**Ajouté dans : v19.4.0, v18.18.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cette propriété est uniquement présente si l’algorithme de sélection automatique de la famille est activé dans [`socket.connect(options)`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) et c’est un tableau des adresses qui ont été tentées.

Chaque adresse est une chaîne sous la forme de `$IP:$PORT`. Si la connexion a réussi, alors la dernière adresse est celle à laquelle le socket est actuellement connecté.

### `socket.bufferSize` {#socketbuffersize}

**Ajouté dans : v0.3.8**

**Déprécié depuis : v14.6.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez plutôt [`writable.writableLength`](/fr/nodejs/api/stream#writablewritablelength).
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cette propriété indique le nombre de caractères mis en mémoire tampon pour l’écriture. La mémoire tampon peut contenir des chaînes dont la longueur après encodage n’est pas encore connue. Ce nombre n’est donc qu’une approximation du nombre d’octets dans la mémoire tampon.

`net.Socket` a la propriété que `socket.write()` fonctionne toujours. Ceci vise à aider les utilisateurs à démarrer rapidement. L’ordinateur ne peut pas toujours suivre la quantité de données qui sont écrites dans un socket. La connexion réseau peut simplement être trop lente. Node.js mettra en file d’attente en interne les données écrites dans un socket et les enverra sur le réseau lorsque cela sera possible.

La conséquence de cette mise en mémoire tampon interne est que la mémoire peut augmenter. Les utilisateurs qui rencontrent une `bufferSize` importante ou croissante doivent tenter d’« étrangler » les flux de données dans leur programme avec [`socket.pause()`](/fr/nodejs/api/net#socketpause) et [`socket.resume()`](/fr/nodejs/api/net#socketresume).

### `socket.bytesRead` {#socketbytesread}

**Ajouté dans : v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La quantité d’octets reçus.


### `socket.bytesWritten` {#socketbyteswritten}

**Ajouté dans : v0.5.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La quantité d’octets envoyés.

### `socket.connect()` {#socketconnect}

Lance une connexion sur un socket donné.

Signatures possibles :

- [`socket.connect(options[, connectListener])`](/fr/nodejs/api/net#socketconnectoptions-connectlistener)
- [`socket.connect(path[, connectListener])`](/fr/nodejs/api/net#socketconnectpath-connectlistener) pour les connexions [IPC](/fr/nodejs/api/net#ipc-support).
- [`socket.connect(port[, host][, connectListener])`](/fr/nodejs/api/net#socketconnectport-host-connectlistener) pour les connexions TCP.
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Cette fonction est asynchrone. Lorsque la connexion est établie, l’événement [`'connect'`](/fr/nodejs/api/net#event-connect) est émis. S’il y a un problème de connexion, au lieu d’un événement [`'connect'`](/fr/nodejs/api/net#event-connect), un événement [`'error'`](/fr/nodejs/api/net#event-error_1) est émis avec l’erreur passée au listener [`'error'`](/fr/nodejs/api/net#event-error_1). Le dernier paramètre `connectListener`, s’il est fourni, sera ajouté en tant que listener pour l’événement [`'connect'`](/fr/nodejs/api/net#event-connect) **une seule fois**.

Cette fonction ne doit être utilisée que pour reconnecter un socket après l’émission de `'close'` ou cela peut entraîner un comportement indéfini.

#### `socket.connect(options[, connectListener])` {#socketconnectoptions-connectlistener}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.4.0 | La valeur par défaut de l’option autoSelectFamily peut être modifiée à l’exécution à l’aide de `setDefaultAutoSelectFamily` ou via l’option de ligne de commande `--enable-network-family-autoselection`. |
| v20.0.0, v18.18.0 | La valeur par défaut de l’option autoSelectFamily est désormais true. L’indicateur CLI `--enable-network-family-autoselection` a été renommé en `--network-family-autoselection`. L’ancien nom est désormais un alias, mais il est déconseillé. |
| v19.3.0, v18.13.0 | Ajout de l’option `autoSelectFamily`. |
| v17.7.0, v16.15.0 | Les options `noDelay`, `keepAlive` et `keepAliveInitialDelay` sont désormais prises en charge. |
| v6.0.0 | L’option `hints` a désormais par défaut la valeur `0` dans tous les cas. Auparavant, en l’absence de l’option `family`, elle avait par défaut la valeur `dns.ADDRCONFIG | dns.V4MAPPED`. |
| v5.11.0 | L’option `hints` est désormais prise en charge. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Paramètre commun des méthodes [`socket.connect()`](/fr/nodejs/api/net#socketconnect). Sera ajouté en tant que listener pour l’événement [`'connect'`](/fr/nodejs/api/net#event-connect) une seule fois.
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Lance une connexion sur un socket donné. Normalement, cette méthode n’est pas nécessaire, le socket doit être créé et ouvert avec [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection). Utilisez ceci uniquement lors de l’implémentation d’un Socket personnalisé.

Pour les connexions TCP, les `options` disponibles sont :

- `autoSelectFamily` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) : Si la valeur est définie sur `true`, elle active un algorithme de détection automatique de la famille qui implémente de manière vague la section 5 de [RFC 8305](https://www.rfc-editor.org/rfc/rfc8305.txt). L’option `all` passée à lookup est définie sur `true` et les sockets tentent de se connecter à toutes les adresses IPv6 et IPv4 obtenues, en séquence, jusqu’à ce qu’une connexion soit établie. La première adresse AAAA renvoyée est essayée en premier, puis la première adresse A renvoyée, puis la deuxième adresse AAAA renvoyée, et ainsi de suite. Chaque tentative de connexion (mais la dernière) reçoit la durée spécifiée par l’option `autoSelectFamilyAttemptTimeout` avant d’expirer et d’essayer l’adresse suivante. Ignoré si l’option `family` n’est pas `0` ou si `localAddress` est définie. Les erreurs de connexion ne sont pas émises si au moins une connexion réussit. Si toutes les tentatives de connexion échouent, un seul `AggregateError` avec toutes les tentatives échouées est émis. **Par défaut :** [`net.getDefaultAutoSelectFamily()`](/fr/nodejs/api/net#netgetdefaultautoselectfamily).
- `autoSelectFamilyAttemptTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) : Le délai en millisecondes à attendre qu’une tentative de connexion se termine avant d’essayer l’adresse suivante lors de l’utilisation de l’option `autoSelectFamily`. Si la valeur est définie sur un entier positif inférieur à `10`, la valeur `10` sera utilisée à la place. **Par défaut :** [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/fr/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).
- `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) : Version de la pile IP. Doit être `4`, `6` ou `0`. La valeur `0` indique que les adresses IPv4 et IPv6 sont autorisées. **Par défaut :** `0`.
- `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Indicateurs [`dns.lookup()`](/fr/nodejs/api/dns#supported-getaddrinfo-flags) facultatifs.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hôte auquel le socket doit se connecter. **Par défaut :** `'localhost'`.
- `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, elle active la fonctionnalité keep-alive sur le socket immédiatement après l’établissement de la connexion, de la même manière que ce qui est fait dans [`socket.setKeepAlive()`](/fr/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Par défaut :** `false`.
- `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si la valeur est définie sur un nombre positif, elle définit le délai initial avant que la première sonde keepalive soit envoyée sur un socket inactif. **Par défaut :** `0`.
- `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Adresse locale à partir de laquelle le socket doit se connecter.
- `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port local à partir duquel le socket doit se connecter.
- `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction de recherche personnalisée. **Par défaut :** [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback).
- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, elle désactive l’utilisation de l’algorithme de Nagle immédiatement après l’établissement du socket. **Par défaut :** `false`.
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Obligatoire. Port auquel le socket doit se connecter.
- `blockList` [\<net.BlockList\>](/fr/nodejs/api/net#class-netblocklist) `blockList` peut être utilisé pour désactiver l’accès sortant à des adresses IP, des plages IP ou des sous-réseaux IP spécifiques.

Pour les connexions [IPC](/fr/nodejs/api/net#ipc-support), les `options` disponibles sont :

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Obligatoire. Chemin auquel le client doit se connecter. Voir [Identification des chemins pour les connexions IPC](/fr/nodejs/api/net#identifying-paths-for-ipc-connections). S’il est fourni, les options spécifiques à TCP ci-dessus sont ignorées.


#### `socket.connect(path[, connectListener])` {#socketconnectpath-connectlistener}

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chemin auquel le client doit se connecter. Voir [Identification des chemins pour les connexions IPC](/fr/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Paramètre courant des méthodes [`socket.connect()`](/fr/nodejs/api/net#socketconnect). Sera ajouté en tant qu'écouteur pour l'événement [`'connect'`](/fr/nodejs/api/net#event-connect) une seule fois.
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Lance une connexion [IPC](/fr/nodejs/api/net#ipc-support) sur le socket donné.

Alias de [`socket.connect(options[, connectListener])`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) appelé avec `{ path: path }` comme `options`.

#### `socket.connect(port[, host][, connectListener])` {#socketconnectport-host-connectlistener}

**Ajouté dans : v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port auquel le client doit se connecter.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hôte auquel le client doit se connecter.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Paramètre courant des méthodes [`socket.connect()`](/fr/nodejs/api/net#socketconnect). Sera ajouté en tant qu'écouteur pour l'événement [`'connect'`](/fr/nodejs/api/net#event-connect) une seule fois.
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Lance une connexion TCP sur le socket donné.

Alias de [`socket.connect(options[, connectListener])`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) appelé avec `{port: port, host: host}` comme `options`.

### `socket.connecting` {#socketconnecting}

**Ajouté dans : v6.1.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si `true`, [`socket.connect(options[, connectListener])`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) a été appelé et n'est pas encore terminé. Il restera `true` jusqu'à ce que le socket soit connecté, puis il est défini sur `false` et l'événement `'connect'` est émis. Notez que le rappel [`socket.connect(options[, connectListener])`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) est un écouteur pour l'événement `'connect'`.


### `socket.destroy([error])` {#socketdestroyerror}

**Ajouté dans : v0.1.90**

- `error` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Garantit qu’il n’y a plus d’activité d’E/S sur ce socket. Détruit le flux et ferme la connexion.

Voir [`writable.destroy()`](/fr/nodejs/api/stream#writabledestroyerror) pour plus de détails.

### `socket.destroyed` {#socketdestroyed}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si la connexion est détruite ou non. Une fois qu’une connexion est détruite, aucune autre donnée ne peut être transférée à l’aide de celle-ci.

Voir [`writable.destroyed`](/fr/nodejs/api/stream#writabledestroyed) pour plus de détails.

### `socket.destroySoon()` {#socketdestroysoon}

**Ajouté dans : v0.3.4**

Détruit le socket une fois que toutes les données sont écrites. Si l’événement `'finish'` a déjà été émis, le socket est détruit immédiatement. Si le socket est toujours accessible en écriture, il appelle implicitement `socket.end()`.

### `socket.end([data[, encoding]][, callback])` {#socketenddata-encoding-callback}

**Ajouté dans : v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Utilisé uniquement lorsque les données sont de type `string`. **Par défaut :** `'utf8'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback optionnel lorsque le socket est terminé.
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Ferme le socket à moitié. C’est-à-dire qu’il envoie un paquet FIN. Il est possible que le serveur envoie encore des données.

Voir [`writable.end()`](/fr/nodejs/api/stream#writableendchunk-encoding-callback) pour plus de détails.

### `socket.localAddress` {#socketlocaladdress}

**Ajouté dans : v0.9.6**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La représentation sous forme de chaîne de caractères de l’adresse IP locale sur laquelle le client distant se connecte. Par exemple, dans un serveur écoutant sur `'0.0.0.0'`, si un client se connecte sur `'192.168.1.1'`, la valeur de `socket.localAddress` serait `'192.168.1.1'`.


### `socket.localPort` {#socketlocalport}

**Ajouté dans: v0.9.6**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La représentation numérique du port local. Par exemple, `80` ou `21`.

### `socket.localFamily` {#socketlocalfamily}

**Ajouté dans: v18.8.0, v16.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La représentation sous forme de chaîne de la famille d'adresses IP locale. `'IPv4'` ou `'IPv6'`.

### `socket.pause()` {#socketpause}

- Retourne: [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Interrompt la lecture des données. C'est-à-dire que les événements [`'data'`](/fr/nodejs/api/net#event-data) ne seront pas émis. Utile pour ralentir un téléchargement.

### `socket.pending` {#socketpending}

**Ajouté dans : v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La valeur est `true` si le socket n’est pas encore connecté, soit parce que `.connect()` n’a pas encore été appelé, soit parce qu’il est toujours en cours de connexion (voir [`socket.connecting`](/fr/nodejs/api/net#socketconnecting)).

### `socket.ref()` {#socketref}

**Ajouté dans: v0.9.1**

- Retourne: [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

L'opposé de `unref()`, appeler `ref()` sur un socket précédemment `unref`ed *n'empêchera pas* le programme de se fermer si c'est le seul socket restant (le comportement par défaut). Si le socket est `ref`ed, appeler à nouveau `ref` n'aura aucun effet.

### `socket.remoteAddress` {#socketremoteaddress}

**Ajouté dans: v0.5.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La représentation sous forme de chaîne de l'adresse IP distante. Par exemple, `'74.125.127.100'` ou `'2001:4860:a005::68'`. La valeur peut être `undefined` si le socket est détruit (par exemple, si le client s'est déconnecté).

### `socket.remoteFamily` {#socketremotefamily}

**Ajouté dans: v0.11.14**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La représentation sous forme de chaîne de la famille IP distante. `'IPv4'` ou `'IPv6'`. La valeur peut être `undefined` si le socket est détruit (par exemple, si le client s'est déconnecté).


### `socket.remotePort` {#socketremoteport}

**Ajouté dans : v0.5.10**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La représentation numérique du port distant. Par exemple, `80` ou `21`. La valeur peut être `undefined` si le socket est détruit (par exemple, si le client s’est déconnecté).

### `socket.resetAndDestroy()` {#socketresetanddestroy}

**Ajouté dans : v18.3.0, v16.17.0**

- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Ferme la connexion TCP en envoyant un paquet RST et détruit le flux. Si ce socket TCP est en cours de connexion, il enverra un paquet RST et détruira ce socket TCP une fois qu’il sera connecté. Sinon, il appellera `socket.destroy` avec une erreur `ERR_SOCKET_CLOSED`. S’il ne s’agit pas d’un socket TCP (par exemple, un tube), l’appel de cette méthode lèvera immédiatement une erreur `ERR_INVALID_HANDLE_TYPE`.

### `socket.resume()` {#socketresume}

- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Reprend la lecture après un appel à [`socket.pause()`](/fr/nodejs/api/net#socketpause).

### `socket.setEncoding([encoding])` {#socketsetencodingencoding}

**Ajouté dans : v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Définit l’encodage du socket en tant que [Flux lisible](/fr/nodejs/api/stream#class-streamreadable). Voir [`readable.setEncoding()`](/fr/nodejs/api/stream#readablesetencodingencoding) pour plus d’informations.

### `socket.setKeepAlive([enable][, initialDelay])` {#socketsetkeepaliveenable-initialdelay}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.12.0, v12.17.0 | De nouvelles valeurs par défaut pour les options de socket `TCP_KEEPCNT` et `TCP_KEEPINTVL` ont été ajoutées. |
| v0.1.92 | Ajouté dans : v0.1.92 |
:::

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Active/désactive la fonctionnalité keep-alive, et définit optionnellement le délai initial avant que la première sonde keepalive soit envoyée sur un socket inactif.

Définissez `initialDelay` (en millisecondes) pour définir le délai entre le dernier paquet de données reçu et la première sonde keepalive. Définir `0` pour `initialDelay` laissera la valeur inchangée par rapport au paramètre par défaut (ou précédent).

L’activation de la fonctionnalité keep-alive définira les options de socket suivantes :

- `SO_KEEPALIVE=1`
- `TCP_KEEPIDLE=initialDelay`
- `TCP_KEEPCNT=10`
- `TCP_KEEPINTVL=1`


### `socket.setNoDelay([noDelay])` {#socketsetnodelaynodelay}

**Ajouté dans : v0.1.90**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `true`
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Active/désactive l’utilisation de l’algorithme de Nagle.

Lorsqu’une connexion TCP est créée, l’algorithme de Nagle est activé par défaut.

L’algorithme de Nagle retarde les données avant qu’elles ne soient envoyées via le réseau. Il tente d’optimiser le débit au détriment de la latence.

Passer `true` pour `noDelay` ou ne pas passer d’argument désactivera l’algorithme de Nagle pour le socket. Passer `false` pour `noDelay` activera l’algorithme de Nagle.

### `socket.setTimeout(timeout[, callback])` {#socketsettimeouttimeout-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | La transmission d’un callback invalide à l’argument `callback` lance désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

Définit le socket pour qu’il expire après `timeout` millisecondes d’inactivité sur le socket. Par défaut, `net.Socket` n’a pas de délai d’expiration.

Lorsqu’un délai d’inactivité est déclenché, le socket recevra un événement [`'timeout'`](/fr/nodejs/api/net#event-timeout), mais la connexion ne sera pas coupée. L’utilisateur doit appeler manuellement [`socket.end()`](/fr/nodejs/api/net#socketenddata-encoding-callback) ou [`socket.destroy()`](/fr/nodejs/api/net#socketdestroyerror) pour mettre fin à la connexion.

```js [ESM]
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```

Si `timeout` est 0, le délai d’inactivité existant est désactivé.

Le paramètre facultatif `callback` sera ajouté en tant qu’auditeur unique pour l’événement [`'timeout'`](/fr/nodejs/api/net#event-timeout).


### `socket.timeout` {#sockettimeout}

**Ajouté dans : v10.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Le délai d'attente du socket en millisecondes tel que défini par [`socket.setTimeout()`](/fr/nodejs/api/net#socketsettimeouttimeout-callback). Il est `undefined` si aucun délai d'attente n'a été défini.

### `socket.unref()` {#socketunref}

**Ajouté dans : v0.9.1**

- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket lui-même.

L'appel de `unref()` sur un socket permettra au programme de se terminer s'il s'agit du seul socket actif dans le système d'événements. Si le socket est déjà `unref`é, appeler `unref()` à nouveau n'aura aucun effet.

### `socket.write(data[, encoding][, callback])` {#socketwritedata-encoding-callback}

**Ajouté dans : v0.1.90**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Utilisé uniquement lorsque data est `string`. **Par défaut :** `utf8`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envoie des données sur le socket. Le deuxième paramètre spécifie l'encodage dans le cas d'une chaîne de caractères. Il est par défaut l'encodage UTF8.

Renvoie `true` si toutes les données ont été transférées avec succès dans le buffer du noyau. Renvoie `false` si tout ou partie des données ont été mises en file d'attente dans la mémoire utilisateur. [`'drain'`](/fr/nodejs/api/net#event-drain) sera émis lorsque le buffer sera de nouveau libre.

Le paramètre optionnel `callback` sera exécuté lorsque les données seront finalement écrites, ce qui peut ne pas être immédiat.

Voir la méthode [`write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) du flux `Writable` pour plus d'informations.


### `socket.readyState` {#socketreadystate}

**Ajouté dans : v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Cette propriété représente l'état de la connexion sous forme de chaîne de caractères.

- Si le flux est en cours de connexion, `socket.readyState` est `opening`.
- Si le flux est lisible et accessible en écriture, il est `open`.
- Si le flux est lisible et non accessible en écriture, il est `readOnly`.
- Si le flux n'est pas lisible et accessible en écriture, il est `writeOnly`.

## `net.connect()` {#netconnect}

Alias de [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection).

Signatures possibles :

- [`net.connect(options[, connectListener])`](/fr/nodejs/api/net#netconnectoptions-connectlistener)
- [`net.connect(path[, connectListener])`](/fr/nodejs/api/net#netconnectpath-connectlistener) pour les connexions [IPC](/fr/nodejs/api/net#ipc-support).
- [`net.connect(port[, host][, connectListener])`](/fr/nodejs/api/net#netconnectport-host-connectlistener) pour les connexions TCP.

### `net.connect(options[, connectListener])` {#netconnectoptions-connectlistener}

**Ajouté dans : v0.7.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Alias de [`net.createConnection(options[, connectListener])`](/fr/nodejs/api/net#netcreateconnectionoptions-connectlistener).

### `net.connect(path[, connectListener])` {#netconnectpath-connectlistener}

**Ajouté dans : v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Alias de [`net.createConnection(path[, connectListener])`](/fr/nodejs/api/net#netcreateconnectionpath-connectlistener).

### `net.connect(port[, host][, connectListener])` {#netconnectport-host-connectlistener}

**Ajouté dans : v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Alias de [`net.createConnection(port[, host][, connectListener])`](/fr/nodejs/api/net#netcreateconnectionport-host-connectlistener).


## `net.createConnection()` {#netcreateconnection}

Une fonction usine, qui crée un nouveau [`net.Socket`](/fr/nodejs/api/net#class-netsocket), initie immédiatement une connexion avec [`socket.connect()`](/fr/nodejs/api/net#socketconnect), puis renvoie le `net.Socket` qui démarre la connexion.

Lorsque la connexion est établie, un événement [`'connect'`](/fr/nodejs/api/net#event-connect) est émis sur le socket renvoyé. Le dernier paramètre `connectListener`, s'il est fourni, sera ajouté en tant qu'écouteur de l'événement [`'connect'`](/fr/nodejs/api/net#event-connect) **une seule fois**.

Signatures possibles :

- [`net.createConnection(options[, connectListener])`](/fr/nodejs/api/net#netcreateconnectionoptions-connectlistener)
- [`net.createConnection(path[, connectListener])`](/fr/nodejs/api/net#netcreateconnectionpath-connectlistener) pour les connexions [IPC](/fr/nodejs/api/net#ipc-support).
- [`net.createConnection(port[, host][, connectListener])`](/fr/nodejs/api/net#netcreateconnectionport-host-connectlistener) pour les connexions TCP.

La fonction [`net.connect()`](/fr/nodejs/api/net#netconnect) est un alias de cette fonction.

### `net.createConnection(options[, connectListener])` {#netcreateconnectionoptions-connectlistener}

**Ajouté dans : v0.1.90**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Requis. Sera passé à la fois à l'appel [`new net.Socket([options])`](/fr/nodejs/api/net#new-netsocketoptions) et à la méthode [`socket.connect(options[, connectListener])`](/fr/nodejs/api/net#socketconnectoptions-connectlistener).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Paramètre commun des fonctions [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection). S'il est fourni, sera ajouté une fois en tant qu'écouteur de l'événement [`'connect'`](/fr/nodejs/api/net#event-connect) sur le socket renvoyé.
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket nouvellement créé utilisé pour démarrer la connexion.

Pour les options disponibles, voir [`new net.Socket([options])`](/fr/nodejs/api/net#new-netsocketoptions) et [`socket.connect(options[, connectListener])`](/fr/nodejs/api/net#socketconnectoptions-connectlistener).

Options supplémentaires :

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si défini, sera utilisé pour appeler [`socket.setTimeout(timeout)`](/fr/nodejs/api/net#socketsettimeouttimeout-callback) après la création du socket, mais avant qu'il ne démarre la connexion.

Voici un exemple de client du serveur d'écho décrit dans la section [`net.createServer()`](/fr/nodejs/api/net#netcreateserveroptions-connectionlistener) :

::: code-group
```js [ESM]
import net from 'node:net';
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```

```js [CJS]
const net = require('node:net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
:::

Pour se connecter sur le socket `/tmp/echo.sock` :

```js [ESM]
const client = net.createConnection({ path: '/tmp/echo.sock' });
```
Voici un exemple de client utilisant l'option `port` et `onread`. Dans ce cas, l'option `onread` ne sera utilisée que pour appeler `new net.Socket([options])` et l'option `port` sera utilisée pour appeler `socket.connect(options[, connectListener])`.

::: code-group
```js [ESM]
import net from 'node:net';
import { Buffer } from 'node:buffer';
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```

```js [CJS]
const net = require('node:net');
net.createConnection({
  port: 8124,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    },
  },
});
```
:::


### `net.createConnection(path[, connectListener])` {#netcreateconnectionpath-connectlistener}

**Ajouté dans : v0.1.90**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chemin auquel le socket doit se connecter. Sera passé à [`socket.connect(path[, connectListener])`](/fr/nodejs/api/net#socketconnectpath-connectlistener). Voir [Identification des chemins pour les connexions IPC](/fr/nodejs/api/net#identifying-paths-for-ipc-connections).
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Paramètre courant des fonctions [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection), un listener "once" pour l'événement `'connect'` sur le socket d'initialisation. Sera passé à [`socket.connect(path[, connectListener])`](/fr/nodejs/api/net#socketconnectpath-connectlistener).
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket nouvellement créé utilisé pour démarrer la connexion.

Initie une connexion [IPC](/fr/nodejs/api/net#ipc-support).

Cette fonction crée un nouveau [`net.Socket`](/fr/nodejs/api/net#class-netsocket) avec toutes les options définies par défaut, initie immédiatement la connexion avec [`socket.connect(path[, connectListener])`](/fr/nodejs/api/net#socketconnectpath-connectlistener), puis renvoie le `net.Socket` qui démarre la connexion.

### `net.createConnection(port[, host][, connectListener])` {#netcreateconnectionport-host-connectlistener}

**Ajouté dans : v0.1.90**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port auquel le socket doit se connecter. Sera passé à [`socket.connect(port[, host][, connectListener])`](/fr/nodejs/api/net#socketconnectport-host-connectlistener).
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hôte auquel le socket doit se connecter. Sera passé à [`socket.connect(port[, host][, connectListener])`](/fr/nodejs/api/net#socketconnectport-host-connectlistener). **Par défaut :** `'localhost'`.
- `connectListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Paramètre courant des fonctions [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnection), un listener "once" pour l'événement `'connect'` sur le socket d'initialisation. Sera passé à [`socket.connect(port[, host][, connectListener])`](/fr/nodejs/api/net#socketconnectport-host-connectlistener).
- Retourne : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) Le socket nouvellement créé utilisé pour démarrer la connexion.

Initie une connexion TCP.

Cette fonction crée un nouveau [`net.Socket`](/fr/nodejs/api/net#class-netsocket) avec toutes les options définies par défaut, initie immédiatement la connexion avec [`socket.connect(port[, host][, connectListener])`](/fr/nodejs/api/net#socketconnectport-host-connectlistener), puis renvoie le `net.Socket` qui démarre la connexion.


## `net.createServer([options][, connectionListener])` {#netcreateserveroptions-connectionlistener}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0, v18.17.0 | L'option `highWaterMark` est désormais prise en charge. |
| v17.7.0, v16.15.0 | Les options `noDelay`, `keepAlive` et `keepAliveInitialDelay` sont désormais prises en charge. |
| v0.5.0 | Ajoutée dans : v0.5.0 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est `false`, alors le socket terminera automatiquement le côté accessible en écriture lorsque le côté accessible en lecture se termine. **Par défaut :** `false`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Remplace éventuellement les valeurs `readableHighWaterMark` et `writableHighWaterMark` de tous les [`net.Socket`](/fr/nodejs/api/net#class-netsocket). **Par défaut :** Voir [`stream.getDefaultHighWaterMark()`](/fr/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est `true`, active la fonctionnalité keep-alive sur le socket immédiatement après la réception d'une nouvelle connexion entrante, de la même manière que ce qui est fait dans [`socket.setKeepAlive()`](/fr/nodejs/api/net#socketsetkeepaliveenable-initialdelay). **Par défaut :** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si elle est définie sur un nombre positif, elle définit le délai initial avant l'envoi de la première sonde keepalive sur un socket inactif. **Par défaut :** `0`.
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est `true`, désactive l'utilisation de l'algorithme de Nagle immédiatement après la réception d'une nouvelle connexion entrante. **Par défaut :** `false`.
    - `pauseOnConnect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le socket doit être mis en pause sur les connexions entrantes. **Par défaut :** `false`.
    - `blockList` [\<net.BlockList\>](/fr/nodejs/api/net#class-netblocklist) `blockList` peut être utilisé pour désactiver l'accès entrant à des adresses IP, des plages d'adresses IP ou des sous-réseaux IP spécifiques. Cela ne fonctionne pas si le serveur se trouve derrière un proxy inverse, un NAT, etc. car l'adresse vérifiée par rapport à la liste de blocage est l'adresse du proxy, ou celle spécifiée par le NAT.
 
 
-  `connectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Défini automatiquement comme écouteur pour l'événement [`'connection'`](/fr/nodejs/api/net#event-connection).
-  Renvoie : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Crée un nouveau serveur TCP ou [IPC](/fr/nodejs/api/net#ipc-support).

Si `allowHalfOpen` est défini sur `true`, lorsque l'autre extrémité du socket signale la fin de la transmission, le serveur ne renverra la fin de la transmission que lorsque [`socket.end()`](/fr/nodejs/api/net#socketenddata-encoding-callback) est explicitement appelé. Par exemple, dans le contexte de TCP, lorsqu'un paquet FIN est reçu, un paquet FIN n'est renvoyé que lorsque [`socket.end()`](/fr/nodejs/api/net#socketenddata-encoding-callback) est explicitement appelé. Jusque-là, la connexion est à moitié fermée (non accessible en lecture mais toujours accessible en écriture). Voir l'événement [`'end'`](/fr/nodejs/api/net#event-end) et [RFC 1122](https://tools.ietf.org/html/rfc1122) (section 4.2.2.13) pour plus d'informations.

Si `pauseOnConnect` est défini sur `true`, alors le socket associé à chaque connexion entrante sera mis en pause, et aucune donnée ne sera lue à partir de son handle. Cela permet de transmettre des connexions entre les processus sans qu'aucune donnée ne soit lue par le processus d'origine. Pour commencer à lire les données à partir d'un socket en pause, appelez [`socket.resume()`](/fr/nodejs/api/net#socketresume).

Le serveur peut être un serveur TCP ou un serveur [IPC](/fr/nodejs/api/net#ipc-support), selon ce qu'il [`listen()`](/fr/nodejs/api/net#serverlisten) à.

Voici un exemple de serveur d'écho TCP qui écoute les connexions sur le port 8124 :

::: code-group
```js [ESM]
import net from 'node:net';
const server = net.createServer((c) => {
  // Écouteur 'connection'.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```

```js [CJS]
const net = require('node:net');
const server = net.createServer((c) => {
  // Écouteur 'connection'.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```
:::

Testez ceci en utilisant `telnet` :

```bash [BASH]
telnet localhost 8124
```
Pour écouter sur le socket `/tmp/echo.sock` :

```js [ESM]
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
```
Utilisez `nc` pour vous connecter à un serveur de socket de domaine Unix :

```bash [BASH]
nc -U /tmp/echo.sock
```

## `net.getDefaultAutoSelectFamily()` {#netgetdefaultautoselectfamily}

**Ajouté dans: v19.4.0**

Obtient la valeur par défaut actuelle de l'option `autoSelectFamily` de [`socket.connect(options)`](/fr/nodejs/api/net#socketconnectoptions-connectlistener). La valeur par défaut initiale est `true`, sauf si l'option de ligne de commande `--no-network-family-autoselection` est fournie.

- Retourne: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) La valeur par défaut actuelle de l'option `autoSelectFamily`.

## `net.setDefaultAutoSelectFamily(value)` {#netsetdefaultautoselectfamilyvalue}

**Ajouté dans: v19.4.0**

Définit la valeur par défaut de l'option `autoSelectFamily` de [`socket.connect(options)`](/fr/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) La nouvelle valeur par défaut. La valeur par défaut initiale est `true`, sauf si l'option de ligne de commande `--no-network-family-autoselection` est fournie.

## `net.getDefaultAutoSelectFamilyAttemptTimeout()` {#netgetdefaultautoselectfamilyattempttimeout}

**Ajouté dans: v19.8.0, v18.18.0**

Obtient la valeur par défaut actuelle de l'option `autoSelectFamilyAttemptTimeout` de [`socket.connect(options)`](/fr/nodejs/api/net#socketconnectoptions-connectlistener). La valeur par défaut initiale est `250` ou la valeur spécifiée via l'option de ligne de commande `--network-family-autoselection-attempt-timeout`.

- Retourne: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La valeur par défaut actuelle de l'option `autoSelectFamilyAttemptTimeout`.

## `net.setDefaultAutoSelectFamilyAttemptTimeout(value)` {#netsetdefaultautoselectfamilyattempttimeoutvalue}

**Ajouté dans: v19.8.0, v18.18.0**

Définit la valeur par défaut de l'option `autoSelectFamilyAttemptTimeout` de [`socket.connect(options)`](/fr/nodejs/api/net#socketconnectoptions-connectlistener).

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La nouvelle valeur par défaut, qui doit être un nombre positif. Si le nombre est inférieur à `10`, la valeur `10` est utilisée à la place. La valeur par défaut initiale est `250` ou la valeur spécifiée via l'option de ligne de commande `--network-family-autoselection-attempt-timeout`.


## `net.isIP(input)` {#netisipinput}

**Ajouté dans : v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Renvoie `6` si `input` est une adresse IPv6. Renvoie `4` si `input` est une adresse IPv4 en [notation décimale pointée](https://en.wikipedia.org/wiki/Dot-decimal_notation) sans zéros non significatifs. Sinon, renvoie `0`.

```js [ESM]
net.isIP('::1'); // retourne 6
net.isIP('127.0.0.1'); // retourne 4
net.isIP('127.000.000.001'); // retourne 0
net.isIP('127.0.0.1/24'); // retourne 0
net.isIP('fhqwhgads'); // retourne 0
```
## `net.isIPv4(input)` {#netisipv4input}

**Ajouté dans : v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si `input` est une adresse IPv4 en [notation décimale pointée](https://en.wikipedia.org/wiki/Dot-decimal_notation) sans zéros non significatifs. Sinon, renvoie `false`.

```js [ESM]
net.isIPv4('127.0.0.1'); // retourne true
net.isIPv4('127.000.000.001'); // retourne false
net.isIPv4('127.0.0.1/24'); // retourne false
net.isIPv4('fhqwhgads'); // retourne false
```
## `net.isIPv6(input)` {#netisipv6input}

**Ajouté dans : v0.3.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si `input` est une adresse IPv6. Sinon, renvoie `false`.

```js [ESM]
net.isIPv6('::1'); // retourne true
net.isIPv6('fhqwhgads'); // retourne false
```

