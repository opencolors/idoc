---
title: Entendendo o Loop de Eventos do Node.js
description: O loop de eventos é o núcleo do Node.js, permitindo executar operações I/O não bloqueantes. É um loop de thread única que descarrega operações para o núcleo do sistema quando possível.
head:
  - - meta
    - name: og:title
      content: Entendendo o Loop de Eventos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O loop de eventos é o núcleo do Node.js, permitindo executar operações I/O não bloqueantes. É um loop de thread única que descarrega operações para o núcleo do sistema quando possível.
  - - meta
    - name: twitter:title
      content: Entendendo o Loop de Eventos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O loop de eventos é o núcleo do Node.js, permitindo executar operações I/O não bloqueantes. É um loop de thread única que descarrega operações para o núcleo do sistema quando possível.
---


# O Loop de Eventos do Node.js

## O que é o Loop de Eventos?

O loop de eventos é o que permite que o Node.js execute operações de E/S não bloqueantes — apesar do fato de que um único thread JavaScript é usado por padrão — descarregando operações para o kernel do sistema sempre que possível.

Como a maioria dos kernels modernos são multi-threaded, eles podem lidar com várias operações executando em segundo plano. Quando uma dessas operações é concluída, o kernel informa ao Node.js para que o callback apropriado possa ser adicionado à fila de sondagem para ser eventualmente executado. Explicaremos isso em mais detalhes posteriormente neste tópico.

## Loop de Eventos Explicado

Quando o Node.js é iniciado, ele inicializa o loop de eventos, processa o script de entrada fornecido (ou entra no REPL, que não é abordado neste documento) que pode fazer chamadas de API assíncronas, agendar timers ou chamar process.nextTick(), então começa a processar o loop de eventos.

O diagrama a seguir mostra uma visão geral simplificada da ordem das operações do loop de eventos.

