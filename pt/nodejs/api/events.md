---
title: Documentação do Node.js - Eventos
description: Explore o módulo de Eventos no Node.js, que oferece uma maneira de lidar com operações assíncronas através da programação orientada a eventos. Aprenda sobre emissores de eventos, ouvintes e como gerenciar eventos de forma eficaz.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Eventos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore o módulo de Eventos no Node.js, que oferece uma maneira de lidar com operações assíncronas através da programação orientada a eventos. Aprenda sobre emissores de eventos, ouvintes e como gerenciar eventos de forma eficaz.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Eventos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore o módulo de Eventos no Node.js, que oferece uma maneira de lidar com operações assíncronas através da programação orientada a eventos. Aprenda sobre emissores de eventos, ouvintes e como gerenciar eventos de forma eficaz.
---


# Eventos {#events}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

Grande parte da API central do Node.js é construída em torno de uma arquitetura idiomática assíncrona orientada a eventos, na qual certos tipos de objetos (chamados de "emissores") emitem eventos nomeados que fazem com que objetos `Function` ("ouvintes") sejam chamados.

Por exemplo: um objeto [`net.Server`](/pt/nodejs/api/net#class-netserver) emite um evento cada vez que um par se conecta a ele; um [`fs.ReadStream`](/pt/nodejs/api/fs#class-fsreadstream) emite um evento quando o arquivo é aberto; um [stream](/pt/nodejs/api/stream) emite um evento sempre que os dados estão disponíveis para leitura.

Todos os objetos que emitem eventos são instâncias da classe `EventEmitter`. Esses objetos expõem uma função `eventEmitter.on()` que permite que uma ou mais funções sejam anexadas a eventos nomeados emitidos pelo objeto. Normalmente, os nomes de eventos são strings em _camelCase_, mas qualquer chave de propriedade JavaScript válida pode ser usada.

Quando o objeto `EventEmitter` emite um evento, todas as funções anexadas a esse evento específico são chamadas *sincronamente*. Quaisquer valores retornados pelos ouvintes chamados são *ignorados* e descartados.

O exemplo a seguir mostra uma instância simples de `EventEmitter` com um único ouvinte. O método `eventEmitter.on()` é usado para registrar ouvintes, enquanto o método `eventEmitter.emit()` é usado para acionar o evento.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('um evento ocorreu!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('um evento ocorreu!');
});
myEmitter.emit('event');
```
:::

## Passando argumentos e `this` para ouvintes {#passing-arguments-and-this-to-listeners}

O método `eventEmitter.emit()` permite que um conjunto arbitrário de argumentos seja passado para as funções de ouvinte. Lembre-se de que, quando uma função de ouvinte comum é chamada, a palavra-chave padrão `this` é intencionalmente definida para referenciar a instância `EventEmitter` à qual o ouvinte está anexado.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Imprime:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Imprime:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```
:::

É possível usar Funções de Seta ES6 como ouvintes, no entanto, ao fazer isso, a palavra-chave `this` não fará mais referência à instância `EventEmitter`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Imprime: a b undefined
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Imprime: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
:::

## Assíncrono vs. Síncrono {#asynchronous-vs-synchronous}

O `EventEmitter` chama todos os listeners de forma síncrona na ordem em que foram registrados. Isso garante a sequência adequada de eventos e ajuda a evitar condições de corrida e erros de lógica. Quando apropriado, as funções de listener podem mudar para um modo de operação assíncrono usando os métodos `setImmediate()` ou `process.nextTick()`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## Lidando com eventos apenas uma vez {#handling-events-only-once}

Quando um listener é registrado usando o método `eventEmitter.on()`, esse listener é invocado *toda vez* que o evento nomeado é emitido.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```
:::

Usando o método `eventEmitter.once()`, é possível registrar um listener que é chamado no máximo uma vez para um evento específico. Assim que o evento é emitido, o listener é removido do registro e *então* chamado.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
:::


## Eventos de Erro {#error-events}

Quando ocorre um erro dentro de uma instância de `EventEmitter`, a ação típica é que um evento `'error'` seja emitido. Estes são tratados como casos especiais dentro do Node.js.

Se um `EventEmitter` *não* tiver pelo menos um ouvinte registrado para o evento `'error'`, e um evento `'error'` for emitido, o erro é lançado, um stack trace é impresso e o processo Node.js é encerrado.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Lança e trava o Node.js
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Lança e trava o Node.js
```
:::

Para se proteger contra a falha do processo Node.js, o módulo [`domain`](/pt/nodejs/api/domain) pode ser usado. (Observe, no entanto, que o módulo `node:domain` está obsoleto.)

Como uma melhor prática, os ouvintes devem sempre ser adicionados para os eventos `'error'`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Imprime: whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Imprime: whoops! there was an error
```
:::

É possível monitorar eventos `'error'` sem consumir o erro emitido instalando um ouvinte usando o símbolo `events.errorMonitor`.

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Ainda lança e trava o Node.js
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Ainda lança e trava o Node.js
```
:::


## Capturar rejeições de promises {#capture-rejections-of-promises}

