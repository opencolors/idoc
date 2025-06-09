---
title: Документация REPL Node.js
description: Изучите REPL Node.js (Read-Eval-Print Loop), который предоставляет интерактивную среду для выполнения кода JavaScript, отладки и тестирования приложений Node.js.
head:
  - - meta
    - name: og:title
      content: Документация REPL Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Изучите REPL Node.js (Read-Eval-Print Loop), который предоставляет интерактивную среду для выполнения кода JavaScript, отладки и тестирования приложений Node.js.
  - - meta
    - name: twitter:title
      content: Документация REPL Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Изучите REPL Node.js (Read-Eval-Print Loop), который предоставляет интерактивную среду для выполнения кода JavaScript, отладки и тестирования приложений Node.js.
---


# REPL {#repl}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

Модуль `node:repl` предоставляет реализацию Read-Eval-Print-Loop (REPL), которая доступна как в виде отдельной программы, так и может быть включена в другие приложения. Доступ к нему можно получить, используя:

::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## Дизайн и особенности {#design-and-features}

Модуль `node:repl` экспортирует класс [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver). Во время работы экземпляры [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver) будут принимать отдельные строки пользовательского ввода, вычислять их в соответствии с определяемой пользователем функцией вычисления, а затем выводить результат. Ввод и вывод могут осуществляться через `stdin` и `stdout` соответственно, или могут быть подключены к любому Node.js [потоку](/ru/nodejs/api/stream).

