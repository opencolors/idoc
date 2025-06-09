---
title: Documentação do Node.js - Ganchos Assíncronos
description: Explore a API de Ganchos Assíncronos no Node.js, que oferece uma maneira de acompanhar o ciclo de vida dos recursos assíncronos em aplicações Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Ganchos Assíncronos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore a API de Ganchos Assíncronos no Node.js, que oferece uma maneira de acompanhar o ciclo de vida dos recursos assíncronos em aplicações Node.js.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Ganchos Assíncronos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore a API de Ganchos Assíncronos no Node.js, que oferece uma maneira de acompanhar o ciclo de vida dos recursos assíncronos em aplicações Node.js.
---


# Hooks Assíncronos {#async-hooks}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental. Por favor, migre para fora desta API, se puder. Não recomendamos usar as APIs [`createHook`](/pt/nodejs/api/async_hooks#async_hookscreatehookcallbacks), [`AsyncHook`](/pt/nodejs/api/async_hooks#class-asynchook) e [`executionAsyncResource`](/pt/nodejs/api/async_hooks#async_hooksexecutionasyncresource), pois elas têm problemas de usabilidade, riscos de segurança e implicações de desempenho. Casos de uso de rastreamento de contexto assíncrono são melhor atendidos pela API estável [`AsyncLocalStorage`](/pt/nodejs/api/async_context#class-asynclocalstorage). Se você tiver um caso de uso para `createHook`, `AsyncHook` ou `executionAsyncResource` além da necessidade de rastreamento de contexto resolvida por [`AsyncLocalStorage`](/pt/nodejs/api/async_context#class-asynclocalstorage) ou dados de diagnóstico atualmente fornecidos pelo [Canal de Diagnóstico](/pt/nodejs/api/diagnostics_channel), abra um problema em [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues) descrevendo seu caso de uso para que possamos criar uma API mais focada em um propósito.
:::

**Código Fonte:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

Desaconselhamos fortemente o uso da API `async_hooks`. Outras APIs que podem cobrir a maioria de seus casos de uso incluem:

- [`AsyncLocalStorage`](/pt/nodejs/api/async_context#class-asynclocalstorage) rastreia o contexto assíncrono
- [`process.getActiveResourcesInfo()`](/pt/nodejs/api/process#processgetactiveresourcesinfo) rastreia recursos ativos

O módulo `node:async_hooks` fornece uma API para rastrear recursos assíncronos. Ele pode ser acessado usando:

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## Terminologia {#terminology}

Um recurso assíncrono representa um objeto com um callback associado. Este callback pode ser chamado várias vezes, como o evento `'connection'` em `net.createServer()`, ou apenas uma única vez como em `fs.open()`. Um recurso também pode ser fechado antes que o callback seja chamado. `AsyncHook` não distingue explicitamente entre esses diferentes casos, mas os representará como o conceito abstrato que é um recurso.

Se [`Worker`](/pt/nodejs/api/worker_threads#class-worker)s forem usados, cada thread terá uma interface `async_hooks` independente, e cada thread usará um novo conjunto de IDs assíncronos.


## Visão geral {#overview}

A seguir, uma visão geral simples da API pública.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// Retorna o ID do contexto de execução atual.
const eid = async_hooks.executionAsyncId();

// Retorna o ID do manipulador responsável por disparar o callback do
// escopo de execução atual para chamar.
const tid = async_hooks.triggerAsyncId();

// Cria uma nova instância de AsyncHook. Todos esses callbacks são opcionais.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Permite que os callbacks desta instância de AsyncHook sejam chamados. Esta não é uma
// ação implícita após executar o construtor e deve ser executada explicitamente para começar
// a executar os callbacks.
asyncHook.enable();

// Desativa a escuta por novos eventos assíncronos.
asyncHook.disable();

//
// A seguir, os callbacks que podem ser passados para createHook().
//

// init() é chamado durante a construção do objeto. O recurso pode não ter
// concluído a construção quando este callback é executado. Portanto, todos os campos do
// recurso referenciado por "asyncId" podem não ter sido preenchidos.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() é chamado imediatamente antes de o callback do recurso ser chamado. Ele pode ser
// chamado de 0 a N vezes para manipuladores (como TCPWrap) e será chamado exatamente 1
// vez para solicitações (como FSReqCallback).
function before(asyncId) { }

// after() é chamado imediatamente após o término do callback do recurso.
function after(asyncId) { }

// destroy() é chamado quando o recurso é destruído.
function destroy(asyncId) { }

// promiseResolve() é chamado apenas para recursos de promise, quando a
// função resolve() passada para o construtor Promise é invocada
// (diretamente ou por outros meios de resolução de uma promise).
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// Retorna o ID do contexto de execução atual.
const eid = async_hooks.executionAsyncId();

// Retorna o ID do manipulador responsável por disparar o callback do
// escopo de execução atual para chamar.
const tid = async_hooks.triggerAsyncId();

// Cria uma nova instância de AsyncHook. Todos esses callbacks são opcionais.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Permite que os callbacks desta instância de AsyncHook sejam chamados. Esta não é uma
// ação implícita após executar o construtor e deve ser executada explicitamente para começar
// a executar os callbacks.
asyncHook.enable();

// Desativa a escuta por novos eventos assíncronos.
asyncHook.disable();

//
// A seguir, os callbacks que podem ser passados para createHook().
//

// init() é chamado durante a construção do objeto. O recurso pode não ter
// concluído a construção quando este callback é executado. Portanto, todos os campos do
// recurso referenciado por "asyncId" podem não ter sido preenchidos.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() é chamado imediatamente antes de o callback do recurso ser chamado. Ele pode ser
// chamado de 0 a N vezes para manipuladores (como TCPWrap) e será chamado exatamente 1
// vez para solicitações (como FSReqCallback).
function before(asyncId) { }

// after() é chamado imediatamente após o término do callback do recurso.
function after(asyncId) { }

// destroy() é chamado quando o recurso é destruído.
function destroy(asyncId) { }

// promiseResolve() é chamado apenas para recursos de promise, quando a
// função resolve() passada para o construtor Promise é invocada
// (diretamente ou por outros meios de resolução de uma promise).
function promiseResolve(asyncId) { }
```
:::


## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**Adicionado em: v8.1.0**

- `callbacks` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Os [Callbacks de Hook](/pt/nodejs/api/async_hooks#hook-callbacks) a serem registrados
    - `init` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O [`init` callback](/pt/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
    - `before` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O [`before` callback](/pt/nodejs/api/async_hooks#beforeasyncid).
    - `after` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O [`after` callback](/pt/nodejs/api/async_hooks#afterasyncid).
    - `destroy` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O [`destroy` callback](/pt/nodejs/api/async_hooks#destroyasyncid).
    - `promiseResolve` [\<Função\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) O [`promiseResolve` callback](/pt/nodejs/api/async_hooks#promiseresolveasyncid).
  
 
- Retorna: [\<AsyncHook\>](/pt/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Instância usada para desabilitar e habilitar hooks

Registra funções a serem chamadas para diferentes eventos de ciclo de vida de cada operação assíncrona.

Os callbacks `init()`/`before()`/`after()`/`destroy()` são chamados para o respectivo evento assíncrono durante o ciclo de vida de um recurso.

Todos os callbacks são opcionais. Por exemplo, se apenas a limpeza do recurso precisar ser rastreada, então apenas o callback `destroy` precisa ser passado. Os detalhes de todas as funções que podem ser passadas para `callbacks` estão na seção [Callbacks de Hook](/pt/nodejs/api/async_hooks#hook-callbacks).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

Os callbacks serão herdados através da cadeia de protótipos:

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
Como as promises são recursos assíncronos cujo ciclo de vida é rastreado através do mecanismo de async hooks, os callbacks `init()`, `before()`, `after()` e `destroy()` *não devem* ser funções assíncronas que retornam promises.


### Tratamento de Erros {#error-handling}

Se qualquer callback `AsyncHook` lançar um erro, a aplicação imprimirá o stack trace e encerrará. O caminho de saída segue o de uma exceção não capturada, mas todos os listeners de `'uncaughtException'` são removidos, forçando assim o processo a encerrar. Os callbacks de `'exit'` ainda serão chamados, a menos que a aplicação seja executada com `--abort-on-uncaught-exception`, caso em que um stack trace será impresso e a aplicação encerrará, deixando um arquivo core.

A razão para esse comportamento de tratamento de erros é que esses callbacks estão sendo executados em pontos potencialmente voláteis no ciclo de vida de um objeto, por exemplo, durante a construção e destruição da classe. Por causa disso, considera-se necessário derrubar o processo rapidamente para evitar um aborto não intencional no futuro. Isso está sujeito a alterações no futuro, caso uma análise abrangente seja realizada para garantir que uma exceção possa seguir o fluxo de controle normal sem efeitos colaterais não intencionais.

### Imprimindo em callbacks `AsyncHook` {#printing-in-asynchook-callbacks}

Como imprimir no console é uma operação assíncrona, `console.log()` fará com que os callbacks `AsyncHook` sejam chamados. Usar `console.log()` ou operações assíncronas semelhantes dentro de uma função de callback `AsyncHook` causará uma recursão infinita. Uma solução fácil para isso ao depurar é usar uma operação de registro síncrona, como `fs.writeFileSync(file, msg, flag)`. Isso imprimirá no arquivo e não invocará `AsyncHook` recursivamente porque é síncrono.

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Use uma função como esta ao depurar dentro de um callback AsyncHook
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Use uma função como esta ao depurar dentro de um callback AsyncHook
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

Se uma operação assíncrona for necessária para o registro, é possível rastrear o que causou a operação assíncrona usando as informações fornecidas pelo próprio `AsyncHook`. O registro deve ser ignorado quando foi o próprio registro que causou a chamada do callback `AsyncHook`. Ao fazer isso, a recursão, caso contrário, infinita é interrompida.


## Classe: `AsyncHook` {#class-asynchook}

A classe `AsyncHook` expõe uma interface para rastrear eventos de tempo de vida de operações assíncronas.

### `asyncHook.enable()` {#asynchookenable}

- Retorna: [\<AsyncHook\>](/pt/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Uma referência a `asyncHook`.

Habilita os callbacks para uma dada instância de `AsyncHook`. Se nenhum callback for fornecido, habilitar é uma operação nula.

A instância de `AsyncHook` é desabilitada por padrão. Se a instância de `AsyncHook` deve ser habilitada imediatamente após a criação, o seguinte padrão pode ser usado.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- Retorna: [\<AsyncHook\>](/pt/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Uma referência a `asyncHook`.

Desabilita os callbacks para uma dada instância de `AsyncHook` do pool global de callbacks de `AsyncHook` a serem executados. Uma vez que um hook foi desabilitado, ele não será chamado novamente até ser habilitado.

Para consistência da API, `disable()` também retorna a instância de `AsyncHook`.

### Callbacks de Hook {#hook-callbacks}

Eventos chave no tempo de vida de eventos assíncronos foram categorizados em quatro áreas: instanciação, antes/depois do callback ser chamado e quando a instância é destruída.

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um ID único para o recurso assíncrono.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo do recurso assíncrono.
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID único do recurso assíncrono no contexto de execução em que este recurso assíncrono foi criado.
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Referência ao recurso representando a operação assíncrona, precisa ser liberado durante *destroy*.

Chamado quando uma classe é construída que tem a *possibilidade* de emitir um evento assíncrono. Isso *não* significa que a instância deve chamar `before`/`after` antes que `destroy` seja chamado, apenas que a possibilidade existe.

Este comportamento pode ser observado fazendo algo como abrir um recurso e então fechá-lo antes que o recurso possa ser usado. O trecho de código a seguir demonstra isso.

::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

Cada novo recurso recebe um ID que é único dentro do escopo da instância atual do Node.js.


##### `type` {#type}

O `type` é uma string que identifica o tipo de recurso que fez com que o `init` fosse chamado. Geralmente, ele corresponderá ao nome do construtor do recurso.

O `type` de recursos criados pelo próprio Node.js pode mudar em qualquer lançamento do Node.js. Os valores válidos incluem `TLSWRAP`, `TCPWRAP`, `TCPSERVERWRAP`, `GETADDRINFOREQWRAP`, `FSREQCALLBACK`, `Microtask` e `Timeout`. Inspecione o código-fonte da versão do Node.js usada para obter a lista completa.

Além disso, os usuários do [`AsyncResource`](/pt/nodejs/api/async_context#class-asyncresource) criam recursos assíncronos independentemente do próprio Node.js.

Há também o tipo de recurso `PROMISE`, que é usado para rastrear instâncias de `Promise` e o trabalho assíncrono agendado por elas.

Os usuários podem definir seu próprio `type` ao usar a API pública de incorporação.

É possível ter colisões de nome de tipo. Os incorporadores são incentivados a usar prefixos exclusivos, como o nome do pacote npm, para evitar colisões ao ouvir os hooks.

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` é o `asyncId` do recurso que causou (ou "desencadeou") a inicialização do novo recurso e que fez com que o `init` fosse chamado. Isso é diferente de `async_hooks.executionAsyncId()` que mostra apenas *quando* um recurso foi criado, enquanto `triggerAsyncId` mostra *por que* um recurso foi criado.

A seguir, uma demonstração simples de `triggerAsyncId`:

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net');
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

Saída ao atingir o servidor com `nc localhost 8080`:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
O `TCPSERVERWRAP` é o servidor que recebe as conexões.

O `TCPWRAP` é a nova conexão do cliente. Quando uma nova conexão é feita, a instância `TCPWrap` é construída imediatamente. Isso acontece fora de qualquer pilha JavaScript. (Um `executionAsyncId()` de `0` significa que está sendo executado em C++ sem nenhuma pilha JavaScript acima dele.) Com apenas essa informação, seria impossível vincular recursos em termos do que os fez ser criados, então `triggerAsyncId` recebe a tarefa de propagar qual recurso é responsável pela existência do novo recurso.


##### `resource` {#resource}

`resource` é um objeto que representa o recurso assíncrono real que foi inicializado. A API para acessar o objeto pode ser especificada pelo criador do recurso. Os recursos criados pelo próprio Node.js são internos e podem mudar a qualquer momento. Portanto, nenhuma API é especificada para eles.

Em alguns casos, o objeto de recurso é reutilizado por motivos de desempenho, portanto, não é seguro usá-lo como chave em um `WeakMap` ou adicionar propriedades a ele.

##### Exemplo de contexto assíncrono {#asynchronous-context-example}

O caso de uso de rastreamento de contexto é coberto pela API estável [`AsyncLocalStorage`](/pt/nodejs/api/async_context#class-asynclocalstorage). Este exemplo ilustra apenas a operação dos hooks assíncronos, mas [`AsyncLocalStorage`](/pt/nodejs/api/async_context#class-asynclocalstorage) se encaixa melhor neste caso de uso.

O seguinte é um exemplo com informações adicionais sobre as chamadas para `init` entre as chamadas `before` e `after`, especificamente como será o callback para `listen()`. A formatação da saída é ligeiramente mais elaborada para facilitar a visualização do contexto de chamada.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

Saída de apenas iniciar o servidor:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```
Como ilustrado no exemplo, `executionAsyncId()` e `execution` especificam cada um o valor do contexto de execução atual; que é delineado por chamadas para `before` e `after`.

Usar apenas `execution` para representar graficamente os resultados da alocação de recursos resulta no seguinte:

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
O `TCPSERVERWRAP` não faz parte deste gráfico, embora tenha sido a razão para a chamada de `console.log()`. Isso ocorre porque a ligação a uma porta sem um nome de host é uma operação *síncrona*, mas para manter uma API completamente assíncrona, o callback do usuário é colocado em um `process.nextTick()`. É por isso que `TickObject` está presente na saída e é um 'pai' para o callback `.listen()`.

O gráfico mostra apenas *quando* um recurso foi criado, não *por quê*, então, para rastrear o *por quê*, use `triggerAsyncId`. O que pode ser representado com o seguinte gráfico:

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando uma operação assíncrona é iniciada (como um servidor TCP recebendo uma nova conexão) ou concluída (como gravar dados no disco), um callback é chamado para notificar o usuário. O callback `before` é chamado imediatamente antes da execução do referido callback. `asyncId` é o identificador único atribuído ao recurso que está prestes a executar o callback.

O callback `before` será chamado de 0 a N vezes. O callback `before` normalmente será chamado 0 vezes se a operação assíncrona foi cancelada ou, por exemplo, se nenhuma conexão for recebida por um servidor TCP. Recursos assíncronos persistentes, como um servidor TCP, normalmente chamarão o callback `before` várias vezes, enquanto outras operações como `fs.open()` o chamarão apenas uma vez.

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Chamado imediatamente após a conclusão do callback especificado em `before`.

Se uma exceção não capturada ocorrer durante a execução do callback, `after` será executado *após* o evento `'uncaughtException'` ser emitido ou o manipulador de um `domain` ser executado.

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Chamado após o recurso correspondente a `asyncId` ser destruído. Também é chamado assincronamente da API incorporadora `emitDestroy()`.

Alguns recursos dependem da coleta de lixo para limpeza, portanto, se uma referência for feita ao objeto `resource` passado para `init`, é possível que `destroy` nunca seja chamado, causando um vazamento de memória no aplicativo. Se o recurso não depender da coleta de lixo, isso não será um problema.

Usar o hook destroy resulta em sobrecarga adicional porque permite o rastreamento de instâncias `Promise` por meio do coletor de lixo.

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**Adicionado em: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Chamado quando a função `resolve` passada para o construtor `Promise` é invocada (diretamente ou por outros meios de resolução de uma promise).

`resolve()` não faz nenhum trabalho síncrono observável.

A `Promise` não é necessariamente cumprida ou rejeitada neste ponto se a `Promise` foi resolvida assumindo o estado de outra `Promise`.

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
chama os seguintes callbacks:

```text [TEXT]
init for PROMISE with id 5, trigger id: 1
  promise resolve 5      # corresponds to resolve(true)
init for PROMISE with id 6, trigger id: 5  # the Promise returned by then()
  before 6               # the then() callback is entered
  promise resolve 6      # the then() callback resolves the promise by returning
  after 6
```


### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**Adicionado em: v13.9.0, v12.17.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O recurso que representa a execução atual. Útil para armazenar dados dentro do recurso.

Objetos de recurso retornados por `executionAsyncResource()` são frequentemente objetos de manipulação internos do Node.js com APIs não documentadas. Usar quaisquer funções ou propriedades no objeto provavelmente travará seu aplicativo e deve ser evitado.

Usar `executionAsyncResource()` no contexto de execução de nível superior retornará um objeto vazio, pois não há objeto de manipulação ou solicitação para usar, mas ter um objeto representando o nível superior pode ser útil.

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

Isso pode ser usado para implementar o armazenamento local de continuação sem o uso de um `Map` de rastreamento para armazenar os metadados:

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // Símbolo privado para evitar poluição

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // Símbolo privado para evitar poluição

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v8.2.0 | Renomeado de `currentId`. |
| v8.1.0 | Adicionado em: v8.1.0 |
:::

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O `asyncId` do contexto de execução atual. Útil para rastrear quando algo chama.

::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

O ID retornado de `executionAsyncId()` está relacionado ao tempo de execução, não à causalidade (que é coberta por `triggerAsyncId()`):

```js [ESM]
const server = net.createServer((conn) => {
  // Retorna o ID do servidor, não da nova conexão, porque o
  // callback é executado no escopo de execução do MakeCallback() do servidor.
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // Retorna o ID de um TickObject (process.nextTick()) porque todos os
  // callbacks passados para .listen() são encapsulados em um nextTick().
  async_hooks.executionAsyncId();
});
```
Os contextos de Promise podem não obter `executionAsyncIds` precisos por padrão. Consulte a seção sobre [rastreamento de execução de promise](/pt/nodejs/api/async_hooks#promise-execution-tracking).

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do recurso responsável por chamar o callback que está sendo executado atualmente.

```js [ESM]
const server = net.createServer((conn) => {
  // O recurso que causou (ou acionou) a chamada deste callback
  // foi o da nova conexão. Assim, o valor de retorno de triggerAsyncId()
  // é o asyncId de "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Mesmo que todos os callbacks passados para .listen() sejam encapsulados em um nextTick()
  // o próprio callback existe porque a chamada para o .listen() do servidor
  // foi feita. Portanto, o valor de retorno seria o ID do servidor.
  async_hooks.triggerAsyncId();
});
```
Os contextos de Promise podem não obter `triggerAsyncId`s válidos por padrão. Consulte a seção sobre [rastreamento de execução de promise](/pt/nodejs/api/async_hooks#promise-execution-tracking).


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**Adicionado em: v17.2.0, v16.14.0**

- Retorna: Um mapa de tipos de provedores para o ID numérico correspondente. Este mapa contém todos os tipos de eventos que podem ser emitidos pelo evento `async_hooks.init()`.

Este recurso suprime o uso obsoleto de `process.binding('async_wrap').Providers`. Veja: [DEP0111](/pt/nodejs/api/deprecations#dep0111-processbinding)

## Rastreamento da execução de Promises {#promise-execution-tracking}

Por padrão, as execuções de promises não recebem `asyncId`s devido à natureza relativamente cara da [API de introspecção de promises](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) fornecida pelo V8. Isso significa que programas que usam promises ou `async`/`await` não obterão IDs de execução e de gatilho corretos para contextos de callback de promises por padrão.

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
:::

Observe que o callback `then()` afirma ter sido executado no contexto do escopo externo, mesmo que tenha havido um salto assíncrono envolvido. Além disso, o valor de `triggerAsyncId` é `0`, o que significa que estamos perdendo o contexto sobre o recurso que causou (acionou) a execução do callback `then()`.

A instalação de hooks assíncronos via `async_hooks.createHook` habilita o rastreamento da execução de promises:

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```
:::

Neste exemplo, adicionar qualquer função de hook real habilitou o rastreamento de promises. Existem duas promises no exemplo acima; a promise criada por `Promise.resolve()` e a promise retornada pela chamada para `then()`. No exemplo acima, a primeira promise obteve o `asyncId` `6` e a última obteve o `asyncId` `7`. Durante a execução do callback `then()`, estamos executando no contexto da promise com `asyncId` `7`. Esta promise foi acionada pelo recurso assíncrono `6`.

Outra sutileza com promises é que os callbacks `before` e `after` são executados apenas em promises encadeadas. Isso significa que as promises não criadas por `then()`/`catch()` não terão os callbacks `before` e `after` disparados nelas. Para mais detalhes, veja os detalhes da API V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit).


## API de incorporação JavaScript {#javascript-embedder-api}

Os desenvolvedores de bibliotecas que manipulam seus próprios recursos assíncronos executando tarefas como E/S, agrupamento de conexões ou gerenciamento de filas de retorno de chamada podem usar a API JavaScript `AsyncResource` para que todos os retornos de chamada apropriados sejam chamados.

### Classe: `AsyncResource` {#class-asyncresource}

A documentação para esta classe foi movida [`AsyncResource`](/pt/nodejs/api/async_context#class-asyncresource).

## Classe: `AsyncLocalStorage` {#class-asynclocalstorage}

A documentação para esta classe foi movida [`AsyncLocalStorage`](/pt/nodejs/api/async_context#class-asynclocalstorage).

