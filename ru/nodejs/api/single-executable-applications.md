---
title: Однофайловые исполняемые приложения с Node.js
description: Узнайте, как создавать и управлять однофайловыми исполняемыми приложениями с помощью Node.js, включая упаковку вашего приложения, управление зависимостями и учет вопросов безопасности.
head:
  - - meta
    - name: og:title
      content: Однофайловые исполняемые приложения с Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как создавать и управлять однофайловыми исполняемыми приложениями с помощью Node.js, включая упаковку вашего приложения, управление зависимостями и учет вопросов безопасности.
  - - meta
    - name: twitter:title
      content: Однофайловые исполняемые приложения с Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как создавать и управлять однофайловыми исполняемыми приложениями с помощью Node.js, включая упаковку вашего приложения, управление зависимостями и учет вопросов безопасности.
---


# Однофайловые исполняемые приложения {#single-executable-applications}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.6.0 | Добавлена поддержка "useSnapshot". |
| v20.6.0 | Добавлена поддержка "useCodeCache". |
| v19.7.0, v18.16.0 | Добавлено в: v19.7.0, v18.16.0 |
:::

::: warning [Стабильность: 1 - Экспериментально]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

**Исходный код:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

Эта функция позволяет удобно распространять приложение Node.js в системе, в которой не установлен Node.js.

