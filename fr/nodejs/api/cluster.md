---
title: Documentation Node.js - Cluster
description: Découvrez comment utiliser le module cluster de Node.js pour créer des processus enfants qui partagent les ports du serveur, améliorant ainsi les performances et l'évolutivité de l'application.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Cluster | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment utiliser le module cluster de Node.js pour créer des processus enfants qui partagent les ports du serveur, améliorant ainsi les performances et l'évolutivité de l'application.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Cluster | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment utiliser le module cluster de Node.js pour créer des processus enfants qui partagent les ports du serveur, améliorant ainsi les performances et l'évolutivité de l'application.
---


# Cluster {#cluster}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

Les clusters de processus Node.js peuvent être utilisés pour exécuter plusieurs instances de Node.js qui peuvent répartir les charges de travail entre leurs threads d'application. Lorsque l'isolation des processus n'est pas nécessaire, utilisez plutôt le module [`worker_threads`](/fr/nodejs/api/worker_threads), qui permet d'exécuter plusieurs threads d'application dans une seule instance Node.js.

Le module cluster permet de créer facilement des processus enfants qui partagent tous les ports du serveur.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}
```
:::

L'exécution de Node.js partagera désormais le port 8000 entre les workers :

```bash [BASH]
$ node server.js
Primary 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
```
Sous Windows, il n'est pas encore possible de configurer un serveur de pipe nommé dans un worker.


## Comment ça marche {#how-it-works}

Les processus de travail sont générés à l'aide de la méthode [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options), afin qu'ils puissent communiquer avec le processus parent via IPC et transmettre les descripteurs de serveur dans les deux sens.

Le module `cluster` prend en charge deux méthodes de distribution des connexions entrantes.

La première (et celle par défaut sur toutes les plateformes sauf Windows) est l'approche round-robin, où le processus principal écoute sur un port, accepte les nouvelles connexions et les distribue aux travailleurs de manière round-robin, avec une certaine intelligence intégrée pour éviter de surcharger un processus de travail.

La deuxième approche consiste à ce que le processus principal crée le socket d'écoute et l'envoie aux travailleurs intéressés. Les travailleurs acceptent ensuite directement les connexions entrantes.

La deuxième approche devrait, en théorie, donner les meilleures performances. En pratique, cependant, la distribution a tendance à être très déséquilibrée en raison des caprices du planificateur du système d'exploitation. Des charges ont été observées où plus de 70 % de toutes les connexions se sont retrouvées dans seulement deux processus, sur un total de huit.

Étant donné que `server.listen()` confie la majeure partie du travail au processus principal, il existe trois cas où le comportement entre un processus Node.js normal et un processus de travail du cluster diffère :

Node.js ne fournit pas de logique de routage. Il est donc important de concevoir une application de manière à ce qu'elle ne repose pas trop sur des objets de données en mémoire pour des éléments tels que les sessions et la connexion.

Étant donné que les travailleurs sont tous des processus distincts, ils peuvent être tués ou relancés en fonction des besoins d'un programme, sans affecter les autres travailleurs. Tant qu'il reste des travailleurs en vie, le serveur continuera d'accepter les connexions. Si aucun travailleur n'est en vie, les connexions existantes seront abandonnées et les nouvelles connexions seront refusées. Node.js ne gère pas automatiquement le nombre de travailleurs, cependant. Il est de la responsabilité de l'application de gérer le pool de travailleurs en fonction de ses propres besoins.

Bien que le module `node:cluster` soit principalement utilisé pour la mise en réseau, il peut également être utilisé pour d'autres cas d'utilisation nécessitant des processus de travail.


## Classe : `Worker` {#class-worker}

**Ajoutée dans : v0.7.0**

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Un objet `Worker` contient toutes les informations publiques et les méthodes relatives à un worker. Dans le processus principal, il peut être obtenu à l'aide de `cluster.workers`. Dans un worker, il peut être obtenu à l'aide de `cluster.worker`.

### Événement : `'disconnect'` {#event-disconnect}

**Ajouté dans : v0.7.7**

Similaire à l'événement `cluster.on('disconnect')`, mais spécifique à ce worker.

```js [ESM]
cluster.fork().on('disconnect', () => {
  // Worker déconnecté
});
```
### Événement : `'error'` {#event-error}

**Ajouté dans : v0.7.3**

Cet événement est le même que celui fourni par [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options).

Dans un worker, `process.on('error')` peut également être utilisé.

### Événement : `'exit'` {#event-exit}

**Ajouté dans : v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le code de sortie, s'il s'est terminé normalement.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du signal (par exemple, `'SIGHUP'`) qui a causé l'arrêt du processus.

Similaire à l'événement `cluster.on('exit')`, mais spécifique à ce worker.



::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker was killed by signal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker exited with error code: ${code}`);
    } else {
      console.log('worker success!');
    }
  });
}
```
:::

### Événement : `'listening'` {#event-listening}

**Ajouté dans : v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Similaire à l'événement `cluster.on('listening')`, mais spécifique à ce worker.



::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // Le worker est à l'écoute
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // Le worker est à l'écoute
});
```
:::

