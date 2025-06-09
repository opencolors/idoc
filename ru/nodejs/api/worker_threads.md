---
title: Рабочие потоки Node.js
description: Документация по использованию рабочих потоков в Node.js для использования многопоточности для задач, требующих больших вычислительных ресурсов, с обзором класса Worker, коммуникации между потоками и примерами использования.
head:
  - - meta
    - name: og:title
      content: Рабочие потоки Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Документация по использованию рабочих потоков в Node.js для использования многопоточности для задач, требующих больших вычислительных ресурсов, с обзором класса Worker, коммуникации между потоками и примерами использования.
  - - meta
    - name: twitter:title
      content: Рабочие потоки Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Документация по использованию рабочих потоков в Node.js для использования многопоточности для задач, требующих больших вычислительных ресурсов, с обзором класса Worker, коммуникации между потоками и примерами использования.
---


# Рабочие потоки (Worker threads) {#worker-threads}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/worker_threads.js](https://github.com/nodejs/node/blob/v23.5.0/lib/worker_threads.js)

Модуль `node:worker_threads` позволяет использовать потоки, которые выполняют JavaScript параллельно. Для доступа к нему:

```js [ESM]
const worker = require('node:worker_threads');
```

Рабочие потоки (workers) полезны для выполнения операций JavaScript, интенсивно использующих ресурсы ЦП. Они мало помогают с операциями ввода-вывода. Встроенные в Node.js асинхронные операции ввода-вывода более эффективны, чем рабочие потоки.

В отличие от `child_process` или `cluster`, `worker_threads` могут совместно использовать память. Они делают это путем передачи экземпляров `ArrayBuffer` или совместного использования экземпляров `SharedArrayBuffer`.

```js [ESM]
const {
  Worker, isMainThread, parentPort, workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```

Приведенный выше пример порождает рабочий поток для каждого вызова `parseJSAsync()`. На практике для таких задач следует использовать пул рабочих потоков. В противном случае накладные расходы на создание рабочих потоков, скорее всего, превысят их выгоду.

