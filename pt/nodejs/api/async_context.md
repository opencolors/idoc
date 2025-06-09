---
title: Documentação do Node.js - Rastreamento de Contexto Assíncrono
description: Aprenda como rastrear operações assíncronas no Node.js com o módulo async_hooks, que oferece uma maneira de registrar callbacks para vários eventos assíncronos.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Rastreamento de Contexto Assíncrono | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda como rastrear operações assíncronas no Node.js com o módulo async_hooks, que oferece uma maneira de registrar callbacks para vários eventos assíncronos.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Rastreamento de Contexto Assíncrono | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda como rastrear operações assíncronas no Node.js com o módulo async_hooks, que oferece uma maneira de registrar callbacks para vários eventos assíncronos.
---


# Rastreamento de contexto assíncrono {#asynchronous-context-tracking}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## Introdução {#introduction}

Essas classes são usadas para associar estado e propagá-lo por meio de callbacks e cadeias de promessas. Elas permitem armazenar dados durante todo o ciclo de vida de uma solicitação da web ou qualquer outra duração assíncrona. É semelhante ao armazenamento local de threads em outras linguagens.

As classes `AsyncLocalStorage` e `AsyncResource` fazem parte do módulo `node:async_hooks`:

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## Classe: `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.4.0 | AsyncLocalStorage agora é Estável. Anteriormente, era Experimental. |
| v13.10.0, v12.17.0 | Adicionado em: v13.10.0, v12.17.0 |
:::

Esta classe cria armazenamentos que permanecem coerentes durante operações assíncronas.

Embora você possa criar sua própria implementação em cima do módulo `node:async_hooks`, `AsyncLocalStorage` deve ser preferido, pois é uma implementação de alto desempenho e segura para a memória, que envolve otimizações significativas que não são óbvias de implementar.

O exemplo a seguir usa `AsyncLocalStorage` para construir um logger simples que atribui IDs às solicitações HTTP de entrada e os inclui nas mensagens registradas em cada solicitação.

::: code-group
```js [ESM]
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```

```js [CJS]
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
:::

Cada instância de `AsyncLocalStorage` mantém um contexto de armazenamento independente. Várias instâncias podem existir simultaneamente sem risco de interferir nos dados umas das outras.


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.7.0, v18.16.0 | Remoção da opção experimental onPropagate. |
| v19.2.0, v18.13.0 | Adição da opção onPropagate. |
| v13.10.0, v12.17.0 | Adicionado em: v13.10.0, v12.17.0 |
:::

Cria uma nova instância de `AsyncLocalStorage`. O armazenamento é fornecido apenas dentro de uma chamada `run()` ou após uma chamada `enterWith()`.

### Método estático: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**Adicionado em: v19.8.0, v18.16.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser associada ao contexto de execução atual.
- Retorna: [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma nova função que chama `fn` dentro do contexto de execução capturado.

Associa a função fornecida ao contexto de execução atual.

### Método estático: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**Adicionado em: v19.8.0, v18.16.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- Retorna: [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma nova função com a assinatura `(fn: (...args) : R, ...args) : R`.

Captura o contexto de execução atual e retorna uma função que aceita uma função como argumento. Sempre que a função retornada é chamada, ela chama a função passada a ela dentro do contexto capturado.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // retorna 123
```
AsyncLocalStorage.snapshot() pode substituir o uso de AsyncResource para fins de rastreamento de contexto assíncrono simples, por exemplo:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // retorna 123
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**Adicionado em: v13.10.0, v12.17.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Desativa a instância de `AsyncLocalStorage`. Todas as chamadas subsequentes para `asyncLocalStorage.getStore()` retornarão `undefined` até que `asyncLocalStorage.run()` ou `asyncLocalStorage.enterWith()` seja chamado novamente.

Ao chamar `asyncLocalStorage.disable()`, todos os contextos atuais vinculados à instância serão encerrados.

Chamar `asyncLocalStorage.disable()` é necessário antes que o `asyncLocalStorage` possa ser coletado como lixo. Isso não se aplica aos armazenamentos fornecidos pelo `asyncLocalStorage`, pois esses objetos são coletados como lixo junto com os recursos assíncronos correspondentes.

