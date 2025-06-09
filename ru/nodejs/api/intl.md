---
title: Документация Node.js - Интернационализация
description: Этот раздел документации Node.js охватывает модуль интернационализации (Intl), который предоставляет доступ к различным функциям интернационализации и локализации, включая сортировку, форматирование чисел, дат и времени и многое другое.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Интернационализация | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Этот раздел документации Node.js охватывает модуль интернационализации (Intl), который предоставляет доступ к различным функциям интернационализации и локализации, включая сортировку, форматирование чисел, дат и времени и многое другое.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Интернационализация | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Этот раздел документации Node.js охватывает модуль интернационализации (Intl), который предоставляет доступ к различным функциям интернационализации и локализации, включая сортировку, форматирование чисел, дат и времени и многое другое.
---


# Поддержка интернационализации {#internationalization-support}

Node.js имеет множество функций, которые упрощают написание интернационализированных программ. Некоторые из них:

- Функции, чувствительные к локали или поддерживающие Unicode, в [ECMAScript Language Specification](https://tc39.github.io/ecma262/):
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)


- Все функции, описанные в [ECMAScript Internationalization API Specification](https://tc39.github.io/ecma402/) (aka ECMA-402):
    - Объект [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
    - Методы, чувствительные к локали, такие как [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) и [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)


- Поддержка [интернационализированных доменных имен](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDN) в [WHATWG URL parser](/ru/nodejs/api/url#the-whatwg-url-api)
- [`require('node:buffer').transcode()`](/ru/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- Более точное редактирование строк в [REPL](/ru/nodejs/api/repl#repl)
- [`require('node:util').TextDecoder`](/ru/nodejs/api/util#class-utiltextdecoder)
- [`RegExp` Unicode Property Escapes](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

Node.js и базовый движок V8 используют [International Components for Unicode (ICU)](http://site.icu-project.org/) для реализации этих функций в нативном C/C++ коде. Полный набор данных ICU предоставляется Node.js по умолчанию. Однако из-за размера файла данных ICU предусмотрено несколько вариантов настройки набора данных ICU при сборке или запуске Node.js.


## Параметры сборки Node.js {#options-for-building-nodejs}

Для управления использованием ICU в Node.js во время компиляции доступны четыре параметра `configure`. Дополнительные сведения о том, как компилировать Node.js, задокументированы в [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md).

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (по умолчанию)

Обзор доступных функций Node.js и JavaScript для каждого параметра `configure`:

| Функция | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | отсутствует (функция ничего не делает) | полная | полная | полная |
| `String.prototype.to*Case()` | полная | полная | полная | полная |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | отсутствует (объект не существует) | частичная/полная (зависит от ОС) | частичная (только английский) | полная |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | частичная (без учета локали) | полная | полная | полная |
| `String.prototype.toLocale*Case()` | частичная (без учета локали) | полная | полная | полная |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | частичная (без учета локали) | частичная/полная (зависит от ОС) | частичная (только английский) | полная |
| `Date.prototype.toLocale*String()` | частичная (без учета локали) | частичная/полная (зависит от ОС) | частичная (только английский) | полная |
| [Legacy URL Parser](/ru/nodejs/api/url#legacy-url-api) | частичная (нет поддержки IDN) | полная | полная | полная |
| [WHATWG URL Parser](/ru/nodejs/api/url#the-whatwg-url-api) | частичная (нет поддержки IDN) | полная | полная | полная |
| [`require('node:buffer').transcode()`](/ru/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | отсутствует (функция не существует) | полная | полная | полная |
| [REPL](/ru/nodejs/api/repl#repl) | частичная (неточное редактирование строк) | полная | полная | полная |
| [`require('node:util').TextDecoder`](/ru/nodejs/api/util#class-utiltextdecoder) | частичная (поддержка базовых кодировок) | частичная/полная (зависит от ОС) | частичная (только Unicode) | полная |
| [`RegExp` Unicode Property Escapes](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | отсутствует (недопустимая ошибка `RegExp`) | полная | полная | полная |
Обозначение "(без учета локали)" означает, что функция выполняет свою операцию так же, как и версия функции без `Locale`, если таковая существует. Например, в режиме `none` операция `Date.prototype.toLocaleString()` идентична операции `Date.prototype.toString()`.


### Отключение всех функций интернационализации (`none`) {#disable-all-internationalization-features-none}

Если выбран этот параметр, ICU отключается, и большинство функций интернационализации, упомянутых выше, будут **недоступны** в результирующем бинарном файле `node`.

### Сборка с предварительно установленной ICU (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

Node.js может быть связан с ICU, уже установленной в системе. Фактически, большинство дистрибутивов Linux уже поставляются с установленной ICU, и этот параметр позволит повторно использовать тот же набор данных, который используется другими компонентами ОС.

Функциональные возможности, требующие только саму библиотеку ICU, такие как [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) и [WHATWG URL parser](/ru/nodejs/api/url#the-whatwg-url-api), полностью поддерживаются в режиме `system-icu`. Функции, требующие дополнительно данные локали ICU, такие как [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), *могут* поддерживаться полностью или частично, в зависимости от полноты данных ICU, установленных в системе.

### Встраивание ограниченного набора данных ICU (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

Этот параметр позволяет результирующему бинарному файлу статически связываться с библиотекой ICU и включает подмножество данных ICU (обычно только английскую локаль) в исполняемый файл `node`.

Функциональные возможности, требующие только саму библиотеку ICU, такие как [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) и [WHATWG URL parser](/ru/nodejs/api/url#the-whatwg-url-api), полностью поддерживаются в режиме `small-icu`. Функции, требующие дополнительно данные локали ICU, такие как [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), обычно работают только с английской локалью:

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// Prints either "M01" or "January" on small-icu, depending on the user’s default locale
// Should print "enero"
```
Этот режим обеспечивает баланс между функциями и размером бинарного файла.


#### Предоставление данных ICU во время выполнения {#providing-icu-data-at-runtime}

Если используется опция `small-icu`, то можно предоставить дополнительные данные локали во время выполнения, чтобы методы JS работали для всех локалей ICU. Предположим, что файл данных хранится в `/runtime/directory/with/dat/file`, он может быть предоставлен ICU через:

- Опцию конфигурации `--with-icu-default-data-dir`: Она только встраивает путь к каталогу данных по умолчанию в бинарный файл. Фактический файл данных будет загружаться во время выполнения из этого каталога.
- Переменную окружения [`NODE_ICU_DATA`](/ru/nodejs/api/cli#node_icu_datafile):
- Параметр CLI [`--icu-data-dir`](/ru/nodejs/api/cli#--icu-data-dirfile):

Когда указано более одного из них, параметр CLI `--icu-data-dir` имеет наивысший приоритет, затем переменная окружения `NODE_ICU_DATA`, затем опция конфигурации `--with-icu-default-data-dir`.

ICU может автоматически находить и загружать различные форматы данных, но данные должны соответствовать версии ICU, а файл должен быть правильно назван. Наиболее распространенное имя для файла данных - `icudtX[bl].dat`, где `X` обозначает предполагаемую версию ICU, а `b` или `l` указывает на порядок байтов системы. Node.js не сможет загрузиться, если ожидаемый файл данных не может быть прочитан из указанного каталога. Имя файла данных, соответствующего текущей версии Node.js, можно вычислить с помощью:

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```
Ознакомьтесь со статьей ["ICU Data"](http://userguide.icu-project.org/icudata) в руководстве пользователя ICU для получения информации о других поддерживаемых форматах и более подробной информации о данных ICU в целом.

NPM-модуль [full-icu](https://www.npmjs.com/package/full-icu) может значительно упростить установку данных ICU, определяя версию ICU выполняемого `node` и загружая соответствующий файл данных. После установки модуля через `npm i full-icu`, файл данных будет доступен в `./node_modules/full-icu`. Этот путь можно затем передать либо в `NODE_ICU_DATA`, либо в `--icu-data-dir`, как показано выше, чтобы включить полную поддержку `Intl`.


### Встраивание полной версии ICU (`full-icu`) {#embed-the-entire-icu-full-icu}

Этот параметр заставляет результирующий бинарный файл статически линковаться с ICU и включать полный набор данных ICU. Двоичный файл, созданный таким образом, не имеет никаких дополнительных внешних зависимостей и поддерживает все локали, но может быть довольно большим. Это поведение по умолчанию, если не передан флаг `--with-intl`. Официальные бинарные файлы также создаются в этом режиме.

## Обнаружение поддержки интернационализации {#detecting-internationalization-support}

Чтобы проверить, включен ли ICU вообще (`system-icu`, `small-icu` или `full-icu`), достаточно просто проверить существование `Intl`:

```js [ESM]
const hasICU = typeof Intl === 'object';
```
В качестве альтернативы можно проверить наличие `process.versions.icu`, свойства, определенного только тогда, когда ICU включен:

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
Чтобы проверить поддержку локали, отличной от английской (т. е. `full-icu` или `system-icu`), [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) может быть хорошим определяющим фактором:

```js [ESM]
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```
Для более подробных тестов поддержки `Intl` могут оказаться полезными следующие ресурсы:

- [btest402](https://github.com/srl295/btest402): Обычно используется для проверки правильности сборки Node.js с поддержкой `Intl`.
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): Официальный набор тестов на соответствие ECMAScript включает раздел, посвященный ECMA-402.

