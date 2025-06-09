---
title: Документация Node.js - Отслеживание асинхронного контекста
description: Узнайте, как отслеживать асинхронные операции в Node.js с помощью модуля async_hooks, который предоставляет способ регистрации обратных вызовов для различных асинхронных событий.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Отслеживание асинхронного контекста | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как отслеживать асинхронные операции в Node.js с помощью модуля async_hooks, который предоставляет способ регистрации обратных вызовов для различных асинхронных событий.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Отслеживание асинхронного контекста | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как отслеживать асинхронные операции в Node.js с помощью модуля async_hooks, который предоставляет способ регистрации обратных вызовов для различных асинхронных событий.
---


# Отслеживание асинхронного контекста {#asynchronous-context-tracking}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/async_hooks.js](https://github.com/nodejs/node/blob/v23.5.0/lib/async_hooks.js)

## Введение {#introduction}

Эти классы используются для связывания состояния и его распространения через обратные вызовы и цепочки промисов. Они позволяют хранить данные на протяжении всего жизненного цикла веб-запроса или любого другого асинхронного периода. Это похоже на локальное хранилище потока в других языках.

Классы `AsyncLocalStorage` и `AsyncResource` являются частью модуля `node:async_hooks`:

::: code-group
```js [ESM]
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```js [CJS]
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```
:::

## Класс: `AsyncLocalStorage` {#class-asynclocalstorage}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.4.0 | AsyncLocalStorage теперь является стабильным. Ранее он был экспериментальным. |
| v13.10.0, v12.17.0 | Добавлено в: v13.10.0, v12.17.0 |
:::

Этот класс создает хранилища, которые остаются согласованными в процессе асинхронных операций.

Хотя вы можете создать свою собственную реализацию на основе модуля `node:async_hooks`, `AsyncLocalStorage` предпочтительнее, так как это высокопроизводительная и безопасная с точки зрения памяти реализация, которая включает в себя значительные оптимизации, которые не очевидны для реализации.

В следующем примере используется `AsyncLocalStorage` для создания простого регистратора, который назначает идентификаторы входящим HTTP-запросам и включает их в сообщения, регистрируемые внутри каждого запроса.

::: code-group
```js [ESM]
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Представьте любую цепочку асинхронных операций здесь
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Выводит:
//   0: start
//   1: start
//   0: finish
//   1: finish
```

```js [CJS]
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Представьте любую цепочку асинхронных операций здесь
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Выводит:
//   0: start
//   1: start
//   0: finish
//   1: finish
```
:::

Каждый экземпляр `AsyncLocalStorage` поддерживает независимый контекст хранения. Несколько экземпляров могут безопасно существовать одновременно без риска помешать данным друг друга.


### `new AsyncLocalStorage()` {#new-asynclocalstorage}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.7.0, v18.16.0 | Удалена экспериментальная опция onPropagate. |
| v19.2.0, v18.13.0 | Добавлена опция onPropagate. |
| v13.10.0, v12.17.0 | Добавлено в: v13.10.0, v12.17.0 |
:::

Создает новый экземпляр `AsyncLocalStorage`. Хранилище доступно только внутри вызова `run()` или после вызова `enterWith()`.

### Статический метод: `AsyncLocalStorage.bind(fn)` {#static-method-asynclocalstoragebindfn}

**Добавлено в: v19.8.0, v18.16.0**

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которую нужно привязать к текущему контексту выполнения.
- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Новую функцию, которая вызывает `fn` в захваченном контексте выполнения.

Привязывает заданную функцию к текущему контексту выполнения.

### Статический метод: `AsyncLocalStorage.snapshot()` {#static-method-asynclocalstoragesnapshot}

**Добавлено в: v19.8.0, v18.16.0**

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Новую функцию с сигнатурой `(fn: (...args) : R, ...args) : R`.

Захватывает текущий контекст выполнения и возвращает функцию, которая принимает функцию в качестве аргумента. Всякий раз, когда вызывается возвращенная функция, она вызывает функцию, переданную ей, в захваченном контексте.

```js [ESM]
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // возвращает 123
```
AsyncLocalStorage.snapshot() может заменить использование AsyncResource для простых целей отслеживания асинхронного контекста, например:

```js [ESM]
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // возвращает 123
```

### `asyncLocalStorage.disable()` {#asynclocalstoragedisable}

**Добавлено в версии: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Experimental
:::

Отключает экземпляр `AsyncLocalStorage`. Все последующие вызовы `asyncLocalStorage.getStore()` будут возвращать `undefined` до тех пор, пока снова не будет вызван `asyncLocalStorage.run()` или `asyncLocalStorage.enterWith()`.

При вызове `asyncLocalStorage.disable()` все текущие контексты, связанные с экземпляром, будут закрыты.

Вызов `asyncLocalStorage.disable()` необходим, прежде чем `asyncLocalStorage` можно будет удалить сборщиком мусора. Это не относится к хранилищам, предоставляемым `asyncLocalStorage`, поскольку эти объекты собираются сборщиком мусора вместе с соответствующими асинхронными ресурсами.

Используйте этот метод, когда `asyncLocalStorage` больше не используется в текущем процессе.

### `asyncLocalStorage.getStore()` {#asynclocalstoragegetstore}

**Добавлено в версии: v13.10.0, v12.17.0**

- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Возвращает текущее хранилище. Если вызывается вне асинхронного контекста, инициализированного вызовом `asyncLocalStorage.run()` или `asyncLocalStorage.enterWith()`, возвращает `undefined`.

### `asyncLocalStorage.enterWith(store)` {#asynclocalstorageenterwithstore}

**Добавлено в версии: v13.11.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Experimental
:::

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Переходит в контекст на оставшуюся часть текущего синхронного выполнения, а затем сохраняет хранилище во всех последующих асинхронных вызовах.

Пример:

```js [ESM]
const store = { id: 1 };
// Заменяет предыдущее хранилище заданным объектом хранилища
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Возвращает объект хранилища
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Возвращает тот же объект
});
```
Этот переход будет продолжаться на протяжении *всего* синхронного выполнения. Это означает, что, например, если вход в контекст произошел внутри обработчика событий, последующие обработчики событий также будут выполняться в этом контексте, если они специально не привязаны к другому контексту с помощью `AsyncResource`. Вот почему `run()` следует предпочитать `enterWith()`, если нет веских причин для использования последнего метода.

```js [ESM]
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Возвращает тот же объект
});