Use este método quando o `asyncLocalStorage` não estiver mais em uso no processo atual.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**Adicionado em: v13.10.0, v12.17.0**

- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Retorna o armazenamento atual. Se chamado fora de um contexto assíncrono inicializado chamando `asyncLocalStorage.run()` ou `asyncLocalStorage.enterWith()`, ele retorna `undefined`.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**Adicionado em: v13.11.0, v12.17.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Faz a transição para o contexto pelo restante da execução síncrona atual e, em seguida, persiste o armazenamento por meio de quaisquer chamadas assíncronas seguintes.

Exemplo:

```js [ESM]
const store = { id: 1 };
// Substitui o armazenamento anterior pelo objeto de armazenamento fornecido
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Retorna o objeto de armazenamento
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Retorna o mesmo objeto
});
```
Esta transição continuará para a *inteira* execução síncrona. Isso significa que, por exemplo, se o contexto for inserido dentro de um manipulador de eventos, os manipuladores de eventos subsequentes também serão executados dentro desse contexto, a menos que sejam especificamente vinculados a outro contexto com um `AsyncResource`. É por isso que `run()` deve ser preferido em vez de `enterWith()` a menos que haja fortes razões para usar o último método.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Retorna o mesmo objeto
});

asyncLocalStorage.getStore(); // Retorna undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Retorna o mesmo objeto
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**Adicionado em: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Executa uma função de forma síncrona dentro de um contexto e retorna o seu valor de retorno. O armazenamento não está acessível fora da função de *callback*. O armazenamento está acessível a quaisquer operações assíncronas criadas dentro do *callback*.

Os `args` opcionais são passados para a função de *callback*.

Se a função de *callback* lançar um erro, o erro também é lançado por `run()`. O rastreamento de pilha não é afetado por esta chamada e o contexto é encerrado.

Exemplo:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Retorna o objeto de armazenamento
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Retorna o objeto de armazenamento
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Retorna undefined
  // O erro será capturado aqui
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**Adicionado em: v13.10.0, v12.17.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Executa uma função síncronamente fora de um contexto e retorna seu valor de retorno. O armazenamento não está acessível dentro da função de *callback* ou das operações assíncronas criadas dentro do *callback*. Qualquer chamada `getStore()` feita dentro da função de *callback* sempre retornará `undefined`.

Os `args` opcionais são passados para a função de *callback*.

Se a função de *callback* lançar um erro, o erro também é lançado por `exit()`. O rastreamento de pilha não é afetado por esta chamada e o contexto é reentrado.

Exemplo:

```js [ESM]
// Dentro de uma chamada para run
try {
  asyncLocalStorage.getStore(); // Retorna o objeto ou valor de armazenamento
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Retorna undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Retorna o mesmo objeto ou valor
  // O erro será capturado aqui
}
```

### Uso com `async/await` {#usage-with-async/await}

