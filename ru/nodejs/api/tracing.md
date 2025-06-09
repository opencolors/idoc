---
title: События трассировки Node.js
description: Документация по использованию API событий трассировки Node.js для профилирования производительности и отладки.
head:
  - - meta
    - name: og:title
      content: События трассировки Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Документация по использованию API событий трассировки Node.js для профилирования производительности и отладки.
  - - meta
    - name: twitter:title
      content: События трассировки Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Документация по использованию API событий трассировки Node.js для профилирования производительности и отладки.
---


# События трассировки {#trace-events}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

**Исходный код:** [lib/trace_events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/trace_events.js)

Модуль `node:trace_events` предоставляет механизм для централизации информации трассировки, генерируемой V8, ядром Node.js и кодом пользовательского пространства.

Трассировка может быть включена с помощью флага командной строки `--trace-event-categories` или с помощью модуля `node:trace_events`. Флаг `--trace-event-categories` принимает список имен категорий, разделенных запятыми.

Доступные категории:

- `node`: Пустой заполнитель.
- `node.async_hooks`: Включает захват подробных данных трассировки [`async_hooks`](/ru/nodejs/api/async_hooks). События [`async_hooks`](/ru/nodejs/api/async_hooks) имеют уникальный `asyncId` и специальное свойство `triggerId` `triggerAsyncId`.
- `node.bootstrap`: Включает захват этапов загрузки Node.js.
- `node.console`: Включает захват вывода `console.time()` и `console.count()`.
- `node.threadpoolwork.sync`: Включает захват данных трассировки для синхронных операций пула потоков, таких как `blob`, `zlib`, `crypto` и `node_api`.
- `node.threadpoolwork.async`: Включает захват данных трассировки для асинхронных операций пула потоков, таких как `blob`, `zlib`, `crypto` и `node_api`.
- `node.dns.native`: Включает захват данных трассировки для DNS-запросов.
- `node.net.native`: Включает захват данных трассировки для сети.
- `node.environment`: Включает захват этапов окружения Node.js.
- `node.fs.sync`: Включает захват данных трассировки для синхронных методов файловой системы.
- `node.fs_dir.sync`: Включает захват данных трассировки для синхронных методов работы с директориями файловой системы.
- `node.fs.async`: Включает захват данных трассировки для асинхронных методов файловой системы.
- `node.fs_dir.async`: Включает захват данных трассировки для асинхронных методов работы с директориями файловой системы.
- `node.perf`: Включает захват измерений [Performance API](/ru/nodejs/api/perf_hooks).
    - `node.perf.usertiming`: Включает захват только измерений и меток User Timing Performance API.
    - `node.perf.timerify`: Включает захват только измерений timerify Performance API.

- `node.promises.rejections`: Включает захват данных трассировки, отслеживающих количество необработанных отклонений Promise и обработанных после отклонений.
- `node.vm.script`: Включает захват данных трассировки для методов `runInNewContext()`, `runInContext()` и `runInThisContext()` модуля `node:vm`.
- `v8`: События [V8](/ru/nodejs/api/v8) связаны со сборкой мусора, компиляцией и выполнением.
- `node.http`: Включает захват данных трассировки для HTTP-запросов/ответов.
- `node.module_timer`: Включает захват данных трассировки для загрузки модулей CJS.

По умолчанию включены категории `node`, `node.async_hooks` и `v8`.

```bash [BASH]
node --trace-event-categories v8,node,node.async_hooks server.js
```
Предыдущие версии Node.js требовали использования флага `--trace-events-enabled` для включения событий трассировки. Это требование было удалено. Однако флаг `--trace-events-enabled` *все еще может* использоваться и по умолчанию включает категории событий трассировки `node`, `node.async_hooks` и `v8`.

```bash [BASH]
node --trace-events-enabled

# эквивалентно {#is-equivalent-to}

node --trace-event-categories v8,node,node.async_hooks
```
В качестве альтернативы, события трассировки могут быть включены с использованием модуля `node:trace_events`:

```js [ESM]
const trace_events = require('node:trace_events');
const tracing = trace_events.createTracing({ categories: ['node.perf'] });
tracing.enable();  // Включить захват событий трассировки для категории 'node.perf'

// выполнить работу

tracing.disable();  // Отключить захват событий трассировки для категории 'node.perf'
```
Запуск Node.js с включенной трассировкой приведет к созданию файлов журналов, которые можно открыть на вкладке [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) в Chrome.

