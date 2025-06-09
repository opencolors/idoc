---
title: Documentation du module HTTP de Node.js
description: La documentation officielle du module HTTP de Node.js, expliquant comment créer des serveurs et des clients HTTP, gérer les requêtes et les réponses, et gérer diverses méthodes et en-têtes HTTP.
head:
  - - meta
    - name: og:title
      content: Documentation du module HTTP de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentation officielle du module HTTP de Node.js, expliquant comment créer des serveurs et des clients HTTP, gérer les requêtes et les réponses, et gérer diverses méthodes et en-têtes HTTP.
  - - meta
    - name: twitter:title
      content: Documentation du module HTTP de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentation officielle du module HTTP de Node.js, expliquant comment créer des serveurs et des clients HTTP, gérer les requêtes et les réponses, et gérer diverses méthodes et en-têtes HTTP.
---


# HTTP {#http}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/http.js](https://github.com/nodejs/node/blob/v23.5.0/lib/http.js)

Ce module, contenant à la fois un client et un serveur, peut être importé via `require('node:http')` (CommonJS) ou `import * as http from 'node:http'` (module ES).

Les interfaces HTTP dans Node.js sont conçues pour prendre en charge de nombreuses fonctionnalités du protocole qui ont traditionnellement été difficiles à utiliser. En particulier, les messages volumineux, éventuellement codés en blocs. L’interface prend soin de ne jamais mettre en mémoire tampon les requêtes ou les réponses entières, de sorte que l’utilisateur puisse diffuser des données en continu.

Les en-têtes de messages HTTP sont représentés par un objet comme celui-ci :

```json [JSON]
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```
Les clés sont en minuscules. Les valeurs ne sont pas modifiées.

Afin de prendre en charge toute la gamme des applications HTTP possibles, l’API HTTP de Node.js est de très bas niveau. Elle traite uniquement la gestion des flux et l’analyse des messages. Elle analyse un message en en-têtes et en corps, mais elle n’analyse pas les en-têtes ou le corps proprement dits.

