---
title: Documentação da API de Processo do Node.js
description: Documentação detalhada sobre o módulo de processo do Node.js, abordando gerenciamento de processos, variáveis de ambiente, sinais e mais.
head:
  - - meta
    - name: og:title
      content: Documentação da API de Processo do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentação detalhada sobre o módulo de processo do Node.js, abordando gerenciamento de processos, variáveis de ambiente, sinais e mais.
  - - meta
    - name: twitter:title
      content: Documentação da API de Processo do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentação detalhada sobre o módulo de processo do Node.js, abordando gerenciamento de processos, variáveis de ambiente, sinais e mais.
---


# Processo {#process}

**Código Fonte:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

O objeto `process` fornece informações e controle sobre o processo Node.js atual.



::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## Eventos do Processo {#process-events}

O objeto `process` é uma instância de [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter).

### Evento: `'beforeExit'` {#event-beforeexit}

**Adicionado em: v0.11.12**

O evento `'beforeExit'` é emitido quando o Node.js esvazia seu loop de eventos e não tem trabalho adicional para agendar. Normalmente, o processo Node.js será encerrado quando não houver trabalho agendado, mas um listener registrado no evento `'beforeExit'` pode fazer chamadas assíncronas e, assim, fazer com que o processo Node.js continue.

A função de callback do listener é invocada com o valor de [`process.exitCode`](/pt/nodejs/api/process#processexitcode_1) passado como o único argumento.

O evento `'beforeExit'` *não* é emitido para condições que causam terminação explícita, como chamar [`process.exit()`](/pt/nodejs/api/process#processexitcode) ou exceções não capturadas.

O `'beforeExit'` *não* deve ser usado como uma alternativa ao evento `'exit'` a menos que a intenção seja agendar trabalho adicional.



::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```
:::


### Evento: `'disconnect'` {#event-disconnect}

**Adicionado em: v0.7.7**

Se o processo Node.js for gerado com um canal IPC (veja a documentação de [Processo Filho](/pt/nodejs/api/child_process) e [Cluster](/pt/nodejs/api/cluster)), o evento `'disconnect'` será emitido quando o canal IPC for fechado.

### Evento: `'exit'` {#event-exit}

**Adicionado em: v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O evento `'exit'` é emitido quando o processo Node.js está prestes a ser encerrado como resultado de:

- O método `process.exit()` sendo chamado explicitamente;
- O loop de eventos do Node.js não ter mais nenhum trabalho adicional a ser realizado.

Não há como impedir a saída do loop de eventos neste ponto e, uma vez que todos os listeners de `'exit'` terminarem de ser executados, o processo Node.js será encerrado.

A função de callback do listener é invocada com o código de saída especificado pela propriedade [`process.exitCode`](/pt/nodejs/api/process#processexitcode_1) ou pelo argumento `exitCode` passado para o método [`process.exit()`](/pt/nodejs/api/process#processexitcode).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
:::

As funções de listener **devem** apenas realizar operações **síncronas**. O processo Node.js será encerrado imediatamente após chamar os listeners de evento `'exit'`, fazendo com que qualquer trabalho adicional ainda enfileirado no loop de eventos seja abandonado. No exemplo a seguir, por exemplo, o timeout nunca ocorrerá:

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```
:::


### Evento: `'message'` {#event-message}

**Adicionado em: v0.5.10**

- `message` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<nulo\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) um objeto JSON analisado ou um valor primitivo serializável.
- `sendHandle` [\<net.Server\>](/pt/nodejs/api/net#class-netserver) | [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) um objeto [`net.Server`](/pt/nodejs/api/net#class-netserver) ou [`net.Socket`](/pt/nodejs/api/net#class-netsocket), ou indefinido.

Se o processo Node.js for gerado com um canal IPC (consulte a documentação de [Processo Filho](/pt/nodejs/api/child_process) e [Cluster](/pt/nodejs/api/cluster)), o evento `'message'` é emitido sempre que uma mensagem enviada por um processo pai usando [`childprocess.send()`](/pt/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) é recebida pelo processo filho.

A mensagem passa por serialização e análise. A mensagem resultante pode não ser a mesma que foi enviada originalmente.

Se a opção `serialization` foi definida como `advanced` ao gerar o processo, o argumento `message` pode conter dados que o JSON não consegue representar. Consulte [Serialização avançada para `child_process`](/pt/nodejs/api/child_process#advanced-serialization) para obter mais detalhes.

### Evento: `'multipleResolves'` {#event-multipleresolves}

**Adicionado em: v10.12.0**

**Obsoleto desde: v17.6.0, v16.15.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo de resolução. Um de `'resolve'` ou `'reject'`.
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) A promise que resolveu ou rejeitou mais de uma vez.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O valor com o qual a promise foi resolvida ou rejeitada após a resolução original.

O evento `'multipleResolves'` é emitido sempre que uma `Promise` foi:

- Resolvida mais de uma vez.
- Rejeitada mais de uma vez.
- Rejeitada após a resolução.
- Resolvida após a rejeição.

Isso é útil para rastrear possíveis erros em um aplicativo ao usar o construtor `Promise`, pois várias resoluções são ignoradas silenciosamente. No entanto, a ocorrência desse evento não indica necessariamente um erro. Por exemplo, [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) pode acionar um evento `'multipleResolves'`.

Devido à falta de confiabilidade do evento em casos como o exemplo [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) acima, ele foi descontinuado.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### Evento: `'rejectionHandled'` {#event-rejectionhandled}

**Adicionado em: v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) A promessa tratada tardiamente.

O evento `'rejectionHandled'` é emitido sempre que uma `Promise` foi rejeitada e um manipulador de erros foi anexado a ela (usando [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch), por exemplo) posteriormente a uma volta do loop de eventos do Node.js.

O objeto `Promise` teria sido previamente emitido em um evento `'unhandledRejection'`, mas durante o curso do processamento ganhou um manipulador de rejeição.

Não há noção de um nível superior para uma cadeia `Promise` no qual as rejeições sempre podem ser tratadas. Sendo inerentemente assíncrona em sua natureza, uma rejeição de `Promise` pode ser tratada em um ponto futuro no tempo, possivelmente muito mais tarde do que a volta do loop de eventos que leva para o evento `'unhandledRejection'` ser emitido.

Outra maneira de dizer isso é que, ao contrário do código síncrono, onde há uma lista cada vez maior de exceções não tratadas, com Promises pode haver uma lista crescente e decrescente de rejeições não tratadas.

No código síncrono, o evento `'uncaughtException'` é emitido quando a lista de exceções não tratadas cresce.

No código assíncrono, o evento `'unhandledRejection'` é emitido quando a lista de rejeições não tratadas cresce e o evento `'rejectionHandled'` é emitido quando a lista de rejeições não tratadas diminui.

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

Neste exemplo, o `Map` `unhandledRejections` crescerá e diminuirá com o tempo, refletindo as rejeições que começam não tratadas e depois se tornam tratadas. É possível registrar tais erros em um log de erros, seja periodicamente (o que provavelmente é melhor para aplicações de longa duração) ou ao sair do processo (o que provavelmente é mais conveniente para scripts).


### Evento: `'workerMessage'` {#event-workermessage}

**Adicionado em: v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Um valor transmitido usando [`postMessageToThread()`](/pt/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID da thread de worker de transmissão ou `0` para a thread principal.

O evento `'workerMessage'` é emitido para qualquer mensagem de entrada enviada pela outra parte usando [`postMessageToThread()`](/pt/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).

### Evento: `'uncaughtException'` {#event-uncaughtexception}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.0.0, v10.17.0 | Adicionado o argumento `origin`. |
| v0.1.18 | Adicionado em: v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) A exceção não capturada.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indica se a exceção se origina de uma rejeição não tratada ou de um erro síncrono. Pode ser `'uncaughtException'` ou `'unhandledRejection'`. O último é usado quando uma exceção acontece em um contexto assíncrono baseado em `Promise` (ou se uma `Promise` é rejeitada) e a flag [`--unhandled-rejections`](/pt/nodejs/api/cli#--unhandled-rejectionsmode) está definida como `strict` ou `throw` (que é o padrão) e a rejeição não é tratada, ou quando uma rejeição acontece durante a fase de carregamento estático do módulo ES do ponto de entrada da linha de comando.

O evento `'uncaughtException'` é emitido quando uma exceção JavaScript não capturada borbulha de volta ao loop de eventos. Por padrão, o Node.js lida com tais exceções imprimindo o stack trace para `stderr` e saindo com o código 1, substituindo qualquer [`process.exitCode`](/pt/nodejs/api/process#processexitcode_1) definido anteriormente. Adicionar um manipulador para o evento `'uncaughtException'` substitui este comportamento padrão. Alternativamente, altere o [`process.exitCode`](/pt/nodejs/api/process#processexitcode_1) no manipulador `'uncaughtException'` que resultará na saída do processo com o código de saída fornecido. Caso contrário, na presença de tal manipulador, o processo sairá com 0.



::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

É possível monitorar eventos `'uncaughtException'` sem substituir o comportamento padrão de sair do processo, instalando um listener `'uncaughtExceptionMonitor'`.


#### Aviso: Usando `'uncaughtException'` corretamente {#warning-using-uncaughtexception-correctly}

`'uncaughtException'` é um mecanismo bruto para tratamento de exceções destinado a ser usado apenas como último recurso. O evento *não deve* ser usado como equivalente a `On Error Resume Next`. Exceções não tratadas inerentemente significam que um aplicativo está em um estado indefinido. Tentar retomar o código do aplicativo sem se recuperar adequadamente da exceção pode causar problemas adicionais imprevistos e imprevisíveis.

Exceções lançadas de dentro do manipulador de eventos não serão capturadas. Em vez disso, o processo será encerrado com um código de saída diferente de zero e o rastreamento de pilha será impresso. Isso é para evitar recursão infinita.

Tentar retomar normalmente após uma exceção não capturada pode ser semelhante a puxar o cabo de alimentação ao atualizar um computador. Nove em cada dez vezes, nada acontece. Mas na décima vez, o sistema é corrompido.

O uso correto de `'uncaughtException'` é realizar a limpeza síncrona de recursos alocados (por exemplo, descritores de arquivo, handles, etc.) antes de desligar o processo. **Não é seguro retomar a operação normal após
<code>'uncaughtException'</code>.**

Para reiniciar um aplicativo travado de uma forma mais confiável, seja `'uncaughtException'` emitido ou não, um monitor externo deve ser empregado em um processo separado para detectar falhas de aplicativos e recuperar ou reiniciar conforme necessário.

### Evento: `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**Adicionado em: v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) A exceção não capturada.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Indica se a exceção se origina de uma rejeição não tratada ou de erros síncronos. Pode ser `'uncaughtException'` ou `'unhandledRejection'`. O último é usado quando uma exceção acontece em um contexto assíncrono baseado em `Promise` (ou se uma `Promise` é rejeitada) e o sinalizador [`--unhandled-rejections`](/pt/nodejs/api/cli#--unhandled-rejectionsmode) está definido como `strict` ou `throw` (que é o padrão) e a rejeição não é tratada, ou quando uma rejeição acontece durante a fase de carregamento estático do módulo ES do ponto de entrada da linha de comando.

O evento `'uncaughtExceptionMonitor'` é emitido antes que um evento `'uncaughtException'` seja emitido ou um hook instalado via [`process.setUncaughtExceptionCaptureCallback()`](/pt/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) seja chamado.

Instalar um listener `'uncaughtExceptionMonitor'` não altera o comportamento uma vez que um evento `'uncaughtException'` é emitido. O processo ainda travará se nenhum listener `'uncaughtException'` estiver instalado.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intencionalmente cause uma exceção, mas não a capture.
nonexistentFunc();
// Ainda trava o Node.js
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intencionalmente cause uma exceção, mas não a capture.
nonexistentFunc();
// Ainda trava o Node.js
```
:::


### Evento: `'unhandledRejection'` {#event-unhandledrejection}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v7.0.0 | Não tratar rejeições de `Promise` está obsoleto. |
| v6.6.0 | Rejeições de `Promise` não tratadas agora emitirão um aviso do processo. |
| v1.4.1 | Adicionado em: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) O objeto com o qual a promise foi rejeitada (tipicamente um objeto [`Error`](/pt/nodejs/api/errors#class-error)).
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) A promise rejeitada.

O evento `'unhandledRejection'` é emitido sempre que uma `Promise` é rejeitada e nenhum manipulador de erros é anexado à promise dentro de um ciclo do event loop. Ao programar com Promises, exceções são encapsuladas como "promises rejeitadas". Rejeições podem ser capturadas e tratadas usando [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) e são propagadas através de uma cadeia de `Promise`. O evento `'unhandledRejection'` é útil para detectar e acompanhar promises que foram rejeitadas e cujas rejeições ainda não foram tratadas.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Rejeição Não Tratada em:', promise, 'razão:', reason);
  // Registro específico da aplicação, lançando um erro ou outra lógica aqui
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Observe o erro de digitação (`pasre`)
}); // Sem `.catch()` ou `.then()`
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Rejeição Não Tratada em:', promise, 'razão:', reason);
  // Registro específico da aplicação, lançando um erro ou outra lógica aqui
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Observe o erro de digitação (`pasre`)
}); // Sem `.catch()` ou `.then()`
```
:::

O seguinte também irá disparar a emissão do evento `'unhandledRejection'`:

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // Inicialmente define o status carregado para uma promise rejeitada
  this.loaded = Promise.reject(new Error('Recurso ainda não carregado!'));
}

const resource = new SomeResource();
// sem .catch ou .then em resource.loaded por pelo menos um ciclo
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // Inicialmente define o status carregado para uma promise rejeitada
  this.loaded = Promise.reject(new Error('Recurso ainda não carregado!'));
}

const resource = new SomeResource();
// sem .catch ou .then em resource.loaded por pelo menos um ciclo
```
:::

Neste caso de exemplo, é possível rastrear a rejeição como um erro de desenvolvedor, como normalmente seria o caso para outros eventos `'unhandledRejection'`. Para resolver tais falhas, um manipulador [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) não operacional pode ser anexado a `resource.loaded`, o que impediria que o evento `'unhandledRejection'` fosse emitido.


### Evento: `'warning'` {#event-warning}

**Adicionado em: v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) As propriedades principais do aviso são:
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do aviso. **Padrão:** `'Warning'`.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma descrição do aviso fornecida pelo sistema.
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um rastreamento de pilha para o local no código onde o aviso foi emitido.

O evento `'warning'` é emitido sempre que o Node.js emite um aviso de processo.

Um aviso de processo é semelhante a um erro, pois descreve condições excepcionais que estão sendo trazidas à atenção do usuário. No entanto, os avisos não fazem parte do fluxo normal de tratamento de erros do Node.js e do JavaScript. O Node.js pode emitir avisos sempre que detectar práticas de codificação ruins que podem levar a um desempenho subótimo do aplicativo, bugs ou vulnerabilidades de segurança.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // Imprime o nome do aviso
  console.warn(warning.message); // Imprime a mensagem do aviso
  console.warn(warning.stack);   // Imprime o rastreamento de pilha
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // Imprime o nome do aviso
  console.warn(warning.message); // Imprime a mensagem do aviso
  console.warn(warning.stack);   // Imprime o rastreamento de pilha
});
```
:::

Por padrão, o Node.js imprimirá avisos de processo para `stderr`. A opção de linha de comando `--no-warnings` pode ser usada para suprimir a saída padrão do console, mas o evento `'warning'` ainda será emitido pelo objeto `process`. Atualmente, não é possível suprimir tipos de aviso específicos além dos avisos de depreciação. Para suprimir avisos de depreciação, consulte o sinalizador [`--no-deprecation`](/pt/nodejs/api/cli#--no-deprecation).

O exemplo a seguir ilustra o aviso que é impresso em `stderr` quando muitos listeners foram adicionados a um evento:

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
Em contraste, o exemplo a seguir desativa a saída de aviso padrão e adiciona um manipulador personalizado ao evento `'warning'`:

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
A opção de linha de comando `--trace-warnings` pode ser usada para que a saída padrão do console para avisos inclua o rastreamento de pilha completo do aviso.

Iniciar o Node.js usando o sinalizador de linha de comando `--throw-deprecation` fará com que avisos de depreciação personalizados sejam lançados como exceções.

Usar o sinalizador de linha de comando `--trace-deprecation` fará com que a depreciação personalizada seja impressa em `stderr` junto com o rastreamento de pilha.

Usar o sinalizador de linha de comando `--no-deprecation` suprimirá todos os relatórios da depreciação personalizada.

Os sinalizadores de linha de comando `*-deprecation` afetam apenas os avisos que usam o nome `'DeprecationWarning'`.


#### Emitindo avisos personalizados {#emitting-custom-warnings}

Consulte o método [`process.emitWarning()`](/pt/nodejs/api/process#processemitwarningwarning-type-code-ctor) para emitir avisos personalizados ou específicos da aplicação.

#### Nomes de avisos do Node.js {#nodejs-warning-names}

Não existem diretrizes rígidas para os tipos de aviso (conforme identificado pela propriedade `name`) emitidos pelo Node.js. Novos tipos de avisos podem ser adicionados a qualquer momento. Alguns dos tipos de avisos mais comuns incluem:

- `'DeprecationWarning'` - Indica o uso de uma API ou funcionalidade obsoleta do Node.js. Tais avisos devem incluir uma propriedade `'code'` identificando o [código de depreciação](/pt/nodejs/api/deprecations).
- `'ExperimentalWarning'` - Indica o uso de uma API ou funcionalidade experimental do Node.js. Tais funcionalidades devem ser usadas com cautela, pois podem mudar a qualquer momento e não estão sujeitas às mesmas políticas estritas de versionamento semântico e suporte de longo prazo que as funcionalidades suportadas.
- `'MaxListenersExceededWarning'` - Indica que muitos listeners para um determinado evento foram registrados em um `EventEmitter` ou `EventTarget`. Isso geralmente é uma indicação de um vazamento de memória.
- `'TimeoutOverflowWarning'` - Indica que um valor numérico que não cabe em um inteiro de 32 bits com sinal foi fornecido para as funções `setTimeout()` ou `setInterval()`.
- `'TimeoutNegativeWarning'` - Indica que um número negativo foi fornecido para as funções `setTimeout()` ou `setInterval()`.
- `'TimeoutNaNWarning'` - Indica que um valor que não é um número foi fornecido para as funções `setTimeout()` ou `setInterval()`.
- `'UnsupportedWarning'` - Indica o uso de uma opção ou funcionalidade não suportada que será ignorada em vez de tratada como um erro. Um exemplo é o uso da mensagem de status de resposta HTTP ao usar a API de compatibilidade HTTP/2.

### Evento: `'worker'` {#event-worker}

**Adicionado em: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/pt/nodejs/api/worker_threads#class-worker) O [\<Worker\>](/pt/nodejs/api/worker_threads#class-worker) que foi criado.

O evento `'worker'` é emitido após a criação de uma nova thread [\<Worker\>](/pt/nodejs/api/worker_threads#class-worker).


### Eventos de Sinal {#signal-events}

Eventos de sinal serão emitidos quando o processo do Node.js receber um sinal. Consulte [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) para obter uma lista de nomes de sinais POSIX padrão, como `'SIGINT'`, `'SIGHUP'`, etc.

Sinais não estão disponíveis em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).

O manipulador de sinal receberá o nome do sinal (`'SIGINT'`, `'SIGTERM'`, etc.) como o primeiro argumento.

O nome de cada evento será o nome comum em maiúsculas para o sinal (por exemplo, `'SIGINT'` para sinais `SIGINT`).

::: code-group
```js [ESM]
import process from 'node:process';

// Comece a ler do stdin para que o processo não seja encerrado.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Usando uma única função para lidar com vários sinais
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// Comece a ler do stdin para que o processo não seja encerrado.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Usando uma única função para lidar com vários sinais
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'` é reservado pelo Node.js para iniciar o [depurador](/pt/nodejs/api/debugger). É possível instalar um listener, mas fazê-lo pode interferir no depurador.
- `'SIGTERM'` e `'SIGINT'` têm manipuladores padrão em plataformas não Windows que redefinem o modo de terminal antes de sair com o código `128 + número do sinal`. Se um desses sinais tiver um listener instalado, seu comportamento padrão será removido (o Node.js não será mais encerrado).
- `'SIGPIPE'` é ignorado por padrão. Ele pode ter um listener instalado.
- `'SIGHUP'` é gerado no Windows quando a janela do console é fechada e, em outras plataformas, sob várias condições semelhantes. Consulte [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7). Ele pode ter um listener instalado, no entanto, o Node.js será incondicionalmente terminado pelo Windows cerca de 10 segundos depois. Em plataformas não Windows, o comportamento padrão de `SIGHUP` é terminar o Node.js, mas uma vez que um listener tenha sido instalado, seu comportamento padrão será removido.
- `'SIGTERM'` não é suportado no Windows, ele pode ser escutado.
- `'SIGINT'` do terminal é suportado em todas as plataformas e geralmente pode ser gerado com + (embora isso possa ser configurável). Ele não é gerado quando o [modo bruto do terminal](/pt/nodejs/api/tty#readstreamsetrawmodemode) está habilitado e + é usado.
- `'SIGBREAK'` é entregue no Windows quando + é pressionado. Em plataformas não Windows, ele pode ser escutado, mas não há como enviá-lo ou gerá-lo.
- `'SIGWINCH'` é entregue quando o console foi redimensionado. No Windows, isso só acontecerá na gravação no console quando o cursor estiver sendo movido ou quando um tty legível for usado no modo bruto.
- `'SIGKILL'` não pode ter um listener instalado, ele terminará incondicionalmente o Node.js em todas as plataformas.
- `'SIGSTOP'` não pode ter um listener instalado.
- `'SIGBUS'`, `'SIGFPE'`, `'SIGSEGV'` e `'SIGILL'`, quando não levantados artificialmente usando [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2), inerentemente deixam o processo em um estado do qual não é seguro chamar listeners JS. Fazer isso pode fazer com que o processo pare de responder.
- `0` pode ser enviado para testar a existência de um processo, não tem efeito se o processo existir, mas lançará um erro se o processo não existir.

O Windows não suporta sinais, portanto, não tem equivalente à terminação por sinal, mas o Node.js oferece alguma emulação com [`process.kill()`](/pt/nodejs/api/process#processkillpid-signal) e [`subprocess.kill()`](/pt/nodejs/api/child_process#subprocesskillsignal):

- O envio de `SIGINT`, `SIGTERM` e `SIGKILL` causará a terminação incondicional do processo de destino e, posteriormente, o subprocesso relatará que o processo foi terminado por sinal.
- O envio do sinal `0` pode ser usado como uma forma independente de plataforma para testar a existência de um processo.


## `process.abort()` {#processabort}

**Adicionado em: v0.7.0**

O método `process.abort()` faz com que o processo Node.js saia imediatamente e gere um arquivo core.

Este recurso não está disponível nas threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**Adicionado em: v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

A propriedade `process.allowedNodeEnvironmentFlags` é um `Set` especial, somente leitura, de flags permitidas dentro da variável de ambiente [`NODE_OPTIONS`](/pt/nodejs/api/cli#node_optionsoptions).

`process.allowedNodeEnvironmentFlags` estende `Set`, mas substitui `Set.prototype.has` para reconhecer várias representações possíveis de flags. `process.allowedNodeEnvironmentFlags.has()` retornará `true` nos seguintes casos:

- As flags podem omitir hífens únicos (`-`) ou duplos (`--`) iniciais; por exemplo, `inspect-brk` para `--inspect-brk`, ou `r` para `-r`.
- As flags passadas para o V8 (conforme listado em `--v8-options`) podem substituir um ou mais hífens *não iniciais* por um sublinhado, ou vice-versa; por exemplo, `--perf_basic_prof`, `--perf-basic-prof`, `--perf_basic-prof`, etc.
- As flags podem conter um ou mais caracteres de igual (`=`); todos os caracteres após e incluindo o primeiro sinal de igual serão ignorados; por exemplo, `--stack-trace-limit=100`.
- As flags *devem* ser permitidas dentro de [`NODE_OPTIONS`](/pt/nodejs/api/cli#node_optionsoptions).

Ao iterar sobre `process.allowedNodeEnvironmentFlags`, as flags aparecerão apenas *uma vez*; cada uma começará com um ou mais hífens. As flags passadas para o V8 conterão sublinhados em vez de hífens não iniciais:

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

Os métodos `add()`, `clear()` e `delete()` de `process.allowedNodeEnvironmentFlags` não fazem nada e falharão silenciosamente.

Se o Node.js foi compilado *sem* suporte a [`NODE_OPTIONS`](/pt/nodejs/api/cli#node_optionsoptions) (mostrado em [`process.config`](/pt/nodejs/api/process#processconfig)), `process.allowedNodeEnvironmentFlags` conterá o que *teria sido* permitido.


## `process.arch` {#processarch}

**Adicionado em: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A arquitetura da CPU do sistema operacional para o qual o binário do Node.js foi compilado. Os valores possíveis são: `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` e `'x64'`.

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`A arquitetura deste processador é ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`A arquitetura deste processador é ${arch}`);
```
:::

## `process.argv` {#processargv}

**Adicionado em: v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `process.argv` retorna um array contendo os argumentos de linha de comando passados quando o processo Node.js foi iniciado. O primeiro elemento será [`process.execPath`](/pt/nodejs/api/process#processexecpath). Consulte `process.argv0` se o acesso ao valor original de `argv[0]` for necessário. O segundo elemento será o caminho para o arquivo JavaScript que está sendo executado. Os elementos restantes serão quaisquer argumentos adicionais de linha de comando.

Por exemplo, assumindo o seguinte script para `process-args.js`:

::: code-group
```js [ESM]
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

Iniciando o processo Node.js como:

```bash [BASH]
node process-args.js one two=three four
```
Geraria a saída:

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Adicionado em: v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `process.argv0` armazena uma cópia somente leitura do valor original de `argv[0]` passado quando o Node.js é iniciado.

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | O objeto não expõe mais acidentalmente vinculações nativas de C++. |
| v7.1.0 | Adicionado em: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Se o processo Node.js foi gerado com um canal IPC (consulte a documentação de [Processo Filho](/pt/nodejs/api/child_process)), a propriedade `process.channel` é uma referência ao canal IPC. Se não existir um canal IPC, esta propriedade será `undefined`.

### `process.channel.ref()` {#processchannelref}

**Adicionado em: v7.1.0**

Este método faz com que o canal IPC mantenha o loop de eventos do processo em execução se `.unref()` tiver sido chamado antes.

Normalmente, isso é gerenciado através do número de listeners `'disconnect'` e `'message'` no objeto `process`. No entanto, este método pode ser usado para solicitar explicitamente um comportamento específico.

### `process.channel.unref()` {#processchannelunref}

**Adicionado em: v7.1.0**

Este método faz com que o canal IPC não mantenha o loop de eventos do processo em execução e permite que ele termine mesmo enquanto o canal está aberto.

Normalmente, isso é gerenciado através do número de listeners `'disconnect'` e `'message'` no objeto `process`. No entanto, este método pode ser usado para solicitar explicitamente um comportamento específico.

## `process.chdir(directory)` {#processchdirdirectory}

**Adicionado em: v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `process.chdir()` altera o diretório de trabalho atual do processo Node.js ou lança uma exceção se isso falhar (por exemplo, se o `directory` especificado não existir).

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Diretório inicial: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`Novo diretório: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Diretório inicial: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`Novo diretório: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

Este recurso não está disponível em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).


## `process.config` {#processconfig}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | O objeto `process.config` agora está congelado. |
| v16.0.0 | Modificar process.config foi depreciado. |
| v0.7.7 | Adicionado em: v0.7.7 |
:::

- [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

A propriedade `process.config` retorna um `Objeto` congelado contendo a representação JavaScript das opções de configuração usadas para compilar o executável Node.js atual. Isso é o mesmo que o arquivo `config.gypi` que foi produzido ao executar o script `./configure`.

Um exemplo da possível saída se parece com:

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**Adicionado em: v0.7.2**

- [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se o processo Node.js for gerado com um canal IPC (veja a documentação de [Processo Filho](/pt/nodejs/api/child_process) e [Cluster](/pt/nodejs/api/cluster)), a propriedade `process.connected` retornará `true` enquanto o canal IPC estiver conectado e retornará `false` após `process.disconnect()` ser chamado.

Uma vez que `process.connected` é `false`, não é mais possível enviar mensagens pelo canal IPC usando `process.send()`.

## `process.constrainedMemory()` {#processconstrainedmemory}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | Valor de retorno alinhado com `uv_get_constrained_memory`. |
| v19.6.0, v18.15.0 | Adicionado em: v19.6.0, v18.15.0 |
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<número\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Obtém a quantidade de memória disponível para o processo (em bytes) com base nos limites impostos pelo SO. Se não houver tal restrição, ou se a restrição for desconhecida, `0` é retornado.

Veja [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory) para mais informações.


## `process.availableMemory()` {#processavailablememory}

**Adicionado em: v22.0.0, v20.13.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Obtém a quantidade de memória livre que ainda está disponível para o processo (em bytes).

Consulte [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory) para obter mais informações.

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Adicionado em: v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um valor de retorno anterior da chamada `process.cpuUsage()`
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O método `process.cpuUsage()` retorna o tempo de uso da CPU do usuário e do sistema do processo atual, em um objeto com propriedades `user` e `system`, cujos valores são valores de microssegundos (milionésimo de segundo). Esses valores medem o tempo gasto no código do usuário e do sistema, respectivamente, e podem acabar sendo maiores que o tempo decorrido real se vários núcleos da CPU estiverem executando o trabalho para este processo.

O resultado de uma chamada anterior para `process.cpuUsage()` pode ser passado como o argumento para a função, para obter uma leitura de diferença.

::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// simula o uso da CPU por 500 milissegundos
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// simula o uso da CPU por 500 milissegundos
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**Adicionado em: v0.1.8**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `process.cwd()` retorna o diretório de trabalho atual do processo Node.js.

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Diretório atual: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Diretório atual: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**Adicionado em: v0.7.2**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A porta usada pelo depurador Node.js quando ativado.

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**Adicionado em: v0.7.2**

Se o processo Node.js for gerado com um canal IPC (veja a documentação de [Processo Filho](/pt/nodejs/api/child_process) e [Cluster](/pt/nodejs/api/cluster)), o método `process.disconnect()` fechará o canal IPC para o processo pai, permitindo que o processo filho saia normalmente quando não houver outras conexões o mantendo ativo.

O efeito de chamar `process.disconnect()` é o mesmo que chamar [`ChildProcess.disconnect()`](/pt/nodejs/api/child_process#subprocessdisconnect) do processo pai.

Se o processo Node.js não foi gerado com um canal IPC, `process.disconnect()` será `undefined`.

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | Adicionado suporte para o argumento `flags`. |
| v0.1.16 | Adicionado em: v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/pt/nodejs/api/os#dlopen-constants) **Padrão:** `os.constants.dlopen.RTLD_LAZY`

O método `process.dlopen()` permite carregar dinamicamente objetos compartilhados. É usado principalmente por `require()` para carregar Addons C++, e não deve ser usado diretamente, exceto em casos especiais. Em outras palavras, [`require()`](/pt/nodejs/api/globals#require) deve ser preferido em vez de `process.dlopen()` a menos que existam razões específicas, como flags dlopen personalizadas ou carregamento de módulos ES.

O argumento `flags` é um inteiro que permite especificar o comportamento dlopen. Veja a documentação [`os.constants.dlopen`](/pt/nodejs/api/os#dlopen-constants) para detalhes.

Um requisito importante ao chamar `process.dlopen()` é que a instância `module` deve ser passada. As funções exportadas pelo Addon C++ são então acessíveis via `module.exports`.

O exemplo abaixo mostra como carregar um Addon C++, nomeado `local.node`, que exporta uma função `foo`. Todos os símbolos são carregados antes que a chamada retorne, passando a constante `RTLD_NOW`. Neste exemplo, a constante é considerada disponível.

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(warning[, options])` {#processemitwarningwarning-options}

**Adicionado em: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) O aviso a ser emitido.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quando `warning` é uma `String`, `type` é o nome a ser usado para o *tipo* de aviso que está sendo emitido. **Padrão:** `'Warning'`.
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um identificador único para a instância de aviso que está sendo emitida.
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Quando `warning` é uma `String`, `ctor` é uma função opcional usada para limitar o rastreamento de pilha gerado. **Padrão:** `process.emitWarning`.
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Texto adicional para incluir com o erro.

O método `process.emitWarning()` pode ser usado para emitir avisos de processo personalizados ou específicos do aplicativo. Estes podem ser ouvidos adicionando um manipulador ao evento [`'warning'`](/pt/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emitir um aviso com um código e detalhes adicionais.
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// Emite:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emitir um aviso com um código e detalhes adicionais.
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// Emite:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```
:::

Neste exemplo, um objeto `Error` é gerado internamente por `process.emitWarning()` e passado para o manipulador de [`'warning'`](/pt/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Stack trace
  console.warn(warning.detail);  // 'This is some additional information'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Stack trace
  console.warn(warning.detail);  // 'This is some additional information'
});
```
:::

Se `warning` for passado como um objeto `Error`, o argumento `options` será ignorado.


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**Adicionado em: v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) O aviso a ser emitido.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quando `warning` é uma `String`, `type` é o nome a ser usado para o *tipo* de aviso que está sendo emitido. **Padrão:** `'Warning'`.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um identificador único para a instância de aviso que está sendo emitida.
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Quando `warning` é uma `String`, `ctor` é uma função opcional usada para limitar o stack trace gerado. **Padrão:** `process.emitWarning`.

O método `process.emitWarning()` pode ser usado para emitir avisos de processo personalizados ou específicos do aplicativo. Eles podem ser ouvidos adicionando um manipulador ao evento [`'warning'`](/pt/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emitir um aviso usando uma string.
emitWarning('Aconteceu algo!');
// Emite: (node: 56338) Warning: Aconteceu algo!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emitir um aviso usando uma string.
emitWarning('Aconteceu algo!');
// Emite: (node: 56338) Warning: Aconteceu algo!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emitir um aviso usando uma string e um tipo.
emitWarning('Aconteceu algo!', 'AvisoPersonalizado');
// Emite: (node:56338) AvisoPersonalizado: Aconteceu algo!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emitir um aviso usando uma string e um tipo.
emitWarning('Aconteceu algo!', 'AvisoPersonalizado');
// Emite: (node:56338) AvisoPersonalizado: Aconteceu algo!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('Aconteceu algo!', 'AvisoPersonalizado', 'WARN001');
// Emite: (node:56338) [WARN001] AvisoPersonalizado: Aconteceu algo!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('Aconteceu algo!', 'AvisoPersonalizado', 'WARN001');
// Emite: (node:56338) [WARN001] AvisoPersonalizado: Aconteceu algo!
```
:::

Em cada um dos exemplos anteriores, um objeto `Error` é gerado internamente por `process.emitWarning()` e passado para o manipulador de [`'warning'`](/pt/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

Se `warning` for passado como um objeto `Error`, ele será passado para o manipulador de eventos `'warning'` sem modificação (e os argumentos opcionais `type`, `code` e `ctor` serão ignorados):

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Emitir um aviso usando um objeto Error.
const myWarning = new Error('Aconteceu algo!');
// Use a propriedade name do Error para especificar o nome do tipo
myWarning.name = 'AvisoPersonalizado';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emite: (node:56338) [WARN001] AvisoPersonalizado: Aconteceu algo!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Emitir um aviso usando um objeto Error.
const myWarning = new Error('Aconteceu algo!');
// Use a propriedade name do Error para especificar o nome do tipo
myWarning.name = 'AvisoPersonalizado';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emite: (node:56338) [WARN001] AvisoPersonalizado: Aconteceu algo!
```
:::

Um `TypeError` é lançado se `warning` for qualquer coisa além de uma string ou objeto `Error`.

Embora os avisos de processo usem objetos `Error`, o mecanismo de aviso de processo **não** é um substituto para os mecanismos normais de tratamento de erros.

O seguinte tratamento adicional é implementado se o `type` de aviso for `'DeprecationWarning'`:

- Se o sinalizador de linha de comando `--throw-deprecation` for usado, o aviso de obsolescência será lançado como uma exceção em vez de ser emitido como um evento.
- Se o sinalizador de linha de comando `--no-deprecation` for usado, o aviso de obsolescência será suprimido.
- Se o sinalizador de linha de comando `--trace-deprecation` for usado, o aviso de obsolescência será impresso em `stderr` juntamente com o stack trace completo.


### Evitando avisos duplicados {#avoiding-duplicate-warnings}

Como prática recomendada, os avisos devem ser emitidos apenas uma vez por processo. Para fazer isso, coloque o `emitWarning()` atrás de um booleano.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```
:::

## `process.env` {#processenv}

::: info [Histórico]
| Versão  | Mudanças                                                                                                                                          |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| v11.14.0 | As threads de Worker agora usarão uma cópia do `process.env` da thread pai por padrão, configurável por meio da opção `env` do construtor `Worker`. |
| v10.0.0  | A conversão implícita do valor da variável para string está obsoleta.                                                                            |
| v0.1.27  | Adicionado em: v0.1.27                                                                                                                           |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

A propriedade `process.env` retorna um objeto contendo o ambiente do usuário. Consulte [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7).

Um exemplo desse objeto se parece com:

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
É possível modificar este objeto, mas tais modificações não serão refletidas fora do processo Node.js ou (a menos que explicitamente solicitado) para outras threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker). Em outras palavras, o exemplo a seguir não funcionaria:

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
Enquanto o seguinte irá:

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

Atribuir uma propriedade em `process.env` converterá implicitamente o valor em uma string. **Este comportamento está obsoleto.** As versões futuras do Node.js podem lançar um erro quando o valor não for uma string, número ou booleano.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

Use `delete` para excluir uma propriedade de `process.env`.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

Em sistemas operacionais Windows, as variáveis de ambiente não diferenciam maiúsculas de minúsculas.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

A menos que especificado explicitamente ao criar uma instância [`Worker`](/pt/nodejs/api/worker_threads#class-worker), cada thread [`Worker`](/pt/nodejs/api/worker_threads#class-worker) tem sua própria cópia de `process.env`, com base no `process.env` de sua thread pai, ou o que foi especificado como a opção `env` para o construtor [`Worker`](/pt/nodejs/api/worker_threads#class-worker). As alterações em `process.env` não serão visíveis nas threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker), e somente a thread principal pode fazer alterações que são visíveis para o sistema operacional ou para complementos nativos. No Windows, uma cópia de `process.env` em uma instância [`Worker`](/pt/nodejs/api/worker_threads#class-worker) opera de forma que diferencia maiúsculas de minúsculas, ao contrário da thread principal.


## `process.execArgv` {#processexecargv}

**Adicionado em: v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `process.execArgv` retorna o conjunto de opções de linha de comando específicas do Node.js passadas quando o processo do Node.js foi iniciado. Essas opções não aparecem no array retornado pela propriedade [`process.argv`](/pt/nodejs/api/process#processargv) e não incluem o executável do Node.js, o nome do script ou quaisquer opções após o nome do script. Essas opções são úteis para gerar processos filho com o mesmo ambiente de execução do pai.

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
Resulta em `process.execArgv`:

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
E `process.argv`:

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
Consulte o construtor [`Worker`](/pt/nodejs/api/worker_threads#new-workerfilename-options) para obter o comportamento detalhado das threads worker com esta propriedade.

## `process.execPath` {#processexecpath}

**Adicionado em: v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `process.execPath` retorna o nome do caminho absoluto do executável que iniciou o processo do Node.js. Links simbólicos, se houver, são resolvidos.

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v20.0.0 | Aceita apenas um código do tipo number ou do tipo string se representar um inteiro. |
| v0.1.13 | Adicionado em: v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O código de saída. Para o tipo string, apenas strings inteiras (por exemplo, '1') são permitidas. **Padrão:** `0`.

O método `process.exit()` instrui o Node.js a encerrar o processo de forma síncrona com um status de saída de `code`. Se `code` for omitido, exit usará o código 'success' `0` ou o valor de `process.exitCode` se ele tiver sido definido. O Node.js não será encerrado até que todos os listeners de evento [`'exit'`](/pt/nodejs/api/process#event-exit) sejam chamados.

Para sair com um código de 'failure':



::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

O shell que executou o Node.js deve ver o código de saída como `1`.

Chamar `process.exit()` forçará o processo a sair o mais rápido possível, mesmo que ainda haja operações assíncronas pendentes que ainda não foram concluídas totalmente, incluindo operações de E/S para `process.stdout` e `process.stderr`.

Na maioria das situações, não é realmente necessário chamar `process.exit()` explicitamente. O processo do Node.js será encerrado por conta própria *se não houver trabalho adicional pendente* no loop de eventos. A propriedade `process.exitCode` pode ser definida para informar ao processo qual código de saída usar quando o processo for encerrado normalmente.

Por exemplo, o exemplo a seguir ilustra um *uso incorreto* do método `process.exit()` que pode levar ao truncamento e perda de dados impressos em stdout:



::: code-group
```js [ESM]
import { exit } from 'node:process';

// Este é um exemplo do que *não* fazer:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// Este é um exemplo do que *não* fazer:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

A razão pela qual isso é problemático é porque as gravações em `process.stdout` no Node.js são às vezes *assíncronas* e podem ocorrer em vários ticks do loop de eventos do Node.js. Chamar `process.exit()`, no entanto, força o processo a sair *antes* que essas gravações adicionais em `stdout` possam ser executadas.

Em vez de chamar `process.exit()` diretamente, o código *deve* definir `process.exitCode` e permitir que o processo saia naturalmente, evitando agendar qualquer trabalho adicional para o loop de eventos:



::: code-group
```js [ESM]
import process from 'node:process';

// Como definir corretamente o código de saída, permitindo
// que o processo saia normalmente.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// Como definir corretamente o código de saída, permitindo
// que o processo saia normalmente.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

Se for necessário encerrar o processo do Node.js devido a uma condição de erro, lançar um erro *não capturado* e permitir que o processo seja encerrado de acordo é mais seguro do que chamar `process.exit()`.

Em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker), esta função interrompe a thread atual em vez do processo atual.


## `process.exitCode` {#processexitcode_1}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v20.0.0 | Aceita apenas um código do tipo number, ou do tipo string se representar um inteiro. |
| v0.11.8 | Adicionado em: v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) O código de saída. Para o tipo string, apenas strings de inteiros (por exemplo, '1') são permitidas. **Padrão:** `undefined`.

Um número que será o código de saída do processo, quando o processo sair normalmente ou for encerrado por meio de [`process.exit()`](/pt/nodejs/api/process#processexitcode) sem especificar um código.

Especificar um código para [`process.exit(code)`](/pt/nodejs/api/process#processexitcode) substituirá qualquer configuração anterior de `process.exitCode`.

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**Adicionado em: v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a versão atual do Node.js estiver armazenando em cache os módulos integrados.

## `process.features.debug` {#processfeaturesdebug}

**Adicionado em: v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a versão atual do Node.js for uma versão de depuração.

## `process.features.inspector` {#processfeaturesinspector}

**Adicionado em: v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a versão atual do Node.js incluir o inspetor.

## `process.features.ipv6` {#processfeaturesipv6}

**Adicionado em: v0.5.3**

**Obsoleto desde: v23.4.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Esta propriedade é sempre verdadeira e quaisquer verificações baseadas nela são redundantes.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a versão atual do Node.js incluir suporte para IPv6.

Como todas as versões do Node.js têm suporte para IPv6, esse valor é sempre `true`.


## `process.features.require_module` {#processfeaturesrequire_module}

**Adicionado em: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a build atual do Node.js suporta [carregar módulos ECMAScript usando `require()` ](/pt/nodejs/api/modules#loading-ecmascript-modules-using-require).

## `process.features.tls` {#processfeaturestls}

**Adicionado em: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a build atual do Node.js inclui suporte para TLS.

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**Adicionado em: v4.8.0**

**Obsoleto desde: v23.4.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use `process.features.tls` em vez disso.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a build atual do Node.js inclui suporte para ALPN em TLS.

No Node.js 11.0.0 e versões posteriores, as dependências do OpenSSL apresentam suporte incondicional ao ALPN. Portanto, esse valor é idêntico ao de `process.features.tls`.

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**Adicionado em: v0.11.13**

**Obsoleto desde: v23.4.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use `process.features.tls` em vez disso.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a build atual do Node.js inclui suporte para OCSP em TLS.

No Node.js 11.0.0 e versões posteriores, as dependências do OpenSSL apresentam suporte incondicional ao OCSP. Portanto, esse valor é idêntico ao de `process.features.tls`.

## `process.features.tls_sni` {#processfeaturestls_sni}

**Adicionado em: v0.5.3**

**Obsoleto desde: v23.4.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Use `process.features.tls` em vez disso.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a build atual do Node.js inclui suporte para SNI em TLS.

No Node.js 11.0.0 e versões posteriores, as dependências do OpenSSL apresentam suporte incondicional ao SNI. Portanto, esse valor é idêntico ao de `process.features.tls`.


## `process.features.typescript` {#processfeaturestypescript}

**Adicionado em: v23.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Um valor que é `"strip"` se o Node.js for executado com `--experimental-strip-types`, `"transform"` se o Node.js for executado com `--experimental-transform-types` e `false` caso contrário.

## `process.features.uv` {#processfeaturesuv}

**Adicionado em: v0.5.3**

**Obsoleto desde: v23.4.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Esta propriedade é sempre verdadeira, e quaisquer verificações baseadas nela são redundantes.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Um valor booleano que é `true` se a construção atual do Node.js inclui suporte para libuv.

Como não é possível construir o Node.js sem libuv, este valor é sempre `true`.

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A referência ao recurso que está sendo rastreado.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de retorno de chamada a ser chamada quando o recurso é finalizado.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A referência ao recurso que está sendo rastreado.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O evento que acionou a finalização. O padrão é 'exit'.



Esta função registra um retorno de chamada a ser chamado quando o processo emite o evento `exit` se o objeto `ref` não foi coletado como lixo. Se o objeto `ref` foi coletado como lixo antes que o evento `exit` seja emitido, o retorno de chamada será removido do registro de finalização e não será chamado na saída do processo.

Dentro do retorno de chamada, você pode liberar os recursos alocados pelo objeto `ref`. Esteja ciente de que todas as limitações aplicadas ao evento `beforeExit` também são aplicadas à função `callback`, o que significa que existe a possibilidade de que o retorno de chamada não seja chamado em circunstâncias especiais.

A ideia desta função é ajudá-lo a liberar recursos quando o processo começar a sair, mas também permitir que o objeto seja coletado como lixo se não estiver mais sendo usado.

Por exemplo: você pode registrar um objeto que contém um buffer, você quer ter certeza de que o buffer é liberado quando o processo sai, mas se o objeto for coletado como lixo antes da saída do processo, não precisamos mais liberar o buffer, então, neste caso, apenas removemos o retorno de chamada do registro de finalização.



::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Por favor, certifique-se de que a função passada para finalization.register()
// não cria um fechamento em torno de objetos desnecessários.
function onFinalize(obj, event) {
  // Você pode fazer o que quiser com o objeto
  obj.dispose();
}

function setup() {
  // Este objeto pode ser seguramente coletado como lixo,
  // e a função de desligamento resultante não será chamada.
  // Não há vazamentos.
  const myDisposableObject = {
    dispose() {
      // Libere seus recursos de forma síncrona
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Por favor, certifique-se de que a função passada para finalization.register()
// não cria um fechamento em torno de objetos desnecessários.
function onFinalize(obj, event) {
  // Você pode fazer o que quiser com o objeto
  obj.dispose();
}

function setup() {
  // Este objeto pode ser seguramente coletado como lixo,
  // e a função de desligamento resultante não será chamada.
  // Não há vazamentos.
  const myDisposableObject = {
    dispose() {
      // Libere seus recursos de forma síncrona
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

O código acima depende das seguintes premissas:

- funções de seta são evitadas
- funções regulares são recomendadas para estarem dentro do contexto global (raiz)

Funções regulares *poderiam* referenciar o contexto onde o `obj` vive, tornando o `obj` não coletável como lixo.

Funções de seta manterão o contexto anterior. Considere, por exemplo:

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // Mesmo algo assim é altamente desencorajado
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
É muito improvável (não impossível) que este objeto seja coletado como lixo, mas se não for, `dispose` será chamado quando `process.exit` for chamado.

Tenha cuidado e evite depender deste recurso para a eliminação de recursos críticos, pois não é garantido que o retorno de chamada seja chamado em todas as circunstâncias.


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A referência ao recurso que está sendo rastreado.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de callback a ser chamada quando o recurso for finalizado.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A referência ao recurso que está sendo rastreado.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O evento que acionou a finalização. O padrão é 'beforeExit'.

Esta função se comporta exatamente como o `register`, exceto que o callback será chamado quando o processo emitir o evento `beforeExit` se o objeto `ref` não foi coletado pelo garbage collector.

Esteja ciente de que todas as limitações aplicadas ao evento `beforeExit` também são aplicadas à função `callback`, isso significa que existe a possibilidade de que o callback não seja chamado em circunstâncias especiais.

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento Ativo
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A referência ao recurso que foi registrado anteriormente.

Esta função remove o registro do objeto do registro de finalização, para que o callback não seja mais chamado.

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Por favor, certifique-se de que a função passada para finalization.register()
// não crie um closure em torno de objetos desnecessários.
function onFinalize(obj, event) {
  // Você pode fazer o que quiser com o objeto
  obj.dispose();
}

function setup() {
  // Este objeto pode ser seguramente coletado pelo garbage collector,
  // e a função de desligamento resultante não será chamada.
  // Não há vazamentos.
  const myDisposableObject = {
    dispose() {
      // Libere seus recursos sincronamente
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // Faça algo

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Por favor, certifique-se de que a função passada para finalization.register()
// não crie um closure em torno de objetos desnecessários.
function onFinalize(obj, event) {
  // Você pode fazer o que quiser com o objeto
  obj.dispose();
}

function setup() {
  // Este objeto pode ser seguramente coletado pelo garbage collector,
  // e a função de desligamento resultante não será chamada.
  // Não há vazamentos.
  const myDisposableObject = {
    dispose() {
      // Libere seus recursos sincronamente
    },
  };

  // Por favor, certifique-se de que a função passada para finalization.register()
  // não crie um closure em torno de objetos desnecessários.
  function onFinalize(obj, event) {
    // Você pode fazer o que quiser com o objeto
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // Faça algo

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**Adicionado em: v17.3.0, v16.14.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `process.getActiveResourcesInfo()` retorna um array de strings contendo os tipos dos recursos ativos que estão atualmente mantendo o loop de eventos ativo.

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Antes:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('Depois:', getActiveResourcesInfo());
// Imprime:
//   Antes: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   Depois: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Antes:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('Depois:', getActiveResourcesInfo());
// Imprime:
//   Antes: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   Depois: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**Adicionado em: v22.3.0, v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ID do módulo integrado que está sendo solicitado.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)` fornece uma maneira de carregar módulos integrados em uma função globalmente disponível. Módulos ES que precisam suportar outros ambientes podem usá-lo para carregar condicionalmente um módulo integrado do Node.js quando executado no Node.js, sem ter que lidar com o erro de resolução que pode ser lançado por `import` em um ambiente não Node.js ou ter que usar `import()` dinâmico, que transforma o módulo em um módulo assíncrono ou transforma uma API síncrona em uma assíncrona.

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // Executar no Node.js, usar o módulo fs do Node.js.
  const fs = globalThis.process.getBuiltinModule('fs');
  // Se `require()` for necessário para carregar módulos de usuário, use createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
Se `id` especificar um módulo integrado disponível no processo Node.js atual, o método `process.getBuiltinModule(id)` retorna o módulo integrado correspondente. Se `id` não corresponder a nenhum módulo integrado, `undefined` é retornado.

`process.getBuiltinModule(id)` aceita IDs de módulos integrados que são reconhecidos por [`module.isBuiltin(id)`](/pt/nodejs/api/module#moduleisbuiltinmodulename). Alguns módulos integrados devem ser carregados com o prefixo `node:`, consulte [módulos integrados com prefixo `node:` obrigatório](/pt/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix). As referências retornadas por `process.getBuiltinModule(id)` sempre apontam para o módulo integrado correspondente a `id`, mesmo que os usuários modifiquem [`require.cache`](/pt/nodejs/api/modules#requirecache) para que `require(id)` retorne outra coisa.


## `process.getegid()` {#processgetegid}

**Adicionado em: v2.0.0**

O método `process.getegid()` retorna a identidade de grupo efetiva numérica do processo Node.js. (Veja [`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`GID atual: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`GID atual: ${process.getegid()}`);
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android).

## `process.geteuid()` {#processgeteuid}

**Adicionado em: v2.0.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O método `process.geteuid()` retorna a identidade de usuário efetiva numérica do processo. (Veja [`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`UID atual: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`UID atual: ${process.geteuid()}`);
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android).

## `process.getgid()` {#processgetgid}

**Adicionado em: v0.1.31**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

O método `process.getgid()` retorna a identidade de grupo numérica do processo. (Veja [`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2).)



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`GID atual: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`GID atual: ${process.getgid()}`);
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android).

## `process.getgroups()` {#processgetgroups}

**Adicionado em: v0.9.4**

- Retorna: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O método `process.getgroups()` retorna um array com os IDs de grupo suplementares. O POSIX não especifica se o ID de grupo efetivo está incluído, mas o Node.js garante que esteja sempre.



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android).


## `process.getuid()` {#processgetuid}

**Adicionado em: v0.1.28**

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O método `process.getuid()` retorna a identidade numérica do usuário do processo. (Consulte [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`UID atual: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`UID atual: ${process.getuid()}`);
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android).

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Adicionado em: v9.3.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Indica se um callback foi definido usando [`process.setUncaughtExceptionCaptureCallback()`](/pt/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

## `process.hrtime([time])` {#processhrtimetime}

**Adicionado em: v0.7.6**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado. Use [`process.hrtime.bigint()`](/pt/nodejs/api/process#processhrtimebigint) em vez disso.
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O resultado de uma chamada anterior para `process.hrtime()`
- Retorna: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta é a versão legada de [`process.hrtime.bigint()`](/pt/nodejs/api/process#processhrtimebigint) antes de `bigint` ser introduzido em JavaScript.

O método `process.hrtime()` retorna o tempo real de alta resolução atual em um `Array` de tupla `[segundos, nanossegundos]`, onde `nanossegundos` é a parte restante do tempo real que não pode ser representada em precisão de segundos.

`time` é um parâmetro opcional que deve ser o resultado de uma chamada anterior de `process.hrtime()` para diferenciar com a hora atual. Se o parâmetro passado não for um `Array` de tupla, um `TypeError` será lançado. Passar um array definido pelo usuário em vez do resultado de uma chamada anterior para `process.hrtime()` levará a um comportamento indefinido.

Esses tempos são relativos a um tempo arbitrário no passado e não estão relacionados à hora do dia e, portanto, não estão sujeitos ao desvio do relógio. O uso principal é para medir o desempenho entre intervalos:

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark levou ${diff[0] * NS_PER_SEC + diff[1]} nanossegundos`);
  // Benchmark levou 1000000552 nanossegundos
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark levou ${diff[0] * NS_PER_SEC + diff[1]} nanossegundos`);
  // Benchmark levou 1000000552 nanossegundos
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**Adicionado em: v10.7.0**

- Retorna: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

A versão `bigint` do método [`process.hrtime()`](/pt/nodejs/api/process#processhrtimetime) que retorna o tempo real de alta resolução atual em nanossegundos como um `bigint`.

Ao contrário de [`process.hrtime()`](/pt/nodejs/api/process#processhrtimetime), ele não suporta um argumento `time` adicional, pois a diferença pode ser calculada diretamente pela subtração dos dois `bigint`s.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**Adicionado em: v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nome de usuário ou identificador numérico.
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um nome de grupo ou identificador numérico.

O método `process.initgroups()` lê o arquivo `/etc/group` e inicializa a lista de acesso ao grupo, usando todos os grupos dos quais o usuário é membro. Esta é uma operação privilegiada que requer que o processo Node.js tenha acesso `root` ou a capacidade `CAP_SETGID`.

Tenha cuidado ao remover privilégios:

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android). Este recurso não está disponível em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).


## `process.kill(pid[, signal])` {#processkillpid-signal}

**Adicionado em: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um ID de processo
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O sinal a ser enviado, seja como uma string ou número. **Padrão:** `'SIGTERM'`.

O método `process.kill()` envia o `signal` para o processo identificado por `pid`.

Nomes de sinal são strings como `'SIGINT'` ou `'SIGHUP'`. Consulte [Eventos de Sinal](/pt/nodejs/api/process#signal-events) e [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) para mais informações.

Este método lançará um erro se o `pid` de destino não existir. Como um caso especial, um sinal de `0` pode ser usado para testar a existência de um processo. As plataformas Windows lançarão um erro se o `pid` for usado para encerrar um grupo de processos.

Mesmo que o nome desta função seja `process.kill()`, ela é realmente apenas um remetente de sinal, como a chamada de sistema `kill`. O sinal enviado pode fazer algo diferente de encerrar o processo de destino.

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

Quando `SIGUSR1` é recebido por um processo Node.js, o Node.js iniciará o depurador. Consulte [Eventos de Sinal](/pt/nodejs/api/process#signal-events).

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**Adicionado em: v21.7.0, v20.12.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **Padrão:** `'./.env'`

Carrega o arquivo `.env` em `process.env`. O uso de `NODE_OPTIONS` no arquivo `.env` não terá nenhum efeito no Node.js.

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**Adicionado em: v0.1.17**

**Obsoleto desde: v14.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`require.main`](/pt/nodejs/api/modules#accessing-the-main-module) em vez disso.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

A propriedade `process.mainModule` fornece uma maneira alternativa de recuperar [`require.main`](/pt/nodejs/api/modules#accessing-the-main-module). A diferença é que, se o módulo principal mudar em tempo de execução, [`require.main`](/pt/nodejs/api/modules#accessing-the-main-module) ainda pode se referir ao módulo principal original em módulos que foram requisitados antes da ocorrência da mudança. Geralmente, é seguro presumir que os dois se referem ao mesmo módulo.

Como com [`require.main`](/pt/nodejs/api/modules#accessing-the-main_module), `process.mainModule` será `undefined` se não houver script de entrada.

## `process.memoryUsage()` {#processmemoryusage}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v13.9.0, v12.17.0 | Adicionado `arrayBuffers` ao objeto retornado. |
| v7.2.0 | Adicionado `external` ao objeto retornado. |
| v0.1.16 | Adicionado em: v0.1.16 |
:::

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna um objeto descrevendo o uso de memória do processo Node.js medido em bytes.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Imprime:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Imprime:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- `heapTotal` e `heapUsed` referem-se ao uso de memória do V8.
- `external` refere-se ao uso de memória de objetos C++ vinculados a objetos JavaScript gerenciados pelo V8.
- `rss`, Resident Set Size, é a quantidade de espaço ocupada na memória principal (que é um subconjunto da memória total alocada) para o processo, incluindo todos os objetos e códigos C++ e JavaScript.
- `arrayBuffers` refere-se à memória alocada para `ArrayBuffer`s e `SharedArrayBuffer`s, incluindo todos os [`Buffer`](/pt/nodejs/api/buffer)s Node.js. Isso também está incluído no valor `external`. Quando o Node.js é usado como uma biblioteca incorporada, este valor pode ser `0` porque as alocações para `ArrayBuffer`s podem não ser rastreadas nesse caso.

Ao usar threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker), `rss` será um valor válido para todo o processo, enquanto os outros campos se referirão apenas ao thread atual.

O método `process.memoryUsage()` itera sobre cada página para coletar informações sobre o uso da memória, o que pode ser lento dependendo das alocações de memória do programa.


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**Adicionado em: v15.6.0, v14.18.0**

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O método `process.memoryUsage.rss()` retorna um inteiro representando o Resident Set Size (RSS) em bytes.

O Resident Set Size é a quantidade de espaço ocupada na memória principal (que é um subconjunto da memória total alocada) para o processo, incluindo todos os objetos e códigos C++ e JavaScript.

Este é o mesmo valor da propriedade `rss` fornecida por `process.memoryUsage()`, mas `process.memoryUsage.rss()` é mais rápido.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.7.0, v20.18.0 | Alterou a estabilidade para Legado. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v1.8.1 | Argumentos adicionais após `callback` agora são suportados. |
| v0.1.26 | Adicionado em: v0.1.26 |
:::

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`queueMicrotask()`](/pt/nodejs/api/globals#queuemicrotaskcallback) em vez disso.
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos adicionais para passar ao invocar o `callback`

`process.nextTick()` adiciona `callback` à "próxima fila de tick". Esta fila é totalmente esvaziada após a conclusão da operação atual na pilha JavaScript e antes que o loop de eventos possa continuar. É possível criar um loop infinito se alguém chamar recursivamente `process.nextTick()`. Consulte o guia [Loop de Eventos](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick) para obter mais informações.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

Isso é importante ao desenvolver APIs para dar aos usuários a oportunidade de atribuir manipuladores de eventos *após* a construção de um objeto, mas antes que qualquer E/S ocorra:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() é chamado agora, não antes.
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() é chamado agora, não antes.
```
:::

É muito importante que as APIs sejam 100% síncronas ou 100% assíncronas. Considere este exemplo:

```js [ESM]
// AVISO! NÃO USE! PERIGO RUIM E INSEGURO!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
Esta API é perigosa porque no caso a seguir:

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
Não está claro se `foo()` ou `bar()` serão chamados primeiro.

A seguinte abordagem é muito melhor:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::


### Quando usar `queueMicrotask()` vs. `process.nextTick()` {#when-to-use-queuemicrotask-vs-processnexttick}

A API [`queueMicrotask()`](/pt/nodejs/api/globals#queuemicrotaskcallback) é uma alternativa a `process.nextTick()` que também adia a execução de uma função usando a mesma fila de microtarefas usada para executar os manipuladores then, catch e finally de promessas resolvidas. Dentro do Node.js, toda vez que a "próxima fila de ticks" é esvaziada, a fila de microtarefas é esvaziada imediatamente depois.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```
:::

Para *a maioria* dos casos de uso de userland, a API `queueMicrotask()` fornece um mecanismo portátil e confiável para adiar a execução que funciona em vários ambientes de plataforma JavaScript e deve ser preferido em relação a `process.nextTick()`. Em cenários simples, `queueMicrotask()` pode ser um substituto direto para `process.nextTick()`.

```js [ESM]
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
```
Uma diferença notável entre as duas APIs é que `process.nextTick()` permite especificar valores adicionais que serão passados como argumentos para a função adiada quando ela for chamada. Atingir o mesmo resultado com `queueMicrotask()` requer o uso de um closure ou uma função vinculada:

```js [ESM]
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
```
Existem pequenas diferenças na forma como os erros gerados de dentro da próxima fila de ticks e da fila de microtarefas são tratados. Erros lançados dentro de um callback de microtarefa enfileirado devem ser tratados dentro do callback enfileirado quando possível. Se não forem, o manipulador de eventos `process.on('uncaughtException')` pode ser usado para capturar e tratar os erros.

Em caso de dúvida, a menos que as capacidades específicas de `process.nextTick()` sejam necessárias, use `queueMicrotask()`.


## `process.noDeprecation` {#processnodeprecation}

**Adicionado em: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `process.noDeprecation` indica se a flag `--no-deprecation` está definida no processo Node.js atual. Consulte a documentação para o [`'warning'` event](/pt/nodejs/api/process#event-warning) e o método [`emitWarning()` method](/pt/nodejs/api/process#processemitwarningwarning-type-code-ctor) para obter mais informações sobre o comportamento desta flag.

## `process.permission` {#processpermission}

**Adicionado em: v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Esta API está disponível através da flag [`--permission`](/pt/nodejs/api/cli#--permission).

`process.permission` é um objeto cujos métodos são usados para gerenciar permissões para o processo atual. Documentação adicional está disponível no [Modelo de Permissão](/pt/nodejs/api/permissions#permission-model).

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**Adicionado em: v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se o processo é capaz de acessar o escopo e a referência fornecidos. Se nenhuma referência for fornecida, um escopo global é assumido, por exemplo, `process.permission.has('fs.read')` verificará se o processo tem TODAS as permissões de leitura do sistema de arquivos.

A referência tem um significado com base no escopo fornecido. Por exemplo, a referência quando o escopo é Sistema de Arquivos significa arquivos e pastas.

Os escopos disponíveis são:

- `fs` - Todo o sistema de arquivos
- `fs.read` - Operações de leitura do sistema de arquivos
- `fs.write` - Operações de gravação do sistema de arquivos
- `child` - Operações de geração de processos filhos
- `worker` - Operação de geração de threads de worker

```js [ESM]
// Verifica se o processo tem permissão para ler o arquivo README
process.permission.has('fs.read', './README.md');
// Verifica se o processo tem operações de permissão de leitura
process.permission.has('fs.read');
```

## `process.pid` {#processpid}

**Adicionado em: v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A propriedade `process.pid` retorna o PID do processo.



::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`Este processo tem o PID ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`Este processo tem o PID ${pid}`);
```
:::

## `process.platform` {#processplatform}

**Adicionado em: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `process.platform` retorna uma string que identifica a plataforma do sistema operacional para a qual o binário do Node.js foi compilado.

Atualmente, os valores possíveis são:

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`



::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`Esta plataforma é ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`Esta plataforma é ${platform}`);
```
:::

O valor `'android'` também pode ser retornado se o Node.js for construído no sistema operacional Android. No entanto, o suporte ao Android no Node.js [é experimental](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `process.ppid` {#processppid}

**Adicionado em: v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A propriedade `process.ppid` retorna o PID do pai do processo atual.



::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`O processo pai é pid ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`O processo pai é pid ${ppid}`);
```
:::

## `process.release` {#processrelease}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v4.2.0 | A propriedade `lts` agora é suportada. |
| v3.0.0 | Adicionado em: v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

A propriedade `process.release` retorna um `Object` contendo metadados relacionados à versão atual, incluindo URLs para o tarball de origem e o tarball somente de cabeçalhos.

`process.release` contém as seguintes propriedades:

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um valor que sempre será `'node'`.
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) um URL absoluto apontando para um arquivo *<code>.tar.gz</code>* contendo o código-fonte da versão atual.
- `headersUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) um URL absoluto apontando para um arquivo *<code>.tar.gz</code>* contendo apenas os arquivos de cabeçalho de origem para a versão atual. Este arquivo é significativamente menor que o arquivo de origem completo e pode ser usado para compilar complementos nativos do Node.js.
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) um URL absoluto apontando para um arquivo *<code>node.lib</code>* que corresponde à arquitetura e versão da versão atual. Este arquivo é usado para compilar complementos nativos do Node.js. *Esta propriedade está presente apenas em compilações do Windows do Node.js e estará ausente em todas as outras plataformas.*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) um rótulo de string que identifica o rótulo [LTS](https://github.com/nodejs/Release) para esta versão. Esta propriedade existe apenas para versões LTS e é `undefined` para todos os outros tipos de versão, incluindo versões *Current*. Os valores válidos incluem os nomes de código da versão LTS (incluindo aqueles que não são mais suportados).
    - `'Fermium'` para a linha 14.x LTS a partir de 14.15.0.
    - `'Gallium'` para a linha 16.x LTS a partir de 16.13.0.
    - `'Hydrogen'` para a linha 18.x LTS a partir de 18.12.0. Para outros nomes de código da versão LTS, consulte [Arquivo de Changelog do Node.js](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)
  
 

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
Em compilações personalizadas de versões não lançadas da árvore de origem, apenas a propriedade `name` pode estar presente. Não se deve confiar na existência das propriedades adicionais.


## `process.report` {#processreport}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API não é mais experimental. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` é um objeto cujos métodos são usados para gerar relatórios de diagnóstico para o processo atual. Documentação adicional está disponível na [documentação do relatório](/pt/nodejs/api/report).

### `process.report.compact` {#processreportcompact}

**Adicionado em: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Escreve relatórios em um formato compacto, JSON de linha única, mais facilmente consumível por sistemas de processamento de log do que o formato multi-linha padrão projetado para consumo humano.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Relatórios são compactos? ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Relatórios são compactos? ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API não é mais experimental. |
| v11.12.0 | Adicionado em: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Diretório onde o relatório é gravado. O valor padrão é a string vazia, indicando que os relatórios são gravados no diretório de trabalho atual do processo Node.js.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`O diretório do relatório é ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`O diretório do relatório é ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API não é mais experimental. |
| v11.12.0 | Adicionado em: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Nome do arquivo onde o relatório é gravado. Se definido como string vazia, o nome do arquivo de saída será composto por um timestamp, PID e número de sequência. O valor padrão é a string vazia.

Se o valor de `process.report.filename` for definido como `'stdout'` ou `'stderr'`, o relatório será gravado no stdout ou stderr do processo, respectivamente.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`O nome do arquivo do relatório é ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`O nome do arquivo do relatório é ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API não é mais experimental. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um erro personalizado usado para relatar o stack do JavaScript.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna uma representação de Objeto JavaScript de um relatório de diagnóstico para o processo em execução. O stack trace do JavaScript do relatório é obtido de `err`, se presente.

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Semelhante a process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Semelhante a process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

Documentação adicional está disponível na [documentação do relatório](/pt/nodejs/api/report).

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0, v14.17.0 | Esta API não é mais experimental. |
| v11.12.0 | Adicionado em: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, um relatório de diagnóstico é gerado em erros fatais, como erros de falta de memória ou falhas em asserções C++.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Relatório em erro fatal: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Relatório em erro fatal: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API não é mais experimental. |
| v11.12.0 | Adicionado em: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, um relatório de diagnóstico é gerado quando o processo recebe o sinal especificado por `process.report.signal`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Relatório no sinal: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Relatório no sinal: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API não é mais experimental. |
| v11.12.0 | Adicionado em: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, um relatório de diagnóstico é gerado em uma exceção não capturada.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Relatório na exceção: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Relatório na exceção: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**Adicionado em: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se `true`, um relatório de diagnóstico é gerado sem as variáveis de ambiente.

### `process.report.signal` {#processreportsignal}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API não é mais experimental. |
| v11.12.0 | Adicionado em: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O sinal usado para acionar a criação de um relatório de diagnóstico. O padrão é `'SIGUSR2'`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Sinal do relatório: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Sinal do relatório: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.12.0, v12.17.0 | Esta API não é mais experimental. |
| v11.8.0 | Adicionado em: v11.8.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do arquivo onde o relatório é escrito. Este deve ser um caminho relativo, que será anexado ao diretório especificado em `process.report.directory`, ou o diretório de trabalho atual do processo Node.js, se não especificado.
- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Um erro personalizado usado para relatar o stack do JavaScript.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Retorna o nome do arquivo do relatório gerado.

Escreve um relatório de diagnóstico em um arquivo. Se `filename` não for fornecido, o nome de arquivo padrão inclui a data, hora, PID e um número de sequência. O stack trace JavaScript do relatório é obtido de `err`, se presente.

Se o valor de `filename` for definido como `'stdout'` ou `'stderr'`, o relatório é escrito para stdout ou stderr do processo, respectivamente.

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

Documentação adicional está disponível na [documentação do relatório](/pt/nodejs/api/report).

## `process.resourceUsage()` {#processresourceusage}

**Adicionado em: v12.6.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) o uso de recursos para o processo atual. Todos esses valores vêm da chamada `uv_getrusage` que retorna uma [`uv_rusage_t struct`](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t).
    - `userCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_utime` computado em microssegundos. É o mesmo valor que [`process.cpuUsage().user`](/pt/nodejs/api/process#processcpuusagepreviousvalue).
    - `systemCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_stime` computado em microssegundos. É o mesmo valor que [`process.cpuUsage().system`](/pt/nodejs/api/process#processcpuusagepreviousvalue).
    - `maxRSS` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_maxrss` que é o tamanho máximo do conjunto residente usado em kilobytes.
    - `sharedMemorySize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_ixrss`, mas não é suportado por nenhuma plataforma.
    - `unsharedDataSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_idrss`, mas não é suportado por nenhuma plataforma.
    - `unsharedStackSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_isrss`, mas não é suportado por nenhuma plataforma.
    - `minorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_minflt` que é o número de page faults menores para o processo, veja [este artigo para mais detalhes](https://en.wikipedia.org/wiki/Page_fault#Minor).
    - `majorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_majflt` que é o número de page faults maiores para o processo, veja [este artigo para mais detalhes](https://en.wikipedia.org/wiki/Page_fault#Major). Este campo não é suportado no Windows.
    - `swappedOut` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_nswap`, mas não é suportado por nenhuma plataforma.
    - `fsRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_inblock` que é o número de vezes que o sistema de arquivos teve que executar a entrada.
    - `fsWrite` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_oublock` que é o número de vezes que o sistema de arquivos teve que executar a saída.
    - `ipcSent` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_msgsnd`, mas não é suportado por nenhuma plataforma.
    - `ipcReceived` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_msgrcv`, mas não é suportado por nenhuma plataforma.
    - `signalsCount` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_nsignals`, mas não é suportado por nenhuma plataforma.
    - `voluntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_nvcsw` que é o número de vezes que uma troca de contexto da CPU resultou devido a um processo voluntariamente abandonar o processador antes que sua fatia de tempo fosse concluída (geralmente para aguardar a disponibilidade de um recurso). Este campo não é suportado no Windows.
    - `involuntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) mapeia para `ru_nivcsw` que é o número de vezes que uma troca de contexto da CPU resultou devido a um processo de prioridade mais alta se tornar executável ou porque o processo atual excedeu sua fatia de tempo. Este campo não é suportado no Windows.

::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::


## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**Adicionado em: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/pt/nodejs/api/net#class-netserver) | [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) usado para parametrizar o envio de certos tipos de handles. `options` suporta as seguintes propriedades:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Um valor que pode ser usado ao passar instâncias de `net.Socket`. Quando `true`, o socket é mantido aberto no processo de envio. **Padrão:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se o Node.js é iniciado com um canal IPC, o método `process.send()` pode ser usado para enviar mensagens ao processo pai. As mensagens serão recebidas como um evento [`'message'`](/pt/nodejs/api/child_process#event-message) no objeto [`ChildProcess`](/pt/nodejs/api/child_process#class-childprocess) do pai.

Se o Node.js não foi iniciado com um canal IPC, `process.send` será `undefined`.

A mensagem passa por serialização e análise. A mensagem resultante pode não ser a mesma que a originalmente enviada.

## `process.setegid(id)` {#processsetegidid}

**Adicionado em: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um nome ou ID de grupo

O método `process.setegid()` define a identidade de grupo efetiva do processo. (Veja [`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2).) O `id` pode ser passado como um ID numérico ou um nome de grupo. Se um nome de grupo for especificado, este método bloqueia enquanto resolve o ID numérico associado.



::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android). Este recurso não está disponível em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).


## `process.seteuid(id)` {#processseteuidid}

**Adicionado em: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um nome de usuário ou ID

O método `process.seteuid()` define a identidade de usuário efetiva do processo. (Veja [`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2).) O `id` pode ser passado como um ID numérico ou uma string de nome de usuário. Se um nome de usuário for especificado, o método será bloqueado durante a resolução do ID numérico associado.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android). Este recurso não está disponível em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).

## `process.setgid(id)` {#processsetgidid}

**Adicionado em: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nome ou ID do grupo

O método `process.setgid()` define a identidade de grupo do processo. (Veja [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).) O `id` pode ser passado como um ID numérico ou uma string de nome de grupo. Se um nome de grupo for especificado, este método será bloqueado durante a resolução do ID numérico associado.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android). Este recurso não está disponível em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Adicionado em: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O método `process.setgroups()` define os IDs de grupo suplementares para o processo Node.js. Esta é uma operação privilegiada que requer que o processo Node.js tenha `root` ou a capacidade `CAP_SETGID`.

O array `groups` pode conter IDs de grupo numéricos, nomes de grupo ou ambos.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android). Este recurso não está disponível em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).

## `process.setuid(id)` {#processsetuidid}

**Adicionado em: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O método `process.setuid(id)` define a identidade do usuário do processo. (Veja [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).) O `id` pode ser passado como um ID numérico ou uma string de nome de usuário. Se um nome de usuário for especificado, o método será bloqueado enquanto resolve o ID numérico associado.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Esta função está disponível apenas em plataformas POSIX (ou seja, não Windows ou Android). Este recurso não está disponível em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**Adicionado em: v16.6.0, v14.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta função ativa ou desativa o suporte para [Source Map v3](https://sourcemaps.info/spec) para rastreamentos de pilha.

Ela fornece os mesmos recursos que iniciar o processo do Node.js com as opções de linha de comando `--enable-source-maps`.

Apenas os source maps em arquivos JavaScript que são carregados após a ativação dos source maps serão analisados e carregados.

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**Adicionado em: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

A função `process.setUncaughtExceptionCaptureCallback()` define uma função que será invocada quando ocorrer uma exceção não capturada, que receberá o próprio valor da exceção como seu primeiro argumento.

Se tal função for definida, o evento [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception) não será emitido. Se `--abort-on-uncaught-exception` foi passado da linha de comando ou definido através de [`v8.setFlagsFromString()`](/pt/nodejs/api/v8#v8setflagsfromstringflags), o processo não será abortado. Ações configuradas para ocorrer em exceções, como gerações de relatórios, também serão afetadas.

Para cancelar a definição da função de captura, `process.setUncaughtExceptionCaptureCallback(null)` pode ser usado. Chamar este método com um argumento não-`null` enquanto outra função de captura está definida lançará um erro.

Usar esta função é mutuamente exclusivo com o uso do módulo embutido [`domain`](/pt/nodejs/api/domain) obsoleto.

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**Adicionado em: v20.7.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `process.sourceMapsEnabled` retorna se o suporte para [Source Map v3](https://sourcemaps.info/spec) para rastreamentos de pilha está ativado.


## `process.stderr` {#processstderr}

- [\<Stream\>](/pt/nodejs/api/stream#stream)

A propriedade `process.stderr` retorna um fluxo conectado a `stderr` (fd `2`). É um [`net.Socket`](/pt/nodejs/api/net#class-netsocket) (que é um fluxo [Duplex](/pt/nodejs/api/stream#duplex-and-transform-streams)) a menos que fd `2` se refira a um arquivo, caso em que é um fluxo [Writable](/pt/nodejs/api/stream#writable-streams).

`process.stderr` difere de outros fluxos Node.js de maneiras importantes. Consulte [nota sobre E/S de processo](/pt/nodejs/api/process#a-note-on-process-io) para obter mais informações.

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Essa propriedade se refere ao valor do descritor de arquivo subjacente de `process.stderr`. O valor é fixo em `2`. Nas threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker), este campo não existe.

## `process.stdin` {#processstdin}

- [\<Stream\>](/pt/nodejs/api/stream#stream)

A propriedade `process.stdin` retorna um fluxo conectado a `stdin` (fd `0`). É um [`net.Socket`](/pt/nodejs/api/net#class-netsocket) (que é um fluxo [Duplex](/pt/nodejs/api/stream#duplex-and-transform-streams)) a menos que fd `0` se refira a um arquivo, caso em que é um fluxo [Readable](/pt/nodejs/api/stream#readable-streams).

Para detalhes de como ler de `stdin`, consulte [`readable.read()`](/pt/nodejs/api/stream#readablereadsize).

Como um fluxo [Duplex](/pt/nodejs/api/stream#duplex-and-transform-streams), `process.stdin` também pode ser usado no modo "antigo" que é compatível com scripts escritos para Node.js antes da v0.10. Para obter mais informações, consulte [Compatibilidade de fluxo](/pt/nodejs/api/stream#compatibility-with-older-nodejs-versions).

No modo de fluxos "antigo", o fluxo `stdin` é pausado por padrão, então é preciso chamar `process.stdin.resume()` para ler dele. Observe também que chamar `process.stdin.resume()` em si mudaria o fluxo para o modo "antigo".

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Essa propriedade se refere ao valor do descritor de arquivo subjacente de `process.stdin`. O valor é fixo em `0`. Nas threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker), este campo não existe.


## `process.stdout` {#processstdout}

- [\<Stream\>](/pt/nodejs/api/stream#stream)

A propriedade `process.stdout` retorna um fluxo conectado ao `stdout` (fd `1`). É um [`net.Socket`](/pt/nodejs/api/net#class-netsocket) (que é um fluxo [Duplex](/pt/nodejs/api/stream#duplex-and-transform-streams)), a menos que fd `1` se refira a um arquivo, caso em que é um fluxo [Writable](/pt/nodejs/api/stream#writable-streams).

Por exemplo, para copiar `process.stdin` para `process.stdout`:

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

`process.stdout` difere de outros fluxos do Node.js de maneiras importantes. Consulte a [nota sobre E/S de processo](/pt/nodejs/api/process#a-note-on-process-io) para obter mais informações.

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Esta propriedade se refere ao valor do descritor de arquivo subjacente de `process.stdout`. O valor é fixo em `1`. Em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker), este campo não existe.

### Uma nota sobre E/S de processo {#a-note-on-process-i/o}

`process.stdout` e `process.stderr` diferem de outros fluxos do Node.js de maneiras importantes:

Esses comportamentos são em parte por razões históricas, pois alterá-los criaria incompatibilidade com versões anteriores, mas também são esperados por alguns usuários.

Gravações síncronas evitam problemas como saída escrita com `console.log()` ou `console.error()` sendo inesperadamente intercalada, ou não escrita se `process.exit()` for chamado antes que uma gravação assíncrona seja concluída. Consulte [`process.exit()`](/pt/nodejs/api/process#processexitcode) para obter mais informações.

*<strong>Aviso</strong>*: Gravações síncronas bloqueiam o loop de eventos até que a gravação seja concluída. Isso pode ser quase instantâneo no caso de saída para um arquivo, mas sob alta carga do sistema, pipes que não estão sendo lidos na extremidade receptora, ou com terminais ou sistemas de arquivos lentos, é possível que o loop de eventos seja bloqueado com frequência e por tempo suficiente para ter impactos negativos graves no desempenho. Isso pode não ser um problema ao gravar em uma sessão de terminal interativa, mas considere isso particularmente cuidadoso ao fazer o registro de produção nos fluxos de saída do processo.

Para verificar se um fluxo está conectado a um contexto [TTY](/pt/nodejs/api/tty#tty), verifique a propriedade `isTTY`.

Por exemplo:

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
Consulte a documentação [TTY](/pt/nodejs/api/tty#tty) para obter mais informações.


## `process.throwDeprecation` {#processthrowdeprecation}

**Adicionado em: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O valor inicial de `process.throwDeprecation` indica se o sinalizador `--throw-deprecation` está definido no processo Node.js atual. `process.throwDeprecation` é mutável, então se os avisos de depreciação resultam ou não em erros pode ser alterado em tempo de execução. Veja a documentação para o [`'warning'` event](/pt/nodejs/api/process#event-warning) e o [`emitWarning()` method](/pt/nodejs/api/process#processemitwarningwarning-type-code-ctor) para mais informações.

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**Adicionado em: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `process.title` retorna o título do processo atual (ou seja, retorna o valor atual de `ps`). Atribuir um novo valor a `process.title` modifica o valor atual de `ps`.

Quando um novo valor é atribuído, diferentes plataformas irão impor diferentes restrições de comprimento máximo no título. Normalmente, essas restrições são bastante limitadas. Por exemplo, no Linux e macOS, `process.title` é limitado ao tamanho do nome binário mais o comprimento dos argumentos da linha de comando porque definir o `process.title` sobrescreve a memória `argv` do processo. O Node.js v0.8 permitia strings de título de processo mais longas, também sobrescrevendo a memória `environ`, mas isso era potencialmente inseguro e confuso em alguns casos (bastante obscuros).

Atribuir um valor a `process.title` pode não resultar em um rótulo preciso em aplicativos de gerenciamento de processos, como o Monitor de Atividade do macOS ou o Gerenciador de Serviços do Windows.


## `process.traceDeprecation` {#processtracedeprecation}

**Adicionado em: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `process.traceDeprecation` indica se a flag `--trace-deprecation` está definida no processo Node.js atual. Consulte a documentação do evento [`'warning'` event](/pt/nodejs/api/process#event-warning) e o método [`emitWarning()` method](/pt/nodejs/api/process#processemitwarningwarning-type-code-ctor) para obter mais informações sobre o comportamento desta flag.

## `process.umask()` {#processumask}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0, v12.19.0 | Chamar `process.umask()` sem argumentos está obsoleto. |
| v0.1.19 | Adicionado em: v0.1.19 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto. Chamar `process.umask()` sem argumento faz com que o umask de todo o processo seja escrito duas vezes. Isso introduz uma condição de corrida entre as threads e é uma potencial vulnerabilidade de segurança. Não existe uma API alternativa segura e multiplataforma.
:::

`process.umask()` retorna a máscara de criação de modo de arquivo do processo Node.js. Os processos filhos herdam a máscara do processo pai.

## `process.umask(mask)` {#processumaskmask}

**Adicionado em: v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` define a máscara de criação de modo de arquivo do processo Node.js. Os processos filhos herdam a máscara do processo pai. Retorna a máscara anterior.



::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

Em threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker), `process.umask(mask)` lançará uma exceção.


## `process.uptime()` {#processuptime}

**Adicionado em: v0.5.0**

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O método `process.uptime()` retorna o número de segundos que o processo Node.js atual está em execução.

O valor de retorno inclui frações de segundo. Use `Math.floor()` para obter segundos inteiros.

## `process.version` {#processversion}

**Adicionado em: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `process.version` contém a string de versão do Node.js.

::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

Para obter a string de versão sem o *v* prefixado, use `process.versions.node`.

## `process.versions` {#processversions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.0.0 | A propriedade `v8` agora inclui um sufixo específico do Node.js. |
| v4.2.0 | A propriedade `icu` agora é suportada. |
| v0.2.0 | Adicionado em: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

A propriedade `process.versions` retorna um objeto listando as strings de versão do Node.js e suas dependências. `process.versions.modules` indica a versão ABI atual, que é incrementada sempre que uma API C++ muda. O Node.js se recusará a carregar módulos que foram compilados em uma versão ABI de módulo diferente.

::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

Gerará um objeto similar a:

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```

## Códigos de Saída {#exit-codes}

O Node.js normalmente sairá com um código de status `0` quando não houver mais operações assíncronas pendentes. Os seguintes códigos de status são usados em outros casos:

- `1` **Exceção Fatal Não Capturada**: Ocorreu uma exceção não capturada e não foi tratada por um domínio ou um manipulador de evento [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception).
- `2`: Não utilizado (reservado pelo Bash para uso indevido interno)
- `3` **Erro de Análise JavaScript Interno**: O código-fonte JavaScript interno no processo de inicialização do Node.js causou um erro de análise. Isso é extremamente raro e geralmente só pode acontecer durante o desenvolvimento do próprio Node.js.
- `4` **Falha de Avaliação JavaScript Interna**: O código-fonte JavaScript interno no processo de inicialização do Node.js não conseguiu retornar um valor de função quando avaliado. Isso é extremamente raro e geralmente só pode acontecer durante o desenvolvimento do próprio Node.js.
- `5` **Erro Fatal**: Ocorreu um erro fatal irrecuperável no V8. Normalmente, uma mensagem será impressa em stderr com o prefixo `FATAL ERROR`.
- `6` **Manipulador de Exceção Interna Não-Função**: Ocorreu uma exceção não capturada, mas a função interna do manipulador de exceção fatal foi definida de alguma forma como não-função e não pôde ser chamada.
- `7` **Falha de Tempo de Execução do Manipulador de Exceção Interna**: Ocorreu uma exceção não capturada e a própria função interna do manipulador de exceção fatal lançou um erro ao tentar tratá-la. Isso pode acontecer, por exemplo, se um manipulador [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception) ou `domain.on('error')` lançar um erro.
- `8`: Não utilizado. Em versões anteriores do Node.js, o código de saída 8 às vezes indicava uma exceção não capturada.
- `9` **Argumento Inválido**: Uma opção desconhecida foi especificada ou uma opção que exige um valor foi fornecida sem um valor.
- `10` **Falha de Tempo de Execução JavaScript Interna**: O código-fonte JavaScript interno no processo de inicialização do Node.js lançou um erro quando a função de inicialização foi chamada. Isso é extremamente raro e geralmente só pode acontecer durante o desenvolvimento do próprio Node.js.
- `12` **Argumento de Depuração Inválido**: As opções `--inspect` e/ou `--inspect-brk` foram definidas, mas o número da porta escolhido era inválido ou não estava disponível.
- `13` **Await de Nível Superior Não Resolvido**: `await` foi usado fora de uma função no código de nível superior, mas a `Promise` passada nunca foi resolvida.
- `14` **Falha de Snapshot**: O Node.js foi iniciado para construir um snapshot de inicialização V8 e falhou porque certos requisitos do estado da aplicação não foram atendidos.
- `\>128` **Saídas de Sinal**: Se o Node.js receber um sinal fatal como `SIGKILL` ou `SIGHUP`, seu código de saída será `128` mais o valor do código do sinal. Esta é uma prática POSIX padrão, uma vez que os códigos de saída são definidos para serem inteiros de 7 bits, e as saídas de sinal definem o bit de ordem superior e, em seguida, contêm o valor do código do sinal. Por exemplo, o sinal `SIGABRT` tem valor `6`, então o código de saída esperado será `128` + `6`, ou `134`.

