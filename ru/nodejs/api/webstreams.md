---
title: API Web Streams в Node.js
description: Документация по API Web Streams в Node.js, подробно описывающая работу с потоками для эффективной обработки данных, включая читаемые, записываемые и преобразующие потоки.
head:
  - - meta
    - name: og:title
      content: API Web Streams в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Документация по API Web Streams в Node.js, подробно описывающая работу с потоками для эффективной обработки данных, включая читаемые, записываемые и преобразующие потоки.
  - - meta
    - name: twitter:title
      content: API Web Streams в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Документация по API Web Streams в Node.js, подробно описывающая работу с потоками для эффективной обработки данных, включая читаемые, записываемые и преобразующие потоки.
---


# Web Streams API {#web-streams-api}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Больше не является экспериментальной. |
| v18.0.0 | Использование этого API больше не вызывает предупреждение во время выполнения. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Реализация [стандарта WHATWG Streams](https://streams.spec.whatwg.org/).

## Обзор {#overview}

[Стандарт WHATWG Streams](https://streams.spec.whatwg.org/) (или "web streams") определяет API для обработки потоковых данных. Он похож на API [Streams](/ru/nodejs/api/stream) Node.js, но появился позже и стал "стандартным" API для потоковой передачи данных во многих JavaScript средах.

Существует три основных типа объектов:

- `ReadableStream` - Представляет источник потоковых данных.
- `WritableStream` - Представляет место назначения для потоковых данных.
- `TransformStream` - Представляет алгоритм для преобразования потоковых данных.

### Пример `ReadableStream` {#example-readablestream}

Этот пример создает простой `ReadableStream`, который отправляет текущую временную метку `performance.now()` каждую секунду бесконечно. Асинхронный итерируемый объект используется для чтения данных из потока.



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
} = require('node:perf_hooks');

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

### Class: `ReadableStream` {#class-readablestream}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь доступен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

#### `new ReadableStream([underlyingSource [, strategy]])` {#new-readablestreamunderlyingsource--strategy}

**Добавлено в: v16.5.0**

- `underlyingSource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается немедленно при создании `ReadableStream`. 
    - `controller` [\<ReadableStreamDefaultController\>](/ru/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/ru/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Возвращает: `undefined` или promise, выполненный с `undefined`.
  
 
    - `pull` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается повторно, когда внутренняя очередь `ReadableStream` не заполнена. Операция может быть синхронной или асинхронной. Если асинхронная, функция не будет вызвана снова, пока ранее возвращенный promise не будет выполнен. 
    - `controller` [\<ReadableStreamDefaultController\>](/ru/nodejs/api/webstreams#class-readablestreamdefaultcontroller) | [\<ReadableByteStreamController\>](/ru/nodejs/api/webstreams#class-readablebytestreamcontroller)
    - Возвращает: Promise, выполненный с `undefined`.
  
 
    - `cancel` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается при отмене `ReadableStream`. 
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: Promise, выполненный с `undefined`.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Должен быть `'bytes'` или `undefined`.
    - `autoAllocateChunkSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Используется только тогда, когда `type` равно `'bytes'`. Когда установлено ненулевое значение, view buffer автоматически выделяется для `ReadableByteStreamController.byobRequest`. Если не установлено, необходимо использовать внутренние очереди потока для передачи данных через считыватель по умолчанию `ReadableStreamDefaultReader`.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер внутренней очереди до применения обратного давления.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, используемая для определения размера каждого куска данных. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `readableStream.locked` {#readablestreamlocked}

**Добавлено в версии: v16.5.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Устанавливается в `true`, если для данного [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) есть активный читатель.

Свойство `readableStream.locked` по умолчанию имеет значение `false` и переключается в `true`, когда есть активный читатель, потребляющий данные потока.

#### `readableStream.cancel([reason])` {#readablestreamcancelreason}

**Добавлено в версии: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: Promise, выполненный с `undefined` после завершения отмены.

#### `readableStream.getReader([options])` {#readablestreamgetreaderoptions}

**Добавлено в версии: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'byob'` или `undefined`
  
 
- Возвращает: [\<ReadableStreamDefaultReader\>](/ru/nodejs/api/webstreams#class-readablestreamdefaultreader) | [\<ReadableStreamBYOBReader\>](/ru/nodejs/api/webstreams#class-readablestreambyobreader)



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

Приводит к тому, что `readableStream.locked` становится `true`.

#### `readableStream.pipeThrough(transform[, options])` {#readablestreampipethroughtransform-options}

**Добавлено в версии: v16.5.0**

- `transform` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `readable` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) `ReadableStream`, в который `transform.writable` будет отправлять потенциально измененные данные, полученные от этого `ReadableStream`.
    - `writable` [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) `WritableStream`, в который будут записываться данные этого `ReadableStream`.
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, ошибки в этом `ReadableStream` не приведут к прерыванию `transform.writable`.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, ошибки в целевом `transform.writable` не приведут к отмене этого `ReadableStream`.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, закрытие этого `ReadableStream` не приведет к закрытию `transform.writable`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет отменить передачу данных с помощью [\<AbortController\>](/ru/nodejs/api/globals#class-abortcontroller).
  
 
- Возвращает: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) Из `transform.readable`.

Соединяет этот [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) с парой [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) и [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream), предоставленной в аргументе `transform`, таким образом, что данные из этого [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) записываются в `transform.writable`, возможно, преобразуются, а затем отправляются в `transform.readable`. После настройки конвейера возвращается `transform.readable`.

Приводит к тому, что `readableStream.locked` становится `true` во время активной операции конвейера.



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

**Добавлено в версии: v16.5.0**

- `destination` [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream), в который будут записываться данные этого `ReadableStream`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventAbort` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, ошибки в этом `ReadableStream` не приведут к прерыванию `destination`.
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, ошибки в `destination` не приведут к отмене этого `ReadableStream`.
    - `preventClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, закрытие этого `ReadableStream` не приведет к закрытию `destination`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет отменить передачу данных с помощью [\<AbortController\>](/ru/nodejs/api/globals#class-abortcontroller).


- Возвращает: Промис, выполненный со значением `undefined`

Приводит к тому, что `readableStream.locked` становится `true`, пока операция конвейера активна.

#### `readableStream.tee()` {#readablestreamtee}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.10.0, v16.18.0 | Поддержка разветвления читаемого байтового потока. |
| v16.5.0 | Добавлено в версии: v16.5.0 |
:::

- Возвращает: [\<ReadableStream[]\>](/ru/nodejs/api/webstreams#class-readablestream)

Возвращает пару новых экземпляров [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream), в которые будут пересылаться данные этого `ReadableStream`. Каждый из них получит одни и те же данные.

Приводит к тому, что `readableStream.locked` становится `true`.

#### `readableStream.values([options])` {#readablestreamvaluesoptions}

**Добавлено в версии: v16.5.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preventCancel` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, предотвращает закрытие [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream), когда асинхронный итератор резко завершается. **По умолчанию**: `false`.



Создает и возвращает асинхронный итератор, пригодный для использования данных этого `ReadableStream`.

Приводит к тому, что `readableStream.locked` становится `true`, пока асинхронный итератор активен.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### Асинхронная итерация {#async-iteration}

Объект [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) поддерживает протокол асинхронной итерации, использующий синтаксис `for await`.

```js [ESM]
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```
Асинхронный итератор будет потреблять [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) до тех пор, пока он не завершится.

По умолчанию, если асинхронный итератор выходит досрочно (через `break`, `return` или `throw`), [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) будет закрыт. Чтобы предотвратить автоматическое закрытие [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream), используйте метод `readableStream.values()` для получения асинхронного итератора и установите параметр `preventCancel` в значение `true`.

[\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) не должен быть заблокирован (то есть, он не должен иметь существующего активного читателя). Во время асинхронной итерации [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) будет заблокирован.

#### Передача с помощью `postMessage()` {#transferring-with-postmessage}

Экземпляр [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) можно передать с помощью [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport).

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

**Добавлено в: v20.6.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Объект, реализующий итерируемый протокол `Symbol.asyncIterator` или `Symbol.iterator`.

Вспомогательный метод, который создает новый [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) из итерируемого объекта.



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


### Class: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

По умолчанию, вызов `readableStream.getReader()` без аргументов вернет экземпляр `ReadableStreamDefaultReader`. Стандартный ридер обрабатывает фрагменты данных, передаваемые через поток, как непрозрачные значения, что позволяет [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) работать практически с любым значением JavaScript.

#### `new ReadableStreamDefaultReader(stream)` {#new-readablestreamdefaultreaderstream}

**Добавлено в: v16.5.0**

- `stream` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)

Создает новый [\<ReadableStreamDefaultReader\>](/ru/nodejs/api/webstreams#class-readablestreamdefaultreader), который заблокирован для заданного [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultReader.cancel([reason])` {#readablestreamdefaultreadercancelreason}

**Добавлено в: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: Promise, исполненный с `undefined`.

Отменяет [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) и возвращает promise, который выполняется, когда базовый поток был отменен.

#### `readableStreamDefaultReader.closed` {#readablestreamdefaultreaderclosed}

**Добавлено в: v16.5.0**

- Тип: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполнен с `undefined`, когда связанный [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) закрыт или отклонен, если в потоке возникают ошибки, или блокировка ридера снимается до завершения закрытия потока.

#### `readableStreamDefaultReader.read()` {#readablestreamdefaultreaderread}

**Добавлено в: v16.5.0**

- Возвращает: Promise, исполненный с объектом:
    - `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Запрашивает следующий фрагмент данных из базового [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) и возвращает promise, который выполняется с данными, как только они становятся доступными.


#### `readableStreamDefaultReader.releaseLock()` {#readablestreamdefaultreaderreleaselock}

**Добавлено в версии: v16.5.0**

Освобождает блокировку этого считывателя для базового [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

### Класс: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь доступен в глобальном объекте. |
| v16.5.0 | Добавлено в версии: v16.5.0 |
:::

`ReadableStreamBYOBReader` - это альтернативный потребитель для байт-ориентированных [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) (тех, которые создаются с `underlyingSource.type`, установленным равным `'bytes'` при создании `ReadableStream`).

`BYOB` является сокращением от "bring your own buffer" (принеси свой собственный буфер). Это шаблон, который позволяет более эффективно читать байт-ориентированные данные, избегая лишнего копирования.

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

**Добавлено в версии: v16.5.0**

- `stream` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)

Создает новый `ReadableStreamBYOBReader`, который заблокирован для данного [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).


#### `readableStreamBYOBReader.cancel([reason])` {#readablestreambyobreadercancelreason}

**Добавлено в: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: Promise, завершенный со значением `undefined`.

Отменяет [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) и возвращает promise, который выполняется, когда базовый поток был отменен.

#### `readableStreamBYOBReader.closed` {#readablestreambyobreaderclosed}

**Добавлено в: v16.5.0**

- Тип: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Завершается со значением `undefined`, когда связанный [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) закрыт, или отклоняется, если в потоке возникает ошибка или блокировка считывателя снимается до завершения закрытия потока.

#### `readableStreamBYOBReader.read(view[, options])` {#readablestreambyobreaderreadview-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.7.0, v20.17.0 | Добавлен параметр `min`. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

- `view` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если установлено, возвращаемый promise будет выполнен, как только станет доступно `min` число элементов. Если не установлено, promise выполняется, когда доступен хотя бы один элемент.


- Возвращает: Promise, выполненный с объектом:
    - `value` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `done` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


Запрашивает следующий фрагмент данных из базового [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) и возвращает promise, который выполняется с данными, как только они станут доступны.

Не передавайте экземпляр пула [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) в этот метод. Пул `Buffer` создается с использованием `Buffer.allocUnsafe()` или `Buffer.from()` и часто возвращаются различными обратными вызовами модуля `node:fs`. Эти типы `Buffer` используют общий базовый объект [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), который содержит все данные из всех экземпляров пула `Buffer`. Когда `Buffer`, [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) или [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) передается в `readableStreamBYOBReader.read()`, базовый `ArrayBuffer` представления *отсоединяется*, делая недействительными все существующие представления, которые могут существовать в этом `ArrayBuffer`. Это может иметь катастрофические последствия для вашего приложения.


#### `readableStreamBYOBReader.releaseLock()` {#readablestreambyobreaderreleaselock}

**Добавлено в: v16.5.0**

Освобождает блокировку этого читателя для базового [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

### Класс: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Добавлено в: v16.5.0**

Каждый [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) имеет контроллер, который отвечает за внутреннее состояние и управление очередью потока. `ReadableStreamDefaultController` является реализацией контроллера по умолчанию для `ReadableStream`, которые не являются байт-ориентированными.

#### `readableStreamDefaultController.close()` {#readablestreamdefaultcontrollerclose}

**Добавлено в: v16.5.0**

Закрывает [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream), с которым связан этот контроллер.

#### `readableStreamDefaultController.desiredSize` {#readablestreamdefaultcontrollerdesiredsize}

**Добавлено в: v16.5.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает объем данных, оставшийся для заполнения очереди [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.enqueue([chunk])` {#readablestreamdefaultcontrollerenqueuechunk}

**Добавлено в: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Добавляет новый фрагмент данных в очередь [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

#### `readableStreamDefaultController.error([error])` {#readablestreamdefaultcontrollererrorerror}

**Добавлено в: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Сигнализирует об ошибке, которая приводит к тому, что [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) выдает ошибку и закрывается.

### Класс: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.10.0 | Поддержка обработки BYOB pull запроса от выпущенного reader. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

Каждый [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) имеет контроллер, который отвечает за внутреннее состояние и управление очередью потока. `ReadableByteStreamController` предназначен для байт-ориентированных `ReadableStream`.


#### `readableByteStreamController.byobRequest` {#readablebytestreamcontrollerbyobrequest}

**Добавлено в: v16.5.0**

- Тип: [\<ReadableStreamBYOBRequest\>](/ru/nodejs/api/webstreams#class-readablestreambyobrequest)

#### `readableByteStreamController.close()` {#readablebytestreamcontrollerclose}

**Добавлено в: v16.5.0**

Закрывает [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream), с которым связан этот контроллер.

#### `readableByteStreamController.desiredSize` {#readablebytestreamcontrollerdesiredsize}

**Добавлено в: v16.5.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает количество данных, оставшихся для заполнения очереди [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.enqueue(chunk)` {#readablebytestreamcontrollerenqueuechunk}

**Добавлено в: v16.5.0**

- `chunk`: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Добавляет новый фрагмент данных в очередь [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

#### `readableByteStreamController.error([error])` {#readablebytestreamcontrollererrorerror}

**Добавлено в: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Сигнализирует об ошибке, которая приводит к ошибке и закрытию [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

### Класс: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

При использовании `ReadableByteStreamController` в байт-ориентированных потоках и при использовании `ReadableStreamBYOBReader` свойство `readableByteStreamController.byobRequest` предоставляет доступ к экземпляру `ReadableStreamBYOBRequest`, который представляет текущий запрос на чтение. Объект используется для получения доступа к `ArrayBuffer`/`TypedArray`, который был предоставлен для заполнения запроса на чтение, и предоставляет методы для сигнализации о том, что данные были предоставлены.


#### `readableStreamBYOBRequest.respond(bytesWritten)` {#readablestreambyobrequestrespondbyteswritten}

**Добавлено в: v16.5.0**

- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Сигнализирует о том, что `bytesWritten` количество байтов было записано в `readableStreamBYOBRequest.view`.

#### `readableStreamBYOBRequest.respondWithNewView(view)` {#readablestreambyobrequestrespondwithnewviewview}

**Добавлено в: v16.5.0**

- `view` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Сигнализирует о том, что запрос был выполнен с байтами, записанными в новый `Buffer`, `TypedArray` или `DataView`.

#### `readableStreamBYOBRequest.view` {#readablestreambyobrequestview}

**Добавлено в: v16.5.0**

- Тип: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

### Класс: `WritableStream` {#class-writablestream}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь доступен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

`WritableStream` - это место назначения, куда отправляются данные потока.

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

**Добавлено в: v16.5.0**

- `underlyingSink` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается сразу после создания `WritableStream`. 
    - `controller` [\<WritableStreamDefaultController\>](/ru/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Возвращает: `undefined` или промис, разрешенный с `undefined`.
  
 
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается, когда чанк данных был записан в `WritableStream`. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<WritableStreamDefaultController\>](/ru/nodejs/api/webstreams#class-writablestreamdefaultcontroller)
    - Возвращает: Промис, разрешенный с `undefined`.
  
 
    - `close` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается, когда `WritableStream` закрыт. 
    - Возвращает: Промис, разрешенный с `undefined`.
  
 
    - `abort` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается для резкого закрытия `WritableStream`. 
    - `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: Промис, разрешенный с `undefined`.
  
 
    - `type` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Опция `type` зарезервирована для будущего использования и *должна* быть undefined.
  
 
- `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер внутренней очереди до применения обратного давления.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, используемая для определения размера каждого чанка данных. 
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
  
 


#### `writableStream.abort([reason])` {#writablestreamabortreason}

**Добавлено в: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: Promise, выполненный с `undefined`.

Резко завершает `WritableStream`. Все поставленные в очередь операции записи будут отменены с отклонением соответствующих им Promise.

#### `writableStream.close()` {#writablestreamclose}

**Добавлено в: v16.5.0**

- Возвращает: Promise, выполненный с `undefined`.

Закрывает `WritableStream`, когда дополнительные записи не ожидаются.

#### `writableStream.getWriter()` {#writablestreamgetwriter}

**Добавлено в: v16.5.0**

- Возвращает: [\<WritableStreamDefaultWriter\>](/ru/nodejs/api/webstreams#class-writablestreamdefaultwriter)

Создает и возвращает новый экземпляр writer, который можно использовать для записи данных в `WritableStream`.

#### `writableStream.locked` {#writablestreamlocked}

**Добавлено в: v16.5.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `writableStream.locked` по умолчанию имеет значение `false` и переключается на `true`, когда к этому `WritableStream` подключен активный writer.

#### Передача с помощью postMessage() {#transferring-with-postmessage_1}

Экземпляр [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) можно передать с помощью [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```
### Класс: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

#### `new WritableStreamDefaultWriter(stream)` {#new-writablestreamdefaultwriterstream}

**Добавлено в: v16.5.0**

- `stream` [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)

Создает новый `WritableStreamDefaultWriter`, который привязан к указанному `WritableStream`.

#### `writableStreamDefaultWriter.abort([reason])` {#writablestreamdefaultwriterabortreason}

**Добавлено в: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: Promise, выполненный с `undefined`.

Резко завершает `WritableStream`. Все поставленные в очередь операции записи будут отменены с отклонением соответствующих им Promise.


#### `writableStreamDefaultWriter.close()` {#writablestreamdefaultwriterclose}

**Добавлено в версии: v16.5.0**

- Возвращает: Promise, исполненный со значением `undefined`.

Закрывает `WritableStream`, когда не ожидается никаких дополнительных операций записи.

#### `writableStreamDefaultWriter.closed` {#writablestreamdefaultwriterclosed}

**Добавлено в версии: v16.5.0**

- Тип: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется со значением `undefined`, когда связанный [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) закрыт, или отклоняется, если в потоке произошла ошибка или блокировка писателя снята до завершения закрытия потока.

#### `writableStreamDefaultWriter.desiredSize` {#writablestreamdefaultwriterdesiredsize}

**Добавлено в версии: v16.5.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Объем данных, необходимых для заполнения очереди [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultWriter.ready` {#writablestreamdefaultwriterready}

**Добавлено в версии: v16.5.0**

- Тип: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется со значением `undefined`, когда писатель готов к использованию.

#### `writableStreamDefaultWriter.releaseLock()` {#writablestreamdefaultwriterreleaselock}

**Добавлено в версии: v16.5.0**

Снимает блокировку этого писателя с базового [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream).

#### `writableStreamDefaultWriter.write([chunk])` {#writablestreamdefaultwriterwritechunk}

**Добавлено в версии: v16.5.0**

- `chunk`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: Promise, исполненный со значением `undefined`.

Добавляет новый фрагмент данных в очередь [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream).

### Class: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь доступен в глобальном объекте. |
| v16.5.0 | Добавлено в версии: v16.5.0 |
:::

`WritableStreamDefaultController` управляет внутренним состоянием [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream).

#### `writableStreamDefaultController.error([error])` {#writablestreamdefaultcontrollererrorerror}

**Добавлено в версии: v16.5.0**

- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Вызывается пользовательским кодом, чтобы сигнализировать о том, что произошла ошибка при обработке данных `WritableStream`. При вызове [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) будет прерван, а ожидающие записи будут отменены.


#### `writableStreamDefaultController.signal` {#writablestreamdefaultcontrollersignal}

- Тип: [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) `AbortSignal`, который можно использовать для отмены ожидающих операций записи или закрытия, когда [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) прерван.

### Класс: `TransformStream` {#class-transformstream}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

`TransformStream` состоит из [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) и [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream), которые соединены таким образом, что данные, записанные в `WritableStream`, принимаются и, возможно, преобразуются, прежде чем быть помещенными в очередь `ReadableStream`.

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

**Добавлено в: v16.5.0**

- `transformer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается сразу при создании `TransformStream`.
    - `controller` [\<TransformStreamDefaultController\>](/ru/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Возвращает: `undefined` или promise, выполненный с `undefined`

    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая принимает и, возможно, изменяет фрагмент данных, записанный в `transformStream.writable`, прежде чем перенаправить его в `transformStream.readable`.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - `controller` [\<TransformStreamDefaultController\>](/ru/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Возвращает: Promise, выполненный с `undefined`.

    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, которая вызывается непосредственно перед закрытием записываемой стороны `TransformStream`, сигнализируя об окончании процесса преобразования.
    - `controller` [\<TransformStreamDefaultController\>](/ru/nodejs/api/webstreams#class-transformstreamdefaultcontroller)
    - Возвращает: Promise, выполненный с `undefined`.

    - `readableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Параметр `readableType` зарезервирован для будущего использования и *должен* быть `undefined`.
    - `writableType` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Параметр `writableType` зарезервирован для будущего использования и *должен* быть `undefined`.

- `writableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер внутренней очереди до применения противодавления.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, используемая для определения размера каждого фрагмента данных.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `readableStrategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер внутренней очереди до применения противодавления.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Определяемая пользователем функция, используемая для определения размера каждого фрагмента данных.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


#### `transformStream.readable` {#transformstreamreadable}

**Добавлено в: v16.5.0**

- Тип: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)

#### `transformStream.writable` {#transformstreamwritable}

**Добавлено в: v16.5.0**

- Тип: [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)

#### Передача с помощью postMessage() {#transferring-with-postmessage_2}

Экземпляр [\<TransformStream\>](/ru/nodejs/api/webstreams#class-transformstream) можно передать с помощью [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```
### Класс: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

`TransformStreamDefaultController` управляет внутренним состоянием `TransformStream`.

#### `transformStreamDefaultController.desiredSize` {#transformstreamdefaultcontrollerdesiredsize}

**Добавлено в: v16.5.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Объем данных, необходимый для заполнения очереди читаемой стороны.

#### `transformStreamDefaultController.enqueue([chunk])` {#transformstreamdefaultcontrollerenqueuechunk}

**Добавлено в: v16.5.0**

- `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Добавляет фрагмент данных в очередь читаемой стороны.

#### `transformStreamDefaultController.error([reason])` {#transformstreamdefaultcontrollererrorreason}

**Добавлено в: v16.5.0**

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Сигнализирует как читаемой, так и записываемой сторонам о том, что произошла ошибка при обработке данных преобразования, что приводит к резкому закрытию обеих сторон.

#### `transformStreamDefaultController.terminate()` {#transformstreamdefaultcontrollerterminate}

**Добавлено в: v16.5.0**

Закрывает читаемую сторону транспорта и вызывает резкое закрытие записываемой стороны с ошибкой.

### Класс: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::


#### ``new ByteLengthQueuingStrategy(init)`` {#new-bytelengthqueuingstrategyinit}

**Добавлено в: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



#### ``byteLengthQueuingStrategy.highWaterMark`` {#bytelengthqueuingstrategyhighwatermark}

**Добавлено в: v16.5.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### ``byteLengthQueuingStrategy.size`` {#bytelengthqueuingstrategysize}

**Добавлено в: v16.5.0**

- Тип: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



### Класс: `CountQueuingStrategy` {#class-countqueuingstrategy}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь доступен в глобальном объекте. |
| v16.5.0 | Добавлено в: v16.5.0 |
:::

#### ``new CountQueuingStrategy(init)`` {#new-countqueuingstrategyinit}

**Добавлено в: v16.5.0**

- `init` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



#### ``countQueuingStrategy.highWaterMark`` {#countqueuingstrategyhighwatermark}

**Добавлено в: v16.5.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

#### ``countQueuingStrategy.size`` {#countqueuingstrategysize}

**Добавлено в: v16.5.0**

- Тип: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)



### Класс: `TextEncoderStream` {#class-textencoderstream}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь доступен в глобальном объекте. |
| v16.6.0 | Добавлено в: v16.6.0 |
:::


#### `new TextEncoderStream()` {#new-textencoderstream}

**Added in: v16.6.0**

Создаёт новый экземпляр `TextEncoderStream`.

#### `textEncoderStream.encoding` {#textencoderstreamencoding}

**Added in: v16.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Кодировка, поддерживаемая экземпляром `TextEncoderStream`.

#### `textEncoderStream.readable` {#textencoderstreamreadable}

**Added in: v16.6.0**

- Тип: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)

#### `textEncoderStream.writable` {#textencoderstreamwritable}

**Added in: v16.6.0**

- Тип: [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)

### Class: `TextDecoderStream` {#class-textdecoderstream}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v16.6.0 | Added in: v16.6.0 |
:::

#### `new TextDecoderStream([encoding[, options]])` {#new-textdecoderstreamencoding-options}

**Added in: v16.6.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Определяет `encoding`, который поддерживает этот экземпляр `TextDecoder`. **По умолчанию:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если ошибки декодирования являются фатальными.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, `TextDecoderStream` будет включать метку порядка байтов в декодированный результат. Если `false`, метка порядка байтов будет удалена из выходных данных. Этот параметр используется только в том случае, если `encoding` равно `'utf-8'`, `'utf-16be'` или `'utf-16le'`. **По умолчанию:** `false`.
  
 

Создаёт новый экземпляр `TextDecoderStream`.

#### `textDecoderStream.encoding` {#textdecoderstreamencoding}

**Added in: v16.6.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Кодировка, поддерживаемая экземпляром `TextDecoderStream`.

#### `textDecoderStream.fatal` {#textdecoderstreamfatal}

**Added in: v16.6.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Значение будет `true`, если ошибки декодирования приведут к выбросу `TypeError`.


#### `textDecoderStream.ignoreBOM` {#textdecoderstreamignorebom}

**Добавлено в: v16.6.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Значение будет `true`, если результат декодирования будет включать метку порядка байтов.

#### `textDecoderStream.readable` {#textdecoderstreamreadable}

**Добавлено в: v16.6.0**

- Тип: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)

#### `textDecoderStream.writable` {#textdecoderstreamwritable}

**Добавлено в: v16.6.0**

- Тип: [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)

### Класс: `CompressionStream` {#class-compressionstream}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v17.0.0 | Добавлено в: v17.0.0 |
:::

#### `new CompressionStream(format)` {#new-compressionstreamformat}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.2.0, v20.12.0 | format теперь принимает значение `deflate-raw`. |
| v17.0.0 | Добавлено в: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Одно из `'deflate'`, `'deflate-raw'` или `'gzip'`.

#### `compressionStream.readable` {#compressionstreamreadable}

**Добавлено в: v17.0.0**

- Тип: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)

#### `compressionStream.writable` {#compressionstreamwritable}

**Добавлено в: v17.0.0**

- Тип: [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)

### Класс: `DecompressionStream` {#class-decompressionstream}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Этот класс теперь представлен в глобальном объекте. |
| v17.0.0 | Добавлено в: v17.0.0 |
:::

#### `new DecompressionStream(format)` {#new-decompressionstreamformat}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.2.0, v20.12.0 | format теперь принимает значение `deflate-raw`. |
| v17.0.0 | Добавлено в: v17.0.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Одно из `'deflate'`, `'deflate-raw'` или `'gzip'`.

#### `decompressionStream.readable` {#decompressionstreamreadable}

**Добавлено в: v17.0.0**

- Тип: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)

#### `decompressionStream.writable` {#decompressionstreamwritable}

**Добавлено в: v17.0.0**

- Тип: [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)


### Утилиты-потребители {#utility-consumers}

**Добавлено в: v16.7.0**

Функции утилит-потребителей предоставляют общие опции для использования потоков.

Они доступны через:

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

**Добавлено в: v16.7.0**

- `stream` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с `ArrayBuffer`, содержащим полное содержимое потока.

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

**Добавлено в: v16.7.0**

- `stream` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<Blob\>](/ru/nodejs/api/buffer#class-blob), содержащим полное содержимое потока.

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

**Добавлено в: v16.7.0**

- `stream` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Завершается с [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), содержащим полное содержимое потока.



::: code-group
```js [ESM]
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```js [CJS]
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```
:::

#### `streamConsumers.json(stream)` {#streamconsumersjsonstream}

**Добавлено в: v16.7.0**

- `stream` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Завершается содержимым потока, проанализированным как строка в кодировке UTF-8, которая затем передается через `JSON.parse()`.



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
// Prints: from readable: 100
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
  // Prints: from readable: 100
});
```
:::


#### `streamConsumers.text(stream)` {#streamconsumerstextstream}

**Добавлено в: v16.7.0**

- `stream` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается содержимым потока, проанализированным как строка в кодировке UTF-8.

::: code-group
```js [ESM]
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Выводит: from readable: 27
```

```js [CJS]
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Выводит: from readable: 27
});
```
:::

