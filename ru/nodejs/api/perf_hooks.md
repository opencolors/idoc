---
title: Документация Node.js - Хуки производительности
description: Изучите API хуков производительности в Node.js, который предоставляет доступ к метрикам производительности и инструментам для измерения производительности приложений Node.js.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Хуки производительности | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Изучите API хуков производительности в Node.js, который предоставляет доступ к метрикам производительности и инструментам для измерения производительности приложений Node.js.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Хуки производительности | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Изучите API хуков производительности в Node.js, который предоставляет доступ к метрикам производительности и инструментам для измерения производительности приложений Node.js.
---


# API для измерения производительности {#performance-measurement-apis}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/perf_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/perf_hooks.js)

Этот модуль предоставляет реализацию подмножества W3C [Web Performance APIs](https://w3c.github.io/perf-timing-primer/), а также дополнительные API для измерений производительности, специфичных для Node.js.

Node.js поддерживает следующие [Web Performance APIs](https://w3c.github.io/perf-timing-primer/):

- [High Resolution Time](https://www.w3.org/TR/hr-time-2)
- [Performance Timeline](https://w3c.github.io/performance-timeline/)
- [User Timing](https://www.w3.org/TR/user-timing/)
- [Resource Timing](https://www.w3.org/TR/resource-timing-2/)



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

**Добавлено в: v8.5.0**

Объект, который может быть использован для сбора метрик производительности из текущего экземпляра Node.js. Он похож на [`window.performance`](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) в браузерах.


### `performance.clearMarks([name])` {#performanceclearmarksname}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Если `name` не указано, удаляет все объекты `PerformanceMark` из Timeline производительности. Если `name` указано, удаляет только указанную метку.

### `performance.clearMeasures([name])` {#performanceclearmeasuresname}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v16.7.0 | Добавлено в: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Если `name` не указано, удаляет все объекты `PerformanceMeasure` из Timeline производительности. Если `name` указано, удаляет только указанное измерение.

### `performance.clearResourceTimings([name])` {#performanceclearresourcetimingsname}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Если `name` не указано, удаляет все объекты `PerformanceResourceTiming` из Timeline ресурсов. Если `name` указано, удаляет только указанный ресурс.

### `performance.eventLoopUtilization([utilization1[, utilization2]])` {#performanceeventlooputilizationutilization1-utilization2}

**Добавлено в: v14.10.0, v12.19.0**

- `utilization1` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Результат предыдущего вызова `eventLoopUtilization()`.
- `utilization2` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Результат предыдущего вызова `eventLoopUtilization()` до `utilization1`.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `active` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метод `eventLoopUtilization()` возвращает объект, содержащий совокупную продолжительность времени, в течение которого цикл событий был как в состоянии простоя, так и активным, в виде таймера высокого разрешения в миллисекундах. Значение `utilization` является вычисленным использованием цикла событий (ELU).

Если начальная загрузка еще не завершена в основном потоке, свойства имеют значение `0`. ELU немедленно доступен в [Worker threads](/ru/nodejs/api/worker_threads#worker-threads), поскольку начальная загрузка происходит внутри цикла событий.

Оба параметра `utilization1` и `utilization2` являются необязательными.

Если передан параметр `utilization1`, то вычисляется и возвращается дельта между `active` и `idle` временами текущего вызова, а также соответствующее значение `utilization` (аналогично [`process.hrtime()`](/ru/nodejs/api/process#processhrtimetime)).

Если переданы оба параметра `utilization1` и `utilization2`, то дельта вычисляется между двумя аргументами. Это удобная опция, поскольку, в отличие от [`process.hrtime()`](/ru/nodejs/api/process#processhrtimetime), вычисление ELU более сложное, чем простое вычитание.

ELU аналогичен использованию ЦП, за исключением того, что он измеряет только статистику цикла событий, а не использование ЦП. Он представляет собой процент времени, в течение которого цикл событий провел вне провайдера событий цикла событий (например, `epoll_wait`). Никакое другое время простоя ЦП не принимается во внимание. Ниже приведен пример того, как в основном простаивающий процесс будет иметь высокий ELU.

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
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
:::

Хотя ЦП в основном простаивает во время выполнения этого скрипта, значение `utilization` равно `1`. Это связано с тем, что вызов [`child_process.spawnSync()`](/ru/nodejs/api/child_process#child_processspawnsynccommand-args-options) блокирует цикл событий от продолжения.

Передача пользовательского объекта вместо результата предыдущего вызова `eventLoopUtilization()` приведет к неопределенному поведению. Не гарантируется, что возвращаемые значения будут отражать какое-либо правильное состояние цикла событий.


### `performance.getEntries()` {#performancegetentries}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v16.7.0 | Добавлено в версии: v16.7.0 |
:::

- Возвращает: [\<PerformanceEntry[]\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Возвращает список объектов `PerformanceEntry` в хронологическом порядке относительно `performanceEntry.startTime`. Если вас интересуют только записи производительности определенных типов или с определенными именами, см. `performance.getEntriesByType()` и `performance.getEntriesByName()`.

### `performance.getEntriesByName(name[, type])` {#performancegetentriesbynamename-type}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v16.7.0 | Добавлено в версии: v16.7.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<PerformanceEntry[]\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Возвращает список объектов `PerformanceEntry` в хронологическом порядке относительно `performanceEntry.startTime`, у которых `performanceEntry.name` равен `name`, и, при необходимости, у которых `performanceEntry.entryType` равен `type`.

### `performance.getEntriesByType(type)` {#performancegetentriesbytypetype}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v16.7.0 | Добавлено в версии: v16.7.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<PerformanceEntry[]\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Возвращает список объектов `PerformanceEntry` в хронологическом порядке относительно `performanceEntry.startTime`, у которых `performanceEntry.entryType` равен `type`.

### `performance.mark(name[, options])` {#performancemarkname-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. Аргумент name больше не является необязательным. |
| v16.0.0 | Обновлено в соответствии со спецификацией User Timing Level 3. |
| v8.5.0 | Добавлено в версии: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Дополнительная необязательная информация, включаемая в отметку.
    - `startTime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательная временная метка, используемая в качестве времени отметки. **По умолчанию**: `performance.now()`.

Создает новую запись `PerformanceMark` в Performance Timeline. `PerformanceMark` является подклассом `PerformanceEntry`, у которого `performanceEntry.entryType` всегда равно `'mark'`, а `performanceEntry.duration` всегда равно `0`. Отметки производительности используются для обозначения определенных важных моментов в Performance Timeline.

Созданная запись `PerformanceMark` помещается в глобальную Performance Timeline и может быть запрошена с помощью `performance.getEntries`, `performance.getEntriesByName` и `performance.getEntriesByType`. При выполнении наблюдения записи должны быть удалены из глобальной Performance Timeline вручную с помощью `performance.clearMarks`.


### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])` {#performancemarkresourcetimingtiminginfo-requestedurl-initiatortype-global-cachemode-bodyinfo-responsestatus-deliverytype}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.2.0 | Добавлены аргументы bodyInfo, responseStatus и deliveryType. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- `timingInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Информация о времени получения](https://fetch.spec.whatwg.org/#fetch-timing-info)
- `requestedUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL ресурса
- `initiatorType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя инициатора, например: 'fetch'
- `global` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `cacheMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Режим кэширования должен быть пустой строкой ('') или 'local'
- `bodyInfo` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Информация о теле ответа Fetch](https://fetch.spec.whatwg.org/#response-body-info)
- `responseStatus` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код состояния ответа
- `deliveryType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип доставки. **По умолчанию:** `''`.

*Это свойство является расширением Node.js. Оно недоступно в веб-браузерах.*

Создает новую запись `PerformanceResourceTiming` в временной шкале ресурсов. `PerformanceResourceTiming` является подклассом `PerformanceEntry`, у которого `performanceEntry.entryType` всегда `'resource'`. Ресурсы производительности используются для отметки моментов во временной шкале ресурсов.

Созданная запись `PerformanceMark` помещается в глобальную временную шкалу ресурсов и может быть запрошена с помощью `performance.getEntries`, `performance.getEntriesByName` и `performance.getEntriesByType`. Когда наблюдение выполнено, записи должны быть очищены из глобальной временной шкалы производительности вручную с помощью `performance.clearResourceTimings`.


### `performance.measure(name[, startMarkOrOptions[, endMark]])` {#performancemeasurename-startmarkoroptions-endmark}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v16.0.0 | Обновлено в соответствии со спецификацией User Timing Level 3. |
| v13.13.0, v12.16.3 | Сделать параметры `startMark` и `endMark` необязательными. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `startMarkOrOptions` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный.
    - `detail` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Дополнительная необязательная информация, включаемая в измерение.
    - `duration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Продолжительность между временем начала и окончания.
    - `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Временная метка, используемая в качестве времени окончания, или строка, идентифицирующая ранее записанную метку.
    - `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Временная метка, используемая в качестве времени начала, или строка, идентифицирующая ранее записанную метку.

- `endMark` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательный. Должен быть опущен, если `startMarkOrOptions` является [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object).

Создает новую запись `PerformanceMeasure` в Performance Timeline. `PerformanceMeasure` является подклассом `PerformanceEntry`, у которого `performanceEntry.entryType` всегда `'measure'`, а `performanceEntry.duration` измеряет количество миллисекунд, прошедших между `startMark` и `endMark`.

Аргумент `startMark` может идентифицировать любую *существующую* `PerformanceMark` в Performance Timeline, или *может* идентифицировать любое из свойств временной метки, предоставляемых классом `PerformanceNodeTiming`. Если именованная `startMark` не существует, возникает ошибка.

Необязательный аргумент `endMark` должен идентифицировать любую *существующую* `PerformanceMark` в Performance Timeline или любое из свойств временной метки, предоставляемых классом `PerformanceNodeTiming`. `endMark` будет `performance.now()`, если параметр не передан, в противном случае, если именованная `endMark` не существует, будет выдана ошибка.

Созданная запись `PerformanceMeasure` помещается в глобальную Performance Timeline и может быть запрошена с помощью `performance.getEntries`, `performance.getEntriesByName` и `performance.getEntriesByType`. Когда наблюдение выполнено, записи должны быть удалены из глобальной Performance Timeline вручную с помощью `performance.clearMeasures`.


### `performance.nodeTiming` {#performancenodetiming}

**Добавлено в: v8.5.0**

- [\<PerformanceNodeTiming\>](/ru/nodejs/api/perf_hooks#class-performancenodetiming)

*Это свойство является расширением Node.js. Оно недоступно в веб-браузерах.*

Экземпляр класса `PerformanceNodeTiming`, который предоставляет метрики производительности для конкретных операционных этапов Node.js.

### `performance.now()` {#performancenow}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает текущую метку времени в миллисекундах с высоким разрешением, где 0 представляет начало текущего процесса `node`.

### `performance.setResourceTimingBufferSize(maxSize)` {#performancesetresourcetimingbuffersizemaxsize}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v18.8.0 | Добавлено в: v18.8.0 |
:::

Устанавливает глобальный размер буфера времени ресурсов производительности на указанное количество объектов записи производительности типа "ресурс".

По умолчанию максимальный размер буфера установлен на 250.

### `performance.timeOrigin` {#performancetimeorigin}

**Добавлено в: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

[`timeOrigin`](https://w3c.github.io/hr-time/#dom-performance-timeorigin) указывает метку времени в миллисекундах с высоким разрешением, когда начался текущий процесс `node`, измеренную в Unix time.

### `performance.timerify(fn[, options])` {#performancetimerifyfn-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Добавлена опция histogram. |
| v16.0.0 | Перереализовано с использованием чистого JavaScript и возможностью отслеживать время асинхронных функций. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `histogram` [\<RecordableHistogram\>](/ru/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram) Объект гистограммы, созданный с помощью `perf_hooks.createHistogram()`, который будет записывать продолжительность выполнения в наносекундах.
  
 

*Это свойство является расширением Node.js. Оно недоступно в веб-браузерах.*

Оборачивает функцию в новую функцию, которая измеряет время выполнения обернутой функции. `PerformanceObserver` должен быть подписан на тип события `'function'`, чтобы можно было получить доступ к деталям времени.



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

Если обернутая функция возвращает промис, к промису будет прикреплен обработчик finally, и продолжительность будет сообщена после вызова обработчика finally.


### `performance.toJSON()` {#performancetojson}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `performance` в качестве получателя. |
| v16.1.0 | Добавлено в: v16.1.0 |
:::

Объект, являющийся JSON-представлением объекта `performance`. Он похож на [`window.performance.toJSON`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON) в браузерах.

#### Событие: `'resourcetimingbufferfull'` {#event-resourcetimingbufferfull}

**Добавлено в: v18.8.0**

Событие `'resourcetimingbufferfull'` возникает, когда глобальный буфер времени ресурсов производительности заполнен. Отрегулируйте размер буфера времени ресурсов с помощью `performance.setResourceTimingBufferSize()` или очистите буфер с помощью `performance.clearResourceTimings()` в обработчике событий, чтобы разрешить добавление дополнительных записей в буфер временной шкалы производительности.

## Класс: `PerformanceEntry` {#class-performanceentry}

**Добавлено в: v8.5.0**

Конструктор этого класса напрямую недоступен пользователям.

### `performanceEntry.duration` {#performanceentryduration}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceEntry` в качестве получателя. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Общее количество миллисекунд, прошедших для этой записи. Это значение не будет значимым для всех типов записей производительности.

### `performanceEntry.entryType` {#performanceentryentrytype}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceEntry` в качестве получателя. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Тип записи производительности. Он может быть одним из:

- `'dns'` (только Node.js)
- `'function'` (только Node.js)
- `'gc'` (только Node.js)
- `'http2'` (только Node.js)
- `'http'` (только Node.js)
- `'mark'` (доступно в Web)
- `'measure'` (доступно в Web)
- `'net'` (только Node.js)
- `'node'` (только Node.js)
- `'resource'` (доступно в Web)


### `performanceEntry.name` {#performanceentryname}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceEntry` в качестве получателя. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Имя записи производительности.

### `performanceEntry.startTime` {#performanceentrystarttime}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceEntry` в качестве получателя. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метка времени в миллисекундах высокого разрешения, отмечающая время начала записи производительности.

## Класс: `PerformanceMark` {#class-performancemark}

**Добавлено в: v18.2.0, v16.17.0**

- Расширяет: [\<PerformanceEntry\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Предоставляет доступ к меткам, созданным с помощью метода `Performance.mark()`.

### `performanceMark.detail` {#performancemarkdetail}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceMark` в качестве получателя. |
| v16.0.0 | Добавлено в: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Дополнительные детали, указанные при создании с помощью метода `Performance.mark()`.

## Класс: `PerformanceMeasure` {#class-performancemeasure}

**Добавлено в: v18.2.0, v16.17.0**

- Расширяет: [\<PerformanceEntry\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Предоставляет доступ к измерениям, созданным с помощью метода `Performance.measure()`.

Конструктор этого класса напрямую не предоставляется пользователям.

### `performanceMeasure.detail` {#performancemeasuredetail}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceMeasure` в качестве получателя. |
| v16.0.0 | Добавлено в: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Дополнительные детали, указанные при создании с помощью метода `Performance.measure()`.


## Класс: `PerformanceNodeEntry` {#class-performancenodeentry}

**Добавлено в: v19.0.0**

- Наследует: [\<PerformanceEntry\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

*Этот класс является расширением Node.js. Он недоступен в веб-браузерах.*

Предоставляет подробные данные о времени выполнения Node.js.

Конструктор этого класса не предоставляется пользователям напрямую.

### `performanceNodeEntry.detail` {#performancenodeentrydetail}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceNodeEntry` в качестве получателя. |
| v16.0.0 | Добавлено в: v16.0.0 |
:::

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Дополнительные детали, специфичные для `entryType`.

### `performanceNodeEntry.flags` {#performancenodeentryflags}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Устарело во время выполнения. Теперь перемещено в свойство detail, когда entryType имеет значение 'gc'. |
| v13.9.0, v12.17.0 | Добавлено в: v13.9.0, v12.17.0 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: используйте `performanceNodeEntry.detail` вместо этого.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Когда `performanceEntry.entryType` равно `'gc'`, свойство `performance.flags` содержит дополнительную информацию об операции сборки мусора. Значение может быть одним из:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind` {#performancenodeentrykind}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Устарело во время выполнения. Теперь перемещено в свойство detail, когда entryType имеет значение 'gc'. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: используйте `performanceNodeEntry.detail` вместо этого.
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Когда `performanceEntry.entryType` равно `'gc'`, свойство `performance.kind` идентифицирует тип операции сборки мусора, которая произошла. Значение может быть одним из:

- `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
- `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`


### Детали сборки мусора ('gc') {#garbage-collection-gc-details}

Когда `performanceEntry.type` равно `'gc'`, свойство `performanceNodeEntry.detail` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) с двумя свойствами:

- `kind` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Одно из:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
  
 
- `flags` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Одно из:
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
    - `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`
  
 

### Детали HTTP ('http') {#http-http-details}

Когда `performanceEntry.type` равно `'http'`, свойство `performanceNodeEntry.detail` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащим дополнительную информацию.

Если `performanceEntry.name` равно `HttpClient`, `detail` будет содержать следующие свойства: `req`, `res`. А свойство `req` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащим `method`, `url`, `headers`, а свойство `res` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащим `statusCode`, `statusMessage`, `headers`.

Если `performanceEntry.name` равно `HttpRequest`, `detail` будет содержать следующие свойства: `req`, `res`. А свойство `req` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащим `method`, `url`, `headers`, а свойство `res` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащим `statusCode`, `statusMessage`, `headers`.

Это может добавить дополнительные накладные расходы на память и должно использоваться только в диагностических целях, а не оставаться включенным в рабочей среде по умолчанию.


### Подробности HTTP/2 ('http2') {#http/2-http2-details}

Когда `performanceEntry.type` равен `'http2'`, свойство `performanceNodeEntry.detail` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащим дополнительную информацию о производительности.

Если `performanceEntry.name` равен `Http2Stream`, `detail` будет содержать следующие свойства:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов фрейма `DATA`, полученных для этого `Http2Stream`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов фрейма `DATA`, отправленных для этого `Http2Stream`.
- `id` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор связанного `Http2Stream`.
- `timeToFirstByte` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, прошедшее между `startTime` `PerformanceEntry` и получением первого фрейма `DATA`.
- `timeToFirstByteSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, прошедшее между `startTime` `PerformanceEntry` и отправкой первого фрейма `DATA`.
- `timeToFirstHeader` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, прошедшее между `startTime` `PerformanceEntry` и получением первого заголовка.

Если `performanceEntry.name` равен `Http2Session`, `detail` будет содержать следующие свойства:

- `bytesRead` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, полученных для этого `Http2Session`.
- `bytesWritten` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, отправленных для этого `Http2Session`.
- `framesReceived` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество фреймов HTTP/2, полученных `Http2Session`.
- `framesSent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество фреймов HTTP/2, отправленных `Http2Session`.
- `maxConcurrentStreams` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество одновременно открытых потоков в течение времени существования `Http2Session`.
- `pingRTT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, прошедшее с момента отправки фрейма `PING` и получения подтверждения. Присутствует только в том случае, если фрейм `PING` был отправлен в `Http2Session`.
- `streamAverageDuration` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Средняя продолжительность (в миллисекундах) для всех экземпляров `Http2Stream`.
- `streamCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество экземпляров `Http2Stream`, обработанных `Http2Session`.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Либо `'server'`, либо `'client'` для идентификации типа `Http2Session`.


### Timerify ('function') Details {#timerify-function-details}

Когда `performanceEntry.type` равен `'function'`, свойство `performanceNodeEntry.detail` будет [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), содержащим список входных аргументов синхронизируемой функции.

### Net ('net') Details {#net-net-details}

Когда `performanceEntry.type` равен `'net'`, свойство `performanceNodeEntry.detail` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащим дополнительную информацию.

Если `performanceEntry.name` равен `connect`, свойство `detail` будет содержать следующие свойства: `host`, `port`.

### DNS ('dns') Details {#dns-dns-details}

Когда `performanceEntry.type` равен `'dns'`, свойство `performanceNodeEntry.detail` будет [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащим дополнительную информацию.

Если `performanceEntry.name` равен `lookup`, свойство `detail` будет содержать следующие свойства: `hostname`, `family`, `hints`, `verbatim`, `addresses`.

Если `performanceEntry.name` равен `lookupService`, свойство `detail` будет содержать следующие свойства: `host`, `port`, `hostname`, `service`.

Если `performanceEntry.name` равен `queryxxx` или `getHostByAddr`, свойство `detail` будет содержать следующие свойства: `host`, `ttl`, `result`. Значение `result` совпадает с результатом `queryxxx` или `getHostByAddr`.

## Class: `PerformanceNodeTiming` {#class-performancenodetiming}

**Added in: v8.5.0**

- Extends: [\<PerformanceEntry\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

*Это свойство является расширением Node.js. Оно недоступно в веб-браузерах.*

Предоставляет детали синхронизации для самого Node.js. Конструктор этого класса недоступен для пользователей.

### `performanceNodeTiming.bootstrapComplete` {#performancenodetimingbootstrapcomplete}

**Added in: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метка времени в миллисекундах с высоким разрешением, в момент завершения процесса начальной загрузки Node.js. Если начальная загрузка еще не завершена, свойство имеет значение -1.


### `performanceNodeTiming.environment` {#performancenodetimingenvironment}

**Добавлено в версии: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение времени в миллисекундах, когда была инициализирована среда Node.js.

### `performanceNodeTiming.idleTime` {#performancenodetimingidletime}

**Добавлено в версии: v14.10.0, v12.19.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение времени в миллисекундах, показывающее, сколько времени цикл событий простаивал в поставщике событий цикла событий (например, `epoll_wait`). Это не учитывает использование ЦП. Если цикл событий еще не начался (например, в первом тике основного скрипта), свойство имеет значение 0.

### `performanceNodeTiming.loopExit` {#performancenodetimingloopexit}

**Добавлено в версии: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение времени в миллисекундах, когда цикл событий Node.js завершился. Если цикл событий еще не завершился, свойство имеет значение -1. Оно может иметь значение, отличное от -1, только в обработчике события [`'exit'`](/ru/nodejs/api/process#event-exit).

### `performanceNodeTiming.loopStart` {#performancenodetimingloopstart}

**Добавлено в версии: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение времени в миллисекундах, когда цикл событий Node.js начался. Если цикл событий еще не начался (например, в первом тике основного скрипта), свойство имеет значение -1.

### `performanceNodeTiming.nodeStart` {#performancenodetimingnodestart}

**Добавлено в версии: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение времени в миллисекундах, когда был инициализирован процесс Node.js.

### `performanceNodeTiming.uvMetricsInfo` {#performancenodetiminguvmetricsinfo}

**Добавлено в версии: v22.8.0, v20.18.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `loopCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество итераций цикла событий.
    - `events` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество событий, обработанных обработчиком событий.
    - `eventsWaiting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество событий, ожидающих обработки, когда был вызван поставщик событий.
  
 

Это обертка для функции `uv_metrics_info`. Она возвращает текущий набор метрик цикла событий.

Рекомендуется использовать это свойство внутри функции, выполнение которой было запланировано с помощью `setImmediate`, чтобы избежать сбора метрик до завершения всех операций, запланированных во время текущей итерации цикла.



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

**Добавлено в версии: v8.5.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение метки времени в миллисекундах, когда была инициализирована платформа V8.

## Класс: `PerformanceResourceTiming` {#class-performanceresourcetiming}

**Добавлено в версии: v18.2.0, v16.17.0**

- Наследует: [\<PerformanceEntry\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Предоставляет подробные данные о времени сетевых операций, касающихся загрузки ресурсов приложения.

Конструктор этого класса напрямую недоступен для пользователей.

### `performanceResourceTiming.workerStart` {#performanceresourcetimingworkerstart}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод получения свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в версии: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение метки времени в миллисекундах непосредственно перед отправкой запроса `fetch`. Если ресурс не перехватывается воркером, свойство всегда будет возвращать 0.

### `performanceResourceTiming.redirectStart` {#performanceresourcetimingredirectstart}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод получения свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в версии: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение метки времени в миллисекундах, представляющее время начала выборки (fetch), которая инициирует перенаправление.

### `performanceResourceTiming.redirectEnd` {#performanceresourcetimingredirectend}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод получения свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в версии: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное значение метки времени в миллисекундах, которое будет создано сразу после получения последнего байта ответа последнего перенаправления.


### `performanceResourceTiming.fetchStart` {#performanceresourcetimingfetchstart}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное представление времени в миллисекундах непосредственно перед тем, как Node.js начинает выборку ресурса.

### `performanceResourceTiming.domainLookupStart` {#performanceresourcetimingdomainlookupstart}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное представление времени в миллисекундах непосредственно перед тем, как Node.js начинает поиск доменного имени для ресурса.

### `performanceResourceTiming.domainLookupEnd` {#performanceresourcetimingdomainlookupend}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное представление времени в миллисекундах, представляющее время сразу после того, как Node.js завершил поиск доменного имени для ресурса.

### `performanceResourceTiming.connectStart` {#performanceresourcetimingconnectstart}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное представление времени в миллисекундах, представляющее время непосредственно перед тем, как Node.js начинает устанавливать соединение с сервером для получения ресурса.


### `performanceResourceTiming.connectEnd` {#performanceresourcetimingconnectend}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное представление временной метки в миллисекундах, представляющее время сразу после того, как Node.js завершает установление соединения с сервером для получения ресурса.

### `performanceResourceTiming.secureConnectionStart` {#performanceresourcetimingsecureconnectionstart}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное представление временной метки в миллисекундах, представляющее время непосредственно перед тем, как Node.js начинает процесс подтверждения для защиты текущего соединения.

### `performanceResourceTiming.requestStart` {#performanceresourcetimingrequeststart}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное представление временной метки в миллисекундах, представляющее время непосредственно перед тем, как Node.js получает первый байт ответа от сервера.

### `performanceResourceTiming.responseEnd` {#performanceresourcetimingresponseend}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот геттер свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Высокоточное представление временной метки в миллисекундах, представляющее время сразу после того, как Node.js получает последний байт ресурса или непосредственно перед закрытием транспортного соединения, в зависимости от того, что произойдет раньше.


### `performanceResourceTiming.transferSize` {#performanceresourcetimingtransfersize}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Геттер этого свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Число, представляющее размер (в октетах) полученного ресурса. Размер включает поля заголовка ответа плюс тело полезной нагрузки ответа.

### `performanceResourceTiming.encodedBodySize` {#performanceresourcetimingencodedbodysize}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Геттер этого свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Число, представляющее размер (в октетах), полученный при выборке (HTTP или кеш), тела полезной нагрузки, до удаления каких-либо примененных кодировок содержимого.

### `performanceResourceTiming.decodedBodySize` {#performanceresourcetimingdecodedbodysize}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Геттер этого свойства должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Число, представляющее размер (в октетах), полученный при выборке (HTTP или кеш), тела сообщения, после удаления каких-либо примененных кодировок содержимого.

### `performanceResourceTiming.toJSON()` {#performanceresourcetimingtojson}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Этот метод должен вызываться с объектом `PerformanceResourceTiming` в качестве получателя. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

Возвращает `object`, который является JSON-представлением объекта `PerformanceResourceTiming`.

## Класс: `PerformanceObserver` {#class-performanceobserver}

**Добавлено в: v8.5.0**

### `PerformanceObserver.supportedEntryTypes` {#performanceobserversupportedentrytypes}

**Добавлено в: v16.0.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получить поддерживаемые типы.


### `new PerformanceObserver(callback)` {#new-performanceobservercallback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `list` [\<PerformanceObserverEntryList\>](/ru/nodejs/api/perf_hooks#class-performanceobserverentrylist)
    - `observer` [\<PerformanceObserver\>](/ru/nodejs/api/perf_hooks#class-performanceobserver)
  
 

Объекты `PerformanceObserver` предоставляют уведомления при добавлении новых экземпляров `PerformanceEntry` в Performance Timeline.



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

Поскольку экземпляры `PerformanceObserver` создают свои собственные дополнительные накладные расходы на производительность, экземпляры не следует оставлять подписанными на уведомления на неопределенный срок. Пользователи должны отключать наблюдатели, как только они больше не нужны.

`callback` вызывается, когда `PerformanceObserver` получает уведомление о новых экземплярах `PerformanceEntry`. Обратный вызов получает экземпляр `PerformanceObserverEntryList` и ссылку на `PerformanceObserver`.

### `performanceObserver.disconnect()` {#performanceobserverdisconnect}

**Добавлено в: v8.5.0**

Отключает экземпляр `PerformanceObserver` от всех уведомлений.


### `performanceObserver.observe(options)` {#performanceobserverobserveoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.7.0 | Обновлено в соответствии с Performance Timeline Level 2. Опция `buffered` была добавлена обратно. |
| v16.0.0 | Обновлено в соответствии с User Timing Level 3. Опция `buffered` была удалена. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Один тип [\<PerformanceEntry\>](/ru/nodejs/api/perf_hooks#class-performanceentry). Не должен быть указан, если `entryTypes` уже задан.
    - `entryTypes` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Массив строк, определяющих типы экземпляров [\<PerformanceEntry\>](/ru/nodejs/api/perf_hooks#class-performanceentry), которые интересуют наблюдателя. Если не указан, будет выдана ошибка.
    - `buffered` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если true, обратный вызов наблюдателя вызывается со списком глобальных `PerformanceEntry`, буферизованных записей. Если false, только `PerformanceEntry`, созданные после указанного момента времени, отправляются в обратный вызов наблюдателя. **По умолчанию:** `false`.


Подписывает экземпляр [\<PerformanceObserver\>](/ru/nodejs/api/perf_hooks#class-performanceobserver) на уведомления о новых экземплярах [\<PerformanceEntry\>](/ru/nodejs/api/perf_hooks#class-performanceentry), идентифицируемых либо `options.entryTypes`, либо `options.type`:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // Вызывается один раз асинхронно. `list` содержит три элемента.
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
  // Вызывается один раз асинхронно. `list` содержит три элемента.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```
:::


### `performanceObserver.takeRecords()` {#performanceobservertakerecords}

**Добавлено в версии: v16.0.0**

- Возвращает: [\<PerformanceEntry[]\>](/ru/nodejs/api/perf_hooks#class-performanceentry) Текущий список записей, хранящихся в наблюдателе производительности, очищая его.

## Класс: `PerformanceObserverEntryList` {#class-performanceobserverentrylist}

**Добавлено в версии: v8.5.0**

Класс `PerformanceObserverEntryList` используется для предоставления доступа к экземплярам `PerformanceEntry`, переданным в `PerformanceObserver`. Конструктор этого класса не предоставляется пользователям.

### `performanceObserverEntryList.getEntries()` {#performanceobserverentrylistgetentries}

**Добавлено в версии: v8.5.0**

- Возвращает: [\<PerformanceEntry[]\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Возвращает список объектов `PerformanceEntry` в хронологическом порядке относительно `performanceEntry.startTime`.



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

**Добавлено в: v8.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<PerformanceEntry[]\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Возвращает список объектов `PerformanceEntry` в хронологическом порядке относительно `performanceEntry.startTime`, чье свойство `performanceEntry.name` равно `name`, и, необязательно, чье свойство `performanceEntry.entryType` равно `type`.

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

**Добавлено в версии: v8.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<PerformanceEntry[]\>](/ru/nodejs/api/perf_hooks#class-performanceentry)

Возвращает список объектов `PerformanceEntry` в хронологическом порядке относительно `performanceEntry.startTime`, у которых `performanceEntry.entryType` равен `type`.

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

**Добавлено в версии: v15.9.0, v14.18.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `lowest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Наименьшее различимое значение. Должно быть целым числом больше 0. **По умолчанию:** `1`.
    - `highest` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Наибольшее записываемое значение. Должно быть целым числом, равным или превышающим двукратное значение `lowest`. **По умолчанию:** `Number.MAX_SAFE_INTEGER`.
    - `figures` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество значащих цифр. Должно быть числом от `1` до `5`. **По умолчанию:** `3`.
  
 
- Возвращает: [\<RecordableHistogram\>](/ru/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Возвращает [\<RecordableHistogram\>](/ru/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram).


## `perf_hooks.monitorEventLoopDelay([options])` {#perf_hooksmonitoreventloopdelayoptions}

**Добавлено в: v11.10.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `resolution` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Частота выборки в миллисекундах. Должна быть больше нуля. **По умолчанию:** `10`.
  
 
- Возвращает: [\<IntervalHistogram\>](/ru/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram)

*Это свойство является расширением Node.js. Оно недоступно в веб-браузерах.*

Создает объект `IntervalHistogram`, который отбирает и сообщает задержку цикла событий с течением времени. Задержки будут сообщаться в наносекундах.

Использование таймера для обнаружения приблизительной задержки цикла событий работает, потому что выполнение таймеров связано конкретно с жизненным циклом цикла событий libuv. То есть задержка в цикле вызовет задержку в выполнении таймера, и именно эти задержки предназначены для обнаружения этим API.

::: code-group
```js [ESM]
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Что-то сделать.
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
// Что-то сделать.
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

## Класс: `Histogram` {#class-histogram}

**Добавлено в: v11.10.0**

### `histogram.count` {#histogramcount}

**Добавлено в: v17.4.0, v16.14.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество выборок, записанных гистограммой.

### `histogram.countBigInt` {#histogramcountbigint}

**Добавлено в: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Количество выборок, записанных гистограммой.


### `histogram.exceeds` {#histogramexceeds}

**Добавлено в: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество случаев, когда задержка цикла событий превысила максимальный порог задержки цикла событий в 1 час.

### `histogram.exceedsBigInt` {#histogramexceedsbigint}

**Добавлено в: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Количество случаев, когда задержка цикла событий превысила максимальный порог задержки цикла событий в 1 час.

### `histogram.max` {#histogrammax}

**Добавлено в: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Максимальная зарегистрированная задержка цикла событий.

### `histogram.maxBigInt` {#histogrammaxbigint}

**Добавлено в: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Максимальная зарегистрированная задержка цикла событий.

### `histogram.mean` {#histogrammean}

**Добавлено в: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Среднее значение зарегистрированных задержек цикла событий.

### `histogram.min` {#histogrammin}

**Добавлено в: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Минимальная зарегистрированная задержка цикла событий.

### `histogram.minBigInt` {#histogramminbigint}

**Добавлено в: v17.4.0, v16.14.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Минимальная зарегистрированная задержка цикла событий.

### `histogram.percentile(percentile)` {#histogrampercentilepercentile}

**Добавлено в: v11.10.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение процентиля в диапазоне (0, 100].
- Returns: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает значение в данном процентиле.

### `histogram.percentileBigInt(percentile)` {#histogrampercentilebigintpercentile}

**Добавлено в: v17.4.0, v16.14.0**

- `percentile` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение процентиля в диапазоне (0, 100].
- Returns: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Возвращает значение в данном процентиле.


### `histogram.percentiles` {#histogrampercentiles}

**Добавлено в: v11.10.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Возвращает объект `Map`, детализирующий накопленное распределение перцентилей.

### `histogram.percentilesBigInt` {#histogrampercentilesbigint}

**Добавлено в: v17.4.0, v16.14.0**

- [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Возвращает объект `Map`, детализирующий накопленное распределение перцентилей.

### `histogram.reset()` {#histogramreset}

**Добавлено в: v11.10.0**

Сбрасывает собранные данные гистограммы.

### `histogram.stddev` {#histogramstddev}

**Добавлено в: v11.10.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Стандартное отклонение записанных задержек цикла событий.

## Class: `IntervalHistogram extends Histogram` {#class-intervalhistogram-extends-histogram}

`Histogram`, которая периодически обновляется через заданный интервал.

### `histogram.disable()` {#histogramdisable}

**Добавлено в: v11.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Отключает таймер интервала обновления. Возвращает `true`, если таймер был остановлен, `false`, если он уже был остановлен.

### `histogram.enable()` {#histogramenable}

**Добавлено в: v11.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Включает таймер интервала обновления. Возвращает `true`, если таймер был запущен, `false`, если он уже был запущен.

### Клонирование `IntervalHistogram` {#cloning-an-intervalhistogram}

Экземпляры [\<IntervalHistogram\>](/ru/nodejs/api/perf_hooks#class-intervalhistogram-extends-histogram) могут быть клонированы через [\<MessagePort\>](/ru/nodejs/api/worker_threads#class-messageport). На принимающей стороне гистограмма клонируется как простой объект [\<Histogram\>](/ru/nodejs/api/perf_hooks#class-histogram), который не реализует методы `enable()` и `disable()`.

## Class: `RecordableHistogram extends Histogram` {#class-recordablehistogram-extends-histogram}

**Добавлено в: v15.9.0, v14.18.0**

### `histogram.add(other)` {#histogramaddother}

**Добавлено в: v17.4.0, v16.14.0**

- `other` [\<RecordableHistogram\>](/ru/nodejs/api/perf_hooks#class-recordablehistogram-extends-histogram)

Добавляет значения из `other` в эту гистограмму.


### `histogram.record(val)` {#histogramrecordval}

**Добавлено в версии: v15.9.0, v14.18.0**

- `val` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Значение для записи в гистограмму.

### `histogram.recordDelta()` {#histogramrecorddelta}

**Добавлено в версии: v15.9.0, v14.18.0**

Вычисляет количество времени (в наносекундах), прошедшее с момента предыдущего вызова `recordDelta()`, и записывает это количество в гистограмму.

## Примеры {#examples}

### Измерение длительности асинхронных операций {#measuring-the-duration-of-async-operations}

В следующем примере используются [Async Hooks](/ru/nodejs/api/async_hooks) и Performance API для измерения фактической длительности операции Timeout (включая время, затраченное на выполнение обратного вызова).

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


### Измерение времени загрузки зависимостей {#measuring-how-long-it-takes-to-load-dependencies}

Следующий пример измеряет продолжительность операций `require()` для загрузки зависимостей:

::: code-group
```js [ESM]
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Активировать наблюдателя
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

// Перехватываем функцию require
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Активировать наблюдателя
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

### Измерение времени одного HTTP-цикла {#measuring-how-long-one-http-round-trip-takes}

Следующий пример используется для отслеживания времени, затраченного HTTP-клиентом (`OutgoingMessage`) и HTTP-запросом (`IncomingMessage`). Для HTTP-клиента это означает интервал времени между началом запроса и получением ответа, а для HTTP-запроса это означает интервал времени между получением запроса и отправкой ответа:

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


### Измерение времени, которое занимает `net.connect` (только для TCP) при успешном подключении {#measuring-how-long-the-netconnect-only-for-tcp-takes-when-the-connection-is-successful}

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

### Измерение времени, которое занимает DNS при успешном запросе {#measuring-how-long-the-dns-takes-when-the-request-is-successful}

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

