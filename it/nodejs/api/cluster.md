---
title: Documentazione Node.js - Cluster
description: Scopri come utilizzare il modulo cluster di Node.js per creare processi figlio che condividono le porte del server, migliorando le prestazioni e la scalabilità dell'applicazione.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Cluster | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come utilizzare il modulo cluster di Node.js per creare processi figlio che condividono le porte del server, migliorando le prestazioni e la scalabilità dell'applicazione.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Cluster | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come utilizzare il modulo cluster di Node.js per creare processi figlio che condividono le porte del server, migliorando le prestazioni e la scalabilità dell'applicazione.
---


# Cluster {#cluster}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

I cluster di processi Node.js possono essere utilizzati per eseguire più istanze di Node.js in grado di distribuire i carichi di lavoro tra i thread delle loro applicazioni. Quando non è necessario l'isolamento dei processi, utilizzare invece il modulo [`worker_threads`](/it/nodejs/api/worker_threads), che consente di eseguire più thread dell'applicazione all'interno di una singola istanza di Node.js.

Il modulo cluster consente la facile creazione di processi figlio che condividono tutte le porte del server.

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

L'esecuzione di Node.js ora condividerà la porta 8000 tra i worker:

```bash [BASH]
$ node server.js
Primary 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
```
Su Windows, non è ancora possibile impostare un server di named pipe in un worker.


## Come funziona {#how-it-works}

I processi worker vengono generati usando il metodo [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options), in modo che possano comunicare con il processo principale tramite IPC e scambiarsi gli handle del server.

Il modulo cluster supporta due metodi per distribuire le connessioni in entrata.

Il primo (e quello predefinito su tutte le piattaforme tranne Windows) è l'approccio round-robin, in cui il processo principale ascolta su una porta, accetta nuove connessioni e le distribuisce tra i worker in modo round-robin, con un po' di intelligenza integrata per evitare di sovraccaricare un processo worker.

Il secondo approccio prevede che il processo principale crei il socket di ascolto e lo invii ai worker interessati. I worker quindi accettano direttamente le connessioni in entrata.

Il secondo approccio dovrebbe, in teoria, dare le migliori prestazioni. In pratica, tuttavia, la distribuzione tende ad essere molto sbilanciata a causa delle stranezze dello scheduler del sistema operativo. Sono stati osservati carichi in cui oltre il 70% di tutte le connessioni è finito in soli due processi, su un totale di otto.

Poiché `server.listen()` affida la maggior parte del lavoro al processo principale, ci sono tre casi in cui il comportamento tra un normale processo Node.js e un worker cluster differisce:

Node.js non fornisce logica di routing. È quindi importante progettare un'applicazione in modo che non faccia troppo affidamento su oggetti dati in memoria per cose come sessioni e login.

Poiché i worker sono tutti processi separati, possono essere terminati o rigenerati a seconda delle esigenze di un programma, senza influire sugli altri worker. Finché ci sono alcuni worker ancora attivi, il server continuerà ad accettare connessioni. Se nessun worker è attivo, le connessioni esistenti verranno interrotte e le nuove connessioni verranno rifiutate. Node.js non gestisce automaticamente il numero di worker, tuttavia. È responsabilità dell'applicazione gestire il pool di worker in base alle proprie esigenze.

Sebbene un caso d'uso principale per il modulo `node:cluster` sia il networking, può anche essere utilizzato per altri casi d'uso che richiedono processi worker.


## Classe: `Worker` {#class-worker}

**Aggiunto in: v0.7.0**

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Un oggetto `Worker` contiene tutte le informazioni pubbliche e i metodi relativi a un worker. Nel primary può essere ottenuto usando `cluster.workers`. In un worker può essere ottenuto usando `cluster.worker`.

### Evento: `'disconnect'` {#event-disconnect}

**Aggiunto in: v0.7.7**

Simile all'evento `cluster.on('disconnect')`, ma specifico per questo worker.

