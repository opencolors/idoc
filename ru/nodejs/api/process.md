---
title: Документация API процесса Node.js
description: Подробная документация по модулю процесса Node.js, охватывающая управление процессами, переменные окружения, сигналы и многое другое.
head:
  - - meta
    - name: og:title
      content: Документация API процесса Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Подробная документация по модулю процесса Node.js, охватывающая управление процессами, переменные окружения, сигналы и многое другое.
  - - meta
    - name: twitter:title
      content: Документация API процесса Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Подробная документация по модулю процесса Node.js, охватывающая управление процессами, переменные окружения, сигналы и многое другое.
---


# Process {#process}

**Исходный код:** [lib/process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/process.js)

Объект `process` предоставляет информацию о текущем процессе Node.js и позволяет управлять им.

::: code-group
```js [ESM]
import process from 'node:process';
```

```js [CJS]
const process = require('node:process');
```
:::

## События Process {#process-events}

Объект `process` является экземпляром [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter).

### Событие: `'beforeExit'` {#event-beforeexit}

**Добавлено в: v0.11.12**

Событие `'beforeExit'` возникает, когда Node.js опустошает свой цикл событий и не имеет дополнительной работы для планирования. Обычно процесс Node.js завершается, когда нет запланированной работы, но слушатель, зарегистрированный на событии `'beforeExit'`, может выполнять асинхронные вызовы и, тем самым, заставлять процесс Node.js продолжаться.

Функция обратного вызова слушателя вызывается со значением [`process.exitCode`](/ru/nodejs/api/process#processexitcode_1), переданным в качестве единственного аргумента.

Событие `'beforeExit'` *не* возникает при условиях, вызывающих явное завершение, таких как вызов [`process.exit()`](/ru/nodejs/api/process#processexitcode) или необработанные исключения.

Событие `'beforeExit'` *не* следует использовать в качестве альтернативы событию `'exit'`, если только намерение не состоит в том, чтобы запланировать дополнительную работу.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Событие Process beforeExit с кодом: ', code);
});

process.on('exit', (code) => {
  console.log('Событие Process exit с кодом: ', code);
});

console.log('Это сообщение отображается первым.');

// Выводит:
// Это сообщение отображается первым.
// Событие Process beforeExit с кодом: 0
// Событие Process exit с кодом: 0
```

```js [CJS]
const process = require('node:process');

process.on('beforeExit', (code) => {
  console.log('Событие Process beforeExit с кодом: ', code);
});

process.on('exit', (code) => {
  console.log('Событие Process exit с кодом: ', code);
});

console.log('Это сообщение отображается первым.');

// Выводит:
// Это сообщение отображается первым.
// Событие Process beforeExit с кодом: 0
// Событие Process exit с кодом: 0
```
:::


### Событие: `'disconnect'` {#event-disconnect}

**Добавлено в: v0.7.7**

Если процесс Node.js запущен с IPC каналом (см. документацию [Дочерний процесс](/ru/nodejs/api/child_process) и [Кластер](/ru/nodejs/api/cluster)), событие `'disconnect'` будет сгенерировано при закрытии IPC канала.

### Событие: `'exit'` {#event-exit}

**Добавлено в: v0.1.7**

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Событие `'exit'` генерируется, когда процесс Node.js собирается завершиться в результате:

- Явного вызова метода `process.exit()`;
- Цикл событий Node.js больше не имеет дополнительной работы для выполнения.

Не существует способа предотвратить завершение цикла событий на этом этапе, и как только все слушатели `'exit'` завершат работу, процесс Node.js завершится.

Функция обратного вызова слушателя вызывается с кодом выхода, указанным либо свойством [`process.exitCode`](/ru/nodejs/api/process#processexitcode_1), либо аргументом `exitCode`, переданным методу [`process.exit()`](/ru/nodejs/api/process#processexitcode).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
:::

Функции прослушивания **должны** выполнять только **синхронные** операции. Процесс Node.js завершится немедленно после вызова слушателей события `'exit'`, в результате чего любая дополнительная работа, все еще находящаяся в очереди в цикле событий, будет отменена. Например, в следующем примере таймаут никогда не произойдет:

::: code-group
```js [ESM]
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```js [CJS]
const process = require('node:process');

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```
:::


### Event: `'message'` {#event-message}

**Добавлено в версии: v0.5.10**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) — разобранный JSON-объект или сериализуемое примитивное значение.
- `sendHandle` [\<net.Server\>](/ru/nodejs/api/net#class-netserver) | [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) — объект [`net.Server`](/ru/nodejs/api/net#class-netserver) или [`net.Socket`](/ru/nodejs/api/net#class-netsocket) или undefined.

Если процесс Node.js порожден с использованием IPC-канала (см. документацию по [Дочерним процессам](/ru/nodejs/api/child_process) и [Кластерам](/ru/nodejs/api/cluster)), событие `'message'` возникает всякий раз, когда дочерний процесс получает сообщение, отправленное родительским процессом с использованием [`childprocess.send()`](/ru/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

Сообщение проходит через сериализацию и разбор. Полученное сообщение может отличаться от исходного отправленного.

Если при порождении процесса опция `serialization` была установлена в `advanced`, аргумент `message` может содержать данные, которые JSON не может представить. Подробнее см. [Расширенная сериализация для `child_process`](/ru/nodejs/api/child_process#advanced-serialization).

### Event: `'multipleResolves'` {#event-multipleresolves}

**Добавлено в версии: v10.12.0**

**Устарело с версии: v17.6.0, v16.15.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Устарело
:::

- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) — тип разрешения. Один из `'resolve'` или `'reject'`.
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) — промис, который разрешился или был отклонен более одного раза.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) — значение, с которым промис был либо разрешен, либо отклонен после первоначального разрешения.

Событие `'multipleResolves'` возникает всякий раз, когда `Promise` был:

- Разрешен более одного раза.
- Отклонен более одного раза.
- Отклонен после разрешения.
- Разрешен после отклонения.

Это полезно для отслеживания потенциальных ошибок в приложении при использовании конструктора `Promise`, поскольку множественные разрешения молча проглатываются. Однако возникновение этого события не обязательно указывает на ошибку. Например, [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) может вызвать событие `'multipleResolves'`.

Из-за ненадежности события в таких случаях, как пример с [`Promise.race()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) выше, оно было объявлено устаревшим.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```

```js [CJS]
const process = require('node:process');

process.on('multipleResolves', (type, promise, reason) => {
  console.error(type, promise, reason);
  setImmediate(() => process.exit(1));
});

async function main() {
  try {
    return await new Promise((resolve, reject) => {
      resolve('First call');
      resolve('Swallowed resolve');
      reject(new Error('Swallowed reject'));
    });
  } catch {
    throw new Error('Failed');
  }
}

main().then(console.log);
// resolve: Promise { 'First call' } 'Swallowed resolve'
// reject: Promise { 'First call' } Error: Swallowed reject
//     at Promise (*)
//     at new Promise (<anonymous>)
//     at main (*)
// First call
```
:::


### Событие: `'rejectionHandled'` {#event-rejectionhandled}

**Добавлено в: v1.4.1**

- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Обработанный с задержкой промис.

Событие `'rejectionHandled'` возникает, когда `Promise` был отклонен, и к нему был прикреплен обработчик ошибок (например, с использованием [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)) позже, чем через один проход цикла событий Node.js.

Объект `Promise` ранее был бы сгенерирован в событии `'unhandledRejection'`, но в процессе обработки получил обработчик отклонения.

Не существует понятия верхнего уровня для цепочки `Promise`, на котором всегда можно обработать отклонения. Будучи по своей сути асинхронным по своей природе, отклонение `Promise` может быть обработано в будущем, возможно, намного позже, чем проход цикла событий, необходимый для создания события `'unhandledRejection'`.

Другой способ сформулировать это заключается в том, что, в отличие от синхронного кода, где существует постоянно растущий список необработанных исключений, в Promises может быть растущий и сокращающийся список необработанных отклонений.

В синхронном коде событие `'uncaughtException'` возникает, когда список необработанных исключений растет.

В асинхронном коде событие `'unhandledRejection'` возникает, когда список необработанных отклонений растет, а событие `'rejectionHandled'` возникает, когда список необработанных отклонений сокращается.

::: code-group
```js [ESM]
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```js [CJS]
const process = require('node:process');

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
:::

В этом примере `Map` `unhandledRejections` будет расти и сокращаться с течением времени, отражая отклонения, которые начинаются необработанными, а затем становятся обработанными. Можно записывать такие ошибки в журнал ошибок, либо периодически (что, вероятно, лучше всего для долго выполняющегося приложения), либо при выходе из процесса (что, вероятно, наиболее удобно для скриптов).


### Событие: `'workerMessage'` {#event-workermessage}

**Добавлено в: v22.5.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение, переданное с использованием [`postMessageToThread()`](/ru/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).
- `source` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор передающего рабочего потока или `0` для основного потока.

Событие `'workerMessage'` генерируется для любого входящего сообщения, отправленного другой стороной с использованием [`postMessageToThread()`](/ru/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).

### Событие: `'uncaughtException'` {#event-uncaughtexception}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.0.0, v10.17.0 | Добавлен аргумент `origin`. |
| v0.1.18 | Добавлено в: v0.1.18 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Неперехваченное исключение.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает, происходит ли исключение из-за необработанного отклонения или из-за синхронной ошибки. Может быть `'uncaughtException'` или `'unhandledRejection'`. Последнее используется, когда исключение происходит в асинхронном контексте на основе `Promise` (или если `Promise` отклоняется) и флаг [`--unhandled-rejections`](/ru/nodejs/api/cli#--unhandled-rejectionsmode) установлен в `strict` или `throw` (который является значением по умолчанию), и отклонение не обрабатывается, или когда отклонение происходит во время фазы статической загрузки модуля ES точки входа командной строки.

Событие `'uncaughtException'` генерируется, когда неперехваченное исключение JavaScript поднимается обратно в цикл событий. По умолчанию Node.js обрабатывает такие исключения, печатая трассировку стека в `stderr` и завершая работу с кодом 1, переопределяя любое ранее установленное значение [`process.exitCode`](/ru/nodejs/api/process#processexitcode_1). Добавление обработчика для события `'uncaughtException'` переопределяет это поведение по умолчанию. В качестве альтернативы, измените [`process.exitCode`](/ru/nodejs/api/process#processexitcode_1) в обработчике `'uncaughtException'`, что приведет к завершению процесса с указанным кодом выхода. В противном случае, при наличии такого обработчика процесс завершится с кодом 0.



::: code-group
```js [ESM]
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```js [CJS]
const process = require('node:process');
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```
:::

Можно отслеживать события `'uncaughtException'`, не переопределяя поведение по умолчанию для завершения процесса, установив прослушиватель `'uncaughtExceptionMonitor'`.


#### Предупреждение: Корректное использование `'uncaughtException'` {#warning-using-uncaughtexception-correctly}

`'uncaughtException'` — это грубый механизм обработки исключений, предназначенный для использования только в крайнем случае. Это событие *не следует* использовать как эквивалент `On Error Resume Next`. Необработанные исключения по определению означают, что приложение находится в неопределенном состоянии. Попытка возобновить код приложения без надлежащего восстановления после исключения может вызвать дополнительные непредвиденные и непредсказуемые проблемы.

Исключения, возникающие внутри обработчика событий, не будут перехвачены. Вместо этого процесс завершится с ненулевым кодом выхода, и будет распечатана трассировка стека. Это сделано для предотвращения бесконечной рекурсии.

Попытка возобновить нормальную работу после необработанного исключения может быть похожа на выдергивание шнура питания при обновлении компьютера. В девяти из десяти случаев ничего не происходит. Но в десятый раз система повреждается.

Правильное использование `'uncaughtException'` заключается в выполнении синхронной очистки выделенных ресурсов (например, дескрипторов файлов, дескрипторов и т. д.) перед завершением процесса. **Небезопасно возобновлять нормальную работу после
<code>'uncaughtException'</code>.**

Чтобы перезапустить упавшее приложение более надежным способом, независимо от того, генерируется `'uncaughtException'` или нет, следует использовать внешний монитор в отдельном процессе для обнаружения сбоев приложения и восстановления или перезапуска по мере необходимости.

### Событие: `'uncaughtExceptionMonitor'` {#event-uncaughtexceptionmonitor}

**Добавлено в: v13.7.0, v12.17.0**

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Неперехваченное исключение.
- `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает, происходит ли исключение из-за необработанного отклонения или из-за синхронных ошибок. Может быть `'uncaughtException'` или `'unhandledRejection'`. Последнее используется, когда исключение происходит в асинхронном контексте на основе `Promise` (или если `Promise` отклонен), и флаг [`--unhandled-rejections`](/ru/nodejs/api/cli#--unhandled-rejectionsmode) установлен в `strict` или `throw` (который является значением по умолчанию), и отклонение не обработано, или когда отклонение происходит во время фазы статической загрузки ES-модуля точки входа командной строки.

Событие `'uncaughtExceptionMonitor'` генерируется до того, как генерируется событие `'uncaughtException'` или вызывается хук, установленный через [`process.setUncaughtExceptionCaptureCallback()`](/ru/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

Установка прослушивателя `'uncaughtExceptionMonitor'` не меняет поведение после того, как событие `'uncaughtException'` было сгенерировано. Процесс все равно завершится с ошибкой, если не установлен прослушиватель `'uncaughtException'`.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```

```js [CJS]
const process = require('node:process');

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```
:::


### Событие: `'unhandledRejection'` {#event-unhandledrejection}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.0.0 | Отсутствие обработки отклонений `Promise` считается устаревшим. |
| v6.6.0 | Необработанные отклонения `Promise` теперь будут вызывать предупреждение процесса. |
| v1.4.1 | Добавлено в: v1.4.1 |
:::

- `reason` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Объект, которым был отклонен promise (обычно объект [`Error`](/ru/nodejs/api/errors#class-error)).
- `promise` [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Отклоненный promise.

Событие `'unhandledRejection'` испускается всякий раз, когда `Promise` отклоняется и к promise не прикреплен обработчик ошибок в течение одного витка цикла событий. При программировании с использованием Promises исключения инкапсулируются в виде "отклоненных promises". Отклонения можно перехватывать и обрабатывать с помощью [`promise.catch()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) и они распространяются по цепочке `Promise`. Событие `'unhandledRejection'` полезно для обнаружения и отслеживания promises, которые были отклонены, но отклонения которых еще не были обработаны.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Здесь может быть код, специфичный для приложения: ведение журнала, выброс ошибки или другая логика
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Обратите внимание на опечатку (`pasre`)
}); // Нет `.catch()` или `.then()`
```

```js [CJS]
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Здесь может быть код, специфичный для приложения: ведение журнала, выброс ошибки или другая логика
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Обратите внимание на опечатку (`pasre`)
}); // Нет `.catch()` или `.then()`
```
:::

Следующее также приведет к испусканию события `'unhandledRejection'`:

::: code-group
```js [ESM]
import process from 'node:process';

