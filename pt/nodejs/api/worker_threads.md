---
title: Threads de Trabalho do Node.js
description: Documentação sobre como usar threads de trabalho no Node.js para aproveitar o multithreading para tarefas intensivas em CPU, fornecendo uma visão geral da classe Worker, comunicação entre threads e exemplos de uso.
head:
  - - meta
    - name: og:title
      content: Threads de Trabalho do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentação sobre como usar threads de trabalho no Node.js para aproveitar o multithreading para tarefas intensivas em CPU, fornecendo uma visão geral da classe Worker, comunicação entre threads e exemplos de uso.
  - - meta
    - name: twitter:title
      content: Threads de Trabalho do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentação sobre como usar threads de trabalho no Node.js para aproveitar o multithreading para tarefas intensivas em CPU, fornecendo uma visão geral da classe Worker, comunicação entre threads e exemplos de uso.
---


# Threads de Trabalho (Worker threads) {#worker-threads}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

O módulo `node:worker_threads` permite o uso de threads que executam JavaScript em paralelo. Para acessá-lo:

```js [ESM]
const worker = require('node:worker_threads');
```
Workers (threads) são úteis para realizar operações JavaScript intensivas em CPU. Eles não ajudam muito com trabalho intensivo em I/O. As operações assíncronas de I/O integradas do Node.js são mais eficientes do que os Workers podem ser.

Ao contrário de `child_process` ou `cluster`, `worker_threads` podem compartilhar memória. Eles fazem isso transferindo instâncias de `ArrayBuffer` ou compartilhando instâncias de `SharedArrayBuffer`.

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```
O exemplo acima gera uma thread Worker para cada chamada `parseJSAsync()`. Na prática, use um pool de Workers para esses tipos de tarefas. Caso contrário, a sobrecarga de criar Workers provavelmente excederia seu benefício.

Ao implementar um pool de workers, use a API [`AsyncResource`](/pt/nodejs/api/async_hooks#class-asyncresource) para informar ferramentas de diagnóstico (por exemplo, para fornecer rastreamentos de pilha assíncronos) sobre a correlação entre tarefas e seus resultados. Consulte ["Usando `AsyncResource` para um pool de threads `Worker`"](/pt/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool) na documentação do `async_hooks` para obter um exemplo de implementação.

As threads de worker herdam opções não específicas do processo por padrão. Consulte [`Opções do construtor Worker`](/pt/nodejs/api/worker_threads#new-workerfilename-options) para saber como personalizar as opções da thread de worker, especificamente as opções `argv` e `execArgv`.


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.5.0, v16.15.0 | Não é mais experimental. |
| v15.12.0, v14.18.0 | Adicionado em: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript arbitrário e clonável que pode ser usado como uma chave [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Dentro de um thread de worker, `worker.getEnvironmentData()` retorna um clone dos dados passados para `worker.setEnvironmentData()` do thread de criação. Cada novo `Worker` recebe sua própria cópia dos dados de ambiente automaticamente.

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Imprime 'World!'.
}
```
## `worker.isMainThread` {#workerismainthread}

