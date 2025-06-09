---
title: Документация модуля Inspector в Node.js
description: Модуль Inspector в Node.js предоставляет API для взаимодействия с инспектором V8, позволяя разработчикам отлаживать приложения Node.js, подключаясь к протоколу инспектора.
head:
  - - meta
    - name: og:title
      content: Документация модуля Inspector в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль Inspector в Node.js предоставляет API для взаимодействия с инспектором V8, позволяя разработчикам отлаживать приложения Node.js, подключаясь к протоколу инспектора.
  - - meta
    - name: twitter:title
      content: Документация модуля Inspector в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль Inspector в Node.js предоставляет API для взаимодействия с инспектором V8, позволяя разработчикам отлаживать приложения Node.js, подключаясь к протоколу инспектора.
---


# Inspector {#inspector}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/inspector.js](https://github.com/nodejs/node/blob/v23.5.0/lib/inspector.js)

Модуль `node:inspector` предоставляет API для взаимодействия с инспектором V8.

Доступ к нему можно получить, используя:

::: code-group
```js [ESM]
import * as inspector from 'node:inspector/promises';
```

```js [CJS]
const inspector = require('node:inspector/promises');
```
:::

или

::: code-group
```js [ESM]
import * as inspector from 'node:inspector';
```

```js [CJS]
const inspector = require('node:inspector');
```
:::

## Promises API {#promises-api}

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

**Добавлено в: v19.0.0**

### Class: `inspector.Session` {#class-inspectorsession}

- Наследует: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

`inspector.Session` используется для отправки сообщений в бэкенд инспектора V8 и получения ответов на сообщения и уведомлений.

#### `new inspector.Session()` {#new-inspectorsession}

**Добавлено в: v8.0.0**

Создает новый экземпляр класса `inspector.Session`. Сеанс инспектора должен быть подключен через [`session.connect()`](/ru/nodejs/api/inspector#sessionconnect), прежде чем сообщения можно будет отправлять в бэкенд инспектора.

При использовании `Session` объект, выводимый API консоли, не будет освобожден, если мы не выполним вручную команду `Runtime.DiscardConsoleEntries`.

#### Event: `'inspectorNotification'` {#event-inspectornotification}

**Добавлено в: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект сообщения уведомления

Выдается при получении любого уведомления от инспектора V8.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
Также можно подписаться только на уведомления с определенным методом:


#### Событие: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;}

**Добавлено в: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект сообщения уведомления

Генерируется, когда получено уведомление инспектора, у которого поле метода установлено в значение `\<inspector-protocol-method\>`.

Следующий фрагмент устанавливает прослушиватель на событие [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) и выводит причину приостановки программы всякий раз, когда выполнение программы приостанавливается (например, из-за точек останова):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect}

**Добавлено в: v8.0.0**

Подключает сеанс к инспекторскому бэкэнду.

#### `session.connectToMainThread()` {#sessionconnecttomainthread}

**Добавлено в: v12.11.0**

Подключает сеанс к бэкэнду инспектора основного потока. Исключение будет выброшено, если этот API не был вызван в потоке Worker.

#### `session.disconnect()` {#sessiondisconnect}

**Добавлено в: v8.0.0**

