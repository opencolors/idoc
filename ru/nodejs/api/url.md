---
title: Модуль URL - Документация Node.js
description: Модуль URL в Node.js предоставляет утилиты для разрешения и анализа URL. Он поддерживает стандарт WHATWG URL и устаревший API urlObject, предлагая методы для работы с URL в обоих форматах.
head:
  - - meta
    - name: og:title
      content: Модуль URL - Документация Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль URL в Node.js предоставляет утилиты для разрешения и анализа URL. Он поддерживает стандарт WHATWG URL и устаревший API urlObject, предлагая методы для работы с URL в обоих форматах.
  - - meta
    - name: twitter:title
      content: Модуль URL - Документация Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль URL в Node.js предоставляет утилиты для разрешения и анализа URL. Он поддерживает стандарт WHATWG URL и устаревший API urlObject, предлагая методы для работы с URL в обоих форматах.
---


# URL {#url}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Stability: 2](/ru/nodejs/api/documentation#stability-index) - Стабильный
:::

**Исходный код:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

Модуль `node:url` предоставляет утилиты для разрешения и разбора URL. Доступ к нему можно получить с помощью:

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## URL-строки и URL-объекты {#url-strings-and-url-objects}

URL-строка - это структурированная строка, содержащая несколько значимых компонентов. При разборе возвращается URL-объект, содержащий свойства для каждого из этих компонентов.

