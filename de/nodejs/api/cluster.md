---
title: Node.js Dokumentation - Cluster
description: Erfahren Sie, wie Sie das Cluster-Modul von Node.js verwenden, um untergeordnete Prozesse zu erstellen, die Serverports teilen, um die Leistung und Skalierbarkeit der Anwendung zu verbessern.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Cluster | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie das Cluster-Modul von Node.js verwenden, um untergeordnete Prozesse zu erstellen, die Serverports teilen, um die Leistung und Skalierbarkeit der Anwendung zu verbessern.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Cluster | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie das Cluster-Modul von Node.js verwenden, um untergeordnete Prozesse zu erstellen, die Serverports teilen, um die Leistung und Skalierbarkeit der Anwendung zu verbessern.
---


# Cluster {#cluster}

::: tip [Stable: 2 - Stable]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

Cluster von Node.js-Prozessen können verwendet werden, um mehrere Instanzen von Node.js auszuführen, die Workloads auf ihre Anwendungs-Threads verteilen können. Wenn keine Prozessisolation erforderlich ist, verwenden Sie stattdessen das Modul [`worker_threads`](/de/nodejs/api/worker_threads), das die Ausführung mehrerer Anwendungs-Threads innerhalb einer einzelnen Node.js-Instanz ermöglicht.

Das Cluster-Modul ermöglicht die einfache Erstellung von Child-Prozessen, die sich alle Server-Ports teilen.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} läuft`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} ist gestorben`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} gestartet`);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} läuft`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} ist gestorben`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} gestartet`);
}
```
:::

Das Ausführen von Node.js teilt sich nun Port 8000 zwischen den Workern:

```bash [BASH]
$ node server.js
Primary 3596 läuft
Worker 4324 gestartet
Worker 4520 gestartet
Worker 6056 gestartet
Worker 5644 gestartet
```
Unter Windows ist es noch nicht möglich, einen Named-Pipe-Server in einem Worker einzurichten.


## Funktionsweise {#how-it-works}

Die Worker-Prozesse werden mit der Methode [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options) erzeugt, so dass sie über IPC mit dem übergeordneten Prozess kommunizieren und Server-Handles hin- und herschicken können.

Das Cluster-Modul unterstützt zwei Methoden zur Verteilung eingehender Verbindungen.

Die erste (und Standardeinstellung auf allen Plattformen außer Windows) ist der Round-Robin-Ansatz, bei dem der primäre Prozess an einem Port lauscht, neue Verbindungen akzeptiert und sie in einem Round-Robin-Verfahren an die Worker verteilt, mit einigen eingebauten Intelligenzen, um eine Überlastung eines Worker-Prozesses zu vermeiden.

Der zweite Ansatz besteht darin, dass der primäre Prozess den Listen-Socket erstellt und ihn an interessierte Worker sendet. Die Worker akzeptieren dann eingehende Verbindungen direkt.

Der zweite Ansatz sollte theoretisch die beste Leistung erbringen. In der Praxis ist die Verteilung jedoch aufgrund der Unwägbarkeiten des Betriebssystem-Schedulers tendenziell sehr unausgewogen. Es wurden Lasten beobachtet, bei denen über 70 % aller Verbindungen in nur zwei Prozessen landeten, von insgesamt acht.

Da `server.listen()` den größten Teil der Arbeit an den primären Prozess abgibt, gibt es drei Fälle, in denen sich das Verhalten zwischen einem normalen Node.js-Prozess und einem Cluster-Worker unterscheidet:

Node.js bietet keine Routing-Logik. Es ist daher wichtig, eine Anwendung so zu konzipieren, dass sie sich nicht zu sehr auf In-Memory-Datenobjekte für Dinge wie Sessions und Login verlässt.

Da es sich bei Workern um separate Prozesse handelt, können diese je nach Bedarf eines Programms beendet oder neu gestartet werden, ohne andere Worker zu beeinträchtigen. Solange noch Worker aktiv sind, akzeptiert der Server weiterhin Verbindungen. Wenn keine Worker aktiv sind, werden bestehende Verbindungen abgebrochen und neue Verbindungen abgelehnt. Node.js verwaltet jedoch nicht automatisch die Anzahl der Worker. Es liegt in der Verantwortung der Anwendung, den Worker-Pool basierend auf ihren eigenen Bedürfnissen zu verwalten.

Obwohl ein Hauptanwendungsfall für das Modul `node:cluster` die Vernetzung ist, kann es auch für andere Anwendungsfälle verwendet werden, die Worker-Prozesse erfordern.


## Klasse: `Worker` {#class-worker}

**Hinzugefügt in: v0.7.0**

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Ein `Worker`-Objekt enthält alle öffentlichen Informationen und Methoden über einen Worker. Im Hauptprozess kann es mit `cluster.workers` abgerufen werden. In einem Worker kann es mit `cluster.worker` abgerufen werden.

### Ereignis: `'disconnect'` {#event-disconnect}

**Hinzugefügt in: v0.7.7**

Ähnlich dem `cluster.on('disconnect')`-Ereignis, aber spezifisch für diesen Worker.

```js [ESM]
cluster.fork().on('disconnect', () => {
  // Worker wurde getrennt
});
```
### Ereignis: `'error'` {#event-error}

**Hinzugefügt in: v0.7.3**

Dieses Ereignis ist das gleiche wie das von [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options) bereitgestellte.

Innerhalb eines Workers kann auch `process.on('error')` verwendet werden.

### Ereignis: `'exit'` {#event-exit}

**Hinzugefügt in: v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Exit-Code, falls er normal beendet wurde.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name des Signals (z. B. `'SIGHUP'`), das das Beenden des Prozesses verursacht hat.

Ähnlich dem `cluster.on('exit')`-Ereignis, aber spezifisch für diesen Worker.



::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker wurde durch Signal beendet: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker wurde mit Fehlercode beendet: ${code}`);
    } else {
      console.log('worker erfolgreich!');
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
      console.log(`worker wurde durch Signal beendet: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker wurde mit Fehlercode beendet: ${code}`);
    } else {
      console.log('worker erfolgreich!');
    }
  });
}
```
:::

### Ereignis: `'listening'` {#event-listening}

**Hinzugefügt in: v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ähnlich dem `cluster.on('listening')`-Ereignis, aber spezifisch für diesen Worker.



::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // Worker hört zu
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // Worker hört zu
});
```
:::