Немедленно закрывает сеанс. Все ожидающие обратные вызовы сообщений будут вызваны с ошибкой. Чтобы иметь возможность снова отправлять сообщения, необходимо вызвать [`session.connect()`](/ru/nodejs/api/inspector#sessionconnect). Повторно подключенный сеанс потеряет все состояние инспектора, такое как включенные агенты или настроенные точки останова.

#### `session.post(method[, params])` {#sessionpostmethod-params}

**Добавлено в: v19.0.0**

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Отправляет сообщение в инспекторский бэкэнд.

```js [ESM]
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```
Последняя версия протокола инспектора V8 опубликована в [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

Инспектор Node.js поддерживает все домены протокола Chrome DevTools, объявленные V8. Домен протокола Chrome DevTools предоставляет интерфейс для взаимодействия с одним из агентов времени выполнения, используемых для проверки состояния приложения и прослушивания событий времени выполнения.


#### Пример использования {#example-usage}

Помимо отладчика, через протокол DevTools доступны различные V8 Profiler.

##### CPU profiler {#cpu-profiler}

Вот пример того, как использовать [CPU Profiler](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Invoke business logic under measurement here...

// some time later...
const { profile } = await session.post('Profiler.stop');

// Write profile to disk, upload, etc.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```
##### Heap profiler {#heap-profiler}

Вот пример того, как использовать [Heap Profiler](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```
## Callback API {#callback-api}

### Class: `inspector.Session` {#class-inspectorsession_1}

- Extends: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

`inspector.Session` используется для отправки сообщений во внутреннюю часть V8 inspector и получения ответов на сообщения и уведомлений.

#### `new inspector.Session()` {#new-inspectorsession_1}

**Added in: v8.0.0**

Создает новый экземпляр класса `inspector.Session`. Сессия inspector должна быть подключена через [`session.connect()`](/ru/nodejs/api/inspector#sessionconnect) перед тем, как сообщения могут быть отправлены во внутреннюю часть inspector.

При использовании `Session` объект, выводимый API консоли, не будет освобожден, если мы вручную не выполним команду `Runtime.DiscardConsoleEntries`.


#### Event: `'inspectorNotification'` {#event-inspectornotification_1}

**Добавлено в: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект уведомления

Испускается при получении любого уведомления от V8 Inspector.

```js [ESM]
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```
Также возможно подписаться только на уведомления с определенным методом:

#### Event: `&lt;inspector-protocol-method&gt;`; {#event-&lt;inspector-protocol-method&gt;;_1}

**Добавлено в: v8.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект уведомления

Испускается при получении уведомления inspector, поле method которого установлено в значение `\<inspector-protocol-method\>`.

Следующий фрагмент кода устанавливает прослушиватель на событие [`'Debugger.paused'`](https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused) и выводит причину приостановки программы всякий раз, когда выполнение программы приостанавливается (например, через точки останова):

```js [ESM]
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```
#### `session.connect()` {#sessionconnect_1}

**Добавлено в: v8.0.0**

Подключает сессию к бэкэнду inspector.

#### `session.connectToMainThread()` {#sessionconnecttomainthread_1}

**Добавлено в: v12.11.0**

Подключает сессию к бэкэнду inspector основного потока. Будет выброшено исключение, если этот API не был вызван в Worker потоке.

#### `session.disconnect()` {#sessiondisconnect_1}

**Добавлено в: v8.0.0**

Немедленно закрывает сессию. Все ожидающие обратные вызовы сообщений будут вызваны с ошибкой. Необходимо вызвать [`session.connect()`](/ru/nodejs/api/inspector#sessionconnect), чтобы снова отправлять сообщения. Повторно подключенная сессия потеряет все состояния inspector, такие как включенные агенты или настроенные точки останова.

#### `session.post(method[, params][, callback])` {#sessionpostmethod-params-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v8.0.0 | Добавлено в: v8.0.0 |
:::

- `method` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Отправляет сообщение в бэкэнд inspector. `callback` будет уведомлен о получении ответа. `callback` - это функция, которая принимает два необязательных аргумента: error и message-specific result.

```js [ESM]
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```
Последняя версия протокола V8 inspector опубликована в [Chrome DevTools Protocol Viewer](https://chromedevtools.github.io/devtools-protocol/v8/).

Node.js inspector поддерживает все домены Chrome DevTools Protocol, объявленные V8. Домен Chrome DevTools Protocol предоставляет интерфейс для взаимодействия с одним из агентов среды выполнения, используемых для проверки состояния приложения и прослушивания событий среды выполнения.

Вы не можете установить `reportProgress` в `true` при отправке команды `HeapProfiler.takeHeapSnapshot` или `HeapProfiler.stopTrackingHeapObjects` в V8.


#### Пример использования {#example-usage_1}

Помимо отладчика, через протокол DevTools доступны различные профайлеры V8.

##### Профайлер ЦП {#cpu-profiler_1}

Вот пример использования [Профайлера ЦП](https://chromedevtools.github.io/devtools-protocol/v8/Profiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Вызовите бизнес-логику под измерением здесь...

    // некоторое время спустя...
    session.post('Profiler.stop', (err, { profile }) => {
      // Запишите профиль на диск, загрузите и т.д.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```
##### Профайлер кучи {#heap-profiler_1}

Вот пример использования [Профайлера кучи](https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler):

```js [ESM]
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```
## Общие объекты {#common-objects}

### `inspector.close()` {#inspectorclose}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.10.0 | API предоставлен в worker threads. |
| v9.0.0 | Добавлено в: v9.0.0 |
:::

Пытается закрыть все оставшиеся соединения, блокируя цикл событий до тех пор, пока все не будут закрыты. После закрытия всех соединений деактивирует инспектор.

### `inspector.console` {#inspectorconsole}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект для отправки сообщений в удаленную консоль инспектора.

```js [ESM]
require('node:inspector').console.log('a message');
```
Консоль инспектора не имеет паритета API с консолью Node.js.


### `inspector.open([port[, host[, wait]]])` {#inspectoropenport-host-wait}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.6.0 | `inspector.open()` теперь возвращает объект `Disposable`. |
:::

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт для прослушивания подключений инспектора. Необязательный. **По умолчанию:** то, что было указано в CLI.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Хост для прослушивания подключений инспектора. Необязательный. **По умолчанию:** то, что было указано в CLI.
- `wait` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Блокировать, пока клиент не подключится. Необязательный. **По умолчанию:** `false`.
- Возвращает: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Disposable, который вызывает [`inspector.close()`](/ru/nodejs/api/inspector#inspectorclose).

Активировать инспектор на хосте и порту. Эквивалентно `node --inspect=[[host:]port]`, но может быть сделано программно после запуска node.

Если wait имеет значение `true`, будет блокироваться, пока клиент не подключится к порту инспектирования и управление потоком не будет передано клиенту отладчика.

См. [предупреждение о безопасности](/ru/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) относительно использования параметра `host`.

### `inspector.url()` {#inspectorurl}

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Возвращает URL активного инспектора или `undefined`, если такового нет.

```bash [BASH]
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/en/docs/inspector
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/en/docs/inspector
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()` {#inspectorwaitfordebugger}

**Добавлено в версии: v12.7.0**

Блокирует выполнение до тех пор, пока клиент (существующий или подключенный позже) не отправит команду `Runtime.runIfWaitingForDebugger`.

Исключение будет выброшено, если нет активного inspector.

## Интеграция с DevTools {#integration-with-devtools}

Модуль `node:inspector` предоставляет API для интеграции с инструментами разработчика, поддерживающими Chrome DevTools Protocol. DevTools интерфейсы, подключенные к работающему экземпляру Node.js, могут перехватывать события протокола, излучаемые экземпляром, и отображать их для облегчения отладки. Следующие методы транслируют событие протокола всем подключенным интерфейсам. `params`, переданные методам, могут быть необязательными, в зависимости от протокола.

```js [ESM]
// Будет вызвано событие `Network.requestWillBeSent`.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```
### `inspector.Network.requestWillBeSent([params])` {#inspectornetworkrequestwillbesentparams}

**Добавлено в версии: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Эта функция доступна только при включенном флаге `--experimental-network-inspection`.

Транслирует событие `Network.requestWillBeSent` подключенным интерфейсам. Это событие указывает на то, что приложение собирается отправить HTTP-запрос.

### `inspector.Network.responseReceived([params])` {#inspectornetworkresponsereceivedparams}

**Добавлено в версии: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Эта функция доступна только при включенном флаге `--experimental-network-inspection`.

Транслирует событие `Network.responseReceived` подключенным интерфейсам. Это событие указывает на то, что HTTP-ответ доступен.


### `inspector.Network.loadingFinished([params])` {#inspectornetworkloadingfinishedparams}

**Добавлено в: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Эта функция доступна только при включенном флаге `--experimental-network-inspection`.

Широковещательно передает событие `Network.loadingFinished` подключенным интерфейсам. Это событие указывает на завершение загрузки HTTP-запроса.

### `inspector.Network.loadingFailed([params])` {#inspectornetworkloadingfailedparams}

**Добавлено в: v22.7.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Эта функция доступна только при включенном флаге `--experimental-network-inspection`.

Широковещательно передает событие `Network.loadingFailed` подключенным интерфейсам. Это событие указывает на неудачную загрузку HTTP-запроса.

## Поддержка точек останова {#support-of-breakpoints}

Протокол Chrome DevTools [`Debugger` domain](https://chromedevtools.github.io/devtools-protocol/v8/Debugger) позволяет `inspector.Session` подключаться к программе и устанавливать точки останова для пошагового выполнения кода.

Однако следует избегать установки точек останова с помощью `inspector.Session` в том же потоке, который подключен через [`session.connect()`](/ru/nodejs/api/inspector#sessionconnect), поскольку подключаемая и приостанавливаемая программа и есть сам отладчик. Вместо этого попробуйте подключиться к основному потоку через [`session.connectToMainThread()`](/ru/nodejs/api/inspector#sessionconnecttomainthread) и установить точки останова в рабочем потоке, или подключиться к программе [Debugger](/ru/nodejs/api/debugger) через соединение WebSocket.

