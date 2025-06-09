---
title: Руководство по отладчику Node.js
description: Подробное руководство по использованию встроенного отладчика в Node.js, с описанием команд, использования и техник отладки.
head:
  - - meta
    - name: og:title
      content: Руководство по отладчику Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Подробное руководство по использованию встроенного отладчика в Node.js, с описанием команд, использования и техник отладки.
  - - meta
    - name: twitter:title
      content: Руководство по отладчику Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Подробное руководство по использованию встроенного отладчика в Node.js, с описанием команд, использования и техник отладки.
---


# Отладчик {#debugger}

::: tip [Стабильность: 2 - Стабильный]
[Стабильность: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильный
:::

Node.js включает в себя утилиту отладки из командной строки. Клиент отладчика Node.js не является полнофункциональным отладчиком, но простые шаги и инспекция возможны.

Для его использования запустите Node.js с аргументом `inspect`, за которым следует путь к скрипту для отладки.

```bash [BASH]
$ node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
 ok
Break on start in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
Отладчик автоматически останавливается на первой исполняемой строке. Чтобы вместо этого выполнить программу до первой точки останова (указанной оператором [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)), установите переменную окружения `NODE_INSPECT_RESUME_ON_START` в значение `1`.

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< hello
<
break in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
break in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Press Ctrl+C to leave debug repl
> x
5
> 2 + 2
4
debug> next
< world
<
break in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```
Команда `repl` позволяет удаленно оценивать код. Команда `next` переходит к следующей строке. Введите `help`, чтобы увидеть, какие еще команды доступны.

Нажатие `enter` без ввода команды повторит предыдущую команду отладчика.


## Наблюдатели {#watchers}

Во время отладки можно наблюдать за значениями выражений и переменных. При каждой точке останова каждое выражение из списка наблюдателей будет вычисляться в текущем контексте и отображаться непосредственно перед листингом исходного кода точки останова.

Чтобы начать наблюдение за выражением, введите `watch('мое_выражение')`. Команда `watchers` выведет список активных наблюдателей. Чтобы удалить наблюдателя, введите `unwatch('мое_выражение')`.

## Справочник по командам {#command-reference}

### Пошаговое выполнение {#stepping}

- `cont`, `c`: Продолжить выполнение
- `next`, `n`: Шаг с обходом
- `step`, `s`: Шаг с заходом
- `out`, `o`: Шаг с выходом
- `pause`: Приостановить выполнение кода (как кнопка паузы в Инструментах разработчика)

### Точки останова {#breakpoints}

- `setBreakpoint()`, `sb()`: Установить точку останова на текущей строке
- `setBreakpoint(line)`, `sb(line)`: Установить точку останова на определенной строке
- `setBreakpoint('fn()')`, `sb(...)`: Установить точку останова на первом операторе в теле функции
- `setBreakpoint('script.js', 1)`, `sb(...)`: Установить точку останова на первой строке `script.js`
- `setBreakpoint('script.js', 1, 'num < 4')`, `sb(...)`: Установить условную точку останова на первой строке `script.js`, которая срабатывает только когда `num < 4` вычисляется как `true`
- `clearBreakpoint('script.js', 1)`, `cb(...)`: Очистить точку останова в `script.js` на строке 1

Также возможно установить точку останова в файле (модуле), который еще не загружен:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
Также можно установить условную точку останова, которая срабатывает только тогда, когда заданное выражение вычисляется как `true`:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### Информация {#information}

- `backtrace`, `bt`: Вывести трассировку текущего кадра выполнения
- `list(5)`: Вывести исходный код скрипта с контекстом в 5 строк (5 строк до и после)
- `watch(expr)`: Добавить выражение в список отслеживания
- `unwatch(expr)`: Удалить выражение из списка отслеживания
- `unwatch(index)`: Удалить выражение по указанному индексу из списка отслеживания
- `watchers`: Вывести список всех отслеживаемых выражений и их значений (автоматически выводится при каждой точке останова)
- `repl`: Открыть REPL отладчика для вычисления в контексте отлаживаемого скрипта
- `exec expr`, `p expr`: Выполнить выражение в контексте отлаживаемого скрипта и вывести его значение
- `profile`: Начать сессию профилирования CPU
- `profileEnd`: Остановить текущую сессию профилирования CPU
- `profiles`: Вывести список всех завершенных сессий профилирования CPU
- `profiles[n].save(filepath = 'node.cpuprofile')`: Сохранить сессию профилирования CPU на диск в формате JSON
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: Сделать снимок кучи и сохранить его на диск в формате JSON

### Управление выполнением {#execution-control}

- `run`: Запустить скрипт (автоматически запускается при старте отладчика)
- `restart`: Перезапустить скрипт
- `kill`: Завершить скрипт

### Разное {#various}

- `scripts`: Вывести список всех загруженных скриптов
- `version`: Отобразить версию V8

## Расширенное использование {#advanced-usage}

### Интеграция V8 Inspector для Node.js {#v8-inspector-integration-for-nodejs}

Интеграция V8 Inspector позволяет подключить Chrome DevTools к экземплярам Node.js для отладки и профилирования. Он использует [протокол Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/).

V8 Inspector можно включить, передав флаг `--inspect` при запуске приложения Node.js. Также можно указать пользовательский порт с этим флагом, например, `--inspect=9222` будет принимать соединения DevTools на порту 9222.

Использование флага `--inspect` выполнит код немедленно перед подключением отладчика. Это означает, что код начнет выполняться до того, как вы сможете начать отладку, что может быть не идеально, если вы хотите отлаживать с самого начала.

В таких случаях у вас есть две альтернативы:

Итак, при выборе между `--inspect`, `--inspect-wait` и `--inspect-brk` учитывайте, хотите ли вы, чтобы код начал выполняться немедленно, ждал подключения отладчика перед выполнением или остановился на первой строке для пошаговой отладки.

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(В примере выше UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 в конце URL-адреса генерируется на лету, он меняется в разных сеансах отладки.)

Если браузер Chrome старше версии 66.0.3345.0, используйте `inspector.html` вместо `js_app.html` в приведенном выше URL-адресе.

Chrome DevTools пока не поддерживает отладку [рабочих потоков](/ru/nodejs/api/worker_threads). Для их отладки можно использовать [ndb](https://github.com/GoogleChromeLabs/ndb/).

