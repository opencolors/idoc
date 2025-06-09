---
title: Документация Node.js - Дочерний процесс
description: Документация Node.js для модуля дочернего процесса, подробно описывающая, как создавать дочерние процессы, управлять их жизненным циклом и обрабатывать межпроцессное взаимодействие.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Дочерний процесс | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Документация Node.js для модуля дочернего процесса, подробно описывающая, как создавать дочерние процессы, управлять их жизненным циклом и обрабатывать межпроцессное взаимодействие.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Дочерний процесс | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Документация Node.js для модуля дочернего процесса, подробно описывающая, как создавать дочерние процессы, управлять их жизненным циклом и обрабатывать межпроцессное взаимодействие.
---


# Дочерний процесс {#child-process}

::: tip [Стабильно: 2 - Stable]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Stable
:::

**Исходный код:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

Модуль `node:child_process` предоставляет возможность порождать подпроцессы способом, аналогичным [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3), но не идентичным ему. Эта возможность в основном обеспечивается функцией [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options):

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

По умолчанию, каналы для `stdin`, `stdout` и `stderr` устанавливаются между родительским процессом Node.js и порожденным подпроцессом. Эти каналы имеют ограниченную (и специфичную для платформы) емкость. Если подпроцесс записывает в stdout больше этого лимита, не захватывая вывод, подпроцесс блокируется, ожидая, пока буфер канала примет больше данных. Это идентично поведению каналов в оболочке. Используйте опцию `{ stdio: 'ignore' }`, если вывод не будет использоваться.

Поиск команды выполняется с использованием переменной окружения `options.env.PATH`, если `env` находится в объекте `options`. В противном случае используется `process.env.PATH`. Если `options.env` установлено без `PATH`, поиск в Unix выполняется по пути поиска по умолчанию `/usr/bin:/bin` (см. руководство вашей операционной системы для execvpe/execvp), в Windows используется текущая переменная окружения процесса `PATH`.

В Windows переменные окружения нечувствительны к регистру. Node.js лексикографически сортирует ключи `env` и использует первый, который нечувствителен к регистру. Только первая (в лексикографическом порядке) запись будет передана подпроцессу. Это может привести к проблемам в Windows при передаче объектов в опцию `env`, которые имеют несколько вариантов одного и того же ключа, например, `PATH` и `Path`.

