---
title: Документация TTY Node.js
description: Модуль TTY в Node.js предоставляет интерфейс для взаимодействия с устройствами TTY, включая методы для проверки, является ли поток TTY, получения размера окна и обработки событий терминала.
head:
  - - meta
    - name: og:title
      content: Документация TTY Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль TTY в Node.js предоставляет интерфейс для взаимодействия с устройствами TTY, включая методы для проверки, является ли поток TTY, получения размера окна и обработки событий терминала.
  - - meta
    - name: twitter:title
      content: Документация TTY Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль TTY в Node.js предоставляет интерфейс для взаимодействия с устройствами TTY, включая методы для проверки, является ли поток TTY, получения размера окна и обработки событий терминала.
---


# TTY {#tty}

::: tip [Stable: 2 - Stable]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

Модуль `node:tty` предоставляет классы `tty.ReadStream` и `tty.WriteStream`. В большинстве случаев нет необходимости или возможности использовать этот модуль напрямую. Однако к нему можно получить доступ с помощью:

```js [ESM]
const tty = require('node:tty');
```
Когда Node.js обнаруживает, что он запущен с подключенным текстовым терминалом ("TTY"), [`process.stdin`](/ru/nodejs/api/process#processstdin) по умолчанию инициализируется как экземпляр `tty.ReadStream`, а [`process.stdout`](/ru/nodejs/api/process#processstdout) и [`process.stderr`](/ru/nodejs/api/process#processstderr) по умолчанию будут экземплярами `tty.WriteStream`. Предпочтительный способ определить, выполняется ли Node.js в контексте TTY, - проверить, что значение свойства `process.stdout.isTTY` равно `true`:

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```
В большинстве случаев у приложения должно быть мало причин или вообще никаких причин для ручного создания экземпляров классов `tty.ReadStream` и `tty.WriteStream`.

## Класс: `tty.ReadStream` {#class-ttyreadstream}

**Добавлено в: v0.5.8**

- Расширяет: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Представляет читаемую сторону TTY. В нормальных обстоятельствах [`process.stdin`](/ru/nodejs/api/process#processstdin) будет единственным экземпляром `tty.ReadStream` в процессе Node.js, и не должно быть причин для создания дополнительных экземпляров.

### `readStream.isRaw` {#readstreamisraw}

**Добавлено в: v0.7.7**

`boolean`, который имеет значение `true`, если TTY в настоящее время настроен для работы в качестве необработанного устройства.

Этот флаг всегда `false` при запуске процесса, даже если терминал работает в необработанном режиме. Его значение будет меняться с последующими вызовами `setRawMode`.

### `readStream.isTTY` {#readstreamistty}

**Добавлено в: v0.5.8**

`boolean`, который всегда равен `true` для экземпляров `tty.ReadStream`.


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Добавлено в: v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, конфигурирует `tty.ReadStream` для работы в качестве необработанного устройства. Если `false`, конфигурирует `tty.ReadStream` для работы в режиме по умолчанию. Свойство `readStream.isRaw` будет установлено в полученный режим.
- Возвращает: [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) Экземпляр потока чтения.

Позволяет настроить `tty.ReadStream` так, чтобы он работал как необработанное устройство.

В необработанном режиме ввод всегда доступен посимвольно, без учета модификаторов. Кроме того, вся специальная обработка символов терминалом отключена, включая эхо-отображение вводимых символов. + больше не будет вызывать `SIGINT` в этом режиме.

## Класс: `tty.WriteStream` {#class-ttywritestream}

**Добавлено в: v0.5.8**

- Расширяет: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Представляет записываемую сторону TTY. В нормальных условиях, [`process.stdout`](/ru/nodejs/api/process#processstdout) и [`process.stderr`](/ru/nodejs/api/process#processstderr) будут единственными экземплярами `tty.WriteStream`, созданными для процесса Node.js, и не должно быть причин для создания дополнительных экземпляров.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v0.9.4 | Поддерживается аргумент `options`. |
| v0.5.8 | Добавлено в: v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Файловый дескриптор, связанный с TTY.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Параметры, переданные родительскому `net.Socket`, см. `options` [`конструктора net.Socket`](/ru/nodejs/api/net#new-netsocketoptions).
- Возвращает: [\<tty.ReadStream\>](/ru/nodejs/api/tty#class-ttyreadstream)

Создает `ReadStream` для `fd`, связанного с TTY.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Добавлено в: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Файловый дескриптор, связанный с TTY.
- Возвращает: [\<tty.WriteStream\>](/ru/nodejs/api/tty#class-ttywritestream)

Создает `WriteStream` для `fd`, связанного с TTY.


### Событие: `'resize'` {#event-resize}

**Добавлено в: v0.7.7**

Событие `'resize'` возникает, когда изменяются свойства `writeStream.columns` или `writeStream.rows`. При вызове функции обратного вызова прослушивателя аргументы не передаются.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('размер экрана изменился!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.7.0 | Предоставлены обратный вызов и возвращаемое значение `write()` потока. |
| v0.7.7 | Добавлено в: v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: слева от курсора
    - `1`: справа от курсора
    - `0`: вся строка
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения операции.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если поток хочет, чтобы вызывающий код ждал, пока не будет сгенерировано событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

`writeStream.clearLine()` очищает текущую строку этого `WriteStream` в направлении, указанном `dir`.

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.7.0 | Предоставлены обратный вызов и возвращаемое значение `write()` потока. |
| v0.7.7 | Добавлено в: v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения операции.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если поток хочет, чтобы вызывающий код ждал, пока не будет сгенерировано событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

`writeStream.clearScreenDown()` очищает этот `WriteStream` от текущего курсора вниз.


### `writeStream.columns` {#writestreamcolumns}

**Добавлено в версии: v0.7.7**

`number`, указывающий количество столбцов, которое в данный момент имеет TTY. Это свойство обновляется при каждом событии `'resize'`.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.7.0 | Открыт обратный вызов write() потока и возвращаемое значение. |
| v0.7.7 | Добавлено в версии: v0.7.7 |
:::

- `x` [\<number\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения операции.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если поток желает, чтобы вызывающий код подождал, пока не будет испущено событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

`writeStream.cursorTo()` перемещает курсор этого `WriteStream` в указанную позицию.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**Добавлено в версии: v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, содержащий переменные окружения для проверки. Это позволяет имитировать использование определенного терминала. **По умолчанию:** `process.env`.
- Возвращает: [\<number\>](https://developer.mozilla.org/ru/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает:

- `1` для 2,
- `4` для 16,
- `8` для 256,
- `24` для 16 777 216 поддерживаемых цветов.

Используйте это, чтобы определить, какие цвета поддерживает терминал. Из-за природы цветов в терминалах возможны как ложные срабатывания, так и ложные отрицания. Это зависит от информации о процессе и переменных окружения, которые могут лгать об используемом терминале. Можно передать объект `env` для имитации использования определенного терминала. Это может быть полезно для проверки поведения конкретных настроек среды.

Чтобы принудительно включить определенную поддержку цветов, используйте одну из приведенных ниже настроек среды.

- 2 цвета: `FORCE_COLOR = 0` (Отключает цвета)
- 16 цветов: `FORCE_COLOR = 1`
- 256 цветов: `FORCE_COLOR = 2`
- 16 777 216 цветов: `FORCE_COLOR = 3`

Отключить поддержку цветов также можно с помощью переменных окружения `NO_COLOR` и `NODE_DISABLE_COLORS`.


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Добавлено в версии: v0.7.7**

- Возвращает: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` возвращает размер TTY, соответствующего этому `WriteStream`. Массив имеет тип `[numColumns, numRows]`, где `numColumns` и `numRows` представляют количество столбцов и строк в соответствующем TTY.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Добавлено в версии: v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество запрошенных цветов (минимум 2). **По умолчанию:** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, содержащий переменные окружения для проверки. Это позволяет имитировать использование определенного терминала. **По умолчанию:** `process.env`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если `writeStream` поддерживает как минимум столько цветов, сколько указано в `count`. Минимальная поддержка - 2 (черный и белый).

Имеет те же ложные срабатывания и отрицательные результаты, что и описано в [`writeStream.getColorDepth()`](/ru/nodejs/api/tty#writestreamgetcolordepthenv).

```js [ESM]
process.stdout.hasColors();
// Возвращает true или false в зависимости от того, поддерживает ли `stdout` как минимум 16 цветов.
process.stdout.hasColors(256);
// Возвращает true или false в зависимости от того, поддерживает ли `stdout` как минимум 256 цветов.
process.stdout.hasColors({ TMUX: '1' });
// Возвращает true.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// Возвращает false (настройка окружения предполагает поддержку 2 ** 8 цветов).
```
### `writeStream.isTTY` {#writestreamistty}

**Добавлено в версии: v0.5.8**

`boolean`, который всегда `true`.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.7.0 | Предоставляется обратный вызов write() потока и возвращаемое значение. |
| v0.7.7 | Добавлено в версии: v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается после завершения операции.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false`, если поток желает, чтобы вызывающий код ждал, пока не будет сгенерировано событие `'drain'`, прежде чем продолжить запись дополнительных данных; в противном случае `true`.

`writeStream.moveCursor()` перемещает курсор этого `WriteStream` *относительно* его текущей позиции.


### `writeStream.rows` {#writestreamrows}

**Добавлено в: v0.7.7**

Число `number`, указывающее количество строк, которое в данный момент имеет TTY. Это свойство обновляется всякий раз, когда генерируется событие `'resize'`.

## `tty.isatty(fd)` {#ttyisattyfd}

**Добавлено в: v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Числовой файловый дескриптор
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Метод `tty.isatty()` возвращает `true`, если данный `fd` связан с TTY, и `false`, если нет, в том числе, когда `fd` не является неотрицательным целым числом.

