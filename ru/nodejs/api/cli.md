---
title: Опции командной строки Node.js
description: Эта страница предоставляет полное руководство по доступным опциям командной строки в Node.js, подробно описывая, как использовать различные флаги и аргументы для настройки среды выполнения, управления отладкой и контроля поведения выполнения.
head:
  - - meta
    - name: og:title
      content: Опции командной строки Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Эта страница предоставляет полное руководство по доступным опциям командной строки в Node.js, подробно описывая, как использовать различные флаги и аргументы для настройки среды выполнения, управления отладкой и контроля поведения выполнения.
  - - meta
    - name: twitter:title
      content: Опции командной строки Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Эта страница предоставляет полное руководство по доступным опциям командной строки в Node.js, подробно описывая, как использовать различные флаги и аргументы для настройки среды выполнения, управления отладкой и контроля поведения выполнения.
---


# Параметры командной строки {#command-line-api}

Node.js поставляется с различными параметрами командной строки. Эти параметры предоставляют встроенные средства отладки, несколько способов выполнения скриптов и другие полезные параметры времени выполнения.

Чтобы просмотреть эту документацию в виде справочной страницы в терминале, запустите `man node`.

## Краткий обзор {#synopsis}

`node [параметры] [параметры V8] [<точка_входа_программы> | -e "скрипт" | -] [--] [аргументы]`

`node inspect [<точка_входа_программы> | -e "скрипт" | <хост>:<порт>] …`

`node --v8-options`

Выполните без аргументов, чтобы запустить [REPL](/ru/nodejs/api/repl).

Для получения дополнительной информации о `node inspect` см. документацию [отладчика](/ru/nodejs/api/debugger).

## Точка входа программы {#program-entry-point}

Точка входа программы - это строка, похожая на спецификатор. Если строка не является абсолютным путем, она разрешается как относительный путь от текущего рабочего каталога. Затем этот путь разрешается загрузчиком модулей [CommonJS](/ru/nodejs/api/modules). Если соответствующий файл не найден, возникает ошибка.

