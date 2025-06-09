---
title: Документация Node.js - Кластер
description: Узнайте, как использовать модуль кластера Node.js для создания дочерних процессов, которые делят порты сервера, улучшая производительность и масштабируемость приложения.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Кластер | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как использовать модуль кластера Node.js для создания дочерних процессов, которые делят порты сервера, улучшая производительность и масштабируемость приложения.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Кластер | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как использовать модуль кластера Node.js для создания дочерних процессов, которые делят порты сервера, улучшая производительность и масштабируемость приложения.
---


# Кластер {#cluster}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

Кластеры процессов Node.js можно использовать для запуска нескольких экземпляров Node.js, которые могут распределять рабочую нагрузку между потоками своих приложений. Если изоляция процессов не требуется, вместо этого используйте модуль [`worker_threads`](/ru/nodejs/api/worker_threads), который позволяет запускать несколько потоков приложений в одном экземпляре Node.js.

Модуль cluster позволяет легко создавать дочерние процессы, которые совместно используют порты сервера.

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

Теперь запущенный Node.js будет совместно использовать порт 8000 между работниками:

```bash [BASH]
$ node server.js
Primary 3596 is running
Worker 4324 started
Worker 4520 started
Worker 6056 started
Worker 5644 started
```
В Windows пока невозможно настроить именованный канал сервера в воркере.


## Как это работает {#how-it-works}

Рабочие процессы порождаются с использованием метода [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options), чтобы они могли общаться с родительским процессом через IPC и передавать серверные дескрипторы туда и обратно.

Модуль cluster поддерживает два метода распределения входящих соединений.

Первый (и используемый по умолчанию на всех платформах, кроме Windows) — это подход round-robin, когда основной процесс прослушивает порт, принимает новые соединения и распределяет их между рабочими процессами по принципу round-robin, с некоторой встроенной логикой, позволяющей избежать перегрузки рабочего процесса.

Второй подход заключается в том, что основной процесс создает сокет прослушивания и отправляет его заинтересованным рабочим процессам. Затем рабочие процессы принимают входящие соединения напрямую.

Второй подход, теоретически, должен обеспечивать наилучшую производительность. Однако на практике распределение часто бывает очень несбалансированным из-за особенностей планировщика операционной системы. Были замечены нагрузки, при которых более 70% всех соединений оказывались всего в двух процессах из общего числа в восемь.

Поскольку `server.listen()` передает большую часть работы основному процессу, существуют три случая, когда поведение обычного процесса Node.js и рабочего процесса cluster различается:

Node.js не предоставляет логику маршрутизации. Поэтому важно спроектировать приложение таким образом, чтобы оно не слишком сильно зависело от объектов данных в памяти для таких вещей, как сеансы и вход в систему.

Поскольку рабочие процессы являются отдельными процессами, они могут быть завершены или перезапущены в зависимости от потребностей программы, не затрагивая другие рабочие процессы. Пока есть живые рабочие процессы, сервер продолжит принимать соединения. Если нет живых рабочих процессов, существующие соединения будут разорваны, а новые соединения будут отклонены. Node.js не управляет автоматически количеством рабочих процессов. Ответственность за управление пулом рабочих процессов лежит на приложении, исходя из его собственных потребностей.

Хотя основным вариантом использования модуля `node:cluster` является работа с сетью, его также можно использовать для других случаев, требующих рабочих процессов.


## Class: `Worker` {#class-worker}

**Added in: v0.7.0**

- Extends: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Объект `Worker` содержит всю публичную информацию и методы о worker-е. В основном его можно получить с помощью `cluster.workers`. В worker-е его можно получить с помощью `cluster.worker`.

### Event: `'disconnect'` {#event-disconnect}

**Added in: v0.7.7**

Аналогично событию `cluster.on('disconnect')`, но специфично для этого worker-а.

```js [ESM]
cluster.fork().on('disconnect', () => {
  // Worker has disconnected
});
```
### Event: `'error'` {#event-error}

**Added in: v0.7.3**

Это событие такое же, как и событие, предоставляемое [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options).

Внутри worker-а также можно использовать `process.on('error')`.

### Event: `'exit'` {#event-exit}

**Added in: v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код выхода, если выход был нормальным.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя сигнала (например, `'SIGHUP'`), который вызвал завершение процесса.

