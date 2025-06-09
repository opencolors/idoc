---
title: Документация API файловой системы Node.js
description: Подробное руководство по модулю файловой системы Node.js, описывающее методы для операций с файлами, такие как чтение, запись, открытие, закрытие, а также управление разрешениями и статистикой файлов.
head:
  - - meta
    - name: og:title
      content: Документация API файловой системы Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Подробное руководство по модулю файловой системы Node.js, описывающее методы для операций с файлами, такие как чтение, запись, открытие, закрытие, а также управление разрешениями и статистикой файлов.
  - - meta
    - name: twitter:title
      content: Документация API файловой системы Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Подробное руководство по модулю файловой системы Node.js, описывающее методы для операций с файлами, такие как чтение, запись, открытие, закрытие, а также управление разрешениями и статистикой файлов.
---


# Файловая система {#file-system}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/fs.js](https://github.com/nodejs/node/blob/v23.5.0/lib/fs.js)

Модуль `node:fs` обеспечивает взаимодействие с файловой системой способом, смоделированным на основе стандартных функций POSIX.

Для использования API на основе промисов:

::: code-group
```js [ESM]
import * as fs from 'node:fs/promises';
```

```js [CJS]
const fs = require('node:fs/promises');
```
:::

Для использования API на основе колбэков и синхронных API:

::: code-group
```js [ESM]
import * as fs from 'node:fs';
```

```js [CJS]
const fs = require('node:fs');
```
:::

Все операции с файловой системой имеют синхронные формы, формы на основе колбэков и на основе промисов и доступны с использованием как синтаксиса CommonJS, так и модулей ES6 (ESM).

## Пример использования Promise {#promise-example}

Операции, основанные на промисах, возвращают промис, который выполняется при завершении асинхронной операции.

::: code-group
```js [ESM]
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```
:::

## Пример использования Callback {#callback-example}

Форма колбэка принимает функцию обратного вызова завершения в качестве своего последнего аргумента и вызывает операцию асинхронно. Аргументы, передаваемые в обратный вызов завершения, зависят от метода, но первый аргумент всегда зарезервирован для исключения. Если операция завершена успешно, то первый аргумент равен `null` или `undefined`.

::: code-group
```js [ESM]
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

```js [CJS]
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```
:::

Версии API модуля `node:fs`, основанные на обратных вызовах, предпочтительнее использования API промисов, когда требуется максимальная производительность (как с точки зрения времени выполнения, так и с точки зрения выделения памяти).


## Синхронный пример {#synchronous-example}

Синхронные API блокируют цикл событий Node.js и дальнейшее выполнение JavaScript до завершения операции. Исключения выбрасываются немедленно и могут быть обработаны с помощью `try…catch`, или могут быть позволены всплывать.

::: code-group
```js [ESM]
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```

```js [CJS]
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```
:::

## Promises API {#promises-api}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Предоставлен как `require('fs/promises')`. |
| v11.14.0, v10.17.0 | Этот API больше не является экспериментальным. |
| v10.1.0 | API доступен только через `require('fs').promises`. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

API `fs/promises` предоставляет асинхронные методы файловой системы, которые возвращают промисы.

API промисов использует базовый пул потоков Node.js для выполнения операций файловой системы вне потока цикла событий. Эти операции не синхронизированы и не потокобезопасны. Следует проявлять осторожность при выполнении нескольких одновременных изменений одного и того же файла, иначе может произойти повреждение данных.

### Класс: `FileHandle` {#class-filehandle}

**Добавлено в: v10.0.0**

Объект [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) является объектной оберткой для числового файлового дескриптора.

Экземпляры объекта [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) создаются методом `fsPromises.open()`.

Все объекты [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) являются [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)s.

Если [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) не закрыт с помощью метода `filehandle.close()`, он попытается автоматически закрыть файловый дескриптор и сгенерировать предупреждение процесса, помогая предотвратить утечки памяти. Пожалуйста, не полагайтесь на это поведение, потому что оно может быть ненадежным, и файл может быть не закрыт. Вместо этого всегда явно закрывайте [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle)s. Node.js может изменить это поведение в будущем.


#### Событие: `'close'` {#event-close}

**Добавлено в версии: v15.4.0**

Событие `'close'` генерируется, когда [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) был закрыт и больше не может быть использован.

#### `filehandle.appendFile(data[, options])` {#filehandleappendfiledata-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.1.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v15.14.0, v14.18.0 | Аргумент `data` поддерживает `AsyncIterable`, `Iterable` и `Stream`. |
| v14.0.0 | Параметр `data` больше не будет приводить неподдерживаемый ввод к строкам. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ru/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то базовый файловый дескриптор сбрасывается перед его закрытием. **По умолчанию:** `false`.

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Псевдоним [`filehandle.writeFile()`](/ru/nodejs/api/fs#filehandlewritefiledata-options).

При работе с файловыми дескрипторами режим не может быть изменен по сравнению с тем, который был установлен с помощью [`fsPromises.open()`](/ru/nodejs/api/fs#fspromisesopenpath-flags-mode). Поэтому это эквивалентно [`filehandle.writeFile()`](/ru/nodejs/api/fs#filehandlewritefiledata-options).


#### `filehandle.chmod(mode)` {#filehandlechmodmode}

**Добавлено в: v10.0.0**

- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) битовая маска режима файла.
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Изменяет права доступа к файлу. См. [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

#### `filehandle.chown(uid, gid)` {#filehandlechownuid-gid}

**Добавлено в: v10.0.0**

- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор пользователя нового владельца файла.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор группы новой группы файла.
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Изменяет владельца файла. Обертка для [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

#### `filehandle.close()` {#filehandleclose}

**Добавлено в: v10.0.0**

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Закрывает дескриптор файла после ожидания завершения любых ожидающих операций с дескриптором.

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```
#### `filehandle.createReadStream([options])` {#filehandlecreatereadstreamoptions}

**Добавлено в: v16.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `64 * 1024`
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **По умолчанию:** `undefined`


- Возвращает: [\<fs.ReadStream\>](/ru/nodejs/api/fs#class-fsreadstream)

`options` может включать значения `start` и `end` для чтения диапазона байтов из файла вместо всего файла. И `start`, и `end` являются включительными и начинают отсчет с 0, допустимые значения находятся в диапазоне [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Если `start` опущен или `undefined`, `filehandle.createReadStream()` считывает последовательно с текущей позиции в файле. `encoding` может быть любым из тех, которые принимаются [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если `FileHandle` указывает на символьное устройство, которое поддерживает только блокирующие чтения (например, клавиатура или звуковая карта), операции чтения не завершаются до тех пор, пока данные не станут доступны. Это может помешать процессу завершиться и потоку закрыться естественным образом.

По умолчанию поток будет генерировать событие `'close'` после его уничтожения. Установите для параметра `emitClose` значение `false`, чтобы изменить это поведение.

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Создайте поток из некоторого символьного устройства.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // Это может не закрыть поток.
  // Искусственное обозначение конца потока, как если бы базовый ресурс
  // самостоятельно указал на конец файла, позволяет закрыть поток.
  // Это не отменяет ожидающие операции чтения, и если такая операция
  // есть, процесс все равно может не завершиться успешно,
  // пока она не завершится.
  stream.push(null);
  stream.read(0);
}, 100);
```
Если `autoClose` имеет значение false, то файловый дескриптор не будет закрыт, даже если есть ошибка. Ответственность за его закрытие и обеспечение отсутствия утечки файловых дескрипторов лежит на приложении. Если для `autoClose` установлено значение true (поведение по умолчанию), то при `'error'` или `'end'` файловый дескриптор будет закрыт автоматически.

Пример чтения последних 10 байтов файла длиной 100 байтов:

```js [ESM]
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])` {#filehandlecreatewritestreamoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v16.11.0 | Добавлено в: v16.11.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то перед закрытием дескриптор базового файла сбрасывается. **По умолчанию:** `false`.

- Возвращает: [\<fs.WriteStream\>](/ru/nodejs/api/fs#class-fswritestream)

`options` может также включать опцию `start`, чтобы разрешить запись данных в определенной позиции после начала файла, допустимые значения находятся в диапазоне [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Изменение файла, а не его замена, может потребовать, чтобы опция `flags` `open` была установлена в `r+`, а не в значение по умолчанию `r`. `encoding` может быть любым из тех, которые принимаются [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если для `autoClose` установлено значение true (поведение по умолчанию), при возникновении `'error'` или `'finish'` файловый дескриптор будет автоматически закрыт. Если `autoClose` имеет значение false, файловый дескриптор не будет закрыт, даже если произошла ошибка. Ответственность за его закрытие и обеспечение отсутствия утечки файловых дескрипторов лежит на приложении.

По умолчанию поток будет генерировать событие `'close'` после уничтожения. Установите для параметра `emitClose` значение `false`, чтобы изменить это поведение.


#### `filehandle.datasync()` {#filehandledatasync}

**Добавлено в версии: v10.0.0**

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Принудительно переводит все текущие операции ввода-вывода, связанные с файлом, в синхронизированное состояние завершения ввода-вывода операционной системы. Подробности см. в документации POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2).

В отличие от `filehandle.sync`, этот метод не сбрасывает измененные метаданные.

#### `filehandle.fd` {#filehandlefd}

**Добавлено в версии: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Числовой файловый дескриптор, управляемый объектом [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle).

#### `filehandle.read(buffer, offset, length, position)` {#filehandlereadbuffer-offset-length-position}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Принимает значения bigint в качестве `position`. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Буфер, который будет заполнен считанными данными из файла.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Место в буфере, с которого следует начать заполнение. **По умолчанию:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для чтения. **По умолчанию:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Место, с которого следует начать чтение данных из файла. Если `null` или `-1`, данные будут считываться с текущей позиции файла, и позиция будет обновлена. Если `position` является неотрицательным целым числом, текущая позиция файла останется неизменной. **По умолчанию:** `null`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается при успехе с объектом с двумя свойствами:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество прочитанных байтов
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ссылка на переданный аргумент `buffer`.
  
 

Считывает данные из файла и сохраняет их в указанном буфере.

Если файл не изменяется одновременно, конец файла достигается, когда количество прочитанных байтов равно нулю.


#### `filehandle.read([options])` {#filehandlereadoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Принимает значения bigint в качестве `position`. |
| v13.11.0, v12.17.0 | Добавлено в: v13.11.0, v12.17.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Буфер, который будет заполнен прочитанными данными файла. **По умолчанию:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Местоположение в буфере, с которого начинается заполнение. **По умолчанию:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для чтения. **По умолчанию:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Местоположение, с которого начинается чтение данных из файла. Если `null` или `-1`, данные будут считываться с текущей позиции файла, и позиция будет обновлена. Если `position` является неотрицательным целым числом, текущая позиция файла останется неизменной. **По умолчанию**: `null`
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется при успехе с объектом с двумя свойствами: 
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество прочитанных байтов
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ссылка на переданный аргумент `buffer`.
  
 

Читает данные из файла и сохраняет их в заданном буфере.

Если файл не изменяется одновременно, конец файла достигается, когда количество прочитанных байтов равно нулю.


#### `filehandle.read(buffer[, options])` {#filehandlereadbuffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Принимает значения bigint в качестве `position`. |
| v18.2.0, v16.17.0 | Добавлено в: v18.2.0, v16.17.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Буфер, который будет заполнен прочитанными данными из файла.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Местоположение в буфере, с которого начинается заполнение. **По умолчанию:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для чтения. **По умолчанию:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Место, с которого начинается чтение данных из файла. Если `null` или `-1`, данные будут прочитаны с текущей позиции файла, и позиция будет обновлена. Если `position` является неотрицательным целым числом, текущая позиция файла останется неизменной. **По умолчанию**: `null`


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Выполняется при успехе с объектом, имеющим два свойства:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество прочитанных байтов
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ссылка на переданный аргумент `buffer`.


Читает данные из файла и сохраняет их в заданном буфере.

Если файл не изменяется одновременно, конец файла достигается, когда количество прочитанных байтов равно нулю.


#### `filehandle.readableWebStream([options])` {#filehandlereadablewebstreamoptions}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0, v18.17.0 | Добавлена опция для создания потока 'bytes'. |
| v17.0.0 | Добавлено в: v17.0.0 |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Указывает, открыть ли обычный или `'bytes'` поток. **По умолчанию:** `undefined`
  
 
-  Возвращает: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream) 

Возвращает `ReadableStream`, который можно использовать для чтения данных файлов.

Будет выброшена ошибка, если этот метод будет вызван более одного раза или будет вызван после того, как `FileHandle` будет закрыт или закрывается.



::: code-group
```js [ESM]
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```js [CJS]
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```
:::

Хотя `ReadableStream` прочитает файл до конца, он не закроет `FileHandle` автоматически. Пользовательский код все равно должен вызвать метод `fileHandle.close()`.

#### `filehandle.readFile(options)` {#filehandlereadfileoptions}

**Добавлено в: v10.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать выполняющееся readFile
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется после успешного чтения с содержимым файла. Если кодировка не указана (с помощью `options.encoding`), данные возвращаются как объект [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer). В противном случае данные будут строкой.

Асинхронно считывает все содержимое файла.

Если `options` является строкой, то она указывает `encoding`.

[\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) должен поддерживать чтение.

Если сделано одно или несколько вызовов `filehandle.read()` для дескриптора файла, а затем сделан вызов `filehandle.readFile()`, данные будут считываться с текущей позиции до конца файла. Он не всегда считывается с начала файла.


#### `filehandle.readLines([options])` {#filehandlereadlinesoptions}

**Добавлено в: v18.11.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `null`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `64 * 1024`


- Возвращает: [\<readline.InterfaceConstructor\>](/ru/nodejs/api/readline#class-interfaceconstructor)

Удобный метод для создания интерфейса `readline` и потоковой передачи по файлу. См. [`filehandle.createReadStream()`](/ru/nodejs/api/fs#filehandlecreatereadstreamoptions) для параметров.

::: code-group
```js [ESM]
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```js [CJS]
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```
:::

#### `filehandle.readv(buffers[, position])` {#filehandlereadvbuffers-position}

**Добавлено в: v13.13.0, v12.17.0**

- `buffers` [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Смещение от начала файла, откуда должны быть прочитаны данные. Если `position` не является `number`, данные будут прочитаны с текущей позиции. **По умолчанию:** `null`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Выполняется при успехе, возвращая объект, содержащий два свойства:
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) количество прочитанных байтов
    - `buffers` [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) свойство, содержащее ссылку на входные `buffers`.

Чтение из файла и запись в массив [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)s


#### `filehandle.stat([options])` {#filehandlestatoptions}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.5.0 | Принимает дополнительный объект `options` для указания, следует ли возвращать числовые значения как bigint. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть `bigint`. **По умолчанию:** `false`.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для файла.

#### `filehandle.sync()` {#filehandlesync}

**Добавлено в версии: v10.0.0**

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с `undefined` в случае успеха.

Запрашивает, чтобы все данные для открытого файлового дескриптора были сброшены на устройство хранения. Конкретная реализация зависит от операционной системы и устройства. Обратитесь к документации POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) для получения более подробной информации.

#### `filehandle.truncate(len)` {#filehandletruncatelen}

**Добавлено в версии: v10.0.0**

- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с `undefined` в случае успеха.

Усекает файл.

Если файл был больше, чем `len` байт, в файле будут сохранены только первые `len` байт.

Следующий пример сохраняет только первые четыре байта файла:

```js [ESM]
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```
Если файл ранее был короче, чем `len` байт, он будет расширен, а расширенная часть будет заполнена нулевыми байтами (`'\0'`):

Если `len` отрицательное число, то будет использовано `0`.


#### `filehandle.utimes(atime, mtime)` {#filehandleutimesatime-mtime}

**Добавлено в: v10.0.0**

- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Изменяет временные метки файловой системы объекта, на который ссылается [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle), затем выполняет промис без аргументов при успехе.

#### `filehandle.write(buffer, offset[, length[, position]])` {#filehandlewritebuffer-offset-length-position}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Параметр `buffer` больше не будет приводить неподдерживаемый ввод к буферам. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Начальная позиция внутри `buffer`, с которой начинается запись данных.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов из `buffer` для записи. **По умолчанию:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Смещение от начала файла, куда должны быть записаны данные из `buffer`. Если `position` не является `number`, данные будут записаны в текущей позиции. Дополнительную информацию см. в документации POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2). **По умолчанию:** `null`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Записывает `buffer` в файл.

Промис выполняется с объектом, содержащим два свойства:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) количество записанных байтов
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ссылка на записанный `buffer`.

Небезопасно использовать `filehandle.write()` несколько раз в одном и том же файле, не дожидаясь выполнения (или отклонения) промиса. Для этого сценария используйте [`filehandle.createWriteStream()`](/ru/nodejs/api/fs#filehandlecreatewritestreamoptions).

В Linux позиционные записи не работают, когда файл открыт в режиме добавления. Ядро игнорирует аргумент позиции и всегда добавляет данные в конец файла.


#### `filehandle.write(buffer[, options])` {#filehandlewritebuffer-options}

**Добавлено в: v18.3.0, v16.17.0**

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `null`


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Записывает `buffer` в файл.

Аналогично вышеуказанной функции `filehandle.write`, эта версия принимает необязательный объект `options`. Если объект `options` не указан, будут использоваться значения по умолчанию, указанные выше.

#### `filehandle.write(string[, position[, encoding]])` {#filehandlewritestring-position-encoding}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Параметр `string` больше не будет приводить неподдерживаемый ввод к строкам. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Смещение от начала файла, куда должны быть записаны данные из `string`. Если `position` не является `number`, данные будут записаны в текущую позицию. См. документацию POSIX [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2) для получения более подробной информации. **По умолчанию:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ожидаемая кодировка строки. **По умолчанию:** `'utf8'`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Записывает `string` в файл. Если `string` не является строкой, промис отклоняется с ошибкой.

Промис выполняется с объектом, содержащим два свойства:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) количество записанных байтов
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ссылка на записанную `string`.

Опасно использовать `filehandle.write()` несколько раз для одного и того же файла, не дожидаясь выполнения (или отклонения) промиса. В этом случае используйте [`filehandle.createWriteStream()`](/ru/nodejs/api/fs#filehandlecreatewritestreamoptions).

В Linux позиционная запись не работает, если файл открыт в режиме добавления. Ядро игнорирует аргумент position и всегда добавляет данные в конец файла.


#### `filehandle.writeFile(data, options)` {#filehandlewritefiledata-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.14.0, v14.18.0 | Аргумент `data` поддерживает `AsyncIterable`, `Iterable` и `Stream`. |
| v14.0.0 | Параметр `data` больше не будет приводить неподдерживаемый ввод к строкам. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ru/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Ожидаемая кодировка символов, когда `data` является строкой. **По умолчанию:** `'utf8'`


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Асинхронно записывает данные в файл, заменяя файл, если он уже существует. `data` может быть строкой, буфером, [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) или объектом [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol). Промис выполняется без аргументов в случае успеха.

Если `options` является строкой, то она определяет `encoding`.

[\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) должен поддерживать запись.

Небезопасно использовать `filehandle.writeFile()` несколько раз для одного и того же файла, не дожидаясь выполнения (или отклонения) промиса.

Если сделан один или несколько вызовов `filehandle.write()` для дескриптора файла, а затем сделан вызов `filehandle.writeFile()`, данные будут записаны с текущей позиции до конца файла. Не всегда записывается с начала файла.


#### `filehandle.writev(buffers[, position])` {#filehandlewritevbuffers-position}

**Добавлено в: v12.9.0**

- `buffers` [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Смещение от начала файла, куда следует записать данные из `buffers`. Если `position` не является `number`, данные будут записаны в текущей позиции. **По умолчанию:** `null`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Записывает массив [\<ArrayBufferView\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView) в файл.

Промис выполняется с объектом, содержащим два свойства:

- `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) количество записанных байтов
- `buffers` [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) ссылка на входные `buffers`.

Небезопасно вызывать `writev()` несколько раз для одного и того же файла, не дожидаясь выполнения (или отклонения) промиса.

В Linux позиционные записи не работают, если файл открыт в режиме добавления. Ядро игнорирует аргумент position и всегда добавляет данные в конец файла.

#### `filehandle[Symbol.asyncDispose]()` {#filehandlesymbolasyncdispose}

**Добавлено в: v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Псевдоним для `filehandle.close()`.


### `fsPromises.access(path[, mode])` {#fspromisesaccesspath-mode}

**Добавлено в: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `fs.constants.F_OK`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с `undefined` при успехе.

Проверяет права пользователя на файл или каталог, указанный в `path`. Аргумент `mode` является необязательным целым числом, которое определяет проверки доступности, которые должны быть выполнены. `mode` должен быть либо значением `fs.constants.F_OK`, либо маской, состоящей из побитового ИЛИ любого из `fs.constants.R_OK`, `fs.constants.W_OK` и `fs.constants.X_OK` (например, `fs.constants.W_OK | fs.constants.R_OK`). См. [Константы доступа к файлам](/ru/nodejs/api/fs#file-access-constants) для возможных значений `mode`.

Если проверка доступности прошла успешно, обещание выполняется без значения. Если какая-либо из проверок доступности не удалась, обещание отклоняется с объектом [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). Следующий пример проверяет, может ли текущий процесс читать и записывать файл `/etc/passwd`.

```js [ESM]
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```
Использовать `fsPromises.access()` для проверки доступности файла перед вызовом `fsPromises.open()` не рекомендуется. Это создает состояние гонки, поскольку другие процессы могут изменить состояние файла между двумя вызовами. Вместо этого пользовательский код должен открывать/читать/записывать файл напрямую и обрабатывать ошибку, возникающую, если файл недоступен.

### `fsPromises.appendFile(path, data[, options])` {#fspromisesappendfilepath-data-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.1.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) имя файла или [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержка флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, базовый файловый дескриптор сбрасывается перед закрытием. **По умолчанию:** `false`.
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с `undefined` при успехе.

Асинхронно добавляет данные в файл, создавая файл, если он еще не существует. `data` может быть строкой или [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если `options` является строкой, то она определяет `encoding`.

Опция `mode` влияет только на вновь созданный файл. См. [`fs.open()`](/ru/nodejs/api/fs#fsopenpath-flags-mode-callback) для получения более подробной информации.

`path` может быть указан как [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle), который был открыт для добавления (с использованием `fsPromises.open()`).


### `fsPromises.chmod(path, mode)` {#fspromiseschmodpath-mode}

**Добавлено в версии: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Изменяет права доступа к файлу.

### `fsPromises.chown(path, uid, gid)` {#fspromiseschownpath-uid-gid}

**Добавлено в версии: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Изменяет владельца файла.

### `fsPromises.copyFile(src, dest[, mode])` {#fspromisescopyfilesrc-dest-mode}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Аргумент `flags` изменен на `mode` и введена более строгая проверка типов. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Имя исходного файла для копирования
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Имя файла назначения для операции копирования
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательные модификаторы, определяющие поведение операции копирования. Можно создать маску, состоящую из побитового ИЛИ двух или более значений (например, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`). **По умолчанию:** `0`.
    - `fs.constants.COPYFILE_EXCL`: Операция копирования завершится неудачей, если `dest` уже существует.
    - `fs.constants.COPYFILE_FICLONE`: Операция копирования попытается создать reflink с копированием при записи. Если платформа не поддерживает копирование при записи, используется резервный механизм копирования.
    - `fs.constants.COPYFILE_FICLONE_FORCE`: Операция копирования попытается создать reflink с копированием при записи. Если платформа не поддерживает копирование при записи, операция завершится неудачей.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Асинхронно копирует `src` в `dest`. По умолчанию, `dest` перезаписывается, если он уже существует.

Не дается никаких гарантий об атомарности операции копирования. Если возникает ошибка после открытия целевого файла для записи, предпринимается попытка удалить целевой файл.

```js [ESM]
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt был скопирован в destination.txt');
} catch {
  console.error('Файл не удалось скопировать');
}

// Используя COPYFILE_EXCL, операция завершится неудачей, если destination.txt существует.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt был скопирован в destination.txt');
} catch {
  console.error('Файл не удалось скопировать');
}
```

### `fsPromises.cp(src, dest[, options])` {#fspromisescpsrc-dest-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.3.0 | Этот API больше не является экспериментальным. |
| v20.1.0, v18.17.0 | Принимает дополнительную опцию `mode` для указания поведения копирования в качестве аргумента `mode` для `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Принимает дополнительную опцию `verbatimSymlinks` для указания, следует ли выполнять разрешение пути для символических ссылок. |
| v16.7.0 | Добавлено в версии: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) исходный путь для копирования.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) путь назначения для копирования.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) разрешить символические ссылки. **По умолчанию:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) когда `force` равно `false`, и место назначения существует, выдавать ошибку. **По умолчанию:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция для фильтрации копируемых файлов/каталогов. Верните `true`, чтобы скопировать элемент, `false`, чтобы проигнорировать его. При игнорировании каталога все его содержимое также будет пропущено. Также может вернуть `Promise`, который разрешается в `true` или `false` **По умолчанию:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) исходный путь для копирования.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) путь назначения для копирования.
    - Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Значение, которое можно привести к `boolean`, или `Promise`, который выполняется с таким значением.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) перезаписать существующий файл или каталог. Операция копирования будет игнорировать ошибки, если вы установите для этого значения false, и место назначения существует. Используйте опцию `errorOnExist`, чтобы изменить это поведение. **По умолчанию:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) модификаторы для операции копирования. **По умолчанию:** `0`. См. флаг `mode` для [`fsPromises.copyFile()`](/ru/nodejs/api/fs#fspromisescopyfilesrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то метки времени из `src` будут сохранены. **По умолчанию:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) копировать каталоги рекурсивно **По умолчанию:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то разрешение пути для символических ссылок будет пропущено. **По умолчанию:** `false`

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) При успешном завершении выполняется с `undefined`.