```js [ESM]
cluster.fork().on('disconnect', () => {
  // Il worker si è disconnesso
});
```
### Evento: `'error'` {#event-error}

**Aggiunto in: v0.7.3**

Questo evento è lo stesso di quello fornito da [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options).

All'interno di un worker, può essere usato anche `process.on('error')`.

### Evento: `'exit'` {#event-exit}

**Aggiunto in: v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di uscita, se è uscito normalmente.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del segnale (ad es. `'SIGHUP'`) che ha causato l'interruzione del processo.

Simile all'evento `cluster.on('exit')`, ma specifico per questo worker.



::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker è stato interrotto dal segnale: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker è uscito con codice di errore: ${code}`);
    } else {
      console.log('worker successo!');
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
      console.log(`worker è stato interrotto dal segnale: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker è uscito con codice di errore: ${code}`);
    } else {
      console.log('worker successo!');
    }
  });
}
```
:::

### Evento: `'listening'` {#event-listening}

**Aggiunto in: v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Simile all'evento `cluster.on('listening')`, ma specifico per questo worker.



::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // Il worker è in ascolto
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // Il worker è in ascolto
});
```
:::

Non viene emesso nel worker.


### Evento: `'message'` {#event-message}

**Aggiunto in: v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Simile all'evento `'message'` di `cluster`, ma specifico per questo worker.

All'interno di un worker, può essere utilizzato anche `process.on('message')`.

Vedere [`process` event: `'message'`](/it/nodejs/api/process#event-message).

Ecco un esempio che utilizza il sistema di messaggistica. Mantiene un conteggio nel processo principale del numero di richieste HTTP ricevute dai worker:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {

  // Tiene traccia delle richieste http
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Conta le richieste
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Avvia i worker e ascolta i messaggi contenenti notifyRequest
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // I processi worker hanno un server http.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notifica al primary la richiesta
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

  // Tiene traccia delle richieste http
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Conta le richieste
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Avvia i worker e ascolta i messaggi contenenti notifyRequest
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // I processi worker hanno un server http.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notifica al primary la richiesta
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```
:::


### Evento: `'online'` {#event-online}

**Aggiunto in: v0.7.0**

Simile all'evento `cluster.on('online')`, ma specifico per questo worker.

```js [ESM]
cluster.fork().on('online', () => {
  // Il worker è online
});
```
Non viene emesso nel worker.

### `worker.disconnect()` {#workerdisconnect}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v7.3.0 | Questo metodo ora restituisce un riferimento a `worker`. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- Restituisce: [\<cluster.Worker\>](/it/nodejs/api/cluster#class-worker) Un riferimento a `worker`.

In un worker, questa funzione chiuderà tutti i server, attenderà l'evento `'close'` su quei server, e quindi disconnetterà il canale IPC.

Nel primary, viene inviato un messaggio interno al worker che lo fa chiamare `.disconnect()` su se stesso.

Causa l'impostazione di `.exitedAfterDisconnect`.

Dopo che un server è stato chiuso, non accetterà più nuove connessioni, ma le connessioni possono essere accettate da qualsiasi altro worker in ascolto. Le connessioni esistenti potranno chiudersi normalmente. Quando non ci sono più connessioni, vedi [`server.close()`](/it/nodejs/api/net#event-close), il canale IPC al worker si chiuderà permettendogli di morire in modo elegante.

Quanto sopra si applica *solo* alle connessioni server, le connessioni client non vengono chiuse automaticamente dai worker e la disconnessione non aspetta che si chiudano prima di uscire.

In un worker, `process.disconnect` esiste, ma non è questa funzione; è [`disconnect()`](/it/nodejs/api/child_process#subprocessdisconnect).

Poiché le connessioni server di lunga durata possono impedire ai worker di disconnettersi, potrebbe essere utile inviare un messaggio, in modo che possano essere intraprese azioni specifiche dell'applicazione per chiuderle. Potrebbe anche essere utile implementare un timeout, uccidendo un worker se l'evento `'disconnect'` non è stato emesso dopo un certo periodo di tempo.

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
    // Le connessioni non terminano mai
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Avvia la chiusura graduale di tutte le connessioni al server
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**Aggiunto in: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa proprietà è `true` se il worker è uscito a causa di `.disconnect()`. Se il worker è uscito in qualsiasi altro modo, è `false`. Se il worker non è uscito, è `undefined`.

Il booleano [`worker.exitedAfterDisconnect`](/it/nodejs/api/cluster#workerexitedafterdisconnect) consente di distinguere tra uscita volontaria e accidentale; il processo principale può scegliere di non riavviare un worker in base a questo valore.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('Oh, è stato solo volontario – non c\'è bisogno di preoccuparsi');
  }
});

