---
title: Документация Node.js - Модули
description: Изучите документацию Node.js по модулям, включая CommonJS, ES модули и управление зависимостями и разрешением модулей.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Модули | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Изучите документацию Node.js по модулям, включая CommonJS, ES модули и управление зависимостями и разрешением модулей.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Модули | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Изучите документацию Node.js по модулям, включая CommonJS, ES модули и управление зависимостями и разрешением модулей.
---


# Модули: модули CommonJS {#modules-commonjs-modules}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Модули CommonJS - это оригинальный способ упаковки JavaScript кода для Node.js. Node.js также поддерживает стандарт [модулей ECMAScript](/ru/nodejs/api/esm), используемый браузерами и другими средами выполнения JavaScript.

В Node.js каждый файл рассматривается как отдельный модуль. Например, рассмотрим файл с именем `foo.js`:

```js [ESM]
const circle = require('./circle.js');
console.log(`Площадь круга с радиусом 4 равна ${circle.area(4)}`);
```
В первой строке `foo.js` загружает модуль `circle.js`, который находится в том же каталоге, что и `foo.js`.

Вот содержимое `circle.js`:

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
Модуль `circle.js` экспортировал функции `area()` и `circumference()`. Функции и объекты добавляются в корень модуля путем указания дополнительных свойств для специального объекта `exports`.