asyncLocalStorage.getStore(); // Возвращает undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Возвращает тот же объект
```

### `asyncLocalStorage.run(store, callback[, ...args])` {#asynclocalstoragerunstore-callback-args}

**Добавлено в версии: v13.10.0, v12.17.0**

- `store` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Синхронно выполняет функцию в контексте и возвращает её возвращаемое значение. Хранилище недоступно за пределами функции обратного вызова. Хранилище доступно для любых асинхронных операций, созданных внутри обратного вызова.

Необязательные `args` передаются в функцию обратного вызова.

Если функция обратного вызова выдает ошибку, ошибка также выдается `run()`. На стек вызовов это не влияет, и из контекста происходит выход.

Пример:

```js [ESM]
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Возвращает объект хранилища
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Возвращает объект хранилища
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Возвращает undefined
  // Ошибка будет перехвачена здесь
}
```
### `asyncLocalStorage.exit(callback[, ...args])` {#asynclocalstorageexitcallback-args}

**Добавлено в версии: v13.10.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Синхронно выполняет функцию вне контекста и возвращает её возвращаемое значение. Хранилище недоступно внутри функции обратного вызова или асинхронных операций, созданных внутри обратного вызова. Любой вызов `getStore()`, выполненный внутри функции обратного вызова, всегда будет возвращать `undefined`.

Необязательные `args` передаются в функцию обратного вызова.

Если функция обратного вызова выдает ошибку, ошибка также выдается `exit()`. На стек вызовов это не влияет, и происходит повторный вход в контекст.

Пример:

```js [ESM]
// Внутри вызова run
try {
  asyncLocalStorage.getStore(); // Возвращает объект или значение хранилища
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Возвращает undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Возвращает тот же объект или значение
  // Ошибка будет перехвачена здесь
}
```

### Использование с `async/await` {#usage-with-async/await}

Если внутри асинхронной функции только один вызов `await` должен выполняться в контексте, следует использовать следующий шаблон:

```js [ESM]
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // Будет ожидаться возвращаемое значение foo
  });
}
```
В этом примере хранилище доступно только в функции обратного вызова и функциях, вызываемых `foo`. Вне `run` вызов `getStore` вернет `undefined`.

### Устранение неполадок: Потеря контекста {#troubleshooting-context-loss}

В большинстве случаев `AsyncLocalStorage` работает без проблем. В редких ситуациях текущее хранилище теряется в одной из асинхронных операций.

Если ваш код основан на обратных вызовах, достаточно промисифицировать его с помощью [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal), чтобы он начал работать с нативными промисами.

Если вам необходимо использовать API, основанный на обратных вызовах, или ваш код предполагает пользовательскую реализацию thenable, используйте класс [`AsyncResource`](/ru/nodejs/api/async_context#class-asyncresource) для связывания асинхронной операции с правильным контекстом выполнения. Найдите вызов функции, ответственный за потерю контекста, зарегистрировав содержимое `asyncLocalStorage.getStore()` после вызовов, которые, как вы подозреваете, ответственны за потерю. Когда код регистрирует `undefined`, последний вызванный обратный вызов, вероятно, является причиной потери контекста.

## Класс: `AsyncResource` {#class-asyncresource}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.4.0 | AsyncResource теперь является стабильным. Ранее он был экспериментальным. |
:::

Класс `AsyncResource` предназначен для расширения асинхронными ресурсами встраивателя. С его помощью пользователи могут легко запускать события жизненного цикла своих собственных ресурсов.

Хук `init` будет срабатывать при создании экземпляра `AsyncResource`.

Ниже представлен обзор API `AsyncResource`.

::: code-group
```js [ESM]
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() предназначен для расширения. Создание нового
// AsyncResource() также запускает init. Если triggerAsyncId опущен, то
// используется async_hook.executionAsyncId().
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Запустите функцию в контексте выполнения ресурса. Это будет
// * установить контекст ресурса
// * вызвать обратные вызовы AsyncHooks before
// * вызвать предоставленную функцию `fn` с предоставленными аргументами
// * вызвать обратные вызовы AsyncHooks after
// * восстановить исходный контекст выполнения
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Вызвать обратные вызовы AsyncHooks destroy.
asyncResource.emitDestroy();

