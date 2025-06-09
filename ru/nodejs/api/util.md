---
title: Документация Node.js - Утилиты
description: Документация Node.js для модуля 'util', который предоставляет утилитарные функции для приложений Node.js, включая отладку, инспекцию объектов и многое другое.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Утилиты | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Документация Node.js для модуля 'util', который предоставляет утилитарные функции для приложений Node.js, включая отладку, инспекцию объектов и многое другое.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Утилиты | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Документация Node.js для модуля 'util', который предоставляет утилитарные функции для приложений Node.js, включая отладку, инспекцию объектов и многое другое.
---


# Util {#util}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/util.js](https://github.com/nodejs/node/blob/v23.5.0/lib/util.js)

Модуль `node:util` поддерживает потребности внутренних API Node.js. Многие из утилит также полезны для разработчиков приложений и модулей. Чтобы получить к нему доступ:

```js [ESM]
const util = require('node:util');
```
## `util.callbackify(original)` {#utilcallbackifyoriginal}

**Добавлено в: v8.2.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `async` функция
- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) функцию в стиле callback

Принимает `async` функцию (или функцию, возвращающую `Promise`) и возвращает функцию в стиле callback с обработкой ошибок, то есть принимающую callback `(err, value) =\> ...` в качестве последнего аргумента. В callback первым аргументом будет причина отклонения (или `null`, если `Promise` разрешен), а вторым аргументом будет разрешенное значение.

```js [ESM]
const util = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
Выведет:

```text [TEXT]
hello world
```
Callback выполняется асинхронно и будет иметь ограниченную трассировку стека. Если callback выбрасывает исключение, процесс сгенерирует событие [`'uncaughtException'`](/ru/nodejs/api/process#event-uncaughtexception), и, если оно не будет обработано, завершится.

Поскольку `null` имеет особое значение в качестве первого аргумента для callback, если обернутая функция отклоняет `Promise` с ложным значением в качестве причины, значение оборачивается в `Error` с исходным значением, хранящимся в поле с именем `reason`.

```js [ESM]
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // Когда Promise был отклонен с `null`, он оборачивается в Error, и
  // исходное значение сохраняется в `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.debuglog(section[, callback])` {#utildebuglogsection-callback}

**Добавлено в версии: v0.11.3**

- `section` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка, идентифицирующая часть приложения, для которой создаётся функция `debuglog`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Callback-функция, вызываемая при первом вызове функции логирования с аргументом-функцией, представляющим собой более оптимизированную функцию логирования.
- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция логирования

