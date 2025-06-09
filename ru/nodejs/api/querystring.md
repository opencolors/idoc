---
title: Документация Node.js - Строка запроса
description: Этот раздел документации Node.js подробно описывает модуль querystring, который предоставляет утилиты для анализа и форматирования строк запросов URL. Включает методы для экранирования и раскодирования специальных символов, обработки вложенных объектов и управления сериализацией строк запросов.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Строка запроса | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Этот раздел документации Node.js подробно описывает модуль querystring, который предоставляет утилиты для анализа и форматирования строк запросов URL. Включает методы для экранирования и раскодирования специальных символов, обработки вложенных объектов и управления сериализацией строк запросов.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Строка запроса | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Этот раздел документации Node.js подробно описывает модуль querystring, который предоставляет утилиты для анализа и форматирования строк запросов URL. Включает методы для экранирования и раскодирования специальных символов, обработки вложенных объектов и управления сериализацией строк запросов.
---


# Строка запроса {#query-string}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

Модуль `node:querystring` предоставляет утилиты для разбора и форматирования строк запроса URL. Он может быть доступен с помощью:

```js [ESM]
const querystring = require('node:querystring');
```
`querystring` работает быстрее, чем [\<URLSearchParams\>](/ru/nodejs/api/url#class-urlsearchparams), но не является стандартизованным API. Используйте [\<URLSearchParams\>](/ru/nodejs/api/url#class-urlsearchparams), когда производительность не критична или когда желательна совместимость с кодом браузера.

## `querystring.decode()` {#querystringdecode}

**Добавлено в: v0.1.99**

Функция `querystring.decode()` является псевдонимом для `querystring.parse()`.

## `querystring.encode()` {#querystringencode}

**Добавлено в: v0.1.99**

Функция `querystring.encode()` является псевдонимом для `querystring.stringify()`.

## `querystring.escape(str)` {#querystringescapestr}

**Добавлено в: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `querystring.escape()` выполняет URL percent-encoding для данной `str` таким образом, который оптимизирован для конкретных требований строк запроса URL.

Метод `querystring.escape()` используется `querystring.stringify()` и обычно не предполагается для непосредственного использования. Он экспортируется в основном для того, чтобы код приложения мог предоставить альтернативную реализацию percent-encoding, если это необходимо, путем присвоения `querystring.escape` альтернативной функции.

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.0.0 | Множественные пустые записи теперь анализируются правильно (например, `&=&=`). |
| v6.0.0 | Возвращаемый объект больше не наследуется от `Object.prototype`. |
| v6.0.0, v4.2.4 | Параметр `eq` теперь может иметь длину более `1`. |
| v0.1.25 | Добавлено в: v0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка запроса URL для разбора
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Подстрока, используемая для разделения пар ключ-значение в строке запроса. **По умолчанию:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). Подстрока, используемая для разделения ключей и значений в строке запроса. **По умолчанию:** `'='`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, используемая при декодировании percent-encoded символов в строке запроса. **По умолчанию:** `querystring.unescape()`.
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает максимальное количество ключей для разбора. Укажите `0`, чтобы удалить ограничения подсчета ключей. **По умолчанию:** `1000`.
  
 

Метод `querystring.parse()` анализирует строку запроса URL (`str`) в коллекцию пар ключ-значение.

Например, строка запроса `'foo=bar&abc=xyz&abc=123'` анализируется в:

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```
Объект, возвращаемый методом `querystring.parse()`, *не* прототипически наследуется от JavaScript `Object`. Это означает, что типичные методы `Object`, такие как `obj.toString()`, `obj.hasOwnProperty()` и другие, не определены и *не будут работать*.

По умолчанию предполагается, что percent-encoded символы в строке запроса используют кодировку UTF-8. Если используется альтернативная кодировка символов, необходимо указать альтернативный параметр `decodeURIComponent`:

```js [ESM]
// Предполагая, что функция gbkDecodeURIComponent уже существует...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**Добавлено в: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект для сериализации в строку запроса URL
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Подстрока, используемая для разделения пар "ключ-значение" в строке запроса. **По умолчанию:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). Подстрока, используемая для разделения ключей и значений в строке запроса. **По умолчанию:** `'='`.
- `options`
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, используемая для преобразования небезопасных для URL символов в процентное кодирование в строке запроса. **По умолчанию:** `querystring.escape()`.

Метод `querystring.stringify()` создает строку запроса URL из заданного `obj`, перебирая "собственные свойства" объекта.

Он сериализует следующие типы значений, переданных в `obj`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Числовые значения должны быть конечными. Любые другие входные значения будут принудительно преобразованы в пустые строки.

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Возвращает 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Возвращает 'foo:bar;baz:qux'
```

По умолчанию символы, требующие процентного кодирования в строке запроса, будут закодированы как UTF-8. Если требуется альтернативная кодировка, необходимо указать альтернативный параметр `encodeURIComponent`:

```js [ESM]
// Предполагая, что функция gbkEncodeURIComponent уже существует,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**Добавлено в: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `querystring.unescape()` выполняет декодирование символов URL, закодированных с использованием процентного кодирования, в заданной строке `str`.

Метод `querystring.unescape()` используется `querystring.parse()` и обычно не предназначен для непосредственного использования. Он экспортируется в основном для того, чтобы код приложения мог предоставить альтернативную реализацию декодирования, если это необходимо, путем присвоения `querystring.unescape` альтернативной функции.

По умолчанию метод `querystring.unescape()` попытается использовать встроенный в JavaScript метод `decodeURIComponent()` для декодирования. Если это не удастся, будет использован более безопасный эквивалент, который не выдает ошибку при неправильных URL-адресах.

