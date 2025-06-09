---
title: Документация API таймеров Node.js
description: Модуль таймеров Node.js предоставляет функции для планирования вызова функций в будущем. Включает методы, такие как setTimeout, setInterval, setImmediate и их аналоги для очистки, а также process.nextTick для выполнения кода на следующей итерации цикла событий.
head:
  - - meta
    - name: og:title
      content: Документация API таймеров Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль таймеров Node.js предоставляет функции для планирования вызова функций в будущем. Включает методы, такие как setTimeout, setInterval, setImmediate и их аналоги для очистки, а также process.nextTick для выполнения кода на следующей итерации цикла событий.
  - - meta
    - name: twitter:title
      content: Документация API таймеров Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль таймеров Node.js предоставляет функции для планирования вызова функций в будущем. Включает методы, такие как setTimeout, setInterval, setImmediate и их аналоги для очистки, а также process.nextTick для выполнения кода на следующей итерации цикла событий.
---


# Таймеры {#timers}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/timers.js](https://github.com/nodejs/node/blob/v23.5.0/lib/timers.js)

Модуль `timer` предоставляет глобальный API для планирования вызова функций через некоторый период времени. Поскольку функции таймера являются глобальными, нет необходимости вызывать `require('node:timers')` для использования API.

Функции таймера в Node.js реализуют API, аналогичный API таймеров, предоставляемому веб-браузерами, но используют другую внутреннюю реализацию, построенную на основе [Цикла событий](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout) Node.js.

## Класс: `Immediate` {#class-immediate}