Se, dentro de uma função assíncrona, apenas uma chamada `await` for executada dentro de um contexto, o seguinte padrão deve ser usado:

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // O valor de retorno de foo será aguardado
  });
}
```
Neste exemplo, o armazenamento só está disponível na função de callback e nas funções chamadas por `foo`. Fora de `run`, chamar `getStore` retornará `undefined`.

### Solução de problemas: Perda de contexto {#troubleshooting-context-loss}

Na maioria dos casos, `AsyncLocalStorage` funciona sem problemas. Em raras situações, o armazenamento atual é perdido em uma das operações assíncronas.

Se o seu código for baseado em callback, é suficiente transformá-lo em promessa com [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal) para que ele comece a funcionar com promessas nativas.

Se você precisar usar uma API baseada em callback ou seu código assume uma implementação thenable personalizada, use a classe [`AsyncResource`](/pt/nodejs/api/async_context#class-asyncresource) para associar a operação assíncrona ao contexto de execução correto. Encontre a chamada de função responsável pela perda de contexto registrando o conteúdo de `asyncLocalStorage.getStore()` após as chamadas que você suspeitar serem responsáveis pela perda. Quando o código registrar `undefined`, o último callback chamado provavelmente é responsável pela perda de contexto.

## Classe: `AsyncResource` {#class-asyncresource}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.4.0 | AsyncResource agora é Estável. Anteriormente, era Experimental. |
:::

A classe `AsyncResource` é projetada para ser estendida pelos recursos assíncronos do incorporador. Usando isso, os usuários podem acionar facilmente os eventos de tempo de vida de seus próprios recursos.

O hook `init` será acionado quando um `AsyncResource` for instanciado.

A seguir, uma visão geral da API `AsyncResource`.



::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() deve ser estendido. Instanciar um
// novo AsyncResource() também aciona init. Se triggerAsyncId for omitido, então
// async_hook.executionAsyncId() é usado.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Executa uma função no contexto de execução do recurso. Isso irá
// * estabelecer o contexto do recurso
// * acionar os callbacks before do AsyncHooks
// * chamar a função fornecida `fn` com os argumentos fornecidos
// * acionar os callbacks after do AsyncHooks
// * restaurar o contexto de execução original
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Chama os callbacks destroy do AsyncHooks.
asyncResource.emitDestroy();

// Retorna o ID exclusivo atribuído à instância AsyncResource.
asyncResource.asyncId();

// Retorna o ID de acionamento para a instância AsyncResource.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() deve ser estendido. Instanciar um
// novo AsyncResource() também aciona init. Se triggerAsyncId for omitido, então
// async_hook.executionAsyncId() é usado.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Executa uma função no contexto de execução do recurso. Isso irá
// * estabelecer o contexto do recurso
// * acionar os callbacks before do AsyncHooks
// * chamar a função fornecida `fn` com os argumentos fornecidos
// * acionar os callbacks after do AsyncHooks
// * restaurar o contexto de execução original
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Chama os callbacks destroy do AsyncHooks.
asyncResource.emitDestroy();

// Retorna o ID exclusivo atribuído à instância AsyncResource.
asyncResource.asyncId();

// Retorna o ID de acionamento para a instância AsyncResource.
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo de evento assíncrono.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do contexto de execução que criou este evento assíncrono. **Padrão:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, desativa o `emitDestroy` quando o objeto é coletado como lixo. Isso geralmente não precisa ser definido (mesmo se `emitDestroy` for chamado manualmente), a menos que o `asyncId` do recurso seja recuperado e o `emitDestroy` da API confidencial seja chamado com ele. Quando definido como `false`, a chamada `emitDestroy` na coleta de lixo só ocorrerá se houver pelo menos um hook `destroy` ativo. **Padrão:** `false`.
  
 

Exemplo de uso:

```js [ESM]
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```
### Método estático: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | A propriedade `asyncResource` adicionada à função vinculada foi descontinuada e será removida em uma versão futura. |
| v17.8.0, v16.15.0 | Alterado o padrão quando `thisArg` é indefinido para usar `this` do chamador. |
| v16.0.0 | Adicionado thisArg opcional. |
| v14.8.0, v12.19.0 | Adicionado em: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser vinculada ao contexto de execução atual.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um nome opcional para associar ao `AsyncResource` subjacente.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Vincula a função fornecida ao contexto de execução atual.


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.0.0 | A propriedade `asyncResource` adicionada à função vinculada foi depreciada e será removida em uma versão futura. |
| v17.8.0, v16.15.0 | Alterado o padrão quando `thisArg` é indefinido para usar `this` do chamador. |
| v16.0.0 | Adicionado thisArg opcional. |
| v14.8.0, v12.19.0 | Adicionado em: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser vinculada ao escopo do `AsyncResource` atual.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Vincula a função fornecida para ser executada no escopo deste `AsyncResource`.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**Adicionado em: v9.6.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser chamada no contexto de execução deste recurso assíncrono.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O receptor a ser usado para a chamada de função.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionais para passar para a função.

Chama a função fornecida com os argumentos fornecidos no contexto de execução do recurso assíncrono. Isso estabelecerá o contexto, acionará os callbacks AsyncHooks before, chamará a função, acionará os callbacks AsyncHooks after e, em seguida, restaurará o contexto de execução original.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- Retorna: [\<AsyncResource\>](/pt/nodejs/api/async_hooks#class-asyncresource) Uma referência para `asyncResource`.

Chama todos os hooks `destroy`. Isso só deve ser chamado uma vez. Um erro será lançado se for chamado mais de uma vez. Isso **deve** ser chamado manualmente. Se o recurso for deixado para ser coletado pelo GC, os hooks `destroy` nunca serão chamados.


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O `asyncId` exclusivo atribuído ao recurso.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O mesmo `triggerAsyncId` que é passado para o construtor `AsyncResource`.

### Usando `AsyncResource` para um pool de threads `Worker` {#using-asyncresource-for-a-worker-thread-pool}

O exemplo a seguir mostra como usar a classe `AsyncResource` para fornecer rastreamento assíncrono adequado para um pool de [`Worker`](/pt/nodejs/api/worker_threads#class-worker). Outros pools de recursos, como pools de conexão de banco de dados, podem seguir um modelo semelhante.

Assumindo que a tarefa seja somar dois números, usando um arquivo chamado `task_processor.js` com o seguinte conteúdo:

::: code-group
```js [ESM]
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```js [CJS]
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```
:::