Usar funções `async` com manipuladores de eventos é problemático, pois pode levar a uma rejeição não tratada em caso de uma exceção lançada:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```
:::

A opção `captureRejections` no construtor `EventEmitter` ou a configuração global alteram esse comportamento, instalando um manipulador `.then(undefined, handler)` na `Promise`. Este manipulador encaminha a exceção assincronamente para o método [`Symbol.for('nodejs.rejection')`](/pt/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) se houver um, ou para o manipulador de eventos [`'error'`](/pt/nodejs/api/events#error-events) se não houver.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```js [CJS]
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```
:::

Definir `events.captureRejections = true` mudará o padrão para todas as novas instâncias de `EventEmitter`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```js [CJS]
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```
:::

Os eventos `'error'` que são gerados pelo comportamento `captureRejections` não possuem um manipulador de captura para evitar loops de erro infinitos: a recomendação é **não usar funções <code>async</code> como manipuladores de eventos <code>'error'</code>**.


## Classe: `EventEmitter` {#class-eventemitter}

::: info [Histórico]
| Versão    | Mudanças                               |
| :-------- | :------------------------------------- |
| v13.4.0, v12.16.0 | Adicionada a opção captureRejections. |
| v0.1.26   | Adicionada em: v0.1.26                 |
:::

A classe `EventEmitter` é definida e exposta pelo módulo `node:events`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

Todos os `EventEmitter`s emitem o evento `'newListener'` quando novos listeners são adicionados e `'removeListener'` quando listeners existentes são removidos.

Ele suporta a seguinte opção:

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Habilita [a captura automática de rejeições de promessas](/pt/nodejs/api/events#capture-rejections-of-promises). **Padrão:** `false`.

### Evento: `'newListener'` {#event-newlistener}

**Adicionado em: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento que está sendo escutado
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de tratamento de eventos

A instância `EventEmitter` emitirá seu próprio evento `'newListener'` *antes* que um listener seja adicionado ao seu array interno de listeners.

Os listeners registrados para o evento `'newListener'` recebem o nome do evento e uma referência ao listener que está sendo adicionado.

O fato de o evento ser acionado antes de adicionar o listener tem um efeito colateral sutil, mas importante: quaisquer listeners *adicionais* registrados com o mesmo `name` *dentro* do callback `'newListener'` são inseridos *antes* do listener que está no processo de ser adicionado.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Faça isso apenas uma vez para não entrarmos em um loop infinito
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insere um novo listener na frente
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Imprime:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Faça isso apenas uma vez para não entrarmos em um loop infinito
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insere um novo listener na frente
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Imprime:
//   B
//   A
```
:::


### Evento: `'removeListener'` {#event-removelistener}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.1.0, v4.7.0 | Para listeners anexados usando `.once()`, o argumento `listener` agora produz a função listener original. |
| v0.9.3 | Adicionado em: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de tratamento de evento

O evento `'removeListener'` é emitido *após* o `listener` ser removido.

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**Adicionado em: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Alias para `emitter.on(eventName, listener)`.

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**Adicionado em: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Chama sincronamente cada um dos listeners registrados para o evento nomeado `eventName`, na ordem em que foram registrados, passando os argumentos fornecidos para cada um.

Retorna `true` se o evento tiver listeners, `false` caso contrário.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```
:::


### `emitter.eventNames()` {#emittereventnames}

**Adicionado em: v6.0.0**

- Retorna: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Retorna um array listando os eventos para os quais o emitter registrou listeners. Os valores no array são strings ou `Symbol`s.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Imprime: [ 'foo', 'bar', Symbol(symbol) ]
```

```js [CJS]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Imprime: [ 'foo', 'bar', Symbol(symbol) ]
```
:::

### `emitter.getMaxListeners()` {#emittergetmaxlisteners}