Модуль `node:url` предоставляет два API для работы с URL: устаревший API, специфичный для Node.js, и более новый API, который реализует тот же [стандарт WHATWG URL](https://url.spec.whatwg.org/), который используется веб-браузерами.

Ниже приведено сравнение между WHATWG и устаревшими API. Над URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'` показаны свойства объекта, возвращаемого устаревшим `url.parse()`. Ниже приведены свойства объекта WHATWG `URL`.

Свойство `origin` WHATWG URL включает `protocol` и `host`, но не включает `username` или `password`.

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(Все пробелы в строке "" следует игнорировать. Они предназначены исключительно для форматирования.)
```
Разбор URL-строки с использованием WHATWG API:

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
Разбор URL-строки с использованием устаревшего API:

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::


### Конструирование URL из составных частей и получение построенной строки {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

Можно сконструировать WHATWG URL из составных частей, используя либо сеттеры свойств, либо строковый литерал шаблона:

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
Чтобы получить сконструированную URL-строку, используйте аксессор свойства `href`:

```js [ESM]
console.log(myURL.href);
```
## WHATWG URL API {#the-whatwg-url-api}

### Класс: `URL` {#class-url}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Класс теперь доступен в глобальном объекте. |
| v7.0.0, v6.13.0 | Добавлено в: v7.0.0, v6.13.0 |
:::

Совместимый с браузерами класс `URL`, реализованный в соответствии со стандартом WHATWG URL. [Примеры разобранных URL](https://url.spec.whatwg.org/#example-url-parsing) можно найти в самом стандарте. Класс `URL` также доступен в глобальном объекте.

В соответствии с браузерными соглашениями, все свойства объектов `URL` реализованы как геттеры и сеттеры в прототипе класса, а не как свойства данных в самом объекте. Таким образом, в отличие от [устаревших `urlObject`](/ru/nodejs/api/url#legacy-urlobject)s, использование ключевого слова `delete` для любых свойств объектов `URL` (например, `delete myURL.protocol`, `delete myURL.pathname` и т.д.) не имеет никакого эффекта, но по-прежнему будет возвращать `true`.

#### `new URL(input[, base])` {#new-urlinput-base}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0, v18.17.0 | Требование ICU удалено. |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Абсолютный или относительный входной URL для разбора. Если `input` является относительным, то `base` является обязательным. Если `input` является абсолютным, то `base` игнорируется. Если `input` не является строкой, он сначала [преобразуется в строку](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Базовый URL, относительно которого разрешается `input`, если он не является абсолютным. Если `base` не является строкой, он сначала [преобразуется в строку](https://tc39.es/ecma262/#sec-tostring).

Создает новый объект `URL` путем разбора `input` относительно `base`. Если `base` передается в виде строки, он будет разобран эквивалентно `new URL(base)`.

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
Конструктор URL доступен как свойство глобального объекта. Он также может быть импортирован из встроенного модуля url:



::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // Выводит 'true'.
```

```js [CJS]
console.log(URL === require('node:url').URL); // Выводит 'true'.
```
:::

`TypeError` будет выброшен, если `input` или `base` не являются допустимыми URL. Обратите внимание, что будут предприняты усилия для приведения заданных значений к строкам. Например:

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
Символы Unicode, появляющиеся в имени хоста `input`, будут автоматически преобразованы в ASCII с использованием алгоритма [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4).

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
В случаях, когда заранее неизвестно, является ли `input` абсолютным URL и предоставлен `base`, рекомендуется проверить, что `origin` объекта `URL` соответствует ожидаемому.

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и задает фрагмент URL.

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Выводит #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Выводит https://example.org/foo#baz
```
Недопустимые символы URL, включенные в значение, присвоенное свойству `hash`, [кодируются процентами](/ru/nodejs/api/url#percent-encoding-in-urls). Выбор символов для процентного кодирования может несколько отличаться от того, что выдали бы методы [`url.parse()`](/ru/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) и [`url.format()`](/ru/nodejs/api/url#urlformaturlobject).

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и задает часть URL, представляющую хост.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Выводит example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Выводит https://example.com:82/foo
```
Недопустимые значения хоста, присвоенные свойству `host`, игнорируются.

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и задает часть URL, представляющую имя хоста. Основное различие между `url.host` и `url.hostname` заключается в том, что `url.hostname` *не* включает порт.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Выводит example.org

// Установка имени хоста не меняет порт
myURL.hostname = 'example.com';
console.log(myURL.href);
// Выводит https://example.com:81/foo

// Используйте myURL.host, чтобы изменить имя хоста и порт
myURL.host = 'example.org:82';
console.log(myURL.href);
// Выводит https://example.org:82/foo
```
Недопустимые значения имени хоста, присвоенные свойству `hostname`, игнорируются.

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и задает сериализованный URL.

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Выводит https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Выводит https://example.com/bar
```
Получение значения свойства `href` эквивалентно вызову [`url.toString()`](/ru/nodejs/api/url#urltostring).

Присвоение этому свойству нового значения эквивалентно созданию нового объекта `URL` с использованием [`new URL(value)`](/ru/nodejs/api/url#new-urlinput-base). Каждое из свойств объекта `URL` будет изменено.

Если значение, присвоенное свойству `href`, не является допустимым URL, будет сгенерирована ошибка `TypeError`.


#### `url.origin` {#urlorigin}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Схема "gopher" больше не является специальной, и `url.origin` теперь возвращает `'null'` для нее. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает сериализацию источника URL только для чтения.

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Выводит https://example.org
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Выводит https://xn--g6w251d

console.log(idnURL.hostname);
// Выводит xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и устанавливает парольную часть URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// Выводит xyz

myURL.password = '123';
console.log(myURL.href);
// Выводит https://abc:/
```
Недопустимые символы URL, включенные в значение, присвоенное свойству `password`, [кодируются процентами](/ru/nodejs/api/url#percent-encoding-in-urls). Выбор символов для процентного кодирования может несколько отличаться от того, что методы [`url.parse()`](/ru/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) и [`url.format()`](/ru/nodejs/api/url#urlformaturlobject) могли бы произвести.

#### `url.pathname` {#urlpathname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и устанавливает часть пути URL.

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Выводит /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Выводит https://example.org/abcdef?123
```
Недопустимые символы URL, включенные в значение, присвоенное свойству `pathname`, [кодируются процентами](/ru/nodejs/api/url#percent-encoding-in-urls). Выбор символов для процентного кодирования может несколько отличаться от того, что методы [`url.parse()`](/ru/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) и [`url.format()`](/ru/nodejs/api/url#urlformaturlobject) могли бы произвести.


#### `url.port` {#urlport}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Схема "gopher" больше не является специальной. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает и устанавливает часть URL, содержащую порт.

Значение порта может быть числом или строкой, содержащей число в диапазоне от `0` до `65535` (включительно). Установка значения порта по умолчанию для `URL` объектов, учитывая заданный `protocol`, приведет к тому, что значение `port` станет пустой строкой (`''`).

Значение порта может быть пустой строкой, в этом случае порт зависит от протокола/схемы:

| протокол | порт |
| --- | --- |
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |

При присвоении значения порту, значение сначала будет преобразовано в строку с помощью `.toString()`.

Если эта строка недействительна, но начинается с числа, то ведущее число присваивается `port`. Если число находится за пределами указанного выше диапазона, оно игнорируется.

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Выводит 8888

// Порты по умолчанию автоматически преобразуются в пустую строку
// (Порт по умолчанию для протокола HTTPS - 443)
myURL.port = '443';
console.log(myURL.port);
// Выводит пустую строку
console.log(myURL.href);
// Выводит https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// Выводит 1234
console.log(myURL.href);
// Выводит https://example.org:1234/

// Полностью недействительные строки порта игнорируются
myURL.port = 'abcd';
console.log(myURL.port);
// Выводит 1234

// Ведущие числа рассматриваются как номер порта
myURL.port = '5678abcd';
console.log(myURL.port);
// Выводит 5678

// Нецелые числа усекаются
myURL.port = 1234.5678;
console.log(myURL.port);
// Выводит 1234

// Числа вне диапазона, которые не представлены в научной нотации
// будут проигнорированы.
myURL.port = 1e10; // 10000000000, будет проверено на соответствие диапазону, как описано ниже
console.log(myURL.port);
// Выводит 1234
```
Числа, содержащие десятичную точку, такие как числа с плавающей запятой или числа в научной нотации, не являются исключением из этого правила. Ведущие числа до десятичной точки будут установлены в качестве порта URL, при условии, что они действительны:

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// Выводит 4 (потому что это ведущее число в строке '4.567e21')
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает и устанавливает часть URL, содержащую протокол.

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Выводит https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Выводит ftp://example.org/
```
Недопустимые значения протокола URL, присвоенные свойству `protocol`, игнорируются.

##### Специальные схемы {#special-schemes}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.0.0 | Схема "gopher" больше не является специальной. |
:::

[Стандарт URL WHATWG](https://url.spec.whatwg.org/) считает несколько схем протоколов URL *специальными* с точки зрения того, как они анализируются и сериализуются. Когда URL анализируется с использованием одного из этих специальных протоколов, свойство `url.protocol` может быть изменено на другой специальный протокол, но не может быть изменено на неспециальный протокол, и наоборот.

Например, переход с `http` на `https` работает:

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
Однако переход с `http` на гипотетический протокол `fish` не работает, потому что новый протокол не является специальным.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
Аналогично, переход с неспециального протокола на специальный также не разрешен:

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
Согласно стандарту URL WHATWG, специальными схемами протоколов являются `ftp`, `file`, `http`, `https`, `ws` и `wss`.

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает и устанавливает сериализованную часть запроса URL.

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Выводит ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Выводит https://example.org/abc?abc=xyz
```
Любые недопустимые символы URL, появляющиеся в значении, присвоенном свойству `search`, будут [percent-encoded](/ru/nodejs/api/url#percent-encoding-in-urls). Выбор символов для percent-encoding может несколько отличаться от того, что методы [`url.parse()`](/ru/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) и [`url.format()`](/ru/nodejs/api/url#urlformaturlobject) могли бы произвести.


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/ru/nodejs/api/url#class-urlsearchparams)

Получает объект [`URLSearchParams`](/ru/nodejs/api/url#class-urlsearchparams), представляющий параметры запроса URL. Это свойство доступно только для чтения, но объект `URLSearchParams`, который оно предоставляет, можно использовать для изменения экземпляра URL; чтобы заменить все параметры запроса URL, используйте сеттер [`url.search`](/ru/nodejs/api/url#urlsearch). Подробности смотрите в документации по [`URLSearchParams`](/ru/nodejs/api/url#class-urlsearchparams).

Будьте осторожны при использовании `.searchParams` для изменения `URL`, потому что, согласно спецификации WHATWG, объект `URLSearchParams` использует другие правила для определения того, какие символы подвергать percent-encoding. Например, объект `URL` не будет percent-encoding символ ASCII тильды (`~`), а `URLSearchParams` всегда будет его кодировать:

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // Выводит ?foo=~bar

// Измените URL через searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // Выводит ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Получает и устанавливает имя пользователя в URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// Выводит abc

myURL.username = '123';
console.log(myURL.href);
// Выводит https://123:/
```
Любые недопустимые символы URL, появляющиеся в значении, присвоенном свойству `username`, будут [percent-encoded](/ru/nodejs/api/url#percent-encoding-in-urls). Выбор символов для percent-encoding может несколько отличаться от того, что произвели бы методы [`url.parse()`](/ru/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) и [`url.format()`](/ru/nodejs/api/url#urlformaturlobject).

#### `url.toString()` {#urltostring}

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `toString()` объекта `URL` возвращает сериализованный URL. Возвращаемое значение эквивалентно значению [`url.href`](/ru/nodejs/api/url#urlhref) и [`url.toJSON()`](/ru/nodejs/api/url#urltojson).


#### `url.toJSON()` {#urltojson}

**Добавлено в: v7.7.0, v6.13.0**

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `toJSON()` объекта `URL` возвращает сериализованный URL. Возвращаемое значение эквивалентно [`url.href`](/ru/nodejs/api/url#urlhref) и [`url.toString()`](/ru/nodejs/api/url#urltostring).

Этот метод автоматически вызывается при сериализации объекта `URL` с помощью [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Выводит ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**Добавлено в: v16.7.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `blob` [\<Blob\>](/ru/nodejs/api/buffer#class-blob)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Создает URL-строку `'blob:nodedata:...'`, которая представляет данный объект [\<Blob\>](/ru/nodejs/api/buffer#class-blob) и может быть использована для последующего извлечения `Blob`.

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// позже...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
Данные, хранящиеся зарегистрированным [\<Blob\>](/ru/nodejs/api/buffer#class-blob), будут храниться в памяти до тех пор, пока не будет вызван `URL.revokeObjectURL()` для их удаления.

Объекты `Blob` регистрируются в текущем потоке. При использовании Worker Threads объекты `Blob`, зарегистрированные в одном Worker, не будут доступны другим Worker или основному потоку.

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**Добавлено в: v16.7.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL-строка `'blob:nodedata:...`, возвращенная предыдущим вызовом `URL.createObjectURL()`.

Удаляет сохраненный [\<Blob\>](/ru/nodejs/api/buffer#class-blob), идентифицированный по данному ID. Попытка отозвать ID, который не зарегистрирован, завершится без ошибок.


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**Добавлено в: v19.9.0, v18.17.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Абсолютный или относительный URL для анализа. Если `input` является относительным, то `base` обязателен. Если `input` является абсолютным, `base` игнорируется. Если `input` не является строкой, он сначала [преобразуется в строку](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Базовый URL для разрешения, если `input` не является абсолютным. Если `base` не является строкой, он сначала [преобразуется в строку](https://tc39.es/ecma262/#sec-tostring).
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Проверяет, может ли `input` относительно `base` быть проанализирован в `URL`.

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**Добавлено в: v22.1.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Абсолютный или относительный URL для анализа. Если `input` является относительным, то `base` обязателен. Если `input` является абсолютным, `base` игнорируется. Если `input` не является строкой, он сначала [преобразуется в строку](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Базовый URL для разрешения, если `input` не является абсолютным. Если `base` не является строкой, он сначала [преобразуется в строку](https://tc39.es/ecma262/#sec-tostring).
- Возвращает: [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Разбирает строку как URL. Если `base` указан, он будет использоваться в качестве базового URL для разрешения неабсолютных URL-адресов `input`. Возвращает `null`, если `input` недействителен.


### Класс: `URLSearchParams` {#class-urlsearchparams}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Класс теперь доступен в глобальном объекте. |
| v7.5.0, v6.13.0 | Добавлено в: v7.5.0, v6.13.0 |
:::

API `URLSearchParams` предоставляет доступ для чтения и записи к запросу `URL`. Класс `URLSearchParams` также можно использовать автономно с одним из четырех следующих конструкторов. Класс `URLSearchParams` также доступен в глобальном объекте.

Интерфейс WHATWG `URLSearchParams` и модуль [`querystring`](/ru/nodejs/api/querystring) имеют схожую цель, но цель модуля [`querystring`](/ru/nodejs/api/querystring) более общая, поскольку он позволяет настраивать символы-разделители (`&` и `=`). С другой стороны, этот API разработан исключительно для строк запроса URL.

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// Выводит 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// Выводит https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// Выводит https://example.org/?a=b

const newSearchParams = new URLSearchParams(myURL.searchParams);
// Вышеизложенное эквивалентно
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// Выводит https://example.org/?a=b
console.log(newSearchParams.toString());
// Выводит a=b&a=c

// newSearchParams.toString() вызывается неявно
myURL.search = newSearchParams;
console.log(myURL.href);
// Выводит https://example.org/?a=b&a=c
newSearchParams.delete('a');
console.log(myURL.href);
// Выводит https://example.org/?a=b&a=c
```
#### `new URLSearchParams()` {#new-urlsearchparams}

Создает новый пустой объект `URLSearchParams`.

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка запроса

Разбирает `string` как строку запроса и использует ее для создания нового объекта `URLSearchParams`. Начальный `'?'`, если присутствует, игнорируется.

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// Выводит 'abc'
console.log(params.toString());
// Выводит 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// Выводит 'user=abc&query=xyz'
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**Добавлено в: v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, представляющий собой коллекцию пар ключ-значение

Создаёт новый объект `URLSearchParams` с хэш-картой запроса. Ключ и значение каждого свойства `obj` всегда преобразуются в строки.

В отличие от модуля [`querystring`](/ru/nodejs/api/querystring), повторяющиеся ключи в форме значений массива не допускаются. Массивы преобразуются в строки с использованием [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString), которая просто объединяет все элементы массива запятыми.

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// Выводит [ 'first,second' ]
console.log(params.toString());
// Выводит 'user=abc&query=first%2Csecond'
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**Добавлено в: v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Итерируемый объект, элементы которого являются парами ключ-значение

Создаёт новый объект `URLSearchParams` с итерируемой картой аналогично конструктору [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). `iterable` может быть `Array` или любым итерируемым объектом. Это означает, что `iterable` может быть другим `URLSearchParams`, и в этом случае конструктор просто создаст клон предоставленного `URLSearchParams`. Элементы `iterable` являются парами ключ-значение и сами могут быть любым итерируемым объектом.

Повторяющиеся ключи разрешены.

```js [ESM]
let params;

// Используем массив
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Выводит 'user=abc&query=first&query=second'

// Используем объект Map
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Выводит 'user=abc&query=xyz'

// Используем функцию-генератор
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Выводит 'user=abc&query=first&query=second'

// Каждая пара ключ-значение должна иметь ровно два элемента
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Выбрасывает TypeError [ERR_INVALID_TUPLE]:
//        Каждая пара запроса должна быть итерируемым кортежем [name, value]
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Добавляет новую пару "имя-значение" в строку запроса.

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.2.0, v18.18.0 | Добавлена поддержка необязательного аргумента `value`. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Если указано `value`, удаляет все пары "имя-значение", где имя равно `name`, а значение равно `value`.

Если `value` не указано, удаляет все пары "имя-значение", у которых имя равно `name`.

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Возвращает ES6 `Iterator` по каждой паре "имя-значение" в запросе. Каждый элемент итератора является JavaScript `Array`. Первый элемент `Array` — это `name`, второй элемент `Array` — это `value`.

Псевдоним для [`urlSearchParams[@@iterator]()`](/ru/nodejs/api/url#urlsearchparamssymboliterator).

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного обратного вызова в аргумент `fn` теперь вызывает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Вызывается для каждой пары "имя-значение" в запросе
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Используется в качестве значения `this` при вызове `fn`

Перебирает каждую пару "имя-значение" в запросе и вызывает заданную функцию.

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Выводит:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Строка или `null`, если нет пары имя-значение с заданным `name`.

Возвращает значение первой пары имя-значение, имя которой `name`. Если таких пар нет, возвращается `null`.

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает значения всех пар имя-значение, имя которых `name`. Если таких пар нет, возвращается пустой массив.

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.2.0, v18.18.0 | Добавлена поддержка необязательного аргумента `value`. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Проверяет, содержит ли объект `URLSearchParams` пару(ы) ключ-значение на основе `name` и необязательного аргумента `value`.

Если `value` предоставлено, возвращает `true`, когда существует пара имя-значение с тем же `name` и `value`.

Если `value` не предоставлено, возвращает `true`, если есть хотя бы одна пара имя-значение, имя которой `name`.

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- Returns: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Возвращает ES6 `Iterator` по именам каждой пары имя-значение.

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// Выводит:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Устанавливает значение в объекте `URLSearchParams`, связанное с `name`, равным `value`. Если существуют какие-либо ранее существовавшие пары имя-значение, имена которых являются `name`, устанавливает значение первой такой пары равным `value` и удаляет все остальные. Если нет, добавляет пару имя-значение в строку запроса.

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Выводит foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Выводит foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**Добавлено в: v19.8.0, v18.16.0**

Общее количество записей параметров.

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**Добавлено в: v7.7.0, v6.13.0**

Сортирует все существующие пары имя-значение на месте по их именам. Сортировка выполняется с использованием [устойчивого алгоритма сортировки](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability), поэтому относительный порядок между парами имя-значение с одинаковым именем сохраняется.

Этот метод можно использовать, в частности, для увеличения количества попаданий в кеш.

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Выводит query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает параметры поиска, сериализованные в виде строки, с символами, закодированными процентами, где это необходимо.

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Возвращает ES6 `Iterator` по значениям каждой пары имя-значение.


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- Возвращает: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Возвращает ES6 `Iterator` для каждой пары имя-значение в строке запроса. Каждый элемент итератора является JavaScript `Array`. Первый элемент `Array` - это `name`, второй элемент `Array` - это `value`.

Псевдоним для [`urlSearchParams.entries()`](/ru/nodejs/api/url#urlsearchparamsentries).

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Выводит:
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0, v18.17.0 | Требование ICU удалено. |
| v7.4.0, v6.13.0 | Добавлено в: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) ASCII сериализацию `domain`. Если `domain` является недействительным доменом, возвращается пустая строка.

Выполняет обратную операцию для [`url.domainToUnicode()`](/ru/nodejs/api/url#urldomaintounicodedomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Выводит xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Выводит xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Выводит пустую строку
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Выводит xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Выводит xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Выводит пустую строку
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.0.0, v18.17.0 | Требование ICU удалено. |
| v7.4.0, v6.13.0 | Добавлено в: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает Unicode сериализацию `domain`. Если `domain` является недействительным доменом, возвращается пустая строка.

Выполняет обратную операцию для [`url.domainToASCII()`](/ru/nodejs/api/url#urldomaintoasciidomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Выводит español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Выводит 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Выводит пустую строку
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Выводит español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Выводит 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Выводит пустую строку
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | Теперь аргумент `options` можно использовать для определения способа анализа аргумента `path`. |
| v10.12.0 | Добавлено в версии: v10.12.0 |
:::

- `url` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка URL-адреса файла или объект URL, который необходимо преобразовать в путь.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true`, если `path` должен быть возвращен как файловый путь Windows, `false` для posix и `undefined` для системного значения по умолчанию. **По умолчанию:** `undefined`.
  
 
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Полностью разрешенный платформо-зависимый файловый путь Node.js.

Эта функция обеспечивает правильное декодирование символов, закодированных в процентах, а также обеспечивает кроссплатформенную допустимую строку абсолютного пути.



::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // Неправильно: /C:/path/
fileURLToPath('file:///C:/path/');         // Правильно:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Неправильно: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Правильно:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Неправильно: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Правильно:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Неправильно: /hello%20world
fileURLToPath('file:///hello world');      // Правильно:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // Неправильно: /C:/path/
fileURLToPath('file:///C:/path/');         // Правильно:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Неправильно: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Правильно:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Неправильно: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Правильно:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Неправильно: /hello%20world
fileURLToPath('file:///hello world');      // Правильно:   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**Добавлено в: v7.6.0**

- `URL` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Объект [WHATWG URL](/ru/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если сериализованная строка URL должна включать имя пользователя и пароль, `false` в противном случае. **По умолчанию:** `true`.
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если сериализованная строка URL должна включать фрагмент, `false` в противном случае. **По умолчанию:** `true`.
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если сериализованная строка URL должна включать строку поиска, `false` в противном случае. **По умолчанию:** `true`.
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если символы Unicode, отображаемые в компоненте хоста строки URL, должны быть закодированы напрямую, а не в Punycode. **По умолчанию:** `false`.
  
 
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает настраиваемую сериализацию строкового представления URL объекта [WHATWG URL](/ru/nodejs/api/url#the-whatwg-url-api).

Объект URL имеет как метод `toString()`, так и свойство `href`, которые возвращают строковые сериализации URL. Однако они никак не настраиваются. Метод `url.format(URL[, options])` позволяет осуществлять базовую настройку вывода.

::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.1.0, v20.13.0 | Аргумент `options` теперь можно использовать для определения способа возврата значения `path`. |
| v10.12.0 | Добавлено в: v10.12.0 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь для преобразования в File URL.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true`, если `path` следует рассматривать как путь к файлу Windows, `false` для posix и `undefined` для системного значения по умолчанию. **По умолчанию:** `undefined`.


- Возвращает: [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Объект File URL.

Эта функция гарантирует, что `path` разрешается абсолютно и что управляющие символы URL-адреса правильно закодированы при преобразовании в File URL.

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // Неправильно: file:///foo#1
pathToFileURL('/foo#1');              // Правильно:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Неправильно: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Правильно:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // Неправильно: выбрасывает исключение (POSIX)
new URL(__filename);                  // Неправильно: C:\... (Windows)
pathToFileURL(__filename);            // Правильно:   file:///... (POSIX)
pathToFileURL(__filename);            // Правильно:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // Неправильно: file:///foo#1
pathToFileURL('/foo#1');              // Правильно:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Неправильно: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Правильно:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.9.0, v18.17.0 | Возвращаемый объект также будет содержать все собственные перечисляемые свойства аргумента `url`. |
| v15.7.0, v14.18.0 | Добавлено в: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Объект [WHATWG URL](/ru/nodejs/api/url#the-whatwg-url-api), который необходимо преобразовать в объект опций.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект опций
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Используемый протокол.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Доменное имя или IP-адрес сервера, на который отправляется запрос.
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Фрагмент URL.
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сериализованная часть запроса URL.
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Часть пути URL.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь запроса. Должен включать строку запроса, если таковая имеется. Например, `'/index.html?page=12'`. Исключение возникает, когда путь запроса содержит недопустимые символы. В настоящее время отклоняются только пробелы, но это может измениться в будущем.
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Сериализованный URL.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт удаленного сервера.
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Базовая аутентификация, т.е. `'user:password'` для вычисления заголовка авторизации.

Эта вспомогательная функция преобразует объект URL в обычный объект опций, как ожидается от API [`http.request()`](/ru/nodejs/api/http#httprequestoptions-callback) и [`https.request()`](/ru/nodejs/api/https#httpsrequestoptions-callback).

::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## Устаревший URL API {#legacy-url-api}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.13.0, v14.17.0 | Отмена устаревания. Статус изменен на "Устаревший". |
| v11.0.0 | Этот API устарел. |
:::

::: info [Stable: 3 - Устаревший]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильный: 3](/ru/nodejs/api/documentation#stability-index) - Устаревший: Используйте WHATWG URL API вместо этого.
:::

### Устаревший `urlObject` {#legacy-urlobject}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.13.0, v14.17.0 | Отмена устаревания. Статус изменен на "Устаревший". |
| v11.0.0 | Устаревший URL API устарел. Используйте WHATWG URL API. |
:::

::: info [Stable: 3 - Устаревший]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильный: 3](/ru/nodejs/api/documentation#stability-index) - Устаревший: Используйте WHATWG URL API вместо этого.
:::

Устаревший `urlObject` (`require('node:url').Url` или `import { Url } from 'node:url'`) создается и возвращается функцией `url.parse()`.

#### `urlObject.auth` {#urlobjectauth}

Свойство `auth` - это часть URL, содержащая имя пользователя и пароль, также известная как *userinfo*. Эта строковая подстрока следует за `protocol` и двойными слэшами (если они есть) и предшествует компоненту `host`, разделенному символом `@`. Строка представляет собой либо имя пользователя, либо имя пользователя и пароль, разделенные символом `:`.

Например: `'user:pass'`.

#### `urlObject.hash` {#urlobjecthash}

Свойство `hash` - это часть URL, представляющая идентификатор фрагмента, включая начальный символ `#`.

Например: `'#hash'`.

#### `urlObject.host` {#urlobjecthost}

Свойство `host` - это полная хост-часть URL в нижнем регистре, включая `port`, если он указан.

Например: `'sub.example.com:8080'`.

#### `urlObject.hostname` {#urlobjecthostname}

Свойство `hostname` - это часть имени хоста компонента `host` в нижнем регистре *без* включенного `port`.

Например: `'sub.example.com'`.

#### `urlObject.href` {#urlobjecthref}

Свойство `href` - это полная строка URL, проанализированная с преобразованием компонентов `protocol` и `host` в нижний регистр.

Например: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`.


#### `urlObject.path` {#urlobjectpath}

Свойство `path` представляет собой конкатенацию компонентов `pathname` и `search`.

Например: `'/p/a/t/h?query=string'`.

Декодирование `path` не выполняется.

#### `urlObject.pathname` {#urlobjectpathname}

Свойство `pathname` состоит из всего раздела пути URL. Это все, что следует за `host` (включая `port`) и находится перед началом компонентов `query` или `hash`, разделенных либо ASCII вопросительным знаком (`?`), либо символом решетки (`#`).

Например: `'/p/a/t/h'`.

Декодирование строки пути не выполняется.

#### `urlObject.port` {#urlobjectport}

Свойство `port` представляет собой числовую часть порта компонента `host`.

Например: `'8080'`.

#### `urlObject.protocol` {#urlobjectprotocol}

Свойство `protocol` идентифицирует схему протокола URL в нижнем регистре.

Например: `'http:'`.

#### `urlObject.query` {#urlobjectquery}

Свойство `query` является либо строкой запроса без ведущего ASCII вопросительного знака (`?`), либо объектом, возвращенным методом `parse()` модуля [`querystring`](/ru/nodejs/api/querystring). Является ли свойство `query` строкой или объектом, определяется аргументом `parseQueryString`, переданным в `url.parse()`.

Например: `'query=string'` или `{'query': 'string'}`.

Если возвращается в виде строки, декодирование строки запроса не выполняется. Если возвращается в виде объекта, декодируются и ключи, и значения.

#### `urlObject.search` {#urlobjectsearch}

Свойство `search` состоит из всей части "строки запроса" URL, включая ведущий ASCII вопросительный знак (`?`).

Например: `'?query=string'`.

Декодирование строки запроса не выполняется.

#### `urlObject.slashes` {#urlobjectslashes}

Свойство `slashes` является `boolean` со значением `true`, если после двоеточия в `protocol` требуются два ASCII символа прямой косой черты (`/`).

### `url.format(urlObject)` {#urlformaturlobject}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.0.0 | Теперь выбрасывает исключение `ERR_INVALID_URL`, когда преобразование Punycode имени хоста вносит изменения, которые могут привести к повторному анализу URL по-другому. |
| v15.13.0, v14.17.0 | Устаревание отменено. Статус изменен на "Legacy". |
| v11.0.0 | Legacy URL API устарел. Используйте WHATWG URL API. |
| v7.0.0 | URL-адреса со схемой `file:` теперь всегда будут использовать правильное количество слешей независимо от параметра `slashes`. Ложный параметр `slashes` без протокола теперь также всегда учитывается. |
| v0.1.25 | Добавлено в: v0.1.25 |
:::

::: info [Стабильно: 3 - Legacy]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Legacy: Вместо этого используйте WHATWG URL API.
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL-объект (возвращенный `url.parse()` или созданный другим способом). Если это строка, она преобразуется в объект путем передачи в `url.parse()`.

Метод `url.format()` возвращает отформатированную URL-строку, полученную из `urlObject`.

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
Если `urlObject` не является объектом или строкой, `url.format()` выбросит [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

Процесс форматирования работает следующим образом:

- Создается новая пустая строка `result`.
- Если `urlObject.protocol` является строкой, она добавляется как есть к `result`.
- В противном случае, если `urlObject.protocol` не является `undefined` и не является строкой, выбрасывается [`Error`](/ru/nodejs/api/errors#class-error).
- Для всех строковых значений `urlObject.protocol`, которые *не заканчиваются* символом ASCII двоеточия (`:`), к `result` будет добавлена литеральная строка `:`.
- Если выполняется одно из следующих условий, то к `result` будет добавлена литеральная строка `//`:
    - Свойство `urlObject.slashes` имеет значение true;
    - `urlObject.protocol` начинается с `http`, `https`, `ftp`, `gopher` или `file`;


- Если значение свойства `urlObject.auth` истинно, и либо `urlObject.host`, либо `urlObject.hostname` не являются `undefined`, значение `urlObject.auth` будет приведено к строке и добавлено к `result` с последующей литеральной строкой `@`.
- Если свойство `urlObject.host` имеет значение `undefined`, то:
    - Если `urlObject.hostname` является строкой, она добавляется к `result`.
    - В противном случае, если `urlObject.hostname` не является `undefined` и не является строкой, выбрасывается [`Error`](/ru/nodejs/api/errors#class-error).
    - Если значение свойства `urlObject.port` истинно, и `urlObject.hostname` не является `undefined`:
    - К `result` добавляется литеральная строка `:`, и
    - Значение `urlObject.port` приводится к строке и добавляется к `result`.




- В противном случае, если значение свойства `urlObject.host` истинно, значение `urlObject.host` приводится к строке и добавляется к `result`.
- Если свойство `urlObject.pathname` является строкой, которая не является пустой строкой:
    - Если `urlObject.pathname` *не начинается* с ASCII символа прямой косой черты (`/`), то к `result` добавляется литеральная строка `'/'`.
    - Значение `urlObject.pathname` добавляется к `result`.


- В противном случае, если `urlObject.pathname` не является `undefined` и не является строкой, выбрасывается [`Error`](/ru/nodejs/api/errors#class-error).
- Если свойство `urlObject.search` имеет значение `undefined`, а свойство `urlObject.query` является `Object`, к `result` добавляется литеральная строка `?`, за которой следует вывод вызова метода `stringify()` модуля [`querystring`](/ru/nodejs/api/querystring), передающего значение `urlObject.query`.
- В противном случае, если `urlObject.search` является строкой:
    - Если значение `urlObject.search` *не начинается* с ASCII вопросительного знака (`?`), к `result` добавляется литеральная строка `?`.
    - Значение `urlObject.search` добавляется к `result`.


- В противном случае, если `urlObject.search` не является `undefined` и не является строкой, выбрасывается [`Error`](/ru/nodejs/api/errors#class-error).
- Если свойство `urlObject.hash` является строкой:
    - Если значение `urlObject.hash` *не начинается* с ASCII символа решетки (`#`), к `result` добавляется литеральная строка `#`.
    - Значение `urlObject.hash` добавляется к `result`.


- В противном случае, если свойство `urlObject.hash` не является `undefined` и не является строкой, выбрасывается [`Error`](/ru/nodejs/api/errors#class-error).
- Возвращается `result`.


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0, v18.13.0 | Только документационное устаревание. |
| v15.13.0, v14.17.0 | Устаревание отменено. Статус изменен на "Устаревшее". |
| v11.14.0 | Свойство `pathname` возвращаемого объекта URL теперь `/`, когда нет пути и схема протокола `ws:` или `wss:`. |
| v11.0.0 | Legacy URL API устарел. Используйте WHATWG URL API. |
| v9.0.0 | Свойство `search` возвращаемого объекта URL теперь `null`, когда отсутствует строка запроса. |
| v0.1.25 | Добавлено в: v0.1.25 |
:::

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Вместо этого используйте WHATWG URL API.
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL-строка для разбора.
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, свойство `query` всегда будет установлено в объект, возвращаемый методом `parse()` модуля [`querystring`](/ru/nodejs/api/querystring). Если `false`, свойство `query` в возвращаемом объекте URL будет неразобранной, недекодированной строкой. **По умолчанию:** `false`.
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, первый токен после литеральной строки `//` и перед следующим `/` будет интерпретироваться как `host`. Например, для `//foo/bar` результатом будет `{host: 'foo', pathname: '/bar'}`, а не `{pathname: '//foo/bar'}`. **По умолчанию:** `false`.

Метод `url.parse()` принимает URL-строку, анализирует ее и возвращает объект URL.

`TypeError` возникает, если `urlString` не является строкой.

`URIError` возникает, если свойство `auth` присутствует, но не может быть декодировано.

`url.parse()` использует мягкий, нестандартный алгоритм для анализа URL-строк. Он подвержен проблемам безопасности, таким как [спуфинг имени хоста](https://hackerone.com/reports/678487) и некорректная обработка имен пользователей и паролей. Не используйте с ненадежным вводом. CVE не выдаются для уязвимостей `url.parse()`. Вместо этого используйте [WHATWG URL](/ru/nodejs/api/url#the-whatwg-url-api) API.


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.13.0, v14.17.0 | Прекращение устаревания отменено. Статус изменен на "Устаревший". |
| v11.0.0 | Устаревший API URL устарел. Используйте WHATWG URL API. |
| v6.6.0 | Поля `auth` теперь остаются нетронутыми, когда `from` и `to` относятся к одному и тому же хосту. |
| v6.0.0 | Поля `auth` теперь очищаются, когда параметр `to` содержит имя хоста. |
| v6.5.0, v4.6.2 | Поле `port` теперь копируется правильно. |
| v0.1.25 | Добавлено в: v0.1.25 |
:::

::: info [Стабильно: 3 - Устаревшее]
[Стабильно: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее: Вместо этого используйте WHATWG URL API.
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Базовый URL для использования, если `to` является относительным URL.
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Целевой URL для разрешения.

Метод `url.resolve()` разрешает целевой URL относительно базового URL способом, аналогичным тому, как веб-браузер разрешает тег якоря.

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
Чтобы достичь того же результата с помощью WHATWG URL API:

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` это относительный URL.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## Процентное кодирование в URL-адресах {#percent-encoding-in-urls}

URL-адресам разрешено содержать только определенный диапазон символов. Любой символ, выходящий за пределы этого диапазона, должен быть закодирован. Как кодируются такие символы и какие символы кодировать, полностью зависит от того, где находится символ в структуре URL-адреса.


### Legacy API {#legacy-api}

В Legacy API пробелы (`' '`) и следующие символы будут автоматически экранированы в свойствах URL-объектов:

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
Например, символ ASCII пробела (`' '`) кодируется как `%20`. Символ ASCII прямой косой черты (`/`) кодируется как `%3C`.

### WHATWG API {#whatwg-api}

[Стандарт WHATWG URL](https://url.spec.whatwg.org/) использует более избирательный и детализированный подход к выбору кодируемых символов, чем в Legacy API.

Алгоритм WHATWG определяет четыре "набора для процентного кодирования", которые описывают диапазоны символов, которые должны быть процентно закодированы:

-  *Набор для процентного кодирования C0 control* включает кодовые точки в диапазоне от U+0000 до U+001F (включительно) и все кодовые точки больше, чем U+007E (~).
-  *Набор для процентного кодирования fragment* включает *набор для процентного кодирования C0 control* и кодовые точки U+0020 SPACE, U+0022 ("), U+003C (\<), U+003E (\>) и U+0060 (`).
-  *Набор для процентного кодирования path* включает *набор для процентного кодирования C0 control* и кодовые точки U+0020 SPACE, U+0022 ("), U+0023 (#), U+003C (\<), U+003E (\>), U+003F (?), U+0060 (`), U+007B ({) и U+007D (}).
-  *Набор для процентного кодирования userinfo* включает *набор для процентного кодирования path* и кодовые точки U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), от U+005B ([) до U+005E(^), и U+007C (|).

*Набор для процентного кодирования userinfo* используется исключительно для имен пользователей и паролей, закодированных внутри URL. *Набор для процентного кодирования path* используется для пути большинства URL. *Набор для процентного кодирования fragment* используется для фрагментов URL. *Набор для процентного кодирования C0 control* используется для хоста и пути при определенных конкретных условиях, в дополнение ко всем другим случаям.

Когда не-ASCII символы появляются в имени хоста, имя хоста кодируется с использованием алгоритма [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4). Обратите внимание, однако, что имя хоста *может* содержать *как* Punycode-кодированные, *так и* процентно-кодированные символы:

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