Файл журнала по умолчанию называется `node_trace.${rotation}.log`, где `${rotation}` - это увеличивающийся идентификатор ротации журнала. Шаблон пути к файлу можно указать с помощью `--trace-event-file-pattern`, который принимает строку шаблона, поддерживающую `${rotation}` и `${pid}`:

```bash [BASH]
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```
Чтобы гарантировать правильную генерацию файла журнала после событий сигнала, таких как `SIGINT`, `SIGTERM` или `SIGBREAK`, убедитесь, что в вашем коде есть соответствующие обработчики, например:

```js [ESM]
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // Или соответствующий код выхода в зависимости от ОС и сигнала
});
```
Система трассировки использует тот же источник времени, что и `process.hrtime()`. Однако временные метки событий трассировки выражаются в микросекундах, в отличие от `process.hrtime()`, который возвращает наносекунды.

Функции этого модуля недоступны в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).


## Модуль `node:trace_events` {#the-nodetrace_events-module}

**Добавлено в версии: v10.0.0**

### Объект `Tracing` {#tracing-object}

**Добавлено в версии: v10.0.0**

Объект `Tracing` используется для включения или отключения трассировки для наборов категорий. Экземпляры создаются с помощью метода `trace_events.createTracing()`.

При создании объект `Tracing` отключен. Вызов метода `tracing.enable()` добавляет категории в набор включенных категорий событий трассировки. Вызов `tracing.disable()` удалит категории из набора включенных категорий событий трассировки.

#### `tracing.categories` {#tracingcategories}

**Добавлено в версии: v10.0.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Список категорий событий трассировки, охватываемых этим объектом `Tracing`, разделенный запятыми.

#### `tracing.disable()` {#tracingdisable}

**Добавлено в версии: v10.0.0**

Отключает этот объект `Tracing`.

Будут отключены только те категории событий трассировки, которые *не* охвачены другими включенными объектами `Tracing` и *не* указаны флагом `--trace-event-categories`.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node', 'v8'] });
const t2 = trace_events.createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// Выводит 'node,node.perf,v8'
console.log(trace_events.getEnabledCategories());

t2.disable(); // Отключит только генерацию событий категории 'node.perf'

// Выводит 'node,v8'
console.log(trace_events.getEnabledCategories());
```
#### `tracing.enable()` {#tracingenable}

**Добавлено в версии: v10.0.0**

Включает этот объект `Tracing` для набора категорий, охватываемых объектом `Tracing`.

#### `tracing.enabled` {#tracingenabled}

**Добавлено в версии: v10.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` только если объект `Tracing` был включен.

### `trace_events.createTracing(options)` {#trace_eventscreatetracingoptions}

**Добавлено в версии: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `categories` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Массив названий категорий трассировки. Значения, включенные в массив, преобразуются в строку, если это возможно. Если значение не может быть преобразовано, будет выброшена ошибка.


- Возвращает: [\<Tracing\>](/ru/nodejs/api/tracing#tracing-object).

Создает и возвращает объект `Tracing` для заданного набора `categories`.

```js [ESM]
const trace_events = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = trace_events.createTracing({ categories });
tracing.enable();
// делаем что-то
tracing.disable();
```

### `trace_events.getEnabledCategories()` {#trace_eventsgetenabledcategories}

**Добавлено в: v10.0.0**

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает разделенный запятыми список всех включенных в данный момент категорий событий трассировки. Текущий набор включенных категорий событий трассировки определяется *объединением* всех включенных в данный момент объектов `Tracing` и любых категорий, включенных с помощью флага `--trace-event-categories`.

Учитывая файл `test.js` ниже, команда `node --trace-event-categories node.perf test.js` выведет в консоль `'node.async_hooks,node.perf'`.

```js [ESM]
const trace_events = require('node:trace_events');
const t1 = trace_events.createTracing({ categories: ['node.async_hooks'] });
const t2 = trace_events.createTracing({ categories: ['node.perf'] });
const t3 = trace_events.createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(trace_events.getEnabledCategories());
```
## Примеры {#examples}

### Сбор данных событий трассировки с помощью инспектора {#collect-trace-events-data-by-inspector}

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