**Adicionado em: v1.0.0**

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o valor máximo atual de listener para o `EventEmitter` que é definido por [`emitter.setMaxListeners(n)`](/pt/nodejs/api/events#emittersetmaxlistenersn) ou o padrão é [`events.defaultMaxListeners`](/pt/nodejs/api/events#eventsdefaultmaxlisteners).

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.8.0, v18.16.0 | Adicionado o argumento `listener`. |
| v3.2.0 | Adicionado em: v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento que está sendo escutado
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de manipulador de eventos
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o número de listeners escutando o evento nomeado `eventName`. Se `listener` for fornecido, ele retornará quantas vezes o listener é encontrado na lista de listeners do evento.


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.0.0 | Para listeners anexados usando `.once()`, isso retorna os listeners originais em vez de funções wrapper agora. |
| v0.1.26 | Adicionado em: v0.1.26 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Retorna: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Retorna uma cópia do array de listeners para o evento nomeado `eventName`.

```js [ESM]
server.on('connection', (stream) => {
  console.log('alguém se conectou!');
});
console.log(util.inspect(server.listeners('connection')));
// Imprime: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**Adicionado em: v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Alias para [`emitter.removeListener()`](/pt/nodejs/api/events#emitterremovelistenereventname-listener).

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**Adicionado em: v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de callback
- Retorna: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Adiciona a função `listener` ao final do array de listeners para o evento nomeado `eventName`. Nenhuma verificação é feita para ver se o `listener` já foi adicionado. Várias chamadas passando a mesma combinação de `eventName` e `listener` resultarão na adição do `listener` e na chamada várias vezes.

```js [ESM]
server.on('connection', (stream) => {
  console.log('alguém se conectou!');
});
```
Retorna uma referência ao `EventEmitter`, para que as chamadas possam ser encadeadas.

Por padrão, os listeners de evento são invocados na ordem em que são adicionados. O método `emitter.prependListener()` pode ser usado como uma alternativa para adicionar o listener de evento ao início do array de listeners.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Imprime:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Imprime:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**Adicionado em: v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de callback
- Retorna: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Adiciona uma função `listener` **única** para o evento chamado `eventName`. A próxima vez que o `eventName` for acionado, este listener é removido e então invocado.

```js [ESM]
server.once('connection', (stream) => {
  console.log('Ah, temos nosso primeiro usuário!');
});
```
Retorna uma referência ao `EventEmitter`, para que as chamadas possam ser encadeadas.

Por padrão, os listeners de evento são invocados na ordem em que são adicionados. O método `emitter.prependOnceListener()` pode ser usado como uma alternativa para adicionar o listener de evento ao início do array de listeners.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**Adicionado em: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de callback
- Retorna: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Adiciona a função `listener` ao *início* do array de listeners para o evento chamado `eventName`. Nenhuma verificação é feita para verificar se o `listener` já foi adicionado. Múltiplas chamadas passando a mesma combinação de `eventName` e `listener` resultarão na adição e chamada do `listener` várias vezes.

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('alguém conectou!');
});
```
Retorna uma referência ao `EventEmitter`, para que as chamadas possam ser encadeadas.


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**Adicionado em: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de callback
- Retorna: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Adiciona uma função `listener` **única** para o evento chamado `eventName` ao *início* do array de listeners. Na próxima vez que `eventName` for acionado, este listener será removido e então invocado.

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, temos nosso primeiro usuário!');
});
```
Retorna uma referência ao `EventEmitter`, para que as chamadas possam ser encadeadas.

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**Adicionado em: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Retorna: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Remove todos os listeners, ou aqueles do `eventName` especificado.

É uma má prática remover listeners adicionados em outro lugar no código, particularmente quando a instância de `EventEmitter` foi criada por algum outro componente ou módulo (ex: sockets ou fluxos de arquivos).

Retorna uma referência ao `EventEmitter`, para que as chamadas possam ser encadeadas.

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**Adicionado em: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Remove o `listener` especificado do array de listeners para o evento chamado `eventName`.

```js [ESM]
const callback = (stream) => {
  console.log('alguém conectou!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()` removerá, no máximo, uma instância de um listener do array de listeners. Se algum listener individual foi adicionado múltiplas vezes ao array de listeners para o `eventName` especificado, então `removeListener()` deve ser chamado múltiplas vezes para remover cada instância.

Uma vez que um evento é emitido, todos os listeners anexados a ele no momento da emissão são chamados em ordem. Isso implica que qualquer chamada `removeListener()` ou `removeAllListeners()` *após* a emissão e *antes* que o último listener termine a execução não os removerá do `emit()` em progresso. Eventos subsequentes se comportam como esperado.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA remove o listener callbackB, mas ele ainda será chamado.
// Array interno de listeners no momento da emissão [callbackA, callbackB]
myEmitter.emit('event');
// Imprime:
//   A
//   B

// callbackB agora foi removido.
// Array interno de listeners [callbackA]
myEmitter.emit('event');
// Imprime:
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA remove o listener callbackB, mas ele ainda será chamado.
// Array interno de listeners no momento da emissão [callbackA, callbackB]
myEmitter.emit('event');
// Imprime:
//   A
//   B

// callbackB agora foi removido.
// Array interno de listeners [callbackA]
myEmitter.emit('event');
// Imprime:
//   A
```
:::

Como os listeners são gerenciados usando um array interno, chamar isso mudará os índices de posição de qualquer listener registrado *após* o listener sendo removido. Isso não afetará a ordem em que os listeners são chamados, mas significa que qualquer cópia do array de listeners retornado pelo método `emitter.listeners()` precisará ser recriada.

Quando uma única função foi adicionada como um manipulador múltiplas vezes para um único evento (como no exemplo abaixo), `removeListener()` removerá a instância adicionada mais recentemente. No exemplo, o listener `once('ping')` é removido:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```
:::

Retorna uma referência ao `EventEmitter`, para que as chamadas possam ser encadeadas.


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**Adicionado em: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Retorna: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Por padrão, os `EventEmitter`s exibirão um aviso se mais de `10` listeners forem adicionados para um evento específico. Este é um padrão útil que ajuda a encontrar vazamentos de memória. O método `emitter.setMaxListeners()` permite que o limite seja modificado para esta instância específica de `EventEmitter`. O valor pode ser definido como `Infinity` (ou `0`) para indicar um número ilimitado de listeners.

Retorna uma referência ao `EventEmitter`, para que as chamadas possam ser encadeadas.

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**Adicionado em: v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Retorna: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Retorna uma cópia do array de listeners para o evento chamado `eventName`, incluindo quaisquer wrappers (como aqueles criados por `.once()`).

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.4.0, v16.14.0 | Não é mais experimental. |
| v13.4.0, v12.16.0 | Adicionado em: v13.4.0, v12.16.0 |
:::

- `err` Error
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

O método `Symbol.for('nodejs.rejection')` é chamado caso uma rejeição de promise aconteça ao emitir um evento e [`captureRejections`](/pt/nodejs/api/events#capture-rejections-of-promises) esteja habilitado no emissor. É possível usar [`events.captureRejectionSymbol`](/pt/nodejs/api/events#eventscapturerejectionsymbol) no lugar de `Symbol.for('nodejs.rejection')`.

::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

```js [CJS]
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**Adicionado em: v0.11.2**

Por padrão, um máximo de `10` listeners podem ser registrados para qualquer evento único. Este limite pode ser alterado para instâncias individuais de `EventEmitter` usando o método [`emitter.setMaxListeners(n)`](/pt/nodejs/api/events#emittersetmaxlistenersn). Para alterar o padrão para *todas* as instâncias de `EventEmitter`, a propriedade `events.defaultMaxListeners` pode ser usada. Se este valor não for um número positivo, um `RangeError` é lançado.

Tome cuidado ao definir o `events.defaultMaxListeners` porque a alteração afeta *todas* as instâncias de `EventEmitter`, incluindo aquelas criadas antes da alteração ser feita. No entanto, chamar [`emitter.setMaxListeners(n)`](/pt/nodejs/api/events#emittersetmaxlistenersn) ainda tem precedência sobre `events.defaultMaxListeners`.

Este não é um limite rígido. A instância de `EventEmitter` permitirá que mais listeners sejam adicionados, mas exibirá um aviso de rastreamento para stderr indicando que um "possível vazamento de memória do EventEmitter" foi detectado. Para qualquer `EventEmitter` único, os métodos `emitter.getMaxListeners()` e `emitter.setMaxListeners()` podem ser usados para evitar temporariamente este aviso:

`defaultMaxListeners` não tem efeito nas instâncias de `AbortSignal`. Embora ainda seja possível usar [`emitter.setMaxListeners(n)`](/pt/nodejs/api/events#emittersetmaxlistenersn) para definir um limite de aviso para instâncias individuais de `AbortSignal`, por padrão, as instâncias de `AbortSignal` não avisarão.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

O sinalizador de linha de comando [`--trace-warnings`](/pt/nodejs/api/cli#--trace-warnings) pode ser usado para exibir o rastreamento de pilha para tais avisos.

O aviso emitido pode ser inspecionado com [`process.on('warning')`](/pt/nodejs/api/process#event-warning) e terá as propriedades adicionais `emitter`, `type` e `count`, referindo-se à instância do emissor de eventos, ao nome do evento e ao número de listeners anexados, respectivamente. Sua propriedade `name` é definida como `'MaxListenersExceededWarning'`.


## `events.errorMonitor` {#eventserrormonitor}

**Adicionado em: v13.6.0, v12.17.0**

Este símbolo deve ser usado para instalar um listener apenas para monitorar eventos `'error'`. Os listeners instalados usando este símbolo são chamados antes dos listeners `'error'` regulares.

Instalar um listener usando este símbolo não muda o comportamento quando um evento `'error'` é emitido. Portanto, o processo ainda travará se nenhum listener `'error'` regular estiver instalado.

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**Adicionado em: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Retorna: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Retorna uma cópia do array de listeners para o evento chamado `eventName`.

Para `EventEmitter`s, isso se comporta exatamente da mesma forma que chamar `.listeners` no emissor.

Para `EventTarget`s, esta é a única maneira de obter os listeners de evento para o alvo do evento. Isso é útil para fins de depuração e diagnóstico.

::: code-group
```js [ESM]
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```js [CJS]
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```
:::


## `events.getMaxListeners(emitterOrTarget)` {#eventsgetmaxlistenersemitterortarget}

**Adicionado em: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget)
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna a quantidade máxima de listeners atualmente definida.

Para `EventEmitter`s, isso se comporta exatamente da mesma forma que chamar `.getMaxListeners` no emitter.

Para `EventTarget`s, esta é a única maneira de obter o número máximo de listeners de eventos para o destino do evento. Se o número de manipuladores de eventos em um único EventTarget exceder o máximo definido, o EventTarget imprimirá um aviso.

::: code-group
```js [ESM]
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```js [CJS]
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```
:::

## `events.once(emitter, name[, options])` {#eventsonceemitter-name-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | A opção `signal` agora é suportada. |
| v11.13.0, v10.16.0 | Adicionado em: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Pode ser usado para cancelar a espera pelo evento.

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Cria uma `Promise` que é cumprida quando o `EventEmitter` emite o evento fornecido ou que é rejeitada se o `EventEmitter` emitir `'error'` durante a espera. A `Promise` será resolvida com um array de todos os argumentos emitidos para o evento fornecido.

Este método é intencionalmente genérico e funciona com a interface [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget) da plataforma web, que não possui semântica especial de evento `'error'` e não escuta o evento `'error'`.

::: code-group
```js [ESM]
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```js [CJS]
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```
:::

O tratamento especial do evento `'error'` é usado apenas quando `events.once()` é usado para esperar por outro evento. Se `events.once()` for usado para esperar pelo próprio evento '`error`', então ele é tratado como qualquer outro tipo de evento sem tratamento especial:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```
:::

Um [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) pode ser usado para cancelar a espera pelo evento:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```
:::


### Aguardando múltiplos eventos emitidos em `process.nextTick()` {#awaiting-multiple-events-emitted-on-processnexttick}

Existe um caso extremo que vale a pena notar ao usar a função `events.once()` para aguardar múltiplos eventos emitidos no mesmo lote de operações `process.nextTick()`, ou sempre que múltiplos eventos são emitidos sincronamente. Especificamente, como a fila `process.nextTick()` é esvaziada antes da fila de microtarefas `Promise`, e como `EventEmitter` emite todos os eventos sincronamente, é possível que `events.once()` perca um evento.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Esta Promise nunca será resolvida porque o evento 'foo' já
  // terá sido emitido antes da Promise ser criada.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Esta Promise nunca será resolvida porque o evento 'foo' já
  // terá sido emitido antes da Promise ser criada.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::

Para capturar ambos os eventos, crie cada uma das Promises *antes* de aguardar qualquer uma delas, então torna-se possível usar `Promise.all()`, `Promise.race()` ou `Promise.allSettled()`:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::


## `events.captureRejections` {#eventscapturerejections}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.4.0, v16.14.0 | Não é mais experimental. |
| v13.4.0, v12.16.0 | Adicionado em: v13.4.0, v12.16.0 |
:::

Valor: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Altera a opção `captureRejections` padrão em todos os novos objetos `EventEmitter`.

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.4.0, v16.14.0 | Não é mais experimental. |
| v13.4.0, v12.16.0 | Adicionado em: v13.4.0, v12.16.0 |
:::

Valor: `Symbol.for('nodejs.rejection')`

Veja como escrever um [manipulador de rejeição](/pt/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args) personalizado.

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**Adicionado em: v0.9.12**

**Obsoleto desde: v3.2.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`emitter.listenerCount()`](/pt/nodejs/api/events#emitterlistenercounteventname-listener) em vez disso.
:::

- `emitter` [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter) O emissor a ser consultado
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento

Um método de classe que retorna o número de listeners para o determinado `eventName` registrado no determinado `emitter`.

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | Suporte para opções `highWaterMark` e `lowWaterMark`, para consistência. As opções antigas ainda são suportadas. |
| v20.0.0 | As opções `close`, `highWatermark` e `lowWatermark` são suportadas agora. |
| v13.6.0, v12.16.0 | Adicionado em: v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) O nome do evento que está sendo escutado
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Pode ser usado para cancelar eventos de espera.
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nomes de eventos que encerrarão a iteração.
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `Number.MAX_SAFE_INTEGER` O limite superior. O emissor é pausado sempre que o tamanho dos eventos em buffer é maior que ele. Suportado apenas em emissores que implementam métodos `pause()` e `resume()`.
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `1` O limite inferior. O emissor é retomado sempre que o tamanho dos eventos em buffer é menor que ele. Suportado apenas em emissores que implementam métodos `pause()` e `resume()`.


- Retorna: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) que itera eventos `eventName` emitidos pelo `emitter`

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emitir mais tarde
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // A execução deste bloco interno é síncrona e ele
  // processa um evento por vez (mesmo com await). Não use
  // se a execução concorrente for necessária.
  console.log(event); // imprime ['bar'] [42]
}
// Irrelevante aqui
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Emitir mais tarde
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // A execução deste bloco interno é síncrona e ele
    // processa um evento por vez (mesmo com await). Não use
    // se a execução concorrente for necessária.
    console.log(event); // imprime ['bar'] [42]
  }
  // Irrelevante aqui
})();
```
:::

Retorna um `AsyncIterator` que itera eventos `eventName`. Lançará um erro se o `EventEmitter` emitir `'error'`. Remove todos os listeners ao sair do loop. O `value` retornado por cada iteração é um array composto pelos argumentos do evento emitido.

Um [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) pode ser usado para cancelar a espera por eventos:

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emitir mais tarde
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // A execução deste bloco interno é síncrona e ele
    // processa um evento por vez (mesmo com await). Não use
    // se a execução concorrente for necessária.
    console.log(event); // imprime ['bar'] [42]
  }
  // Irrelevante aqui
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emitir mais tarde
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // A execução deste bloco interno é síncrona e ele
    // processa um evento por vez (mesmo com await). Não use
    // se a execução concorrente for necessária.
    console.log(event); // imprime ['bar'] [42]
  }
  // Irrelevante aqui
})();

process.nextTick(() => ac.abort());
```
:::


## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**Adicionado em: v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um número não negativo. O número máximo de listeners por evento `EventTarget`.
- `...eventsTargets` [\<EventTarget[]\>](/pt/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/pt/nodejs/api/events#class-eventemitter) Zero ou mais instâncias de [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) ou [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter). Se nenhum for especificado, `n` é definido como o máximo padrão para todos os objetos [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) e [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter) recém-criados.

::: code-group
```js [ESM]
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```js [CJS]
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```
:::

## `events.addAbortListener(signal, listener)` {#eventsaddabortlistenersignal-listener}

**Adicionado em: v20.5.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/pt/nodejs/api/events#event-listener)
- Retorna: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Um Disposable que remove o listener `abort`.

Ouve uma vez o evento `abort` no `signal` fornecido.

Ouvir o evento `abort` em sinais de aborto não é seguro e pode levar a vazamentos de recursos, pois outra entidade com o sinal pode chamar [`e.stopImmediatePropagation()`](/pt/nodejs/api/events#eventstopimmediatepropagation). Infelizmente, o Node.js não pode mudar isso, pois violaria o padrão da web. Além disso, a API original torna fácil esquecer de remover os listeners.

Esta API permite usar `AbortSignal`s com segurança nas APIs do Node.js, resolvendo esses dois problemas ao ouvir o evento de forma que `stopImmediatePropagation` não impeça a execução do listener.

Retorna um disposable para que ele possa ser removido mais facilmente.

::: code-group
```js [CJS]
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

```js [ESM]
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```
:::


## Classe: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**Adicionado em: v17.4.0, v16.14.0**

Integra `EventEmitter` com [\<AsyncResource\>](/pt/nodejs/api/async_hooks#class-asyncresource) para `EventEmitter`s que requerem rastreamento assíncrono manual. Especificamente, todos os eventos emitidos por instâncias de `events.EventEmitterAsyncResource` serão executados dentro de seu [contexto assíncrono](/pt/nodejs/api/async_context).

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// A ferramenta de rastreamento assíncrono identificará isso como 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// Os listeners 'foo' serão executados no contexto assíncrono do EventEmitter.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// Os listeners 'foo' em EventEmitters comuns que não rastreiam o
// contexto assíncrono, no entanto, são executados no mesmo contexto assíncrono que o emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```js [CJS]
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// A ferramenta de rastreamento assíncrono identificará isso como 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// Os listeners 'foo' serão executados no contexto assíncrono do EventEmitter.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// Os listeners 'foo' em EventEmitters comuns que não rastreiam o
// contexto assíncrono, no entanto, são executados no mesmo contexto assíncrono que o emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```
:::

A classe `EventEmitterAsyncResource` tem os mesmos métodos e recebe as mesmas opções que `EventEmitter` e `AsyncResource`.


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Permite a [captura automática da rejeição de promessas](/pt/nodejs/api/events#capture-rejections-of-promises). **Padrão:** `false`.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo de evento assíncrono. **Padrão:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do contexto de execução que criou este evento assíncrono. **Padrão:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `true`, desativa o `emitDestroy` quando o objeto é coletado pelo coletor de lixo. Geralmente, isso não precisa ser definido (mesmo que `emitDestroy` seja chamado manualmente), a menos que o `asyncId` do recurso seja recuperado e o `emitDestroy` da API sensível seja chamado com ele. Quando definido como `false`, a chamada `emitDestroy` na coleta de lixo ocorrerá somente se houver pelo menos um gancho `destroy` ativo. **Padrão:** `false`.

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O `asyncId` exclusivo atribuído ao recurso.

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- Type: O [\<AsyncResource\>](/pt/nodejs/api/async_hooks#class-asyncresource) subjacente.

O objeto `AsyncResource` retornado tem uma propriedade `eventEmitter` adicional que fornece uma referência a este `EventEmitterAsyncResource`.

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

Chama todos os ganchos `destroy`. Isso só deve ser chamado uma vez. Um erro será lançado se for chamado mais de uma vez. Isso **deve** ser chamado manualmente. Se o recurso for deixado para ser coletado pelo GC, os ganchos `destroy` nunca serão chamados.


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O mesmo `triggerAsyncId` que é passado para o construtor `AsyncResource`.

## API `EventTarget` e `Event` {#eventtarget-and-event-api}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | tratamento de erros alterado do EventTarget. |
| v15.4.0 | Não é mais experimental. |
| v15.0.0 | As classes `EventTarget` e `Event` agora estão disponíveis como globais. |
| v14.5.0 | Adicionado em: v14.5.0 |
:::

Os objetos `EventTarget` e `Event` são uma implementação específica do Node.js da [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget) que são expostos por algumas APIs principais do Node.js.

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo event happened!');
});
```
### `EventTarget` do Node.js vs. `EventTarget` do DOM {#nodejs-eventtarget-vs-dom-eventtarget}

Existem duas diferenças principais entre o `EventTarget` do Node.js e a [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget):

### `NodeEventTarget` vs. `EventEmitter` {#nodeeventtarget-vs-eventemitter}

O objeto `NodeEventTarget` implementa um subconjunto modificado da API `EventEmitter` que permite que ele *emule* de perto um `EventEmitter` em certas situações. Um `NodeEventTarget` *não* é uma instância de `EventEmitter` e não pode ser usado no lugar de um `EventEmitter` na maioria dos casos.

### Listener de Evento {#event-listener}

Os listeners de evento registrados para um `type` de evento podem ser funções JavaScript ou objetos com uma propriedade `handleEvent` cujo valor é uma função.

Em ambos os casos, a função handler é invocada com o argumento `event` passado para a função `eventTarget.dispatchEvent()`.

Funções Async podem ser usadas como listeners de evento. Se uma função handler async rejeitar, a rejeição é capturada e tratada conforme descrito em [tratamento de erros `EventTarget`](/pt/nodejs/api/events#eventtarget-error-handling).

Um erro lançado por uma função handler não impede que os outros handlers sejam invocados.

O valor de retorno de uma função handler é ignorado.

Os handlers são sempre invocados na ordem em que foram adicionados.

As funções Handler podem alterar o objeto `event`.

```js [ESM]
function handler1(event) {
  console.log(event.type);  // Imprime 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Imprime 'foo'
  console.log(event.a);  // Imprime 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Imprime 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Imprime 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### Tratamento de erros em `EventTarget` {#eventtarget-error-handling}

Quando um listener de evento registrado lança um erro (ou retorna uma Promise que é rejeitada), por padrão o erro é tratado como uma exceção não capturada em `process.nextTick()`. Isso significa que exceções não capturadas em `EventTarget`s terminarão o processo do Node.js por padrão.

Lançar um erro dentro de um listener de evento *não* impedirá que os outros manipuladores registrados sejam invocados.

O `EventTarget` não implementa nenhum tratamento padrão especial para eventos do tipo `'error'` como o `EventEmitter`.

Atualmente, os erros são primeiro encaminhados para o evento `process.on('error')` antes de atingir `process.on('uncaughtException')`. Este comportamento está obsoleto e mudará em uma versão futura para alinhar o `EventTarget` com outras APIs do Node.js. Qualquer código que dependa do evento `process.on('error')` deve ser alinhado com o novo comportamento.

### Classe: `Event` {#class-event}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | A classe `Event` agora está disponível através do objeto global. |
| v14.5.0 | Adicionado em: v14.5.0 |
:::

O objeto `Event` é uma adaptação da [`Event` Web API](https://dom.spec.whatwg.org/#event). As instâncias são criadas internamente pelo Node.js.

#### `event.bubbles` {#eventbubbles}

**Adicionado em: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Sempre retorna `false`.

Isto não é usado no Node.js e é fornecido puramente para fins de integridade.

#### `event.cancelBubble` {#eventcancelbubble}

**Adicionado em: v14.5.0**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`event.stopPropagation()`](/pt/nodejs/api/events#eventstoppropagation) em vez disso.
:::

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Alias para `event.stopPropagation()` se definido como `true`. Isto não é usado no Node.js e é fornecido puramente para fins de integridade.

#### `event.cancelable` {#eventcancelable}

**Adicionado em: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True se o evento foi criado com a opção `cancelable`.


#### `event.composed` {#eventcomposed}

**Adicionado em: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Sempre retorna `false`.

Isto não é usado no Node.js e é fornecido puramente para completude.

#### `event.composedPath()` {#eventcomposedpath}

**Adicionado em: v14.5.0**

Retorna um array contendo o `EventTarget` atual como a única entrada ou vazio se o evento não estiver sendo despachado. Isto não é usado no Node.js e é fornecido puramente para completude.

#### `event.currentTarget` {#eventcurrenttarget}

**Adicionado em: v14.5.0**

- Tipo: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) O `EventTarget` despachando o evento.

Alias para `event.target`.

#### `event.defaultPrevented` {#eventdefaultprevented}

**Adicionado em: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

É `true` se `cancelable` é `true` e `event.preventDefault()` foi chamado.

#### `event.eventPhase` {#eventeventphase}

**Adicionado em: v14.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Retorna `0` enquanto um evento não está sendo despachado, `2` enquanto está sendo despachado.

Isto não é usado no Node.js e é fornecido puramente para completude.

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**Adicionado em: v19.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: A especificação WHATWG considera-o obsoleto e os usuários não devem usá-lo de forma alguma.
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Redundante com os construtores de eventos e incapaz de definir `composed`. Isto não é usado no Node.js e é fornecido puramente para completude.

#### `event.isTrusted` {#eventistrusted}

**Adicionado em: v14.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O evento `"abort"` de [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) é emitido com `isTrusted` definido como `true`. O valor é `false` em todos os outros casos.


#### `event.preventDefault()` {#eventpreventdefault}

**Adicionado em: v14.5.0**

Define a propriedade `defaultPrevented` como `true` se `cancelable` for `true`.

#### `event.returnValue` {#eventreturnvalue}

**Adicionado em: v14.5.0**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`event.defaultPrevented`](/pt/nodejs/api/events#eventdefaultprevented) em vez disso.
:::

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verdadeiro se o evento não foi cancelado.

O valor de `event.returnValue` é sempre o oposto de `event.defaultPrevented`. Isso não é usado no Node.js e é fornecido puramente para fins de integridade.

#### `event.srcElement` {#eventsrcelement}

**Adicionado em: v14.5.0**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`event.target`](/pt/nodejs/api/events#eventtarget) em vez disso.
:::

- Tipo: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) O `EventTarget` que despacha o evento.

Alias para `event.target`.

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Adicionado em: v14.5.0**

Impede a invocação de listeners de evento após a conclusão do atual.

#### `event.stopPropagation()` {#eventstoppropagation}

**Adicionado em: v14.5.0**

Isso não é usado no Node.js e é fornecido puramente para fins de integridade.

#### `event.target` {#eventtarget}

**Adicionado em: v14.5.0**

- Tipo: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) O `EventTarget` que despacha o evento.

#### `event.timeStamp` {#eventtimestamp}

**Adicionado em: v14.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp em milissegundos quando o objeto `Event` foi criado.

#### `event.type` {#eventtype}

**Adicionado em: v14.5.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O identificador do tipo de evento.

### Classe: `EventTarget` {#class-eventtarget}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | A classe `EventTarget` agora está disponível através do objeto global. |
| v14.5.0 | Adicionado em: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.4.0 | Adicionado suporte para a opção `signal`. |
| v14.5.0 | Adicionado em: v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/pt/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o listener é automaticamente removido quando é invocado pela primeira vez. **Padrão:** `false`.
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, serve como uma dica de que o listener não irá chamar o método `preventDefault()` do objeto `Event`. **Padrão:** `false`.
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Não é usado diretamente pelo Node.js. Adicionado para completude da API. **Padrão:** `false`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) O listener será removido quando o método `abort()` do objeto AbortSignal fornecido for chamado.

