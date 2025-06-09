---
title: Документация модуля Path в Node.js
description: Модуль Path в Node.js предоставляет утилиты для работы с путями файлов и директорий. Он предлагает методы для обработки и преобразования путей файлов независимо от платформы, включая нормализацию пути, объединение путей, разрешение путей и анализ путей.
head:
  - - meta
    - name: og:title
      content: Документация модуля Path в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Модуль Path в Node.js предоставляет утилиты для работы с путями файлов и директорий. Он предлагает методы для обработки и преобразования путей файлов независимо от платформы, включая нормализацию пути, объединение путей, разрешение путей и анализ путей.
  - - meta
    - name: twitter:title
      content: Документация модуля Path в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Модуль Path в Node.js предоставляет утилиты для работы с путями файлов и директорий. Он предлагает методы для обработки и преобразования путей файлов независимо от платформы, включая нормализацию пути, объединение путей, разрешение путей и анализ путей.
---


# Path {#path}

::: tip [Стабильно: 2 - Стабильно]
[Стабильно: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

**Исходный код:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

Модуль `node:path` предоставляет утилиты для работы с путями к файлам и каталогам. Он доступен с помощью:

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows против POSIX {#windows-vs-posix}

Поведение модуля `node:path` по умолчанию зависит от операционной системы, в которой запущено приложение Node.js. В частности, при работе в операционной системе Windows модуль `node:path` будет предполагать, что используются пути в стиле Windows.

Поэтому использование `path.basename()` может давать разные результаты в POSIX и Windows:

В POSIX:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Возвращает: 'C:\\temp\\myfile.html'
```
В Windows:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Возвращает: 'myfile.html'
```
Чтобы добиться согласованных результатов при работе с файловыми путями Windows в любой операционной системе, используйте [`path.win32`](/ru/nodejs/api/path#pathwin32):

В POSIX и Windows:

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// Возвращает: 'myfile.html'
```
Чтобы добиться согласованных результатов при работе с файловыми путями POSIX в любой операционной системе, используйте [`path.posix`](/ru/nodejs/api/path#pathposix):

В POSIX и Windows:

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// Возвращает: 'myfile.html'
```
В Windows Node.js следует концепции рабочего каталога для каждого диска. Это поведение можно наблюдать при использовании пути к диску без обратной косой черты. Например, `path.resolve('C:\\')` потенциально может вернуть результат, отличный от `path.resolve('C:')`. Для получения дополнительной информации см. [эту страницу MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Передача не-строки в качестве аргумента `path` теперь будет вызывать ошибку. |
| v0.1.25 | Добавлено в: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательный суффикс для удаления
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `path.basename()` возвращает последнюю часть `path`, аналогично команде Unix `basename`. Завершающие [разделители каталогов](/ru/nodejs/api/path#pathsep) игнорируются.

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// Возвращает: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Возвращает: 'quux'
```
Хотя Windows обычно обрабатывает имена файлов, включая расширения файлов, без учета регистра, эта функция этого не делает. Например, `C:\\foo.html` и `C:\\foo.HTML` относятся к одному и тому же файлу, но `basename` рассматривает расширение как строку с учетом регистра:

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// Возвращает: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Возвращает: 'foo.HTML'
```
Ошибка [`TypeError`](/ru/nodejs/api/errors#class-typeerror) возникает, если `path` не является строкой или если `suffix` задан и не является строкой.


## `path.delimiter` {#pathdelimiter}

**Добавлено в версии: v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Предоставляет разделитель пути, специфичный для платформы:

- `;` для Windows
- `:` для POSIX

Например, в POSIX:

```js [ESM]
console.log(process.env.PATH);
// Выводит: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Возвращает: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
В Windows:

```js [ESM]
console.log(process.env.PATH);
// Выводит: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Возвращает ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Передача нестрокового значения в качестве аргумента `path` теперь вызовет ошибку. |
| v0.1.16 | Добавлено в версии: v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `path.dirname()` возвращает имя каталога для `path`, аналогично команде Unix `dirname`. Завершающие разделители каталогов игнорируются, см. [`path.sep`](/ru/nodejs/api/path#pathsep).

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// Возвращает: '/foo/bar/baz/asdf'
```
[`TypeError`](/ru/nodejs/api/errors#class-typeerror) возникает, если `path` не является строкой.

## `path.extname(path)` {#pathextnamepath}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.0.0 | Передача нестрокового значения в качестве аргумента `path` теперь вызовет ошибку. |
| v0.1.25 | Добавлено в версии: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `path.extname()` возвращает расширение `path`, начиная с последнего вхождения символа `.` (точка) до конца строки в последней части `path`. Если в последней части `path` нет символа `.`, или если нет символов `.`, отличных от первого символа базового имени `path` (см. `path.basename()`), возвращается пустая строка.

```js [ESM]
path.extname('index.html');
// Возвращает: '.html'

path.extname('index.coffee.md');
// Возвращает: '.md'

path.extname('index.');
// Возвращает: '.'

path.extname('index');
// Возвращает: ''

path.extname('.index');
// Возвращает: ''

path.extname('.index.md');
// Возвращает: '.md'
```
[`TypeError`](/ru/nodejs/api/errors#class-typeerror) возникает, если `path` не является строкой.


## `path.format(pathObject)` {#pathformatpathobject}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.0.0 | Точка будет добавлена, если она не указана в `ext`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- `pathObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Любой объект JavaScript, имеющий следующие свойства:
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `path.format()` возвращает строку пути из объекта. Это противоположность [`path.parse()`](/ru/nodejs/api/path#pathparsepath).

При предоставлении свойств `pathObject` помните, что существуют комбинации, в которых одно свойство имеет приоритет над другим:

- `pathObject.root` игнорируется, если предоставлен `pathObject.dir`
- `pathObject.ext` и `pathObject.name` игнорируются, если существует `pathObject.base`

Например, в POSIX:

```js [ESM]
// Если предоставлены `dir`, `root` и `base`,
// будет возвращено `${dir}${path.sep}${base}`. `root` игнорируется.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Возвращает: '/home/user/dir/file.txt'

// `root` будет использоваться, если `dir` не указан.
// Если указан только `root` или `dir` равен `root`, то
// разделитель платформы не будет включен. `ext` будет игнорироваться.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Возвращает: '/file.txt'

// `name` + `ext` будут использоваться, если `base` не указан.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Возвращает: '/file.txt'

// Точка будет добавлена, если она не указана в `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Возвращает: '/file.txt'
```
В Windows:

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// Возвращает: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**Added in: v22.5.0, v20.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальный
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Путь для сопоставления с шаблоном glob.
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Шаблон glob для проверки пути.
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Указывает, соответствует ли `path` `pattern`.

Метод `path.matchesGlob()` определяет, соответствует ли `path` шаблону `pattern`.

Например:

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
Если `path` или `pattern` не являются строками, выбрасывается [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

## `path.isAbsolute(path)` {#pathisabsolutepath}

**Added in: v0.11.2**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Метод `path.isAbsolute()` определяет, является ли `path` абсолютным путем.

Если заданный `path` является строкой нулевой длины, будет возвращено значение `false`.

Например, в POSIX:

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
В Windows:

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
Если `path` не является строкой, выбрасывается [`TypeError`](/ru/nodejs/api/errors#class-typeerror).

## `path.join([...paths])` {#pathjoinpaths}

**Added in: v0.1.16**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Последовательность сегментов пути
- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `path.join()` объединяет все заданные сегменты `path` вместе, используя разделитель, специфичный для платформы, в качестве разделителя, а затем нормализует полученный путь.

Сегменты `path` нулевой длины игнорируются. Если объединенная строка пути является строкой нулевой длины, то будет возвращено `'.'`, представляющее текущий рабочий каталог.

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Returns: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Throws 'TypeError: Path must be a string. Received {}'
```
Если какой-либо из сегментов пути не является строкой, выбрасывается [`TypeError`](/ru/nodejs/api/errors#class-typeerror).


## `path.normalize(path)` {#pathnormalizepath}

**Добавлено в: v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `path.normalize()` нормализует указанный `path`, разрешая сегменты `'..'` и `'.'`.

Когда обнаруживается несколько последовательных символов разделения сегментов пути (например, `/` в POSIX и `\` или `/` в Windows), они заменяются одним экземпляром разделителя сегментов пути, специфичного для платформы (`/` в POSIX и `\` в Windows). Завершающие разделители сохраняются.

Если `path` — строка нулевой длины, возвращается `'.'`, представляющая текущий рабочий каталог.

В POSIX типы нормализации, применяемые этой функцией, не строго соответствуют спецификации POSIX. Например, эта функция заменит две ведущие косые черты одной косой чертой, как если бы это был обычный абсолютный путь, тогда как некоторые системы POSIX присваивают особое значение путям, начинающимся ровно с двух косых черт. Аналогично, другие подстановки, выполняемые этой функцией, такие как удаление сегментов `..`, могут изменить способ, которым базовая система разрешает путь.

Например, в POSIX:

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// Возвращает: '/foo/bar/baz/asdf'
```
В Windows:

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Возвращает: 'C:\\temp\\foo\\'
```
Поскольку Windows распознает несколько разделителей путей, оба разделителя будут заменены экземплярами предпочтительного разделителя Windows (`\`):

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Возвращает: 'C:\\temp\\foo\\bar'
```
[`TypeError`](/ru/nodejs/api/errors#class-typeerror) возникает, если `path` не является строкой.

## `path.parse(path)` {#pathparsepath}

**Добавлено в: v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Метод `path.parse()` возвращает объект, чьи свойства представляют значимые элементы `path`. Завершающие разделители каталогов игнорируются, см. [`path.sep`](/ru/nodejs/api/path#pathsep).

Возвращаемый объект будет иметь следующие свойства:

- `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Например, в POSIX:

```js [ESM]
path.parse('/home/user/dir/file.txt');
// Возвращает:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(Все пробелы в строке "" следует игнорировать. Они предназначены исключительно для форматирования.)
```
В Windows:

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// Возвращает:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(Все пробелы в строке "" следует игнорировать. Они предназначены исключительно для форматирования.)
```
[`TypeError`](/ru/nodejs/api/errors#class-typeerror) возникает, если `path` не является строкой.


## `path.posix` {#pathposix}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.3.0 | Доступно как `require('path/posix')`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Свойство `path.posix` предоставляет доступ к POSIX-специфичным реализациям методов `path`.

API доступен через `require('node:path').posix` или `require('node:path/posix')`.

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v6.8.0 | В Windows, начальные слеши для UNC-путей теперь включены в возвращаемое значение. |
| v0.5.0 | Добавлено в: v0.5.0 |
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `path.relative()` возвращает относительный путь от `from` к `to` на основе текущего рабочего каталога. Если `from` и `to` разрешаются в один и тот же путь (после вызова `path.resolve()` для каждого), возвращается строка нулевой длины.

Если строка нулевой длины передается как `from` или `to`, текущий рабочий каталог будет использоваться вместо строк нулевой длины.

Например, в POSIX:

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Возвращает: '../../impl/bbb'
```

В Windows:

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Возвращает: '..\\..\\impl\\bbb'
```

Ошибка [`TypeError`](/ru/nodejs/api/errors#class-typeerror) возникает, если `from` или `to` не являются строками.

## `path.resolve([...paths])` {#pathresolvepaths}

**Добавлено в: v0.3.4**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Последовательность путей или сегментов пути
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Метод `path.resolve()` преобразует последовательность путей или сегментов пути в абсолютный путь.

Заданная последовательность путей обрабатывается справа налево, с добавлением каждого последующего `path` до тех пор, пока не будет создан абсолютный путь. Например, для последовательности сегментов пути: `/foo`, `/bar`, `baz`, вызов `path.resolve('/foo', '/bar', 'baz')` вернет `/bar/baz`, потому что `'baz'` не является абсолютным путем, но `'/bar' + '/' + 'baz'` является.

Если после обработки всех заданных сегментов `path` абсолютный путь еще не был создан, используется текущий рабочий каталог.

Полученный путь нормализуется, а завершающие слеши удаляются, если путь не разрешается в корневой каталог.

Сегменты `path` нулевой длины игнорируются.

Если сегменты `path` не переданы, `path.resolve()` вернет абсолютный путь текущего рабочего каталога.

```js [ESM]
path.resolve('/foo/bar', './baz');
// Возвращает: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Возвращает: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// Если текущий рабочий каталог /home/myself/node,
// это вернет '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

Ошибка [`TypeError`](/ru/nodejs/api/errors#class-typeerror) возникает, если какой-либо из аргументов не является строкой.


## `path.sep` {#pathsep}

**Добавлено в: v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Предоставляет специфичный для платформы разделитель сегментов пути:

- `\` в Windows
- `/` в POSIX

Например, в POSIX:

```js [ESM]
'foo/bar/baz'.split(path.sep);
// Вернет: ['foo', 'bar', 'baz']
```
В Windows:

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// Вернет: ['foo', 'bar', 'baz']
```
В Windows, как прямой слеш (`/`), так и обратный слеш (`\`) принимаются в качестве разделителей сегментов пути; однако, методы `path` добавляют только обратные слеши (`\`).

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**Добавлено в: v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Только в системах Windows возвращает эквивалентный [путь с префиксом пространства имен](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces) для заданного `path`. Если `path` не является строкой, `path` будет возвращен без изменений.

Этот метод имеет смысл только в системах Windows. В системах POSIX метод не работает и всегда возвращает `path` без изменений.

## `path.win32` {#pathwin32}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.3.0 | Предоставляется как `require('path/win32')`. |
| v0.11.15 | Добавлено в: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Свойство `path.win32` предоставляет доступ к специфичным для Windows реализациям методов `path`.

API доступен через `require('node:path').win32` или `require('node:path/win32')`.

