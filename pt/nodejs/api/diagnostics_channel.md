---
title: Canal de Diagnóstico do Node.js
description: O módulo Canal de Diagnóstico no Node.js fornece uma API para criar, publicar e se inscrever em canais nomeados de informações de diagnóstico, permitindo um melhor monitoramento e depuração de aplicações.
head:
  - - meta
    - name: og:title
      content: Canal de Diagnóstico do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo Canal de Diagnóstico no Node.js fornece uma API para criar, publicar e se inscrever em canais nomeados de informações de diagnóstico, permitindo um melhor monitoramento e depuração de aplicações.
  - - meta
    - name: twitter:title
      content: Canal de Diagnóstico do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo Canal de Diagnóstico no Node.js fornece uma API para criar, publicar e se inscrever em canais nomeados de informações de diagnóstico, permitindo um melhor monitoramento e depuração de aplicações.
---


# Canal de Diagnósticos {#diagnostics-channel}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.2.0, v18.13.0 | diagnostics_channel agora é Estável. |
| v15.1.0, v14.17.0 | Adicionado em: v15.1.0, v14.17.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

O módulo `node:diagnostics_channel` fornece uma API para criar canais nomeados para relatar dados de mensagens arbitrárias para fins de diagnóstico.

Ele pode ser acessado usando:

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

É pretendido que um escritor de módulo que deseja relatar mensagens de diagnóstico crie um ou vários canais de nível superior para relatar mensagens. Canais também podem ser adquiridos em tempo de execução, mas não é encorajado devido à sobrecarga adicional de fazê-lo. Canais podem ser exportados por conveniência, mas desde que o nome seja conhecido, ele pode ser adquirido em qualquer lugar.

Se você pretende que seu módulo produza dados de diagnóstico para outros consumirem, é recomendável que você inclua documentação de quais canais nomeados são usados, juntamente com o formato dos dados da mensagem. Nomes de canal geralmente devem incluir o nome do módulo para evitar colisões com dados de outros módulos.

## API Pública {#public-api}

### Visão Geral {#overview}

A seguir, uma visão geral simples da API pública.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// Obtenha um objeto de canal reutilizável
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Dados recebidos
}

// Inscreva-se no canal
diagnostics_channel.subscribe('my-channel', onMessage);

// Verifique se o canal tem um assinante ativo
if (channel.hasSubscribers) {
  // Publique dados no canal
  channel.publish({
    some: 'data',
  });
}

// Cancele a inscrição no canal
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// Obtenha um objeto de canal reutilizável
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Dados recebidos
}

// Inscreva-se no canal
diagnostics_channel.subscribe('my-channel', onMessage);

// Verifique se o canal tem um assinante ativo
if (channel.hasSubscribers) {
  // Publique dados no canal
  channel.publish({
    some: 'data',
  });
}

// Cancele a inscrição no canal
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**Adicionado em: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do canal
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se houver assinantes ativos

Verifica se há assinantes ativos no canal nomeado. Isso é útil se a mensagem que você deseja enviar pode ser cara para preparar.