// Вернуть уникальный ID, присвоенный экземпляру AsyncResource.
asyncResource.asyncId();

// Вернуть ID триггера для экземпляра AsyncResource.
asyncResource.triggerAsyncId();
```

```js [CJS]
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() предназначен для расширения. Создание нового
// AsyncResource() также запускает init. Если triggerAsyncId опущен, то
// используется async_hook.executionAsyncId().
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Запустите функцию в контексте выполнения ресурса. Это будет
// * установить контекст ресурса
// * вызвать обратные вызовы AsyncHooks before
// * вызвать предоставленную функцию `fn` с предоставленными аргументами
// * вызвать обратные вызовы AsyncHooks after
// * восстановить исходный контекст выполнения
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Вызвать обратные вызовы AsyncHooks destroy.
asyncResource.emitDestroy();

// Вернуть уникальный ID, присвоенный экземпляру AsyncResource.
asyncResource.asyncId();

// Вернуть ID триггера для экземпляра AsyncResource.
asyncResource.triggerAsyncId();
```
:::


### `new AsyncResource(type[, options])` {#new-asyncresourcetype-options}

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип асинхронного события.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `triggerAsyncId` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор контекста выполнения, который создал это асинхронное событие. **По умолчанию:** `executionAsyncId()`.
    - `requireManualDestroy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, отключает `emitDestroy`, когда объект собирается сборщиком мусора. Обычно это не нужно устанавливать (даже если `emitDestroy` вызывается вручную), если только не извлекается `asyncId` ресурса и не вызывается чувствительный API `emitDestroy` с ним. Если установлено значение `false`, вызов `emitDestroy` при сборке мусора будет происходить только в том случае, если есть хотя бы один активный хук `destroy`. **По умолчанию:** `false`.

Пример использования:

```js [ESM]
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```
### Статический метод: `AsyncResource.bind(fn[, type[, thisArg]])` {#static-method-asyncresourcebindfn-type-thisarg}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Свойство `asyncResource`, добавленное к связанной функции, объявлено устаревшим и будет удалено в будущей версии. |
| v17.8.0, v16.15.0 | Изменено значение по умолчанию, когда `thisArg` не определен, чтобы использовать `this` из вызывающего объекта. |
| v16.0.0 | Добавлен необязательный thisArg. |
| v14.8.0, v12.19.0 | Добавлено в: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которую нужно привязать к текущему контексту выполнения.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательное имя, которое нужно связать с базовым `AsyncResource`.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Привязывает данную функцию к текущему контексту выполнения.


