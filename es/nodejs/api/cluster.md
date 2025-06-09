---
title: Documentación de Node.js - Cluster
description: Aprende a usar el módulo de cluster de Node.js para crear procesos hijos que comparten puertos de servidor, mejorando el rendimiento y la escalabilidad de la aplicación.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Cluster | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a usar el módulo de cluster de Node.js para crear procesos hijos que comparten puertos de servidor, mejorando el rendimiento y la escalabilidad de la aplicación.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Cluster | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a usar el módulo de cluster de Node.js para crear procesos hijos que comparten puertos de servidor, mejorando el rendimiento y la escalabilidad de la aplicación.
---


# Cluster {#cluster}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

Se pueden usar clústeres de procesos de Node.js para ejecutar múltiples instancias de Node.js que pueden distribuir las cargas de trabajo entre sus hilos de aplicación. Cuando no se necesita el aislamiento de procesos, use el módulo [`worker_threads`](/es/nodejs/api/worker_threads) en su lugar, que permite ejecutar múltiples hilos de aplicación dentro de una sola instancia de Node.js.

El módulo cluster permite la fácil creación de procesos hijo que comparten todos los puertos del servidor.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primario ${process.pid} está en ejecución`);

  // Bifurca trabajadores.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`trabajador ${worker.process.pid} murió`);
  });
} else {
  // Los trabajadores pueden compartir cualquier conexión TCP
  // En este caso es un servidor HTTP
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hola mundo\n');
  }).listen(8000);

  console.log(`Trabajador ${process.pid} iniciado`);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primario ${process.pid} está en ejecución`);

  // Bifurca trabajadores.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`trabajador ${worker.process.pid} murió`);
  });
} else {
  // Los trabajadores pueden compartir cualquier conexión TCP
  // En este caso es un servidor HTTP
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hola mundo\n');
  }).listen(8000);

  console.log(`Trabajador ${process.pid} iniciado`);
}
```
:::

Ejecutar Node.js ahora compartirá el puerto 8000 entre los trabajadores:

```bash [BASH]
$ node server.js
Primario 3596 está en ejecución
Trabajador 4324 iniciado
Trabajador 4520 iniciado
Trabajador 6056 iniciado
Trabajador 5644 iniciado
```
En Windows, aún no es posible configurar un servidor de tubería con nombre en un trabajador.


## Cómo funciona {#how-it-works}

Los procesos de trabajador se generan utilizando el método [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options), de modo que puedan comunicarse con el proceso primario a través de IPC y pasar los manejadores del servidor de ida y vuelta.

El módulo del clúster admite dos métodos para distribuir las conexiones entrantes.

El primero (y el predeterminado en todas las plataformas excepto Windows) es el enfoque round-robin, donde el proceso primario escucha en un puerto, acepta nuevas conexiones y las distribuye entre los trabajadores de forma round-robin, con cierta inteligencia incorporada para evitar sobrecargar un proceso de trabajador.

El segundo enfoque es donde el proceso primario crea el socket de escucha y lo envía a los trabajadores interesados. Los trabajadores luego aceptan las conexiones entrantes directamente.

El segundo enfoque, en teoría, debería ofrecer el mejor rendimiento. En la práctica, sin embargo, la distribución tiende a ser muy desequilibrada debido a las peculiaridades del programador del sistema operativo. Se han observado cargas en las que más del 70% de todas las conexiones terminaron en solo dos procesos, de un total de ocho.

Debido a que `server.listen()` transfiere la mayor parte del trabajo al proceso primario, existen tres casos en los que el comportamiento entre un proceso normal de Node.js y un trabajador del clúster difiere:

Node.js no proporciona lógica de enrutamiento. Por lo tanto, es importante diseñar una aplicación de tal manera que no dependa demasiado de los objetos de datos en memoria para cosas como sesiones e inicio de sesión.

Debido a que los trabajadores son todos procesos separados, pueden eliminarse o volver a generarse según las necesidades de un programa, sin afectar a otros trabajadores. Siempre que haya algunos trabajadores vivos, el servidor continuará aceptando conexiones. Si no hay trabajadores vivos, las conexiones existentes se descartarán y las nuevas conexiones serán rechazadas. Sin embargo, Node.js no gestiona automáticamente el número de trabajadores. Es responsabilidad de la aplicación gestionar el pool de trabajadores en función de sus propias necesidades.

Aunque un caso de uso principal para el módulo `node:cluster` es la creación de redes, también se puede utilizar para otros casos de uso que requieran procesos de trabajador.


## Clase: `Worker` {#class-worker}

**Agregado en: v0.7.0**

- Extiende: [\<EventEmitter\>](/es/nodejs/api/events#class-eventemitter)

Un objeto `Worker` contiene toda la información pública y los métodos sobre un worker. En el primario se puede obtener usando `cluster.workers`. En un worker se puede obtener usando `cluster.worker`.

### Evento: `'disconnect'` {#event-disconnect}

**Agregado en: v0.7.7**

Similar al evento `cluster.on('disconnect')`, pero específico para este worker.

```js [ESM]
cluster.fork().on('disconnect', () => {
  // Worker se ha desconectado
});
```
### Evento: `'error'` {#event-error}

**Agregado en: v0.7.3**

Este evento es el mismo que el proporcionado por [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options).

Dentro de un worker, `process.on('error')` también se puede utilizar.

### Evento: `'exit'` {#event-exit}

**Agregado en: v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de salida, si salió normalmente.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la señal (por ejemplo, `'SIGHUP'`) que causó que se terminara el proceso.

Similar al evento `cluster.on('exit')`, pero específico para este worker.



::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker fue terminado por la señal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker salió con el código de error: ${code}`);
    } else {
      console.log('¡worker exitoso!');
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
      console.log(`worker fue terminado por la señal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker salió con el código de error: ${code}`);
    } else {
      console.log('¡worker exitoso!');
    }
  });
}
```
:::

### Evento: `'listening'` {#event-listening}

**Agregado en: v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Similar al evento `cluster.on('listening')`, pero específico para este worker.



::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // Worker está escuchando
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // Worker está escuchando
});
```
:::

