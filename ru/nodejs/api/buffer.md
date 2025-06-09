---
title: Документация по Buffer в Node.js
description: Документация по Buffer в Node.js предоставляет подробную информацию о том, как работать с бинарными данными в Node.js, включая создание, манипулирование и преобразование буферов.
head:
  - - meta
    - name: og:title
      content: Документация по Buffer в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Документация по Buffer в Node.js предоставляет подробную информацию о том, как работать с бинарными данными в Node.js, включая создание, манипулирование и преобразование буферов.
  - - meta
    - name: twitter:title
      content: Документация по Buffer в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Документация по Buffer в Node.js предоставляет подробную информацию о том, как работать с бинарными данными в Node.js, включая создание, манипулирование и преобразование буферов.
---


# Buffer {#buffer}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/buffer.js](https://github.com/nodejs/node/blob/v23.5.0/lib/buffer.js)

Объекты `Buffer` используются для представления последовательности байтов фиксированной длины. Многие API Node.js поддерживают `Buffer`.

Класс `Buffer` является подклассом класса JavaScript [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) и расширяет его методами, которые охватывают дополнительные варианты использования. API Node.js принимают обычные [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) везде, где поддерживаются `Buffer`.

Хотя класс `Buffer` доступен в глобальной области видимости, все же рекомендуется явно ссылаться на него через оператор import или require.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Создает Buffer, заполненный нулями, длиной 10.
const buf1 = Buffer.alloc(10);

// Создает Buffer длиной 10,
// заполненный байтами, все из которых имеют значение `1`.
const buf2 = Buffer.alloc(10, 1);

// Создает неинициализированный буфер длиной 10.
// Это быстрее, чем вызов Buffer.alloc(), но возвращаемый
// экземпляр Buffer может содержать старые данные, которые необходимо
// перезаписать с помощью fill(), write() или других функций, заполняющих
// содержимое Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Создает Buffer, содержащий байты [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Создает Buffer, содержащий байты [1, 1, 1, 1] – записи
// все усекаются с помощью `(value & 255)`, чтобы соответствовать диапазону 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Создает Buffer, содержащий байты в кодировке UTF-8 для строки 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (в шестнадцатеричном формате)
// [116, 195, 169, 115, 116] (в десятичном формате)
const buf6 = Buffer.from('tést');

// Создает Buffer, содержащий байты Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Создает Buffer, заполненный нулями, длиной 10.
const buf1 = Buffer.alloc(10);

// Создает Buffer длиной 10,
// заполненный байтами, все из которых имеют значение `1`.
const buf2 = Buffer.alloc(10, 1);

// Создает неинициализированный буфер длиной 10.
// Это быстрее, чем вызов Buffer.alloc(), но возвращаемый
// экземпляр Buffer может содержать старые данные, которые необходимо
// перезаписать с помощью fill(), write() или других функций, заполняющих
// содержимое Buffer.
const buf3 = Buffer.allocUnsafe(10);

// Создает Buffer, содержащий байты [1, 2, 3].
const buf4 = Buffer.from([1, 2, 3]);

// Создает Buffer, содержащий байты [1, 1, 1, 1] – записи
// все усекаются с помощью `(value & 255)`, чтобы соответствовать диапазону 0–255.
const buf5 = Buffer.from([257, 257.5, -255, '1']);

// Создает Buffer, содержащий байты в кодировке UTF-8 для строки 'tést':
// [0x74, 0xc3, 0xa9, 0x73, 0x74] (в шестнадцатеричном формате)
// [116, 195, 169, 115, 116] (в десятичном формате)
const buf6 = Buffer.from('tést');

// Создает Buffer, содержащий байты Latin-1 [0x74, 0xe9, 0x73, 0x74].
const buf7 = Buffer.from('tést', 'latin1');
```
:::


## Буферы и кодировки символов {#buffers-and-character-encodings}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.7.0, v14.18.0 | Введена кодировка `base64url`. |
| v6.4.0 | Введено `latin1` как псевдоним для `binary`. |
| v5.0.0 | Удалены устаревшие кодировки `raw` и `raws`. |
:::

При преобразовании между `Buffer` и строками может быть указана кодировка символов. Если кодировка символов не указана, по умолчанию будет использоваться UTF-8.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Выводит: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Выводит: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Выводит: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Выводит: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello world', 'utf8');

console.log(buf.toString('hex'));
// Выводит: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Выводит: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'utf8'));
// Выводит: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Выводит: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```
:::

Буферы Node.js принимают все варианты регистра строк кодировки, которые они получают. Например, UTF-8 можно указать как `'utf8'`, `'UTF8'` или `'uTf8'`.

В настоящее время Node.js поддерживает следующие кодировки символов:

- `'utf8'` (псевдоним: `'utf-8'`): Многобайтовая кодировка символов Unicode. Многие веб-страницы и другие форматы документов используют [UTF-8](https://en.wikipedia.org/wiki/UTF-8). Это кодировка символов по умолчанию. При декодировании `Buffer` в строку, которая не содержит исключительно допустимые данные UTF-8, символ замены Unicode `U+FFFD` � будет использоваться для представления этих ошибок.
- `'utf16le'` (псевдоним: `'utf-16le'`): Многобайтовая кодировка символов Unicode. В отличие от `'utf8'`, каждый символ в строке будет закодирован с использованием 2 или 4 байтов. Node.js поддерживает только [little-endian](https://en.wikipedia.org/wiki/Endianness) вариант [UTF-16](https://en.wikipedia.org/wiki/UTF-16).
- `'latin1'`: Latin-1 означает [ISO-8859-1](https://en.wikipedia.org/wiki/ISO-8859-1). Эта кодировка символов поддерживает только символы Unicode от `U+0000` до `U+00FF`. Каждый символ кодируется с использованием одного байта. Символы, которые не входят в этот диапазон, усекаются и будут сопоставлены символам в этом диапазоне.

Преобразование `Buffer` в строку с использованием одного из вышеперечисленных способов называется декодированием, а преобразование строки в `Buffer` называется кодированием.

Node.js также поддерживает следующие кодировки из двоичного в текст. Для кодировок из двоичного в текст соглашение об именах обратное: преобразование `Buffer` в строку обычно называется кодированием, а преобразование строки в `Buffer` - декодированием.

- `'base64'`: Кодировка [Base64](https://en.wikipedia.org/wiki/Base64). При создании `Buffer` из строки эта кодировка также правильно принимает "URL and Filename Safe Alphabet", как указано в [RFC 4648, Section 5](https://tools.ietf.org/html/rfc4648#section-5). Символы пробелов, такие как пробелы, табуляции и новые строки, содержащиеся в строке, закодированной в base64, игнорируются.
- `'base64url'`: Кодировка [base64url](https://tools.ietf.org/html/rfc4648#section-5), как указано в [RFC 4648, Section 5](https://tools.ietf.org/html/rfc4648#section-5). При создании `Buffer` из строки эта кодировка также правильно принимает обычные строки, закодированные в base64. При кодировании `Buffer` в строку эта кодировка опускает заполнение.
- `'hex'`: Кодирует каждый байт как два шестнадцатеричных символа. Усечение данных может произойти при декодировании строк, которые не состоят исключительно из четного количества шестнадцатеричных символов. См. пример ниже.

Также поддерживаются следующие устаревшие кодировки символов:

- `'ascii'`: Только для 7-битных данных [ASCII](https://en.wikipedia.org/wiki/ASCII). При кодировании строки в `Buffer` это эквивалентно использованию `'latin1'`. При декодировании `Buffer` в строку использование этой кодировки дополнительно отменит старший бит каждого байта перед декодированием как `'latin1'`. Как правило, нет причин использовать эту кодировку, поскольку `'utf8'` (или, если известно, что данные всегда содержат только ASCII, `'latin1'`) будет лучшим выбором при кодировании или декодировании текста только ASCII. Это предоставлено только для обеспечения совместимости со старыми версиями.
- `'binary'`: Псевдоним для `'latin1'`. Название этой кодировки может вводить в заблуждение, поскольку все перечисленные здесь кодировки преобразуют строки в двоичные данные и обратно. Для преобразования между строками и `Buffer` обычно `'utf8'` является правильным выбором.
- `'ucs2'`, `'ucs-2'`: Псевдонимы `'utf16le'`. UCS-2 раньше относился к варианту UTF-16, который не поддерживал символы с кодовыми точками, превышающими U+FFFF. В Node.js эти кодовые точки всегда поддерживаются.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.from('1ag123', 'hex');
// Выводит <Buffer 1a>, данные усечены при первом не шестнадцатеричном значении
// ('g').

Buffer.from('1a7', 'hex');
// Выводит <Buffer 1a>, данные усечены, когда данные заканчиваются на одну цифру ('7').

Buffer.from('1634', 'hex');
// Выводит <Buffer 16 34>, все данные представлены.
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.from('1ag123', 'hex');
// Выводит <Buffer 1a>, данные усечены при первом не шестнадцатеричном значении
// ('g').

Buffer.from('1a7', 'hex');
// Выводит <Buffer 1a>, данные усечены, когда данные заканчиваются на одну цифру ('7').

Buffer.from('1634', 'hex');
// Выводит <Buffer 16 34>, все данные представлены.
```
:::

Современные веб-браузеры соответствуют [стандарту кодирования WHATWG](https://encoding.spec.whatwg.org/), который псевдонимизирует как `'latin1'`, так и `'ISO-8859-1'` в `'win-1252'`. Это означает, что при выполнении чего-либо вроде `http.get()`, если возвращаемый charset является одним из тех, которые перечислены в спецификации WHATWG, возможно, что сервер фактически вернул данные, закодированные в `'win-1252'`, и использование кодировки `'latin1'` может неправильно декодировать символы.


## Buffers и TypedArrays {#buffers-and-typedarrays}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v3.0.0 | Класс `Buffer` теперь наследуется от `Uint8Array`. |
:::

Экземпляры `Buffer` также являются JavaScript [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) и [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) экземплярами. Все методы [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) доступны для `Buffer`s. Однако, существуют небольшие несовместимости между API `Buffer` и API [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

В частности:

- В то время как [`TypedArray.prototype.slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) создает копию части `TypedArray`, [`Buffer.prototype.slice()`](/ru/nodejs/api/buffer#bufslicestart-end) создает представление поверх существующего `Buffer` без копирования. Такое поведение может быть неожиданным и существует только для обратной совместимости. [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) можно использовать для достижения поведения [`Buffer.prototype.slice()`](/ru/nodejs/api/buffer#bufslicestart-end) как на `Buffer`s, так и на других `TypedArray`s, и его следует предпочитать.
- [`buf.toString()`](/ru/nodejs/api/buffer#buftostringencoding-start-end) несовместим со своим эквивалентом в `TypedArray`.
- Ряд методов, например, [`buf.indexOf()`](/ru/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), поддерживают дополнительные аргументы.

Существует два способа создания новых экземпляров [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) из `Buffer`:

- Передача `Buffer` в конструктор [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) скопирует содержимое `Buffer`s, интерпретированное как массив целых чисел, а не как байтовая последовательность целевого типа.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);
const uint32array = new Uint32Array(buf);

console.log(uint32array);

// Prints: Uint32Array(4) [ 1, 2, 3, 4 ]
```
:::

- Передача базового [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) `Buffer` создаст [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), который разделяет свою память с `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('hello', 'utf16le');
const uint16array = new Uint16Array(
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT);

console.log(uint16array);

// Prints: Uint16Array(5) [ 104, 101, 108, 108, 111 ]
```
:::

Можно создать новый `Buffer`, который разделяет ту же выделенную память, что и экземпляр [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), используя свойство `.buffer` объекта `TypedArray` таким же образом. [`Buffer.from()`](/ru/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) ведет себя как `new Uint8Array()` в этом контексте.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Copies the contents of `arr`.
const buf1 = Buffer.from(arr);

// Shares memory with `arr`.
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// Prints: <Buffer 88 a0>
console.log(buf2);
// Prints: <Buffer 88 13 70 17>
```
:::

При создании `Buffer` с использованием `.buffer` [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), можно использовать только часть базового [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), передав параметры `byteOffset` и `length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

console.log(buf.length);
// Prints: 16
```
:::

`Buffer.from()` и [`TypedArray.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/from) имеют разные сигнатуры и реализации. В частности, варианты [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) принимают второй аргумент, который является функцией отображения, вызываемой для каждого элемента типизированного массива:

- `TypedArray.from(source[, mapFn[, thisArg]])`

Метод `Buffer.from()`, однако, не поддерживает использование функции отображения:

- [`Buffer.from(array)`](/ru/nodejs/api/buffer#static-method-bufferfromarray)
- [`Buffer.from(buffer)`](/ru/nodejs/api/buffer#static-method-bufferfrombuffer)
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ru/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length)
- [`Buffer.from(string[, encoding])`](/ru/nodejs/api/buffer#static-method-bufferfromstring-encoding)


## Буферы и итерация {#buffers-and-iteration}

По экземплярам `Buffer` можно итерировать, используя синтаксис `for..of`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Выводит:
//   1
//   2
//   3
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Выводит:
//   1
//   2
//   3
```
:::

Кроме того, методы [`buf.values()`](/ru/nodejs/api/buffer#bufvalues), [`buf.keys()`](/ru/nodejs/api/buffer#bufkeys) и [`buf.entries()`](/ru/nodejs/api/buffer#bufentries) можно использовать для создания итераторов.

## Класс: `Blob` {#class-blob}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0, v16.17.0 | Больше не экспериментальный. |
| v15.7.0, v14.18.0 | Добавлено в: v15.7.0, v14.18.0 |
:::

[`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) инкапсулирует неизменяемые необработанные данные, которыми можно безопасно обмениваться между несколькими рабочими потоками.

### `new buffer.Blob([sources[, options]])` {#new-bufferblobsources-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.7.0 | Добавлен стандартный параметр `endings` для замены окончаний строк и удален нестандартный параметр `encoding`. |
| v15.7.0, v14.18.0 | Добавлено в: v15.7.0, v14.18.0 |
:::

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/ru/nodejs/api/buffer#class-blob) Массив объектов string, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) или [\<Blob\>](/ru/nodejs/api/buffer#class-blob), или любая комбинация таких объектов, которые будут храниться внутри `Blob`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Одно из значений: `'transparent'` или `'native'`. Если установлено значение `'native'`, окончания строк в строковых частях источника будут преобразованы в окончание строки, специфичное для платформы, как указано в `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип содержимого Blob. Предполагается, что `type` передает MIME-тип данных, однако проверка формата типа не выполняется.

Создает новый объект `Blob`, содержащий конкатенацию заданных источников.

Источники [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) и [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) копируются в 'Blob' и поэтому могут быть безопасно изменены после создания 'Blob'.

Строковые источники кодируются как последовательности байтов UTF-8 и копируются в Blob. Несогласованные суррогатные пары в каждой строковой части будут заменены символами замены Unicode U+FFFD.


### `blob.arrayBuffer()` {#blobarraybuffer}

**Добавлено в: v15.7.0, v14.18.0**

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Возвращает promise, который выполняется с [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), содержащим копию данных `Blob`.

#### `blob.bytes()` {#blobbytes}

**Добавлено в: v22.3.0, v20.16.0**

Метод `blob.bytes()` возвращает байты объекта `Blob` в виде `Promise<Uint8Array>`.

```js [ESM]
const blob = new Blob(['hello']);
blob.bytes().then((bytes) => {
  console.log(bytes); // Выводит: Uint8Array(5) [ 104, 101, 108, 108, 111 ]
});
```
### `blob.size` {#blobsize}

**Добавлено в: v15.7.0, v14.18.0**

Общий размер `Blob` в байтах.

### `blob.slice([start[, end[, type]]])` {#blobslicestart-end-type}

**Добавлено в: v15.7.0, v14.18.0**

- `start` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Начальный индекс.
- `end` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Конечный индекс.
- `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Content-type для нового `Blob`

Создает и возвращает новый `Blob`, содержащий подмножество данных этого объекта `Blob`. Оригинальный `Blob` не изменяется.

### `blob.stream()` {#blobstream}

**Добавлено в: v16.7.0**

- Возвращает: [\<ReadableStream\>](/ru/nodejs/api/webstreams#class-readablestream)

Возвращает новый `ReadableStream`, который позволяет читать содержимое `Blob`.

### `blob.text()` {#blobtext}

**Добавлено в: v15.7.0, v14.18.0**

- Возвращает: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Возвращает promise, который выполняется с содержимым `Blob`, декодированным как строка UTF-8.

### `blob.type` {#blobtype}

**Добавлено в: v15.7.0, v14.18.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Content-type `Blob`.


### Объекты `Blob` и `MessageChannel` {#blob-objects-and-messagechannel}

После создания объекта [\<Blob\>](/ru/nodejs/api/buffer#class-blob), его можно отправить через `MessagePort` в несколько мест назначения без передачи или немедленного копирования данных. Данные, содержащиеся в `Blob`, копируются только при вызове методов `arrayBuffer()` или `text()`.

::: code-group
```js [ESM]
import { Blob } from 'node:buffer';
import { setTimeout as delay } from 'node:timers/promises';

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```

```js [CJS]
const { Blob } = require('node:buffer');
const { setTimeout: delay } = require('node:timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};

mc2.port1.onmessage = async ({ data }) => {
  await delay(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// The Blob is still usable after posting.
blob.text().then(console.log);
```
:::

## Класс: `Buffer` {#class-buffer}

Класс `Buffer` является глобальным типом для непосредственной работы с бинарными данными. Он может быть создан различными способами.

### Статический метод: `Buffer.alloc(size[, fill[, encoding]])` {#static-method-bufferallocsize-fill-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Выбрасывает ERR_INVALID_ARG_TYPE или ERR_OUT_OF_RANGE вместо ERR_INVALID_ARG_VALUE для недопустимых входных аргументов. |
| v15.0.0 | Выбрасывает ERR_INVALID_ARG_VALUE вместо ERR_INVALID_OPT_VALUE для недопустимых входных аргументов. |
| v10.0.0 | Попытка заполнить буфер ненулевой длины буфером нулевой длины вызывает исключение. |
| v10.0.0 | Указание недопустимой строки для `fill` вызывает исключение. |
| v8.9.3 | Указание недопустимой строки для `fill` теперь приводит к заполнению буфера нулями. |
| v5.10.0 | Добавлено в: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Желаемая длина нового `Buffer`.
- `fill` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение для предварительного заполнения нового `Buffer`. **По умолчанию:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `fill` является строкой, это ее кодировка. **По умолчанию:** `'utf8'`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Выделяет новый `Buffer` размером `size` байт. Если `fill` не определен (`undefined`), `Buffer` будет заполнен нулями.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```
:::

Если `size` больше, чем [`buffer.constants.MAX_LENGTH`](/ru/nodejs/api/buffer#bufferconstantsmax_length) или меньше 0, выбрасывается [`ERR_OUT_OF_RANGE`](/ru/nodejs/api/errors#err_out_of_range).

Если указан `fill`, выделенный `Buffer` будет инициализирован вызовом [`buf.fill(fill)`](/ru/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(5, 'a');

console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```
:::

Если указаны и `fill`, и `encoding`, выделенный `Buffer` будет инициализирован вызовом [`buf.fill(fill, encoding)`](/ru/nodejs/api/buffer#buffillvalue-offset-end-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```
:::

Вызов [`Buffer.alloc()`](/ru/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) может быть заметно медленнее, чем альтернативный [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize), но гарантирует, что вновь созданный экземпляр `Buffer` никогда не будет содержать конфиденциальные данные из предыдущих выделений, включая данные, которые могли быть выделены не для `Buffer`.

Если `size` не является числом, будет выброшена ошибка `TypeError`.


### Статический метод: `Buffer.allocUnsafe(size)` {#static-method-bufferallocunsafesize}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Вместо ERR_INVALID_ARG_VALUE выдается ERR_INVALID_ARG_TYPE или ERR_OUT_OF_RANGE для недопустимых входных аргументов. |
| v15.0.0 | Вместо ERR_INVALID_OPT_VALUE выдается ERR_INVALID_ARG_VALUE для недопустимых входных аргументов. |
| v7.0.0 | Передача отрицательного `size` теперь вызывает ошибку. |
| v5.10.0 | Добавлено в: v5.10.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Желаемая длина нового `Buffer`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Выделяет новый `Buffer` размером `size` байт. Если `size` больше, чем [`buffer.constants.MAX_LENGTH`](/ru/nodejs/api/buffer#bufferconstantsmax_length) или меньше 0, выбрасывается [`ERR_OUT_OF_RANGE`](/ru/nodejs/api/errors#err_out_of_range).

Базовая память для экземпляров `Buffer`, созданных таким образом, *не инициализируется*. Содержимое вновь созданного `Buffer` неизвестно и *может содержать конфиденциальные данные*. Используйте [`Buffer.alloc()`](/ru/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) вместо этого для инициализации экземпляров `Buffer` нулями.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Выводит (содержимое может отличаться): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Выводит: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Выводит (содержимое может отличаться): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Выводит: <Buffer 00 00 00 00 00 00 00 00 00 00>
```
:::

`TypeError` будет выброшен, если `size` не является числом.

Модуль `Buffer` предварительно выделяет внутренний экземпляр `Buffer` размером [`Buffer.poolSize`](/ru/nodejs/api/buffer#class-property-bufferpoolsize), который используется в качестве пула для быстрого выделения новых экземпляров `Buffer`, созданных с помощью [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(array)`](/ru/nodejs/api/buffer#static-method-bufferfromarray), [`Buffer.from(string)`](/ru/nodejs/api/buffer#static-method-bufferfromstring-encoding) и [`Buffer.concat()`](/ru/nodejs/api/buffer#static-method-bufferconcatlist-totallength) только когда `size` меньше `Buffer.poolSize \>\>\> 1` (целая часть от [`Buffer.poolSize`](/ru/nodejs/api/buffer#class-property-bufferpoolsize), деленная на два).

Использование этого предварительно выделенного внутреннего пула памяти является ключевым отличием между вызовом `Buffer.alloc(size, fill)` и `Buffer.allocUnsafe(size).fill(fill)`. В частности, `Buffer.alloc(size, fill)` *никогда* не будет использовать внутренний пул `Buffer`, в то время как `Buffer.allocUnsafe(size).fill(fill)` *будет* использовать внутренний пул `Buffer`, если `size` меньше или равна половине [`Buffer.poolSize`](/ru/nodejs/api/buffer#class-property-bufferpoolsize). Разница незначительна, но может быть важна, когда приложению требуется дополнительная производительность, которую предоставляет [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Статический метод: `Buffer.allocUnsafeSlow(size)` {#static-method-bufferallocunsafeslowsize}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v20.0.0 | Вместо ERR_INVALID_ARG_VALUE для недопустимых входных аргументов выдается исключение ERR_INVALID_ARG_TYPE или ERR_OUT_OF_RANGE. |
| v15.0.0 | Вместо ERR_INVALID_OPT_VALUE для недопустимых входных аргументов выдается исключение ERR_INVALID_ARG_VALUE. |
| v5.12.0 | Добавлено в версии: v5.12.0 |
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Желаемая длина нового `Buffer`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Выделяет новый `Buffer` размером `size` байт. Если `size` больше [`buffer.constants.MAX_LENGTH`](/ru/nodejs/api/buffer#bufferconstantsmax_length) или меньше 0, возникает исключение [`ERR_OUT_OF_RANGE`](/ru/nodejs/api/errors#err_out_of_range). `Buffer` нулевой длины создается, если `size` равно 0.

Базовая память для экземпляров `Buffer`, созданных таким образом, *не инициализируется*. Содержимое вновь созданного `Buffer` неизвестно и *может содержать конфиденциальные данные*. Используйте [`buf.fill(0)`](/ru/nodejs/api/buffer#buffillvalue-offset-end-encoding) для инициализации таких экземпляров `Buffer` нулями.

При использовании [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize) для выделения новых экземпляров `Buffer`, выделения меньше, чем `Buffer.poolSize \>\>\> 1` (4 КБ при использовании размера пула по умолчанию), вырезаются из одного предварительно выделенного `Buffer`. Это позволяет приложениям избежать издержек сборки мусора при создании множества индивидуально выделенных экземпляров `Buffer`. Этот подход улучшает как производительность, так и использование памяти, устраняя необходимость отслеживать и очищать такое количество отдельных объектов `ArrayBuffer`.

Однако, в случае, когда разработчику может потребоваться сохранить небольшой кусок памяти из пула на неопределенный период времени, может быть целесообразно создать непулированный экземпляр `Buffer` с использованием `Buffer.allocUnsafeSlow()`, а затем скопировать соответствующие биты.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Необходимо сохранить несколько небольших фрагментов памяти.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Выделение памяти для сохраняемых данных.
    const sb = Buffer.allocUnsafeSlow(10);

    // Копирование данных в новое выделение.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Необходимо сохранить несколько небольших фрагментов памяти.
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // Выделение памяти для сохраняемых данных.
    const sb = Buffer.allocUnsafeSlow(10);

    // Копирование данных в новое выделение.
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```
:::

Если `size` не является числом, будет выдано исключение `TypeError`.


### Статический метод: `Buffer.byteLength(string[, encoding])` {#static-method-bufferbytelengthstring-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v7.0.0 | Передача недопустимого ввода теперь вызовет ошибку. |
| v5.10.0 | Параметр `string` теперь может быть любым `TypedArray`, `DataView` или `ArrayBuffer`. |
| v0.1.90 | Добавлено в: v0.1.90 |
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) Значение, для которого нужно вычислить длину.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `string` является строкой, то это ее кодировка. **По умолчанию:** `'utf8'`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, содержащихся в `string`.

Возвращает длину строки в байтах при кодировании с использованием `encoding`. Это не то же самое, что [`String.prototype.length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length), которая не учитывает кодировку, используемую для преобразования строки в байты.

Для `'base64'`, `'base64url'` и `'hex'` эта функция предполагает допустимый ввод. Для строк, содержащих данные, закодированные не в base64/hex (например, пробелы), возвращаемое значение может быть больше длины `Buffer`, созданного из строки.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Выводит: ½ + ¼ = ¾: 9 символов, 12 байтов
```

```js [CJS]
const { Buffer } = require('node:buffer');

const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Выводит: ½ + ¼ = ¾: 9 символов, 12 байтов
```
:::

Когда `string` является `Buffer`/[`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)/[`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)/[`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)/ [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), возвращается длина в байтах, указанная в `.byteLength`.


### Статический метод: `Buffer.compare(buf1, buf2)` {#static-method-buffercomparebuf1-buf2}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Аргументы теперь могут быть `Uint8Array`. |
| v0.11.13 | Добавлено в: v0.11.13 |
:::

- `buf1` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- `buf2` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Либо `-1`, `0` или `1`, в зависимости от результата сравнения. Смотрите [`buf.compare()`](/ru/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend) для получения подробной информации.

Сравнивает `buf1` с `buf2`, обычно для сортировки массивов экземпляров `Buffer`. Это эквивалентно вызову [`buf1.compare(buf2)`](/ru/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Выводит: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Этот результат равен: [buf2, buf1].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Выводит: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (Этот результат равен: [buf2, buf1].)
```
:::

### Статический метод: `Buffer.concat(list[, totalLength])` {#static-method-bufferconcatlist-totallength}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Элементы `list` теперь могут быть `Uint8Array`. |
| v0.7.11 | Добавлено в: v0.7.11 |
:::

- `list` [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Список экземпляров `Buffer` или [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) для конкатенации.
- `totalLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Общая длина экземпляров `Buffer` в `list` после конкатенации.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Возвращает новый `Buffer`, который является результатом конкатенации всех экземпляров `Buffer` в `list`.

Если список не содержит элементов или `totalLength` равно 0, то возвращается новый `Buffer` нулевой длины.

Если `totalLength` не указана, она вычисляется на основе экземпляров `Buffer` в `list` путем сложения их длин.

Если `totalLength` указана, она приводится к беззнаковому целому числу. Если общая длина `Buffer` в `list` превышает `totalLength`, результат обрезается до `totalLength`. Если общая длина `Buffer` в `list` меньше `totalLength`, оставшееся пространство заполняется нулями.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Создает один `Buffer` из списка, состоящего из трех экземпляров `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Выводит: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Выводит: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Выводит: 42
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Создает один `Buffer` из списка, состоящего из трех экземпляров `Buffer`.

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// Выводит: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// Выводит: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// Выводит: 42
```
:::

`Buffer.concat()` также может использовать внутренний пул `Buffer`, как это делает [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Статический метод: `Buffer.copyBytesFrom(view[, offset[, length]])` {#static-method-buffercopybytesfromview-offset-length}

**Добавлено в: v19.8.0, v18.16.0**

- `view` [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) для копирования.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Начальное смещение в пределах `view`. **По умолчанию:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество элементов из `view` для копирования. **По умолчанию:** `view.length - offset`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Копирует базовую память `view` в новый `Buffer`.

```js [ESM]
const u16 = new Uint16Array([0, 0xffff]);
const buf = Buffer.copyBytesFrom(u16, 1, 1);
u16[1] = 0;
console.log(buf.length); // 2
console.log(buf[0]); // 255
console.log(buf[1]); // 255
```
### Статический метод: `Buffer.from(array)` {#static-method-bufferfromarray}

**Добавлено в: v5.10.0**

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Выделяет новый `Buffer`, используя `array` байтов в диапазоне `0` – `255`. Записи массива вне этого диапазона будут усечены, чтобы соответствовать ему.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Создает новый Buffer, содержащий байты UTF-8 строки 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Создает новый Buffer, содержащий байты UTF-8 строки 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```
:::

Если `array` является `Array`-подобным объектом (то есть, с свойством `length` типа `number`), он рассматривается как массив, если только он не является `Buffer` или `Uint8Array`. Это означает, что все другие варианты `TypedArray` рассматриваются как `Array`. Чтобы создать `Buffer` из байтов, поддерживающих `TypedArray`, используйте [`Buffer.copyBytesFrom()`](/ru/nodejs/api/buffer#static-method-buffercopybytesfromview-offset-length).

`TypeError` будет сгенерирована, если `array` не является `Array` или другим типом, подходящим для вариантов `Buffer.from()`.

`Buffer.from(array)` и [`Buffer.from(string)`](/ru/nodejs/api/buffer#static-method-bufferfromstring-encoding) также могут использовать внутренний пул `Buffer`, как и [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize).


### Статический метод: `Buffer.from(arrayBuffer[, byteOffset[, length]])` {#static-method-bufferfromarraybuffer-byteoffset-length}

**Добавлено в версии: v5.10.0**

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer), например, свойство `.buffer` объекта [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Индекс первого байта для отображения. **По умолчанию:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для отображения. **По умолчанию:** `arrayBuffer.byteLength - byteOffset`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Этот метод создаёт представление [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) без копирования базовой памяти. Например, при передаче ссылки на свойство `.buffer` экземпляра [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), вновь созданный `Buffer` будет использовать ту же выделенную память, что и базовый `ArrayBuffer` объекта [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Разделяет память с `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Выводит: <Buffer 88 13 a0 0f>

// Изменение исходного Uint16Array также изменяет Buffer.
arr[1] = 6000;

console.log(buf);
// Выводит: <Buffer 88 13 70 17>
```

```js [CJS]
const { Buffer } = require('node:buffer';

const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Разделяет память с `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Выводит: <Buffer 88 13 a0 0f>

// Изменение исходного Uint16Array также изменяет Buffer.
arr[1] = 6000;

console.log(buf);
// Выводит: <Buffer 88 13 70 17>
```
:::

Дополнительные аргументы `byteOffset` и `length` указывают диапазон памяти внутри `arrayBuffer`, который будет совместно использоваться `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Выводит: 2
```

```js [CJS]
const { Buffer } = require('node:buffer');

const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Выводит: 2
```
:::

Будет выброшена ошибка `TypeError`, если `arrayBuffer` не является [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) или [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) или другим типом, подходящим для вариантов `Buffer.from()`.

Важно помнить, что базовый `ArrayBuffer` может охватывать диапазон памяти, который выходит за границы представления `TypedArray`. Новый `Buffer`, созданный с использованием свойства `buffer` объекта `TypedArray`, может выходить за пределы диапазона `TypedArray`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 элемента
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 элемента
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Выводит: <Buffer 63 64 65 66>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrA = Uint8Array.from([0x63, 0x64, 0x65, 0x66]); // 4 элемента
const arrB = new Uint8Array(arrA.buffer, 1, 2); // 2 элемента
console.log(arrA.buffer === arrB.buffer); // true

const buf = Buffer.from(arrB.buffer);
console.log(buf);
// Выводит: <Buffer 63 64 65 66>
```
:::


### Статический метод: `Buffer.from(buffer)` {#static-method-bufferfrombuffer}

**Добавлено в версии: v5.10.0**

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Существующий `Buffer` или [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), из которого нужно скопировать данные.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Копирует переданные данные из `buffer` в новый экземпляр `Buffer`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```
:::

Будет выброшена ошибка `TypeError`, если `buffer` не является `Buffer` или другим типом, подходящим для вариантов `Buffer.from()`.

### Статический метод: `Buffer.from(object[, offsetOrEncoding[, length]])` {#static-method-bufferfromobject-offsetorencoding-length}

**Добавлено в версии: v8.2.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, поддерживающий `Symbol.toPrimitive` или `valueOf()`.
- `offsetOrEncoding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Смещение байтов или кодировка.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Длина.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Для объектов, чья функция `valueOf()` возвращает значение, не строго равное `object`, возвращает `Buffer.from(object.valueOf(), offsetOrEncoding, length)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from(new String('this is a test'));
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Для объектов, поддерживающих `Symbol.toPrimitive`, возвращает `Buffer.from(object[Symbol.toPrimitive]('string'), offsetOrEncoding)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

```js [CJS]
const { Buffer } = require('node:buffer');

class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
:::

Будет выброшена ошибка `TypeError`, если `object` не имеет упомянутых методов или не является другим типом, подходящим для вариантов `Buffer.from()`.


### Статический метод: `Buffer.from(string[, encoding])` {#static-method-bufferfromstring-encoding}

**Добавлено в версии: v5.10.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка для кодирования.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка `string`. **По умолчанию:** `'utf8'`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Создает новый `Buffer`, содержащий `string`. Параметр `encoding` определяет кодировку символов, которая будет использоваться при преобразовании `string` в байты.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Выводит: this is a tést
console.log(buf2.toString());
// Выводит: this is a tést
console.log(buf1.toString('latin1'));
// Выводит: this is a tÃ©st
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('this is a tést');
const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf1.toString());
// Выводит: this is a tést
console.log(buf2.toString());
// Выводит: this is a tést
console.log(buf1.toString('latin1'));
// Выводит: this is a tÃ©st
```
:::

`TypeError` будет выброшен, если `string` не является строкой или другим типом, подходящим для вариантов `Buffer.from()`.

[`Buffer.from(string)`](/ru/nodejs/api/buffer#static-method-bufferfromstring-encoding) также может использовать внутренний пул `Buffer`, как и [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize).

### Статический метод: `Buffer.isBuffer(obj)` {#static-method-bufferisbufferobj}

**Добавлено в версии: v0.1.101**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если `obj` является `Buffer`, `false` в противном случае.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```

```js [CJS]
const { Buffer } = require('node:buffer');

Buffer.isBuffer(Buffer.alloc(10)); // true
Buffer.isBuffer(Buffer.from('foo')); // true
Buffer.isBuffer('a string'); // false
Buffer.isBuffer([]); // false
Buffer.isBuffer(new Uint8Array(1024)); // false
```
:::


### Статический метод: `Buffer.isEncoding(encoding)` {#static-method-bufferisencodingencoding}

**Добавлено в: v0.9.1**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя кодировки символов для проверки.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если `encoding` является именем поддерживаемой кодировки символов, или `false` в противном случае.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

console.log(Buffer.isEncoding('utf8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```
:::

### Свойство класса: `Buffer.poolSize` {#class-property-bufferpoolsize}

**Добавлено в: v0.11.3**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `8192`

Это размер (в байтах) предварительно выделенных внутренних экземпляров `Buffer`, используемых для пулинга. Это значение можно изменить.

### `buf[index]` {#bufindex}

- `index` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Оператор индекса `[index]` можно использовать для получения и установки октета в позиции `index` в `buf`. Значения относятся к отдельным байтам, поэтому допустимый диапазон значений составляет от `0x00` до `0xFF` (шестнадцатеричный) или от `0` до `255` (десятичный).

Этот оператор наследуется от `Uint8Array`, поэтому его поведение при выходе за границы такое же, как и у `Uint8Array`. Другими словами, `buf[index]` возвращает `undefined`, когда `index` отрицательный или больше или равен `buf.length`, а `buf[index] = value` не изменяет буфер, если `index` отрицательный или `\>= buf.length`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Copy an ASCII string into a `Buffer` one byte at a time.
// (This only works for ASCII-only strings. In general, one should use
// `Buffer.from()` to perform this conversion.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Copy an ASCII string into a `Buffer` one byte at a time.
// (This only works for ASCII-only strings. In general, one should use
// `Buffer.from()` to perform this conversion.)

const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// Prints: Node.js
```
:::


### `buf.buffer` {#bufbuffer}

- [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Базовый объект `ArrayBuffer`, на основе которого создан этот объект `Buffer`.

Не гарантируется, что этот `ArrayBuffer` будет точно соответствовать исходному `Buffer`. Подробности см. в примечаниях к `buf.byteOffset`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

```js [CJS]
const { Buffer } = require('node:buffer');

const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```
:::

### `buf.byteOffset` {#bufbyteoffset}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение `byteOffset` базового объекта `ArrayBuffer` для `Buffer`.

При установке `byteOffset` в `Buffer.from(ArrayBuffer, byteOffset, length)` или иногда при выделении `Buffer` меньшего размера, чем `Buffer.poolSize`, буфер начинается не с нулевого смещения в базовом `ArrayBuffer`.

Это может вызвать проблемы при непосредственном доступе к базовому `ArrayBuffer` с помощью `buf.buffer`, поскольку другие части `ArrayBuffer` могут не иметь отношения к самому объекту `Buffer`.

Распространенная проблема при создании объекта `TypedArray`, который разделяет свою память с `Buffer`, заключается в том, что в этом случае необходимо правильно указать `byteOffset`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Create a buffer smaller than `Buffer.poolSize`.
const nodeBuffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// When casting the Node.js Buffer to an Int8Array, use the byteOffset
// to refer only to the part of `nodeBuffer.buffer` that contains the memory
// for `nodeBuffer`.
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```
:::


### `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` {#bufcomparetarget-targetstart-targetend-sourcestart-sourceend}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Параметр `target` теперь может быть `Uint8Array`. |
| v5.11.0 | Теперь поддерживаются дополнительные параметры для указания смещений. |
| v0.11.13 | Добавлено в: v0.11.13 |
:::

- `target` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `Buffer` или [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), с которым сравнивается `buf`.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение внутри `target`, с которого начинается сравнение. **По умолчанию:** `0`.
- `targetEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение внутри `target`, которым заканчивается сравнение (не включительно). **По умолчанию:** `target.length`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение внутри `buf`, с которого начинается сравнение. **По умолчанию:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение внутри `buf`, которым заканчивается сравнение (не включительно). **По умолчанию:** [`buf.length`](/ru/nodejs/api/buffer#buflength).
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Сравнивает `buf` с `target` и возвращает число, указывающее, идет ли `buf` до, после или является тем же самым, что и `target` в порядке сортировки. Сравнение основано на фактической последовательности байтов в каждом `Buffer`.

- `0` возвращается, если `target` совпадает с `buf`.
- `1` возвращается, если `target` должен идти *перед* `buf` при сортировке.
- `-1` возвращается, если `target` должен идти *после* `buf` при сортировке.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Выводит: 0
console.log(buf1.compare(buf2));
// Выводит: -1
console.log(buf1.compare(buf3));
// Выводит: -1
console.log(buf2.compare(buf1));
// Выводит: 1
console.log(buf2.compare(buf3));
// Выводит: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Выводит: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (Этот результат равен: [buf1, buf3, buf2].)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Выводит: 0
console.log(buf1.compare(buf2));
// Выводит: -1
console.log(buf1.compare(buf3));
// Выводит: -1
console.log(buf2.compare(buf1));
// Выводит: 1
console.log(buf2.compare(buf3));
// Выводит: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Выводит: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (Этот результат равен: [buf1, buf3, buf2].)
```
:::

Необязательные аргументы `targetStart`, `targetEnd`, `sourceStart` и `sourceEnd` можно использовать для ограничения сравнения конкретными диапазонами внутри `target` и `buf` соответственно.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Выводит: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Выводит: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Выводит: 1
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Выводит: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Выводит: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Выводит: 1
```
:::

[`ERR_OUT_OF_RANGE`](/ru/nodejs/api/errors#err_out_of_range) генерируется, если `targetStart < 0`, `sourceStart < 0`, `targetEnd > target.byteLength` или `sourceEnd > source.byteLength`.


### `buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])` {#bufcopytarget-targetstart-sourcestart-sourceend}

**Добавлено в: v0.1.90**

- `target` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `Buffer` или [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), в который нужно скопировать данные.
- `targetStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение внутри `target`, с которого начинается запись. **По умолчанию:** `0`.
- `sourceStart` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение внутри `buf`, с которого начинается копирование. **По умолчанию:** `0`.
- `sourceEnd` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение внутри `buf`, на котором следует остановить копирование (не включая). **По умолчанию:** [`buf.length`](/ru/nodejs/api/buffer#buflength).
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество скопированных байтов.

Копирует данные из области `buf` в область в `target`, даже если область памяти `target` перекрывается с `buf`.

[`TypedArray.prototype.set()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) выполняет ту же операцию и доступна для всех TypedArray, включая Node.js `Buffer`'ы, хотя принимает другие аргументы функции.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Создаем два экземпляра `Buffer`.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 - это десятичное ASCII значение для 'a'.
  buf1[i] = i + 97;
}

// Копируем байты `buf1` с 16 по 19 в `buf2`, начиная с байта 8 `buf2`.
buf1.copy(buf2, 8, 16, 20);
// Это эквивалентно:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Выводит: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Создаем два экземпляра `Buffer`.
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 - это десятичное ASCII значение для 'a'.
  buf1[i] = i + 97;
}

// Копируем байты `buf1` с 16 по 19 в `buf2`, начиная с байта 8 `buf2`.
buf1.copy(buf2, 8, 16, 20);
// Это эквивалентно:
// buf2.set(buf1.subarray(16, 20), 8);

console.log(buf2.toString('ascii', 0, 25));
// Выводит: !!!!!!!!qrst!!!!!!!!!!!!!
```
:::

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Создаем `Buffer` и копируем данные из одной области в перекрывающуюся область
// внутри одного и того же `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 - это десятичное ASCII значение для 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Выводит: efghijghijklmnopqrstuvwxyz
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Создаем `Buffer` и копируем данные из одной области в перекрывающуюся область
// внутри одного и того же `Buffer`.

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 - это десятичное ASCII значение для 'a'.
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// Выводит: efghijghijklmnopqrstuvwxyz
```
:::


### `buf.entries()` {#bufentries}

**Добавлено в версии: v1.1.0**

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Создает и возвращает [итератор](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) пар `[index, byte]` из содержимого `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Вывод всего содержимого `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Выводит:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Вывод всего содержимого `Buffer`.

const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Выводит:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```
:::

### `buf.equals(otherBuffer)` {#bufequalsotherbuffer}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Аргументы теперь могут быть `Uint8Array`. |
| v0.11.13 | Добавлено в версии: v0.11.13 |
:::

- `otherBuffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) `Buffer` или [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), с которым нужно сравнить `buf`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Возвращает `true`, если `buf` и `otherBuffer` содержат абсолютно одинаковые байты, иначе возвращает `false`. Эквивалентно [`buf.compare(otherBuffer) === 0`](/ru/nodejs/api/buffer#bufcomparetarget-targetstart-targetend-sourcestart-sourceend).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Выводит: true
console.log(buf1.equals(buf3));
// Выводит: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Выводит: true
console.log(buf1.equals(buf3));
// Выводит: false
```
:::


### `buf.fill(value[, offset[, end]][, encoding])` {#buffillvalue-offset-end-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.0.0 | Выбрасывает `ERR_OUT_OF_RANGE` вместо `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Отрицательные значения `end` вызывают ошибку `ERR_INDEX_OUT_OF_RANGE`. |
| v10.0.0 | Попытка заполнить буфер ненулевой длины буфером нулевой длины вызывает исключение. |
| v10.0.0 | Указание недопустимой строки для `value` вызывает исключение. |
| v5.7.0 | Теперь поддерживается параметр `encoding`. |
| v0.5.0 | Добавлено в версии: v0.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение, которым нужно заполнить `buf`. Пустое значение (string, Uint8Array, Buffer) приводится к `0`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом заполнения `buf`. **По умолчанию:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Где остановить заполнение `buf` (не включительно). **По умолчанию:** [`buf.length`](/ru/nodejs/api/buffer#buflength).
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка для `value`, если `value` является строкой. **По умолчанию:** `'utf8'`.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Ссылка на `buf`.

Заполняет `buf` указанным `value`. Если `offset` и `end` не указаны, будет заполнен весь `buf`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Заполнение `Buffer` ASCII-символом 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Выводит: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Заполнение буфера пустой строкой
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Выводит: <Buffer 00 00 00 00 00>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Заполнение `Buffer` ASCII-символом 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Выводит: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh

// Заполнение буфера пустой строкой
const c = Buffer.allocUnsafe(5).fill('');

console.log(c.fill(''));
// Выводит: <Buffer 00 00 00 00 00>
```
:::

`value` приводится к значению `uint32`, если это не строка, `Buffer` или целое число. Если полученное целое число больше `255` (десятичное), `buf` будет заполнен `value & 255`.

Если окончательная запись операции `fill()` приходится на многобайтовый символ, то записываются только те байты этого символа, которые помещаются в `buf`:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Заполнение `Buffer` символом, который занимает два байта в UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Выводит: <Buffer c8 a2 c8 a2 c8>
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Заполнение `Buffer` символом, который занимает два байта в UTF-8.

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// Выводит: <Buffer c8 a2 c8 a2 c8>
```
:::

Если `value` содержит недопустимые символы, оно усекается; если допустимых данных для заполнения не остается, выбрасывается исключение:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Выводит: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Выводит: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Выбрасывает исключение.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Выводит: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Выводит: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Выбрасывает исключение.
```
:::

### `buf.includes(value[, byteOffset][, encoding])` {#bufincludesvalue-byteoffset-encoding}

**Добавлено в версии: v5.3.0**

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Что искать.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Где начать поиск в `buf`. Если отрицательное, то смещение вычисляется от конца `buf`. **По умолчанию:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `value` является строкой, то это его кодировка. **По умолчанию:** `'utf8'`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если `value` был найден в `buf`, `false` в противном случае.

Эквивалентно [`buf.indexOf() !== -1`](/ru/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```
:::


### `buf.indexOf(value[, byteOffset][, encoding])` {#bufindexofvalue-byteoffset-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Теперь `value` может быть `Uint8Array`. |
| v5.7.0, v4.4.0 | При передаче `encoding` параметр `byteOffset` больше не требуется. |
| v1.5.0 | Добавлено в: v1.5.0 |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Что искать.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Где начать поиск в `buf`. Если отрицательное, то смещение рассчитывается от конца `buf`. **По умолчанию:** `0`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `value` является строкой, это кодировка, используемая для определения двоичного представления строки, которая будет искаться в `buf`. **По умолчанию:** `'utf8'`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Индекс первого вхождения `value` в `buf` или `-1`, если `buf` не содержит `value`.

Если `value` является:

- строкой, то `value` интерпретируется в соответствии с кодировкой символов в `encoding`.
- `Buffer` или [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), то `value` будет использоваться целиком. Для сравнения части `Buffer` используйте [`buf.subarray`](/ru/nodejs/api/buffer#bufsubarraystart-end).
- числом, то `value` будет интерпретироваться как беззнаковое 8-битное целое числовое значение между `0` и `255`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Выводит: 0
console.log(buf.indexOf('is'));
// Выводит: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Выводит: 8
console.log(buf.indexOf(97));
// Выводит: 8 (97 - это десятичное ASCII значение для 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Выводит: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Выводит: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Выводит: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Выводит: 6
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Выводит: 0
console.log(buf.indexOf('is'));
// Выводит: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Выводит: 8
console.log(buf.indexOf(97));
// Выводит: 8 (97 - это десятичное ASCII значение для 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Выводит: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Выводит: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Выводит: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Выводит: 6
```
:::

Если `value` не является строкой, числом или `Buffer`, этот метод выдаст ошибку `TypeError`. Если `value` является числом, оно будет приведено к допустимому значению байта, целое число между 0 и 255.

Если `byteOffset` не является числом, оно будет приведено к числу. Если результатом приведения является `NaN` или `0`, то будет выполнен поиск по всему буферу. Это поведение соответствует [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Передача значения, которое является числом, но не является допустимым байтом.
// Выводит: 2, эквивалентно поиску 99 или 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Передача byteOffset, который преобразуется в NaN или 0.
// Выводит: 1, поиск по всему буферу.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Передача значения, которое является числом, но не является допустимым байтом.
// Выводит: 2, эквивалентно поиску 99 или 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Передача byteOffset, который преобразуется в NaN или 0.
// Выводит: 1, поиск по всему буферу.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```
:::

Если `value` является пустой строкой или пустым `Buffer`, а `byteOffset` меньше `buf.length`, то будет возвращено значение `byteOffset`. Если `value` является пустым, а `byteOffset` не меньше `buf.length`, то будет возвращено значение `buf.length`.


### `buf.keys()` {#bufkeys}

**Added in: v1.1.0**

- Returns: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Создает и возвращает [итератор](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) ключей `buf` (индексов).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```
:::

### `buf.lastIndexOf(value[, byteOffset][, encoding])` {#buflastindexofvalue-byteoffset-encoding}

::: info [История]
| Версия  | Изменения                                                                           |
| :-------- | :----------------------------------------------------------------------------------- |
| v8.0.0  | Теперь `value` может быть `Uint8Array`.                                               |
| v6.0.0  | Добавлено в: v6.0.0                                                                  |
:::

- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Что искать.
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Где начать поиск в `buf`. Если отрицательное, то смещение вычисляется от конца `buf`. **По умолчанию:** `buf.length - 1`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если `value` является строкой, это кодировка, используемая для определения двоичного представления строки, которая будет найдена в `buf`. **По умолчанию:** `'utf8'`.
- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Индекс последнего вхождения `value` в `buf` или `-1`, если `buf` не содержит `value`.

Идентичен [`buf.indexOf()`](/ru/nodejs/api/buffer#bufindexofvalue-byteoffset-encoding), за исключением того, что находится последнее, а не первое вхождение `value`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```
:::

Если `value` не является строкой, числом или `Buffer`, этот метод выдаст ошибку `TypeError`. Если `value` является числом, оно будет приведено к допустимому значению байта, целое число от 0 до 255.

Если `byteOffset` не является числом, он будет приведен к числу. Любые аргументы, которые преобразуются в `NaN`, такие как `{}` или `undefined`, будут искать по всему буферу. Это поведение соответствует [`String.prototype.lastIndexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/lastIndexOf).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

```js [CJS]
const { Buffer } = require('node:buffer');

const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```
:::

Если `value` является пустой строкой или пустым `Buffer`, будет возвращен `byteOffset`.


### `buf.length` {#buflength}

**Добавлено в версии: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает количество байтов в `buf`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Создать `Buffer` и записать в него более короткую строку, используя UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Выводит: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Выводит: 1234
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Создать `Buffer` и записать в него более короткую строку, используя UTF-8.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Выводит: 1234

buf.write('some string', 0, 'utf8');

console.log(buf.length);
// Выводит: 1234
```
:::

### `buf.parent` {#bufparent}

**Устарело с версии: v8.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: используйте [`buf.buffer`](/ru/nodejs/api/buffer#bufbuffer) вместо этого.
:::

Свойство `buf.parent` является устаревшим псевдонимом для `buf.buffer`.

### `buf.readBigInt64BE([offset])` {#bufreadbigint64beoffset}

**Добавлено в версии: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять: `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Читает знаковое 64-битное целое число в формате big-endian из `buf` по указанному `offset`.

Целые числа, прочитанные из `Buffer`, интерпретируются как знаковые значения в дополнительном коде.

### `buf.readBigInt64LE([offset])` {#bufreadbigint64leoffset}

**Добавлено в версии: v12.0.0, v10.20.0**

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять: `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Читает знаковое 64-битное целое число в формате little-endian из `buf` по указанному `offset`.

Целые числа, прочитанные из `Buffer`, интерпретируются как знаковые значения в дополнительном коде.


### `buf.readBigUInt64BE([offset])` {#bufreadbiguint64beoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.10.0, v12.19.0 | Эта функция также доступна как `buf.readBigUint64BE()`. |
| v12.0.0, v10.20.0 | Добавлено в: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию: `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Считывает из `buf` беззнаковое 64-битное целое число в формате big-endian по указанному `offset`.

Эта функция также доступна под псевдонимом `readBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Выводит: 4294967295n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64BE(0));
// Выводит: 4294967295n
```
:::

### `buf.readBigUInt64LE([offset])` {#bufreadbiguint64leoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.10.0, v12.19.0 | Эта функция также доступна как `buf.readBigUint64LE()`. |
| v12.0.0, v10.20.0 | Добавлено в: v12.0.0, v10.20.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию: `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Считывает из `buf` беззнаковое 64-битное целое число в формате little-endian по указанному `offset`.

Эта функция также доступна под псевдонимом `readBigUint64LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Выводит: 18446744069414584320n
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);

console.log(buf.readBigUInt64LE(0));
// Выводит: 18446744069414584320n
```
:::


### `buf.readDoubleBE([offset])` {#bufreaddoublebeoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые необходимо пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Читает 64-битное число двойной точности с прямым порядком байтов из `buf` по указанному `offset`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Выводит: 8.20788039913184e-304
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE(0));
// Выводит: 8.20788039913184e-304
```
:::

### `buf.readDoubleLE([offset])` {#bufreaddoubleleoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые необходимо пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Читает 64-битное число двойной точности с обратным порядком байтов из `buf` по указанному `offset`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Выводит: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleLE(0));
// Выводит: 5.447603722011605e-270
console.log(buf.readDoubleLE(1));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::


### `buf.readFloatBE([offset])` {#bufreadfloatbeoffset}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Читает 32-битное число с плавающей точкой в формате big-endian из `buf` по указанному `offset`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Выводит: 2.387939260590663e-38
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE(0));
// Выводит: 2.387939260590663e-38
```
:::

### `buf.readFloatLE([offset])` {#bufreadfloatleoffset}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Читает 32-битное число с плавающей точкой в формате little-endian из `buf` по указанному `offset`.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Выводит: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatLE(0));
// Выводит: 1.539989614439558e-36
console.log(buf.readFloatLE(1));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::


### `buf.readInt8([offset])` {#bufreadint8offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.0 | Добавлено в: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 1`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Читает знаковое 8-битное целое число из `buf` по указанному `offset`.

Целые числа, считанные из `Buffer`, интерпретируются как знаковые значения в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Выводит: -1
console.log(buf.readInt8(1));
// Выводит: 5
console.log(buf.readInt8(2));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([-1, 5]);

console.log(buf.readInt8(0));
// Выводит: -1
console.log(buf.readInt8(1));
// Выводит: 5
console.log(buf.readInt8(2));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt16BE([offset])` {#bufreadint16beoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 2`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Читает знаковое 16-битное целое число в формате big-endian из `buf` по указанному `offset`.

Целые числа, считанные из `Buffer`, интерпретируются как знаковые значения в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Выводит: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16BE(0));
// Выводит: 5
```
:::


### `buf.readInt16LE([offset])` {#bufreadint16leoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 2`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает знаковое 16-битное целое число с прямым порядком байтов из `buf` по указанному `offset`.

Целые числа, считанные из `Buffer`, интерпретируются как знаковые значения в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Выводит: 1280
console.log(buf.readInt16LE(1));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 5]);

console.log(buf.readInt16LE(0));
// Выводит: 1280
console.log(buf.readInt16LE(1));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::

### `buf.readInt32BE([offset])` {#bufreadint32beoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает знаковое 32-битное целое число с обратным порядком байтов из `buf` по указанному `offset`.

Целые числа, считанные из `Buffer`, интерпретируются как знаковые значения в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Выводит: 5
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32BE(0));
// Выводит: 5
```
:::


### `buf.readInt32LE([offset])` {#bufreadint32leoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает знаковое, little-endian 32-битное целое число из `buf` по указанному `offset`.

Целые числа, считанные из `Buffer`, интерпретируются как signed значения в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Выводит: 83886080
console.log(buf.readInt32LE(1));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0, 0, 0, 5]);

console.log(buf.readInt32LE(0));
// Выводит: 83886080
console.log(buf.readInt32LE(1));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::

### `buf.readIntBE(offset, byteLength)` {#bufreadintbeoffset-bytelength}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения и `byteLength` к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для чтения. Должно удовлетворять условию `0 \< byteLength \<= 6`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает `byteLength` количество байтов из `buf` по указанному `offset` и интерпретирует результат как big-endian, signed значение в дополнительном коде, поддерживающее до 48 бит точности.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Выводит: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntBE(0, 6).toString(16));
// Выводит: 1234567890ab
console.log(buf.readIntBE(1, 6).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
console.log(buf.readIntBE(1, 0).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::


### `buf.readIntLE(offset, byteLength)` {#bufreadintleoffset-bytelength}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения и `byteLength` к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для пропуска перед началом чтения. Должно удовлетворять `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для чтения. Должно удовлетворять `0 \< byteLength \<= 6`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает `byteLength` байтов из `buf` по указанному `offset` и интерпретирует результат как little-endian, знаковое значение в дополнительном коде, поддерживающее точность до 48 бит.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Выводит: -546f87a9cbee
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readIntLE(0, 6).toString(16));
// Выводит: -546f87a9cbee
```
:::

### `buf.readUInt8([offset])` {#bufreaduint8offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.readUint8()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.0 | Добавлено в: v0.5.0 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для пропуска перед началом чтения. Должно удовлетворять `0 \<= offset \<= buf.length - 1`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает 8-битное целое число без знака из `buf` по указанному `offset`.

Эта функция также доступна под псевдонимом `readUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Выводит: 1
console.log(buf.readUInt8(1));
// Выводит: 254
console.log(buf.readUInt8(2));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([1, -2]);

console.log(buf.readUInt8(0));
// Выводит: 1
console.log(buf.readUInt8(1));
// Выводит: 254
console.log(buf.readUInt8(2));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt16BE([offset])` {#bufreaduint16beoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.readUint16BE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в версии: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 2`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Читает 16-битное целое число без знака в формате big-endian из `buf` по указанному `offset`.

Эта функция также доступна под псевдонимом `readUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Выводит: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Выводит: 3456
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16BE(0).toString(16));
// Выводит: 1234
console.log(buf.readUInt16BE(1).toString(16));
// Выводит: 3456
```
:::

### `buf.readUInt16LE([offset])` {#bufreaduint16leoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.readUint16LE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в версии: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - 2`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Читает 16-битное целое число без знака в формате little-endian из `buf` по указанному `offset`.

Эта функция также доступна под псевдонимом `readUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Выводит: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Выводит: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56]);

console.log(buf.readUInt16LE(0).toString(16));
// Выводит: 3412
console.log(buf.readUInt16LE(1).toString(16));
// Выводит: 5634
console.log(buf.readUInt16LE(2).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::


### `buf.readUInt32BE([offset])` {#bufreaduint32beoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.readUint32BE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает из `buf` 32-битное целое число без знака в формате big-endian, начиная с указанного `offset`.

Эта функция также доступна под псевдонимом `readUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Выводит: 12345678
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32BE(0).toString(16));
// Выводит: 12345678
```
:::

### `buf.readUInt32LE([offset])` {#bufreaduint32leoffset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.readUint32LE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом чтения. Должно удовлетворять `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает из `buf` 32-битное целое число без знака в формате little-endian, начиная с указанного `offset`.

Эта функция также доступна под псевдонимом `readUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Выводит: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);

console.log(buf.readUInt32LE(0).toString(16));
// Выводит: 78563412
console.log(buf.readUInt32LE(1).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::


### `buf.readUIntBE(offset, byteLength)` {#bufreaduintbeoffset-bytelength}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.readUintBE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение offset и `byteLength` к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для пропуска перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для чтения. Должно удовлетворять условию `0 \< byteLength \<= 6`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает `byteLength` байт из `buf` по указанному `offset` и интерпретирует результат как целое число без знака в формате big-endian, поддерживающее до 48 бит точности.

Эта функция также доступна под псевдонимом `readUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Выводит: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntBE(0, 6).toString(16));
// Выводит: 1234567890ab
console.log(buf.readUIntBE(1, 6).toString(16));
// Выбрасывает ERR_OUT_OF_RANGE.
```
:::

### `buf.readUIntLE(offset, byteLength)` {#bufreaduintleoffset-bytelength}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.readUintLE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение offset и `byteLength` к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для пропуска перед началом чтения. Должно удовлетворять условию `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для чтения. Должно удовлетворять условию `0 \< byteLength \<= 6`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Считывает `byteLength` байт из `buf` по указанному `offset` и интерпретирует результат как целое число без знака в формате little-endian, поддерживающее до 48 бит точности.

Эта функция также доступна под псевдонимом `readUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Выводит: ab9078563412
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);

console.log(buf.readUIntLE(0, 6).toString(16));
// Выводит: ab9078563412
```
:::


### `buf.subarray([start[, end]])` {#bufsubarraystart-end}

**Добавлено в: v3.0.0**

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Где начнется новый `Buffer`. **По умолчанию:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Где закончится новый `Buffer` (не включительно). **По умолчанию:** [`buf.length`](/ru/nodejs/api/buffer#buflength).
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Возвращает новый `Buffer`, который ссылается на ту же память, что и оригинал, но со смещением и усечением по индексам `start` и `end`.

Если указать `end` больше, чем [`buf.length`](/ru/nodejs/api/buffer#buflength), будет возвращен тот же результат, что и при `end`, равном [`buf.length`](/ru/nodejs/api/buffer#buflength).

Этот метод наследуется от [`TypedArray.prototype.subarray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray).

Изменение нового среза `Buffer` изменит память в исходном `Buffer`, поскольку выделенная память двух объектов перекрывается.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

// Создайте `Buffer` с ASCII-алфавитом, возьмите срез и измените один байт
// из исходного `Buffer`.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 — это десятичное ASCII-значение для 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Выводит: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Выводит: !bc
```

```js [CJS]
const { Buffer } = require('node:buffer');

// Создайте `Buffer` с ASCII-алфавитом, возьмите срез и измените один байт
// из исходного `Buffer`.

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 — это десятичное ASCII-значение для 'a'.
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// Выводит: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// Выводит: !bc
```
:::

Указание отрицательных индексов приводит к тому, что срез генерируется относительно конца `buf`, а не начала.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Выводит: buffe
// (Эквивалентно buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Выводит: buff
// (Эквивалентно buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Выводит: uff
// (Эквивалентно buf.subarray(1, 4).)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// Выводит: buffe
// (Эквивалентно buf.subarray(0, 5).)

console.log(buf.subarray(-6, -2).toString());
// Выводит: buff
// (Эквивалентно buf.subarray(0, 4).)

console.log(buf.subarray(-5, -2).toString());
// Выводит: uff
// (Эквивалентно buf.subarray(1, 4).)
```
:::


### `buf.slice([start[, end]])` {#bufslicestart-end}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.5.0, v16.15.0 | Метод buf.slice() устарел. |
| v7.0.0 | Все смещения теперь приводятся к целым числам перед выполнением каких-либо вычислений с ними. |
| v7.1.0, v6.9.2 | Приведение смещений к целым числам теперь правильно обрабатывает значения, выходящие за пределы 32-битного целого числа. |
| v0.3.0 | Добавлено в: v0.3.0 |
:::

- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Где начнется новый `Buffer`. **По умолчанию:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Где закончится новый `Buffer` (не включительно). **По умолчанию:** [`buf.length`](/ru/nodejs/api/buffer#buflength).
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`buf.subarray`](/ru/nodejs/api/buffer#bufsubarraystart-end) вместо этого.
:::

Возвращает новый `Buffer`, который ссылается на ту же память, что и оригинал, но со смещением и обрезкой по индексам `start` и `end`.

Этот метод не совместим с `Uint8Array.prototype.slice()`, который является суперклассом `Buffer`. Чтобы скопировать срез, используйте `Uint8Array.prototype.slice()`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Выводит: cuffer

console.log(buf.toString());
// Выводит: buffer

// При использовании buf.slice() исходный буфер изменяется.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Выводит: cuffer
console.log(buf.toString());
// Также выводит: cuffer (!)
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Выводит: cuffer

console.log(buf.toString());
// Выводит: buffer

// При использовании buf.slice() исходный буфер изменяется.
const notReallyCopiedBuf = buf.slice();
notReallyCopiedBuf[0]++;
console.log(notReallyCopiedBuf.toString());
// Выводит: cuffer
console.log(buf.toString());
// Также выводит: cuffer (!)
```
:::


### `buf.swap16()` {#bufswap16}

**Добавлено в: v5.10.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Ссылка на `buf`.

Интерпретирует `buf` как массив беззнаковых 16-битных целых чисел и меняет порядок байтов *на месте*. Выбрасывает [`ERR_INVALID_BUFFER_SIZE`](/ru/nodejs/api/errors#err-invalid-buffer-size), если [`buf.length`](/ru/nodejs/api/buffer#buflength) не кратно 2.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// Prints: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

Одним из удобных способов использования `buf.swap16()` является выполнение быстрого преобразования на месте между UTF-16 little-endian и UTF-16 big-endian:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // Convert to big-endian UTF-16 text.
```
:::

### `buf.swap32()` {#bufswap32}

**Добавлено в: v5.10.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Ссылка на `buf`.

Интерпретирует `buf` как массив беззнаковых 32-битных целых чисел и меняет порядок байтов *на месте*. Выбрасывает [`ERR_INVALID_BUFFER_SIZE`](/ru/nodejs/api/errors#err-invalid-buffer-size), если [`buf.length`](/ru/nodejs/api/buffer#buflength) не кратно 4.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap32();

console.log(buf1);
// Prints: <Buffer 04 03 02 01 08 07 06 05>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap32();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::


### `buf.swap64()` {#bufswap64}

**Добавлено в версии: v6.3.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Ссылка на `buf`.

Интерпретирует `buf` как массив 64-битных чисел и меняет порядок байтов *на месте*. Выбрасывает [`ERR_INVALID_BUFFER_SIZE`](/ru/nodejs/api/errors#err_invalid_buffer_size), если [`buf.length`](/ru/nodejs/api/buffer#buflength) не является кратным 8.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// Prints: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap64();

console.log(buf1);
// Prints: <Buffer 08 07 06 05 04 03 02 01>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap64();
// Throws ERR_INVALID_BUFFER_SIZE.
```
:::

### `buf.toJSON()` {#buftojson}

**Добавлено в версии: v0.9.2**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает JSON-представление `buf`. [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) неявно вызывает эту функцию при преобразовании экземпляра `Buffer` в строку.

`Buffer.from()` принимает объекты в формате, возвращаемом этим методом. В частности, `Buffer.from(buf.toJSON())` работает так же, как `Buffer.from(buf)`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// Prints: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// Prints: <Buffer 01 02 03 04 05>
```
:::


### `buf.toString([encoding[, start[, end]]])` {#buftostringencoding-start-end}

**Добавлено в: v0.1.90**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Символьная кодировка для использования. **По умолчанию:** `'utf8'`.
- `start` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение байта, с которого начинается декодирование. **По умолчанию:** `0`.
- `end` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Смещение байта, на котором заканчивается декодирование (не включительно). **По умолчанию:** [`buf.length`](/ru/nodejs/api/buffer#buflength).
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Декодирует `buf` в строку в соответствии с указанной символьной кодировкой в `encoding`. Параметры `start` и `end` могут быть переданы для декодирования только подмножества `buf`.

Если `encoding` имеет значение `'utf8'` и байтовая последовательность во входных данных не является допустимой UTF-8, то каждый недействительный байт заменяется символом замены `U+FFFD`.

Максимальная длина экземпляра строки (в кодовых единицах UTF-16) доступна как [`buffer.constants.MAX_STRING_LENGTH`](/ru/nodejs/api/buffer#bufferconstantsmax_string_length).



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 - это десятичное ASCII-значение для 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Выводит: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Выводит: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Выводит: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Выводит: té
console.log(buf2.toString(undefined, 0, 3));
// Выводит: té
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 - это десятичное ASCII-значение для 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// Выводит: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// Выводит: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Выводит: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Выводит: té
console.log(buf2.toString(undefined, 0, 3));
// Выводит: té
```
:::


### `buf.values()` {#bufvalues}

**Добавлено в: v1.1.0**

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Создает и возвращает [итератор](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) для значений `buf` (байтов). Эта функция вызывается автоматически, когда `Buffer` используется в операторе `for..of`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Выводит:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Выводит:
//   98
//   117
//   102
//   102
//   101
//   114
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Выводит:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Выводит:
//   98
//   117
//   102
//   102
//   101
//   114
```
:::

### `buf.write(string[, offset[, length]][, encoding])` {#bufwritestring-offset-length-encoding}

**Добавлено в: v0.1.90**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи `string`. **По умолчанию:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальное количество байтов для записи (количество записанных байтов не превысит `buf.length - offset`). **По умолчанию:** `buf.length - offset`.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка символов `string`. **По умолчанию:** `'utf8'`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество записанных байтов.

Записывает `string` в `buf` по смещению `offset` в соответствии с кодировкой символов в `encoding`. Параметр `length` - это количество байтов для записи. Если в `buf` недостаточно места для размещения всей строки, будет записана только часть `string`. Однако частично закодированные символы не будут записаны.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Выводит: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Выводит: 2 bytes : ab
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Выводит: 12 bytes: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Выводит: 2 bytes : ab
```
:::


### `buf.writeBigInt64BE(value[, offset])` {#bufwritebigint64bevalue-offset}

**Добавлено в: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять: `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` как big-endian.

`value` интерпретируется и записывается как целое число со знаком в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64BE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04 05 06 07 08>
```
:::

### `buf.writeBigInt64LE(value[, offset])` {#bufwritebigint64levalue-offset}

**Добавлено в: v12.0.0, v10.20.0**

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять: `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` как little-endian.

`value` интерпретируется и записывается как целое число со знаком в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigInt64LE(0x0102030405060708n, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05 04 03 02 01>
```
:::


### `buf.writeBigUInt64BE(value[, offset])` {#bufwritebiguint64bevalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.10.0, v12.19.0 | Эта функция также доступна как `buf.writeBigUint64BE()`. |
| v12.0.0, v10.20.0 | Добавлено в версии: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Число для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию: `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате big-endian.

Эта функция также доступна под псевдонимом `writeBigUint64BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64BE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de ca fa fe ca ce fa de>
```
:::

### `buf.writeBigUInt64LE(value[, offset])` {#bufwritebiguint64levalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.10.0, v12.19.0 | Эта функция также доступна как `buf.writeBigUint64LE()`. |
| v12.0.0, v10.20.0 | Добавлено в версии: v12.0.0, v10.20.0 |
:::

- `value` [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Число для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию: `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате little-endian.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeBigUInt64LE(0xdecafafecacefaden, 0);

console.log(buf);
// Prints: <Buffer de fa ce ca fe fa ca de>
```
:::

Эта функция также доступна под псевдонимом `writeBigUint64LE`.


### `buf.writeDoubleBE(value[, offset])` {#bufwritedoublebevalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате big-endian. `value` должно быть числом JavaScript. Поведение не определено, если `value` не является числом JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleBE(123.456, 0);

console.log(buf);
// Prints: <Buffer 40 5e dd 2f 1a 9f be 77>
```
:::

### `buf.writeDoubleLE(value[, offset])` {#bufwritedoublelevalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 8`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате little-endian. `value` должно быть числом JavaScript. Поведение не определено, если `value` не является числом JavaScript.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(8);

buf.writeDoubleLE(123.456, 0);

console.log(buf);
// Prints: <Buffer 77 be 9f 1a 2f dd 5e 40>
```
:::


### `buf.writeFloatBE(value[, offset])` {#bufwritefloatbevalue-offset}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые необходимо пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате big-endian. Поведение не определено, если `value` является чем-либо, кроме числа JavaScript.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatBE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer 4f 4a fe bb>
```
:::

### `buf.writeFloatLE(value[, offset])` {#bufwritefloatlevalue-offset}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `value` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые необходимо пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате little-endian. Поведение не определено, если `value` является чем-либо, кроме числа JavaScript.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeFloatLE(0xcafebabe, 0);

console.log(buf);
// Prints: <Buffer bb fe 4a 4f>
```
:::


### `buf.writeInt8(value[, offset])` {#bufwriteint8value-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.0 | Добавлено в версии: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое нужно записать в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 1`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset`. `value` должно быть допустимым целым числом со знаком, представленным 8 битами. Поведение не определено, если `value` не является целым числом со знаком, представленным 8 битами.

`value` интерпретируется и записывается как целое число со знаком в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Выводит: <Buffer 02 fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt8(2, 0);
buf.writeInt8(-2, 1);

console.log(buf);
// Выводит: <Buffer 02 fe>
```
:::

### `buf.writeInt16BE(value[, offset])` {#bufwriteint16bevalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в версии: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое нужно записать в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 2`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате big-endian. `value` должно быть допустимым целым числом со знаком, представленным 16 битами. Поведение не определено, если `value` не является целым числом со знаком, представленным 16 битами.

`value` интерпретируется и записывается как целое число со знаком в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Выводит: <Buffer 01 02>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16BE(0x0102, 0);

console.log(buf);
// Выводит: <Buffer 01 02>
```
:::


### `buf.writeInt16LE(value[, offset])` {#bufwriteint16levalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и больше нет неявного приведения смещения к `uint32`. |
| v0.5.5 | Добавлено в версии: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 2`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` как little-endian.  Значение `value` должно быть допустимым знаковым 16-битным целым числом. Поведение не определено, если `value` является чем-либо, кроме знакового 16-битного целого числа.

`value` интерпретируется и записывается как знаковое целое число с дополнением до двух.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(2);

buf.writeInt16LE(0x0304, 0);

console.log(buf);
// Prints: <Buffer 04 03>
```
:::

### `buf.writeInt32BE(value[, offset])` {#bufwriteint32bevalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и больше нет неявного приведения смещения к `uint32`. |
| v0.5.5 | Добавлено в версии: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` как big-endian. Значение `value` должно быть допустимым знаковым 32-битным целым числом. Поведение не определено, если `value` является чем-либо, кроме знакового 32-битного целого числа.

`value` интерпретируется и записывается как знаковое целое число с дополнением до двух.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32BE(0x01020304, 0);

console.log(buf);
// Prints: <Buffer 01 02 03 04>
```
:::


### `buf.writeInt32LE(value[, offset])` {#bufwriteint32levalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате little-endian. `value` должно быть допустимым целым числом со знаком длиной 32 бита. Поведение не определено, если `value` не является целым числом со знаком длиной 32 бита.

`value` интерпретируется и записывается как целое число со знаком в дополнительном коде.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeInt32LE(0x05060708, 0);

console.log(buf);
// Prints: <Buffer 08 07 06 05>
```
:::

### `buf.writeIntBE(value, offset, byteLength)` {#bufwriteintbevalue-offset-bytelength}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения и `byteLength` к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для записи. Должно удовлетворять условию `0 \< byteLength \<= 6`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `byteLength` байтов из `value` в `buf` по указанному `offset` в формате big-endian. Поддерживает до 48 бит точности. Поведение не определено, если `value` не является целым числом со знаком.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::


### `buf.writeIntLE(value, offset, byteLength)` {#bufwriteintlevalue-offset-bytelength}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Удалены `noAssert` и неявное приведение `offset` и `byteLength` к `uint32`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для записи. Должно удовлетворять условию `0 \< byteLength \<= 6`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `byteLength` байтов `value` в `buf` по указанному `offset` как little-endian. Поддерживает точность до 48 бит. Поведение не определено, если `value` не является знаковым целым числом.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Выводит: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Выводит: <Buffer ab 90 78 56 34 12>
```
:::

### `buf.writeUInt8(value[, offset])` {#bufwriteuint8value-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.writeUint8()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение `offset` к `uint32`. |
| v0.5.0 | Добавлено в: v0.5.0 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 1`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset`. `value` должно быть допустимым беззнаковым 8-битным целым числом. Поведение не определено, если `value` не является беззнаковым 8-битным целым числом.

Эта функция также доступна под псевдонимом `writeUint8`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Выводит: <Buffer 03 04 23 42>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt8(0x3, 0);
buf.writeUInt8(0x4, 1);
buf.writeUInt8(0x23, 2);
buf.writeUInt8(0x42, 3);

console.log(buf);
// Выводит: <Buffer 03 04 23 42>
```
:::


### `buf.writeUInt16BE(value[, offset])` {#bufwriteuint16bevalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.writeUint16BE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 2`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате big-endian. Значение `value` должно быть допустимым 16-битным целым числом без знака. Поведение не определено, если `value` не является 16-битным целым числом без знака.

Эта функция также доступна под псевдонимом `writeUint16BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Выводит: <Buffer de ad be ef>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16BE(0xdead, 0);
buf.writeUInt16BE(0xbeef, 2);

console.log(buf);
// Выводит: <Buffer de ad be ef>
```
:::

### `buf.writeUInt16LE(value[, offset])` {#bufwriteuint16levalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.writeUint16LE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 2`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате little-endian. Значение `value` должно быть допустимым 16-битным целым числом без знака. Поведение не определено, если `value` не является 16-битным целым числом без знака.

Эта функция также доступна под псевдонимом `writeUint16LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Выводит: <Buffer ad de ef be>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt16LE(0xdead, 0);
buf.writeUInt16LE(0xbeef, 2);

console.log(buf);
// Выводит: <Buffer ad de ef be>
```
:::


### `buf.writeUInt32BE(value[, offset])` {#bufwriteuint32bevalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.writeUint32BE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате big-endian. `value` должно быть допустимым 32-битным целым числом без знака. Поведение не определено, если `value` не является 32-битным целым числом без знака.

Эта функция также доступна под псевдонимом `writeUint32BE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Выводит: <Buffer fe ed fa ce>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32BE(0xfeedface, 0);

console.log(buf);
// Выводит: <Buffer fe ed fa ce>
```
:::

### `buf.writeUInt32LE(value[, offset])` {#bufwriteuint32levalue-offset}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.writeUint32LE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение смещения к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число для записи в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которые нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - 4`. **По умолчанию:** `0`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `value` в `buf` по указанному `offset` в формате little-endian. `value` должно быть допустимым 32-битным целым числом без знака. Поведение не определено, если `value` не является 32-битным целым числом без знака.

Эта функция также доступна под псевдонимом `writeUint32LE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Выводит: <Buffer ce fa ed fe>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(4);

buf.writeUInt32LE(0xfeedface, 0);

console.log(buf);
// Выводит: <Buffer ce fa ed fe>
```
:::


### `buf.writeUIntBE(value, offset, byteLength)` {#bufwriteuintbevalue-offset-bytelength}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.writeUintBE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение `offset` и `byteLength` к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которое нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для записи. Должно удовлетворять условию `0 \< byteLength \<= 6`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `byteLength` байтов `value` в `buf` по указанному `offset` как big-endian. Поддерживает до 48 бит точности. Поведение не определено, если `value` не является целым числом без знака.

Эта функция также доступна под псевдонимом `writeUintBE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntBE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer 12 34 56 78 90 ab>
```
:::

### `buf.writeUIntLE(value, offset, byteLength)` {#bufwriteuintlevalue-offset-bytelength}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.9.0, v12.19.0 | Эта функция также доступна как `buf.writeUintLE()`. |
| v10.0.0 | Удалены `noAssert` и неявное приведение `offset` и `byteLength` к `uint32`. |
| v0.5.5 | Добавлено в: v0.5.5 |
:::

- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Число, которое будет записано в `buf`.
- `offset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов, которое нужно пропустить перед началом записи. Должно удовлетворять условию `0 \<= offset \<= buf.length - byteLength`.
- `byteLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для записи. Должно удовлетворять условию `0 \< byteLength \<= 6`.
- Возвращает: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `offset` плюс количество записанных байтов.

Записывает `byteLength` байтов `value` в `buf` по указанному `offset` как little-endian. Поддерживает до 48 бит точности. Поведение не определено, если `value` не является целым числом без знака.

Эта функция также доступна под псевдонимом `writeUintLE`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```

```js [CJS]
const { Buffer } = require('node:buffer');

const buf = Buffer.allocUnsafe(6);

buf.writeUIntLE(0x1234567890ab, 0, 6);

console.log(buf);
// Prints: <Buffer ab 90 78 56 34 12>
```
:::


### `new Buffer(array)` {#new-bufferarray}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Вызов этого конструктора генерирует предупреждение об устаревании при запуске из кода за пределами каталога `node_modules`. |
| v7.2.1 | Вызов этого конструктора больше не генерирует предупреждение об устаревании. |
| v7.0.0 | Вызов этого конструктора теперь генерирует предупреждение об устаревании. |
| v6.0.0 | Устарело с версии: v6.0.0 |
:::

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: используйте [`Buffer.from(array)`](/ru/nodejs/api/buffer#static-method-bufferfromarray) вместо этого.
:::

- `array` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Массив байтов для копирования.

См. [`Buffer.from(array)`](/ru/nodejs/api/buffer#static-method-bufferfromarray).

### `new Buffer(arrayBuffer[, byteOffset[, length]])` {#new-bufferarraybuffer-byteoffset-length}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Вызов этого конструктора генерирует предупреждение об устаревании при запуске из кода за пределами каталога `node_modules`. |
| v7.2.1 | Вызов этого конструктора больше не генерирует предупреждение об устаревании. |
| v7.0.0 | Вызов этого конструктора теперь генерирует предупреждение об устаревании. |
| v6.0.0 | Параметры `byteOffset` и `length` теперь поддерживаются. |
| v6.0.0 | Устарело с версии: v6.0.0 |
| v3.0.0 | Добавлено в версии: v3.0.0 |
:::

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: используйте [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ru/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) вместо этого.
:::

- `arrayBuffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) или свойство `.buffer` объекта [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray).
- `byteOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Индекс первого байта для отображения. **По умолчанию:** `0`.
- `length` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество байтов для отображения. **По умолчанию:** `arrayBuffer.byteLength - byteOffset`.

См. [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ru/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length).


### `new Buffer(buffer)` {#new-bufferbuffer}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Вызов этого конструктора выдает предупреждение об устаревании при выполнении из кода вне каталога `node_modules`. |
| v7.2.1 | Вызов этого конструктора больше не выдает предупреждение об устаревании. |
| v7.0.0 | Вызов этого конструктора теперь выдает предупреждение об устаревании. |
| v6.0.0 | Устарело начиная с: v6.0.0 |
:::

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`Buffer.from(buffer)`](/ru/nodejs/api/buffer#static-method-bufferfrombuffer) вместо этого.
:::

- `buffer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Существующий `Buffer` или [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), из которого копируются данные.

См. [`Buffer.from(buffer)`](/ru/nodejs/api/buffer#static-method-bufferfrombuffer).

### `new Buffer(size)` {#new-buffersize}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Вызов этого конструктора выдает предупреждение об устаревании при выполнении из кода вне каталога `node_modules`. |
| v8.0.0 | `new Buffer(size)` по умолчанию будет возвращать память, заполненную нулями. |
| v7.2.1 | Вызов этого конструктора больше не выдает предупреждение об устаревании. |
| v7.0.0 | Вызов этого конструктора теперь выдает предупреждение об устаревании. |
| v6.0.0 | Устарело начиная с: v6.0.0 |
:::

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`Buffer.alloc()`](/ru/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) вместо этого (также см. [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize)).
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Желаемая длина нового `Buffer`.

См. [`Buffer.alloc()`](/ru/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) и [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize). Этот вариант конструктора эквивалентен [`Buffer.alloc()`](/ru/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding).


### `new Buffer(string[, encoding])` {#new-bufferstring-encoding}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Вызов этого конструктора выдаёт предупреждение об устаревании при запуске из кода вне каталога `node_modules`. |
| v7.2.1 | Вызов этого конструктора больше не выдаёт предупреждение об устаревании. |
| v7.0.0 | Вызов этого конструктора теперь выдаёт предупреждение об устаревании. |
| v6.0.0 | Устарело с версии: v6.0.0 |
:::

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`Buffer.from(string[, encoding])`](/ru/nodejs/api/buffer#static-method-bufferfromstring-encoding) вместо этого.
:::

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка для кодирования.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Кодировка `string`. **По умолчанию:** `'utf8'`.

См. [`Buffer.from(string[, encoding])`](/ru/nodejs/api/buffer#static-method-bufferfromstring-encoding).

## Класс: `File` {#class-file}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | Делает экземпляры File клонируемыми. |
| v20.0.0 | Больше не экспериментальный. |
| v19.2.0, v18.13.0 | Добавлено в: v19.2.0, v18.13.0 |
:::

- Расширяет: [\<Blob\>](/ru/nodejs/api/buffer#class-blob)

[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) предоставляет информацию о файлах.

### `new buffer.File(sources, fileName[, options])` {#new-bufferfilesources-filename-options}

**Добавлено в: v19.2.0, v18.13.0**

- `sources` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Blob[]\>](/ru/nodejs/api/buffer#class-blob) | [\<File[]\>](/ru/nodejs/api/buffer#class-file) Массив строк, [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer), [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [\<File\>](/ru/nodejs/api/buffer#class-file) или [\<Blob\>](/ru/nodejs/api/buffer#class-blob) объектов или любая комбинация таких объектов, которые будут храниться в `File`.
- `fileName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя файла.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `endings` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Одно из значений: `'transparent'` или `'native'`. Если установлено значение `'native'`, символы конца строки в исходных строковых частях будут преобразованы в символ конца строки, собственный для платформы, как указано в `require('node:os').EOL`.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Тип содержимого файла.
    - `lastModified` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Дата последнего изменения файла. **По умолчанию:** `Date.now()`.


### `file.name` {#filename}

**Добавлено в: v19.2.0, v18.13.0**

- Тип: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Имя `File`.

### `file.lastModified` {#filelastmodified}

**Добавлено в: v19.2.0, v18.13.0**

- Тип: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Дата последнего изменения `File`.

## API модуля `node:buffer` {#nodebuffer-module-apis}

Хотя объект `Buffer` доступен как глобальный, существуют дополнительные API, связанные с `Buffer`, которые доступны только через модуль `node:buffer`, доступ к которому осуществляется с помощью `require('node:buffer')`.

### `buffer.atob(data)` {#bufferatobdata}

**Добавлено в: v15.13.0, v14.17.0**

::: info [Стабильно: 3 - Устаревшее]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее. Используйте `Buffer.from(data, 'base64')` вместо этого.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Входная строка, закодированная в Base64.

Декодирует строку данных, закодированных в Base64, в байты и кодирует эти байты в строку, используя Latin-1 (ISO-8859-1).

`data` может быть любым значением JavaScript, которое можно привести к строке.

**Эта функция предоставляется только для совместимости с устаревшими API веб-платформы
и никогда не должна использоваться в новом коде, поскольку они используют строки для представления
двоичных данных и предшествуют появлению типизированных массивов в JavaScript.
Для кода, работающего с использованием API Node.js, преобразование между строками, закодированными в base64,
и двоичными данными следует выполнять с помощью <code>Buffer.from(str, 'base64')</code> и
<code>buf.toString('base64')</code>.**

### `buffer.btoa(data)` {#bufferbtoadata}

**Добавлено в: v15.13.0, v14.17.0**

::: info [Стабильно: 3 - Устаревшее]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее. Используйте `buf.toString('base64')` вместо этого.
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Строка ASCII (Latin1).

Декодирует строку в байты, используя Latin-1 (ISO-8859), и кодирует эти байты в строку, используя Base64.

`data` может быть любым значением JavaScript, которое можно привести к строке.

**Эта функция предоставляется только для совместимости с устаревшими API веб-платформы
и никогда не должна использоваться в новом коде, поскольку они используют строки для представления
двоичных данных и предшествуют появлению типизированных массивов в JavaScript.
Для кода, работающего с использованием API Node.js, преобразование между строками, закодированными в base64,
и двоичными данными следует выполнять с помощью <code>Buffer.from(str, 'base64')</code> и
<code>buf.toString('base64')</code>.**


### `buffer.isAscii(input)` {#bufferisasciiinput}

**Добавлено в: v19.6.0, v18.15.0**

- input [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Входные данные для проверки.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Эта функция возвращает `true`, если `input` содержит только допустимые данные в кодировке ASCII, включая случай, когда `input` пуст.

Вызывает исключение, если `input` является отсоединенным array buffer.

### `buffer.isUtf8(input)` {#bufferisutf8input}

**Добавлено в: v19.4.0, v18.14.0**

- input [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Входные данные для проверки.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Эта функция возвращает `true`, если `input` содержит только допустимые данные в кодировке UTF-8, включая случай, когда `input` пуст.

Вызывает исключение, если `input` является отсоединенным array buffer.

### `buffer.INSPECT_MAX_BYTES` {#bufferinspect_max_bytes}

**Добавлено в: v0.5.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **По умолчанию:** `50`

Возвращает максимальное количество байтов, которое будет возвращено при вызове `buf.inspect()`. Это может быть переопределено пользовательскими модулями. Смотрите [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options) для получения более подробной информации о поведении `buf.inspect()`.

### `buffer.kMaxLength` {#bufferkmaxlength}

**Добавлено в: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер, допустимый для одного экземпляра `Buffer`.

Псевдоним для [`buffer.constants.MAX_LENGTH`](/ru/nodejs/api/buffer#bufferconstantsmax_length).

### `buffer.kStringMaxLength` {#bufferkstringmaxlength}

**Добавлено в: v3.0.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальная длина, допустимая для одного экземпляра `string`.

Псевдоним для [`buffer.constants.MAX_STRING_LENGTH`](/ru/nodejs/api/buffer#bufferconstantsmax_string_length).


### `buffer.resolveObjectURL(id)` {#bufferresolveobjecturlid}

**Добавлено в: v16.7.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка URL `'blob:nodedata:...`, возвращенная предыдущим вызовом `URL.createObjectURL()`.
- Возвращает: [\<Blob\>](/ru/nodejs/api/buffer#class-blob)

Разрешает `'blob:nodedata:...'` связанный объект [\<Blob\>](/ru/nodejs/api/buffer#class-blob), зарегистрированный с использованием предыдущего вызова `URL.createObjectURL()`.

### `buffer.transcode(source, fromEnc, toEnc)` {#buffertranscodesource-fromenc-toenc}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Параметр `source` теперь может быть `Uint8Array`. |
| v7.1.0 | Добавлено в: v7.1.0 |
:::

- `source` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Экземпляр `Buffer` или `Uint8Array`.
- `fromEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Текущая кодировка.
- `toEnc` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Целевая кодировка.
- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Перекодирует заданный экземпляр `Buffer` или `Uint8Array` из одной кодировки символов в другую. Возвращает новый экземпляр `Buffer`.

Выдает исключение, если `fromEnc` или `toEnc` указывают недействительные кодировки символов или если преобразование из `fromEnc` в `toEnc` не разрешено.

Кодировки, поддерживаемые `buffer.transcode()`: `'ascii'`, `'utf8'`, `'utf16le'`, `'ucs2'`, `'latin1'` и `'binary'`.

В процессе транскодирования будут использоваться символы замены, если данная последовательность байтов не может быть адекватно представлена в целевой кодировке. Например:



::: code-group
```js [ESM]
import { Buffer, transcode } from 'node:buffer';

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

```js [CJS]
const { Buffer, transcode } = require('node:buffer');

const newBuf = transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```
:::

Поскольку символ евро (`€`) не может быть представлен в US-ASCII, он заменяется на `?` в транскодированном `Buffer`.


### Класс: `SlowBuffer` {#class-slowbuffer}

**Устарело, начиная с версии: v6.0.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: используйте [`Buffer.allocUnsafeSlow()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) вместо этого.
:::

См. [`Buffer.allocUnsafeSlow()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafeslowsize). Это никогда не было классом в том смысле, что конструктор всегда возвращал экземпляр `Buffer`, а не экземпляр `SlowBuffer`.

#### `new SlowBuffer(size)` {#new-slowbuffersize}

**Устарело, начиная с версии: v6.0.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: используйте [`Buffer.allocUnsafeSlow()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) вместо этого.
:::

- `size` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Желаемая длина нового `SlowBuffer`.

См. [`Buffer.allocUnsafeSlow()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### Константы Buffer {#buffer-constants}

**Добавлено в версии: v8.2.0**

#### `buffer.constants.MAX_LENGTH` {#bufferconstantsmax_length}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.0.0 | Значение изменено на 2<sup>32</sup> - 1 на 64-битных архитектурах. |
| v15.0.0 | Значение изменено на 2<sup>50</sup> на 64-битных архитектурах. |
| v14.0.0 | Значение изменено с 2<sup>31</sup> - 1 на 2<sup>32</sup> - 1 на 64-битных архитектурах. |
| v8.2.0 | Добавлено в версии: v8.2.0 |
:::

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер, разрешенный для одного экземпляра `Buffer`.

На 32-битных архитектурах это значение в настоящее время равно 2<sup>31</sup> - 1 (около 1 ГиБ).

На 64-битных архитектурах это значение в настоящее время равно 2<sup>32</sup> - 1 (около 8 ПиБ).

Отражает [`v8::TypedArray::kMaxLength`](https://v8.github.io/api/head/classv8_1_1TypedArray#a54a48f4373da0850663c4393d843b9b0) под капотом.

Это значение также доступно как [`buffer.kMaxLength`](/ru/nodejs/api/buffer#bufferkmaxlength).

#### `buffer.constants.MAX_STRING_LENGTH` {#bufferconstantsmax_string_length}

**Добавлено в версии: v8.2.0**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальная длина, разрешенная для одного экземпляра `string`.

Представляет наибольшую `length`, которую может иметь примитив `string`, считанную в кодовых единицах UTF-16.

Это значение может зависеть от используемого движка JS.


## `Buffer.from()`, `Buffer.alloc()` и `Buffer.allocUnsafe()` {#bufferfrom-bufferalloc-and-bufferallocunsafe}

В версиях Node.js до 6.0.0 экземпляры `Buffer` создавались с использованием функции-конструктора `Buffer`, которая выделяет возвращаемый `Buffer` по-разному в зависимости от предоставленных аргументов:

- Передача числа в качестве первого аргумента в `Buffer()` (например, `new Buffer(10)`) выделяет новый объект `Buffer` указанного размера. До Node.js 8.0.0 память, выделенная для таких экземпляров `Buffer`, *не инициализируется* и *может содержать конфиденциальные данные*. Такие экземпляры `Buffer` *должны* быть впоследствии инициализированы с использованием либо [`buf.fill(0)`](/ru/nodejs/api/buffer#buffillvalue-offset-end-encoding), либо путем записи во весь `Buffer` перед чтением данных из `Buffer`. Хотя такое поведение *преднамеренно* для повышения производительности, опыт разработки показал, что требуется более четкое различие между созданием быстрого, но неинициализированного `Buffer`, и созданием более медленного, но более безопасного `Buffer`. Начиная с Node.js 8.0.0, `Buffer(num)` и `new Buffer(num)` возвращают `Buffer` с инициализированной памятью.
- Передача строки, массива или `Buffer` в качестве первого аргумента копирует данные переданного объекта в `Buffer`.
- Передача [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) или [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) возвращает `Buffer`, который разделяет выделенную память с заданным array buffer.

Поскольку поведение `new Buffer()` различается в зависимости от типа первого аргумента, проблемы безопасности и надежности могут быть непреднамеренно внесены в приложения, если не выполняется проверка аргументов или инициализация `Buffer`.

Например, если злоумышленник может заставить приложение получить число там, где ожидается строка, приложение может вызвать `new Buffer(100)` вместо `new Buffer("100")`, что приведет к выделению 100-байтового буфера вместо выделения 3-байтового буфера с содержимым `"100"`. Это часто возможно с использованием вызовов JSON API. Поскольку JSON различает числовые и строковые типы, он позволяет вводить числа там, где наивно написанное приложение, которое недостаточно проверяет свои входные данные, может ожидать постоянного получения строки. До Node.js 8.0.0 100-байтовый буфер мог содержать произвольные существующие в памяти данные, поэтому мог использоваться для раскрытия секретов в памяти удаленному злоумышленнику. Начиная с Node.js 8.0.0 раскрытие памяти не может произойти, поскольку данные заполняются нулями. Однако все еще возможны другие атаки, такие как выделение сервером очень больших буферов, что приводит к снижению производительности или сбою из-за нехватки памяти.

Чтобы сделать создание экземпляров `Buffer` более надежным и менее подверженным ошибкам, различные формы конструктора `new Buffer()` были **устаревшими** и заменены отдельными методами `Buffer.from()`, [`Buffer.alloc()`](/ru/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) и [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize).

*Разработчики должны перенести все существующие использования конструкторов <code>new Buffer()</code>
в один из этих новых API.*

- [`Buffer.from(array)`](/ru/nodejs/api/buffer#static-method-bufferfromarray) возвращает новый `Buffer`, который *содержит копию* предоставленных октетов.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/ru/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) возвращает новый `Buffer`, который *разделяет ту же выделенную память*, что и заданный [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).
- [`Buffer.from(buffer)`](/ru/nodejs/api/buffer#static-method-bufferfrombuffer) возвращает новый `Buffer`, который *содержит копию* содержимого заданного `Buffer`.
- [`Buffer.from(string[, encoding])`](/ru/nodejs/api/buffer#static-method-bufferfromstring-encoding) возвращает новый `Buffer`, который *содержит копию* предоставленной строки.
- [`Buffer.alloc(size[, fill[, encoding]])`](/ru/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding) возвращает новый инициализированный `Buffer` указанного размера. Этот метод медленнее, чем [`Buffer.allocUnsafe(size)`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize), но гарантирует, что вновь созданные экземпляры `Buffer` никогда не содержат старые данные, которые потенциально могут быть конфиденциальными. `TypeError` будет выброшен, если `size` не является числом.
- [`Buffer.allocUnsafe(size)`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize) и [`Buffer.allocUnsafeSlow(size)`](/ru/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) каждый возвращает новый неинициализированный `Buffer` указанного `size`. Поскольку `Buffer` не инициализирован, выделенный сегмент памяти может содержать старые данные, которые потенциально могут быть конфиденциальными.

Экземпляры `Buffer`, возвращаемые [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.from(string)`](/ru/nodejs/api/buffer#static-method-bufferfromstring-encoding), [`Buffer.concat()`](/ru/nodejs/api/buffer#static-method-bufferconcatlist-totallength) и [`Buffer.from(array)`](/ru/nodejs/api/buffer#static-method-bufferfromarray) *могут* выделяться из общего внутреннего пула памяти, если `size` меньше или равно половине [`Buffer.poolSize`](/ru/nodejs/api/buffer#class-property-bufferpoolsize). Экземпляры, возвращаемые [`Buffer.allocUnsafeSlow()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) *никогда* не используют общий внутренний пул памяти.


### Параметр командной строки `--zero-fill-buffers` {#the---zero-fill-buffers-command-line-option}

**Добавлено в: v5.10.0**

Node.js можно запустить с использованием параметра командной строки `--zero-fill-buffers`, чтобы все вновь выделенные экземпляры `Buffer` по умолчанию заполнялись нулями при создании. Без этого параметра буферы, созданные с помощью [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize), [`Buffer.allocUnsafeSlow()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) и `new SlowBuffer(size)`, не заполняются нулями. Использование этого флага может оказать ощутимое негативное влияние на производительность. Используйте параметр `--zero-fill-buffers` только при необходимости, чтобы гарантировать, что вновь выделенные экземпляры `Buffer` не могут содержать старые данные, которые могут быть конфиденциальными.

```bash [BASH]
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```
### Что делает `Buffer.allocUnsafe()` и `Buffer.allocUnsafeSlow()` "небезопасными"? {#what-makes-bufferallocunsafe-and-bufferallocunsafeslow-"unsafe"?}

При вызове [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize) и [`Buffer.allocUnsafeSlow()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafeslowsize) выделенный сегмент памяти *не инициализируется* (он не обнуляется). Хотя такая конструкция значительно ускоряет выделение памяти, выделенный сегмент памяти может содержать старые данные, которые могут быть конфиденциальными. Использование `Buffer`, созданного с помощью [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize) без *полной* перезаписи памяти, может привести к утечке этих старых данных при чтении памяти `Buffer`.

Хотя использование [`Buffer.allocUnsafe()`](/ru/nodejs/api/buffer#static-method-bufferallocunsafesize) имеет явные преимущества в производительности, необходимо проявлять особую осторожность, чтобы избежать внесения уязвимостей в систему безопасности приложения.