Es wird im Worker nicht ausgegeben.


### Event: `'message'` {#event-message}

**Hinzugefügt in: v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ähnlich dem Ereignis `'message'` von `cluster`, aber spezifisch für diesen Worker.

Innerhalb eines Workers kann auch `process.on('message')` verwendet werden.

Siehe [`process` event: `'message'`](/de/nodejs/api/process#event-message).

Hier ist ein Beispiel für die Verwendung des Nachrichtensystems. Es hält im Hauptprozess die Anzahl der von den Workern empfangenen HTTP-Anfragen fest:

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


### Event: `'online'` {#event-online}

**Hinzugefügt in: v0.7.0**

Ähnlich dem `cluster.on('online')`-Event, aber spezifisch für diesen Worker.

```js [ESM]
cluster.fork().on('online', () => {
  // Worker ist online
});
```
Es wird nicht im Worker ausgelöst.

### `worker.disconnect()` {#workerdisconnect}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v7.3.0 | Diese Methode gibt jetzt eine Referenz auf `worker` zurück. |
| v0.7.7 | Hinzugefügt in: v0.7.7 |
:::

- Gibt zurück: [\<cluster.Worker\>](/de/nodejs/api/cluster#class-worker) Eine Referenz auf `worker`.

In einem Worker schließt diese Funktion alle Server, wartet auf das `'close'`-Event auf diesen Servern und trennt dann den IPC-Kanal.

Im Primary wird eine interne Nachricht an den Worker gesendet, die ihn veranlasst, `.disconnect()` auf sich selbst aufzurufen.

Bewirkt, dass `.exitedAfterDisconnect` gesetzt wird.

Nachdem ein Server geschlossen wurde, akzeptiert er keine neuen Verbindungen mehr, aber Verbindungen können von jedem anderen abhörenden Worker akzeptiert werden. Bestehende Verbindungen können wie gewohnt geschlossen werden. Wenn keine Verbindungen mehr bestehen, siehe [`server.close()`](/de/nodejs/api/net#event-close), wird der IPC-Kanal zum Worker geschlossen, wodurch er ordnungsgemäß beendet werden kann.

Das Obige gilt *nur* für Serververbindungen, Clientverbindungen werden nicht automatisch von Workern geschlossen, und disconnect wartet nicht darauf, dass sie geschlossen werden, bevor es beendet wird.

In einem Worker existiert `process.disconnect`, aber es ist nicht diese Funktion; es ist [`disconnect()`](/de/nodejs/api/child_process#subprocessdisconnect).

Da lang lebende Serververbindungen verhindern können, dass sich Worker trennen, kann es nützlich sein, eine Nachricht zu senden, damit anwendungsspezifische Aktionen ergriffen werden können, um sie zu schließen. Es kann auch nützlich sein, ein Timeout zu implementieren und einen Worker zu beenden, wenn das `'disconnect'`-Event nach einiger Zeit nicht ausgelöst wurde.

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
    // Verbindungen enden nie
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Leite das ordnungsgemäße Schließen aller Verbindungen zum Server ein
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**Hinzugefügt in: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Eigenschaft ist `true`, wenn der Worker aufgrund von `.disconnect()` beendet wurde. Wenn der Worker auf andere Weise beendet wurde, ist sie `false`. Wenn der Worker nicht beendet wurde, ist sie `undefined`.

Der boolesche Wert [`worker.exitedAfterDisconnect`](/de/nodejs/api/cluster#workerexitedafterdisconnect) ermöglicht die Unterscheidung zwischen freiwilligem und versehentlichem Beenden, sodass der Primary basierend auf diesem Wert möglicherweise keinen Worker erneut startet.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('Oh, es war nur freiwillig – kein Grund zur Sorge');
  }
});

// kill worker
worker.kill();
```
### `worker.id` {#workerid}

**Hinzugefügt in: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Jeder neue Worker erhält eine eigene eindeutige ID, die in der `id` gespeichert wird.

Solange ein Worker aktiv ist, ist dies der Schlüssel, der ihn in `cluster.workers` indiziert.

### `worker.isConnected()` {#workerisconnected}

**Hinzugefügt in: v0.11.14**

Diese Funktion gibt `true` zurück, wenn der Worker über seinen IPC-Kanal mit seinem Primary verbunden ist, andernfalls `false`. Ein Worker ist mit seinem Primary verbunden, nachdem er erstellt wurde. Er wird getrennt, nachdem das Ereignis `'disconnect'` ausgelöst wurde.

### `worker.isDead()` {#workerisdead}

**Hinzugefügt in: v0.11.14**

Diese Funktion gibt `true` zurück, wenn der Prozess des Workers beendet wurde (entweder durch Beenden oder durch ein Signal). Andernfalls wird `false` zurückgegeben.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} läuft`);

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
  console.log(`Primary ${process.pid} läuft`);

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

**Hinzugefügt in: v0.9.12**

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Kill-Signals, das an den Worker-Prozess gesendet werden soll. **Standard:** `'SIGTERM'`

Diese Funktion beendet den Worker. Im primären Worker geschieht dies durch Trennen der Verbindung zu `worker.process` und, sobald die Verbindung getrennt ist, durch Beenden mit `signal`. Im Worker geschieht dies durch Beenden des Prozesses mit `signal`.

Die Funktion `kill()` beendet den Worker-Prozess, ohne auf eine ordnungsgemäße Trennung der Verbindung zu warten. Sie verhält sich genauso wie `worker.process.kill()`.

Diese Methode ist zur Abwärtskompatibilität als `worker.destroy()` aliasiert.

In einem Worker existiert `process.kill()`, aber es ist nicht diese Funktion; es ist [`kill()`](/de/nodejs/api/process#processkillpid-signal).

### `worker.process` {#workerprocess}

**Hinzugefügt in: v0.7.0**

- [\<ChildProcess\>](/de/nodejs/api/child_process#class-childprocess)

Alle Worker werden mit [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options) erstellt, das von dieser Funktion zurückgegebene Objekt wird als `.process` gespeichert. In einem Worker wird der globale `process` gespeichert.

Siehe: [Child Process Modul](/de/nodejs/api/child_process#child_processforkmodulepath-args-options).

Worker rufen `process.exit(0)` auf, wenn das Ereignis `'disconnect'` auf `process` auftritt und `.exitedAfterDisconnect` nicht `true` ist. Dies schützt vor unbeabsichtigter Trennung der Verbindung.

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v4.0.0 | Der `callback`-Parameter wird jetzt unterstützt. |
| v0.7.0 | Hinzugefügt in: v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/de/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Argument `options`, falls vorhanden, ist ein Objekt, das verwendet wird, um das Senden bestimmter Arten von Handles zu parametrisieren. `options` unterstützt die folgenden Eigenschaften:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ein Wert, der beim Übergeben von Instanzen von `net.Socket` verwendet werden kann. Wenn `true`, wird der Socket im sendenden Prozess offen gehalten. **Standard:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Sendet eine Nachricht an einen Worker oder Primärprozess, optional mit einem Handle.

Im Primärprozess sendet dies eine Nachricht an einen bestimmten Worker. Dies ist identisch mit [`ChildProcess.send()`](/de/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

In einem Worker sendet dies eine Nachricht an den Primärprozess. Dies ist identisch mit `process.send()`.

Dieses Beispiel gibt alle Nachrichten vom Primärprozess zurück:

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

## Ereignis: `'disconnect'` {#event-disconnect_1}

**Hinzugefügt in: v0.7.9**

- `worker` [\<cluster.Worker\>](/de/nodejs/api/cluster#class-worker)

Wird ausgelöst, nachdem der Worker-IPC-Kanal getrennt wurde. Dies kann auftreten, wenn ein Worker ordnungsgemäß beendet wird, beendet wird oder manuell getrennt wird (z. B. mit `worker.disconnect()`).

Es kann eine Verzögerung zwischen den Ereignissen `'disconnect'` und `'exit'` geben. Diese Ereignisse können verwendet werden, um zu erkennen, ob der Prozess in einer Bereinigung stecken bleibt oder ob es langlebige Verbindungen gibt.

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`Der Worker #${worker.id} wurde getrennt`);
});
```
## Ereignis: `'exit'` {#event-exit_1}

**Hinzugefügt in: v0.7.9**

- `worker` [\<cluster.Worker\>](/de/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Exit-Code, falls er normal beendet wurde.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name des Signals (z. B. `'SIGHUP'`), das zum Beenden des Prozesses geführt hat.

Wenn einer der Worker stirbt, löst das Cluster-Modul das Ereignis `'exit'` aus.

Dies kann verwendet werden, um den Worker durch erneutes Aufrufen von [`.fork()`](/de/nodejs/api/cluster#clusterforkenv) neu zu starten.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('Worker %d gestorben (%s). Neustart...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
Siehe [`child_process` event: `'exit'`](/de/nodejs/api/child_process#event-exit).

## Ereignis: `'fork'` {#event-fork}

**Hinzugefügt in: v0.7.0**

- `worker` [\<cluster.Worker\>](/de/nodejs/api/cluster#class-worker)

Wenn ein neuer Worker geforkt wird, löst das Cluster-Modul ein `'fork'`-Ereignis aus. Dies kann verwendet werden, um Worker-Aktivitäten zu protokollieren und ein benutzerdefiniertes Timeout zu erstellen.

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('Etwas muss mit der Verbindung nicht stimmen ...');
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

## Ereignis: `'listening'` {#event-listening_1}

**Hinzugefügt in: v0.7.0**

- `worker` [\<cluster.Worker\>](/de/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Nach dem Aufruf von `listen()` von einem Worker aus wird, wenn das `'listening'`-Ereignis auf dem Server ausgelöst wird, auch ein `'listening'`-Ereignis auf `cluster` im primären Prozess ausgelöst.

Der Ereignishandler wird mit zwei Argumenten ausgeführt, wobei `worker` das Worker-Objekt und das `address`-Objekt die folgenden Verbindungseigenschaften enthält: `address`, `port` und `addressType`. Dies ist sehr nützlich, wenn der Worker an mehr als einer Adresse lauscht.

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `Ein Worker ist jetzt mit ${address.address}:${address.port} verbunden`);
});
```
Der `addressType` ist einer von:

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (Unix-Domain-Socket)
- `'udp4'` oder `'udp6'` (UDPv4 oder UDPv6)

## Ereignis: `'message'` {#event-message_1}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Der `worker`-Parameter wird jetzt übergeben; siehe unten für Details. |
| v2.5.0 | Hinzugefügt in: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/de/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wird ausgelöst, wenn der Cluster-Primärprozess eine Nachricht von einem beliebigen Worker empfängt.

Siehe [`child_process` Ereignis: `'message'`](/de/nodejs/api/child_process#event-message).

## Ereignis: `'online'` {#event-online_1}

**Hinzugefügt in: v0.7.0**

- `worker` [\<cluster.Worker\>](/de/nodejs/api/cluster#class-worker)

Nach dem Forken eines neuen Workers sollte der Worker mit einer Online-Nachricht antworten. Wenn der Primärprozess eine Online-Nachricht empfängt, löst er dieses Ereignis aus. Der Unterschied zwischen `'fork'` und `'online'` besteht darin, dass fork ausgelöst wird, wenn der Primärprozess einen Worker forkt, und `'online'` wird ausgelöst, wenn der Worker ausgeführt wird.

```js [ESM]
cluster.on('online', (worker) => {
  console.log('Juhu, der Worker hat geantwortet, nachdem er geforkt wurde');
});
```

## Ereignis: `'setup'` {#event-setup}

**Hinzugefügt in: v0.7.1**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Wird jedes Mal ausgelöst, wenn [`.setupPrimary()`](/de/nodejs/api/cluster#clustersetupprimarysettings) aufgerufen wird.

Das `settings`-Objekt ist das `cluster.settings`-Objekt zu dem Zeitpunkt, als [`.setupPrimary()`](/de/nodejs/api/cluster#clustersetupprimarysettings) aufgerufen wurde, und dient nur zur Information, da mehrere Aufrufe von [`.setupPrimary()`](/de/nodejs/api/cluster#clustersetupprimarysettings) in einem einzigen Tick erfolgen können.

Wenn Genauigkeit wichtig ist, verwenden Sie `cluster.settings`.

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**Hinzugefügt in: v0.7.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird aufgerufen, wenn alle Worker getrennt und Handles geschlossen wurden.

Ruft `.disconnect()` für jeden Worker in `cluster.workers` auf.

Wenn sie getrennt sind, werden alle internen Handles geschlossen, wodurch der primäre Prozess ordnungsgemäß beendet werden kann, wenn kein anderes Ereignis wartet.

Die Methode akzeptiert ein optionales Callback-Argument, das nach Abschluss aufgerufen wird.

Dies kann nur vom primären Prozess aufgerufen werden.

## `cluster.fork([env])` {#clusterforkenv}

**Hinzugefügt in: v0.6.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Schlüssel/Wert-Paare, die der Umgebung des Worker-Prozesses hinzugefügt werden sollen.
- Gibt zurück: [\<cluster.Worker\>](/de/nodejs/api/cluster#class-worker)

Erzeugt einen neuen Worker-Prozess.

Dies kann nur vom primären Prozess aufgerufen werden.

## `cluster.isMaster` {#clusterismaster}

**Hinzugefügt in: v0.8.1**

**Veraltet seit: v16.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

Veralteter Alias für [`cluster.isPrimary`](/de/nodejs/api/cluster#clusterisprimary).

## `cluster.isPrimary` {#clusterisprimary}

**Hinzugefügt in: v16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

True, wenn der Prozess ein Primärprozess ist. Dies wird durch `process.env.NODE_UNIQUE_ID` bestimmt. Wenn `process.env.NODE_UNIQUE_ID` undefiniert ist, dann ist `isPrimary` `true`.


## `cluster.isWorker` {#clusterisworker}

**Hinzugefügt in: v0.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`, wenn der Prozess kein primärer Prozess ist (es ist die Negation von `cluster.isPrimary`).

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**Hinzugefügt in: v0.11.2**

Die Scheduling-Policy, entweder `cluster.SCHED_RR` für Round-Robin oder `cluster.SCHED_NONE`, um sie dem Betriebssystem zu überlassen. Dies ist eine globale Einstellung und effektiv eingefroren, sobald entweder der erste Worker gestartet wurde oder [`.setupPrimary()`](/de/nodejs/api/cluster#clustersetupprimarysettings) aufgerufen wird, je nachdem, was zuerst eintritt.

`SCHED_RR` ist die Standardeinstellung auf allen Betriebssystemen außer Windows. Windows wechselt zu `SCHED_RR`, sobald libuv in der Lage ist, IOCP-Handles effektiv zu verteilen, ohne eine große Leistungseinbuße zu verursachen.

`cluster.schedulingPolicy` kann auch über die Umgebungsvariable `NODE_CLUSTER_SCHED_POLICY` gesetzt werden. Gültige Werte sind `'rr'` und `'none'`.

## `cluster.settings` {#clustersettings}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.2.0, v12.16.0 | Die Option `serialization` wird jetzt unterstützt. |
| v9.5.0 | Die Option `cwd` wird jetzt unterstützt. |
| v9.4.0 | Die Option `windowsHide` wird jetzt unterstützt. |
| v8.2.0 | Die Option `inspectPort` wird jetzt unterstützt. |
| v6.4.0 | Die Option `stdio` wird jetzt unterstützt. |
| v0.7.1 | Hinzugefügt in: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste von String-Argumenten, die an die Node.js-Executable übergeben werden. **Standard:** `process.execArgv`.
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Dateipfad zur Worker-Datei. **Standard:** `process.argv[1]`.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) String-Argumente, die an den Worker übergeben werden. **Standard:** `process.argv.slice(2)`.
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Aktuelles Arbeitsverzeichnis des Worker-Prozesses. **Standard:** `undefined` (erbt vom Elternprozess).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt die Art der Serialisierung an, die zum Senden von Nachrichten zwischen Prozessen verwendet wird. Mögliche Werte sind `'json'` und `'advanced'`. Siehe [Erweiterte Serialisierung für `child_process`](/de/nodejs/api/child_process#advanced-serialization) für weitere Details. **Standard:** `false`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob die Ausgabe an die Standard-Ein- und Ausgabekanäle des Elternprozesses gesendet werden soll oder nicht. **Standard:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Konfiguriert die Standard-Ein- und Ausgabekanäle für verzweigte Prozesse. Da das Cluster-Modul auf IPC angewiesen ist, muss diese Konfiguration einen `'ipc'`-Eintrag enthalten. Wenn diese Option angegeben wird, überschreibt sie `silent`. Siehe [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/de/nodejs/api/child_process#optionsstdio).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Benutzeridentität des Prozesses. (Siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Gruppenidentität des Prozesses. (Siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Setzt den Inspektor-Port des Workers. Dies kann eine Zahl oder eine Funktion sein, die keine Argumente akzeptiert und eine Zahl zurückgibt. Standardmäßig erhält jeder Worker seinen eigenen Port, der von `process.debugPort` des Primärprozesses inkrementiert wird.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Blendet das Konsolenfenster der verzweigten Prozesse aus, das normalerweise auf Windows-Systemen erstellt wird. **Standard:** `false`.



Nach dem Aufruf von [`.setupPrimary()`](/de/nodejs/api/cluster#clustersetupprimarysettings) (oder [`.fork()`](/de/nodejs/api/cluster#clusterforkenv)) enthält dieses Einstellungsobjekt die Einstellungen, einschließlich der Standardwerte.

Dieses Objekt ist nicht dazu gedacht, manuell geändert oder gesetzt zu werden.


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Veraltet seit: v16.0.0 |
| v6.4.0 | Die `stdio` Option wird jetzt unterstützt. |
| v0.7.1 | Hinzugefügt in: v0.7.1 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

Veralteter Alias für [`.setupPrimary()`](/de/nodejs/api/cluster#clustersetupprimarysettings).

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**Hinzugefügt in: v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Siehe [`cluster.settings`](/de/nodejs/api/cluster#clustersettings).

`setupPrimary` wird verwendet, um das Standardverhalten von 'fork' zu ändern. Nach dem Aufruf sind die Einstellungen in `cluster.settings` vorhanden.

Jegliche Einstellungsänderungen wirken sich nur auf zukünftige Aufrufe von [`.fork()`](/de/nodejs/api/cluster#clusterforkenv) aus und haben keine Auswirkungen auf bereits ausgeführte Worker.

Das einzige Attribut eines Worker, das nicht über `.setupPrimary()` festgelegt werden kann, ist die an [`.fork()`](/de/nodejs/api/cluster#clusterforkenv) übergebene `env`.

Die obigen Standardwerte gelten nur für den ersten Aufruf; die Standardwerte für spätere Aufrufe sind die aktuellen Werte zum Zeitpunkt des Aufrufs von `cluster.setupPrimary()`.



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

Dies kann nur vom primären Prozess aufgerufen werden.

## `cluster.worker` {#clusterworker}

**Hinzugefügt in: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Eine Referenz zum aktuellen Worker-Objekt. Im primären Prozess nicht verfügbar.



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

**Hinzugefügt in: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ein Hash, der die aktiven Worker-Objekte speichert, wobei der Schlüssel das Feld `id` ist. Dies erleichtert das Durchlaufen aller Worker. Es ist nur im primären Prozess verfügbar.

Ein Worker wird aus `cluster.workers` entfernt, nachdem der Worker die Verbindung getrennt *und* beendet hat. Die Reihenfolge zwischen diesen beiden Ereignissen kann nicht im Voraus bestimmt werden. Es ist jedoch garantiert, dass die Entfernung aus der Liste `cluster.workers` vor dem letzten `'disconnect'`- oder `'exit'`-Ereignis erfolgt.

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