Асинхронно копирует всю структуру каталогов из `src` в `dest`, включая подкаталоги и файлы.

При копировании каталога в другой каталог глобы не поддерживаются, и поведение аналогично `cp dir1/ dir2/`.


### `fsPromises.glob(pattern[, options])` {#fspromisesglobpattern-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.2.0 | Добавлена поддержка `withFileTypes` в качестве опции. |
| v22.0.0 | Добавлено в: v22.0.0 |
:::

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) текущий рабочий каталог. **По умолчанию:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция для фильтрации файлов/директорий. Возвращает `true`, чтобы исключить элемент, `false`, чтобы включить его. **По умолчанию:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если glob должен возвращать пути как Dirent, `false` в противном случае. **По умолчанию:** `false`.


- Возвращает: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) AsyncIterator, который возвращает пути файлов, соответствующих шаблону.



::: code-group
```js [ESM]
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```js [CJS]
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```
:::

### `fsPromises.lchmod(path, mode)` {#fspromiseslchmodpath-mode}

**Устарело, начиная с версии: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Изменяет права доступа для символической ссылки.

Этот метод реализован только в macOS.


### `fsPromises.lchown(path, uid, gid)` {#fspromiseslchownpath-uid-gid}

::: info [История]
| Версия  | Изменения                                 |
| :------ | :---------------------------------------- |
| v10.6.0 | Этот API больше не является устаревшим. |
| v10.0.0 | Добавлено в: v10.0.0                       |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Разрешается с `undefined` при успехе.

Изменяет владельца символической ссылки.

### `fsPromises.lutimes(path, atime, mtime)` {#fspromiseslutimespath-atime-mtime}

**Добавлено в: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Разрешается с `undefined` при успехе.

Изменяет время доступа и изменения файла так же, как [`fsPromises.utimes()`](/ru/nodejs/api/fs#fspromisesutimespath-atime-mtime), с тем отличием, что если путь указывает на символическую ссылку, то ссылка не разыменовывается: вместо этого изменяются временные метки самой символической ссылки.


### `fsPromises.link(existingPath, newPath)` {#fspromiseslinkexistingpath-newpath}

**Добавлено в: v10.0.0**

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Исполняется с `undefined` при успехе.

Создаёт новую ссылку от `existingPath` к `newPath`.  Смотрите документацию POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) для получения более подробной информации.

### `fsPromises.lstat(path[, options])` {#fspromiseslstatpath-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.5.0 | Принимает дополнительный объект `options` для указания, должны ли возвращаемые числовые значения быть bigint. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть `bigint`. **По умолчанию:** `false`.
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с объектом [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для указанного символической ссылки `path`.

Эквивалентно [`fsPromises.stat()`](/ru/nodejs/api/fs#fspromisesstatpath-options), если `path` не является символической ссылкой, в этом случае возвращается информация о самой ссылке, а не о файле, на который она указывает. Обратитесь к документации POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2) для получения более подробной информации.


### `fsPromises.mkdir(path[, options])` {#fspromisesmkdirpath-options}

**Добавлено в версии: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Не поддерживается в Windows. **По умолчанию:** `0o777`.

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) В случае успеха разрешается значением `undefined`, если `recursive` имеет значение `false`, или путем первого созданного пути к каталогу, если `recursive` имеет значение `true`.

Асинхронно создает каталог.

Необязательный аргумент `options` может быть целым числом, определяющим `mode` (биты разрешений и sticky-биты), или объектом со свойством `mode` и свойством `recursive`, указывающим, следует ли создавать родительские каталоги. Вызов `fsPromises.mkdir()`, когда `path` является существующим каталогом, приводит к отклонению только тогда, когда `recursive` имеет значение false.

::: code-group
```js [ESM]
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```
:::


### `fsPromises.mkdtemp(prefix[, options])` {#fspromisesmkdtempprefix-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.6.0, v18.19.0 | Параметр `prefix` теперь принимает буферы и URL. |
| v16.5.0, v14.18.0 | Параметр `prefix` теперь принимает пустую строку. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется строкой, содержащей путь к файловой системе только что созданного временного каталога.

Создает уникальный временный каталог. Уникальное имя каталога генерируется путем добавления шести случайных символов в конец предоставленного `prefix`. Из-за несогласованности платформ избегайте завершающих символов `X` в `prefix`. Некоторые платформы, особенно BSD, могут возвращать более шести случайных символов и заменять завершающие символы `X` в `prefix` случайными символами.

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов для использования.

```js [ESM]
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```
Метод `fsPromises.mkdtemp()` добавит шесть случайно выбранных символов непосредственно к строке `prefix`. Например, если задан каталог `/tmp`, и намерение состоит в том, чтобы создать временный каталог *внутри* `/tmp`, `prefix` должен заканчиваться разделителем пути, специфичным для платформы (`require('node:path').sep`).


### `fsPromises.open(path, flags[, mode])` {#fspromisesopenpath-flags-mode}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.1.0 | Аргумент `flags` теперь является необязательным и по умолчанию имеет значение `'r'`. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Устанавливает режим файла (права доступа и sticky bits), если файл создается. **По умолчанию:** `0o666` (чтение и запись)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с объектом [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle).

Открывает [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle).

Для получения более подробной информации обратитесь к документации POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2).

Некоторые символы (`\< \> : " / \ | ? *`) зарезервированы в Windows, как описано в [Naming Files, Paths, and Namespaces](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). В NTFS, если имя файла содержит двоеточие, Node.js откроет поток файловой системы, как описано на [этой странице MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

### `fsPromises.opendir(path[, options])` {#fspromisesopendirpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Добавлена опция `recursive`. |
| v13.1.0, v12.16.0 | Введена опция `bufferSize`. |
| v12.12.0 | Добавлено в версии: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество записей каталога, которые буферизуются внутри при чтении из каталога. Более высокие значения приводят к лучшей производительности, но к большему использованию памяти. **По умолчанию:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Разрешенный `Dir` будет [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface), содержащим все подфайлы и каталоги. **По умолчанию:** `false`


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir).

Асинхронно открывает каталог для итеративного сканирования. Для получения более подробной информации обратитесь к документации POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Создает [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir), который содержит все дальнейшие функции для чтения и очистки каталога.

Опция `encoding` устанавливает кодировку для `path` при открытии каталога и последующих операциях чтения.

Пример использования асинхронной итерации:

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
При использовании асинхронного итератора объект [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir) будет автоматически закрыт после выхода итератора.


### `fsPromises.readdir(path[, options])` {#fspromisesreaddirpath-options}

::: info [История]
| Версия | Изменения |
|---|---|
| v20.1.0, v18.17.0 | Добавлена опция `recursive`. |
| v10.11.0 | Добавлена новая опция `withFileTypes`. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, читает содержимое каталога рекурсивно. В рекурсивном режиме будут перечислены все файлы, подфайлы и каталоги. **По умолчанию:** `false`.

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с массивом имен файлов в каталоге, исключая `'.'` и `'..'`.

Читает содержимое каталога.

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов, используемую для имен файлов. Если для `encoding` установлено значение `'buffer'`, возвращаемые имена файлов будут переданы как объекты [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если для `options.withFileTypes` установлено значение `true`, возвращаемый массив будет содержать объекты [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent).

```js [ESM]
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])` {#fspromisesreadfilepath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.2.0, v14.17.0 | Аргумент options может включать AbortSignal для прерывания текущего запроса readFile. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) имя файла или `FileHandle`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержка флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'r'`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать выполняющийся readFile


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Завершается с содержимым файла.

Асинхронно считывает все содержимое файла.

Если кодировка не указана (с использованием `options.encoding`), данные возвращаются в виде объекта [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer). В противном случае данные будут строкой.

Если `options` является строкой, то она указывает кодировку.

Когда `path` является каталогом, поведение `fsPromises.readFile()` зависит от платформы. В macOS, Linux и Windows промис будет отклонен с ошибкой. В FreeBSD будет возвращено представление содержимого каталога.

Пример чтения файла `package.json`, расположенного в том же каталоге, что и выполняемый код:

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```js [CJS]
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```
:::

Можно прервать текущий `readFile` с помощью [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal). Если запрос прерван, возвращенный промис отклоняется с `AbortError`:

```js [ESM]
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Прерываем запрос до того, как промис завершится.
  controller.abort();

  await promise;
} catch (err) {
  // Когда запрос прерван - err является AbortError
  console.error(err);
}
```
Прерывание текущего запроса не прерывает отдельные запросы операционной системы, а скорее внутреннюю буферизацию, выполняемую `fs.readFile`.

Любой указанный [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) должен поддерживать чтение.


### `fsPromises.readlink(path[, options])` {#fspromisesreadlinkpath-options}

**Добавлено в: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с `linkString` при успехе.

Читает содержимое символической ссылки, на которую указывает `path`. Подробности см. в документации POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2). Promise исполняется с `linkString` при успехе.

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов, используемую для возвращаемого пути ссылки. Если для `encoding` установлено значение `'buffer'`, возвращаемый путь ссылки будет передан как объект [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

### `fsPromises.realpath(path[, options])` {#fspromisesrealpathpath-options}

**Добавлено в: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с разрешенным путем при успехе.

Определяет фактическое местоположение `path`, используя ту же семантику, что и функция `fs.realpath.native()`.

Поддерживаются только пути, которые можно преобразовать в строки UTF8.

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов, используемую для пути. Если для `encoding` установлено значение `'buffer'`, возвращаемый путь будет передан как объект [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

В Linux, когда Node.js связан с musl libc, файловая система procfs должна быть смонтирована в `/proc`, чтобы эта функция работала. Glibc не имеет этого ограничения.


### `fsPromises.rename(oldPath, newPath)` {#fspromisesrenameoldpath-newpath}

**Добавлено в версии: v10.0.0**

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Переименовывает `oldPath` в `newPath`.

### `fsPromises.rmdir(path[, options])` {#fspromisesrmdirpath-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Использование `fsPromises.rmdir(path, { recursive: true })` на `path`, который является файлом, больше не разрешено и приводит к ошибке `ENOENT` в Windows и ошибке `ENOTDIR` в POSIX. |
| v16.0.0 | Использование `fsPromises.rmdir(path, { recursive: true })` на `path`, который не существует, больше не разрешено и приводит к ошибке `ENOENT`. |
| v16.0.0 | Опция `recursive` устарела, ее использование вызывает предупреждение об устаревании. |
| v14.14.0 | Опция `recursive` устарела, используйте вместо нее `fsPromises.rm`. |
| v13.3.0, v12.16.0 | Опция `maxBusyTries` переименована в `maxRetries`, и ее значение по умолчанию равно 0. Опция `emfileWait` была удалена, и ошибки `EMFILE` используют ту же логику повторных попыток, что и другие ошибки. Теперь поддерживается опция `retryDelay`. Теперь повторяются ошибки `ENFILE`. |
| v12.10.0 | Теперь поддерживаются опции `recursive`, `maxBusyTries` и `emfileWait`. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если встречается ошибка `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` или `EPERM`, Node.js повторяет операцию с линейной экспоненциальной задержкой, увеличивающейся на `retryDelay` миллисекунд при каждой попытке. Эта опция представляет количество повторных попыток. Эта опция игнорируется, если опция `recursive` не равна `true`. **По умолчанию:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, выполнить рекурсивное удаление каталога. В рекурсивном режиме операции повторяются при сбое. **По умолчанию:** `false`. **Устарело.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество времени в миллисекундах для ожидания между повторными попытками. Эта опция игнорируется, если опция `recursive` не равна `true`. **По умолчанию:** `100`.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Удаляет каталог, идентифицированный по `path`.

Использование `fsPromises.rmdir()` для файла (а не каталога) приводит к отклонению promise с ошибкой `ENOENT` в Windows и ошибкой `ENOTDIR` в POSIX.

Чтобы получить поведение, аналогичное команде Unix `rm -rf`, используйте [`fsPromises.rm()`](/ru/nodejs/api/fs#fspromisesrmpath-options) с опциями `{ recursive: true, force: true }`.


### `fsPromises.rm(path[, options])` {#fspromisesrmpath-options}

**Добавлено в: v14.14.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, исключения будут игнорироваться, если `path` не существует. **По умолчанию:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если возникает ошибка `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` или `EPERM`, Node.js будет повторять операцию с линейной задержкой, увеличивающейся на `retryDelay` миллисекунд при каждой попытке. Эта опция представляет количество повторных попыток. Эта опция игнорируется, если опция `recursive` не равна `true`. **По умолчанию:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, выполнить рекурсивное удаление каталога. В рекурсивном режиме операции повторяются при сбое. **По умолчанию:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество времени в миллисекундах для ожидания между повторными попытками. Эта опция игнорируется, если опция `recursive` не равна `true`. **По умолчанию:** `100`.
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Удаляет файлы и каталоги (по образцу стандартной утилиты POSIX `rm`).

### `fsPromises.stat(path[, options])` {#fspromisesstatpath-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.5.0 | Принимает дополнительный объект `options`, чтобы указать, следует ли возвращаемые числовые значения интерпретировать как bigint. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть `bigint`. **По умолчанию:** `false`.
  
 
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  Разрешается с объектом [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для данного `path`.


### `fsPromises.statfs(path[, options])` {#fspromisesstatfspath-options}

**Добавлено в версии: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Определяет, должны ли числовые значения в возвращаемом объекте [\<fs.StatFs\>](/ru/nodejs/api/fs#class-fsstatfs) быть `bigint`. **По умолчанию:** `false`.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с объектом [\<fs.StatFs\>](/ru/nodejs/api/fs#class-fsstatfs) для заданного `path`.

### `fsPromises.symlink(target, path[, type])` {#fspromisessymlinktarget-path-type}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Если аргумент `type` равен `null` или опущен, Node.js автоматически определит тип `target` и автоматически выберет `dir` или `file`. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с `undefined` в случае успеха.

Создает символическую ссылку.

Аргумент `type` используется только на платформах Windows и может быть одним из `'dir'`, `'file'` или `'junction'`. Если аргумент `type` равен `null`, Node.js автоматически определит тип `target` и использует `'file'` или `'dir'`. Если `target` не существует, будет использоваться `'file'`. Точки соединения Windows требуют, чтобы путь назначения был абсолютным. При использовании `'junction'` аргумент `target` будет автоматически нормализован до абсолютного пути. Точки соединения на томах NTFS могут указывать только на каталоги.


### `fsPromises.truncate(path[, len])` {#fspromisestruncatepath-len}

**Добавлено в: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Усекает (сокращает или увеличивает длину) содержимого по `path` до `len` байт.

### `fsPromises.unlink(path)` {#fspromisesunlinkpath}

**Добавлено в: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Если `path` относится к символической ссылке, то ссылка удаляется, не затрагивая файл или каталог, на который эта ссылка указывает. Если `path` относится к файловому пути, который не является символической ссылкой, файл удаляется. Подробности см. в документации POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2).

### `fsPromises.utimes(path, atime, mtime)` {#fspromisesutimespath-atime-mtime}

**Добавлено в: v10.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с `undefined` при успехе.

Изменяет временные метки файловой системы объекта, на который ссылается `path`.

Аргументы `atime` и `mtime` подчиняются следующим правилам:

- Значения могут быть либо числами, представляющими время Unix epoch, либо `Date`, либо числовой строкой, например `'123456789.0'`.
- Если значение не может быть преобразовано в число или является `NaN`, `Infinity` или `-Infinity`, будет выброшена `Error`.


### `fsPromises.watch(filename[, options])` {#fspromiseswatchfilename-options}

**Добавлено в: v15.9.0, v14.18.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должен ли процесс продолжать выполняться до тех пор, пока отслеживаются файлы. **По умолчанию:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, следует ли отслеживать все подкаталоги или только текущий каталог. Применяется, когда указан каталог, и только на поддерживаемых платформах (см. [предостережения](/ru/nodejs/api/fs#caveats)). **По умолчанию:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает кодировку символов, используемую для имени файла, переданного слушателю. **По умолчанию:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal), используемый для сигнализации о том, когда следует остановить наблюдатель.
  
 
- Возвращает: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) объектов со свойствами:
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип изменения
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Имя измененного файла.
  
 

Возвращает асинхронный итератор, который отслеживает изменения в `filename`, где `filename` — это либо файл, либо каталог.

```js [ESM]
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```
На большинстве платформ `'rename'` выдается всякий раз, когда имя файла появляется или исчезает в каталоге.

Все [предостережения](/ru/nodejs/api/fs#caveats) для `fs.watch()` также применимы к `fsPromises.watch()`.


### `fsPromises.writeFile(file, data[, options])` {#fspromiseswritefilefile-data-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v15.14.0, v14.18.0 | Аргумент `data` поддерживает `AsyncIterable`, `Iterable` и `Stream`. |
| v15.2.0, v14.17.0 | Аргумент options может включать AbortSignal для прерывания текущего запроса writeFile. |
| v14.0.0 | Параметр `data` больше не будет приводить неподдерживаемые входные данные к строкам. |
| v10.0.0 | Добавлено в версии: v10.0.0 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) имя файла или `FileHandle`
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) | [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) | [\<Stream\>](/ru/nodejs/api/stream#stream)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если все данные успешно записаны в файл и `flush` имеет значение `true`, то для сброса данных используется `filehandle.sync()`. **По умолчанию:** `false`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать выполняющуюся операцию writeFile


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Исполняется с `undefined` при успехе.

Асинхронно записывает данные в файл, заменяя файл, если он уже существует. `data` может быть строкой, буфером, объектом [\<AsyncIterable\>](https://tc39.github.io/ecma262/#sec-asynciterable-interface) или [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol).

Опция `encoding` игнорируется, если `data` является буфером.

Если `options` является строкой, то она задает кодировку.

Опция `mode` влияет только на вновь созданный файл. Подробнее см. [`fs.open()`](/ru/nodejs/api/fs#fsopenpath-flags-mode-callback).

Любой указанный [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) должен поддерживать запись.

Опасно использовать `fsPromises.writeFile()` несколько раз для одного и того же файла, не дожидаясь завершения promise.

Аналогично `fsPromises.readFile` - `fsPromises.writeFile` - это удобный метод, который выполняет несколько вызовов `write` внутри для записи переданного ему буфера. Для кода, критичного к производительности, рассмотрите возможность использования [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options) или [`filehandle.createWriteStream()`](/ru/nodejs/api/fs#filehandlecreatewritestreamoptions).

Можно использовать [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) для отмены `fsPromises.writeFile()`. Отмена выполняется "насколько это возможно", и некоторое количество данных, вероятно, все равно будет записано.

```js [ESM]
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Прервать запрос до завершения promise.
  controller.abort();

  await promise;
} catch (err) {
  // Когда запрос прерывается - err - это AbortError
  console.error(err);
}
```
Прерывание текущего запроса не прерывает отдельные запросы операционной системы, а скорее внутреннюю буферизацию, которую выполняет `fs.writeFile`.


### `fsPromises.constants` {#fspromisesconstants}

**Добавлено в версии: v18.4.0, v16.17.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает объект, содержащий часто используемые константы для операций с файловой системой. Объект такой же, как и `fs.constants`. Смотрите [Константы FS](/ru/nodejs/api/fs#fs-constants) для получения более подробной информации.

## Callback API {#callback-api}

API на основе обратных вызовов выполняют все операции асинхронно, не блокируя цикл событий, а затем вызывают функцию обратного вызова по завершении или при возникновении ошибки.

API на основе обратных вызовов используют базовый пул потоков Node.js для выполнения операций с файловой системой вне потока цикла событий. Эти операции не синхронизированы и не являются потокобезопасными. Необходимо соблюдать осторожность при выполнении нескольких одновременных изменений одного и того же файла, иначе может произойти повреждение данных.

### `fs.access(path[, mode], callback)` {#fsaccesspath-mode-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.8.0 | Константы `fs.F_OK`, `fs.R_OK`, `fs.W_OK` и `fs.X_OK`, которые присутствовали непосредственно в `fs`, устарели. |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v6.3.0 | Константы, такие как `fs.R_OK` и т. д., которые присутствовали непосредственно в `fs`, были перемещены в `fs.constants` в качестве мягкого устаревания. Таким образом, для Node.js `\< v6.3.0` используйте `fs` для доступа к этим константам или сделайте что-то вроде `(fs.constants || fs).R_OK`, чтобы работать со всеми версиями. |
| v0.11.15 | Добавлено в версии: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `fs.constants.F_OK`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Проверяет разрешения пользователя для файла или каталога, указанного в `path`. Аргумент `mode` является необязательным целым числом, которое определяет проверки доступности, которые должны быть выполнены. `mode` должен быть либо значением `fs.constants.F_OK`, либо маской, состоящей из побитового ИЛИ любого из `fs.constants.R_OK`, `fs.constants.W_OK` и `fs.constants.X_OK` (например, `fs.constants.W_OK | fs.constants.R_OK`). См. [Константы доступа к файлам](/ru/nodejs/api/fs#file-access-constants) для возможных значений `mode`.

Последний аргумент, `callback`, — это функция обратного вызова, которая вызывается с возможным аргументом ошибки. Если какая-либо из проверок доступности не удалась, аргументом ошибки будет объект `Error`. Следующие примеры проверяют, существует ли `package.json`, и можно ли его читать или записывать.

```js [ESM]
import { access, constants } from 'node:fs';

const file = 'package.json';

// Проверка существования файла в текущем каталоге.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'не существует' : 'существует'}`);
});

// Проверка возможности чтения файла.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'не может быть прочитан' : 'может быть прочитан'}`);
});

// Проверка возможности записи файла.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'не доступен для записи' : 'доступен для записи'}`);
});

// Проверка возможности чтения и записи файла.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'не является' : 'является'} читаемым и доступным для записи`);
});
```
Не используйте `fs.access()` для проверки доступности файла перед вызовом `fs.open()`, `fs.readFile()` или `fs.writeFile()`. Это создаст состояние гонки, поскольку другие процессы могут изменить состояние файла между двумя вызовами. Вместо этого пользовательский код должен открывать/читать/записывать файл напрямую и обрабатывать ошибку, возникающую, если файл недоступен.

**запись (НЕ РЕКОМЕНДУЕТСЯ)**

```js [ESM]
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile уже существует');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**запись (РЕКОМЕНДУЕТСЯ)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile уже существует');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**чтение (НЕ РЕКОМЕНДУЕТСЯ)**

```js [ESM]
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile не существует');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```
**чтение (РЕКОМЕНДУЕТСЯ)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile не существует');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Примеры "не рекомендуется" выше проверяют доступность, а затем используют файл; примеры "рекомендуется" лучше, потому что они используют файл напрямую и обрабатывают ошибку, если она есть.

В общем, проверяйте доступность файла только в том случае, если файл не будет использоваться напрямую, например, когда его доступность является сигналом от другого процесса.

В Windows политики контроля доступа (ACL) в каталоге могут ограничивать доступ к файлу или каталогу. Однако функция `fs.access()` не проверяет ACL и поэтому может сообщить, что путь доступен, даже если ACL запрещает пользователю чтение или запись в него.


### `fs.appendFile(path, data[, options], callback)` {#fsappendfilepath-data-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.1.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выброшена ошибка `TypeError`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v7.0.0 | Переданный объект `options` никогда не будет изменен. |
| v5.0.0 | Параметр `file` теперь может быть файловым дескриптором. |
| v0.6.7 | Добавлено в версии: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) имя файла или файловый дескриптор
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, базовый файловый дескриптор сбрасывается перед его закрытием. **По умолчанию:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Асинхронно добавляет данные в файл, создавая файл, если он еще не существует. `data` может быть строкой или [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Параметр `mode` влияет только на вновь созданный файл. Подробнее см. в [`fs.open()`](/ru/nodejs/api/fs#fsopenpath-flags-mode-callback).

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```
Если `options` является строкой, то она определяет кодировку:

```js [ESM]
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```
`path` может быть указан как числовой файловый дескриптор, который был открыт для добавления (с использованием `fs.open()` или `fs.openSync()`). Файловый дескриптор не будет закрыт автоматически.

```js [ESM]
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)` {#fschmodpath-mode-callback}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет ошибку `TypeError` во время выполнения. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет предупреждение об устаревании с идентификатором DEP0013. |
| v0.1.30 | Добавлено в: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Асинхронно изменяет разрешения файла. В функцию обратного вызова завершения не передаются никакие аргументы, кроме возможного исключения.

Дополнительные сведения см. в документации POSIX [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

```js [ESM]
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('Разрешения для файла "my_file.txt" были изменены!');
});
```

#### Режимы файла {#file-modes}

Аргумент `mode`, используемый как в методах `fs.chmod()`, так и в `fs.chmodSync()`, представляет собой числовую битовую маску, созданную с использованием логического ИЛИ следующих констант:

| Константа | Восьмеричное значение | Описание |
| --- | --- | --- |
| `fs.constants.S_IRUSR` | `0o400` | чтение владельцем |
| `fs.constants.S_IWUSR` | `0o200` | запись владельцем |
| `fs.constants.S_IXUSR` | `0o100` | выполнение/поиск владельцем |
| `fs.constants.S_IRGRP` | `0o40` | чтение группой |
| `fs.constants.S_IWGRP` | `0o20` | запись группой |
| `fs.constants.S_IXGRP` | `0o10` | выполнение/поиск группой |
| `fs.constants.S_IROTH` | `0o4` | чтение другими |
| `fs.constants.S_IWOTH` | `0o2` | запись другими |
| `fs.constants.S_IXOTH` | `0o1` | выполнение/поиск другими |

Более простой способ построения `mode` - использовать последовательность из трех восьмеричных цифр (например, `765`). Самая левая цифра (`7` в примере) указывает разрешения для владельца файла. Средняя цифра (`6` в примере) указывает разрешения для группы. Самая правая цифра (`5` в примере) указывает разрешения для других.

| Число | Описание |
| --- | --- |
| `7` | чтение, запись и выполнение |
| `6` | чтение и запись |
| `5` | чтение и выполнение |
| `4` | только чтение |
| `3` | запись и выполнение |
| `2` | только запись |
| `1` | только выполнение |
| `0` | нет разрешений |

Например, восьмеричное значение `0o765` означает:

- Владелец может читать, записывать и выполнять файл.
- Группа может читать и записывать файл.
- Другие могут читать и выполнять файл.

При использовании необработанных чисел там, где ожидаются режимы файлов, любое значение, превышающее `0o777`, может привести к зависящему от платформы поведению, которое не поддерживается для последовательной работы. Поэтому такие константы, как `S_ISVTX`, `S_ISGID` или `S_ISUID`, не представлены в `fs.constants`.

Предостережения: в Windows можно изменить только разрешение на запись, и различие между разрешениями группы, владельца или других не реализовано.


### `fs.chown(path, uid, gid, callback)` {#fschownpath-uid-gid-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача неверного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к возникновению `TypeError` во время выполнения. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к появлению предупреждения об устаревании с идентификатором DEP0013. |
| v0.1.97 | Добавлено в: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Асинхронно изменяет владельца и группу файла. В качестве обратного вызова завершения не передаются никакие аргументы, кроме возможного исключения.

Для получения более подробной информации см. документацию POSIX [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

### `fs.close(fd[, callback])` {#fsclosefd-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача неверного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v15.9.0, v14.17.0 | Теперь используется обратный вызов по умолчанию, если он не предоставлен. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к возникновению `TypeError` во время выполнения. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к появлению предупреждения об устаревании с идентификатором DEP0013. |
| v0.0.2 | Добавлено в: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Закрывает файловый дескриптор. В качестве обратного вызова завершения не передаются никакие аргументы, кроме возможного исключения.

Вызов `fs.close()` для любого файлового дескриптора (`fd`), который в настоящее время используется через любую другую операцию `fs`, может привести к неопределенному поведению.

Для получения более подробной информации см. документацию POSIX [`close(2)`](http://man7.org/linux/man-pages/man2/close.2).


### `fs.copyFile(src, dest[, mode], callback)` {#fscopyfilesrc-dest-mode-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимого обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Аргумент `flags` изменен на `mode` и введены более строгие проверки типов. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) исходный файл для копирования
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) целевой файл для операции копирования
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) модификаторы для операции копирования. **По умолчанию:** `0`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Асинхронно копирует `src` в `dest`. По умолчанию, `dest` перезаписывается, если он уже существует. Функция обратного вызова не получает никаких аргументов, кроме возможного исключения. Node.js не дает никаких гарантий относительно атомарности операции копирования. Если после открытия целевого файла для записи произошла ошибка, Node.js попытается удалить целевой файл.

`mode` — это необязательное целое число, которое определяет поведение операции копирования. Можно создать маску, состоящую из побитового ИЛИ двух или более значений (например, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: Операция копирования завершится неудачей, если `dest` уже существует.
- `fs.constants.COPYFILE_FICLONE`: Операция копирования попытается создать reflink copy-on-write. Если платформа не поддерживает copy-on-write, то используется резервный механизм копирования.
- `fs.constants.COPYFILE_FICLONE_FORCE`: Операция копирования попытается создать reflink copy-on-write. Если платформа не поддерживает copy-on-write, то операция завершится неудачей.

```js [ESM]
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt будет создан или перезаписан по умолчанию.
copyFile('source.txt', 'destination.txt', callback);

