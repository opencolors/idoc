---
title: Documentação do Node.js - Cluster
description: Aprenda como usar o módulo de cluster do Node.js para criar processos filhos que compartilham portas de servidor, aumentando o desempenho e a escalabilidade da aplicação.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Cluster | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda como usar o módulo de cluster do Node.js para criar processos filhos que compartilham portas de servidor, aumentando o desempenho e a escalabilidade da aplicação.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Cluster | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda como usar o módulo de cluster do Node.js para criar processos filhos que compartilham portas de servidor, aumentando o desempenho e a escalabilidade da aplicação.
---


# Cluster {#cluster}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/cluster.js](https://github.com/nodejs/node/blob/v23.5.0/lib/cluster.js)

Clusters de processos Node.js podem ser usados para executar múltiplas instâncias de Node.js que podem distribuir cargas de trabalho entre seus threads de aplicação. Quando o isolamento de processos não é necessário, use o módulo [`worker_threads`](/pt/nodejs/api/worker_threads) em vez disso, o que permite executar múltiplos threads de aplicação dentro de uma única instância do Node.js.

O módulo cluster permite a criação fácil de processos filhos que compartilham todas as portas do servidor.

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`Primário ${process.pid} está rodando`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} morreu`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} iniciado`);
}
```

```js [CJS]
const cluster = require('node:cluster');
const http = require('node:http');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');

if (cluster.isPrimary) {
  console.log(`Primário ${process.pid} está rodando`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} morreu`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} iniciado`);
}
```
:::

Executar o Node.js agora compartilhará a porta 8000 entre os workers:

```bash [BASH]
$ node server.js
Primário 3596 está rodando
Worker 4324 iniciado
Worker 4520 iniciado
Worker 6056 iniciado
Worker 5644 iniciado
```
No Windows, ainda não é possível configurar um servidor de pipe nomeado em um worker.


## Como funciona {#how-it-works}

Os processos de trabalho são gerados usando o método [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options), para que possam se comunicar com o processo principal via IPC e passar os handles do servidor de um lado para o outro.

O módulo cluster suporta dois métodos de distribuição de conexões de entrada.

O primeiro (e o padrão em todas as plataformas, exceto Windows) é a abordagem round-robin, onde o processo primário escuta em uma porta, aceita novas conexões e as distribui entre os trabalhadores de forma round-robin, com alguma inteligência integrada para evitar sobrecarregar um processo de trabalho.

A segunda abordagem é onde o processo primário cria o socket de escuta e o envia para os trabalhadores interessados. Os trabalhadores então aceitam conexões de entrada diretamente.

A segunda abordagem, em teoria, deve dar o melhor desempenho. Na prática, no entanto, a distribuição tende a ser muito desequilibrada devido às idiossincrasias do agendador do sistema operacional. Foram observadas cargas onde mais de 70% de todas as conexões acabaram em apenas dois processos, de um total de oito.

Como `server.listen()` entrega a maior parte do trabalho para o processo primário, existem três casos em que o comportamento entre um processo Node.js normal e um trabalhador de cluster difere:

Node.js não fornece lógica de roteamento. Portanto, é importante projetar um aplicativo de forma que ele não dependa muito de objetos de dados na memória para coisas como sessões e login.

Como os trabalhadores são todos processos separados, eles podem ser finalizados ou re-gerados dependendo das necessidades de um programa, sem afetar outros trabalhadores. Enquanto houver alguns trabalhadores vivos, o servidor continuará a aceitar conexões. Se nenhum trabalhador estiver vivo, as conexões existentes serão descartadas e novas conexões serão recusadas. Node.js não gerencia automaticamente o número de trabalhadores, no entanto. É responsabilidade do aplicativo gerenciar o pool de trabalhadores com base em suas próprias necessidades.

Embora um caso de uso primário para o módulo `node:cluster` seja a rede, ele também pode ser usado para outros casos de uso que exigem processos de trabalho.


## Classe: `Worker` {#class-worker}

**Adicionado em: v0.7.0**

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Um objeto `Worker` contém todas as informações e métodos públicos sobre um worker. No primário, ele pode ser obtido usando `cluster.workers`. Em um worker, ele pode ser obtido usando `cluster.worker`.

### Evento: `'disconnect'` {#event-disconnect}

**Adicionado em: v0.7.7**

Semelhante ao evento `cluster.on('disconnect')`, mas específico para este worker.

```js [ESM]
cluster.fork().on('disconnect', () => {
  // Worker desconectou
});
```
### Evento: `'error'` {#event-error}

**Adicionado em: v0.7.3**

Este evento é o mesmo fornecido por [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options).

Dentro de um worker, `process.on('error')` também pode ser usado.

### Evento: `'exit'` {#event-exit}

**Adicionado em: v0.11.2**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de saída, se ele saiu normalmente.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do sinal (por exemplo, `'SIGHUP'`) que causou a interrupção do processo.

Semelhante ao evento `cluster.on('exit')`, mas específico para este worker.



::: code-group
```js [ESM]
import cluster from 'node:cluster';

