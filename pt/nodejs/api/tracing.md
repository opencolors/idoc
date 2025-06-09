---
title: Eventos de Rastreio do Node.js
description: Documentação sobre como usar a API de eventos de rastreio do Node.js para perfilamento de desempenho e depuração.
head:
  - - meta
    - name: og:title
      content: Eventos de Rastreio do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentação sobre como usar a API de eventos de rastreio do Node.js para perfilamento de desempenho e depuração.
  - - meta
    - name: twitter:title
      content: Eventos de Rastreio do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentação sobre como usar a API de eventos de rastreio do Node.js para perfilamento de desempenho e depuração.
---


# Eventos de rastreamento {#trace-events}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

**Código Fonte:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

O módulo `node:trace_events` fornece um mecanismo para centralizar informações de rastreamento geradas pelo V8, núcleo do Node.js e código do espaço do usuário.

O rastreamento pode ser ativado com o sinalizador de linha de comando `--trace-event-categories` ou usando o módulo `node:trace_events`. O sinalizador `--trace-event-categories` aceita uma lista de nomes de categorias separados por vírgulas.

As categorias disponíveis são:

- `node`: Um espaço reservado vazio.
- `node.async_hooks`: Ativa a captura de dados de rastreamento detalhados de [`async_hooks`](/pt/nodejs/api/async_hooks). Os eventos de [`async_hooks`](/pt/nodejs/api/async_hooks) têm um `asyncId` único e uma propriedade especial `triggerId` `triggerAsyncId`.
- `node.bootstrap`: Ativa a captura de marcos de bootstrap do Node.js.
- `node.console`: Ativa a captura da saída de `console.time()` e `console.count()`.
- `node.threadpoolwork.sync`: Ativa a captura de dados de rastreamento para operações síncronas do pool de threads, como `blob`, `zlib`, `crypto` e `node_api`.
- `node.threadpoolwork.async`: Ativa a captura de dados de rastreamento para operações assíncronas do pool de threads, como `blob`, `zlib`, `crypto` e `node_api`.
- `node.dns.native`: Ativa a captura de dados de rastreamento para consultas DNS.
- `node.net.native`: Ativa a captura de dados de rastreamento para rede.
- `node.environment`: Ativa a captura de marcos do Ambiente Node.js.
- `node.fs.sync`: Ativa a captura de dados de rastreamento para métodos síncronos do sistema de arquivos.
- `node.fs_dir.sync`: Ativa a captura de dados de rastreamento para métodos síncronos de diretório do sistema de arquivos.
- `node.fs.async`: Ativa a captura de dados de rastreamento para métodos assíncronos do sistema de arquivos.
- `node.fs_dir.async`: Ativa a captura de dados de rastreamento para métodos assíncronos de diretório do sistema de arquivos.
- `node.perf`: Ativa a captura de medições da [API de Desempenho](/pt/nodejs/api/perf_hooks).
    - `node.perf.usertiming`: Ativa a captura apenas de medidas e marcas de User Timing da API de Desempenho.
    - `node.perf.timerify`: Ativa a captura apenas de medições timerify da API de Desempenho.

- `node.promises.rejections`: Ativa a captura de dados de rastreamento que rastreiam o número de rejeições de Promise não tratadas e tratadas após rejeições.
- `node.vm.script`: Ativa a captura de dados de rastreamento para os métodos `runInNewContext()`, `runInContext()` e `runInThisContext()` do módulo `node:vm`.
- `v8`: Os eventos do [V8](/pt/nodejs/api/v8) estão relacionados a GC, compilação e execução.
- `node.http`: Ativa a captura de dados de rastreamento para solicitação/resposta http.
- `node.module_timer`: Ativa a captura de dados de rastreamento para carregamento de Módulos CJS.

Por padrão, as categorias `node`, `node.async_hooks` e `v8` estão ativadas.

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
Versões anteriores do Node.js exigiam o uso do sinalizador `--trace-events-enabled` para ativar os eventos de rastreamento. Este requisito foi removido. No entanto, o sinalizador `--trace-events-enabled` *ainda pode* ser usado e ativará as categorias de evento de rastreamento `node`, `node.async_hooks` e `v8` por padrão.