Этот объект создается внутри и возвращается из [`setImmediate()`](/ru/nodejs/api/timers#setimmediatecallback-args). Он может быть передан в [`clearImmediate()`](/ru/nodejs/api/timers#clearimmediateimmediate) для отмены запланированных действий.

По умолчанию, когда планируется немедленное выполнение, цикл событий Node.js будет продолжать работать до тех пор, пока Immediate активен. Объект `Immediate`, возвращаемый [`setImmediate()`](/ru/nodejs/api/timers#setimmediatecallback-args), экспортирует функции `immediate.ref()` и `immediate.unref()`, которые можно использовать для управления этим поведением по умолчанию.

### `immediate.hasRef()` {#immediatehasref}

**Добавлено в: v11.0.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если true, объект `Immediate` будет поддерживать активность цикла событий Node.js.

### `immediate.ref()` {#immediateref}

**Добавлено в: v9.7.0**

- Возвращает: [\<Immediate\>](/ru/nodejs/api/timers#class-immediate) ссылку на `immediate`

При вызове запрашивает, чтобы цикл событий Node.js *не* завершался, пока `Immediate` активен. Многократный вызов `immediate.ref()` не оказывает никакого эффекта.

По умолчанию все объекты `Immediate` являются "ref'ed", поэтому обычно нет необходимости вызывать `immediate.ref()`, если только ранее не был вызван `immediate.unref()`.


### `immediate.unref()` {#immediateunref}

**Добавлено в версии: v9.7.0**

- Возвращает: [\<Immediate\>](/ru/nodejs/api/timers#class-immediate) ссылку на `immediate`

При вызове активный объект `Immediate` не потребует, чтобы цикл событий Node.js оставался активным. Если нет другой активности, поддерживающей работу цикла событий, процесс может завершиться до вызова обратного вызова объекта `Immediate`. Многократный вызов `immediate.unref()` не имеет никакого эффекта.

### `immediate[Symbol.dispose]()` {#immediatesymboldispose}

**Добавлено в версии: v20.5.0, v18.18.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Отменяет immediate. Это аналогично вызову `clearImmediate()`.

## Класс: `Timeout` {#class-timeout}

Этот объект создается внутренне и возвращается из [`setTimeout()`](/ru/nodejs/api/timers#settimeoutcallback-delay-args) и [`setInterval()`](/ru/nodejs/api/timers#setintervalcallback-delay-args). Он может быть передан в [`clearTimeout()`](/ru/nodejs/api/timers#cleartimeouttimeout) или [`clearInterval()`](/ru/nodejs/api/timers#clearintervaltimeout) для отмены запланированных действий.

По умолчанию, когда таймер запланирован с использованием [`setTimeout()`](/ru/nodejs/api/timers#settimeoutcallback-delay-args) или [`setInterval()`](/ru/nodejs/api/timers#setintervalcallback-delay-args), цикл событий Node.js будет продолжать работать до тех пор, пока таймер активен. Каждый из объектов `Timeout`, возвращаемых этими функциями, экспортирует функции `timeout.ref()` и `timeout.unref()`, которые можно использовать для управления этим поведением по умолчанию.

### `timeout.close()` {#timeoutclose}

**Добавлено в версии: v0.9.1**

::: info [Стабильность: 3 - Устаревший]
[Стабильность: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревший: Используйте [`clearTimeout()`](/ru/nodejs/api/timers#cleartimeouttimeout) вместо этого.
:::

- Возвращает: [\<Timeout\>](/ru/nodejs/api/timers#class-timeout) ссылку на `timeout`

Отменяет тайм-аут.

### `timeout.hasRef()` {#timeouthasref}

**Добавлено в версии: v11.0.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если true, объект `Timeout` будет поддерживать активность цикла событий Node.js.


### `timeout.ref()` {#timeoutref}

**Добавлено в версии: v0.9.1**

- Возвращает: [\<Timeout\>](/ru/nodejs/api/timers#class-timeout) ссылку на `timeout`

При вызове запрашивает, чтобы цикл событий Node.js *не* завершался до тех пор, пока `Timeout` активен. Многократный вызов `timeout.ref()` не имеет эффекта.

По умолчанию все объекты `Timeout` "ref'ed", поэтому обычно нет необходимости вызывать `timeout.ref()`, если только ранее не был вызван `timeout.unref()`.

### `timeout.refresh()` {#timeoutrefresh}

**Добавлено в версии: v10.2.0**

- Возвращает: [\<Timeout\>](/ru/nodejs/api/timers#class-timeout) ссылку на `timeout`

Устанавливает время начала таймера на текущее время и перепланирует таймер для вызова его обратного вызова с ранее указанной продолжительностью, скорректированной на текущее время. Это полезно для обновления таймера без выделения нового объекта JavaScript.

Использование этого на таймере, который уже вызвал свой обратный вызов, повторно активирует таймер.

### `timeout.unref()` {#timeoutunref}

**Добавлено в версии: v0.9.1**

- Возвращает: [\<Timeout\>](/ru/nodejs/api/timers#class-timeout) ссылку на `timeout`

При вызове активный объект `Timeout` не потребует, чтобы цикл событий Node.js оставался активным. Если нет другой активности, поддерживающей работу цикла событий, процесс может завершиться до вызова обратного вызова объекта `Timeout`. Многократный вызов `timeout.unref()` не имеет эффекта.

### `timeout[Symbol.toPrimitive]()` {#timeoutsymboltoprimitive}

**Добавлено в версии: v14.9.0, v12.19.0**

- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) число, которое можно использовать для ссылки на этот `timeout`

Приводит `Timeout` к примитиву. Примитив можно использовать для очистки `Timeout`. Примитив можно использовать только в том же потоке, в котором был создан таймер. Поэтому, чтобы использовать его в [`worker_threads`](/ru/nodejs/api/worker_threads), его сначала необходимо передать в правильный поток. Это обеспечивает улучшенную совместимость с реализациями `setTimeout()` и `setInterval()` в браузере.

### `timeout[Symbol.dispose]()` {#timeoutsymboldispose}

**Добавлено в версии: v20.5.0, v18.18.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Отменяет таймер.


## Планирование таймеров {#scheduling-timers}

Таймер в Node.js - это внутренняя конструкция, которая вызывает заданную функцию через определенный период времени. Время вызова функции таймера зависит от того, какой метод использовался для создания таймера, и от того, какую другую работу выполняет цикл событий Node.js.

### `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.9.1 | Добавлено в: v0.9.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которую нужно вызвать в конце этого прохода цикла событий Node.js [Event Loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные аргументы, которые нужно передать при вызове `callback`.
- Возвращает: [\<Immediate\>](/ru/nodejs/api/timers#class-immediate) для использования с [`clearImmediate()`](/ru/nodejs/api/timers#clearimmediateimmediate)

Планирует "немедленное" выполнение `callback` после обратных вызовов событий I/O.

Когда делается несколько вызовов `setImmediate()`, функции `callback` помещаются в очередь для выполнения в том порядке, в котором они были созданы. Вся очередь обратных вызовов обрабатывается на каждой итерации цикла событий. Если немедленный таймер помещен в очередь изнутри выполняющегося обратного вызова, этот таймер не будет запущен до следующей итерации цикла событий.

Если `callback` не является функцией, будет выброшена ошибка [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

Этот метод имеет пользовательский вариант для промисов, который доступен с помощью [`timersPromises.setImmediate()`](/ru/nodejs/api/timers#timerspromisessetimmediatevalue-options).

### `setInterval(callback[, delay[, ...args]])` {#setintervalcallback-delay-args}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Добавлено в: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которую нужно вызвать, когда таймер истечет.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд, которые нужно подождать перед вызовом `callback`. **По умолчанию:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные аргументы, которые нужно передать при вызове `callback`.
- Возвращает: [\<Timeout\>](/ru/nodejs/api/timers#class-timeout) для использования с [`clearInterval()`](/ru/nodejs/api/timers#clearintervaltimeout)

Планирует повторное выполнение `callback` каждые `delay` миллисекунд.

Когда `delay` больше `2147483647` или меньше `1` или `NaN`, `delay` будет установлен в `1`. Нецелые значения задержки усекаются до целого числа.

Если `callback` не является функцией, будет выброшена ошибка [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

Этот метод имеет пользовательский вариант для промисов, который доступен с помощью [`timersPromises.setInterval()`](/ru/nodejs/api/timers#timerspromisessetintervaldelay-value-options).


### `setTimeout(callback[, delay[, ...args]])` {#settimeoutcallback-delay-args}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.0.1 | Добавлено в: v0.0.1 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которая будет вызвана по истечении таймера.
- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд ожидания перед вызовом `callback`. **По умолчанию:** `1`.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные аргументы, которые будут переданы при вызове `callback`.
- Возвращает: [\<Timeout\>](/ru/nodejs/api/timers#class-timeout) для использования с [`clearTimeout()`](/ru/nodejs/api/timers#cleartimeouttimeout)

Планирует однократное выполнение `callback` через `delay` миллисекунд.

`callback`, вероятно, не будет вызван точно через `delay` миллисекунд. Node.js не дает никаких гарантий относительно точного времени срабатывания обратных вызовов, а также их порядка. Обратный вызов будет вызван как можно ближе к указанному времени.

Когда `delay` больше, чем `2147483647`, или меньше, чем `1`, или `NaN`, `delay` будет установлено равным `1`. Нецелые значения задержки усекаются до целых чисел.

Если `callback` не является функцией, будет выброшена ошибка [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

Этот метод имеет пользовательский вариант для промисов, который доступен с помощью [`timersPromises.setTimeout()`](/ru/nodejs/api/timers#timerspromisessettimeoutdelay-value-options).

## Отмена таймеров {#cancelling-timers}

Методы [`setImmediate()`](/ru/nodejs/api/timers#setimmediatecallback-args), [`setInterval()`](/ru/nodejs/api/timers#setintervalcallback-delay-args) и [`setTimeout()`](/ru/nodejs/api/timers#settimeoutcallback-delay-args) возвращают объекты, представляющие запланированные таймеры. Их можно использовать для отмены таймера и предотвращения его срабатывания.

Для промисифицированных вариантов [`setImmediate()`](/ru/nodejs/api/timers#setimmediatecallback-args) и [`setTimeout()`](/ru/nodejs/api/timers#settimeoutcallback-delay-args) для отмены таймера можно использовать [`AbortController`](/ru/nodejs/api/globals#class-abortcontroller). При отмене возвращенные промисы будут отклонены с ошибкой `'AbortError'`.

Для `setImmediate()`:

::: code-group
```js [ESM]
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Мы не используем `await` для промиса, поэтому `ac.abort()` вызывается параллельно.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
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
      console.error('The immediate was aborted');
  });

ac.abort();
```
:::

Для `setTimeout()`:

::: code-group
```js [ESM]
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// Мы не используем `await` для промиса, поэтому `ac.abort()` вызывается параллельно.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
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
      console.error('The timeout was aborted');
  });

ac.abort();
```
:::


### `clearImmediate(immediate)` {#clearimmediateimmediate}

**Добавлено в: v0.9.1**

- `immediate` [\<Immediate\>](/ru/nodejs/api/timers#class-immediate) Объект `Immediate`, возвращаемый функцией [`setImmediate()`](/ru/nodejs/api/timers#setimmediatecallback-args).

Отменяет объект `Immediate`, созданный функцией [`setImmediate()`](/ru/nodejs/api/timers#setimmediatecallback-args).

### `clearInterval(timeout)` {#clearintervaltimeout}

**Добавлено в: v0.0.1**

- `timeout` [\<Timeout\>](/ru/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Объект `Timeout`, возвращаемый функцией [`setInterval()`](/ru/nodejs/api/timers#setintervalcallback-delay-args), или [примитив](/ru/nodejs/api/timers#timeoutsymboltoprimitive) объекта `Timeout` в виде строки или числа.

Отменяет объект `Timeout`, созданный функцией [`setInterval()`](/ru/nodejs/api/timers#setintervalcallback-delay-args).

### `clearTimeout(timeout)` {#cleartimeouttimeout}

**Добавлено в: v0.0.1**

- `timeout` [\<Timeout\>](/ru/nodejs/api/timers#class-timeout) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Объект `Timeout`, возвращаемый функцией [`setTimeout()`](/ru/nodejs/api/timers#settimeoutcallback-delay-args), или [примитив](/ru/nodejs/api/timers#timeoutsymboltoprimitive) объекта `Timeout` в виде строки или числа.

Отменяет объект `Timeout`, созданный функцией [`setTimeout()`](/ru/nodejs/api/timers#settimeoutcallback-delay-args).

## Timers Promises API {#timers-promises-api}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Переход из экспериментального статуса. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

API `timers/promises` предоставляет альтернативный набор функций таймера, которые возвращают объекты `Promise`. API доступен через `require('node:timers/promises')`.

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

**Добавлено в: v15.0.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд для ожидания перед выполнением промиса. **По умолчанию:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение, с которым выполняется промис.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Установите в `false`, чтобы указать, что запланированный `Timeout` не должен требовать, чтобы цикл событий Node.js оставался активным. **По умолчанию:** `true`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Необязательный `AbortSignal`, который можно использовать для отмены запланированного `Timeout`.




::: code-group
```js [ESM]
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Выводит 'result'
```

```js [CJS]
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Выводит 'result'
});
```
:::

### `timersPromises.setImmediate([value[, options]])` {#timerspromisessetimmediatevalue-options}

**Добавлено в: v15.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение, с которым выполняется промис.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Установите в `false`, чтобы указать, что запланированный `Immediate` не должен требовать, чтобы цикл событий Node.js оставался активным. **По умолчанию:** `true`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Необязательный `AbortSignal`, который можно использовать для отмены запланированного `Immediate`.




::: code-group
```js [ESM]
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Выводит 'result'
```

```js [CJS]
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Выводит 'result'
});
```
:::


### `timersPromises.setInterval([delay[, value[, options]]])` {#timerspromisessetintervaldelay-value-options}

**Добавлено в: v15.9.0**

Возвращает асинхронный итератор, который генерирует значения с интервалом в `delay` мс. Если `ref` имеет значение `true`, необходимо явно или неявно вызвать `next()` асинхронного итератора, чтобы поддерживать активность цикла событий.

- `delay` [\<number\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд для ожидания между итерациями. **По умолчанию:** `1`.
- `value` [\<any\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Data_types) Значение, с которым возвращает итератор.
- `options` [\<Object\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Boolean_type) Установите в `false`, чтобы указать, что запланированный `Timeout` между итерациями не должен требовать, чтобы цикл событий Node.js оставался активным. **По умолчанию:** `true`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Необязательный `AbortSignal`, который можно использовать для отмены запланированного `Timeout` между операциями.

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

**Добавлено в: v17.3.0, v16.14.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `delay` [\<number\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд для ожидания перед разрешением промиса.
- `options` [\<Object\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ref` [\<boolean\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Boolean_type) Установите в `false`, чтобы указать, что запланированный `Timeout` не должен требовать, чтобы цикл событий Node.js оставался активным. **По умолчанию:** `true`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Необязательный `AbortSignal`, который можно использовать для отмены ожидания.

- Возвращает: [\<Promise\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Экспериментальный API, определенный черновой спецификацией [Scheduling APIs](https://github.com/WICG/scheduling-apis), разрабатываемой как стандартный API веб-платформы.

Вызов `timersPromises.scheduler.wait(delay, options)` эквивалентен вызову `timersPromises.setTimeout(delay, undefined, options)`.

```js [ESM]
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // Подождите одну секунду, прежде чем продолжить
```

### `timersPromises.scheduler.yield()` {#timerspromisesscheduleryield}

**Добавлено в: v17.3.0, v16.14.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Экспериментальный API, определенный черновиком спецификации [Scheduling APIs](https://github.com/WICG/scheduling-apis), разрабатываемым как стандартный API веб-платформы.

Вызов `timersPromises.scheduler.yield()` эквивалентен вызову `timersPromises.setImmediate()` без аргументов.

