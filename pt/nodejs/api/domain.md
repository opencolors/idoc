---
title: Documentação do Node.js - Módulo de Domínio
description: O módulo de Domínio no Node.js oferece uma maneira de lidar com erros e exceções em código assíncrono, permitindo uma gestão de erros e operações de limpeza mais robustas.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Módulo de Domínio | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo de Domínio no Node.js oferece uma maneira de lidar com erros e exceções em código assíncrono, permitindo uma gestão de erros e operações de limpeza mais robustas.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Módulo de Domínio | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo de Domínio no Node.js oferece uma maneira de lidar com erros e exceções em código assíncrono, permitindo uma gestão de erros e operações de limpeza mais robustas.
---


# Domínio {#domain}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v8.8.0 | Quaisquer `Promise`s criadas em contextos de VM não têm mais uma propriedade `.domain`. Seus manipuladores ainda são executados no domínio adequado, no entanto, e `Promise`s criadas no contexto principal ainda possuem uma propriedade `.domain`. |
| v8.0.0 | Os manipuladores para `Promise`s agora são invocados no domínio em que a primeira promise de uma cadeia foi criada. |
| v1.4.2 | Obsoleto desde: v1.4.2 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

**Código Fonte:** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**Este módulo está pendente de obsolescência.** Assim que uma API de substituição for finalizada, este módulo será totalmente descontinuado. A maioria dos desenvolvedores **não** deve ter motivos para usar este módulo. Os usuários que absolutamente precisam da funcionalidade que os domínios fornecem podem confiar nela por enquanto, mas devem esperar ter que migrar para uma solução diferente no futuro.

Os domínios fornecem uma maneira de lidar com várias operações de IO diferentes como um único grupo. Se algum dos emissores de evento ou callbacks registrados em um domínio emitir um evento `'error'`, ou lançar um erro, o objeto de domínio será notificado, em vez de perder o contexto do erro no manipulador `process.on('uncaughtException')`, ou fazer com que o programa saia imediatamente com um código de erro.

## Aviso: Não ignore os erros! {#warning-dont-ignore-errors!}

Os manipuladores de erros de domínio não são um substituto para encerrar um processo quando ocorre um erro.

Pela própria natureza de como [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) funciona em JavaScript, quase nunca há uma maneira de "retomar de onde parou" com segurança, sem vazar referências ou criar algum outro tipo de estado frágil indefinido.

A maneira mais segura de responder a um erro lançado é desligar o processo. Obviamente, em um servidor web normal, pode haver muitas conexões abertas e não é razoável desligá-las abruptamente porque um erro foi acionado por outra pessoa.

A melhor abordagem é enviar uma resposta de erro para a solicitação que acionou o erro, enquanto deixa as outras terminarem em seu tempo normal e para de ouvir novas solicitações nesse worker.

Dessa forma, o uso de `domain` anda de mãos dadas com o módulo cluster, já que o processo primário pode bifurcar um novo worker quando um worker encontra um erro. Para programas Node.js que escalam para várias máquinas, o proxy de encerramento ou o registro de serviço podem observar a falha e reagir de acordo.

Por exemplo, esta não é uma boa ideia:

```js [ESM]
// XXX AVISO! MÁ IDEIA!

const d = require('node:domain').create();
d.on('error', (er) => {
  // O erro não irá travar o processo, mas o que ele faz é pior!
  // Embora tenhamos evitado a reinicialização abrupta do processo, estamos vazando
  // muitos recursos se isso acontecer.
  // Isso não é melhor do que process.on('uncaughtException')!
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
Ao usar o contexto de um domínio e a resiliência de separar nosso programa em vários processos de worker, podemos reagir de forma mais apropriada e lidar com erros com muito mais segurança.

```js [ESM]
// Muito melhor!

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // Um cenário mais realista teria mais de 2 workers,
  // e talvez não colocasse o primário e o worker no mesmo arquivo.
  //
  // Também é possível ser um pouco mais sofisticado sobre o registro e
  // implementar qualquer lógica personalizada necessária para evitar ataques DoS
  // e outros comportamentos inadequados.
  //
  // Veja as opções na documentação do cluster.
  //
  // O importante é que o primário faça muito pouco,
  // aumentando nossa resiliência a erros inesperados.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // o worker
  //
  // É aqui que colocamos nossos bugs!

  const domain = require('node:domain');

  // Veja a documentação do cluster para mais detalhes sobre o uso de
  // processos de worker para atender requisições. Como funciona, advertências, etc.

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);

      // Estamos em território perigoso!
      // Por definição, algo inesperado ocorreu,
      // que provavelmente não queríamos.
      // Qualquer coisa pode acontecer agora! Seja muito cuidadoso!

      try {
        // Certifique-se de que fechamos em 30 segundos
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // Mas não mantenha o processo aberto apenas para isso!
        killtimer.unref();

        // Pare de receber novas solicitações.
        server.close();

        // Avise o primário que estamos mortos. Isso irá acionar um
        // 'disconnect' no primário do cluster e, em seguida, ele irá bifurcar
        // um novo worker.
        cluster.worker.disconnect();

        // Tente enviar um erro para a solicitação que acionou o problema
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, there was a problem!\n');
      } catch (er2) {
        // Ah, bem, não há muito que possamos fazer neste momento.
        console.error(`Error sending 500! ${er2.stack}`);
      }
    });

    // Como req e res foram criados antes que este domínio existisse,
    // precisamos adicioná-los explicitamente.
    // Veja a explicação de vinculação implícita vs explícita abaixo.
    d.add(req);
    d.add(res);

    // Agora execute a função de manipulador no domínio.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// Esta parte não é importante. Apenas um exemplo de roteamento.