```bash
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

::: tip
Cada caixa será referida como uma "fase" do loop de eventos.
:::

Cada fase tem uma fila FIFO de callbacks para executar. Embora cada fase seja especial à sua maneira, geralmente, quando o loop de eventos entra em uma determinada fase, ele realizará quaisquer operações específicas dessa fase, então executará callbacks na fila dessa fase até que a fila tenha se esgotado ou o número máximo de callbacks tenha sido executado. Quando a fila se esgotou ou o limite de callback foi atingido, o loop de eventos passará para a próxima fase, e assim por diante.

Como qualquer uma dessas operações pode agendar mais operações e novos eventos processados na fase de **sondagem** são enfileirados pelo kernel, os eventos de sondagem podem ser enfileirados enquanto os eventos de sondagem estão sendo processados. Como resultado, callbacks de longa duração podem permitir que a fase de sondagem seja executada por muito mais tempo do que o limite de um timer. Consulte as seções de timers e sondagem para obter mais detalhes.

::: tip
Há uma pequena discrepância entre a implementação do Windows e do Unix/Linux, mas isso não é importante para esta demonstração. As partes mais importantes estão aqui. Na verdade, existem sete ou oito etapas, mas as que nos importam — as que o Node.js realmente usa — são as acima.
:::


## Visão Geral das Fases
- **timers**: esta fase executa callbacks agendados por `setTimeout()` e `setInterval()`.
- **pending callbacks**: executa callbacks de I/O adiados para a próxima iteração do loop.
- **idle, prepare**: usado apenas internamente.
- **poll**: recupera novos eventos de I/O; executa callbacks relacionados a I/O (quase todos com exceção dos close callbacks, os agendados por timers e `setImmediate()`); o node irá bloquear aqui quando apropriado.
- **check**: callbacks de `setImmediate()` são invocados aqui.
- **close callbacks**: alguns close callbacks, ex: `socket.on('close', ...)`.

Entre cada execução do loop de eventos, o Node.js verifica se está aguardando qualquer I/O assíncrono ou timers e desliga de forma limpa se não houver nenhum.

## Fases em Detalhe

### timers

Um timer especifica o **limiar** após o qual um callback fornecido pode ser executado, em vez do tempo **exato** que uma pessoa *quer que seja executado*. Os callbacks de timers serão executados assim que puderem ser agendados após a quantidade de tempo especificada ter passado; no entanto, o agendamento do Sistema Operacional ou a execução de outros callbacks podem atrasá-los.

::: tip
Tecnicamente, a fase [poll](/pt/nodejs/guide/nodejs-event-loop#poll) controla quando os timers são executados.
:::

Por exemplo, digamos que você agende um timeout para ser executado após um limite de 100 ms, então seu script começa a ler um arquivo de forma assíncrona, o que leva 95 ms:

```js
const fs = require('node:fs');
function someAsyncOperation(callback) {
  // Assume que isso leva 95ms para completar
  fs.readFile('/path/to/file', callback);
}
const timeoutScheduled = Date.now();
setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;
  console.log(`${delay}ms se passaram desde que fui agendado`);
}, 100);
// faça someAsyncOperation que leva 95 ms para completar
someAsyncOperation(() => {
  const startCallback = Date.now();
  // faça algo que levará 10ms...
  while (Date.now() - startCallback < 10) {
    // não faça nada
  }
});
```

Quando o loop de eventos entra na fase **poll**, ele tem uma fila vazia (`fs.readFile()` não foi concluído), então ele esperará o número de ms restantes até que o limite do timer mais próximo seja atingido. Enquanto espera, 95 ms se passam, `fs.readFile()` termina de ler o arquivo e seu callback, que leva 10 ms para ser concluído, é adicionado à fila de poll e executado. Quando o callback termina, não há mais callbacks na fila, então o loop de eventos verá que o limite do timer mais próximo foi atingido e voltará para a fase de timers para executar o callback do timer. Neste exemplo, você verá que o atraso total entre o timer sendo agendado e seu callback sendo executado será de 105ms.

::: tip
Para evitar que a fase poll prejudique o loop de eventos, [libuv](https://libuv.org/) (a biblioteca C que implementa o loop de eventos do Node.js e todos os comportamentos assíncronos da plataforma) também tem um máximo rígido (dependente do sistema) antes de parar de buscar mais eventos.
:::


## callbacks pendentes
Esta fase executa callbacks para algumas operações do sistema, como tipos de erros TCP. Por exemplo, se um socket TCP receber `ECONNREFUSED` ao tentar conectar, alguns sistemas *nix querem esperar para reportar o erro. Isso será enfileirado para ser executado na fase de **callbacks pendentes**.

### poll

A fase de **poll** tem duas funções principais:

1. Calcular por quanto tempo deve bloquear e fazer poll para E/S, então
2. Processar eventos na fila de **poll**.

Quando o loop de eventos entra na fase de **poll** e não há timers agendados, uma de duas coisas acontecerá:

- Se a fila de ***poll*** ***não estiver vazia***, o loop de eventos irá iterar através de sua fila de callbacks, executando-os sincronamente até que a fila tenha se esgotado ou o limite rígido dependente do sistema seja atingido.

- Se a fila de ***poll*** ***estiver vazia***, uma de duas coisas acontecerá:

    - Se scripts foram agendados por `setImmediate()`, o loop de eventos terminará a fase de **poll** e continuará para a fase de verificação para executar esses scripts agendados.

    - Se scripts **não foram** agendados por `setImmediate()`, o loop de eventos esperará que callbacks sejam adicionados à fila, e então os executará imediatamente.

Uma vez que a fila de **poll** está vazia, o loop de eventos verificará por timers *cujos limites de tempo* foram atingidos. Se um ou mais timers estiverem prontos, o loop de eventos retornará para a fase de **timers** para executar os callbacks desses timers.

### check

Esta fase permite que uma pessoa execute callbacks imediatamente após a conclusão da fase de **poll**. Se a fase de **poll** ficar ociosa e scripts tiverem sido enfileirados com `setImmediate()`, o loop de eventos pode continuar para a fase de verificação em vez de esperar.

`setImmediate()` é, na verdade, um timer especial que é executado em uma fase separada do loop de eventos. Ele usa uma API libuv que agenda callbacks para serem executados após a conclusão da fase de **poll**.

Geralmente, conforme o código é executado, o loop de eventos acabará atingindo a fase de **poll**, onde aguardará uma conexão, solicitação, etc. No entanto, se um callback foi agendado com `setImmediate()` e a fase de **poll** ficar ociosa, ela terminará e continuará para a fase de **check**, em vez de esperar por eventos de **poll**.


### Callbacks de fechamento

Se um socket ou handle for fechado abruptamente (por exemplo, `socket.destroy()`), o evento `'close'` será emitido nesta fase. Caso contrário, ele será emitido via `process.nextTick()`.

## `setImmediate()` vs `setTimeout()`

`setImmediate()` e `setTimeout()` são semelhantes, mas se comportam de maneiras diferentes dependendo de quando são chamados.

- `setImmediate()` é projetado para executar um script assim que a fase de **poll** atual for concluída.
- `setTimeout()` agenda um script para ser executado após um limite mínimo em ms ter decorrido.

A ordem em que os timers são executados irá variar dependendo do contexto em que são chamados. Se ambos forem chamados de dentro do módulo principal, o tempo será limitado pelo desempenho do processo (que pode ser afetado por outros aplicativos em execução na máquina).

Por exemplo, se executarmos o seguinte script que não está dentro de um ciclo de I/O (ou seja, o módulo principal), a ordem em que os dois timers são executados não é determinística, pois é limitada pelo desempenho do processo:

::: code-group

```js [JS]
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);
setImmediate(() => {
  console.log('immediate');
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
timeout
immediate
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

No entanto, se você mover as duas chamadas para dentro de um ciclo de I/O, o callback imediato é sempre executado primeiro:

::: code-group

```js [JS]
// timeout_vs_immediate.js
const fs = require('node:fs');
fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

```bash [BASH]
$ node timeout_vs_immediate.js
immediate
timeout
$ node timeout_vs_immediate.js
immediate
timeout
```

:::

A principal vantagem de usar `setImmediate()` em vez de `setTimeout()` é que `setImmediate()` sempre será executado antes de qualquer timer se agendado dentro de um ciclo de I/O, independentemente de quantos timers estejam presentes.


## `process.nextTick()`

### Compreendendo `process.nextTick()`

Você deve ter notado que `process.nextTick()` não foi exibido no diagrama, mesmo que faça parte da API assíncrona. Isso ocorre porque `process.nextTick()` não faz tecnicamente parte do loop de eventos. Em vez disso, a `nextTickQueue` será processada após a conclusão da operação atual, independentemente da fase atual do loop de eventos. Aqui, uma operação é definida como uma transição do manipulador C/C++ subjacente e o tratamento do JavaScript que precisa ser executado.

Olhando para trás em nosso diagrama, sempre que você chama `process.nextTick()` em uma determinada fase, todos os retornos de chamada passados para `process.nextTick()` serão resolvidos antes que o loop de eventos continue. Isso pode criar algumas situações ruins porque **permite que você "mate de fome" sua E/S fazendo chamadas recursivas** `process.nextTick()`, o que impede que o loop de eventos alcance a fase de **pesquisa (poll)**.

### Por que isso seria permitido?

Por que algo assim seria incluído no Node.js? Parte disso é uma filosofia de design onde uma API deve ser sempre assíncrona, mesmo onde não precisa ser. Veja este trecho de código como exemplo:

```js
function apiCall(arg, callback) {
  if (typeof arg !== 'string')
    return process.nextTick(
      callback,
      new TypeError('argument should be string')
    );
}
```

O trecho faz uma verificação de argumento e, se não estiver correto, passará o erro para o retorno de chamada. A API foi atualizada recentemente para permitir a passagem de argumentos para `process.nextTick()`, permitindo que ela receba quaisquer argumentos passados após o retorno de chamada para serem propagados como argumentos para o retorno de chamada, para que você não precise aninhar funções.

O que estamos fazendo é passar um erro de volta para o usuário, mas apenas depois de permitir que o restante do código do usuário seja executado. Ao usar `process.nextTick()`, garantimos que `apiCall()` sempre execute seu retorno de chamada após o restante do código do usuário e antes que o loop de eventos possa prosseguir. Para conseguir isso, a pilha de chamadas JS pode ser desenrolada e executar imediatamente o retorno de chamada fornecido, o que permite que uma pessoa faça chamadas recursivas para `process.nextTick()` sem atingir um `RangeError: Tamanho máximo da pilha de chamadas excedido do v8`.

Essa filosofia pode levar a algumas situações potencialmente problemáticas. Veja este trecho como exemplo:

```js
let bar;
// isso tem uma assinatura assíncrona, mas chama o retorno de chamada de forma síncrona
function someAsyncApiCall(callback) {
  callback();
}
// o retorno de chamada é chamado antes que `someAsyncApiCall` seja concluído.
someAsyncApiCall(() => {
  // como someAsyncApiCall não foi concluído, nenhum valor foi atribuído a bar
  console.log('bar', bar); // indefinido
});
bar = 1;
```

O usuário define `someAsyncApiCall()` para ter uma assinatura assíncrona, mas na verdade opera de forma síncrona. Quando é chamado, o retorno de chamada fornecido para `someAsyncApiCall()` é chamado na mesma fase do loop de eventos porque `someAsyncApiCall()` realmente não faz nada de forma assíncrona. Como resultado, o retorno de chamada tenta referenciar bar, mesmo que ainda não tenha essa variável no escopo, porque o script não conseguiu ser executado até a conclusão.

Ao colocar o retorno de chamada em um `process.nextTick()`, o script ainda tem a capacidade de ser executado até a conclusão, permitindo que todas as variáveis, funções, etc., sejam inicializadas antes que o retorno de chamada seja chamado. Ele também tem a vantagem de não permitir que o loop de eventos continue. Pode ser útil para o usuário ser alertado sobre um erro antes que o loop de eventos possa continuar. Aqui está o exemplo anterior usando `process.nextTick()`:

```js
let bar;
function someAsyncApiCall(callback) {
  process.nextTick(callback);
}
someAsyncApiCall(() => {
  console.log('bar', bar); // 1
});
bar = 1;
```

Aqui está outro exemplo do mundo real:

```js
const server = net.createServer(() => {}).listen(8080);
server.on('listening', () => {});
```

Quando apenas uma porta é passada, a porta é vinculada imediatamente. Portanto, o retorno de chamada `'listening'` pode ser chamado imediatamente. O problema é que o retorno de chamada `.on('listening')` não terá sido definido nesse momento.

Para contornar isso, o evento `'listening'` é colocado em fila em um `nextTick()` para permitir que o script seja executado até a conclusão. Isso permite que o usuário defina os manipuladores de eventos que desejar.


## `process.nextTick()` vs `setImmediate()`

Temos duas chamadas que são similares no que diz respeito aos usuários, mas seus nomes são confusos.

- `process.nextTick()` dispara imediatamente na mesma fase
- `setImmediate()` dispara na iteração seguinte ou `'tick'` do loop de eventos

Em essência, os nomes deveriam ser trocados. `process.nextTick()` dispara mais imediatamente do que `setImmediate()`, mas isso é um artefato do passado que dificilmente mudará. Fazer essa troca quebraria uma grande porcentagem dos pacotes no npm. A cada dia, mais módulos novos são adicionados, o que significa que a cada dia que esperamos, mais potenciais quebras ocorrem. Embora sejam confusos, os nomes em si não mudarão.

::: tip
Recomendamos que os desenvolvedores usem `setImmediate()` em todos os casos porque é mais fácil de entender.
:::

## Por que usar `process.nextTick()`?

Existem duas razões principais:

1. Permitir que os usuários lidem com erros, limpem quaisquer recursos desnecessários ou talvez tentem a solicitação novamente antes que o loop de eventos continue.

2. Às vezes, é necessário permitir que um callback seja executado após o desenrolar da pilha de chamadas, mas antes que o loop de eventos continue.

Um exemplo é para corresponder às expectativas do usuário. Exemplo simples:

```js
const server = net.createServer();
server.on('connection', conn => {});
server.listen(8080);
server.on('listening', () => {});
```

Digamos que `listen()` seja executado no início do loop de eventos, mas o callback de escuta seja colocado em um `setImmediate()`. A menos que um nome de host seja passado, a vinculação à porta acontecerá imediatamente. Para que o loop de eventos prossiga, ele deve atingir a fase de pesquisa, o que significa que há uma chance não nula de que uma conexão possa ter sido recebida, permitindo que o evento de conexão seja disparado antes do evento de escuta.

Outro exemplo é estender um `EventEmitter` e emitir um evento de dentro do construtor:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.emit('event');
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

Você não pode emitir um evento do construtor imediatamente porque o script não terá processado até o ponto em que o usuário atribui um callback a esse evento. Então, dentro do próprio construtor, você pode usar `process.nextTick()` para definir um callback para emitir o evento após o término do construtor, o que fornece os resultados esperados:

```js
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // use nextTick para emitir o evento assim que um manipulador for atribuído
    process.nextTick(() => {
      this.emit('event');
    });
  }
}
const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```
