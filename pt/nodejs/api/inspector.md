---
title: Documentação do Módulo Inspector do Node.js
description: O módulo Inspector do Node.js fornece uma API para interagir com o inspetor V8, permitindo que os desenvolvedores depurem aplicações Node.js conectando-se ao protocolo do inspetor.
head:
  - - meta
    - name: og:title
      content: Documentação do Módulo Inspector do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo Inspector do Node.js fornece uma API para interagir com o inspetor V8, permitindo que os desenvolvedores depurem aplicações Node.js conectando-se ao protocolo do inspetor.
  - - meta
    - name: twitter:title
      content: Documentação do Módulo Inspector do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo Inspector do Node.js fornece uma API para interagir com o inspetor V8, permitindo que os desenvolvedores depurem aplicações Node.js conectando-se ao protocolo do inspetor.
---


# Inspector {#inspector}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

O módulo `node:inspector` fornece uma API para interagir com o inspetor V8.

Ele pode ser acessado usando:



::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

ou



::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## API de Promises {#promises-api}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

**Adicionado em: v19.0.0**

### Classe: `inspector.Session` {#class-inspectorsession}

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

O `inspector.Session` é usado para despachar mensagens para o back-end do inspetor V8 e receber respostas e notificações de mensagens.

#### `new inspector.Session()` {#new-inspectorsession}

**Adicionado em: v8.0.0**