// При использовании COPYFILE_EXCL операция завершится неудачей, если destination.txt существует.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)` {#fscpsrc-dest-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.3.0 | Этот API больше не является экспериментальным. |
| v20.1.0, v18.17.0 | Принимает дополнительную опцию `mode` для указания поведения копирования, как аргумент `mode` в `fs.copyFile()`. |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v17.6.0, v16.15.0 | Принимает дополнительную опцию `verbatimSymlinks` для указания, следует ли выполнять разрешение пути для символических ссылок. |
| v16.7.0 | Добавлено в: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) исходный путь для копирования.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) путь назначения для копирования.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) разыменовывать символические ссылки. **По умолчанию:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) когда `force` имеет значение `false`, и место назначения существует, выдавать ошибку. **По умолчанию:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция для фильтрации копируемых файлов/директорий. Верните `true`, чтобы скопировать элемент, `false`, чтобы проигнорировать его. При игнорировании каталога все его содержимое также будет пропущено. Также может вернуть `Promise`, который разрешается в `true` или `false`. **По умолчанию:** `undefined`.
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) исходный путь для копирования.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) путь назначения для копирования.
    - Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Значение, которое может быть приведено к `boolean`, или `Promise`, который разрешается с таким значением.

    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) перезаписывать существующий файл или каталог. Операция копирования будет игнорировать ошибки, если вы установите для этого значения false, а место назначения существует. Используйте опцию `errorOnExist`, чтобы изменить это поведение. **По умолчанию:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) модификаторы для операции копирования. **По умолчанию:** `0`. См. флаг `mode` в [`fs.copyFile()`](/ru/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, временные метки из `src` будут сохранены. **По умолчанию:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) рекурсивно копировать каталоги **По умолчанию:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, разрешение пути для символических ссылок будет пропущено. **По умолчанию:** `false`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Асинхронно копирует всю структуру каталогов из `src` в `dest`, включая подкаталоги и файлы.

При копировании каталога в другой каталог глобы не поддерживаются, и поведение аналогично `cp dir1/ dir2/`.


### `fs.createReadStream(path[, options])` {#fscreatereadstreampath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.10.0 | Опция `fs` не требует метода `open`, если был предоставлен `fd`. |
| v16.10.0 | Опция `fs` не требует метода `close`, если `autoClose` имеет значение `false`. |
| v15.5.0 | Добавлена поддержка `AbortSignal`. |
| v15.4.0 | Опция `fd` принимает аргументы FileHandle. |
| v14.0.0 | Изменено значение `emitClose` по умолчанию на `true`. |
| v13.6.0, v12.17.0 | Опции `fs` позволяют переопределять используемую реализацию `fs`. |
| v12.10.0 | Включена опция `emitClose`. |
| v11.0.0 | Введены новые ограничения на `start` и `end`, вызывающие более подходящие ошибки в случаях, когда мы не можем разумно обработать входные значения. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Переданный объект `options` никогда не будет изменен. |
| v2.3.0 | Переданный объект `options` теперь может быть строкой. |
| v0.1.31 | Добавлено в: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'r'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `null`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) **По умолчанию:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `Infinity`
    - `highWaterMark` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `64 * 1024`
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`

- Возвращает: [\<fs.ReadStream\>](/ru/nodejs/api/fs#class-fsreadstream)

`options` может включать значения `start` и `end` для чтения диапазона байтов из файла вместо всего файла. И `start`, и `end` включены и начинают отсчет с 0, допустимые значения находятся в диапазоне [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Если указан `fd`, а `start` опущен или имеет значение `undefined`, `fs.createReadStream()` читает последовательно с текущей позиции файла. `encoding` может быть любым из тех, которые принимаются [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если указан `fd`, `ReadStream` будет игнорировать аргумент `path` и использовать указанный файловый дескриптор. Это означает, что событие `'open'` не будет сгенерировано. `fd` должен быть блокирующим; неблокирующие `fd` следует передавать в [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

Если `fd` указывает на символьное устройство, которое поддерживает только блокирующие операции чтения (например, клавиатура или звуковая карта), операции чтения не завершаются до тех пор, пока не появятся данные. Это может помешать процессу завершиться и потоку закрыться естественным образом.

По умолчанию поток будет генерировать событие `'close'` после того, как он будет уничтожен. Установите для опции `emitClose` значение `false`, чтобы изменить это поведение.

Предоставляя опцию `fs`, можно переопределить соответствующие реализации `fs` для `open`, `read` и `close`. При предоставлении опции `fs` требуется переопределение для `read`. Если `fd` не указан, также требуется переопределение для `open`. Если `autoClose` имеет значение `true`, также требуется переопределение для `close`.

```js [ESM]
import { createReadStream } from 'node:fs';

// Создаем поток из некоторого символьного устройства.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // Это может не закрыть поток.
  // Искусственное указание конца потока, как если бы базовый ресурс
  // сам указал конец файла, позволяет потоку закрыться.
  // Это не отменяет ожидающие операции чтения, и если такая операция
  // есть, процесс все равно может не выйти успешно
  // до тех пор, пока она не завершится.
  stream.push(null);
  stream.read(0);
}, 100);
```
Если `autoClose` имеет значение false, то файловый дескриптор не будет закрыт, даже если произойдет ошибка. Ответственность за его закрытие и обеспечение отсутствия утечки файловых дескрипторов лежит на приложении. Если `autoClose` установлено в true (поведение по умолчанию), при `'error'` или `'end'` файловый дескриптор будет закрыт автоматически.

`mode` устанавливает режим файла (права доступа и sticky bits), но только если файл был создан.

Пример чтения последних 10 байтов файла длиной 100 байтов:

```js [ESM]
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```
Если `options` является строкой, то она указывает кодировку.


### `fs.createWriteStream(path[, options])` {#fscreatewritestreampath-options}

::: info [История]
| Версия | Изменения |
|---|---|
| v21.0.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v16.10.0 | Опции `fs` не требуется метод `open`, если был предоставлен `fd`. |
| v16.10.0 | Опции `fs` не требуется метод `close`, если `autoClose` имеет значение `false`. |
| v15.5.0 | Добавлена поддержка `AbortSignal`. |
| v15.4.0 | Опция `fd` принимает аргументы FileHandle. |
| v14.0.0 | Изменено значение по умолчанию для `emitClose` на `true`. |
| v13.6.0, v12.17.0 | Параметры `fs` позволяют переопределять используемую реализацию `fs`. |
| v12.10.0 | Включена опция `emitClose`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Переданный объект `options` никогда не будет изменен. |
| v5.5.0 | Теперь поддерживается опция `autoClose`. |
| v2.3.0 | Переданный объект `options` теперь может быть строкой. |
| v0.1.31 | Добавлено в версии: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержку `flags` файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'w'`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) **По умолчанию:** `null`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
    - `autoClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `emitClose` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `fs` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
    - `highWaterMark` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `16384`
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, дескриптор базового файла сбрасывается перед его закрытием. **По умолчанию:** `false`.


- Возвращает: [\<fs.WriteStream\>](/ru/nodejs/api/fs#class-fswritestream)

`options` также может включать опцию `start`, позволяющую записывать данные в некоторой позиции после начала файла, допустимые значения находятся в диапазоне [0, [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)]. Для изменения файла, а не его замены, может потребоваться установить для параметра `flags` значение `r+`, а не значение по умолчанию `w`. `encoding` может быть любым из тех, которые принимает [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если для `autoClose` установлено значение true (поведение по умолчанию), то при возникновении `'error'` или `'finish'` файловый дескриптор будет автоматически закрыт. Если `autoClose` имеет значение false, то файловый дескриптор не будет закрыт, даже если произошла ошибка. Ответственность за его закрытие и отсутствие утечки файлового дескриптора лежит на приложении.

По умолчанию поток будет генерировать событие `'close'` после его уничтожения. Установите для параметра `emitClose` значение `false`, чтобы изменить это поведение.

Предоставляя опцию `fs`, можно переопределить соответствующие реализации `fs` для `open`, `write`, `writev` и `close`. Переопределение `write()` без `writev()` может снизить производительность, поскольку некоторые оптимизации (`_writev()`) будут отключены. При предоставлении опции `fs` требуются переопределения как минимум для одного из `write` и `writev`. Если не предоставлена опция `fd`, также требуется переопределение для `open`. Если `autoClose` имеет значение `true`, также требуется переопределение для `close`.

Подобно [\<fs.ReadStream\>](/ru/nodejs/api/fs#class-fsreadstream), если указан `fd`, то [\<fs.WriteStream\>](/ru/nodejs/api/fs#class-fswritestream) будет игнорировать аргумент `path` и будет использовать указанный файловый дескриптор. Это означает, что событие `'open'` не будет сгенерировано. `fd` должен быть блокирующим; неблокирующие `fd` должны быть переданы в [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket).

Если `options` является строкой, то она определяет кодировку.


### `fs.exists(path, callback)` {#fsexistspath-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v1.0.0 | Устарело с версии: v1.0.0 |
| v0.0.2 | Добавлено в версии: v0.0.2 |
:::

::: danger [Стабильность: 0 - Устаревший]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устаревший: Используйте [`fs.stat()`](/ru/nodejs/api/fs#fsstatpath-options-callback) или [`fs.access()`](/ru/nodejs/api/fs#fsaccesspath-mode-callback) вместо этого.
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `exists` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 

Проверьте, существует ли элемент по заданному `path`, проверив файловую систему. Затем вызовите аргумент `callback` с true или false:

```js [ESM]
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'он существует' : 'нет passwd!');
});
```
**Параметры для этого обратного вызова не согласуются с другими обратными вызовами Node.js.** Обычно первым параметром для обратного вызова Node.js является параметр `err`, за которым, необязательно, следуют другие параметры. Обратный вызов `fs.exists()` имеет только один логический параметр. Это одна из причин, по которой `fs.access()` рекомендуется вместо `fs.exists()`.

Если `path` является символической ссылкой, он переходит по ней. Таким образом, если `path` существует, но указывает на несуществующий элемент, обратный вызов получит значение `false`.

Не рекомендуется использовать `fs.exists()` для проверки существования файла перед вызовом `fs.open()`, `fs.readFile()` или `fs.writeFile()`. Это приводит к возникновению состояния гонки, поскольку другие процессы могут изменить состояние файла между двумя вызовами. Вместо этого пользовательский код должен открывать/читать/записывать файл напрямую и обрабатывать ошибку, возникающую, если файл не существует.

**запись (НЕ РЕКОМЕНДУЕТСЯ)**

```js [ESM]
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile уже существует');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```
**запись (РЕКОМЕНДУЕТСЯ)**

```js [ESM]
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile уже существует');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
**чтение (НЕ РЕКОМЕНДУЕТСЯ)**

```js [ESM]
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile не существует');
  }
});
```
**чтение (РЕКОМЕНДУЕТСЯ)**

```js [ESM]
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile не существует');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```
Примеры "не рекомендуется" выше проверяют существование, а затем используют файл; примеры "рекомендуется" лучше, потому что они используют файл напрямую и обрабатывают ошибку, если она есть.

В общем, проверяйте существование файла только в том случае, если файл не будет использоваться напрямую, например, когда его существование является сигналом от другого процесса.


### `fs.fchmod(fd, mode, callback)` {#fsfchmodfd-mode-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимой функции обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, во время выполнения будет выброшена ошибка `TypeError`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.4.7 | Добавлено в версии: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Устанавливает права доступа к файлу. В функцию обратного вызова завершения не передаются никакие аргументы, кроме возможного исключения.

Подробности см. в документации POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2).

### `fs.fchown(fd, uid, gid, callback)` {#fsfchownfd-uid-gid-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недопустимой функции обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, во время выполнения будет выброшена ошибка `TypeError`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.4.7 | Добавлено в версии: v0.4.7 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Устанавливает владельца файла. В функцию обратного вызова завершения не передаются никакие аргументы, кроме возможного исключения.

Подробности см. в документации POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2).


### `fs.fdatasync(fd, callback)` {#fsfdatasyncfd-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача неверной обратной функции в аргументе `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет `TypeError` во время выполнения. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет предупреждение об устаревании с идентификатором DEP0013. |
| v0.1.96 | Добавлено в: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

 

Принудительно переводит все текущие операции ввода-вывода, связанные с файлом, в синхронизированное состояние завершения ввода-вывода операционной системы. Подробности см. в документации POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2). Обратной функции завершения не передаются аргументы, кроме возможного исключения.

### `fs.fstat(fd[, options], callback)` {#fsfstatfd-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача неверной обратной функции в аргументе `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Принимает дополнительный объект `options`, чтобы указать, должны ли возвращаемые числовые значения быть bigint. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет `TypeError` во время выполнения. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет предупреждение об устаревании с идентификатором DEP0013. |
| v0.1.95 | Добавлено в: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть `bigint`. **По умолчанию:** `false`.

 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats)

 

Вызывает обратный вызов с [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для файлового дескриптора.

Дополнительные сведения см. в документации POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2).


### `fs.fsync(fd, callback)` {#fsfsyncfd-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выброшена ошибка `TypeError`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.1.96 | Добавлено в версии: v0.1.96 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Запрашивает сброс всех данных для открытого файлового дескриптора на устройство хранения. Конкретная реализация зависит от операционной системы и устройства. Обратитесь к документации POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2) для получения более подробной информации. Обратному вызову завершения не передаются никакие аргументы, кроме возможного исключения.

### `fs.ftruncate(fd[, len], callback)` {#fsftruncatefd-len-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выброшена ошибка `TypeError`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.8.6 | Добавлено в версии: v0.8.6 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Усекает файловый дескриптор. Обратному вызову завершения не передаются никакие аргументы, кроме возможного исключения.

См. документацию POSIX [`ftruncate(2)`](http://man7.org/linux/man-pages/man2/ftruncate.2) для получения более подробной информации.

Если файл, на который ссылается файловый дескриптор, был больше, чем `len` байт, в файле будут сохранены только первые `len` байт.

Например, следующая программа сохраняет только первые четыре байта файла:

```js [ESM]
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```
Если файл ранее был короче, чем `len` байт, он расширяется, и расширенная часть заполняется нулевыми байтами (`'\0'`):

Если `len` отрицательное, то будет использоваться `0`.


### `fs.futimes(fd, atime, mtime, callback)` {#fsfutimesfd-atime-mtime-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выдана ошибка `TypeError`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v4.1.0 | Числовые строки, `NaN` и `Infinity` теперь допустимые спецификаторы времени. |
| v0.4.2 | Добавлено в версии: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Изменяет временные метки файловой системы объекта, на который ссылается предоставленный файловый дескриптор. См. [`fs.utimes()`](/ru/nodejs/api/fs#fsutimespath-atime-mtime-callback).

### `fs.glob(pattern[, options], callback)` {#fsglobpattern-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.2.0 | Добавлена поддержка `withFileTypes` в качестве опции. |
| v22.0.0 | Добавлено в версии: v22.0.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

-  `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) текущий рабочий каталог. **По умолчанию:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция для фильтрации файлов/каталогов. Верните `true`, чтобы исключить элемент, `false`, чтобы включить его. **По умолчанию:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если glob должен возвращать пути в виде Dirents, `false` в противном случае. **По умолчанию:** `false`.


-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


-  Извлекает файлы, соответствующие указанному шаблону.

::: code-group
```js [ESM]
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```js [CJS]
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```
:::


### `fs.lchmod(path, mode, callback)` {#fslchmodpath-mode-callback}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Возвращаемая ошибка может быть `AggregateError`, если возвращается более одной ошибки. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет `TypeError` во время выполнения. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к появлению предупреждения об устаревании с идентификатором DEP0013. |
| v0.4.7 | Устарело с: v0.4.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

Изменяет права доступа к символической ссылке. В функцию обратного вызова завершения не передаются никакие аргументы, кроме возможного исключения.

Этот метод реализован только в macOS.

Подробнее см. в документации POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2).

### `fs.lchown(path, uid, gid, callback)` {#fslchownpath-uid-gid-callback}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.6.0 | Этот API больше не является устаревшим. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет `TypeError` во время выполнения. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к появлению предупреждения об устаревании с идентификатором DEP0013. |
| v0.4.7 | Только документальное устаревание. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Устанавливает владельца символической ссылки. В функцию обратного вызова завершения не передаются никакие аргументы, кроме возможного исключения.

Подробнее см. в документации POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2).


### `fs.lutimes(path, atime, mtime, callback)` {#fslutimespath-atime-mtime-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного колбэка аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v14.5.0, v12.19.0 | Добавлено в: v14.5.0, v12.19.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Изменяет время доступа и модификации файла так же, как и [`fs.utimes()`](/ru/nodejs/api/fs#fsutimespath-atime-mtime-callback), с той разницей, что если путь указывает на символическую ссылку, то ссылка не разыменовывается: вместо этого изменяются временные метки самой символической ссылки.

Функция обратного вызова завершения не получает никаких аргументов, кроме возможного исключения.