function SomeResource() {
  // Изначально устанавливаем статус загрузки в отклоненный promise
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// нет .catch или .then на resource.loaded как минимум один виток
```

```js [CJS]
const process = require('node:process');

function SomeResource() {
  // Изначально устанавливаем статус загрузки в отклоненный promise
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// нет .catch или .then на resource.loaded как минимум один виток
```
:::

В этом примере можно отследить отклонение как ошибку разработчика, как это обычно бывает для других событий `'unhandledRejection'`. Чтобы устранить такие сбои, к `resource.loaded` можно прикрепить нерабочий обработчик [`.catch(() =\> { })`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch), что предотвратит испускание события `'unhandledRejection'`.


### Событие: `'warning'` {#event-warning}

**Добавлено в: v6.0.0**

- `warning` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ключевые свойства предупреждения:
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя предупреждения. **По умолчанию:** `'Warning'`.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Предоставляемое системой описание предупреждения.
    - `stack` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Трассировка стека до места в коде, где было выдано предупреждение.

Событие `'warning'` возникает всякий раз, когда Node.js выдаёт предупреждение процесса.

Предупреждение процесса аналогично ошибке в том, что оно описывает исключительные условия, которые доводятся до сведения пользователя. Однако предупреждения не являются частью обычного потока обработки ошибок Node.js и JavaScript. Node.js может выдавать предупреждения всякий раз, когда он обнаруживает плохие методы кодирования, которые могут привести к субоптимальной производительности приложения, ошибкам или уязвимостям безопасности.

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // Вывести имя предупреждения
  console.warn(warning.message); // Вывести сообщение предупреждения
  console.warn(warning.stack);   // Вывести трассировку стека
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // Вывести имя предупреждения
  console.warn(warning.message); // Вывести сообщение предупреждения
  console.warn(warning.stack);   // Вывести трассировку стека
});
```
:::

По умолчанию Node.js будет печатать предупреждения процесса в `stderr`. Параметр командной строки `--no-warnings` можно использовать для подавления вывода в консоль по умолчанию, но событие `'warning'` по-прежнему будет генерироваться объектом `process`. В настоящее время невозможно подавить определенные типы предупреждений, кроме предупреждений об устаревании. Чтобы подавить предупреждения об устаревании, ознакомьтесь с флагом [`--no-deprecation`](/ru/nodejs/api/cli#--no-deprecation).

В следующем примере показано предупреждение, которое выводится в `stderr`, когда к событию было добавлено слишком много прослушивателей:

```bash [BASH]
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
В отличие от этого, следующий пример отключает вывод предупреждений по умолчанию и добавляет пользовательский обработчик для события `'warning'`:

```bash [BASH]
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```
Параметр командной строки `--trace-warnings` можно использовать для того, чтобы вывод в консоль по умолчанию для предупреждений включал полную трассировку стека предупреждения.

Запуск Node.js с использованием флага командной строки `--throw-deprecation` приведет к тому, что пользовательские предупреждения об устаревании будут выдаваться как исключения.

Использование флага командной строки `--trace-deprecation` приведет к тому, что пользовательское устаревание будет напечатано в `stderr` вместе с трассировкой стека.

Использование флага командной строки `--no-deprecation` подавит все отчеты о пользовательском устаревании.

Флаги командной строки `*-deprecation` влияют только на предупреждения, которые используют имя `'DeprecationWarning'`.


#### Вывод пользовательских предупреждений {#emitting-custom-warnings}

Смотрите метод [`process.emitWarning()`](/ru/nodejs/api/process#processemitwarningwarning-type-code-ctor) для выдачи пользовательских или специфичных для приложения предупреждений.

#### Имена предупреждений Node.js {#nodejs-warning-names}

Не существует строгих правил для типов предупреждений (как определено свойством `name`), выдаваемых Node.js. Новые типы предупреждений могут быть добавлены в любое время. Вот несколько наиболее распространенных типов предупреждений:

- `'DeprecationWarning'` - Указывает на использование устаревшего API или функции Node.js. Такие предупреждения должны включать свойство `'code'`, определяющее [код устаревания](/ru/nodejs/api/deprecations).
- `'ExperimentalWarning'` - Указывает на использование экспериментального API или функции Node.js. Такие функции следует использовать с осторожностью, поскольку они могут измениться в любое время и не подпадают под действие тех же строгих правил семантического версионирования и долгосрочной поддержки, что и поддерживаемые функции.
- `'MaxListenersExceededWarning'` - Указывает на то, что на `EventEmitter` или `EventTarget` зарегистрировано слишком много слушателей для данного события. Часто это является признаком утечки памяти.
- `'TimeoutOverflowWarning'` - Указывает на то, что числовое значение, которое не помещается в 32-разрядное целое число со знаком, было передано функциям `setTimeout()` или `setInterval()`.
- `'TimeoutNegativeWarning'` - Указывает на то, что отрицательное число было передано функциям `setTimeout()` или `setInterval()`.
- `'TimeoutNaNWarning'` - Указывает на то, что значение, не являющееся числом, было передано функциям `setTimeout()` или `setInterval()`.
- `'UnsupportedWarning'` - Указывает на использование неподдерживаемой опции или функции, которая будет проигнорирована, а не обработана как ошибка. Одним из примеров является использование сообщения о состоянии HTTP-ответа при использовании API совместимости HTTP/2.

### Событие: `'worker'` {#event-worker}

**Добавлено в: v16.2.0, v14.18.0**

- `worker` [\<Worker\>](/ru/nodejs/api/worker_threads#class-worker) Созданный [\<Worker\>](/ru/nodejs/api/worker_threads#class-worker).

Событие `'worker'` генерируется после создания нового потока [\<Worker\>](/ru/nodejs/api/worker_threads#class-worker).


### Сигнальные события {#signal-events}

Сигнальные события будут испускаться, когда процесс Node.js получает сигнал. Пожалуйста, обратитесь к [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) для получения списка стандартных POSIX-сигналов, таких как `'SIGINT'`, `'SIGHUP'` и т.д.

Сигналы недоступны в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).

Обработчик сигнала получит имя сигнала (`'SIGINT'`, `'SIGTERM'` и т.д.) в качестве первого аргумента.

Имя каждого события будет общим названием сигнала в верхнем регистре (например, `'SIGINT'` для сигналов `SIGINT`).

::: code-group
```js [ESM]
import process from 'node:process';

// Начинаем чтение из stdin, чтобы процесс не завершался.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Использование одной функции для обработки нескольких сигналов
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```js [CJS]
const process = require('node:process');

// Начинаем чтение из stdin, чтобы процесс не завершался.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Использование одной функции для обработки нескольких сигналов
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
:::

- `'SIGUSR1'` зарезервирован Node.js для запуска [отладчика](/ru/nodejs/api/debugger). Можно установить слушатель, но это может помешать работе отладчика.
- `'SIGTERM'` и `'SIGINT'` имеют обработчики по умолчанию на платформах, отличных от Windows, которые сбрасывают режим терминала перед выходом с кодом `128 + номер сигнала`. Если на один из этих сигналов установлен слушатель, его поведение по умолчанию будет удалено (Node.js больше не будет завершаться).
- `'SIGPIPE'` игнорируется по умолчанию. На него можно установить слушатель.
- `'SIGHUP'` генерируется в Windows при закрытии окна консоли, а на других платформах при различных аналогичных условиях. Смотрите [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7). На него можно установить слушатель, однако Node.js будет безусловно завершен Windows примерно через 10 секунд. На платформах, отличных от Windows, поведение `SIGHUP` по умолчанию заключается в завершении Node.js, но как только слушатель будет установлен, его поведение по умолчанию будет удалено.
- `'SIGTERM'` не поддерживается в Windows, но его можно прослушивать.
- `'SIGINT'` из терминала поддерживается на всех платформах и обычно может быть сгенерирован с помощью + (хотя это может быть настроено). Он не генерируется, когда включен [режим необработанного терминала](/ru/nodejs/api/tty#readstreamsetrawmodemode) и используется +.
- `'SIGBREAK'` доставляется в Windows при нажатии +. На платформах, отличных от Windows, его можно прослушивать, но нет возможности отправить или сгенерировать его.
- `'SIGWINCH'` доставляется при изменении размера консоли. В Windows это произойдет только при записи в консоль при перемещении курсора или при использовании читаемого tty в необработанном режиме.
- На `'SIGKILL'` нельзя установить слушатель, он безусловно завершит Node.js на всех платформах.
- На `'SIGSTOP'` нельзя установить слушатель.
- `'SIGBUS'`, `'SIGFPE'`, `'SIGSEGV'` и `'SIGILL'`, когда не вызываются искусственно с помощью [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2), по своей сути оставляют процесс в состоянии, из которого небезопасно вызывать JS-слушатели. Это может привести к тому, что процесс перестанет отвечать.
- `0` можно отправить для проверки существования процесса, он не имеет никакого эффекта, если процесс существует, но выдаст ошибку, если процесса не существует.

Windows не поддерживает сигналы, поэтому не имеет эквивалента завершения по сигналу, но Node.js предлагает некоторую эмуляцию с помощью [`process.kill()`](/ru/nodejs/api/process#processkillpid-signal) и [`subprocess.kill()`](/ru/nodejs/api/child_process#subprocesskillsignal):

- Отправка `SIGINT`, `SIGTERM` и `SIGKILL` приведет к безусловному завершению целевого процесса, и впоследствии подпроцесс сообщит, что процесс был завершен сигналом.
- Отправка сигнала `0` может использоваться как платформо-независимый способ проверки существования процесса.


## `process.abort()` {#processabort}

**Добавлено в версии: v0.7.0**

Метод `process.abort()` приводит к немедленному завершению процесса Node.js и создает файл дампа памяти.

Эта функция недоступна в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).

## `process.allowedNodeEnvironmentFlags` {#processallowednodeenvironmentflags}

**Добавлено в версии: v10.10.0**

- [\<Set\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

Свойство `process.allowedNodeEnvironmentFlags` является специальным `Set` только для чтения, содержащим флаги, допустимые в переменной окружения [`NODE_OPTIONS`](/ru/nodejs/api/cli#node_optionsoptions).

`process.allowedNodeEnvironmentFlags` расширяет `Set`, но переопределяет `Set.prototype.has` для распознавания нескольких различных возможных представлений флагов. `process.allowedNodeEnvironmentFlags.has()` вернет `true` в следующих случаях:

- Флаги могут опускать начальные одинарные (`-`) или двойные (`--`) дефисы; например, `inspect-brk` для `--inspect-brk` или `r` для `-r`.
- Флаги, передаваемые в V8 (как указано в `--v8-options`), могут заменять один или несколько *неначальных* дефисов на подчеркивание или наоборот; например, `--perf_basic_prof`, `--perf-basic-prof`, `--perf_basic-prof` и т. д.
- Флаги могут содержать один или несколько символов равенства (`=`); все символы после и включая первый знак равенства будут проигнорированы; например, `--stack-trace-limit=100`.
- Флаги *должны* быть допустимы в [`NODE_OPTIONS`](/ru/nodejs/api/cli#node_optionsoptions).

При итерации по `process.allowedNodeEnvironmentFlags` флаги будут появляться только *один раз*; каждый будет начинаться с одного или нескольких дефисов. Флаги, переданные в V8, будут содержать подчеркивания вместо неначальных дефисов:

::: code-group
```js [ESM]
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```js [CJS]
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```
:::

Методы `add()`, `clear()` и `delete()` из `process.allowedNodeEnvironmentFlags` ничего не делают и завершатся без ошибок.

Если Node.js был скомпилирован *без* поддержки [`NODE_OPTIONS`](/ru/nodejs/api/cli#node_optionsoptions) (показано в [`process.config`](/ru/nodejs/api/process#processconfig)), `process.allowedNodeEnvironmentFlags` будет содержать то, что *было бы* допустимо.


## `process.arch` {#processarch}

**Добавлено в: v0.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Архитектура процессора операционной системы, для которой был скомпилирован бинарник Node.js. Возможные значения: `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` и `'x64'`.

::: code-group
```js [ESM]
import { arch } from 'node:process';

console.log(`This processor architecture is ${arch}`);
```

```js [CJS]
const { arch } = require('node:process');

console.log(`This processor architecture is ${arch}`);
```
:::

## `process.argv` {#processargv}

**Добавлено в: v0.1.27**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `process.argv` возвращает массив, содержащий аргументы командной строки, переданные при запуске процесса Node.js. Первым элементом будет [`process.execPath`](/ru/nodejs/api/process#processexecpath). См. `process.argv0`, если требуется доступ к исходному значению `argv[0]`. Вторым элементом будет путь к выполняемому файлу JavaScript. Остальные элементы будут любыми дополнительными аргументами командной строки.

Например, предположим следующий скрипт для `process-args.js`:

::: code-group
```js [ESM]
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```js [CJS]
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
:::

Запуск процесса Node.js как:

```bash [BASH]
node process-args.js one two=three four
```
Сгенерирует вывод:

```text [TEXT]
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```
## `process.argv0` {#processargv0}

**Добавлено в: v6.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `process.argv0` хранит копию только для чтения исходного значения `argv[0]`, переданного при запуске Node.js.

```bash [BASH]
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.channel` {#processchannel}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Объект больше не предоставляет случайно нативные привязки C++. |
| v7.1.0 | Добавлено в: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если процесс Node.js был порожден с IPC-каналом (см. документацию по [Дочерним процессам](/ru/nodejs/api/child_process)), то свойство `process.channel` является ссылкой на IPC-канал. Если IPC-канал отсутствует, это свойство имеет значение `undefined`.

### `process.channel.ref()` {#processchannelref}

**Добавлено в: v7.1.0**

Этот метод заставляет IPC-канал поддерживать работу цикла событий процесса, если до этого был вызван метод `.unref()`.

Обычно это управляется количеством прослушивателей событий `'disconnect'` и `'message'` на объекте `process`. Однако этот метод можно использовать для явного запроса определенного поведения.

### `process.channel.unref()` {#processchannelunref}

**Добавлено в: v7.1.0**

Этот метод делает так, чтобы IPC-канал не поддерживал работу цикла событий процесса и позволял ему завершиться, даже когда канал открыт.

Обычно это управляется количеством прослушивателей событий `'disconnect'` и `'message'` на объекте `process`. Однако этот метод можно использовать для явного запроса определенного поведения.

## `process.chdir(directory)` {#processchdirdirectory}

**Добавлено в: v0.1.17**

- `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `process.chdir()` изменяет текущий рабочий каталог процесса Node.js или выбрасывает исключение, если это не удается (например, если указанный `directory` не существует).

::: code-group
```js [ESM]
import { chdir, cwd } from 'node:process';

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```js [CJS]
const { chdir, cwd } = require('node:process');

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
:::

Эта функция недоступна в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).


## `process.config` {#processconfig}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Объект `process.config` теперь заморожен. |
| v16.0.0 | Изменение process.config объявлено устаревшим. |
| v0.7.7 | Добавлено в версии: v0.7.7 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Свойство `process.config` возвращает замороженный `Object`, содержащий JavaScript-представление параметров конфигурации, использованных для компиляции текущего исполняемого файла Node.js. Это то же самое, что и файл `config.gypi`, который был создан при запуске скрипта `./configure`.

Пример возможного вывода выглядит так:

```js [ESM]
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
## `process.connected` {#processconnected}

**Добавлено в версии: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если процесс Node.js порожден с IPC-каналом (см. документацию [Дочерний процесс](/ru/nodejs/api/child_process) и [Кластер](/ru/nodejs/api/cluster)), свойство `process.connected` будет возвращать `true` до тех пор, пока IPC-канал подключен, и будет возвращать `false` после вызова `process.disconnect()`.

Как только `process.connected` станет `false`, отправка сообщений по IPC-каналу с помощью `process.send()` больше невозможна.

## `process.constrainedMemory()` {#processconstrainedmemory}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Значение, возвращаемое функцией, выровнено с `uv_get_constrained_memory`. |
| v19.6.0, v18.15.0 | Добавлено в версии: v19.6.0, v18.15.0 |
:::

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает объем памяти, доступный процессу (в байтах), в зависимости от ограничений, наложенных операционной системой. Если такого ограничения нет или ограничение неизвестно, возвращается `0`.

См. [`uv_get_constrained_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_constrained_memory) для получения дополнительной информации.


## `process.availableMemory()` {#processavailablememory}

**Добавлено в: v22.0.0, v20.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Получает объем свободной памяти, который все еще доступен для процесса (в байтах).

Смотрите [`uv_get_available_memory`](https://docs.libuv.org/en/v1.x/misc#c.uv_get_available_memory) для получения дополнительной информации.

## `process.cpuUsage([previousValue])` {#processcpuusagepreviousvalue}

**Добавлено в: v6.1.0**

- `previousValue` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Предыдущее возвращаемое значение от вызова `process.cpuUsage()`
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `system` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метод `process.cpuUsage()` возвращает время использования процессора текущим процессом в пользовательском и системном режимах в виде объекта со свойствами `user` и `system`, значения которых представляют собой микросекунды (миллионные доли секунды). Эти значения измеряют время, затраченное соответственно в пользовательском и системном коде, и могут оказаться больше фактического прошедшего времени, если несколько ядер процессора выполняют работу для этого процесса.

Результат предыдущего вызова `process.cpuUsage()` может быть передан в качестве аргумента функции для получения разностного показания.

::: code-group
```js [ESM]
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// загружаем процессор на 500 миллисекунд
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```js [CJS]
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// загружаем процессор на 500 миллисекунд
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```
:::


## `process.cwd()` {#processcwd}

**Добавлено в версии: v0.1.8**

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `process.cwd()` возвращает текущий рабочий каталог процесса Node.js.

::: code-group
```js [ESM]
import { cwd } from 'node:process';

console.log(`Текущий каталог: ${cwd()}`);
```

```js [CJS]
const { cwd } = require('node:process');

console.log(`Текущий каталог: ${cwd()}`);
```
:::

## `process.debugPort` {#processdebugport}

**Добавлено в версии: v0.7.2**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Порт, используемый отладчиком Node.js при включении.

::: code-group
```js [ESM]
import process from 'node:process';

process.debugPort = 5858;
```

```js [CJS]
const process = require('node:process');

process.debugPort = 5858;
```
:::

## `process.disconnect()` {#processdisconnect}

**Добавлено в версии: v0.7.2**

Если процесс Node.js порожден с каналом IPC (см. документацию по [Дочернему процессу](/ru/nodejs/api/child_process) и [Кластеру](/ru/nodejs/api/cluster)), метод `process.disconnect()` закроет канал IPC для родительского процесса, позволяя дочернему процессу корректно завершиться, как только не останется других соединений, поддерживающих его активность.

Эффект от вызова `process.disconnect()` такой же, как и от вызова [`ChildProcess.disconnect()`](/ru/nodejs/api/child_process#subprocessdisconnect) из родительского процесса.

Если процесс Node.js был запущен без канала IPC, `process.disconnect()` будет `undefined`.

## `process.dlopen(module, filename[, flags])` {#processdlopenmodule-filename-flags}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.0.0 | Добавлена поддержка аргумента `flags`. |
| v0.1.16 | Добавлено в версии: v0.1.16 |
:::

- `module` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<os.constants.dlopen\>](/ru/nodejs/api/os#dlopen-constants) **По умолчанию:** `os.constants.dlopen.RTLD_LAZY`

Метод `process.dlopen()` позволяет динамически загружать общие объекты. Он в основном используется `require()` для загрузки дополнений C++, и его не следует использовать напрямую, за исключением особых случаев. Другими словами, [`require()`](/ru/nodejs/api/globals#require) следует предпочитать `process.dlopen()`, если нет особых причин, таких как пользовательские флаги dlopen или загрузка из модулей ES.

Аргумент `flags` — это целое число, которое позволяет указать поведение dlopen. См. документацию [`os.constants.dlopen`](/ru/nodejs/api/os#dlopen-constants) для получения подробной информации.

Важным требованием при вызове `process.dlopen()` является то, что должен быть передан экземпляр `module`. Функции, экспортируемые дополнением C++, становятся доступными через `module.exports`.

В приведенном ниже примере показано, как загрузить дополнение C++, с именем `local.node`, которое экспортирует функцию `foo`. Все символы загружаются до возврата вызова, путем передачи константы `RTLD_NOW`. В этом примере предполагается, что константа доступна.

::: code-group
```js [ESM]
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```js [CJS]
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```
:::


## `process.emitWarning(warning[, options])` {#processemitwarningwarning-options}

**Добавлено в: v8.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Предупреждение для генерации.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `warning` является `String`, то `type` - это имя, которое будет использоваться для *типа* выдаваемого предупреждения. **По умолчанию:** `'Warning'`.
    - `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Уникальный идентификатор для экземпляра выдаваемого предупреждения.
    - `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Если `warning` является `String`, то `ctor` - это необязательная функция, используемая для ограничения создаваемой трассировки стека. **По умолчанию:** `process.emitWarning`.
    - `detail` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Дополнительный текст для включения в ошибку.

Метод `process.emitWarning()` можно использовать для генерации пользовательских или специфичных для приложения предупреждений процесса. Их можно прослушивать, добавив обработчик для события [`'warning'`](/ru/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Выдать предупреждение с кодом и дополнительной информацией.
emitWarning('Что-то случилось!', {
  code: 'MY_WARNING',
  detail: 'Это дополнительная информация',
});
// Выводит:
// (node:56338) [MY_WARNING] Warning: Что-то случилось!
// Это дополнительная информация
```

```js [CJS]
const { emitWarning } = require('node:process');

// Выдать предупреждение с кодом и дополнительной информацией.
emitWarning('Что-то случилось!', {
  code: 'MY_WARNING',
  detail: 'Это дополнительная информация',
});
// Выводит:
// (node:56338) [MY_WARNING] Warning: Что-то случилось!
// Это дополнительная информация
```
:::

В этом примере объект `Error` генерируется внутри `process.emitWarning()` и передается обработчику [`'warning'`](/ru/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Что-то случилось!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Трассировка стека
  console.warn(warning.detail);  // 'Это дополнительная информация'
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Что-то случилось!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Трассировка стека
  console.warn(warning.detail);  // 'Это дополнительная информация'
});
```
:::

Если `warning` передан как объект `Error`, аргумент `options` игнорируется.


## `process.emitWarning(warning[, type[, code]][, ctor])` {#processemitwarningwarning-type-code-ctor}

**Добавлено в: v6.0.0**

- `warning` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Предупреждение для выдачи.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Когда `warning` является `String`, `type` - это имя, используемое для *типа* выдаваемого предупреждения. **По умолчанию:** `'Warning'`.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Уникальный идентификатор для выдаваемого экземпляра предупреждения.
- `ctor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Когда `warning` является `String`, `ctor` - это необязательная функция, используемая для ограничения сгенерированного стека вызовов. **По умолчанию:** `process.emitWarning`.

Метод `process.emitWarning()` можно использовать для выдачи пользовательских или специфичных для приложения предупреждений процесса. Их можно отслеживать, добавив обработчик для события [`'warning'`](/ru/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Выдача предупреждения с использованием строки.
emitWarning('Что-то случилось!');
// Выводит: (node: 56338) Warning: Что-то случилось!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Выдача предупреждения с использованием строки.
emitWarning('Что-то случилось!');
// Выводит: (node: 56338) Warning: Что-то случилось!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Выдача предупреждения с использованием строки и типа.
emitWarning('Что-то случилось!', 'CustomWarning');
// Выводит: (node:56338) CustomWarning: Что-то случилось!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Выдача предупреждения с использованием строки и типа.
emitWarning('Что-то случилось!', 'CustomWarning');
// Выводит: (node:56338) CustomWarning: Что-то случилось!
```
:::

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

emitWarning('Что-то случилось!', 'CustomWarning', 'WARN001');
// Выводит: (node:56338) [WARN001] CustomWarning: Что-то случилось!
```

```js [CJS]
const { emitWarning } = require('node:process');

process.emitWarning('Что-то случилось!', 'CustomWarning', 'WARN001');
// Выводит: (node:56338) [WARN001] CustomWarning: Что-то случилось!
```
:::

В каждом из предыдущих примеров объект `Error` генерируется внутри `process.emitWarning()` и передается через обработчик [`'warning'`](/ru/nodejs/api/process#event-warning).

::: code-group
```js [ESM]
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```js [CJS]
const process = require('node:process');

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
:::

Если `warning` передается как объект `Error`, он будет передан в обработчик события `'warning'` без изменений (а необязательные аргументы `type`, `code` и `ctor` будут проигнорированы):

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

// Выдача предупреждения с использованием объекта Error.
const myWarning = new Error('Что-то случилось!');
// Используйте свойство name Error для указания имени типа
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Выводит: (node:56338) [WARN001] CustomWarning: Что-то случилось!
```

```js [CJS]
const { emitWarning } = require('node:process');

// Выдача предупреждения с использованием объекта Error.
const myWarning = new Error('Что-то случилось!');
// Используйте свойство name Error для указания имени типа
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Выводит: (node:56338) [WARN001] CustomWarning: Что-то случилось!
```
:::

`TypeError` выдается, если `warning` является чем-либо иным, кроме строки или объекта `Error`.

Хотя предупреждения процесса используют объекты `Error`, механизм предупреждений процесса **не** заменяет обычные механизмы обработки ошибок.

Следующая дополнительная обработка выполняется, если `type` предупреждения имеет значение `'DeprecationWarning'`:

- Если используется флаг командной строки `--throw-deprecation`, предупреждение об устаревании выдается как исключение, а не как событие.
- Если используется флаг командной строки `--no-deprecation`, предупреждение об устаревании подавляется.
- Если используется флаг командной строки `--trace-deprecation`, предупреждение об устаревании выводится в `stderr` вместе с полной трассировкой стека.


### Избежание дублирования предупреждений {#avoiding-duplicate-warnings}

В качестве лучшей практики, предупреждения следует выдавать только один раз на процесс. Для этого поместите `emitWarning()` за булевым значением.

::: code-group
```js [ESM]
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

```js [CJS]
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```
:::

## `process.env` {#processenv}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.14.0 | Worker threads теперь будут использовать копию `process.env` родительского потока по умолчанию, настраиваемую с помощью опции `env` конструктора `Worker`. |
| v10.0.0 | Неявное преобразование значения переменной в строку устарело. |
| v0.1.27 | Добавлено в: v0.1.27 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Свойство `process.env` возвращает объект, содержащий пользовательское окружение. См. [`environ(7)`](http://man7.org/linux/man-pages/man7/environ.7).

Пример этого объекта выглядит так:

```js [ESM]
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
Этот объект можно изменять, но такие изменения не будут отражены за пределами процесса Node.js или (если явно не запрошено) в других потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker). Другими словами, следующий пример не будет работать:

```bash [BASH]
node -e 'process.env.foo = "bar"' && echo $foo
```
В то время как следующий будет:

::: code-group
```js [ESM]
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```js [CJS]
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```
:::

Присваивание свойства `process.env` неявно преобразует значение в строку. **Это поведение устарело.** Будущие версии Node.js могут выдать ошибку, если значение не является строкой, числом или булевым значением.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```js [CJS]
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```
:::

Используйте `delete`, чтобы удалить свойство из `process.env`.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```
:::

В операционных системах Windows переменные среды нечувствительны к регистру.

::: code-group
```js [ESM]
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```js [CJS]
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```
:::

Если явно не указано при создании экземпляра [`Worker`](/ru/nodejs/api/worker_threads#class-worker), каждый поток [`Worker`](/ru/nodejs/api/worker_threads#class-worker) имеет свою собственную копию `process.env`, основанную на `process.env` его родительского потока или на том, что было указано в качестве опции `env` для конструктора [`Worker`](/ru/nodejs/api/worker_threads#class-worker). Изменения в `process.env` не будут видны в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker), и только основной поток может вносить изменения, которые видны операционной системе или собственным надстройкам. В Windows копия `process.env` в экземпляре [`Worker`](/ru/nodejs/api/worker_threads#class-worker) работает с учетом регистра, в отличие от основного потока.


## `process.execArgv` {#processexecargv}

**Добавлено в: v0.7.7**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `process.execArgv` возвращает набор специфичных для Node.js параметров командной строки, переданных при запуске процесса Node.js. Эти параметры не отображаются в массиве, возвращаемом свойством [`process.argv`](/ru/nodejs/api/process#processargv), и не включают исполняемый файл Node.js, имя скрипта или любые параметры, следующие за именем скрипта. Эти параметры полезны для создания дочерних процессов с той же средой выполнения, что и у родительского.

```bash [BASH]
node --icu-data-dir=./foo --require ./bar.js script.js --version
```
Результат для `process.execArgv`:

```json [JSON]
["--icu-data-dir=./foo", "--require", "./bar.js"]
```
И `process.argv`:

```js [ESM]
['/usr/local/bin/node', 'script.js', '--version']
```
Подробное поведение рабочих потоков с этим свойством см. в [`Worker` constructor](/ru/nodejs/api/worker_threads#new-workerfilename-options).

## `process.execPath` {#processexecpath}

**Добавлено в: v0.1.100**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `process.execPath` возвращает абсолютный путь к исполняемому файлу, который запустил процесс Node.js. Символические ссылки, если таковые имеются, разрешаются.

```js [ESM]
'/usr/local/bin/node'
```
## `process.exit([code])` {#processexitcode}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Принимает только код типа number или типа string, если он представляет собой целое число. |
| v0.1.13 | Добавлено в: v0.1.13 |
:::

- `code` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Код выхода. Для типа string допускаются только целочисленные строки (например, '1'). **По умолчанию:** `0`.

Метод `process.exit()` предписывает Node.js завершить процесс синхронно с кодом завершения `code`. Если `code` опущен, для выхода используется код 'success' `0` или значение `process.exitCode`, если оно было установлено. Node.js не завершится до тех пор, пока не будут вызваны все прослушиватели события [`'exit'`](/ru/nodejs/api/process#event-exit).

Чтобы выйти с кодом 'failure':

::: code-group
```js [ESM]
import { exit } from 'node:process';

exit(1);
```

```js [CJS]
const { exit } = require('node:process');

exit(1);
```
:::

Оболочка, выполнившая Node.js, должна увидеть код выхода как `1`.

Вызов `process.exit()` заставит процесс завершиться как можно быстрее, даже если еще есть ожидающие асинхронные операции, которые еще не завершены полностью, включая операции ввода-вывода для `process.stdout` и `process.stderr`.

В большинстве ситуаций на самом деле нет необходимости явно вызывать `process.exit()`. Процесс Node.js завершится сам по себе, *если в цикле событий нет дополнительной ожидающей работы*. Свойство `process.exitCode` можно установить, чтобы сообщить процессу, какой код выхода использовать при корректном завершении процесса.

Например, следующий пример иллюстрирует *неправильное* использование метода `process.exit()`, которое может привести к тому, что данные, выводимые в stdout, будут усечены и потеряны:

::: code-group
```js [ESM]
import { exit } from 'node:process';

// Это пример того, что *не* нужно делать:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```js [CJS]
const { exit } = require('node:process');

// Это пример того, что *не* нужно делать:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
:::

Проблема в том, что запись в `process.stdout` в Node.js иногда *асинхронна* и может происходить в течение нескольких тактов цикла событий Node.js. Вызов `process.exit()`, однако, заставляет процесс завершиться *до* того, как эти дополнительные записи в `stdout` могут быть выполнены.

Вместо прямого вызова `process.exit()` код *должен* установить `process.exitCode` и позволить процессу завершиться естественным путем, избегая планирования какой-либо дополнительной работы для цикла событий:

::: code-group
```js [ESM]
import process from 'node:process';

// Как правильно установить код выхода, позволяя
// процессу завершиться корректно.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```js [CJS]
const process = require('node:process');

// Как правильно установить код выхода, позволяя
// процессу завершиться корректно.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
:::

Если необходимо завершить процесс Node.js из-за ошибки, более безопасно сгенерировать *неперехваченную* ошибку и позволить процессу завершиться соответствующим образом, чем вызывать `process.exit()`.

В [`Worker`](/ru/nodejs/api/worker_threads#class-worker) потоках эта функция останавливает текущий поток, а не текущий процесс.


## `process.exitCode` {#processexitcode_1}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Принимает только код типа number или типа string, если он представляет собой целое число. |
| v0.11.8 | Добавлено в: v0.11.8 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Код выхода. Для строкового типа разрешены только строковые представления целых чисел (например, "1"). **По умолчанию:** `undefined`.

Число, которое будет кодом выхода процесса, когда процесс либо завершается нормально, либо завершается через [`process.exit()`](/ru/nodejs/api/process#processexitcode) без указания кода.

Указание кода для [`process.exit(code)`](/ru/nodejs/api/process#processexitcode) переопределит любую предыдущую настройку `process.exitCode`.

## `process.features.cached_builtins` {#processfeaturescached_builtins}

**Добавлено в: v12.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение, которое равно `true`, если текущая сборка Node.js кэширует встроенные модули.

## `process.features.debug` {#processfeaturesdebug}

**Добавлено в: v0.5.5**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение, которое равно `true`, если текущая сборка Node.js является отладочной сборкой.

## `process.features.inspector` {#processfeaturesinspector}

**Добавлено в: v11.10.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение, которое равно `true`, если текущая сборка Node.js включает инспектор.

## `process.features.ipv6` {#processfeaturesipv6}

**Добавлено в: v0.5.3**

**Устарело с версии: v23.4.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Это свойство всегда true, и любые проверки, основанные на нем, избыточны.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение, которое равно `true`, если текущая сборка Node.js включает поддержку IPv6.

Поскольку все сборки Node.js имеют поддержку IPv6, это значение всегда равно `true`.


## `process.features.require_module` {#processfeaturesrequire_module}

**Добавлено в версии: v23.0.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение `true`, если текущая сборка Node.js поддерживает [загрузку модулей ECMAScript с использованием `require()`](/ru/nodejs/api/modules#loading-ecmascript-modules-using-require).

## `process.features.tls` {#processfeaturestls}

**Добавлено в версии: v0.5.3**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение `true`, если текущая сборка Node.js включает поддержку TLS.

## `process.features.tls_alpn` {#processfeaturestls_alpn}

**Добавлено в версии: v4.8.0**

**Устарело с версии: v23.4.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Вместо этого используйте `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение `true`, если текущая сборка Node.js включает поддержку ALPN в TLS.

В Node.js 11.0.0 и более поздних версиях зависимости OpenSSL обеспечивают безусловную поддержку ALPN. Поэтому это значение идентично значению `process.features.tls`.

## `process.features.tls_ocsp` {#processfeaturestls_ocsp}

**Добавлено в версии: v0.11.13**

**Устарело с версии: v23.4.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Вместо этого используйте `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение `true`, если текущая сборка Node.js включает поддержку OCSP в TLS.

В Node.js 11.0.0 и более поздних версиях зависимости OpenSSL обеспечивают безусловную поддержку OCSP. Поэтому это значение идентично значению `process.features.tls`.

## `process.features.tls_sni` {#processfeaturestls_sni}

**Добавлено в версии: v0.5.3**

**Устарело с версии: v23.4.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Вместо этого используйте `process.features.tls`.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Логическое значение `true`, если текущая сборка Node.js включает поддержку SNI в TLS.

В Node.js 11.0.0 и более поздних версиях зависимости OpenSSL обеспечивают безусловную поддержку SNI. Поэтому это значение идентично значению `process.features.tls`.


## `process.features.typescript` {#processfeaturestypescript}

**Добавлено в версии: v23.0.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Значение `"strip"`, если Node.js запущен с `--experimental-strip-types`, `"transform"`, если Node.js запущен с `--experimental-transform-types`, и `false` в противном случае.

## `process.features.uv` {#processfeaturesuv}

**Добавлено в версии: v0.5.3**

**Устарело с версии: v23.4.0**

::: danger [Стабильность: 0 - Устаревший]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устаревший. Это свойство всегда true, и любые проверки, основанные на нем, избыточны.
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Булево значение, равное `true`, если текущая сборка Node.js включает поддержку libuv.

Поскольку невозможно построить Node.js без libuv, это значение всегда равно `true`.

## `process.finalization.register(ref, callback)` {#processfinalizationregisterref-callback}

**Добавлено в версии: v22.5.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ссылка на отслеживаемый ресурс.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, которая будет вызвана при завершении ресурса.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ссылка на отслеживаемый ресурс.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Событие, вызвавшее завершение. По умолчанию 'exit'.



Эта функция регистрирует обратный вызов, который будет вызван при возникновении события `exit` процесса, если объект `ref` не был собран сборщиком мусора. Если объект `ref` был собран сборщиком мусора до возникновения события `exit`, обратный вызов будет удален из реестра финализации и не будет вызван при выходе из процесса.

Внутри обратного вызова вы можете освободить ресурсы, выделенные объектом `ref`. Имейте в виду, что все ограничения, применяемые к событию `beforeExit`, также применяются к функции `callback`, это означает, что существует вероятность того, что обратный вызов не будет вызван при особых обстоятельствах.

Идея этой функции состоит в том, чтобы помочь вам освободить ресурсы, когда процесс начинает завершаться, но также позволить объекту быть собранным сборщиком мусора, если он больше не используется.

Например: вы можете зарегистрировать объект, содержащий буфер, вы хотите убедиться, что буфер освобождается при выходе из процесса, но если объект собран сборщиком мусора до выхода из процесса, нам больше не нужно освобождать буфер, поэтому в этом случае мы просто удаляем обратный вызов из реестра финализации.

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Убедитесь, что функция, переданная в finalization.register(),
// не создает замыкание вокруг ненужных объектов.
function onFinalize(obj, event) {
  // Вы можете делать все, что захотите с объектом
  obj.dispose();
}

function setup() {
  // Этот объект можно безопасно собрать сборщиком мусора,
  // и результирующая функция завершения работы не будет вызвана.
  // Утечек нет.
  const myDisposableObject = {
    dispose() {
      // Освободите свои ресурсы синхронно
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Убедитесь, что функция, переданная в finalization.register(),
// не создает замыкание вокруг ненужных объектов.
function onFinalize(obj, event) {
  // Вы можете делать все, что захотите с объектом
  obj.dispose();
}

function setup() {
  // Этот объект можно безопасно собрать сборщиком мусора,
  // и результирующая функция завершения работы не будет вызвана.
  // Утечек нет.
  const myDisposableObject = {
    dispose() {
      // Освободите свои ресурсы синхронно
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```
:::

Приведенный выше код основан на следующих предположениях:

- стрелочные функции избегаются
- обычные функции рекомендуется размещать в глобальном контексте (root)

Обычные функции *могут* ссылаться на контекст, в котором живет `obj`, делая `obj` не подлежащим сборке мусора.

Стрелочные функции будут удерживать предыдущий контекст. Рассмотрим, например:

```js [ESM]
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // Даже что-то вроде этого крайне не рекомендуется
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```
Очень маловероятно (но не невозможно), что этот объект будет собран сборщиком мусора, но если это не так, `dispose` будет вызван при вызове `process.exit`.

Будьте осторожны и не полагайтесь на эту функцию для утилизации критических ресурсов, так как нет гарантии, что обратный вызов будет вызван при всех обстоятельствах.


## `process.finalization.registerBeforeExit(ref, callback)` {#processfinalizationregisterbeforeexitref-callback}

**Добавлено в: v22.5.0**

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ссылка на отслеживаемый ресурс.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, которая будет вызвана при финализации ресурса.
    - `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ссылка на отслеживаемый ресурс.
    - `event` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Событие, которое вызвало финализацию. По умолчанию 'beforeExit'.

Эта функция ведет себя точно так же, как `register`, за исключением того, что обратный вызов будет вызван, когда процесс испустит событие `beforeExit`, если объект `ref` не был собран сборщиком мусора.

Имейте в виду, что все ограничения, применяемые к событию `beforeExit`, также применяются к функции `callback`, это означает, что существует вероятность того, что обратный вызов не будет вызван при особых обстоятельствах.

## `process.finalization.unregister(ref)` {#processfinalizationunregisterref}

**Добавлено в: v22.5.0**

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `ref` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ссылка на ресурс, который был зарегистрирован ранее.

Эта функция удаляет регистрацию объекта из реестра финализации, поэтому обратный вызов больше не будет вызываться.

::: code-group
```js [CJS]
const { finalization } = require('node:process');

// Пожалуйста, убедитесь, что функция, переданная в finalization.register(),
// не создает замыкание вокруг ненужных объектов.
function onFinalize(obj, event) {
  // Вы можете делать все, что хотите с объектом
  obj.dispose();
}

function setup() {
  // Этот объект может быть безопасно собран сборщиком мусора,
  // и результирующая функция завершения работы не будет вызвана.
  // Утечек нет.
  const myDisposableObject = {
    dispose() {
      // Освободите свои ресурсы синхронно
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // Сделайте что-нибудь

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```js [ESM]
import { finalization } from 'node:process';

// Пожалуйста, убедитесь, что функция, переданная в finalization.register(),
// не создает замыкание вокруг ненужных объектов.
function onFinalize(obj, event) {
  // Вы можете делать все, что хотите с объектом
  obj.dispose();
}

function setup() {
  // Этот объект может быть безопасно собран сборщиком мусора,
  // и результирующая функция завершения работы не будет вызвана.
  // Утечек нет.
  const myDisposableObject = {
    dispose() {
      // Освободите свои ресурсы синхронно
    },
  };

  // Пожалуйста, убедитесь, что функция, переданная в finalization.register(),
  // не создает замыкание вокруг ненужных объектов.
  function onFinalize(obj, event) {
    // Вы можете делать все, что хотите с объектом
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // Сделайте что-нибудь

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```
:::


## `process.getActiveResourcesInfo()` {#processgetactiveresourcesinfo}

**Добавлено в: v17.3.0, v16.14.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `process.getActiveResourcesInfo()` возвращает массив строк, содержащих типы активных ресурсов, которые в данный момент поддерживают цикл событий.

::: code-group
```js [ESM]
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Печатает:
//   Before: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```js [CJS]
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Печатает:
//   Before: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```
:::

## `process.getBuiltinModule(id)` {#processgetbuiltinmoduleid}

**Добавлено в: v22.3.0, v20.16.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ID встроенного модуля, который запрашивается.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`process.getBuiltinModule(id)` предоставляет способ загрузки встроенных модулей через глобально доступную функцию. ES Modules, которые должны поддерживать другие среды, могут использовать его для условной загрузки встроенного модуля Node.js при запуске в Node.js, без необходимости обрабатывать ошибку разрешения, которая может быть выдана `import` в среде, отличной от Node.js, или использовать динамический `import()`, который либо превращает модуль в асинхронный модуль, либо превращает синхронный API в асинхронный.

```js [ESM]
if (globalThis.process?.getBuiltinModule) {
  // Запуск в Node.js, использование модуля fs Node.js.
  const fs = globalThis.process.getBuiltinModule('fs');
  // Если `require()` необходим для загрузки пользовательских модулей, используйте createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```
Если `id` указывает на встроенный модуль, доступный в текущем процессе Node.js, метод `process.getBuiltinModule(id)` возвращает соответствующий встроенный модуль. Если `id` не соответствует какому-либо встроенному модулю, возвращается `undefined`.

`process.getBuiltinModule(id)` принимает идентификаторы встроенных модулей, которые распознаются [`module.isBuiltin(id)`](/ru/nodejs/api/module#moduleisbuiltinmodulename). Некоторые встроенные модули должны быть загружены с префиксом `node:`, см. [встроенные модули с обязательным префиксом `node:`](/ru/nodejs/api/modules#built-in-modules-with-mandatory-node-prefix). Ссылки, возвращаемые `process.getBuiltinModule(id)`, всегда указывают на встроенный модуль, соответствующий `id`, даже если пользователи изменят [`require.cache`](/ru/nodejs/api/modules#requirecache) так, что `require(id)` вернет что-то другое.


## `process.getegid()` {#processgetegid}

**Добавлено в версии: v2.0.0**

Метод `process.getegid()` возвращает числовой эффективный идентификатор группы процесса Node.js. (См. [`getegid(2)`](http://man7.org/linux/man-pages/man2/getegid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid) {
  console.log(`Текущий gid: ${process.getegid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid) {
  console.log(`Текущий gid: ${process.getegid()}`);
}
```
:::

Эта функция доступна только на платформах POSIX (т.е. не Windows или Android).

## `process.geteuid()` {#processgeteuid}

**Добавлено в версии: v2.0.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Метод `process.geteuid()` возвращает числовой эффективный идентификатор пользователя процесса. (См. [`geteuid(2)`](http://man7.org/linux/man-pages/man2/geteuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid) {
  console.log(`Текущий uid: ${process.geteuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid) {
  console.log(`Текущий uid: ${process.geteuid()}`);
}
```
:::

Эта функция доступна только на платформах POSIX (т.е. не Windows или Android).

## `process.getgid()` {#processgetgid}

**Добавлено в версии: v0.1.31**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Метод `process.getgid()` возвращает числовой идентификатор группы процесса. (См. [`getgid(2)`](http://man7.org/linux/man-pages/man2/getgid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid) {
  console.log(`Текущий gid: ${process.getgid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid) {
  console.log(`Текущий gid: ${process.getgid()}`);
}
```
:::

Эта функция доступна только на платформах POSIX (т.е. не Windows или Android).

## `process.getgroups()` {#processgetgroups}

**Добавлено в версии: v0.9.4**

- Возвращает: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метод `process.getgroups()` возвращает массив с дополнительными идентификаторами групп. POSIX не определяет, включен ли эффективный идентификатор группы, но Node.js гарантирует, что он всегда включен.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
:::

Эта функция доступна только на платформах POSIX (т.е. не Windows или Android).


## `process.getuid()` {#processgetuid}

**Добавлено в: v0.1.28**

- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метод `process.getuid()` возвращает числовой идентификатор пользователя процесса. (См. [`getuid(2)`](http://man7.org/linux/man-pages/man2/getuid.2).)

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid) {
  console.log(`Текущий uid: ${process.getuid()}`);
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid) {
  console.log(`Текущий uid: ${process.getuid()}`);
}
```
:::

Эта функция доступна только на платформах POSIX (т.е. не Windows или Android).

## `process.hasUncaughtExceptionCaptureCallback()` {#processhasuncaughtexceptioncapturecallback}

**Добавлено в: v9.3.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Указывает, была ли установлена обратная связь с использованием [`process.setUncaughtExceptionCaptureCallback()`](/ru/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn).

## `process.hrtime([time])` {#processhrtimetime}

**Добавлено в: v0.7.6**

::: info [Стабильно: 3 - Устаревшее]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее. Используйте [`process.hrtime.bigint()`](/ru/nodejs/api/process#processhrtimebigint) вместо этого.
:::

- `time` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Результат предыдущего вызова `process.hrtime()`
- Возвращает: [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Это устаревшая версия [`process.hrtime.bigint()`](/ru/nodejs/api/process#processhrtimebigint) до того, как `bigint` был представлен в JavaScript.

Метод `process.hrtime()` возвращает текущее реальное время высокого разрешения в виде кортежа `[seconds, nanoseconds]` `Array`, где `nanoseconds` - это оставшаяся часть реального времени, которое нельзя представить с точностью до секунды.

`time` - это необязательный параметр, который должен быть результатом предыдущего вызова `process.hrtime()` для сравнения с текущим временем. Если переданный параметр не является кортежем `Array`, будет выдана ошибка `TypeError`. Передача определяемого пользователем массива вместо результата предыдущего вызова `process.hrtime()` приведет к неопределенному поведению.

Эти времена относятся к произвольному времени в прошлом и не связаны со временем суток и, следовательно, не подвержены дрейфу часов. Основное использование - для измерения производительности между интервалами:

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Бенчмарк занял ${diff[0] * NS_PER_SEC + diff[1]} наносекунд`);
  // Бенчмарк занял 1000000552 наносекунд
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Бенчмарк занял ${diff[0] * NS_PER_SEC + diff[1]} наносекунд`);
  // Бенчмарк занял 1000000552 наносекунд
}, 1000);
```
:::


## `process.hrtime.bigint()` {#processhrtimebigint}

**Added in: v10.7.0**

- Returns: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

`bigint` версия метода [`process.hrtime()`](/ru/nodejs/api/process#processhrtimetime), возвращающая текущее реальное время с высоким разрешением в наносекундах в виде `bigint`.

В отличие от [`process.hrtime()`](/ru/nodejs/api/process#processhrtimetime), он не поддерживает дополнительный аргумент `time`, поскольку разницу можно вычислить непосредственно вычитанием двух `bigint`.

::: code-group
```js [ESM]
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```js [CJS]
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```
:::

## `process.initgroups(user, extraGroup)` {#processinitgroupsuser-extragroup}

**Added in: v0.9.4**

- `user` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Имя пользователя или числовой идентификатор.
- `extraGroup` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Имя группы или числовой идентификатор.

Метод `process.initgroups()` считывает файл `/etc/group` и инициализирует список доступа к группам, используя все группы, членом которых является пользователь. Это привилегированная операция, требующая, чтобы процесс Node.js имел либо права `root`, либо возможность `CAP_SETGID`.

Будьте осторожны при отказе от привилегий:

::: code-group
```js [ESM]
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```js [CJS]
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
:::

Эта функция доступна только на платформах POSIX (т.е. не Windows или Android). Эта функция недоступна в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).


## `process.kill(pid[, signal])` {#processkillpid-signal}

**Добавлено в версии: v0.0.6**

- `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор процесса
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Сигнал для отправки, либо в виде строки, либо числа. **По умолчанию:** `'SIGTERM'`.

Метод `process.kill()` отправляет `signal` процессу, идентифицированному по `pid`.

Имена сигналов - это строки, такие как `'SIGINT'` или `'SIGHUP'`. Смотрите [События сигналов](/ru/nodejs/api/process#signal-events) и [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) для получения дополнительной информации.

Этот метод выдаст ошибку, если целевой `pid` не существует. В качестве особого случая, сигнал `0` может быть использован для проверки существования процесса. Платформы Windows выдадут ошибку, если `pid` используется для завершения группы процессов.

Несмотря на то, что имя этой функции `process.kill()`, на самом деле это всего лишь отправитель сигналов, как системный вызов `kill`. Отправленный сигнал может сделать что-то отличное от завершения целевого процесса.

::: code-group
```js [ESM]
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Получен сигнал SIGHUP.');
});

setTimeout(() => {
  console.log('Выход.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```js [CJS]
const process = require('node:process');

process.on('SIGHUP', () => {
  console.log('Получен сигнал SIGHUP.');
});

setTimeout(() => {
  console.log('Выход.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```
:::

Когда процесс Node.js получает `SIGUSR1`, Node.js запустит отладчик. Смотрите [События сигналов](/ru/nodejs/api/process#signal-events).

## `process.loadEnvFile(path)` {#processloadenvfilepath}

**Добавлено в версии: v21.7.0, v20.12.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type). **По умолчанию:** `'./.env'`

Загружает файл `.env` в `process.env`. Использование `NODE_OPTIONS` в файле `.env` не повлияет на Node.js.

::: code-group
```js [CJS]
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```js [ESM]
import { loadEnvFile } from 'node:process';
loadEnvFile();
```
:::


## `process.mainModule` {#processmainmodule}

**Добавлено в версии: v0.1.17**

**Устарело с версии: v14.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`require.main`](/ru/nodejs/api/modules#accessing-the-main-module) вместо этого.
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Свойство `process.mainModule` предоставляет альтернативный способ получения [`require.main`](/ru/nodejs/api/modules#accessing-the-main-module). Разница в том, что если основной модуль изменяется во время выполнения, [`require.main`](/ru/nodejs/api/modules#accessing-the-main-module) может по-прежнему ссылаться на исходный основной модуль в модулях, которые были запрошены до того, как произошло изменение. Как правило, можно с уверенностью предположить, что оба они относятся к одному и тому же модулю.

Как и в случае с [`require.main`](/ru/nodejs/api/modules#accessing-the-main-module), `process.mainModule` будет иметь значение `undefined`, если отсутствует сценарий входа.

## `process.memoryUsage()` {#processmemoryusage}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v13.9.0, v12.17.0 | Добавлено `arrayBuffers` в возвращаемый объект. |
| v7.2.0 | Добавлено `external` в возвращаемый объект. |
| v0.1.16 | Добавлено в версии: v0.1.16 |
:::

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rss` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapTotal` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `heapUsed` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `external` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `arrayBuffers` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает объект, описывающий использование памяти процессом Node.js, измеренное в байтах.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```
:::

- `heapTotal` и `heapUsed` относятся к использованию памяти V8.
- `external` относится к использованию памяти C++ объектами, привязанными к JavaScript объектам, управляемым V8.
- `rss`, Resident Set Size (размер резидентного набора), — это объем пространства, занимаемого в основной памяти (то есть подмножество общего объема выделенной памяти) для процесса, включая все C++ и JavaScript объекты и код.
- `arrayBuffers` относится к памяти, выделенной для `ArrayBuffer` и `SharedArrayBuffer`, включая все Node.js [`Buffer`](/ru/nodejs/api/buffer). Это также включено в значение `external`. Если Node.js используется как встроенная библиотека, это значение может быть `0`, поскольку выделения для `ArrayBuffer` могут не отслеживаться в этом случае.

При использовании [`Worker`](/ru/nodejs/api/worker_threads#class-worker) потоков, `rss` будет значением, действительным для всего процесса, в то время как другие поля будут относиться только к текущему потоку.

Метод `process.memoryUsage()` перебирает каждую страницу, чтобы собрать информацию об использовании памяти, что может быть медленным в зависимости от распределения памяти программой.


## `process.memoryUsage.rss()` {#processmemoryusagerss}

**Добавлено в версии: v15.6.0, v14.18.0**

- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метод `process.memoryUsage.rss()` возвращает целое число, представляющее размер Resident Set Size (RSS) в байтах.

Resident Set Size - это объем пространства, занятого в основной памяти (то есть подмножество общего объема выделенной памяти) для процесса, включая все объекты и код C++ и JavaScript.

Это то же значение, что и свойство `rss`, предоставляемое `process.memoryUsage()`, но `process.memoryUsage.rss()` работает быстрее.

::: code-group
```js [ESM]
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```js [CJS]
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```
:::

## `process.nextTick(callback[, ...args])` {#processnexttickcallback-args}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.7.0, v20.18.0 | Изменена стабильность на Legacy. |
| v18.0.0 | Передача недопустимой функции обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v1.8.1 | Теперь поддерживаются дополнительные аргументы после `callback`. |
| v0.1.26 | Добавлено в версии: v0.1.26 |
:::

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Legacy: Вместо этого используйте [`queueMicrotask()`](/ru/nodejs/api/globals#queuemicrotaskcallback).
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Дополнительные аргументы для передачи при вызове `callback`

`process.nextTick()` добавляет `callback` в "очередь next tick". Эта очередь полностью опустошается после завершения текущей операции в стеке JavaScript и до того, как event loop сможет продолжиться. Можно создать бесконечный цикл, если рекурсивно вызывать `process.nextTick()`. См. руководство [Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick) для получения дополнительной информации.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```js [CJS]
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```
:::

Это важно при разработке API, чтобы предоставить пользователям возможность назначить обработчики событий *после* создания объекта, но до возникновения каких-либо операций ввода-вывода:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() вызывается сейчас, а не раньше.
```

```js [CJS]
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() вызывается сейчас, а не раньше.
```
:::

Очень важно, чтобы API были либо на 100% синхронными, либо на 100% асинхронными. Рассмотрим следующий пример:

```js [ESM]
// ВНИМАНИЕ! НЕ ИСПОЛЬЗОВАТЬ! ПЛОХАЯ ОПАСНОСТЬ!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```
Этот API опасен, потому что в следующем случае:

```js [ESM]
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```
Неясно, что будет вызвано первым: `foo()` или `bar()`.

Следующий подход намного лучше:

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```js [CJS]
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```
:::

### Когда использовать `queueMicrotask()` вместо `process.nextTick()` {#when-to-use-queuemicrotask-vs-processnexttick}

API [`queueMicrotask()`](/ru/nodejs/api/globals#queuemicrotaskcallback) является альтернативой `process.nextTick()`, который также откладывает выполнение функции, используя ту же очередь микрозадач, которая используется для выполнения обработчиков then, catch и finally разрешенных промисов. В Node.js, каждый раз, когда "очередь следующего такта" опустошается, очередь микрозадач опустошается сразу после этого.

::: code-group
```js [ESM]
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```

```js [CJS]
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// Output:
// 1
// 2
// 3
```
:::

Для *большинства* пользовательских случаев API `queueMicrotask()` предоставляет переносимый и надежный механизм для отложенного выполнения, который работает в различных средах JavaScript платформ и которому следует отдавать предпочтение перед `process.nextTick()`. В простых сценариях `queueMicrotask()` может быть прямой заменой для `process.nextTick()`.

```js [ESM]
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
```
Одним из заметных различий между двумя API является то, что `process.nextTick()` позволяет указывать дополнительные значения, которые будут переданы в качестве аргументов отложенной функции при ее вызове. Для достижения того же результата с помощью `queueMicrotask()` необходимо использовать замыкание или привязанную функцию:

```js [ESM]
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
```
Существуют незначительные различия в способах обработки ошибок, возникающих в очереди следующего такта и в очереди микрозадач. Ошибки, возникающие в обратном вызове поставленной в очередь микрозадачи, должны быть обработаны внутри обратного вызова, если это возможно. Если это не так, обработчик событий `process.on('uncaughtException')` можно использовать для перехвата и обработки ошибок.

В случае сомнений, если не требуются конкретные возможности `process.nextTick()`, используйте `queueMicrotask()`.


## `process.noDeprecation` {#processnodeprecation}

**Добавлено в: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `process.noDeprecation` указывает, установлен ли флаг `--no-deprecation` для текущего процесса Node.js. Дополнительную информацию о поведении этого флага см. в документации для [`'warning'` event](/ru/nodejs/api/process#event-warning) и [`emitWarning()` method](/ru/nodejs/api/process#processemitwarningwarning-type-code-ctor).

## `process.permission` {#processpermission}

**Добавлено в: v20.0.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Этот API доступен через флаг [`--permission`](/ru/nodejs/api/cli#--permission).

`process.permission` - это объект, методы которого используются для управления разрешениями для текущего процесса. Дополнительная документация доступна в [Permission Model](/ru/nodejs/api/permissions#permission-model).

### `process.permission.has(scope[, reference])` {#processpermissionhasscope-reference}

**Добавлено в: v20.0.0**

- `scope` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `reference` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Проверяет, имеет ли процесс доступ к указанной области и ссылке. Если ссылка не предоставлена, предполагается глобальная область, например, `process.permission.has('fs.read')` проверит, имеет ли процесс ВСЕ разрешения на чтение файловой системы.

Ссылка имеет значение, основанное на предоставленной области. Например, ссылка, когда область - файловая система, означает файлы и папки.

Доступные области:

- `fs` - Вся файловая система
- `fs.read` - Операции чтения файловой системы
- `fs.write` - Операции записи файловой системы
- `child` - Операции порождения дочерних процессов
- `worker` - Операция порождения рабочих потоков

```js [ESM]
// Проверяет, имеет ли процесс разрешение на чтение файла README.md
process.permission.has('fs.read', './README.md');
// Проверяет, имеет ли процесс разрешение на операции чтения
process.permission.has('fs.read');
```

## `process.pid` {#processpid}

**Добавлено в версии: v0.1.15**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Свойство `process.pid` возвращает PID процесса.

::: code-group
```js [ESM]
import { pid } from 'node:process';

console.log(`Этот процесс имеет pid ${pid}`);
```

```js [CJS]
const { pid } = require('node:process');

console.log(`Этот процесс имеет pid ${pid}`);
```
:::

## `process.platform` {#processplatform}

**Добавлено в версии: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `process.platform` возвращает строку, идентифицирующую операционную систему, для которой был скомпилирован Node.js binary.

В настоящее время возможные значения:

- `'aix'`
- `'darwin'`
- `'freebsd'`
- `'linux'`
- `'openbsd'`
- `'sunos'`
- `'win32'`

::: code-group
```js [ESM]
import { platform } from 'node:process';

console.log(`Эта платформа ${platform}`);
```

```js [CJS]
const { platform } = require('node:process');

console.log(`Эта платформа ${platform}`);
```
:::

Значение `'android'` также может быть возвращено, если Node.js построен на операционной системе Android. Однако поддержка Android в Node.js [является экспериментальной](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `process.ppid` {#processppid}

**Добавлено в версии: v9.2.0, v8.10.0, v6.13.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Свойство `process.ppid` возвращает PID родительского процесса текущего процесса.

::: code-group
```js [ESM]
import { ppid } from 'node:process';

console.log(`Родительский процесс имеет pid ${ppid}`);
```

```js [CJS]
const { ppid } = require('node:process');

console.log(`Родительский процесс имеет pid ${ppid}`);
```
:::

## `process.release` {#processrelease}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v4.2.0 | Теперь поддерживается свойство `lts`. |
| v3.0.0 | Добавлено в версии: v3.0.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Свойство `process.release` возвращает `Object`, содержащий метаданные, связанные с текущим релизом, включая URL-адреса для исходного архива и архива только с заголовками.

`process.release` содержит следующие свойства:

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение, которое всегда будет `'node'`.
- `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) абсолютный URL, указывающий на файл *<code>.tar.gz</code>*, содержащий исходный код текущего релиза.
- `headersUrl`[\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) абсолютный URL, указывающий на файл *<code>.tar.gz</code>*, содержащий только исходные файлы заголовков для текущего релиза. Этот файл значительно меньше, чем полный исходный файл, и может использоваться для компиляции собственных дополнений Node.js.
- `libUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) абсолютный URL, указывающий на файл *<code>node.lib</code>*, соответствующий архитектуре и версии текущего релиза. Этот файл используется для компиляции собственных дополнений Node.js. *Это свойство присутствует только в
Windows-сборках Node.js и отсутствует на всех других платформах.*
- `lts` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) строковая метка, идентифицирующая метку [LTS](https://github.com/nodejs/Release) для этого релиза. Это свойство существует только для LTS-релизов и является `undefined` для всех других типов релизов, включая *Current*-релизы. Допустимые значения включают кодовые имена LTS Release (включая те, которые больше не поддерживаются).
    - `'Fermium'` для линейки 14.x LTS, начиная с 14.15.0.
    - `'Gallium'` для линейки 16.x LTS, начиная с 16.13.0.
    - `'Hydrogen'` для линейки 18.x LTS, начиная с 18.12.0. Другие кодовые имена LTS Release см. в [Архиве журнала изменений Node.js](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md)

```js [ESM]
{
  name: 'node',
  lts: 'Hydrogen',
  sourceUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v18.12.0/win-x64/node.lib'
}
```
В пользовательских сборках из версий дерева исходного кода, отличных от релизных, может присутствовать только свойство `name`. Не следует полагаться на существование дополнительных свойств.


## `process.report` {#processreport}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот API больше не является экспериментальным. |
| v11.8.0 | Добавлено в: v11.8.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`process.report` — это объект, методы которого используются для создания диагностических отчетов для текущего процесса. Дополнительная документация доступна в [документации по отчетам](/ru/nodejs/api/report).

### `process.report.compact` {#processreportcompact}

**Добавлено в: v13.12.0, v12.17.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Записывает отчеты в компактном формате, в виде однострочного JSON, который легче обрабатывается системами обработки журналов, чем многострочный формат по умолчанию, предназначенный для чтения человеком.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Reports are compact? ${report.compact}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Reports are compact? ${report.compact}`);
```
:::

### `process.report.directory` {#processreportdirectory}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот API больше не является экспериментальным. |
| v11.12.0 | Добавлено в: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Каталог, в который записывается отчет. Значение по умолчанию — пустая строка, указывающая, что отчеты записываются в текущий рабочий каталог процесса Node.js.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report directory is ${report.directory}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report directory is ${report.directory}`);
```
:::

### `process.report.filename` {#processreportfilename}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот API больше не является экспериментальным. |
| v11.12.0 | Добавлено в: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Имя файла, в который записывается отчет. Если установлено в пустую строку, имя выходного файла будет состоять из временной метки, PID и порядкового номера. Значение по умолчанию — пустая строка.

Если значение `process.report.filename` установлено в `'stdout'` или `'stderr'`, отчет записывается в stdout или stderr процесса соответственно.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Report filename is ${report.filename}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Report filename is ${report.filename}`);
```
:::


### `process.report.getReport([err])` {#processreportgetreporterr}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот API больше не является экспериментальным. |
| v11.8.0 | Добавлено в: v11.8.0 |
:::

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Пользовательская ошибка, используемая для сообщения стека JavaScript.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает JavaScript Object представление диагностического отчета для запущенного процесса. Трассировка стека JavaScript отчета берется из `err`, если присутствует.

::: code-group
```js [ESM]
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Аналогично process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```js [CJS]
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Аналогично process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```
:::

Дополнительная документация доступна в [документации по отчетам](/ru/nodejs/api/report).

### `process.report.reportOnFatalError` {#processreportreportonfatalerror}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0, v14.17.0 | Этот API больше не является экспериментальным. |
| v11.12.0 | Добавлено в: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если `true`, диагностический отчет генерируется при фатальных ошибках, таких как ошибки нехватки памяти или неудачные утверждения C++.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Отчет о фатальной ошибке: ${report.reportOnFatalError}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Отчет о фатальной ошибке: ${report.reportOnFatalError}`);
```
:::


### `process.report.reportOnSignal` {#processreportreportonsignal}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот API больше не является экспериментальным. |
| v11.12.0 | Добавлено в: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если `true`, диагностический отчет генерируется, когда процесс получает сигнал, указанный в `process.report.signal`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Отчет по сигналу: ${report.reportOnSignal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Отчет по сигналу: ${report.reportOnSignal}`);
```
:::

### `process.report.reportOnUncaughtException` {#processreportreportonuncaughtexception}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот API больше не является экспериментальным. |
| v11.12.0 | Добавлено в: v11.12.0 |
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если `true`, диагностический отчет генерируется при неперехваченном исключении.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Отчет по исключению: ${report.reportOnUncaughtException}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Отчет по исключению: ${report.reportOnUncaughtException}`);
```
:::

### `process.report.excludeEnv` {#processreportexcludeenv}

**Добавлено в: v23.3.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если `true`, диагностический отчет генерируется без переменных окружения.

### `process.report.signal` {#processreportsignal}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот API больше не является экспериментальным. |
| v11.12.0 | Добавлено в: v11.12.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Сигнал, используемый для запуска создания диагностического отчета. По умолчанию `'SIGUSR2'`.

::: code-group
```js [ESM]
import { report } from 'node:process';

console.log(`Сигнал отчета: ${report.signal}`);
```

```js [CJS]
const { report } = require('node:process');

console.log(`Сигнал отчета: ${report.signal}`);
```
:::


### `process.report.writeReport([filename][, err])` {#processreportwritereportfilename-err}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот API больше не является экспериментальным. |
| v11.8.0 | Добавлено в: v11.8.0 |
:::

-  `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя файла, в который записывается отчет. Это должен быть относительный путь, который будет добавлен к каталогу, указанному в `process.report.directory`, или к текущему рабочему каталогу процесса Node.js, если он не указан.
-  `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Пользовательская ошибка, используемая для сообщения о стеке JavaScript.
-  Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Возвращает имя файла сгенерированного отчета.

Записывает диагностический отчет в файл. Если `filename` не указано, имя файла по умолчанию включает дату, время, PID и порядковый номер. Трассировка стека JavaScript отчета берется из `err`, если присутствует.

Если значение `filename` установлено в `'stdout'` или `'stderr'`, отчет записывается в stdout или stderr процесса соответственно.

::: code-group
```js [ESM]
import { report } from 'node:process';

report.writeReport();
```

```js [CJS]
const { report } = require('node:process');

report.writeReport();
```
:::

Дополнительная документация доступна в [документации по отчетам](/ru/nodejs/api/report).

## `process.resourceUsage()` {#processresourceusage}

**Добавлено в: v12.6.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) использование ресурсов для текущего процесса. Все эти значения берутся из вызова `uv_getrusage`, который возвращает [`uv_rusage_t` struct](https://docs.libuv.org/en/v1.x/misc#c.uv_rusage_t).
    - `userCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_utime` и вычисляется в микросекундах. Это то же значение, что и [`process.cpuUsage().user`](/ru/nodejs/api/process#processcpuusagepreviousvalue).
    - `systemCPUTime` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_stime` и вычисляется в микросекундах. Это то же значение, что и [`process.cpuUsage().system`](/ru/nodejs/api/process#processcpuusagepreviousvalue).
    - `maxRSS` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_maxrss`, которое является максимальным резидентным набором, используемым в килобайтах.
    - `sharedMemorySize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_ixrss`, но не поддерживается ни одной платформой.
    - `unsharedDataSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_idrss`, но не поддерживается ни одной платформой.
    - `unsharedStackSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_isrss`, но не поддерживается ни одной платформой.
    - `minorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_minflt`, которое является количеством незначительных ошибок страниц для процесса, см. [эту статью для получения более подробной информации](https://en.wikipedia.org/wiki/Page_fault#Minor).
    - `majorPageFault` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_majflt`, которое является количеством основных ошибок страниц для процесса, см. [эту статью для получения более подробной информации](https://en.wikipedia.org/wiki/Page_fault#Major). Это поле не поддерживается в Windows.
    - `swappedOut` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_nswap`, но не поддерживается ни одной платформой.
    - `fsRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_inblock`, которое является количеством раз, когда файловой системе приходилось выполнять ввод.
    - `fsWrite` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_oublock`, которое является количеством раз, когда файловой системе приходилось выполнять вывод.
    - `ipcSent` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_msgsnd`, но не поддерживается ни одной платформой.
    - `ipcReceived` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_msgrcv`, но не поддерживается ни одной платформой.
    - `signalsCount` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_nsignals`, но не поддерживается ни одной платформой.
    - `voluntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_nvcsw`, которое является количеством переключений контекста ЦП, произошедших из-за того, что процесс добровольно отказался от процессора до завершения своего временного среза (обычно для ожидания доступности ресурса). Это поле не поддерживается в Windows.
    - `involuntaryContextSwitches` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) соответствует `ru_nivcsw`, которое является количеством переключений контекста ЦП, произошедших из-за того, что процесс с более высоким приоритетом стал исполняемым, или из-за того, что текущий процесс превысил свой временной срез. Это поле не поддерживается в Windows.
  
 

::: code-group
```js [ESM]
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```js [CJS]
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```
:::

## `process.send(message[, sendHandle[, options]][, callback])` {#processsendmessage-sendhandle-options-callback}

**Added in: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<net.Server\>](/ru/nodejs/api/net#class-netserver) | [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) используется для параметризации отправки определённых типов дескрипторов. `options` поддерживает следующие свойства:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Значение, которое можно использовать при передаче экземпляров `net.Socket`. Если `true`, сокет остается открытым в процессе отправки. **По умолчанию:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Если Node.js запущен с использованием IPC-канала, метод `process.send()` может быть использован для отправки сообщений родительскому процессу. Сообщения будут получены как событие [`'message'`](/ru/nodejs/api/child_process#event-message) в объекте [`ChildProcess`](/ru/nodejs/api/child_process#class-childprocess) родительского процесса.

Если Node.js не был запущен с использованием IPC-канала, `process.send` будет `undefined`.

Сообщение проходит через сериализацию и разбор. Полученное сообщение может отличаться от того, что было отправлено изначально.

## `process.setegid(id)` {#processsetegidid}

**Added in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Имя группы или ID

Метод `process.setegid()` устанавливает эффективный групповой идентификатор процесса. (См. [`setegid(2)`](http://man7.org/linux/man-pages/man2/setegid.2).) `id` может быть передан как числовой ID или как строковое имя группы. Если указано имя группы, этот метод блокируется во время разрешения связанного числового ID.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Эта функция доступна только на POSIX-платформах (т.е. не в Windows или Android). Эта функция недоступна в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).


## `process.seteuid(id)` {#processseteuidid}

**Added in: v2.0.0**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Имя пользователя или ID

Метод `process.seteuid()` устанавливает эффективный идентификатор пользователя процесса. (См. [`seteuid(2)`](http://man7.org/linux/man-pages/man2/seteuid.2).) `id` может быть передан как числовой ID или как строка с именем пользователя. Если указано имя пользователя, метод блокируется во время разрешения связанного числового ID.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Эта функция доступна только на платформах POSIX (т.е. не Windows или Android). Эта функция недоступна в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).

## `process.setgid(id)` {#processsetgidid}

**Added in: v0.1.31**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Имя группы или ID

Метод `process.setgid()` устанавливает идентификатор группы процесса. (См. [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2).) `id` может быть передан как числовой ID или как строка с именем группы. Если указано имя группы, метод блокируется во время разрешения связанного числового ID.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```
:::

Эта функция доступна только на платформах POSIX (т.е. не Windows или Android). Эта функция недоступна в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).


## `process.setgroups(groups)` {#processsetgroupsgroups}

**Added in: v0.9.4**

- `groups` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метод `process.setgroups()` устанавливает дополнительные идентификаторы групп для процесса Node.js. Это привилегированная операция, требующая наличия у процесса Node.js прав `root` или возможности `CAP_SETGID`.

Массив `groups` может содержать числовые идентификаторы групп, имена групп или и то, и другое.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```
:::

Эта функция доступна только на POSIX-платформах (т.е. не в Windows или Android). Эта функция недоступна в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).

## `process.setuid(id)` {#processsetuidid}

**Added in: v0.1.28**

- `id` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `process.setuid(id)` устанавливает идентификатор пользователя процесса. (См. [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2).) `id` может быть передан как числовой идентификатор или строка имени пользователя. Если указано имя пользователя, метод блокируется во время разрешения связанного числового идентификатора.

::: code-group
```js [ESM]
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```js [CJS]
const process = require('node:process');

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```
:::

Эта функция доступна только на POSIX-платформах (т.е. не в Windows или Android). Эта функция недоступна в потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker).


## `process.setSourceMapsEnabled(val)` {#processsetsourcemapsenabledval}

**Добавлено в: v16.6.0, v14.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `val` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Эта функция включает или отключает поддержку [Source Map v3](https://sourcemaps.info/spec) для трассировок стека.

Она предоставляет те же возможности, что и запуск процесса Node.js с параметрами командной строки `--enable-source-maps`.

Только source map в файлах JavaScript, которые загружаются после включения source map, будут проанализированы и загружены.

## `process.setUncaughtExceptionCaptureCallback(fn)` {#processsetuncaughtexceptioncapturecallbackfn}

**Добавлено в: v9.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Функция `process.setUncaughtExceptionCaptureCallback()` устанавливает функцию, которая будет вызываться при возникновении необработанного исключения, и которая получит само значение исключения в качестве первого аргумента.

Если такая функция установлена, событие [`'uncaughtException'`](/ru/nodejs/api/process#event-uncaughtexception) не будет сгенерировано. Если `--abort-on-uncaught-exception` был передан из командной строки или установлен через [`v8.setFlagsFromString()`](/ru/nodejs/api/v8#v8setflagsfromstringflags), процесс не будет прерван. Действия, настроенные для выполнения при исключениях, такие как создание отчетов, также будут затронуты.

Чтобы отменить установку функции захвата, можно использовать `process.setUncaughtExceptionCaptureCallback(null)`. Вызов этого метода с аргументом, отличным от `null`, в то время как установлена другая функция захвата, вызовет ошибку.

Использование этой функции взаимоисключающе с использованием устаревшего встроенного модуля [`domain`](/ru/nodejs/api/domain).

## `process.sourceMapsEnabled` {#processsourcemapsenabled}

**Добавлено в: v20.7.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `process.sourceMapsEnabled` возвращает, включена ли поддержка [Source Map v3](https://sourcemaps.info/spec) для трассировок стека.


## `process.stderr` {#processstderr}

- [\<Stream\>](/ru/nodejs/api/stream#stream)

Свойство `process.stderr` возвращает поток, подключенный к `stderr` (fd `2`). Это [`net.Socket`](/ru/nodejs/api/net#class-netsocket) (который является потоком [Duplex](/ru/nodejs/api/stream#duplex-and-transform-streams)), если fd `2` не ссылается на файл, в этом случае это поток [Writable](/ru/nodejs/api/stream#writable-streams).

`process.stderr` отличается от других потоков Node.js важными особенностями. Подробнее см. в [примечании о вводе-выводе процесса](/ru/nodejs/api/process#a-note-on-process-io).

### `process.stderr.fd` {#processstderrfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Это свойство относится к значению базового файлового дескриптора `process.stderr`. Значение фиксировано на `2`. В потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker) это поле не существует.

## `process.stdin` {#processstdin}

- [\<Stream\>](/ru/nodejs/api/stream#stream)

Свойство `process.stdin` возвращает поток, подключенный к `stdin` (fd `0`). Это [`net.Socket`](/ru/nodejs/api/net#class-netsocket) (который является потоком [Duplex](/ru/nodejs/api/stream#duplex-and-transform-streams)), если fd `0` не ссылается на файл, в этом случае это поток [Readable](/ru/nodejs/api/stream#readable-streams).

Подробную информацию о чтении из `stdin` см. в [`readable.read()`](/ru/nodejs/api/stream#readablereadsize).

Как поток [Duplex](/ru/nodejs/api/stream#duplex-and-transform-streams), `process.stdin` также можно использовать в «старом» режиме, совместимом со скриптами, написанными для Node.js до версии v0.10. Дополнительные сведения см. в разделе [Совместимость потоков](/ru/nodejs/api/stream#compatibility-with-older-nodejs-versions).

В «старом» режиме потоков поток `stdin` по умолчанию приостановлен, поэтому для чтения из него необходимо вызвать `process.stdin.resume()`. Обратите также внимание, что вызов `process.stdin.resume()` сам по себе переключит поток в «старый» режим.

### `process.stdin.fd` {#processstdinfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Это свойство относится к значению базового файлового дескриптора `process.stdin`. Значение фиксировано на `0`. В потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker) это поле не существует.


## `process.stdout` {#processstdout}

- [\<Stream\>](/ru/nodejs/api/stream#stream)

Свойство `process.stdout` возвращает поток, подключенный к `stdout` (дескриптор файла `1`). Это [`net.Socket`](/ru/nodejs/api/net#class-netsocket) (который является [дуплексным](/ru/nodejs/api/stream#duplex-and-transform-streams) потоком), если дескриптор файла `1` не ссылается на файл, в этом случае это [поток для записи](/ru/nodejs/api/stream#writable-streams).

Например, чтобы скопировать `process.stdin` в `process.stdout`:

::: code-group
```js [ESM]
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```js [CJS]
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```
:::

`process.stdout` отличается от других потоков Node.js важными особенностями. Дополнительную информацию см. в [примечании о вводе-выводе процесса](/ru/nodejs/api/process#a-note-on-process-io).

### `process.stdout.fd` {#processstdoutfd}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Это свойство относится к значению базового файлового дескриптора `process.stdout`. Значение фиксировано на `1`. В потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker) это поле не существует.

### Примечание о вводе-выводе процесса {#a-note-on-process-i/o}

`process.stdout` и `process.stderr` отличаются от других потоков Node.js важными особенностями:

Эти особенности частично обусловлены историческими причинами, так как их изменение привело бы к обратной несовместимости, но они также ожидаются некоторыми пользователями.

Синхронные записи позволяют избежать таких проблем, как неожиданное перемешивание вывода, записанного с помощью `console.log()` или `console.error()`, или его полное отсутствие, если `process.exit()` вызывается до завершения асинхронной записи. Дополнительную информацию см. в [`process.exit()`](/ru/nodejs/api/process#processexitcode).

*<strong>Предупреждение</strong>*: Синхронные записи блокируют цикл событий до завершения записи. Это может произойти почти мгновенно в случае вывода в файл, но при высокой загрузке системы, если каналы не читаются на принимающей стороне, или с медленными терминалами или файловыми системами, возможно, что цикл событий будет блокироваться достаточно часто и достаточно долго, чтобы оказать серьезное негативное влияние на производительность. Это может не быть проблемой при записи в интерактивный сеанс терминала, но будьте особенно осторожны при ведении производственного журнала в потоки вывода процесса.

Чтобы проверить, подключен ли поток к контексту [TTY](/ru/nodejs/api/tty#tty), проверьте свойство `isTTY`.

Например:

```bash [BASH]
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```
Дополнительную информацию см. в документации [TTY](/ru/nodejs/api/tty#tty).


## `process.throwDeprecation` {#processthrowdeprecation}

**Добавлено в: v0.9.12**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Начальное значение `process.throwDeprecation` указывает, установлен ли флаг `--throw-deprecation` в текущем процессе Node.js. `process.throwDeprecation` является изменяемым, поэтому, будут ли предупреждения об устаревании приводить к ошибкам, можно изменить во время выполнения. Смотрите документацию для [`'warning'` event](/ru/nodejs/api/process#event-warning) и [`emitWarning()` method](/ru/nodejs/api/process#processemitwarningwarning-type-code-ctor) для получения дополнительной информации.

```bash [BASH]
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```
## `process.title` {#processtitle}

**Добавлено в: v0.1.104**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `process.title` возвращает заголовок текущего процесса (то есть, возвращает текущее значение `ps`). Присвоение нового значения `process.title` изменяет текущее значение `ps`.

Когда присваивается новое значение, разные платформы будут накладывать разные ограничения на максимальную длину заголовка. Обычно такие ограничения довольно ограничены. Например, в Linux и macOS, `process.title` ограничен размером имени исполняемого файла плюс длиной аргументов командной строки, потому что установка `process.title` перезаписывает память `argv` процесса. Node.js v0.8 позволял использовать более длинные строки заголовка процесса, также перезаписывая память `environ`, но это было потенциально небезопасным и сбивающим с толку в некоторых (довольно неясных) случаях.

Присвоение значения `process.title` может не привести к точному отображению метки в приложениях диспетчера процессов, таких как Activity Monitor в macOS или Диспетчер служб Windows.


## `process.traceDeprecation` {#processtracedeprecation}

**Добавлено в версии: v0.8.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Свойство `process.traceDeprecation` указывает, установлен ли флаг `--trace-deprecation` в текущем процессе Node.js. Подробнее о поведении этого флага см. документацию для [`'warning'` event](/ru/nodejs/api/process#event-warning) и [`emitWarning()` method](/ru/nodejs/api/process#processemitwarningwarning-type-code-ctor).

## `process.umask()` {#processumask}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0, v12.19.0 | Вызов `process.umask()` без аргументов устарел. |
| v0.1.19 | Добавлено в версии: v0.1.19 |
:::

::: danger [Стабильность: 0 - Устаревший]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устаревший. Вызов `process.umask()` без аргументов приводит к двукратной записи общепроцессной маски umask. Это создает состояние гонки между потоками и является потенциальной уязвимостью безопасности. Безопасной кроссплатформенной альтернативы API не существует.
:::

`process.umask()` возвращает маску создания файлового режима процесса Node.js. Дочерние процессы наследуют маску от родительского процесса.

## `process.umask(mask)` {#processumaskmask}

**Добавлено в версии: v0.1.19**

- `mask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`process.umask(mask)` устанавливает маску создания файлового режима процесса Node.js. Дочерние процессы наследуют маску от родительского процесса. Возвращает предыдущую маску.



::: code-group
```js [ESM]
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```js [CJS]
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```
:::

В потоках [`Worker`](/ru/nodejs/api/worker_threads#class-worker), `process.umask(mask)` выбросит исключение.


## `process.uptime()` {#processuptime}

**Добавлено в версии: v0.5.0**

- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метод `process.uptime()` возвращает количество секунд, в течение которых выполняется текущий процесс Node.js.

Возвращаемое значение включает доли секунды. Используйте `Math.floor()`, чтобы получить целые секунды.

## `process.version` {#processversion}

**Добавлено в версии: v0.1.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `process.version` содержит строку версии Node.js.

::: code-group
```js [ESM]
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```js [CJS]
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```
:::

Чтобы получить строку версии без префикса *v*, используйте `process.versions.node`.

## `process.versions` {#processversions}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v9.0.0 | Свойство `v8` теперь включает специфичный для Node.js суффикс. |
| v4.2.0 | Теперь поддерживается свойство `icu`. |
| v0.2.0 | Добавлено в версии: v0.2.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Свойство `process.versions` возвращает объект, содержащий строки версий Node.js и его зависимостей. `process.versions.modules` указывает текущую версию ABI, которая увеличивается всякий раз, когда изменяется C++ API. Node.js откажется загружать модули, скомпилированные для другой версии ABI модуля.

::: code-group
```js [ESM]
import { versions } from 'node:process';

console.log(versions);
```

```js [CJS]
const { versions } = require('node:process');

console.log(versions);
```
:::

Будет сгенерирован объект, похожий на:

```bash [BASH]
{ node: '23.0.0',
  acorn: '8.11.3',
  ada: '2.7.8',
  ares: '1.28.1',
  base64: '0.5.2',
  brotli: '1.1.0',
  cjs_module_lexer: '1.2.2',
  cldr: '45.0',
  icu: '75.1',
  llhttp: '9.2.1',
  modules: '127',
  napi: '9',
  nghttp2: '1.61.0',
  nghttp3: '0.7.0',
  ngtcp2: '1.3.0',
  openssl: '3.0.13+quic',
  simdjson: '3.8.0',
  simdutf: '5.2.4',
  sqlite: '3.46.0',
  tz: '2024a',
  undici: '6.13.0',
  unicode: '15.1',
  uv: '1.48.0',
  uvwasi: '0.0.20',
  v8: '12.4.254.14-node.11',
  zlib: '1.3.0.1-motley-7d77fb7' }
```

## Коды завершения {#exit-codes}

Node.js обычно завершает работу с кодом состояния `0`, когда больше нет ожидающих асинхронных операций. В других случаях используются следующие коды состояния:

- `1` **Необработанное критическое исключение**: Произошло необработанное исключение, и оно не было обработано доменом или обработчиком события [`'uncaughtException'`](/ru/nodejs/api/process#event-uncaughtexception).
- `2`: Не используется (зарезервировано Bash для неправильного использования встроенных функций)
- `3` **Внутренняя ошибка разбора JavaScript**: Исходный код JavaScript, внутренний для процесса начальной загрузки Node.js, вызвал ошибку разбора. Это крайне редко и обычно может произойти только во время разработки самого Node.js.
- `4` **Внутренняя ошибка вычисления JavaScript**: Исходный код JavaScript, внутренний для процесса начальной загрузки Node.js, не смог вернуть функциональное значение при вычислении. Это крайне редко и обычно может произойти только во время разработки самого Node.js.
- `5` **Критическая ошибка**: В V8 произошла критическая невосстановимая ошибка. Как правило, в stderr выводится сообщение с префиксом `FATAL ERROR`.
- `6` **Нефункциональный внутренний обработчик исключений**: Произошло необработанное исключение, но внутренняя функция обработчика критических исключений каким-то образом была установлена в нефункциональное значение и не могла быть вызвана.
- `7` **Сбой времени выполнения внутреннего обработчика исключений**: Произошло необработанное исключение, и сама внутренняя функция обработчика критических исключений выдала ошибку при попытке его обработки. Это может произойти, например, если обработчик [`'uncaughtException'`](/ru/nodejs/api/process#event-uncaughtexception) или `domain.on('error')` выдает ошибку.
- `8`: Не используется. В предыдущих версиях Node.js код выхода 8 иногда указывал на необработанное исключение.
- `9` **Неверный аргумент**: Либо указана неизвестная опция, либо опция, требующая значения, предоставлена без значения.
- `10` **Внутренняя ошибка времени выполнения JavaScript**: Исходный код JavaScript, внутренний для процесса начальной загрузки Node.js, выдал ошибку при вызове функции начальной загрузки. Это крайне редко и обычно может произойти только во время разработки самого Node.js.
- `12` **Неверный аргумент отладки**: Были установлены опции `--inspect` и/или `--inspect-brk`, но выбранный номер порта был недействительным или недоступным.
- `13` **Неразрешенный Top-Level Await**: `await` использовался вне функции в коде верхнего уровня, но переданный `Promise` так и не был разрешен.
- `14` **Ошибка моментального снимка**: Node.js был запущен для создания моментального снимка запуска V8 и завершился неудачно, поскольку определенные требования к состоянию приложения не были выполнены.
- `\>128` **Завершение по сигналу**: Если Node.js получает фатальный сигнал, такой как `SIGKILL` или `SIGHUP`, то его код завершения будет `128` плюс значение кода сигнала. Это стандартная практика POSIX, поскольку коды завершения определены как 7-битные целые числа, а завершения по сигналу устанавливают старший бит, а затем содержат значение кода сигнала. Например, сигнал `SIGABRT` имеет значение `6`, поэтому ожидаемый код завершения будет `128` + `6` или `134`.