Если файл найден, его путь будет передан в [загрузчик модулей ES](/ru/nodejs/api/packages#modules-loaders) при любом из следующих условий:

- Программа была запущена с флагом командной строки, который заставляет точку входа загружаться с помощью загрузчика модулей ECMAScript, такого как `--import`.
- Файл имеет расширение `.mjs`.
- Файл не имеет расширения `.cjs`, а ближайший родительский файл `package.json` содержит поле верхнего уровня [`"type"`](/ru/nodejs/api/packages#type) со значением `"module"`.

В противном случае файл загружается с помощью загрузчика модулей CommonJS. Подробнее см. [Загрузчики модулей](/ru/nodejs/api/packages#modules-loaders).

### Предостережение относительно точки входа загрузчика модулей ECMAScript {#ecmascript-modules-loader-entry-point-caveat}

При загрузке [загрузчиком модулей ES](/ru/nodejs/api/packages#modules-loaders) точки входа программы команда `node` принимает в качестве входных данных только файлы с расширениями `.js`, `.mjs` или `.cjs`; и с расширениями `.wasm`, когда включен параметр [`--experimental-wasm-modules`](/ru/nodejs/api/cli#--experimental-wasm-modules).

## Параметры {#options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.12.0 | Подчеркивания вместо тире теперь также разрешены для параметров Node.js, в дополнение к параметрам V8. |
:::

Все параметры, включая параметры V8, позволяют разделять слова как тире (`-`), так и подчеркиваниями (`_`). Например, `--pending-deprecation` эквивалентно `--pending_deprecation`.

Если параметр, принимающий одно значение (например, `--max-http-header-size`), передается несколько раз, то используется последнее переданное значение. Параметры из командной строки имеют приоритет над параметрами, переданными через переменную среды [`NODE_OPTIONS`](/ru/nodejs/api/cli#node_optionsoptions).


### `-` {#-}

**Добавлено в: v8.0.0**

Псевдоним для stdin. Аналогично использованию `-` в других утилитах командной строки, означающее, что скрипт считывается из stdin, а остальные параметры передаются этому скрипту.

### `--` {#--}

**Добавлено в: v6.11.0**

Указывает на конец параметров node. Передает остальные аргументы скрипту. Если до этого не указано имя файла скрипта или eval/print скрипт, то следующий аргумент используется как имя файла скрипта.

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**Добавлено в: v0.10.8**

Прерывание вместо выхода приводит к созданию core-файла для посмертного анализа с использованием отладчика (например, `lldb`, `gdb` и `mdb`).

Если этот флаг передан, поведение все равно можно настроить так, чтобы не прерывать выполнение, с помощью [`process.setUncaughtExceptionCaptureCallback()`](/ru/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) (и посредством использования модуля `node:domain`, который его использует).

### `--allow-addons` {#--allow-addons}

**Добавлено в: v21.6.0, v20.12.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

При использовании [Модели разрешений](/ru/nodejs/api/permissions#permission-model) процесс не сможет использовать собственные дополнения по умолчанию. Попытки сделать это вызовут ошибку `ERR_DLOPEN_DISABLED`, если пользователь явно не передаст флаг `--allow-addons` при запуске Node.js.

Пример:

```js [CJS]
// Попытка потребовать собственное дополнение
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**Добавлено в: v20.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

При использовании [Модели разрешений](/ru/nodejs/api/permissions#permission-model) процесс по умолчанию не сможет порождать дочерние процессы. Попытки сделать это приведут к выбросу `ERR_ACCESS_DENIED`, если пользователь явно не передаст флаг `--allow-child-process` при запуске Node.js.

Пример:

```js [ESM]
const childProcess = require('node:child_process');
// Попытка обойти разрешение
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Модель разрешений и флаги --allow-fs стабильны. |
| v20.7.0 | Пути, разделенные запятой (`,`), больше не допускаются. |
| v20.0.0 | Добавлено в: v20.0.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::

Этот флаг настраивает разрешения на чтение файловой системы, используя [Модель разрешений](/ru/nodejs/api/permissions#permission-model).

Допустимые аргументы для флага `--allow-fs-read`:

- `*` - чтобы разрешить все операции `FileSystemRead`.
- Несколько путей можно разрешить, используя несколько флагов `--allow-fs-read`. Например, `--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

Примеры можно найти в документации по [Разрешениям файловой системы](/ru/nodejs/api/permissions#file-system-permissions).

Также необходимо разрешить модуль инициализатора. Рассмотрим следующий пример:

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
Процесс должен иметь доступ к модулю `index.js`:

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Модель разрешений и флаги --allow-fs стабильны. |
| v20.7.0 | Пути, разделенные запятыми (`,`), больше не разрешены. |
| v20.0.0 | Добавлено в: v20.0.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::

Этот флаг настраивает разрешения на запись в файловую систему, используя [Модель разрешений](/ru/nodejs/api/permissions#permission-model).

Допустимые аргументы для флага `--allow-fs-write`:

- `*` - чтобы разрешить все операции `FileSystemWrite`.
- Несколько путей можно разрешить, используя несколько флагов `--allow-fs-write`. Пример: `--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

Пути, разделенные запятыми (`,`), больше не разрешены. При передаче одного флага с запятой будет отображаться предупреждение.

Примеры можно найти в документации [Разрешения файловой системы](/ru/nodejs/api/permissions#file-system-permissions).

### `--allow-wasi` {#--allow-wasi}

**Добавлено в: v22.3.0, v20.16.0**

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Активная разработка
:::

При использовании [Модели разрешений](/ru/nodejs/api/permissions#permission-model) процесс по умолчанию не сможет создавать экземпляры WASI. Из соображений безопасности вызов выдаст `ERR_ACCESS_DENIED`, если пользователь явно не передаст флаг `--allow-wasi` в основном процессе Node.js.

Пример:

```js [ESM]
const { WASI } = require('node:wasi');
// Попытка обойти разрешение
new WASI({
  version: 'preview1',
  // Попытка подключить всю файловую систему
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**Добавлено в: v20.0.0**

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Активная разработка
:::

При использовании [Модели разрешений](/ru/nodejs/api/permissions#permission-model) процесс по умолчанию не сможет создавать потоки worker. Из соображений безопасности вызов выдаст `ERR_ACCESS_DENIED`, если пользователь явно не передаст флаг `--allow-worker` в основном процессе Node.js.

Пример:

```js [ESM]
const { Worker } = require('node:worker_threads');
// Попытка обойти разрешение
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**Добавлено в версии: v18.8.0**

::: warning [Стабильность: 1 - Экспериментальное]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальное
:::

Генерирует блоб моментального снимка при завершении процесса и записывает его на диск, который можно загрузить позже с помощью `--snapshot-blob`.

При создании моментального снимка, если `--snapshot-blob` не указан, сгенерированный блоб будет записан по умолчанию в `snapshot.blob` в текущем рабочем каталоге. В противном случае он будет записан по пути, указанному `--snapshot-blob`.

```bash [BASH]
$ echo "globalThis.foo = 'I am from the snapshot'" > snapshot.js

# Запустите snapshot.js для инициализации приложения и создания моментального {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# снимка его состояния в snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Загрузите сгенерированный моментальный снимок и запустите приложение из index.js. {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
I am from the snapshot
```
[`v8.startupSnapshot` API](/ru/nodejs/api/v8#startup-snapshot-api) можно использовать для указания точки входа во время создания моментального снимка, что позволяет избежать необходимости в дополнительном сценарии входа во время десериализации:

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('I am from the snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
I am from the snapshot
```
Для получения дополнительной информации ознакомьтесь с документацией [`v8.startupSnapshot` API](/ru/nodejs/api/v8#startup-snapshot-api).

В настоящее время поддержка моментальных снимков во время выполнения является экспериментальной в том смысле, что:

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**Добавлено в версии: v21.6.0, v20.12.0**

::: warning [Стабильность: 1 - Экспериментальное]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальное
:::

Указывает путь к файлу конфигурации JSON, который настраивает поведение при создании моментального снимка.

В настоящее время поддерживаются следующие параметры:

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Обязательно. Предоставляет имя скрипта, который выполняется перед созданием моментального снимка, как если бы [`--build-snapshot`](/ru/nodejs/api/cli#--build-snapshot) был передан с `builder` в качестве имени основного скрипта.
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Необязательно. Включение кеша кода сокращает время, затрачиваемое на компиляцию функций, включенных в моментальный снимок, за счет большего размера моментального снимка и потенциального нарушения переносимости моментального снимка.

При использовании этого флага дополнительные файлы скриптов, предоставленные в командной строке, не будут выполняться, а будут интерпретироваться как обычные аргументы командной строки.


### `-c`, `--check` {#--build-snapshot-config}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Теперь поддерживается опция `--require` при проверке файла. |
| v5.0.0, v4.2.0 | Добавлено в: v5.0.0, v4.2.0 |
:::

Синтаксическая проверка скрипта без выполнения.

### `--completion-bash` {#-c---check}

**Добавлено в: v10.12.0**

Вывод исходного кода сценария автодополнения bash для Node.js.

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```
### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.9.0, v20.18.0 | Флаг больше не является экспериментальным. |
| v14.9.0, v12.19.0 | Добавлено в: v14.9.0, v12.19.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Предоставляет пользовательские [условия разрешения условного экспорта](/ru/nodejs/api/packages#conditional-exports).

Разрешено любое количество пользовательских строковых имен условий.

Условия Node.js по умолчанию `"node"`, `"default"`, `"import"` и `"require"` всегда будут применяться в соответствии с определением.

Например, для запуска модуля с разрешениями "development":

```bash [BASH]
node -C development app.js
```
### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Флаги `--cpu-prof` теперь стабильны. |
| v12.0.0 | Добавлено в: v12.0.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Запускает профилировщик ЦП V8 при запуске и записывает профиль ЦП на диск перед выходом.

Если `--cpu-prof-dir` не указан, сгенерированный профиль помещается в текущий рабочий каталог.

Если `--cpu-prof-name` не указан, сгенерированный профиль называется `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile`.

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```
### `--cpu-prof-dir` {#--cpu-prof}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Флаги `--cpu-prof` теперь стабильны. |
| v12.0.0 | Добавлено в: v12.0.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Укажите каталог, в который будут помещены профили ЦП, созданные `--cpu-prof`.

Значение по умолчанию контролируется параметром командной строки [`--diagnostic-dir`](/ru/nodejs/api/cli#--diagnostic-dirdirectory).


### `--cpu-prof-interval` {#--cpu-prof-dir}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Флаги `--cpu-prof` теперь стабильны. |
| v12.2.0 | Добавлено в: v12.2.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильно: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Укажите интервал выборки в микросекундах для CPU-профилей, генерируемых `--cpu-prof`. По умолчанию используется 1000 микросекунд.

### `--cpu-prof-name` {#--cpu-prof-interval}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Флаги `--cpu-prof` теперь стабильны. |
| v12.0.0 | Добавлено в: v12.0.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильно: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Укажите имя файла для CPU-профиля, генерируемого `--cpu-prof`.

### `--diagnostic-dir=directory` {#--cpu-prof-name}

Установите каталог, в который записываются все диагностические выходные файлы. По умолчанию используется текущий рабочий каталог.

Влияет на каталог вывода по умолчанию для:

- [`--cpu-prof-dir`](/ru/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/ru/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/ru/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**Добавлено в: v13.12.0, v12.17.0**

Отключить свойство `Object.prototype.__proto__`. Если `mode` имеет значение `delete`, свойство удаляется полностью. Если `mode` имеет значение `throw`, доступ к свойству вызывает исключение с кодом `ERR_PROTO_ACCESS`.

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

**Добавлено в: v21.3.0, v20.11.0**

Отключить определенные предупреждения процесса по `code` или `type`.

Предупреждения, испускаемые [`process.emitWarning()`](/ru/nodejs/api/process#processemitwarningwarning-options), могут содержать `code` и `type`. Эта опция не будет испускать предупреждения, у которых есть совпадающий `code` или `type`.

Список [устаревших предупреждений](/ru/nodejs/api/deprecations#list-of-deprecated-apis).

Типы предупреждений ядра Node.js: `DeprecationWarning` и `ExperimentalWarning`.

Например, следующий скрипт не будет выдавать [DEP0025 `require('node:sys')`](/ru/nodejs/api/deprecations#dep0025-requirenodesys) при выполнении с `node --disable-warning=DEP0025`:



::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

Например, следующий скрипт выдаст [DEP0025 `require('node:sys')`](/ru/nodejs/api/deprecations#dep0025-requirenodesys), но не будет выдавать никаких экспериментальных предупреждений (например, [ExperimentalWarning: `vm.measureMemory` является экспериментальной функцией](/ru/nodejs/api/vm#vmmeasurememoryoptions) в <=v21) при выполнении с `node --disable-warning=ExperimentalWarning`:



::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**Добавлено в: v22.2.0, v20.15.0**

По умолчанию Node.js включает проверки границ WebAssembly на основе обработчика ловушек. В результате V8 не нужно вставлять встроенные проверки границ в код, скомпилированный из WebAssembly, что может значительно ускорить выполнение WebAssembly, но эта оптимизация требует выделения большой клетки виртуальной памяти (в настоящее время 10 ГБ). Если процесс Node.js не имеет доступа к достаточно большому пространству виртуальной памяти из-за системных конфигураций или аппаратных ограничений, пользователи не смогут запускать какой-либо WebAssembly, который включает выделение памяти в этой клетке виртуальной памяти, и увидят ошибку нехватки памяти.

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): не удалось выделить память
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler` отключает эту оптимизацию, чтобы пользователи могли хотя бы запускать WebAssembly (с менее оптимальной производительностью), когда пространство виртуальной памяти, доступное для их процесса Node.js, меньше, чем требуется клетке памяти V8 WebAssembly.

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**Добавлено в: v9.8.0**

Сделайте встроенные языковые функции, такие как `eval` и `new Function`, которые генерируют код из строк, вызывающими исключение вместо этого. Это не влияет на модуль Node.js `node:vm`.

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | Теперь поддерживается `ipv6first`. |
| v17.0.0 | Значение по умолчанию изменено на `verbatim`. |
| v16.4.0, v14.18.0 | Добавлено в: v16.4.0, v14.18.0 |
:::

Установите значение по умолчанию для `order` в [`dns.lookup()`](/ru/nodejs/api/dns#dnslookuphostname-options-callback) и [`dnsPromises.lookup()`](/ru/nodejs/api/dns#dnspromiseslookuphostname-options). Значение может быть:

- `ipv4first`: устанавливает значение по умолчанию `order` в `ipv4first`.
- `ipv6first`: устанавливает значение по умолчанию `order` в `ipv6first`.
- `verbatim`: устанавливает значение по умолчанию `order` в `verbatim`.

По умолчанию используется `verbatim`, и [`dns.setDefaultResultOrder()`](/ru/nodejs/api/dns#dnssetdefaultresultorderorder) имеет более высокий приоритет, чем `--dns-result-order`.


### `--enable-fips` {#--dns-result-order=order}

**Добавлено в: v6.0.0**

Включает криптографию, совместимую с FIPS, при запуске. (Требует, чтобы Node.js был собран с OpenSSL, совместимым с FIPS.)

### `--enable-network-family-autoselection` {#--enable-fips}

**Добавлено в: v18.18.0**

Включает алгоритм автоматического выбора семейства, если параметры соединения явно не отключают его.

### `--enable-source-maps` {#--enable-network-family-autoselection}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.11.0, v14.18.0 | Этот API больше не является экспериментальным. |
| v12.12.0 | Добавлено в: v12.12.0 |
:::

Включает поддержку [Source Map v3](https://sourcemaps.info/spec) для трассировок стека.

При использовании транспайлера, такого как TypeScript, трассировки стека, выдаваемые приложением, ссылаются на транспилированный код, а не на исходную позицию. `--enable-source-maps` включает кэширование карт исходного кода и делает все возможное для сообщения трассировок стека относительно исходного исходного файла.

Переопределение `Error.prepareStackTrace` может помешать `--enable-source-maps` изменять трассировку стека. Вызовите и верните результаты исходного `Error.prepareStackTrace` в переопределяющей функции, чтобы изменить трассировку стека с помощью карт исходного кода.

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Измените ошибку и трассировку и отформатируйте трассировку стека с помощью
  // исходного Error.prepareStackTrace.
  return originalPrepareStackTrace(error, trace);
};
```
Обратите внимание, что включение карт исходного кода может привести к задержке в вашем приложении при доступе к `Error.stack`. Если вы часто обращаетесь к `Error.stack` в своем приложении, примите во внимание последствия для производительности `--enable-source-maps`.

### `--entry-url` {#--enable-source-maps}

**Добавлено в: v23.0.0**

::: warning [Стабильный: 1 - Экспериментальный]
[Стабильный: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

При наличии Node.js будет интерпретировать точку входа как URL-адрес, а не как путь.

Следует правилам разрешения [модулей ECMAScript](/ru/nodejs/api/esm#modules-ecmascript-modules).

Любой параметр запроса или хэш в URL-адресе будет доступен через [`import.meta.url`](/ru/nodejs/api/esm#importmetaurl).

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**Добавлено в: v22.9.0**

Поведение аналогично [`--env-file`](/ru/nodejs/api/cli#--env-fileconfig), но ошибка не возникает, если файл не существует.

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.7.0, v20.12.0 | Добавлена поддержка многострочных значений. |
| v20.6.0 | Добавлено в: v20.6.0 |
:::

Загружает переменные окружения из файла относительно текущего каталога, делая их доступными для приложений в `process.env`. [Переменные окружения, которые настраивают Node.js](/ru/nodejs/api/cli#environment-variables), такие как `NODE_OPTIONS`, анализируются и применяются. Если одна и та же переменная определена в окружении и в файле, значение из окружения имеет приоритет.

Вы можете передать несколько аргументов `--env-file`. Последующие файлы переопределяют ранее существовавшие переменные, определенные в предыдущих файлах.

Если файл не существует, выдается ошибка.

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
Формат файла должен быть таким: одна строка на пару ключ-значение имени переменной окружения и значения, разделенных знаком `=`:

```text [TEXT]
PORT=3000
```
Любой текст после `#` рассматривается как комментарий:

```text [TEXT]
# Это комментарий {#--env-file=config}
PORT=3000 # Это тоже комментарий
```
Значения могут начинаться и заканчиваться следующими кавычками: ```, `"` или `'`. Они опускаются из значений.

```text [TEXT]
USERNAME="nodejs" # результатом будет `nodejs` в качестве значения.
```
Поддерживаются многострочные значения:

```text [TEXT]
MULTI_LINE="THIS IS
A MULTILINE"
# результатом будет `THIS IS\nA MULTILINE` в качестве значения. {#this-is-a-comment}
```
Ключевое слово export перед ключом игнорируется:

```text [TEXT]
export USERNAME="nodejs" # результатом будет `nodejs` в качестве значения.
```
Если вы хотите загрузить переменные окружения из файла, которого может не существовать, вы можете вместо этого использовать флаг [`--env-file-if-exists`](/ru/nodejs/api/cli#--env-file-if-existsconfig).


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.6.0 | Eval теперь поддерживает экспериментальное удаление типов. |
| v5.11.0 | Встроенные библиотеки теперь доступны как предопределенные переменные. |
| v0.5.2 | Добавлено в: v0.5.2 |
:::

Выполнить следующий аргумент как JavaScript. Модули, которые предопределены в REPL, также можно использовать в `script`.

В Windows, при использовании `cmd.exe`, одинарная кавычка не будет работать правильно, потому что она распознает только двойную `"` для заключения в кавычки. В Powershell или Git bash можно использовать как `'`, так и `"` .

Можно запускать код, содержащий встроенные типы, передав [`--experimental-strip-types`](/ru/nodejs/api/cli#--experimental-strip-types).

### `--experimental-async-context-frame` {#-e---eval-"script"}

**Добавлено в: v22.7.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Включает использование [`AsyncLocalStorage`](/ru/nodejs/api/async_context#class-asynclocalstorage), поддерживаемого `AsyncContextFrame`, а не реализации по умолчанию, которая основана на async_hooks. Эта новая модель реализована совершенно иначе и, следовательно, может иметь различия в том, как данные контекста передаются внутри приложения. В связи с этим в настоящее время рекомендуется убедиться, что на поведение вашего приложения не влияет это изменение, прежде чем использовать его в production.

### `--experimental-eventsource` {#--experimental-async-context-frame}

**Добавлено в: v22.3.0, v20.18.0**

Включить предоставление [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) в глобальной области видимости.

### `--experimental-import-meta-resolve` {#--experimental-eventsource}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.6.0, v18.19.0 | синхронный import.meta.resolve доступен по умолчанию, с сохранением флага для включения экспериментального второго аргумента, как поддерживалось ранее. |
| v13.9.0, v12.16.2 | Добавлено в: v13.9.0, v12.16.2 |
:::

Включить экспериментальную поддержку родительского URL-адреса `import.meta.resolve()`, которая позволяет передавать второй аргумент `parentURL` для контекстной привязки.

Ранее ограничивало всю функциональность `import.meta.resolve`.


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.11.1 | Этот флаг был переименован из `--loader` в `--experimental-loader`. |
| v8.8.0 | Добавлено в: v8.8.0 |
:::

Укажите `module`, содержащий экспортированные [хуки для настройки модулей](/ru/nodejs/api/module#customization-hooks). `module` может быть любой строкой, принимаемой в качестве [спецификатора `import`](/ru/nodejs/api/esm#import-specifiers).

### `--experimental-network-inspection` {#--experimental-loader=module}

**Добавлено в: v22.6.0, v20.18.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Включить экспериментальную поддержку инспекции сети с помощью Chrome DevTools.

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**Добавлено в: v22.0.0, v20.17.0**

Если ES-модуль, используемый с помощью `require()`, содержит `await` верхнего уровня, этот флаг позволяет Node.js оценить модуль, попытаться найти `await` верхнего уровня и распечатать их местоположение, чтобы помочь пользователям найти их.

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Теперь значение по умолчанию - true. |
| v22.0.0, v20.17.0 | Добавлено в: v22.0.0, v20.17.0 |
:::

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Поддерживает загрузку синхронного графа ES-модулей в `require()`.

См. [Загрузка модулей ECMAScript с помощью `require()`](/ru/nodejs/api/modules#loading-ecmascript-modules-using-require).

### `--experimental-sea-config` {#--experimental-require-module}

**Добавлено в: v20.0.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Используйте этот флаг для создания блоба, который можно внедрить в бинарный файл Node.js для создания [одиночного исполняемого приложения](/ru/nodejs/api/single-executable-applications). См. документацию об [этой конфигурации](/ru/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs) для получения подробной информации.


### `--experimental-shadow-realm` {#--experimental-sea-config}

**Добавлено в: v19.0.0, v18.13.0**

Используйте этот флаг для включения поддержки [ShadowRealm](https://github.com/tc39/proposal-shadowrealm).

### `--experimental-strip-types` {#--experimental-shadow-realm}

**Добавлено в: v22.6.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Включает экспериментальное удаление типов для файлов TypeScript. Для получения дополнительной информации см. документацию по [удалению типов TypeScript](/ru/nodejs/api/typescript#type-stripping).

### `--experimental-test-coverage` {#--experimental-strip-types}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.1.0, v18.17.0 | Эта опция может использоваться с `--test`. |
| v19.7.0, v18.15.0 | Добавлено в: v19.7.0, v18.15.0 |
:::

При использовании вместе с модулем `node:test`, отчёт о покрытии кода генерируется как часть вывода запуска тестов. Если тесты не запущены, отчёт о покрытии не генерируется. Подробнее см. в документации по [сбору покрытия кода из тестов](/ru/nodejs/api/test#collecting-code-coverage).

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**Добавлено в: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

Настраивает тип изоляции тестов, используемой в тест-раннере. Когда `mode` имеет значение `'process'`, каждый тестовый файл запускается в отдельном дочернем процессе. Когда `mode` имеет значение `'none'`, все тестовые файлы запускаются в том же процессе, что и тест-раннер. Режим изоляции по умолчанию — `'process'`. Этот флаг игнорируется, если отсутствует флаг `--test`. Подробнее см. в разделе [модель выполнения тест-раннера](/ru/nodejs/api/test#test-runner-execution-model).

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**Добавлено в: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).0 - Ранняя разработка
:::

Включает моки модулей в тест-раннере.


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**Добавлено в: v22.7.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Включает преобразование синтаксиса, специфичного для TypeScript, в код JavaScript. Подразумевает `--experimental-strip-types` и `--enable-source-maps`.

### `--experimental-vm-modules` {#--experimental-transform-types}

**Добавлено в: v9.6.0**

Включает экспериментальную поддержку ES Module в модуле `node:vm`.

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0, v18.17.0 | Эта опция больше не требуется, так как WASI включен по умолчанию, но ее все еще можно передать. |
| v13.6.0 | изменено с `--experimental-wasi-unstable-preview0` на `--experimental-wasi-unstable-preview1`. |
| v13.3.0, v12.16.0 | Добавлено в: v13.3.0, v12.16.0 |
:::

Включает экспериментальную поддержку WebAssembly System Interface (WASI).

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**Добавлено в: v12.3.0**

Включает экспериментальную поддержку модулей WebAssembly.

### `--experimental-webstorage` {#--experimental-wasm-modules}

**Добавлено в: v22.4.0**

Включает экспериментальную поддержку [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API).

### `--expose-gc` {#--experimental-webstorage}

**Добавлено в: v22.3.0, v20.18.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная. Этот флаг унаследован от V8 и может быть изменен выше по потоку.
:::

Этот флаг откроет расширение gc из V8.

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**Добавлено в: v12.12.0**

Отключает загрузку нативных дополнений, не поддерживающих [контекстно-зависимые](/ru/nodejs/api/addons#context-aware-addons) дополнения.

### `--force-fips` {#--force-context-aware}

**Добавлено в: v6.0.0**

Принудительное использование криптографии, совместимой с FIPS, при запуске. (Не может быть отключено из кода скрипта.) (Те же требования, что и `--enable-fips`.)

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**Добавлено в: v18.3.0, v16.17.0**

Принудительно применяет событие `uncaughtException` в асинхронных обратных вызовах Node-API.

Чтобы предотвратить сбой процесса из-за существующего дополнения, этот флаг не включен по умолчанию. В будущем этот флаг будет включен по умолчанию для обеспечения правильного поведения.


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**Добавлено в: v11.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Включает экспериментальную заморозку встроенных объектов, таких как `Array` и `Object`.

Поддерживается только корневой контекст. Нет гарантии, что `globalThis.Array` действительно является ссылкой на встроенный объект по умолчанию. Код может сломаться при использовании этого флага.

Чтобы разрешить добавление полифиллов, [`--require`](/ru/nodejs/api/cli#-r---require-module) и [`--import`](/ru/nodejs/api/cli#--importmodule) запускаются до заморозки встроенных объектов.

### `--heap-prof` {#--frozen-intrinsics}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Флаги `--heap-prof` теперь стабильны. |
| v12.4.0 | Добавлено в: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Запускает профилировщик кучи V8 при запуске и записывает профиль кучи на диск перед выходом.

Если `--heap-prof-dir` не указан, сгенерированный профиль помещается в текущий рабочий каталог.

Если `--heap-prof-name` не указан, сгенерированный профиль называется `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile`.

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```
### `--heap-prof-dir` {#--heap-prof}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Флаги `--heap-prof` теперь стабильны. |
| v12.4.0 | Добавлено в: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Укажите каталог, в который будут помещаться профили кучи, сгенерированные с помощью `--heap-prof`.

Значение по умолчанию контролируется параметром командной строки [`--diagnostic-dir`](/ru/nodejs/api/cli#--diagnostic-dirdirectory).

### `--heap-prof-interval` {#--heap-prof-dir}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Флаги `--heap-prof` теперь стабильны. |
| v12.4.0 | Добавлено в: v12.4.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Укажите средний интервал выборки в байтах для профилей кучи, сгенерированных с помощью `--heap-prof`. По умолчанию используется 512 * 1024 байт.


### `--heap-prof-name` {#--heap-prof-interval}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Флаги `--heap-prof` теперь стабильны. |
| v12.4.0 | Добавлено в: v12.4.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Укажите имя файла профиля кучи, сгенерированного с помощью `--heap-prof`.

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**Добавлено в: v15.1.0, v14.18.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Записывает снимок кучи V8 на диск, когда использование кучи V8 приближается к пределу кучи. `count` должно быть неотрицательным целым числом (в этом случае Node.js запишет на диск не более `max_count` снимков).

При создании снимков может быть запущена сборка мусора, что приведет к снижению использования кучи. Поэтому несколько снимков могут быть записаны на диск, прежде чем у экземпляра Node.js окончательно закончится память. Эти снимки кучи можно сравнить, чтобы определить, какие объекты выделяются во время последовательных снимков. Не гарантируется, что Node.js запишет ровно `max_count` снимков на диск, но он сделает все возможное, чтобы сгенерировать хотя бы один и до `max_count` снимков, прежде чем у экземпляра Node.js закончится память, если `max_count` больше `0`.

Создание снимков V8 требует времени и памяти (как памяти, управляемой кучей V8, так и собственной памяти вне кучи V8). Чем больше куча, тем больше ресурсов ей требуется. Node.js скорректирует кучу V8, чтобы учесть дополнительные накладные расходы памяти кучи V8, и сделает все возможное, чтобы избежать использования всей памяти, доступной процессу. Когда процесс использует больше памяти, чем система считает уместным, процесс может быть внезапно завершен системой, в зависимости от конфигурации системы.

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```

### `--heapsnapshot-signal=signal` {#--heapsnapshot-near-heap-limit=max_count}

**Добавлено в: v12.0.0**

Включает обработчик сигналов, который заставляет процесс Node.js записывать дамп кучи при получении указанного сигнала. `signal` должен быть допустимым именем сигнала. Отключено по умолчанию.

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**Добавлено в: v0.1.3**

Выводит параметры командной строки Node.js. Вывод этой опции менее подробен, чем этот документ.

### `--icu-data-dir=file` {#-h---help}

**Добавлено в: v0.11.15**

Указывает путь загрузки данных ICU. (Переопределяет `NODE_ICU_DATA`.)

### `--import=module` {#--icu-data-dir=file}

**Добавлено в: v19.0.0, v18.18.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Предварительно загружает указанный модуль при запуске. Если флаг указан несколько раз, каждый модуль будет выполняться последовательно в том порядке, в котором они появляются, начиная с тех, которые указаны в [`NODE_OPTIONS`](/ru/nodejs/api/cli#node_optionsoptions).

Следует правилам разрешения [модулей ECMAScript](/ru/nodejs/api/esm#modules-ecmascript-modules). Используйте [`--require`](/ru/nodejs/api/cli#-r---require-module) для загрузки [модуля CommonJS](/ru/nodejs/api/modules). Модули, предварительно загруженные с помощью `--require`, будут выполняться перед модулями, предварительно загруженными с помощью `--import`.

Модули предварительно загружаются в основной поток, а также в любые рабочие потоки, форкнутые процессы или кластерные процессы.

### `--input-type=type` {#--import=module}

**Добавлено в: v12.0.0**

Это настраивает Node.js для интерпретации ввода `--eval` или `STDIN` как CommonJS или как ES-модуль. Допустимые значения: `"commonjs"` или `"module"`. Значение по умолчанию - `"commonjs"`.

REPL не поддерживает эту опцию. Использование `--input-type=module` с [`--print`](/ru/nodejs/api/cli#-p---print-script) вызовет ошибку, так как `--print` не поддерживает синтаксис ES-модулей.


### `--insecure-http-parser` {#--input-type=type}

**Добавлено в: v13.4.0, v12.15.0, v10.19.0**

Включить флаги нестрогого разбора HTTP. Это может обеспечить совместимость с HTTP-реализациями, не соответствующими стандартам.

При включении анализатор будет принимать следующее:

- Недопустимые значения заголовков HTTP.
- Недопустимые версии HTTP.
- Разрешать сообщения, содержащие заголовки `Transfer-Encoding` и `Content-Length`.
- Разрешать дополнительные данные после сообщения при наличии `Connection: close`.
- Разрешать дополнительные кодировки передачи после предоставления `chunked`.
- Разрешать использование `\n` в качестве разделителя токенов вместо `\r\n`.
- Разрешать отсутствие `\r\n` после фрагмента.
- Разрешать пробелы после размера фрагмента и перед `\r\n`.

Все вышеперечисленное подвергнет ваше приложение атакам, связанным с контрабандой или отравлением запросов. Избегайте использования этой опции.

#### Предупреждение: привязка инспектора к общедоступной комбинации IP:порт небезопасна {#--insecure-http-parser}

Привязка инспектора к общедоступному IP-адресу (включая `0.0.0.0`) с открытым портом небезопасна, поскольку позволяет внешним хостам подключаться к инспектору и выполнять [атаку удаленного выполнения кода](https://www.owasp.org/index.php/Code_Injection).

При указании хоста убедитесь, что:

- Хост недоступен из общедоступных сетей.
- Брандмауэр блокирует нежелательные соединения на порту.

**В частности, <code>--inspect=0.0.0.0</code> небезопасен, если порт (<code>9229</code> по
умолчанию) не защищен брандмауэром.**

Дополнительную информацию см. в разделе [последствия для безопасности отладки](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications).

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**Добавлено в: v7.6.0**

Активировать инспектор на `host:port` и прервать выполнение в начале пользовательского скрипта. Значение `host:port` по умолчанию — `127.0.0.1:9229`. Если указан порт `0`, будет использован случайный доступный порт.

Дополнительные сведения об отладчике Node.js см. в разделе [Интеграция V8 Inspector для Node.js](/ru/nodejs/api/debugger#v8-inspector-integration-for-nodejs).

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**Добавлено в: v7.6.0**

Установить `host:port` для использования при активации инспектора. Полезно при активации инспектора отправкой сигнала `SIGUSR1`.

Хост по умолчанию — `127.0.0.1`. Если указан порт `0`, будет использован случайный доступный порт.

См. [предупреждение о безопасности](/ru/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) ниже относительно использования параметра `host`.


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

Указывает способы предоставления URL веб-сокета инспектора.

По умолчанию URL веб-сокета инспектора доступен в stderr и по адресу `/json/list` в `http://host:port/json/list`.

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**Добавлено в: v22.2.0, v20.15.0**

Активирует инспектор на `host:port` и ожидает подключения отладчика. Значение по умолчанию для `host:port` — `127.0.0.1:9229`. Если указан порт `0`, будет использован случайный доступный порт.

См. [Интеграция V8 Inspector для Node.js](/ru/nodejs/api/debugger#v8-inspector-integration-for-nodejs) для дальнейшего объяснения отладчика Node.js.

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**Добавлено в: v6.3.0**

Активирует инспектор на `host:port`. По умолчанию используется `127.0.0.1:9229`. Если указан порт `0`, будет использован случайный доступный порт.

Интеграция V8 inspector позволяет инструментам, таким как Chrome DevTools и IDE, отлаживать и профилировать экземпляры Node.js. Инструменты подключаются к экземплярам Node.js через TCP-порт и взаимодействуют с использованием [Протокола Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/). См. [Интеграция V8 Inspector для Node.js](/ru/nodejs/api/debugger#v8-inspector-integration-for-nodejs) для дальнейшего объяснения отладчика Node.js.

### `-i`, `--interactive` {#--inspect=hostport}

**Добавлено в: v0.7.7**

Открывает REPL, даже если stdin не является терминалом.

### `--jitless` {#-i---interactive}

**Добавлено в: v12.0.0**

::: warning [Стабильный: 1 - Экспериментальный]
[Стабильный: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный. Этот флаг унаследован от V8 и может быть изменен в вышестоящем репозитории.
:::

Отключает [динамическое выделение исполняемой памяти](https://v8.dev/blog/jitless). Это может потребоваться на некоторых платформах по соображениям безопасности. Это также может уменьшить поверхность атаки на других платформах, но влияние на производительность может быть серьезным.

### `--localstorage-file=file` {#--jitless}

**Добавлено в: v22.4.0**

Файл, используемый для хранения данных `localStorage`. Если файл не существует, он создается при первом обращении к `localStorage`. Один и тот же файл может использоваться несколькими процессами Node.js одновременно. Этот флаг не имеет эффекта, если Node.js запущен без флага `--experimental-webstorage`.


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.13.0 | Изменен максимальный размер HTTP-заголовков по умолчанию с 8 КиБ до 16 КиБ. |
| v11.6.0, v10.15.0 | Добавлено в: v11.6.0, v10.15.0 |
:::

Указывает максимальный размер HTTP-заголовков в байтах. По умолчанию 16 КиБ.

### `--napi-modules` {#--max-http-header-size=size}

**Добавлено в: v7.10.0**

Эта опция не имеет эффекта. Она сохранена для совместимости.

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**Добавлено в: v22.1.0, v20.13.0**

Устанавливает значение по умолчанию для времени ожидания попытки автоматического выбора семейства сетей. Для получения дополнительной информации см. [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/ru/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**Добавлено в: v16.10.0, v14.19.0**

Отключает условие экспорта `node-addons`, а также отключает загрузку собственных дополнений. Если указан параметр `--no-addons`, вызов `process.dlopen` или требование собственного дополнения C++ завершится неудачей и вызовет исключение.

### `--no-deprecation` {#--no-addons}

**Добавлено в: v0.8.0**

Отключает предупреждения об устаревании.

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.7.0 | Обнаружение синтаксиса включено по умолчанию. |
| v21.1.0, v20.10.0 | Добавлено в: v21.1.0, v20.10.0 |
:::

Отключает использование [обнаружения синтаксиса](/ru/nodejs/api/packages#syntax-detection) для определения типа модуля.

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**Добавлено в: v21.2.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Отключает предоставление [Navigator API](/ru/nodejs/api/globals#navigator) в глобальной области видимости.

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**Добавлено в: v16.6.0**

Используйте этот флаг, чтобы отключить await верхнего уровня в REPL.

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Теперь по умолчанию false. |
| v22.0.0, v20.17.0 | Добавлено в: v22.0.0, v20.17.0 |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Отключает поддержку загрузки синхронного графа ES-модулей в `require()`.

См. [Загрузка модулей ECMAScript с использованием `require()`](/ru/nodejs/api/modules#loading-ecmascript-modules-using-require).


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.4.0 | SQLite больше не помечен как экспериментальный, но все еще находится в стадии разработки. |
| v22.5.0 | Добавлено в: v22.5.0 |
:::

Отключает экспериментальный модуль [`node:sqlite`](/ru/nodejs/api/sqlite).

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**Добавлено в: v22.0.0**

Отключает предоставление [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) в глобальной области видимости.

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**Добавлено в: v17.0.0**

Скрыть дополнительную информацию о фатальном исключении, которое приводит к выходу.

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**Добавлено в: v9.0.0**

Отключает проверки времени выполнения для `async_hooks`. Они по-прежнему будут динамически включаться, когда включен `async_hooks`.

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**Добавлено в: v16.10.0**

Не искать модули по глобальным путям, таким как `$HOME/.node_modules` и `$NODE_PATH`.

### `--no-network-family-autoselection` {#--no-global-search-paths}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Флаг был переименован из `--no-enable-network-family-autoselection` в `--no-network-family-autoselection`. Старое название все еще может работать как псевдоним. |
| v19.4.0 | Добавлено в: v19.4.0 |
:::

Отключает алгоритм автоматического выбора семейства, если параметры подключения явно не включают его.

### `--no-warnings` {#--no-network-family-autoselection}

**Добавлено в: v6.0.0**

Отключает все предупреждения процесса (включая устаревшие).

### `--node-memory-debug` {#--no-warnings}

**Добавлено в: v15.0.0, v14.18.0**

Включает дополнительные отладочные проверки на утечки памяти во внутренних компонентах Node.js. Обычно это полезно только разработчикам, отлаживающим сам Node.js.

### `--openssl-config=file` {#--node-memory-debug}

**Добавлено в: v6.9.0**

Загружает файл конфигурации OpenSSL при запуске. Помимо прочего, это можно использовать для включения криптографии, совместимой с FIPS, если Node.js собран с поддержкой FIPS-совместимой OpenSSL.

### `--openssl-legacy-provider` {#--openssl-config=file}

**Добавлено в: v17.0.0, v16.17.0**

Включает устаревший провайдер OpenSSL 3.0. Дополнительные сведения см. в разделе [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy).

### `--openssl-shared-config` {#--openssl-legacy-provider}

**Добавлено в: v18.5.0, v16.17.0, v14.21.0**

Включает раздел конфигурации OpenSSL по умолчанию, `openssl_conf`, для чтения из файла конфигурации OpenSSL. Файл конфигурации по умолчанию называется `openssl.cnf`, но это можно изменить с помощью переменной среды `OPENSSL_CONF` или с помощью параметра командной строки `--openssl-config`. Расположение файла конфигурации OpenSSL по умолчанию зависит от того, как OpenSSL связан с Node.js. Совместное использование конфигурации OpenSSL может иметь нежелательные последствия, и рекомендуется использовать раздел конфигурации, специфичный для Node.js, который называется `nodejs_conf` и используется по умолчанию, если этот параметр не используется.


### `--pending-deprecation` {#--openssl-shared-config}

**Добавлено в: v8.0.0**

Выдавать предупреждения об ожидаемом устаревании.

Ожидаемые устаревания обычно идентичны устареваниям времени выполнения, за заметным исключением: они *отключены* по умолчанию и не будут выдаваться, если не установлен флаг командной строки `--pending-deprecation` или переменная окружения `NODE_PENDING_DEPRECATION=1`. Ожидаемые устаревания используются для предоставления своего рода избирательного механизма "раннего предупреждения", который разработчики могут использовать для обнаружения использования устаревшего API.

### `--permission` {#--pending-deprecation}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Модель разрешений теперь стабильна. |
| v20.0.0 | Добавлено в: v20.0.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::

Включить модель разрешений для текущего процесса. При включении ограничиваются следующие разрешения:

- Файловая система - управляется флагами [`--allow-fs-read`](/ru/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/ru/nodejs/api/cli#--allow-fs-write)
- Дочерний процесс - управляется флагом [`--allow-child-process`](/ru/nodejs/api/cli#--allow-child-process)
- Рабочие потоки - управляется флагом [`--allow-worker`](/ru/nodejs/api/cli#--allow-worker)
- WASI - управляется флагом [`--allow-wasi`](/ru/nodejs/api/cli#--allow-wasi)
- Аддоны - управляется флагом [`--allow-addons`](/ru/nodejs/api/cli#--allow-addons)

### `--preserve-symlinks` {#--permission}

**Добавлено в: v6.3.0**

Указывает загрузчику модулей сохранять символические ссылки при разрешении и кэшировании модулей.

По умолчанию, когда Node.js загружает модуль из пути, который символически связан с другим местоположением на диске, Node.js разыменовывает ссылку и использует фактический "реальный путь" модуля на диске как идентификатор и как корневой путь для поиска других зависимых модулей. В большинстве случаев это поведение по умолчанию является приемлемым. Однако при использовании символически связанных одноранговых зависимостей, как показано в примере ниже, поведение по умолчанию вызывает исключение, если `moduleA` пытается потребовать `moduleB` как одноранговую зависимость:

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```
Флаг командной строки `--preserve-symlinks` указывает Node.js использовать путь символической ссылки для модулей, а не реальный путь, позволяя находить символически связанные одноранговые зависимости.

Обратите внимание, однако, что использование `--preserve-symlinks` может иметь другие побочные эффекты. В частности, символически связанные *нативные* модули могут не загрузиться, если они связаны из нескольких мест в дереве зависимостей (Node.js будет рассматривать их как два отдельных модуля и попытается загрузить модуль несколько раз, вызывая исключение).

Флаг `--preserve-symlinks` не применяется к основному модулю, что позволяет работать `node --preserve-symlinks node_module/.bin/\<foo\>`. Чтобы применить такое же поведение для основного модуля, также используйте `--preserve-symlinks-main`.


### `--preserve-symlinks-main` {#--preserve-symlinks}

**Добавлено в версии: v10.2.0**

Указывает загрузчику модулей сохранять символические ссылки при разрешении и кэшировании основного модуля (`require.main`).

Этот флаг существует для того, чтобы основной модуль можно было включить в то же поведение, которое `--preserve-symlinks` предоставляет всем остальным импортам; однако это отдельные флаги для обратной совместимости со старыми версиями Node.js.

`--preserve-symlinks-main` не подразумевает `--preserve-symlinks`; используйте `--preserve-symlinks-main` в дополнение к `--preserve-symlinks`, если нежелательно переходить по символическим ссылкам перед разрешением относительных путей.

См. [`--preserve-symlinks`](/ru/nodejs/api/cli#--preserve-symlinks) для получения дополнительной информации.

### `-p`, `--print "script"` {#--preserve-symlinks-main}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v5.11.0 | Встроенные библиотеки теперь доступны как предопределенные переменные. |
| v0.6.4 | Добавлено в версии: v0.6.4 |
:::

Идентичен `-e`, но печатает результат.

### `--prof` {#-p---print-"script"}

**Добавлено в версии: v2.0.0**

Создать вывод профилировщика V8.

### `--prof-process` {#--prof}

**Добавлено в версии: v5.2.0**

Обработать вывод профилировщика V8, сгенерированный с помощью опции V8 `--prof`.

### `--redirect-warnings=file` {#--prof-process}

**Добавлено в версии: v8.0.0**

Записывать предупреждения процесса в указанный файл вместо вывода в stderr. Файл будет создан, если он не существует, и будет добавлен в конец, если существует. Если при попытке записи предупреждения в файл произойдет ошибка, предупреждение будет записано в stderr.

`file` может быть абсолютным путем. Если это не так, каталог по умолчанию, в который он будет записан, контролируется параметром командной строки [`--diagnostic-dir`](/ru/nodejs/api/cli#--diagnostic-dirdirectory).

### `--report-compact` {#--redirect-warnings=file}

**Добавлено в версии: v13.12.0, v12.17.0**

Записывать отчеты в компактном формате, однострочный JSON, который легче потребляется системами обработки журналов, чем многострочный формат по умолчанию, предназначенный для использования человеком.

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Эта опция больше не является экспериментальной. |
| v12.0.0 | Переименовано с `--diagnostic-report-directory` на `--report-directory`. |
| v11.8.0 | Добавлено в версии: v11.8.0 |
:::

Место, где будет создан отчет.


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**Добавлено в: v23.3.0**

Если передать аргумент `--report-exclude-env`, сгенерированный диагностический отчёт не будет содержать данные `environmentVariables`.

### `--report-exclude-network` {#--report-exclude-env}

**Добавлено в: v22.0.0, v20.13.0**

Исключает `header.networkInterfaces` из диагностического отчёта. По умолчанию это не задано, и сетевые интерфейсы включаются.

### `--report-filename=filename` {#--report-exclude-network}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот параметр больше не является экспериментальным. |
| v12.0.0 | Переименовано из `--diagnostic-report-filename` в `--report-filename`. |
| v11.8.0 | Добавлено в: v11.8.0 |
:::

Имя файла, в который будет записан отчёт.

Если в качестве имени файла установлено `'stdout'` или `'stderr'`, отчёт будет записан в стандартный вывод или стандартный вывод ошибок процесса соответственно.

### `--report-on-fatalerror` {#--report-filename=filename}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | Этот параметр больше не является экспериментальным. |
| v12.0.0 | Переименовано из `--diagnostic-report-on-fatalerror` в `--report-on-fatalerror`. |
| v11.8.0 | Добавлено в: v11.8.0 |
:::

Включает создание отчёта при возникновении фатальных ошибок (внутренних ошибок в среде выполнения Node.js, таких как нехватка памяти), приводящих к завершению работы приложения. Полезно для изучения различных диагностических элементов данных, таких как куча, стек, состояние цикла событий, потребление ресурсов и т. д., чтобы понять причину фатальной ошибки.

### `--report-on-signal` {#--report-on-fatalerror}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот параметр больше не является экспериментальным. |
| v12.0.0 | Переименовано из `--diagnostic-report-on-signal` в `--report-on-signal`. |
| v11.8.0 | Добавлено в: v11.8.0 |
:::

Включает создание отчёта при получении указанного (или предопределённого) сигнала процессом Node.js. Сигнал для запуска отчёта указывается через `--report-signal`.

### `--report-signal=signal` {#--report-on-signal}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.17.0 | Этот параметр больше не является экспериментальным. |
| v12.0.0 | Переименовано из `--diagnostic-report-signal` в `--report-signal`. |
| v11.8.0 | Добавлено в: v11.8.0 |
:::

Устанавливает или сбрасывает сигнал для генерации отчёта (не поддерживается в Windows). Сигнал по умолчанию — `SIGUSR2`.


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.8.0, v16.18.0 | Отчет не генерируется, если необработанное исключение было обработано. |
| v13.12.0, v12.17.0 | Эта опция больше не является экспериментальной. |
| v12.0.0 | изменено с `--diagnostic-report-uncaught-exception` на `--report-uncaught-exception`. |
| v11.8.0 | Добавлено в: v11.8.0 |
:::

Включает генерацию отчета, когда процесс завершается из-за необработанного исключения. Полезно при изучении JavaScript стека в сочетании с нативным стеком и другими данными среды выполнения.

### `-r`, `--require module` {#--report-uncaught-exception}

**Добавлено в: v1.6.0**

Предварительная загрузка указанного модуля при запуске.

Следует правилам разрешения модуля `require()`. `module` может быть либо путем к файлу, либо именем node модуля.

Поддерживаются только CommonJS модули. Используйте [`--import`](/ru/nodejs/api/cli#--importmodule) для предварительной загрузки [модуля ECMAScript](/ru/nodejs/api/esm#modules-ecmascript-modules). Модули, предварительно загруженные с помощью `--require`, будут запущены до модулей, предварительно загруженных с помощью `--import`.

Модули предварительно загружаются в основной поток, а также в любые рабочие потоки, форкнутые процессы или кластеризованные процессы.

### `--run` {#-r---require-module}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.3.0 | Добавлена переменная окружения NODE_RUN_SCRIPT_NAME. |
| v22.3.0 | Добавлена переменная окружения NODE_RUN_PACKAGE_JSON_PATH. |
| v22.3.0 | Выполняет обход до корневого каталога и находит файл `package.json` для запуска команды, и соответственно обновляет переменную окружения `PATH`. |
| v22.0.0 | Добавлено в: v22.0.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Запускает указанную команду из объекта `"scripts"` файла package.json. Если предоставлена отсутствующая `"command"`, он перечислит доступные скрипты.

`--run` будет переходить вверх до корневого каталога и найдет файл `package.json`, из которого нужно запустить команду.

`--run` добавляет `./node_modules/.bin` для каждого предка текущего каталога в `PATH`, чтобы выполнять двоичные файлы из разных папок, где присутствуют несколько каталогов `node_modules`, если `ancestor-folder/node_modules/.bin` является каталогом.

`--run` выполняет команду в каталоге, содержащем связанный `package.json`.

Например, следующая команда запустит скрипт `test` из `package.json` в текущей папке:

```bash [BASH]
$ node --run test
```
Вы также можете передать аргументы команде. Любой аргумент после `--` будет добавлен к скрипту:

```bash [BASH]
$ node --run test -- --verbose
```

#### Намеренные ограничения {#--run}

`node --run` не предназначен для соответствия поведению `npm run` или командам `run` других менеджеров пакетов. Реализация Node.js намеренно более ограничена, чтобы сосредоточиться на максимальной производительности для наиболее распространенных случаев использования. Некоторые функции других реализаций `run`, которые намеренно исключены:

- Запуск скриптов `pre` или `post` в дополнение к указанному скрипту.
- Определение переменных окружения, специфичных для менеджера пакетов.

#### Переменные окружения {#intentional-limitations}

Следующие переменные окружения устанавливаются при запуске скрипта с помощью `--run`:

- `NODE_RUN_SCRIPT_NAME`: Имя запускаемого скрипта. Например, если `--run` используется для запуска `test`, значением этой переменной будет `test`.
- `NODE_RUN_PACKAGE_JSON_PATH`: Путь к `package.json`, который обрабатывается.

### `--secure-heap-min=n` {#environment-variables}

**Добавлено в: v15.6.0**

При использовании `--secure-heap` флаг `--secure-heap-min` определяет минимальный объем памяти, выделяемый из безопасной кучи. Минимальное значение - `2`. Максимальное значение - меньшее из `--secure-heap` или `2147483647`. Заданное значение должно быть степенью двойки.

### `--secure-heap=n` {#--secure-heap-min=n}

**Добавлено в: v15.6.0**

Инициализирует безопасную кучу OpenSSL размером `n` байт. После инициализации безопасная куча используется для определенных типов выделений памяти в OpenSSL во время генерации ключей и других операций. Это полезно, например, для предотвращения утечки конфиденциальной информации из-за переполнения или недополнения указателя.

Безопасная куча имеет фиксированный размер и не может быть изменена во время выполнения, поэтому, если она используется, важно выбрать достаточно большую кучу, чтобы покрыть все случаи использования приложения.

Размер кучи должен быть степенью двойки. Любое значение меньше 2 отключит безопасную кучу.

Безопасная куча отключена по умолчанию.

Безопасная куча недоступна в Windows.

См. [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init) для получения более подробной информации.

### `--snapshot-blob=path` {#--secure-heap=n}

**Добавлено в: v18.8.0**

::: warning [Стабильный: 1 - Экспериментальный]
[Стабильный: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

При использовании с `--build-snapshot` `--snapshot-blob` указывает путь, по которому записывается сгенерированный blob-объект snapshot. Если не указано, сгенерированный blob-объект записывается в `snapshot.blob` в текущем рабочем каталоге.

При использовании без `--build-snapshot` `--snapshot-blob` указывает путь к blob-объекту, который используется для восстановления состояния приложения.

При загрузке snapshot Node.js проверяет, что:

Если они не совпадают, Node.js отказывается загружать snapshot и завершает работу с кодом состояния 1.


### `--test` {#--snapshot-blob=path}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Тестовый движок теперь стабилен. |
| v19.2.0, v18.13.0 | Тестовый движок теперь поддерживает запуск в режиме отслеживания. |
| v18.1.0, v16.17.0 | Добавлено в: v18.1.0, v16.17.0 |
:::

Запускает тестовый движок командной строки Node.js. Этот флаг нельзя комбинировать с `--watch-path`, `--check`, `--eval`, `--interactive` или отладчиком. Подробности смотрите в документации о [запуске тестов из командной строки](/ru/nodejs/api/test#running-tests-from-the-command-line).

### `--test-concurrency` {#--test}

**Добавлено в: v21.0.0, v20.10.0, v18.19.0**

Максимальное количество тестовых файлов, которое CLI тестового движка будет выполнять одновременно. Если `--experimental-test-isolation` установлено в `'none'`, этот флаг игнорируется, и параллелизм равен одному. В противном случае, по умолчанию параллелизм равен `os.availableParallelism() - 1`.

### `--test-coverage-branches=threshold` {#--test-concurrency}

**Добавлено в: v22.8.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

Требует минимальный процент покрытых ветвей. Если покрытие кода не достигает указанного порога, процесс завершится с кодом `1`.

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**Добавлено в: v22.5.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

Исключает определенные файлы из покрытия кода, используя шаблон glob, который может соответствовать как абсолютным, так и относительным путям к файлам.

Этот параметр можно указать несколько раз, чтобы исключить несколько шаблонов glob.

Если предоставлены и `--test-coverage-exclude`, и `--test-coverage-include`, файлы должны соответствовать **обоим** критериям, чтобы быть включенными в отчет о покрытии.

По умолчанию все соответствующие тестовые файлы исключаются из отчета о покрытии. Указание этого параметра переопределит поведение по умолчанию.

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**Добавлено в: v22.8.0**

::: warning [Стабильность: 1 - Экспериментальный]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

Требует минимальный процент покрытых функций. Если покрытие кода не достигает указанного порога, процесс завершится с кодом `1`.


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**Добавлено в: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Включает определенные файлы в покрытие кода, используя шаблон glob, который может соответствовать как абсолютным, так и относительным путям к файлам.

Этот параметр можно указать несколько раз, чтобы включить несколько шаблонов glob.

Если указаны как `--test-coverage-exclude`, так и `--test-coverage-include`, файлы должны соответствовать **обоим** критериям, чтобы быть включенными в отчет о покрытии.

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**Добавлено в: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Требует минимальный процент покрытых строк. Если покрытие кода не достигает указанного порога, процесс завершится с кодом `1`.

### `--test-force-exit` {#--test-coverage-lines=threshold}

**Добавлено в: v22.0.0, v20.14.0**

Настраивает средство запуска тестов для завершения процесса после завершения выполнения всех известных тестов, даже если цикл событий в противном случае останется активным.

### `--test-name-pattern` {#--test-force-exit}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Средство запуска тестов теперь стабильно. |
| v18.11.0 | Добавлено в: v18.11.0 |
:::

Регулярное выражение, которое настраивает средство запуска тестов для выполнения только тех тестов, имя которых соответствует предоставленному шаблону. Дополнительные сведения см. в документации по [фильтрации тестов по имени](/ru/nodejs/api/test#filtering-tests-by-name).

Если указаны как `--test-name-pattern`, так и `--test-skip-pattern`, тесты должны удовлетворять **обоим** требованиям, чтобы быть выполненными.

### `--test-only` {#--test-name-pattern}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Средство запуска тестов теперь стабильно. |
| v18.0.0, v16.17.0 | Добавлено в: v18.0.0, v16.17.0 |
:::

Настраивает средство запуска тестов для выполнения только тестов верхнего уровня, для которых установлен параметр `only`. Этот флаг не требуется, когда изоляция тестов отключена.

### `--test-reporter` {#--test-only}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Средство запуска тестов теперь стабильно. |
| v19.6.0, v18.15.0 | Добавлено в: v19.6.0, v18.15.0 |
:::

Репортер тестов, который будет использоваться при выполнении тестов. Дополнительные сведения см. в документации по [репортерам тестов](/ru/nodejs/api/test#test-reporters).


### `--test-reporter-destination` {#--test-reporter}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Тестовый движок теперь стабилен. |
| v19.6.0, v18.15.0 | Добавлено в: v19.6.0, v18.15.0 |
:::

Назначение для соответствующего репортера тестов. Подробности смотрите в документации по [репортерам тестов](/ru/nodejs/api/test#test-reporters).

### `--test-shard` {#--test-reporter-destination}

**Добавлено в: v20.5.0, v18.19.0**

Сегмент набора тестов для выполнения в формате `\<index\>/\<total\>`, где

`index` — положительное целое число, индекс разделенных частей; `total` — положительное целое число, общее количество разделенных частей. Эта команда разделит все файлы тестов на `total` равных частей и запустит только те, которые находятся в части `index`.

Например, чтобы разделить набор тестов на три части, используйте следующее:

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**Добавлено в: v22.1.0**

Регулярное выражение, которое настраивает тестовый движок для пропуска тестов, имя которых соответствует предоставленному шаблону. Подробности смотрите в документации по [фильтрации тестов по имени](/ru/nodejs/api/test#filtering-tests-by-name).

Если предоставлены и `--test-name-pattern`, и `--test-skip-pattern`, тесты должны удовлетворять **обоим** требованиям, чтобы быть выполненными.

### `--test-timeout` {#--test-skip-pattern}

**Добавлено в: v21.2.0, v20.11.0**

Количество миллисекунд, после которого выполнение теста завершится с ошибкой. Если не указано, подтесты наследуют это значение от своего родителя. Значение по умолчанию — `Infinity`.

### `--test-update-snapshots` {#--test-timeout}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.4.0 | Тестирование снимков больше не является экспериментальным. |
| v22.3.0 | Добавлено в: v22.3.0 |
:::

Генерирует заново файлы снимков, используемые тестовым движком для [тестирования снимков](/ru/nodejs/api/test#snapshot-testing).

### `--throw-deprecation` {#--test-update-snapshots}

**Добавлено в: v0.11.14**

Выдавать ошибки для устареваний.

### `--title=title` {#--throw-deprecation}

**Добавлено в: v10.7.0**

Установить `process.title` при запуске.

### `--tls-cipher-list=list` {#--title=title}

**Добавлено в: v4.0.0**

Укажите альтернативный список шифров TLS по умолчанию. Требуется, чтобы Node.js был собран с поддержкой криптографии (по умолчанию).


### `--tls-keylog=file` {#--tls-cipher-list=list}

**Добавлено в: v13.2.0, v12.16.0**

Регистрирует ключевой материал TLS в файл. Ключевой материал имеет формат NSS `SSLKEYLOGFILE` и может использоваться программным обеспечением (например, Wireshark) для расшифровки трафика TLS.

### `--tls-max-v1.2` {#--tls-keylog=file}

**Добавлено в: v12.0.0, v10.20.0**

Устанавливает для [`tls.DEFAULT_MAX_VERSION`](/ru/nodejs/api/tls#tlsdefault_max_version) значение 'TLSv1.2'. Используется для отключения поддержки TLSv1.3.

### `--tls-max-v1.3` {#--tls-max-v12}

**Добавлено в: v12.0.0**

Устанавливает для [`tls.DEFAULT_MAX_VERSION`](/ru/nodejs/api/tls#tlsdefault_max_version) значение 'TLSv1.3'. Используется для включения поддержки TLSv1.3.

### `--tls-min-v1.0` {#--tls-max-v13}

**Добавлено в: v12.0.0, v10.20.0**

Устанавливает для [`tls.DEFAULT_MIN_VERSION`](/ru/nodejs/api/tls#tlsdefault_min_version) значение 'TLSv1'. Используется для совместимости со старыми клиентами или серверами TLS.

### `--tls-min-v1.1` {#--tls-min-v10}

**Добавлено в: v12.0.0, v10.20.0**

Устанавливает для [`tls.DEFAULT_MIN_VERSION`](/ru/nodejs/api/tls#tlsdefault_min_version) значение 'TLSv1.1'. Используется для совместимости со старыми клиентами или серверами TLS.

### `--tls-min-v1.2` {#--tls-min-v11}

**Добавлено в: v12.2.0, v10.20.0**

Устанавливает для [`tls.DEFAULT_MIN_VERSION`](/ru/nodejs/api/tls#tlsdefault_min_version) значение 'TLSv1.2'. Это значение по умолчанию для 12.x и более поздних версий, но эта опция поддерживается для совместимости со старыми версиями Node.js.

### `--tls-min-v1.3` {#--tls-min-v12}

**Добавлено в: v12.0.0**

Устанавливает для [`tls.DEFAULT_MIN_VERSION`](/ru/nodejs/api/tls#tlsdefault_min_version) значение 'TLSv1.3'. Используется для отключения поддержки TLSv1.2, который не так безопасен, как TLSv1.3.

### `--trace-deprecation` {#--tls-min-v13}

**Добавлено в: v0.8.0**

Выводит трассировку стека для устаревших функций.

### `--trace-env` {#--trace-deprecation}

**Добавлено в: v23.4.0**

Выводит в stderr информацию о любом доступе к переменным окружения, выполняемом в текущем экземпляре Node.js, в том числе:

- Чтения переменных окружения, которые Node.js выполняет внутренне.
- Записи в форме `process.env.KEY = "SOME VALUE"`.
- Чтения в форме `process.env.KEY`.
- Определения в форме `Object.defineProperty(process.env, 'KEY', {...})`.
- Запросы в форме `Object.hasOwn(process.env, 'KEY')`, `process.env.hasOwnProperty('KEY')` или `'KEY' in process.env`.
- Удаления в форме `delete process.env.KEY`.
- Перечисления в форме `...process.env` или `Object.keys(process.env)`.

Выводятся только имена переменных окружения, к которым осуществляется доступ. Значения не выводятся.

Чтобы вывести трассировку стека доступа, используйте `--trace-env-js-stack` и/или `--trace-env-native-stack`.


### `--trace-env-js-stack` {#--trace-env}

**Добавлено в: v23.4.0**

В дополнение к тому, что делает `--trace-env`, это печатает трассировку стека JavaScript для доступа.

### `--trace-env-native-stack` {#--trace-env-js-stack}

**Добавлено в: v23.4.0**

В дополнение к тому, что делает `--trace-env`, это печатает трассировку стека нативном коде для доступа.

### `--trace-event-categories` {#--trace-env-native-stack}

**Добавлено в: v7.7.0**

Разделенный запятыми список категорий, которые должны быть отслежены, когда отслеживание событий трассировки включено с помощью `--trace-events-enabled`.

### `--trace-event-file-pattern` {#--trace-event-categories}

**Добавлено в: v9.8.0**

Строка шаблона, указывающая путь к файлу для данных событий трассировки, поддерживает `${rotation}` и `${pid}`.

### `--trace-events-enabled` {#--trace-event-file-pattern}

**Добавлено в: v7.7.0**

Включает сбор информации о трассировке событий трассировки.

### `--trace-exit` {#--trace-events-enabled}

**Добавлено в: v13.5.0, v12.16.0**

Печатает трассировку стека всякий раз, когда среда завершается проактивно, т.е. вызывается `process.exit()`.

### `--trace-require-module=mode` {#--trace-exit}

**Добавлено в: v23.5.0**

Печатает информацию об использовании [Загрузка модулей ECMAScript с использованием `require()`](/ru/nodejs/api/modules#loading-ecmascript-modules-using-require).

Когда `mode` имеет значение `all`, печатается все использование. Когда `mode` имеет значение `no-node-modules`, использование из папки `node_modules` исключается.

### `--trace-sigint` {#--trace-require-module=mode}

**Добавлено в: v13.9.0, v12.17.0**

Печатает трассировку стека при SIGINT.

### `--trace-sync-io` {#--trace-sigint}

**Добавлено в: v2.1.0**

Печатает трассировку стека всякий раз, когда обнаруживается синхронный ввод-вывод после первого оборота цикла событий.

### `--trace-tls` {#--trace-sync-io}

**Добавлено в: v12.2.0**

Печатает информацию о трассировке пакетов TLS в `stderr`. Это можно использовать для отладки проблем с подключением TLS.

### `--trace-uncaught` {#--trace-tls}

**Добавлено в: v13.1.0**

Печатать трассировки стека для необработанных исключений; обычно печатается трассировка стека, связанная с созданием `Error`, тогда как это заставляет Node.js также печатать трассировку стека, связанную с выбрасыванием значения (которое не обязательно должно быть экземпляром `Error`).

Включение этой опции может негативно повлиять на поведение сборщика мусора.

### `--trace-warnings` {#--trace-uncaught}

**Добавлено в: v6.0.0**

Печатать трассировки стека для предупреждений процесса (включая устаревания).


### `--track-heap-objects` {#--trace-warnings}

**Добавлено в: v2.4.0**

Отслеживает выделение объектов в куче для создания моментальных снимков кучи.

### `--unhandled-rejections=mode` {#--track-heap-objects}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Режим по умолчанию изменен на `throw`. Ранее выводилось предупреждение. |
| v12.0.0, v10.17.0 | Добавлено в: v12.0.0, v10.17.0 |
:::

Этот флаг позволяет изменить поведение при возникновении необработанного отклонения (unhandled rejection). Можно выбрать один из следующих режимов:

- `throw`: Генерирует событие [`unhandledRejection`](/ru/nodejs/api/process#event-unhandledrejection). Если этот обработчик не установлен, необработанное отклонение выбрасывается как неперехваченное исключение. Это поведение по умолчанию.
- `strict`: Выбрасывает необработанное отклонение как неперехваченное исключение. Если исключение обработано, генерируется событие [`unhandledRejection`](/ru/nodejs/api/process#event-unhandledrejection).
- `warn`: Всегда вызывает предупреждение, независимо от того, установлен ли обработчик [`unhandledRejection`](/ru/nodejs/api/process#event-unhandledrejection), но не выводит предупреждение об устаревании.
- `warn-with-error-code`: Генерирует событие [`unhandledRejection`](/ru/nodejs/api/process#event-unhandledrejection). Если этот обработчик не установлен, выводит предупреждение и устанавливает код выхода процесса равным 1.
- `none`: Отключает все предупреждения.

Если отклонение происходит во время фазы статической загрузки ES-модуля командной строки, оно всегда будет выброшено как неперехваченное исключение.

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**Добавлено в: v6.11.0**

Использовать встроенное хранилище CA Mozilla, поставляемое текущей версией Node.js, или использовать хранилище CA OpenSSL по умолчанию. Хранилище по умолчанию выбирается во время сборки.

Встроенное хранилище CA, поставляемое Node.js, представляет собой снимок хранилища CA Mozilla, зафиксированный на момент выпуска. Он идентичен на всех поддерживаемых платформах.

Использование хранилища OpenSSL позволяет вносить внешние изменения в хранилище. Для большинства дистрибутивов Linux и BSD это хранилище поддерживается сопровождающими дистрибутива и системными администраторами. Расположение хранилища CA OpenSSL зависит от конфигурации библиотеки OpenSSL, но это можно изменить во время выполнения с помощью переменных среды.

См. `SSL_CERT_DIR` и `SSL_CERT_FILE`.


### `--use-largepages=mode` {#--use-bundled-ca---use-openssl-ca}

**Добавлено в версии: v13.6.0, v12.17.0**

Переназначить статический код Node.js на страницы памяти большого размера при запуске. Если поддерживается целевой системой, это приведет к перемещению статического кода Node.js на страницы размером 2 МиБ вместо страниц размером 4 КиБ.

Для `mode` допустимы следующие значения:

- `off`: Попытка сопоставления не будет предпринята. Это значение по умолчанию.
- `on`: Если поддерживается ОС, будет предпринята попытка сопоставления. Ошибка сопоставления будет проигнорирована, и сообщение будет напечатано в стандартную ошибку.
- `silent`: Если поддерживается ОС, будет предпринята попытка сопоставления. Ошибка сопоставления будет проигнорирована и не будет сообщена.

### `--v8-options` {#--use-largepages=mode}

**Добавлено в версии: v0.1.3**

Вывести параметры командной строки V8.

### `--v8-pool-size=num` {#--v8-options}

**Добавлено в версии: v5.10.0**

Установите размер пула потоков V8, который будет использоваться для распределения фоновых задач.

Если установлено значение `0`, Node.js выберет подходящий размер пула потоков, основываясь на оценке степени параллелизма.

Степень параллелизма относится к количеству вычислений, которые могут выполняться одновременно на данной машине. В общем случае, это то же самое, что и количество ЦП, но может отличаться в таких средах, как виртуальные машины или контейнеры.

### `-v`, `--version` {#--v8-pool-size=num}

**Добавлено в версии: v0.1.3**

Вывести версию Node.js.

### `--watch` {#-v---version}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Режим наблюдения теперь стабилен. |
| v19.2.0, v18.13.0 | Тестовый прогонщик теперь поддерживает запуск в режиме наблюдения. |
| v18.11.0, v16.19.0 | Добавлено в версии: v18.11.0, v16.19.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Запускает Node.js в режиме наблюдения. В режиме наблюдения изменения в отслеживаемых файлах приводят к перезапуску процесса Node.js. По умолчанию режим наблюдения будет отслеживать точку входа и любой требуемый или импортированный модуль. Используйте `--watch-path`, чтобы указать, какие пути отслеживать.

Этот флаг нельзя комбинировать с `--check`, `--eval`, `--interactive` или REPL.

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0, v20.13.0 | Режим наблюдения теперь стабилен. |
| v18.11.0, v16.19.0 | Добавлено в: v18.11.0, v16.19.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Запускает Node.js в режиме наблюдения и указывает, за какими путями следить. В режиме наблюдения изменения в отслеживаемых путях приводят к перезапуску процесса Node.js. Это отключит наблюдение за необходимыми или импортированными модулями, даже при использовании в сочетании с `--watch`.

Этот флаг нельзя комбинировать с `--check`, `--eval`, `--interactive`, `--test` или REPL.

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
Этот параметр поддерживается только в macOS и Windows. Исключение `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` будет выдано, если этот параметр используется на платформе, которая его не поддерживает.

### `--watch-preserve-output` {#--watch-path}

**Добавлено в: v19.3.0, v18.13.0**

Отключает очистку консоли при перезапуске процесса в режиме наблюдения.

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**Добавлено в: v6.0.0**

Автоматически заполняет нулями все новые экземпляры [`Buffer`](/ru/nodejs/api/buffer#class-buffer) и [`SlowBuffer`](/ru/nodejs/api/buffer#class-slowbuffer).

## Переменные окружения {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

Переменная окружения `FORCE_COLOR` используется для включения ANSI-окрашенного вывода. Значение может быть:

- `1`, `true` или пустая строка `''` указывают на поддержку 16 цветов,
- `2` указывает на поддержку 256 цветов, или
- `3` указывает на поддержку 16 миллионов цветов.

Когда используется `FORCE_COLOR` и установлено поддерживаемое значение, обе переменные окружения `NO_COLOR` и `NODE_DISABLE_COLORS` игнорируются.

Любое другое значение приведет к отключению цветного вывода.

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**Добавлено в: v22.1.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Включите [кеш компиляции модулей](/ru/nodejs/api/module#module-compile-cache) для экземпляра Node.js. Подробности смотрите в документации по [кешу компиляции модулей](/ru/nodejs/api/module#module-compile-cache).


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**Добавлено в: v0.1.32**

Список основных модулей, разделенных символом `','`, для которых должна выводиться отладочная информация.

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

Список основных C++ модулей, разделенных символом `','`, для которых должна выводиться отладочная информация.

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**Добавлено в: v0.3.0**

Если установлено, цвета не будут использоваться в REPL.

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**Добавлено в: v22.8.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Отключить [кэш компиляции модулей](/ru/nodejs/api/module#module-compile-cache) для экземпляра Node.js. См. документацию по [кэшу компиляции модулей](/ru/nodejs/api/module#module-compile-cache) для получения подробной информации.

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**Добавлено в: v7.3.0**

Если установлено, общеизвестные "корневые" ЦС (например, VeriSign) будут расширены дополнительными сертификатами из `file`. Файл должен содержать один или несколько доверенных сертификатов в формате PEM. Если файл отсутствует или имеет неправильный формат, будет (один раз) отправлено сообщение с помощью [`process.emitWarning()`](/ru/nodejs/api/process#processemitwarningwarning-options), но любые другие ошибки игнорируются.

Ни общеизвестные, ни дополнительные сертификаты не используются, если свойство `ca` явно указано для TLS или HTTPS клиента или сервера.

Эта переменная окружения игнорируется, когда `node` запускается как setuid root или имеет установленные возможности файла Linux.

Переменная окружения `NODE_EXTRA_CA_CERTS` считывается только при первом запуске процесса Node.js. Изменение значения во время выполнения с помощью `process.env.NODE_EXTRA_CA_CERTS` не оказывает никакого влияния на текущий процесс.

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**Добавлено в: v0.11.15**

Путь к данным ICU (объекта `Intl`). Расширит встроенные данные при компиляции с поддержкой small-icu.

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**Добавлено в: v6.11.0**

Если установлено значение `1`, предупреждения процесса подавляются.

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**Добавлено в: v8.0.0**

Список параметров командной строки, разделенных пробелами. `options...` интерпретируются до параметров командной строки, поэтому параметры командной строки будут переопределять или дополнять все, что находится в `options...`. Node.js завершит работу с ошибкой, если используется параметр, который не разрешен в среде, такой как `-p` или файл сценария.

Если значение параметра содержит пробел, его можно экранировать с помощью двойных кавычек:

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
Одиночный флаг, переданный в качестве параметра командной строки, переопределит тот же флаг, переданный в `NODE_OPTIONS`:

```bash [BASH]
# Инспектор будет доступен на порту 5555 {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
Флаг, который можно передать несколько раз, будет обрабатываться так, как если бы его экземпляры `NODE_OPTIONS` были переданы первыми, а затем его экземпляры командной строки:

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# эквивалентно: {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
Разрешенные параметры Node.js находятся в следующем списке. Если параметр поддерживает варианты --XX и --no-XX, они оба поддерживаются, но в список включен только один.

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

Разрешенные параметры V8:

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`, `--perf-basic-prof`, `--perf-prof-unwinding-info` и `--perf-prof` доступны только в Linux.

`--enable-etw-stack-walking` доступен только в Windows.


### `NODE_PATH=path[:…]` {#is-equivalent-to}

**Добавлено в: v0.1.32**

Список разделенных символом `':'` директорий, которые добавляются к пути поиска модулей.

В Windows вместо этого используется список, разделенный символом `';'`.

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**Добавлено в: v8.0.0**

Если установлено значение `1`, выдавать предупреждения об отложенной отмене.

Отложенные отмены обычно идентичны отмене во время выполнения, за исключением того, что они *отключены* по умолчанию и не будут выдаваться, если не установлен флаг командной строки `--pending-deprecation` или переменная среды `NODE_PENDING_DEPRECATION=1`. Отложенные отмены используются для предоставления своего рода селективного механизма "раннего предупреждения", который разработчики могут использовать для обнаружения использования устаревшего API.

### `NODE_PENDING_PIPE_INSTANCES=instances` {#node_pending_deprecation=1}

Установите количество ожидающих дескрипторов экземпляров каналов, когда сервер каналов ожидает подключения. Этот параметр применяется только к Windows.

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**Добавлено в: v7.1.0**

Если установлено значение `1`, предписывает загрузчику модулей сохранять символические ссылки при разрешении и кэшировании модулей.

### `NODE_REDIRECT_WARNINGS=file` {#node_preserve_symlinks=1}

**Добавлено в: v8.0.0**

Если установлено, предупреждения процесса будут выдаваться в указанный файл вместо печати в stderr. Файл будет создан, если он не существует, и будет добавлен, если он существует. Если при попытке записи предупреждения в файл произошла ошибка, предупреждение будет записано в stderr. Это эквивалентно использованию флага командной строки `--redirect-warnings=file`.

### `NODE_REPL_EXTERNAL_MODULE=file` {#node_redirect_warnings=file}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.3.0, v20.16.0 | Удалена возможность использования этой переменной среды с kDisableNodeOptionsEnv для встраиваемых систем. |
| v13.0.0, v12.16.0 | Добавлено в: v13.0.0, v12.16.0 |
:::

Путь к модулю Node.js, который будет загружен вместо встроенного REPL. Переопределение этого значения на пустую строку (`''`) приведет к использованию встроенного REPL.

### `NODE_REPL_HISTORY=file` {#node_repl_external_module=file}

**Добавлено в: v3.0.0**

Путь к файлу, используемому для хранения постоянной истории REPL. Путь по умолчанию — `~/.node_repl_history`, который переопределяется этой переменной. Установка значения в пустую строку (`''` или `' '`) отключает постоянную историю REPL.


### `NODE_SKIP_PLATFORM_CHECK=value` {#node_repl_history=file}

**Добавлено в: v14.5.0**

Если `value` равно `'1'`, проверка поддерживаемой платформы пропускается во время запуска Node.js. Node.js может работать некорректно. Любые проблемы, возникающие на неподдерживаемых платформах, не будут исправлены.

### `NODE_TEST_CONTEXT=value` {#node_skip_platform_check=value}

Если `value` равно `'child'`, параметры средства создания отчетов о тестировании будут переопределены, и выходные данные теста будут отправлены в stdout в формате TAP. Если указано какое-либо другое значение, Node.js не дает никаких гарантий относительно используемого формата средства создания отчетов или его стабильности.

### `NODE_TLS_REJECT_UNAUTHORIZED=value` {#node_test_context=value}

Если `value` равно `'0'`, проверка сертификатов отключена для TLS-соединений. Это делает TLS и HTTPS в частности небезопасными. Использование этой переменной среды настоятельно не рекомендуется.

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

При установке Node.js начнет выводить [покрытие кода JavaScript V8](https://v8project.blogspot.com/2017/12/javascript-code-coverage) и данные [карты исходного кода](https://sourcemaps.info/spec) в каталог, указанный в качестве аргумента (информация о покрытии записывается в виде JSON в файлы с префиксом `coverage`).

`NODE_V8_COVERAGE` будет автоматически распространяться на подпроцессы, что упрощает инструментирование приложений, вызывающих семейство функций `child_process.spawn()`. `NODE_V8_COVERAGE` можно установить в пустую строку, чтобы предотвратить распространение.

### `NO_COLOR=&lt;any&gt;` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) — это псевдоним для `NODE_DISABLE_COLORS`. Значение переменной среды произвольно.

#### Вывод покрытия {#no_color=&lt;any&gt;}

Покрытие выводится как массив объектов [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage) по ключу верхнего уровня `result`:

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```
#### Кэш карт исходного кода {#coverage-output}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Если найдено, данные карты исходного кода добавляются к ключу верхнего уровня `source-map-cache` в объекте покрытия JSON.

`source-map-cache` — это объект с ключами, представляющими файлы, из которых были извлечены карты исходного кода, и значениями, которые включают необработанный URL-адрес карты исходного кода (в ключе `url`), проанализированную информацию Source Map v3 (в ключе `data`) и длины строк исходного файла (в ключе `lineLengths`).

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=file` {#source-map-cache}

**Добавлено в: v6.11.0**

Загружает файл конфигурации OpenSSL при запуске. Помимо прочего, это можно использовать для включения криптографии, совместимой с FIPS, если Node.js собран с `./configure --openssl-fips`.

Если используется параметр командной строки [`--openssl-config`](/ru/nodejs/api/cli#--openssl-configfile), переменная среды игнорируется.

### `SSL_CERT_DIR=dir` {#openssl_conf=file}

**Добавлено в: v7.7.0**

Если включен `--use-openssl-ca`, это переопределяет и устанавливает каталог OpenSSL, содержащий доверенные сертификаты.

Имейте в виду, что если дочерняя среда не задана явно, эта переменная среды будет унаследована любыми дочерними процессами, и если они используют OpenSSL, это может привести к тому, что они будут доверять тем же CA, что и node.

### `SSL_CERT_FILE=file` {#ssl_cert_dir=dir}

**Добавлено в: v7.7.0**

Если включен `--use-openssl-ca`, это переопределяет и устанавливает файл OpenSSL, содержащий доверенные сертификаты.

Имейте в виду, что если дочерняя среда не задана явно, эта переменная среды будет унаследована любыми дочерними процессами, и если они используют OpenSSL, это может привести к тому, что они будут доверять тем же CA, что и node.

### `TZ` {#ssl_cert_file=file}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.2.0 | Изменение переменной TZ с помощью process.env.TZ = также изменяет часовой пояс в Windows. |
| v13.0.0 | Изменение переменной TZ с помощью process.env.TZ = изменяет часовой пояс в системах POSIX. |
| v0.0.1 | Добавлено в: v0.0.1 |
:::

Переменная среды `TZ` используется для указания конфигурации часового пояса.

Хотя Node.js не поддерживает все различные [способы обработки `TZ` в других средах](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable), он поддерживает основные [идентификаторы часовых поясов](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (например, `'Etc/UTC'`, `'Europe/Paris'` или `'America/New_York'`). Он может поддерживать несколько других сокращений или псевдонимов, но они настоятельно не рекомендуются и не гарантируются.

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=size` {#tz}

Устанавливает количество потоков, используемых в пуле потоков libuv, равным `size` потокам.

Асинхронные системные API используются Node.js, когда это возможно, но там, где их нет, пул потоков libuv используется для создания асинхронных Node API на основе синхронных системных API. Node.js API, которые используют пул потоков:

- все API `fs`, кроме API наблюдателя за файлами и тех, которые явно синхронны
- асинхронные крипто API, такие как `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`
- `dns.lookup()`
- все API `zlib`, кроме тех, которые явно синхронны

Поскольку пул потоков libuv имеет фиксированный размер, это означает, что если по какой-либо причине любой из этих API занимает много времени, другие (казалось бы, не связанные) API, которые работают в пуле потоков libuv, будут испытывать снижение производительности. Чтобы смягчить эту проблему, одним из возможных решений является увеличение размера пула потоков libuv, установив для переменной среды `'UV_THREADPOOL_SIZE'` значение больше `4` (ее текущее значение по умолчанию). Однако установка этого значения внутри процесса с помощью `process.env.UV_THREADPOOL_SIZE=size` не гарантированно сработает, поскольку пул потоков был бы создан как часть инициализации среды выполнения задолго до запуска пользовательского кода. Для получения дополнительной информации см. [документацию по пулу потоков libuv](https://docs.libuv.org/en/latest/threadpool).

## Полезные опции V8 {#uv_threadpool_size=size}

V8 имеет свой собственный набор опций командной строки. Любая опция V8 CLI, предоставленная `node`, будет передана V8 для обработки. Опции V8 *не имеют гарантии стабильности*. Команда V8 сама не считает их частью своего формального API и оставляет за собой право изменять их в любое время. Аналогично, они не подпадают под гарантии стабильности Node.js. Многие из опций V8 представляют интерес только для разработчиков V8. Несмотря на это, существует небольшой набор опций V8, которые широко применимы к Node.js, и они задокументированы здесь:

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (в МиБ) {#--jitless_1}

Устанавливает максимальный размер памяти для старого сегмента памяти V8. По мере приближения потребления памяти к лимиту, V8 будет тратить больше времени на сборку мусора, чтобы освободить неиспользуемую память.

На машине с 2 ГиБ памяти, рекомендуется установить значение в 1536 (1.5 ГиБ), чтобы оставить немного памяти для других целей и избежать своппинга.

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (в МиБ) {#--max-old-space-size=size-in-mib}

Устанавливает максимальный размер [полупространства](https://www.memorymanagement.org/glossary/s#semi.space) для [scavenge garbage collector](https://v8.dev/blog/orinoco-parallel-scavenger) V8 в МиБ (мебибайтах). Увеличение максимального размера полупространства может повысить пропускную способность для Node.js ценой большего потребления памяти.

Поскольку размер молодого поколения кучи V8 в три раза больше (см. [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) в V8) размера полупространства, увеличение на 1 МиБ для полупространства применяется к каждому из трех отдельных полупространств и приводит к увеличению размера кучи на 3 МиБ. Улучшение пропускной способности зависит от вашей рабочей нагрузки (см. [#42511](https://github.com/nodejs/node/issues/42511)).

Значение по умолчанию зависит от лимита памяти. Например, в 64-битных системах с лимитом памяти 512 МиБ, максимальный размер полупространства по умолчанию составляет 1 МиБ. Для лимитов памяти до 2 ГиБ включительно, максимальный размер полупространства по умолчанию будет меньше 16 МиБ в 64-битных системах.

Чтобы получить наилучшую конфигурацию для вашего приложения, вам следует попробовать различные значения max-semi-space-size при запуске бенчмарков для вашего приложения.

Например, бенчмарк в 64-битных системах:

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

Максимальное количество кадров стека для сбора в трассировке стека ошибки. Установка значения 0 отключает сбор трассировки стека. Значение по умолчанию - 10.

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # выводит 12
```