Adiciona um novo manipulador para o evento `type`. Qualquer `listener` fornecido é adicionado apenas uma vez por `type` e por valor da opção `capture`.

Se a opção `once` for `true`, o `listener` é removido após a próxima vez que um evento `type` for disparado.

A opção `capture` não é usada pelo Node.js de nenhuma forma funcional além de rastrear listeners de evento registrados de acordo com a especificação `EventTarget`. Especificamente, a opção `capture` é usada como parte da chave ao registrar um `listener`. Qualquer `listener` individual pode ser adicionado uma vez com `capture = false` e uma vez com `capture = true`.

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// Remove a segunda instância do manipulador
target.removeEventListener('foo', handler);

// Remove a primeira instância do manipulador
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**Adicionado em: v14.5.0**

- `event` [\<Event\>](/pt/nodejs/api/events#class-event)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o valor do atributo `cancelable` do evento for falso ou se seu método `preventDefault()` não foi invocado, caso contrário, `false`.

Dispara o `event` para a lista de manipuladores para `event.type`.

Os listeners de evento registrados são invocados sincronamente na ordem em que foram registrados.

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**Adicionado em: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/pt/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Remove o `listener` da lista de manipuladores para o `type` de evento.

### Classe: `CustomEvent` {#class-customevent}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.0.0 | Não é mais experimental. |
| v22.1.0, v20.13.0 | CustomEvent agora é estável. |
| v19.0.0 | Não está mais atrás da flag da CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Adicionado em: v18.7.0, v16.17.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

- Estende: [\<Event\>](/pt/nodejs/api/events#class-event)

O objeto `CustomEvent` é uma adaptação da [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent). As instâncias são criadas internamente pelo Node.js.

#### `event.detail` {#eventdetail}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent agora é estável. |
| v18.7.0, v16.17.0 | Adicionado em: v18.7.0, v16.17.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

- Tipo: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Retorna dados personalizados passados ao inicializar.

Somente leitura.


### Classe: `NodeEventTarget` {#class-nodeeventtarget}

**Adicionado em: v14.5.0**

- Estende: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget)

O `NodeEventTarget` é uma extensão específica do Node.js para `EventTarget` que emula um subconjunto da API `EventEmitter`.

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**Adicionado em: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/pt/nodejs/api/events#event-listener) 
-  Retorna: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) this 