### `asyncResource.bind(fn[, thisArg])` {#asyncresourcebindfn-thisarg}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Свойство `asyncResource`, добавленное в связанную функцию, объявлено устаревшим и будет удалено в будущей версии. |
| v17.8.0, v16.15.0 | Изменено поведение по умолчанию, когда `thisArg` не определен, чтобы использовать `this` из вызывающей стороны. |
| v16.0.0 | Добавлен необязательный аргумент thisArg. |
| v14.8.0, v12.19.0 | Добавлено в: v14.8.0, v12.19.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которую необходимо привязать к текущему `AsyncResource`.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Привязывает данную функцию для выполнения в области видимости этого `AsyncResource`.

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])` {#asyncresourceruninasyncscopefn-thisarg-args}

**Добавлено в: v9.6.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которую необходимо вызвать в контексте выполнения этого асинхронного ресурса.
- `thisArg` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Получатель, который будет использоваться для вызова функции.
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Необязательные аргументы, которые будут переданы в функцию.

Вызывает предоставленную функцию с предоставленными аргументами в контексте выполнения асинхронного ресурса. Это установит контекст, вызовет обратные вызовы AsyncHooks before, вызовет функцию, вызовет обратные вызовы AsyncHooks after, а затем восстановит исходный контекст выполнения.

### `asyncResource.emitDestroy()` {#asyncresourceemitdestroy}

- Возвращает: [\<AsyncResource\>](/ru/nodejs/api/async_hooks#class-asyncresource) Ссылка на `asyncResource`.

Вызывает все хуки `destroy`. Это должно быть вызвано только один раз. Будет выдана ошибка, если это будет вызвано более одного раза. Это **должно** быть вызвано вручную. Если ресурс будет собран GC, то хуки `destroy` никогда не будут вызваны.


### `asyncResource.asyncId()` {#asyncresourceasyncid}

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Уникальный `asyncId`, присвоенный ресурсу.

### `asyncResource.triggerAsyncId()` {#asyncresourcetriggerasyncid}

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Тот же `triggerAsyncId`, который передается в конструктор `AsyncResource`.

### Использование `AsyncResource` для пула потоков `Worker` {#using-asyncresource-for-a-worker-thread-pool}

Следующий пример показывает, как использовать класс `AsyncResource` для правильного предоставления асинхронного отслеживания для пула [`Worker`](/ru/nodejs/api/worker_threads#class-worker). Другие пулы ресурсов, такие как пулы соединений с базой данных, могут следовать аналогичной модели.

Предположим, что задача состоит в сложении двух чисел, используя файл с именем `task_processor.js` со следующим содержимым:

::: code-group
```js [ESM]
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```js [CJS]
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```
:::

Пул Worker вокруг него может использовать следующую структуру:

::: code-group
```js [ESM]
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo` используются только один раз.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Каждый раз, когда испускается kWorkerFreedEvent, отправляйте
    // следующую задачу, ожидающую в очереди, если таковая имеется.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // В случае успеха: Вызовите обратный вызов, который был передан в `runTask`,
      // удалите `TaskInfo`, связанную с Worker, и снова пометьте его как свободный.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // В случае необработанного исключения: Вызовите обратный вызов, который был передан в
      // `runTask` с ошибкой.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Удалите worker из списка и запустите новый Worker, чтобы заменить
      // текущий.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // Нет свободных потоков, дождитесь, пока рабочий поток станет свободным.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```js [CJS]
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo` используются только один раз.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Каждый раз, когда испускается kWorkerFreedEvent, отправляйте
    // следующую задачу, ожидающую в очереди, если таковая имеется.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // В случае успеха: Вызовите обратный вызов, который был передан в `runTask`,
      // удалите `TaskInfo`, связанную с Worker, и снова пометьте его как свободный.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // В случае необработанного исключения: Вызовите обратный вызов, который был передан в
      // `runTask` с ошибкой.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Удалите worker из списка и запустите новый Worker, чтобы заменить
      // текущий.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // Нет свободных потоков, дождитесь, пока рабочий поток станет свободным.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```
:::

Без явного отслеживания, добавленного объектами `WorkerPoolTaskInfo`, казалось бы, что обратные вызовы связаны с отдельными объектами `Worker`. Однако создание `Worker` не связано с созданием задач и не предоставляет информации о том, когда задачи были запланированы.

Этот пул можно использовать следующим образом:

::: code-group
```js [ESM]
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```js [CJS]
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```
:::


### Интеграция `AsyncResource` с `EventEmitter` {#integrating-asyncresource-with-eventemitter}

Обработчики событий, вызываемые [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter), могут выполняться в другом контексте исполнения, отличном от того, который был активен при вызове `eventEmitter.on()`.

В следующем примере показано, как использовать класс `AsyncResource` для правильной связи обработчика событий с правильным контекстом исполнения. Тот же подход можно применить к [`Stream`](/ru/nodejs/api/stream#stream) или аналогичному классу, управляемому событиями.

::: code-group
```js [ESM]
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Контекст исполнения привязан к текущей внешней области видимости.
  }));
  req.on('close', () => {
    // Контекст исполнения привязан к области, которая вызвала испускание 'close'.
  });
  res.end();
}).listen(3000);
```

```js [CJS]
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Контекст исполнения привязан к текущей внешней области видимости.
  }));
  req.on('close', () => {
    // Контекст исполнения привязан к области, которая вызвала испускание 'close'.
  });
  res.end();
}).listen(3000);
```
:::