// Coloque uma lógica de aplicativo sofisticada aqui.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // Nós fazemos algumas coisas assíncronas, e então...
      setTimeout(() => {
        // Opa!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## Adições a objetos `Error` {#additions-to-error-objects}

Sempre que um objeto `Error` é roteado através de um domínio, alguns campos extras são adicionados a ele.

- `error.domain` O domínio que primeiro tratou o erro.
- `error.domainEmitter` O emissor de eventos que emitiu um evento `'error'` com o objeto de erro.
- `error.domainBound` A função de callback que foi vinculada ao domínio e recebeu um erro como seu primeiro argumento.
- `error.domainThrown` Um booleano indicando se o erro foi lançado, emitido ou passado para uma função de callback vinculada.

## Vinculação implícita {#implicit-binding}

Se domínios estão em uso, então todos os **novos** objetos `EventEmitter` (incluindo objetos Stream, requisições, respostas, etc.) serão implicitamente vinculados ao domínio ativo no momento de sua criação.

Adicionalmente, callbacks passadas para requisições de baixo nível do loop de eventos (como para `fs.open()`, ou outros métodos que recebem callbacks) serão automaticamente vinculadas ao domínio ativo. Se eles lançarem, então o domínio irá capturar o erro.

A fim de prevenir o uso excessivo de memória, objetos `Domain` em si não são implicitamente adicionados como filhos do domínio ativo. Se fossem, então seria muito fácil impedir que objetos de requisição e resposta fossem coletados como lixo adequadamente.

Para aninhar objetos `Domain` como filhos de um `Domain` pai, eles devem ser explicitamente adicionados.

A vinculação implícita encaminha erros lançados e eventos `'error'` para o evento `'error'` do `Domain`, mas não registra o `EventEmitter` no `Domain`. A vinculação implícita apenas cuida de erros lançados e eventos `'error'`.

## Vinculação explícita {#explicit-binding}

Às vezes, o domínio em uso não é aquele que deveria ser usado para um emissor de eventos específico. Ou, o emissor de eventos poderia ter sido criado no contexto de um domínio, mas deveria, em vez disso, ser vinculado a algum outro domínio.

Por exemplo, poderia haver um domínio em uso para um servidor HTTP, mas talvez gostaríamos de ter um domínio separado para usar para cada requisição.

Isso é possível através da vinculação explícita.

```js [ESM]
// Cria um domínio de nível superior para o servidor
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // O servidor é criado no escopo de serverDomain
  http.createServer((req, res) => {
    // Req e res também são criados no escopo de serverDomain
    // no entanto, preferiríamos ter um domínio separado para cada requisição.
    // crie-o primeiro e adicione req e res a ele.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- Retorna: [\<Domain\>](/pt/nodejs/api/domain#class-domain)

## Classe: `Domain` {#class-domain}

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

A classe `Domain` encapsula a funcionalidade de roteamento de erros e exceções não capturadas para o objeto `Domain` ativo.

Para lidar com os erros que ela captura, escute seu evento `'error'`.

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Um array de timers e emissores de eventos que foram explicitamente adicionados ao domínio.

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter) | [\<Timer\>](/pt/nodejs/api/timers#timers) emissor ou timer a ser adicionado ao domínio

Adiciona explicitamente um emissor ao domínio. Se algum manipulador de eventos chamado pelo emissor lançar um erro, ou se o emissor emitir um evento `'error'`, ele será roteado para o evento `'error'` do domínio, assim como com a vinculação implícita.

Isso também funciona com timers que são retornados de [`setInterval()`](/pt/nodejs/api/timers#setintervalcallback-delay-args) e [`setTimeout()`](/pt/nodejs/api/timers#settimeoutcallback-delay-args). Se sua função de callback lançar, ela será capturada pelo manipulador `'error'` do domínio.

Se o Timer ou `EventEmitter` já estava vinculado a um domínio, ele é removido desse e vinculado a este em vez disso.

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de callback
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função vinculada

A função retornada será um wrapper em torno da função de callback fornecida. Quando a função retornada é chamada, quaisquer erros que forem lançados serão roteados para o evento `'error'` do domínio.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // Se isso lançar, também será passado para o domínio.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // Um erro ocorreu em algum lugar. Se o lançarmos agora, ele irá travar o programa
  // com o número da linha e a mensagem da pilha normais.
});
```

### `domain.enter()` {#domainenter}

O método `enter()` é uma ferramenta utilizada pelos métodos `run()`, `bind()` e `intercept()` para definir o domínio ativo. Ele define `domain.active` e `process.domain` para o domínio e implicitamente coloca o domínio na pilha de domínio gerenciada pelo módulo de domínio (veja [`domain.exit()`](/pt/nodejs/api/domain#domainexit) para detalhes sobre a pilha de domínio). A chamada para `enter()` delimita o início de uma cadeia de chamadas assíncronas e operações de E/S vinculadas a um domínio.

Chamar `enter()` altera apenas o domínio ativo e não altera o domínio em si. `enter()` e `exit()` podem ser chamados um número arbitrário de vezes em um único domínio.

### `domain.exit()` {#domainexit}

O método `exit()` sai do domínio atual, removendo-o da pilha de domínio. Sempre que a execução for mudar para o contexto de uma cadeia diferente de chamadas assíncronas, é importante garantir que o domínio atual seja encerrado. A chamada para `exit()` delimita o fim ou uma interrupção da cadeia de chamadas assíncronas e operações de E/S vinculadas a um domínio.

Se houver vários domínios aninhados vinculados ao contexto de execução atual, `exit()` encerrará todos os domínios aninhados dentro deste domínio.

Chamar `exit()` altera apenas o domínio ativo e não altera o domínio em si. `enter()` e `exit()` podem ser chamados um número arbitrário de vezes em um único domínio.

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função de callback
- Retorna: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função interceptada

Este método é quase idêntico a [`domain.bind(callback)`](/pt/nodejs/api/domain#domainbindcallback). No entanto, além de capturar erros lançados, ele também interceptará objetos [`Error`](/pt/nodejs/api/errors#class-error) enviados como o primeiro argumento para a função.

Dessa forma, o padrão comum `if (err) return callback(err);` pode ser substituído por um único manipulador de erros em um único lugar.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // Observe que o primeiro argumento nunca é passado para o
    // callback, pois presume-se que seja o argumento 'Error'
    // e, portanto, interceptado pelo domínio.

    // Se isso lançar um erro, também será passado para o domínio
    // para que a lógica de tratamento de erros possa ser movida para o evento
    // 'error' no domínio, em vez de ser repetida por todo
    // o programa.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // Um erro ocorreu em algum lugar. Se o lançarmos agora, ele travará o programa
  // com o número da linha e a mensagem de pilha normais.
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter) | [\<Timer\>](/pt/nodejs/api/timers#timers) emissor ou timer a ser removido do domínio

O oposto de [`domain.add(emitter)`](/pt/nodejs/api/domain#domainaddemitter). Remove o tratamento do domínio do emissor especificado.

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Executa a função fornecida no contexto do domínio, vinculando implicitamente todos os emissores de eventos, timers e solicitações de baixo nível que são criados nesse contexto. Opcionalmente, os argumentos podem ser passados para a função.

Esta é a maneira mais básica de usar um domínio.

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Erro detectado!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // Simulando algumas coisas assíncronas diversas
      fs.open('arquivo inexistente', 'r', (er, fd) => {
        if (er) throw er;
        // prosseguir...
      });
    }, 100);
  });
});
```
Neste exemplo, o manipulador `d.on('error')` será acionado, em vez de travar o programa.

## Domínios e promessas {#domains-and-promises}

A partir do Node.js 8.0.0, os manipuladores de promessas são executados dentro do domínio em que a chamada para `.then()` ou `.catch()` foi feita:

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // executando em d2
  });
});
```
Um callback pode ser vinculado a um domínio específico usando [`domain.bind(callback)`](/pt/nodejs/api/domain#domainbindcallback):

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // executando em d1
  }));
});
```
Os domínios não interferirão nos mecanismos de tratamento de erros para promessas. Em outras palavras, nenhum evento `'error'` será emitido para rejeições `Promise` não tratadas.