При реализации пула рабочих потоков используйте API [`AsyncResource`](/ru/nodejs/api/async_hooks#class-asyncresource), чтобы информировать диагностические инструменты (например, для предоставления асинхронных трассировок стека) о взаимосвязи между задачами и их результатами. См. ["Использование `AsyncResource` для пула потоков `Worker`"](/ru/nodejs/api/async_context#using-asyncresource-for-a-worker-thread-pool) в документации `async_hooks` для примера реализации.

Рабочие потоки по умолчанию наследуют параметры, не относящиеся к конкретному процессу. Обратитесь к [`Параметры конструктора Worker`](/ru/nodejs/api/worker_threads#new-workerfilename-options), чтобы узнать, как настроить параметры рабочего потока, в частности параметры `argv` и `execArgv`.


## `worker.getEnvironmentData(key)` {#workergetenvironmentdatakey}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.5.0, v16.15.0 | Больше не является экспериментальной. |
| v15.12.0, v14.18.0 | Добавлено в: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое произвольное, клонируемое JavaScript значение, которое может быть использовано в качестве ключа [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Внутри рабочего потока, `worker.getEnvironmentData()` возвращает клон данных, переданных в поток-родитель посредством `worker.setEnvironmentData()`. Каждый новый `Worker` автоматически получает свою собственную копию данных окружения.

```js [ESM]
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Выводит 'World!'.
}
```
## `worker.isMainThread` {#workerismainthread}

**Добавлено в: v10.5.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Является `true`, если этот код не выполняется внутри потока [`Worker`](/ru/nodejs/api/worker_threads#class-worker).

```js [ESM]
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // Это перезагружает текущий файл внутри экземпляра Worker.
  new Worker(__filename);
} else {
  console.log('Внутри Worker!');
  console.log(isMainThread);  // Выводит 'false'.
}
```
## `worker.markAsUntransferable(object)` {#workermarkasuntransferableobject}

**Добавлено в: v14.5.0, v12.19.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое произвольное JavaScript значение.

Пометить объект как непередаваемый. Если `object` встречается в списке переноса вызова [`port.postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist), выбрасывается ошибка. Это no-op, если `object` является примитивным значением.

В частности, это имеет смысл для объектов, которые можно клонировать, а не передавать, и которые используются другими объектами на отправляющей стороне. Например, Node.js помечает `ArrayBuffer`'ы, которые он использует для своего [`Buffer` пула](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize), этим.

Эту операцию нельзя отменить.

```js [ESM]
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // Это вызовет ошибку, потому что pooledBuffer не является передаваемым.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// Следующая строка выводит содержимое typedArray1 -- он по-прежнему владеет
// своей памятью и не был передан. Без
// `markAsUntransferable()`, это вывело бы пустой Uint8Array, и
// вызов postMessage прошел бы успешно.
// typedArray2 также не поврежден.
console.log(typedArray1);
console.log(typedArray2);
```
В браузерах нет эквивалента этому API.


## `worker.isMarkedAsUntransferable(object)` {#workerismarkedasuntransferableobject}

**Добавлено в версии: v21.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое значение JavaScript.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Проверяет, помечен ли объект как нетранспортируемый с помощью [`markAsUntransferable()`](/ru/nodejs/api/worker_threads#workermarkasuntransferableobject).

```js [ESM]
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Возвращает true.
```
В браузерах нет эквивалента этому API.

## `worker.markAsUncloneable(object)` {#workermarkasuncloneableobject}

**Добавлено в версии: v23.0.0**

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое произвольное значение JavaScript.

Помечает объект как не клонируемый. Если `object` используется как [`message`](/ru/nodejs/api/worker_threads#event-message) в вызове [`port.postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist), выбрасывается ошибка. Это пустая операция, если `object` является примитивным значением.

Это не влияет на `ArrayBuffer` или любые объекты, подобные `Buffer`.

Эту операцию нельзя отменить.

```js [ESM]
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // Это вызовет ошибку, потому что anyObject не клонируется.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```
В браузерах нет эквивалента этому API.

## `worker.moveMessagePortToContext(port, contextifiedSandbox)` {#workermovemessageporttocontextport-contextifiedsandbox}

**Добавлено в версии: v11.13.0**

-  `port` [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport) Порт сообщений для передачи. 
-  `contextifiedSandbox` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Контекстуализированный](/ru/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) объект, возвращенный методом `vm.createContext()`. 
-  Возвращает: [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport) 

Передает `MessagePort` в другой [`vm`](/ru/nodejs/api/vm) Context. Исходный объект `port` становится непригодным для использования, а возвращенный экземпляр `MessagePort` занимает его место.

Возвращенный `MessagePort` является объектом в целевом контексте и наследует от его глобального класса `Object`. Объекты, передаваемые в прослушиватель [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage), также создаются в целевом контексте и наследуют от его глобального класса `Object`.

Однако созданный `MessagePort` больше не наследует от [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget), и для получения событий можно использовать только [`port.onmessage()`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/onmessage).


## `worker.parentPort` {#workerparentport}

**Добавлено в версии: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport)

Если этот поток является [`Worker`](/ru/nodejs/api/worker_threads#class-worker), то это [`MessagePort`](/ru/nodejs/api/worker_threads#class-messageport), позволяющий общаться с родительским потоком. Сообщения, отправленные с использованием `parentPort.postMessage()`, доступны в родительском потоке с помощью `worker.on('message')`, а сообщения, отправленные из родительского потока с использованием `worker.postMessage()`, доступны в этом потоке с помощью `parentPort.on('message')`.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Выводит 'Hello, world!'.
  });
  worker.postMessage('Hello, world!');
} else {
  // Когда приходит сообщение из родительского потока, отправьте его обратно:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```
## `worker.postMessageToThread(threadId, value[, transferList][, timeout])` {#workerpostmessagetothreadthreadid-value-transferlist-timeout}

**Добавлено в версии: v22.5.0**

::: warning [Стабильно: 1 - Экспериментальное]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `threadId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ID целевого потока. Если ID потока недействителен, будет выброшена ошибка [`ERR_WORKER_MESSAGING_FAILED`](/ru/nodejs/api/errors#err_worker_messaging_failed). Если ID целевого потока является ID текущего потока, будет выброшена ошибка [`ERR_WORKER_MESSAGING_SAME_THREAD`](/ru/nodejs/api/errors#err_worker_messaging_same_thread).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Отправляемое значение.
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Если один или несколько объектов, подобных `MessagePort`, передаются в `value`, требуется `transferList` для этих элементов, иначе будет выброшена ошибка [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ru/nodejs/api/errors#err_missing_message_port_in_transfer_list). Смотрите [`port.postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist) для получения дополнительной информации.
- `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Время ожидания доставки сообщения в миллисекундах. По умолчанию `undefined`, что означает ждать бесконечно. Если время ожидания операции истекает, будет выброшена ошибка [`ERR_WORKER_MESSAGING_TIMEOUT`](/ru/nodejs/api/errors#err_worker_messaging_timeout).
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Promise, который выполняется, если сообщение было успешно обработано целевым потоком.

Отправляет значение другому воркеру, идентифицированному по его ID потока.

Если у целевого потока нет слушателя события `workerMessage`, то операция вызовет ошибку [`ERR_WORKER_MESSAGING_FAILED`](/ru/nodejs/api/errors#err_worker_messaging_failed).

Если целевой поток выбросил ошибку при обработке события `workerMessage`, то операция вызовет ошибку [`ERR_WORKER_MESSAGING_ERRORED`](/ru/nodejs/api/errors#err_worker_messaging_errored).

Этот метод следует использовать, когда целевой поток не является прямым родителем или дочерним потоком текущего потока. Если два потока являются родительскими и дочерними, используйте [`require('node:worker_threads').parentPort.postMessage()`](/ru/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) и [`worker.postMessage()`](/ru/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) для обеспечения связи между потоками.

Пример ниже показывает использование `postMessageToThread`: он создает 10 вложенных потоков, последний из которых попытается связаться с основным потоком.



::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(fileURLToPath(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```js [CJS]
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```
:::


## `worker.receiveMessageOnPort(port)` {#workerreceivemessageonportport}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.12.0 | Теперь аргумент port также может ссылаться на `BroadcastChannel`. |
| v12.3.0 | Добавлено в: v12.3.0 |
:::

-  `port` [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport) | [\<BroadcastChannel\>](/ru/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget)
-  Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Получает единственное сообщение из данного `MessagePort`. Если сообщение недоступно, возвращается `undefined`, в противном случае возвращается объект с единственным свойством `message`, содержащим полезную нагрузку сообщения, соответствующую самому старому сообщению в очереди `MessagePort`.

```js [ESM]
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Выводит: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Выводит: undefined
```
Когда эта функция используется, событие `'message'` не генерируется, и прослушиватель `onmessage` не вызывается.

## `worker.resourceLimits` {#workerresourcelimits}

**Добавлено в: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Предоставляет набор ограничений ресурсов движка JS внутри этого рабочего потока (Worker thread). Если опция `resourceLimits` была передана конструктору [`Worker`](/ru/nodejs/api/worker_threads#class-worker), это соответствует ее значениям.

Если это используется в основном потоке, его значение является пустым объектом.


## `worker.SHARE_ENV` {#workershare_env}

**Добавлено в версии: v11.14.0**

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)

Специальное значение, которое может быть передано в качестве опции `env` конструктора [`Worker`](/ru/nodejs/api/worker_threads#class-worker), чтобы указать, что текущий поток и рабочий поток должны совместно использовать доступ для чтения и записи к одному и тому же набору переменных окружения.

```js [ESM]
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .on('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // Выводит 'foo'.
  });
