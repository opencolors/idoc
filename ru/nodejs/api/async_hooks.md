---
title: Документация Node.js - Асинхронные хуки
description: Изучите API асинхронных хуков в Node.js, который предоставляет способ отслеживания жизненного цикла асинхронных ресурсов в приложениях Node.js.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Асинхронные хуки | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Изучите API асинхронных хуков в Node.js, который предоставляет способ отслеживания жизненного цикла асинхронных ресурсов в приложениях Node.js.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Асинхронные хуки | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Изучите API асинхронных хуков в Node.js, который предоставляет способ отслеживания жизненного цикла асинхронных ресурсов в приложениях Node.js.
---


# Асинхронные хуки {#async-hooks}

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный. Пожалуйста, откажитесь от этого API, если это возможно. Мы не рекомендуем использовать API [`createHook`](/ru/nodejs/api/async_hooks#async_hookscreatehookcallbacks), [`AsyncHook`](/ru/nodejs/api/async_hooks#class-asynchook) и [`executionAsyncResource`](/ru/nodejs/api/async_hooks#async_hooksexecutionasyncresource), поскольку они имеют проблемы с удобством использования, риски безопасности и влияние на производительность. Случаи использования отслеживания асинхронного контекста лучше обслуживаются стабильным API [`AsyncLocalStorage`](/ru/nodejs/api/async_context#class-asynclocalstorage). Если у вас есть вариант использования `createHook`, `AsyncHook` или `executionAsyncResource`, выходящий за рамки потребности отслеживания контекста, решаемой с помощью [`AsyncLocalStorage`](/ru/nodejs/api/async_context#class-asynclocalstorage), или диагностических данных, предоставляемых в настоящее время [Каналом диагностики](/ru/nodejs/api/diagnostics_channel), пожалуйста, откройте проблему по адресу [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues), описав свой вариант использования, чтобы мы могли создать более целенаправленный API.
:::

**Исходный код:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

Мы настоятельно не рекомендуем использовать API `async_hooks`. Другие API, которые могут охватить большинство вариантов его использования, включают:

- [`AsyncLocalStorage`](/ru/nodejs/api/async_context#class-asynclocalstorage) отслеживает асинхронный контекст
- [`process.getActiveResourcesInfo()`](/ru/nodejs/api/process#processgetactiveresourcesinfo) отслеживает активные ресурсы

Модуль `node:async_hooks` предоставляет API для отслеживания асинхронных ресурсов. Доступ к нему можно получить с помощью:

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
```

```js [CJS]
const async_hooks = require('node:async_hooks');
```
:::

## Терминология {#terminology}

Асинхронный ресурс представляет собой объект со связанным обратным вызовом. Этот обратный вызов может вызываться несколько раз, например, событие `'connection'` в `net.createServer()`, или только один раз, как в `fs.open()`. Ресурс также может быть закрыт до вызова обратного вызова. `AsyncHook` явно не различает эти разные случаи, но представляет их как абстрактную концепцию, которой является ресурс.

Если используются [`Worker`](/ru/nodejs/api/worker_threads#class-worker), каждый поток имеет независимый интерфейс `async_hooks`, и каждый поток будет использовать новый набор асинхронных идентификаторов.


## Обзор {#overview}

Ниже представлен простой обзор публичного API.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';

// Возвращает ID текущего контекста выполнения.
const eid = async_hooks.executionAsyncId();

// Возвращает ID обработчика, ответственного за запуск обратного вызова
// текущей области выполнения.
const tid = async_hooks.triggerAsyncId();

// Создает новый экземпляр AsyncHook. Все эти обратные вызовы необязательны.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Разрешает вызов обратных вызовов этого экземпляра AsyncHook. Это не является неявным
// действием после запуска конструктора и должно быть запущено явно, чтобы начать
// выполнение обратных вызовов.
asyncHook.enable();

// Отключает прослушивание новых асинхронных событий.
asyncHook.disable();

//
// Ниже приведены обратные вызовы, которые можно передать в createHook().
//

// init() вызывается во время конструирования объекта. Ресурс, возможно, не завершил
// конструирование, когда выполняется этот обратный вызов. Следовательно, все поля
// ресурса, на который ссылается "asyncId", возможно, не были заполнены.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() вызывается непосредственно перед вызовом обратного вызова ресурса. Он может быть
// вызван 0-N раз для обработчиков (таких как TCPWrap) и будет вызван ровно 1
// раз для запросов (таких как FSReqCallback).
function before(asyncId) { }

// after() вызывается сразу после завершения обратного вызова ресурса.
function after(asyncId) { }

// destroy() вызывается при уничтожении ресурса.
function destroy(asyncId) { }

// promiseResolve() вызывается только для ресурсов promise, когда
// функция resolve(), переданная конструктору Promise, вызывается
// (непосредственно или другими способами разрешения promise).
function promiseResolve(asyncId) { }
```

```js [CJS]
const async_hooks = require('node:async_hooks');

// Возвращает ID текущего контекста выполнения.
const eid = async_hooks.executionAsyncId();

// Возвращает ID обработчика, ответственного за запуск обратного вызова
// текущей области выполнения.
const tid = async_hooks.triggerAsyncId();

// Создает новый экземпляр AsyncHook. Все эти обратные вызовы необязательны.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Разрешает вызов обратных вызовов этого экземпляра AsyncHook. Это не является неявным
// действием после запуска конструктора и должно быть запущено явно, чтобы начать
// выполнение обратных вызовов.
asyncHook.enable();

// Отключает прослушивание новых асинхронных событий.
asyncHook.disable();

//
// Ниже приведены обратные вызовы, которые можно передать в createHook().
//

// init() вызывается во время конструирования объекта. Ресурс, возможно, не завершил
// конструирование, когда выполняется этот обратный вызов. Следовательно, все поля
// ресурса, на который ссылается "asyncId", возможно, не были заполнены.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() вызывается непосредственно перед вызовом обратного вызова ресурса. Он может быть
// вызван 0-N раз для обработчиков (таких как TCPWrap) и будет вызван ровно 1
// раз для запросов (таких как FSReqCallback).
function before(asyncId) { }

// after() вызывается сразу после завершения обратного вызова ресурса.
function after(asyncId) { }

// destroy() вызывается при уничтожении ресурса.
function destroy(asyncId) { }

// promiseResolve() вызывается только для ресурсов promise, когда
// функция resolve(), переданная конструктору Promise, вызывается
// (непосредственно или другими способами разрешения promise).
function promiseResolve(asyncId) { }
```
:::

## `async_hooks.createHook(callbacks)` {#async_hookscreatehookcallbacks}

**Добавлено в версии: v8.1.0**

- `callbacks` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Обратные вызовы Hook](/ru/nodejs/api/async_hooks#hook-callbacks) для регистрации
    - `init` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`init` обратный вызов](/ru/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
    - `before` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`before` обратный вызов](/ru/nodejs/api/async_hooks#beforeasyncid).
    - `after` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`after` обратный вызов](/ru/nodejs/api/async_hooks#afterasyncid).
    - `destroy` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`destroy` обратный вызов](/ru/nodejs/api/async_hooks#destroyasyncid).
    - `promiseResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) [`promiseResolve` обратный вызов](/ru/nodejs/api/async_hooks#promiseresolveasyncid).
  
 
- Возвращает: [\<AsyncHook\>](/ru/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Экземпляр, используемый для отключения и включения хуков

Регистрирует функции, которые будут вызываться для различных событий жизненного цикла каждой асинхронной операции.

Обратные вызовы `init()`/`before()`/`after()`/`destroy()` вызываются для соответствующего асинхронного события в течение жизненного цикла ресурса.

Все обратные вызовы необязательны. Например, если нужно отслеживать только очистку ресурсов, то нужно передать только обратный вызов `destroy`. Подробности обо всех функциях, которые можно передать в `callbacks`, находятся в разделе [Обратные вызовы Hook](/ru/nodejs/api/async_hooks#hook-callbacks).

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```
:::

Обратные вызовы будут наследоваться через цепочку прототипов:

```js [ESM]
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```
Поскольку промисы являются асинхронными ресурсами, жизненный цикл которых отслеживается с помощью механизма асинхронных хуков, обратные вызовы `init()`, `before()`, `after()` и `destroy()` *не должны* быть асинхронными функциями, возвращающими промисы.


### Обработка ошибок {#error-handling}

Если какие-либо обратные вызовы `AsyncHook` выдают исключение, приложение выведет трассировку стека и завершит работу. Путь выхода соответствует пути необработанного исключения, но все прослушиватели `'uncaughtException'` удаляются, что приводит к принудительному завершению процесса. Обратные вызовы `'exit'` все равно будут вызываться, если приложение не запущено с `--abort-on-uncaught-exception`, в этом случае будет выведена трассировка стека и приложение завершит работу, оставив файл core.

Причина такого поведения при обработке ошибок заключается в том, что эти обратные вызовы выполняются в потенциально нестабильные моменты жизненного цикла объекта, например, во время конструирования и уничтожения класса. Из-за этого считается необходимым быстро завершить процесс, чтобы предотвратить непреднамеренный сбой в будущем. Это может быть изменено в будущем, если будет проведен всесторонний анализ, чтобы гарантировать, что исключение может следовать нормальному потоку управления без непреднамеренных побочных эффектов.

### Вывод в обратных вызовах `AsyncHook` {#printing-in-asynchook-callbacks}

Поскольку печать в консоль является асинхронной операцией, `console.log()` приведет к вызову обратных вызовов `AsyncHook`. Использование `console.log()` или аналогичных асинхронных операций внутри функции обратного вызова `AsyncHook` приведет к бесконечной рекурсии. Простое решение этой проблемы при отладке — использовать синхронную операцию ведения журнала, такую как `fs.writeFileSync(file, msg, flag)`. Это выведет информацию в файл и не вызовет `AsyncHook` рекурсивно, потому что она синхронна.

::: code-group
```js [ESM]
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Используйте подобную функцию при отладке внутри обратного вызова AsyncHook
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```js [CJS]
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Используйте подобную функцию при отладке внутри обратного вызова AsyncHook
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```
:::

Если для ведения журнала необходима асинхронная операция, можно отслеживать, что вызвало асинхронную операцию, используя информацию, предоставленную самим `AsyncHook`. Затем ведение журнала следует пропустить, если именно ведение журнала вызвало вызов обратного вызова `AsyncHook`. Таким образом, в противном случае бесконечная рекурсия прерывается.


## Класс: `AsyncHook` {#class-asynchook}

Класс `AsyncHook` предоставляет интерфейс для отслеживания событий жизненного цикла асинхронных операций.

### `asyncHook.enable()` {#asynchookenable}

- Возвращает: [\<AsyncHook\>](/ru/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Ссылка на `asyncHook`.

Включает обратные вызовы для данного экземпляра `AsyncHook`. Если обратные вызовы не предоставлены, включение не выполняет никаких действий.

Экземпляр `AsyncHook` отключен по умолчанию. Если экземпляр `AsyncHook` должен быть включен сразу после создания, можно использовать следующий шаблон.

::: code-group
```js [ESM]
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```js [CJS]
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```
:::

### `asyncHook.disable()` {#asynchookdisable}

- Возвращает: [\<AsyncHook\>](/ru/nodejs/api/async_hooks#async_hookscreatehookcallbacks) Ссылка на `asyncHook`.

Отключает обратные вызовы для данного экземпляра `AsyncHook` из глобального пула обратных вызовов `AsyncHook`, которые должны быть выполнены. После отключения хук не будет вызываться до тех пор, пока не будет включен.

Для согласованности API `disable()` также возвращает экземпляр `AsyncHook`.

### Обратные вызовы хука {#hook-callbacks}

Ключевые события в жизненном цикле асинхронных событий были разделены на четыре области: создание экземпляра, до/после вызова обратного вызова и когда экземпляр уничтожается.

#### `init(asyncId, type, triggerAsyncId, resource)` {#initasyncid-type-triggerasyncid-resource}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уникальный идентификатор для асинхронного ресурса.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип асинхронного ресурса.
- `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уникальный идентификатор асинхронного ресурса, в контексте выполнения которого был создан этот асинхронный ресурс.
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ссылка на ресурс, представляющий асинхронную операцию, который необходимо освободить во время *destroy*.

Вызывается при построении класса, который имеет *возможность* генерировать асинхронное событие. Это *не означает*, что экземпляр должен вызывать `before`/`after` перед вызовом `destroy`, только то, что такая возможность существует.

Это поведение можно наблюдать, например, открыв ресурс, а затем закрыв его до того, как ресурс можно будет использовать. Следующий фрагмент демонстрирует это.

::: code-group
```js [ESM]
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```js [CJS]
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
:::

Каждому новому ресурсу присваивается ID, который является уникальным в пределах текущего экземпляра Node.js.


##### `type` {#type}

`type` - это строка, идентифицирующая тип ресурса, вызвавшего `init`. Обычно она соответствует имени конструктора ресурса.

`type` ресурсов, созданных самим Node.js, может меняться в любом выпуске Node.js. Допустимые значения включают `TLSWRAP`, `TCPWRAP`, `TCPSERVERWRAP`, `GETADDRINFOREQWRAP`, `FSREQCALLBACK`, `Microtask` и `Timeout`. Для получения полного списка просмотрите исходный код используемой версии Node.js.

Кроме того, пользователи [`AsyncResource`](/ru/nodejs/api/async_context#class-asyncresource) создают асинхронные ресурсы независимо от самого Node.js.

Существует также тип ресурса `PROMISE`, который используется для отслеживания экземпляров `Promise` и асинхронной работы, запланированной ими.

Пользователи могут определять свой собственный `type` при использовании общедоступного API внедрения.

Возможны конфликты имен типов. Разработчикам рекомендуется использовать уникальные префиксы, такие как имя пакета npm, для предотвращения конфликтов при прослушивании хуков.

##### `triggerAsyncId` {#triggerasyncid}

`triggerAsyncId` - это `asyncId` ресурса, который вызвал (или "запустил") инициализацию нового ресурса и вызвал вызов `init`. Это отличается от `async_hooks.executionAsyncId()`, который показывает только *когда* был создан ресурс, в то время как `triggerAsyncId` показывает *почему* был создан ресурс.

Ниже приведена простая демонстрация `triggerAsyncId`:

::: code-group
```js [ESM]
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```js [CJS]
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net';
const fs = require('node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```
:::

Вывод при обращении к серверу с помощью `nc localhost 8080`:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```
`TCPSERVERWRAP` - это сервер, который принимает соединения.

`TCPWRAP` - это новое соединение от клиента. При установлении нового соединения немедленно создается экземпляр `TCPWrap`. Это происходит вне какого-либо стека JavaScript. (`executionAsyncId()` равный `0` означает, что он выполняется из C++ без стека JavaScript над ним.) Имея только эту информацию, было бы невозможно связать ресурсы с точки зрения того, что послужило причиной их создания, поэтому `triggerAsyncId` возложена задача распространения информации о том, какой ресурс несет ответственность за существование нового ресурса.


##### `resource` {#resource}

`resource` - это объект, представляющий собой фактический асинхронный ресурс, который был инициализирован. API для доступа к объекту может быть указан создателем ресурса. Ресурсы, созданные самим Node.js, являются внутренними и могут измениться в любое время. Поэтому для них не указан API.

В некоторых случаях объект ресурса повторно используется в целях повышения производительности, поэтому небезопасно использовать его в качестве ключа в `WeakMap` или добавлять к нему свойства.

##### Пример асинхронного контекста {#asynchronous-context-example}

Случай использования отслеживания контекста охватывается стабильным API [`AsyncLocalStorage`](/ru/nodejs/api/async_context#class-asynclocalstorage). Этот пример иллюстрирует только работу асинхронных хуков, но [`AsyncLocalStorage`](/ru/nodejs/api/async_context#class-asynclocalstorage) лучше подходит для этого случая использования.

Ниже приведен пример с дополнительной информацией о вызовах `init` между вызовами `before` и `after`, в частности о том, как будет выглядеть обратный вызов для `listen()`. Форматирование вывода немного более сложное, чтобы упростить просмотр контекста вызова.

::: code-group
```js [ESM]
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```
:::

Вывод только при запуске сервера:

```bash [BASH]
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```
Как показано в примере, `executionAsyncId()` и `execution` указывают значение текущего контекста выполнения, который разграничивается вызовами `before` и `after`.

Только использование `execution` для построения графика распределения ресурсов приводит к следующему:

```bash [BASH]
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```
`TCPSERVERWRAP` не является частью этого графа, хотя именно он был причиной вызова `console.log()`. Это связано с тем, что привязка к порту без имени хоста является *синхронной* операцией, но для поддержания полностью асинхронного API обратный вызов пользователя помещается в `process.nextTick()`. Вот почему `TickObject` присутствует в выводе и является "родительским" для обратного вызова `.listen()`.

Граф показывает только *когда* был создан ресурс, а не *почему*, поэтому для отслеживания *почему* используйте `triggerAsyncId`. Это можно представить следующим графиком:

```bash [BASH]
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)` {#beforeasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Когда асинхронная операция инициируется (например, TCP-сервер получает новое соединение) или завершается (например, запись данных на диск), вызывается обратный вызов для уведомления пользователя. Обратный вызов `before` вызывается непосредственно перед выполнением указанного обратного вызова. `asyncId` — это уникальный идентификатор, присвоенный ресурсу, который собирается выполнить обратный вызов.

Обратный вызов `before` будет вызван от 0 до N раз. Обратный вызов `before` обычно вызывается 0 раз, если асинхронная операция была отменена или, например, если TCP-сервер не получает соединения. Постоянные асинхронные ресурсы, такие как TCP-сервер, обычно вызывают обратный вызов `before` несколько раз, в то время как другие операции, такие как `fs.open()`, вызывают его только один раз.

#### `after(asyncId)` {#afterasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Вызывается сразу после завершения обратного вызова, указанного в `before`.

Если во время выполнения обратного вызова происходит необработанное исключение, то `after` будет запущен *после* того, как будет сгенерировано событие `'uncaughtException'` или будет запущен обработчик `domain`.

#### `destroy(asyncId)` {#destroyasyncid}

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Вызывается после уничтожения ресурса, соответствующего `asyncId`. Он также вызывается асинхронно из API внедрения `emitDestroy()`.

Некоторые ресурсы зависят от сборки мусора для очистки, поэтому, если есть ссылка на объект `resource`, переданный в `init`, возможно, что `destroy` никогда не будет вызван, что приведет к утечке памяти в приложении. Если ресурс не зависит от сборки мусора, то это не будет проблемой.

Использование хука destroy приводит к дополнительным накладным расходам, поскольку позволяет отслеживать экземпляры `Promise` с помощью сборщика мусора.

#### `promiseResolve(asyncId)` {#promiseresolveasyncid}

**Добавлено в: v8.6.0**

- `asyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Вызывается, когда вызывается функция `resolve`, переданная конструктору `Promise` (либо напрямую, либо другими способами разрешения промиса).

`resolve()` не выполняет никакой наблюдаемой синхронной работы.

`Promise` не обязательно выполняется или отклоняется в этот момент, если `Promise` был разрешен путем принятия состояния другого `Promise`.

```js [ESM]
new Promise((resolve) => resolve(true)).then((a) => {});
```
вызывает следующие обратные вызовы:

```text [TEXT]
init for PROMISE with id 5, trigger id: 1
  promise resolve 5      # соответствует resolve(true)
init for PROMISE with id 6, trigger id: 5  # the Promise returned by then()
  before 6               # the then() callback is entered
  promise resolve 6      # the then() callback resolves the promise by returning
  after 6
```

### `async_hooks.executionAsyncResource()` {#async_hooksexecutionasyncresource}

**Добавлено в версии: v13.9.0, v12.17.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ресурс, представляющий текущее выполнение. Полезен для хранения данных в ресурсе.

Объекты ресурсов, возвращаемые `executionAsyncResource()`, чаще всего являются внутренними объектами обработчика Node.js с недокументированными API. Использование каких-либо функций или свойств объекта, скорее всего, приведет к сбою вашего приложения, и этого следует избегать.

Использование `executionAsyncResource()` в контексте выполнения верхнего уровня вернет пустой объект, поскольку нет объекта обработчика или запроса для использования, но наличие объекта, представляющего верхний уровень, может быть полезным.

::: code-group
```js [ESM]
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```js [CJS]
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```
:::

Это можно использовать для реализации локального хранилища продолжения без использования отслеживающей `Map` для хранения метаданных:

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // Приватный символ, чтобы избежать загрязнения

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // Приватный символ, чтобы избежать загрязнения

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```
:::


### `async_hooks.executionAsyncId()` {#async_hooksexecutionasyncid}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.2.0 | Переименовано из `currentId`. |
| v8.1.0 | Добавлено в: v8.1.0 |
:::

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `asyncId` текущего контекста выполнения. Полезно для отслеживания того, когда что-то вызывает.

::: code-group
```js [ESM]
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```js [CJS]
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
:::

ID, возвращаемый из `executionAsyncId()`, относится к времени выполнения, а не к причинно-следственной связи (которая рассматривается в `triggerAsyncId()`):

```js [ESM]
const server = net.createServer((conn) => {
  // Возвращает ID сервера, а не нового соединения, потому что
  // обратный вызов выполняется в области выполнения MakeCallback() сервера.
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // Возвращает ID TickObject (process.nextTick()), потому что все
  // обратные вызовы, переданные в .listen(), обернуты в nextTick().
  async_hooks.executionAsyncId();
});
```
Контексты Promise могут не получать точные `executionAsyncIds` по умолчанию. См. раздел об [отслеживании выполнения promise](/ru/nodejs/api/async_hooks#promise-execution-tracking).

### `async_hooks.triggerAsyncId()` {#async_hookstriggerasyncid}

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ID ресурса, отвечающего за вызов выполняемого в данный момент обратного вызова.

```js [ESM]
const server = net.createServer((conn) => {
  // Ресурсом, который вызвал (или запустил) вызов этого обратного вызова,
  // было новое соединение. Таким образом, возвращаемое значение triggerAsyncId()
  // является asyncId "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Даже если все обратные вызовы, переданные в .listen(), обернуты в nextTick(),
  // сам обратный вызов существует, потому что был сделан вызов .listen() сервера.
  // Таким образом, возвращаемым значением будет ID сервера.
  async_hooks.triggerAsyncId();
});
```
Контексты Promise могут не получать допустимые `triggerAsyncId` по умолчанию. См. раздел об [отслеживании выполнения promise](/ru/nodejs/api/async_hooks#promise-execution-tracking).


### `async_hooks.asyncWrapProviders` {#async_hooksasyncwrapproviders}

**Добавлено в версии: v17.2.0, v16.14.0**

- Возвращает: карту типов провайдеров и соответствующих числовых идентификаторов. Эта карта содержит все типы событий, которые могут быть испущены событием `async_hooks.init()`.

Эта функция подавляет устаревшее использование `process.binding('async_wrap').Providers`. Смотрите: [DEP0111](/ru/nodejs/api/deprecations#dep0111-processbinding)

## Отслеживание выполнения Promise {#promise-execution-tracking}

По умолчанию, выполнениям promise не присваиваются `asyncId` из-за относительно дорогостоящей природы [promise introspection API](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit), предоставляемого V8. Это означает, что программы, использующие promise или `async`/`await`, по умолчанию не будут получать правильные идентификаторы выполнения и триггера для контекстов обратного вызова promise.

::: code-group
```js [ESM]
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```js [CJS]
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
:::

Обратите внимание, что обратный вызов `then()` утверждает, что он выполнен в контексте внешней области видимости, даже если было выполнено асинхронное перемещение. Кроме того, значение `triggerAsyncId` равно `0`, что означает, что мы упускаем контекст о ресурсе, который вызвал (запустил) выполнение обратного вызова `then()`.

Установка async hooks через `async_hooks.createHook` включает отслеживание выполнения promise:

::: code-group
```js [ESM]
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```js [CJS]
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```
:::

В этом примере добавление любой фактической функции перехватчика включило отслеживание promise. В приведенном выше примере есть два promise: promise, созданный `Promise.resolve()`, и promise, возвращенный вызовом `then()`. В приведенном выше примере первый promise получил `asyncId` `6`, а второй - `asyncId` `7`. Во время выполнения обратного вызова `then()` мы выполняемся в контексте promise с `asyncId` `7`. Этот promise был запущен асинхронным ресурсом `6`.

Еще одна тонкость с promise заключается в том, что обратные вызовы `before` и `after` выполняются только для связанных promise. Это означает, что promise, не созданные с помощью `then()`/`catch()`, не будут иметь вызванных на них обратных вызовов `before` и `after`. Для получения более подробной информации см. детали V8 [PromiseHooks](https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit) API.


## JavaScript embedder API {#javascript-embedder-api}

Разработчики библиотек, которые обрабатывают свои собственные асинхронные ресурсы, выполняя такие задачи, как ввод/вывод, объединение соединений или управление очередями обратных вызовов, могут использовать JavaScript API `AsyncResource`, чтобы все соответствующие обратные вызовы были выполнены.

### Класс: `AsyncResource` {#class-asyncresource}

Документация для этого класса перемещена в [`AsyncResource`](/ru/nodejs/api/async_context#class-asyncresource).

## Класс: `AsyncLocalStorage` {#class-asynclocalstorage}

Документация для этого класса перемещена в [`AsyncLocalStorage`](/ru/nodejs/api/async_context#class-asynclocalstorage).