Um pool de Worker ao redor dele pode usar a seguinte estrutura:

::: code-group
```js [ESM]
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s são usados apenas uma vez.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Sempre que o kWorkerFreedEvent é emitido, despacha
    // a próxima tarefa pendente na fila, se houver.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // Em caso de sucesso: Chame o callback que foi passado para `runTask`,
      // remova o `TaskInfo` associado ao Worker e marque-o como livre
      // novamente.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // Em caso de uma exceção não capturada: Chame o callback que foi passado para
      // `runTask` com o erro.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remova o worker da lista e inicie um novo Worker para substituir o
      // atual.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // Sem threads livres, espere até que uma thread worker fique livre.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```js [CJS]
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s são usados apenas uma vez.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Sempre que o kWorkerFreedEvent é emitido, despacha
    // a próxima tarefa pendente na fila, se houver.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // Em caso de sucesso: Chame o callback que foi passado para `runTask`,
      // remova o `TaskInfo` associado ao Worker e marque-o como livre
      // novamente.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // Em caso de uma exceção não capturada: Chame o callback que foi passado para
      // `runTask` com o erro.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remova o worker da lista e inicie um novo Worker para substituir o
      // atual.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // Sem threads livres, espere até que uma thread worker fique livre.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```
:::

Sem o rastreamento explícito adicionado pelos objetos `WorkerPoolTaskInfo`, pareceria que os callbacks estão associados aos objetos `Worker` individuais. No entanto, a criação dos `Worker`s não está associada à criação das tarefas e não fornece informações sobre quando as tarefas foram agendadas.

Este pool pode ser usado da seguinte forma:

::: code-group
```js [ESM]
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```js [CJS]
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```
:::


### Integrando `AsyncResource` com `EventEmitter` {#integrating-asyncresource-with-eventemitter}

Os listeners de evento acionados por um [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter) podem ser executados em um contexto de execução diferente daquele que estava ativo quando `eventEmitter.on()` foi chamado.

O exemplo a seguir mostra como usar a classe `AsyncResource` para associar corretamente um listener de evento ao contexto de execução correto. A mesma abordagem pode ser aplicada a um [`Stream`](/pt/nodejs/api/stream#stream) ou uma classe orientada a eventos semelhante.



::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // O contexto de execução é vinculado ao escopo externo atual.
  }));
  req.on('close', () => {
    // O contexto de execução é vinculado ao escopo que fez com que 'close' fosse emitido.
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // O contexto de execução é vinculado ao escopo externo atual.
  }));
  req.on('close', () => {
    // O contexto de execução é vinculado ao escopo que fez com que 'close' fosse emitido.
  });
  res.end();
}).listen(3000);
```
:::