Метод `util.debuglog()` используется для создания функции, которая условно записывает отладочные сообщения в `stderr` в зависимости от существования переменной окружения `NODE_DEBUG`. Если имя `section` встречается в значении этой переменной окружения, то возвращаемая функция работает аналогично [`console.error()`](/ru/nodejs/api/console#consoleerrordata-args). В противном случае возвращаемая функция ничего не делает.

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo');

debuglog('hello from foo [%d]', 123);
```
Если эта программа запущена с `NODE_DEBUG=foo` в окружении, то она выведет что-то вроде:

```bash [BASH]
FOO 3245: hello from foo [123]
```
где `3245` — это идентификатор процесса. Если она не запущена с установленной переменной окружения, то она ничего не выведет.

`section` также поддерживает подстановочные знаки:

```js [ESM]
const util = require('node:util');
const debuglog = util.debuglog('foo-bar');

debuglog('hi there, it\'s foo-bar [%d]', 2333);
```
если она запущена с `NODE_DEBUG=foo*` в окружении, то она выведет что-то вроде:

```bash [BASH]
FOO-BAR 3257: hi there, it's foo-bar [2333]
```
В переменной окружения `NODE_DEBUG` можно указать несколько разделённых запятыми имен `section`: `NODE_DEBUG=fs,net,tls`.

Необязательный аргумент `callback` можно использовать для замены функции логирования другой функцией, которая не имеет никакой инициализации или ненужной обёртки.

```js [ESM]
const util = require('node:util');
let debuglog = util.debuglog('internals', (debug) => {
  // Replace with a logging function that optimizes out
  // testing if the section is enabled
  debuglog = debug;
});
```

### `debuglog().enabled` {#debuglogenabled}

**Добавлено в версии: v14.9.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Геттер `util.debuglog().enabled` используется для создания теста, который можно использовать в условных выражениях на основе существования переменной окружения `NODE_DEBUG`. Если имя `section` появляется в значении этой переменной окружения, то возвращаемое значение будет `true`. В противном случае возвращаемое значение будет `false`.

```js [ESM]
const util = require('node:util');
const enabled = util.debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```
Если эта программа запускается с `NODE_DEBUG=foo` в окружении, то она выведет что-то вроде:

```bash [BASH]
hello from foo [123]
```
## `util.debug(section)` {#utildebugsection}

**Добавлено в версии: v14.9.0**

Псевдоним для `util.debuglog`. Использование позволяет обеспечить читаемость, которая не подразумевает ведение журнала, когда используется только `util.debuglog().enabled`.

## `util.deprecate(fn, msg[, code])` {#utildeprecatefn-msg-code}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Предупреждения об устаревании выводятся только один раз для каждого кода. |
| v0.8.0 | Добавлено в версии: v0.8.0 |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которая устарела.
- `msg` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Предупреждающее сообщение, которое будет отображаться при вызове устаревшей функции.
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Код устаревания. См. [список устаревших API](/ru/nodejs/api/deprecations#list-of-deprecated-apis) для получения списка кодов.
- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Устаревшая функция, обернутая для выдачи предупреждения.

Метод `util.deprecate()` оборачивает `fn` (который может быть функцией или классом) таким образом, что он помечается как устаревший.

```js [ESM]
const util = require('node:util');

exports.obsoleteFunction = util.deprecate(() => {
  // Do something here.
}, 'obsoleteFunction() is deprecated. Use newShinyFunction() instead.');
```
При вызове `util.deprecate()` вернет функцию, которая будет генерировать `DeprecationWarning` с использованием события [`'warning'`](/ru/nodejs/api/process#event-warning). Предупреждение будет выдано и напечатано в `stderr` при первом вызове возвращенной функции. После выдачи предупреждения обернутая функция вызывается без выдачи предупреждения.

Если один и тот же необязательный `code` указан в нескольких вызовах `util.deprecate()`, предупреждение будет выдано только один раз для этого `code`.

```js [ESM]
const util = require('node:util');

const fn1 = util.deprecate(someFunction, someMessage, 'DEP0001');
const fn2 = util.deprecate(someOtherFunction, someOtherMessage, 'DEP0001');
fn1(); // Выводит предупреждение об устаревании с кодом DEP0001
fn2(); // Не выводит предупреждение об устаревании, потому что у него тот же код
```
Если используются флаги командной строки `--no-deprecation` или `--no-warnings`, или если свойство `process.noDeprecation` установлено в `true` *до* первого предупреждения об устаревании, метод `util.deprecate()` ничего не делает.

Если установлены флаги командной строки `--trace-deprecation` или `--trace-warnings`, или свойство `process.traceDeprecation` установлено в `true`, предупреждение и трассировка стека печатаются в `stderr` при первом вызове устаревшей функции.

Если установлен флаг командной строки `--throw-deprecation` или свойство `process.throwDeprecation` установлено в `true`, то при вызове устаревшей функции будет сгенерировано исключение.

Флаг командной строки `--throw-deprecation` и свойство `process.throwDeprecation` имеют приоритет над `--trace-deprecation` и `process.traceDeprecation`.


## `util.format(format[, ...args])` {#utilformatformat-args}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.11.0 | Спецификатор `%c` теперь игнорируется. |
| v12.0.0 | Аргумент `format` теперь принимается как таковой, только если он действительно содержит спецификаторы формата. |
| v12.0.0 | Если аргумент `format` не является строкой формата, форматирование выходной строки больше не зависит от типа первого аргумента. Это изменение удаляет ранее присутствовавшие кавычки из строк, которые выводились, когда первый аргумент не был строкой. |
| v11.4.0 | Спецификаторы `%d`, `%f` и `%i` теперь корректно поддерживают Symbols. |
| v11.4.0 | `depth` спецификатора `%o` снова имеет глубину по умолчанию 4. |
| v11.0.0 | Опция `depth` спецификатора `%o` теперь будет возвращаться к глубине по умолчанию. |
| v10.12.0 | Спецификаторы `%d` и `%i` теперь поддерживают BigInt. |
| v8.4.0 | Теперь поддерживаются спецификаторы `%o` и `%O`. |
| v0.5.3 | Добавлено в: v0.5.3 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка формата, подобная `printf`.

Метод `util.format()` возвращает отформатированную строку, используя первый аргумент в качестве строки формата, подобной `printf`, которая может содержать ноль или более спецификаторов формата. Каждый спецификатор заменяется преобразованным значением из соответствующего аргумента. Поддерживаемые спецификаторы:

- `%s`: `String` будет использоваться для преобразования всех значений, кроме `BigInt`, `Object` и `-0`. Значения `BigInt` будут представлены с помощью `n`, а объекты, у которых нет пользовательской функции `toString`, будут проверяться с помощью `util.inspect()` с параметрами `{ depth: 0, colors: false, compact: 3 }`.
- `%d`: `Number` будет использоваться для преобразования всех значений, кроме `BigInt` и `Symbol`.
- `%i`: `parseInt(value, 10)` используется для всех значений, кроме `BigInt` и `Symbol`.
- `%f`: `parseFloat(value)` используется для всех значений, кроме `Symbol`.
- `%j`: JSON. Заменяется строкой `'[Circular]'`, если аргумент содержит циклические ссылки.
- `%o`: `Object`. Строковое представление объекта с использованием общего формата объекта JavaScript. Аналогично `util.inspect()` с параметрами `{ showHidden: true, showProxy: true }`. Это покажет полный объект, включая неперечисляемые свойства и прокси.
- `%O`: `Object`. Строковое представление объекта с использованием общего формата объекта JavaScript. Аналогично `util.inspect()` без параметров. Это покажет полный объект, не включая неперечисляемые свойства и прокси.
- `%c`: `CSS`. Этот спецификатор игнорируется и пропустит любой переданный CSS.
- `%%`: одиночный знак процента (`'%'`). Этот спецификатор не потребляет аргумент.
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Отформатированная строка

Если у спецификатора нет соответствующего аргумента, он не заменяется:

```js [ESM]
util.format('%s:%s', 'foo');
// Возвращает: 'foo:%s'
```
Значения, которые не являются частью строки формата, форматируются с использованием `util.inspect()`, если их тип не является `string`.

Если методу `util.format()` передано больше аргументов, чем количество спецификаторов, дополнительные аргументы объединяются в возвращаемую строку, разделенные пробелами:

```js [ESM]
util.format('%s:%s', 'foo', 'bar', 'baz');
// Возвращает: 'foo:bar baz'
```
Если первый аргумент не содержит допустимый спецификатор формата, `util.format()` возвращает строку, которая является объединением всех аргументов, разделенных пробелами:

```js [ESM]
util.format(1, 2, 3);
// Возвращает: '1 2 3'
```
Если методу `util.format()` передан только один аргумент, он возвращается как есть без какого-либо форматирования:

```js [ESM]
util.format('%% %s');
// Возвращает: '%% %s'
```
`util.format()` — это синхронный метод, предназначенный для использования в качестве инструмента отладки. Некоторые входные значения могут иметь значительные накладные расходы на производительность, которые могут заблокировать цикл событий. Используйте эту функцию с осторожностью и никогда на критических участках кода.


## `util.formatWithOptions(inspectOptions, format[, ...args])` {#utilformatwithoptionsinspectoptions-format-args}

**Добавлено в версии: v10.0.0**

- `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Эта функция идентична [`util.format()`](/ru/nodejs/api/util#utilformatformat-args), за исключением того, что она принимает аргумент `inspectOptions`, который указывает параметры, передаваемые в [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options).

```js [ESM]
util.formatWithOptions({ colors: true }, 'See object %O', { foo: 42 });
// Возвращает 'See object { foo: 42 }', где `42` окрашено как число
// при выводе в терминал.
```
## `util.getCallSites(frameCountOrOptions, [options])` {#utilgetcallsitesframecountoroptions-options}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.3.0 | API переименовано из `util.getCallSite` в `util.getCallSites()`. |
| v22.9.0 | Добавлено в версии: v22.9.0 |
:::

- `frameCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Необязательное количество кадров для захвата в качестве объектов места вызова. **По умолчанию:** `10`. Допустимый диапазон - от 1 до 200.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Необязательный 
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Восстанавливает исходное местоположение в трассировке стека из source-map. Включено по умолчанию с флагом `--enable-source-maps`.
  
 
- Возвращает: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Массив объектов места вызова 
    - `functionName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Возвращает имя функции, связанной с этим местом вызова.
    - `scriptName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Возвращает имя ресурса, содержащего скрипт для функции для этого места вызова.
    - `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Возвращает номер строки (начиная с 1) для связанного вызова функции.
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Возвращает смещение столбца (начиная с 1) в строке для связанного вызова функции.
  
 

Возвращает массив объектов места вызова, содержащий стек вызывающей функции.

```js [ESM]
const util = require('node:util');

function exampleFunction() {
  const callSites = util.getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.column}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// Функция для имитации другого уровня стека
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```
Можно восстановить исходные местоположения, установив для параметра `sourceMap` значение `true`. Если карта исходного кода недоступна, исходное местоположение будет таким же, как и текущее. Когда флаг `--enable-source-maps` включен, например, при использовании `--experimental-transform-types`, для `sourceMap` по умолчанию будет установлено значение true.

```ts [TYPESCRIPT]
import util from 'node:util';

interface Foo {
  foo: string;
}

const callSites = util.getCallSites({ sourceMap: true });

// С sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Без sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26
```

## `util.getSystemErrorName(err)` {#utilgetsystemerrornameerr}

**Добавлено в версии: v9.7.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает строковое имя для числового кода ошибки, полученного из Node.js API. Соответствие между кодами ошибок и именами ошибок зависит от платформы. См. [Общие системные ошибки](/ru/nodejs/api/errors#common-system-errors) для имен распространенных ошибок.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMap()` {#utilgetsystemerrormap}

**Добавлено в версии: v16.0.0, v14.17.0**

- Возвращает: [\<Map\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

Возвращает Map всех кодов системных ошибок, доступных из Node.js API. Соответствие между кодами ошибок и именами ошибок зависит от платформы. См. [Общие системные ошибки](/ru/nodejs/api/errors#common-system-errors) для имен распространенных ошибок.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```
## `util.getSystemErrorMessage(err)` {#utilgetsystemerrormessageerr}

**Добавлено в версии: v23.1.0**

- `err` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает строковое сообщение для числового кода ошибки, полученного из Node.js API. Соответствие между кодами ошибок и строковыми сообщениями зависит от платформы.

```js [ESM]
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorMessage(err.errno);
  console.error(name);  // No such file or directory
});
```
## `util.inherits(constructor, superConstructor)` {#utilinheritsconstructor-superconstructor}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v5.0.0 | Параметр `constructor` теперь может ссылаться на класс ES6. |
| v0.3.0 | Добавлено в версии: v0.3.0 |
:::

::: info [Стабильность: 3 - Устаревшее]
[Стабильность: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее: Вместо этого используйте синтаксис классов ES2015 и ключевое слово `extends`.
:::

- `constructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `superConstructor` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Использование `util.inherits()` не рекомендуется. Пожалуйста, используйте ключевые слова `class` и `extends` ES6 для получения поддержки наследования на уровне языка. Также обратите внимание, что эти два стиля [семантически несовместимы](https://github.com/nodejs/node/issues/4179).

Наследует методы прототипа из одного [конструктора](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor) в другой. Прототип `constructor` будет установлен в новый объект, созданный из `superConstructor`.

В основном это добавляет некоторую проверку входных данных поверх `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)`. В качестве дополнительного удобства, `superConstructor` будет доступен через свойство `constructor.super_`.

```js [ESM]
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```
Пример ES6 с использованием `class` и `extends`:

```js [ESM]
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])` {#utilinspectobject-options}

## `util.inspect(object[, showHidden[, depth[, colors]]])` {#utilinspectobject-showhidden-depth-colors}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.18.0 | Добавлена поддержка `maxArrayLength` при проверке `Set` и `Map`. |
| v17.3.0, v16.14.0 | Теперь поддерживается опция `numericSeparator`. |
| v13.0.0 | Циклические ссылки теперь включают маркер для ссылки. |
| v14.6.0, v12.19.0 | Если `object` получен из другого `vm.Context`, пользовательская функция проверки на нём больше не будет получать специфические для контекста аргументы. |
| v13.13.0, v12.17.0 | Теперь поддерживается опция `maxStringLength`. |
| v13.5.0, v12.16.0 | Определённые пользователем свойства прототипа проверяются, если `showHidden` имеет значение `true`. |
| v12.0.0 | Значение по умолчанию для параметра `compact` изменено на `3`, а значение по умолчанию для параметра `breakLength` изменено на `80`. |
| v12.0.0 | Внутренние свойства больше не отображаются в аргументе контекста пользовательской функции проверки. |
| v11.11.0 | Параметр `compact` принимает числа для нового режима вывода. |
| v11.7.0 | ArrayBuffers теперь также отображают своё двоичное содержимое. |
| v11.5.0 | Теперь поддерживается опция `getters`. |
| v11.4.0 | Значение по умолчанию для `depth` снова изменено на `2`. |
| v11.0.0 | Значение по умолчанию для `depth` изменено на `20`. |
| v11.0.0 | Вывод инспекции теперь ограничен примерно 128 МиБ. Данные, превышающие этот размер, не будут полностью проверены. |
| v10.12.0 | Теперь поддерживается опция `sorted`. |
| v10.6.0 | Теперь можно проверять связанные списки и подобные объекты до максимального размера стека вызовов. |
| v10.0.0 | Теперь можно проверять записи `WeakMap` и `WeakSet`. |
| v9.9.0 | Теперь поддерживается опция `compact`. |
| v6.6.0 | Пользовательские функции проверки теперь могут возвращать `this`. |
| v6.3.0 | Теперь поддерживается опция `breakLength`. |
| v6.1.0 | Теперь поддерживается опция `maxArrayLength`; в частности, длинные массивы по умолчанию усекаются. |
| v6.1.0 | Теперь поддерживается опция `showProxy`. |
| v0.3.0 | Добавлено в: v0.3.0 |
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Любой JavaScript примитив или `Object`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, неперечисляемые символы и свойства `object` включаются в отформатированный результат. Записи [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) и [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) также включаются, а также определённые пользователем свойства прототипа (за исключением свойств методов). **По умолчанию:** `false`.
    - `depth` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает количество раз, которое нужно рекурсивно повторять при форматировании `object`. Это полезно для проверки больших объектов. Чтобы рекурсивно повторять до максимального размера стека вызовов, передайте `Infinity` или `null`. **По умолчанию:** `2`.
    - `colors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, вывод оформляется с помощью цветовых кодов ANSI. Цвета настраиваются. См. [Настройка цветов `util.inspect`](/ru/nodejs/api/util#customizing-utilinspect-colors). **По умолчанию:** `false`.
    - `customInspect` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `false`, функции `[util.inspect.custom](depth, opts, inspect)` не вызываются. **По умолчанию:** `true`.
    - `showProxy` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, проверка `Proxy` включает объекты [`target` и `handler`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#Terminology). **По умолчанию:** `false`.
    - `maxArrayLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает максимальное количество элементов `Array`, [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set), [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) и [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet), которые нужно включить при форматировании. Установите значение `null` или `Infinity`, чтобы отобразить все элементы. Установите значение `0` или отрицательное число, чтобы не отображать элементы. **По умолчанию:** `100`.
    - `maxStringLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает максимальное количество символов, которые нужно включить при форматировании. Установите значение `null` или `Infinity`, чтобы отобразить все элементы. Установите значение `0` или отрицательное число, чтобы не отображать символы. **По умолчанию:** `10000`.
    - `breakLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина, при которой входные значения разделяются на несколько строк. Установите значение `Infinity`, чтобы отформатировать входные данные в виде одной строки (в сочетании с параметром `compact`, установленным в `true` или любое число \>= `1`). **По умолчанию:** `80`.
    - `compact` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если установить для этого параметра значение `false`, каждый ключ объекта будет отображаться на новой строке. Он будет разрываться на новых строках в тексте, который длиннее, чем `breakLength`. Если установлено число, то самые `n` внутренних элементов объединяются в одну строку, если все свойства помещаются в `breakLength`. Короткие элементы массива также группируются вместе. Дополнительную информацию см. в примере ниже. **По умолчанию:** `3`.
    - `sorted` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Если установлено значение `true` или функция, все свойства объекта, а также записи `Set` и `Map` сортируются в результирующей строке. Если установлено значение `true`, используется [сортировка по умолчанию](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort). Если установлена функция, она используется в качестве [функции сравнения](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
    - `getters` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если установлено значение `true`, проверяются геттеры. Если установлено значение `'get'`, проверяются только геттеры без соответствующего сеттера. Если установлено значение `'set'`, проверяются только геттеры с соответствующим сеттером. Это может вызвать побочные эффекты в зависимости от функции геттера. **По умолчанию:** `false`.
    - `numericSeparator` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `true`, символ подчёркивания используется для разделения каждых трёх цифр во всех больших целых числах и числах. **По умолчанию:** `false`.
  
 
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Представление `object`.

Метод `util.inspect()` возвращает строковое представление `object`, предназначенное для отладки. Вывод `util.inspect` может измениться в любое время и не должен зависеть от программы. Можно передать дополнительные `options`, которые изменяют результат. `util.inspect()` будет использовать имя конструктора и/или `@@toStringTag`, чтобы создать идентифицируемый тег для проверяемого значения.

```js [ESM]
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```
Циклические ссылки указывают на свою привязку, используя индекс ссылки:

```js [ESM]
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```
Следующий пример проверяет все свойства объекта `util`:

```js [ESM]
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```
В следующем примере показан эффект параметра `compact`:

```js [ESM]
const util = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(util.inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // Длинная строка
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Установка для `compact` значения false или целого числа создаёт более удобный для чтения вывод.
console.log(util.inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Установка для `breakLength` значения, например, 150, выведет текст "Lorem ipsum" в одной строке.
```
Опция `showHidden` позволяет проверять записи [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) и [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet). Если записей больше, чем `maxArrayLength`, нет гарантии, какие записи будут отображаться. Это означает, что получение одних и тех же записей [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) дважды может привести к разным результатам. Кроме того, записи без оставшихся строгих ссылок могут быть собраны мусором в любое время.

```js [ESM]
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```
Опция `sorted` гарантирует, что порядок вставки свойств объекта не влияет на результат `util.inspect()`.

```js [ESM]
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```
Опция `numericSeparator` добавляет символ подчёркивания каждые три цифры ко всем числам.

```js [ESM]
const { inspect } = require('node:util');

const thousand = 1_000;
const million = 1_000_000;
const bigNumber = 123_456_789n;
const bigDecimal = 1_234.123_45;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```
`util.inspect()` — это синхронный метод, предназначенный для отладки. Его максимальная длина вывода составляет примерно 128 МиБ. Входные данные, которые приводят к более длинному выводу, будут усечены.


### Настройка цветов `util.inspect` {#customizing-utilinspect-colors}

Цветовой вывод (если он включен) `util.inspect` можно настроить глобально с помощью свойств `util.inspect.styles` и `util.inspect.colors`.

`util.inspect.styles` - это карта, связывающая имя стиля с цветом из `util.inspect.colors`.

Стили по умолчанию и соответствующие цвета:

- `bigint`: `yellow`
- `boolean`: `yellow`
- `date`: `magenta`
- `module`: `underline`
- `name`: (без стилизации)
- `null`: `bold`
- `number`: `yellow`
- `regexp`: `red`
- `special`: `cyan` (например, `Proxies`)
- `string`: `green`
- `symbol`: `green`
- `undefined`: `grey`

Для цветового оформления используются управляющие коды ANSI, которые могут не поддерживаться во всех терминалах. Чтобы проверить поддержку цвета, используйте [`tty.hasColors()`](/ru/nodejs/api/tty#writestreamhascolorscount-env).

Предопределенные управляющие коды перечислены ниже (сгруппированы как "Модификаторы", "Цвета переднего плана" и "Цвета фона").

#### Модификаторы {#modifiers}

Поддержка модификаторов варьируется в разных терминалах. В основном они будут игнорироваться, если не поддерживаются.

- `reset` - Сбрасывает все (цветовые) модификаторы к значениям по умолчанию.
- **bold** - Сделать текст жирным
- *italic* - Сделать текст курсивом
- underline - Сделать текст подчеркнутым
- ~~strikethrough~~ - Проводит горизонтальную линию через центр текста (Псевдоним: `strikeThrough`, `crossedout`, `crossedOut`)
- `hidden` - Печатает текст, но делает его невидимым (Псевдоним: conceal)
- dim - Уменьшенная интенсивность цвета (Псевдоним: `faint`)
- overlined - Сделать текст надчеркнутым
- blink - Скрывает и показывает текст через интервал
- inverse - Поменять местами цвета переднего плана и фона (Псевдоним: `swapcolors`, `swapColors`)
- doubleunderline - Сделать текст с двойным подчеркиванием (Псевдоним: `doubleUnderline`)
- framed - Нарисовать рамку вокруг текста

#### Цвета переднего плана {#foreground-colors}

- `black`
- `red`
- `green`
- `yellow`
- `blue`
- `magenta`
- `cyan`
- `white`
- `gray` (псевдоним: `grey`, `blackBright`)
- `redBright`
- `greenBright`
- `yellowBright`
- `blueBright`
- `magentaBright`
- `cyanBright`
- `whiteBright`

#### Цвета фона {#background-colors}

- `bgBlack`
- `bgRed`
- `bgGreen`
- `bgYellow`
- `bgBlue`
- `bgMagenta`
- `bgCyan`
- `bgWhite`
- `bgGray` (псевдоним: `bgGrey`, `bgBlackBright`)
- `bgRedBright`
- `bgGreenBright`
- `bgYellowBright`
- `bgBlueBright`
- `bgMagentaBright`
- `bgCyanBright`
- `bgWhiteBright`


### Пользовательские функции проверки объектов {#custom-inspection-functions-on-objects}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.3.0, v16.14.0 | Добавлен аргумент inspect для большей интероперабельности. |
| v0.1.97 | Добавлено в: v0.1.97 |
:::

Объекты также могут определять свою собственную функцию [`[util.inspect.custom](depth, opts, inspect)`](/ru/nodejs/api/util#utilinspectcustom), которую `util.inspect()` будет вызывать и использовать ее результат при проверке объекта.

```js [ESM]
const util = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [util.inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Отступ в пять пробелов, потому что это размер "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

util.inspect(box);
// Возвращает: "Box< true >"
```
Пользовательские функции `[util.inspect.custom](depth, opts, inspect)` обычно возвращают строку, но могут возвращать значение любого типа, которое будет соответствующим образом отформатировано с помощью `util.inspect()`.

```js [ESM]
const util = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[util.inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

util.inspect(obj);
// Возвращает: "{ bar: 'baz' }"
```
### `util.inspect.custom` {#utilinspectcustom}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.12.0 | Теперь это определено как общий символ. |
| v6.6.0 | Добавлено в: v6.6.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type), который можно использовать для объявления пользовательских функций проверки.

В дополнение к тому, что этот символ доступен через `util.inspect.custom`, он [зарегистрирован глобально](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) и может быть доступен в любой среде как `Symbol.for('nodejs.util.inspect.custom')`.

Использование этого позволяет писать код переносимым способом, чтобы пользовательская функция проверки использовалась в среде Node.js и игнорировалась в браузере. Сама функция `util.inspect()` передается в качестве третьего аргумента в пользовательскую функцию проверки для обеспечения дальнейшей переносимости.

```js [ESM]
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Выводит Password <xxxxxxxx>
```
См. [Пользовательские функции проверки объектов](/ru/nodejs/api/util#custom-inspection-functions-on-objects) для получения более подробной информации.


### `util.inspect.defaultOptions` {#utilinspectdefaultoptions}

**Добавлено в версии: v6.4.0**

Значение `defaultOptions` позволяет настраивать параметры по умолчанию, используемые `util.inspect`. Это полезно для таких функций, как `console.log` или `util.format`, которые неявно вызывают `util.inspect`. Оно должно быть установлено в объект, содержащий один или несколько допустимых параметров [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options). Непосредственная установка свойств параметра также поддерживается.

```js [ESM]
const util = require('node:util');
const arr = Array(101).fill(0);

console.log(arr); // Выводит усеченный массив
util.inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // Выводит полный массив
```
## `util.isDeepStrictEqual(val1, val2)` {#utilisdeepstrictequalval1-val2}

**Добавлено в версии: v9.0.0**

- `val1` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `val2` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если между `val1` и `val2` существует глубокое строгое равенство. В противном случае возвращает `false`.

Смотрите [`assert.deepStrictEqual()`](/ru/nodejs/api/assert#assertdeepstrictequalactual-expected-message) для получения дополнительной информации о глубоком строгом равенстве.

## Класс: `util.MIMEType` {#class-utilmimetype}

**Добавлено в версии: v19.1.0, v18.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

Реализация [класса MIMEType](https://bmeck.github.io/node-proposal-mime-api/).

В соответствии с браузерными соглашениями все свойства объектов `MIMEType` реализованы как геттеры и сеттеры в прототипе класса, а не как свойства данных в самом объекте.

Строка MIME - это структурированная строка, содержащая несколько значимых компонентов. При анализе возвращается объект `MIMEType`, содержащий свойства для каждого из этих компонентов.

### Конструктор: `new MIMEType(input)` {#constructor-new-mimetypeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Входной MIME для анализа

Создает новый объект `MIMEType`, анализируя `input`.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```
:::

Если `input` не является допустимым MIME, будет выдана ошибка `TypeError`. Обратите внимание, что будут предприняты усилия для приведения заданных значений к строкам. Например:



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Выводит: text/plain
```

```js [CJS]
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Выводит: text/plain
```
:::


### `mime.type` {#mimetype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и задает часть MIME, определяющую тип.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```
:::

### `mime.subtype` {#mimesubtype}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и задает часть MIME, определяющую подтип.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```
:::

### `mime.essence` {#mimeessence}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает сущность MIME. Это свойство доступно только для чтения. Используйте `mime.type` или `mime.subtype` для изменения MIME.

::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```
:::


### `mime.params` {#mimeparams}

- [\<MIMEParams\>](/ru/nodejs/api/util#class-utilmimeparams)

Получает объект [`MIMEParams`](/ru/nodejs/api/util#class-utilmimeparams), представляющий параметры MIME. Это свойство доступно только для чтения. Подробности см. в документации [`MIMEParams`](/ru/nodejs/api/util#class-utilmimeparams).

### `mime.toString()` {#mimetostring}

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `toString()` объекта `MIMEType` возвращает сериализованный MIME.

Из-за необходимости соответствия стандартам, этот метод не позволяет пользователям настраивать процесс сериализации MIME.

### `mime.toJSON()` {#mimetojson}

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Псевдоним для [`mime.toString()`](/ru/nodejs/api/util#mimetostring).

Этот метод автоматически вызывается, когда объект `MIMEType` сериализуется с помощью [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```js [CJS]
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```
:::

## Класс: `util.MIMEParams` {#class-utilmimeparams}

**Добавлено в: v19.1.0, v18.13.0**

API `MIMEParams` предоставляет доступ для чтения и записи к параметрам `MIMEType`.

### Конструктор: `new MIMEParams()` {#constructor-new-mimeparams}

Создает новый объект `MIMEParams` с пустыми параметрами



::: code-group
```js [ESM]
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```js [CJS]
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```
:::

### `mimeParams.delete(name)` {#mimeparamsdeletename}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Удаляет все пары имя-значение, где имя равно `name`.


### `mimeParams.entries()` {#mimeparamsentries}

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Возвращает итератор по каждой паре имя-значение в параметрах. Каждый элемент итератора является JavaScript `Array`. Первый элемент массива - это `name`, второй элемент массива - это `value`.

### `mimeParams.get(name)` {#mimeparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Строка или `null`, если нет пары имя-значение с данным `name`.

Возвращает значение первой пары имя-значение, чье имя равно `name`. Если таких пар нет, возвращается `null`.

### `mimeParams.has(name)` {#mimeparamshasname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если есть хотя бы одна пара имя-значение, чье имя равно `name`.

### `mimeParams.keys()` {#mimeparamskeys}

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Возвращает итератор по именам каждой пары имя-значение.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```
:::

### `mimeParams.set(name, value)` {#mimeparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Устанавливает значение в объекте `MIMEParams`, связанное с `name`, равным `value`. Если есть какие-либо существующие пары имя-значение, чьи имена равны `name`, устанавливает значение первой такой пары равным `value`.



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```
:::


### `mimeParams.values()` {#mimeparamsvalues}

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Возвращает итератор по значениям каждой пары имя-значение.

### `mimeParams[@@iterator]()` {#mimeparams@@iterator}

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Псевдоним для [`mimeParams.entries()`](/ru/nodejs/api/util#mimeparamsentries).



::: code-group
```js [ESM]
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Выводит:
//   foo bar
//   xyz baz
```

```js [CJS]
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Выводит:
//   foo bar
//   xyz baz
```
:::

## `util.parseArgs([config])` {#utilparseargsconfig}


::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Добавлена поддержка разрешения отрицательных опций в входном `config`. |
| v20.0.0 | API больше не является экспериментальным. |
| v18.11.0, v16.19.0 | Добавлена поддержка значений по умолчанию во входном `config`. |
| v18.7.0, v16.17.0 | Добавлена поддержка возврата подробной информации о разборе с использованием `tokens` во входном `config` и возвращенных свойствах. |
| v18.3.0, v16.17.0 | Добавлено в: v18.3.0, v16.17.0 |
:::

-  `config` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Используется для предоставления аргументов для разбора и для настройки парсера. `config` поддерживает следующие свойства:
    - `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) массив строк аргументов. **По умолчанию:** `process.argv` с удаленными `execPath` и `filename`.
    - `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Используется для описания аргументов, известных парсеру. Ключи `options` - это длинные имена опций, а значения - [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), принимающий следующие свойства:
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип аргумента, который должен быть `boolean` или `string`.
    - `multiple` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Может ли эта опция быть предоставлена несколько раз. Если `true`, все значения будут собраны в массив. Если `false`, значения для опции применяются по принципу "последний выигрывает". **По умолчанию:** `false`.
    - `short` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Односимвольный псевдоним для опции.
    - `default` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Значение опции по умолчанию, когда оно не задано аргументами. Оно должно быть того же типа, что и свойство `type`. Когда `multiple` имеет значение `true`, это должен быть массив.
  
 
    - `strict` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Должна ли возникать ошибка при обнаружении неизвестных аргументов или когда передаются аргументы, не соответствующие типу, настроенному в `options`. **По умолчанию:** `true`.
    - `allowPositionals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Принимает ли эта команда позиционные аргументы. **По умолчанию:** `false`, если `strict` имеет значение `true`, иначе `true`.
    - `allowNegative` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, позволяет явно устанавливать для логических опций значение `false`, предваряя имя опции префиксом `--no-`. **По умолчанию:** `false`.
    - `tokens` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Возвращать разобранные токены. Это полезно для расширения встроенного поведения, от добавления дополнительных проверок до повторной обработки токенов различными способами. **По умолчанию:** `false`.
  
 
-  Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Разобранные аргументы командной строки:
    - `values` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Отображение разобранных имен опций с их значениями [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) или [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).
    - `positionals` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Позиционные аргументы.
    - `tokens` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) См. раздел [parseArgs tokens](/ru/nodejs/api/util#parseargs-tokens). Возвращается только в том случае, если `config` включает `tokens: true`.
  
 

Предоставляет API более высокого уровня для разбора аргументов командной строки, чем непосредственное взаимодействие с `process.argv`. Принимает спецификацию для ожидаемых аргументов и возвращает структурированный объект с разобранными опциями и позиционными аргументами.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Выводит: [Object: null prototype] { foo: true, bar: 'b' } []
```

```js [CJS]
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Выводит: [Object: null prototype] { foo: true, bar: 'b' } []
```
:::

### `parseArgs` `tokens` {#parseargs-tokens}

Подробная информация о разборе доступна для добавления пользовательских поведений, указав `tokens: true` в конфигурации. Возвращаемые токены имеют свойства, описывающие:

- все токены
    - `kind` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Одно из значений: 'option', 'positional' или 'option-terminator'.
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Индекс элемента в `args`, содержащего токен. Таким образом, исходный аргумент для токена - `args[token.index]`.


- токены опций
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Длинное имя опции.
    - `rawName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Как опция используется в args, например `-f` или `--foo`.
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Значение опции, указанное в args. Undefined для boolean опций.
    - `inlineValue` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Указано ли значение опции inline, например `--foo=bar`.


- токены позиционных аргументов
    - `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение позиционного аргумента в args (т.е. `args[index]`).


- токен завершения опций

Возвращаемые токены находятся в порядке их обнаружения во входных args. Опции, которые встречаются в args более одного раза, создают токен для каждого использования. Группы коротких опций, такие как `-xy`, расширяются до токена для каждой опции. Таким образом, `-xxx` создаст три токена.

Например, чтобы добавить поддержку отрицательной опции, такой как `--no-color` (которую `allowNegative` поддерживает, когда опция имеет тип `boolean`), возвращаемые токены можно переработать, чтобы изменить значение, хранящееся для отрицательной опции.



::: code-group
```js [ESM]
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```js [CJS]
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```
:::

Пример использования, показывающий отрицательные опции, и когда опция используется несколькими способами, то побеждает последний.

```bash [BASH]
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)` {#utilparseenvcontent}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

**Добавлено в: v21.7.0, v20.12.0**

- `content` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Необработанное содержимое файла `.env`.

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Пример файла `.env`:

::: code-group
```js [CJS]
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Возвращает: { HELLO: 'oh my' }
```

```js [ESM]
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Возвращает: { HELLO: 'oh my' }
```
:::

## `util.promisify(original)` {#utilpromisifyoriginal}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.8.0 | Вызов `promisify` для функции, которая возвращает `Promise`, устарел. |
| v8.0.0 | Добавлено в: v8.0.0 |
:::

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Принимает функцию, следующую общему стилю обратного вызова с первым аргументом ошибки, т.е. принимающую обратный вызов `(err, value) => ...` в качестве последнего аргумента, и возвращает версию, которая возвращает промисы.

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // Сделайте что-нибудь с `stats`
}).catch((error) => {
  // Обработайте ошибку.
});
```
Или, что эквивалентно, используя `async function`:

```js [ESM]
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`Эта директория принадлежит ${stats.uid}`);
}

callStat();
```
Если присутствует свойство `original[util.promisify.custom]`, `promisify` вернет его значение, см. [Пользовательские функции, преобразованные в промисы](/ru/nodejs/api/util#custom-promisified-functions).

`promisify()` предполагает, что `original` является функцией, принимающей обратный вызов в качестве своего последнего аргумента во всех случаях. Если `original` не является функцией, `promisify()` вызовет ошибку. Если `original` является функцией, но ее последний аргумент не является обратным вызовом с первым аргументом ошибки, ему все равно будет передан обратный вызов с первым аргументом ошибки в качестве последнего аргумента.

Использование `promisify()` для методов класса или других методов, использующих `this`, может работать не так, как ожидалось, если не обработано специально:

```js [ESM]
const util = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: Cannot read property 'a' of undefined
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### Пользовательские функции, преобразованные в промисы {#custom-promisified-functions}

С помощью символа `util.promisify.custom` можно переопределить возвращаемое значение [`util.promisify()`](/ru/nodejs/api/util#utilpromisifyoriginal):

```js [ESM]
const util = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// печатает 'true'
```
Это может быть полезно в тех случаях, когда исходная функция не соответствует стандартному формату приема обратного вызова с ошибкой в качестве последнего аргумента.

Например, с функцией, которая принимает `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```
Если `promisify.custom` определен, но не является функцией, `promisify()` выдаст ошибку.

### `util.promisify.custom` {#utilpromisifycustom}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.12.0, v12.16.2 | Теперь это определено как общий символ. |
| v8.0.0 | Добавлено в: v8.0.0 |
:::

- [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type), который можно использовать для объявления пользовательских вариантов функций, преобразованных в промисы, см. [Пользовательские функции, преобразованные в промисы](/ru/nodejs/api/util#custom-promisified-functions).

В дополнение к доступности через `util.promisify.custom`, этот символ [зарегистрирован глобально](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) и может быть доступен в любой среде как `Symbol.for('nodejs.util.promisify.custom')`.

Например, с функцией, которая принимает `(foo, onSuccessCallback, onErrorCallback)`:

```js [ESM]
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)` {#utilstripvtcontrolcharactersstr}

**Добавлено в версии: v16.11.0**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает `str` с удаленными ANSI escape-кодами.

```js [ESM]
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// Выводит "value"
```
## `util.styleText(format, text[, options])` {#utilstyletextformat-text-options}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно.
:::


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | styleText теперь стабильна. |
| v22.8.0, v20.18.0 | Учитываются isTTY и переменные окружения, такие как NO_COLORS, NODE_DISABLE_COLORS и FORCE_COLOR. |
| v21.7.0, v20.12.0 | Добавлено в версии: v21.7.0, v20.12.0 |
:::

- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Формат текста или массив форматов текста, определенных в `util.inspect.colors`.
- `text` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Текст для форматирования.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `validateStream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если true, то `stream` проверяется на поддержку цветов. **По умолчанию:** `true`.
    - `stream` [\<Stream\>](/ru/nodejs/api/stream#stream) Поток, который будет проверен на поддержку цветов. **По умолчанию:** `process.stdout`.
  
 

Эта функция возвращает отформатированный текст с учетом переданного `format` для печати в терминале. Она учитывает возможности терминала и действует в соответствии с конфигурацией, установленной через переменные окружения `NO_COLORS`, `NODE_DISABLE_COLORS` и `FORCE_COLOR`.



::: code-group
```js [ESM]
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validate if process.stderr has TTY
  { stream: stderr },
);
console.error(successMessage);
```

```js [CJS]
const { styleText } = require('node:util');
const { stderr } = require('node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validate if process.stderr has TTY
  { stream: stderr },
);
console.error(successMessage);
```
:::

`util.inspect.colors` также предоставляет форматы текста, такие как `italic` и `underline`, и вы можете комбинировать их:

```js [CJS]
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```
При передаче массива форматов порядок применения формата слева направо, поэтому следующий стиль может перезаписать предыдущий.

```js [CJS]
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```
Полный список форматов можно найти в [модификаторах](/ru/nodejs/api/util#modifiers).


## Класс: `util.TextDecoder` {#class-utiltextdecoder}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.0.0 | Класс теперь доступен в глобальном объекте. |
| v8.3.0 | Добавлено в: v8.3.0 |
:::

Реализация API `TextDecoder` [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/).

```js [ESM]
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```
### Кодировки, поддерживаемые WHATWG {#whatwg-supported-encodings}

Согласно [WHATWG Encoding Standard](https://encoding.spec.whatwg.org/), кодировки, поддерживаемые API `TextDecoder`, перечислены в таблицах ниже. Для каждой кодировки может использоваться один или несколько псевдонимов.

Разные конфигурации сборки Node.js поддерживают разные наборы кодировок. (см. [Интернационализация](/ru/nodejs/api/intl))

#### Кодировки, поддерживаемые по умолчанию (с полными данными ICU) {#encodings-supported-by-default-with-full-icu-data}

| Кодировка | Псевдонимы |
| --- | --- |
| `'ibm866'` | `'866'`  ,   `'cp866'`  ,   `'csibm866'` |
| `'iso-8859-2'` | `'csisolatin2'`  ,   `'iso-ir-101'`  ,   `'iso8859-2'`  ,   `'iso88592'`  ,   `'iso_8859-2'`  ,   `'iso_8859-2:1987'`  ,   `'l2'`  ,   `'latin2'` |
| `'iso-8859-3'` | `'csisolatin3'`  ,   `'iso-ir-109'`  ,   `'iso8859-3'`  ,   `'iso88593'`  ,   `'iso_8859-3'`  ,   `'iso_8859-3:1988'`  ,   `'l3'`  ,   `'latin3'` |
| `'iso-8859-4'` | `'csisolatin4'`  ,   `'iso-ir-110'`  ,   `'iso8859-4'`  ,   `'iso88594'`  ,   `'iso_8859-4'`  ,   `'iso_8859-4:1988'`  ,   `'l4'`  ,   `'latin4'` |
| `'iso-8859-5'` | `'csisolatincyrillic'`  ,   `'cyrillic'`  ,   `'iso-ir-144'`  ,   `'iso8859-5'`  ,   `'iso88595'`  ,   `'iso_8859-5'`  ,   `'iso_8859-5:1988'` |
| `'iso-8859-6'` | `'arabic'`  ,   `'asmo-708'`  ,   `'csiso88596e'`  ,   `'csiso88596i'`  ,   `'csisolatinarabic'`  ,   `'ecma-114'`  ,   `'iso-8859-6-e'`  ,   `'iso-8859-6-i'`  ,   `'iso-ir-127'`  ,   `'iso8859-6'`  ,   `'iso88596'`  ,   `'iso_8859-6'`  ,   `'iso_8859-6:1987'` |
| `'iso-8859-7'` | `'csisolatingreek'`  ,   `'ecma-118'`  ,   `'elot_928'`  ,   `'greek'`  ,   `'greek8'`  ,   `'iso-ir-126'`  ,   `'iso8859-7'`  ,   `'iso88597'`  ,   `'iso_8859-7'`  ,   `'iso_8859-7:1987'`  ,   `'sun_eu_greek'` |
| `'iso-8859-8'` | `'csiso88598e'`  ,   `'csisolatinhebrew'`  ,   `'hebrew'`  ,   `'iso-8859-8-e'`  ,   `'iso-ir-138'`  ,   `'iso8859-8'`  ,   `'iso88598'`  ,   `'iso_8859-8'`  ,   `'iso_8859-8:1988'`  ,   `'visual'` |
| `'iso-8859-8-i'` | `'csiso88598i'`  ,   `'logical'` |
| `'iso-8859-10'` | `'csisolatin6'`  ,   `'iso-ir-157'`  ,   `'iso8859-10'`  ,   `'iso885910'`  ,   `'l6'`  ,   `'latin6'` |
| `'iso-8859-13'` | `'iso8859-13'`  ,   `'iso885913'` |
| `'iso-8859-14'` | `'iso8859-14'`  ,   `'iso885914'` |
| `'iso-8859-15'` | `'csisolatin9'`  ,   `'iso8859-15'`  ,   `'iso885915'`  ,   `'iso_8859-15'`  ,   `'l9'` |
| `'koi8-r'` | `'cskoi8r'`  ,   `'koi'`  ,   `'koi8'`  ,   `'koi8_r'` |
| `'koi8-u'` | `'koi8-ru'` |
| `'macintosh'` | `'csmacintosh'`  ,   `'mac'`  ,   `'x-mac-roman'` |
| `'windows-874'` | `'dos-874'`  ,   `'iso-8859-11'`  ,   `'iso8859-11'`  ,   `'iso885911'`  ,   `'tis-620'` |
| `'windows-1250'` | `'cp1250'`  ,   `'x-cp1250'` |
| `'windows-1251'` | `'cp1251'`  ,   `'x-cp1251'` |
| `'windows-1252'` | `'ansi_x3.4-1968'`  ,   `'ascii'`  ,   `'cp1252'`  ,   `'cp819'`  ,   `'csisolatin1'`  ,   `'ibm819'`  ,   `'iso-8859-1'`  ,   `'iso-ir-100'`  ,   `'iso8859-1'`  ,   `'iso88591'`  ,   `'iso_8859-1'`  ,   `'iso_8859-1:1987'`  ,   `'l1'`  ,   `'latin1'`  ,   `'us-ascii'`  ,   `'x-cp1252'` |
| `'windows-1253'` | `'cp1253'`  ,   `'x-cp1253'` |
| `'windows-1254'` | `'cp1254'`  ,   `'csisolatin5'`  ,   `'iso-8859-9'`  ,   `'iso-ir-148'`  ,   `'iso8859-9'`  ,   `'iso88599'`  ,   `'iso_8859-9'`  ,   `'iso_8859-9:1989'`  ,   `'l5'`  ,   `'latin5'`  ,   `'x-cp1254'` |
| `'windows-1255'` | `'cp1255'`  ,   `'x-cp1255'` |
| `'windows-1256'` | `'cp1256'`  ,   `'x-cp1256'` |
| `'windows-1257'` | `'cp1257'`  ,   `'x-cp1257'` |
| `'windows-1258'` | `'cp1258'`  ,   `'x-cp1258'` |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'` |
| `'gbk'` | `'chinese'`  ,   `'csgb2312'`  ,   `'csiso58gb231280'`  ,   `'gb2312'`  ,   `'gb_2312'`  ,   `'gb_2312-80'`  ,   `'iso-ir-58'`  ,   `'x-gbk'` |
| `'gb18030'` ||
| `'big5'` | `'big5-hkscs'`  ,   `'cn-big5'`  ,   `'csbig5'`  ,   `'x-x-big5'` |
| `'euc-jp'` | `'cseucpkdfmtjapanese'`  ,   `'x-euc-jp'` |
| `'iso-2022-jp'` | `'csiso2022jp'` |
| `'shift_jis'` | `'csshiftjis'`  ,   `'ms932'`  ,   `'ms_kanji'`  ,   `'shift-jis'`  ,   `'sjis'`  ,   `'windows-31j'`  ,   `'x-sjis'` |
| `'euc-kr'` | `'cseuckr'`  ,   `'csksc56011987'`  ,   `'iso-ir-149'`  ,   `'korean'`  ,   `'ks_c_5601-1987'`  ,   `'ks_c_5601-1989'`  ,   `'ksc5601'`  ,   `'ksc_5601'`  ,   `'windows-949'` |


#### Кодировки, поддерживаемые при сборке Node.js с опцией `small-icu` {#encodings-supported-when-nodejs-is-built-with-the-small-icu-option}

| Кодировка | Псевдонимы |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`, `'utf8'` |
| `'utf-16le'` | `'utf-16'` |
| `'utf-16be'` ||
#### Кодировки, поддерживаемые при отключенном ICU {#encodings-supported-when-icu-is-disabled}

| Кодировка | Псевдонимы |
| --- | --- |
| `'utf-8'` | `'unicode-1-1-utf-8'`, `'utf8'` |
| `'utf-16le'` | `'utf-16'` |

Кодировка `'iso-8859-16'`, указанная в [стандарте кодирования WHATWG](https://encoding.spec.whatwg.org/), не поддерживается.

### `new TextDecoder([encoding[, options]])` {#new-textdecoderencoding-options}

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Определяет `encoding`, который поддерживает этот экземпляр `TextDecoder`. **По умолчанию:** `'utf-8'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `fatal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если сбои декодирования являются фатальными. Эта опция не поддерживается, когда ICU отключен (см. [Internationalization](/ru/nodejs/api/intl)). **По умолчанию:** `false`.
    - `ignoreBOM` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Когда `true`, `TextDecoder` будет включать метку порядка байтов в декодированный результат. Когда `false`, метка порядка байтов будет удалена из вывода. Эта опция используется только когда `encoding` - `'utf-8'`, `'utf-16be'` или `'utf-16le'`. **По умолчанию:** `false`.

Создает новый экземпляр `TextDecoder`. `encoding` может указывать одну из поддерживаемых кодировок или псевдоним.

Класс `TextDecoder` также доступен в глобальном объекте.

### `textDecoder.decode([input[, options]])` {#textdecoderdecodeinput-options}

- `input` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Экземпляр `ArrayBuffer`, `DataView` или `TypedArray`, содержащий закодированные данные.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stream` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если ожидаются дополнительные фрагменты данных. **По умолчанию:** `false`.

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Декодирует `input` и возвращает строку. Если `options.stream` имеет значение `true`, любые неполные байтовые последовательности, встречающиеся в конце `input`, буферизуются внутри и выдаются после следующего вызова `textDecoder.decode()`.

Если `textDecoder.fatal` имеет значение `true`, ошибки декодирования приведут к выбросу `TypeError`.


### `textDecoder.encoding` {#textdecoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Кодировка, поддерживаемая экземпляром `TextDecoder`.

### `textDecoder.fatal` {#textdecoderfatal}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Значение будет `true`, если ошибки декодирования приведут к выбросу `TypeError`.

### `textDecoder.ignoreBOM` {#textdecoderignorebom}

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Значение будет `true`, если результат декодирования будет включать маркер порядка байтов.

## Class: `util.TextEncoder` {#class-utiltextencoder}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.0.0 | Класс теперь доступен в глобальном объекте. |
| v8.3.0 | Добавлено в: v8.3.0 |
:::

Реализация [стандарта кодирования WHATWG](https://encoding.spec.whatwg.org/) API `TextEncoder`. Все экземпляры `TextEncoder` поддерживают только кодировку UTF-8.

```js [ESM]
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```
Класс `TextEncoder` также доступен в глобальном объекте.

### `textEncoder.encode([input])` {#textencoderencodeinput}

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Текст для кодирования. **По умолчанию:** пустая строка.
- Возвращает: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)

Кодирует строку `input` в UTF-8 и возвращает `Uint8Array`, содержащий закодированные байты.

### `textEncoder.encodeInto(src, dest)` {#textencoderencodeintosrc-dest}

**Добавлено в: v12.11.0**

- `src` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Текст для кодирования.
- `dest` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Массив для хранения результата кодирования.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `read` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Прочитанные кодовые единицы Unicode из src.
    - `written` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Записанные байты UTF-8 в dest.
  
 

Кодирует строку `src` в UTF-8 в `dest` Uint8Array и возвращает объект, содержащий прочитанные кодовые единицы Unicode и записанные байты UTF-8.

```js [ESM]
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding` {#textencoderencoding}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Кодировка, поддерживаемая экземпляром `TextEncoder`. Всегда устанавливается в `'utf-8'`.

## `util.toUSVString(string)` {#utiltousvstringstring}

**Добавлено в: v16.8.0, v14.18.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает `string` после замены любых суррогатных кодовых точек (или, что эквивалентно, любых непарных суррогатных кодовых единиц) на символ замены Unicode U+FFFD.

## `util.transferableAbortController()` {#utiltransferableabortcontroller}

**Добавлено в: v18.11.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Создает и возвращает экземпляр [\<AbortController\>](/ru/nodejs/api/globals#class-abortcontroller), чей [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) помечен как передаваемый и может использоваться с `structuredClone()` или `postMessage()`.

## `util.transferableAbortSignal(signal)` {#utiltransferableabortsignalsignal}

**Добавлено в: v18.11.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)
- Возвращает: [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)

Помечает данный [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal) как передаваемый, чтобы его можно было использовать с `structuredClone()` и `postMessage()`.

```js [ESM]
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```
## `util.aborted(signal, resource)` {#utilabortedsignal-resource}

**Добавлено в: v19.7.0, v18.16.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

- `signal` [\<AbortSignal\>](/ru/nodejs/api/globals#class-abortsignal)
- `resource` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Любой ненулевой объект, связанный с прерываемой операцией и слабо удерживаемый. Если `resource` собирается сборщиком мусора до прерывания `signal`, обещание остается в состоянии ожидания, позволяя Node.js прекратить отслеживание. Это помогает предотвратить утечки памяти в длительных или неотменяемых операциях.
- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Прослушивает событие abort на предоставленном `signal` и возвращает обещание, которое разрешается, когда `signal` прерван. Если `resource` предоставлен, он слабо ссылается на связанный объект операции, поэтому, если `resource` собран сборщиком мусора до прерывания `signal`, возвращаемое обещание должно оставаться в состоянии ожидания. Это предотвращает утечки памяти в длительных или неотменяемых операциях.



::: code-group
```js [CJS]
const { aborted } = require('node:util');

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```

```js [ESM]
import { aborted } from 'node:util';

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```
:::


## `util.types` {#utiltypes}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.3.0 | Доступен как `require('util/types')`. |
| v10.0.0 | Добавлено в: v10.0.0 |
:::

`util.types` предоставляет проверки типов для различных видов встроенных объектов. В отличие от `instanceof` или `Object.prototype.toString.call(value)`, эти проверки не инспектируют свойства объекта, которые доступны из JavaScript (например, их прототип), и обычно имеют накладные расходы на вызов C++.

Результат обычно не дает никаких гарантий относительно того, какие виды свойств или поведения значение предоставляет в JavaScript. Они в основном полезны для разработчиков аддонов, которые предпочитают выполнять проверку типов в JavaScript.

API доступен через `require('node:util').types` или `require('node:util/types')`.

### `util.types.isAnyArrayBuffer(value)` {#utiltypesisanyarraybuffervalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) или [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer).

См. также [`util.types.isArrayBuffer()`](/ru/nodejs/api/util#utiltypesisarraybuffervalue) и [`util.types.isSharedArrayBuffer()`](/ru/nodejs/api/util#utiltypesissharedarraybuffervalue).

```js [ESM]
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Возвращает true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // Возвращает true
```
### `util.types.isArrayBufferView(value)` {#utiltypesisarraybufferviewvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является экземпляром одного из представлений [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), таких как объекты типизированных массивов или [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView). Эквивалентно [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

```js [ESM]
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

### `util.types.isArgumentsObject(value)` {#utiltypesisargumentsobjectvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является объектом `arguments`.

```js [ESM]
function foo() {
  util.types.isArgumentsObject(arguments);  // Возвращает true
}
```
### `util.types.isArrayBuffer(value)` {#utiltypesisarraybuffervalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Сюда *не* входят экземпляры [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Обычно желательно проверять оба; смотрите [`util.types.isAnyArrayBuffer()`](/ru/nodejs/api/util#utiltypesisanyarraybuffervalue) для этого.

```js [ESM]
util.types.isArrayBuffer(new ArrayBuffer());  // Возвращает true
util.types.isArrayBuffer(new SharedArrayBuffer());  // Возвращает false
```
### `util.types.isAsyncFunction(value)` {#utiltypesisasyncfunctionvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является [асинхронной функцией](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). Это сообщает только то, что видит движок JavaScript; в частности, возвращаемое значение может не соответствовать исходному исходному коду, если использовался инструмент для трансляции.

```js [ESM]
util.types.isAsyncFunction(function foo() {});  // Возвращает false
util.types.isAsyncFunction(async function foo() {});  // Возвращает true
```

### `util.types.isBigInt64Array(value)` {#utiltypesisbigint64arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является экземпляром `BigInt64Array`.

```js [ESM]
util.types.isBigInt64Array(new BigInt64Array());   // Returns true
util.types.isBigInt64Array(new BigUint64Array());  // Returns false
```
### `util.types.isBigIntObject(value)` {#utiltypesisbigintobjectvalue}

**Added in: v10.4.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является объектом BigInt, например, созданным с помощью `Object(BigInt(123))`.

```js [ESM]
util.types.isBigIntObject(Object(BigInt(123)));   // Returns true
util.types.isBigIntObject(BigInt(123));   // Returns false
util.types.isBigIntObject(123);  // Returns false
```
### `util.types.isBigUint64Array(value)` {#utiltypesisbiguint64arrayvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является экземпляром `BigUint64Array`.

```js [ESM]
util.types.isBigUint64Array(new BigInt64Array());   // Returns false
util.types.isBigUint64Array(new BigUint64Array());  // Returns true
```
### `util.types.isBooleanObject(value)` {#utiltypesisbooleanobjectvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является логическим объектом, например, созданным с помощью `new Boolean()`.

```js [ESM]
util.types.isBooleanObject(false);  // Returns false
util.types.isBooleanObject(true);   // Returns false
util.types.isBooleanObject(new Boolean(false)); // Returns true
util.types.isBooleanObject(new Boolean(true));  // Returns true
util.types.isBooleanObject(Boolean(false)); // Returns false
util.types.isBooleanObject(Boolean(true));  // Returns false
```

### `util.types.isBoxedPrimitive(value)` {#utiltypesisboxedprimitivevalue}

**Added in: v10.11.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является каким-либо упакованным примитивным объектом, например, созданным с помощью `new Boolean()`, `new String()` или `Object(Symbol())`.

Например:

```js [ESM]
util.types.isBoxedPrimitive(false); // Возвращает false
util.types.isBoxedPrimitive(new Boolean(false)); // Возвращает true
util.types.isBoxedPrimitive(Symbol('foo')); // Возвращает false
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // Возвращает true
util.types.isBoxedPrimitive(Object(BigInt(5))); // Возвращает true
```
### `util.types.isCryptoKey(value)` {#utiltypesiscryptokeyvalue}

**Added in: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если `value` является [\<CryptoKey\>](/ru/nodejs/api/webcrypto#class-cryptokey), иначе `false`.

### `util.types.isDataView(value)` {#utiltypesisdataviewvalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView).

```js [ESM]
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // Возвращает true
util.types.isDataView(new Float64Array());  // Возвращает false
```
Смотрите также [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isDate(value)` {#utiltypesisdatevalue}

**Added in: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

```js [ESM]
util.types.isDate(new Date());  // Возвращает true
```

### `util.types.isExternal(value)` {#utiltypesisexternalvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является нативным значением `External`.

Нативное значение `External` — это особый тип объекта, который содержит необработанный указатель C++ (`void*`) для доступа из нативного кода и не имеет никаких других свойств. Такие объекты создаются либо внутренними компонентами Node.js, либо нативными дополнениями. В JavaScript это [замороженные](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) объекты с прототипом `null`.

```C [C]
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```
```js [ESM]
const native = require('napi_addon.node');
const data = native.myNapi();
util.types.isExternal(data); // возвращает true
util.types.isExternal(0); // возвращает false
util.types.isExternal(new String('foo')); // возвращает false
```
Для получения дополнительной информации о `napi_create_external` обратитесь к [`napi_create_external()`](/ru/nodejs/api/n-api#napi_create_external).

### `util.types.isFloat32Array(value)` {#utiltypesisfloat32arrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array).

```js [ESM]
util.types.isFloat32Array(new ArrayBuffer());  // Возвращает false
util.types.isFloat32Array(new Float32Array());  // Возвращает true
util.types.isFloat32Array(new Float64Array());  // Возвращает false
```

### `util.types.isFloat64Array(value)` {#utiltypesisfloat64arrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array).

```js [ESM]
util.types.isFloat64Array(new ArrayBuffer());  // Возвращает false
util.types.isFloat64Array(new Uint8Array());  // Возвращает false
util.types.isFloat64Array(new Float64Array());  // Возвращает true
```
### `util.types.isGeneratorFunction(value)` {#utiltypesisgeneratorfunctionvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является функцией-генератором. Это сообщает только то, что видит движок JavaScript; в частности, возвращаемое значение может не соответствовать исходному исходному коду, если использовался инструмент транспиляции.

```js [ESM]
util.types.isGeneratorFunction(function foo() {});  // Возвращает false
util.types.isGeneratorFunction(function* foo() {});  // Возвращает true
```
### `util.types.isGeneratorObject(value)` {#utiltypesisgeneratorobjectvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является объектом-генератором, возвращенным из встроенной функции-генератора. Это сообщает только то, что видит движок JavaScript; в частности, возвращаемое значение может не соответствовать исходному исходному коду, если использовался инструмент транспиляции.

```js [ESM]
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // Возвращает true
```
### `util.types.isInt8Array(value)` {#utiltypesisint8arrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array).

```js [ESM]
util.types.isInt8Array(new ArrayBuffer());  // Возвращает false
util.types.isInt8Array(new Int8Array());  // Возвращает true
util.types.isInt8Array(new Float64Array());  // Возвращает false
```

### `util.types.isInt16Array(value)` {#utiltypesisint16arrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array).

```js [ESM]
util.types.isInt16Array(new ArrayBuffer());  // Возвращает false
util.types.isInt16Array(new Int16Array());  // Возвращает true
util.types.isInt16Array(new Float64Array());  // Возвращает false
```
### `util.types.isInt32Array(value)` {#utiltypesisint32arrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array).

```js [ESM]
util.types.isInt32Array(new ArrayBuffer());  // Возвращает false
util.types.isInt32Array(new Int32Array());  // Возвращает true
util.types.isInt32Array(new Float64Array());  // Возвращает false
```
### `util.types.isKeyObject(value)` {#utiltypesiskeyobjectvalue}

**Добавлено в: v16.2.0**

- `value` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если `value` является [\<KeyObject\>](/ru/nodejs/api/crypto#class-keyobject), иначе `false`.

### `util.types.isMap(value)` {#utiltypesismapvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

```js [ESM]
util.types.isMap(new Map());  // Возвращает true
```

### `util.types.isMapIterator(value)` {#utiltypesismapiteratorvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является итератором, возвращенным для встроенного экземпляра [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

```js [ESM]
const map = new Map();
util.types.isMapIterator(map.keys());  // Возвращает true
util.types.isMapIterator(map.values());  // Возвращает true
util.types.isMapIterator(map.entries());  // Возвращает true
util.types.isMapIterator(map[Symbol.iterator]());  // Возвращает true
```
### `util.types.isModuleNamespaceObject(value)` {#utiltypesismodulenamespaceobjectvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является экземпляром [Module Namespace Object](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects).

```js [ESM]
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Возвращает true
```
### `util.types.isNativeError(value)` {#utiltypesisnativeerrorvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение было возвращено конструктором [встроенного типа `Error`](https://tc39.es/ecma262/#sec-error-objects).

```js [ESM]
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```
Подклассы встроенных типов ошибок также являются собственными ошибками:

```js [ESM]
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```
Значение, являющееся `instanceof` собственным классом ошибок, не эквивалентно `isNativeError()`, возвращающему `true` для этого значения. `isNativeError()` возвращает `true` для ошибок, которые поступают из другой [realm](https://tc39.es/ecma262/#realm), в то время как `instanceof Error` возвращает `false` для этих ошибок:

```js [ESM]
const vm = require('node:vm');
const context = vm.createContext({});
const myError = vm.runInContext('new Error()', context);
console.log(util.types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```
И наоборот, `isNativeError()` возвращает `false` для всех объектов, которые не были возвращены конструктором собственной ошибки. Это включает в себя значения, которые являются `instanceof` собственными ошибками:

```js [ESM]
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)` {#utiltypesisnumberobjectvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является числовым объектом, например, созданным с помощью `new Number()`.

```js [ESM]
util.types.isNumberObject(0);  // Возвращает false
util.types.isNumberObject(new Number(0));   // Возвращает true
```
### `util.types.isPromise(value)` {#utiltypesispromisevalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```js [ESM]
util.types.isPromise(Promise.resolve(42));  // Возвращает true
```
### `util.types.isProxy(value)` {#utiltypesisproxyvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является экземпляром [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

```js [ESM]
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Возвращает false
util.types.isProxy(proxy);  // Возвращает true
```
### `util.types.isRegExp(value)` {#utiltypesisregexpvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является объектом регулярного выражения.

```js [ESM]
util.types.isRegExp(/abc/);  // Возвращает true
util.types.isRegExp(new RegExp('abc'));  // Возвращает true
```

### `util.types.isSet(value)` {#utiltypesissetvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

```js [ESM]
util.types.isSet(new Set());  // Возвращает true
```
### `util.types.isSetIterator(value)` {#utiltypesissetiteratorvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является итератором, возвращенным для встроенного экземпляра [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

```js [ESM]
const set = new Set();
util.types.isSetIterator(set.keys());  // Возвращает true
util.types.isSetIterator(set.values());  // Возвращает true
util.types.isSetIterator(set.entries());  // Возвращает true
util.types.isSetIterator(set[Symbol.iterator]());  // Возвращает true
```
### `util.types.isSharedArrayBuffer(value)` {#utiltypesissharedarraybuffervalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Это *не* включает экземпляры [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Обычно желательно проверять оба варианта; смотрите [`util.types.isAnyArrayBuffer()`](/ru/nodejs/api/util#utiltypesisanyarraybuffervalue).

```js [ESM]
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Возвращает false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Возвращает true
```

### `util.types.isStringObject(value)` {#utiltypesisstringobjectvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является строковым объектом, например, созданным с помощью `new String()`.

```js [ESM]
util.types.isStringObject('foo');  // Возвращает false
util.types.isStringObject(new String('foo'));   // Возвращает true
```
### `util.types.isSymbolObject(value)` {#utiltypesissymbolobjectvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является символьным объектом, созданным путем вызова `Object()` для примитива `Symbol`.

```js [ESM]
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // Возвращает false
util.types.isSymbolObject(Object(symbol));   // Возвращает true
```
### `util.types.isTypedArray(value)` {#utiltypesistypedarrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

```js [ESM]
util.types.isTypedArray(new ArrayBuffer());  // Возвращает false
util.types.isTypedArray(new Uint8Array());  // Возвращает true
util.types.isTypedArray(new Float64Array());  // Возвращает true
```
См. также [`ArrayBuffer.isView()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView).

### `util.types.isUint8Array(value)` {#utiltypesisuint8arrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

```js [ESM]
util.types.isUint8Array(new ArrayBuffer());  // Возвращает false
util.types.isUint8Array(new Uint8Array());  // Возвращает true
util.types.isUint8Array(new Float64Array());  // Возвращает false
```

### `util.types.isUint8ClampedArray(value)` {#utiltypesisuint8clampedarrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray).

```js [ESM]
util.types.isUint8ClampedArray(new ArrayBuffer());  // Возвращает false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Возвращает true
util.types.isUint8ClampedArray(new Float64Array());  // Возвращает false
```
### `util.types.isUint16Array(value)` {#utiltypesisuint16arrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Uint16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array).

```js [ESM]
util.types.isUint16Array(new ArrayBuffer());  // Возвращает false
util.types.isUint16Array(new Uint16Array());  // Возвращает true
util.types.isUint16Array(new Float64Array());  // Возвращает false
```
### `util.types.isUint32Array(value)` {#utiltypesisuint32arrayvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array).

```js [ESM]
util.types.isUint32Array(new ArrayBuffer());  // Возвращает false
util.types.isUint32Array(new Uint32Array());  // Возвращает true
util.types.isUint32Array(new Float64Array());  // Возвращает false
```
### `util.types.isWeakMap(value)` {#utiltypesisweakmapvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap).

```js [ESM]
util.types.isWeakMap(new WeakMap());  // Возвращает true
```

### `util.types.isWeakSet(value)` {#utiltypesisweaksetvalue}

**Добавлено в: v10.0.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если значение является встроенным экземпляром [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet).

```js [ESM]
util.types.isWeakSet(new WeakSet());  // Возвращает true
```
## Устаревшие API {#deprecated-apis}

Следующие API устарели и больше не должны использоваться. Существующие приложения и модули должны быть обновлены для поиска альтернативных подходов.

### `util._extend(target, source)` {#util_extendtarget-source}

**Добавлено в: v0.7.5**

**Устарело с: v6.0.0**

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) вместо этого.
:::

- `target` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `source` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Метод `util._extend()` никогда не предназначался для использования вне внутренних модулей Node.js. Сообщество нашло и использовало его в любом случае.

Он устарел и не должен использоваться в новом коде. JavaScript поставляется с очень похожей встроенной функциональностью через [`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign).

### `util.isArray(object)` {#utilisarrayobject}

**Добавлено в: v0.6.0**

**Устарело с: v4.0.0**

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) вместо этого.
:::

- `object` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Псевдоним для [`Array.isArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray).

Возвращает `true`, если данный `object` является `Array`. В противном случае возвращает `false`.

```js [ESM]
const util = require('node:util');

util.isArray([]);
// Возвращает: true
util.isArray(new Array());
// Возвращает: true
util.isArray({});
// Возвращает: false
```

