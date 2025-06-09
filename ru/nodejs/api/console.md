---
title: Документация API консоли Node.js
description: API консоли Node.js предоставляет простую отладочную консоль, аналогичную механизму консоли JavaScript, предоставляемому веб-браузерами. В данной документации подробно описаны методы для логирования, отладки и инспекции объектов JavaScript в среде Node.js.
head:
  - - meta
    - name: og:title
      content: Документация API консоли Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: API консоли Node.js предоставляет простую отладочную консоль, аналогичную механизму консоли JavaScript, предоставляемому веб-браузерами. В данной документации подробно описаны методы для логирования, отладки и инспекции объектов JavaScript в среде Node.js.
  - - meta
    - name: twitter:title
      content: Документация API консоли Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: API консоли Node.js предоставляет простую отладочную консоль, аналогичную механизму консоли JavaScript, предоставляемому веб-браузерами. В данной документации подробно описаны методы для логирования, отладки и инспекции объектов JavaScript в среде Node.js.
---


# Console {#console}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

Модуль `node:console` предоставляет простую консоль отладки, аналогичную механизму консоли JavaScript, предоставляемому веб-браузерами.

Модуль экспортирует два конкретных компонента:

- Класс `Console` с методами, такими как `console.log()`, `console.error()` и `console.warn()`, которые можно использовать для записи в любой поток Node.js.
- Глобальный экземпляр `console`, настроенный для записи в [`process.stdout`](/ru/nodejs/api/process#processstdout) и [`process.stderr`](/ru/nodejs/api/process#processstderr). Глобальный `console` можно использовать без вызова `require('node:console')`.

*<strong>Предупреждение</strong>*: Методы глобального объекта console не являются ни последовательно синхронными, как API браузера, на которые они похожи, ни последовательно асинхронными, как все другие потоки Node.js. Программы, которые хотят зависеть от синхронного/асинхронного поведения функций console, должны сначала выяснить природу поддерживающего консоль потока. Это связано с тем, что поток зависит от базовой платформы и стандартной конфигурации потока текущего процесса. См. [примечание о вводе-выводе процесса](/ru/nodejs/api/process#a-note-on-process-io) для получения дополнительной информации.

Пример использования глобального `console`:

```js [ESM]
console.log('hello world');
// Выводит: hello world, в stdout
console.log('hello %s', 'world');
// Выводит: hello world, в stdout
console.error(new Error('Whoops, something bad happened'));
// Выводит сообщение об ошибке и трассировку стека в stderr:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// Выводит: Danger Will Robinson! Danger!, в stderr
```
Пример использования класса `Console`:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// Выводит: hello world, в out
myConsole.log('hello %s', 'world');
// Выводит: hello world, в out
myConsole.error(new Error('Whoops, something bad happened'));
// Выводит: [Error: Whoops, something bad happened], в err

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// Выводит: Danger Will Robinson! Danger!, в err
```

## Класс: `Console` {#class-console}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Ошибки, возникающие при записи в нижележащие потоки, теперь по умолчанию игнорируются. |
:::

Класс `Console` может использоваться для создания простого логгера с настраиваемыми выходными потоками и может быть доступен с помощью `require('node:console').Console` или `console.Console` (или их деструктурированных аналогов):

::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v14.2.0, v12.17.0 | Представлена опция `groupIndentation`. |
| v11.7.0 | Представлена опция `inspectOptions`. |
| v10.0.0 | Конструктор `Console` теперь поддерживает аргумент `options`, и представлена опция `colorMode`. |
| v8.0.0 | Представлена опция `ignoreErrors`. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Игнорировать ошибки при записи в нижележащие потоки. **По умолчанию:** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Установите поддержку цветов для этого экземпляра `Console`. Установка значения `true` включает раскраску при проверке значений. Установка значения `false` отключает раскраску при проверке значений. Установка значения `'auto'` определяет поддержку цветов в зависимости от значения свойства `isTTY` и значения, возвращаемого `getColorDepth()` для соответствующего потока. Эта опция не может использоваться, если также установлено `inspectOptions.colors`. **По умолчанию:** `'auto'`.
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Указывает параметры, которые передаются в [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options).
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Установите отступ для группы. **По умолчанию:** `2`.

Создает новый `Console` с одним или двумя записываемыми экземплярами потока. `stdout` — это записываемый поток для печати логов или информационного вывода. `stderr` используется для предупреждений или сообщений об ошибках. Если `stderr` не предоставлен, `stdout` используется для `stderr`.

::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

Глобальный `console` — это специальный `Console`, вывод которого отправляется в [`process.stdout`](/ru/nodejs/api/process#processstdout) и [`process.stderr`](/ru/nodejs/api/process#processstderr). Это эквивалентно вызову:

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Реализация теперь соответствует спецификации и больше не выбрасывает исключения. |
| v0.1.101 | Добавлено в: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Значение, проверяемое на истинность.
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Все аргументы, кроме `value`, используются в качестве сообщения об ошибке.

`console.assert()` выводит сообщение, если `value` является [ложным](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) или отсутствует. Он только выводит сообщение и никак иначе не влияет на выполнение. Вывод всегда начинается с `"Assertion failed"`. Если указано, `message` форматируется с использованием [`util.format()`](/ru/nodejs/api/util#utilformatformat-args).

Если `value` является [истинным](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), ничего не происходит.

```js [ESM]
console.assert(true, 'does nothing');

console.assert(false, 'Whoops %s work', 'didn\'t');
// Assertion failed: Whoops didn't work

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**Добавлено в: v8.3.0**

Когда `stdout` является TTY, вызов `console.clear()` попытается очистить TTY. Когда `stdout` не является TTY, этот метод ничего не делает.

Конкретная работа `console.clear()` может отличаться в разных операционных системах и типах терминалов. Для большинства операционных систем Linux `console.clear()` работает аналогично команде оболочки `clear`. В Windows `console.clear()` очистит только вывод в текущем окне терминала для двоичного файла Node.js.

### `console.count([label])` {#consolecountlabel}

**Добавлено в: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Отображаемая метка для счетчика. **По умолчанию:** `'default'`.

Поддерживает внутренний счетчик, специфичный для `label`, и выводит в `stdout` количество раз, когда `console.count()` был вызван с данным `label`.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Добавлено в версии: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Метка для счетчика. **По умолчанию:** `'default'`.

Сбрасывает внутренний счетчик, специфичный для `label`.

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.10.0 | `console.debug` теперь является псевдонимом для `console.log`. |
| v8.0.0 | Добавлено в версии: v8.0.0 |
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Функция `console.debug()` является псевдонимом для [`console.log()`](/ru/nodejs/api/console#consolelogdata-args).

### `console.dir(obj[, options])` {#consoledirobj-options}

**Добавлено в версии: v0.1.101**

- `obj` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то неперечисляемые и символьные свойства объекта также будут показаны. **По умолчанию:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options), сколько раз рекурсивно форматировать объект. Это полезно для изучения больших и сложных объектов. Чтобы сделать рекурсию бесконечной, передайте `null`. **По умолчанию:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то вывод будет стилизован с помощью цветовых кодов ANSI. Цвета можно настраивать; см. [настройка цветов `util.inspect()` ](/ru/nodejs/api/util#customizing-utilinspect-colors). **По умолчанию:** `false`.



Использует [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options) для `obj` и печатает полученную строку в `stdout`. Эта функция обходит любую пользовательскую функцию `inspect()`, определенную для `obj`.


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.3.0 | `console.dirxml` теперь вызывает `console.log` для своих аргументов. |
| v8.0.0 | Добавлено в: v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Этот метод вызывает `console.log()`, передавая ему полученные аргументы. Этот метод не создает никакого XML-форматирования.

### `console.error([data][, ...args])` {#consoleerrordata-args}

**Добавлено в: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Выводит в `stderr` с новой строкой. Можно передать несколько аргументов, при этом первый используется в качестве основного сообщения, а все остальные - в качестве значений подстановки, аналогично [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (все аргументы передаются в [`util.format()`](/ru/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const code = 5;
console.error('ошибка #%d', code);
// Выводит: ошибка #5, в stderr
console.error('ошибка', code);
// Выводит: ошибка 5, в stderr
```
Если элементы форматирования (например, `%d`) не найдены в первой строке, тогда [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options) вызывается для каждого аргумента, и результирующие строковые значения объединяются. См. [`util.format()`](/ru/nodejs/api/util#utilformatformat-args) для получения дополнительной информации.

### `console.group([...label])` {#consolegrouplabel}

**Добавлено в: v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Увеличивает отступ последующих строк на пробелы длиной `groupIndentation`.

Если предоставлен один или несколько `label`, они сначала печатаются без дополнительного отступа.

### `console.groupCollapsed()` {#consolegroupcollapsed}

**Добавлено в: v8.5.0**

Псевдоним для [`console.group()`](/ru/nodejs/api/console#consolegrouplabel).

### `console.groupEnd()` {#consolegroupend}

**Добавлено в: v8.5.0**

Уменьшает отступ последующих строк на пробелы длиной `groupIndentation`.


### `console.info([data][, ...args])` {#consoleinfodata-args}

**Добавлено в: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Функция `console.info()` является псевдонимом для [`console.log()`](/ru/nodejs/api/console#consolelogdata-args).

### `console.log([data][, ...args])` {#consolelogdata-args}

**Добавлено в: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Выводит в `stdout` с новой строкой. Может быть передано несколько аргументов, первый используется в качестве основного сообщения, а все дополнительные используются в качестве значений подстановки, аналогично [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (все аргументы передаются в [`util.format()`](/ru/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Выводит: count: 5, в stdout
console.log('count:', count);
// Выводит: count: 5, в stdout
```
Смотрите [`util.format()`](/ru/nodejs/api/util#utilformatformat-args) для получения дополнительной информации.

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**Добавлено в: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Альтернативные свойства для построения таблицы.

Пытается построить таблицу со столбцами свойств `tabularData` (или использовать `properties`) и строками `tabularData` и зарегистрировать ее. Откатывается к простой регистрации аргумента, если его не удается проанализировать как табличный.

```js [ESM]
// Это не может быть проанализировано как табличные данные
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**Добавлено в: v0.1.104**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'default'`

Запускает таймер, который можно использовать для вычисления продолжительности операции. Таймеры идентифицируются по уникальному `label`. Используйте тот же `label` при вызове [`console.timeEnd()`](/ru/nodejs/api/console#consoletimeendlabel), чтобы остановить таймер и вывести прошедшее время в подходящих единицах времени в `stdout`. Например, если прошедшее время составляет 3869 мс, `console.timeEnd()` отображает "3.869s".

### `console.timeEnd([label])` {#consoletimeendlabel}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.0.0 | Прошедшее время отображается в подходящих единицах времени. |
| v6.0.0 | Этот метод больше не поддерживает несколько вызовов, которые не соответствуют отдельным вызовам `console.time()`; подробности см. ниже. |
| v0.1.104 | Добавлено в: v0.1.104 |
:::

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'default'`

Останавливает таймер, который был ранее запущен вызовом [`console.time()`](/ru/nodejs/api/console#consoletimelabel), и выводит результат в `stdout`:

```js [ESM]
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Prints: bunch-of-stuff: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**Добавлено в: v10.7.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'default'`
- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Для таймера, который был ранее запущен вызовом [`console.time()`](/ru/nodejs/api/console#consoletimelabel), выводит прошедшее время и другие аргументы `data` в `stdout`:

```js [ESM]
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**Добавлено в: v0.1.104**

- `message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Выводит в `stderr` строку `'Trace: '`, за которой следует отформатированное сообщение [`util.format()`](/ru/nodejs/api/util#utilformatformat-args) и трассировка стека до текущей позиции в коде.

```js [ESM]
console.trace('Show me');
// Prints: (stack trace will vary based on where trace is called)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**Добавлено в версии: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Функция `console.warn()` является псевдонимом для [`console.error()`](/ru/nodejs/api/console#consoleerrordata-args).

## Методы, работающие только с отладчиком {#inspector-only-methods}

Следующие методы предоставляются движком V8 в общем API, но ничего не отображают, если не используются в сочетании с [отладчиком](/ru/nodejs/api/debugger) (флаг `--inspect`).

### `console.profile([label])` {#consoleprofilelabel}

**Добавлено в версии: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Этот метод ничего не отображает, если не используется в отладчике. Метод `console.profile()` запускает профилирование ЦП JavaScript с необязательной меткой до тех пор, пока не будет вызван [`console.profileEnd()`](/ru/nodejs/api/console#consoleprofileendlabel). Затем профиль добавляется на панель **Profile** отладчика.

```js [ESM]
console.profile('MyLabel');
// Какой-то код
console.profileEnd('MyLabel');
// Добавляет профиль 'MyLabel' на панель Profiles отладчика.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**Добавлено в версии: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Этот метод ничего не отображает, если не используется в отладчике. Останавливает текущий сеанс профилирования ЦП JavaScript, если он был запущен, и выводит отчет на панель **Profiles** отладчика. См. [`console.profile()`](/ru/nodejs/api/console#consoleprofilelabel) для примера.

Если этот метод вызывается без метки, останавливается последний запущенный профиль.

### `console.timeStamp([label])` {#consoletimestamplabel}

**Добавлено в версии: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Этот метод ничего не отображает, если не используется в отладчике. Метод `console.timeStamp()` добавляет событие с меткой `'label'` на панель **Timeline** отладчика.