### `fs.link(existingPath, newPath, callback)` {#fslinkexistingpath-newpath-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного колбэка аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, во время выполнения будет выброшена ошибка `TypeError`. |
| v7.6.0 | Параметры `existingPath` и `newPath` могут быть объектами WHATWG `URL`, использующими протокол `file:`. Поддержка в настоящее время все еще является *экспериментальной*. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.1.31 | Добавлено в: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Создает новую ссылку из `existingPath` в `newPath`. Смотрите документацию POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2) для получения более подробной информации. Функция обратного вызова завершения не получает никаких аргументов, кроме возможного исключения.


### `fs.lstat(path[, options], callback)` {#fslstatpath-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Принимает дополнительный объект `options` для указания того, должны ли возвращаемые числовые значения быть типа bigint. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет ошибку `TypeError` во время выполнения. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет предупреждение об устаревании с идентификатором DEP0013. |
| v0.1.30 | Добавлено в: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Определяет, должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть типа `bigint`. **По умолчанию:** `false`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats)

Получает [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для символической ссылки, на которую указывает путь. Обратный вызов получает два аргумента `(err, stats)`, где `stats` — это объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats). `lstat()` идентичен `stat()`, за исключением того, что если `path` является символической ссылкой, то выполняется stat для самой ссылки, а не для файла, на который она указывает.

Подробности см. в документации POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2).


### `fs.mkdir(path[, options], callback)` {#fsmkdirpath-options-callback}

::: info [История]
| Версия  | Изменения                                                                                                                  |
| :------- | :-------------------------------------------------------------------------------------------------------------------------- |
| v18.0.0  | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v13.11.0, v12.17.0 | В режиме `recursive` обратный вызов теперь получает первый созданный путь в качестве аргумента.                                  |
| v10.12.0 | Второй аргумент теперь может быть объектом `options` со свойствами `recursive` и `mode`.                                      |
| v10.0.0  | Параметр `callback` больше не является необязательным. Его отсутствие вызовет `TypeError` во время выполнения.                        |
| v7.6.0   | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`.                                            |
| v7.0.0   | Параметр `callback` больше не является необязательным. Его отсутствие вызовет предупреждение об устаревании с идентификатором DEP0013.         |
| v0.1.8   | Добавлено в: v0.1.8                                                                                                           |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Не поддерживается в Windows. **По умолчанию:** `0o777`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Присутствует только в том случае, если каталог создан с параметром `recursive`, установленным в `true`.


Асинхронно создает каталог.

Обратному вызову передается возможное исключение и, если `recursive` имеет значение `true`, первый созданный путь к каталогу, `(err[, path])`. `path` все еще может быть `undefined`, когда `recursive` имеет значение `true`, если каталог не был создан (например, если он был создан ранее).

Необязательный аргумент `options` может быть целым числом, задающим `mode` (биты разрешений и закрепления), или объектом со свойством `mode` и свойством `recursive`, указывающим, следует ли создавать родительские каталоги. Вызов `fs.mkdir()`, когда `path` является существующим каталогом, приводит к ошибке только тогда, когда `recursive` имеет значение false. Если `recursive` имеет значение false и каталог существует, возникает ошибка `EEXIST`.

```js [ESM]
import { mkdir } from 'node:fs';

// Создать ./tmp/a/apple, независимо от того, существуют ли ./tmp и ./tmp/a.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```
В Windows использование `fs.mkdir()` в корневом каталоге даже с рекурсией приведет к ошибке:

```js [ESM]
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```
См. документацию POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2) для получения более подробной информации.


### `fs.mkdtemp(prefix[, options], callback)` {#fsmkdtempprefix-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.6.0, v18.19.0 | Параметр `prefix` теперь принимает буферы и URL. |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v16.5.0, v14.18.0 | Параметр `prefix` теперь принимает пустую строку. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к выбросу `TypeError` во время выполнения. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет предупреждение об устаревании с идентификатором DEP0013. |
| v6.2.1 | Параметр `callback` теперь является необязательным. |
| v5.10.0 | Добавлено в: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



Создает уникальный временный каталог.

Генерирует шесть случайных символов, которые добавляются к обязательному `prefix` для создания уникального временного каталога. Из-за несогласованности платформ избегайте завершающих символов `X` в `prefix`. Некоторые платформы, особенно BSD, могут возвращать более шести случайных символов и заменять завершающие символы `X` в `prefix` случайными символами.

Созданный путь к каталогу передается в виде строки во втором параметре обратного вызова.

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим используемую кодировку символов.

```js [ESM]
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Выводит: /tmp/foo-itXde2 или C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```
Метод `fs.mkdtemp()` добавит шесть случайно выбранных символов непосредственно к строке `prefix`. Например, если задан каталог `/tmp`, и намерение состоит в том, чтобы создать временный каталог *внутри* `/tmp`, `prefix` должен заканчиваться замыкающим разделителем пути, специфичным для платформы (`require('node:path').sep`).

```js [ESM]
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// Родительский каталог для нового временного каталога
const tmpDir = tmpdir();

// Этот метод *НЕПРАВИЛЬНЫЙ*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Выведет что-то вроде `/tmpabc123`.
  // Новый временный каталог создается в корне файловой системы,
  // а не *внутри* каталога /tmp.
});

// Этот метод *ПРАВИЛЬНЫЙ*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Выведет что-то вроде `/tmp/abc123`.
  // Новый временный каталог создается внутри
  // каталога /tmp.
});
```