Cria uma nova instância da classe `inspector.Session`. A sessão do inspetor precisa ser conectada através de [`session.connect()`](/pt/nodejs/api/inspector#sessionconnect) antes que as mensagens possam ser despachadas para o backend do inspetor.

Ao usar `Session`, o objeto gerado pela API do console não será liberado, a menos que executemos manualmente o comando `Runtime.DiscardConsoleEntries`.

#### Evento: `'inspectorNotification'` {#event-inspectornotification}

**Adicionado em: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto de mensagem de notificação

Emitido quando qualquer notificação do Inspetor V8 é recebida.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
Também é possível se inscrever apenas para notificações com um método específico:


#### Evento: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**Adicionado em: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto de mensagem de notificação

Emitido quando uma notificação do inspector é recebida com o campo method definido para o valor `\<inspector-protocol-method\>`.

O trecho a seguir instala um listener no evento [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) e imprime o motivo da suspensão do programa sempre que a execução do programa é suspensa (através de breakpoints, por exemplo):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**Adicionado em: v8.0.0**

Conecta uma sessão ao back-end do inspector.

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**Adicionado em: v12.11.0**

Conecta uma sessão ao back-end do inspector da thread principal. Uma exceção será lançada se esta API não for chamada em uma thread Worker.

#### `session.disconnect()` {#sessiondisconnect}

**Adicionado em: v8.0.0**

Fecha a sessão imediatamente. Todos os callbacks de mensagem pendentes serão chamados com um erro. [`session.connect()`](/pt/nodejs/api/inspector#sessionconnect) precisará ser chamado para poder enviar mensagens novamente. A sessão reconectada perderá todo o estado do inspector, como agentes habilitados ou breakpoints configurados.

#### `session.post(method[, params])` {#sessionpostmethod-params}

**Adicionado em: v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Envia uma mensagem para o back-end do inspector.

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```
A versão mais recente do protocolo do inspector V8 é publicada no [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

O inspector do Node.js suporta todos os domínios do Chrome DevTools Protocol declarados pelo V8. O domínio Chrome DevTools Protocol fornece uma interface para interagir com um dos agentes de tempo de execução usados para inspecionar o estado do aplicativo e ouvir os eventos de tempo de execução.


#### Exemplo de uso {#example-usage}

Além do depurador, vários V8 Profilers estão disponíveis através do protocolo DevTools.

##### Profiler de CPU {#cpu-profiler}

Aqui está um exemplo mostrando como usar o [Profiler de CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Invocar lógica de negócios sob medição aqui...

// algum tempo depois...
const { profile } = await session.post('Profiler.stop');

// Escrever perfil no disco, enviar, etc.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### Profiler de Heap {#heap-profiler}

Aqui está um exemplo mostrando como usar o [Profiler de Heap](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## API de Callback {#callback-api}

### Classe: `inspector.Session` {#class-inspectorsession_1}

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

O `inspector.Session` é usado para enviar mensagens para o back-end do inspetor V8 e receber respostas e notificações de mensagens.

#### `new inspector.Session()` {#new-inspectorsession_1}

**Adicionado em: v8.0.0**

Cria uma nova instância da classe `inspector.Session`. A sessão do inspetor precisa ser conectada através de [`session.connect()`](/pt/nodejs/api/inspector#sessionconnect) antes que as mensagens possam ser enviadas para o backend do inspetor.

Ao usar `Session`, o objeto gerado pela API do console não será liberado, a menos que executemos manualmente o comando `Runtime.DiscardConsoleEntries`.


#### Evento: `'inspectorNotification'` {#event-inspectornotification_1}

**Adicionado em: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto de mensagem de notificação

Emitido quando qualquer notificação do Inspetor V8 é recebida.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
Também é possível se inscrever apenas para notificações com um método específico:

#### Evento: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;_1}

**Adicionado em: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O objeto de mensagem de notificação

Emitido quando uma notificação do inspetor é recebida que tem seu campo de método definido como o valor `\<inspector-protocol-method\>`.

O seguinte trecho instala um listener no evento [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) e imprime o motivo da suspensão do programa sempre que a execução do programa é suspensa (por meio de breakpoints, por exemplo):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**Adicionado em: v8.0.0**

Conecta uma sessão ao back-end do inspetor.

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**Adicionado em: v12.11.0**

Conecta uma sessão ao back-end do inspetor da thread principal. Uma exceção será lançada se esta API não for chamada em uma thread Worker.

#### `session.disconnect()` {#sessiondisconnect_1}

**Adicionado em: v8.0.0**

Fecha imediatamente a sessão. Todos os retornos de chamada de mensagens pendentes serão chamados com um erro. [`session.connect()`](/pt/nodejs/api/inspector#sessionconnect) precisará ser chamado para poder enviar mensagens novamente. A sessão reconectada perderá todo o estado do inspetor, como agentes ativados ou breakpoints configurados.

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Envia uma mensagem para o back-end do inspetor. `callback` será notificado quando uma resposta for recebida. `callback` é uma função que aceita dois argumentos opcionais: erro e resultado específico da mensagem.

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```
A versão mais recente do protocolo do inspetor V8 é publicada no [Visualizador do Protocolo Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/v8/).

O inspetor Node.js suporta todos os domínios do Protocolo Chrome DevTools declarados pelo V8. O domínio do Protocolo Chrome DevTools fornece uma interface para interagir com um dos agentes de tempo de execução usados para inspecionar o estado do aplicativo e ouvir os eventos de tempo de execução.

Você não pode definir `reportProgress` como `true` ao enviar um comando `HeapProfiler.takeHeapSnapshot` ou `HeapProfiler.stopTrackingHeapObjects` para o V8.


#### Exemplo de uso {#example-usage_1}

Além do depurador, vários Profilers V8 estão disponíveis através do protocolo DevTools.

##### Profiler de CPU {#cpu-profiler_1}

Aqui está um exemplo de como usar o [Profiler de CPU](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Invocar a lógica de negócios sob medição aqui...

    // algum tempo depois...
    session.post('Profiler.stop', (err, { profile }) => {
      // Escrever o perfil no disco, fazer upload, etc.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### Profiler de Heap {#heap-profiler_1}

Aqui está um exemplo de como usar o [Profiler de Heap](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## Objetos Comuns {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.10.0 | A API é exposta nas threads de worker. |
| v9.0.0 | Adicionado em: v9.0.0 |
:::

Tenta fechar todas as conexões restantes, bloqueando o loop de eventos até que todas sejam fechadas. Depois que todas as conexões são fechadas, desativa o inspector.

### `inspector.console` {#inspectorconsole}

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto para enviar mensagens para o console do inspector remoto.

```js [ESM]
require('node:inspector').console.log('a message');
```
O console do inspector não tem paridade de API com o console do Node.js.


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.6.0 | inspector.open() agora retorna um objeto `Disposable`. |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta para escutar conexões do inspetor. Opcional. **Padrão:** o que foi especificado na CLI.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host para escutar conexões do inspetor. Opcional. **Padrão:** o que foi especificado na CLI.
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Bloqueia até que um cliente tenha se conectado. Opcional. **Padrão:** `false`.
- Retorna: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Um Disposable que chama [`inspector.close()`](/pt/nodejs/api/inspector#inspectorclose).

Ativa o inspetor no host e na porta. Equivalente a `node --inspect=[[host:]port]`, mas pode ser feito programaticamente após o Node ter sido iniciado.

Se wait for `true`, irá bloquear até que um cliente tenha se conectado à porta de inspeção e o controle de fluxo tenha sido passado para o cliente do depurador.

Veja o [aviso de segurança](/pt/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) sobre o uso do parâmetro `host`.

### `inspector.url()` {#inspectorurl}

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Retorna a URL do inspetor ativo, ou `undefined` se não houver nenhum.

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**Adicionado em: v12.7.0**

Bloqueia até que um cliente (existente ou conectado posteriormente) tenha enviado o comando `Runtime.runIfWaitingForDebugger`.

Uma exceção será lançada se não houver um inspetor ativo.

## Integração com o DevTools {#integration-with-devtools}

O módulo `node:inspector` fornece uma API para integração com as ferramentas de desenvolvedor que suportam o Protocolo Chrome DevTools. Os frontends do DevTools conectados a uma instância Node.js em execução podem capturar eventos de protocolo emitidos da instância e exibi-los de acordo para facilitar a depuração. Os métodos a seguir transmitem um evento de protocolo para todos os frontends conectados. Os `params` passados para os métodos podem ser opcionais, dependendo do protocolo.

```js [ESM]
// O evento `Network.requestWillBeSent` será disparado.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**Adicionado em: v22.6.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Este recurso está disponível apenas com a flag `--experimental-network-inspection` habilitada.

Transmite o evento `Network.requestWillBeSent` para os frontends conectados. Este evento indica que o aplicativo está prestes a enviar uma solicitação HTTP.

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**Adicionado em: v22.6.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Este recurso está disponível apenas com a flag `--experimental-network-inspection` habilitada.

Transmite o evento `Network.responseReceived` para os frontends conectados. Este evento indica que a resposta HTTP está disponível.


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Adicionado em: v22.6.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Este recurso só está disponível com a flag `--experimental-network-inspection` habilitada.

Transmite o evento `Network.loadingFinished` para frontends conectados. Este evento indica que a requisição HTTP terminou de carregar.

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Adicionado em: v22.7.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Este recurso só está disponível com a flag `--experimental-network-inspection` habilitada.

Transmite o evento `Network.loadingFailed` para frontends conectados. Este evento indica que a requisição HTTP falhou ao carregar.

## Suporte a breakpoints {#support-of-breakpoints}

O Protocolo Chrome DevTools [`Debugger` domain](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) permite que uma `inspector.Session` se conecte a um programa e defina breakpoints para percorrer os códigos.

No entanto, a definição de breakpoints com uma `inspector.Session` de mesma thread, que é conectada por [`session.connect()`](/pt/nodejs/api/inspector#sessionconnect), deve ser evitada, pois o programa que está sendo anexado e pausado é exatamente o próprio depurador. Em vez disso, tente se conectar à thread principal por meio de [`session.connectToMainThread()`](/pt/nodejs/api/inspector#sessionconnecttomainthread) e definir breakpoints em uma thread de worker, ou conectar-se com um programa [Debugger](/pt/nodejs/api/debugger) por meio de uma conexão WebSocket.

