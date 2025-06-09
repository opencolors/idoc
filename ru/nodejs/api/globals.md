---
title: Глобальные объекты Node.js
description: Эта страница документирует глобальные объекты, доступные в Node.js, включая глобальные переменные, функции и классы, которые можно использовать из любого модуля без явного импорта.
head:
  - - meta
    - name: og:title
      content: Глобальные объекты Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Эта страница документирует глобальные объекты, доступные в Node.js, включая глобальные переменные, функции и классы, которые можно использовать из любого модуля без явного импорта.
  - - meta
    - name: twitter:title
      content: Глобальные объекты Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Эта страница документирует глобальные объекты, доступные в Node.js, включая глобальные переменные, функции и классы, которые можно использовать из любого модуля без явного импорта.
---


# Глобальные объекты {#global-objects}

Эти объекты доступны во всех модулях.

Следующие переменные могут казаться глобальными, но это не так. Они существуют только в области видимости [модулей CommonJS](/ru/nodejs/api/modules):

- [`__dirname`](/ru/nodejs/api/modules#__dirname)
- [`__filename`](/ru/nodejs/api/modules#__filename)
- [`exports`](/ru/nodejs/api/modules#exports)
- [`module`](/ru/nodejs/api/modules#module)
- [`require()`](/ru/nodejs/api/modules#requireid)

Объекты, перечисленные здесь, специфичны для Node.js. Существуют [встроенные объекты](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects), которые являются частью самого языка JavaScript и также глобально доступны.

## Класс: `AbortController` {#class-abortcontroller}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.4.0 | Больше не является экспериментальным. |
| v15.0.0, v14.17.0 | Добавлено в: v15.0.0, v14.17.0 |
:::

Вспомогательный класс, используемый для сигнализации об отмене в выбранных API на основе `Promise`. API основан на Web API [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

```js [ESM]
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Выводит true
```
### `abortController.abort([reason])` {#abortcontrollerabortreason}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.2.0, v16.14.0 | Добавлен новый необязательный аргумент reason. |
| v15.0.0, v14.17.0 | Добавлено в: v15.0.0, v14.17.0 |
:::

- `reason` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательная причина, которую можно получить в свойстве `reason` объекта `AbortSignal`.

Запускает сигнал прерывания, в результате чего `abortController.signal` генерирует событие `'abort'`.

### `abortController.signal` {#abortcontrollersignal}

**Добавлено в: v15.0.0, v14.17.0**

- Тип: [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)

### Класс: `AbortSignal` {#class-abortsignal}

**Добавлено в: v15.0.0, v14.17.0**

- Расширяет: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget)

`AbortSignal` используется для уведомления наблюдателей при вызове метода `abortController.abort()`.


#### Статический метод: `AbortSignal.abort([reason])` {#static-method-abortsignalabortreason}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.2.0, v16.14.0 | Добавлен новый необязательный аргумент reason. |
| v15.12.0, v14.17.0 | Добавлено в: v15.12.0, v14.17.0 |
:::

- `reason`: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)

Возвращает новый, уже прерванный `AbortSignal`.

#### Статический метод: `AbortSignal.timeout(delay)` {#static-method-abortsignaltimeoutdelay}

**Добавлено в: v17.3.0, v16.14.0**

- `delay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество миллисекунд для ожидания перед запуском AbortSignal.

Возвращает новый `AbortSignal`, который будет прерван через `delay` миллисекунд.

#### Статический метод: `AbortSignal.any(signals)` {#static-method-abortsignalanysignals}

**Добавлено в: v20.3.0, v18.17.0**

- `signals` [\<AbortSignal[]\>](/ru/nodejs/api/globals#class-abortsignal) `AbortSignal`s, из которых составляется новый `AbortSignal`.

Возвращает новый `AbortSignal`, который будет прерван, если какой-либо из предоставленных сигналов прерван. Его [`abortSignal.reason`](/ru/nodejs/api/globals#abortsignalreason) будет установлен в тот, который из `signals` вызвал его прерывание.

#### Событие: `'abort'` {#event-abort}

**Добавлено в: v15.0.0, v14.17.0**

Событие `'abort'` испускается, когда вызывается метод `abortController.abort()`. Обратный вызов вызывается с одним аргументом объекта с одним свойством `type`, установленным в `'abort'`:

```js [ESM]
const ac = new AbortController();

// Используйте либо свойство onabort...
ac.signal.onabort = () => console.log('aborted!');

// Или EventTarget API...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Печатает 'abort'
}, { once: true });

ac.abort();
```
`AbortController`, с которым связан `AbortSignal`, будет запускать событие `'abort'` только один раз. Мы рекомендуем коду проверять, является ли атрибут `abortSignal.aborted` `false` перед добавлением прослушивателя событий `'abort'`.

Любые прослушиватели событий, прикрепленные к `AbortSignal`, должны использовать опцию `{ once: true }` (или, если для прикрепления прослушивателя используются API `EventEmitter`, используйте метод `once()`), чтобы гарантировать, что прослушиватель событий будет удален, как только событие `'abort'` будет обработано. Невыполнение этого требования может привести к утечкам памяти.


#### `abortSignal.aborted` {#abortsignalaborted}

**Добавлено в версии: v15.0.0, v14.17.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True после того, как `AbortController` был прерван.

#### `abortSignal.onabort` {#abortsignalonabort}

**Добавлено в версии: v15.0.0, v14.17.0**

- Тип: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Необязательная функция обратного вызова, которая может быть установлена пользовательским кодом для получения уведомлений при вызове функции `abortController.abort()`.

#### `abortSignal.reason` {#abortsignalreason}

**Добавлено в версии: v17.2.0, v16.14.0**

- Тип: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Необязательная причина, указанная при запуске `AbortSignal`.

```js [ESM]
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```
#### `abortSignal.throwIfAborted()` {#abortsignalthrowifaborted}

**Добавлено в версии: v17.3.0, v16.17.0**

Если `abortSignal.aborted` имеет значение `true`, выдает ошибку `abortSignal.reason`.

## Класс: `Blob` {#class-blob}

**Добавлено в версии: v18.0.0**

См. [\<Blob\>](/ru/nodejs/api/buffer#class-blob).

## Класс: `Buffer` {#class-buffer}

**Добавлено в версии: v0.1.103**

- [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Используется для обработки двоичных данных. См. раздел [buffer](/ru/nodejs/api/buffer).

## Класс: `ByteLengthQueuingStrategy` {#class-bytelengthqueuingstrategy}

**Добавлено в версии: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Браузерно-совместимая реализация [`ByteLengthQueuingStrategy`](/ru/nodejs/api/webstreams#class-bytelengthqueuingstrategy).

## `__dirname` {#__dirname}

Эта переменная может показаться глобальной, но это не так. См. [`__dirname`](/ru/nodejs/api/modules#__dirname).

## `__filename` {#__filename}

Эта переменная может показаться глобальной, но это не так. См. [`__filename`](/ru/nodejs/api/modules#__filename).

## `atob(data)` {#atobdata}

**Добавлено в версии: v16.0.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее. Вместо этого используйте `Buffer.from(data, 'base64')`.
:::

Глобальный псевдоним для [`buffer.atob()`](/ru/nodejs/api/buffer#bufferatobdata).


## `BroadcastChannel` {#broadcastchannel}

**Добавлено в: v18.0.0**

См. [\<BroadcastChannel\>](/ru/nodejs/api/worker_threads#class-broadcastchannel-extends-eventtarget).

## `btoa(data)` {#btoadata}

**Добавлено в: v16.0.0**

::: info [Стабильно: 3 - Устаревшее]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее. Используйте `buf.toString('base64')` вместо этого.
:::

Глобальный псевдоним для [`buffer.btoa()`](/ru/nodejs/api/buffer#bufferbtoadata).

## `clearImmediate(immediateObject)` {#clearimmediateimmediateobject}

**Добавлено в: v0.9.1**

[`clearImmediate`](/ru/nodejs/api/timers#clearimmediateimmediate) описано в разделе [таймеры](/ru/nodejs/api/timers).

## `clearInterval(intervalObject)` {#clearintervalintervalobject}

**Добавлено в: v0.0.1**

[`clearInterval`](/ru/nodejs/api/timers#clearintervaltimeout) описано в разделе [таймеры](/ru/nodejs/api/timers).

## `clearTimeout(timeoutObject)` {#cleartimeouttimeoutobject}

**Добавлено в: v0.0.1**

[`clearTimeout`](/ru/nodejs/api/timers#cleartimeouttimeout) описано в разделе [таймеры](/ru/nodejs/api/timers).

## `CloseEvent` {#closeevent}

**Добавлено в: v23.0.0**

Класс `CloseEvent`. См. [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent) для получения дополнительной информации.

Браузерная реализация [`CloseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/CloseEvent). Отключите этот API с помощью флага CLI [`--no-experimental-websocket`](/ru/nodejs/api/cli#--no-experimental-websocket).

## Class: `CompressionStream` {#class-compressionstream}

**Добавлено в: v18.0.0**

::: warning [Стабильно: 1 - Экспериментальное]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальное.
:::

Браузерная реализация [`CompressionStream`](/ru/nodejs/api/webstreams#class-compressionstream).

## `console` {#console}

**Добавлено в: v0.1.100**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Используется для вывода в stdout и stderr. См. раздел [`console`](/ru/nodejs/api/console).

## Class: `CountQueuingStrategy` {#class-countqueuingstrategy}

**Добавлено в: v18.0.0**

::: warning [Стабильно: 1 - Экспериментальное]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальное.
:::

Браузерная реализация [`CountQueuingStrategy`](/ru/nodejs/api/webstreams#class-countqueuingstrategy).


## `Crypto` {#crypto}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Больше не является экспериментальным. |
| v19.0.0 | Больше не скрыт за флагом CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Добавлено в: v17.6.0, v16.15.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::

Совместимая с браузером реализация [\<Crypto\>](/ru/nodejs/api/webcrypto#class-crypto). Эта глобальная переменная доступна только в том случае, если двоичный файл Node.js был скомпилирован с поддержкой модуля `node:crypto`.

## `crypto` {#crypto_1}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Больше не является экспериментальным. |
| v19.0.0 | Больше не скрыт за флагом CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Добавлено в: v17.6.0, v16.15.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::

Совместимая с браузером реализация [Web Crypto API](/ru/nodejs/api/webcrypto).

## `CryptoKey` {#cryptokey}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Больше не является экспериментальным. |
| v19.0.0 | Больше не скрыт за флагом CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Добавлено в: v17.6.0, v16.15.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::

Совместимая с браузером реализация [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey). Эта глобальная переменная доступна только в том случае, если двоичный файл Node.js был скомпилирован с поддержкой модуля `node:crypto`.

## `CustomEvent` {#customevent}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Больше не является экспериментальным. |
| v22.1.0, v20.13.0 | CustomEvent теперь стабилен. |
| v19.0.0 | Больше не скрыт за флагом CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Добавлено в: v18.7.0, v16.17.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Совместимая с браузером реализация [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent).


## Класс: `DecompressionStream` {#class-decompressionstream}

**Добавлено в: v18.0.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная.
:::

Браузерно-совместимая реализация [`DecompressionStream`](/ru/nodejs/api/webstreams#class-decompressionstream).

## `Event` {#event}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.4.0 | Больше не экспериментальная. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

Браузерно-совместимая реализация класса `Event`. Подробнее см. [`EventTarget` и `Event` API](/ru/nodejs/api/events#eventtarget-and-event-api).

## `EventSource` {#eventsource}

**Добавлено в: v22.3.0, v20.18.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная. Включите этот API с помощью флага CLI [`--experimental-eventsource`](/ru/nodejs/api/cli#--experimental-eventsource).
:::

Браузерно-совместимая реализация класса [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).

## `EventTarget` {#eventtarget}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.4.0 | Больше не экспериментальная. |
| v15.0.0 | Добавлено в: v15.0.0 |
:::

Браузерно-совместимая реализация класса `EventTarget`. Подробнее см. [`EventTarget` и `Event` API](/ru/nodejs/api/events#eventtarget-and-event-api).

## `exports` {#exports}

Эта переменная может казаться глобальной, но это не так. См. [`exports`](/ru/nodejs/api/modules#exports).

## `fetch` {#fetch}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Больше не экспериментальная. |
| v18.0.0 | Больше не скрывается за флагом CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Добавлено в: v17.5.0, v16.15.0 |
:::

::: tip [Стабильность: 2 - Стабильная]
[Стабильность: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильная
:::

Браузерно-совместимая реализация функции [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch).

## Класс: `File` {#class-file}

**Добавлено в: v20.0.0**

См. [\<File\>](/ru/nodejs/api/buffer#class-file).


## Class `FormData` {#class-formdata}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Больше не является экспериментальной. |
| v18.0.0 | Больше не скрыта за флагом CLI `--experimental-fetch`. |
| v17.6.0, v16.15.0 | Добавлено в: v17.6.0, v16.15.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Браузерно-совместимая реализация [\<FormData\>](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

## `global` {#global}

**Добавлено в: v0.1.27**

::: info [Стабильно: 3 - Устаревшее]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее. Используйте [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) вместо этого.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект глобального пространства имен.

В браузерах областью верхнего уровня традиционно является глобальная область. Это означает, что `var something` определит новую глобальную переменную, за исключением модулей ECMAScript. В Node.js это иначе. Область верхнего уровня не является глобальной областью; `var something` внутри модуля Node.js будет локальной для этого модуля, независимо от того, является ли он [модулем CommonJS](/ru/nodejs/api/modules) или [модулем ECMAScript](/ru/nodejs/api/esm).

## Class `Headers` {#class-headers}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Больше не является экспериментальной. |
| v18.0.0 | Больше не скрыта за флагом CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Добавлено в: v17.5.0, v16.15.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Браузерно-совместимая реализация [\<Headers\>](https://developer.mozilla.org/en-US/docs/Web/API/Headers).

## `localStorage` {#localstorage}

**Добавлено в: v22.4.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка.
:::

Браузерно-совместимая реализация [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Данные хранятся в незашифрованном виде в файле, указанном флагом CLI [`--localstorage-file`](/ru/nodejs/api/cli#--localstorage-filefile). Максимальный объем данных, который можно хранить, составляет 10 МБ. Любое изменение этих данных вне Web Storage API не поддерживается. Включите этот API с помощью флага CLI [`--experimental-webstorage`](/ru/nodejs/api/cli#--experimental-webstorage). Данные `localStorage` не хранятся для каждого пользователя или для каждого запроса при использовании в контексте сервера, они являются общими для всех пользователей и запросов.


## `MessageChannel` {#messagechannel}

**Добавлено в: v15.0.0**

Класс `MessageChannel`. Подробнее см. [`MessageChannel`](/ru/nodejs/api/worker_threads#class-messagechannel).

## `MessageEvent` {#messageevent}

**Добавлено в: v15.0.0**

Класс `MessageEvent`. Подробнее см. [`MessageEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent).

## `MessagePort` {#messageport}

**Добавлено в: v15.0.0**

Класс `MessagePort`. Подробнее см. [`MessagePort`](/ru/nodejs/api/worker_threads#class-messageport).

## `module` {#module}

Эта переменная может казаться глобальной, но это не так. См. [`module`](/ru/nodejs/api/modules#module).

## `Navigator` {#navigator}

**Добавлено в: v21.0.0**

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка. Отключите этот API с помощью флага CLI [`--no-experimental-global-navigator`](/ru/nodejs/api/cli#--no-experimental-global-navigator).
:::

Частичная реализация [API Navigator](https://html.spec.whatwg.org/multipage/system-state#the-navigator-object).

## `navigator` {#navigator_1}

**Добавлено в: v21.0.0**

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка. Отключите этот API с помощью флага CLI [`--no-experimental-global-navigator`](/ru/nodejs/api/cli#--no-experimental-global-navigator).
:::

Частичная реализация [`window.navigator`](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator).

### `navigator.hardwareConcurrency` {#navigatorhardwareconcurrency}

**Добавлено в: v21.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Свойство `navigator.hardwareConcurrency` только для чтения возвращает количество логических процессоров, доступных текущему экземпляру Node.js.

```js [ESM]
console.log(`Этот процесс запущен на ${navigator.hardwareConcurrency} логических процессорах`);
```
### `navigator.language` {#navigatorlanguage}

**Добавлено в: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `navigator.language` только для чтения возвращает строку, представляющую предпочтительный язык экземпляра Node.js. Язык будет определяться библиотекой ICU, используемой Node.js во время выполнения, на основе языка операционной системы по умолчанию.

Значение представляет собой языковую версию, как определено в [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646.txt).

Значением по умолчанию для сборок без ICU является `'en-US'`.

```js [ESM]
console.log(`Предпочтительный язык экземпляра Node.js имеет тег '${navigator.language}'`);
```

### `navigator.languages` {#navigatorlanguages}

**Добавлено в версии: v21.2.0**

- {Array

Свойство `navigator.languages` только для чтения возвращает массив строк, представляющих предпочитаемые языки экземпляра Node.js. По умолчанию `navigator.languages` содержит только значение `navigator.language`, которое будет определяться библиотекой ICU, используемой Node.js во время выполнения, на основе языка операционной системы по умолчанию.

Резервное значение для сборок без ICU — `['en-US']`.

```js [ESM]
console.log(`Предпочитаемые языки: '${navigator.languages}'`);
```
### `navigator.platform` {#navigatorplatform}

**Добавлено в версии: v21.2.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `navigator.platform` только для чтения возвращает строку, идентифицирующую платформу, на которой работает экземпляр Node.js.

```js [ESM]
console.log(`Этот процесс запущен на ${navigator.platform}`);
```
### `navigator.userAgent` {#navigatoruseragent}

**Добавлено в версии: v21.1.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `navigator.userAgent` только для чтения возвращает строку user agent, состоящую из имени среды выполнения и номера основной версии.

```js [ESM]
console.log(`User-agent: ${navigator.userAgent}`); // Выводит "Node.js/21"
```
## `PerformanceEntry` {#performanceentry}

**Добавлено в версии: v19.0.0**

Класс `PerformanceEntry`. Подробнее см. [`PerformanceEntry`](/ru/nodejs/api/perf_hooks#class-performanceentry).

## `PerformanceMark` {#performancemark}

**Добавлено в версии: v19.0.0**

Класс `PerformanceMark`. Подробнее см. [`PerformanceMark`](/ru/nodejs/api/perf_hooks#class-performancemark).

## `PerformanceMeasure` {#performancemeasure}

**Добавлено в версии: v19.0.0**

Класс `PerformanceMeasure`. Подробнее см. [`PerformanceMeasure`](/ru/nodejs/api/perf_hooks#class-performancemeasure).

## `PerformanceObserver` {#performanceobserver}

**Добавлено в версии: v19.0.0**

Класс `PerformanceObserver`. Подробнее см. [`PerformanceObserver`](/ru/nodejs/api/perf_hooks#class-performanceobserver).

## `PerformanceObserverEntryList` {#performanceobserverentrylist}

**Добавлено в версии: v19.0.0**

Класс `PerformanceObserverEntryList`. Подробнее см. [`PerformanceObserverEntryList`](/ru/nodejs/api/perf_hooks#class-performanceobserverentrylist).


## `PerformanceResourceTiming` {#performanceresourcetiming}

**Добавлено в: v19.0.0**

Класс `PerformanceResourceTiming`. Дополнительные сведения см. в разделе [`PerformanceResourceTiming`](/ru/nodejs/api/perf_hooks#class-performanceresourcetiming).

## `performance` {#performance}

**Добавлено в: v16.0.0**

Объект [`perf_hooks.performance`](/ru/nodejs/api/perf_hooks#perf_hooksperformance).

## `process` {#process}

**Добавлено в: v0.1.7**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект process. См. раздел [`process` object](/ru/nodejs/api/process#process).

## `queueMicrotask(callback)` {#queuemicrotaskcallback}

**Добавлено в: v11.0.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которую необходимо поставить в очередь.

Метод `queueMicrotask()` ставит микрозадачу в очередь для вызова `callback`. Если `callback` вызывает исключение, будет сгенерировано событие [`process` object](/ru/nodejs/api/process#process) `'uncaughtException'`.

Очередь микрозадач управляется V8 и может использоваться аналогично очереди [`process.nextTick()`](/ru/nodejs/api/process#processnexttickcallback-args), которая управляется Node.js. Очередь `process.nextTick()` всегда обрабатывается перед очередью микрозадач на каждом витке цикла событий Node.js.

```js [ESM]
// Здесь `queueMicrotask()` используется для обеспечения того, чтобы событие 'load' всегда
// генерировалось асинхронно и, следовательно, согласованно. Использование
// `process.nextTick()` здесь приведет к тому, что событие 'load' всегда будет генерироваться
// перед любыми другими заданиями promise.

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};
```
## Class: `ReadableByteStreamController` {#class-readablebytestreamcontroller}

**Добавлено в: v18.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Браузерно-совместимая реализация [`ReadableByteStreamController`](/ru/nodejs/api/webstreams#class-readablebytestreamcontroller).


## Класс: `ReadableStream` {#class-readablestream}

**Добавлено в: v18.0.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный.
:::

Реализация [`ReadableStream`](/ru/nodejs/api/webstreams#class-readablestream), совместимая с браузером.

## Класс: `ReadableStreamBYOBReader` {#class-readablestreambyobreader}

**Добавлено в: v18.0.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный.
:::

Реализация [`ReadableStreamBYOBReader`](/ru/nodejs/api/webstreams#class-readablestreambyobreader), совместимая с браузером.

## Класс: `ReadableStreamBYOBRequest` {#class-readablestreambyobrequest}

**Добавлено в: v18.0.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный.
:::

Реализация [`ReadableStreamBYOBRequest`](/ru/nodejs/api/webstreams#class-readablestreambyobrequest), совместимая с браузером.

## Класс: `ReadableStreamDefaultController` {#class-readablestreamdefaultcontroller}

**Добавлено в: v18.0.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный.
:::

Реализация [`ReadableStreamDefaultController`](/ru/nodejs/api/webstreams#class-readablestreamdefaultcontroller), совместимая с браузером.

## Класс: `ReadableStreamDefaultReader` {#class-readablestreamdefaultreader}

**Добавлено в: v18.0.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный.
:::

Реализация [`ReadableStreamDefaultReader`](/ru/nodejs/api/webstreams#class-readablestreamdefaultreader), совместимая с браузером.

## `require()` {#require}

Эта переменная может казаться глобальной, но это не так. См. [`require()`](/ru/nodejs/api/modules#requireid).

## `Response` {#response}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Больше не является экспериментальной. |
| v18.0.0 | Больше не требует флаг CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Добавлено в: v17.5.0, v16.15.0 |
:::

::: tip [Стабильность: 2 - Стабильный]
[Стабильность: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильный
:::

Реализация [\<Response\>](https://developer.mozilla.org/en-US/docs/Web/API/Response), совместимая с браузером.


## `Request` {#request}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Больше не является экспериментальной. |
| v18.0.0 | Больше не требует флаг CLI `--experimental-fetch`. |
| v17.5.0, v16.15.0 | Добавлено в: v17.5.0, v16.15.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Браузерная реализация [\<Request\>](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## `sessionStorage` {#sessionstorage}

**Добавлено в: v22.4.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя стадия разработки.
:::

Браузерная реализация [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage). Данные хранятся в памяти с квотой хранения 10 МБ. Данные `sessionStorage` сохраняются только в текущем запущенном процессе и не передаются между workers.

## `setImmediate(callback[, ...args])` {#setimmediatecallback-args}

**Добавлено в: v0.9.1**

[`setImmediate`](/ru/nodejs/api/timers#setimmediatecallback-args) описан в разделе [timers](/ru/nodejs/api/timers).

## `setInterval(callback, delay[, ...args])` {#setintervalcallback-delay-args}

**Добавлено в: v0.0.1**

[`setInterval`](/ru/nodejs/api/timers#setintervalcallback-delay-args) описан в разделе [timers](/ru/nodejs/api/timers).

## `setTimeout(callback, delay[, ...args])` {#settimeoutcallback-delay-args}

**Добавлено в: v0.0.1**

[`setTimeout`](/ru/nodejs/api/timers#settimeoutcallback-delay-args) описан в разделе [timers](/ru/nodejs/api/timers).

## Class: `Storage` {#class-storage}

**Добавлено в: v22.4.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя стадия разработки.
:::

Браузерная реализация [`Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Storage). Включите этот API с помощью флага CLI [`--experimental-webstorage`](/ru/nodejs/api/cli#--experimental-webstorage).

## `structuredClone(value[, options])` {#structuredclonevalue-options}

**Добавлено в: v17.0.0**

Метод WHATWG [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone).


## `SubtleCrypto` {#subtlecrypto}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Больше не скрыта за флагом CLI `--experimental-global-webcrypto`. |
| v17.6.0, v16.15.0 | Добавлено в: v17.6.0, v16.15.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::

Браузерно-совместимая реализация [\<SubtleCrypto\>](/ru/nodejs/api/webcrypto#class-subtlecrypto). Этот глобальный объект доступен только в том случае, если бинарный файл Node.js был скомпилирован с поддержкой модуля `node:crypto`.

## `DOMException` {#domexception}

**Добавлено в: v17.0.0**

Класс WHATWG `DOMException`. Подробнее см. [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException).

## `TextDecoder` {#textdecoder}

**Добавлено в: v11.0.0**

Класс WHATWG `TextDecoder`. См. раздел [`TextDecoder`](/ru/nodejs/api/util#class-utiltextdecoder).

## Класс: `TextDecoderStream` {#class-textdecoderstream}

**Добавлено в: v18.0.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Браузерно-совместимая реализация [`TextDecoderStream`](/ru/nodejs/api/webstreams#class-textdecoderstream).

## `TextEncoder` {#textencoder}

**Добавлено в: v11.0.0**

Класс WHATWG `TextEncoder`. См. раздел [`TextEncoder`](/ru/nodejs/api/util#class-utiltextencoder).

## Класс: `TextEncoderStream` {#class-textencoderstream}

**Добавлено в: v18.0.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Браузерно-совместимая реализация [`TextEncoderStream`](/ru/nodejs/api/webstreams#class-textencoderstream).

## Класс: `TransformStream` {#class-transformstream}

**Добавлено в: v18.0.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Браузерно-совместимая реализация [`TransformStream`](/ru/nodejs/api/webstreams#class-transformstream).

## Класс: `TransformStreamDefaultController` {#class-transformstreamdefaultcontroller}

**Добавлено в: v18.0.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Браузерно-совместимая реализация [`TransformStreamDefaultController`](/ru/nodejs/api/webstreams#class-transformstreamdefaultcontroller).


## `URL` {#url}

**Добавлено в версии: v10.0.0**

Класс `URL` WHATWG. См. раздел [`URL`](/ru/nodejs/api/url#class-url).

## `URLSearchParams` {#urlsearchparams}

**Добавлено в версии: v10.0.0**

Класс `URLSearchParams` WHATWG. См. раздел [`URLSearchParams`](/ru/nodejs/api/url#class-urlsearchparams).

## `WebAssembly` {#webassembly}

**Добавлено в версии: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект, который действует как пространство имен для всей функциональности W3C, связанной с [WebAssembly](https://webassembly.org/). См. [Сеть разработчиков Mozilla](https://developer.mozilla.org/en-US/docs/WebAssembly) для использования и совместимости.

## `WebSocket` {#websocket}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0 | Больше не является экспериментальным. |
| v22.0.0 | Больше не находится за флагом CLI `--experimental-websocket`. |
| v21.0.0, v20.10.0 | Добавлено в версии: v21.0.0, v20.10.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::

Совместимая с браузером реализация [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). Отключите этот API с помощью флага CLI [`--no-experimental-websocket`](/ru/nodejs/api/cli#--no-experimental-websocket).

## Класс: `WritableStream` {#class-writablestream}

**Добавлено в версии: v18.0.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Совместимая с браузером реализация [`WritableStream`](/ru/nodejs/api/webstreams#class-writablestream).

## Класс: `WritableStreamDefaultController` {#class-writablestreamdefaultcontroller}

**Добавлено в версии: v18.0.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Совместимая с браузером реализация [`WritableStreamDefaultController`](/ru/nodejs/api/webstreams#class-writablestreamdefaultcontroller).

## Класс: `WritableStreamDefaultWriter` {#class-writablestreamdefaultwriter}

**Добавлено в версии: v18.0.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально.
:::

Совместимая с браузером реализация [`WritableStreamDefaultWriter`](/ru/nodejs/api/webstreams#class-writablestreamdefaultwriter).

