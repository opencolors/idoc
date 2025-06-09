---
title: Документация Node.js по WASI
description: Изучите документацию Node.js по интерфейсу системы WebAssembly (WASI), подробно описывающую использование WASI в средах Node.js, включая API для операций с файловой системой, переменные окружения и многое другое.
head:
  - - meta
    - name: og:title
      content: Документация Node.js по WASI | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Изучите документацию Node.js по интерфейсу системы WebAssembly (WASI), подробно описывающую использование WASI в средах Node.js, включая API для операций с файловой системой, переменные окружения и многое другое.
  - - meta
    - name: twitter:title
      content: Документация Node.js по WASI | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Изучите документацию Node.js по интерфейсу системы WebAssembly (WASI), подробно описывающую использование WASI в средах Node.js, включая API для операций с файловой системой, переменные окружения и многое другое.
---


# WebAssembly System Interface (WASI) {#webassembly-system-interface-wasi}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Experimental
:::

**Модуль <code>node:wasi</code> в настоящее время не предоставляет
всесторонние свойства безопасности файловой системы, предоставляемые некоторыми средами выполнения WASI.
Полная поддержка безопасной песочницы файловой системы может быть или не быть реализована в
будущем. Тем временем не полагайтесь на него для запуска ненадежного кода.**

**Исходный код:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

API WASI предоставляет реализацию спецификации [WebAssembly System Interface](https://wasi.dev/). WASI предоставляет приложениям WebAssembly доступ к базовой операционной системе через набор функций, подобных POSIX.

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

Чтобы запустить приведенный выше пример, создайте новый текстовый файл WebAssembly с именем `demo.wat`:

```text [TEXT]
(module
    ;; Import the required fd_write WASI function which will write the given io vectors to stdout
    ;; The function signature for fd_write is:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Write 'hello world\n' to memory at an offset of 8 bytes
    ;; Note the trailing newline which is required for the text to appear
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Creating a new io vector within linear memory
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\n' string
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\n' string

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 for stdout
            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
            (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written
        )
        drop ;; Discard the number of bytes written from the top of the stack
    )
)
```
Используйте [wabt](https://github.com/WebAssembly/wabt) для компиляции `.wat` в `.wasm`

```bash [BASH]
wat2wasm demo.wat
```

## Безопасность {#security}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.2.0, v20.11.0 | Уточнены свойства безопасности WASI. |
| v21.2.0, v20.11.0 | Добавлено в: v21.2.0, v20.11.0 |
:::

WASI предоставляет модель на основе возможностей, посредством которой приложениям предоставляются их собственные пользовательские возможности `env`, `preopens`, `stdin`, `stdout`, `stderr` и `exit`.

**Текущая модель угроз Node.js не обеспечивает безопасную песочницу, как это реализовано в некоторых средах выполнения WASI.**

Хотя функции возможностей поддерживаются, они не формируют модель безопасности в Node.js. Например, песочница файловой системы может быть преодолена с помощью различных методов. Проект изучает, можно ли добавить эти гарантии безопасности в будущем.

## Класс: `WASI` {#class-wasi}

**Добавлено в: v13.3.0, v12.16.0**

Класс `WASI` предоставляет API системных вызовов WASI и дополнительные удобные методы для работы с приложениями на основе WASI. Каждый экземпляр `WASI` представляет собой отдельную среду.

### `new WASI([options])` {#new-wasioptions}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0 | Значение по умолчанию для returnOnExit изменено на true. |
| v20.0.0 | Опция version теперь обязательна и не имеет значения по умолчанию. |
| v19.8.0 | Поле version добавлено в options. |
| v13.3.0, v12.16.0 | Добавлено в: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Массив строк, который WebAssembly-приложение увидит как аргументы командной строки. Первый аргумент — это виртуальный путь к самой команде WASI. **По умолчанию:** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, аналогичный `process.env`, который WebAssembly-приложение увидит в качестве своей среды. **По умолчанию:** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Этот объект представляет локальную структуру каталогов WebAssembly-приложения. Строковые ключи `preopens` рассматриваются как каталоги в файловой системе. Соответствующие значения в `preopens` — это реальные пути к этим каталогам на хост-машине.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) По умолчанию, когда приложения WASI вызывают `__wasi_proc_exit()`, `wasi.start()` возвращает код выхода, а не завершает процесс. Установка этого параметра в `false` приведет к тому, что процесс Node.js завершится с указанным кодом выхода. **По умолчанию:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Файловый дескриптор, используемый в качестве стандартного ввода в WebAssembly-приложении. **По умолчанию:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Файловый дескриптор, используемый в качестве стандартного вывода в WebAssembly-приложении. **По умолчанию:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Файловый дескриптор, используемый в качестве стандартной ошибки в WebAssembly-приложении. **По умолчанию:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Запрашиваемая версия WASI. В настоящее время поддерживаются только версии `unstable` и `preview1`. Эта опция является обязательной.


### `wasi.getImportObject()` {#wasigetimportobject}

**Добавлено в: v19.8.0**

Возвращает объект импорта, который можно передать в `WebAssembly.instantiate()`, если кроме тех, что предоставляются WASI, другие импорты WASM не нужны.

Если в конструктор была передана версия `unstable`, он вернет:

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
Если в конструктор была передана версия `preview1` или версия не была указана, он вернет:

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Добавлено в: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Пытается начать выполнение `instance` в качестве команды WASI, вызвав его экспорт `_start()`. Если `instance` не содержит экспорт `_start()`, или если `instance` содержит экспорт `_initialize()`, то выбрасывается исключение.

`start()` требует, чтобы `instance` экспортировал [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) с именем `memory`. Если у `instance` нет экспорта `memory`, выбрасывается исключение.

Если `start()` вызывается более одного раза, выбрасывается исключение.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Добавлено в: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Пытается инициализировать `instance` в качестве реактора WASI, вызвав его экспорт `_initialize()`, если он присутствует. Если `instance` содержит экспорт `_start()`, то выбрасывается исключение.

`initialize()` требует, чтобы `instance` экспортировал [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) с именем `memory`. Если у `instance` нет экспорта `memory`, выбрасывается исключение.

Если `initialize()` вызывается более одного раза, выбрасывается исключение.

### `wasi.wasiImport` {#wasiwasiimport}

**Добавлено в: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` — это объект, который реализует API системных вызовов WASI. Этот объект следует передавать в качестве импорта `wasi_snapshot_preview1` во время инстанцирования [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