No se emite en el worker.


### Evento: `'message'` {#event-message}

**Añadido en: v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Similar al evento `'message'` de `cluster`, pero específico para este worker.

Dentro de un worker, también se puede usar `process.on('message')`.

Ver [`process` evento: `'message'`](/es/nodejs/api/process#event-message).

Aquí hay un ejemplo que utiliza el sistema de mensajería. Mantiene un conteo en el proceso primario del número de solicitudes HTTP recibidas por los workers:

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


### Evento: `'online'` {#event-online}

**Agregado en: v0.7.0**

Similar al evento `cluster.on('online')`, pero específico para este worker.

```js [ESM]
cluster.fork().on('online', () => {
  // Worker está online
});
```
No se emite en el worker.

### `worker.disconnect()` {#workerdisconnect}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v7.3.0 | Este método ahora devuelve una referencia a `worker`. |
| v0.7.7 | Agregado en: v0.7.7 |
:::

- Devuelve: [\<cluster.Worker\>](/es/nodejs/api/cluster#class-worker) Una referencia a `worker`.

En un worker, esta función cerrará todos los servidores, esperará el evento `'close'` en esos servidores y luego desconectará el canal IPC.

En el primario, se envía un mensaje interno al worker haciendo que llame a `.disconnect()` sobre sí mismo.

Hace que se establezca `.exitedAfterDisconnect`.

Después de que se cierra un servidor, ya no aceptará nuevas conexiones, pero las conexiones pueden ser aceptadas por cualquier otro worker en escucha. Las conexiones existentes podrán cerrarse como de costumbre. Cuando ya no existan más conexiones, vea [`server.close()`](/es/nodejs/api/net#event-close), el canal IPC al worker se cerrará permitiéndole morir con elegancia.

Lo anterior se aplica *solo* a las conexiones del servidor, las conexiones del cliente no se cierran automáticamente por los workers, y disconnect no espera a que se cierren antes de salir.

En un worker, `process.disconnect` existe, pero no es esta función; es [`disconnect()`](/es/nodejs/api/child_process#subprocessdisconnect).

Debido a que las conexiones del servidor de larga duración pueden impedir que los workers se desconecten, puede ser útil enviar un mensaje, para que se puedan tomar acciones específicas de la aplicación para cerrarlas. También puede ser útil implementar un tiempo de espera, matando a un worker si el evento `'disconnect'` no se ha emitido después de algún tiempo.

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
    // Las conexiones nunca terminan
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Iniciar el cierre elegante de cualquier conexión al servidor
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**Agregado en: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propiedad es `true` si el worker salió debido a `.disconnect()`. Si el worker salió de cualquier otra forma, es `false`. Si el worker no ha salido, es `undefined`.

El booleano [`worker.exitedAfterDisconnect`](/es/nodejs/api/cluster#workerexitedafterdisconnect) permite distinguir entre salida voluntaria y accidental, el primario puede optar por no volver a generar un worker basándose en este valor.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('Oh, fue solo voluntario – no hay necesidad de preocuparse');
  }
});

// kill worker
worker.kill();
```
### `worker.id` {#workerid}

**Agregado en: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A cada nuevo worker se le da su propia ID única, esta ID se almacena en el `id`.

Mientras un worker está vivo, esta es la clave que lo indexa en `cluster.workers`.

### `worker.isConnected()` {#workerisconnected}

**Agregado en: v0.11.14**

Esta función devuelve `true` si el worker está conectado a su primario a través de su canal IPC, `false` en caso contrario. Un worker se conecta a su primario después de haber sido creado. Se desconecta después de que se emite el evento `'disconnect'`.

### `worker.isDead()` {#workerisdead}

**Agregado en: v0.11.14**

Esta función devuelve `true` si el proceso del worker ha terminado (ya sea por salida o por señalización). De lo contrario, devuelve `false`.



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

**Agregada en: v0.9.12**

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la señal de terminación para enviar al proceso del worker. **Predeterminado:** `'SIGTERM'`

Esta función terminará el worker. En el worker primario, lo hace desconectando el `worker.process` y, una vez desconectado, terminando con `signal`. En el worker, lo hace terminando el proceso con `signal`.

La función `kill()` termina el proceso del worker sin esperar una desconexión correcta, tiene el mismo comportamiento que `worker.process.kill()`.

Este método tiene un alias como `worker.destroy()` por compatibilidad con versiones anteriores.

En un worker, `process.kill()` existe, pero no es esta función; es [`kill()`](/es/nodejs/api/process#processkillpid-signal).

### `worker.process` {#workerprocess}

**Agregada en: v0.7.0**

- [\<ChildProcess\>](/es/nodejs/api/child_process#class-childprocess)

Todos los workers se crean utilizando [`child_process.fork()`](/es/nodejs/api/child_process#child_processforkmodulepath-args-options), el objeto devuelto por esta función se almacena como `.process`. En un worker, se almacena el `process` global.

Ver: [Módulo de Proceso Hijo](/es/nodejs/api/child_process#child_processforkmodulepath-args-options).

Los workers llamarán a `process.exit(0)` si el evento `'disconnect'` ocurre en `process` y `.exitedAfterDisconnect` no es `true`. Esto protege contra la desconexión accidental.

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v4.0.0 | El parámetro `callback` ahora es compatible. |
| v0.7.0 | Agregada en: v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/es/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El argumento `options`, si está presente, es un objeto utilizado para parametrizar el envío de ciertos tipos de manejadores. `options` admite las siguientes propiedades:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un valor que se puede utilizar al pasar instancias de `net.Socket`. Cuando es `true`, el socket se mantiene abierto en el proceso de envío. **Predeterminado:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envía un mensaje a un worker o primario, opcionalmente con un manejador.

En el primario, esto envía un mensaje a un worker específico. Es idéntico a [`ChildProcess.send()`](/es/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

En un worker, esto envía un mensaje al primario. Es idéntico a `process.send()`.

Este ejemplo hará eco de todos los mensajes del primario:

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

**Agregado en: v0.7.9**

- `worker` [\<cluster.Worker\>](/es/nodejs/api/cluster#class-worker)

Emitido después de que el canal IPC del worker se ha desconectado. Esto puede ocurrir cuando un worker sale de manera correcta, es eliminado o se desconecta manualmente (como con `worker.disconnect()`).

Puede haber un retraso entre los eventos `'disconnect'` y `'exit'`. Estos eventos se pueden usar para detectar si el proceso está atascado en una limpieza o si hay conexiones de larga duración.

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`El worker #${worker.id} se ha desconectado`);
});
```
## Evento: `'exit'` {#event-exit_1}

**Agregado en: v0.7.9**

- `worker` [\<cluster.Worker\>](/es/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El código de salida, si salió normalmente.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la señal (p. ej. `'SIGHUP'`) que causó la eliminación del proceso.

Cuando cualquiera de los workers muere, el módulo del clúster emitirá el evento `'exit'`.

Esto se puede usar para reiniciar el worker llamando a [`.fork()`](/es/nodejs/api/cluster#clusterforkenv) nuevamente.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d murió (%s). reiniciando...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
Ver [`child_process` evento: `'exit'`](/es/nodejs/api/child_process#event-exit).

## Evento: `'fork'` {#event-fork}

**Agregado en: v0.7.0**

- `worker` [\<cluster.Worker\>](/es/nodejs/api/cluster#class-worker)

Cuando se bifurca un nuevo worker, el módulo del clúster emitirá un evento `'fork'`. Esto se puede usar para registrar la actividad del worker y crear un tiempo de espera personalizado.

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('Algo debe estar mal con la conexión...');
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

**Añadido en: v0.7.0**

- `worker` [\<cluster.Worker\>](/es/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Después de llamar a `listen()` desde un worker, cuando el evento `'listening'` se emite en el servidor, un evento `'listening'` también se emitirá en `cluster` en el primario.

El manejador de eventos se ejecuta con dos argumentos, el `worker` contiene el objeto worker y el objeto `address` contiene las siguientes propiedades de conexión: `address`, `port` y `addressType`. Esto es muy útil si el worker está escuchando en más de una dirección.

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `Un worker ahora está conectado a ${address.address}:${address.port}`);
});
```
El `addressType` es uno de:

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (Socket de dominio Unix)
- `'udp4'` o `'udp6'` (UDPv4 o UDPv6)

