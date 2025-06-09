---
title: Документация Node.js - Punycode
description: Эта страница предоставляет подробную документацию по модулю Punycode в Node.js, который используется для кодирования и декодирования интернационализированных доменных имен.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Эта страница предоставляет подробную документацию по модулю Punycode в Node.js, который используется для кодирования и декодирования интернационализированных доменных имен.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Эта страница предоставляет подробную документацию по модулю Punycode в Node.js, который используется для кодирования и декодирования интернационализированных доменных имен.
---


# Punycode {#punycode}

**Устарело с версии: v7.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Устарело
:::

**Исходный код:** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**Версия модуля punycode, поставляемая в комплекте с Node.js, устаревает.** В будущей основной версии Node.js этот модуль будет удален. Пользователям, в настоящее время зависящим от модуля `punycode`, следует перейти на использование модуля [Punycode.js](https://github.com/bestiejs/punycode.js), предоставляемого пользователями. Для кодирования URL-адресов на основе punycode см. [`url.domainToASCII`](/ru/nodejs/api/url#urldomaintoasciidomain) или, в более общем плане, [WHATWG URL API](/ru/nodejs/api/url#the-whatwg-url-api).

Модуль `punycode` является связанной версией модуля [Punycode.js](https://github.com/bestiejs/punycode.js). Доступ к нему можно получить с помощью:

```js [ESM]
const punycode = require('node:punycode');
```
[Punycode](https://tools.ietf.org/html/rfc3492) — это схема кодирования символов, определенная в RFC 3492, которая в основном предназначена для использования в интернационализированных доменных именах. Поскольку имена хостов в URL-адресах ограничены только символами ASCII, доменные имена, содержащие символы, отличные от ASCII, должны быть преобразованы в ASCII с использованием схемы Punycode. Например, японский символ, который переводится на английское слово `'example'`, — это `'例'`. Интернационализированное доменное имя `'例.com'` (эквивалентно `'example.com'`) представлено Punycode как ASCII-строка `'xn--fsq.com'`.

Модуль `punycode` предоставляет простую реализацию стандарта Punycode.

Модуль `punycode` является сторонней зависимостью, используемой Node.js и предоставляемой разработчикам для удобства. Исправления или другие изменения в модуль должны быть направлены в проект [Punycode.js](https://github.com/bestiejs/punycode.js).

## `punycode.decode(string)` {#punycodedecodestring}

**Добавлено в версии: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `punycode.decode()` преобразует строку [Punycode](https://tools.ietf.org/html/rfc3492), состоящую только из символов ASCII, в эквивалентную строку кодовых точек Unicode.

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**Добавлено в: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `punycode.encode()` преобразует строку кодовых точек Unicode в строку [Punycode](https://tools.ietf.org/html/rfc3492) символов, состоящую только из ASCII.

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**Добавлено в: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `punycode.toASCII()` преобразует Unicode-строку, представляющую интернационализированное доменное имя, в [Punycode](https://tools.ietf.org/html/rfc3492). Будут преобразованы только не-ASCII части доменного имени. Вызов `punycode.toASCII()` для строки, которая уже содержит только ASCII-символы, не окажет никакого эффекта.

```js [ESM]
// кодирование доменных имен
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**Добавлено в: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `punycode.toUnicode()` преобразует строку, представляющую доменное имя, содержащее символы, закодированные [Punycode](https://tools.ietf.org/html/rfc3492), в Unicode. Будут преобразованы только части доменного имени, закодированные [Punycode](https://tools.ietf.org/html/rfc3492).

```js [ESM]
// декодирование доменных имен
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**Добавлено в: v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**Добавлено в: v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `punycode.ucs2.decode()` возвращает массив, содержащий числовые значения кодовых точек каждого символа Unicode в строке.

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// суррогатная пара для U+1D306 тетраграмма для центра:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**Добавлено в: v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Метод `punycode.ucs2.encode()` возвращает строку на основе массива числовых значений кодовых точек.

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**Добавлено в: v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает строку, идентифицирующую текущий номер версии [Punycode.js](https://github.com/bestiejs/punycode.js).