Экземпляры [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver) поддерживают автоматическое завершение ввода, предварительный просмотр завершения, упрощенное редактирование строк в стиле Emacs, многострочный ввод, обратный i-поиск в стиле [ZSH](https://en.wikipedia.org/wiki/Z_shell), поиск по истории на основе подстрок в стиле [ZSH](https://en.wikipedia.org/wiki/Z_shell), вывод в стиле ANSI, сохранение и восстановление текущего состояния сеанса REPL, восстановление после ошибок и настраиваемые функции вычисления. Терминалы, которые не поддерживают стили ANSI и редактирование строк в стиле Emacs, автоматически переходят к ограниченному набору функций.

### Команды и специальные клавиши {#commands-and-special-keys}

Следующие специальные команды поддерживаются всеми экземплярами REPL:

- `.break`: Во время ввода многострочного выражения введите команду `.break` (или нажмите +), чтобы прервать дальнейший ввод или обработку этого выражения.
- `.clear`: Сбрасывает `context` REPL в пустой объект и очищает любое вводимое многострочное выражение.
- `.exit`: Закрывает поток ввода-вывода, заставляя REPL завершить работу.
- `.help`: Показывает этот список специальных команд.
- `.save`: Сохраняет текущий сеанс REPL в файл: `\> .save ./file/to/save.js`
- `.load`: Загружает файл в текущий сеанс REPL. `\> .load ./file/to/load.js`
- `.editor`: Входит в режим редактора (+ для завершения, + для отмены).

```bash [BASH]
> .editor
// Entering editor mode (^D to finish, ^C to cancel)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
Следующие комбинации клавиш в REPL имеют следующие специальные эффекты:

- +: При однократном нажатии имеет тот же эффект, что и команда `.break`. При двойном нажатии на пустой строке имеет тот же эффект, что и команда `.exit`.
- +: Имеет тот же эффект, что и команда `.exit`.
- : При нажатии на пустой строке отображает глобальные и локальные (в области видимости) переменные. При нажатии во время ввода другого текста отображает соответствующие варианты автозаполнения.

Информацию о сочетаниях клавиш, связанных с обратным i-поиском, см. в разделе [`reverse-i-search`](/ru/nodejs/api/repl#reverse-i-search). Информацию обо всех остальных сочетаниях клавиш см. в разделе [Привязки клавиш TTY](/ru/nodejs/api/readline#tty-keybindings).


### Оценка по умолчанию {#default-evaluation}

По умолчанию все экземпляры [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver) используют функцию оценки, которая оценивает выражения JavaScript и предоставляет доступ ко встроенным модулям Node.js. Это поведение по умолчанию может быть переопределено путем передачи альтернативной функции оценки при создании экземпляра [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver).

#### Выражения JavaScript {#javascript-expressions}

Оценщик по умолчанию поддерживает прямую оценку выражений JavaScript:

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
Если не указано иное в пределах блоков или функций, переменные, объявленные либо неявно, либо с использованием ключевых слов `const`, `let` или `var`, объявляются в глобальной области видимости.

#### Глобальная и локальная область видимости {#global-and-local-scope}

Оценщик по умолчанию предоставляет доступ ко всем переменным, существующим в глобальной области видимости. Можно явно предоставить переменную REPL, присвоив ее объекту `context`, связанному с каждым `REPLServer`:

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

Свойства в объекте `context` отображаются как локальные в REPL:

```bash [BASH]
$ node repl_test.js
> m
'message'
```
Свойства контекста не являются доступными только для чтения по умолчанию. Чтобы указать глобальные переменные только для чтения, свойства контекста должны быть определены с использованием `Object.defineProperty()`:

::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### Доступ к основным модулям Node.js {#accessing-core-nodejs-modules}

Оценщик по умолчанию автоматически загрузит основные модули Node.js в среду REPL при использовании. Например, если не объявлено иное в качестве глобальной или локальной переменной, ввод `fs` будет оцениваться по запросу как `global.fs = require('node:fs')`.

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### Глобальные необработанные исключения {#global-uncaught-exceptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.3.0 | Событие `'uncaughtException'` теперь вызывается, если REPL используется как отдельная программа. |
:::

REPL использует модуль [`domain`](/ru/nodejs/api/domain) для перехвата всех необработанных исключений для данного REPL-сеанса.

Использование модуля [`domain`](/ru/nodejs/api/domain) в REPL имеет следующие побочные эффекты:

- Необработанные исключения вызывают только событие [`'uncaughtException'`](/ru/nodejs/api/process#event-uncaughtexception) в автономном REPL. Добавление прослушивателя для этого события в REPL внутри другой программы Node.js приведет к [`ERR_INVALID_REPL_INPUT`](/ru/nodejs/api/errors#err_invalid_repl_input).
- Попытка использовать [`process.setUncaughtExceptionCaptureCallback()`](/ru/nodejs/api/process#processsetUncaughtExceptionCaptureCallbackfn) вызовет ошибку [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/ru/nodejs/api/errors#err_domain_cannot_set_uncaught_exception_capture).

#### Присваивание переменной `_` (подчеркивание) {#assignment-of-the-_-underscore-variable}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v9.8.0 | Добавлена поддержка `_error`. |
:::

По умолчанию, стандартный оценщик присваивает результат последнего вычисленного выражения специальной переменной `_` (подчеркивание). Явное присваивание `_` значения отключит это поведение.

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Expression assignment to _ now disabled.
4
> 1 + 1
2
> _
4
```

Аналогично, `_error` будет ссылаться на последнюю увиденную ошибку, если таковая была. Явное присваивание `_error` значения отключит это поведение.

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### Ключевое слово `await` {#await-keyword}

Поддержка ключевого слова `await` включена на верхнем уровне.

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```
Одним из известных ограничений использования ключевого слова `await` в REPL является то, что оно делает недействительной лексическую область действия ключевых слов `const` и `let`.

Например:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```
[`--no-experimental-repl-await`](/ru/nodejs/api/cli#--no-experimental-repl-await) отключает await верхнего уровня в REPL.


### Обратный i-поиск {#reverse-i-search}

**Добавлено в: v13.6.0, v12.17.0**

REPL поддерживает двунаправленный обратный i-поиск, аналогичный [ZSH](https://en.wikipedia.org/wiki/Z_shell). Он запускается с помощью + для поиска назад и + для поиска вперед.

Повторяющиеся записи истории будут пропущены.

Записи принимаются, как только нажата любая клавиша, не соответствующая обратному поиску. Отмена возможна нажатием  или +.

Изменение направления немедленно ищет следующую запись в ожидаемом направлении от текущей позиции.

### Пользовательские функции оценки {#custom-evaluation-functions}

При создании нового [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver) можно предоставить пользовательскую функцию оценки. Это можно использовать, например, для реализации полностью настраиваемых приложений REPL.

Ниже приведен пример REPL, который возводит данное число в квадрат:

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Enter a number: ', eval: myEval });
```
:::

#### Восстанавливаемые ошибки {#recoverable-errors}

В командной строке REPL нажатие  отправляет текущую строку ввода в функцию `eval`. Чтобы поддержать многострочный ввод, функция `eval` может возвращать экземпляр `repl.Recoverable` в предоставленную функцию обратного вызова:

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### Настройка вывода REPL {#customizing-repl-output}

По умолчанию экземпляры [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver) форматируют вывод с использованием метода [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options) перед записью вывода в предоставленный поток `Writable` (по умолчанию `process.stdout`). Параметр проверки `showProxy` по умолчанию установлен в true, а параметр `colors` установлен в true в зависимости от параметра REPL `useColors`.

Булева опция `useColors` может быть указана при создании, чтобы указать средству записи по умолчанию использовать коды стиля ANSI для раскрашивания вывода из метода `util.inspect()`.

Если REPL запускается как отдельная программа, также можно изменить [значения по умолчанию для проверки](/ru/nodejs/api/util#utilinspectobject-options) REPL изнутри REPL, используя свойство `inspect.replDefaults`, которое отражает `defaultOptions` из [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options).

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
Чтобы полностью настроить вывод экземпляра [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver), передайте новую функцию для параметра `writer` при создании. Следующий пример, например, просто преобразует любой входной текст в верхний регистр:

::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## Класс: `REPLServer` {#class-replserver}

**Добавлено в: v0.1.91**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [`repl.start()`](/ru/nodejs/api/repl#replstartoptions)
- Расширяет: [\<readline.Interface\>](/ru/nodejs/api/readline#class-readlineinterface)

Экземпляры `repl.REPLServer` создаются с использованием метода [`repl.start()`](/ru/nodejs/api/repl#replstartoptions) или непосредственно с использованием ключевого слова JavaScript `new`.

::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### Событие: `'exit'` {#event-exit}

**Добавлено в версии: v0.7.7**

Событие `'exit'` возникает, когда REPL завершает работу либо при получении команды `.exit` в качестве входных данных, либо когда пользователь дважды нажимает + для сигнализации `SIGINT`, либо при нажатии + для сигнализации `'end'` во входном потоке. Функция обратного вызова прослушивателя вызывается без каких-либо аргументов.

```js [ESM]
replServer.on('exit', () => {
  console.log('Получено событие "exit" из repl!');
  process.exit();
});
```
### Событие: `'reset'` {#event-reset}

**Добавлено в версии: v0.11.0**

Событие `'reset'` возникает, когда контекст REPL сбрасывается. Это происходит всякий раз, когда в качестве входных данных получена команда `.clear` *если только* REPL не использует оценщик по умолчанию и экземпляр `repl.REPLServer` не был создан с параметром `useGlobal`, установленным в `true`. Функция обратного вызова прослушивателя будет вызвана со ссылкой на объект `context` в качестве единственного аргумента.

Это можно использовать в основном для повторной инициализации контекста REPL до некоторого предопределенного состояния:



::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

Когда этот код выполняется, глобальная переменная `'m'` может быть изменена, но затем возвращена к своему начальному значению с помощью команды `.clear`:

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**Добавлено в версии: v0.3.0**

- `keyword` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ключевое слово команды (*без* начального символа `.`).
- `cmd` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, вызываемая при обработке команды.

Метод `replServer.defineCommand()` используется для добавления новых команд с префиксом `.` в экземпляр REPL. Такие команды вызываются путем ввода `.` с последующим `keyword`. `cmd` - это либо `Function`, либо `Object` со следующими свойствами:

- `help` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Текст справки, отображаемый при вводе `.help` (необязательно).
- `action` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция для выполнения, необязательно принимающая один строковый аргумент.

В следующем примере показаны две новые команды, добавленные в экземпляр REPL:



::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

Новые команды затем можно использовать из экземпляра REPL:

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Добавлено в: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Метод `replServer.displayPrompt()` подготавливает экземпляр REPL для ввода от пользователя, печатая настроенный `prompt` в новой строке в `output` и возобновляя `input` для приема нового ввода.

Когда вводится многострочный ввод, вместо 'prompt' печатается многоточие.

Когда `preserveCursor` имеет значение `true`, положение курсора не будет сброшено на `0`.

Метод `replServer.displayPrompt` в основном предназначен для вызова из функции действия для команд, зарегистрированных с помощью метода `replServer.defineCommand()`.

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Добавлено в: v9.0.0**

Метод `replServer.clearBufferedCommand()` очищает любую команду, которая была буферизована, но еще не выполнена. Этот метод в основном предназначен для вызова из функции действия для команд, зарегистрированных с помощью метода `replServer.defineCommand()`.

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Добавлено в: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) путь к файлу истории
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) вызывается, когда записи истории готовы или при ошибке
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/ru/nodejs/api/repl#class-replserver)
  
 

Инициализирует файл журнала истории для экземпляра REPL. При выполнении бинарного файла Node.js и использовании REPL командной строки файл истории инициализируется по умолчанию. Однако это не так при создании REPL программным путем. Используйте этот метод для инициализации файла журнала истории при работе с экземплярами REPL программным путем.

## `repl.builtinModules` {#replbuiltinmodules}

**Добавлено в: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Список имен всех модулей Node.js, например, `'http'`.


## `repl.start([options])` {#replstartoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.4.0, v12.17.0 | Теперь доступна опция `preview`. |
| v12.0.0 | Опция `terminal` теперь во всех случаях следует описанию по умолчанию, а `useColors` проверяет `hasColors()`, если она доступна. |
| v10.0.0 | `replMode` `REPL_MAGIC_MODE` был удален. |
| v6.3.0 | Теперь поддерживается опция `breakEvalOnSigint`. |
| v5.8.0 | Параметр `options` теперь необязателен. |
| v0.1.91 | Добавлено в версии: v0.1.91 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ввод запроса для отображения. **По умолчанию:** `'\> '` (с пробелом в конце).
    - `input` [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) Поток `Readable`, из которого будет считываться ввод REPL. **По умолчанию:** `process.stdin`.
    - `output` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable) Поток `Writable`, в который будет записываться вывод REPL. **По умолчанию:** `process.stdout`.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, указывает, что `output` следует рассматривать как TTY-терминал. **По умолчанию:** проверка значения свойства `isTTY` в потоке `output` при создании экземпляра.
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, используемая для вычисления каждой заданной строки ввода. **По умолчанию:** асинхронная обертка для JavaScript-функции `eval()`. Функция `eval` может выдавать ошибку с `repl.Recoverable`, чтобы указать, что ввод был неполным, и запросить дополнительные строки.
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, указывает, что функция `writer` по умолчанию должна включать ANSI-цвета в вывод REPL. Если предоставлена пользовательская функция `writer`, это не оказывает никакого влияния. **По умолчанию:** проверка поддержки цветов в потоке `output`, если значение `terminal` экземпляра REPL равно `true`.
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, указывает, что функция оценки по умолчанию будет использовать JavaScript `global` в качестве контекста, а не создавать новый отдельный контекст для экземпляра REPL. REPL CLI node устанавливает это значение равным `true`. **По умолчанию:** `false`.
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, указывает, что средство записи по умолчанию не будет выводить возвращаемое значение команды, если оно оценивается как `undefined`. **По умолчанию:** `false`.
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, вызываемая для форматирования вывода каждой команды перед записью в `output`. **По умолчанию:** [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options).
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательная функция, используемая для пользовательского автозаполнения клавишей Tab. Пример см. в [`readline.InterfaceCompleter`](/ru/nodejs/api/readline#use-of-the-completer-function).
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Флаг, указывающий, выполняет ли средство оценки по умолчанию все команды JavaScript в строгом режиме или в режиме по умолчанию (небрежном). Допустимые значения:
    - `repl.REPL_MODE_SLOPPY` для оценки выражений в небрежном режиме.
    - `repl.REPL_MODE_STRICT` для оценки выражений в строгом режиме. Это эквивалентно добавлению `'use strict'` в начале каждого оператора repl.

    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Прекратить вычисление текущего фрагмента кода при получении `SIGINT`, например, при нажатии клавиши +. Нельзя использовать вместе с пользовательской функцией `eval`. **По умолчанию:** `false`.
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Определяет, печатает ли repl автозаполнение и предварительный просмотр вывода. **По умолчанию:** `true` с функцией eval по умолчанию и `false` в случае использования пользовательской функции eval. Если `terminal` имеет значение falsy, то нет предварительного просмотра, и значение `preview` не имеет эффекта.

- Возвращает: [\<repl.REPLServer\>](/ru/nodejs/api/repl#class-replserver)

Метод `repl.start()` создает и запускает экземпляр [`repl.REPLServer`](/ru/nodejs/api/repl#class-replserver).

Если `options` является строкой, то она определяет приглашение ввода:

::: code-group
```js [ESM]
import repl from 'node:repl';

// приглашение в стиле Unix
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// приглашение в стиле Unix
repl.start('$ ');
```
:::


## REPL Node.js {#the-nodejs-repl}

Сам Node.js использует модуль `node:repl` для предоставления собственного интерактивного интерфейса для выполнения JavaScript. Его можно использовать, выполнив двоичный файл Node.js без передачи каких-либо аргументов (или передав аргумент `-i`):

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### Параметры переменных среды {#environment-variable-options}

Различное поведение REPL Node.js можно настроить с помощью следующих переменных среды:

- `NODE_REPL_HISTORY`: Если указан допустимый путь, постоянная история REPL будет сохранена в указанный файл, а не в `.node_repl_history` в домашнем каталоге пользователя. Установка этого значения в `''` (пустая строка) отключит постоянную историю REPL. Пробелы будут удалены из значения. В операционных системах Windows переменные среды с пустыми значениями недопустимы, поэтому установите для этой переменной один или несколько пробелов, чтобы отключить постоянную историю REPL.
- `NODE_REPL_HISTORY_SIZE`: Определяет, сколько строк истории будет сохранено, если история доступна. Должно быть положительным числом. **По умолчанию:** `1000`.
- `NODE_REPL_MODE`: Может быть `'sloppy'` или `'strict'`. **По умолчанию:** `'sloppy'`, что позволит запускать код не в строгом режиме.

### Постоянная история {#persistent-history}

По умолчанию REPL Node.js будет сохранять историю между сеансами REPL `node`, сохраняя вводы в файл `.node_repl_history`, расположенный в домашнем каталоге пользователя. Это можно отключить, установив переменную среды `NODE_REPL_HISTORY=''`.

### Использование REPL Node.js с продвинутыми редакторами строк {#using-the-nodejs-repl-with-advanced-line-editors}

Для продвинутых редакторов строк запустите Node.js с переменной среды `NODE_NO_READLINE=1`. Это запустит основной REPL и REPL отладчика в канонических настройках терминала, что позволит использовать `rlwrap`.

Например, следующее можно добавить в файл `.bashrc`:

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### Запуск нескольких экземпляров REPL для одного работающего экземпляра {#starting-multiple-repl-instances-against-a-single-running-instance}

Можно создавать и запускать несколько экземпляров REPL для одного работающего экземпляра Node.js, которые используют один и тот же объект `global`, но имеют отдельные интерфейсы ввода-вывода.

Например, следующий пример предоставляет отдельные REPL на `stdin`, Unix-сокете и TCP-сокете:

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

Запуск этого приложения из командной строки запустит REPL на stdin. Другие клиенты REPL могут подключаться через Unix-сокет или TCP-сокет. `telnet`, например, полезен для подключения к TCP-сокетам, а `socat` можно использовать для подключения как к Unix, так и к TCP-сокетам.

Запустив REPL с сервера на основе Unix-сокета, а не stdin, можно подключиться к долго работающему процессу Node.js без его перезапуска.

Пример запуска "полнофункционального" (`terminal`) REPL через экземпляр `net.Server` и `net.Socket` см.: [https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310).

Пример запуска экземпляра REPL через [`curl(1)`](https://curl.haxx.se/docs/manpage) см.: [https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342).

Этот пример предназначен исключительно для образовательных целей, чтобы продемонстрировать, как можно запускать REPL Node.js с использованием различных потоков ввода-вывода. Его **не следует** использовать в производственных средах или в любом контексте, где безопасность является проблемой, без дополнительных защитных мер. Если вам нужно реализовать REPL в реальном приложении, рассмотрите альтернативные подходы, снижающие эти риски, такие как использование безопасных механизмов ввода и избежание открытых сетевых интерфейсов.

