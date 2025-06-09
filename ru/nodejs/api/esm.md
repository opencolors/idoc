---
title: ECMAScript модули в Node.js
description: Эта страница предоставляет подробную документацию о том, как использовать модули ECMAScript (ESM) в Node.js, включая разрешение модулей, синтаксис импорта и экспорта, а также совместимость с CommonJS.
head:
  - - meta
    - name: og:title
      content: ECMAScript модули в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Эта страница предоставляет подробную документацию о том, как использовать модули ECMAScript (ESM) в Node.js, включая разрешение модулей, синтаксис импорта и экспорта, а также совместимость с CommonJS.
  - - meta
    - name: twitter:title
      content: ECMAScript модули в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Эта страница предоставляет подробную документацию о том, как использовать модули ECMAScript (ESM) в Node.js, включая разрешение модулей, синтаксис импорта и экспорта, а также совместимость с CommonJS.
---


# Модули: Модули ECMAScript {#modules-ecmascript-modules}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.1.0 | Атрибуты импорта больше не являются экспериментальными. |
| v22.0.0 | Прекращена поддержка утверждений импорта. |
| v21.0.0, v20.10.0, v18.20.0 | Добавлена экспериментальная поддержка атрибутов импорта. |
| v20.0.0, v18.19.0 | Хуки настройки модулей выполняются вне основного потока. |
| v18.6.0, v16.17.0 | Добавлена поддержка цепочки хуков настройки модулей. |
| v17.1.0, v16.14.0 | Добавлена экспериментальная поддержка утверждений импорта. |
| v17.0.0, v16.12.0 | Объединены хуки настройки, удалены хуки `getFormat`, `getSource`, `transformSource` и `getGlobalPreloadCode`, добавлены хуки `load` и `globalPreload`, разрешен возврат `format` из хуков `resolve` или `load`. |
| v14.8.0 | Снята отметка экспериментальной возможности с Top-Level Await. |
| v15.3.0, v14.17.0, v12.22.0 | Стабилизирована реализация модулей. |
| v14.13.0, v12.20.0 | Поддержка обнаружения именованных экспортов CommonJS. |
| v14.0.0, v13.14.0, v12.20.0 | Удалено предупреждение об экспериментальных модулях. |
| v13.2.0, v12.17.0 | Загрузка модулей ECMAScript больше не требует флага командной строки. |
| v12.0.0 | Добавлена поддержка модулей ES, использующих расширение файла `.js` через поле `"type"` в `package.json`. |
| v8.5.0 | Добавлено в: v8.5.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

## Введение {#introduction}

