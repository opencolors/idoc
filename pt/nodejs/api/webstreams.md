---
title: API de Streams Web do Node.js
description: Documentação da API de Streams Web no Node.js, detalhando como trabalhar com streams para manipulação eficiente de dados, incluindo streams legíveis, graváveis e de transformação.
head:
  - - meta
    - name: og:title
      content: API de Streams Web do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Documentação da API de Streams Web no Node.js, detalhando como trabalhar com streams para manipulação eficiente de dados, incluindo streams legíveis, graváveis e de transformação.
  - - meta
    - name: twitter:title
      content: API de Streams Web do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Documentação da API de Streams Web no Node.js, detalhando como trabalhar com streams para manipulação eficiente de dados, incluindo streams legíveis, graváveis e de transformação.
---


# API Web Streams {#web-streams-api}


::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v21.0.0 | Não é mais experimental. |
| v18.0.0 | O uso desta API não emite mais um aviso de tempo de execução. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Uma implementação do [Padrão WHATWG Streams](https://streams.spec.whatwg.org/).

## Visão geral {#overview}

O [Padrão WHATWG Streams](https://streams.spec.whatwg.org/) (ou "web streams") define uma API para lidar com dados de streaming. É semelhante à API [Streams](/pt/nodejs/api/stream) do Node.js, mas surgiu mais tarde e se tornou a API "padrão" para streaming de dados em muitos ambientes JavaScript.

Existem três tipos principais de objetos:

- `ReadableStream` - Representa uma fonte de dados de streaming.
- `WritableStream` - Representa um destino para dados de streaming.
- `TransformStream` - Representa um algoritmo para transformar dados de streaming.

### Exemplo `ReadableStream` {#example-readablestream}

Este exemplo cria um `ReadableStream` simples que envia o timestamp `performance.now()` atual uma vez por segundo para sempre. Um iterável assíncrono é usado para ler os dados do stream.

::: code-group
```js [ESM]
import {
  ReadableStream,
} from 'node:stream/web';

import {
  setInterval as every,
} from 'node:timers/promises';

import {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

for await (const value of stream)
  console.log(value);
```

```js [CJS]
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```
:::


## API {#api}

### Classe: `ReadableStream` {#class-readablestream}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**Adicionado em: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é invocada imediatamente quando o `ReadableStream` é criado.
    - `controller` [\<ReadableStreamDefaultController\>](/pt/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/pt/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Retorna: `undefined` ou uma promise resolvida com `undefined`.
  
 
    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é chamada repetidamente quando a fila interna do `ReadableStream` não está cheia. A operação pode ser síncrona ou assíncrona. Se assíncrona, a função não será chamada novamente até que a promise retornada anteriormente seja resolvida.
    - `controller` [\<ReadableStreamDefaultController\>](/pt/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/pt/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Retorna: Uma promise resolvida com `undefined`.
  
 
    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é chamada quando o `ReadableStream` é cancelado.
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: Uma promise resolvida com `undefined`.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'bytes'` ou `undefined`.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Usado apenas quando `type` é igual a `'bytes'`. Quando definido com um valor diferente de zero, um buffer de visualização é alocado automaticamente para `ReadableByteStreamController.byobRequest`. Quando não definido, deve-se usar as filas internas do stream para transferir dados através do leitor padrão `ReadableStreamDefaultReader`.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo da fila interna antes que a contrapressão seja aplicada.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário usada para identificar o tamanho de cada pedaço de dados.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `readableStream.locked` {#readablestreamlocked}

**Adicionado em: v16.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Definido como `true` se houver um leitor ativo para este [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream).

A propriedade `readableStream.locked` é `false` por padrão e é alternada para `true` enquanto houver um leitor ativo consumindo os dados do fluxo.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**Adicionado em: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: Uma promise fulfilled com `undefined` assim que o cancelamento for concluído.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**Adicionado em: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` ou `undefined`
  
 
- Retorna: [\<ReadableStreamDefaultReader\>](/pt/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/pt/nodejs/api/webstreams#class-readablestreambyobreader)



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

const stream = new ReadableStream();

const reader = stream.getReader();

console.log(await reader.read());
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

const stream = new ReadableStream();

const reader = stream.getReader();

reader.read().then(console.log);
```
:::

Faz com que `readableStream.locked` seja `true`.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**Adicionado em: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `readable` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) O `ReadableStream` para o qual `transform.writable` enviará os dados potencialmente modificados que recebe deste `ReadableStream`.
    - `writable` [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) O `WritableStream` para o qual os dados deste `ReadableStream` serão gravados.
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, erros neste `ReadableStream` não farão com que `transform.writable` seja abortado.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, erros no destino `transform.writable` não fazem com que este `ReadableStream` seja cancelado.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, fechar este `ReadableStream` não faz com que `transform.writable` seja fechado.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite que a transferência de dados seja cancelada usando um [\<AbortController\>](/pt/nodejs/api/globals#class-abortcontroller).
  
 
- Retorna: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) De `transform.readable`.

Conecta este [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) ao par de [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) e [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) fornecido no argumento `transform` de forma que os dados deste [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) sejam gravados em `transform.writable`, possivelmente transformados, e então enviados para `transform.readable`. Uma vez que o pipeline é configurado, `transform.readable` é retornado.

Faz com que `readableStream.locked` seja `true` enquanto a operação de pipe está ativa.



::: code-group
```js [ESM]
import {
  ReadableStream,
  TransformStream,
} from 'node:stream/web';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

for await (const chunk of transformedStream)
  console.log(chunk);
  // Prints: A
```

```js [CJS]
const {
  ReadableStream,
  TransformStream,
} = require('node:stream/web');

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

(async () => {
  for await (const chunk of transformedStream)
    console.log(chunk);
    // Prints: A
})();
```
:::


#### `readableStream.pipeTo(destination[, options])` {#readablestreampipetodestination-options}

**Adicionado em: v16.5.0**

- `destination` [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) Um [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) para o qual os dados deste `ReadableStream` serão gravados.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, erros neste `ReadableStream` não farão com que `destination` seja abortado.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, erros no `destination` não farão com que este `ReadableStream` seja cancelado.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, fechar este `ReadableStream` não faz com que `destination` seja fechado.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite que a transferência de dados seja cancelada usando um [\<AbortController\>](/pt/nodejs/api/globals#class-abortcontroller).


- Retorna: Uma promessa cumprida com `undefined`

Faz com que `readableStream.locked` seja `true` enquanto a operação de pipe estiver ativa.

#### `readableStream.tee()` {#readablestreamtee}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.10.0, v16.18.0 | Suporte para dividir um fluxo de bytes legível. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

- Retorna: [\<ReadableStream[]\>](/pt/nodejs/api/webstreams#class-readablestream)

Retorna um par de novas instâncias de [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) para as quais os dados deste `ReadableStream` serão encaminhados. Cada um receberá os mesmos dados.

Faz com que `readableStream.locked` seja `true`.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Adicionado em: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, impede que o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) seja fechado quando o iterador assíncrono termina abruptamente. **Padrão**: `false`.



Cria e retorna um iterador assíncrono utilizável para consumir os dados deste `ReadableStream`.

Faz com que `readableStream.locked` seja `true` enquanto o iterador assíncrono estiver ativo.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### Iteração Assíncrona {#async-iteration}

O objeto [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) suporta o protocolo de iterador assíncrono usando a sintaxe `for await`.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
O iterador assíncrono consumirá o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) até que ele termine.

Por padrão, se o iterador assíncrono sair prematuramente (via `break`, `return` ou `throw`), o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) será fechado. Para impedir o fechamento automático do [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream), use o método `readableStream.values()` para adquirir o iterador assíncrono e defina a opção `preventCancel` como `true`.

O [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) não deve ser bloqueado (ou seja, não deve ter um leitor ativo existente). Durante a iteração assíncrona, o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) será bloqueado.

#### Transferindo com `postMessage()` {#transferring-with-postmessage}

Uma instância de [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) pode ser transferida usando um [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new ReadableStream(getReadableSourceSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getReader().read().then((chunk) => {
    console.log(chunk);
  });
};

port2.postMessage(stream, [stream]);
```
### `ReadableStream.from(iterable)` {#readablestreamfromiterable}

**Adicionado em: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Objeto implementando o protocolo iterável `Symbol.asyncIterator` ou `Symbol.iterator`.

Um método utilitário que cria um novo [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) a partir de um iterável.



::: code-group
```js [ESM]
import { ReadableStream } from 'node:stream/web';

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const stream = ReadableStream.from(asyncIterableGenerator());

for await (const chunk of stream)
  console.log(chunk); // Prints: 'a', 'b', 'c'
```

```js [CJS]
const { ReadableStream } = require('node:stream/web');

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

(async () => {
  const stream = ReadableStream.from(asyncIterableGenerator());

  for await (const chunk of stream)
    console.log(chunk); // Prints: 'a', 'b', 'c'
})();
```
:::


### Classe: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [Histórico]
| Versão  | Mudanças                                                                  |
| :-------- | :------------------------------------------------------------------------ |
| v18.0.0   | Esta classe agora está exposta no objeto global.                           |
| v16.5.0   | Adicionado em: v16.5.0                                                    |
:::

Por padrão, chamar `readableStream.getReader()` sem argumentos retornará uma instância de `ReadableStreamDefaultReader`. O leitor padrão trata os pedaços de dados passados através do stream como valores opacos, o que permite que o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) trabalhe geralmente com qualquer valor JavaScript.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**Adicionado em: v16.5.0**

- `stream` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

Cria um novo [\<ReadableStreamDefaultReader\>](/pt/nodejs/api/webstreams#class-readablestreamdefaultreader) que está bloqueado para o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) fornecido.

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**Adicionado em: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: Uma promise resolvida com `undefined`.

Cancela o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) e retorna uma promise que é resolvida quando o stream subjacente foi cancelado.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**Adicionado em: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumprida com `undefined` quando o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) associado é fechado ou rejeitado se o stream apresentar erros ou o bloqueio do leitor for liberado antes que o stream termine de fechar.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**Adicionado em: v16.5.0**

- Retorna: Uma promise resolvida com um objeto:
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Solicita o próximo pedaço de dados do [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) subjacente e retorna uma promise que é resolvida com os dados assim que estiverem disponíveis.


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Adicionado em: v16.5.0**

Libera o bloqueio deste leitor no [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) subjacente.

### Classe: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

O `ReadableStreamBYOBReader` é um consumidor alternativo para [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)s orientados a bytes (aqueles que são criados com `underlyingSource.type` definido como `'bytes'` quando o `ReadableStream` foi criado).

O `BYOB` é uma abreviação de "bring your own buffer" (traga seu próprio buffer). Este é um padrão que permite uma leitura mais eficiente de dados orientados a bytes que evita cópias desnecessárias.

```js [ESM]
import {
  open,
} from 'node:fs/promises';

import {
  ReadableStream,
} from 'node:stream/web';

import { Buffer } from 'node:buffer';

class Source {
  type = 'bytes';
  autoAllocateChunkSize = 1024;

  async start(controller) {
    this.file = await open(new URL(import.meta.url));
    this.controller = controller;
  }

  async pull(controller) {
    const view = controller.byobRequest?.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength,
    });

    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    controller.byobRequest.respond(bytesRead);
  }
}

const stream = new ReadableStream(new Source());

async function read(stream) {
  const reader = stream.getReader({ mode: 'byob' });

  const chunks = [];
  let result;
  do {
    result = await reader.read(Buffer.alloc(100));
    if (result.value !== undefined)
      chunks.push(Buffer.from(result.value));
  } while (!result.done);

  return Buffer.concat(chunks);
}

const data = await read(stream);
console.log(Buffer.from(data).toString());
```
#### `new ReadableStreamBYOBReader(stream)` {#new-readablestreambyobreaderstream}

**Adicionado em: v16.5.0**

- `stream` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

Cria um novo `ReadableStreamBYOBReader` que é bloqueado para o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) fornecido.


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Adicionado em: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: Uma promise cumprida com `undefined`.

Cancela o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) e retorna uma promise que é cumprida quando o stream subjacente foi cancelado.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Adicionado em: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumprida com `undefined` quando o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) associado é fechado ou rejeitado se o stream apresentar erros ou o bloqueio do leitor for liberado antes que o stream termine de fechar.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.7.0, v20.17.0 | Adicionada a opção `min`. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