// kill worker
worker.kill();
```
### `worker.id` {#workerid}

**Aggiunto in: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A ogni nuovo worker viene assegnato un ID univoco, questo ID è archiviato in `id`.

Mentre un worker è attivo, questa è la chiave che lo indicizza in `cluster.workers`.

### `worker.isConnected()` {#workerisconnected}

**Aggiunto in: v0.11.14**

Questa funzione restituisce `true` se il worker è connesso al suo processo principale tramite il suo canale IPC, `false` altrimenti. Un worker è connesso al suo processo principale dopo essere stato creato. Viene disconnesso dopo che viene emesso l'evento `'disconnect'`.

### `worker.isDead()` {#workerisdead}

**Aggiunto in: v0.11.14**

Questa funzione restituisce `true` se il processo del worker è terminato (a causa dell'uscita o della segnalazione). Altrimenti, restituisce `false`.

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

**Aggiunto in: v0.9.12**

- `signal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del segnale di terminazione da inviare al processo worker. **Predefinito:** `'SIGTERM'`

Questa funzione termina il worker. Nel worker principale, lo fa disconnettendo `worker.process` e, una volta disconnesso, terminando con `signal`. Nel worker, lo fa terminando il processo con `signal`.

La funzione `kill()` termina il processo worker senza attendere una disconnessione corretta, ha lo stesso comportamento di `worker.process.kill()`.

Questo metodo è aliasato come `worker.destroy()` per compatibilità con le versioni precedenti.

