---
title: Документация Node.js - Декодер строк
description: Модуль декодера строк предоставляет API для декодирования объектов Buffer в строки, оптимизированный для внутренней кодировки символов строк.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Декодер строк | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль декодера строк предоставляет API для декодирования объектов Buffer в строки, оптимизированный для внутренней кодировки символов строк.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Декодер строк | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль декодера строк предоставляет API для декодирования объектов Buffer в строки, оптимизированный для внутренней кодировки символов строк.
---


# Декодер строк {#string-decoder}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/string_decoder.js](https://github.com/nodejs/node/blob/v23.5.0/lib/string_decoder.js)

Модуль `node:string_decoder` предоставляет API для декодирования объектов `Buffer` в строки таким образом, чтобы сохранялись многобайтовые символы UTF-8 и UTF-16. Доступ к нему можно получить с помощью:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
```
:::

В следующем примере показано основное использование класса `StringDecoder`.

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

const cent = Buffer.from([0xC2, 0xA2]);
console.log(decoder.write(cent)); // Prints: ¢

const euro = Buffer.from([0xE2, 0x82, 0xAC]);
console.log(decoder.write(euro)); // Prints: €
```
:::

Когда экземпляр `Buffer` записывается в экземпляр `StringDecoder`, используется внутренний буфер, чтобы гарантировать, что декодированная строка не содержит неполных многобайтовых символов. Они удерживаются в буфере до следующего вызова `stringDecoder.write()` или до вызова `stringDecoder.end()`.

В следующем примере три байта символа европейской валюты евро (`€`), закодированные в UTF-8, записываются в течение трех отдельных операций:

::: code-group
```js [ESM]
import { StringDecoder } from 'node:string_decoder';
import { Buffer } from 'node:buffer';
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
```

```js [CJS]
const { StringDecoder } = require('node:string_decoder');
const decoder = new StringDecoder('utf8');

decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC]))); // Prints: €
```
:::


## Класс: `StringDecoder` {#class-stringdecoder}

### `new StringDecoder([encoding])` {#new-stringdecoderencoding}

**Добавлено в версии: v0.1.99**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Символьная [кодировка](/ru/nodejs/api/buffer#buffers-and-character-encodings), которую будет использовать `StringDecoder`. **По умолчанию:** `'utf8'`.

Создаёт новый экземпляр `StringDecoder`.

### `stringDecoder.end([buffer])` {#stringdecoderendbuffer}

**Добавлено в версии: v0.9.3**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Байты для декодирования.
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает любую оставшуюся входную информацию, хранящуюся во внутреннем буфере, в виде строки. Байты, представляющие неполные символы UTF-8 и UTF-16, будут заменены символами подстановки, подходящими для кодировки символов.

Если предоставлен аргумент `buffer`, выполняется один последний вызов `stringDecoder.write()` перед возвратом оставшегося ввода. После вызова `end()` объект `stringDecoder` можно повторно использовать для нового ввода.

### `stringDecoder.write(buffer)` {#stringdecoderwritebuffer}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Каждый недопустимый символ теперь заменяется одним символом замены вместо одного для каждого отдельного байта. |
| v0.1.99 | Добавлено в версии: v0.1.99 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Байты для декодирования.
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает декодированную строку, гарантируя, что все неполные многобайтовые символы в конце `Buffer`, `TypedArray` или `DataView` опущены из возвращаемой строки и сохранены во внутреннем буфере для следующего вызова `stringDecoder.write()` или `stringDecoder.end()`.