## Evento: `'message'` {#event-message_1}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | El parámetro `worker` se pasa ahora; consulte abajo para obtener detalles. |
| v2.5.0 | Añadido en: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/es/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emitido cuando el primario del clúster recibe un mensaje de cualquier worker.

Véase [`child_process` event: `'message'`](/es/nodejs/api/child_process#event-message).

## Evento: `'online'` {#event-online_1}

**Añadido en: v0.7.0**

- `worker` [\<cluster.Worker\>](/es/nodejs/api/cluster#class-worker)

Después de bifurcar un nuevo worker, el worker debe responder con un mensaje online. Cuando el primario recibe un mensaje online, emitirá este evento. La diferencia entre `'fork'` y `'online'` es que fork se emite cuando el primario bifurca un worker, y `'online'` se emite cuando el worker se está ejecutando.

```js [ESM]
cluster.on('online', (worker) => {
  console.log('¡Sí, el worker respondió después de ser bifurcado!');
});
```

## Evento: `'setup'` {#event-setup}

**Añadido en: v0.7.1**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emitido cada vez que se llama a [`.setupPrimary()`](/es/nodejs/api/cluster#clustersetupprimarysettings).

El objeto `settings` es el objeto `cluster.settings` en el momento en que se llamó a [`.setupPrimary()`](/es/nodejs/api/cluster#clustersetupprimarysettings) y es solo informativo, ya que se pueden realizar varias llamadas a [`.setupPrimary()`](/es/nodejs/api/cluster#clustersetupprimarysettings) en un solo tick.

Si la precisión es importante, utilice `cluster.settings`.

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**Añadido en: v0.7.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se llama cuando todos los trabajadores están desconectados y los manejadores están cerrados.

Llama a `.disconnect()` en cada trabajador en `cluster.workers`.

Cuando se desconectan, todos los manejadores internos se cerrarán, lo que permitirá que el proceso primario muera con gracia si no hay otro evento esperando.

El método toma un argumento de callback opcional que se llamará cuando termine.

Esto solo se puede llamar desde el proceso primario.

## `cluster.fork([env])` {#clusterforkenv}

**Añadido en: v0.6.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares clave/valor para agregar al entorno del proceso de trabajador.
- Devuelve: [\<cluster.Worker\>](/es/nodejs/api/cluster#class-worker)

Genera un nuevo proceso de trabajador.

Esto solo se puede llamar desde el proceso primario.

## `cluster.isMaster` {#clusterismaster}

**Añadido en: v0.8.1**

**Obsoleto desde: v16.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

Alias obsoleto para [`cluster.isPrimary`](/es/nodejs/api/cluster#clusterisprimary).

## `cluster.isPrimary` {#clusterisprimary}

**Añadido en: v16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verdadero si el proceso es primario. Esto está determinado por `process.env.NODE_UNIQUE_ID`. Si `process.env.NODE_UNIQUE_ID` no está definido, entonces `isPrimary` es `true`.


## `cluster.isWorker` {#clusterisworker}

**Añadido en: v0.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verdadero si el proceso no es primario (es la negación de `cluster.isPrimary`).

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**Añadido en: v0.11.2**

La política de programación, ya sea `cluster.SCHED_RR` para round-robin o `cluster.SCHED_NONE` para dejarlo al sistema operativo. Esta es una configuración global y se congela una vez que se genera el primer worker o se llama a [`.setupPrimary()`](/es/nodejs/api/cluster#clustersetupprimarysettings), lo que ocurra primero.

`SCHED_RR` es el valor predeterminado en todos los sistemas operativos, excepto Windows. Windows cambiará a `SCHED_RR` una vez que libuv pueda distribuir eficazmente los manejadores IOCP sin incurrir en un gran impacto en el rendimiento.

`cluster.schedulingPolicy` también se puede configurar a través de la variable de entorno `NODE_CLUSTER_SCHED_POLICY`. Los valores válidos son `'rr'` y `'none'`.

## `cluster.settings` {#clustersettings}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.2.0, v12.16.0 | La opción `serialization` ahora es compatible. |
| v9.5.0 | La opción `cwd` ahora es compatible. |
| v9.4.0 | La opción `windowsHide` ahora es compatible. |
| v8.2.0 | La opción `inspectPort` ahora es compatible. |
| v6.4.0 | La opción `stdio` ahora es compatible. |
| v0.7.1 | Añadido en: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de cadena pasados al ejecutable de Node.js. **Predeterminado:** `process.execArgv`.
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ruta de archivo al archivo de worker. **Predeterminado:** `process.argv[1]`.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Argumentos de cadena pasados al worker. **Predeterminado:** `process.argv.slice(2)`.
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Directorio de trabajo actual del proceso de worker. **Predeterminado:** `undefined` (hereda del proceso padre).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica el tipo de serialización utilizado para enviar mensajes entre procesos. Los valores posibles son `'json'` y `'advanced'`. Consulte [Serialización avanzada para `child_process`](/es/nodejs/api/child_process#advanced-serialization) para obtener más detalles. **Predeterminado:** `false`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si se debe o no enviar la salida al stdio del padre. **Predeterminado:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configura el stdio de los procesos bifurcados. Debido a que el módulo cluster depende de IPC para funcionar, esta configuración debe contener una entrada `'ipc'`. Cuando se proporciona esta opción, anula `silent`. Consulte [`child_process.spawn()`](/es/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/es/nodejs/api/child_process#optionsstdio).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del usuario del proceso. (Consulte [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Establece la identidad del grupo del proceso. (Consulte [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Establece el puerto del inspector del worker. Esto puede ser un número o una función que no toma argumentos y devuelve un número. De forma predeterminada, cada worker obtiene su propio puerto, incrementado desde el `process.debugPort` del primario.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta la ventana de consola de los procesos bifurcados que normalmente se crearía en los sistemas Windows. **Predeterminado:** `false`.
  
 

Después de llamar a [`.setupPrimary()`](/es/nodejs/api/cluster#clustersetupprimarysettings) (o [`.fork()`](/es/nodejs/api/cluster#clusterforkenv)) este objeto de configuración contendrá la configuración, incluidos los valores predeterminados.

No se pretende que este objeto se cambie o se configure manualmente.


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v16.0.0 | Obsoleto desde: v16.0.0 |
| v6.4.0 | La opción `stdio` ahora es compatible. |
| v0.7.1 | Añadido en: v0.7.1 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

Alias obsoleto para [`.setupPrimary()`](/es/nodejs/api/cluster#clustersetupprimarysettings).

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**Añadido en: v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ver [`cluster.settings`](/es/nodejs/api/cluster#clustersettings).

`setupPrimary` se utiliza para cambiar el comportamiento 'fork' predeterminado. Una vez llamado, la configuración estará presente en `cluster.settings`.

Cualquier cambio en la configuración solo afecta a las futuras llamadas a [`.fork()`](/es/nodejs/api/cluster#clusterforkenv) y no tiene ningún efecto en los workers que ya están en ejecución.

El único atributo de un worker que no se puede establecer a través de `.setupPrimary()` es el `env` pasado a [`.fork()`](/es/nodejs/api/cluster#clusterforkenv).

Los valores predeterminados anteriores se aplican solo a la primera llamada; los valores predeterminados para las llamadas posteriores son los valores actuales en el momento en que se llama a `cluster.setupPrimary()`.



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

Esto solo se puede llamar desde el proceso primario.

## `cluster.worker` {#clusterworker}

**Añadido en: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Una referencia al objeto worker actual. No disponible en el proceso primario.



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

**Añadido en: v0.7.0**

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un hash que almacena los objetos worker activos, indexados por el campo `id`. Esto facilita la iteración a través de todos los workers. Solo está disponible en el proceso primario.

Un worker se elimina de `cluster.workers` después de que el worker se haya desconectado *y* haya salido. El orden entre estos dos eventos no se puede determinar de antemano. Sin embargo, se garantiza que la eliminación de la lista `cluster.workers` ocurre antes de que se emita el último evento `'disconnect'` o `'exit'`.

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
  worker.send('gran anuncio a todos los workers');
}
```
:::

