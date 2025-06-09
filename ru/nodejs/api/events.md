---
title: Документация Node.js - События
description: Изучите модуль событий в Node.js, который предоставляет способ обработки асинхронных операций через программирование, ориентированное на события. Узнайте о генераторах событий, слушателях и как эффективно управлять событиями.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - События | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Изучите модуль событий в Node.js, который предоставляет способ обработки асинхронных операций через программирование, ориентированное на события. Узнайте о генераторах событий, слушателях и как эффективно управлять событиями.
  - - meta
    - name: twitter:title
      content: Документация Node.js - События | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Изучите модуль событий в Node.js, который предоставляет способ обработки асинхронных операций через программирование, ориентированное на события. Узнайте о генераторах событий, слушателях и как эффективно управлять событиями.
---


# События {#events}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/events.js](https://github.com/nodejs/node/blob/v23.5.0/lib/events.js)

Большая часть основного API Node.js построена на идиоматической асинхронной архитектуре, управляемой событиями, в которой определенные типы объектов (называемые "излучателями") испускают именованные события, которые вызывают вызов объектов `Function` ("слушателей").

Например: объект [`net.Server`](/ru/nodejs/api/net#class-netserver) испускает событие каждый раз, когда к нему подключается одноранговый узел; [`fs.ReadStream`](/ru/nodejs/api/fs#class-fsreadstream) испускает событие при открытии файла; [поток](/ru/nodejs/api/stream) испускает событие всякий раз, когда данные доступны для чтения.

Все объекты, испускающие события, являются экземплярами класса `EventEmitter`. Эти объекты предоставляют функцию `eventEmitter.on()`, которая позволяет прикрепить одну или несколько функций к именованным событиям, испускаемым объектом. Как правило, имена событий представляют собой строки в стиле camelCase, но можно использовать любой допустимый ключ свойства JavaScript.

Когда объект `EventEmitter` испускает событие, все функции, прикрепленные к этому конкретному событию, вызываются *синхронно*. Любые значения, возвращаемые вызванными слушателями, *игнорируются* и отбрасываются.

В следующем примере показан простой экземпляр `EventEmitter` с одним слушателем. Метод `eventEmitter.on()` используется для регистрации слушателей, а метод `eventEmitter.emit()` используется для запуска события.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

```js [CJS]
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```
:::

## Передача аргументов и `this` слушателям {#passing-arguments-and-this-to-listeners}

Метод `eventEmitter.emit()` позволяет передавать произвольный набор аргументов функциям-слушателям. Имейте в виду, что когда вызывается обычная функция-слушатель, стандартное ключевое слово `this` намеренно устанавливается для ссылки на экземпляр `EventEmitter`, к которому прикреплен слушатель.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     [Symbol(shapeMode)]: false,
  //     [Symbol(kCapture)]: false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```
:::

Можно использовать ES6 Arrow Functions в качестве слушателей, однако, при этом ключевое слово `this` больше не будет ссылаться на экземпляр `EventEmitter`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b undefined
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
:::


## Асинхронность против синхронности {#asynchronous-vs-synchronous}

`EventEmitter` вызывает всех слушателей синхронно, в том порядке, в котором они были зарегистрированы. Это обеспечивает правильную последовательность событий и помогает избежать состояний гонки и логических ошибок. При необходимости функции-слушатели могут переключаться в асинхронный режим работы с помощью методов `setImmediate()` или `process.nextTick()`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
:::

## Обработка событий только один раз {#handling-events-only-once}

Когда слушатель регистрируется с помощью метода `eventEmitter.on()`, этот слушатель вызывается *каждый раз*, когда происходит указанное событие.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```
:::

Используя метод `eventEmitter.once()`, можно зарегистрировать слушателя, который вызывается не более одного раза для конкретного события. После того, как событие произошло, слушатель отменяется и *затем* вызывается.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
:::


## События ошибок {#error-events}

Когда в экземпляре `EventEmitter` возникает ошибка, типичным действием является испускание события `'error'`. В Node.js они рассматриваются как особые случаи.

Если `EventEmitter` *не* имеет хотя бы одного слушателя, зарегистрированного для события `'error'`, и испускается событие `'error'`, ошибка выдается, печатается трассировка стека, и процесс Node.js завершается.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Выбрасывает ошибку и завершает работу Node.js
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Выбрасывает ошибку и завершает работу Node.js
```
:::

Для защиты от аварийного завершения процесса Node.js можно использовать модуль [`domain`](/ru/nodejs/api/domain). (Однако обратите внимание, что модуль `node:domain` устарел.)

В качестве наилучшей практики всегда следует добавлять слушатели для событий `'error'`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Выводит: whoops! there was an error
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Выводит: whoops! there was an error
```
:::

Можно отслеживать события `'error'`, не потребляя испущенную ошибку, установив слушатель с использованием символа `events.errorMonitor`.

::: code-group
```js [ESM]
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Все еще выбрасывает ошибку и завершает работу Node.js
```

```js [CJS]
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Все еще выбрасывает ошибку и завершает работу Node.js
```
:::


## Перехват отклонений промисов {#capture-rejections-of-promises}

Использование `async` функций с обработчиками событий проблематично, поскольку это может привести к необработанному отклонению в случае выброса исключения:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```
:::

Опция `captureRejections` в конструкторе `EventEmitter` или глобальная настройка изменяет это поведение, устанавливая обработчик `.then(undefined, handler)` на `Promise`. Этот обработчик асинхронно направляет исключение в метод [`Symbol.for('nodejs.rejection')`](/ru/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args), если таковой имеется, или в обработчик события [`'error'`](/ru/nodejs/api/events#error-events), если такового нет.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```js [CJS]
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```
:::

Установка `events.captureRejections = true` изменит значение по умолчанию для всех новых экземпляров `EventEmitter`.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```js [CJS]
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```
:::

События `'error'`, которые генерируются поведением `captureRejections`, не имеют обработчика catch, чтобы избежать бесконечных циклов ошибок: рекомендуется **не использовать <code>async</code> функции в качестве обработчиков события <code>'error'</code>**.


## Класс: `EventEmitter` {#class-eventemitter}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v13.4.0, v12.16.0 | Добавлена опция captureRejections. |
| v0.1.26 | Добавлено в: v0.1.26 |
:::

Класс `EventEmitter` определен и предоставляется модулем `node:events`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
```

```js [CJS]
const EventEmitter = require('node:events');
```
:::

Все объекты `EventEmitter` генерируют событие `'newListener'`, когда добавляются новые слушатели, и `'removeListener'`, когда существующие слушатели удаляются.

Он поддерживает следующую опцию:

- `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Включает [автоматический перехват отклонений промисов](/ru/nodejs/api/events#capture-rejections-of-promises). **По умолчанию:** `false`.

### Событие: `'newListener'` {#event-newlistener}

**Добавлено в: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя события, которое прослушивается
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция-обработчик события

Экземпляр `EventEmitter` генерирует свое собственное событие `'newListener'` *до того*, как слушатель будет добавлен во внутренний массив слушателей.

Слушателям, зарегистрированным для события `'newListener'`, передаются имя события и ссылка на добавляемого слушателя.

Тот факт, что событие срабатывает до добавления слушателя, имеет тонкий, но важный побочный эффект: любые *дополнительные* слушатели, зарегистрированные на то же `name` *внутри* обратного вызова `'newListener'`, вставляются *перед* слушателем, который находится в процессе добавления.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Сделайте это только один раз, чтобы не зациклиться навсегда
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Вставить нового слушателя вперед
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Выводит:
//   B
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Сделайте это только один раз, чтобы не зациклиться навсегда
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Вставить нового слушателя вперед
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Выводит:
//   B
//   A
```
:::


### Событие: `'removeListener'` {#event-removelistener}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.1.0, v4.7.0 | Для слушателей, подключенных с использованием `.once()`, аргумент `listener` теперь выдает исходную функцию слушателя. |
| v0.9.3 | Добавлено в версии: v0.9.3 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Название события
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция-обработчик события

Событие `'removeListener'` возникает *после* удаления `listener`.

### `emitter.addListener(eventName, listener)` {#emitteraddlistenereventname-listener}

**Добавлено в версии: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Псевдоним для `emitter.on(eventName, listener)`.

### `emitter.emit(eventName[, ...args])` {#emitteremiteventname-args}

**Добавлено в версии: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Синхронно вызывает каждый из слушателей, зарегистрированных для события с именем `eventName`, в том порядке, в котором они были зарегистрированы, передавая каждому из них предоставленные аргументы.

Возвращает `true`, если у события были слушатели, `false` в противном случае.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// Первый слушатель
myEmitter.on('event', function firstListener() {
  console.log('Привет! первый слушатель');
});
// Второй слушатель
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`событие с параметрами ${arg1}, ${arg2} во втором слушателе`);
});
// Третий слушатель
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`событие с параметрами ${parameters} в третьем слушателе`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Выводит:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Привет! первый слушатель
// событие с параметрами 1, 2 во втором слушателе
// событие с параметрами 1, 2, 3, 4, 5 в третьем слушателе
```

```js [CJS]
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// Первый слушатель
myEmitter.on('event', function firstListener() {
  console.log('Привет! первый слушатель');
});
// Второй слушатель
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`событие с параметрами ${arg1}, ${arg2} во втором слушателе`);
});
// Третий слушатель
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`событие с параметрами ${parameters} в третьем слушателе`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Выводит:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Привет! первый слушатель
// событие с параметрами 1, 2 во втором слушателе
// событие с параметрами 1, 2, 3, 4, 5 в третьем слушателе
```
:::


### `emitter.eventNames()` {#emittereventnames}

**Добавлено в версии: v6.0.0**

- Возвращает: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Возвращает массив, содержащий список событий, для которых эмиттер зарегистрировал слушателей. Значения в массиве являются строками или `Symbol`s.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

```js [CJS]
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```
:::

### `emitter.getMaxListeners()` {#emittergetmaxlisteners}

**Добавлено в версии: v1.0.0**

- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает текущее максимальное значение слушателей для `EventEmitter`, которое либо установлено с помощью [`emitter.setMaxListeners(n)`](/ru/nodejs/api/events#emittersetmaxlistenersn), либо по умолчанию равно [`events.defaultMaxListeners`](/ru/nodejs/api/events#eventsdefaultmaxlisteners).

### `emitter.listenerCount(eventName[, listener])` {#emitterlistenercounteventname-listener}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.8.0, v18.16.0 | Добавлен аргумент `listener`. |
| v3.2.0 | Добавлено в версии: v3.2.0 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя отслеживаемого события
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обработчика событий
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает количество слушателей, прослушивающих событие с именем `eventName`. Если указан `listener`, он вернет, сколько раз слушатель был найден в списке слушателей события.


### `emitter.listeners(eventName)` {#emitterlistenerseventname}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.0.0 | Для слушателей, подключенных с помощью `.once()`, теперь возвращаются исходные слушатели вместо функций-обёрток. |
| v0.1.26 | Добавлено в: v0.1.26 |
:::

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Возвращает: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Возвращает копию массива слушателей для события с именем `eventName`.

```js [ESM]
server.on('connection', (stream) => {
  console.log('кто-то подключился!');
});
console.log(util.inspect(server.listeners('connection')));
// Выводит: [ [Function] ]
```
### `emitter.off(eventName, listener)` {#emitteroffeventname-listener}

**Добавлено в: v10.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Псевдоним для [`emitter.removeListener()`](/ru/nodejs/api/events#emitterremovelistenereventname-listener).

### `emitter.on(eventName, listener)` {#emitteroneventname-listener}

**Добавлено в: v0.1.101**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя события.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова
- Возвращает: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Добавляет функцию `listener` в конец массива слушателей для события с именем `eventName`. Проверки на предмет того, был ли `listener` уже добавлен, не производятся. Многократные вызовы с одной и той же комбинацией `eventName` и `listener` приведут к тому, что `listener` будет добавлен и вызван несколько раз.

```js [ESM]
server.on('connection', (stream) => {
  console.log('кто-то подключился!');
});
```
Возвращает ссылку на `EventEmitter`, чтобы вызовы можно было объединять в цепочки.

По умолчанию обработчики событий вызываются в том порядке, в котором они были добавлены. Метод `emitter.prependListener()` можно использовать в качестве альтернативы для добавления обработчика событий в начало массива обработчиков.



::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Выводит:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Выводит:
//   b
//   a
```
:::


