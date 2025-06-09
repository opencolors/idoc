---
title: Documentação da API de Temporizadores do Node.js
description: O módulo de Temporizadores do Node.js oferece funções para agendar a execução de funções em um momento futuro. Isso inclui métodos como setTimeout, setInterval, setImmediate e seus equivalentes de limpeza, além de process.nextTick para executar código na próxima iteração do loop de eventos.
head:
  - - meta
    - name: og:title
      content: Documentação da API de Temporizadores do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo de Temporizadores do Node.js oferece funções para agendar a execução de funções em um momento futuro. Isso inclui métodos como setTimeout, setInterval, setImmediate e seus equivalentes de limpeza, além de process.nextTick para executar código na próxima iteração do loop de eventos.
  - - meta
    - name: twitter:title
      content: Documentação da API de Temporizadores do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo de Temporizadores do Node.js oferece funções para agendar a execução de funções em um momento futuro. Isso inclui métodos como setTimeout, setInterval, setImmediate e seus equivalentes de limpeza, além de process.nextTick para executar código na próxima iteração do loop de eventos.
---


# Timers {#timers}

::: tip [Stable: 2 - Stable]
[Stable: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

O módulo `timer` expõe uma API global para agendar funções a serem chamadas em algum período de tempo futuro. Como as funções de timer são globais, não há necessidade de chamar `require('node:timers')` para usar a API.

As funções de timer dentro do Node.js implementam uma API semelhante à API de timers fornecida pelos navegadores da Web, mas usam uma implementação interna diferente, construída em torno do [Loop de Eventos](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) do Node.js.

## Classe: `Immediate` {#class-immediate}

Este objeto é criado internamente e é retornado de [`setImmediate()`](/pt/nodejs/api/timers#setimmediatecallback-args). Ele pode ser passado para [`clearImmediate()`](/pt/nodejs/api/timers#clearimmediateimmediate) para cancelar as ações agendadas.

Por padrão, quando um immediate é agendado, o loop de eventos do Node.js continuará sendo executado enquanto o immediate estiver ativo. O objeto `Immediate` retornado por [`setImmediate()`](/pt/nodejs/api/timers#setimmediatecallback-args) exporta as funções `immediate.ref()` e `immediate.unref()` que podem ser usadas para controlar este comportamento padrão.

### `immediate.hasRef()` {#immediatehasref}

**Adicionado em: v11.0.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se verdadeiro, o objeto `Immediate` manterá o loop de eventos do Node.js ativo.

### `immediate.ref()` {#immediateref}

**Adicionado em: v9.7.0**

- Retorna: [\<Immediate\>](/pt/nodejs/api/timers#class-immediate) uma referência para `immediate`

Quando chamado, solicita que o loop de eventos do Node.js *não* saia enquanto o `Immediate` estiver ativo. Chamar `immediate.ref()` várias vezes não terá efeito.

Por padrão, todos os objetos `Immediate` são "ref'ed", tornando normalmente desnecessário chamar `immediate.ref()` a menos que `immediate.unref()` tenha sido chamado anteriormente.


### `immediate.unref()` {#immediateunref}

**Adicionado em: v9.7.0**

- Retorna: [\<Immediate\>](/pt/nodejs/api/timers#class-immediate) uma referência para `immediate`

Quando chamado, o objeto `Immediate` ativo não exigirá que o loop de eventos do Node.js permaneça ativo. Se não houver outra atividade mantendo o loop de eventos em execução, o processo poderá ser encerrado antes que o callback do objeto `Immediate` seja invocado. Chamar `immediate.unref()` várias vezes não terá efeito.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**Adicionado em: v20.5.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Cancela o immediate. Isso é semelhante a chamar `clearImmediate()`.

## Classe: `Timeout` {#class-timeout}

Este objeto é criado internamente e é retornado de [`setTimeout()`](/pt/nodejs/api/timers#settimeoutcallback-delay-args) e [`setInterval()`](/pt/nodejs/api/timers#setintervalcallback-delay-args). Ele pode ser passado para [`clearTimeout()`](/pt/nodejs/api/timers#cleartimeouttimeout) ou [`clearInterval()`](/pt/nodejs/api/timers#clearintervaltimeout) para cancelar as ações agendadas.

Por padrão, quando um temporizador é agendado usando [`setTimeout()`](/pt/nodejs/api/timers#settimeoutcallback-delay-args) ou [`setInterval()`](/pt/nodejs/api/timers#setintervalcallback-delay-args), o loop de eventos do Node.js continuará em execução enquanto o temporizador estiver ativo. Cada um dos objetos `Timeout` retornados por essas funções exporta as funções `timeout.ref()` e `timeout.unref()` que podem ser usadas para controlar esse comportamento padrão.

### `timeout.close()` {#timeoutclose}

**Adicionado em: v0.9.1**

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 3](/pt/nodejs/api/documentation#stability-index) - Legado: Use [`clearTimeout()`](/pt/nodejs/api/timers#cleartimeouttimeout) em vez disso.
:::

- Retorna: [\<Timeout\>](/pt/nodejs/api/timers#class-timeout) uma referência para `timeout`

Cancela o timeout.

### `timeout.hasRef()` {#timeouthasref}

**Adicionado em: v11.0.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Se verdadeiro, o objeto `Timeout` manterá o loop de eventos do Node.js ativo.


### `timeout.ref()` {#timeoutref}

**Adicionado em: v0.9.1**

- Retorna: [\<Timeout\>](/pt/nodejs/api/timers#class-timeout) uma referência para `timeout`

Quando chamado, solicita que o loop de eventos do Node.js *não* saia enquanto o `Timeout` estiver ativo. Chamar `timeout.ref()` várias vezes não terá efeito.

Por padrão, todos os objetos `Timeout` são "referenciados", tornando normalmente desnecessário chamar `timeout.ref()` a menos que `timeout.unref()` tenha sido chamado anteriormente.

### `timeout.refresh()` {#timeoutrefresh}

**Adicionado em: v10.2.0**

- Retorna: [\<Timeout\>](/pt/nodejs/api/timers#class-timeout) uma referência para `timeout`

Define a hora de início do temporizador para a hora atual e reprograma o temporizador para chamar seu retorno de chamada na duração especificada anteriormente, ajustada para a hora atual. Isso é útil para atualizar um temporizador sem alocar um novo objeto JavaScript.

Usar isso em um temporizador que já chamou seu retorno de chamada irá reativar o temporizador.

### `timeout.unref()` {#timeoutunref}

**Adicionado em: v0.9.1**

- Retorna: [\<Timeout\>](/pt/nodejs/api/timers#class-timeout) uma referência para `timeout`

Quando chamado, o objeto `Timeout` ativo não exigirá que o loop de eventos do Node.js permaneça ativo. Se não houver outra atividade mantendo o loop de eventos em execução, o processo pode sair antes que o retorno de chamada do objeto `Timeout` seja invocado. Chamar `timeout.unref()` várias vezes não terá efeito.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**Adicionado em: v14.9.0, v12.19.0**

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) um número que pode ser usado para referenciar este `timeout`

Coage um `Timeout` para um primitivo. O primitivo pode ser usado para limpar o `Timeout`. O primitivo só pode ser usado no mesmo thread onde o timeout foi criado. Portanto, para usá-lo entre [`worker_threads`](/pt/nodejs/api/worker_threads) ele deve primeiro ser passado para o thread correto. Isso permite compatibilidade aprimorada com as implementações de `setTimeout()` e `setInterval()` do navegador.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**Adicionado em: v20.5.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Cancela o timeout.


## Agendando temporizadores {#scheduling-timers}

Um temporizador no Node.js é uma construção interna que chama uma função fornecida após um certo período de tempo. O momento em que a função de um temporizador é chamada varia dependendo de qual método foi usado para criar o temporizador e qual outro trabalho o loop de eventos do Node.js está fazendo.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.9.1 | Adicionado em: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser chamada no final desta rodada do [Loop de Eventos](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) do Node.js
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionais para passar quando o `callback` é chamado.
- Retorna: [\<Immediate\>](/pt/nodejs/api/timers#class-immediate) para uso com [`clearImmediate()`](/pt/nodejs/api/timers#clearimmediateimmediate)

Agenda a execução "imediata" do `callback` após os callbacks de eventos de E/S.

Quando várias chamadas para `setImmediate()` são feitas, as funções `callback` são enfileiradas para execução na ordem em que são criadas. Toda a fila de callbacks é processada a cada iteração do loop de eventos. Se um temporizador imediato for enfileirado de dentro de um callback em execução, esse temporizador não será acionado até a próxima iteração do loop de eventos.

Se `callback` não for uma função, um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) será lançado.

Este método tem uma variante personalizada para promises que está disponível usando [`timersPromises.setImmediate()`](/pt/nodejs/api/timers#timerspromisessetimmediatevalue-options).

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Adicionado em: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser chamada quando o temporizador expirar.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos a esperar antes de chamar o `callback`. **Padrão:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionais para passar quando o `callback` é chamado.
- Retorna: [\<Timeout\>](/pt/nodejs/api/timers#class-timeout) para uso com [`clearInterval()`](/pt/nodejs/api/timers#clearintervaltimeout)

Agenda a execução repetida de `callback` a cada `delay` milissegundos.

Quando `delay` for maior que `2147483647` ou menor que `1` ou `NaN`, o `delay` será definido como `1`. Atrasos não inteiros são truncados para um inteiro.

Se `callback` não for uma função, um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) será lançado.

Este método tem uma variante personalizada para promises que está disponível usando [`timersPromises.setInterval()`](/pt/nodejs/api/timers#timerspromisessetintervaldelay-value-options).


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Adicionado em: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função a ser chamada quando o temporizador expirar.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos para esperar antes de chamar o `callback`. **Padrão:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Argumentos opcionais a serem passados quando o `callback` for chamado.
- Retorna: [\<Timeout\>](/pt/nodejs/api/timers#class-timeout) para uso com [`clearTimeout()`](/pt/nodejs/api/timers#cleartimeouttimeout)

Agenda a execução de um `callback` único após `delay` milissegundos.

O `callback` provavelmente não será invocado precisamente em `delay` milissegundos. O Node.js não oferece garantias sobre o tempo exato em que os callbacks serão disparados, nem sobre sua ordem. O callback será chamado o mais próximo possível do tempo especificado.

Quando `delay` for maior que `2147483647` ou menor que `1` ou `NaN`, o `delay` será definido como `1`. Atrasos não inteiros são truncados para um inteiro.

Se `callback` não for uma função, um [`TypeError`](/pt/nodejs/api/errors#class-typeerror) será lançado.

Este método tem uma variante personalizada para promessas que está disponível usando [`timersPromises.setTimeout()`](/pt/nodejs/api/timers#timerspromisessettimeoutdelay-value-options).

## Cancelando temporizadores {#cancelling-timers}

Os métodos [`setImmediate()`](/pt/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/pt/nodejs/api/timers#setintervalcallback-delay-args) e [`setTimeout()`](/pt/nodejs/api/timers#settimeoutcallback-delay-args) retornam cada um objetos que representam os temporizadores agendados. Estes podem ser usados para cancelar o temporizador e evitar que ele seja disparado.

Para as variantes promissificadas de [`setImmediate()`](/pt/nodejs/api/timers#setimmediatecallback-args) e [`setTimeout()`](/pt/nodejs/api/timers#settimeoutcallback-delay-args), um [`AbortController`](/pt/nodejs/api/globals#class-abortcontroller) pode ser usado para cancelar o temporizador. Quando canceladas, as Promises retornadas serão rejeitadas com um `'AbortError'`.

Para `setImmediate()`:

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Não fazemos `await` na promise para que `ac.abort()` seja chamado concorrentemente.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('O immediate foi abortado');
  });

ac.abort();
```

```js [CJS]
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('O immediate foi abortado');
  });

ac.abort();
```
:::

Para `setTimeout()`:

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Não fazemos `await` na promise para que `ac.abort()` seja chamado concorrentemente.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('O timeout foi abortado');
  });

ac.abort();
```

```js [CJS]
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('O timeout foi abortado');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**Adicionado em: v0.9.1**

- `immediate` [\<Immediate\>](/pt/nodejs/api/timers#class-immediate) Um objeto `Immediate` como retornado por [`setImmediate()`](/pt/nodejs/api/timers#setimmediatecallback-args).

Cancela um objeto `Immediate` criado por [`setImmediate()`](/pt/nodejs/api/timers#setimmediatecallback-args).

### `clearInterval(timeout)` {#clearintervaltimeout}

**Adicionado em: v0.0.1**

- `timeout` [\<Timeout\>](/pt/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um objeto `Timeout` como retornado por [`setInterval()`](/pt/nodejs/api/timers#setintervalcallback-delay-args) ou o [primitivo](/pt/nodejs/api/timers#timeoutsymboltoprimitive) do objeto `Timeout` como uma string ou um número.

Cancela um objeto `Timeout` criado por [`setInterval()`](/pt/nodejs/api/timers#setintervalcallback-delay-args).

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Adicionado em: v0.0.1**

- `timeout` [\<Timeout\>](/pt/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um objeto `Timeout` como retornado por [`setTimeout()`](/pt/nodejs/api/timers#settimeoutcallback-delay-args) ou o [primitivo](/pt/nodejs/api/timers#timeoutsymboltoprimitive) do objeto `Timeout` como uma string ou um número.

Cancela um objeto `Timeout` criado por [`setTimeout()`](/pt/nodejs/api/timers#settimeoutcallback-delay-args).

## API de Promessas de Timers {#timers-promises-api}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.0.0 | Graduado de experimental. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

A API `timers/promises` fornece um conjunto alternativo de funções de timer que retornam objetos `Promise`. A API é acessível via `require('node:timers/promises')`.

::: code-group
```js [ESM]
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```js [CJS]
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```
:::


### `timersPromises.setTimeout([delay[, value[, options]]])` {#timerspromisessettimeoutdelay-value-options}

**Adicionado em: v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos para esperar antes de cumprir a promessa. **Padrão:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Um valor com o qual a promessa é cumprida.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Definido como `false` para indicar que o `Timeout` agendado não deve exigir que o loop de eventos do Node.js permaneça ativo. **Padrão:** `true`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um `AbortSignal` opcional que pode ser usado para cancelar o `Timeout` agendado.
  
 



::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Prints 'result'
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Prints 'result'
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**Adicionado em: v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Um valor com o qual a promessa é cumprida.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Definido como `false` para indicar que o `Immediate` agendado não deve exigir que o loop de eventos do Node.js permaneça ativo. **Padrão:** `true`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um `AbortSignal` opcional que pode ser usado para cancelar o `Immediate` agendado.
  
 



::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Prints 'result'
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Prints 'result'
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**Adicionado em: v15.9.0**

Retorna um iterador assíncrono que gera valores em um intervalo de `delay` ms. Se `ref` for `true`, você precisa chamar `next()` do iterador assíncrono explicitamente ou implicitamente para manter o loop de eventos ativo.

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos para esperar entre as iterações. **Padrão:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Um valor com o qual o iterador retorna.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Defina como `false` para indicar que o `Timeout` agendado entre as iterações não deve exigir que o loop de eventos do Node.js permaneça ativo. **Padrão:** `true`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um `AbortSignal` opcional que pode ser usado para cancelar o `Timeout` agendado entre as operações.

::: code-group
```js [ESM]
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```js [CJS]
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```
:::

### `timersPromises.scheduler.wait(delay[, options])` {#timerspromisesschedulerwaitdelay-options}

**Adicionado em: v17.3.0, v16.14.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos para esperar antes de resolver a promise.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Defina como `false` para indicar que o `Timeout` agendado não deve exigir que o loop de eventos do Node.js permaneça ativo. **Padrão:** `true`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um `AbortSignal` opcional que pode ser usado para cancelar a espera.

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Uma API experimental definida pela especificação de rascunho das [APIs de Agendamento](https://github.com/WICG/scheduling-apis) sendo desenvolvida como uma API de Plataforma Web padrão.

Chamar `timersPromises.scheduler.wait(delay, options)` é equivalente a chamar `timersPromises.setTimeout(delay, undefined, options)`.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // Espere um segundo antes de continuar
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**Adicionado em: v17.3.0, v16.14.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Uma API experimental definida pela especificação preliminar das [APIs de Agendamento](https://github.com/WICG/scheduling-apis) que está sendo desenvolvida como uma API padrão da Plataforma Web.

Chamar `timersPromises.scheduler.yield()` é equivalente a chamar `timersPromises.setImmediate()` sem argumentos.

