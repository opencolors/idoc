---
title: Documentação do Node.js - Ganchos de Desempenho
description: Explore a API de ganchos de desempenho no Node.js, que oferece acesso a métricas de desempenho e ferramentas para medir o desempenho de aplicações Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Ganchos de Desempenho | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore a API de ganchos de desempenho no Node.js, que oferece acesso a métricas de desempenho e ferramentas para medir o desempenho de aplicações Node.js.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Ganchos de Desempenho | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore a API de ganchos de desempenho no Node.js, que oferece acesso a métricas de desempenho e ferramentas para medir o desempenho de aplicações Node.js.
---


# APIs de medição de desempenho {#performance-measurement-apis}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

Este módulo fornece uma implementação de um subconjunto das [APIs de Desempenho Web](https://w3c.github.io/perf-timing-primer/) do W3C, bem como APIs adicionais para medições de desempenho específicas do Node.js.

O Node.js suporta as seguintes [APIs de Desempenho Web](https://w3c.github.io/perf-timing-primer/):

- [Tempo de Alta Resolução](https://www.w3.org/TR/hr-time-2)
- [Linha do Tempo de Desempenho](https://w3c.github.io/performance-timeline/)
- [Tempo do Usuário](https://www.w3.org/TR/user-timing/)
- [Tempo de Recursos](https://www.w3.org/TR/resource-timing-2/)



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```js [CJS]
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```
:::

## `perf_hooks.performance` {#perf_hooksperformance}

**Adicionado em: v8.5.0**

Um objeto que pode ser usado para coletar métricas de desempenho da instância atual do Node.js. É semelhante a [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) nos navegadores.


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se `name` não for fornecido, remove todos os objetos `PerformanceMark` da Linha do Tempo de Desempenho. Se `name` for fornecido, remove apenas a marca nomeada.

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v16.7.0 | Adicionado em: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se `name` não for fornecido, remove todos os objetos `PerformanceMeasure` da Linha do Tempo de Desempenho. Se `name` for fornecido, remove apenas a medida nomeada.

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se `name` não for fornecido, remove todos os objetos `PerformanceResourceTiming` da Linha do Tempo de Recursos. Se `name` for fornecido, remove apenas o recurso nomeado.

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Adicionado em: v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O resultado de uma chamada anterior para `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O resultado de uma chamada anterior para `eventLoopUtilization()` anterior a `utilization1`.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O método `eventLoopUtilization()` retorna um objeto que contém a duração cumulativa do tempo em que o loop de eventos ficou ocioso e ativo como um temporizador de alta resolução em milissegundos. O valor de `utilization` é a Utilização do Loop de Eventos (ELU) calculada.

Se o bootstrapping ainda não tiver terminado na thread principal, as propriedades terão o valor de `0`. O ELU está imediatamente disponível em [threads Worker](/pt/nodejs/api/worker_threads#worker-threads), pois o bootstrap acontece dentro do loop de eventos.

Ambos `utilization1` e `utilization2` são parâmetros opcionais.

Se `utilization1` for passado, então o delta entre os tempos `active` e `idle` da chamada atual, bem como o valor `utilization` correspondente, são calculados e retornados (semelhante a [`process.hrtime()`](/pt/nodejs/api/process#processhrtimetime)).

Se `utilization1` e `utilization2` forem ambos passados, então o delta é calculado entre os dois argumentos. Esta é uma opção de conveniência porque, ao contrário de [`process.hrtime()`](/pt/nodejs/api/process#processhrtimetime), calcular o ELU é mais complexo do que uma única subtração.

O ELU é semelhante à utilização da CPU, exceto que mede apenas as estatísticas do loop de eventos e não o uso da CPU. Representa a percentagem de tempo que o loop de eventos passou fora do fornecedor de eventos do loop de eventos (por exemplo, `epoll_wait`). Nenhum outro tempo ocioso da CPU é levado em consideração. O seguinte é um exemplo de como um processo maioritariamente ocioso terá um ELU alto.

::: code-group
```js [ESM]
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```js [CJS]
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

Embora a CPU esteja maioritariamente ociosa ao executar este script, o valor de `utilization` é `1`. Isto porque a chamada para [`child_process.spawnSync()`](/pt/nodejs/api/child_process#child_processspawnsynccommand-args-options) impede o loop de eventos de prosseguir.

Passar um objeto definido pelo utilizador em vez do resultado de uma chamada anterior para `eventLoopUtilization()` levará a um comportamento indefinido. Não é garantido que os valores de retorno reflitam qualquer estado correto do loop de eventos.


### `performance.getEntries()` {#performancegetentries}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v16.7.0 | Adicionado em: v16.7.0 |
:::

- Retorna: [\<PerformanceEntry[]\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Retorna uma lista de objetos `PerformanceEntry` em ordem cronológica em relação a `performanceEntry.startTime`. Se você estiver interessado apenas em entradas de desempenho de certos tipos ou que tenham certos nomes, consulte `performance.getEntriesByType()` e `performance.getEntriesByName()`.

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v16.7.0 | Adicionado em: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<PerformanceEntry[]\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Retorna uma lista de objetos `PerformanceEntry` em ordem cronológica em relação a `performanceEntry.startTime` cujo `performanceEntry.name` é igual a `name` e, opcionalmente, cujo `performanceEntry.entryType` é igual a `type`.

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v16.7.0 | Adicionado em: v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<PerformanceEntry[]\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Retorna uma lista de objetos `PerformanceEntry` em ordem cronológica em relação a `performanceEntry.startTime` cujo `performanceEntry.entryType` é igual a `type`.

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. O argumento name não é mais opcional. |
| v16.0.0 | Atualizado para estar em conformidade com a especificação User Timing Level 3. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Detalhes opcionais adicionais para incluir com a marcação.
    - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um timestamp opcional a ser usado como o tempo da marcação. **Padrão**: `performance.now()`.

Cria uma nova entrada `PerformanceMark` na Linha do Tempo de Desempenho. Um `PerformanceMark` é uma subclasse de `PerformanceEntry` cujo `performanceEntry.entryType` é sempre `'mark'` e cujo `performanceEntry.duration` é sempre `0`. As marcas de desempenho são usadas para marcar momentos significativos específicos na Linha do Tempo de Desempenho.

A entrada `PerformanceMark` criada é colocada na Linha do Tempo de Desempenho global e pode ser consultada com `performance.getEntries`, `performance.getEntriesByName` e `performance.getEntriesByType`. Quando a observação é realizada, as entradas devem ser limpas da Linha do Tempo de Desempenho global manualmente com `performance.clearMarks`.


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.2.0 | Adicionados os argumentos bodyInfo, responseStatus e deliveryType. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Informações de Tempo de Busca](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A URL do recurso
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do iniciador, por exemplo: 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O modo de cache deve ser uma string vazia ('') ou 'local'
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Informações do Corpo da Resposta da Busca](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de status da resposta
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O tipo de entrega. **Padrão:** `''`.

*Esta propriedade é uma extensão do Node.js. Não está disponível em navegadores Web.*

Cria uma nova entrada `PerformanceResourceTiming` na Linha do Tempo de Recursos. `PerformanceResourceTiming` é uma subclasse de `PerformanceEntry` cujo `performanceEntry.entryType` é sempre `'resource'`. Os recursos de desempenho são usados para marcar momentos na Linha do Tempo de Recursos.

A entrada `PerformanceMark` criada é colocada na Linha do Tempo de Recursos global e pode ser consultada com `performance.getEntries`, `performance.getEntriesByName` e `performance.getEntriesByType`. Quando a observação é realizada, as entradas devem ser removidas manualmente da Linha do Tempo de Desempenho global com `performance.clearResourceTimings`.


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v16.0.0 | Atualizado para estar em conformidade com a especificação User Timing Level 3. |
| v13.13.0, v12.16.3 | Torna os parâmetros `startMark` e `endMark` opcionais. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opcional.
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Detalhe opcional adicional para incluir com a medida.
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Duração entre os horários de início e fim.
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Timestamp a ser usado como o horário de término, ou uma string identificando uma marca previamente registrada.
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Timestamp a ser usado como o horário de início, ou uma string identificando uma marca previamente registrada.

- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opcional. Deve ser omitido se `startMarkOrOptions` for um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Cria uma nova entrada `PerformanceMeasure` na Linha do Tempo de Desempenho. Um `PerformanceMeasure` é uma subclasse de `PerformanceEntry` cujo `performanceEntry.entryType` é sempre `'measure'`, e cujo `performanceEntry.duration` mede o número de milissegundos decorridos desde `startMark` e `endMark`.

O argumento `startMark` pode identificar qualquer `PerformanceMark` *existente* na Linha do Tempo de Desempenho, ou *pode* identificar qualquer uma das propriedades de timestamp fornecidas pela classe `PerformanceNodeTiming`. Se o `startMark` nomeado não existir, um erro é lançado.

O argumento opcional `endMark` deve identificar qualquer `PerformanceMark` *existente* na Linha do Tempo de Desempenho ou qualquer uma das propriedades de timestamp fornecidas pela classe `PerformanceNodeTiming`. `endMark` será `performance.now()` se nenhum parâmetro for passado, caso contrário, se o `endMark` nomeado não existir, um erro será lançado.

A entrada `PerformanceMeasure` criada é colocada na Linha do Tempo de Desempenho global e pode ser consultada com `performance.getEntries`, `performance.getEntriesByName` e `performance.getEntriesByType`. Quando a observação é realizada, as entradas devem ser limpas da Linha do Tempo de Desempenho global manualmente com `performance.clearMeasures`.


### `performance.nodeTiming` {#performancenodetiming}

**Adicionado em: v8.5.0**

- [\<PerformanceNodeTiming\>](/pt/nodejs/api/perf_hooks#class-performancenodetiming)

*Esta propriedade é uma extensão do Node.js. Não está disponível em navegadores Web.*

Uma instância da classe `PerformanceNodeTiming` que fornece métricas de desempenho para marcos operacionais específicos do Node.js.

### `performance.now()` {#performancenow}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o timestamp atual de alta resolução em milissegundos, onde 0 representa o início do processo `node` atual.

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v18.8.0 | Adicionado em: v18.8.0 |
:::

Define o tamanho global do buffer de tempo de recurso de desempenho para o número especificado de objetos de entrada de desempenho do tipo "recurso".

Por padrão, o tamanho máximo do buffer é definido como 250.

### `performance.timeOrigin` {#performancetimeorigin}

**Adicionado em: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O [`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin) especifica o timestamp de alta resolução em milissegundos em que o processo `node` atual começou, medido no tempo Unix.

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.0.0 | Adicionada a opção de histograma. |
| v16.0.0 | Re-implementado para usar JavaScript puro e a capacidade de cronometrar funções assíncronas. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `histogram` [\<RecordableHistogram\>](/pt/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) Um objeto histograma criado usando `perf_hooks.createHistogram()` que registrará durações de tempo de execução em nanossegundos.
  
 

*Esta propriedade é uma extensão do Node.js. Não está disponível em navegadores Web.*

Envolve uma função dentro de uma nova função que mede o tempo de execução da função envolvida. Um `PerformanceObserver` deve ser inscrito no tipo de evento `'function'` para que os detalhes de tempo possam ser acessados.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```
:::

Se a função envolvida retornar uma promise, um manipulador finally será anexado à promise e a duração será relatada assim que o manipulador finally for invocado.


### `performance.toJSON()` {#performancetojson}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este método deve ser chamado com o objeto `performance` como receptor. |
| v16.1.0 | Adicionado em: v16.1.0 |
:::

Um objeto que é uma representação JSON do objeto `performance`. É semelhante a [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON) nos navegadores.

#### Evento: `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**Adicionado em: v18.8.0**

O evento `'resourcetimingbufferfull'` é disparado quando o buffer global de tempo de recursos de desempenho está cheio. Ajuste o tamanho do buffer de tempo de recursos com `performance.setResourceTimingBufferSize()` ou limpe o buffer com `performance.clearResourceTimings()` no listener de eventos para permitir que mais entradas sejam adicionadas ao buffer da linha do tempo de desempenho.

## Classe: `PerformanceEntry` {#class-performanceentry}

**Adicionado em: v8.5.0**

O construtor desta classe não é exposto diretamente aos usuários.

### `performanceEntry.duration` {#performanceentryduration}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceEntry` como receptor. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número total de milissegundos decorridos para esta entrada. Este valor não será significativo para todos os tipos de Entrada de Desempenho.

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceEntry` como receptor. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O tipo da entrada de desempenho. Pode ser um de:

- `'dns'` (apenas Node.js)
- `'function'` (apenas Node.js)
- `'gc'` (apenas Node.js)
- `'http2'` (apenas Node.js)
- `'http'` (apenas Node.js)
- `'mark'` (disponível na Web)
- `'measure'` (disponível na Web)
- `'net'` (apenas Node.js)
- `'node'` (apenas Node.js)
- `'resource'` (disponível na Web)


### `performanceEntry.name` {#performanceentryname}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceEntry` como receptor. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O nome da entrada de desempenho.

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceEntry` como receptor. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de alta resolução em milissegundos marcando o tempo de início da Entrada de Desempenho.

## Classe: `PerformanceMark` {#class-performancemark}

**Adicionado em: v18.2.0, v16.17.0**

- Estende: [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Expõe as marcas criadas via o método `Performance.mark()`.

### `performanceMark.detail` {#performancemarkdetail}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceMark` como receptor. |
| v16.0.0 | Adicionado em: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Detalhes adicionais especificados ao criar com o método `Performance.mark()`.

## Classe: `PerformanceMeasure` {#class-performancemeasure}

**Adicionado em: v18.2.0, v16.17.0**

- Estende: [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Expõe as medidas criadas via o método `Performance.measure()`.

O construtor desta classe não é exposto diretamente aos usuários.

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceMeasure` como receptor. |
| v16.0.0 | Adicionado em: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Detalhes adicionais especificados ao criar com o método `Performance.measure()`.


## Classe: `PerformanceNodeEntry` {#class-performancenodeentry}

**Adicionado em: v19.0.0**

- Estende: [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

*Esta classe é uma extensão do Node.js. Não está disponível em navegadores Web.*

Fornece dados de temporização detalhados do Node.js.

O construtor desta classe não é exposto diretamente aos utilizadores.

### `performanceNodeEntry.detail` {#performancenodeentrydetail}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceNodeEntry` como receptor. |
| v16.0.0 | Adicionado em: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Detalhes adicionais específicos para o `entryType`.

### `performanceNodeEntry.flags` {#performancenodeentryflags}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.0.0 | Obsoleto em tempo de execução. Agora movido para a propriedade detail quando entryType é 'gc'. |
| v13.9.0, v12.17.0 | Adicionado em: v13.9.0, v12.17.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use `performanceNodeEntry.detail` em vez disso.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando `performanceEntry.entryType` é igual a `'gc'`, a propriedade `performance.flags` contém informações adicionais sobre a operação de coleta de lixo. O valor pode ser um dos:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.0.0 | Obsoleto em tempo de execução. Agora movido para a propriedade detail quando entryType é 'gc'. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use `performanceNodeEntry.detail` em vez disso.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Quando `performanceEntry.entryType` é igual a `'gc'`, a propriedade `performance.kind` identifica o tipo de operação de coleta de lixo que ocorreu. O valor pode ser um dos:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### Detalhes da Coleta de Lixo ('gc') {#garbage-collection-gc-details}

Quando `performanceEntry.type` é igual a `'gc'`, a propriedade `performanceNodeEntry.detail` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) com duas propriedades:

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um de:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`

 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um de:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

 

### Detalhes HTTP ('http') {#http-http-details}

Quando `performanceEntry.type` é igual a `'http'`, a propriedade `performanceNodeEntry.detail` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo informações adicionais.

Se `performanceEntry.name` é igual a `HttpClient`, o `detail` conterá as seguintes propriedades: `req`, `res`. E a propriedade `req` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo `method`, `url`, `headers`, a propriedade `res` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo `statusCode`, `statusMessage`, `headers`.

Se `performanceEntry.name` é igual a `HttpRequest`, o `detail` conterá as seguintes propriedades: `req`, `res`. E a propriedade `req` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo `method`, `url`, `headers`, a propriedade `res` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo `statusCode`, `statusMessage`, `headers`.

Isso pode adicionar uma sobrecarga de memória adicional e só deve ser usado para fins de diagnóstico, não sendo deixado ligado na produção por padrão.


### Detalhes do HTTP/2 ('http2') {#http/2-http2-details}

Quando `performanceEntry.type` é igual a `'http2'`, a propriedade `performanceNodeEntry.detail` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo informações adicionais de desempenho.

Se `performanceEntry.name` for igual a `Http2Stream`, o `detail` conterá as seguintes propriedades:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes do frame `DATA` recebidos para este `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes do frame `DATA` enviados para este `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O identificador do `Http2Stream` associado.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos decorridos entre o `startTime` do `PerformanceEntry` e a recepção do primeiro frame `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos decorridos entre o `startTime` do `PerformanceEntry` e o envio do primeiro frame `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos decorridos entre o `startTime` do `PerformanceEntry` e a recepção do primeiro cabeçalho.

Se `performanceEntry.name` for igual a `Http2Session`, o `detail` conterá as seguintes propriedades:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes recebidos para esta `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes enviados para esta `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de frames HTTP/2 recebidos pela `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de frames HTTP/2 enviados pela `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número máximo de streams abertos simultaneamente durante o tempo de vida da `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos decorridos desde a transmissão de um frame `PING` e a recepção de seu reconhecimento. Presente apenas se um frame `PING` foi enviado na `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A duração média (em milissegundos) para todas as instâncias `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de instâncias `Http2Stream` processadas pela `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'server'` ou `'client'` para identificar o tipo de `Http2Session`.


### Detalhes do Timerify ('function') {#timerify-function-details}

Quando `performanceEntry.type` é igual a `'function'`, a propriedade `performanceNodeEntry.detail` será um [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) listando os argumentos de entrada para a função cronometrada.

### Detalhes do Net ('net') {#net-net-details}

Quando `performanceEntry.type` é igual a `'net'`, a propriedade `performanceNodeEntry.detail` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo informações adicionais.

Se `performanceEntry.name` for igual a `connect`, o `detail` conterá as seguintes propriedades: `host`, `port`.

### Detalhes do DNS ('dns') {#dns-dns-details}

Quando `performanceEntry.type` é igual a `'dns'`, a propriedade `performanceNodeEntry.detail` será um [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) contendo informações adicionais.

Se `performanceEntry.name` for igual a `lookup`, o `detail` conterá as seguintes propriedades: `hostname`, `family`, `hints`, `verbatim`, `addresses`.

Se `performanceEntry.name` for igual a `lookupService`, o `detail` conterá as seguintes propriedades: `host`, `port`, `hostname`, `service`.

Se `performanceEntry.name` for igual a `queryxxx` ou `getHostByAddr`, o `detail` conterá as seguintes propriedades: `host`, `ttl`, `result`. O valor de `result` é o mesmo que o resultado de `queryxxx` ou `getHostByAddr`.

## Classe: `PerformanceNodeTiming` {#class-performancenodetiming}

**Adicionado em: v8.5.0**

- Estende: [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

*Esta propriedade é uma extensão do Node.js. Não está disponível em navegadores da Web.*

Fornece detalhes de tempo para o próprio Node.js. O construtor desta classe não é exposto aos usuários.

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**Adicionado em: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução em que o processo Node.js concluiu o bootstrapping. Se o bootstrapping ainda não terminou, a propriedade tem o valor de -1.


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**Adicionado em: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução em que o ambiente Node.js foi inicializado.

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**Adicionado em: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução da quantidade de tempo que o loop de eventos ficou ocioso dentro do provedor de eventos do loop de eventos (por exemplo, `epoll_wait`). Isso não leva em consideração o uso da CPU. Se o loop de eventos ainda não foi iniciado (por exemplo, no primeiro tick do script principal), a propriedade tem o valor de 0.

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**Adicionado em: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução em que o loop de eventos do Node.js foi encerrado. Se o loop de eventos ainda não foi encerrado, a propriedade tem o valor de -1. Ele só pode ter um valor diferente de -1 em um manipulador do evento [`'exit'`](/pt/nodejs/api/process#event-exit).

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**Adicionado em: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução em que o loop de eventos do Node.js foi iniciado. Se o loop de eventos ainda não foi iniciado (por exemplo, no primeiro tick do script principal), a propriedade tem o valor de -1.

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**Adicionado em: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução em que o processo Node.js foi inicializado.

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**Adicionado em: v22.8.0, v20.18.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de iterações do loop de eventos.
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de eventos que foram processados pelo manipulador de eventos.
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Número de eventos que estavam esperando para serem processados quando o provedor de eventos foi chamado.

Esta é uma wrapper para a função `uv_metrics_info`. Ela retorna o conjunto atual de métricas do loop de eventos.

Recomenda-se usar esta propriedade dentro de uma função cuja execução foi agendada usando `setImmediate` para evitar coletar métricas antes de terminar todas as operações agendadas durante a iteração atual do loop.

::: code-group
```js [CJS]
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```js [ESM]
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```
:::


### `performanceNodeTiming.v8Start` {#performancenodetimingv8start}

**Adicionado em: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução no qual a plataforma V8 foi inicializada.

## Classe: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**Adicionado em: v18.2.0, v16.17.0**

- Estende: [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Fornece dados de tempo de rede detalhados sobre o carregamento dos recursos de um aplicativo.

O construtor desta classe não é exposto diretamente aos usuários.

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução imediatamente antes de despachar a requisição `fetch`. Se o recurso não for interceptado por um worker, a propriedade sempre retornará 0.

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução que representa a hora de início da busca que inicia o redirecionamento.

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução que será criado imediatamente após receber o último byte da resposta do último redirecionamento.


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução imediatamente antes do Node.js começar a buscar o recurso.

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução imediatamente antes do Node.js iniciar a pesquisa de nome de domínio para o recurso.

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução representando o tempo imediatamente após o Node.js terminar a pesquisa de nome de domínio para o recurso.

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução representando o tempo imediatamente antes do Node.js começar a estabelecer a conexão com o servidor para recuperar o recurso.


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | O getter desta propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução que representa o tempo imediatamente após o Node.js terminar de estabelecer a conexão com o servidor para recuperar o recurso.

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | O getter desta propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução que representa o tempo imediatamente antes do Node.js iniciar o processo de handshake para proteger a conexão atual.

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | O getter desta propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução que representa o tempo imediatamente antes do Node.js receber o primeiro byte da resposta do servidor.

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.0.0 | O getter desta propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O timestamp de milissegundos de alta resolução que representa o tempo imediatamente após o Node.js receber o último byte do recurso ou imediatamente antes da conexão de transporte ser fechada, o que ocorrer primeiro.


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}

::: info [Histórico]
| Versão   | Mudanças                                                                                            |
| :------- | :--------------------------------------------------------------------------------------------------- |
| v19.0.0  | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0                                                                       |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Um número representando o tamanho (em octetos) do recurso buscado. O tamanho inclui os campos do cabeçalho de resposta mais o corpo do payload de resposta.

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}

::: info [Histórico]
| Versão   | Mudanças                                                                                            |
| :------- | :--------------------------------------------------------------------------------------------------- |
| v19.0.0  | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0                                                                       |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Um número representando o tamanho (em octetos) recebido da busca (HTTP ou cache), do corpo do payload, antes de remover qualquer codificação de conteúdo aplicada.

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}

::: info [Histórico]
| Versão   | Mudanças                                                                                            |
| :------- | :--------------------------------------------------------------------------------------------------- |
| v19.0.0  | Este getter de propriedade deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0                                                                       |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Um número representando o tamanho (em octetos) recebido da busca (HTTP ou cache), do corpo da mensagem, após remover qualquer codificação de conteúdo aplicada.

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}

::: info [Histórico]
| Versão   | Mudanças                                                                                           |
| :------- | :-------------------------------------------------------------------------------------------------- |
| v19.0.0  | Este método deve ser chamado com o objeto `PerformanceResourceTiming` como receptor. |
| v18.2.0, v16.17.0 | Adicionado em: v18.2.0, v16.17.0                                                                       |
:::

Retorna um `objeto` que é a representação JSON do objeto `PerformanceResourceTiming`

## Classe: `PerformanceObserver` {#class-performanceobserver}

**Adicionado em: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**Adicionado em: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Obtém os tipos suportados.


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `list` [\<PerformanceObserverEntryList\>](/pt/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/pt/nodejs/api/perf_hooks#class-performanceobserver)
  
 

Objetos `PerformanceObserver` fornecem notificações quando novas instâncias de `PerformanceEntry` são adicionadas à Linha do Tempo de Desempenho.



::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
:::

Como as instâncias de `PerformanceObserver` introduzem sua própria sobrecarga de desempenho adicional, as instâncias não devem ser deixadas inscritas para notificações indefinidamente. Os usuários devem desconectar os observadores assim que não forem mais necessários.

O `callback` é invocado quando um `PerformanceObserver` é notificado sobre novas instâncias de `PerformanceEntry`. O callback recebe uma instância de `PerformanceObserverEntryList` e uma referência ao `PerformanceObserver`.

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**Adicionado em: v8.5.0**

Desconecta a instância de `PerformanceObserver` de todas as notificações.


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.7.0 | Atualizado para estar em conformidade com o Performance Timeline Level 2. A opção buffered foi readicionada. |
| v16.0.0 | Atualizado para estar em conformidade com o User Timing Level 3. A opção buffered foi removida. |
| v8.5.0 | Adicionado em: v8.5.0 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um único tipo de [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry). Não deve ser fornecido se `entryTypes` já estiver especificado.
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um array de strings identificando os tipos de instâncias [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry) nas quais o observador está interessado. Se não for fornecido, um erro será lançado.
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se verdadeiro, o callback do observador é chamado com uma lista global de entradas `PerformanceEntry` armazenadas em buffer. Se falso, apenas as `PerformanceEntry`s criadas após o ponto no tempo são enviadas ao callback do observador. **Padrão:** `false`.

Assina a instância [\<PerformanceObserver\>](/pt/nodejs/api/perf_hooks#class-performanceobserver) para notificações de novas instâncias [\<PerformanceEntry\>](/pt/nodejs/api/perf_hooks#class-performanceentry) identificadas por `options.entryTypes` ou `options.type`:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // Chamado uma vez assincronamente. `list` contém três itens.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // Chamado uma vez assincronamente. `list` contém três itens.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**Adicionado em: v16.0.0**

- Retorna: [\<PerformanceEntry[]\>](/pt/nodejs/api/perf_hooks#class-performanceentry) Lista atual de entradas armazenadas no observador de desempenho, esvaziando-o.

## Classe: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**Adicionado em: v8.5.0**

A classe `PerformanceObserverEntryList` é usada para fornecer acesso às instâncias `PerformanceEntry` passadas para um `PerformanceObserver`. O construtor desta classe não é exposto aos usuários.

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**Adicionado em: v8.5.0**

- Retorna: [\<PerformanceEntry[]\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Retorna uma lista de objetos `PerformanceEntry` em ordem cronológica com relação a `performanceEntry.startTime`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByName(name[, type])` {#performanceobserverentrylistgetentriesbynamename-type}

**Adicionado em: v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<PerformanceEntry[]\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Retorna uma lista de objetos `PerformanceEntry` em ordem cronológica com relação a `performanceEntry.startTime` cujo `performanceEntry.name` é igual a `name`, e opcionalmente, cujo `performanceEntry.entryType` é igual a `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```
:::


### `performanceObserverEntryList.getEntriesByType(type)` {#performanceobserverentrylistgetentriesbytypetype}

**Adicionado em: v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<PerformanceEntry[]\>](/pt/nodejs/api/perf_hooks#class-performanceentry)

Retorna uma lista de objetos `PerformanceEntry` em ordem cronológica com relação a `performanceEntry.startTime` cujo `performanceEntry.entryType` é igual a `type`.

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```js [CJS]
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```
:::

## `perf_hooks.createHistogram([options])` {#perf_hookscreatehistogramoptions}

**Adicionado em: v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `lowest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) O menor valor discernível. Deve ser um valor inteiro maior que 0. **Padrão:** `1`.
    - `highest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) O valor mais alto registrável. Deve ser um valor inteiro igual ou maior que duas vezes `lowest`. **Padrão:** `Number.MAX_SAFE_INTEGER`.
    - `figures` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de dígitos de precisão. Deve ser um número entre `1` e `5`. **Padrão:** `3`.


- Retorna: [\<RecordableHistogram\>](/pt/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Retorna um [\<RecordableHistogram\>](/pt/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram).


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**Adicionado em: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A taxa de amostragem em milissegundos. Deve ser maior que zero. **Padrão:** `10`.


- Retorna: [\<IntervalHistogram\>](/pt/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*Esta propriedade é uma extensão do Node.js. Não está disponível em navegadores da Web.*

Cria um objeto `IntervalHistogram` que amostra e reporta o atraso do loop de eventos ao longo do tempo. Os atrasos serão reportados em nanossegundos.

Usar um timer para detectar o atraso aproximado do loop de eventos funciona porque a execução dos timers está vinculada especificamente ao ciclo de vida do loop de eventos do libuv. Ou seja, um atraso no loop causará um atraso na execução do timer, e esses atrasos são especificamente o que esta API se destina a detectar.

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Faça alguma coisa.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```js [CJS]
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Faça alguma coisa.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```
:::

## Classe: `Histogram` {#class-histogram}

**Adicionado em: v11.10.0**

### `histogram.count` {#histogramcount}

**Adicionado em: v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número de amostras registradas pelo histograma.

### `histogram.countBigInt` {#histogramcountbigint}

**Adicionado em: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O número de amostras registradas pelo histograma.


### `histogram.exceeds` {#histogramexceeds}

**Adicionado em: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O número de vezes que o atraso do loop de eventos excedeu o limite máximo de 1 hora de atraso do loop de eventos.

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**Adicionado em: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O número de vezes que o atraso do loop de eventos excedeu o limite máximo de 1 hora de atraso do loop de eventos.

### `histogram.max` {#histogrammax}

**Adicionado em: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O atraso máximo gravado no loop de eventos.

### `histogram.maxBigInt` {#histogrammaxbigint}

**Adicionado em: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O atraso máximo gravado no loop de eventos.

### `histogram.mean` {#histogrammean}

**Adicionado em: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A média dos atrasos gravados no loop de eventos.

### `histogram.min` {#histogrammin}

**Adicionado em: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O atraso mínimo gravado no loop de eventos.

### `histogram.minBigInt` {#histogramminbigint}

**Adicionado em: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

O atraso mínimo gravado no loop de eventos.

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**Adicionado em: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um valor de percentil no intervalo (0, 100].
- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o valor no percentil fornecido.

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**Adicionado em: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um valor de percentil no intervalo (0, 100].
- Retorna: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Retorna o valor no percentil fornecido.


### `histogram.percentiles` {#histogrampercentiles}

**Adicionado em: v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Retorna um objeto `Map` detalhando a distribuição de percentis acumulada.

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**Adicionado em: v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Retorna um objeto `Map` detalhando a distribuição de percentis acumulada.

### `histogram.reset()` {#histogramreset}

**Adicionado em: v11.10.0**

Redefine os dados coletados do histograma.

### `histogram.stddev` {#histogramstddev}

**Adicionado em: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

O desvio padrão dos atrasos do loop de eventos registrados.

## Classe: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

Um `Histogram` que é atualizado periodicamente em um determinado intervalo.

### `histogram.disable()` {#histogramdisable}

**Adicionado em: v11.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Desativa o temporizador de intervalo de atualização. Retorna `true` se o temporizador foi interrompido, `false` se já estava interrompido.

### `histogram.enable()` {#histogramenable}

**Adicionado em: v11.10.0**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Ativa o temporizador de intervalo de atualização. Retorna `true` se o temporizador foi iniciado, `false` se já estava iniciado.

### Clonando um `IntervalHistogram` {#cloning-an-intervalhistogram}

Instâncias de [\<IntervalHistogram\>](/pt/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) podem ser clonadas via [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport). Na extremidade receptora, o histograma é clonado como um objeto [\<Histogram\>](/pt/nodejs/api/perf_hooks#class-histogram) simples que não implementa os métodos `enable()` e `disable()`.

## Classe: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**Adicionado em: v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**Adicionado em: v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/pt/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Adiciona os valores de `other` a este histograma.


### `histogram.record(val)` {#histogramrecordval}

**Adicionado em: v15.9.0, v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) O valor a ser registrado no histograma.

### `histogram.recordDelta()` {#histogramrecorddelta}

**Adicionado em: v15.9.0, v14.18.0**

Calcula a quantidade de tempo (em nanossegundos) que se passou desde a chamada anterior para `recordDelta()` e registra essa quantidade no histograma.

## Exemplos {#examples}

### Medindo a duração de operações assíncronas {#measuring-the-duration-of-async-operations}

O exemplo a seguir usa as APIs [Hooks Assíncronos](/pt/nodejs/api/async_hooks) e Performance para medir a duração real de uma operação de Timeout (incluindo a quantidade de tempo que levou para executar o callback).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```js [CJS]
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```
:::


### Medindo quanto tempo leva para carregar dependências {#measuring-how-long-it-takes-to-load-dependencies}

O exemplo a seguir mede a duração das operações `require()` para carregar dependências:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Ativar o observador
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```js [CJS]
'use strict';
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey patch na função require
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Ativar o observador
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```
:::

### Medindo quanto tempo leva um round-trip HTTP {#measuring-how-long-one-http-round-trip-takes}

O exemplo a seguir é usado para rastrear o tempo gasto pelo cliente HTTP (`OutgoingMessage`) e pela requisição HTTP (`IncomingMessage`). Para o cliente HTTP, significa o intervalo de tempo entre o início da requisição e o recebimento da resposta, e para a requisição HTTP, significa o intervalo de tempo entre o recebimento da requisição e o envio da resposta:

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```
:::


### Medindo quanto tempo o `net.connect` (apenas para TCP) leva quando a conexão é bem-sucedida {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```
:::

### Medindo quanto tempo o DNS leva quando a requisição é bem-sucedida {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

::: code-group
```js [ESM]
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```js [CJS]
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
:::