Voir [`message.headers`](/fr/nodejs/api/http#messageheaders) pour plus de détails sur la façon dont les en-têtes en double sont gérés.

Les en-têtes bruts tels qu’ils ont été reçus sont conservés dans la propriété `rawHeaders`, qui est un tableau de `[clé, valeur, clé2, valeur2, ...]`. Par exemple, l’objet d’en-tête de message précédent peut avoir une liste `rawHeaders` comme la suivante :

```js [ESM]
[ 'ConTent-Length', '123456',
  'content-LENGTH', '123',
  'content-type', 'text/plain',
  'CONNECTION', 'keep-alive',
  'Host', 'example.com',
  'accepT', '*/*' ]
```
## Classe : `http.Agent` {#class-httpagent}

**Ajouté dans : v0.3.4**

Un `Agent` est responsable de la gestion de la persistance et de la réutilisation des connexions pour les clients HTTP. Il maintient une file d’attente de requêtes en attente pour un hôte et un port donnés, en réutilisant une seule connexion socket pour chacun jusqu’à ce que la file d’attente soit vide, auquel cas le socket est soit détruit, soit placé dans un pool où il est conservé pour être réutilisé pour les requêtes vers le même hôte et port. La question de savoir s’il est détruit ou mis en commun dépend de l'[option](/fr/nodejs/api/http#new-agentoptions) `keepAlive`.

Les connexions groupées ont TCP Keep-Alive activé pour elles, mais les serveurs peuvent toujours fermer les connexions inactives, auquel cas elles seront supprimées du pool et une nouvelle connexion sera établie lorsqu’une nouvelle requête HTTP sera faite pour cet hôte et ce port. Les serveurs peuvent également refuser d’autoriser plusieurs requêtes sur la même connexion, auquel cas la connexion devra être refaite pour chaque requête et ne pourra pas être mise en commun. L'`Agent` effectuera toujours les requêtes à ce serveur, mais chacune d’elles se fera sur une nouvelle connexion.

Lorsqu’une connexion est fermée par le client ou le serveur, elle est supprimée du pool. Tous les sockets inutilisés dans le pool seront non référencés afin de ne pas faire fonctionner le processus Node.js lorsqu’il n’y a pas de requêtes en suspens. (voir [`socket.unref()`](/fr/nodejs/api/net#socketunref)).

C’est une bonne pratique de [`destroy()`](/fr/nodejs/api/http#agentdestroy) une instance `Agent` lorsqu’elle n’est plus utilisée, car les sockets inutilisés consomment des ressources du système d’exploitation.

Les sockets sont supprimés d’un agent lorsque le socket émet un événement `'close'` ou un événement `'agentRemove'`. Lorsque l’on a l’intention de garder une requête HTTP ouverte pendant une longue période sans la garder dans l’agent, on peut faire quelque chose comme ce qui suit :

```js [ESM]
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```
Un agent peut également être utilisé pour une requête individuelle. En fournissant `{agent: false}` comme option aux fonctions `http.get()` ou `http.request()`, un `Agent` à usage unique avec des options par défaut sera utilisé pour la connexion client.

`agent:false` :

```js [ESM]
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Create a new agent just for this one request
}, (res) => {
  // Do stuff with response
});
```

### `new Agent([options])` {#new-agentoptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.6.0, v14.17.0 | Modification de la planification par défaut de 'fifo' à 'lifo'. |
| v14.5.0, v12.20.0 | Ajout de l'option `scheduling` pour spécifier la stratégie de planification des sockets libres. |
| v14.5.0, v12.19.0 | Ajout de l'option `maxTotalSockets` au constructeur de l'agent. |
| v0.3.4 | Ajouté dans : v0.3.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ensemble d'options configurables à définir sur l'agent. Peut avoir les champs suivants :
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Conserver les sockets même lorsqu'il n'y a pas de requêtes en attente, afin qu'ils puissent être utilisés pour de futures requêtes sans avoir à rétablir une connexion TCP. À ne pas confondre avec la valeur `keep-alive` de l'en-tête `Connection`. L'en-tête `Connection: keep-alive` est toujours envoyé lors de l'utilisation d'un agent, sauf lorsque l'en-tête `Connection` est explicitement spécifié ou lorsque les options `keepAlive` et `maxSockets` sont respectivement définies sur `false` et `Infinity`, auquel cas `Connection: close` sera utilisé. **Par défaut :** `false`.
    - `keepAliveMsecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lors de l'utilisation de l'option `keepAlive`, spécifie le [délai initial](/fr/nodejs/api/net#socketsetkeepaliveenable-initialdelay) pour les paquets TCP Keep-Alive. Ignoré lorsque l'option `keepAlive` est `false` ou `undefined`. **Par défaut :** `1000`.
    - `maxSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre maximal de sockets autorisés par hôte. Si le même hôte ouvre plusieurs connexions simultanées, chaque requête utilisera un nouveau socket jusqu'à ce que la valeur `maxSockets` soit atteinte. Si l'hôte tente d'ouvrir plus de connexions que `maxSockets`, les requêtes supplémentaires entreront dans une file d'attente de requêtes en attente et passeront à l'état de connexion active lorsqu'une connexion existante se termine. Cela garantit qu'il y a au plus `maxSockets` connexions actives à un moment donné, depuis un hôte donné. **Par défaut :** `Infinity`.
    - `maxTotalSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre maximal de sockets autorisés pour tous les hôtes au total. Chaque requête utilisera un nouveau socket jusqu'à ce que le maximum soit atteint. **Par défaut :** `Infinity`.
    - `maxFreeSockets` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Nombre maximal de sockets par hôte à laisser ouverts dans un état libre. Uniquement pertinent si `keepAlive` est défini sur `true`. **Par défaut :** `256`.
    - `scheduling` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Stratégie de planification à appliquer lors du choix du prochain socket libre à utiliser. Elle peut être `'fifo'` ou `'lifo'`. La principale différence entre les deux stratégies de planification est que `'lifo'` sélectionne le socket le plus récemment utilisé, tandis que `'fifo'` sélectionne le socket le moins récemment utilisé. En cas de faible taux de requêtes par seconde, la planification `'lifo'` réduira le risque de choisir un socket qui aurait pu être fermé par le serveur en raison de l'inactivité. En cas de taux élevé de requêtes par seconde, la planification `'fifo'` maximisera le nombre de sockets ouverts, tandis que la planification `'lifo'` le maintiendra aussi bas que possible. **Par défaut :** `'lifo'`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Délai d'attente du socket en millisecondes. Cela définira le délai d'attente lorsque le socket est créé.

`options` dans [`socket.connect()`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) sont également pris en charge.

Pour configurer l'un d'eux, une instance [`http.Agent`](/fr/nodejs/api/http#class-httpagent) personnalisée doit être créée.

::: code-group
```js [ESM]
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```js [CJS]
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
:::


### `agent.createConnection(options[, callback])` {#agentcreateconnectionoptions-callback}

**Ajouté dans : v0.11.4**

- `options` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options contenant les détails de la connexion. Consultez [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnectionoptions-connectlistener) pour connaître le format des options.
- `callback` [\<Fonction\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction de rappel qui reçoit le socket créé.
- Renvoie : [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Produit un socket/flux à utiliser pour les requêtes HTTP.

Par défaut, cette fonction est la même que [`net.createConnection()`](/fr/nodejs/api/net#netcreateconnectionoptions-connectlistener). Toutefois, les agents personnalisés peuvent remplacer cette méthode si une plus grande flexibilité est souhaitée.

Un socket/flux peut être fourni de deux manières : en renvoyant le socket/flux à partir de cette fonction ou en transmettant le socket/flux à `callback`.

Cette méthode est garantie de renvoyer une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur spécifie un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

`callback` a une signature de `(err, stream)`.

### `agent.keepSocketAlive(socket)` {#agentkeepsocketalivesocket}

**Ajouté dans : v8.1.0**

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Appelée lorsque le `socket` est détaché d'une requête et peut être conservé par l'`Agent`. Le comportement par défaut est :

```js [ESM]
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```
Cette méthode peut être remplacée par une sous-classe `Agent` particulière. Si cette méthode renvoie une valeur fausse, le socket sera détruit au lieu d'être conservé pour être utilisé avec la requête suivante.

L'argument `socket` peut être une instance de [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex).

### `agent.reuseSocket(socket, request)` {#agentreusesocketsocket-request}

**Ajouté dans : v8.1.0**

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)
- `request` [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)

Appelée lorsque le `socket` est attaché à `request` après avoir été conservé en raison des options de keep-alive. Le comportement par défaut est :

```js [ESM]
socket.ref();
```
Cette méthode peut être remplacée par une sous-classe `Agent` particulière.

L'argument `socket` peut être une instance de [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex).


### `agent.destroy()` {#agentdestroy}

**Ajouté dans : v0.11.4**

Détruit tous les sockets actuellement utilisés par l’agent.

Il n’est généralement pas nécessaire de le faire. Cependant, si vous utilisez un agent avec `keepAlive` activé, il est préférable de fermer explicitement l’agent lorsqu’il n’est plus nécessaire. Sinon, les sockets peuvent rester ouverts pendant un certain temps avant que le serveur ne les ferme.

### `agent.freeSockets` {#agentfreesockets}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | La propriété a maintenant un prototype `null`. |
| v0.11.4 | Ajouté dans : v0.11.4 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objet qui contient des tableaux de sockets actuellement en attente d’utilisation par l’agent lorsque `keepAlive` est activé. Ne pas modifier.

Les sockets de la liste `freeSockets` seront automatiquement détruits et supprimés du tableau sur `'timeout'`.

### `agent.getName([options])` {#agentgetnameoptions}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.7.0, v16.15.0 | Le paramètre `options` est désormais facultatif. |
| v0.11.4 | Ajouté dans : v0.11.4 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un ensemble d’options fournissant des informations pour la génération du nom
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nom de domaine ou une adresse IP du serveur auquel envoyer la requête
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port du serveur distant
    - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Interface locale à lier pour les connexions réseau lors de l’émission de la requête
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Doit être 4 ou 6 si cela n’est pas égal à `undefined`.
  
 
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtenir un nom unique pour un ensemble d’options de requête, afin de déterminer si une connexion peut être réutilisée. Pour un agent HTTP, cela retourne `host:port:localAddress` ou `host:port:localAddress:family`. Pour un agent HTTPS, le nom comprend le CA, le cert, les ciphers et d’autres options spécifiques à HTTPS/TLS qui déterminent la réutilisabilité du socket.


### `agent.maxFreeSockets` {#agentmaxfreesockets}

**Ajouté dans : v0.11.7**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Par défaut, la valeur est définie sur 256. Pour les agents avec `keepAlive` activé, cela définit le nombre maximum de sockets qui resteront ouverts en état libre.

### `agent.maxSockets` {#agentmaxsockets}

**Ajouté dans : v0.3.6**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Par défaut, la valeur est définie sur `Infinity`. Détermine le nombre de sockets simultanés que l’agent peut avoir ouverts par origine. L’origine est la valeur renvoyée par [`agent.getName()`](/fr/nodejs/api/http#agentgetnameoptions).

### `agent.maxTotalSockets` {#agentmaxtotalsockets}

**Ajouté dans : v14.5.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Par défaut, la valeur est définie sur `Infinity`. Détermine le nombre de sockets simultanés que l’agent peut avoir ouverts. Contrairement à `maxSockets`, ce paramètre s’applique à toutes les origines.

### `agent.requests` {#agentrequests}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | La propriété a maintenant un prototype `null`. |
| v0.5.9 | Ajouté dans : v0.5.9 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objet qui contient les files d’attente des requêtes qui n’ont pas encore été affectées aux sockets. Ne pas modifier.

### `agent.sockets` {#agentsockets}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | La propriété a maintenant un prototype `null`. |
| v0.3.6 | Ajouté dans : v0.3.6 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objet qui contient des tableaux de sockets actuellement utilisés par l’agent. Ne pas modifier.

## Classe : `http.ClientRequest` {#class-httpclientrequest}

**Ajouté dans : v0.1.17**

- Hérite de : [\<http.OutgoingMessage\>](/fr/nodejs/api/http#class-httpoutgoingmessage)

Cet objet est créé en interne et renvoyé par [`http.request()`](/fr/nodejs/api/http#httprequestoptions-callback). Il représente une requête *en cours* dont l’en-tête a déjà été mise en file d’attente. L’en-tête est toujours mutable en utilisant les API [`setHeader(name, value)`](/fr/nodejs/api/http#requestsetheadername-value), [`getHeader(name)`](/fr/nodejs/api/http#requestgetheadername), [`removeHeader(name)`](/fr/nodejs/api/http#requestremoveheadername). L’en-tête réel sera envoyé avec le premier bloc de données ou lors de l’appel de [`request.end()`](/fr/nodejs/api/http#requestenddata-encoding-callback).

Pour obtenir la réponse, ajoutez un écouteur pour [`'response'`](/fr/nodejs/api/http#event-response) à l’objet de requête. [`'response'`](/fr/nodejs/api/http#event-response) sera émis à partir de l’objet de requête lorsque les en-têtes de réponse auront été reçus. L’événement [`'response'`](/fr/nodejs/api/http#event-response) est exécuté avec un argument qui est une instance de [`http.IncomingMessage`](/fr/nodejs/api/http#class-httpincomingmessage).

Pendant l’événement [`'response'`](/fr/nodejs/api/http#event-response), on peut ajouter des écouteurs à l’objet de réponse ; en particulier pour écouter l’événement `'data'`.

Si aucun gestionnaire [`'response'`](/fr/nodejs/api/http#event-response) n’est ajouté, la réponse sera entièrement rejetée. Toutefois, si un gestionnaire d’événements [`'response'`](/fr/nodejs/api/http#event-response) est ajouté, les données de l’objet de réponse **doivent** être consommées, soit en appelant `response.read()` chaque fois qu’il y a un événement `'readable'`, soit en ajoutant un gestionnaire `'data'`, soit en appelant la méthode `.resume()`. Tant que les données ne sont pas consommées, l’événement `'end'` ne sera pas déclenché. De plus, tant que les données ne sont pas lues, elles consommeront de la mémoire, ce qui peut éventuellement entraîner une erreur de type « mémoire insuffisante pour le processus ».

Pour assurer la rétrocompatibilité, `res` n’émettra `'error'` que s’il existe un écouteur `'error'` enregistré.

Définissez l’en-tête `Content-Length` pour limiter la taille du corps de la réponse. Si [`response.strictContentLength`](/fr/nodejs/api/http#responsestrictcontentlength) est défini sur `true`, une non-concordance avec la valeur de l’en-tête `Content-Length` entraînera le lancement d’une `Error`, identifiée par `code :` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/fr/nodejs/api/errors#err_http_content_length_mismatch).

La valeur de `Content-Length` doit être exprimée en octets, et non en caractères. Utilisez [`Buffer.byteLength()`](/fr/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) pour déterminer la longueur du corps en octets.


### Événement: `'abort'` {#event-abort}

**Ajouté dans: v1.4.1**

**Déprécié depuis: v17.0.0, v16.12.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Écoutez plutôt l'événement `'close'`.
:::

Émis lorsque la requête a été annulée par le client. Cet événement n'est émis que lors du premier appel à `abort()`.

### Événement: `'close'` {#event-close}

**Ajouté dans: v0.5.4**

Indique que la requête est terminée, ou que sa connexion sous-jacente a été interrompue prématurément (avant la fin de la réponse).

### Événement: `'connect'` {#event-connect}

**Ajouté dans: v0.7.0**

- `response` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Émis chaque fois qu'un serveur répond à une requête avec une méthode `CONNECT`. Si cet événement n'est pas écouté, les clients recevant une méthode `CONNECT` verront leurs connexions fermées.

Il est garanti que cet événement recevra une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur spécifie un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

Une paire client/serveur démontrant comment écouter l'événement `'connect'` :

::: code-group
```js [ESM]
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// Create an HTTP tunneling proxy
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```js [CJS]
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```
:::


### Événement : `'continue'` {#event-continue}

**Ajouté dans : v0.3.2**

Émis lorsque le serveur envoie une réponse HTTP '100 Continue', généralement parce que la requête contenait 'Expect: 100-continue'. C'est une instruction que le client doit envoyer le corps de la requête.

### Événement : `'finish'` {#event-finish}

**Ajouté dans : v0.3.6**

Émis lorsque la requête a été envoyée. Plus précisément, cet événement est émis lorsque le dernier segment des en-têtes et du corps de la réponse a été transmis au système d'exploitation pour transmission sur le réseau. Cela n'implique pas que le serveur ait déjà reçu quoi que ce soit.

### Événement : `'information'` {#event-information}

**Ajouté dans : v10.0.0**

- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `httpVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `httpVersionMajor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `httpVersionMinor` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rawHeaders` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Émis lorsque le serveur envoie une réponse intermédiaire 1xx (à l'exclusion de la mise à niveau 101). Les écouteurs de cet événement recevront un objet contenant la version HTTP, le code d'état, le message d'état, l'objet d'en-têtes clé-valeur et un tableau avec les noms d'en-tête bruts suivis de leurs valeurs respectives.



::: code-group
```js [ESM]
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```js [CJS]
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```
:::

Les statuts de mise à niveau 101 ne déclenchent pas cet événement en raison de leur rupture avec la chaîne requête/réponse HTTP traditionnelle, comme les sockets web, les mises à niveau TLS sur place ou HTTP 2.0. Pour être averti des notifications de mise à niveau 101, écoutez plutôt l'événement [`'upgrade'`](/fr/nodejs/api/http#event-upgrade).


### Événement : `'response'` {#event-response}

**Ajouté dans : v0.1.0**

- `response` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)

Émis lorsqu'une réponse est reçue à cette requête. Cet événement n'est émis qu'une seule fois.

### Événement : `'socket'` {#event-socket}

**Ajouté dans : v0.5.3**

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Cet événement est garanti de transmettre une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur spécifie un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

### Événement : `'timeout'` {#event-timeout}

**Ajouté dans : v0.7.8**

Émis lorsque le socket sous-jacent expire en raison d'une inactivité. Ceci notifie seulement que le socket a été inactif. La requête doit être détruite manuellement.

Voir aussi : [`request.setTimeout()`](/fr/nodejs/api/http#requestsettimeouttimeout-callback).

### Événement : `'upgrade'` {#event-upgrade}

**Ajouté dans : v0.1.94**

- `response` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)
- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)
- `head` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Émis chaque fois qu'un serveur répond à une requête avec une mise à niveau. Si cet événement n'est pas écouté et que le code d'état de la réponse est 101 Switching Protocols, les clients recevant un en-tête de mise à niveau verront leurs connexions fermées.

Cet événement est garanti de transmettre une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur spécifie un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

Une paire client-serveur démontrant comment écouter l'événement `'upgrade'`.

::: code-group
```js [ESM]
import http from 'node:http';
import process from 'node:process';

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```

```js [CJS]
const http = require('node:http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});
```
:::


### `request.abort()` {#requestabort}

**Ajouté dans la version : v0.3.8**

**Déprécié depuis la version : v14.1.0, v13.14.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : utiliser plutôt [`request.destroy()`](/fr/nodejs/api/http#requestdestroyerror).
:::

Marque la requête comme étant annulée. L'appel à cette fonction entraînera la suppression des données restantes dans la réponse et la destruction du socket.

### `request.aborted` {#requestaborted}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.0.0, v16.12.0 | Déprécié depuis : v17.0.0, v16.12.0 |
| v11.0.0 | La propriété `aborted` n'est plus un nombre d'horodatage. |
| v0.11.14 | Ajouté dans la version : v0.11.14 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Vérifiez plutôt [`request.destroyed`](/fr/nodejs/api/http#requestdestroyed).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `request.aborted` sera `true` si la requête a été annulée.

### `request.connection` {#requestconnection}

**Ajouté dans la version : v0.3.0**

**Déprécié depuis la version : v13.0.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez [`request.socket`](/fr/nodejs/api/http#requestsocket).
:::

- [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Voir [`request.socket`](/fr/nodejs/api/http#requestsocket).

### `request.cork()` {#requestcork}

**Ajouté dans la version : v13.2.0, v12.16.0**

Voir [`writable.cork()`](/fr/nodejs/api/stream#writablecork).

### `request.end([data[, encoding]][, callback])` {#requestenddata-encoding-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le paramètre `data` peut désormais être un `Uint8Array`. |
| v10.0.0 | Cette méthode renvoie maintenant une référence à `ClientRequest`. |
| v0.1.90 | Ajouté dans la version : v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Termine l'envoi de la requête. Si des parties du corps ne sont pas envoyées, elles seront vidées dans le flux. Si la requête est segmentée, cela enverra le `'0\r\n\r\n'` de terminaison.

Si `data` est spécifié, cela équivaut à appeler [`request.write(data, encoding)`](/fr/nodejs/api/http#requestwritechunk-encoding-callback) suivi de `request.end(callback)`.

Si `callback` est spécifié, il sera appelé lorsque le flux de requêtes sera terminé.


### `request.destroy([error])` {#requestdestroyerror}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0 | La fonction renvoie `this` pour assurer la cohérence avec les autres flux Readable. |
| v0.3.0 | Ajoutée dans : v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Optionnel, une erreur à émettre avec l'événement `'error'`.
- Returns : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Détruit la requête. Émet optionnellement un événement `'error'` et émet un événement `'close'`. L'appel de cette méthode entraînera la suppression des données restantes dans la réponse et la destruction du socket.

Voir [`writable.destroy()`](/fr/nodejs/api/stream#writabledestroyerror) pour plus de détails.

#### `request.destroyed` {#requestdestroyed}

**Ajouté dans : v14.1.0, v13.14.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après que [`request.destroy()`](/fr/nodejs/api/http#requestdestroyerror) a été appelé.

Voir [`writable.destroyed`](/fr/nodejs/api/stream#writabledestroyed) pour plus de détails.

### `request.finished` {#requestfinished}

**Ajouté dans : v0.0.1**

**Déprécié depuis : v13.4.0, v12.16.0**

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utiliser [`request.writableEnded`](/fr/nodejs/api/http#requestwritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `request.finished` sera `true` si [`request.end()`](/fr/nodejs/api/http#requestenddata-encoding-callback) a été appelée. `request.end()` sera automatiquement appelée si la requête a été lancée via [`http.get()`](/fr/nodejs/api/http#httpgetoptions-callback).

### `request.flushHeaders()` {#requestflushheaders}

**Ajouté dans : v1.6.0**

Vide les en-têtes de la requête.

Pour des raisons d'efficacité, Node.js met normalement en mémoire tampon les en-têtes de la requête jusqu'à ce que `request.end()` soit appelé ou que le premier bloc de données de la requête soit écrit. Il essaie ensuite de regrouper les en-têtes de la requête et les données en un seul paquet TCP.

C'est généralement souhaitable (cela évite un aller-retour TCP), mais pas lorsque les premières données ne sont pas envoyées avant, éventuellement, beaucoup plus tard. `request.flushHeaders()` contourne l'optimisation et lance la requête.


### `request.getHeader(name)` {#requestgetheadername}

**Ajoutée dans: v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lit un en-tête sur la requête. Le nom n'est pas sensible à la casse. Le type de la valeur de retour dépend des arguments fournis à [`request.setHeader()`](/fr/nodejs/api/http#requestsetheadername-value).

```js [ESM]
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' est 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' est de type nombre
const cookie = request.getHeader('Cookie');
// 'cookie' est de type string[]
```
### `request.getHeaderNames()` {#requestgetheadernames}

**Ajoutée dans: v7.7.0**

- Retourne: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne un tableau contenant les noms uniques des en-têtes sortants actuels. Tous les noms d'en-tête sont en minuscules.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```
### `request.getHeaders()` {#requestgetheaders}

**Ajoutée dans: v7.7.0**

- Retourne: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne une copie superficielle des en-têtes sortants actuels. Puisqu'une copie superficielle est utilisée, les valeurs de tableau peuvent être mutées sans appels supplémentaires aux différentes méthodes du module http liées aux en-têtes. Les clés de l'objet retourné sont les noms d'en-tête et les valeurs sont les valeurs d'en-tête respectives. Tous les noms d'en-tête sont en minuscules.

L'objet retourné par la méthode `request.getHeaders()` *n'hérite pas* prototypiquement de l'objet JavaScript `Object`. Cela signifie que les méthodes `Object` typiques telles que `obj.toString()`, `obj.hasOwnProperty()` et autres ne sont pas définies et *ne fonctionneront pas*.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()` {#requestgetrawheadernames}

**Ajouté dans : v15.13.0, v14.17.0**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie un tableau contenant les noms uniques des en-têtes bruts sortants actuels. Les noms d'en-tête sont renvoyés avec leur casse exacte.

```js [ESM]
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```
### `request.hasHeader(name)` {#requesthasheadername}

**Ajouté dans : v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Renvoie `true` si l'en-tête identifié par `name` est actuellement défini dans les en-têtes sortants. La correspondance du nom de l'en-tête ne respecte pas la casse.

```js [ESM]
const hasContentType = request.hasHeader('content-type');
```
### `request.maxHeadersCount` {#requestmaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `2000`

Limite le nombre maximal d'en-têtes de réponse. S'il est défini sur 0, aucune limite ne sera appliquée.

### `request.path` {#requestpath}

**Ajouté dans : v0.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le chemin de la requête.

### `request.method` {#requestmethod}

**Ajouté dans : v0.1.97**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La méthode de la requête.

### `request.host` {#requesthost}

**Ajouté dans : v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'hôte de la requête.

### `request.protocol` {#requestprotocol}

**Ajouté dans : v14.5.0, v12.19.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le protocole de la requête.

### `request.removeHeader(name)` {#requestremoveheadername}

**Ajouté dans : v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Supprime un en-tête déjà défini dans l'objet en-têtes.

```js [ESM]
request.removeHeader('Content-Type');
```

### `request.reusedSocket` {#requestreusedsocket}

**Ajouté dans : v13.0.0, v12.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si la requête est envoyée via un socket réutilisé.

Lors de l’envoi d’une requête via un agent avec keep-alive activé, le socket sous-jacent peut être réutilisé. Mais si le serveur ferme la connexion à un moment inopportun, le client peut rencontrer une erreur 'ECONNRESET'.

::: code-group
```js [ESM]
import http from 'node:http';

// Le serveur a un délai d'attente de keep-alive de 5 secondes par défaut
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adaptation d'un agent keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Ne rien faire
    });
  });
}, 5000); // Envoi de la requête à un intervalle de 5 s afin qu’il soit facile d’atteindre le délai d’inactivité
```

```js [CJS]
const http = require('node:http');

// Le serveur a un délai d'attente de keep-alive de 5 secondes par défaut
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adaptation d'un agent keep-alive
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Ne rien faire
    });
  });
}, 5000); // Envoi de la requête à un intervalle de 5 s afin qu’il soit facile d’atteindre le délai d’inactivité
```
:::

En indiquant si une requête a réutilisé ou non un socket, nous pouvons effectuer une nouvelle tentative automatique en cas d’erreur.

::: code-group
```js [ESM]
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Vérifiez si une nouvelle tentative est nécessaire
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```js [CJS]
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Vérifiez si une nouvelle tentative est nécessaire
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```
:::


### `request.setHeader(name, value)` {#requestsetheadername-value}

**Ajouté dans : v1.6.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Définit une seule valeur d’en-tête pour l’objet d’en-têtes. Si cet en-tête existe déjà dans les en-têtes à envoyer, sa valeur sera remplacée. Utilisez un tableau de chaînes de caractères ici pour envoyer plusieurs en-têtes avec le même nom. Les valeurs non-chaînes seront stockées sans modification. Par conséquent, [`request.getHeader()`](/fr/nodejs/api/http#requestgetheadername) peut renvoyer des valeurs non-chaînes. Toutefois, les valeurs non-chaînes seront converties en chaînes pour la transmission réseau.

```js [ESM]
request.setHeader('Content-Type', 'application/json');
```
ou

```js [ESM]
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```
Lorsque la valeur est une chaîne, une exception sera levée si elle contient des caractères en dehors du codage `latin1`.

Si vous devez passer des caractères UTF-8 dans la valeur, veuillez coder la valeur en utilisant la norme [RFC 8187](https://www.rfc-editor.org/rfc/rfc8187.txt).

```js [ESM]
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```
### `request.setNoDelay([noDelay])` {#requestsetnodelaynodelay}

**Ajouté dans : v0.5.9**

- `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Une fois qu’un socket est affecté à cette requête et est connecté, [`socket.setNoDelay()`](/fr/nodejs/api/net#socketsetnodelaynodelay) sera appelé.

### `request.setSocketKeepAlive([enable][, initialDelay])` {#requestsetsocketkeepaliveenable-initialdelay}

**Ajouté dans : v0.5.9**

- `enable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `initialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Une fois qu’un socket est affecté à cette requête et est connecté, [`socket.setKeepAlive()`](/fr/nodejs/api/net#socketsetkeepaliveenable-initialdelay) sera appelé.


### `request.setTimeout(timeout[, callback])` {#requestsettimeouttimeout-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v9.0.0 | Définit de manière cohérente le délai d'attente du socket uniquement lorsque le socket se connecte. |
| v0.5.9 | Ajoutée dans : v0.5.9 |
:::

- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Millisecondes avant l'expiration d'une requête.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction optionnelle à appeler lorsqu'un délai d'attente se produit. Identique à la liaison à l'événement `'timeout'`.
- Retourne : [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)

Une fois qu'un socket est attribué à cette requête et qu'il est connecté, [`socket.setTimeout()`](/fr/nodejs/api/net#socketsettimeouttimeout-callback) sera appelé.

### `request.socket` {#requestsocket}

**Ajoutée dans : v0.3.0**

- [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Référence au socket sous-jacent. En général, les utilisateurs ne souhaitent pas accéder à cette propriété. En particulier, le socket n'émettra pas d'événements `'readable'` en raison de la façon dont l'analyseur de protocole se rattache au socket.

::: code-group
```js [ESM]
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```

```js [CJS]
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```
:::

Cette propriété est garantie d'être une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur a spécifié un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).


### `request.uncork()` {#requestuncork}

**Ajouté dans : v13.2.0, v12.16.0**

Voir [`writable.uncork()`](/fr/nodejs/api/stream#writableuncork).

### `request.writableEnded` {#requestwritableended}

**Ajouté dans : v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après l'appel de [`request.end()`](/fr/nodejs/api/http#requestenddata-encoding-callback). Cette propriété n'indique pas si les données ont été vidées. Pour cela, utilisez plutôt [`request.writableFinished`](/fr/nodejs/api/http#requestwritablefinished).

### `request.writableFinished` {#requestwritablefinished}

**Ajouté dans : v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` si toutes les données ont été vidées vers le système sous-jacent, immédiatement avant que l'événement [`'finish'`](/fr/nodejs/api/http#event-finish) ne soit émis.

### `request.write(chunk[, encoding][, callback])` {#requestwritechunk-encoding-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le paramètre `chunk` peut maintenant être un `Uint8Array`. |
| v0.1.29 | Ajouté dans : v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envoie un morceau du corps. Cette méthode peut être appelée plusieurs fois. Si aucun `Content-Length` n'est défini, les données seront automatiquement encodées en utilisant l'encodage de transfert HTTP en segments ("Chunked"), afin que le serveur sache quand les données se terminent. L'en-tête `Transfer-Encoding: chunked` est ajouté. Appeler [`request.end()`](/fr/nodejs/api/http#requestenddata-encoding-callback) est nécessaire pour terminer l'envoi de la requête.

L'argument `encoding` est optionnel et ne s'applique que lorsque `chunk` est une chaîne de caractères. La valeur par défaut est `'utf8'`.

L'argument `callback` est optionnel et sera appelé lorsque ce morceau de données sera vidé, mais seulement si le morceau n'est pas vide.

Retourne `true` si toutes les données ont été vidées avec succès dans le tampon du noyau. Retourne `false` si tout ou partie des données ont été mises en file d'attente dans la mémoire utilisateur. `'drain'` sera émis lorsque le tampon sera à nouveau libre.

Lorsque la fonction `write` est appelée avec une chaîne de caractères ou un tampon vide, elle ne fait rien et attend plus d'entrée.


## Classe : `http.Server` {#class-httpserver}

**Ajoutée dans : v0.1.17**

- Hérite de : [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

### Événement : `'checkContinue'` {#event-checkcontinue}

**Ajoutée dans : v0.3.0**

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)

Émis chaque fois qu'une requête avec un en-tête HTTP `Expect: 100-continue` est reçue. Si cet événement n'est pas écouté, le serveur répondra automatiquement avec un `100 Continue` de manière appropriée.

La gestion de cet événement implique d'appeler [`response.writeContinue()`](/fr/nodejs/api/http#responsewritecontinue) si le client doit continuer à envoyer le corps de la requête, ou de générer une réponse HTTP appropriée (par exemple, 400 Bad Request) si le client ne doit pas continuer à envoyer le corps de la requête.

Lorsque cet événement est émis et géré, l'événement [`'request'`](/fr/nodejs/api/http#event-request) ne sera pas émis.

### Événement : `'checkExpectation'` {#event-checkexpectation}

**Ajoutée dans : v5.5.0**

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)

Émis chaque fois qu'une requête avec un en-tête HTTP `Expect` est reçue, où la valeur n'est pas `100-continue`. Si cet événement n'est pas écouté, le serveur répondra automatiquement avec un `417 Expectation Failed` de manière appropriée.

Lorsque cet événement est émis et géré, l'événement [`'request'`](/fr/nodejs/api/http#event-request) ne sera pas émis.

### Événement : `'clientError'` {#event-clienterror}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.0.0 | Le comportement par défaut renverra une erreur 431 Request Header Fields Too Large si une erreur HPE_HEADER_OVERFLOW se produit. |
| v9.4.0 | `rawPacket` est le tampon actuel qui vient d'être analysé. L'ajout de ce tampon à l'objet d'erreur de l'événement `'clientError'` permet aux développeurs de journaliser le paquet corrompu. |
| v6.0.0 | L'action par défaut d'appeler `.destroy()` sur le `socket` n'aura plus lieu s'il y a des listeners attachés pour `'clientError'`. |
| v0.1.94 | Ajoutée dans : v0.1.94 |
:::

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Si une connexion client émet un événement `'error'`, il sera transmis ici. L'écouteur de cet événement est responsable de la fermeture/destruction du socket sous-jacent. Par exemple, on peut souhaiter fermer plus gracieusement le socket avec une réponse HTTP personnalisée au lieu de couper brusquement la connexion. Le socket **doit être fermé ou détruit** avant la fin de l'écouteur.

Cet événement est garanti de recevoir une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), à moins que l'utilisateur ne spécifie un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

Le comportement par défaut est d'essayer de fermer le socket avec une erreur HTTP '400 Bad Request', ou une erreur HTTP '431 Request Header Fields Too Large' dans le cas d'une erreur [`HPE_HEADER_OVERFLOW`](/fr/nodejs/api/errors#hpe_header_overflow). Si le socket n'est pas accessible en écriture ou si les en-têtes de l'objet [`http.ServerResponse`](/fr/nodejs/api/http#class-httpserverresponse) actuellement attaché ont été envoyés, il est immédiatement détruit.

`socket` est l'objet [`net.Socket`](/fr/nodejs/api/net#class-netsocket) d'où provient l'erreur.

::: code-group
```js [ESM]
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```js [CJS]
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```
:::

Lorsque l'événement `'clientError'` se produit, il n'y a pas d'objet `request` ou `response`, donc toute réponse HTTP envoyée, y compris les en-têtes de réponse et la charge utile, *doit* être écrite directement dans l'objet `socket`. Il faut veiller à ce que la réponse soit un message de réponse HTTP correctement formaté.

`err` est une instance de `Error` avec deux colonnes supplémentaires :

- `bytesParsed` : le nombre d'octets du paquet de requête que Node.js a pu analyser correctement ;
- `rawPacket` : le paquet brut de la requête actuelle.

Dans certains cas, le client a déjà reçu la réponse et/ou le socket a déjà été détruit, comme dans le cas des erreurs `ECONNRESET`. Avant d'essayer d'envoyer des données au socket, il est préférable de vérifier qu'il est toujours accessible en écriture.

```js [ESM]
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### Événement : `'close'` {#event-close_1}

**Ajouté dans : v0.1.4**

Émis lorsque le serveur se ferme.

### Événement : `'connect'` {#event-connect_1}

**Ajouté dans : v0.7.0**

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage) Arguments pour la requête HTTP, comme dans l'événement [`'request'`](/fr/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex) Socket réseau entre le serveur et le client
- `head` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le premier paquet du flux de tunneling (peut être vide)

Émis chaque fois qu'un client demande une méthode HTTP `CONNECT`. Si cet événement n'est pas écouté, les clients demandant une méthode `CONNECT` verront leurs connexions fermées.

Cet événement est garanti de transmettre une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur spécifie un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

Une fois cet événement émis, le socket de la requête n'aura pas d'écouteur d'événement `'data'`, ce qui signifie qu'il devra être lié afin de gérer les données envoyées au serveur sur ce socket.

### Événement : `'connection'` {#event-connection}

**Ajouté dans : v0.1.0**

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Cet événement est émis lorsqu'un nouveau flux TCP est établi. `socket` est généralement un objet de type [`net.Socket`](/fr/nodejs/api/net#class-netsocket). Généralement, les utilisateurs ne voudront pas accéder à cet événement. En particulier, le socket n'émettra pas d'événements `'readable'` en raison de la façon dont l'analyseur de protocole s'attache au socket. Le `socket` est également accessible à `request.socket`.

Cet événement peut également être émis explicitement par les utilisateurs pour injecter des connexions dans le serveur HTTP. Dans ce cas, tout flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) peut être passé.

Si `socket.setTimeout()` est appelé ici, le délai d'attente sera remplacé par `server.keepAliveTimeout` lorsque le socket aura servi une requête (si `server.keepAliveTimeout` est différent de zéro).

Cet événement est garanti de transmettre une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur spécifie un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).


### Événement : `'dropRequest'` {#event-droprequest}

**Ajouté dans : v18.7.0, v16.17.0**

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage) Arguments de la requête HTTP, tels qu'ils apparaissent dans l'événement [`'request'`](/fr/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex) Socket réseau entre le serveur et le client

Lorsque le nombre de requêtes sur un socket atteint le seuil de `server.maxRequestsPerSocket`, le serveur abandonne les nouvelles requêtes et émet l'événement `'dropRequest'` à la place, puis envoie `503` au client.

### Événement : `'request'` {#event-request}

**Ajouté dans : v0.1.0**

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)

Émis chaque fois qu'il y a une requête. Il peut y avoir plusieurs requêtes par connexion (dans le cas des connexions HTTP Keep-Alive).

### Événement : `'upgrade'` {#event-upgrade_1}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Le fait de ne plus écouter cet événement ne provoque plus la destruction du socket si un client envoie un en-tête Upgrade. |
| v0.1.94 | Ajouté dans : v0.1.94 |
:::

- `request` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage) Arguments de la requête HTTP, tels qu'ils apparaissent dans l'événement [`'request'`](/fr/nodejs/api/http#event-request)
- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex) Socket réseau entre le serveur et le client
- `head` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le premier paquet du flux mis à niveau (peut être vide)

Émis chaque fois qu'un client demande une mise à niveau HTTP. L'écoute de cet événement est facultative et les clients ne peuvent pas insister sur un changement de protocole.

Une fois cet événement émis, le socket de la requête n'aura pas d'écouteur d'événement `'data'`, ce qui signifie qu'il devra être lié afin de gérer les données envoyées au serveur sur ce socket.

Il est garanti que cet événement se verra transmettre une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur spécifie un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).


### `server.close([callback])` {#serverclosecallback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | La méthode ferme les connexions inactives avant de retourner. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Empêche le serveur d'accepter de nouvelles connexions et ferme toutes les connexions connectées à ce serveur qui n'envoient pas de requête ou n'attendent pas de réponse. Voir [`net.Server.close()`](/fr/nodejs/api/net#serverclosecallback).

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Fermer le serveur après 10 secondes
setTimeout(() => {
  server.close(() => {
    console.log('serveur sur le port 8000 fermé avec succès');
  });
}, 10000);
```
### `server.closeAllConnections()` {#servercloseallconnections}

**Ajouté dans : v18.2.0**

Ferme toutes les connexions HTTP(S) établies connectées à ce serveur, y compris les connexions actives connectées à ce serveur qui envoient une requête ou attendent une réponse. Cela ne détruit *pas* les sockets mis à niveau vers un protocole différent, tel que WebSocket ou HTTP/2.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Fermer le serveur après 10 secondes
setTimeout(() => {
  server.close(() => {
    console.log('serveur sur le port 8000 fermé avec succès');
  });
  // Ferme toutes les connexions, garantissant que le serveur se ferme avec succès
  server.closeAllConnections();
}, 10000);
```
### `server.closeIdleConnections()` {#servercloseidleconnections}

**Ajouté dans : v18.2.0**

Ferme toutes les connexions connectées à ce serveur qui n'envoient pas de requête ou n'attendent pas de réponse.

```js [ESM]
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Fermer le serveur après 10 secondes
setTimeout(() => {
  server.close(() => {
    console.log('serveur sur le port 8000 fermé avec succès');
  });
  // Ferme les connexions inactives, telles que les connexions keep-alive. Le serveur se fermera
  // une fois que les connexions actives restantes seront terminées
  server.closeIdleConnections();
}, 10000);
```

### `server.headersTimeout` {#serverheaderstimeout}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.4.0, v18.14.0 | La valeur par défaut est maintenant définie sur le minimum entre 60000 (60 secondes) ou `requestTimeout`. |
| v11.3.0, v10.14.0 | Ajouté dans : v11.3.0, v10.14.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** Le minimum entre [`server.requestTimeout`](/fr/nodejs/api/http#serverrequesttimeout) ou `60000`.

Limite la durée pendant laquelle l’analyseur syntaxique attendra de recevoir les en-têtes HTTP complets.

Si le délai d’expiration est dépassé, le serveur répond avec le statut 408 sans transmettre la requête à l’écouteur de requêtes, puis ferme la connexion.

Elle doit être définie sur une valeur différente de zéro (par exemple, 120 secondes) pour se protéger contre les potentielles attaques par déni de service dans le cas où le serveur est déployé sans proxy inverse devant.

### `server.listen()` {#serverlisten}

Démarre le serveur HTTP en écoutant les connexions. Cette méthode est identique à [`server.listen()`](/fr/nodejs/api/net#serverlisten) de [`net.Server`](/fr/nodejs/api/net#class-netserver).

### `server.listening` {#serverlistening}

**Ajouté dans : v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si le serveur écoute ou non les connexions.

### `server.maxHeadersCount` {#servermaxheaderscount}

**Ajouté dans : v0.7.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `2000`

Limite le nombre maximal d’en-têtes entrants. Si la valeur est définie sur 0, aucune limite ne sera appliquée.

### `server.requestTimeout` {#serverrequesttimeout}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le délai d’expiration de la requête par défaut est passé d’aucun délai d’expiration à 300s (5 minutes). |
| v14.11.0 | Ajouté dans : v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `300000`

Définit la valeur de délai d’expiration en millisecondes pour la réception de la requête entière du client.

Si le délai d’expiration est dépassé, le serveur répond avec le statut 408 sans transmettre la requête à l’écouteur de requêtes, puis ferme la connexion.

Elle doit être définie sur une valeur différente de zéro (par exemple, 120 secondes) pour se protéger contre les potentielles attaques par déni de service dans le cas où le serveur est déployé sans proxy inverse devant.


### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Le délai d'attente par défaut est passé de 120s à 0 (pas de délai d'attente). |
| v0.9.12 | Ajouté dans: v0.9.12 |
:::

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** 0 (pas de délai d'attente)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Renvoie : [\<http.Server\>](/fr/nodejs/api/http#class-httpserver)

Définit la valeur du délai d'attente pour les sockets et émet un événement `'timeout'` sur l'objet Server, en transmettant le socket comme argument, si un délai d'attente se produit.

S'il existe un écouteur d'événement `'timeout'` sur l'objet Server, il sera appelé avec le socket ayant expiré comme argument.

Par défaut, le serveur ne fait pas expirer les sockets. Cependant, si un callback est assigné à l'événement `'timeout'` du Server, les délais d'attente doivent être gérés explicitement.

### `server.maxRequestsPerSocket` {#servermaxrequestspersocket}

**Ajouté dans : v16.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Requêtes par socket. **Par défaut :** 0 (pas de limite)

Le nombre maximum de requêtes qu'un socket peut gérer avant de fermer la connexion keep alive.

Une valeur de `0` désactivera la limite.

Lorsque la limite est atteinte, la valeur de l'en-tête `Connection` sera définie sur `close`, mais la connexion ne sera pas réellement fermée, les requêtes suivantes envoyées après que la limite est atteinte recevront `503 Service Unavailable` comme réponse.

### `server.timeout` {#servertimeout}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Le délai d'attente par défaut est passé de 120s à 0 (pas de délai d'attente). |
| v0.9.12 | Ajouté dans: v0.9.12 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Délai d'attente en millisecondes. **Par défaut :** 0 (pas de délai d'attente)

Le nombre de millisecondes d'inactivité avant de présumer qu'un socket a expiré.

Une valeur de `0` désactivera le comportement de délai d'attente sur les connexions entrantes.

La logique de délai d'attente du socket est configurée lors de la connexion, donc la modification de cette valeur affecte uniquement les nouvelles connexions au serveur, et non les connexions existantes.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Ajouté dans : v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Délai d'attente en millisecondes. **Par défaut :** `5000` (5 secondes).

Le nombre de millisecondes d'inactivité qu'un serveur doit attendre pour recevoir des données entrantes supplémentaires, après avoir terminé d'écrire la dernière réponse, avant qu'un socket ne soit détruit. Si le serveur reçoit de nouvelles données avant que le délai d'attente de maintien en vie ne soit écoulé, il réinitialisera le délai d'attente d'inactivité régulier, c'est-à-dire [`server.timeout`](/fr/nodejs/api/http#servertimeout).

Une valeur de `0` désactivera le comportement de délai d'attente de maintien en vie sur les connexions entrantes. Une valeur de `0` fait que le serveur http se comporte de la même manière que les versions de Node.js antérieures à la version 8.0.0, qui n'avaient pas de délai d'attente de maintien en vie.

La logique de délai d'attente du socket est configurée lors de la connexion, donc la modification de cette valeur n'affecte que les nouvelles connexions au serveur, pas les connexions existantes.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Ajouté dans : v20.4.0**

::: warning [Stable: 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Appelle [`server.close()`](/fr/nodejs/api/http#serverclosecallback) et renvoie une promesse qui se réalise lorsque le serveur s'est fermé.

## Classe : `http.ServerResponse` {#class-httpserverresponse}

**Ajouté dans : v0.1.17**

- Hérite de : [\<http.OutgoingMessage\>](/fr/nodejs/api/http#class-httpoutgoingmessage)

Cet objet est créé en interne par un serveur HTTP, pas par l'utilisateur. Il est transmis comme deuxième paramètre à l'événement [`'request'`](/fr/nodejs/api/http#event-request).

### Événement : `'close'` {#event-close_2}

**Ajouté dans : v0.6.7**

Indique que la réponse est terminée, ou que sa connexion sous-jacente a été interrompue prématurément (avant la fin de la réponse).

### Événement : `'finish'` {#event-finish_1}

**Ajouté dans : v0.3.6**

Émis lorsque la réponse a été envoyée. Plus précisément, cet événement est émis lorsque le dernier segment des en-têtes et du corps de la réponse a été remis au système d'exploitation pour être transmis sur le réseau. Cela n'implique pas que le client ait déjà reçu quoi que ce soit.


### `response.addTrailers(headers)` {#responseaddtrailersheaders}

**Ajouté dans : v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Cette méthode ajoute des en-têtes de fin HTTP (un en-tête mais à la fin du message) à la réponse.

Les en-têtes de fin ne seront émis **que** si le codage fragmenté est utilisé pour la réponse ; si ce n'est pas le cas (par exemple, si la requête était HTTP/1.0), ils seront ignorés silencieusement.

HTTP exige que l'en-tête `Trailer` soit envoyé afin d'émettre des en-têtes de fin, avec une liste des champs d'en-tête dans sa valeur. Par exemple :

```js [ESM]
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```
Tenter de définir un nom de champ d'en-tête ou une valeur qui contient des caractères invalides entraînera une exception [`TypeError`](/fr/nodejs/api/errors#class-typeerror).

### `response.connection` {#responseconnection}

**Ajouté dans : v0.3.0**

**Déprécié depuis : v13.0.0**

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez [`response.socket`](/fr/nodejs/api/http#responsesocket).
:::

- [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Voir [`response.socket`](/fr/nodejs/api/http#responsesocket).

### `response.cork()` {#responsecork}

**Ajouté dans : v13.2.0, v12.16.0**

Voir [`writable.cork()`](/fr/nodejs/api/stream#writablecork).

### `response.end([data[, encoding]][, callback])` {#responseenddata-encoding-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le paramètre `data` peut maintenant être un `Uint8Array`. |
| v10.0.0 | Cette méthode renvoie maintenant une référence à `ServerResponse`. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Cette méthode signale au serveur que tous les en-têtes et le corps de la réponse ont été envoyés ; ce serveur doit considérer ce message comme terminé. La méthode, `response.end()`, DOIT être appelée sur chaque réponse.

Si `data` est spécifié, son effet est similaire à celui de l'appel de [`response.write(data, encoding)`](/fr/nodejs/api/http#responsewritechunk-encoding-callback) suivi de `response.end(callback)`.

Si `callback` est spécifié, il sera appelé lorsque le flux de réponse est terminé.


### `response.finished` {#responsefinished}

**Ajouté dans: v0.0.2**

**Déprécié depuis: v13.4.0, v12.16.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez [`response.writableEnded`](/fr/nodejs/api/http#responsewritableended).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `response.finished` sera `true` si [`response.end()`](/fr/nodejs/api/http#responseenddata-encoding-callback) a été appelée.

### `response.flushHeaders()` {#responseflushheaders}

**Ajouté dans: v1.6.0**

Vide les en-têtes de réponse. Voir aussi : [`request.flushHeaders()`](/fr/nodejs/api/http#requestflushheaders).

### `response.getHeader(name)` {#responsegetheadername}

**Ajouté dans: v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Lit un en-tête qui a déjà été mis en file d’attente, mais qui n’a pas été envoyé au client. Le nom n’est pas sensible à la casse. Le type de la valeur de retour dépend des arguments fournis à [`response.setHeader()`](/fr/nodejs/api/http#responsesetheadername-value).

```js [ESM]
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType est 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength est de type number
const setCookie = response.getHeader('set-cookie');
// setCookie est de type string[]
```
### `response.getHeaderNames()` {#responsegetheadernames}

**Ajouté dans: v7.7.0**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne un tableau contenant les noms uniques des en-têtes sortants actuels. Tous les noms d’en-tête sont en minuscules.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()` {#responsegetheaders}

**Ajouté dans : v7.7.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne une copie superficielle des en-têtes sortants actuels. Étant donné qu'une copie superficielle est utilisée, les valeurs de tableau peuvent être modifiées sans appels supplémentaires à diverses méthodes de module http liées aux en-têtes. Les clés de l'objet retourné sont les noms d'en-tête et les valeurs sont les valeurs d'en-tête respectives. Tous les noms d'en-tête sont en minuscules.

L'objet retourné par la méthode `response.getHeaders()` n'hérite *pas* prototypiquement de l'`Object` JavaScript. Cela signifie que les méthodes `Object` typiques telles que `obj.toString()`, `obj.hasOwnProperty()` et autres ne sont pas définies et *ne fonctionneront pas*.

```js [ESM]
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `response.hasHeader(name)` {#responsehasheadername}

**Ajouté dans : v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si l'en-tête identifié par `name` est actuellement défini dans les en-têtes sortants. La correspondance du nom d'en-tête ne respecte pas la casse.

```js [ESM]
const hasContentType = response.hasHeader('content-type');
```
### `response.headersSent` {#responseheaderssent}

**Ajouté dans : v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Booléen (lecture seule). Vrai si les en-têtes ont été envoyés, faux sinon.

### `response.removeHeader(name)` {#responseremoveheadername}

**Ajouté dans : v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Supprime un en-tête qui est mis en file d'attente pour un envoi implicite.

```js [ESM]
response.removeHeader('Content-Encoding');
```
### `response.req` {#responsereq}

**Ajouté dans : v15.7.0**

- [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)

Une référence à l'objet `request` HTTP original.


### `response.sendDate` {#responsesenddate}

**Ajouté dans : v0.7.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quand la valeur est true, l’en-tête Date sera automatiquement généré et envoyé dans la réponse s’il n’est pas déjà présent dans les en-têtes. La valeur par défaut est true.

Ceci ne doit être désactivé que pour les tests ; HTTP requiert l’en-tête Date dans les réponses.

### `response.setHeader(name, value)` {#responsesetheadername-value}

**Ajouté dans : v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retourne : [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)

Retourne l’objet response.

Définit une seule valeur d’en-tête pour les en-têtes implicites. Si cet en-tête existe déjà dans les en-têtes à envoyer, sa valeur sera remplacée. Utilisez un tableau de chaînes de caractères ici pour envoyer plusieurs en-têtes avec le même nom. Les valeurs non-chaînes seront stockées sans modification. Par conséquent, [`response.getHeader()`](/fr/nodejs/api/http#responsegetheadername) peut retourner des valeurs non-chaînes. Cependant, les valeurs non-chaînes seront converties en chaînes pour la transmission réseau. Le même objet response est retourné à l’appelant, pour permettre le chaînage d’appels.

```js [ESM]
response.setHeader('Content-Type', 'text/html');
```
ou

```js [ESM]
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```
Tenter de définir un nom ou une valeur de champ d’en-tête contenant des caractères non valides entraînera la levée d’une erreur [`TypeError`](/fr/nodejs/api/errors#class-typeerror).

Lorsque des en-têtes ont été définis avec [`response.setHeader()`](/fr/nodejs/api/http#responsesetheadername-value), ils seront fusionnés avec tous les en-têtes passés à [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), les en-têtes passés à [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) ayant la priorité.

```js [ESM]
// Retourne content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
Si la méthode [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) est appelée et que cette méthode n’a pas été appelée, elle écrira directement les valeurs d’en-tête fournies sur le canal réseau sans mise en cache interne, et [`response.getHeader()`](/fr/nodejs/api/http#responsegetheadername) sur l’en-tête ne donnera pas le résultat attendu. Si un remplissage progressif des en-têtes est souhaité avec une récupération et une modification futures potentielles, utilisez [`response.setHeader()`](/fr/nodejs/api/http#responsesetheadername-value) au lieu de [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers).


### `response.setTimeout(msecs[, callback])` {#responsesettimeoutmsecs-callback}

**Ajoutée dans : v0.9.12**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne: [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)

Définit la valeur de timeout du Socket à `msecs`. Si un callback est fourni, il est ajouté comme un listener à l'événement `'timeout'` sur l'objet réponse.

Si aucun listener `'timeout'` n'est ajouté à la requête, à la réponse ou au serveur, les sockets sont détruits lorsqu'ils expirent. Si un gestionnaire est assigné aux événements `'timeout'` de la requête, de la réponse ou du serveur, les sockets expirés doivent être gérés explicitement.

### `response.socket` {#responsesocket}

**Ajoutée dans : v0.3.0**

- [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Référence au socket sous-jacent. Généralement, les utilisateurs ne souhaitent pas accéder à cette propriété. En particulier, le socket n'émettra pas d'événements `'readable'` en raison de la façon dont l'analyseur de protocole s'attache au socket. Après `response.end()`, la propriété est mise à null.

::: code-group
```js [ESM]
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```js [CJS]
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```
:::

Cette propriété est garantie d'être une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur a spécifié un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket).

### `response.statusCode` {#responsestatuscode}

**Ajoutée dans : v0.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `200`

Lors de l'utilisation d'en-têtes implicites (sans appeler explicitement [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)), cette propriété contrôle le code d'état qui sera envoyé au client lorsque les en-têtes seront vidés.

```js [ESM]
response.statusCode = 404;
```
Après que l'en-tête de réponse a été envoyé au client, cette propriété indique le code d'état qui a été envoyé.


### `response.statusMessage` {#responsestatusmessage}

**Ajouté dans : v0.11.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Lors de l'utilisation d'en-têtes implicites (sans appel explicite à [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers)), cette propriété contrôle le message d'état qui sera envoyé au client lorsque les en-têtes seront vidés. Si elle est laissée à `undefined`, le message standard pour le code d'état sera utilisé.

```js [ESM]
response.statusMessage = 'Not found';
```
Après que l'en-tête de réponse ait été envoyé au client, cette propriété indique le message d'état qui a été envoyé.

### `response.strictContentLength` {#responsestrictcontentlength}

**Ajouté dans : v18.10.0, v16.18.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Par défaut :** `false`

Si la valeur est `true`, Node.js vérifiera si la valeur de l'en-tête `Content-Length` et la taille du corps, en octets, sont égales. Une non-concordance de la valeur de l'en-tête `Content-Length` entraînera la levée d'une `Error`, identifiée par `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`](/fr/nodejs/api/errors#err_http_content_length_mismatch).

### `response.uncork()` {#responseuncork}

**Ajouté dans : v13.2.0, v12.16.0**

Voir [`writable.uncork()`](/fr/nodejs/api/stream#writableuncork).

### `response.writableEnded` {#responsewritableended}

**Ajouté dans : v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` après que [`response.end()`](/fr/nodejs/api/http#responseenddata-encoding-callback) ait été appelé. Cette propriété n'indique pas si les données ont été vidées, utilisez plutôt [`response.writableFinished`](/fr/nodejs/api/http#responsewritablefinished) à cette fin.

### `response.writableFinished` {#responsewritablefinished}

**Ajouté dans : v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` si toutes les données ont été vidées vers le système sous-jacent, immédiatement avant que l'événement [`'finish'`](/fr/nodejs/api/http#event-finish) ne soit émis.

### `response.write(chunk[, encoding][, callback])` {#responsewritechunk-encoding-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le paramètre `chunk` peut maintenant être un `Uint8Array`. |
| v0.1.29 | Ajouté dans : v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Si cette méthode est appelée et que [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) n'a pas été appelée, elle passera en mode d'en-tête implicite et videra les en-têtes implicites.

Ceci envoie un morceau du corps de la réponse. Cette méthode peut être appelée plusieurs fois pour fournir des parties successives du corps.

Si `rejectNonStandardBodyWrites` est défini sur true dans `createServer`, l'écriture dans le corps n'est pas autorisée lorsque la méthode de requête ou l'état de la réponse ne prennent pas en charge le contenu. Si une tentative d'écriture dans le corps est effectuée pour une requête HEAD ou dans le cadre d'une réponse `204` ou `304`, une `Error` synchrone avec le code `ERR_HTTP_BODY_NOT_ALLOWED` est levée.

`chunk` peut être une chaîne de caractères ou un tampon. Si `chunk` est une chaîne de caractères, le deuxième paramètre spécifie comment l'encoder en un flux d'octets. `callback` sera appelé lorsque ce morceau de données sera vidé.

Il s'agit du corps HTTP brut et cela n'a rien à voir avec les encodages de corps multi-parties de niveau supérieur qui peuvent être utilisés.

La première fois que [`response.write()`](/fr/nodejs/api/http#responsewritechunk-encoding-callback) est appelé, il enverra les informations d'en-tête mises en mémoire tampon et le premier morceau du corps au client. La deuxième fois que [`response.write()`](/fr/nodejs/api/http#responsewritechunk-encoding-callback) est appelé, Node.js suppose que les données seront diffusées en continu et envoie les nouvelles données séparément. Autrement dit, la réponse est mise en mémoire tampon jusqu'au premier morceau du corps.

Renvoie `true` si toutes les données ont été vidées avec succès dans le tampon du noyau. Renvoie `false` si tout ou partie des données ont été mises en file d'attente dans la mémoire utilisateur. `'drain'` sera émis lorsque le tampon sera à nouveau libre.


### `response.writeContinue()` {#responsewritecontinue}

**Ajoutée dans : v0.3.0**

Envoie un message HTTP/1.1 100 Continue au client, indiquant que le corps de la requête doit être envoyé. Voir l'événement [`'checkContinue'`](/fr/nodejs/api/http#event-checkcontinue) sur `Server`.

### `response.writeEarlyHints(hints[, callback])` {#responsewriteearlyhintshints-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.11.0 | Autorise de passer des indices comme un objet. |
| v18.11.0 | Ajoutée dans : v18.11.0 |
:::

- `hints` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Envoie un message HTTP/1.1 103 Early Hints au client avec un en-tête Link, indiquant que l'agent utilisateur peut précharger/préconnecter les ressources liées. Les `hints` sont un objet contenant les valeurs des en-têtes à envoyer avec le message early hints. L'argument facultatif `callback` sera appelé lorsque le message de réponse aura été écrit.

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
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```
### `response.writeHead(statusCode[, statusMessage][, headers])` {#responsewriteheadstatuscode-statusmessage-headers}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.14.0 | Autorise de passer des en-têtes comme un tableau. |
| v11.10.0, v10.17.0 | Retourne `this` depuis `writeHead()` pour permettre le chaînage avec `end()`. |
| v5.11.0, v4.4.5 | Un `RangeError` est émis si `statusCode` n'est pas un nombre compris dans la plage `[100, 999]`. |
| v0.1.30 | Ajoutée dans : v0.1.30 |
:::

- `statusCode` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `statusMessage` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Retourne : [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse)

Envoie un en-tête de réponse à la requête. Le code d'état est un code d'état HTTP à 3 chiffres, tel que `404`. Le dernier argument, `headers`, est constitué des en-têtes de réponse. Vous pouvez éventuellement fournir un `statusMessage` lisible par l'homme comme deuxième argument.

`headers` peut être un `Array` où les clés et les valeurs sont dans la même liste. Ce n'est *pas* une liste de tuples. Ainsi, les décalages pairs sont les valeurs de clé, et les décalages impairs sont les valeurs associées. Le tableau est au même format que `request.rawHeaders`.

Retourne une référence à `ServerResponse`, de sorte que les appels puissent être chaînés.

```js [ESM]
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```
Cette méthode ne doit être appelée qu'une seule fois sur un message et doit être appelée avant l'appel de [`response.end()`](/fr/nodejs/api/http#responseenddata-encoding-callback).

Si [`response.write()`](/fr/nodejs/api/http#responsewritechunk-encoding-callback) ou [`response.end()`](/fr/nodejs/api/http#responseenddata-encoding-callback) sont appelés avant d'appeler ceci, les en-têtes implicites/mutables seront calculés et appelleront cette fonction.

Lorsque des en-têtes ont été définis avec [`response.setHeader()`](/fr/nodejs/api/http#responsesetheadername-value), ils seront fusionnés avec tous les en-têtes passés à [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), les en-têtes passés à [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) ayant la priorité.

Si cette méthode est appelée et que [`response.setHeader()`](/fr/nodejs/api/http#responsesetheadername-value) n'a pas été appelée, elle écrira directement les valeurs d'en-tête fournies sur le canal réseau sans mise en cache interne, et le [`response.getHeader()`](/fr/nodejs/api/http#responsegetheadername) sur l'en-tête ne donnera pas le résultat attendu. Si un remplissage progressif des en-têtes est souhaité avec une récupération et une modification ultérieures potentielles, utilisez plutôt [`response.setHeader()`](/fr/nodejs/api/http#responsesetheadername-value).

```js [ESM]
// Retourne content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```
`Content-Length` est lu en octets, pas en caractères. Utilisez [`Buffer.byteLength()`](/fr/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding) pour déterminer la longueur du corps en octets. Node.js vérifiera si `Content-Length` et la longueur du corps qui a été transmis sont égaux ou non.

Tenter de définir un nom ou une valeur de champ d'en-tête contenant des caractères non valides entraînera la levée d'une [`Error`][].


### `response.writeProcessing()` {#responsewriteprocessing}

**Ajoutée dans : v10.0.0**

Envoie un message HTTP/1.1 102 Processing au client, indiquant que le corps de la requête doit être envoyé.

## Classe : `http.IncomingMessage` {#class-httpincomingmessage}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.5.0 | La valeur `destroyed` renvoie `true` une fois les données entrantes consommées. |
| v13.1.0, v12.16.0 | La valeur `readableHighWaterMark` reflète celle du socket. |
| v0.1.17 | Ajoutée dans : v0.1.17 |
:::

- Hérite de : [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable)

Un objet `IncomingMessage` est créé par [`http.Server`](/fr/nodejs/api/http#class-httpserver) ou [`http.ClientRequest`](/fr/nodejs/api/http#class-httpclientrequest) et passé comme premier argument aux événements [`'request'`](/fr/nodejs/api/http#event-request) et [`'response'`](/fr/nodejs/api/http#event-response) respectivement. Il peut être utilisé pour accéder au statut, aux headers et aux données de la réponse.

Contrairement à sa valeur `socket` qui est une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), `IncomingMessage` elle-même hérite de [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) et est créée séparément pour analyser et émettre les headers HTTP et la charge utile entrants, car le socket sous-jacent peut être réutilisé plusieurs fois en cas de keep-alive.

### Événement : `'aborted'` {#event-aborted}

**Ajoutée dans : v0.3.8**

**Dépréciée depuis : v17.0.0, v16.12.0**

::: danger [Stable : 0 - Dépréciée]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Dépréciée. Écoutez plutôt l’événement `'close'`.
:::

Émise lorsque la requête a été abandonnée.

### Événement : `'close'` {#event-close_3}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | L’événement close est désormais émis lorsque la requête est terminée et non lorsque le socket sous-jacent est fermé. |
| v0.4.2 | Ajoutée dans : v0.4.2 |
:::

Émise lorsque la requête est terminée.

### `message.aborted` {#messageaborted}

**Ajoutée dans : v10.1.0**

**Dépréciée depuis : v17.0.0, v16.12.0**

::: danger [Stable : 0 - Dépréciée]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Dépréciée. Vérifiez `message.destroyed` depuis [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable).
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `message.aborted` sera `true` si la requête a été abandonnée.


### `message.complete` {#messagecomplete}

**Ajouté dans: v0.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La propriété `message.complete` sera `true` si un message HTTP complet a été reçu et analysé avec succès.

Cette propriété est particulièrement utile pour déterminer si un client ou un serveur a entièrement transmis un message avant qu'une connexion ne soit interrompue :

```js [ESM]
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'La connexion a été interrompue alors que le message était encore en cours d\'envoi');
  });
});
```
### `message.connection` {#messageconnection}

**Ajouté dans : v0.1.90**

**Déprécié depuis : v16.0.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié. Utilisez [`message.socket`](/fr/nodejs/api/http#messagesocket).
:::

Alias pour [`message.socket`](/fr/nodejs/api/http#messagesocket).

### `message.destroy([error])` {#messagedestroyerror}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0, v12.19.0 | La fonction renvoie `this` pour assurer la cohérence avec les autres flux Readable. |
| v0.3.0 | Ajouté dans : v0.3.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Renvoie : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Appelle `destroy()` sur le socket qui a reçu le `IncomingMessage`. Si `error` est fourni, un événement `'error'` est émis sur le socket et `error` est transmis en tant qu'argument à tous les écouteurs de l'événement.

### `message.headers` {#messageheaders}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.5.0, v18.14.0 | L'option `joinDuplicateHeaders` dans les fonctions `http.request()` et `http.createServer()` garantit que les en-têtes dupliqués ne sont pas ignorés, mais plutôt combinés à l'aide d'un séparateur de virgule, conformément à la section 5.3 de la RFC 9110. |
| v15.1.0 | `message.headers` est désormais calculé paresseusement à l'aide d'une propriété d'accesseur sur le prototype et n'est plus énumérable. |
| v0.1.5 | Ajouté dans : v0.1.5 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'objet des en-têtes de requête/réponse.

Paires clé-valeur des noms et valeurs d'en-tête. Les noms d'en-tête sont en minuscules.

```js [ESM]
// Affiche quelque chose comme :
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```
Les doublons dans les en-têtes bruts sont gérés de la manière suivante, en fonction du nom de l'en-tête :

- Les doublons de `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server` ou `user-agent` sont ignorés. Pour autoriser la fusion des valeurs en double des en-têtes énumérés ci-dessus, utilisez l'option `joinDuplicateHeaders` dans [`http.request()`](/fr/nodejs/api/http#httprequestoptions-callback) et [`http.createServer()`](/fr/nodejs/api/http#httpcreateserveroptions-requestlistener). Voir la section 5.3 de la RFC 9110 pour plus d'informations.
- `set-cookie` est toujours un tableau. Les doublons sont ajoutés au tableau.
- Pour les en-têtes `cookie` en double, les valeurs sont jointes avec `; `.
- Pour tous les autres en-têtes, les valeurs sont jointes avec `, `.


### `message.headersDistinct` {#messageheadersdistinct}

**Ajouté dans : v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Similaire à [`message.headers`](/fr/nodejs/api/http#messageheaders), mais il n’y a pas de logique de jointure et les valeurs sont toujours des tableaux de chaînes, même pour les en-têtes reçus une seule fois.

```js [ESM]
// Affiche quelque chose comme :
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```
### `message.httpVersion` {#messagehttpversion}

**Ajouté dans : v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Dans le cas d’une requête de serveur, la version HTTP envoyée par le client. Dans le cas d’une réponse du client, la version HTTP du serveur connecté. Probablement `'1.1'` ou `'1.0'`.

De plus, `message.httpVersionMajor` est le premier entier et `message.httpVersionMinor` est le second.

### `message.method` {#messagemethod}

**Ajouté dans : v0.1.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Valide uniquement pour la requête obtenue à partir de <a href="#class-httpserver"><code>http.Server</code></a>.**

La méthode de requête sous forme de chaîne. Lecture seule. Exemples : `'GET'`, `'DELETE'`.

### `message.rawHeaders` {#messagerawheaders}

**Ajouté dans : v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La liste brute des en-têtes de requête/réponse exactement tels qu’ils ont été reçus.

Les clés et les valeurs sont dans la même liste. Ce n’est *pas* une liste de tuples. Ainsi, les décalages numérotés paires sont des valeurs de clé, et les décalages numérotés impaires sont les valeurs associées.

Les noms d’en-tête ne sont pas en minuscules et les doublons ne sont pas fusionnés.

```js [ESM]
// Affiche quelque chose comme :
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
### `message.rawTrailers` {#messagerawtrailers}

**Ajouté dans : v0.11.6**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Les clés et valeurs brutes des trailers de requête/réponse exactement telles qu’elles ont été reçues. Rempli uniquement à l’événement `'end'`.


### `message.setTimeout(msecs[, callback])` {#messagesettimeoutmsecs-callback}

**Ajouté dans : v0.5.9**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage)

Appelle `message.socket.setTimeout(msecs, callback)`.

### `message.socket` {#messagesocket}

**Ajouté dans : v0.3.0**

- [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

L'objet [`net.Socket`](/fr/nodejs/api/net#class-netsocket) associé à la connexion.

Avec le support HTTPS, utilisez [`request.socket.getPeerCertificate()`](/fr/nodejs/api/tls#tlssocketgetpeercertificatedetailed) pour obtenir les détails d'authentification du client.

Cette propriété est garantie d'être une instance de la classe [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket), une sous-classe de [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex), sauf si l'utilisateur a spécifié un type de socket autre que [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) ou mis à zéro en interne.

### `message.statusCode` {#messagestatuscode}

**Ajouté dans : v0.1.1**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

**Valide uniquement pour la réponse obtenue à partir de <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

Le code de statut de réponse HTTP à 3 chiffres. Par exemple `404`.

### `message.statusMessage` {#messagestatusmessage}

**Ajouté dans : v0.11.10**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Valide uniquement pour la réponse obtenue à partir de <a href="#class-httpclientrequest"><code>http.ClientRequest</code></a>.**

Le message d'état de réponse HTTP (phrase de motif). Par exemple, `OK` ou `Internal Server Error`.

### `message.trailers` {#messagetrailers}

**Ajouté dans : v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

L'objet de trailers de requête/réponse. Rempli uniquement lors de l'événement `'end'`.

### `message.trailersDistinct` {#messagetrailersdistinct}

**Ajouté dans : v18.3.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Similaire à [`message.trailers`](/fr/nodejs/api/http#messagetrailers), mais il n'y a pas de logique de jointure et les valeurs sont toujours des tableaux de chaînes, même pour les en-têtes reçus une seule fois. Rempli uniquement lors de l'événement `'end'`.


### `message.url` {#messageurl}

**Ajouté dans: v0.1.90**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

**Valide uniquement pour les requêtes obtenues à partir de <a href="#class-httpserver"><code>http.Server</code></a>.**

Chaîne d'URL de la requête. Elle ne contient que l'URL présente dans la requête HTTP réelle. Prenez la requête suivante :

GET /status?name=ryan HTTP/1.1
Accept: text/plain
```
Pour analyser l'URL en ses différentes parties :

```js [ESM]
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```
Lorsque `request.url` est `'/status?name=ryan'` et que `process.env.HOST` n'est pas défini :

```bash [BASH]
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```
Assurez-vous de définir `process.env.HOST` sur le nom d'hôte du serveur, ou envisagez de remplacer complètement cette partie. Si vous utilisez `req.headers.host`, assurez-vous qu'une validation appropriée est utilisée, car les clients peuvent spécifier un en-tête `Host` personnalisé.

## Classe: `http.OutgoingMessage` {#class-httpoutgoingmessage}

**Ajouté dans: v0.1.17**

- Hérite de : [\<Stream\>](/fr/nodejs/api/stream#stream)

Cette classe sert de classe parente à [`http.ClientRequest`](/fr/nodejs/api/http#class-httpclientrequest) et [`http.ServerResponse`](/fr/nodejs/api/http#class-httpserverresponse). Il s'agit d'un message sortant abstrait du point de vue des participants d'une transaction HTTP.

### Événement: `'drain'` {#event-drain}

**Ajouté dans : v0.3.6**

Émis lorsque le tampon du message est à nouveau libre.

### Événement: `'finish'` {#event-finish_2}

**Ajouté dans: v0.1.17**

Émis lorsque la transmission est terminée avec succès.

### Événement: `'prefinish'` {#event-prefinish}

**Ajouté dans: v0.11.6**

Émis après l'appel de `outgoingMessage.end()`. Lorsque l'événement est émis, toutes les données ont été traitées, mais pas nécessairement complètement vidées.


### `outgoingMessage.addTrailers(headers)` {#outgoingmessageaddtrailersheaders}

**Ajouté dans : v0.3.0**

- `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ajoute des trailers HTTP (des en-têtes, mais à la fin du message) au message.

Les trailers ne seront émis **que** si le message est encodé par blocs. Si ce n’est pas le cas, les trailers seront discrètement ignorés.

HTTP requiert l’en-tête `Trailer` pour émettre des trailers, avec une liste de noms de champs d’en-tête dans sa valeur, p. ex. :

```js [ESM]
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```
Tenter de définir un nom ou une valeur de champ d’en-tête qui contient des caractères invalides entraînera la levée d’un `TypeError`.

### `outgoingMessage.appendHeader(name, value)` {#outgoingmessageappendheadername-value}

**Ajouté dans : v18.3.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom de l’en-tête
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valeur de l’en-tête
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Ajoute une seule valeur d’en-tête à l’objet d’en-tête.

Si la valeur est un tableau, cela équivaut à appeler cette méthode plusieurs fois.

S’il n’y avait pas de valeurs précédentes pour l’en-tête, cela équivaut à appeler [`outgoingMessage.setHeader(name, value)`](/fr/nodejs/api/http#outgoingmessagesetheadername-value).

En fonction de la valeur de `options.uniqueHeaders` lors de la création de la requête client ou du serveur, cela aboutira à l’envoi de l’en-tête plusieurs fois ou une seule fois avec des valeurs jointes à l’aide de `; `.

### `outgoingMessage.connection` {#outgoingmessageconnection}

**Ajouté dans : v0.3.0**

**Obsolète depuis : v15.12.0, v14.17.1**

::: danger [Stable: 0 - Obsolète]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Obsolète : utilisez plutôt [`outgoingMessage.socket`](/fr/nodejs/api/http#outgoingmessagesocket).
:::

Alias de [`outgoingMessage.socket`](/fr/nodejs/api/http#outgoingmessagesocket).


### `outgoingMessage.cork()` {#outgoingmessagecork}

**Ajouté dans : v13.2.0, v12.16.0**

Voir [`writable.cork()`](/fr/nodejs/api/stream#writablecork).

### `outgoingMessage.destroy([error])` {#outgoingmessagedestroyerror}

**Ajouté dans : v0.3.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Optionnel, une erreur à émettre avec l’événement `error`.
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Détruit le message. Une fois qu’un socket est associé au message et est connecté, ce socket sera également détruit.

### `outgoingMessage.end(chunk[, encoding][, callback])` {#outgoingmessageendchunk-encoding-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le paramètre `chunk` peut désormais être un `Uint8Array`. |
| v0.11.6 | Ajout de l’argument `callback`. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Optionnel, **Par défaut :** `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Optionnel
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Termine le message sortant. Si certaines parties du corps ne sont pas envoyées, elles seront envoyées au système sous-jacent. Si le message est segmenté, il enverra le segment de terminaison `0\r\n\r\n`, et enverra les trailers (le cas échéant).

Si `chunk` est spécifié, cela équivaut à appeler `outgoingMessage.write(chunk, encoding)`, suivi de `outgoingMessage.end(callback)`.

Si `callback` est fourni, il sera appelé lorsque le message sera terminé (équivalent à un listener de l’événement `'finish'`).

### `outgoingMessage.flushHeaders()` {#outgoingmessageflushheaders}

**Ajouté dans : v1.6.0**

Vide les en-têtes de message.

Pour des raisons d’efficacité, Node.js met normalement en mémoire tampon les en-têtes de message jusqu’à ce que `outgoingMessage.end()` soit appelé ou que le premier bloc de données de message soit écrit. Il essaie ensuite de regrouper les en-têtes et les données dans un seul paquet TCP.

C’est généralement souhaitable (cela permet d’économiser un aller-retour TCP), mais pas lorsque les premières données ne sont pas envoyées avant une date ultérieure. `outgoingMessage.flushHeaders()` contourne l’optimisation et démarre le message.


### `outgoingMessage.getHeader(name)` {#outgoingmessagegetheadername}

**Ajouté dans : v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom de l'en-tête
- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Récupère la valeur de l'en-tête HTTP portant le nom indiqué. Si cet en-tête n'est pas défini, la valeur retournée sera `undefined`.

### `outgoingMessage.getHeaderNames()` {#outgoingmessagegetheadernames}

**Ajouté dans : v7.7.0**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne un tableau contenant les noms uniques des en-têtes sortants actuels. Tous les noms sont en minuscules.

### `outgoingMessage.getHeaders()` {#outgoingmessagegetheaders}

**Ajouté dans : v7.7.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne une copie superficielle des en-têtes sortants actuels. Étant donné qu'une copie superficielle est utilisée, les valeurs de tableau peuvent être modifiées sans appels supplémentaires à diverses méthodes du module HTTP liées aux en-têtes. Les clés de l'objet retourné sont les noms des en-têtes et les valeurs sont les valeurs respectives des en-têtes. Tous les noms d'en-têtes sont en minuscules.

L'objet retourné par la méthode `outgoingMessage.getHeaders()` n'hérite pas par prototype de l'objet JavaScript `Object`. Cela signifie que les méthodes `Object` typiques telles que `obj.toString()`, `obj.hasOwnProperty()` et autres ne sont pas définies et ne fonctionneront pas.

```js [ESM]
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```
### `outgoingMessage.hasHeader(name)` {#outgoingmessagehasheadername}

**Ajouté dans : v7.7.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si l'en-tête identifié par `name` est actuellement défini dans les en-têtes sortants. Le nom de l'en-tête n'est pas sensible à la casse.

```js [ESM]
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent` {#outgoingmessageheaderssent}

**Ajouté dans : v0.9.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Lecture seule. `true` si les en-têtes ont été envoyés, sinon `false`.

### `outgoingMessage.pipe()` {#outgoingmessagepipe}

**Ajouté dans : v9.0.0**

Remplace la méthode `stream.pipe()` héritée de la classe `Stream` héritée, qui est la classe parente de `http.OutgoingMessage`.

L’appel de cette méthode lèvera une `Error` car `outgoingMessage` est un flux en écriture seule.

### `outgoingMessage.removeHeader(name)` {#outgoingmessageremoveheadername}

**Ajouté dans : v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom de l’en-tête

Supprime un en-tête mis en file d’attente pour un envoi implicite.

```js [ESM]
outgoingMessage.removeHeader('Content-Encoding');
```
### `outgoingMessage.setHeader(name, value)` {#outgoingmessagesetheadername-value}

**Ajouté dans : v0.4.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom de l’en-tête
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Valeur de l’en-tête
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Définit une seule valeur d’en-tête. Si l’en-tête existe déjà dans les en-têtes à envoyer, sa valeur sera remplacée. Utilisez un tableau de chaînes pour envoyer plusieurs en-têtes avec le même nom.

### `outgoingMessage.setHeaders(headers)` {#outgoingmessagesetheadersheaders}

**Ajouté dans : v19.6.0, v18.15.0**

- `headers` [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers) | [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Définit plusieurs valeurs d’en-tête pour les en-têtes implicites. `headers` doit être une instance de [`Headers`](/fr/nodejs/api/globals#class-headers) ou `Map`, si un en-tête existe déjà dans les en-têtes à envoyer, sa valeur sera remplacée.

```js [ESM]
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```
ou

```js [ESM]
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```
Lorsque des en-têtes ont été définis avec [`outgoingMessage.setHeaders()`](/fr/nodejs/api/http#outgoingmessagesetheadersheaders), ils seront fusionnés avec tous les en-têtes transmis à [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers), les en-têtes transmis à [`response.writeHead()`](/fr/nodejs/api/http#responsewriteheadstatuscode-statusmessage-headers) ayant priorité.

```js [ESM]
// Retourne content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msesc[, callback])` {#outgoingmessagesettimeoutmsesc-callback}

**Ajouté dans : v0.9.12**

- `msesc` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction optionnelle à appeler lorsqu'un timeout se produit. Identique à la liaison à l'événement `timeout`.
- Renvoie : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Une fois qu'un socket est associé au message et qu'il est connecté, [`socket.setTimeout()`](/fr/nodejs/api/net#socketsettimeouttimeout-callback) sera appelé avec `msecs` comme premier paramètre.

### `outgoingMessage.socket` {#outgoingmessagesocket}

**Ajouté dans : v0.3.0**

- [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Référence au socket sous-jacent. Généralement, les utilisateurs ne voudront pas accéder à cette propriété.

Après avoir appelé `outgoingMessage.end()`, cette propriété sera mise à null.

### `outgoingMessage.uncork()` {#outgoingmessageuncork}

**Ajouté dans : v13.2.0, v12.16.0**

Voir [`writable.uncork()`](/fr/nodejs/api/stream#writableuncork)

### `outgoingMessage.writableCorked` {#outgoingmessagewritablecorked}

**Ajouté dans : v13.2.0, v12.16.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre de fois que `outgoingMessage.cork()` a été appelé.

### `outgoingMessage.writableEnded` {#outgoingmessagewritableended}

**Ajouté dans : v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` si `outgoingMessage.end()` a été appelé. Cette propriété n'indique pas si les données ont été vidées. À cette fin, utilisez plutôt `message.writableFinished`.

### `outgoingMessage.writableFinished` {#outgoingmessagewritablefinished}

**Ajouté dans : v12.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Est `true` si toutes les données ont été vidées vers le système sous-jacent.

### `outgoingMessage.writableHighWaterMark` {#outgoingmessagewritablehighwatermark}

**Ajouté dans : v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le `highWaterMark` du socket sous-jacent s'il est attribué. Sinon, le niveau de tampon par défaut lorsque [`writable.write()`](/fr/nodejs/api/stream#writablewritechunk-encoding-callback) commence à renvoyer false (`16384`).


### `outgoingMessage.writableLength` {#outgoingmessagewritablelength}

**Ajouté dans : v12.9.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Le nombre d’octets mis en mémoire tampon.

### `outgoingMessage.writableObjectMode` {#outgoingmessagewritableobjectmode}

**Ajouté dans : v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Toujours `false`.

### `outgoingMessage.write(chunk[, encoding][, callback])` {#outgoingmessagewritechunk-encoding-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Le paramètre `chunk` peut désormais être un `Uint8Array`. |
| v0.11.6 | L’argument `callback` a été ajouté. |
| v0.1.29 | Ajouté dans : v0.1.29 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut:** `utf8`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envoie un bloc du corps. Cette méthode peut être appelée plusieurs fois.

L’argument `encoding` n’est pertinent que lorsque `chunk` est une chaîne de caractères. La valeur par défaut est `'utf8'`.

L’argument `callback` est facultatif et sera appelé lorsque ce bloc de données sera vidé.

Renvoie `true` si toutes les données ont été vidées avec succès dans le tampon du noyau. Renvoie `false` si tout ou partie des données ont été mises en file d’attente dans la mémoire utilisateur. L’événement `'drain'` sera émis lorsque le tampon sera à nouveau libre.

## `http.METHODS` {#httpmethods}

**Ajouté dans : v0.11.8**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Une liste des méthodes HTTP qui sont prises en charge par l’analyseur.

## `http.STATUS_CODES` {#httpstatus_codes}

**Ajouté dans : v0.1.22**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Une collection de tous les codes d’état de réponse HTTP standard, et la courte description de chacun. Par exemple, `http.STATUS_CODES[404] === 'Not Found'`.


## `http.createServer([options][, requestListener])` {#httpcreateserveroptions-requestlistener}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0, v18.17.0 | L'option `highWaterMark` est désormais prise en charge. |
| v18.0.0 | Les options `requestTimeout`, `headersTimeout`, `keepAliveTimeout` et `connectionsCheckingInterval` sont désormais prises en charge. |
| v18.0.0 | L'option `noDelay` est désormais définie par défaut sur `true`. |
| v17.7.0, v16.15.0 | Les options `noDelay`, `keepAlive` et `keepAliveInitialDelay` sont désormais prises en charge. |
| v13.3.0 | L'option `maxHeaderSize` est désormais prise en charge. |
| v13.8.0, v12.15.0, v10.19.0 | L'option `insecureHTTPParser` est désormais prise en charge. |
| v9.6.0, v8.12.0 | L'argument `options` est désormais pris en charge. |
| v0.1.13 | Ajouté dans : v0.1.13 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `connectionsCheckingInterval`: Définit la valeur d'intervalle en millisecondes pour vérifier le délai d'expiration des requêtes et des en-têtes dans les requêtes incomplètes. **Par défaut :** `30000`.
    - `headersTimeout`: Définit la valeur du délai d'expiration en millisecondes pour la réception des en-têtes HTTP complets du client. Voir [`server.headersTimeout`](/fr/nodejs/api/http#serverheaderstimeout) pour plus d'informations. **Par défaut :** `60000`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Remplace éventuellement les `readableHighWaterMark` et `writableHighWaterMark` de tous les `socket`s. Cela affecte la propriété `highWaterMark` de `IncomingMessage` et de `ServerResponse`. **Par défaut :** Voir [`stream.getDefaultHighWaterMark()`](/fr/nodejs/api/stream#streamgetdefaulthighwatermarkobjectmode).
    - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, il utilisera un analyseur HTTP avec des indicateurs de tolérance activés. L'utilisation de l'analyseur non sécurisé doit être évitée. Voir [`--insecure-http-parser`](/fr/nodejs/api/cli#--insecure-http-parser) pour plus d'informations. **Par défaut :** `false`.
    - `IncomingMessage` [\<http.IncomingMessage\>](/fr/nodejs/api/http#class-httpincomingmessage) Spécifie la classe `IncomingMessage` à utiliser. Utile pour étendre l'objet `IncomingMessage` original. **Par défaut :** `IncomingMessage`.
    - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, cette option permet de joindre les valeurs de ligne de champ de plusieurs en-têtes dans une requête avec une virgule (`, `) au lieu de supprimer les doublons. Pour plus d'informations, reportez-vous à [`message.headers`](/fr/nodejs/api/http#messageheaders). **Par défaut :** `false`.
    - `keepAlive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, elle active la fonctionnalité keep-alive sur le socket immédiatement après la réception d'une nouvelle connexion entrante, de la même manière que ce qui est fait dans [`socket.setKeepAlive([enable][, initialDelay])`][`socket.setKeepAlive(enable, initialDelay)`]. **Par défaut :** `false`.
    - `keepAliveInitialDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Si la valeur est définie sur un nombre positif, elle définit le délai initial avant l'envoi de la première sonde keepalive sur un socket inactif. **Par défaut :** `0`.
    - `keepAliveTimeout`: Nombre de millisecondes d'inactivité qu'un serveur doit attendre pour recevoir des données entrantes supplémentaires, après avoir fini d'écrire la dernière réponse, avant qu'un socket ne soit détruit. Voir [`server.keepAliveTimeout`](/fr/nodejs/api/http#serverkeepalivetimeout) pour plus d'informations. **Par défaut :** `5000`.
    - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Remplace éventuellement la valeur de [`--max-http-header-size`](/fr/nodejs/api/cli#--max-http-header-sizesize) pour les requêtes reçues par ce serveur, c'est-à-dire la longueur maximale des en-têtes de requête en octets. **Par défaut :** 16384 (16 Kio).
    - `noDelay` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, elle désactive l'utilisation de l'algorithme de Nagle immédiatement après la réception d'une nouvelle connexion entrante. **Par défaut :** `true`.
    - `requestTimeout`: Définit la valeur du délai d'expiration en millisecondes pour la réception de l'intégralité de la requête du client. Voir [`server.requestTimeout`](/fr/nodejs/api/http#serverrequesttimeout) pour plus d'informations. **Par défaut :** `300000`.
    - `requireHostHeader` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, elle force le serveur à répondre avec un code d'état 400 (Bad Request) à tout message de requête HTTP/1.1 dépourvu d'un en-tête Host (comme l'exige la spécification). **Par défaut :** `true`.
    - `ServerResponse` [\<http.ServerResponse\>](/fr/nodejs/api/http#class-httpserverresponse) Spécifie la classe `ServerResponse` à utiliser. Utile pour étendre l'objet `ServerResponse` original. **Par défaut :** `ServerResponse`.
    - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Une liste d'en-têtes de réponse qui ne doivent être envoyés qu'une seule fois. Si la valeur de l'en-tête est un tableau, les éléments seront joints à l'aide de `; `.
    - `rejectNonStandardBodyWrites` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si la valeur est définie sur `true`, une erreur est levée lors de l'écriture dans une réponse HTTP qui n'a pas de corps. **Par défaut :** `false`.
  
 
-  `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
-  Retourne : [\<http.Server\>](/fr/nodejs/api/http#class-httpserver)

Retourne une nouvelle instance de [`http.Server`](/fr/nodejs/api/http#class-httpserver).

Le `requestListener` est une fonction qui est automatiquement ajoutée à l'événement [`'request'`](/fr/nodejs/api/http#event-request).

::: code-group
```js [ESM]
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::

::: code-group
```js [ESM]
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```js [CJS]
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```
:::


## `http.get(options[, callback])` {#httpgetoptions-callback}

## `http.get(url[, options][, callback])` {#httpgeturl-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.9.0 | Le paramètre `url` peut désormais être transmis avec un objet `options` séparé. |
| v7.5.0 | Le paramètre `options` peut être un objet WHATWG `URL`. |
| v0.3.6 | Ajoutée dans : v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Accepte les mêmes `options` que [`http.request()`](/fr/nodejs/api/http#httprequestoptions-callback), avec la méthode définie par défaut sur GET.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)

Étant donné que la plupart des requêtes sont des requêtes GET sans corps, Node.js fournit cette méthode pratique. La seule différence entre cette méthode et [`http.request()`](/fr/nodejs/api/http#httprequestoptions-callback) est qu'elle définit la méthode sur GET par défaut et appelle `req.end()` automatiquement. Le callback doit veiller à consommer les données de réponse pour les raisons indiquées dans la section [`http.ClientRequest`](/fr/nodejs/api/http#class-httpclientrequest).

Le `callback` est invoqué avec un seul argument qui est une instance de [`http.IncomingMessage`](/fr/nodejs/api/http#class-httpincomingmessage).

Exemple de récupération JSON :

```js [ESM]
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Tout code d'état 2xx signale une réponse réussie mais
  // ici, nous ne vérifions que le 200.
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consommer les données de réponse pour libérer de la mémoire
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// Créer un serveur local pour recevoir des données de
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.globalAgent` {#httpglobalagent}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'agent utilise désormais HTTP Keep-Alive et un délai d'attente de 5 secondes par défaut. |
| v0.5.9 | Ajouté dans : v0.5.9 |
:::

- [\<http.Agent\>](/fr/nodejs/api/http#class-httpagent)

Instance globale de `Agent` qui est utilisée par défaut pour toutes les requêtes client HTTP. Diffère d'une configuration `Agent` par défaut en ayant `keepAlive` activé et un `timeout` de 5 secondes.

## `http.maxHeaderSize` {#httpmaxheadersize}

**Ajouté dans : v11.6.0, v10.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Propriété en lecture seule spécifiant la taille maximale autorisée des en-têtes HTTP en octets. La valeur par défaut est de 16 Kio. Configurable à l'aide de l'option CLI [`--max-http-header-size`](/fr/nodejs/api/cli#--max-http-header-sizesize).

Ceci peut être remplacé pour les serveurs et les requêtes client en passant l'option `maxHeaderSize`.

## `http.request(options[, callback])` {#httprequestoptions-callback}

## `http.request(url[, options][, callback])` {#httprequesturl-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.7.0, v14.18.0 | Lors de l'utilisation d'un objet `URL`, le nom d'utilisateur et le mot de passe analysés seront désormais correctement décodés en URI. |
| v15.3.0, v14.17.0 | Il est possible d'annuler une requête avec un AbortSignal. |
| v13.3.0 | L'option `maxHeaderSize` est désormais prise en charge. |
| v13.8.0, v12.15.0, v10.19.0 | L'option `insecureHTTPParser` est désormais prise en charge. |
| v10.9.0 | Le paramètre `url` peut maintenant être transmis avec un objet `options` distinct. |
| v7.5.0 | Le paramètre `options` peut être un objet WHATWG `URL`. |
| v0.3.6 | Ajouté dans : v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `agent` [\<http.Agent\>](/fr/nodejs/api/http#class-httpagent) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Contrôle le comportement de [`Agent`](/fr/nodejs/api/http#class-httpagent). Valeurs possibles :
    - `undefined` (par défaut) : utilise [`http.globalAgent`](/fr/nodejs/api/http#httpglobalagent) pour cet hôte et ce port.
    - Objet `Agent` : utilise explicitement l'`Agent` transmis.
    - `false` : entraîne l'utilisation d'un nouvel `Agent` avec les valeurs par défaut.

  - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Authentification de base (`'user:password'`) pour calculer un en-tête Authorization.
  - `createConnection` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction qui produit un socket/flux à utiliser pour la requête lorsque l'option `agent` n'est pas utilisée. Ceci peut être utilisé pour éviter de créer une classe `Agent` personnalisée juste pour remplacer la fonction `createConnection` par défaut. Voir [`agent.createConnection()`](/fr/nodejs/api/http#agentcreateconnectionoptions-callback) pour plus de détails. Tout flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) est une valeur de retour valide.
  - `defaultPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port par défaut pour le protocole. **Par défaut :** `agent.defaultPort` si un `Agent` est utilisé, sinon `undefined`.
  - `family` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Famille d'adresses IP à utiliser lors de la résolution de `host` ou `hostname`. Les valeurs valides sont `4` ou `6`. Lorsqu'elle n'est pas spécifiée, les adresses IP v4 et v6 sont utilisées.
  - `headers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet contenant les en-têtes de requête.
  - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`dns.lookup()` astuces](/fr/nodejs/api/dns#supported-getaddrinfo-flags) facultatives.
  - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nom de domaine ou une adresse IP du serveur auquel envoyer la requête. **Par défaut :** `'localhost'`.
  - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Alias pour `host`. Pour prendre en charge [`url.parse()`](/fr/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), `hostname` sera utilisé si `host` et `hostname` sont spécifiés.
  - `insecureHTTPParser` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) S'il est défini sur `true`, il utilisera un analyseur HTTP avec des indicateurs de tolérance activés. L'utilisation de l'analyseur non sécurisé doit être évitée. Voir [`--insecure-http-parser`](/fr/nodejs/api/cli#--insecure-http-parser) pour plus d'informations. **Par défaut :** `false`
  - `joinDuplicateHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Il joint les valeurs de ligne de champ de plusieurs en-têtes dans une requête avec `, ` au lieu de supprimer les doublons. Voir [`message.headers`](/fr/nodejs/api/http#messageheaders) pour plus d'informations. **Par défaut :** `false`.
  - `localAddress` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Interface locale à lier pour les connexions réseau.
  - `localPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port local depuis lequel se connecter.
  - `lookup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Fonction de recherche personnalisée. **Par défaut :** [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback).
  - `maxHeaderSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Remplace éventuellement la valeur de [`--max-http-header-size`](/fr/nodejs/api/cli#--max-http-header-sizesize) (la longueur maximale des en-têtes de réponse en octets) pour les réponses reçues du serveur. **Par défaut :** 16384 (16 Kio).
  - `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une chaîne spécifiant la méthode de requête HTTP. **Par défaut :** `'GET'`.
  - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chemin de la requête. Doit inclure la chaîne de requête, le cas échéant. Ex. `'/index.html?page=12'`. Une exception est levée lorsque le chemin de la requête contient des caractères non autorisés. Actuellement, seuls les espaces sont rejetés, mais cela peut changer à l'avenir. **Par défaut :** `'/'`.
  - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port du serveur distant. **Par défaut :** `defaultPort` s'il est défini, sinon `80`.
  - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Protocole à utiliser. **Par défaut :** `'http:'`.
  - `setDefaultHeaders` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) : Spécifie s'il faut ou non ajouter automatiquement des en-têtes par défaut tels que `Connection`, `Content-Length`, `Transfer-Encoding` et `Host`. Si elle est définie sur `false`, tous les en-têtes nécessaires doivent être ajoutés manuellement. La valeur par défaut est `true`.
  - `setHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) : Spécifie s'il faut ou non ajouter automatiquement l'en-tête `Host`. Si elle est fournie, cette option remplace `setDefaultHeaders`. La valeur par défaut est `true`.
  - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) : un AbortSignal qui peut être utilisé pour annuler une requête en cours.
  - `socketPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Socket de domaine Unix. Ne peut pas être utilisé si l'un de `host` ou `port` est spécifié, car ceux-ci spécifient un socket TCP.
  - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) : un nombre spécifiant le délai d'attente du socket en millisecondes. Cela définira le délai d'attente avant que le socket ne soit connecté.
  - `uniqueHeaders` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Une liste des en-têtes de requête qui ne doivent être envoyés qu'une seule fois. Si la valeur de l'en-tête est un tableau, les éléments seront joints en utilisant `; `.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)

Les `options` dans [`socket.connect()`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) sont également pris en charge.

Node.js conserve plusieurs connexions par serveur pour effectuer des requêtes HTTP. Cette fonction permet d'émettre des requêtes de manière transparente.

`url` peut être une chaîne ou un objet [`URL`](/fr/nodejs/api/url#the-whatwg-url-api). Si `url` est une chaîne, elle est automatiquement analysée avec [`new URL()`](/fr/nodejs/api/url#new-urlinput-base). S'il s'agit d'un objet [`URL`](/fr/nodejs/api/url#the-whatwg-url-api), il sera automatiquement converti en un objet `options` ordinaire.

Si `url` et `options` sont spécifiés, les objets sont fusionnés, les propriétés `options` étant prioritaires.

Le paramètre `callback` facultatif sera ajouté en tant qu'écouteur unique pour l'événement [`'response'`](/fr/nodejs/api/http#event-response).

`http.request()` retourne une instance de la classe [`http.ClientRequest`](/fr/nodejs/api/http#class-httpclientrequest). L'instance `ClientRequest` est un flux accessible en écriture. Si vous devez télécharger un fichier avec une requête POST, écrivez dans l'objet `ClientRequest`.

::: code-group
```js [ESM]
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```js [CJS]
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
:::

Dans l'exemple, `req.end()` a été appelé. Avec `http.request()`, vous devez toujours appeler `req.end()` pour signifier la fin de la requête, même s'il n'y a pas de données écrites dans le corps de la requête.

Si une erreur est rencontrée pendant la requête (que ce soit avec la résolution DNS, les erreurs au niveau TCP ou les erreurs d'analyse HTTP réelles), un événement `'error'` est émis sur l'objet requête retourné. Comme avec tous les événements `'error'`, si aucun écouteur n'est enregistré, l'erreur sera levée.

Il y a quelques en-têtes spéciaux qui doivent être notés.

- L'envoi d'un 'Connection : keep-alive' avisera Node.js que la connexion au serveur doit être maintenue jusqu'à la prochaine requête.
- L'envoi d'un en-tête 'Content-Length' désactivera l'encodage par blocs par défaut.
- L'envoi d'un en-tête 'Expect' enverra immédiatement les en-têtes de requête. Habituellement, lors de l'envoi de 'Expect : 100-continue', un délai d'attente et un écouteur pour l'événement `'continue'` doivent être définis. Voir RFC 2616 Section 8.2.3 pour plus d'informations.
- L'envoi d'un en-tête Authorization remplacera l'utilisation de l'option `auth` pour calculer l'authentification de base.

Exemple utilisant une [`URL`](/fr/nodejs/api/url#the-whatwg-url-api) comme `options` :

```js [ESM]
const options = new URL('http://abc:');

const req = http.request(options, (res) => {
  // ...
});
```

Dans une requête réussie, les événements suivants seront émis dans l'ordre suivant :

- `'socket'`
- `'response'`
    - `'data'` un nombre quelconque de fois, sur l'objet `res` (`'data'` ne sera pas émis du tout si le corps de la réponse est vide, par exemple, dans la plupart des redirections)
    - `'end'` sur l'objet `res`

- `'close'`

En cas d'erreur de connexion, les événements suivants seront émis :

- `'socket'`
- `'error'`
- `'close'`

En cas de fermeture prématurée de la connexion avant la réception de la réponse, les événements suivants seront émis dans l'ordre suivant :

- `'socket'`
- `'error'` avec une erreur avec le message `'Error: socket hang up'` et le code `'ECONNRESET'`
- `'close'`

En cas de fermeture prématurée de la connexion après la réception de la réponse, les événements suivants seront émis dans l'ordre suivant :

- `'socket'`
- `'response'`
    - `'data'` un nombre quelconque de fois, sur l'objet `res`

- (connexion fermée ici)
- `'aborted'` sur l'objet `res`
- `'close'`
- `'error'` sur l'objet `res` avec une erreur avec le message `'Error: aborted'` et le code `'ECONNRESET'`
- `'close'` sur l'objet `res`

Si `req.destroy()` est appelé avant qu'un socket ne soit attribué, les événements suivants seront émis dans l'ordre suivant :

- (`req.destroy()` appelé ici)
- `'error'` avec une erreur avec le message `'Error: socket hang up'` et le code `'ECONNRESET'`, ou l'erreur avec laquelle `req.destroy()` a été appelé
- `'close'`

Si `req.destroy()` est appelé avant que la connexion ne réussisse, les événements suivants seront émis dans l'ordre suivant :

- `'socket'`
- (`req.destroy()` appelé ici)
- `'error'` avec une erreur avec le message `'Error: socket hang up'` et le code `'ECONNRESET'`, ou l'erreur avec laquelle `req.destroy()` a été appelé
- `'close'`

Si `req.destroy()` est appelé après la réception de la réponse, les événements suivants seront émis dans l'ordre suivant :

- `'socket'`
- `'response'`
    - `'data'` un nombre quelconque de fois, sur l'objet `res`

- (`req.destroy()` appelé ici)
- `'aborted'` sur l'objet `res`
- `'close'`
- `'error'` sur l'objet `res` avec une erreur avec le message `'Error: aborted'` et le code `'ECONNRESET'`, ou l'erreur avec laquelle `req.destroy()` a été appelé
- `'close'` sur l'objet `res`

Si `req.abort()` est appelé avant qu'un socket ne soit attribué, les événements suivants seront émis dans l'ordre suivant :

- (`req.abort()` appelé ici)
- `'abort'`
- `'close'`

Si `req.abort()` est appelé avant que la connexion ne réussisse, les événements suivants seront émis dans l'ordre suivant :

- `'socket'`
- (`req.abort()` appelé ici)
- `'abort'`
- `'error'` avec une erreur avec le message `'Error: socket hang up'` et le code `'ECONNRESET'`
- `'close'`

Si `req.abort()` est appelé après la réception de la réponse, les événements suivants seront émis dans l'ordre suivant :

- `'socket'`
- `'response'`
    - `'data'` un nombre quelconque de fois, sur l'objet `res`

- (`req.abort()` appelé ici)
- `'abort'`
- `'aborted'` sur l'objet `res`
- `'error'` sur l'objet `res` avec une erreur avec le message `'Error: aborted'` et le code `'ECONNRESET'`.
- `'close'`
- `'close'` sur l'objet `res`

Définir l'option `timeout` ou utiliser la fonction `setTimeout()` n'interrompra pas la requête et ne fera rien d'autre que d'ajouter un événement `'timeout'`.

Passer un `AbortSignal` et appeler ensuite `abort()` sur le `AbortController` correspondant se comportera de la même manière que d'appeler `.destroy()` sur la requête. Plus précisément, l'événement `'error'` sera émis avec une erreur avec le message `'AbortError: The operation was aborted'`, le code `'ABORT_ERR'` et la `cause`, si elle a été fournie.


## `http.validateHeaderName(name[, label])` {#httpvalidateheadernamename-label}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.5.0, v18.14.0 | Le paramètre `label` est ajouté. |
| v14.3.0 | Ajoutée dans : v14.3.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Libellé pour le message d'erreur. **Par défaut :** `'Nom d'en-tête'`.

Effectue les validations de bas niveau sur le `name` fourni qui sont effectuées lorsque `res.setHeader(name, value)` est appelé.

Le passage d'une valeur illégale comme `name` entraînera la levée d'une [`TypeError`](/fr/nodejs/api/errors#class-typeerror), identifiée par `code: 'ERR_INVALID_HTTP_TOKEN'`.

Il n'est pas nécessaire d'utiliser cette méthode avant de passer des en-têtes à une requête ou une réponse HTTP. Le module HTTP validera automatiquement ces en-têtes.

Exemple :

::: code-group
```js [ESM]
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

```js [CJS]
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```
:::

## `http.validateHeaderValue(name, value)` {#httpvalidateheadervaluename-value}

**Ajoutée dans : v14.3.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Effectue les validations de bas niveau sur la `value` fournie qui sont effectuées lorsque `res.setHeader(name, value)` est appelé.

Le passage d'une valeur illégale comme `value` entraînera la levée d'une [`TypeError`](/fr/nodejs/api/errors#class-typeerror).

- L'erreur de valeur non définie est identifiée par `code : 'ERR_HTTP_INVALID_HEADER_VALUE'`.
- L'erreur de caractère de valeur non valide est identifiée par `code : 'ERR_INVALID_CHAR'`.

Il n'est pas nécessaire d'utiliser cette méthode avant de passer des en-têtes à une requête ou une réponse HTTP. Le module HTTP validera automatiquement ces en-têtes.

Exemples :

::: code-group
```js [ESM]
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

```js [CJS]
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```
:::


## `http.setMaxIdleHTTPParsers(max)` {#httpsetmaxidlehttpparsersmax}

**Ajouté dans : v18.8.0, v16.18.0**

- `max` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `1000`.

Définit le nombre maximum d’analyseurs HTTP inactifs.

## `WebSocket` {#websocket}

**Ajouté dans : v22.5.0**

Une implémentation compatible navigateur de [`WebSocket`](/fr/nodejs/api/http#websocket).