if (cluster.isPrimary) {
  const worker = cluster.fork();
  worker.on('exit', (code, signal) => {
    if (signal) {
      console.log(`worker foi interrompido pelo sinal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker saiu com código de erro: ${code}`);
    } else {
      console.log('worker sucesso!');
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
      console.log(`worker foi interrompido pelo sinal: ${signal}`);
    } else if (code !== 0) {
      console.log(`worker saiu com código de erro: ${code}`);
    } else {
      console.log('worker sucesso!');
    }
  });
}
```
:::

### Evento: `'listening'` {#event-listening}

**Adicionado em: v0.7.0**

- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Semelhante ao evento `cluster.on('listening')`, mas específico para este worker.



::: code-group
```js [ESM]
cluster.fork().on('listening', (address) => {
  // Worker está ouvindo
});
```

```js [CJS]
cluster.fork().on('listening', (address) => {
  // Worker está ouvindo
});
```
:::

Ele não é emitido no worker.


### Evento: `'message'` {#event-message}

**Adicionado em: v0.7.0**

- `message` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Semelhante ao evento `'message'` do `cluster`, mas específico para este worker.

Dentro de um worker, `process.on('message')` também pode ser usado.

Veja o evento [`process` event: `'message'`](/pt/nodejs/api/process#event-message).

Aqui está um exemplo usando o sistema de mensagens. Ele mantém uma contagem no processo primário do número de requisições HTTP recebidas pelos workers:

::: code-group
```js [ESM]
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

if (cluster.isPrimary) {

  // Mantém o controle das requisições http
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Conta as requisições
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Inicia os workers e escuta as mensagens contendo notifyRequest
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Processos worker têm um servidor http.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notifica o primário sobre a requisição
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

  // Mantém o controle das requisições http
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // Conta as requisições
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // Inicia os workers e escuta as mensagens contendo notifyRequest
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Processos worker têm um servidor http.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // Notifica o primário sobre a requisição
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```
:::


### Evento: `'online'` {#event-online}

**Adicionado em: v0.7.0**

Semelhante ao evento `cluster.on('online')`, mas específico para este worker.

```js [ESM]
cluster.fork().on('online', () => {
  // Worker está online
});
```
Não é emitido no worker.

### `worker.disconnect()` {#workerdisconnect}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v7.3.0 | Este método agora retorna uma referência para `worker`. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- Retorna: [\<cluster.Worker\>](/pt/nodejs/api/cluster#class-worker) Uma referência para `worker`.

Em um worker, esta função fechará todos os servidores, aguardará o evento `'close'` nesses servidores e, em seguida, desconectará o canal IPC.

No primário, uma mensagem interna é enviada ao worker, fazendo com que ele chame `.disconnect()` em si mesmo.

Faz com que `.exitedAfterDisconnect` seja definido.

Depois que um servidor é fechado, ele não aceitará mais novas conexões, mas as conexões podem ser aceitas por qualquer outro worker em escuta. As conexões existentes poderão ser fechadas normalmente. Quando não existirem mais conexões, consulte [`server.close()`](/pt/nodejs/api/net#event-close), o canal IPC para o worker será fechado, permitindo que ele morra normalmente.

O acima se aplica *apenas* a conexões de servidor, as conexões de cliente não são fechadas automaticamente pelos workers, e o disconnect não espera que elas fechem antes de sair.

Em um worker, `process.disconnect` existe, mas não é esta função; é [`disconnect()`](/pt/nodejs/api/child_process#subprocessdisconnect).

Como conexões de servidor de longa duração podem impedir que os workers se desconectem, pode ser útil enviar uma mensagem, para que ações específicas do aplicativo possam ser tomadas para fechá-las. Também pode ser útil implementar um tempo limite, matando um worker se o evento `'disconnect'` não tiver sido emitido após algum tempo.

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
    // Connections never end
  });

  server.listen(8000);

  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      // Initiate graceful close of any connections to server
    }
  });
}
```

### `worker.exitedAfterDisconnect` {#workerexitedafterdisconnect}

**Adicionado em: v6.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propriedade é `true` se o worker saiu devido a `.disconnect()`. Se o worker saiu de qualquer outra forma, é `false`. Se o worker não saiu, é `undefined`.

O booleano [`worker.exitedAfterDisconnect`](/pt/nodejs/api/cluster#workerexitedafterdisconnect) permite distinguir entre saída voluntária e acidental, o primário pode optar por não reiniciar um worker com base neste valor.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  if (worker.exitedAfterDisconnect === true) {
    console.log('Ah, foi apenas voluntário – não precisa se preocupar');
  }
});