**Adicionado em: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se este código não estiver sendo executado dentro de um thread [`Worker`](/pt/nodejs/api/worker_threads#class-worker).

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // Isso recarrega o arquivo atual dentro de uma instância Worker.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Imprime 'false'.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**Adicionado em: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript arbitrário.

Marca um objeto como não transferível. Se `object` ocorrer na lista de transferência de uma chamada [`port.postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist), um erro é lançado. Isso é uma operação nula se `object` for um valor primitivo.

Em particular, isso faz sentido para objetos que podem ser clonados, em vez de transferidos, e que são usados por outros objetos no lado do envio. Por exemplo, o Node.js marca os `ArrayBuffer`s que ele usa para seu [`Buffer` pool](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) com isso.

Esta operação não pode ser desfeita.

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // Isso lançará um erro, porque pooledBuffer não é transferível.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// A linha a seguir imprime o conteúdo de typedArray1 -- ele ainda possui
// sua memória e não foi transferido. Sem
// `markAsUntransferable()`, isso imprimiria um Uint8Array vazio e a
// chamada postMessage teria sucesso.
// typedArray2 também está intacto.
console.log(typedArray1);
console.log(typedArray2);
```
Não existe equivalente a esta API nos navegadores.


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**Adicionado em: v21.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se um objeto está marcado como não transferível com [`markAsUntransferable()`](/pt/nodejs/api/worker_threads#workermarkasuntransferableobject).

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Retorna true.
```
Não existe equivalente a esta API nos navegadores.

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**Adicionado em: v23.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript arbitrário.

Marca um objeto como não clonável. Se `object` for usado como [`message`](/pt/nodejs/api/worker_threads#event-message) em uma chamada [`port.postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist), um erro é lançado. Isso não tem efeito se `object` for um valor primitivo.

Isso não tem efeito em `ArrayBuffer` ou qualquer objeto semelhante a `Buffer`.

Esta operação não pode ser desfeita.

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // Isso lançará um erro, porque anyObject não é clonável.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
Não existe equivalente a esta API nos navegadores.

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**Adicionado em: v11.13.0**

-  `port` [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport) A porta de mensagem a ser transferida.
-  `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto [contextificado](/pt/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) conforme retornado pelo método `vm.createContext()`.
-  Retorna: [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport)

Transfere um `MessagePort` para um [`vm`](/pt/nodejs/api/vm) Context diferente. O objeto `port` original é tornado inutilizável, e a instância `MessagePort` retornada toma o seu lugar.

O `MessagePort` retornado é um objeto no contexto de destino e herda da sua classe global `Object`. Objetos passados para o ouvinte [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) também são criados no contexto de destino e herdam da sua classe global `Object`.

No entanto, o `MessagePort` criado não herda mais de [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget), e apenas [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage) pode ser usado para receber eventos usando-o.


## `worker.parentPort` {#workerparentport}

**Adicionado em: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport)

Se esta thread for um [`Worker`](/pt/nodejs/api/worker_threads#class-worker), este é um [`MessagePort`](/pt/nodejs/api/worker_threads#class-messageport) que permite a comunicação com a thread pai. As mensagens enviadas usando `parentPort.postMessage()` estão disponíveis na thread pai usando `worker.on('message')`, e as mensagens enviadas da thread pai usando `worker.postMessage()` estão disponíveis nesta thread usando `parentPort.on('message')`.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Imprime 'Hello, world!'.
  });
  worker.postMessage('Hello, world!');
} else {
  // Quando uma mensagem da thread pai é recebida, envie-a de volta:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID da thread de destino. Se o ID da thread for inválido, um erro [`ERR_WORKER_MESSAGING_FAILED`](/pt/nodejs/api/errors#err_worker_messaging_failed) será lançado. Se o ID da thread de destino for o ID da thread atual, um erro [`ERR_WORKER_MESSAGING_SAME_THREAD`](/pt/nodejs/api/errors#err_worker_messaging_same_thread) será lançado.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor a ser enviado.
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se um ou mais objetos do tipo `MessagePort` forem passados em `value`, uma `transferList` é necessária para esses itens ou [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/pt/nodejs/api/errors#err_missing_message_port_in_transfer_list) é lançado. Consulte [`port.postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist) para obter mais informações.
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tempo para esperar que a mensagem seja entregue em milissegundos. Por padrão, é `undefined`, o que significa esperar para sempre. Se a operação atingir o tempo limite, um erro [`ERR_WORKER_MESSAGING_TIMEOUT`](/pt/nodejs/api/errors#err_worker_messaging_timeout) será lançado.
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Uma promessa que é cumprida se a mensagem foi processada com sucesso pela thread de destino.

Envia um valor para outro worker, identificado pelo seu ID de thread.

Se a thread de destino não tiver um listener para o evento `workerMessage`, a operação lançará um erro [`ERR_WORKER_MESSAGING_FAILED`](/pt/nodejs/api/errors#err_worker_messaging_failed).

Se a thread de destino lançar um erro ao processar o evento `workerMessage`, a operação lançará um erro [`ERR_WORKER_MESSAGING_ERRORED`](/pt/nodejs/api/errors#err_worker_messaging_errored).

Este método deve ser usado quando a thread de destino não for o pai ou filho direto da thread atual. Se as duas threads forem pai-filho, use [`require('node:worker_threads').parentPort.postMessage()`](/pt/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) e [`worker.postMessage()`](/pt/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) para permitir que as threads se comuniquem.

O exemplo abaixo mostra o uso de `postMessageToThread`: ele cria 10 threads aninhadas, a última tentará se comunicar com a thread principal.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.12.0 | O argumento port agora também pode se referir a um `BroadcastChannel`. |
| v12.3.0 | Adicionado em: v12.3.0 |
:::

-  `port` [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/pt/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget) 
-  Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 

Recebe uma única mensagem de um determinado `MessagePort`. Se nenhuma mensagem estiver disponível, `undefined` é retornado, caso contrário, um objeto com uma única propriedade `message` que contém o payload da mensagem, correspondente à mensagem mais antiga na fila do `MessagePort`.

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Imprime: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Imprime: undefined
```
Quando esta função é usada, nenhum evento `'message'` é emitido e o listener `onmessage` não é invocado.

## `worker.resourceLimits` {#workerresourcelimits}

**Adicionado em: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Fornece o conjunto de restrições de recursos do motor JS dentro desta thread Worker. Se a opção `resourceLimits` foi passada para o construtor [`Worker`](/pt/nodejs/api/worker_threads#class-worker), isso corresponde aos seus valores.

Se isso for usado na thread principal, seu valor é um objeto vazio.


## `worker.SHARE_ENV` {#workershare_env}

**Adicionado em: v11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Um valor especial que pode ser passado como a opção `env` do construtor [`Worker`](/pt/nodejs/api/worker_threads#class-worker), para indicar que a thread atual e a thread Worker devem compartilhar acesso de leitura e escrita ao mesmo conjunto de variáveis de ambiente.

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // Imprime 'foo'.
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.5.0, v16.15.0 | Não é mais experimental. |
| v15.12.0, v14.18.0 | Adicionado em: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript arbitrário e clonável que pode ser usado como uma chave [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript arbitrário e clonável que será clonado e passado automaticamente para todas as novas instâncias de `Worker`. Se `value` for passado como `undefined`, qualquer valor definido anteriormente para a `key` será excluído.

A API `worker.setEnvironmentData()` define o conteúdo de `worker.getEnvironmentData()` na thread atual e em todas as novas instâncias de `Worker` geradas a partir do contexto atual.

## `worker.threadId` {#workerthreadid}

**Adicionado em: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Um identificador inteiro para a thread atual. No objeto worker correspondente (se houver), está disponível como [`worker.threadId`](/pt/nodejs/api/worker_threads#workerthreadid_1). Este valor é único para cada instância de [`Worker`](/pt/nodejs/api/worker_threads#class-worker) dentro de um único processo.


## `worker.workerData` {#workerworkerdata}

**Adicionado em: v10.5.0**

Um valor JavaScript arbitrário que contém um clone dos dados passados para o construtor `Worker` desta thread.

Os dados são clonados como se estivessem usando [`postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist), de acordo com o [algoritmo de clone estruturado HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Olá, mundo!' });
} else {
  console.log(workerData);  // Imprime 'Olá, mundo!'.
}
```
## Classe: `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Não é mais experimental. |
| v15.4.0 | Adicionado em: v15.4.0 |
:::

Instâncias de `BroadcastChannel` permitem a comunicação assíncrona um-para-muitos com todas as outras instâncias de `BroadcastChannel` vinculadas ao mesmo nome de canal.

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**Adicionado em: v15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O nome do canal ao qual se conectar. Qualquer valor JavaScript que possa ser convertido em uma string usando ``${name}`` é permitido.

### `broadcastChannel.close()` {#broadcastchannelclose}

**Adicionado em: v15.4.0**

Fecha a conexão `BroadcastChannel`.

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**Adicionado em: v15.4.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado com um único argumento `MessageEvent` quando uma mensagem é recebida.


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**Adicionado em: v15.4.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocado quando uma mensagem recebida não pode ser desserializada.

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**Adicionado em: v15.4.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript clonável.

### `broadcastChannel.ref()` {#broadcastchannelref}

**Adicionado em: v15.4.0**

Oposto de `unref()`. Chamar `ref()` em um BroadcastChannel previamente `unref()`ed *não* permite que o programa termine se for o único manipulador ativo restante (o comportamento padrão). Se a porta for `ref()`ed, chamar `ref()` novamente não tem efeito.

### `broadcastChannel.unref()` {#broadcastchannelunref}

**Adicionado em: v15.4.0**

Chamar `unref()` em um BroadcastChannel permite que a thread termine se este for o único manipulador ativo no sistema de eventos. Se o BroadcastChannel já estiver `unref()`ed, chamar `unref()` novamente não tem efeito.

## Classe: `MessageChannel` {#class-messagechannel}

**Adicionado em: v10.5.0**

Instâncias da classe `worker.MessageChannel` representam um canal de comunicação assíncrono e bidirecional. O `MessageChannel` não possui métodos próprios. `new MessageChannel()` produz um objeto com propriedades `port1` e `port2`, que se referem a instâncias vinculadas de [`MessagePort`](/pt/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// Imprime: received { foo: 'bar' } do listener `port1.on('message')`
```
## Classe: `MessagePort` {#class-messageport}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.7.0 | Esta classe agora herda de `EventTarget` em vez de `EventEmitter`. |
| v10.5.0 | Adicionado em: v10.5.0 |
:::

- Estende: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget)

Instâncias da classe `worker.MessagePort` representam uma extremidade de um canal de comunicação assíncrono e bidirecional. Pode ser usado para transferir dados estruturados, regiões de memória e outros `MessagePort`s entre diferentes [`Worker`](/pt/nodejs/api/worker_threads#class-worker)s.

Esta implementação corresponde aos [`MessagePort` do navegador](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort).


### Evento: `'close'` {#event-close}

**Adicionado em: v10.5.0**

O evento `'close'` é emitido assim que um dos lados do canal é desconectado.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// Imprime:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### Evento: `'message'` {#event-message}

**Adicionado em: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor transmitido

O evento `'message'` é emitido para qualquer mensagem recebida, contendo a entrada clonada de [`port.postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist).

Os listeners neste evento recebem um clone do parâmetro `value` como passado para `postMessage()` e nenhum argumento adicional.

### Evento: `'messageerror'` {#event-messageerror}

**Adicionado em: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um objeto Error

O evento `'messageerror'` é emitido quando a desserialização de uma mensagem falha.

Atualmente, este evento é emitido quando ocorre um erro ao instanciar o objeto JS postado na extremidade receptora. Essas situações são raras, mas podem acontecer, por exemplo, quando certos objetos da API Node.js são recebidos em um `vm.Context` (onde as APIs Node.js estão atualmente indisponíveis).

### `port.close()` {#portclose}

**Adicionado em: v10.5.0**

Desativa o envio posterior de mensagens em ambos os lados da conexão. Este método pode ser chamado quando nenhuma comunicação adicional acontecerá sobre esta `MessagePort`.

O [`'close' event`](/pt/nodejs/api/worker_threads#event-close) é emitido em ambas as instâncias `MessagePort` que fazem parte do canal.

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.0.0 | Um erro é lançado quando um objeto não transferível está na lista de transferência. |
| v15.6.0 | Adicionado `X509Certificate` à lista de tipos clonáveis. |
| v15.0.0 | Adicionado `CryptoKey` à lista de tipos clonáveis. |
| v15.14.0, v14.18.0 | Adicionado 'BlockList' à lista de tipos clonáveis. |
| v15.9.0, v14.18.0 | Adicionado tipos 'Histogram' à lista de tipos clonáveis. |
| v14.5.0, v12.19.0 | Adicionado `KeyObject` à lista de tipos clonáveis. |
| v14.5.0, v12.19.0 | Adicionado `FileHandle` à lista de tipos transferíveis. |
| v10.5.0 | Adicionado em: v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envia um valor JavaScript para o lado receptor deste canal. `value` é transferido de uma forma que é compatível com o [HTML structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

Em particular, as diferenças significativas para `JSON` são:

- `value` pode conter referências circulares.
- `value` pode conter instâncias de tipos JS embutidos, como `RegExp`s, `BigInt`s, `Map`s, `Set`s, etc.
- `value` pode conter matrizes tipadas, usando `ArrayBuffer`s e `SharedArrayBuffer`s.
- `value` pode conter instâncias de [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module).
- `value` não pode conter objetos nativos (com suporte em C++) além de:
    - [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)s,
    - [\<FileHandle\>](/pt/nodejs/api/fs#class-filehandle)s,
    - [\<Histogram\>](/pt/nodejs/api/perf_hooks#class-histogram)s,
    - [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)s,
    - [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport)s,
    - [\<net.BlockList\>](/pt/nodejs/api/net#class-netblocklist)s,
    - [\<net.SocketAddress\>](/pt/nodejs/api/net#class-netsocketaddress)es,
    - [\<X509Certificate\>](/pt/nodejs/api/crypto#class-x509certificate)s.
  
 

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// Imprime: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList` pode ser uma lista de objetos [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`MessagePort`](/pt/nodejs/api/worker_threads#class-messageport) e [`FileHandle`](/pt/nodejs/api/fs#class-filehandle). Após a transferência, eles não são mais utilizáveis no lado de envio do canal (mesmo que não estejam contidos em `value`). Ao contrário dos [processos filhos](/pt/nodejs/api/child_process), a transferência de handles como sockets de rede não é suportada atualmente.

Se `value` contém instâncias de [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), elas são acessíveis de ambos os threads. Eles não podem ser listados em `transferList`.

`value` ainda pode conter instâncias de `ArrayBuffer` que não estão em `transferList`; nesse caso, a memória subjacente é copiada em vez de movida.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// Isso posta uma cópia de `uint8Array`:
port2.postMessage(uint8Array);
// Isso não copia dados, mas torna `uint8Array` inutilizável:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// A memória para o `sharedUint8Array` é acessível tanto do
// original quanto da cópia recebida por `.on('message')`:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// Isso transfere uma porta de mensagem recém-criada para o receptor.
// Isso pode ser usado, por exemplo, para criar canais de comunicação entre
// múltiplos threads `Worker` que são filhos do mesmo thread pai.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
O objeto de mensagem é clonado imediatamente e pode ser modificado após a postagem sem ter efeitos colaterais.

Para obter mais informações sobre os mecanismos de serialização e desserialização por trás desta API, consulte a [API de serialização do módulo `node:v8`](/pt/nodejs/api/v8#serialization-api).


#### Considerações ao transferir TypedArrays e Buffers {#considerations-when-transferring-typedarrays-and-buffers}

Todas as instâncias de `TypedArray` e `Buffer` são visualizações sobre um `ArrayBuffer` subjacente. Ou seja, é o `ArrayBuffer` que realmente armazena os dados brutos, enquanto os objetos `TypedArray` e `Buffer` fornecem uma maneira de visualizar e manipular os dados. É possível e comum que várias visualizações sejam criadas sobre a mesma instância de `ArrayBuffer`. Deve-se ter muito cuidado ao usar uma lista de transferência para transferir um `ArrayBuffer`, pois isso faz com que todas as instâncias de `TypedArray` e `Buffer` que compartilham o mesmo `ArrayBuffer` se tornem inutilizáveis.

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // imprime 5

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // imprime 0
```
Para instâncias de `Buffer`, especificamente, se o `ArrayBuffer` subjacente pode ser transferido ou clonado depende inteiramente de como as instâncias foram criadas, o que muitas vezes não pode ser determinado de forma confiável.

Um `ArrayBuffer` pode ser marcado com [`markAsUntransferable()`](/pt/nodejs/api/worker_threads#workermarkasuntransferableobject) para indicar que ele sempre deve ser clonado e nunca transferido.

Dependendo de como uma instância de `Buffer` foi criada, ela pode ou não possuir seu `ArrayBuffer` subjacente. Um `ArrayBuffer` não deve ser transferido, a menos que se saiba que a instância de `Buffer` o possui. Em particular, para `Buffer`s criados a partir do pool interno de `Buffer` (usando, por exemplo, `Buffer.from()` ou `Buffer.allocUnsafe()`), transferi-los não é possível e eles são sempre clonados, o que envia uma cópia de todo o pool de `Buffer`. Esse comportamento pode vir com maior uso de memória não intencional e possíveis preocupações de segurança.

Consulte [`Buffer.allocUnsafe()`](/pt/nodejs/api/buffer#static-method-bufferallocunsafesize) para obter mais detalhes sobre o pool de `Buffer`.

Os `ArrayBuffer`s para instâncias de `Buffer` criadas usando `Buffer.alloc()` ou `Buffer.allocUnsafeSlow()` podem sempre ser transferidos, mas, ao fazê-lo, todas as outras visualizações existentes desses `ArrayBuffer`s se tornam inutilizáveis.


#### Considerações ao clonar objetos com protótipos, classes e acessadores {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

Como a clonagem de objetos usa o [algoritmo de clone estruturado HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), propriedades não enumeráveis, acessadores de propriedade e protótipos de objeto não são preservados. Em particular, objetos [`Buffer`](/pt/nodejs/api/buffer) serão lidos como [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)s simples no lado receptor, e instâncias de classes JavaScript serão clonadas como objetos JavaScript simples.

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
Essa limitação se estende a muitos objetos embutidos, como o objeto global `URL`:

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**Adicionado em: v18.1.0, v16.17.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se verdadeiro, o objeto `MessagePort` manterá o loop de eventos do Node.js ativo.

### `port.ref()` {#portref}

**Adicionado em: v10.5.0**

Oposto de `unref()`. Chamar `ref()` em uma porta previamente `unref()`ed *não* permite que o programa saia se for o único manipulador ativo restante (o comportamento padrão). Se a porta for `ref()`ed, chamar `ref()` novamente não terá efeito.

Se listeners forem anexados ou removidos usando `.on('message')`, a porta é `ref()`ed e `unref()`ed automaticamente, dependendo se listeners para o evento existem.


### `port.start()` {#portstart}

**Adicionado em: v10.5.0**

Começa a receber mensagens nesta `MessagePort`. Ao usar esta porta como um emissor de eventos, isso é chamado automaticamente assim que os listeners `'message'` são anexados.

Este método existe para paridade com a API Web `MessagePort`. No Node.js, ele só é útil para ignorar mensagens quando nenhum listener de evento está presente. O Node.js também diverge no seu tratamento de `.onmessage`. Definir automaticamente chama `.start()`, mas remover a definição permite que as mensagens entrem na fila até que um novo manipulador seja definido ou a porta seja descartada.

### `port.unref()` {#portunref}

**Adicionado em: v10.5.0**

Chamar `unref()` em uma porta permite que a thread saia se este for o único manipulador ativo no sistema de eventos. Se a porta já estiver `unref()`ed, chamar `unref()` novamente não tem efeito.

Se os listeners forem anexados ou removidos usando `.on('message')`, a porta é `ref()`ed e `unref()`ed automaticamente dependendo se os listeners para o evento existem.

## Classe: `Worker` {#class-worker}

**Adicionado em: v10.5.0**

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

A classe `Worker` representa uma thread de execução JavaScript independente. A maioria das APIs do Node.js estão disponíveis dentro dela.

Diferenças notáveis dentro de um ambiente Worker são:

- Os streams [`process.stdin`](/pt/nodejs/api/process#processstdin), [`process.stdout`](/pt/nodejs/api/process#processstdout) e [`process.stderr`](/pt/nodejs/api/process#processstderr) podem ser redirecionados pela thread pai.
- A propriedade [`require('node:worker_threads').isMainThread`](/pt/nodejs/api/worker_threads#workerismainthread) é definida como `false`.
- A porta de mensagens [`require('node:worker_threads').parentPort`](/pt/nodejs/api/worker_threads#workerparentport) está disponível.
- [`process.exit()`](/pt/nodejs/api/process#processexitcode) não interrompe todo o programa, apenas a thread única, e [`process.abort()`](/pt/nodejs/api/process#processabort) não está disponível.
- [`process.chdir()`](/pt/nodejs/api/process#processchdirdirectory) e os métodos `process` que definem ids de grupo ou usuário não estão disponíveis.
- [`process.env`](/pt/nodejs/api/process#processenv) é uma cópia das variáveis de ambiente da thread pai, a menos que especificado de outra forma. As alterações em uma cópia não são visíveis em outras threads e não são visíveis para complementos nativos (a menos que [`worker.SHARE_ENV`](/pt/nodejs/api/worker_threads#workershare_env) seja passado como a opção `env` para o construtor [`Worker`](/pt/nodejs/api/worker_threads#class-worker)). No Windows, ao contrário da thread principal, uma cópia das variáveis de ambiente opera de forma sensível a maiúsculas e minúsculas.
- [`process.title`](/pt/nodejs/api/process#processtitle) não pode ser modificado.
- Os sinais não são entregues através de [`process.on('...')`](/pt/nodejs/api/process#signal-events).
- A execução pode parar em qualquer ponto como resultado de [`worker.terminate()`](/pt/nodejs/api/worker_threads#workerterminate) ser invocado.
- Canais IPC de processos pai não são acessíveis.
- O módulo [`trace_events`](/pt/nodejs/api/tracing) não é suportado.
- Complementos nativos só podem ser carregados de várias threads se cumprirem [certas condições](/pt/nodejs/api/addons#worker-support).

Criar instâncias `Worker` dentro de outros `Worker`s é possível.

Como [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) e o [`node:cluster` module](/pt/nodejs/api/cluster), a comunicação bidirecional pode ser alcançada através da passagem de mensagens entre threads. Internamente, um `Worker` tem um par embutido de [`MessagePort`](/pt/nodejs/api/worker_threads#class-messageport)s que já estão associados um ao outro quando o `Worker` é criado. Enquanto o objeto `MessagePort` no lado pai não é diretamente exposto, suas funcionalidades são expostas através de [`worker.postMessage()`](/pt/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) e o evento [`worker.on('message')`](/pt/nodejs/api/worker_threads#event-message_1) no objeto `Worker` para a thread pai.

Para criar canais de mensagens personalizados (o que é incentivado em vez de usar o canal global padrão porque facilita a separação de preocupações), os usuários podem criar um objeto `MessageChannel` em qualquer thread e passar um dos `MessagePort`s nesse `MessageChannel` para a outra thread através de um canal pré-existente, como o global.

Consulte [`port.postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist) para obter mais informações sobre como as mensagens são passadas e que tipo de valores JavaScript podem ser transportados com sucesso através da barreira da thread.

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.8.0, v18.16.0 | Adicionado suporte para uma opção `name`, que permite adicionar um nome ao título do worker para depuração. |
| v14.9.0 | O parâmetro `filename` pode ser um objeto WHATWG `URL` usando o protocolo `data:`. |
| v14.9.0 | A opção `trackUnmanagedFds` foi definida como `true` por padrão. |
| v14.6.0, v12.19.0 | A opção `trackUnmanagedFds` foi introduzida. |
| v13.13.0, v12.17.0 | A opção `transferList` foi introduzida. |
| v13.12.0, v12.17.0 | O parâmetro `filename` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v13.4.0, v12.16.0 | A opção `argv` foi introduzida. |
| v13.2.0, v12.16.0 | A opção `resourceLimits` foi introduzida. |
| v10.5.0 | Adicionado em: v10.5.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) O caminho para o script principal ou módulo do Worker. Deve ser um caminho absoluto ou um caminho relativo (ou seja, relativo ao diretório de trabalho atual) começando com `./` ou `../`, ou um objeto WHATWG `URL` usando o protocolo `file:` ou `data:`. Ao usar um [`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs), os dados são interpretados com base no tipo MIME usando o [carregador de módulo ECMAScript](/pt/nodejs/api/esm#data-imports). Se `options.eval` for `true`, este é uma string contendo código JavaScript em vez de um caminho.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Lista de argumentos que seriam convertidos em string e anexados a `process.argv` no worker. Isso é muito semelhante ao `workerData`, mas os valores estão disponíveis no `process.argv` global como se fossem passados como opções de CLI para o script.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se definido, especifica o valor inicial de `process.env` dentro da thread Worker. Como um valor especial, [`worker.SHARE_ENV`](/pt/nodejs/api/worker_threads#workershare_env) pode ser usado para especificar que a thread pai e a thread filha devem compartilhar suas variáveis de ambiente; nesse caso, as alterações no objeto `process.env` de uma thread afetam também a outra thread. **Padrão:** `process.env`.
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true` e o primeiro argumento for uma `string`, interpreta o primeiro argumento para o construtor como um script que é executado assim que o worker estiver online.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de opções CLI do node passadas para o worker. As opções V8 (como `--max-old-space-size`) e as opções que afetam o processo (como `--title`) não são suportadas. Se definido, isso é fornecido como [`process.execArgv`](/pt/nodejs/api/process#processexecargv) dentro do worker. Por padrão, as opções são herdadas da thread pai.
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se isso for definido como `true`, então `worker.stdin` fornece um fluxo gravável cujo conteúdo aparece como `process.stdin` dentro do Worker. Por padrão, nenhum dado é fornecido.
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se isso for definido como `true`, então `worker.stdout` não é automaticamente direcionado para `process.stdout` no pai.
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se isso for definido como `true`, então `worker.stderr` não é automaticamente direcionado para `process.stderr` no pai.
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Qualquer valor JavaScript que é clonado e disponibilizado como [`require('node:worker_threads').workerData`](/pt/nodejs/api/worker_threads#workerworkerdata). A clonagem ocorre como descrito no [algoritmo de clonagem estruturada HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), e um erro é lançado se o objeto não puder ser clonado (por exemplo, porque contém `function`s).
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se isso for definido como `true`, então o Worker rastreia descritores de arquivo brutos gerenciados através de [`fs.open()`](/pt/nodejs/api/fs#fsopenpath-flags-mode-callback) e [`fs.close()`](/pt/nodejs/api/fs#fsclosefd-callback), e os fecha quando o Worker sai, semelhante a outros recursos como soquetes de rede ou descritores de arquivo gerenciados através da API [`FileHandle`](/pt/nodejs/api/fs#class-filehandle). Esta opção é automaticamente herdada por todos os `Worker`s aninhados. **Padrão:** `true`.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se um ou mais objetos semelhantes a `MessagePort` forem passados em `workerData`, uma `transferList` é necessária para esses itens ou [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/pt/nodejs/api/errors#err_missing_message_port_in_transfer_list) é lançado. Consulte [`port.postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist) para obter mais informações.
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um conjunto opcional de limites de recursos para a nova instância do mecanismo JS. Atingir esses limites leva ao término da instância `Worker`. Esses limites afetam apenas o mecanismo JS e nenhum dado externo, incluindo nenhum `ArrayBuffer`. Mesmo que esses limites sejam definidos, o processo ainda pode ser abortado se encontrar uma situação global de falta de memória.
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo do heap principal em MB. Se o argumento de linha de comando [`--max-old-space-size`](/pt/nodejs/api/cli#--max-old-space-sizesize-in-mib) for definido, ele substituirá esta configuração.
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo de um espaço de heap para objetos criados recentemente. Se o argumento de linha de comando [`--max-semi-space-size`](/pt/nodejs/api/cli#--max-semi-space-sizesize-in-mib) for definido, ele substituirá esta configuração.
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho de um intervalo de memória pré-alocado usado para código gerado.
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo padrão da pilha para a thread. Valores pequenos podem levar a instâncias Worker inutilizáveis. **Padrão:** `4`.

    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um `name` opcional a ser anexado ao título do worker para fins de depuração/identificação, tornando o título final como `[worker ${id}] ${name}`. **Padrão:** `''`.


### Evento: `'error'` {#event-error}

**Adicionado em: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

O evento `'error'` é emitido se a thread worker lançar uma exceção não capturada. Nesse caso, o worker é terminado.

### Evento: `'exit'` {#event-exit}

**Adicionado em: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O evento `'exit'` é emitido quando o worker para. Se o worker saiu chamando [`process.exit()`](/pt/nodejs/api/process#processexitcode), o parâmetro `exitCode` é o código de saída passado. Se o worker foi terminado, o parâmetro `exitCode` é `1`.

Este é o evento final emitido por qualquer instância `Worker`.

### Evento: `'message'` {#event-message_1}

**Adicionado em: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor transmitido

O evento `'message'` é emitido quando a thread worker invocou [`require('node:worker_threads').parentPort.postMessage()`](/pt/nodejs/api/worker_threads#workerpostmessagevalue-transferlist). Consulte o evento [`port.on('message')`](/pt/nodejs/api/worker_threads#event-message) para obter mais detalhes.

Todas as mensagens enviadas da thread worker são emitidas antes que o [`'exit'` event`](/pt/nodejs/api/worker_threads#event-exit) seja emitido no objeto `Worker`.

### Evento: `'messageerror'` {#event-messageerror_1}

**Adicionado em: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um objeto Error

O evento `'messageerror'` é emitido quando a desserialização de uma mensagem falha.

### Evento: `'online'` {#event-online}

**Adicionado em: v10.5.0**

O evento `'online'` é emitido quando a thread worker começou a executar o código JavaScript.

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.1.0 | Suporte para opções para configurar o heap snapshot. |
| v13.9.0, v12.17.0 | Adicionado em: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se verdadeiro, expõe os internos no heap snapshot. **Padrão:** `false`.
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se verdadeiro, expõe valores numéricos em campos artificiais. **Padrão:** `false`.
  
 
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Uma promise para um Readable Stream contendo um V8 heap snapshot

Retorna um stream legível para um snapshot V8 do estado atual do Worker. Consulte [`v8.getHeapSnapshot()`](/pt/nodejs/api/v8#v8getheapsnapshotoptions) para obter mais detalhes.

Se a thread Worker não estiver mais em execução, o que pode ocorrer antes que o evento [`'exit'` event`](/pt/nodejs/api/worker_threads#event-exit) seja emitido, a `Promise` retornada é rejeitada imediatamente com um erro [`ERR_WORKER_NOT_RUNNING`](/pt/nodejs/api/errors#err_worker_not_running).


### `worker.performance` {#workerperformance}

**Adicionado em: v15.1.0, v14.17.0, v12.22.0**

Um objeto que pode ser usado para consultar informações de desempenho de uma instância de worker. Semelhante a [`perf_hooks.performance`](/pt/nodejs/api/perf_hooks#perf_hooksperformance).

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Adicionado em: v15.1.0, v14.17.0, v12.22.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O resultado de uma chamada anterior para `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O resultado de uma chamada anterior para `eventLoopUtilization()` antes de `utilization1`.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A mesma chamada que [`perf_hooks` `eventLoopUtilization()`](/pt/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2), exceto que os valores da instância do worker são retornados.

Uma diferença é que, ao contrário da thread principal, o bootstrapping dentro de um worker é feito dentro do loop de eventos. Portanto, a utilização do loop de eventos está imediatamente disponível assim que o script do worker começa a ser executado.

Um tempo `idle` que não aumenta não indica que o worker está preso no bootstrap. Os exemplos a seguir mostram como toda a vida útil do worker nunca acumula nenhum tempo `idle`, mas ainda é capaz de processar mensagens.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
A utilização do loop de eventos de um worker está disponível somente após o evento [`'online'` emitido](/pt/nodejs/api/worker_threads#event-online) e, se chamado antes disso ou após o evento [`'exit'` emitido](/pt/nodejs/api/worker_threads#event-exit), todas as propriedades têm o valor de `0`.


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**Adicionado em: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Envia uma mensagem ao worker que é recebida via [`require('node:worker_threads').parentPort.on('message')`](/pt/nodejs/api/worker_threads#event-message). Consulte [`port.postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist) para obter mais detalhes.

### `worker.ref()` {#workerref}

**Adicionado em: v10.5.0**

O oposto de `unref()`, chamar `ref()` em um worker previamente `unref()`ed *não* permite que o programa saia se for o único handle ativo restante (o comportamento padrão). Se o worker for `ref()`ed, chamar `ref()` novamente não tem efeito.

### `worker.resourceLimits` {#workerresourcelimits_1}

**Adicionado em: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Fornece o conjunto de restrições de recursos do motor JS para este thread Worker. Se a opção `resourceLimits` foi passada para o construtor [`Worker`](/pt/nodejs/api/worker_threads#class-worker), isso corresponde aos seus valores.

Se o worker parou, o valor de retorno é um objeto vazio.

### `worker.stderr` {#workerstderr}

**Adicionado em: v10.5.0**

- [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)

Este é um stream legível que contém dados gravados em [`process.stderr`](/pt/nodejs/api/process#processstderr) dentro do thread worker. Se `stderr: true` não foi passado para o construtor [`Worker`](/pt/nodejs/api/worker_threads#class-worker), então os dados são enviados para o stream [`process.stderr`](/pt/nodejs/api/process#processstderr) do thread pai.


### `worker.stdin` {#workerstdin}

**Adicionado em: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)

Se `stdin: true` foi passado para o construtor [`Worker`](/pt/nodejs/api/worker_threads#class-worker), este é um fluxo gravável. Os dados gravados neste fluxo estarão disponíveis na thread do worker como [`process.stdin`](/pt/nodejs/api/process#processstdin).

### `worker.stdout` {#workerstdout}

**Adicionado em: v10.5.0**

- [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable)

Este é um fluxo legível que contém dados gravados em [`process.stdout`](/pt/nodejs/api/process#processstdout) dentro da thread do worker. Se `stdout: true` não foi passado para o construtor [`Worker`](/pt/nodejs/api/worker_threads#class-worker), então os dados são canalizados para o fluxo [`process.stdout`](/pt/nodejs/api/process#processstdout) da thread pai.

### `worker.terminate()` {#workerterminate}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.5.0 | Esta função agora retorna uma Promise. Passar um callback está obsoleto e era inútil até esta versão, pois o Worker era realmente terminado de forma síncrona. Terminar agora é uma operação totalmente assíncrona. |
| v10.5.0 | Adicionado em: v10.5.0 |
:::

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Interrompe toda a execução de JavaScript na thread do worker o mais rápido possível. Retorna uma Promise para o código de saída que é cumprida quando o evento [`'exit'` ](/pt/nodejs/api/worker_threads#event-exit) é emitido.

### `worker.threadId` {#workerthreadid_1}

**Adicionado em: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Um identificador inteiro para a thread referenciada. Dentro da thread do worker, está disponível como [`require('node:worker_threads').threadId`](/pt/nodejs/api/worker_threads#workerthreadid). Este valor é único para cada instância `Worker` dentro de um único processo.

### `worker.unref()` {#workerunref}

**Adicionado em: v10.5.0**

Chamar `unref()` em um worker permite que a thread saia se este for o único identificador ativo no sistema de eventos. Se o worker já estiver `unref()`ed, chamar `unref()` novamente não tem efeito.


## Notas {#notes}

### Bloqueio Síncrono de stdio {#synchronous-blocking-of-stdio}

Os `Worker`s utilizam passagem de mensagens através de [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport) para implementar interações com `stdio`. Isso significa que a saída `stdio` originada de um `Worker` pode ser bloqueada por código síncrono na extremidade receptora que está bloqueando o loop de eventos do Node.js.

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // Looping to simulate work.
  }
} else {
  // This output will be blocked by the for loop in the main thread.
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // Looping to simulate work.
  }
} else {
  // This output will be blocked by the for loop in the main thread.
  console.log('foo');
}
```
:::

### Iniciando threads worker a partir de scripts de pré-carregamento {#launching-worker-threads-from-preload-scripts}

Tenha cuidado ao iniciar threads worker a partir de scripts de pré-carregamento (scripts carregados e executados usando o sinalizador de linha de comando `-r`). A menos que a opção `execArgv` seja explicitamente definida, novas threads Worker herdam automaticamente os sinalizadores de linha de comando do processo em execução e pré-carregarão os mesmos scripts de pré-carregamento que a thread principal. Se o script de pré-carregamento iniciar incondicionalmente uma thread worker, cada thread gerada irá gerar outra até que o aplicativo falhe.

