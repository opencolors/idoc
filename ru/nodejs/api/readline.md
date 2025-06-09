---
title: Документация Node.js - Readline
description: Модуль readline в Node.js предоставляет интерфейс для чтения данных из читаемого потока (например, process.stdin) построчно. Он поддерживает создание интерфейсов для чтения ввода с консоли, обработки пользовательского ввода и управления операциями по строкам.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль readline в Node.js предоставляет интерфейс для чтения данных из читаемого потока (например, process.stdin) построчно. Он поддерживает создание интерфейсов для чтения ввода с консоли, обработки пользовательского ввода и управления операциями по строкам.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль readline в Node.js предоставляет интерфейс для чтения данных из читаемого потока (например, process.stdin) построчно. Он поддерживает создание интерфейсов для чтения ввода с консоли, обработки пользовательского ввода и управления операциями по строкам.
---


# Readline {#readline}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

Модуль `node:readline` предоставляет интерфейс для чтения данных из [Readable](/ru/nodejs/api/stream#readable-streams) потока (такого как [`process.stdin`](/ru/nodejs/api/process#processstdin)) построчно.

Чтобы использовать API, основанные на промисах:

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

Чтобы использовать API с обратными вызовами и синхронные API:

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

Следующий простой пример иллюстрирует основное использование модуля `node:readline`.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('What do you think of Node.js? ');

console.log(`Thank you for your valuable feedback: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('What do you think of Node.js? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});
```
:::

После вызова этого кода приложение Node.js не завершится, пока `readline.Interface` не будет закрыт, поскольку интерфейс ожидает получения данных из потока `input`.

## Класс: `InterfaceConstructor` {#class-interfaceconstructor}

**Добавлено в версии: v0.1.104**

- Расширяет: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Экземпляры класса `InterfaceConstructor` создаются с помощью метода `readlinePromises.createInterface()` или `readline.createInterface()`. Каждый экземпляр связан с одним потоком `input` [Readable](/ru/nodejs/api/stream#readable-streams) и одним потоком `output` [Writable](/ru/nodejs/api/stream#writable-streams). Поток `output` используется для печати запросов ввода от пользователя, который поступает и считывается из потока `input`.


### Событие: `'close'` {#event-close}

**Добавлено в версии: v0.1.98**

Событие `'close'` генерируется при наступлении одного из следующих случаев:

- Вызывается метод `rl.close()` и экземпляр `InterfaceConstructor` отказывается от контроля над потоками `input` и `output`;
- Поток `input` получает событие `'end'`;
- Поток `input` получает + для сигнализации конца передачи (EOT);
- Поток `input` получает + для сигнализации `SIGINT` и на экземпляре `InterfaceConstructor` не зарегистрирован обработчик события `'SIGINT'`.

Функция-слушатель вызывается без передачи каких-либо аргументов.

Экземпляр `InterfaceConstructor` завершается после того, как сгенерировано событие `'close'`.

### Событие: `'line'` {#event-line}

**Добавлено в версии: v0.1.98**

Событие `'line'` генерируется всякий раз, когда поток `input` получает ввод с признаком конца строки (`\n`, `\r` или `\r\n`). Обычно это происходит, когда пользователь нажимает  или .

Событие `'line'` также генерируется, если из потока были прочитаны новые данные и этот поток завершается без конечного маркера конца строки.

Функция-слушатель вызывается со строкой, содержащей одну строку полученных входных данных.

```js [ESM]
rl.on('line', (input) => {
  console.log(`Получено: ${input}`);
});
```
### Событие: `'history'` {#event-history}

**Добавлено в версии: v15.8.0, v14.18.0**

Событие `'history'` генерируется всякий раз, когда массив истории был изменен.

Функция-слушатель вызывается с массивом, содержащим массив истории. Он будет отражать все изменения, добавленные строки и удаленные строки из-за `historySize` и `removeHistoryDuplicates`.

Основная цель состоит в том, чтобы позволить слушателю сохранять историю. Слушатель также может изменить объект истории. Это может быть полезно для предотвращения добавления определенных строк в историю, например, пароля.

```js [ESM]
rl.on('history', (history) => {
  console.log(`Получено: ${history}`);
});
```
### Событие: `'pause'` {#event-pause}

**Добавлено в версии: v0.7.5**

Событие `'pause'` генерируется при наступлении одного из следующих случаев:

- Поток `input` приостановлен.
- Поток `input` не приостановлен и получает событие `'SIGCONT'`. (См. события [`'SIGTSTP'`](/ru/nodejs/api/readline#event-sigtstp) и [`'SIGCONT'`](/ru/nodejs/api/readline#event-sigcont).)

Функция-слушатель вызывается без передачи каких-либо аргументов.

```js [ESM]
rl.on('pause', () => {
  console.log('Readline приостановлен.');
});
```

### Событие: `'resume'` {#event-resume}

**Добавлено в: v0.7.5**

Событие `'resume'` возникает всякий раз, когда поток `input` возобновляется.

Функция-слушатель вызывается без передачи каких-либо аргументов.

```js [ESM]
rl.on('resume', () => {
  console.log('Readline возобновлен.');
});
```
### Событие: `'SIGCONT'` {#event-sigcont}

**Добавлено в: v0.7.5**

Событие `'SIGCONT'` возникает, когда процесс Node.js, ранее перемещенный в фоновый режим с помощью + (т.е. `SIGTSTP`), затем возвращается на передний план с помощью [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p).

Если поток `input` был приостановлен *до* запроса `SIGTSTP`, это событие не будет сгенерировано.

Функция-слушатель вызывается без передачи каких-либо аргументов.

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` автоматически возобновит поток
  rl.prompt();
});
```
Событие `'SIGCONT'` *не* поддерживается в Windows.

### Событие: `'SIGINT'` {#event-sigint}

**Добавлено в: v0.3.0**

Событие `'SIGINT'` возникает всякий раз, когда поток `input` получает ввод, обычно известный как `SIGINT`. Если при получении потоком `input` сигнала `SIGINT` не зарегистрировано ни одного слушателя событий `'SIGINT'`, будет сгенерировано событие `'pause'`.

Функция-слушатель вызывается без передачи каких-либо аргументов.

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('Вы уверены, что хотите выйти? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### Событие: `'SIGTSTP'` {#event-sigtstp}

**Добавлено в: v0.7.5**

Событие `'SIGTSTP'` возникает, когда поток `input` получает ввод +, обычно известный как `SIGTSTP`. Если при получении потоком `input` сигнала `SIGTSTP` не зарегистрировано ни одного слушателя событий `'SIGTSTP'`, процесс Node.js будет отправлен в фоновый режим.

Когда программа возобновляется с помощью [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p), будут сгенерированы события `'pause'` и `'SIGCONT'`. Их можно использовать для возобновления потока `input`.

События `'pause'` и `'SIGCONT'` не будут сгенерированы, если `input` был приостановлен до того, как процесс был отправлен в фоновый режим.

Функция-слушатель вызывается без передачи каких-либо аргументов.

```js [ESM]
rl.on('SIGTSTP', () => {
  // Это переопределит SIGTSTP и предотвратит переход программы в
  // фоновый режим.
  console.log('Пойман SIGTSTP.');
});
```
Событие `'SIGTSTP'` *не* поддерживается в Windows.


### `rl.close()` {#rlclose}

**Добавлено в: v0.1.98**

Метод `rl.close()` закрывает экземпляр `InterfaceConstructor` и освобождает контроль над потоками `input` и `output`. При вызове будет сгенерировано событие `'close'`.

Вызов `rl.close()` не немедленно останавливает генерацию других событий (включая `'line'`) экземпляром `InterfaceConstructor`.

### `rl.pause()` {#rlpause}

**Добавлено в: v0.3.4**

Метод `rl.pause()` приостанавливает поток `input`, позволяя возобновить его позже, если это необходимо.

Вызов `rl.pause()` не немедленно приостанавливает генерацию других событий (включая `'line'`) экземпляром `InterfaceConstructor`.

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**Добавлено в: v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, предотвращает сброс позиции курсора на `0`.

Метод `rl.prompt()` записывает настроенное свойство `prompt` экземпляра `InterfaceConstructor` на новую строку в `output`, чтобы предоставить пользователю новое место для ввода данных.

При вызове `rl.prompt()` возобновит поток `input`, если он был приостановлен.

Если `InterfaceConstructor` был создан с `output`, установленным в `null` или `undefined`, приглашение не записывается.

### `rl.resume()` {#rlresume}

**Добавлено в: v0.3.4**

Метод `rl.resume()` возобновляет поток `input`, если он был приостановлен.

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**Добавлено в: v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `rl.setPrompt()` устанавливает приглашение, которое будет записано в `output` при каждом вызове `rl.prompt()`.

### `rl.getPrompt()` {#rlgetprompt}

**Добавлено в: v15.3.0, v14.17.0**

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) текущую строку приглашения

Метод `rl.getPrompt()` возвращает текущее приглашение, используемое `rl.prompt()`.

### `rl.write(data[, key])` {#rlwritedata-key}

**Добавлено в: v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, чтобы указать клавишу Ctrl.
    - `meta` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, чтобы указать клавишу Meta.
    - `shift` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, чтобы указать клавишу Shift.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя клавиши.

Метод `rl.write()` запишет либо `data`, либо последовательность клавиш, идентифицируемую по `key`, в `output`. Аргумент `key` поддерживается только в том случае, если `output` является текстовым терминалом [TTY](/ru/nodejs/api/tty). См. [Сочетания клавиш TTY](/ru/nodejs/api/readline#tty-keybindings) для списка комбинаций клавиш.

Если указан `key`, то `data` игнорируется.

При вызове `rl.write()` возобновит поток `input`, если он был приостановлен.

Если `InterfaceConstructor` был создан с `output`, установленным в `null` или `undefined`, то `data` и `key` не записываются.

```js [ESM]
rl.write('Delete this!');
// Simulate Ctrl+U to delete the line written previously
rl.write(null, { ctrl: true, name: 'u' });
```

Метод `rl.write()` запишет данные в `input` `Interface` `readline` *так, как если бы они были предоставлены пользователем*.


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.14.0, v10.17.0 | Поддержка Symbol.asyncIterator больше не является экспериментальной. |
| v11.4.0, v10.16.0 | Добавлено в: v11.4.0, v10.16.0 |
:::

- Возвращает: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

Создает объект `AsyncIterator`, который перебирает каждую строку во входном потоке как строку. Этот метод позволяет асинхронно итерировать объекты `InterfaceConstructor` через циклы `for await...of`.

Ошибки во входном потоке не пересылаются.

Если цикл завершается с помощью `break`, `throw` или `return`, будет вызван [`rl.close()`](/ru/nodejs/api/readline#rlclose). Другими словами, итерация по `InterfaceConstructor` всегда будет полностью потреблять входной поток.

Производительность не соответствует традиционному API события `'line'`. Используйте `'line'` вместо этого для приложений, чувствительных к производительности.

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // Каждая строка во входных данных readline будет последовательно доступна здесь как
    // `line`.
  }
}
```
`readline.createInterface()` начнет потреблять входной поток после вызова. Наличие асинхронных операций между созданием интерфейса и асинхронной итерацией может привести к пропущенным строкам.

### `rl.line` {#rlline}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.8.0, v14.18.0 | Значение всегда будет строкой, никогда не будет неопределенным. |
| v0.1.98 | Добавлено в: v0.1.98 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Текущие входные данные, обрабатываемые node.

Это можно использовать при сборе ввода из TTY-потока для получения текущего значения, которое было обработано до сих пор, до того, как будет сгенерировано событие `line`. После того, как событие `line` было сгенерировано, это свойство будет пустой строкой.

Имейте в виду, что изменение значения во время работы экземпляра может иметь непредвиденные последствия, если `rl.cursor` также не контролируется.

**Если не используется TTY-поток для ввода, используйте <a href="#event-line"><code>'line'</code></a> событие.**

Один из возможных вариантов использования может быть следующим:

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**Добавлено в: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Позиция курсора относительно `rl.line`.

Отслеживает положение текущего курсора в строке ввода при чтении ввода из TTY-потока. Положение курсора определяет часть строки ввода, которая будет изменена при обработке ввода, а также столбец, в котором будет отображаться терминальный курсор.

### `rl.getCursorPos()` {#rlgetcursorpos}

**Добавлено в: v13.5.0, v12.16.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) строка приглашения, в которой в данный момент находится курсор
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) столбец экрана, в котором в данный момент находится курсор

Возвращает реальную позицию курсора относительно приглашения ввода + строки. Длинные строки ввода (с переносом), а также многострочные приглашения включены в расчеты.

## Promises API {#promises-api}

**Добавлено в: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная функция
:::

### Класс: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**Добавлено в: v17.0.0**

- Расширяет: [\<readline.InterfaceConstructor\>](/ru/nodejs/api/readline#class-interfaceconstructor)

Экземпляры класса `readlinePromises.Interface` конструируются с использованием метода `readlinePromises.createInterface()`. Каждый экземпляр связан с одним потоком `input` [Readable](/ru/nodejs/api/stream#readable-streams) и одним потоком `output` [Writable](/ru/nodejs/api/stream#writable-streams). Поток `output` используется для печати приглашений для ввода пользователя, который поступает и считывается из потока `input`.


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Добавлено в версии: v17.0.0**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Утверждение или запрос для записи в `output`, добавляемый перед приглашением.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) При желании позволяет отменить `question()` с помощью `AbortSignal`.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Promise, который выполняется с вводом пользователя в ответ на `query`.

Метод `rl.question()` отображает `query`, записывая его в `output`, ожидает ввода пользователя в `input`, затем вызывает функцию `callback`, передавая предоставленный ввод в качестве первого аргумента.

При вызове `rl.question()` возобновит поток `input`, если он был приостановлен.

Если `readlinePromises.Interface` был создан с `output`, установленным в `null` или `undefined`, то `query` не записывается.

Если вопрос вызван после `rl.close()`, он возвращает отклоненный promise.

Пример использования:

```js [ESM]
const answer = await rl.question('What is your favorite food? ');
console.log(`Oh, so your favorite food is ${answer}`);
```
Использование `AbortSignal` для отмены вопроса.

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('The food question timed out');
}, { once: true });

const answer = await rl.question('What is your favorite food? ', { signal });
console.log(`Oh, so your favorite food is ${answer}`);
```
### Класс: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Добавлено в версии: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Добавлено в версии: v17.0.0**

- `stream` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable) Поток [TTY](/ru/nodejs/api/tty).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, нет необходимости вызывать `rl.commit()`.


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Добавлено в: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: слева от курсора
    - `1`: справа от курсора
    - `0`: вся строка
  
 
- Возвращает: this

Метод `rl.clearLine()` добавляет во внутренний список ожидающих действий действие, которое очищает текущую строку связанного `stream` в указанном направлении, определяемом `dir`. Вызовите `rl.commit()`, чтобы увидеть эффект этого метода, если только `autoCommit: true` не был передан в конструктор.

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Добавлено в: v17.0.0**

- Возвращает: this

Метод `rl.clearScreenDown()` добавляет во внутренний список ожидающих действий действие, которое очищает связанный поток от текущей позиции курсора вниз. Вызовите `rl.commit()`, чтобы увидеть эффект этого метода, если только `autoCommit: true` не был передан в конструктор.

#### `rl.commit()` {#rlcommit}

**Добавлено в: v17.0.0**

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Метод `rl.commit()` отправляет все ожидающие действия связанному `stream` и очищает внутренний список ожидающих действий.

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Добавлено в: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: this

Метод `rl.cursorTo()` добавляет во внутренний список ожидающих действий действие, которое перемещает курсор в указанную позицию в связанном `stream`. Вызовите `rl.commit()`, чтобы увидеть эффект этого метода, если только `autoCommit: true` не был передан в конструктор.

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Добавлено в: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: this

Метод `rl.moveCursor()` добавляет во внутренний список ожидающих действий действие, которое перемещает курсор *относительно* его текущей позиции в связанном `stream`. Вызовите `rl.commit()`, чтобы увидеть эффект этого метода, если только `autoCommit: true` не был передан в конструктор.


#### `rl.rollback()` {#rlrollback}

**Добавлено в версии: v17.0.0**

- Возвращает: this

Метод `rl.rollback` очищает внутренний список ожидающих действий, не отправляя его в связанный `stream`.

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**Добавлено в версии: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) [Readable](/ru/nodejs/api/stream#readable-streams) поток для прослушивания. Этот параметр *обязателен*.
    - `output` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable) [Writable](/ru/nodejs/api/stream#writable-streams) поток для записи данных readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательная функция, используемая для автозавершения Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если потоки `input` и `output` должны рассматриваться как TTY и иметь записанные в них escape-коды ANSI/VT100. **По умолчанию:** проверка `isTTY` в потоке `output` при создании экземпляра.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Начальный список строк истории. Этот параметр имеет смысл, только если `terminal` установлен в `true` пользователем или внутренней проверкой `output`, в противном случае механизм кэширования истории вообще не инициализируется. **По умолчанию:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество сохраняемых строк истории. Чтобы отключить историю, установите для этого значения `0`. Этот параметр имеет смысл, только если `terminal` установлен в `true` пользователем или внутренней проверкой `output`, в противном случае механизм кэширования истории вообще не инициализируется. **По умолчанию:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, когда новая строка ввода, добавленная в список истории, дублирует более старую, это удаляет более старую строку из списка. **По умолчанию:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка приглашения для использования. **По умолчанию:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если задержка между `\r` и `\n` превышает `crlfDelay` миллисекунд, то и `\r`, и `\n` будут рассматриваться как отдельные входные данные конца строки. `crlfDelay` будет приведён к числу не менее `100`. Его можно установить в `Infinity`, и в этом случае `\r`, за которым следует `\n`, всегда будет считаться одним символом новой строки (что может быть разумным для [чтения файлов](/ru/nodejs/api/readline#example-read-file-stream-line-by-line) с разделителем строк `\r\n`). **По умолчанию:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Продолжительность, в течение которой `readlinePromises` будет ожидать символ (при чтении неоднозначной последовательности клавиш в миллисекундах, которая может как сформировать полную последовательность клавиш, используя введенные до сих пор данные, так и принять дополнительные входные данные для завершения более длинной последовательности клавиш). **По умолчанию:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество пробелов, которому равна табуляция (минимум 1). **По умолчанию:** `8`.
  
 
- Возвращает: [\<readlinePromises.Interface\>](/ru/nodejs/api/readline#class-readlinepromisesinterface)

Метод `readlinePromises.createInterface()` создает новый экземпляр `readlinePromises.Interface`.



::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

После создания экземпляра `readlinePromises.Interface` наиболее распространенным случаем является прослушивание события `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Если `terminal` имеет значение `true` для этого экземпляра, то поток `output` получит наилучшую совместимость, если он определяет свойство `output.columns` и выдает событие `'resize'` для `output`, если или когда столбцы когда-либо изменятся ([`process.stdout`](/ru/nodejs/api/process#processstdout) делает это автоматически, когда это TTY).


#### Использование функции `completer` {#use-of-the-completer-function}

Функция `completer` принимает текущую строку, введенную пользователем, в качестве аргумента и возвращает `Array` с 2 элементами:

- `Array` с соответствующими записями для завершения.
- Подстрока, которая использовалась для сопоставления.

Например: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}
```
Функция `completer` также может возвращать [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) или быть асинхронной:

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## Callback API {#callback-api}

**Добавлено в версии: v0.1.104**

### Класс: `readline.Interface` {#class-readlineinterface}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.0.0 | Класс `readline.Interface` теперь наследуется от `Interface`. |
| v0.1.104 | Добавлено в версии: v0.1.104 |
:::

- Расширяет: [\<readline.InterfaceConstructor\>](/ru/nodejs/api/readline#class-interfaceconstructor)

Экземпляры класса `readline.Interface` конструируются с использованием метода `readline.createInterface()`. Каждый экземпляр связан с одним `input` [Readable](/ru/nodejs/api/stream#readable-streams) потоком и одним `output` [Writable](/ru/nodejs/api/stream#writable-streams) потоком. `output` поток используется для печати подсказок для ввода пользователя, который поступает в `input` поток и считывается из него.

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**Добавлено в версии: v0.3.3**

- `query` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Утверждение или запрос для записи в `output`, добавляется перед приглашением.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) При необходимости позволяет отменить `question()` с помощью `AbortController`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, которая вызывается с пользовательским вводом в ответ на `query`.

Метод `rl.question()` отображает `query`, записывая его в `output`, ожидает ввода пользователя в `input`, а затем вызывает функцию `callback`, передавая предоставленный ввод в качестве первого аргумента.

При вызове `rl.question()` возобновит `input` поток, если он был приостановлен.

Если `readline.Interface` был создан с `output`, установленным в `null` или `undefined`, `query` не записывается.

Функция `callback`, переданная в `rl.question()`, не соответствует типичной схеме принятия объекта `Error` или `null` в качестве первого аргумента. `callback` вызывается с предоставленным ответом в качестве единственного аргумента.

Будет выброшена ошибка при вызове `rl.question()` после `rl.close()`.

Пример использования:

```js [ESM]
rl.question('What is your favorite food? ', (answer) => {
  console.log(`Oh, so your favorite food is ${answer}`);
});
```
Использование `AbortController` для отмены вопроса.

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('What is your favorite food? ', { signal }, (answer) => {
  console.log(`Oh, so your favorite food is ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('The food question timed out');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимой функции обратного вызова в аргументе `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Функция обратного вызова write() потока и возвращаемое значение предоставляются. |
| v0.7.7 | Добавлено в: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: слева от курсора
    - `1`: справа от курсора
    - `0`: вся строка
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения операции.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если `stream` хочет, чтобы вызывающий код ждал, пока не будет сгенерировано событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

Метод `readline.clearLine()` очищает текущую строку заданного [TTY](/ru/nodejs/api/tty) потока в указанном направлении, определяемом `dir`.

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимой функции обратного вызова в аргументе `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Функция обратного вызова write() потока и возвращаемое значение предоставляются. |
| v0.7.7 | Добавлено в: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения операции.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если `stream` хочет, чтобы вызывающий код ждал, пока не будет сгенерировано событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

Метод `readline.clearScreenDown()` очищает заданный [TTY](/ru/nodejs/api/tty) поток от текущей позиции курсора вниз.


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.14.0, v14.18.0 | Теперь поддерживается опция `signal`. |
| v15.8.0, v14.18.0 | Теперь поддерживается опция `history`. |
| v13.9.0 | Теперь поддерживается опция `tabSize`. |
| v8.3.0, v6.11.4 | Убрано максимальное ограничение опции `crlfDelay`. |
| v6.6.0 | Теперь поддерживается опция `crlfDelay`. |
| v6.3.0 | Теперь поддерживается опция `prompt`. |
| v6.0.0 | Теперь `historySize` может быть `0`. |
| v0.1.98 | Добавлено в: v0.1.98 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) [Читаемый](/ru/nodejs/api/stream#readable-streams) поток для прослушивания. Эта опция *обязательна*.
    - `output` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable) [Записываемый](/ru/nodejs/api/stream#writable-streams) поток, в который записываются данные readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательная функция, используемая для автозаполнения с помощью Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если потоки `input` и `output` должны рассматриваться как TTY и иметь записанные в них escape-коды ANSI/VT100. **По умолчанию:** проверка `isTTY` в потоке `output` при создании экземпляра.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Начальный список строк истории. Эта опция имеет смысл только в том случае, если `terminal` установлен в `true` пользователем или внутренней проверкой `output`, в противном случае механизм кэширования истории вообще не инициализируется. **По умолчанию:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество сохраняемых строк истории. Чтобы отключить историю, установите это значение в `0`. Эта опция имеет смысл только в том случае, если `terminal` установлен в `true` пользователем или внутренней проверкой `output`, в противном случае механизм кэширования истории вообще не инициализируется. **По умолчанию:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, когда новая входная строка, добавленная в список истории, дублирует более старую, она удаляет старую строку из списка. **По умолчанию:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка приглашения для использования. **По умолчанию:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если задержка между `\r` и `\n` превышает `crlfDelay` миллисекунд, то и `\r`, и `\n` будут рассматриваться как отдельные входные данные конца строки. `crlfDelay` будет приведён к числу не менее `100`. Его можно установить в `Infinity`, и в этом случае `\r`, за которым следует `\n`, всегда будет считаться одним символом новой строки (что может быть разумно для [чтения файлов](/ru/nodejs/api/readline#example-read-file-stream-line-by-line) с разделителем строк `\r\n`). **По умолчанию:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Продолжительность ожидания `readline` символа (при чтении неоднозначной последовательности клавиш в миллисекундах, которая может как сформировать полную последовательность клавиш, используя прочитанный ввод до сих пор, так и может принимать дополнительный ввод для завершения более длинной последовательности клавиш). **По умолчанию:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество пробелов, которому равна табуляция (минимум 1). **По умолчанию:** `8`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет закрыть интерфейс с помощью AbortSignal. Прерывание сигнала внутренне вызовет `close` для интерфейса.

- Возвращает: [\<readline.Interface\>](/ru/nodejs/api/readline#class-readlineinterface)

Метод `readline.createInterface()` создаёт новый экземпляр `readline.Interface`.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

После создания экземпляра `readline.Interface` наиболее распространенным случаем является прослушивание события `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Получено: ${line}`);
});
```
Если для этого экземпляра `terminal` имеет значение `true`, то поток `output` получит наилучшую совместимость, если он определяет свойство `output.columns` и генерирует событие `'resize'` в `output`, если или когда столбцы когда-либо изменятся ([`process.stdout`](/ru/nodejs/api/process#processstdout) делает это автоматически, когда это TTY).

При создании `readline.Interface` с использованием `stdin` в качестве ввода программа не завершится, пока не получит [символ EOF](https://en.wikipedia.org/wiki/End-of-file#EOF_character). Чтобы выйти, не дожидаясь ввода пользователя, вызовите `process.stdin.unref()`.


#### Использование функции `completer` {#use-of-the-completer-function_1}

Функция `completer` принимает текущую строку, введенную пользователем, в качестве аргумента и возвращает `Array` с 2 элементами:

- `Array` с совпадающими элементами для автозавершения.
- Подстроку, которая использовалась для сопоставления.

Например: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}
```
Функция `completer` может быть вызвана асинхронно, если она принимает два аргумента:

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Предоставляется обратный вызов и возвращаемое значение stream.write(). |
| v0.7.7 | Добавлено в: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения операции.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если `stream` желает, чтобы вызывающий код подождал, пока не будет сгенерировано событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

Метод `readline.cursorTo()` перемещает курсор в указанную позицию в данном [TTY](/ru/nodejs/api/tty) `stream`.

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Предоставляется обратный вызов и возвращаемое значение stream.write(). |
| v0.7.7 | Добавлено в: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения операции.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если `stream` желает, чтобы вызывающий код подождал, пока не будет сгенерировано событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

Метод `readline.moveCursor()` перемещает курсор *относительно* его текущей позиции в данном [TTY](/ru/nodejs/api/tty) `stream`.


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**Добавлено в: v0.7.7**

- `stream` [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/ru/nodejs/api/readline#class-interfaceconstructor)

Метод `readline.emitKeypressEvents()` заставляет заданный [Readable](/ru/nodejs/api/stream#readable-streams) поток начать испускать события `'keypress'`, соответствующие полученным входным данным.

Необязательно, `interface` указывает экземпляр `readline.Interface`, для которого автозаполнение отключено при обнаружении скопированных и вставленных входных данных.

Если `stream` является [TTY](/ru/nodejs/api/tty), то он должен быть в raw режиме.

Это автоматически вызывается любым экземпляром readline для его `input`, если `input` является терминалом. Закрытие экземпляра `readline` не останавливает испускание `input` событий `'keypress'`.

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## Пример: Tiny CLI {#example-tiny-cli}

Следующий пример иллюстрирует использование класса `readline.Interface` для реализации небольшого интерфейса командной строки:

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## Пример: Чтение файла построчно с использованием потока {#example-read-file-stream-line-by-line}

Типичный случай использования `readline` - обработка входного файла построчно. Проще всего это сделать, используя API [`fs.ReadStream`](/ru/nodejs/api/fs#class-fsreadstream), а также цикл `for await...of`:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```
:::

Альтернативно, можно использовать событие [`'line'`](/ru/nodejs/api/readline#event-line):

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```
:::

В настоящее время цикл `for await...of` может быть немного медленнее. Если важны как `async` / `await` поток, так и скорость, можно применить смешанный подход:

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```
:::


## TTY keybindings {#tty-keybindings}

| Keybindings | Description | Notes |
| --- | --- | --- |
|   +    +   | Удалить строку слева | Не работает в Linux, Mac и Windows |
|   +    +   | Удалить строку справа | Не работает в Mac |
|   +   | Отправить   `SIGINT`   или закрыть экземпляр readline | |
|   +   | Удалить слева | |
|   +   | Удалить справа или закрыть экземпляр readline, если текущая строка пуста / EOF | Не работает в Windows |
|   +   | Удалить от текущей позиции до начала строки | |
|   +   | Удалить от текущей позиции до конца строки | |
|   +   | Вставить (восстановить) ранее удаленный текст | Работает только с текстом, удаленным с помощью     +     или     +   |
|   +   | Циклически переключаться между ранее удаленными текстами | Доступно только тогда, когда последнее нажатие клавиши было     +     или     +   |
|   +   | Перейти к началу строки | |
|   +   | Перейти к концу строки | |
|   +   | Назад на один символ | |
|   +   | Вперед на один символ | |
|   +   | Очистить экран | |
|   +   | Следующий элемент истории | |
|   +   | Предыдущий элемент истории | |
|   +   | Отменить предыдущее изменение | Любое нажатие клавиши, которое выдает код клавиши   `0x1F`, выполнит это действие.     Во многих терминалах, например   `xterm`  ,     это привязано к     +    . |
|   +   | Повторить предыдущее изменение | Многие терминалы не имеют сочетания клавиш для повтора по умолчанию.     Мы выбрали код клавиши   `0x1E`   для выполнения повтора.     В   `xterm`  , это привязано к     +         по умолчанию. |
|   +   | Перемещает запущенный процесс в фоновый режим. Введите       `fg`   и нажмите          , чтобы вернуться. | Не работает в Windows |
|   +     или         +   | Удалить назад до границы слова |   +     Не работает     в Linux, Mac и Windows |
|   +   | Удалить вперед до границы слова | Не работает в Mac |
|   +     или         +   | Слово слева |   +     Не работает     в Mac |
|   +     или         +   | Слово справа |   +     Не работает     в Mac |
|   +     или         +   | Удалить слово справа |   +     Не работает     в windows |
|   +   | Удалить слово слева | Не работает в Mac |