```
## `worker.setEnvironmentData(key[, value])` {#workersetenvironmentdatakey-value}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.5.0, v16.15.0 | Больше не является экспериментальной функцией. |
| v15.12.0, v14.18.0 | Добавлено в версии: v15.12.0, v14.18.0 |
:::

- `key` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое произвольное, клонируемое значение JavaScript, которое может быть использовано в качестве ключа [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое произвольное, клонируемое значение JavaScript, которое будет клонировано и автоматически передано всем новым экземплярам `Worker`. Если `value` передается как `undefined`, любое ранее установленное значение для `key` будет удалено.

API `worker.setEnvironmentData()` устанавливает содержимое `worker.getEnvironmentData()` в текущем потоке и во всех новых экземплярах `Worker`, порожденных из текущего контекста.

## `worker.threadId` {#workerthreadid}

**Добавлено в версии: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Целочисленный идентификатор для текущего потока. В соответствующем рабочем объекте (если он есть) он доступен как [`worker.threadId`](/ru/nodejs/api/worker_threads#workerthreadid_1). Это значение уникально для каждого экземпляра [`Worker`](/ru/nodejs/api/worker_threads#class-worker) внутри одного процесса.


## `worker.workerData` {#workerworkerdata}

**Добавлено в версии: v10.5.0**

Произвольное значение JavaScript, содержащее клон данных, переданных конструктору `Worker` этого потока.

Данные клонируются как при использовании [`postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist), в соответствии с [алгоритмом структурированного клонирования HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

```js [ESM]
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // Выводит 'Hello, world!'.
}
```
## Класс: `BroadcastChannel extends EventTarget` {#class-broadcastchannel-extends-eventtarget}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Больше не является экспериментальным. |
| v15.4.0 | Добавлено в версии: v15.4.0 |
:::

Экземпляры `BroadcastChannel` позволяют осуществлять асинхронную связь "один ко многим" со всеми другими экземплярами `BroadcastChannel`, привязанными к одному и тому же имени канала.

```js [ESM]
'use strict';

const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```
### `new BroadcastChannel(name)` {#new-broadcastchannelname}

**Добавлено в версии: v15.4.0**

- `name` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Имя канала для подключения. Разрешено любое значение JavaScript, которое можно преобразовать в строку с помощью ``${name}``.

### `broadcastChannel.close()` {#broadcastchannelclose}

**Добавлено в версии: v15.4.0**

Закрывает соединение `BroadcastChannel`.

### `broadcastChannel.onmessage` {#broadcastchannelonmessage}

**Добавлено в версии: v15.4.0**

- Тип: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается с единственным аргументом `MessageEvent` при получении сообщения.


### `broadcastChannel.onmessageerror` {#broadcastchannelonmessageerror}

**Добавлено в: v15.4.0**

- Тип: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается, если полученное сообщение не может быть десериализовано.

### `broadcastChannel.postMessage(message)` {#broadcastchannelpostmessagemessage}

**Добавлено в: v15.4.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое клонируемое JavaScript-значение.

### `broadcastChannel.ref()` {#broadcastchannelref}

**Добавлено в: v15.4.0**

Противоположность `unref()`. Вызов `ref()` на ранее `unref()`ed BroadcastChannel *не* позволяет программе завершиться, если это единственный активный обработчик (поведение по умолчанию). Если порт `ref()`ed, повторный вызов `ref()` не имеет эффекта.

### `broadcastChannel.unref()` {#broadcastchannelunref}

**Добавлено в: v15.4.0**

Вызов `unref()` на BroadcastChannel позволяет потоку завершиться, если это единственный активный обработчик в системе событий. Если BroadcastChannel уже `unref()`ed, повторный вызов `unref()` не имеет эффекта.

## Класс: `MessageChannel` {#class-messagechannel}

**Добавлено в: v10.5.0**

Экземпляры класса `worker.MessageChannel` представляют собой асинхронный двусторонний канал связи. `MessageChannel` не имеет собственных методов. `new MessageChannel()` возвращает объект со свойствами `port1` и `port2`, которые ссылаются на связанные экземпляры [`MessagePort`](/ru/nodejs/api/worker_threads#class-messageport).

```js [ESM]
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// Выводит: received { foo: 'bar' } из слушателя `port1.on('message')`
```
## Класс: `MessagePort` {#class-messageport}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.7.0 | Этот класс теперь наследуется от `EventTarget`, а не от `EventEmitter`. |
| v10.5.0 | Добавлено в: v10.5.0 |
:::

- Наследуется: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget)

Экземпляры класса `worker.MessagePort` представляют собой один конец асинхронного двустороннего канала связи. Его можно использовать для передачи структурированных данных, областей памяти и других `MessagePort` между различными [`Worker`](/ru/nodejs/api/worker_threads#class-worker).

Эта реализация соответствует [browser `MessagePort`](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)s.


### Событие: `'close'` {#event-close}

**Добавлено в версии: v10.5.0**

Событие `'close'` испускается, когда любая из сторон канала была отключена.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// Выводит:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.on('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```
### Событие: `'message'` {#event-message}

**Добавлено в версии: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Передаваемое значение

Событие `'message'` испускается для любого входящего сообщения, содержащего клонированный ввод [`port.postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist).

Прослушиватели этого события получают клон параметра `value`, переданного в `postMessage()`, и никаких других аргументов.

### Событие: `'messageerror'` {#event-messageerror}

**Добавлено в версии: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Объект Error

Событие `'messageerror'` испускается, когда не удалось десериализовать сообщение.

В настоящее время это событие испускается, когда происходит ошибка при создании отправленного JS-объекта на принимающей стороне. Такие ситуации редки, но могут произойти, например, когда определенные объекты API Node.js принимаются в `vm.Context` (где API Node.js в настоящее время недоступны).

### `port.close()` {#portclose}

**Добавлено в версии: v10.5.0**

Отключает дальнейшую отправку сообщений с любой стороны соединения. Этот метод можно вызвать, если дальнейшая связь по этому `MessagePort` не планируется.

Событие [`'close'` event](/ru/nodejs/api/worker_threads#event-close) испускается на обоих экземплярах `MessagePort`, являющихся частью канала.

### `port.postMessage(value[, transferList])` {#portpostmessagevalue-transferlist}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Выбрасывается ошибка, когда нетрансферируемый объект находится в списке передачи. |
| v15.6.0 | Добавлен `X509Certificate` в список клонируемых типов. |
| v15.0.0 | Добавлен `CryptoKey` в список клонируемых типов. |
| v15.14.0, v14.18.0 | Добавлен 'BlockList' в список клонируемых типов. |
| v15.9.0, v14.18.0 | Добавлены типы 'Histogram' в список клонируемых типов. |
| v14.5.0, v12.19.0 | Добавлен `KeyObject` в список клонируемых типов. |
| v14.5.0, v12.19.0 | Добавлен `FileHandle` в список передаваемых типов. |
| v10.5.0 | Добавлено в версии: v10.5.0 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Отправляет значение JavaScript на принимающую сторону этого канала. `value` передается способом, совместимым с [алгоритмом структурированного клонирования HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm).

В частности, существенные отличия от `JSON` заключаются в следующем:

- `value` может содержать циклические ссылки.
- `value` может содержать экземпляры встроенных JS-типов, таких как `RegExp`s, `BigInt`s, `Map`s, `Set`s и т.д.
- `value` может содержать типизированные массивы, как с использованием `ArrayBuffer`s, так и `SharedArrayBuffer`s.
- `value` может содержать экземпляры [`WebAssembly.Module`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module).
- `value` не может содержать нативные (поддерживаемые C++) объекты, кроме:
    - [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey)s,
    - [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle)s,
    - [\<Histogram\>](/ru/nodejs/api/perf_hooks#class-histogram)s,
    - [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject)s,
    - [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport)s,
    - [\<net.BlockList\>](/ru/nodejs/api/net#class-netblocklist)s,
    - [\<net.SocketAddress\>](/ru/nodejs/api/net#class-netsocketaddress)es,
    - [\<X509Certificate\>](/ru/nodejs/api/crypto#class-x509certificate)s.
  
 

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// Выводит: { foo: [Circular] }
port2.postMessage(circularData);
```
`transferList` может быть списком объектов [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`MessagePort`](/ru/nodejs/api/worker_threads#class-messageport) и [`FileHandle`](/ru/nodejs/api/fs#class-filehandle). После передачи они больше не могут использоваться на отправляющей стороне канала (даже если они не содержатся в `value`). В отличие от [дочерних процессов](/ru/nodejs/api/child_process), передача дескрипторов, таких как сетевые сокеты, в настоящее время не поддерживается.

Если `value` содержит экземпляры [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), они доступны из любого потока. Их нельзя указывать в `transferList`.

`value` все еще может содержать экземпляры `ArrayBuffer`, которых нет в `transferList`; в этом случае базовая память копируется, а не перемещается.

```js [ESM]
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// Это отправляет копию `uint8Array`:
port2.postMessage(uint8Array);
// Это не копирует данные, но делает `uint8Array` непригодным для использования:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// Память для `sharedUint8Array` доступна как из оригинала, так и из копии,
// полученной через `.on('message')`:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// Это передает только что созданный порт сообщения получателю.
// Это можно использовать, например, для создания каналов связи между
// несколькими потоками `Worker`, являющимися дочерними по отношению к одному и тому же родительскому потоку.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```
Объект сообщения клонируется немедленно и может быть изменен после отправки без побочных эффектов.

Для получения дополнительной информации о механизмах сериализации и десериализации, лежащих в основе этого API, см. [API сериализации модуля `node:v8`](/ru/nodejs/api/v8#serialization-api).


#### Рекомендации при передаче TypedArray и Buffers {#considerations-when-transferring-typedarrays-and-buffers}

Все экземпляры `TypedArray` и `Buffer` являются представлениями над базовым `ArrayBuffer`. То есть, именно `ArrayBuffer` фактически хранит необработанные данные, в то время как объекты `TypedArray` и `Buffer` предоставляют способ просмотра и манипулирования данными. Возможно и распространено создание нескольких представлений над одним и тем же экземпляром `ArrayBuffer`. При использовании списка передачи для передачи `ArrayBuffer` необходимо соблюдать большую осторожность, поскольку это приводит к тому, что все экземпляры `TypedArray` и `Buffer`, которые совместно используют один и тот же `ArrayBuffer`, становятся непригодными для использования.

```js [ESM]
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // печатает 5

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // печатает 0
```
В частности, для экземпляров `Buffer` возможность передачи или клонирования базового `ArrayBuffer` полностью зависит от того, как были созданы экземпляры, что часто невозможно надежно определить.

`ArrayBuffer` можно пометить с помощью [`markAsUntransferable()`](/ru/nodejs/api/worker_threads#workermarkasuntransferableobject), чтобы указать, что его всегда следует клонировать и никогда не передавать.

В зависимости от того, как был создан экземпляр `Buffer`, он может владеть или не владеть базовым `ArrayBuffer`. `ArrayBuffer` не должен передаваться, если не известно, что экземпляр `Buffer` владеет им. В частности, для `Buffer`'ов, созданных из внутреннего пула `Buffer` (например, с использованием `Buffer.from()` или `Buffer.allocUnsafe()`), их передача невозможна, и они всегда клонируются, что приводит к отправке копии всего пула `Buffer`. Такое поведение может привести к непреднамеренному увеличению использования памяти и возможным проблемам с безопасностью.

См. [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize) для получения более подробной информации о пуле `Buffer`.

`ArrayBuffer`'ы для экземпляров `Buffer`, созданных с использованием `Buffer.alloc()` или `Buffer.allocUnsafeSlow()`, всегда могут быть переданы, но это делает все другие существующие представления этих `ArrayBuffer`'ов непригодными для использования.


#### Рекомендации по клонированию объектов с прототипами, классами и аксессорами {#considerations-when-cloning-objects-with-prototypes-classes-and-accessors}

Поскольку клонирование объектов использует [алгоритм структурированного клонирования HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), неперечислимые свойства, аксессоры свойств и прототипы объектов не сохраняются. В частности, объекты [`Buffer`](/ru/nodejs/api/buffer) будут читаться как обычные [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) на принимающей стороне, а экземпляры классов JavaScript будут клонированы как обычные объекты JavaScript.

```js [ESM]
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return 4; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```
Это ограничение распространяется на многие встроенные объекты, такие как глобальный объект `URL`:

```js [ESM]
const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new URL('https://example.org'));

// Prints: { }
```
### `port.hasRef()` {#porthasref}

**Добавлено в: v18.1.0, v16.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если true, объект `MessagePort` будет поддерживать активность цикла событий Node.js.

### `port.ref()` {#portref}

**Добавлено в: v10.5.0**

Противоположность `unref()`. Вызов `ref()` для ранее вызванного `unref()` порта *не* позволяет программе завершиться, если это единственный оставшийся активный дескриптор (поведение по умолчанию). Если для порта вызывается `ref()`, повторный вызов `ref()` не имеет никакого эффекта.

Если слушатели присоединяются или удаляются с помощью `.on('message')`, для порта автоматически вызывается `ref()` и `unref()` в зависимости от того, существуют ли слушатели для события.


### `port.start()` {#portstart}

**Добавлено в версии: v10.5.0**

Начинает прием сообщений на данном `MessagePort`. При использовании этого порта в качестве генератора событий, этот метод вызывается автоматически после прикрепления слушателей `'message'`.

Этот метод существует для паритета с Web `MessagePort` API. В Node.js он полезен только для игнорирования сообщений при отсутствии слушателя событий. Node.js также отличается в обработке `.onmessage`. Установка его автоматически вызывает `.start()`, но отмена его позволяет сообщениям вставать в очередь до тех пор, пока не будет установлен новый обработчик или порт не будет отброшен.

### `port.unref()` {#portunref}

**Добавлено в версии: v10.5.0**

Вызов `unref()` на порту позволяет потоку завершиться, если это единственный активный дескриптор в системе событий. Если порт уже `unref()`ed, повторный вызов `unref()` не имеет эффекта.

Если слушатели подключены или удалены с использованием `.on('message')`, порт автоматически `ref()`ed и `unref()`ed в зависимости от наличия слушателей для события.

## Класс: `Worker` {#class-worker}

**Добавлено в версии: v10.5.0**

- Расширяет: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Класс `Worker` представляет собой независимый поток выполнения JavaScript. Большинство API Node.js доступны внутри него.

Заметные отличия внутри среды Worker:

- Потоки [`process.stdin`](/ru/nodejs/api/process#processstdin), [`process.stdout`](/ru/nodejs/api/process#processstdout) и [`process.stderr`](/ru/nodejs/api/process#processstderr) могут быть перенаправлены родительским потоком.
- Свойство [`require('node:worker_threads').isMainThread`](/ru/nodejs/api/worker_threads#workerismainthread) установлено в `false`.
- Доступен порт сообщений [`require('node:worker_threads').parentPort`](/ru/nodejs/api/worker_threads#workerparentport).
- [`process.exit()`](/ru/nodejs/api/process#processexitcode) не останавливает всю программу, а только один поток, и [`process.abort()`](/ru/nodejs/api/process#processabort) недоступен.
- [`process.chdir()`](/ru/nodejs/api/process#processchdirdirectory) и методы `process`, устанавливающие идентификаторы группы или пользователя, недоступны.
- [`process.env`](/ru/nodejs/api/process#processenv) является копией переменных окружения родительского потока, если не указано иное. Изменения в одной копии не видны в других потоках и не видны для нативных дополнений (если [`worker.SHARE_ENV`](/ru/nodejs/api/worker_threads#workershare_env) не передан в качестве опции `env` конструктору [`Worker`](/ru/nodejs/api/worker_threads#class-worker)). В Windows, в отличие от основного потока, копия переменных окружения работает с учетом регистра.
- [`process.title`](/ru/nodejs/api/process#processtitle) не может быть изменен.
- Сигналы не доставляются через [`process.on('...')`](/ru/nodejs/api/process#signal-events).
- Выполнение может остановиться в любой момент в результате вызова [`worker.terminate()`](/ru/nodejs/api/worker_threads#workerterminate).
- Каналы IPC от родительских процессов недоступны.
- Модуль [`trace_events`](/ru/nodejs/api/tracing) не поддерживается.
- Нативные дополнения могут быть загружены из нескольких потоков только в том случае, если они удовлетворяют [определенным условиям](/ru/nodejs/api/addons#worker-support).

Создание экземпляров `Worker` внутри других `Worker` возможно.

Как и [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) и модуль [`node:cluster`](/ru/nodejs/api/cluster), двусторонняя связь может быть достигнута через межпотоковую передачу сообщений. Внутри `Worker` имеет встроенную пару [`MessagePort`](/ru/nodejs/api/worker_threads#class-messageport)s, которые уже связаны друг с другом при создании `Worker`. Хотя объект `MessagePort` на стороне родителя напрямую не предоставляется, его функциональные возможности предоставляются через [`worker.postMessage()`](/ru/nodejs/api/worker_threads#workerpostmessagevalue-transferlist) и событие [`worker.on('message')`](/ru/nodejs/api/worker_threads#event-message_1) на объекте `Worker` для родительского потока.

Для создания пользовательских каналов обмена сообщениями (что рекомендуется вместо использования глобального канала по умолчанию, поскольку это способствует разделению ответственности), пользователи могут создать объект `MessageChannel` в любом потоке и передать один из `MessagePort`s на этом `MessageChannel` другому потоку через существующий канал, такой как глобальный.

См. [`port.postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist) для получения дополнительной информации о том, как передаются сообщения и какие типы значений JavaScript могут быть успешно переданы через барьер потоков.

```js [ESM]
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])` {#new-workerfilename-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.8.0, v18.16.0 | Добавлена поддержка опции `name`, позволяющей добавлять имя к заголовку worker-а для отладки. |
| v14.9.0 | Параметр `filename` может быть объектом WHATWG `URL` с использованием протокола `data:`. |
| v14.9.0 | Опция `trackUnmanagedFds` установлена в `true` по умолчанию. |
| v14.6.0, v12.19.0 | Введена опция `trackUnmanagedFds`. |
| v13.13.0, v12.17.0 | Введена опция `transferList`. |
| v13.12.0, v12.17.0 | Параметр `filename` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v13.4.0, v12.16.0 | Введена опция `argv`. |
| v13.2.0, v12.16.0 | Введена опция `resourceLimits`. |
| v10.5.0 | Добавлено в: v10.5.0 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Путь к основному скрипту или модулю Worker-а. Должен быть либо абсолютным путем, либо относительным путем (т.е. относительно текущего рабочего каталога), начинающимся с `./` или `../`, либо объектом WHATWG `URL` с использованием протокола `file:` или `data:`. При использовании [`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) данные интерпретируются на основе MIME-типа с использованием [загрузчика модулей ECMAScript](/ru/nodejs/api/esm#data-imports). Если `options.eval` имеет значение `true`, это строка, содержащая код JavaScript, а не путь.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `argv` [\<any[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Список аргументов, которые будут преобразованы в строку и добавлены к `process.argv` в worker-е. Это в основном похоже на `workerData`, но значения доступны в глобальном `process.argv`, как если бы они были переданы в качестве параметров CLI скрипту.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Если установлено, указывает начальное значение `process.env` внутри потока Worker. В качестве специального значения можно использовать [`worker.SHARE_ENV`](/ru/nodejs/api/worker_threads#workershare_env), чтобы указать, что родительский и дочерний потоки должны совместно использовать свои переменные среды; в этом случае изменения в объекте `process.env` одного потока влияют и на другой поток. **По умолчанию:** `process.env`.
    - `eval` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true` и первый аргумент является `string`, интерпретируйте первый аргумент конструктора как скрипт, который выполняется после того, как worker перейдет в онлайн.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список параметров node CLI, передаваемых worker-у. Параметры V8 (такие как `--max-old-space-size`) и параметры, влияющие на процесс (такие как `--title`), не поддерживаются. Если установлено, это предоставляется как [`process.execArgv`](/ru/nodejs/api/process#processexecargv) внутри worker-а. По умолчанию параметры наследуются от родительского потока.
    - `stdin` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, то `worker.stdin` предоставляет записываемый поток, содержимое которого отображается как `process.stdin` внутри Worker-а. По умолчанию данные не предоставляются.
    - `stdout` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, то `worker.stdout` автоматически не передается в `process.stdout` в родительском процессе.
    - `stderr` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, то `worker.stderr` автоматически не передается в `process.stderr` в родительском процессе.
    - `workerData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любое значение JavaScript, которое клонируется и становится доступным как [`require('node:worker_threads').workerData`](/ru/nodejs/api/worker_threads#workerworkerdata). Клонирование происходит, как описано в [алгоритме структурированного клонирования HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), и возникает ошибка, если объект не может быть клонирован (например, потому что он содержит `function`).
    - `trackUnmanagedFds` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, то Worker отслеживает необработанные файловые дескрипторы, управляемые через [`fs.open()`](/ru/nodejs/api/fs#fsopenpath-flags-mode-callback) и [`fs.close()`](/ru/nodejs/api/fs#fsclosefd-callback), и закрывает их при выходе Worker-а, аналогично другим ресурсам, таким как сетевые сокеты или файловые дескрипторы, управляемые через API [`FileHandle`](/ru/nodejs/api/fs#class-filehandle). Эта опция автоматически наследуется всеми вложенными `Worker`-ами. **По умолчанию:** `true`.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Если один или несколько объектов, подобных `MessagePort`, передаются в `workerData`, требуется `transferList` для этих элементов или возникает [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ru/nodejs/api/errors#err_missing_message_port_in_transfer_list). См. [`port.postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist) для получения дополнительной информации.
    - `resourceLimits` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный набор ограничений ресурсов для нового экземпляра JS-движка. Достижение этих ограничений приводит к завершению экземпляра `Worker`. Эти ограничения влияют только на JS-движок и никакие внешние данные, включая `ArrayBuffer`. Даже если эти ограничения установлены, процесс все равно может прерваться, если он столкнется с глобальной нехваткой памяти.
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер основной кучи в МБ. Если установлен аргумент командной строки [`--max-old-space-size`](/ru/nodejs/api/cli#--max-old-space-sizesize-in-mib), он переопределяет этот параметр.
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер области кучи для недавно созданных объектов. Если установлен аргумент командной строки [`--max-semi-space-size`](/ru/nodejs/api/cli#--max-semi-space-sizesize-in-mib), он переопределяет этот параметр.
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер предварительно выделенного диапазона памяти, используемого для сгенерированного кода.
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер стека по умолчанию для потока. Небольшие значения могут привести к непригодным для использования экземплярам Worker. **По умолчанию:** `4`.

    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательное `name`, которое будет добавлено к заголовку worker-а для отладки/идентификации, формируя окончательный заголовок как `[worker ${id}] ${name}`. **По умолчанию:** `''`.


### Событие: `'error'` {#event-error}

**Добавлено в: v10.5.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Событие `'error'` генерируется, если рабочий поток выдает необработанное исключение. В этом случае рабочий процесс завершается.

### Событие: `'exit'` {#event-exit}

**Добавлено в: v10.5.0**

- `exitCode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Событие `'exit'` генерируется, когда рабочий процесс останавливается. Если рабочий процесс завершился вызовом [`process.exit()`](/ru/nodejs/api/process#processexitcode), параметр `exitCode` является переданным кодом выхода. Если рабочий процесс был завершен, параметр `exitCode` равен `1`.

Это последнее событие, генерируемое любым экземпляром `Worker`.

### Событие: `'message'` {#event-message_1}

**Добавлено в: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Переданное значение

Событие `'message'` генерируется, когда рабочий поток вызывает [`require('node:worker_threads').parentPort.postMessage()`](/ru/nodejs/api/worker_threads#workerpostmessagevalue-transferlist). См. событие [`port.on('message')`](/ru/nodejs/api/worker_threads#event-message) для получения более подробной информации.

Все сообщения, отправленные из рабочего потока, генерируются до того, как на объекте `Worker` будет сгенерировано [`'exit'` event](/ru/nodejs/api/worker_threads#event-exit).

### Событие: `'messageerror'` {#event-messageerror_1}

**Добавлено в: v14.5.0, v12.19.0**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Объект Error

Событие `'messageerror'` генерируется, когда не удается десериализовать сообщение.

### Событие: `'online'` {#event-online}

**Добавлено в: v10.5.0**

Событие `'online'` генерируется, когда рабочий поток начал выполнение кода JavaScript.

### `worker.getHeapSnapshot([options])` {#workergetheapsnapshotoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.1.0 | Поддержка опций для настройки моментального снимка кучи. |
| v13.9.0, v12.17.0 | Добавлено в: v13.9.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `exposeInternals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если true, раскрывать внутренние данные в моментальном снимке кучи. **По умолчанию:** `false`.
    - `exposeNumericValues` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если true, раскрывать числовые значения в искусственных полях. **По умолчанию:** `false`.

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Promise для Readable Stream, содержащего моментальный снимок кучи V8

Возвращает читаемый поток для снимка V8 текущего состояния Worker. См. [`v8.getHeapSnapshot()`](/ru/nodejs/api/v8#v8getheapsnapshotoptions) для получения более подробной информации.

Если рабочий поток больше не запущен, что может произойти до генерации [`'exit'` event](/ru/nodejs/api/worker_threads#event-exit), возвращенный `Promise` немедленно отклоняется с ошибкой [`ERR_WORKER_NOT_RUNNING`](/ru/nodejs/api/errors#err_worker_not_running).


### `worker.performance` {#workerperformance}

**Добавлено в: v15.1.0, v14.17.0, v12.22.0**

Объект, который можно использовать для запроса информации о производительности экземпляра рабочего потока. Аналогичен [`perf_hooks.performance`](/ru/nodejs/api/perf_hooks#perf_hooksperformance).

#### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Добавлено в: v15.1.0, v14.17.0, v12.22.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Результат предыдущего вызова `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Результат предыдущего вызова `eventLoopUtilization()` до `utilization1`.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 

Тот же вызов, что и [`perf_hooks` `eventLoopUtilization()`](/ru/nodejs/api/perf_hooks#performanceeventlooputilizationutilization1-utilization2), за исключением того, что возвращаются значения экземпляра рабочего потока.

Одно из отличий заключается в том, что, в отличие от основного потока, начальная загрузка в рабочем потоке выполняется внутри цикла событий. Таким образом, использование цикла событий становится немедленно доступным, как только начинается выполнение скрипта рабочего потока.

Время `idle`, которое не увеличивается, не указывает на то, что рабочий поток застрял в начальной загрузке. В следующем примере показано, как весь жизненный цикл рабочего потока никогда не накапливает время `idle`, но все еще может обрабатывать сообщения.

```js [ESM]
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
  return;
}

parentPort.on('message', () => console.log('msg')).unref();
(function r(n) {
  if (--n < 0) return;
  const t = Date.now();
  while (Date.now() - t < 300);
  setImmediate(r, n);
})(10);
```
Использование цикла событий рабочего потока доступно только после того, как будет сгенерировано событие [`'online'` event](/ru/nodejs/api/worker_threads#event-online), и если его вызвать до этого или после события [`'exit'` event](/ru/nodejs/api/worker_threads#event-exit), то все свойства будут иметь значение `0`.


### `worker.postMessage(value[, transferList])` {#workerpostmessagevalue-transferlist}

**Добавлено в: v10.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Отправляет сообщение воркеру, которое принимается через [`require('node:worker_threads').parentPort.on('message')`](/ru/nodejs/api/worker_threads#event-message). Смотрите [`port.postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist) для получения более подробной информации.

### `worker.ref()` {#workerref}

**Добавлено в: v10.5.0**

Противоположность `unref()`, вызов `ref()` у ранее `unref()`ed воркера *не* позволяет программе завершиться, если это единственный активный обработчик (поведение по умолчанию). Если воркер `ref()`ed, повторный вызов `ref()` не имеет эффекта.

### `worker.resourceLimits` {#workerresourcelimits_1}

**Добавлено в: v13.2.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxYoungGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `maxOldGenerationSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `codeRangeSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `stackSizeMb` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Предоставляет набор ограничений ресурсов движка JS для этого рабочего потока. Если опция `resourceLimits` была передана в конструктор [`Worker`](/ru/nodejs/api/worker_threads#class-worker), это соответствует его значениям.

Если воркер остановлен, возвращаемое значение является пустым объектом.

### `worker.stderr` {#workerstderr}

**Добавлено в: v10.5.0**

- [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)

Это читаемый поток, который содержит данные, записанные в [`process.stderr`](/ru/nodejs/api/process#processstderr) внутри рабочего потока. Если `stderr: true` не было передано в конструктор [`Worker`](/ru/nodejs/api/worker_threads#class-worker), то данные перенаправляются в поток [`process.stderr`](/ru/nodejs/api/process#processstderr) родительского потока.


### `worker.stdin` {#workerstdin}

**Добавлено в версии: v10.5.0**

- [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)

Если `stdin: true` было передано в конструктор [`Worker`](/ru/nodejs/api/worker_threads#class-worker), то это записываемый поток. Данные, записанные в этот поток, будут доступны в рабочем потоке как [`process.stdin`](/ru/nodejs/api/process#processstdin).

### `worker.stdout` {#workerstdout}

**Добавлено в версии: v10.5.0**

- [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)

Это читаемый поток, который содержит данные, записанные в [`process.stdout`](/ru/nodejs/api/process#processstdout) внутри рабочего потока. Если `stdout: true` не было передано в конструктор [`Worker`](/ru/nodejs/api/worker_threads#class-worker), то данные передаются в поток [`process.stdout`](/ru/nodejs/api/process#processstdout) родительского потока.

### `worker.terminate()` {#workerterminate}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.5.0 | Эта функция теперь возвращает Promise. Передача обратного вызова устарела и была бесполезна до этой версии, так как Worker фактически завершался синхронно. Завершение теперь полностью асинхронная операция. |
| v10.5.0 | Добавлено в версии: v10.5.0 |
:::

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Останавливает выполнение всего JavaScript в рабочем потоке как можно скорее. Возвращает Promise для кода выхода, который выполняется при возникновении события [`'exit'` event](/ru/nodejs/api/worker_threads#event-exit).

### `worker.threadId` {#workerthreadid_1}

**Добавлено в версии: v10.5.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Целочисленный идентификатор для указанного потока. Внутри рабочего потока он доступен как [`require('node:worker_threads').threadId`](/ru/nodejs/api/worker_threads#workerthreadid). Это значение уникально для каждого экземпляра `Worker` внутри одного процесса.

### `worker.unref()` {#workerunref}

**Добавлено в версии: v10.5.0**

Вызов `unref()` у рабочего позволяет потоку завершиться, если это единственный активный дескриптор в системе событий. Если для рабочего уже был вызван `unref()`, повторный вызов `unref()` не имеет никакого эффекта.


## Заметки {#notes}

### Синхронная блокировка stdio {#synchronous-blocking-of-stdio}

`Worker` используют передачу сообщений через [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport) для реализации взаимодействия с `stdio`. Это означает, что вывод `stdio`, исходящий от `Worker`, может быть заблокирован синхронным кодом на принимающей стороне, который блокирует цикл событий Node.js.

::: code-group
```js [ESM]
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // Цикл для имитации работы.
  }
} else {
  // Этот вывод будет заблокирован циклом for в основном потоке.
  console.log('foo');
}
```

```js [CJS]
'use strict';

const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // Цикл для имитации работы.
  }
} else {
  // Этот вывод будет заблокирован циклом for в основном потоке.
  console.log('foo');
}
```
:::

### Запуск рабочих потоков из скриптов предварительной загрузки {#launching-worker-threads-from-preload-scripts}

Будьте осторожны при запуске рабочих потоков из скриптов предварительной загрузки (скриптов, загружаемых и запускаемых с помощью флага командной строки `-r`). Если параметр `execArgv` не установлен явно, новые рабочие потоки автоматически наследуют флаги командной строки от запущенного процесса и будут предварительно загружать те же скрипты предварительной загрузки, что и основной поток. Если скрипт предварительной загрузки безусловно запускает рабочий поток, каждый порожденный поток будет порождать другой, пока приложение не упадет.