Extensão específica do Node.js para a classe `EventTarget` que emula a API `EventEmitter` equivalente. A única diferença entre `addListener()` e `addEventListener()` é que `addListener()` retornará uma referência ao `EventTarget`.

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**Adicionado em: v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se ouvintes de evento registrados para o `type` existirem, caso contrário `false`.

Extensão específica do Node.js para a classe `EventTarget` que despacha o `arg` para a lista de manipuladores para `type`.

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**Adicionado em: v14.5.0**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Extensão específica do Node.js para a classe `EventTarget` que retorna um array de nomes `type` de evento para os quais os ouvintes de evento estão registrados.

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**Adicionado em: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 

Extensão específica do Node.js para a classe `EventTarget` que retorna o número de ouvintes de evento registrados para o `type`.


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**Adicionado em: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Extensão específica do Node.js para a classe `EventTarget` que define o número máximo de listeners de evento como `n`.

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**Adicionado em: v14.5.0**

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Extensão específica do Node.js para a classe `EventTarget` que retorna o número máximo de listeners de evento.

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**Adicionado em: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/pt/nodejs/api/events#event-listener) 
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
-  Retorna: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) this 

Alias específico do Node.js para `eventTarget.removeEventListener()`.

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**Adicionado em: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/pt/nodejs/api/events#event-listener) 
-  Retorna: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) this 

Alias específico do Node.js para `eventTarget.addEventListener()`.

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**Adicionado em: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/pt/nodejs/api/events#event-listener) 
-  Retorna: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) this 

Extensão específica do Node.js para a classe `EventTarget` que adiciona um listener `once` para o `type` de evento fornecido. Isso é equivalente a chamar `on` com a opção `once` definida como `true`.


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**Adicionado em: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  Retorna: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) this

Extensão específica do Node.js para a classe `EventTarget`. Se `type` for especificado, remove todos os listeners registrados para `type`, caso contrário, remove todos os listeners registrados.

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**Adicionado em: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/pt/nodejs/api/events#event-listener)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


-  Retorna: [\<EventTarget\>](/pt/nodejs/api/events#class-eventtarget) this

Extensão específica do Node.js para a classe `EventTarget` que remove o `listener` para o `type` fornecido. A única diferença entre `removeListener()` e `removeEventListener()` é que `removeListener()` retornará uma referência ao `EventTarget`.