### `emitter.once(eventName, listener)` {#emitteronceeventname-listener}

**Добавлено в версии: v0.3.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Название события.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова.
- Возвращает: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Добавляет **одноразовую** функцию `listener` для события с именем `eventName`. При следующем возникновении события `eventName` этот слушатель удаляется и затем вызывается.

```js [ESM]
server.once('connection', (stream) => {
  console.log('У нас есть первый пользователь!');
});
```
Возвращает ссылку на `EventEmitter`, чтобы можно было связывать вызовы в цепочку.

По умолчанию обработчики событий вызываются в порядке их добавления. Метод `emitter.prependOnceListener()` можно использовать в качестве альтернативы для добавления обработчика событий в начало массива обработчиков.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```js [CJS]
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
:::

### `emitter.prependListener(eventName, listener)` {#emitterprependlistenereventname-listener}

**Добавлено в версии: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Название события.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова.
- Возвращает: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Добавляет функцию `listener` в *начало* массива обработчиков для события с именем `eventName`. Никакие проверки на наличие `listener` уже не производятся. Многократные вызовы, передающие одинаковую комбинацию `eventName` и `listener`, приведут к тому, что `listener` будет добавлен и вызван несколько раз.

```js [ESM]
server.prependListener('connection', (stream) => {
  console.log('кто-то подключился!');
});
```
Возвращает ссылку на `EventEmitter`, чтобы можно было связывать вызовы в цепочку.


### `emitter.prependOnceListener(eventName, listener)` {#emitterprependoncelistenereventname-listener}

**Добавлено в версии: v6.0.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя события.
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова
- Возвращает: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Добавляет **одноразовую** функцию `listener` для события с именем `eventName` в *начало* массива прослушивателей. В следующий раз, когда `eventName` будет вызвано, этот прослушиватель будет удален, а затем вызван.

```js [ESM]
server.prependOnceListener('connection', (stream) => {
  console.log('А, у нас появился первый пользователь!');
});
```
Возвращает ссылку на `EventEmitter`, чтобы можно было связывать вызовы в цепочку.

### `emitter.removeAllListeners([eventName])` {#emitterremovealllistenerseventname}

**Добавлено в версии: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Возвращает: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Удаляет все прослушиватели или прослушиватели указанного `eventName`.

Плохой практикой является удаление прослушивателей, добавленных в другом месте кода, особенно когда экземпляр `EventEmitter` был создан каким-либо другим компонентом или модулем (например, сокетами или файловыми потоками).

Возвращает ссылку на `EventEmitter`, чтобы можно было связывать вызовы в цепочку.

### `emitter.removeListener(eventName, listener)` {#emitterremovelistenereventname-listener}

**Добавлено в версии: v0.1.26**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Удаляет указанный `listener` из массива прослушивателей для события с именем `eventName`.

```js [ESM]
const callback = (stream) => {
  console.log('кто-то подключился!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
`removeListener()` удалит, самое большее, один экземпляр прослушивателя из массива прослушивателей. Если какой-либо один прослушиватель был добавлен несколько раз в массив прослушивателей для указанного `eventName`, то `removeListener()` необходимо вызвать несколько раз, чтобы удалить каждый экземпляр.

После того, как событие было сгенерировано, все прослушиватели, прикрепленные к нему во время генерации, вызываются по порядку. Это означает, что любые вызовы `removeListener()` или `removeAllListeners()` *после* генерации и *до* того, как последний прослушиватель завершит выполнение, не удалят их из `emit()` в процессе выполнения. Последующие события ведут себя как ожидается.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA удаляет прослушиватель callbackB, но он все равно будет вызван.
// Внутренний массив прослушивателей во время генерации [callbackA, callbackB]
myEmitter.emit('event');
// Выводит:
//   A
//   B

// callbackB теперь удален.
// Внутренний массив прослушивателей [callbackA]
myEmitter.emit('event');
// Выводит:
//   A
```

```js [CJS]
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA удаляет прослушиватель callbackB, но он все равно будет вызван.
// Внутренний массив прослушивателей во время генерации [callbackA, callbackB]
myEmitter.emit('event');
// Выводит:
//   A
//   B

// callbackB теперь удален.
// Внутренний массив прослушивателей [callbackA]
myEmitter.emit('event');
// Выводит:
//   A
```
:::

Поскольку прослушиватели управляются с использованием внутреннего массива, вызов этого изменит индексы позиций любого прослушивателя, зарегистрированного *после* удаляемого прослушивателя. Это не повлияет на порядок вызова прослушивателей, но это означает, что любые копии массива прослушивателей, возвращаемые методом `emitter.listeners()`, необходимо будет воссоздать.

Когда одна и та же функция была добавлена в качестве обработчика несколько раз для одного события (как в примере ниже), `removeListener()` удалит самый последний добавленный экземпляр. В примере удаляется прослушиватель `once('ping')`:

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```js [CJS]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```
:::

Возвращает ссылку на `EventEmitter`, чтобы можно было связывать вызовы в цепочку.


### `emitter.setMaxListeners(n)` {#emittersetmaxlistenersn}

**Добавлено в: v0.3.5**

- `n` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

По умолчанию `EventEmitter` будет выводить предупреждение, если для определенного события добавлено более `10` слушателей. Это полезное значение по умолчанию, которое помогает находить утечки памяти. Метод `emitter.setMaxListeners()` позволяет изменить лимит для данного конкретного экземпляра `EventEmitter`. Значение можно установить равным `Infinity` (или `0`), чтобы указать неограниченное количество слушателей.

Возвращает ссылку на `EventEmitter`, чтобы можно было объединять вызовы в цепочку.

### `emitter.rawListeners(eventName)` {#emitterrawlistenerseventname}

**Добавлено в: v9.4.0**

- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Возвращает: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Возвращает копию массива слушателей для события с именем `eventName`, включая любые обертки (например, созданные с помощью `.once()`).

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Возвращает новый массив с функцией `onceWrapper`, которая имеет свойство
// `listener`, содержащее исходный прослушиватель, привязанный выше
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Выводит "log once" в консоль и не отвязывает событие `once`
logFnWrapper.listener();

// Выводит "log once" в консоль и удаляет слушателя
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Вернет новый массив с одной функцией, привязанной `.on()` выше
const newListeners = emitter.rawListeners('log');

// Выводит "log persistently" дважды
newListeners[0]();
emitter.emit('log');
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Возвращает новый массив с функцией `onceWrapper`, которая имеет свойство
// `listener`, содержащее исходный прослушиватель, привязанный выше
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Выводит "log once" в консоль и не отвязывает событие `once`
logFnWrapper.listener();

// Выводит "log once" в консоль и удаляет слушателя
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Вернет новый массив с одной функцией, привязанной `.on()` выше
const newListeners = emitter.rawListeners('log');

// Выводит "log persistently" дважды
newListeners[0]();
emitter.emit('log');
```
:::


### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])` {#emittersymbolfornodejsrejectionerr-eventname-args}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.4.0, v16.14.0 | Больше не является экспериментальным. |
| v13.4.0, v12.16.0 | Добавлено в: v13.4.0, v12.16.0 |
:::

- `err` Ошибка
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Метод `Symbol.for('nodejs.rejection')` вызывается в случае отклонения promise при генерации события, и если для эмиттера включена опция [`captureRejections`](/ru/nodejs/api/events#capture-rejections-of-promises). Вместо `Symbol.for('nodejs.rejection')` можно использовать [`events.captureRejectionSymbol`](/ru/nodejs/api/events#eventscapturerejectionsymbol).

::: code-group
```js [ESM]
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('произошло отклонение для', event, 'с', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Уничтожьте ресурс здесь.
  }
}
```

```js [CJS]
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('произошло отклонение для', event, 'с', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Уничтожьте ресурс здесь.
  }
}
```
:::

## `events.defaultMaxListeners` {#eventsdefaultmaxlisteners}

**Добавлено в: v0.11.2**

По умолчанию, для одного события можно зарегистрировать максимум `10` слушателей. Этот лимит может быть изменен для отдельных экземпляров `EventEmitter` с помощью метода [`emitter.setMaxListeners(n)`](/ru/nodejs/api/events#emittersetmaxlistenersn). Чтобы изменить значение по умолчанию для *всех* экземпляров `EventEmitter`, можно использовать свойство `events.defaultMaxListeners`. Если это значение не является положительным числом, выбрасывается исключение `RangeError`.

Будьте осторожны при установке `events.defaultMaxListeners`, поскольку изменение влияет на *все* экземпляры `EventEmitter`, включая те, которые были созданы до внесения изменения. Однако вызов [`emitter.setMaxListeners(n)`](/ru/nodejs/api/events#emittersetmaxlistenersn) по-прежнему имеет приоритет над `events.defaultMaxListeners`.

Это не жесткое ограничение. Экземпляр `EventEmitter` позволит добавить больше слушателей, но выведет предупреждение трассировки в stderr, указывающее на то, что была обнаружена "возможная утечка памяти EventEmitter". Для любого отдельного `EventEmitter` можно использовать методы `emitter.getMaxListeners()` и `emitter.setMaxListeners()`, чтобы временно избежать этого предупреждения:

`defaultMaxListeners` не влияет на экземпляры `AbortSignal`. Хотя все еще можно использовать [`emitter.setMaxListeners(n)`](/ru/nodejs/api/events#emittersetmaxlistenersn) для установки предупреждающего лимита для отдельных экземпляров `AbortSignal`, по умолчанию экземпляры `AbortSignal` не будут выдавать предупреждения.

::: code-group
```js [ESM]
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```js [CJS]
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
:::

Флаг командной строки [`--trace-warnings`](/ru/nodejs/api/cli#--trace-warnings) можно использовать для отображения стека вызовов для таких предупреждений.

Сгенерированное предупреждение можно проверить с помощью [`process.on('warning')`](/ru/nodejs/api/process#event-warning), и оно будет иметь дополнительные свойства `emitter`, `type` и `count`, относящиеся к экземпляру генератора событий, имени события и количеству прикрепленных слушателей, соответственно. Его свойству `name` присваивается значение `'MaxListenersExceededWarning'`.


## `events.errorMonitor` {#eventserrormonitor}

**Добавлено в: v13.6.0, v12.17.0**

Этот символ используется для установки прослушивателя только для мониторинга событий `'error'`. Прослушиватели, установленные с использованием этого символа, вызываются перед обычными прослушивателями `'error'`.

Установка прослушивателя с использованием этого символа не изменяет поведение после возникновения события `'error'`. Следовательно, процесс все равно завершится с ошибкой, если не установлен обычный прослушиватель `'error'`.

## `events.getEventListeners(emitterOrTarget, eventName)` {#eventsgeteventlistenersemitterortarget-eventname}

**Добавлено в: v15.2.0, v14.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- Возвращает: [\<Function[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Возвращает копию массива прослушивателей для события с именем `eventName`.

Для `EventEmitter` это ведет себя точно так же, как вызов `.listeners` для эмиттера.

Для `EventTarget` это единственный способ получить прослушиватели событий для целевого объекта события. Это полезно для отладки и диагностических целей.

::: code-group
```js [ESM]
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```js [CJS]
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```
:::


## `events.getMaxListeners(emitterOrTarget)` {#eventsgetmaxlistenersemitterortarget}

**Добавлено в: v19.9.0, v18.17.0**

- `emitterOrTarget` [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter) | [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget)
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает текущее максимальное количество слушателей.

Для `EventEmitter` это ведет себя точно так же, как вызов `.getMaxListeners` на эмиттере.

Для `EventTarget` это единственный способ получить максимальное количество слушателей событий для цели события. Если количество обработчиков событий на одном EventTarget превышает установленный максимум, EventTarget выведет предупреждение.

::: code-group
```js [ESM]
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```js [CJS]
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```
:::

## `events.once(emitter, name[, options])` {#eventsonceemitter-name-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Теперь поддерживается опция `signal`. |
| v11.13.0, v10.16.0 | Добавлено в: v11.13.0, v10.16.0 |
:::

- `emitter` [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Может использоваться для отмены ожидания события.
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Создает `Promise`, который выполняется, когда `EventEmitter` испускает данное событие, или отклоняется, если `EventEmitter` испускает `'error'` во время ожидания. `Promise` разрешается с массивом всех аргументов, переданных в данное событие.

Этот метод намеренно является общим и работает с веб-платформой [EventTarget](https://dom.spec.whatwg.org/#interface-eventtarget), у которого нет специальной семантики события `'error'` и который не прослушивает событие `'error'`.

::: code-group
```js [ESM]
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```js [CJS]
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```
:::

Специальная обработка события `'error'` используется только тогда, когда `events.once()` используется для ожидания другого события. Если `events.once()` используется для ожидания самого события `'error'`, то оно рассматривается как любой другой вид события без специальной обработки:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```
:::

[\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) можно использовать для отмены ожидания события:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```
:::


### Ожидание нескольких событий, сгенерированных в `process.nextTick()` {#awaiting-multiple-events-emitted-on-processnexttick}

Существует крайний случай, о котором стоит помнить при использовании функции `events.once()` для ожидания нескольких событий, сгенерированных в одном и том же пакете операций `process.nextTick()` или всякий раз, когда несколько событий генерируются синхронно. В частности, поскольку очередь `process.nextTick()` обрабатывается до очереди микрозадач `Promise`, и поскольку `EventEmitter` генерирует все события синхронно, возможно, что `events.once()` пропустит событие.

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Этот Promise никогда не будет выполнен, потому что событие 'foo' уже
  // будет сгенерировано до создания Promise.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // Этот Promise никогда не будет выполнен, потому что событие 'foo' уже
  // будет сгенерировано до создания Promise.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::

Чтобы перехватить оба события, создайте каждый из Promises *перед* ожиданием любого из них, тогда станет возможным использовать `Promise.all()`, `Promise.race()` или `Promise.allSettled()`:

::: code-group
```js [ESM]
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js [CJS]
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
:::


## `events.captureRejections` {#eventscapturerejections}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.4.0, v16.14.0 | Больше не экспериментальная. |
| v13.4.0, v12.16.0 | Добавлено в: v13.4.0, v12.16.0 |
:::

Значение: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Изменяет опцию `captureRejections` по умолчанию для всех новых объектов `EventEmitter`.

## `events.captureRejectionSymbol` {#eventscapturerejectionsymbol}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.4.0, v16.14.0 | Больше не экспериментальная. |
| v13.4.0, v12.16.0 | Добавлено в: v13.4.0, v12.16.0 |
:::

Значение: `Symbol.for('nodejs.rejection')`

Смотрите как написать свой собственный [обработчик отклонений](/ru/nodejs/api/events#emittersymbolfornodejsrejectionerr-eventname-args).

## `events.listenerCount(emitter, eventName)` {#eventslistenercountemitter-eventname}

**Добавлено в: v0.9.12**

**Устарело с: v3.2.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`emitter.listenerCount()`](/ru/nodejs/api/events#emitterlistenercounteventname-listener) вместо.
:::

- `emitter` [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter) Эмиттер для запроса
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя события

Метод класса, который возвращает количество прослушивателей для данного `eventName`, зарегистрированного на данном `emitter`.

::: code-group
```js [ESM]
import { EventEmitter, listenerCount } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```

```js [CJS]
const { EventEmitter, listenerCount } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on('event', () => {});
myEmitter.on('event', () => {});
console.log(listenerCount(myEmitter, 'event'));
// Prints: 2
```
:::


## `events.on(emitter, eventName[, options])` {#eventsonemitter-eventname-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Поддержка опций `highWaterMark` и `lowWaterMark` для соответствия. Старые опции также поддерживаются. |
| v20.0.0 | Теперь поддерживаются опции `close`, `highWatermark` и `lowWatermark`. |
| v13.6.0, v12.16.0 | Добавлено в: v13.6.0, v12.16.0 |
:::

- `emitter` [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)
- `eventName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Имя прослушиваемого события
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Может использоваться для отмены ожидания событий.
    - `close` - [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имена событий, которые завершат итерацию.
    - `highWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `Number.MAX_SAFE_INTEGER` Верхняя граница. Издатель приостанавливается каждый раз, когда размер буферизуемых событий превышает ее. Поддерживается только для издателей, реализующих методы `pause()` и `resume()`.
    - `lowWaterMark` - [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `1` Нижняя граница. Издатель возобновляется каждый раз, когда размер буферизуемых событий ниже ее. Поддерживается только для издателей, реализующих методы `pause()` и `resume()`.


- Возвращает: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface), который перебирает события `eventName`, излучаемые `emitter`

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();
```
:::

Возвращает `AsyncIterator`, который перебирает события `eventName`. Выдаст ошибку, если `EventEmitter` излучает `'error'`. Удаляет все прослушиватели при выходе из цикла. `value`, возвращаемое каждой итерацией, является массивом, состоящим из аргументов излучаемого события.

[\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) может использоваться для отмены ожидания событий:

::: code-group
```js [ESM]
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

```js [CJS]
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```
:::

## `events.setMaxListeners(n[, ...eventTargets])` {#eventssetmaxlistenersn-eventtargets}

**Добавлено в версии: v15.4.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Неотрицательное число. Максимальное количество слушателей на событие `EventTarget`.
- `...eventsTargets` [\<EventTarget[]\>](/ru/nodejs/api/events#class-eventtarget) | [\<EventEmitter[]\>](/ru/nodejs/api/events#class-eventemitter) Ноль или более экземпляров [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) или [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter). Если ничего не указано, `n` устанавливается как максимальное значение по умолчанию для всех вновь созданных объектов [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) и [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter).

::: code-group
```js [ESM]
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```js [CJS]
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```
:::

## `events.addAbortListener(signal, listener)` {#eventsaddabortlistenersignal-listener}

**Добавлено в версии: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

- `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ru/nodejs/api/events#event-listener)
- Возвращает: [\<Disposable\>](https://tc39.es/proposal-explicit-resource-management/#sec-disposable-interface) Disposable, который удаляет слушатель `abort`.

Однократно прослушивает событие `abort` на предоставленном `signal`.

Прослушивание события `abort` на сигналах прерывания небезопасно и может привести к утечкам ресурсов, поскольку третья сторона с сигналом может вызвать [`e.stopImmediatePropagation()`](/ru/nodejs/api/events#eventstopimmediatepropagation). К сожалению, Node.js не может это изменить, поскольку это нарушит веб-стандарт. Кроме того, исходный API позволяет легко забыть удалить слушателей.

Этот API позволяет безопасно использовать `AbortSignal` в API Node.js, решая эти две проблемы, прослушивая событие таким образом, чтобы `stopImmediatePropagation` не мешал работе слушателя.

Возвращает disposable, чтобы от него можно было легче отписаться.

::: code-group
```js [CJS]
const { addAbortListener } = require('node:events');

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```

```js [ESM]
import { addAbortListener } from 'node:events';

function example(signal) {
  let disposable;
  try {
    signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
    disposable = addAbortListener(signal, (e) => {
      // Do something when signal is aborted.
    });
  } finally {
    disposable?.[Symbol.dispose]();
  }
}
```
:::


## Класс: `events.EventEmitterAsyncResource extends EventEmitter` {#class-eventseventemitterasyncresource-extends-eventemitter}

**Добавлено в: v17.4.0, v16.14.0**

Интегрирует `EventEmitter` с [\<AsyncResource\>](/ru/nodejs/api/async_hooks#class-asyncresource) для `EventEmitter`-ов, требующих ручного отслеживания асинхронности. В частности, все события, излучаемые экземплярами `events.EventEmitterAsyncResource`, будут выполняться в его [асинхронном контексте](/ru/nodejs/api/async_context).

::: code-group
```js [ESM]
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// Инструменты асинхронного отслеживания идентифицируют это как 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// Слушатели 'foo' будут выполняться в асинхронном контексте EventEmitters.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// Слушатели 'foo' на обычных EventEmitters, которые не отслеживают асинхронный
// контекст, тем не менее, выполняются в том же асинхронном контексте, что и emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```js [CJS]
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// Инструменты асинхронного отслеживания идентифицируют это как 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// Слушатели 'foo' будут выполняться в асинхронном контексте EventEmitters.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// Слушатели 'foo' на обычных EventEmitters, которые не отслеживают асинхронный
// контекст, тем не менее, выполняются в том же асинхронном контексте, что и emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```
:::

Класс `EventEmitterAsyncResource` имеет те же методы и принимает те же параметры, что и сами `EventEmitter` и `AsyncResource`.


### `new events.EventEmitterAsyncResource([options])` {#new-eventseventemitterasyncresourceoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `captureRejections` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Включает [автоматический перехват отклонений промисов](/ru/nodejs/api/events#capture-rejections-of-promises). **По умолчанию:** `false`.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип асинхронного события. **По умолчанию:** [`new.target.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) ID контекста выполнения, который создал это асинхронное событие. **По умолчанию:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, отключает `emitDestroy` при сборке мусора объекта. Обычно это не нужно устанавливать (даже если `emitDestroy` вызывается вручную), если только `asyncId` ресурса не получен и чувствительный API `emitDestroy` не вызывается с ним. Если установлено значение `false`, вызов `emitDestroy` при сборке мусора будет выполнен только в том случае, если существует хотя бы один активный хук `destroy`. **По умолчанию:** `false`.

### `eventemitterasyncresource.asyncId` {#eventemitterasyncresourceasyncid}

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уникальный `asyncId`, присвоенный ресурсу.

### `eventemitterasyncresource.asyncResource` {#eventemitterasyncresourceasyncresource}

- Тип: Базовый [\<AsyncResource\>](/ru/nodejs/api/async_hooks#class-asyncresource).

Возвращенный объект `AsyncResource` имеет дополнительное свойство `eventEmitter`, которое предоставляет ссылку на этот `EventEmitterAsyncResource`.

### `eventemitterasyncresource.emitDestroy()` {#eventemitterasyncresourceemitdestroy}

Вызывает все хуки `destroy`. Это следует вызывать только один раз. Если это будет вызвано более одного раза, будет выдана ошибка. Это **должно** быть вызвано вручную. Если ресурс будет оставлен для сбора GC, то хуки `destroy` никогда не будут вызваны.


### `eventemitterasyncresource.triggerAsyncId` {#eventemitterasyncresourcetriggerasyncid}

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Тот же `triggerAsyncId`, который передается конструктору `AsyncResource`.

## API `EventTarget` и `Event` {#eventtarget-and-event-api}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | изменена обработка ошибок EventTarget. |
| v15.4.0 | Больше не экспериментальная. |
| v15.0.0 | Классы `EventTarget` и `Event` теперь доступны как глобальные. |
| v14.5.0 | Добавлено в: v14.5.0 |
:::

Объекты `EventTarget` и `Event` - это специфическая для Node.js реализация [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget), которая предоставляется некоторыми основными API Node.js.

```js [ESM]
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('произошло событие foo!');
});
```
### Node.js `EventTarget` vs. DOM `EventTarget` {#nodejs-eventtarget-vs-dom-eventtarget}

Существуют два ключевых различия между Node.js `EventTarget` и [`EventTarget` Web API](https://dom.spec.whatwg.org/#eventtarget):

### `NodeEventTarget` vs. `EventEmitter` {#nodeeventtarget-vs-eventemitter}

Объект `NodeEventTarget` реализует измененное подмножество API `EventEmitter`, которое позволяет ему тесно *эмулировать* `EventEmitter` в определенных ситуациях. `NodeEventTarget` *не* является экземпляром `EventEmitter` и не может использоваться вместо `EventEmitter` в большинстве случаев.

### Обработчик событий {#event-listener}

Обработчики событий, зарегистрированные для события `type`, могут быть либо функциями JavaScript, либо объектами со свойством `handleEvent`, значением которого является функция.

В любом случае функция-обработчик вызывается с аргументом `event`, переданным в функцию `eventTarget.dispatchEvent()`.

Асинхронные функции могут использоваться в качестве обработчиков событий. Если асинхронная функция-обработчик отклоняет, отклонение перехватывается и обрабатывается, как описано в [`Обработка ошибок EventTarget`](/ru/nodejs/api/events#eventtarget-error-handling).

Ошибка, выброшенная одной функцией-обработчиком, не мешает вызову других обработчиков.

Возвращаемое значение функции-обработчика игнорируется.

Обработчики всегда вызываются в том порядке, в котором они были добавлены.

Функции-обработчики могут изменять объект `event`.

```js [ESM]
function handler1(event) {
  console.log(event.type);  // Выводит 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Выводит 'foo'
  console.log(event.a);  // Выводит 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Выводит 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Выводит 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### Обработка ошибок в `EventTarget` {#eventtarget-error-handling}

Когда зарегистрированный прослушиватель событий выбрасывает исключение (или возвращает Promise, который отклоняется), по умолчанию ошибка рассматривается как необработанное исключение в `process.nextTick()`. Это означает, что необработанные исключения в `EventTarget` по умолчанию завершат процесс Node.js.

Выбрасывание исключения внутри прослушивателя событий *не* остановит вызов других зарегистрированных обработчиков.

`EventTarget` не реализует никакой специальной обработки по умолчанию для событий типа `'error'`, как `EventEmitter`.

В настоящее время ошибки сначала пересылаются в событие `process.on('error')`, прежде чем достигнут `process.on('uncaughtException')`. Это поведение устарело и будет изменено в будущем выпуске, чтобы привести `EventTarget` в соответствие с другими API Node.js. Любой код, полагающийся на событие `process.on('error')`, должен быть приведен в соответствие с новым поведением.

### Класс: `Event` {#class-event}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Класс `Event` теперь доступен через глобальный объект. |
| v14.5.0 | Добавлено в: v14.5.0 |
:::

Объект `Event` является адаптацией [`Event` Web API](https://dom.spec.whatwg.org/#event). Экземпляры создаются внутри Node.js.

#### `event.bubbles` {#eventbubbles}

**Добавлено в: v14.5.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Всегда возвращает `false`.

Это не используется в Node.js и предоставляется исключительно для полноты картины.

#### `event.cancelBubble` {#eventcancelbubble}

**Добавлено в: v14.5.0**

::: info [Стабильно: 3 - Устаревшее]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее: Используйте [`event.stopPropagation()`](/ru/nodejs/api/events#eventstoppropagation) вместо этого.
:::

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Псевдоним для `event.stopPropagation()`, если установлено значение `true`. Это не используется в Node.js и предоставляется исключительно для полноты картины.

#### `event.cancelable` {#eventcancelable}

**Добавлено в: v14.5.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True, если событие было создано с опцией `cancelable`.


#### `event.composed` {#eventcomposed}

**Добавлено в: v14.5.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Всегда возвращает `false`.

Это не используется в Node.js и предоставлено исключительно для полноты.

#### `event.composedPath()` {#eventcomposedpath}

**Добавлено в: v14.5.0**

Возвращает массив, содержащий текущий `EventTarget` в качестве единственной записи, или пустой, если событие не отправляется. Это не используется в Node.js и предоставлено исключительно для полноты.

#### `event.currentTarget` {#eventcurrenttarget}

**Добавлено в: v14.5.0**

- Тип: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) `EventTarget`, отправляющий событие.

Псевдоним для `event.target`.

#### `event.defaultPrevented` {#eventdefaultprevented}

**Добавлено в: v14.5.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Имеет значение `true`, если `cancelable` имеет значение `true` и был вызван `event.preventDefault()`.

#### `event.eventPhase` {#eventeventphase}

**Добавлено в: v14.5.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Возвращает `0`, пока событие не отправляется, `2`, пока оно отправляется.

Это не используется в Node.js и предоставлено исключительно для полноты.

#### `event.initEvent(type[, bubbles[, cancelable]])` {#eventiniteventtype-bubbles-cancelable}

**Добавлено в: v19.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее: спецификация WHATWG считает его устаревшим, и пользователям вообще не следует его использовать.
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `bubbles` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `cancelable` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Избыточно с конструкторами событий и неспособно установить `composed`. Это не используется в Node.js и предоставлено исключительно для полноты.

#### `event.isTrusted` {#eventistrusted}

**Добавлено в: v14.5.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Событие [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) `"abort"` испускается со значением `isTrusted`, установленным в `true`. Во всех остальных случаях значение равно `false`.


#### `event.preventDefault()` {#eventpreventdefault}

**Added in: v14.5.0**

Устанавливает свойство `defaultPrevented` в `true`, если `cancelable` имеет значение `true`.

#### `event.returnValue` {#eventreturnvalue}

**Added in: v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Stability: 3](/ru/nodejs/api/documentation#stability-index) - Legacy: Используйте [`event.defaultPrevented`](/ru/nodejs/api/events#eventdefaultprevented) вместо этого.
:::

- Type: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) True, если событие не было отменено.

Значение `event.returnValue` всегда противоположно `event.defaultPrevented`. Это не используется в Node.js и предоставляется исключительно для полноты картины.

#### `event.srcElement` {#eventsrcelement}

**Added in: v14.5.0**

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Stability: 3](/ru/nodejs/api/documentation#stability-index) - Legacy: Используйте [`event.target`](/ru/nodejs/api/events#eventtarget) вместо этого.
:::

- Type: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) `EventTarget`, инициирующий событие.

Псевдоним для `event.target`.

#### `event.stopImmediatePropagation()` {#eventstopimmediatepropagation}

**Added in: v14.5.0**

Останавливает вызов обработчиков событий после завершения текущего.

#### `event.stopPropagation()` {#eventstoppropagation}

**Added in: v14.5.0**

Это не используется в Node.js и предоставляется исключительно для полноты картины.

#### `event.target` {#eventtarget}

**Added in: v14.5.0**

- Type: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) `EventTarget`, инициирующий событие.

#### `event.timeStamp` {#eventtimestamp}

**Added in: v14.5.0**

- Type: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Временная метка в миллисекундах, когда был создан объект `Event`.

#### `event.type` {#eventtype}

**Added in: v14.5.0**

- Type: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Идентификатор типа события.

### Class: `EventTarget` {#class-eventtarget}


::: info [History]
| Version | Changes |
| --- | --- |
| v15.0.0 | Класс `EventTarget` теперь доступен через глобальный объект. |
| v14.5.0 | Added in: v14.5.0 |
:::


#### `eventTarget.addEventListener(type, listener[, options])` {#eventtargetaddeventlistenertype-listener-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.4.0 | Добавлена поддержка опции `signal`. |
| v14.5.0 | Добавлено в: v14.5.0 |
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ru/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `once` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, прослушиватель автоматически удаляется при первом вызове. **По умолчанию:** `false`.
    - `passive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, служит подсказкой, что прослушиватель не будет вызывать метод `preventDefault()` объекта `Event`. **По умолчанию:** `false`.
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Не используется напрямую Node.js. Добавлено для полноты API. **По умолчанию:** `false`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Прослушиватель будет удален, когда будет вызван метод `abort()` заданного объекта AbortSignal.

Добавляет новый обработчик для события `type`. Любой данный `listener` добавляется только один раз для каждого `type` и для каждого значения опции `capture`.

Если опция `once` имеет значение `true`, `listener` удаляется после следующего раза, когда отправляется событие `type`.

Опция `capture` не используется Node.js каким-либо функциональным образом, кроме отслеживания зарегистрированных прослушивателей событий в соответствии со спецификацией `EventTarget`. В частности, опция `capture` используется как часть ключа при регистрации `listener`. Любой отдельный `listener` может быть добавлен один раз с `capture = false` и один раз с `capture = true`.

```js [ESM]
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // первый
target.addEventListener('foo', handler, { capture: false }); // второй

// Удаляет второй экземпляр обработчика
target.removeEventListener('foo', handler);

// Удаляет первый экземпляр обработчика
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)` {#eventtargetdispatcheventevent}

**Added in: v14.5.0**

- `event` [\<Event\>](/ru/nodejs/api/events#class-event)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если значение атрибута `cancelable` события равно false или не был вызван его метод `preventDefault()`, в противном случае `false`.

Отправляет `event` в список обработчиков для `event.type`.

Зарегистрированные прослушиватели событий вызываются синхронно в порядке их регистрации.

#### `eventTarget.removeEventListener(type, listener[, options])` {#eventtargetremoveeventlistenertype-listener-options}

**Added in: v14.5.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ru/nodejs/api/events#event-listener)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Удаляет `listener` из списка обработчиков для события `type`.

### Class: `CustomEvent` {#class-customevent}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Больше не экспериментальный. |
| v22.1.0, v20.13.0 | CustomEvent теперь стабилен. |
| v19.0.0 | Больше не скрывается за флагом CLI `--experimental-global-customevent`. |
| v18.7.0, v16.17.0 | Added in: v18.7.0, v16.17.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

- Расширяет: [\<Event\>](/ru/nodejs/api/events#class-event)

Объект `CustomEvent` является адаптацией [`CustomEvent` Web API](https://dom.spec.whatwg.org/#customevent). Экземпляры создаются внутри Node.js.

#### `event.detail` {#eventdetail}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | CustomEvent теперь стабилен. |
| v18.7.0, v16.17.0 | Added in: v18.7.0, v16.17.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

- Тип: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Возвращает пользовательские данные, переданные при инициализации.

Только для чтения.


### Класс: `NodeEventTarget` {#class-nodeeventtarget}

**Добавлено в: v14.5.0**

- Наследуется: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget)

`NodeEventTarget` - это специфичное для Node.js расширение `EventTarget`, которое эмулирует подмножество API `EventEmitter`.

#### `nodeEventTarget.addListener(type, listener)` {#nodeeventtargetaddlistenertype-listener}

**Добавлено в: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ru/nodejs/api/events#event-listener)
-  Возвращает: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) this

Специфичное для Node.js расширение класса `EventTarget`, которое эмулирует эквивалентный API `EventEmitter`. Единственное различие между `addListener()` и `addEventListener()` заключается в том, что `addListener()` возвращает ссылку на `EventTarget`.

#### `nodeEventTarget.emit(type, arg)` {#nodeeventtargetemittype-arg}

**Добавлено в: v15.2.0**

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `arg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если существуют слушатели событий, зарегистрированные для `type`, иначе `false`.

Специфичное для Node.js расширение класса `EventTarget`, которое отправляет `arg` списку обработчиков для `type`.

#### `nodeEventTarget.eventNames()` {#nodeeventtargeteventnames}

**Добавлено в: v14.5.0**

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Специфичное для Node.js расширение класса `EventTarget`, которое возвращает массив имен `type` событий, для которых зарегистрированы слушатели событий.

#### `nodeEventTarget.listenerCount(type)` {#nodeeventtargetlistenercounttype}

**Добавлено в: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Специфичное для Node.js расширение класса `EventTarget`, которое возвращает количество слушателей событий, зарегистрированных для `type`.


#### `nodeEventTarget.setMaxListeners(n)` {#nodeeventtargetsetmaxlistenersn}

**Добавлено в: v14.5.0**

- `n` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Специфичное для Node.js расширение класса `EventTarget`, которое устанавливает максимальное количество прослушивателей событий равным `n`.

#### `nodeEventTarget.getMaxListeners()` {#nodeeventtargetgetmaxlisteners}

**Добавлено в: v14.5.0**

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Специфичное для Node.js расширение класса `EventTarget`, которое возвращает максимальное количество прослушивателей событий.

#### `nodeEventTarget.off(type, listener[, options])` {#nodeeventtargetofftype-listener-options}

**Добавлено в: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ru/nodejs/api/events#event-listener)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


-  Возвращает: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) this

Специфичный для Node.js псевдоним для `eventTarget.removeEventListener()`.

#### `nodeEventTarget.on(type, listener)` {#nodeeventtargetontype-listener}

**Добавлено в: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ru/nodejs/api/events#event-listener)
-  Возвращает: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) this

Специфичный для Node.js псевдоним для `eventTarget.addEventListener()`.

#### `nodeEventTarget.once(type, listener)` {#nodeeventtargetoncetype-listener}

**Добавлено в: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ru/nodejs/api/events#event-listener)
-  Возвращает: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) this

Специфичное для Node.js расширение класса `EventTarget`, которое добавляет прослушиватель `once` для заданного `type` события. Это эквивалентно вызову `on` с опцией `once`, установленной в `true`.


#### `nodeEventTarget.removeAllListeners([type])` {#nodeeventtargetremovealllistenerstype}

**Добавлено в: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  Возвращает: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) `this`

Специфичное для Node.js расширение класса `EventTarget`. Если указан `type`, удаляет все зарегистрированные слушатели для `type`, в противном случае удаляет все зарегистрированные слушатели.

#### `nodeEventTarget.removeListener(type, listener[, options])` {#nodeeventtargetremovelistenertype-listener-options}

**Добавлено в: v14.5.0**

-  `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<EventListener\>](/ru/nodejs/api/events#event-listener)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `capture` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


-  Возвращает: [\<EventTarget\>](/ru/nodejs/api/events#class-eventtarget) `this`

Специфичное для Node.js расширение класса `EventTarget`, которое удаляет `listener` для заданного `type`. Единственное различие между `removeListener()` и `removeEventListener()` заключается в том, что `removeListener()` возвращает ссылку на `EventTarget`.