Модули ECMAScript - это [официальный стандартный формат](https://tc39.github.io/ecma262/#sec-modules) для упаковки кода JavaScript для повторного использования. Модули определяются с использованием различных операторов [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) и [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).

В следующем примере модуля ES экспортируется функция:

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
В следующем примере модуля ES импортируется функция из `addTwo.mjs`:

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// Печатает: 6
console.log(addTwo(4));
```
Node.js полностью поддерживает модули ECMAScript в том виде, в котором они в настоящее время специфицированы, и обеспечивает взаимодействие между ними и исходным форматом модулей, [CommonJS](/ru/nodejs/api/modules).


## Включение {#enabling}

Node.js имеет две системы модулей: модули [CommonJS](/ru/nodejs/api/modules) и модули ECMAScript.

Авторы могут указать Node.js интерпретировать JavaScript как ES модуль с помощью расширения файла `.mjs`, поля [`"type"`](/ru/nodejs/api/packages#type) в `package.json` со значением `"module"` или флага [`--input-type`](/ru/nodejs/api/cli#--input-typetype) со значением `"module"`. Это явные маркеры того, что код предназначен для запуска в качестве ES модуля.

И наоборот, авторы могут явно указать Node.js интерпретировать JavaScript как CommonJS с помощью расширения файла `.cjs`, поля [`"type"`](/ru/nodejs/api/packages#type) в `package.json` со значением `"commonjs"` или флага [`--input-type`](/ru/nodejs/api/cli#--input-typetype) со значением `"commonjs"`.

Когда код не имеет явных маркеров для какой-либо системы модулей, Node.js проверит исходный код модуля на наличие синтаксиса ES модуля. Если такой синтаксис найден, Node.js запустит код как ES модуль; в противном случае он запустит модуль как CommonJS. Подробнее см. в разделе [Определение системы модулей](/ru/nodejs/api/packages#determining-module-system).

## Пакеты {#packages}

Этот раздел был перенесен в [Модули: Пакеты](/ru/nodejs/api/packages).

## Спецификаторы `import` {#import-specifiers}

### Терминология {#terminology}

*Спецификатор* оператора `import` - это строка после ключевого слова `from`, например, `'node:path'` в `import { sep } from 'node:path'`. Спецификаторы также используются в операторах `export from` и в качестве аргумента для выражения `import()`.

Существует три типа спецификаторов:

- *Относительные спецификаторы*, такие как `'./startup.js'` или `'../config.mjs'`. Они ссылаются на путь, относительный к местоположению импортирующего файла. *Расширение файла всегда необходимо для них.*
- *Голые спецификаторы*, такие как `'some-package'` или `'some-package/shuffle'`. Они могут ссылаться на основную точку входа пакета по имени пакета или на определенный модуль компонента внутри пакета, с префиксом имени пакета, как в примерах соответственно. *Включение расширения файла необходимо только для пакетов без поля <a href="packages.html#exports"><code>"exports"</code></a>.*
- *Абсолютные спецификаторы*, такие как `'file:///opt/nodejs/config.js'`. Они ссылаются непосредственно и явно на полный путь.

Разрешение голых спецификаторов обрабатывается [алгоритмом разрешения и загрузки модулей Node.js](/ru/nodejs/api/esm#resolution-algorithm-specification). Все остальные разрешения спецификаторов всегда разрешаются только со стандартной относительной [URL](https://url.spec.whatwg.org/) семантикой разрешения.

Как и в CommonJS, доступ к файлам модулей внутри пакетов можно получить, добавив путь к имени пакета, если только [`package.json`](/ru/nodejs/api/packages#nodejs-packagejson-field-definitions) пакета не содержит поле [`"exports"`](/ru/nodejs/api/packages#exports), в этом случае доступ к файлам внутри пакетов можно получить только через пути, определенные в [`"exports"`](/ru/nodejs/api/packages#exports).

Подробнее об этих правилах разрешения пакетов, которые применяются к голым спецификаторам в разрешении модулей Node.js, см. в [документации по пакетам](/ru/nodejs/api/packages).


### Обязательные расширения файлов {#mandatory-file-extensions}

При использовании ключевого слова `import` для разрешения относительных или абсолютных спецификаторов необходимо указать расширение файла. Индексы каталогов (например, `'./startup/index.js'`) также должны быть указаны полностью.

Это поведение соответствует тому, как `import` ведет себя в браузерных средах, при условии типично настроенного сервера.

### URL-адреса {#urls}

ES-модули разрешаются и кэшируются как URL-адреса. Это означает, что специальные символы должны быть [percent-encoded](/ru/nodejs/api/url#percent-encoding-in-urls), например `#` с `%23` и `?` с `%3F`.

Поддерживаются схемы URL `file:`, `node:` и `data:`. Спецификатор, например `'https://example.com/app.js'`, не поддерживается изначально в Node.js, если не используется [пользовательский HTTPS-загрузчик](/ru/nodejs/api/module#import-from-https).

#### `file:` URL-адреса {#file-urls}

Модули загружаются несколько раз, если спецификатор `import`, используемый для их разрешения, имеет другой запрос или фрагмент.

```js [ESM]
import './foo.mjs?query=1'; // загружает ./foo.mjs с запросом "?query=1"
import './foo.mjs?query=2'; // загружает ./foo.mjs с запросом "?query=2"
```

Корневой каталог тома можно указать через `/`, `//` или `file:///`. Учитывая различия между [URL](https://url.spec.whatwg.org/) и разрешением путей (например, детали процентного кодирования), рекомендуется использовать [url.pathToFileURL](/ru/nodejs/api/url#urlpathtofileurlpath-options) при импорте пути.

#### `data:` импорты {#data-imports}

**Добавлено в: v12.10.0**

[`data:` URL-адреса](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) поддерживаются для импорта со следующими типами MIME:

- `text/javascript` для ES-модулей
- `application/json` для JSON
- `application/wasm` для Wasm

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```

`data:` URL-адреса разрешают только [bare specifiers](/ru/nodejs/api/esm#terminology) для встроенных модулей и [absolute specifiers](/ru/nodejs/api/esm#terminology). Разрешение [relative specifiers](/ru/nodejs/api/esm#terminology) не работает, потому что `data:` не является [special scheme](https://url.spec.whatwg.org/#special-scheme). Например, попытка загрузить `./foo` из `data:text/javascript,import "./foo";` не может быть разрешена, потому что нет концепции относительного разрешения для `data:` URL-адресов.


#### `node:` imports {#node-imports}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0, v14.18.0 | Добавлена поддержка импорта `node:` в `require(...)`. |
| v14.13.1, v12.20.0 | Добавлено в: v14.13.1, v12.20.0 |
:::

URL-адреса `node:` поддерживаются в качестве альтернативного способа загрузки встроенных модулей Node.js. Эта схема URL-адресов позволяет ссылаться на встроенные модули по допустимым абсолютным строкам URL-адресов.

```js [ESM]
import fs from 'node:fs/promises';
```
## Атрибуты импорта {#import-attributes}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | Переход от утверждений импорта к атрибутам импорта. |
| v17.1.0, v16.14.0 | Добавлено в: v17.1.0, v16.14.0 |
:::

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

[Атрибуты импорта](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) - это встроенный синтаксис для операторов импорта модулей для передачи дополнительной информации вместе со спецификатором модуля.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js поддерживает только атрибут `type`, для которого он поддерживает следующие значения:

| Атрибут   `type` | Необходимо для |
| --- | --- |
| `'json'` | [JSON modules](/ru/nodejs/api/esm#json-modules) |
Атрибут `type: 'json'` является обязательным при импорте JSON-модулей.

## Встроенные модули {#built-in-modules}

[Встроенные модули](/ru/nodejs/api/modules#built-in-modules) предоставляют именованные экспорты своего общедоступного API. Также предоставляется экспорт по умолчанию, который является значением экспортов CommonJS. Экспорт по умолчанию можно использовать, среди прочего, для изменения именованных экспортов. Именованные экспорты встроенных модулей обновляются только при вызове [`module.syncBuiltinESMExports()`](/ru/nodejs/api/module#modulesyncbuiltinesmexports).

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## `import()` expressions {#import-expressions}

[Dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) поддерживается как в CommonJS, так и в ES-модулях. В CommonJS модулях он может быть использован для загрузки ES-модулей.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Мета-свойство `import.meta` является `Object`, который содержит следующие свойства. Оно поддерживается только в ES-модулях.

### `import.meta.dirname` {#importmetadirname}

**Добавлено в: v21.2.0, v20.11.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на релиз
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя каталога текущего модуля. Это то же самое, что и [`path.dirname()`](/ru/nodejs/api/path#pathdirnamepath) от [`import.meta.filename`](/ru/nodejs/api/esm#importmetafilename).

### `import.meta.filename` {#importmetafilename}

**Добавлено в: v21.2.0, v20.11.0**

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на релиз
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Полный абсолютный путь и имя файла текущего модуля с разрешенными символическими ссылками.
- Это то же самое, что и [`url.fileURLToPath()`](/ru/nodejs/api/url#urlfileurltopathurl-options) от [`import.meta.url`](/ru/nodejs/api/esm#importmetaurl).

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Абсолютный `file:` URL модуля.

Он определяется точно так же, как и в браузерах, предоставляя URL текущего файла модуля.

Это позволяет использовать полезные шаблоны, такие как относительная загрузка файлов:

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v20.6.0, v18.19.0 | Больше не скрыто за флагом CLI `--experimental-import-meta-resolve`, за исключением нестандартного параметра `parentURL`. |
| v20.6.0, v18.19.0 | Этот API больше не выдает исключение при нацеливании на `file:` URL-адреса, которые не соответствуют существующему файлу в локальной файловой системе. |
| v20.0.0, v18.19.0 | Этот API теперь возвращает строку синхронно вместо Promise. |
| v16.2.0, v14.18.0 | Добавлена поддержка объекта WHATWG `URL` для параметра `parentURL`. |
| v13.9.0, v12.16.2 | Добавлено в: v13.9.0, v12.16.2 |
:::

::: warning [Стабильность: 1 - Экспериментальная]
[Стабильность: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на релиз
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Спецификатор модуля для разрешения относительно текущего модуля.
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Абсолютная URL-строка, к которой будет разрешен спецификатор.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) - это функция разрешения, относящаяся к модулю, которая ограничена каждым модулем, возвращая URL-строку.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
Поддерживаются все возможности разрешения модулей Node.js. Разрешения зависимостей зависят от разрешенных разрешений экспорта внутри пакета.

**Предостережения**:

- Это может привести к синхронным операциям с файловой системой, что может повлиять на производительность аналогично `require.resolve`.
- Эта функция недоступна во пользовательских загрузчиках (это может создать взаимоблокировку).

**Нестандартный API**:

При использовании флага `--experimental-import-meta-resolve` эта функция принимает второй аргумент:

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ru/nodejs/api/url#the-whatwg-url-api) Необязательный абсолютный URL родительского модуля для разрешения. **По умолчанию:** `import.meta.url`


## Взаимодействие с CommonJS {#interoperability-with-commonjs}

### Операторы `import` {#import-statements}

Оператор `import` может ссылаться на модуль ES или модуль CommonJS. Операторы `import` разрешены только в модулях ES, но динамические выражения [`import()`](/ru/nodejs/api/esm#import-expressions) поддерживаются в CommonJS для загрузки модулей ES.

При импорте [модулей CommonJS](/ru/nodejs/api/esm#commonjs-namespaces) объект `module.exports` предоставляется в качестве экспорта по умолчанию. Именованные экспорты могут быть доступны, предоставляются статическим анализом для удобства и лучшей совместимости с экосистемой.

### `require` {#require}

Модуль CommonJS `require` в настоящее время поддерживает только загрузку синхронных модулей ES (то есть модулей ES, которые не используют `await` верхнего уровня).

Подробности см. в разделе [Загрузка модулей ECMAScript с помощью `require()`](/ru/nodejs/api/modules#loading-ecmascript-modules-using-require).

### Пространства имен CommonJS {#commonjs-namespaces}

::: info [История]
| Версия  | Изменения                                                       |
| :-------- | :---------------------------------------------------------------- |
| v23.0.0   | Добавлен маркер экспорта `'module.exports'` в пространства имен CJS. |
| v14.13.0 | Добавлено в: v14.13.0                                             |
:::

Модули CommonJS состоят из объекта `module.exports`, который может быть любого типа.

Для поддержки этого, при импорте CommonJS из модуля ECMAScript, создается обертка пространства имен для модуля CommonJS, которая всегда предоставляет ключ экспорта `default`, указывающий на значение `module.exports` CommonJS.

Кроме того, выполняется эвристический статический анализ исходного текста модуля CommonJS, чтобы получить наилучший статический список экспортов, предоставляемых в пространстве имен из значений в `module.exports`. Это необходимо, поскольку эти пространства имен должны быть построены до вычисления модуля CJS.

Эти объекты пространства имен CommonJS также предоставляют экспорт `default` как именованный экспорт `'module.exports'`, чтобы однозначно указать, что их представление в CommonJS использует это значение, а не значение пространства имен. Это отражает семантику обработки имени экспорта `'module.exports'` в поддержке взаимодействия [`require(esm)`](/ru/nodejs/api/modules#loading-ecmascript-modules-using-require).

При импорте модуля CommonJS его можно надежно импортировать, используя импорт по умолчанию модуля ES или соответствующий синтаксис sugar:

```js [ESM]
import { default as cjs } from 'cjs';
// Идентично указанному выше
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// Выводит:
//   <module.exports>
//   true
```

Этот экзотический объект пространства имен модуля можно наблюдать непосредственно при использовании `import * as m from 'cjs'` или динамического импорта:

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// Выводит:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```

Для лучшей совместимости с существующим использованием в экосистеме JS Node.js дополнительно пытается определить именованные экспорты CommonJS каждого импортированного модуля CommonJS, чтобы предоставить их в качестве отдельных экспортов модуля ES, используя процесс статического анализа.

Например, рассмотрим модуль CommonJS, написанный:

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```

Предыдущий модуль поддерживает именованные импорты в модулях ES:

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// Выводит: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// Выводит: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// Выводит:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```

Как видно из последнего примера протоколирования экзотического объекта пространства имен модуля, экспорт `name` копируется из объекта `module.exports` и устанавливается непосредственно в пространстве имен модуля ES при импорте модуля.

Обновления живых связываний или новые экспорты, добавленные в `module.exports`, не обнаруживаются для этих именованных экспортов.

Обнаружение именованных экспортов основано на общих синтаксических шаблонах, но не всегда правильно обнаруживает именованные экспорты. В этих случаях использование формы импорта по умолчанию, описанной выше, может быть лучшим вариантом.

Обнаружение именованных экспортов охватывает множество общих шаблонов экспорта, шаблонов реэкспорта и результатов работы инструментов сборки и транспиляторов. См. [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2) для точной реализованной семантики.


### Различия между модулями ES и CommonJS {#differences-between-es-modules-and-commonjs}

#### Отсутствие `require`, `exports` или `module.exports` {#no-require-exports-or-moduleexports}

В большинстве случаев `import` модуля ES можно использовать для загрузки модулей CommonJS.

При необходимости функцию `require` можно создать внутри модуля ES с помощью [`module.createRequire()`](/ru/nodejs/api/module#modulecreaterequirefilename).

#### Отсутствие `__filename` или `__dirname` {#no-__filename-or-__dirname}

Эти переменные CommonJS недоступны в модулях ES.

Сценарии использования `__filename` и `__dirname` можно воспроизвести с помощью [`import.meta.filename`](/ru/nodejs/api/esm#importmetafilename) и [`import.meta.dirname`](/ru/nodejs/api/esm#importmetadirname).

#### Отсутствие загрузки аддонов {#no-addon-loading}

[Аддоны](/ru/nodejs/api/addons) в настоящее время не поддерживаются при импорте модулей ES.

Вместо этого их можно загружать с помощью [`module.createRequire()`](/ru/nodejs/api/module#modulecreaterequirefilename) или [`process.dlopen`](/ru/nodejs/api/process#processdlopenmodule-filename-flags).

#### Отсутствие `require.resolve` {#no-requireresolve}

Относительное разрешение можно обработать с помощью `new URL('./local', import.meta.url)`.

Для полной замены `require.resolve` существует API [import.meta.resolve](/ru/nodejs/api/esm#importmetaresolvespecifier).

В качестве альтернативы можно использовать `module.createRequire()`.

#### Отсутствие `NODE_PATH` {#no-node_path}

`NODE_PATH` не является частью разрешения спецификаторов `import`. Пожалуйста, используйте символические ссылки, если такое поведение желательно.

#### Отсутствие `require.extensions` {#no-requireextensions}

`require.extensions` не используется `import`. Хуки настройки модулей могут предоставить замену.

#### Отсутствие `require.cache` {#no-requirecache}

`require.cache` не используется `import`, поскольку загрузчик модулей ES имеет свой собственный отдельный кэш.

## JSON-модули {#json-modules}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.1.0 | JSON-модули больше не являются экспериментальными. |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильный
:::

На JSON-файлы можно ссылаться через `import`:

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
Синтаксис `with { type: 'json' }` является обязательным; см. [Атрибуты импорта](/ru/nodejs/api/esm#import-attributes).

Импортированный JSON предоставляет только экспорт `default`. Поддержка именованных экспортов отсутствует. В кэше CommonJS создается запись кэша, чтобы избежать дублирования. Один и тот же объект возвращается в CommonJS, если JSON-модуль уже был импортирован из того же пути.


## Wasm модули {#wasm-modules}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Experimental
:::

Импорт модулей WebAssembly поддерживается с помощью флага `--experimental-wasm-modules`, позволяющего импортировать любые файлы `.wasm` как обычные модули, а также поддерживать их импорт модулей.

Эта интеграция соответствует [Предложению по интеграции модулей ES для WebAssembly](https://github.com/webassembly/esm-integration).

Например, файл `index.mjs`, содержащий:

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
выполненный с помощью:

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
предоставит интерфейс экспорта для инстанцирования `module.wasm`.

## `await` верхнего уровня {#top-level-await}

**Добавлено в: v14.8.0**

Ключевое слово `await` может использоваться в теле верхнего уровня модуля ECMAScript.

Предполагая, что у нас есть `a.mjs` с

```js [ESM]
export const five = await Promise.resolve(5);
```
И `b.mjs` с

```js [ESM]
import { five } from './a.mjs';

console.log(five); // Logs `5`
```
```bash [BASH]
node b.mjs # работает
```
Если выражение `await` верхнего уровня никогда не разрешается, процесс `node` завершится с [кодом состояния](/ru/nodejs/api/process#exit-codes) `13`.

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // Никогда не разрешающийся Promise:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // Logs `13`
});
```
## Загрузчики {#loaders}

Предыдущая документация по загрузчикам теперь находится в разделе [Модули: Хуки кастомизации](/ru/nodejs/api/module#customization-hooks).

## Алгоритм разрешения и загрузки {#resolution-and-loading-algorithm}

### Функции {#features}

Резолвер по умолчанию имеет следующие свойства:

- Разрешение на основе FileURL, как используется модулями ES
- Относительное и абсолютное разрешение URL
- Отсутствие расширений по умолчанию
- Отсутствие основных файлов в папках
- Поиск разрешения пакетов без спецификатора через node_modules
- Не завершается с ошибкой при неизвестных расширениях или протоколах
- Может опционально предоставить подсказку о формате для фазы загрузки

Загрузчик по умолчанию имеет следующие свойства:

- Поддержка загрузки встроенных модулей через URL-адреса `node:`
- Поддержка загрузки "встроенных" модулей через URL-адреса `data:`
- Поддержка загрузки модулей `file:`
- Завершается с ошибкой для любого другого протокола URL
- Завершается с ошибкой для неизвестных расширений для загрузки `file:` (поддерживает только `.cjs`, `.js` и `.mjs`)


### Алгоритм разрешения {#resolution-algorithm}

Алгоритм загрузки спецификатора ES-модуля задается с помощью метода **ESM_RESOLVE**, представленного ниже. Он возвращает разрешенный URL-адрес для спецификатора модуля относительно parentURL.

Алгоритм разрешения определяет полный разрешенный URL-адрес для загрузки модуля, а также предлагаемый формат модуля. Алгоритм разрешения не определяет, можно ли загрузить URL-адрес разрешенного протокола или разрешены ли расширения файлов. Вместо этого эти проверки применяются Node.js на этапе загрузки (например, если было запрошено загрузить URL-адрес, который имеет протокол, отличный от `file:`, `data:` или `node:`.)

Алгоритм также пытается определить формат файла на основе расширения (см. алгоритм **ESM_FILE_FORMAT** ниже). Если он не распознает расширение файла (например, если это не `.mjs`, `.cjs` или `.json`), то возвращается формат `undefined`, который вызовет ошибку на этапе загрузки.

Алгоритм определения формата модуля разрешенного URL-адреса предоставляется **ESM_FILE_FORMAT**, который возвращает уникальный формат модуля для любого файла. Формат *"module"* возвращается для модуля ECMAScript, в то время как формат *"commonjs"* используется для указания загрузки через устаревший загрузчик CommonJS. Дополнительные форматы, такие как *"addon"*, могут быть расширены в будущих обновлениях.

В следующих алгоритмах все ошибки подпрограмм распространяются как ошибки этих подпрограмм верхнего уровня, если не указано иное.

*defaultConditions* - это массив условных имен окружения, `["node", "import"]`.

Разрешитель может выдать следующие ошибки:

- *Invalid Module Specifier*: Спецификатор модуля является недопустимым URL-адресом, именем пакета или спецификатором подпути пакета.
- *Invalid Package Configuration*: Конфигурация package.json недействительна или содержит недопустимую конфигурацию.
- *Invalid Package Target*: Экспорты или импорты пакета определяют целевой модуль для пакета, который является недопустимым типом или строковым целевым объектом.
- *Package Path Not Exported*: Экспорты пакета не определяют и не разрешают целевой подпуть в пакете для данного модуля.
- *Package Import Not Defined*: Импорты пакета не определяют спецификатор.
- *Module Not Found*: Запрошенный пакет или модуль не существует.
- *Unsupported Directory Import*: Разрешенный путь соответствует каталогу, который не является поддерживаемой целью для импорта модулей.


### Спецификация алгоритма разрешения {#resolution-algorithm-specification}

**ESM_RESOLVE**(*specifier*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*specifier*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### Настройка алгоритма разрешения спецификаторов ESM {#customizing-esm-specifier-resolution-algorithm}

[Хуки настройки модулей](/ru/nodejs/api/module#customization-hooks) предоставляют механизм для настройки алгоритма разрешения спецификаторов ESM. Примером, который обеспечивает разрешение в стиле CommonJS для спецификаторов ESM, является [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader).