Переменные, локальные для модуля, будут приватными, поскольку модуль обернут в функцию Node.js (см. [обертку модуля](/ru/nodejs/api/modules#the-module-wrapper)). В этом примере переменная `PI` является приватной для `circle.js`.

Свойству `module.exports` можно присвоить новое значение (например, функцию или объект).

В следующем коде `bar.js` использует модуль `square`, который экспортирует класс Square:

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`Площадь mySquare равна ${mySquare.area()}`);
```
Модуль `square` определен в `square.js`:

```js [ESM]
// Присвоение exports не изменит модуль, необходимо использовать module.exports
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
Система модулей CommonJS реализована во [встроенном модуле `module`](/ru/nodejs/api/module).

## Включение {#enabling}

Node.js имеет две системы модулей: модули CommonJS и [модули ECMAScript](/ru/nodejs/api/esm).

По умолчанию Node.js будет рассматривать следующее как модули CommonJS:

-  Файлы с расширением `.cjs`;
-  Файлы с расширением `.js`, когда ближайший родительский файл `package.json` содержит поле верхнего уровня [`"type"`](/ru/nodejs/api/packages#type) со значением `"commonjs"`.
-  Файлы с расширением `.js` или без расширения, когда ближайший родительский файл `package.json` не содержит поле верхнего уровня [`"type"`](/ru/nodejs/api/packages#type) или нет `package.json` ни в одной из родительских папок; если файл не содержит синтаксис, который выдает ошибку, если он не оценивается как модуль ES. Авторы пакетов должны включать поле [`"type"`](/ru/nodejs/api/packages#type), даже в пакетах, где все источники являются CommonJS. Явное указание `type` пакета упростит инструментам сборки и загрузчикам определение того, как следует интерпретировать файлы в пакете.
-  Файлы с расширением, отличным от `.mjs`, `.cjs`, `.json`, `.node` или `.js` (когда ближайший родительский файл `package.json` содержит поле верхнего уровня [`"type"`](/ru/nodejs/api/packages#type) со значением `"module"`, эти файлы будут распознаны как модули CommonJS только в том случае, если они включены через `require()`, а не при использовании в качестве точки входа командной строки программы).

Подробнее см. в разделе [Определение системы модулей](/ru/nodejs/api/packages#determining-module-system).

Вызов `require()` всегда использует загрузчик модулей CommonJS. Вызов `import()` всегда использует загрузчик модулей ECMAScript.


## Доступ к основному модулю {#accessing-the-main-module}

Когда файл запускается непосредственно из Node.js, `require.main` устанавливается в его `module`. Это означает, что можно определить, был ли файл запущен напрямую, проверив `require.main === module`.

Для файла `foo.js` это будет `true` при запуске через `node foo.js`, но `false` при запуске через `require('./foo')`.

Когда точка входа не является модулем CommonJS, `require.main` имеет значение `undefined`, и основной модуль становится недоступным.

## Советы для менеджеров пакетов {#package-manager-tips}

Семантика функции `require()` в Node.js была разработана таким образом, чтобы быть достаточно общей для поддержки разумных структур каталогов. Программы управления пакетами, такие как `dpkg`, `rpm` и `npm`, надеемся, сочтут возможным создавать собственные пакеты из модулей Node.js без изменений.

Ниже мы приводим предлагаемую структуру каталогов, которая могла бы работать:

Предположим, что мы хотим, чтобы папка по адресу `/usr/lib/node/\<some-package\>/\<some-version\>` содержала содержимое определенной версии пакета.

Пакеты могут зависеть друг от друга. Чтобы установить пакет `foo`, может потребоваться установить определенную версию пакета `bar`. Пакет `bar` сам может иметь зависимости, и в некоторых случаях они могут даже конфликтовать или образовывать циклические зависимости.

Поскольку Node.js ищет `realpath` всех загружаемых модулей (то есть разрешает символические ссылки), а затем [ищет их зависимости в папках `node_modules`](/ru/nodejs/api/modules#loading-from-node_modules-folders), эту ситуацию можно решить с помощью следующей архитектуры:

- `/usr/lib/node/foo/1.2.3/`: Содержимое пакета `foo`, версия 1.2.3.
- `/usr/lib/node/bar/4.3.2/`: Содержимое пакета `bar`, от которого зависит `foo`.
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: Символическая ссылка на `/usr/lib/node/bar/4.3.2/`.
- `/usr/lib/node/bar/4.3.2/node_modules/*`: Символические ссылки на пакеты, от которых зависит `bar`.

Таким образом, даже если встречается цикл или возникают конфликты зависимостей, каждый модуль сможет получить версию своей зависимости, которую он может использовать.

Когда код в пакете `foo` выполняет `require('bar')`, он получит версию, на которую указывает символическая ссылка в `/usr/lib/node/foo/1.2.3/node_modules/bar`. Затем, когда код в пакете `bar` вызывает `require('quux')`, он получит версию, на которую указывает символическая ссылка в `/usr/lib/node/bar/4.3.2/node_modules/quux`.

Кроме того, чтобы сделать процесс поиска модулей еще более оптимальным, вместо того чтобы помещать пакеты непосредственно в `/usr/lib/node`, мы могли бы поместить их в `/usr/lib/node_modules/\<name\>/\<version\>`. Тогда Node.js не будет беспокоиться о поиске отсутствующих зависимостей в `/usr/node_modules` или `/node_modules`.

Чтобы сделать модули доступными для Node.js REPL, может быть полезно также добавить папку `/usr/lib/node_modules` в переменную окружения `$NODE_PATH`. Поскольку поиск модулей с использованием папок `node_modules` является относительным и основан на реальном пути файлов, вызывающих `require()`, сами пакеты могут находиться где угодно.


## Загрузка модулей ECMAScript с использованием `require()` {#loading-ecmascript-modules-using-require}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.5.0 | Эта функция больше не выдает экспериментальное предупреждение по умолчанию, хотя предупреждение все еще можно вывести с помощью --trace-require-module. |
| v23.0.0 | Эта функция больше не скрыта за флагом CLI `--experimental-require-module`. |
| v23.0.0 | Поддержка экспорта `'module.exports'` для совместимости в `require(esm)`. |
| v22.0.0, v20.17.0 | Добавлено в: v22.0.0, v20.17.0 |
:::

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).2 - Кандидат на выпуск
:::

Расширение `.mjs` зарезервировано для [модулей ECMAScript](/ru/nodejs/api/esm). См. раздел [Определение системы модулей](/ru/nodejs/api/packages#determining-module-system) для получения дополнительной информации о том, какие файлы анализируются как модули ECMAScript.

`require()` поддерживает загрузку только тех модулей ECMAScript, которые соответствуют следующим требованиям:

- Модуль является полностью синхронным (не содержит `await` верхнего уровня); и
- Выполняется одно из следующих условий:

Если загружаемый модуль ES соответствует требованиям, `require()` может загрузить его и вернуть объект пространства имен модуля. В этом случае он похож на динамический `import()`, но запускается синхронно и возвращает объект пространства имен напрямую.

Рассмотрим следующие модули ES:

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
Модуль CommonJS может загрузить их с помощью `require()`:

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```
Для обеспечения совместимости с существующими инструментами, которые преобразуют модули ES в CommonJS, которые затем могут загружать реальные модули ES через `require()`, возвращаемое пространство имен будет содержать свойство `__esModule: true`, если у него есть экспорт `default`, чтобы потребляющий код, сгенерированный инструментами, мог распознавать экспорты default в реальных модулях ES. Если пространство имен уже определяет `__esModule`, это не будет добавлено. Это свойство является экспериментальным и может измениться в будущем. Его следует использовать только инструментам, преобразующим модули ES в модули CommonJS, следуя существующим соглашениям экосистемы. Код, написанный непосредственно в CommonJS, должен избегать зависимости от него.

Когда модуль ES содержит как именованные экспорты, так и экспорт по умолчанию, результатом, возвращаемым `require()`, является объект пространства имен модуля, который помещает экспорт по умолчанию в свойство `.default`, аналогично результатам, возвращаемым `import()`. Чтобы настроить то, что должно быть возвращено непосредственно `require(esm)`, модуль ES может экспортировать желаемое значение, используя строковое имя `"module.exports"`.

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `distance` потеряна для потребителей CommonJS этого модуля, если только она не
// добавлена в `Point` как статическое свойство.
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// Именованные экспорты теряются, когда используется 'module.exports'
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
Обратите внимание, что в приведенном выше примере, когда используется имя экспорта `module.exports`, именованные экспорты будут потеряны для потребителей CommonJS. Чтобы разрешить потребителям CommonJS продолжать доступ к именованным экспортам, модуль может убедиться, что экспорт по умолчанию является объектом с именованными экспортами, прикрепленными к нему как свойства. Например, в приведенном выше примере `distance` может быть прикреплена к экспорту по умолчанию, классу `Point`, как статический метод.

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```
Если модуль, который `require()`'ится, содержит `await` верхнего уровня или граф модулей, который он `import`'ит, содержит `await` верхнего уровня, будет выброшено [`ERR_REQUIRE_ASYNC_MODULE`](/ru/nodejs/api/errors#err_require_async_module). В этом случае пользователям следует загрузить асинхронный модуль с помощью [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

Если `--experimental-print-required-tla` включен, вместо того, чтобы выбрасывать `ERR_REQUIRE_ASYNC_MODULE` перед вычислением, Node.js вычислит модуль, попытается найти ожидание верхнего уровня и распечатает их местоположение, чтобы помочь пользователям исправить их.

Поддержка загрузки модулей ES с помощью `require()` в настоящее время является экспериментальной и может быть отключена с помощью `--no-experimental-require-module`. Чтобы распечатать, где используется эта функция, используйте [`--trace-require-module`](/ru/nodejs/api/cli#--trace-require-modulemode).

Эту функцию можно обнаружить, проверив, является ли [`process.features.require_module`](/ru/nodejs/api/process#processfeaturesrequire_module) `true`.


## Всё вместе {#all-together}

Чтобы получить точное имя файла, которое будет загружено при вызове `require()`, используйте функцию `require.resolve()`.

Соединив все вышесказанное, вот высокоуровневый алгоритм в псевдокоде того, что делает `require()`:

```text [TEXT]
require(X) из модуля по пути Y
1. Если X является основным модулем,
   a. вернуть основной модуль
   b. СТОП
2. Если X начинается с '/'
   a. установить Y как корень файловой системы
3. Если X начинается с './', '/' или '../'
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
   c. ВЫБРОСИТЬ "не найдено"
4. Если X начинается с '#'
   a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. LOAD_NODE_MODULES(X, dirname(Y))
7. ВЫБРОСИТЬ "не найдено"

MAYBE_DETECT_AND_LOAD(X)
1. Если X разбирается как модуль CommonJS, загрузить X как модуль CommonJS. СТОП.
2. Иначе, если исходный код X может быть разобран как модуль ECMAScript с использованием
  <a href="esm.md#resolver-algorithm-specification">DETECT_MODULE_SYNTAX, определенного в
  ESM resolver</a>,
  a. Загрузить X как модуль ECMAScript. СТОП.
3. ВЫБРОСИТЬ SyntaxError из-за попытки разобрать X как CommonJS в 1. СТОП.

LOAD_AS_FILE(X)
1. Если X является файлом, загрузить X как файл формата его расширения. СТОП
2. Если X.js является файлом,
    a. Найти ближайшую область пакета SCOPE к X.
    b. Если область не найдена
      1. MAYBE_DETECT_AND_LOAD(X.js)
    c. Если SCOPE/package.json содержит поле "type",
      1. Если поле "type" имеет значение "module", загрузить X.js как модуль ECMAScript. СТОП.
      2. Если поле "type" имеет значение "commonjs", загрузить X.js как модуль CommonJS. СТОП.
    d. MAYBE_DETECT_AND_LOAD(X.js)
3. Если X.json является файлом, загрузить X.json в объект JavaScript. СТОП
4. Если X.node является файлом, загрузить X.node как бинарный аддон. СТОП

LOAD_INDEX(X)
1. Если X/index.js является файлом
    a. Найти ближайшую область пакета SCOPE к X.
    b. Если область не найдена, загрузить X/index.js как модуль CommonJS. СТОП.
    c. Если SCOPE/package.json содержит поле "type",
      1. Если поле "type" имеет значение "module", загрузить X/index.js как модуль ECMAScript. СТОП.
      2. Иначе, загрузить X/index.js как модуль CommonJS. СТОП.
2. Если X/index.json является файлом, разобрать X/index.json в объект JavaScript. СТОП
3. Если X/index.node является файлом, загрузить X/index.node как бинарный аддон. СТОП

LOAD_AS_DIRECTORY(X)
1. Если X/package.json является файлом,
   a. Разобрать X/package.json и найти поле "main".
   b. Если "main" является ложным значением, перейти к 2.
   c. пусть M = X + (json main field)
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X) УСТАРЕЛО
   g. ВЫБРОСИТЬ "не найдено"
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. пусть DIRS = NODE_MODULES_PATHS(START)
2. для каждого DIR в DIRS:
   a. LOAD_PACKAGE_EXPORTS(X, DIR)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. пусть PARTS = path split(START)
2. пусть I = количество PARTS - 1
3. пусть DIRS = []
4. пока I >= 0,
   a. если PARTS[I] = "node_modules", перейти к d.
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIR + DIRS
   d. пусть I = I - 1
5. вернуть DIRS + GLOBAL_FOLDERS

LOAD_PACKAGE_IMPORTS(X, DIR)
1. Найти ближайшую область пакета SCOPE к DIR.
2. Если область не найдена, вернуть.
3. Если SCOPE/package.json "imports" является null или undefined, вернуть.
4. Если `--experimental-require-module` включен
  a. пусть CONDITIONS = ["node", "require", "module-sync"]
  b. Иначе, пусть CONDITIONS = ["node", "require"]
5. пусть MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">определено в ESM resolver</a>.
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. Попытаться интерпретировать X как комбинацию NAME и SUBPATH, где имя
   может иметь префикс @scope/, а подпуть начинается с косой черты (`/`).
2. Если X не соответствует этому шаблону или DIR/NAME/package.json не является файлом,
   вернуть.
3. Разобрать DIR/NAME/package.json и найти поле "exports".
4. Если "exports" является null или undefined, вернуть.
5. Если `--experimental-require-module` включен
  a. пусть CONDITIONS = ["node", "require", "module-sync"]
  b. Иначе, пусть CONDITIONS = ["node", "require"]
6. пусть MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) <a href="esm.md#resolver-algorithm-specification">определено в ESM resolver</a>.
7. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. Найти ближайшую область пакета SCOPE к DIR.
2. Если область не найдена, вернуть.
3. Если SCOPE/package.json "exports" является null или undefined, вернуть.
4. Если SCOPE/package.json "name" не является первым сегментом X, вернуть.
5. пусть MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">определено в ESM resolver</a>.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. пусть RESOLVED_PATH = fileURLToPath(MATCH)
2. Если файл по адресу RESOLVED_PATH существует, загрузить RESOLVED_PATH как его расширение
   формат. СТОП
3. ВЫБРОСИТЬ "не найдено"
```

## Кэширование {#caching}

Модули кэшируются после первой загрузки. Это означает (среди прочего), что каждый вызов `require('foo')` будет возвращать точно тот же объект, если он разрешается в тот же файл.

При условии, что `require.cache` не изменяется, многократные вызовы `require('foo')` не приведут к многократному выполнению кода модуля. Это важная особенность. Благодаря ей можно возвращать "частично завершенные" объекты, что позволяет загружать транзитивные зависимости даже в случае циклических зависимостей.

Чтобы модуль выполнял код несколько раз, экспортируйте функцию и вызывайте эту функцию.

### Предостережения по поводу кэширования модулей {#module-caching-caveats}

Модули кэшируются на основе их разрешенного имени файла. Поскольку модули могут разрешаться в разные имена файлов в зависимости от местоположения вызывающего модуля (загрузка из папок `node_modules`), нет *гарантии*, что `require('foo')` всегда будет возвращать точно тот же объект, если он разрешается в разные файлы.

Кроме того, в файловых системах или операционных системах, нечувствительных к регистру, разные разрешенные имена файлов могут указывать на один и тот же файл, но кэш все равно будет рассматривать их как разные модули и будет перезагружать файл несколько раз. Например, `require('./foo')` и `require('./FOO')` возвращают два разных объекта, независимо от того, являются ли `./foo` и `./FOO` одним и тем же файлом.

## Встроенные модули {#built-in-modules}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.0.0, v14.18.0 | Добавлена поддержка импорта `node:` в `require(...)`. |
:::

Node.js имеет несколько модулей, скомпилированных в двоичный файл. Эти модули более подробно описаны в другом месте этой документации.

Встроенные модули определены в исходном коде Node.js и находятся в папке `lib/`.

Встроенные модули можно идентифицировать с помощью префикса `node:`, в этом случае он обходит кэш `require`. Например, `require('node:http')` всегда будет возвращать встроенный HTTP-модуль, даже если есть запись `require.cache` с таким именем.

Некоторые встроенные модули всегда загружаются предпочтительно, если их идентификатор передается в `require()`. Например, `require('http')` всегда будет возвращать встроенный HTTP-модуль, даже если есть файл с таким именем. Список встроенных модулей, которые можно загрузить без использования префикса `node:`, представлен в [`module.builtinModules`](/ru/nodejs/api/module#modulebuiltinmodules), перечислены без префикса.


### Встроенные модули с обязательным префиксом `node:` {#built-in-modules-with-mandatory-node-prefix}

При загрузке с помощью `require()` некоторые встроенные модули должны запрашиваться с префиксом `node:`. Это требование существует для предотвращения конфликта между новыми встроенными модулями и пакетами пользовательского пространства, которые уже используют это имя. В настоящее время встроенные модули, требующие префикс `node:`, это:

- [`node:sea`](/ru/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/ru/nodejs/api/sqlite)
- [`node:test`](/ru/nodejs/api/test)
- [`node:test/reporters`](/ru/nodejs/api/test#test-reporters)

Список этих модулей представлен в [`module.builtinModules`](/ru/nodejs/api/module#modulebuiltinmodules), включая префикс.

## Циклы {#cycles}

При наличии циклических вызовов `require()` модуль может не завершить выполнение к моменту его возврата.

Рассмотрим следующую ситуацию:

`a.js`:

```js [ESM]
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');
```
`b.js`:

```js [ESM]
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');
```
`main.js`:

```js [ESM]
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);
```
Когда `main.js` загружает `a.js`, затем `a.js` в свою очередь загружает `b.js`. В этот момент `b.js` пытается загрузить `a.js`. Чтобы предотвратить бесконечный цикл, **незавершенная копия** объекта exports из `a.js` возвращается модулю `b.js`. Затем `b.js` завершает загрузку, и его объект `exports` предоставляется модулю `a.js`.

К моменту, когда `main.js` загрузит оба модуля, они оба будут завершены. Таким образом, вывод этой программы будет следующим:

```bash [BASH]
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true
```
Для правильной работы циклических зависимостей модулей внутри приложения требуется тщательное планирование.


## Файловые модули {#file-modules}

Если точное имя файла не найдено, Node.js попытается загрузить требуемый файл с добавленными расширениями: `.js`, `.json` и, наконец, `.node`. При загрузке файла с другим расширением (например, `.cjs`), его полное имя должно быть передано в `require()`, включая расширение файла (например, `require('./file.cjs')`).

Файлы `.json` анализируются как текстовые файлы JSON, файлы `.node` интерпретируются как скомпилированные модули-дополнения, загружаемые с помощью `process.dlopen()`. Файлы, использующие любое другое расширение (или вообще без расширения), анализируются как текстовые файлы JavaScript. Обратитесь к разделу [Определение системы модулей](/ru/nodejs/api/packages#determining-module-system), чтобы понять, какая цель анализа будет использоваться.

Требуемый модуль с префиксом `'/'` является абсолютным путем к файлу. Например, `require('/home/marco/foo.js')` загрузит файл по адресу `/home/marco/foo.js`.

Требуемый модуль с префиксом `'./'` является относительным по отношению к файлу, вызывающему `require()`. То есть, `circle.js` должен находиться в том же каталоге, что и `foo.js`, чтобы `require('./circle')` мог его найти.

Без префикса `'/'`, `'./'` или `'../'`, указывающего на файл, модуль должен быть либо основным модулем, либо загружен из папки `node_modules`.

Если указанный путь не существует, `require()` выдаст ошибку [`MODULE_NOT_FOUND`](/ru/nodejs/api/errors#module_not_found).

## Папки как модули {#folders-as-modules}

::: info [Stable: 3 - Legacy]
[Stable: 3](/ru/nodejs/api/documentation#stability-index) [Стабильность: 3](/ru/nodejs/api/documentation#stability-index) - Устаревшее: используйте [экспорт подпутей](/ru/nodejs/api/packages#subpath-exports) или [импорт подпутей](/ru/nodejs/api/packages#subpath-imports) вместо этого.
:::

Существует три способа, которыми папка может быть передана в `require()` в качестве аргумента.

Первый — это создать файл [`package.json`](/ru/nodejs/api/packages#nodejs-packagejson-field-definitions) в корне папки, который определяет `main` модуль. Пример файла [`package.json`](/ru/nodejs/api/packages#nodejs-packagejson-field-definitions) может выглядеть так:

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
Если это было в папке `./some-library`, то `require('./some-library')` попытался бы загрузить `./some-library/lib/some-library.js`.

Если в каталоге нет файла [`package.json`](/ru/nodejs/api/packages#nodejs-packagejson-field-definitions), или если запись [`"main"`](/ru/nodejs/api/packages#main) отсутствует или не может быть разрешена, Node.js попытается загрузить файл `index.js` или `index.node` из этого каталога. Например, если в предыдущем примере не было файла [`package.json`](/ru/nodejs/api/packages#nodejs-packagejson-field-definitions), то `require('./some-library')` попытался бы загрузить:

- `./some-library/index.js`
- `./some-library/index.node`

Если эти попытки не удались, Node.js сообщит об отсутствии всего модуля с ошибкой по умолчанию:

```bash [BASH]
Error: Cannot find module 'some-library'
```
Во всех трех вышеуказанных случаях вызов `import('./some-library')` приведет к ошибке [`ERR_UNSUPPORTED_DIR_IMPORT`](/ru/nodejs/api/errors#err_unsupported_dir_import). Использование пакетных [экспортов подпутей](/ru/nodejs/api/packages#subpath-exports) или [импортов подпутей](/ru/nodejs/api/packages#subpath-imports) может обеспечить те же преимущества организации содержимого, что и папки в качестве модулей, и работать как для `require`, так и для `import`.


## Загрузка из папок `node_modules` {#loading-from-node_modules-folders}

Если идентификатор модуля, переданный в `require()`, не является [встроенным](/ru/nodejs/api/modules#built-in-modules) модулем и не начинается с `'/'`, `'../'` или `'./'`, то Node.js начинает с каталога текущего модуля, добавляет `/node_modules` и пытается загрузить модуль из этого места. Node.js не будет добавлять `node_modules` к пути, уже заканчивающемуся на `node_modules`.

Если модуль не найден там, Node.js переходит к родительскому каталогу и так далее, пока не будет достигнут корень файловой системы.

Например, если файл `'/home/ry/projects/foo.js'` вызвал `require('bar.js')`, то Node.js будет искать в следующих местах в этом порядке:

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

Это позволяет программам локализовать свои зависимости, чтобы они не конфликтовали.

Можно потребовать конкретные файлы или подмодули, распространяемые вместе с модулем, включив суффикс пути после имени модуля. Например, `require('example-module/path/to/file')` разрешит `path/to/file` относительно того, где находится `example-module`. Путь с суффиксом следует той же семантике разрешения модуля.

## Загрузка из глобальных папок {#loading-from-the-global-folders}

Если переменная окружения `NODE_PATH` установлена в список абсолютных путей, разделенных двоеточиями, то Node.js будет искать модули по этим путям, если они не будут найдены в другом месте.

В Windows `NODE_PATH` разделяется точками с запятой (`;`) вместо двоеточий.

`NODE_PATH` был первоначально создан для поддержки загрузки модулей из разных путей до того, как был определен текущий алгоритм [разрешения модулей](/ru/nodejs/api/modules#all-together).

`NODE_PATH` по-прежнему поддерживается, но в настоящее время менее необходим, поскольку экосистема Node.js остановилась на соглашении о местонахождении зависимых модулей. Иногда развертывания, которые полагаются на `NODE_PATH`, демонстрируют неожиданное поведение, когда люди не знают, что `NODE_PATH` должен быть установлен. Иногда зависимости модуля изменяются, что приводит к загрузке другой версии (или даже другого модуля), поскольку выполняется поиск по `NODE_PATH`.

Кроме того, Node.js будет искать в следующем списке GLOBAL_FOLDERS:

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

Где `$HOME` - домашний каталог пользователя, а `$PREFIX` - настроенный `node_prefix` Node.js.

Это в основном по историческим причинам.

Настоятельно рекомендуется размещать зависимости в локальной папке `node_modules`. Они будут загружаться быстрее и надежнее.


## Обертка модуля {#the-module-wrapper}

Перед выполнением кода модуля Node.js оборачивает его в функциональную обертку, которая выглядит следующим образом:

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// Здесь фактически находится код модуля
});
```
Благодаря этому Node.js достигает нескольких целей:

- Он поддерживает видимость переменных верхнего уровня (определенных с помощью `var`, `const` или `let`) в пределах модуля, а не глобального объекта.
- Он помогает предоставить некоторые глобально выглядящие переменные, которые на самом деле специфичны для модуля, такие как:
    - Объекты `module` и `exports`, которые разработчик может использовать для экспорта значений из модуля.
    - Удобные переменные `__filename` и `__dirname`, содержащие абсолютное имя файла и путь к каталогу модуля.
  
 

## Область видимости модуля {#the-module-scope}

### `__dirname` {#__dirname}

**Добавлено в: v0.1.27**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Имя каталога текущего модуля. Это то же самое, что и [`path.dirname()`](/ru/nodejs/api/path#pathdirnamepath) из [`__filename`](/ru/nodejs/api/modules#__filename).

Пример: запуск `node example.js` из `/Users/mjr`

```js [ESM]
console.log(__dirname);
// Выводит: /Users/mjr
console.log(path.dirname(__filename));
// Выводит: /Users/mjr
```
### `__filename` {#__filename}

**Добавлено в: v0.0.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Имя файла текущего модуля. Это абсолютный путь к текущему файлу модуля с разрешенными символическими ссылками.

Для основной программы это не обязательно то же самое имя файла, которое использовалось в командной строке.

См. [`__dirname`](/ru/nodejs/api/modules#__dirname) для получения имени каталога текущего модуля.

Примеры:

Запуск `node example.js` из `/Users/mjr`

```js [ESM]
console.log(__filename);
// Выводит: /Users/mjr/example.js
console.log(__dirname);
// Выводит: /Users/mjr
```
Даны два модуля: `a` и `b`, где `b` является зависимостью `a`, и существует следующая структура каталогов:

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

Ссылки на `__filename` внутри `b.js` вернут `/Users/mjr/app/node_modules/b/b.js`, в то время как ссылки на `__filename` внутри `a.js` вернут `/Users/mjr/app/a.js`.


### `exports` {#exports}

**Добавлено в версии: v0.1.12**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ссылка на `module.exports`, которую короче набирать. Подробнее о том, когда использовать `exports`, а когда `module.exports`, см. в разделе о [ярлыке exports](/ru/nodejs/api/modules#exports-shortcut).

### `module` {#module}

**Добавлено в версии: v0.1.16**

- [\<module\>](/ru/nodejs/api/modules#the-module-object)

Ссылка на текущий модуль, см. раздел об [объекте `module`](/ru/nodejs/api/modules#the-module-object). В частности, `module.exports` используется для определения того, что модуль экспортирует и делает доступным через `require()`.

### `require(id)` {#requireid}

**Добавлено в версии: v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) имя или путь модуля
- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) экспортированное содержимое модуля

Используется для импорта модулей, `JSON` и локальных файлов. Модули можно импортировать из `node_modules`. Локальные модули и JSON-файлы можно импортировать, используя относительный путь (например, `./`, `./foo`, `./bar/baz`, `../foo`), который будет разрешен относительно каталога, указанного в [`__dirname`](/ru/nodejs/api/modules#__dirname) (если определен) или текущего рабочего каталога. Относительные пути в стиле POSIX разрешаются независимо от операционной системы, что означает, что приведенные выше примеры будут работать в Windows так же, как и в Unix.

```js [ESM]
// Импорт локального модуля с путем, относительным к `__dirname` или текущему
// рабочему каталогу. (В Windows это будет разрешено в .\path\myLocalModule.)
const myLocalModule = require('./path/myLocalModule');

// Импорт JSON-файла:
const jsonData = require('./path/filename.json');

// Импорт модуля из node_modules или встроенного модуля Node.js:
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**Добавлено в версии: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Модули кэшируются в этом объекте при их запросе. При удалении значения ключа из этого объекта следующий `require` перезагрузит модуль. Это не относится к [нативным аддонам](/ru/nodejs/api/addons), для которых перезагрузка приведет к ошибке.

Добавление или замена записей также возможны. Этот кеш проверяется перед встроенными модулями, и если имя, совпадающее со встроенным модулем, добавляется в кеш, только вызовы `require` с префиксом `node:` будут получать встроенный модуль. Используйте с осторожностью!

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**Добавлено в версии: v0.3.0**

**Устарело с версии: v0.10.6**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Указывает `require`, как обрабатывать определенные расширения файлов.

Обрабатывает файлы с расширением `.sjs` как `.js`:

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**Устарело.** В прошлом этот список использовался для загрузки модулей, отличных от JavaScript, в Node.js путем их компиляции по требованию. Однако на практике существуют гораздо лучшие способы сделать это, например, загрузка модулей через другую программу Node.js или предварительная компиляция их в JavaScript.

Избегайте использования `require.extensions`. Использование может привести к трудноуловимым ошибкам, и разрешение расширений замедляется с каждым зарегистрированным расширением.

#### `require.main` {#requiremain}

**Добавлено в версии: v0.1.17**

- [\<module\>](/ru/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Объект `Module`, представляющий скрипт входа, загруженный при запуске процесса Node.js, или `undefined`, если точка входа программы не является модулем CommonJS. См. ["Доступ к главному модулю"](/ru/nodejs/api/modules#accessing-the-main-module).

В скрипте `entry.js`:

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v8.9.0 | Теперь поддерживается опция `paths`. |
| v0.3.0 | Добавлено в версии: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь к модулю для разрешения.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Пути для разрешения местоположения модуля. Если присутствует, эти пути используются вместо путей разрешения по умолчанию, за исключением [GLOBAL_FOLDERS](/ru/nodejs/api/modules#loading-from-the-global-folders), таких как `$HOME/.node_modules`, которые всегда включены. Каждый из этих путей используется в качестве отправной точки для алгоритма разрешения модуля, что означает, что иерархия `node_modules` проверяется из этого местоположения.

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Используйте внутренний механизм `require()`, чтобы найти местоположение модуля, но вместо загрузки модуля просто верните разрешенное имя файла.

Если модуль не может быть найден, выдается ошибка `MODULE_NOT_FOUND`.


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**Добавлено в версии: v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь к модулю, для которого извлекаются пути поиска.
- Возвращает: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Возвращает массив, содержащий пути, по которым производился поиск во время разрешения `request`, или `null`, если строка `request` ссылается на основной модуль, например `http` или `fs`.

## Объект `module` {#the-module-object}

**Добавлено в версии: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

В каждом модуле свободная переменная `module` является ссылкой на объект, представляющий текущий модуль. Для удобства `module.exports` также доступен через модуль-глобальный `exports`. `module` на самом деле не глобальный, а локальный для каждого модуля.

### `module.children` {#modulechildren}

**Добавлено в версии: v0.1.16**

- [\<module[]\>](/ru/nodejs/api/modules#the-module-object)

Объекты модулей, впервые требуемые этим модулем.

### `module.exports` {#moduleexports}

**Добавлено в версии: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Объект `module.exports` создается системой `Module`. Иногда это неприемлемо; многие хотят, чтобы их модуль был экземпляром некоторого класса. Для этого назначьте желаемый объект экспорта в `module.exports`. Присваивание желаемого объекта в `exports` просто переопределит локальную переменную `exports`, что, вероятно, не то, что нужно.

Например, предположим, что мы делаем модуль под названием `a.js`:

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// Do some work, and after some time emit
// the 'ready' event from the module itself.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
Тогда в другом файле мы можем сделать:

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
```
Присваивание `module.exports` должно быть выполнено немедленно. Это нельзя делать ни в каких обратных вызовах. Это не работает:

`x.js`:

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js`:

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### Ярлык `exports` {#exports-shortcut}

**Добавлено в версии: v0.1.16**

Переменная `exports` доступна в области видимости файла модуля и ей присваивается значение `module.exports` до вычисления модуля.

Это позволяет использовать ярлык, так что `module.exports.f = ...` можно записать более кратко как `exports.f = ...`. Однако следует помнить, что, как и любой переменной, если `exports` присваивается новое значение, она больше не связана с `module.exports`:

```js [ESM]
module.exports.hello = true; // Экспортировано из require модуля
exports = { hello: false };  // Не экспортировано, доступно только в модуле
```
Когда свойство `module.exports` полностью заменяется новым объектом, обычно также переназначают `exports`:

```js [ESM]
module.exports = exports = function Constructor() {
  // ... и т.д.
};
```
Чтобы проиллюстрировать поведение, представьте себе эту гипотетическую реализацию `require()`, которая довольно похожа на то, что на самом деле делает `require()`:

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // Код модуля здесь. В этом примере определим функцию.
    function someFunc() {}
    exports = someFunc;
    // На этом этапе exports больше не является ярлыком для module.exports, и
    // этот модуль все равно будет экспортировать пустой объект по умолчанию.
    module.exports = someFunc;
    // На этом этапе модуль теперь будет экспортировать someFunc, вместо
    // объекта по умолчанию.
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**Добавлено в версии: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Полностью разрешенное имя файла модуля.

### `module.id` {#moduleid}

**Добавлено в версии: v0.1.16**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Идентификатор модуля. Обычно это полностью разрешенное имя файла.

### `module.isPreloading` {#moduleispreloading}

**Добавлено в версии: v15.4.0, v14.17.0**

- Тип: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если модуль выполняется во время фазы предварительной загрузки Node.js.


### `module.loaded` {#moduleloaded}

**Добавлено в версии: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Указывает, завершена ли загрузка модуля, или находится ли он в процессе загрузки.

### `module.parent` {#moduleparent}

**Добавлено в версии: v0.1.16**

**Устарело начиная с версии: v14.6.0, v12.19.0**

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Пожалуйста, используйте [`require.main`](/ru/nodejs/api/modules#requiremain) и [`module.children`](/ru/nodejs/api/modules#modulechildren) вместо этого.
:::

- [\<module\>](/ru/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Модуль, который первым потребовал этот, или `null`, если текущий модуль является точкой входа текущего процесса, или `undefined`, если модуль был загружен чем-то, что не является модулем CommonJS (например: REPL или `import`).

### `module.path` {#modulepath}

**Добавлено в версии: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Имя каталога модуля. Обычно совпадает с [`path.dirname()`](/ru/nodejs/api/path#pathdirnamepath) из [`module.id`](/ru/nodejs/api/modules#moduleid).

### `module.paths` {#modulepaths}

**Добавлено в версии: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Пути поиска для модуля.

### `module.require(id)` {#modulerequireid}

**Добавлено в версии: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) экспортируемое содержимое модуля

Метод `module.require()` предоставляет способ загрузки модуля, как если бы `require()` был вызван из исходного модуля.

Чтобы это сделать, необходимо получить ссылку на объект `module`. Поскольку `require()` возвращает `module.exports`, а `module` обычно *доступен только* в коде конкретного модуля, его необходимо явно экспортировать, чтобы использовать.


## Объект `Module` {#the-module-object_1}

Этот раздел был перемещён в [Модули: Основной модуль `module`](/ru/nodejs/api/module#the-module-object).

- [`module.builtinModules`](/ru/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/ru/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/ru/nodejs/api/module#modulesyncbuiltinesmexports)

## Поддержка source map v3 {#source-map-v3-support}

Этот раздел был перемещён в [Модули: Основной модуль `module`](/ru/nodejs/api/module#source-map-v3-support).

- [`module.findSourceMap(path)`](/ru/nodejs/api/module#modulefindsourcemappath)
- [Класс: `module.SourceMap`](/ru/nodejs/api/module#class-modulesourcemap)
    - [`new SourceMap(payload)`](/ru/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/ru/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/ru/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