### `fs.open(path[, flags[, mode]], callback)` {#fsopenpath-flags-mode-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v11.1.0 | Аргумент `flags` теперь необязательный и по умолчанию равен `'r'`. |
| v9.9.0 | Теперь поддерживаются флаги `as` и `as+`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.0.2 | Добавлено в версии: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'r'`.
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666` (чтение и запись)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Асинхронное открытие файла. Подробнее см. документацию POSIX [`open(2)`](http://man7.org/linux/man-pages/man2/open.2).

`mode` устанавливает режим файла (права доступа и sticky bits), но только если файл был создан. В Windows можно манипулировать только разрешением на запись; см. [`fs.chmod()`](/ru/nodejs/api/fs#fschmodpath-mode-callback).

Обратный вызов получает два аргумента `(err, fd)`.

Некоторые символы (`\< \> : " / \ | ? *`) зарезервированы в Windows, как описано в [Именование файлов, путей и пространств имен](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file). В NTFS, если имя файла содержит двоеточие, Node.js откроет поток файловой системы, как описано на [этой странице MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams).

Функции, основанные на `fs.open()`, также демонстрируют это поведение: `fs.writeFile()`, `fs.readFile()` и т. д.


### `fs.openAsBlob(path[, options])` {#fsopenasblobpath-options}

**Добавлено в: v19.8.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательный mime-тип для blob.


- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с [\<Blob\>](/ru/nodejs/api/buffer#class-blob) при успехе.

Возвращает [\<Blob\>](/ru/nodejs/api/buffer#class-blob), чьи данные поддерживаются указанным файлом.

Файл не должен быть изменен после создания [\<Blob\>](/ru/nodejs/api/buffer#class-blob). Любые изменения приведут к тому, что чтение данных [\<Blob\>](/ru/nodejs/api/buffer#class-blob) завершится с ошибкой `DOMException`. Синхронные операции stat с файлом выполняются при создании `Blob` и перед каждым чтением, чтобы определить, были ли изменены данные файла на диске.



::: code-group
```js [ESM]
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```js [CJS]
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```
:::

### `fs.opendir(path[, options], callback)` {#fsopendirpath-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Добавлена опция `recursive`. |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v13.1.0, v12.16.0 | Представлена опция `bufferSize`. |
| v12.12.0 | Добавлено в: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество записей каталога, которые буферизуются внутри при чтении из каталога. Более высокие значения приводят к лучшей производительности, но к большему потреблению памяти. **По умолчанию:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dir` [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir)



Асинхронное открытие каталога. Подробности см. в документации POSIX [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Создает [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir), который содержит все дальнейшие функции для чтения и очистки каталога.

Опция `encoding` устанавливает кодировку для `path` при открытии каталога и последующих операциях чтения.


### `fs.read(fd, buffer, offset, length, position, callback)` {#fsreadfd-buffer-offset-length-position-callback}

::: info [История]
| Версия  | Изменения                                                                                                                                                                                             |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| v18.0.0   | Передача недействительной обратной функции в аргументе `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`.                                                                |
| v10.10.0  | Параметр `buffer` теперь может быть любым `TypedArray` или `DataView`.                                                                                                                               |
| v7.4.0    | Параметр `buffer` теперь может быть `Uint8Array`.                                                                                                                                                        |
| v6.0.0    | Параметр `length` теперь может быть `0`.                                                                                                                                                                 |
| v0.0.2    | Добавлено в: v0.0.2                                                                                                                                                                                       |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Буфер, в который будут записаны данные.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Позиция в `buffer`, куда будут записаны данные.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для чтения.
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Указывает, с какого места в файле начинать чтение. Если `position` равно `null` или `-1`, данные будут считываться с текущей позиции файла, и позиция файла будет обновлена. Если `position` является неотрицательным целым числом, позиция файла останется неизменной.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Считывает данные из файла, указанного в `fd`.

Обратный вызов получает три аргумента: `(err, bytesRead, buffer)`.

Если файл не изменяется одновременно, конец файла достигается, когда количество прочитанных байтов равно нулю.

Если этот метод вызывается как его [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal) версия, он возвращает промис для `Object` со свойствами `bytesRead` и `buffer`.

Метод `fs.read()` считывает данные из файла, указанного файловым дескриптором (`fd`). Аргумент `length` указывает максимальное количество байтов, которые Node.js попытается прочитать из ядра. Однако фактическое количество прочитанных байтов (`bytesRead`) может быть меньше указанной `length` по разным причинам.

Например:

- Если файл короче, чем указанная `length`, `bytesRead` будет установлено в фактическое количество прочитанных байтов.
- Если файл достигает EOF (конец файла) до того, как буфер может быть заполнен, Node.js прочитает все доступные байты до тех пор, пока не будет достигнут EOF, и параметр `bytesRead` в обратном вызове укажет фактическое количество прочитанных байтов, которое может быть меньше указанной `length`.
- Если файл находится в медленной сети `filesystem` или возникает какая-либо другая проблема во время чтения, `bytesRead` может быть меньше указанной `length`.

Следовательно, при использовании `fs.read()` важно проверять значение `bytesRead`, чтобы определить, сколько байтов было фактически прочитано из файла. В зависимости от логики вашего приложения вам может потребоваться обработка случаев, когда `bytesRead` меньше указанной `length`, например, путем обертывания вызова чтения в цикл, если вам требуется минимальное количество байтов.

Это поведение аналогично функции POSIX `preadv2`.


### `fs.read(fd[, options], callback)` {#fsreadfd-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.11.0, v12.17.0 | Объект `options` может быть передан для того, чтобы сделать `buffer`, `offset`, `length` и `position` необязательными. |
| v13.11.0, v12.17.0 | Добавлено в версии: v13.11.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **По умолчанию:** `Buffer.alloc(16384)`
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
  
 

Аналогично функции [`fs.read()`](/ru/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), эта версия принимает необязательный объект `options`. Если объект `options` не указан, используются значения по умолчанию, указанные выше.


### `fs.read(fd, buffer[, options], callback)` {#fsreadfd-buffer-options-callback}

**Добавлено в версии: v18.2.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Буфер, в который будут записаны данные.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) **По умолчанию:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
  
 

Подобно функции [`fs.read()`](/ru/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback), эта версия принимает необязательный объект `options`. Если объект `options` не указан, используются значения по умолчанию, указанные выше.

### `fs.readdir(path[, options], callback)` {#fsreaddirpath-options-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Добавлена опция `recursive`. |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.10.0 | Добавлена новая опция `withFileTypes`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, во время выполнения будет выброшена ошибка `TypeError`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v6.0.0 | Добавлен параметр `options`. |
| v0.1.8 | Добавлено в версии: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, считывает содержимое каталога рекурсивно. В рекурсивном режиме будут перечислены все файлы, подфайлы и каталоги. **По умолчанию:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `files` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/ru/nodejs/api/fs#class-fsdirent)
  
 

Считывает содержимое каталога. Обратный вызов получает два аргумента `(err, files)`, где `files` - это массив имен файлов в каталоге, исключая `'.'` и `'..'`.

См. документацию POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) для получения более подробной информации.

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов, используемую для имен файлов, передаваемых в обратный вызов. Если `encoding` установлено в `'buffer'`, возвращаемые имена файлов будут переданы как объекты [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если `options.withFileTypes` установлено в `true`, массив `files` будет содержать объекты [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent).


### `fs.readFile(path[, options], callback)` {#fsreadfilepath-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Возвращаемая ошибка может быть `AggregateError`, если возвращается более одной ошибки. |
| v15.2.0, v14.17.0 | Аргумент options может включать AbortSignal для прерывания текущего запроса readFile. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выдана ошибка `TypeError`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v5.1.0 | В случае успеха `callback` всегда будет вызываться с `null` в качестве параметра `error`. |
| v5.0.0 | Параметр `path` теперь может быть файловым дескриптором. |
| v0.1.29 | Добавлено в: v0.1.29 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) имя файла или файловый дескриптор
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **Default:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержка `flags` файловой системы](/ru/nodejs/api/fs#file-system-flags). **Default:** `'r'`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать текущий readFile
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
    - `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
  
 

Асинхронно считывает все содержимое файла.

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```
Обратному вызову передаются два аргумента `(err, data)`, где `data` — это содержимое файла.

Если кодировка не указана, возвращается необработанный буфер.

Если `options` является строкой, то она определяет кодировку:

```js [ESM]
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```
Когда путь является каталогом, поведение `fs.readFile()` и [`fs.readFileSync()`](/ru/nodejs/api/fs#fsreadfilesyncpath-options) зависит от платформы. В macOS, Linux и Windows будет возвращена ошибка. В FreeBSD будет возвращено представление содержимого каталога.

```js [ESM]
import { readFile } from 'node:fs';

// macOS, Linux и Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```
Можно прервать текущий запрос с помощью `AbortSignal`. Если запрос прерван, вызывается обратный вызов с `AbortError`:

```js [ESM]
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// Когда вы хотите прервать запрос
controller.abort();
```
Функция `fs.readFile()` буферизует весь файл. Чтобы минимизировать затраты памяти, по возможности предпочтите потоковую передачу через `fs.createReadStream()`.

Прерывание текущего запроса не прерывает отдельные запросы операционной системы, а скорее внутреннюю буферизацию, которую выполняет `fs.readFile`.


#### Файловые дескрипторы {#file-descriptors}

#### Вопросы производительности {#performance-considerations}

Метод `fs.readFile()` асинхронно читает содержимое файла в память по частям, позволяя циклу событий переключаться между каждой частью. Это позволяет операции чтения оказывать меньшее влияние на другую активность, которая может использовать базовый пул потоков libuv, но означает, что чтение полного файла в память займет больше времени.

Дополнительные накладные расходы на чтение могут сильно варьироваться в разных системах и зависят от типа читаемого файла. Если тип файла не является обычным файлом (например, каналом) и Node.js не может определить фактический размер файла, каждая операция чтения будет загружать 64 КиБ данных. Для обычных файлов каждое чтение будет обрабатывать 512 КиБ данных.

Для приложений, которым требуется максимально быстрое чтение содержимого файла, лучше использовать `fs.read()` напрямую, а код приложения должен самостоятельно управлять чтением всего содержимого файла.

В проблеме GitHub Node.js [#25741](https://github.com/nodejs/node/issues/25741) содержится дополнительная информация и подробный анализ производительности `fs.readFile()` для файлов разных размеров в разных версиях Node.js.

### `fs.readlink(path[, options], callback)` {#fsreadlinkpath-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выдана ошибка `TypeError`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.1.31 | Добавлено в: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `linkString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
  
 

Читает содержимое символической ссылки, на которую указывает `path`. Функция обратного вызова получает два аргумента: `(err, linkString)`.

Подробности см. в документации POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2).

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов, используемую для пути ссылки, передаваемого в функцию обратного вызова. Если для `encoding` установлено значение `'buffer'`, возвращаемый путь ссылки будет передан как объект [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).


### `fs.readv(fd, buffers[, position], callback)` {#fsreadvfd-buffers-position-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача некорректной функции обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v13.13.0, v12.17.0 | Добавлено в: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesRead` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

Читает данные из файла, указанного `fd`, и записывает их в массив `ArrayBufferView` с использованием `readv()`.

`position` — это смещение от начала файла, с которого следует читать данные. Если `typeof position !== 'number'`, данные будут считываться с текущей позиции.

Функции обратного вызова будут переданы три аргумента: `err`, `bytesRead` и `buffers`. `bytesRead` — это количество байтов, прочитанных из файла.

Если этот метод вызывается как его [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal)ed версия, он возвращает promise для `Object` со свойствами `bytesRead` и `buffers`.

### `fs.realpath(path[, options], callback)` {#fsrealpathpath-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача некорректной функции обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, во время выполнения будет выброшена ошибка `TypeError`. |
| v8.0.0 | Добавлена поддержка разрешения Pipe/Socket. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v6.4.0 | Вызов `realpath` теперь снова работает для различных крайних случаев в Windows. |
| v6.0.0 | Параметр `cache` был удален. |
| v0.1.31 | Добавлено в: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
  
 

Асинхронно вычисляет каноническое имя пути, разрешая `.`, `..` и символические ссылки.

Каноническое имя пути не обязательно является уникальным. Жесткие ссылки и bind mounts могут предоставлять файловую систему через множество имен путей.

Эта функция ведет себя как [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3) с некоторыми исключениями:

Функция обратного вызова получает два аргумента `(err, resolvedPath)`. Может использовать `process.cwd` для разрешения относительных путей.

Поддерживаются только пути, которые могут быть преобразованы в строки UTF8.

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов, используемую для пути, передаваемого в функцию обратного вызова. Если для `encoding` установлено значение `'buffer'`, возвращаемый путь будет передан как объект [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если `path` разрешается в сокет или канал, функция вернет зависящее от системы имя для этого объекта.

Путь, который не существует, приводит к ошибке ENOENT. `error.path` — это абсолютный путь к файлу.


### `fs.realpath.native(path[, options], callback)` {#fsrealpathnativepath-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v9.2.0 | Добавлено в: v9.2.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `resolvedPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)



Асинхронная версия [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3).

Функция `callback` получает два аргумента `(err, resolvedPath)`.

Поддерживаются только пути, которые могут быть преобразованы в строки UTF8.

Необязательный аргумент `options` может быть строкой, определяющей кодировку, или объектом со свойством `encoding`, определяющим кодировку символов, используемую для пути, переданного в функцию обратного вызова. Если для `encoding` установлено значение `'buffer'`, возвращаемый путь будет передан как объект [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

В Linux, когда Node.js скомпонован с musl libc, файловая система procfs должна быть смонтирована в `/proc`, чтобы эта функция работала. Glibc не имеет этого ограничения.

### `fs.rename(oldPath, newPath, callback)` {#fsrenameoldpath-newpath-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выдана ошибка `TypeError`. |
| v7.6.0 | Параметры `oldPath` и `newPath` могут быть объектами WHATWG `URL` с использованием протокола `file:`. Поддержка в настоящее время все еще *экспериментальная*. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.0.2 | Добавлено в: v0.0.2 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Асинхронно переименовывает файл по адресу `oldPath` в путь, указанный как `newPath`. В случае, если `newPath` уже существует, он будет перезаписан. Если по адресу `newPath` находится каталог, будет выдана ошибка. Функция обратного вызова завершения не получает никаких аргументов, кроме возможного исключения.

См. также: [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

```js [ESM]
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Переименование завершено!');
});
```

### `fs.rmdir(path[, options], callback)` {#fsrmdirpath-options-callback}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Использование `fs.rmdir(path, { recursive: true })` для `path`, который является файлом, больше не разрешено и приводит к ошибке `ENOENT` в Windows и ошибке `ENOTDIR` в POSIX. |
| v16.0.0 | Использование `fs.rmdir(path, { recursive: true })` для `path`, который не существует, больше не разрешено и приводит к ошибке `ENOENT`. |
| v16.0.0 | Параметр `recursive` устарел, его использование вызывает предупреждение об устаревании. |
| v14.14.0 | Параметр `recursive` устарел, используйте `fs.rm` вместо него. |
| v13.3.0, v12.16.0 | Параметр `maxBusyTries` переименован в `maxRetries`, и его значение по умолчанию равно 0. Параметр `emfileWait` был удален, и ошибки `EMFILE` используют ту же логику повторных попыток, что и другие ошибки. Теперь поддерживается параметр `retryDelay`. Теперь выполняются повторные попытки при ошибках `ENFILE`. |
| v12.10.0 | Теперь поддерживаются параметры `recursive`, `maxBusyTries` и `emfileWait`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, во время выполнения будет выдана ошибка `TypeError`. |
| v7.6.0 | Параметры `path` могут быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.0.2 | Добавлено в версии: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если возникает ошибка `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` или `EPERM`, Node.js повторяет операцию с линейной задержкой `retryDelay` миллисекунд дольше при каждой попытке. Этот параметр представляет количество повторных попыток. Этот параметр игнорируется, если параметр `recursive` не равен `true`. **По умолчанию:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, выполнить рекурсивное удаление каталога. В рекурсивном режиме операции повторяются в случае сбоя. **По умолчанию:** `false`. **Устаревший.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Время в миллисекундах для ожидания между повторными попытками. Этот параметр игнорируется, если параметр `recursive` не равен `true`. **По умолчанию:** `100`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)


Асинхронный [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). Обратному вызову завершения не передаются никакие аргументы, кроме возможного исключения.

Использование `fs.rmdir()` для файла (не каталога) приводит к ошибке `ENOENT` в Windows и ошибке `ENOTDIR` в POSIX.

Чтобы получить поведение, аналогичное команде Unix `rm -rf`, используйте [`fs.rm()`](/ru/nodejs/api/fs#fsrmpath-options-callback) с параметрами `{ recursive: true, force: true }`.


### `fs.rm(path[, options], callback)` {#fsrmpath-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.3.0, v16.14.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v14.14.0 | Добавлено в: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, исключения будут игнорироваться, если `path` не существует. **По умолчанию:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если встречается ошибка `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` или `EPERM`, Node.js будет повторять операцию с линейной задержкой `retryDelay` миллисекунд дольше при каждой попытке. Эта опция представляет количество повторных попыток. Эта опция игнорируется, если опция `recursive` не `true`. **По умолчанию:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, выполнить рекурсивное удаление. В рекурсивном режиме операции повторяются при сбое. **По умолчанию:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество времени в миллисекундах для ожидания между повторными попытками. Эта опция игнорируется, если опция `recursive` не `true`. **По умолчанию:** `100`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Асинхронно удаляет файлы и каталоги (по образцу стандартной утилиты POSIX `rm`). В колбэк завершения не передаются никакие аргументы, кроме возможного исключения.


### `fs.stat(path[, options], callback)` {#fsstatpath-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительной функции обратного вызова аргументу `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.5.0 | Принимает дополнительный объект `options`, чтобы указать, должны ли возвращаемые числовые значения быть bigint. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выдана ошибка `TypeError`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.0.2 | Добавлено в: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть `bigint`. **По умолчанию:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats)



Асинхронная версия [`stat(2)`](http://man7.org/linux/man-pages/man2/stat.2). Функция обратного вызова получает два аргумента `(err, stats)`, где `stats` - это объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats).

В случае ошибки, `err.code` будет одним из [Общих системных ошибок](/ru/nodejs/api/errors#common-system-errors).

[`fs.stat()`](/ru/nodejs/api/fs#fsstatpath-options-callback) следует по символическим ссылкам. Используйте [`fs.lstat()`](/ru/nodejs/api/fs#fslstatpath-options-callback) для просмотра самих ссылок.

Не рекомендуется использовать `fs.stat()` для проверки существования файла перед вызовом `fs.open()`, `fs.readFile()` или `fs.writeFile()`. Вместо этого пользовательский код должен открывать/читать/записывать файл напрямую и обрабатывать ошибку, возникающую, если файл недоступен.

Чтобы проверить, существует ли файл, не манипулируя им впоследствии, рекомендуется использовать [`fs.access()`](/ru/nodejs/api/fs#fsaccesspath-mode-callback).

Например, дана следующая структура каталогов:

```text [TEXT]
- txtDir
-- file.txt
- app.js
```
Следующая программа проверит статистику для заданных путей:

```js [ESM]
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```
Полученный вывод будет выглядеть примерно так:

```bash [BASH]
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z
}
```

### `fs.statfs(path[, options], callback)` {#fsstatfspath-options-callback}

**Добавлено в: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должны ли числовые значения в возвращаемом объекте [\<fs.StatFs\>](/ru/nodejs/api/fs#class-fsstatfs) быть типа `bigint`. **По умолчанию:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stats` [\<fs.StatFs\>](/ru/nodejs/api/fs#class-fsstatfs)



Асинхронная версия [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). Возвращает информацию о смонтированной файловой системе, которая содержит `path`. Callback получает два аргумента `(err, stats)`, где `stats` является объектом [\<fs.StatFs\>](/ru/nodejs/api/fs#class-fsstatfs).

В случае ошибки, `err.code` будет одним из [Общих системных ошибок](/ru/nodejs/api/errors#common-system-errors).

### `fs.symlink(target, path[, type], callback)` {#fssymlinktarget-path-type-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова аргументу `callback` теперь выдает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v12.0.0 | Если аргумент `type` не определен, Node автоматически определит тип `target` и автоматически выберет `dir` или `file`. |
| v7.6.0 | Параметры `target` и `path` могут быть объектами WHATWG `URL` с использованием протокола `file:`. Поддержка в настоящее время все еще *экспериментальная*. |
| v0.1.31 | Добавлено в: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)



Создает ссылку с именем `path`, указывающую на `target`. Completion callback не получает никаких аргументов, кроме возможного исключения.

Подробности смотрите в документации POSIX [`symlink(2)`](http://man7.org/linux/man-pages/man2/symlink.2).

Аргумент `type` доступен только в Windows и игнорируется на других платформах. Он может быть установлен в `'dir'`, `'file'` или `'junction'`. Если аргумент `type` имеет значение `null`, Node.js автоматически определит тип `target` и использует `'file'` или `'dir'`. Если `target` не существует, будет использоваться `'file'`. Точки соединения Windows требуют, чтобы путь назначения был абсолютным. При использовании `'junction'` аргумент `target` будет автоматически нормализован до абсолютного пути. Точки соединения на томах NTFS могут указывать только на каталоги.

Относительные цели отсчитываются от родительского каталога ссылки.

```js [ESM]
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```
В приведенном выше примере создается символическая ссылка `mewtwo`, которая указывает на `mew` в том же каталоге:

```bash [BASH]
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)` {#fstruncatepath-len-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v16.0.0 | Возвращаемая ошибка может быть `AggregateError`, если возвращено несколько ошибок. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет `TypeError` во время выполнения. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет предупреждение об устаревании с идентификатором DEP0013. |
| v0.8.6 | Добавлено в: v0.8.6 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

Обрезает файл. В обратный вызов завершения не передаются никакие аргументы, кроме возможного исключения. Дескриптор файла также может быть передан в качестве первого аргумента. В этом случае вызывается `fs.ftruncate()`.

::: code-group
```js [ESM]
import { truncate } from 'node:fs';
// Предполагается, что 'path/file.txt' является обычным файлом.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt был обрезан');
});
```

```js [CJS]
const { truncate } = require('node:fs');
// Предполагается, что 'path/file.txt' является обычным файлом.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt был обрезан');
});
```
:::

Передача дескриптора файла устарела и может привести к возникновению ошибки в будущем.

Для получения более подробной информации см. документацию POSIX [`truncate(2)`](http://man7.org/linux/man-pages/man2/truncate.2).


### `fs.unlink(path, callback)` {#fsunlinkpath-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, во время выполнения будет выдана ошибка `TypeError`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если он не передан, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.0.2 | Добавлено в: v0.0.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Асинхронно удаляет файл или символическую ссылку. Завершающий обратный вызов не получает никаких аргументов, кроме возможного исключения.

```js [ESM]
import { unlink } from 'node:fs';
// Предполагая, что 'path/file.txt' является обычным файлом.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt был удален');
});
```
`fs.unlink()` не будет работать с каталогом, пустым или иным. Чтобы удалить каталог, используйте [`fs.rmdir()`](/ru/nodejs/api/fs#fsrmdirpath-options-callback).

См. документацию POSIX [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2) для получения более подробной информации.

### `fs.unwatchFile(filename[, listener])` {#fsunwatchfilefilename-listener}

**Добавлено в: v0.1.31**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Необязательный, слушатель, ранее подключенный с помощью `fs.watchFile()`

Прекратить отслеживание изменений в `filename`. Если указан `listener`, удаляется только этот конкретный слушатель. В противном случае удаляются *все* слушатели, что фактически останавливает отслеживание `filename`.

Вызов `fs.unwatchFile()` с именем файла, который не отслеживается, является холостой операцией, а не ошибкой.

Использование [`fs.watch()`](/ru/nodejs/api/fs#fswatchfilename-options-listener) более эффективно, чем `fs.watchFile()` и `fs.unwatchFile()`. `fs.watch()` следует использовать вместо `fs.watchFile()` и `fs.unwatchFile()` по возможности.


### `fs.utimes(path, atime, mtime, callback)` {#fsutimespath-atime-mtime-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к выбросу `TypeError` во время выполнения. |
| v8.0.0 | `NaN`, `Infinity` и `-Infinity` больше не являются допустимыми спецификаторами времени. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие приведет к выбросу предупреждения об устаревании с идентификатором DEP0013. |
| v4.1.0 | Числовые строки, `NaN` и `Infinity` теперь являются допустимыми спецификаторами времени. |
| v0.4.2 | Добавлено в: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Изменяет временные метки файловой системы объекта, на который ссылается `path`.

Аргументы `atime` и `mtime` подчиняются следующим правилам:

- Значения могут быть либо числами, представляющими время Unix epoch в секундах, `Date` или числовой строкой, например `'123456789.0'`.
- Если значение не может быть преобразовано в число или является `NaN`, `Infinity` или `-Infinity`, будет выдана `Error`.


### `fs.watch(filename[, options][, listener])` {#fswatchfilename-options-listener}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.1.0 | Добавлена рекурсивная поддержка для Linux, AIX и IBMi. |
| v15.9.0, v14.17.0 | Добавлена поддержка закрытия наблюдателя с помощью AbortSignal. |
| v7.6.0 | Параметр `filename` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v7.0.0 | Переданный объект `options` никогда не будет изменен. |
| v0.5.10 | Добавлено в: v0.5.10 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должен ли процесс продолжать работу, пока отслеживаются файлы. **По умолчанию:** `true`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, следует ли отслеживать все подкаталоги или только текущий каталог. Это применимо, когда указан каталог, и только на поддерживаемых платформах (см. [предостережения](/ru/nodejs/api/fs#caveats)). **По умолчанию:** `false`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Указывает кодировку символов, используемую для имени файла, передаваемого слушателю. **По умолчанию:** `'utf8'`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет закрыть наблюдатель с помощью AbortSignal.

- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) **По умолчанию:** `undefined`
    - `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

- Возвращает: [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher)

Отслеживает изменения в `filename`, где `filename` - это файл или каталог.

Второй аргумент является необязательным. Если `options` предоставлен в виде строки, он указывает `encoding`. В противном случае `options` следует передавать как объект.

Обратный вызов слушателя получает два аргумента `(eventType, filename)`. `eventType` - это либо `'rename'`, либо `'change'`, а `filename` - это имя файла, вызвавшего событие.

На большинстве платформ `'rename'` испускается всякий раз, когда имя файла появляется или исчезает в каталоге.

Обратный вызов слушателя прикреплен к событию `'change'`, запускаемому [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher), но это не то же самое, что значение `'change'` для `eventType`.

Если передан `signal`, прерывание соответствующего AbortController закроет возвращенный [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher).


#### Предостережения {#caveats}

API `fs.watch` не является на 100% консистентным на разных платформах и недоступен в некоторых ситуациях.

В Windows события не будут генерироваться, если наблюдаемая директория перемещена или переименована. Об ошибке `EPERM` сообщается при удалении наблюдаемой директории.

##### Доступность {#availability}

Эта функция зависит от базовой операционной системы, предоставляющей способ уведомления об изменениях файловой системы.

- В системах Linux используется [`inotify(7)`](https://man7.org/linux/man-pages/man7/inotify.7).
- В системах BSD используется [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2).
- В macOS для файлов используется [`kqueue(2)`](https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2), а для директорий — [`FSEvents`](https://developer.apple.com/documentation/coreservices/file_system_events).
- В системах SunOS (включая Solaris и SmartOS) используются [`event ports`](https://illumos.org/man/port_create).
- В системах Windows эта функция зависит от [`ReadDirectoryChangesW`](https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw).
- В системах AIX эта функция зависит от [`AHAFS`](https://developer.ibm.com/articles/au-aix_event_infrastructure/), который должен быть включен.
- В системах IBM i эта функция не поддерживается.

Если базовая функциональность по какой-либо причине недоступна, то `fs.watch()` не сможет функционировать и может выбросить исключение. Например, наблюдение за файлами или каталогами может быть ненадежным, а в некоторых случаях и невозможным, в сетевых файловых системах (NFS, SMB и т. д.) или в файловых системах хоста при использовании программного обеспечения для виртуализации, такого как Vagrant или Docker.

Все еще можно использовать `fs.watchFile()`, который использует опрос stat, но этот метод медленнее и менее надежен.

##### Inodes {#inodes}

В системах Linux и macOS `fs.watch()` разрешает путь к [inode](https://en.wikipedia.org/wiki/Inode) и наблюдает за inode. Если наблюдаемый путь удален и воссоздан, ему назначается новый inode. Наблюдатель сгенерирует событие для удаления, но продолжит наблюдать за *исходным* inode. События для нового inode не будут генерироваться. Это ожидаемое поведение.

Файлы AIX сохраняют один и тот же inode на протяжении всего срока существования файла. Сохранение и закрытие наблюдаемого файла в AIX приведет к двум уведомлениям (одно для добавления нового содержимого, а другое для усечения).


##### Аргумент `filename` {#filename-argument}

Предоставление аргумента `filename` в обратном вызове поддерживается только в Linux, macOS, Windows и AIX. Даже на поддерживаемых платформах не всегда гарантируется предоставление `filename`. Поэтому не следует предполагать, что аргумент `filename` всегда предоставляется в обратном вызове, и предусмотреть некоторую логику отката, если он имеет значение `null`.

```js [ESM]
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
```
### `fs.watchFile(filename[, options], listener)` {#fswatchfilefilename-options-listener}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.5.0 | Теперь поддерживается опция `bigint`. |
| v7.6.0 | Параметр `filename` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.1.31 | Добавлено в версии: v0.1.31 |
:::

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
    - `persistent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `true`
    - `interval` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `5007`


- `listener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `current` [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats)
    - `previous` [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats)


- Возвращает: [\<fs.StatWatcher\>](/ru/nodejs/api/fs#class-fsstatwatcher)

Следит за изменениями в `filename`. Обратный вызов `listener` будет вызываться каждый раз, когда происходит доступ к файлу.

Аргумент `options` может быть опущен. Если он предоставлен, он должен быть объектом. Объект `options` может содержать логическое значение с именем `persistent`, которое указывает, должен ли процесс продолжать работу до тех пор, пока файлы находятся под наблюдением. Объект `options` может указывать свойство `interval`, указывающее, как часто следует опрашивать цель в миллисекундах.

`listener` получает два аргумента: текущий объект stat и предыдущий объект stat:

```js [ESM]
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
```
Эти объекты stat являются экземплярами `fs.Stat`. Если опция `bigint` имеет значение `true`, числовые значения в этих объектах задаются как `BigInt`.

Чтобы получать уведомления, когда файл был изменен, а не просто получен к нему доступ, необходимо сравнить `curr.mtimeMs` и `prev.mtimeMs`.

Когда операция `fs.watchFile` приводит к ошибке `ENOENT`, она вызовет прослушиватель один раз со всеми полями, обнуленными (или, для дат, с эпохой Unix). Если файл будет создан позже, прослушиватель будет вызван снова, с последними объектами stat. Это изменение в функциональности, начиная с v0.10.

Использование [`fs.watch()`](/ru/nodejs/api/fs#fswatchfilename-options-listener) более эффективно, чем `fs.watchFile` и `fs.unwatchFile`. `fs.watch` следует использовать вместо `fs.watchFile` и `fs.unwatchFile`, когда это возможно.

Когда файл, находящийся под наблюдением `fs.watchFile()`, исчезает и появляется снова, содержимое `previous` во втором событии обратного вызова (повторное появление файла) будет таким же, как и содержимое `previous` в первом событии обратного вызова (его исчезновение).

Это происходит, когда:

- файл удален, а затем восстановлен
- файл переименован, а затем переименован во второй раз обратно в его исходное имя


### `fs.write(fd, buffer, offset[, length[, position]], callback)` {#fswritefd-buffer-offset-length-position-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v14.0.0 | Параметр `buffer` больше не будет приводить неподдерживаемый ввод к строкам. |
| v10.10.0 | Параметр `buffer` теперь может быть любым `TypedArray` или `DataView`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет `TypeError` во время выполнения. |
| v7.4.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v7.2.0 | Параметры `offset` и `length` теперь необязательны. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Его отсутствие вызовет предупреждение об устаревании с идентификатором DEP0013. |
| v0.0.2 | Добавлено в версии: v0.0.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

Записывает `buffer` в файл, указанный `fd`.

`offset` определяет часть буфера для записи, а `length` — это целое число, указывающее количество байтов для записи.

`position` относится к смещению от начала файла, куда должны быть записаны эти данные. Если `typeof position !== 'number'`, данные будут записаны в текущую позицию. См. [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

Обратному вызову будут переданы три аргумента `(err, bytesWritten, buffer)`, где `bytesWritten` указывает, сколько *байтов* было записано из `buffer`.

Если этот метод вызывается как его [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal)-версия, он возвращает промис для `Object` со свойствами `bytesWritten` и `buffer`.

Небезопасно использовать `fs.write()` несколько раз для одного и того же файла, не дожидаясь обратного вызова. В этом случае рекомендуется использовать [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options).

В Linux позиционная запись не работает, когда файл открыт в режиме добавления. Ядро игнорирует аргумент position и всегда добавляет данные в конец файла.


### `fs.write(fd, buffer[, options], callback)` {#fswritefd-buffer-options-callback}

**Добавлено в: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `null`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
  
 

Записывает `buffer` в файл, указанный в `fd`.

Как и в случае с вышеупомянутой функцией `fs.write`, эта версия принимает необязательный объект `options`. Если объект `options` не указан, используются значения по умолчанию, указанные выше.

### `fs.write(fd, string[, position[, encoding]], callback)` {#fswritefd-string-position-encoding-callback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Передача в параметр `string` объекта с собственной функцией `toString` больше не поддерживается. |
| v17.8.0 | Передача в параметр `string` объекта с собственной функцией `toString` устарела. |
| v14.12.0 | Параметр `string` будет преобразовывать объект с явной функцией `toString` в строку. |
| v14.0.0 | Параметр `string` больше не будет приводить неподдерживаемый ввод к строкам. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выброшена ошибка `TypeError`. |
| v7.2.0 | Параметр `position` теперь является необязательным. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v0.11.5 | Добавлено в: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `written` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Записывает `string` в файл, указанный в `fd`. Если `string` не является строкой, выбрасывается исключение.

`position` относится к смещению от начала файла, куда должны быть записаны эти данные. Если `typeof position !== 'number'`, данные будут записаны в текущую позицию. См. [`pwrite(2)`](http://man7.org/linux/man-pages/man2/pwrite.2).

`encoding` - ожидаемая кодировка строки.

Обратный вызов получит аргументы `(err, written, string)`, где `written` указывает, сколько *байтов* потребовалось для записи переданной строки. Количество записанных байтов не обязательно совпадает с количеством записанных символов строки. См. [`Buffer.byteLength`](/ru/nodejs/api/buffer#static-method-bufferbytelengthstring-encoding).

Небезопасно использовать `fs.write()` несколько раз для одного и того же файла, не дожидаясь обратного вызова. Для этого сценария рекомендуется использовать [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options).

В Linux позиционная запись не работает, если файл открыт в режиме добавления. Ядро игнорирует аргумент position и всегда добавляет данные в конец файла.

В Windows, если файловый дескриптор подключен к консоли (например, `fd == 1` или `stdout`), строка, содержащая символы, отличные от ASCII, по умолчанию не будет отображаться должным образом, независимо от используемой кодировки. Можно настроить консоль для правильного отображения UTF-8, изменив активную кодовую страницу с помощью команды `chcp 65001`. Подробнее см. в документации [chcp](https://ss64.com/nt/chcp).


### `fs.writeFile(file, data[, options], callback)` {#fswritefilefile-data-options-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v19.0.0 | Передача в параметр `string` объекта с собственной функцией `toString` больше не поддерживается. |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает ошибку `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v17.8.0 | Передача в параметр `string` объекта с собственной функцией `toString` устарела. |
| v16.0.0 | Возвращаемая ошибка может быть `AggregateError`, если возвращается более одной ошибки. |
| v15.2.0, v14.17.0 | Аргумент options может включать AbortSignal для прерывания текущего запроса writeFile. |
| v14.12.0 | Параметр `data` будет преобразовывать в строку объект с явной функцией `toString`. |
| v14.0.0 | Параметр `data` больше не будет приводить неподдерживаемый ввод к строкам. |
| v10.10.0 | Параметр `data` теперь может быть любым `TypedArray` или `DataView`. |
| v10.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, во время выполнения будет выдана ошибка `TypeError`. |
| v7.4.0 | Параметр `data` теперь может быть `Uint8Array`. |
| v7.0.0 | Параметр `callback` больше не является необязательным. Если его не передать, будет выдано предупреждение об устаревании с идентификатором DEP0013. |
| v5.0.0 | Параметр `file` теперь может быть файловым дескриптором. |
| v0.1.29 | Добавлено в: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) имя файла или файловый дескриптор
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если все данные успешно записаны в файл и `flush` имеет значение `true`, для сброса данных используется `fs.fsync()`. **По умолчанию:** `false`.
    - `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) позволяет прервать выполняющуюся writeFile
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<AggregateError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
  
 

Когда `file` является именем файла, асинхронно записывает данные в файл, заменяя файл, если он уже существует. `data` может быть строкой или буфером.

Когда `file` является файловым дескриптором, поведение аналогично прямому вызову `fs.write()` (что рекомендуется). См. примечания ниже об использовании файлового дескриптора.

Опция `encoding` игнорируется, если `data` является буфером.

Опция `mode` влияет только на вновь созданный файл. Подробнее см. [`fs.open()`](/ru/nodejs/api/fs#fsopenpath-flags-mode-callback).

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```
Если `options` является строкой, то она указывает кодировку:

```js [ESM]
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```
Небезопасно использовать `fs.writeFile()` несколько раз для одного и того же файла, не дожидаясь обратного вызова. Для этого сценария рекомендуется [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options).

Подобно `fs.readFile` - `fs.writeFile` является удобным методом, который выполняет несколько вызовов `write` внутри для записи переданного ему буфера. Для кода, чувствительного к производительности, рекомендуется использовать [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options).

Можно использовать [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) для отмены `fs.writeFile()`. Отмена выполняется "по возможности", и, вероятно, некоторое количество данных все еще будет записано.

```js [ESM]
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // Когда запрос прерывается - вызывается обратный вызов с AbortError
});
// Когда запрос должен быть прерван
controller.abort();
```
Прерывание текущего запроса не прерывает отдельные запросы операционной системы, а скорее внутреннюю буферизацию, выполняемую `fs.writeFile`.


#### Использование `fs.writeFile()` с файловыми дескрипторами {#using-fswritefile-with-file-descriptors}

Когда `file` является файловым дескриптором, поведение почти идентично прямому вызову `fs.write()`, как показано ниже:

```js [ESM]
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```
Разница с прямым вызовом `fs.write()` заключается в том, что при некоторых необычных условиях `fs.write()` может записать только часть буфера и потребует повторных попыток для записи оставшихся данных, тогда как `fs.writeFile()` повторяет попытки до тех пор, пока данные не будут записаны полностью (или не произойдет ошибка).

Последствия этого часто являются источником путаницы. В случае с файловым дескриптором файл не заменяется! Данные не обязательно записываются в начало файла, и исходные данные файла могут оставаться до и/или после вновь записанных данных.

Например, если `fs.writeFile()` вызывается два раза подряд, сначала для записи строки `'Hello'`, затем для записи строки `', World'`, файл будет содержать `'Hello, World'`, и может содержать часть исходных данных файла (в зависимости от размера исходного файла и положения файлового дескриптора). Если бы вместо дескриптора было использовано имя файла, файл гарантированно содержал бы только `', World'`.

### `fs.writev(fd, buffers[, position], callback)` {#fswritevfd-buffers-position-callback}


::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v12.9.0 | Добавлено в: v12.9.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `bytesWritten` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
  
 

Записывает массив `ArrayBufferView` в файл, указанный в `fd`, с использованием `writev()`.

`position` — это смещение от начала файла, куда должны быть записаны эти данные. Если `typeof position !== 'number'`, данные будут записаны в текущую позицию.

Обратному вызову будут переданы три аргумента: `err`, `bytesWritten` и `buffers`. `bytesWritten` — это количество байтов, записанных из `buffers`.

Если этот метод является [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal)ed, он возвращает promise для `Object` со свойствами `bytesWritten` и `buffers`.

Небезопасно использовать `fs.writev()` несколько раз в одном и том же файле, не дожидаясь обратного вызова. Для этого сценария используйте [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options).

В Linux позиционные записи не работают, когда файл открыт в режиме добавления. Ядро игнорирует аргумент позиции и всегда добавляет данные в конец файла.


## Синхронный API {#synchronous-api}

Синхронные API выполняют все операции синхронно, блокируя цикл событий до тех пор, пока операция не завершится успешно или с ошибкой.

### `fs.accessSync(path[, mode])` {#fsaccesssyncpath-mode}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `fs.constants.F_OK`

Синхронно проверяет права пользователя на файл или каталог, указанный в `path`. Аргумент `mode` является необязательным целым числом, которое определяет проверки доступности, которые необходимо выполнить. `mode` должен быть либо значением `fs.constants.F_OK`, либо маской, состоящей из побитового ИЛИ любого из `fs.constants.R_OK`, `fs.constants.W_OK` и `fs.constants.X_OK` (например, `fs.constants.W_OK | fs.constants.R_OK`). См. [Константы доступа к файлам](/ru/nodejs/api/fs#file-access-constants) для возможных значений `mode`.

Если какая-либо из проверок доступности завершается неудачно, будет выброшена `Error`. В противном случае метод вернет `undefined`.

```js [ESM]
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```
### `fs.appendFileSync(path, data[, options])` {#fsappendfilesyncpath-data-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.1.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v7.0.0 | Переданный объект `options` никогда не будет изменен. |
| v5.0.0 | Параметр `file` теперь может быть файловым дескриптором. |
| v0.6.7 | Добавлено в: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) имя файла или файловый дескриптор
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'a'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, базовый файловый дескриптор сбрасывается перед его закрытием. **По умолчанию:** `false`.


Синхронно добавляет данные в файл, создавая файл, если он еще не существует. `data` может быть строкой или [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Опция `mode` влияет только на вновь созданный файл. См. [`fs.open()`](/ru/nodejs/api/fs#fsopenpath-flags-mode-callback) для получения более подробной информации.

```js [ESM]
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
```
Если `options` является строкой, то она определяет кодировку:

```js [ESM]
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```
`path` может быть указан как числовой файловый дескриптор, который был открыт для добавления (с использованием `fs.open()` или `fs.openSync()`). Файловый дескриптор не будет закрыт автоматически.

```js [ESM]
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)` {#fschmodsyncpath-mode}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v0.6.7 | Добавлено в: v0.6.7 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Для получения подробной информации см. документацию по асинхронной версии этого API: [`fs.chmod()`](/ru/nodejs/api/fs#fschmodpath-mode-callback).

Подробности смотрите в POSIX документации [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2).

### `fs.chownSync(path, uid, gid)` {#fschownsyncpath-uid-gid}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v0.1.97 | Добавлено в: v0.1.97 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Синхронно изменяет владельца и группу файла. Возвращает `undefined`. Это синхронная версия [`fs.chown()`](/ru/nodejs/api/fs#fschownpath-uid-gid-callback).

Подробности смотрите в POSIX документации [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2).

### `fs.closeSync(fd)` {#fsclosesyncfd}

**Добавлено в: v0.1.21**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Закрывает файловый дескриптор. Возвращает `undefined`.

Вызов `fs.closeSync()` для любого файлового дескриптора (`fd`), который в данный момент используется в какой-либо другой операции `fs`, может привести к неопределенному поведению.

Подробности смотрите в POSIX документации [`close(2)`](http://man7.org/linux/man-pages/man2/close.2).


### `fs.copyFileSync(src, dest[, mode])` {#fscopyfilesyncsrc-dest-mode}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Аргумент `flags` изменен на `mode` и наложена более строгая проверка типов. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) исходное имя файла для копирования
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) целевое имя файла для операции копирования
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) модификаторы для операции копирования. **По умолчанию:** `0`.

Синхронно копирует `src` в `dest`. По умолчанию, `dest` перезаписывается, если он уже существует. Возвращает `undefined`. Node.js не дает никаких гарантий относительно атомарности операции копирования. Если происходит ошибка после открытия целевого файла для записи, Node.js попытается удалить целевой файл.

`mode` - это необязательное целое число, которое определяет поведение операции копирования. Можно создать маску, состоящую из побитового ИЛИ двух или более значений (например, `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`).

- `fs.constants.COPYFILE_EXCL`: Операция копирования завершится неудачно, если `dest` уже существует.
- `fs.constants.COPYFILE_FICLONE`: Операция копирования попытается создать reflink copy-on-write. Если платформа не поддерживает copy-on-write, то используется резервный механизм копирования.
- `fs.constants.COPYFILE_FICLONE_FORCE`: Операция копирования попытается создать reflink copy-on-write. Если платформа не поддерживает copy-on-write, то операция завершится неудачно.

```js [ESM]
import { copyFileSync, constants } from 'node:fs';

// destination.txt будет создан или перезаписан по умолчанию.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt был скопирован в destination.txt');

// Используя COPYFILE_EXCL, операция завершится неудачно, если destination.txt существует.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])` {#fscpsyncsrc-dest-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.3.0 | Этот API больше не является экспериментальным. |
| v20.1.0, v18.17.0 | Принимает дополнительную опцию `mode` для указания поведения копирования как аргумент `mode` в `fs.copyFile()`. |
| v17.6.0, v16.15.0 | Принимает дополнительную опцию `verbatimSymlinks` для указания необходимости выполнения разрешения пути для символических ссылок. |
| v16.7.0 | Добавлено в: v16.7.0 |
:::

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) исходный путь для копирования.
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) путь назначения для копирования.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `dereference` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) разрешает символические ссылки. **По умолчанию:** `false`.
    - `errorOnExist` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) когда `force` имеет значение `false` и место назначения существует, выбрасывает ошибку. **По умолчанию:** `false`.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция для фильтрации копируемых файлов/директорий. Возвращает `true` для копирования элемента, `false` для его игнорирования. При игнорировании каталога все его содержимое также будет пропущено. **По умолчанию:** `undefined`
    - `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) исходный путь для копирования.
    - `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) путь назначения для копирования.
    - Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Любое значение, отличное от `Promise`, которое может быть приведено к `boolean`.
  
 
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) перезаписывает существующий файл или каталог. Операция копирования будет игнорировать ошибки, если установить для этого значения false и место назначения существует. Используйте опцию `errorOnExist`, чтобы изменить это поведение. **По умолчанию:** `true`.
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) модификаторы для операции копирования. **По умолчанию:** `0`. См. флаг `mode` в [`fs.copyFileSync()`](/ru/nodejs/api/fs#fscopyfilesyncsrc-dest-mode).
    - `preserveTimestamps` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, то временные метки из `src` будут сохранены. **По умолчанию:** `false`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) копирует каталоги рекурсивно **По умолчанию:** `false`
    - `verbatimSymlinks` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, разрешение пути для символических ссылок будет пропущено. **По умолчанию:** `false`
  
 

Синхронно копирует всю структуру каталогов из `src` в `dest`, включая подкаталоги и файлы.

При копировании каталога в другой каталог глобы не поддерживаются, и поведение аналогично `cp dir1/ dir2/`.


### `fs.existsSync(path)` {#fsexistssyncpath}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если путь существует, в противном случае `false`.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.exists()`](/ru/nodejs/api/fs#fsexistspath-callback).

`fs.exists()` устарел, но `fs.existsSync()` - нет. Параметр `callback` для `fs.exists()` принимает параметры, которые несовместимы с другими обратными вызовами Node.js. `fs.existsSync()` не использует обратный вызов.

```js [ESM]
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('Путь существует.');
```
### `fs.fchmodSync(fd, mode)` {#fsfchmodsyncfd-mode}

**Добавлено в: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Устанавливает разрешения на файл. Возвращает `undefined`.

Подробности см. в документации POSIX [`fchmod(2)`](http://man7.org/linux/man-pages/man2/fchmod.2).

### `fs.fchownSync(fd, uid, gid)` {#fsfchownsyncfd-uid-gid}

**Добавлено в: v0.4.7**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор пользователя нового владельца файла.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор группы новой группы файла.

Устанавливает владельца файла. Возвращает `undefined`.

Подробности см. в документации POSIX [`fchown(2)`](http://man7.org/linux/man-pages/man2/fchown.2).


### `fs.fdatasyncSync(fd)` {#fsfdatasyncsyncfd}

**Добавлено в: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Принудительно приводит все текущие операции ввода-вывода, связанные с файлом, к состоянию завершения синхронизированного ввода-вывода операционной системы. Подробности см. в документации POSIX [`fdatasync(2)`](http://man7.org/linux/man-pages/man2/fdatasync.2). Возвращает `undefined`.

### `fs.fstatSync(fd[, options])` {#fsfstatsyncfd-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.5.0 | Принимает дополнительный объект `options` для указания, следует ли возвращать числовые значения как bigint. |
| v0.1.95 | Добавлено в: v0.1.95 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Определяет, должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть `bigint`. **По умолчанию:** `false`.
  
 
- Возвращает: [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats)

Извлекает [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для файлового дескриптора.

Подробную информацию см. в документации POSIX [`fstat(2)`](http://man7.org/linux/man-pages/man2/fstat.2).

### `fs.fsyncSync(fd)` {#fsfsyncsyncfd}

**Добавлено в: v0.1.96**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Запрашивает сброс всех данных для открытого файлового дескриптора на запоминающее устройство. Конкретная реализация зависит от операционной системы и устройства. Подробности см. в документации POSIX [`fsync(2)`](http://man7.org/linux/man-pages/man2/fsync.2). Возвращает `undefined`.

### `fs.ftruncateSync(fd[, len])` {#fsftruncatesyncfd-len}

**Добавлено в: v0.8.6**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`

Усекает файловый дескриптор. Возвращает `undefined`.

Подробную информацию см. в документации асинхронной версии этого API: [`fs.ftruncate()`](/ru/nodejs/api/fs#fsftruncatefd-len-callback).


### `fs.futimesSync(fd, atime, mtime)` {#fsfutimessyncfd-atime-mtime}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v4.1.0 | Числовые строки, `NaN` и `Infinity` теперь разрешены в качестве спецификаторов времени. |
| v0.4.2 | Добавлено в: v0.4.2 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Синхронная версия [`fs.futimes()`](/ru/nodejs/api/fs#fsfutimesfd-atime-mtime-callback). Возвращает `undefined`.

### `fs.globSync(pattern[, options])` {#fsglobsyncpattern-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.2.0 | Добавлена поддержка `withFileTypes` в качестве опции. |
| v22.0.0 | Добавлено в: v22.0.0 |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) текущий рабочий каталог. **По умолчанию:** `process.cwd()`
    - `exclude` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция для фильтрации файлов/каталогов. Верните `true`, чтобы исключить элемент, `false`, чтобы включить его. **По умолчанию:** `undefined`.
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если glob должен возвращать пути в виде Dirent, `false` в противном случае. **По умолчанию:** `false`.
  
 
- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) пути к файлам, соответствующим шаблону.

::: code-group
```js [ESM]
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```js [CJS]
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```
:::


### `fs.lchmodSync(path, mode)` {#fslchmodsyncpath-mode}

**Устарело, начиная с: v0.4.7**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Изменяет разрешения символической ссылки. Возвращает `undefined`.

Этот метод реализован только в macOS.

Для получения дополнительной информации см. документацию POSIX [`lchmod(2)`](https://www.freebsd.org/cgi/man.cgi?query=lchmod&sektion=2).

### `fs.lchownSync(path, uid, gid)` {#fslchownsyncpath-uid-gid}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.6.0 | Этот API больше не является устаревшим. |
| v0.4.7 | Устаревание только в документации. |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `uid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор пользователя нового владельца файла.
- `gid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Идентификатор группы новой группы файла.

Устанавливает владельца для указанного пути. Возвращает `undefined`.

Для получения дополнительной информации см. документацию POSIX [`lchown(2)`](http://man7.org/linux/man-pages/man2/lchown.2).

### `fs.lutimesSync(path, atime, mtime)` {#fslutimessyncpath-atime-mtime}

**Добавлено в: v14.5.0, v12.19.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Изменяет временные метки файловой системы символической ссылки, на которую ссылается `path`. Возвращает `undefined` или выбрасывает исключение, если параметры неверны или операция не удалась. Это синхронная версия [`fs.lutimes()`](/ru/nodejs/api/fs#fslutimespath-atime-mtime-callback).


### `fs.linkSync(existingPath, newPath)` {#fslinksyncexistingpath-newpath}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметры `existingPath` и `newPath` могут быть объектами WHATWG `URL` с использованием протокола `file:`. Поддержка в настоящее время все еще *экспериментальная*. |
| v0.1.31 | Добавлено в версии: v0.1.31 |
:::

- `existingPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)

Создаёт новую ссылку из `existingPath` в `newPath`. Дополнительные сведения см. в документации POSIX [`link(2)`](http://man7.org/linux/man-pages/man2/link.2). Возвращает `undefined`.

### `fs.lstatSync(path[, options])` {#fslstatsyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.3.0, v14.17.0 | Принимает параметр `throwIfNoEntry`, чтобы указать, следует ли вызывать исключение, если запись не существует. |
| v10.5.0 | Принимает дополнительный объект `options`, чтобы указать, должны ли возвращаемые числовые значения быть bigint. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v0.1.30 | Добавлено в версии: v0.1.30 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть `bigint`. **По умолчанию:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, будет ли вызвано исключение, если запись файловой системы не существует, вместо возврата `undefined`. **По умолчанию:** `true`.
  
 
- Возвращает: [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats)

Получает [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для символической ссылки, на которую ссылается `path`.

Дополнительные сведения см. в документации POSIX [`lstat(2)`](http://man7.org/linux/man-pages/man2/lstat.2).


### `fs.mkdirSync(path[, options])` {#fsmkdirsyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.11.0, v12.17.0 | В режиме `recursive` теперь возвращается первый созданный путь. |
| v10.12.0 | Второй аргумент теперь может быть объектом `options` со свойствами `recursive` и `mode`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v0.1.21 | Добавлено в версии: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Не поддерживается в Windows. **По умолчанию:** `0o777`.

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Синхронно создает каталог. Возвращает `undefined` или, если `recursive` имеет значение `true`, путь к первому созданному каталогу. Это синхронная версия [`fs.mkdir()`](/ru/nodejs/api/fs#fsmkdirpath-options-callback).

Для получения дополнительной информации см. документацию POSIX [`mkdir(2)`](http://man7.org/linux/man-pages/man2/mkdir.2).

### `fs.mkdtempSync(prefix[, options])` {#fsmkdtempsyncprefix-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.6.0, v18.19.0 | Параметр `prefix` теперь принимает буферы и URL. |
| v16.5.0, v14.18.0 | Параметр `prefix` теперь принимает пустую строку. |
| v5.10.0 | Добавлено в версии: v5.10.0 |
:::

- `prefix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает путь к созданному каталогу.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.mkdtemp()`](/ru/nodejs/api/fs#fsmkdtempprefix-options-callback).

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим используемую кодировку символов.


### `fs.opendirSync(path[, options])` {#fsopendirsyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Добавлена опция `recursive`. |
| v13.1.0, v12.16.0 | Введена опция `bufferSize`. |
| v12.12.0 | Добавлено в: v12.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `bufferSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество записей каталога, которые буферизуются внутри при чтении из каталога. Более высокие значения приводят к лучшей производительности, но и к большему использованию памяти. **По умолчанию:** `32`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
  
 
- Возвращает: [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir)

Синхронно открывает каталог. См. [`opendir(3)`](http://man7.org/linux/man-pages/man3/opendir.3).

Создает [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir), который содержит все дальнейшие функции для чтения и очистки каталога.

Опция `encoding` устанавливает кодировку для `path` при открытии каталога и последующих операциях чтения.

### `fs.openSync(path[, flags[, mode]])` {#fsopensyncpath-flags-mode}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.1.0 | Аргумент `flags` теперь необязателен и по умолчанию имеет значение `'r'`. |
| v9.9.0 | Теперь поддерживаются флаги `as` и `as+`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `flags` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `'r'`. См. [поддержка файловой системы `flags`](/ru/nodejs/api/fs#file-system-flags).
- `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает целое число, представляющее файловый дескриптор.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.open()`](/ru/nodejs/api/fs#fsopenpath-flags-mode-callback).


### `fs.readdirSync(path[, options])` {#fsreaddirsyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Добавлена опция `recursive`. |
| v10.10.0 | Добавлена новая опция `withFileTypes`. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
    - `withFileTypes` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **По умолчанию:** `false`
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, читает содержимое каталога рекурсивно. В рекурсивном режиме будут перечислены все файлы, подфайлы и каталоги. **По умолчанию:** `false`.


- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<fs.Dirent[]\>](/ru/nodejs/api/fs#class-fsdirent)

Читает содержимое каталога.

Подробности смотрите в документации POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3).

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов, используемую для возвращаемых имен файлов. Если `encoding` установлено в `'buffer'`, возвращаемые имена файлов будут передаваться как объекты [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

Если `options.withFileTypes` установлено в `true`, результат будет содержать объекты [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent).


### `fs.readFileSync(path[, options])` {#fsreadfilesyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v5.0.0 | Параметр `path` теперь может быть файловым дескриптором. |
| v0.1.8 | Добавлено в версии: v0.1.8 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) имя файла или файловый дескриптор
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'r'`.

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Возвращает содержимое `path`.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.readFile()`](/ru/nodejs/api/fs#fsreadfilepath-options-callback).

Если указана опция `encoding`, то эта функция возвращает строку. В противном случае она возвращает буфер.

Аналогично [`fs.readFile()`](/ru/nodejs/api/fs#fsreadfilepath-options-callback), когда путь является каталогом, поведение `fs.readFileSync()` зависит от платформы.

```js [ESM]
import { readFileSync } from 'node:fs';

// macOS, Linux и Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

//  FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])` {#fsreadlinksyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.1.31 | Добавлено в: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
  
 
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Возвращает строковое значение символической ссылки.

Дополнительную информацию смотрите в документации POSIX [`readlink(2)`](http://man7.org/linux/man-pages/man2/readlink.2).

Необязательный аргумент `options` может быть строкой, определяющей кодировку, или объектом со свойством `encoding`, определяющим кодировку символов, используемую для возвращаемого пути ссылки. Если `encoding` установлено в `'buffer'`, возвращаемый путь ссылки будет передан как объект [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

### `fs.readSync(fd, buffer, offset, length[, position])` {#fsreadsyncfd-buffer-offset-length-position}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.10.0 | Параметр `buffer` теперь может быть любым `TypedArray` или `DataView`. |
| v6.0.0 | Параметр `length` теперь может быть `0`. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает количество `bytesRead`.

Подробную информацию смотрите в документации асинхронной версии этого API: [`fs.read()`](/ru/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).


### `fs.readSync(fd, buffer[, options])` {#fsreadsyncfd-buffer-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.13.0, v12.17.0 | Объект параметров может быть передан, чтобы сделать offset, length и position необязательными. |
| v13.13.0, v12.17.0 | Добавлено в: v13.13.0, v12.17.0 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`


- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает количество прочитанных `bytesRead`.

Аналогично вышеуказанной функции `fs.readSync`, эта версия принимает необязательный объект `options`. Если объект `options` не указан, он будет по умолчанию использовать вышеуказанные значения.

Для получения подробной информации см. документацию по асинхронной версии этого API: [`fs.read()`](/ru/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback).

### `fs.readvSync(fd, buffers[, position])` {#fsreadvsyncfd-buffers-position}

**Добавлено в: v13.13.0, v12.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество прочитанных байтов.

Для получения подробной информации см. документацию по асинхронной версии этого API: [`fs.readv()`](/ru/nodejs/api/fs#fsreadvfd-buffers-position-callback).


### `fs.realpathSync(path[, options])` {#fsrealpathsyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Добавлена поддержка разрешения Pipe/Socket. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v6.4.0 | Вызов `realpathSync` теперь снова работает для различных крайних случаев в Windows. |
| v6.0.0 | Параметр `cache` был удалён. |
| v0.1.31 | Добавлено в: v0.1.31 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`


- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Возвращает разрешённый путь.

Для получения подробной информации смотрите документацию асинхронной версии этого API: [`fs.realpath()`](/ru/nodejs/api/fs#fsrealpathpath-options-callback).

### `fs.realpathSync.native(path[, options])` {#fsrealpathsyncnativepath-options}

**Добавлено в: v9.2.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`


- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Синхронный [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3).

Поддерживаются только пути, которые могут быть преобразованы в строки UTF8.

Необязательный аргумент `options` может быть строкой, указывающей кодировку, или объектом со свойством `encoding`, указывающим кодировку символов, используемую для возвращаемого пути. Если `encoding` установлено в `'buffer'`, возвращаемый путь будет передан как объект [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

В Linux, когда Node.js связан с musl libc, файловая система procfs должна быть смонтирована на `/proc`, чтобы эта функция работала. Glibc не имеет этого ограничения.


### `fs.renameSync(oldPath, newPath)` {#fsrenamesyncoldpath-newpath}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметры `oldPath` и `newPath` могут быть объектами WHATWG `URL`, использующими протокол `file:`. Поддержка в настоящее время является *экспериментальной*. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `oldPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `newPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)

Переименовывает файл из `oldPath` в `newPath`. Возвращает `undefined`.

Подробности см. в документации POSIX [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2).

### `fs.rmdirSync(path[, options])` {#fsrmdirsyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0 | Использование `fs.rmdirSync(path, { recursive: true })` для `path`, который является файлом, больше не разрешено и приводит к ошибке `ENOENT` в Windows и ошибке `ENOTDIR` в POSIX. |
| v16.0.0 | Использование `fs.rmdirSync(path, { recursive: true })` для `path`, который не существует, больше не разрешено и приводит к ошибке `ENOENT`. |
| v16.0.0 | Опция `recursive` устарела, ее использование вызывает предупреждение об устаревании. |
| v14.14.0 | Опция `recursive` устарела, используйте вместо нее `fs.rmSync`. |
| v13.3.0, v12.16.0 | Опция `maxBusyTries` переименована в `maxRetries`, и ее значение по умолчанию равно 0. Опция `emfileWait` была удалена, и ошибки `EMFILE` используют ту же логику повторных попыток, что и другие ошибки. Теперь поддерживается опция `retryDelay`. Теперь повторяются ошибки `ENFILE`. |
| v12.10.0 | Теперь поддерживаются опции `recursive`, `maxBusyTries` и `emfileWait`. |
| v7.6.0 | Параметры `path` могут быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если встречается ошибка `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` или `EPERM`, Node.js повторяет операцию с линейным уменьшением времени ожидания `retryDelay` миллисекунд при каждой попытке. Эта опция представляет количество повторных попыток. Эта опция игнорируется, если опция `recursive` не равна `true`. **По умолчанию:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, выполнить рекурсивное удаление каталога. В рекурсивном режиме операции повторяются при сбое. **По умолчанию:** `false`. **Устарело.**
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество времени в миллисекундах для ожидания между повторными попытками. Эта опция игнорируется, если опция `recursive` не равна `true`. **По умолчанию:** `100`.

Синхронный [`rmdir(2)`](http://man7.org/linux/man-pages/man2/rmdir.2). Возвращает `undefined`.

Использование `fs.rmdirSync()` для файла (не каталога) приводит к ошибке `ENOENT` в Windows и ошибке `ENOTDIR` в POSIX.

Чтобы получить поведение, аналогичное команде Unix `rm -rf`, используйте [`fs.rmSync()`](/ru/nodejs/api/fs#fsrmsyncpath-options) с опциями `{ recursive: true, force: true }`.


### `fs.rmSync(path[, options])` {#fsrmsyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.3.0, v16.14.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v14.14.0 | Добавлено в: v14.14.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `force` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, исключения будут игнорироваться, если `path` не существует. **По умолчанию:** `false`.
    - `maxRetries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если возникает ошибка `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` или `EPERM`, Node.js будет повторять операцию с линейной задержкой `retryDelay` миллисекунд дольше при каждой попытке. Этот параметр представляет количество повторных попыток. Этот параметр игнорируется, если параметр `recursive` не равен `true`. **По умолчанию:** `0`.
    - `recursive` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, выполните рекурсивное удаление каталога. В рекурсивном режиме операции повторяются при сбое. **По умолчанию:** `false`.
    - `retryDelay` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Время ожидания в миллисекундах между повторными попытками. Этот параметр игнорируется, если параметр `recursive` не равен `true`. **По умолчанию:** `100`.

 

Синхронно удаляет файлы и каталоги (смоделировано на основе стандартной утилиты POSIX `rm`). Возвращает `undefined`.

### `fs.statSync(path[, options])` {#fsstatsyncpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.3.0, v14.17.0 | Принимает параметр `throwIfNoEntry`, чтобы указать, следует ли выбрасывать исключение, если запись не существует. |
| v10.5.0 | Принимает дополнительный объект `options`, чтобы указать, должны ли возвращаемые числовые значения быть bigint. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL`, использующим протокол `file:`. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Должны ли числовые значения в возвращаемом объекте [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) быть `bigint`. **По умолчанию:** `false`.
    - `throwIfNoEntry` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Будет ли выбрасываться исключение, если запись в файловой системе не существует, вместо возврата `undefined`. **По умолчанию:** `true`.

 
- Возвращает: [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats)

Получает [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для указанного пути.


### `fs.statfsSync(path[, options])` {#fsstatfssyncpath-options}

**Добавлено в версии: v19.6.0, v18.15.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, следует ли использовать тип `bigint` для числовых значений в возвращаемом объекте [\<fs.StatFs\>](/ru/nodejs/api/fs#class-fsstatfs). **По умолчанию:** `false`.


- Возвращает: [\<fs.StatFs\>](/ru/nodejs/api/fs#class-fsstatfs)

Синхронная версия [`statfs(2)`](http://man7.org/linux/man-pages/man2/statfs.2). Возвращает информацию о смонтированной файловой системе, содержащей `path`.

В случае ошибки, `err.code` будет одним из [Общих системных ошибок](/ru/nodejs/api/errors#common-system-errors).

### `fs.symlinkSync(target, path[, type])` {#fssymlinksynctarget-path-type}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.0.0 | Если аргумент `type` не определен, Node автоматически определит тип `target` и автоматически выберет `dir` или `file`. |
| v7.6.0 | Параметры `target` и `path` могут быть объектами WHATWG `URL`, использующими протокол `file:`. Поддержка в настоящее время все еще *экспериментальная*. |
| v0.1.31 | Добавлено в версии: v0.1.31 |
:::

- `target` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`

Возвращает `undefined`.

Для получения подробной информации, см. документацию асинхронной версии этого API: [`fs.symlink()`](/ru/nodejs/api/fs#fssymlinktarget-path-type-callback).


### `fs.truncateSync(path[, len])` {#fstruncatesyncpath-len}

**Добавлено в версии: v0.8.6**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `len` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`

Усекает файл. Возвращает `undefined`. Файловый дескриптор также может быть передан в качестве первого аргумента. В этом случае вызывается `fs.ftruncateSync()`.

Передача файлового дескриптора является устаревшей и в будущем может привести к возникновению ошибки.

### `fs.unlinkSync(path)` {#fsunlinksyncpath}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v0.1.21 | Добавлено в версии: v0.1.21 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)

Синхронная версия [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2). Возвращает `undefined`.

### `fs.utimesSync(path, atime, mtime)` {#fsutimessyncpath-atime-mtime}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | `NaN`, `Infinity` и `-Infinity` больше не являются допустимыми спецификаторами времени. |
| v7.6.0 | Параметр `path` может быть объектом WHATWG `URL` с использованием протокола `file:`. |
| v4.1.0 | Числовые строки, `NaN` и `Infinity` теперь являются допустимыми спецификаторами времени. |
| v0.4.2 | Добавлено в версии: v0.4.2 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api)
- `atime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- `mtime` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Возвращает `undefined`.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.utimes()`](/ru/nodejs/api/fs#fsutimespath-atime-mtime-callback).


### `fs.writeFileSync(file, data[, options])` {#fswritefilesyncfile-data-options}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v21.0.0, v20.10.0 | Теперь поддерживается опция `flush`. |
| v19.0.0 | Передача в параметр `data` объекта с собственной функцией `toString` больше не поддерживается. |
| v17.8.0 | Передача в параметр `data` объекта с собственной функцией `toString` устарела. |
| v14.12.0 | Параметр `data` будет преобразовывать в строку объект с явной функцией `toString`. |
| v14.0.0 | Параметр `data` больше не будет приводить неподдерживаемый ввод к строкам. |
| v10.10.0 | Параметр `data` теперь может быть любым `TypedArray` или `DataView`. |
| v7.4.0 | Параметр `data` теперь может быть `Uint8Array`. |
| v5.0.0 | Параметр `file` теперь может быть файловым дескриптором. |
| v0.1.29 | Добавлено в версии: v0.1.29 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) имя файла или файловый дескриптор
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `'utf8'`
    - `mode` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0o666`
    - `flag` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) См. [поддержку флагов файловой системы](/ru/nodejs/api/fs#file-system-flags). **По умолчанию:** `'w'`.
    - `flush` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если все данные успешно записаны в файл, и `flush` имеет значение `true`, используется `fs.fsyncSync()` для сброса данных на диск.

Возвращает `undefined`.

Параметр `mode` влияет только на вновь созданный файл. Подробнее см. [`fs.open()`](/ru/nodejs/api/fs#fsopenpath-flags-mode-callback).

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.writeFile()`](/ru/nodejs/api/fs#fswritefilefile-data-options-callback).


### `fs.writeSync(fd, buffer, offset[, length[, position]])` {#fswritesyncfd-buffer-offset-length-position}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Параметр `buffer` больше не будет приводить неподдерживаемые входные данные к строкам. |
| v10.10.0 | Параметр `buffer` теперь может быть любым `TypedArray` или `DataView`. |
| v7.4.0 | Параметр `buffer` теперь может быть `Uint8Array`. |
| v7.2.0 | Параметры `offset` и `length` теперь являются необязательными. |
| v0.1.21 | Добавлено в версии: v0.1.21 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.byteLength - offset`
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество записанных байтов.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.write(fd, buffer...)`](/ru/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).

### `fs.writeSync(fd, buffer[, options])` {#fswritesyncfd-buffer-options}

**Добавлено в версии: v18.3.0, v16.17.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `0`
    - `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `buffer.byteLength - offset`
    - `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `null`
  
 
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество записанных байтов.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.write(fd, buffer...)`](/ru/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback).


### `fs.writeSync(fd, string[, position[, encoding]])` {#fswritesyncfd-string-position-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0 | Параметр `string` больше не будет приводить неподдерживаемый ввод к строкам. |
| v7.2.0 | Параметр `position` теперь является необязательным. |
| v0.11.5 | Добавлено в версии: v0.11.5 |
:::

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **По умолчанию:** `'utf8'`
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество записанных байтов.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.write(fd, string...)`](/ru/nodejs/api/fs#fswritefd-string-position-encoding-callback).

### `fs.writevSync(fd, buffers[, position])` {#fswritevsyncfd-buffers-position}

**Добавлено в версии: v12.9.0**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `buffers` [\<ArrayBufferView[]\>](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView)
- `position` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) **По умолчанию:** `null`
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество записанных байтов.

Для получения подробной информации см. документацию асинхронной версии этого API: [`fs.writev()`](/ru/nodejs/api/fs#fswritevfd-buffers-position-callback).

## Общие объекты {#common-objects}

Общие объекты используются всеми вариантами API файловой системы (promise, callback и synchronous).


### Класс: `fs.Dir` {#class-fsdir}

**Добавлено в: v12.12.0**

Класс, представляющий поток директории.

Создается с помощью [`fs.opendir()`](/ru/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/ru/nodejs/api/fs#fsopendirsyncpath-options), или [`fsPromises.opendir()`](/ru/nodejs/api/fs#fspromisesopendirpath-options).

```js [ESM]
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```
При использовании асинхронного итератора объект [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir) будет автоматически закрыт после выхода итератора.

#### `dir.close()` {#dirclose}

**Добавлено в: v12.12.0**

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Асинхронно закрывает базовый дескриптор ресурса директории. Последующие чтения приведут к ошибкам.

Возвращается promise, который будет выполнен после закрытия ресурса.

#### `dir.close(callback)` {#dirclosecallback}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного колбэка в аргумент `callback` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v12.12.0 | Добавлено в: v12.12.0 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  
 

Асинхронно закрывает базовый дескриптор ресурса директории. Последующие чтения приведут к ошибкам.

`callback` будет вызван после закрытия дескриптора ресурса.

#### `dir.closeSync()` {#dirclosesync}

**Добавлено в: v12.12.0**

Синхронно закрывает базовый дескриптор ресурса директории. Последующие чтения приведут к ошибкам.

#### `dir.path` {#dirpath}

**Добавлено в: v12.12.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Путь только для чтения к этой директории, как он был предоставлен в [`fs.opendir()`](/ru/nodejs/api/fs#fsopendirpath-options-callback), [`fs.opendirSync()`](/ru/nodejs/api/fs#fsopendirsyncpath-options), или [`fsPromises.opendir()`](/ru/nodejs/api/fs#fspromisesopendirpath-options).


#### `dir.read()` {#dirread}

**Добавлено в: v12.12.0**

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Разрешается с [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Асинхронно считывает следующую запись каталога через [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) как [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent).

Возвращается промис, который будет выполнен с [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) или `null`, если больше нет записей для чтения.

Записи каталога, возвращаемые этой функцией, не упорядочены каким-либо образом, как это предусмотрено базовыми механизмами каталога операционной системы. Записи, добавленные или удаленные во время итерации по каталогу, могут не включаться в результаты итерации.

#### `dir.read(callback)` {#dirreadcallback}

**Добавлено в: v12.12.0**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `dirent` [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Асинхронно считывает следующую запись каталога через [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) как [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent).

После завершения чтения будет вызвана функция `callback` с [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) или `null`, если больше нет записей для чтения.

Записи каталога, возвращаемые этой функцией, не упорядочены каким-либо образом, как это предусмотрено базовыми механизмами каталога операционной системы. Записи, добавленные или удаленные во время итерации по каталогу, могут не включаться в результаты итерации.

#### `dir.readSync()` {#dirreadsync}

**Добавлено в: v12.12.0**

- Возвращает: [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Синхронно считывает следующую запись каталога как [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent). См. документацию POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3) для получения более подробной информации.

Если больше нет записей каталога для чтения, будет возвращено значение `null`.

Записи каталога, возвращаемые этой функцией, не упорядочены каким-либо образом, как это предусмотрено базовыми механизмами каталога операционной системы. Записи, добавленные или удаленные во время итерации по каталогу, могут не включаться в результаты итерации.


#### `dir[Symbol.asyncIterator]()` {#dirsymbolasynciterator}

**Добавлено в версии: v12.12.0**

- Возвращает: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface) Асинхронный итератор [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent)

Асинхронно выполняет итерацию по каталогу, пока не будут прочитаны все записи. Подробную информацию см. в документации POSIX [`readdir(3)`](http://man7.org/linux/man-pages/man3/readdir.3).

Записи, возвращаемые асинхронным итератором, всегда являются [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent). Случай `null` из `dir.read()` обрабатывается внутри.

См. пример в разделе [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir).

Записи каталога, возвращаемые этим итератором, не упорядочены каким-либо образом, как это предусмотрено базовыми механизмами каталога операционной системы. Записи, добавленные или удаленные во время итерации по каталогу, могут не быть включены в результаты итерации.

### Класс: `fs.Dirent` {#class-fsdirent}

**Добавлено в версии: v10.10.0**

Представление записи каталога, которая может быть файлом или подкаталогом внутри каталога, как возвращается при чтении из [\<fs.Dir\>](/ru/nodejs/api/fs#class-fsdir). Запись каталога представляет собой комбинацию имени файла и пар типа файла.

Кроме того, когда [`fs.readdir()`](/ru/nodejs/api/fs#fsreaddirpath-options-callback) или [`fs.readdirSync()`](/ru/nodejs/api/fs#fsreaddirsyncpath-options) вызываются с параметром `withFileTypes`, установленным в `true`, результирующий массив заполняется объектами [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent), а не строками или [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)ами.

#### `dirent.isBlockDevice()` {#direntisblockdevice}

**Добавлено в версии: v10.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) описывает блочное устройство.

#### `dirent.isCharacterDevice()` {#direntischaracterdevice}

**Добавлено в версии: v10.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) описывает символьное устройство.


#### `dirent.isDirectory()` {#direntisdirectory}

**Добавлено в версии: v10.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) описывает каталог в файловой системе.

#### `dirent.isFIFO()` {#direntisfifo}

**Добавлено в версии: v10.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) описывает канал FIFO (first-in-first-out).

#### `dirent.isFile()` {#direntisfile}

**Добавлено в версии: v10.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) описывает обычный файл.

#### `dirent.isSocket()` {#direntissocket}

**Добавлено в версии: v10.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) описывает сокет.

#### `dirent.isSymbolicLink()` {#direntissymboliclink}

**Добавлено в версии: v10.10.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent) описывает символическую ссылку.

#### `dirent.name` {#direntname}

**Добавлено в версии: v10.10.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Имя файла, на который ссылается данный объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent). Тип этого значения определяется параметром `options.encoding`, переданным в [`fs.readdir()`](/ru/nodejs/api/fs#fsreaddirpath-options-callback) или [`fs.readdirSync()`](/ru/nodejs/api/fs#fsreaddirsyncpath-options).

#### `dirent.parentPath` {#direntparentpath}

**Добавлено в версии: v21.4.0, v20.12.0, v18.20.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Путь к родительскому каталогу файла, на который ссылается этот объект [\<fs.Dirent\>](/ru/nodejs/api/fs#class-fsdirent).


#### `dirent.path` {#direntpath}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.2.0 | Свойство больше не является доступным только для чтения. |
| v23.0.0 | Доступ к этому свойству вызывает предупреждение. Теперь оно доступно только для чтения. |
| v21.5.0, v20.12.0, v18.20.0 | Устарело с версии: v21.5.0, v20.12.0, v18.20.0 |
| v20.1.0, v18.17.0 | Добавлено в версии: v20.1.0, v18.17.0 |
:::

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`dirent.parentPath`](/ru/nodejs/api/fs#direntparentpath) вместо этого.
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Псевдоним для `dirent.parentPath`.

### Класс: `fs.FSWatcher` {#class-fsfswatcher}

**Добавлено в версии: v0.5.8**

- Расширяет [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Успешный вызов метода [`fs.watch()`](/ru/nodejs/api/fs#fswatchfilename-options-listener) вернет новый объект [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher).

Все объекты [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher) генерируют событие `'change'` всякий раз, когда конкретный отслеживаемый файл изменяется.

#### Событие: `'change'` {#event-change}

**Добавлено в версии: v0.5.8**

- `eventType` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип произошедшего события изменения
- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Имя файла, который был изменен (если уместно/доступно)

Генерируется, когда что-то меняется в отслеживаемом каталоге или файле. Подробнее см. в [`fs.watch()`](/ru/nodejs/api/fs#fswatchfilename-options-listener).

Аргумент `filename` может быть не предоставлен в зависимости от поддержки операционной системы. Если `filename` предоставлен, он будет предоставлен в виде [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), если `fs.watch()` вызывается с параметром `encoding`, установленным в `'buffer'`, в противном случае `filename` будет строкой UTF-8.

```js [ESM]
import { watch } from 'node:fs';
// Пример обработки через прослушиватель fs.watch()
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Выводит: <Buffer ...>
  }
});
```

#### Событие: `'close'` {#event-close_1}

**Добавлено в версии: v10.0.0**

Генерируется, когда наблюдатель прекращает отслеживание изменений. Закрытый объект [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher) больше не может использоваться в обработчике событий.

#### Событие: `'error'` {#event-error}

**Добавлено в версии: v0.5.8**

- `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Генерируется, когда во время наблюдения за файлом происходит ошибка. Объект [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher), вызвавший ошибку, больше не может использоваться в обработчике событий.

#### `watcher.close()` {#watcherclose}

**Добавлено в версии: v0.5.8**

Прекращает отслеживание изменений в данном [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher). После остановки объект [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher) больше не может использоваться.

#### `watcher.ref()` {#watcherref}

**Добавлено в версии: v14.3.0, v12.20.0**

- Возвращает: [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher)

При вызове запрашивает, чтобы цикл событий Node.js *не* завершался до тех пор, пока [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher) активен. Многократный вызов `watcher.ref()` не оказывает никакого эффекта.

По умолчанию все объекты [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher) имеют состояние "ref'ed", поэтому обычно нет необходимости вызывать `watcher.ref()`, если только ранее не был вызван `watcher.unref()`.

#### `watcher.unref()` {#watcherunref}

**Добавлено в версии: v14.3.0, v12.20.0**

- Возвращает: [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher)

При вызове активный объект [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher) больше не требует, чтобы цикл событий Node.js оставался активным. Если нет другой активности, поддерживающей работу цикла событий, процесс может завершиться до вызова обратного вызова объекта [\<fs.FSWatcher\>](/ru/nodejs/api/fs#class-fsfswatcher). Многократный вызов `watcher.unref()` не оказывает никакого эффекта.

### Класс: `fs.StatWatcher` {#class-fsstatwatcher}

**Добавлено в версии: v14.3.0, v12.20.0**

- Наследуется от [\<EventEmitter\>](/ru/nodejs/api/events#class-eventemitter)

Успешный вызов метода `fs.watchFile()` вернет новый объект [\<fs.StatWatcher\>](/ru/nodejs/api/fs#class-fsstatwatcher).

#### `watcher.ref()` {#watcherref_1}

**Добавлено в версии: v14.3.0, v12.20.0**

- Возвращает: [\<fs.StatWatcher\>](/ru/nodejs/api/fs#class-fsstatwatcher)

При вызове запрашивает, чтобы цикл событий Node.js *не* завершался до тех пор, пока [\<fs.StatWatcher\>](/ru/nodejs/api/fs#class-fsstatwatcher) активен. Многократный вызов `watcher.ref()` не оказывает никакого эффекта.

По умолчанию все объекты [\<fs.StatWatcher\>](/ru/nodejs/api/fs#class-fsstatwatcher) имеют состояние "ref'ed", поэтому обычно нет необходимости вызывать `watcher.ref()`, если только ранее не был вызван `watcher.unref()`.


#### `watcher.unref()` {#watcherunref_1}

**Добавлено в: v14.3.0, v12.20.0**

- Возвращает: [\<fs.StatWatcher\>](/ru/nodejs/api/fs#class-fsstatwatcher)

При вызове активный объект [\<fs.StatWatcher\>](/ru/nodejs/api/fs#class-fsstatwatcher) не потребует, чтобы цикл событий Node.js оставался активным. Если нет другой активности, поддерживающей работу цикла событий, процесс может завершиться до вызова обратного вызова объекта [\<fs.StatWatcher\>](/ru/nodejs/api/fs#class-fsstatwatcher). Многократный вызов `watcher.unref()` не даст никакого эффекта.

### Класс: `fs.ReadStream` {#class-fsreadstream}

**Добавлено в: v0.1.93**

- Расширяет: [\<stream.Readable\>](/ru/nodejs/api/stream#class-streamreadable)

Экземпляры [\<fs.ReadStream\>](/ru/nodejs/api/fs#class-fsreadstream) создаются и возвращаются с использованием функции [`fs.createReadStream()`](/ru/nodejs/api/fs#fscreatereadstreampath-options).

#### Событие: `'close'` {#event-close_2}

**Добавлено в: v0.1.93**

Генерируется, когда закрыт базовый файловый дескриптор [\<fs.ReadStream\>](/ru/nodejs/api/fs#class-fsreadstream).

#### Событие: `'open'` {#event-open}

**Добавлено в: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Целочисленный файловый дескриптор, используемый [\<fs.ReadStream\>](/ru/nodejs/api/fs#class-fsreadstream).

Генерируется, когда открыт файловый дескриптор [\<fs.ReadStream\>](/ru/nodejs/api/fs#class-fsreadstream).

#### Событие: `'ready'` {#event-ready}

**Добавлено в: v9.11.0**

Генерируется, когда [\<fs.ReadStream\>](/ru/nodejs/api/fs#class-fsreadstream) готов к использованию.

Вызывается сразу после `'open'`.

#### `readStream.bytesRead` {#readstreambytesread}

**Добавлено в: v6.4.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Количество байтов, прочитанных на данный момент.

#### `readStream.path` {#readstreampath}

**Добавлено в: v0.1.93**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Путь к файлу, из которого поток считывает данные, как указано в первом аргументе `fs.createReadStream()`. Если `path` передан в виде строки, то `readStream.path` будет строкой. Если `path` передан в виде [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), то `readStream.path` будет [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer). Если указан `fd`, то `readStream.path` будет `undefined`.


#### `readStream.pending` {#readstreampending}

**Добавлено в: v11.2.0, v10.16.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Это свойство имеет значение `true`, если базовый файл еще не открыт, то есть до того, как будет сгенерировано событие `'ready'`.

### Класс: `fs.Stats` {#class-fsstats}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Публичный конструктор устарел. |
| v8.1.0 | Добавлено время в виде чисел. |
| v0.1.21 | Добавлено в: v0.1.21 |
:::

Объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) предоставляет информацию о файле.

Объекты, возвращаемые из [`fs.stat()`](/ru/nodejs/api/fs#fsstatpath-options-callback), [`fs.lstat()`](/ru/nodejs/api/fs#fslstatpath-options-callback), [`fs.fstat()`](/ru/nodejs/api/fs#fsfstatfd-options-callback) и их синхронных аналогов, имеют этот тип. Если `bigint` в `options`, переданных этим методам, имеет значение true, числовые значения будут `bigint` вместо `number`, и объект будет содержать дополнительные свойства с наносекундной точностью и суффиксом `Ns`. Объекты `Stat` не должны создаваться напрямую с использованием ключевого слова `new`.

```bash [BASH]
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```
`bigint` версия:

```bash [BASH]
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT }
```

#### `stats.isBlockDevice()` {#statsisblockdevice}

**Добавлено в: v0.1.10**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) описывает блочное устройство.

#### `stats.isCharacterDevice()` {#statsischaracterdevice}

**Добавлено в: v0.1.10**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) описывает символьное устройство.

#### `stats.isDirectory()` {#statsisdirectory}

**Добавлено в: v0.1.10**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) описывает директорию файловой системы.

Если объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) был получен в результате вызова [`fs.lstat()`](/ru/nodejs/api/fs#fslstatpath-options-callback) на символьной ссылке, которая разрешается в директорию, этот метод вернет `false`. Это потому, что [`fs.lstat()`](/ru/nodejs/api/fs#fslstatpath-options-callback) возвращает информацию о самой символьной ссылке, а не о пути, в который она разрешается.

#### `stats.isFIFO()` {#statsisfifo}

**Добавлено в: v0.1.10**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) описывает канал FIFO (first-in-first-out).

#### `stats.isFile()` {#statsisfile}

**Добавлено в: v0.1.10**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) описывает обычный файл.

#### `stats.isSocket()` {#statsissocket}

**Добавлено в: v0.1.10**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) описывает сокет.

#### `stats.isSymbolicLink()` {#statsissymboliclink}

**Добавлено в: v0.1.10**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если объект [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) описывает символическую ссылку.

Этот метод действителен только при использовании [`fs.lstat()`](/ru/nodejs/api/fs#fslstatpath-options-callback).


#### `stats.dev` {#statsdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Числовой идентификатор устройства, содержащего файл.

#### `stats.ino` {#statsino}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Специфический для файловой системы номер "Inode" для файла.

#### `stats.mode` {#statsmode}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Битовое поле, описывающее тип и режим файла.

#### `stats.nlink` {#statsnlink}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Количество жестких ссылок, существующих для файла.

#### `stats.uid` {#statsuid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Числовой идентификатор пользователя, которому принадлежит файл (POSIX).

#### `stats.gid` {#statsgid}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Числовой идентификатор группы, которой принадлежит файл (POSIX).

#### `stats.rdev` {#statsrdev}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Числовой идентификатор устройства, если файл представляет собой устройство.

#### `stats.size` {#statssize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Размер файла в байтах.

Если базовая файловая система не поддерживает получение размера файла, это будет `0`.


#### `stats.blksize` {#statsblksize}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Размер блока файловой системы для операций ввода-вывода.

#### `stats.blocks` {#statsblocks}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Количество блоков, выделенных для этого файла.

#### `stats.atimeMs` {#statsatimems}

**Добавлено в: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Временная метка, указывающая время последнего доступа к этому файлу, выраженное в миллисекундах с эпохи POSIX.

#### `stats.mtimeMs` {#statsmtimems}

**Добавлено в: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Временная метка, указывающая время последнего изменения этого файла, выраженное в миллисекундах с эпохи POSIX.

#### `stats.ctimeMs` {#statsctimems}

**Добавлено в: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Временная метка, указывающая время последнего изменения статуса файла, выраженное в миллисекундах с эпохи POSIX.

#### `stats.birthtimeMs` {#statsbirthtimems}

**Добавлено в: v8.1.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Временная метка, указывающая время создания этого файла, выраженное в миллисекундах с эпохи POSIX.

#### `stats.atimeNs` {#statsatimens}

**Добавлено в: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Присутствует только тогда, когда в метод, генерирующий объект, передано `bigint: true`. Временная метка, указывающая время последнего доступа к этому файлу, выраженное в наносекундах с эпохи POSIX.


#### `stats.mtimeNs` {#statsmtimens}

**Добавлено в: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Присутствует только тогда, когда в метод, генерирующий объект, передается `bigint: true`. Метка времени, указывающая время последнего изменения этого файла, выраженное в наносекундах с эпохи POSIX.

#### `stats.ctimeNs` {#statsctimens}

**Добавлено в: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Присутствует только тогда, когда в метод, генерирующий объект, передается `bigint: true`. Метка времени, указывающая время последнего изменения статуса файла, выраженное в наносекундах с эпохи POSIX.

#### `stats.birthtimeNs` {#statsbirthtimens}

**Добавлено в: v12.10.0**

- [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Присутствует только тогда, когда в метод, генерирующий объект, передается `bigint: true`. Метка времени, указывающая время создания этого файла, выраженное в наносекундах с эпохи POSIX.

#### `stats.atime` {#statsatime}

**Добавлено в: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Метка времени, указывающая время последнего доступа к этому файлу.

#### `stats.mtime` {#statsmtime}

**Добавлено в: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Метка времени, указывающая время последнего изменения этого файла.

#### `stats.ctime` {#statsctime}

**Добавлено в: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Метка времени, указывающая время последнего изменения статуса файла.

#### `stats.birthtime` {#statsbirthtime}

**Добавлено в: v0.11.13**

- [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Метка времени, указывающая время создания этого файла.

#### Значения времени Stat {#stat-time-values}

Свойства `atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` являются числовыми значениями, которые содержат соответствующие времена в миллисекундах. Их точность зависит от платформы. Когда `bigint: true` передается в метод, который генерирует объект, свойства будут [bigint](https://tc39.github.io/proposal-bigint), в противном случае они будут [числами](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type).

Свойства `atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` являются [bigint](https://tc39.github.io/proposal-bigint), которые содержат соответствующие времена в наносекундах. Они присутствуют только тогда, когда `bigint: true` передается в метод, который генерирует объект. Их точность зависит от платформы.

`atime`, `mtime`, `ctime` и `birthtime` являются альтернативными представлениями [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) различных времен. Значения `Date` и число не связаны. Присвоение нового числового значения или изменение значения `Date` не будет отражено в соответствующем альтернативном представлении.

Время в объекте stat имеет следующую семантику:

- `atime` "Время доступа": Время последнего доступа к данным файла. Изменяется системными вызовами [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) и [`read(2)`](http://man7.org/linux/man-pages/man2/read.2).
- `mtime` "Время изменения": Время последнего изменения данных файла. Изменяется системными вызовами [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2) и [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `ctime` "Время изменения": Время последнего изменения статуса файла (модификация данных inode). Изменяется системными вызовами [`chmod(2)`](http://man7.org/linux/man-pages/man2/chmod.2), [`chown(2)`](http://man7.org/linux/man-pages/man2/chown.2), [`link(2)`](http://man7.org/linux/man-pages/man2/link.2), [`mknod(2)`](http://man7.org/linux/man-pages/man2/mknod.2), [`rename(2)`](http://man7.org/linux/man-pages/man2/rename.2), [`unlink(2)`](http://man7.org/linux/man-pages/man2/unlink.2), [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2), [`read(2)`](http://man7.org/linux/man-pages/man2/read.2) и [`write(2)`](http://man7.org/linux/man-pages/man2/write.2).
- `birthtime` "Время создания": Время создания файла. Устанавливается один раз при создании файла. В файловых системах, где birthtime недоступно, это поле может вместо этого содержать либо `ctime`, либо `1970-01-01T00:00Z` (то есть метку времени Unix-эпохи `0`). В этом случае это значение может быть больше, чем `atime` или `mtime`. В Darwin и других вариантах FreeBSD также устанавливается, если `atime` явно установлено в более раннее значение, чем текущее `birthtime`, с помощью системного вызова [`utimes(2)`](http://man7.org/linux/man-pages/man2/utimes.2).

До Node.js 0.12, `ctime` содержал `birthtime` в системах Windows. Начиная с 0.12, `ctime` не является "временем создания", и в системах Unix им никогда не было.


### Класс: `fs.StatFs` {#class-fsstatfs}

**Добавлено в версии: v19.6.0, v18.15.0**

Предоставляет информацию о смонтированной файловой системе.

Объекты, возвращаемые из [`fs.statfs()`](/ru/nodejs/api/fs#fsstatfspath-options-callback) и ее синхронного аналога, имеют этот тип. Если `bigint` в `options`, переданных этим методам, имеет значение `true`, числовые значения будут `bigint` вместо `number`.

```bash [BASH]
StatFs {
  type: 1397114950,
  bsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```
Версия `bigint`:

```bash [BASH]
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```
#### `statfs.bavail` {#statfsbavail}

**Добавлено в версии: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Свободные блоки, доступные непривилегированным пользователям.

#### `statfs.bfree` {#statfsbfree}

**Добавлено в версии: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Свободные блоки в файловой системе.

#### `statfs.blocks` {#statfsblocks}

**Добавлено в версии: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Общее количество блоков данных в файловой системе.

#### `statfs.bsize` {#statfsbsize}

**Добавлено в версии: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Оптимальный размер блока передачи.

#### `statfs.ffree` {#statfsffree}

**Добавлено в версии: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Свободные файловые узлы в файловой системе.


#### `statfs.files` {#statfsfiles}

**Добавлено в: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Общее количество файловых узлов в файловой системе.

#### `statfs.type` {#statfstype}

**Добавлено в: v19.6.0, v18.15.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Тип файловой системы.

### Класс: `fs.WriteStream` {#class-fswritestream}

**Добавлено в: v0.1.93**

- Наследует [\<stream.Writable\>](/ru/nodejs/api/stream#class-streamwritable)

Экземпляры [\<fs.WriteStream\>](/ru/nodejs/api/fs#class-fswritestream) создаются и возвращаются с помощью функции [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options).

#### Событие: `'close'` {#event-close_3}

**Добавлено в: v0.1.93**

Генерируется, когда базовый файловый дескриптор [\<fs.WriteStream\>](/ru/nodejs/api/fs#class-fswritestream) был закрыт.

#### Событие: `'open'` {#event-open_1}

**Добавлено в: v0.1.93**

- `fd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Целочисленный файловый дескриптор, используемый [\<fs.WriteStream\>](/ru/nodejs/api/fs#class-fswritestream).

Генерируется, когда файл [\<fs.WriteStream\>](/ru/nodejs/api/fs#class-fswritestream) открыт.

#### Событие: `'ready'` {#event-ready_1}

**Добавлено в: v9.11.0**

Генерируется, когда [\<fs.WriteStream\>](/ru/nodejs/api/fs#class-fswritestream) готов к использованию.

Срабатывает сразу после `'open'`.

#### `writeStream.bytesWritten` {#writestreambyteswritten}

**Добавлено в: v0.4.7**

Количество записанных к настоящему моменту байтов. Не включает данные, которые все еще находятся в очереди на запись.

#### `writeStream.close([callback])` {#writestreamclosecallback}

**Добавлено в: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)

Закрывает `writeStream`. Необязательно принимает обратный вызов, который будет выполнен после закрытия `writeStream`.


#### `writeStream.path` {#writestreampath}

**Добавлено в версии: v0.1.93**

Путь к файлу, в который поток записывает данные, указанный в качестве первого аргумента в [`fs.createWriteStream()`](/ru/nodejs/api/fs#fscreatewritestreampath-options). Если `path` передается в виде строки, то `writeStream.path` будет строкой. Если `path` передается в виде [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), то `writeStream.path` будет [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer).

#### `writeStream.pending` {#writestreampending}

**Добавлено в версии: v11.2.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Это свойство имеет значение `true`, если базовый файл еще не был открыт, т.е. до того, как будет сгенерировано событие `'ready'`.

### `fs.constants` {#fsconstants}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает объект, содержащий часто используемые константы для операций с файловой системой.

#### Константы FS {#fs-constants}

Следующие константы экспортируются `fs.constants` и `fsPromises.constants`.

Не каждая константа будет доступна в каждой операционной системе; это особенно важно для Windows, где многие специфичные для POSIX определения недоступны. Для переносимых приложений рекомендуется проверять их наличие перед использованием.

Чтобы использовать более одной константы, используйте побитовое ИЛИ `|`.

Пример:

```js [ESM]
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```
##### Константы доступа к файлам {#file-access-constants}

Следующие константы предназначены для использования в качестве параметра `mode`, передаваемого в [`fsPromises.access()`](/ru/nodejs/api/fs#fspromisesaccesspath-mode), [`fs.access()`](/ru/nodejs/api/fs#fsaccesspath-mode-callback) и [`fs.accessSync()`](/ru/nodejs/api/fs#fsaccesssyncpath-mode).

| Константа | Описание |
| --- | --- |
| `F_OK` | Флаг, указывающий, что файл виден вызывающему процессу.  Это полезно для определения существования файла, но ничего не говорит о разрешениях `rwx`. Значение по умолчанию, если режим не указан. |
| `R_OK` | Флаг, указывающий, что файл может быть прочитан вызывающим процессом. |
| `W_OK` | Флаг, указывающий, что файл может быть записан вызывающим процессом. |
| `X_OK` | Флаг, указывающий, что файл может быть выполнен вызывающим процессом.  Это не влияет на Windows (будет вести себя как `fs.constants.F_OK`). |
Определения также доступны в Windows.


##### Константы для копирования файлов {#file-copy-constants}

Следующие константы предназначены для использования с [`fs.copyFile()`](/ru/nodejs/api/fs#fscopyfilesrc-dest-mode-callback).

| Константа | Описание |
| --- | --- |
| `COPYFILE_EXCL` | Если присутствует, операция копирования завершится с ошибкой, если путь назначения уже существует. |
| `COPYFILE_FICLONE` | Если присутствует, операция копирования попытается создать reflink copy-on-write. Если базовая платформа не поддерживает copy-on-write, используется резервный механизм копирования. |
| `COPYFILE_FICLONE_FORCE` | Если присутствует, операция копирования попытается создать reflink copy-on-write. Если базовая платформа не поддерживает copy-on-write, операция завершится с ошибкой. |
Определения также доступны в Windows.

##### Константы для открытия файлов {#file-open-constants}

Следующие константы предназначены для использования с `fs.open()`.

| Константа | Описание |
| --- | --- |
| `O_RDONLY` | Флаг, указывающий на открытие файла только для чтения. |
| `O_WRONLY` | Флаг, указывающий на открытие файла только для записи. |
| `O_RDWR` | Флаг, указывающий на открытие файла для чтения и записи. |
| `O_CREAT` | Флаг, указывающий на создание файла, если он еще не существует. |
| `O_EXCL` | Флаг, указывающий, что открытие файла должно завершиться неудачей, если установлен флаг `O_CREAT` и файл уже существует. |
| `O_NOCTTY` | Флаг, указывающий, что если путь идентифицирует терминальное устройство, открытие пути не должно приводить к тому, что этот терминал станет управляющим терминалом для процесса (если у процесса еще нет его). |
| `O_TRUNC` | Флаг, указывающий, что если файл существует и является обычным файлом, и файл успешно открыт для записи, его длина должна быть усечена до нуля. |
| `O_APPEND` | Флаг, указывающий, что данные будут добавлены в конец файла. |
| `O_DIRECTORY` | Флаг, указывающий, что открытие должно завершиться неудачей, если путь не является каталогом. |
| `O_NOATIME` | Флаг, указывающий, что операции чтения в файловой системе больше не приведут к обновлению информации `atime`, связанной с файлом. Этот флаг доступен только в операционных системах Linux. |
| `O_NOFOLLOW` | Флаг, указывающий, что открытие должно завершиться неудачей, если путь является символической ссылкой. |
| `O_SYNC` | Флаг, указывающий, что файл открыт для синхронизированного ввода-вывода с операциями записи, ожидающими целостности файла. |
| `O_DSYNC` | Флаг, указывающий, что файл открыт для синхронизированного ввода-вывода с операциями записи, ожидающими целостности данных. |
| `O_SYMLINK` | Флаг, указывающий на открытие самой символической ссылки, а не ресурса, на который она указывает. |
| `O_DIRECT` | Если установлено, будет предпринята попытка минимизировать эффекты кэширования ввода-вывода файла. |
| `O_NONBLOCK` | Флаг, указывающий на открытие файла в неблокирующем режиме, когда это возможно. |
| `UV_FS_O_FILEMAP` | Если установлено, для доступа к файлу используется отображение файла в памяти. Этот флаг доступен только в операционных системах Windows. В других операционных системах этот флаг игнорируется. |
В Windows доступны только `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_RDONLY`, `O_RDWR`, `O_TRUNC`, `O_WRONLY` и `UV_FS_O_FILEMAP`.


##### Константы типов файлов {#file-type-constants}

Следующие константы предназначены для использования со свойством `mode` объекта [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для определения типа файла.

| Константа | Описание |
| --- | --- |
| `S_IFMT` | Битовая маска, используемая для извлечения кода типа файла. |
| `S_IFREG` | Константа типа файла для обычного файла. |
| `S_IFDIR` | Константа типа файла для каталога. |
| `S_IFCHR` | Константа типа файла для файла символьного устройства. |
| `S_IFBLK` | Константа типа файла для файла блочного устройства. |
| `S_IFIFO` | Константа типа файла для FIFO/pipe. |
| `S_IFLNK` | Константа типа файла для символической ссылки. |
| `S_IFSOCK` | Константа типа файла для сокета. |
В Windows доступны только `S_IFCHR`, `S_IFDIR`, `S_IFLNK`, `S_IFMT` и `S_IFREG`.

##### Константы режима файла {#file-mode-constants}

Следующие константы предназначены для использования со свойством `mode` объекта [\<fs.Stats\>](/ru/nodejs/api/fs#class-fsstats) для определения прав доступа к файлу.

| Константа | Описание |
| --- | --- |
| `S_IRWXU` | Режим файла, указывающий на возможность чтения, записи и выполнения владельцем. |
| `S_IRUSR` | Режим файла, указывающий на возможность чтения владельцем. |
| `S_IWUSR` | Режим файла, указывающий на возможность записи владельцем. |
| `S_IXUSR` | Режим файла, указывающий на возможность выполнения владельцем. |
| `S_IRWXG` | Режим файла, указывающий на возможность чтения, записи и выполнения группой. |
| `S_IRGRP` | Режим файла, указывающий на возможность чтения группой. |
| `S_IWGRP` | Режим файла, указывающий на возможность записи группой. |
| `S_IXGRP` | Режим файла, указывающий на возможность выполнения группой. |
| `S_IRWXO` | Режим файла, указывающий на возможность чтения, записи и выполнения другими. |
| `S_IROTH` | Режим файла, указывающий на возможность чтения другими. |
| `S_IWOTH` | Режим файла, указывающий на возможность записи другими. |
| `S_IXOTH` | Режим файла, указывающий на возможность выполнения другими. |
В Windows доступны только `S_IRUSR` и `S_IWUSR`.

## Заметки {#notes}

### Порядок операций на основе обратных вызовов и промисов {#ordering-of-callback-and-promise-based-operations}

Поскольку они выполняются асинхронно базовым пулом потоков, нет гарантированного порядка при использовании методов на основе обратных вызовов или промисов.

Например, следующее подвержено ошибкам, поскольку операция `fs.stat()` может завершиться до операции `fs.rename()`:

```js [ESM]
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```
Важно правильно упорядочить операции, дождавшись результатов одной, прежде чем вызывать другую:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```
:::

Или, при использовании API обратных вызовов, переместите вызов `fs.stat()` в обратный вызов операции `fs.rename()`:



::: code-group
```js [ESM]
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```js [CJS]
const { rename, stat } = require('node:fs/promises');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```
:::


### Пути к файлам {#file-paths}

Большинство операций `fs` принимают пути к файлам, которые могут быть указаны в виде строки, [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) или объекта [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) с использованием протокола `file:`.

#### Строковые пути {#string-paths}

Строковые пути интерпретируются как последовательности символов UTF-8, идентифицирующие абсолютное или относительное имя файла. Относительные пути будут разрешаться относительно текущего рабочего каталога, определяемого вызовом `process.cwd()`.

Пример использования абсолютного пути в POSIX:

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
```
Пример использования относительного пути в POSIX (относительно `process.cwd()`):

```js [ESM]
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
```
#### Пути File URL {#file-url-paths}

**Добавлено в: v7.6.0**

Для большинства функций модуля `node:fs` аргумент `path` или `filename` может быть передан как объект [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) с использованием протокола `file:`.

```js [ESM]
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```
`file:` URLs всегда являются абсолютными путями.

##### Специфические для платформы соображения {#platform-specific-considerations}

В Windows `file:` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) с именем хоста преобразуются в UNC-пути, в то время как `file:` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) с буквами дисков преобразуются в локальные абсолютные пути. `file:` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) без имени хоста и без буквы диска приведут к ошибке:

```js [ESM]
import { readFileSync } from 'node:fs';
// On Windows :

// - WHATWG file URLs with hostname convert to UNC path
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - WHATWG file URLs with drive letters convert to absolute path
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - WHATWG file URLs without hostname must have a drive letters
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
```
`file:` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) с буквами дисков должны использовать `:` в качестве разделителя сразу после буквы диска. Использование другого разделителя приведет к ошибке.

На всех других платформах `file:` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) с именем хоста не поддерживаются и приведут к ошибке:

```js [ESM]
import { readFileSync } from 'node:fs';
// On other platforms:

// - WHATWG file URLs with hostname are unsupported
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: must be absolute

// - WHATWG file URLs convert to absolute path
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```
`file:` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api), содержащий закодированные символы косой черты, приведет к ошибке на всех платформах:

```js [ESM]
import { readFileSync } from 'node:fs';

// On Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */

// On POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
/ characters */
```
В Windows `file:` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api), содержащий закодированный обратный слеш, приведет к ошибке:

```js [ESM]
import { readFileSync } from 'node:fs';

// On Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */
```

#### Пути буфера {#buffer-paths}

Пути, указанные с использованием [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer), полезны в основном в некоторых операционных системах POSIX, которые рассматривают пути к файлам как непрозрачные последовательности байтов. В таких системах возможно, что один путь к файлу содержит подпоследовательности, использующие несколько кодировок символов. Как и в случае строковых путей, пути [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) могут быть относительными или абсолютными:

Пример использования абсолютного пути в POSIX:

```js [ESM]
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Что-то делаем с файлом
} finally {
  await fd?.close();
}
```
#### Рабочие каталоги для каждого диска в Windows {#per-drive-working-directories-on-windows}

В Windows Node.js следует концепции рабочего каталога для каждого диска. Это поведение можно наблюдать при использовании пути к диску без обратной косой черты. Например, `fs.readdirSync('C:\\')` потенциально может вернуть результат, отличный от `fs.readdirSync('C:')`. Для получения дополнительной информации см. [эту страницу MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

### Файловые дескрипторы {#file-descriptors_1}

В системах POSIX для каждого процесса ядро ведет таблицу текущих открытых файлов и ресурсов. Каждому открытому файлу присваивается простой числовой идентификатор, называемый *файловым дескриптором*. На системном уровне все операции с файловой системой используют эти файловые дескрипторы для идентификации и отслеживания каждого конкретного файла. Системы Windows используют другой, но концептуально похожий механизм для отслеживания ресурсов. Чтобы упростить задачу для пользователей, Node.js абстрагируется от различий между операционными системами и присваивает всем открытым файлам числовой файловый дескриптор.

Метод `fs.open()` на основе обратного вызова и синхронный метод `fs.openSync()` открывают файл и выделяют новый файловый дескриптор. После выделения файловый дескриптор можно использовать для чтения данных из файла, записи данных в файл или запроса информации о файле.

Операционные системы ограничивают количество файловых дескрипторов, которые могут быть открыты в любой момент времени, поэтому крайне важно закрывать дескриптор после завершения операций. Невыполнение этого требования приведет к утечке памяти, которая в конечном итоге приведет к сбою приложения.

```js [ESM]
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // используем stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```
API на основе промисов используют объект [\<FileHandle\>](/ru/nodejs/api/fs#class-filehandle) вместо числового файлового дескриптора. Этими объектами лучше управляет система, чтобы гарантировать отсутствие утечки ресурсов. Однако по-прежнему требуется, чтобы они были закрыты после завершения операций:

```js [ESM]
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // используем stat
} finally {
  await file.close();
}
```

### Использование пула потоков {#threadpool-usage}

Все API файловой системы, основанные на обратных вызовах и промисах (за исключением `fs.FSWatcher()`), используют пул потоков libuv. Это может иметь неожиданные и негативные последствия для производительности некоторых приложений. Дополнительную информацию можно найти в документации [`UV_THREADPOOL_SIZE`](/ru/nodejs/api/cli#uv_threadpool_sizesize).

### Флаги файловой системы {#file-system-flags}

Следующие флаги доступны везде, где опция `flag` принимает строку.

- `'a'`: Открыть файл для добавления. Файл создается, если он не существует.
- `'ax'`: Как `'a'`, но завершается с ошибкой, если путь существует.
- `'a+'`: Открыть файл для чтения и добавления. Файл создается, если он не существует.
- `'ax+'`: Как `'a+'`, но завершается с ошибкой, если путь существует.
- `'as'`: Открыть файл для добавления в синхронном режиме. Файл создается, если он не существует.
- `'as+'`: Открыть файл для чтения и добавления в синхронном режиме. Файл создается, если он не существует.
- `'r'`: Открыть файл для чтения. Возникает исключение, если файл не существует.
- `'rs'`: Открыть файл для чтения в синхронном режиме. Возникает исключение, если файл не существует.
- `'r+'`: Открыть файл для чтения и записи. Возникает исключение, если файл не существует.
- `'rs+'`: Открыть файл для чтения и записи в синхронном режиме. Указывает операционной системе обходить локальный кеш файловой системы. Это в основном полезно для открытия файлов на NFS-монтированиях, поскольку позволяет пропустить потенциально устаревший локальный кеш. Это оказывает очень реальное влияние на производительность ввода-вывода, поэтому не рекомендуется использовать этот флаг, если это не требуется. Это не превращает `fs.open()` или `fsPromises.open()` в синхронный блокирующий вызов. Если требуется синхронная операция, следует использовать что-то вроде `fs.openSync()`.
- `'w'`: Открыть файл для записи. Файл создается (если он не существует) или усекается (если он существует).
- `'wx'`: Как `'w'`, но завершается с ошибкой, если путь существует.
- `'w+'`: Открыть файл для чтения и записи. Файл создается (если он не существует) или усекается (если он существует).
- `'wx+'`: Как `'w+'`, но завершается с ошибкой, если путь существует.

`flag` также может быть числом, как указано в [`open(2)`](http://man7.org/linux/man-pages/man2/open.2); часто используемые константы доступны из `fs.constants`. В Windows флаги преобразуются в их эквиваленты, где это применимо, например, `O_WRONLY` в `FILE_GENERIC_WRITE` или `O_EXCL|O_CREAT` в `CREATE_NEW`, как это принимается `CreateFileW`.

Эксклюзивный флаг `'x'` (флаг `O_EXCL` в [`open(2)`](http://man7.org/linux/man-pages/man2/open.2)) приводит к тому, что операция возвращает ошибку, если путь уже существует. В POSIX, если путь является символической ссылкой, использование `O_EXCL` возвращает ошибку, даже если ссылка указывает на путь, который не существует. Эксклюзивный флаг может не работать с сетевыми файловыми системами.

В Linux позиционные записи не работают, когда файл открыт в режиме добавления. Ядро игнорирует аргумент позиции и всегда добавляет данные в конец файла.

Изменение файла, а не его замена, может потребовать установки опции `flag` в `'r+'` вместо значения по умолчанию `'w'`.

Поведение некоторых флагов зависит от платформы. Таким образом, открытие каталога в macOS и Linux с флагом `'a+'`, как в примере ниже, вернет ошибку. Напротив, в Windows и FreeBSD будет возвращен файловый дескриптор или `FileHandle`.

```js [ESM]
// macOS и Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows и FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```
В Windows открытие существующего скрытого файла с использованием флага `'w'` (либо через `fs.open()`, `fs.writeFile()` или `fsPromises.open()`) завершится с ошибкой `EPERM`. Существующие скрытые файлы можно открыть для записи с помощью флага `'r+'`.

Вызов `fs.ftruncate()` или `filehandle.truncate()` можно использовать для сброса содержимого файла.

