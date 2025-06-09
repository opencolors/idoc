---
title: Канал диагностики Node.js
description: Модуль канала диагностики в Node.js предоставляет API для создания, публикации и подписки на именованные каналы диагностической информации, что позволяет лучше мониторить и отлаживать приложения.
head:
  - - meta
    - name: og:title
      content: Канал диагностики Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль канала диагностики в Node.js предоставляет API для создания, публикации и подписки на именованные каналы диагностической информации, что позволяет лучше мониторить и отлаживать приложения.
  - - meta
    - name: twitter:title
      content: Канал диагностики Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль канала диагностики в Node.js предоставляет API для создания, публикации и подписки на именованные каналы диагностической информации, что позволяет лучше мониторить и отлаживать приложения.
---


# Канал диагностики {#diagnostics-channel}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.2.0, v18.13.0 | diagnostics_channel теперь Stable. |
| v15.1.0, v14.17.0 | Добавлено в: v15.1.0, v14.17.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Stable
:::

**Исходный код:** [lib/diagnostics_channel.js](https://github.com/nodejs/node/blob/v23.5.0/lib/diagnostics_channel.js)

Модуль `node:diagnostics_channel` предоставляет API для создания именованных каналов для отправки произвольных данных сообщений в целях диагностики.

Доступ к нему можно получить с помощью:



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
```
:::

Предполагается, что разработчик модуля, желающий отправлять диагностические сообщения, создаст один или несколько каналов верхнего уровня для отправки сообщений через них. Каналы также можно получить во время выполнения, но это не рекомендуется из-за дополнительных накладных расходов, связанных с этим. Каналы можно экспортировать для удобства, но пока имя известно, его можно получить где угодно.

Если вы намереваетесь, чтобы ваш модуль создавал диагностические данные для потребления другими, рекомендуется включить документацию о том, какие именованные каналы используются, а также о форме данных сообщения. Имена каналов обычно должны включать имя модуля, чтобы избежать конфликтов с данными из других модулей.

## Публичный API {#public-api}

### Обзор {#overview}

Ниже приведен простой обзор публичного API.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

// Получить объект многоразового канала
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Получены данные
}

// Подписаться на канал
diagnostics_channel.subscribe('my-channel', onMessage);

// Проверить, есть ли у канала активный подписчик
if (channel.hasSubscribers) {
  // Опубликовать данные в канал
  channel.publish({
    some: 'data',
  });
}

// Отписаться от канала
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

// Получить объект многоразового канала
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Получены данные
}

// Подписаться на канал
diagnostics_channel.subscribe('my-channel', onMessage);

// Проверить, есть ли у канала активный подписчик
if (channel.hasSubscribers) {
  // Опубликовать данные в канал
  channel.publish({
    some: 'data',
  });
}

// Отписаться от канала
diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::


#### `diagnostics_channel.hasSubscribers(name)` {#diagnostics_channelhassubscribersname}

**Добавлено в: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя канала
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, есть ли активные подписчики

Проверяет, есть ли активные подписчики у канала с указанным именем. Это полезно, если сообщение, которое вы хотите отправить, может быть дорогостоящим в подготовке.

Этот API является необязательным, но полезным при попытке публиковать сообщения из очень чувствительного к производительности кода.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Есть подписчики, подготовка и публикация сообщения
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // Есть подписчики, подготовка и публикация сообщения
}
```
:::

#### `diagnostics_channel.channel(name)` {#diagnostics_channelchannelname}

**Добавлено в: v15.1.0, v14.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя канала
- Возвращает: [\<Channel\>](/ru/nodejs/api/diagnostics_channel#class-channel) Объект канала с указанным именем

Это основная точка входа для всех, кто хочет публиковать сообщения в именованный канал. Он создает объект канала, который оптимизирован для максимального снижения накладных расходов во время публикации.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```
:::

#### `diagnostics_channel.subscribe(name, onMessage)` {#diagnostics_channelsubscribename-onmessage}

**Добавлено в: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя канала
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Обработчик для получения сообщений канала
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Данные сообщения
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя канала
  
 

Регистрирует обработчик сообщений для подписки на этот канал. Этот обработчик сообщений будет запускаться синхронно всякий раз, когда в канал публикуется сообщение. Любые ошибки, возникшие в обработчике сообщений, вызовут событие [`'uncaughtException'`](/ru/nodejs/api/process#event-uncaughtexception).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Полученные данные
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Полученные данные
});
```
:::


#### `diagnostics_channel.unsubscribe(name, onMessage)` {#diagnostics_channelunsubscribename-onmessage}

**Добавлено в: v18.7.0, v16.17.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя канала
- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Предыдущий зарегистрированный обработчик для удаления
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если обработчик был найден, `false` в противном случае.

Удаляет обработчик сообщений, ранее зарегистрированный в этом канале с помощью [`diagnostics_channel.subscribe(name, onMessage)`](/ru/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Полученные данные
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Полученные данные
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```
:::

#### `diagnostics_channel.tracingChannel(nameOrChannels)` {#diagnostics_channeltracingchannelnameorchannels}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `nameOrChannels` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TracingChannel\>](/ru/nodejs/api/diagnostics_channel#class-tracingchannel) Имя канала или объект, содержащий все [TracingChannel Channels](/ru/nodejs/api/diagnostics_channel#tracingchannel-channels)
- Возвращает: [\<TracingChannel\>](/ru/nodejs/api/diagnostics_channel#class-tracingchannel) Коллекция каналов для трассировки

Создает обертку [`TracingChannel`](/ru/nodejs/api/diagnostics_channel#class-tracingchannel) для заданных [TracingChannel Channels](/ru/nodejs/api/diagnostics_channel#tracingchannel-channels). Если указано имя, соответствующие каналы трассировки будут созданы в форме `tracing:${name}:${eventType}`, где `eventType` соответствует типам [TracingChannel Channels](/ru/nodejs/api/diagnostics_channel#tracingchannel-channels).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// или...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// или...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```
:::


### Класс: `Channel` {#class-channel}

**Добавлено в: v15.1.0, v14.17.0**

Класс `Channel` представляет собой отдельный именованный канал в конвейере данных. Он используется для отслеживания подписчиков и публикации сообщений при наличии подписчиков. Он существует как отдельный объект, чтобы избежать поиска каналов во время публикации, обеспечивая очень высокую скорость публикации и позволяя интенсивно использовать канал с минимальными затратами. Каналы создаются с помощью [`diagnostics_channel.channel(name)`](/ru/nodejs/api/diagnostics_channel#diagnostics_channelchannelname), создание канала непосредственно с помощью `new Channel(name)` не поддерживается.

#### `channel.hasSubscribers` {#channelhassubscribers}

**Добавлено в: v15.1.0, v14.17.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Есть ли активные подписчики

Проверяет, есть ли активные подписчики у этого канала. Это полезно, если сообщение, которое вы хотите отправить, может быть дорогостоящим в подготовке.

Этот API является необязательным, но полезным при попытке публиковать сообщения из кода, очень чувствительного к производительности.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // Есть подписчики, подготовка и публикация сообщения
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // Есть подписчики, подготовка и публикация сообщения
}
```
:::

#### `channel.publish(message)` {#channelpublishmessage}

**Добавлено в: v15.1.0, v14.17.0**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Сообщение для отправки подписчикам канала

Публикует сообщение для любых подписчиков канала. Это будет запускать обработчики сообщений синхронно, поэтому они будут выполняться в том же контексте.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```
:::


#### `channel.subscribe(onMessage)` {#channelsubscribeonmessage}

**Добавлено в: v15.1.0, v14.17.0**

**Устарело начиная с: v18.7.0, v16.17.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`diagnostics_channel.subscribe(name, onMessage)`](/ru/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Обработчик для получения сообщений канала
    - `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Данные сообщения
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя канала
  
 

Регистрирует обработчик сообщений для подписки на этот канал. Этот обработчик сообщений будет запускаться синхронно всякий раз, когда сообщение публикуется в канале. Любые ошибки, возникающие в обработчике сообщений, будут вызывать [`'uncaughtException'`](/ru/nodejs/api/process#event-uncaughtexception).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Получены данные
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Получены данные
});
```
:::

#### `channel.unsubscribe(onMessage)` {#channelunsubscribeonmessage}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.7.0, v16.17.0 | Устарело начиная с: v18.7.0, v16.17.0 |
| v17.1.0, v16.14.0, v14.19.0 | Добавлено возвращаемое значение. Добавлено в каналы без подписчиков. |
| v15.1.0, v14.17.0 | Добавлено в: v15.1.0, v14.17.0 |
:::

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`diagnostics_channel.unsubscribe(name, onMessage)`](/ru/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage)
:::

- `onMessage` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ранее подписанный обработчик для удаления
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если обработчик был найден, `false` в противном случае.

Удаляет обработчик сообщений, ранее зарегистрированный в этом канале с помощью [`channel.subscribe(onMessage)`](/ru/nodejs/api/diagnostics_channel#channelsubscribeonmessage).



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Получены данные
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Получены данные
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```
:::


#### `channel.bindStore(store[, transform])` {#channelbindstorestore-transform}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `store` [\<AsyncLocalStorage\>](/ru/nodejs/api/async_context#class-asynclocalstorage) Хранилище, к которому привязываются данные контекста
- `transform` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Преобразование данных контекста перед установкой контекста хранилища

При вызове [`channel.runStores(context, ...)`](/ru/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) предоставленные данные контекста будут применены к любому хранилищу, привязанному к каналу. Если хранилище уже было привязано, предыдущая функция `transform` будет заменена новой. Функция `transform` может быть опущена, чтобы установить предоставленные данные контекста непосредственно в качестве контекста.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```
:::

#### `channel.unbindStore(store)` {#channelunbindstorestore}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `store` [\<AsyncLocalStorage\>](/ru/nodejs/api/async_context#class-asynclocalstorage) Хранилище для отвязки от канала.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если хранилище найдено, `false` в противном случае.

Удаляет обработчик сообщений, ранее зарегистрированный для этого канала с помощью [`channel.bindStore(store)`](/ru/nodejs/api/diagnostics_channel#channelbindstorestore-transform).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```
:::


#### `channel.runStores(context, fn[, thisArg[, ...args]])` {#channelrunstorescontext-fn-thisarg-args}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `context` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Сообщение для отправки подписчикам и привязки к хранилищам
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Обработчик для запуска в заданном контексте хранилища
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Получатель, который будет использоваться для вызова функции.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные аргументы для передачи в функцию.

Применяет данные ко всем экземплярам AsyncLocalStorage, привязанным к каналу, на время выполнения данной функции, а затем публикует их в канал в пределах области действия этих данных, применяемых к хранилищам.

Если функция преобразования была передана в [`channel.bindStore(store)`](/ru/nodejs/api/diagnostics_channel#channelbindstorestore-transform), она будет применена для преобразования данных сообщения, прежде чем они станут контекстным значением для хранилища. Предыдущий контекст хранилища доступен из функции преобразования в случаях, когда требуется связывание контекстов.

Контекст, примененный к хранилищу, должен быть доступен в любом асинхронном коде, который продолжает выполнение, начатое во время данной функции, однако возможны ситуации, в которых может произойти [потеря контекста](/ru/nodejs/api/async_context#troubleshooting-context-loss).

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```
:::


### Класс: `TracingChannel` {#class-tracingchannel}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Класс `TracingChannel` - это коллекция [каналов TracingChannel](/ru/nodejs/api/diagnostics_channel#tracingchannel-channels), которые вместе выражают единое отслеживаемое действие. Он используется для формализации и упрощения процесса создания событий для отслеживания потока приложения. [`diagnostics_channel.tracingChannel()`](/ru/nodejs/api/diagnostics_channel#diagnostics_channeltracingchannelnameorchannels) используется для создания `TracingChannel`. Как и в случае с `Channel`, рекомендуется создавать и повторно использовать один `TracingChannel` на верхнем уровне файла, а не создавать их динамически.

#### `tracingChannel.subscribe(subscribers)` {#tracingchannelsubscribesubscribers}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Набор подписчиков [каналов TracingChannel](/ru/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`start` event](/ru/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`end` event](/ru/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`asyncStart` event](/ru/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`asyncEnd` event](/ru/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`error` event](/ru/nodejs/api/diagnostics_channel#errorevent)
  
 

Вспомогательная функция для подписки коллекции функций на соответствующие каналы. Это то же самое, что вызов [`channel.subscribe(onMessage)`](/ru/nodejs/api/diagnostics_channel#channelsubscribeonmessage) для каждого канала по отдельности.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.unsubscribe(subscribers)` {#tracingchannelunsubscribesubscribers}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `subscribers` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Набор подписчиков [TracingChannel Channels](/ru/nodejs/api/diagnostics_channel#tracingchannel-channels)
    - `start` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`start` event](/ru/nodejs/api/diagnostics_channel#startevent)
    - `end` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`end` event](/ru/nodejs/api/diagnostics_channel#endevent)
    - `asyncStart` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`asyncStart` event](/ru/nodejs/api/diagnostics_channel#asyncstartevent)
    - `asyncEnd` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`asyncEnd` event](/ru/nodejs/api/diagnostics_channel#asyncendevent)
    - `error` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Подписчик на [`error` event](/ru/nodejs/api/diagnostics_channel#errorevent)
  
 
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если все обработчики были успешно отписаны, и `false` в противном случае.

Вспомогательная функция для отписки коллекции функций от соответствующих каналов. Это то же самое, что вызов [`channel.unsubscribe(onMessage)`](/ru/nodejs/api/diagnostics_channel#channelunsubscribeonmessage) для каждого канала по отдельности.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```
:::


#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracesyncfn-context-thisarg-args}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, вокруг которой нужно создать трассировку
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Общий объект для сопоставления событий
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Получатель, который будет использоваться для вызова функции
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные аргументы для передачи в функцию
- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Возвращаемое значение заданной функции

Трассировка синхронного вызова функции. Это всегда будет создавать событие [`start`](/ru/nodejs/api/diagnostics_channel#startevent) и событие [`end`](/ru/nodejs/api/diagnostics_channel#endevent) вокруг выполнения и может создавать событие [`error`](/ru/nodejs/api/diagnostics_channel#errorevent), если данная функция вызывает ошибку. Это запустит данную функцию, используя [`channel.runStores(context, ...)`](/ru/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) на канале `start`, что гарантирует, что все события должны иметь все связанные хранилища, установленные в соответствии с этим контекстом трассировки.

Чтобы обеспечить формирование только правильных графов трассировки, события будут публиковаться только в том случае, если подписчики присутствуют до начала трассировки. Подписки, которые добавляются после начала трассировки, не будут получать будущие события от этой трассировки, будут видны только будущие трассировки.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])` {#tracingchanneltracepromisefn-context-thisarg-args}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, возвращающая Promise, вокруг которой необходимо обернуть трассировку
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Общий объект для сопоставления событий трассировки
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Получатель, который будет использоваться для вызова функции
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные аргументы, передаваемые функции
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Связан с Promise, возвращенным заданной функцией

Трассировка вызова функции, возвращающей Promise. Это всегда будет генерировать событие [`start` event](/ru/nodejs/api/diagnostics_channel#startevent) и [`end` event](/ru/nodejs/api/diagnostics_channel#endevent) вокруг синхронной части выполнения функции, и будет генерировать событие [`asyncStart` event](/ru/nodejs/api/diagnostics_channel#asyncstartevent) и [`asyncEnd` event](/ru/nodejs/api/diagnostics_channel#asyncendevent), когда будет достигнуто продолжение Promise. Это также может генерировать событие [`error` event](/ru/nodejs/api/diagnostics_channel#errorevent), если данная функция выдает ошибку или возвращенный Promise отклоняется. Это запустит данную функцию с помощью [`channel.runStores(context, ...)`](/ru/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) на канале `start`, что гарантирует, что все события будут иметь все связанные хранилища, настроенные в соответствии с этим контекстом трассировки.

Чтобы обеспечить формирование только правильных графов трассировки, события будут публиковаться только в том случае, если подписчики присутствуют до начала трассировки. Подписки, добавленные после начала трассировки, не будут получать будущие события от этой трассировки, будут видны только будущие трассировки.



::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```
:::


#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])` {#tracingchanneltracecallbackfn-position-context-thisarg-args}

**Добавлено в: v19.9.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) обратный вызов, использующий функцию для оборачивания трассировки
- `position` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Позиция ожидаемого обратного вызова с нулевым индексом (по умолчанию последний аргумент, если передано `undefined`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Общий объект для корреляции событий трассировки (по умолчанию `{}` если передано `undefined`)
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Получатель, который будет использоваться для вызова функции
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) аргументы для передачи функции (должны включать обратный вызов)
- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Возвращаемое значение заданной функции

Трассировка вызова функции, получающей обратный вызов. Ожидается, что обратный вызов будет следовать соглашению об ошибке как первом аргументе, которое обычно используется. Это всегда будет производить [`start` событие](/ru/nodejs/api/diagnostics_channel#startevent) и [`end` событие](/ru/nodejs/api/diagnostics_channel#endevent) вокруг синхронной части выполнения функции, и будет производить [`asyncStart` событие](/ru/nodejs/api/diagnostics_channel#asyncstartevent) и [`asyncEnd` событие](/ru/nodejs/api/diagnostics_channel#asyncendevent) вокруг выполнения обратного вызова. Он также может генерировать [`error` событие](/ru/nodejs/api/diagnostics_channel#errorevent), если заданная функция выдает исключение или установлен первый аргумент, переданный обратному вызову. Это запустит заданную функцию, используя [`channel.runStores(context, ...)`](/ru/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args) в канале `start`, что гарантирует, что все события должны иметь все привязанные хранилища, настроенные в соответствии с этим контекстом трассировки.

Чтобы гарантировать формирование только правильных графов трассировки, события будут публиковаться только в том случае, если подписчики присутствуют до начала трассировки. Подписки, добавленные после начала трассировки, не будут получать будущие события от этой трассировки, будут видны только будущие трассировки.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```
:::

Обратный вызов также будет запущен с помощью [`channel.runStores(context, ...)`](/ru/nodejs/api/diagnostics_channel#channelrunstorescontext-fn-thisarg-args), что в некоторых случаях позволяет восстановить потерю контекста.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// Канал запуска устанавливает начальные данные хранилища во что-то
// и сохраняет это значение данных хранилища в объекте контекста трассировки
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Затем asyncStart может восстановить из этих данных, которые он сохранил ранее
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// Канал запуска устанавливает начальные данные хранилища во что-то
// и сохраняет это значение данных хранилища в объекте контекста трассировки
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Затем asyncStart может восстановить из этих данных, которые он сохранил ранее
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```
:::


#### `tracingChannel.hasSubscribers` {#tracingchannelhassubscribers}

**Добавлено в: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если у любого из отдельных каналов есть подписчик, `false` в противном случае.

Это вспомогательный метод, доступный в экземпляре [`TracingChannel`](/ru/nodejs/api/diagnostics_channel#class-tracingchannel) для проверки, есть ли у какого-либо из [Каналов TracingChannel](/ru/nodejs/api/diagnostics_channel#tracingchannel-channels) подписчики. Возвращается `true`, если у любого из них есть хотя бы один подписчик, в противном случае возвращается `false`.

::: code-group
```js [ESM]
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Сделать что-то
}
```

```js [CJS]
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Сделать что-то
}
```
:::

### Каналы TracingChannel {#tracingchannel-channels}

TracingChannel - это коллекция нескольких diagnostics_channels, представляющих определенные точки в жизненном цикле выполнения одного отслеживаемого действия. Поведение разделено на пять diagnostics_channels, состоящих из `start`, `end`, `asyncStart`, `asyncEnd` и `error`. Одно отслеживаемое действие будет использовать один и тот же объект события между всеми событиями, это может быть полезно для управления корреляцией через weakmap.

Эти объекты событий будут расширены значениями `result` или `error`, когда задача "завершится". В случае синхронной задачи `result` будет возвращаемым значением, а `error` - всем, что было выброшено из функции. В случае асинхронных функций, основанных на обратных вызовах, `result` будет вторым аргументом обратного вызова, а `error` будет либо выброшенной ошибкой, видимой в событии `end`, либо первым аргументом обратного вызова в любом из событий `asyncStart` или `asyncEnd`.

Чтобы обеспечить формирование только правильных графов трассировки, события следует публиковать только в том случае, если подписчики присутствуют до начала трассировки. Подписки, добавленные после начала трассировки, не должны получать будущие события из этой трассировки, будут видны только будущие трассировки.

Каналы трассировки должны следовать шаблону именования:

- `tracing:module.class.method:start` или `tracing:module.function:start`
- `tracing:module.class.method:end` или `tracing:module.function:end`
- `tracing:module.class.method:asyncStart` или `tracing:module.function:asyncStart`
- `tracing:module.class.method:asyncEnd` или `tracing:module.function:asyncEnd`
- `tracing:module.class.method:error` или `tracing:module.function:error`


#### `start(event)` {#startevent}

- Имя: `tracing:${name}:start`

Событие `start` представляет собой момент вызова функции. В этот момент данные события могут содержать аргументы функции или что-либо еще, доступное в самом начале выполнения функции.

#### `end(event)` {#endevent}

- Имя: `tracing:${name}:end`

Событие `end` представляет собой момент, когда вызов функции возвращает значение. В случае асинхронной функции это происходит, когда возвращается promise, а не когда сама функция делает внутренний оператор возврата. В этот момент, если отслеживаемая функция была синхронной, поле `result` будет установлено в возвращаемое значение функции. В качестве альтернативы может присутствовать поле `error`, представляющее любые возникшие ошибки.

Рекомендуется прослушивать конкретно событие `error` для отслеживания ошибок, поскольку отслеживаемое действие может вызвать несколько ошибок. Например, асинхронная задача, которая не выполняется, может быть запущена внутри до синхронной части задачи, а затем выдать ошибку.

#### `asyncStart(event)` {#asyncstartevent}

- Имя: `tracing:${name}:asyncStart`

Событие `asyncStart` представляет собой достижение обратного вызова или продолжения отслеживаемой функции. В этот момент могут быть доступны такие вещи, как аргументы обратного вызова, или что-либо еще, выражающее "результат" действия.

Для функций на основе обратных вызовов первый аргумент обратного вызова будет присвоен полю `error`, если он не `undefined` или `null`, а второй аргумент будет присвоен полю `result`.

Для promises аргумент пути `resolve` будет присвоен `result`, а аргумент пути `reject` будет присвоен `error`.

Рекомендуется прослушивать конкретно событие `error` для отслеживания ошибок, поскольку отслеживаемое действие может вызвать несколько ошибок. Например, асинхронная задача, которая не выполняется, может быть запущена внутри до синхронной части задачи, а затем выдать ошибку.

#### `asyncEnd(event)` {#asyncendevent}

- Имя: `tracing:${name}:asyncEnd`

Событие `asyncEnd` представляет собой возврат обратного вызова асинхронной функции. Маловероятно, что данные события изменятся после события `asyncStart`, однако может быть полезно увидеть момент завершения обратного вызова.


#### `error(event)` {#errorevent}

- Имя: `tracing:${name}:error`

Событие `error` представляет любую ошибку, возникшую в трассируемой функции синхронно или асинхронно. Если в синхронной части трассируемой функции возникает ошибка, она присваивается полю `error` события и запускается событие `error`. Если ошибка получена асинхронно через обратный вызов или отклонение Promise, она также присваивается полю `error` события и запускает событие `error`.

Вполне возможно, что один вызов трассируемой функции может вызвать ошибки несколько раз, поэтому это следует учитывать при использовании этого события. Например, если внутренняя асинхронная задача завершится неудачей, а затем синхронная часть функции выдаст ошибку, будут испущены два события `error`: одно для синхронной ошибки, а другое для асинхронной.

### Встроенные каналы {#built-in-channels}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

Хотя API diagnostics_channel теперь считается стабильным, встроенные каналы в настоящее время таковыми не являются. Каждый канал должен быть объявлен стабильным независимо.

#### HTTP {#http}

`http.client.request.created`

- `request` [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)

Испускается, когда клиент создает объект запроса. В отличие от `http.client.request.start`, это событие испускается до отправки запроса.

`http.client.request.start`

- `request` [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)

Испускается, когда клиент начинает запрос.

`http.client.request.error`

- `request` [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Испускается, когда во время запроса клиента происходит ошибка.

`http.client.response.finish`

- `request` [\<http.ClientRequest\>](/ru/nodejs/api/http#class-httpclientrequest)
- `response` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)

Испускается, когда клиент получает ответ.

`http.server.request.start`

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/ru/nodejs/api/http#class-httpserver)

Испускается, когда сервер получает запрос.

`http.server.response.created`

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)

Испускается, когда сервер создает ответ. Событие испускается до отправки ответа.

`http.server.response.finish`

- `request` [\<http.IncomingMessage\>](/ru/nodejs/api/http#class-httpincomingmessage)
- `response` [\<http.ServerResponse\>](/ru/nodejs/api/http#class-httpserverresponse)
- `socket` [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)
- `server` [\<http.Server\>](/ru/nodejs/api/http#class-httpserver)

Испускается, когда сервер отправляет ответ.


#### Модули {#modules}

`module.require.start`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащий следующие свойства:
    - `id` - Аргумент, переданный в `require()`. Имя модуля.
    - `parentFilename` - Имя модуля, который попытался выполнить `require(id)`.
  
 

Выпускается при выполнении `require()`. См. событие [`start`](/ru/nodejs/api/diagnostics_channel#startevent).

`module.require.end`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащий следующие свойства:
    - `id` - Аргумент, переданный в `require()`. Имя модуля.
    - `parentFilename` - Имя модуля, который попытался выполнить `require(id)`.
  
 

Выпускается, когда вызов `require()` возвращает значение. См. событие [`end`](/ru/nodejs/api/diagnostics_channel#endevent).

`module.require.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащий следующие свойства:
    - `id` - Аргумент, переданный в `require()`. Имя модуля.
    - `parentFilename` - Имя модуля, который попытался выполнить `require(id)`.
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Выпускается, когда `require()` выдаёт ошибку. См. событие [`error`](/ru/nodejs/api/diagnostics_channel#errorevent).

`module.import.asyncStart`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащий следующие свойства:
    - `id` - Аргумент, переданный в `import()`. Имя модуля.
    - `parentURL` - URL-объект модуля, который попытался выполнить `import(id)`.
  
 

Выпускается при вызове `import()`. См. событие [`asyncStart`](/ru/nodejs/api/diagnostics_channel#asyncstartevent).

`module.import.asyncEnd`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащий следующие свойства:
    - `id` - Аргумент, переданный в `import()`. Имя модуля.
    - `parentURL` - URL-объект модуля, который попытался выполнить `import(id)`.
  
 

Выпускается при завершении `import()`. См. событие [`asyncEnd`](/ru/nodejs/api/diagnostics_channel#asyncendevent).

`module.import.error`

- `event` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), содержащий следующие свойства:
    - `id` - Аргумент, переданный в `import()`. Имя модуля.
    - `parentURL` - URL-объект модуля, который попытался выполнить `import(id)`.
  
 
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Выпускается, когда `import()` выдаёт ошибку. См. событие [`error`](/ru/nodejs/api/diagnostics_channel#errorevent).


#### NET {#net}

`net.client.socket`

- `socket` [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Событие возникает, когда создается новый TCP или pipe клиентский сокет.

`net.server.socket`

- `socket` [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Событие возникает, когда получено новое TCP или pipe соединение.

`tracing:net.server.listen:asyncStart`

- `server` [\<net.Server\>](/ru/nodejs/api/net#class-netserver)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Событие возникает при вызове [`net.Server.listen()`](/ru/nodejs/api/net#serverlisten), до того как порт или pipe будут фактически настроены.

`tracing:net.server.listen:asyncEnd`

- `server` [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Событие возникает, когда [`net.Server.listen()`](/ru/nodejs/api/net#serverlisten) завершил работу и, таким образом, сервер готов принимать соединения.

`tracing:net.server.listen:error`

- `server` [\<net.Server\>](/ru/nodejs/api/net#class-netserver)
- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Событие возникает, когда [`net.Server.listen()`](/ru/nodejs/api/net#serverlisten) возвращает ошибку.

#### UDP {#udp}

`udp.socket`

- `socket` [\<dgram.Socket\>](/ru/nodejs/api/dgram#class-dgramsocket)

Событие возникает, когда создается новый UDP сокет.

#### Process {#process}

**Добавлено в: v16.18.0**

`child_process`

- `process` [\<ChildProcess\>](/ru/nodejs/api/child_process#class-childprocess)

Событие возникает, когда создается новый процесс.

#### Worker Thread {#worker-thread}

**Добавлено в: v16.18.0**

`worker_threads`

- `worker` [`Worker`](/ru/nodejs/api/worker_threads#class-worker)

Событие возникает, когда создается новый поток.