Node.js поддерживает создание [однофайловых исполняемых приложений](https://github.com/nodejs/single-executable), позволяя внедрять подготовленный Node.js blob, который может содержать связанный скрипт, в двоичный файл `node`. Во время запуска программа проверяет, было ли что-либо внедрено. Если blob найден, он выполняет скрипт в blob. В противном случае Node.js работает как обычно.

Функция однофайловых исполняемых приложений в настоящее время поддерживает только запуск одного встроенного скрипта с использованием системы модулей [CommonJS](/ru/nodejs/api/modules#modules-commonjs-modules).

Пользователи могут создать однофайловое исполняемое приложение из своего связанного скрипта с помощью самого двоичного файла `node` и любого инструмента, который может внедрять ресурсы в двоичный файл.

Вот шаги для создания однофайлового исполняемого приложения с использованием одного из таких инструментов, [postject](https://github.com/nodejs/postject):

## Создание blob-объектов для подготовки однофайловых исполняемых файлов {#generating-single-executable-preparation-blobs}

Blob-объекты для подготовки однофайловых исполняемых файлов, которые внедряются в приложение, можно создать с помощью флага `--experimental-sea-config` двоичного файла Node.js, который будет использоваться для сборки однофайлового исполняемого файла. Он принимает путь к файлу конфигурации в формате JSON. Если переданный путь не является абсолютным, Node.js будет использовать путь относительно текущего рабочего каталога.

В настоящее время конфигурация считывает следующие поля верхнего уровня:

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "disableExperimentalSEAWarning": true, // По умолчанию: false
  "useSnapshot": false,  // По умолчанию: false
  "useCodeCache": true, // По умолчанию: false
  "assets": {  // Необязательно
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```
Если пути не являются абсолютными, Node.js будет использовать путь относительно текущего рабочего каталога. Версия двоичного файла Node.js, используемая для создания blob-объекта, должна быть такой же, как и версия, в которую будет внедрен blob-объект.

Примечание: При создании кроссплатформенных SEA (например, создание SEA для `linux-x64` на `darwin-arm64`), `useCodeCache` и `useSnapshot` должны быть установлены в false, чтобы избежать создания несовместимых исполняемых файлов. Поскольку кэш кода и моментальные снимки могут быть загружены только на той же платформе, где они были скомпилированы, сгенерированный исполняемый файл может аварийно завершить работу при запуске при попытке загрузить кэш кода или моментальные снимки, созданные на другой платформе.


### Ресурсы (Assets) {#assets}

Пользователи могут включать ресурсы, добавляя словарь ключ-путь в конфигурацию как поле `assets`. Во время сборки Node.js будет считывать ресурсы из указанных путей и объединять их в preparation blob. В сгенерированном исполняемом файле пользователи могут получить доступ к ресурсам с помощью API [`sea.getAsset()`](/ru/nodejs/api/single-executable-applications#seagetassetkey-encoding) и [`sea.getAssetAsBlob()`](/ru/nodejs/api/single-executable-applications#seagetassetasblobkey-options).

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```
Приложение single-executable может получить доступ к ресурсам следующим образом:

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// Возвращает копию данных в ArrayBuffer.
const image = getAsset('a.jpg');
// Возвращает строку, декодированную из ресурса как UTF8.
const text = getAsset('b.txt', 'utf8');
// Возвращает Blob, содержащий ресурс.
const blob = getAssetAsBlob('a.jpg');
// Возвращает ArrayBuffer, содержащий необработанный ресурс без копирования.
const raw = getRawAsset('a.jpg');
```
Смотрите документацию по API [`sea.getAsset()`](/ru/nodejs/api/single-executable-applications#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](/ru/nodejs/api/single-executable-applications#seagetassetasblobkey-options) и [`sea.getRawAsset()`](/ru/nodejs/api/single-executable-applications#seagetrawassetkey) для получения дополнительной информации.

### Поддержка моментальных снимков запуска {#startup-snapshot-support}

Поле `useSnapshot` можно использовать для включения поддержки моментальных снимков запуска. В этом случае `main` скрипт не будет выполняться при запуске финального исполняемого файла. Вместо этого он будет запущен, когда preparation blob для single-executable приложения будет сгенерирован на машине сборки. Сгенерированный preparation blob затем будет включать моментальный снимок, захватывающий состояния, инициализированные `main` скриптом. Финальный исполняемый файл с внедренным preparation blob будет десериализовать моментальный снимок во время выполнения.

Когда `useSnapshot` имеет значение true, основной скрипт должен вызвать API [`v8.startupSnapshot.setDeserializeMainFunction()`](/ru/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data), чтобы настроить код, который необходимо запустить, когда финальный исполняемый файл будет запущен пользователями.

Типичный шаблон использования моментального снимка в single-executable приложении:

Общие ограничения для скриптов моментальных снимков запуска также применяются к основному скрипту, когда он используется для создания моментального снимка для single-executable приложения, и основной скрипт может использовать [`v8.startupSnapshot API`](/ru/nodejs/api/v8#startup-snapshot-api), чтобы адаптироваться к этим ограничениям. См. [документацию о поддержке моментальных снимков запуска в Node.js](/ru/nodejs/api/cli#--build-snapshot).


### Поддержка кэша кода V8 {#v8-code-cache-support}

Когда в конфигурации установлено значение `useCodeCache` в `true`, во время генерации блоба подготовки отдельного исполняемого файла Node.js скомпилирует основной скрипт (`main`) для создания кэша кода V8. Сгенерированный кэш кода будет частью блоба подготовки и будет внедрен в окончательный исполняемый файл. Когда запускается отдельное исполняемое приложение, вместо компиляции основного скрипта с нуля Node.js будет использовать кэш кода для ускорения компиляции, а затем выполнит скрипт, что улучшит производительность при запуске.

**Примечание:** `import()` не работает, когда `useCodeCache` имеет значение `true`.

## Во внедренном основном скрипте {#in-the-injected-main-script}

### API однофайлового приложения {#single-executable-application-api}

Встроенный модуль `node:sea` позволяет взаимодействовать с однофайловым приложением из JavaScript основного скрипта, встроенного в исполняемый файл.

#### `sea.isSea()` {#seaissea}

**Добавлено в: v21.7.0, v20.12.0**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, выполняется ли этот скрипт внутри однофайлового приложения.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**Добавлено в: v21.7.0, v20.12.0**

Этот метод можно использовать для получения ресурсов, сконфигурированных для связывания в однофайловое приложение во время сборки. При отсутствии соответствующего ресурса выдается ошибка.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ключ ресурса в словаре, указанном в поле `assets` в конфигурации однофайлового приложения.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если указано, ресурс будет декодирован как строка. Принимается любая кодировка, поддерживаемая `TextDecoder`. Если не указано, вместо этого будет возвращен `ArrayBuffer`, содержащий копию ресурса.
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Добавлено в: v21.7.0, v20.12.0**

Аналогично [`sea.getAsset()`](/ru/nodejs/api/single-executable-applications#seagetassetkey-encoding), но возвращает результат в виде [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). Ошибка возникает, если не удается найти соответствующий актив.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ключ для актива в словаре, указанном полем `assets` в конфигурации однофайлового исполняемого приложения.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательный mime-тип для blob.

- Возвращает: [\<Blob\>](/ru/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Добавлено в: v21.7.0, v20.12.0**

Этот метод можно использовать для получения активов, настроенных для объединения в однофайловое исполняемое приложение во время сборки. Ошибка возникает, если не удается найти соответствующий актив.

В отличие от `sea.getAsset()` или `sea.getAssetAsBlob()`, этот метод не возвращает копию. Вместо этого он возвращает необработанный актив, встроенный в исполняемый файл.

Пока пользователям следует избегать записи в возвращаемый array buffer. Если вставленная секция не помечена как доступная для записи или не выровнена должным образом, запись в возвращаемый array buffer, скорее всего, приведет к сбою.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ключ для актива в словаре, указанном полем `assets` в конфигурации однофайлового исполняемого приложения.
- Возвращает: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `require(id)` во внедренном основном скрипте не основан на файлах {#requireid-in-the-injected-main-script-is-not-file-based}

`require()` во внедренном основном скрипте не то же самое, что [`require()`](/ru/nodejs/api/modules#requireid), доступный для модулей, которые не внедрены. Он также не имеет никаких свойств, которые есть у не-внедренного [`require()`](/ru/nodejs/api/modules#requireid), за исключением [`require.main`](/ru/nodejs/api/modules#accessing-the-main-module). Он может использоваться только для загрузки встроенных модулей. Попытка загрузить модуль, который можно найти только в файловой системе, приведет к ошибке.

Вместо того, чтобы полагаться на `require()`, основанный на файлах, пользователи могут объединить свое приложение в автономный файл JavaScript для внедрения в исполняемый файл. Это также обеспечивает более детерминированный граф зависимостей.

Однако, если все еще требуется `require()`, основанный на файлах, этого также можно достичь:

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### `__filename` и `module.filename` во внедрённом главном скрипте {#__filename-and-modulefilename-in-the-injected-main-script}

Значения `__filename` и `module.filename` во внедрённом главном скрипте равны [`process.execPath`](/ru/nodejs/api/process#processexecpath).

### `__dirname` во внедрённом главном скрипте {#__dirname-in-the-injected-main-script}

Значение `__dirname` во внедрённом главном скрипте равно имени каталога [`process.execPath`](/ru/nodejs/api/process#processexecpath).

## Примечания {#notes}

### Процесс создания единого исполняемого приложения {#single-executable-application-creation-process}

Инструмент, предназначенный для создания единого исполняемого приложения Node.js, должен внедрить содержимое blob, подготовленное с помощью `--experimental-sea-config"`, в:

- ресурс с именем `NODE_SEA_BLOB`, если двоичный файл `node` является файлом [PE](https://en.wikipedia.org/wiki/Portable_Executable)
- секцию с именем `NODE_SEA_BLOB` в сегменте `NODE_SEA`, если двоичный файл `node` является файлом [Mach-O](https://en.wikipedia.org/wiki/Mach-O)
- заметку с именем `NODE_SEA_BLOB`, если двоичный файл `node` является файлом [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

Найдите в двоичном файле строку [предохранителя](https://www.electronjs.org/docs/latest/tutorial/fuses) `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` и переключите последний символ на `1`, чтобы указать, что ресурс был внедрён.

### Поддержка платформ {#platform-support}

Поддержка единого исполняемого файла регулярно тестируется в CI только на следующих платформах:

- Windows
- macOS
- Linux (все дистрибутивы, [поддерживаемые Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list), кроме Alpine и всех архитектур, [поддерживаемых Node.js](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list), кроме s390x)

Это связано с отсутствием лучших инструментов для создания единых исполняемых файлов, которые можно было бы использовать для тестирования этой функции на других платформах.

Предложения по другим инструментам/рабочим процессам внедрения ресурсов приветствуются. Пожалуйста, начните обсуждение по адресу [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions), чтобы помочь нам задокументировать их.