Il n'est pas émis dans le worker.


### Événement : `'message'` {#event-message}

**Ajouté dans : v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Similaire à l'événement `'message'` de `cluster`, mais spécifique à ce worker.

Dans un worker, `process.on('message')` peut également être utilisé.

Voir [`process` event : `'message'`](/fr/nodejs/api/process#event-message).

Voici un exemple d'utilisation du système de messages. Il conserve un décompte dans le processus primaire du nombre de requêtes HTTP reçues par les workers :

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {

  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notify primary about the request
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {

  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notify primary about the request
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```
:::


### Événement: `'online'` {#event-online}

**Ajouté dans: v0.7.0**

Similaire à l'événement `cluster.on('online')`, mais spécifique à ce worker.

```js [ESM]
cluster.fork().on('online', () => {
  // Le worker est en ligne
});
```
Il n'est pas émis dans le worker.

### `worker.disconnect()` {#workerdisconnect}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v7.3.0 | Cette méthode renvoie désormais une référence à `worker`. |
| v0.7.7 | Ajouté dans: v0.7.7 |
:::

- Retourne: [\<cluster.Worker\>](/fr/nodejs/api/cluster#class-worker) Une référence à `worker`.

Dans un worker, cette fonction fermera tous les serveurs, attendra l'événement `'close'` sur ces serveurs, puis déconnectera le canal IPC.

Dans le processus principal, un message interne est envoyé au worker, ce qui l'amène à appeler `.disconnect()` sur lui-même.

Provoque la définition de `.exitedAfterDisconnect`.

Une fois qu'un serveur est fermé, il n'acceptera plus de nouvelles connexions, mais les connexions peuvent être acceptées par tout autre worker en écoute. Les connexions existantes seront autorisées à se fermer comme d'habitude. Lorsqu'il n'y a plus de connexions, voir [`server.close()`](/fr/nodejs/api/net#event-close), le canal IPC vers le worker se fermera, ce qui lui permettra de mourir gracieusement.

Ce qui précède s'applique *uniquement* aux connexions serveur, les connexions client ne sont pas automatiquement fermées par les workers, et la déconnexion n'attend pas qu'elles se ferment avant de quitter.

Dans un worker, `process.disconnect` existe, mais ce n'est pas cette fonction; c'est [`disconnect()`](/fr/nodejs/api/child_process#subprocessdisconnect).

Étant donné que les connexions serveur de longue durée peuvent empêcher les workers de se déconnecter, il peut être utile d'envoyer un message, afin que des actions spécifiques à l'application puissent être prises pour les fermer. Il peut également être utile d'implémenter un délai d'attente, en tuant un worker si l'événement `'disconnect'` n'a pas été émis après un certain temps.

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  let timeout;

  worker.on('listening', (address) => {
    worker.send('shutdown');
    worker.disconnect();
    timeout = setTimeout(() => {
      worker.kill();
    }, 2000);
  });

  worker.on('disconnect', () => {
    clearTimeout(timeout);
  });

} else if (cluster.isWorker) {
  const net = require('node:net');
  const server = net.createServer((socket) => {
    // Les connexions ne se terminent jamais
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Initier la fermeture gracieuse de toute connexion au serveur
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**Ajouté dans : v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette propriété est `true` si le worker s'est arrêté en raison de `.disconnect()`. Si le worker s'est arrêté d'une autre manière, elle est `false`. Si le worker ne s'est pas arrêté, elle est `undefined`.

Le booléen [`worker.exitedAfterDisconnect`](/fr/nodejs/api/cluster#workerexitedafterdisconnect) permet de distinguer entre une sortie volontaire et accidentelle, le processus principal peut choisir de ne pas relancer un worker en fonction de cette valeur.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('Oh, c’était juste volontaire – pas besoin de s’inquiéter');
  }
});

// kill worker
worker.kill();
```
### `worker.id` {#workerid}

**Ajouté dans : v0.8.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Chaque nouveau worker reçoit son propre identifiant unique, cet identifiant est stocké dans `id`.

Tant qu'un worker est actif, il s'agit de la clé qui l'indexe dans `cluster.workers`.

### `worker.isConnected()` {#workerisconnected}

**Ajouté dans : v0.11.14**

Cette fonction renvoie `true` si le worker est connecté à son processus principal via son canal IPC, `false` sinon. Un worker est connecté à son processus principal après avoir été créé. Il est déconnecté après l'émission de l'événement `'disconnect'`.

### `worker.isDead()` {#workerisdead}

**Ajouté dans : v0.11.14**

Cette fonction renvoie `true` si le processus du worker s'est terminé (soit en raison d'une sortie, soit en raison d'un signal). Sinon, elle renvoie `false`.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // Workers can share any TCP connection. In this case, it is an HTTP server.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log('worker is dead:', worker.isDead());
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  // Workers can share any TCP connection. In this case, it is an HTTP server.
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Current process\n ${process.pid}`);
    process.kill(process.pid);
  }).listen(8000);
}
```
:::


### `worker.kill([signal])` {#workerkillsignal}

**Ajouté dans : v0.9.12**

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom du signal de terminaison à envoyer au processus worker. **Par défaut :** `'SIGTERM'`

Cette fonction va tuer le worker. Dans le worker primaire, elle le fait en déconnectant le `worker.process`, et une fois déconnecté, en tuant avec `signal`. Dans le worker, elle le fait en tuant le processus avec `signal`.

La fonction `kill()` tue le processus worker sans attendre une déconnexion correcte, elle a le même comportement que `worker.process.kill()`.

Cette méthode est nommée `worker.destroy()` par souci de compatibilité ascendante.

Dans un worker, `process.kill()` existe, mais ce n'est pas cette fonction ; c'est [`kill()`](/fr/nodejs/api/process#processkillpid-signal).

### `worker.process` {#workerprocess}

**Ajouté dans : v0.7.0**

- [\<ChildProcess\>](/fr/nodejs/api/child_process#class-childprocess)

Tous les workers sont créés à l'aide de [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options), l'objet retourné par cette fonction est stocké en tant que `.process`. Dans un worker, le `process` global est stocké.

Voir : [Module Child Process](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options).

Les workers appellent `process.exit(0)` si l'événement `'disconnect'` se produit sur `process` et que `.exitedAfterDisconnect` n'est pas `true`. Cela protège contre les déconnexions accidentelles.

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v4.0.0 | Le paramètre `callback` est désormais pris en charge. |
| v0.7.0 | Ajouté dans : v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/fr/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'argument `options`, s'il est présent, est un objet utilisé pour paramétrer l'envoi de certains types de handles. `options` prend en charge les propriétés suivantes :
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Une valeur qui peut être utilisée lors du passage d'instances de `net.Socket`. Lorsque `true`, le socket est maintenu ouvert dans le processus d'envoi. **Par défaut :** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envoie un message à un worker ou primaire, éventuellement avec un handle.

Dans le primaire, cela envoie un message à un worker spécifique. C'est identique à [`ChildProcess.send()`](/fr/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

Dans un worker, cela envoie un message au primaire. C'est identique à `process.send()`.

Cet exemple renverra tous les messages du primaire :

```js [ESM]
if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.send('hi there');

} else if (cluster.isWorker) {
  process.on('message', (msg) => {
    process.send(msg);
  });
}
```

## Événement : `'disconnect'` {#event-disconnect_1}

**Ajouté dans la version : v0.7.9**

- `worker` [\<cluster.Worker\>](/fr/nodejs/api/cluster#class-worker)

Émis après la déconnexion du canal IPC du worker. Cela peut se produire lorsqu’un worker se termine correctement, est tué ou est déconnecté manuellement (par exemple avec `worker.disconnect()`).

Il peut y avoir un délai entre les événements `'disconnect'` et `'exit'`. Ces événements peuvent être utilisés pour détecter si le processus est bloqué dans un nettoyage ou s’il existe des connexions de longue durée.

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`Le worker #${worker.id} s’est déconnecté`);
});
```
## Événement : `'exit'` {#event-exit_1}

**Ajouté dans la version : v0.7.9**

- `worker` [\<cluster.Worker\>](/fr/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le code de sortie, s’il s’est terminé normalement.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom du signal (par exemple, `'SIGHUP'`) qui a provoqué l’arrêt du processus.

Lorsque l’un des workers meurt, le module de cluster émet l’événement `'exit'`.

Cela peut être utilisé pour redémarrer le worker en appelant à nouveau [`.fork()`](/fr/nodejs/api/cluster#clusterforkenv).

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d est mort (%s). redémarrage...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
Voir [`child_process` event: `'exit'`](/fr/nodejs/api/child_process#event-exit).

## Événement : `'fork'` {#event-fork}

**Ajouté dans la version : v0.7.0**

- `worker` [\<cluster.Worker\>](/fr/nodejs/api/cluster#class-worker)

Lorsqu’un nouveau worker est forké, le module de cluster émet un événement `'fork'`. Cela peut être utilisé pour enregistrer l’activité du worker et créer un délai d’expiration personnalisé.

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('Il doit y avoir un problème avec la connexion ...');
}

cluster.on('fork', (worker) => {
  timeouts[worker.id] = setTimeout(errorMsg, 2000);
});
cluster.on('listening', (worker, address) => {
  clearTimeout(timeouts[worker.id]);
});
cluster.on('exit', (worker, code, signal) => {
  clearTimeout(timeouts[worker.id]);
  errorMsg();
});
```

## Événement : `'listening'` {#event-listening_1}

**Ajouté dans : v0.7.0**

- `worker` [\<cluster.Worker\>](/fr/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Après avoir appelé `listen()` depuis un worker, lorsque l'événement `'listening'` est émis sur le serveur, un événement `'listening'` sera également émis sur `cluster` dans le processus principal.

Le gestionnaire d'événement est exécuté avec deux arguments, `worker` contient l'objet worker et l'objet `address` contient les propriétés de connexion suivantes : `address`, `port` et `addressType`. Ceci est très utile si le worker écoute sur plus d'une adresse.

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `Un worker est maintenant connecté à ${address.address}:${address.port}`);
});
```
`addressType` est l'un des suivants :

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (socket de domaine Unix)
- `'udp4'` ou `'udp6'` (UDPv4 ou UDPv6)

## Événement : `'message'` {#event-message_1}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v6.0.0 | Le paramètre `worker` est maintenant passé ; voir ci-dessous pour plus de détails. |
| v2.5.0 | Ajouté dans : v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/fr/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Émis lorsque le processus principal du cluster reçoit un message de n'importe quel worker.

Voir [`child_process` event: `'message'`](/fr/nodejs/api/child_process#event-message).

## Événement : `'online'` {#event-online_1}

**Ajouté dans : v0.7.0**

- `worker` [\<cluster.Worker\>](/fr/nodejs/api/cluster#class-worker)

Après avoir créé un nouveau worker, le worker doit répondre avec un message en ligne. Lorsque le processus principal reçoit un message en ligne, il émet cet événement. La différence entre `'fork'` et `'online'` est que fork est émis lorsque le processus principal crée un worker, et `'online'` est émis lorsque le worker est en cours d'exécution.

```js [ESM]
cluster.on('online', (worker) => {
  console.log('Yay, the worker responded after it was forked');
});
```

## Événement : `'setup'` {#event-setup}

**Ajouté dans : v0.7.1**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Émis chaque fois que [`.setupPrimary()`](/fr/nodejs/api/cluster#clustersetupprimarysettings) est appelé.

L'objet `settings` est l'objet `cluster.settings` au moment où [`.setupPrimary()`](/fr/nodejs/api/cluster#clustersetupprimarysettings) a été appelé et n'est qu'à titre indicatif, car plusieurs appels à [`.setupPrimary()`](/fr/nodejs/api/cluster#clustersetupprimarysettings) peuvent être effectués en un seul tick.

Si la précision est importante, utilisez `cluster.settings`.

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**Ajouté dans : v0.7.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée lorsque tous les workers sont déconnectés et que les descripteurs sont fermés.

Appelle `.disconnect()` sur chaque worker dans `cluster.workers`.

Lorsqu'ils sont déconnectés, tous les descripteurs internes seront fermés, ce qui permettra au processus primaire de s'arrêter correctement si aucun autre événement n'est en attente.

La méthode prend un argument callback optionnel qui sera appelé une fois terminé.

Cela ne peut être appelé qu'à partir du processus primaire.

## `cluster.fork([env])` {#clusterforkenv}

**Ajouté dans : v0.6.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Paires clé/valeur à ajouter à l'environnement du processus worker.
- Retourne : [\<cluster.Worker\>](/fr/nodejs/api/cluster#class-worker)

Crée un nouveau processus worker.

Cela ne peut être appelé qu'à partir du processus primaire.

## `cluster.isMaster` {#clusterismaster}

**Ajouté dans : v0.8.1**

**Déprécié depuis : v16.0.0**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

Alias déprécié pour [`cluster.isPrimary`](/fr/nodejs/api/cluster#clusterisprimary).

## `cluster.isPrimary` {#clusterisprimary}

**Ajouté dans : v16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vrai si le processus est primaire. Ceci est déterminé par `process.env.NODE_UNIQUE_ID`. Si `process.env.NODE_UNIQUE_ID` n'est pas défini, alors `isPrimary` est `true`.


## `cluster.isWorker` {#clusterisworker}

**Ajouté dans : v0.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vrai si le processus n'est pas un processus primaire (c'est la négation de `cluster.isPrimary`).

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**Ajouté dans : v0.11.2**

La politique d'ordonnancement, soit `cluster.SCHED_RR` pour round-robin, soit `cluster.SCHED_NONE` pour laisser faire le système d'exploitation. Il s'agit d'un paramètre global et effectivement figé une fois que le premier worker est créé, ou que [`.setupPrimary()`](/fr/nodejs/api/cluster#clustersetupprimarysettings) est appelé, selon la première éventualité.

`SCHED_RR` est la valeur par défaut sur tous les systèmes d'exploitation, sauf Windows. Windows passera à `SCHED_RR` une fois que libuv sera capable de distribuer efficacement les handles IOCP sans entraîner de forte baisse de performances.

`cluster.schedulingPolicy` peut également être défini via la variable d'environnement `NODE_CLUSTER_SCHED_POLICY`. Les valeurs valides sont `'rr'` et `'none'`.

## `cluster.settings` {#clustersettings}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.2.0, v12.16.0 | L'option `serialization` est désormais prise en charge. |
| v9.5.0 | L'option `cwd` est désormais prise en charge. |
| v9.4.0 | L'option `windowsHide` est désormais prise en charge. |
| v8.2.0 | L'option `inspectPort` est désormais prise en charge. |
| v6.4.0 | L'option `stdio` est désormais prise en charge. |
| v0.7.1 | Ajouté dans : v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste des arguments de chaîne passés à l'exécutable Node.js. **Par défaut :** `process.execArgv`.
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chemin de fichier vers le fichier worker. **Par défaut :** `process.argv[1]`.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Arguments de chaîne passés au worker. **Par défaut :** `process.argv.slice(2)`.
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Répertoire de travail actuel du processus worker. **Par défaut :** `undefined` (hérite du processus parent).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifiez le type de sérialisation utilisé pour l'envoi de messages entre les processus. Les valeurs possibles sont `'json'` et `'advanced'`. Voir [Sérialisation avancée pour `child_process`](/fr/nodejs/api/child_process#advanced-serialization) pour plus de détails. **Par défaut :** `false`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indique s'il faut ou non envoyer la sortie vers le stdio du parent. **Par défaut :** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configure le stdio des processus dupliqués. Étant donné que le module cluster s'appuie sur IPC pour fonctionner, cette configuration doit contenir une entrée `'ipc'`. Lorsque cette option est fournie, elle remplace `silent`. Voir [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/fr/nodejs/api/child_process#optionsstdio).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité de l'utilisateur du processus. (Voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité du groupe du processus. (Voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Définit le port de l'inspecteur du worker. Cela peut être un nombre ou une fonction qui ne prend aucun argument et renvoie un nombre. Par défaut, chaque worker reçoit son propre port, incrémenté à partir du `process.debugPort` du processus primaire.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Masque la fenêtre de console des processus dupliqués qui serait normalement créée sur les systèmes Windows. **Par défaut :** `false`.

Après avoir appelé [`.setupPrimary()`](/fr/nodejs/api/cluster#clustersetupprimarysettings) (ou [`.fork()`](/fr/nodejs/api/cluster#clusterforkenv)), cet objet de paramètres contiendra les paramètres, y compris les valeurs par défaut.

Cet objet n'est pas destiné à être modifié ou défini manuellement.


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.0.0 | Déprécié depuis : v16.0.0 |
| v6.4.0 | L'option `stdio` est désormais prise en charge. |
| v0.7.1 | Ajoutée dans : v0.7.1 |
:::

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stabilité: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

Alias déprécié pour [`.setupPrimary()`](/fr/nodejs/api/cluster#clustersetupprimarysettings).

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**Ajoutée dans : v16.0.0**

- `settings` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Voir [`cluster.settings`](/fr/nodejs/api/cluster#clustersettings).

`setupPrimary` est utilisé pour modifier le comportement par défaut de 'fork'. Une fois appelé, les paramètres seront présents dans `cluster.settings`.

Toute modification de paramètre affecte uniquement les futurs appels à [`.fork()`](/fr/nodejs/api/cluster#clusterforkenv) et n'a aucun effet sur les workers déjà en cours d'exécution.

Le seul attribut d'un worker qui ne peut pas être défini via `.setupPrimary()` est le `env` transmis à [`.fork()`](/fr/nodejs/api/cluster#clusterforkenv).

Les valeurs par défaut ci-dessus s'appliquent uniquement au premier appel ; les valeurs par défaut pour les appels ultérieurs sont les valeurs actuelles au moment où `cluster.setupPrimary()` est appelé.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // worker https
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // worker http
```

```js [CJS]
const cluster = require('node:cluster');

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // worker https
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // worker http
```
:::

Cela ne peut être appelé que depuis le processus primaire.

## `cluster.worker` {#clusterworker}

**Ajoutée dans : v0.7.0**

- [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Une référence à l'objet worker actuel. Non disponible dans le processus primaire.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  console.log('Je suis primaire');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`Je suis le worker #${cluster.worker.id}`);
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('Je suis primaire');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`Je suis le worker #${cluster.worker.id}`);
}
```
:::


## `cluster.workers` {#clusterworkers}

**Ajouté dans: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un hachage qui stocke les objets worker actifs, indexés par le champ `id`. Cela facilite la boucle à travers tous les workers. Il n'est disponible que dans le processus primaire.

Un worker est supprimé de `cluster.workers` après que le worker s'est déconnecté *et* a quitté. L'ordre entre ces deux événements ne peut être déterminé à l'avance. Cependant, il est garanti que la suppression de la liste `cluster.workers` se produit avant que le dernier événement `'disconnect'` ou `'exit'` ne soit émis.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('grande annonce à tous les workers');
}
```

```js [CJS]
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('grande annonce à tous les workers');
}
```
:::