In un worker, `process.kill()` esiste, ma non è questa funzione; è [`kill()`](/it/nodejs/api/process#processkillpid-signal).

### `worker.process` {#workerprocess}

**Aggiunto in: v0.7.0**

- [\<ChildProcess\>](/it/nodejs/api/child_process#class-childprocess)

Tutti i worker vengono creati utilizzando [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options), l'oggetto restituito da questa funzione viene memorizzato come `.process`. In un worker, viene memorizzato il `process` globale.

Vedi: [Modulo Child Process](/it/nodejs/api/child_process#child_processforkmodulepath-args-options).

I worker chiameranno `process.exit(0)` se si verifica l'evento `'disconnect'` su `process` e `.exitedAfterDisconnect` non è `true`. Questo protegge da disconnessioni accidentali.

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v4.0.0 | Il parametro `callback` è ora supportato. |
| v0.7.0 | Aggiunto in: v0.7.0 |
:::

- `message` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/it/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'argomento `options`, se presente, è un oggetto utilizzato per parametrizzare l'invio di determinati tipi di handle. `options` supporta le seguenti proprietà:
    - `keepOpen` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un valore che può essere utilizzato quando si passano istanze di `net.Socket`. Quando `true`, il socket viene mantenuto aperto nel processo di invio. **Predefinito:** `false`.
  
 
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Invia un messaggio a un worker o al processo principale, opzionalmente con un handle.

Nel processo principale, questo invia un messaggio a un worker specifico. È identico a [`ChildProcess.send()`](/it/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

In un worker, questo invia un messaggio al processo principale. È identico a `process.send()`.

Questo esempio farà eco a tutti i messaggi dal processo principale:

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

## Evento: `'disconnect'` {#event-disconnect_1}

**Aggiunto in: v0.7.9**

- `worker` [\<cluster.Worker\>](/it/nodejs/api/cluster#class-worker)

Emesso dopo che il canale IPC del worker si è disconnesso. Ciò può verificarsi quando un worker termina normalmente, viene terminato o viene disconnesso manualmente (ad esempio con `worker.disconnect()`).

Potrebbe esserci un ritardo tra gli eventi `'disconnect'` e `'exit'`. Questi eventi possono essere utilizzati per rilevare se il processo è bloccato in una pulizia o se ci sono connessioni di lunga durata.

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`Il worker #${worker.id} si è disconnesso`);
});
```
## Evento: `'exit'` {#event-exit_1}

**Aggiunto in: v0.7.9**

- `worker` [\<cluster.Worker\>](/it/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di uscita, se è terminato normalmente.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome del segnale (es. `'SIGHUP'`) che ha causato l'interruzione del processo.

Quando uno qualsiasi dei worker muore, il modulo cluster emetterà l'evento `'exit'`.

Questo può essere utilizzato per riavviare il worker chiamando di nuovo [`.fork()`](/it/nodejs/api/cluster#clusterforkenv).

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d è morto (%s). Riavvio...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
Vedi [`child_process` event: `'exit'`](/it/nodejs/api/child_process#event-exit).

## Evento: `'fork'` {#event-fork}

**Aggiunto in: v0.7.0**

- `worker` [\<cluster.Worker\>](/it/nodejs/api/cluster#class-worker)

Quando viene creato un nuovo worker, il modulo cluster emetterà un evento `'fork'`. Questo può essere utilizzato per registrare l'attività del worker e creare un timeout personalizzato.

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('Qualcosa deve essere sbagliato con la connessione ...');
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

## Evento: `'listening'` {#event-listening_1}

**Aggiunto in: v0.7.0**

- `worker` [\<cluster.Worker\>](/it/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Dopo aver chiamato `listen()` da un worker, quando l'evento `'listening'` viene emesso sul server, un evento `'listening'` verrà emesso anche su `cluster` nel primary.

L'event handler viene eseguito con due argomenti, `worker` contiene l'oggetto worker e l'oggetto `address` contiene le seguenti proprietà di connessione: `address`, `port` e `addressType`. Questo è molto utile se il worker è in ascolto su più di un indirizzo.

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `Un worker è ora connesso a ${address.address}:${address.port}`);
});
```
L'`addressType` è uno tra:

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (socket di dominio Unix)
- `'udp4'` o `'udp6'` (UDPv4 o UDPv6)

## Evento: `'message'` {#event-message_1}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | Il parametro `worker` viene ora passato; vedi sotto per i dettagli. |
| v2.5.0 | Aggiunto in: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/it/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emesso quando il cluster primary riceve un messaggio da qualsiasi worker.

Vedi [`child_process` evento: `'message'`](/it/nodejs/api/child_process#event-message).

## Evento: `'online'` {#event-online_1}

**Aggiunto in: v0.7.0**

- `worker` [\<cluster.Worker\>](/it/nodejs/api/cluster#class-worker)

Dopo aver creato un nuovo worker tramite fork, il worker dovrebbe rispondere con un messaggio online. Quando il primary riceve un messaggio online, emetterà questo evento. La differenza tra `'fork'` e `'online'` è che fork viene emesso quando il primary crea un worker tramite fork, e `'online'` viene emesso quando il worker è in esecuzione.

```js [ESM]
cluster.on('online', (worker) => {
  console.log('Evvai, il worker ha risposto dopo essere stato creato tramite fork');
});
```

## Evento: `'setup'` {#event-setup}

**Aggiunto in: v0.7.1**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emesso ogni volta che viene chiamato [`.setupPrimary()`](/it/nodejs/api/cluster#clustersetupprimarysettings).

L'oggetto `settings` è l'oggetto `cluster.settings` nel momento in cui [`.setupPrimary()`](/it/nodejs/api/cluster#clustersetupprimarysettings) è stato chiamato ed è solo a scopo informativo, poiché si possono effettuare più chiamate a [`.setupPrimary()`](/it/nodejs/api/cluster#clustersetupprimarysettings) in un singolo tick.

Se l'accuratezza è importante, usa `cluster.settings`.

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**Aggiunto in: v0.7.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamato quando tutti i worker sono disconnessi e gli handle sono chiusi.

Chiama `.disconnect()` su ogni worker in `cluster.workers`.

Quando sono disconnessi, tutti gli handle interni verranno chiusi, consentendo al processo primary di terminare normalmente se nessun altro evento è in attesa.

Il metodo accetta un argomento callback opzionale che verrà chiamato al termine.

Questo può essere chiamato solo dal processo primary.

## `cluster.fork([env])` {#clusterforkenv}

**Aggiunto in: v0.6.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Coppie chiave/valore da aggiungere all'ambiente del processo worker.
- Restituisce: [\<cluster.Worker\>](/it/nodejs/api/cluster#class-worker)

Genera un nuovo processo worker.

Questo può essere chiamato solo dal processo primary.

## `cluster.isMaster` {#clusterismaster}

**Aggiunto in: v0.8.1**

**Deprecato da: v16.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

Alias deprecato per [`cluster.isPrimary`](/it/nodejs/api/cluster#clusterisprimary).

## `cluster.isPrimary` {#clusterisprimary}

**Aggiunto in: v16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Vero se il processo è un primary. Questo è determinato da `process.env.NODE_UNIQUE_ID`. Se `process.env.NODE_UNIQUE_ID` è indefinito, allora `isPrimary` è `true`.


## `cluster.isWorker` {#clusterisworker}

**Aggiunto in: v0.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true` se il processo non è un processo principale (è la negazione di `cluster.isPrimary`).

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**Aggiunto in: v0.11.2**

La politica di pianificazione, o `cluster.SCHED_RR` per round-robin o `cluster.SCHED_NONE` per lasciarla al sistema operativo. Questa è un'impostazione globale ed è effettivamente congelata una volta che il primo worker viene generato, oppure viene chiamato [`.setupPrimary()`](/it/nodejs/api/cluster#clustersetupprimarysettings), a seconda di quale evento si verifica prima.

`SCHED_RR` è l'impostazione predefinita su tutti i sistemi operativi tranne Windows. Windows passerà a `SCHED_RR` una volta che libuv sarà in grado di distribuire efficacemente gli handle IOCP senza incorrere in un grande impatto sulle prestazioni.

`cluster.schedulingPolicy` può anche essere impostato tramite la variabile d'ambiente `NODE_CLUSTER_SCHED_POLICY`. I valori validi sono `'rr'` e `'none'`.

## `cluster.settings` {#clustersettings}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.2.0, v12.16.0 | L'opzione `serialization` è ora supportata. |
| v9.5.0 | L'opzione `cwd` è ora supportata. |
| v9.4.0 | L'opzione `windowsHide` è ora supportata. |
| v8.2.0 | L'opzione `inspectPort` è ora supportata. |
| v6.4.0 | L'opzione `stdio` è ora supportata. |
| v0.7.1 | Aggiunto in: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco di argomenti stringa passati all'eseguibile Node.js. **Predefinito:** `process.execArgv`.
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Percorso del file del worker. **Predefinito:** `process.argv[1]`.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Argomenti stringa passati al worker. **Predefinito:** `process.argv.slice(2)`.
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Directory di lavoro corrente del processo worker. **Predefinito:** `undefined` (eredita dal processo padre).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica il tipo di serializzazione utilizzato per l'invio di messaggi tra processi. I valori possibili sono `'json'` e `'advanced'`. Vedere [Serializzazione avanzata per `child_process`](/it/nodejs/api/child_process#advanced-serialization) per maggiori dettagli. **Predefinito:** `false`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se inviare o meno l'output allo stdio del padre. **Predefinito:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configura lo stdio dei processi forkati. Poiché il modulo cluster si basa su IPC per funzionare, questa configurazione deve contenere una voce `'ipc'`. Quando viene fornita questa opzione, sovrascrive `silent`. Vedere [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/it/nodejs/api/child_process#optionsstdio).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità utente del processo. (Vedere [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità del gruppo del processo. (Vedere [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Imposta la porta dell'inspector del worker. Questo può essere un numero o una funzione che non accetta argomenti e restituisce un numero. Per impostazione predefinita, ogni worker ottiene la propria porta, incrementata dalla `process.debugPort` del principale.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nasconde la finestra della console dei processi forkati che normalmente verrebbe creata sui sistemi Windows. **Predefinito:** `false`.
  
 

Dopo aver chiamato [`.setupPrimary()`](/it/nodejs/api/cluster#clustersetupprimarysettings) (o [`.fork()`](/it/nodejs/api/cluster#clusterforkenv)), questo oggetto delle impostazioni conterrà le impostazioni, inclusi i valori predefiniti.

Questo oggetto non è destinato a essere modificato o impostato manualmente.


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.0.0 | Obsoleto da: v16.0.0 |
| v6.4.0 | L'opzione `stdio` è ora supportata. |
| v0.7.1 | Aggiunto in: v0.7.1 |
:::

::: danger [Stabile: 0 - Obsoleto]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Obsoleto
:::

Alias obsoleto per [`.setupPrimary()`](/it/nodejs/api/cluster#clustersetupprimarysettings).

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**Aggiunto in: v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Vedi [`cluster.settings`](/it/nodejs/api/cluster#clustersettings).

`setupPrimary` è usato per cambiare il comportamento predefinito di 'fork'. Una volta chiamato, le impostazioni saranno presenti in `cluster.settings`.

Qualsiasi modifica alle impostazioni influisce solo sulle chiamate future a [`.fork()`](/it/nodejs/api/cluster#clusterforkenv) e non ha alcun effetto sui worker già in esecuzione.

L'unico attributo di un worker che non può essere impostato tramite `.setupPrimary()` è l'`env` passato a [`.fork()`](/it/nodejs/api/cluster#clusterforkenv).

Le impostazioni predefinite sopra riportate si applicano solo alla prima chiamata; le impostazioni predefinite per le chiamate successive sono i valori correnti al momento della chiamata di `cluster.setupPrimary()`.



::: code-group
```js [ESM]
import cluster from 'node:cluster';

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
```

```js [CJS]
const cluster = require('node:cluster');

cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true,
});
cluster.fork(); // https worker
cluster.setupPrimary({
  exec: 'worker.js',
  args: ['--use', 'http'],
});
cluster.fork(); // http worker
```
:::

Questo può essere chiamato solo dal processo primary.

## `cluster.worker` {#clusterworker}

**Aggiunto in: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un riferimento all'oggetto worker corrente. Non disponibile nel processo primary.



::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('I am primary');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`I am worker #${cluster.worker.id}`);
}
```
:::


## `cluster.workers` {#clusterworkers}

**Aggiunto in: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un hash che memorizza gli oggetti worker attivi, indicizzati dal campo `id`. Ciò rende facile scorrere tutti i worker. È disponibile solo nel processo primario.

Un worker viene rimosso da `cluster.workers` dopo che il worker si è disconnesso *e* è uscito. L'ordine tra questi due eventi non può essere determinato in anticipo. Tuttavia, è garantito che la rimozione dall'elenco `cluster.workers` avvenga prima che venga emesso l'ultimo evento `'disconnect'` o `'exit'`.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
```

```js [CJS]
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('big announcement to all workers');
}
```
:::