- `view` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Quando definido, a promise retornada só será cumprida assim que o número `min` de elementos estiver disponível. Quando não definido, a promise é cumprida quando pelo menos um elemento está disponível.
  
 
- Retorna: Uma promise cumprida com um objeto: 
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Solicita o próximo bloco de dados do [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) subjacente e retorna uma promise que é cumprida com os dados assim que estiverem disponíveis.

Não passe uma instância de objeto [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) agrupada para este método. Objetos `Buffer` agrupados são criados usando `Buffer.allocUnsafe()` ou `Buffer.from()` ou são frequentemente retornados por vários retornos de chamada do módulo `node:fs`. Esses tipos de `Buffer` usam um objeto [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) subjacente compartilhado que contém todos os dados de todas as instâncias de `Buffer` agrupadas. Quando um `Buffer`, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ou [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) é passado para `readableStreamBYOBReader.read()`, o `ArrayBuffer` subjacente da view é *desanexado*, invalidando todas as views existentes que possam existir nesse `ArrayBuffer`. Isso pode ter consequências desastrosas para sua aplicação.


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Adicionado em: v16.5.0**

Libera o bloqueio deste leitor no [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) subjacente.

### Classe: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Adicionado em: v16.5.0**

Cada [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) tem um controlador que é responsável pelo estado interno e gerenciamento da fila do stream. O `ReadableStreamDefaultController` é a implementação de controlador padrão para `ReadableStream`s que não são orientados a bytes.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Adicionado em: v16.5.0**