Аналогично событию `cluster.on('exit')`, но специфично для этого worker-а.



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

### Event: `'listening'` {#event-listening}

**Added in: v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Аналогично событию `cluster.on('listening')`, но специфично для этого worker-а.



::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // Worker is listening
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // Worker is listening
});
```
:::

Он не испускается в worker-е.


### Событие: `'message'` {#event-message}

**Добавлено в версии: v0.7.0**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Аналогично событию `'message'` в `cluster`, но специфично для этого рабочего процесса.

Внутри рабочего процесса также можно использовать `process.on('message')`.

См. [`process` event: `'message'`](/ru/nodejs/api/process#event-message).

Вот пример использования системы обмена сообщениями. Он ведет подсчет в основном процессе количества HTTP-запросов, полученных рабочими процессами:

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


### Событие: `'online'` {#event-online}

**Добавлено в: v0.7.0**

Аналогично событию `cluster.on('online')`, но специфично для этого воркера.

```js [ESM]
cluster.fork().on('online', () => {
  // Воркер в сети
});
```
Оно не генерируется в воркере.

### `worker.disconnect()` {#workerdisconnect}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.3.0 | Этот метод теперь возвращает ссылку на `worker`. |
| v0.7.7 | Добавлено в: v0.7.7 |
:::

- Возвращает: [\<cluster.Worker\>](/ru/nodejs/api/cluster#class-worker) Ссылка на `worker`.

В воркере эта функция закроет все серверы, дождется события `'close'` на этих серверах, а затем отключит IPC-канал.

В основном процессе внутреннее сообщение отправляется воркеру, заставляя его вызвать `.disconnect()` на себе.

Приводит к установке `.exitedAfterDisconnect`.

После закрытия сервера он больше не будет принимать новые соединения, но соединения могут быть приняты любым другим прослушивающим воркером. Существующим соединениям будет разрешено закрыться как обычно. Когда больше не существует соединений, см. [`server.close()`](/ru/nodejs/api/net#event-close), IPC-канал к воркеру закроется, позволяя ему корректно завершить работу.

Вышесказанное относится *только* к серверным соединениям, клиентские соединения автоматически не закрываются воркерами, и disconnect не ждет их закрытия перед выходом.

В воркере существует `process.disconnect`, но это не эта функция; это [`disconnect()`](/ru/nodejs/api/child_process#subprocessdisconnect).

Поскольку долгоживущие серверные соединения могут блокировать отключение воркеров, может быть полезно отправить сообщение, чтобы можно было предпринять специфичные для приложения действия для их закрытия. Также может быть полезно реализовать тайм-аут, убивающий воркер, если событие `'disconnect'` не было сгенерировано через некоторое время.

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
    // Соединения никогда не заканчиваются
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Инициировать корректное закрытие любых соединений с сервером
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**Добавлено в: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Это свойство имеет значение `true`, если worker завершил работу из-за `.disconnect()`. Если worker завершил работу любым другим способом, то оно имеет значение `false`. Если worker не завершил работу, то оно имеет значение `undefined`.

Логическое значение [`worker.exitedAfterDisconnect`](/ru/nodejs/api/cluster#workerexitedafterdisconnect) позволяет различать добровольный и случайный выход, primary может решить не перезапускать worker на основе этого значения.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('Oh, it was just voluntary – no need to worry');
  }
});

// kill worker
worker.kill();
```
### `worker.id` {#workerid}

**Добавлено в: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Каждому новому worker присваивается свой уникальный идентификатор, который хранится в `id`.

Пока worker жив, это ключ, который индексирует его в `cluster.workers`.

### `worker.isConnected()` {#workerisconnected}

**Добавлено в: v0.11.14**

Эта функция возвращает `true`, если worker подключен к своему primary через свой IPC канал, и `false` в противном случае. Worker подключен к своему primary после того, как он был создан. Он отключается после того, как было сгенерировано событие `'disconnect'`.

### `worker.isDead()` {#workerisdead}

**Добавлено в: v0.11.14**

Эта функция возвращает `true`, если процесс worker завершился (либо из-за выхода, либо из-за получения сигнала). В противном случае она возвращает `false`.

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

**Добавлено в: v0.9.12**

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя сигнала завершения, который будет отправлен рабочему процессу. **По умолчанию:** `'SIGTERM'`