Esta API é opcional, mas útil ao tentar publicar mensagens de código com desempenho muito sensível.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Há assinantes, preparar e publicar mensagem
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Há assinantes, preparar e publicar mensagem
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**Adicionado em: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do canal
- Retorna: [\<Channel\>](/pt/nodejs/api/diagnostics_channel#class-channel) O objeto de canal nomeado

Este é o ponto de entrada principal para quem deseja publicar em um canal nomeado. Ele produz um objeto de canal que é otimizado para reduzir a sobrecarga no momento da publicação o máximo possível.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**Adicionado em: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do canal
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O manipulador para receber mensagens do canal
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Os dados da mensagem
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do canal

Registre um manipulador de mensagens para se inscrever neste canal. Este manipulador de mensagens será executado de forma síncrona sempre que uma mensagem for publicada no canal. Quaisquer erros lançados no manipulador de mensagens acionarão um [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Dados recebidos
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Dados recebidos
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**Adicionado em: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do canal
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O manipulador inscrito anteriormente a ser removido
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o manipulador foi encontrado, `false` caso contrário.

Remove um manipulador de mensagens previamente registrado neste canal com [`diagnostics_channel.subscribe(name, onMessage)`](/pt/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Dados recebidos
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Dados recebidos
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/pt/nodejs/api/diagnostics_channel#class-tracingchannel) Nome do canal ou objeto contendo todos os [Canais TracingChannel](/pt/nodejs/api/diagnostics_channel#tracingchannel-channels)
- Retorna: [\<TracingChannel\>](/pt/nodejs/api/diagnostics_channel#class-tracingchannel) Coleção de canais para rastrear com

Cria um wrapper [`TracingChannel`](/pt/nodejs/api/diagnostics_channel#class-tracingchannel) para os [Canais TracingChannel](/pt/nodejs/api/diagnostics_channel#tracingchannel-channels) fornecidos. Se um nome for fornecido, os canais de rastreamento correspondentes serão criados no formato `tracing:${name}:${eventType}`, onde `eventType` corresponde aos tipos de [Canais TracingChannel](/pt/nodejs/api/diagnostics_channel#tracingchannel-channels).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// ou...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// ou...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### Classe: `Channel` {#class-channel}

**Adicionado em: v15.1.0, v14.17.0**

A classe `Channel` representa um canal nomeado individual dentro do pipeline de dados. Ela é usada para rastrear assinantes e para publicar mensagens quando há assinantes presentes. Ela existe como um objeto separado para evitar pesquisas de canal no momento da publicação, permitindo velocidades de publicação muito rápidas e permitindo uso intenso, incorrendo em um custo mínimo. Canais são criados com [`diagnostics_channel.channel(name)`](/pt/nodejs/api/diagnostics_channel#diagnostics_channelchannelname), construir um canal diretamente com `new Channel(name)` não é suportado.

#### `channel.hasSubscribers` {#channelhassubscribers}

**Adicionado em: v15.1.0, v14.17.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se existem assinantes ativos

Verifique se existem assinantes ativos neste canal. Isso é útil se a mensagem que você deseja enviar pode ser cara para preparar.

Esta API é opcional, mas útil ao tentar publicar mensagens de código com sensibilidade de desempenho muito alta.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // Existem assinantes, prepare e publique a mensagem
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // Existem assinantes, prepare e publique a mensagem
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**Adicionado em: v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A mensagem a ser enviada aos assinantes do canal

Publique uma mensagem para qualquer assinante do canal. Isso acionará manipuladores de mensagens de forma síncrona, para que eles sejam executados dentro do mesmo contexto.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**Adicionado em: v15.1.0, v14.17.0**

**Obsoleto desde: v18.7.0, v16.17.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`diagnostics_channel.subscribe(name, onMessage)`](/pt/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O manipulador para receber mensagens do canal
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Os dados da mensagem
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do canal
  
 

Registra um manipulador de mensagens para se inscrever neste canal. Este manipulador de mensagens será executado de forma síncrona sempre que uma mensagem for publicada no canal. Quaisquer erros lançados no manipulador de mensagens acionarão um [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.7.0, v16.17.0 | Obsoleto desde: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | Valor de retorno adicionado. Adicionado a canais sem inscritos. |
| v15.1.0, v14.17.0 | Adicionado em: v15.1.0, v14.17.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`diagnostics_channel.unsubscribe(name, onMessage)`](/pt/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O manipulador inscrito anterior para remover
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o manipulador foi encontrado, `false` caso contrário.

Remove um manipulador de mensagens previamente registrado neste canal com [`channel.subscribe(onMessage)`](/pt/nodejs/api/diagnostics_channel#channelsubscribeonmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<AsyncLocalStorage\>](/pt/nodejs/api/async_context#class-asynclocalstorage) O armazenamento ao qual vincular os dados de contexto
- `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Transforma dados de contexto antes de definir o contexto de armazenamento

Quando [`channel.runStores(context, ...)`](/pt/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) é chamado, os dados de contexto fornecidos serão aplicados a qualquer armazenamento vinculado ao canal. Se o armazenamento já tiver sido vinculado, a função `transform` anterior será substituída pela nova. A função `transform` pode ser omitida para definir os dados de contexto fornecidos como o contexto diretamente.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<AsyncLocalStorage\>](/pt/nodejs/api/async_context#class-asynclocalstorage) O armazenamento a ser desvinculado do canal.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o armazenamento foi encontrado, `false` caso contrário.

Remove um manipulador de mensagens previamente registrado neste canal com [`channel.bindStore(store)`](/pt/nodejs/api/diagnostics_channel#channelbindstorestore-transform).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Mensagem para enviar aos assinantes e vincular aos armazenamentos
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Manipulador para executar dentro do contexto de armazenamento inserido
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O receptor a ser usado para a chamada de função.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionais para passar para a função.

Aplica os dados fornecidos a quaisquer instâncias AsyncLocalStorage vinculadas ao canal durante a duração da função fornecida e, em seguida, publica no canal dentro do escopo em que esses dados são aplicados aos armazenamentos.

Se uma função de transformação foi dada para [`channel.bindStore(store)`](/pt/nodejs/api/diagnostics_channel#channelbindstorestore-transform), ela será aplicada para transformar os dados da mensagem antes que se torne o valor de contexto para o armazenamento. O contexto de armazenamento anterior é acessível de dentro da função de transformação nos casos em que a vinculação de contexto é necessária.

O contexto aplicado ao armazenamento deve estar acessível em qualquer código assíncrono que continue a partir da execução que começou durante a função fornecida, no entanto, existem algumas situações em que [perda de contexto](/pt/nodejs/api/async_context#troubleshooting-context-loss) pode ocorrer.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### Classe: `TracingChannel` {#class-tracingchannel}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

A classe `TracingChannel` é uma coleção de [Canais TracingChannel](/pt/nodejs/api/diagnostics_channel#tracingchannel-channels) que, juntos, expressam uma única ação rastreável. É usada para formalizar e simplificar o processo de produção de eventos para rastrear o fluxo do aplicativo. [`diagnostics_channel.tracingChannel()`](/pt/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) é usado para construir um `TracingChannel`. Assim como com `Channel`, é recomendado criar e reutilizar um único `TracingChannel` no nível superior do arquivo, em vez de criá-los dinamicamente.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `subscribers` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Conjunto de assinantes de [Canais TracingChannel](/pt/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do [`start` event](/pt/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do [`end` event](/pt/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do [`asyncStart` event](/pt/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do [`asyncEnd` event](/pt/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do [`error` event](/pt/nodejs/api/diagnostics_channel#errorevent)
  
 

Auxiliar para inscrever uma coleção de funções nos canais correspondentes. Isso é o mesmo que chamar [`channel.subscribe(onMessage)`](/pt/nodejs/api/diagnostics_channel#channelsubscribeonmessage) em cada canal individualmente.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Conjunto de assinantes de [Canais TracingChannel](/pt/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do evento [`start`](/pt/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do evento [`end`](/pt/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do evento [`asyncStart`](/pt/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do evento [`asyncEnd`](/pt/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O assinante do evento [`error`](/pt/nodejs/api/diagnostics_channel#errorevent)
  
 
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se todos os manipuladores foram desinscritos com sucesso e `false` caso contrário.

Auxiliar para cancelar a inscrição de uma coleção de funções dos canais correspondentes. Isso é o mesmo que chamar [`channel.unsubscribe(onMessage)`](/pt/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) em cada canal individualmente.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função para envolver um rastreamento
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto compartilhado para correlacionar eventos
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O receptor a ser usado para a chamada de função
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionais para passar para a função
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor de retorno da função fornecida

Rastreie uma chamada de função síncrona. Isso sempre produzirá um evento [`start` event](/pt/nodejs/api/diagnostics_channel#startevent) e [`end` event](/pt/nodejs/api/diagnostics_channel#endevent) em torno da execução e pode produzir um [`error` event](/pt/nodejs/api/diagnostics_channel#errorevent) se a função fornecida lançar um erro. Isso executará a função fornecida usando [`channel.runStores(context, ...)`](/pt/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) no canal `start`, o que garante que todos os eventos devem ter quaisquer armazenamentos vinculados definidos para corresponder a este contexto de rastreamento.

Para garantir que apenas gráficos de rastreamento corretos sejam formados, os eventos só serão publicados se houver assinantes presentes antes de iniciar o rastreamento. Assinaturas que são adicionadas após o início do rastreamento não receberão eventos futuros desse rastreamento, apenas rastreamentos futuros serão vistos.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Função que retorna uma Promise para envolver um rastreamento
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto compartilhado para correlacionar eventos de rastreamento
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O receptor a ser usado para a chamada da função
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionais para passar para a função
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Encadeada da promise retornada pela função fornecida

Rastreia uma chamada de função que retorna uma promise. Isso sempre produzirá um evento [`start` event](/pt/nodejs/api/diagnostics_channel#startevent) e um evento [`end` event](/pt/nodejs/api/diagnostics_channel#endevent) em torno da porção síncrona da execução da função e produzirá um evento [`asyncStart` event](/pt/nodejs/api/diagnostics_channel#asyncstartevent) e um evento [`asyncEnd` event](/pt/nodejs/api/diagnostics_channel#asyncendevent) quando uma continuação da promise for alcançada. Também pode produzir um evento [`error` event](/pt/nodejs/api/diagnostics_channel#errorevent) se a função fornecida lançar um erro ou se a promise retornada for rejeitada. Isso executará a função fornecida usando [`channel.runStores(context, ...)`](/pt/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) no canal `start`, o que garante que todos os eventos tenham todos os armazenamentos vinculados definidos para corresponder a este contexto de rastreamento.

Para garantir que apenas gráficos de rastreamento corretos sejam formados, os eventos só serão publicados se os assinantes estiverem presentes antes de iniciar o rastreamento. As assinaturas que são adicionadas depois que o rastreamento começa não receberão eventos futuros desse rastreamento, apenas rastreamentos futuros serão vistos.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**Adicionado em: v19.9.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) callback usando função para envolver um trace
- `position` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Posição do argumento indexado em zero do callback esperado (o padrão é o último argumento se `undefined` for passado)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto compartilhado para correlacionar eventos de trace (o padrão é `{}` se `undefined` for passado)
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O receptor a ser usado para a chamada de função
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) argumentos para passar para a função (deve incluir o callback)
- Retorna: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor de retorno da função fornecida

Trace uma chamada de função que recebe callback. Espera-se que o callback siga a convenção de erro como o primeiro argumento normalmente usado. Isso sempre produzirá um evento [`start` event](/pt/nodejs/api/diagnostics_channel#startevent) e [`end` event](/pt/nodejs/api/diagnostics_channel#endevent) em torno da porção síncrona da execução da função e produzirá um evento [`asyncStart` event](/pt/nodejs/api/diagnostics_channel#asyncstartevent) e [`asyncEnd` event](/pt/nodejs/api/diagnostics_channel#asyncendevent) em torno da execução do callback. Também pode produzir um evento [`error` event](/pt/nodejs/api/diagnostics_channel#errorevent) se a função fornecida lançar ou o primeiro argumento passado para o callback for definido. Isso executará a função fornecida usando [`channel.runStores(context, ...)`](/pt/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) no canal `start`, o que garante que todos os eventos devem ter todos os stores vinculados definidos para corresponder a este contexto de trace.

Para garantir que apenas gráficos de trace corretos sejam formados, os eventos só serão publicados se os assinantes estiverem presentes antes de iniciar o trace. As assinaturas adicionadas após o início do trace não receberão eventos futuros desse trace, apenas traces futuros serão vistos.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

O callback também será executado com [`channel.runStores(context, ...)`](/pt/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args), o que permite a recuperação da perda de contexto em alguns casos.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**Adicionado em: v22.0.0, v20.13.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se algum dos canais individuais tiver um subscritor, `false` caso contrário.

Este é um método auxiliar disponível em uma instância de [`TracingChannel`](/pt/nodejs/api/diagnostics_channel#class-tracingchannel) para verificar se algum dos [Canais TracingChannel](/pt/nodejs/api/diagnostics_channel#tracingchannel-channels) possui subscritores. Um valor `true` é retornado se algum deles tiver pelo menos um subscritor, um valor `false` é retornado caso contrário.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```
:::

### Canais TracingChannel {#tracingchannel-channels}

Um TracingChannel é uma coleção de vários diagnostics_channels representando pontos específicos no ciclo de vida de execução de uma única ação rastreável. O comportamento é dividido em cinco diagnostics_channels consistindo em `start`, `end`, `asyncStart`, `asyncEnd` e `error`. Uma única ação rastreável compartilhará o mesmo objeto de evento entre todos os eventos, o que pode ser útil para gerenciar a correlação por meio de um weakmap.

Esses objetos de evento serão estendidos com valores `result` ou `error` quando a tarefa "concluir". No caso de uma tarefa síncrona, o `result` será o valor de retorno e o `error` será qualquer coisa lançada da função. Com funções assíncronas baseadas em callback, o `result` será o segundo argumento do callback, enquanto o `error` será um erro lançado visível no evento `end` ou o primeiro argumento do callback em qualquer um dos eventos `asyncStart` ou `asyncEnd`.

Para garantir que apenas gráficos de rastreamento corretos sejam formados, os eventos devem ser publicados apenas se os subscritores estiverem presentes antes de iniciar o rastreamento. Assinaturas que são adicionadas após o início do rastreamento não devem receber eventos futuros desse rastreamento, apenas rastreamentos futuros serão vistos.

Os canais de rastreamento devem seguir um padrão de nomenclatura de:

- `tracing:module.class.method:start` ou `tracing:module.function:start`
- `tracing:module.class.method:end` ou `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` ou `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` ou `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` ou `tracing:module.function:error`


#### `start(event)` {#startevent}

- Nome: `tracing:${name}:start`

O evento `start` representa o ponto em que uma função é chamada. Neste ponto, os dados do evento podem conter argumentos de função ou qualquer outra coisa disponível no início da execução da função.

#### `end(event)` {#endevent}

- Nome: `tracing:${name}:end`

O evento `end` representa o ponto em que uma chamada de função retorna um valor. No caso de uma função assíncrona, isso ocorre quando a promessa é retornada, não quando a própria função faz uma declaração de retorno internamente. Neste ponto, se a função rastreada for síncrona, o campo `result` será definido com o valor de retorno da função. Alternativamente, o campo `error` pode estar presente para representar quaisquer erros lançados.

É recomendável ouvir especificamente o evento `error` para rastrear erros, pois pode ser possível que uma ação rastreável produza vários erros. Por exemplo, uma tarefa assíncrona que falha pode ser iniciada internamente antes da parte síncrona da tarefa e, em seguida, lança um erro.

#### `asyncStart(event)` {#asyncstartevent}

- Nome: `tracing:${name}:asyncStart`

O evento `asyncStart` representa o retorno de chamada ou a continuação de uma função rastreável sendo alcançada. Neste ponto, coisas como argumentos de retorno de chamada podem estar disponíveis, ou qualquer outra coisa que expresse o "resultado" da ação.

Para funções baseadas em retornos de chamada, o primeiro argumento do retorno de chamada será atribuído ao campo `error`, se não for `undefined` ou `null`, e o segundo argumento será atribuído ao campo `result`.

Para promessas, o argumento para o caminho `resolve` será atribuído a `result` ou o argumento para o caminho `reject` será atribuído a `error`.

É recomendável ouvir especificamente o evento `error` para rastrear erros, pois pode ser possível que uma ação rastreável produza vários erros. Por exemplo, uma tarefa assíncrona que falha pode ser iniciada internamente antes da parte síncrona da tarefa e, em seguida, lança um erro.

#### `asyncEnd(event)` {#asyncendevent}

- Nome: `tracing:${name}:asyncEnd`

O evento `asyncEnd` representa o retorno de chamada de uma função assíncrona retornando. Não é provável que os dados do evento mudem após o evento `asyncStart`, no entanto, pode ser útil ver o ponto em que o retorno de chamada é concluído.


#### `error(event)` {#errorevent}

- Nome: `tracing:${name}:error`

O evento `error` representa qualquer erro produzido pela função rastreável, seja síncrona ou assincronamente. Se um erro for lançado na porção síncrona da função rastreada, o erro será atribuído ao campo `error` do evento e o evento `error` será acionado. Se um erro for recebido assincronamente através de um callback ou rejeição de promessa, ele também será atribuído ao campo `error` do evento e acionará o evento `error`.

É possível que uma única chamada de função rastreável produza erros várias vezes, portanto, isso deve ser considerado ao consumir este evento. Por exemplo, se outra tarefa assíncrona for acionada internamente, falhar e, em seguida, a parte síncrona da função lançar um erro, dois eventos `error` serão emitidos, um para o erro síncrono e outro para o erro assíncrono.

### Canais Integrados {#built-in-channels}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Embora a API diagnostics_channel seja agora considerada estável, os canais integrados atualmente disponíveis não são. Cada canal deve ser declarado estável independentemente.

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)

Emitido quando o cliente cria um objeto de requisição. Ao contrário de `http.client.request.start`, este evento é emitido antes que a requisição seja enviada.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)

Emitido quando o cliente inicia uma requisição.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido quando ocorre um erro durante uma requisição do cliente.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)

Emitido quando o cliente recebe uma resposta.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/pt/nodejs/api/http#class-httpserver)

Emitido quando o servidor recebe uma requisição.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)

Emitido quando o servidor cria uma resposta. O evento é emitido antes que a resposta seja enviada.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/pt/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/pt/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/pt/nodejs/api/http#class-httpserver)

Emitido quando o servidor envia uma resposta.


#### Módulos {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo as seguintes propriedades
    - `id` - Argumento passado para `require()`. Nome do módulo.
    - `parentFilename` - Nome do módulo que tentou require(id).
  
 

Emitido quando `require()` é executado. Veja o evento [`start`](/pt/nodejs/api/diagnostics_channel#startevent).

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo as seguintes propriedades
    - `id` - Argumento passado para `require()`. Nome do módulo.
    - `parentFilename` - Nome do módulo que tentou require(id).
  
 

Emitido quando uma chamada a `require()` retorna. Veja o evento [`end`](/pt/nodejs/api/diagnostics_channel#endevent).

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo as seguintes propriedades
    - `id` - Argumento passado para `require()`. Nome do módulo.
    - `parentFilename` - Nome do módulo que tentou require(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido quando um `require()` lança um erro. Veja o evento [`error`](/pt/nodejs/api/diagnostics_channel#errorevent).

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo as seguintes propriedades
    - `id` - Argumento passado para `import()`. Nome do módulo.
    - `parentURL` - Objeto URL do módulo que tentou import(id).
  
 

Emitido quando `import()` é invocado. Veja o evento [`asyncStart`](/pt/nodejs/api/diagnostics_channel#asyncstartevent).

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo as seguintes propriedades
    - `id` - Argumento passado para `import()`. Nome do módulo.
    - `parentURL` - Objeto URL do módulo que tentou import(id).
  
 

Emitido quando `import()` é concluído. Veja o evento [`asyncEnd`](/pt/nodejs/api/diagnostics_channel#asyncendevent).

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo as seguintes propriedades
    - `id` - Argumento passado para `import()`. Nome do módulo.
    - `parentURL` - Objeto URL do módulo que tentou import(id).
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido quando um `import()` lança um erro. Veja o evento [`error`](/pt/nodejs/api/diagnostics_channel#errorevent).


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Emitido quando um novo socket de cliente TCP ou pipe é criado.

`net.server.socket`

- `socket` [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Emitido quando uma nova conexão TCP ou pipe é recebida.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/pt/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Emitido quando [`net.Server.listen()`](/pt/nodejs/api/net#serverlisten) é invocado, antes da porta ou pipe ser realmente configurado.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Emitido quando [`net.Server.listen()`](/pt/nodejs/api/net#serverlisten) é concluído e, portanto, o servidor está pronto para aceitar conexões.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/pt/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Emitido quando [`net.Server.listen()`](/pt/nodejs/api/net#serverlisten) está retornando um erro.

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/pt/nodejs/api/dgram#class-dgramsocket)

Emitido quando um novo socket UDP é criado.

#### Process {#process}

**Adicionado em: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/pt/nodejs/api/child_process#class-childprocess)

Emitido quando um novo processo é criado.

#### Worker Thread {#worker-thread}

**Adicionado em: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/pt/nodejs/api/worker_threads#class-worker)

Emitido quando uma nova thread é criada.