Fecha o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) ao qual este controlador está associado.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Adicionado em: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna a quantidade de dados restantes para preencher a fila do [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Adicionado em: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Anexa um novo bloco de dados à fila do [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Adicionado em: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Sinaliza um erro que faz com que o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) apresente um erro e feche.

### Classe: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.10.0 | Suporte para lidar com uma solicitação de pull BYOB de um leitor liberado. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

Cada [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) tem um controlador que é responsável pelo estado interno e gerenciamento da fila do stream. O `ReadableByteStreamController` é para `ReadableStream`s orientados a bytes.


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Adicionado em: v16.5.0**

- Tipo: [\<ReadableStreamBYOBRequest\>](/pt/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Adicionado em: v16.5.0**

Fecha o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) ao qual este controlador está associado.

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Adicionado em: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna a quantidade de dados restantes para preencher a fila do [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Adicionado em: v16.5.0**

- `chunk`: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Anexa um novo bloco de dados à fila do [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Adicionado em: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Sinaliza um erro que faz com que o [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) apresente um erro e feche.

### Classe: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora é exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

Ao usar `ReadableByteStreamController` em fluxos orientados a bytes e ao usar o `ReadableStreamBYOBReader`, a propriedade `readableByteStreamController.byobRequest` fornece acesso a uma instância de `ReadableStreamBYOBRequest` que representa a solicitação de leitura atual. O objeto é usado para obter acesso ao `ArrayBuffer`/`TypedArray` que foi fornecido para a solicitação de leitura para preencher e fornece métodos para sinalizar que os dados foram fornecidos.


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**Adicionado em: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Sinaliza que um número `bytesWritten` de bytes foi escrito em `readableStreamBYOBRequest.view`.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**Adicionado em: v16.5.0**

- `view` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Sinaliza que a solicitação foi atendida com bytes gravados em um novo `Buffer`, `TypedArray` ou `DataView`.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**Adicionado em: v16.5.0**

- Tipo: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### Classe: `WritableStream` {#class-writablestream}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

O `WritableStream` é um destino para o qual os dados do fluxo são enviados.

```js [ESM]
import {
  WritableStream,
} from 'node:stream/web';

const stream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
});

await stream.getWriter().write('Hello World');
```
#### `new WritableStream([underlyingSink[, strategy]])` {#new-writablestreamunderlyingsink-strategy}

**Adicionado em: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é invocada imediatamente quando o `WritableStream` é criado. 
    - `controller` [\<WritableStreamDefaultController\>](/pt/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Retorna: `undefined` ou uma promessa resolvida com `undefined`.
  
 
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é invocada quando um pedaço de dados foi gravado no `WritableStream`. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/pt/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Retorna: Uma promessa resolvida com `undefined`.
  
 
    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é chamada quando o `WritableStream` é fechado. 
    - Retorna: Uma promessa resolvida com `undefined`.
  
 
    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é chamada para fechar abruptamente o `WritableStream`. 
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: Uma promessa resolvida com `undefined`.
  
 
    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A opção `type` é reservada para uso futuro e *deve* ser indefinida.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo da fila interna antes que a contrapressão seja aplicada.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário usada para identificar o tamanho de cada pedaço de dados. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**Adicionado em: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: Uma promise cumprida com `undefined`.

Termina abruptamente o `WritableStream`. Todas as escritas enfileiradas serão canceladas com suas promises associadas rejeitadas.

#### `writableStream.close()` {#writablestreamclose}

**Adicionado em: v16.5.0**

- Retorna: Uma promise cumprida com `undefined`.

Fecha o `WritableStream` quando nenhuma escrita adicional é esperada.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**Adicionado em: v16.5.0**

- Retorna: [\<WritableStreamDefaultWriter\>](/pt/nodejs/api/webstreams#class-writablestreamdefaultwriter)

Cria e retorna uma nova instância de escritor que pode ser usada para gravar dados no `WritableStream`.

#### `writableStream.locked` {#writablestreamlocked}

**Adicionado em: v16.5.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A propriedade `writableStream.locked` é `false` por padrão, e é alterada para `true` enquanto houver um escritor ativo anexado a este `WritableStream`.

#### Transferindo com postMessage() {#transferring-with-postmessage_1}

Uma instância de [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) pode ser transferida usando um [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### Classe: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**Adicionado em: v16.5.0**

- `stream` [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)

Cria um novo `WritableStreamDefaultWriter` que é bloqueado para o `WritableStream` fornecido.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**Adicionado em: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: Uma promise cumprida com `undefined`.

Termina abruptamente o `WritableStream`. Todas as escritas enfileiradas serão canceladas com suas promises associadas rejeitadas.


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**Adicionado em: v16.5.0**

- Retorna: Uma promise cumprida com `undefined`.

Fecha o `WritableStream` quando nenhuma escrita adicional é esperada.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**Adicionado em: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumprida com `undefined` quando o [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) associado é fechado ou rejeitada se o stream apresentar erros ou o bloqueio do escritor for liberado antes que o stream termine de fechar.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**Adicionado em: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A quantidade de dados necessária para preencher a fila do [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**Adicionado em: v16.5.0**

- Tipo: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumprida com `undefined` quando o escritor estiver pronto para ser usado.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**Adicionado em: v16.5.0**

Libera o bloqueio deste escritor no [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) subjacente.

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**Adicionado em: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Retorna: Uma promise cumprida com `undefined`.

Anexa um novo pedaço de dados à fila do [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream).

### Classe: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

O `WritableStreamDefaultController` gerencia o estado interno do [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**Adicionado em: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Chamado pelo código do usuário para sinalizar que ocorreu um erro ao processar os dados do `WritableStream`. Quando chamado, o [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) será abortado, com as gravações pendentes atualmente canceladas.


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- Type: [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Um `AbortSignal` que pode ser usado para cancelar operações de escrita ou fechamento pendentes quando um [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) é abortado.

### Classe: `TransformStream` {#class-transformstream}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora é exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

Um `TransformStream` consiste em um [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) e um [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream) que são conectados de tal forma que os dados escritos no `WritableStream` são recebidos e, potencialmente, transformados, antes de serem enviados para a fila do `ReadableStream`.

```js [ESM]
import {
  TransformStream,
} from 'node:stream/web';

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

await Promise.all([
  transform.writable.getWriter().write('A'),
  transform.readable.getReader().read(),
]);
```
#### `new TransformStream([transformer[, writableStrategy[, readableStrategy]]])` {#new-transformstreamtransformer-writablestrategy-readablestrategy}

**Adicionado em: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é invocada imediatamente quando o `TransformStream` é criado. 
    - `controller` [\<TransformStreamDefaultController\>](/pt/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Retorna: `undefined` ou uma promessa cumprida com `undefined`
  
 
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que recebe e, potencialmente, modifica um trecho de dados escrito em `transformStream.writable`, antes de encaminhá-lo para `transformStream.readable`. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/pt/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Retorna: Uma promessa cumprida com `undefined`.
  
 
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário que é chamada imediatamente antes que o lado gravável do `TransformStream` seja fechado, sinalizando o fim do processo de transformação. 
    - `controller` [\<TransformStreamDefaultController\>](/pt/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Retorna: Uma promessa cumprida com `undefined`.
  
 
    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) a opção `readableType` é reservada para uso futuro e *deve* ser `undefined`.
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) a opção `writableType` é reservada para uso futuro e *deve* ser `undefined`.
  
 
- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo da fila interna antes que a contrapressão seja aplicada.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário usada para identificar o tamanho de cada trecho de dados. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 
- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo da fila interna antes que a contrapressão seja aplicada.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função definida pelo usuário usada para identificar o tamanho de cada trecho de dados. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  


#### `transformStream.readable` {#transformstreamreadable}

**Adicionado em: v16.5.0**

- Tipo: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Adicionado em: v16.5.0**

- Tipo: [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)

#### Transferindo com postMessage() {#transferring-with-postmessage_2}

Uma instância de [\<TransformStream\>](/pt/nodejs/api/webstreams#class-transformstream) pode ser transferida usando um [\<MessagePort\>](/pt/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### Classe: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

O `TransformStreamDefaultController` gerencia o estado interno do `TransformStream`.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Adicionado em: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A quantidade de dados necessária para preencher a fila do lado legível.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Adicionado em: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Acrescenta um bloco de dados à fila do lado legível.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Adicionado em: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Sinaliza para os lados legível e gravável que ocorreu um erro durante o processamento dos dados de transformação, fazendo com que ambos os lados sejam fechados abruptamente.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Adicionado em: v16.5.0**

Fecha o lado legível do transporte e faz com que o lado gravável seja fechado abruptamente com um erro.

### Classe: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::


#### `new ByteLengthQueuingStrategy(init)` {#new-bytelengthqueuingstrategyinit}

**Adicionado em: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.highWaterMark` {#bytelengthqueuingstrategyhighwatermark}

**Adicionado em: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `byteLengthQueuingStrategy.size` {#bytelengthqueuingstrategysize}

**Adicionado em: v16.5.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### Classe: `CountQueuingStrategy` {#class-countqueuingstrategy}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.5.0 | Adicionado em: v16.5.0 |
:::

#### `new CountQueuingStrategy(init)` {#new-countqueuingstrategyinit}

**Adicionado em: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.highWaterMark` {#countqueuingstrategyhighwatermark}

**Adicionado em: v16.5.0**

- Tipo: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### `countQueuingStrategy.size` {#countqueuingstrategysize}

**Adicionado em: v16.5.0**

- Tipo: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

### Classe: `TextEncoderStream` {#class-textencoderstream}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v16.6.0 | Adicionado em: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**Adicionado em: v16.6.0**

Cria uma nova instância de `TextEncoderStream`.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Adicionado em: v16.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A codificação suportada pela instância de `TextEncoderStream`.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Adicionado em: v16.6.0**

- Tipo: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Adicionado em: v16.6.0**

- Tipo: [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)

### Classe: `TextDecoderStream` {#class-textdecoderstream}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora é exposta no objeto global. |
| v16.6.0 | Adicionado em: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Adicionado em: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifica o `encoding` que esta instância de `TextDecoder` suporta. **Padrão:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se falhas de decodificação forem fatais.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o `TextDecoderStream` incluirá a marca de ordem de bytes no resultado decodificado. Quando `false`, a marca de ordem de bytes será removida da saída. Esta opção é usada apenas quando `encoding` é `'utf-8'`, `'utf-16be'` ou `'utf-16le'`. **Padrão:** `false`.
  
 

Cria uma nova instância de `TextDecoderStream`.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Adicionado em: v16.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A codificação suportada pela instância de `TextDecoderStream`.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Adicionado em: v16.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O valor será `true` se erros de decodificação resultarem no lançamento de um `TypeError`.


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Adicionado em: v16.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O valor será `true` se o resultado da decodificação incluir a marca de ordem de bytes.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Adicionado em: v16.6.0**

- Tipo: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Adicionado em: v16.6.0**

- Tipo: [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)

### Classe: `CompressionStream` {#class-compressionstream}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v17.0.0 | Adicionado em: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.2.0, v20.12.0 | format agora aceita o valor `deflate-raw`. |
| v17.0.0 | Adicionado em: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um de `'deflate'`, `'deflate-raw'` ou `'gzip'`.

#### `compressionStream.readable` {#compressionstreamreadable}

**Adicionado em: v17.0.0**

- Tipo: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Adicionado em: v17.0.0**

- Tipo: [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)

### Classe: `DecompressionStream` {#class-decompressionstream}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Esta classe agora está exposta no objeto global. |
| v17.0.0 | Adicionado em: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v21.2.0, v20.12.0 | format agora aceita o valor `deflate-raw`. |
| v17.0.0 | Adicionado em: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um de `'deflate'`, `'deflate-raw'` ou `'gzip'`.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Adicionado em: v17.0.0**

- Tipo: [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Adicionado em: v17.0.0**

- Tipo: [\<WritableStream\>](/pt/nodejs/api/webstreams#class-writablestream)


### Consumidores de utilidade {#utility-consumers}

**Adicionado em: v16.7.0**

As funções de consumidor de utilidade fornecem opções comuns para consumir streams.

Eles são acessados usando:

::: code-group
```js [ESM]
import {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} from 'node:stream/consumers';
```

```js [CJS]
const {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} = require('node:stream/consumers');
```
:::

#### `streamConsumers.arrayBuffer(stream)` {#streamconsumersarraybufferstream}

**Adicionado em: v16.7.0**

- `stream` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um `ArrayBuffer` contendo o conteúdo completo do stream.

::: code-group
```js [ESM]
import { arrayBuffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');

const readable = Readable.from(dataArray);
const data = await arrayBuffer(readable);
console.log(`from readable: ${data.byteLength}`);
// Prints: from readable: 76
```

```js [CJS]
const { arrayBuffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { TextEncoder } = require('node:util');

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');
const readable = Readable.from(dataArray);
arrayBuffer(readable).then((data) => {
  console.log(`from readable: ${data.byteLength}`);
  // Prints: from readable: 76
});
```
:::

#### `streamConsumers.blob(stream)` {#streamconsumersblobstream}

**Adicionado em: v16.7.0**

- `stream` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<Blob\>](/pt/nodejs/api/buffer#class-blob) contendo o conteúdo completo do stream.

::: code-group
```js [ESM]
import { blob } from 'node:stream/consumers';

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
const data = await blob(readable);
console.log(`from readable: ${data.size}`);
// Prints: from readable: 27
```

```js [CJS]
const { blob } = require('node:stream/consumers');

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
blob(readable).then((data) => {
  console.log(`from readable: ${data.size}`);
  // Prints: from readable: 27
});
```
:::


#### `streamConsumers.buffer(stream)` {#streamconsumersbufferstream}

**Adicionado em: v16.7.0**

- `stream` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com um [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) contendo o conteúdo completo do stream.

::: code-group
```js [ESM]
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Imprime: from readable: 27
```

```js [CJS]
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Imprime: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**Adicionado em: v16.7.0**

- `stream` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com o conteúdo do stream analisado como uma string codificada em UTF-8 que é então passada por `JSON.parse()`.

::: code-group
```js [ESM]
import { json } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
const data = await json(readable);
console.log(`from readable: ${data.length}`);
// Imprime: from readable: 100
```

```js [CJS]
const { json } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
json(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Imprime: from readable: 100
});
```
:::


#### `streamConsumers.text(stream)` {#streamconsumerstextstream}

**Adicionado em: v16.7.0**

- `stream` [\<ReadableStream\>](/pt/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Retorna: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Cumpre com o conteúdo do stream analisado como uma string com codificação UTF-8.

::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Imprime: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Imprime: from readable: 27
});
```
:::