Эта функция завершит работу воркера. В основном воркере она делает это, отключая `worker.process` и, после отключения, завершая работу с помощью `signal`. В воркере она делает это, завершая процесс с помощью `signal`.

Функция `kill()` завершает рабочий процесс, не дожидаясь корректного отключения, она имеет такое же поведение, как и `worker.process.kill()`.

Этот метод имеет псевдоним `worker.destroy()` для обратной совместимости.

В воркере `process.kill()` существует, но это не эта функция; это [`kill()`](/ru/nodejs/api/process#processkillpid-signal).

### `worker.process` {#workerprocess}

**Добавлено в: v0.7.0**

- [\<ChildProcess\>](/ru/nodejs/api/child_process#class-childprocess)

Все воркеры создаются с использованием [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options), возвращаемый объект этой функции хранится как `.process`. В воркере хранится глобальный `process`.

См.: [Модуль Child Process](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options).

Воркеры вызовут `process.exit(0)`, если событие `'disconnect'` произойдет на `process` и `.exitedAfterDisconnect` не будет `true`. Это защищает от случайного отключения.

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v4.0.0 | Теперь поддерживается параметр `callback`. |
| v0.7.0 | Добавлено в: v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/ru/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Аргумент `options`, если присутствует, является объектом, используемым для параметризации отправки определенных типов дескрипторов. `options` поддерживает следующие свойства:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Значение, которое можно использовать при передаче экземпляров `net.Socket`. Если `true`, сокет остается открытым в отправляющем процессе. **По умолчанию:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Отправляет сообщение воркеру или основному процессу, опционально с дескриптором.

В основном процессе это отправляет сообщение конкретному воркеру. Это идентично [`ChildProcess.send()`](/ru/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

В воркере это отправляет сообщение основному процессу. Это идентично `process.send()`.

Этот пример будет возвращать все сообщения от основного процесса:

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

## Событие: `'disconnect'` {#event-disconnect_1}

**Добавлено в: v0.7.9**

- `worker` [\<cluster.Worker\>](/ru/nodejs/api/cluster#class-worker)

Генерируется после того, как IPC-канал рабочего процесса был отключен. Это может произойти, когда рабочий процесс завершает работу корректно, убит или отключен вручную (например, с помощью `worker.disconnect()`).

Между событиями `'disconnect'` и `'exit'` может быть задержка. Эти события можно использовать для определения того, завис ли процесс в очистке или есть долгоживущие соединения.

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`Рабочий процесс #${worker.id} отключен`);
});
```
## Событие: `'exit'` {#event-exit_1}

**Добавлено в: v0.7.9**

- `worker` [\<cluster.Worker\>](/ru/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код выхода, если он вышел нормально.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя сигнала (например, `'SIGHUP'`), который вызвал завершение процесса.

Когда любой из рабочих процессов умирает, модуль cluster сгенерирует событие `'exit'`.

Это можно использовать для перезапуска рабочего процесса, снова вызвав [`.fork()`](/ru/nodejs/api/cluster#clusterforkenv).

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('рабочий %d умер (%s). перезапуск...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
См. [`child_process` event: `'exit'`](/ru/nodejs/api/child_process#event-exit).

## Событие: `'fork'` {#event-fork}

**Добавлено в: v0.7.0**

- `worker` [\<cluster.Worker\>](/ru/nodejs/api/cluster#class-worker)

Когда создается новый рабочий процесс, модуль cluster генерирует событие `'fork'`. Это можно использовать для регистрации активности рабочего процесса и создания пользовательского тайм-аута.

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('Что-то не так с соединением ...');
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

## Событие: `'listening'` {#event-listening_1}

**Добавлено в версии: v0.7.0**

- `worker` [\<cluster.Worker\>](/ru/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

После вызова `listen()` из воркера, когда событие `'listening'` испускается на сервере, событие `'listening'` также будет испущено в `cluster` в основном процессе.

Обработчик события выполняется с двумя аргументами: `worker` содержит объект воркера, а объект `address` содержит следующие свойства соединения: `address`, `port` и `addressType`. Это очень полезно, если воркер прослушивает более одного адреса.

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `Воркер теперь подключен к ${address.address}:${address.port}`);
});
```
`addressType` может быть одним из следующих значений:

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (Unix domain socket)
- `'udp4'` или `'udp6'` (UDPv4 или UDPv6)

## Событие: `'message'` {#event-message_1}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Теперь передается параметр `worker`; подробности см. ниже. |
| v2.5.0 | Добавлено в версии: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/ru/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Испускается, когда основной процесс кластера получает сообщение от любого воркера.

См. [`child_process` event: `'message'`](/ru/nodejs/api/child_process#event-message).

## Событие: `'online'` {#event-online_1}

**Добавлено в версии: v0.7.0**

- `worker` [\<cluster.Worker\>](/ru/nodejs/api/cluster#class-worker)

После создания нового воркера (forking), воркер должен ответить сообщением о готовности (online message). Когда основной процесс получает сообщение о готовности, он испустит это событие. Разница между `'fork'` и `'online'` заключается в том, что fork испускается, когда основной процесс создает воркер, а `'online'` испускается, когда воркер работает.

```js [ESM]
cluster.on('online', (worker) => {
  console.log('Ура, воркер ответил после создания');
});
```

## Событие: `'setup'` {#event-setup}

**Добавлено в версии: v0.7.1**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Генерируется каждый раз, когда вызывается [`.setupPrimary()`](/ru/nodejs/api/cluster#clustersetupprimarysettings).

Объект `settings` является объектом `cluster.settings` во время вызова [`.setupPrimary()`](/ru/nodejs/api/cluster#clustersetupprimarysettings) и носит исключительно информативный характер, поскольку несколько вызовов [`.setupPrimary()`](/ru/nodejs/api/cluster#clustersetupprimarysettings) могут быть сделаны за один тик.

Если важна точность, используйте `cluster.settings`.

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**Добавлено в версии: v0.7.7**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается, когда все рабочие процессы отключены и дескрипторы закрыты.

Вызывает `.disconnect()` для каждого рабочего процесса в `cluster.workers`.

Когда они отключены, все внутренние дескрипторы будут закрыты, что позволит основному процессу завершиться корректно, если не ожидается другое событие.

Метод принимает необязательный аргумент обратного вызова, который будет вызван по завершении.

Этот метод можно вызвать только из основного процесса.

## `cluster.fork([env])` {#clusterforkenv}

**Добавлено в версии: v0.6.0**

- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Пары ключ/значение для добавления в среду рабочего процесса.
- Возвращает: [\<cluster.Worker\>](/ru/nodejs/api/cluster#class-worker)

Запускает новый рабочий процесс.

Этот метод можно вызвать только из основного процесса.

## `cluster.isMaster` {#clusterismaster}

**Добавлено в версии: v0.8.1**

**Устарело с версии: v16.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Устарело
:::

Устаревший псевдоним для [`cluster.isPrimary`](/ru/nodejs/api/cluster#clusterisprimary).

## `cluster.isPrimary` {#clusterisprimary}

**Добавлено в версии: v16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

True, если процесс является основным. Это определяется `process.env.NODE_UNIQUE_ID`. Если `process.env.NODE_UNIQUE_ID` не определен, то `isPrimary` имеет значение `true`.


## `cluster.isWorker` {#clusterisworker}

**Added in: v0.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

True, если процесс не является основным (является отрицанием `cluster.isPrimary`).

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**Added in: v0.11.2**

Политика планирования, либо `cluster.SCHED_RR` для round-robin, либо `cluster.SCHED_NONE`, чтобы оставить ее операционной системе. Это глобальная настройка, которая фактически замораживается, как только порождается первый рабочий процесс или вызывается [`.setupPrimary()`](/ru/nodejs/api/cluster#clustersetupprimarysettings), в зависимости от того, что произойдет раньше.

`SCHED_RR` является значением по умолчанию во всех операционных системах, кроме Windows. Windows переключится на `SCHED_RR`, как только libuv сможет эффективно распределять дескрипторы IOCP без значительного снижения производительности.

`cluster.schedulingPolicy` также можно установить через переменную окружения `NODE_CLUSTER_SCHED_POLICY`. Допустимые значения: `'rr'` и `'none'`.

## `cluster.settings` {#clustersettings}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.2.0, v12.16.0 | Теперь поддерживается опция `serialization`. |
| v9.5.0 | Теперь поддерживается опция `cwd`. |
| v9.4.0 | Теперь поддерживается опция `windowsHide`. |
| v8.2.0 | Теперь поддерживается опция `inspectPort`. |
| v6.4.0 | Теперь поддерживается опция `stdio`. |
| v0.7.1 | Added in: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список строковых аргументов, передаваемых исполняемому файлу Node.js. **По умолчанию:** `process.execArgv`.
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь к файлу рабочего процесса. **По умолчанию:** `process.argv[1]`.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строковые аргументы, передаваемые рабочему процессу. **По умолчанию:** `process.argv.slice(2)`.
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Текущий рабочий каталог рабочего процесса. **По умолчанию:** `undefined` (унаследовано от родительского процесса).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Укажите тип сериализации, используемый для отправки сообщений между процессами. Возможные значения: `'json'` и `'advanced'`. Смотрите [Advanced serialization for `child_process`](/ru/nodejs/api/child_process#advanced-serialization) для получения дополнительной информации. **По умолчанию:** `false`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Отправлять или нет вывод на stdio родительского процесса. **По умолчанию:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Конфигурирует stdio для порожденных процессов. Поскольку модуль cluster зависит от IPC для работы, эта конфигурация должна содержать запись `'ipc'`. Если этот параметр указан, он переопределяет `silent`. Смотрите [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/ru/nodejs/api/child_process#optionsstdio).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор пользователя процесса. (Смотрите [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор группы процесса. (Смотрите [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Устанавливает порт инспектора рабочего процесса. Это может быть число или функция, которая не принимает аргументов и возвращает число. По умолчанию каждый рабочий процесс получает свой собственный порт, увеличивающийся от `process.debugPort` основного процесса.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Скрыть консольное окно порожденного процесса, которое обычно создается в системах Windows. **По умолчанию:** `false`.
  
 

После вызова [`.setupPrimary()`](/ru/nodejs/api/cluster#clustersetupprimarysettings) (или [`.fork()`](/ru/nodejs/api/cluster#clusterforkenv)) этот объект настроек будет содержать настройки, включая значения по умолчанию.

Этот объект не предназначен для изменения или установки вручную.


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Устарело с версии: v16.0.0 |
| v6.4.0 | Теперь поддерживается опция `stdio`. |
| v0.7.1 | Добавлено в: v0.7.1 |
:::

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело
:::

Устаревший псевдоним для [`.setupPrimary()`](/ru/nodejs/api/cluster#clustersetupprimarysettings).

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**Добавлено в: v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) См. [`cluster.settings`](/ru/nodejs/api/cluster#clustersettings).

`setupPrimary` используется для изменения поведения 'fork' по умолчанию. После вызова настройки будут присутствовать в `cluster.settings`.

Любые изменения настроек влияют только на будущие вызовы [`.fork()`](/ru/nodejs/api/cluster#clusterforkenv) и не влияют на уже работающие воркеры.

Единственным атрибутом воркера, который нельзя установить через `.setupPrimary()`, является `env`, передаваемый в [`.fork()`](/ru/nodejs/api/cluster#clusterforkenv).

Приведенные выше значения по умолчанию применяются только к первому вызову; значения по умолчанию для последующих вызовов - это текущие значения на момент вызова `cluster.setupPrimary()`.



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

Это можно вызвать только из основного процесса.

## `cluster.worker` {#clusterworker}

**Добавлено в: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ссылка на текущий объект воркера. Недоступно в основном процессе.



::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  console.log('Я основной');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`Я воркер #${cluster.worker.id}`);
}
```

```js [CJS]
const cluster = require('node:cluster');

if (cluster.isPrimary) {
  console.log('Я основной');
  cluster.fork();
  cluster.fork();
} else if (cluster.isWorker) {
  console.log(`Я воркер #${cluster.worker.id}`);
}
```
:::


## `cluster.workers` {#clusterworkers}

**Добавлено в: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Хеш, который хранит активные объекты-рабочие, индексированные по полю `id`. Это упрощает перебор всех рабочих. Доступен только в основном процессе.

Рабочий удаляется из `cluster.workers` после того, как рабочий отключился *и* завершил работу. Порядок между этими двумя событиями нельзя определить заранее. Однако гарантируется, что удаление из списка `cluster.workers` произойдет до последнего события `'disconnect'` или `'exit'`.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('большое объявление для всех рабочих');
}
```

```js [CJS]
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('большое объявление для всех рабочих');
}
```
:::