// mata o worker
worker.kill();
```
### `worker.id` {#workerid}

**Adicionado em: v0.8.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Cada novo worker recebe seu próprio ID exclusivo, este ID é armazenado no `id`.

Enquanto um worker está ativo, esta é a chave que o indexa em `cluster.workers`.

### `worker.isConnected()` {#workerisconnected}

**Adicionado em: v0.11.14**

Esta função retorna `true` se o worker estiver conectado ao seu primário através do seu canal IPC, `false` caso contrário. Um worker está conectado ao seu primário após ter sido criado. Ele é desconectado após o evento `'disconnect'` ser emitido.

### `worker.isDead()` {#workerisdead}

**Adicionado em: v0.11.14**

Esta função retorna `true` se o processo do worker terminou (seja por sair ou por ser sinalizado). Caso contrário, retorna `false`.



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

**Adicionado em: v0.9.12**

- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do sinal de término a ser enviado para o processo do worker. **Padrão:** `'SIGTERM'`

Esta função irá terminar o worker. No worker primário, ele faz isso desconectando o `worker.process` e, uma vez desconectado, terminando com `signal`. No worker, ele faz isso terminando o processo com `signal`.

A função `kill()` termina o processo do worker sem esperar por uma desconexão elegante, tem o mesmo comportamento que `worker.process.kill()`.

Este método é apelidado como `worker.destroy()` para compatibilidade retroativa.

Em um worker, `process.kill()` existe, mas não é esta função; é [`kill()`](/pt/nodejs/api/process#processkillpid-signal).

### `worker.process` {#workerprocess}

**Adicionado em: v0.7.0**

- [\<ChildProcess\>](/pt/nodejs/api/child_process#class-childprocess)

Todos os workers são criados usando [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options), o objeto retornado desta função é armazenado como `.process`. Em um worker, o `process` global é armazenado.

Veja: [Módulo Child Process](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options).

Os workers chamarão `process.exit(0)` se o evento `'disconnect'` ocorrer em `process` e `.exitedAfterDisconnect` não for `true`. Isso protege contra desconexão acidental.

### `worker.send(message[, sendHandle[, options]][, callback])` {#workersendmessage-sendhandle-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v4.0.0 | O parâmetro `callback` agora é suportado. |
| v0.7.0 | Adicionado em: v0.7.0 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/pt/nodejs/api/net#serverlistenhandle-backlog-callback)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O argumento `options`, se presente, é um objeto usado para parametrizar o envio de certos tipos de handles. `options` suporta as seguintes propriedades:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Um valor que pode ser usado ao passar instâncias de `net.Socket`. Quando `true`, o socket é mantido aberto no processo de envio. **Padrão:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Envia uma mensagem para um worker ou primário, opcionalmente com um handle.

No primário, isso envia uma mensagem para um worker específico. É idêntico a [`ChildProcess.send()`](/pt/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

Em um worker, isso envia uma mensagem para o primário. É idêntico a `process.send()`.

Este exemplo irá ecoar de volta todas as mensagens do primário:

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

**Adicionado em: v0.7.9**

- `worker` [\<cluster.Worker\>](/pt/nodejs/api/cluster#class-worker)

Emitido após o canal IPC do worker ser desconectado. Isso pode ocorrer quando um worker sai normalmente, é morto ou é desconectado manualmente (como com `worker.disconnect()`).

Pode haver um atraso entre os eventos `'disconnect'` e `'exit'`. Esses eventos podem ser usados para detectar se o processo está preso em uma limpeza ou se existem conexões de longa duração.

```js [ESM]
cluster.on('disconnect', (worker) => {
  console.log(`O worker #${worker.id} foi desconectado`);
});
```
## Evento: `'exit'` {#event-exit_1}

**Adicionado em: v0.7.9**

- `worker` [\<cluster.Worker\>](/pt/nodejs/api/cluster#class-worker)
- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de saída, se ele saiu normalmente.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do sinal (por exemplo, `'SIGHUP'`) que causou a morte do processo.

Quando algum dos workers morre, o módulo cluster emitirá o evento `'exit'`.

Isso pode ser usado para reiniciar o worker chamando [`.fork()`](/pt/nodejs/api/cluster#clusterforkenv) novamente.

```js [ESM]
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d morreu (%s). reiniciando...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```
Veja [`child_process` event: `'exit'`](/pt/nodejs/api/child_process#event-exit).

## Evento: `'fork'` {#event-fork}

**Adicionado em: v0.7.0**

- `worker` [\<cluster.Worker\>](/pt/nodejs/api/cluster#class-worker)

Quando um novo worker é bifurcado, o módulo cluster emitirá um evento `'fork'`. Isso pode ser usado para registrar a atividade do worker e criar um tempo limite personalizado.

```js [ESM]
const timeouts = [];
function errorMsg() {
  console.error('Algo deve estar errado com a conexão ...');
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

**Adicionado em: v0.7.0**

- `worker` [\<cluster.Worker\>](/pt/nodejs/api/cluster#class-worker)
- `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Após chamar `listen()` de um worker, quando o evento `'listening'` é emitido no servidor, um evento `'listening'` também será emitido no `cluster` no processo primário.

O manipulador de eventos é executado com dois argumentos, o `worker` contém o objeto worker e o objeto `address` contém as seguintes propriedades de conexão: `address`, `port` e `addressType`. Isso é muito útil se o worker estiver escutando em mais de um endereço.

```js [ESM]
cluster.on('listening', (worker, address) => {
  console.log(
    `Um worker agora está conectado a ${address.address}:${address.port}`);
});
```
O `addressType` é um dos seguintes:

- `4` (TCPv4)
- `6` (TCPv6)
- `-1` (Socket de domínio Unix)
- `'udp4'` ou `'udp6'` (UDPv4 ou UDPv6)

## Evento: `'message'` {#event-message_1}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.0.0 | O parâmetro `worker` é passado agora; veja abaixo para detalhes. |
| v2.5.0 | Adicionado em: v2.5.0 |
:::

- `worker` [\<cluster.Worker\>](/pt/nodejs/api/cluster#class-worker)
- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `handle` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emitido quando o processo primário do cluster recebe uma mensagem de qualquer worker.

Veja [`child_process` event: `'message'`](/pt/nodejs/api/child_process#event-message).

## Evento: `'online'` {#event-online_1}

**Adicionado em: v0.7.0**

- `worker` [\<cluster.Worker\>](/pt/nodejs/api/cluster#class-worker)

Após criar um novo worker, o worker deve responder com uma mensagem de online. Quando o processo primário recebe uma mensagem de online, ele emitirá este evento. A diferença entre `'fork'` e `'online'` é que fork é emitido quando o processo primário cria um worker, e `'online'` é emitido quando o worker está em execução.

```js [ESM]
cluster.on('online', (worker) => {
  console.log('Oba, o worker respondeu depois de ser criado');
});
```

## Evento: `'setup'` {#event-setup}

**Adicionado em: v0.7.1**

- `settings` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emitido sempre que [`.setupPrimary()`](/pt/nodejs/api/cluster#clustersetupprimarysettings) é chamado.

O objeto `settings` é o objeto `cluster.settings` no momento em que [`.setupPrimary()`](/pt/nodejs/api/cluster#clustersetupprimarysettings) foi chamado e é apenas para fins informativos, já que várias chamadas para [`.setupPrimary()`](/pt/nodejs/api/cluster#clustersetupprimarysettings) podem ser feitas em um único ciclo.

Se a precisão for importante, use `cluster.settings`.

## `cluster.disconnect([callback])` {#clusterdisconnectcallback}

**Adicionado em: v0.7.7**

- `callback` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado quando todos os workers estão desconectados e os handles estão fechados.

Chama `.disconnect()` em cada worker em `cluster.workers`.

Quando eles são desconectados, todos os handles internos serão fechados, permitindo que o processo primário termine normalmente se nenhum outro evento estiver aguardando.

O método recebe um argumento de callback opcional que será chamado quando terminar.

Isso só pode ser chamado a partir do processo primário.

## `cluster.fork([env])` {#clusterforkenv}

**Adicionado em: v0.6.0**

- `env` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares de chave/valor a serem adicionados ao ambiente do processo worker.
- Retorna: [\<cluster.Worker\>](/pt/nodejs/api/cluster#class-worker)

Gera um novo processo worker.

Isso só pode ser chamado a partir do processo primário.

## `cluster.isMaster` {#clusterismaster}

**Adicionado em: v0.8.1**

**Obsoleto desde: v16.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

Alias obsoleto para [`cluster.isPrimary`](/pt/nodejs/api/cluster#clusterisprimary).

## `cluster.isPrimary` {#clusterisprimary}

**Adicionado em: v16.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verdadeiro se o processo for um primário. Isso é determinado pelo `process.env.NODE_UNIQUE_ID`. Se `process.env.NODE_UNIQUE_ID` não estiver definido, então `isPrimary` é `true`.


## `cluster.isWorker` {#clusterisworker}

**Adicionado em: v0.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verdadeiro se o processo não for um primário (é a negação de `cluster.isPrimary`).

## `cluster.schedulingPolicy` {#clusterschedulingpolicy}

**Adicionado em: v0.11.2**

A política de agendamento, seja `cluster.SCHED_RR` para round-robin ou `cluster.SCHED_NONE` para deixar para o sistema operacional. Esta é uma configuração global e efetivamente congelada assim que o primeiro worker é gerado, ou [`.setupPrimary()`](/pt/nodejs/api/cluster#clustersetupprimarysettings) é chamado, o que ocorrer primeiro.

`SCHED_RR` é o padrão em todos os sistemas operacionais, exceto o Windows. O Windows mudará para `SCHED_RR` assim que o libuv conseguir distribuir efetivamente os handles do IOCP sem incorrer em uma grande perda de desempenho.

`cluster.schedulingPolicy` também pode ser definido através da variável de ambiente `NODE_CLUSTER_SCHED_POLICY`. Os valores válidos são `'rr'` e `'none'`.

## `cluster.settings` {#clustersettings}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.2.0, v12.16.0 | A opção `serialization` agora é suportada. |
| v9.5.0 | A opção `cwd` agora é suportada. |
| v9.4.0 | A opção `windowsHide` agora é suportada. |
| v8.2.0 | A opção `inspectPort` agora é suportada. |
| v6.4.0 | A opção `stdio` agora é suportada. |
| v0.7.1 | Adicionado em: v0.7.1 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de string passados para o executável do Node.js. **Padrão:** `process.execArgv`.
    - `exec` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Caminho do arquivo para o arquivo do worker. **Padrão:** `process.argv[1]`.
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Argumentos de string passados para o worker. **Padrão:** `process.argv.slice(2)`.
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diretório de trabalho atual do processo do worker. **Padrão:** `undefined` (herda do processo pai).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o tipo de serialização usado para enviar mensagens entre processos. Os valores possíveis são `'json'` e `'advanced'`. Veja [Serialização avançada para `child_process`](/pt/nodejs/api/child_process#advanced-serialization) para mais detalhes. **Padrão:** `false`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se deve ou não enviar a saída para o stdio do pai. **Padrão:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configura o stdio dos processos bifurcados. Como o módulo cluster depende do IPC para funcionar, esta configuração deve conter uma entrada `'ipc'`. Quando esta opção é fornecida, ela substitui `silent`. Veja [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/pt/nodejs/api/child_process#optionsstdio).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do usuário do processo. (Veja [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).)
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do grupo do processo. (Veja [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).)
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Define a porta do inspetor do worker. Isso pode ser um número ou uma função que não recebe argumentos e retorna um número. Por padrão, cada worker recebe sua própria porta, incrementada a partir do `process.debugPort` do primário.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta a janela do console dos processos bifurcados que normalmente seria criada em sistemas Windows. **Padrão:** `false`.

Depois de chamar [`.setupPrimary()`](/pt/nodejs/api/cluster#clustersetupprimarysettings) (ou [`.fork()`](/pt/nodejs/api/cluster#clusterforkenv)) este objeto de configurações conterá as configurações, incluindo os valores padrão.

Este objeto não se destina a ser alterado ou definido manualmente.


## `cluster.setupMaster([settings])` {#clustersetupmastersettings}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Obsoleto desde: v16.0.0 |
| v6.4.0 | A opção `stdio` agora é suportada. |
| v0.7.1 | Adicionado em: v0.7.1 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

Alias obsoleto para [`.setupPrimary()`](/pt/nodejs/api/cluster#clustersetupprimarysettings).

## `cluster.setupPrimary([settings])` {#clustersetupprimarysettings}

**Adicionado em: v16.0.0**

- `settings` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`cluster.settings`](/pt/nodejs/api/cluster#clustersettings).

`setupPrimary` é usado para alterar o comportamento padrão de 'fork'. Depois de chamado, as configurações estarão presentes em `cluster.settings`.

Quaisquer alterações de configuração afetam apenas chamadas futuras para [`.fork()`](/pt/nodejs/api/cluster#clusterforkenv) e não têm efeito em workers que já estão em execução.

O único atributo de um worker que não pode ser definido via `.setupPrimary()` é o `env` passado para [`.fork()`](/pt/nodejs/api/cluster#clusterforkenv).

Os padrões acima se aplicam apenas à primeira chamada; os padrões para chamadas posteriores são os valores atuais no momento em que `cluster.setupPrimary()` é chamado.

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

Isso só pode ser chamado a partir do processo primário.

## `cluster.worker` {#clusterworker}

**Adicionado em: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Uma referência ao objeto worker atual. Não disponível no processo primário.

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

**Adicionado em: v0.7.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Um hash que armazena os objetos de worker ativos, indexados pelo campo `id`. Isso facilita a iteração por todos os workers. Está disponível apenas no processo primário.

Um worker é removido de `cluster.workers` depois que o worker desconectou *e* saiu. A ordem entre esses dois eventos não pode ser determinada com antecedência. No entanto, é garantido que a remoção da lista `cluster.workers` aconteça antes do último evento `'disconnect'` ou `'exit'` ser emitido.

::: code-group
```js [ESM]
import cluster from 'node:cluster';

for (const worker of Object.values(cluster.workers)) {
  worker.send('grande anúncio para todos os workers');
}
```

```js [CJS]
const cluster = require('node:cluster');

for (const worker of Object.values(cluster.workers)) {
  worker.send('grande anúncio para todos os workers');
}
```
:::