Метод [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options) порождает дочерний процесс асинхронно, не блокируя цикл событий Node.js. Функция [`child_process.spawnSync()`](/ru/nodejs/api/child_process#child_processspawnsynccommand-args-options) предоставляет эквивалентную функциональность синхронно, блокируя цикл событий до тех пор, пока порожденный процесс не завершится или не будет завершен.

Для удобства модуль `node:child_process` предоставляет несколько синхронных и асинхронных альтернатив [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options) и [`child_process.spawnSync()`](/ru/nodejs/api/child_process#child_processspawnsynccommand-args-options). Каждая из этих альтернатив реализована на основе [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options) или [`child_process.spawnSync()`](/ru/nodejs/api/child_process#child_processspawnsynccommand-args-options).

- [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback): порождает оболочку и выполняет команду внутри этой оболочки, передавая `stdout` и `stderr` в функцию обратного вызова по завершении.
- [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback): аналогично [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback), за исключением того, что она порождает команду напрямую, не порождая сначала оболочку по умолчанию.
- [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options): порождает новый процесс Node.js и вызывает указанный модуль с установленным каналом связи IPC, который позволяет отправлять сообщения между родителем и потомком.
- [`child_process.execSync()`](/ru/nodejs/api/child_process#child_processexecsynccommand-options): синхронная версия [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback), которая будет блокировать цикл событий Node.js.
- [`child_process.execFileSync()`](/ru/nodejs/api/child_process#child_processexecfilesyncfile-args-options): синхронная версия [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback), которая будет блокировать цикл событий Node.js.

Для некоторых вариантов использования, таких как автоматизация сценариев оболочки, [синхронные аналоги](/ru/nodejs/api/child_process#synchronous-process-creation) могут быть более удобными. Однако во многих случаях синхронные методы могут оказывать значительное влияние на производительность из-за остановки цикла событий во время завершения порожденных процессов.


## Асинхронное создание процесса {#asynchronous-process-creation}

Методы [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options), [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback) и [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback) следуют идиоматическому асинхронному паттерну программирования, типичному для других API Node.js.

Каждый из методов возвращает экземпляр [`ChildProcess`](/ru/nodejs/api/child_process#class-childprocess). Эти объекты реализуют Node.js API [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter), позволяя родительскому процессу регистрировать функции-слушатели, которые вызываются при возникновении определенных событий в течение жизненного цикла дочернего процесса.

Методы [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback) и [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback) дополнительно позволяют указать необязательную функцию `callback`, которая вызывается при завершении дочернего процесса.

### Запуск файлов `.bat` и `.cmd` в Windows {#spawning-bat-and-cmd-files-on-windows}

Важность различия между [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback) и [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback) может варьироваться в зависимости от платформы. В Unix-подобных операционных системах (Unix, Linux, macOS) [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback) может быть более эффективным, поскольку по умолчанию не создает оболочку. Однако в Windows файлы `.bat` и `.cmd` не являются исполняемыми сами по себе без терминала и поэтому не могут быть запущены с помощью [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback). При работе в Windows файлы `.bat` и `.cmd` можно вызвать с помощью [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options) с установленной опцией `shell`, с помощью [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback) или путем создания `cmd.exe` и передачи файла `.bat` или `.cmd` в качестве аргумента (что и делают опция `shell` и [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback)). В любом случае, если имя файла скрипта содержит пробелы, его необходимо заключить в кавычки.

::: code-group
```js [CJS]
// ИЛИ...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Скрипт с пробелами в имени файла:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// или:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// ИЛИ...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Скрипт с пробелами в имени файла:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// или:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.4.0 | Добавлена поддержка AbortSignal. |
| v16.4.0, v14.18.0 | Параметр `cwd` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v8.8.0 | Теперь поддерживается параметр `windowsHide`. |
| v0.1.90 | Добавлено в версии: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Команда для запуска, с аргументами, разделенными пробелами.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Текущий рабочий каталог дочернего процесса. **По умолчанию:** `process.cwd()`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Пары ключ-значение окружения. **По умолчанию:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Оболочка, с помощью которой выполняется команда. См. [Требования к оболочке](/ru/nodejs/api/child_process#shell-requirements) и [Оболочка Windows по умолчанию](/ru/nodejs/api/child_process#default-windows-shell). **По умолчанию:** `'/bin/sh'` в Unix, `process.env.ComSpec` в Windows.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать дочерний процесс с помощью AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный объем данных в байтах, разрешенный в stdout или stderr. Если превышен, дочерний процесс завершается, и любой вывод усекается. См. предостережение в [`maxBuffer` и Unicode](/ru/nodejs/api/child_process#maxbuffer-and-unicode). **По умолчанию:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор пользователя процесса (см. [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор группы процесса (см. [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Скрыть окно консоли подпроцесса, которое обычно создается в системах Windows. **По умолчанию:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) вызывается с выводом по завершении процесса.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
  
 
- Возвращает: [\<ChildProcess\>](/ru/nodejs/api/child_process#class-childprocess)

Запускает оболочку, а затем выполняет `command` в этой оболочке, буферизируя любой сгенерированный вывод. Строка `command`, переданная в функцию exec, обрабатывается непосредственно оболочкой, и специальные символы (зависят от [оболочки](https://en.wikipedia.org/wiki/List_of_command-line_interpreters)) должны обрабатываться соответствующим образом:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// Двойные кавычки используются для того, чтобы пробел в пути не интерпретировался как
// разделитель нескольких аргументов.

exec('echo "The \\$HOME variable is $HOME"');
// Переменная $HOME экранируется в первом случае, но не во втором.
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// Двойные кавычки используются для того, чтобы пробел в пути не интерпретировался как
// разделитель нескольких аргументов.

exec('echo "The \\$HOME variable is $HOME"');
// Переменная $HOME экранируется в первом случае, но не во втором.
```
:::

**Никогда не передавайте этой функции несанированные пользовательские данные. Любые входные данные, содержащие метасимволы оболочки, могут быть использованы для запуска произвольного выполнения команд.**

Если предоставлена функция `callback`, она вызывается с аргументами `(error, stdout, stderr)`. При успехе `error` будет `null`. При ошибке `error` будет экземпляром [`Error`](/ru/nodejs/api/errors#class-error). Свойство `error.code` будет кодом выхода процесса. По соглашению любой код выхода, отличный от `0`, указывает на ошибку. `error.signal` будет сигналом, который завершил процесс.

Аргументы `stdout` и `stderr`, переданные в обратный вызов, будут содержать stdout и stderr вывод дочернего процесса. По умолчанию Node.js декодирует вывод как UTF-8 и передает строки в обратный вызов. Параметр `encoding` можно использовать для указания кодировки символов, используемой для декодирования stdout и stderr вывода. Если `encoding` - `'buffer'` или нераспознанная кодировка символов, вместо этого в обратный вызов будут переданы объекты `Buffer`.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

Если `timeout` больше `0`, родительский процесс отправит сигнал, идентифицированный свойством `killSignal` (по умолчанию `'SIGTERM'`), если дочерний процесс выполняется дольше `timeout` миллисекунд.

В отличие от системного вызова POSIX [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3), `child_process.exec()` не заменяет существующий процесс и использует оболочку для выполнения команды.

Если этот метод вызывается как его [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal)рованная версия, он возвращает `Promise` для `Object` со свойствами `stdout` и `stderr`. Возвращенный экземпляр `ChildProcess` прикрепляется к `Promise` как свойство `child`. В случае ошибки (включая любую ошибку, приводящую к коду выхода, отличному от 0) возвращается отклоненный промис, с тем же объектом `error`, что и в обратном вызове, но с двумя дополнительными свойствами `stdout` и `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

Если включен параметр `signal`, вызов `.abort()` на соответствующем `AbortController` аналогичен вызову `.kill()` на дочернем процессе, за исключением того, что ошибка, переданная в обратный вызов, будет `AbortError`:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.4.0, v14.18.0 | Опция `cwd` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v15.4.0, v14.17.0 | Добавлена поддержка AbortSignal. |
| v8.8.0 | Теперь поддерживается опция `windowsHide`. |
| v0.1.91 | Добавлено в версии: v0.1.91 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя или путь к исполняемому файлу для запуска.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список строковых аргументов.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Текущий рабочий каталог дочернего процесса.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Пары ключ-значение для переменных окружения. **По умолчанию:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный объем данных в байтах, разрешенный для stdout или stderr. При превышении дочерний процесс завершается, а любой вывод обрезается. См. предостережение в [`maxBuffer` и Unicode](/ru/nodejs/api/child_process#maxbuffer-and-unicode). **По умолчанию:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор пользователя процесса (см. [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор группы процесса (см. [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Скрывает консольное окно подпроцесса, которое обычно создается в системах Windows. **По умолчанию:** `false`.
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) В Windows не выполняется экранирование или заключение в кавычки аргументов. Игнорируется в Unix. **По умолчанию:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `true`, запускает `command` внутри оболочки. Использует `'/bin/sh'` в Unix и `process.env.ComSpec` в Windows. Другая оболочка может быть указана в виде строки. См. [Требования к оболочке](/ru/nodejs/api/child_process#shell-requirements) и [Оболочка Windows по умолчанию](/ru/nodejs/api/child_process#default-windows-shell). **По умолчанию:** `false` (без оболочки).
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать дочерний процесс с помощью AbortSignal.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается с выводом при завершении процесса.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)


- Возвращает: [\<ChildProcess\>](/ru/nodejs/api/child_process#class-childprocess)

Функция `child_process.execFile()` аналогична [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback), за исключением того, что она не запускает оболочку по умолчанию. Вместо этого указанный исполняемый `file` запускается непосредственно как новый процесс, что делает его немного более эффективным, чем [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback).

Поддерживаются те же параметры, что и для [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback). Поскольку оболочка не запускается, такие возможности, как перенаправление ввода-вывода и подстановка имен файлов, не поддерживаются.

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

Аргументы `stdout` и `stderr`, переданные в обратный вызов, будут содержать stdout и stderr выходные данные дочернего процесса. По умолчанию Node.js декодирует вывод как UTF-8 и передает строки в обратный вызов. Параметр `encoding` может быть использован для указания кодировки символов, используемой для декодирования stdout и stderr выходных данных. Если `encoding` имеет значение `'buffer'` или неподдерживаемую кодировку символов, в обратный вызов будут переданы объекты `Buffer`.

Если этот метод вызывается как его [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal)ed версия, он возвращает `Promise` для `Object` со свойствами `stdout` и `stderr`. Возвращаемый экземпляр `ChildProcess` прикрепляется к `Promise` как свойство `child`. В случае ошибки (включая любую ошибку, приводящую к коду выхода, отличному от 0), возвращается отклоненный promise, с тем же объектом `error`, который был передан в обратный вызов, но с двумя дополнительными свойствами `stdout` и `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**Если опция <code>shell</code> включена, не передавайте в эту функцию
необработанный пользовательский ввод. Любой ввод, содержащий метасимволы оболочки,
может быть использован для запуска произвольного выполнения команд.**

Если опция `signal` включена, вызов `.abort()` на соответствующем `AbortController` аналогичен вызову `.kill()` на дочернем процессе, за исключением того, что ошибка, переданная в обратный вызов, будет `AbortError`:

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.4.0, v16.14.0 | Параметр `modulePath` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v16.4.0, v14.18.0 | Опция `cwd` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v15.13.0, v14.18.0 | Добавлено свойство timeout. |
| v15.11.0, v14.18.0 | Добавлено killSignal для AbortSignal. |
| v15.6.0, v14.17.0 | Добавлена поддержка AbortSignal. |
| v13.2.0, v12.16.0 | Теперь поддерживается опция `serialization`. |
| v8.0.0 | Теперь опция `stdio` может быть строкой. |
| v6.4.0 | Теперь поддерживается опция `stdio`. |
| v0.5.0 | Добавлено в версии: v0.5.0 |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Модуль для запуска в дочернем процессе.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список строковых аргументов.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Текущий рабочий каталог дочернего процесса.
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Подготавливает дочерний процесс к независимой работе от родительского процесса. Конкретное поведение зависит от платформы, см. [`options.detached`](/ru/nodejs/api/child_process#optionsdetached)).
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Пары ключ-значение для переменных окружения. **По умолчанию:** `process.env`.
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Исполняемый файл, используемый для создания дочернего процесса.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список строковых аргументов, передаваемых исполняемому файлу. **По умолчанию:** `process.execArgv`.
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор группы процесса (см. [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Укажите тип сериализации, используемой для отправки сообщений между процессами. Возможные значения: `'json'` и `'advanced'`. Смотрите [Расширенная сериализация](/ru/nodejs/api/child_process#advanced-serialization) для получения дополнительной информации. **По умолчанию:** `'json'`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) Позволяет закрыть дочерний процесс с помощью AbortSignal.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение сигнала, которое будет использоваться, когда порожденный процесс будет завершен по тайм-ауту или сигналу прерывания. **По умолчанию:** `'SIGTERM'`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, stdin, stdout и stderr дочернего процесса будут перенаправлены в родительский процесс, в противном случае они будут наследоваться от родительского процесса, смотрите опции `'pipe'` и `'inherit'` для [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/ru/nodejs/api/child_process#optionsstdio) для получения дополнительной информации. **По умолчанию:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/ru/nodejs/api/child_process#optionsstdio). Когда эта опция предоставлена, она переопределяет `silent`. Если используется вариант с массивом, он должен содержать ровно один элемент со значением `'ipc'`, иначе будет выброшена ошибка. Например, `[0, 1, 2, 'ipc']`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор пользователя процесса (см. [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) В Windows не выполняется заключение в кавычки или экранирование аргументов. Игнорируется в Unix. **По умолчанию:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество времени в миллисекундах, в течение которого процессу разрешено выполняться. **По умолчанию:** `undefined`.


- Возвращает: [\<ChildProcess\>](/ru/nodejs/api/child_process#class-childprocess)

Метод `child_process.fork()` является частным случаем [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options), используемым специально для порождения новых процессов Node.js. Как и [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options), возвращается объект [`ChildProcess`](/ru/nodejs/api/child_process#class-childprocess). Возвращенный [`ChildProcess`](/ru/nodejs/api/child_process#class-childprocess) будет иметь дополнительный встроенный канал связи, который позволяет передавать сообщения между родителем и потомком. См. [`subprocess.send()`](/ru/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) для получения подробной информации.

Имейте в виду, что порожденные дочерние процессы Node.js независимы от родительского, за исключением канала связи IPC, установленного между ними. Каждый процесс имеет свою собственную память, со своими собственными экземплярами V8. Из-за дополнительных требуемых выделений ресурсов не рекомендуется порождать большое количество дочерних процессов Node.js.

По умолчанию, `child_process.fork()` будет порождать новые экземпляры Node.js, используя [`process.execPath`](/ru/nodejs/api/process#processexecpath) родительского процесса. Свойство `execPath` в объекте `options` позволяет использовать альтернативный путь выполнения.

Процессы Node.js, запущенные с пользовательским `execPath`, будут взаимодействовать с родительским процессом, используя файловый дескриптор (fd), идентифицированный с помощью переменной окружения `NODE_CHANNEL_FD` в дочернем процессе.

В отличие от системного вызова POSIX [`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2), `child_process.fork()` не клонирует текущий процесс.

Опция `shell`, доступная в [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options), не поддерживается `child_process.fork()` и будет проигнорирована, если установлена.

Если опция `signal` включена, вызов `.abort()` для соответствующего `AbortController` аналогичен вызову `.kill()` для дочернего процесса, за исключением того, что ошибка, переданная в обратный вызов, будет `AbortError`:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::


### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.4.0, v14.18.0 | Опция `cwd` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v15.13.0, v14.18.0 | Добавлено время ожидания. |
| v15.11.0, v14.18.0 | Добавлен killSignal для AbortSignal. |
| v15.5.0, v14.17.0 | Добавлена поддержка AbortSignal. |
| v13.2.0, v12.16.0 | Теперь поддерживается опция `serialization`. |
| v8.8.0 | Теперь поддерживается опция `windowsHide`. |
| v6.4.0 | Теперь поддерживается опция `argv0`. |
| v5.7.0 | Теперь поддерживается опция `shell`. |
| v0.1.90 | Добавлено в: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Команда для запуска.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список строковых аргументов.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Текущий рабочий каталог дочернего процесса.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Пары ключ-значение среды. **По умолчанию:** `process.env`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Явно задайте значение `argv[0]`, отправляемое дочернему процессу. Если не указано, будет установлено значение `command`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Конфигурация stdio дочернего процесса (см. [`options.stdio`](/ru/nodejs/api/child_process#optionsstdio)).
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Подготовьте дочерний процесс для независимого запуска от родительского процесса. Конкретное поведение зависит от платформы, см. [`options.detached`](/ru/nodejs/api/child_process#optionsdetached)).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор пользователя процесса (см. [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор группы процесса (см. [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Укажите вид сериализации, используемый для отправки сообщений между процессами. Возможные значения: `'json'` и `'advanced'`. Подробнее см. в разделе [Расширенная сериализация](/ru/nodejs/api/child_process#advanced-serialization). **По умолчанию:** `'json'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `true`, запускает `command` внутри оболочки. Использует `'/bin/sh'` в Unix и `process.env.ComSpec` в Windows. Другая оболочка может быть указана в виде строки. См. [Требования к оболочке](/ru/nodejs/api/child_process#shell-requirements) и [Оболочка Windows по умолчанию](/ru/nodejs/api/child_process#default-windows-shell). **По умолчанию:** `false` (без оболочки).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Отсутствует экранирование или заключение в кавычки аргументов в Windows. Игнорируется в Unix. Автоматически устанавливается в `true`, если указана `shell` и используется CMD. **По умолчанию:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Скрыть окно консоли подпроцесса, которое обычно создается в системах Windows. **По умолчанию:** `false`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать дочерний процесс с помощью AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное время выполнения процесса в миллисекундах. **По умолчанию:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение сигнала, которое будет использоваться, когда порожденный процесс будет завершен по таймауту или сигналу прерывания. **По умолчанию:** `'SIGTERM'`.


- Возвращает: [\<ChildProcess\>](/ru/nodejs/api/child_process#class-childprocess)

Метод `child_process.spawn()` порождает новый процесс с использованием указанной `command` с аргументами командной строки в `args`. Если опущено, `args` по умолчанию является пустым массивом.

**Если включена опция <code>shell</code>, не передавайте этой функции непроверенные пользовательские данные. Любые входные данные, содержащие метасимволы оболочки, могут быть использованы для запуска произвольного выполнения команд.**

Третий аргумент может быть использован для указания дополнительных опций со следующими значениями по умолчанию:

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
Используйте `cwd`, чтобы указать рабочий каталог, из которого порождается процесс. Если не указано, по умолчанию наследуется текущий рабочий каталог. Если указано, но путь не существует, дочерний процесс выдает ошибку `ENOENT` и немедленно завершается. `ENOENT` также выдается, когда команда не существует.

Используйте `env`, чтобы указать переменные среды, которые будут видны новому процессу, по умолчанию это [`process.env`](/ru/nodejs/api/process#processenv).

`undefined` значения в `env` будут игнорироваться.

Пример запуска `ls -lh /usr`, захвата `stdout`, `stderr` и кода выхода:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Пример: Очень сложный способ запуска `ps ax | grep ssh`

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

Пример проверки неудачного `spawn`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

Некоторые платформы (macOS, Linux) будут использовать значение `argv[0]` для заголовка процесса, в то время как другие (Windows, SunOS) будут использовать `command`.

Node.js перезаписывает `argv[0]` с помощью `process.execPath` при запуске, поэтому `process.argv[0]` в дочернем процессе Node.js не будет соответствовать параметру `argv0`, переданному в `spawn` из родительского процесса. Вместо этого получите его с помощью свойства `process.argv0`.

Если включена опция `signal`, вызов `.abort()` для соответствующего `AbortController` аналогичен вызову `.kill()` для дочернего процесса, за исключением того, что ошибка, переданная в обратный вызов, будет `AbortError`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```
:::


#### `options.detached` {#optionsdetached}

**Добавлено в: v0.7.10**

В Windows установка `options.detached` в значение `true` позволяет дочернему процессу продолжать работу после завершения родительского. Дочерний процесс будет иметь свое собственное консольное окно. После включения для дочернего процесса, его нельзя будет отключить.

На платформах, отличных от Windows, если `options.detached` установлено в `true`, дочерний процесс станет лидером новой группы процессов и сессии. Дочерние процессы могут продолжать работу после завершения родительского независимо от того, отсоединены они или нет. См. [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2) для получения дополнительной информации.

По умолчанию родительский процесс будет ждать завершения отсоединенного дочернего процесса. Чтобы родительский процесс не ждал завершения данного `subprocess`, используйте метод `subprocess.unref()`. Это приведет к тому, что цикл событий родительского процесса не будет включать дочерний процесс в свой счетчик ссылок, что позволит родительскому процессу завершиться независимо от дочернего процесса, если между дочерним и родительским процессами не установлен IPC-канал.

При использовании опции `detached` для запуска длительного процесса, процесс не останется работать в фоновом режиме после завершения родительского, если ему не предоставлена конфигурация `stdio`, которая не подключена к родителю. Если `stdio` родительского процесса унаследовано, дочерний процесс останется привязанным к управляющему терминалу.

Пример длительного процесса, путем отсоединения и игнорирования дескрипторов файлов `stdio` родителя, чтобы игнорировать завершение родителя:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

В качестве альтернативы можно перенаправить вывод дочернего процесса в файлы:

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs');
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.6.0, v14.18.0 | Добавлен флаг stdio `overlapped`. |
| v3.3.1 | Значение `0` теперь принимается как файловый дескриптор. |
| v0.7.10 | Добавлено в: v0.7.10 |
:::

Параметр `options.stdio` используется для настройки каналов, устанавливаемых между родительским и дочерним процессами. По умолчанию, stdin, stdout и stderr дочернего процесса перенаправляются в соответствующие потоки [`subprocess.stdin`](/ru/nodejs/api/child_process#subprocessstdin), [`subprocess.stdout`](/ru/nodejs/api/child_process#subprocessstdout) и [`subprocess.stderr`](/ru/nodejs/api/child_process#subprocessstderr) объекта [`ChildProcess`](/ru/nodejs/api/child_process#class-childprocess). Это эквивалентно установке `options.stdio` равным `['pipe', 'pipe', 'pipe']`.

Для удобства `options.stdio` может быть одной из следующих строк:

- `'pipe'`: эквивалентно `['pipe', 'pipe', 'pipe']` (по умолчанию)
- `'overlapped'`: эквивалентно `['overlapped', 'overlapped', 'overlapped']`
- `'ignore'`: эквивалентно `['ignore', 'ignore', 'ignore']`
- `'inherit'`: эквивалентно `['inherit', 'inherit', 'inherit']` или `[0, 1, 2]`

В противном случае значение `options.stdio` представляет собой массив, где каждый индекс соответствует fd в дочернем процессе. Fd 0, 1 и 2 соответствуют stdin, stdout и stderr соответственно. Дополнительные fd могут быть указаны для создания дополнительных каналов между родительским и дочерним процессами. Значение может быть одним из следующих:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// Child will use parent's stdios.
spawn('prg', [], { stdio: 'inherit' });

// Spawn child sharing only stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Open an extra fd=4, to interact with programs presenting a
// startd-style interface.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// Child will use parent's stdios.
spawn('prg', [], { stdio: 'inherit' });

// Spawn child sharing only stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Open an extra fd=4, to interact with programs presenting a
// startd-style interface.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*Стоит отметить, что когда устанавливается канал IPC между родительским и дочерним процессами, и дочерний процесс является экземпляром Node.js, дочерний процесс запускается с неразмеченным каналом IPC (с использованием
<code>unref()</code>) до тех пор, пока дочерний процесс не зарегистрирует обработчик событий для
<a href="process.html#event-disconnect"><code>'disconnect'</code></a> или <a href="process.html#event-message"><code>'message'</code></a>. Это позволяет
дочернему процессу нормально завершиться, не удерживая процесс открытым
открытым каналом IPC.* См. также: [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback) и [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options).


## Синхронное создание процесса {#synchronous-process-creation}

Методы [`child_process.spawnSync()`](/ru/nodejs/api/child_process#child_processspawnsynccommand-args-options), [`child_process.execSync()`](/ru/nodejs/api/child_process#child_processexecsynccommand-options) и [`child_process.execFileSync()`](/ru/nodejs/api/child_process#child_processexecfilesyncfile-args-options) являются синхронными и блокируют цикл событий Node.js, приостанавливая выполнение любого дополнительного кода до тех пор, пока порожденный процесс не завершится.

Подобные блокирующие вызовы наиболее полезны для упрощения задач сценариев общего назначения и для упрощения загрузки/обработки конфигурации приложения при запуске.

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.4.0, v14.18.0 | Опция `cwd` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v10.10.0 | Опция `input` теперь может быть любым `TypedArray` или `DataView`. |
| v8.8.0 | Теперь поддерживается опция `windowsHide`. |
| v8.0.0 | Опция `input` теперь может быть `Uint8Array`. |
| v6.2.1, v4.5.0 | Опция `encoding` теперь может быть явно установлена в `buffer`. |
| v0.11.12 | Добавлено в: v0.11.12 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя или путь к исполняемому файлу для запуска.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список строковых аргументов.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Текущий рабочий каталог дочернего процесса.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Значение, которое будет передано в stdin порожденному процессу. Если `stdio[0]` установлено в `'pipe'`, предоставление этого значения переопределит `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Конфигурация stdio дочернего процесса. См. [`stdio`](/ru/nodejs/api/child_process#optionsstdio) в [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options). `stderr` по умолчанию будет выводиться в stderr родительского процесса, если не указано `stdio`. **Default:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Пары ключ-значение окружения. **Default:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор пользователя процесса (см. [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор группы процесса (см. [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество времени в миллисекундах, которое процессу разрешено работать. **Default:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение сигнала, которое будет использоваться, когда порожденный процесс будет завершен. **Default:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный объем данных в байтах, разрешенный в stdout или stderr. Если превышен, дочерний процесс завершается. См. предостережение в [`maxBuffer` и Unicode](/ru/nodejs/api/child_process#maxbuffer-and-unicode). **Default:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка, используемая для всех входов и выходов stdio. **Default:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Скрыть консольное окно подпроцесса, которое обычно создается в системах Windows. **Default:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `true`, запускает `command` внутри оболочки. Использует `'/bin/sh'` в Unix и `process.env.ComSpec` в Windows. Другая оболочка может быть указана как строка. См. [Требования к оболочке](/ru/nodejs/api/child_process#shell-requirements) и [Оболочка Windows по умолчанию](/ru/nodejs/api/child_process#default-windows-shell). **Default:** `false` (без оболочки).

- Returns: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Вывод stdout из команды.

Метод `child_process.execFileSync()` в целом идентичен [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback), за исключением того, что метод не вернет значение до тех пор, пока дочерний процесс полностью не закроется. При возникновении тайм-аута и отправке `killSignal` метод не вернет значение до тех пор, пока процесс полностью не завершится.

Если дочерний процесс перехватывает и обрабатывает сигнал `SIGTERM` и не завершается, родительский процесс все равно будет ждать, пока дочерний процесс не завершится.

Если процесс истекает по времени или имеет ненулевой код выхода, этот метод выдаст ошибку [`Error`](/ru/nodejs/api/errors#class-error), которая будет включать полный результат базового [`child_process.spawnSync()`](/ru/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**Если включена опция <code>shell</code>, не передавайте этой функции необработанные пользовательские данные. Любые входные данные, содержащие метасимволы оболочки, могут быть использованы для запуска произвольного выполнения команд.**

::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::


### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.4.0, v14.18.0 | Опция `cwd` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v10.10.0 | Опция `input` теперь может быть любым `TypedArray` или `DataView`. |
| v8.8.0 | Теперь поддерживается опция `windowsHide`. |
| v8.0.0 | Опция `input` теперь может быть `Uint8Array`. |
| v0.11.12 | Добавлено в: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Команда для выполнения.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Текущий рабочий каталог дочернего процесса.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Значение, которое будет передано как stdin в порожденный процесс. Если `stdio[0]` установлено в `'pipe'`, предоставление этого значения переопределит `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Конфигурация stdio дочернего процесса. Смотрите [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/ru/nodejs/api/child_process#optionsstdio). `stderr` по умолчанию будет выводиться в stderr родительского процесса, если не указано `stdio`. **По умолчанию:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Пары ключ-значение окружения. **По умолчанию:** `process.env`.
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell для выполнения команды. Смотрите [Требования к Shell](/ru/nodejs/api/child_process#shell-requirements) и [Shell по умолчанию для Windows](/ru/nodejs/api/child_process#default-windows-shell). **По умолчанию:** `'/bin/sh'` в Unix, `process.env.ComSpec` в Windows.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор пользователя процесса. (Смотрите [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор группы процесса. (Смотрите [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное время в миллисекундах, в течение которого процессу разрешено работать. **По умолчанию:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение сигнала, которое будет использоваться при завершении порожденного процесса. **По умолчанию:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный объем данных в байтах, разрешенный в stdout или stderr. Если превышен, дочерний процесс завершается, и любой вывод усекается. Смотрите предостережение в [`maxBuffer` и Unicode](/ru/nodejs/api/child_process#maxbuffer-and-unicode). **По умолчанию:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка, используемая для всех вводов и выводов stdio. **По умолчанию:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Скрыть консольное окно подпроцесса, которое обычно создается в системах Windows. **По умолчанию:** `false`.

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Stdout от команды.

Метод `child_process.execSync()` в целом идентичен [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback) за исключением того, что метод не возвращает управление до тех пор, пока дочерний процесс полностью не закроется. Когда истекло время ожидания и отправлен `killSignal`, метод не вернет управление до тех пор, пока процесс полностью не завершится. Если дочерний процесс перехватывает и обрабатывает сигнал `SIGTERM` и не завершается, родительский процесс будет ждать, пока дочерний процесс не завершится.

Если время ожидания процесса истекло или код выхода ненулевой, этот метод вызовет исключение. Объект [`Error`](/ru/nodejs/api/errors#class-error) будет содержать весь результат из [`child_process.spawnSync()`](/ru/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**Никогда не передавайте необработанный пользовательский ввод этой функции. Любой ввод, содержащий метасимволы оболочки, может быть использован для запуска произвольного выполнения команд.**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.4.0, v14.18.0 | Опция `cwd` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v10.10.0 | Опция `input` теперь может быть любым `TypedArray` или `DataView`. |
| v8.8.0 | Теперь поддерживается опция `windowsHide`. |
| v8.0.0 | Опция `input` теперь может быть `Uint8Array`. |
| v5.7.0 | Теперь поддерживается опция `shell`. |
| v6.2.1, v4.5.0 | Теперь опцию `encoding` можно явно установить в `buffer`. |
| v0.11.12 | Добавлено в версии: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Команда для выполнения.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список строковых аргументов.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Текущий рабочий каталог дочернего процесса.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Значение, которое будет передано как stdin порожденному процессу. Если `stdio[0]` установлено в `'pipe'`, предоставление этого значения переопределит `stdio[0]`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Явно устанавливает значение `argv[0]`, отправляемое дочернему процессу. Если не указано, будет установлено значение `command`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Конфигурация stdio дочернего процесса. См. [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/ru/nodejs/api/child_process#optionsstdio). **По умолчанию:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Пары ключ-значение окружения. **По умолчанию:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор пользователя процесса (см. [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает идентификатор группы процесса (см. [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество времени в миллисекундах, в течение которого процессу разрешено выполняться. **По умолчанию:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение сигнала, которое будет использоваться, когда порожденный процесс будет завершен. **По умолчанию:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный объем данных в байтах, разрешенный в stdout или stderr. Если превышен, дочерний процесс завершается, и любой вывод обрезается. См. предостережение в [`maxBuffer` и Unicode](/ru/nodejs/api/child_process#maxbuffer-and-unicode). **По умолчанию:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка, используемая для всех вводов и выводов stdio. **По умолчанию:** `'buffer'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `true`, запускает `command` внутри оболочки. Использует `'/bin/sh'` в Unix и `process.env.ComSpec` в Windows. Другая оболочка может быть указана как строка. См. [Требования к оболочке](/ru/nodejs/api/child_process#shell-requirements) и [Оболочка Windows по умолчанию](/ru/nodejs/api/child_process#default-windows-shell). **По умолчанию:** `false` (без оболочки).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) В Windows не выполняется квотирование или экранирование аргументов. Игнорируется в Unix. Автоматически устанавливается в `true`, когда указана опция `shell` и используется CMD. **По умолчанию:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Скрыть консольное окно подпроцесса, которое обычно создается в системах Windows. **По умолчанию:** `false`.
  
 
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) PID дочернего процесса.
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив результатов вывода stdio.
    - `stdout` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Содержимое `output[1]`.
    - `stderr` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Содержимое `output[2]`.
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Код выхода подпроцесса или `null`, если подпроцесс завершился из-за сигнала.
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Сигнал, использованный для завершения подпроцесса, или `null`, если подпроцесс не завершился из-за сигнала.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Объект ошибки, если дочерний процесс завершился неудачно или по тайм-ауту.
  
 

Метод `child_process.spawnSync()` в целом идентичен [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options) за исключением того, что функция не вернет управление до тех пор, пока дочерний процесс полностью не закроется. Когда возникает тайм-аут и отправляется `killSignal`, метод не вернет управление, пока процесс полностью не завершится. Если процесс перехватывает и обрабатывает сигнал `SIGTERM` и не завершается, родительский процесс будет ждать, пока дочерний процесс не завершится.

**Если включена опция <code>shell</code>, не передавайте в эту функцию несанкционированный пользовательский ввод. Любой ввод, содержащий метасимволы оболочки, может быть использован для выполнения произвольных команд.**


## Класс: `ChildProcess` {#class-childprocess}

**Добавлено в: v2.2.0**

- Расширяет: [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Экземпляры `ChildProcess` представляют порожденные дочерние процессы.

Экземпляры `ChildProcess` не предназначены для непосредственного создания. Вместо этого используйте методы [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback), [`child_process.execFile()`](/ru/nodejs/api/child_process#child_processexecfilefile-args-options-callback) или [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options) для создания экземпляров `ChildProcess`.

### Событие: `'close'` {#event-close}

**Добавлено в: v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код выхода, если дочерний процесс завершился самостоятельно.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сигнал, которым был завершен дочерний процесс.

Событие `'close'` возникает после завершения процесса *и* закрытия потоков stdio дочернего процесса. Это отличается от события [`'exit'`](/ru/nodejs/api/child_process#event-exit), поскольку несколько процессов могут совместно использовать одни и те же потоки stdio. Событие `'close'` всегда будет возникать после того, как уже было выдано [`'exit'`](/ru/nodejs/api/child_process#event-exit) или [`'error'`](/ru/nodejs/api/child_process#event-error), если дочерний процесс не удалось запустить.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### Событие: `'disconnect'` {#event-disconnect}

**Добавлено в: v0.7.2**

Событие `'disconnect'` возникает после вызова метода [`subprocess.disconnect()`](/ru/nodejs/api/child_process#subprocessdisconnect) в родительском процессе или [`process.disconnect()`](/ru/nodejs/api/process#processdisconnect) в дочернем процессе. После отключения отправка или получение сообщений становится невозможным, а свойство [`subprocess.connected`](/ru/nodejs/api/child_process#subprocessconnected) принимает значение `false`.

### Событие: `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Ошибка.

Событие `'error'` возникает в следующих случаях:

- Процесс не удалось запустить.
- Процесс не удалось завершить.
- Не удалось отправить сообщение дочернему процессу.
- Дочерний процесс был прерван с помощью опции `signal`.

Событие `'exit'` может произойти или не произойти после возникновения ошибки. При прослушивании событий `'exit'` и `'error'` следует избегать случайного многократного вызова функций-обработчиков.

См. также [`subprocess.kill()`](/ru/nodejs/api/child_process#subprocesskillsignal) и [`subprocess.send()`](/ru/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

### Событие: `'exit'` {#event-exit}

**Добавлено в: v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Код выхода, если дочерний процесс завершился сам по себе.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сигнал, которым был завершен дочерний процесс.

Событие `'exit'` возникает после завершения дочернего процесса. Если процесс завершился, `code` является окончательным кодом выхода процесса, иначе `null`. Если процесс был прерван из-за получения сигнала, `signal` является строковым названием сигнала, иначе `null`. Одно из двух значений всегда будет отличным от `null`.

Когда происходит событие `'exit'`, потоки stdio дочернего процесса могут быть все еще открыты.

Node.js устанавливает обработчики сигналов для `SIGINT` и `SIGTERM`, и процессы Node.js не завершатся немедленно из-за получения этих сигналов. Вместо этого Node.js выполнит последовательность действий по очистке, а затем повторно вызовет обработанный сигнал.

См. [`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2).


### Событие: `'message'` {#event-message}

**Добавлено в: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Разобранный объект JSON или примитивное значение.
- `sendHandle` [\<Handle\>](/ru/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` или объект [`net.Socket`](/ru/nodejs/api/net#class-netsocket), [`net.Server`](/ru/nodejs/api/net#class-netserver) или [`dgram.Socket`](/ru/nodejs/api/dgram#class-dgramsocket).

Событие `'message'` возникает, когда дочерний процесс использует [`process.send()`](/ru/nodejs/api/process#processsendmessage-sendhandle-options-callback) для отправки сообщений.

Сообщение проходит через сериализацию и разбор. Полученное сообщение может не совпадать с тем, что было отправлено изначально.

Если при создании дочернего процесса для параметра `serialization` было установлено значение `'advanced'`, аргумент `message` может содержать данные, которые JSON не может представить. Подробности см. в разделе [Расширенная сериализация](/ru/nodejs/api/child_process#advanced-serialization).

### Событие: `'spawn'` {#event-spawn}

**Добавлено в: v15.1.0, v14.17.0**

Событие `'spawn'` возникает после успешного создания дочернего процесса. Если дочерний процесс не создан успешно, событие `'spawn'` не возникает и вместо него возникает событие `'error'`.

Если событие `'spawn'` возникает, оно происходит перед всеми другими событиями и перед получением каких-либо данных через `stdout` или `stderr`.

Событие `'spawn'` будет срабатывать независимо от того, произошла ли ошибка **внутри** созданного процесса. Например, если `bash some-command` создается успешно, событие `'spawn'` сработает, хотя `bash` может не смочь создать `some-command`. Это предостережение также применимо при использовании `{ shell: true }`.

### `subprocess.channel` {#subprocesschannel}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Объект больше не предоставляет случайно нативные привязки C++. |
| v7.1.0 | Добавлено в: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Канал, представляющий IPC-канал к дочернему процессу.

Свойство `subprocess.channel` является ссылкой на IPC-канал дочернего процесса. Если IPC-канал не существует, это свойство имеет значение `undefined`.


#### `subprocess.channel.ref()` {#subprocesschannelref}

**Added in: v7.1.0**

Этот метод заставляет IPC-канал поддерживать работу цикла событий родительского процесса, если ранее был вызван метод `.unref()`.

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**Added in: v7.1.0**

Этот метод отключает поддержку цикла событий родительского процесса IPC-каналом, позволяя ему завершиться, даже если канал открыт.

### `subprocess.connected` {#subprocessconnected}

**Added in: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Устанавливается в `false` после вызова `subprocess.disconnect()`.

Свойство `subprocess.connected` указывает, возможно ли еще отправлять и получать сообщения от дочернего процесса. Если `subprocess.connected` имеет значение `false`, отправка или получение сообщений больше невозможны.

### `subprocess.disconnect()` {#subprocessdisconnect}

**Added in: v0.7.2**

Закрывает IPC-канал между родительским и дочерним процессами, позволяя дочернему процессу корректно завершиться, когда не останется других соединений, поддерживающих его работу. После вызова этого метода свойства `subprocess.connected` и `process.connected` как в родительском, так и в дочернем процессах (соответственно) будут установлены в `false`, и передача сообщений между процессами станет невозможной.

Событие `'disconnect'` будет сгенерировано, когда не будет сообщений в процессе получения. Чаще всего это будет происходить сразу после вызова `subprocess.disconnect()`.

Когда дочерний процесс является экземпляром Node.js (например, создан с использованием [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options)), метод `process.disconnect()` может быть вызван внутри дочернего процесса для закрытия IPC-канала.

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Свойство `subprocess.exitCode` указывает код завершения дочернего процесса. Если дочерний процесс все еще выполняется, поле будет иметь значение `null`.

### `subprocess.kill([signal])` {#subprocesskillsignal}

**Added in: v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Метод `subprocess.kill()` отправляет сигнал дочернему процессу. Если аргумент не указан, процессу будет отправлен сигнал `'SIGTERM'`. Смотрите [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) для получения списка доступных сигналов. Эта функция возвращает `true`, если [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) завершается успешно, и `false` в противном случае.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```
:::

Объект [`ChildProcess`](/ru/nodejs/api/child_process#class-childprocess) может сгенерировать событие [`'error'`](/ru/nodejs/api/child_process#event-error), если сигнал не может быть доставлен. Отправка сигнала дочернему процессу, который уже завершился, не является ошибкой, но может иметь непредвиденные последствия. В частности, если идентификатор процесса (PID) был переназначен другому процессу, сигнал будет доставлен этому процессу, что может привести к неожиданным результатам.

Хотя функция называется `kill`, сигнал, доставляемый дочернему процессу, может фактически не завершить процесс.

См. [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) для справки.

В Windows, где сигналы POSIX не существуют, аргумент `signal` будет игнорироваться, за исключением `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'` и `'SIGQUIT'`, и процесс всегда будет принудительно и резко завершен (аналогично `'SIGKILL'`). См. [Signal Events](/ru/nodejs/api/process#signal-events) для получения более подробной информации.

В Linux дочерние процессы дочерних процессов не будут завершены при попытке завершить их родительский процесс. Это, вероятно, произойдет при запуске нового процесса в оболочке или с использованием опции `shell` `ChildProcess`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**Добавлено в: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальное
:::

Вызывает [`subprocess.kill()`](/ru/nodejs/api/child_process#subprocesskillsignal) с `'SIGTERM'`.

### `subprocess.killed` {#subprocesskilled}

**Добавлено в: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Устанавливается в `true` после успешной отправки сигнала дочернему процессу с помощью `subprocess.kill()`.

Свойство `subprocess.killed` указывает, успешно ли дочерний процесс получил сигнал от `subprocess.kill()`. Свойство `killed` не указывает на то, что дочерний процесс был завершен.

### `subprocess.pid` {#subprocesspid}

**Добавлено в: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Возвращает идентификатор процесса (PID) дочернего процесса. Если дочерний процесс не может быть запущен из-за ошибок, то значение равно `undefined` и генерируется событие `error`.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**Добавлено в: v0.7.10**

Вызов `subprocess.ref()` после вызова `subprocess.unref()` восстановит удаленный счетчик ссылок для дочернего процесса, заставляя родительский процесс ждать завершения дочернего процесса, прежде чем завершиться самому.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v5.8.0 | Теперь поддерживаются параметр `options` и, в частности, опция `keepOpen`. |
| v5.0.0 | Теперь этот метод возвращает логическое значение для управления потоком. |
| v4.0.0 | Теперь поддерживается параметр `callback`. |
| v0.5.9 | Добавлено в: v0.5.9 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/ru/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` или объект [`net.Socket`](/ru/nodejs/api/net#class-netsocket), [`net.Server`](/ru/nodejs/api/net#class-netserver) или [`dgram.Socket`](/ru/nodejs/api/dgram#class-dgramsocket).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Аргумент `options`, если он присутствует, является объектом, используемым для параметризации отправки определенных типов дескрипторов. `options` поддерживает следующие свойства:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Значение, которое можно использовать при передаче экземпляров `net.Socket`. Если установлено значение `true`, сокет остается открытым в процессе отправки. **По умолчанию:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Когда между родительским и дочерним процессами установлен IPC-канал (т. е. при использовании [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options)), метод `subprocess.send()` можно использовать для отправки сообщений дочернему процессу. Когда дочерний процесс является экземпляром Node.js, эти сообщения можно получить через событие [`'message'`](/ru/nodejs/api/process#event-message).

Сообщение проходит через сериализацию и разбор. Полученное сообщение может отличаться от исходного отправленного.

Например, в родительском скрипте:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Заставляет дочерний процесс напечатать: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Заставляет дочерний процесс напечатать: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

А затем дочерний скрипт, `'sub.js'`, может выглядеть так:

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Заставляет родительский процесс напечатать: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```

Дочерние процессы Node.js будут иметь свой собственный метод [`process.send()`](/ru/nodejs/api/process#processsendmessage-sendhandle-options-callback), который позволяет дочернему процессу отправлять сообщения обратно родительскому процессу.

Существует особый случай при отправке сообщения `{cmd: 'NODE_foo'}`. Сообщения, содержащие префикс `NODE_` в свойстве `cmd`, зарезервированы для использования внутри ядра Node.js и не будут генерироваться в событии [`'message'`](/ru/nodejs/api/process#event-message) дочернего процесса. Вместо этого такие сообщения генерируются с помощью события `'internalMessage'` и потребляются внутренне Node.js. Приложениям следует избегать использования таких сообщений или прослушивания событий `'internalMessage'`, поскольку это может быть изменено без предварительного уведомления.

Необязательный аргумент `sendHandle`, который можно передать в `subprocess.send()`, предназначен для передачи TCP-сервера или объекта сокета дочернему процессу. Дочерний процесс получит объект в качестве второго аргумента, переданного в функцию обратного вызова, зарегистрированную в событии [`'message'`](/ru/nodejs/api/process#event-message). Любые данные, полученные и буферизованные в сокете, не будут отправлены дочернему процессу. Отправка IPC-сокетов не поддерживается в Windows.

Необязательный аргумент `callback` - это функция, которая вызывается после отправки сообщения, но до того, как дочерний процесс может его получить. Функция вызывается с одним аргументом: `null` в случае успеха или объектом [`Error`](/ru/nodejs/api/errors#class-error) в случае неудачи.

Если функция `callback` не предоставлена и сообщение не может быть отправлено, объект [`ChildProcess`](/ru/nodejs/api/child_process#class-childprocess) сгенерирует событие `'error'`. Это может произойти, например, когда дочерний процесс уже завершился.

`subprocess.send()` вернет `false`, если канал закрыт или когда невыполненная работа по неотправленным сообщениям превышает порог, который делает дальнейшую отправку нецелесообразной. В противном случае метод возвращает `true`. Функция `callback` может использоваться для реализации управления потоком.


#### Пример: отправка объекта сервера {#example-sending-a-server-object}

Аргумент `sendHandle` может использоваться, например, для передачи дескриптора объекта TCP-сервера дочернему процессу, как показано в примере ниже:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// Откройте объект сервера и отправьте дескриптор.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// Откройте объект сервера и отправьте дескриптор.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

Дочерний процесс затем получит объект сервера следующим образом:

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```
После того, как сервер будет совместно использоваться родительским и дочерним процессами, некоторые соединения могут обрабатываться родительским процессом, а некоторые - дочерним.

Хотя в приведенном выше примере используется сервер, созданный с использованием модуля `node:net`, серверы модулей `node:dgram` используют точно такой же рабочий процесс, за исключением прослушивания события `'message'` вместо `'connection'` и использования `server.bind()` вместо `server.listen()`. Однако это поддерживается только на платформах Unix.

#### Пример: отправка объекта сокета {#example-sending-a-socket-object}

Аналогично, аргумент `sendHandler` может использоваться для передачи дескриптора сокета дочернему процессу. В приведенном ниже примере порождаются два дочерних процесса, каждый из которых обрабатывает соединения с "нормальным" или "специальным" приоритетом:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Откройте сервер и отправьте сокеты дочернему процессу. Используйте pauseOnConnect, чтобы предотвратить
// чтение сокетов до их отправки дочернему процессу.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Если это специальный приоритет...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Это нормальный приоритет.
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Откройте сервер и отправьте сокеты дочернему процессу. Используйте pauseOnConnect, чтобы предотвратить
// чтение сокетов до их отправки дочернему процессу.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Если это специальный приоритет...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Это нормальный приоритет.
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

`subprocess.js` получит дескриптор сокета в качестве второго аргумента, переданного функции обратного вызова события:

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // Проверьте, существует ли клиентский сокет.
      // Возможно, что сокет был закрыт в период времени между его
      // отправкой и получением в дочернем процессе.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
Не используйте `.maxConnections` на сокете, который был передан в подпроцесс. Родительский процесс не может отслеживать, когда сокет уничтожается.

Любые обработчики `'message'` в подпроцессе должны убедиться, что `socket` существует, поскольку соединение могло быть закрыто за время, необходимое для отправки соединения дочернему процессу.


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Свойство `subprocess.signalCode` указывает сигнал, полученный дочерним процессом, если таковой имеется, иначе `null`.

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Свойство `subprocess.spawnargs` представляет полный список аргументов командной строки, с которыми был запущен дочерний процесс.

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `subprocess.spawnfile` указывает имя исполняемого файла запущенного дочернего процесса.

Для [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options) его значение будет равно [`process.execPath`](/ru/nodejs/api/process#processexecpath). Для [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options) его значение будет именем исполняемого файла. Для [`child_process.exec()`](/ru/nodejs/api/child_process#child_processexeccommand-options-callback) его значение будет именем оболочки, в которой запущен дочерний процесс.

### `subprocess.stderr` {#subprocessstderr}

**Добавлено в: v0.1.90**

- [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Readable Stream`, представляющий `stderr` дочернего процесса.

Если дочерний процесс был запущен с `stdio[2]`, установленным во что-либо, кроме `'pipe'`, то это будет `null`.

`subprocess.stderr` является псевдонимом для `subprocess.stdio[2]`. Оба свойства будут ссылаться на одно и то же значение.

Свойство `subprocess.stderr` может быть `null` или `undefined`, если дочерний процесс не удалось успешно запустить.


### `subprocess.stdin` {#subprocessstdin}

**Добавлено в: v0.1.90**

- [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Writable Stream`, представляющий `stdin` дочернего процесса.

Если дочерний процесс ожидает чтения всех входных данных, он не продолжит работу, пока этот поток не будет закрыт с помощью `end()`.

Если дочерний процесс был запущен с `stdio[0]`, установленным в значение, отличное от `'pipe'`, то это будет `null`.

`subprocess.stdin` является псевдонимом для `subprocess.stdio[0]`. Оба свойства будут ссылаться на одно и то же значение.

Свойство `subprocess.stdin` может быть `null` или `undefined`, если дочерний процесс не удалось успешно запустить.

### `subprocess.stdio` {#subprocessstdio}

**Добавлено в: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Разреженный массив каналов к дочернему процессу, соответствующий позициям в параметре [`stdio`](/ru/nodejs/api/child_process#optionsstdio), переданном в [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options), которые были установлены в значение `'pipe'`. `subprocess.stdio[0]`, `subprocess.stdio[1]` и `subprocess.stdio[2]` также доступны как `subprocess.stdin`, `subprocess.stdout` и `subprocess.stderr` соответственно.

В следующем примере только fd `1` (stdout) дочернего процесса настроен как канал, поэтому только `subprocess.stdio[1]` родительского процесса является потоком, все остальные значения в массиве - `null`.

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

Свойство `subprocess.stdio` может быть `undefined`, если дочерний процесс не удалось успешно запустить.


### `subprocess.stdout` {#subprocessstdout}

**Добавлено в: v0.1.90**

- [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`Readable Stream`, представляющий `stdout` дочернего процесса.

Если дочерний процесс был создан с `stdio[1]`, установленным в значение, отличное от `'pipe'`, то это будет `null`.

`subprocess.stdout` - это псевдоним для `subprocess.stdio[1]`. Оба свойства будут ссылаться на одно и то же значение.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

Свойство `subprocess.stdout` может быть `null` или `undefined`, если дочерний процесс не удалось успешно запустить.

### `subprocess.unref()` {#subprocessunref}

**Добавлено в: v0.7.10**

По умолчанию родительский процесс будет ждать завершения отсоединенного дочернего процесса. Чтобы родительский процесс не ждал завершения данного `subprocess`, используйте метод `subprocess.unref()`. Это приведет к тому, что цикл событий родителя не будет включать дочерний процесс в свой счетчик ссылок, позволяя родителю завершиться независимо от дочернего, если между дочерним и родительским процессами не установлен IPC-канал.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` и Unicode {#maxbuffer-and-unicode}

Опция `maxBuffer` определяет максимальное количество байтов, допустимое для `stdout` или `stderr`. Если это значение превышено, дочерний процесс завершается. Это влияет на вывод, включающий многобайтовые кодировки символов, такие как UTF-8 или UTF-16. Например, `console.log('中文测试')` отправит 13 байтов в кодировке UTF-8 в `stdout`, хотя там всего 4 символа.

## Требования к оболочке {#shell-requirements}

Оболочка должна понимать ключ `-c`. Если оболочка - `'cmd.exe'`, она должна понимать ключи `/d /s /c`, и разбор командной строки должен быть совместим.

## Оболочка Windows по умолчанию {#default-windows-shell}

Хотя Microsoft указывает, что `%COMSPEC%` должен содержать путь к `'cmd.exe'` в корневой среде, дочерние процессы не всегда подвержены тому же требованию. Таким образом, в функциях `child_process`, где может быть порождена оболочка, `'cmd.exe'` используется в качестве резервного варианта, если `process.env.ComSpec` недоступен.

## Расширенная сериализация {#advanced-serialization}

**Добавлено в: v13.2.0, v12.16.0**

Дочерние процессы поддерживают механизм сериализации для IPC, который основан на [API сериализации модуля `node:v8`](/ru/nodejs/api/v8#serialization-api), основанном на [алгоритме структурированного клонирования HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). Обычно он более мощный и поддерживает больше встроенных типов объектов JavaScript, таких как `BigInt`, `Map` и `Set`, `ArrayBuffer` и `TypedArray`, `Buffer`, `Error`, `RegExp` и т. д.

Однако этот формат не является полным надмножеством JSON, и, например, свойства, установленные для объектов таких встроенных типов, не будут переданы на этапе сериализации. Кроме того, производительность может быть не эквивалентна производительности JSON, в зависимости от структуры передаваемых данных. Поэтому эта функция требует включения путем установки для параметра `serialization` значения `'advanced'` при вызове [`child_process.spawn()`](/ru/nodejs/api/child_process#child_processspawncommand-args-options) или [`child_process.fork()`](/ru/nodejs/api/child_process#child_processforkmodulepath-args-options).