```bash [BASH]
node --trace-events-enabled

# é equivalente a {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
Alternativamente, os eventos de rastreamento podem ser ativados usando o módulo `node:trace_events`:

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // Ativa a captura de eventos de rastreamento para a categoria 'node.perf'

// fazer o trabalho

tracing.disable();  // Desativa a captura de eventos de rastreamento para a categoria 'node.perf'
```
Executar o Node.js com o rastreamento ativado produzirá arquivos de log que podem ser abertos na aba [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) do Chrome.

O arquivo de log é chamado por padrão de `node_trace.${rotation}.log`, onde `${rotation}` é um ID de rotação de log incremental. O padrão do caminho do arquivo pode ser especificado com `--trace-event-file-pattern` que aceita uma string de modelo que suporta `${rotation}` e `${pid}`:

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
Para garantir que o arquivo de log seja gerado corretamente após eventos de sinal como `SIGINT`, `SIGTERM` ou `SIGBREAK`, certifique-se de ter os manipuladores apropriados em seu código, como:

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // Ou código de saída aplicável, dependendo do SO e do sinal
});
```
O sistema de rastreamento usa a mesma fonte de tempo usada por `process.hrtime()`. No entanto, os carimbos de data/hora do evento de rastreamento são expressos em microssegundos, ao contrário de `process.hrtime()` que retorna nanossegundos.

Os recursos deste módulo não estão disponíveis nas threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker).


## O módulo `node:trace_events` {#the-nodetrace_events-module}

**Adicionado em: v10.0.0**

### Objeto `Tracing` {#tracing-object}

**Adicionado em: v10.0.0**

O objeto `Tracing` é usado para ativar ou desativar o rastreamento para conjuntos de categorias. As instâncias são criadas usando o método `trace_events.createTracing()`.

Quando criado, o objeto `Tracing` é desativado. Chamar o método `tracing.enable()` adiciona as categorias ao conjunto de categorias de eventos de rastreamento ativadas. Chamar `tracing.disable()` removerá as categorias do conjunto de categorias de eventos de rastreamento ativadas.

#### `tracing.categories` {#tracingcategories}

**Adicionado em: v10.0.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uma lista separada por vírgulas das categorias de eventos de rastreamento cobertas por este objeto `Tracing`.

#### `tracing.disable()` {#tracingdisable}

**Adicionado em: v10.0.0**

Desativa este objeto `Tracing`.

Apenas as categorias de eventos de rastreamento *não* cobertas por outros objetos `Tracing` ativados e *não* especificadas pela flag `--trace-event-categories` serão desativadas.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// Imprime 'node,node.perf,v8'
console.log(trace_events.getEnabledCategories());

t2.disable(); // Desativará apenas a emissão da categoria 'node.perf'

// Imprime 'node,v8'
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**Adicionado em: v10.0.0**

Ativa este objeto `Tracing` para o conjunto de categorias cobertas pelo objeto `Tracing`.

#### `tracing.enabled` {#tracingenabled}

**Adicionado em: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` somente se o objeto `Tracing` foi ativado.

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**Adicionado em: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um array de nomes de categorias de rastreamento. Os valores incluídos no array são convertidos em string quando possível. Um erro será lançado se o valor não puder ser convertido.
  
 
- Retorna: [\<Tracing\>](/pt/nodejs/api/tracing#tracing-object).

Cria e retorna um objeto `Tracing` para o conjunto fornecido de `categories`.

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// faz algo
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**Adicionado em: v10.0.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna uma lista separada por vírgulas de todas as categorias de eventos de rastreamento atualmente habilitadas. O conjunto atual de categorias de eventos de rastreamento habilitadas é determinado pela *união* de todos os objetos `Tracing` atualmente habilitados e quaisquer categorias habilitadas usando a flag `--trace-event-categories`.

Dado o arquivo `test.js` abaixo, o comando `node --trace-event-categories node.perf test.js` imprimirá `'node.async_hooks,node.perf'` no console.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## Exemplos {#examples}

### Coletar dados de eventos de rastreamento por meio do inspetor {#collect-trace-events-data-by-inspector}

```js [ESM]
'use strict';

const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // done
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // do something
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```
