---
title: Документация API потоков Node.js
description: Подробная документация по API потоков Node.js, охватывающая читаемые, записываемые, дуплексные и трансформирующие потоки, а также их методы, события и примеры использования.
head:
  - - meta
    - name: og:title
      content: Документация API потоков Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Подробная документация по API потоков Node.js, охватывающая читаемые, записываемые, дуплексные и трансформирующие потоки, а также их методы, события и примеры использования.
  - - meta
    - name: twitter:title
      content: Документация API потоков Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Подробная документация по API потоков Node.js, охватывающая читаемые, записываемые, дуплексные и трансформирующие потоки, а также их методы, события и примеры использования.
---


# Stream {#stream}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Stability: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/stream.js](https://github.com/nodejs/node/blob/v23.5.0/lib/stream.js)

Stream — это абстрактный интерфейс для работы с потоковыми данными в Node.js. Модуль `node:stream` предоставляет API для реализации интерфейса потока.

Node.js предоставляет множество объектов потока. Например, [запрос к HTTP-серверу](/ru/nodejs/api/http#class-httpincomingmessage) и [`process.stdout`](/ru/nodejs/api/process#processstdout) являются экземплярами потока.

Потоки могут быть читаемыми, записываемыми или и тем, и другим. Все потоки являются экземплярами [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter).

Чтобы получить доступ к модулю `node:stream`:

```js [ESM]
const stream = require('node:stream');
```

Модуль `node:stream` полезен для создания новых типов экземпляров потоков. Обычно нет необходимости использовать модуль `node:stream` для использования потоков.

## Организация этого документа {#organization-of-this-document}

Этот документ содержит два основных раздела и третий раздел для заметок. В первом разделе объясняется, как использовать существующие потоки в приложении. Во втором разделе объясняется, как создавать новые типы потоков.

## Типы потоков {#types-of-streams}

В Node.js существует четыре основных типа потоков:

- [`Writable`](/ru/nodejs/api/stream#class-streamwritable): потоки, в которые можно записывать данные (например, [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options)).
- [`Readable`](/ru/nodejs/api/stream#class-streamreadable): потоки, из которых можно читать данные (например, [`fs.createReadStream()`](/ru/nodejs/api/fs#fscreatereadstreampath-options)).
- [`Duplex`](/ru/nodejs/api/stream#class-streamduplex): потоки, которые являются одновременно `Readable` и `Writable` (например, [`net.Socket`](/ru/nodejs/api/net#class-netsocket)).
- [`Transform`](/ru/nodejs/api/stream#class-streamtransform): потоки `Duplex`, которые могут изменять или преобразовывать данные по мере их записи и чтения (например, [`zlib.createDeflate()`](/ru/nodejs/api/zlib#zlibcreatedeflateoptions)).

Кроме того, этот модуль включает в себя вспомогательные функции [`stream.duplexPair()`](/ru/nodejs/api/stream#streamduplexpairoptions), [`stream.pipeline()`](/ru/nodejs/api/stream#streampipelinesource-transforms-destination-callback), [`stream.finished()`](/ru/nodejs/api/stream#streamfinishedstream-options-callback) [`stream.Readable.from()`](/ru/nodejs/api/stream#streamreadablefromiterable-options) и [`stream.addAbortSignal()`](/ru/nodejs/api/stream#streamaddabortsignalsignal-stream).


### Streams Promises API {#streams-promises-api}

**Добавлено в версии: v15.0.0**

API `stream/promises` предоставляет альтернативный набор асинхронных утилитных функций для потоков, которые возвращают объекты `Promise` вместо использования колбэков. Доступ к API осуществляется через `require('node:stream/promises')` или `require('node:stream').promises`.

### `stream.pipeline(source[, ...transforms], destination[, options])` {#streampipelinesource-transforms-destination-options}

### `stream.pipeline(streams[, options])` {#streampipelinestreams-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0, v17.2.0, v16.14.0 | Добавлен параметр `end`, который можно установить в `false`, чтобы предотвратить автоматическое закрытие целевого потока при завершении исходного. |
| v15.0.0 | Добавлено в версии: v15.0.0 |
:::

- `streams` [\<Stream[]>](/ru/nodejs/api/stream#stream) | [\<Iterable[]>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `source` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конвейера
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Завершить целевой поток при завершении исходного потока. Потоки преобразования всегда завершаются, даже если это значение равно `false`. **По умолчанию:** `true`.
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Выполняется, когда конвейер завершен.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('Pipeline succeeded.');
```
:::

Чтобы использовать `AbortSignal`, передайте его внутри объекта параметров в качестве последнего аргумента. Когда сигнал прерван, будет вызван `destroy` для базового конвейера с `AbortError`.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```
:::

API `pipeline` также поддерживает асинхронные генераторы:



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

Не забудьте обработать аргумент `signal`, переданный в асинхронный генератор. Особенно в том случае, когда асинхронный генератор является источником для конвейера (т.е. первым аргументом), иначе конвейер никогда не завершится.



::: code-group
```js [CJS]
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```js [ESM]
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```
:::

API `pipeline` предоставляет [callback версию](/ru/nodejs/api/stream#streampipelinesource-transforms-destination-callback):


### `stream.finished(stream[, options])` {#streamfinishedstream-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.5.0, v18.14.0 | Добавлена поддержка `ReadableStream` и `WritableStream`. |
| v19.1.0, v18.13.0 | Добавлена опция `cleanup`. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

- `stream` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) Читаемый и/или записываемый поток/веб-поток.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
    - `cleanup` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Если `true`, удаляет прослушиватели, зарегистрированные этой функцией, до того, как промис будет выполнен. **По умолчанию:** `false`.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Выполняется, когда поток больше не читаемый или записываемый.

::: code-group
```js [CJS]
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Поток завершил чтение.');
}

run().catch(console.error);
rs.resume(); // Опустошить поток.
```

```js [ESM]
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Поток завершил чтение.');
}

run().catch(console.error);
rs.resume(); // Опустошить поток.
```
:::

API `finished` также предоставляет [версию с обратным вызовом](/ru/nodejs/api/stream#streamfinishedstream-options-callback).

`stream.finished()` оставляет висящие прослушиватели событий (в частности `'error'`, `'end'`, `'finish'` и `'close'`) после того, как возвращенный промис будет разрешен или отклонен. Причина этого заключается в том, что неожиданные события `'error'` (из-за неправильной реализации потока) не вызывают неожиданных сбоев. Если такое поведение нежелательно, то для `options.cleanup` следует установить значение `true`:

```js [ESM]
await finished(rs, { cleanup: true });
```

### Режим объектов {#object-mode}

Все потоки, созданные API Node.js, работают исключительно со строками, [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) и [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) объектами:

- `Strings` и `Buffers` - наиболее распространенные типы, используемые с потоками.
- `TypedArray` и `DataView` позволяют обрабатывать двоичные данные с такими типами, как `Int32Array` или `Uint8Array`. Когда вы записываете TypedArray или DataView в поток, Node.js обрабатывает необработанные байты.

Однако, возможно, что реализации потоков будут работать с другими типами значений JavaScript (за исключением `null`, который выполняет особую функцию в потоках). Такие потоки считаются работающими в "режиме объектов".

Экземпляры потока переключаются в режим объектов с помощью опции `objectMode` при создании потока. Попытка переключить существующий поток в режим объектов небезопасна.

### Буферизация {#buffering}

И [`Writable`](/ru/nodejs/api/stream#class-streamwritable), и [`Readable`](/ru/nodejs/api/stream#class-streamreadable) потоки будут хранить данные во внутреннем буфере.

Объем данных, который потенциально может быть буферизован, зависит от опции `highWaterMark`, переданной в конструктор потока. Для обычных потоков опция `highWaterMark` указывает [общее количество байтов](/ru/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding). Для потоков, работающих в режиме объектов, `highWaterMark` указывает общее количество объектов. Для потоков, работающих со строками (но не декодирующих их), `highWaterMark` указывает общее количество кодовых единиц UTF-16.

Данные буферизуются в `Readable` потоках, когда реализация вызывает [`stream.push(chunk)`](/ru/nodejs/api/stream#readablepushchunk-encoding). Если потребитель потока не вызывает [`stream.read()`](/ru/nodejs/api/stream#readablereadsize), данные будут находиться во внутренней очереди до тех пор, пока они не будут потреблены.

Как только общий размер внутреннего буфера чтения достигает порога, указанного `highWaterMark`, поток временно прекратит чтение данных из базового ресурса, пока данные, буферизованные в данный момент, не будут потреблены (то есть поток перестанет вызывать внутренний метод [`readable._read()`](/ru/nodejs/api/stream#readable_readsize), который используется для заполнения буфера чтения).

Данные буферизуются в `Writable` потоках, когда метод [`writable.write(chunk)`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) вызывается повторно. Пока общий размер внутреннего буфера записи ниже порога, установленного `highWaterMark`, вызовы `writable.write()` будут возвращать `true`. Как только размер внутреннего буфера достигает или превышает `highWaterMark`, будет возвращено `false`.

Ключевой целью API `stream`, особенно метода [`stream.pipe()`](/ru/nodejs/api/stream#readablepipedestination-options), является ограничение буферизации данных до приемлемых уровней, чтобы источники и приемники с разной скоростью не перегружали доступную память.

Опция `highWaterMark` - это порог, а не ограничение: она определяет объем данных, который поток буферизует, прежде чем он перестанет запрашивать больше данных. В общем случае она не обеспечивает строгого ограничения памяти. Конкретные реализации потоков могут принять решение о применении более строгих ограничений, но это необязательно.

Поскольку [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) и [`Transform`](/ru/nodejs/api/stream#class-streamtransform) потоки являются одновременно `Readable` и `Writable`, каждый из них поддерживает *два* отдельных внутренних буфера, используемых для чтения и записи, что позволяет каждой стороне работать независимо друг от друга, поддерживая при этом соответствующий и эффективный поток данных. Например, экземпляры [`net.Socket`](/ru/nodejs/api/net#class-netsocket) являются [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) потоками, чья сторона `Readable` позволяет потреблять данные, полученные *из* сокета, а сторона `Writable` позволяет записывать данные *в* сокет. Поскольку данные могут быть записаны в сокет с большей или меньшей скоростью, чем данные получены, каждая сторона должна работать (и буферизовать) независимо друг от друга.

Механика внутренней буферизации является внутренней деталью реализации и может быть изменена в любое время. Однако для некоторых продвинутых реализаций внутренние буферы можно получить с помощью `writable.writableBuffer` или `readable.readableBuffer`. Использование этих незадокументированных свойств не рекомендуется.


## API для потребителей потоков {#api-for-stream-consumers}

Практически все приложения Node.js, независимо от их простоты, в той или иной степени используют потоки. Ниже приведен пример использования потоков в приложении Node.js, реализующем HTTP-сервер:

```js [ESM]
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` - это http.IncomingMessage, который является читаемым потоком.
  // `res` - это http.ServerResponse, который является записываемым потоком.

  let body = '';
  // Получаем данные как строки utf8.
  // Если кодировка не установлена, будут получены объекты Buffer.
  req.setEncoding('utf8');

  // Читаемые потоки генерируют события 'data' после добавления слушателя.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // Событие 'end' указывает на то, что все тело было получено.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Запишем что-нибудь интересное пользователю:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // ой-ой! плохой json!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```
[`Writable`](/ru/nodejs/api/stream#class-streamwritable) потоки (например, `res` в примере) предоставляют методы, такие как `write()` и `end()`, которые используются для записи данных в поток.

[`Readable`](/ru/nodejs/api/stream#class-streamreadable) потоки используют API [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter) для уведомления кода приложения, когда данные доступны для считывания из потока. Эти доступные данные можно считывать из потока несколькими способами.

Как [`Writable`](/ru/nodejs/api/stream#class-streamwritable), так и [`Readable`](/ru/nodejs/api/stream#class-streamreadable) потоки используют API [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter) различными способами для передачи текущего состояния потока.

[`Duplex`](/ru/nodejs/api/stream#class-streamduplex) и [`Transform`](/ru/nodejs/api/stream#class-streamtransform) потоки являются одновременно [`Writable`](/ru/nodejs/api/stream#class-streamwritable) и [`Readable`](/ru/nodejs/api/stream#class-streamreadable).

Приложениям, которые либо записывают данные в поток, либо потребляют данные из потока, не требуется напрямую реализовывать интерфейсы потока и, как правило, нет причин вызывать `require('node:stream')`.

Разработчикам, желающим реализовать новые типы потоков, следует обратиться к разделу [API для разработчиков потоков](/ru/nodejs/api/stream#api-for-stream-implementers).


### Потоки для записи (Writable streams) {#writable-streams}

Потоки для записи — это абстракция для *места назначения*, в которое записываются данные.

Примеры потоков [`Writable`](/ru/nodejs/api/stream#class-streamwritable):

- [HTTP запросы на клиенте](/ru/nodejs/api/http#class-httpclientrequest)
- [HTTP ответы на сервере](/ru/nodejs/api/http#class-httpserverresponse)
- [Потоки записи fs](/ru/nodejs/api/fs#class-fswritestream)
- [Потоки zlib](/ru/nodejs/api/zlib)
- [Потоки crypto](/ru/nodejs/api/crypto)
- [TCP сокеты](/ru/nodejs/api/net#class-netsocket)
- [stdin дочернего процесса](/ru/nodejs/api/child_process#subprocessstdin)
- [`process.stdout`](/ru/nodejs/api/process#processstdout), [`process.stderr`](/ru/nodejs/api/process#processstderr)

Некоторые из этих примеров на самом деле являются потоками [`Duplex`](/ru/nodejs/api/stream#class-streamduplex), которые реализуют интерфейс [`Writable`](/ru/nodejs/api/stream#class-streamwritable).

Все потоки [`Writable`](/ru/nodejs/api/stream#class-streamwritable) реализуют интерфейс, определенный классом `stream.Writable`.

Хотя конкретные экземпляры потоков [`Writable`](/ru/nodejs/api/stream#class-streamwritable) могут различаться по-разному, все потоки `Writable` следуют одной и той же фундаментальной схеме использования, как показано в примере ниже:

```js [ESM]
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```
#### Класс: `stream.Writable` {#class-streamwritable}

**Добавлено в версии: v0.9.4**

##### Событие: `'close'` {#event-close}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Добавлен параметр `emitClose` для указания, генерируется ли `'close'` при уничтожении. |
| v0.9.4 | Добавлено в версии: v0.9.4 |
:::

Событие `'close'` возникает, когда поток и любые его базовые ресурсы (например, файловый дескриптор) были закрыты. Событие указывает на то, что больше не будет генерироваться событий и не будет выполняться никаких дальнейших вычислений.

Поток [`Writable`](/ru/nodejs/api/stream#class-streamwritable) всегда будет генерировать событие `'close'`, если он создан с опцией `emitClose`.

##### Событие: `'drain'` {#event-drain}

**Добавлено в версии: v0.9.4**

Если вызов [`stream.write(chunk)`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) возвращает `false`, событие `'drain'` будет сгенерировано, когда будет уместно возобновить запись данных в поток.

```js [ESM]
// Запишите данные в предоставленный поток для записи миллион раз.
// Будьте внимательны к противодавлению.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Последний раз!
        writer.write(data, encoding, callback);
      } else {
        // Посмотрим, следует ли нам продолжить или подождать.
        // Не передавайте обратный вызов, потому что мы еще не закончили.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Пришлось остановиться раньше!
      // Запишите еще немного, как только он опустеет.
      writer.once('drain', write);
    }
  }
}
```

##### Событие: `'error'` {#event-error}

**Добавлено в: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Событие `'error'` возникает при возникновении ошибки при записи или передаче данных по конвейеру. Обратному вызову прослушивателя передается один аргумент `Error` при вызове.

Поток закрывается, когда возникает событие `'error'`, если при создании потока не был установлен параметр [`autoDestroy`](/ru/nodejs/api/stream#new-streamwritableoptions) в значение `false`.

После `'error'` не *должно* возникать никаких других событий, кроме `'close'` (включая события `'error'`).

##### Событие: `'finish'` {#event-finish}

**Добавлено в: v0.9.4**

Событие `'finish'` возникает после вызова метода [`stream.end()`](/ru/nodejs/api/stream#writableendchunk-encoding-callback) и сброса всех данных в базовую систему.

```js [ESM]
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```
##### Событие: `'pipe'` {#event-pipe}

**Добавлено в: v0.9.4**

- `src` [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) исходный поток, который передает данные в этот поток записи

Событие `'pipe'` возникает, когда метод [`stream.pipe()`](/ru/nodejs/api/stream#readablepipedestination-options) вызывается в читаемом потоке, добавляя этот поток записи в набор его назначений.

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```
##### Событие: `'unpipe'` {#event-unpipe}

**Добавлено в: v0.9.4**

- `src` [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) Исходный поток, который [отключил](/ru/nodejs/api/stream#readableunpipedestination) этот поток записи

Событие `'unpipe'` возникает, когда метод [`stream.unpipe()`](/ru/nodejs/api/stream#readableunpipedestination) вызывается в потоке [`Readable`](/ru/nodejs/api/stream#class-streamreadable), удаляя этот [`Writable`](/ru/nodejs/api/stream#class-streamwritable) из набора его назначений.

Это также возникает в случае, если этот поток [`Writable`](/ru/nodejs/api/stream#class-streamwritable) выдает ошибку, когда в него передается поток [`Readable`](/ru/nodejs/api/stream#class-streamreadable).

```js [ESM]
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()` {#writablecork}

**Добавлено в версии: v0.11.2**

Метод `writable.cork()` принудительно буферизует все записанные данные в памяти. Буферизованные данные будут сброшены при вызове методов [`stream.uncork()`](/ru/nodejs/api/stream#writableuncork) или [`stream.end()`](/ru/nodejs/api/stream#writableendchunk-encoding-callback).

Основное назначение `writable.cork()` - это обслуживание ситуации, в которой несколько небольших фрагментов записываются в поток быстро последовательно. Вместо немедленной пересылки их в целевой объект, `writable.cork()` буферизует все фрагменты до вызова `writable.uncork()`, который передаст их все в `writable._writev()`, если он присутствует. Это предотвращает ситуацию блокировки начала строки, когда данные буферизуются во время ожидания обработки первого небольшого фрагмента. Однако использование `writable.cork()` без реализации `writable._writev()` может отрицательно сказаться на пропускной способности.

См. также: [`writable.uncork()`](/ru/nodejs/api/stream#writableuncork), [`writable._writev()`](/ru/nodejs/api/stream#writable_writevchunks-callback).

##### `writable.destroy([error])` {#writabledestroyerror}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Работает как no-op для потока, который уже был уничтожен. |
| v8.0.0 | Добавлено в версии: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Необязательный, ошибка, которую нужно сгенерировать с событием `'error'`.
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Уничтожает поток. При необходимости генерирует событие `'error'` и событие `'close'` (если `emitClose` не установлено в `false`). После этого вызова поток для записи завершается, и последующие вызовы `write()` или `end()` приведут к ошибке `ERR_STREAM_DESTROYED`. Это деструктивный и немедленный способ уничтожить поток. Предыдущие вызовы `write()` могли не быть обработаны и могут вызвать ошибку `ERR_STREAM_DESTROYED`. Используйте `end()` вместо destroy, если данные должны быть сброшены перед закрытием, или дождитесь события `'drain'` перед уничтожением потока.

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```
```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
После того, как `destroy()` был вызван, любые дальнейшие вызовы будут no-op, и никакие другие ошибки, кроме `_destroy()`, не могут быть сгенерированы как `'error'`.

Реализаторы не должны переопределять этот метод, а вместо этого должны реализовать [`writable._destroy()`](/ru/nodejs/api/stream#writable_destroyerr-callback).


##### `writable.closed` {#writableclosed}

**Добавлено в версии: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Принимает значение `true` после того, как было сгенерировано событие `'close'`.

##### `writable.destroyed` {#writabledestroyed}

**Добавлено в версии: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Принимает значение `true` после вызова [`writable.destroy()`](/ru/nodejs/api/stream#writabledestroyerror).

```js [CJS]
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```
##### `writable.end([chunk[, encoding]][, callback])` {#writableendchunk-encoding-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Аргумент `chunk` теперь может быть экземпляром `TypedArray` или `DataView`. |
| v15.0.0 | `callback` вызывается перед 'finish' или при ошибке. |
| v14.0.0 | `callback` вызывается, если генерируется 'finish' или 'error'. |
| v10.0.0 | Этот метод теперь возвращает ссылку на `writable`. |
| v8.0.0 | Аргумент `chunk` теперь может быть экземпляром `Uint8Array`. |
| v0.9.4 | Добавлено в версии: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные данные для записи. Для потоков, не работающих в объектном режиме, `chunk` должен быть [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) или [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Для потоков объектного режима `chunk` может быть любым значением JavaScript, отличным от `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка, если `chunk` является строкой.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Обратный вызов, когда поток завершен.
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Вызов метода `writable.end()` сигнализирует о том, что в [`Writable`](/ru/nodejs/api/stream#class-streamwritable) больше не будет записано данных. Необязательные аргументы `chunk` и `encoding` позволяют записать один последний дополнительный фрагмент данных непосредственно перед закрытием потока.

Вызов метода [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) после вызова [`stream.end()`](/ru/nodejs/api/stream#writableendchunk-encoding-callback) вызовет ошибку.

```js [ESM]
// Записать 'hello, ', а затем закончить 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Запись больше не разрешена!
```

##### `writable.setDefaultEncoding(encoding)` {#writablesetdefaultencodingencoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.1.0 | Этот метод теперь возвращает ссылку на `writable`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Новая кодировка по умолчанию
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Метод `writable.setDefaultEncoding()` устанавливает кодировку `encoding` по умолчанию для потока [`Writable`](/ru/nodejs/api/stream#class-streamwritable).

##### `writable.uncork()` {#writableuncork}

**Добавлено в: v0.11.2**

Метод `writable.uncork()` сбрасывает все данные, буферизованные с момента вызова [`stream.cork()`](/ru/nodejs/api/stream#writablecork).

При использовании [`writable.cork()`](/ru/nodejs/api/stream#writablecork) и `writable.uncork()` для управления буферизацией записей в поток, отложите вызовы `writable.uncork()` с помощью `process.nextTick()`. Это позволяет объединять все вызовы `writable.write()`, которые происходят в пределах заданной фазы цикла событий Node.js.

```js [ESM]
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```
Если метод [`writable.cork()`](/ru/nodejs/api/stream#writablecork) вызывается несколько раз для потока, то для сброса буферизованных данных необходимо вызвать такое же количество раз `writable.uncork()`.

```js [ESM]
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // Данные не будут сброшены, пока uncork() не будет вызвана во второй раз.
  stream.uncork();
});
```
См. также: [`writable.cork()`](/ru/nodejs/api/stream#writablecork).

##### `writable.writable` {#writablewritable}

**Добавлено в: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Принимает значение `true`, если безопасно вызывать [`writable.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback), что означает, что поток не был уничтожен, не выдал ошибку и не завершен.

##### `writable.writableAborted` {#writablewritableaborted}

**Добавлено в: v18.0.0, v16.17.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает, был ли поток уничтожен или произошла ли в нем ошибка до возникновения события `'finish'`.


##### `writable.writableEnded` {#writablewritableended}

**Добавлено в версии: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Имеет значение `true` после вызова [`writable.end()`](/ru/nodejs/api/stream#writableendchunk-encoding-callback). Это свойство не указывает, были ли данные сброшены; для этого используйте [`writable.writableFinished`](/ru/nodejs/api/stream#writablewritablefinished) вместо этого.

##### `writable.writableCorked` {#writablewritablecorked}

**Добавлено в версии: v13.2.0, v12.16.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество раз, которое необходимо вызвать [`writable.uncork()`](/ru/nodejs/api/stream#writableuncork), чтобы полностью расконсервировать поток.

##### `writable.errored` {#writableerrored}

**Добавлено в версии: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Возвращает ошибку, если поток был уничтожен с ошибкой.

##### `writable.writableFinished` {#writablewritablefinished}

**Добавлено в версии: v12.6.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Устанавливается в значение `true` непосредственно перед тем, как будет сгенерировано событие [`'finish'`](/ru/nodejs/api/stream#event-finish).

##### `writable.writableHighWaterMark` {#writablewritablehighwatermark}

**Добавлено в версии: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает значение `highWaterMark`, переданное при создании этого `Writable`.

##### `writable.writableLength` {#writablewritablelength}

**Добавлено в версии: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Это свойство содержит количество байтов (или объектов) в очереди, готовых к записи. Значение предоставляет данные для интроспекции относительно статуса `highWaterMark`.

##### `writable.writableNeedDrain` {#writablewritableneeddrain}

**Добавлено в версии: v15.2.0, v14.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Имеет значение `true`, если буфер потока был заполнен и поток будет генерировать `'drain'`.


##### `writable.writableObjectMode` {#writablewritableobjectmode}

**Добавлено в версии: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter для свойства `objectMode` заданного потока `Writable`.

##### `writable[Symbol.asyncDispose]()` {#writablesymbolasyncdispose}

**Добавлено в версии: v22.4.0, v20.16.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Вызывает [`writable.destroy()`](/ru/nodejs/api/stream#writabledestroyerror) с `AbortError` и возвращает промис, который выполняется, когда поток завершается.

##### `writable.write(chunk[, encoding][, callback])` {#writablewritechunk-encoding-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Аргумент `chunk` теперь может быть экземпляром `TypedArray` или `DataView`. |
| v8.0.0 | Аргумент `chunk` теперь может быть экземпляром `Uint8Array`. |
| v6.0.0 | Передача `null` в качестве параметра `chunk` теперь всегда считается недействительной, даже в объектном режиме. |
| v0.9.4 | Добавлено в версии: v0.9.4 |
:::

- `chunk` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные данные для записи. Для потоков, не работающих в объектном режиме, `chunk` должен быть [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) или [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Для потоков в объектном режиме `chunk` может быть любым значением JavaScript, отличным от `null`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Кодировка, если `chunk` является строкой. **По умолчанию:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, вызываемая при сбросе этого фрагмента данных.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если поток желает, чтобы вызывающий код подождал, пока не будет сгенерировано событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

Метод `writable.write()` записывает некоторые данные в поток и вызывает предоставленный `callback` после полной обработки данных. Если возникает ошибка, `callback` вызывается с ошибкой в качестве первого аргумента. `callback` вызывается асинхронно и до генерации события `'error'`.

Возвращаемое значение равно `true`, если внутренний буфер меньше, чем `highWaterMark`, настроенный при создании потока после добавления `chunk`. Если возвращается `false`, дальнейшие попытки записи данных в поток следует остановить до тех пор, пока не будет сгенерировано событие [`'drain'`](/ru/nodejs/api/stream#event-drain).

Пока поток не дренируется, вызовы `write()` будут буферизировать `chunk` и возвращать false. Как только все текущие буферизованные фрагменты будут дренированы (приняты операционной системой для доставки), будет сгенерировано событие `'drain'`. Как только `write()` возвращает false, не записывайте больше фрагментов, пока не будет сгенерировано событие `'drain'`. Хотя вызов `write()` в потоке, который не дренируется, разрешен, Node.js будет буферизировать все записанные фрагменты до тех пор, пока не будет достигнуто максимальное использование памяти, после чего он безусловно прервется. Даже до того, как он прервется, высокое использование памяти приведет к низкой производительности сборщика мусора и высокому RSS (который обычно не возвращается в систему, даже после того, как память больше не требуется). Поскольку TCP-сокеты могут никогда не дренироваться, если удаленный пир не читает данные, запись в сокет, который не дренируется, может привести к уязвимости, которую можно использовать удаленно.

Запись данных, пока поток не дренируется, особенно проблематична для [`Transform`](/ru/nodejs/api/stream#class-streamtransform), поскольку потоки `Transform` по умолчанию приостановлены, пока они не будут переданы по конвейеру или не будет добавлен обработчик событий `'data'` или `'readable'`.

Если данные, которые необходимо записать, можно сгенерировать или получить по запросу, рекомендуется инкапсулировать логику в [`Readable`](/ru/nodejs/api/stream#class-streamreadable) и использовать [`stream.pipe()`](/ru/nodejs/api/stream#readablepipedestination-options). Однако, если предпочтительнее вызывать `write()`, можно учитывать противодавление и избежать проблем с памятью, используя событие [`'drain'`](/ru/nodejs/api/stream#event-drain):

```js [ESM]
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// Wait for cb to be called before doing any other write.
write('hello', () => {
  console.log('Write completed, do more writes now.');
});
```
Поток `Writable` в объектном режиме всегда игнорирует аргумент `encoding`.


### Читаемые потоки (Readable streams) {#readable-streams}

Читаемые потоки - это абстракция для *источника*, из которого потребляются данные.

Примеры потоков `Readable`:

- [HTTP ответы на стороне клиента](/ru/nodejs/api/http#class-httpincomingmessage)
- [HTTP запросы на стороне сервера](/ru/nodejs/api/http#class-httpincomingmessage)
- [Потоки чтения fs](/ru/nodejs/api/fs#class-fsreadstream)
- [Потоки zlib](/ru/nodejs/api/zlib)
- [Потоки crypto](/ru/nodejs/api/crypto)
- [TCP сокеты](/ru/nodejs/api/net#class-netsocket)
- [Stdout и stderr дочернего процесса](/ru/nodejs/api/child_process#subprocessstdout)
- [`process.stdin`](/ru/nodejs/api/process#processstdin)

Все [`Readable`](/ru/nodejs/api/stream#class-streamreadable) потоки реализуют интерфейс, определенный классом `stream.Readable`.

#### Два режима чтения {#two-reading-modes}

`Readable` потоки эффективно работают в одном из двух режимов: потоковом и приостановленном. Эти режимы отделены от [режима объектов](/ru/nodejs/api/stream#object-mode). Поток [`Readable`](/ru/nodejs/api/stream#class-streamreadable) может быть в режиме объектов или нет, независимо от того, находится ли он в потоковом режиме или в приостановленном режиме.

- В потоковом режиме данные считываются из базовой системы автоматически и предоставляются приложению как можно быстрее с использованием событий через интерфейс [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter).
- В приостановленном режиме метод [`stream.read()`](/ru/nodejs/api/stream#readablereadsize) должен вызываться явно для чтения блоков данных из потока.

Все [`Readable`](/ru/nodejs/api/stream#class-streamreadable) потоки начинаются в приостановленном режиме, но могут быть переключены в потоковый режим одним из следующих способов:

- Добавление обработчика события [`'data'`](/ru/nodejs/api/stream#event-data).
- Вызов метода [`stream.resume()`](/ru/nodejs/api/stream#readableresume).
- Вызов метода [`stream.pipe()`](/ru/nodejs/api/stream#readablepipedestination-options) для отправки данных в [`Writable`](/ru/nodejs/api/stream#class-streamwritable).

`Readable` может переключиться обратно в приостановленный режим одним из следующих способов:

- Если нет направлений pipe, то вызовом метода [`stream.pause()`](/ru/nodejs/api/stream#readablepause).
- Если есть направления pipe, то удалением всех направлений pipe. Несколько направлений pipe можно удалить, вызвав метод [`stream.unpipe()`](/ru/nodejs/api/stream#readableunpipedestination).

Важно помнить, что `Readable` не будет генерировать данные до тех пор, пока не будет предоставлен механизм для потребления или игнорирования этих данных. Если механизм потребления отключен или удален, `Readable` *попытается* прекратить генерацию данных.

По соображениям обратной совместимости удаление обработчиков событий [`'data'`](/ru/nodejs/api/stream#event-data) **не** будет автоматически приостанавливать поток. Кроме того, если есть направления pipe, то вызов [`stream.pause()`](/ru/nodejs/api/stream#readablepause) не гарантирует, что поток *останется* приостановленным, как только эти направления иссякнут и запросят больше данных.

Если [`Readable`](/ru/nodejs/api/stream#class-streamreadable) переключен в потоковый режим и нет потребителей, доступных для обработки данных, эти данные будут потеряны. Это может произойти, например, когда вызывается метод `readable.resume()` без слушателя, прикрепленного к событию `'data'`, или когда обработчик события `'data'` удаляется из потока.

Добавление обработчика события [`'readable'`](/ru/nodejs/api/stream#event-readable) автоматически заставляет поток прекратить поток, и данные должны быть потреблены через [`readable.read()`](/ru/nodejs/api/stream#readablereadsize). Если обработчик события [`'readable'`](/ru/nodejs/api/stream#event-readable) удален, то поток снова начнет течь, если есть обработчик события [`'data'`](/ru/nodejs/api/stream#event-data).


#### Три состояния {#three-states}

"Два режима" работы для потока `Readable` являются упрощенной абстракцией для более сложного внутреннего управления состоянием, происходящего внутри реализации потока `Readable`.

В частности, в любой заданный момент времени каждый `Readable` находится в одном из трех возможных состояний:

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

Когда `readable.readableFlowing` равен `null`, не предоставляется никакого механизма для потребления данных потока. Поэтому поток не будет генерировать данные. Находясь в этом состоянии, присоединение слушателя для события `'data'`, вызов метода `readable.pipe()` или вызов метода `readable.resume()` переключит `readable.readableFlowing` в `true`, что приведет к тому, что `Readable` начнет активно генерировать события по мере генерации данных.

Вызов `readable.pause()`, `readable.unpipe()` или получение обратного давления приведет к тому, что `readable.readableFlowing` будет установлен как `false`, временно приостанавливая поток событий, но *не* останавливая генерацию данных. Находясь в этом состоянии, присоединение слушателя для события `'data'` не переключит `readable.readableFlowing` в `true`.

```js [ESM]
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing теперь false.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing все еще false.
pass.write('ok');  // Не будет генерировать 'data'.
pass.resume();     // Должен быть вызван, чтобы поток генерировал 'data'.
// readableFlowing теперь true.
```
Пока `readable.readableFlowing` имеет значение `false`, данные могут накапливаться во внутреннем буфере потока.

#### Выберите один стиль API {#choose-one-api-style}

API потока `Readable` развивался в нескольких версиях Node.js и предоставляет несколько методов потребления данных потока. В общем, разработчикам следует выбрать *один* из методов потребления данных и *никогда не следует* использовать несколько методов для потребления данных из одного потока. В частности, использование комбинации `on('data')`, `on('readable')`, `pipe()` или асинхронных итераторов может привести к неинтуитивному поведению.


#### Класс: `stream.Readable` {#class-streamreadable}

**Добавлено в: v0.9.4**

##### Событие: `'close'` {#event-close_1}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Добавлена опция `emitClose`, чтобы указать, нужно ли генерировать событие `'close'` при уничтожении. |
| v0.9.4 | Добавлено в: v0.9.4 |
:::

Событие `'close'` генерируется, когда поток и любые его базовые ресурсы (например, файловый дескриптор) были закрыты. Событие указывает на то, что больше событий не будет генерироваться и дальнейшие вычисления не будут выполняться.

Поток [`Readable`](/ru/nodejs/api/stream#class-streamreadable) всегда будет генерировать событие `'close'`, если он создан с опцией `emitClose`.

##### Событие: `'data'` {#event-data}

**Добавлено в: v0.9.4**

- `chunk` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Часть данных. Для потоков, которые не работают в объектном режиме, фрагмент будет либо строкой, либо `Buffer`. Для потоков, которые находятся в объектном режиме, фрагмент может быть любым значением JavaScript, отличным от `null`.

Событие `'data'` генерируется всякий раз, когда поток передает право собственности на фрагмент данных потребителю. Это может произойти всякий раз, когда поток переключается в режим потока путем вызова `readable.pipe()`, `readable.resume()` или путем присоединения обратного вызова прослушивателя к событию `'data'`. Событие `'data'` также будет генерироваться всякий раз, когда вызывается метод `readable.read()` и доступен фрагмент данных для возврата.

Присоединение прослушивателя события `'data'` к потоку, который не был явно приостановлен, переключит поток в режим потока. Данные будут передаваться, как только они станут доступны.

Обратному вызову прослушивателя будет передан фрагмент данных в виде строки, если для потока была указана кодировка по умолчанию с использованием метода `readable.setEncoding()`; в противном случае данные будут переданы в виде `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

##### Событие: `'end'` {#event-end}

**Добавлено в версии: v0.9.4**

Событие `'end'` генерируется, когда в потоке больше нет данных для потребления.

Событие `'end'` **не будет сгенерировано**, пока данные не будут полностью потреблены. Этого можно достичь, переключив поток в режим потока (flowing mode) или многократно вызывая [`stream.read()`](/ru/nodejs/api/stream#readablereadsize), пока все данные не будут потреблены.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Получено ${chunk.length} байт данных.`);
});
readable.on('end', () => {
  console.log('Больше данных не будет.');
});
```
##### Событие: `'error'` {#event-error_1}

**Добавлено в версии: v0.9.4**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Событие `'error'` может быть сгенерировано реализацией `Readable` в любое время. Как правило, это может произойти, если базовый поток не может сгенерировать данные из-за внутренней ошибки или когда реализация потока пытается передать недопустимый блок данных.

Обратному вызову слушателя будет передан один объект `Error`.

##### Событие: `'pause'` {#event-pause}

**Добавлено в версии: v0.9.4**

Событие `'pause'` генерируется, когда вызывается [`stream.pause()`](/ru/nodejs/api/stream#readablepause) и `readableFlowing` не равно `false`.

##### Событие: `'readable'` {#event-readable}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Событие `'readable'` всегда генерируется в следующем тике после вызова `.push()`. |
| v10.0.0 | Использование `'readable'` требует вызова `.read()`. |
| v0.9.4 | Добавлено в версии: v0.9.4 |
:::

Событие `'readable'` генерируется, когда в потоке есть данные, доступные для чтения, вплоть до настроенной максимальной отметки воды (`state.highWaterMark`). Фактически, это указывает на то, что в буфере потока есть новая информация. Если данные доступны в этом буфере, можно вызвать [`stream.read()`](/ru/nodejs/api/stream#readablereadsize) для получения этих данных. Кроме того, событие `'readable'` также может быть сгенерировано при достижении конца потока.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // Теперь есть данные для чтения.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```
Если конец потока был достигнут, вызов [`stream.read()`](/ru/nodejs/api/stream#readablereadsize) вернет `null` и вызовет событие `'end'`. Это также верно, если данных для чтения никогда не было. Например, в следующем примере `foo.txt` является пустым файлом:

```js [ESM]
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```
Результат выполнения этого скрипта:

```bash [BASH]
$ node test.js
readable: null
end
```
В некоторых случаях подключение слушателя для события `'readable'` приведет к чтению некоторого количества данных во внутренний буфер.

В общем, механизмы `readable.pipe()` и события `'data'` легче понять, чем событие `'readable'`. Однако обработка `'readable'` может привести к увеличению пропускной способности.

Если `'readable'` и [`'data'`](/ru/nodejs/api/stream#event-data) используются одновременно, `'readable'` имеет приоритет в управлении потоком, то есть `'data'` будет генерироваться только при вызове [`stream.read()`](/ru/nodejs/api/stream#readablereadsize). Свойство `readableFlowing` станет `false`. Если есть слушатели `'data'`, когда `'readable'` удаляется, поток начнет течь, то есть события `'data'` будут генерироваться без вызова `.resume()`.


##### Событие: `'resume'` {#event-resume}

**Добавлено в: v0.9.4**

Событие `'resume'` генерируется, когда вызывается [`stream.resume()`](/ru/nodejs/api/stream#readableresume) и `readableFlowing` не является `true`.

##### `readable.destroy([error])` {#readabledestroyerror}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Работает как no-op для потока, который уже был уничтожен. |
| v8.0.0 | Добавлено в: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ошибка, которая будет передана в качестве полезной нагрузки в событии `'error'`
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Уничтожает поток. Необязательно генерирует событие `'error'` и событие `'close'` (если `emitClose` не установлено в `false`). После этого вызова читаемый поток освободит все внутренние ресурсы, и последующие вызовы `push()` будут игнорироваться.

После того как `destroy()` был вызван, любые дальнейшие вызовы будут no-op, и никакие дальнейшие ошибки, кроме как от `_destroy()`, не могут быть сгенерированы как `'error'`.

Реализаторам не следует переопределять этот метод, а вместо этого следует реализовать [`readable._destroy()`](/ru/nodejs/api/stream#readable_destroyerr-callback).

##### `readable.closed` {#readableclosed}

**Добавлено в: v18.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Имеет значение `true` после того, как было сгенерировано событие `'close'`.

##### `readable.destroyed` {#readabledestroyed}

**Добавлено в: v8.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Имеет значение `true` после вызова [`readable.destroy()`](/ru/nodejs/api/stream#readabledestroyerror).

##### `readable.isPaused()` {#readableispaused}

**Добавлено в: v0.11.14**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Метод `readable.isPaused()` возвращает текущее рабочее состояние `Readable`. Это в основном используется механизмом, который лежит в основе метода `readable.pipe()`. В большинстве типичных случаев нет причин использовать этот метод напрямую.

```js [ESM]
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()` {#readablepause}

**Добавлено в версии: v0.9.4**

- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Метод `readable.pause()` заставляет поток в режиме потока (flowing mode) прекратить генерировать события [`'data'`](/ru/nodejs/api/stream#event-data), выходя из режима потока. Любые данные, которые становятся доступными, остаются во внутреннем буфере.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Получено ${chunk.length} байт данных.`);
  readable.pause();
  console.log('Дополнительных данных не будет в течение 1 секунды.');
  setTimeout(() => {
    console.log('Теперь данные снова начнут поступать.');
    readable.resume();
  }, 1000);
});
```
Метод `readable.pause()` не имеет эффекта, если есть слушатель события `'readable'`.

##### `readable.pipe(destination[, options])` {#readablepipedestination-options}

**Добавлено в версии: v0.9.4**

- `destination` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable) Место назначения для записи данных
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры конвейера
    - `end` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Завершить запись, когда чтение завершится. **По умолчанию:** `true`.
  
 
- Возвращает: [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable) *Назначение*, позволяющее создавать цепочку конвейеров, если это поток [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) или [`Transform`](/ru/nodejs/api/stream#class-streamtransform)

Метод `readable.pipe()` присоединяет поток [`Writable`](/ru/nodejs/api/stream#class-streamwritable) к `readable`, заставляя его автоматически переключаться в режим потока и отправлять все свои данные в присоединенный [`Writable`](/ru/nodejs/api/stream#class-streamwritable). Поток данных будет автоматически управляться, чтобы поток `Writable` назначения не был перегружен более быстрым потоком `Readable`.

Следующий пример перенаправляет все данные из `readable` в файл с именем `file.txt`:

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Все данные из readable попадают в 'file.txt'.
readable.pipe(writable);
```
Можно подключить несколько потоков `Writable` к одному потоку `Readable`.

Метод `readable.pipe()` возвращает ссылку на поток *назначения*, что позволяет создавать цепочки конвейерных потоков:

```js [ESM]
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```
По умолчанию, [`stream.end()`](/ru/nodejs/api/stream#writableendchunk-encoding-callback) вызывается для потока `Writable` назначения, когда исходный поток `Readable` выдает [`'end'`](/ru/nodejs/api/stream#event-end), так что место назначения больше не доступно для записи. Чтобы отключить это поведение по умолчанию, опция `end` может быть передана как `false`, в результате чего поток назначения останется открытым:

```js [ESM]
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```
Важное предостережение: если поток `Readable` выдает ошибку во время обработки, `Writable` назначение *не закрывается* автоматически. Если произошла ошибка, необходимо *вручную* закрыть каждый поток, чтобы предотвратить утечки памяти.

Потоки `Writable` [`process.stderr`](/ru/nodejs/api/process#processstderr) и [`process.stdout`](/ru/nodejs/api/process#processstdout) никогда не закрываются до тех пор, пока не завершится процесс Node.js, независимо от указанных параметров.


##### `readable.read([size])` {#readablereadsize}

**Добавлено в: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательный аргумент для указания объема данных для чтения.
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Метод `readable.read()` считывает данные из внутреннего буфера и возвращает их. Если нет доступных для чтения данных, возвращается `null`. По умолчанию данные возвращаются в виде объекта `Buffer`, если только не было указано кодирование с помощью метода `readable.setEncoding()` или поток не работает в объектном режиме.

Необязательный аргумент `size` определяет конкретное количество байтов для чтения. Если `size` байтов недоступны для чтения, будет возвращено `null` *если только* поток не завершен, в этом случае будут возвращены все данные, оставшиеся во внутреннем буфере.

Если аргумент `size` не указан, будут возвращены все данные, содержащиеся во внутреннем буфере.

Аргумент `size` должен быть меньше или равен 1 ГиБ.

Метод `readable.read()` следует вызывать только для потоков `Readable`, работающих в приостановленном режиме. В режиме потока `readable.read()` вызывается автоматически до тех пор, пока внутренний буфер не будет полностью очищен.

```js [ESM]
const readable = getReadableStreamSomehow();

// 'readable' может срабатывать несколько раз по мере буферизации данных
readable.on('readable', () => {
  let chunk;
  console.log('Stream is readable (new data received in buffer)');
  // Используйте цикл, чтобы убедиться, что мы прочитали все доступные в данный момент данные
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// 'end' будет вызван один раз, когда больше не будет доступных данных
readable.on('end', () => {
  console.log('Reached end of stream.');
});
```
Каждый вызов `readable.read()` возвращает фрагмент данных или `null`, что означает отсутствие дополнительных данных для чтения в данный момент. Эти фрагменты не объединяются автоматически. Поскольку один вызов `read()` не возвращает все данные, может потребоваться использование цикла while для непрерывного чтения фрагментов до тех пор, пока все данные не будут получены. При чтении большого файла `.read()` может временно вернуть `null`, указывая на то, что он израсходовал все буферизованное содержимое, но могут быть еще данные для буферизации. В таких случаях новое событие `'readable'` генерируется, как только в буфере появляется больше данных, а событие `'end'` означает конец передачи данных.

Поэтому для чтения всего содержимого файла из `readable` необходимо собирать фрагменты по нескольким событиям `'readable'`:

```js [ESM]
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```
Поток `Readable` в объектном режиме всегда будет возвращать один элемент из вызова [`readable.read(size)`](/ru/nodejs/api/stream#readablereadsize), независимо от значения аргумента `size`.

Если метод `readable.read()` возвращает фрагмент данных, также будет сгенерировано событие `'data'`.

Вызов [`stream.read([size])`](/ru/nodejs/api/stream#readablereadsize) после того, как было сгенерировано событие [`'end'`](/ru/nodejs/api/stream#event-end), вернет `null`. Ошибка времени выполнения не возникнет.


##### `readable.readable` {#readablereadable}

**Добавлено в: v11.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true`, если безопасно вызывать [`readable.read()`](/ru/nodejs/api/stream#readablereadsize), что означает, что поток не был уничтожен или не сгенерировал `'error'` или `'end'`.

##### `readable.readableAborted` {#readablereadableaborted}

**Добавлено в: v16.8.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает, был ли поток уничтожен или произошла ли в нем ошибка до генерации `'end'`.

##### `readable.readableDidRead` {#readablereadabledidread}

**Добавлено в: v16.7.0, v14.18.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает, был ли сгенерирован `'data'`.

##### `readable.readableEncoding` {#readablereadableencoding}

**Добавлено в: v12.7.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Getter для свойства `encoding` заданного потока `Readable`. Свойство `encoding` можно установить с помощью метода [`readable.setEncoding()`](/ru/nodejs/api/stream#readablesetencodingencoding).

##### `readable.readableEnded` {#readablereadableended}

**Добавлено в: v12.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Становится `true`, когда сгенерировано событие [`'end'`](/ru/nodejs/api/stream#event-end).

##### `readable.errored` {#readableerrored}

**Добавлено в: v18.0.0**

- [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Возвращает ошибку, если поток был уничтожен с ошибкой.

##### `readable.readableFlowing` {#readablereadableflowing}

**Добавлено в: v9.4.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Это свойство отражает текущее состояние потока `Readable`, как описано в разделе [Три состояния](/ru/nodejs/api/stream#three-states).


##### `readable.readableHighWaterMark` {#readablereadablehighwatermark}

**Добавлено в версии: v9.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает значение `highWaterMark`, переданное при создании этого `Readable`.

##### `readable.readableLength` {#readablereadablelength}

**Добавлено в версии: v9.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Это свойство содержит количество байтов (или объектов) в очереди, готовых к чтению. Значение предоставляет данные для анализа состояния `highWaterMark`.

##### `readable.readableObjectMode` {#readablereadableobjectmode}

**Добавлено в версии: v12.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Getter для свойства `objectMode` заданного потока `Readable`.

##### `readable.resume()` {#readableresume}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | `resume()` не действует, если прослушивается событие `'readable'`. |
| v0.9.4 | Добавлено в версии: v0.9.4 |
:::

- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Метод `readable.resume()` заставляет явно приостановленный поток `Readable` возобновить выдачу событий [`'data'`](/ru/nodejs/api/stream#event-data), переключая поток в режим потоковой передачи.

Метод `readable.resume()` можно использовать для полного использования данных из потока без фактической обработки каких-либо из этих данных:

```js [ESM]
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Достигнут конец, но ничего не прочитано.');
  });
```
Метод `readable.resume()` не имеет никакого эффекта, если есть прослушиватель событий `'readable'`.

##### `readable.setEncoding(encoding)` {#readablesetencodingencoding}

**Добавлено в версии: v0.9.4**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка для использования.
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Метод `readable.setEncoding()` устанавливает кодировку символов для данных, считываемых из потока `Readable`.

По умолчанию кодировка не назначается, и данные потока будут возвращаться в виде объектов `Buffer`. Установка кодировки приводит к тому, что данные потока возвращаются в виде строк указанной кодировки, а не в виде объектов `Buffer`. Например, вызов `readable.setEncoding('utf8')` приведет к тому, что выходные данные будут интерпретироваться как данные UTF-8 и передаваться как строки. Вызов `readable.setEncoding('hex')` приведет к тому, что данные будут закодированы в шестнадцатеричном строковом формате.

Поток `Readable` будет правильно обрабатывать многобайтовые символы, передаваемые через поток, которые в противном случае были бы неправильно декодированы, если бы их просто извлекали из потока в виде объектов `Buffer`.

```js [ESM]
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Получено %d символов строковых данных:', chunk.length);
});
```

##### `readable.unpipe([destination])` {#readableunpipedestination}

**Добавлено в: v0.9.4**

- `destination` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable) Необязательный конкретный поток для отсоединения.
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Метод `readable.unpipe()` отсоединяет поток `Writable`, ранее присоединённый с использованием метода [`stream.pipe()`](/ru/nodejs/api/stream#readablepipedestination-options).

Если `destination` не указан, то отсоединяются *все* каналы.

Если `destination` указан, но для него не настроен канал, то метод ничего не делает.

```js [ESM]
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// Все данные из readable попадают в 'file.txt',
// но только в течение первой секунды.
readable.pipe(writable);
setTimeout(() => {
  console.log('Прекращаем запись в file.txt.');
  readable.unpipe(writable);
  console.log('Закрываем файловый поток вручную.');
  writable.end();
}, 1000);
```
##### `readable.unshift(chunk[, encoding])` {#readableunshiftchunk-encoding}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Аргумент `chunk` теперь может быть экземпляром `TypedArray` или `DataView`. |
| v8.0.0 | Аргумент `chunk` теперь может быть экземпляром `Uint8Array`. |
| v0.9.11 | Добавлено в: v0.9.11 |
:::

- `chunk` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Фрагмент данных для возврата в очередь чтения. Для потоков, не работающих в объектном режиме, `chunk` должен быть [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) или `null`. Для потоков в объектном режиме `chunk` может быть любым значением JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строковых фрагментов. Должна быть допустимой кодировкой `Buffer`, например `'utf8'` или `'ascii'`.

Передача `chunk` как `null` сигнализирует о конце потока (EOF) и ведет себя так же, как `readable.push(null)`, после чего больше нельзя записывать данные. Сигнал EOF помещается в конец буфера, и все буферизованные данные все равно будут сброшены.

Метод `readable.unshift()` возвращает фрагмент данных обратно во внутренний буфер. Это полезно в определенных ситуациях, когда поток используется кодом, которому необходимо "отменить использование" некоторого количества данных, которые он оптимистично извлек из источника, чтобы данные могли быть переданы другой стороне.

Метод `stream.unshift(chunk)` нельзя вызывать после того, как было сгенерировано событие [`'end'`](/ru/nodejs/api/stream#event-end), иначе будет выдана ошибка времени выполнения.

Разработчикам, использующим `stream.unshift()`, часто следует рассмотреть возможность перехода к использованию потока [`Transform`](/ru/nodejs/api/stream#class-streamtransform). Дополнительную информацию см. в разделе [API для разработчиков потоков](/ru/nodejs/api/stream#api-for-stream-implementers).

```js [ESM]
// Извлечь заголовок, ограниченный \n\n.
// Используйте unshift(), если мы получим слишком много.
// Вызовите обратный вызов с (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Найден разделитель заголовка.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Удалите прослушиватель 'readable' перед unshifting.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Теперь тело сообщения можно прочитать из потока.
        callback(null, header, stream);
        return;
      }
      // Все еще читаем заголовок.
      header += str;
    }
  }
}
```
В отличие от [`stream.push(chunk)`](/ru/nodejs/api/stream#readablepushchunk-encoding), `stream.unshift(chunk)` не завершит процесс чтения, сбросив внутреннее состояние чтения потока. Это может привести к неожиданным результатам, если `readable.unshift()` вызывается во время чтения (т.е. из реализации [`stream._read()`](/ru/nodejs/api/stream#readable_readsize) в пользовательском потоке). После вызова `readable.unshift()` с немедленным [`stream.push('')`](/ru/nodejs/api/stream#readablepushchunk-encoding) состояние чтения будет сброшено соответствующим образом, однако лучше просто избегать вызова `readable.unshift()` во время выполнения чтения.


##### `readable.wrap(stream)` {#readablewrapstream}

**Добавлено в: v0.9.4**

- `stream` [\<Stream\>](/ru/nodejs/api/stream#stream) "Старый" читаемый поток
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

До Node.js 0.10 потоки не реализовывали весь API модуля `node:stream` в том виде, в котором он определен в настоящее время. (Для получения дополнительной информации см. [Совместимость](/ru/nodejs/api/stream#compatibility-with-older-nodejs-versions).)

При использовании более старой библиотеки Node.js, которая генерирует события [`'data'`](/ru/nodejs/api/stream#event-data) и имеет метод [`stream.pause()`](/ru/nodejs/api/stream#readablepause), который носит только рекомендательный характер, метод `readable.wrap()` можно использовать для создания потока [`Readable`](/ru/nodejs/api/stream#class-streamreadable), который использует старый поток в качестве источника данных.

Использовать `readable.wrap()` потребуется редко, но этот метод был предоставлен для удобства взаимодействия со старыми приложениями и библиотеками Node.js.

```js [ESM]
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // и т.д.
});
```
##### `readable[Symbol.asyncIterator]()` {#readablesymbolasynciterator}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.14.0 | Поддержка Symbol.asyncIterator больше не является экспериментальной. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- Возвращает: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) для полного использования потока.

```js [ESM]
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```
Если цикл завершается с помощью `break`, `return` или `throw`, поток будет уничтожен. Другими словами, итерация по потоку полностью использует поток. Поток будет считываться кусками размера, равного опции `highWaterMark`. В приведенном выше примере кода данные будут в одном куске, если файл содержит менее 64 КиБ данных, поскольку для [`fs.createReadStream()`](/ru/nodejs/api/fs#fscreatereadstreampath-options) не предусмотрена опция `highWaterMark`.


##### `readable[Symbol.asyncDispose]()` {#readablesymbolasyncdispose}

**Добавлено в: v20.4.0, v18.18.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

Вызывает [`readable.destroy()`](/ru/nodejs/api/stream#readabledestroyerror) с `AbortError` и возвращает промис, который разрешается, когда поток завершен.

##### `readable.compose(stream[, options])` {#readablecomposestream-options}

**Добавлено в: v19.1.0, v18.13.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

- `stream` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.


- Возвращает: [\<Duplex\>](/ru/nodejs/api/stream#class-streamduplex) поток, скомпонованный с потоком `stream`.

```js [ESM]
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['this is', 'compose as operator']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // prints ['this', 'is', 'compose', 'as', 'operator']
```
См. [`stream.compose`](/ru/nodejs/api/stream#streamcomposestreams) для получения дополнительной информации.

##### `readable.iterator([options])` {#readableiteratoroptions}

**Добавлено в: v16.3.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `destroyOnReturn` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `false`, вызов `return` для асинхронного итератора или выход из итерации `for await...of` с использованием `break`, `return` или `throw` не уничтожит поток. **По умолчанию:** `true`.


- Возвращает: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) для потребления потока.

Итератор, созданный этим методом, дает пользователям возможность отменить уничтожение потока, если цикл `for await...of` завершен с помощью `return`, `break` или `throw`, или если итератор должен уничтожить поток, если поток выдал ошибку во время итерации.

```js [ESM]
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Will print 2 and then 3
  }

  console.log(readable.destroyed); // True, stream was totally consumed
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])` {#readablemapfn-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.7.0, v18.19.0 | добавлено `highWaterMark` в options. |
| v17.4.0, v16.14.0 | Добавлено в: v17.4.0, v16.14.0 |
:::

::: warning [Стабильность: 1 - Экспериментальное]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальное
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) функция для отображения каждого фрагмента в потоке.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) фрагмент данных из потока.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) прерывается, если поток уничтожен, что позволяет прервать вызов `fn` раньше.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) максимальное количество одновременных вызовов `fn` к потоку за один раз. **По умолчанию:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) сколько элементов буферизовать во время ожидания потребления пользователем отображенных элементов. **По умолчанию:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.
  
 
- Возвращает: [\<Readable\>](/ru/nodejs/api/stream#class-streamreadable) поток, отображенный с помощью функции `fn`.

Этот метод позволяет отображать поток. Функция `fn` будет вызываться для каждого фрагмента в потоке. Если функция `fn` возвращает промис - этот промис будет `await`ed перед передачей в результирующий поток.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// С синхронным отображателем.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// С асинхронным отображателем, делая не более 2 запросов за раз.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // Выводит DNS-результат resolver.resolve4.
}
```

##### `readable.filter(fn[, options])` {#readablefilterfn-options}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v20.7.0, v18.19.0 | добавлено `highWaterMark` в options. |
| v17.4.0, v16.14.0 | Добавлено в: v17.4.0, v16.14.0 |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) функция для фильтрации чанков из потока.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) чанк данных из потока.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) прерывается, если поток уничтожен, что позволяет прервать вызов `fn` досрочно.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) максимальное количество одновременных вызовов `fn` для потока. **По умолчанию:** `1`.
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) количество элементов для буферизации во время ожидания потребления отфильтрованных элементов пользователем. **По умолчанию:** `concurrency * 2 - 1`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.


- Возвращает: [\<Readable\>](/ru/nodejs/api/stream#class-streamreadable) поток, отфильтрованный с помощью предиката `fn`.

Этот метод позволяет фильтровать поток. Для каждого чанка в потоке будет вызвана функция `fn`, и если она вернет истинное значение, чанк будет передан в результирующий поток. Если функция `fn` возвращает промис, то этот промис будет `await`ed.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// С синхронным предикатом.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// С асинхронным предикатом, выполняющим не более 2 запросов одновременно.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // Выводит домены, у которых время жизни (TTL) DNS записи больше 60 секунд.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])` {#readableforeachfn-options}

**Добавлено в версии: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) функция, которая будет вызвана для каждого фрагмента потока.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) фрагмент данных из потока.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) прервано, если поток уничтожен, что позволяет прервать вызов `fn` досрочно.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) максимальное количество одновременных вызовов `fn` для потока. **По умолчанию:** `1`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) промис, когда поток завершится.

Этот метод позволяет итерировать поток. Для каждого фрагмента в потоке будет вызвана функция `fn`. Если функция `fn` возвращает промис, то этот промис будет `await`'нут.

Этот метод отличается от циклов `for await...of` тем, что он может опционально обрабатывать фрагменты параллельно. Кроме того, итерацию `forEach` можно остановить только передав параметр `signal` и прервав связанный `AbortController`, в то время как `for await...of` можно остановить с помощью `break` или `return`. В любом случае поток будет уничтожен.

Этот метод отличается от прослушивания события [`'data'`](/ru/nodejs/api/stream#event-data) тем, что он использует событие [`readable`](/ru/nodejs/api/stream#class-streamreadable) в базовом механизме и может ограничивать количество одновременных вызовов `fn`.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// С синхронным предикатом.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// С асинхронным предикатом, делая не более 2 запросов за раз.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // Логирует результат, аналогично `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // Поток завершился
```

##### `readable.toArray([options])` {#readabletoarrayoptions}

**Добавлено в: v17.5.0, v16.15.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет отменить операцию toArray, если сигнал прерван.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) промис, содержащий массив с содержимым потока.

Этот метод позволяет легко получить содержимое потока.

Поскольку этот метод считывает весь поток в память, он нивелирует преимущества потоков. Он предназначен для совместимости и удобства, а не как основной способ использования потоков.

```js [ESM]
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// Выполняйте DNS-запросы одновременно, используя .map, и соберите
// результаты в массив, используя toArray
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```
##### `readable.some(fn[, options])` {#readablesomefn-options}

**Добавлено в: v17.5.0, v16.15.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) функция, вызываемая для каждого фрагмента потока.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) фрагмент данных из потока.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) прервано, если поток уничтожен, что позволяет преждевременно прервать вызов `fn`.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) максимальное количество одновременных вызовов `fn` для потока. **По умолчанию:** `1`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) промис, оцениваемый как `true`, если `fn` вернула истинное значение хотя бы для одного из фрагментов.

Этот метод аналогичен `Array.prototype.some` и вызывает `fn` для каждого фрагмента в потоке, пока ожидаемое возвращаемое значение не станет `true` (или любым истинным значением). Как только вызов `fn` для фрагмента возвращает истинное значение, поток уничтожается и промис выполняется со значением `true`. Если ни один из вызовов `fn` для фрагментов не возвращает истинное значение, промис выполняется со значением `false`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// С синхронным предикатом.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// С асинхронным предикатом, выполняя не более 2 проверок файлов одновременно.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // `true`, если какой-либо файл в списке больше 1 МБ
console.log('done'); // Поток завершился
```

##### `readable.find(fn[, options])` {#readablefindfn-options}

**Добавлено в версии: v17.5.0, v16.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) функция, вызываемая для каждого чанка потока.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) чанк данных из потока.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) прерван, если поток уничтожен, что позволяет прервать вызов `fn` раньше.
  
 
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) максимальное количество одновременных вызовов `fn` для потока. **По умолчанию:** `1`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) промис, разрешающийся в первый чанк, для которого `fn` вычисляется как истинное значение, или `undefined`, если элемент не найден.

Этот метод похож на `Array.prototype.find` и вызывает `fn` для каждого чанка в потоке, чтобы найти чанк с истинным значением для `fn`. Как только возвращаемое значение `fn` оценивается как истинное, поток уничтожается, и промис выполняется со значением, для которого `fn` вернула истинное значение. Если все вызовы `fn` для чанков возвращают ложное значение, промис выполняется с `undefined`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// С синхронным предикатом.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// С асинхронным предикатом, делая не более 2 проверок файла одновременно.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // Имя файла большого файла, если какой-либо файл в списке больше 1 МБ
console.log('done'); // Поток завершен
```

##### `readable.every(fn[, options])` {#readableeveryfn-options}

**Добавлено в версии: v17.5.0, v16.15.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) функция, вызываемая для каждого чанка потока.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) чанк данных из потока.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) прерывается, если поток уничтожен, что позволяет прервать вызов `fn` раньше.



- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) максимальное количество параллельных вызовов `fn`, которые можно вызывать для потока одновременно. **По умолчанию:** `1`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) промис, вычисляющийся в `true`, если `fn` вернула истинное значение для всех чанков.

Этот метод похож на `Array.prototype.every` и вызывает `fn` для каждого чанка в потоке, чтобы проверить, являются ли все ожидаемые возвращаемые значения истинными для `fn`. Как только вызов `fn` для чанка, ожидаемое возвращаемое значение которого является ложным, поток уничтожается, и промис выполняется со значением `false`. Если все вызовы `fn` для чанков возвращают истинное значение, промис выполняется со значением `true`.

```js [ESM]
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// С синхронным предикатом.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// С асинхронным предикатом, делая не более 2 проверок файлов одновременно.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// `true`, если все файлы в списке больше 1MiB
console.log(allBigFiles);
console.log('done'); // Поток завершен
```

##### `readable.flatMap(fn[, options])` {#readableflatmapfn-options}

**Added in: v17.5.0, v16.15.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Experimental
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) функция для отображения каждого чанка в потоке.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) чанк данных из потока.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) прерывается, если поток уничтожен, что позволяет досрочно прервать вызов `fn`.




- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) максимальное количество параллельных вызовов `fn` для потока одновременно. **Default:** `1`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.


- Returns: [\<Readable\>](/ru/nodejs/api/stream#class-streamreadable) поток, преобразованный функцией `fn` с помощью flatMap.

Этот метод возвращает новый поток, применяя заданную функцию обратного вызова к каждому чанку потока, а затем сглаживая результат.

Из `fn` можно вернуть поток или другую итерируемую или асинхронно итерируемую сущность, и результирующие потоки будут объединены (сглажены) в возвращаемый поток.

```js [ESM]
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// С синхронным отображением.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// С асинхронным отображением, объедините содержимое 4 файлов
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // Это будет содержать содержимое (все чанки) всех 4 файлов
  console.log(result);
}
```

##### `readable.drop(limit[, options])` {#readabledroplimit-options}

**Добавлено в: v17.5.0, v16.15.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) количество фрагментов, которые нужно отбросить из читаемого потока.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.
  
 
- Возвращает: [\<Readable\>](/ru/nodejs/api/stream#class-streamreadable) поток с отброшенными `limit` фрагментами.

Этот метод возвращает новый поток с первыми `limit` фрагментами, которые были отброшены.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```
##### `readable.take(limit[, options])` {#readabletakelimit-options}

**Добавлено в: v17.5.0, v16.15.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `limit` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) количество фрагментов, которые нужно взять из читаемого потока.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.
  
 
- Возвращает: [\<Readable\>](/ru/nodejs/api/stream#class-streamreadable) поток с взятыми `limit` фрагментами.

Этот метод возвращает новый поток с первыми `limit` фрагментами.

```js [ESM]
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```
##### `readable.reduce(fn[, initial[, options]])` {#readablereducefn-initial-options}

**Добавлено в: v17.5.0, v16.15.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) функция редуктора, которая вызывается для каждого фрагмента в потоке.
    - `previous` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) значение, полученное из последнего вызова `fn`, или значение `initial`, если оно указано, или первый фрагмент потока в противном случае.
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) фрагмент данных из потока.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) прерван, если поток уничтожен, что позволяет прервать вызов `fn` раньше.
  
 
  
 
- `initial` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) начальное значение, используемое в редукции.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет уничтожить поток, если сигнал прерван.
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) промис для конечного значения редукции.

Этот метод вызывает `fn` для каждого фрагмента потока по порядку, передавая ему результат вычисления предыдущего элемента. Он возвращает промис для конечного значения редукции.

Если значение `initial` не указано, в качестве начального значения используется первый фрагмент потока. Если поток пуст, промис отклоняется с `TypeError` со свойством кода `ERR_INVALID_ARGS`.

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```
Функция редуктора итерирует поток элемент за элементом, что означает отсутствие параметра `concurrency` или параллелизма. Чтобы выполнить `reduce` одновременно, вы можете извлечь асинхронную функцию в метод [`readable.map`](/ru/nodejs/api/stream#readablemapfn-options).

```js [ESM]
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### Duplex и Transform потоки {#duplex-and-transform-streams}

#### Класс: `stream.Duplex` {#class-streamduplex}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.8.0 | Экземпляры `Duplex` теперь возвращают `true` при проверке `instanceof stream.Writable`. |
| v0.9.4 | Добавлено в: v0.9.4 |
:::

Duplex потоки - это потоки, которые реализуют оба интерфейса: [`Readable`](/ru/nodejs/api/stream#class-streamreadable) и [`Writable`](/ru/nodejs/api/stream#class-streamwritable).

Примеры `Duplex` потоков:

- [TCP сокеты](/ru/nodejs/api/net#class-netsocket)
- [zlib потоки](/ru/nodejs/api/zlib)
- [crypto потоки](/ru/nodejs/api/crypto)

##### `duplex.allowHalfOpen` {#duplexallowhalfopen}

**Добавлено в: v0.9.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если `false`, то поток автоматически завершит записываемую сторону, когда завершится читаемая сторона. Устанавливается изначально опцией конструктора `allowHalfOpen`, которая по умолчанию имеет значение `true`.

Это можно изменить вручную, чтобы изменить поведение полуоткрытого существующего экземпляра `Duplex` потока, но это необходимо сделать до того, как будет сгенерировано событие `'end'`.

#### Класс: `stream.Transform` {#class-streamtransform}

**Добавлено в: v0.9.4**

Transform потоки - это [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) потоки, где вывод каким-то образом связан с вводом. Как и все [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) потоки, `Transform` потоки реализуют оба интерфейса: [`Readable`](/ru/nodejs/api/stream#class-streamreadable) и [`Writable`](/ru/nodejs/api/stream#class-streamwritable).

Примеры `Transform` потоков:

- [zlib потоки](/ru/nodejs/api/zlib)
- [crypto потоки](/ru/nodejs/api/crypto)

##### `transform.destroy([error])` {#transformdestroyerror}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Работает как no-op на потоке, который уже был уничтожен. |
| v8.0.0 | Добавлено в: v8.0.0 |
:::

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

Уничтожить поток и, при необходимости, сгенерировать событие `'error'`. После этого вызова поток преобразования освободит любые внутренние ресурсы. Разработчикам не следует переопределять этот метод, а вместо этого реализовать [`readable._destroy()`](/ru/nodejs/api/stream#readable_destroyerr-callback). Реализация `_destroy()` по умолчанию для `Transform` также генерирует `'close'`, если только `emitClose` не установлено в false.

После того, как был вызван `destroy()`, любые дальнейшие вызовы будут no-op, и никакие дальнейшие ошибки, кроме ошибок из `_destroy()`, не могут быть сгенерированы как `'error'`.


#### `stream.duplexPair([options])` {#streamduplexpairoptions}

**Добавлено в: v22.6.0, v20.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Значение для передачи обоим конструкторам [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) для установки параметров, таких как буферизация.
- Возвращает: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) из двух экземпляров [`Duplex`](/ru/nodejs/api/stream#class-streamduplex).

Служебная функция `duplexPair` возвращает массив с двумя элементами, каждый из которых является потоком `Duplex`, подключенным к другой стороне:

```js [ESM]
const [ sideA, sideB ] = duplexPair();
```
Все, что записано в один поток, становится читаемым в другом. Он обеспечивает поведение, аналогичное сетевому соединению, где данные, записанные клиентом, становятся читаемыми сервером, и наоборот.

Потоки Duplex симметричны; один или другой может использоваться без какой-либо разницы в поведении.

### `stream.finished(stream[, options], callback)` {#streamfinishedstream-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.5.0 | Добавлена поддержка `ReadableStream` и `WritableStream`. |
| v15.11.0 | Добавлен параметр `signal`. |
| v14.0.0 | `finished(stream, cb)` будет ждать события `'close'` перед вызовом обратного вызова. Реализация пытается обнаружить устаревшие потоки и применяет это поведение только к потокам, которые, как ожидается, будут генерировать `'close'`. |
| v14.0.0 | Генерация `'close'` до `'end'` в потоке `Readable` вызовет ошибку `ERR_STREAM_PREMATURE_CLOSE`. |
| v14.0.0 | Обратный вызов будет вызван для потоков, которые уже завершились до вызова `finished(stream, cb)`. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `stream` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) Поток/веб-поток для чтения и/или записи.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `error` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `false`, то вызов `emit('error', err)` не рассматривается как завершенный. **По умолчанию:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `false`, обратный вызов будет вызван, когда поток закончится, даже если поток все еще может быть читаемым. **По умолчанию:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `false`, обратный вызов будет вызван, когда поток закончится, даже если поток все еще может быть записываемым. **По умолчанию:** `true`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать ожидание завершения потока. Базовый поток *не* будет прерван, если сигнал будет прерван. Обратный вызов будет вызван с ошибкой `AbortError`. Все зарегистрированные слушатели, добавленные этой функцией, также будут удалены.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, которая принимает необязательный аргумент ошибки.
- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция очистки, которая удаляет все зарегистрированные слушатели.

Функция для получения уведомления, когда поток больше не является читаемым, записываемым или столкнулся с ошибкой или преждевременным событием закрытия.

```js [ESM]
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Поток не удался.', err);
  } else {
    console.log('Поток завершил чтение.');
  }
});

rs.resume(); // Выкачать поток.
```
Особенно полезно в сценариях обработки ошибок, когда поток уничтожается преждевременно (например, прерванный HTTP-запрос) и не будет генерировать `'end'` или `'finish'`.

API `finished` предоставляет [версию promise](/ru/nodejs/api/stream#streamfinishedstream-options).

`stream.finished()` оставляет висящие прослушиватели событий (в частности, `'error'`, `'end'`, `'finish'` и `'close'`) после вызова `callback`. Причина этого в том, что неожиданные события `'error'` (из-за неправильной реализации потока) не вызывают неожиданных сбоев. Если это нежелательное поведение, то возвращенную функцию очистки необходимо вызвать в обратном вызове:

```js [ESM]
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)` {#streampipelinesource-transforms-destination-callback}

### `stream.pipeline(streams, callback)` {#streampipelinestreams-callback}


::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v19.7.0, v18.16.0 | Добавлена поддержка веб-потоков. |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь выдает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v14.0.0 | `pipeline(..., cb)` будет ждать события `'close'` перед вызовом обратного вызова. Реализация пытается обнаружить устаревшие потоки и применять это поведение только к потокам, которые, как ожидается, будут испускать `'close'`. |
| v13.10.0 | Добавлена поддержка асинхронных генераторов. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `streams` [\<Stream[]\>](/ru/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/ru/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/ru/nodejs/api/webstreams#class-transformstream)
- `source` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) 
    - Возвращает: [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `...transforms` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<TransformStream\>](/ru/nodejs/api/webstreams#class-transformstream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Возвращает: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
  
 
- `destination` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) 
    - `source` [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface)
    - Возвращает: [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается, когда конвейер полностью завершен. 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `val` Разрешенное значение `Promise`, возвращенное `destination`.
  
 
- Возвращает: [\<Stream\>](/ru/nodejs/api/stream#stream)

Метод модуля для организации конвейерной передачи данных между потоками и генераторами, пересылки ошибок, правильной очистки и предоставления обратного вызова по завершении конвейера.

```js [ESM]
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Используйте API pipeline, чтобы легко соединить серию потоков
// вместе и получать уведомления, когда конвейер полностью завершен.

// Конвейер для эффективного сжатия gzip потенциально огромного tar-файла:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Конвейер не удался.', err);
    } else {
      console.log('Конвейер успешно завершен.');
    }
  },
);
```
API `pipeline` предоставляет [версию promise](/ru/nodejs/api/stream#streampipelinesource-transforms-destination-options).

`stream.pipeline()` вызовет `stream.destroy(err)` для всех потоков, кроме:

- `Readable` потоков, которые испустили `'end'` или `'close'`.
- `Writable` потоков, которые испустили `'finish'` или `'close'`.

`stream.pipeline()` оставляет висячие прослушиватели событий в потоках после вызова `callback`. В случае повторного использования потоков после сбоя это может привести к утечкам прослушивателей событий и проглоченным ошибкам. Если последний поток является читаемым, висячие прослушиватели событий будут удалены, чтобы последний поток можно было использовать позже.

`stream.pipeline()` закрывает все потоки при возникновении ошибки. Использование `IncomingRequest` с `pipeline` может привести к неожиданному поведению, так как это приведет к уничтожению сокета без отправки ожидаемого ответа. Смотрите пример ниже:

```js [ESM]
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // Нет такого файла
      // это сообщение не может быть отправлено, так как `pipeline` уже уничтожил сокет
      return res.end('ошибка!!!');
    }
  });
});
```

### `stream.compose(...streams)` {#streamcomposestreams}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.1.0, v20.10.0 | Добавлена поддержка класса stream. |
| v19.8.0, v18.16.0 | Добавлена поддержка webstreams. |
| v16.9.0 | Добавлено в: v16.9.0 |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - `stream.compose` является экспериментальным.
:::

- `streams` [\<Stream[]\>](/ru/nodejs/api/stream#stream) | [\<Iterable[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable[]\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<ReadableStream[]\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<WritableStream[]\>](/ru/nodejs/api/webstreams#class-writablestream) | [\<TransformStream[]\>](/ru/nodejs/api/webstreams#class-transformstream) | [\<Duplex[]\>](/ru/nodejs/api/stream#class-streamduplex) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Объединяет два или более потока в поток `Duplex`, который записывает в первый поток и считывает из последнего. Каждый предоставленный поток передается в следующий, используя `stream.pipeline`. Если какой-либо из потоков выдает ошибку, все они уничтожаются, включая внешний поток `Duplex`.

Поскольку `stream.compose` возвращает новый поток, который, в свою очередь, может (и должен) быть передан в другие потоки, это обеспечивает композицию. В отличие от этого, при передаче потоков в `stream.pipeline`, как правило, первый поток является потоком чтения, а последний - потоком записи, образуя замкнутую цепь.

Если передана `Function`, это должен быть фабричный метод, принимающий `source` `Iterable`.

```js [ESM]
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // выводит 'HELLOWORLD'
```
`stream.compose` можно использовать для преобразования асинхронных итерируемых объектов, генераторов и функций в потоки.

- `AsyncIterable` преобразуется в читаемый `Duplex`. Не может возвращать `null`.
- `AsyncGeneratorFunction` преобразуется в преобразующий `Duplex` для чтения/записи. Должен принимать `AsyncIterable` в качестве первого параметра. Не может возвращать `null`.
- `AsyncFunction` преобразуется в `Duplex` для записи. Должен возвращать либо `null`, либо `undefined`.

```js [ESM]
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Преобразовать AsyncIterable в читаемый Duplex.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Преобразовать AsyncGenerator в преобразующий Duplex.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Преобразовать AsyncFunction в Duplex для записи.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // выводит 'HELLOWORLD'
```
См. [`readable.compose(stream)`](/ru/nodejs/api/stream#readablecomposestream-options) для `stream.compose` как оператора.


### `stream.Readable.from(iterable[, options])` {#streamreadablefromiterable-options}

**Добавлено в: v12.3.0, v10.17.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Объект, реализующий протокол Iterable `Symbol.asyncIterator` или `Symbol.iterator`.  Генерирует событие 'error', если передано значение null.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры, передаваемые в `new stream.Readable([options])`. По умолчанию `Readable.from()` установит `options.objectMode` в `true`, если это явно не отключено установкой `options.objectMode` в `false`.
- Возвращает: [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)

Вспомогательный метод для создания читаемых потоков из итераторов.

```js [ESM]
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
Вызов `Readable.from(string)` или `Readable.from(buffer)` не приведет к итерации строк или буферов для соответствия семантике других потоков по соображениям производительности.

Если объект `Iterable`, содержащий промисы, передается в качестве аргумента, это может привести к необработанному отклонению.

```js [ESM]
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Unhandled rejection
]);
```
### `stream.Readable.fromWeb(readableStream[, options])` {#streamreadablefromwebreadablestream-options}

**Добавлено в: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `readableStream` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)
  
 
- Возвращает: [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)


### `stream.Readable.isDisturbed(stream)` {#streamreadableisdisturbedstream}

**Добавлено в: v16.8.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `stream` [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)
- Возвращает: `boolean`

Возвращает, был ли поток прочитан или отменен.

### `stream.isErrored(stream)` {#streamiserroredstream}

**Добавлено в: v17.3.0, v16.14.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `stream` [\<Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<Writable\>](/ru/nodejs/api/stream#class-streamwritable) | [\<Duplex\>](/ru/nodejs/api/stream#class-streamduplex) | [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) | [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает, произошла ли ошибка в потоке.

### `stream.isReadable(stream)` {#streamisreadablestream}

**Добавлено в: v17.4.0, v16.14.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `stream` [\<Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<Duplex\>](/ru/nodejs/api/stream#class-streamduplex) | [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает, доступен ли поток для чтения.

### `stream.Readable.toWeb(streamReadable[, options])` {#streamreadabletowebstreamreadable-options}

**Добавлено в: v17.0.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `streamReadable` [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strategy` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер внутренней очереди (созданного `ReadableStream`) до применения противодавления при чтении из данного `stream.Readable`. Если значение не указано, оно будет взято из данного `stream.Readable`.
    - `size` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, определяющая размер данного куска данных. Если значение не указано, размер будет `1` для всех кусков.
    - `chunk` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
    - Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)





- Возвращает: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)


### `stream.Writable.fromWeb(writableStream[, options])` {#streamwritablefromwebwritablestream-options}

**Добавлено в: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Experimental
:::

- `writableStream` [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)
  
 
- Возвращает: [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)

### `stream.Writable.toWeb(streamWritable)` {#streamwritabletowebstreamwritable}

**Добавлено в: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Experimental
:::

- `streamWritable` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)
- Возвращает: [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)

### `stream.Duplex.from(src)` {#streamduplexfromsrc}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.5.0, v18.17.0 | Аргумент `src` теперь может быть `ReadableStream` или `WritableStream`. |
| v16.8.0 | Добавлено в: v16.8.0 |
:::

- `src` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<Blob\>](/ru/nodejs/api/buffer#class-blob) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<AsyncGeneratorFunction\>](https://tc39.es/proposal-async-iteration/#sec-asyncgeneratorfunction-constructor) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)

Вспомогательный метод для создания дуплексных потоков.

- `Stream` преобразует записываемый поток в записываемый `Duplex` и читаемый поток в `Duplex`.
- `Blob` преобразуется в читаемый `Duplex`.
- `string` преобразуется в читаемый `Duplex`.
- `ArrayBuffer` преобразуется в читаемый `Duplex`.
- `AsyncIterable` преобразуется в читаемый `Duplex`. Не может возвращать `null`.
- `AsyncGeneratorFunction` преобразуется в читаемый/записываемый преобразующий `Duplex`. Должен принимать исходный `AsyncIterable` в качестве первого параметра. Не может возвращать `null`.
- `AsyncFunction` преобразуется в записываемый `Duplex`. Должен возвращать либо `null`, либо `undefined`.
- `Object ({ writable, readable })` преобразует `readable` и `writable` в `Stream`, а затем объединяет их в `Duplex`, где `Duplex` будет записывать в `writable` и читать из `readable`.
- `Promise` преобразуется в читаемый `Duplex`. Значение `null` игнорируется.
- `ReadableStream` преобразуется в читаемый `Duplex`.
- `WritableStream` преобразуется в записываемый `Duplex`.
- Возвращает: [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Если в качестве аргумента передан объект `Iterable`, содержащий промисы, это может привести к необработанному отклонению.

```js [ESM]
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Необработанное отклонение
]);
```

### `stream.Duplex.fromWeb(pair[, options])` {#streamduplexfromwebpair-options}

**Добавлено в: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `pair` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)
  
 
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)
  
 
- Возвращает: [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```js [CJS]
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```
:::


### `stream.Duplex.toWeb(streamDuplex)` {#streamduplextowebstreamduplex}

**Added in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Experimental
:::

- `streamDuplex` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `readable` [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)
    - `writable` [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream)
  
 



::: code-group
```js [ESM]
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```js [CJS]
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```
:::

### `stream.addAbortSignal(signal, stream)` {#streamaddabortsignalsignal-stream}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.7.0, v18.16.0 | Added support for `ReadableStream` and `WritableStream`. |
| v15.4.0 | Added in: v15.4.0 |
:::

- `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Сигнал, представляющий возможную отмену
- `stream` [\<Stream\>](/ru/nodejs/api/stream#stream) | [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) | [\<WritableStream\>](/ru/nodejs/api/webstreams#class-writablestream) Поток, к которому необходимо прикрепить сигнал.

Прикрепляет AbortSignal к читаемому или записываемому потоку. Это позволяет коду контролировать уничтожение потока с помощью `AbortController`.

Вызов `abort` на `AbortController`, соответствующем переданному `AbortSignal`, будет вести себя так же, как и вызов `.destroy(new AbortError())` на потоке, и `controller.error(new AbortError())` для webstreams.

```js [ESM]
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Later, abort the operation closing the stream
controller.abort();
```
Или использование `AbortSignal` с читаемым потоком в качестве асинхронного итерируемого объекта:

```js [ESM]
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // set a timeout
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // The operation was cancelled
    } else {
      throw e;
    }
  }
})();
```
Или использование `AbortSignal` с ReadableStream:

```js [ESM]
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // The operation was cancelled
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)` {#streamgetdefaulthighwatermarkobjectmode}

**Добавлено в версии: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает highWaterMark по умолчанию, используемый потоками. По умолчанию `65536` (64 KiB) или `16` для `objectMode`.

### `stream.setDefaultHighWaterMark(objectMode, value)` {#streamsetdefaulthighwatermarkobjectmode-value}

**Добавлено в версии: v19.9.0, v18.17.0**

- `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) значение highWaterMark

Устанавливает highWaterMark по умолчанию, используемый потоками.

## API для разработчиков потоков {#api-for-stream-implementers}

API модуля `node:stream` разработан для того, чтобы упростить реализацию потоков с использованием модели прототипного наследования JavaScript.

Сначала разработчик потока объявляет новый класс JavaScript, который расширяет один из четырех основных классов потоков (`stream.Writable`, `stream.Readable`, `stream.Duplex` или `stream.Transform`), обязательно вызывая соответствующий конструктор родительского класса:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```
При расширении потоков, имейте в виду, какие параметры пользователь может и должен предоставить, прежде чем пересылать их в базовый конструктор. Например, если реализация делает предположения относительно параметров `autoDestroy` и `emitClose`, не позволяйте пользователю переопределять их. Будьте явными в отношении того, какие параметры пересылаются, вместо того, чтобы неявно пересылать все параметры.

Затем новый класс потока должен реализовать один или несколько конкретных методов, в зависимости от типа создаваемого потока, как подробно описано в таблице ниже:

| Вариант использования | Класс | Метод(ы) для реализации |
| --- | --- | --- |
| Только чтение | [`Readable`](/ru/nodejs/api/stream#class-streamreadable) | [`_read()`](/ru/nodejs/api/stream#readable_readsize) |
| Только запись | [`Writable`](/ru/nodejs/api/stream#class-streamwritable) | [`_write()`](/ru/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/ru/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/ru/nodejs/api/stream#writable_finalcallback) |
| Чтение и запись | [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) | [`_read()`](/ru/nodejs/api/stream#readable_readsize)  ,   [`_write()`](/ru/nodejs/api/stream#writable_writechunk-encoding-callback)  ,   [`_writev()`](/ru/nodejs/api/stream#writable_writevchunks-callback)  ,   [`_final()`](/ru/nodejs/api/stream#writable_finalcallback) |
| Работа с записанными данными, затем чтение результата | [`Transform`](/ru/nodejs/api/stream#class-streamtransform) | [`_transform()`](/ru/nodejs/api/stream#transform_transformchunk-encoding-callback)  ,   [`_flush()`](/ru/nodejs/api/stream#transform_flushcallback)  ,   [`_final()`](/ru/nodejs/api/stream#writable_finalcallback) |
Код реализации потока *никогда* не должен вызывать "публичные" методы потока, предназначенные для использования потребителями (как описано в разделе [API для потребителей потока](/ru/nodejs/api/stream#api-for-stream-consumers)). Это может привести к неблагоприятным побочным эффектам в коде приложения, потребляющего поток.

Избегайте переопределения общедоступных методов, таких как `write()`, `end()`, `cork()`, `uncork()`, `read()` и `destroy()`, или генерации внутренних событий, таких как `'error'`, `'data'`, `'end'`, `'finish'` и `'close'` через `.emit()`. Это может нарушить текущие и будущие инварианты потока, что приведет к проблемам поведения и/или совместимости с другими потоками, утилитами потоков и ожиданиями пользователей.


### Упрощенная конструкция {#simplified-construction}

**Добавлено в: v1.2.0**

Во многих простых случаях можно создать поток, не полагаясь на наследование. Этого можно достичь, непосредственно создавая экземпляры объектов `stream.Writable`, `stream.Readable`, `stream.Duplex` или `stream.Transform` и передавая соответствующие методы в качестве опций конструктора.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // Инициализация состояния и загрузка ресурсов...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // Освобождение ресурсов...
  },
});
```
### Реализация потока для записи {#implementing-a-writable-stream}

Класс `stream.Writable` расширяется для реализации потока [`Writable`](/ru/nodejs/api/stream#class-streamwritable).

Пользовательские потоки `Writable` *должны* вызывать конструктор `new stream.Writable([options])` и реализовывать метод `writable._write()` и/или `writable._writev()`.

#### `new stream.Writable([options])` {#new-streamwritableoptions}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0 | увеличено значение highWaterMark по умолчанию. |
| v15.5.0 | поддержка передачи AbortSignal. |
| v14.0.0 | Изменено значение опции `autoDestroy` по умолчанию на `true`. |
| v11.2.0, v10.16.0 | Добавлена опция `autoDestroy` для автоматического вызова `destroy()` для потока, когда он выдает `'finish'` или ошибки. |
| v10.0.0 | Добавлена опция `emitClose` для указания, следует ли выдавать `'close'` при уничтожении. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уровень буфера, когда [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) начинает возвращать `false`. **По умолчанию:** `65536` (64 КиБ) или `16` для потоков `objectMode`.
    - `decodeStrings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, следует ли кодировать `string` переданные в [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) в `Buffer` (с кодировкой, указанной в вызове [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback)) перед передачей их в [`stream._write()`](/ru/nodejs/api/stream#writable_writechunk-encoding-callback). Другие типы данных не преобразуются (т.е. `Buffer` не декодируются в `string`). Установка значения false предотвратит преобразование `string`. **По умолчанию:** `true`.
    - `defaultEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка по умолчанию, используемая, когда кодировка не указана в качестве аргумента для [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback). **По умолчанию:** `'utf8'`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, является ли [`stream.write(anyObj)`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) допустимой операцией. При установке становится возможным записывать значения JavaScript, отличные от string, [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) или [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), если это поддерживается реализацией потока. **По умолчанию:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должен ли поток выдавать `'close'` после его уничтожения. **По умолчанию:** `true`.
    - `write` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация метода [`stream._write()`](/ru/nodejs/api/stream#writable_writechunk-encoding-callback).
    - `writev` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация метода [`stream._writev()`](/ru/nodejs/api/stream#writable_writevchunks-callback).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация метода [`stream._destroy()`](/ru/nodejs/api/stream#writable_destroyerr-callback).
    - `final` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация метода [`stream._final()`](/ru/nodejs/api/stream#writable_finalcallback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация метода [`stream._construct()`](/ru/nodejs/api/stream#writable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должен ли этот поток автоматически вызывать `.destroy()` для себя после завершения. **По умолчанию:** `true`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Сигнал, представляющий возможную отмену.



```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // Вызывает конструктор stream.Writable().
    super(options);
    // ...
  }
}
```
Или, при использовании конструкторов в стиле pre-ES6:

```js [ESM]
const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
```
Или, используя упрощенный подход конструктора:

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```
Вызов `abort` для `AbortController`, соответствующего переданному `AbortSignal`, будет вести себя так же, как вызов `.destroy(new AbortError())` для потока для записи.

```js [ESM]
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// Позже прервите операцию, закрыв поток
controller.abort();
```

#### `writable._construct(callback)` {#writable_constructcallback}

**Добавлено в: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызовите эту функцию (необязательно с аргументом ошибки), когда поток завершит инициализацию.

Метод `_construct()` НЕ ДОЛЖЕН вызываться напрямую. Он может быть реализован дочерними классами и, если это так, будет вызываться только внутренними методами класса `Writable`.

Эта необязательная функция будет вызвана в тике после возврата конструктора потока, откладывая любые вызовы `_write()`, `_final()` и `_destroy()` до вызова `callback`. Это полезно для инициализации состояния или асинхронной инициализации ресурсов до того, как поток можно будет использовать.

```js [ESM]
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `writable._write(chunk, encoding, callback)` {#writable_writechunk-encoding-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.11.0 | _write() является необязательным при предоставлении _writev(). |
:::

- `chunk` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `Buffer` для записи, преобразованный из `string`, переданного в [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback). Если для параметра `decodeStrings` потока установлено значение `false` или поток работает в объектном режиме, фрагмент не будет преобразован и будет тем, что было передано в [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если фрагмент является строкой, то `encoding` — это кодировка символов этой строки. Если фрагмент является `Buffer` или если поток работает в объектном режиме, `encoding` можно игнорировать.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызовите эту функцию (необязательно с аргументом ошибки), когда обработка предоставленного фрагмента будет завершена.

Все реализации `Writable` потока должны предоставлять метод [`writable._write()`](/ru/nodejs/api/stream#writable_writechunk-encoding-callback) и/или [`writable._writev()`](/ru/nodejs/api/stream#writable_writevchunks-callback) для отправки данных в базовый ресурс.

Потоки [`Transform`](/ru/nodejs/api/stream#class-streamtransform) предоставляют свою собственную реализацию [`writable._write()`](/ru/nodejs/api/stream#writable_writechunk-encoding-callback).

Эта функция НЕ ДОЛЖНА вызываться кодом приложения напрямую. Она должна быть реализована дочерними классами и вызываться только внутренними методами класса `Writable`.

Функция `callback` должна быть вызвана синхронно внутри `writable._write()` или асинхронно (т.е. в другом тике), чтобы сигнализировать о том, что запись завершилась успешно или завершилась с ошибкой. Первым аргументом, переданным в `callback`, должен быть объект `Error`, если вызов завершился неудачно, или `null`, если запись прошла успешно.

Все вызовы `writable.write()`, которые происходят между моментом вызова `writable._write()` и вызовом `callback`, приведут к буферизации записанных данных. Когда вызывается `callback`, поток может сгенерировать событие [`'drain'`](/ru/nodejs/api/stream#event-drain). Если реализация потока способна обрабатывать несколько фрагментов данных одновременно, следует реализовать метод `writable._writev()`.

Если свойство `decodeStrings` явно установлено в значение `false` в параметрах конструктора, то `chunk` останется тем же объектом, который передается в `.write()`, и может быть строкой, а не `Buffer`. Это сделано для поддержки реализаций, которые имеют оптимизированную обработку для определенных кодировок строковых данных. В этом случае аргумент `encoding` будет указывать кодировку символов строки. В противном случае аргумент `encoding` можно безопасно игнорировать.

Метод `writable._write()` имеет префикс в виде подчеркивания, потому что он является внутренним для класса, который его определяет, и никогда не должен вызываться напрямую пользовательскими программами.


#### `writable._writev(chunks, callback)` {#writable_writevchunks-callback}

- `chunks` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Данные для записи. Значение является массивом [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), каждый из которых представляет собой отдельный фрагмент данных для записи. Свойства этих объектов:
    - `chunk` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Экземпляр буфера или строка, содержащая данные для записи. `chunk` будет строкой, если `Writable` был создан с опцией `decodeStrings`, установленной в `false`, и в `write()` была передана строка.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка символов `chunk`. Если `chunk` является `Buffer`, `encoding` будет `'buffer'`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова (необязательно с аргументом ошибки), вызываемая после завершения обработки предоставленных фрагментов.

Эта функция НЕ ДОЛЖНА вызываться непосредственно кодом приложения. Она должна быть реализована дочерними классами и вызываться только внутренними методами класса `Writable`.

Метод `writable._writev()` может быть реализован в дополнение или в качестве альтернативы `writable._write()` в реализациях потока, способных обрабатывать несколько фрагментов данных одновременно. Если он реализован и если есть буферизованные данные из предыдущих операций записи, будет вызван `_writev()` вместо `_write()`.

Метод `writable._writev()` начинается с символа подчеркивания, потому что он является внутренним для класса, который его определяет, и никогда не должен вызываться напрямую пользовательскими программами.

#### `writable._destroy(err, callback)` {#writable_destroyerr-callback}

**Добавлено в версии: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Возможная ошибка.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, принимающая необязательный аргумент ошибки.

Метод `_destroy()` вызывается [`writable.destroy()`](/ru/nodejs/api/stream#writabledestroyerror). Он может быть переопределен дочерними классами, но **не должен** вызываться напрямую.


#### `writable._final(callback)` {#writable_finalcallback}

**Добавлено в версии: v8.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызовите эту функцию (необязательно с аргументом ошибки) после завершения записи оставшихся данных.

Метод `_final()` **не должен** вызываться напрямую. Он может быть реализован дочерними классами, и в этом случае он будет вызываться только внутренними методами класса `Writable`.

Эта необязательная функция будет вызываться перед закрытием потока, задерживая событие `'finish'` до тех пор, пока не будет вызван `callback`. Это полезно для закрытия ресурсов или записи буферизованных данных перед завершением потока.

#### Ошибки при записи {#errors-while-writing}

Ошибки, возникающие во время обработки методов [`writable._write()`](/ru/nodejs/api/stream#writable_writechunk-encoding-callback), [`writable._writev()`](/ru/nodejs/api/stream#writable_writevchunks-callback) и [`writable._final()`](/ru/nodejs/api/stream#writable_finalcallback), должны распространяться путем вызова обратного вызова и передачи ошибки в качестве первого аргумента. Выбрасывание `Error` из этих методов или ручное испускание события `'error'` приводит к неопределенному поведению.

Если `Readable` поток передается в `Writable` поток, когда `Writable` выдает ошибку, `Readable` поток будет отключен.

```js [ESM]
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```
#### Пример записываемого потока {#an-example-writable-stream}

Ниже приведена довольно упрощенная (и несколько бессмысленная) реализация пользовательского `Writable` потока. Хотя этот конкретный экземпляр `Writable` потока не имеет особой практической пользы, пример иллюстрирует каждый из необходимых элементов пользовательского экземпляра [`Writable`](/ru/nodejs/api/stream#class-streamwritable) потока:

```js [ESM]
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### Декодирование буферов в потоке для записи {#decoding-buffers-in-a-writable-stream}

Декодирование буферов — обычная задача, например, при использовании преобразователей, входные данные которых являются строкой. Это нетривиальный процесс при использовании многобайтовых кодировок символов, таких как UTF-8. В следующем примере показано, как декодировать многобайтовые строки с помощью `StringDecoder` и [`Writable`](/ru/nodejs/api/stream#class-streamwritable).

```js [ESM]
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```
### Реализация потока для чтения {#implementing-a-readable-stream}

Класс `stream.Readable` расширяется для реализации потока [`Readable`](/ru/nodejs/api/stream#class-streamreadable).

Пользовательские потоки `Readable` *должны* вызывать конструктор `new stream.Readable([options])` и реализовывать метод [`readable._read()`](/ru/nodejs/api/stream#readable_readsize).

#### `new stream.Readable([options])` {#new-streamreadableoptions}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0 | увеличено значение highWaterMark по умолчанию. |
| v15.5.0 | поддержка передачи AbortSignal. |
| v14.0.0 | Изменено значение параметра `autoDestroy` по умолчанию на `true`. |
| v11.2.0, v10.16.0 | Добавлен параметр `autoDestroy` для автоматического вызова `destroy()` для потока, когда он выдает `'end'` или ошибки. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное [количество байтов](/ru/nodejs/api/stream#highwatermark-discrepancy-after-calling-readablesetencoding), которое нужно хранить во внутреннем буфере, прежде чем прекратить чтение из базового ресурса. **По умолчанию:** `65536` (64 КиБ) или `16` для потоков `objectMode`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если указано, буферы будут декодированы в строки с использованием указанной кодировки. **По умолчанию:** `null`.
    - `objectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Должен ли этот поток вести себя как поток объектов. Это означает, что [`stream.read(n)`](/ru/nodejs/api/stream#readablereadsize) возвращает одно значение вместо `Buffer` размером `n`. **По умолчанию:** `false`.
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Должен ли поток выдавать `'close'` после его уничтожения. **По умолчанию:** `true`.
    - `read` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация метода [`stream._read()`](/ru/nodejs/api/stream#readable_readsize).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация метода [`stream._destroy()`](/ru/nodejs/api/stream#readable_destroyerr-callback).
    - `construct` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация метода [`stream._construct()`](/ru/nodejs/api/stream#readable_constructcallback).
    - `autoDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Должен ли этот поток автоматически вызывать `.destroy()` после завершения. **По умолчанию:** `true`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Сигнал, представляющий возможную отмену.



```js [ESM]
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // Вызывает конструктор stream.Readable(options).
    super(options);
    // ...
  }
}
```
Или, при использовании конструкторов в стиле pre-ES6:

```js [ESM]
const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
```
Или, используя упрощенный подход к конструктору:

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```
Вызов `abort` для `AbortController`, соответствующего переданному `AbortSignal`, будет вести себя так же, как вызов `.destroy(new AbortError())` для созданного потока readable.

```js [ESM]
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// Позже, прерываем операцию, закрывая поток
controller.abort();
```

#### `readable._construct(callback)` {#readable_constructcallback}

**Добавлено в: v15.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызовите эту функцию (необязательно с аргументом ошибки), когда поток закончит инициализацию.

Метод `_construct()` НЕ ДОЛЖЕН вызываться напрямую. Он может быть реализован дочерними классами и, если это так, будет вызываться только внутренними методами класса `Readable`.

Эта необязательная функция будет запланирована в следующем тике конструктором потока, задерживая любые вызовы `_read()` и `_destroy()` до вызова `callback`. Это полезно для инициализации состояния или асинхронной инициализации ресурсов до того, как поток можно будет использовать.

```js [ESM]
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```
#### `readable._read(size)` {#readable_readsize}

**Добавлено в: v0.9.4**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для асинхронного чтения

Эта функция НЕ ДОЛЖНА вызываться напрямую из кода приложения. Она должна быть реализована дочерними классами и вызываться только внутренними методами класса `Readable`.

Все реализации потока `Readable` должны предоставлять реализацию метода [`readable._read()`](/ru/nodejs/api/stream#readable_readsize) для получения данных из базового ресурса.

Когда вызывается [`readable._read()`](/ru/nodejs/api/stream#readable_readsize), если данные доступны из ресурса, реализация должна начать помещать эти данные в очередь чтения с помощью метода [`this.push(dataChunk)`](/ru/nodejs/api/stream#readablepushchunk-encoding). `_read()` будет вызываться снова после каждого вызова [`this.push(dataChunk)`](/ru/nodejs/api/stream#readablepushchunk-encoding), как только поток будет готов принять больше данных. `_read()` может продолжать чтение из ресурса и помещать данные, пока `readable.push()` не вернет `false`. Только когда `_read()` вызывается снова после того, как он остановился, он должен возобновить помещение дополнительных данных в очередь.

После того, как метод [`readable._read()`](/ru/nodejs/api/stream#readable_readsize) был вызван, он не будет вызван снова, пока через метод [`readable.push()`](/ru/nodejs/api/stream#readablepushchunk-encoding) не будет передано больше данных. Пустые данные, такие как пустые буферы и строки, не приведут к вызову [`readable._read()`](/ru/nodejs/api/stream#readable_readsize).

Аргумент `size` носит рекомендательный характер. Для реализаций, в которых «чтение» — это единственная операция, возвращающая данные, можно использовать аргумент `size`, чтобы определить, сколько данных необходимо получить. Другие реализации могут игнорировать этот аргумент и просто предоставлять данные, когда они становятся доступными. Нет необходимости «ждать», пока не станет доступно `size` байтов, прежде чем вызывать [`stream.push(chunk)`](/ru/nodejs/api/stream#readablepushchunk-encoding).

Метод [`readable._read()`](/ru/nodejs/api/stream#readable_readsize) имеет префикс подчеркивания, потому что он является внутренним для класса, который его определяет, и никогда не должен вызываться напрямую пользовательскими программами.


#### `readable._destroy(err, callback)` {#readable_destroyerr-callback}

**Добавлено в: v8.0.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Возможная ошибка.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, принимающая необязательный аргумент ошибки.

Метод `_destroy()` вызывается методом [`readable.destroy()`](/ru/nodejs/api/stream#readabledestroyerror). Он может быть переопределен дочерними классами, но его **нельзя** вызывать напрямую.

#### `readable.push(chunk[, encoding])` {#readablepushchunk-encoding}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Аргумент `chunk` теперь может быть экземпляром `TypedArray` или `DataView`. |
| v8.0.0 | Аргумент `chunk` теперь может быть экземпляром `Uint8Array`. |
:::

- `chunk` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Часть данных для добавления в очередь чтения. Для потоков, не работающих в объектном режиме, `chunk` должен быть [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) или [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Для потоков в объектном режиме `chunk` может быть любым значением JavaScript.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка строковых фрагментов. Должна быть допустимой кодировкой `Buffer`, такой как `'utf8'` или `'ascii'`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если дополнительные фрагменты данных могут продолжать добавляться; `false` в противном случае.

Когда `chunk` является [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) или [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), фрагмент данных будет добавлен во внутреннюю очередь для использования пользователями потока. Передача `chunk` как `null` сигнализирует об окончании потока (EOF), после чего больше нельзя записывать данные.

Когда `Readable` работает в приостановленном режиме, данные, добавленные с помощью `readable.push()`, можно прочитать, вызвав метод [`readable.read()`](/ru/nodejs/api/stream#readablereadsize), когда генерируется событие [`'readable'`](/ru/nodejs/api/stream#event-readable).

Когда `Readable` работает в режиме потока, данные, добавленные с помощью `readable.push()`, будут доставлены путем генерации события `'data'`.

Метод `readable.push()` разработан, чтобы быть максимально гибким. Например, при обертывании источника нижнего уровня, который предоставляет некоторую форму механизма паузы/возобновления и обратный вызов данных, источник нижнего уровня может быть обернут пользовательским экземпляром `Readable`:

```js [ESM]
// `_source` - это объект с методами readStop() и readStart(),
// и членом `ondata`, который вызывается, когда у него есть данные, и
// членом `onend`, который вызывается, когда данные закончились.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Каждый раз, когда есть данные, помещайте их во внутренний буфер.
    this._source.ondata = (chunk) => {
      // Если push() возвращает false, то прекратите чтение из источника.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // Когда источник заканчивается, поместите фрагмент `null`, сигнализирующий EOF.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() будет вызываться, когда поток захочет получить больше данных.
  // Консультативный аргумент размера игнорируется в этом случае.
  _read(size) {
    this._source.readStart();
  }
}
```
Метод `readable.push()` используется для помещения содержимого во внутренний буфер. Он может управляться методом [`readable._read()`](/ru/nodejs/api/stream#readable_readsize).

Для потоков, не работающих в объектном режиме, если параметр `chunk` `readable.push()` равен `undefined`, он будет рассматриваться как пустая строка или буфер. Смотрите [`readable.push('')`](/ru/nodejs/api/stream#readablepush) для получения дополнительной информации.


#### Ошибки во время чтения {#errors-while-reading}

Ошибки, возникающие во время обработки [`readable._read()`](/ru/nodejs/api/stream#readable_readsize), должны быть распространены через метод [`readable.destroy(err)`](/ru/nodejs/api/stream#readable_destroyerr-callback). Выбрасывание `Error` из [`readable._read()`](/ru/nodejs/api/stream#readable_readsize) или ручное испускание события `'error'` приводит к неопределенному поведению.

```js [ESM]
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```
#### Пример потока подсчета {#an-example-counting-stream}

Ниже приведен базовый пример потока `Readable`, который испускает цифры от 1 до 1 000 000 в порядке возрастания, а затем завершается.

```js [ESM]
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```
### Реализация дуплексного потока {#implementing-a-duplex-stream}

[`Duplex`](/ru/nodejs/api/stream#class-streamduplex) поток — это поток, который реализует как [`Readable`](/ru/nodejs/api/stream#class-streamreadable), так и [`Writable`](/ru/nodejs/api/stream#class-streamwritable), например, TCP сокетное соединение.

Поскольку JavaScript не поддерживает множественное наследование, класс `stream.Duplex` расширяется для реализации [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) потока (в отличие от расширения классов `stream.Readable` *и* `stream.Writable`).

Класс `stream.Duplex` прототипически наследуется от `stream.Readable` и паразитически от `stream.Writable`, но `instanceof` будет работать правильно для обоих базовых классов из-за переопределения [`Symbol.hasInstance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance) в `stream.Writable`.

Пользовательские `Duplex` потоки *должны* вызывать конструктор `new stream.Duplex([options])` и реализовать *оба* метода: [`readable._read()`](/ru/nodejs/api/stream#readable_readsize) и `writable._write()`.


#### `new stream.Duplex(options)` {#new-streamduplexoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.4.0 | Теперь поддерживаются опции `readableHighWaterMark` и `writableHighWaterMark`. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Передается как в конструкторы `Writable`, так и `Readable`. Также имеет следующие поля:
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `false`, то поток автоматически завершит записываемую сторону, когда завершится читаемая сторона. **По умолчанию:** `true`.
    - `readable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Устанавливает, должен ли `Duplex` быть читаемым. **По умолчанию:** `true`.
    - `writable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Устанавливает, должен ли `Duplex` быть записываемым. **По умолчанию:** `true`.
    - `readableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Устанавливает `objectMode` для читаемой стороны потока. Не имеет эффекта, если `objectMode` имеет значение `true`. **По умолчанию:** `false`.
    - `writableObjectMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Устанавливает `objectMode` для записываемой стороны потока. Не имеет эффекта, если `objectMode` имеет значение `true`. **По умолчанию:** `false`.
    - `readableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает `highWaterMark` для читаемой стороны потока. Не имеет эффекта, если `highWaterMark` предоставлен.
    - `writableHighWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает `highWaterMark` для записываемой стороны потока. Не имеет эффекта, если `highWaterMark` предоставлен.

```js [ESM]
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Или, при использовании конструкторов в стиле до ES6:

```js [ESM]
const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
```
Или, используя упрощенный подход к конструктору:

```js [ESM]
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```
При использовании pipeline:

```js [ESM]
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // Accept string input rather than Buffers
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // Make sure is valid json.
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  },
);
```

#### Пример дуплексного потока {#an-example-duplex-stream}

Следующее иллюстрирует простой пример `Duplex` потока, который оборачивает гипотетический объект источника нижнего уровня, в который можно записывать данные и из которого можно читать данные, хотя и с использованием API, несовместимого с потоками Node.js. Следующее иллюстрирует простой пример `Duplex` потока, который буферизует входящие записанные данные через интерфейс [`Writable`](/ru/nodejs/api/stream#class-streamwritable), которые считываются обратно через интерфейс [`Readable`](/ru/nodejs/api/stream#class-streamreadable).

```js [ESM]
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // Базовый источник работает только со строками.
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```
Самым важным аспектом потока `Duplex` является то, что стороны `Readable` и `Writable` работают независимо друг от друга, несмотря на сосуществование в рамках одного экземпляра объекта.

#### Дуплексные потоки в объектном режиме {#object-mode-duplex-streams}

Для потоков `Duplex` `objectMode` может быть установлен исключительно для стороны `Readable` или `Writable` с использованием параметров `readableObjectMode` и `writableObjectMode` соответственно.

В следующем примере, например, создается новый поток `Transform` (который является типом потока [`Duplex`](/ru/nodejs/api/stream#class-streamduplex)), который имеет сторону `Writable` в объектном режиме, принимающую числа JavaScript, которые преобразуются в шестнадцатеричные строки на стороне `Readable`.

```js [ESM]
const { Transform } = require('node:stream');

// Все потоки Transform также являются Duplex Streams.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // Приведем chunk к числу, если необходимо.
    chunk |= 0;

    // Преобразуем chunk во что-то другое.
    const data = chunk.toString(16);

    // Помещаем данные в очередь readable.
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// Prints: 01
myTransform.write(10);
// Prints: 0a
myTransform.write(100);
// Prints: 64
```

### Реализация потока преобразования (transform stream) {#implementing-a-transform-stream}

[`Transform`](/ru/nodejs/api/stream#class-streamtransform) поток - это [`Duplex`](/ru/nodejs/api/stream#class-streamduplex) поток, в котором выходные данные каким-то образом вычисляются на основе входных. Примеры включают потоки [zlib](/ru/nodejs/api/zlib) или [crypto](/ru/nodejs/api/crypto), которые сжимают, шифруют или расшифровывают данные.

Нет требования, чтобы выходные данные были того же размера, что и входные, того же количества чанков или поступали в то же время. Например, поток `Hash` будет иметь только один чанк выходных данных, который предоставляется при завершении ввода. Поток `zlib` будет производить выходные данные, которые либо намного меньше, либо намного больше, чем его входные данные.

Класс `stream.Transform` расширяется для реализации [`Transform`](/ru/nodejs/api/stream#class-streamtransform) потока.

Класс `stream.Transform` прототипно наследуется от `stream.Duplex` и реализует свои собственные версии методов `writable._write()` и [`readable._read()`](/ru/nodejs/api/stream#readable_readsize). Пользовательские реализации `Transform` *должны* реализовывать метод [`transform._transform()`](/ru/nodejs/api/stream#transform_transformchunk-encoding-callback) и *могут* также реализовывать метод [`transform._flush()`](/ru/nodejs/api/stream#transform_flushcallback).

Следует проявлять осторожность при использовании потоков `Transform`, поскольку данные, записанные в поток, могут привести к приостановке `Writable` стороны потока, если выходные данные на стороне `Readable` не потребляются.

#### `new stream.Transform([options])` {#new-streamtransformoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Передается как конструкторам `Writable`, так и `Readable`. Также имеет следующие поля:
    - `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация для метода [`stream._transform()`](/ru/nodejs/api/stream#transform_transformchunk-encoding-callback).
    - `flush` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Реализация для метода [`stream._flush()`](/ru/nodejs/api/stream#transform_flushcallback).
  
 

```js [ESM]
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```
Или, при использовании конструкторов в стиле pre-ES6:

```js [ESM]
const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
```
Или, используя упрощенный подход к конструктору:

```js [ESM]
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### Событие: `'end'` {#event-end_1}

Событие [`'end'`](/ru/nodejs/api/stream#event-end) относится к классу `stream.Readable`. Событие `'end'` испускается после того, как все данные были выведены, что происходит после вызова обратного вызова в [`transform._flush()`](/ru/nodejs/api/stream#transform_flushcallback). В случае ошибки, событие `'end'` не должно испускаться.

#### Событие: `'finish'` {#event-finish_1}

Событие [`'finish'`](/ru/nodejs/api/stream#event-finish) относится к классу `stream.Writable`. Событие `'finish'` испускается после вызова [`stream.end()`](/ru/nodejs/api/stream#writableendchunk-encoding-callback) и обработки всех чанков функцией [`stream._transform()`](/ru/nodejs/api/stream#transform_transformchunk-encoding-callback). В случае ошибки событие `'finish'` не должно испускаться.

#### `transform._flush(callback)` {#transform_flushcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова (опционально с аргументом ошибки и данными), которая вызывается после очистки оставшихся данных.

Эту функцию НЕЛЬЗЯ вызывать непосредственно из прикладного кода. Она должна быть реализована дочерними классами и вызываться только внутренними методами класса `Readable`.

В некоторых случаях операция преобразования может потребовать выдачи дополнительного фрагмента данных в конце потока. Например, поток сжатия `zlib` будет хранить некоторый объем внутреннего состояния, используемого для оптимального сжатия выходных данных. Однако, когда поток заканчивается, эти дополнительные данные необходимо сбросить, чтобы сжатые данные были полными.

Пользовательские реализации [`Transform`](/ru/nodejs/api/stream#class-streamtransform) *могут* реализовывать метод `transform._flush()`. Он будет вызываться, когда больше не будет записанных данных для потребления, но до того, как событие [`'end'`](/ru/nodejs/api/stream#event-end) будет испущено, сигнализируя об окончании потока [`Readable`](/ru/nodejs/api/stream#class-streamreadable).

В реализации `transform._flush()` метод `transform.push()` может быть вызван ноль или более раз, по мере необходимости. Функция `callback` должна быть вызвана, когда операция очистки завершена.

Метод `transform._flush()` имеет префикс подчеркивания, поскольку является внутренним для класса, который его определяет, и никогда не должен вызываться напрямую пользовательскими программами.


#### `transform._transform(chunk, encoding, callback)` {#transform_transformchunk-encoding-callback}

- `chunk` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `Buffer`, который нужно преобразовать, преобразованный из `string`, переданной в [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback). Если для опции `decodeStrings` потока установлено значение `false` или поток работает в объектном режиме, чанк не будет преобразован и будет тем, что было передано в [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если чанк является строкой, то это тип кодировки. Если чанк является буфером, то это специальное значение `'buffer'`. Игнорируйте его в этом случае.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова (необязательно с аргументом ошибки и данными), которая вызывается после обработки предоставленного `chunk`.

Эта функция НЕ ДОЛЖНА вызываться кодом приложения напрямую. Она должна быть реализована дочерними классами и вызываться только внутренними методами класса `Readable`.

Все реализации потока `Transform` должны предоставлять метод `_transform()` для приема входных данных и создания выходных данных. Реализация `transform._transform()` обрабатывает записываемые байты, вычисляет выходные данные, а затем передает эти выходные данные в доступную для чтения часть с помощью метода `transform.push()`.

Метод `transform.push()` может быть вызван ноль или более раз для генерации выходных данных из одного входного чанка, в зависимости от того, сколько нужно вывести в результате обработки чанка.

Возможно, что из любого данного чанка входных данных не будет сгенерировано никаких выходных данных.

Функция `callback` должна быть вызвана только тогда, когда текущий чанк полностью обработан. Первым аргументом, передаваемым в `callback`, должен быть объект `Error`, если при обработке входных данных произошла ошибка, или `null` в противном случае. Если второй аргумент передается в `callback`, он будет передан в метод `transform.push()`, но только если первый аргумент является ложным. Другими словами, следующие примеры эквивалентны:

```js [ESM]
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```
Метод `transform._transform()` имеет префикс подчеркивания, потому что он является внутренним для класса, который его определяет, и никогда не должен вызываться напрямую пользовательскими программами.

`transform._transform()` никогда не вызывается параллельно; потоки реализуют механизм очереди, и для получения следующего чанка необходимо вызвать `callback`, либо синхронно, либо асинхронно.


#### Класс: `stream.PassThrough` {#class-streampassthrough}

Класс `stream.PassThrough` является тривиальной реализацией потока [`Transform`](/ru/nodejs/api/stream#class-streamtransform), который просто пропускает входные байты на выход. Его цель в основном для примеров и тестирования, но есть некоторые случаи использования, когда `stream.PassThrough` полезен в качестве строительного блока для новых видов потоков.

## Дополнительные заметки {#additional-notes}

### Совместимость потоков с асинхронными генераторами и асинхронными итераторами {#streams-compatibility-with-async-generators-and-async-iterators}

С поддержкой асинхронных генераторов и итераторов в JavaScript, асинхронные генераторы фактически являются первоклассной языковой конструкцией потока на данный момент.

Ниже приведены некоторые распространенные случаи взаимодействия использования потоков Node.js с асинхронными генераторами и асинхронными итераторами.

#### Потребление читаемых потоков с помощью асинхронных итераторов {#consuming-readable-streams-with-async-iterators}

```js [ESM]
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```
Асинхронные итераторы регистрируют постоянный обработчик ошибок в потоке, чтобы предотвратить любые необработанные ошибки после уничтожения.

#### Создание читаемых потоков с помощью асинхронных генераторов {#creating-readable-streams-with-async-generators}

Читаемый поток Node.js можно создать из асинхронного генератора с помощью служебного метода `Readable.from()`:

```js [ESM]
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```
#### Передача данных в записываемые потоки из асинхронных итераторов {#piping-to-writable-streams-from-async-iterators}

При записи в записываемый поток из асинхронного итератора обеспечьте правильную обработку обратного давления и ошибок. [`stream.pipeline()`](/ru/nodejs/api/stream#streampipelinesource-transforms-destination-callback) абстрагирует обработку обратного давления и связанных с ним ошибок:

```js [ESM]
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Callback Pattern
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise Pattern
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### Совместимость со старыми версиями Node.js {#compatibility-with-older-nodejs-versions}

До Node.js 0.10 интерфейс потока `Readable` был проще, но также менее мощным и полезным.

- Вместо ожидания вызовов метода [`stream.read()`](/ru/nodejs/api/stream#readablereadsize), события [`'data'`](/ru/nodejs/api/stream#event-data) начинали генерироваться немедленно. Приложения, которым требовалось выполнить определенную работу, чтобы решить, как обрабатывать данные, должны были хранить прочитанные данные в буферах, чтобы данные не были потеряны.
- Метод [`stream.pause()`](/ru/nodejs/api/stream#readablepause) носил рекомендательный, а не гарантированный характер. Это означало, что все равно необходимо быть готовым к получению событий [`'data'`](/ru/nodejs/api/stream#event-data) *даже когда поток находится в приостановленном состоянии*.

В Node.js 0.10 был добавлен класс [`Readable`](/ru/nodejs/api/stream#class-streamreadable). Для обратной совместимости со старыми программами Node.js потоки `Readable` переключаются в "текущий режим", когда добавляется обработчик событий [`'data'`](/ru/nodejs/api/stream#event-data) или когда вызывается метод [`stream.resume()`](/ru/nodejs/api/stream#readableresume). Эффект заключается в том, что даже если не использовать новый метод [`stream.read()`](/ru/nodejs/api/stream#readablereadsize) и событие [`'readable'`](/ru/nodejs/api/stream#event-readable), больше не нужно беспокоиться о потере чанков [`'data'`](/ru/nodejs/api/stream#event-data).

Хотя большинство приложений продолжат функционировать нормально, это создает пограничный случай в следующих условиях:

- Не добавлен прослушиватель событий [`'data'`](/ru/nodejs/api/stream#event-data).
- Метод [`stream.resume()`](/ru/nodejs/api/stream#readableresume) никогда не вызывается.
- Поток не перенаправляется ни в какое доступное для записи место назначения.

Например, рассмотрим следующий код:

```js [ESM]
// ВНИМАНИЕ!  СЛОМАНО!
net.createServer((socket) => {

  // Мы добавляем прослушиватель 'end', но никогда не используем данные.
  socket.on('end', () => {
    // Сюда никогда не попадет.
    socket.end('The message was received but was not processed.\n');
  });

}).listen(1337);
```
До Node.js 0.10 входящие данные сообщения просто отбрасывались. Однако в Node.js 0.10 и более поздних версиях сокет остается приостановленным навсегда.

Обходным решением в этой ситуации является вызов метода [`stream.resume()`](/ru/nodejs/api/stream#readableresume) для начала потока данных:

```js [ESM]
// Обходное решение.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('The message was received but was not processed.\n');
  });

  // Запустите поток данных, отбрасывая его.
  socket.resume();
}).listen(1337);
```
В дополнение к новым потокам `Readable`, переключающимся в текущий режим, потоки в стиле до 0.10 могут быть обернуты в класс `Readable` с помощью метода [`readable.wrap()`](/ru/nodejs/api/stream#readablewrapstream).


### `readable.read(0)` {#readableread0}

В некоторых случаях необходимо вызвать обновление основных механизмов читаемого потока, фактически не потребляя никаких данных. В таких случаях можно вызвать `readable.read(0)`, который всегда будет возвращать `null`.

Если внутренний буфер чтения ниже `highWaterMark`, и поток в данный момент не читает, то вызов `stream.read(0)` вызовет низкоуровневый вызов [`stream._read()`](/ru/nodejs/api/stream#readable_readsize).

Хотя большинству приложений это почти никогда не понадобится, в Node.js есть ситуации, когда это делается, особенно во внутренних компонентах класса `Readable` stream.

### `readable.push('')` {#readablepush}

Использование `readable.push('')` не рекомендуется.

Отправка нулевого байта [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) или [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) в поток, который не находится в объектном режиме, имеет интересный побочный эффект. Поскольку это *является* вызовом [`readable.push()`](/ru/nodejs/api/stream#readablepushchunk-encoding), вызов завершит процесс чтения. Однако, поскольку аргумент является пустой строкой, в читаемый буфер не добавляются данные, поэтому пользователю нечего потреблять.

### Несоответствие `highWaterMark` после вызова `readable.setEncoding()` {#highwatermark-discrepancy-after-calling-readablesetencoding}

Использование `readable.setEncoding()` изменит поведение работы `highWaterMark` в безобъектном режиме.

Обычно размер текущего буфера измеряется по отношению к `highWaterMark` в *байтах*. Однако после вызова `setEncoding()` функция сравнения начнет измерять размер буфера в *символах*.

Это не является проблемой в обычных случаях с `latin1` или `ascii`. Но рекомендуется помнить об этом поведении при работе со строками, которые могут содержать многобайтовые символы.

